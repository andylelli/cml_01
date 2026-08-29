#!/usr/bin/env node
/**
 * DOES THE RETRY LOOP MAKE THE PROSE WORSE?
 *
 * ── THE HYPOTHESIS ───────────────────────────────────────────────────────────────────────────────
 *
 * A_75 settled that this model complies with OPERATIONS and ignores STATISTICS. Retry feedback is a
 * list of operations: "you did not REFERENCE the alibi", "ENSURE the clue is named", "ESTABLISH the
 * timeline". A model told that will write sentences that reference, ensure and establish — which is
 * the exact grammatical shape the register score counts as abstract (propositional subject, stative
 * verb).
 *
 * If that is right, our own repair loop is a machine for producing the defect the reader marks us
 * down for, and it fires hardest on the chapters that were already struggling.
 *
 * Observed in story_20260829-1041: Ch8 took 1 attempt, Ch9 took 4, Ch10 took 6 — and those chapters
 * measured 23.2%, 18.4% and 19.1% abstract against ~9% for chapters 1-6. That is n=1 and could be
 * the chapters simply being harder. This tests it across every run whose per-chapter attempt counts
 * can be recovered from the prompt log and joined to a manuscript.
 *
 * A NULL RESULT IS WORTH AS MUCH. Five score hypotheses have been tested this way and four came back
 * null or wrong-signed; each null saved a build.
 *
 *   node scripts/retries-vs-abstraction.mjs
 */

import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const guard = join(ROOT, "packages/prose-guard/dist/machine-register.js");
if (!existsSync(guard)) { console.error("\n  build @cml/prose-guard first\n"); process.exit(1); }
const { machineRegisterRate } = await import(pathToFileURL(guard).href);

// ── how many ATTEMPTS did each chapter of each run take? ─────────────────────────────────────────
// The agent label carries the chapter ("Agent9-ProseGenerator-Ch7"), so counting rows per
// (runId, chapter) gives attempts without needing any other bookkeeping.
const attempts = new Map(); // runId -> Map(chapter -> count)
const log = join(ROOT, "logs", "llm.jsonl");
if (!existsSync(log)) { console.error("\n  logs/llm.jsonl missing\n"); process.exit(1); }

for (const line of readFileSync(log, "utf8").split("\n")) {
  if (!line.trim()) continue;
  let r;
  try { r = JSON.parse(line); } catch { continue; }
  const agent = String(r.agent ?? "");
  const m = agent.match(/ProseGenerator-Ch(\d+)/);
  if (!m) continue;
  if (r.operation && !/chat_request/.test(String(r.operation))) continue;
  const runId = String(r.runId ?? "");
  if (!runId) continue;
  if (!attempts.has(runId)) attempts.set(runId, new Map());
  const byCh = attempts.get(runId);
  const ch = Number(m[1]);
  byCh.set(ch, (byCh.get(ch) ?? 0) + 1);
}

// ── join a run to a manuscript by run folder time, then measure each chapter ─────────────────────
const manuscripts = [];
const walk = (d) => {
  for (const e of readdirSync(d, { withFileTypes: true })) {
    const f = join(d, e.name);
    if (e.isDirectory()) { walk(f); continue; }
    if (e.name.endsWith(".md") && !/readme|review|notes|debrief|report/i.test(e.name) && statSync(f).size > 8000) {
      manuscripts.push(f);
    }
  }
};
walk(join(ROOT, "stories"));

