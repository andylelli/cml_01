#!/usr/bin/env node
/**
 * A_75 §6.2 (P2) — the measurement that justifies the thresholds in
 * `packages/prose-guard/src/machine-register.ts`, kept as a SCRIPT rather than as a number in a
 * comment. Run it after touching any of the four feature lists:
 *
 *   node scripts/register-score-probe.mjs
 *
 * ── WHY THE FIRST VERSION OF THIS PROBE WAS THE WRONG EXPERIMENT ─────────────────────────────────
 *
 * It measured recall over six known machine sentences, five of which are verbatim INJECTOR OUTPUT.
 * Those five are already caught EXACTLY by `INJECTED_SENTENCE_PATTERNS` — they are strings we wrote,
 * and a string we wrote does not need a grammatical instrument to find it. Scoring recall against a
 * set the registry already covers measures the wrong thing and flatters or damns the score for no
 * reason. It produced "4/6 at threshold 4" on one feature definition and "1/6" on another, and
 * neither number meant anything.
 *
 * ── THE EXPERIMENT THAT ANSWERS THE QUESTION ─────────────────────────────────────────────────────
 *
 * The claim being tested is that the external reader is responding to a REGISTER. If that is true,
 * then across the 40 manuscripts a human has read and marked, the rate of register-scoring sentences
 * must fall as the `prose` mark rises. That is a discriminative test on real data with a human label,
 * it needs no fixture set, and it can FAIL — which is the property that makes it worth running.
 *
 * The panel of known sentences is still printed, split by class, because the register-only case is
 * the single sentence this module exists for and a change that stops catching it has broken the
 * instrument regardless of what the rates say.
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();


const modulePath = join(ROOT, "packages", "prose-guard", "dist", "machine-register.js");
if (!existsSync(modulePath)) {
  console.error(`\n  build @cml/prose-guard first — ${modulePath} is missing.\n`);
  process.exit(1);
}
const { scoreSentenceRegister, machineRegisterRate, scoreMachineRegister } = await import(pathToFileURL(modulePath).href);

/** Split by class, because the two classes are covered by different instruments. */
const INJECTOR = [
  ['culprit verdict', 'Hugo Vane was responsible; the evidence allowed no other reading.'],
  ['clue record', 'The record now held: Victim last seen alive minutes past.'],
  ['clue inference', 'Weighed against the rest, that detail left the standing account weaker.'],
  ['clearance', 'Marchbank was thoroughly cleared by the evidence; the alibi confirmed they could not have committed the crime.'],
  ['reasoning shift', 'Those details shifted the reasoning and the case moved on.'],
];
/**
 * THE CLASS THIS MODULE EXISTS FOR. The first is the ch10 sentence an external reader marked as
 * "major validation leakage" in `story_20260825-1838`, which matches no registered template because
 * we never wrote it — the model did, in our voice.
 */
const REGISTER_ONLY = [
  ['the ch10 case', 'The truth was out, but innocence, once lost, would not return.'],
  ['same register, reworded', 'The matter was settled, and the reasoning behind it would not be questioned again.'],
  ['same register, reworded', 'The account that had stood for so long was, in the end, no account at all.'],
];

// ── the corpus: every manuscript a human has read and marked for prose ────────

const manifestPath = join(ROOT, "eval", "results", "external-read", "manifest.json");
if (!existsSync(manifestPath)) {
  console.error("\n  no external-read manifest — there is nothing to measure against.\n");
  process.exit(1);
}
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

/**
 * The corpus is read through the SHIPPED function, not through a tokenizer this script keeps for
 * itself. The first version of this probe had its own `sentencesOf`, and when the module learned to
 * skip abbreviations and unstripped dialogue the probe went on reporting the old rates — a probe that
 * measures something other than what ships is worse than no probe.
 */
