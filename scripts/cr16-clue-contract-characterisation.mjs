#!/usr/bin/env node
/**
 * CR-16 (A5-07) characterisation harness — OLD vs NEW clue-contract check/repair pairs over the archive.
 *
 * To re-run against a later change: build the BASE commit, copy apps/worker/dist/jobs/clue-contracts to
 * apps/worker/dist/jobs/clue-contracts-old, build the change, run this, then delete the -old directory.
 * CTL=1 plants a known difference (the cast-name check answers []) and must report diffs > 0.
 *
 *   node scripts/cr16-clue-contract-characterisation.mjs
 */
// every check/repair pair whose selection moved into a shared selector, OLD
// (dist/jobs/clue-contracts-old, built from 12131e7c) vs NEW (dist/jobs/clue-contracts), over every
// archived (cml, clues) pair and six planted damages that make each pair fire. Compared: return values,
// thrown messages, console.warn notes, and the mutated clue set.
import { readFileSync } from "node:fs";
import { pathToFileURL } from "node:url";
import { join } from "node:path";
const ROOT = process.cwd();
const load = (dir) => Promise.all(["contracts", "clue-time", "inference-checks", "mechanism-visibility"].map((m) =>
  import(pathToFileURL(join(ROOT, "apps/worker/dist/jobs", dir, `${m}.js`)).href))).then((ms) => Object.assign({}, ...ms));
const OLD = await load("clue-contracts-old");
const NEW = await load("clue-contracts");

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

