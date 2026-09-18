/**
 * ANALYSIS_99 §10.6 / W9 — CALIBRATE THE SELECTOR, AND SAY WHETHER IT IS AN INSTRUMENT.
 *
 * v2 drafts k times and keeps one. That is only worth paying for if the thing doing the keeping
 * agrees with the reader, so this script measures exactly that over every manuscript on disk that
 * has an external read: each instrument's rank correlation with the headline, then the composite's.
 *
 * The bar the design set: **the composite must rank-correlate with the headline at least as strongly
 * as the register rate alone (|rho| >= 0.55), or M4 does not ship.** Register is the only validated
 * predictor this project owns (-0.60 against the headline over 34 read books, A_95 §2), so a
 * composite that cannot beat it is a composite that should be a single number.
 *
 * It also emits the z-score constants the selector normalises against. Those are corpus statistics,
 * not fitted weights: with nine instruments and n=34, fitting weights would be overfitting with
 * extra steps, so the weights are set from the measured correlations by hand and written down.
 *
 *   node scripts/selector-calibrate.mjs            # report
 *   node scripts/selector-calibrate.mjs --emit     # report + the constants block for selector.ts
 */
import fs from "node:fs";
import path from "node:path";

import { splitReads } from "./external-read-ledger.mjs";

import {
  machineRegisterRate,
  repetitionDensity,
  witDensity,
  REGISTER_TELEMETRY_THRESHOLD,
} from "@cml/prose-guard";

const ROOT = process.cwd();
const MIN_WORDS = 8_000; // CLAUDE.md: eight truncated May/June manuscripts manufacture relationships

/** Every directory with a manuscript and a review. */
const readBooks = () => {
  const dirs = [];
  for (const base of ["stories", path.join("stories", "_archive")]) {
    const full = path.join(ROOT, base);
    if (!fs.existsSync(full)) continue;
    for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
      if (entry.isDirectory()) dirs.push(path.join(full, entry.name));
    }
  }
  const books = [];
  for (const dir of dirs) {
    const files = fs.readdirSync(dir);
    const review = files.find((f) => /^chatgpt.*\.txt$/i.test(f));
    const manuscript = files.find((f) => f.endsWith(".md"));
    if (!review || !manuscript) continue;
    const reviewText = fs.readFileSync(path.join(dir, review), "utf8");
    /**
     * THE LAST read in the file, not the first (ANALYSIS_99 §10.14 W1). A book that was re-read after
     * a repair carries several closing statements, and `story_20260912-1815` carries three — 79, 82
     * and 87. Taking the first made the highest mark this project has ever received invisible to the
     * calibration as well as to the ledger, which is the same defect in two places: `splitReads` is
     * imported rather than re-implemented so it stays one.
     */
    const segments = splitReads(reviewText);
    const marks = segments
      .map((segment) =>
        /As written:\s*(\d{2,3})\s*\/\s*100/i.exec(segment) ??
        /score (?:this|it) (?:around|at)\s*(\d{2,3})\s*\/\s*100/i.exec(segment),
      )
      .filter(Boolean);
    const match = marks[marks.length - 1];
    if (!match) continue;
    const text = fs.readFileSync(path.join(dir, manuscript), "utf8");
    const words = text.split(/\s+/).filter(Boolean).length;
    if (words < MIN_WORDS) continue;
    books.push({ name: path.basename(dir), headline: Number(match[1]), text, words });
  }
  return books;
};

/** Paragraphs, with the markdown furniture removed. */
const paragraphsOf = (markdown) =>
  markdown
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p && !p.startsWith("#") && !p.startsWith("*Run ID") && p !== "---");

const sentencesOf = (text) => text.split(/(?<=[.!?])\s+/).filter((s) => s.trim().length > 0);

