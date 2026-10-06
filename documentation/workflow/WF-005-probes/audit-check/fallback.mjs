// Rollbacks that guardThatFell cannot attribute (null) and the tally therefore files under "registerNotWorse".
import fs from 'node:fs';
import readline from 'node:readline';
import { parsePrompt } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const sources = [['C:/CML/logs/llm-prompts-full.jsonl', 'C:/CML/logs/llm.jsonl'], ['C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl', 'C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl']];
let reverted = 0, nullAttr = 0; const reasons = {}; const samples = [];
for (const [pf, rf] of sources) {
  const prompts = [];
  const rl = readline.createInterface({ input: fs.createReadStream(pf) });
  for await (const line of rl) { if (!line.includes('Agent9v2-Editor')) continue; const j = JSON.parse(line); prompts.push({ t: j.timestamp, agent: j.agent, runId: j.runId, user: j.messages.find((m) => m.role === 'user').content }); }
  const resps = fs.readFileSync(rf, 'utf8').split('\n').filter((l) => l.includes('Agent9v2-Editor')).map((l) => JSON.parse(l)).filter((j) => j.operation === 'chat_response');
  const used = new Set();
  for (const p of prompts) {
    if (p.runId === 'resume-1791313282573') continue;
    const ri = resps.findIndex((r, i) => !used.has(i) && r.runId === p.runId && r.agent === p.agent && r.timestamp >= p.t);
    if (ri < 0) continue; used.add(ri);
    let parsed; try { parsed = parsePrompt(p.user); } catch { continue; }
    const opts = { lockedValues: [], castNames: [], findings: parsed.findings };
    const { validator } = PE.buildGuards(opts);
    let cur = { paragraphs: parsed.paragraphs };
    for (const e of PE.parseEditList(resps[ri].response).edits) {
      const body = cur.paragraphs.join('\n\n');
      if (body.split(e.find).length - 1 !== 1 || cur.paragraphs.filter((x) => x.includes(e.find)).length !== 1) continue;
      const mutate = (i) => ({ ...i, paragraphs: i.paragraphs.map((x) => (x.includes(e.find) ? x.replace(e.find, e.replace) : x)) });
      const before = PE.measureGuards(cur, opts);
      const out = PG.mutateThenValidate(cur, mutate, validator);
      if (out.applied && !out.reverted) { cur = out.value; continue; }
      reverted++;
      if (PE.guardThatFell(before, PE.measureGuards(mutate(cur), opts)) === null) {
        nullAttr++;
        const r = String(out.reason).replace(/"[^"]*"/g, '"…"').slice(0, 80);
        reasons[r] = (reasons[r] ?? 0) + 1;
        if (samples.length < 4) samples.push(`${p.runId} ${p.agent}: ${out.reason.slice(0, 160)}`);
      }
    }
  }
}
console.log({ reverted, attributedByFallbackToRegisterNotWorse: nullAttr, reasons });
for (const s of samples) console.log('   ', s);
