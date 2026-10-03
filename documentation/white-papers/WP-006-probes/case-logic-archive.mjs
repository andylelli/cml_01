// WP-006: run the project's own case-logic package (A_109, default OFF) over every archived project. Read-only.
import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
const ROOT = process.cwd();
const cl = await import(pathToFileURL(join(ROOT, "packages/cml/dist/case-logic/index.js")).href);
const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const last = (type) => { const m = new Map(); for (const a of store.artifacts) if (a.type === type) m.set(a.projectId, a.payload); return m; };
const cmls = last("cml"), clues = last("clues");
let n = 0, failed = 0, withClues = 0;
const t = { consistent: 0, inconsistent: 0, act: 0, noAct: 0 };
const cov = { covers: 0, partial: 0, none: 0, unknown: 0 };
let casesAllCovered = 0, casesAnyOpen = 0, casesAnyUnknown = 0;
const p = { proven: 0, notProven: 0, uncleared0: 0, unclearedAny: 0, culpritCleared: 0, stepsNoClue: 0 };
const unclearedDist = new Map();
for (const [projectId, cml] of cmls) {
  try {
    const model = cl.buildCaseModel({ cml, clues: clues.get(projectId) });
    n++; if (clues.has(projectId)) withClues++;
    const tl = cl.analyseTimeline(model);
    tl.consistent ? t.consistent++ : t.inconsistent++;
    tl.act ? t.act++ : t.noAct++;
    let open = 0, unk = 0;
    for (const i of tl.innocents) { cov[i.coverage]++; if (i.coverage === "none" || i.coverage === "partial") open++; if (i.coverage === "unknown") unk++; }
    if (tl.act) { if (open === 0 && unk === 0) casesAllCovered++; else if (open > 0) casesAnyOpen++; else casesAnyUnknown++; }
    if (clues.has(projectId)) {
      const pr = cl.analyseProof(model, { clearedByScene: cl.clearedBySceneOf(cml) });
      pr.culpritProven ? p.proven++ : p.notProven++;
      pr.uncleared.length ? p.unclearedAny++ : p.uncleared0++;
      if (pr.culpritCleared.length) p.culpritCleared++;
      if (pr.stepsWithoutClues.length) p.stepsNoClue++;
      const k = Math.min(pr.uncleared.length, 4); unclearedDist.set(k, (unclearedDist.get(k) ?? 0) + 1);
    }
  } catch (e) { failed++; if (failed <= 2) console.log("FAILED", projectId, String(e).slice(0, 160)); }
}
console.log(`projects ${cmls.size}; modelled ${n}; failed ${failed}; with a clues artifact ${withClues}`);
console.log(`TIMELINE (analyseTimeline): consistent ${t.consistent}; inconsistent ${t.inconsistent}; act window bounded on both sides ${t.act}; not bounded ${t.noAct}`);
console.log(`  innocents' alibi coverage of the act, all cases: covers ${cov.covers}; partial ${cov.partial}; none ${cov.none}; unknown ${cov.unknown}`);
console.log(`  of the ${t.act} cases with a bounded act: every innocent covered ${casesAllCovered}; at least one innocent open (none/partial) ${casesAnyOpen}; only unknowns ${casesAnyUnknown}`);
console.log(`PROOF (analyseProof, ${withClues} cases with clues): culprit proven ${p.proven}; not proven ${p.notProven}; no innocent left uncleared ${p.uncleared0}; some innocent uncleared ${p.unclearedAny}; a culprit cleared ${p.culpritCleared}; a step no clue serves ${p.stepsNoClue}`);
console.log(`  uncleared innocents per case: ${[...unclearedDist.entries()].sort((a, b) => a[0] - b[0]).map(([k, v]) => k + ":" + v).join("  ")}`);
