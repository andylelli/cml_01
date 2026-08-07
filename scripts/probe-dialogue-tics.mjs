#!/usr/bin/env node
/**
 * X30 — measure the dialogue defect all three external readers named (REVIEW_08 §2).
 *
 * DIALOGUE HAS NEVER SCORED ABOVE 7 in any external read, and it is the only category two marks short
 * of a 9. All three reviews name the same cause in their own words — *"some lines are repetitive"*,
 * *"catchphrases… sound like template residue"*, *"several lines are malformed/generated"* — quoting:
 *
 *   "Goodness these tangled puzzles we all must navigate rough seas, eh"
 *   "Good grief this tangled web we each must navigate rough seas, eh"
 *   "That's how it's tradition governs nothing worth reimagining the wheel, is there"   (twice)
 *
 * THE SIGNATURE IS NOT NONSENSE, IT IS DUPLICATION. Those first two are the same skeleton with the
 * fillers swapped; the third is an exact repeat. So the detector does not need to understand the
 * catchphrase templates or judge grammar — it needs to notice that a character says nearly the same
 * sentence twice. That is cheap, general, and it is what a reader actually perceives.
 *
 * NOTHING IN THE PIPELINE MEASURES THIS TODAY: not the linter, not the validators, not geometry.
 *
 * §6's rule applies — a detector is a hypothesis until it has met real prose — so this MEASURES over
 * the corpus and ships nothing. Wire it into the lint only if the signal separates the stories the
 * readers separated.
 *
 * Usage: node scripts/probe-dialogue-tics.mjs [--verbose]
 */

import { readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

import { readManuscript } from "./corpus-artifacts.mjs";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const VERBOSE = process.argv.includes("--verbose");

/** Quoted speech only — a narrator repeating a phrase is a different (and milder) defect. */
const dialogueLines = (text) => {
  const out = [];
  for (const m of text.matchAll(/["“]([^"”]{12,240})["”]/g)) out.push(m[1].trim());
  return out;
};

/** Content skeleton: lowercase, strip punctuation and the words that vary between fillers. */
const skeleton = (line) =>
  line
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 3)
    .join(" ");

const trigrams = (s) => {
  const w = s.split(" ").filter(Boolean);
  const out = new Set();
  for (let i = 0; i + 2 < w.length; i += 1) out.add(`${w[i]} ${w[i + 1]} ${w[i + 2]}`);
  return out;
};

const overlap = (a, b) => {
  if (a.size === 0 || b.size === 0) return 0;
  let hit = 0;
  for (const t of a) if (b.has(t)) hit += 1;
  return hit / Math.min(a.size, b.size);
};

/**
 * Two lines are a TIC PAIR when their content skeletons share most of their trigrams without being
 * identical strings. Identical strings are counted separately — an exact repeat is the same defect,
 * more obviously.
 */
/**
 * REFINEMENT, after the first measurement said the naive version does not work.
 *
 * Raw near-duplicate detection flagged the BEST-scoring story as heavily as the worst, because it
 * cannot tell two different things apart:
 *
 *   LEGITIMATE  a suspect restating their alibi — "I was in the dining hall from half past eight
 *               until just before nine" — which a mystery positively requires;
 *   THE DEFECT  a character recycling a content-free catchphrase — "We must consider the
 *               implications, don't you agree?" — which is what all three readers complained about.
 *
 * The discriminator is CASE CONTENT. An alibi carries a time, a place or a name; a tic carries none.
 * So a repeated line only counts when it is empty of the case: no digits, no clock words, no proper
 * nouns. That is what makes it filler rather than testimony.
 */
const CASE_CONTENT = /\b(?:\d|o'clock|quarter|half past|[A-Z][a-z]{3,})\b/;
const isContentFree = (line) => !CASE_CONTENT.test(line.replace(/^[^a-zA-Z]*[A-Z]/, (m) => m.toLowerCase()));

export const findDialogueTics = (chapters) => {
  const lines = [];
  chapters.forEach((c, ci) => {
    for (const l of dialogueLines((c.paragraphs ?? []).join(" "))) {
      const sk = skeleton(l);
      if (sk.split(" ").length >= 4) lines.push({ chapter: c.chapterNumber ?? ci + 1, line: l, sk, tri: trigrams(sk) });
    }
  });

  const exact = [];
  const near = [];
  const seen = new Map();
  for (const l of lines) {
    if (seen.has(l.sk) && isContentFree(l.line)) exact.push([seen.get(l.sk), l]);
    else if (seen.has(l.sk)) { /* a restated alibi is testimony, not a tic */ }
    else seen.set(l.sk, l);
  }
  for (let i = 0; i < lines.length; i += 1) {
    for (let j = i + 1; j < lines.length; j += 1) {
      if (lines[i].sk === lines[j].sk) continue;
      const o = overlap(lines[i].tri, lines[j].tri);
      if (o >= 0.6 && isContentFree(lines[i].line) && isContentFree(lines[j].line)) {
        near.push([lines[i], lines[j], o]);
      }
    }
  }
  return { total: lines.length, exact, near };
};

// ── the corpus sweep ─────────────────────────────────────────────────────────

const KNOWN = [
  ["84  secret_chime    ", "stories/story_20260806-2230/the_pendulum_s_secret_chime.md"],
  ["86  weighted_pendulum", "stories/story_20260806-2255/the_weighted_pendulum_deception.md"],
  ["76  silent_deception", "stories/story_20260807-1412/the_clock_s_silent_deception.md"],
  ["80  clockwork_deceit", "stories/story_20260802-1810/the_clockwork_deceit.md"],
  ["68  clocks_deception", "stories/story_20260802-1936/the_clock_s_deception.md"],
];

console.log(`\n${"═".repeat(78)}\nX30 — DIALOGUE TICS (REVIEW_08 §2: dialogue has never scored above 7)\n${"═".repeat(78)}\n`);
console.log(`  story                 lines   exact   near   per-100-lines   external`);
for (const [label, rel] of KNOWN) {
  const abs = join(ROOT, rel);
  if (!existsSync(abs)) { console.log(`  ${label}  (not on disk)`); continue; }
  const { total, exact, near } = findDialogueTics(readManuscript(abs).chapters);
  const rate = total ? ((exact.length + near.length) / total) * 100 : 0;
  console.log(
    `  ${label}  ${String(total).padStart(5)}   ${String(exact.length).padStart(5)}  ${String(near.length).padStart(5)}` +
      `   ${rate.toFixed(1).padStart(12)}   ${label.slice(0, 2)}`,
  );
  if (VERBOSE) {
    for (const [a, b] of exact.slice(0, 3)) console.log(`        EXACT ch${a.chapter}/ch${b.chapter}: "${a.line.slice(0, 90)}"`);
    for (const [a, b, o] of near.slice(0, 3)) {
      console.log(`        NEAR  ${(o * 100).toFixed(0)}% ch${a.chapter}/ch${b.chapter}:`);
      console.log(`          "${a.line.slice(0, 92)}"`);
      console.log(`          "${b.line.slice(0, 92)}"`);
    }
  }
}
console.log(`\n  Run with --verbose to see the pairs.\n`);
