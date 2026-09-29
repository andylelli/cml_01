#!/usr/bin/env node
// CR-03 — replay one pipeline stage offline, in a sandbox, and leave the working tree as it was.
//
//   node scripts/replay-stage.mjs --cassette <c.jsonl.gz> --project <projectId> --env <fixture.expected.json>
//   node scripts/replay-stage.mjs ... --rebase <out.jsonl.gz>        # re-baseline instead of prove
//   options: --stage prose (RESUME_REDO, default prose) · --store <store.json[.gz]> (default data/store.json)
//            --keep (print the sandbox path and do not delete it)
//
// It runs the real `resume-run` (dist) with LLM_REPLAY_CASSETTE, so the code under test is exactly the
// code a paid resume would run.
//
// ENVIRONMENT. With --env, the fixture's recorded flag environment is applied and nothing else:
// `.env.local` is skipped (CML_SKIP_ENV_FILES=1) and every flag registered in FLAG-AUDIT is removed
// from the inherited environment first — so a replay digests the same on this machine and in CI.
// Without --env, this machine's `.env.local` applies (and the script says so).
//
// SANDBOX. Everything with a path override goes to a temp folder: store, stories, novelty ledger, Agent 9
// checkpoint, LLM logs. What has no override is snapshotted first and put back: files in data/ and
// apps/worker/logs are backed up whole; larger append-only logs are truncated back ONLY if their last
// bytes are unchanged (proof they were appended to, not rewritten). A new file is deleted. Anything else
// that changed, or disappeared without a backup, FAILS the script and is named.
//
// Prints `REPLAY_SUMMARY {json}` last: result, match, the digest of the regenerated chapters, exit code.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { closeSync, copyFileSync, existsSync, mkdirSync, mkdtempSync, openSync, readFileSync, readSync, readdirSync, rmSync, statSync, truncateSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { gunzipSync } from 'node:zlib';
import { readCassette } from '../packages/llm-client/dist/index.js';

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const cassette = arg('--cassette');
const project = arg('--project');
const rebaseOut = arg('--rebase');
const envFile = arg('--env');
const stage = arg('--stage') ?? 'prose';
const root = resolve(process.cwd());
const storeSrc = arg('--store') ?? join(root, 'data', 'store.json');
if (!cassette || !project) { console.error('usage: --cassette <file> --project <projectId> [--env <expected.json>] [--rebase <out>] [--stage prose] [--store <file>] [--keep]'); process.exit(2); }

const sandbox = mkdtempSync(join(tmpdir(), 'cml-replay-'));
const store = join(sandbox, 'store.json');
if (storeSrc.endsWith('.gz')) writeFileSync(store, gunzipSync(readFileSync(storeSrc))); else copyFileSync(storeSrc, store);
const ledgerSrc = join(root, 'data', 'novelty-ledger.json');
const ledger = join(sandbox, 'novelty-ledger.json');
if (existsSync(ledgerSrc)) copyFileSync(ledgerSrc, ledger);
mkdirSync(join(sandbox, 'stories'));

// ── snapshot what has no override ───────────────────────────────────────────────────────────────
const WATCH = ['data', 'logs', 'stories', 'apps/worker/logs', 'apps/api/logs', 'apps/api/data', 'documentation/prompts/actual'];
const BACKUP_LIMIT = 20e6;
const TAIL = 4096;
const tailHash = (f, size) => {
  const n = Math.min(TAIL, size);
  const buf = Buffer.alloc(n);
  const fd = openSync(f, 'r');
  try { readSync(fd, buf, 0, n, size - n); } finally { closeSync(fd); }
  return createHash('sha256').update(buf).digest('hex');
};
const walk = (d) => { if (!existsSync(d)) return []; return readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]); };
const snap = new Map();
const backups = join(sandbox, 'backup');
mkdirSync(backups);
let n = 0;
for (const w of WATCH) for (const f of walk(join(root, w))) {
  const st = statSync(f);
  const entry = { size: st.size, mtimeMs: st.mtimeMs, backup: null, tail: null };
  // data/*.json is backed up whatever its size (store.json is 36 MB and rewritten whole, never appended);
  // data/narration's audio (365 MB) is not a replay's to touch, so the tail check covers it.
  // apps/api/data (22 MB, 134 files) is backed up whole: its reports/ are keyed by run id and have no
  // path override, so a replay with RESUME_RUN_ID pinned overwrites the recorded run's report
  // (MEASURED 2026-09-29 — the original run_7b1ec2ef report was lost before this rule existed).
  const inData = /(^|[\\/])data[\\/][^\\/]+\.json$/.test(f.slice(root.length)) || /apps[\\/]api[\\/]data[\\/]/.test(f);
  if (inData || (st.size <= BACKUP_LIMIT && /apps[\\/]worker[\\/]logs/.test(f))) { entry.backup = join(backups, String(n++)); copyFileSync(f, entry.backup); }
  else entry.tail = tailHash(f, st.size);
  snap.set(f, entry);
}

