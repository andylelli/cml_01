#!/usr/bin/env node
/**
 * A_111 §3.3 — how many of Agent 3b's devices reach the CML?
 *
 * Agent 3 is shown all five devices (twice) and told to "select one primary device (or a coherent hybrid of two)".
 * A device "reaches" the CML when enough of its distinctive words (title + reality + principle, 6+ letters, minus the
 * genre's common words) appear in the CML's solution fields. Known positive: devices[0], which the locked-fact
 * registry is built from. Negative control: the devices of a DIFFERENT case scored against this CML — the overlap
 * any device gets for being about a murder in a country house.
 *
 *   node documentation/analysis/ANALYSIS_111/probes/device-uptake.mjs
 */
import { readFileSync } from "node:fs";

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const latest = new Map();
for (const a of Object.values(store.artifacts)) if (a.type === "cml" || a.type === "hard_logic_devices") latest.set(`${a.projectId}|${a.type}`, a);

const cases = [];
for (const [key, a] of latest) {
  if (!key.endsWith("|cml")) continue;
  const pid = key.split("|")[0];
  const devices = latest.get(`${pid}|hard_logic_devices`)?.payload?.devices;
  const C = a.payload?.CASE;
  if (!C || !Array.isArray(devices) || devices.length < 3) continue;
  const solution = JSON.stringify([C.hidden_model, C.inference_path, C.discriminating_test, C.false_assumption, C.death_method]).toLowerCase();
  cases.push({ pid, devices, solution });
}

// Words common to the genre: in more than a quarter of all devices' text, they say nothing about which device.
const wordsOf = (d) => new Set(`${d.title ?? ""} ${d.underlyingReality ?? ""} ${d.corePrinciple ?? ""} ${d.surfaceIllusion ?? ""}`.toLowerCase().match(/[a-z]{6,}/g) ?? []);
const df = new Map();
const all = cases.flatMap((c) => c.devices);
for (const d of all) for (const w of wordsOf(d)) df.set(w, (df.get(w) ?? 0) + 1);
const distinctive = (d) => [...wordsOf(d)].filter((w) => df.get(w) / all.length < 0.25);
const overlap = (d, text) => {
  const ws = distinctive(d);
  return ws.length ? ws.filter((w) => text.includes(w)).length / ws.length : 0;
};

const THRESH = 0.5;
let pos = 0, neg = 0, negN = 0;
const usedHist = {};
const others = [];
for (const [i, c] of cases.entries()) {
  const scores = c.devices.map((d) => overlap(d, c.solution));
  if (scores[0] >= THRESH) pos++;
  const used = scores.filter((s) => s >= THRESH).length;
  usedHist[used] = (usedHist[used] ?? 0) + 1;
  if (scores.slice(1).some((s) => s >= THRESH)) others.push(c.pid.slice(5, 13));
  const other = cases[(i + 1) % cases.length];
  for (const d of other.devices) { negN++; if (overlap(d, c.solution) >= THRESH) neg++; }
}
console.log(`cases ${cases.length} · threshold: ${THRESH} of a device's distinctive words in the CML's solution fields`);
console.log(`known positive  devices[0] reaches its own CML: ${pos} of ${cases.length}`);
console.log(`negative control  another case's device reaches this CML: ${neg} of ${negN}`);
console.log(`devices reaching each CML: ${JSON.stringify(usedHist)}`);
console.log(`cases where a device other than devices[0] reaches the CML: ${others.length} of ${cases.length}`);

// Per-case detail for the projects named on the command line (e.g. the read books).
for (const id of process.argv.slice(2)) {
  const c = cases.find((x) => x.pid === id);
  if (!c) { console.log(`${id}: no CML with devices`); continue; }
  console.log(`${id}: ` + c.devices.map((d, i) => `${i}:${overlap(d, c.solution).toFixed(2)} "${String(d.title).slice(0, 40)}"`).join(" | "));
}
