#!/usr/bin/env node
/**
 * A_77 §10.7 / WP-003 — the structural cell map, as a derived artifact.
 *
 *   node scripts/corpus-cells.mjs           # regenerate library/index/cells.json
 *   node scripts/corpus-cells.mjs --check   # exit 1 if it is stale (for CI)
 *   npm run corpus:cells
 *
 * ── WHAT A CELL IS ───────────────────────────────────────────────────────────────────────────────
 *
 * `axis × mechanism_family` — 5 × 16 = 80 cells. A cell is a SHAPE OF DECEPTION, not a plot: "an
 * identity mystery whose mechanism is impersonation" is a form the genre uses, and forms are not
 * anybody's property (A_77 §7). Occupied cells map what the genre has done; empty cells map what it
 * has not.
 *
 * ── WHY TWO DIMENSIONS AND NOT THREE ─────────────────────────────────────────────────────────────
 *
 * WP-003 as first written ran this on three dimensions, adding `discriminating_test_shape`. That was
 * wrong, and the correction is the reason this script exists rather than a scratch file.
 *
 * MEASURED 2026-09-18 over all 56 encoded works: the third dimension is a hardcoded lookup from the
 * CML's own `discriminating_test.method`, in `corpus-derive.mjs`:
 *
 *     reenactment            -> reconstruction              24 works
 *     constraint_proof       -> timetable_contradiction     21 works
 *     trap                   -> behavioral_tell             11 works
 *     administrative_pressure-> behavioral_tell             (collides with trap)
 *
 * The correspondence is exact, with no exceptions, because `corpus-classify.mjs` never writes that
 * field — it writes `mechanism_family`, `false_assumption_pattern` and `inference_shape` and nothing
 * else. So the third axis carries no information the CML method does not already carry, and **three
 * of its six enum values — `physical_trace`, `identity_disambiguation`, `chemical_timing` — cannot be
 * emitted at all.** A 480-cell space of which 240 are unreachable by construction is not a map; it is
 * the 2-D map with a relabelled copy of one CML field stapled to it.
 *
 * It is also not addressable. The fingerprint vocabulary has SIX test shapes; `schema/cml_2_0.schema.
 * yaml` allows Agent 3 FOUR methods (`reenactment | trap | constraint_proof | administrative_
 * pressure`) and the two sets share no value. An instruction to generate into a `physical_trace` cell
 * has no word Agent 3 could write to comply. That is A_78 §5's "three mechanism vocabularies" again,
 * one field over.
 *
 * Both dimensions used here are real and expressible: `axis` is already a run parameter
 * (`CML_PRIMARY_AXES`), and `mechanism_family` is the vocabulary the novelty judge and the device
 * library already share.
 *
 * ── THE THREE TIERS (A_79 §4) ────────────────────────────────────────────────────────────────────
 *
 *   us            we have shipped it            -> avoid; repetition-avoidance is the first duty
 *   canon-not-us  the genre uses it, we never   -> the most valuable list we could own
 *   neither       nobody has been there         -> novel, unproven
 *
 * Deterministic, offline, free.
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";

const ROOT = "C:/CML";
const OUT_DIR = `${ROOT}/library/index`;
const OUT = `${OUT_DIR}/cells.json`;
const CHECK = process.argv.includes("--check");

const AXES = ["temporal", "spatial", "identity", "behavioral", "authority"];
const { loadSeedFingerprints } = await import(`file://${ROOT}/packages/novelty/dist/index.js`);

/** The 16-value mechanism vocabulary, read from the schema so it cannot drift from it. */
import yaml from "js-yaml";
const FAMILIES = yaml.load(readFileSync(`${ROOT}/schema/novelty_fingerprint.schema.yaml`, "utf8"))
  .properties.mechanism_family.enum;

const cellKey = (axis, family) => `${axis}|${family}`;

// ── the canon side ───────────────────────────────────────────────────────────────────────────────

const seeds = loadSeedFingerprints().filter((s) => AXES.includes(s.axis));
const canon = new Map();
for (const s of seeds) {
  const k = cellKey(s.axis, s.mechanism_family);
  canon.set(k, (canon.get(k) ?? []).concat(s.id));
}

// ── our side ─────────────────────────────────────────────────────────────────────────────────────

/**
 * `data/novelty-ledger.json` keys its runs under `shipped`. MEASURED: 121 records, all carrying an
 * axis, but only 24 carrying a mechanism family — A_79 §4's "97 of 102 carry no `mechanismFamily`"
 * is still true. So the `us` side is a quarter of our history, and `canon-not-us` is a FLOOR on the
 * number of forms we have never attempted, never a ceiling.
 */
