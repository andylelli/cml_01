#!/usr/bin/env node
/**
 * What would a different generation model cost, at THIS pipeline's measured token volume?
 *
 * WHY THIS IS A SCRIPT. The model question is a cost question, and a cost question answered from a
 * blog post is a guess. This derives the token volume from the runs on disk, then prices it against
 * published rates — so when rates move or the pipeline's prompt shrinks, the answer is re-derivable
 * rather than re-remembered. Same reason `probe-device-arithmetic.mjs` exists.
 *
 *   node scripts/cost-model-swap.mjs
 *   node scripts/cost-model-swap.mjs --cache-hit 0.66   # assume this share of input is a cached prefix
 *
 * TOKEN VOLUME, and how it is derived. The reports record cost, not tokens, so the volume is backed
 * out of the recorded spend at the rates the cost tracker itself uses (packages/llm-client/
 * cost-tracker.ts: gpt-4.1 = $2.00/$8.00 per MTok, and costs are stored in GBP at 0.79). The prompt/
 * completion RATIO is the measured one from mystery-1785521869768: 22,292 prompt tokens to produce
 * 1,913 completion tokens per chapter — 11.7:1. That ratio is the whole story of this workload's
 * economics: it is overwhelmingly an INPUT-priced job, so output rates barely move the total.
 */

const args = process.argv.slice(2);
const argOf = (name, dflt) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? Number(args[i + 1]) : dflt;
};

/** MEASURED: mean Agent 9 spend across the 13 archived full runs, in GBP. */
const MEAN_AGENT9_GBP = 0.8019;
/** MEASURED: mean total run spend across the same 13, in GBP. */
const MEAN_TOTAL_GBP = 1.0219;
/** The cost tracker's own USD→GBP constant. */
const GBP_PER_USD = 0.79;
/** The cost tracker's own gpt-4.1 rates, $/MTok. */
const GPT41 = { in: 2.0, out: 8.0 };
/** MEASURED per-chapter prompt:completion ratio (mystery-1785521869768). */
const PROMPT_TO_COMPLETION = 22292 / 1913;

/** Published rates, $/MTok. Anthropic first-party; see the claude-api skill's model table. */
const MODELS = [
  ["gpt-4.1  (current)", 2.0, 8.0, "what the pipeline runs on today"],
  ["Haiku 4.5", 1.0, 5.0, "200K context — the only one under today's cost"],
  ["Sonnet 5  (intro)", 2.0, 10.0, "intro pricing ends 2026-08-31"],
  ["Sonnet 5  (standard)", 3.0, 15.0, "from 2026-09-01"],
  ["Sonnet 4.6", 3.0, 15.0, ""],
  ["Opus 5", 5.0, 25.0, ""],
  ["Fable 5", 10.0, 50.0, "most capable; 1M context"],
];

// ── derive the volume ────────────────────────────────────────────────────────
const agent9Usd = MEAN_AGENT9_GBP / GBP_PER_USD;
// cost = in*P + out*(P/ratio)  →  P = cost / (in + out/ratio)
const promptMTok = agent9Usd / (GPT41.in + GPT41.out / PROMPT_TO_COMPLETION);
const completionMTok = promptMTok / PROMPT_TO_COMPLETION;

const cacheHitShare = argOf("--cache-hit", 0);
/**
 * Effective input after prompt caching. Cache reads bill ~0.1x, writes ~1.25x (5-minute TTL).
 * With one write and (calls-1) reads over a 10-chapter book, a stable prefix costs roughly
 * (1.25 + 0.1*9)/10 = 0.215x of its uncached price.
 */
const CACHED_MULTIPLIER = (1.25 + 0.1 * 9) / 10;
const effectiveInput =
  promptMTok * (1 - cacheHitShare) + promptMTok * cacheHitShare * CACHED_MULTIPLIER;

console.log("");
console.log("Derived from the 13 archived full runs");
console.log("  mean total spend per run      GBP " + MEAN_TOTAL_GBP.toFixed(4) + "   (USD " + (MEAN_TOTAL_GBP / GBP_PER_USD).toFixed(2) + ")");
console.log("  mean Agent 9 (prose) spend    GBP " + MEAN_AGENT9_GBP.toFixed(4) + "   (USD " + agent9Usd.toFixed(2) + ")  ~78% of the bill");
console.log("  implied Agent 9 input tokens  " + Math.round(promptMTok * 1e6).toLocaleString());
console.log("  implied Agent 9 output tokens " + Math.round(completionMTok * 1e6).toLocaleString());
console.log("  prompt:completion ratio       " + PROMPT_TO_COMPLETION.toFixed(1) + ":1  ← an INPUT-priced workload");
if (cacheHitShare > 0) {
  console.log("  prompt caching                " + Math.round(cacheHitShare * 100) + "% of input treated as a stable prefix");
  console.log("  effective input tokens        " + Math.round(effectiveInput * 1e6).toLocaleString() +
              "  (" + Math.round((1 - effectiveInput / promptMTok) * 100) + "% less billed)");
}
console.log("");

