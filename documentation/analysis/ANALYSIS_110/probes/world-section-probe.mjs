// For every v2 run in the prompt log: what did THE WORLD section of the chapter-1 writer prompt carry?
import fs from 'node:fs';
import readline from 'node:readline';
const rl = readline.createInterface({ input: fs.createReadStream('logs/llm-prompts-full.jsonl') });
const seen = new Map();
let v2calls = 0;
for await (const line of rl) {
  if (!line.includes('Agent9v2-Writer')) continue;
  let r; try { r = JSON.parse(line); } catch { continue; }
  if (!/^Agent9v2-Writer/.test(r.agent)) continue;
  v2calls++;
  const key = r.runId || r.projectId;
  if (seen.has(key)) continue;
  const text = (r.messages || []).map(m => typeof m.content === 'string' ? m.content : JSON.stringify(m.content)).join('\n');
  const i = text.indexOf('## THE WORLD');
  const body = i < 0 ? '(no THE WORLD section)' : text.slice(i + 13, text.indexOf('\n## ', i + 5)).trim().replace(/\n/g, ' ⏎ ');
  const places = [...text.matchAll(/^\s*Of this place at this hour[^:]*: (.*)$/gm)].map(m => m[1]);
  seen.set(key, { ts: r.timestamp.slice(0, 16), agent: r.agent, body: body.slice(0, 160), bodyWords: i < 0 ? 0 : body.split(/\s+/).length, place: places.length });
}
console.log('v2 writer calls in log:', v2calls, ' runs:', seen.size);
const tally = new Map();
for (const [k, e] of seen) { console.log(`${e.ts} ${String(k).slice(0, 26).padEnd(26)} worldWords=${String(e.bodyWords).padStart(3)} | ${e.body}`); tally.set(e.body, (tally.get(e.body) || 0) + 1); }
console.log('\ndistinct THE WORLD bodies:'); for (const [b, n] of tally) console.log(`  ${n}× ${b}`);
