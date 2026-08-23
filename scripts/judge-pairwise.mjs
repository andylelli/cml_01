#!/usr/bin/env node
/**
 * PLAN-TO-90 §7.2 **M1.2** — calibrate the ORDINAL judge against the human ordering.
 *
 * ── THE QUESTION ─────────────────────────────────────────────────────────────────────────────────
 *
 * 0b.0 settled that no model tested can put an absolute mark on one manuscript accurately enough to
 * rank two books: spread 7–8 at n=8, against a 5-mark difference, on `gpt-4.1-mini` AND
 * `claude-opus-5`. That closed the model route. It did not test the METHOD.
 *
 * This asks the ordinal question — *which of these two is the better mystery?* — against **35
 * externally-read manuscripts** whose human marks span 48 to 86. If the judge reproduces the reader's
 * ordering, the project has an iteration gauge for the first time and every later phase becomes
 * measurable without a paying reader. If it does not, cheap instruments are dead on both methods and
 * the plan becomes "one reader per milestone", which is also a real answer.
 *
 * ── WHY IT RUNS EVERY PAIR TWICE ─────────────────────────────────────────────────────────────────
 *
 * Position bias is the known failure mode of a pairwise LLM judge. A judge that simply prefers
 * whichever manuscript is labelled A is right on half the pairs and wrong on the other half, and a
 * one-orientation harness reports 50% and calls it noise. Every pair is therefore judged BOTH ways and
 * counts only when the two orientations name the same book. Consistency is reported as its own number.
 *
 * ── WHY IT SAMPLES, AND WHY THE SAMPLE IS STRATIFIED ─────────────────────────────────────────────
 *
 * 35 manuscripts make 447 pairs at a 5-mark gap — 894 calls, roughly $12. That is not a £2 experiment,
 * and PLAN-TO-90 §7.2's "~£2 for all 55 pairs" was costed when the ledger held 11 manuscripts.
 *
 * So it samples, and the sampling is the design rather than a budget compromise: **pairs are bucketed
 * by how far apart the humans put them, and drawn round-robin.** A judge that only gets the 18-mark
 * gaps right is useless for A/B work, where the difference a lever makes is a mark or two. The report
 * therefore gives agreement PER BUCKET; a single headline number would hide exactly the failure that
 * matters. Selection is deterministic (no RNG) so a re-run compares like with like.
 *
 *   node scripts/judge-pairwise.mjs --dry              free; prints the plan, the pairs and the cost
 *   node scripts/judge-pairwise.mjs                    default: 40 pairs, both orientations
 *   node scripts/judge-pairwise.mjs --pairs 80 --min-gap 3
 *   node scripts/judge-pairwise.mjs --judge claude-opus-5
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

import {
  buildPairwiseSystemPrompt,
  buildPairwiseUserMessage,
  createLLMPairwiseJudge,
  foldOrientations,
  summarisePairs,
} from "../packages/rubric-score/dist/index.js";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const MANIFEST = join(ROOT, "eval", "results", "external-read", "manifest.json");
const DRY = process.argv.includes("--dry");

const flagValue = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : dflt;
};

// `.env.local` then `.env`, first-wins — the precedence every production loader has had since X7.
for (const name of [".env.local", ".env"]) {
  const p = join(ROOT, name);
  if (!existsSync(p)) continue;
  for (const line of readFileSync(p, "utf8").split(/\r?\n/)) {
    const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
    if (m && process.env[m[1]] == null) {
      process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").replace(/\s+#.*$/, "").trim();
    }
  }
}

const MODEL = flagValue("--judge", process.env.RUBRIC_JUDGE_MODEL || "gpt-4.1-mini");
const MAX_PAIRS = Number(flagValue("--pairs", "40"));
const MIN_GAP = Number(flagValue("--min-gap", "5"));

// ── the subjects ─────────────────────────────────────────────────────────────

if (!existsSync(MANIFEST)) {
  console.error(`\n  no ledger at ${MANIFEST} — run \`npm run ledger:external-read -- --write\` first\n`);
  process.exit(1);
}
const subjects = JSON.parse(readFileSync(MANIFEST, "utf8"))
  .filter((e) => e.externalFinal != null && e.storyPath && existsSync(join(ROOT, e.storyPath)))
  .map((e) => ({
    id: e.bundleId,
    mark: e.externalFinal,
    derived: e.externalFinalDerived === true,
    path: e.storyPath,
    text: readFileSync(join(ROOT, e.storyPath), "utf8"),
  }))
  .sort((a, b) => b.mark - a.mark || a.id.localeCompare(b.id));

if (subjects.length < 2) {
  console.error("\n  fewer than two externally-read manuscripts on disk — nothing to compare\n");
  process.exit(1);
}

/** Buckets by how far apart the humans put the two books. The close ones are the ones that matter. */
const bucketOf = (gap) => (gap < 10 ? "close (5-9)" : gap < 15 ? "mid (10-14)" : "wide (15+)");

