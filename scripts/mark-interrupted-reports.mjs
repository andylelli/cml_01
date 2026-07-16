#!/usr/bin/env node
// A_62 RC-5 — stamp dead `in_progress` reports as INTERRUPTED so the distinction that decides
// whether the M1 count restarts is durable data, not repeated hand-forensics.
//
// WHY: a report whose process died (host standby, battery, hand-kill, RC-6 hang) is frozen at
// `in_progress: true` with a stale `run_outcome: "passed"` — on disk it is INDISTINGUISHABLE from a
// live run except by mtime, and dangerously close to an ABORT (which restarts the count) except by
// `run_outcome`. Four runs needed manual event-log forensics to classify. This stamps the verdict
// once, at the artifact.
//
// Stamps (adds fields, never rewrites history):
//   interrupted: true
//   interrupted_reason: "..."
//   interrupted_stamped_at: ISO
// A live run is protected by the mtime guard: only reports untouched for STALE_MS are stamped.
//
// Run at chain start (before launching run 1) and any time by hand. Idempotent.
// Usage: node scripts/mark-interrupted-reports.mjs [--dry]

import fs from "fs";
import path from "path";

const root = process.cwd();
const reportsDir = path.join(root, "apps", "api", "data", "reports");
const DRY = process.argv.includes("--dry");

// Generous on purpose: report mtime only advances per completed phase, and a single healthy Agent-9
// chapter phase can run many minutes (M1-6 clock took 72 min end-to-end). A live run's report will
// never be 30+ min stale; a dead one always will be.
const STALE_MS = 30 * 60 * 1000;

if (!fs.existsSync(reportsDir)) {
  console.error(`FATAL: no reports dir at ${reportsDir}`);
  process.exit(1);
}

let scanned = 0, stamped = 0, alreadyStamped = 0, live = 0;
for (const dir of fs.readdirSync(reportsDir)) {
  const full = path.join(reportsDir, dir);
  if (!fs.statSync(full).isDirectory()) continue;
  for (const file of fs.readdirSync(full)) {
    if (!file.endsWith(".json")) continue;
    const fp = path.join(full, file);
    scanned++;
    let report;
    try {
      report = JSON.parse(fs.readFileSync(fp, "utf8"));
    } catch {
      console.error(`WARN: unparsable ${file} — skipped`);
      continue;
    }
    if (report.in_progress !== true) continue;
    if (report.interrupted === true) { alreadyStamped++; continue; }

    const ageMs = Date.now() - fs.statSync(fp).mtimeMs;
    if (ageMs < STALE_MS) {
      live++;
      console.log(`LIVE (skipped): ${report.run_id ?? file} — report touched ${Math.round(ageMs / 60000)} min ago`);
      continue;
    }

    const phases = Array.isArray(report.phases) ? report.phases.length : 0;
    const reason =
      `process/host death mid-run: in_progress report went ${Math.round(ageMs / 3600000)}h stale ` +
      `(${phases} phases completed; run_outcome "${report.run_outcome}" is the pre-death optimistic value — ` +
      `do not trust it). INTERRUPTED, not ABORTED: never restarts the M1 count (A_62 RC-5).`;

    if (DRY) {
      console.log(`WOULD STAMP: ${report.run_id ?? file} — ${reason}`);
      stamped++;
      continue;
    }
    report.interrupted = true;
    report.interrupted_reason = reason;
    report.interrupted_stamped_at = new Date().toISOString();
    fs.writeFileSync(fp, JSON.stringify(report, null, 2));
    console.log(`STAMPED: ${report.run_id ?? file}`);
    stamped++;
  }
}
console.log(`\nscanned ${scanned} | ${DRY ? "would stamp" : "stamped"} ${stamped} | already stamped ${alreadyStamped} | live skipped ${live}`);
