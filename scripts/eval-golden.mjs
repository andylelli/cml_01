#!/usr/bin/env node
/**
 * R6 (architecture/REVIEW_01.md) — the golden-set eval harness. THE KEYSTONE TASK.
 *
 * WHAT PROBLEM THIS SOLVES. Prose quality is currently only measurable by a £4-8, two-hour, hand-run
 * A/B. That cost is why levers stay flag-OFF, why the deterministic injector floor keeps shipping,
 * and why eleven of the seventeen deferred flags in architecture/FLAG-AUDIT.md name this task as
 * their blocker. Make measurement cheap and the backlog stops being budget-bound.
 *
 * WHAT IT DOES. For each frozen bundle in eval/golden/: replay Agent 9 against those exact upstream
 * artifacts, rubric-score the result, and diff every category against a stored baseline. One command,
 * unattended, with a non-zero exit when a category regresses past threshold so it can gate a merge.
 *
 * WHAT IT DOES NOT DO — and this is the honest limit. The rubric judge is UNCALIBRATED (R7). This
 * harness makes the judge cheap to run; it does not make it right. Until R7 lands, a delta here is
 * "the judge's opinion moved", not "the prose got better". Treated otherwise it manufactures
 * confidence, which is worse than no harness at all — hence --repeats and the variance check below.
 *
 * Usage:
 *   npm run eval                  measure against the stored baseline
 *   npm run eval:baseline         re-baseline deliberately (overwrites eval/golden/baseline.json)
 *   npm run eval:freeze           create bundles from data/store.json
 *
 * Options:
 *   --bundles a,b        only these bundle ids
 *   --repeats N          run each bundle N times and average (variance control; default 1)
 *   --threshold N        category regression tolerance in marks (default 0.5)
 *   --dry                assemble contexts, make no LLM calls (wiring check; free)
 *   --concurrency N      bundles in flight at once (default 1 — the rate limiter is global)
 */

import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync, rmSync } from "node:fs";
import { join } from "node:path";

const WORKSPACE_ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const GOLDEN_DIR = join(WORKSPACE_ROOT, "eval", "golden");
const BASELINE_PATH = join(GOLDEN_DIR, "baseline.json");
const RESULTS_DIR = join(WORKSPACE_ROOT, "eval", "results");
const REPLAY_ENTRY = join(WORKSPACE_ROOT, "apps", "worker", "dist", "jobs", "agent9-replay.js");
const FULL_PROMPT_LOG = join(WORKSPACE_ROOT, "logs", "llm-prompts-full.jsonl");

const CATEGORIES = [
  "premise",
  "opening_hook",
  "plot_structure",
  "character_clarity",
  "dialogue",
  "atmosphere",
  "clues",
  "pacing",
  "ending",
  "prose",
];

// ── args ─────────────────────────────────────────────────────────────────────
const argv = process.argv.slice(2);
const flag = (name, fallback = null) => {
  const i = argv.indexOf(`--${name}`);
  return i >= 0 && argv[i + 1] && !argv[i + 1].startsWith("--") ? argv[i + 1] : fallback;
};
const has = (name) => argv.includes(`--${name}`);

const MODE_BASELINE = has("baseline");
const DRY = has("dry");
const REPEATS = Math.max(1, Number(flag("repeats", "1")));
const CONCURRENCY = Math.max(1, Number(flag("concurrency", "1")));
const ONLY = (flag("bundles", "") || "").split(",").map((s) => s.trim()).filter(Boolean);

