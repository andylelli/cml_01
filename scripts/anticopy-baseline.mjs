#!/usr/bin/env node
/**
 * A_79 Phase D — measure the anti-copy gate's false-positive rate before wiring it.
 *
 *   node scripts/anticopy-baseline.mjs [--n=6,7,8,10,12]
 *
 * ── WHY THIS RUNS FIRST ──────────────────────────────────────────────────────────────────────────
 *
 * A_79 §5: "Baseline it first over the archived manuscripts to measure the false-positive rate on
 * period-idiomatic phrasing, and set n from that. A gate whose firing rate is unknown is the
 * unmeasured change this project's boards argue against." CLAUDE.md puts it harder: a check that
 * fires on most runs is an off switch with extra steps.
 *
 * ── WHY THE MEASUREMENT IS EXACT, NOT AN ESTIMATE ────────────────────────────────────────────────
 *
 * The archived manuscripts were all written BEFORE any source prose reached any prompt — A_78 §3
 * measured Agent 3b drawing 0.43% of its prompt from real novels, all of it titles in a diverge-from
 * list, and not one character of worked source text. So every one of these manuscripts is a known
 * negative: any n-gram it shares with a source novel is shared BY COINCIDENCE, and is therefore a
 * false positive by construction.
 *
 * That is a rare thing to have. Most gates are tuned against a guess at the negative class; this one
 * has 200-odd real negatives, so the reported rate is the rate.
 *
 * What it CANNOT tell us is the true-positive rate — we have no copied manuscript to catch. The
 * synthetic positive at the end covers that: a passage lifted verbatim from a source text must be
 * caught at every n, or the detector is broken rather than merely quiet.
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "C:/CML";
const TEXTS = `${ROOT}/library/texts`;
const STORIES = `${ROOT}/stories`;
const NS = ((process.argv.find((a) => a.startsWith("--n=")) ?? "--n=6,7,8,10,12").split("=")[1])
  .split(",").map(Number).filter((x) => Number.isFinite(x) && x > 1);

const { buildAntiCopyIndex, findCopiedSpans, normaliseWords } = await import(
  `file:///${ROOT}/packages/prose-guard/dist/anti-copy.js`
);

// ── the corpus ───────────────────────────────────────────────────────────────────────────────────
const texts = {};
for (const f of readdirSync(TEXTS).filter((x) => x.endsWith(".txt"))) {
  texts[f.replace(/\.txt$/, "")] = readFileSync(join(TEXTS, f), "utf8");
}
const corpusWords = Object.values(texts).reduce((a, t) => a + normaliseWords(t).length, 0);
console.log(`corpus: ${Object.keys(texts).length} works, ${corpusWords.toLocaleString()} words\n`);

// ── the known negatives ──────────────────────────────────────────────────────────────────────────
const manuscripts = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md") && statSync(p).size > 4000) manuscripts.push(p);
  }
};
if (existsSync(STORIES)) walk(STORIES);
console.log(`known negatives: ${manuscripts.length} archived manuscripts (all written before any source prose reached a prompt)\n`);

// ── sweep n ──────────────────────────────────────────────────────────────────────────────────────
console.log("  n   indexed n-grams   manuscripts firing   total spans   longest run   example");
const results = [];
for (const n of NS) {
  const index = buildAntiCopyIndex(texts, n);
  let firing = 0;
  let total = 0;
  let longest = 0;
  let example = "";
  for (const m of manuscripts) {
    const spans = findCopiedSpans(readFileSync(m, "utf8"), index);
    if (spans.length === 0) continue;
    firing += 1;
    total += spans.length;
    for (const s of spans) {
      if (s.length > longest) {
        longest = s.length;
        example = s.text.slice(0, 60);
      }
    }
  }
  const pct = manuscripts.length ? ((100 * firing) / manuscripts.length).toFixed(1) : "0.0";
  results.push({ n, firing, pct, total, longest });
  console.log(
    `  ${String(n).padStart(2)}   ${String(index.size).padStart(14)}   ${String(`${firing} (${pct}%)`).padStart(18)}   ${String(total).padStart(11)}   ${String(longest).padStart(11)}   ${example}`,
  );
}

// ── the synthetic positive: the detector must actually catch copying ─────────────────────────────
console.log("\nsynthetic positive — a passage lifted verbatim from a source text:");
const donor = Object.entries(texts).sort((a, b) => b[1].length - a[1].length)[0];
const donorWords = normaliseWords(donor[1]);
const lifted = donorWords.slice(5000, 5040).join(" ");
for (const n of NS) {
  const index = buildAntiCopyIndex(texts, n);
  const hits = findCopiedSpans(`The room was quiet. ${lifted} She said nothing more.`, index);
  const caught = hits.some((h) => h.length >= 30);
  console.log(`  n=${String(n).padStart(2)}  ${caught ? "CAUGHT" : "MISSED"}  (${hits.length} span(s), longest ${Math.max(0, ...hits.map((h) => h.length))} words)`);
}
console.log(`  donor: ${donor[0]}`);

// ── the recommendation ───────────────────────────────────────────────────────────────────────────
const clean = results.filter((r) => r.firing === 0);
console.log("\nrecommendation:");
if (clean.length > 0) {
  const smallest = clean[0];
  console.log(`  smallest n with a ZERO false-positive rate over ${manuscripts.length} known negatives: n=${smallest.n}`);
  console.log(`  a smaller n is more sensitive, so take the smallest n that is clean — anything larger`);
  console.log(`  trades real detection for no measured benefit.`);
} else {
  console.log(`  NO tested n is clean. The gate cannot ship as a hard fail at any of ${NS.join(", ")}.`);
  console.log(`  Either test larger n, or ship it as a report rather than a gate.`);
}
