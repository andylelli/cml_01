/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */

import { isChronologyEnabled as isA90ChronologyEnabled, deriveCaseChronology, findUnanchoredClockValues, summariseChronology } from "@cml/cml";
import { extractClues } from "@cml/prompts-llm";
import { strictPromptContractsEnabled } from "./agent5/contract-payload.js";
import { Agent5GateError, classifyAgent5Failure, type Agent5Gate } from "./agent5/gate-error.js";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
// ONE clock parser. This file used to keep a private third copy; see parseFactClockMinutes.
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
  applyClueGuardrails,
} from "./shared.js";
import {
  CANONICAL_CLUE_ID_RE,
  analyzeSuspectCoverage,
  buildCoverageSnapshot as buildAgentCoverageSnapshot,
  buildStrictPromptFeedback,
  checkCastNamePathConsistency,
  checkDiscriminatingTestReachability,
  checkInferencePathCoverage,
  checkMechanismVisibility,
  checkModelAuditConsistency,
  checkSourcePathValidity,
  enforceAgent5DeterministicContracts,
  findRedHerringOverlapDetails,
  findRedHerringTrueSolutionOverlap,
  getCanonicalEvidenceClueIds,
  getCaseBlock,
  reconcileModelAudit,
  repairCastNamePathConsistency,
  repairInvalidSourcePaths,
  sanitizeEraTimeStyleInClues,
  synthesizeMissingCulpritDiscriminatingClues,
  synthesizeMissingDiscriminatingEvidenceClues,
  validateSourcePath,
} from "../clue-contracts/contracts.js";
import {
  Agent5Run,
  Agent5State,
  buildAgent5ProactiveFirstPassFeedback,
} from "./agent5/run-state.js";
import {
  extractInitialClues,
  repairAfterFirstGuardrailPass,
  retryForInferenceCoverage,
} from "./agent5/extraction.js";
import {
  enforceRedHerringFloorKeepingCoverage,
  enforceSuspectCoverage,
  pruneOverlappingRedHerrings,
  sanitizeRedHerringOverlap,
  separateRedHerringsFromSolution,
} from "./agent5/coverage-retries.js";
import { topUpRedHerringsAfterSeparation } from "./agent5/red-herring-topup.js";
import {
  applyFinalCoverageRepairAndGate,
  purgeUnmappableDiscriminatingEvidenceIds,
  remapMissingDiscriminatingEvidenceIdsToExistingClues,
  remediateDiscriminatingEvidence,
  runDeterministicClueChecks,
  selectDiscriminatingEvidenceCandidateIds,
  synthesizeInferenceStepCoverageClues,
} from "./agent5/evidence-remediation.js";
import {
  scoreAgent5Phase,
} from "./agent5/score.js";
// Re-exported so existing importers of this module keep their path.
export {
  assessRedHerringFloor,
} from "./agent5/coverage-retries.js";
// Re-exported so existing importers of this module keep their path.
export {
  buildStrictPromptFeedback,
  enforceAgent5DeterministicContracts,
  findLockedFactClueTimeConflicts,
  recomputeCoverageSnapshotForAgent6,
  repairLockedFactClueTimeTranspositions,
} from "../clue-contracts/contracts.js";

// A5-06 (R1): the message classifier moved to agent5/gate-error.ts, beside the typed gate error that
// now carries the gate; labels are unchanged (see AGENT5_GATE_LABEL).

// strictPromptContractsEnabled moved to agent5/contract-payload.ts (A5-11 / A5-D04) so Agent 6's
// regenerations read the same switch.

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
        .map((entry) => String(entry?.clue_id ?? "").trim())
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


// ============================================================================
// WP4: Inference Path Coverage Helpers (agent-5 only)
// ============================================================================

// ============================================================================
// runAgent5
// ============================================================================

