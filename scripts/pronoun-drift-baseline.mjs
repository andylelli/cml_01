// A_71 (A_70 §6) — derive the entity_pronoun_drift_count panel across the corpus.
//
//   node scripts/pronoun-drift-baseline.mjs
//
// WHY THIS EXISTS. A_70 measured `entity_pronoun_drift_count: 19` on the 07-27 run and wrote,
// correctly: "UNBASELINED … deserves a comparison against the 07-24 runs before anyone calls it a
// regression. I am NOT calling it one." This script supplies the comparison so the next person does
// not have to hand-tally it — and, more importantly, marks the one boundary that makes a naive
// comparison wrong.
//
// THE BOUNDARY. `c1c686a5` (2026-07-23, A_66) rewrote the pronoun validator: parity-obeys-policy,
// the positional rule, and the high-precision guard all landed together. The S0 baseline runs
// predate it. So S0's zeros and today's counts ARE NOT THE SAME MEASUREMENT, and a rise across that
// line is not evidence of worse prose. Runs are grouped by which side they fall on; only
// within-group comparisons mean anything.
//
// WHAT THE NUMBER IS. Residual `pronoun_drift` + `pronoun_gender_mismatch` validation errors
// surviving every deterministic repair (agent9-run.ts `residualPronounIssues`) — what SHIPPED, not
// what was fixed. Zero is the target.
//
// Pure read-only. Never trust a report without checking `in_progress`/`stale` first
// (A_70 §4) — partials are labelled, not scored.

import fs from "fs";
import path from "path";

const VALIDATOR_CHANGE = { commit: "c1c686a5", date: "2026-07-23", label: "A_66 pronoun validator rewrite" };

const REPORTS_DIR = path.join("apps", "api", "data", "reports");
const RESULTS_DIR = "results";

const rows = [];

// ── Reports on disk ──────────────────────────────────────────────────────────────────────────────
if (fs.existsSync(REPORTS_DIR)) {
  for (const dir of fs.readdirSync(REPORTS_DIR)) {
    const full = path.join(REPORTS_DIR, dir);
    if (!fs.statSync(full).isDirectory()) continue;
    for (const file of fs.readdirSync(full).filter((f) => f.endsWith(".json"))) {
      let report;
      try {
        report = JSON.parse(fs.readFileSync(path.join(full, file), "utf8"));
      } catch {
        continue;
      }
      const partial =
        report.in_progress === true || report.stale === true || report.incomplete === true;
      const diagnostic = (report.diagnostics ?? []).find(
        (d) => d?.details?.entity_pronoun_drift_count !== undefined,
      );
      rows.push({
        source: dir,
        when: String(report.generated_at ?? "").slice(0, 10),
        count: diagnostic ? diagnostic.details.entity_pronoun_drift_count : null,
        partial,
        note: partial ? "PARTIAL SNAPSHOT — not a run result" : "",
      });
    }
  }
}

// ── Canary logs (the S0 batch and any later console runs) ────────────────────────────────────────
const walkLogs = (dir) => {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkLogs(full);
    } else if (entry.name.endsWith(".log")) {
      const text = fs.readFileSync(full, "utf8");
      const match = text.match(/CANARY_ENTITY_PRONOUN_DRIFT_COUNT\s+(\d+)/);
      if (!match) continue;
      rows.push({
        source: path.relative(RESULTS_DIR, full),
        when: fs.statSync(full).mtime.toISOString().slice(0, 10),
        count: Number(match[1]),
        partial: false,
        note: "canary log",
      });
    }
  }
};
walkLogs(RESULTS_DIR);

rows.sort((a, b) => String(a.when).localeCompare(String(b.when)));

const before = rows.filter((r) => r.count !== null && !r.partial && r.when < VALIDATOR_CHANGE.date);
const after = rows.filter((r) => r.count !== null && !r.partial && r.when >= VALIDATOR_CHANGE.date);

const stats = (group) => {
  if (group.length === 0) return "no runs";
  const counts = group.map((r) => r.count).sort((a, b) => a - b);
  const mean = counts.reduce((s, c) => s + c, 0) / counts.length;
  const median = counts[Math.floor(counts.length / 2)];
  return `n=${counts.length} mean=${mean.toFixed(1)} median=${median} min=${counts[0]} max=${counts[counts.length - 1]} [${counts.join(", ")}]`;
};

console.log("entity_pronoun_drift_count — residual pronoun errors in SHIPPED prose (target: 0)\n");
for (const row of rows) {
  const side = row.when < VALIDATOR_CHANGE.date ? "pre " : "post";
  console.log(
    `  ${String(row.when).padEnd(11)} ${side}  ${String(row.count ?? "-").padStart(4)}  ${row.source}${row.note ? `  (${row.note})` : ""}`,
  );
}

console.log(`\n  ── boundary: ${VALIDATOR_CHANGE.commit} ${VALIDATOR_CHANGE.date} — ${VALIDATOR_CHANGE.label} ──`);
console.log(`  pre  ${VALIDATOR_CHANGE.date}: ${stats(before)}`);
console.log(`  post ${VALIDATOR_CHANGE.date}: ${stats(after)}`);
console.log(
  "\n  Compare WITHIN a group only. The detector changed at the boundary, so a rise across it is\n" +
    "  not evidence of worse prose — it may be evidence of a validator that now sees more.",
);
