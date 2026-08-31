#!/usr/bin/env node
/**
 * A_79 A2 — regenerate `packages/novelty/data/seed-fingerprints.yaml` from the corpus.
 *
 *   node scripts/corpus-sync-fingerprints.mjs           # rewrite the ledger
 *   node scripts/corpus-sync-fingerprints.mjs --check   # exit 1 if it is stale (for CI)
 *
 * ── WHY ──────────────────────────────────────────────────────────────────────────────────────────
 *
 * The ledger's own header said "Derived artifact — regenerated when the seeds change". It was nothing
 * of the kind: it was hand-authored, committed exactly once, and A_77 §4.3 measured it disagreeing
 * with its own source files in ELEVEN of fourteen entries. A file that claims to be derived and is not
 * is worse than one that admits it is hand-written, because nobody re-checks it.
 *
 * ── THE EVIDENCE GATE, AND WHY IT EXISTS ─────────────────────────────────────────────────────────
 *
 * Deriving the ledger from the re-encoded corpus is only an improvement where the re-encode is RIGHT.
 * The first version of this script promoted every validator-clean case, and that immediately broke a
 * load-bearing novelty invariant (`novelty.test.ts`, §9.4): a deliberate paraphrase of The Big Bow
 * Mystery stopped being caught as a clone.
 *
 * The cause was not the test. The Big Bow re-encode has Grodman drugging the victim, entering with a
 * key and manipulating the bolt — a conventional locked-room solution, and not Zangwill's. His actual
 * trick is that the man who breaks in is the one who kills, in the act of "discovery". And the
 * evidence was ALREADY ON DISK: `encode-report.json` records the mechanism anchor
 * ("Grodman had drugged Constant…") as `ok: false`, meaning that sentence is nowhere in the book.
 * The encode was promoted anyway because promotion gated on `validateCml` — a SCHEMA check, which a
 * fluent invention passes as easily as the truth.
 *
 * So promotion now gates on the anchor evidence instead. MEASURED coverage, 2026-08-31:
 *
 *     a_study_in_scarlet   19/20  95%    the_mystery_of_the_yellow_room  10/20  50%
 *     the_sign_of_the_four 10/12  83%    the_leavenworth_case             9/19  47%
 *     the_big_bow_mystery   9/20  45%    the_valley_of_fear               8/20  40%
 *     the_hound_of_the_baskervilles  3/20  15%  — "The cause of death", "The culprit",
 *                                                 "The mechanism" all unverified
 *
 * ── THREE STATES, NOT TWO ────────────────────────────────────────────────────────────────────────
 *
 * "We looked and it failed" and "we never looked" are different claims and the ledger says which:
 *
 *   derived              a report exists and passes the gate — trust it
 *   derived_unverified   no report on disk; the work was verified in a session whose evidence was
 *                        never persisted, so it is kept and TAGGED rather than silently trusted
 *   legacy_hand_authored either never re-encoded, or re-encoded and DEMOTED by the gate
 *
 * ── IDEMPOTENCE ──────────────────────────────────────────────────────────────────────────────────
 *
 * Legacy rows come from `seed-fingerprints.legacy.yaml`, an immutable snapshot of the hand-authored
 * ledger — NOT from the output file. The first version read legacy rows out of the very file it
 * overwrites, so a work that was derived on one run and demoted on the next would have had its legacy
 * row already deleted, with nothing to fall back to.
 *
 * ── WHAT IS DELIBERATELY DROPPED ─────────────────────────────────────────────────────────────────
 *
 * `the_second_key` — author "original", licence CC-BY. It is not a real novel, and across 32 archived
 * novelty audits it was the THIRD most-cited nearest neighbour, ahead of every Doyle. A synthetic
 * placeholder shaping the divergence judgement of real work is not a corpus entry.
 */
import { readFileSync, writeFileSync, readdirSync, existsSync, statSync } from "node:fs";
import yaml from "js-yaml";

const ROOT = "C:/CML";
const WORKS = `${ROOT}/library/works`;
const LEDGER = `${ROOT}/packages/novelty/data/seed-fingerprints.yaml`;
const LEGACY_BASELINE = `${ROOT}/packages/novelty/data/seed-fingerprints.legacy.yaml`;
/**
 * A_79 §11.3 — the verdict, written where every consumer can read it.
 *
 * The fingerprint ledger is not the only thing that reads `library/works/`: the device library (A1)
 * and Agent 3's exemplar loader (B) read it directly, and neither can see this gate. Rather than have
 * three copies of the rule drift apart — the exact failure A_77 §4.3 measured — the verdict is
 * computed once, here, and published as one manifest both loaders consult.
 *
 * The loaders exclude only `failed`. That is the defensible line: drop what we have positive evidence
 * AGAINST, keep what merely lacks evidence, and never let "we did not look" read as "it is bad".
 */
