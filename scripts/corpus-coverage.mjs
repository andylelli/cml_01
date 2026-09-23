#!/usr/bin/env node
/**
 * A_97 — corpus saturation against the A_77 §9 targets.
 *
 *   node scripts/corpus-coverage.mjs [--json]
 *
 * ── WHY A SEPARATE SCRIPT ────────────────────────────────────────────────────────────────────────
 *
 * A_77 §9 states the targets — every axis >= 6, every mechanism family >= 3, eight named forms held
 * at all — and then nothing computes them. The coverage numbers in §9.1 were counted by hand in
 * August 2026 and have been wrong since the first re-encode landed: §9.1 says `behavioral` is 0, and
 * it is 4. A target nobody can check is a wish.
 *
 * This reads the DERIVED fingerprints (never the ledger, which A_77 §4.3 measured disagreeing with
 * its own sources in eleven of fourteen entries) and prints the gap. Free, offline, no LLM.
 *
 * ── WHAT IT DELIBERATELY CANNOT DO ───────────────────────────────────────────────────────────────
 *
 * It cannot tell you which UNACQUIRED work fills a gap. Axis and mechanism family are assigned by the
 * ENCODE stage from the text (§10.3) precisely because assigning them from a title is how four
 * hallucinated plots entered the library in the first place. So this reports the hole; choosing what
 * to throw at it stays a judgement made from the curated §15.1 column, and the hole is re-measured
 * after each batch rather than predicted before it.
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const JSON_OUT = process.argv.includes("--json");

/** A_77 §9.1 — per-axis target. `epistemic` is in the fingerprint schema and not in CML_PRIMARY_AXES
 *  (§4.4), so it is listed to be counted, not to be filled. */
const AXIS_TARGET = { temporal: 8, spatial: 8, identity: 8, behavioral: 6, authority: 6, epistemic: 0 };

/** A_77 §9.2 — all fourteen, none below three. The vocabulary is `schema/novelty_fingerprint.schema.yaml`. */
const FAMILY_TARGET = 3;
const FAMILIES = yaml.load(readFileSync(`${ROOT}/schema/novelty_fingerprint.schema.yaml`, "utf8"))
  .properties.mechanism_family.enum;

const works = [];
for (const slug of readdirSync(WORKS)) {
  const prov = `${WORKS}/${slug}/provenance.yaml`;
  if (!existsSync(prov)) continue;
  const p = yaml.load(readFileSync(prov, "utf8"));
  const fpPath = `${WORKS}/${slug}/fingerprint.yaml`;
  let fp = null;
  if (existsSync(fpPath)) {
    const y = yaml.load(readFileSync(fpPath, "utf8"));
    fp = Array.isArray(y) ? y[0] : y;
  }
  works.push({
    slug,
    title: p?.title ?? slug,
    year: p?.first_publication_year ?? null,
    clearance: p?.clearance?.verdict ?? "unknown",
    text: existsSync(`${ROOT}/library/texts/${slug}.txt`),
    encoded: existsSync(`${WORKS}/${slug}/case.cml2.yaml`),
    axis: fp?.axis ?? null,
    family: fp?.mechanism_family ?? null,
  });
}

const encoded = works.filter((w) => w.encoded && w.axis);
const count = (key) => encoded.reduce((a, w) => (a[w[key]] = (a[w[key]] || 0) + 1, a), {});
const axes = count("axis");
const fams = count("family");

const report = {
  works: works.length,
  with_text: works.filter((w) => w.text).length,
  encoded: works.filter((w) => w.encoded).length,
  awaiting_encode: works.filter((w) => w.text && !w.encoded).map((w) => w.slug),
  encoded_unclassified: works.filter((w) => w.encoded && !w.axis).length,   // A_103 B58
  axis: Object.fromEntries(Object.entries(AXIS_TARGET).map(([a, t]) => [a, { have: axes[a] || 0, target: t, gap: Math.max(0, t - (axes[a] || 0)) }])),
  family: Object.fromEntries(FAMILIES.map((f) => [f, { have: fams[f] || 0, target: FAMILY_TARGET, gap: Math.max(0, FAMILY_TARGET - (fams[f] || 0)) }])),
};

if (JSON_OUT) { console.log(JSON.stringify(report, null, 1)); process.exit(0); }

console.log(`library: ${report.works} works · ${report.with_text} with text · ${report.encoded} encoded`);
console.log(`awaiting encode: ${report.awaiting_encode.length}`);
// A_103 B58: MEASURED 137 encoded above a gap table summing to 56 - the other 81 had no fingerprint yet.
// The closing line prescribed paid encodes for what is a free classify step.
if (report.encoded_unclassified) console.log(`encoded but NOT YET CLASSIFIED: ${report.encoded_unclassified} - the table below counts only classified works; run corpus-derive + corpus-classify before reading its gap as an encode gap`);
console.log("\naxis                have  target  gap");
for (const [a, r] of Object.entries(report.axis)) {
  console.log(`  ${a.padEnd(18)}${String(r.have).padStart(4)}${String(r.target).padStart(8)}${String(r.gap).padStart(5)}${r.gap ? "  <-" : ""}`);
}
console.log("\nmechanism family            have  target  gap");
for (const [f, r] of Object.entries(report.family)) {
  console.log(`  ${f.padEnd(26)}${String(r.have).padStart(4)}${String(r.target).padStart(8)}${String(r.gap).padStart(5)}${r.gap ? "  <-" : ""}`);
}
const axisGap = Object.values(report.axis).reduce((a, r) => a + r.gap, 0);
const famGap = Object.values(report.family).reduce((a, r) => a + r.gap, 0);
console.log(`\ntotal gap: ${axisGap} axis slots, ${famGap} family slots.`);
console.log(`A work fills one of each, so the binding target is max(${axisGap}, ${famGap}) = ${Math.max(axisGap, famGap)} more encoded works — IF every one landed on an empty cell, which none will.`);
