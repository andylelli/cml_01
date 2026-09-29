/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */

import { isChronologyEnabled as isA90ChronologyEnabled, deriveCaseChronology, findUnanchoredClockValues, summariseChronology } from "@cml/cml";
import { extractClues } from "@cml/prompts-llm";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
// ONE clock parser. This file used to keep a private third copy; see parseFactClockMinutes.
import type { PhaseScore } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
  applyClueGuardrails,
} from "./shared.js";
import {
  CANONICAL_CLUE_ID_RE,
  RedHerringOverlapDetail,
  analyzeSuspectCoverage,
  buildStrictPromptFeedback,
  buildStrictSourcePathWhitelist,
  checkCastNamePathConsistency,
  checkContradictionPairs,
  checkDiscriminatingTestReachability,
  checkEraTimeStyleInClues,
  checkFalseAssumptionContradiction,
  checkInferencePathCoverage,
  checkInferenceStepBounds,
  checkMechanismVisibility,
  checkModelAuditConsistency,
  checkSourcePathValidity,
  checkSuspectElimination,
  enforceAgent5DeterministicContracts,
  findCulpritDiscriminatingGaps,
  findLockedFactClueTimeConflicts,
  findRedHerringOverlapDetails,
  findRedHerringTrueSolutionOverlap,
  getCanonicalEvidenceClueIds,
  getCaseBlock,
  getMissingDiscriminatingEvidenceIds,
  isOverlapCandidateToken,
  normalizeTokens,
  reconcileModelAudit,
  repairCastNamePathConsistency,
  repairInvalidSourcePaths,
  repairLockedFactClueTimeTranspositions,
  replaceDigitTimesWithEraWords,
  sanitizeEraTimeStyleInClues,
  strictPromptFeedbackCache,
  strictSourcePathWhitelistCache,
  synthesizeMissingCulpritDiscriminatingClues,
  synthesizeMissingDiscriminatingEvidenceClues,
  toClueIdSlug,
  validateSourcePath,
} from "./agent5-contracts.js";
// Re-exported so existing importers of this module keep their path.
export {
  buildStrictPromptFeedback,
  enforceAgent5DeterministicContracts,
  findLockedFactClueTimeConflicts,
  recomputeCoverageSnapshotForAgent6,
  repairLockedFactClueTimeTranspositions,
} from "./agent5-contracts.js";

type TemporalLexicalCollisionResult = {
  detected: boolean;
  forbiddenTerms: string[];
  allowedTerms: string[];
  explanation: string;
};

/**
 * A_71 (A_70 §6) — the misdirection budget, named once.
 *
 * `2` was hard-coded at four separate `extractWithAttempt` call sites, which is how the value could
 * be honoured as a ceiling everywhere and as a floor nowhere. `RED_HERRING_FLOOR` is the point below
 * which the mystery has no misdirection at all and a bounded regeneration is worth a call; a
 * shortfall of 1-against-2 is logged, not retried.
 */
const RED_HERRING_BUDGET = 2;
const RED_HERRING_FLOOR = 1;

/**
 * The floor decision, extracted so the branch is testable without an LLM.
 *
 * `redHerrings` is whatever came back from the model — the array may be absent, null, or a
 * non-array on a malformed response, and every one of those is "no misdirection", not "skip the
 * check". Reads the flag at call time, never at module load
 * (`module-const-flags-frozen-before-dotenv`).
 */
export function assessRedHerringFloor(
  redHerrings: unknown,
  env: NodeJS.ProcessEnv = process.env,
): { enabled: boolean; count: number; needsRepair: boolean; shortOfBudget: boolean } {
  const enabled = !/^(0|off|false|no)$/i.test(env.AGENT5_RED_HERRING_FLOOR ?? "");
  const count = Array.isArray(redHerrings) ? redHerrings.length : 0;
  return {
    enabled,
    count,
    needsRepair: enabled && count < RED_HERRING_FLOOR,
    shortOfBudget: count < RED_HERRING_BUDGET,
  };
}

const classifyAgent5FailureClass = (message: string): string => {
  const normalized = String(message ?? "").toLowerCase();
  if (/red-?herring\s+overlap/.test(normalized)) return "agent5.red_herring_overlap";
  if (/source-?path|source path/.test(normalized)) return "agent5.invalid_source_path";
  if (/discriminating.*(id|evidence clue)|evidence id/.test(normalized)) return "agent5.discriminating_id_coverage";
  if (/weak elimination|suspect-coverage/.test(normalized)) return "agent5.weak_elimination_evidence";
  if (/time-style|digit-based time/.test(normalized)) return "agent5.time_style_violation";
  return "agent5.unknown_failure";
};

const strictPromptContractsEnabled = (): boolean => {
  // Strict prompt-contract feedback is active by default for all core reliability paths.
  // Set AGENT5_STRICT_PROMPT_CONTRACTS=off to disable (diagnostic/testing only).
  const value = String(process.env.AGENT5_STRICT_PROMPT_CONTRACTS ?? "").trim().toLowerCase();
  if (value === "0" || value === "false" || value === "no" || value === "off") return false;
  return true;
};

const agent5LlmRetriesEnabled = (): boolean => {
  // Prevention-first default: keep Agent5 on a deterministic remediation path.
  // Enable legacy LLM retry loops only when explicitly opted in.
  const value = String(process.env.AGENT5_ENABLE_LLM_RETRIES ?? "").trim().toLowerCase();
  if (value === "1" || value === "true" || value === "yes" || value === "on") return true;
  return false;
};

const sanitizeDiscriminatingEvidenceClueIds = (cml: CaseData): { removed: string[]; kept: string[] } => {
  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { removed: [], kept: [] };
  }

  const rawEvidence = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter(Boolean);
  const kept = rawEvidence.filter((id: string) => CANONICAL_CLUE_ID_RE.test(id));
  const removed = rawEvidence.filter((id: string) => !CANONICAL_CLUE_ID_RE.test(id));

  if (removed.length > 0) {
    discrimTest.evidence_clues = kept;
  }

  return { removed, kept };
};

const getCanonicalMappingClueIds = (cml: CaseData): string[] => {
  const caseBlock = getCaseBlock(cml);
  const mappingIds: string[] = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
        .map((entry: any) => String(entry?.clue_id ?? "").trim())
        .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id))
    : [];
  return [...new Set<string>(mappingIds)];
};

const alignDiscriminatingEvidenceIdsWithSceneMapping = (
  cml: CaseData,
): { replaced: Array<{ from: string; to: string }>; finalIds: string[] } => {
  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { replaced: [], finalIds: [] };
  }

  const mappingIds = getCanonicalMappingClueIds(cml);
  if (mappingIds.length === 0) {
    return { replaced: [], finalIds: getCanonicalEvidenceClueIds(cml) };
  }

  const rawEvidence: string[] = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id));
  if (rawEvidence.length === 0) {
    return { replaced: [], finalIds: [] };
  }

  const replaced: Array<{ from: string; to: string }> = [];
  const mappingSet = new Set<string>(mappingIds);
  const usedIds = new Set<string>(rawEvidence.filter((id: string) => mappingSet.has(id)));
  const nextEvidence: string[] = [...rawEvidence];

  for (let idx = 0; idx < nextEvidence.length; idx += 1) {
    const current = nextEvidence[idx];
    if (!current || mappingSet.has(current)) continue;

    const replacement = mappingIds.find((candidateId) => !usedIds.has(candidateId));
    if (!replacement) continue;

    nextEvidence[idx] = replacement;
    usedIds.add(replacement);
    replaced.push({ from: current, to: replacement });
  }

  if (replaced.length > 0) {
    const deduped = [...new Set<string>(nextEvidence)];
    discrimTest.evidence_clues = deduped;
    return { replaced, finalIds: deduped };
  }

  return { replaced, finalIds: rawEvidence };
};

const DISCRIMINATING_ID_TOKEN_STOP_WORDS = new Set([
  "clue",
  "core",
  "chain",
  "step",
  "fp",
  "direct",
  "optional",
  "late",
  "slot",
  "contradiction",
  "evidence",
]);

const tokenizeDiscriminatingId = (value: string): string[] =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !DISCRIMINATING_ID_TOKEN_STOP_WORDS.has(token));

