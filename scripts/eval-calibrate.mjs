#!/usr/bin/env node
/**
 * R7 — judge calibration. The half of the task an agent CAN do.
 *
 * WHAT R7 ACTUALLY ASKS. REVIEW_01 §2.3: published practice calibrates an LLM judge to 85–90%
 * agreement against human-annotated references before trusting it. Ours has never been calibrated,
 * and it under-scores the external read by a mean of 9.5 with a per-run spread of 13 points — wider
 * than the entire 6.75-point gap to the target. Every A/B verdict this project has drawn from an
 * internal delta rests on an instrument nobody has checked.
 *
 * WHAT ONLY A HUMAN CAN DO: supply the ground truth. That is why R7 is marked 👤 and stays so.
 * WHAT THIS DOES: everything either side of it — collect the pairs, compute the agreement, and state
 * a verdict the labeller does not have to derive by hand (the A_62 lesson: build the instrument, do
 * not hand-tally).
 *
 * THE METRIC THAT MATTERS, AND IT IS NOT THE OBVIOUS ONE.
 *
 *   ABSOLUTE agreement ("does the judge give the same mark?") is destroyed by a constant bias, and
 *   we have one. On its own it would condemn a judge that is perfectly usable.
 *
 *   DECISION agreement ("when the judge says A is better than B, is it?") is what every use of this
 *   judge actually depends on — the eval harness, the flag probes, the A/B matrix. A judge that runs
 *   9.5 low but ORDERS stories correctly makes internal deltas trustworthy. A judge that is unbiased
 *   on the total but scrambles the order does not, however good its mean looks.
 *
 * So this reports both, and leads with the second.
 *
 * Usage:
 *   npm run eval:calibrate                 read eval/results/external-read/manifest.json
 *   npm run eval:calibrate -- --manifest <path>
 *   npm run eval:calibrate -- --min-n 8    require more pairs before a verdict (default 6)
 *
 * Exit: 0 verdict reached (either direction) · 1 not enough labelled pairs to say anything
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};

const MANIFEST = flag("manifest", join(ROOT, "eval", "results", "external-read", "manifest.json"));
// `--out` exists so the test suite can exercise the real CLI without overwriting the project's
// calibration record. A test that has to be trusted not to clobber real evidence is a test nobody
// runs.
const OUT = flag("out", join(ROOT, "eval", "results", "calibration.json"));

/**
 * Minimum labelled pairs before any verdict is printed.
 *
 * NOT arbitrary: ranking agreement over n stories rests on n·(n−1)/2 pairs, and below 6 stories (15
 * pairs) a single mislabelled story swings the percentage by more than the 5-point band between
 * "calibrated" and "not". Reporting 100% agreement on n=3 would manufacture exactly the confidence
 * this whole exercise exists to withhold.
 */
const MIN_N = Number(flag("min-n", "6"));

/** The band published practice treats as a calibrated judge. */
const TARGET_AGREEMENT = 0.85;

/** Marks closer than this are a tie, not a preference — below it the judge is not claiming an order. */
const TIE_EPSILON = 1.0;

const CATEGORIES = [
  "premise",
  "opening_hook",
  "plot_structure",
  "character_clarity",
  "dialogue",
  "atmosphere",
  "clues",
  "pacing",
  "ending",
  "prose",
];

const num = (v) => (typeof v === "number" && Number.isFinite(v) ? v : null);
const mean = (xs) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);
const sd = (xs) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
};
const round = (v, dp = 2) => Number(v.toFixed(dp));

if (!existsSync(MANIFEST)) {
  console.error(
    `[calibrate] No manifest at ${MANIFEST}\n` +
      `[calibrate] Produce one with 'npm run eval:external', score the stories cold, then fill in\n` +
      `[calibrate] externalFinal (and externalCategories) for each entry.`,
  );
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(MANIFEST, "utf8"));
const rows = (Array.isArray(manifest) ? manifest : []).filter(
  (r) => num(r?.internalFinal) !== null && num(r?.externalFinal) !== null,
);
const unlabelled = (Array.isArray(manifest) ? manifest : []).length - rows.length;

console.log(`[calibrate] manifest: ${MANIFEST}`);
console.log(`[calibrate] labelled pairs: ${rows.length}${unlabelled ? ` (${unlabelled} still unlabelled)` : ""}`);

if (rows.length < MIN_N) {
  console.error(
    `\n[calibrate] NOT ENOUGH DATA — ${rows.length} labelled pair(s), need ${MIN_N}.\n` +
      `[calibrate] No verdict printed on purpose. A calibration figure from a handful of stories is\n` +
      `[calibrate] the kind of number this project has learned to distrust (canary-k2-single-run-confounded):\n` +
      `[calibrate] it would read as evidence and carry none.`,
  );
  process.exit(1);
}

