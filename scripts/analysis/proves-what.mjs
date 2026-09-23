/**
 * A_102 §0 re-measured after the harness classifier was corrected.
 *
 * The original matched a culprit by FULL NAME or SURNAME only, so "traces to Gwendolyn" counted as
 * naming nobody. It also took the FIRST trace mentioning the weapon and stopped, hiding a second
 * trace that named the culprit. Both understate how many cases connect the culprit to the act, so
 * the 85% headline is an upper bound until it is recomputed with the corrected rule.
 *
 * This mirrors `provesTheAct` in agent3-direct-llm-check-harness.ts. The harness is the authority for
 * a generated case; this reads archived cases WITH their clues, which the harness has no access to.
 */
import { readFileSync } from "node:fs";

const store = JSON.parse(readFileSync("C:/CML/data/store.json", "utf8"));
const byProject = new Map();
for (const r of store.artifacts ?? []) {
  const pid = r.project_id ?? r.projectId, t = r.artifact_type ?? r.type;
  if (!pid || !t) continue;
  if (!byProject.has(pid)) byProject.set(pid, {});
  try { byProject.get(pid)[t] = r.payload_json ? JSON.parse(r.payload_json) : r.payload; } catch {}
}

// INSTRUMENT only. The killing verb ("stabbed") appears in every sentence describing the murder,
// including ones that prove presence, so matching it made the probe agree with anything.
const weaponWords = (dm) => {
  const s = String(dm);
  const instrument = / with /i.test(s) ? s.split(/ with /i).slice(1).join(" ") : "";
  return instrument.toLowerCase().replace(/[^a-z\s]/g, " ").split(/\s+/)
    .filter((w) => w.length > 3 && !["with", "were", "from", "into", "that", "this", "used", "been"].includes(w));
};

const TITLES = new Set(["mr", "mrs", "miss", "ms", "dr", "sir", "lady", "lord", "the"]);
const nameTokens = (c) => String(c).split(/[\s.,]+/).map((w) => w.trim())
  .filter((w) => w.length >= 3 && !TITLES.has(w.toLowerCase()));

let n = 0, provesAct = 0, presenceOnly = 0, byTrace = 0, byTest = 0, byClue = 0;
let oldProves = 0;
const forensicRe = /fingerprint|finger-print|finger print|blood group|blood type|bloodstain matching|dna/i;
let forensicLinks = 0;

for (const [pid, a] of byProject) {
  const C = a.cml?.CASE ?? a.cml;
  if (!C?.discriminating_test || !C?.death_method || !a.clues) continue;
  const words = weaponWords(C.death_method);
  if (words.length === 0) continue;
  const culprits = (C.culpability?.culprits ?? []).map(String);
  if (culprits.length === 0) continue;
  n += 1;

  const has = (t) => words.some((w) => String(t).toLowerCase().includes(w));
  const namesCulpritNew = (t) => culprits.some((c) => t.includes(c) || nameTokens(c).some((w) => t.includes(w)));
  const namesCulpritOld = (t) => culprits.some((c) => t.includes(c) || t.includes(String(c.split(" ").pop())));

  const dt = C.discriminating_test;
  const test = `${dt.design ?? ""} ${dt.knowledge_revealed ?? ""} ${dt.pass_condition ?? ""}`;
  const traces = Array.isArray(C.constraint_space?.physical?.traces) ? C.constraint_space.physical.traces.map(String) : [];
  const clues = Array.isArray(a.clues?.clues) ? a.clues.clues : [];
  const clueTexts = clues.map((c) => `${c.observable ?? ""} ${c.description ?? ""} ${c.pointsTo ?? ""}`);

  const testProves = has(test);
  const traceLinks = traces.filter((t) => has(t) && namesCulpritNew(t));
  const clueLinks = clueTexts.filter((t) => has(t) && namesCulpritNew(t));
  const linked = testProves || traceLinks.length > 0 || clueLinks.length > 0;

  const oldClue = clueTexts.some((t) => has(t) && namesCulpritOld(t));
  if (testProves || oldClue) oldProves += 1;

  if (linked) {
    provesAct += 1;
    if (testProves) byTest += 1; else if (traceLinks.length) byTrace += 1; else byClue += 1;
    if ([...traceLinks, ...clueLinks].some((t) => forensicRe.test(t))) forensicLinks += 1;
  } else presenceOnly += 1;
}

console.log(`cases with a death method, a test and clues: ${n}\n`);
console.log(`  ORIGINAL rule (surname only, clues only)  proves the act: ${oldProves}  (${(100 * oldProves / n).toFixed(0)}%)`);
console.log(`  CORRECTED rule (any name token + traces)  proves the act: ${provesAct}  (${(100 * provesAct / n).toFixed(0)}%)`);
console.log(`                                            presence only : ${presenceOnly}  (${(100 * presenceOnly / n).toFixed(0)}%)\n`);
console.log(`  of those that link — by the test: ${byTest}   by a physical trace: ${byTrace}   by a clue: ${byClue}`);
console.log(`  links that rest on a print / blood group / DNA (the case-closing kind): ${forensicLinks}`);