const ledgerPath = `${ROOT}/data/novelty-ledger.json`;
const ledger = existsSync(ledgerPath) ? JSON.parse(readFileSync(ledgerPath, "utf8")) : {};
const runs = Array.isArray(ledger) ? ledger : (ledger.shipped ?? []);
const famOf = (r) => r.mechanismFamily ?? r.mechanism_family ?? r.fingerprint?.mechanism_family;
const axisOf = (r) => r.axis ?? r.primaryAxis ?? r.fingerprint?.axis;
const ours = new Map();
for (const r of runs) {
  const a = axisOf(r); const f = famOf(r);
  if (!a || !f || !AXES.includes(a)) continue;
  ours.set(cellKey(a, f), (ours.get(cellKey(a, f)) ?? 0) + 1);
}

// ── tiers ────────────────────────────────────────────────────────────────────────────────────────

const tierOf = (k) => {
  const c = canon.has(k); const u = ours.has(k);
  return c && u ? "both" : c ? "canon-not-us" : u ? "us-only" : "neither";
};

const all = [];
for (const a of AXES) for (const f of FAMILIES) {
  const k = cellKey(a, f);
  all.push({ cell: k, axis: a, mechanism_family: f, tier: tierOf(k), canon: canon.get(k) ?? [], ourRuns: ours.get(k) ?? 0 });
}

// ── the morph: an attested cell, one dimension changed, landing somewhere nobody is ──────────────

/**
 * Ranked by DISTANCE FROM THE CORPUS CENTRE OF MASS, not by how many attested neighbours a cell has.
 *
 * MEASURED: neighbour-count ranking returned ten cells that were all `identity · …`, which is the
 * genre's most crowded region as this corpus samples it — the least original place a morph could
 * land. Frequency-sum ranking is the correction: a lower score means both of the cell's values are
 * rare here, so the target sits at the thin edge rather than the thick middle.
 */
const freqAxis = {}; const freqFam = {};
for (const s of seeds) {
  freqAxis[s.axis] = (freqAxis[s.axis] ?? 0) + 1;
  freqFam[s.mechanism_family] = (freqFam[s.mechanism_family] ?? 0) + 1;
}

const morphs = [];
for (const target of all) {
  if (target.tier === "us-only" || target.tier === "both") continue;   // never morph into repetition
  const routes = [];
  for (const a2 of AXES) {
    if (a2 === target.axis) continue;
    const src = cellKey(a2, target.mechanism_family);
    if (canon.has(src)) routes.push({ change: "axis", from: a2, to: target.axis, source_works: canon.get(src).slice(0, 3) });
  }
  for (const f2 of FAMILIES) {
    if (f2 === target.mechanism_family) continue;
    const src = cellKey(target.axis, f2);
    if (canon.has(src)) routes.push({ change: "mechanism_family", from: f2, to: target.mechanism_family, source_works: canon.get(src).slice(0, 3) });
  }
  if (!routes.length) continue;
  /**
   * ANCHORED = both of the target's values are attested somewhere in the corpus.
   *
   * MEASURED: without this, the four most remote candidates were `authority|role_invisibility`,
   * `authority|investigative_blind_spot` and their temporal twins — and those two families have ZERO
   * attestation in any cell. Landing there is not morphing an attested shape one step; it is
   * inventing a form the corpus has never seen, which throws away the property that makes the
   * operation work: novel by construction AND genre-fluent by construction, because every part is
   * attested. (Both families are the two the schema added after A_77 §9.2 counted fourteen, which is
   * consistent with nothing being filed under them.)
   *
   * Unanchored cells are kept in the output and sorted last, because "no work in this corpus uses
   * this mechanism family at all" is itself worth being able to see.
   */
  const anchored = (freqAxis[target.axis] ?? 0) > 0 && (freqFam[target.mechanism_family] ?? 0) > 0;
  morphs.push({
    cell: target.cell, tier: target.tier, anchored, routes,
    remoteness: (freqAxis[target.axis] ?? 0) + (freqFam[target.mechanism_family] ?? 0),
  });
}
morphs.sort((a, b) =>
  (a.anchored === b.anchored ? 0 : a.anchored ? -1 : 1)
  || a.remoteness - b.remoteness
  || b.routes.length - a.routes.length);

// ── richness: how much of the map the genre actually occupies ────────────────────────────────────

/**
 * Chao1 with its analytic log-normal interval (Chao 1987). It estimates how many cells the GENRE
 * occupies, which is the right target — the theoretical 80 includes combinations no detective novel
 * has ever needed.
 *
 * Reported with the interval and the sensitivity because it rests on a thin tail: with f2 small, the
 * estimator divides by a handful of observations. A naive bootstrap of this statistic is WRONG and
 * was discarded before it reached a paper — resampling with replacement destroys the singleton
 * structure Chao1 reads, and returned a median of 26 against a point estimate of 71.
 */