// ── environment ─────────────────────────────────────────────────────────────────────────────────
const env = { ...process.env };
if (envFile) {
  const parsed = JSON.parse(readFileSync(envFile, 'utf8'));
  const fixtureEnv = parsed.env ?? parsed;
  const registered = [...readFileSync(join(root, 'architecture', 'FLAG-AUDIT.md'), 'utf8').matchAll(/^\| `([A-Z][A-Z0-9_]+)`/gm)].map((m) => m[1]);
  for (const k of registered) delete env[k];
  Object.assign(env, fixtureEnv, { CML_SKIP_ENV_FILES: '1' });
} else {
  console.log('[replay-stage] no --env: this machine\'s .env.local applies; a committed fixture always passes --env');
}
// The recorded run's id: Agent 2d seeds the story date from the run id, so a fresh id is a new date.
const recordedRunId = readCassette(resolve(cassette)).source?.runId;
Object.assign(env, {
  ...(recordedRunId ? { RESUME_RUN_ID: String(recordedRunId) } : {}),
  LLM_REPLAY_CASSETTE: resolve(cassette),
  LLM_REPLAY_MODE: rebaseOut ? 'rebase' : 'strict',
  ...(rebaseOut ? { LLM_REPLAY_REBASE_OUT: resolve(rebaseOut) } : {}),
  RESUME_REDO: stage,
  CML_JSON_DB_PATH: store,
  CML_STORIES_DIR: join(sandbox, 'stories'),
  CML_NOVELTY_LEDGER_PATH: ledger,
  CML_AGENT9_CHECKPOINT_PATH: join(sandbox, 'agent9-checkpoint.json'), // absent: the whole stage is written
  LOG_TO_FILE: 'false',
  LOG_FULL_PROMPTS_TO_FILE: 'false',
  LOG_ACTUAL_PROMPT_DOCS_TO_FILE: 'false',
});

// ── run ─────────────────────────────────────────────────────────────────────────────────────────
const t0 = Date.now();
const r = spawnSync(process.execPath, ['--max-old-space-size=6144', join(root, 'apps/worker/dist/jobs/resume-run.js'), project],
  { cwd: root, env, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
const log = (r.stdout ?? '') + (r.stderr ?? '');
writeFileSync(join(sandbox, 'replay.log'), log);
for (const line of log.split('\n')) if (/^\[replay\]|\[resume-run\] (manuscript|DONE|FAILED)/.test(line)) console.log(line.slice(0, 400));

// ── the output digest: the CHAPTERS only (an artifact also carries run ids and timestamps) ──────
let digest = null;
try {
  const rows = JSON.parse(readFileSync(store, 'utf8'));
  const list = (rows.artifacts ?? rows.artifact_versions ?? []).filter((a) => (a.project_id ?? a.projectId) === project && (a.artifact_type ?? a.type) === 'prose');
  const last = list[list.length - 1];
  if (last) {
    const raw = last.payload ?? last.payload_json;
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const payload = JSON.stringify(obj?.chapters ?? obj);
    digest = createHash('sha256').update(payload).digest('hex').slice(0, 16);
    console.log(`[replay-stage] prose sha256 ${digest} (${payload.length} chars)`);
  }
} catch (e) { console.log(`[replay-stage] could not digest prose: ${e.message}`); }

// ── put the tree back ───────────────────────────────────────────────────────────────────────────
const unrestorable = [];
let restored = 0;
for (const w of WATCH) for (const f of walk(join(root, w))) {
  const before = snap.get(f);
  const st = statSync(f);
  if (!before) { rmSync(f); restored++; continue; }
  if (st.size === before.size && st.mtimeMs === before.mtimeMs) continue;
  if (before.backup) { copyFileSync(before.backup, f); restored++; continue; }
  // Truncate only an APPEND: the bytes that ended the file before must still be there.
  if (st.size > before.size && tailHash(f, before.size) === before.tail) { truncateSync(f, before.size); restored++; continue; }
  unrestorable.push(`${f} (changed, no backup, not an append)`);
}
for (const [f, before] of snap) {
  if (existsSync(f)) continue;
  if (before.backup) { copyFileSync(before.backup, f); restored++; }
  else unrestorable.push(`${f} (deleted, no backup)`);
}
console.log(`[replay-stage] ${((Date.now() - t0) / 1000).toFixed(1)} s · tree restored (${restored} file(s) put back)`);
if (args.includes('--keep') || unrestorable.length) console.log(`[replay-stage] sandbox kept: ${sandbox}`);
else rmSync(sandbox, { recursive: true, force: true });
const matchLine = log.split('\n').find((l) => l.startsWith('[replay] RESULT:')) ?? '';
console.log('REPLAY_SUMMARY ' + JSON.stringify({ result: matchLine.replace('[replay] RESULT: ', ''), match: matchLine.includes('RESULT: MATCH'), digest, exit: r.status, unrestorable: unrestorable.length }));
if (unrestorable.length) {
  console.error(`[replay-stage] FAILED TO RESTORE ${unrestorable.length} file(s):\n  ${unrestorable.join('\n  ')}`);
  process.exit(6);
}
process.exit(r.status ?? 1);
