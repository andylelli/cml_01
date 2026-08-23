#!/usr/bin/env node
/**
 * A_72 **A1** — the corpus the distinctiveness engine diverges FROM.
 *
 * ── WHY THIS IS THE PRECONDITION ─────────────────────────────────────────────────────────────────
 *
 * A_72 §2.1 measured the one engine in this pipeline that reliably earns 9s. It is Agent 3b, and its
 * working ingredient is not a subsystem — the audit half cannot fire — but a single instruction:
 *
 *     generate five candidates, DIVERGING FROM this explicit list, then commit the winner.
 *
 * `divergeFrom` is the whole trick, and for openings there has never been a list to put in it. There
 * could not have been: nothing enumerated previous manuscripts until the external-read ledger walked
 * them this week.
 *
 * ── WHAT IT EXTRACTS, AND WHY IT IS PROPS RATHER THAN SENTENCES ──────────────────────────────────
 *
 * All seventeen `opening_hook` 8s in 35 external reads are the same sentence shape — an inventory of
 * objects, followed by a compliment:
 *
 *     "Body, letter opener, clock, scratch on pendulum arm, wrong chime — strong setup."
 *     "Body at tide line, harbormaster time, pipe, blood, scrape marks — very good."
 *
 * **The reader is listing the props.** So the corpus records props, not prose. [X94](../architecture/REVIEW_05.md)
 * already established that the SHAPE of sentence one is not the lever: rotating the opening style per
 * story produced the first non-`character-action` opening in the project's history and the hook mark
 * did not move. What has never varied is what the opening is MADE OF.
 *
 * MEASURED over 198 archived manuscripts, share of books whose FIRST PARAGRAPH contains the word:
 *
 *     scent 71% · faint 67% · morning 66% · damp 58% · pressed 58% · hush 52% · sprawled 51%
 *
 * ── ON THE CAST, AND WHY THIS DOES NOT EXTRACT ONE ───────────────────────────────────────────────
 *
 * The same seven characters appear in 64-77% of all 198 manuscripts — Eleanor Voss and Beatrice Quill
 * in 154 books each. **That is not a generator defect: `scripts/canary-core-inputs.yaml` pins
 * `castNames`**, deliberately, so the gender lock and the pronoun regression tests stay reproducible.
 * A "diverge from previous casts" list would therefore be arguing with the harness rather than the
 * pipeline, so this script does not build one. The character half of the engine (A_72 A3) has to
 * attach a SIGNATURE to whatever names it is given, and diverge on signatures, not on names.
 *
 * Deterministic, no LLM, reads only files already on disk.
 *
 *   node scripts/build-opening-corpus.mjs            # print the corpus
 *   node scripts/build-opening-corpus.mjs --write    # write data/opening-corpus.json
 */

