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
import type { FairPlayAuditResult, StructuralAuditResult, StructuralGap, BlindReaderResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { getGenerationParams, validateGenreStructure, type PhaseScore, type TestResult } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type InferenceCoverageResult,
  applyClueGuardrails,
  preAgent9LlmRetriesEnabled,
} from "./shared.js";
import {
  enforceAgent5DeterministicContracts,
  buildStrictPromptFeedback,
  recomputeCoverageSnapshotForAgent6,
} from "./agent5-run.js";
import {
  classifyFairPlayFailure,
  shouldEscalateStructuralCmlRevision,
  type FairPlayFailureClass,
} from "./agent6-escalation-policy.js";
import {
  parseRevealGateMode,
  auditRedHerringTargets,
  auditDeathMethodDeducibility,
  evaluateRevealVerdict,
} from "./agent6-reveal-gate.js";
import { nameAppearsAsWord } from "./identity-match.js";

// ============================================================================
// classifyFairPlayFailure (agent-6 only)
// ============================================================================

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

const deriveCastPathNameIndexMap = (cml?: CaseData): Array<{ index: number; name: string }> => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  return cast
    .map((member: any, index: number) => ({ index, name: String(member?.name ?? "").trim() }))
    .filter((entry: { index: number; name: string }) => entry.name.length > 0);
};

const deriveCastPathBindingRules = (cml?: CaseData): string[] => {
  const map = deriveCastPathNameIndexMap(cml);
  const rules = [
    "CAST PATH COUPLING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name exactly.",
    "CAST PATH COUPLING CONTRACT: Never rewrite suspect names independently of sourceInCML cast index binding.",
  ];
  for (const entry of map.slice(0, 12)) {
    rules.push(`cast_index_to_name_map[${entry.index}] = ${entry.name}`);
  }
  return rules;
};

const buildUnifiedRetryContractPhrases = (cml?: CaseData): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const evidenceIds = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues
        .map((id: unknown) => String(id ?? "").trim())
        .filter((id: string) => id.length > 0)
    : [];

  const phrases = [
    "UNIFIED RETRY CONTRACT: Keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering jointly true in the same output.",
    "MECHANISM VISIBILITY ORDER: Before Act III, the reader can execute observation -> correction -> elimination using essential early|mid clues; the discriminating test only confirms.",
    "DISCRIMINATING ID PARITY CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear in clues[].id and be essential early|mid.",
    "CAST PATH COUPLING CONTRACT: If sourceInCML uses CASE.cast[N].*, clue suspect references must use cast[N].name and no other suspect name.",
    "FAIL-FAST CONTRACT: If cast-path coupling, source-path legality, or discriminating evidence ID parity fails, status must be fail.",
  ];

  if (evidenceIds.length > 0) {
    phrases.push(`DISCRIMINATING ID SET: ${evidenceIds.join(", ")}`);
  }

  return phrases;
};

const isAmbiguousSuspectRewriteDirective = (text: string): boolean => {
  const normalized = String(text ?? "").toLowerCase();
  if (!normalized) return false;
  const mentionsSuspectRewrite = /(suspect|culprit|name|rewrite|rename)/.test(normalized);
  const hasSourceCoupling = /(sourceincml|source path|case\.cast|cast\[|index|binding|coupl)/.test(normalized);
  return mentionsSuspectRewrite && !hasSourceCoupling;
};

const STRICT_FIRST_PASS_ACCEPTANCE_STATEMENTS = [
  "ACCEPTANCE: clue_mechanism_visibility_core must be essential and early|mid, and must make the mechanism reader-visible before the discriminating test.",
  "ACCEPTANCE: clue_core_contradiction_chain must be essential and early|mid, and must overturn the false assumption with concrete evidence.",
  "ACCEPTANCE: clue_core_elimination_chain must be essential and early|mid, and must explicitly eliminate at least one eligible non-culprit.",
  "ACCEPTANCE: Before Act III, the reader can execute observation -> correction -> elimination to narrow uniquely to the culprit; the discriminating test only confirms.",
] as const;

const FIXED_RETRY_TARGET_CLUE_IDS = [
  "clue_mechanism_visibility_core",
  "clue_core_contradiction_chain",
  "clue_core_elimination_chain",
] as const;

const normalizeViolationCode = (rule: unknown): string =>
  String(rule ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");

const deriveRetryViolationCodes = (fairPlayAudit: FairPlayAuditResult): string[] =>
  [...new Set(
    (Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [])
      .map((violation) => normalizeViolationCode(violation?.rule))
      .filter(Boolean),
  )].slice(0, 12);

const deriveRetryTargetedClueIds = (
  fairPlayAudit: FairPlayAuditResult,
  cml?: CaseData,
  clues?: { clues?: Array<{ id?: string }> },
): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const normalizedRules = new Set(
    (Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [])
      .map((violation) => String(violation?.rule ?? "").trim().toLowerCase())
      .filter(Boolean),
  );
  const targetedIds = new Set<string>();
  const discriminatingIds = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues
        .map((id: unknown) => String(id ?? "").trim())
        .filter(Boolean)
    : [];

  const needsStructuralDelta = [
    "clue visibility",
    "information parity",
    "logical deducibility",
    "discriminating test timing",
    "no withholding",
    "solution uniqueness",
  ].some((rule) => normalizedRules.has(rule));

  if (needsStructuralDelta) {
    FIXED_RETRY_TARGET_CLUE_IDS.forEach((id) => targetedIds.add(id));
    discriminatingIds.forEach((id: string) => targetedIds.add(id));
  }

  if (normalizedRules.has("false assumption support") || normalizedRules.has("red herring separation")) {
    ["rh_1", "rh_2"].forEach((id) => targetedIds.add(id));
  }

  if (targetedIds.size === 0 && discriminatingIds.length > 0) {
    discriminatingIds.forEach((id: string) => targetedIds.add(id));
  }

  return Array.from(targetedIds).slice(0, 18);
};

const deriveRetryPreserveClueIds = (
  clues: { clues?: Array<{ id?: string }> } | undefined,
  targetedClueIds: string[],
): string[] => {
  const targetedSet = new Set(targetedClueIds);
  return Array.isArray(clues?.clues)
    ? clues.clues
        .map((clue) => String(clue?.id ?? "").trim())
        .filter((id) => id.length > 0 && !targetedSet.has(id))
        .slice(0, 24)
    : [];
};

const deriveRequiredCluePhrases = (fairPlayAudit: FairPlayAuditResult, cml?: CaseData): string[] => {
  const structuralRules = new Set([
    "information parity",
    "logical deducibility",
    "no withholding",
    "discriminating test timing",
  ]);

  const phrases: string[] = [];
  const unifiedRetryContractPhrases = buildUnifiedRetryContractPhrases(cml);
  const castPathBindingRules = deriveCastPathBindingRules(cml);
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
      if (isAmbiguousSuspectRewriteDirective(suggestion)) {
        phrases.push(
          "If a suspect reference is rewritten, preserve sourceInCML CASE.cast[N].* coupling with cast[N].name from the cast-index map.",
        );
        continue;
      }
      phrases.push(suggestion);
      continue;
    }
    if (description.length >= 16 && /(early|mid|essential|before|eliminat|contradiction|mechanism|discriminating)/i.test(description)) {
      if (isAmbiguousSuspectRewriteDirective(description)) {
        phrases.push(
          "If a suspect reference is rewritten, preserve sourceInCML CASE.cast[N].* coupling with cast[N].name from the cast-index map.",
        );
        continue;
      }
      phrases.push(description);
    }
  }

  return [
    ...new Set([
      ...STRICT_FIRST_PASS_ACCEPTANCE_STATEMENTS,
      ...unifiedRetryContractPhrases,
      ...castPathBindingRules,
      ...phrases,
    ]),
  ].slice(0, 16);
};

