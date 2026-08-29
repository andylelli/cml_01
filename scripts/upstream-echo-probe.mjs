#!/usr/bin/env node
/**
 * How much of the finished prose is COPIED from what earlier agents handed the writer?
 *
 * ── WHY THIS QUESTION ────────────────────────────────────────────────────────────────────────────
 *
 * `prose` is the lowest-scoring category (mean 5.6 over 44 reads) and has never been given a 9. Every
 * prose note ever written describes an ABSENCE — leakage, artifacts, generated fragments. The A_75
 * finding is that the reader is recognising a REGISTER, not a template.
 *
 * One way a register gets into a book is that the writer is handed text and quotes it. Agent 5 emits
 * clue descriptions, Agent 2b emits speech mannerisms, Agent 2c emits sensory palettes, Agent 7 emits
 * scene purposes — all of it lands in the prose prompt. If the manuscript echoes those strings
 * verbatim, the prose defect is UPSTREAM and no amount of Agent 9 repair reaches it.
 *
 * Measured as SHARED WORD RUNS, not exact-string equality: a model rarely copies a whole field, it
 * lifts a phrase. A run of N consecutive content words appearing in both the artifact and the
 * manuscript is a lift.
 *
 *   node scripts/upstream-echo-probe.mjs <projectId> <manuscript.md> [runLength]
 */

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";

const ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const [projectId, manuscriptPath, runArg] = process.argv.slice(2);
const RUN = Math.max(3, Number(runArg) || 5);

if (!projectId || !manuscriptPath) {
  console.error("\n  usage: node scripts/upstream-echo-probe.mjs <projectId> <manuscript.md> [runLength]\n");
  process.exit(1);
}

const store = await import(pathToFileURL(join(ROOT, "apps/worker/dist/jobs/artifact-store.js")).href);
const rows = store.loadArtifactStore(ROOT);

const STOP = new Set(("a an the and or but of to in on at by for with from as is was were be been being that this "
  + "it its he she they them his her their had has have not no so if then than when where which who whom what "
  + "there here into over under about after before her him i you we our your").split(/\s+/));

const words = (s) => String(s ?? "").toLowerCase().replace(/[^a-z0-9\s]/g, " ").split(/\s+/).filter(Boolean);
/** Content-word runs of length RUN, as a set of joined keys. */
const runs = (text) => {
  const w = words(text).filter((x) => !STOP.has(x));
  const out = new Set();
  for (let i = 0; i + RUN <= w.length; i += 1) out.add(w.slice(i, i + RUN).join(" "));
  return out;
};

const manuscript = readFileSync(existsSync(manuscriptPath) ? manuscriptPath : join(ROOT, manuscriptPath), "utf8");
const proseRuns = runs(manuscript);

/** Walk an artifact and collect its human-readable strings, keyed by the field path they came from. */
const collectStrings = (node, path, out) => {
  if (typeof node === "string") {
    if (node.trim().split(/\s+/).length >= RUN) out.push([path, node]);
    return;
  }
  if (Array.isArray(node)) { node.forEach((v, i) => collectStrings(v, `${path}[]`, out)); return; }
  if (node && typeof node === "object") {
    for (const [k, v] of Object.entries(node)) {
      if (k === "rawResponse") continue; // the raw LLM envelope, not something handed downstream
      collectStrings(v, path ? `${path}.${k}` : k, out);
    }
  }
};

const ARTIFACTS = [
  ["setting", "Agent 1"], ["cast", "Agent 2"], ["character_profiles", "Agent 2b"],
  ["location_profiles", "Agent 2c"], ["temporal_context", "Agent 2d"], ["background_context", "Agent 2e"],
  ["hard_logic_devices", "Agent 3b"], ["cml", "Agent 3"], ["clues", "Agent 5"],
  ["world_document", "Agent 6.5"], ["outline", "Agent 7"], ["story_geometry", "Agent 7.5"],
];

console.log(`\n  upstream echo — runs of ${RUN} consecutive content words shared with the manuscript\n`);
console.log(`    ${"artifact".padEnd(22)} ${"agent".padEnd(9)} ${"runs".padStart(7)} ${"echoed".padStart(7)}  rate`);
console.log(`    ${"-".repeat(64)}`);

const worst = [];
for (const [name, agent] of ARTIFACTS) {
  const art = store.latestArtifact(rows, projectId, name);
  if (!art) continue;
  const strings = [];
  collectStrings(art, "", strings);
  const all = new Set();
  const echoedByField = new Map();
  for (const [path, s] of strings) {
    for (const r of runs(s)) {
      all.add(r);
      if (proseRuns.has(r)) {
        const list = echoedByField.get(path) ?? [];
        list.push(r);
        echoedByField.set(path, list);
      }
    }
  }
  const echoed = [...all].filter((r) => proseRuns.has(r)).length;
  if (all.size === 0) continue;
  const rate = (100 * echoed) / all.size;
  console.log(`    ${name.padEnd(22)} ${agent.padEnd(9)} ${String(all.size).padStart(7)} ${String(echoed).padStart(7)}  ${rate.toFixed(1)}%`);
  for (const [path, list] of echoedByField) worst.push({ name, path, n: list.length, sample: list[0] });
}

worst.sort((a, b) => b.n - a.n);
console.log(`\n  the fields the writer copies from, worst first:\n`);
for (const w of worst.slice(0, 12)) {
  console.log(`    ${String(w.n).padStart(3)}  ${w.name}.${w.path}`);
  console.log(`         "${w.sample}"`);
}
console.log("");
