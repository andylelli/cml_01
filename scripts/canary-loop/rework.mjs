import fs from "fs/promises";
import path from "path";

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
    implementationPlan: buildImplementationPlan({
      agentId,
      signatureClass,
      stage,
      selectedPlaybooks,
    }),
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

  lines.push("## Multiphase Implementation Plan");
  lines.push("");
  for (const phase of packet.implementationPlan?.phases ?? []) {
    lines.push(`### ${phase.id} - ${phase.name}`);
    lines.push(`- objective: ${phase.objective}`);
    lines.push(`- owner: ${phase.owner ?? "n/a"}`);
    lines.push(`- estimated effort: ${phase.estimatedEffort ?? "n/a"}`);
    lines.push("- task bundles:");
    for (const task of phase.taskBundles ?? []) {
      lines.push(`  - ${task}`);
    }
    lines.push("- target files:");
    for (const target of phase.targetFiles ?? []) {
      lines.push(`  - ${target}`);
    }
    lines.push("- validation gates:");
    for (const gate of phase.validationGates ?? []) {
      lines.push(`  - ${gate}`);
    }
    if (phase.exitCriteria?.length) {
      lines.push("- exit criteria:");
      for (const criterion of phase.exitCriteria) {
        lines.push(`  - ${criterion}`);
      }
    }
    lines.push("");
  }

  lines.push("## Sequence Constraints");
  lines.push("");
  for (const constraint of packet.implementationPlan?.sequenceConstraints ?? []) {
    lines.push(`- ${constraint}`);
  }
  lines.push("");

  lines.push("## Rollback Triggers");
  lines.push("");
  for (const trigger of packet.implementationPlan?.rollbackTriggers ?? []) {
    lines.push(`- ${trigger}`);
  }
  lines.push("");

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

function buildImplementationPlan({ agentId, signatureClass, stage, selectedPlaybooks }) {
  const playbooks = [...(selectedPlaybooks ?? [])].map((id) => String(id));
  const hasContractRework = playbooks.includes("pb.rework.llm-request-contract-overhaul");
  const hasProcessingRework = playbooks.includes("pb.rework.response-processing-robustness");
  const hasStoryRework = playbooks.includes("pb.rework.story-logic-research-lab");

  return {
    capability: "deep_complex_multiphase_implementation",
    focusSignatureClass: signatureClass,
    focusStage: stage,
    selectedPlaybooks: playbooks,
    phases: [
      {
        id: "P1",
        name: "Failure Cartography",
        objective: "Build a high-fidelity fault map from signature evidence, validator markers, and run history.",
        owner: agentId,
        estimatedEffort: "M",
        taskBundles: [
          "Cluster unresolved warnings by invariant families and affected pipeline stages.",
          "Extract counterexamples where previous fixes improved one rule but regressed another.",
          "Create explicit hypothesis tree with disconfirming tests for each branch.",
        ],
        targetFiles: [
          "scripts/canary-loop/signatures.mjs",
          "scripts/canary-loop/playbooks.mjs",
          "apps/worker/src/jobs/agents/**",
        ],
        validationGates: [
          "At least one stage-specific signature replaces generic execution descriptors.",
          "Hypothesis tree references all must-fix items from retry packet.",
        ],
        exitCriteria: [
          "Root-cause narrative maps each critical warning to a concrete control point.",
        ],
      },
      {
        id: "P2",
        name: "Contract + Runtime Hardening",
        objective: "Implement constrained generation contracts and resilient post-processing for unstable outputs.",
        owner: agentId,
        estimatedEffort: "L",
        taskBundles: [
          hasContractRework
            ? "Introduce mandatory machine-checkable sections and anti-regression prompt clauses."
            : "Tighten existing prompt contracts for reproducible structure.",
          hasProcessingRework
            ? "Add strict-parse to bounded-recovery pipeline with semantic gate checks."
            : "Improve parser diagnostics and structured error propagation.",
          "Codify deterministic normalization for IDs, references, and source anchors.",
        ],
        targetFiles: [
          "packages/prompts-llm/**",
          "apps/worker/src/jobs/agents/*-run.ts",
          "scripts/canary-agent-boundary.mjs",
        ],
        validationGates: [
          "No unknown.pipeline_failure class when stage-level failure markers are present.",
          "Generated outputs include required contract sections without null placeholders.",
        ],
        exitCriteria: [
          "Critical class either changes or confidence drops due to eliminated evidence markers.",
        ],
      },
      {
        id: "P3",
        name: "Story-Logic Gate Reinforcement",
        objective: "Elevate fair-play and deducibility checks into first-class hard gates before acceptance.",
        owner: agentId,
        estimatedEffort: "L",
        taskBundles: [
          hasStoryRework
            ? "Promote contradiction/parity/timing invariants from warning-tier to hard acceptance gates."
            : "Expand story-validation invariants for discriminating-test integrity.",
          "Add cross-agent traceability assertions between clue extraction and fair-play audit.",
          "Introduce candidate-structure comparison pass prior to committing revised artifacts.",
        ],
        targetFiles: [
          "packages/story-validation/**",
          "apps/worker/src/jobs/agents/agent5-run.ts",
          "apps/worker/src/jobs/agents/agent6-run.ts",
        ],
        validationGates: [
          "No critical Information Parity or Discriminating Test Timing failures in two consecutive runs.",
          "Reader-visible evidence trace links to final solution path without withheld dependencies.",
        ],
        exitCriteria: [
          "Canary status strictly improves over baseline terminal outcome.",
        ],
      },
    ],
    sequenceConstraints: [
      "Do not begin P2 until P1 hypothesis map identifies at least one non-generic failure control point.",
      "Do not begin P3 until P2 contract markers are parseable and validated in canary output.",
      "Abort phase advance on oscillating class cycles until prior phase regressions are rolled back.",
    ],
    rollbackTriggers: [
      "New generic execution class appears after phase commit.",
      "Critical signature confidence increases versus pre-phase baseline.",
      "Must-fix coverage regresses in retry feedback packet alignment.",
    ],
  };
}