export async function runAgent5(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("clues", "Extracting and organizing clues...", 50);

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
  // A5-01: the retry flags every phase below may set — one mutable object, so a phase can set them.
  const state: Agent5State = { agent5RetryInvoked: false, extractionAttempt: 1, performedSuspectRetry: false, performedRedHerringRetry: false, performedCoverageRetry: false };
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

  const failAgent5 = (message: string, gate?: Agent5Gate): never => {
    ctx.agent5FirstPassPassed = false;
    ctx.agent5RetryInvoked = state.agent5RetryInvoked;
    ctx.agent5FailureClass = classifyAgent5Failure(message, gate);
    recordHardFailPhaseScore(message);
    // A5-06 (R1): typed when the site names its gate; same message, same Error name.
    throw gate ? new Agent5GateError(gate, message) : new Error(message);
  };

  const extractWithAttempt = (payload: any) =>
    extractClues(ctx.client, {
      ...payload,
      retryAttempt: state.extractionAttempt++,
    });

  // A5-01: what every phase below reads besides ctx and the clues — resolved once, read-only.
  const run: Agent5Run = { clueDensity, strictPromptFeedbackBase, proactiveFirstPassFeedback, mergeStrictPromptFeedback, cluesStart, recordHardFailPhaseScore, failAgent5, extractWithAttempt };
  let clues = await extractInitialClues(ctx, run, state);

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

  ({ clueGuardrails, clues } = await repairAfterFirstGuardrailPass(ctx, run, state, clues, clueGuardrails, sourcePathSnapshot));

  // ── WP4: Inference Path Coverage Gate ─────────────────────────────────────
  const buildCoverageSnapshot = (activeClues: ClueDistributionResult) =>
    buildAgentCoverageSnapshot(ctx.cml!, activeClues, { mechanismVisibility: false });

  const initialCoverage = buildCoverageSnapshot(clues);
  const coverageResult = initialCoverage.coverageResult;
  const allCoverageIssues: ClueGuardrailIssue[] = initialCoverage.allCoverageIssues;
  allCoverageIssues.forEach((issue) =>
    ctx.warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`)
  );


  const falseAssumptionIssues = initialCoverage.falseAssumptionIssues;
  const discrimTestIssues = initialCoverage.discrimTestIssues;

  clues = await retryForInferenceCoverage(ctx, run, state, clues, coverageResult, falseAssumptionIssues, discrimTestIssues, allCoverageIssues);

  // ── FIX-J: Per-suspect clue coverage gate ─────────────────────────────────
  // Every eligible non-culprit suspect must have at least one clue referencing
  // them by name. If the coverage retry didn't address this, regenerate with
  // targeted suspect-coverage feedback before committing to ctx.clues.
  clues = await enforceSuspectCoverage(ctx, run, state, clues);

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
  // A5-D05 (owner decision 12, CML_VERIFIED_FIXES): the wrapper re-runs suspect coverage when the floor
  // regenerated the clue set (OFF: exactly enforceRedHerringFloor).
  clues = await enforceRedHerringFloorKeepingCoverage(ctx, run, state, clues);

  // Red-herring separation hardening: if a red herring semantically overlaps with
  // true-solution correction language, run one bounded regeneration pass and hard-fail
  // if overlap still persists.
  clues = await separateRedHerringsFromSolution(ctx, run, state, clues);

  // A5-Q04 (AGENT5_RED_HERRING_TOPUP, default OFF): red herrings are lost to the separation above, not to
  // the model, so the repair sits after it — one targeted call for the missing ones only. OFF: no-op.
  clues = await topUpRedHerringsAfterSeparation(ctx, run, state, clues);

  const hardLogicLockedFacts = runDeterministicClueChecks(ctx, run, clues);

  let finalCoverage = buildCoverageSnapshot(clues);

  ({ clues, finalCoverage } = await remediateDiscriminatingEvidence(ctx, run, state, clues, finalCoverage, buildCoverageSnapshot));

  // RC3.1 (A_61 Phase 2a): repair-not-abort — synthesise a covering clue for any inference step still
  // uncovered after retries, so an uncovered-by-the-LLM step does not hard-kill the run (run bfmz7izf6).
  // Runs before the deterministic contracts so they validate the synthesised clues, and before the hard
  // gate so a coverable step no longer aborts. A step with an empty observation stays uncovered → the
  // hard gate still fires (correct: nothing to plant).
  finalCoverage = applyFinalCoverageRepairAndGate(ctx, run, clues, finalCoverage, buildCoverageSnapshot, hardLogicLockedFacts);

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
  await scoreAgent5Phase(ctx, run, state, clues, clueGuardrails, finalCoverage);

  ctx.agent5FirstPassPassed = !state.agent5RetryInvoked;
  ctx.agent5RetryInvoked = state.agent5RetryInvoked;
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

