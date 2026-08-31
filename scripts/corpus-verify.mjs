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
const SRC =
  (args.find((a) => a.startsWith("--src=")) ?? "").split("=")[1] ||
  "C:/Users/andyl/AppData/Local/Temp/claude/C--CML/37bf12e3-44c1-4bb6-ae7f-407b46016ade/scratchpad/src";

const N = (s) => String(s).replace(/\s+/g, " ").trim();
const NORM = (t) => t.replace(/[\u2018\u2019]/g, "'").replace(/[\u201C\u201D]/g, '"').replace(/[\u2013\u2014]/g, "-");

/** Slug -> cached text filename, where the two disagree. */
const TEXT_ALIAS = {
  the_fenchurch_street_mystery: "fenchurch_street",
  a_jury_of_her_peers: "jury_of_her_peers",
  the_case_of_oscar_brodski: "oscar_brodski",
};

const rows = [];
for (const slug of readdirSync(WORKS).sort()) {
  const rawPath = `${WORKS}/${slug}/encode-raw.json`;
  const textPath = `${SRC}/${TEXT_ALIAS[slug] ?? slug}.txt`;
  if (!existsSync(rawPath)) {
    rows.push({ slug, state: "no encode-raw.json — cannot recompute" });
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

  const spans = list.map((a) => {
    const anchor = typeof a === "string" ? a : a.anchor ?? a.span ?? "";
    const claim = typeof a === "string" ? "" : a.claim ?? "";
    const needle = NORM(N(anchor));
    const at = needle.length > 0 ? srcN.indexOf(needle) : -1;
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
    ok,
    total: spans.length,
    priorOk,
    priorTot,
    stale: priorOk !== null && (priorOk !== ok || priorTot !== spans.length),
  });

  if (WRITE) {
    writeFileSync(
      reportPath,
      JSON.stringify({ ...prior, slug, spans, verified_by: "corpus-verify.mjs", verified_on: "2026-08-31" }, null, 1),
      "utf8",
    );
  }
}

console.log(`recomputed anchor coverage${WRITE ? " (reports REWRITTEN)" : " (dry run — pass --write to persist)"}\n`);
console.log("work                              recomputed   stored     ");
for (const r of rows) {
  if (r.state) {
    console.log(`${r.slug.padEnd(33)} ${r.state}`);
    continue;
  }
  const pct = Math.round((100 * r.ok) / r.total);
  const stored = r.priorOk === null ? "(none)" : `${r.priorOk}/${r.priorTot}`;
  console.log(
    `${r.slug.padEnd(33)} ${String(`${r.ok}/${r.total}`).padStart(6)} ${String(`${pct}%`).padStart(5)}   ${stored.padStart(7)}${r.stale ? "   <-- STORED REPORT WAS STALE" : ""}`,
  );
}
