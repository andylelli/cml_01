export function analyzeRootCause(signature) {
  if (!signature) {
    return {
      hypothesis: "No failure signature available for root-cause analysis.",
      confidence: 0.0,
      sourceLayer: "orchestrator_policy",
    };
  }

  if (signature.class.startsWith("agent5.")) {
    return {
      hypothesis:
        "Prompt contract and retry constraints for clue extraction are underspecified for this failure class.",
      confidence: 0.82,
      sourceLayer: "prompt_contract",
    };
  }

  if (signature.class.startsWith("agent6.")) {
    return {
      hypothesis:
        "Validation/runtime coupling is weak, causing structural fair-play violations to escape earlier checks.",
      confidence: 0.78,
      sourceLayer: "runtime_validation",
    };
  }

  if (signature.class.startsWith("cml.")) {
    return {
      hypothesis:
        "CML output shape constraints are not enforced strongly enough before downstream validation.",
      confidence: 0.76,
      sourceLayer: "llm_output_shape",
    };
  }

  if (signature.class.startsWith("orchestrator.")) {
    return {
      hypothesis: "Orchestrator threshold policy and retry escalation are misaligned.",
      confidence: 0.74,
      sourceLayer: "orchestrator_policy",
    };
  }

  return {
    hypothesis:
      "Insufficient deterministic markers to identify a stable root cause. Gather more agent-specific diagnostics.",
    confidence: 0.55,
    sourceLayer: "orchestrator_policy",
  };
}

export function buildRetryFeedbackPacket(signature, rootCause) {
  const mustFix = [];
  const warningsToClear = [];
  const forbiddenTerms = [];
  const requiredReplacements = [];
  const sourcePathBounds = [];

  if (signature.kind === "warning" || signature.severity === "warning") {
    warningsToClear.push(signature.message);
  } else {
    mustFix.push(signature.message);
  }

  if (signature.class === "agent5.red_herring_overlap") {
    forbiddenTerms.push("shared lexical stems between clues and red herrings");
    requiredReplacements.push("rephrase overlapping red-herring language with distinct semantics");
  }

  if (signature.class === "agent5.invalid_source_path") {
    sourcePathBounds.push("Use only valid CASE.* source paths with existing indices.");
  }

  if (signature.class === "cml.required_evidence_missing") {
    requiredReplacements.push("Populate required_evidence arrays for every inference step.");
  }

  return {
    mustFix,
    warningsToClear,
    forbiddenTerms: forbiddenTerms.length ? forbiddenTerms : undefined,
    requiredReplacements: requiredReplacements.length ? requiredReplacements : undefined,
    sourcePathBounds: sourcePathBounds.length ? sourcePathBounds : undefined,
    passContract: [
      "Return pass only when unresolved error and warning arrays are empty.",
      "Do not modify unaffected validated sections.",
      `Root cause focus: ${rootCause.sourceLayer}`,
    ],
  };
}

const PROMPT_PLAYBOOK_BY_CLASS = {
  "agent5.red_herring_overlap": "pb.prompt.red-herring-lexical-separation",
  "agent5.invalid_source_path": "pb.prompt.source-bounds-and-id-traceability",
  "agent5.discriminating_id_coverage": "pb.prompt.source-bounds-and-id-traceability",
  "agent6.fairplay_structural_critical": "pb.prompt.retry-packet-contract-harden",
  "agent6.runtime_null_guard": "pb.prompt.retry-packet-contract-harden",
  "cml.required_evidence_missing": "pb.prompt.retry-packet-contract-harden",
  "cml.schema_required_field_missing": "pb.prompt.retry-packet-contract-harden",
};

const CODE_PLAYBOOK_BY_CLASS = {
  "agent5.discriminating_id_coverage": "pb.code.agent5.id-normalize-seed-synthesize",
  "agent5.time_style_violation": "pb.code.agent5.time-style-sanitizer",
  "agent6.fairplay_structural_critical": "pb.code.agent6.structural-escalation-and-null-guard",
  "agent6.runtime_null_guard": "pb.code.agent6.structural-escalation-and-null-guard",
  "cml.required_evidence_missing": "pb.code.cml.required-evidence-repair",
  "cml.schema_required_field_missing": "pb.code.cml.schema-required-field-repair",
};

export function selectPlaybooks(signature, policyContext = {}) {
  const rootCauseLayer = policyContext.rootCauseLayer;
  const promptRetryCount = Number.isInteger(policyContext.promptRetryCount)
    ? policyContext.promptRetryCount
    : 0;

  const fallbackPrompt = "pb.prompt.retry-packet-contract-harden";
  if (!signature) {
    return {
      selectedPlaybooks: [fallbackPrompt],
      escalationStage: "prompt",
      rationale: "No signature class available; defaulting to prompt hardening playbook.",
    };
  }

  const promptPlaybook = PROMPT_PLAYBOOK_BY_CLASS[signature.class] ?? fallbackPrompt;
  const codePlaybook = CODE_PLAYBOOK_BY_CLASS[signature.class];

  const hasPromptRetriesExhausted = promptRetryCount >= 2;
  const runtimeOrPolicyRootCause =
    rootCauseLayer === "runtime_validation" || rootCauseLayer === "orchestrator_policy";

  if (!codePlaybook) {
    return {
      selectedPlaybooks: [promptPlaybook],
      escalationStage: "prompt",
      rationale: "No compatible code-mode playbook for signature class.",
    };
  }

  if (!hasPromptRetriesExhausted && !runtimeOrPolicyRootCause) {
    return {
      selectedPlaybooks: [promptPlaybook],
      escalationStage: "prompt",
      rationale:
        "Prompt-first policy active: run prompt-mode remediation before deterministic code fallback.",
    };
  }

  if (hasPromptRetriesExhausted) {
    return {
      selectedPlaybooks: [codePlaybook],
      escalationStage: "code",
      rationale: "Prompt-mode retries exhausted for class; escalating to deterministic code-mode playbook.",
    };
  }

  return {
    selectedPlaybooks: [codePlaybook],
    escalationStage: "code",
    rationale: "Root cause layer is runtime/policy; deterministic code-mode playbook is permitted.",
  };
}

export function buildPlannedActions({ signature, rootCause, retryPacket, selectedPlaybooks }) {
  const actions = [];
  actions.push(`Classified failure as ${signature.class} (${signature.kind}) at stage ${signature.stage}.`);
  actions.push(`Root cause hypothesis (${rootCause.sourceLayer}): ${rootCause.hypothesis}`);
  actions.push(`Selected playbook(s): ${selectedPlaybooks.join(", ")}`);
  if (retryPacket.mustFix.length) {
    actions.push(`Must-fix count: ${retryPacket.mustFix.length}`);
  }
  if (retryPacket.warningsToClear.length) {
    actions.push(`Warnings-to-clear count: ${retryPacket.warningsToClear.length}`);
  }
  return actions;
}
