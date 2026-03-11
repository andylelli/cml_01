/**
 * Agent 2b: Character Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCharacterProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.characterProfiles.
 */

import { generateCharacterProfiles } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { CharacterProfilesScorer } from "@cml/story-validation";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  executeAgentWithRetry,
} from "./shared.js";
import { adaptCharacterProfilesForScoring } from "../scoring-adapters/index.js";

export async function runAgent2b(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("profiles", "Generating character profiles...", 88);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2b_profiles",
      "Character Profiles",
      async (retryFeedback?: string) => {
        const profilesResult = await generateCharacterProfiles(ctx.client, {
          caseData: ctx.cml!,
          cast: ctx.cast!.cast,
          tone: appendRetryFeedback(ctx.inputs.narrativeStyle || "classic", retryFeedback),
          targetWordCount: 1000,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: profilesResult, cost: profilesResult.cost };
      },
      async (profilesResult) => {
        const scorer = new CharacterProfilesScorer();
        const adapted = adaptCharacterProfilesForScoring(profilesResult.profiles);
        const score = await scorer.score({}, adapted, {
          previous_phases: { agent2_cast: ctx.cast!.cast },
          cml: ctx.cml!,
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
      ctx.savePartialReport
    );
    ctx.characterProfiles = result;
    ctx.agentCosts["agent2b_profiles"] = cost;
    ctx.agentDurations["agent2b_profiles"] = duration;
  } else {
    const profilesStart = Date.now();
    ctx.characterProfiles = await generateCharacterProfiles(ctx.client, {
      caseData: ctx.cml!,
      cast: ctx.cast!.cast,
      tone: ctx.inputs.narrativeStyle || "classic",
      targetWordCount: 1000,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent2b_profiles"] = ctx.characterProfiles.cost;
    ctx.agentDurations["agent2b_profiles"] = Date.now() - profilesStart;
  }

  const validation = validateArtifact("character_profiles", ctx.characterProfiles);
  if (!validation.valid) {
    ctx.warnings.push("Agent 2b: Character profiles validation warnings:");
    validation.errors.forEach((e) => ctx.warnings.push(`  - ${e}`));
  }
  validation.warnings.forEach((w) => ctx.warnings.push(`  - Schema warning: ${w}`));

  ctx.reportProgress(
    "profiles",
    `Character profiles generated (${ctx.characterProfiles.profiles.length})`,
    89
  );
}
