import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config, paths } from './config.js';
import { synthesize } from './azure.js';
import { planStory } from './text.js';
import { buildChunkSsml } from './ssml.js';
import { concatMp3, buildM4b, makeSilence, durationSeconds, formatDuration } from './audio.js';
import { saveJob, loadJob } from './store.js';

/* ------------------------------------------------------------------ *
 * The render loop.
 *
 * A 10k-word story is ~35 Azure requests. Three things make that survivable:
 *   - every chunk is cached on disk by content hash, so a failed or cancelled
 *     render resumes instead of re-paying for work already done
 *   - a small concurrency pool keeps wall-clock down without tripping 429s
 *   - chunks are written per chapter, so output survives a partial failure
 * ------------------------------------------------------------------ */

const running = new Map(); // jobId -> { controller }

export function isRunning(id) {
  return running.has(id);
}

export function cancelJob(id) {
  const entry = running.get(id);
  if (!entry) return false;
  entry.controller.abort();
  return true;
}

function chunkHash({ ssml, outputFormat }) {
  return crypto.createHash('sha256').update(`${outputFormat} ${ssml}`).digest('hex');
}

export function estimateCost(chars, voiceKind) {
  const c = config();
  const perMillion = voiceKind === 'personal' ? c.usdPerMillionPersonal : c.usdPerMillionNeural;
  const usd = (chars / 1_000_000) * perMillion;
  return {
    chars,
    usdPerMillion: perMillion,
    usd: Math.round(usd * 100) / 100,
    gbp: Math.round(usd * c.usdToGbp * 100) / 100,
  };
}

/** Normalise whatever the UI sent into the option shape the renderer wants. */
export function normaliseOptions(options = {}, voice = {}) {
  return {
    locale: options.locale || voice.locale || 'en-GB',
    rate: options.rate || '',
    pitch: options.pitch || '',
    style: options.style || '',
    paragraphPauseMs: Number(options.paragraphPauseMs ?? 550),
    scenePauseMs: Number(options.scenePauseMs ?? 1400),
    headingPauseMs: Number(options.headingPauseMs ?? 1100),
    readChapterTitles: options.readChapterTitles !== false,
    skipFrontMatter: options.skipFrontMatter !== false,
    emphasis: options.emphasis !== false,
    multiVoice: options.multiVoice === true,
    lexicon: options.lexicon && typeof options.lexicon === 'object' ? options.lexicon : {},
    characterVoices: Array.isArray(options.characterVoices) ? options.characterVoices : [],
    makeM4b: options.makeM4b !== false,
  };
}

/**
 * Expand the user's per-character assignments into a lookup keyed by every
 * spelling of the name. The detector reports "Katherine" and "Katherine
 * Bellamy" separately; both must land on the same voice.
 */
function characterVoiceMap(characterVoices) {
  const map = {};
  for (const entry of characterVoices) {
    if (!entry?.voice?.id) continue;
    for (const key of [entry.name, ...(entry.aliases || [])]) {
      if (key) map[key] = entry.voice;
    }
  }
  return map;
}

export async function createJob({ text, storyTitle, voice, sourceLabel, options = {} }) {
  const c = config();
  const opts = normaliseOptions(options, voice);
  const plan = planStory(text, {
    maxChunkChars: c.maxChunkChars,
    skipFrontMatter: opts.skipFrontMatter,
  });
  const id = `job_${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14)}_${crypto.randomBytes(3).toString('hex')}`;

  const job = {
    id,
    status: 'queued',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    sourceLabel: sourceLabel || 'pasted text',
    title: storyTitle || plan.title || 'Untitled story',
    voice: {
      id: voice.id,
      kind: voice.kind,
      label: voice.label || voice.name || voice.id,
      speakerProfileId: voice.speakerProfileId || null,
      baseModel: voice.baseModel || null,
      locale: voice.locale || opts.locale,
    },
    options: opts,
    totals: plan.totals,
    estimate: estimateCost(plan.totals.chars, voice.kind),
    progress: { done: 0, total: plan.totals.chunks, cachedHits: 0, failed: 0 },
    chapters: plan.chapters
      .filter((ch) => !ch.skipped)
      .map((ch, position) => ({
        index: ch.index,
        position,
        title: ch.title,
        titled: ch.titled,
        chunks: ch.chunks.length,
        chars: ch.chars,
        words: ch.words,
        status: 'pending',
      })),
    outputs: {},
    error: null,
  };

  // The story text itself stays on disk next to the job, never in the record.
  const dir = path.join(paths.output, id);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(path.join(dir, 'source.md'), text, 'utf8');

  await saveJob(job);
  return job;
}

