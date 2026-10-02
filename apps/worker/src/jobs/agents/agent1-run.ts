/**
 * Agent 1: Era & Setting Refiner
 *
 * Extracted from mystery-orchestrator.ts. Runs refineSetting(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.setting.
 */

import { recordShippedPhaseScore, runUnscoredStage, scoreSettingPhase } from "./phase-scoring.js";
import { backfillSetting, refineSetting } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  appendRetryFeedbackOptional,
} from "./shared.js";

export async function runAgent1(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("setting", "Refining era and setting...", 0);

  // CR-21 (ORC-02): the one refineSetting input — the first attempt and the schema-repair re-roll.
  const settingInputs = (retryFeedback?: string): Parameters<typeof refineSetting>[1] => ({
    decade: ctx.inputs.eraPreference || "1930s",
    location: ctx.locationSpec.location,
    institution: ctx.locationSpec.institution,
    storyAngle: ctx.inputs.storyAngle,
    tone: appendRetryFeedbackOptional(ctx.inputs.tone, retryFeedback),
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  });

  // A1X-Q02: generate here; the phase is scored below, on the setting that ships (after backfill / re-roll).
  ctx.setting = await runUnscoredStage(ctx, {
    agentId: "agent1_setting",
    phaseName: "Setting Refinement",
    generate: async () => {
      const settingResult = await refineSetting(ctx.client, settingInputs());
      return { result: settingResult, cost: settingResult.cost };
    },
  });

  // A1X-10 (owner decision 12, CML_VERIFIED_FIXES): refineSetting now backfills a missing top-level key
  // before re-rolling, and says so on the result; the field is absent when the flag is OFF.
  const structuralBackfill: unknown = (ctx.setting as { structuralBackfill?: unknown }).structuralBackfill;
  if (Array.isArray(structuralBackfill) && structuralBackfill.length > 0) {
    ctx.warnings.push(
      `Setting response lacked top-level key(s) ${structuralBackfill.join(", ")}; filled by deterministic backfill instead of an LLM re-roll (A1X-10).`,
    );
  }

  // A_53 P2 (repair-not-abort): deterministic schema backfill from context — runs FREE before any
  // LLM re-roll or throw. Most setting-schema failures are a single missing array/string field;
  // values are generic, parameter-derived neutrals (no story content).
  // A1X-10: the one backfill body, in @cml/prompts-llm (refineSetting uses it before a re-roll when
  // CML_VERIFIED_FIXES is on). MEASURED identical to the closure that was here (same reads, formatting only).
  const backfillSettingArtifact = (raw: unknown): any =>
    backfillSetting(raw, {
      decade: ctx.inputs.eraPreference ?? "",
      location: ctx.locationSpec.location,
      institution: ctx.locationSpec.institution,
    });

  let settingSchemaValidation = validateArtifact("setting_refinement", ctx.setting.setting);
  if (!settingSchemaValidation.valid) {
    // Step 1 — free deterministic backfill + re-validate (no LLM; runs even when contract recovery is off).
    ctx.setting.setting = backfillSettingArtifact(ctx.setting.setting);
    settingSchemaValidation = validateArtifact("setting_refinement", ctx.setting.setting);
    if (settingSchemaValidation.valid) {
      ctx.warnings.push("Setting schema repaired by deterministic field backfill (no LLM re-roll needed).");
    }
  }
  if (!settingSchemaValidation.valid) {
    // A1X-D10 (unflagged — telemetry text only): the re-roll below sends the SAME prompt; the warning used to
    // claim "schema repair guardrails", which no Agent 1 request carries.
    ctx.warnings.push("Setting refinement failed schema validation after backfill; retrying setting generation (same prompt, re-roll only)");
    const settingSchemaRetryStart = Date.now();
    const retriedSetting = await refineSetting(ctx.client, settingInputs(), 2);
    ctx.agentCosts["agent1_setting"] = retriedSetting.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
    ctx.agentDurations["agent1_setting"] = (ctx.agentDurations["agent1_setting"] || 0) + (Date.now() - settingSchemaRetryStart);
    let retryValidation = validateArtifact("setting_refinement", retriedSetting.setting);
    if (!retryValidation.valid) {
      // Backfill the re-rolled artifact too before giving up.
      retriedSetting.setting = backfillSettingArtifact(retriedSetting.setting);
      retryValidation = validateArtifact("setting_refinement", retriedSetting.setting);
    }
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) => ctx.errors.push(`Setting schema failure: ${error}`));
      throw new Error("Setting artifact failed schema validation");
    }
    ctx.setting = retriedSetting;
    settingSchemaValidation = retryValidation;
    ctx.warnings.push("Setting schema-repair retry succeeded");
  }
  settingSchemaValidation.warnings.forEach((warning) => ctx.warnings.push(`Setting schema warning: ${warning}`));

  // A1X-Q02 (owner decision, 2026-10-02): the report scores the setting that ships, not the raw LLM output.
  await recordShippedPhaseScore(ctx, "agent1_setting", "Setting Refinement", () => scoreSettingPhase(ctx.setting!.setting, ctx.warnings));

  ctx.reportProgress("setting", "Era and setting refined", 12);
}
