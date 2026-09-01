#!/usr/bin/env node
/**
 * A_80 §10 — baseline F5 (atomic-fact dominance) and F6 (adjacent duplicate sentences).
 *
 *   node scripts/a80-baseline-f5-f6.mjs
 *
 * A_80 says both fixes must be measured over the 204 archived manuscripts before shipping, for the
 * reason A_79 §12 established: the 6-gram anti-copy index looked obviously right and fired on 92.2%
 * of our own books. A threshold picked before the measurement is a guess wearing a number.
 *
 * F5 asks: if we required the two most-stated clock times in a manuscript to be within some ratio of
 * each other, how often would that fire on work we already shipped? The run under investigation had
 * 40 mentions of one time against 2 of the other — a ratio of 20:1.
 *
 * F6 asks: how common are exact adjacent duplicate sentences? The run had 2. If that is routine, the
 * injector fix is cosmetic; if it is rare, the run is anomalous and the fix is worth its risk.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const STORIES = "C:/CML/stories";

const files = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const p = join(d, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md") && statSync(p).size > 4000) files.push(p);
  }
};
walk(STORIES);

// Closed vocabulary — the same one retry-regression.ts uses, for the same reason.
const MIN = "(?:a\\s+)?(?:quarter|half|five|ten|fifteen|twenty|twenty-five|twenty-two|one|two|three|four|six|seven|eight|nine|eleven|twelve|forty|fifty|fifty-five)";
const HR = "(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon)";
const CLOCK = new RegExp(`\\b(?:${MIN}\\s+(?:minutes?\\s+)?(?:past|to)\\s+${HR}|${HR}\\s+o'clock|\\d{1,2}(?::\\d{2})?\\s*(?:a\\.m\\.|p\\.m\\.|am|pm))\\b`, "gi");

const ratios = [];
let dupDocs = 0;
let dupTotal = 0;
const dupExamples = [];

for (const f of files) {
  const text = readFileSync(f, "utf8");

  // ── F5: dominance between the two most-stated clock times ──────────────────────────────────
  const counts = new Map();
  for (const m of text.match(CLOCK) ?? []) {
    const k = m.toLowerCase().replace(/\s+/g, " ").trim();
    counts.set(k, (counts.get(k) ?? 0) + 1);
  }
  const top = [...counts.values()].sort((a, b) => b - a);
  if (top.length >= 2 && top[1] > 0) ratios.push({ file: f, ratio: top[0] / top[1], top1: top[0], top2: top[1] });

  // ── F6: exact adjacent duplicate sentences ─────────────────────────────────────────────────
  const sents = text.split(/(?<=[.!?])\s+/).map((s) => s.trim());
  let d = 0;
  for (let i = 1; i < sents.length; i++) {
    if (sents[i] && sents[i] === sents[i - 1] && sents[i].length > 25) {
      d += 1;
      if (dupExamples.length < 4) dupExamples.push(sents[i].slice(0, 74));
    }
  }
  if (d > 0) { dupDocs += 1; dupTotal += d; }
}

const pct = (n) => `${((100 * n) / files.length).toFixed(1)}%`;

console.log(`manuscripts scanned: ${files.length}\n`);

console.log("── F5 — clock-time dominance (top time : second time) ──────────────────────────");
console.log(`  manuscripts stating two or more distinct clock times: ${ratios.length} (${pct(ratios.length)})`);
for (const t of [2, 3, 4, 6, 10, 20]) {
  const n = ratios.filter((r) => r.ratio >= t).length;
  const share = ratios.length ? ((100 * n) / ratios.length).toFixed(1) : "0.0";
  const flag = n / Math.max(1, ratios.length) > 0.25 ? "   <-- would fire on more than a quarter" : "";
  console.log(`    ratio >= ${String(t).padStart(2)}:1   ${String(n).padStart(3)} of ${ratios.length}  (${share}%)${flag}`);
}
const sorted = [...ratios].sort((a, b) => a.ratio - b.ratio);
const med = sorted.length ? sorted[Math.floor(sorted.length / 2)].ratio : 0;
console.log(`  median dominance ratio: ${med.toFixed(2)}:1`);
console.log(`  run mystery-1788202899854 was 40:2 = 20:1`);

console.log("\n── F6 — exact adjacent duplicate sentences ─────────────────────────────────────");
console.log(`  manuscripts containing at least one: ${dupDocs} (${pct(dupDocs)})`);
console.log(`  total occurrences: ${dupTotal}`);
console.log(`  run mystery-1788202899854 had 2`);
for (const e of dupExamples) console.log(`    e.g. "${e}"`);
