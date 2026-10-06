// A_111 V-14 (V2K-07). sumleak.mjs re-pointed at THIS checkout's dist and run through the REAL applyEditList, with
// PROSE_V2_AUDIT_FIXES unset and "1". An edit's own effect is read exactly by applying the list's first k and k+1
// edits from the same start (the whole-chapter guards measure against that start, as in a run). Counted: applied edits
// after which a never-fall guard, measured under the same flag state, is LOWER than before.
import { ROOT, editorCalls, parsePrompt, RUNS } from './vA-ctx.mjs';
import { buildContract } from './vA-contract.mjs';
const PE = await import(new URL('packages/prose-engine/dist/index.js', ROOT));
const NEVER = ['lockedValuesIntact', 'clockValuesIntact', 'castNamesIntact', 'clueCoverageNotWorse', 'noNewScaffold', 'noMalformedSplice', 'noNewDuplicate', 'registerNotWorse', 'noOrphanedTag'];
const setFlag = (on) => { if (on) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES; };
for (const flag of [false, true]) {
  for (const arm of ['A', 'B']) {
    process.env.PROSE_V2_CONTRACT_FIXES = arm === 'B' ? '1' : '0';
    process.env.PROSE_V2_TAIL_FINDING = '0'; // the guards as they ran (no A_111 P-2 exemption)
    setFlag(false);
    const { contract, castNames, lockedFacts } = buildContract(arm === 'B' ? '2026-10-06T17:43' : '2026-10-06T17:31');
    setFlag(flag);
    let applied = 0, leaked = 0; const rolled = {}; const fellBy = {};
    for (const c of editorCalls(RUNS[arm]).filter(c => c.response)) {
      const p = parsePrompt(c.user);
      const opts = { scene: contract.scenes.find(s => s.chapter === p.chapterNumber), lockedValues: lockedFacts, castNames, findings: p.findings };
      const start = { paragraphs: p.paragraphs };
      const edits = PE.parseEditList(c.response).edits;
      let prev = PE.applyEditList(start, { edits: [], cannot: [] }, opts);
      for (let k = 0; k < edits.length; k++) {
        const next = PE.applyEditList(start, { edits: edits.slice(0, k + 1), cannot: [] }, opts);
        if (next.outcome.applied > prev.outcome.applied) {
          applied++;
          const before = PE.measureGuards(prev.chapter, opts), after = PE.measureGuards(next.chapter, opts);
          const fell = NEVER.filter(g => after[g] < before[g]);
          if (fell.length) {
            leaked++;
            for (const g of fell) fellBy[g] = (fellBy[g] ?? 0) + 1;
            const rose = NEVER.filter(g => after[g] > before[g]);
            if (!flag) console.log(`  ${arm} ch${p.chapterNumber} FELL ${fell.map(g => `${g} ${before[g]}->${after[g]}`).join(', ')} | offset by ${rose.map(g => `${g} ${before[g]}->${after[g]}`).join(', ')}`);
          }
        }
        prev = next;
      }
      for (const [g, n] of Object.entries(prev.outcome.rolledBack)) rolled[g] = (rolled[g] ?? 0) + n;
    }
    console.log(`AUDIT ${flag ? 'ON ' : 'OFF'} arm ${arm}: ${leaked} of ${applied} applied edits passed with a never-fall guard lower than before ${JSON.stringify(fellBy)} | rolled back ${JSON.stringify(rolled)}`);
  }
}
setFlag(false);
