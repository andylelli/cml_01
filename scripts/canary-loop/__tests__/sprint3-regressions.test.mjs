import test from "node:test";
import assert from "node:assert/strict";
import { classifyFailureText } from "../signatures.mjs";
import { buildRetryFeedbackPacket, selectPlaybooks } from "../playbooks.mjs";
import {
  decideLoopContinuation,
  hasUnresolvedWarnings,
  resolveSelectedPlaybooks,
  resolvePassState,
} from "../controller.mjs";
import { resolveValidationPlan } from "../validate.mjs";
import {
  buildMajorReworkPacket,
  hasMajorReworkPlaybook,
  inferMajorReworkAgentScope,
  renderMajorReworkBrief,
} from "../rework.mjs";

test("signature normalization stays stable across volatile markers", () => {
  const base = classifyFailureText({
    agent: "Agent5-ClueExtraction",
    text: "run_bbfc28f0-eabc-451d-88f5-298ef4d6b779 attempt 3 required_evidence missing",
  });
  const variant = classifyFailureText({
    agent: "Agent5-ClueExtraction",
    text: "run_ffffffff-1111-2222-3333-aaaaaaaaaaaa attempt 9 required_evidence missing",
  });

  assert.equal(base.class, "cml.required_evidence_missing");
  assert.equal(base.signatureId, variant.signatureId);
});

test("suspect-coverage gate failures classify as agent5 weak elimination evidence", () => {
  const signature = classifyFailureText({
    agent: "Agent6-FairPlay",
    text: "Agent 5 suspect-coverage gate failed after retry. Weak elimination/alibi evidence: Dennis Simms",
  });

  assert.equal(signature.class, "agent5.weak_elimination_evidence");
  assert.equal(signature.stage, "clues");
  assert.equal(signature.confidence >= 0.8, true);
});

test("retry packet generation is deterministic", () => {
  const signature = {
    kind: "error",
    severity: "critical",
    class: "agent5.invalid_source_path",
    message: "Invalid source path at CASE.cast[9]",
  };
  const rootCause = {
    sourceLayer: "prompt_contract",
  };

  const first = buildRetryFeedbackPacket(signature, rootCause);
  const second = buildRetryFeedbackPacket(signature, rootCause);

  assert.deepEqual(first, second);
});

test("playbook selection enforces prompt-first before code escalation", () => {
  const signature = {
    class: "agent5.discriminating_id_coverage",
  };

  const promptDecision = selectPlaybooks(signature, {
    rootCauseLayer: "llm_output_shape",
    promptRetryCount: 1,
  });
  assert.equal(promptDecision.escalationStage, "prompt");
  assert.deepEqual(promptDecision.selectedPlaybooks, ["pb.prompt.source-bounds-and-id-traceability"]);

  const escalatedDecision = selectPlaybooks(signature, {
    rootCauseLayer: "llm_output_shape",
    promptRetryCount: 2,
  });
  assert.equal(escalatedDecision.escalationStage, "code");
  assert.deepEqual(escalatedDecision.selectedPlaybooks, ["pb.code.agent5.id-normalize-seed-synthesize"]);
});

test("playbook selection escalates when prompt playbook previously failed", () => {
  const signature = {
    class: "agent5.discriminating_id_coverage",
  };

  const decision = selectPlaybooks(signature, {
    rootCauseLayer: "llm_output_shape",
    promptRetryCount: 0,
    priorRunFailedPlaybooks: ["pb.prompt.source-bounds-and-id-traceability"],
  });

  assert.equal(decision.escalationStage, "code");
  assert.deepEqual(decision.selectedPlaybooks, ["pb.code.agent5.id-normalize-seed-synthesize"]);
});

test("playbook selection prefers prompt when code playbook previously failed", () => {
  const signature = {
    class: "agent6.fairplay_structural_critical",
  };

  const decision = selectPlaybooks(signature, {
    rootCauseLayer: "runtime_validation",
    promptRetryCount: 0,
    priorRunFailedPlaybooks: ["pb.code.agent6.structural-escalation-and-null-guard"],
  });

  assert.equal(decision.escalationStage, "prompt");
  assert.deepEqual(decision.selectedPlaybooks, ["pb.prompt.retry-packet-contract-harden"]);
});

