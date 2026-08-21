#!/usr/bin/env node
/**
 * X38-AT-SOURCE — the device's own arithmetic, measured over every archived case.
 *
 * WHY THIS IS A COMMITTED SCRIPT. REVIEW_05 §12.11 reported "7 of 14 checkable cases" from a sweep
 * that was run once, in a session scratchpad, and thrown away. Re-running it found different
 * numbers — and the difference was not noise, it was the DENOMINATOR: that sweep counted a case as
 * checkable whenever the mechanism's two anchors parsed, including cases where the check cannot run
 * at all (no duration fact, or two of them). Cases the gate is silent on were scored as cases the
 * gate passed, which is the mistake REVIEW_14 §12 had named one paragraph earlier — "a silent
 * temporal gate still means UNPARSEABLE more often than it means clean".
 *
 * A number that cannot be re-derived is not a measurement. This script is the derivation.
 *
 *   node scripts/probe-device-arithmetic.mjs            # the table and the totals
 *   node scripts/probe-device-arithmetic.mjs --verbose  # plus each violation's full message
 *   node scripts/probe-device-arithmetic.mjs --repair   # replay X38-at-source over the same cases
 *
 * `--repair` calls the REAL `reconcileDeviceArithmetic` out of apps/worker/dist, not a copy of its
 * rule. A probe that reimplements the thing it measures can only ever confirm itself; this one fails
 * loudly if the built worker is stale or the export is renamed.
 *
 * WHAT COUNTS AS CHECKABLE is exactly what `checkCaseTimeCoherence` can read, and nothing else:
 *   registry branch    two clock-valued locked facts + exactly one duration
 *   mechanism branch   one duration + both of Agent 3's anchors, when the registry locks one clock
 * Anything else is reported as `unreadable` and excluded from the rate, in its own column, so the
 * silence is visible rather than folded into the pass count.
 *
 * SOURCES, both archives this repo already keeps:
 *   apps/worker/logs/locked-facts-{runId}.json   the registry, as Agent 3b/3 left it
 *   apps/api/data/reports/<dir>/{runId}.json     geometry's time_model, i.e. the mechanism anchors
 */

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(HERE, "..");
const require = createRequire(import.meta.url);
const { checkCaseTimeCoherence, parseClockTime, parseDurationMinutes } = require(
  path.join(ROOT, "packages/cml/dist/index.js"),
);

const VERBOSE = process.argv.includes("--verbose");
const REPAIR = process.argv.includes("--repair");
const LOGS = path.join(ROOT, "apps/worker/logs");
const REPORTS = path.join(ROOT, "apps/api/data/reports");

/** The real pass, not a restatement of it. Absent or renamed, this probe stops rather than guesses. */
let reconcileDeviceArithmetic = null;
if (REPAIR) {
  const built = path.join(ROOT, "apps/worker/dist/jobs/agents/agent3b-run.js");
  if (!fs.existsSync(built)) {
    console.error(`--repair needs the built worker. Missing: ${built}\nRun: node scripts/build-all.mjs`);
    process.exit(1);
  }
  ({ reconcileDeviceArithmetic } = require(built));
  if (typeof reconcileDeviceArithmetic !== "function") {
    console.error("--repair: apps/worker/dist does not export reconcileDeviceArithmetic. Rebuild, or the pass was renamed.");
    process.exit(1);
  }
}

const readJson = (p) => JSON.parse(fs.readFileSync(p, "utf8"));

/** Every archived locked-fact registry, by runId. */
const registries = new Map();
for (const file of fs.readdirSync(LOGS)) {
  const m = /^locked-facts-(.+)\.json$/.exec(file);
  if (!m) continue;
  const j = readJson(path.join(LOGS, file));
  registries.set(m[1], Array.isArray(j) ? j : (j.registry ?? j.lockedFacts ?? []));
}

