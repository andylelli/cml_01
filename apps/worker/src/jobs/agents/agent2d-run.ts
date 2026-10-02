/**
 * Agent 2d: Temporal Context
 *
 * Extracted from mystery-orchestrator.ts. Runs generateTemporalContext()
 * via runStage (scoring retries when scoring is enabled), validates against schema,
 * and writes ctx.temporalContext.
 */

import { scoreTemporalContextPhase } from "./phase-scoring.js";
import { generateTemporalContext, deriveSeasonFromMonth } from "@cml/prompts-llm";
import { generateSpecificDate } from "@cml/prompts-llm/temporal-anchor";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  runStage,
} from "./shared.js";

/**
 * A1X-Q04 (owner decision, 2026-10-02): the id the story DATE is hashed from.
 *
 * A fresh run: `ctx.runId` — exactly what the prompt always used, so fresh runs are byte-identical.
 * A resume (`resume-run.ts` sets `inputs.resumeFromRunId` to the SOURCE run's id, or to the projectId when
 * no originalRunId was given): the SOURCE run's id, so re-running Agent 2d does not re-date the book under
 * the new `resume-<ms>` id. When the source id is unknown (it fell back to the projectId) the run id is
 * kept, which honours `RESUME_RUN_ID` (CR-03).
 */
export function temporalAnchorRunId(ctx: Pick<OrchestratorContext, "runId" | "projectId" | "inputs">): string {
  const source = String((ctx.inputs as { resumeFromRunId?: string } | undefined)?.resumeFromRunId ?? "").trim();
  if (source && source !== ctx.projectId) return source;
  return ctx.runId;
}

/**
 * A1X-Q04: pin `specificDate.year` and `.month` to the mandate `generateSpecificDate(decade, anchorRunId)` —
 * the same call, inputs and decade fallback the prompt uses — instead of trusting the model's reply.
 * MEASURED: the model matched the mandate in 66 of 66 archived calls, so on a fresh run this changes nothing.
 * Returns the warning to push, or null when nothing changed. With no anchor id the mandate would be
 * Math.random() (temporal-anchor.ts), so it is not pinned at all.
 */
export function pinSpecificDateToMandate(
  temporalContext: any,
  decade: string | undefined,
  anchorRunId: string,
): string | null {
  const date = temporalContext?.specificDate;
  if (!date || typeof date !== "object" || !anchorRunId) return null;
  const mandate = generateSpecificDate(decade ?? "1950s", anchorRunId);
  const yearOk = String(date.year ?? "").trim() === String(mandate.year);
  const monthOk = String(date.month ?? "").trim() === mandate.month;
  if (yearOk && monthOk) return null;
  const was = `${date.month} ${date.year}`;
  date.year = mandate.year;
  date.month = mandate.month;
  return `[A1X-Q04] Agent 2d: pinned specificDate to the mandated ${mandate.month} ${mandate.year} (model returned ${was}; anchor run id ${anchorRunId}).`;
}

export async function runAgent2d(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("temporal-context", "Generating temporal context...", 89);

  const anchorRunId = temporalAnchorRunId(ctx);
  ctx.temporalContext = await runStage(ctx, {
    agentId: "agent2d_temporal_context",
    phaseName: "Temporal Context",
    generate: async () => {
      const tempResult = await generateTemporalContext(ctx.client, {
        settingRefinement: ctx.setting!.setting,
        caseData: ctx.cml!,
        // A1X-Q04: the prompt's mandate and the pin below hash the same id (ctx.runId on a fresh run).
        runId: anchorRunId,
        projectId: ctx.projectId || "",
        qualityGuardrails: undefined,
      });
      return { result: tempResult, cost: tempResult.cost };
    },
    score: async (tempResult) => scoreTemporalContextPhase(tempResult, ctx.setting!.setting, ctx.backgroundContext!),
  });

  // A1X-Q04: year/month are mandated; pin them before the season re-pin below, which follows the month.
  // The same `runId || projectId` fallback the prompt applies (agent2d-temporal-context.ts).
  const pinWarning = pinSpecificDateToMandate(
    ctx.temporalContext,
    ctx.setting!.setting.era.decade,
    anchorRunId || ctx.projectId || "",
  );
  if (pinWarning) ctx.warnings.push(pinWarning);

  // A_53 P6 (agent2d-validation-warns-not-errors): deterministically re-pin the load-bearing temporal
  // fields (seasonal.month + seasonal.season) to the mandated month before they feed the Agent 9
  // season lock — the month is mandated and the season follows from it, so they must never drift even
  // if the LLM ignored the prompt. (A residual schema miss is a warning — see below; A1X-D12.)
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
