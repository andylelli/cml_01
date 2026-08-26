#!/usr/bin/env node
/**
 * ANALYSIS_74 §8 — the free measurements, all of them, from files already on disk.
 *
 * §8.6's argument is that "is the engine producing variety?" and "does variety earn marks?" are
 * different questions, that only the second needs a reader, and that every attempt so far has
 * conflated them and therefore spent reads answering the first. This script answers everything on the
 * free side of that line, in one place, so a paid run is never spent discovering something a file
 * already knew.
 *
 * Three reports:
 *
 *   1. CORPUS COVERAGE (DE2/DE4) — dispersion over the cross-run ledger.
 *   2. READS BY MECHANISM FAMILY — the 39-read external manifest, cross-tabbed by what the story was
 *      actually about. This is the closest thing to a retrospective answer to DE9, and its
 *      confounding is stated rather than glossed.
 *   3. SAME-DAY PAIRS — the matched-pair variance evidence already in the manifest, which is what
 *      A_74 §6.2's two-run probe was going to buy. It is imperfect (see below) and it is free.
 *
 *   node scripts/distinctiveness-report.mjs
 */

import { readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const dist = (p) => pathToFileURL(join(ROOT, "apps", "worker", "dist", "jobs", p)).href;
const { loadNoveltyLedger } = await import(dist("novelty-ledger.js"));
const { ledgerDispersion, familyOfRecord } = await import(dist("novelty-dispersion.js"));

const CATS = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue", "atmosphere", "clues", "pacing", "ending", "prose"];
const rule = (n = 100) => console.log("-".repeat(n));

// ── 1. corpus coverage ───────────────────────────────────────────────────────────────────────────

const records = await loadNoveltyLedger();
console.log("\n\n1. CORPUS COVERAGE — what the pipeline has actually shipped (DE2 / DE4)\n");
const d = ledgerDispersion(records);
console.log(`   ${records.length} shipped run(s) in the ledger; coverage over the last ${d.window}\n`);
console.log("   field              H     distinct  vocabulary   most common");
rule(92);
for (const f of d.fields) {
  const vocab = f.vocabulary === null ? "free text" : `${f.vocabulary} values`;
  const top = f.top ? `"${f.top.value.slice(0, 34)}" ${Math.round(f.top.share * 100)}%` : "-";
  console.log(`   ${f.field.padEnd(17)} ${f.entropy.toFixed(2)}  ${String(f.distinct).padStart(6)}    ${vocab.padEnd(12)} ${top}`);
}
console.log("\n   Read the CONTRAST, not the rows. A closed vocabulary at 0.00 beside free text at 1.00 is");
console.log("   one corpus described two ways: the ledger's own avoidance lines are built from the free-text");
console.log("   fields, where variety is guaranteed and therefore meaningless.");
console.log("\n   families shipped:");
const famCount = new Map();
for (const r of records) famCount.set(familyOfRecord(r), (famCount.get(familyOfRecord(r)) ?? 0) + 1);
for (const [f, n] of [...famCount].sort((a, b) => b[1] - a[1])) console.log(`     ${String(n).padStart(3)}  ${f}`);

// ── 2. reads by family ───────────────────────────────────────────────────────────────────────────

const rows = JSON.parse(readFileSync(join(ROOT, "eval", "results", "external-read", "manifest.json"), "utf8"));

/**
 * Classify a READ by its manuscript filename. Deliberately separate from `classifyMechanismFamily`:
 * that one reads structured CML fields, this one has only a slug, and pretending a filename is a CML
 * would be the "one concept written twice" defect this whole section is about.
 */
const TITLE_FAMILY = [
  ["clock/time", /clock|chime|pendulum|hourglass|sundial|hour|bell_tower|strike|minute|frozen/],
  ["tide", /tide|tidal|drown/],
  ["poison", /poison|toxin|arsenic|delayed_decep/],
  ["acoustic", /echo|acoustic|gramophone|recorded/],
  ["identity", /masquerade|masks|identity|impersonat/],
];
const classifyTitle = (p) => {
  const s = String(p ?? "").toLowerCase();
  for (const [f, re] of TITLE_FAMILY) if (re.test(s)) return f;
  return "unlabelled";
};
const stamp = (r) => {
  const m = (r.bundleId + " " + (r.storyPath ?? "")).match(/(20\d{6})[-_]?(\d{4})?/);
  return m ? { d: m[1], t: m[2] ?? "0000" } : null;
};
const reads = rows
  .map((r) => ({
    s: stamp(r),
    fam: classifyTitle(r.storyPath),
    ext: r.externalFinal,
    sum: CATS.reduce((a, c) => a + (r.externalCategories?.[c] ?? 0), 0),
    title: String(r.storyPath ?? "").split("/").pop(),
  }))
  .filter((x) => x.s && Number.isFinite(x.ext));

console.log("\n\n2. EXTERNAL READS BY MECHANISM FAMILY — a retrospective, CONFOUNDED look at DE9\n");
console.log("   The pipeline got dramatically better over time, and the non-clock reads are clustered in");
console.log("   July while the clock reads dominate August. So a raw family comparison measures CALENDAR,");
console.log("   not mechanism. Both views are printed; neither settles anything on its own.\n");
const byFam = new Map();
for (const r of reads) (byFam.get(r.fam) ?? byFam.set(r.fam, []).get(r.fam)).push(r);
console.log("   family        n   mean  min  max   median date");
rule(60);
for (const [f, list] of [...byFam].sort((a, b) => b[1].length - a[1].length)) {
  const e = list.map((x) => x.ext);
  const mean = (e.reduce((a, b) => a + b, 0) / e.length).toFixed(1);
  const dates = list.map((x) => x.s.d).sort();
  console.log(`   ${f.padEnd(12)} ${String(list.length).padStart(2)}  ${mean.padStart(5)} ${String(Math.min(...e)).padStart(4)} ${String(Math.max(...e)).padStart(4)}   ${dates[Math.floor(dates.length / 2)]}`);
}

console.log("\n   The only comparison that is NOT confounded by calendar — non-clock reads with a clock read");
console.log("   in the same month:\n");
const byMonth = new Map();
for (const r of reads) {
  const k = r.s.d.slice(0, 6);
  (byMonth.get(k) ?? byMonth.set(k, []).get(k)).push(r);
}
for (const [m, list] of [...byMonth].sort()) {
  const clock = list.filter((x) => x.fam === "clock/time");
  const other = list.filter((x) => x.fam !== "clock/time" && x.fam !== "unlabelled");
  if (clock.length === 0 || other.length === 0) continue;
  const avg = (a) => (a.reduce((x, y) => x + y.ext, 0) / a.length).toFixed(1);
  console.log(`   ${m}   clock n=${clock.length} mean ${avg(clock)}   |   non-clock n=${other.length} mean ${avg(other)}   (${other.map((o) => `${o.fam} ${o.ext}`).join(", ")})`);
}

// ── 3. same-day pairs ────────────────────────────────────────────────────────────────────────────

console.log("\n\n3. SAME-DAY PAIRS — the variance evidence already on disk (A_74 §6.2)\n");
console.log("   §6.2 planned to spend two runs establishing a lower bound on run-to-run spread. Consecutive");
console.log("   same-day reads are exactly that measurement, already paid for. The caveat is real and is");
console.log("   printed with the numbers: the manifest carries NO build or flag metadata, so a short gap is");
console.log("   evidence of an unchanged build, not proof of one — and at least one pair is a known A/B.\n");
const byDay = new Map();
for (const r of reads) (byDay.get(r.s.d) ?? byDay.set(r.s.d, []).get(r.s.d)).push(r);
const mins = (t) => parseInt(t.slice(0, 2), 10) * 60 + parseInt(t.slice(2), 10);
console.log("   date      gap    dEXT  dSUM   pair");
rule(104);
const gaps = [];
for (const [day, list] of [...byDay].sort()) {
  if (list.length < 2) continue;
  list.sort((a, b) => a.s.t.localeCompare(b.s.t));
  for (let i = 0; i < list.length - 1; i += 1) {
    const a = list[i];
    const b = list[i + 1];
    const dt = mins(b.s.t) - mins(a.s.t);
    const dSum = Math.abs(a.sum - b.sum);
    if (dt <= 60) gaps.push({ day, dt, dExt: Math.abs(a.ext - b.ext), dSum, a, b });
    console.log(
      `   ${day} ${String(dt).padStart(4)}m  ${String(Math.abs(a.ext - b.ext)).padStart(4)}  ${String(dSum).padStart(4)}   ` +
        `${a.fam}/${b.fam}  ${a.ext}->${b.ext} (sum ${a.sum}->${b.sum})`,
    );
  }
}
console.log("\n   Pairs less than an hour apart — too close for an edit-and-rebuild between them:\n");
for (const g of gaps) {
  console.log(`     ${g.day}  ${g.dt} min apart   dEXT ${g.dExt}   dSUM ${g.dSum}   ${g.a.title?.slice(0, 34)} -> ${g.b.title?.slice(0, 34)}`);
}
const worst = gaps.reduce((m, g) => Math.max(m, g.dSum), 0);
console.log(`\n   Largest sum-gap among close pairs: ${worst}.`);
console.log("   §6.2's pre-committed rule: sum-gap >= 4 kills single-run attribution; 2-3 marginal; <=1 defensible.");
console.log(`   Verdict on this evidence: ${worst >= 4 ? "SINGLE-RUN ATTRIBUTION IS NOT SAFE." : "inconclusive."}`);
console.log("   Caveat that must travel with that verdict: one qualifying pair (2026-08-06) is recorded in");
console.log("   the manifest as an N6 control/treatment A/B, so its gap contains a lever effect as well as");
console.log("   noise. The other has no metadata at all. This is suggestive, not a clean variance estimate —");
console.log("   but every reading of it points the same way, and none of it cost anything.\n");
