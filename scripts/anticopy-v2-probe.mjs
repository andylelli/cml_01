#!/usr/bin/env node
/**
 * Anti-copy probe for the v2 era — the production path (n = DEFAULT_N, the whole of library/texts),
 * over every manuscript in stories/. Written 2026-10-03 when PROSE_ANTI_COPY_GATE was wired back into v2
 * as ship-check telemetry (agent9-v2/ship-check.ts, v2AntiCopyShipCheckLines).
 *
 *   npm run build:all && node scripts/anticopy-v2-probe.mjs
 *
 * It answers three questions, in this order, and the order matters:
 *
 *   1. IS THE PROBE ALIVE?  A 40-, 11- and 10-word lift from a library text is spliced into a real
 *      manuscript. 40 and 11 must be reported, 10 must not. A zero below is only a finding about the
 *      manuscripts if this passes (CLAUDE.md: a negative from a probe is a claim about the probe).
 *   2. HOW LONG DOES THE LOOP STALL?  The pipeline runs inside the API process, so a synchronous
 *      index build freezes the API and the UI. `loadAntiCopyIndexAsync` yields between texts; this
 *      reports the longest gap between event-loop turns while it builds.
 *   3. DOES ANY MANUSCRIPT FIRE?  Every manuscript predates the corpus-fed agents, so every hit is a
 *      false positive by construction (see scripts/anticopy-baseline.mjs, which this does not replace:
 *      that one sweeps n; this one checks the n the pipeline actually uses).
 *
 * Archived `*review*`, `*analysis*`, `*plan*`, `*issues*` markdown is not prose and is skipped.
 * Paths are repo-relative: run it from any checkout, including a worktree.
 *
 * Exit: 0 clean · 1 the probe itself is broken · 2 a manuscript fired.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { performance } from "node:perf_hooks";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TEXTS = join(ROOT, "library", "texts");
const STORIES = join(ROOT, "stories");

process.env.PROSE_ANTI_COPY_TEXTS_DIR = TEXTS;
process.env.PROSE_ANTI_COPY_GATE = "true";

const mod = await import(pathToFileURL(join(ROOT, "packages", "prose-guard", "dist", "anti-copy.js")).href);
const { loadAntiCopyIndexAsync, findCopiedSpans, normaliseWords, DEFAULT_N } = mod;

// ── 2. the index, built while a ticker measures how long the event loop is held ──────────────────
let maxGapMs = 0;
let ticks = 0;
let last = performance.now();
let building = true;
const tick = () => {
  const now = performance.now();
  maxGapMs = Math.max(maxGapMs, now - last);
  last = now;
  ticks += 1;
  if (building) setImmediate(tick);
};
setImmediate(tick);
const t0 = performance.now();
const index = await loadAntiCopyIndexAsync();
building = false;
const buildS = (performance.now() - t0) / 1000;
console.log(`index: n=${index.n} (DEFAULT_N=${DEFAULT_N}) works=${index.sources.length} n-grams=${index.size.toLocaleString("en-GB")}`);
console.log(`build: ${buildS.toFixed(1)}s total, event loop turned ${ticks} times, LONGEST STALL ${(maxGapMs / 1000).toFixed(2)}s\n`);

// ── the manuscripts ──────────────────────────────────────────────────────────────────────────────
const NOT_PROSE = /review|analysis|plan|issues|debrief|readme/i;
const rel = (p) => p.replace(/\\/g, "/").replace(`${STORIES.replace(/\\/g, "/")}/`, "");
const isArchive = (p) => rel(p).startsWith("_archive/");
const manuscripts = [];
const walk = (dir) => {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) walk(p);
    else if (e.name.endsWith(".md") && statSync(p).size > 4000 && !NOT_PROSE.test(rel(p))) manuscripts.push(p);
  }
};
walk(STORIES);
console.log(`manuscripts: ${manuscripts.length} (v2-era ${manuscripts.filter((p) => !isArchive(p)).length}, archive ${manuscripts.filter(isArchive).length})\n`);

// ── 1. is the probe alive ────────────────────────────────────────────────────────────────────────
const sourceFile = readdirSync(TEXTS).filter((f) => f.endsWith(".txt")).sort()[3];
const source = normaliseWords(readFileSync(join(TEXTS, sourceFile), "utf8"));
const base = readFileSync(manuscripts.find((p) => !isArchive(p)) ?? manuscripts[0], "utf8");
const lift = (len) => source.slice(50_000, 50_000 + len).join(" ");
console.log(`known-positive source: ${sourceFile}`);
let alive = findCopiedSpans(base, index).length === 0;
for (const [len, want] of [[40, 1], [11, 1], [10, 0]]) {
  const spans = findCopiedSpans(`${base}\n\n${lift(len)}\n`, index);
  const ok = spans.length === want && (want === 0 || spans[0].length >= len);
  alive &&= ok;
  console.log(`  lift ${String(len).padStart(2)} words -> ${spans.length} span(s) (want ${want}) ${ok ? "ok" : "FAIL"}`);
}
if (!alive) {
  console.log("\nPROBE IS BROKEN — a known-positive was missed or the clean manuscript fired. Nothing below means anything.");
  process.exit(1);
}
console.log("  probe alive\n");

// ── 3. the measurement ───────────────────────────────────────────────────────────────────────────
const rows = manuscripts.map((p) => {
  const spans = findCopiedSpans(readFileSync(p, "utf8"), index);
  return { p: rel(p), archive: isArchive(p), spans };
});
for (const [label, set] of [["v2-era", rows.filter((r) => !r.archive)], ["archive", rows.filter((r) => r.archive)], ["all", rows]]) {
  const firing = set.filter((r) => r.spans.length > 0);
  const longest = Math.max(0, ...set.flatMap((r) => r.spans.map((s) => s.length)));
  console.log(`${label.padEnd(8)} manuscripts=${set.length} firing=${firing.length} spans=${set.reduce((a, r) => a + r.spans.length, 0)} longest=${longest}w`);
}
const firing = rows.filter((r) => r.spans.length > 0);
for (const r of firing) console.log(`  FIRING ${r.p}: ${r.spans.map((s) => `${s.length}w "${s.text.slice(0, 70)}"`).join(" | ")}`);
process.exit(firing.length > 0 ? 2 : 0);
