/**
 * Agent 8 redesign — spike (§9.1). Two parts, both offline/deterministic (no LLM):
 *
 *   Part 1 — CONFIRM THE BUG (§9.1 spike 1, "not optional"). The live audit is dark code: the
 *            shipped config ships similarity_threshold_default ≥ 1, and agent3-run.ts skips the audit
 *            whenever the threshold ≥ 1. This reads the real generation-params.yaml and reproduces the
 *            exact skip logic — proving the most expensive novelty machinery never runs.
 *
 *   Part 2 — THE STRUCTURAL SIGNAL (§9.1 spikes 3 + §6 metrics), on the new abstract fingerprints:
 *            (a) every seed fed back is flagged from the skeleton alone (clone-caught-pre-elaboration),
 *            (b) the genre-cliche ledger catches clichés the seed-only check is BLIND to — the §6
 *                "cliche catch rate" the current design scores ZERO on,
 *            (c) the cross-run store catches mode collapse a seed-only check structurally cannot see.
 *
 * Read-only. No pipeline wiring.  node scripts/agent8-novelty-spike.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath, pathToFileURL } from "url";
import yaml from "js-yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// A_53 P11 (spike-reads-uncompiled-dist): dist/ is gitignored, so a static import of the compiled
// package throws a cryptic ERR_MODULE_NOT_FOUND on a clean checkout / stale dist. Preflight the dist
// entry and, if missing, fail with a clear build instruction instead. (Lowest-risk: no new dep / no
// package.json change — tsx is not installed in this repo.)
const noveltyDist = path.join(repoRoot, "packages/novelty/dist/index.js");
if (!fs.existsSync(noveltyDist)) {
  console.error(
    `\n[agent8-novelty-spike] @cml/novelty is not built: ${path.relative(repoRoot, noveltyDist)} is missing.\n` +
      `  dist/ is gitignored, so build the package first, then re-run the spike:\n` +
      `    npm run -w @cml/novelty build && node scripts/agent8-novelty-spike.mjs\n`,
  );
  process.exit(1);
}
const {
  judgeNovelty,
  judgeAgainstAll,
  loadSeedFingerprints,
  loadClicheLedger,
  loadReferenceCorpus,
  NoveltyStore,
} = await import(pathToFileURL(noveltyDist).href);
const skel = (fp) => ({ id: fp.id, axis: fp.axis, mechanism_family: fp.mechanism_family, false_assumption_pattern: fp.false_assumption_pattern, discriminating_test_shape: fp.discriminating_test_shape, inference_shape: fp.inference_shape, premise: fp.premise });

function part1_confirmDarkCode() {
  console.log("=== Part 1 — confirm the audit is DARK CODE (§9.1 spike 1) ===\n");
  const cfg = yaml.load(fs.readFileSync(path.join(repoRoot, "apps/worker/config/generation-params.yaml"), "utf8"));
  const threshold = cfg?.agent8_novelty?.params?.thresholds?.similarity_threshold_default;
  console.log(`  live config: agent8_novelty.params.thresholds.similarity_threshold_default = ${threshold}`);
  // reproduce agent3-run.ts: shouldSkipNovelty = skipNoveltyCheck || similarityThreshold >= 1
  const clamped = Math.max(0, Math.min(1, threshold)); // generation-params.ts clampNumber(...,0,1)
  const shouldSkip = threshold >= 1; // the actual gate in agent3-run.ts
  console.log(`  similarity lives in [0,1], so a threshold of ${threshold} is unreachable (clamps to ${clamped}).`);
  console.log(`  agent3-run.ts: shouldSkipNovelty = (threshold >= 1) = ${shouldSkip}`);
  console.log(`  >> The novelty audit ${shouldSkip ? "NEVER RUNS" : "runs"} on the shipped config. ${shouldSkip ? "Confirmed dark." : ""}\n`);
  return shouldSkip;
}

function part2_structuralSignal() {
  console.log("=== Part 2 — the abstract structural signal (§9.1 spike 3 / §6) ===\n");
  const seeds = loadSeedFingerprints();
  const cliches = loadClicheLedger();
  const ref = loadReferenceCorpus();

  // (a) every seed is caught from its skeleton alone — before any 8000-token elaboration.
  const seedCaught = seeds.filter((s) => judgeNovelty(skel(s), seeds).verdict !== "distinct").length;
  console.log(`  (a) seed-clone caught at the skeleton stage:  ${seedCaught}/${seeds.length}  (${pct(seedCaught, seeds.length)})`);

  // (b) cliche catch rate: seed-only (the current design) vs seed+cliche ledger (the redesign).
  let seedOnlyCaught = 0, ledgerCaught = 0;
  const blindList = [];
  for (const c of cliches) {
    const seedOnly = judgeNovelty(skel(c), seeds).verdict !== "distinct";
    const withLedger = judgeAgainstAll(skel(c), { seeds, cliches }).verdict !== "distinct";
    if (seedOnly) seedOnlyCaught++;
    if (withLedger) ledgerCaught++;
    if (!seedOnly && withLedger) blindList.push(c.id);
  }
  console.log(`  (b) cliche catch rate — SEED-ONLY (today):    ${seedOnlyCaught}/${cliches.length}  (${pct(seedOnlyCaught, cliches.length)})`);
  console.log(`      cliche catch rate — WITH cliche ledger:   ${ledgerCaught}/${cliches.length}  (${pct(ledgerCaught, cliches.length)})`);
  if (blindList.length) console.log(`      clichés the seed-only check is BLIND to but the ledger catches: ${blindList.join(", ")}`);

  // (c) cross-run mode collapse.
  const store = new NoveltyStore();
  const run50 = { id: "run_050", axis: "behavioral", mechanism_family: "alibi_fabrication", false_assumption_pattern: "the_grieving_relative_is_above_suspicion", discriminating_test_shape: "behavioral_tell", inference_shape: "expose_rehearsed_alibi" };
  store.append(run50);
  const collide = store.judge({ ...run50, id: "run_200", premise: "different surface, same shape" }, 20);
  console.log(`  (c) cross-run collision (run #200 vs #50):    ${collide.verdict} → nearest ${collide.nearest?.corpus} '${collide.nearest?.id}'`);

  // a worked example verdict, in full, to show the explainable output.
  const candidate = { id: "candidate", axis: "spatial", mechanism_family: "locked_room_key", false_assumption_pattern: "locked_room=>no_entry", discriminating_test_shape: "physical_trace", inference_shape: "reframe_access_via_duplicate_key", premise: "Lord stabbed in a locked study at thirteen-to-midnight." };
  const v = judgeAgainstAll(candidate, { seeds, cliches });
  console.log(`\n  worked example — the spare-key skeleton (§4.6):`);
  console.log(`    ${JSON.stringify(v, null, 2).split("\n").join("\n    ")}`);

  return { seedCaught, seeds: seeds.length, seedOnlyCaught, ledgerCaught, cliches: cliches.length };
}

const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);

console.log("");
const dark = part1_confirmDarkCode();
const r = part2_structuralSignal();
console.log("\n=== SUMMARY ===");
console.log(`  · the live novelty audit is ${dark ? "OFF (dark code)" : "on"} on the shipped config.`);
console.log(`  · seed-clones caught at the cheap skeleton stage: ${r.seedCaught}/${r.seeds}.`);
console.log(`  · genre clichés: seed-only catches ${r.seedOnlyCaught}/${r.cliches}; the cliche ledger catches ${r.ledgerCaught}/${r.cliches}.`);
console.log(`  >> The redesign turns a dark, seed-only, magic-number gate into a sighted, explainable, cheap structural check.\n`);
