#!/usr/bin/env node
/**
 * A_111 §3.3 — do cases whose CML carries two or more of Agent 3b's devices read worse on the puzzle?
 *
 * Every story folder with a manuscript (>= 8,000 words, CLAUDE.md) and a read is matched to its stored case by cast
 * (owner-needs-probe's matchCase); the case's device count comes from device-uptake's rule. Reads are averaged PER
 * CASE before comparing (memory: dedupe cases before any cross-book count — redo pairs share a case).
 *
 *   node documentation/analysis/ANALYSIS_111/probes/hybrid-vs-reads.mjs
 */
import { readFileSync, readdirSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.cwd();
const owner = await import(pathToFileURL(join(ROOT, "documentation/analysis/ANALYSIS_110/probes/owner-needs-probe.mjs")).href);
const ledger = await import(pathToFileURL(join(ROOT, "scripts/external-read-ledger.mjs")).href);

const store = JSON.parse(readFileSync("data/store.json", "utf8"));
const latest = new Map();
for (const a of Object.values(store.artifacts)) if (a.type === "cml" || a.type === "hard_logic_devices") latest.set(`${a.projectId}|${a.type}`, a);
const wordsOfDevice = (d) => new Set(`${d.title ?? ""} ${d.underlyingReality ?? ""} ${d.corePrinciple ?? ""} ${d.surfaceIllusion ?? ""}`.toLowerCase().match(/[a-z]{6,}/g) ?? []);
const allDevices = [...latest.entries()].filter(([k]) => k.endsWith("|hard_logic_devices")).flatMap(([, a]) => a.payload?.devices ?? []);
const df = new Map();
for (const d of allDevices) for (const w of wordsOfDevice(d)) df.set(w, (df.get(w) ?? 0) + 1);
const devicesReaching = (pid) => {
  const C = latest.get(`${pid}|cml`)?.payload?.CASE;
  const devices = latest.get(`${pid}|hard_logic_devices`)?.payload?.devices;
  if (!C || !Array.isArray(devices)) return null;
  const text = JSON.stringify([C.hidden_model, C.inference_path, C.discriminating_test, C.false_assumption, C.death_method]).toLowerCase();
  return devices.filter((d) => {
    const ws = [...wordsOfDevice(d)].filter((w) => df.get(w) / allDevices.length < 0.25);
    return ws.length && ws.filter((w) => text.includes(w)).length / ws.length >= 0.5;
  }).length;
};

const byCase = new Map();
for (const name of readdirSync("stories")) {
  const dir = join("stories", name);
  if (!statSync(dir).isDirectory()) continue;
  const files = readdirSync(dir);
  const readFile = files.find((f) => /^chatgpt/i.test(f));
  const md = files.find((f) => f.endsWith(".md"));
  if (!readFile || !md) continue;
  const text = readFileSync(join(dir, md), "utf8");
  if ((text.match(/\S+/g) ?? []).length < 8000) continue;
  const match = owner.matchCase(text);
  if (!match) continue;
  const n = devicesReaching(match.id);
  if (n == null) continue;
  const segs = ledger.splitReads(readFileSync(join(dir, readFile), "utf8"));
  const r = ledger.parseExternalRead(segs.at(-1));
  const c = r.categories ?? {};
  if (r.final == null || c.plot_structure == null || c.clues == null || c.ending == null) continue;
  const row = byCase.get(match.id) ?? { devices: n, reads: [] };
  row.reads.push({ final: r.final, puzzle: c.plot_structure + c.clues + c.ending, name });
  byCase.set(match.id, row);
}

const mean = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const sd = (xs) => { const m = mean(xs); return Math.sqrt(xs.reduce((a, b) => a + (b - m) ** 2, 0) / Math.max(1, xs.length - 1)); };
const groups = { one: [], hybrid: [] };
for (const [id, row] of byCase) {
  const g = row.devices >= 2 ? "hybrid" : "one";
  groups[g].push({ id, puzzle: mean(row.reads.map((r) => r.puzzle)), final: mean(row.reads.map((r) => r.final)), reads: row.reads.length, devices: row.devices });
}
for (const [g, rows] of Object.entries(groups)) {
  if (!rows.length) { console.log(`${g}: no cases`); continue; }
  const p = rows.map((r) => r.puzzle), f = rows.map((r) => r.final);
  console.log(`${g.padEnd(6)} cases ${rows.length} (reads ${rows.reduce((a, r) => a + r.reads, 0)}) · plot+clues+ending ${mean(p).toFixed(2)} ± ${sd(p).toFixed(2)} · headline ${mean(f).toFixed(1)} ± ${sd(f).toFixed(1)}`);
}
const a = groups.one.map((r) => r.puzzle), b = groups.hybrid.map((r) => r.puzzle);
if (a.length > 1 && b.length > 1) {
  const se = Math.sqrt(sd(a) ** 2 / a.length + sd(b) ** 2 / b.length);
  console.log(`difference (one − hybrid) on plot+clues+ending: ${(mean(a) - mean(b)).toFixed(2)} · SE ${se.toFixed(2)} · t ${((mean(a) - mean(b)) / se).toFixed(2)}`);
}
console.log(`devices=0 cases (no device detected) are counted with "one": ${groups.one.filter((r) => r.devices === 0).length}`);
