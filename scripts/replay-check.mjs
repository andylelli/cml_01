#!/usr/bin/env node
// CR-03 — replay every committed fixture in eval/replay/ strictly. Fails if any prompt differs by a
// byte from its cassette, any recorded call goes unrequested, or the prose digest moves.
//
//   npm run replay:check            (after build:all — it runs the dist)
//
// A deliberate prompt change fails here by design. Re-baseline with
//   node scripts/replay-fixture.mjs --name <name> --rebase
// and commit the cassette: its diff is the list of prompts the change altered.
import { spawnSync } from 'node:child_process';
import { existsSync, mkdtempSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const DIR = join('eval', 'replay');
const names = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.expected.json')).map((f) => f.replace('.expected.json', '')) : [];
if (names.length === 0) { console.error('[replay-check] no fixtures in eval/replay'); process.exit(1); }
const failures = [];
for (const name of names) {
  // A variant ({ variantOf, envOverrides }) replays its base fixture's cassette, store, ledger and digest
  // under a changed env — e.g. ENABLE_SCORING off, which pins every runner's non-scoring branch (CR-21).
  const own = JSON.parse(readFileSync(join(DIR, `${name}.expected.json`), 'utf8'));
  const base = own.variantOf ?? name;
  const expected = own.variantOf
    ? (() => { const b = JSON.parse(readFileSync(join(DIR, `${base}.expected.json`), 'utf8')); return { ...b, env: { ...b.env, ...own.envOverrides } }; })()
    : own;
  const envFile = own.variantOf ? join(mkdtempSync(join(tmpdir(), 'replay-variant-')), 'expected.json') : join(DIR, `${name}.expected.json`);
  if (own.variantOf) writeFileSync(envFile, JSON.stringify(expected));
  const ledger = join(DIR, `${base}.ledger.json.gz`);
  const r = spawnSync(process.execPath, ['scripts/replay-stage.mjs', '--cassette', join(DIR, `${base}.cassette.jsonl.gz`),
    '--project', expected.project, '--store', join(DIR, `${base}.store.json.gz`), '--env', envFile, '--stage', expected.stage ?? 'prose',
    ...(existsSync(ledger) ? ['--ledger', ledger] : [])], { encoding: 'utf8', maxBuffer: 256 * 1024 * 1024 });
  const out = r.stdout ?? '';
  const line = out.split('\n').find((l) => l.startsWith('REPLAY_SUMMARY '));
  const s = line ? JSON.parse(line.slice('REPLAY_SUMMARY '.length)) : null;
  const problems = [];
  if (!s) problems.push(`no summary (exit ${r.status}): ${(r.stderr ?? '').slice(-500)}`);
  else {
    if (!s.match) problems.push(s.result || 'NO MATCH');
    if (s.digest !== expected.digest) problems.push(`prose digest ${s.digest}, expected ${expected.digest}`);
    if (s.unrestorable) problems.push(`${s.unrestorable} file(s) outside the sandbox could not be restored`);
  }
  if (problems.length) {
    failures.push(name);
    console.error(`[replay-check] ${name}: FAIL\n  ${problems.join('\n  ')}`);
    for (const l of out.split('\n').filter((x) => x.startsWith('[replay] MISMATCH') || x.includes('never requested')).slice(0, 12)) console.error('  ' + l.slice(0, 400));
  } else {
    console.log(`[replay-check] ${name}: MATCH, digest ${s.digest}`);
  }
}
if (failures.length) {
  console.error(`[replay-check] ${failures.length} of ${names.length} fixture(s) failed. A deliberate prompt change? Re-baseline: node scripts/replay-fixture.mjs --name <name> --rebase`);
  process.exit(1);
}
console.log(`[replay-check] ${names.length} fixture(s): every prompt byte-identical, every recorded call served, prose unchanged.`);
