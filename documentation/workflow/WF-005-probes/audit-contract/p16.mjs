import fs from "node:fs";
import readline from "node:readline";
const rl = readline.createInterface({ input: fs.createReadStream("C:/CML/logs/llm-prompts-full.jsonl") });
const byRun = new Map();
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S")) continue;
  const o = JSON.parse(line);
  if (!/^Agent9v2-Writer-S\d+-D1$/.test(o.agent)) continue;
  const head = o.messages.find((m) => m.role === "user").content.split("\nTHE BOOK SO FAR")[0];
  const contracts = head.split("## THE CHAPTERS TO WRITE")[1] ?? "";
  const reveal = Number((head.match(/They are named in chapter (\d+)/) ?? [])[1]);
  for (const block of contracts.split(/\n(?==== CHAPTER )/)) {
    const ch = Number((block.match(/^=== CHAPTER (\d+)/) ?? [])[1]);
    if (!ch) continue;
    if (/ {2}The body: .* — found dead/.test(block)) { if (!byRun.has(o.runId)) byRun.set(o.runId, { reveal, chs: new Set() }); byRun.get(o.runId).chs.add(ch); }
  }
}
let multi = 0, late = 0;
for (const [run, v] of byRun) { const chs = [...v.chs].sort((a, b) => a - b); if (chs.length > 1) multi++; if (chs.some((x) => x >= v.reveal)) late++; if (chs.length > 1) console.log(run, "reveal", v.reveal, "body line in chapters", chs.join(",")); }
console.log(`runs: ${byRun.size}; body line in 2+ chapters: ${multi}; in a chapter at/after the reveal: ${late}`);