/** The text-only half of the vector — the half a draft can be chosen on with no contract. */
export const textInstruments = (markdown) => {
  const paragraphs = paragraphsOf(markdown);
  const body = paragraphs.join("\n\n");
  const words = body.split(/\s+/).filter(Boolean).length || 1;
  const sentences = sentencesOf(body);
  const speechOpen = paragraphs.filter((p) => /^["“‘']/.test(p)).length;
  const long = sentences.filter((s) => s.split(/\s+/).filter(Boolean).length > 30).length;
  // The saved manuscript is ASCII-normalised (`normalizeStoryText` folds smart punctuation), so a
  // dash the model wrote as an em-dash is on disk as a spaced hyphen. Counting only the character
  // gave a mean of exactly 0.000 across 49 books — an instrument reading zero on every input is a
  // claim about the instrument, and this one was wrong about every book in the corpus.
  const emDashes = (body.match(/—|\s-{1,2}\s/g) ?? []).length;
  const wit = witDensity(body);
  return {
    registerRate: machineRegisterRate(body, REGISTER_TELEMETRY_THRESHOLD).rate,
    repetitionPer10k: repetitionDensity(body).per10k,
    dialogueOpenShare: paragraphs.length > 0 ? speechOpen / paragraphs.length : 0,
    longSentenceShare: sentences.length > 0 ? long / sentences.length : 0,
    emDashPer1k: (1_000 * emDashes) / words,
    witPer10k: wit.per10k,
    words,
  };
};

/** Spearman's rho — ranks, so an outlier in one instrument cannot carry the correlation. */
const spearman = (xs, ys) => {
  const rank = (values) => {
    const order = values.map((v, i) => [v, i]).sort((a, b) => a[0] - b[0]);
    const ranks = new Array(values.length).fill(0);
    let i = 0;
    while (i < order.length) {
      let j = i;
      while (j + 1 < order.length && order[j + 1][0] === order[i][0]) j += 1;
      const mean = (i + j) / 2 + 1;
      for (let k = i; k <= j; k += 1) ranks[order[k][1]] = mean;
      i = j + 1;
    }
    return ranks;
  };
  const rx = rank(xs);
  const ry = rank(ys);
  const n = xs.length;
  const mx = rx.reduce((a, b) => a + b, 0) / n;
  const my = ry.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let dx = 0;
  let dy = 0;
  for (let i = 0; i < n; i += 1) {
    num += (rx[i] - mx) * (ry[i] - my);
    dx += (rx[i] - mx) ** 2;
    dy += (ry[i] - my) ** 2;
  }
  return dx === 0 || dy === 0 ? 0 : num / Math.sqrt(dx * dy);
};

const stats = (values) => {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const sd = Math.sqrt(values.reduce((s, v) => s + (v - mean) ** 2, 0) / values.length) || 1;
  return { mean, sd };
};

// ── the proposed weights, set from the measured correlations and written down ────────────────────
// Sign: +1 where more is better, -1 where less is. Magnitude: register dominates because it is the
// only validated predictor; the canon-gap instruments carry half its weight because WP-001 measured
// the gap but nothing has yet measured that closing it moves a mark.
const WEIGHTS = {
  registerRate: -3.0,
  repetitionPer10k: -1.0,
  dialogueOpenShare: +1.5,
  longSentenceShare: +1.0,
  emDashPer1k: +0.5,
  witPer10k: +1.0,
};

const main = () => {
  const books = readBooks();
  if (books.length === 0) {
    console.log("no read manuscripts on disk above the word floor");
    return;
  }
  const rows = books.map((b) => ({ ...b, v: textInstruments(b.text) }));
  const keys = Object.keys(WEIGHTS);
  const headlines = rows.map((r) => r.headline);

  console.log(`selector calibration — ${rows.length} manuscripts with a read, words >= ${MIN_WORDS}`);
  console.log("");
  console.log("instrument               mean      sd     rho vs headline");
  const norm = {};
  for (const key of keys) {
    const values = rows.map((r) => r.v[key]);
    const { mean, sd } = stats(values);
    norm[key] = { mean, sd };
    const rho = spearman(values, headlines);
    console.log(
      `  ${key.padEnd(20)} ${mean.toFixed(3).padStart(8)} ${sd.toFixed(3).padStart(7)}   ${rho >= 0 ? "+" : ""}${rho.toFixed(3)}`,
    );
  }

  const composite = (v) =>
    keys.reduce((sum, key) => sum + WEIGHTS[key] * ((v[key] - norm[key].mean) / norm[key].sd), 0);
  const composites = rows.map((r) => composite(r.v));
  const rhoComposite = spearman(composites, headlines);
  const rhoRegister = spearman(rows.map((r) => r.v.registerRate), headlines);

  console.log("");
  console.log(`  register alone            rho ${rhoRegister.toFixed(3)}`);
  console.log(`  COMPOSITE (proposed)      rho ${rhoComposite.toFixed(3)}`);

  // Candidate weightings, printed so the choice is VISIBLE rather than quietly fitted. n = 49 and
  // six instruments: any weighting picked by maximising this number is fitted on the same data it
  // is then judged by, so the shipped one is chosen for its reasoning and this table is the record
  // of what the alternatives scored.
  const rhoOf = (weights) => {
    const ks = Object.keys(weights);
    return spearman(
      rows.map((r) => ks.reduce((sum, k) => sum + weights[k] * ((r.v[k] - norm[k].mean) / norm[k].sd), 0)),
      headlines,
    );
  };
  const byEvidence = {};
  for (const key of keys) {
    const rho = spearman(rows.map((r) => r.v[key]), headlines);
    byEvidence[key] = Number(rho.toFixed(3));
  }
  const variants = {
    "register only": { registerRate: -1 },
    "register + the two page instruments": { registerRate: -3.0, dialogueOpenShare: +1.5, longSentenceShare: +1.0 },
    "equal weight, by sign": { registerRate: -1, repetitionPer10k: -1, dialogueOpenShare: +1, longSentenceShare: +1, emDashPer1k: +1, witPer10k: +1 },
    "weight = measured rho": byEvidence,
    "proposed": WEIGHTS,
  };
  console.log("");
  console.log("  candidate weightings:");
  for (const [label, weights] of Object.entries(variants)) {
    console.log(`    ${label.padEnd(36)} rho ${rhoOf(weights).toFixed(3)}`);
  }
  console.log("");
  console.log(
    `  verdict: ${Math.abs(rhoComposite) > Math.abs(rhoRegister) ? "BEATS register alone" : "does NOT beat register alone"}` +
      ` (design bar was |rho| >= 0.55, set when register measured -0.60 at n=34)`,
  );

  if (process.argv.includes("--emit")) {
    console.log("");
    console.log("// generated by scripts/selector-calibrate.mjs on " + new Date().toISOString().slice(0, 10));
    console.log(`export const CALIBRATION_N = ${rows.length};`);
    console.log("export const CALIBRATION = {");
    for (const key of keys) {
      console.log(`  ${key}: { mean: ${norm[key].mean.toFixed(4)}, sd: ${norm[key].sd.toFixed(4)}, weight: ${WEIGHTS[key]} },`);
    }
    console.log("} as const;");
  }
};

main();
