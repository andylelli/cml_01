import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import express from 'express';
import multer from 'multer';

import { config, assertConfigured, paths } from './config.js';
import {
  listPrebuiltVoices,
  ensureProject,
  createConsent,
  createPersonalVoice,
  waitForPersonalVoice,
  deletePersonalVoice,
  consentStatement,
  synthesize,
} from './azure.js';
import { toConsentWav, ffmpegBinary, runFfmpeg } from './audio.js';
import { planStory, parseChapters } from './text.js';
import { detectCast } from './dialogue.js';
import { buildChunkSsml } from './ssml.js';
import { listVoices, getVoice, saveVoice, removeVoice, listJobs, loadJob, deleteJob, ensureDirs } from './store.js';
import { createJob, runJob, cancelJob, isRunning, estimateCost, slug, normaliseOptions } from './jobs.js';
import { listStories, readStory } from './stories.js';

const app = express();
app.use(express.json({ limit: '20mb' }));

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 200 * 1024 * 1024, files: 12 },
});

const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ------------------------------- status ------------------------------- */

let ffmpegOk = null;
async function checkFfmpeg() {
  if (ffmpegOk !== null) return ffmpegOk;
  try {
    await runFfmpeg(['-version'], { timeoutMs: 20000 });
    ffmpegOk = true;
  } catch {
    ffmpegOk = false;
  }
  return ffmpegOk;
}

app.get('/api/status', wrap(async (req, res) => {
  const c = config();
  res.json({
    configured: Boolean(c.speechKey),
    region: c.region,
    personalVoiceBaseModel: c.personalVoiceBaseModel,
    outputFormat: c.outputFormat,
    maxChunkChars: c.maxChunkChars,
    concurrency: c.concurrency,
    ffmpeg: { path: ffmpegBinary(), ok: await checkFfmpeg() },
    pricing: { neural: c.usdPerMillionNeural, personal: c.usdPerMillionPersonal, usdToGbp: c.usdToGbp },
  });
}));

app.get('/api/consent-statement', (req, res) => {
  res.json({ statement: consentStatement(req.query.name, config().companyName) });
});

/* ------------------------------- voices ------------------------------- */

let prebuiltCache = { at: 0, voices: [] };

app.get('/api/voices', wrap(async (req, res) => {
  const personal = await listVoices();
  let prebuilt = [];
  let prebuiltError = null;

  if (config().speechKey) {
    const fresh = Date.now() - prebuiltCache.at < 10 * 60 * 1000;
    if (fresh && prebuiltCache.voices.length) {
      prebuilt = prebuiltCache.voices;
    } else {
      try {
        prebuilt = await listPrebuiltVoices();
        prebuiltCache = { at: Date.now(), voices: prebuilt };
      } catch (e) {
        prebuiltError = e.message;
      }
    }
  }
  res.json({ personal, prebuilt, prebuiltError });
}));

/**
 * Create a cloned voice.
 * Needs two recordings: the sample to clone from, and a separate recording of
 * the consent sentence. Azure requires both; there is no way around the second.
 */
app.post(
  '/api/voices/personal',
  upload.fields([{ name: 'sample', maxCount: 10 }, { name: 'consent', maxCount: 1 }]),
  wrap(async (req, res) => {
    assertConfigured();
    const { name, locale = 'en-GB', label } = req.body;
    const samples = req.files?.sample || [];
    const consentFile = req.files?.consent?.[0];

    if (!name?.trim()) return res.status(400).json({ error: 'Voice talent name is required - it must match the name spoken in the consent recording.' });
    if (!samples.length) return res.status(400).json({ error: 'Upload at least one voice sample (aim for 30-60 seconds of clean speech).' });
    if (!consentFile) return res.status(400).json({ error: 'Upload the consent recording - Azure will not create a cloned voice without one.' });

    const id = `pv_${crypto.randomBytes(6).toString('hex')}`;
    const workDir = path.join(paths.uploads, id);
    await fs.mkdir(workDir, { recursive: true });

    // Normalise everything to mono 16k wav before it goes up.
    const prep = async (file, tag) => {
      const raw = path.join(workDir, `${tag}-raw${path.extname(file.originalname) || '.bin'}`);
      const wav = path.join(workDir, `${tag}.wav`);
      await fs.writeFile(raw, file.buffer);
      await toConsentWav(raw, wav);
      return { buffer: await fs.readFile(wav), filename: `${tag}.wav` };
    };

    const projectId = 'cml_narrator';
    await ensureProject(projectId);

    const consentId = `${id}_consent`;
    await createConsent({
      consentId,
      projectId,
      voiceTalentName: name.trim(),
      locale,
      audio: await prep(consentFile, 'consent'),
    });

    const prepared = [];
    for (let i = 0; i < samples.length; i++) prepared.push(await prep(samples[i], `sample${i + 1}`));

    await createPersonalVoice({ personalVoiceId: id, projectId, consentId, samples: prepared });
    const done = await waitForPersonalVoice(id);

    const speakerProfileId = done.speakerProfileId || done.SpeakerProfileId;
    if (!speakerProfileId) throw new Error(`Azure returned no speakerProfileId: ${JSON.stringify(done).slice(0, 300)}`);

    const voice = {
      id,
      kind: 'personal',
      label: label?.trim() || `${name.trim()} (cloned)`,
      talentName: name.trim(),
      locale,
      speakerProfileId,
      baseModel: config().personalVoiceBaseModel,
      projectId,
      consentId,
      createdAt: new Date().toISOString(),
    };
    await saveVoice(voice);
    await fs.rm(workDir, { recursive: true, force: true });

    res.json({ voice });
  })
);

