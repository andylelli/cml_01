/**
 * Agent 6 phase: classify and report a structural fair-play failure (WP6B + WP8). Moved from agent6-run.ts
 * (code review A6-01 / CR-25).
 *
 * Owner decision A6-Q01 (2026-10-02): the structural CML revision (Agent 4), the clue_only targeted
 * regeneration and the WP8A backstop re-audit ran only under AGENT_PRE9_ENABLE_LLM_RETRIES — 0 of 70
 * archived runs — and are retired. What remains is exactly what the default path ran: the gap and
 * failure-class reporting.
 */
import type { FairPlayAuditResult, StructuralAuditResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import { isCriticalFairPlayViolation } from "../context.js";
import {
  classifyFairPlayFailure,
  shouldEscalateStructuralCmlRevision,
} from "../agent6-escalation-policy.js";
import {
  Agent6Run,
  Agent6State,
} from "./run-state.js";
import {
  refreshCoverageOnContext,
} from "./retry-contract.js";

export const hasCriticalFairPlayViolations = (
  fairPlayAudit: FairPlayAuditResult,
  criticalFairPlayRules: ReadonlySet<string>,
): boolean => {
  const violations = Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [];
  // A6-08 (R1): the one predicate; case-sensitive exactly as `.has(v.rule)` was.
  return violations.some((v) => isCriticalFairPlayViolation(v, criticalFairPlayRules));
};

export const deriveEffectiveCastNamesForStructuralRevision = (ctx: OrchestratorContext): string[] => {
  const caseBlock = (ctx.cml as any)?.CASE ?? ctx.cml ?? {};
  const cmlCastNames = (Array.isArray(caseBlock?.cast) ? caseBlock.cast : [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
  if (cmlCastNames.length > 0) return cmlCastNames;

  return (ctx.cast?.cast?.characters ?? [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
};

export function reportStructuralFailure(ctx: OrchestratorContext, run: Agent6Run, state: Agent6State, preAuditStructuralResult: StructuralAuditResult | undefined, hasCriticalFairPlayFailure: boolean, criticalFairPlayRules: ReadonlySet<string>): void {
  const hasRealStructuralGaps = preAuditStructuralResult
    ? !preAuditStructuralResult.passed
    : (state.fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure);

  if (hasRealStructuralGaps) {
    if (!preAuditStructuralResult?.passed && preAuditStructuralResult) {
      // Structural gaps confirmed deterministically — log them
      const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
      run.emitAgent6Warning(
        `Fair-play: structural gaps confirmed by deterministic audit: ${gapSummary}`,
        "transient-diagnostic"
      );
    } else if (state.fairPlayAudit!.overallStatus !== "fail") {
      // LLM passed but we still have structural gaps from pre-audit — this path should be rare
      run.emitAgent6Warning(
        "Fair-play: LLM narrative audit passed but deterministic structural gaps remain — escalating CML revision",
        "persistent-risk"
      );
    }

    refreshCoverageOnContext(ctx);
    const failureClass = classifyFairPlayFailure(ctx.coverageResult!, state.fairPlayAudit, ctx.cml!);
    state.agent6FailureClass = failureClass;
    const shouldEscalateCmlRevision = shouldEscalateStructuralCmlRevision({
      failureClass,
      fairPlayAudit: state.fairPlayAudit,
      structuralAuditResult: preAuditStructuralResult,
    });

    const effectiveCastNames = deriveEffectiveCastNamesForStructuralRevision(ctx);

    const effectiveHardLogicDirectives = ctx.hardLogicDirectives
      || ctx.initialHardLogicDirectives
      || {
      complexityLevel: "medium",
      mechanismFamilies: ["physical-constraint proof"],
      hardLogicModes: ["fair-play chain"],
      difficultyMode: "moderate",
    };

    const canRunStructuralCmlRevision = !!ctx.cml
      && effectiveCastNames.length > 0
      && Array.isArray(effectiveHardLogicDirectives.mechanismFamilies)
      && Array.isArray(effectiveHardLogicDirectives.hardLogicModes);

    if (shouldEscalateCmlRevision && !canRunStructuralCmlRevision) {
      run.emitAgent6Warning(
        `Fair play failure classified as "${failureClass}" but structural CML retry was skipped: missing hydrated upstream context (setting/cast/hard logic/background).`,
        "persistent-risk"
      );
    }

    // WP8A: log remaining failures
    if (state.fairPlayAudit!.overallStatus === "fail") {
      const criticalViolations = state.fairPlayAudit!.violations
        .filter((v) => isCriticalFairPlayViolation(v, criticalFairPlayRules)) // A6-08 (R1)
        .map((v) => `${v.rule}: ${v.description}`)
        .join("; ");
      if (criticalViolations) {
        run.emitAgent6Warning(
          `Fair play: critical failures persist after all retries: ${criticalViolations}`,
          "persistent-risk"
        );
        state.emittedFinalCriticalFailureSummary = true;
      }
    }
  }
}
