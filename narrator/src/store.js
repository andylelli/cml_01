import fs from 'node:fs/promises';
import path from 'node:path';
import { paths } from './config.js';

/* A tiny JSON-file store. Local, inspectable, and no database to run. */

export async function ensureDirs() {
  for (const dir of [paths.data, paths.jobs, paths.cache, paths.output, paths.uploads]) {
    await fs.mkdir(dir, { recursive: true });
  }
}

async function readJson(file, fallback) {
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch (e) {
    if (e.code === 'ENOENT') return fallback;
    throw e;
  }
}

/** Write via a temp file so a crash mid-write cannot truncate the store. */
async function writeJson(file, value) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(value, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

/* ------------------------------- voices ------------------------------- */

export async function listVoices() {
  const v = await readJson(paths.voices, { voices: [] });
  return v.voices || [];
}

export async function getVoice(id) {
  return (await listVoices()).find((v) => v.id === id) || null;
}

export async function saveVoice(voice) {
  const voices = await listVoices();
  const i = voices.findIndex((v) => v.id === voice.id);
  if (i >= 0) voices[i] = { ...voices[i], ...voice };
  else voices.push(voice);
  await writeJson(paths.voices, { voices });
  return voice;
}

export async function removeVoice(id) {
  const voices = await listVoices();
  await writeJson(paths.voices, { voices: voices.filter((v) => v.id !== id) });
}

/* -------------------------------- jobs -------------------------------- */

export function jobFile(id) {
  return path.join(paths.jobs, `${id}.json`);
}

export async function saveJob(job) {
  await writeJson(jobFile(job.id), job);
  return job;
}

export async function loadJob(id) {
  return readJson(jobFile(id), null);
}

export async function listJobs() {
  let names = [];
  try {
    names = await fs.readdir(paths.jobs);
  } catch {
    return [];
  }
  const jobs = [];
  for (const n of names) {
    if (!n.endsWith('.json')) continue;
    const j = await readJson(path.join(paths.jobs, n), null);
    if (j) jobs.push(j);
  }
  return jobs.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
}

export async function deleteJob(id) {
  await fs.rm(jobFile(id), { force: true });
  await fs.rm(path.join(paths.output, id), { recursive: true, force: true });
}
