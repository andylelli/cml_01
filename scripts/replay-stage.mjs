#!/usr/bin/env node
// CR-03 — replay one pipeline stage offline, in a sandbox, and leave the working tree as it was.
//
//   node scripts/replay-stage.mjs --cassette <c.jsonl.gz> --project <projectId>            # strict proof
//   node scripts/replay-stage.mjs --cassette <c> --project <p> --rebase <out.jsonl.gz>    # re-baseline
//   options: --stage prose (RESUME_REDO, default prose) · --store <store.json> (default data/store.json)
//            --keep (print the sandbox path and do not delete it)
//
// It runs the real `resume-run` (dist) with LLM_REPLAY_CASSETTE, so the code under test is exactly
// the code a paid resume would run. Everything with a path override goes to a temp sandbox: the
// artifact store, the stories folder, the novelty ledger, the LLM logs. What has no override (the
// worker's run logs, checkpoints and scoring log under apps/worker/logs, and anything else) is
// snapshotted first and put back afterwards: new files deleted, appended logs truncated, overwritten
// files restored. If something changed that cannot be put back, the script FAILS and names it.
//
// Prints `[replay-stage] prose sha256 <hash>`: the digest of the regenerated prose artifact, so two
// replays of the same cassette can be compared (determinism), and a refactor's replay against the
// digest before it.
import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { copyFileSync, existsSync, mkdtempSync, readFileSync, readdirSync, rmSync, statSync, truncateSync, writeFileSync, mkdirSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { gunzipSync } from 'node:zlib';
import { join, resolve } from 'node:path';

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const cassette = arg('--cassette');
const project = arg('--project');
const rebaseOut = arg('--rebase');
const stage = arg('--stage') ?? 'prose';
const root = resolve(process.cwd());
const storeSrc = arg('--store') ?? join(root, 'data', 'store.json');
if (!cassette || !project) { console.error('usage: --cassette <file> --project <projectId> [--rebase <out>] [--stage prose] [--store <file>] [--keep]'); process.exit(2); }

const sandbox = mkdtempSync(join(tmpdir(), 'cml-replay-'));
const store = join(sandbox, 'store.json');
// A fixture store is committed gzipped; the pipeline reads plain JSON.
if (storeSrc.endsWith('.gz')) writeFileSync(store, gunzipSync(readFileSync(storeSrc))); else copyFileSync(storeSrc, store);
const ledgerSrc = join(root, 'data', 'novelty-ledger.json');
const ledger = join(sandbox, 'novelty-ledger.json');
if (existsSync(ledgerSrc)) copyFileSync(ledgerSrc, ledger);
mkdirSync(join(sandbox, 'stories'));

// ── snapshot what has no override ───────────────────────────────────────────────────────────────
const WATCH = ['data', 'logs', 'stories', 'apps/worker/logs', 'apps/api/logs', 'apps/api/data', 'documentation/prompts/actual'];
const BACKUP_LIMIT = 20e6; // files above this are append-only logs: truncated, not copied
const snap = new Map();
const walk = (d) => { if (!existsSync(d)) return []; return readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(join(d, e.name)) : [join(d, e.name)]); };
const backups = join(sandbox, 'backup');
mkdirSync(backups);
let n = 0;
for (const w of WATCH) for (const f of walk(join(root, w))) {
  const st = statSync(f);
  const entry = { size: st.size, mtimeMs: st.mtimeMs, backup: null };
  if (st.size <= BACKUP_LIMIT && /apps[\\/]worker[\\/]logs|[\\/]data[\\/]/.test(f)) { entry.backup = join(backups, String(n++)); copyFileSync(f, entry.backup); }
  snap.set(f, entry);
}

// ── run ─────────────────────────────────────────────────────────────────────────────────────────
const env = {
  ...process.env,
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
};
const t0 = Date.now();
const r = spawnSync(process.execPath, ['--max-old-space-size=6144', join(root, 'apps/worker/dist/jobs/resume-run.js'), project],
  { cwd: root, env, encoding: 'utf8', maxBuffer: 512 * 1024 * 1024 });
const log = (r.stdout ?? '') + (r.stderr ?? '');
writeFileSync(join(sandbox, 'replay.log'), log);
for (const line of log.split('\n')) if (/^\[replay\]|\[resume-run\] (manuscript|DONE|FAILED)/.test(line)) console.log(line.slice(0, 400));

let digest = null;
// ── the output digest ───────────────────────────────────────────────────────────────────────────
try {
  const rows = JSON.parse(readFileSync(store, 'utf8'));
  const list = (rows.artifacts ?? rows.artifact_versions ?? []).filter((a) => (a.project_id ?? a.projectId) === project && (a.artifact_type ?? a.type) === 'prose');
  const last = list[list.length - 1];
  if (last) {
    // The CHAPTERS only: an artifact also carries run ids and timestamps, which differ by design.
    const raw = last.payload ?? last.payload_json;
    const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
    const payload = JSON.stringify(obj?.chapters ?? obj);
    digest = createHash('sha256').update(payload).digest('hex').slice(0, 16);
    console.log(`[replay-stage] prose sha256 ${digest} (${payload.length} chars)`);
  }
} catch (e) { console.log(`[replay-stage] could not digest prose: ${e.message}`); }

// ── put the tree back ───────────────────────────────────────────────────────────────────────────
const unrestorable = [];
const restored = [];
for (const w of WATCH) for (const f of walk(join(root, w))) {
  const before = snap.get(f);
  const st = statSync(f);
  if (!before) { rmSync(f); restored.push(`deleted ${f}`); continue; }
  if (st.size === before.size && st.mtimeMs === before.mtimeMs) continue;
  if (before.backup) { copyFileSync(before.backup, f); restored.push(`restored ${f}`); continue; }
  if (st.size > before.size) { truncateSync(f, before.size); restored.push(`truncated ${f}`); continue; }
  unrestorable.push(f);
}
for (const [f, before] of snap) if (!existsSync(f) && before.backup) { copyFileSync(before.backup, f); restored.push(`recreated ${f}`); }
console.log(`[replay-stage] ${((Date.now() - t0) / 1000).toFixed(1)} s · tree restored (${restored.length} file(s) put back)`);
if (args.includes('--keep')) console.log(`[replay-stage] sandbox kept: ${sandbox}`);
else rmSync(sandbox, { recursive: true, force: true });
const matchLine = log.split('\n').find((l) => l.startsWith('[replay] RESULT:')) ?? '';
console.log('REPLAY_SUMMARY ' + JSON.stringify({ result: matchLine.replace('[replay] RESULT: ', ''), match: matchLine.includes('RESULT: MATCH'), digest, exit: r.status, unrestorable: unrestorable.length }));
if (unrestorable.length) {
  console.error(`[replay-stage] FAILED TO RESTORE ${unrestorable.length} file(s) — the replay changed them and no backup exists:\n  ${unrestorable.join('\n  ')}`);
  process.exit(6);
}
process.exit(r.status ?? 1);