app.delete('/api/voices/:id', wrap(async (req, res) => {
  const voice = await getVoice(req.params.id);
  if (!voice) return res.status(404).json({ error: 'No such voice' });
  try {
    await deletePersonalVoice(voice.id);
  } catch (e) {
    // Losing the remote copy must not strand the local record.
    req.log = e.message;
  }
  await removeVoice(req.params.id);
  res.json({ ok: true, azureWarning: req.log || null });
}));

/* ------------------------------ stories ------------------------------- */

app.get('/api/stories', wrap(async (req, res) => res.json(await listStories())));

/* -------------------------------- plan -------------------------------- */

async function resolveText(body, file) {
  if (file) return { text: file.buffer.toString('utf8'), label: file.originalname, title: null };
  if (body.storyId) {
    const s = await readStory(body.storyId);
    return { text: s.text, label: body.storyId, title: s.title };
  }
  if (body.text) return { text: body.text, label: 'pasted text', title: null };
  const err = new Error('Provide text, a storyId, or upload a file.');
  err.status = 400;
  throw err;
}

app.post('/api/plan', upload.single('file'), wrap(async (req, res) => {
  const { text, label, title } = await resolveText(req.body, req.file);
  const skipFrontMatter = req.body.skipFrontMatter !== 'false';
  const plan = planStory(text, { maxChunkChars: config().maxChunkChars, skipFrontMatter });
  const kind = req.body.voiceKind || 'prebuilt';
  res.json({
    label,
    title: title || plan.title,
    totals: plan.totals,
    estimate: estimateCost(plan.totals.chars, kind),
    hasFrontMatter: plan.chapters.some((c) => c.isFrontMatter),
    chapters: plan.chapters.map((c) => ({
      index: c.index, title: c.title, titled: c.titled,
      words: c.words, chars: c.chars, chunks: c.chunks.length,
      isFrontMatter: c.isFrontMatter, skipped: c.skipped,
    })),
  });
}));

/* -------------------------------- cast -------------------------------- */

/**
 * Who speaks in this story, and how often. Costs nothing - it reads the prose,
 * it does not call Azure - so the UI can offer a cast list before any spend.
 */
app.post('/api/cast', upload.single('file'), wrap(async (req, res) => {
  const { text } = await resolveText(req.body, req.file);
  const { chapters } = parseChapters(text);
  const paragraphs = chapters.flatMap((c) =>
    c.blocks.filter((b) => b.type === 'p').map((b) => b.text)
  );
  const cast = detectCast(paragraphs);
  res.json({
    cast,
    speakers: cast.length,
    dialogueLines: cast.reduce((n, c) => n + c.lines, 0),
  });
}));

/* ------------------------------ audition ------------------------------ */

/**
 * Render one short passage in several voices so the choice is made by ear.
 * A few hundred characters per voice - pennies - instead of guessing from
 * a voice name and then paying for a whole book.
 */
app.post('/api/audition', wrap(async (req, res) => {
  assertConfigured();
  const body = req.body || {};
  const voiceIds = Array.isArray(body.voices) ? body.voices.slice(0, 6) : [];
  if (!voiceIds.length) return res.status(400).json({ error: 'Pick at least one voice to audition.' });

  let passage = (body.text || '').trim();
  if (!passage && body.storyId) {
    const s = await readStory(body.storyId);
    const { chapters } = parseChapters(s.text);
    const first = chapters.find((c) => c.titled) || chapters[0];
    const paras = first.blocks.filter((b) => b.type === 'p').map((b) => b.text);
    passage = paras.join('\n\n').slice(0, Number(body.maxChars || 700));
  }
  if (!passage) return res.status(400).json({ error: 'No passage to audition.' });

  const options = normaliseOptions(body.options || {});
  const outDir = path.join(paths.output, '_auditions');
  await fs.mkdir(outDir, { recursive: true });

  const results = [];
  for (const ref of voiceIds) {
    const voice =
      ref.kind === 'personal'
        ? await getVoice(ref.id)
        : { id: ref.id, kind: 'prebuilt', label: ref.label || ref.id, locale: ref.locale };
    if (!voice) {
      results.push({ ref, error: 'voice not found' });
      continue;
    }
    try {
      const { ssml } = buildChunkSsml({
        chunk: { blocks: [{ type: 'p', text: passage }] },
        voices: { narrator: voice, byCharacter: {} },
        options: { ...options, baseModel: config().personalVoiceBaseModel },
      });
      const audio = await synthesize(ssml);
      const name = `${slug(voice.label || voice.id)}-${crypto.randomBytes(3).toString('hex')}.mp3`;
      await fs.writeFile(path.join(outDir, name), audio);
      results.push({
        ref,
        label: voice.label || voice.id,
        url: `/api/audition/${encodeURIComponent(name)}`,
        chars: passage.length,
      });
    } catch (e) {
      results.push({ ref, label: voice.label || voice.id, error: e.message });
    }
  }

  res.json({ passage, results, charsPerVoice: passage.length });
}));