const books = manifest
  .filter((e) => e?.externalCategories?.prose != null && e?.storyPath && existsSync(join(ROOT, e.storyPath)))
  .map((e) => {
    // Markdown headings and the italic scene-break lines are not prose; strip them in place with
    // multiline anchors rather than splitting on a newline literal.
    const text = readFileSync(join(ROOT, e.storyPath), "utf8")
      .replace(/^\s*#.*$/gm, " ")
      .replace(/^\s*\*.*$/gm, " ");
    return {
      mark: e.externalCategories.prose,
      path: e.storyPath,
      text,
      at3: machineRegisterRate(text, 3),
      at4: machineRegisterRate(text, 4),
    };
  })
  .filter((b) => b.at3.sentences > 50);

// ── report ───────────────────────────────────────────────────────────────────

const pct = (n, d) => (d ? (100 * n) / d : 0);

console.log(`\n  A_75 P2 — register-score probe\n`);

console.log(`  the known panel — a change that drops a REGISTER-ONLY row has broken the instrument\n`);
console.log(`  score  class          case`);
console.log(`  ${"-".repeat(92)}`);
for (const [cls, rows] of [["injector", INJECTOR], ["REGISTER-ONLY", REGISTER_ONLY]]) {
  for (const [label, sentence] of rows) {
    const { score, features } = scoreSentenceRegister(sentence);
    const on = Object.entries(features).filter(([, v]) => v).map(([k]) => k[0]).join("");
    console.log(`  ${String(score).padStart(5)}  ${cls.padEnd(14)} ${label.padEnd(26)} [${on}]`);
  }
}
console.log(`\n  (injector sentences are already matched EXACTLY by INJECTED_SENTENCE_PATTERNS —`);
console.log(`   they are strings we wrote. This score exists for the class below them.)\n`);

console.log(`  ── the discriminative test: does the rate track the human mark? ──
`);
console.log(`  books read and marked for prose: ${books.length}
`);
console.log(`  prose  books  sentences   rate@3    rate@4`);
console.log(`  ${"-".repeat(52)}`);
const byMark = new Map();
for (const b of books) {
  const list = byMark.get(b.mark) ?? [];
  list.push(b);
  byMark.set(b.mark, list);
}
for (const mark of [...byMark.keys()].sort((a, b) => a - b)) {
  const g = byMark.get(mark);
  const sum = (f) => g.reduce((a, b) => a + f(b), 0);
  const sents = sum((b) => b.at3.sentences);
  console.log(
    `  ${String(mark).padStart(5)}  ${String(g.length).padStart(5)}  ${String(sents).padStart(9)}` +
    `  ${pct(sum((b) => b.at3.hits), sents).toFixed(1).padStart(6)}%` +
    `  ${pct(sum((b) => b.at4.hits), sents).toFixed(2).padStart(7)}%`,
  );
}

/** Spearman rank correlation between the human mark and the per-book rate. */
const spearman = (xs, ys) => {
  const rank = (v) => {
    const sorted = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const r = new Array(v.length);
    sorted.forEach(([, i], k) => { r[i] = k + 1; });
    return r;
  };
  const rx = rank(xs), ry = rank(ys), n = xs.length;
  const d2 = rx.reduce((acc, x, i) => acc + (x - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
};

const marks = books.map((b) => b.mark);
const rho3 = spearman(marks, books.map((b) => b.at3.rate));
const rho4 = spearman(marks, books.map((b) => b.at4.rate));
// Two-tailed 5% critical value for Spearman's rho, large-n normal approximation.
const crit = 1.96 / Math.sqrt(books.length - 1);
const verdict = (r) => (Math.abs(r) < crit ? "NOT SIGNIFICANT" : r < 0 ? "signal (p<0.05)" : "WRONG DIRECTION");
console.log(`
  per-book Spearman (prose mark vs register rate), n = ${books.length}, |rho| > ${crit.toFixed(3)} to signify:`);
console.log(`     threshold 3 : rho = ${rho3.toFixed(3)}   ${verdict(rho3)}`);
console.log(`     threshold 4 : rho = ${rho4.toFixed(3)}   ${verdict(rho4)}`);
console.log(`  (a NEGATIVE rho is the hypothesis: more register, lower mark.)
`);

// The check that keeps this honest — what the signal threshold flags in prose a reader LIKED.
const ceiling = Math.max(...books.map((b) => b.mark));
const good = books.filter((b) => b.mark === ceiling);
const flagged = good.flatMap((b) => scoreMachineRegister(b.text, 4).map((r) => r.sentence));
console.log(`  what threshold 4 flags in the ${good.length} book(s) a reader gave prose ${ceiling}/10` +
  ` — ${flagged.length} sentence(s). Read them before trusting the rate:`);
for (const s of flagged.slice(0, 10)) console.log(`    ${s.slice(0, 106)}`);
console.log("");
