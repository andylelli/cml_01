/**
 * Agent 2e: Background Context Generator
 *
 * Extracted from mystery-orchestrator.ts. Runs generateBackgroundContext(),
 * handles scoring-path retry and schema validation, and writes ctx.backgroundContext.
 */

import { generateBackgroundContext } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { BackgroundContextScorer } from "@cml/story-validation";
import { adaptBackgroundContextForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  appendRetryFeedbackOptional,
} from "./shared.js";

export async function runAgent2e(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("background-context", "Generating background context...", 25);

  const setting = ctx.setting!;
  const cast = ctx.cast!;

  let backgroundContextResult: Awaited<ReturnType<typeof generateBackgroundContext>>;

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2e_background_context",
      "Background Context",
      async (retryFeedback?: string) => {
        const bgResult = await generateBackgroundContext(ctx.client, {
          settingRefinement: setting.setting,
          cast: cast.cast,
          theme: appendRetryFeedbackOptional(ctx.inputs.theme, retryFeedback),
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: bgResult, cost: bgResult.cost };
      },
      async (bgResult) => {
        const scorer = new BackgroundContextScorer();
        const adapted = adaptBackgroundContextForScoring(bgResult.backgroundContext, setting.setting);
        const score = await scorer.score({}, adapted, {
          previous_phases: {
            agent1_setting: setting.setting,
            agent2_cast: cast.cast,
          },
          cml: undefined as any,
          threshold_config: { mode: "standard" },
        });
        return { adapted, score };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
    );
    backgroundContextResult = result;
    ctx.agentCosts["agent2e_background_context"] = cost;
    ctx.agentDurations["agent2e_background_context"] = duration;
  } else {
    const backgroundContextStart = Date.now();
    backgroundContextResult = await generateBackgroundContext(ctx.client, {
      settingRefinement: setting.setting,
      cast: cast.cast,
      theme: ctx.inputs.theme,
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent2e_background_context"] = backgroundContextResult.cost;
    ctx.agentDurations["agent2e_background_context"] = Date.now() - backgroundContextStart;
  }

  ctx.backgroundContext = backgroundContextResult.backgroundContext;

  const backgroundContextValidation = validateArtifact("background_context", ctx.backgroundContext);
  if (!backgroundContextValidation.valid) {
    backgroundContextValidation.errors.forEach((error) =>
      ctx.errors.push(`Background context schema failure: ${error}`)
    );
    throw new Error("Background context artifact failed schema validation");
  }
  backgroundContextValidation.warnings.forEach((warning) =>
    ctx.warnings.push(`Background context schema warning: ${warning}`)
  );

  ctx.reportProgress("background-context", "Background context generated", 28);
}