export function initMajorReworkBudgetState(config = {}) {
  const maxCampaignTokens = Number(config.maxCampaignTokens ?? 0);
  return {
    consumedCampaignTokens: 0,
    remainingCampaignTokens: maxCampaignTokens,
    checkpointsTaken: 0,
  };
}

export function estimateWaveTokenDemand({ selectedPlaybooks = [] }) {
  const playbookCount = (selectedPlaybooks ?? []).length;
  const thinkTokens = Math.max(2500, playbookCount * 1800);
  const actTokens = Math.max(1500, playbookCount * 1200);
  return {
    thinkTokens,
    actTokens,
    total: thinkTokens + actTokens,
  };
}

export function evaluateWaveAdmissibility({
  config = {},
  budgetState,
  tokenDemand,
  targetFiles = [],
}) {
  const blockedBy = [];
  const thinkCap = Number(config.maxThinkTokensPerWave ?? 0);
  const actCap = Number(config.maxActTokensPerWave ?? 0);
  const campaignRemaining = Number(budgetState?.remainingCampaignTokens ?? 0);
  const minRemainingPercent = Number(config.minRemainingPercentForBroadWork ?? 0);
  const campaignCap = Number(config.maxCampaignTokens ?? 1);
  const maxFilesPerWave = Number(config.maxFilesPerWave ?? 0);

  if (Number(tokenDemand?.thinkTokens ?? 0) > thinkCap) {
    blockedBy.push("think_tokens_exceed_wave_cap");
  }
  if (Number(tokenDemand?.actTokens ?? 0) > actCap) {
    blockedBy.push("act_tokens_exceed_wave_cap");
  }
  if (Number(tokenDemand?.total ?? 0) > campaignRemaining) {
    blockedBy.push("campaign_tokens_insufficient");
  }
  if (maxFilesPerWave > 0 && (targetFiles ?? []).length > maxFilesPerWave) {
    blockedBy.push("target_files_exceed_wave_cap");
  }

  const remainingPercent = campaignCap > 0
    ? Math.round((campaignRemaining / campaignCap) * 100)
    : 0;
  const broadScopeRequested = (targetFiles ?? []).length > Math.max(2, Math.floor(maxFilesPerWave / 2));
  if (broadScopeRequested && remainingPercent < minRemainingPercent) {
    blockedBy.push("remaining_budget_below_broad_scope_threshold");
  }

  return {
    allowed: blockedBy.length === 0,
    blockedBy,
    remainingPercent,
  };
}

