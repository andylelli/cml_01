/**
 * Agent 6.5: World Builder Run
 *
 * Runs generateWorldDocument() to produce a WorldDocumentResult from the
 * completed characterProfiles, locationProfiles, temporalContext, backgroundContext,
 * hardLogicDevices, and clue distribution. Writes ctx.worldDocument.
 *
 * Pipeline position: after Agent 2d (temporal context), before Agent 7 (narrative).
 */

import { scoreWorldDocumentPhase } from "./phase-scoring.js";
import { generateWorldDocument, degradedWorldDocument } from "@cml/prompts-llm";
import { verifiedFixesEnabled } from "@cml/cml";
import { describeError } from "./run-utils.js";
import {
  type OrchestratorContext,
  runStage,
} from "./shared.js";

export async function runAgent65(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("world-builder", "Generating World Document...", 90);

  ctx.worldDocument = await runStage(ctx, {
    agentId: "agent65_world_builder",
    phaseName: "World Builder",
    generate: async () => {
      let worldDoc;
      try {
        worldDoc = await generateWorldDocument(
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
      } catch (error) {
        // A6-Q02 (owner decision 12, CML_VERIFIED_FIXES): 6.5 is creative texture (A_53 P2), so exhausting its
        // attempts degrades to the normalised empty document with a floor warning instead of aborting the run.
        if (!verifiedFixesEnabled()) throw error;
        ctx.warnings.push(`[A6-Q02] Agent 6.5 World Builder failed (${describeError(error)}); continuing with the normalised default World Document`);
        const spent = ctx.client.getCostTracker?.().getSummary().byAgent["Agent65-WorldBuilder"] ?? 0;
        worldDoc = { ...degradedWorldDocument({ caseData: ctx.cml!, temporalContext: ctx.temporalContext! }), cost: spent };
      }
      return { result: worldDoc, cost: worldDoc.cost };
    },
    score: async (worldDoc) => scoreWorldDocumentPhase(worldDoc, ctx.cml!),
    // A_53 P2: Agent 6.5 produces creative texture — a sub-threshold score degrades to a warning +
    // best-effort document rather than aborting the whole pipeline.
  });

  ctx.reportProgress("world-builder", "World Document complete", 93);
}