test("playbook selection escalates to major rework after repeated unresolved history", () => {
  const signature = {
    class: "agent6.fairplay_structural_critical",
  };

  const decision = selectPlaybooks(signature, {
    rootCauseLayer: "runtime_validation",
    promptRetryCount: 4,
    historicalFailureCount: 5,
    enableMajorRework: true,
    oscillationDetected: true,
  });

  assert.equal(decision.escalationStage, "rework");
  assert.equal(decision.selectedPlaybooks.length >= 3, true);
  assert.match(decision.rationale, /major rework/i);
});

test("major rework escalation is not overridden by cached playbooks", () => {
  const selected = resolveSelectedPlaybooks({
    playbookDecision: {
      escalationStage: "rework",
      selectedPlaybooks: [
        "pb.rework.llm-request-contract-overhaul",
        "pb.rework.response-processing-robustness",
      ],
    },
    cachedFix: {
      playbooks: ["pb.prompt.red-herring-lexical-separation"],
    },
  });

  assert.deepEqual(selected, [
    "pb.rework.llm-request-contract-overhaul",
    "pb.rework.response-processing-robustness",
  ]);
});

test("cached playbooks still apply for non-rework escalation", () => {
  const selected = resolveSelectedPlaybooks({
    playbookDecision: {
      escalationStage: "prompt",
      selectedPlaybooks: ["pb.prompt.retry-packet-contract-harden"],
    },
    cachedFix: {
      playbooks: ["pb.code.agent5.id-normalize-seed-synthesize"],
    },
  });

  assert.deepEqual(selected, ["pb.code.agent5.id-normalize-seed-synthesize"]);
});

test("warning blocking and continuation transitions are bounded", () => {
  assert.equal(hasUnresolvedWarnings({ canary: { warningsCount: 1 } }), true);
  assert.equal(resolvePassState({ canary: { passed: true, warningsCount: 1 } }), false);
  assert.equal(resolvePassState({ canary: { passed: true, warningsCount: 0 } }), true);

  const transition = decideLoopContinuation({
    request: {
      maxIterations: 5,
      maxUnchanged: 2,
      stopOnNewFailureClass: true,
    },
    iteration: 2,
    unchangedCount: 1,
    previousSignature: {
      class: "agent5.invalid_source_path",
      severity: "critical",
    },
    outputSignature: {
      class: "agent5.invalid_source_path",
      severity: "critical",
      confidence: 0.95,
    },
  });

  assert.equal(transition.decision, "continue");

  const lowConfidenceStop = decideLoopContinuation({
    request: {
      mode: "apply",
      maxIterations: 5,
      maxUnchanged: 2,
      stopOnNewFailureClass: true,
    },
    iteration: 2,
    unchangedCount: 0,
    previousSignature: {
      class: "agent5.invalid_source_path",
      severity: "critical",
    },
    outputSignature: {
      class: "agent5.invalid_source_path",
      severity: "critical",
      confidence: 0.1,
    },
  });

  assert.equal(lowConfidenceStop.decision, "stop");
});

test("continuation bypasses low-confidence unknown class in apply mode with strong downstream markers", () => {
  const transition = decideLoopContinuation({
    request: {
      mode: "apply",
      maxIterations: 5,
      maxUnchanged: 2,
      stopOnNewFailureClass: true,
    },
    iteration: 2,
    unchangedCount: 0,
    previousSignature: {
      class: "unknown.pipeline_failure",
      severity: "critical",
    },
    outputSignature: {
      class: "unknown.pipeline_failure",
      severity: "critical",
      confidence: 0.1,
      message: "Agent 6 gate failed with critical fair-play validation failed markers",
      rawMarkers: ["Agent 6 gate failed", "critical fair-play"],
    },
  });

  assert.equal(transition.decision, "continue");
});