async function cachedOrSynthesize({ ssml, signal, onCacheHit }) {
  const c = config();
  const hash = chunkHash({ ssml, outputFormat: c.outputFormat });
  const cachePath = path.join(paths.cache, `${hash}.mp3`);
  if (process.env.NARRATOR_DEBUG) {
    console.log(`[chunk] ${hash.slice(0, 12)} ${ssml.length} chars`);
  }

  try {
    const stat = await fs.stat(cachePath);
    if (stat.size > 0) {
      onCacheHit?.();
      return cachePath;
    }
  } catch {
    /* cache miss - synthesize below */
  }

  const audio = await synthesize(ssml, { signal });
  await fs.mkdir(paths.cache, { recursive: true });
  const tmp = `${cachePath}.tmp`;
  await fs.writeFile(tmp, audio);
  await fs.rename(tmp, cachePath);
  return cachePath;
}

/** Run `limit` tasks at a time, stopping early if the job is aborted. */
async function pool(tasks, limit, signal) {
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, tasks.length)) }, async () => {
    for (;;) {
      if (signal.aborted) return;
      const i = cursor++;
      if (i >= tasks.length) return;
      await tasks[i]();
    }
  });
  await Promise.all(workers);
}

/**
 * Build every chunk's SSML up front, in reading order.
 *
 * This cannot happen inside the concurrency pool: quote state and the current
 * speaker thread from one chunk to the next, so the documents must be composed
 * sequentially even though they are then synthesized in parallel.
 */
export function composeSsml(plan, job) {
  const voices = {
    narrator: job.voice,
    byCharacter: characterVoiceMap(job.options.characterVoices),
  };
  const baseModel = config().personalVoiceBaseModel;
  const out = [];

  for (const ch of plan.chapters.filter((x) => !x.skipped)) {
    // Quote state resets at a chapter boundary; speech never runs across one.
    let state = { inQuote: false, lastSpeaker: null };
    const chunks = [];
    for (const chunk of ch.chunks) {
      const blocks = job.options.readChapterTitles
        ? chunk.blocks
        : chunk.blocks.filter((b) => b.type !== 'heading');
      if (!blocks.length) continue;

      const built = buildChunkSsml({
        chunk: { ...chunk, blocks },
        voices,
        options: { ...job.options, baseModel },
        state,
      });
      state = built.state;
      chunks.push(built.ssml);
    }
    out.push({ chapter: ch, ssml: chunks });
  }
  return out;
}

