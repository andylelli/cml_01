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
  const outDir = path.join(tempRoot, "documentation", "analysis", "canary-loops");
  await fs.mkdir(outDir, { recursive: true });

  const ledger = {
    workspaceRoot: tempRoot,
    jsonlPath: path.join(outDir, "example.jsonl"),
    mdPath: path.join(outDir, "example.md"),
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

  const runSummaryPath = path.join(outDir, "example.summary.json");
  const dashboardPath = path.join(outDir, "SUMMARY.json");

  const runSummary = JSON.parse(await fs.readFile(runSummaryPath, "utf8"));
  const dashboard = JSON.parse(await fs.readFile(dashboardPath, "utf8"));

  assert.equal(runSummary.totals.iterations, 2);
  assert.equal(runSummary.totals.deterministicFallbackCount, 1);
  assert.equal(dashboard.runCount >= 1, true);
});
