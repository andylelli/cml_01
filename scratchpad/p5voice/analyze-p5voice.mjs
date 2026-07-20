#!/usr/bin/env node
// A_63 §7.3 verdict — AGENT9_VOICE_ENFORCE shadow-vs-enforce A/B.
// Acceptance: dialogue mean +1 (enforce−shadow) with nothing regressed ≤ −0.5, AND tic metrics
// not worse: leakage pairs ≤ control, overuse speakers ≤ control (Item 14). Marks from reports;
// tic metrics parsed from the per-run chain logs' "[Agent 9] voice-idiolect (mode): ..." line.
// Guardrails: shipped-only (P0.2), incomplete pairs invalidate, missing metrics FAIL, N≥4.
import fs from "fs";
import path from "path";

const root = "C:/CML";
const outDir = path.join(root, "scratchpad", "p5voice");
const reportsDir = path.join(root, "apps", "api", "data", "reports");
const rows = fs.readFileSync(path.join(outDir, "summary.tsv"), "utf8")
  .trim().split(/\r?\n/).slice(1).map((l) => {
    const [theme, arm, gate, runId] = l.split("\t");
    return { theme, arm, gate, runId };
  });

const ALL = ["premise", "opening_hook", "plot_structure", "character_clarity", "dialogue",
  "atmosphere", "clues", "pacing", "ending", "prose"];
const VOICE_RE = /voice-idiolect \((shadow|enforce)\): (\d+)\/(\d+) speakers used their tic; (\d+) leakage pair\(s\); (\d+) overuse speaker\(s\)/;

