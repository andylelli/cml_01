#!/usr/bin/env node
// A_63 §7.2 verdict — AGENT9_REGEN_DUAL_VALUE fresh-run A/B.
// Acceptance (the P4-gate rule, pre-committed): dualValueNoContrast cap-frequency movement
// (treatment < control) WITHOUT completeness_structure or pronoun regressions.
// Judged on the cap's own detector (caps_applied fragment, same classifier as
// derive-ledger-panels.mjs) plus clues marks; guardrails: shipped-only (P0.2), incomplete pairs
// invalidate, missing metrics FAIL loudly, N≥4 before any verdict.
import fs from "fs";
import path from "path";

const root = "C:/CML";
const reportsDir = path.join(root, "apps", "api", "data", "reports");
const rows = fs.readFileSync(path.join(root, "scratchpad", "p5dv", "summary.tsv"), "utf8")
  .trim().split(/\r?\n/).slice(1).map((l) => {
    const [theme, arm, gate, runId] = l.split("\t");
    return { theme, arm, gate, runId };
  });

const DUAL_FRAG = "central clue stated as two flat values"; // derive-ledger-panels CAP_TAXONOMY
const ALL = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose"];

const runs = new Map();
for (const r of rows) {
  if (!["passed", "warning"].includes(r.gate)) continue;
  const p = path.join(reportsDir, r.runId, `${r.runId}.json`);
  if (!fs.existsSync(p)) { console.log(`MISSING REPORT: ${r.runId}`); continue; }
  const rep = JSON.parse(fs.readFileSync(p, "utf8"));
  const rubric = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? null;
  if (!rubric) { console.log(`FAIL: no rubric_score on ${r.runId}`); continue; }
  const caps = rubric.caps_applied ?? [];
  const marks = {};
  for (const c of ALL) marks[c] = rubric.categories?.find((x) => x.category === c)?.mark ?? null;

  // regression metrics: pronoun drift + completeness_structure gate failures across chapters
  let pronounDrift = null, completenessFails = null;
  for (const d of rep.diagnostics ?? []) {
    const det = d?.details ?? {};
    if (det.entity_pronoun_drift_count !== undefined) pronounDrift = det.entity_pronoun_drift_count;
    const recs = det.batch_commit_records;
    if (Array.isArray(recs)) {
      completenessFails = recs.reduce((n, rec) => {
        const g = (rec.gateOutcomes ?? []).find((x) => x.gate === "completeness_structure");
        return n + (g && !g.passed ? 1 : 0);
      }, 0);
    }
  }
  runs.set(`${r.theme}_${r.arm}`, {
    ...r, final: rubric.final ?? null, raw: rubric.raw_total ?? null,
    dualCap: caps.some((c) => c.toLowerCase().includes(DUAL_FRAG)),
    capCount: caps.length, marks, pronounDrift, completenessFails,
    cost: rep.total_cost ?? null,
  });
}

const themes = [...new Set(rows.map((r) => r.theme))];
const pairs = [];
for (const t of themes) {
  const off = runs.get(`${t}_off`), on = runs.get(`${t}_on`);
  if (!off || !on) { console.log(`INCOMPLETE PAIR (invalidated): ${t}`); continue; }
  pairs.push({ theme: t, off, on });
}
console.log(`\nComplete pairs: ${pairs.length}/${themes.length}` + (pairs.length < 4 ? "  ** N<4 — NO VERDICT MAY BE READ **" : ""));

console.log("\n| theme | arm | rubric (raw) | dualCap | clues | caps | pronounDrift | complFails | cost |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const p of pairs) for (const a of [p.off, p.on]) {
  console.log(`| ${p.theme} | ${a.arm} | ${a.final} (${a.raw}) | ${a.dualCap ? "FIRED" : "—"} | ${a.marks.clues} | ${a.capCount} | ${a.pronounDrift ?? "MISSING"} | ${a.completenessFails ?? "MISSING"} | $${a.cost?.toFixed?.(2) ?? a.cost} |`);
}

if (pairs.length >= 4) {
  const offFired = pairs.filter((p) => p.off.dualCap).length;
  const onFired = pairs.filter((p) => p.on.dualCap).length;
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const missing = pairs.some((p) => p.off.pronounDrift === null || p.on.pronounDrift === null
    || p.off.completenessFails === null || p.on.completenessFails === null);
  console.log(`\nDual-value cap fired: control ${offFired}/${pairs.length} → treatment ${onFired}/${pairs.length}`);
  console.log(`clues mean: ${mean(pairs.map((p) => p.off.marks.clues)).toFixed(2)} → ${mean(pairs.map((p) => p.on.marks.clues)).toFixed(2)}`);
  console.log(`pronoun drift mean: ${missing ? "METRIC MISSING — FAIL" : mean(pairs.map((p) => p.off.pronounDrift)).toFixed(1) + " → " + mean(pairs.map((p) => p.on.pronounDrift)).toFixed(1)}`);
  console.log(`completeness_structure chapter-failures mean: ${missing ? "METRIC MISSING — FAIL" : mean(pairs.map((p) => p.off.completenessFails)).toFixed(1) + " → " + mean(pairs.map((p) => p.on.completenessFails)).toFixed(1)}`);
  console.log(`rubric total mean: ${mean(pairs.map((p) => p.off.final)).toFixed(1)} → ${mean(pairs.map((p) => p.on.final)).toFixed(1)}`);
  if (!missing) {
    const capMoved = onFired < offFired;
    const pronounOk = mean(pairs.map((p) => p.on.pronounDrift)) <= mean(pairs.map((p) => p.off.pronounDrift)) * 1.25;
    const complOk = mean(pairs.map((p) => p.on.completenessFails)) <= mean(pairs.map((p) => p.off.completenessFails));
    console.log(`\nAUTO-VERDICT (strict): ${capMoved && pronounOk && complOk ? "FLIP (cap moved, no regressions)" : capMoved ? "CAP MOVED BUT REGRESSION CHECK FAILED — read the table" : "NO FLIP (no cap movement measured)"} — read with the per-pair table, never alone.`);
  }
}
