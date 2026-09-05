// How often do archived clue descriptions contain a digit+meridiem time — the ONLY shape the
// hard-abort gate (detectLockedFactClueTimeMismatch) can read?
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";
const ROOT = "C:/CML/documentation/prompts/actual";
const DIGIT_MERIDIEM = /\b\d{1,2}(?::\d{2})?\s*(?:a\.m\.|p\.m\.|am|pm)\b/i;
const WORDFORM = /\b(?:half past|quarter (?:past|to)|[a-z-]+ minutes? (?:past|to)|[a-z-]+ o['\u2019]clock)\b/i;
const dirsUnder = (p) => readdirSync(p).map((x) => join(p, x)).filter((x) => statSync(x).isDirectory());
const allDirs = [...dirsUnder(ROOT), ...dirsUnder(ROOT).filter((x) => /archive/i.test(x)).flatMap(dirsUnder)];
let n = 0, digit = 0, word = 0;
for (const d of allDirs) {
  const f = readdirSync(d).find((x) => /Agent5-ClueExtraction_response/.test(x));
  if (!f) continue;
  const t = readFileSync(join(d, f), "utf8");
  n++;
  if (DIGIT_MERIDIEM.test(t)) digit++;
  if (WORDFORM.test(t)) word++;
}
console.log(`Agent 5 clue responses read                       : ${n}`);
console.log(`  containing a digit+meridiem time (gate-readable): ${digit}  (${(100 * digit / n).toFixed(0)}%)`);
console.log(`  containing a word-form time (gate-invisible)    : ${word}  (${(100 * word / n).toFixed(0)}%)`);
