#!/usr/bin/env node
/**
 * DO THE LAST TWO CHAPTERS REPEAT EACH OTHER?
 *
 * The reader complaint is specific and has been made twice: *"the final test repeats after the
 * confession"* and *"Chapter 9 repeats clearances... it slows the ending"*. The BEAT labels say the
 * shape is common — 43% of outlines end on two consecutive `revelation` chapters, and every outline
 * ever produced ends on `revelation` — but a shared label is not repetition, and A_75 §16 found the
 * label predicts nothing about the marks (|t| < 0.7, n=14).
 *
 * So measure the text instead. Three things a reader would actually notice:
 *
 *   1. SHARED PHRASING  — runs of consecutive content words appearing in both chapters
 *   2. REPEATED CLEARANCES — a suspect cleared in both chapters, i.e. the ending arguing twice
 *   3. REPEATED REVEAL  — the culprit named as guilty in both
 *
 * Reported per book so a single run can be placed against the corpus rather than judged alone.
 *
 *   node scripts/final-pair-repetition.mjs [--story <dir>]
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();

const STOP = new Set(("a an the and or but of to in on at by for with from as is was were be been being that this it its "
  + "he she they them his her their had has have not no so if then than when where which who whom what there here into "
  + "over under about after before you we our your i me my him himself herself would could should did do does done said "
  + "say says out up down off very just only more most other some any all each both very now still yet own same too").split(/\s+/));

const contentWords = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ")
  .split(/\s+/).filter((w) => w && !STOP.has(w));

const runsOf = (text, n) => {
  const w = contentWords(text);
  const out = new Set();
  for (let i = 0; i + n <= w.length; i += 1) out.add(w.slice(i, i + n).join(" "));
  return out;
};

const CLEAR_RE = /\b(cleared|clearance|alibi (?:held|confirmed|checked out)|could not have|was not the|ruled out|eliminated|in the clear)\b/gi;
const GUILT_RE = /\b(killed|murdered|was the killer|was the murderer|had done it|guilty|confessed|the culprit)\b/gi;

const books = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (e.name.endsWith(".md") && !/readme|review|notes|debrief|report/i.test(e.name) && statSync(f).size > 8000) {
      books.push(f);
    }
  }
};
walk(join(ROOT, "stories"));

const rows = [];
for (const f of books) {
  const chapters = readFileSync(f, "utf8").split(/^##\s+/m).slice(1);
  if (chapters.length < 6) continue;
  const a = chapters[chapters.length - 2];
  const b = chapters[chapters.length - 1];

  // 1. shared phrasing, 5-word content runs
  const ra = runsOf(a, 5), rb = runsOf(b, 5);
  let shared = 0;
  for (const r of rb) if (ra.has(r)) shared += 1;
  const sharePct = rb.size ? (100 * shared) / rb.size : 0;

  // 2/3. how many clearance and guilt statements does EACH carry?
  const count = (t, re) => (t.match(re) ?? []).length;
  rows.push({
    f,
    sharePct,
    clearA: count(a, CLEAR_RE), clearB: count(b, CLEAR_RE),
    guiltA: count(a, GUILT_RE), guiltB: count(b, GUILT_RE),
  });
}

const mean = (xs) => (xs.length ? xs.reduce((x, y) => x + y, 0) / xs.length : 0);
const pct = rows.map((r) => r.sharePct).sort((x, y) => x - y);
const q = (p) => pct[Math.floor(pct.length * p)] ?? 0;

console.log(`\n  books measured: ${rows.length}\n`);
console.log(`  SHARED PHRASING between the last two chapters (5-word content runs)`);
console.log(`    median ${q(0.5).toFixed(2)}%   p75 ${q(0.75).toFixed(2)}%   p90 ${q(0.9).toFixed(2)}%   worst ${q(0.999).toFixed(2)}%`);
console.log(`\n  BOTH CHAPTERS ARGUE THE CASE (statements in each):`);
console.log(`    clearance language — penultimate ${mean(rows.map((r) => r.clearA)).toFixed(1)}, final ${mean(rows.map((r) => r.clearB)).toFixed(1)}`);
console.log(`    guilt language     — penultimate ${mean(rows.map((r) => r.guiltA)).toFixed(1)}, final ${mean(rows.map((r) => r.guiltB)).toFixed(1)}`);
const bothClear = rows.filter((r) => r.clearA >= 2 && r.clearB >= 2).length;
const bothGuilt = rows.filter((r) => r.guiltA >= 2 && r.guiltB >= 2).length;
console.log(`\n    books where BOTH final chapters carry 2+ clearance statements: ${bothClear}/${rows.length} (${Math.round(100 * bothClear / rows.length)}%)`);
console.log(`    books where BOTH final chapters carry 2+ guilt statements    : ${bothGuilt}/${rows.length} (${Math.round(100 * bothGuilt / rows.length)}%)`);

const target = process.argv.includes("--story") ? process.argv[process.argv.indexOf("--story") + 1] : null;
if (target) {
  const hit = rows.find((r) => r.f.includes(target));
  if (hit) {
    const rank = pct.filter((x) => x < hit.sharePct).length;
    console.log(`\n  THE NAMED RUN — ${hit.f}`);
    console.log(`    shared phrasing : ${hit.sharePct.toFixed(2)}%  (percentile ${Math.round(100 * rank / pct.length)} — lower is better)`);
    console.log(`    clearance stmts : penultimate ${hit.clearA}, final ${hit.clearB}`);
    console.log(`    guilt stmts     : penultimate ${hit.guiltA}, final ${hit.guiltB}`);
  } else {
    console.log(`\n  no book matched "${target}"`);
  }
}

console.log("\n  worst 6 books by shared phrasing:");
for (const r of [...rows].sort((a, b) => b.sharePct - a.sharePct).slice(0, 6)) {
  console.log(`    ${r.sharePct.toFixed(2).padStart(6)}%  ${r.f.replace(/\\/g, "/").split("/").slice(-2).join("/")}`);
}
console.log("");
