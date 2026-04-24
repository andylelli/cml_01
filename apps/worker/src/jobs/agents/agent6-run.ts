/**
 * Agent 6: Fair Play Auditor
 *
 * Extracted from mystery-orchestrator.ts. Runs auditFairPlay() with one
 * clue-regen retry, then WP5B (blind reader simulation) and WP6B (CML
 * structural revision on critical failures). May mutate ctx.cml and ctx.clues.
 * Writes ctx.fairPlayAudit and ctx.hasCriticalFairPlayFailure.
 */

import {
  auditFairPlay,
  extractClues,
  blindReaderSimulation,
  buildCMLPrompt,
  reviseCml,
} from "@cml/prompts-llm";
import type { FairPlayAuditResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { getGenerationParams, type PhaseScore, type TestResult } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type InferenceCoverageResult,
  applyClueGuardrails,
} from "./shared.js";
import {
  enforceAgent5DeterministicContracts,
  recomputeCoverageSnapshotForAgent6,
} from "./agent5-run.js";

// ============================================================================
// classifyFairPlayFailure (agent-6 only)
// ============================================================================

type FairPlayFailureClass =
  | "clue_coverage"
  | "inference_path_abstract"
  | "constraint_space_insufficient"
  | "clue_only";

const CONFIDENCE_RANK: Record<string, number> = {
  impossible: 0,
  weak: 1,
  uncertain: 2,
  likely: 3,
  certain: 4,
};

const normalizeConfidence = (value: string | undefined): string =>
  String(value ?? "").trim().toLowerCase();

const classifyMissingInfoCategories = (items: string[]): string[] => {
  const categories = new Set<string>();
  for (const item of items) {
    const lower = item.toLowerCase();
    if (/\balibi|timeline|whereabouts\b/.test(lower)) categories.add("alibi gap");
    if (/\bphysical|forensic|trace|fingerprint|fiber|blood|tool\b/.test(lower)) categories.add("physical-link gap");
    if (/\bwitness|behavior|statement|testimony|motive\b/.test(lower)) categories.add("witness-behavior gap");
  }
  return Array.from(categories);
};

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((item) => String(item ?? "").trim()).filter((item) => item.length > 0)
    : [];

const firstNonEmpty = (...values: Array<unknown>): string => {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text.length > 0) return text;
  }
  return "";
};

const normalizeComplexityLevel = (value: unknown): "simple" | "moderate" | "complex" => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "simple" || normalized === "moderate" || normalized === "complex") {
    return normalized;
  }
  return "moderate";
};

const normalizeDifficultyMode = (value: unknown): "standard" | "increase" | "extreme" => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "standard" || normalized === "increase" || normalized === "extreme") {
    return normalized;
  }
  return "standard";
};

const appendUniqueStrings = (base: string[] | undefined, additions: string[]): string[] =>
  [...new Set([...(base ?? []), ...additions].map((entry) => String(entry ?? "").trim()).filter(Boolean))];

const STRICT_FIRST_PASS_ACCEPTANCE_STATEMENTS = [
  "ACCEPTANCE: clue_mechanism_visibility_core must be essential and early|mid, and must make the mechanism reader-visible before the discriminating test.",
  "ACCEPTANCE: clue_core_contradiction_chain must be essential and early|mid, and must overturn the false assumption with concrete evidence.",
  "ACCEPTANCE: clue_core_elimination_chain must be essential and early|mid, and must explicitly eliminate at least one eligible non-culprit.",
  "ACCEPTANCE: Before Act III, the reader can execute observation -> correction -> elimination to narrow uniquely to the culprit; the discriminating test only confirms.",
] as const;

