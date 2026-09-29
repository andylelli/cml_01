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
import { existsSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = join('eval', 'replay');
const names = existsSync(DIR) ? readdirSync(DIR).filter((f) => f.endsWith('.expected.json')).map((f) => f.replace('.expected.json', '')) : [];
if (names.length === 0) { console.error('[replay-check] no fixtures in eval/replay'); process.exit(1); }
const failures = [];
for (const name of names) {
  const expected = JSON.parse(readFileSync(join(DIR, `${name}.expected.json`), 'utf8'));
  const ledger = join(DIR, `${name}.ledger.json.gz`);
  const r = spawnSync(process.execPath, ['scripts/replay-stage.mjs', '--cassette', join(DIR, `${name}.cassette.jsonl.gz`),
    '--project', expected.project, '--store', join(DIR, `${name}.store.json.gz`), '--env', join(DIR, `${name}.expected.json`), '--stage', expected.stage ?? 'prose',
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
