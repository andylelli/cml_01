// A_111 V-13 (V2K-04). clockguard2/3 re-pointed at THIS checkout's dist. Every logged v2 editor edit, applied ALONE to
// the chapter the editor saw, through the REAL applyEditList with PROSE_V2_AUDIT_FIXES unset and "1". Edits that
// remove a clock-value occurrence are split by whether the chapter's DISTINCT dial set is unchanged (a restated time
// goes, every time stays) or changed (a time vanishes or a new one appears: the known positive, which must still revert).
import fs from 'node:fs';
import readline from 'node:readline';
import { ROOT, parsePrompt } from './vA-ctx.mjs';
const PE = await import(new URL('packages/prose-engine/dist/index.js', ROOT));
const CML = await import(new URL('packages/cml/dist/index.js', ROOT));
const sources = [
  ['C:/CML/logs/llm-prompts-full.jsonl', 'C:/CML/logs/llm.jsonl'],
  ['C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl', 'C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl'],
];
const SKIP_RUNS = new Set(['resume-1791313282573']); // in progress when the audit ran; kept out so the numbers compare
const body = (ps) => ps.join('\n\n');
const dials = (ps) => CML.extractClockValues(body(ps)).map(v => v.dial).sort((a, b) => a - b).join(',');
const setOf = (ps) => [...new Set(CML.extractClockValues(body(ps)).map(v => v.dial))].sort((a, b) => a - b).join(',');
const count = (ps) => CML.extractClockValues(body(ps)).length;
const REP = /recap|repeat_passage|copied_sentence/;
const tally = {};
const bump = (key, field) => { const row = (tally[key] ??= { edits: 0, clockOFF: 0, clockON: 0, appliedOFF: 0, appliedON: 0 }); row[field]++; };
const alone = (paragraphs, e, findings, flag) => {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
  const r = PE.applyEditList({ paragraphs }, { edits: [e], cannot: [] }, { lockedValues: [], castNames: [], findings });
  delete process.env.PROSE_V2_AUDIT_FIXES;
  return r.outcome;
};
let total = 0;
for (const [pf, rf] of sources) {
  const prompts = [];
  const rl = readline.createInterface({ input: fs.createReadStream(pf) });
  for await (const line of rl) { if (!line.includes('Agent9v2-Editor')) continue; const j = JSON.parse(line); prompts.push({ t: j.timestamp, agent: j.agent, runId: j.runId, projectId: j.projectId, user: j.messages.find(m => m.role === 'user').content }); }
  const resps = fs.readFileSync(rf, 'utf8').split('\n').filter(l => l.includes('Agent9v2-Editor')).map(l => JSON.parse(l)).filter(j => j.operation === 'chat_response');
  const used = new Set();
  for (const p of prompts) {
    if (SKIP_RUNS.has(p.runId)) continue;
    const ri = resps.findIndex((r, i) => !used.has(i) && r.runId === p.runId && r.agent === p.agent && r.timestamp >= p.t);
    if (ri < 0) continue; used.add(ri);
    let parsed; try { parsed = parsePrompt(p.user); } catch { continue; }
    for (const e of PE.parseEditList(resps[ri].response).edits) {
      if (parsed.paragraphs.filter(x => x.includes(e.find)).length !== 1) continue;
      total++;
      const after = parsed.paragraphs.map(x => x.includes(e.find) ? x.replace(e.find, e.replace) : x);
      if (!(count(after) < count(parsed.paragraphs) || dials(after) !== dials(parsed.paragraphs))) continue;
      const cls = [...new Set((e.addresses ?? []).map(i => parsed.findings[i]?.class).filter(Boolean))].join('+') || '(none)';
      const kind = setOf(after) === setOf(parsed.paragraphs) ? 'restated (distinct set unchanged)' : 'distinct set CHANGED';
      for (const key of [kind, `${kind} :: repetition class`].slice(0, REP.test(cls) ? 2 : 1)) {
        bump(key, 'edits');
        const off = alone(parsed.paragraphs, e, parsed.findings, false);
        const on = alone(parsed.paragraphs, e, parsed.findings, true);
        if (off.rolledBack.clockValuesIntact) bump(key, 'clockOFF');
        if (on.rolledBack.clockValuesIntact) bump(key, 'clockON');
        if (off.applied) bump(key, 'appliedOFF');
        if (on.applied) bump(key, 'appliedON');
      }
    }
  }
}
console.log(`logged editor edits with a unique find: ${total}`);
for (const [k, r] of Object.entries(tally)) console.log(`${k.padEnd(52)} edits ${String(r.edits).padStart(3)} | reverted by clockValuesIntact OFF ${r.clockOFF} -> ON ${r.clockON} | applied OFF ${r.appliedOFF} -> ON ${r.appliedON}`);
