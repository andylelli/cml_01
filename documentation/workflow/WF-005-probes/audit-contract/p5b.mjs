import fs from "node:fs";
import readline from "node:readline";
import { cases } from "./cases.mjs";
const src = new Map(cases.map((c) => [c.id, c]));
const rl = readline.createInterface({ input: fs.createReadStream("C:/CML/logs/llm-prompts-full.jsonl") });
const seen = new Map();
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S0-D1")) continue;
  const o = JSON.parse(line);
  if (o.agent !== "Agent9v2-Writer-S0-D1" || !/^resume-/.test(o.runId)) continue;
  seen.set(o.runId, o.projectId);
}
const a110 = fs.readFileSync("C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl", "utf8").split("\n").filter(Boolean).map(JSON.parse).filter((o) => o.agent === "Agent9v2-Writer-S0-D1");
for (const o of a110) seen.set(o.runId, o.projectId);
let withReg = 0;
for (const [run, pid] of seen) { const c = src.get(pid); const reg = c?.lfSource === "log"; if (reg) withReg++; console.log(run, pid.slice(0, 22), "original registry file:", c ? c.lfSource : "no case", reg ? `(${c.input.lockedFacts.length} facts)` : ""); }
console.log(`resumed v2 runs: ${seen.size}; whose original run wrote a locked-fact registry: ${withReg}`);
