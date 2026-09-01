#!/usr/bin/env node
/**
 * A_81 §4 check 1 — measure ONE manuscript against the canon targets.
 *
 *   node scripts/calibration-one.mjs <path-to-manuscript.md> [--baseline <path>]
 *
 * `calibration-measure.mjs` aggregates all 194 of our manuscripts, which is the right shape for
 * finding a systemic gap and the wrong shape for asking "did this chapter's instructions land". This
 * measures a single manuscript, prints the canon target beside it, and says whether each of the five
 * A_80 §19.2 page-shape operations moved.
 *
 * The five operations are stated to the model as COUNTS PER CHAPTER, because A_75's matched pair
 * settled that this model complies with operations and ignores statistics. They are measured here as
 * rates only so they can be compared to the canon numbers, which are rates by nature.
 *
 * CANON figures are from A_79 Phase E over 720,329 words of real Golden Age prose (12 works).
 * OURS-BEFORE is the aggregate over our 194 archived manuscripts, i.e. the pipeline as it stood
 * before the page-shape block existed.
 */
import { readFileSync } from "node:fs";

const CANON = {
  paragraphsOpeningOnSpeechPct: 59.7,
  semicolonsPer1000Words: 4.82,
  emDashesPer1000Words: 6.52,
  longSentencesOver30WordsPct: 10.37,
  shortSentencesUnder8WordsPct: 24.16,
  meanSentenceWords: 16.09,
  p90SentenceWords: 31.02,
  dialogueDensityPct: 22.02,
};
const OURS_BEFORE = {
  paragraphsOpeningOnSpeechPct: 11.49,
  semicolonsPer1000Words: 1.47,
  emDashesPer1000Words: 1.1,
  longSentencesOver30WordsPct: 3.97,
  shortSentencesUnder8WordsPct: 19.25,
  meanSentenceWords: 14.89,
  p90SentenceWords: 25.63,
  dialogueDensityPct: 16.23,
};

const file = process.argv[2];
if (!file) {
  console.error("usage: calibration-one.mjs <manuscript.md>");
  process.exit(2);
}

const body = (t) =>
  String(t)
    .replace(/^#{1,6} .*$/gm, "")
    .replace(/^\s*[-*_]{3,}\s*$/gm, "")
    .replace(/^\s*>.*$/gm, "");

const raw = body(readFileSync(file, "utf8"));
const words = raw.toLowerCase().match(/[a-z][a-z'-]*/g) ?? [];
const sents = raw
  .replace(/\s+/g, " ")
  .split(/(?<=[.!?])["'’”]?\s+(?=[A-Z"'‘“])/)
  .map((s) => s.trim())
  .filter((s) => s.split(/\s+/).length >= 3);
const lens = sents.map((s) => s.split(/\s+/).length);
const paras = raw.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length > 40);
const inQuotes = (raw.match(/[“”][^“”]{2,400}[“”]|"[^"]{2,400}"/g) ?? []).join(" ");

const per1000 = (n) => Number(((1000 * n) / Math.max(1, words.length)).toFixed(2));
const pct = (a, b) => Number(((100 * a) / Math.max(1, b)).toFixed(2));
const quantile = (xs, q) => {
  const s = [...xs].sort((a, b) => a - b);
  return s.length ? s[Math.min(s.length - 1, Math.floor(q * s.length))] : 0;
};

const got = {
  paragraphsOpeningOnSpeechPct: pct(paras.filter((p) => /^["“‘']/.test(p)).length, paras.length),
  semicolonsPer1000Words: per1000((raw.match(/;/g) ?? []).length),
  emDashesPer1000Words: per1000((raw.match(/—|--/g) ?? []).length),
  longSentencesOver30WordsPct: pct(lens.filter((l) => l > 30).length, lens.length),
  shortSentencesUnder8WordsPct: pct(lens.filter((l) => l < 8).length, lens.length),
  meanSentenceWords: Number((lens.reduce((a, b) => a + b, 0) / Math.max(1, lens.length)).toFixed(2)),
  p90SentenceWords: quantile(lens, 0.9),
  dialogueDensityPct: pct((inQuotes.match(/[a-z][a-z'-]*/gi) ?? []).length, words.length),
};

console.log(`${file.split(/[\\/]/).pop()}  —  ${words.length.toLocaleString()} words, ${sents.length} sentences, ${paras.length} paragraphs\n`);
console.log(`  ${"measure".padEnd(34)}${"canon".padStart(8)}${"before".padStart(9)}${"THIS RUN".padStart(10)}   verdict`);

const ORDER = [
  ["paragraphsOpeningOnSpeechPct", "1. paragraphs opening on speech %"],
  ["semicolonsPer1000Words", "2. semicolons / 1000 words"],
  ["emDashesPer1000Words", "3. em-dashes / 1000 words"],
  ["longSentencesOver30WordsPct", "4. sentences over 30 words %"],
  ["shortSentencesUnder8WordsPct", "5. sentences under 8 words %"],
  ["meanSentenceWords", "   mean sentence words (already at canon)"],
  ["p90SentenceWords", "   p90 sentence words"],
  ["dialogueDensityPct", "   dialogue density %"],
];

for (const [k, label] of ORDER) {
  const canon = CANON[k];
  const before = OURS_BEFORE[k];
  const now = got[k];
  // Closing the gap toward canon is what counts, in whichever direction canon sits.
  const gapBefore = Math.abs(canon - before);
  const gapNow = Math.abs(canon - now);
  const moved = now - before;
  const closed = gapBefore - gapNow;
  const verdict =
    Math.abs(moved) < 0.01
      ? "unchanged"
      : closed > 0.01
        ? `CLOSED ${closed.toFixed(2)} toward canon`
        : `widened ${(-closed).toFixed(2)}`;
  console.log(`  ${label.padEnd(34)}${String(canon).padStart(8)}${String(before).padStart(9)}${String(now).padStart(10)}   ${verdict}`);
}
