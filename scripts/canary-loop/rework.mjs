const MAJOR_REWORK_PREFIX = "pb.rework.";

export function hasMajorReworkPlaybook(selectedPlaybooks) {
  return (selectedPlaybooks ?? []).some((id) => String(id).startsWith(MAJOR_REWORK_PREFIX));
}

export function buildMajorReworkPacket({
  agent,
  agentScope,
  signature,
  rootCause,
  retryFeedbackPacket,
  selectedPlaybooks,
  iteration,
}) {
  const signatureClass = String(signature?.class ?? "unknown");
  const stage = String(signature?.stage ?? "unknown");
  const agentId = String(agent ?? "unknown");

  return {
    generatedAt: new Date().toISOString(),
    iteration,
    agent: agentId,
    trigger: {
      signatureClass,
      stage,
      rootCauseLayer: String(rootCause?.sourceLayer ?? "unknown"),
      message: String(signature?.message ?? "n/a"),
    },
    selectedPlaybooks: [...(selectedPlaybooks ?? [])],
    scope: {
      agents: Array.isArray(agentScope?.agents) ? agentScope.agents : [agentId],
      agentCodes: Array.isArray(agentScope?.agentCodes) ? agentScope.agentCodes : [],
      rationale:
        String(agentScope?.rationale ?? "Major rework scoped to currently selected agent only."),
    },
    objective:
      "Enable sweeping redesign of request contracts, response processing, and logic-validation architecture while preserving safety and rollbackability.",
    redesignTracks: [
      buildLlmContractTrack(signatureClass),
      buildResponseProcessingTrack(signatureClass),
      buildStoryLogicTrack(signatureClass),
    ],
    evaluation: {
      requiredImprovements: [
        "No generic execution-failure regression.",
        "Reduced unresolved warning count versus baseline run.",
        "No A->B->A oscillation for the target signature class.",
      ],
      acceptanceGate: [
        "At least one target class changes from critical to warning or resolves.",
        "Canary run reaches a strictly better terminal status than previous failed run.",
      ],
    },
    safety: {
      rollbackPolicy: [
        "If redesign causes generic execution failure, rollback all redesign-touching files.",
        "If redesign partially improves signature class, keep only focused agent files via partial rollback.",
      ],
      constraintsFromRetryPacket: {
        mustFix: retryFeedbackPacket?.mustFix ?? [],
        warningsToClear: retryFeedbackPacket?.warningsToClear ?? [],
        requiredReplacements: retryFeedbackPacket?.requiredReplacements ?? [],
      },
    },
  };
}

export function inferMajorReworkAgentScope({
  primaryAgentCode,
  classHistory = [],
  historicalFailureClasses = [],
  pipelineOrder = [],
}) {
  const implicatedCodes = new Set();
  if (primaryAgentCode) {
    implicatedCodes.add(String(primaryAgentCode).toLowerCase());
  }

  for (const className of [...classHistory, ...historicalFailureClasses]) {
    const code = inferAgentCodeFromClass(className);
    if (code) {
      implicatedCodes.add(code);
    }
  }

  const codes = [...implicatedCodes].filter(Boolean);
  const pipeline = Array.isArray(pipelineOrder) ? pipelineOrder.map((value) => String(value).toLowerCase()) : [];
  if (codes.length >= 2 && pipeline.length > 0) {
    const indices = codes
      .map((code) => pipeline.indexOf(code))
      .filter((index) => Number.isInteger(index) && index >= 0);
    if (indices.length >= 2) {
      const low = Math.min(...indices);
      const high = Math.max(...indices);
      for (let i = low; i <= high; i += 1) {
        implicatedCodes.add(pipeline[i]);
      }
    }
  }

  const orderedCodes = pipeline.length
    ? [...implicatedCodes].sort((a, b) => {
      const ai = pipeline.indexOf(a);
      const bi = pipeline.indexOf(b);
      if (ai < 0 && bi < 0) return String(a).localeCompare(String(b));
      if (ai < 0) return 1;
      if (bi < 0) return -1;
      return ai - bi;
    })
    : [...implicatedCodes].sort();

  return {
    agentCodes: orderedCodes,
    agents: orderedCodes.map((code) => `Agent${code}`),
    rationale:
      orderedCodes.length > 1
        ? "Scope inferred from cross-agent failure signatures and historical unresolved classes."
        : "Only one strongly implicated agent detected from available failure signals.",
  };
}

function inferAgentCodeFromClass(className) {
  const normalized = String(className ?? "").toLowerCase().trim();
  const agentMatch = normalized.match(/^agent([0-9]+[a-z]?)\./i);
  if (agentMatch) {
    return String(agentMatch[1]).toLowerCase();
  }
  if (normalized.startsWith("cml.")) {
    return "3";
  }
  return null;
}

