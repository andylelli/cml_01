// Real prompts: "The clock: between A and B" lines (reversed?), and digit times inside THE CLOCK.
import fs from "node:fs";
import readline from "node:readline";
const cml = await import("file:///C:/CML/packages/cml/dist/index.js");
const files = ["C:/CML/logs/llm-prompts-full.jsonl", "C:/CML/.claude/worktrees/a110-pair/logs/llm-prompts-full.jsonl"];
const windows = new Map(); const digitRuns = new Set(); const runs = new Set(); const twoSpell = new Set();
for (const file of files) {
  const rl = readline.createInterface({ input: fs.createReadStream(file) });
  for await (const line of rl) {
    if (!line.includes("Agent9v2-Writer-S") || !line.includes("-D1")) continue;
    const o = JSON.parse(line);
    if (!/^Agent9v2-Writer-S\d+-D1$/.test(o.agent)) continue;
    const user = o.messages.find((m) => m.role === "user").content;
    runs.add(o.runId);
    const head = user.split("\nTHE BOOK SO FAR")[0];
    for (const m of head.matchAll(/The clock: between (.+?) and (.+?)\.\n/g)) windows.set(`${o.runId}|${m[1]}|${m[2]}`, [m[1], m[2]]);
    const clock = user.split(/\n(?=## )/).find((s) => s.startsWith("## THE CLOCK")) ?? "";
    if (/\b\d{1,2}:\d{2}\b/.test(clock)) digitRuns.add(o.runId);
    const byDial = new Map();
    for (const l of clock.split("\n").slice(2)) { const v = l.trim().split(" — ")[0]; if (!v || / to .*\(/.test(v)) continue; const d = cml.parseClockTime(v); if (d === null) continue; (byDial.get(d) ?? byDial.set(d, new Set()).get(d)).add(v); }
    if ([...byDial.values()].some((s) => s.size > 1)) twoSpell.add(o.runId);
  }
}
let rev = 0;
for (const [key, [a, b]] of windows) { const x = cml.parseClockTime(a), y = cml.parseClockTime(b); const r = x !== null && y !== null && x > y; if (r) rev++; console.log(`${r ? "REVERSED" : "ok      "} ${key.split("|")[0]}: between ${a} and ${b}`); }
console.log(`runs with a v2 writer prompt: ${runs.size}; distinct crime-chapter windows: ${windows.size}, reversed: ${rev}; runs whose THE CLOCK carries a digit time: ${digitRuns.size}; runs whose THE CLOCK spells one hour two ways: ${twoSpell.size}`);
