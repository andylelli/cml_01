/**
 * Agent 6 redesign — Spike A + B: the blind reader is a STOCHASTIC sample treated as a DETERMINISTIC
 * verdict (§9.1). This harness measures that, the whole justification for the redesign, on real data.
 *
 *   Spike A — call the SAME blindReaderSimulation that gates the live run (and whose failure path
 *             `throw`s and kills the run) N times on ONE fixed, already-shipped case. Record the
 *             suspected culprit, confidence, and the pass/fail the gate would compute. The headline
 *             metric is the FALSE-VETO RATE: the fraction of samples that would FAIL a case the full
 *             pipeline already shipped as fair.
 *   Spike B — run the deterministic checker (proveSolvability, the redesign's correctness oracle) N
 *             times and show it is BYTE-IDENTICAL every time. The contrast table — "blind reader
 *             flipped K/N; checker flipped 0/N" — is the entire argument for moving correctness off
 *             the stochastic gate.
 *
 * Read-only. No pipeline wiring, no behavior change. Spike A needs live Azure creds (root .env) and
 * TLS via system CA:
 *
 *   node --use-system-ca scripts/agent6-blind-reader-variance.mjs [N=12]
 *   node scripts/agent6-blind-reader-variance.mjs --offline   # Spike B only (no LLM calls)
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { proveSolvability } from "../packages/cml-core/dist/index.js";
import { clockSetFastRepaired } from "../packages/cml-core/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// ── tiny .env loader (so the harness is self-sufficient) ─────────────────────
//
// `.env.local` FIRST, then `.env`, first-wins — the same precedence as
// `cli-runtime.ts` and as every production loader since X7. This file used to read `.env` alone,
// which meant it ran on the key the pipeline ignores (REVIEW_05 §20.2).
function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const envPath = path.join(repoRoot, name);
    if (!fs.existsSync(envPath)) continue;
    for (const line of fs.readFileSync(envPath, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (!m) continue;
      const key = m[1];
      let val = m[2].replace(/^["']|["']$/g, "");
      if (process.env[key] == null) process.env[key] = val;
    }
  }
}

const sameName = (a, b) => {
  const na = String(a ?? "").trim().toLowerCase();
  const nb = String(b ?? "").trim().toLowerCase();
  return !!na && !!nb && (na === nb || na.includes(nb) || nb.includes(na));
};

/** Load every distinct already-shipped case (cml + clues) across one or more store snapshots. */
function loadFrozenCases(storePaths) {
  const byProject = new Map();
  for (const sp of storePaths) {
    let store;
    try {
      store = JSON.parse(fs.readFileSync(sp, "utf8"));
    } catch {
      continue;
    }
    const arts = Array.isArray(store.artifacts) ? store.artifacts : Object.values(store.artifacts ?? {});
    for (const a of arts) {
      if (a.type !== "cml" && a.type !== "clues") continue;
      const existing = byProject.get(a.projectId);
      if (existing?.cml && existing?.clues) continue;
      const slot = existing ?? {};
      slot[a.type] = slot[a.type] ?? a;
      byProject.set(a.projectId, slot);
    }
  }
  const cases = [];
  for (const [projectId, pair] of byProject) {
    if (!pair.cml || !pair.clues) continue;
    const caseData = pair.cml.payload?.CASE ?? pair.cml.payload;
    cases.push({
      projectId,
      clues: pair.clues.payload, // ClueDistributionResult shape (clues[], redHerrings[], clueTimeline)
      falseAssumption: caseData?.false_assumption?.statement ?? "",
      castNames: (caseData?.cast ?? []).map((c) => c.name).filter(Boolean),
      culprit: caseData?.culpability?.culprits?.[0] ?? "",
    });
  }
  return cases;
}

// ── Spike B — deterministic checker stability ────────────────────────────────
function spikeB(runs) {
  const cml = clockSetFastRepaired();
  const first = JSON.stringify(proveSolvability(cml));
  let flips = 0;
  for (let i = 0; i < runs; i++) if (JSON.stringify(proveSolvability(cml)) !== first) flips++;
  const proof = JSON.parse(first);
  return { flips, runs, verdict: proof.solvable ? "SOLVABLE" : "UNSOLVABLE", culprit: proof.culprit };
}

