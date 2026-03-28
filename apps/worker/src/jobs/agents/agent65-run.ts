/**
 * Agent 6.5: World Builder Run
 *
 * Runs generateWorldDocument() to produce a WorldDocumentResult from the
 * completed characterProfiles, locationProfiles, temporalContext, backgroundContext,
 * hardLogicDevices, and clue distribution. Writes ctx.worldDocument.
 *
 * Pipeline position: after Agent 2d (temporal context), before Agent 7 (narrative).
 */

import { generateWorldDocument } from "@cml/prompts-llm";
import { Agent65WorldBuilderScorer } from "@cml/story-validation";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  executeAgentWithRetry,
} from "./shared.js";

export async function runAgent65(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("world-builder", "Generating World Document...", 90);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent65_world_builder",
      "World Builder",
      async (_retryFeedback?: string) => {
        const worldDoc = await generateWorldDocument(
          {
            caseData: ctx.cml!,
            characterProfiles: ctx.characterProfiles!,
            locationProfiles: ctx.locationProfiles!,
            temporalContext: ctx.temporalContext!,
            backgroundContext: ctx.backgroundContext!,
            hardLogicDevices: ctx.hardLogicDevices!,
            clueDistribution: ctx.clues!,
            runId: ctx.runId,
            projectId: ctx.projectId || "",
            onProgress: (phase, msg) =>
              ctx.reportProgress("world-builder", `${phase}: ${msg}`, 92),
          },
          ctx.client
        );
        return { result: worldDoc, cost: worldDoc.cost };
      },
      async (worldDoc) => {
        const scorer = new Agent65WorldBuilderScorer();
        const castSize = ((ctx.cml as any)?.CASE?.cast ?? []).length;
        const score = await scorer.score({}, worldDoc as any, {
          previous_phases: {},
          cml: ctx.cml!,
          threshold_config: { mode: "standard" },
          castSize,
        } as any);
        return { adapted: worldDoc, score };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport
    );
    ctx.worldDocument = result;
    ctx.agentCosts["agent65_world_builder"] = cost;
    ctx.agentDurations["agent65_world_builder"] = duration;
  } else {
    const start = Date.now();
    const worldDoc = await generateWorldDocument(
      {
        caseData: ctx.cml!,
        characterProfiles: ctx.characterProfiles!,
        locationProfiles: ctx.locationProfiles!,
        temporalContext: ctx.temporalContext!,
        backgroundContext: ctx.backgroundContext!,
        hardLogicDevices: ctx.hardLogicDevices!,
        clueDistribution: ctx.clues!,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      },
      ctx.client
    );
    ctx.worldDocument = worldDoc;
    ctx.agentCosts["agent65_world_builder"] = worldDoc.cost;
    ctx.agentDurations["agent65_world_builder"] = Date.now() - start;
  }

  ctx.reportProgress("world-builder", "World Document complete", 93);
}
