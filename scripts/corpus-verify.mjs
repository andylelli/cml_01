#!/usr/bin/env node
/**
 * A_79 §11.3 — recompute anchor coverage from the model's own output and the source text.
 *
 *   node scripts/corpus-verify.mjs [--src <dir>] [--write]
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * `encode-report.json` is written once, at the end of an encode run, and is never revisited. But
 * `corpus-repair.mjs` can run AFTERWARDS and change the case — so for any repaired work the report
 * describes a version of the case that no longer exists. MEASURED: `the_valley_of_fear`'s report says
 * 8/20 anchors located; recomputing from its own `encode-raw.json` gives **15/20**. The evidence gate
 * in `corpus-sync-fingerprints.mjs` was demoting that work on a stale number.
 *
 * A report that can go stale is not evidence. This recomputes the same measurement from two inputs
 * that cannot drift — the anchors the model actually returned (`encode-raw.json`) and the source text
 * — and rewrites the report from them.
 *
 * ── THE MATCH IS THE HARNESS'S, NOT A NEW ONE ────────────────────────────────────────────────────
 *
 * `NORM` and `N` are copied verbatim from `corpus-encode.mjs` so this is the same test, not a second
 * opinion. One deliberate addition: the source is whitespace-collapsed too. In `corpus-encode.mjs`
 * `N()` is applied to the anchor but never to the source, so an anchor spanning a line break could
 * never match. That was tested before being fixed and it changes nothing on the current texts — they
 * are stored de-wrapped, at 185-283 characters a line, and normalising the source recovers **0**
 * anchors across all seven works. The bug is real but latent; it would bite the first hard-wrapped
 * text we cache, so it is corrected here rather than left as a trap.
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from "node:fs";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const args = process.argv.slice(2);
const WRITE = args.includes("--write");
/**
 * A_97: the fourth script in this family to default at a closed session's scratchpad directory, and
 * the one where it was hardest to see — a missing source reports as "source text not cached — cannot
 * recompute", which reads like a fact about the corpus rather than a broken path. Every work this
 * script exists to rescue was in that bucket.
 */
const SRC =
  (args.find((a) => a.startsWith("--src=")) ?? "").split("=")[1] ||
  `${ROOT}/library/texts`;

const N = (s) => String(s).replace(/\s+/g, " ").trim();
const NORM = (t) => t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-");

/** Slug -> cached text filename, where the two disagree. */
/**
 * A_103 B29: there is no alias. `TEXT_ALIAS` mapped three slugs to text files named
 * `fenchurch_street.txt`, `jury_of_her_peers.txt`, `oscar_brodski.txt` - names from the August
 * scratchpad. MEASURED 2026-09-23: zero of the three exist in `library/texts/`, where every text is
 * keyed by its full slug, so those works reported "source text not cached" on every run of this
 * script and could never be re-verified. Same family as the four dead scratchpad defaults (A_97).
 */

const rows = [];
let notEncoded = 0;
// A_103 B42: `.verification.json` lives in library/works and was listed as a work ("no
// encode-raw.json — cannot recompute"). Only directories are works.
for (const slug of readdirSync(WORKS, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
  const rawPath = `${WORKS}/${slug}/encode-raw.json`;
  const textPath = `${SRC}/${slug}.txt`;
  if (!existsSync(rawPath)) {
    // A_103 B45: MEASURED 19 "cannot recompute" rows, 14 of them works never encoded at all. Only an
    // ENCODED work without its raw is a defect (5, from the August pilot); the rest are one count.
    if (existsSync(`${WORKS}/${slug}/case.cml2.yaml`)) rows.push({ slug, state: "encoded, but no encode-raw.json — re-encode to verify" });
    else notEncoded++;
    continue;
  }
  if (!existsSync(textPath)) {
    rows.push({ slug, state: "source text not cached — cannot recompute" });
    continue;
  }

  const raw = JSON.parse(readFileSync(rawPath, "utf8"));
  const data = raw.CASE ? raw : raw.case ?? raw;
  const list = data.anchors ?? data.spans ?? [];
  const srcN = NORM(N(readFileSync(textPath, "utf8")));
  const srcL = srcN.toLowerCase(); const foldable = srcL.length === srcN.length;   // A_103 B50: same fold as corpus-encode.mjs

  const spans = list.map((a) => {
    const anchor = typeof a === "string" ? a : a.anchor ?? a.span ?? "";
    const claim = typeof a === "string" ? "" : a.claim ?? "";
    const needle = NORM(N(anchor));
    const exact = needle.length > 0 ? srcN.indexOf(needle) : -1;
    const at = exact >= 0 ? exact : (foldable && needle.length > 0 ? srcL.indexOf(needle.toLowerCase()) : -1);
    if (at < 0) return { claim, anchor, span: "", ok: false };
    let lo = at;
    let hi = at + needle.length;
    while (lo > 0 && !/[.!?"]/.test(srcN[lo - 1])) lo -= 1;
    while (hi < srcN.length && !/[.!?]/.test(srcN[hi])) hi += 1;
    return { claim, anchor, span: srcN.slice(lo, Math.min(hi + 1, srcN.length)).trim(), ok: true };
  });

  const ok = spans.filter((s) => s.ok).length;
  const reportPath = `${WORKS}/${slug}/encode-report.json`;
  const prior = existsSync(reportPath) ? JSON.parse(readFileSync(reportPath, "utf8")) : {};
  const priorOk = Array.isArray(prior.spans) ? prior.spans.filter((s) => s.ok).length : null;
  const priorTot = Array.isArray(prior.spans) ? prior.spans.length : null;

  rows.push({
    slug,
    // A_103 B46: MEASURED 18 of the 150 coverage rows were raw encodes REJECTED at adjudication -
    // encode-raw + report + adjudication on disk, no case. They printed exactly like the 132 works.
    rejected: !existsSync(`${WORKS}/${slug}/case.cml2.yaml`),
    ok,
    total: spans.length,
    priorOk,
    priorTot,
    stale: priorOk !== null && (priorOk !== ok || priorTot !== spans.length),
  });

  if (WRITE) {
    writeFileSync(
      reportPath,
      JSON.stringify({ ...prior, slug, spans, verified_by: "corpus-verify.mjs", verified_on: new Date().toISOString().slice(0, 10) }, null, 1),   // A_103 B48: was the literal "2026-08-31" on 150 reports rewritten 09-23
      "utf8",
    );
  }
}

console.log(`recomputed anchor coverage${WRITE ? " (reports REWRITTEN)" : " (dry run — pass --write to persist)"}\n`);
if (notEncoded) console.log(`${notEncoded} works hold a text but no encoding yet — not listed\n`);
const rejected = rows.filter((r) => r.rejected).length;
if (rejected) console.log(`${rejected} raw encodes were rejected at adjudication and hold no case - marked below, not works\n`);
console.log("work                              recomputed   stored     ");
for (const r of rows) {
  if (r.state) {
    console.log(`${r.slug.padEnd(33)} ${r.state}`);
    continue;
  }
  const pct = Math.round((100 * r.ok) / r.total);
  const stored = r.priorOk === null ? "(none)" : `${r.priorOk}/${r.priorTot}`;
  console.log(
    `${r.slug.padEnd(33)} ${String(`${r.ok}/${r.total}`).padStart(6)} ${String(`${pct}%`).padStart(5)}   ${stored.padStart(7)}${r.stale ? "   <-- STORED REPORT WAS STALE" : ""}${r.rejected ? "   (case REJECTED at adjudication - not in the corpus)" : ""}`,
  );
}
