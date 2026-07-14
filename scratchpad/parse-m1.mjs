// Parse the M1 batch reports into the ship-rate ledger (roadmap S5 gate). For each runId in
// scratchpad/m1/summary.tsv, load its report JSON and extract run_outcome + release-gate + (if present)
// the 10-category rubric. Ship-rate = fraction with run_outcome in {passed}. Also surfaces any abort reason.
import fs from "fs";
import path from "path";
import { glob } from "fs";

const root = process.cwd();
const summaryPath = path.join(root, "scratchpad/m1/summary.tsv");
const reportsDir = path.join(root, "apps/api/data/reports");

const RUBRIC_CATS = [
  "premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose",
];

function findReport(runId) {
  // canary: projectId === runId; report at reports/<projectId>/<projectId>.json
  const direct = path.join(reportsDir, runId, `${runId}.json`);
  if (fs.existsSync(direct)) return direct;
  // fallback: any json under a dir containing the runId
  for (const d of fs.readdirSync(reportsDir)) {
    if (!d.includes(runId)) continue;
    const dir = path.join(reportsDir, d);
    const files = fs.readdirSync(dir).filter((f) => f.endsWith(".json"));
    if (files.length) return path.join(dir, files[0]);
  }
  return null;
}

// Deep-search an object for a node holding all/most rubric categories with numeric marks.
function findRubric(obj, depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 8) return null;
  const keys = Object.keys(obj);
  const hit = RUBRIC_CATS.filter((c) => keys.includes(c));
  if (hit.length >= 6) {
    const marks = {};
    for (const c of RUBRIC_CATS) {
      const v = obj[c];
      marks[c] = typeof v === "number" ? v : (v && typeof v.score === "number" ? v.score : (v && typeof v.mark === "number" ? v.mark : null));
    }
    return marks;
  }
  for (const k of keys) {
    const r = findRubric(obj[k], depth + 1);
    if (r) return r;
  }
  return null;
}

function findCaps(obj, acc = new Set(), depth = 0) {
  if (!obj || typeof obj !== "object" || depth > 8) return acc;
  for (const [k, v] of Object.entries(obj)) {
    if (/cap|ceiling|clamp/i.test(k) && (v === true || (typeof v === "number" && v > 0) || (typeof v === "string" && v))) acc.add(`${k}=${v}`);
    if (v && typeof v === "object") findCaps(v, acc, depth + 1);
  }
  return acc;
}

const rows = [];
const lines = fs.readFileSync(summaryPath, "utf8").trim().split("\n").slice(1);
for (const line of lines) {
  const [theme, status, runId] = line.split("\t");
  const rep = runId && runId !== "none" ? findReport(runId) : null;
  if (!rep) { rows.push({ theme, status, runId, outcome: "NO_REPORT" }); continue; }
  const d = JSON.parse(fs.readFileSync(rep, "utf8"));
  const rubric = findRubric(d);
  const caps = [...findCaps(d)];
  rows.push({
    theme, status, runId,
    outcome: d.run_outcome ?? "?",
    score: d.overall_score ?? null,
    grade: d.overall_grade ?? null,
    gate: d.release_gate_outcome?.status ?? "?",
    hardStops: d.release_gate_outcome?.hard_stop_count ?? null,
    warnings: d.release_gate_outcome?.warning_count ?? null,
    rubricMean: rubric ? +(Object.values(rubric).filter((n) => typeof n === "number").reduce((a, b) => a + b, 0) / Object.values(rubric).filter((n) => typeof n === "number").length).toFixed(1) : null,
    caps: caps.length ? caps.join(",") : "",
  });
}

console.log("\n=== M1 SHIP-RATE LEDGER ===");
console.table(rows);
const shipped = rows.filter((r) => r.outcome === "passed").length;
console.log(`\nShip-rate: ${shipped}/${rows.length} passed (${Math.round((shipped / rows.length) * 100)}%)  [M1 exit = 100%]`);
const aborts = rows.filter((r) => r.outcome && !["passed", "?"].includes(r.outcome));
if (aborts.length) {
  console.log("\nNon-shipping runs:");
  for (const a of aborts) console.log(`  ${a.theme} (${a.runId}): ${a.outcome} gate=${a.gate} hardStops=${a.hardStops}`);
}