/**
 * ── WHAT THIS HARNESS MEASURES, AND WHAT IT DOES NOT ────────────────────────
 * Read before trusting a number out of it. Sources: documentation/plan/target_80/TARGET_80_LEDGER.md.
 *
 * 1. THE TARGET IS THE EXTERNAL READ, NOT THIS SCORE.
 *    M3 exit is "mean ChatGPT >= 80 AND internal-external gap <= 3". This harness runs the INTERNAL
 *    rubric judge. On the S0 batch the internal judge UNDER-scored the external read by a mean of
 *    9.5 points, per-run -16/-3/-13/-6. That per-run spread (13 points) is LARGER than the entire
 *    remaining distance to 80 (external mean 73.25, so 6.75 to go). An internal delta is therefore
 *    a hypothesis about the external score, not a measurement of it. Use --external to close that.
 *
 * 2. IT CANNOT MEASURE UPSTREAM CRAFT.
 *    A bundle freezes the upstream artifacts (cml, clues, outline). Replaying Agent 9 measures how
 *    well the PROSE renders a fixed structure. Categories decided upstream — plot_structure, and
 *    much of clues — cannot improve here no matter what changes, because their inputs are pinned.
 *    The ledger records this directly: the dual-value A/B needed fresh runs because "replay was
 *    structurally unable to measure it". Fresh-run batches remain the instrument for upstream work.
 *    Reliable here: prose, opening_hook, dialogue, pacing, atmosphere, ending, character_clarity.
 *
 * 3. IT DOES NOT GATE UNTIL IT KNOWS ITS OWN NOISE.
 *    See NOISE FLOOR below.
 */
const KNOWN_INTERNAL_BIAS = -9.5; // internal minus external, S0 batch (n=4)
const MEASURABLE_CATEGORIES = new Set([
  "prose", "opening_hook", "dialogue", "pacing", "atmosphere", "ending", "character_clarity",
]);
const UPSTREAM_PINNED_CATEGORIES = new Set(["plot_structure", "clues", "premise"]);

/**
 * NOISE FLOOR. The regression threshold must come from measured run-to-run variance, never from a
 * guess. The previous default (0.5 marks) was invented, and it sits far below the observed spread:
 * one M2 batch on an UNCHANGED config scored 55/63/65/66 — 11 points of total spread. A 0.5-mark
 * gate against that noise reports regressions that are not there, and a harness that cries wolf is
 * worse than no harness, because someone eventually reverts a good change to silence it.
 *
 * So: the threshold is taken from the baseline's own recorded spread when one exists, and an
 * explicit --threshold always wins. With neither, the harness REPORTS but refuses to GATE.
 */
const THRESHOLD_EXPLICIT = flag("threshold", null) !== null ? Number(flag("threshold", "0")) : null;
const WANT_EXTERNAL = has("external");

// ── helpers ──────────────────────────────────────────────────────────────────
const listBundles = () => {
  if (!existsSync(GOLDEN_DIR)) return [];
  return readdirSync(GOLDEN_DIR)
    .filter((f) => f.endsWith(".json") && f !== "baseline.json")
    .map((f) => ({ id: f.replace(/\.json$/, ""), path: join(GOLDEN_DIR, f) }))
    .filter((b) => ONLY.length === 0 || ONLY.includes(b.id));
};

/** Bytes in the full-prompt log — the only cost source this project trusts. */
const promptLogSize = () => {
  try {
    return readFileSync(FULL_PROMPT_LOG, "utf8").length;
  } catch {
    return 0;
  }
};

/**
 * Cost estimate from the prompt log, NEVER from `report.total_cost`.
 * `report-total-cost-underreports-7x`: that field under-reports by ~7x and has burned a budget
 * decision before. chars/4 ≈ tokens is the audit rule this project already uses.
 */
function costFromPromptLog(startOffsetChars) {
  let text;
  try {
    text = readFileSync(FULL_PROMPT_LOG, "utf8");
  } catch {
    return null;
  }
  const slice = text.slice(startOffsetChars);
  let promptChars = 0;
  let responseChars = 0;
  let calls = 0;
  for (const line of slice.split(/\r?\n/)) {
    if (!line.trim()) continue;
    let rec;
    try {
      rec = JSON.parse(line);
    } catch {
      continue;
    }
    calls++;
    promptChars += JSON.stringify(rec.messages ?? rec.prompt ?? "").length;
    responseChars += String(rec.response ?? "").length;
  }
  // gpt-4.1 list prices, GBP, per 1k tokens. Approximate by construction — the number exists to
  // catch an order-of-magnitude surprise, not to bill anyone.
  const promptTokens = promptChars / 4;
  const responseTokens = responseChars / 4;
  const gbp = (promptTokens / 1000) * 0.0016 + (responseTokens / 1000) * 0.0064;
  return { calls, promptTokens: Math.round(promptTokens), responseTokens: Math.round(responseTokens), gbp };
}