const remapMissingDiscriminatingEvidenceIdsToExistingClues = (
  cml: CaseData,
  clues: ClueDistributionResult,
  missingEvidenceIds: string[],
): { remapped: Array<{ missingId: string; mappedId: string; sourceId: string }>; unresolved: string[] } => {
  if (missingEvidenceIds.length === 0) return { remapped: [], unresolved: [] };

  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { remapped: [], unresolved: [...missingEvidenceIds] };
  }

  const clueList = Array.isArray(clues?.clues) ? clues.clues : [];
  const existingClueIds = new Set<string>(
    clueList
      .map((clue: any) => String(clue?.id ?? "").trim())
      .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id)),
  );
  if (existingClueIds.size === 0) {
    return { remapped: [], unresolved: [...missingEvidenceIds] };
  }

  const canonicalEvidence: string[] = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id));
  const usedIds = new Set<string>(canonicalEvidence.filter((id: string) => existingClueIds.has(id)));

  const remapped: Array<{ missingId: string; mappedId: string; sourceId: string }> = [];
  const unresolved: string[] = [];

  for (const missingId of missingEvidenceIds) {
    if (!missingId || existingClueIds.has(missingId)) continue;
    const missingTokens = tokenizeDiscriminatingId(missingId);

    let best:
      | {
          id: string;
          sourceId: string;
          score: number;
          tokenMatches: number;
          structuralScore: number;
        }
      | undefined;

    for (const clue of clueList as any[]) {
      const candidateId = String(clue?.id ?? "").trim();
      if (!candidateId || !CANONICAL_CLUE_ID_RE.test(candidateId) || usedIds.has(candidateId)) continue;

      const candidateText = [
        String(clue?.id ?? ""),
        String(clue?.description ?? ""),
        String(clue?.pointsTo ?? ""),
        String(clue?.sourceInCML ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      let tokenMatches = 0;
      for (const token of missingTokens) {
        if (candidateText.includes(token)) tokenMatches += 1;
      }

      const structuralScore =
        (String(clue?.criticality ?? "").toLowerCase() === "essential" ? 4 : 0)
        + ((String(clue?.placement ?? "").toLowerCase() === "early" || String(clue?.placement ?? "").toLowerCase() === "mid") ? 3 : 0)
        + ((String(clue?.evidenceType ?? "").toLowerCase() === "observation" || String(clue?.evidenceType ?? "").toLowerCase() === "contradiction") ? 2 : 0)
        + (String(clue?.sourceInCML ?? "").includes("CASE.discriminating_test.evidence_clues") ? 1 : 0);

      const score = structuralScore + (tokenMatches * 3);
      if (!best || score > best.score) {
        best = {
          id: candidateId,
          sourceId: String(clue?.id ?? ""),
          score,
          tokenMatches,
          structuralScore,
        };
      }
    }

    const canAcceptBest =
      Boolean(best)
      && (best!.tokenMatches > 0 || best!.structuralScore >= 8)
      && best!.score >= 7;

    if (!canAcceptBest || !best) {
      unresolved.push(missingId);
      continue;
    }

    let replaced = false;
    for (let i = 0; i < canonicalEvidence.length; i += 1) {
      if (canonicalEvidence[i] !== missingId) continue;
      canonicalEvidence[i] = best.id;
      replaced = true;
      break;
    }

    if (!replaced) {
      unresolved.push(missingId);
      continue;
    }

    usedIds.add(best.id);
    remapped.push({ missingId, mappedId: best.id, sourceId: best.sourceId });
  }

  if (remapped.length > 0) {
    discrimTest.evidence_clues = [...new Set(canonicalEvidence)];
  }

  const remainingMissing = getMissingDiscriminatingEvidenceIds(cml, clues);
  return { remapped, unresolved: remainingMissing.filter((id) => unresolved.includes(id) || missingEvidenceIds.includes(id)) };
};

const buildAgent5ProactiveFirstPassFeedback = (cml: CaseData): any => {
  const caseBlock = getCaseBlock(cml);
  const culpritNames = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((entry: unknown) => String(entry ?? "").trim()).filter(Boolean)
    : [];

  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const eligibleNonCulprits = cast
    .filter((entry: any) => String(entry?.culprit_eligibility ?? "").toLowerCase() === "eligible")
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => Boolean(name) && !culpritNames.includes(name));

  const requiredCluePhrases = eligibleNonCulprits
    .slice(0, 4)
    .map((name: string) => `Eliminates ${name} because`);

  const canonicalEvidenceIds = getCanonicalEvidenceClueIds(cml).slice(0, 8);

  const correctionTerms = Array.isArray(caseBlock?.inference_path?.steps)
    ? [...new Set(
      caseBlock.inference_path.steps
        .flatMap((step: any) => normalizeTokens(String(step?.correction ?? "")))
        .filter(isOverlapCandidateToken),
    )].slice(0, 12)
    : [];

  const falseAssumptionTerms = normalizeTokens(String(caseBlock?.false_assumption?.statement ?? ""))
    .filter((token) => token.length > 4)
    .slice(0, 12);

  return {
    overallStatus: "needs-revision",
    recommendations: [
      "FIRST PASS PRIORITY: satisfy suspect elimination coverage for every eligible non-culprit before optional texture clues.",
      "FIRST PASS PRIORITY: ensure all discriminating evidence IDs are present as exact clue IDs and placed early/mid as essential.",
      "FIRST PASS PRIORITY: avoid correction-language terms in red herring description/misdirection from the start.",
    ],
    targetedClueIds: canonicalEvidenceIds,
    requiredCluePhrases,
    forbiddenTerms: correctionTerms,
    preferredTerms: falseAssumptionTerms,
  };
};


// ============================================================================
// WP4: Inference Path Coverage Helpers (agent-5 only)
// ============================================================================

function detectTemporalLexicalCollision(
  cml: CaseData,
  overlapDetails: RedHerringOverlapDetail[],
): TemporalLexicalCollisionResult {
  const caseBlock = getCaseBlock(cml);
  const falseAssumptionType = String(caseBlock?.false_assumption?.type ?? "").toLowerCase();
  if (falseAssumptionType !== "temporal") {
    return {
      detected: false,
      forbiddenTerms: [],
      allowedTerms: [],
      explanation: "False assumption is not temporal; lexical collision detector not activated.",
    };
  }

  const toTokenSet = (text: string): Set<string> =>
    new Set(
      String(text ?? "")
        .toLowerCase()
        .split(/\s+/)
        .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
        .filter((w: string) => isOverlapCandidateToken(w)),
    );

  const correctionTokenSet = new Set<string>();
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (const step of steps) {
    const tokens = toTokenSet(String(step?.correction ?? ""));
    for (const token of tokens) correctionTokenSet.add(token);
  }

  const assumptionText = `${String(caseBlock?.false_assumption?.statement ?? "")} ${String(caseBlock?.false_assumption?.why_it_seems_reasonable ?? "")}`;
  const assumptionTokenSet = toTokenSet(assumptionText);
  const intersection = Array.from(assumptionTokenSet).filter((t) => correctionTokenSet.has(t));
  const allowed = Array.from(assumptionTokenSet).filter((t) => !correctionTokenSet.has(t));

  const detected = overlapDetails.length > 0 && intersection.length >= 2;
  return {
    detected,
    forbiddenTerms: intersection.slice(0, 12),
    allowedTerms: allowed.slice(0, 12),
    explanation: detected
      ? `Temporal lexical collision detected: ${intersection.length} shared token(s) between false-assumption and correction lexicons.`
      : "No high-risk temporal lexical collision detected.",
  };
}

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function sanitizeRedHerringOverlap(
  cml: CaseData,
  clues: ClueDistributionResult,
  overlapDetails: RedHerringOverlapDetail[],
  preferredTerms: string[] = [],
): string[] {
  const repairs: string[] = [];
  if (!Array.isArray(clues.redHerrings) || overlapDetails.length === 0) return repairs;

  const caseBlock = getCaseBlock(cml);
  const protectedNameTokens = new Set<string>();
  const castEntries = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  castEntries.forEach((entry: any) => {
    normalizeTokens(String(entry?.name ?? ""))
      .filter((token) => token.length > 2)
      .forEach((token) => protectedNameTokens.add(token));
  });
  // Build correction token set so we never introduce a replacement that is itself
  // an inference-correction word (e.g. "witness", "timing" from "witness accounts").
  const correctionTokensForSanitizer = new Set<string>();
  const inferenceStepsForSanitizer = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  for (const step of inferenceStepsForSanitizer) {
    String(step?.correction ?? "")
      .toLowerCase()
      .split(/\s+/)
      .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w: string) => isOverlapCandidateToken(w))
      .forEach((w: string) => correctionTokensForSanitizer.add(w));
  }
  const assumptionTokens = `${String(caseBlock?.false_assumption?.statement ?? "")} ${String(caseBlock?.false_assumption?.why_it_seems_reasonable ?? "")}`
    .toLowerCase()
    .split(/\s+/)
    .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w: string) => isOverlapCandidateToken(w));
  const replacementCandidates = [...new Set([
    ...preferredTerms.map((t) => String(t ?? "").toLowerCase().trim()).filter((t) => isOverlapCandidateToken(t)),
    ...assumptionTokens,
    "timing",
    "witness",
    "reported",
  ])];
  // Exclude any candidate that appears in correction token set — using it as a
  // replacement would simply re-trigger the overlap gate on the next check.
  const filteredReplacements = replacementCandidates.filter((t) => !correctionTokensForSanitizer.has(t));
  // Absolute fallback terms: neutral words very unlikely to appear in mystery inference corrections.
  const replacementPool = filteredReplacements.length > 0
    ? filteredReplacements
    : ["ostensible", "purported", "apparent", "rumoured"];

  let replacementIndex = 0;
  for (const detail of overlapDetails) {
    const target = clues.redHerrings.find((rh: any) => String(rh?.id ?? "").trim() === detail.redHerringId) as any;
    if (!target) continue;

    const originalDescription = String(target.description ?? "");
    const originalMisdirection = String(target.misdirection ?? "");
    let nextDescription = originalDescription;
    let nextMisdirection = originalMisdirection;

    for (const term of detail.matchedCorrectionWords) {
      const safeTerm = String(term ?? "").trim().toLowerCase();
      if (!safeTerm) continue;
      if (protectedNameTokens.has(safeTerm)) continue;
      const replacement = replacementPool[replacementIndex % replacementPool.length] || "timing";
      replacementIndex += 1;
      const re = new RegExp(`\\b${escapeRegex(safeTerm)}\\b`, "gi");
      nextDescription = nextDescription.replace(re, replacement);
      nextMisdirection = nextMisdirection.replace(re, replacement);
    }

    if (nextDescription !== originalDescription || nextMisdirection !== originalMisdirection) {
      target.description = nextDescription;
      target.misdirection = nextMisdirection;
      repairs.push(`${detail.redHerringId}: sanitized overlap terms in description/misdirection`);
    }
  }

  return repairs;
}

function pruneOverlappingRedHerrings(
  clues: ClueDistributionResult,
  redHerringIds: string[],
): string[] {
  if (!Array.isArray(clues.redHerrings) || redHerringIds.length === 0) return [];

  const toDrop = new Set(redHerringIds.map((id) => String(id ?? "").trim()).filter(Boolean));
  if (toDrop.size === 0) return [];

  const removed: string[] = [];
  clues.redHerrings = clues.redHerrings.filter((rh: any) => {
    const id = String(rh?.id ?? "").trim();
    const keep = !toDrop.has(id);
    if (!keep && id) removed.push(id);
    return keep;
  });

  return removed;
}

