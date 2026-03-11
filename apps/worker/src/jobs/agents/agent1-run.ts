/**
 * Agent 1: Era & Setting Refiner
 *
 * Extracted from mystery-orchestrator.ts. Runs refineSetting(), handles
 * scoring-path retry and schema-repair retry, and writes ctx.setting.
 */

import { refineSetting } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { SettingRefinementScorer } from "@cml/story-validation";
import { adaptSettingForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedbackOptional,
} from "./shared.js";

export async function runAgent1(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("setting", "Refining era and setting...", 0);

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent1_setting",
      "Setting Refinement",
      async (retryFeedback?: string) => {
        const settingResult = await refineSetting(ctx.client, {
          decade: ctx.inputs.eraPreference || "1930s",
          location: ctx.locationSpec.location,
          institution: ctx.locationSpec.institution,
          tone: appendRetryFeedbackOptional(ctx.inputs.tone, retryFeedback),
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: settingResult, cost: settingResult.cost };
      },
      async (settingResult) => {
        const scorer = new SettingRefinementScorer();
        const adapted = adaptSettingForScoring(settingResult.setting);
        const score = await scorer.score({}, adapted, {
          previous_phases: {},
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

    ctx.setting = result;
    ctx.agentCosts["agent1_setting"] = cost;
    ctx.agentDurations["agent1_setting"] = duration;
  } else {
    const settingStart = Date.now();
    ctx.setting = await refineSetting(ctx.client, {
      decade: ctx.inputs.eraPreference || "1930s",
      location: ctx.locationSpec.location,
      institution: ctx.locationSpec.institution,
      tone: ctx.inputs.tone,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent1_setting"] = ctx.setting.cost;
    ctx.agentDurations["agent1_setting"] = Date.now() - settingStart;
  }

  if (
    ctx.setting.setting.realism.anachronisms.length > 0 ||
    ctx.setting.setting.realism.implausibilities.length > 0
  ) {
    ctx.errors.push(
      `Agent 1: Setting realism issues detected (anachronisms=${ctx.setting.setting.realism.anachronisms.length}, implausibilities=${ctx.setting.setting.realism.implausibilities.length})`
    );
    throw new Error("Setting refinement still contains realism issues");
  }

  let settingSchemaValidation = validateArtifact("setting_refinement", ctx.setting.setting);
  if (!settingSchemaValidation.valid) {
    ctx.warnings.push("Setting refinement failed schema validation on first attempt; retrying setting generation with schema repair guardrails");
    const settingSchemaRetryStart = Date.now();
    const retriedSetting = await refineSetting(ctx.client, {
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      decade: ctx.inputs.eraPreference || "1930s",
      location: ctx.locationSpec.location,
      institution: ctx.locationSpec.institution,
      tone: ctx.inputs.tone,
    }, 2);
    ctx.agentCosts["agent1_setting"] = (ctx.agentCosts["agent1_setting"] || 0) + retriedSetting.cost;
    ctx.agentDurations["agent1_setting"] = (ctx.agentDurations["agent1_setting"] || 0) + (Date.now() - settingSchemaRetryStart);
    const retryValidation = validateArtifact("setting_refinement", retriedSetting.setting);
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
