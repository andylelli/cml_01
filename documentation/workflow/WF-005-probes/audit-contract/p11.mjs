import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
const run = await import("file:///C:/CML/apps/worker/dist/jobs/agents/agent9-v2/run.js");
setEnv("OFF");
const kinds = {}; let dropCases = new Set(), dropChapters = 0, detDrop = new Set();
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const id = c.id.slice(5, 13);
  const intervals = k.chronology.rows.filter((r) => r.kind === "interval");
  if (!intervals.some((r) => /murder|entry|the act|opportunit|window|access/i.test(r.label)) && intervals.length) {
    const ow = intervals[0];
    const culprit = k.fairPlay.culprits.join(",");
    const kind = /alibi|cover/i.test(ow.label) ? (k.fairPlay.culprits.some((cu) => ow.label.includes(cu) || ow.label.includes(cu.split(" ").pop())) ? "culprit's alibi" : "another person's alibi") : "other";
    kinds[kind] = (kinds[kind] ?? 0) + 1;
    if (process.argv[2] === "w") console.log(`${id} [${kind}] chosen: "${ow.value}" — ${ow.label}  | culprit ${culprit} | other labels: ${intervals.slice(1).map((r) => r.label).join(" ; ").slice(0, 200)}`);
  }
  const names = (c.input.cast?.characters ?? []).map((m) => m.name);
  const det = (c.input.cast?.characters ?? []).find((m) => /detective|investigator|sleuth|inspector/i.test(String(m.role_archetype ?? m.roleArchetype ?? m.role ?? "")))?.name;
  for (const scene of pe.flattenScenes(c.input.outline)) {
    const dropped = (scene.characters ?? []).map((x) => String(x).trim()).filter((n) => n && !names.includes(n) && names.some((x) => x.includes(n) || n.includes(x) || x.split(" ").pop() === n.split(" ").pop()));
    if (dropped.length) {
      dropCases.add(c.id); dropChapters++;
      const ch = Number(scene.sceneNumber);
      const sc = k.scenes.find((s) => s.chapter === ch);
      const lost = dropped.map((n) => names.find((x) => x.includes(n) || n.includes(x) || x.split(" ").pop() === n.split(" ").pop())).filter((x) => !sc.present.includes(x));
      if (det && lost.includes(det)) detDrop.add(c.id);
      if (process.argv[2] === "d" && lost.length) console.log(`${id} ch${ch}: outline lists ${dropped.map((d) => `"${d}"`).join(", ")}; contract "On the page": [${sc.present.join(", ")}] — missing ${lost.join(", ")}`);
    }
  }
}
console.log("fallback window kinds:", JSON.stringify(kinds), "| cases with a cast member dropped by the exact-name join:", dropCases.size, "chapters:", dropChapters, "| cases where the dropped one is the detective:", detDrop.size);