export async function runJob(id) {
  if (running.has(id)) return loadJob(id);

  const job = await loadJob(id);
  if (!job) throw new Error(`No such job: ${id}`);

  const controller = new AbortController();
  running.set(id, { controller });

  const c = config();
  const dir = path.join(paths.output, id);
  const chaptersDir = path.join(dir, 'chapters');
  const started = Date.now();

  const touch = async (patch) => {
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    await saveJob(job);
  };

  try {
    await fs.mkdir(chaptersDir, { recursive: true });
    await touch({ status: 'running', error: null, startedAt: new Date().toISOString() });

    const text = await fs.readFile(path.join(dir, 'source.md'), 'utf8');
    const plan = planStory(text, {
      maxChunkChars: c.maxChunkChars,
      skipFrontMatter: job.options.skipFrontMatter,
    });

    const composed = composeSsml(plan, job);
    const results = composed.map((entry) => new Array(entry.ssml.length));

    const tasks = [];
    composed.forEach((entry, chapterPos) => {
      entry.ssml.forEach((ssml, chunkPos) => {
        tasks.push(async () => {
          const file = await cachedOrSynthesize({
            ssml,
            signal: controller.signal,
            onCacheHit: () => {
              job.progress.cachedHits += 1;
            },
          });
          results[chapterPos][chunkPos] = file;
          job.progress.done += 1;
          saveJob(job).catch(() => {});
        });
      });
    });

    job.progress.total = tasks.length;
    await touch({});

    await pool(tasks, c.concurrency, controller.signal);

    if (controller.signal.aborted) {
      await touch({ status: 'cancelled' });
      return job;
    }

    // ---- assemble ----
    await touch({ status: 'assembling' });

    const chapterFiles = [];
    const chapterMeta = [];
    for (let i = 0; i < composed.length; i++) {
      const files = results[i].filter(Boolean);
      if (!files.length) continue;
      const ch = composed[i].chapter;
      // Number by reading position, not source index - skipped front matter
      // must not leave a gap that makes the first chapter file "02".
      const n = String(chapterFiles.length + 1).padStart(2, '0');
      const out = path.join(chaptersDir, `${n}-${slug(ch.title)}.mp3`);
      await concatMp3(files, out, { workDir: dir });
      chapterFiles.push(out);
      chapterMeta.push({ title: ch.title, file: path.basename(out) });
      const jc = job.chapters.find((x) => x.index === ch.index);
      if (jc) jc.status = 'done';
      await saveJob(job);
    }

    if (!chapterFiles.length) {
      throw new Error('Nothing was synthesized - the story text appears to be empty.');
    }

    const silence = path.join(paths.cache, 'silence-1200.mp3');
    try {
      await fs.access(silence);
    } catch {
      await makeSilence(silence, 1.2);
    }

    const interleaved = [];
    chapterFiles.forEach((f, i) => {
      if (i > 0) interleaved.push(silence);
      interleaved.push(f);
    });

    const fullMp3 = path.join(dir, `${slug(job.title)}.mp3`);
    await concatMp3(interleaved, fullMp3, { workDir: dir });

    const outputs = { mp3: path.basename(fullMp3), chapters: chapterMeta };

    if (job.options.makeM4b) {
      try {
        const m4b = path.join(dir, `${slug(job.title)}.m4b`);
        await buildM4b({
          chapterFiles,
          chapters: chapterMeta,
          outFile: m4b,
          meta: { title: job.title, artist: job.voice.label, album: job.title },
          workDir: dir,
        });
        outputs.m4b = path.basename(m4b);
        await fs.rm(path.join(dir, 'chapters.ffmeta'), { force: true });
      } catch (e) {
        // An m4b failure must not lose a finished mp3.
        job.warnings = [...(job.warnings || []), `m4b build failed: ${e.message}`];
      }
    }

    const seconds = await durationSeconds(fullMp3);
    const paidChars = Math.round(
      job.totals.chars * (1 - job.progress.cachedHits / Math.max(1, job.progress.total))
    );
    await touch({
      status: 'done',
      outputs,
      finishedAt: new Date().toISOString(),
      durationSeconds: seconds,
      durationLabel: formatDuration(seconds),
      elapsedSeconds: Math.round((Date.now() - started) / 1000),
      actualCost: estimateCost(Math.max(0, paidChars), job.voice.kind),
    });
    return job;
  } catch (err) {
    const aborted = controller.signal.aborted || err?.name === 'AbortError';
    await touch({
      status: aborted ? 'cancelled' : 'failed',
      error: aborted ? 'Cancelled' : String(err.message || err),
    });
    return job;
  } finally {
    running.delete(id);
  }
}

export function slug(s) {
  return (
    String(s)
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '_')
      .slice(0, 60) || 'story'
  );
}
