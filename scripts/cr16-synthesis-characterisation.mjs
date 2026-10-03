#!/usr/bin/env node
/**
 * CR-16 (A5-08 / A6-09 / A6-04) characterisation harness — every deterministic clue synthesiser whose
 * prelude (timeline normalisation + id minter) or timeline append moved into clue-contracts/synthesis.ts,
 * OLD vs NEW, over every archived (cml, clues) pair in data/store.json and five planted damages.
 *
 * Setup (from the BASE build): copy apps/worker/dist/jobs/clue-contracts -> clue-contracts-old,
 * agents/agent5 -> agents/agent5-old, agents/agent6 -> agents/agent6-old; in both agent5 dirs make
 * coverage-retries.probe.js = coverage-retries.js + `export { synthesizeSuspectCoverageBackstopClues as
 * __suspectBackstop };`. Build the change, run this, delete the -old dirs and the probe files.
 * CTL=1 plants a known difference and must report diffs > 0.
 *
 *   node scripts/cr16-synthesis-characterisation.mjs
 */
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const ROOT = process.cwd();
const D = (p) => import(pathToFileURL(join(ROOT, "apps/worker/dist/jobs", p)).href);
const OLD = {
  ...(await D("clue-contracts-old/contracts.js")),
  ...(await D("agents/agent5-old/evidence-remediation.js")),
  ...(await D("agents/agent5-old/coverage-retries.probe.js")),
  ...(await D("agents/agent6-old/retry-contract.js")),
};
const NEW = {
  ...(await D("clue-contracts/contracts.js")),
  ...(await D("agents/agent5/evidence-remediation.js")),
  ...(await D("agents/agent5/coverage-retries.probe.js")),
  ...(await D("agents/agent6/retry-contract.js")),
};

const store = JSON.parse(readFileSync(join(ROOT, "data/store.json"), "utf8"));
const byProject = new Map();
for (const a of Object.values(store.artifacts)) {
  if (a?.type !== "cml" && a?.type !== "clues") continue;
  const e = byProject.get(a.projectId) ?? {};
  e[a.type] = a.payload;
  byProject.set(a.projectId, e);
}
const pairs = [...byProject.values()].filter((e) => e.cml && e.clues?.clues?.length);
const CB = (cml) => cml?.CASE ?? cml;
const isFloor = (c) => /^clue_(fp_|parity_bridge|culprit_direct_)/.test(String(c?.id ?? ""));
const strip = (clues, pred) => {
  const drop = new Set(clues.clues.filter(pred).map((c) => String(c.id)));
  clues.clues = clues.clues.filter((c) => !drop.has(String(c.id)));
  for (const k of ["early", "mid", "late"]) if (Array.isArray(clues.clueTimeline?.[k])) clues.clueTimeline[k] = clues.clueTimeline[k].filter((id) => !drop.has(String(id)));
};

const PLANTS = {
  archived: () => {},
  floorStripped: (cml, clues) => strip(clues, isFloor),
  stepsGone: (cml, clues) => strip(clues, (c) => isFloor(c) || [1, 2].includes(Number(c?.supportsInferenceStep)) || c?.placement === "early"),
  noTimeline: (cml, clues) => { strip(clues, isFloor); delete clues.clueTimeline; },
  oddTimeline: (cml, clues) => { strip(clues, isFloor); clues.clueTimeline = { early: "x", mid: null }; },
};

const steps = (cml) => (CB(cml)?.inference_path?.steps ?? []).map((_s, i) => i + 1);
const castNames = (cml) => (CB(cml)?.cast ?? []).map((m) => String(m?.name ?? "")).filter(Boolean);
const PROBES = {
  synthesizeMissingCulpritDiscriminatingClues: (L, cml, clues) => L.synthesizeMissingCulpritDiscriminatingClues(cml, clues, CB(cml)?.culpability?.culprits ?? castNames(cml).slice(0, 1)),
  synthesizeMissingDiscriminatingEvidenceClues: (L, cml, clues) => L.synthesizeMissingDiscriminatingEvidenceClues(cml, clues, ["clue_missing_a", "clue_missing_b", "clue_missing_a"]),
  enforceAgent5DeterministicContracts: (L, cml, clues) => L.enforceAgent5DeterministicContracts(cml, clues, {}),
  synthesizeInferenceStepCoverageClues: (L, cml, clues) => L.synthesizeInferenceStepCoverageClues(cml, clues, steps(cml)),
  suspectBackstop: (L, cml, clues) => L.__suspectBackstop(cml, clues, castNames(cml)),
  ensureParityBridgeClue: (L, cml, clues) => L.ensureParityBridgeClue(cml, clues),
  ensureCriticalFairPlayBackstopClues: (L, cml, clues) => L.ensureCriticalFairPlayBackstopClues(cml, clues),
};

const run = (fn) => {
  const warns = []; const w = console.warn; console.warn = (...a) => warns.push(a.join(" "));
  try { return { ok: fn(), warns }; } catch (e) { return { threw: String(e?.message ?? e), warns }; } finally { console.warn = w; }
};

let cases = 0, diffs = 0;
const fired = {};
for (const [plant, p] of Object.entries(PLANTS)) {
  for (const { cml, clues } of pairs) {
    for (const [name, probe] of Object.entries(PROBES)) {
      const c0 = structuredClone(cml), k0 = structuredClone(clues); p(c0, k0);
      const before = JSON.stringify(k0);
      const [c1, k1, c2, k2] = [structuredClone(c0), structuredClone(k0), structuredClone(c0), structuredClone(k0)];
      const o = run(() => probe(OLD, c1, k1));
      const n = run(() => probe(NEW, c2, k2));
      // CTL=1: a known-positive — NEW's parity bridge lands one clue later in the timeline.
      if (process.env.CTL === "1" && name === "ensureParityBridgeClue" && n.ok) k2.clueTimeline.early.push("ctl");
      cases++;
      if (JSON.stringify(k1) !== before || o.threw) fired[name] = (fired[name] ?? 0) + 1;
      const so = JSON.stringify({ r: o, cml: c1, clues: k1 }), sn = JSON.stringify({ r: n, cml: c2, clues: k2 });
      if (so !== sn) { diffs++; if (diffs <= 5) console.log("DIFF", plant, name, CB(cml)?.meta?.title, so.slice(0, 240), "\n   vs", sn.slice(0, 240)); }
    }
  }
}
console.log(JSON.stringify({ pairs: pairs.length, cases, diffs }));
console.log("cases where OLD mutated the clue set or threw, by probe:", JSON.stringify(fired));