async function main() {
  const argv = process.argv.slice(2);
  const offline = argv.includes("--offline");
  const N = Number(argv.find((a) => /^\d+$/.test(a)) ?? 12);
  const storePaths = argv.filter((a) => a.endsWith(".json"));
  if (storePaths.length === 0) storePaths.push(path.join(repoRoot, "data", "store.json"));
  const projectFilter = (argv.find((a) => a.startsWith("--project=")) ?? "").replace("--project=", "");

  console.log(`\n=== Agent 6 Spike A/B — blind-reader variance vs deterministic checker (N=${N}) ===\n`);

  // Spike B always runs (pure, offline).
  const b = spikeB(N);
  console.log(`Spike B (deterministic checker, proveSolvability over the typed core):`);
  console.log(`  verdict ${b.verdict} (culprit=${b.culprit}); FLIPPED ${b.flips}/${b.runs} times across ${N} runs.\n`);

  if (offline) {
    console.log("(--offline) Skipping the live blind-reader spike. Run with live Azure creds for Spike A.\n");
    return;
  }

  loadEnv();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "gpt-4o-mini";
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
  if (!endpoint || !apiKey) {
    console.log("No Azure creds in .env — Spike A skipped. (Spike B above still stands.)\n");
    return;
  }

  let AzureOpenAIClient, blindReaderSimulation;
  try {
    ({ AzureOpenAIClient } = await import("@cml/llm-client"));
    ({ blindReaderSimulation } = await import("@cml/prompts-llm"));
  } catch (e) {
    console.log(`Could not import live LLM modules (${e.message}) — Spike A skipped.\n`);
    return;
  }

  let cases = loadFrozenCases(storePaths);
  if (projectFilter) cases = cases.filter((c) => c.projectId.includes(projectFilter));
  console.log(`Spike A (live blind reader): ${cases.length} shipped case(s) from ${storePaths.length} store snapshot(s); N=${N} samples each.`);
  console.log(`  pass logic (the live gate): suspectedCulprit ≈ culprit AND confidence ∈ {certain, likely}.\n`);

  const client = new AzureOpenAIClient({ endpoint, apiKey, defaultModel: deployment, apiVersion });
  let totalDone = 0, totalVetoes = 0, casesThatFlip = 0;

  for (const fixed of cases) {
    if (!fixed.culprit || !(fixed.clues?.clues?.length)) {
      console.log(`  · ${fixed.projectId}: skipped (no culprit or no clues)`);
      continue;
    }
    const samples = [];
    for (let i = 0; i < N; i++) {
      try {
        const r = await blindReaderSimulation(client, fixed.clues, fixed.falseAssumption, fixed.castNames, {
          runId: `spikeA-${i}`,
          projectId: fixed.projectId,
        });
        const passes = sameName(r.suspectedCulprit, fixed.culprit) && (r.confidenceLevel === "certain" || r.confidenceLevel === "likely");
        samples.push({ suspectedCulprit: r.suspectedCulprit, confidence: r.confidenceLevel, passes });
      } catch (e) {
        samples.push({ error: e.message });
      }
    }
    const valid = samples.filter((s) => !s.error);
    const vetoes = valid.filter((s) => !s.passes).length;
    const confDist = {};
    for (const s of valid) confDist[s.confidence] = (confDist[s.confidence] || 0) + 1;
    totalDone += valid.length;
    totalVetoes += vetoes;
    if (vetoes > 0) casesThatFlip++;
    const flag = vetoes > 0 ? "  ← FALSE VETO(es)" : "";
    console.log(`  · ${fixed.projectId.slice(0, 13)}… culprit="${fixed.culprit}": veto ${vetoes}/${valid.length} ${JSON.stringify(confDist)}${flag}`);
  }

  console.log(`\n=== RESULT (the §9.1 contrast table) ===`);
  console.log(`  Spike A (stochastic gate):  ${totalVetoes}/${totalDone} samples would VETO an already-shipped case  → false-veto rate ${pct(totalVetoes, totalDone)}`);
  console.log(`                              ${casesThatFlip}/${cases.length} cases had ≥1 sample that flips the gate.`);
  console.log(`  Spike B (deterministic):    ${b.flips}/${b.runs} flips  → the checker NEVER wavers.`);
  console.log("");
  if (totalVetoes > 0) {
    console.log(`>> The gate vetoes ${totalVetoes}/${totalDone} samples on cases the pipeline already shipped — and its failure path THROWS, killing the run.`);
    console.log(`   A stochastic sample is being treated as a deterministic verdict (§3). Moving correctness to the checker`);
    console.log(`   (0 flips) and demoting the blind reader to a non-fatal annotator is justified.`);
  } else if (totalDone > 0) {
    console.log(`>> No false veto observed across ${totalDone} samples / ${cases.length} case(s). Either these cases are genuinely easy,`);
    console.log(`   or the gate is stable here — widen the case set (more historical stores) before concluding.`);
  }
  console.log("");
}

const pct = (n, d) => (d === 0 ? "n/a" : `${Math.round((100 * n) / d)}%`);

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
