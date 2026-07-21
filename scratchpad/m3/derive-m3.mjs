#!/usr/bin/env node
// M3 derive (A_63 §6 acceptance, internal half) — derived from artifacts, never hand-extended.
// Internal criteria: ship rate 100% · reliability rows 0 · top-4 caps 0 · category floor mean ≥ 8.0.
// The external half (mean ≥ 80, |int−ext| ≤ 3) comes from the owner's manual reads (read-packet.md).
import fs from "fs";
import path from "path";

const root = "C:/CML";
const out = path.join(root, "scratchpad", "m3");
const rows = fs.readFileSync(path.join(out, "summary.tsv"), "utf8")
  .trim().split(/\r?\n/).slice(1).map((l) => {
    const [theme, gate, runId] = l.split("\t");
    return { theme, gate, runId };
  });

const CATS = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose"];
const TOP4 = [/deductive-scaffold/i, /two flat values/i, /report-style/i, /template|leakage/i];

const perRun = [];
for (const r of rows) {
  if (!r.runId || r.runId === "none") { perRun.push({ ...r, error: "no runId" }); continue; }
  const p = path.join(root, "apps/api/data/reports", r.runId, `${r.runId}.json`);
  const rep = JSON.parse(fs.readFileSync(p, "utf8"));
  const rub = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? {};
  const warnDiag = (rep.diagnostics ?? []).find((d) => d.key === "run_warnings")?.details ?? {};
  const caps = rub.caps_applied ?? [];
  const marks = {};
  for (const c of rub.categories ?? []) marks[c.category] = c.mark;
  // reliability rows: injector floors, ship-check floors/residuals, unresolved regens that predict caps
  const reliability = (warnDiag.warnings ?? []).filter((w) =>
    /SHIP-CHECK floored|SHIP-CHECK residual|UNRESOLVED|injector floor applies|FLOORED/i.test(String(w)));
  const storyLog = fs.readFileSync(path.join(out, `m3_${r.theme}.log`), "utf8");
  const story = (storyLog.match(/^STORY_SAVED (.+)$/m) ?? [])[1]?.trim();
  perRun.push({
    theme: r.theme, runId: r.runId, gate: r.gate, final: rub.final, raw: rub.raw_total,
    caps, top4: caps.filter((c) => TOP4.some((re) => re.test(c))), marks, reliability, story,
  });
}

console.log("=== M3 INTERNAL DERIVE ===\n");
for (const r of perRun) {
  console.log(`${r.theme.padEnd(9)} ${r.runId}  gate=${r.gate}  final=${r.final} raw=${r.raw}`);
  console.log(`  caps: ${r.caps?.length ? r.caps.join(" | ") : "NONE"}`);
  if (r.reliability?.length) for (const w of r.reliability) console.log(`  RELIABILITY: ${String(w).slice(0, 140)}`);
  console.log(`  story: ${r.story}`);
}

const shipped = perRun.filter((r) => ["passed", "warning"].includes(r.gate));
const finals = perRun.map((r) => r.final).filter((x) => typeof x === "number").sort((a, b) => a - b);
const median = finals.length ? (finals[Math.floor((finals.length - 1) / 2)] + finals[Math.ceil((finals.length - 1) / 2)]) / 2 : null;
const catMeans = {};
for (const c of CATS) {
  const v = perRun.map((r) => r.marks?.[c]).filter((x) => typeof x === "number");
  catMeans[c] = v.length ? +(v.reduce((a, b) => a + b, 0) / v.length).toFixed(2) : null;
}
const floorMean = +(Object.values(catMeans).reduce((a, b) => a + b, 0) / CATS.length).toFixed(2);

console.log("\n=== CRITERIA (internal half) ===");
console.log(`ship rate:        ${shipped.length}/${perRun.length}  ${shipped.length === perRun.length ? "✅" : "❌"}`);
const reliabilityTotal = perRun.reduce((a, r) => a + (r.reliability?.length ?? 0), 0);
console.log(`reliability rows: ${reliabilityTotal}  ${reliabilityTotal === 0 ? "✅" : "❌"}`);
const top4Total = perRun.reduce((a, r) => a + (r.top4?.length ?? 0), 0);
console.log(`top-4 caps:       ${top4Total}  ${top4Total === 0 ? "✅" : "❌"}`);
console.log(`category means:   ${JSON.stringify(catMeans)}`);
console.log(`category floor mean: ${floorMean}  ${floorMean >= 8 ? "✅ ≥8.0" : "❌ <8.0"}`);
console.log(`internal median:  ${median} (mean ${(finals.reduce((a, b) => a + b, 0) / finals.length).toFixed(1)})`);
console.log(`\nEXTERNAL half: owner reads each story (read-packet.md), records marks; then |int−ext| ≤ 3 and ext mean ≥ 80 decide M3.`);
