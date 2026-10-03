// A_110 0.2 (N9 + M9, PROSE_V2_SCHEDULE) — the archive witness: every stored contract built OFF and ON, with
// the busiest chapter's evidence load, the reader model's settle chapter against the test, how many culprit clues
// are deferred, and whether any contract or trace rule breaks. Read-only; after `npm run build:all`.
//   node documentation/analysis/ANALYSIS_110/probes/schedule-witness.mjs
import fs from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
process.env.CML_VERIFIED_FIXES = "true";
// Both arms carry step 0 (PROSE_V2_CONTRACT_FIXES), so a rule that fires is the schedule's doing, not step 0's known defects.
process.env.PROSE_V2_CONTRACT_FIXES = "1";
const ROOT = process.cwd();
const pe = await import(pathToFileURL(join(ROOT, "packages/prose-engine/dist/index.js")).href);
const cml = await import(pathToFileURL(join(ROOT, "packages/cml/dist/index.js")).href);
const store = JSON.parse(fs.readFileSync(join(ROOT, "data/store.json"), "utf8"));
const by = new Map(); for (const a of store.artifacts) { if (!a?.projectId) continue; if (!by.has(a.projectId)) by.set(a.projectId, {}); by.get(a.projectId)[a.type] = a.payload; }
const inputOf = (a) => ({ cml: a.cml, clues: a.clues, outline: a.outline, cast: a.cast?.cast ?? a.cast, profiles: a.character_profiles, world: a.world_document, locations: a.location_profiles, temporal: a.temporal_context, setting: a.setting, lockedFacts: [], humourLevel: "classic" });
const median = (xs) => { const s = [...xs].sort((a, b) => a - b); return s.length ? s[s.length >> 1] : NaN; };

const rows = [];
for (const [id, a] of by) {
  if (!a.cml || !a.outline) continue;
  const row = { id };
  for (const on of [false, true]) {
    process.env.PROSE_V2_SCHEDULE = on ? "1" : "";
    const c = pe.buildBookContract(inputOf(a));
    const loads = c.scenes.map((s) => s.mustSurface.length);
    const model = cml.buildCaseModel({ cml: a.cml, clues: a.clues });
    const input = pe.readerInputOf(c);
    const walk = cml.walkReader(model, input);
    const ledger = cml.surpriseOf(model, walk, input.testChapter);
    row[on ? "on" : "off"] = {
      maxLoad: Math.max(0, ...loads),
      empty: loads.filter((n) => n === 0).length,
      settle: ledger.settledAt,
      test: input.testChapter,
      dead: ledger.deadBeforeTest,
      deferred: c.scenes.reduce((n, s) => n + s.mustSurface.filter((m) => m.conclusionAt !== undefined).length, 0),
      rules: pe.checkContractRules(c, c.bible.text).length,
      decisiveLate: pe.checkTraceRules(c).find((t) => t.rule === "decisive-clue-before-test")?.verdict === "violated",
      surfaced: new Set(c.scenes.flatMap((s) => s.mustSurface.map((m) => m.id))).size,
    };
  }
  rows.push(row);
}
const tally = (k, f) => `${rows.filter((r) => f(r[k])).length}/${rows.length}`;
for (const k of ["off", "on"]) {
  console.log(`${k.toUpperCase().padEnd(3)} busiest chapter's load, median ${median(rows.map((r) => r[k].maxLoad))} (max ${Math.max(...rows.map((r) => r[k].maxLoad))}) · chapters with no evidence, median ${median(rows.map((r) => r[k].empty))}`);
  console.log(`    culprit the favourite before the chapter ahead of the test: ${tally(k, (x) => x.settle !== null && x.settle < x.test - 1)} · never before the test: ${tally(k, (x) => x.settle === null || x.settle >= x.test)} · settle chapter median ${median(rows.map((r) => r[k].settle ?? 99))}`);
  console.log(`    culprit clues deferred, median ${median(rows.map((r) => r[k].deferred))} · contract rules violated in ${tally(k, (x) => x.rules > 0)} · a decisive clue after the test in ${tally(k, (x) => x.decisiveLate)} · clues surfaced, median ${median(rows.map((r) => r[k].surfaced))}`);
}
const lost = rows.filter((r) => r.on.surfaced < r.off.surfaced);
console.log(`contracts where ON surfaces FEWER distinct clues than OFF: ${lost.length}${lost.length ? " — " + lost.slice(0, 3).map((r) => `${r.id.slice(0, 13)} ${r.off.surfaced}->${r.on.surfaced}`).join(", ") : ""}`);
