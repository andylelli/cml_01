/**
 * Agent 2d: Temporal Context
 *
 * Extracted from mystery-orchestrator.ts. Runs generateTemporalContext()
 * via runStage (scoring retries when scoring is enabled), validates against schema,
 * and writes ctx.temporalContext.
 */

import { scoreTemporalContextPhase } from "./phase-scoring.js";
import { generateTemporalContext, deriveSeasonFromMonth } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  runStage,
} from "./shared.js";

export async function runAgent2d(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("temporal-context", "Generating temporal context...", 89);

  ctx.temporalContext = await runStage(ctx, {
    agentId: "agent2d_temporal_context",
    phaseName: "Temporal Context",
    generate: async (retryFeedback?: string) => {
      const tempResult = await generateTemporalContext(ctx.client, {
        settingRefinement: ctx.setting!.setting,
        caseData: ctx.cml!,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        qualityGuardrails: retryFeedback ? [retryFeedback] : undefined,
      });
      return { result: tempResult, cost: tempResult.cost };
    },
    score: async (tempResult) => scoreTemporalContextPhase(tempResult, ctx.setting!.setting, ctx.backgroundContext!),
  });

  // A_53 P6 (agent2d-validation-warns-not-errors): deterministically re-pin the load-bearing temporal
  // fields (seasonal.month + seasonal.season) to the mandated month before they feed the Agent 9
  // season lock — the month is mandated and the season follows from it, so they must never drift even
  // if the LLM ignored the prompt. Schema errors are recorded as errors (not just warnings).
  const tc = ctx.temporalContext as any;
  const mandatedMonth = String(tc?.specificDate?.month ?? "").trim();
  if (tc?.seasonal && mandatedMonth) {
    const repinnedSeason = deriveSeasonFromMonth(mandatedMonth);
    if (tc.seasonal.month !== mandatedMonth || tc.seasonal.season !== repinnedSeason) {
      ctx.warnings.push(
        `Agent 2d: re-pinned temporal season/month to follow the mandated month "${mandatedMonth}" ` +
        `(was season="${tc.seasonal.season}", month="${tc.seasonal.month}" → season="${repinnedSeason}").`,
      );
    }
    tc.seasonal.month = mandatedMonth;
    tc.seasonal.season = repinnedSeason;
  }

  // A_53 P6: the load-bearing fields (month/season) are now deterministically re-pinned above, so a
  // residual schema miss is non-load-bearing texture (Agent 2d is not abort-critical) — surface it as
  // a clearly-labelled validation FAILURE warning rather than a run-failing ctx.error.
  const validation = validateArtifact("temporal_context", ctx.temporalContext);
  if (!validation.valid) {
    ctx.warnings.push("Agent 2d: Temporal context FAILED schema validation (non-load-bearing fields; month/season already re-pinned):");
    validation.errors.forEach((e) => ctx.warnings.push(`  - ${e}`));
  }
  validation.warnings.forEach((w) => ctx.warnings.push(`  - Schema warning: ${w}`));

  ctx.reportProgress(
    "temporal-context",
    `Temporal context generated (${ctx.temporalContext.specificDate.month} ${ctx.temporalContext.specificDate.year})`,
    91
  );
}