const deriveRequiredCluePhrases = (fairPlayAudit: FairPlayAuditResult, cml?: CaseData): string[] => {
  const structuralRules = new Set([
    "information parity",
    "logical deducibility",
    "no withholding",
    "discriminating test timing",
  ]);

  const phrases: string[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const culpritName = String(caseBlock?.culpability?.culprits?.[0] ?? "").trim();
  const discriminatingDesign = String(caseBlock?.discriminating_test?.design ?? "").trim();
  const discriminatingKnowledge = String(caseBlock?.discriminating_test?.knowledge_revealed ?? "").trim();
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  const violations = Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [];
  const normalizedRules = new Set(
    violations
      .map((violation) => String(violation?.rule ?? "").toLowerCase().trim())
      .filter(Boolean),
  );
  const hasLogicalDeducibility = normalizedRules.has("logical deducibility");
  const hasDiscriminatingTiming = normalizedRules.has("discriminating test timing");

  if (hasLogicalDeducibility && hasDiscriminatingTiming) {
    phrases.push(
      "PAIR CONTRACT: Provide exactly one essential early|mid mechanism observation clue, one essential early|mid contradiction clue, and one essential early|mid elimination clue before the discriminating test scene.",
    );
    phrases.push(
      "PAIR ACCEPTANCE: The clue chain must be reader-solvable in this order before Act III: observation -> correction -> elimination, with explicit narrowing to culprit.",
    );
  }

  if (discriminatingDesign) {
    phrases.push(
      `Include an essential early|mid mechanism clue that directly exposes this discriminating-test mechanism detail before the test scene: ${discriminatingDesign}`
    );
  }
  if (discriminatingKnowledge) {
    phrases.push(
      `Include an essential early|mid clue that makes this reader-visible before the test scene: ${discriminatingKnowledge}`
    );
  }

  for (const step of inferenceSteps) {
    const requiredEvidence = Array.isArray(step?.required_evidence) ? step.required_evidence : [];
    for (const evidence of requiredEvidence.slice(0, 2)) {
      const evidenceText = String(evidence ?? "").trim();
      if (!evidenceText) continue;
      phrases.push(`Surface this required_evidence item as an explicit clue before Act III: ${evidenceText}`);
    }
  }

  for (const violation of violations) {
    const rule = String(violation.rule ?? "").toLowerCase().trim();
    if (!structuralRules.has(rule)) continue;

    const suggestion = String(violation.suggestion ?? "").trim();
    const description = String(violation.description ?? "").trim();

    if (rule === "information parity" || rule === "no withholding") {
      phrases.push(
        "Reveal every mechanism fact used by the detective as an essential clue in early or mid placement; do not reserve those facts for confrontation."
      );
    }
    if (rule === "logical deducibility") {
      phrases.push(
        "Provide a reader-solvable observation -> correction -> elimination chain before Act III where each link is an essential early|mid clue."
      );
      phrases.push(
        "The contradiction clue must reference concrete observed evidence and explicitly overturn the false assumption rather than restating detective reasoning.",
      );
    }
    if (rule === "discriminating test timing") {
      phrases.push(
        "All evidence exploited by the discriminating test must appear as essential early|mid clues before the Act III test scene; the test cannot introduce first-seen facts."
      );
    }

    const combined = `${description} ${suggestion}`.toLowerCase();
    if (/clock/.test(combined) && /tamper|stopp|wound|time/.test(combined)) {
      phrases.push(
        "Include an essential early or mid clue that explicitly shows the clock was tampered with and how that changes the true timeline."
      );
    }
    if (/alibi|whereabouts|timeline/.test(combined)) {
      phrases.push(
        "Add at least one concrete elimination or alibi clue for each eligible non-culprit suspect, with corroborating source details."
      );
    }
    if (culpritName) {
      phrases.push(
        `Include at least one essential early or mid clue that uniquely discriminates culprit ${culpritName} from non-culprits.`
      );
    }

    // Keep structural directives unambiguous: only include free-form suggestion text when it is concrete.
    if (suggestion.length >= 16 && /(early|mid|essential|before|eliminat|contradiction|mechanism|discriminating)/i.test(suggestion)) {
      phrases.push(suggestion);
      continue;
    }
    if (description.length >= 16 && /(early|mid|essential|before|eliminat|contradiction|mechanism|discriminating)/i.test(description)) {
      phrases.push(description);
    }
  }

  return [...new Set([...STRICT_FIRST_PASS_ACCEPTANCE_STATEMENTS, ...phrases])].slice(0, 12);
};

const buildFairPlayFeedbackPayload = (fairPlayAudit: FairPlayAuditResult, cml?: CaseData) => {
  const acceptanceSummary =
    "First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.";

  return {
    overallStatus: fairPlayAudit.overallStatus,
    violations: fairPlayAudit.violations,
    warnings: appendUniqueStrings(fairPlayAudit.warnings, [acceptanceSummary]),
    recommendations: appendUniqueStrings(fairPlayAudit.recommendations, [acceptanceSummary]),
    requiredCluePhrases: deriveRequiredCluePhrases(fairPlayAudit, cml),
  };
};

const deriveBlindReaderRequiredCluePhrases = (
  missingInformation: string[],
  actualCulpritName: string,
  suspectedCulpritName?: string,
): string[] => {
  const phrases: string[] = [];
  for (const info of missingInformation) {
    const trimmed = String(info ?? "").trim();
    if (!trimmed) continue;
    phrases.push(`Provide an essential early or mid clue covering: ${trimmed}`);

    const lower = trimmed.toLowerCase();
    if (/clock|time|timeline|tamper|alibi/.test(lower)) {
      phrases.push(
        "Provide concrete timeline clues that make time manipulation and suspect opportunity logically testable by the reader before Act III."
      );
    }
    if (/motive|relationship|secret/.test(lower)) {
      phrases.push(
        "Provide motive and relationship clues as observable evidence, not late detective exposition."
      );
    }
  }

  if (actualCulpritName) {
    phrases.push(
      `Include at least one essential early or mid clue that points uniquely to culprit ${actualCulpritName}.`
    );
    phrases.push(
      `Include one clue where both description and pointsTo explicitly name ${actualCulpritName} and state a unique mechanism link that no non-culprit satisfies.`
    );
  }

  const suspected = String(suspectedCulpritName ?? "").trim();
  if (actualCulpritName && suspected && suspected.toLowerCase() !== actualCulpritName.toLowerCase()) {
    phrases.push(
      `Include at least one essential elimination clue that explicitly rules out ${suspected} using corroborated timeline or physical evidence.`
    );
    phrases.push(
      `Include one clue whose pointsTo begins with \"Eliminates ${suspected} because ...\" and cites corroborating source details.`
    );
  }

  return [...new Set(phrases)].slice(0, 10);
};

const hasCriticalFairPlayViolations = (
  fairPlayAudit: FairPlayAuditResult,
  criticalFairPlayRules: Set<string>,
): boolean => {
  const violations = Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [];
  return violations.some(
    (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
  );
};

function classifyFairPlayFailure(
  coverageResult: InferenceCoverageResult | null | undefined,
  fairPlayAudit: FairPlayAuditResult | null,
  cml: CaseData
): FairPlayFailureClass {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  const abstractSteps = steps.filter((s: any) => {
    const obs = (s.observation || "").trim();
    const hasEvidence = Array.isArray(s.required_evidence) && s.required_evidence.length > 0;
    return obs.length < 30 || !hasEvidence;
  });

  const criticalRules = new Set(
    (fairPlayAudit?.violations ?? [])
      .filter((v) => v.severity === "critical")
      .map((v) => String(v.rule ?? "").toLowerCase().trim())
  );

  // Escalate timing+parity structural failures before softer abstract-step heuristics.
  if (
    criticalRules.has("discriminating test timing") &&
    (criticalRules.has("information parity") || criticalRules.has("no withholding"))
  ) return "inference_path_abstract";

  if (
    (criticalRules.has("logical deducibility") || criticalRules.has("no withholding")) &&
    abstractSteps.length >= Math.ceil(steps.length * 0.5)
  ) return "inference_path_abstract";

  if (abstractSteps.length >= Math.ceil(steps.length * 0.5)) return "inference_path_abstract";

  const cs = caseBlock?.constraint_space ?? {};
  const totalConstraints = [
    ...(cs.time?.contradictions ?? []),
    ...(cs.time?.anchors ?? []),
    ...(cs.access?.actors ?? []),
    ...(cs.physical?.traces ?? []),
  ].length;

  if (totalConstraints < 4) return "constraint_space_insufficient";

  if (
    coverageResult?.hasCriticalGaps ||
    criticalRules.has("clue visibility") ||
    criticalRules.has("logical deducibility")
  ) return "clue_coverage";

  return "clue_only";
}

const applyAgent5ContractsToRegeneratedClues = (ctx: OrchestratorContext, contextLabel: string): void => {
  if (!ctx.clues || !ctx.cml) return;
  const pushError = (message: string) => {
    if (Array.isArray((ctx as any).errors)) {
      (ctx as any).errors.push(message);
    }
  };

  const guardrails = applyClueGuardrails(ctx.cml, ctx.clues);
  guardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 6 (${contextLabel}) guardrail auto-fix: ${fix}`));
  if (guardrails.hasCriticalIssues) {
    guardrails.issues
      .filter((issue) => issue.severity === "critical")
      .forEach((issue) => pushError(`Agent 6 regenerated clue guardrail (${contextLabel}): ${issue.message}`));
    const summary = guardrails.issues
      .filter((issue) => issue.severity === "critical")
      .map((issue) => issue.message)
      .join("; ");
    throw new Error(`Agent 6 regenerated clue guardrail failure (${contextLabel}): ${summary || "critical guardrail issues"}`);
  }

  const hardLogicLockedFacts = Array.isArray((ctx as any).hardLogicDevices?.devices)
    ? (ctx as any).hardLogicDevices.devices.flatMap((d: any) =>
        Array.isArray(d?.lockedFacts) ? d.lockedFacts : [],
      )
    : undefined;

  let deterministicContracts: { warnings: string[] };
  try {
    deterministicContracts = enforceAgent5DeterministicContracts(ctx.cml, ctx.clues, {
      hardLogicLockedFacts,
    });
  } catch (error) {
    const message = (error as Error).message || "";
    const isMechanismVisibilityFailure = /mechanism visibility gate failed/i.test(message);

    if (!isMechanismVisibilityFailure) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}): ${message}`);
      throw error;
    }

    const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
    if (!parityBridgeId) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}): ${message}`);
      throw error;
    }

    ctx.warnings.push(
      `Agent 6 (${contextLabel}) mechanism-visibility fallback: injected essential clue ${parityBridgeId} and retried deterministic contracts.`,
    );

    try {
      deterministicContracts = enforceAgent5DeterministicContracts(ctx.cml, ctx.clues, {
        hardLogicLockedFacts,
      });
    } catch (retryError) {
      pushError(
        `Agent 6 regenerated clue deterministic contract (${contextLabel}, mechanism fallback): ${(retryError as Error).message}`,
      );
      throw retryError;
    }
  }
  deterministicContracts.warnings.forEach((warning) =>
    ctx.warnings.push(`Agent 6 (${contextLabel}) ${warning}`),
  );
  const coverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
  ctx.coverageResult = coverageSnapshot.coverageResult;
  ctx.allCoverageIssues = coverageSnapshot.allCoverageIssues;

  const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
  if (parityBridgeId) {
    ctx.warnings.push(
      `Agent 6 (${contextLabel}) deterministic parity bridge: injected essential clue ${parityBridgeId} for discriminating-test mechanism visibility.`,
    );

    // Re-run deterministic contracts so injected bridge clues are normalized and validated.
    let bridgeContracts: { warnings: string[] };
    try {
      bridgeContracts = enforceAgent5DeterministicContracts(ctx.cml, ctx.clues, {
        hardLogicLockedFacts,
      });
    } catch (error) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}, parity bridge): ${(error as Error).message}`);
      throw error;
    }
    bridgeContracts.warnings.forEach((warning) =>
      ctx.warnings.push(`Agent 6 (${contextLabel}, parity bridge) ${warning}`),
    );

    const updatedCoverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
    ctx.coverageResult = updatedCoverageSnapshot.coverageResult;
    ctx.allCoverageIssues = updatedCoverageSnapshot.allCoverageIssues;
  }
};

