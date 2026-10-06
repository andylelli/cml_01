// Every logged v2 editor edit, in isolation against the chapter the editor saw: does it remove a clock-value occurrence
// (count of extractClockValues falls, or the dial multiset changes)? Which finding class asked for it?
import fs from 'node:fs';
import readline from 'node:readline';
import { parsePrompt } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const CML = await import('file:///C:/CML/packages/cml/dist/index.js');
const sources = [
  ['C:/CML/logs/llm-prompts-full.jsonl', 'C:/CML/logs/llm.jsonl'],
  ['C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl', 'C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl'],
];
const body = (ps) => ps.join('\n\n');
const dials = (ps) => CML.extractClockValues(body(ps)).map(v => v.dial).sort((a, b) => a - b).join(',');
const count = (ps) => CML.extractClockValues(body(ps)).length;
const byClass = {}; const samples = [];
const projects = new Set();
for (const [pf, rf] of sources) {
  const prompts = [];
  const rl = readline.createInterface({ input: fs.createReadStream(pf) });
  for await (const line of rl) { if (!line.includes('Agent9v2-Editor')) continue; const j = JSON.parse(line); prompts.push({ t: j.timestamp, agent: j.agent, runId: j.runId, projectId: j.projectId, user: j.messages.find(m => m.role === 'user').content }); }
  const resps = fs.readFileSync(rf, 'utf8').split('\n').filter(l => l.includes('Agent9v2-Editor')).map(l => JSON.parse(l)).filter(j => j.operation === 'chat_response');
  const used = new Set();
  for (const p of prompts) {
    if (p.runId === 'resume-1791313282573') continue; // the run in progress
    const ri = resps.findIndex((r, i) => !used.has(i) && r.runId === p.runId && r.agent === p.agent && r.timestamp >= p.t);
    if (ri < 0) continue; used.add(ri);
    let parsed; try { parsed = parsePrompt(p.user); } catch { continue; }
    const list = PE.parseEditList(resps[ri].response);
    for (const e of list.edits) {
      if (parsed.paragraphs.filter(x => x.includes(e.find)).length !== 1) continue;
      const after = parsed.paragraphs.map(x => x.includes(e.find) ? x.replace(e.find, e.replace) : x);
      const cls = [...new Set((e.addresses ?? []).map(i => parsed.findings[i]?.class).filter(Boolean))].join('+') || '(none)';
      const row = (byClass[cls] ??= { edits: 0, removesClock: 0 });
      row.edits++;
      if (count(after) < count(parsed.paragraphs) || dials(after) !== dials(parsed.paragraphs)) {
        row.removesClock++; projects.add(p.projectId);
        if (/recap|repeat_passage|copied_sentence/.test(cls)) { const o = PE.applyEditList({ paragraphs: parsed.paragraphs }, { edits: [e], cannot: [] }, { lockedValues: [], castNames: [], findings: parsed.findings }).outcome; samples.push(JSON.stringify(o.rolledBack) + " applied=" + o.applied + " " + cls + " :: distinct dial SET unchanged=" + ([...new Set(CML.extractClockValues(body(after)).map(v=>v.dial))].sort().join() === [...new Set(CML.extractClockValues(body(parsed.paragraphs)).map(v=>v.dial))].sort().join())); }
        if (false) samples.push(`${cls} | F: ${e.find.slice(0, 130)} | R: ${e.replace.slice(0, 90)}`);
      }
    }
  }
}
const sorted = Object.entries(byClass).filter(([, r]) => r.removesClock > 0).sort((a, b) => b[1].removesClock - a[1].removesClock);
for (const [c, r] of sorted) console.log(String(r.removesClock).padStart(3), 'of', String(r.edits).padStart(3), c);
const tot = Object.values(byClass).reduce((a, r) => ({ e: a.e + r.edits, c: a.c + r.removesClock }), { e: 0, c: 0 });
console.log('total edits', tot.e, 'touching a clock value (reverted by clockValuesIntact):', tot.c, 'projects', projects.size);
for (const s of samples) console.log('   ', s);