// Offline recompute for arms that predate the console.warn telemetry fix. Deterministic:
// capsules (name + signatureTic) from the run's prompt archive (Agent2b profiles response),
// prose from the STORY_SAVED markdown recorded in the chain log.
const { validateDialogueIdiolect } = await import(
  "file:///C:/CML/packages/story-validation/dist/dialogue-idiolect-validator.js"
);
async function recomputeVoiceMetrics(runId, logText) {
  const storyMatch = logText.match(/^STORY_SAVED (.+)$/m);
  if (!storyMatch) throw new Error("no STORY_SAVED line");
  const storyText = fs.readFileSync(storyMatch[1].trim(), "utf8");

  const archivesRoot = path.join(root, "documentation", "prompts", "actual");
  const dir = fs.readdirSync(archivesRoot).find((d) => {
    const idx = path.join(archivesRoot, d, "INDEX.md");
    return fs.existsSync(idx) && fs.readFileSync(idx, "utf8").includes(runId);
  });
  if (!dir) throw new Error("no prompt archive for run");
  const profileFile = fs.readdirSync(path.join(archivesRoot, dir)).find((f) => /Agent2b.*response/.test(f));
  if (!profileFile) throw new Error("no Agent2b profiles response in archive");
  const profileText = fs.readFileSync(path.join(archivesRoot, dir, profileFile), "utf8");
  const capsules = [];
  const re = /"name"\s*:\s*"([^"]+)"[\s\S]{0,2000}?"signatureTic"\s*:\s*"((?:[^"\\]|\\.)*)"/g;
  for (const m of profileText.matchAll(re)) {
    const tic = m[2].replace(/\\"/g, '"').trim();
    capsules.push({ name: m[1], speechTics: tic ? [tic] : [] });
  }
  if (capsules.length === 0) throw new Error("no signatureTic capsules parsed");
  const verdict = validateDialogueIdiolect(capsules, storyText);
  return {
    covered: verdict.metrics.speakersWithTic,
    distinct: verdict.metrics.distinctSignatures,
    leakage: verdict.metrics.ticLeakagePairs,
    overuse: verdict.metrics.ticOveruseSpeakers.length,
  };
}

const runs = new Map();
for (const r of rows) {
  if (!["passed", "warning"].includes(r.gate)) continue;
  const p = path.join(reportsDir, r.runId, `${r.runId}.json`);
  if (!fs.existsSync(p)) { console.log(`MISSING REPORT: ${r.runId}`); continue; }
  const rep = JSON.parse(fs.readFileSync(p, "utf8"));
  const rubric = (rep.diagnostics ?? []).find((d) => d.key === "rubric_score")?.details ?? null;
  if (!rubric) { console.log(`FAIL: no rubric_score on ${r.runId}`); continue; }
  const marks = {};
  for (const c of ALL) marks[c] = rubric.categories?.find((x) => x.category === c)?.mark ?? null;

  // tic metrics: prefer the chain log's console line; take the LAST match (post-repair state on
  // enforce arms). Arms that ran before the console.warn fix get an OFFLINE RECOMPUTE: the
  // validator is deterministic, capsules come from the run's prompt archive, prose from the saved
  // story markdown (the SHIPPED text) — the corpus-era method applied early.
  const logPath = path.join(outDir, `voice_${r.theme}_${r.arm}.log`);
  let voice = null;
  let voiceSource = "log";
  if (fs.existsSync(logPath)) {
    const logText = fs.readFileSync(logPath, "utf8");
    const matches = [...logText.matchAll(new RegExp(VOICE_RE, "g"))];
    const m = matches.at(-1);
    if (m) voice = { covered: +m[2], distinct: +m[3], leakage: +m[4], overuse: +m[5] };
    if (!voice) {
      try {
        voice = await recomputeVoiceMetrics(r.runId, logText);
        voiceSource = "recomputed";
      } catch (e) {
        console.log(`recompute failed for ${r.runId}: ${e.message}`);
      }
    }
  }
  runs.set(`${r.theme}_${r.arm}`, {
    ...r, final: rubric.final ?? null, capCount: (rubric.caps_applied ?? []).length,
    marks, voice, voiceSource, cost: rep.total_cost ?? null,
  });
}

const themes = [...new Set(rows.map((r) => r.theme))];
const pairs = [];
for (const t of themes) {
  const s = runs.get(`${t}_shadow`), e = runs.get(`${t}_enforce`);
  if (!s || !e) { console.log(`INCOMPLETE PAIR (invalidated): ${t}`); continue; }
  pairs.push({ theme: t, s, e });
}
console.log(`\nComplete pairs: ${pairs.length}/${themes.length}` + (pairs.length < 4 ? "  ** N<4 — NO VERDICT MAY BE READ **" : ""));

console.log("\n| theme | arm | rubric | dlg | caps | tic cov | leak | overuse | cost |");
console.log("|---|---|---|---|---|---|---|---|---|");
for (const p of pairs) for (const a of [p.s, p.e]) {
  const v = a.voice;
  const tag = a.voiceSource === "recomputed" ? "*" : "";
  console.log(`| ${p.theme} | ${a.arm} | ${a.final} | ${a.marks.dialogue} | ${a.capCount} | ${v ? `${v.covered}/${v.distinct}${tag}` : "MISSING"} | ${v ? v.leakage : "—"} | ${v ? v.overuse : "—"} | $${a.cost?.toFixed?.(2) ?? a.cost} |`);
}

if (pairs.length >= 4) {
  const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
  const missing = pairs.some((p) => !p.s.voice || !p.e.voice);
  console.log("\n### Per-category means (shadow → enforce, Δ)");
  const deltas = {};
  for (const c of ALL) {
    const off = pairs.map((p) => p.s.marks[c]), on = pairs.map((p) => p.e.marks[c]);
    if (off.some((x) => x === null) || on.some((x) => x === null)) { console.log(`| ${c} | METRIC MISSING — FAIL`); deltas[c] = null; continue; }
    deltas[c] = mean(on) - mean(off);
    console.log(`| ${c} | ${mean(off).toFixed(2)} → ${mean(on).toFixed(2)} | Δ ${deltas[c] >= 0 ? "+" : ""}${deltas[c].toFixed(2)}${c === "dialogue" ? " ← target" : ""}`);
  }
  if (missing) { console.log("\nTic metrics MISSING on ≥1 arm — FAIL (verify the overuse-enabled build was live)"); }
  else {
    const leak = [mean(pairs.map((p) => p.s.voice.leakage)), mean(pairs.map((p) => p.e.voice.leakage))];
    const over = [mean(pairs.map((p) => p.s.voice.overuse)), mean(pairs.map((p) => p.e.voice.overuse))];
    const cov = [mean(pairs.map((p) => p.s.voice.covered / Math.max(1, p.s.voice.distinct))), mean(pairs.map((p) => p.e.voice.covered / Math.max(1, p.e.voice.distinct)))];
    console.log(`\ntic coverage: ${(cov[0] * 100).toFixed(0)}% → ${(cov[1] * 100).toFixed(0)}% | leakage: ${leak[0].toFixed(2)} → ${leak[1].toFixed(2)} | overuse: ${over[0].toFixed(2)} → ${over[1].toFixed(2)}`);
    const regressed = ALL.filter((c) => deltas[c] !== null && deltas[c] <= -0.5);
    const pass = (deltas.dialogue ?? 0) >= 1 && regressed.length === 0 && leak[1] <= leak[0] && over[1] <= over[0];
    console.log(`Regressions ≤ −0.5: ${regressed.length ? regressed.join(", ") : "none"}`);
    console.log(`\nAUTO-VERDICT (strict): ${pass ? "PASS — enforce earns its keep" : "FAIL"} — read with the per-pair table, never alone.`);
  }
}
