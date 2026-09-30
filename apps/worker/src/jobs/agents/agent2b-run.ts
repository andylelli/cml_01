/**
 * Agent 2b: Character Profiles
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCharacterProfiles()
 * via runStage (scoring retries when scoring is enabled), validates against schema,
 * and writes ctx.characterProfiles.
 */

import { readModeFlag } from "./mode-flag.js";
import { runBoundedGate } from "./quality-gate.js";
import { scoreCharacterProfilesPhase } from "./phase-scoring.js";
import { resolveBandForRun,
  generateCharacterProfiles,
  extractVoiceCapsule,
  checkVoiceCapsules,
  voiceGatePass,
  buildVoiceGateFeedback,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  appendRetryFeedback,
  runStage,
} from "./shared.js";

export async function runAgent2b(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("profiles", "Generating character profiles...", 88);

  // CR-21 (ORC-02): the one generateCharacterProfiles input — the scored attempt and the voice-gate regen.
  const profileInputs = (feedback?: string): Parameters<typeof generateCharacterProfiles>[1] => ({
    caseData: ctx.cml!,
    cast: ctx.cast!.cast,
    tone: appendRetryFeedback(ctx.inputs.narrativeStyle || "classic", feedback),
    humourLevel: resolveBandForRun(ctx.inputs.humourLevel, ctx.inputs.primaryAxis),  // A_92 + A_95 M4
    targetWordCount: 1000,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  });

  ctx.characterProfiles = await runStage(ctx, {
    agentId: "agent2b_profiles",
    phaseName: "Character Profiles",
    generate: async (retryFeedback?: string) => {
      const profilesResult = await generateCharacterProfiles(ctx.client, profileInputs(retryFeedback));
      return { result: profilesResult, cost: profilesResult.cost };
    },
    score: async (profilesResult) => scoreCharacterProfilesPhase(profilesResult.profiles, ctx.cast!.cast, ctx.cml!),
  });

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
  const voiceCheckMode = readModeFlag(process.env.AGENT2B_VOICE_CHECK);
  const voiceCheckActive = Boolean(voiceCheckMode);
  if (voiceCheckActive) {
    const enforce = voiceCheckMode === "enforce";
    // Bounded both ways, as Agent 3b's plausibility retries are (Phase-1 lesson: "Infinity" must not defeat
    // "bounded") and as the retry-gate guard already assumes (cap 3) — ORC-D04.
    const maxRetries = enforce ? Math.min(3, Math.max(0, Math.trunc(Number(process.env.AGENT2B_VOICE_MAX_RETRIES ?? 1)) || 0)) : 0;
    const label = enforce ? "enforce" : "shadow";
    try {
      const voiceCheck = (profiles: typeof ctx.characterProfiles) =>
        checkVoiceCapsules(profiles.profiles.map((profile) => extractVoiceCapsule(profile)));
      const { best, verdict: check, attempts: attempt } = await runBoundedGate(ctx, {
        label: "agent2b-voice-check",
        enforce,
        maxRetries,
        initial: ctx.characterProfiles,
        evaluate: voiceCheck,
        needsRetry: (c) => !voiceGatePass(c.metrics),
        feedback: (_best, c) => buildVoiceGateFeedback(c),
        retryWarning: (_c, n, max) => `[agent2b-voice-check][enforce] gate failed (attempt ${n}/${max}); regenerating with voice feedback.`,
        regenerate: (feedback) => generateCharacterProfiles(ctx.client, profileInputs(feedback)),
        costLabel: "Agent2b-CharacterProfiles",
        costKey: "agent2b_profiles",
        // Accept-after-exhaustion: keep the regenerated cast only if it passes the gate or strictly
        // improves register distinctness; otherwise retain the best-so-far profiles.
        isBetter: (cand, cur) =>
          voiceGatePass(cand.verdict.metrics) || cand.verdict.metrics.uniqueRegisters > cur.verdict.metrics.uniqueRegisters,
      });
      ctx.characterProfiles = best;
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
