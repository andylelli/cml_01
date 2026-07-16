#!/usr/bin/env node
// ANALYSIS_62 RC-1 — derive the TARGET_80 ledger panels from run reports.
//
// WHY THIS EXISTS: the cap panel was hand-tallied from run-log prose and drifted materially —
// M1v2-1 was logged "3 caps" (actually 5), M1v2-5 "2 caps" (actually 7), and templateLeakageHits
// was recorded 1/11 when it was 7/20. The -25% P4 rescope was justified by those numbers.
// The guardrail (A_62 §1): a number you did not derive is a number you do not have.
//
// Reads:  apps/api/data/reports/<project>/<run>.json
//           -> diagnostics[key=rubric_score].details.{final,raw_total,caps_applied,categories}
//           -> release_gate_outcome.status   (the PINNED shipped definition, P0.2)
// Writes: markdown panel rows on stdout.
//
// SHIPPED (P0.2, TARGET_80_LEDGER header): release_gate_outcome.status in {passed, warning}.
// run_outcome is phase-threshold-driven and may read "failed" on a shipped run — never use it.
//
// Usage:
//   node scripts/derive-ledger-panels.mjs                # all runs
//   node scripts/derive-ledger-panels.mjs --json         # machine-readable
//   node scripts/derive-ledger-panels.mjs --since 1784100000000
//   node scripts/derive-ledger-panels.mjs --expect-caps templateLeakageHits=7/20

import fs from "fs";
import path from "path";

const root = process.cwd();
const reportsDir = path.join(root, "apps", "api", "data", "reports");

const argv = process.argv.slice(2);
const hasFlag = (f) => argv.includes(f);
const flagValue = (f) => {
  const i = argv.indexOf(f);
  return i >= 0 ? argv[i + 1] : undefined;
};

// ── The cap taxonomy ─────────────────────────────────────────────────────────────────────────────
// caps_applied is free text emitted by rubric-score/hard-caps.ts as `${reason} → ${cat} ≤ ${max}`.
// Match on a stable fragment of each reason. Keep in sync with hard-caps.ts; an unmatched cap is
// surfaced loudly (see UNMATCHED below) rather than silently dropped — silent drops are what
// produced the original error.
const CAP_TAXONOMY = [
  ["mechanism explained too early", "mechanismExplainedTooEarly"],
  ["deductive-scaffold leakage (template", "scaffoldHits"],
  ["significant deductive-scaffold leakage", "scaffoldCeil65"],
  ["report-style clearance", "reportStyleClearance"],
  ["reveal uses evidence not planted", "revealUsesUnplantedEvidence"],
  ["prompt / template / validation-text leakage", "templateLeakageHits"],
  ["central clue stated as two flat values", "dualValueNoContrast"],
  ["pronoun", "pronounsUnstable"],
  ["victim unnamed", "victimUnnamed"],
  ["culprit = victim", "culpritIsVictim"],
  ["victim = investigator", "victimIsInvestigator"],
  ["culprit confesses to tampering", "culpritConfessesTamperingOnly"],
  ["no confession / exposure / arrest", "noResolution"],
  ["ending contradicts earlier", "endingContradictsEarlier"],
  ["malformed", "malformedEvidenceSurfacing"],
  ["weak murder method", "weakMurderMethod"],
  ["dead victim", "deadVictimAppearsAlive"],
  ["victim identity unclear", "victimIdentityUnclear"],
  ["multiple characters change roles", "multipleRoleChanges"],
];

const classifyCap = (text) => {
  const lowered = text.toLowerCase();
  for (const [frag, key] of CAP_TAXONOMY) if (lowered.includes(frag.toLowerCase())) return key;
  return null;
};

// ── Load ─────────────────────────────────────────────────────────────────────────────────────────
const loadReports = () => {
  if (!fs.existsSync(reportsDir)) {
    console.error(`FATAL: no reports dir at ${reportsDir}`);
    process.exit(1);
  }
  const out = [];
  for (const dir of fs.readdirSync(reportsDir)) {
    const full = path.join(reportsDir, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const file of fs.readdirSync(full)) {
      if (!file.endsWith(".json")) continue;
      try {
        const fp = path.join(full, file);
        const raw = JSON.parse(fs.readFileSync(fp, "utf8"));
        out.push({ file: fp, report: raw, mtimeMs: fs.statSync(fp).mtimeMs });
      } catch (err) {
        console.error(`WARN: unparsable report ${file}: ${String(err)}`);
      }
    }
  }
  return out;
};

const since = flagValue("--since") ? Number(flagValue("--since")) : 0;