/** Geometry's time model, by runId — the mechanism's two anchors under their geometry names. */
const findTimeModel = (o) => {
  let out = null;
  (function walk(v) {
    if (v === null || typeof v !== "object" || out) return;
    for (const k of Object.keys(v)) {
      if (k === "time_model" || k === "timeModel") { out = v[k]; return; }
      walk(v[k]);
    }
  })(o);
  return out;
};
const anchors = new Map();
for (const dir of fs.readdirSync(REPORTS)) {
  const d = path.join(REPORTS, dir);
  if (!fs.statSync(d).isDirectory()) continue;
  for (const file of fs.readdirSync(d)) {
    if (!file.endsWith(".json")) continue;
    const tm = findTimeModel(readJson(path.join(d, file)));
    if (tm && (tm.apparentTime || tm.trueTime)) anchors.set(file.replace(/\.json$/, ""), tm);
  }
}

/** The detector's own shape gate, re-derived so the branch can be named in the table. */
const readShape = (facts) => {
  const clocks = [];
  const durations = [];
  for (const f of facts) {
    const raw = String(f?.value ?? "").trim();
    if (!raw) continue;
    const id = String(f?.id ?? "").trim() || "(unnamed)";
    const asDuration = parseDurationMinutes(raw);
    if (asDuration !== null) { durations.push({ id, raw, minutes: asDuration }); continue; }
    const asClock = parseClockTime(raw);
    if (asClock !== null) clocks.push({ id, raw, minutes: asClock });
  }
  return { clocks, durations };
};

const rows = [];
for (const [runId, facts] of [...registries.entries()].sort()) {
  const { clocks, durations } = readShape(facts);
  const tm = anchors.get(runId) ?? null;
  const apparent = tm ? parseClockTime(tm.apparentTime) : null;
  const actual = tm ? parseClockTime(tm.trueTime) : null;
  const hasAnchorPair = apparent !== null && actual !== null;

  const registryBranch = clocks.length === 2 && durations.length === 1;
  const mechanismBranch = !registryBranch && durations.length === 1 && hasAnchorPair;
  const branch = registryBranch ? "registry" : mechanismBranch ? "mechanism" : "-";

  const violations = checkCaseTimeCoherence({
    lockedFacts: facts,
    apparentTime: tm?.apparentTime,
    actualTime: tm?.trueTime,
  });
  const arithmetic = violations.find((v) => v.code === "locked_time_arithmetic") ?? null;
  const spines = violations.find((v) => v.code === "time_spines_disagree") ?? null;

  const row = {
    runId, facts: facts.length, clocks: clocks.length, durations: durations.length,
    anchors: hasAnchorPair ? "pair" : tm ? "partial" : "none",
    branch, arithmetic, spines,
    // Named so an unrepairable case can be told apart from a merely incoherent one.
    repairable: registryBranch && clocks.length === 2,
    after: null, repairNote: null, declaresDerived: false, mutated: false,
  };

  if (REPAIR) {
    // A deep copy, so the archive on disk is never the thing being mutated.
    const copy = facts.map((f) => ({ ...f }));
    const before = JSON.stringify(copy);
    const ctx = { lockedFactRegistry: copy, warnings: [] };
    reconcileDeviceArithmetic(ctx);
    row.after = checkCaseTimeCoherence({
      lockedFacts: ctx.lockedFactRegistry,
      apparentTime: tm?.apparentTime,
      actualTime: tm?.trueTime,
    }).find((v) => v.code === "locked_time_arithmetic") ?? null;
    row.repairNote = ctx.warnings.find((w) => w.includes("[X38]")) ?? null;
    row.declaresDerived = facts.some((f) => Array.isArray(f?.derivedFrom) && f.derivedFrom.length > 0);
    // The safety assertion this replay exists for: no declaration, no byte changed.
    row.mutated = JSON.stringify(ctx.lockedFactRegistry) !== before;
  }

  rows.push(row);
}

const pad = (s, n) => String(s ?? "").padEnd(n);
const W = Math.max(24, ...rows.map((r) => r.runId.length + 2));