export function shouldTakeMajorReworkCheckpoint({ config = {}, budgetState, nextTokenDemand }) {
  const remaining = Number(budgetState?.remainingCampaignTokens ?? 0);
  const cap = Number(config.maxCampaignTokens ?? 1);
  const remainingPercent = cap > 0 ? Math.round((remaining / cap) * 100) : 0;
  if (remainingPercent <= Number(config.minRemainingPercentForBroadWork ?? 0)) {
    return true;
  }
  return Number(nextTokenDemand?.total ?? 0) > remaining;
}

export async function writeMajorReworkCheckpoint({
  outputDir,
  runId,
  iteration,
  phase,
  signatureClass,
  budgetState,
  reason,
}) {
  const checkpointDir = path.join(outputDir, "rework-lab", "checkpoints");
  await fs.mkdir(checkpointDir, { recursive: true });
  const checkpointPath = path.join(checkpointDir, `checkpoint-iter${String(iteration).padStart(2, "0")}.json`);
  const payload = {
    generatedAt: new Date().toISOString(),
    runId,
    iteration,
    phase,
    signatureClass,
    reason,
    budgetState,
  };
  await fs.writeFile(checkpointPath, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
  return checkpointPath;
}

export function buildMajorReworkWavePlan({
  runId,
  iteration,
  waveOrdinal,
  signature,
  selectedPlaybooks = [],
  validationPlan,
  gateStatus,
  config,
  budgetState,
}) {
  const phase = gateStatus?.p1Complete !== true
    ? "P1"
    : gateStatus?.p2Complete !== true
      ? "P2"
      : "P3";
  const normalizedWaveOrdinal = Number.isInteger(waveOrdinal) && waveOrdinal > 0
    ? waveOrdinal
    : Math.max(1, Number(iteration) || 1);
  const waveId = `MR-${phase}-W${normalizedWaveOrdinal}`;
  const tokenDemand = estimateWaveTokenDemand({ selectedPlaybooks });
  const targetFiles = deriveWaveTargetsFromPlaybooks(selectedPlaybooks);
  const admissibility = evaluateWaveAdmissibility({
    config,
    budgetState,
    tokenDemand,
    targetFiles,
  });

  return {
    campaignId: `MR-${runId}`,
    waveId,
    phase,
    ownerRole: "Planner",
    tasks: selectedPlaybooks.map((id) => `Execute ${id}`),
    targetFiles,
    tests: validationPlan?.testCommands ?? [],
    canaryCommand: validationPlan?.canaryCommand ?? "",
    expectedEvidence: [
      `output signature differs from ${String(signature?.class ?? "unknown")}`,
      "critical-marker count does not increase",
      "no generic execution fallback introduced",
    ],
    stopIf: [
      "generic execution fallback appears",
      "critical severity increases",
      "token budget gate blocks admissibility",
    ],
    budgetSnapshot: {
      remainingCampaignTokens: Number(budgetState?.remainingCampaignTokens ?? 0),
      remainingWaveThinkTokens: Math.max(0, Number(config?.maxThinkTokensPerWave ?? 0) - tokenDemand.thinkTokens),
      remainingWaveActTokens: Math.max(0, Number(config?.maxActTokensPerWave ?? 0) - tokenDemand.actTokens),
    },
    tokenDemand,
    admissibility,
  };
}

export async function finalizeMajorReworkTodos({
  outputDir,
  terminalStatus,
  completionReason,
}) {
  const labDir = path.join(outputDir, "rework-lab");
  let entries = [];
  try {
    entries = await fs.readdir(labDir, { withFileTypes: true });
  } catch {
    return {
      campaignPath: null,
      phasePaths: [],
      wavePaths: [],
    };
  }

  const normalizedTerminalStatus = String(terminalStatus ?? "stopped").trim() || "stopped";
  const terminalCampaignStatus = normalizedTerminalStatus === "pass"
    || normalizedTerminalStatus === "pass_with_warnings"
    ? "completed"
    : "stopped";
  const finalizedAt = new Date().toISOString();
  const reason = String(completionReason ?? `terminal_${normalizedTerminalStatus}`).trim()
    || `terminal_${normalizedTerminalStatus}`;

  let campaignPath = null;
  const phasePaths = [];
  const wavePaths = [];

  for (const entry of entries) {
    if (!entry.isFile()) {
      continue;
    }
    if (entry.name === "campaign-todo.json") {
      const filePath = path.join(labDir, entry.name);
      let payload;
      try {
        payload = JSON.parse(await fs.readFile(filePath, "utf8"));
      } catch {
        continue;
      }
      if (String(payload?.status ?? "") !== "in-progress") {
        continue;
      }
      const updated = {
        ...payload,
        status: terminalCampaignStatus,
        terminalStatus: normalizedTerminalStatus,
        completedAt: finalizedAt,
        completionReason: reason,
        updatedAt: finalizedAt,
      };
      await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
      campaignPath = filePath;
      continue;
    }

    if (/^phase-P[123]\.todo\.json$/i.test(entry.name)) {
      const filePath = path.join(labDir, entry.name);
      let payload;
      try {
        payload = JSON.parse(await fs.readFile(filePath, "utf8"));
      } catch {
        continue;
      }
      if (String(payload?.status ?? "") !== "in-progress") {
        continue;
      }
      const updated = {
        ...payload,
        status: terminalCampaignStatus,
        terminalStatus: normalizedTerminalStatus,
        completedAt: finalizedAt,
        completionReason: reason,
      };
      await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
      phasePaths.push(filePath);
      continue;
    }

    if (/^wave-.*\.todo\.json$/i.test(entry.name)) {
      const filePath = path.join(labDir, entry.name);
      let payload;
      try {
        payload = JSON.parse(await fs.readFile(filePath, "utf8"));
      } catch {
        continue;
      }
      if (String(payload?.status ?? "") !== "in-progress") {
        continue;
      }
      const updated = {
        ...payload,
        status: terminalCampaignStatus,
        terminalStatus: normalizedTerminalStatus,
        completedAt: finalizedAt,
        completionReason: reason,
      };
      await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
      wavePaths.push(filePath);
    }
  }

  return {
    campaignPath,
    phasePaths,
    wavePaths,
  };
}

function deriveWaveTargetsFromPlaybooks(selectedPlaybooks = []) {
  const targets = new Set();
  for (const playbook of selectedPlaybooks) {
    const id = String(playbook);
    if (id.includes("llm-request-contract")) {
      targets.add("packages/prompts-llm/**");
      targets.add("packages/prompts/**");
    }
    if (id.includes("response-processing")) {
      targets.add("apps/worker/src/jobs/agents/**");
      targets.add("scripts/canary-loop/signatures.mjs");
    }
    if (id.includes("story-logic")) {
      targets.add("packages/story-validation/**");
      targets.add("apps/worker/src/jobs/agents/agent6-run.ts");
    }
  }
  if (targets.size === 0) {
    targets.add("scripts/canary-loop/**");
  }
  return [...targets];
}

export async function writeMajorReworkTodos({ outputDir, wavePlan }) {
  const labDir = path.join(outputDir, "rework-lab");
  await fs.mkdir(labDir, { recursive: true });
  await ensureSingleInProgressWave({
    labDir,
    nextWaveId: String(wavePlan?.waveId ?? ""),
  });

  const campaignPath = path.join(labDir, "campaign-todo.json");
  const phasePath = path.join(labDir, `phase-${wavePlan.phase}.todo.json`);
  const wavePath = path.join(labDir, `wave-${wavePlan.waveId}.todo.json`);

  const campaign = {
    campaignId: wavePlan.campaignId,
    status: "in-progress",
    activePhase: wavePlan.phase,
    updatedAt: new Date().toISOString(),
  };
  const phase = {
    phase: wavePlan.phase,
    status: "in-progress",
    expectedEvidence: wavePlan.expectedEvidence,
    stopIf: wavePlan.stopIf,
  };
  const wave = {
    waveId: wavePlan.waveId,
    phase: wavePlan.phase,
    owner: wavePlan.ownerRole,
    status: "in-progress",
    tasks: wavePlan.tasks.map((title, index) => ({
      id: `${wavePlan.waveId}-T${index + 1}`,
      title,
      owner: wavePlan.ownerRole,
      status: "not-started",
      expectedEvidence: wavePlan.expectedEvidence,
      doneWhen: ["validation complete", "delta review persisted"],
    })),
    targetFiles: wavePlan.targetFiles,
    tests: wavePlan.tests,
    canaryCommand: wavePlan.canaryCommand,
    budgetSnapshot: wavePlan.budgetSnapshot,
  };

  validateMajorReworkTodoPayload({
    campaign,
    phase,
    wave,
  });

  await fs.writeFile(campaignPath, `${JSON.stringify(campaign, null, 2)}\n`, "utf8");
  await fs.writeFile(phasePath, `${JSON.stringify(phase, null, 2)}\n`, "utf8");
  await fs.writeFile(wavePath, `${JSON.stringify(wave, null, 2)}\n`, "utf8");

  return {
    campaignPath,
    phasePath,
    wavePath,
  };
}

export function validateMajorReworkTodoPayload({ campaign, phase, wave }) {
  if (!campaign || typeof campaign !== "object") {
    throw new Error("Invalid campaign todo payload.");
  }
  if (!phase || typeof phase !== "object") {
    throw new Error("Invalid phase todo payload.");
  }
  if (!wave || typeof wave !== "object") {
    throw new Error("Invalid wave todo payload.");
  }

  if (!String(campaign.campaignId ?? "").trim()) {
    throw new Error("Campaign todo requires campaignId.");
  }
  if (campaign.status !== "in-progress") {
    throw new Error("Campaign todo status must be 'in-progress'.");
  }
  if (!String(phase.phase ?? "").match(/^P[123]$/)) {
    throw new Error("Phase todo requires phase in P1/P2/P3.");
  }
  if (phase.status !== "in-progress") {
    throw new Error("Phase todo status must be 'in-progress'.");
  }

  if (!String(wave.waveId ?? "").trim()) {
    throw new Error("Wave todo requires waveId.");
  }
  if (!String(wave.phase ?? "").match(/^P[123]$/)) {
    throw new Error("Wave todo requires phase in P1/P2/P3.");
  }
  if (wave.status !== "in-progress") {
    throw new Error("Wave todo status must be 'in-progress'.");
  }

  const tasks = Array.isArray(wave.tasks) ? wave.tasks : [];
  if (!tasks.length) {
    throw new Error("Wave todo requires at least one task.");
  }
  for (const task of tasks) {
    if (!String(task?.id ?? "").trim()) {
      throw new Error("Each wave todo task requires id.");
    }
    if (!String(task?.title ?? "").trim()) {
      throw new Error("Each wave todo task requires title.");
    }
    if (!String(task?.owner ?? "").trim()) {
      throw new Error("Each wave todo task requires owner.");
    }
    const expectedEvidence = Array.isArray(task?.expectedEvidence) ? task.expectedEvidence : [];
    const doneWhen = Array.isArray(task?.doneWhen) ? task.doneWhen : [];
    if (!expectedEvidence.length) {
      throw new Error(`Wave todo task '${task.id}' requires expectedEvidence.`);
    }
    if (!doneWhen.length) {
      throw new Error(`Wave todo task '${task.id}' requires doneWhen.`);
    }
  }
}

async function ensureSingleInProgressWave({ labDir, nextWaveId }) {
  let entries = [];
  try {
    entries = await fs.readdir(labDir, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (!entry.isFile() || !/^wave-.*\.todo\.json$/i.test(entry.name)) {
      continue;
    }
    const filePath = path.join(labDir, entry.name);
    let payload = null;
    try {
      payload = JSON.parse(await fs.readFile(filePath, "utf8"));
    } catch {
      continue;
    }
    if (String(payload?.status ?? "") !== "in-progress") {
      continue;
    }
    const activeWaveId = String(payload?.waveId ?? "").trim();
    if (activeWaveId && activeWaveId !== nextWaveId) {
      const updated = {
        ...payload,
        status: "completed",
        completedAt: new Date().toISOString(),
        completionReason: `superseded_by_${nextWaveId}`,
      };
      await fs.writeFile(filePath, `${JSON.stringify(updated, null, 2)}\n`, "utf8");
    }
  }
}

export function assessMajorReworkDelta({ previousSignature, outputSignature, validation }) {
  const prevClass = String(previousSignature?.class ?? "");
  const outClass = String(outputSignature?.class ?? "");
  const prevSeverity = String(previousSignature?.severity ?? "critical");
  const outSeverity = String(outputSignature?.severity ?? "critical");
  const warnings = Number(validation?.canary?.warningsCount ?? 0);

  let deltaAssessment = "unchanged";
  if (isGenericClass(outClass) && !isGenericClass(prevClass)) {
    deltaAssessment = "regressed";
  } else if (severityRank(outSeverity) > severityRank(prevSeverity)) {
    deltaAssessment = "regressed";
  } else if (outClass !== prevClass || severityRank(outSeverity) < severityRank(prevSeverity)) {
    deltaAssessment = warnings > 0 ? "mixed" : "improved";
  } else if (outSeverity === prevSeverity && outClass === prevClass) {
    deltaAssessment = "unchanged";
  }

  return {
    deltaAssessment,
    observedEvidence: [
      `signature:${prevClass}->${outClass}`,
      `severity:${prevSeverity}->${outSeverity}`,
      `warnings:${warnings}`,
    ],
  };
}

export function classifyRollbackDecision({
  previousSignature,
  outputSignature,
  deltaAssessment,
  decision,
  partialRollbackEnabled,
  confidence,
  changedFiles = [],
}) {
  const evidence = [`deltaAssessment=${deltaAssessment}`, `decision=${decision}`];
  const outClass = String(outputSignature?.class ?? "");
  const outSeverity = String(outputSignature?.severity ?? "critical");

  if (isGenericClass(outClass) || outSeverity === "critical" && deltaAssessment === "regressed") {
    return {
      mode: "whole",
      rationale: "Regression or generic fallback requires full-wave rollback.",
      keptFiles: [],
      revertedFiles: changedFiles,
      evidence,
    };
  }

  if (
    partialRollbackEnabled === true
    && (deltaAssessment === "improved" || deltaAssessment === "mixed")
    && Number(confidence ?? 0) >= 0.75
  ) {
    const keptFiles = changedFiles.filter((filePath) => /agent[3569]|story-validation|prompts/i.test(String(filePath)));
    const keptSet = new Set(keptFiles);
    const revertedFiles = changedFiles.filter((filePath) => !keptSet.has(filePath));
    return {
      mode: revertedFiles.length > 0 ? "partial" : "none",
      rationale: revertedFiles.length > 0
        ? "Partial rollback preserves evidence-backed improvements only."
        : "All changed files satisfy acceptance evidence; rollback not required.",
      keptFiles,
      revertedFiles,
      evidence,
    };
  }

  return {
    mode: decision === "pass" ? "none" : "whole",
    rationale: decision === "pass"
      ? "Wave accepted with no rollback required."
      : "No safe partial-rollback confidence; perform whole rollback.",
    keptFiles: [],
    revertedFiles: changedFiles,
    evidence,
  };
}

export async function appendMajorReworkLearning({
  outputDir,
  runId,
  campaignId,
  signatureClass,
  rootCauseLayer,
  entry,
}) {
  const labDir = path.join(outputDir, "rework-lab");
  await fs.mkdir(labDir, { recursive: true });
  const learningPath = path.join(labDir, "major-rework-learning.json");
  let existing = {
    runId,
    campaignId,
    createdAt: new Date().toISOString(),
    signatureClass,
    rootCauseLayer,
    entries: [],
  };
  try {
    const text = await fs.readFile(learningPath, "utf8");
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.entries)) {
      existing = parsed;
    }
  } catch {
    // New learning file.
  }

  existing.entries.push(entry);
  existing.updatedAt = new Date().toISOString();
  await fs.writeFile(learningPath, `${JSON.stringify(existing, null, 2)}\n`, "utf8");
  return learningPath;
}

export async function loadMajorReworkLearning({ outputDir }) {
  const learningPath = path.join(outputDir, "rework-lab", "major-rework-learning.json");
  try {
    const text = await fs.readFile(learningPath, "utf8");
    const parsed = JSON.parse(text);
    if (parsed && Array.isArray(parsed.entries)) {
      return parsed;
    }
  } catch {
    // no-op
  }
  return null;
}

function isGenericClass(className) {
  return ["unknown.pipeline_failure", "canary.execution_failure", "infra_command_failure"]
    .includes(String(className ?? ""));
}

function severityRank(severity) {
  const normalized = String(severity ?? "").toLowerCase().trim();
  if (normalized === "warning") {
    return 1;
  }
  return 2;
}