const allPairs = [];
for (let i = 0; i < subjects.length; i += 1) {
  for (let j = i + 1; j < subjects.length; j += 1) {
    const gap = Math.abs(subjects[i].mark - subjects[j].mark);
    if (gap < MIN_GAP) continue;
    allPairs.push({ a: subjects[i], b: subjects[j], gap, bucket: bucketOf(gap) });
  }
}

/**
 * Round-robin across buckets, deterministically.
 *
 * Within a bucket, pairs are ordered by gap ascending then by id, so the HARDEST pairs of each bucket
 * are drawn first — sampling the easy end and reporting the average is how a weak instrument passes.
 */
const buckets = new Map();
for (const p of allPairs) {
  if (!buckets.has(p.bucket)) buckets.set(p.bucket, []);
  buckets.get(p.bucket).push(p);
}
for (const list of buckets.values()) {
  list.sort((x, y) => x.gap - y.gap || `${x.a.id}${x.b.id}`.localeCompare(`${y.a.id}${y.b.id}`));
}
const bucketNames = [...buckets.keys()].sort();
const selected = [];
for (let round = 0; selected.length < MAX_PAIRS; round += 1) {
  let added = false;
  for (const name of bucketNames) {
    const list = buckets.get(name);
    if (round < list.length && selected.length < MAX_PAIRS) {
      selected.push(list[round]);
      added = true;
    }
  }
  if (!added) break;
}

// ── say what it will cost before spending anything ───────────────────────────

const calls = selected.length * 2;
const approxInputTokens = selected.reduce((sum, p) => sum + (p.a.text.length + p.b.text.length) / 4, 0) * 2;
const PRICES = { "gpt-4.1-mini": [0.4, 1.6], "gpt-4.1": [2.0, 8.0], "claude-opus-5": [5.0, 25.0], "claude-sonnet-5": [3.0, 15.0] };
const [pin, pout] = PRICES[MODEL] ?? PRICES["gpt-4.1-mini"];
const estUsd = (approxInputTokens * pin + calls * 400 * pout) / 1e6;

console.log(`\n${"=".repeat(78)}`);
console.log(`M1.2 — CAN AN ORDINAL JUDGE REPRODUCE THE READER'S ORDERING?`);
console.log(`${"=".repeat(78)}\n`);
console.log(`  judge          ${MODEL}`);
console.log(`  manuscripts    ${subjects.length} externally read, marks ${subjects.at(-1).mark}-${subjects[0].mark}`);
const derived = subjects.filter((s) => s.derived).length;
if (derived > 0) console.log(`                 (${derived} of them have a DERIVED mark — see the ledger's finalDerived flag)`);
console.log(`  pairs          ${allPairs.length} at gap >= ${MIN_GAP}; judging ${selected.length}`);
for (const name of bucketNames) {
  const chosen = selected.filter((p) => p.bucket === name).length;
  console.log(`                   ${name.padEnd(12)} ${String(chosen).padStart(3)} of ${buckets.get(name).length}`);
}
console.log(`  calls          ${calls} (every pair judged BOTH ways round)`);
console.log(`  est. cost      $${estUsd.toFixed(2)} (~£${(estUsd * 0.79).toFixed(2)})\n`);

if (DRY) {
  console.log("  --dry: the pairs that would be judged, hardest first within each bucket\n");
  for (const p of selected.slice(0, 20)) {
    console.log(`    ${String(p.gap).padStart(2)}  ${p.a.id} (${p.a.mark})  vs  ${p.b.id} (${p.b.mark})`);
  }
  if (selected.length > 20) console.log(`    … and ${selected.length - 20} more`);
  console.log("\n  nothing spent.\n");
  process.exit(0);
}

// ── run it ───────────────────────────────────────────────────────────────────

const { AzureOpenAIClient, AnthropicClient, CostTracker } = await import("../packages/llm-client/dist/index.js");
const costTracker = new CostTracker();
const isClaude = /^claude/i.test(MODEL);
let client;
if (isClaude) {
  const apiKey = (process.env.ANTHROPIC_API_KEY ?? "").trim();
  if (!apiKey) throw new Error(`judge "${MODEL}" needs ANTHROPIC_API_KEY`);
  client = new AnthropicClient({
    apiKey,
    defaultModel: MODEL,
    ...(process.env.ANTHROPIC_BASE_URL ? { baseURL: process.env.ANTHROPIC_BASE_URL.trim() } : {}),
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 50),
    costTracker,
  });
} else {
  const endpoint = (process.env.AZURE_OPENAI_ENDPOINT ?? "").trim();
  const apiKey = (process.env.AZURE_OPENAI_API_KEY ?? "").trim();
  if (!endpoint || !apiKey) throw new Error(`judge "${MODEL}" needs AZURE_OPENAI_ENDPOINT and AZURE_OPENAI_API_KEY`);
  client = new AzureOpenAIClient({
    endpoint,
    apiKey,
    defaultModel: MODEL,
    apiVersion: process.env.AZURE_OPENAI_API_VERSION ?? "2024-12-01-preview",
    requestsPerMinute: Number(process.env.LLM_RATE_LIMIT_PER_MINUTE ?? 60),
    costTracker,
  });
}