/**
 * A_61 evidence-mapping FP fix — purge unmappable discriminating-test evidence ids, then reseed.
 *
 * An evidence id that references no real clue after the LLM retries AND the deterministic remap is an
 * UNMAPPABLE placeholder — most often the Agent-3 prompt example ids (clue_1/clue_2/clue_3, which match
 * CANONICAL_CLUE_ID_RE and leaked in as literal case data). The prior backstop CLONED a real clue under
 * the junk name, fabricating and mislabelling evidence. Instead we drop any evidence id absent from the
 * distributed clue set (mirrors mystery-orchestrator's `currentEvidence.filter(id => distributedClueIds
 * .has(id))`) and, if the list empties, re-seed from real canonical clue IDs (mirrors the empty-evidence
 * reseed at the top of the final-remediation block).
 *
 * "Real defect still fails" guarantee: when no plantable evidence exists the reseed returns [] and
 * evidence_clues stays empty, so checkDiscriminatingTestReachability's text-match branch still emits the
 * critical "references no evidence found in the clue set" — the identical gate the genuine zero-evidence
 * case has always hit. The purge only turns a placeholder-id FP into that same well-defined outcome.
 */
function purgeUnmappableDiscriminatingEvidenceIds(
  cml: CaseData,
  clues: ClueDistributionResult,
): { removed: string[]; reseeded: string[] } {
  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { removed: [], reseeded: [] };
  }

  const distributedClueIds = new Set(
    clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean),
  );
  const original = discrimTest.evidence_clues.slice();
  const kept = original.filter((id: unknown) => distributedClueIds.has(String(id ?? "").trim()));
  if (kept.length === original.length) return { removed: [], reseeded: [] };

  const removed = original
    .filter((id: unknown) => !distributedClueIds.has(String(id ?? "").trim()))
    .map((id: unknown) => String(id ?? "").trim())
    .filter(Boolean);

  discrimTest.evidence_clues = kept;
  // Whitelist/feedback memos are keyed by the cml identity and enumerate evidence_clues[i] paths —
  // invalidate them after mutating the array (same rationale as the empty-evidence reseed).
  strictSourcePathWhitelistCache.delete(cml as unknown as object);
  strictPromptFeedbackCache.delete(cml as unknown as object);

  let reseeded: string[] = [];
  if (discrimTest.evidence_clues.length === 0) {
    reseeded = selectDiscriminatingEvidenceCandidateIds(cml, clues, 3);
    if (reseeded.length > 0) {
      discrimTest.evidence_clues = reseeded;
      strictSourcePathWhitelistCache.delete(cml as unknown as object);
      strictPromptFeedbackCache.delete(cml as unknown as object);
    }
  }

  return { removed, reseeded };
}

/**
 * RC3.1 (A_61 Phase 2a) — repair-not-abort for inference steps with NO covering clue.
 *
 * The coverage hard gate otherwise aborts the whole run when an `inference_path` step has no clue
 * covering its observation (run bfmz7izf6 died here). Instead, synthesise a covering clue per uncovered
 * step: `supportsInferenceStep`/`evidenceType:"observation"` mark it as that step's observation evidence
 * (the PRIMARY coverage path — see checkInferencePathCoverage), and the description embeds the step's own
 * observation text so it also satisfies the fuzzy fallback and reads as a real, plantable observation.
 * Mirrors synthesizeMissingDiscriminatingEvidenceClues. A step whose observation is empty cannot be
 * planted and is deliberately left for the hard gate (correct — there is nothing to surface).
 */
function synthesizeInferenceStepCoverageClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  uncoveredStepNums: number[],
): string[] {
  if (!Array.isArray(uncoveredStepNums) || uncoveredStepNums.length === 0) return [];
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  if (steps.length === 0) return [];

  const existingIds = new Set(clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean));
  // Field template: prefer an essential observation clue so required schema fields are preserved.
  const template =
    clues.clues.find((c: any) => c?.criticality === "essential" && ((c as any)?.evidenceType ?? "observation") === "observation") ||
    clues.clues.find((c: any) => c?.criticality === "essential") ||
    clues.clues[0];

  const repairs: string[] = [];
  for (const stepNum of uncoveredStepNums) {
    const step = steps[stepNum - 1];
    const observation = typeof step?.observation === "string" ? step.observation.trim() : "";
    if (!observation) continue; // nothing to plant → leave for the hard gate

    let id = `clue_inference_cover_step_${stepNum}`;
    let suffix = 1;
    while (existingIds.has(id)) id = `clue_inference_cover_step_${stepNum}_${suffix++}`;

    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.filter((e: any) => typeof e === "string" && e.trim()).join("; ")
      : "";
    const description = requiredEvidence ? `${observation} (${requiredEvidence})` : observation;
    const placement = (template as any)?.placement === "late" ? "mid" : ((template as any)?.placement || "mid");

    clues.clues.push({
      ...(template ?? {}),
      id,
      description,
      criticality: "essential",
      evidenceType: "observation",
      supportsInferenceStep: stepNum,
      sourceInCML: `CASE.inference_path.steps[${stepNum - 1}].observation`,
      placement,
    } as any);
    existingIds.add(id);

    const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
    if (placement === "early") timeline.early = [...(timeline.early ?? []), id];
    else if (placement === "late") timeline.late = [...(timeline.late ?? []), id];
    else timeline.mid = [...(timeline.mid ?? []), id];
    (clues as any).clueTimeline = timeline;

    repairs.push(`${id} => covers inference step ${stepNum}`);
  }
  return repairs;
}

