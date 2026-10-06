import { editorCalls, parsePrompt, RUNS } from './ctx.mjs';
for (const [arm, run] of Object.entries(RUNS)) {
  const calls = editorCalls(run);
  for (const c of calls) { const p = parsePrompt(c.user); console.log(arm, c.agent, c.op, 'paras', p.paragraphs.length, 'findings', p.findings.length, 'resp', c.response ? c.response.length : null); }
}