const judge = createLLMPairwiseJudge(
  async (args) => {
    const res = await client.chat({ ...args, model: MODEL });
    return { content: res.content ?? res.text ?? "" };
  },
  { model: MODEL, temperature: 0.2, maxTokens: 1200 },
);

const systemPrompt = buildPairwiseSystemPrompt();
/** One orientation. Returns the id of the manuscript picked, or null when the call was unusable. */
const askOnce = async (first, second) => {
  try {
    const v = await judge({
      systemPrompt,
      userMessage: buildPairwiseUserMessage({ id: first.id, text: first.text }, { id: second.id, text: second.text }),
    });
    return { picked: v.winner === "A" ? first.id : second.id, confidence: v.confidence, categories: v.categoryWinners };
  } catch (e) {
    console.log(`      ! ${first.id} vs ${second.id}: ${e.message}`);
    return null;
  }
};

const judgements = [];
const externalMarks = Object.fromEntries(subjects.map((s) => [s.id, s.mark]));
const perBucket = new Map();

for (const [i, p] of selected.entries()) {
  const forward = await askOnce(p.a, p.b);
  const reverse = await askOnce(p.b, p.a);
  const folded = foldOrientations({
    first: p.a.id,
    second: p.b.id,
    pickedWhenFirstIsA: forward?.picked,
    pickedWhenFirstIsB: reverse?.picked,
  });
  judgements.push(folded);
  if (!perBucket.has(p.bucket)) perBucket.set(p.bucket, []);
  perBucket.get(p.bucket).push(folded);

  const human = p.a.mark > p.b.mark ? p.a.id : p.b.id;
  // FAIL is not FLIP: a call that never returned says nothing about the judge (PairJudgement.failed).
  const mark = folded.failed ? "FAIL" : folded.inconsistent ? "FLIP" : folded.consistentPick === human ? " ok " : "MISS";
  console.log(
    `  [${String(i + 1).padStart(3)}/${selected.length}] ${mark}  gap ${String(p.gap).padStart(2)}  ` +
      `${p.a.id} (${p.a.mark}) vs ${p.b.id} (${p.b.mark})`,
  );
}

// ── the verdict on the instrument ────────────────────────────────────────────

const overall = summarisePairs(judgements, externalMarks, MIN_GAP);
const pct = (v) => (v == null ? "  n/a" : `${(v * 100).toFixed(0)}%`);

console.log(`\n${"=".repeat(78)}`);
console.log(`  bucket           pairs   consistent   agreement (of the consistent ones)   failed`);
for (const name of bucketNames) {
  const list = perBucket.get(name) ?? [];
  if (list.length === 0) continue;
  const s = summarisePairs(list, externalMarks, MIN_GAP);
  console.log(
    `  ${name.padEnd(16)} ${String(list.length).padStart(5)}   ${pct(s.consistencyRate).padStart(10)}   ` +
      `${pct(s.agreement).padStart(9)}  (${s.correct}/${s.scored})` + `${String(s.failed).padStart(9)}`,
  );
}
console.log(`  ${"OVERALL".padEnd(16)} ${String(judgements.length).padStart(5)}   ${pct(overall.consistencyRate).padStart(10)}   ` +
  `${pct(overall.agreement).padStart(9)}  (${overall.correct}/${overall.scored})`);
console.log(`${"=".repeat(78)}\n`);

/**
 * The gate, stated before the run rather than after it (PLAN-TO-90 M1.3): >= 80% agreement on pairs
 * the humans separated by >= 5 marks. `n` is printed beside it because 0b.0's n=3 result was noise and
 * an agreement rate without its count has already misled this project once.
 */
const GATE = 0.8;
if (overall.agreement == null) {
  console.log("  VERDICT: nothing scorable — no pair cleared the gap threshold.\n");
} else if (overall.agreement >= GATE) {
  console.log(`  VERDICT: PASSES the M1.3 gate (${pct(overall.agreement)} >= 80%, n=${overall.scored}).`);
  console.log("  The project has an iteration gauge. Check the CLOSE bucket before trusting it on A/B work.\n");
} else {
  console.log(`  VERDICT: FAILS the M1.3 gate (${pct(overall.agreement)} < 80%, n=${overall.scored}).`);
  console.log("  Ordinal judging does not reproduce the reader either — see PLAN-TO-90 §7.2's second branch.\n");
}
if (overall.inconsistent > 0) {
  console.log(
    `  ${overall.inconsistent} of ${judgements.length} pairs FLIPPED when the labels were swapped — that is` +
      ` position bias, not disagreement about the books.\n`,
  );
}
if (overall.failed > 0) {
  console.log(
    `  ${overall.failed} pair(s) FAILED to return a verdict and are excluded from every rate above. A pairwise` +
      ` prompt carries TWO murder mysteries, so it doubles the violent content per call and can trip a` +
      ` content filter that cardinal judging never reached.\n`,
  );
}
console.log(`  spend: ${JSON.stringify(costTracker.getSummary?.() ?? {})}\n`);
