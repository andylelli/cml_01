// A_111 V-16b (V2K-09), noNewScaffold. scaffold.mjs re-pointed at THIS checkout's dist and run through the REAL
// applyEditList with PROSE_V2_AUDIT_FIXES unset and "1": noNewScaffold rollbacks over every logged v2 editor call, and what
// the guard counts in the canon and in the v2-era manuscripts (it should count nothing in either).
import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import { ROOT, parsePrompt } from './vA-ctx.mjs';
const PE = await import(new URL('packages/prose-engine/dist/index.js', ROOT));
const sources = [['C:/CML/logs/llm-prompts-full.jsonl', 'C:/CML/logs/llm.jsonl'], ['C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl', 'C:/CML/.claude/worktrees/a110-pair/logs/llm.jsonl']];
const calls = [];
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
    calls.push({ parsed, list: PE.parseEditList(resps[ri].response) });
  }
}
const scaffoldIn = (text) => -PE.measureGuards({ paragraphs: [text] }, { lockedValues: [], castNames: [] }).noNewScaffold;
const canon = fs.readdirSync('C:/CML/library/texts').filter((f) => f.endsWith('.txt')).map((f) => fs.readFileSync(path.join('C:/CML/library/texts', f), 'utf8'));
const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(path.join(d, e.name)) : e.name.endsWith('.md') ? [path.join(d, e.name)] : []));
const v2era = walk('C:/CML/stories').filter((f) => /story_202609(2[2-9]|30)|story_2026100/.test(f)).map((f) => fs.readFileSync(f, 'utf8'));
for (const flag of [false, true]) {
  if (flag) process.env.PROSE_V2_AUDIT_FIXES = '1'; else delete process.env.PROSE_V2_AUDIT_FIXES;
  const rolled = {}; let applied = 0;
  for (const { parsed, list } of calls) {
    const r = PE.applyEditList({ paragraphs: parsed.paragraphs }, list, { lockedValues: [], castNames: [], findings: parsed.findings });
    applied += r.outcome.applied;
    for (const [g, n] of Object.entries(r.outcome.rolledBack)) rolled[g] = (rolled[g] ?? 0) + n;
  }
  const canonHits = canon.reduce((n, t) => n + scaffoldIn(t), 0);
  const v2Hits = v2era.reduce((n, t) => n + scaffoldIn(t), 0);
  console.log(`AUDIT ${flag ? 'ON ' : 'OFF'} editor calls ${calls.length}: noNewScaffold rollbacks ${rolled.noNewScaffold ?? 0} (applied ${applied}) | counted as scaffold: canon ${canon.length} works ${canonHits}, v2-era manuscripts ${v2era.length} ${v2Hits} | identifier known positive ${scaffoldIn('She checked clue_3 against act_2.')}`);
}
delete process.env.PROSE_V2_AUDIT_FIXES;
