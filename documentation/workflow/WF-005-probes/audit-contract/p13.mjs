import { cases } from "./cases.mjs";
import { setEnv } from "./env.mjs";
const pe = await import(new URL("../../../../packages/prose-engine/dist/index.js", import.meta.url).href);
setEnv(process.argv[2] ?? "OFF");
const r = { decisiveAtTest: new Set(), decisiveAfterTest: new Set(), essentialAtOrAfterTest: new Set(), anyAfterReveal: new Set(), essentialAfterReveal: new Set(), traceHolds: 0, clearedOffPageNonVictim: new Set(), clearedRows: 0 };
const ex = [];
for (const c of cases) {
  const k = pe.buildBookContract(c.input);
  const test = k.roles.discriminatingTest ?? k.roles.reveal;
  const crit = new Map((c.input.clues?.clues ?? []).map((x) => [x.id, x.criticality]));
  const first = new Map();
  for (const s of [...k.scenes].sort((a, b) => a.chapter - b.chapter)) for (const m of s.mustSurface) if (!first.has(m.id)) first.set(m.id, s.chapter);
  for (const id of k.fairPlay.decisiveClueIds) {
    const f = first.get(id);
    if (f === test) { r.decisiveAtTest.add(c.id); if (ex.length < 3) ex.push(`${c.id.slice(5, 13)} decisive ${id} first shown in the test chapter ${test}`); }
    if (f !== undefined && f > test) r.decisiveAfterTest.add(c.id);
  }
  for (const [id, f] of first) {
    if (crit.get(id) === "essential" && f >= test) r.essentialAtOrAfterTest.add(c.id);
    if (f > k.roles.reveal) { r.anyAfterReveal.add(c.id); if (crit.get(id) === "essential") r.essentialAfterReveal.add(c.id); }
  }
  const tr = pe.checkTraceRules(k).find((t) => t.rule === "decisive-clue-before-test");
  if (tr?.verdict === "holds" && k.fairPlay.decisiveClueIds.some((id) => first.get(id) === test)) r.traceHolds++;
  for (const s of k.scenes) for (const e of s.eliminationsAllowed) if (e.name !== k.fairPlay.victim && !s.present.includes(e.name)) { r.clearedOffPageNonVictim.add(c.id); r.clearedRows++; }
}
console.log(Object.fromEntries(Object.entries(r).map(([k, v]) => [k, v instanceof Set ? v.size : v])));
console.log(ex.join("\n"));
