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
  voiceGatePass,
  buildVoiceGateFeedback,
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
  // deterministic distinctiveness/groundedness/deployability checker. Default OFF.
  //   AGENT2B_VOICE_CHECK = on|shadow  → LOG findings into warnings WITHOUT changing behavior.
  //   AGENT2B_VOICE_CHECK = enforce    → P1.4: run a bounded (≤ AGENT2B_VOICE_MAX_RETRIES, default 1)
  //       regeneration retry when the voice gate fails, then accept the best result (accept-after-
  //       exhaustion). Never enable in the same run as another retry-gated lever.
  // (documentation/12_system_redesign/03_agent_2b_character_profiles.md §4, §9.)
  const voiceCheckMode = (process.env.AGENT2B_VOICE_CHECK ?? "").trim().toLowerCase();
  const voiceCheckActive =
    voiceCheckMode && voiceCheckMode !== "off" && voiceCheckMode !== "false" && voiceCheckMode !== "0";
  if (voiceCheckActive) {
    const enforce = voiceCheckMode === "enforce";
    const maxRetries = enforce ? Math.max(0, Math.trunc(Number(process.env.AGENT2B_VOICE_MAX_RETRIES ?? 1)) || 0) : 0;
    const label = enforce ? "enforce" : "shadow";
    try {
      let check = checkVoiceCapsules(ctx.characterProfiles.profiles.map((profile) => extractVoiceCapsule(profile)));
      let attempt = 0;
      while (enforce && !voiceGatePass(check.metrics) && attempt < maxRetries) {
        attempt += 1;
        const feedback = buildVoiceGateFeedback(check);
        ctx.warnings.push(
          `[agent2b-voice-check][enforce] gate failed (attempt ${attempt}/${maxRetries}); regenerating with voice feedback.`
        );
        const regenStart = Date.now();
        const regenerated = await generateCharacterProfiles(ctx.client, {
          caseData: ctx.cml!,
          cast: ctx.cast!.cast,
          tone: appendRetryFeedback(ctx.inputs.narrativeStyle || "classic", feedback),
          targetWordCount: 1000,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent2b_profiles"] = (ctx.agentCosts["agent2b_profiles"] ?? 0) + regenerated.cost;
        ctx.agentDurations["agent2b_profiles"] =
          (ctx.agentDurations["agent2b_profiles"] ?? 0) + (Date.now() - regenStart);
        const regenCheck = checkVoiceCapsules(regenerated.profiles.map((profile) => extractVoiceCapsule(profile)));
        // Accept-after-exhaustion: keep the regenerated cast only if it passes the gate or strictly
        // improves register distinctness; otherwise retain the best-so-far profiles.
        if (voiceGatePass(regenCheck.metrics) || regenCheck.metrics.uniqueRegisters > check.metrics.uniqueRegisters) {
          ctx.characterProfiles = regenerated;
          check = regenCheck;
        }
      }
      const gateState = enforce ? (voiceGatePass(check.metrics) ? "pass" : `accept-after-${attempt}`) : "shadow";
      ctx.warnings.push(
        `[agent2b-voice-check][${label}] gate=${gateState} ok=${check.ok} count=${check.metrics.count} ` +
          `deployable=${check.metrics.deployableCount} grounded=${check.metrics.groundedRegisterCount} ` +
          `uniqueRegisters=${check.metrics.uniqueRegisters} duplicatePairs=${check.metrics.duplicatePairs} ` +
          `issues=${check.issues.length}`
      );
      for (const issue of check.issues) {
        ctx.warnings.push(`[agent2b-voice-check][${label}] ${issue.severity}: ${issue.message}`);
      }
    } catch (err) {
      ctx.warnings.push(`[agent2b-voice-check][${label}] checker error: ${(err as Error).message}`);
    }
  }

  ctx.reportProgress(
    "profiles",
    `Character profiles generated (${ctx.characterProfiles.profiles.length})`,
    89
  );
}
