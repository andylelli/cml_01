// Every v2 editor call in logs/: each edit in isolation against the chapter the editor saw.
import fs from 'node:fs';
import readline from 'node:readline';
import { parsePrompt } from './ctx.mjs';
const PE = await import('file:///C:/CML/packages/prose-engine/dist/index.js');
const PG = await import('file:///C:/CML/packages/prose-guard/dist/index.js');
const prompts = [];
const rl = readline.createInterface({ input: fs.createReadStream('C:/CML/logs/llm-prompts-full.jsonl') });
for await (const line of rl) { if (!line.includes('Agent9v2-Editor')) continue; const j = JSON.parse(line); prompts.push({ t: j.timestamp, agent: j.agent, runId: j.runId, projectId: j.projectId, user: j.messages.find(m=>m.role==='user').content }); }
const resps = fs.readFileSync('C:/CML/logs/llm.jsonl','utf8').split('\n').filter(l => l.includes('Agent9v2-Editor')).map(l => JSON.parse(l)).filter(j => j.operation === 'chat_response');
const used = new Set();
const reg = (paras) => PG.machineRegisterRate(paras.join(' '), 3);
let calls = 0, edits = 0, rateFalls = 0, hitRises = 0, denomOnly = 0;
const byRun = new Map();
for (const p of prompts) {
  const ri = resps.findIndex((r, i) => !used.has(i) && r.runId === p.runId && r.agent === p.agent && r.timestamp >= p.t);
  if (ri < 0) continue; used.add(ri);
  let parsed; try { parsed = parsePrompt(p.user); } catch { continue; }
  calls++;
  const list = PE.parseEditList(resps[ri].response);
  const r0 = reg(parsed.paragraphs);
  for (const e of list.edits) {
    const hitsIn = parsed.paragraphs.filter(x => x.includes(e.find)).length;
    if (hitsIn !== 1) continue;
    edits++;
    const after = parsed.paragraphs.map(x => x.includes(e.find) ? x.replace(e.find, e.replace) : x);
    const r1 = reg(after);
    const fell = -Math.round(r1.rate * 1000) < -Math.round(r0.rate * 1000);
    if (fell) { rateFalls++; if (r1.hits > r0.hits) hitRises++; else denomOnly++;
      const k = p.projectId; const v = byRun.get(k) ?? { falls: 0, denom: 0, runs: new Set() }; v.falls++; if (r1.hits <= r0.hits) v.denom++; v.runs.add(p.runId); byRun.set(k, v); }
  }
}
console.log({ calls, edits, rateFalls, hitRises, denomOnly });
for (const [k, v] of byRun) console.log(k, 'runs', v.runs.size, 'rate-guard falls', v.falls, 'of which hits unchanged or fewer', v.denom);