const base = GPT41.in * promptMTok + GPT41.out * completionMTok;
const pad = (s, n) => String(s).padEnd(n);
const rpad = (s, n) => String(s).padStart(n);
console.log(pad("model", 22) + rpad("in $/M", 8) + rpad("out $/M", 9) + rpad("$/run", 9) + rpad("vs now", 9) + "  note");
console.log("-".repeat(90));
for (const [name, inRate, outRate, note] of MODELS) {
  const cost = inRate * effectiveInput + outRate * completionMTok;
  const delta = ((cost / base - 1) * 100);
  const deltaStr = Math.abs(delta) < 0.5 ? "same" : (delta > 0 ? "+" : "") + delta.toFixed(0) + "%";
  console.log(pad(name, 22) + rpad(inRate.toFixed(2), 8) + rpad(outRate.toFixed(2), 9) +
              rpad("$" + cost.toFixed(2), 9) + rpad(deltaStr, 9) + "  " + note);
}
console.log("");
console.log("Agent 9 only. Upstream agents (~22% of the bill) are unchanged by a prose-model swap.");
if (cacheHitShare > 0) {
  console.log("NOTE: the cache multipliers are ANTHROPIC's (reads ~0.1x, writes ~1.25x at 5-min TTL),");
  console.log("so the Claude rows are priced correctly and the gpt-4.1 row is INDICATIVE only — Azure");
  console.log("OpenAI prices cached input on its own terms. Do not quote the gpt-4.1 cached figure.");
}

// ── the cheapest experiment: polish only ────────────────────────────────────
//
// The model-tiering module argues this directly: the polish passes emit a small fraction of total
// generation output, so routing ONLY them to a stronger model "buys frontier sentence-craft at a
// fraction of the bill". MEASURED: that pass has never run — fullStoryPolishEnabled is false on all
// 15 archived reports, and zero chapters have ever been edited by it.
const POLISH_CHAPTERS = 3;          // line-edits on the weakest chapters, not the whole book
const POLISH_IN_PER_CH = 25_000;    // the chapter plus its editing brief
const POLISH_OUT_PER_CH = 2_000;
const polishIn = (POLISH_CHAPTERS * POLISH_IN_PER_CH) / 1e6;
const polishOut = (POLISH_CHAPTERS * POLISH_OUT_PER_CH) / 1e6;
console.log("");
console.log("POLISH-ONLY — the surgical option, and the one that needs no code change");
console.log("  " + POLISH_CHAPTERS + " chapters line-edited: ~" + (polishIn*1e6).toLocaleString() + " in / ~" + (polishOut*1e6).toLocaleString() + " out");
console.log("");
console.log(pad("model", 22) + rpad("added $/run", 13) + rpad("vs now", 9));
console.log("-".repeat(46));
for (const [name, inRate, outRate] of MODELS.slice(1)) {
  const add = inRate * polishIn + outRate * polishOut;
  console.log(pad(name, 22) + rpad("+$" + add.toFixed(2), 13) + rpad("+" + ((add / base) * 100).toFixed(0) + "%", 9));
}

// ── the JUDGE, which is where the cheapest high-value swap actually is ──────
//
// The rubric judge runs on gpt-4.1-mini. It reads one finished manuscript (~15K tokens) and returns
// a scored rubric — ONE small call per run, not 10 large ones. And it is the instrument this plan is
// blocked on: PLAN-TO-90 section 2 measures all three internal numbers ranking an 81 above an 86, and
// M1c measured the rubric at +/-3 with a spread of 6 on a single story.
//
// Upgrading the WRITER costs +166% (Opus 5, uncached). Upgrading the JUDGE costs pennies, because it
// is one call over 15K tokens instead of ten calls over 378K.
const JUDGE_IN = 15_000 / 1e6;   // largest archived manuscript is ~14,863 tokens
const JUDGE_OUT = 1_500 / 1e6;   // a ten-category rubric with brief justifications
const JUDGE_NOW = 0.40 * JUDGE_IN + 1.60 * JUDGE_OUT;   // gpt-4.1-mini
console.log("");
console.log("THE RUBRIC JUDGE — one call over ~15K tokens, and the instrument the plan is blocked on");
console.log(pad("model", 22) + rpad("$/run", 10) + rpad("vs now", 10) + rpad("% of a run", 12));
console.log("-".repeat(54));
console.log(pad("gpt-4.1-mini (current)", 22) + rpad("$" + JUDGE_NOW.toFixed(4), 10) + rpad("same", 10) + rpad((100*JUDGE_NOW/base).toFixed(1) + "%", 12));
for (const [name, inRate, outRate] of MODELS.slice(1)) {
  const c = inRate * JUDGE_IN + outRate * JUDGE_OUT;
  console.log(pad(name, 22) + rpad("$" + c.toFixed(4), 10) + rpad("+$" + (c - JUDGE_NOW).toFixed(3), 10) + rpad((100*c/base).toFixed(1) + "%", 12));
}
console.log("");
console.log("Putting Opus 5 on the JUDGE costs about nine pence a run. Putting it on the WRITER costs");
console.log("+166%. If the judge is the blocker — and section 2 of PLAN-TO-90 says it is — that is the");
console.log("first model change worth making, and it is nearly free.");

if (cacheHitShare === 0) {
  console.log("Run with --cache-hit 0.66 to price the same swap WITH prompt caching: the orchestrator");
  console.log("records that roughly two thirds of each chapter prompt is identical across chapters.");
}
console.log("");
