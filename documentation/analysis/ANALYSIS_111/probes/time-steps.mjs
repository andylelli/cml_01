#!/usr/bin/env node
/**
 * A_111 P-8, probe 1 — how many of a case's inference steps lean on a CLOCK, by axis?
 *
 * A step is time-dependent when its observation or correction states a clock time or reasons from one ("logged at
 * twenty past eight", "the clock ran ahead", "within the window"). Known positive: temporal cases, whose whole
 * mechanism is a time. The question (A_111 §3.3): does a time thread ride along in non-temporal cases' reasoning — the
 * "competing mechanism" two of four readers named?
 *
 *   node documentation/analysis/ANALYSIS_111/probes/time-steps.mjs
 */
import { readFileSync, readdirSync } from "node:fs";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const latest = new Map();
for (const a of Object.values(store.artifacts)) if (a.type === "cml" || a.type === "cast") latest.set(`${a.projectId}|${a.type}`, a.payload);

// The axis: the UI spec, else the run-params file whose cast this case carries.
const params = [];
for (const f of readdirSync("scripts/generated").filter((f) => /^run-params-.*\.yaml$/.test(f))) {
  const t = readFileSync(`scripts/generated/${f}`, "utf8");
  const axis = t.match(/^primaryAxis:\s*(\w+)/m)?.[1];
  const names = [...t.matchAll(/^\s+-\s+"([^"]+)"/gm)].map((m) => m[1]);
  if (axis && names.length >= 3) params.push({ axis, names });
}
const axisOf = (pid) => {
  const spec = Object.values(store.specs ?? {}).find((x) => x.projectId === pid)?.spec?.primaryAxis;
  if (spec) return spec;
  const cast = latest.get(`${pid}|cast`);
  const names = new Set(((cast?.cast ?? cast)?.characters ?? []).map((c) => c.name));
  return params.find((p) => p.names.filter((n) => names.has(n)).length >= Math.min(3, p.names.length))?.axis ?? "unrecorded";
};

const CLOCK = /\b(?:[01]?\d|2[0-3])[:.][0-5]\d\b|\b(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve)\s+o'clock\b|\b(?:quarter|half|twenty|ten|five|twenty-five)\s+(?:past|to)\b|\bminutes?\s+(?:past|to|before|after|late|early)\b|\b(?:clock|watch|timetable|time of death|window)\b/i;
const by = {};
for (const [key, payload] of latest) {
  if (!key.endsWith("|cml")) continue;
  const pid = key.split("|")[0];
  const steps = payload?.CASE?.inference_path?.steps;
  if (!Array.isArray(steps) || steps.length === 0) continue;
  const axis = axisOf(pid);
  const timed = steps.filter((s) => CLOCK.test(`${s.observation ?? ""} ${s.correction ?? ""}`)).length;
  const r = (by[axis] ??= { cases: 0, steps: 0, timed: 0, majority: 0 });
  r.cases++; r.steps += steps.length; r.timed += timed;
  if (timed * 2 >= steps.length) r.majority++;
}
for (const [axis, r] of Object.entries(by).sort((a, b) => b[1].cases - a[1].cases)) {
  console.log(`${axis.padEnd(11)} cases ${String(r.cases).padStart(2)} · steps that reason from a clock ${r.timed}/${r.steps} (${Math.round((100 * r.timed) / r.steps)}%) · cases where half or more do: ${r.majority}`);
}
