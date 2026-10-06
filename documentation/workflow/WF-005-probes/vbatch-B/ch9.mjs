// Arm B, segment 8 (chapter 9): every paragraph of each draft's writer output that satisfies namesAsCulprit, OFF and ON.
import fs from 'node:fs';
const PE = await import('file:///C:/CML/.claude/worktrees/agent-ae0a3a4082bca2fd2/packages/prose-engine/dist/index.js');
const lines = fs.readFileSync('C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl', 'utf8').split('\n').filter(Boolean).map(l => JSON.parse(l));
const people = { victim: 'Reginald Gresham', cast: [] };
for (const flag of [false, true]) {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
  console.log(flag ? '--- ON' : '--- OFF');
  for (const d of [1, 2, 3]) {
    const resps = lines.filter(j => j.runId === 'resume-1791308574179' && j.agent === `Agent9v2-Writer-S8-D${d}` && j.operation === 'chat_response');
    const text = resps.map(r => r.response).join('\n\n');
    const paras = text.split(/\n\s*\n/);
    const hits = paras.filter(p => PE.namesAsCulprit(p, 'Isabel Morton', people));
    console.log(`draft ${d}: ${resps.length} response(s), ${text.split(/\s+/).length} words, paragraphs naming Isabel Morton as culprit: ${hits.length}`);
    for (const h of hits) console.log('   ', h.slice(0, 220));
  }
}
delete process.env.PROSE_V2_AUDIT_FIXES;
