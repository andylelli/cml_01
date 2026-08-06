/**
 * Rubric-score live spike (aligning-the-scoring-system.md §8.2). Wires the LIVE Azure judge into
 * `scoreStory` and runs it on synthetic mysteries to demonstrate the full loop end-to-end:
 * critic scores the prose → the deterministic cap engine enforces the hard caps.
 *
 * Three cases prove the design:
 *   1. CLEAN     — a coherent mini-mystery → a normal rubric score, no caps.
 *   2. LEAKY     — the same prose + one validation-text line → Prose capped ≤4, overall ≤65 (the
 *                  deterministic extractor OVERRIDES however the critic scored Prose).
 *   3. COLLISION — the same clean prose but the CASE makes culprit == victim → capped ≤55 regardless
 *                  of the critic's marks (the gate-inversion: a good draft with a continuity defect
 *                  cannot score highly).
 *
 * Needs live Azure creds (root .env) + TLS via system CA:
 *   node --use-system-ca scripts/rubric-score-spike.mjs
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createLLMRubricJudge, scoreStory } from "../packages/rubric-score/dist/index.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// `.env.local` FIRST, then `.env`, first-wins — the precedence every production loader has had
// since X7. Reading `.env` alone meant scoring against the key the pipeline ignores (REVIEW_05 §20.2).
function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const p = path.join(repoRoot, name);
    if (!fs.existsSync(p)) continue;
    for (const line of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/.exec(line);
      if (m && process.env[m[1]] == null) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  }
}

// ── a short, coherent mini-mystery (named victim, distinct culprit, a planted clue, a reveal) ──
const CLEAN_PROSE = `Chapter 1. Lord Ashby was found slumped over his study desk at Wraith Hall, the decanter still warm at his elbow. Inspector Gray noted the stopped mantel clock — half past nine — and the faint almond scent on the glass.

Chapter 2. Dr. Vane, the family physician, insisted he had left before nine; Mrs. Carrow, the housekeeper, swore the clock had chimed the hour after Vane's car pulled away. Gray turned the two accounts over like cards.

Chapter 3. The stopped clock had been wound back. A second timepiece in the hall, and the gardener's memory of the chime, fixed the true hour: Ashby died nearer ten, when only Vane — who had doubled back — could have reached the study.

Chapter 4. Confronted with the wound clock and the almond traces on his own cuff, Vane confessed: he had poisoned the brandy and reset the clock to buy an alibi. Gray closed the case as the rain came on.`;

const LEAKY_PROSE = CLEAN_PROSE.replace(
  "Gray turned the two accounts over like cards.",
  "Gray turned the two accounts over like cards. The elapsed time was confirmed as forty minutes. The chapter moves forward through vivid detail instead than recap.",
);

const CASE_CLEAN = {
  cast: [
    { name: "Inspector Gray", role: "detective" },
    { name: "Lord Ashby", role: "victim" },
    { name: "Dr. Vane", role: "suspect" },
    { name: "Mrs. Carrow", role: "suspect" },
  ],
  culpability: { culprits: ["Dr. Vane"] },
};
const CASE_COLLISION = { ...CASE_CLEAN, culpability: { culprits: ["Lord Ashby"] } }; // culprit == victim

function report(label, r) {
  console.log(`\n── ${label} ──`);
  console.log(`  FINAL: ${r.final}/100  (${r.band})   rawTotal(before caps): ${r.rawTotal}`);
  console.log(`  categories: ${r.categories.map((c) => `${c.category} ${c.mark}${c.capped ? "*" : ""}`).join(", ")}`);
  if (r.capsApplied.length) console.log(`  caps applied:\n    - ${r.capsApplied.join("\n    - ")}`);
  if (r.rubric.main_problems?.length) console.log(`  judge main problems: ${r.rubric.main_problems.slice(0, 3).join(" | ")}`);
  if (r.rubric.fastest_fixes?.length) console.log(`  fastest fixes: ${r.rubric.fastest_fixes.slice(0, 2).join(" | ")}`);
}

async function main() {
  loadEnv();
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT || "";
  const apiKey = process.env.AZURE_OPENAI_API_KEY || "";
  // X14 — M1b re-scores through this script. A silent fallback would re-baseline the judge on a
  // different model than the runs it is scoring, which is the one thing a calibration must not do.
  const deployment = process.env.AZURE_OPENAI_DEPLOYMENT_NAME || "";
  if (!deployment) {
    throw new Error(
      "AZURE_OPENAI_DEPLOYMENT_NAME is not set. It is deliberately not defaulted (REVIEW_05 X14): " +
        "scoring on a different model than the runs being scored silently invalidates the comparison.",
    );
  }
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2024-10-21";
  if (!endpoint || !apiKey) {
    console.log("No Azure creds in .env — cannot run the live rubric judge.");
    return;
  }
  const { AzureOpenAIClient } = await import("@cml/llm-client");
  const client = new AzureOpenAIClient({ endpoint, apiKey, defaultModel: deployment, apiVersion });

  const chat = (args) => client.chat({ ...args, model: args.model || deployment, logContext: { agent: "RubricScorer" } });
  const judge = createLLMRubricJudge(chat, { model: deployment, temperature: 0.2, maxTokens: 3000 });

  console.log("=== Rubric-score live spike — LLM critic + deterministic cap engine ===");

  const clean = await scoreStory({ prose: CLEAN_PROSE, cml: CASE_CLEAN, judge });
  report("1. CLEAN (coherent mini-mystery)", clean);

  const leaky = await scoreStory({ prose: LEAKY_PROSE, cml: CASE_CLEAN, judge });
  report("2. LEAKY (same story + validation-text leakage)", leaky);

  const collision = await scoreStory({ prose: CLEAN_PROSE, cml: CASE_COLLISION, judge });
  report("3. COLLISION (same clean prose, but CASE makes culprit == victim)", collision);

  const proseMark = (r) => r.categories.find((c) => c.category === "prose")?.mark ?? "?";
  console.log("\n=== READ ===");
  console.log(`  Leakage: Prose ${proseMark(clean)} → ${proseMark(leaky)} (capped ≤4), overall ${clean.final} → ${leaky.final}.`);
  console.log(`  Collision: the critic scored the SAME prose, but the culprit==victim fact capped overall ${clean.final} → ${collision.final} (≤55).`);
  console.log(`  >> The critic judges the prose; the checker enforces the facts. A good draft with a continuity defect cannot score highly.\n`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
