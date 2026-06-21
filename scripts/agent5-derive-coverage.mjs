/**
 * Agent 5 redesign — Spike 1: derivation completeness (§9.1).
 *
 * The whole redesign rests on one empirical claim: **the clue set is fully derivable from the frozen
 * CML.** This harness falsifies-or-confirms it on real shipped data. For every project in
 * data/store.json that shipped both a frozen CML and a clue set, it runs the authoritative
 * `deriveClueSpec(CASE)` and measures whether the derived slot-set covers every clue the run shipped
 * — and, the sharp question, every clue the deterministic SYNTHESIZERS had to mint (`clue_fp_*`,
 * `clue_culprit_direct_*`). If a synthesized clue traces to no derived slot, the derivation is
 * incomplete and the report names it so a derivation rule can be added (§9.1 falsification).
 *
 * Pure read-only analysis. No pipeline wiring.
 *   node scripts/agent5-derive-coverage.mjs                       # the live data/store.json
 *   node scripts/agent5-derive-coverage.mjs a.json b.json ...     # aggregate a wider corpus
 *                                                                 # (e.g. historical store snapshots)
 * Projects are de-duplicated by projectId across all stores (first CML+clues pair wins).
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { deriveClueSpec } from "../packages/clue-spec/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const stripCase = (s) => String(s ?? "").replace(/^CASE\./i, "").trim();
const isSynthesized = (id) => /^clue_fp_/.test(id) || /^clue_culprit_direct_/.test(id);

/** Does the derived slot-set cover this shipped clue? (semantic match, not byte-exact path) */
function isCovered(clue, derived) {
  const id = String(clue.id ?? "");
  const src = stripCase(clue.sourceInCML);
  const step = clue.supportsInferenceStep;
  const evidence = clue.evidenceType;

  if (derived.ids.has(id)) return { covered: true, by: "id" };
  if (src && derived.sources.has(src)) return { covered: true, by: "sourceInCML" };
  // a per-step backstop is covered by the step's derived slot regardless of correction/required_evidence sub-path
  if (step != null && evidence && derived.stepEvidence.has(`${step}:${evidence}`)) {
    return { covered: true, by: "step+evidenceType" };
  }
  // an elimination naming a suspect is covered by that suspect's derived elimination slot
  if (evidence === "elimination") {
    const m = /eliminat\w*\s+([A-Z][\w.'-]+(?:\s+[A-Z][\w.'-]+)*)/i.exec(`${clue.pointsTo ?? ""} ${clue.description ?? ""}`);
    if (m && derived.eliminationNames.has(m[1].toLowerCase())) return { covered: true, by: "elimination-name" };
  }
  return { covered: false, by: null };
}

function indexDerived(spec) {
  const ids = new Set(spec.clueSlots.map((s) => s.id));
  const sources = new Set(spec.clueSlots.map((s) => stripCase(s.sourceInCML)));
  const stepEvidence = new Set(
    spec.clueSlots.filter((s) => s.supportsInferenceStep != null).map((s) => `${s.supportsInferenceStep}:${s.evidenceType}`),
  );
  const eliminationNames = new Set(
    spec.clueSlots.filter((s) => s.evidenceType === "elimination").flatMap((s) => s.keyTerms.map((t) => t.toLowerCase())),
  );
  return { ids, sources, stepEvidence, eliminationNames };
}

