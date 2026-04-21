import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
  loadRegisteredAgentCodes,
  getAgentMappingConformance,
} from "../config.mjs";
import { getCachedFix } from "../cache.mjs";
import { updateTelemetryRollups } from "../report.mjs";
import { classifyFailureText } from "../signatures.mjs";

test("all registered worker agents have canary/test mapping conformance", async () => {
  const registered = await loadRegisteredAgentCodes(process.cwd());
  const conformance = getAgentMappingConformance(registered);
  assert.equal(conformance.ok, true, conformance.issues.join(" | "));
});

test("signature fix cache safety blocks early code fallback", () => {
  const cache = {
    entries: {
      "Agent5-ClueExtraction|agent5.discriminating_id_coverage|llm_output_shape": {
        playbooks: ["pb.code.agent5.id-normalize-seed-synthesize"],
        updatedAt: new Date().toISOString(),
      },
    },
  };

  const blocked = getCachedFix({
    cache,
    agent: "Agent5-ClueExtraction",
    signature: {
      class: "agent5.discriminating_id_coverage",
    },
    rootCause: {
      sourceLayer: "llm_output_shape",
    },
    policyContext: {
      promptRetryCount: 1,
      rootCauseLayer: "llm_output_shape",
    },
  });

  assert.equal(blocked, null);

  const allowed = getCachedFix({
    cache,
    agent: "Agent5-ClueExtraction",
    signature: {
      class: "agent5.discriminating_id_coverage",
    },
    rootCause: {
      sourceLayer: "llm_output_shape",
    },
    policyContext: {
      promptRetryCount: 2,
      rootCauseLayer: "llm_output_shape",
    },
  });

  assert.equal(Array.isArray(allowed?.playbooks), true);
  assert.deepEqual(allowed?.playbooks, ["pb.code.agent5.id-normalize-seed-synthesize"]);
});

test("telemetry rollups produce run summary and dashboard artifacts", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "canary-rollup-"));
  const outDir = path.join(tempRoot, "logs", "canary-loops");
  const runDir = path.join(outDir, "canary-loop-260419-1400");
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(runDir, { recursive: true });

  const ledger = {
    workspaceRoot: tempRoot,
    jsonlPath: path.join(runDir, "example.jsonl"),
    mdPath: path.join(runDir, "example.md"),
    entries: [
      {
        iteration: 1,
        decision: "continue",
        inputSignature: { class: "agent5.invalid_source_path" },
        canary: { warningsCount: 1 },
        deterministicFallbackExceptions: ["deterministic_fallback:pb.code.agent5.id-normalize-seed-synthesize"],
      },
      {
        iteration: 2,
        decision: "stop",
        stopReason: "Signature remained unchanged.",
        inputSignature: { class: "agent5.invalid_source_path" },
        canary: { warningsCount: 0 },
        deterministicFallbackExceptions: [],
      },
    ],
  };

  await updateTelemetryRollups({ ledger });

  const runSummaryPath = path.join(runDir, "canary-run-summary-example.json");
  const dashboardPath = path.join(runDir, "canary-dashboard-summary.json");

  const runSummary = JSON.parse(await fs.readFile(runSummaryPath, "utf8"));
  const dashboard = JSON.parse(await fs.readFile(dashboardPath, "utf8"));

  assert.equal(runSummary.totals.iterations, 2);
  assert.equal(runSummary.totals.deterministicFallbackCount, 1);
  assert.equal(dashboard.runCount >= 1, true);
});

test("signature classifier does not treat fair-play discriminating test text as ID-coverage failure", () => {
  const text = [
    "CANARY_STATUS success",
    "WARNINGS_COUNT 7",
    "- [critical] Logical Deducibility: The reader cannot follow the inference path due to misleading witness statements.",
    "- [critical] Discriminating Test Timing: The discriminating test does not appear at the proper time.",
    "- [critical] Information Parity: The detective has information about the stopped clock that the reader does not.",
    "Fair play failure classified as \"clue_coverage\" but structural CML retry was skipped.",
  ].join("\n");

  const signature = classifyFailureText({
    agent: "Agent6-FairPlay",
    text,
    source: "validation_executor",
  });

  assert.notEqual(signature.class, "agent5.discriminating_id_coverage");
});

test("signature classifier does not treat timestamps as Agent5 time-style violations", () => {
  const text = [
    "2026-04-19T16:59:24.537Z [INFO] Agent6-FairPlayAuditor | chat_request",
    "2026-04-19T16:59:31.204Z [INFO] Agent6-FairPlayAuditor | chat_response",
    "WARNINGS [\"Fair play failure classified as clue_coverage\"]",
  ].join("\n");

  const signature = classifyFailureText({
    agent: "Agent6-FairPlay",
    text,
    source: "validation_executor",
  });

  assert.notEqual(signature.class, "agent5.time_style_violation");
});

test("signature classifier maps Agent5 evidence-clue warning markers to known warning class", () => {
  const text = [
    "CANARY_STATUS success",
    "WARNINGS_COUNT 2",
    "WARNINGS [\"Agent 5: removed non-canonical discriminating_test.evidence_clues entries; will rely on canonical clue IDs and deterministic backfill for traceability.\",\"Agent 5: seeded discriminating_test.evidence_clues from clue set: clue_7, clue_5, clue_4\"]",
  ].join("\n");

  const signature = classifyFailureText({
    agent: "Agent5-ClueExtraction",
    text,
    source: "validation_executor",
  });

  assert.equal(signature.class, "agent5.discriminating_id_coverage");
  assert.equal(signature.severity, "warning");
  assert.equal(signature.confidence >= 0.6, true);
});
