/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Extracted from mystery-orchestrator.ts. Runs generateHardLogicDevices(),
 * handles scoring-path retry and schema validation, computes hardLogicDirectives,
 * and writes ctx.hardLogicDevices + ctx.hardLogicDirectives.
 */

import { generateHardLogicDevices } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { HardLogicScorer } from "@cml/story-validation";
import { adaptHardLogicForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  mergeHardLogicDirectives,
} from "./shared.js";

export async function runAgent3b(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("hard_logic_devices", "Generating novel hard-logic device concepts...", 28);

  const setting = ctx.setting!;
  const cast = ctx.cast!;
  const backgroundContext = ctx.backgroundContext!;

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent3b_hard_logic_devices",
      "Hard Logic Devices",
      async (retryFeedback?: string) => {
        const hlResult = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
          theme: appendRetryFeedback(ctx.inputs.theme, retryFeedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
        });
        return { result: hlResult, cost: hlResult.cost };
      },
      async (hlResult) => {
        const scorer = new HardLogicScorer();
        const adapted = adaptHardLogicForScoring(hlResult.devices);
        const score = await scorer.score({}, adapted, {
          previous_phases: {
            agent1_setting: setting.setting,
            agent2_cast: cast.cast,
            agent2e_background_context: backgroundContext,
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
      ctx.savePartialReport,
    );
    ctx.hardLogicDevices = result;
    ctx.agentCosts["agent3b_hard_logic_devices"] = cost;
    ctx.agentDurations["agent3b_hard_logic_devices"] = duration;
  } else {
    const hardLogicStart = Date.now();
    ctx.hardLogicDevices = await generateHardLogicDevices(ctx.client, {
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      tone: ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery",
      theme: ctx.inputs.theme,
      primaryAxis: ctx.primaryAxis,
      mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
      hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
      difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
      noveltyConstraints: ctx.noveltyConstraints,
    });
    ctx.agentCosts["agent3b_hard_logic_devices"] = ctx.hardLogicDevices.cost;
    ctx.agentDurations["agent3b_hard_logic_devices"] = Date.now() - hardLogicStart;
  }

  const hardLogicValidation = validateArtifact("hard_logic_devices", ctx.hardLogicDevices);
  if (!hardLogicValidation.valid) {
    hardLogicValidation.errors.forEach((error) => ctx.errors.push(`Agent 3b schema failure: ${error}`));
    throw new Error("Hard-logic device artifact failed schema validation");
  }
  hardLogicValidation.warnings.forEach((warning) => ctx.warnings.push(`Agent 3b schema warning: ${warning}`));

  ctx.hardLogicDirectives = mergeHardLogicDirectives(
    ctx.initialHardLogicDirectives,
    ctx.hardLogicDevices!.devices,
  );

  ctx.reportProgress("hard_logic_devices", `Generated ${ctx.hardLogicDevices!.devices.length} novel hard-logic devices`, 31);
}
