// WP-007 §6.1 — how many instructions does a v2 writer call carry, and where? Reads the newest
// Agent9v2-Writer-S<n>-D1 prompt per chapter slot from the tail of logs/llm-prompts-full.jsonl, splits the
// user message on its "## " headings, and counts per section: characters, list items (a line starting
// "-", "*", "•" or "1."), and lines carrying a requirement word. IFScale (Jaroslawicz et al. 2025) counts
// instructions the same way, as separately checkable items. Read-only.
import { createReadStream, statSync } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";
const path = join(process.cwd(), "logs/llm-prompts-full.jsonl");
const start = Math.max(0, statSync(path).size - 30_000_000);
const latest = new Map();
for await (const line of createInterface({ input: createReadStream(path, { start }) })) {
  if (!line.includes('"Agent9v2-Writer-')) continue;
  let rec; try { rec = JSON.parse(line); } catch { continue; }
  const m = String(rec.agent ?? "").match(/^Agent9v2-Writer-S(\d+)-D1$/); if (m) latest.set(Number(m[1]), rec);
}
const REQ = /\b(must|never|do not|don't|always|avoid|should|only|no more than|at least|exactly|each|every)\b/i;
const sections = (text) => text.split(/\n(?=## )/).map((s) => {
  const lines = s.split("\n").map((l) => l.trim()).filter(Boolean);
  return { head: (lines[0] ?? "").replace(/^## /, "").slice(0, 44), chars: s.length, items: lines.filter((l) => /^([-*•]|\d+[.)])\s/.test(l)).length, req: lines.filter((l) => REQ.test(l)).length };
});
const slots = [...latest.keys()].sort((a, b) => a - b);
for (const slot of [slots[0], slots.at(-1)]) {
  const rec = latest.get(slot); const user = rec.messages.find((m) => m.role === "user")?.content ?? "";
  const rows = sections(String(user));
  console.log(`S${slot} (run ${String(rec.runId).slice(0, 12)}) · user message ${user.length} chars · ~${Math.round(user.length / 4)} tokens`);
  for (const r of rows) console.log(`  ${r.head.padEnd(44)} chars ${String(r.chars).padStart(6)} · list items ${String(r.items).padStart(3)} · requirement lines ${String(r.req).padStart(3)}`);
}
