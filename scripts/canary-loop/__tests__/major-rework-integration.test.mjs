import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
  initMajorReworkBudgetState,
  shouldTakeMajorReworkCheckpoint,
  writeMajorReworkCheckpoint,
  assessMajorReworkDelta,
} from "../rework.mjs";

test("checkpoint writer persists deterministic checkpoint payload", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "major-rework-checkpoint-"));
  const outDir = path.join(tempRoot, "logs", "canary-loops", "canary-loop-260421-1300");
  await fs.mkdir(outDir, { recursive: true });

  const budget = initMajorReworkBudgetState({ maxCampaignTokens: 10000 });
  budget.consumedCampaignTokens = 9200;
  budget.remainingCampaignTokens = 800;

  const checkpointPath = await writeMajorReworkCheckpoint({
    outputDir: outDir,
    runId: "run_2",
    iteration: 4,
    phase: "P2",
    signatureClass: "agent6.fairplay_structural_critical",
    budgetState: budget,
    reason: "token_budget_threshold",
  });

  const payload = JSON.parse(await fs.readFile(checkpointPath, "utf8"));
  assert.equal(payload.iteration, 4);
  assert.equal(payload.phase, "P2");
});

test("checkpoint trigger activates when remaining budget is below threshold", () => {
  const config = {
    maxCampaignTokens: 10000,
    minRemainingPercentForBroadWork: 15,
  };
  const budget = {
    remainingCampaignTokens: 1200,
  };
  const should = shouldTakeMajorReworkCheckpoint({
    config,
    budgetState: budget,
    nextTokenDemand: {
      total: 1500,
    },
  });

  assert.equal(should, true);
});

test("delta assessment marks mixed when class changes but warnings remain", () => {
  const delta = assessMajorReworkDelta({
    previousSignature: {
      class: "agent6.fairplay_structural_critical",
      severity: "critical",
    },
    outputSignature: {
      class: "agent6.runtime_null_guard",
      severity: "warning",
    },
    validation: {
      canary: {
        warningsCount: 2,
      },
    },
  });

  assert.equal(delta.deltaAssessment, "mixed");
  assert.equal(delta.observedEvidence.length >= 2, true);
});

test("delta assessment marks regressed when severity worsens", () => {
  const delta = assessMajorReworkDelta({
    previousSignature: {
      class: "agent5.discriminating_id_coverage",
      severity: "warning",
    },
    outputSignature: {
      class: "agent5.invalid_source_path",
      severity: "critical",
    },
    validation: {
      canary: {
        warningsCount: 0,
      },
    },
  });

  assert.equal(delta.deltaAssessment, "regressed");
});