function runBundle(bundle, attempt) {
  return new Promise((resolve) => {
    mkdirSync(RESULTS_DIR, { recursive: true });
    const resultPath = join(RESULTS_DIR, `${bundle.id}-${attempt}.json`);
    try {
      rmSync(resultPath, { force: true });
    } catch {
      /* first run */
    }

    const env = {
      ...process.env,
      REPLAY_BUNDLE: bundle.path,
      REPLAY_RESULT_OUT: resultPath,
      CML_WORKSPACE_ROOT: WORKSPACE_ROOT,
      ...(DRY ? { REPLAY_DRY: "1" } : {}),
    };

    const label = `eval-${bundle.id}-${attempt}`;
    const child = spawn(process.execPath, ["--use-system-ca", REPLAY_ENTRY, "", label], {
      env,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let tail = "";
    const keep = (chunk) => {
      tail = (tail + chunk.toString()).slice(-4000);
    };
    child.stdout.on("data", (c) => {
      keep(c);
      if (process.env.EVAL_VERBOSE === "1") process.stdout.write(c);
    });
    child.stderr.on("data", keep);

    child.on("close", (code) => {
      if (DRY) return resolve({ ok: code === 0, dry: true, bundleId: bundle.id });
      if (code !== 0 || !existsSync(resultPath)) {
        return resolve({ ok: false, bundleId: bundle.id, error: `exit ${code}`, tail: tail.slice(-1200) });
      }
      try {
        resolve({ ok: true, bundleId: bundle.id, ...JSON.parse(readFileSync(resultPath, "utf8")) });
      } catch (e) {
        resolve({ ok: false, bundleId: bundle.id, error: `unreadable result: ${e.message}` });
      }
    });
  });
}

/** Mean of a bundle's repeats, plus the spread — the spread is what says whether a delta is real. */
function summarise(runs) {
  const scored = runs.filter((r) => r.ok && r.rubric);
  if (scored.length === 0) return null;
  const finals = scored.map((r) => r.rubric.final);
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;

  const categories = {};
  const categorySpread = {};
  for (const cat of CATEGORIES) {
    const marks = scored
      .map((r) => (r.rubric.categories ?? []).find((c) => c.category === cat)?.mark)
      .filter((m) => typeof m === "number");
    if (marks.length) {
      categories[cat] = Number(mean(marks).toFixed(2));
      // Per-category spread across repeats IS the noise floor for that category. Recorded on the
      // baseline so a later gate can be set from evidence rather than from a guess.
      categorySpread[cat] = Number((Math.max(...marks) - Math.min(...marks)).toFixed(2));
    }
  }

  return {
    final: Number(mean(finals).toFixed(2)),
    finalSpread: Number((Math.max(...finals) - Math.min(...finals)).toFixed(2)),
    runs: scored.length,
    categories,
    categorySpread,
    caps: [...new Set(scored.flatMap((r) => r.rubric.caps_applied ?? []))],
    chapters: scored[0].chapters,
    // Story paths for the external read — the actual M3 metric lives outside this process.
    storyPaths: scored.map((r) => r.storyPath).filter(Boolean),
  };
}

/**
 * The gate threshold, in marks, derived from what the baseline actually observed.
 *
 * Rule: a category must move by more than its own measured spread before we call it a regression.
 * `null` means "no evidence of the noise floor" — the caller must then report without gating.
 */
function deriveThreshold(baseline) {
  if (THRESHOLD_EXPLICIT !== null) return { value: THRESHOLD_EXPLICIT, source: "--threshold" };
  if (!baseline || (baseline.repeats ?? 1) < 2) return { value: null, source: "unmeasured" };

  const spreads = Object.values(baseline.bundles ?? {})
    .filter(Boolean)
    .flatMap((b) => Object.values(b.categorySpread ?? {}));
  if (spreads.length === 0) return { value: null, source: "unmeasured" };

  // Worst observed per-category spread, so the gate sits just above the noisiest category rather
  // than above the average one — the average would still fire on the noisy tail.
  const worst = Math.max(...spreads);
  return { value: Number((worst + 0.25).toFixed(2)), source: `measured (worst spread ${worst})` };
}

const fmtDelta = (d) => (d === null || d === undefined ? "   —  " : (d > 0 ? "+" : "") + d.toFixed(2));

function printTable(current, baseline) {
  const ids = Object.keys(current);
  console.log(`\n${"─".repeat(78)}`);
  console.log(`GOLDEN SET — ${ids.length} bundle(s), ${REPEATS} repeat(s) each`);
  console.log("─".repeat(78));

  console.log(`\n${"bundle".padEnd(24)}${"final".padStart(8)}${"base".padStart(8)}${"delta".padStart(9)}${"spread".padStart(9)}`);
  for (const id of ids) {
    const c = current[id];
    const b = baseline?.bundles?.[id];
    const delta = c && b ? c.final - b.final : null;
    console.log(
      id.slice(0, 23).padEnd(24) +
        (c ? c.final.toFixed(2) : "FAIL").padStart(8) +
        (b ? b.final.toFixed(2) : "—").padStart(8) +
        fmtDelta(delta).padStart(9) +
        (c ? `±${c.finalSpread.toFixed(2)}` : "—").padStart(9),
    );
  }

  const agg = (obj) => {
    const vals = Object.values(obj).filter(Boolean);
    return vals.length ? vals.reduce((a, b) => a + b.final, 0) / vals.length : null;
  };
  const curAgg = agg(current);
  const baseAgg = baseline ? agg(baseline.bundles ?? {}) : null;
  console.log(
    "\n" +
      "AGGREGATE".padEnd(24) +
      (curAgg !== null ? curAgg.toFixed(2) : "—").padStart(8) +
      (baseAgg !== null ? baseAgg.toFixed(2) : "—").padStart(8) +
      fmtDelta(curAgg !== null && baseAgg !== null ? curAgg - baseAgg : null).padStart(9),
  );

  if (!baseline) return [];

  const { value: threshold, source } = deriveThreshold(baseline);
  console.log(
    `\n${"category".padEnd(24)}${"now".padStart(8)}${"base".padStart(8)}${"delta".padStart(9)}   scope`,
  );
  const regressions = [];
  for (const cat of CATEGORIES) {
    const nowVals = Object.values(current).filter(Boolean).map((c) => c.categories[cat]).filter((v) => v !== undefined);
    const baseVals = Object.values(baseline.bundles ?? {}).map((c) => c?.categories?.[cat]).filter((v) => v !== undefined);
    if (!nowVals.length || !baseVals.length) continue;
    const now = nowVals.reduce((a, b) => a + b, 0) / nowVals.length;
    const base = baseVals.reduce((a, b) => a + b, 0) / baseVals.length;
    const delta = now - base;

    // A category whose inputs are frozen in the bundle cannot legitimately move here. If it does,
    // that is judge noise, not a craft change — so it is shown but never allowed to gate.
    const pinned = UPSTREAM_PINNED_CATEGORIES.has(cat);
    const scope = pinned ? "upstream-pinned" : MEASURABLE_CATEGORIES.has(cat) ? "" : "unclassified";

    const isRegression = threshold !== null && !pinned && delta < -threshold;
    if (isRegression) regressions.push({ category: cat, delta: Number(delta.toFixed(2)) });
    console.log(
      cat.padEnd(24) +
        now.toFixed(2).padStart(8) +
        base.toFixed(2).padStart(8) +
        fmtDelta(delta).padStart(9) +
        `   ${scope}` +
        (isRegression ? "  ← REGRESSION" : ""),
    );
  }
  console.log(`\n[eval] gate threshold: ${threshold === null ? "NONE — reporting only" : threshold} (${source})`);
  return regressions;
}

/**
 * Write the package an external read needs: the stories, and a scoring instruction that does NOT
 * leak the internal marks.
 *
 * WHY THIS EXISTS. M3's bar is `mean ChatGPT >= 80` with `internal-external gap <= 3`. Neither
 * number can come from this process. The most this harness can honestly do is make the external
 * read cheap to perform and record the pairing so the gap becomes trackable per bundle — which is
 * Open Item 6 ("no external scores collected yet") and Open Item 10 (the -9.5 calibration gap).
 *
 * The internal score is deliberately withheld from the prompt: showing a judge the number it is
 * meant to check independently is anchoring, and it would quietly manufacture the agreement R7 is
 * supposed to measure.
 */
function writeExternalReadPackage(current) {
  const dir = join(RESULTS_DIR, "external-read");
  mkdirSync(dir, { recursive: true });

  const manifest = [];
  for (const [id, summary] of Object.entries(current)) {
    if (!summary) continue;
    for (const storyPath of summary.storyPaths) {
      manifest.push({
        bundleId: id,
        storyPath,
        internalFinal: summary.final,
        externalFinal: null,
        gap: null,
        // R7 — per-category marks, so calibration can be measured where it actually matters. A
        // single total hides the shape of the disagreement: a judge that is 9.5 low but ranks
        // stories correctly is USABLE for A/B work, and one that is unbiased on the total while
        // scrambling categories is not. `npm run eval:calibrate` reads both.
        internalCategories: summary.categories ?? {},
        externalCategories: Object.fromEntries(CATEGORIES.map((c) => [c, null])),
      });
    }
  }

  writeFileSync(
    join(dir, "SCORING-PROMPT.md"),
    [
      "# External read — scoring instructions",
      "",
      "Score each story out of 100 using the ten rubric categories (10 marks each):",
      "",
      CATEGORIES.map((c) => `- ${c}`).join("\n"),
      "",
      "Read the story cold. Do not look at any internal score, cap list, or report before scoring —",
      "the whole value of this read is that it is independent of the pipeline's own judge.",
      "",
      "Record each result in `manifest.json` under `externalFinal`, and the ten per-category marks",
      "under `externalCategories`. `gap` is internal minus external. Then run `npm run eval:calibrate`",
      "— it computes the judge's bias, its spread, and whether its per-story RANKING agrees with",
      "yours, which is the property that decides whether an internal A/B delta means anything.",
      "",
      "## Why",
      "",
      "The project's exit criterion is an EXTERNAL mean of 80 with an internal-external gap of 3 or",
      "less. The internal judge currently under-scores by about 9.5 points (per-run -16/-3/-13/-6),",
      "so internal movement alone cannot demonstrate progress toward the target.",
    ].join("\n"),
    "utf8",
  );
  writeFileSync(join(dir, "manifest.json"), JSON.stringify(manifest, null, 2), "utf8");
  console.log(`\n[eval] external-read package: ${dir} (${manifest.length} stor${manifest.length === 1 ? "y" : "ies"})`);
  console.log(`[eval] the M3 bar is the EXTERNAL score; fill in manifest.json to make the gap trackable.`);
}

async function main() {
  if (!existsSync(REPLAY_ENTRY)) {
    console.error(
      `[eval] Replay entry not built: ${REPLAY_ENTRY}\n` +
        `[eval] Run 'npm run build:all' first — the worker consumes @cml/* via dist, so an unbuilt tree\n` +
        `[eval] would measure yesterday's code (worker-consumes-cml-packages-via-dist).`,
    );
    process.exit(1);
  }

  const bundles = listBundles();
  if (bundles.length === 0) {
    console.error(
      `[eval] No bundles in ${GOLDEN_DIR}.\n` +
        `[eval] Create some first:  npm run eval:freeze -- --list   then   npm run eval:freeze -- --auto`,
    );
    process.exit(1);
  }
  if (bundles.length < 4 && !DRY) {
    console.warn(
      `[eval] WARNING: ${bundles.length} bundle(s). REVIEW R6 asks for 4-6 chosen for premise diversity;\n` +
        `[eval]          a delta over fewer generalises poorly. Reported, not blocked.`,
    );
  }

  const baseline = existsSync(BASELINE_PATH) ? JSON.parse(readFileSync(BASELINE_PATH, "utf8")) : null;
  if (!baseline && !MODE_BASELINE) {
    console.warn(`[eval] No baseline at ${BASELINE_PATH} — measuring only. Create one with 'npm run eval:baseline'.`);
  }

  const costStart = promptLogSize();
  const startedAt = Date.now();
  console.log(`[eval] ${bundles.length} bundle(s) x ${REPEATS} repeat(s)${DRY ? " (DRY — no LLM calls)" : ""}`);

  // Jobs are (bundle, attempt) pairs so repeats parallelise too. Concurrency defaults to 1: the
  // client's rate limiter is per-process, so parallel children share no budget and will 429 together.
  const jobs = [];
  for (const bundle of bundles) for (let i = 1; i <= REPEATS; i++) jobs.push({ bundle, attempt: i });

  const byBundle = new Map(bundles.map((b) => [b.id, []]));
  let next = 0;
  const worker = async () => {
    while (next < jobs.length) {
      const job = jobs[next++];
      process.stdout.write(`[eval] ${job.bundle.id} (${job.attempt}/${REPEATS}) ... `);
      const result = await runBundle(job.bundle, job.attempt);
      console.log(result.ok ? (result.rubric ? `${result.rubric.final}/100` : "ok (unscored)") : `FAILED: ${result.error}`);
      if (!result.ok && result.tail) console.log(result.tail.split("\n").slice(-6).map((l) => `        ${l}`).join("\n"));
      byBundle.get(job.bundle.id).push(result);
    }
  };
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, jobs.length) }, worker));

  if (DRY) {
    const failed = [...byBundle.values()].flat().filter((r) => !r.ok);
    console.log(`\n[eval] DRY complete — ${jobs.length - failed.length}/${jobs.length} bundles assembled a context.`);
    process.exit(failed.length ? 1 : 0);
  }

  const current = {};
  for (const [id, runs] of byBundle) current[id] = summarise(runs);

  const failedBundles = Object.entries(current).filter(([, v]) => v === null).map(([id]) => id);
  const scoredCurrent = Object.fromEntries(Object.entries(current).filter(([, v]) => v !== null));

  if (MODE_BASELINE) {
    mkdirSync(GOLDEN_DIR, { recursive: true });
    writeFileSync(
      BASELINE_PATH,
      JSON.stringify(
        { recordedAt: new Date().toISOString(), repeats: REPEATS, bundles: scoredCurrent },
        null,
        2,
      ),
      "utf8",
    );
    console.log(`\n[eval] baseline written: ${BASELINE_PATH}`);
    if (REPEATS < 2) {
      console.log(
        `[eval] ⚠ baseline recorded with --repeats 1, so it carries NO noise floor. Until a baseline\n` +
          `[eval]   is taken with --repeats 2 or more, 'npm run eval' will report deltas but refuse to\n` +
          `[eval]   gate on them — there is nothing to distinguish a real regression from judge noise.`,
      );
    }
  }

  const regressions = printTable(scoredCurrent, MODE_BASELINE ? null : baseline);

  // ── variance honesty check (R6 acceptance) ────────────────────────────────
  // If run-to-run spread is as large as the deltas being reported, the harness cannot distinguish
  // signal and must SAY SO. A harness too noisy to be trusted is worse than none, because it
  // manufactures confidence — the acceptance criterion tests for exactly this.
  const spreads = Object.values(scoredCurrent).map((c) => c.finalSpread);
  const aggregateNow =
    Object.values(scoredCurrent).reduce((a, b) => a + b.final, 0) / Math.max(1, Object.keys(scoredCurrent).length);

  if (REPEATS > 1 && spreads.length) {
    const worst = Math.max(...spreads);
    console.log(`\n[eval] worst within-bundle spread across repeats: ±${worst.toFixed(2)} points`);
    // The distance still to run is 6.75 external points (73.25 → 80). If this harness's own noise
    // is of that order, it cannot see the thing the project is trying to move.
    if (worst >= 6.75) {
      console.log(
        `[eval] ⚠ NOT TRUSTWORTHY FOR THE 80 TARGET: run-to-run spread (±${worst.toFixed(2)}) is at or above\n` +
          `[eval]   the entire remaining distance to the goal (6.75 external points). Any single delta this\n` +
          `[eval]   harness reports is inside its own noise. Raise --repeats and average, or add bundles.`,
      );
    }
  } else if (REPEATS === 1) {
    console.log(
      `\n[eval] note: --repeats 1, so no variance estimate. ` +
        `A single run cannot separate a real delta from judge noise (canary-k2-single-run-confounded).`,
    );
  }

  // ── the calibration banner ────────────────────────────────────────────────
  // Printed on every scored run so an internal number is never read as progress toward 80.
  console.log(
    `\n[eval] INTERNAL score ${aggregateNow.toFixed(1)}/100. The target (80) is an EXTERNAL read.\n` +
      `[eval] Measured internal−external bias: ${KNOWN_INTERNAL_BIAS} (per-run −16/−3/−13/−6, n=4).\n` +
      `[eval] Implied external ≈ ${(aggregateNow - KNOWN_INTERNAL_BIAS).toFixed(1)} — but that per-run spread (13 pts)\n` +
      `[eval] is wider than the remaining gap to 80, so treat it as a hypothesis, not a reading.\n` +
      `[eval] Run with --external to emit the package that makes the real number collectable (R7).`,
  );
  if (WANT_EXTERNAL) writeExternalReadPackage(scoredCurrent);

  const cost = costFromPromptLog(costStart);
  const mins = ((Date.now() - startedAt) / 60000).toFixed(1);
  if (cost) {
    console.log(
      `\n[eval] ${cost.calls} LLM calls, ~${(cost.promptTokens / 1000).toFixed(0)}k prompt + ` +
        `${(cost.responseTokens / 1000).toFixed(0)}k completion tokens, ~£${cost.gbp.toFixed(2)} in ${mins} min`,
    );
    console.log(`[eval] (from llm-prompts-full.jsonl — never from report.total_cost, which under-reports ~7x)`);
  }

  if (failedBundles.length) console.log(`\n[eval] FAILED bundles: ${failedBundles.join(", ")}`);

  // Exit code is the gate. Non-zero on a regression past threshold, or on any bundle that could not
  // be scored — an unscoreable bundle is a broken measurement, not a neutral result.
  if (regressions.length) {
    console.log(
      `\n[eval] FAIL — ${regressions.length} categor${regressions.length === 1 ? "y" : "ies"} regressed past the ` +
        `measured noise floor: ${regressions.map((r) => `${r.category} ${r.delta}`).join(", ")}`,
    );
    process.exit(1);
  }
  if (failedBundles.length) process.exit(1);

  const { value: gateThreshold } = deriveThreshold(MODE_BASELINE ? null : baseline);
  if (gateThreshold === null && !MODE_BASELINE) {
    // Reporting without gating is the honest state, and it must not read as a green tick.
    console.log(
      `\n[eval] REPORTED (not gated) — no measured noise floor yet.\n` +
        `[eval] Take a baseline with repeats to enable gating:  npm run eval:baseline -- --repeats 3`,
    );
    return;
  }
  console.log(`\n[eval] PASS`);
}

main().catch((e) => {
  console.error("[eval] FAILED:", e?.stack ?? e);
  process.exit(1);
});