test("continuation stops on generic execution-class regression", () => {
  const transition = decideLoopContinuation({
    request: {
      maxIterations: 5,
      maxUnchanged: 2,
      stopOnNewFailureClass: false,
    },
    iteration: 2,
    unchangedCount: 0,
    previousSignature: {
      class: "agent6.fairplay_structural_critical",
      severity: "critical",
    },
    outputSignature: {
      class: "canary.execution_failure",
      severity: "critical",
      confidence: 0.95,
    },
    classHistory: ["agent6.fairplay_structural_critical"],
  });

  assert.equal(transition.decision, "stop");
  assert.match(transition.stopReason, /Regression detected/i);
});

test("continuation stops on oscillating failure classes", () => {
  const transition = decideLoopContinuation({
    request: {
      maxIterations: 8,
      maxUnchanged: 4,
      stopOnNewFailureClass: false,
    },
    iteration: 4,
    unchangedCount: 0,
    previousSignature: {
      class: "agent5.red_herring_overlap",
      severity: "critical",
    },
    outputSignature: {
      class: "agent6.fairplay_structural_critical",
      severity: "critical",
      confidence: 0.92,
    },
    classHistory: [
      "agent5.red_herring_overlap",
      "agent6.fairplay_structural_critical",
      "agent5.red_herring_overlap",
    ],
  });

  assert.equal(transition.decision, "stop");
  assert.match(transition.stopReason, /oscillating failure-class cycle/i);
});

test("Agent 9 startChapter propagates into canary command", () => {
  const resolved = resolveValidationPlan({
    request: {
      testScope: "targeted",
      startChapter: 3,
      canaryCommand: "node scripts/canary-agent9.mjs",
    },
    normalizedAgent: {
      code: "9",
      canonicalAgent: "Agent9-Prose",
    },
    artifactBundle: {},
  });

  assert.equal(resolved.errors.length, 0);
  assert.match(resolved.plan.canaryCommand, /--startChapter 3/);
});

test("major rework helper detects rework playbooks", () => {
  assert.equal(hasMajorReworkPlaybook(["pb.prompt.retry-packet-contract-harden"]), false);
  assert.equal(hasMajorReworkPlaybook(["pb.rework.llm-request-contract-overhaul"]), true);
});

test("major rework packet and brief are deterministic and structured", () => {
  const scope = inferMajorReworkAgentScope({
    primaryAgentCode: "6",
    classHistory: ["agent5.red_herring_overlap", "agent6.fairplay_structural_critical"],
    historicalFailureClasses: ["agent5.discriminating_id_coverage"],
    pipelineOrder: ["1", "2", "2e", "3b", "3", "5", "6", "4", "2b", "2c", "2d", "7", "65", "9"],
  });

  const packet = buildMajorReworkPacket({
    agent: "Agent6-FairPlay",
    agentScope: scope,
    signature: {
      class: "agent6.fairplay_structural_critical",
      stage: "fairplay",
      message: "Critical fair-play constraints failed.",
    },
    rootCause: {
      sourceLayer: "runtime_validation",
    },
    retryFeedbackPacket: {
      mustFix: ["fix parity"],
      warningsToClear: [],
      requiredReplacements: ["replace weak clue"],
    },
    selectedPlaybooks: ["pb.rework.story-logic-research-lab"],
    iteration: 3,
  });

  assert.equal(packet.agent, "Agent6-FairPlay");
  assert.equal(packet.redesignTracks.length, 3);
  assert.match(packet.objective, /sweeping redesign/i);
  assert.equal(packet.scope.agents.includes("Agent5"), true);
  assert.equal(packet.scope.agents.includes("Agent6"), true);

  const brief = renderMajorReworkBrief(packet);
  assert.match(brief, /Major Rework Brief/);
  assert.match(brief, /Track 3 - Story Logic Research Lab/);
  assert.match(brief, /agents in scope/i);
});
