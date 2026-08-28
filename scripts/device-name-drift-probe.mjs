#!/usr/bin/env node
/**
 * Does the prose call the mechanism's device by more than one name?
 *
 * ── THE DEFECT ───────────────────────────────────────────────────────────────────────────────────
 *
 * The external reader of `story_20260827-2019` wrote:
 *
 *   "The draft calls the hourglass action: spun the battered stopwatch / spun the vintage clock hand /
 *    twisted the brass key / turned the hourglass. Use only: turned the hourglass. Anything else
 *    confuses the mechanism."
 *
 * All four describe the SAME act at the SAME locked time ("at a quarter to eleven"). Checked against
 * that run's CML: `hourglass` is in the case; `brass key`, `stopwatch` and `clock hand` are NOT — the
 * prose invented three alternative devices for the central mechanism.
 *
 * Nothing in the pipeline detects this. `deriveMechanismTerms` / `chapterFullyExplainsMechanism` check
 * COVERAGE — was the mechanism explained — never CONSISTENCY: was it called the same thing twice.
 *
 * ── WHY THIS TEST NEEDS NO CASE FILE ─────────────────────────────────────────────────────────────
 *
 * It is self-contained. If one book says "turned the hourglass at a quarter to eleven" and also
 * "twisted the brass key at a quarter to eleven", it contradicts ITSELF, whatever the case says. So
 * the probe groups manipulation-verb phrases by the clock time they cite and reports any time that
 * takes more than one distinct object.
 *
 *   node scripts/device-name-drift-probe.mjs
 */

import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, basename } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

const manuscripts = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (!e.name.endsWith(".md")) continue;
    if (/readme|review|notes|debrief/i.test(e.name)) continue;
    if (statSync(f).size > 8000) manuscripts.push(f);
  }
};
walk(join(ROOT, "stories"));

/** Verbs that operate a timing device. Deliberately narrow — these are acts on a mechanism. */
const VERB = "(?:turned|spun|twisted|flipped|wound|reversed|started|set|tipped)";
/** A clock reading, worded or numeric — the anchor that proves two phrases describe one moment. */
const CLOCK = "(?:a )?(?:quarter (?:past|to)|half past|[a-z]+ minutes (?:past|to)|\\d{1,2}[:.]\\d{2})[a-z ]{0,18}";
const PHRASE = new RegExp(`\\b${VERB}\\s+the\\s+([a-z][a-z ]{2,26}?)\\s+at\\s+(${CLOCK})`, "gi");

/** Strip qualifiers so "battered stopwatch" and "stopwatch" are one object, not two. */
const headNoun = (s) => {
  const words = s.trim().toLowerCase().split(/\s+/);
  return words[words.length - 1];
};

let scanned = 0;
const offenders = [];
for (const f of manuscripts) {
  const text = readFileSync(f, "utf8").replace(/\s+/g, " ");
  scanned += 1;
  const byTime = new Map();
  for (const m of text.matchAll(PHRASE)) {
    const obj = headNoun(m[1]);
    const time = m[2].trim().toLowerCase().replace(/\s+$/, "");
    const key = time.split(" ").slice(0, 4).join(" ");
    const set = byTime.get(key) ?? new Set();
    set.add(obj);
    byTime.set(key, set);
  }
  for (const [time, objs] of byTime) {
    if (objs.size > 1) offenders.push({ file: basename(f), time, objs: [...objs] });
  }
}

console.log(`\n  manuscripts scanned                     : ${scanned}`);
console.log(`  books naming ONE moment's device more than one way : ${new Set(offenders.map((o) => o.file)).size}`);
console.log(`  distinct contradictions                 : ${offenders.length}`);
console.log(`  firing rate                             : ${scanned ? ((100 * new Set(offenders.map((o) => o.file)).size) / scanned).toFixed(0) : 0}% of manuscripts\n`);
for (const o of offenders.slice(0, 12)) {
  console.log(`    ${o.file.slice(0, 44).padEnd(46)} "${o.time}" -> ${o.objs.join(" / ")}`);
}
console.log("");