// The prompt log records the story that each runId produced only indirectly, so match on chapter
// COUNT plus recency: a run's chapter count must equal the manuscript's, and we take the closest.
const points = [];
for (const [runId, byCh] of attempts) {
  const chapters = [...byCh.keys()].sort((a, b) => a - b);
  if (chapters.length < 6) continue;
  const want = Math.max(...chapters);
  const candidate = manuscripts.find((f) => {
    const parts = readFileSync(f, "utf8").split(/^##\s+/m).slice(1);
    return parts.length === want;
  });
  if (!candidate) continue;
  const parts = readFileSync(candidate, "utf8").split(/^##\s+/m).slice(1);
  for (const ch of chapters) {
    const body = parts[ch - 1];
    if (!body) continue;
    const r = machineRegisterRate(body, 3);
    if (r.sentences < 15) continue;
    points.push({ runId, ch, tries: byCh.get(ch), rate: r.rate * 100, pos: ch / want });
  }
}

if (points.length < 30) {
  console.log(`\n  only ${points.length} chapter datapoints joined — too few to correlate.\n`);
  process.exit(0);
}

const spearman = (xs, ys) => {
  const rank = (v) => {
    const s = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const out = new Array(v.length);
    s.forEach(([, i], k) => { out[i] = k + 1; });
    return out;
  };
  const rx = rank(xs), ry = rank(ys), n = xs.length;
  const d2 = rx.reduce((a, x, i) => a + (x - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
};

console.log(`\n  chapters with a recoverable attempt count: ${points.length}  (${attempts.size} runs in the log)\n`);

const rho = spearman(points.map((p) => p.tries), points.map((p) => p.rate));
const crit = 1.96 / Math.sqrt(points.length - 1);
console.log(`  attempts vs register rate: rho = ${rho.toFixed(3)}   (|rho| > ${crit.toFixed(3)} to signify)`);
console.log(`  ${Math.abs(rho) < crit ? "NOT SIGNIFICANT" : rho > 0 ? "SIGNAL: more retries -> more abstract" : "wrong direction"}\n`);

// Bucketed, because the relationship may be a step rather than a slope.
const buckets = new Map();
for (const p of points) {
  const k = Math.min(4, p.tries);
  if (!buckets.has(k)) buckets.set(k, []);
  buckets.get(k).push(p.rate);
}
console.log("    attempts   n      mean register");
for (const k of [...buckets.keys()].sort((a, b) => a - b)) {
  const v = buckets.get(k);
  const m = v.reduce((a, b) => a + b, 0) / v.length;
  console.log(`      ${k === 4 ? "4+" : String(k)}       ${String(v.length).padStart(4)}     ${m.toFixed(2).padStart(5)}%  ${"#".repeat(Math.round(m))}`);
}

// POSITION IS THE CONFOUND. Late chapters retry more AND are more abstract for other reasons
// (A_75 §13). Control for it by comparing within the back half only.
const stats = (xs) => {
  const m = xs.reduce((a, b) => a + b, 0) / xs.length;
  const v = xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1);
  return { m, v, n: xs.length };
};
const welch = (A, B) => {
  const a = stats(A), b = stats(B);
  return { a, b, t: (b.m - a.m) / Math.sqrt(a.v / a.n + b.v / b.n) };
};

const late = points.filter((p) => p.pos >= 0.5);
const w = welch(late.filter((p) => p.tries === 1).map((p) => p.rate), late.filter((p) => p.tries > 1).map((p) => p.rate));
console.log(`\n  BACK HALF ONLY (position controlled — late chapters retry more anyway)`);
console.log(`    first-attempt chapters : ${w.a.m.toFixed(2)}%  n=${w.a.n}`);
console.log(`    retried chapters       : ${w.b.m.toFixed(2)}%  n=${w.b.n}`);
console.log(`    difference: ${(w.b.m - w.a.m).toFixed(2)} points, Welch t = ${w.t.toFixed(2)}  ${Math.abs(w.t) > 2 ? "SIGNIFICANT" : "not significant"}`);

const early = points.filter((p) => p.pos < 0.5);
const w2 = welch(early.filter((p) => p.tries === 1).map((p) => p.rate), early.filter((p) => p.tries > 1).map((p) => p.rate));
console.log(`\n  FRONT HALF ONLY`);
console.log(`    first-attempt chapters : ${w2.a.m.toFixed(2)}%  n=${w2.a.n}`);
console.log(`    retried chapters       : ${w2.b.m.toFixed(2)}%  n=${w2.b.n}`);
console.log(`    difference: ${(w2.b.m - w2.a.m).toFixed(2)} points, Welch t = ${w2.t.toFixed(2)}  ${Math.abs(w2.t) > 2 ? "SIGNIFICANT" : "not significant"}`);
console.log("");
