/**
 * Agent 6: Fair Play Auditor
 *
 * Extracted from mystery-orchestrator.ts. Runs auditFairPlay() with one
 * clue-regen retry, then WP5B (blind reader simulation) and WP6B (CML
 * structural revision on critical failures). May mutate ctx.cml and ctx.clues.
 * Writes ctx.fairPlayAudit and ctx.hasCriticalFairPlayFailure.
 */

import { calculateGrade } from "@cml/story-validation";
import { CANONICAL_CLUE_ID_RE } from "@cml/cml";
import { envOn } from "../env-flags.js";
import {
  auditFairPlay,
  extractClues,
  blindReaderSimulation,
} from "@cml/prompts-llm";
import type { FairPlayAuditResult, StructuralAuditResult, BlindReaderResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { verifiedFixesEnabled } from "@cml/cml";
import { buildAgent5RegenerationContract, currentAgent5StrictBase } from "./agent5/contract-payload.js";
// X33 — the one class of failure a fair-play read may survive: the provider refusing the premise.
import { isContentFilterRefusal } from "@cml/llm-client";
import { getGenerationParams, validateGenreStructure, type TestResult } from "@cml/story-validation";
import {
  type OrchestratorContext,
  clearWarningsInPlace,
  preAgent9LlmRetriesEnabled,
} from "./shared.js";
import {
  classifyFairPlayFailure,
  shouldEscalateStructuralCmlRevision,
} from "./agent6-escalation-policy.js";
import {
  Agent6Run,
  Agent6State,
} from "./agent6/run-state.js";
import {
  applyAgent5ContractsToRegeneratedClues,
  buildFairPlayFeedbackPayload,
  deriveRequiredCluePhrases,
  ensureCriticalFairPlayBackstopClues,
  ensureParityBridgeClue,
  refreshCoverageOnContext,
} from "./agent6/retry-contract.js";
import {
  applyPreAuditFixes,
  handleFairPlayFailure,
  runFairPlayAuditLoop,
} from "./agent6/audit-loop.js";
import {
  deriveEffectiveCastNamesForStructuralRevision,
  hasCriticalFairPlayViolations,
  retryCmlOnStructuralFailure,
} from "./agent6/structural-retry.js";
import {
  runPrimaryBlindReadPhase,
} from "./agent6/blind-read.js";
import {
  runRevealGate,
} from "./agent6/reveal-gate.js";
// Re-exported so existing importers of this module keep their path.
export {
  runDeterministicStructuralAudit,
} from "./agent6/retry-contract.js";

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

// ============================================================================
// Deterministic Structural Audit (Phase 2 — runs BEFORE any LLM call)
// ============================================================================

const canonicalizeClueId = (value: unknown): string => {
  const normalized = String(value ?? "").trim();
  return CANONICAL_CLUE_ID_RE.test(normalized) ? normalized : "";
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
const isDtEvidenceCompletenessEnabled = () => envOn("AGENT6_DT_EVIDENCE_COMPLETENESS");
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

/**
 * Owner decision 7 (A6-D01): what each Agent 6 retry cost. `summary` is the client's cumulative cost per
 * label. The baseline starts at the summary when the meter is made; `perCallCostDelta(label, cumulative)`
 * charges the rise since the label's baseline and moves it; `rebaseCost(label)` moves it without charging,
 * after a call that is not a retry.
 */
export function createRetryCostMeter(summary: () => Record<string, number>) {
  const costBaseline: Record<string, number> = { ...summary() };
  const perCallCostDelta = (costKey: string, cumulativeCost: number): number => {
    const c = Number.isFinite(cumulativeCost) ? cumulativeCost : 0;
    const delta = Math.max(0, c - (costBaseline[costKey] ?? 0));
    costBaseline[costKey] = c;
    return delta;
  };
  const rebaseCost = (costKey: string): void => { costBaseline[costKey] = Number(summary()[costKey] ?? 0) || 0; };
  return { perCallCostDelta, rebaseCost };
}

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
    // "persistent-risk": pushed to ctx.warnings above and nowhere else (its Set was write-only — A6-14).
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
    clearWarningsInPlace(ctx.warnings, toClear);
  };

  const fairPlayConfig = getGenerationParams().agent6_fairplay.params;
  const MAX_FAIR_PLAY_RETRY_COST = fairPlayConfig.retries.max_retry_cost_usd;
  const retryBudget = createFairPlayRetryBudgetTracker(MAX_FAIR_PLAY_RETRY_COST);

  // A_53 P3 (cost double-count): every `result.cost` is the CUMULATIVE byAgent run-total, so the budget is
  // charged the PER-CALL delta. Owner decision 7 (2026-10-01, A6-D01): the delta used to start from the
  // cost source's FIRST OBSERVATION — which happens after the first retry returns — so the first retry of
  // each source was charged 0. The baseline is now the cost tracker's figure when the budget is created
  // (Agent 5 and Agent 4 spent their non-retry calls before Agent 6), re-taken after each of Agent 6's own
  // non-retry calls (the first fair-play audit, the primary and reveal-gate blind reads). Every retry is
  // charged its own cost, the first included, so the budget means what its number says. This can newly trip
  // the $0.15 budget on a run that retried — the decision accepted that.
  const { perCallCostDelta, rebaseCost } = createRetryCostMeter(
    () => (ctx.client as any)?.getCostTracker?.()?.getSummary?.()?.byAgent ?? {},
  );
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

  // CR-25: the flags every phase below may set — one mutable object, so a phase can set them.
  const state: Agent6State = { fairPlayAudit: null, fairPlayAuditCostDuringLoop: 0, fairPlayAttempt: 0, emittedFinalCriticalFailureSummary: false, agent6RetryInvoked: false, firstFairPlayStatus: null, agent6FailureClass: "none" };
  const fairPlayStart = Date.now();
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

  // CR-25: what every phase below reads besides ctx — resolved once, read-only.
  const run: Agent6Run = { retriesEnabled, emitAgent6Warning, clearWarningsFromSet, transientProgressWarnings, transientDiagnosticWarnings, fairPlayConfig, retryBudget, perCallCostDelta, rebaseCost, minBlindConfidence, maxBlindRemediationCycles, maxFairPlayAttempts, maxTargetedRegenAttempts, clueDensity, fairPlayStart, auditCurrentFairPlay };

  // ── Phase 2: pre-LLM deterministic fixes + structural audit ─────────────────
  // Run backstops BEFORE the LLM call so the LLM audits the already-patched state.
  // The LLM is then responsible only for narrative quality, not structural verification.
  let preAuditStructuralResult: StructuralAuditResult | undefined;

  preAuditStructuralResult = applyPreAuditFixes(ctx, run, preAuditStructuralResult);

  await runFairPlayAuditLoop(ctx, run, state, preAuditStructuralResult);

  if (!state.fairPlayAudit) throw new Error("Fair play audit failed to produce a report");

  ctx.agentCosts["agent6_fairplay"] =
    state.fairPlayAuditCostDuringLoop; // A_53 P3: final cumulative byAgent total — overwrite, not +=
  ctx.agentDurations["agent6_fairplay"] =
    (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - run.fairPlayStart);

  const criticalFairPlayRules = ctx.criticalFairPlayRules;
  let hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(state.fairPlayAudit, criticalFairPlayRules);

  handleFairPlayFailure(run, state, hasCriticalFairPlayFailure);

  ctx.reportProgress("fairplay", `Fair play audit: ${state.fairPlayAudit.overallStatus}`, 75);

  // FP-1: extracted as async closure so it can be called after each fairPlayAudit reassignment
  const recordFairPlayScore = async () => {
    if (!ctx.enableScoring || !ctx.scoreAggregator || !state.fairPlayAudit) return;
    const fpStatus = state.fairPlayAudit.overallStatus;
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
        grade: calculateGrade(fpValidation),
        passed: fpValidation >= 75,
        failure_reason:
          fpStatus === "fail"
            ? `Fair play audit failed (${state.fairPlayAudit.violations.length} violation(s))`
            : undefined,
        tests: [
          {
            name: "Overall fair play status",
            category: "validation" as const,
            passed: fpStatus === "pass",
            score: fpValidation,
            weight: 2,
            message: `Status: ${fpStatus}${state.fairPlayAudit.violations.length > 0 ? ` (${state.fairPlayAudit.violations.length} violation(s))` : ""}`,
          },
          ...state.fairPlayAudit.violations.map((v) => ({
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
        (CONFIDENCE_RANK[run.minBlindConfidence] ?? CONFIDENCE_RANK.likely)
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

  /**
   * X33 — an Azure content-filter refusal here used to abort the whole run.
   *
   * FOUND BY THE N7 RUN, 2026-08-14. The blind-reader prompt carries the case's own death method; on
   * a story whose method was a stabbing, Azure refused it (`ResponsibleAIPolicyViolation`,
   * violence/medium) and the throw propagated out of Agent 6, killing a paid run at the fair-play
   * stage — before Agent 9, before anything the run was bought to measure.
   *
   * A_71 measured this refusal class on Agent 9's regens and recorded that "the never-abort gate held
   * and the story shipped"; that gate does not exist here. The refusal is not retryable (the same
   * prompt earns the same refusal), so the honest degradation is the one §13.3 keeps insisting on:
   * the blind read is NOT MEASURED — not passed, not failed — and the pipeline continues. Every other
   * fair-play check is deterministic and unaffected.
   *
   * Narrow on purpose: only a content-filter refusal is swallowed. Any other error still propagates,
   * because "the model is down" and "the model refused this premise" are different facts.
   */
  let primaryBlindRead: BlindReaderResult | null = null;
  const blindReadEligible =
    castNamesForBlind.length > 0 && Boolean(falseAssumptionStatement) && Boolean(actualCulpritName);
  primaryBlindRead = await runPrimaryBlindReadPhase(ctx, blindReadEligible, primaryBlindRead, runPrimaryBlindRead, falseAssumptionStatement, castNamesForBlind);
  run.rebaseCost("Agent6-BlindReader"); // owner decision 7: the primary read is not a retry

  if (blindReadEligible && primaryBlindRead) {
    const blindResult = primaryBlindRead;

    ctx.agentCosts["agent6_blind_reader"] = blindResult.cost;
    ctx.agentDurations["agent6_blind_reader"] = blindResult.durationMs;

    const readerGotItRight =
      blindResult.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
      actualCulpritName.toLowerCase().includes(blindResult.suspectedCulprit.toLowerCase());

    const blindPasses =
      readerGotItRight &&
      (CONFIDENCE_RANK[normalizeConfidence(blindResult.confidenceLevel)] ?? -1) >=
        (CONFIDENCE_RANK[run.minBlindConfidence] ?? CONFIDENCE_RANK.likely);

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

      for (let cycle = 1; !latestReaderPass && cycle <= run.maxBlindRemediationCycles; cycle++) {
        state.agent6RetryInvoked = true;
        const missingCategories = classifyMissingInfoCategories(latestBlind.missingInformation);
        ctx.warnings.push(
          `CRITICAL: Blind reader gate failed (cycle ${cycle}/${run.maxBlindRemediationCycles}). Regenerating clues with targeted requirements.`
        );

        ctx.reportProgress("clues", "Regenerating clues based on blind reader feedback...", 60);
        const blindRetryStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity: run.clueDensity,
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
          // A5-11 / A5-D04 (owner decision 12, CML_VERIFIED_FIXES): the strict contract and locked facts
          // Agent 5's first pass sends, which this regeneration used to omit.
          ...(verifiedFixesEnabled() ? buildAgent5RegenerationContract(ctx, currentAgent5StrictBase(ctx)) : {}),
        });

        ctx.agentCosts["agent5_clues"] =
          ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - blindRetryStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "blind-reader remediation");
        run.retryBudget.consume(run.perCallCostDelta("Agent5-Clues", ctx.clues.cost),`blind-reader clue remediation cycle ${cycle}`);

        const blindReAuditStart = Date.now();
        state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - blindReAuditStart);
        run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", state.fairPlayAudit.cost),`blind-reader fair-play re-audit cycle ${cycle}`);
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(state.fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();

        /**
         * X33, COMPLETED — this fix stopped two functions short of its own class.
         *
         * The primary read above was guarded when a content-filter refusal killed a paid run at this
         * stage. These remediation re-reads are the same call with the same prompt carrying the same
         * case, and they were left bare: a premise Azure refuses once it refuses every time, so the
         * refusal that the primary read now survives would abort the run here instead — on the very
         * path taken when the gate has already failed. Same shape as X28, where an idiom fix stopped
         * one function short of the sibling comparison.
         *
         * A refused re-read means the cycle cannot be measured, so the loop stops with what it has
         * rather than throwing away the run.
         */
        try {
          latestBlind = await blindReaderSimulation(
            ctx.client,
            ctx.clues as any,
            falseAssumptionStatement,
            castNamesForBlind,
            { runId: ctx.runId, projectId: ctx.projectId || "" }
          );
        } catch (err) {
          if (!isContentFilterRefusal(err)) throw err;
          ctx.warnings.push(
            `[Agent 6] blind-reader remediation cycle ${cycle} NOT MEASURED — Azure refused the prompt ` +
              `(content filter). The loop stops here with the previous verdict; the run continues.`,
          );
          break;
        }
        ctx.agentCosts["agent6_blind_reader"] =
          latestBlind.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;
        run.retryBudget.consume(run.perCallCostDelta("Agent6-BlindReader", latestBlind.cost),`blind-reader simulation cycle ${cycle}`);

        const latestGotItRight =
          latestBlind.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
          actualCulpritName.toLowerCase().includes(latestBlind.suspectedCulprit.toLowerCase());
        latestReaderPass =
          latestGotItRight &&
          (CONFIDENCE_RANK[normalizeConfidence(latestBlind.confidenceLevel)] ?? -1) >=
            (CONFIDENCE_RANK[run.minBlindConfidence] ?? CONFIDENCE_RANK.likely);

        if (latestReaderPass) {
          ctx.reportProgress("fairplay", "Blind reader simulation: PASS after remediation", 74);
        }
      }

      if (!latestReaderPass && run.maxBlindRemediationCycles === 0) {
        state.agent6RetryInvoked = true;
        ctx.warnings.push(
          "Agent 6 blind-reader deterministic rescue: retries disabled; applying deterministic clue-contract hardening before final blind-reader check.",
        );

        applyAgent5ContractsToRegeneratedClues(ctx, "blind-reader deterministic rescue");

        /**
         * X33, COMPLETED (2 of 2) — the deterministic-rescue re-check, which is NOT in the loop.
         *
         * The primary read above was guarded when a content-filter refusal killed a paid run at this
         * stage. These remediation re-reads are the same call with the same prompt carrying the same
         * case, and they were left bare: a premise Azure refuses once it refuses every time, so the
         * refusal that the primary read now survives would abort the run here instead — on the very
         * path taken when the gate has already failed. Same shape as X28, where an idiom fix stopped
         * one function short of the sibling comparison.
         *
         * There is no cycle to break out of here: a refusal means the re-check did not happen and
         * the PREVIOUS verdict stands. The lines below recompute from `latestBlind`, which still holds
         * it — an unmeasured re-check must never read as a passing one.
         */
        try {
          latestBlind = await blindReaderSimulation(
            ctx.client,
            ctx.clues as any,
            falseAssumptionStatement,
            castNamesForBlind,
            { runId: ctx.runId, projectId: ctx.projectId || "" }
          );
          // Inside the try on purpose: a refused call has no cost and no duration to record, and
          // re-adding the previous read's numbers would inflate both.
          ctx.agentCosts["agent6_blind_reader"] =
            latestBlind.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
          ctx.agentDurations["agent6_blind_reader"] =
            (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;
        } catch (err) {
          if (!isContentFilterRefusal(err)) throw err;
          ctx.warnings.push(
            `[Agent 6] blind-reader rescue re-check NOT MEASURED — Azure refused the prompt (content ` +
              `filter). The verdict from before the rescue stands, unchanged; the run continues.`,
          );
        }

        const latestGotItRight =
          latestBlind.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
          actualCulpritName.toLowerCase().includes(latestBlind.suspectedCulprit.toLowerCase());
        latestReaderPass =
          latestGotItRight &&
          (CONFIDENCE_RANK[normalizeConfidence(latestBlind.confidenceLevel)] ?? -1) >=
            (CONFIDENCE_RANK[run.minBlindConfidence] ?? CONFIDENCE_RANK.likely);

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
          `(culprit=${actualCulpritName}, minConfidence=${run.minBlindConfidence}).`;
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
  ({ preAuditStructuralResult, hasCriticalFairPlayFailure } = await retryCmlOnStructuralFailure(ctx, run, state, preAuditStructuralResult, hasCriticalFairPlayFailure, MAX_FAIR_PLAY_RETRY_COST, criticalFairPlayRules, recordFairPlayScore));

  run.clearWarningsFromSet(run.transientProgressWarnings);
  if (state.fairPlayAudit!.overallStatus === "pass" || state.emittedFinalCriticalFailureSummary) {
    run.clearWarningsFromSet(run.transientDiagnosticWarnings);
  }

  refreshCoverageOnContext(ctx);

  ctx.agent6FirstPassPassed = state.firstFairPlayStatus === "pass";
  ctx.agent6RetryInvoked = state.agent6RetryInvoked;
  ctx.agent6FailureClass = state.fairPlayAudit!.overallStatus === "pass"
    ? "none"
    : state.agent6FailureClass === "none"
      ? "unclassified"
      : state.agent6FailureClass;

  // SWEEP A: Golden Age genre-structure check (false solution, ≥2 resolved red herrings,
  // closed circle contains the culprit). Emitted as warnings so it surfaces in the report
  // without hard-aborting legacy runs; promote to a binding gate once generations reliably
  // populate these fields on the premium model tier.
  if (ctx.cml) {
    const genre = validateGenreStructure(ctx.cml);
    genre.errors.forEach((e) => run.emitAgent6Warning(`Genre structure: ${e}`, "persistent-risk"));
    genre.warnings.forEach((w) => run.emitAgent6Warning(`Genre structure: ${w}`, "transient-diagnostic"));
  }

  ctx.fairPlayAudit = state.fairPlayAudit!;
  ctx.hasCriticalFairPlayFailure = hasCriticalFairPlayFailure;

  // ── P2.1: Reveal gate (T2.1 fooled-then-convinced, T2.2 herring→culprit, T2.3 death-method) ──
  // Default OFF (AGENT6_REVEAL_GATE unset) ⇒ this block is skipped entirely and behaviour is
  // byte-identical. shadow ⇒ surface findings as warnings only; enforce ⇒ also mark the audit
  // blocking (routed through the existing binding gate, which respects forceWarnings) — it NEVER
  // throws on its own (see MEMORY: no-backstop gates kill runs).
  await runRevealGate(ctx, run, state, castNamesForBlind, actualCulpritName, falseAssumptionStatement, caseBlockForBlind);

  // Pillar 3 (Unit 3.3): flag blocking when gate is active and fair-play did not pass.
  // Covers both "fail" and "needs-revision" — earlyStructuralAbort follows and may also throw.
  if (ctx.inputs.enableBindingGates && ctx.fairPlayAudit.overallStatus !== "pass") {
    ctx.fairPlayAudit = { ...ctx.fairPlayAudit, blocking: true };
  }
}

