#!/usr/bin/env node
// CR-03 — build (or re-baseline) a committed replay fixture in eval/replay/.
//
//   node scripts/replay-fixture.mjs --name <name> --project <projectId> --run <runId>   # new, from logs
//   node scripts/replay-fixture.mjs --name <name> --rebase                               # after a deliberate
//                                                                                        # prompt change
// A fixture is three files:
//   <name>.store.json.gz     the project's rows from data/store.json (everything resume-run reads)
//   <name>.cassette.jsonl.gz every LLM attempt of the stage, rebased to the CURRENT code
//   <name>.expected.json     the strict replay's result and the digest of the prose it produces
//
// New: extract the store rows, build a cassette from the logs (cassette-from-logs.mjs), rebase it to
// the current code, then replay strictly and record the digest. --rebase: rebase the committed
// cassette and re-record the digest. Either way the strict replay must MATCH or nothing is written.
// Rebasing writes the prompts the code sends NOW: review the cassette diff — it is the list of
// prompts your change altered.
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gunzipSync, gzipSync } from 'node:zlib';

const args = process.argv.slice(2);
const arg = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };
const name = arg('--name');
const rebaseOnly = args.includes('--rebase');
if (!name) { console.error('usage: --name <name> (--project <id> --run <runId> | --rebase)'); process.exit(2); }
const DIR = join('eval', 'replay');
mkdirSync(DIR, { recursive: true });
const storeFile = join(DIR, `${name}.store.json.gz`);
const cassetteFile = join(DIR, `${name}.cassette.jsonl.gz`);
const expectedFile = join(DIR, `${name}.expected.json`);
const tmp = join(tmpdir(), `cml-fixture-${process.pid}`);
mkdirSync(tmp, { recursive: true });
const node = (script, extra) => {
  const r = spawnSync(process.execPath, [script, ...extra], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  process.stdout.write((r.stdout ?? '').split('\n').filter((l) => /^\[replay|^cassette |REPLAY_SUMMARY/.test(l)).map((l) => l.slice(0, 300) + '\n').join(''));
  if (r.stderr) process.stderr.write(r.stderr.slice(-2000));
  const summary = (r.stdout ?? '').split('\n').find((l) => l.startsWith('REPLAY_SUMMARY '));
  return { status: r.status, summary: summary ? JSON.parse(summary.slice('REPLAY_SUMMARY '.length)) : null };
};

let project;
let source;
if (rebaseOnly) {
  if (!existsSync(expectedFile)) { console.error(`no fixture ${expectedFile}`); process.exit(2); }
  const prev = JSON.parse(readFileSync(expectedFile, 'utf8'));
  project = prev.project;
  source = join(tmp, 'previous.cassette.jsonl.gz');
  copyFileSync(cassetteFile, source);
} else {
  project = arg('--project');
  const run = arg('--run');
  if (!project || !run) { console.error('a new fixture needs --project and --run'); process.exit(2); }
  // The project's rows only: resume-run reads projects, specs, runs and artifacts.
  const store = JSON.parse(readFileSync(join('data', 'store.json'), 'utf8'));
  const mentions = (v) => JSON.stringify(v).includes(project);
  const pick = (obj) => Object.fromEntries(Object.entries(obj ?? {}).filter(([k, v]) => k === project || mentions(v)));
  const specIds = new Set(Object.keys(store.specs ?? {}).filter((id) => mentions(store.projects?.[project] ?? {}) && JSON.stringify(store.projects[project]).includes(id)));
  const extract = {
    projects: pick(store.projects),
    specs: Object.fromEntries(Object.entries(store.specs ?? {}).filter(([k, v]) => specIds.has(k) || mentions(v))),
    specOrder: (store.specOrder ?? []).filter(mentions),
    runs: pick(store.runs),
    runOrder: (store.runOrder ?? []).filter(mentions),
    runEvents: [],
    artifacts: (store.artifacts ?? []).filter(mentions),
    logs: [],
  };
  writeFileSync(storeFile, gzipSync(JSON.stringify(extract), { level: 9 }));
  console.log(`store extract ${storeFile}: ${extract.artifacts.length} artifacts`);
  source = join(tmp, 'from-logs.cassette.jsonl.gz');
  const built = node('scripts/cassette-from-logs.mjs', ['--run', run, '--out', source]);
  if (built.status !== 0) process.exit(built.status ?? 1);
}

// Rebase to the current code, then prove it: a strict replay must MATCH.
const rebased = join(tmp, 'rebased.cassette.jsonl.gz');
const rb = node('scripts/replay-stage.mjs', ['--cassette', source, '--project', project, '--store', storeFile, '--rebase', rebased]);
if (!rb.summary || rb.summary.unrestorable) { console.error('rebase failed'); process.exit(1); }
const proof = node('scripts/replay-stage.mjs', ['--cassette', rebased, '--project', project, '--store', storeFile]);
if (!proof.summary?.match) { console.error('the rebased cassette does not replay to a MATCH — nothing written'); process.exit(1); }

copyFileSync(rebased, cassetteFile);
const head = JSON.parse(gunzipSync(readFileSync(cassetteFile)).toString('utf8').split('\n')[0]).source;
writeFileSync(expectedFile, JSON.stringify({
  project,
  stage: 'prose',
  digest: proof.summary.digest,
  result: proof.summary.result,
  syntheticFailures: head.syntheticFailures ?? [],
  recordedFrom: head.runId,
  rebasedAt: head.rebasedAt,
}, null, 2) + '\n');
rmSync(tmp, { recursive: true, force: true });
console.log(`fixture ${name}: ${proof.summary.result}; digest ${proof.summary.digest}`);
