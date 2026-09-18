import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { synthesize } from './azure.js';
import { planStory } from './text.js';
import { buildChunkSsml } from './ssml.js';
import { concatMp3, buildM4b, makeSilence, durationSeconds, formatDuration } from './audio.js';

/* ------------------------------------------------------------------ *
 * The render engine.
 *
 * A 10k-word story is ~35 Azure requests (one request caps at 10 minutes of
 * audio). Three things make that survivable:
 *   - every chunk is cached on disk by a hash of its SSML, so a failed or
 *     cancelled render resumes instead of re-paying for work already done
 *   - a small concurrency pool keeps wall-clock down without tripping 429s
 *   - chunks are written per chapter, so output survives a partial failure
 *
 * Persistence and HTTP live in the hosts; this owns only the expensive part.
 * ------------------------------------------------------------------ */

export const DEFAULTS = {
  maxChunkChars: 2400,
  concurrency: 3,
  usdPerMillionNeural: 15,
  usdPerMillionPersonal: 24,
  usdToGbp: 0.79,
};

/** Normalise whatever a caller sent into the option shape the renderer wants. */
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
    maxChunkChars: Number(options.maxChunkChars || DEFAULTS.maxChunkChars),
    concurrency: Number(options.concurrency || DEFAULTS.concurrency),
  };
}

export function estimateCost(chars, voiceKind, rates = {}) {
  const perMillion =
    voiceKind === 'personal'
      ? rates.usdPerMillionPersonal ?? DEFAULTS.usdPerMillionPersonal
      : rates.usdPerMillionNeural ?? DEFAULTS.usdPerMillionNeural;
  const usd = (chars / 1_000_000) * perMillion;
  const gbpRate = rates.usdToGbp ?? DEFAULTS.usdToGbp;
  return {
    chars,
    usdPerMillion: perMillion,
    usd: Math.round(usd * 100) / 100,
    gbp: Math.round(usd * gbpRate * 100) / 100,
  };
}

/**
 * Expand per-character assignments into a lookup keyed by every spelling.
 * The detector reports "Katherine" and "Katherine Bellamy" separately; both
 * must land on the same voice.
 */
function characterVoiceMap(characterVoices) {
  const map = {};
  for (const entry of characterVoices || []) {
    if (!entry?.voice?.id) continue;
    for (const key of [entry.name, ...(entry.aliases || [])]) {
      if (key) map[key] = entry.voice;
    }
  }
  return map;
}

/**
 * Build every chunk's SSML up front, in reading order.
 *
 * This cannot happen inside the concurrency pool: quote state and the current
 * speaker thread from one chunk to the next, so the documents must be composed
 * sequentially even though they are then synthesized in parallel.
 */
export function composeSsml(plan, { voice, options, baseModel }) {
  const voices = { narrator: voice, byCharacter: characterVoiceMap(options.characterVoices) };
  const out = [];

  for (const ch of plan.chapters.filter((x) => !x.skipped)) {
    // Quote state resets at a chapter boundary; speech never runs across one.
    let state = { inQuote: false, lastSpeaker: null };
    const chunks = [];
    for (const chunk of ch.chunks) {
      const blocks = options.readChapterTitles
        ? chunk.blocks
        : chunk.blocks.filter((b) => b.type !== 'heading');
      if (!blocks.length) continue;

      const built = buildChunkSsml({
        chunk: { ...chunk, blocks },
        voices,
        options: { ...options, baseModel },
        state,
      });
      state = built.state;
      chunks.push(built.ssml);
    }
    out.push({ chapter: ch, ssml: chunks });
  }
  return out;
}

function chunkHash(ssml, outputFormat) {
  return crypto.createHash('sha256').update(`${outputFormat} ${ssml}`).digest('hex');
}

async function cachedOrSynthesize({ ssml, creds, cacheDir, signal, onCacheHit }) {
  const outputFormat = creds.outputFormat || 'audio-24khz-160kbitrate-mono-mp3';
  const cachePath = path.join(cacheDir, `${chunkHash(ssml, outputFormat)}.mp3`);

  try {
    const stat = await fs.stat(cachePath);
    if (stat.size > 0) {
      onCacheHit?.();
      return cachePath;
    }
  } catch {
    /* cache miss - synthesize below */
  }

  const audio = await synthesize(ssml, creds, { signal });
  await fs.mkdir(cacheDir, { recursive: true });
  const tmp = `${cachePath}.tmp`;
  await fs.writeFile(tmp, audio);
  await fs.rename(tmp, cachePath);
  return cachePath;
}

