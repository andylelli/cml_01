/**
 * The pipeline's gates between stages: the novelty and fair-play binding gates (Pillar 3), the early
 * structural abort, and the pre-prose CML gate (evidence back-fill, discriminating test, critical coverage).
 * Moved from generateMystery (code review ORC-01 / CR-25); mystery-orchestrator.ts re-exports what it exported.
 */
import { BACKFILL_WEIGHTS, discriminatingTestTokens, scoreEvidenceCandidate } from "../clue-contracts/evidence-candidates.js";
import type { CaseData } from "@cml/cml";
import type {
  ClueDistributionResult,
  FairPlayAuditResult,
} from "@cml/prompts-llm";
import {
  getGenerationParams,
} from "@cml/story-validation";
import {
  type OrchestratorContext,
} from "../agents/index.js";

type FairPlayViolationLike = {
  severity?: string;
  rule?: string;
};

const canonicalizeTraceabilityClueId = (value: unknown): string => {
  const normalized = String(value ?? "").trim();
  return /^clue_[a-z0-9_-]+$/i.test(normalized) ? normalized : "";
};

const hasDeterministicPreTestTraceabilityBreak = (params: {
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): boolean => {
  const caseBlock = (params.cml as any)?.CASE ?? params.cml;
  const clueList = Array.isArray(params.clues?.clues) ? params.clues.clues : [];
  if (!caseBlock || clueList.length === 0) return false;

  const discriminatingScene = caseBlock?.prose_requirements?.discriminating_test_scene ?? {};
  const discriminatingAct = Number(discriminatingScene?.act_number);
  const discriminatingSceneNumber = Number(discriminatingScene?.scene_number);
  const hasDiscriminatingScene = Number.isFinite(discriminatingAct) && discriminatingAct > 0
    && Number.isFinite(discriminatingSceneNumber) && discriminatingSceneNumber > 0;

  const clueMap = new Map(
    clueList
      .map((clue: any) => [canonicalizeTraceabilityClueId(clue?.id), clue] as const)
      .filter(([clueId]) => clueId.length > 0),
  );
  const mappingById = new Map(
    ((caseBlock?.prose_requirements?.clue_to_scene_mapping ?? []) as any[])
      .map((entry) => ({
        clueId: canonicalizeTraceabilityClueId(entry?.clue_id),
        actNumber: Number(entry?.act_number),
        sceneNumber: Number(entry?.scene_number),
      }))
      .filter((entry) => entry.clueId.length > 0)
      .map((entry) => [entry.clueId, entry] as const),
  );

  const evidenceClueIds = ((caseBlock?.discriminating_test?.evidence_clues ?? []) as unknown[])
    .map((id) => canonicalizeTraceabilityClueId(id))
    .filter(Boolean);
  if (evidenceClueIds.length === 0) return true;

  for (const clueId of evidenceClueIds) {
    const clue = clueMap.get(clueId);
    if (!clue) return true;

    const criticality = String((clue as any)?.criticality ?? "").trim().toLowerCase();
    const placement = String((clue as any)?.placement ?? "").trim().toLowerCase();
    if (criticality !== "essential" || (placement !== "early" && placement !== "mid")) {
      return true;
    }

    const mapping = mappingById.get(clueId);
    if (!mapping) return true;
    if (!Number.isFinite(mapping.actNumber) || !Number.isFinite(mapping.sceneNumber)) return true;

    if (
      hasDiscriminatingScene
      && (mapping.actNumber > discriminatingAct
        || (mapping.actNumber === discriminatingAct && mapping.sceneNumber >= discriminatingSceneNumber))
    ) {
      return true;
    }
  }

  return false;
};

export const deriveStructuralBlockingFairPlayViolations = (params: {
  fairPlayAudit?: FairPlayAuditResult | null;
  coverageResult?: { hasCriticalGaps?: boolean; uncoveredSteps?: unknown[] } | null;
  allCoverageIssues?: Array<{ severity?: string; message?: string }> | null;
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): { blockingViolations: FairPlayViolationLike[]; downgradedLogicalDeducibility: boolean } => {
  const fairPlayAudit = params.fairPlayAudit;
  if (!fairPlayAudit || fairPlayAudit.overallStatus !== "fail") {
    return { blockingViolations: [], downgradedLogicalDeducibility: false };
  }

  const structurallyBlockingRules = new Set([
    "clue visibility",
    "logical deducibility",
    "no withholding",
  ]);

  const criticalViolations = (fairPlayAudit.violations ?? []).filter(
    (v) => String(v?.severity ?? "").toLowerCase() === "critical"
  );
  const candidateBlocking = criticalViolations.filter((v) =>
    structurallyBlockingRules.has(String(v?.rule ?? "").toLowerCase().trim())
  );

  const hasCoverageCorroboration = Boolean(
    params.coverageResult?.hasCriticalGaps
    || (params.coverageResult?.uncoveredSteps?.length ?? 0) > 0
    || (params.allCoverageIssues ?? []).some((issue) =>
      String(issue?.severity ?? "").toLowerCase() === "critical"
      && /inference step|discriminating test|suspect|elimination|coverage gap|uncovered/i.test(
        String(issue?.message ?? "")
      )
    )
  );

  const hasTraceabilityCorroboration = hasDeterministicPreTestTraceabilityBreak({
    cml: params.cml,
    clues: params.clues,
  });

  const logicalDeducibilityCorroborated = hasCoverageCorroboration || hasTraceabilityCorroboration;

  let downgradedLogicalDeducibility = false;
  const blockingViolations = candidateBlocking.filter((v) => {
    const rule = String(v?.rule ?? "").toLowerCase().trim();
    if (rule === "clue visibility" || rule === "no withholding") {
      return hasCoverageCorroboration || hasTraceabilityCorroboration;
    }
    if (rule !== "logical deducibility") return true;
    if (logicalDeducibilityCorroborated) return true;
    downgradedLogicalDeducibility = true;
    return false;
  });

  return { blockingViolations, downgradedLogicalDeducibility };
};

export const evaluateEarlyStructuralAbort = (params: {
  fairPlayAudit?: FairPlayAuditResult | null;
  coverageResult?: { hasCriticalGaps?: boolean; uncoveredSteps?: unknown[] } | null;
  allCoverageIssues?: Array<{ severity?: string; message?: string }> | null;
  cml?: CaseData | null;
  clues?: ClueDistributionResult | null;
}): {
  shouldAbort: boolean;
  reason?: string;
  blockingRules: string[];
  downgradedLogicalDeducibility: boolean;
} => {
  const fairPlayAudit = params.fairPlayAudit;
  if (!fairPlayAudit || fairPlayAudit.overallStatus !== "fail") {
    return {
      shouldAbort: false,
      blockingRules: [],
      downgradedLogicalDeducibility: false,
    };
  }

  const { blockingViolations, downgradedLogicalDeducibility } = deriveStructuralBlockingFairPlayViolations(params);
  const blockingRules = blockingViolations
    .map((violation) => String(violation?.rule ?? "").trim())
    .filter((rule) => rule.length > 0);

  if (blockingRules.length === 0) {
    return {
      shouldAbort: false,
      blockingRules: [],
      downgradedLogicalDeducibility,
    };
  }

  return {
    shouldAbort: true,
    reason:
      `Fair play audit failed with ${blockingRules.length} structural blocking violation(s): ` +
      blockingRules.join(", "),
    blockingRules,
    downgradedLogicalDeducibility,
  };
};

export function applyNoveltyBindingGate(ctx: OrchestratorContext) {
  if (ctx.inputs.enableBindingGates && ctx.noveltyAudit?.blocking) {
    if (!ctx.inputs.forceWarnings) {
      const errorMsg = `Binding gate: Agent 8 novelty audit is blocking (status: ${ctx.noveltyAudit.status}). ` +
        `Set forceWarnings: true to override.`;
      ctx.errors.push(errorMsg);
      throw new Error(errorMsg);
    } else {
      ctx.warnings.push(
        `Binding gate OVERRIDDEN (forceWarnings): Agent 8 novelty audit blocking — ` +
        `status: ${ctx.noveltyAudit.status}, highest similarity: ${ctx.noveltyAudit.highestSimilarity.toFixed(2)}, ` +
        `most similar: ${ctx.noveltyAudit.mostSimilarSeed}`
      );
    }
  }
}

export function applyFairPlayBindingGate(ctx: OrchestratorContext) {
  if (ctx.inputs.enableBindingGates && ctx.fairPlayAudit?.blocking) {
    if (!ctx.inputs.forceWarnings) {
      const errorMsg = `Binding gate: Agent 6 fair-play audit is blocking ` +
        `(overallStatus: ${ctx.fairPlayAudit.overallStatus}, violations: ${ctx.fairPlayAudit.violations.length}). ` +
        `Set forceWarnings: true to override.`;
      ctx.errors.push(errorMsg);
      throw new Error(errorMsg);
    } else {
      ctx.warnings.push(
        `Binding gate OVERRIDDEN (forceWarnings): Agent 6 fair-play audit blocking — ` +
        `overallStatus: ${ctx.fairPlayAudit.overallStatus}, violations: ${ctx.fairPlayAudit.violations.length}`
      );
    }
  }
}

export function applyEarlyStructuralAbort(ctx: OrchestratorContext) {
  const earlyStructuralAbort = evaluateEarlyStructuralAbort({
    fairPlayAudit: ctx.fairPlayAudit,
    coverageResult: ctx.coverageResult,
    allCoverageIssues: ctx.allCoverageIssues,
    cml: ctx.cml,
    clues: ctx.clues,
  });
  if (earlyStructuralAbort.shouldAbort) {
    const errorMsg = `CML validation failed before downstream profile generation:\n` +
      `  • ${earlyStructuralAbort.reason}\n\n` +
      `Fix CML structure before attempting downstream narrative/prose stages.`;
    ctx.errors.push(errorMsg);
    throw new Error(errorMsg);
  }
}

export function runCmlPreProseGate(ctx: OrchestratorContext) {
  const cmlValidationErrors: string[] = [];
  const cmlQualityConfig = (getGenerationParams().agent3_cml.params as any)?.quality ?? {};
  const evidenceBackfillThreshold = Math.max(
    0,
    Number(cmlQualityConfig.evidence_clue_backfill_threshold ?? 3)
  );
  const failOnBackfillThreshold = cmlQualityConfig.fail_when_backfill_exceeds_threshold !== false;
  let backfilledEvidenceClues: string[] = [];

  // Back-fill discriminating_test.evidence_clues from finalised clues if missing.
  // Agent 3 generates the CML skeleton before clues exist; we populate here.
  const discrimTestNode = (ctx.cml as any)?.CASE?.discriminating_test;
  if (discrimTestNode) {
    const currentEvidence = Array.isArray(discrimTestNode.evidence_clues)
      ? discrimTestNode.evidence_clues.map((id: unknown) => String(id))
      : [];
    // Filter to IDs that are actually distributed clues — do not use a regex pattern
    // because placeholder IDs like "clue_1" satisfy /^clue_[a-z0-9_-]+$/i and would
    // survive the filter, poisoning the final array with stale skeleton IDs.
    const distributedClueIds = new Set(ctx.clues!.clues.map((c) => String(c.id)));
    const canonicalExistingEvidence = currentEvidence.filter((id: string) => distributedClueIds.has(id));
    const testContextTokens = discriminatingTestTokens(discrimTestNode); // CR-16 (A5-03)

    const scoredEssential = ctx.clues!.clues
      .filter((c) => c.criticality === "essential")
      .map((c) => ({ id: String(c.id), score: scoreEvidenceCandidate(c, testContextTokens, BACKFILL_WEIGHTS) }))
      .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id));

    const maxBackfillIds = Math.max(1, evidenceBackfillThreshold);
    const targetedEssentialIds = scoredEssential
      .filter((entry) => entry.score > 0)
      .map((entry) => entry.id)
      .slice(0, maxBackfillIds);
    const fallbackEssentialIds = scoredEssential
      .map((entry) => entry.id)
      .slice(0, maxBackfillIds);
    const selectedEssentialIds = (targetedEssentialIds.length > 0 ? targetedEssentialIds : fallbackEssentialIds);

    backfilledEvidenceClues = selectedEssentialIds.filter(
      (id) => !canonicalExistingEvidence.includes(id)
    );
    if (backfilledEvidenceClues.length > 0) {
      discrimTestNode.evidence_clues = [...canonicalExistingEvidence, ...backfilledEvidenceClues];
      ctx.warnings.push(
        `CML gate: back-filled evidence_clues with ${backfilledEvidenceClues.length} clue(s): ${backfilledEvidenceClues.join(", ")}`
      );

      const backfillDiagnostic = {
        injected_count: backfilledEvidenceClues.length,
        injected_clues: backfilledEvidenceClues,
        threshold: evidenceBackfillThreshold,
        reason: "discriminating_test.evidence_clues missing essential clue IDs required for proof traceability",
      };

      if (ctx.enableScoring && ctx.scoreAggregator && ctx.scoringLogger) {
        ctx.scoringLogger.logPhaseDiagnostic(
          "agent3_cml",
          "CML Generation",
          "evidence_clue_backfill",
          backfillDiagnostic,
          ctx.runId,
          ctx.projectId || ""
        );
        ctx.scoreAggregator.upsertDiagnostic(
          "agent3_cml_evidence_clue_backfill",
          "agent3_cml",
          "CML Generation",
          "evidence_clue_backfill",
          backfillDiagnostic
        );
      }
    }

    if (failOnBackfillThreshold &&
      backfilledEvidenceClues.length > evidenceBackfillThreshold) {
      cmlValidationErrors.push(
        `Discriminating test evidence_clues required heavy backfill (${backfilledEvidenceClues.length} > threshold ${evidenceBackfillThreshold}). Injected clues: ${backfilledEvidenceClues.join(", ")}`
      );
    }
  }

  // Structurally breaking fair-play violations block prose generation.
  if (ctx.fairPlayAudit && ctx.fairPlayAudit.overallStatus === "fail") {
    const { blockingViolations, downgradedLogicalDeducibility } = deriveStructuralBlockingFairPlayViolations({
      fairPlayAudit: ctx.fairPlayAudit,
      coverageResult: ctx.coverageResult,
      allCoverageIssues: ctx.allCoverageIssues,
      cml: ctx.cml,
      clues: ctx.clues,
    });

    if (downgradedLogicalDeducibility) {
      ctx.warnings.push(
        "Fair-play: downgraded uncorroborated Logical Deducibility critical flag to warning because deterministic clue coverage shows no structural gaps"
      );
    }

    if (blockingViolations.length > 0) {
      cmlValidationErrors.push(
        `Fair play audit failed with ${blockingViolations.length} structural violation(s) ` +
        `(${blockingViolations.map((v) => v.rule).join(", ")}) — prose cannot realize a broken mystery`
      );
    } else {
      const nonStructuralCritical = ctx.fairPlayAudit.violations.filter(
        (v) => v.severity === "critical"
      );
      if (nonStructuralCritical.length > 0) {
        ctx.warnings.push(
          `Fair-play: ${nonStructuralCritical.length} non-structural violation(s) remain ` +
          `(${nonStructuralCritical
            .map((v) => v.rule)
            .join(", ")}) — mystery structure is sound, proceeding with prose`
        );
        // Downgrade from "fail" to "needs-revision" so the post-prose release gate
        // reflects the determined-sound verdict (score 70) rather than the LLM
        // auditor's raw "fail" (score 45 → hard-stop). The deterministic coverage
        // checks have already established there are no structural gaps.
        (ctx.fairPlayAudit as any).overallStatus = "needs-revision";
      }
    }
  }

  // Discriminating test must be fully specified.
  const discriminatingTest = (ctx.cml as any)?.CASE?.discriminating_test;
  if (!discriminatingTest || !discriminatingTest.design) {
    cmlValidationErrors.push(
      "Discriminating test design is missing - prose generator cannot create test scene"
    );
  }
  if (discriminatingTest &&
    (!discriminatingTest.evidence_clues || discriminatingTest.evidence_clues.length === 0)) {
    cmlValidationErrors.push(
      "Discriminating test has no evidence clues - prose cannot reference supporting evidence"
    );
  }

  // Critical clue coverage gaps block prose generation.
  if (ctx.coverageResult?.hasCriticalGaps) {
    const gapSummary: string[] = [];
    if (ctx.coverageResult.uncoveredSteps.length > 0) {
      gapSummary.push(
        `${ctx.coverageResult.uncoveredSteps.length} inference step(s) without sufficient clues`
      );
    }
    const allIssues = ctx.allCoverageIssues ?? [];
    const testIssues = allIssues.filter((i) => i.message.includes("discriminating test"));
    const eliminationIssues = allIssues.filter(
      (i) => i.message.includes("suspect") || i.message.includes("elimination")
    );
    if (testIssues.length > 0) gapSummary.push("discriminating test evidence incomplete");
    if (eliminationIssues.length > 0)
      gapSummary.push(`suspect elimination issues (${eliminationIssues.length})`);
    if (gapSummary.length > 0) {
      cmlValidationErrors.push(`Critical clue coverage gaps: ${gapSummary.join(", ")}`);
    }
  }

  if (cmlValidationErrors.length > 0) {
    const errorMsg = `CML validation failed before prose generation:\n` +
      cmlValidationErrors.map((e) => `  \u2022 ${e}`).join("\n") +
      `\n\nFix CML structure before attempting prose generation.`;
    ctx.errors.push(errorMsg);
    throw new Error(errorMsg);
  }
}
