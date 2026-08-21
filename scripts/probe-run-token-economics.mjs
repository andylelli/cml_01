#!/usr/bin/env node
/**
 * Where a run's tokens actually go — per agent, per model, per stage.
 *
 * WHY. Every cost conversation in this project has been held over `report.total_cost`, and
 * `documentation/15_llm_model_and_cost/00_README.md` §4.2 measured that field under-reporting by ~6×
 * because `gpt-4.1` matched no branch in the cost tracker. A_71 fixed that branch on 2026-07-31, but
 * the deeper problem is that a single total cannot tell you WHICH tokens to attack. This reads
 * `logs/llm.jsonl` — the per-call ground truth — and prices each call at its own model's rate.
 *
 *   node scripts/probe-run-token-economics.mjs                 # the most recent complete run
 *   node scripts/probe-run-token-economics.mjs --run <runId>
 *   node scripts/probe-run-token-economics.mjs --all           # every run in the log
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const args = process.argv.slice(2);
const argOf = (n) => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : undefined; };

/** $/MTok. gpt rates are the ones cost-tracker.ts uses; Claude rates are Anthropic first-party. */
const RATES = {
  "gpt-4.1": [2.0, 8.0],
  "gpt-4.1-mini": [0.4, 1.6],
  "gpt-4o": [2.5, 10.0],
  "gpt-4o-mini": [0.15, 0.6],
  "claude-sonnet-5": [3.0, 15.0],
  "claude-opus-5": [5.0, 25.0],
  "claude-haiku-4-5": [1.0, 5.0],
};
const rateFor = (model) => {
  const m = String(model ?? "").toLowerCase();
  if (RATES[m]) return RATES[m];
  if (m.includes("4.1-mini")) return RATES["gpt-4.1-mini"];
  if (m.includes("4o-mini")) return RATES["gpt-4o-mini"];
  if (m.includes("gpt-4.1")) return RATES["gpt-4.1"];
  if (m.includes("4o")) return RATES["gpt-4o"];
  return [2.0, 8.0]; // unknown → assume the premium prose tier rather than under-report
};

const calls = [];
for (const line of fs.readFileSync(path.join(ROOT, "logs/llm.jsonl"), "utf8").split("\n")) {
  if (!line.trim()) continue;
  let j; try { j = JSON.parse(line); } catch { continue; }
  if (j.operation !== "chat_response") continue;
  calls.push({
    run: j.runId ?? "?", agent: j.agent ?? "?", model: j.model ?? "?",
    in: Number(j.promptTokens ?? 0), out: Number(j.completionTokens ?? 0),
    retry: Number(j.retryAttempt ?? 0), ts: j.timestamp,
  });
}

const runs = [...new Set(calls.map((c) => c.run))]
  .map((r) => ({ run: r, n: calls.filter((c) => c.run === r).length }))
  .filter((r) => r.n >= 20)
  .sort((a, b) => {
    const ta = calls.find((c) => c.run === a.run)?.ts ?? "";
    const tb = calls.find((c) => c.run === b.run)?.ts ?? "";
    return ta.localeCompare(tb);
  });

const wanted = argOf("--run") ? [argOf("--run")]
  : args.includes("--all") ? runs.map((r) => r.run)
  : [runs[runs.length - 1]?.run];

const usd = (c) => { const [i, o] = rateFor(c.model); return (c.in / 1e6) * i + (c.out / 1e6) * o; };
const pad = (s, n) => String(s ?? "").padEnd(n);
const rp = (s, n) => String(s ?? "").padStart(n);

for (const run of wanted.filter(Boolean)) {
  const rc = calls.filter((c) => c.run === run);
  if (rc.length === 0) { console.log("no calls for", run); continue; }
  const total = rc.reduce((s, c) => s + usd(c), 0);
  const tin = rc.reduce((s, c) => s + c.in, 0);
  const tout = rc.reduce((s, c) => s + c.out, 0);

  console.log("");
  console.log("=".repeat(78));
  console.log(run, " — ", rc.length, "calls");
  console.log("=".repeat(78));
  console.log("  input " + tin.toLocaleString() + "   output " + tout.toLocaleString() +
              "   ratio " + (tin / Math.max(tout, 1)).toFixed(1) + ":1   COST $" + total.toFixed(2));
  console.log("");

  const byAgent = {};
  for (const c of rc) {
    const k = c.agent;
    byAgent[k] = byAgent[k] ?? { calls: 0, in: 0, out: 0, usd: 0, models: new Set() };
    byAgent[k].calls++; byAgent[k].in += c.in; byAgent[k].out += c.out;
    byAgent[k].usd += usd(c); byAgent[k].models.add(c.model);
  }
  console.log(pad("agent", 34) + rp("calls", 6) + rp("input", 11) + rp("output", 9) + rp("$", 8) + rp("%", 6) + "  model(s)");
  console.log("-".repeat(100));
  for (const [k, v] of Object.entries(byAgent).sort((a, b) => b[1].usd - a[1].usd)) {
    console.log(pad(k, 34) + rp(v.calls, 6) + rp(v.in.toLocaleString(), 11) + rp(v.out.toLocaleString(), 9) +
                rp("$" + v.usd.toFixed(2), 8) + rp(Math.round((100 * v.usd) / total) + "%", 6) +
                "  " + [...v.models].join(", "));
  }

  // Retries measured as EXTRA CALLS PER AGENT, not from `retryAttempt` — that field is a per-agent
  // attempt counter (1 on most agents' only call), not a retry flag, and reading it as one reported
  // 90% of a run as retry spend. Extra calls to the same agent key is the honest measure.
  const perAgent = {};
  for (const c of rc) (perAgent[c.agent] = perAgent[c.agent] ?? []).push(c);
  let extraCalls = 0, extraUsd = 0, extraIn = 0;
  const worst = [];
  for (const [k, list] of Object.entries(perAgent)) {
    if (list.length < 2) continue;
    const sorted = [...list].sort((a, b) => String(a.ts).localeCompare(String(b.ts)));
    const extra = sorted.slice(1);
    const u = extra.reduce((s2, c) => s2 + usd(c), 0);
    extraCalls += extra.length; extraUsd += u; extraIn += extra.reduce((s2, c) => s2 + c.in, 0);
    worst.push([k, extra.length, u]);
  }
  console.log("");
  console.log("  REGENERATION — extra calls to an agent that already ran once");
  console.log("    " + extraCalls + " extra calls of " + rc.length + "   $" + extraUsd.toFixed(2) +
              "  (" + Math.round((100 * extraUsd) / total) + "% of the run)   " +
              extraIn.toLocaleString() + " input tokens re-sent");
  for (const [k, n, u] of worst.sort((a, b) => b[2] - a[2]).slice(0, 6)) {
    console.log("      " + pad(k, 36) + rp("+" + n, 4) + rp("$" + u.toFixed(2), 8));
  }
}
console.log("");
