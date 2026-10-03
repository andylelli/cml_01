/**
 * Agent 5's phase score. Moved from agent5-run.ts (code review A5-01 / CR-25).
 */
import { calculateGrade } from "@cml/story-validation";
import type { CoverageSnapshot } from "../../clue-contracts/contracts.js";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
} from "../shared.js";
import {
  Agent5Run,
  Agent5State,
} from "./run-state.js";

export async function scoreAgent5Phase(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult, clueGuardrails: { issues: ClueGuardrailIssue[]; fixes: string[]; hasCriticalIssues: boolean; }, finalCoverage: CoverageSnapshot) {
  if (ctx.enableScoring && ctx.scoreAggregator) {
    const guardrailTriggered = clueGuardrails.hasCriticalIssues;
    const coverageGapsFound = finalCoverage.coverageResult.hasCriticalGaps;
    const clueCount = clues.clues.length;
    const densityTargets: Record<typeof run.clueDensity, { min: number; max: number; }> = {
      minimal: { min: 5, max: 8 },
      moderate: { min: 8, max: 12 },
      dense: { min: 12, max: 18 },
    };
    const densityTarget = densityTargets[run.clueDensity];
    const clueCountScore = clueCount < densityTarget.min
      ? Math.round((clueCount / densityTarget.min) * 100)
      : clueCount <= densityTarget.max
        ? 100
        : Math.max(80, 100 - Math.round(((clueCount - densityTarget.max) / densityTarget.max) * 100));
    const guardrailScore = guardrailTriggered ? 75 : 100;
    const coverageScore = coverageGapsFound ? 75 : 100;
    const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
    const warningCount = finalCoverage.allCoverageIssues.filter((i) => i.severity === "warning").length;
    const retryPenalty = (state.performedCoverageRetry ? 10 : 0)
      + (state.performedSuspectRetry ? 8 : 0)
      + (state.performedRedHerringRetry ? 8 : 0);
    const qualityScore = Math.max(70, 100 - (warningCount * 6) - (clueGuardrails.fixes.length * 4));
    const consistencyScore = Math.max(70, 100 - retryPenalty);
    const clueTotal = Math.round(
      clueValidation * 0.35
      + qualityScore * 0.25
      + clueCountScore * 0.2
      + consistencyScore * 0.2
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
        grade: calculateGrade(clueTotal),
        passed: clueTotal >= 75,
        tests: [
          {
            name: "Clue count",
            category: "completeness" as const,
            passed: clueCount >= densityTarget.min,
            score: clueCountScore,
            weight: 1.5,
            message: `${clueCount} clues distributed (target ${densityTarget.min}-${densityTarget.max} for ${run.clueDensity})`,
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
            message: `Retry penalty=${retryPenalty} (coverage retry=${state.performedCoverageRetry}, suspect retry=${state.performedSuspectRetry}, red-herring retry=${state.performedRedHerringRetry})`,
          },
        ],
      },
      ctx.agentDurations["agent5_clues"] ?? 0,
      ctx.agentCosts["agent5_clues"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }
}
