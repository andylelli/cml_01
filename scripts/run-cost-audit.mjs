#!/usr/bin/env node
/**
 * What a run actually cost — PLAN-TO-90 §7.1 / M2.1.
 *
 * WHY THIS EXISTS. There are three cost numbers in this repo and they disagree:
 *
 *   report.total_cost          unlabelled units, and on the 2026-08-22 sweep it disagreed with the
 *                              call log by up to +47% AND RANKED THE RUNS WRONGLY — it calls the
 *                              `behavioral` run the second most expensive when it is the cheapest.
 *                              PLAN-TO-90 §4a quoted it as GBP. It is the reason §4a has two runs
 *                              backwards.
 *   estimatedCost (per call)   the tracker's own figure, summed here as `est` for comparison.
 *   this script                every `chat_response` in logs/llm.jsonl, priced at list, with cached
 *                              input at half rate.
 *
 * You cannot hold a GBP 1 budget with a meter that mis-ranks its own runs, which is the same disease
 * as the rubric in section 2: an instrument whose error exceeds the difference it is asked to resolve.
 *
 * ── ON `retryAttempt`, AND WHY THIS SCRIPT IGNORES IT ────────────────────────────────────────────
 *
 * The field is not one vocabulary. `RubricScorer` logs the first attempt as 0; the Agent 9 chapter
 * generators log it as 1. Counting `retryAttempt > 0` therefore reports 100% of prose calls as
 * retries, which is how the first draft of the §7.1 table was wrong. REPEAT COST is measured here
 * structurally instead: group by (runId, agent) — each chapter has its own agent label — and charge
 * everything after the first call to repeats. That needs no field and cannot drift.
 *
 *   node scripts/run-cost-audit.mjs                 # the last 5 runs
 *   node scripts/run-cost-audit.mjs --runs 12
 *   node scripts/run-cost-audit.mjs --run mystery-1787392024561
 *   node scripts/run-cost-audit.mjs --gbp 0.79      # USD->GBP; check the rate, it is not fetched
 */

import { createReadStream } from "node:fs";
import { createInterface } from "node:readline";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const LOG = join(ROOT, "logs", "llm.jsonl");

const arg = (name, dflt) => {
  const i = process.argv.indexOf(name);
  return i >= 0 && process.argv[i + 1] && !process.argv[i + 1].startsWith("--") ? process.argv[i + 1] : dflt;
};
const WANT_RUN = arg("--run", null);
const N_RUNS = Number(arg("--runs", "5"));
const GBP = Number(arg("--gbp", "0.79"));

/**
 * USD per 1M tokens, list. Cached input is charged at half — Azure's prompt-cache discount, and the
 * reason `cachedPromptTokens` had to be readable at all (PLAN-TO-90 0a.1/0a.3).
 *
 * Unknown models fall back to the gpt-4.1 rate rather than to zero: a swap that silently prices a new
 * model at nothing is exactly the failure `cost-model-swap.mjs` shipped for a month.
 */
const PRICES = {
  "gpt-4.1": [2.0, 8.0],
  "gpt-4.1-mini": [0.4, 1.6],
  "gpt-4o": [2.5, 10.0],
  "claude-opus-5": [5.0, 25.0],
  "claude-sonnet-5": [3.0, 15.0],
  "claude-sonnet-4-5": [3.0, 15.0],
  "claude-haiku-4-5": [1.0, 5.0],
};
const DEFAULT_PRICE = PRICES["gpt-4.1"];

const priceOf = (model, promptTokens, cachedTokens, completionTokens) => {
  const [pin, pout] = PRICES[model] ?? DEFAULT_PRICE;
  const fresh = Math.max(0, promptTokens - cachedTokens);
  return (fresh * pin + cachedTokens * pin * 0.5 + completionTokens * pout) / 1e6;
};

const runs = new Map();
const rl = createInterface({ input: createReadStream(LOG, "utf8"), crlfDelay: Infinity });

