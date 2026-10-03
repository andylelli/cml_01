// WP-007 §2.2 — clue necessity by deletion, the loop ZebraLogic (Lin et al. 2025) uses to certify a unique
// solution: remove one clue, re-decide, and see whether the verdict changes. Here the decider is the
// project's own A_109 M3 proof (`analyseProof`, a Dung grounded extension). A clue is NECESSARY for the
// culprit if deleting it leaves the culprit unproven, and necessary for an innocent if deleting it leaves
// that innocent uncleared. Read-only; run from the repo root after `npm run build:all`.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const cl = await import(pathToFileURL(join(ROOT, "packages/cml/dist/case-logic/index.js")).href);
const byProject = new Map();
for (const a of JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8")).artifacts ?? []) {
  if (!a?.projectId || !a?.type) continue;
  if (!byProject.has(a.projectId)) byProject.set(a.projectId, {});
  byProject.get(a.projectId)[a.type] = a.payload;
}
const hist = (xs) => JSON.stringify(Object.fromEntries(Object.entries(xs.reduce((m, x) => ((m[x] = (m[x] ?? 0) + 1), m), {}))));
const rows = [];
for (const [id, art] of byProject) {
  if (!art.cml) continue;
  const model = cl.buildCaseModel({ cml: art.cml, clues: art.clues });
  const scene = cl.clearedBySceneOf(art.cml);
  const base = cl.analyseProof(model, { clearedByScene: scene });
  if (!base.culpritProven) continue;
  const culprits = new Set(model.culprits);
  const pointing = model.clues.filter((c) => c.implicates.some((n) => culprits.has(n))).length;
  let necessaryForCulprit = 0;
  const necessaryForInnocent = new Map();
  for (const clue of model.clues) {
    const p = cl.analyseProof({ ...model, clues: model.clues.filter((c) => c !== clue) }, { clearedByScene: scene });
    if (!p.culpritProven) necessaryForCulprit++;
    for (const n of p.uncleared) if (!base.uncleared.includes(n)) necessaryForInnocent.set(n, (necessaryForInnocent.get(n) ?? 0) + 1);
  }
  // The test alone: delete every clue that points at the culprit.
  const testOnly = cl.analyseProof({ ...model, clues: model.clues.filter((c) => !c.implicates.some((n) => culprits.has(n))) }, { clearedByScene: scene });
  const innocents = model.suspects.filter((s) => !culprits.has(s.name)).length;
  rows.push({ id, clues: model.clues.length, pointing, necessaryForCulprit, testAloneProves: testOnly.culpritProven, innocents, innocentsOnOneClue: necessaryForInnocent.size });
}
console.log(`cases whose culprit the proof accepts: ${rows.length}`);
console.log(`clues per case: median ${rows.map((r) => r.clues).sort((a, b) => a - b)[rows.length >> 1]}`);
console.log(`clues pointing at the culprit, per case: ${hist(rows.map((r) => r.pointing))}`);
console.log(`clues whose deletion un-proves the culprit, per case: ${hist(rows.map((r) => r.necessaryForCulprit))}`);
console.log(`cases where the test alone still proves the culprit (every pointing clue deleted): ${rows.filter((r) => r.testAloneProves).length}/${rows.length}`);
const inn = rows.reduce((a, r) => a + r.innocents, 0), one = rows.reduce((a, r) => a + r.innocentsOnOneClue, 0);
console.log(`innocents whose clearance rests on exactly one deletable clue: ${one}/${inn}`);
