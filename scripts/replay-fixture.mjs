#!/usr/bin/env node
// CR-03 — build (or re-baseline) a committed replay fixture in eval/replay/.
//
//   node scripts/replay-fixture.mjs --name <name> --project <projectId> --run <runId>   # new, from logs
//   node scripts/replay-fixture.mjs --name <name> --rebase                               # after a deliberate
//                                                                                        # prompt change
// A fixture is three files:
//   <name>.store.json.gz     the project's rows from data/store.json (everything resume-run reads)
//   <name>.cassette.jsonl.gz every LLM attempt of the stage, rebased to the CURRENT code
//   <name>.expected.json     the strict replay's result, the digest of the prose it produces, and the
//                            flag environment it replays under
//
// New: extract the store rows, build a cassette from the logs (cassette-from-logs.mjs), rebase it to
// the current code, then replay strictly and record the digest. --rebase: rebase the committed
// cassette and re-record the digest. Either way the strict replay must MATCH or nothing is written.
// Rebasing writes the prompts the code sends NOW: review the cassette diff — it is the list of
// prompts your change altered. Needs build:all (it runs the dist).
import { spawnSync } from 'node:child_process';
import { copyFileSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { gzipSync } from 'node:zlib';
// The cassette format has ONE body: @cml/llm-client.
import { readCassette } from '../packages/llm-client/dist/index.js';

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

/**
 * The flag environment this fixture replays under — read through the pipeline's OWN loadEnvFiles, in a
 * child with an empty environment, so it is exactly what a resume on this machine reads. Credentials and
 * endpoints are dropped: a replay never calls a model. Committed in <name>.expected.json and applied by
 * replay-stage --env, so CI (which has no .env.local) replays under the same flags.
 */
const SECRET = /^(AZURE_|ANTHROPIC_|OPENAI_)|KEY|SECRET|TOKEN|PASSWORD|CONNECTION|ENDPOINT/i;
function captureEnv() {
  const base = Object.fromEntries(['PATH', 'Path', 'SystemRoot', 'HOME', 'USERPROFILE', 'TEMP', 'TMP']
    .filter((k) => process.env[k]).map((k) => [k, process.env[k]]));
  const code = "const m = await import('./apps/worker/dist/jobs/cli-runtime.js'); const b = { ...process.env }; " +
    "m.loadEnvFiles(process.cwd()); const o = {}; for (const [k, v] of Object.entries(process.env)) if (b[k] === undefined) o[k] = v; " +
    "console.log('ENV_JSON ' + JSON.stringify(o));";
  const r = spawnSync(process.execPath, ['--input-type=module', '-e', code], { env: base, encoding: 'utf8' });
  const line = (r.stdout ?? '').split(/\r?\n/).find((l) => l.startsWith('ENV_JSON '));
  if (r.status !== 0 || !line) throw new Error('could not read the flag environment: ' + (r.stderr ?? ''));
  const all = JSON.parse(line.slice('ENV_JSON '.length));
  return Object.fromEntries(Object.entries(all).filter(([k]) => !SECRET.test(k)).sort(([a], [b]) => a.localeCompare(b)));
}

const node = (script, extra) => {
  const r = spawnSync(process.execPath, [script, ...extra], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const out = (r.stdout ?? '').split(/\r?\n/);
  process.stdout.write(out.filter((l) => /^\[replay|^cassette |REPLAY_SUMMARY/.test(l)).map((l) => l.slice(0, 300)).join('\n') + '\n');
  if (r.stderr) process.stderr.write(r.stderr.slice(-2000));
  const summary = out.find((l) => l.startsWith('REPLAY_SUMMARY '));
  return { status: r.status, summary: summary ? JSON.parse(summary.slice('REPLAY_SUMMARY '.length)) : null };
};

let project;
let source;
if (rebaseOnly) {
  if (!existsSync(expectedFile)) { console.error(`no fixture ${expectedFile}`); process.exit(2); }
  project = JSON.parse(readFileSync(expectedFile, 'utf8')).project;
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
  const projectJson = JSON.stringify(store.projects?.[project] ?? {});
  const extract = {
    projects: pick(store.projects),
    specs: Object.fromEntries(Object.entries(store.specs ?? {}).filter(([k, v]) => projectJson.includes(k) || mentions(v))),
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

// Rebase to the current code under the recorded environment, then prove it: a strict replay must MATCH.
const env = captureEnv();
const envFile = join(tmp, 'env.json');
writeFileSync(envFile, JSON.stringify({ env }));
console.log(`flag environment: ${Object.keys(env).length} keys from this machine's .env.local (credentials and endpoints dropped)`);
const rebased = join(tmp, 'rebased.cassette.jsonl.gz');
const rb = node('scripts/replay-stage.mjs', ['--cassette', source, '--project', project, '--store', storeFile, '--env', envFile, '--rebase', rebased]);
if (!rb.summary || rb.summary.unrestorable) { console.error('rebase failed'); process.exit(1); }
const proof = node('scripts/replay-stage.mjs', ['--cassette', rebased, '--project', project, '--store', storeFile, '--env', envFile]);
if (!proof.summary?.match) { console.error('the rebased cassette does not replay to a MATCH — nothing written'); process.exit(1); }

copyFileSync(rebased, cassetteFile);
const head = readCassette(cassetteFile).source;
writeFileSync(expectedFile, JSON.stringify({
  project,
  stage: 'prose',
  digest: proof.summary.digest,
  result: proof.summary.result,
  syntheticFailures: head.syntheticFailures ?? [],
  recordedFrom: head.runId,
  rebasedAt: head.rebasedAt,
  env,
}, null, 2) + '\n');
rmSync(tmp, { recursive: true, force: true });
console.log(`fixture ${name}: ${proof.summary.result}; digest ${proof.summary.digest}`);
