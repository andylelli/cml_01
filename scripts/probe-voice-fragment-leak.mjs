#!/usr/bin/env node
/**
 * X43 — DO AGENT 6.5's VOICE FRAGMENTS COME BACK VERBATIM? (architecture/REVIEW_10.md §4)
 *
 * Dialogue is the only rubric category that has never once exceeded 7 in five external reads, and
 * "generated catchphrases" is the only complaint that appears in all five. REVIEW_09 §1 called the
 * flat six a craft ceiling that no detector reaches. For dialogue that was wrong, and this is the
 * measurement that says so.
 *
 * WHERE THE LINES COME FROM. Agent 6.5 authors `characterVoiceSketches[].fragments`; the orchestrator
 * lifts three per character into the character bundle; Agent 9's per-chapter prompt prints the first
 * two of them. Before X43 it printed them under "match this register and rhythm" and nothing else —
 * the one voice input in that whole prompt with no anti-verbatim guard, while the `signatureTic` two
 * lines above carried one (and worked: one occurrence in an entire manuscript).
 *
 * WHY THIS INSTRUMENT AND NOT X30. `probe:dialogue-tics` hunts for near-duplicate lines INSIDE a
 * manuscript and has to guess which repeats are defects — REVIEW_09 §9.8 records its standing verdict,
 * that it cannot separate two stories a reader scored the same. This is a PROVENANCE check against
 * known source strings on disk. There is no guessing: either the fragment's words are in the book or
 * they are not.
 *
 * MEASURED, before the guard shipped:
 *
 *   external 86 · dialogue 7 ·  6/18 (33%)
 *   external 84 · dialogue 7 ·  5/18 (28%)
 *   external 78 · dialogue 6 ·  7/18 (39%)
 *   external 76 · dialogue 6 ·  9/18 (50%)
 *
 * Monotonic in the reader's direction with no overlap between the 7s and the 6s. n=4 and one reader,
 * so this is a LEAD, not a law — §6's rule ("a detector that has never met real prose is a
 * hypothesis") cuts both ways, and four points is not a corpus. What makes it worth acting on is that
 * the causal half is not inferential: the prompt told the model to match these lines, and here is the
 * model matching them.
 *
 * THIS SHIPS NOTHING AND GATES NOTHING. It measures, and the number it prints is what says whether
 * X43's guard worked on the next paid run.
 *
 * Usage: node scripts/probe-voice-fragment-leak.mjs [--verbose]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import { readManuscript, resolveStoryPath } from "./corpus-artifacts.mjs";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const VERBOSE = process.argv.includes("--verbose");

/**
 * The comparison basis: lowercase, strip everything that is not a letter, digit or space, collapse
 * runs of whitespace.
 *
 * Apostrophes go the same way both sides, which is deliberate and load-bearing. Agent 6.5 writes
 * curly quotes and the manuscript carries a mix, so "that's" and "that’s" must not read as different
 * words — the X30b defect, one layer down. Dropping the character entirely (rather than normalising
 * it) means "isn t" on both sides, which compares equal without a typography table.
 */
const norm = (s) =>
  String(s ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/**
 * The longest window of the fragment that appears verbatim in the manuscript, or null.
 *
 * FIVE WORDS IS THE FLOOR, and it is not arbitrary. Below it the check starts reporting ordinary
 * English: "I was in the" is a four-word span every mystery contains, and counting it would make
 * every fragment leak in every story — a detector that fires on the manuscripts readers liked is
 * noise (§10). Five content-bearing words in sequence is a quotation, not a coincidence.
 *
 * Twelve is the ceiling only because it is long enough to prove the point; a longer match is still
 * reported as twelve, and the distinction does not change the verdict.
 */
const LEAK_MIN_WORDS = 5;
const LEAK_MAX_WORDS = 12;

const longestVerbatimSpan = (fragment, manuscript) => {
  const words = norm(fragment).split(" ").filter(Boolean);
  for (let n = Math.min(words.length, LEAK_MAX_WORDS); n >= LEAK_MIN_WORDS; n -= 1) {
    for (let i = 0; i + n <= words.length; i += 1) {
      const span = words.slice(i, i + n).join(" ");
      if (manuscript.includes(span)) return span;
    }
  }
  return null;
};

/** Every fragment the run handed Agent 9, flattened out of the character bundle. */
const fragmentsOf = (bundlePath) => {
  const bundle = JSON.parse(readFileSync(bundlePath, "utf8"));
  const characters = Array.isArray(bundle) ? bundle : bundle.characters ?? [];
  return characters.flatMap((c) =>
    (c.voiceFragments ?? []).filter((f) => f?.text).map((f) => ({ character: c.name, text: f.text })),
  );
};

export const measureLeak = (bundlePath, storyPath) => {
  const fragments = fragmentsOf(bundlePath);
  const page = norm(
    readManuscript(storyPath)
      .chapters.flatMap((c) => c.paragraphs)
      .join(" "),
  );
  const leaks = fragments
    .map((f) => ({ ...f, span: longestVerbatimSpan(f.text, page) }))
    .filter((f) => f.span);
  return { total: fragments.length, leaks };
};

// ── the corpus sweep ─────────────────────────────────────────────────────────

/**
 * Every run that has BOTH a character bundle and an external cold read. That pairing is the whole
 * corpus — a bundle without a read cannot be scored against the reader, and a read without a bundle
 * has no source strings to check the page against.
 */
const KNOWN = [
  ["86  weighted_pendulum", 7, "1786052056540", "stories/story_20260806-2255"],
  ["84  frozen_hour      ", 7, "1786734784184", "stories/story_20260814-2033"],
  ["78  pendulum_secret  ", 6, "1786821276166", "stories/story_20260815-2027"],
  ["76  silent_deception ", 6, "1786106661131", "stories/story_20260807-1412"],
];

console.log(
  `\n${"═".repeat(78)}\nX43 — VOICE FRAGMENT LEAK (REVIEW_10 §4: dialogue has never scored above 7)\n${"═".repeat(78)}\n`,
);
console.log(`  story                 external   dialogue   fragments   leaked   rate`);

let evaluated = 0;
for (const [label, dialogueMark, runId, storyDir] of KNOWN) {
  const bundle = join(ROOT, "apps/worker/logs", `character-bundle-mystery-${runId}.json`);
  const story = resolveStoryPath(join(ROOT, storyDir));
  // X42's rule: a row that silently reads "(not on disk)" is a measurement dropping to n-1, and it
  // must never look like a pass from a scroll of output.
  if (!existsSync(bundle)) {
    console.log(`  ${label}  (no character bundle for run ${runId})`);
    continue;
  }
  if (!existsSync(story)) {
    console.log(`  ${label}  (manuscript not on disk: ${storyDir})`);
    continue;
  }
  const { total, leaks } = measureLeak(bundle, story);
  evaluated += 1;
  const rate = total ? (leaks.length / total) * 100 : 0;
  console.log(
    `  ${label}  ${label.slice(0, 2).padStart(8)}   ${String(dialogueMark).padStart(8)}   ` +
      `${String(total).padStart(9)}   ${String(leaks.length).padStart(6)}   ${rate.toFixed(0).padStart(3)}%`,
  );
  if (VERBOSE) {
    for (const leak of leaks) {
      console.log(`        ${leak.character}: [${leak.span.split(" ").length} words] "${leak.span}"`);
    }
  }
}

console.log(
  `\n  ${evaluated} of ${KNOWN.length} rows evaluated.` +
    `\n  Baseline before X43's guard: 33% / 28% / 39% / 50%, in the order above.` +
    `\n  Run with --verbose to see the leaked spans.\n`,
);
