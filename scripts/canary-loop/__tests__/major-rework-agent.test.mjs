import test from "node:test";
import assert from "node:assert/strict";
import fs from "fs/promises";
import path from "path";
import os from "os";
import {
  initMajorReworkBudgetState,
  evaluateWaveAdmissibility,
  buildMajorReworkWavePlan,
  classifyRollbackDecision,
  writeMajorReworkTodos,
  finalizeMajorReworkTodos,
  validateMajorReworkTodoPayload,
  appendMajorReworkLearning,
  loadMajorReworkLearning,
} from "../rework.mjs";

test("wave admissibility blocks when token demand exceeds campaign budget", () => {
  const config = {
    maxThinkTokensPerWave: 1000,
    maxActTokensPerWave: 1000,
    maxCampaignTokens: 1500,
    minRemainingPercentForBroadWork: 10,
    maxFilesPerWave: 3,
  };
  const budget = initMajorReworkBudgetState(config);
  const admissibility = evaluateWaveAdmissibility({
    config,
    budgetState: budget,
    tokenDemand: {
      thinkTokens: 900,
      actTokens: 900,
      total: 1800,
    },
    targetFiles: ["a", "b"],
  });

  assert.equal(admissibility.allowed, false);
  assert.equal(admissibility.blockedBy.includes("campaign_tokens_insufficient"), true);
});

test("wave planner emits P1 before prior phase completion", () => {
  const config = {
    maxThinkTokensPerWave: 35000,
    maxActTokensPerWave: 20000,
    maxCampaignTokens: 180000,
    minRemainingPercentForBroadWork: 15,
    maxFilesPerWave: 4,
  };
  const budget = initMajorReworkBudgetState(config);

  const wave = buildMajorReworkWavePlan({
    runId: "run_1",
    iteration: 2,
    signature: {
      class: "agent6.fairplay_structural_critical",
    },
    selectedPlaybooks: ["pb.rework.llm-request-contract-overhaul"],
    validationPlan: {
      testCommands: ["npm run -w @cml/worker test"],
      canaryCommand: "node scripts/canary-agent-boundary.mjs --agent 6",
    },
    gateStatus: {
      p1Complete: false,
      p2Complete: false,
    },
    config,
    budgetState: budget,
  });

  assert.equal(wave.phase, "P1");
  assert.equal(wave.admissibility.allowed, true);
});

test("wave planner uses provided monotonic wave ordinal", () => {
  const config = {
    maxThinkTokensPerWave: 35000,
    maxActTokensPerWave: 20000,
    maxCampaignTokens: 180000,
    minRemainingPercentForBroadWork: 15,
    maxFilesPerWave: 4,
  };
  const budget = initMajorReworkBudgetState(config);

  const wave = buildMajorReworkWavePlan({
    runId: "run_1",
    iteration: 1,
    waveOrdinal: 7,
    signature: {
      class: "agent6.fairplay_structural_critical",
    },
    selectedPlaybooks: ["pb.rework.llm-request-contract-overhaul"],
    validationPlan: {
      testCommands: ["npm run -w @cml/worker test"],
      canaryCommand: "node scripts/canary-agent-boundary.mjs --agent 6",
    },
    gateStatus: {
      p1Complete: false,
      p2Complete: false,
    },
    config,
    budgetState: budget,
  });

  assert.equal(wave.waveId, "MR-P1-W7");
});

test("rollback decision chooses whole mode for generic fallback regression", () => {
  const decision = classifyRollbackDecision({
    previousSignature: {
      class: "agent6.fairplay_structural_critical",
      severity: "critical",
    },
    outputSignature: {
      class: "canary.execution_failure",
      severity: "critical",
    },
    deltaAssessment: "regressed",
    decision: "stop",
    partialRollbackEnabled: true,
    confidence: 0.9,
    changedFiles: ["a.ts", "b.ts"],
  });

  assert.equal(decision.mode, "whole");
  assert.equal(decision.revertedFiles.length, 2);
});

