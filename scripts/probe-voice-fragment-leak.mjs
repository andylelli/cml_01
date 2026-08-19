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

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
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

/**
 * X53 (REVIEW_11 §2) — THE COUNT WAS NEVER THE THING THE READER WAS MARKING.
 *
 * The guard shipped, the leak rate did not move (33% on the 08-17 run, identical to the 86), and the
 * "generated catchphrases" complaint — present in the five reads before it — vanished, with dialogue
 * posting its first 8 in 33 external reads. Both facts are true because this probe was counting spans
 * and the reader was noticing QUOTATIONS. Compare what leaked:
 *
 *   86 (dialogue 7, "catchphrases still awkward")   "one mustn t rush to judgment old sport"   8 words
 *   08-17 (dialogue 8, no complaint)                "i have nothing to hide"                   5 words
 *
 * Same count, and nobody would call the second a catchphrase. Two terms separate them, and both are
 * measured over the corpus rather than asserted:
 *
 * LENGTH. Span lengths per run, and the share at seven words or more:
 *
 *   08-17  dialogue 8   5,6,5,6,6,6                    →  0%
 *   86     dialogue 7   12,6,7,5,6,8                   → 17%
 *   84     dialogue 7   12,8,8,10,12                   → 28%
 *   78     dialogue 6   11,12,12,7,7,7,12              → 39%
 *   76     dialogue 6   12,7,12,8,12,8,11,6,9          → 44%
 *
 * Monotone in the reader's mark with no overlap between mark bands, and the one run whose reader did
 * not complain separates to ZERO. The old five-word floor stays — it is the right floor for a
 * provenance question ("are these words in the book?") — but five words is where a coincidence stops,
 * and seven is where a reader starts hearing a quotation.
 *
 * RARITY. How many OTHER corpus manuscripts contain the same span, over 184 books:
 *
 *   "i have nothing to hide"                       51 books  → ordinary English
 *   "well isn t that just delightful"               7 books
 *   "well that s the way the biscuit crumbles…"     1 book    → a manufactured signature
 *
 * Rarity is a DEMOTION signal only, and the measurement says why: it separates the very common spans
 * cleanly, then bottoms out at one book for both real signatures AND phrasings that are merely
 * uncommon. So it can prove a span is generic; it cannot prove one is distinctive. It is used in that
 * direction and no other.
 */
const QUOTATION_MIN_WORDS = 7;
const GENERIC_MIN_BOOKS = 5;

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

/**
 * Every manuscript in the corpus, normalised once, for the rarity term.
 *
 * A file counts as a manuscript only if it carries `## Chapter` headings. Story directories also hold
 * review notes and design documents in markdown, and folding those into the frequency table would
 * make prose spans look commoner than they are — the same class of error as counting the measured
 * book against itself, which the caller excludes by path.
 */