app.get('/api/audition/:name', wrap(async (req, res) => {
  const dir = path.join(paths.output, '_auditions');
  const target = path.resolve(dir, req.params.name);
  if (!target.startsWith(path.resolve(dir))) return res.status(400).end();
  try {
    await fs.access(target);
  } catch {
    return res.status(404).json({ error: 'Not found' });
  }
  res.sendFile(target);
}));

/* -------------------------------- jobs -------------------------------- */

app.post('/api/jobs', upload.single('file'), wrap(async (req, res) => {
  assertConfigured();
  const body = req.body || {};
  const { text, label, title } = await resolveText(body, req.file);

  let voice;
  if (body.voiceKind === 'personal') {
    voice = await getVoice(body.voiceId);
    if (!voice) return res.status(400).json({ error: 'That cloned voice no longer exists.' });
  } else {
    if (!body.voiceId) return res.status(400).json({ error: 'Pick a voice.' });
    voice = { id: body.voiceId, kind: 'prebuilt', label: body.voiceLabel || body.voiceId, locale: body.locale };
  }

  const options = body.options ? JSON.parse(body.options) : {};
  const job = await createJob({
    text,
    storyTitle: body.title || title,
    voice,
    sourceLabel: label,
    options,
  });

  runJob(job.id).catch(() => {});
  res.json({ job });
}));

app.get('/api/jobs', wrap(async (req, res) => {
  const jobs = await listJobs();
  res.json({
    jobs: jobs.map((j) => ({
      id: j.id, status: j.status, title: j.title, voice: j.voice, totals: j.totals,
      progress: j.progress, createdAt: j.createdAt, durationLabel: j.durationLabel,
      outputs: j.outputs, error: j.error, running: isRunning(j.id),
    })),
  });
}));

app.get('/api/jobs/:id', wrap(async (req, res) => {
  const job = await loadJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'No such job' });
  res.json({ job: { ...job, running: isRunning(job.id) } });
}));

app.post('/api/jobs/:id/cancel', wrap(async (req, res) => {
  res.json({ cancelled: cancelJob(req.params.id) });
}));

app.post('/api/jobs/:id/retry', wrap(async (req, res) => {
  const job = await loadJob(req.params.id);
  if (!job) return res.status(404).json({ error: 'No such job' });
  if (isRunning(job.id)) return res.status(409).json({ error: 'Already running' });
  job.progress = { ...job.progress, done: 0, cachedHits: 0, failed: 0 };
  runJob(job.id).catch(() => {});
  res.json({ ok: true });
}));

app.delete('/api/jobs/:id', wrap(async (req, res) => {
  cancelJob(req.params.id);
  await deleteJob(req.params.id);
  res.json({ ok: true });
}));

/** Serve a rendered file, refusing any name that escapes the job directory. */
app.get('/api/jobs/:id/file/:name', wrap(async (req, res) => {
  const dir = path.join(paths.output, req.params.id);
  const target = path.resolve(dir, req.params.name);
  if (!target.startsWith(path.resolve(dir))) return res.status(400).end();
  try {
    await fs.access(target);
  } catch {
    return res.status(404).json({ error: 'Not rendered yet' });
  }
  res.download(target);
}));

app.get('/api/jobs/:id/chapter/:name', wrap(async (req, res) => {
  const dir = path.join(paths.output, req.params.id, 'chapters');
  const target = path.resolve(dir, req.params.name);
  if (!target.startsWith(path.resolve(dir))) return res.status(400).end();
  try {
    await fs.access(target);
  } catch {
    return res.status(404).json({ error: 'Not rendered yet' });
  }
  res.sendFile(target);
}));

/* ------------------------------- static ------------------------------- */

app.use(express.static(paths.public));

app.use((err, req, res, _next) => {
  const status = err.status || 500;
  if (status >= 500) console.error('[narrator]', err);
  res.status(status).json({ error: err.message || 'Unexpected error' });
});

const port = config().port;
await ensureDirs();
app.listen(port, () => {
  const c = config();
  console.log(`\n  Narrator ready:  http://localhost:${port}\n`);
  console.log(`  Azure region:    ${c.region}`);
  console.log(`  Azure key:       ${c.speechKey ? 'set' : 'NOT SET - copy .env.example to .env'}`);
  console.log(`  ffmpeg:          ${ffmpegBinary()}\n`);
});
