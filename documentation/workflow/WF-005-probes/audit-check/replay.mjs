import fs from 'node:fs';
import { editorCalls, parsePrompt, RUNS } from './ctx.mjs';
import { buildContract } from './contract.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const arm = process.argv[2] ?? 'B';
const lockedOn = process.argv.includes('--locked');
const { contract, castNames, lockedFacts } = buildContract(arm === 'B' ? '2026-10-06T17:43' : '2026-10-06T17:31');
const calls = editorCalls(RUNS[arm]).filter(c => c.response);
const bodyOf = (ch) => (ch.paragraphs ?? []).join('\n\n');
const regDetail = (ch) => PG.machineRegisterRate((ch.paragraphs ?? []).join(' '), PG.REGISTER_TELEMETRY_THRESHOLD);
const rows = [];
const tallies = [];
for (const c of calls) {
  const p = parsePrompt(c.user);
  const scene = contract.scenes.find(s => s.chapter === p.chapterNumber);
  const options = { scene, lockedValues: lockedOn ? lockedFacts : [], castNames, findings: p.findings };
  const list = PE.parseEditList(c.response);
  const real = PE.applyEditList({ paragraphs: p.paragraphs }, list, options);
  tallies.push({ agent: c.agent, ...real.outcome, unresolved: real.outcome.unresolved.length });
  // mirror loop for diagnostics
  const { validator } = PE.buildGuards(options);
  let current = { paragraphs: p.paragraphs };
  for (const edit of list.edits) {
    const find = edit.find, replace = edit.replace;
    const body = bodyOf(current);
    const paras = current.paragraphs.filter(x => x.includes(find));
    const count = body.split(find).length - 1;
    if (count !== 1 || paras.length !== 1) continue;
    const mutate = (input) => ({ ...input, paragraphs: input.paragraphs.map(x => x.includes(find) ? x.replace(find, replace) : x) });
    const before = PE.measureGuards(current, options);
    const out = PG.mutateThenValidate(current, mutate, validator);
    const mutated = mutate(current);
    const after = PE.measureGuards(mutated, options);
    const classes = (edit.addresses ?? []).map(i => p.findings[i]?.class).filter(Boolean);
    if (!out.applied || out.reverted) {
      const fell = PE.guardThatFell(before, after);
      const fallen = Object.keys(before).filter(k => after[k] < before[k] && k !== 'lengthWithin');
      const rb = regDetail(current), ra = regDetail(mutated);
      rows.push({ agent: c.agent, ch: p.chapterNumber, classes: classes.join('+'), attributed: fell ?? 'registerNotWorse(fallback)', fallen: fallen.join(','), reason: out.reason,
        strictDeletion: PE.isStrictDeletion ? PE.isStrictDeletion(find, replace) : null,
        reg: `${rb.hits}/${rb.sentences} -> ${ra.hits}/${ra.sentences}`, find, replace });
      continue;
    }
    // whole-chapter guards are checked against original — skip replication (handled by real tally)
    current = out.value;
  }
}
fs.writeFileSync(`rollbacks-${arm}${lockedOn?'-locked':''}.json`, JSON.stringify(rows, null, 1));
const sum = (k) => tallies.reduce((n, t) => n + (t[k] ?? 0), 0);
const rolled = {}; for (const t of tallies) for (const [g, n] of Object.entries(t.rolledBack)) rolled[g] = (rolled[g] ?? 0) + n;
console.log(`arm ${arm}: applied ${sum('applied')}, skipped ${sum('skipped')}, rolledBack`, rolled, 'unresolved', sum('unresolved'));
for (const t of tallies) console.log('  ', t.agent, 'applied', t.applied, 'skipped', t.skipped, JSON.stringify(t.rolledBack));
