#!/usr/bin/env node
// P5.1 verdict — AGENT9_CRITIQUE_REWRITE fresh-run A/B (A_62 ROAD TO 80 §4).
// Reads pairs from scratchpad/p5cr/summary.tsv, marks from the run reports
// (diagnostics[key=rubric_score].details — same paths as derive-ledger-panels.mjs).
// Acceptance: opening_hook/dialogue/pacing mean +1 (treatment−control) with nothing regressed.
// Guardrails honoured: raw detector/category numbers, never grade bands; incomplete pairs
// invalidate; missing metrics FAIL rather than false-pass; chapter counts reported (K2 confound).
import fs from "fs";
import path from "path";

const root = "C:/CML";
const reportsDir = path.join(root, "apps", "api", "data", "reports");
const rows = fs.readFileSync(path.join(root, "scratchpad", "p5cr", "summary.tsv"), "utf8")
  .trim().split(/\r?\n/).slice(1).map((l) => {
    const [theme, arm, gate, runId] = l.split("\t");
    return { theme, arm, gate, runId };
  });

const loadReport = (runId) => {
  const p = path.join(reportsDir, runId, `${runId}.json`);
  if (!fs.existsSync(p)) return null;
  return JSON.parse(fs.readFileSync(p, "utf8"));
};

const TARGETS = ["opening_hook", "dialogue", "pacing"];
const ALL = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose"];

const runs = new Map();
for (const r of rows) {
  if (!["passed", "warning"].includes(r.gate)) continue; // shipped only (P0.2)
  const rep = loadReport(r.runId);
  if (!rep) { console.log(`MISSING REPORT: ${r.runId} (${r.theme}_${r.arm})`); continue; }
  const rubric = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? null;
  if (!rubric) { console.log(`FAIL: no rubric_score diagnostics on ${r.runId}`); continue; }
  const marks = {};
  for (const c of ALL) marks[c] = rubric.categories?.find((x) => x.category === c)?.mark ?? null;
  const chapters = rep.diagnostics?.find((d) => d.key === "rubric_score")?.details?.chapter_count
    ?? (rep.summary?.chapter_count ?? null);
  runs.set(`${r.theme}_${r.arm}`, {
    ...r, final: rubric.final ?? null, raw: rubric.raw_total ?? null,
    caps: rubric.caps_applied ?? [], marks, chapters,
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

console.log("\n| theme | arm | rubric (raw) | oh | dlg | pace | caps | cost |");
console.log("|---|---|---|---|---|---|---|---|");
for (const p of pairs) for (const a of [p.off, p.on]) {
  console.log(`| ${p.theme} | ${a.arm} | ${a.final} (${a.raw}) | ${a.marks.opening_hook} | ${a.marks.dialogue} | ${a.marks.pacing} | ${a.caps.length} | $${a.cost?.toFixed?.(2) ?? a.cost} |`);
}

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
console.log("\n### Per-category means (control → treatment, Δ)");
let anyMissing = false;
for (const c of ALL) {
  const offs = pairs.map((p) => p.off.marks[c]), ons = pairs.map((p) => p.on.marks[c]);
  if (offs.some((x) => x === null) || ons.some((x) => x === null)) { console.log(`| ${c} | METRIC MISSING — FAIL`); anyMissing = true; continue; }
  const d = mean(ons) - mean(offs);
  const tag = TARGETS.includes(c) ? " ← target" : "";
  console.log(`| ${c} | ${mean(offs).toFixed(2)} → ${mean(ons).toFixed(2)} | Δ ${d >= 0 ? "+" : ""}${d.toFixed(2)}${tag}`);
}

if (pairs.length >= 4 && !anyMissing) {
  const deltas = Object.fromEntries(ALL.map((c) => [c,
    mean(pairs.map((p) => p.on.marks[c])) - mean(pairs.map((p) => p.off.marks[c]))]));
  const targetsPass = TARGETS.filter((c) => deltas[c] >= 1);
  const regressed = ALL.filter((c) => deltas[c] <= -0.5);
  const offTotal = mean(pairs.map((p) => p.off.final)), onTotal = mean(pairs.map((p) => p.on.final));
  console.log(`\nRubric total: ${offTotal.toFixed(1)} → ${onTotal.toFixed(1)} (Δ ${(onTotal - offTotal).toFixed(1)})`);
  console.log(`Targets at +1: ${targetsPass.length ? targetsPass.join(", ") : "NONE"}`);
  console.log(`Regressions ≤ −0.5: ${regressed.length ? regressed.join(", ") : "none"}`);
  console.log(`\nAUTO-VERDICT (strict): ${targetsPass.length > 0 && regressed.length === 0 ? "PASS on " + targetsPass.join("/") : "FAIL"} — read with the per-pair table, never alone.`);
}