const ensureParityBridgeClue = (cml: CaseData, clues: any): string | null => {
  const caseBlock = (cml as any)?.CASE ?? cml ?? {};
  const discrimDesign = String(caseBlock?.discriminating_test?.design ?? "").trim();
  const discrimKnowledge = String(caseBlock?.discriminating_test?.knowledge_revealed ?? "").trim();
  if (!discrimDesign && !discrimKnowledge) return null;

  const sourceText = `${discrimDesign} ${discrimKnowledge}`.toLowerCase();
  const sourceTokens = sourceText
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 5);
  if (sourceTokens.length === 0) return null;

  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];

  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  const earlyMidEssential = clueList.filter(
    (clue) => clue?.criticality === "essential" && (clue?.placement === "early" || clue?.placement === "mid"),
  );
  const earlyEssential = clueList.filter(
    (clue) => clue?.criticality === "essential" && clue?.placement === "early",
  );

  const hasEarlyParityBridge = earlyEssential.some((clue) => {
    const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
    return sourceTokens.some((token) => text.includes(token));
  });
  if (hasEarlyParityBridge) return null;

  const template = earlyMidEssential[0] ?? clueList.find((clue) => clue?.criticality === "essential") ?? clueList[0];
  if (!template) return null;

  const existingIds = new Set(
    clueList.map((clue) => String(clue?.id ?? "").trim()).filter((id) => id.length > 0),
  );
  let candidateId = "clue_parity_bridge";
  let suffix = 2;
  while (existingIds.has(candidateId)) {
    candidateId = `clue_parity_bridge_${suffix}`;
    suffix += 1;
  }

  const selectBridgeSource = (): { sourceInCML: string; supportsInferenceStep: number; evidenceType: string } => {
    const joinedSource = `${discrimDesign} ${discrimKnowledge}`.toLowerCase();
    const joinedTokens = joinedSource
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length >= 5);

    for (let i = 0; i < inferenceSteps.length; i += 1) {
      const step = inferenceSteps[i] ?? {};
      const correction = String(step?.correction ?? "").trim();
      const observation = String(step?.observation ?? "").trim();
      const correctionText = correction.toLowerCase();
      const observationText = observation.toLowerCase();
      const correctionMatches = correctionText.length > 0 && joinedTokens.some((token) => correctionText.includes(token));
      if (correctionMatches) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].correction`,
          supportsInferenceStep: i + 1,
          evidenceType: "contradiction",
        };
      }
      const observationMatches = observationText.length > 0 && joinedTokens.some((token) => observationText.includes(token));
      if (observationMatches) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].observation`,
          supportsInferenceStep: i + 1,
          evidenceType: "observation",
        };
      }
    }

    for (let i = 0; i < inferenceSteps.length; i += 1) {
      const step = inferenceSteps[i] ?? {};
      const correction = String(step?.correction ?? "").trim();
      if (correction.length > 0) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].correction`,
          supportsInferenceStep: i + 1,
          evidenceType: "contradiction",
        };
      }
      const observation = String(step?.observation ?? "").trim();
      if (observation.length > 0) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].observation`,
          supportsInferenceStep: i + 1,
          evidenceType: "observation",
        };
      }
    }

    return {
      sourceInCML: "CASE.discriminating_test.evidence_clues[0]",
      supportsInferenceStep: 1,
      evidenceType: "observation",
    };
  };

  const bridgeSource = selectBridgeSource();

  const bridgeDescription = discrimKnowledge
    ? `Pre-test reader-visible mechanism clue: ${discrimKnowledge}`
    : `Pre-test reader-visible mechanism clue: ${discrimDesign}`;
  const bridgePointsTo = discrimDesign
    ? `Before the discriminating test, the reader can infer this mechanism from shared evidence: ${discrimDesign}`
    : "Before the discriminating test, the reader can infer the mechanism from shared evidence without detective-only knowledge.";

  clueList.push({
    ...template,
    id: candidateId,
    sourceInCML: bridgeSource.sourceInCML,
    description: bridgeDescription,
    pointsTo: bridgePointsTo,
    placement: "early",
    criticality: "essential",
    evidenceType: bridgeSource.evidenceType,
    supportsInferenceStep: bridgeSource.supportsInferenceStep,
  });

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = [...(timeline.early ?? []), candidateId];
  (clues as any).clueTimeline = timeline;

  return candidateId;
};

