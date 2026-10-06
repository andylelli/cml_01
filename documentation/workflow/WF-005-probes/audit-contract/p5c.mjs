// Fresh v2 runs in the main prompt log: which registry facts reached THE CLOCK, by the run's own registry file.
import fs from "node:fs";
import readline from "node:readline";
const rl = readline.createInterface({ input: fs.createReadStream("C:/CML/logs/llm-prompts-full.jsonl") });
const done = new Set();
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S0-D1")) continue;
  const o = JSON.parse(line);
  if (o.agent !== "Agent9v2-Writer-S0-D1" || /^resume-/.test(o.runId) || done.has(o.runId)) continue;
  done.add(o.runId);
  const f = `C:/CML/apps/worker/logs/locked-facts-${o.runId}.json`;
  if (!fs.existsSync(f)) { console.log(o.runId, "no registry file"); continue; }
  const reg = JSON.parse(fs.readFileSync(f, "utf8")).registry;
  const user = o.messages.find((m) => m.role === "user").content;
  const clock = user.split(/\n(?=## )/).find((s) => s.startsWith("## THE CLOCK")) ?? "";
  const tokens = Math.ceil(clock.split("\n").slice(1).join("\n").length / 4);
  const missing = reg.filter((r) => !clock.includes(`  ${String(r.value).replace(/\s+/g, " ").trim()} — `));
  console.log(`${o.runId}: registry ${reg.length}, missing from THE CLOCK ${missing.length}: ${missing.map((m) => `${m.id}="${m.value}"`).join(", ")}  (clock body ~${tokens} tokens)`);
}
