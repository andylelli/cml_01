import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { config, paths } from './config.js';
import {
  planNarration,
  renderBook,
  normaliseOptions as coreNormaliseOptions,
  estimateCost as coreEstimateCost,
  slug,
} from '../../packages/narrator/src/index.js';
import { saveJob, loadJob } from './store.js';

/* ------------------------------------------------------------------ *
 * Job records for the standalone app.
 *
 * Chunking, SSML, synthesis, caching and audio assembly all live in
 * @cml/narrator so the workshop runs the SAME code. What stays here is the
 * bookkeeping this app needs and the API does not: a JSON job file, cancel
 * handles, and progress persisted for polling.
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

function rates() {
  const c = config();
  return {
    usdPerMillionNeural: c.usdPerMillionNeural,
    usdPerMillionPersonal: c.usdPerMillionPersonal,
    usdToGbp: c.usdToGbp,
  };
}

export function estimateCost(chars, voiceKind) {
  return coreEstimateCost(chars, voiceKind, rates());
}

export function normaliseOptions(options = {}, voice = {}) {
  const c = config();
  return coreNormaliseOptions(
    { maxChunkChars: c.maxChunkChars, concurrency: c.concurrency, ...options },
    voice
  );
}

export async function createJob({ text, storyTitle, voice, sourceLabel, options = {} }) {
  const opts = normaliseOptions(options, voice);
  const plan = planNarration(text, { options: opts, voiceKind: voice.kind, rates: rates() });
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
    estimate: plan.estimate,
    progress: { done: 0, total: plan.totals.chunks, cachedHits: 0, failed: 0 },
    chapters: plan.chapters
      .filter((ch) => !ch.skipped)
      .map((ch, position) => ({ ...ch, position, status: 'pending' })),
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

export async function runJob(id) {
  if (running.has(id)) return loadJob(id);

  const job = await loadJob(id);
  if (!job) throw new Error(`No such job: ${id}`);

  const controller = new AbortController();
  running.set(id, { controller });

  const c = config();
  const dir = path.join(paths.output, id);

  const touch = async (patch) => {
    Object.assign(job, patch, { updatedAt: new Date().toISOString() });
    await saveJob(job);
  };

  try {
    await touch({ status: 'running', error: null, startedAt: new Date().toISOString() });
    const markdown = await fs.readFile(path.join(dir, 'source.md'), 'utf8');

    const result = await renderBook({
      markdown,
      title: job.title,
      voice: job.voice,
      options: job.options,
      creds: {
        key: c.speechKey,
        region: c.region,
        outputFormat: c.outputFormat,
        apiVersion: c.apiVersion,
        companyName: c.companyName,
      },
      dirs: { cache: paths.cache, out: dir },
      baseModel: c.personalVoiceBaseModel,
      signal: controller.signal,
      rates: rates(),
      onProgress: (p) => {
        job.progress = { ...job.progress, done: p.done, total: p.total, cachedHits: p.cachedHits };
        job.status = p.phase === 'assembling' ? 'assembling' : 'running';
        saveJob(job).catch(() => {});
      },
    });

    for (const ch of job.chapters) ch.status = 'done';
    await touch({
      status: 'done',
      outputs: result.outputs,
      warnings: result.warnings.length ? result.warnings : undefined,
      finishedAt: new Date().toISOString(),
      durationSeconds: result.durationSeconds,
      durationLabel: result.durationLabel,
      elapsedSeconds: result.elapsedSeconds,
      actualCost: result.cost,
    });
    return job;
  } catch (err) {
    const aborted = controller.signal.aborted || err?.cancelled || err?.name === 'AbortError';
    await touch({
      status: aborted ? 'cancelled' : 'failed',
      error: aborted ? 'Cancelled' : String(err.message || err),
    });
    return job;
  } finally {
    running.delete(id);
  }
}

export { slug };