const counts = [...canon.values()].map((v) => v.length);
const Sobs = counts.length;
const f1 = counts.filter((v) => v === 1).length;
const f2 = counts.filter((v) => v === 2).length;
const f0 = f2 > 0 ? (f1 * f1) / (2 * f2) : (f1 * (f1 - 1)) / 2;
const chao1 = Sobs + f0;
const r = f2 > 0 ? f1 / f2 : 0;
const varS = f2 > 0 ? f2 * (0.5 * r * r + r ** 3 + 0.25 * r ** 4) : 0;
const K = f0 > 0 ? Math.exp(1.96 * Math.sqrt(Math.log(1 + varS / (f0 * f0)))) : 1;

/** Chao et al. (2014) extrapolation — how many more encodes to reach a given richness. */
const n = seeds.length;
const f0e = Math.max(f0, 0.5);
const project = (m) => Sobs + f0e * (1 - Math.pow(1 - f1 / (n * f0e + f1), m));
const encodesFor = (target) => { for (let m = 1; m <= 200000; m += 1) if (project(m) >= target) return m; return null; };

const tally = all.reduce((acc, c) => (acc[c.tier] = (acc[c.tier] ?? 0) + 1, acc), {});
const map = {
  generated_by: "scripts/corpus-cells.mjs",
  generated_on: new Date().toISOString().slice(0, 10),
  note: "DERIVED from packages/novelty/data/seed-fingerprints.yaml and data/novelty-ledger.json. "
    + "Never hand-edit; run `npm run corpus:cells`. CI checks it with --check.",
  dimensions: {
    used: ["axis", "mechanism_family"],
    space: AXES.length * FAMILIES.length,
    excluded: {
      discriminating_test_shape:
        "A hardcoded lookup from the CML's 4-value discriminating_test.method (corpus-derive.mjs:57), "
        + "exact over all 56 encoded works, never written by classify. Three of its six enum values "
        + "cannot be emitted, and the CML and fingerprint vocabularies share no value, so a cell "
        + "naming one is not addressable as an instruction to Agent 3.",
    },
  },
  inputs: { canon_fingerprints: seeds.length, ledger_runs: runs.length, ledger_runs_with_family: [...ours.values()].reduce((a, b) => a + b, 0) },
  tiers: tally,
  richness: {
    observed_cells: Sobs,
    chao1_estimate: Number(chao1.toFixed(1)),
    ci95: [Number((Sobs + f0 / K).toFixed(1)), Number((Sobs + f0 * K).toFixed(1))],
    singletons_f1: f1, doubletons_f2: f2,
    caution: f2 < 5 ? `f2=${f2}: the estimate rests on ${f2} observations and the interval is wide. Order of magnitude, not a target.` : null,
    encodes_for_80pct: encodesFor(chao1 * 0.8),
    encodes_for_90pct: encodesFor(chao1 * 0.9),
    projection: { "+109_held": Number(project(109).toFixed(1)), "+458_entire_pool": Number(project(458).toFixed(1)) },
  },
  cells: all,
  morph_candidates: {
    anchored: morphs.filter((m) => m.anchored).length,
    unanchored: morphs.filter((m) => !m.anchored).length,
    top: morphs.slice(0, 40),
  },
};

const rendered = `${JSON.stringify(map, null, 1)}\n`;

if (CHECK) {
  if (!existsSync(OUT)) { console.error("! library/index/cells.json is missing — run `npm run corpus:cells`."); process.exit(1); }
  const strip = (t) => t.replace(/"generated_on": "[^"]*",?\n?/, "");
  if (strip(readFileSync(OUT, "utf8")) !== strip(rendered)) {
    console.error("! library/index/cells.json is STALE. Run `npm run corpus:cells` and commit it.");
    process.exit(1);
  }
  console.log(`cell map fresh — ${Sobs} of ${all.length} cells occupied.`);
  process.exit(0);
}

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT, rendered, "utf8");
console.log(`wrote ${OUT}`);
console.log(`  space: ${AXES.length} axes x ${FAMILIES.length} families = ${all.length} cells`);
console.log(`  tiers: ${Object.entries(tally).map(([k, v]) => `${k} ${v}`).join(" · ")}`);
console.log(`  richness: ${Sobs} observed · Chao1 ${chao1.toFixed(0)} [${(Sobs + f0 / K).toFixed(0)}, ${(Sobs + f0 * K).toFixed(0)}]`);
console.log(`  to 80% of reachable: +${map.richness.encodes_for_80pct} encodes · to 90%: +${map.richness.encodes_for_90pct}`);
console.log(`  morph candidates: ${morphs.filter((m) => m.anchored).length} anchored · ${morphs.filter((m) => !m.anchored).length} unanchored (target family attested nowhere)`);
for (const m of morphs.slice(0, 6)) {
  console.log(`    ${m.cell.padEnd(40)} ${m.tier.padEnd(13)} remoteness ${String(m.remoteness).padStart(3)} · ${m.routes.length} route(s)`);
}
