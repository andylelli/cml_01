/**
 * Agent 1: Era & Setting Refiner
 *
 * Extracted from mystery-orchestrator.ts. Runs refineSetting(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.setting.
 */

import { scoreSettingPhase } from "./phase-scoring.js";
import { refineSetting } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import {
  type OrchestratorContext,
  runStage,
  appendRetryFeedbackOptional,
  preAgent9ContractRecoveryEnabled,
} from "./shared.js";

export async function runAgent1(ctx: OrchestratorContext): Promise<void> {
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
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

  ctx.setting = await runStage(ctx, {
    agentId: "agent1_setting",
    phaseName: "Setting Refinement",
    generate: async () => {
      const settingResult = await refineSetting(ctx.client, settingInputs());
      return { result: settingResult, cost: settingResult.cost };
    },
    score: async (settingResult) => scoreSettingPhase(settingResult.setting, ctx.warnings),
  });

  if (
    ctx.setting.setting.realism.anachronisms.length > 0 ||
    ctx.setting.setting.realism.implausibilities.length > 0
  ) {
    // A_53 P2 (repair-not-abort): refineSetting already folds residual realism notes on its final
    // attempt; this is a defensive belt — fold + warn here too, never throw away ~30 agents of work.
    const realism = ctx.setting.setting.realism;
    const anachronismCount = realism.anachronisms.length;
    const implausibilityCount = realism.implausibilities.length;
    realism.recommendations = [
      ...(realism.recommendations ?? []),
      ...realism.anachronisms.map((a) => `Anachronism to avoid: ${a}`),
      ...realism.implausibilities.map((i) => `Implausibility to avoid: ${i}`),
    ];
    realism.anachronisms = [];
    realism.implausibilities = [];
    ctx.warnings.push(
      `Agent 1: folded ${anachronismCount + implausibilityCount} residual realism note(s) ` +
      `(anachronisms=${anachronismCount}, implausibilities=${implausibilityCount}) into recommendations instead of aborting.`,
    );
  }

  // A_53 P2 (repair-not-abort): deterministic schema backfill from context — runs FREE before any
  // LLM re-roll or throw. Most setting-schema failures are a single missing array/string field;
  // values are generic, parameter-derived neutrals (no story content).
  const backfillSettingArtifact = (raw: unknown): any => {
    const s: any = raw && typeof raw === "object" ? raw : {};
    const ensureStr = (v: unknown, fallback: string) =>
      typeof v === "string" && v.trim().length > 0 ? v : fallback;
    const ensureArr = (v: unknown) => (Array.isArray(v) ? v : []);

    const era: any = s.era && typeof s.era === "object" ? s.era : {};
    era.decade = ensureStr(era.decade, ctx.inputs.eraPreference || "1930s");
    era.technology = ensureArr(era.technology);
    era.forensics = ensureArr(era.forensics);
    era.transportation = ensureArr(era.transportation);
    era.communication = ensureArr(era.communication);
    era.socialNorms = ensureArr(era.socialNorms);
    era.policing = ensureArr(era.policing);
    s.era = era;

    const location: any = s.location && typeof s.location === "object" ? s.location : {};
    location.type = ensureStr(location.type, ctx.locationSpec.institution || "institution");
    location.description = ensureStr(
      location.description,
      `${ctx.locationSpec.location} — ${ctx.locationSpec.institution}`.trim(),
    );
    location.physicalConstraints = ensureArr(location.physicalConstraints);
    location.geographicIsolation = ensureStr(location.geographicIsolation, "moderate");
    location.accessControl = ensureArr(location.accessControl);
    s.location = location;

    const atmosphere: any = s.atmosphere && typeof s.atmosphere === "object" ? s.atmosphere : {};
    atmosphere.weather = ensureStr(atmosphere.weather, "overcast");
    atmosphere.timeOfDay = ensureStr(atmosphere.timeOfDay, "evening");
    atmosphere.mood = ensureStr(atmosphere.mood, "tense");
    atmosphere.visualDescription = ensureStr(atmosphere.visualDescription, "Dim, shadowed period interiors.");
    s.atmosphere = atmosphere;

    const realism: any = s.realism && typeof s.realism === "object" ? s.realism : {};
    realism.anachronisms = ensureArr(realism.anachronisms);
    realism.implausibilities = ensureArr(realism.implausibilities);
    realism.recommendations = ensureArr(realism.recommendations);
    s.realism = realism;

    return s;
  };

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
    if (!contractRecoveryEnabled) {
      settingSchemaValidation.errors.forEach((error) => ctx.errors.push(`Setting schema failure: ${error}`));
      throw new Error("Setting artifact failed schema validation (contract recovery disabled)");
    }
    ctx.warnings.push("Setting refinement failed schema validation after backfill; retrying setting generation with schema repair guardrails");
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

  ctx.reportProgress("setting", "Era and setting refined", 12);
}
