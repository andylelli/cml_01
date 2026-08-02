#!/usr/bin/env node
/**
 * R6 (architecture/REVIEW.md) — freeze a run's upstream artifacts into a committed golden bundle.
 *
 * The golden set has to survive `data/store.json`. That file is the live working store: it is
 * rewritten by every run, it is 14 MB, and it is not the kind of thing a baseline should depend on.
 * A bundle is the eight artifacts Agent 9 actually reads, extracted once and committed, so
 * `npm run eval` measures the same inputs in six months that it measures today.
 *
 * Usage:
 *   node scripts/eval-freeze-bundle.mjs --list
 *   node scripts/eval-freeze-bundle.mjs <projectId> [bundleId]
 *   node scripts/eval-freeze-bundle.mjs --auto        # freeze every complete project found
 *
 * Output: eval/golden/<bundleId>.json
 */

import { existsSync, mkdirSync, readFileSync, writeFileSync, statSync } from "node:fs";
import { join } from "node:path";

const WORKSPACE_ROOT = process.env.CML_WORKSPACE_ROOT || process.cwd();
const STORE_PATH = join(WORKSPACE_ROOT, "data", "store.json");
const GOLDEN_DIR = join(WORKSPACE_ROOT, "eval", "golden");

/**
 * Exactly what `agent9-replay` requires plus what it treats as optional. Kept in this order so the
 * bundle file reads in pipeline order rather than alphabetically.
 */
const REQUIRED = [
  "cml",
  "cast",
  "character_profiles",
  "location_profiles",
  "temporal_context",
  "hard_logic_devices",
  "outline",
  "clues",
];
const OPTIONAL = ["world_document", "setting", "background_context", "fair_play_report"];

const readStore = () => {
  if (!existsSync(STORE_PATH)) {
    console.error(`[eval:freeze] No artifact store at ${STORE_PATH}. Nothing to freeze.`);
    process.exit(1);
  }
  const parsed = JSON.parse(readFileSync(STORE_PATH, "utf8"));
  return {
    artifacts: parsed.artifacts ?? parsed.artifact_versions ?? [],
    specs: Array.isArray(parsed.specs) ? parsed.specs : Object.values(parsed.specs ?? {}),
  };
};

const rowProject = (r) => r.project_id ?? r.projectId;
const rowType = (r) => r.artifact_type ?? r.type;
const rowPayload = (r) => {
  const raw = r.payload !== undefined ? r.payload : r.payload_json;
  if (typeof raw === "string") {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
};

/** Last-wins by array order — the store has no version column. Same rule as `artifact-store.ts`. */
const latest = (artifacts, projectId, type) => {
  let found;
  for (const r of artifacts) {
    if (rowProject(r) !== projectId) continue;
    if (rowType(r) !== type) continue;
    found = rowPayload(r);
  }
  return found;
};

const projectsWithArtifacts = (artifacts) => {
  const byProject = new Map();
  for (const r of artifacts) {
    const pid = rowProject(r);
    const type = rowType(r);
    if (!pid || !type) continue;
    if (!byProject.has(pid)) byProject.set(pid, new Set());
    byProject.get(pid).add(type);
  }
  return byProject;
};

const isComplete = (types) => REQUIRED.every((t) => types.has(t));

function freeze(artifacts, specs, projectId, bundleId) {
  const bundle = { id: bundleId, projectId, frozenAt: new Date().toISOString(), spec: {}, artifacts: {} };

  const mine = specs.filter((s) => s && (s.project_id ?? s.projectId) === projectId);
  const specRec = mine[mine.length - 1] ?? specs[specs.length - 1];
  bundle.spec = specRec?.spec ?? specRec ?? {};

  for (const type of [...REQUIRED, ...OPTIONAL]) {
    const payload = latest(artifacts, projectId, type);
    if (payload === undefined) {
      if (REQUIRED.includes(type)) {
        console.error(`[eval:freeze] ${projectId}: missing required artifact '${type}' — skipping this project.`);
        return null;
      }
      continue;
    }
    bundle.artifacts[type] = payload;
  }

  mkdirSync(GOLDEN_DIR, { recursive: true });
  const out = join(GOLDEN_DIR, `${bundleId}.json`);
  writeFileSync(out, JSON.stringify(bundle, null, 2), "utf8");
  const mb = (statSync(out).size / 1024 / 1024).toFixed(2);
  console.log(`[eval:freeze] wrote ${out} (${mb} MB, ${Object.keys(bundle.artifacts).length} artifacts)`);
  return out;
}

function main() {
  const { artifacts, specs } = readStore();
  const byProject = projectsWithArtifacts(artifacts);
  const args = process.argv.slice(2);

  if (args[0] === "--list" || args.length === 0) {
    console.log(`[eval:freeze] projects in ${STORE_PATH}:\n`);
    for (const [pid, types] of byProject) {
      const complete = isComplete(types);
      const missing = REQUIRED.filter((t) => !types.has(t));
      console.log(
        `  ${complete ? "✔" : "✘"} ${pid}  (${types.size} artifact types)` +
          (complete ? "" : `  missing: ${missing.join(", ")}`),
      );
    }
    console.log(`\nFreeze one:  node scripts/eval-freeze-bundle.mjs <projectId> [bundleId]`);
    console.log(`Freeze all:  node scripts/eval-freeze-bundle.mjs --auto`);
    return;
  }

  if (args[0] === "--auto") {
    let n = 0;
    for (const [pid, types] of byProject) {
      if (!isComplete(types)) continue;
      // Bundle ids are derived from the project id, never from a counter: a counter would renumber
      // every bundle when one is dropped, and the baseline is keyed by bundle id.
      if (freeze(artifacts, specs, pid, `bundle-${String(pid).replace(/[^a-zA-Z0-9]+/g, "").slice(-8)}`)) n++;
    }
    console.log(`[eval:freeze] froze ${n} complete project(s).`);
    if (n < 4) {
      console.warn(
        `[eval:freeze] WARNING: ${n} bundle(s) is below the 4-6 the review asks for. The harness will run, ` +
          `but a delta measured over ${n} premise(s) generalises poorly — freeze more runs as they complete.`,
      );
    }
    return;
  }

  const projectId = args[0];
  const bundleId = args[1] || `bundle-${String(projectId).replace(/[^a-zA-Z0-9]+/g, "").slice(-8)}`;
  if (!byProject.has(projectId)) {
    console.error(`[eval:freeze] No artifacts for project '${projectId}'. Run with --list to see what exists.`);
    process.exit(1);
  }
  if (!freeze(artifacts, specs, projectId, bundleId)) process.exit(1);
}

main();