function main() {
  const argv = process.argv.slice(2);
  const storePaths = argv.length > 0 ? argv : [path.join(repoRoot, "data", "store.json")];

  // group by project → { cml, clues }, de-duplicated across all stores (first complete pair wins)
  const byProject = new Map();
  for (const sp of storePaths) {
    let store;
    try {
      store = JSON.parse(fs.readFileSync(sp, "utf8"));
    } catch {
      console.warn(`(skipped unreadable store: ${sp})`);
      continue;
    }
    const artifacts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts ?? {});
    for (const a of artifacts) {
      if (a.type !== "cml" && a.type !== "clues") continue;
      const existing = byProject.get(a.projectId);
      if (existing?.cml && existing?.clues) continue; // already have a complete pair for this project
      const slot = existing ?? {};
      slot[a.type] = slot[a.type] ?? a;
      byProject.set(a.projectId, slot);
    }
  }

  const pairs = [...byProject.entries()].filter(([, s]) => s.cml && s.clues);
  console.log(`\n=== Agent 5 Spike 1 — derivation completeness ===`);
  console.log(`(${storePaths.length} store snapshot(s) → ${pairs.length} unique project(s) with CML+clues)\n`);

  let totalClues = 0, totalCovered = 0, totalSynth = 0, totalSynthCovered = 0;
  const uncoveredSynth = [];
  const uncoveredAny = [];

  for (const [projectId, { cml, clues }] of pairs) {
    const caseData = cml.payload?.CASE ?? cml.payload;
    const shipped = Array.isArray(clues.payload?.clues) ? clues.payload.clues : [];
    const shippedHerrings = Array.isArray(clues.payload?.redHerrings) ? clues.payload.redHerrings : [];

    const spec = deriveClueSpec(caseData);
    const derived = indexDerived(spec);

    let covered = 0, synth = 0, synthCovered = 0;
    for (const clue of shipped) {
      const c = isCovered(clue, derived);
      if (c.covered) covered++;
      else uncoveredAny.push({ projectId, id: clue.id, src: clue.sourceInCML, evidenceType: clue.evidenceType });
      if (isSynthesized(String(clue.id ?? ""))) {
        synth++;
        if (c.covered) synthCovered++;
        else uncoveredSynth.push({ projectId, id: clue.id, src: clue.sourceInCML, evidenceType: clue.evidenceType });
      }
    }

    const supportingPoints = caseData?.false_solution?.supporting_points?.length ?? 0;

    totalClues += shipped.length; totalCovered += covered;
    totalSynth += synth; totalSynthCovered += synthCovered;

    console.log(`project ${projectId}`);
    console.log(`  derived slots:        ${spec.clueSlots.length} clue + ${spec.redHerringSlots.length} red-herring`);
    console.log(`  shipped clues:        ${shipped.length}  (synthesized: ${synth})`);
    console.log(`  coverage (all):       ${covered}/${shipped.length}  (${pct(covered, shipped.length)})`);
    console.log(`  coverage (synth):     ${synthCovered}/${synth}  (${pct(synthCovered, synth)})  <- the §9.1 falsification test`);
    console.log(`  red herrings shipped: ${shippedHerrings.length}  | derivable from false_solution.supporting_points: ${supportingPoints}`);
    console.log("");
  }

  console.log("=== AGGREGATE ===");
  console.log(`  clue coverage (all):       ${totalCovered}/${totalClues}  (${pct(totalCovered, totalClues)})`);
  console.log(`  SYNTHESIZER coverage:      ${totalSynthCovered}/${totalSynth}  (${pct(totalSynthCovered, totalSynth)})`);
  console.log("");

  if (uncoveredSynth.length) {
    console.log(`!! ${uncoveredSynth.length} SYNTHESIZED clue(s) NOT covered by the deriver (each needs a derivation rule):`);
    for (const u of uncoveredSynth) console.log(`   - [${u.projectId}] ${u.id}  src=${u.src}  (${u.evidenceType})`);
  } else if (totalSynth > 0) {
    console.log(`✓ Every synthesized clue is covered by deriveClueSpec — the §9.1 derivation-completeness claim holds on this sample.`);
  } else {
    console.log(`(no synthesized clues in this sample — synthesizers didn't fire on these runs)`);
  }

  if (uncoveredAny.length) {
    console.log(`\n  (informational) ${uncoveredAny.length} LLM-authored clue(s) cite a source the deriver doesn't emit — expected; those are free renderings, not coverage gaps:`);
    for (const u of uncoveredAny.slice(0, 12)) console.log(`   · [${u.projectId}] ${u.id}  src=${u.src}  (${u.evidenceType})`);
    if (uncoveredAny.length > 12) console.log(`   · …and ${uncoveredAny.length - 12} more`);
  }
  console.log("");
}

const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);

main();
