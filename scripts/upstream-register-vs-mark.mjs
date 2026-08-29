#!/usr/bin/env node
/**
 * Does the ABSTRACTION of what an agent hands downstream predict the mark of the category it feeds?
 *
 * ── THE HYPOTHESIS ───────────────────────────────────────────────────────────────────────────────
 *
 * The machine-register score is the only prose instrument this project owns that tracks the human
 * mark (rho = -0.421 over 40 read books). It measures how ABSTRACT a sentence is: no concrete noun,
 * no sensory word, a proposition for a subject, a stative verb.
 *
 * Run it over the ARTIFACTS instead of the manuscript, on `canary_1787953182108` (external 85/100):
 *
 *     location_profiles   5.4%   (lowest)   -> atmosphere scored 9
 *     outline             8.9%              -> pacing 8, plot 8
 *     clues               9.2%              -> clues 8
 *     cml                10.9%
 *     world_document     11.7%
 *     cast               15.6%
 *     character_profiles 28.8%   (highest)  -> character 8, dialogue 7
 *
 * That is n=1 and could be coincidence. This tests it across every run whose artifacts can be joined
 * to an external read, by matching the CML's own title against the manuscript's heading.
 *
 * A NEGATIVE result is worth as much as a positive one: three of the last four score hypotheses this
 * project tested came back null or wrong-signed, and each null saved a build.
 *
 *   node scripts/upstream-register-vs-mark.mjs
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const need = (p) => {
  const f = join(ROOT, p);
  if (!existsSync(f)) { console.error(`\n  build first — ${p} missing\n`); process.exit(1); }
  return pathToFileURL(f).href;
};
const store = await import(need("apps/worker/dist/jobs/artifact-store.js"));
const { machineRegisterRate } = await import(need("packages/prose-guard/dist/machine-register.js"));

const rows = store.loadArtifactStore(ROOT);
const projects = [...new Set(rows.map((r) => r.project_id ?? r.projectId).filter(Boolean))];

const reads = [];
for (const e of JSON.parse(readFileSync(join(ROOT, "eval/results/external-read/manifest.json"), "utf8"))) {
  const p = e?.storyPath && join(ROOT, e.storyPath);
  if (!p || !existsSync(p) || !e.externalCategories) continue;
  const heading = readFileSync(p, "utf8").split("\n")[0].replace(/^#+\s*/, "").trim();
  reads.push({ heading: heading.toLowerCase(), cats: e.externalCategories });
}

const norm = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9 ]/g, "").replace(/\s+/g, " ").trim();

const collect = (node, out) => {
  if (typeof node === "string") { if (node.trim().split(/\s+/).length >= 6) out.push(node); return; }
  if (Array.isArray(node)) { node.forEach((v) => collect(v, out)); return; }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) { if (k !== "rawResponse") collect(v, out); }
  }
};

/** artifact -> the category it most directly feeds. */
const FEEDS = [
  ["location_profiles", "atmosphere"],
  ["character_profiles", "character_clarity"],
  ["character_profiles", "dialogue"],
  ["clues", "clues"],
  ["outline", "pacing"],
  ["outline", "plot_structure"],
];

const paired = [];
for (const p of projects) {
  const cml = store.latestArtifact(rows, p, "cml");
  const title = norm((cml?.CASE ?? cml)?.meta?.title);
  if (!title) continue;
  const read = reads.find((r) => {
    const h = norm(r.heading);
    return h && title && (h.includes(title.slice(0, 22)) || title.includes(h.slice(0, 22)));
  });
  if (!read) continue;
  const rates = {};
  for (const name of new Set(FEEDS.map(([a]) => a))) {
    const art = store.latestArtifact(rows, p, name);
    if (!art) continue;
    const out = [];
    collect(art, out);
    const r = machineRegisterRate(out.join(" "), 3);
    if (r.sentences >= 10) rates[name] = r.rate * 100;
  }
  paired.push({ p, cats: read.cats, rates });
}

console.log(`\n  runs whose ARTIFACTS join to an external read: ${paired.length}\n`);
if (paired.length < 4) {
  console.log("  too few to correlate — reporting the rows only.\n");
  for (const r of paired) console.log(`    ${r.p}  ${JSON.stringify(r.rates)}`);
  process.exit(0);
}

const spearman = (xs, ys) => {
  const rank = (v) => {
    const s = v.map((x, i) => [x, i]).sort((a, b) => a[0] - b[0]);
    const out = new Array(v.length);
    s.forEach(([, i], k) => { out[i] = k + 1; });
    return out;
  };
  const rx = rank(xs), ry = rank(ys), n = xs.length;
  const d2 = rx.reduce((a, x, i) => a + (x - ry[i]) ** 2, 0);
  return 1 - (6 * d2) / (n * (n * n - 1));
};

console.log(`    ${"artifact".padEnd(20)} ${"feeds".padEnd(18)} ${"n".padStart(3)}  rho     reading`);
console.log(`    ${"-".repeat(72)}`);
for (const [artifact, cat] of FEEDS) {
  const xs = [], ys = [];
  for (const r of paired) {
    const v = r.rates[artifact];
    const m = r.cats[cat];
    if (typeof v === "number" && typeof m === "number") { xs.push(v); ys.push(m); }
  }
  if (xs.length < 4) { console.log(`    ${artifact.padEnd(20)} ${cat.padEnd(18)} ${String(xs.length).padStart(3)}  (too few)`); continue; }
  const rho = spearman(xs, ys);
  const crit = 1.96 / Math.sqrt(xs.length - 1);
  const verdict = Math.abs(rho) < crit ? "not significant" : rho < 0 ? "SIGNAL (abstract upstream -> lower mark)" : "wrong direction";
  console.log(`    ${artifact.padEnd(20)} ${cat.padEnd(18)} ${String(xs.length).padStart(3)}  ${rho.toFixed(3).padStart(6)}  ${verdict}`);
}
console.log(`\n  a NEGATIVE rho is the hypothesis: more abstract upstream text, lower mark downstream.\n`);
