#!/usr/bin/env node
/**
 * A_111 — do the innocent suspects' alibis cover the time of death? An alibi that ends before the murder clears nobody,
 * and a book that clears its suspects with it has a void clearance (the P-6 arm C self-read: "alibis 7:00-8:30, window
 * 9:15-9:45, so every clearance is logically void"). Over every stored CML: the actual time of death
 * (hidden_model.mechanism.actual_time_of_death, else the latest constraint_space.time window), and each innocent
 * suspect's alibi span (@cml/cml alibiSpanFromWindow). Known positive: canary_1790962241799.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/alibi-coverage.mjs
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";

const cml = await import(pathToFileURL(`${process.cwd()}/packages/cml/dist/index.js`).href);
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const firstCml = new Map(); // the case as Agent 3 wrote it — the first row per project
for (const a of Object.values(store.artifacts)) if (a.type === "cml" && !firstCml.has(a.projectId)) firstCml.set(a.projectId, a.payload);

const dialOf = (raw) => {
  const v = cml.parseClockTime(String(raw ?? ""));
  return typeof v === "number" ? v : v?.dial ?? null;
};
let cases = 0, withDeath = 0, innocents = 0, parsed = 0, covering = 0, endsBefore = 0, startsAfter = 0, casesAllVoid = 0;
const examples = [];
for (const [pid, payload] of firstCml) {
  const C = payload?.CASE;
  if (!C?.cast) continue;
  cases++;
  const mech = C.hidden_model?.mechanism ?? {};
  let death = dialOf(mech.actual_time_of_death);
  if (death == null) {
    const windows = (C.constraint_space?.time?.windows ?? []).map((w) => dialOf(typeof w === "string" ? w : w?.end ?? w?.time ?? w?.label));
    death = windows.filter((d) => d != null).at(-1) ?? null;
  }
  if (death == null) continue;
  withDeath++;
  const culprits = new Set((C.culpability?.culprits ?? []).map((n) => String(n).trim()));
  let caseInnocents = 0, caseCovering = 0;
  for (const m of C.cast) {
    const role = String(m.role_archetype ?? m.role ?? "").toLowerCase();
    if (culprits.has(String(m.name).trim()) || /victim|detective|investigator|inspector/.test(role)) continue;
    innocents++; caseInnocents++;
    const span = cml.alibiSpanFromWindow(String(m.alibi_window ?? ""));
    if (!span) continue;
    parsed++;
    const [start, end] = cml.alibiSpanToWindow(span);
    const inside = start <= end ? death >= start && death <= end : death >= start || death <= end; // across midnight
    if (inside) { covering++; caseCovering++; }
    else if (end < death) endsBefore++;
    else startsAfter++;
    if (!inside && examples.length < 4) examples.push(`${pid.slice(0, 22)} ${m.name}: "${String(m.alibi_window).slice(0, 50)}" vs death at dial ${death}`);
  }
  if (caseInnocents > 0 && caseCovering === 0) casesAllVoid++;
}
console.log(`cases ${cases} · with a time of death ${withDeath} · innocent suspects ${innocents} · alibi parsed ${parsed}`);
console.log(`alibi covers the time of death: ${covering}/${parsed} · ends before it ${endsBefore} · starts after it ${startsAfter}`);
console.log(`cases where NO innocent's alibi covers the time of death: ${casesAllVoid}/${withDeath}`);
console.log(examples.join("\n"));