for await (const line of rl) {
  if (!line.trim()) continue;
  let d;
  try {
    d = JSON.parse(line);
  } catch {
    continue;
  }
  if (d.operation !== "chat_response") continue;
  const runId = d.runId;
  if (!runId || (WANT_RUN && runId !== WANT_RUN)) continue;

  const tin = d.promptTokens || 0;
  const tout = d.completionTokens || 0;
  const cached = d.cachedPromptTokens || 0;
  const cost = priceOf(d.model, tin, cached, tout);

  let r = runs.get(runId);
  if (!r) {
    r = {
      runId,
      first: d.timestamp,
      last: d.timestamp,
      calls: 0,
      cost: 0,
      est: 0,
      in: 0,
      out: 0,
      cached: 0,
      unknownModels: new Set(),
      byAgent: new Map(), // agent label -> costs[], in call order
    };
    runs.set(runId, r);
  }
  r.last = d.timestamp;
  r.calls += 1;
  r.cost += cost;
  r.est += d.estimatedCost || 0;
  r.in += tin;
  r.out += tout;
  r.cached += cached;
  if (!PRICES[d.model]) r.unknownModels.add(d.model);
  const agent = d.agent || "?";
  if (!r.byAgent.has(agent)) r.byAgent.set(agent, []);
  r.byAgent.get(agent).push(cost);
}

const all = [...runs.values()].filter((r) => r.calls >= 5);
const selected = WANT_RUN ? all : all.slice(-N_RUNS);
if (selected.length === 0) {
  console.error(`\n  no runs found in ${LOG}${WANT_RUN ? ` for ${WANT_RUN}` : ""}\n`);
  process.exit(1);
}

/** Everything after the first call to a given (run, agent) is a repeat — see the header. */
const repeatCost = (r) => [...r.byAgent.values()].reduce((sum, costs) => sum + costs.slice(1).reduce((a, b) => a + b, 0), 0);
const repeatCalls = (r) => [...r.byAgent.values()].reduce((n, costs) => n + Math.max(0, costs.length - 1), 0);

const family = (agent) => agent.replace(/-Ch\d+.*$/, "").replace(/-(clue_too_late|aftermath\w*|\w+_\w+)$/, "");
const usd = (n) => `$${n.toFixed(2)}`;
const gbp = (n) => `£${(n * GBP).toFixed(2)}`;

console.log(`\n  run cost audit — ${selected.length} run(s), list prices, cached input at half rate, USD→GBP ${GBP}\n`);
console.log("  run                      when         calls    first-pass   repeats  n     TOTAL            est");
console.log("  " + "-".repeat(100));

let grand = 0;
for (const r of selected) {
  const rep = repeatCost(r);
  grand += r.cost;
  const when = `${r.first.slice(5, 10)} ${r.first.slice(11, 16)}`;
  console.log(
    `  ${r.runId.padEnd(24)} ${when}  ${String(r.calls).padStart(4)}   ` +
      `${usd(r.cost - rep).padStart(9)}  ${usd(rep).padStart(8)} ${String(repeatCalls(r)).padStart(3)}  ` +
      `${usd(r.cost).padStart(7)} ${gbp(r.cost).padStart(7)}   ${usd(r.est).padStart(7)}`,
  );
  if (r.unknownModels.size) console.log(`      ! unpriced model(s), charged at the gpt-4.1 rate: ${[...r.unknownModels].join(", ")}`);
}

console.log("  " + "-".repeat(100));
const mean = grand / selected.length;
console.log(`  mean per run: ${usd(mean)} ${gbp(mean)}    total: ${usd(grand)} ${gbp(grand)}`);

// Where the money goes, aggregated across the selection.
const fam = new Map();
let repTotal = 0;
for (const r of selected) {
  repTotal += repeatCost(r);
  for (const [agent, costs] of r.byAgent) {
    const k = family(agent);
    fam.set(k, (fam.get(k) || 0) + costs.reduce((a, b) => a + b, 0));
  }
}
console.log(`\n  where it goes (mean per run, ${selected.length} runs)\n`);
for (const [k, c] of [...fam.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)) {
  const per = c / selected.length;
  console.log(`    ${k.padEnd(30)} ${usd(per).padStart(7)}  ${String(Math.round((100 * c) / grand)).padStart(3)}%`);
}
const floorPerRun = (grand - repTotal) / selected.length;
console.log(
  `\n    repeat calls                   ${usd(repTotal / selected.length).padStart(7)}  ${String(Math.round((100 * repTotal) / grand)).padStart(3)}%` +
    `   <- the £1 tail; zero-repeat floor is ${gbp(floorPerRun)}/run\n`,
);
