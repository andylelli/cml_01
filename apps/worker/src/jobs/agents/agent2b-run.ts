/**
 * Agent 2b: Character Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCharacterProfiles()
 * via executeAgentWithRetry when scoring is enabled, validates against schema,
 * and writes ctx.characterProfiles.
 */

import {
  generateCharacterProfiles,
  extractVoiceCapsule,
  checkVoiceCapsules,
} from "@cml/prompts-llm";
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

  // Phase-0 shadow: project each finalized profile into a typed Voice Capsule and run the
  // deterministic distinctiveness/groundedness/deployability checker for telemetry only. Default
  // OFF; when AGENT2B_VOICE_CHECK is set (shadow/on) it LOGS findings into warnings WITHOUT
  // changing behavior — the deterministic foundation for the Agent 2b redesign
  // (documentation/12_system_redesign/03_agent_2b_character_profiles.md §4, §9). Mirrors the
  // Agent 2 cast-checker shadow hook (AGENT2_CAST_CHECK).
  const voiceCheckMode = (process.env.AGENT2B_VOICE_CHECK ?? "").trim().toLowerCase();
  if (voiceCheckMode && voiceCheckMode !== "off" && voiceCheckMode !== "false" && voiceCheckMode !== "0") {
    try {
      const capsules = ctx.characterProfiles.profiles.map((profile) => extractVoiceCapsule(profile));
      const check = checkVoiceCapsules(capsules);
      ctx.warnings.push(
        `[agent2b-voice-check][shadow] ok=${check.ok} count=${check.metrics.count} ` +
          `deployable=${check.metrics.deployableCount} grounded=${check.metrics.groundedRegisterCount} ` +
          `uniqueRegisters=${check.metrics.uniqueRegisters} duplicatePairs=${check.metrics.duplicatePairs} ` +
          `issues=${check.issues.length}`
      );
      for (const issue of check.issues) {
        ctx.warnings.push(`[agent2b-voice-check][shadow] ${issue.severity}: ${issue.message}`);
      }
    } catch (err) {
      ctx.warnings.push(`[agent2b-voice-check][shadow] checker error: ${(err as Error).message}`);
    }
  }

  ctx.reportProgress(
    "profiles",
    `Character profiles generated (${ctx.characterProfiles.profiles.length})`,
    89
  );
}