// A report still being written by a live run is `in_progress: true` — identical on disk to one whose
// process died. The only honest discriminator is recency: a live run touches its report as each phase
// lands. Anything stale by more than this is dead. Deliberately generous — M1-6 (clock) legitimately
// took 72 min end-to-end, and a single Agent-9 chapter call can run several minutes.
const IN_FLIGHT_STALE_MS = 20 * 60 * 1000;
const now = Date.now();

const runs = loadReports()
  .map(({ file, report, mtimeMs }) => {
    const runId = report.run_id ?? path.basename(file, ".json");
    const epoch = Number(String(runId).replace(/\D/g, "")) || 0;
    const gate = report.release_gate_outcome?.status ?? null;
    const rubric = (report.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? null;
    const caps = rubric?.caps_applied ?? [];
    const fired = new Set();
    const unmatched = [];
    for (const c of caps) {
      const key = classifyCap(c);
      if (key) fired.add(key);
      else unmatched.push(c);
    }
    // Classification — the three states are NOT distinguishable by gate alone: a pipeline ABORT that
    // dies upstream (e.g. Agent 6.5) never reaches the release gate, so it carries the SAME
    // `status: "unknown"` as a machine interruption. Keying on the missing gate conflates them, and
    // the difference is load-bearing: an ABORT restarts the M1 count, an INTERRUPTION must never
    // (A_62 RC-5). The honest discriminator is `in_progress` + `run_outcome`:
    //   ABORT       -> in_progress: false, run_outcome: "aborted", run_outcome_reason: <why>
    //   INTERRUPTED -> in_progress: true,  run_outcome: "passed"  (stale/optimistic — the process
    //                  died before the field was finalised; trusting it would score a dead run)
    // The durable stamp (scripts/mark-interrupted-reports.mjs, A_62 RC-5) wins over the mtime
    // heuristic; the heuristic remains as the fallback for reports that died un-stamped.
    const stampedInterrupted = report.interrupted === true;
    const inFlight = !stampedInterrupted && report.in_progress === true && now - mtimeMs < IN_FLIGHT_STALE_MS;
    const interrupted = stampedInterrupted || (report.in_progress === true && !inFlight);
    const shipped = !interrupted && !inFlight && (gate === "passed" || gate === "warning");
    const aborted = !interrupted && !inFlight && !shipped;
    return {
      runId,
      epoch,
      gate,
      shipped,
      interrupted,
      inFlight,
      aborted,
      abortReason: aborted ? (report.run_outcome_reason ?? null) : null,
      rubricFinal: rubric?.final ?? null,
      rubricRaw: rubric?.raw_total ?? null,
      band: rubric?.band ?? null,
      categories: rubric?.categories ?? [],
      capCount: caps.length,
      fired: [...fired],
      unmatched,
      cost: report.total_cost ?? null,
      minutes: report.total_duration_ms ? Math.round(report.total_duration_ms / 60000) : null,
      hardStops: report.release_gate_outcome?.hard_stop_count ?? null,
      warnings: report.release_gate_outcome?.warning_count ?? null,
    };
  })
  .filter((r) => r.epoch >= since)
  .sort((a, b) => a.epoch - b.epoch);

const shipped = runs.filter((r) => r.shipped && r.rubricFinal !== null);

// ── Loud failure on an unrecognised cap ──────────────────────────────────────────────────────────
const allUnmatched = runs.flatMap((r) => r.unmatched.map((u) => `${r.runId}: ${u}`));
if (allUnmatched.length) {
  console.error("\n!!! UNMATCHED CAPS — CAP_TAXONOMY is out of sync with hard-caps.ts.");
  console.error("!!! These are NOT counted below. Add them to CAP_TAXONOMY before trusting any number.");
  for (const u of allUnmatched) console.error("    " + u);
  console.error("");
}

// ── Tally ────────────────────────────────────────────────────────────────────────────────────────
const tally = {};
for (const r of shipped) for (const k of r.fired) tally[k] = (tally[k] ?? 0) + 1;

const median = (xs) => {
  if (!xs.length) return null;
  const s = [...xs].sort((a, b) => a - b);
  return s.length % 2 ? s[(s.length - 1) / 2] : (s[s.length / 2 - 1] + s[s.length / 2]) / 2;
};

const catMark = (r, name) => r.categories.find((c) => c.category === name)?.mark ?? null;
const CATEGORIES = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose"];

const proseCapped4 = shipped.filter((r) =>
  (r.capCount ? true : false) && catMark(r, "prose") !== null && catMark(r, "prose") <= 4).length;

if (hasFlag("--json")) {
  console.log(JSON.stringify({ runs, shipped: shipped.length, tally, unmatched: allUnmatched }, null, 2));
  process.exit(allUnmatched.length ? 2 : 0);
}

// ── Panels ───────────────────────────────────────────────────────────────────────────────────────
console.log(`\n## Derived ${new Date().toISOString().slice(0, 10)} from ${runs.length} report(s) — ${shipped.length} shipped & scored\n`);

console.log("### §1 Run Log (derived columns)\n");
console.log("| Run | Gate | hard/warn | Rubric (raw) | Band | Cost | Min | Caps fired |");
console.log("|---|---|---|---|---|---|---|---|");
for (const r of runs) {
  const state = r.inFlight
    ? "⏳ IN FLIGHT"
    : r.shipped
      ? "**SHIPPED**"
      : r.interrupted
        ? "INTERRUPTED *(count safe)*"
        : "**ABORTED** *(restarts count)*";
  console.log(
    `| \`${r.runId}\` | ${state} (\`${r.gate ?? "—"}\`) | ${r.hardStops ?? "—"} / ${r.warnings ?? "—"} | ` +
    `${r.rubricFinal ?? "—"}${r.rubricRaw ? ` (${r.rubricRaw})` : ""} | ${r.band ?? "—"} | ` +
    `${r.cost !== null ? "£" + Number(r.cost).toFixed(2) : "—"} | ${r.minutes ?? "—"} | ` +
    `${r.fired.join(", ") || (r.abortReason ? "*" + r.abortReason.slice(0, 50) + "*" : "—")} |`,
  );
}

console.log("\n### §3 Cap Ledger (runs on which the cap fired — NOT cap instances)\n");
console.log("| Cap | Shipped freq |");
console.log("|---|---|");
for (const [k, v] of Object.entries(tally).sort((a, b) => b[1] - a[1])) {
  console.log(`| \`${k}\` | **${v}/${shipped.length}** |`);
}

console.log("\n### §4 Category Floor\n");
console.log("| Category | Target | Mean | Marks |");
console.log("|---|---|---|---|");
for (const cat of CATEGORIES) {
  const marks = shipped.map((r) => catMark(r, cat)).filter((m) => m !== null);
  const mean = marks.length ? (marks.reduce((a, b) => a + b, 0) / marks.length).toFixed(2) : "—";
  console.log(`| ${cat} | 8 | **${mean}** | ${marks.join(" ")} |`);
}

const finals = shipped.map((r) => r.rubricFinal);
console.log("\n### Headline\n");
console.log(`- shipped & scored: **${shipped.length}**`);
console.log(`- **aborted (each RESTARTS the M1 count): ${runs.filter((r) => r.aborted).length}**`);
for (const r of runs.filter((x) => x.aborted)) console.log(`    - \`${r.runId}\` — ${r.abortReason ?? "(no reason recorded)"}`);
console.log(`- interrupted — host/machine death, **never restarts the count** (A_62 RC-5): **${runs.filter((r) => r.interrupted).length}**`);
for (const r of runs.filter((x) => x.interrupted)) console.log(`    - \`${r.runId}\` — died after ${r.minutes ?? "?"} min, £${Number(r.cost ?? 0).toFixed(2)}`);
const live = runs.filter((r) => r.inFlight);
if (live.length) {
  console.log(`- ⏳ in flight (report touched < ${IN_FLIGHT_STALE_MS / 60000} min ago — not yet counted): **${live.length}**`);
  for (const r of live) console.log(`    - \`${r.runId}\``);
}
console.log(`- median shipped rubric: **${median(finals)}** (M2 bar ≥73)`);
console.log(`- runs firing ≥1 cap: **${shipped.filter((r) => r.capCount > 0).length}/${shipped.length}**`);
console.log(`- \`prose\` capped ≤4: **${proseCapped4}/${shipped.length}**`);

// ── Assertion mode: fail loudly if a claimed number is stale ─────────────────────────────────────
const expect = flagValue("--expect-caps");
if (expect) {
  const [key, frac] = expect.split("=");
  const [num, den] = (frac ?? "").split("/").map(Number);
  const actual = tally[key] ?? 0;
  const ok = actual === num && shipped.length === den;
  console.log(`\n--expect-caps ${expect} → actual ${actual}/${shipped.length} — ${ok ? "OK" : "MISMATCH"}`);
  if (!ok) process.exit(3);
}

process.exit(allUnmatched.length ? 2 : 0);
