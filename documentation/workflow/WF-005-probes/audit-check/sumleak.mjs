// Applied edits (by the real validator) in which a "never fall" guard FELL, offset by another guard rising.
import { editorCalls, parsePrompt, RUNS } from './ctx.mjs';
import { buildContract } from './contract.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const NEVER = ['lockedValuesIntact', 'clockValuesIntact', 'castNamesIntact', 'clueCoverageNotWorse', 'noNewScaffold', 'noMalformedSplice', 'noNewDuplicate', 'registerNotWorse', 'noOrphanedTag'];
for (const arm of ['A', 'B']) {
  process.env.PROSE_V2_CONTRACT_FIXES = arm === 'B' ? '1' : '0';
  process.env.PROSE_V2_TAIL_FINDING = '0'; // the guards as they ran (no A_111 P-2 exemption)
  const { contract, castNames, lockedFacts } = buildContract(arm === 'B' ? '2026-10-06T17:43' : '2026-10-06T17:31');
  let applied = 0, leaked = 0;
  for (const c of editorCalls(RUNS[arm]).filter(c => c.response)) {
    const p = parsePrompt(c.user);
    const opts = { scene: contract.scenes.find(s => s.chapter === p.chapterNumber), lockedValues: lockedFacts, castNames, findings: p.findings };
    const { validator } = PE.buildGuards(opts);
    let cur = { paragraphs: p.paragraphs };
    for (const e of PE.parseEditList(c.response).edits) {
      const body = cur.paragraphs.join('\n\n');
      if (body.split(e.find).length - 1 !== 1 || cur.paragraphs.filter(x => x.includes(e.find)).length !== 1) continue;
      const mutate = (i) => ({ ...i, paragraphs: i.paragraphs.map(x => x.includes(e.find) ? x.replace(e.find, e.replace) : x) });
      const before = PE.measureGuards(cur, opts);
      const out = PG.mutateThenValidate(cur, mutate, validator);
      if (!out.applied || out.reverted) continue;
      applied++;
      const after = PE.measureGuards(out.value, opts);
      const fell = NEVER.filter(k => after[k] < before[k]);
      if (fell.length) {
        leaked++;
        const rose = NEVER.filter(k => after[k] > before[k]);
        const cls = (e.addresses ?? []).map(i => p.findings[i]?.class).join('+');
        console.log(`${arm} ch${p.chapterNumber} [${cls}] FELL ${fell.map(k => `${k} ${before[k]}->${after[k]}`).join(', ')} | offset by ${rose.map(k => `${k} ${before[k]}->${after[k]}`).join(', ')}\n     F: ${e.find.slice(0, 150)}\n     R: ${e.replace.slice(0, 150)}`);
      }
      cur = out.value;
    }
  }
  console.log(`arm ${arm}: ${leaked} of ${applied} applied edits passed with a never-fall guard lower than before`);
}
