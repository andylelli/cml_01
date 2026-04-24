import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
  loadRegisteredAgentCodes,
  getAgentMappingConformance,
} from "../config.mjs";
import { acquireRunLock, releaseRunLock } from "../patches.mjs";
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

test("run lock acquisition auto-recovers stale lock files", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "canary-lock-recover-"));
  const lockDir = path.join(tempRoot, "logs", "canary-loops", ".locks");
  await fs.mkdir(lockDir, { recursive: true });

  const lockPath = path.join(lockDir, "run_stale-Agent6-FairPlay.lock");
  await fs.writeFile(lockPath, `${new Date(0).toISOString()}\n`, "utf8");
  const oldDate = new Date(Date.now() - (31 * 60 * 1000));
  await fs.utimes(lockPath, oldDate, oldDate);

  const lock = await acquireRunLock({
    workspaceRoot: tempRoot,
    runId: "run_stale",
    agent: "Agent6-FairPlay",
  });

  assert.ok(lock?.lockPath.endsWith("run_stale-Agent6-FairPlay.lock"));
  const metadataRaw = await fs.readFile(lock.lockPath, "utf8");
  const metadata = JSON.parse(metadataRaw.trim());
  assert.equal(Number.isInteger(metadata.pid), true);

  await releaseRunLock(lock);
  await fs.rm(tempRoot, { recursive: true, force: true });
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
        changedFiles: [
          path.join(tempRoot, "scripts", "canary-loop", "controller.mjs"),
          path.join(runDir, "artifact.md"),
        ],
        canary: { warningsCount: 1 },
        deterministicFallbackExceptions: ["deterministic_fallback:pb.code.agent5.id-normalize-seed-synthesize"],
      },
      {
        iteration: 2,
        decision: "stop",
        stopReason: "Wave admissibility blocked: target_files_exceed_wave_cap, think_tokens_exceed_wave_cap.",
        inputSignature: { class: "agent5.invalid_source_path" },
        majorRework: {
          state: "MR_WAVE_PLAN",
          phase: "P2",
          waveId: "MR-P2-W1",
        },
        changedFiles: [],
        canary: { warningsCount: 0 },
        deterministicFallbackExceptions: [],
      },
    ],
  };

  await updateTelemetryRollups({ ledger });

  const runSummaryPath = path.join(runDir, "canary-run-summary-example.json");
  const dashboardPath = path.join(runDir, "canary-dashboard-summary.json");
  const dashboardMarkdownPath = path.join(runDir, "canary-dashboard-summary.md");
  const attemptHistoryPath = path.join(runDir, "canary-attempt-history.json");
  const attemptHistoryMarkdownPath = path.join(runDir, "canary-attempt-history.md");

  const runSummary = JSON.parse(await fs.readFile(runSummaryPath, "utf8"));
  const dashboard = JSON.parse(await fs.readFile(dashboardPath, "utf8"));
  const attemptHistory = JSON.parse(await fs.readFile(attemptHistoryPath, "utf8"));
  const dashboardMarkdown = await fs.readFile(dashboardMarkdownPath, "utf8");
  const attemptHistoryMarkdown = await fs.readFile(attemptHistoryMarkdownPath, "utf8");

  assert.equal(runSummary.totals.iterations, 2);
  assert.equal(runSummary.totals.deterministicFallbackCount, 1);
  assert.equal(runSummary.totals.plannedNotExecutedWaveCount, 1);
  assert.equal(dashboard.admissibilityBlockerCounts.target_files_exceed_wave_cap, 1);
  assert.equal(dashboard.admissibilityBlockerCounts.think_tokens_exceed_wave_cap, 1);
  assert.equal(attemptHistory.stats.withChangedImplementationFiles, 1);
  assert.deepEqual(attemptHistory.attempts[0].changedImplementationFiles, [
    path.join(tempRoot, "scripts", "canary-loop", "controller.mjs"),
  ]);
  assert.equal(attemptHistory.attempts[1].majorReworkExecution, "planned_not_executed");
  assert.match(dashboardMarkdown, /Admissibility Blockers/i);
  assert.match(attemptHistoryMarkdown, /Terminal Reason Taxonomy/i);
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
