#!/usr/bin/env node
/**
 * B1 — would a BLOCKING geometry gate have shipped the books we actually like?
 *
 * ── THE QUESTION, OPEN ACROSS SIX DOCUMENTS ──────────────────────────────────────────────────────
 *
 * Geometry sees most of what the external reader complains about and ships anyway: five of seven
 * complaints on the 08-26 run were already in the run's own log (ANALYSIS_74 §9.4). The standing
 * proposal is to give it authority — let it stop a run rather than warn.
 *
 * PLAN-TO-90 §10.2 said the prerequisite is a replay: *"would the 86-scoring runs have shipped under
 * a blocking gate?"* This is that replay, and it is deliberately a SCRIPT rather than a one-off
 * measurement, because the answer should change as the repair passes improve. A decision recorded once
 * and never re-measured is how this project ends up with a rule nobody can re-derive.
 *
 * ── WHAT IT READS ────────────────────────────────────────────────────────────────────────────────
 *
 * Archived reports carry geometry findings as `geometry <code> (chN)` lines in their warnings. The
 * external-read ledger carries the human mark. Joining them on the novelty ledger's run-id → title map
 * is the only route: reports record no story path.
 *
 * **A report with no `geometry` mention at all is EXCLUDED, not counted as clean.** Two archived runs
 * predate geometry being wired, and counting their silence as a pass produced a first version of this
 * analysis claiming that warned books score HIGHER than clean ones. They were not clean; they were
 * unmeasured. That distinction inverts the finding, which is why the exclusion is explicit here.
 *
 *   node scripts/geometry-gate-replay.mjs
 */

import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const readJson = (p) => JSON.parse(readFileSync(p, "utf8"));

// ── inputs ───────────────────────────────────────────────────────────────────

const ledgerPath = join(ROOT, "data", "novelty-ledger.json");
const titleByRun = new Map();
if (existsSync(ledgerPath)) {
  for (const r of readJson(ledgerPath).shipped ?? []) if (r?.id) titleByRun.set(r.id, String(r.title ?? ""));
}

const reads = [];
const manifest = join(ROOT, "eval", "results", "external-read", "manifest.json");
if (existsSync(manifest)) {
  for (const e of readJson(manifest)) {
    const p = e?.storyPath && join(ROOT, e.storyPath);
    if (!p || !existsSync(p) || e.externalFinal == null) continue;
    const heading = readFileSync(p, "utf8").split("\n")[0].replace(/^#+\s*/, "").trim();
    reads.push({ heading, mark: e.externalFinal, bundle: e.bundleId });
  }
}

const reportsDir = join(ROOT, "apps", "api", "data", "reports");
const rows = [];
let ranGeometry = 0;
let warned = 0;
const cleanRuns = [];

if (existsSync(reportsDir)) {
  for (const proj of readdirSync(reportsDir)) {
    const dir = join(reportsDir, proj);
    for (const file of (existsSync(dir) ? readdirSync(dir) : [])) {
      if (!file.endsWith(".json")) continue;
      let report;
      try { report = readJson(join(dir, file)); } catch { continue; }
      const blob = JSON.stringify(report);
      // The exclusion that matters — see the header.
      if (!blob.includes("geometry")) continue;
      ranGeometry += 1;
      const codes = [...new Set([...blob.matchAll(/geometry ([a-z_]+) \(ch\d+\)/g)].map((m) => m[1]))].sort();
      if (codes.length > 0) warned += 1; else cleanRuns.push(report.run_id);

      const title = titleByRun.get(report.run_id) ?? "";
      const read = title
        ? reads.find((r) => (r.heading && title.slice(0, 26) && r.heading.includes(title.slice(0, 26)))
            || (title.includes(r.heading.slice(0, 26))))
        : undefined;
      if (read) rows.push({ mark: read.mark, title: title.slice(0, 34), codes });
    }
  }
}

// ── report ───────────────────────────────────────────────────────────────────

const pct = (n, d) => (d ? `${Math.round((100 * n) / d)}%` : "n/a");

console.log(`\n  B1 — geometry gate replay over the archive\n`);
console.log(`  reports where geometry actually RAN : ${ranGeometry}`);
console.log(`     raised at least one finding      : ${warned}  (${pct(warned, ranGeometry)})`);
console.log(`     geometry-clean                   : ${cleanRuns.length}`);
console.log(`  (reports with no geometry at all are EXCLUDED as unmeasured, never counted as clean)\n`);

rows.sort((a, b) => b.mark - a.mark);
if (rows.length === 0) {
  console.log("  no run has BOTH a geometry-bearing report and an external read — nothing to conclude.\n");
} else {
  console.log(`  runs with BOTH geometry and an external read: ${rows.length}\n`);
  console.log(`  mark  manuscript                            findings a blocking gate would have stopped on`);
  console.log(`  ${"-".repeat(96)}`);
  for (const r of rows) {
    console.log(`  ${String(r.mark).padStart(4)}  ${r.title.padEnd(36)}  ${r.codes.join(", ") || "(none)"}`);
  }
  const wouldStop = rows.filter((r) => r.codes.length > 0);
  console.log(`  ${"-".repeat(96)}`);
  console.log(`\n  a blocking gate would have ABORTED ${wouldStop.length} of ${rows.length} externally-read manuscripts` +
    `${wouldStop.length ? `, including the best at ${Math.max(...wouldStop.map((r) => r.mark))}/100` : ""}.`);
  const cleanRead = rows.filter((r) => r.codes.length === 0);
  console.log(`  geometry-clean manuscripts that have been READ: ${cleanRead.length}` +
    `${cleanRead.length === 0 ? "  <- so there is NO evidence that passing geometry predicts a good read" : ""}\n`);
}
