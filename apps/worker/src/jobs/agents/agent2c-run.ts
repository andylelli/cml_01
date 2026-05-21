/**
 * Agent 2c: Location Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateLocationProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.locationProfiles.
 */

import { generateLocationProfiles, compileSensoryAtoms } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { LocationProfilesScorer } from "@cml/story-validation";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  executeAgentWithRetry,
} from "./shared.js";
import { adaptLocationsForScoring } from "../scoring-adapters/index.js";

export async function runAgent2c(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("location-profiles", "Generating location profiles...", 89);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent2c_location_profiles",
      "Location Profiles",
      async (retryFeedback?: string) => {
        const locResult = await generateLocationProfiles(ctx.client, {
          settingRefinement: ctx.setting!.setting,
          caseData: ctx.cml!,
          narrative: ctx.narrative,
          tone: appendRetryFeedback(ctx.inputs.tone || "Classic", retryFeedback),
          targetWordCount: 1000,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: locResult, cost: locResult.cost };
      },
      async (locResult) => {
        const scorer = new LocationProfilesScorer();
        const adapted = adaptLocationsForScoring(locResult);
        const score = await scorer.score({}, adapted, {
          previous_phases: {
            agent1_setting: ctx.setting!.setting,
            agent2e_background_context: ctx.backgroundContext!,
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
      ctx.savePartialReport
    );
    ctx.locationProfiles = compileSensoryAtoms(result);
    ctx.agentCosts["agent2c_location_profiles"] = cost;
    ctx.agentDurations["agent2c_location_profiles"] = duration;
  } else {
    const locationProfilesStart = Date.now();
    const rawProfiles = await generateLocationProfiles(ctx.client, {
      settingRefinement: ctx.setting!.setting,
      caseData: ctx.cml!,
      narrative: ctx.narrative!,
      tone: ctx.inputs.tone || "Classic",
      targetWordCount: 1000,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.locationProfiles = compileSensoryAtoms(rawProfiles);
    ctx.agentCosts["agent2c_location_profiles"] = rawProfiles.cost;
    ctx.agentDurations["agent2c_location_profiles"] = Date.now() - locationProfilesStart;
  }

  const validation = validateArtifact("location_profiles", ctx.locationProfiles);
  if (!validation.valid) {
    ctx.warnings.push("Agent 2c: Location profiles validation warnings:");
    validation.errors.forEach((e) => ctx.warnings.push(`  - ${e}`));
  }
  validation.warnings.forEach((w) => ctx.warnings.push(`  - Schema warning: ${w}`));

  // F5b: Warn if any sensoryDetails entry contains a conjugated verb — indicates the model
  // wrote a full sentence instead of a noun phrase, which bleeds into Agent 9 as prose.
  const CONJUGATED_VERB_RE = /\b(is|are|was|were|has|have|had|set|ran|stood|made|gave|filled|hung|crackled|ticked|gleamed|drifted|carried|rose|fell|swept|lay|sat|pooled|cast|played|echoed)\b/i;
  const sensoryBleedWarnings: string[] = [];
  for (const loc of (ctx.locationProfiles?.keyLocations ?? [])) {
    const details = (loc as any).sensoryDetails ?? {};
    for (const field of ['sights', 'sounds', 'smells', 'tactile'] as const) {
      for (const entry of (details[field] ?? []) as string[]) {
        if (CONJUGATED_VERB_RE.test(entry)) {
          sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryDetails.${field}: "${entry}" (contains verb — should be noun phrase)`);
        }
      }
    }
    for (const variant of (loc as any).sensoryVariants ?? []) {
      for (const field of ['sights', 'sounds', 'smells'] as const) {
        for (const entry of (variant[field] ?? []) as string[]) {
          if (CONJUGATED_VERB_RE.test(entry)) {
            sensoryBleedWarnings.push(`  - [${loc.id ?? 'unknown'}].sensoryVariants[${variant.id ?? '?'}].${field}: "${entry}" (contains verb)`);
          }
        }
      }
    }
  }
  if (sensoryBleedWarnings.length > 0) {
    console.warn('[Agent 2c] F5b: sensoryDetails full-sentence bleed detected — these will be copied verbatim by Agent 9:');
    sensoryBleedWarnings.forEach((w) => { console.warn(w); ctx.warnings.push(w); });
  }

  ctx.reportProgress(
    "location-profiles",
    `Location profiles generated (${ctx.locationProfiles?.keyLocations.length ?? 0} locations)`,
    89
  );
}