const ensureCriticalFairPlayBackstopClues = (cml: CaseData, clues: any): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml ?? {};
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (inferenceSteps.length === 0 || clueList.length === 0) return [];

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  (clues as any).clueTimeline = timeline;

  const repairs: string[] = [];
  const existingIds = new Set(
    clueList.map((clue) => String(clue?.id ?? "").trim()).filter((id) => id.length > 0),
  );

  const nextId = (prefix: string): string => {
    let candidate = prefix;
    let suffix = 2;
    while (existingIds.has(candidate)) {
      candidate = `${prefix}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(candidate);
    return candidate;
  };

  const template = clueList.find((clue) => clue?.criticality === "essential") ?? clueList[0];
  if (!template) return repairs;

  for (let i = 0; i < inferenceSteps.length; i += 1) {
    const stepNumber = i + 1;
    const hasEarlyMidEssentialForStep = clueList.some(
      (clue) => clue?.criticality === "essential"
        && (clue?.placement === "early" || clue?.placement === "mid")
        && Number(clue?.supportsInferenceStep) === stepNumber,
    );
    if (hasEarlyMidEssentialForStep) continue;

    const step = inferenceSteps[i] ?? {};
    const observation = String(step?.observation ?? "").trim();
    const correction = String(step?.correction ?? "").trim();
    const effect = String(step?.effect ?? "").trim();
    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.map((e: any) => String(e ?? "").trim()).filter(Boolean)
      : [];

    const preferredEvidencePath = requiredEvidence.find((entry: string) => /^CASE\./.test(entry));
    const sourceInCML = preferredEvidencePath || (correction
      ? `CASE.inference_path.steps[${i}].correction`
      : `CASE.inference_path.steps[${i}].observation`);

    const description = observation
      ? `Reader-visible clue (inference step ${stepNumber}): ${observation}`
      : `Reader-visible clue (inference step ${stepNumber}): ${correction || effect}`;
    const pointsTo = correction
      ? `Supports correction for inference step ${stepNumber}: ${correction}`
      : `Supports inference step ${stepNumber}: ${effect || "narrows suspect possibilities"}`;

    const clueId = nextId(`clue_fp_backstop_step_${stepNumber}`);
    const placement = stepNumber <= 2 ? "early" : "mid";

    clueList.push({
      ...template,
      id: clueId,
      sourceInCML,
      description,
      pointsTo,
      placement,
      criticality: "essential",
      evidenceType: correction ? "contradiction" : "observation",
      supportsInferenceStep: stepNumber,
    });

    if (placement === "early") {
      timeline.early.push(clueId);
    } else {
      timeline.mid.push(clueId);
    }

    repairs.push(`added ${clueId} as ${placement} essential clue for inference step ${stepNumber}`);
  }

  return repairs;
};

const synthesizeAuditVisibilityClues = (
  cml: CaseData,
  clues: any,
  fairPlayAudit: FairPlayAuditResult,
): string[] => {
  const criticalRules = new Set(["information parity", "no withholding", "logical deducibility", "clue visibility"]);
  const relevantViolations = (fairPlayAudit?.violations ?? []).filter(
    (violation) => violation?.severity === "critical"
      && criticalRules.has(String(violation?.rule ?? "").toLowerCase().trim()),
  );
  if (relevantViolations.length === 0) return [];

  const caseBlock = (cml as any)?.CASE ?? cml ?? {};
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (clueList.length === 0) return [];

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  (clues as any).clueTimeline = timeline;

  const existingIds = new Set(
    clueList.map((clue) => String(clue?.id ?? "").trim()).filter((id) => id.length > 0),
  );
  const nextId = (prefix: string): string => {
    let candidate = prefix;
    let suffix = 2;
    while (existingIds.has(candidate)) {
      candidate = `${prefix}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(candidate);
    return candidate;
  };

  const template = clueList.find((clue) => clue?.criticality === "essential") ?? clueList[0];
  if (!template) return [];

  const sourceInCML = (() => {
    const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
    for (let i = 0; i < steps.length; i += 1) {
      if (String(steps[i]?.correction ?? "").trim()) return `CASE.inference_path.steps[${i}].correction`;
      if (String(steps[i]?.observation ?? "").trim()) return `CASE.inference_path.steps[${i}].observation`;
    }
    return "CASE.discriminating_test.design";
  })();

  const candidatePhrases = new Set<string>();
  for (const violation of relevantViolations) {
    const description = String(violation?.description ?? "").replace(/\s+/g, " ").trim();
    if (!description) continue;
    const aboutMatch = description.match(/\babout\s+the\s+([^.;]+)/i);
    const ofMatch = description.match(/\bknowledge\s+of\s+the\s+([^.;]+)/i);
    const phrase = (aboutMatch?.[1] ?? ofMatch?.[1] ?? description).trim();
    if (phrase.length >= 8) candidatePhrases.add(phrase);
  }

  const repairs: string[] = [];
  for (const phrase of candidatePhrases) {
    const phraseTokens = phrase.toLowerCase().split(/\s+/).filter((token) => token.length >= 5);
    if (phraseTokens.length === 0) continue;

    const alreadyVisible = clueList.some((clue) => {
      const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
      const overlap = phraseTokens.filter((token) => text.includes(token)).length;
      return overlap >= Math.min(2, phraseTokens.length);
    });
    if (alreadyVisible) continue;

    const clueId = nextId("clue_audit_visibility");
    clueList.push({
      ...template,
      id: clueId,
      sourceInCML,
      description: `Reader-visible pre-test clue: ${phrase}.`,
      pointsTo: "This clue is established for the reader before the discriminating test so later deductions rely on already-visible evidence.",
      placement: "early",
      criticality: "essential",
      evidenceType: "observation",
      supportsInferenceStep: 1,
    });
    timeline.early.push(clueId);
    repairs.push(`added ${clueId} to surface audit-flagged hidden information (${phrase}) before test`);
  }

  return repairs;
};