const MANIFEST = `${WORKS}/.verification.json`;
const CHECK = process.argv.includes("--check");

const RETIRED = new Set(["the_second_key"]);

/** Minimum share of a work's own anchors that must be found in its own source text. */
const MIN_COVERAGE = 0.6;

/**
 * Claims that carry the SOLUTION. A work can score well overall and still have invented its ending,
 * which is the only part the fingerprint's `mechanism_family` and `false_assumption_pattern` describe.
 */
const SOLUTION_CLAIM = /mechanism|method|culprit|murderer|solution|confession/i;

/** `verified` | `unverified` (no evidence on disk) | `failed` (evidence says the encode is unsound). */
const verifyWork = (slug) => {
  const path = `${WORKS}/${slug}/encode-report.json`;
  if (!existsSync(path)) return { state: "unverified", detail: "no encode-report.json on disk" };

  /**
   * A_79 §11.4 — the report must describe the case on disk.
   *
   * `corpus-encode.mjs` writes `case.cml2.yaml` only when the case validates, but older versions
   * wrote the report either way. A failed re-encode therefore left a report describing a DISCARDED
   * case while the accepted, older case sat beside it. Judging one file by another file's anchors is
   * not a weaker check, it is a different check, and it would have promoted `the_leavenworth_case`
   * on the strength of a case that no longer exists.
   *
   * This fails CLOSED. A work whose only evidence describes a rejected attempt is `failed`, not
   * `unverified`: we are not missing evidence, we are holding evidence that provably does not apply,
   * and a corpus that feeds a paid generator should not be given the benefit of that doubt.
   */
  const casePath = `${WORKS}/${slug}/case.cml2.yaml`;
  const rawPath = `${WORKS}/${slug}/encode-raw.json`;
  if (existsSync(casePath)) {
    let report;
    try { report = JSON.parse(readFileSync(path, "utf8")); } catch { report = {}; }
    // The comparison is RAW vs CASE, not report vs case: `corpus-verify.mjs --write` legitimately
    // rewrites reports, so a report's own timestamp says nothing. The model output is the fixed
    // point — if it postdates the case, the case was not built from it.
    const staleCase =
      existsSync(rawPath) && statSync(rawPath).mtimeMs > statSync(casePath).mtimeMs + 1000;
    if (report.case_written === false || staleCase) {
      return { state: "failed", detail: "evidence on disk describes a REJECTED re-encode, not the case beside it" };
    }
  }
  let report;
  try {
    report = JSON.parse(readFileSync(path, "utf8"));
  } catch {
    return { state: "unverified", detail: "encode-report.json unreadable" };
  }
  const spans = Array.isArray(report.spans) ? report.spans : [];
  if (spans.length === 0) return { state: "unverified", detail: "report records no spans" };

  const ok = spans.filter((s) => s.ok).length;
  const coverage = ok / spans.length;
  const solution = spans.filter((s) => SOLUTION_CLAIM.test(String(s.claim ?? "")));
  const solutionOk = solution.filter((s) => s.ok).length;
  const pct = `${ok}/${spans.length} (${Math.round(coverage * 100)}%)`;

  if (coverage < MIN_COVERAGE) {
    return { state: "failed", detail: `anchor coverage ${pct} below ${MIN_COVERAGE * 100}%` };
  }
  if (solution.length > 0 && solutionOk === 0) {
    return { state: "failed", detail: `no solution-bearing claim verified (0/${solution.length}), coverage ${pct}` };
  }
  /**
   * A_79 §11.4 — "0/0" is not a pass, it is an unmeasurable check, and it must not read like one.
   *
   * The solution check matches on each anchor's `claim` label. An encode whose anchors came back as
   * bare strings instead of {claim, anchor} objects has no labels at all, so the check silently
   * cannot fire — and it printed `solution claims 0/0` beside a PASS, on `the_big_bow_mystery`, which
   * is the one work whose solution was wrong. Coverage is still real evidence and the work still
   * passes on it; what changes is that the log stops implying a check ran when none did.
   */
  const labelled = spans.some((x) => String(x.claim ?? "").trim().length > 0);
  const solutionDetail = !labelled
    ? "solution coverage UNMEASURED (encode returned no claim labels)"
    : `solution claims ${solutionOk}/${solution.length}`;
  return { state: "verified", detail: `coverage ${pct}, ${solutionDetail}` };
};

const legacyRows = yaml.load(readFileSync(LEGACY_BASELINE, "utf8")) ?? [];
const legacyById = new Map(legacyRows.map((e) => [e.id, e]));

const derived = [];
const demoted = [];
const notes = [];

