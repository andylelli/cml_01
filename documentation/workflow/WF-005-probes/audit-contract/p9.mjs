// OFF byte-identity, empirically: the fresh run bcc0d637 (2026-10-02, before A_110 landed) vs arm A' (2026-10-06, A_110
// flags OFF) — same project, same artifacts, every writer segment's prompt up to THE BOOK SO FAR.
import fs from "node:fs";
import readline from "node:readline";
const want = (o) => /^Agent9v2-Writer-S\d+-D1$/.test(o.agent);
const grab = async (file, run) => {
  const out = new Map();
  const rl = readline.createInterface({ input: fs.createReadStream(file) });
  for await (const line of rl) {
    if (!line.includes(run) || !line.includes("Writer-S")) continue;
    const o = JSON.parse(line);
    if (o.runId !== run || !want(o) || out.has(o.agent)) continue;
    out.set(o.agent, o.messages.find((m) => m.role === "user").content.split("\nTHE BOOK SO FAR")[0]);
  }
  return out;
};
const before = await grab("C:/CML/logs/llm-prompts-full.jsonl", "run_bcc0d637-0506-4314-908a-21c89d941c49");
const after = await grab("C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl", "resume-1791307885184");
console.log("segments before", before.size, "after", after.size);
for (const [agent, a] of after) {
  const b = before.get(agent);
  if (!b) { console.log(agent, "no counterpart"); continue; }
  const al = a.split("\n"), bl = b.split("\n");
  const diffs = [];
  for (let i = 0; i < Math.max(al.length, bl.length); i++) if (al[i] !== bl[i]) diffs.push(i);
  console.log(`${agent}: ${diffs.length} differing lines (${bl.length} -> ${al.length})`);
  if (agent.endsWith("S0-D1") || agent.endsWith("S7-D1")) for (const i of diffs.slice(0, 6)) console.log(`   [${i}] before: ${String(bl[i]).slice(0, 160)}\n        after:  ${String(al[i]).slice(0, 160)}`);
}
