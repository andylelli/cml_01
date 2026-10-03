// WP-006 logic measurement: does the authored timetable leave exactly one suspect? Read-only.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const td = await import(pathToFileURL(join(ROOT, "packages/cml/dist/timeline-deception.js")).href);
const ap = await import(pathToFileURL(join(ROOT, "packages/cml/dist/alibi-plan.js")).href);
const { parseClockTime, isValidAlibiSpan, alibiSpanToWindow } = td;
const { dialWindowContains } = ap;

// known-positive for the probe itself
console.log("probe: parseClockTime('quarter to nine') =", parseClockTime("quarter to nine"), "(expect 525); contains(500,530,525) =", dialWindowContains(500, 530, 525));

const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const byProject = new Map();
for (const a of store.artifacts) if (a.type === "cml") byProject.set(a.projectId, a); // last CML per project
const cases = [...byProject.values()].map((a) => ({ projectId: a.projectId, c: a.payload.CASE }));
console.log(`cml artifacts ${store.artifacts.filter((a) => a.type === "cml").length}; distinct projects ${cases.length}`);

const norm = (s) => String(s ?? "").trim().toLowerCase();
let checkable = 0, noSpan = 0, noTime = 0;
const dist = new Map(); let unique = 0, designed = 0, culpritCoversActual = 0;
let innocents = 0, idle = 0, open = 0, covered = 0, unknown = 0, twins = 0, twinCases = 0;
const axisRows = new Map();
const examples = [];
for (const { projectId, c } of cases) {
  const mech = c?.hidden_model?.mechanism ?? {};
  const actual = parseClockTime(mech.actual_time_of_death), apparent = parseClockTime(mech.apparent_time_of_death);
  if (actual == null || apparent == null) { noTime++; continue; }
  const culprits = new Set((c?.culpability?.culprits ?? []).map(norm));
  const elig = (c.cast ?? []).filter((p) => norm(p.culprit_eligibility) === "eligible" || culprits.has(norm(p.name)));
  if (!elig.some((p) => isValidAlibiSpan(p.alibi_span))) { noSpan++; continue; }
  checkable++;
  let openInnocent = 0, unknownInnocent = 0, culpritOpen = null, culpritWin = null, hasTwin = false;
  for (const p of elig) {
    const isCulprit = culprits.has(norm(p.name));
    if (!isValidAlibiSpan(p.alibi_span)) { if (!isCulprit) { innocents++; unknown++; unknownInnocent++; } continue; }
    const [s, e] = alibiSpanToWindow(p.alibi_span);
    const cAct = dialWindowContains(s, e, actual), cApp = dialWindowContains(s, e, apparent);
    if (isCulprit) { culpritOpen = !cAct; culpritWin = [s, e]; if (cApp && !cAct) designed++; if (cAct) culpritCoversActual++; continue; }
    innocents++;
    if (cAct) covered++; else { open++; openInnocent++; }
    if (!cAct && !cApp) idle++;
  }
  if (culpritWin) for (const p of elig) { if (culprits.has(norm(p.name)) || !isValidAlibiSpan(p.alibi_span)) continue; const [s, e] = alibiSpanToWindow(p.alibi_span); if (s === culpritWin[0] && e === culpritWin[1]) { twins++; hasTwin = true; } }
  if (hasTwin) twinCases++;
  const key = unknownInnocent > 0 && openInnocent === 0 ? "unknown" : String(Math.min(openInnocent, 4));
  dist.set(key, (dist.get(key) ?? 0) + 1);
  if (openInnocent === 0 && unknownInnocent === 0 && culpritOpen === true) unique++;
  const ax = norm(c?.false_assumption?.type) || "?";
  const r = axisRows.get(ax) ?? { n: 0, unique: 0 }; r.n++; if (openInnocent === 0 && unknownInnocent === 0 && culpritOpen === true) r.unique++; axisRows.set(ax, r);
  if (openInnocent >= 2 && examples.length < 3) examples.push(`${projectId} "${c?.meta?.title ?? ""}" actual ${mech.actual_time_of_death} apparent ${mech.apparent_time_of_death}: ${openInnocent} innocents with no alibi at the actual time`);
}
console.log(`projects with both times parseable ${cases.length - noTime} (unparseable or absent ${noTime}); of those without any alibi_span ${noSpan}; CHECKABLE ${checkable}`);
console.log(`culprit alibi covers the apparent time and not the actual (the designed deception): ${designed}/${checkable}; culprit alibi covers the ACTUAL time (self-contradiction): ${culpritCoversActual}/${checkable}`);
console.log(`innocent eligible suspects ${innocents}: covered at the actual time ${covered}; NOT covered ${open}; no span (unknown) ${unknown}`);
console.log(`  idle alibis (cover neither the apparent nor the actual time): ${idle}/${innocents}`);
console.log(`  innocents whose span is identical to the culprit's: ${twins} in ${twinCases} cases`);
console.log(`cases by number of innocents the timetable leaves open: ${[...dist.entries()].sort().map(([k, v]) => k + ":" + v).join("  ")}`);
console.log(`timetable alone yields exactly one suspect, the culprit: ${unique}/${checkable}`);
console.log(`by axis: ${[...axisRows.entries()].map(([k, v]) => `${k} ${v.unique}/${v.n}`).join("; ")}`);
for (const e of examples) console.log("  e.g. " + e);