export function renderMajorReworkBrief(packet) {
  const lines = [
    "# Major Rework Brief",
    "",
    `- generatedAt: \`${packet.generatedAt}\``,
    `- iteration: \`${packet.iteration}\``,
    `- agent: \`${packet.agent}\``,
    `- trigger class: \`${packet.trigger.signatureClass}\``,
    `- stage: \`${packet.trigger.stage}\``,
    `- root cause layer: \`${packet.trigger.rootCauseLayer}\``,
    `- agents in scope: \`${(packet.scope?.agents ?? []).join(", ") || "none"}\``,
    "",
    "## Scope",
    "",
    `- rationale: ${packet.scope?.rationale ?? "n/a"}`,
    "",
    "## Objective",
    "",
    packet.objective,
    "",
    "## Redesign Tracks",
    "",
  ];

  for (const track of packet.redesignTracks ?? []) {
    lines.push(`### ${track.id}`);
    lines.push(`- hypothesis: ${track.hypothesis}`);
    lines.push("- interventions:");
    for (const item of track.interventions ?? []) {
      lines.push(`  - ${item}`);
    }
    lines.push("- target files:");
    for (const item of track.targetFiles ?? []) {
      lines.push(`  - ${item}`);
    }
    lines.push("- success checks:");
    for (const item of track.successChecks ?? []) {
      lines.push(`  - ${item}`);
    }
    lines.push("");
  }

  lines.push("## Evaluation");
  lines.push("");
  lines.push("- required improvements:");
  for (const item of packet.evaluation?.requiredImprovements ?? []) {
    lines.push(`  - ${item}`);
  }
  lines.push("- acceptance gate:");
  for (const item of packet.evaluation?.acceptanceGate ?? []) {
    lines.push(`  - ${item}`);
  }
  lines.push("");

  lines.push("## Safety");
  lines.push("");
  for (const item of packet.safety?.rollbackPolicy ?? []) {
    lines.push(`- ${item}`);
  }
  lines.push("");

  return `${lines.join("\n")}\n`;
}

function buildLlmContractTrack(signatureClass) {
  return {
    id: "Track 1 - LLM Request Contract Overhaul",
    hypothesis:
      `The current prompt schema is under-constrained for '${signatureClass}', allowing non-deterministic structural drift.`,
    interventions: [
      "Add strict output contract sections with mandatory machine-checkable markers.",
      "Require explicit evidence-to-inference mapping tokens in each generated artifact.",
      "Inject anti-regression constraints that ban previously failing structural patterns.",
    ],
    targetFiles: [
      "packages/prompts-llm/**",
      "packages/prompts/**",
      "apps/worker/src/jobs/agents/*-run.ts",
    ],
    successChecks: [
      "Generated payloads include all required marker sections with no null placeholders.",
      "Retry packet must_fix list is fully represented in prompt constraints.",
    ],
  };
}

function buildResponseProcessingTrack(signatureClass) {
  return {
    id: "Track 2 - Response Processing Robustness",
    hypothesis:
      `Parser/normalizer pathways do not gracefully recover malformed LLM outputs for '${signatureClass}'.`,
    interventions: [
      "Introduce layered parser pipeline: strict parse -> bounded recovery -> semantic validator.",
      "Add explicit normalization for ID references and source-path resolution.",
      "Emit stage-specific error codes instead of generic execution-failure buckets.",
    ],
    targetFiles: [
      "apps/worker/src/jobs/agents/**",
      "scripts/canary-agent-boundary.mjs",
      "scripts/canary-loop/signatures.mjs",
    ],
    successChecks: [
      "No output collapsed to unknown.pipeline_failure when stage-level cause is available.",
      "Error payload includes deterministic stage markers and remediation hints.",
    ],
  };
}

function buildStoryLogicTrack(signatureClass) {
  return {
    id: "Track 3 - Story Logic Research Lab",
    hypothesis:
      `Believability and logical soundness failures stem from weak structural planning invariants for '${signatureClass}'.`,
    interventions: [
      "Add contradiction and fair-play invariants as first-class constraints before prose generation.",
      "Use discriminating-test timing and evidence parity as hard gates, not warnings.",
      "Create an internal design loop that compares candidate story structures before final selection.",
    ],
    targetFiles: [
      "packages/story-validation/**",
      "apps/worker/src/jobs/agents/agent5-run.ts",
      "apps/worker/src/jobs/agents/agent6-run.ts",
    ],
    successChecks: [
      "Fair-play structural violations trend downward across two consecutive runs.",
      "Discriminating evidence and clue traceability pass without fallback patches.",
    ],
  };
}
