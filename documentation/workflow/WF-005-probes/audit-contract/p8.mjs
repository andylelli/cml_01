import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import("file:///C:/CML/packages/prose-engine/dist/index.js");
setEnv("OFF");
const rows = []; const crit = {}; const decisiveAtOrAfter = new Set(); let essentialAfter = new Set();
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const clueById = new Map((c.input.clues?.clues ?? []).map((x) => [x.id, x]));
  for (const s of k.scenes) {
    if (s.chapter < k.roles.reveal) continue;
    for (const m of s.mustSurface) {
      const cl = clueById.get(m.id) ?? {};
      const key = `${s.chapter === k.roles.reveal ? "AT" : "AFTER"} reveal · ${cl.criticality ?? "?"}`;
      crit[key] = (crit[key] ?? 0) + 1;
      if (k.fairPlay.decisiveClueIds.includes(m.id)) decisiveAtOrAfter.add(c.id);
      if (cl.criticality === "essential") essentialAfter.add(c.id);
      if (rows.length < 14) rows.push(`${c.id.slice(5, 13)} ch${s.chapter}/${s.role} reveal=${k.roles.reveal} [${m.id}] ${cl.criticality} placement=${cl.placement ?? "?"} :: ${m.observable.slice(0, 90)}`);
    }
  }
}
console.log(JSON.stringify(crit));
console.log("cases with a DECISIVE clue first staged at/after the reveal:", decisiveAtOrAfter.size, " with an ESSENTIAL one:", essentialAfter.size);
for (const r of rows) console.log(r);