for (const slug of readdirSync(WORKS).sort()) {
  const fp = `${WORKS}/${slug}/fingerprint.yaml`;
  if (!existsSync(fp) || !existsSync(`${WORKS}/${slug}/case.cml2.yaml`)) continue;

  const entry = yaml.load(readFileSync(fp, "utf8"))[0];
  const { state, detail } = verifyWork(slug);

  if (state === "failed") {
    const fallback = legacyById.get(slug);
    demoted.push({ slug, detail, fellBackToLegacy: Boolean(fallback) });
    notes.push(`  ${slug}: DEMOTED — ${detail}${fallback ? "; legacy row kept" : "; NO legacy row, entry omitted"}`);
    continue; // legacy row (if any) is added below, from the baseline
  }

  entry.provenance = state === "verified" ? "derived" : "derived_unverified";
  derived.push(entry);
  notes.push(`  ${slug}: ${entry.provenance} — ${detail}`);
}

const derivedIds = new Set(derived.map((e) => e.id));
const legacy = legacyRows
  .filter((e) => !derivedIds.has(e.id) && !RETIRED.has(e.id))
  .map((e) => ({ ...e, provenance: "legacy_hand_authored" }));

const merged = [...derived, ...legacy];

const manifest = {
  generated_by: "scripts/corpus-sync-fingerprints.mjs",
  rule: `anchor coverage >= ${MIN_COVERAGE * 100}% and at least one solution-bearing claim verified`,
  states: {
    derived: "evidence on disk, and it passes",
    derived_unverified: "no anchor evidence on disk — kept, but not vouched for",
    failed: "evidence on disk says the encode is unsound — consumers must skip this work",
  },
  works: Object.fromEntries([
    ...derived.map((e) => [e.id, e.provenance]),
    ...demoted.map((d) => [d.slug, "failed"]),
  ]),
};

const verifiedCount = derived.filter((e) => e.provenance === "derived").length;
const unverifiedCount = derived.length - verifiedCount;

const header = `# GENERATED by \`node scripts/corpus-sync-fingerprints.mjs\` — do not edit by hand.
#
# A_79 A2. Rows are tagged with how far they can be trusted:
#
#   derived              re-encoded from the source text AND its anchors were found in that text
#                        (>= ${MIN_COVERAGE * 100}% coverage, at least one solution-bearing claim verified)
#   derived_unverified   re-encoded, but no anchor evidence is on disk to check it against
#   legacy_hand_authored never re-encoded, OR re-encoded and DEMOTED by the evidence gate
#
# The gate exists because promoting on \`validateCml\` alone shipped a Big Bow Mystery encode that
# invented its own solution — a fluent invention passes a schema check as easily as the truth — and
# that silently stopped a paraphrase of the real book being caught as a clone.
#
# \`the_second_key\` was retired: author "original", licence CC-BY, not a real novel — and the third
# most-cited nearest neighbour across 32 archived audits.
#
# derived: ${verifiedCount}   derived_unverified: ${unverifiedCount}   legacy: ${legacy.length}   total: ${merged.length}
`;

const body = header + yaml.dump(merged, { lineWidth: 100 });

if (CHECK) {
  const current = existsSync(LEDGER) ? readFileSync(LEDGER, "utf8") : "";
  const norm = (t) => t.split("\n").filter((l) => !l.startsWith("#")).join("\n").trim();
  if (norm(current) !== norm(body)) {
    console.error("seed-fingerprints.yaml is STALE — run: node scripts/corpus-sync-fingerprints.mjs");
    process.exit(1);
  }
  const currentManifest = existsSync(MANIFEST) ? readFileSync(MANIFEST, "utf8") : "";
  if (currentManifest.trim() !== JSON.stringify(manifest, null, 1).trim()) {
    console.error("library/works/.verification.json is STALE — run: node scripts/corpus-sync-fingerprints.mjs");
    process.exit(1);
  }
  console.log(`seed-fingerprints.yaml + .verification.json in sync (${verifiedCount} derived, ${unverifiedCount} unverified, ${legacy.length} legacy)`);
  process.exit(0);
}

writeFileSync(LEDGER, body, "utf8");
writeFileSync(MANIFEST, `${JSON.stringify(manifest, null, 1)}
`, "utf8");
console.log(`wrote ${merged.length} fingerprints + library/works/.verification.json`);
console.log(`  derived (evidence-backed): ${verifiedCount}`);
console.log(`  derived_unverified:        ${unverifiedCount}`);
console.log(`  legacy_hand_authored:      ${legacy.length}`);
console.log(`  retired:                   ${[...RETIRED].join(", ")}`);
console.log("\nper-work:");
for (const n of notes) console.log(n);
if (demoted.length > 0) {
  console.log(`\n${demoted.length} work(s) DEMOTED by the evidence gate — these need re-encoding:`);
  for (const d of demoted) console.log(`  ${d.slug}${d.fellBackToLegacy ? "" : "   (and has no legacy row to fall back to)"}`);
}
const axes = {};
for (const e of merged) axes[e.axis] = (axes[e.axis] ?? 0) + 1;
console.log("\naxis coverage:", axes);
