// V2K-10 second half: of the v2 runs whose log carries gate warnings, how many would still read needs_review once
// report-only finding classes leave the warnings? Report-only = `clock_off_table` always, `register_sentence` under
// PROSE_V2_CONTRACT_FIXES (counted both ways, since the log does not say which flags ran). Every gate warning line in
// the log is read; the run log is one JSON per run and its WARNINGS sit inside a long line, hence a regex, not a parse.
// Usage: node needs-review.mjs
import fs from "node:fs";
const dirs = ["C:/CML/apps/worker/logs", "C:/CML/.claude/worktrees/a110-pair/apps/worker/logs"];
let runs = 0, stillStrict = 0, stillLoose = 0, onlyReportStrict = 0;
const rows = [];
for (const d of dirs) {
  if (!fs.existsSync(d)) continue;
  for (const f of fs.readdirSync(d).filter((x) => /^run_.*\.json$/.test(x))) {
    const text = fs.readFileSync(`${d}/${f}`, "utf8");
    const lines = [...new Set([...text.matchAll(/\[Agent 9 v2\] WARNING ([^"\\]{0,200})/g)].map((m) => m[1]))];
    if (lines.length === 0) continue;
    runs++;
    const cls = (l) => (/^([a-z_]+): \d+ unresolved/.exec(l) ?? [])[1];
    const notReportStrict = lines.filter((l) => cls(l) !== "clock_off_table");
    const notReportLoose = notReportStrict.filter((l) => cls(l) !== "register_sentence");
    if (notReportStrict.length > 0) stillStrict++;
    if (notReportLoose.length > 0) stillLoose++;
    if (notReportLoose.length === 0) onlyReportStrict++;
    rows.push(`${f.padEnd(32)} warnings ${String(lines.length).padStart(3)} | report-only: clock_off_table ${lines.filter((l) => cls(l) === "clock_off_table").length}, register_sentence ${lines.filter((l) => cls(l) === "register_sentence").length} | left after removing them ${notReportLoose.length}: ${notReportLoose.slice(0, 4).map((l) => l.slice(0, 40)).join(" ; ")}`);
  }
}
for (const r of rows) console.log(r);
console.log({ runsWithGateWarnings: runs, stillNeedsReview_clockOnlyReport: stillStrict, stillNeedsReview_clockAndRegisterReport: stillLoose, wouldReadPassed: onlyReportStrict });