/** Run `limit` tasks at a time, stopping early if aborted. */
async function pool(tasks, limit, signal) {
  let cursor = 0;
  const workers = Array.from({ length: Math.max(1, Math.min(limit, tasks.length)) }, async () => {
    for (;;) {
      if (signal?.aborted) return;
      const i = cursor++;
      if (i >= tasks.length) return;
      await tasks[i]();
    }
  });
  await Promise.all(workers);
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

/** Everything a caller needs to show before a single character is paid for. */
export function planNarration(markdown, { options = {}, voiceKind = 'prebuilt', rates } = {}) {
  const opts = normaliseOptions(options);
  const plan = planStory(markdown, {
    maxChunkChars: opts.maxChunkChars,
    skipFrontMatter: opts.skipFrontMatter,
  });
  return {
    title: plan.title,
    totals: plan.totals,
    estimate: estimateCost(plan.totals.chars, voiceKind, rates),
    chapters: plan.chapters.map((c) => ({
      index: c.index,
      title: c.title,
      titled: c.titled,
      words: c.words,
      chars: c.chars,
      chunks: c.chunks.length,
      isFrontMatter: c.isFrontMatter,
      skipped: c.skipped,
    })),
  };
}

/**
 * Render a manuscript to audio.
 *
 * `dirs.cache` is shared and content-addressed - re-rendering the same text
 * with the same voice and settings costs nothing. `dirs.out` holds this
 * render's chapter files and finished book.
 */
export async function renderBook({
  markdown,
  title,
  voice,
  options = {},
  creds,
  dirs,
  baseModel,
  signal,
  onProgress,
  rates,
}) {
  const opts = normaliseOptions(options, voice);
  const outDir = dirs.out;
  const cacheDir = dirs.cache;
  const chaptersDir = path.join(outDir, 'chapters');
  const started = Date.now();

  await fs.mkdir(chaptersDir, { recursive: true });
  await fs.mkdir(cacheDir, { recursive: true });

  const plan = planStory(markdown, {
    maxChunkChars: opts.maxChunkChars,
    skipFrontMatter: opts.skipFrontMatter,
  });
  const composed = composeSsml(plan, { voice, options: opts, baseModel });
  const results = composed.map((entry) => new Array(entry.ssml.length));

  const progress = { done: 0, total: 0, cachedHits: 0, phase: 'synthesizing' };
  const tasks = [];
  composed.forEach((entry, chapterPos) => {
    entry.ssml.forEach((ssml, chunkPos) => {
      tasks.push(async () => {
        const file = await cachedOrSynthesize({
          ssml,
          creds,
          cacheDir,
          signal,
          onCacheHit: () => {
            progress.cachedHits += 1;
          },
        });
        results[chapterPos][chunkPos] = file;
        progress.done += 1;
        onProgress?.({ ...progress });
      });
    });
  });

  progress.total = tasks.length;
  onProgress?.({ ...progress });

  await pool(tasks, opts.concurrency, signal);
  if (signal?.aborted) {
    const err = new Error('Cancelled');
    err.cancelled = true;
    throw err;
  }

  progress.phase = 'assembling';
  onProgress?.({ ...progress });

  const chapterFiles = [];
  const chapterMeta = [];
  for (let i = 0; i < composed.length; i++) {
    const files = results[i].filter(Boolean);
    if (!files.length) continue;
    const ch = composed[i].chapter;
    // Number by reading position, not source index - skipped front matter must
    // not leave a gap that makes the first chapter file "02".
    const n = String(chapterFiles.length + 1).padStart(2, '0');
    const out = path.join(chaptersDir, `${n}-${slug(ch.title)}.mp3`);
    await concatMp3(files, out, { workDir: outDir });
    chapterFiles.push(out);
    chapterMeta.push({ title: ch.title, file: path.basename(out), index: chapterFiles.length - 1 });
  }

  if (!chapterFiles.length) {
    throw new Error('Nothing was synthesized - the manuscript appears to be empty.');
  }

  const silence = path.join(cacheDir, 'silence-1200.mp3');
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

  const bookName = slug(title);
  const fullMp3 = path.join(outDir, `${bookName}.mp3`);
  await concatMp3(interleaved, fullMp3, { workDir: outDir });

  const outputs = { mp3: path.basename(fullMp3), chapters: chapterMeta };
  const warnings = [];

  if (opts.makeM4b) {
    try {
      const m4b = path.join(outDir, `${bookName}.m4b`);
      await buildM4b({
        chapterFiles,
        chapters: chapterMeta,
        outFile: m4b,
        meta: { title, artist: voice.label || voice.id, album: title },
        workDir: outDir,
      });
      outputs.m4b = path.basename(m4b);
      await fs.rm(path.join(outDir, 'chapters.ffmeta'), { force: true });
    } catch (e) {
      // An m4b failure must not lose a finished mp3.
      warnings.push(`m4b build failed: ${e.message}`);
    }
  }

  // Per-chapter durations let the player jump between chapters in one file.
  let cursor = 0;
  for (const meta of chapterMeta) {
    const secs = await durationSeconds(path.join(chaptersDir, meta.file));
    meta.startSeconds = Math.round(cursor * 100) / 100;
    meta.durationSeconds = Math.round(secs * 100) / 100;
    cursor += secs + 1.2; // the inter-chapter silence
  }

  const seconds = await durationSeconds(fullMp3);
  const paidChars = Math.round(
    plan.totals.chars * (1 - progress.cachedHits / Math.max(1, progress.total))
  );

  return {
    outputs,
    warnings,
    totals: plan.totals,
    durationSeconds: seconds,
    durationLabel: formatDuration(seconds),
    elapsedSeconds: Math.round((Date.now() - started) / 1000),
    cachedHits: progress.cachedHits,
    chunks: progress.total,
    cost: estimateCost(Math.max(0, paidChars), voice.kind, rates),
  };
}