console.log("");
console.log(`${pad("runId", W)}${pad("facts", 7)}${pad("clocks", 8)}${pad("durs", 6)}${pad("anchors", 9)}${pad("branch", 11)}verdict`);
console.log("-".repeat(W + 7 + 8 + 6 + 9 + 11 + 20));
for (const r of rows) {
  const verdict = r.branch === "-" ? "unreadable" : r.arithmetic ? "FAILS" : "ok";
  console.log(
    `${pad(r.runId, W)}${pad(r.facts, 7)}${pad(r.clocks, 8)}${pad(r.durations, 6)}${pad(r.anchors, 9)}${pad(r.branch, 11)}${verdict}` +
      (r.spines ? "  +two-spines" : ""),
  );
}

const byBranch = (name) => rows.filter((r) => r.branch === name);
const readable = rows.filter((r) => r.branch !== "-");
const failing = readable.filter((r) => r.arithmetic);
const pct = (a, b) => (b === 0 ? "n/a" : `${Math.round((100 * a) / b)}%`);

console.log("");
console.log(`archived registries                                  ${rows.length}`);
console.log(`  the check CANNOT read (no opinion, not a pass)      ${rows.length - readable.length}`);
console.log(`  the check CAN read                                 ${readable.length}`);
for (const name of ["registry", "mechanism"]) {
  const b = byBranch(name);
  const f = b.filter((r) => r.arithmetic);
  console.log(`    via the ${pad(name + " branch", 18)}${pad(f.length + "/" + b.length, 8)}fail  ${pct(f.length, b.length)}`);
}
console.log("");
console.log(`DEVICE ARITHMETIC THAT DOES NOT WORK                 ${failing.length}/${readable.length}  ${pct(failing.length, readable.length)}`);
console.log(`  of those, repairable at Agent 3b (two locked clocks) ${failing.filter((r) => r.repairable).length}`);
console.log(`  of those, needing Agent 3's anchors to see at all    ${failing.filter((r) => !r.repairable).length}`);
console.log(`two spines that do not meet (X39)                     ${rows.filter((r) => r.spines).length}`);

if (REPAIR) {
  const stillFailing = readable.filter((r) => r.after);
  const closed = failing.filter((r) => !r.after);
  const touched = rows.filter((r) => r.repairNote && r.repairNote.includes("repaired at source"));
  const declaring = rows.filter((r) => r.declaresDerived);
  console.log("");
  console.log("── X38-at-source, replayed over the same cases ──────────────");
  console.log(`  archived devices declaring \`derivedFrom\`           ${declaring.length}/${rows.length}`);
  console.log(`  devices the pass rewrote                           ${touched.length}`);
  console.log(`  failures it CLOSED                                 ${closed.length}/${failing.length}`);
  console.log(`  cases it touched that were already coherent        ${touched.filter((r) => !r.arithmetic).length}`);
  if (declaring.length === 0) {
    console.log("");
    console.log("  EXPECTED, and not a null result. `derivedFrom` post-dates every archived run, and the");
    console.log("  pass rewrites nothing the device has not declared derived — so the correct outcome over");
    console.log("  this corpus is ZERO rewrites. The archive is 24 of 24 clock-family devices, where an");
    console.log("  interval happens to be the derived value; a poison, tide or fuse device fixes the");
    console.log("  interval physically and its TIMES must move instead. Inferring the direction from these");
    console.log("  runs would be fitting a repair to a sample. What this replay can still prove is the");
    console.log("  safety half: every device above is left byte-identical.");
    const mutated = rows.filter((r) => r.mutated);
    console.log(`  registries mutated without a declaration          ${mutated.length}  ${mutated.length === 0 ? "<- correct" : "<- BUG"}`);
  }
  for (const r of rows.filter((x) => x.repairNote)) {
    console.log("");
    console.log(`  ${r.runId} [${r.branch}]`);
    console.log(`    ${r.repairNote.replace(/\s+/g, " ").replace(/^\[X38\]\s*/, "")}`);
  }
}

if (VERBOSE) {
  console.log("");
  for (const r of failing) {
    console.log(`--- ${r.runId} [${r.branch}]`);
    console.log(`    ${r.arithmetic.message.replace(/\s+/g, " ")}`);
  }
}
console.log("");