const buildFairPlayFeedbackPayload = (
  fairPlayAudit: FairPlayAuditResult,
  cml?: CaseData,
  clues?: { clues?: Array<{ id?: string }> },
) => {
  const acceptanceSummary =
    "First-pass acceptance contract: essential early|mid mechanism, contradiction, and elimination clues; reader-solvable observation -> correction -> elimination chain before Act III.";
  const unifiedContractSummary =
    "Unified retry contract: keep cast-path coupling, discriminating evidence ID parity, and mechanism-visibility ordering non-conflicting in one output.";
  const castPathBindingRules = deriveCastPathBindingRules(cml);
  const castPathNameIndexMap = deriveCastPathNameIndexMap(cml);
  const violationCodes = deriveRetryViolationCodes(fairPlayAudit);
  const targetedClueIds = deriveRetryTargetedClueIds(fairPlayAudit, cml, clues);
  const preserveClueIds = deriveRetryPreserveClueIds(clues, targetedClueIds);
  const strictPromptFeedback = cml ? buildStrictPromptFeedback(cml) : undefined;
  const requiredCluePhrases = [
    ...new Set([
      ...deriveRequiredCluePhrases(fairPlayAudit, cml),
      ...castPathBindingRules,
    ]),
  ].slice(0, 18);

  return {
    overallStatus: fairPlayAudit.overallStatus,
    violations: fairPlayAudit.violations,
    warnings: appendUniqueStrings(fairPlayAudit.warnings, [acceptanceSummary, unifiedContractSummary]),
    recommendations: fairPlayAudit.recommendations,
    violationCodes,
    targetedClueIds,
    preserveClueIds,
    requiredCluePhrases,
    castPathBindingRules,
    castPathNameIndexMap,
    strictSourcePaths: strictPromptFeedback?.strictSourcePaths,
    requiredIdToSourceMappings: strictPromptFeedback?.requiredIdToSourceMappings,
    requiredStepCoverageFloors: strictPromptFeedback?.requiredStepCoverageFloors,
    requiredLateClueSlot: strictPromptFeedback?.requiredLateClueSlot,
    requiredDirectCulpritClue: strictPromptFeedback?.requiredDirectCulpritClue,
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

  const expectedEvidenceIds = Array.isArray(((ctx.cml as any)?.CASE ?? (ctx.cml as any))?.discriminating_test?.evidence_clues)
    ? (((ctx.cml as any)?.CASE ?? (ctx.cml as any)).discriminating_test.evidence_clues as unknown[])
      .map((id) => String(id ?? "").trim())
      .filter(Boolean)
    : [];
  const listCurrentClueIds = (): Set<string> => new Set(
    (Array.isArray(ctx.clues?.clues) ? ctx.clues.clues : [])
      .map((clue: any) => String(clue?.id ?? "").trim())
      .filter(Boolean),
  );
  const initialClueIds = listCurrentClueIds();
  const preserveRecoveredEvidenceIdWarnings = () => {
    if (expectedEvidenceIds.length === 0) return;
    const currentClueIds = listCurrentClueIds();
    for (const clueId of expectedEvidenceIds) {
      if (initialClueIds.has(clueId) || !currentClueIds.has(clueId)) continue;
      const alreadyLogged = ctx.warnings.some((warning) =>
        /evidence-id deterministic synthesis/i.test(String(warning)) && String(warning).includes(clueId),
      );
      if (alreadyLogged) continue;
      ctx.warnings.push(
        `Agent 6 (${contextLabel}) Agent 5 evidence-id deterministic synthesis: added missing clue id ${clueId} during regenerated clue validation.`,
      );
    }
  };

  const runDeterministicContracts = () => enforceAgent5DeterministicContracts(ctx.cml!, ctx.clues!, {
    hardLogicLockedFacts,
  });

  const retryDeterministicContractsWithParityBridge = (
    message: string,
    errorContext: string,
  ): { warnings: string[] } => {
    const parityBridgeId = ensureParityBridgeClue(ctx.cml!, ctx.clues!);
    if (!parityBridgeId) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}${errorContext}): ${message}`);
      throw new Error(message);
    }

    ctx.warnings.push(
      `Agent 6 (${contextLabel}) mechanism-visibility fallback: injected essential clue ${parityBridgeId} and retried deterministic contracts.`,
    );

    try {
      return runDeterministicContracts();
    } catch (retryError) {
      pushError(
        `Agent 6 regenerated clue deterministic contract (${contextLabel}${errorContext}): ${(retryError as Error).message}`,
      );
      throw retryError;
    }
  };

  let deterministicContracts: { warnings: string[] };
  try {
    deterministicContracts = runDeterministicContracts();
  } catch (error) {
    const message = (error as Error).message || "";
    const isMechanismVisibilityFailure = /mechanism visibility gate failed/i.test(message);
    const isStrictStepCoverageFailure = /strict step coverage gate failed/i.test(message);

    preserveRecoveredEvidenceIdWarnings();

    if (!isMechanismVisibilityFailure && !isStrictStepCoverageFailure) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}): ${message}`);
      throw error;
    }

    if (isStrictStepCoverageFailure) {
      const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
      if (backstopRepairs.length === 0) {
        pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}): ${message}`);
        throw error;
      }

      backstopRepairs.forEach((repair) =>
        ctx.warnings.push(`Agent 6 (${contextLabel}) strict-step fallback: ${repair}`),
      );

      try {
        deterministicContracts = runDeterministicContracts();
      } catch (retryError) {
        const retryMessage = (retryError as Error).message || "";
        if (!/mechanism visibility gate failed/i.test(retryMessage)) {
          pushError(
            `Agent 6 regenerated clue deterministic contract (${contextLabel}, strict-step fallback): ${retryMessage}`,
          );
          throw retryError;
        }
        deterministicContracts = retryDeterministicContractsWithParityBridge(
          retryMessage,
          ", strict-step + mechanism fallback",
        );
      }
    } else {
      deterministicContracts = retryDeterministicContractsWithParityBridge(message, ", mechanism fallback");
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

const trimSynthesizedClueText = (text: string): string =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,;:\- ]+|[,;:\- ]+$/g, "");

const toSentenceCase = (text: string): string => {
  const trimmed = trimSynthesizedClueText(text);
  if (!trimmed) return "";
  const sentence = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
};

const lowerFirstSentence = (text: string): string => {
  const trimmed = trimSynthesizedClueText(text).replace(/[.!?]+$/, "");
  if (!trimmed) return "";
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
};

const normalizeGroundedClueSentence = (rawText: string, fallback: string): string => {
  const normalized = trimSynthesizedClueText(rawText);
  if (!normalized) return toSentenceCase(fallback);

  const useToRevealMatch = normalized.match(
    /^(?:use|trace|follow|check|highlight|present|recreate)\s+(.+?)\s+to\s+(?:prove|show|reveal|demonstrate|confirm|highlight)\s+(.+)$/i,
  );
  if (useToRevealMatch) {
    return toSentenceCase(`${useToRevealMatch[1]} indicate ${useToRevealMatch[2]}`);
  }

  const matchWithMatch = normalized.match(/^(?:match|compare)\s+(.+?)\s+with\s+(.+)$/i);
  if (matchWithMatch) {
    return toSentenceCase(`${matchWithMatch[1]} align with ${matchWithMatch[2]}`);
  }

  const trapRevealMatch = normalized.match(
    /^(?:a |the )?(?:controlled )?(?:trap|test|confrontation|experiment)\s+(?:reveals|shows|highlights|proves|confirms)\s+(.+)$/i,
  );
  if (trapRevealMatch) {
    return toSentenceCase(trapRevealMatch[1]);
  }

  const beforeTestMatch = normalized.match(/^before the (?:discriminating )?test,?\s*(.+)$/i);
  if (beforeTestMatch) {
    return toSentenceCase(beforeTestMatch[1]);
  }

  return toSentenceCase(normalized);
};

// ============================================================================
// Deterministic Structural Audit (Phase 2 — runs BEFORE any LLM call)
// ============================================================================

/**
 * Checks the three structural invariants that the LLM cannot reliably verify:
 *   1. All discriminating_test.evidence_clues IDs are present in early|mid placement
 *   2. Each inference step has ≥1 essential early|mid clue (by supportsInferenceStep)
 *   3. Each non-culprit suspect has ≥1 elimination clue
 *
 * Returns a StructuralAuditResult that drives escalation and is injected into the
 * Agent 6 developer context so the LLM audits only narrative quality.
 */
export const runDeterministicStructuralAudit = (
  cml: CaseData,
  clues: { clues?: Array<{ id?: string; placement?: string; criticality?: string; supportsInferenceStep?: number; description?: string; pointsTo?: string; evidenceType?: string }> },
): StructuralAuditResult => {
  const caseBlock = (cml as any)?.CASE ?? cml ?? {};
  const clueList = Array.isArray(clues?.clues) ? clues.clues : [];

  const gaps: StructuralGap[] = [];

  // ── Check 1: discriminating_test.evidence_clues present in early|mid ────────
  const evidenceClueIds: string[] = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? (caseBlock.discriminating_test.evidence_clues as unknown[])
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    : [];

  const clueById = new Map(clueList.map((c) => [String(c.id ?? "").trim(), c]));
  const evidenceCluesPresent: string[] = [];
  const evidenceCluesMissing: string[] = [];

  for (const id of evidenceClueIds) {
    const clue = clueById.get(id);
    if (clue && (clue.placement === "early" || clue.placement === "mid")) {
      evidenceCluesPresent.push(id);
    } else {
      evidenceCluesMissing.push(id);
      gaps.push({
        kind: "evidence_clue_missing",
        description: `discriminating_test evidence clue "${id}" is absent from early|mid distribution`,
        clueId: id,
      });
    }
  }

  // ── Check 2: each inference step has ≥1 essential early|mid clue ────────────
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];

  const stepsCovered: number[] = [];
  const stepsUncovered: number[] = [];

  // A_53 P10 (backstop-and-parity-bridge-recompute-clue-scans): build a single Set of steps covered by
  // an essential early|mid clue in ONE pass over the clues, instead of an O(clues) `some(...)` scan per
  // step (O(steps×clues) every audit, run multiple times per generation).
  const coveredStepNumbers = new Set<number>();
  for (const c of clueList) {
    if (
      c.criticality === "essential" &&
      (c.placement === "early" || c.placement === "mid")
    ) {
      const step = Number(c.supportsInferenceStep);
      if (Number.isFinite(step)) coveredStepNumbers.add(step);
    }
  }

  for (let i = 0; i < inferenceSteps.length; i++) {
    const stepNumber = i + 1;
    const hasEarlyMidEssential = coveredStepNumbers.has(stepNumber);
    if (hasEarlyMidEssential) {
      stepsCovered.push(stepNumber);
    } else {
      stepsUncovered.push(stepNumber);
      gaps.push({
        kind: "inference_step_uncovered",
        description: `Inference step ${stepNumber} has no essential early|mid clue (supportsInferenceStep=${stepNumber})`,
        stepNumber,
      });
    }
  }

  // ── Check 3: each non-culprit has ≥1 eliminating clue ───────────────────────
  const culprits = new Set(
    Array.isArray(caseBlock?.culpability?.culprits)
      ? (caseBlock.culpability.culprits as unknown[])
          .map((c) => String(c ?? "").trim().toLowerCase())
          .filter(Boolean)
      : [],
  );
  const castList = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const nonCulprits = castList
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.has(name.toLowerCase()));

  const eliminationPresent: string[] = [];
  const eliminationMissing: string[] = [];

  for (const name of nonCulprits) {
    const hasElimination = clueList.some((c) => {
      const desc = String(c.description ?? "").toLowerCase();
      const pointsTo = String(c.pointsTo ?? "").toLowerCase();
      // A_53 P4 (Pattern D): word-boundary/surname match, not substring — "Ann" must not match "Joanna".
      const isAboutSuspect = nameAppearsAsWord(name, desc) || nameAppearsAsWord(name, pointsTo);
      const isEliminatory =
        c.evidenceType === "elimination" ||
        pointsTo.includes("eliminat") ||
        pointsTo.includes("rules out") ||
        pointsTo.includes("clears") ||
        pointsTo.includes("alibis") ||
        pointsTo.includes("cannot have");
      return isAboutSuspect && isEliminatory;
    });
    if (hasElimination) {
      eliminationPresent.push(name);
    } else {
      eliminationMissing.push(name);
      // Elimination gaps are advisory — they don't block escalation by themselves
      // because the backstop system handles them. Only add to gaps if we have zero eliminations.
    }
  }

  // A_53 P5 (structural-audit-elimination-all-or-nothing): the old check only fired when ZERO
  // non-culprits had an elimination clue — a single elimination silenced the gap for the other N.
  // Flag when fewer than a minimum FRACTION are eliminated, and always surface the missing names.
  // (Advisory: elimination_missing is filtered out of blockingGaps below — this only sharpens the
  // signal the backstop/telemetry sees, never aborts.)
  if (nonCulprits.length > 0) {
    const MIN_ELIMINATED_FRACTION = 0.5;
    const eliminatedFraction = eliminationPresent.length / nonCulprits.length;
    if (eliminatedFraction < MIN_ELIMINATED_FRACTION) {
      gaps.push({
        kind: "elimination_missing",
        description:
          `Only ${eliminationPresent.length}/${nonCulprits.length} non-culprit suspect(s) have elimination clues ` +
          `(missing: ${eliminationMissing.join(", ")})`,
      });
    }
  }

  // ── Check 4: at least one evidence clue explicitly names the culprit in pointsTo (advisory) ───
  if (evidenceClueIds.length > 0 && culprits.size > 0) {
    const culpritList = [...culprits];
    const anyCulpritPointing = evidenceClueIds.some((id) => {
      const clue = clueById.get(id);
      if (!clue) return false;
      const pointsTo = String(clue.pointsTo ?? "").toLowerCase();
      // A_53 P4 (Pattern D): word-boundary/surname match, not substring.
      return culpritList.some((culprit) => nameAppearsAsWord(culprit, pointsTo));
    });
    if (!anyCulpritPointing) {
      gaps.push({
        kind: "culprit_exclusivity_missing",
        description: `No discriminating_test evidence clue has pointsTo text naming the culprit (${culpritList.join(", ")}). At least one evidence clue must explicitly link unique access or physical proof to the culprit.`,
      });
    }
  }

  // `passed` reflects only blocking structural gaps (evidence_clue_missing, inference_step_uncovered).
  // elimination_missing and culprit_exclusivity_missing are advisory — they do not trigger escalation.
  const blockingGaps = gaps.filter((g) => g.kind !== "elimination_missing" && g.kind !== "culprit_exclusivity_missing");

  return {
    passed: blockingGaps.length === 0,
    gaps,
    evidenceCluesPresent,
    evidenceCluesMissing,
    stepsCovered,
    stepsUncovered,
    eliminationPresent,
    eliminationMissing,
  };
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
  const bridgeStatement = normalizeGroundedClueSentence(
    discrimKnowledge || discrimDesign,
    "Concrete case evidence points to a mechanism detail already present in the file.",
  );

  const bridgeDescription = bridgeStatement;
  const bridgePointsTo = toSentenceCase(
    `Connects the earlier evidence to the conclusion that ${lowerFirstSentence(bridgeStatement)}`,
  );

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

  // A_53 P10 (backstop-and-parity-bridge-recompute-clue-scans): index early|mid essential clues by
  // supportsInferenceStep ONCE, then keep it in sync as backstop clues are pushed — instead of two
  // O(clues) `clueList.some(...)` scans per step (O(steps×clues) every call, 5–8×/run on data that
  // only grows incrementally). The index is the source of truth for per-step membership below.
  const earlyMidEssentialByStep = new Map<number, any[]>();
  const indexClueForStep = (clue: any): void => {
    const isEarlyMidEssential =
      clue?.criticality === "essential"
      && (clue?.placement === "early" || clue?.placement === "mid");
    if (!isEarlyMidEssential) return;
    const step = Number(clue?.supportsInferenceStep);
    if (!Number.isFinite(step)) return;
    const bucket = earlyMidEssentialByStep.get(step);
    if (bucket) bucket.push(clue);
    else earlyMidEssentialByStep.set(step, [clue]);
  };
  for (const clue of clueList) indexClueForStep(clue);
  const isContradiction = (clue: any): boolean =>
    String(clue?.evidenceType ?? "").toLowerCase() === "contradiction";

  for (let i = 0; i < inferenceSteps.length; i += 1) {
    const stepNumber = i + 1;
    const stepBucket = earlyMidEssentialByStep.get(stepNumber) ?? [];
    let hasEarlyMidEssentialForStep = stepBucket.length > 0;
    let hasEarlyMidContradictionForStep = stepBucket.some(isContradiction);

    const step = inferenceSteps[i] ?? {};
    const observation = String(step?.observation ?? "").trim();
    const correction = String(step?.correction ?? "").trim();
    const effect = String(step?.effect ?? "").trim();
    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.map((e: any) => String(e ?? "").trim()).filter(Boolean)
      : [];
    const firstRequiredEvidenceText = requiredEvidence.find(
      (entry: string) => !/^CASE\./.test(entry) && /[\s,.;:]/.test(entry),
    ) ?? "";

    const preferredEvidencePath = requiredEvidence.find((entry: string) => /^CASE\./.test(entry));
    const sourceInCML = preferredEvidencePath || (correction
      ? `CASE.inference_path.steps[${i}].correction`
      : `CASE.inference_path.steps[${i}].observation`);

    const description = normalizeGroundedClueSentence(
      observation || firstRequiredEvidenceText || correction || effect,
      "A concrete case detail surfaces in the shared evidence.",
    );
    const pointsTo = normalizeGroundedClueSentence(
      correction || effect || firstRequiredEvidenceText || observation,
      "Concrete case evidence narrows suspect possibilities.",
    );

    const clueId = nextId(`clue_fp_backstop_step_${stepNumber}`);
    const placement = stepNumber <= 2 ? "early" : "mid";

    if (!hasEarlyMidEssentialForStep) {
      const evidenceType = correction ? "contradiction" : "observation";
      const essentialClue = {
        ...template,
        id: clueId,
        sourceInCML,
        description,
        pointsTo,
        placement,
        criticality: "essential",
        evidenceType,
        supportsInferenceStep: stepNumber,
      };
      clueList.push(essentialClue);
      indexClueForStep(essentialClue); // A_53 P10: keep the per-step index in sync incrementally

      if (placement === "early") {
        timeline.early.push(clueId);
      } else {
        timeline.mid.push(clueId);
      }

      repairs.push(`added ${clueId} as ${placement} essential clue for inference step ${stepNumber}`);
      hasEarlyMidEssentialForStep = true;
      if (evidenceType === "contradiction") {
        hasEarlyMidContradictionForStep = true;
      }
    }

    if (hasEarlyMidContradictionForStep) continue;

    const contradictionId = nextId(`clue_fp_contradiction_step_${stepNumber}`);
    const contradictionSource = correction
      ? `CASE.inference_path.steps[${i}].correction`
      : `CASE.inference_path.steps[${i}].observation`;
    const contradictionDescription = normalizeGroundedClueSentence(
      observation || firstRequiredEvidenceText || correction || effect,
      "A concrete case detail undercuts the false account.",
    );
    const contradictionPointsTo = normalizeGroundedClueSentence(
      correction || effect || firstRequiredEvidenceText || observation,
      "Concrete case evidence overturns the false account.",
    );

    const contradictionClue = {
      ...template,
      id: contradictionId,
      sourceInCML: contradictionSource,
      description: contradictionDescription,
      pointsTo: contradictionPointsTo,
      placement,
      criticality: "essential",
      evidenceType: "contradiction",
      supportsInferenceStep: stepNumber,
    };
    clueList.push(contradictionClue);
    indexClueForStep(contradictionClue); // A_53 P10: keep the per-step index in sync incrementally

    if (placement === "early") {
      timeline.early.push(contradictionId);
    } else {
      timeline.mid.push(contradictionId);
    }

    repairs.push(`added ${contradictionId} as ${placement} essential contradiction clue for inference step ${stepNumber}`);
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

const canonicalizeClueId = (value: unknown): string => {
  const normalized = String(value ?? "").trim();
  return /^clue_[a-z0-9_-]+$/i.test(normalized) ? normalized : "";
};

const deriveClueDeliveryMethod = (clue: any): string => {
  const evidenceType = String(clue?.evidenceType ?? "").trim().toLowerCase();
  if (evidenceType === "contradiction") return "Cross-check contradiction";
  if (evidenceType === "elimination") return "Corroborated elimination";

  const category = String(clue?.category ?? "").trim().toLowerCase();
  if (category === "testimonial") return "Witness statement";
  if (category === "behavioral") return "Behavioral observation";
  return "Direct observation";
};

const placementRank = (placement: string): number => {
  if (placement === "early") return 0;
  if (placement === "mid") return 1;
  return 2;
};

const buildClueTimelineOrderMap = (clues: any): Map<string, number> => {
  const order = new Map<string, number>();
  const timeline = (clues as any)?.clueTimeline ?? {};
  let index = 0;
  for (const bucket of [timeline.early, timeline.mid, timeline.late]) {
    if (!Array.isArray(bucket)) continue;
    for (const clueId of bucket) {
      const normalizedId = canonicalizeClueId(clueId);
      if (!normalizedId || order.has(normalizedId)) continue;
      order.set(normalizedId, index);
      index += 1;
    }
  }
  return order;
};

const derivePreTestSceneTarget = (
  placement: string,
  indexWithinPlacement: number,
  discriminatingAct: number,
  discriminatingScene: number,
): { act_number: number; scene_number: number } => {
  let actNumber = placement === "early" ? 1 : placement === "mid" ? Math.max(1, discriminatingAct - 1) : discriminatingAct;
  const maxPreTestScene = Math.max(1, discriminatingScene - 1);
  let sceneNumber = Math.min(Math.max(1, indexWithinPlacement + 1), maxPreTestScene);

  if (actNumber > discriminatingAct || (actNumber === discriminatingAct && sceneNumber >= discriminatingScene)) {
    if (discriminatingScene > 1) {
      actNumber = discriminatingAct;
      sceneNumber = Math.max(1, discriminatingScene - 1);
    } else {
      actNumber = Math.max(1, discriminatingAct - 1);
      sceneNumber = 1;
    }
  }

  return { act_number: actNumber, scene_number: sceneNumber };
};

/** A_61 RC3.4 — force every discriminating-test evidence clue into a pre-test scene, even if it is
 * absent from clues.clues (the Agent-5 soft-repair gap). Default OFF; N≥4 before default-on. */
const isDtEvidenceCompletenessEnabled = () => /^(1|true|yes|on)$/i.test(process.env.AGENT6_DT_EVIDENCE_COMPLETENESS ?? "");

const synchronizeClueTraceabilityFromCurrentClues = (cml: CaseData, clues: any): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml ?? {};
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  // RC3.4: the completeness backstop must run even with zero generated clue objects (the Agent-5
  // soft-repair gap plants no object but the evidence id still needs a pre-test mapping).
  const hasEvidenceForCompleteness =
    isDtEvidenceCompletenessEnabled() &&
    Array.isArray(caseBlock?.discriminating_test?.evidence_clues) &&
    caseBlock.discriminating_test.evidence_clues.length > 0;
  if (clueList.length === 0 && !hasEvidenceForCompleteness) return [];

  const proseRequirements = ((caseBlock as any).prose_requirements ??= {});
  const discriminatingScene = ((proseRequirements as any).discriminating_test_scene ??= {});
  const discriminatingAct = Number.isInteger(Number(discriminatingScene.act_number)) && Number(discriminatingScene.act_number) > 0
    ? Number(discriminatingScene.act_number)
    : 3;
  const discriminatingSceneNumber = Number.isInteger(Number(discriminatingScene.scene_number)) && Number(discriminatingScene.scene_number) > 0
    ? Number(discriminatingScene.scene_number)
    : 3;

  const evidenceIdSet = new Set(
    (Array.isArray(caseBlock?.discriminating_test?.evidence_clues) ? caseBlock.discriminating_test.evidence_clues : [])
      .map((id: unknown) => canonicalizeClueId(id))
      .filter(Boolean),
  );
  const timelineOrder = buildClueTimelineOrderMap(clues);
  const relevantClues = clueList
    .filter((clue) => {
      const clueId = canonicalizeClueId(clue?.id);
      if (!clueId) return false;
      if (evidenceIdSet.has(clueId)) return true;
      const placement = String(clue?.placement ?? "").trim().toLowerCase();
      const criticality = String(clue?.criticality ?? "").trim().toLowerCase();
      return criticality === "essential" && (placement === "early" || placement === "mid");
    })
    .sort((left, right) => {
      const leftPlacement = String(left?.placement ?? "").trim().toLowerCase();
      const rightPlacement = String(right?.placement ?? "").trim().toLowerCase();
      const rankDelta = placementRank(leftPlacement) - placementRank(rightPlacement);
      if (rankDelta !== 0) return rankDelta;

      const leftId = canonicalizeClueId(left?.id);
      const rightId = canonicalizeClueId(right?.id);
      const leftOrder = timelineOrder.get(leftId) ?? Number.MAX_SAFE_INTEGER;
      const rightOrder = timelineOrder.get(rightId) ?? Number.MAX_SAFE_INTEGER;
      if (leftOrder !== rightOrder) return leftOrder - rightOrder;
      return leftId.localeCompare(rightId);
    });

  // RC3.4: when the completeness backstop is on, still run even with no relevant clues so an evidence
  // clue absent from clues.clues (the Agent-5 soft-repair gap) is force-mapped before the DT scene.
  const runCompleteness = isDtEvidenceCompletenessEnabled() && evidenceIdSet.size > 0;
  if (relevantClues.length === 0 && !runCompleteness) return [];

  const existingEntries = Array.isArray(proseRequirements.clue_to_scene_mapping)
    ? proseRequirements.clue_to_scene_mapping
    : [];
  const mappingById = new Map<string, any>();
  for (const rawEntry of existingEntries) {
    const entry = rawEntry && typeof rawEntry === "object" ? { ...rawEntry } : {};
    const clueId = canonicalizeClueId(entry.clue_id);
    if (!clueId) continue;
    entry.clue_id = clueId;
    mappingById.set(clueId, entry);
  }

  const counters = new Map<string, number>();
  const updates: string[] = [];
  for (const clue of relevantClues) {
    const clueId = canonicalizeClueId(clue?.id);
    if (!clueId) continue;
    const placement = String(clue?.placement ?? "").trim().toLowerCase();
    const placementIndex = counters.get(placement) ?? 0;
    counters.set(placement, placementIndex + 1);

    const target = derivePreTestSceneTarget(
      placement === "early" || placement === "mid" ? placement : evidenceIdSet.has(clueId) ? "mid" : "early",
      placementIndex,
      discriminatingAct,
      discriminatingSceneNumber,
    );
    const deliveryMethod = deriveClueDeliveryMethod(clue);
    const existing = mappingById.get(clueId) ?? { clue_id: clueId };

    const changed = Number(existing.act_number) !== target.act_number
      || Number(existing.scene_number) !== target.scene_number
      || String(existing.delivery_method ?? "").trim().length === 0;

    if (changed) {
      mappingById.set(clueId, {
        ...existing,
        clue_id: clueId,
        act_number: target.act_number,
        scene_number: target.scene_number,
        delivery_method: String(existing.delivery_method ?? "").trim() || deliveryMethod,
      });
      updates.push(`${clueId} -> Act ${target.act_number}, Scene ${target.scene_number}`);
    }
  }

  // RC3.4 — DT-evidence completeness backstop. Iterate the evidence clue IDs DIRECTLY so an evidence
  // clue that is unmapped OR mapped at/after the DT scene is corrected to a pre-test scene, independent
  // of whether it has an object in clues.clues. This closes the Agent-5 soft-repair gap that otherwise
  // leaves a stale unplanted-evidence mapping and a false revealUsesUnplantedEvidence rubric cap.
  if (runCompleteness) {
    const dtKey = discriminatingAct * 100 + discriminatingSceneNumber;
    let evIdx = 0;
    for (const evId of evidenceIdSet as Set<string>) {
      const existing = mappingById.get(evId);
      const key = existing && Number.isFinite(Number(existing.act_number))
        ? Number(existing.act_number) * 100 + Number(existing.scene_number || 0)
        : null;
      if (existing && key !== null && key < dtKey) continue; // already planted strictly before the DT scene
      const target = derivePreTestSceneTarget("mid", evIdx++, discriminatingAct, discriminatingSceneNumber);
      const targetKey = target.act_number * 100 + target.scene_number;
      if (targetKey >= dtKey) {
        // Pathological DT scene at Act1/Scene1: nothing can be planted before it. Log, don't emit an
        // equal-key entry (that would keep failing findUnplantedDiscriminatingClues).
        updates.push(`${evId} (DT-evidence completeness) SKIPPED — DT scene at Act ${discriminatingAct} Scene ${discriminatingSceneNumber} leaves no pre-test slot`);
        continue;
      }
      mappingById.set(evId, {
        ...(existing ?? { clue_id: evId }),
        clue_id: evId,
        act_number: target.act_number,
        scene_number: target.scene_number,
        delivery_method: String(existing?.delivery_method ?? "").trim() || "Direct observation",
      });
      updates.push(`${evId} (DT-evidence completeness) -> Act ${target.act_number}, Scene ${target.scene_number}`);
    }
  }

  if (updates.length === 0) return [];

  proseRequirements.clue_to_scene_mapping = Array.from(mappingById.values()).sort(
    (left, right) =>
      Number(left?.act_number ?? 99) - Number(right?.act_number ?? 99)
      || Number(left?.scene_number ?? 99) - Number(right?.scene_number ?? 99)
      || String(left?.clue_id ?? "").localeCompare(String(right?.clue_id ?? "")),
  );

  return updates;
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
  shouldEscalateStructuralCmlRevision,
  createFairPlayRetryBudgetTracker,
  deriveBlindReaderRequiredCluePhrases,
  deriveRequiredCluePhrases,
  deriveEffectiveCastNamesForStructuralRevision,
  ensureCriticalFairPlayBackstopClues,
  ensureParityBridgeClue,
  synchronizeClueTraceabilityFromCurrentClues,
};

// ============================================================================
// runAgent6
// ============================================================================

export async function runAgent6(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();

  // A_53 P11 (genre-structure-cml-string-vs-object): normalise ctx.cml to a parsed object ONCE here so
  // every downstream `(cml as any)?.CASE ?? cml` accessor sees a real object. If a raw string ever
  // reaches audit time, that accessor returns the string and the case-block reads vacuously "pass".
  // ctx.cml is typed CaseData and in practice always arrives as a serialisable object from Agent 4;
  // this only repairs the defensive edge where a JSON string slipped in (repair-not-abort: on a
  // non-JSON/unparseable string we leave it untouched and warn rather than throw).
  if (typeof (ctx.cml as unknown) === "string") {
    const raw = ctx.cml as unknown as string;
    try {
      ctx.cml = JSON.parse(raw) as CaseData;
    } catch {
      ctx.warnings.push(
        "Agent 6: ctx.cml arrived as a non-JSON string and could not be normalised to an object; downstream case-block accessors may be unreliable.",
      );
    }
  }

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

  /**
   * Drop the cleared warnings IN PLACE. The array identity is load-bearing.
   *
   * FOUND 2026-08-04 by the first live geometry run. This was
   * `ctx.warnings = ctx.warnings.filter(...)`, and `filter` returns a NEW array — so the first call
   * (which is unconditional, at the end of every Agent 6) silently **replaced** `ctx.warnings` and
   * broke its aliasing with the orchestrator's `warnings`. Two consequences, both invisible:
   *
   *   1. Every warning pushed to `ctx.warnings` AFTER Agent 6 went into an orphaned array that
   *      nothing reads. That is Agent 7, Agent 7.5 and **all 108 push sites in Agent 9** — regen
   *      unresolved notes, release-gate reasons, the geometry acceptance violations. The live run
   *      logged "Release gate warning: scene-grounding coverage below target" to the console and
   *      recorded it nowhere. Every archived report shows the same: zero `[Agent 9]` warnings, ever.
   *      `mystery-orchestrator.ts` asserts the opposite in a comment — "Everything Agent 9 pushes to
   *      ctx.warnings aliases this array, so this captures the whole run" — which is exactly the
   *      forensic-blindness class A_64 §2 F5 exists to prevent, sitting inside the fix for it.
   *   2. The clearing never took effect either. The report reads the orchestrator's array, which
   *      still held every "transient" line this was written to remove.
   *
   * Mutating in place fixes both at once, and is the only form that can: the alias survives, and the
   * removal lands where the report will actually see it.
   */
  const clearWarningsFromSet = (toClear: Set<string>): void => {
    if (!Array.isArray(ctx.warnings) || ctx.warnings.length === 0) return;
    if (toClear.size === 0) return;
    const kept = ctx.warnings.filter((warning) => !toClear.has(String(warning).trim()));
    if (kept.length === ctx.warnings.length) return;
    ctx.warnings.length = 0;
    for (const warning of kept) ctx.warnings.push(warning);
  };

  const fairPlayConfig = getGenerationParams().agent6_fairplay.params;
  const MAX_FAIR_PLAY_RETRY_COST = fairPlayConfig.retries.max_retry_cost_usd;
  const retryBudget = createFairPlayRetryBudgetTracker(MAX_FAIR_PLAY_RETRY_COST);

  // A_53 P3 (cost double-count): every `result.cost` is the CUMULATIVE byAgent run-total, so
  // accumulating it (`+=`) or feeding it straight to `retryBudget.consume` double-counts — the
  // inflated value trips the $0.15 retry budget early and manufactures a spurious abort. Charge the
  // budget the true PER-CALL delta instead: the first observation of each cost source establishes the
  // baseline (spend already incurred before this remediation loop → 0 delta); only later increments
  // count. agentCosts are written as the cumulative total (overwrite, not +=) per the byAgent semantics.
  const lastCumulativeCost: Record<string, number> = {};
  const seenCostBaseline = new Set<string>();
  const perCallCostDelta = (costKey: string, cumulativeCost: number): number => {
    const c = Number.isFinite(cumulativeCost) ? cumulativeCost : 0;
    if (!seenCostBaseline.has(costKey)) {
      seenCostBaseline.add(costKey);
      lastCumulativeCost[costKey] = c;
      return 0;
    }
    const delta = Math.max(0, c - (lastCumulativeCost[costKey] ?? 0));
    lastCumulativeCost[costKey] = c;
    return delta;
  };
  const minBlindConfidence = normalizeConfidence(
    (fairPlayConfig.blind_reader as any)?.pass_criteria?.min_confidence ?? "likely",
  );
  const maxBlindRemediationCycles = retriesEnabled ? Math.max(
    0,
    Number((fairPlayConfig.blind_reader as any)?.pass_criteria?.max_remediation_cycles ?? 1),
  ) : 0;
  const maxFairPlayAttempts = retriesEnabled ? fairPlayConfig.retries.max_fair_play_attempts : 1;
  const maxTargetedRegenAttempts = retriesEnabled ? fairPlayConfig.retries.max_total_attempts_with_targeted_regen : 1;
  if (!retriesEnabled) {
    emitAgent6Warning("Agent 6: deterministic remediation mode active (pre-Agent9 retries disabled by default)", "transient-diagnostic");
  }
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
  let agent6RetryInvoked = false;
  let firstFairPlayStatus: FairPlayAuditResult["overallStatus"] | null = null;
  let agent6FailureClass = "none";
  ctx.agent6FirstPassPassed = false;
  ctx.agent6RetryInvoked = false;
  ctx.agent6FailureClass = "none";

  const auditCurrentFairPlay = async (structuralAuditResult?: StructuralAuditResult): Promise<FairPlayAuditResult> => {
    if (ctx.cml && ctx.clues) {
      synchronizeClueTraceabilityFromCurrentClues(ctx.cml, ctx.clues);
    }
    return auditFairPlay(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      structuralAuditResult,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
  };

  // ── Phase 2: pre-LLM deterministic fixes + structural audit ─────────────────
  // Run backstops BEFORE the LLM call so the LLM audits the already-patched state.
  // The LLM is then responsible only for narrative quality, not structural verification.
  let preAuditStructuralResult: StructuralAuditResult | undefined;

  if (ctx.cml && ctx.clues) {
    // Step A: parity bridge (already present, moved here explicitly)
    const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
    if (parityBridgeId) {
      emitAgent6Warning(
        `Agent 6 deterministic parity bridge: injected essential clue ${parityBridgeId} to expose discriminating-test mechanism before the test scene.`,
        "transient-diagnostic",
      );
    }

    // Step B: backstop clues (moved from post-fail block to pre-LLM)
    const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
    for (const repair of backstopRepairs) {
      emitAgent6Warning(
        `Agent 6 pre-LLM backstop: ${repair}`,
        "transient-diagnostic",
      );
    }
    if (backstopRepairs.length > 0) {
      // Re-run parity bridge after backstop injection
      const secondBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
      if (secondBridgeId) {
        emitAgent6Warning(
          `Agent 6 deterministic parity bridge (post-backstop): injected ${secondBridgeId}.`,
          "transient-diagnostic",
        );
      }
    }

    // Step C: deterministic structural audit — result injected into every LLM call
    preAuditStructuralResult = runDeterministicStructuralAudit(ctx.cml, ctx.clues);
    if (preAuditStructuralResult.passed) {
      emitAgent6Warning(
        `Agent 6 structural pre-audit: PASS — all ${preAuditStructuralResult.stepsCovered.length} inference step(s) covered, ` +
        `${preAuditStructuralResult.evidenceCluesPresent.length} evidence clue(s) verified in early|mid. ` +
        `LLM will assess narrative quality only.`,
        "transient-diagnostic",
      );
    } else {
      const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
      emitAgent6Warning(
        `Agent 6 structural pre-audit: GAPS REMAIN after backstop fixes: ${gapSummary}`,
        "persistent-risk",
      );
    }
  }

  while (fairPlayAttempt < maxFairPlayAttempts) {
    fairPlayAttempt++;
    fairPlayAudit = await auditCurrentFairPlay(preAuditStructuralResult);
    if (firstFairPlayStatus === null) {
      firstFairPlayStatus = fairPlayAudit.overallStatus;
    }
    fairPlayAuditCostDuringLoop = fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — track latest, don't sum

    if (fairPlayAttempt > 1) {
      retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", fairPlayAudit.cost),`fair-play re-audit attempt ${fairPlayAttempt}`);
    }

    if (fairPlayAudit.overallStatus === "pass") break;

    if (fairPlayAttempt < maxFairPlayAttempts) {
      agent6RetryInvoked = true;
      emitAgent6Warning(
        `Agent 6: Fair play audit ${fairPlayAudit.overallStatus}; regenerating clues to address feedback (attempt ${
          fairPlayAttempt + 1
        } of ${maxFairPlayAttempts})`,
        "transient-progress",
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback...", 60);
      const retryCluesStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(fairPlayAudit, ctx.cml, ctx.clues),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      applyAgent5ContractsToRegeneratedClues(ctx, "fair-play retry");
      retryBudget.consume(perCallCostDelta("Agent5-Clues", ctx.clues.cost),`fair-play clue regeneration attempt ${fairPlayAttempt + 1}`);

      ctx.agentCosts["agent5_clues"] =
        ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
    }
  }

  if (!fairPlayAudit) throw new Error("Fair play audit failed to produce a report");

  ctx.agentCosts["agent6_fairplay"] =
    fairPlayAuditCostDuringLoop; // A_53 P3: final cumulative byAgent total — overwrite, not +=
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

  // A_53 P9 (blind-reader-single-sample-gates, low-cost interpretation): the blind-reader gate is
  // advisory by default (Phase 2). Do NOT add extra LLM samples by default — the cheap single-sample
  // deterministic path is preferred. Majority-of-k (resolves the "one stochastic sample flips the
  // verdict" defect) is an explicit, default-OFF opt-in: AGENT6_BLIND_READER_MAJORITY_K=<k>=k≥2 runs
  // k samples for the PRIMARY gate read and returns the representative sample matching the majority
  // pass/fail verdict, so the downstream advisory logic is unchanged. Unset/≤1 ⇒ exactly one call
  // (byte-identical legacy behaviour). Only the primary gate read is sampled; remediation/rescue
  // re-checks stay single-sample so the opt-in never multiplies cost across the whole loop.
  const blindReaderSamplePasses = (sample: BlindReaderResult): boolean => {
    const gotItRight =
      sample.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
      actualCulpritName.toLowerCase().includes(sample.suspectedCulprit.toLowerCase());
    return (
      gotItRight &&
      (CONFIDENCE_RANK[normalizeConfidence(sample.confidenceLevel)] ?? -1) >=
        (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely)
    );
  };
  const parsedMajorityK = Math.trunc(Number(process.env.AGENT6_BLIND_READER_MAJORITY_K ?? ""));
  const blindMajorityK = Number.isFinite(parsedMajorityK) && parsedMajorityK >= 2 ? parsedMajorityK : 1;
  const runPrimaryBlindRead = async (): Promise<BlindReaderResult> => {
    const first = await blindReaderSimulation(
      ctx.client, ctx.clues!, falseAssumptionStatement, castNamesForBlind,
      { runId: ctx.runId, projectId: ctx.projectId || "" }
    );
    if (blindMajorityK <= 1) return first;
    const samples = [first];
    for (let s = 1; s < blindMajorityK; s += 1) {
      samples.push(
        await blindReaderSimulation(
          ctx.client, ctx.clues!, falseAssumptionStatement, castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "" }
        ),
      );
    }
    const passCount = samples.filter(blindReaderSamplePasses).length;
    const majorityPass = passCount * 2 > samples.length;
    // Return a representative sample whose own pass/fail equals the majority verdict so the inline
    // gate (recomputed below) yields the majority outcome; fall back to the last sample if none match.
    const representative = samples.find((sample) => blindReaderSamplePasses(sample) === majorityPass)
      ?? samples[samples.length - 1];
    ctx.warnings.push(
      `Blind reader majority-of-${blindMajorityK}: ${passCount}/${samples.length} samples passed ` +
      `(verdict ${majorityPass ? "PASS" : "FAIL"}).`,
    );
    return representative;
  };

  if (castNamesForBlind.length > 0 && falseAssumptionStatement && actualCulpritName) {
    ctx.reportProgress("fairplay", "Running blind reader simulation...", 73);

    const blindResult = await runPrimaryBlindRead();

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
        agent6RetryInvoked = true;
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
          ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - blindRetryStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "blind-reader remediation");
        retryBudget.consume(perCallCostDelta("Agent5-Clues", ctx.clues.cost),`blind-reader clue remediation cycle ${cycle}`);

        const blindReAuditStart = Date.now();
        fairPlayAudit = await auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - blindReAuditStart);
        retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", fairPlayAudit.cost),`blind-reader fair-play re-audit cycle ${cycle}`);
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();

        latestBlind = await blindReaderSimulation(
          ctx.client,
          ctx.clues as any,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "" }
        );
        ctx.agentCosts["agent6_blind_reader"] =
          latestBlind.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;
        retryBudget.consume(perCallCostDelta("Agent6-BlindReader", latestBlind.cost),`blind-reader simulation cycle ${cycle}`);

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

      if (!latestReaderPass && maxBlindRemediationCycles === 0) {
        agent6RetryInvoked = true;
        ctx.warnings.push(
          "Agent 6 blind-reader deterministic rescue: retries disabled; applying deterministic clue-contract hardening before final blind-reader check.",
        );

        applyAgent5ContractsToRegeneratedClues(ctx, "blind-reader deterministic rescue");

        latestBlind = await blindReaderSimulation(
          ctx.client,
          ctx.clues as any,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "" }
        );
        ctx.agentCosts["agent6_blind_reader"] =
          latestBlind.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;

        const latestGotItRight =
          latestBlind.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
          actualCulpritName.toLowerCase().includes(latestBlind.suspectedCulprit.toLowerCase());
        latestReaderPass =
          latestGotItRight &&
          (CONFIDENCE_RANK[normalizeConfidence(latestBlind.confidenceLevel)] ?? -1) >=
            (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely);

        if (latestReaderPass) {
          ctx.reportProgress("fairplay", "Blind reader simulation: PASS after deterministic rescue", 74);
        }
      }

      if (!latestReaderPass) {
        // A_53 P2 (repair-not-abort): a single stochastic blind-reader sample (temp 0.2) is not a
        // deterministic verdict — a fair mystery that reads "uncertain" once must not abort ~30 agents
        // of work. Default to a non-fatal advisory; only the default-false AGENT6_BLIND_READER_BLOCKING
        // opt-in makes it a hard gate (majority-of-k / proveSolvability is the P9 follow-up).
        const blindReaderBlocking = ["1", "true", "on", "enabled"].includes(
          (process.env.AGENT6_BLIND_READER_BLOCKING ?? "").trim().toLowerCase(),
        );
        const blindReaderMessage =
          `Agent 6 blind-reader gate: simulated suspect "${latestBlind.suspectedCulprit}" ` +
          `(confidence ${latestBlind.confidenceLevel}) does not meet configured pass criteria ` +
          `(culprit=${actualCulpritName}, minConfidence=${minBlindConfidence}).`;
        if (blindReaderBlocking) {
          throw new Error(blindReaderMessage);
        }
        ctx.warnings.push(
          `${blindReaderMessage} [non-fatal — single-sample advisory; set AGENT6_BLIND_READER_BLOCKING to enforce]`,
        );
      }
    }
  }

  // ── WP6B + WP8: CML Retry on Structural Failure ───────────────────────────
  // Phase 2: escalation is now driven by the deterministic structural audit result.
  // When preAuditStructuralResult.passed = true, all structural gaps were closed before
  // the LLM call — no CML revision is needed regardless of what the LLM returned.
  // When preAuditStructuralResult has gaps (or is unavailable), fall back to LLM-signal logic.
  const hasRealStructuralGaps = preAuditStructuralResult
    ? !preAuditStructuralResult.passed
    : (fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure);

  if (hasRealStructuralGaps) {
    if (!preAuditStructuralResult?.passed && preAuditStructuralResult) {
      // Structural gaps confirmed deterministically — log them
      const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
      emitAgent6Warning(
        `Fair-play: structural gaps confirmed by deterministic audit: ${gapSummary}`,
        "transient-diagnostic",
      );
    } else if (fairPlayAudit!.overallStatus !== "fail") {
      // LLM passed but we still have structural gaps from pre-audit — this path should be rare
      emitAgent6Warning(
        "Fair-play: LLM narrative audit passed but deterministic structural gaps remain — escalating CML revision",
        "persistent-risk",
      );
    }

    if (ctx.cml && ctx.clues) {
      const coverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
      ctx.coverageResult = coverageSnapshot.coverageResult;
      ctx.allCoverageIssues = coverageSnapshot.allCoverageIssues;
    }
    const failureClass = classifyFairPlayFailure(ctx.coverageResult!, fairPlayAudit, ctx.cml!);
    agent6FailureClass = failureClass;
    const shouldEscalateCmlRevision = shouldEscalateStructuralCmlRevision({
      failureClass,
      fairPlayAudit,
      structuralAuditResult: preAuditStructuralResult,
    });

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
      retriesEnabled &&
      canRunStructuralCmlRevision &&
      shouldEscalateCmlRevision &&
      retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST
    ) {
      const hardLogicDevices = ctx.hardLogicDevices ?? { devices: [] };
      agent6RetryInvoked = true;

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
            "(4) required_evidence listing 2-4 specific facts where every item names at least one concrete anchor (person, object, location, time phrase, trace, document, or access record), " +
            "(5) no abstract placeholders like 'timeline discrepancy', 'suspicious behavior', 'an inconsistency', or 'detective intuition' without concrete nouns from the case data, " +
            "(6) each correction must quote or paraphrase at least one required_evidence item and state why it eliminates or narrows a named suspect." +
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

      // A_53 P11 (genre-structure-cml-string-vs-object): ctx.cml is normalised to an object at agent
      // entry, so the prior string/object dual-handling is gone — serialise the object directly.
      const cmlYaml = JSON.stringify(ctx.cml, null, 2);
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
      retryBudget.consume(perCallCostDelta("Agent4-Revision", revisedResult.cost),"structural CML revision");

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
            const provisionalAudit = await auditCurrentFairPlay(preAuditStructuralResult);
            ctx.agentCosts["agent6_fairplay"] =
              provisionalAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
            ctx.agentDurations["agent6_fairplay"] =
              (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - feedbackAuditStart);
            retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", provisionalAudit.cost),"post-CML-revision feedback re-audit");
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
          fairPlayFeedback: buildFairPlayFeedbackPayload(revisionFeedbackAudit, ctx.cml, ctx.clues),
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] =
          ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - reCluesStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "post-cml-revision");
        retryBudget.consume(perCallCostDelta("Agent5-Clues", ctx.clues.cost),"post-CML-revision clue regeneration");

        // Re-run backstops + structural audit on the revised CML + fresh clues
        if (ctx.cml && ctx.clues) {
          const postRevisionBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
          if (postRevisionBridgeId) {
            emitAgent6Warning(`Agent 6 post-revision parity bridge: injected ${postRevisionBridgeId}.`, "transient-diagnostic");
          }
          ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
          preAuditStructuralResult = runDeterministicStructuralAudit(ctx.cml, ctx.clues);
          if (preAuditStructuralResult.passed) {
            emitAgent6Warning(
              "Agent 6 post-revision structural audit: PASS — LLM will assess narrative quality only.",
              "transient-diagnostic",
            );
          } else {
            const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
            emitAgent6Warning(
              `Agent 6 post-revision structural audit: gaps remain: ${gapSummary}`,
              "persistent-risk",
            );
          }
        }

        const reAuditStart = Date.now();
        fairPlayAudit = await auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - reAuditStart);
        retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", fairPlayAudit.cost),"post-CML-revision fair-play re-audit");
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();
      }
    } else if (
      retriesEnabled &&
      failureClass === "clue_only" &&
      retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST &&
      maxTargetedRegenAttempts >= 3
    ) {
      agent6RetryInvoked = true;
      emitAgent6Warning(
        "Fair play failure classified as \"clue_only\" — CML structure is sound; " +
        `regenerating clues with targeted per-violation feedback (attempt 3 of ${maxTargetedRegenAttempts})`,
        "transient-progress",
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback (final attempt)...", 63);
      const finalClueRetryStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(fairPlayAudit!, ctx.cml, ctx.clues),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] =
        ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - finalClueRetryStart);
      applyAgent5ContractsToRegeneratedClues(ctx, "final-targeted-regen");
      retryBudget.consume(perCallCostDelta("Agent5-Clues", ctx.clues.cost),"final targeted clue regeneration");

      const finalAuditStart = Date.now();
      fairPlayAudit = await auditCurrentFairPlay(preAuditStructuralResult);
      ctx.agentCosts["agent6_fairplay"] =
        fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent6_fairplay"] =
        (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - finalAuditStart);
      retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", fairPlayAudit.cost),"final targeted fair-play re-audit");
      hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(fairPlayAudit, criticalFairPlayRules);
      await recordFairPlayScore();
    }

    // WP8A-Deterministic Backstop: when structural gaps still remain after CML revision,
    // inject additional case-grounded clues and re-audit once.
    // Note: for clean CMLs (preAuditStructuralResult.passed), backstops already ran pre-LLM.
    if (
      retriesEnabled &&
      !preAuditStructuralResult?.passed
      && fairPlayAudit!.overallStatus === "fail"
      && hasCriticalFairPlayFailure
      && ctx.cml
      && ctx.clues
      && retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST
    ) {
      const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
      const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
      if (parityBridgeId) {
        backstopRepairs.push(`added ${parityBridgeId} as early essential parity bridge clue`);
      }

      if (backstopRepairs.length > 0) {
        agent6RetryInvoked = true;
        backstopRepairs.forEach((repair) =>
          emitAgent6Warning(`Agent 6 deterministic fair-play backstop: ${repair}`, "persistent-risk"),
        );

        applyAgent5ContractsToRegeneratedClues(ctx, "critical-fairplay-backstop");

        const backstopAuditStart = Date.now();
        fairPlayAudit = await auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - backstopAuditStart);
        retryBudget.consume(perCallCostDelta("Agent6-FairPlayAuditor", fairPlayAudit.cost),"deterministic fair-play backstop re-audit");
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

  ctx.agent6FirstPassPassed = firstFairPlayStatus === "pass";
  ctx.agent6RetryInvoked = agent6RetryInvoked;
  ctx.agent6FailureClass = fairPlayAudit!.overallStatus === "pass"
    ? "none"
    : agent6FailureClass === "none"
      ? "unclassified"
      : agent6FailureClass;

  // SWEEP A: Golden Age genre-structure check (false solution, ≥2 resolved red herrings,
  // closed circle contains the culprit). Emitted as warnings so it surfaces in the report
  // without hard-aborting legacy runs; promote to a binding gate once generations reliably
  // populate these fields on the premium model tier.
  if (ctx.cml) {
    const genre = validateGenreStructure(ctx.cml);
    genre.errors.forEach((e) => emitAgent6Warning(`Genre structure: ${e}`, "persistent-risk"));
    genre.warnings.forEach((w) => emitAgent6Warning(`Genre structure: ${w}`, "transient-diagnostic"));
  }

  ctx.fairPlayAudit = fairPlayAudit!;
  ctx.hasCriticalFairPlayFailure = hasCriticalFairPlayFailure;

  // ── P2.1: Reveal gate (T2.1 fooled-then-convinced, T2.2 herring→culprit, T2.3 death-method) ──
  // Default OFF (AGENT6_REVEAL_GATE unset) ⇒ this block is skipped entirely and behaviour is
  // byte-identical. shadow ⇒ surface findings as warnings only; enforce ⇒ also mark the audit
  // blocking (routed through the existing binding gate, which respects forceWarnings) — it NEVER
  // throws on its own (see MEMORY: no-backstop gates kill runs).
  const revealGateMode = parseRevealGateMode(process.env.AGENT6_REVEAL_GATE);
  if (revealGateMode !== "off") {
    const revealIssues: string[] = [];

    // T2.2 — a red herring must never point at the real culprit.
    const herringAudit = auditRedHerringTargets(ctx.cml);
    if (!herringAudit.ok) {
      revealIssues.push(
        `red herring(s) point at the real culprit: ` +
          herringAudit.offenders.map((o) => `${o.id}→"${o.pointsAtSuspect}"`).join(", "),
      );
    }

    // T2.3 — the manner of death must be deducible from an essential early|mid clue.
    const deathAudit = auditDeathMethodDeducibility(ctx.cml, ctx.clues ?? { clues: [] });
    if (!deathAudit.ok) revealIssues.push(deathAudit.reason);

    // T2.1 — an early+mid-only reader who already names the culprit means the reveal is too obvious.
    if (castNamesForBlind.length > 0 && actualCulpritName) {
      try {
        const earlyMidReader = await blindReaderSimulation(
          ctx.client,
          ctx.clues!,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "", placementFilter: ["early", "mid"] },
        );
        // cost from byAgent is cumulative across the run → overwrite; durationMs is per-call → add.
        ctx.agentCosts["agent6_blind_reader"] = earlyMidReader.cost;
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + earlyMidReader.durationMs;
        const verdict = evaluateRevealVerdict({
          earlyMidGuess: earlyMidReader.suspectedCulprit,
          culprit: actualCulpritName,
          falseSolutionSuspect: caseBlockForBlind?.false_solution?.accused_suspect,
        });
        if (verdict.verdict === "too_obvious") revealIssues.push(...verdict.reasons);
        else verdict.reasons.forEach((r) => emitAgent6Warning(`[agent6-reveal-gate][${revealGateMode}] ${r}`, "transient-diagnostic"));
      } catch (err) {
        emitAgent6Warning(
          `[agent6-reveal-gate][${revealGateMode}] early+mid blind reader error: ${(err as Error).message}`,
          "transient-diagnostic",
        );
      }
    }

    for (const issue of revealIssues) {
      emitAgent6Warning(`[agent6-reveal-gate][${revealGateMode}] ${issue}`, "persistent-risk");
    }
    if (revealGateMode === "enforce" && revealIssues.length > 0) {
      // A_53 P5 (reveal-gate-enforce-only-downgrades-pass-not-fail): in ENFORCE mode a real reveal
      // break must block regardless of prior status OR enableBindingGates — otherwise "enforce" was
      // only a warning whenever binding gates were off. Flip pass→needs-revision AND set a dedicated
      // blocking flag (enforce is an explicit opt-in; default-off/shadow stay advisory; still no throw).
      if (fairPlayAudit!.overallStatus === "pass") fairPlayAudit!.overallStatus = "needs-revision";
      ctx.fairPlayAudit = { ...fairPlayAudit!, blocking: true };
    }
  }

  // Pillar 3 (Unit 3.3): flag blocking when gate is active and fair-play did not pass.
  // Covers both "fail" and "needs-revision" — earlyStructuralAbort follows and may also throw.
  if (ctx.inputs.enableBindingGates && ctx.fairPlayAudit.overallStatus !== "pass") {
    ctx.fairPlayAudit = { ...ctx.fairPlayAudit, blocking: true };
  }
}
