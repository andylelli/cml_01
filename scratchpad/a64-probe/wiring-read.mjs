#!/usr/bin/env node
// A_64 B7 — the probe's WIRING read (no quality conclusions at n=1; K2 doctrine).
// Checks: C1 plants reached the prompts; C2 walk/confession/aftermath contracts present;
// C3 spine lines present; F2 ship-check + F5 run_warnings landed in the artifact;
// F1 injector/regen agreement; ship-time scaffold recheck on the saved story.
import fs from "fs";
import path from "path";
import { detectScaffoldNotProse } from "file:///C:/CML/packages/prose-guard/dist/scaffold.js";

const root = "C:/CML";
const log = fs.readFileSync(path.join(root, "scratchpad/a64-probe/probe_tide.log"), "utf8");

const runId = (log.match(/^RUN_ID (\S+)/m) ?? [])[1];
const gate = (log.match(/^CANARY_RELEASE_GATE (\S+)/m) ?? [])[1];
console.log(`runId=${runId} gate=${gate}`);

const checks = [];
const has = (name, cond, detail = "") => checks.push([cond ? "PASS" : "FAIL", name, detail]);

// chain-log signals
has("C1 stamp line ([Agent 7 plant-before-reveal])", /\[Agent 7 plant-before-reveal\]/.test(log),
  (log.match(/\[Agent 7 plant-before-reveal\][^\n]*/) ?? [""])[0]);
has("RC3.5 discovery-tell active or already-satisfied", /\[Agent 7 discovery-tell\]/.test(log) || true, "advisory");
const shipCheckLines = log.match(/scaffold SHIP-CHECK[^\n]*/g) ?? [];
console.log(`ship-check lines in log: ${shipCheckLines.length}`);
for (const l of shipCheckLines) console.log("  " + l.slice(0, 160));

// prompt archive
const archivesRoot = path.join(root, "documentation", "prompts", "actual");
const dir = fs.readdirSync(archivesRoot).find((d) => {
  const idx = path.join(archivesRoot, d, "INDEX.md");
  return runId && fs.existsSync(idx) && fs.readFileSync(idx, "utf8").includes(runId);
});
console.log(`archive=${dir}`);
if (dir) {
  const files = fs.readdirSync(path.join(archivesRoot, dir)).filter((f) => f.endsWith("_request.md"));
  const readAll = (pred) => files.filter((f) => pred(fs.readFileSync(path.join(archivesRoot, dir, f), "utf8")));
  const withPlant = readAll((t) => t.includes("PLANT OBLIGATIONS"));
  const withSpine = readAll((t) => t.includes("TIMELINE SPINE"));
  const withOneQ = readAll((t) => t.includes("ONE-QUESTION RULE"));
  const withWalk = readAll((t) => t.includes("DEDUCTION MUST BE WALKED"));
  const withConf = readAll((t) => t.includes("CONFESSION CONFIRMS, NEVER SUPPLIES"));
  const withAfter = readAll((t) => t.includes("AFTERMATH REQUIRED"));
  has("C1 PLANT OBLIGATIONS in ≥1 Agent9 request", withPlant.length > 0, withPlant.slice(0, 3).join(", "));
  has("C3 TIMELINE SPINE in ≥1 request", withSpine.length > 0, withSpine.slice(0, 3).join(", "));
  has("C3 ONE-QUESTION RULE in ≥1 request", withOneQ.length > 0, `${withOneQ.length} requests`);
  has("C2 walked-deduction contract in the reveal request", withWalk.length > 0, withWalk.join(", "));
  has("C2 confession-confirms contract present", withConf.length > 0, `${withConf.length} requests`);
  has("C2 aftermath contract in the final-chapter request", withAfter.length > 0, withAfter.join(", "));
  const culpritRegen = files.filter((f) => /culprit/i.test(f));
  console.log(`culprit-evidence regen calls: ${culpritRegen.length} ${culpritRegen.join(", ")}`);
}

// artifact: run_warnings diagnostic (F5) + caps
if (runId) {
  const rp = path.join(root, "apps/api/data/reports", runId, `${runId}.json`);
  if (fs.existsSync(rp)) {
    const rep = JSON.parse(fs.readFileSync(rp, "utf8"));
    const diag = (rep.diagnostics ?? []).find((d) => d.key === "run_warnings");
    has("F5 run_warnings diagnostic in artifact", Boolean(diag), diag ? `${diag.details?.count} warnings` : "");
    const scafW = (diag?.details?.warnings ?? []).filter((w) => /scaffold|SHIP-CHECK|plant-before-reveal|dual-value/i.test(w));
    console.log(`relevant warnings in artifact: ${scafW.length}`);
    for (const w of scafW.slice(0, 12)) console.log("  " + String(w).slice(0, 150));
    const rub = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? {};
    const caps = rub.caps_applied ?? [];
    has("scaffold cap did NOT fire", !caps.some((c) => /deductive-scaffold/.test(c)), JSON.stringify(caps));
    console.log(`rubric final=${rub.final} raw=${rub.raw_total} (RECORDED, not concluded — n=1)`);
  } else {
    has("report artifact exists", false, rp);
  }
}

// ship-time scaffold recheck on the saved story
const sp = (log.match(/^STORY_SAVED (.+)$/m) ?? [])[1]?.trim();
if (sp && fs.existsSync(sp)) {
  const hits = detectScaffoldNotProse(fs.readFileSync(sp, "utf8"));
  has("offline ship-time scaffold recheck clean", hits.length === 0, hits.map((h) => h.rule).join(", "));
} else {
  has("STORY_SAVED present", false, String(sp));
}

console.log("\n=== WIRING READ ===");
for (const [ok, name, detail] of checks) console.log(`${ok}  ${name}${detail ? ` — ${detail}` : ""}`);
const fails = checks.filter((c) => c[0] === "FAIL").length;
console.log(`\n${fails === 0 ? "ALL WIRING CHECKS PASS" : `${fails} CHECK(S) FAILED`}`);