const PLANTS = {
  archived: () => {},
  allLate: (cml, clues) => { for (const c of clues.clues) c.placement = "late"; },
  textFallback: (cml, clues) => { const dt = CB(cml)?.discriminating_test; if (dt) dt.evidence_clues = []; for (const c of clues.clues) c.placement = "late"; },
  castNameSwap: (cml, clues) => {
    const names = (CB(cml)?.cast ?? []).map((m) => String(m?.name ?? "").trim()).filter(Boolean);
    clues.clues.forEach((c, i) => {
      const m = String(c?.sourceInCML ?? "").match(/^CASE\.cast\[(\d+)\]\./);
      if (!m || names.length < 2) return;
      const wrong = names[(Number(m[1]) + 1) % names.length];
      if (i % 2 === 0) { c.description = `${wrong} was seen by the door.`; c.pointsTo = `${wrong} lied.`; }
      else { c.evidenceType = "elimination"; c.description = "Someone was elsewhere."; c.pointsTo = "Not the one."; }
    });
    // and make sure some clue is sourced from a cast path at all
    if (!clues.clues.some((c) => /^CASE\.cast\[/.test(String(c?.sourceInCML ?? ""))) && names.length >= 2) {
      clues.clues[0].sourceInCML = "CASE.cast[0].alibi_window"; clues.clues[0].description = `${names[1]} was at the gate.`;
    }
  },
  auditScramble: (cml, clues) => { clues.audit = { missingDiscriminatingEvidenceIds: ["clue_nope"], invalidSourcePaths: ["CASE.nope"], weakEliminationSuspects: ["Nobody"] }; },
  lockedTranspose: (cml, clues) => {
    const facts = (CB(cml)?.locked_facts ?? []).filter((f) => String(f?.value ?? "").trim());
    if (facts.length < 2) return;
    const [a, b] = facts;
    const map = CB(cml)?.prose_requirements?.clue_to_scene_mapping ?? [];
    const ids = new Set(map.map((m) => String(m?.clue_id ?? "")));
    let k = 0;
    for (const c of clues.clues) {
      if (!ids.has(String(c.id))) continue;
      c.description = k++ % 2 === 0
        ? `The ${String(a.description ?? "clock")} read ${String(b.value)} at the time.`
        : `${String(b.description ?? "chime")}: ${String(a.value)}, and later ${String(b.value)}.`;
    }
  },
  // The X86 shape (2026-08-21): two registry clock values, transposed in the mapped clues.
  lockedInjected: (cml, clues) => {
    const cb = CB(cml);
    cb.locked_facts = [
      ...(Array.isArray(cb.locked_facts) ? cb.locked_facts : []),
      { id: "clock_displayed_time", description: "clock face", value: "a quarter past seven" },
      { id: "chime_time", description: "chimes", value: "a quarter to seven" },
    ];
    cb.prose_requirements ??= {};
    cb.prose_requirements.clue_to_scene_mapping ??= [];
    clues.clues.slice(0, 4).forEach((c, i) => {
      if (!cb.prose_requirements.clue_to_scene_mapping.some((m) => String(m?.clue_id) === String(c.id))) {
        cb.prose_requirements.clue_to_scene_mapping.push({ clue_id: String(c.id), act_number: 1, scene_number: i + 1 });
      }
      c.description = [
        "The clock face showed a quarter to seven when the maid came in.",
        "The chimes rang a quarter past seven.",
        "The clock face read a quarter to seven; the chimes a quarter past seven.",
        "Nobody heard the chimes.",
      ][i];
    });
  },
  strictSlotsGone: (cml, clues) => {
    clues.clues = clues.clues.filter((c) => !/^clue_(culprit_direct_|late_optional_slot_)/.test(String(c.id)));
    for (const c of clues.clues) { c.criticality = "supporting"; if (c.placement === "early") c.placement = "late"; }
  },
};

const run = (fn) => {
  const warns = []; const w = console.warn; console.warn = (...a) => warns.push(a.join(" "));
  try { return { ok: fn(), warns }; } catch (e) { return { threw: String(e?.message ?? e), warns }; } finally { console.warn = w; }
};
const PROBES = {
  checkDiscriminatingTestReachability: (L, cml, clues) => L.checkDiscriminatingTestReachability(cml, clues),
  checkMechanismVisibility: (L, cml, clues) => L.checkMechanismVisibility(cml, clues),
  checkCastNamePathConsistency: (L, cml, clues) => L.checkCastNamePathConsistency(cml, clues),
  repairCastNamePathConsistency: (L, cml, clues) => L.repairCastNamePathConsistency(cml, clues),
  checkModelAuditConsistency: (L, cml, clues) => L.checkModelAuditConsistency(cml, clues),
  reconcileModelAudit: (L, cml, clues) => L.reconcileModelAudit(cml, clues),
  findLockedFactClueTimeConflicts: (L, cml, clues) => L.findLockedFactClueTimeConflicts(cml, clues),
  repairLockedFactClueTimeTranspositions: (L, cml, clues) => L.repairLockedFactClueTimeTranspositions(cml, clues),
  enforceAgent5DeterministicContracts: (L, cml, clues) => L.enforceAgent5DeterministicContracts(cml, clues, {}),
};

let cases = 0, diffs = 0;
const fired = {}; // probe -> cases where OLD produced a non-empty result / throw / mutation
for (const [plant, p] of Object.entries(PLANTS)) {
  for (const { cml, clues } of pairs) {
    for (const [name, probe] of Object.entries(PROBES)) {
      const c0 = structuredClone(cml), k0 = structuredClone(clues); p(c0, k0);
      const before = JSON.stringify(k0);
      const [c1, k1, c2, k2] = [structuredClone(c0), structuredClone(k0), structuredClone(c0), structuredClone(k0)];
      // enforce memoises strict feedback per CML object; fresh clones keep OLD and NEW independent.
      const o = run(() => probe(OLD, c1, k1));
      // CTL=1: a known-positive — NEW's cast-name check answers [] — must show up as diffs.
      const n = run(() => (process.env.CTL === "1" && name === "checkCastNamePathConsistency" ? [] : probe(NEW, c2, k2)));
      const so = JSON.stringify({ r: o, cml: c1, clues: k1 }), sn = JSON.stringify({ r: n, cml: c2, clues: k2 });
      cases++;
      const key = `${plant}:${name}`;
      const f = o.threw || (Array.isArray(o.ok) ? o.ok.length > 0 : (o.ok && o.ok.warnings?.length > 0)) || JSON.stringify(k1) !== before || o.warns.length > 0;
      if (f) fired[key] = (fired[key] ?? 0) + 1;
      if (so !== sn) { diffs++; if (diffs <= 5) console.log("DIFF", key, CB(cml)?.meta?.title, so.slice(0, 300), "\n   vs", sn.slice(0, 300)); }
    }
  }
}
console.log(JSON.stringify({ pairs: pairs.length, cases, diffs }));
const byProbe = {};
for (const [k, v] of Object.entries(fired)) { const probe = k.split(":")[1]; byProbe[probe] = (byProbe[probe] ?? 0) + v; }
console.log("cases where OLD fired, by probe:", JSON.stringify(byProbe));