import { existsSync, readFileSync, readdirSync, writeFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const OUT = join(ROOT, "data", "opening-corpus.json");
const WRITE = process.argv.includes("--write");

/**
 * Words that carry no image. Deliberately a CLOSED list of function words only — every content word
 * survives, because the point is to see what the openings are made of, not to curate it.
 * (X95's lesson: a closed list is fine when it is closed over grammar, not over subject matter.)
 */
const FUNCTION_WORDS = new Set(
  ("the a an and or of in on at to for with from by as is was were be been being that this these those it its his her their they them she he him "
   + "not no but had have has having said says say into over under through then when where which while more most very just only than there here "
   + "would could should may might must can will shall did does do done been about after before down up out off again once each other some any all "
   + "own same so too both few own such nor own s t re ve ll d m").split(/\s+/),
);

/** The first prose paragraph of chapter 1 — what the reader's "opening" note is written about. */
function openingParagraph(markdown) {
  const chapters = markdown.split(/\n(?=#{1,3}\s*Chapter)/);
  const body = chapters.length > 1 ? chapters[1] : markdown;
  for (const block of body.split("\n")) {
    const line = block.trim();
    if (!line || line.startsWith("#") || line.startsWith("---") || line.startsWith("*")) continue;
    if (line.length < 60) continue;
    return line;
  }
  return "";
}

const firstSentence = (paragraph) => paragraph.split(/(?<=[.!?])\s/)[0] ?? "";

const contentWords = (text) =>
  [...new Set(
    (text.toLowerCase().match(/[a-z][a-z'-]{3,}/g) ?? []).filter((w) => !FUNCTION_WORDS.has(w)),
  )];

/**
 * Proper nouns must never reach the avoid-list.
 *
 * The first run of this script put `eleanor` (76%), `voss` (71%) and `finch` (36%) at the top, and a
 * prompt told to avoid those is a prompt telling the writer not to name its own detective. The cast is
 * PINNED by `canary-core-inputs.yaml`, so their frequency measures the harness, not the prose.
 *
 * Detected, not listed: a token that appears capitalised far more often than not across the whole
 * corpus. No name list to go stale, and it picks up place names (`Cliffhaven`, `Seabreeze`) for free.
 */
function properNounTokens(texts) {
  const upper = new Map();
  const lower = new Map();
  for (const t of texts) {
    for (const m of t.match(/\b[A-Za-z][a-z'-]{3,}\b/g) ?? []) {
      const key = m.toLowerCase();
      const bucket = /^[A-Z]/.test(m) ? upper : lower;
      bucket.set(key, (bucket.get(key) ?? 0) + 1);
    }
  }
  const proper = new Set();
  for (const [word, up] of upper) {
    if (up > (lower.get(word) ?? 0) * 2 && up >= 5) proper.add(word);
  }
  return proper;
}

// ── walk ─────────────────────────────────────────────────────────────────────

const manuscripts = [];
const openingParagraphs = [];
for (const root of [join(ROOT, "stories"), join(ROOT, "stories", "_archive")]) {
  if (!existsSync(root)) continue;
  for (const name of readdirSync(root)) {
    const dir = join(root, name);
    if (name === "_archive" || !statSync(dir).isDirectory()) continue;
    const md = readdirSync(dir).find((f) => f.endsWith(".md"));
    if (!md) continue;
    const text = readFileSync(join(dir, md), "utf8");
    const para = openingParagraph(text);
    if (!para) continue;
    openingParagraphs.push(para);
    manuscripts.push({
      story: relative(ROOT, join(dir, md)).replace(/\\/g, "/"),
      firstSentence: firstSentence(para).slice(0, 240),
      words: contentWords(para),
    });
  }
}

if (manuscripts.length === 0) {
  console.error("\n  no manuscripts found under stories/ — nothing to build\n");
  process.exit(1);
}

// ── aggregate: what every opening is made of ─────────────────────────────────

const freq = new Map();
for (const m of manuscripts) for (const w of m.words) freq.set(w, (freq.get(w) ?? 0) + 1);

const properNouns = properNounTokens(openingParagraphs);

const ranked = [...freq.entries()]
  .map(([word, books]) => ({ word, books, share: books / manuscripts.length }))
  .filter((e) => e.books >= 3 && !properNouns.has(e.word))
  .sort((a, b) => b.books - a.books || a.word.localeCompare(b.word));

/**
 * The list an ideation prompt actually uses. A word in a THIRD of all openings is this pipeline's
 * house style rather than this story's choice, and that is exactly what a new opening must avoid.
 */
const OVERUSED_SHARE = 1 / 3;
const overused = ranked.filter((e) => e.share >= OVERUSED_SHARE).map((e) => e.word);

const corpus = {
  generatedFrom: `${manuscripts.length} archived manuscripts`,
  excludedAsProperNouns: [...properNouns].sort(),
  overusedShareThreshold: OVERUSED_SHARE,
  /** Words to steer AWAY from — the house style, measured. */
  overusedOpeningWords: overused,
  /** A sample of real openings, so an ideation prompt can be shown the pattern rather than told it. */
  recentOpenings: manuscripts.slice(-12).map((m) => m.firstSentence),
  counts: ranked.slice(0, 60),
};

console.log(`\n  opening corpus — ${manuscripts.length} manuscripts\n`);
console.log(`  words in >= ${Math.round(OVERUSED_SHARE * 100)}% of all opening paragraphs (${overused.length}):\n`);
for (const e of ranked.filter((x) => x.share >= OVERUSED_SHARE).slice(0, 30)) {
  console.log(`    ${String(e.books).padStart(4)}/${manuscripts.length}  ${String(Math.round(e.share * 100)).padStart(3)}%  ${e.word}`);
}
if (overused.length > 30) console.log(`    … and ${overused.length - 30} more`);

/**
 * The corpus is emitted TWICE on purpose.
 *
 * The JSON is for humans and scripts. The TypeScript constant is what the prose prompt imports: a
 * package that reads a JSON file at runtime has to know where the repo root is, and path-resolution
 * from inside a built `dist` is a recurring bug in this codebase. A generated constant is versioned,
 * diffable in review, and cannot go missing.
 */
const TS_OUT = join(ROOT, "packages", "prompts-llm", "src", "constants", "opening-corpus.ts");

const tsHeader = [
  "/**",
  " * GENERATED by scripts/build-opening-corpus.mjs — do not edit by hand.",
  " *",
  " * A_72 A1: what this pipeline's openings are MADE OF, measured across the archive. All seventeen",
  " * `opening_hook` 8s in 35 external reads are an inventory of props followed by a compliment, so this",
  " * records props rather than prose. Proper nouns are excluded — the cast is pinned by the canary",
  " * inputs, and an avoid-list holding the detective's own name is an instruction not to name them.",
  " *",
  " * Regenerate:  node scripts/build-opening-corpus.mjs --write",
  " */",
  "",
  "/** Source corpus size, so the prompt can cite it honestly. */",
  `export const OPENING_CORPUS_MANUSCRIPTS = ${manuscripts.length};`,
  "",
  "/** Share of archived openings a word must reach before it is house style rather than choice. */",
  `export const OPENING_OVERUSE_THRESHOLD = ${OVERUSED_SHARE.toFixed(4)};`,
  "",
  "/** Words in at least that share of archived opening paragraphs, most-used first. */",
  `export const OVERUSED_OPENING_WORDS: readonly string[] = ${JSON.stringify(overused)};`,
  "",
  "/** The same list with its measured frequency, for telemetry and for review. */",
  "export const OVERUSED_OPENING_COUNTS: ReadonlyArray<{ word: string; books: number; share: number }> =",
  `  ${JSON.stringify(
    ranked
      .filter((e) => e.share >= OVERUSED_SHARE)
      .map((e) => ({ word: e.word, books: e.books, share: Number(e.share.toFixed(3)) })),
  )};`,
  "",
].join("\n");

if (WRITE) {
  writeFileSync(TS_OUT, tsHeader, "utf8");
  console.log(`\n  wrote ${relative(ROOT, TS_OUT)}`);
  writeFileSync(OUT, `${JSON.stringify(corpus, null, 2)}\n`, "utf8");
  console.log(`  wrote ${relative(ROOT, OUT)} — ${overused.length} overused words, ${corpus.recentOpenings.length} sample openings\n`);
} else {
  console.log(`\n  (nothing written — pass --write to update ${relative(ROOT, OUT)})\n`);
}