function selectDiscriminatingEvidenceCandidateIds(
  cml: CaseData,
  clues: ClueDistributionResult,
  maxIds: number,
): string[] {
  const caseBlock = getCaseBlock(cml);
  const discrimText = `${String(caseBlock?.discriminating_test?.design ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  const discrimTokens = new Set(discrimText.split(/\s+/).filter((t) => t.length >= 5));

  const scored = clues.clues
    .map((c: any) => {
      const text = `${String(c?.description ?? "")} ${String(c?.pointsTo ?? "")}`.toLowerCase();
      let score = 0;
      for (const token of discrimTokens) {
        if (text.includes(token)) score += 1;
      }
      if (c?.criticality === "essential") score += 2;
      if (c?.placement === "early" || c?.placement === "mid") score += 1;
      if (c?.evidenceType === "observation" || c?.evidenceType === "contradiction") score += 1;
      return {
        id: String(c?.id ?? "").trim(),
        score,
        placement: String(c?.placement ?? "").toLowerCase(),
      };
    })
    .filter((entry) => Boolean(entry.id) && CANONICAL_CLUE_ID_RE.test(entry.id));

  const earlyMid = scored
    .filter((entry) => entry.placement === "early" || entry.placement === "mid")
    .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, maxIds))
    .map((entry) => entry.id);

  if (earlyMid.length > 0) {
    return earlyMid;
  }

  return scored
    .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, maxIds))
    .map((entry) => entry.id);
}

function synthesizeSuspectCoverageBackstopClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  suspects: string[],
): string[] {
  const targetSuspects = [...new Set(suspects.map((name) => String(name ?? "").trim()).filter(Boolean))];
  if (targetSuspects.length === 0) return [];

  const caseBlock = getCaseBlock(cml);
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (clueList.length === 0) return [];

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  (clues as any).clueTimeline = timeline;

  const existingIds = new Set(
    clueList
      .map((clue) => String(clue?.id ?? "").trim())
      .filter((id) => id.length > 0),
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

  const template = clueList.find((clue) => String(clue?.criticality ?? "").toLowerCase() === "essential") ?? clueList[0];
  if (!template) return [];

  const repairs: string[] = [];

  for (const suspectName of targetSuspects) {
    const suspectIndex = cast.findIndex((entry: any) => String(entry?.name ?? "").trim() === suspectName);
    const suspect = suspectIndex >= 0 ? cast[suspectIndex] : undefined;

    const sourceCandidates = [
      suspectIndex >= 0 ? `CASE.cast[${suspectIndex}].alibi_window` : "",
      suspectIndex >= 0 ? `CASE.cast[${suspectIndex}].access_plausibility` : "",
      `CASE.constraint_space.access.actors[0]`,
      `CASE.constraint_space.time.anchors[0]`,
    ].filter((entry): entry is string => Boolean(entry));

    const sourceInCML = sourceCandidates.find((path) => validateSourcePath(cml, path))
      || buildStrictSourcePathWhitelist(cml)[0]
      || "CASE.inference_path.steps[0].observation";

    const suspectAlibi = String(suspect?.alibi_window ?? "").trim();
    const fallbackDescription = `A corroborated timeline detail places ${suspectName} away from the decisive mechanism window.`;
    const description = replaceDigitTimesWithEraWords(suspectAlibi || fallbackDescription);
    const pointsTo = `Eliminates ${suspectName} because independent corroboration places ${suspectName} away from the decisive mechanism window.`;

    const clueId = nextId(`clue_fp_elimination_${toClueIdSlug(suspectName)}`);
    clueList.push({
      ...template,
      id: clueId,
      sourceInCML,
      description,
      pointsTo,
      placement: "mid",
      criticality: "essential",
      evidenceType: "elimination",
    });
    timeline.mid.push(clueId);
    repairs.push(`added ${clueId} as deterministic elimination backstop for ${suspectName}`);
  }

  return repairs;
}

// ============================================================================
// runAgent5
// ============================================================================

export async function runAgent5(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("clues", "Extracting and organizing clues...", 50);
  const llmRetriesEnabled = agent5LlmRetriesEnabled();
  if (!llmRetriesEnabled) {
    ctx.warnings.push("Agent 5: deterministic remediation mode active (LLM retry loops disabled by default)");
  }

  const evidenceIdNormalization = sanitizeDiscriminatingEvidenceClueIds(ctx.cml!);
  if (evidenceIdNormalization.removed.length > 0) {
    ctx.reportProgress(
      "clues",
      "Agent 5: normalized non-canonical discriminating_test.evidence_clues entries; using canonical clue IDs for deterministic traceability.",
      51,
    );
  }
  const mappingAlignedEvidenceIds = alignDiscriminatingEvidenceIdsWithSceneMapping(ctx.cml!);
  if (mappingAlignedEvidenceIds.replaced.length > 0) {
    const sample = mappingAlignedEvidenceIds.replaced
      .slice(0, 4)
      .map((entry) => `${entry.from} -> ${entry.to}`)
      .join(", ");
    ctx.warnings.push(
      `Agent 5: aligned discriminating_test.evidence_clues IDs to clue_to_scene_mapping namespace (${mappingAlignedEvidenceIds.replaced.length} replacement(s): ${sample}${mappingAlignedEvidenceIds.replaced.length > 4 ? ", ..." : ""})`,
    );
  }

  const clueDensity: "minimal" | "moderate" | "dense" =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  const strictPromptFeedbackBase = strictPromptContractsEnabled()
    ? buildStrictPromptFeedback(ctx.cml!)
    : undefined;
  const proactiveFirstPassFeedback = buildAgent5ProactiveFirstPassFeedback(ctx.cml!);
  const mergeStrictPromptFeedback = (feedback?: any, isRetry = false): any => {
    if (!strictPromptFeedbackBase) return feedback;

    const result: any = { ...(feedback ?? {}) };
    const existingRecommendations = Array.isArray(result.recommendations)
      ? result.recommendations.map((item: unknown) => String(item ?? "").trim()).filter(Boolean)
      : [];
    // On retry, strip the first-attempt "status=fail" escape hatch — the LLM must produce
    // valid clues on retry; self-failure is not an acceptable response.
    const strictRecommendations = strictPromptFeedbackBase.recommendations
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .filter((item) => !isRetry || !item.includes("return status=fail"));
    const retryDirective = isRetry
      ? ["RETRY MODE — You MUST return valid clues with correct sourceInCML paths. Returning status=fail or clues=[] is not acceptable on this attempt. Choose any valid path from the template list above."]
      : [];

    result.overallStatus = result.overallStatus ?? strictPromptFeedbackBase.overallStatus;
    result.violations = Array.isArray(result.violations) ? result.violations : [];
    result.warnings = Array.isArray(result.warnings) ? result.warnings : [];
    result.recommendations = [...new Set([...existingRecommendations, ...strictRecommendations, ...retryDirective])];

    result.strictSourcePaths = Array.isArray(result.strictSourcePaths) && result.strictSourcePaths.length > 0
      ? result.strictSourcePaths
      : strictPromptFeedbackBase.strictSourcePaths;
    result.requiredIdToSourceMappings = Array.isArray(result.requiredIdToSourceMappings)
      && result.requiredIdToSourceMappings.length > 0
      ? result.requiredIdToSourceMappings
      : strictPromptFeedbackBase.requiredIdToSourceMappings;
    result.requiredStepCoverageFloors = Array.isArray(result.requiredStepCoverageFloors)
      && result.requiredStepCoverageFloors.length > 0
      ? result.requiredStepCoverageFloors
      : strictPromptFeedbackBase.requiredStepCoverageFloors;
    result.requiredLateClueSlot = result.requiredLateClueSlot || strictPromptFeedbackBase.requiredLateClueSlot;
    result.requiredDirectCulpritClue = result.requiredDirectCulpritClue || strictPromptFeedbackBase.requiredDirectCulpritClue;

    return result;
  };

  const cluesStart = Date.now();
  let agent5RetryInvoked = false;
  ctx.agent5FirstPassPassed = true;
  ctx.agent5RetryInvoked = false;
  ctx.agent5FailureClass = "none";
  const recordHardFailPhaseScore = (reason: string): void => {
    if (!ctx.enableScoring || !ctx.scoreAggregator) return;
    const hardFailTotal = 55;
    const durationMs = (ctx.agentDurations["agent5_clues"] ?? 0) || Math.max(0, Date.now() - cluesStart);
    const cost = ctx.agentCosts["agent5_clues"] ?? 0;
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: 40,
        quality_score: 55,
        completeness_score: 60,
        consistency_score: 40,
        total: hardFailTotal,
        grade: "F",
        passed: false,
        failure_reason: reason,
        tests: [
          {
            name: "Deterministic hard gate",
            category: "validation" as const,
            passed: false,
            score: 40,
            weight: 3,
            message: reason,
          },
        ],
      },
      durationMs,
      cost,
      [reason],
    );
  };

  const failAgent5 = (message: string): never => {
    ctx.agent5FirstPassPassed = false;
    ctx.agent5RetryInvoked = agent5RetryInvoked;
    ctx.agent5FailureClass = classifyAgent5FailureClass(message);
    recordHardFailPhaseScore(message);
    throw new Error(message);
  };

  let extractionAttempt = 1;
  let performedSuspectRetry = false;
  let performedRedHerringRetry = false;
  const extractWithAttempt = (payload: any) =>
    extractClues(ctx.client, {
      ...payload,
      retryAttempt: extractionAttempt++,
    });
  let clues!: Awaited<ReturnType<typeof extractClues>>;
  const cluesInputBase = {
    cml: ctx.cml!,
    clueDensity,
    redHerringBudget: RED_HERRING_BUDGET,
    fairPlayFeedback: mergeStrictPromptFeedback(proactiveFirstPassFeedback),
    // A_65b Ph6 — the strict structural contract, FIRST-PASS. The merge above carries it only
    // into the retry-mode prompt block (which renders only when violations/warnings exist — a
    // condition the first pass never meets, verified on the probe: 0 strict lines in its one
    // Agent-5 request). This channel renders unconditionally, so the LLM AUTHORS the required
    // ids / direct-culprit clue / late slot in scene register and the deterministic synthesis
    // (5/5 runs in the warning corpus) becomes the rare counted floor.
    strictContract: strictPromptFeedbackBase
      ? {
          strictSourcePaths: strictPromptFeedbackBase.strictSourcePaths,
          requiredIdToSourceMappings: strictPromptFeedbackBase.requiredIdToSourceMappings,
          requiredStepCoverageFloors: strictPromptFeedbackBase.requiredStepCoverageFloors,
          requiredLateClueSlot: strictPromptFeedbackBase.requiredLateClueSlot,
          requiredDirectCulpritClue: strictPromptFeedbackBase.requiredDirectCulpritClue,
        }
      : undefined,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
    // Pillar 1: pass locked facts so clue descriptions honour canonical values
    ...(ctx.inputs.enableLockedFactRegistry && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0
      ? { lockedFacts: ctx.lockedFactRegistry }
      : {}),
  };
  try {
    clues = await extractWithAttempt(cluesInputBase);
  } catch (err) {
    const retryableExtractionFailure =
      err instanceof SyntaxError
      || err instanceof TypeError
      || /json|parse|unexpected token|structured output/i.test(String((err as Error)?.message ?? ""));
    if (retryableExtractionFailure && llmRetriesEnabled) {
      agent5RetryInvoked = true;
      ctx.warnings.push("Agent 5: first extraction attempt failed due to malformed model payload; retrying once");
      clues = await extractWithAttempt(cluesInputBase);
    } else if (retryableExtractionFailure) {
      ctx.errors.push("Agent 5 first extraction attempt failed due to malformed model payload (deterministic mode: no LLM retry)");
      failAgent5("Agent 5 extraction failed on malformed model payload in deterministic mode");
    } else {
      throw err;
    }
  }

  ctx.agentCosts["agent5_clues"] =
    clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
  ctx.agentDurations["agent5_clues"] = Date.now() - cluesStart;

  // Surface parse-boundary anomalies (truncated payload, dropped jsonrepair artifacts — the
  // run-a3c2973f phantom-clue class) in the run report so a batch review sees them.
  (clues.parseWarnings ?? []).forEach((w) => ctx.warnings.push(`Agent 5: parse boundary: ${w}`));

  ctx.reportProgress("clues", `${clues.clues.length} clues distributed`, 62);

  // ── First guardrail pass ───────────────────────────────────────────────────
  // Apply deterministic source-path repair BEFORE checking validity so that
  // empty/near-miss paths don't trigger the LLM retry gate unnecessarily.
  // The LLM retry consistently returns zero clues when given path constraints.
  const firstPassRepairs = repairInvalidSourcePaths(ctx.cml!, clues);
  firstPassRepairs.forEach((r) => ctx.warnings.push(`Agent 5: pre-guardrail source-path repair: ${r}`));

  let clueGuardrails = applyClueGuardrails(ctx.cml!, clues);
  clueGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
  const sourcePathSnapshot = checkSourcePathValidity(ctx.cml!, clues);

  if (clueGuardrails.hasCriticalIssues || sourcePathSnapshot.invalidPaths.length > 0) {
    if (clueGuardrails.hasCriticalIssues) {
      ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
    }
    if (sourcePathSnapshot.invalidPaths.length > 0) {
      ctx.warnings.push("Agent 5: sourceInCML legality violations detected; regenerating clues with path constraints");
    }
    clueGuardrails.issues.forEach((issue) =>
      ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`)
    );
    sourcePathSnapshot.invalidPaths.forEach((path) =>
      ctx.warnings.push(`  - [critical] source path legality: invalid sourceInCML path=${path}`),
    );

    const legalSourceTemplates = [
      "CASE.inference_path.steps[N].observation",
      "CASE.inference_path.steps[N].correction",
      "CASE.inference_path.steps[N].required_evidence[M]",
      "CASE.constraint_space.time.anchors[M]",
      "CASE.constraint_space.time.contradictions[M]",
      "CASE.cast[N].alibi_window",
      "CASE.cast[N].access_plausibility",
      "CASE.constraint_space.physical.traces[M]",
    ];

    if (llmRetriesEnabled) {
      const retryCluesStart = Date.now();
      agent5RetryInvoked = true;
      clues = await extractWithAttempt({
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: mergeStrictPromptFeedback({
          overallStatus: "fail",
          violations: [
            ...clueGuardrails.issues
              .filter((i) => i.severity === "critical")
              .map((i) => ({
                severity: "critical" as const,
                rule: "Deterministic Guardrail",
                description: i.message,
                suggestion:
                  "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
              })),
            ...sourcePathSnapshot.invalidPaths.map((path) => ({
              severity: "critical" as const,
              rule: "Source Path Legality",
              description: `Invalid source path: ${path}`,
              suggestion: `Replace with a legal path template such as ${legalSourceTemplates[0]} or ${legalSourceTemplates[3]}`,
            })),
          ],
          warnings: clueGuardrails.issues
            .filter((i) => i.severity !== "critical")
            .map((i) => i.message),
          recommendations: [
            "Move essential clues to early/mid placement",
            "Avoid private/detective-only clue phrasing",
            "Ensure clue IDs are unique and timeline is balanced",
            ...sourcePathSnapshot.invalidPaths.map(
              (path) => `Repair path exactly: ${path} -> use one of [${legalSourceTemplates.join(" | ")}]`,
            ),
          ],
        }, true),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

      // Guard: if LLM returned status=fail with empty clues on retry, fail with a clear message
      // rather than propagating 0-count clues into the guardrail which produces misleading errors.
      if (clues.clues.length === 0) {
        ctx.errors.push("Agent 5 retry returned zero clues (LLM self-reported failure on source-path retry)");
        failAgent5("Clue generation failed: LLM returned empty clues on source-path retry");
      }

      const secondGuardrailPass = applyClueGuardrails(ctx.cml!, clues);
      secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
      if (secondGuardrailPass.hasCriticalIssues) {
        secondGuardrailPass.issues.forEach((i) =>
          ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`)
        );
        failAgent5("Clue generation failed deterministic fair-play guardrails");
      }
      clueGuardrails = secondGuardrailPass;
    } else {
      ctx.warnings.push("Agent 5: skipping LLM regeneration for guardrail/source-path issues; continuing with deterministic backstops");
    }
  }

  // ── WP4: Inference Path Coverage Gate ─────────────────────────────────────
  const buildCoverageSnapshot = (activeClues: ClueDistributionResult) => {
    const inferredCoverage = checkInferencePathCoverage(ctx.cml!, activeClues);
    const contradictionIssues = checkContradictionPairs(ctx.cml!, activeClues);
    const falseAssumptionIssuesLocal = checkFalseAssumptionContradiction(ctx.cml!, activeClues);
    const discriminatingIssuesLocal = checkDiscriminatingTestReachability(ctx.cml!, activeClues);
    const suspectIssuesLocal = checkSuspectElimination(ctx.cml!, activeClues);
    const mergedCoverageIssues: ClueGuardrailIssue[] = [
      ...inferredCoverage.issues,
      ...contradictionIssues,
      ...falseAssumptionIssuesLocal,
      ...discriminatingIssuesLocal,
      ...suspectIssuesLocal,
    ];
    return {
      coverageResult: inferredCoverage,
      falseAssumptionIssues: falseAssumptionIssuesLocal,
      discrimTestIssues: discriminatingIssuesLocal,
      suspectIssues: suspectIssuesLocal,
      allCoverageIssues: mergedCoverageIssues,
    };
  };

  const initialCoverage = buildCoverageSnapshot(clues);
  const coverageResult = initialCoverage.coverageResult;
  const allCoverageIssues: ClueGuardrailIssue[] = initialCoverage.allCoverageIssues;
  allCoverageIssues.forEach((issue) =>
    ctx.warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`)
  );

  let performedCoverageRetry = false;

  const falseAssumptionIssues = initialCoverage.falseAssumptionIssues;
  const discrimTestIssues = initialCoverage.discrimTestIssues;

  if (
    coverageResult.hasCriticalGaps ||
    falseAssumptionIssues.some((i) => i.severity === "critical") ||
    discrimTestIssues.some((i) => i.severity === "critical")
  ) {
    if (llmRetriesEnabled) {
      performedCoverageRetry = true;
      ctx.warnings.push(
        "Inference coverage gate: critical gaps found; regenerating clues with coverage feedback"
      );

    const coverageFeedback = {
      overallStatus: "fail" as const,
      violations: allCoverageIssues
        .filter((i) => i.severity === "critical")
        .map((i) => ({
          severity: "critical" as const,
          rule: "Inference Path Coverage",
          description: i.message,
          suggestion:
            "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
        })),
      warnings: allCoverageIssues.filter((i) => i.severity === "warning").map((i) => i.message),
      recommendations: [
        "Every inference step needs at least one observation clue and one contradiction clue",
        "Set supportsInferenceStep on every essential clue",
        "Include at least one clue that explicitly contradicts the false assumption",
        `Uncovered steps: ${coverageResult.uncoveredSteps.join(", ")}`,
      ],
    };

      ctx.reportProgress("clues", "Regenerating clues to address coverage gaps...", 58);
      const coverageRetryStart = Date.now();
      agent5RetryInvoked = true;
      clues = await extractWithAttempt({
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: mergeStrictPromptFeedback(coverageFeedback),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);

      const postCoverageGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postCoverageGuardrails.fixes.forEach((fix) =>
        ctx.warnings.push(`Post-coverage guardrail auto-fix: ${fix}`)
      );
    } else {
      ctx.warnings.push("Inference coverage gate: critical gaps detected; skipping LLM retry and relying on deterministic step/evidence backstops");
    }
  }

  // ── FIX-J: Per-suspect clue coverage gate ─────────────────────────────────
  // Every eligible non-culprit suspect must have at least one clue referencing
  // them by name. If the coverage retry didn't address this, regenerate with
  // targeted suspect-coverage feedback before committing to ctx.clues.
  const initialSuspectCoverage = analyzeSuspectCoverage(ctx.cml!, clues);
  const suspectsNeedingCoverage = [...new Set([
    ...initialSuspectCoverage.uncovered,
    ...initialSuspectCoverage.weakElimination,
  ])];
  if (suspectsNeedingCoverage.length > 0) {
    const attemptLabel = "retry 1";
    if (initialSuspectCoverage.uncovered.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.uncovered.length} suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`,
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.uncovered.length} suspect(s) (${initialSuspectCoverage.uncovered.join(", ")}) are never referenced in any clue`,
      );
      initialSuspectCoverage.uncovered.forEach((suspect) => {
        ctx.warnings.push(`    • ${suspect}: referenced clue IDs: (none)`);
      });
    }
    if (initialSuspectCoverage.weakElimination.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.weakElimination.length} suspect(s) are named but lack elimination/alibi evidence; regenerating targeted clues`,
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.weakElimination.length} suspect(s) (${initialSuspectCoverage.weakElimination.join(", ")}) are referenced but lack elimination/alibi evidence`,
      );
      initialSuspectCoverage.records
        .filter((r) => initialSuspectCoverage.weakElimination.includes(r.suspect))
        .forEach((r) => {
          const refs = r.referencedClueIds.length > 0 ? r.referencedClueIds.join(", ") : "(none)";
          ctx.warnings.push(`    • ${r.suspect}: referenced clue IDs: ${refs}; elimination clues: (none); alibi clues: (none)`);
        });
    }

    const suspectViolations = suspectsNeedingCoverage.map((suspect) => {
      const issueType = initialSuspectCoverage.uncovered.includes(suspect)
        ? "not referenced in any clue"
        : "referenced but lacks elimination/alibi evidence";
      return {
        severity: "critical" as const,
        rule: "Suspect Clue Coverage",
        description: `${suspect} is ${issueType}.`,
        suggestion:
          "Add at least one clue that names this suspect and provides elimination/alibi evidence so the reader can logically rule them out.",
      };
    });

    if (llmRetriesEnabled) {
      performedSuspectRetry = true;
      const suspectRetryStart = Date.now();
      agent5RetryInvoked = true;
      const suspectCoverageFeedback = {
        overallStatus: "fail" as const,
        violations: suspectViolations,
        warnings: [],
        recommendations: [
          "Every eligible non-culprit suspect must appear in at least one clue",
          "Every eligible non-culprit suspect should include elimination/alibi support, not only name mentions",
          "Clues can reference a suspect via their alibi, observed behaviour, or elimination evidence",
          "Adding elimination clues for uncovered suspects does not require extra inference steps",
        ],
      };
      ctx.reportProgress("clues", "Regenerating clues to address suspect coverage gaps...", 60);
      clues = await extractWithAttempt({
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: mergeStrictPromptFeedback(suspectCoverageFeedback),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - suspectRetryStart);

      const postSuspectGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postSuspectGuardrails.fixes.forEach((fix) =>
        ctx.warnings.push(`Post-suspect-coverage guardrail auto-fix: ${fix}`)
      );

      // Re-check; if suspects are still uncovered after retry, log a warning only
      // (do not hard-fail — the story can still be generated, just with a gap).
      const postRetryCoverage = analyzeSuspectCoverage(ctx.cml!, clues);
      const stillUncovered = postRetryCoverage.uncovered;
      const stillWeak = postRetryCoverage.weakElimination;
      if (stillUncovered.length > 0 || stillWeak.length > 0) {
        const summaryParts: string[] = [];
        if (stillUncovered.length > 0) {
          summaryParts.push(`Uncovered suspects: ${stillUncovered.join(", ")}`);
        }
        if (stillWeak.length > 0) {
          summaryParts.push(`Weak elimination/alibi evidence: ${stillWeak.join(", ")}`);
        }
        ctx.warnings.push(
          `Agent 5 suspect-coverage gate still has gaps after retry (continuing): ${summaryParts.join("; ")}`,
        );

        // Preserve per-suspect diagnostics so downstream auditing can still act on gaps.
        postRetryCoverage.records
          .filter(
            (r) => stillUncovered.includes(r.suspect) || stillWeak.includes(r.suspect),
          )
          .forEach((r) => {
            const refs = r.referencedClueIds.length > 0 ? r.referencedClueIds.join(", ") : "(none)";
            const elim = r.eliminationClueIds.length > 0 ? r.eliminationClueIds.join(", ") : "(none)";
            const alibi = r.alibiClueIds.length > 0 ? r.alibiClueIds.join(", ") : "(none)";
            ctx.warnings.push(
              `  - ${r.suspect}: referenced clues=${refs}; elimination clues=${elim}; alibi clues=${alibi}`,
            );
          });
      }
    } else {
      const suspectBackstopRepairs = synthesizeSuspectCoverageBackstopClues(ctx.cml!, clues, suspectsNeedingCoverage);
      suspectBackstopRepairs.forEach((repair) =>
        ctx.warnings.push(`Agent 5 suspect-coverage deterministic synthesis: ${repair}`),
      );
    }
  }

  // ── A_71 (A_70 §6) — the red-herring FLOOR ────────────────────────────────────────────────────
  //
  // MEASURED: the 07-27 run shipped with **0 red herrings** where all three 07-24 runs produced 2.
  // A fair-play mystery with no red herrings has no misdirection field at all — the reader has
  // nothing to be wrong about — and that run scored `clues: 5/10`.
  //
  // The cause is that `redHerringBudget` was only ever enforced as a CEILING:
  // `redHerringsDontBreakLogic: redHerrings.length <= budget` (agent5-clues.ts). Zero satisfies it.
  // Every other Agent-5 shortfall (suspect coverage, clue coverage) has a floor; misdirection did
  // not, so an LLM that simply omitted the array shipped unchallenged.
  //
  // Shape follows the suspect-coverage precedent directly above: ONE bounded regeneration with
  // feedback naming the shortfall, then continue with a loud warning either way. No abort path —
  // a missing red herring is a quality defect, not a fair-play violation (§2.8 never-abort). No
  // deterministic synthesis: a fabricated red herring is exactly the template-injection class
  // A_67/A_68 spent two boards removing from prose.
  //
  // Off-switch: AGENT5_RED_HERRING_FLOOR=false. Runtime getter, never a module const
  // (`module-const-flags-frozen-before-dotenv`).
  const redHerringFloor = assessRedHerringFloor(clues.redHerrings);
  const redHerringCount = redHerringFloor.count;
  if (redHerringFloor.needsRepair) {
    ctx.warnings.push(
      `Agent 5 red-herring floor: ${redHerringCount} red herring(s) against a budget of ${RED_HERRING_BUDGET} — ` +
        `a mystery with no misdirection has no false trail for the reader to follow`,
    );

    // FOUND BY AUDIT 2026-08-03 — this read `if (llmRetriesEnabled)`, and
    // `AGENT5_ENABLE_LLM_RETRIES` is DEFAULT-OFF ("deterministic remediation mode active — LLM retry
    // loops disabled by default"). So A_71's floor detected the shortfall, logged it, and **never
    // attempted the one bounded regeneration it was built to make**: on run mystery-1785694688534 the
    // story shipped with ZERO red herrings and no misdirection. It was a detector wearing the name of
    // a floor, and the earlier run's 2 red herrings were the model's own output, not a repair.
    //
    // A_71 §4 gave this pass its OWN off-switch (`AGENT5_RED_HERRING_FLOOR=false`) precisely so it
    // would work on default config; deferring to the global retry flag defeated that design. The
    // floor now governs its own repair — still exactly one bounded attempt, still no abort path, and
    // still no deterministic synthesis (a fabricated red herring is the template-injection class
    // A_67/A_68 spent two boards removing).
    if (redHerringFloor.enabled) {
      const redHerringFloorStart = Date.now();
      agent5RetryInvoked = true;
      ctx.reportProgress("clues", "Regenerating clues to restore red herrings...", 60);
      const beforeCount = redHerringCount;
      clues = await extractWithAttempt({
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: mergeStrictPromptFeedback({
          overallStatus: "fail",
          violations: [
            {
              severity: "critical" as const,
              rule: "Red Herring Budget",
              description:
                `The previous response returned ${beforeCount} red herring(s); ${RED_HERRING_BUDGET} were requested. ` +
                `Without them the reader has no plausible wrong answer to be drawn toward.`,
              suggestion:
                `Populate redHerrings[] with ${RED_HERRING_BUDGET} entries that each support the false assumption ` +
                `and point at a non-culprit, without reusing correction language from the true solution.`,
            },
          ],
          warnings: [],
          recommendations: [
            "Every red herring must support the false assumption, never the true solution",
            "A red herring should make an innocent suspect look plausible on the evidence available at that point",
            "Red herrings are separate from clues — populate redHerrings[], do not relabel existing clues",
          ],
        }),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] = clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - redHerringFloorStart);

      const postFloorGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postFloorGuardrails.fixes.forEach((fix) =>
        ctx.warnings.push(`Post-red-herring-floor guardrail auto-fix: ${fix}`),
      );

      const afterCount = Array.isArray(clues.redHerrings) ? clues.redHerrings.length : 0;
      ctx.warnings.push(
        afterCount >= RED_HERRING_FLOOR
          ? `Agent 5 red-herring floor: restored ${afterCount} red herring(s) after regeneration`
          : `Agent 5 red-herring floor still unmet after regeneration (${afterCount}); continuing — the story ships without misdirection`,
      );
    }
  } else if (redHerringFloor.enabled && redHerringFloor.shortOfBudget) {
    // Above the floor but under budget: worth a number, not worth an LLM call.
    ctx.warnings.push(
      `Agent 5 red-herring budget: ${redHerringCount}/${RED_HERRING_BUDGET} red herrings (above the floor; not regenerated)`,
    );
  }

  // Red-herring separation hardening: if a red herring semantically overlaps with
  // true-solution correction language, run one bounded regeneration pass and hard-fail
  // if overlap still persists.
  const initialRedHerringOverlapDetails = findRedHerringOverlapDetails(ctx.cml!, clues);
  if (initialRedHerringOverlapDetails.length > 0) {
    const initialRedHerringOverlapIds = initialRedHerringOverlapDetails.map((d) => d.redHerringId);
    ctx.warnings.push(
      `Agent 5: ${initialRedHerringOverlapIds.length} red herring(s) overlap true-solution signals; regenerating for separation`,
    );
    ctx.warnings.push(`  - Overlapping red herring id(s): ${initialRedHerringOverlapIds.join(", ")}`);
    initialRedHerringOverlapDetails.forEach((detail) => {
      ctx.warnings.push(
        `    • ${detail.redHerringId} -> inference steps ${detail.matchedStepIndexes.join(", ")} via words: ${detail.matchedCorrectionWords.slice(0, 8).join(", ")}`,
      );
    });

    const temporalCollision = detectTemporalLexicalCollision(ctx.cml!, initialRedHerringOverlapDetails);
    if (temporalCollision.detected) {
      ctx.warnings.push(`Agent 5: ${temporalCollision.explanation}`);
      if (temporalCollision.forbiddenTerms.length > 0) {
        ctx.warnings.push(`  - forbidden red-herring terms: ${temporalCollision.forbiddenTerms.join(", ")}`);
      }
      if (temporalCollision.allowedTerms.length > 0) {
        ctx.warnings.push(`  - preferred false-assumption-only terms: ${temporalCollision.allowedTerms.join(", ")}`);
      }
    }

    if (llmRetriesEnabled) {
      performedRedHerringRetry = true;
      const redHerringRetryStart = Date.now();
      agent5RetryInvoked = true;
    const overlapTerms = [...new Set(initialRedHerringOverlapDetails.flatMap((d) => d.matchedCorrectionWords || []))]
      .map((t) => String(t).trim().toLowerCase())
      .filter(Boolean);
    const explicitForbiddenTerms = [...new Set([
      ...overlapTerms,
      ...(temporalCollision.detected ? temporalCollision.forbiddenTerms : []),
    ])];
    const replacementTargets = explicitForbiddenTerms.slice(0, 12).map((term, idx) => {
      const replacement = temporalCollision.allowedTerms[idx % Math.max(temporalCollision.allowedTerms.length, 1)] || "assumed time";
      return `${term} -> ${replacement}`;
    });

      clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: RED_HERRING_BUDGET,
      fairPlayFeedback: mergeStrictPromptFeedback({
        overallStatus: "fail",
        violations: initialRedHerringOverlapIds.map((id: string) => ({
        
          severity: "critical" as const,
          rule: "Red Herring Separation",
          description: (() => {
            const detail = initialRedHerringOverlapDetails.find((d) => d.redHerringId === id);
            const words = detail?.matchedCorrectionWords?.slice(0, 8).join(", ") || "(no terms captured)";
            const steps = detail?.matchedStepIndexes?.join(", ") || "(none)";
            return `Red herring ${id} overlaps inference corrections (steps: ${steps}; words: ${words}) and may support the true solution.`;
          })(),
          suggestion: "Rewrite this red herring to reinforce only the false assumption and avoid terms tied to true-solution corrections.",
        })),
        warnings: [],
        recommendations: [
          "Red herrings must support the false assumption only",
          "Do not reuse correction-language terms from inference_path.steps[].correction in red herring text",
          "Preserve misdirection without reinforcing culprit-identifying logic",
          ...(temporalCollision.detected
            ? [
                `Forbidden terms for red-herring rewrite: ${temporalCollision.forbiddenTerms.join(", ") || "(none)"}`,
                `Prefer these temporal assumption terms instead: ${temporalCollision.allowedTerms.join(", ") || "(none)"}`,
              ]
            : []),
        ],
        forbiddenTerms: explicitForbiddenTerms,
        preferredTerms: temporalCollision.allowedTerms,
        requiredReplacements: replacementTargets,
        redHerringIdsToRewrite: initialRedHerringOverlapIds,
      }),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - redHerringRetryStart);

      const postRedHerringGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postRedHerringGuardrails.fixes.forEach((fix) =>
        ctx.warnings.push(`Post-red-herring guardrail auto-fix: ${fix}`),
      );

      const postRetryRedHerringOverlapDetails = findRedHerringOverlapDetails(ctx.cml!, clues);
      if (postRetryRedHerringOverlapDetails.length > 0) {
      const severeOverlap = postRetryRedHerringOverlapDetails.filter((d) => d.overlapScore >= 4);
      if (severeOverlap.length > 0) {
        const overlapRepairs = sanitizeRedHerringOverlap(ctx.cml!, clues, severeOverlap, temporalCollision.allowedTerms);
        overlapRepairs.forEach((repair) =>
          ctx.warnings.push(`Agent 5 red-herring deterministic sanitizer: ${repair}`),
        );

        const postSanitizeOverlap = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
        if (postSanitizeOverlap.length > 0) {
          const postRetryRedHerringOverlapIds = postSanitizeOverlap.map((d) => d.redHerringId);
          const pruned = pruneOverlappingRedHerrings(clues, postRetryRedHerringOverlapIds);
          if (pruned.length > 0) {
            ctx.warnings.push(
              `Agent 5 red-herring overlap hardening: pruned persistently overlapping red herring(s) after retry (${pruned.join(", ")})`,
            );
          }

          const remainingSevereOverlap = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
          if (remainingSevereOverlap.length > 0) {
            failAgent5(
              `Agent 5 red-herring overlap gate failed after retry. Overlapping red herring(s): ${remainingSevereOverlap.map((d) => d.redHerringId).join(", ")}`,
            );
          }
        }
      }
        ctx.warnings.push(
          `Agent 5: minor red-herring overlap remains after retry (${postRetryRedHerringOverlapDetails.map((d) => d.redHerringId).join(", ")}); continuing with warning`,
        );
      }
    } else {
      const overlapRepairs = sanitizeRedHerringOverlap(
        ctx.cml!,
        clues,
        initialRedHerringOverlapDetails,
        temporalCollision.allowedTerms,
      );
      overlapRepairs.forEach((repair) =>
        ctx.warnings.push(`Agent 5 red-herring deterministic sanitizer: ${repair}`),
      );

      const severePostSanitize = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
      if (severePostSanitize.length > 0) {
        const overlapIds = severePostSanitize.map((d) => d.redHerringId);
        const pruned = pruneOverlappingRedHerrings(clues, overlapIds);
        if (pruned.length > 0) {
          ctx.warnings.push(
            `Agent 5 red-herring overlap hardening: pruned persistently overlapping red herring(s) (${pruned.join(", ")})`,
          );
        }

        const remainingSevere = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
        if (remainingSevere.length > 0) {
          failAgent5(
            `Agent 5 red-herring overlap gate failed after deterministic sanitization. Overlapping red herring(s): ${remainingSevere.map((d) => d.redHerringId).join(", ")}`,
          );
        }
      }

      const remainingMinor = findRedHerringOverlapDetails(ctx.cml!, clues);
      if (remainingMinor.length > 0) {
        ctx.warnings.push(
          `Agent 5: minor red-herring overlap remains after deterministic sanitization (${remainingMinor.map((d) => d.redHerringId).join(", ")}); continuing with warning`,
        );
      }
    }
  }

  const sourcePathRepairs = repairInvalidSourcePaths(ctx.cml!, clues);
  sourcePathRepairs.forEach((repair) =>
    ctx.warnings.push(`Agent 5 source-path auto-repair: ${repair}`),
  );

  const sourcePathValidation = checkSourcePathValidity(ctx.cml!, clues);
  sourcePathValidation.issues.forEach((issue) => ctx.errors.push(`Agent 5 source-path validation: ${issue.message}`));
  if (sourcePathValidation.issues.length > 0) {
    failAgent5(`Agent 5 source-path gate failed with ${sourcePathValidation.issues.length} invalid source path(s).`);
  }

  reconcileModelAudit(ctx.cml!, clues);

  const stepBoundIssues = checkInferenceStepBounds(ctx.cml!, clues);
  stepBoundIssues.forEach((issue) => ctx.errors.push(`Agent 5 inference-step bounds: ${issue.message}`));
  if (stepBoundIssues.length > 0) {
    failAgent5(`Agent 5 step-index gate failed with ${stepBoundIssues.length} out-of-range inference step reference(s).`);
  }

  const castPathRepairs = repairCastNamePathConsistency(ctx.cml!, clues);
  castPathRepairs.forEach((repair) =>
    ctx.warnings.push(`Agent 5 cast-path auto-repair: ${repair}`),
  );
  // A_67 review bug (stale-audit-vs-repaired-text): the cast-path repair rewrites clue text, shifting
  // suspect coverage; without re-syncing, checkModelAuditConsistency below recomputes coverage from the
  // repaired text and mismatches the pre-repair audit snapshot (line 3848), spuriously aborting a clean
  // run the repair just fixed. Re-reconcile so the audit reflects the repaired text.
  if (castPathRepairs.length > 0) reconcileModelAudit(ctx.cml!, clues);

  const castPathConsistencyIssues = checkCastNamePathConsistency(ctx.cml!, clues);
  castPathConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 cast-path consistency: ${issue.message}`));
  if (castPathConsistencyIssues.length > 0) {
    failAgent5(`Agent 5 cast-path consistency gate failed with ${castPathConsistencyIssues.length} issue(s).`);
  }

  const auditConsistencyIssues = checkModelAuditConsistency(ctx.cml!, clues);
  auditConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 audit consistency: ${issue.message}`));
  if (auditConsistencyIssues.length > 0) {
    failAgent5(`Agent 5 audit-consistency gate failed with ${auditConsistencyIssues.length} mismatch(es).`);
  }

  let eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  if (eraTimeStyleIssues.length > 0) {
    const eraRepairs = sanitizeEraTimeStyleInClues(clues);
    eraRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 era-style sanitizer: ${repair}`));
    eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  }
  eraTimeStyleIssues.forEach((issue) => ctx.errors.push(`Agent 5 era time style: ${issue.message}`));
  if (eraTimeStyleIssues.length > 0) {
    failAgent5(`Agent 5 era time-style gate failed with ${eraTimeStyleIssues.length} digit-based time issue(s).`);
  }

  // Strict locked-fact/clue semantic consistency gate before committing clues downstream.
  const hardLogicLockedFacts = Array.isArray((ctx as any).hardLogicDevices?.devices)
    ? (ctx as any).hardLogicDevices.devices.flatMap((d: any) =>
        Array.isArray(d?.lockedFacts) ? d.lockedFacts : [],
      )
    : undefined;
  // X86 — same repair-then-recheck as the guardrail site above. A run died here on 2026-08-21 for a
  // pair of transposed registry values, while three sibling gates in the same file repair first.
  let timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    const timeRepairs = repairLockedFactClueTimeTranspositions(ctx.cml!, clues, hardLogicLockedFacts);
    timeRepairs.forEach((repair) =>
      ctx.warnings.push(`Agent 5 locked-fact time transposition repair: ${repair}`),
    );
    timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  }
  if (timeConflicts.length > 0) {
    timeConflicts.forEach((msg) => ctx.errors.push(`Agent 5 CML-clue consistency failure: ${msg}`));
    failAgent5(
      `Agent 5 CML-clue consistency gate failed (${timeConflicts.length} time conflict(s)).`,
    );
  }

  const culpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
  if (culpritGaps.length > 0) {
    const culpritRepairs = synthesizeMissingCulpritDiscriminatingClues(ctx.cml!, clues, culpritGaps);
    culpritRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 culprit-evidence deterministic synthesis: ${repair}`));
    const remainingCulpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
    if (remainingCulpritGaps.length > 0) {
      failAgent5(
        `Agent 5 culprit-discriminating clue gate failed. Missing direct evidence clue for culprit(s): ${remainingCulpritGaps.join(", ")}`,
      );
    }
  }

  let finalCoverage = buildCoverageSnapshot(clues);

  const existingEvidenceIds = getCanonicalEvidenceClueIds(ctx.cml!);
  if (existingEvidenceIds.length === 0) {
    const seededEvidenceIds = selectDiscriminatingEvidenceCandidateIds(ctx.cml!, clues, 3);
    if (seededEvidenceIds.length > 0) {
      const caseBlock = getCaseBlock(ctx.cml!);
      if (caseBlock?.discriminating_test) {
        caseBlock.discriminating_test.evidence_clues = seededEvidenceIds;
        // A_53 integration fix: the strict whitelist/feedback memos are keyed by the cml object's
        // identity and the whitelist includes CASE.discriminating_test.evidence_clues[i] paths — this
        // in-place mutation would otherwise leave those memos stale. Invalidate them for this cml.
        strictSourcePathWhitelistCache.delete(ctx.cml! as unknown as object);
        strictPromptFeedbackCache.delete(ctx.cml! as unknown as object);
        ctx.reportProgress(
          "clues",
          `Agent 5: deterministically seeded discriminating_test.evidence_clues from canonical clue IDs (${seededEvidenceIds.join(", ")}).`,
          61,
        );
        finalCoverage = buildCoverageSnapshot(clues);
      }
    }
  }

  // Final targeted remediation: if discriminating-test evidence_clues IDs are still
  // missing, run one bounded retry with exact ID contract feedback before hard-fail.
  const missingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
  if (missingEvidenceIds.length > 0 && llmRetriesEnabled) {
    ctx.warnings.push(
      `Agent 5: ${missingEvidenceIds.length} discriminating-test evidence clue ID(s) still missing after retries; running targeted ID-contract retry`,
    );
    ctx.reportProgress("clues", "Regenerating clues to satisfy discriminating evidence ID contract...", 61);

    const idContractRetryStart = Date.now();
    agent5RetryInvoked = true;
    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: RED_HERRING_BUDGET,
      fairPlayFeedback: mergeStrictPromptFeedback({
        overallStatus: "fail",
        violations: [
          {
            severity: "critical" as const,
            rule: "Discriminating Test ID Contract",
            description: `Missing clue id(s): ${missingEvidenceIds.join(", ")}`,
            suggestion: "Add clues using these exact IDs and place them as essential early/mid evidence.",
          },
        ],
        warnings: [],
        recommendations: [
          `Every CASE.discriminating_test.evidence_clues ID must exist exactly in clues[].id: ${missingEvidenceIds.join(", ")}`,
          "Set these required IDs to criticality=essential and placement=early|mid.",
          "Preserve unaffected clue IDs and wording unless dependency requires change.",
          "Keep sourceInCML paths legal and in-range.",
        ],
      }),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - idContractRetryStart);

    const postIdContractGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postIdContractGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-discriminating-id guardrail auto-fix: ${fix}`),
    );
    if (postIdContractGuardrails.hasCriticalIssues) {
      postIdContractGuardrails.issues.forEach((issue) =>
        ctx.errors.push(`Agent 5 guardrail failure after discriminating-id retry: ${issue.message}`),
      );
      failAgent5("Agent 5 guardrail failure after discriminating evidence ID retry");
    }

    finalCoverage = buildCoverageSnapshot(clues);
  }

  if (performedCoverageRetry) {
    finalCoverage.allCoverageIssues.forEach((issue) =>
      ctx.warnings.push(`Inference coverage final: [${issue.severity}] ${issue.message}`),
    );
  }

  let remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
  if (remainingMissingEvidenceIds.length > 0) {
    const remapResult = remapMissingDiscriminatingEvidenceIdsToExistingClues(
      ctx.cml!,
      clues,
      remainingMissingEvidenceIds,
    );
    if (remapResult.remapped.length > 0) {
      remapResult.remapped.forEach((repair) =>
        ctx.warnings.push(
          `Agent 5 evidence-id deterministic remap: ${repair.missingId} => ${repair.mappedId} (matched existing ${repair.sourceId})`,
        ),
      );
      finalCoverage = buildCoverageSnapshot(clues);
      remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
    }
  }

  if (remainingMissingEvidenceIds.length > 0) {
    // A_61 evidence-mapping FP fix: any evidence id that still references no real clue after the LLM
    // retries and the deterministic remap is an unmappable placeholder (most often the Agent-3 prompt
    // example ids clue_1/clue_2/clue_3). Purge those and reseed from real clue IDs rather than cloning
    // a real clue under the junk name. See purgeUnmappableDiscriminatingEvidenceIds for the soundness
    // argument that a genuine "no plantable evidence" case still hard-fails.
    const purge = purgeUnmappableDiscriminatingEvidenceIds(ctx.cml!, clues);
    if (purge.removed.length > 0) {
      ctx.warnings.push(
        `Agent 5 evidence-id purge: dropped ${purge.removed.length} unmappable/placeholder evidence id(s) absent from the distributed clue set (${purge.removed.join(", ")}).`,
      );
      if (purge.reseeded.length > 0) {
        ctx.warnings.push(
          `Agent 5 evidence-id purge reseed: repopulated discriminating_test.evidence_clues from canonical clue IDs (${purge.reseeded.join(", ")}).`,
        );
      }
      finalCoverage = buildCoverageSnapshot(clues);
      remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
    }
  }

  // RC3.1 (A_61 Phase 2a): repair-not-abort — synthesise a covering clue for any inference step still
  // uncovered after retries, so an uncovered-by-the-LLM step does not hard-kill the run (run bfmz7izf6).
  // Runs before the deterministic contracts so they validate the synthesised clues, and before the hard
  // gate so a coverable step no longer aborts. A step with an empty observation stays uncovered → the
  // hard gate still fires (correct: nothing to plant).
  finalCoverage = buildCoverageSnapshot(clues);
  if (finalCoverage.coverageResult.uncoveredSteps.length > 0) {
    const coverageRepairs = synthesizeInferenceStepCoverageClues(
      ctx.cml!,
      clues,
      finalCoverage.coverageResult.uncoveredSteps,
    );
    if (coverageRepairs.length > 0) {
      coverageRepairs.forEach((repair) =>
        ctx.warnings.push(`Agent 5 inference-step coverage synthesis: ${repair}`),
      );
      finalCoverage = buildCoverageSnapshot(clues);
    }
  }

  try {
    const deterministicContracts = enforceAgent5DeterministicContracts(ctx.cml!, clues, {
      hardLogicLockedFacts,
    });
    deterministicContracts.warnings.forEach((warning) => ctx.warnings.push(warning));
    finalCoverage = buildCoverageSnapshot(clues);
  } catch (error) {
    failAgent5((error as Error).message || "Agent 5 deterministic contract gate failed.");
  }

  // Final hard gate: if critical inference/discriminating-test coverage still fails
  // after retries, abort before committing clues downstream.
  const stillHasCriticalCoverage =
    finalCoverage.coverageResult.hasCriticalGaps ||
    finalCoverage.falseAssumptionIssues.some((i) => i.severity === "critical") ||
    finalCoverage.discrimTestIssues.some((i) => i.severity === "critical");
  if (stillHasCriticalCoverage) {
    const criticalMessages = finalCoverage.allCoverageIssues
      .filter((i) => i.severity === "critical")
      .map((i) => i.message);
    const summary = criticalMessages.length > 0
      ? criticalMessages.join("; ")
      : "critical inference coverage gaps remain after retries";
    ctx.errors.push(`Agent 5 coverage hard gate failed after retries: ${summary}`);
    failAgent5(`Agent 5 coverage hard gate failed after retries: ${summary}`);
  }

  ctx.clues = clues;
  // A_90 Move 1 — do the clues introduce clock values the case never declared? Telemetry only.
  if (isA90ChronologyEnabled()) {
    try {
      const chrono = deriveCaseChronology(ctx.cml, (ctx.lockedFactRegistry ?? []) as any[]);
      const anchoring = findUnanchoredClockValues(clues, chrono, { skip: () => false });
      ctx.warnings.push(`[A_90 chronology] clues: ${summariseChronology(chrono, anchoring)}`);
    } catch { /* telemetry never costs a run */ }
  }
  ctx.coverageResult = finalCoverage.coverageResult;
  ctx.allCoverageIssues = finalCoverage.allCoverageIssues;

  // ── Phase score ────────────────────────────────────────────────────────────
  if (ctx.enableScoring && ctx.scoreAggregator) {
    const guardrailTriggered = clueGuardrails.hasCriticalIssues;
    const coverageGapsFound = finalCoverage.coverageResult.hasCriticalGaps;
    const clueCount = clues.clues.length;
    const densityTargets: Record<typeof clueDensity, { min: number; max: number }> = {
      minimal: { min: 5, max: 8 },
      moderate: { min: 8, max: 12 },
      dense: { min: 12, max: 18 },
    };
    const densityTarget = densityTargets[clueDensity];
    const clueCountScore =
      clueCount < densityTarget.min
        ? Math.round((clueCount / densityTarget.min) * 100)
        : clueCount <= densityTarget.max
          ? 100
          : Math.max(80, 100 - Math.round(((clueCount - densityTarget.max) / densityTarget.max) * 100));
    const guardrailScore = guardrailTriggered ? 75 : 100;
    const coverageScore = coverageGapsFound ? 75 : 100;
    const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
    const warningCount = finalCoverage.allCoverageIssues.filter((i) => i.severity === "warning").length;
    const retryPenalty = (performedCoverageRetry ? 10 : 0)
      + (performedSuspectRetry ? 8 : 0)
      + (performedRedHerringRetry ? 8 : 0);
    const qualityScore = Math.max(70, 100 - (warningCount * 6) - (clueGuardrails.fixes.length * 4));
    const consistencyScore = Math.max(70, 100 - retryPenalty);
    const clueTotal = Math.round(
      clueValidation * 0.35
      + qualityScore * 0.25
      + clueCountScore * 0.2
      + consistencyScore * 0.2,
    );
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: clueValidation,
        quality_score: qualityScore,
        completeness_score: clueCountScore,
        consistency_score: consistencyScore,
        total: clueTotal,
        grade: (clueTotal >= 90 ? "A" : clueTotal >= 80 ? "B" : clueTotal >= 70 ? "C" : clueTotal >= 60 ? "D" : "F") as PhaseScore["grade"],
        passed: clueTotal >= 75,
        tests: [
          {
            name: "Clue count",
            category: "completeness" as const,
            passed: clueCount >= densityTarget.min,
            score: clueCountScore,
            weight: 1.5,
            message: `${clueCount} clues distributed (target ${densityTarget.min}-${densityTarget.max} for ${clueDensity})`,
          },
          {
            name: "Guardrail compliance",
            category: "validation" as const,
            passed: !guardrailTriggered,
            score: guardrailScore,
            weight: 2,
            message: guardrailTriggered
              ? `Guardrail issues detected and auto-fixed (${clueGuardrails.fixes.length} fix(es))`
              : "All guardrails passed",
          },
          {
            name: "Inference coverage",
            category: "validation" as const,
            passed: !coverageGapsFound,
            score: coverageScore,
            weight: 2,
            message: coverageGapsFound
              ? `Coverage gaps found and addressed (${finalCoverage.allCoverageIssues.length} issue(s))`
              : `Full inference coverage (${finalCoverage.allCoverageIssues.length} minor issues)`,
          },
          {
            name: "Narrative clue quality",
            category: "quality" as const,
            passed: qualityScore >= 80,
            score: qualityScore,
            weight: 1.5,
            message: `${warningCount} warning-level issue(s), ${clueGuardrails.fixes.length} auto-fix(es)`,
          },
          {
            name: "Deterministic consistency",
            category: "consistency" as const,
            passed: consistencyScore >= 80,
            score: consistencyScore,
            weight: 1.5,
            message: `Retry penalty=${retryPenalty} (coverage retry=${performedCoverageRetry}, suspect retry=${performedSuspectRetry}, red-herring retry=${performedRedHerringRetry})`,
          },
        ],
      },
      ctx.agentDurations["agent5_clues"] ?? 0,
      ctx.agentCosts["agent5_clues"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }

  ctx.agent5FirstPassPassed = !agent5RetryInvoked;
  ctx.agent5RetryInvoked = agent5RetryInvoked;
  ctx.agent5FailureClass = "none";
}

export const __testables = {
  analyzeSuspectCoverage,
  reconcileModelAudit,
  checkModelAuditConsistency,
  buildStrictPromptFeedback,
  enforceAgent5DeterministicContracts,
  checkDiscriminatingTestReachability,
  checkMechanismVisibility,
  alignDiscriminatingEvidenceIdsWithSceneMapping,
  remapMissingDiscriminatingEvidenceIdsToExistingClues,
  synthesizeMissingDiscriminatingEvidenceClues,
  purgeUnmappableDiscriminatingEvidenceIds,
  synthesizeInferenceStepCoverageClues,
  checkInferencePathCoverage,
  selectDiscriminatingEvidenceCandidateIds,
  sanitizeEraTimeStyleInClues,
  checkCastNamePathConsistency,
  repairCastNamePathConsistency,
  repairInvalidSourcePaths,
  validateSourcePath,
  sanitizeRedHerringOverlap,
  synthesizeMissingCulpritDiscriminatingClues,
  pruneOverlappingRedHerrings,
  findRedHerringOverlapDetails,
  findRedHerringTrueSolutionOverlap,
};
