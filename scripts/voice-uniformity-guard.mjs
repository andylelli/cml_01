#!/usr/bin/env node
/**
 * A_75 §6.5 — the standing guard for §3, the finding this whole board rests on.
 *
 * ── WHAT §3 FOUND, AND WHY IT NEEDS A GUARD RATHER THAN A NOTE ───────────────────────────────────
 *
 * Across the manuscripts this pipeline has produced, NO texture statistic distinguishes a book a
 * reader gave `prose` 8 from one they gave 6 — not mean sentence length, not variance, not the share
 * of short sentences, not dialogue density. Stated as one number:
 *
 *     BETWEEN-book standard deviation of mean sentence length is ~10% of the WITHIN-book deviation.
 *
 * Every book is drawn from effectively one distribution of sentences. That is why there is no 9
 * available in this category: a reader awards a 9 when a sentence does something, and there is
 * nothing here for them to notice.
 *
 * **It took 41 external reads to see it, and nobody would notice it coming back.** A property that
 * expensive to discover has to be asserted, not remembered — property C of §6.0.
 *
 *   node scripts/voice-uniformity-guard.mjs              # report
 *   node scripts/voice-uniformity-guard.mjs --check      # non-zero exit if the corpus is uniform
 *   node scripts/voice-uniformity-guard.mjs --last 25    # widen the window (default: 15)
 *   node scripts/voice-uniformity-guard.mjs --all        # every manuscript — measures OUR drift, not voice
 *
 * ── HOW TO READ THE VERDICT ──────────────────────────────────────────────────────────────────────
 *
 * `--check` FAILS while the corpus is uniform, which means it fails TODAY and is meant to. It is not
 * a regression guard on a property we hold; it is a standing statement of a property we do not hold
 * yet, and the day P1's VoiceSpec ships this is the script that says whether it worked. Wire it into
 * the ledger run so the number is printed next to the reads that motivated it.
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const CHECK = process.argv.includes("--check");
const lastIdx = process.argv.indexOf("--last");
/**
 * DEFAULT WINDOW = 15, and the default is the finding.
 *
 * Run over all 188 manuscripts on disk the ratio is 27.1% — comfortably above the floor. Run over the
 * most recent 15 it is 12.6%. Both numbers are correct and they measure different things: the all-time
 * figure spans a year of prompt and pipeline changes, so what it detects is OUR EDITS drifting the
 * voice over months, not any book choosing one. The recent window is the only one that answers "do the
 * books this pipeline writes today sound different from each other", which is the question §3 asked.
 *
 * A guard defaulting to the all-time number would have reported DISTINCT and been useless.
 */
const LAST = lastIdx >= 0 ? Number(process.argv[lastIdx + 1]) : 15;
const ALL = process.argv.includes("--all");

/**
 * The threshold, and it is deliberately unambitious. A corpus of books with genuinely distinct voices
 * would show between-book variation that is a real fraction of within-book variation. 10% is the
 * measured status quo; 25% is the first number that could not be produced by fifteen drafts of the
 * same voice. It is a line in the sand, and moving it requires re-deriving it here rather than
 * quietly editing a constant somewhere else.
 */
const UNIFORMITY_FLOOR = 0.25;

// ── the corpus ───────────────────────────────────────────────────────────────

const storiesDir = join(ROOT, "stories");
const manuscripts = [];

const collectFrom = (dir) => {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name === "_archive") { collectFrom(full); continue; }
    const md = readdirSync(full).filter((f) => f.endsWith(".md") && !/readme|review|notes|debrief/i.test(f));
    // The manuscript is the largest markdown file in the folder; the others are reviews and notes.
    if (md.length === 0) continue;
    const best = md
      .map((f) => ({ f, size: statSync(join(full, f)).size }))
      .sort((a, b) => b.size - a.size)[0];
    if (best.size < 8000) continue;
    manuscripts.push({ story: name, path: join(full, best.f) });
  }
};
collectFrom(storiesDir);

manuscripts.sort((a, b) => a.story.localeCompare(b.story));
const window = ALL || LAST <= 0 ? manuscripts : manuscripts.slice(-LAST);

if (window.length < 3) {
  console.error(`\n  only ${window.length} manuscript(s) found under ${relative(ROOT, storiesDir)} — nothing to compare.\n`);
  process.exit(CHECK ? 1 : 0);
}

// ── the statistic ────────────────────────────────────────────────────────────

const sentenceLengths = (text) =>
  text
    .replace(/^\s*#.*$/gm, " ")
    .replace(/^\s*\*.*$/gm, " ")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim().split(/\s+/).filter(Boolean).length)
    .filter((n) => n >= 3 && n <= 120);

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / (xs.length || 1);
const sd = (xs) => {
  if (xs.length < 2) return 0;
  const m = mean(xs);
  return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / (xs.length - 1));
};

const books = window
  .map((m) => {
    const lengths = sentenceLengths(readFileSync(m.path, "utf8"));
    return { ...m, n: lengths.length, mean: mean(lengths), sd: sd(lengths) };
  })
  .filter((b) => b.n >= 100);

const between = sd(books.map((b) => b.mean));
const within = mean(books.map((b) => b.sd));
const ratio = within > 0 ? between / within : 0;

// ── report ───────────────────────────────────────────────────────────────────

console.log(`\n  A_75 §6.5 — voice-uniformity guard\n`);
console.log(`  manuscripts compared : ${books.length}${ALL ? "  (ALL — spans a year of pipeline changes; see the header)" : `  (last ${LAST} of ${manuscripts.length})`}`);
console.log(`  sentences measured   : ${books.reduce((a, b) => a + b.n, 0)}\n`);

const spread = [...books].sort((a, b) => a.mean - b.mean);
console.log(`  shortest-voiced and longest-voiced books in the window:`);
for (const b of [spread[0], spread[spread.length - 1]]) {
  console.log(`    ${b.mean.toFixed(2).padStart(6)} words/sentence (sd ${b.sd.toFixed(2)})  ${b.story}`);
}

console.log(`\n  mean sentence length across books : ${mean(books.map((b) => b.mean)).toFixed(2)} words`);
console.log(`  BETWEEN-book standard deviation   : ${between.toFixed(2)} words`);
console.log(`  WITHIN-book standard deviation    : ${within.toFixed(2)} words`);
console.log(`  ratio (between / within)          : ${(100 * ratio).toFixed(1)}%   floor ${(100 * UNIFORMITY_FLOOR).toFixed(0)}%\n`);

if (ratio < UNIFORMITY_FLOOR) {
  console.log(`  UNIFORM. Every book in this window is drawn from effectively one distribution of`);
  console.log(`  sentences, which is A_75 §3 — the reason no reader has praised a sentence and the`);
  console.log(`  reason \`prose\` has no rung above 8. This is expected until P1's VoiceSpec ships.\n`);
} else {
  console.log(`  DISTINCT. Between-book variation has cleared the floor — the books no longer sound`);
  console.log(`  like one another. If P1 shipped recently, this is its delivery being measured; the`);
  console.log(`  MARK still has to be read by a human before anything is claimed about quality.\n`);
}

if (CHECK && ratio < UNIFORMITY_FLOOR) {
  console.error(`  FAIL (--check): between/within is ${(100 * ratio).toFixed(1)}%, below the ${(100 * UNIFORMITY_FLOOR).toFixed(0)}% floor.\n`);
  process.exit(1);
}
