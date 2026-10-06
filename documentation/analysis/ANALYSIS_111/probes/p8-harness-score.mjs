#!/usr/bin/env node
/**
 * A_111 P-8 — score the Agent 3 harness outputs (harness-p8/<project>-<off|on>.json) on the three counters the two
 * flags must move: devices reaching the CML (device-uptake's rule), inference steps that reason from a clock
 * (time-steps' rule), and innocent alibis that contain the actual time of death (alibi-coverage's rule).
 *
 *   node documentation/analysis/ANALYSIS_111/probes/p8-harness-score.mjs
 */
import { readFileSync, readdirSync } from "node:fs";
import { pathToFileURL } from "node:url";

const cml = await import(pathToFileURL(`${process.cwd()}/packages/cml/dist/index.js`).href);
const DIR = "documentation/analysis/ANALYSIS_111/harness-p8";
const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const devicesOf = new Map();
for (const a of Object.values(store.artifacts)) if (a.type === "hard_logic_devices") devicesOf.set(a.projectId, a.payload?.devices ?? []);

// device-uptake's distinctive-word rule, with document frequency over every stored device
const wordsOf = (d) => new Set(`${d.title ?? ""} ${d.underlyingReality ?? ""} ${d.corePrinciple ?? ""} ${d.surfaceIllusion ?? ""}`.toLowerCase().match(/[a-z]{6,}/g) ?? []);
const all = [...devicesOf.values()].flat();
const df = new Map();
for (const d of all) for (const w of wordsOf(d)) df.set(w, (df.get(w) ?? 0) + 1);
const reaches = (d, text) => {
  const ws = [...wordsOf(d)].filter((w) => df.get(w) / all.length < 0.25);
  return ws.length > 0 && ws.filter((w) => text.includes(w)).length / ws.length >= 0.5;
};
const CLOCK = /\b(?:[01]?\d|2[0-3])[:.][0-5]\d\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+o'clock\b|\b(?:quarter|half|twenty|ten|five|twenty-five)\s+(?:past|to)\b|\bminutes?\s+(?:past|to|before|after|late|early)\b|\b(?:clock|watch|timetable|time of death|window)\b/i;
const dialOf = (raw) => { const v = cml.parseClockTime(String(raw ?? "")); return typeof v === "number" ? v : v?.dial ?? null; };

const rows = [];
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".json")).sort()) {
  const r = JSON.parse(readFileSync(`${DIR}/${f}`, "utf8"));
  const project = f.replace(/-(off|on)\.json$/, ""), arm = f.match(/-(off|on)\.json$/)[1];
  const C = r.cml?.CASE ?? r.cml;
  if (!C) { rows.push({ project, arm, error: "no CML" }); continue; }
  const text = JSON.stringify([C.hidden_model, C.inference_path, C.discriminating_test, C.false_assumption, C.death_method]).toLowerCase();
  const devices = (devicesOf.get(project) ?? []).filter((d) => reaches(d, text)).length;
  const steps = C.inference_path?.steps ?? [];
  const clockSteps = steps.filter((s) => CLOCK.test(`${s.observation ?? ""} ${s.correction ?? ""}`)).length;
  const death = dialOf(C.hidden_model?.mechanism?.actual_time_of_death);
  const culprits = new Set((C.culpability?.culprits ?? []).map((n) => String(n).trim()));
  let inn = 0, cover = 0;
  for (const m of C.cast ?? []) {
    const role = String(m.role_archetype ?? m.role ?? "").toLowerCase();
    if (culprits.has(String(m.name).trim()) || /victim|detective|investigator|inspector/.test(role)) continue;
    const span = cml.alibiSpanFromWindow(String(m.alibi_window ?? ""));
    if (!span || death == null) continue;
    inn++;
    const [s, e] = cml.alibiSpanToWindow(span);
    if (s <= e ? death >= s && death <= e : death >= s || death <= e) cover++;
  }
  rows.push({ project, arm, axis: r.request?.primaryAxis, devices, clockSteps: `${clockSteps}/${steps.length}`, alibis: death == null ? "no death time" : `${cover}/${inn}`, cost: Number(r.harness?.cost ?? 0).toFixed(3), proves: r.classification?.provesTheAct ?? r.classification?.class ?? "" });
}
for (const r of rows) console.log(`${r.project.padEnd(22)} ${r.arm.padEnd(4)} ${String(r.axis ?? "").padEnd(10)} devices ${r.devices ?? "-"} · clock steps ${r.clockSteps ?? "-"} · innocent alibis containing the death ${r.alibis ?? r.error} · $${r.cost ?? "-"}`);