test("todo and learning artifacts persist for major rework waves", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "major-rework-agent-"));
  const outputDir = path.join(tempRoot, "logs", "canary-loops", "canary-loop-260421-1200");
  await fs.mkdir(outputDir, { recursive: true });

  const wavePlan = {
    campaignId: "MR-run_1",
    waveId: "MR-P1-W1",
    phase: "P1",
    ownerRole: "Planner",
    tasks: ["Execute pb.rework.llm-request-contract-overhaul"],
    targetFiles: ["scripts/canary-loop/**"],
    tests: ["npm run -w @cml/worker test"],
    canaryCommand: "node scripts/canary-agent-boundary.mjs --agent 6",
    expectedEvidence: ["output signature differs"],
    stopIf: ["generic execution fallback appears"],
    budgetSnapshot: {
      remainingCampaignTokens: 1000,
      remainingWaveThinkTokens: 500,
      remainingWaveActTokens: 500,
    },
  };

  const todoPaths = await writeMajorReworkTodos({ outputDir, wavePlan });
  assert.equal(todoPaths.wavePath.endsWith("wave-MR-P1-W1.todo.json"), true);

  const learningPath = await appendMajorReworkLearning({
    outputDir,
    runId: "run_1",
    campaignId: "MR-run_1",
    signatureClass: "agent6.fairplay_structural_critical",
    rootCauseLayer: "runtime_validation",
    entry: {
      phase: "P1",
      waveId: "MR-P1-W1",
      selectedPlaybooks: ["pb.rework.llm-request-contract-overhaul"],
      outcome: "continue",
      deltaAssessment: "improved",
      rollbackMode: "none",
      keptFiles: [],
      revertedFiles: [],
      recommendationTags: ["retry"],
    },
  });

  assert.equal(learningPath.endsWith("major-rework-learning.json"), true);
  const learning = await loadMajorReworkLearning({ outputDir });
  assert.equal(Array.isArray(learning?.entries), true);
  assert.equal(learning.entries.length, 1);
});

test("todo payload validator rejects missing task evidence fields", () => {
  assert.throws(() => {
    validateMajorReworkTodoPayload({
      campaign: {
        campaignId: "MR-run_1",
        status: "in-progress",
      },
      phase: {
        phase: "P1",
        status: "in-progress",
      },
      wave: {
        waveId: "MR-P1-W1",
        phase: "P1",
        status: "in-progress",
        tasks: [
          {
            id: "MR-P1-W1-T1",
            title: "execute",
            owner: "Planner",
            status: "not-started",
            expectedEvidence: [],
            doneWhen: [],
          },
        ],
      },
    });
  }, /expectedEvidence/i);
});

test("writeMajorReworkTodos auto-completes prior in-progress wave when advancing", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "major-rework-agent-wave-lock-"));
  const outputDir = path.join(tempRoot, "logs", "canary-loops", "canary-loop-260421-1300");
  const labDir = path.join(outputDir, "rework-lab");
  await fs.mkdir(labDir, { recursive: true });
  await fs.writeFile(
    path.join(labDir, "wave-MR-P1-W0.todo.json"),
    `${JSON.stringify({ waveId: "MR-P1-W0", status: "in-progress" }, null, 2)}\n`,
    "utf8"
  );

  const paths = await writeMajorReworkTodos({
    outputDir,
    wavePlan: {
      campaignId: "MR-run_1",
      waveId: "MR-P1-W1",
      phase: "P1",
      ownerRole: "Planner",
      tasks: ["Execute pb.rework.llm-request-contract-overhaul"],
      targetFiles: ["scripts/canary-loop/**"],
      tests: ["npm run -w @cml/worker test"],
      canaryCommand: "node scripts/canary-agent-boundary.mjs --agent 6",
      expectedEvidence: ["output signature differs"],
      stopIf: ["generic execution fallback appears"],
      budgetSnapshot: {
        remainingCampaignTokens: 1000,
        remainingWaveThinkTokens: 500,
        remainingWaveActTokens: 500,
      },
    },
  });

  const priorWave = JSON.parse(
    await fs.readFile(path.join(labDir, "wave-MR-P1-W0.todo.json"), "utf8")
  );
  assert.equal(priorWave.status, "completed");
  assert.match(String(priorWave.completionReason ?? ""), /superseded_by_MR-P1-W1/i);
  assert.equal(paths.wavePath.endsWith("wave-MR-P1-W1.todo.json"), true);
});

test("finalizeMajorReworkTodos closes in-progress campaign and phase files", async () => {
  const tempRoot = await fs.mkdtemp(path.join(os.tmpdir(), "major-rework-agent-finalize-"));
  const outputDir = path.join(tempRoot, "logs", "canary-loops", "canary-loop-260421-1301");
  const labDir = path.join(outputDir, "rework-lab");
  await fs.mkdir(labDir, { recursive: true });

  await fs.writeFile(
    path.join(labDir, "campaign-todo.json"),
    `${JSON.stringify({ campaignId: "MR-run_1", status: "in-progress", activePhase: "P3" }, null, 2)}\n`,
    "utf8"
  );
  await fs.writeFile(
    path.join(labDir, "phase-P3.todo.json"),
    `${JSON.stringify({ phase: "P3", status: "in-progress" }, null, 2)}\n`,
    "utf8"
  );

  await finalizeMajorReworkTodos({
    outputDir,
    terminalStatus: "stop_apply_policy",
    completionReason: "safety_stop",
  });

  const campaign = JSON.parse(await fs.readFile(path.join(labDir, "campaign-todo.json"), "utf8"));
  const phase = JSON.parse(await fs.readFile(path.join(labDir, "phase-P3.todo.json"), "utf8"));

  assert.equal(campaign.status, "stopped");
  assert.equal(campaign.terminalStatus, "stop_apply_policy");
  assert.equal(phase.status, "stopped");
  assert.equal(phase.completionReason, "safety_stop");
});
