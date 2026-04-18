import test from "node:test";
import assert from "node:assert/strict";
import { classifyFailureText } from "../signatures.mjs";
import { buildRetryFeedbackPacket, selectPlaybooks } from "../playbooks.mjs";
import {
  decideLoopContinuation,
  hasUnresolvedWarnings,
  resolvePassState,
} from "../controller.mjs";
import { resolveValidationPlan } from "../validate.mjs";

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
      confidence: 0.4,
    },
  });

  assert.equal(lowConfidenceStop.decision, "stop");
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
