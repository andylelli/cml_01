/**
 * ── A_86 items 79-88 — ONE place a run states what it cost and what it wasted ────────────────────
 *
 * WHY. Every number below already existed somewhere: cost in the tracker, cache hits in
 * `logs/llm.jsonl`, retries in the prompt records, polish outcomes in `prose.repairEfficacy`,
 * fallbacks in the console stream, floor injections in `ctx.warnings`. Answering "what did this run
 * spend, and on what" therefore meant joining five sources by hand — which is exactly what A_86 §0
 * did, and why it took a session rather than a command.
 *
 * The rule this encodes: a run that cannot state its own cost cannot be argued from. It prints after
 * the story is saved, so nothing here can affect the manuscript, and every field degrades to
 * "(unmeasured)" rather than to a zero — an absent number must never read as a good one.
 */

/** Format a US dollar amount, or "(unmeasured)" when it is not a finite number. */
const usd = (value) => (typeof value === "number" && Number.isFinite(value) ? `$${value.toFixed(3)}` : "(unmeasured)");
const pct = (value) =>
  typeof value === "number" && Number.isFinite(value) ? `${(value * 100).toFixed(0)}%` : "(unmeasured)";

/**
 * Fold the per-pass repair ledger into the two numbers that matter: how many calls a pass made, and
 * how many of them the run kept. `rolled_back` is the discarded share.
 */
const repairLine = (pass, tally) => {
  const calls = tally?.calls ?? 0;
  if (calls === 0) return null;
  const kept = tally.changed ?? 0;
  const rolled = tally.rolled_back ?? 0;
  const noChange = tally.no_change ?? 0;
  const share = calls > 0 ? ` (${((rolled / calls) * 100).toFixed(0)}% discarded)` : "";
  const reasons = (tally.reasons ?? []).slice(0, 3).join("; ");
  return (
    `    ${pass.padEnd(22)} calls ${String(calls).padStart(3)}  kept ${String(kept).padStart(3)}  ` +
    `no-change ${String(noChange).padStart(3)}  rolled back ${String(rolled).padStart(3)}${share}` +
    (reasons ? `\n      reasons: ${reasons}` : "")
  );
};

/**
 * Print the summary. Every argument is optional: this runs at the end of a run that may have
 * degraded, and a summary that throws would destroy the diagnostic it exists to provide.
 */
export const printRunSummary = ({ seed, runId, projectId, costSummary, prose, warnings = [], storyPath } = {}) => {
  const lines = [];
  lines.push("");
  lines.push("──────────── RUN SUMMARY (A_86 §I) ────────────");
  // item 88 — the seed, first, so a log can be joined to its parameter yaml without guessing.
  lines.push(`  RUN_SEED   ${seed ?? "(not a seeded run)"}`);
  lines.push(`  runId      ${runId ?? "(unknown)"}`);
  lines.push(`  projectId  ${projectId ?? "(unknown)"}`);
  if (storyPath) lines.push(`  story      ${storyPath}`);

  // ── item 79: cost, and what share of it gated nothing or was discarded ──
  if (costSummary) {
    lines.push("");
    lines.push(`  COST       total ${usd(costSummary.totalCost)}`);
    if (costSummary.costIsUpperBound) {
      lines.push(`             (upper bound — cache hits were billed here at the full input rate)`);
    }
    lines.push(
      `             cache hit ${pct(costSummary.cacheHitRate)} of observable prompt tokens, ` +
        `telemetry coverage ${pct(costSummary.cacheTelemetryCoverage)}`,
    );
    // items 84/85 — the two numbers a run could never answer about itself.
    lines.push(
      `             shadow (gates nothing) ${usd(costSummary.shadowCost)}  ·  ` +
        `wasted (output discarded) ${usd(costSummary.wastedCost)}`,
    );
    const byAgent = Object.entries(costSummary.byAgent ?? {}).sort((a, b) => b[1] - a[1]).slice(0, 5);
    for (const [agent, cost] of byAgent) {
      const share = costSummary.totalCost > 0 ? ` ${((cost / costSummary.totalCost) * 100).toFixed(0)}%` : "";
      lines.push(`             ${agent.padEnd(34)} ${usd(cost)}${share}`);
    }
  } else {
    lines.push("  COST       (unmeasured — no cost tracker on this client)");
  }

  // ── items 79/80: what the repair passes bought ──
  const efficacy = prose?.repairEfficacy;
  if (efficacy?.byPass) {
    lines.push("");
    lines.push("  REPAIRS");
    for (const [pass, tally] of Object.entries(efficacy.byPass)) {
      const line = repairLine(pass, tally);
      if (line) lines.push(line);
    }
  }

  // ── item 79: fallbacks, floors and the release gate, from the warnings the run already collected ──
  const bucket = (label, re) => {
    const hits = warnings.filter((w) => re.test(String(w ?? "")));
    if (hits.length > 0) lines.push(`    ${label.padEnd(22)} ${hits.length}`);
    return hits.length;
  };
  const chapters = Array.isArray(prose?.chapters) ? prose.chapters.length : 0;
  lines.push("");
  lines.push(`  CHAPTERS   ${chapters || "(unknown)"}`);
  lines.push("  FLAGS RAISED");
  const any =
    bucket("injections", /inject/i) +
    bucket("fallbacks", /fallback/i) +
    bucket("geometry", /geometry/i) +
    bucket("dropped clock facts", /dropped .* clock fact/i) +
    bucket("release gate", /release gate/i) +
    // A_86 item 50 — content-filter refusals per run, so the value of the blind-reader retry flag is
    // visible rather than inferred. Run 24901 took two before the retry landed.
    bucket("content refusals", /refus|content.filter|ResponsibleAIPolicy/i);
  if (any === 0) lines.push("    (none)");
  /**
   * A_86 item 95 — the run restates the prediction it was launched to settle, so the read that
   * follows is scored against it rather than against a memory of it. CLAUDE.md already requires the
   * prediction to be WRITTEN before launch; this puts it where the result appears.
   */
  const prediction = process.env.CML_RUN_PREDICTION;
  const falsifier = process.env.CML_RUN_FALSIFIER;
  if (prediction || falsifier) {
    lines.push("");
    lines.push("  PRE-REGISTERED");
    if (prediction) lines.push(`    predicts     : ${prediction}`);
    if (falsifier) lines.push(`    falsified by : ${falsifier}`);
  } else {
    lines.push("");
    lines.push("  PRE-REGISTERED  (none — set CML_RUN_PREDICTION and CML_RUN_FALSIFIER before a paid run)");
  }
  lines.push("───────────────────────────────────────────────");
  lines.push("");
  console.log(lines.join("\n"));
};