const deriveEffectiveCastNamesForStructuralRevision = (ctx: OrchestratorContext): string[] => {
  const caseBlock = (ctx.cml as any)?.CASE ?? ctx.cml ?? {};
  const cmlCastNames = (Array.isArray(caseBlock?.cast) ? caseBlock.cast : [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
  if (cmlCastNames.length > 0) return cmlCastNames;

  return (ctx.cast?.cast?.characters ?? [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
};

export function createFairPlayRetryBudgetTracker(maxRetryCostUsd: number) {
  let consumed = 0;
  return {
    getConsumed: () => consumed,
    consume: (cost: number, label: string) => {
      const normalizedCost = Number.isFinite(cost) ? Math.max(0, cost) : 0;
      consumed += normalizedCost;
      if (consumed > maxRetryCostUsd) {
        throw new Error(
          `Agent 6 fair-play retry cost limit reached: spent $${consumed.toFixed(3)} after ${label} (max $${maxRetryCostUsd.toFixed(3)}).`,
        );
      }
    },
  };
}

export const __testables = {
  applyAgent5ContractsToRegeneratedClues,
  buildFairPlayFeedbackPayload,
  classifyFairPlayFailure,
  createFairPlayRetryBudgetTracker,
  deriveBlindReaderRequiredCluePhrases,
  deriveRequiredCluePhrases,
  deriveEffectiveCastNamesForStructuralRevision,
  ensureCriticalFairPlayBackstopClues,
  synthesizeAuditVisibilityClues,
  ensureParityBridgeClue,
};

// ============================================================================
// runAgent6
// ============================================================================

export async function runAgent6(ctx: OrchestratorContext): Promise<void> {
  type Agent6WarningKind = "transient-progress" | "transient-diagnostic" | "persistent-risk";

  const transientProgressWarnings = new Set<string>();
  const transientDiagnosticWarnings = new Set<string>();
  const persistentRiskWarnings = new Set<string>();

  const emitAgent6Warning = (message: string, kind: Agent6WarningKind): void => {
    const normalized = String(message ?? "").trim();
    if (!normalized) return;

    if (!ctx.warnings.includes(normalized)) {
      ctx.warnings.push(normalized);
    }

    if (kind === "transient-progress") {
      transientProgressWarnings.add(normalized);
      return;
    }
    if (kind === "transient-diagnostic") {
      transientDiagnosticWarnings.add(normalized);
      return;
    }
    persistentRiskWarnings.add(normalized);
  };

  const clearWarningsFromSet = (toClear: Set<string>): void => {
    if (!Array.isArray(ctx.warnings) || ctx.warnings.length === 0) return;
    if (toClear.size === 0) return;
    ctx.warnings = ctx.warnings.filter((warning) => !toClear.has(String(warning).trim()));
  };

  const fairPlayConfig = getGenerationParams().agent6_fairplay.params;
  const MAX_FAIR_PLAY_RETRY_COST = fairPlayConfig.retries.max_retry_cost_usd;
  const retryBudget = createFairPlayRetryBudgetTracker(MAX_FAIR_PLAY_RETRY_COST);
  const minBlindConfidence = normalizeConfidence(
    (fairPlayConfig.blind_reader as any)?.pass_criteria?.min_confidence ?? "likely",
  );
  const maxBlindRemediationCycles = Math.max(
    0,
    Number((fairPlayConfig.blind_reader as any)?.pass_criteria?.max_remediation_cycles ?? 1),
  );
  ctx.reportProgress("fairplay", "Auditing fair play compliance...", 62);

  const clueDensity =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  let fairPlayAudit: FairPlayAuditResult | null = null;
  let fairPlayAuditCostDuringLoop = 0;
  let fairPlayAttempt = 0;
  let emittedFinalCriticalFailureSummary = false;
  const fairPlayStart = Date.now();

  if (ctx.cml && ctx.clues) {
    const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
    if (parityBridgeId) {
      emitAgent6Warning(
        `Agent 6 deterministic parity bridge: injected essential clue ${parityBridgeId} to expose discriminating-test mechanism before the test scene.`,
        "transient-diagnostic",
      );
    }
  }

  while (fairPlayAttempt < fairPlayConfig.retries.max_fair_play_attempts) {
    fairPlayAttempt++;
    fairPlayAudit = await auditFairPlay(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    fairPlayAuditCostDuringLoop += fairPlayAudit.cost;

    if (fairPlayAttempt > 1) {
      retryBudget.consume(fairPlayAudit.cost, `fair-play re-audit attempt ${fairPlayAttempt}`);
    }

    if (fairPlayAudit.overallStatus === "pass") break;

    if (fairPlayAttempt < fairPlayConfig.retries.max_fair_play_attempts) {
      emitAgent6Warning(
        `Agent 6: Fair play audit ${fairPlayAudit.overallStatus}; regenerating clues to address feedback (attempt ${
          fairPlayAttempt + 1
        } of ${fairPlayConfig.retries.max_fair_play_attempts})`,
        "transient-progress",
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback...", 60);
      const retryCluesStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(fairPlayAudit, ctx.cml),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      applyAgent5ContractsToRegeneratedClues(ctx, "fair-play retry");
      retryBudget.consume(ctx.clues.cost, `fair-play clue regeneration attempt ${fairPlayAttempt + 1}`);

      ctx.agentCosts["agent5_clues"] =
        (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
    }
  }

  if (!fairPlayAudit) throw new Error("Fair play audit failed to produce a report");

  ctx.agentCosts["agent6_fairplay"] =
    (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAuditCostDuringLoop;
  ctx.agentDurations["agent6_fairplay"] =
    (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - fairPlayStart);

  const criticalFairPlayRules = ctx.criticalFairPlayRules;
  let hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);

  if (fairPlayAudit.overallStatus === "fail") {
    if (hasCriticalFairPlayFailure) {
      emitAgent6Warning(
        "Agent 6: Fair play audit failed on critical rules after clue regeneration; continuing with warnings",
        "transient-diagnostic",
      );
      fairPlayAudit.violations.forEach((v) =>
        emitAgent6Warning(`  - [${v.severity}] ${v.rule}: ${v.description}`, "transient-diagnostic")
      );
    } else {
      emitAgent6Warning("Agent 6: Fair play audit FAILED after clue regeneration", "transient-diagnostic");
      fairPlayAudit.violations.forEach((v) =>
        emitAgent6Warning(`  - [${v.severity}] ${v.description}`, "transient-diagnostic")
      );
    }
  } else if (fairPlayAudit.overallStatus === "needs-revision") {
    if (hasCriticalFairPlayFailure) {
      emitAgent6Warning(
        "Agent 6: Fair play needs revision with critical issues; continuing with warnings",
        "transient-diagnostic",
      );
      fairPlayAudit.violations.forEach((v) =>
        emitAgent6Warning(`  - [${v.severity}] ${v.rule}: ${v.description}`, "transient-diagnostic")
      );
    } else {
      emitAgent6Warning("Agent 6: Fair play needs minor revisions after clue regeneration", "transient-diagnostic");
    }
    fairPlayAudit.warnings.forEach((w) => emitAgent6Warning(`  - ${w}`, "transient-diagnostic"));
  }

  ctx.reportProgress("fairplay", `Fair play audit: ${fairPlayAudit.overallStatus}`, 75);

  // FP-1: extracted as async closure so it can be called after each fairPlayAudit reassignment
  const recordFairPlayScore = async () => {
    if (!ctx.enableScoring || !ctx.scoreAggregator || !fairPlayAudit) return;
    const fpStatus = fairPlayAudit.overallStatus;
    const fpValidation = fpStatus === "pass" ? 100 : fpStatus === "needs-revision" ? 70 : 45;
    ctx.scoreAggregator.upsertPhaseScore(
      "agent6_fairplay",
      "Fair-play Audit",
      {
        agent: "agent6-fair-play-audit",
        validation_score: fpValidation,
        quality_score: 100,
        completeness_score: 100,
        consistency_score: 100,
        total: fpValidation,
        grade: (fpValidation >= 90 ? "A" : fpValidation >= 80 ? "B" : fpValidation >= 70 ? "C" : fpValidation >= 60 ? "D" : "F") as PhaseScore["grade"],
        passed: fpValidation >= 75,
        failure_reason:
          fpStatus === "fail"
            ? `Fair play audit failed (${fairPlayAudit.violations.length} violation(s))`
            : undefined,
        tests: [
          {
            name: "Overall fair play status",
            category: "validation" as const,
            passed: fpStatus === "pass",
            score: fpValidation,
            weight: 2,
            message: `Status: ${fpStatus}${fairPlayAudit.violations.length > 0 ? ` (${fairPlayAudit.violations.length} violation(s))` : ""}`,
          },
          ...fairPlayAudit.violations.map((v) => ({
            name: v.rule || "Fair play rule",
            category: "validation" as const,
            passed: false,
            score: v.severity === "critical" ? 0 : 50,
            weight: v.severity === "critical" ? 1.5 : 0.5,
            message: v.description,
            severity: v.severity as TestResult["severity"],
          })),
        ],
      },
      ctx.agentDurations["agent6_fairplay"] ?? 0,
      ctx.agentCosts["agent6_fairplay"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  };

  await recordFairPlayScore();

  // ── WP5B: Blind Reader Simulation ─────────────────────────────────────────
  const caseBlockForBlind = (ctx.cml as any)?.CASE ?? ctx.cml;
  const castNamesForBlind = (caseBlockForBlind?.cast ?? []).map((c: any) => c.name).filter(Boolean);
  const falseAssumptionStatement = caseBlockForBlind?.false_assumption?.statement || "";
  const actualCulpritName = caseBlockForBlind?.culpability?.culprits?.[0] || "";

  if (castNamesForBlind.length > 0 && falseAssumptionStatement && actualCulpritName) {
    ctx.reportProgress("fairplay", "Running blind reader simulation...", 73);

    const blindResult = await blindReaderSimulation(
      ctx.client, ctx.clues!, falseAssumptionStatement, castNamesForBlind,
      { runId: ctx.runId, projectId: ctx.projectId || "" }
    );

    ctx.agentCosts["agent6_blind_reader"] = blindResult.cost;
    ctx.agentDurations["agent6_blind_reader"] = blindResult.durationMs;

    const readerGotItRight =
      blindResult.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
      actualCulpritName.toLowerCase().includes(blindResult.suspectedCulprit.toLowerCase());

    const blindPasses =
      readerGotItRight &&
      (CONFIDENCE_RANK[normalizeConfidence(blindResult.confidenceLevel)] ?? -1) >=
        (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely);

    if (blindPasses) {
      ctx.reportProgress("fairplay", "Blind reader simulation: PASS", 74);
    } else {
      ctx.warnings.push(
        `Blind reader simulation: reader suspected "${blindResult.suspectedCulprit}" ` +
        `(confidence: ${blindResult.confidenceLevel}), actual culprit is "${actualCulpritName}"`
      );
      if (blindResult.missingInformation.length > 0) {
        ctx.warnings.push(`Blind reader missing info: ${blindResult.missingInformation.join("; ")}`);
      }

      let latestBlind = blindResult;
      let latestReaderPass = blindPasses;

      for (let cycle = 1; !latestReaderPass && cycle <= maxBlindRemediationCycles; cycle++) {
        const missingCategories = classifyMissingInfoCategories(latestBlind.missingInformation);
        ctx.warnings.push(
          `CRITICAL: Blind reader gate failed (cycle ${cycle}/${maxBlindRemediationCycles}). Regenerating clues with targeted requirements.`
        );

        ctx.reportProgress("clues", "Regenerating clues based on blind reader feedback...", 60);
        const blindRetryStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity,
          redHerringBudget: 2,
          fairPlayFeedback: {
            overallStatus: "fail",
            violations: [
              {
                severity: "critical" as const,
                rule: "Information Parity",
                description:
                  `A blind reader suspected "${latestBlind.suspectedCulprit}" instead of actual culprit "${actualCulpritName}". Reasoning: ${latestBlind.reasoning}`,
                suggestion:
                  `Add direct discriminating evidence for culprit "${actualCulpritName}" and at least one elimination/alibi clue per non-culprit suspect. Fill blind-reader gaps: ${latestBlind.missingInformation.join("; ")}`,
              },
            ],
            warnings: missingCategories.map((c) => `Blind reader category gap: ${c}`),
            recommendations: [
              ...latestBlind.missingInformation.map((info: string) => `Provide evidence for: ${info}`),
              "Ensure at least one culprit-discriminating clue that does not apply to non-culprits.",
              "Ensure each non-culprit has at least one elimination or alibi clue.",
            ],
            requiredReplacements: [
              `Add one clue whose pointsTo states a unique mechanism link to culprit \"${actualCulpritName}\" that no non-culprit satisfies.`,
              `Add one clue whose pointsTo explicitly states \"Eliminates ${latestBlind.suspectedCulprit} because ...\" with corroborating evidence source.`,
            ],
            requiredCluePhrases: deriveBlindReaderRequiredCluePhrases(
              latestBlind.missingInformation,
              actualCulpritName,
              latestBlind.suspectedCulprit,
            ),
          },
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });

        ctx.agentCosts["agent5_clues"] =
          (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - blindRetryStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "blind-reader remediation");
        retryBudget.consume(ctx.clues.cost, `blind-reader clue remediation cycle ${cycle}`);

        const blindReAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent6_fairplay"] =
          (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - blindReAuditStart);
        retryBudget.consume(fairPlayAudit.cost, `blind-reader fair-play re-audit cycle ${cycle}`);
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();

        latestBlind = await blindReaderSimulation(
          ctx.client,
          ctx.clues,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "" }
        );
        ctx.agentCosts["agent6_blind_reader"] =
          (ctx.agentCosts["agent6_blind_reader"] || 0) + latestBlind.cost;
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;
        retryBudget.consume(latestBlind.cost, `blind-reader simulation cycle ${cycle}`);

        const latestGotItRight =
          latestBlind.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
          actualCulpritName.toLowerCase().includes(latestBlind.suspectedCulprit.toLowerCase());
        latestReaderPass =
          latestGotItRight &&
          (CONFIDENCE_RANK[normalizeConfidence(latestBlind.confidenceLevel)] ?? -1) >=
            (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely);

        if (latestReaderPass) {
          ctx.reportProgress("fairplay", "Blind reader simulation: PASS after remediation", 74);
        }
      }

      if (!latestReaderPass) {
        throw new Error(
          `Agent 6 blind-reader gate failed: simulated suspect "${latestBlind.suspectedCulprit}" (confidence ${latestBlind.confidenceLevel}) does not meet configured pass criteria (culprit=${actualCulpritName}, minConfidence=${minBlindConfidence}).`,
        );
      }
    }
  }

  // ── WP6B + WP8: CML Retry on Structural Failure ───────────────────────────
  if (fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure) {
    if (ctx.cml && ctx.clues) {
      const coverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
      ctx.coverageResult = coverageSnapshot.coverageResult;
      ctx.allCoverageIssues = coverageSnapshot.allCoverageIssues;
    }
    const failureClass = classifyFairPlayFailure(ctx.coverageResult!, fairPlayAudit, ctx.cml!);
    const criticalStructuralRules = new Set([
      "information parity",
      "logical deducibility",
      "no withholding",
      "solution uniqueness",
      "discriminating test timing",
    ]);
    const hasStructuralCriticalRule = (fairPlayAudit?.violations ?? []).some(
      (v) => v.severity === "critical" && criticalStructuralRules.has(String(v.rule ?? "").toLowerCase().trim()),
    );
    const shouldEscalateCmlRevision =
      failureClass === "inference_path_abstract"
      || failureClass === "constraint_space_insufficient"
      || failureClass === "clue_coverage"
      || (failureClass === "clue_only" && hasStructuralCriticalRule);

    const caseBlock = (ctx.cml as any)?.CASE ?? ctx.cml ?? {};
    const cmlMeta = caseBlock?.meta ?? {};
    const cmlSetting = cmlMeta?.setting ?? {};
    const cmlEra = cmlMeta?.era ?? {};
    const effectiveCastNames = deriveEffectiveCastNamesForStructuralRevision(ctx);

    const effectiveDecade = firstNonEmpty(
      ctx.setting?.setting?.era?.decade,
      cmlEra?.decade,
      "1930s",
    );
    const effectiveLocationDescription = firstNonEmpty(
      ctx.setting?.setting?.location?.description,
      cmlSetting?.location,
      ctx.locationSpec?.location,
      "country estate",
    );
    const effectiveInstitution = firstNonEmpty(
      ctx.setting?.setting?.location?.type,
      cmlSetting?.institution,
      ctx.locationSpec?.institution,
      "Estate",
    );
    const effectiveWeather = firstNonEmpty(
      ctx.setting?.setting?.atmosphere?.weather,
      "Overcast",
    );
    const effectiveSocialStructure = firstNonEmpty(
      toStringArray(ctx.setting?.setting?.era?.socialNorms).join(", "),
      "Class tensions shape suspect motives and opportunity.",
    );

    const effectiveHardLogicDirectives =
      ctx.hardLogicDirectives
      || ctx.initialHardLogicDirectives
      || {
        complexityLevel: "medium",
        mechanismFamilies: ["physical-constraint proof"],
        hardLogicModes: ["fair-play chain"],
        difficultyMode: "moderate",
      };

    const effectiveBackgroundContext =
      ctx.backgroundContext
      || {
        status: "synthetic",
        backdropSummary: "Hydrated upstream context unavailable; preserve existing CML facts and repair structural fair-play weaknesses only.",
        era: {
          decade: effectiveDecade,
          socialStructure: effectiveSocialStructure,
        },
        setting: {
          location: effectiveLocationDescription,
          institution: effectiveInstitution,
          weather: effectiveWeather,
        },
        castAnchors: effectiveCastNames,
        theme: ctx.inputs.theme || "mystery",
      };

    const canRunStructuralCmlRevision =
      !!ctx.cml
      && effectiveCastNames.length > 0
      && Array.isArray(effectiveHardLogicDirectives.mechanismFamilies)
      && Array.isArray(effectiveHardLogicDirectives.hardLogicModes);

    if (shouldEscalateCmlRevision && !canRunStructuralCmlRevision) {
      emitAgent6Warning(
        `Fair play failure classified as "${failureClass}" but structural CML retry was skipped: missing hydrated upstream context (setting/cast/hard logic/background).`,
        "persistent-risk",
      );
    }

    if (
      canRunStructuralCmlRevision &&
      shouldEscalateCmlRevision &&
      retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST
    ) {
      const hardLogicDevices = ctx.hardLogicDevices ?? { devices: [] };

      if (!ctx.setting || !ctx.cast || !ctx.backgroundContext || !ctx.hardLogicDevices) {
        emitAgent6Warning(
          "Agent 6 structural retry used synthesized upstream context from hydrated CML because full setting/cast/background artifacts were unavailable.",
          "persistent-risk",
        );
      }

      emitAgent6Warning(
        `Fair play failure classified as "${failureClass}" — retrying CML generation (Agent 4) ` +
        "to fix upstream structural problems",
        "transient-progress",
      );

      // Build violation-specific context so Agent 4 knows exactly which mechanism facts to expose
      const revisionViolationContext = (() => {
        const timingRules = new Set(["discriminating test timing", "information parity", "no withholding", "logical deducibility"]);
        const relevantViolations = (fairPlayAudit?.violations ?? []).filter(
          (v) => timingRules.has(String(v.rule ?? "").toLowerCase().trim()),
        );
        const mechanismDesc = String(caseBlock?.hidden_model?.mechanism?.description ?? "").trim();
        const discrimKnowledge = String(caseBlock?.discriminating_test?.knowledge_revealed ?? "").trim();
        const parts: string[] = [];
        if (mechanismDesc) {
          parts.push(`The specific mechanism that must be reader-visible BEFORE the discriminating test: "${mechanismDesc}".`);
        }
        if (discrimKnowledge) {
          parts.push(`The discriminating test reveals: "${discrimKnowledge}" — this MUST NOT be new information; it must trace back to prior essential clues already established in inference_path steps.`);
        }
        for (const v of relevantViolations) {
          const desc = String(v.description ?? "").trim();
          const sug = String(v.suggestion ?? "").trim();
          if (desc) parts.push(`Audit violation [${v.rule}]: ${desc}`);
          if (sug && sug !== desc) parts.push(`Required fix: ${sug}`);
        }
        return parts.length > 0 ? " SPECIFIC VIOLATIONS TO ADDRESS: " + parts.join(" ") : "";
      })();

      const revisionInstructions =
        failureClass === "inference_path_abstract"
          ? "The inference_path steps are too abstract. Rewrite each step with: " +
            "(1) a concrete, scene-level observation the reader can witness, " +
            "(2) a correction that follows from stated evidence, " +
            "(3) an effect that names the suspect eliminated, " +
            "(4) required_evidence listing 2-4 specific facts." +
            revisionViolationContext
        : failureClass === "clue_coverage" || failureClass === "clue_only"
          ? "Fair-play clue coverage remains structurally insufficient. Revise CML so the reader can logically solve the case BEFORE discriminating test: " +
            "(1) inference_path steps must explicitly surface the mechanism fact(s) (no withholding), " +
            "(2) discriminating_test.design must exploit already-exposed evidence rather than introducing new facts, " +
            "(3) discriminating_test.evidence_clues must list 2-3 canonical clue IDs expected to appear as early/mid essential clues, " +
            "(4) at least one step effect must uniquely narrow to culprit via elimination logic." +
            revisionViolationContext
          : "The constraint_space is too sparse. Add: " +
            "(1) at least one temporal contradiction, " +
            "(2) at least 2 access constraints, " +
            "(3) at least 2 physical traces. " +
            "Each constraint must be concrete enough to become a reader-visible clue.";

      ctx.reportProgress("cml", "Revising CML to fix structural fair play issues...", 55);
      const revisionStart = Date.now();

      const cmlYaml =
        typeof ctx.cml === "string" ? (ctx.cml as string) : JSON.stringify(ctx.cml, null, 2);
      const revisionPrompt = buildCMLPrompt({
        decade: effectiveDecade,
        location: effectiveLocationDescription,
        institution: effectiveInstitution,
        tone: ctx.inputs.tone || "Golden Age Mystery",
        weather: effectiveWeather,
        socialStructure: effectiveSocialStructure,
        theme: ctx.inputs.theme || "mystery",
        castSize: effectiveCastNames.length,
        castNames: effectiveCastNames,
        detectiveType: firstNonEmpty(
          ctx.cast?.cast?.crimeDynamics?.detectiveCandidates?.[0],
          "Detective"
        ),
        victimArchetype: firstNonEmpty(
          ctx.cast?.cast?.crimeDynamics?.victimCandidates?.[0],
          "Victim"
        ),
        complexityLevel: normalizeComplexityLevel(effectiveHardLogicDirectives.complexityLevel),
        mechanismFamilies: toStringArray(effectiveHardLogicDirectives.mechanismFamilies),
        primaryAxis: ctx.primaryAxis,
        hardLogicModes: toStringArray(effectiveHardLogicDirectives.hardLogicModes),
        difficultyMode: normalizeDifficultyMode(effectiveHardLogicDirectives.difficultyMode),
        hardLogicDevices: hardLogicDevices.devices,
        backgroundContext: effectiveBackgroundContext,
        noveltyConstraints: ctx.noveltyConstraints,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      const revisedResult = await reviseCml(ctx.client, {
        originalPrompt: {
          system: revisionPrompt.system,
          developer: revisionPrompt.developer || "",
          user: revisionPrompt.user,
        },
        invalidCml: cmlYaml,
        validationErrors: [revisionInstructions],
        attempt: 1,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent4_fairplay_revision"] = revisedResult.cost;
      ctx.agentDurations["agent4_fairplay_revision"] = Date.now() - revisionStart;
      retryBudget.consume(revisedResult.cost, "structural CML revision");

      const revisedSteps =
        ((revisedResult.cml as any)?.CASE ?? revisedResult.cml)?.inference_path?.steps ?? [];
      if (revisedSteps.length >= 3) {
        ctx.cml = revisedResult.cml as any;
        ctx.revisedByAgent4FairPlay = true;
        ctx.fairPlayRevisionAttempts = (ctx.fairPlayRevisionAttempts ?? 0) + 1;
        emitAgent6Warning("CML revised — re-running clue extraction and fair play audit", "transient-progress");

        let revisionFeedbackAudit: FairPlayAuditResult = fairPlayAudit!;
        if (ctx.clues) {
          const feedbackAuditStart = Date.now();
          try {
            const provisionalAudit = await auditFairPlay(ctx.client, {
              caseData: ctx.cml!,
              clues: ctx.clues,
              runId: ctx.runId,
              projectId: ctx.projectId || "",
            });
            ctx.agentCosts["agent6_fairplay"] =
              (ctx.agentCosts["agent6_fairplay"] || 0) + provisionalAudit.cost;
            ctx.agentDurations["agent6_fairplay"] =
              (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - feedbackAuditStart);
            retryBudget.consume(provisionalAudit.cost, "post-CML-revision feedback re-audit");
            revisionFeedbackAudit = provisionalAudit;
          } catch (error) {
            emitAgent6Warning(
              `Agent 6: could not refresh revised-CML fair-play feedback; using previous audit context (${(error as Error).message})`,
              "persistent-risk",
            );
          }
        }

        const reCluesStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity,
          redHerringBudget: 2,
          // Pass revised-CML audit context so clue placement aligns with current structural failures.
          fairPlayFeedback: buildFairPlayFeedbackPayload(revisionFeedbackAudit, ctx.cml),
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] =
          (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - reCluesStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "post-cml-revision");
        retryBudget.consume(ctx.clues.cost, "post-CML-revision clue regeneration");

        const reAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent6_fairplay"] =
          (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - reAuditStart);
        retryBudget.consume(fairPlayAudit.cost, "post-CML-revision fair-play re-audit");
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();
      }
    } else if (
      failureClass === "clue_only" &&
      retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST &&
      fairPlayConfig.retries.max_total_attempts_with_targeted_regen >= 3
    ) {
      emitAgent6Warning(
        "Fair play failure classified as \"clue_only\" — CML structure is sound; " +
        `regenerating clues with targeted per-violation feedback (attempt 3 of ${fairPlayConfig.retries.max_total_attempts_with_targeted_regen})`,
        "transient-progress",
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback (final attempt)...", 63);
      const finalClueRetryStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(fairPlayAudit!, ctx.cml),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] =
        (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - finalClueRetryStart);
      applyAgent5ContractsToRegeneratedClues(ctx, "final-targeted-regen");
      retryBudget.consume(ctx.clues.cost, "final targeted clue regeneration");

      const finalAuditStart = Date.now();
      fairPlayAudit = await auditFairPlay(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent6_fairplay"] =
        (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
      ctx.agentDurations["agent6_fairplay"] =
        (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - finalAuditStart);
      retryBudget.consume(fairPlayAudit.cost, "final targeted fair-play re-audit");
      hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
      await recordFairPlayScore();
    }

    // WP8A-Deterministic Backstop: when critical fair-play violations still remain,
    // synthesize early/mid essential inference-step clues and re-audit once.
    if (
      fairPlayAudit!.overallStatus === "fail"
      && hasCriticalFairPlayFailure
      && ctx.cml
      && ctx.clues
      && retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST
    ) {
      const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
      const auditVisibilityRepairs = synthesizeAuditVisibilityClues(ctx.cml, ctx.clues, fairPlayAudit!);
      backstopRepairs.push(...auditVisibilityRepairs);
      const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
      if (parityBridgeId) {
        backstopRepairs.push(`added ${parityBridgeId} as early essential parity bridge clue`);
      }

      if (backstopRepairs.length > 0) {
        backstopRepairs.forEach((repair) =>
          emitAgent6Warning(`Agent 6 deterministic fair-play backstop: ${repair}`, "persistent-risk"),
        );

        applyAgent5ContractsToRegeneratedClues(ctx, "critical-fairplay-backstop");

        const backstopAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(ctx.client, {
          caseData: ctx.cml,
          clues: ctx.clues,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent6_fairplay"] =
          (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - backstopAuditStart);
        retryBudget.consume(fairPlayAudit.cost, "deterministic fair-play backstop re-audit");
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();
      }
    }

    // WP8A: log remaining failures
    if (fairPlayAudit!.overallStatus === "fail") {
      const criticalViolations = fairPlayAudit!.violations
        .filter((v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule))
        .map((v) => `${v.rule}: ${v.description}`)
        .join("; ");
      if (criticalViolations) {
        emitAgent6Warning(
          `Fair play: critical failures persist after all retries: ${criticalViolations}`,
          "persistent-risk",
        );
        emittedFinalCriticalFailureSummary = true;
      }
    }

    // Retry-budget overflow is handled as a hard stop via retryBudget.consume(...).
  }

  clearWarningsFromSet(transientProgressWarnings);
  if (fairPlayAudit!.overallStatus === "pass" || emittedFinalCriticalFailureSummary) {
    clearWarningsFromSet(transientDiagnosticWarnings);
  }

  if (ctx.cml && ctx.clues) {
    const finalCoverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
    ctx.coverageResult = finalCoverageSnapshot.coverageResult;
    ctx.allCoverageIssues = finalCoverageSnapshot.allCoverageIssues;
  }

  ctx.fairPlayAudit = fairPlayAudit!;
  ctx.hasCriticalFairPlayFailure = hasCriticalFairPlayFailure;
}
