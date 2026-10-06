import { readFileSync } from "node:fs";
const store = JSON.parse(readFileSync("C:/CML/data/store.json", "utf8"));
const arts = Object.values(store.artifacts);
const byProj = new Map();
for (const a of arts) { if (!byProj.has(a.projectId)) byProj.set(a.projectId, []); byProj.get(a.projectId).push(a); }
console.log("projects", byProj.size, "runs", Object.keys(store.runs ?? {}).length, "specs", Object.keys(store.specs ?? {}).length);
for (const [pid, list] of byProj) {
  const prose = list.filter(a => a.type === "prose" && a.payload?.engine === "v2");
  if (!prose.length) continue;
  const hld = list.filter(a => a.type === "hard_logic_devices").pop();
  const lf = hld?.payload?.devices?.[0]?.lockedFacts ?? [];
  console.log(pid, "v2 prose", prose.length, "lockedFacts", lf.length, "types", [...new Set(list.map(a => a.type))].length);
}