let CORPUS = null;
const corpus = () => {
  if (CORPUS) return CORPUS;
  CORPUS = [];
  for (const root of ["stories", "stories/_archive"]) {
    const dir = join(ROOT, root);
    if (!existsSync(dir)) continue;
    for (const entry of readdirSync(dir)) {
      const storyDir = join(dir, entry);
      let files;
      try {
        if (!statSync(storyDir).isDirectory()) continue;
        files = readdirSync(storyDir);
      } catch { continue; }
      for (const file of files) {
        if (!file.endsWith(".md")) continue;
        const full = join(storyDir, file);
        let raw;
        try { raw = readFileSync(full, "utf8"); } catch { continue; }
        if (!/^##\s+Chapter/m.test(raw)) continue;
        CORPUS.push({ path: full, text: norm(raw) });
      }
    }
  }
  return CORPUS;
};

/** How many OTHER manuscripts contain this exact span. See GENERIC_MIN_BOOKS for how it is used. */
const otherBooksContaining = (span, selfPath) =>
  corpus().filter((b) => b.path !== selfPath && b.text.includes(span)).length;

export const measureLeak = (bundlePath, storyPath) => {
  const fragments = fragmentsOf(bundlePath);
  const manuscript = readManuscript(storyPath);
  const page = norm(manuscript.chapters.flatMap((c) => c.paragraphs).join(" "));
  /**
   * The measured book's own FILE path, not the directory it was named by.
   *
   * FOUND ON REVIEW 2026-08-18: callers pass `stories/<story>`, `resolveStoryPath` hands a DIRECTORY
   * straight back when it exists, and `corpus()` holds `.md` FILE paths — so `b.path !== selfPath`
   * was never false and every book counted itself. `books` was inflated by exactly one for every
   * span (a leaked span is by definition in the book it leaked into), which shifts the verdict for
   * anything sitting on the `GENERIC_MIN_BOOKS` boundary. `readManuscript` already resolves the file
   * it read; use that.
   */
  const selfPath = manuscript.file;
  const leaks = fragments
    .map((f) => ({ ...f, span: longestVerbatimSpan(f.text, page) }))
    .filter((f) => f.span)
    .map((f) => {
      const words = f.span.split(" ").length;
      const books = otherBooksContaining(f.span, selfPath);
      return {
        ...f,
        words,
        books,
        // X53: quotation-length AND not a phrase the corpus uses everywhere. Rarity demotes only —
        // it can show a span is ordinary English, never that an ordinary one is a signature.
        conspicuous: words >= QUOTATION_MIN_WORDS && books < GENERIC_MIN_BOOKS,
      };
    });
  return { total: fragments.length, leaks, conspicuous: leaks.filter((l) => l.conspicuous) };
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

/**
 * `--run <runId> --story <path>` measures ONE fresh pair instead of the corpus.
 *
 * A new run has no external read yet, so it cannot join `KNOWN` — but its leak rate is readable the
 * moment it ships, and that is the number X43's guard is judged on. Without this the probe could only
 * ever report the baseline it was written from, which is the shape of instrument that measures the
 * past and calls it a result.
 */
const argOf = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i >= 0 ? process.argv[i + 1] : null;
};
const adhocRun = argOf("run");
const adhocStory = argOf("story");

const ROWS =
  adhocRun && adhocStory
    ? [[`--  ${adhocRun.slice(-6)}      `, null, adhocRun, adhocStory]]
    : KNOWN;

console.log(
  `\n${"═".repeat(78)}\nX43 — VOICE FRAGMENT LEAK (REVIEW_10 §4: dialogue has never scored above 7)\n${"═".repeat(78)}\n`,
);
console.log(
  `  story                 external   dialogue   fragments   leaked    rate   quoted   conspic`,
);

let evaluated = 0;
for (const [label, dialogueMark, runId, storyDir] of ROWS) {
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
  const { total, leaks, conspicuous } = measureLeak(bundle, story);
  evaluated += 1;
  const rate = total ? (leaks.length / total) * 100 : 0;
  const conspicRate = total ? (conspicuous.length / total) * 100 : 0;
  console.log(
    `  ${label}  ${(dialogueMark === null ? "unread" : label.slice(0, 2)).padStart(8)}   ` +
      `${String(dialogueMark ?? "-").padStart(8)}   ` +
      `${String(total).padStart(9)}   ${String(leaks.length).padStart(6)}   ${(rate.toFixed(0) + "%").padStart(5)}   ` +
      `${String(conspicuous.length).padStart(6)}   ${(conspicRate.toFixed(0) + "%").padStart(7)}`,
  );
  if (VERBOSE) {
    for (const leak of leaks) {
      // X53: say WHY each span is or is not conspicuous, so the verdict is auditable per
      // line rather than only in aggregate — the first version was a number with no reason.
      const why = leak.conspicuous
        ? "QUOTATION"
        : leak.words < QUOTATION_MIN_WORDS
          ? `short (${leak.words}w)`
          : `common (${leak.books} other books)`;
      console.log(
        `        ${(leak.character + ":").padEnd(20)} ${(leak.words + "w").padStart(3)}  ${String(leak.books).padStart(3)} other books  ${why.padEnd(22)}"${leak.span}"`,
      );
    }
  }
}

console.log(
  `\n  ${evaluated} of ${ROWS.length} rows evaluated.` +
    `\n` +
    `\n  rate    = any fragment span of ${LEAK_MIN_WORDS}+ words on the page (provenance: are these words in the book?)` +
    `\n  conspic = spans of ${QUOTATION_MIN_WORDS}+ words that fewer than ${GENERIC_MIN_BOOKS} other corpus books also use (X53).` +
    `\n` +
    `\n  Baselines:  rate     33% / 28% / 39% / 50%  and 33% on the 08-17 run - flat, while the reader` +
    `\n                       stopped complaining, which is what X53 exists to explain.` +
    `\n              conspic  17% / 28% / 39% / 44%  against dialogue 7, 7, 6, 6 - and 0% on the 08-17` +
    `\n                       run, the one read with dialogue 8 and no catchphrase complaint.` +
    `\n` +
    `\n  Read conspic, not rate. n=5 and one reader, so it is a LEAD, not a law.` +
    `\n  Run with --verbose to see the leaked spans, or` +
    `\n  --run <runId> --story <path> to read a single fresh run.\n`,
);
