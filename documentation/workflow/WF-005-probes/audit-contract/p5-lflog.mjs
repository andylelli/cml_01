// For every v2 chapter-1 writer prompt in the main prompt log: was it a resume, and does THE CLOCK carry any
// locked fact of the project's primary device (value AND description, as chronologySection prints it)?
import fs from "node:fs";
import readline from "node:readline";
const store = JSON.parse(fs.readFileSync("C:/CML/data/store.json", "utf8"));
const dev = new Map();
for (const a of store.artifacts) if (a.type === "hard_logic_devices") dev.set(a.projectId, a.payload?.devices?.[0]?.lockedFacts ?? []);
const rl = readline.createInterface({ input: fs.createReadStream("C:/CML/logs/llm-prompts-full.jsonl") });
const rows = [];
for await (const line of rl) {
  if (!line.includes("Agent9v2-Writer-S0-D1")) continue;
  const o = JSON.parse(line);
  if (o.agent !== "Agent9v2-Writer-S0-D1") continue;
  const user = o.messages.find((m) => m.role === "user")?.content ?? "";
  const clock = (user.split(/\n(?=## )/).find((s) => s.startsWith("## THE CLOCK")) ?? "");
  const facts = dev.get(o.projectId) ?? [];
  const shown = facts.filter((f) => clock.includes(String(f.description ?? "").trim().slice(0, 40)) || clock.includes(`${f.value} — ${f.id}`));
  const x51 = /alibi_location_|murder_weapon/.test(clock);
  rows.push({ ts: o.timestamp.slice(0, 16), run: o.runId, resume: /^resume-/.test(o.runId), facts: facts.length, shown: shown.length, x51 });
}
for (const r of rows) console.log(`${r.ts} ${r.run.padEnd(28)} resume=${String(r.resume).padEnd(5)} deviceFacts=${r.facts} shownInClock=${r.shown} x51InClock=${r.x51}`);
const t = (f) => rows.filter(f).length;
console.log(`fresh runs: ${t((r) => !r.resume)}, with a device fact in THE CLOCK: ${t((r) => !r.resume && r.shown > 0)}; resumes: ${t((r) => r.resume)}, with a device fact: ${t((r) => r.resume && r.shown > 0)}, with X51 facts: ${t((r) => r.resume && r.x51)} (fresh with X51: ${t((r) => !r.resume && r.x51)})`);
