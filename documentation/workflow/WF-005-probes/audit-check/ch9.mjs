// Arm B, segment 8 (chapter 9): every paragraph of each draft's writer output that satisfies namesAsCulprit.
import fs from 'node:fs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const lines = fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl', 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
for (const d of [1, 2, 3]) {
  const resps = lines.filter(j => j.runId === 'resume-1791308574179' && j.agent === `Agent9v2-Writer-S8-D${d}` && j.operation === 'chat_response');
  const text = resps.map(r => r.response).join('\n\n');
  const paras = text.split(/\n\s*\n/);
  const hits = paras.filter(p => PE.namesAsCulprit(p, 'Isabel Morton'));
  console.log(`draft ${d}: ${resps.length} response(s), ${text.split(/\s+/).length} words, paragraphs naming Isabel Morton as culprit: ${hits.length}`);
  for (const h of hits) {
    console.log('   ', h.slice(0, 300));
    console.log('    with "cut through" -> "carried through":', PE.namesAsCulprit(h.replace(/cut through/g, 'carried through'), 'Isabel Morton'));
  }
}