// ── 1. Bias and spread ───────────────────────────────────────────────────────
const gaps = rows.map((r) => num(r.internalFinal) - num(r.externalFinal));
const bias = mean(gaps);
const spread = sd(gaps);

// ── 2. Decision agreement — the metric that governs whether A/B deltas mean anything ─────────────
let concordant = 0;
let discordant = 0;
let ties = 0;
for (let i = 0; i < rows.length; i++) {
  for (let j = i + 1; j < rows.length; j++) {
    const dInt = num(rows[i].internalFinal) - num(rows[j].internalFinal);
    const dExt = num(rows[i].externalFinal) - num(rows[j].externalFinal);
    // Either side can decline to order a pair, and NEITHER counts against the judge:
    //   - the HUMAN scored them level → the ground truth never answered the question;
    //   - the JUDGE scored them level → it made no ordering claim to be wrong about.
    // Counting an internal tie as discordant (the first version did) marks the judge wrong for
    // declining to guess, which would punish exactly the honest behaviour we want from it.
    if (Math.abs(dExt) < TIE_EPSILON || dInt === 0) {
      ties++;
      continue;
    }
    if (Math.sign(dInt) === Math.sign(dExt)) concordant++;
    else discordant++;
  }
}
const decidable = concordant + discordant;
const rankAgreement = decidable ? concordant / decidable : 0;

// ── 3. Per-category bias — where the disagreement actually lives ─────────────
const perCategory = {};
for (const cat of CATEGORIES) {
  const pairs = rows
    .map((r) => [num(r.internalCategories?.[cat]), num(r.externalCategories?.[cat])])
    .filter(([a, b]) => a !== null && b !== null);
  if (!pairs.length) continue;
  const diffs = pairs.map(([a, b]) => a - b);
  perCategory[cat] = { n: pairs.length, bias: round(mean(diffs)), spread: round(sd(diffs)) };
}

// ── 4. Verdict ───────────────────────────────────────────────────────────────
const calibrated = rankAgreement >= TARGET_AGREEMENT;
// A bias can be SUBTRACTED; a spread cannot. If the judge is consistently low, an offset recovers the
// external number. If it is erratically low, no offset does — which is the state the S0 batch showed
// (per-run −16/−3/−13/−6) and the reason "internal moved +2" has never been a safe claim.
const offsetUsable = spread <= 4;

console.log(`\n[calibrate] BIAS      internal − external = ${round(bias)}  (sd ${round(spread)}, n ${rows.length})`);
console.log(
  `[calibrate] RANKING   ${concordant}/${decidable} orderable pairs agree = ${round(rankAgreement * 100, 1)}%` +
    `${ties ? `  (${ties} pair(s) the human called too close to separate)` : ""}`,
);

if (Object.keys(perCategory).length) {
  console.log(`\n[calibrate] per-category bias (internal − external):`);
  for (const [cat, s] of Object.entries(perCategory).sort((a, b) => Math.abs(b[1].bias) - Math.abs(a[1].bias))) {
    console.log(`  ${cat.padEnd(18)} ${String(s.bias).padStart(6)}  (sd ${s.spread}, n ${s.n})`);
  }
  console.log(`  → the largest |bias| is where the judge and the reader disagree about what the`);
  console.log(`    category MEANS. That is a rubric-wording fix, not a model choice.`);
}

console.log(
  `\n[calibrate] VERDICT: ${calibrated ? "CALIBRATED" : "NOT CALIBRATED"} on ranking ` +
    `(${round(rankAgreement * 100, 1)}% vs ${TARGET_AGREEMENT * 100}% target)`,
);
if (calibrated) {
  console.log(
    `[calibrate] An internal delta may be read as a claim about direction. It is still NOT a claim\n` +
      `[calibrate] about the external SCORE — the bias of ${round(bias)} says the two scales differ.`,
  );
} else {
  console.log(
    `[calibrate] Internal deltas do not track the external read's ORDER. Until this passes, every\n` +
      `[calibrate] flag verdict drawn from an internal A/B is a hypothesis, and the eval harness\n` +
      `[calibrate] cannot substitute for a fresh-run external read.`,
  );
}
console.log(
  `[calibrate] OFFSET: ${offsetUsable ? `usable — subtract ${round(bias)} to estimate external` : `NOT usable — sd ${round(spread)} is too wide for a constant correction`}`,
);

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(
  OUT,
  JSON.stringify(
    {
      manifest: MANIFEST,
      n: rows.length,
      bias: round(bias),
      spread: round(spread),
      ranking: { concordant, discordant, ties, agreement: round(rankAgreement, 4) },
      perCategory,
      target: TARGET_AGREEMENT,
      calibrated,
      offsetUsable,
      // No timestamp: the file is an input to comparisons, and a field that changes on every run
      // makes a diff noisy for no information. The manifest it came from is the identity.
    },
    null,
    2,
  ),
  "utf8",
);
console.log(`\n[calibrate] written: ${OUT}`);
process.exit(0);
