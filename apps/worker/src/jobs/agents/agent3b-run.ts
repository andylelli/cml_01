/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Extracted from mystery-orchestrator.ts. Runs generateHardLogicDevices(),
 * handles scoring-path retry and schema validation, computes hardLogicDirectives,
 * and writes ctx.hardLogicDevices + ctx.hardLogicDirectives.
 *
 * Pillar 1: when enableLockedFactRegistry is true, also populates
 * ctx.lockedFactRegistry from the primary device and emits locked-facts-{runId}.json
 * to apps/worker/logs/.
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";

import {
  generateHardLogicDevices,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  judgeMechanismPlausibility,
  buildPlausibilityJudgeFeedback,
  AGENT3B_PLAUSIBILITY_FLOOR,
  extractThemeMechanismFamilies,
} from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import { HardLogicScorer, scoreRealHardLogic } from "@cml/story-validation";
import { adaptHardLogicForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  mergeHardLogicDirectives,
  applyHonestScorer,
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
        return { adapted, score: applyHonestScorer(score, () => scoreRealHardLogic(hlResult.devices), ctx.warnings, "agent3b-hard-logic") };
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

  // ── P2.2 (T2.4): Independent mechanism-plausibility judge (AGENT3B_PLAUSIBILITY_JUDGE) ──
  // Default OFF ⇒ skipped, behaviour byte-identical. shadow ⇒ judge the primary device + log the
  // score, no behaviour change. enforce ⇒ bounded regenerate-with-feedback while below the floor,
  // accept the best candidate by score, re-validate schema each time, never throw. There is no
  // upstream skip decision for Agent 3b, so gating lives entirely here (Phase-1 novelty trap N/A).
  const plausibilityMode = parsePlausibilityJudgeMode(process.env.AGENT3B_PLAUSIBILITY_JUDGE);
  if (plausibilityMode !== "off" && ctx.hardLogicDevices!.devices.length > 0) {
    const judgeCtx = {
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    };
    // enforce retries are bounded both ways (Phase-1 lesson: "Infinity" must not defeat "bounded").
    const boundedRetries =
      plausibilityMode === "enforce"
        ? Math.min(3, Math.max(0, Math.trunc(Number(process.env.AGENT3B_PLAUSIBILITY_MAX_RETRIES ?? 1)) || 0))
        : 0;

    const accrueJudgeCost = (cost: number, durationMs: number) => {
      ctx.agentCosts["agent3b_hard_logic_devices"] =
        (ctx.agentCosts["agent3b_hard_logic_devices"] || 0) + cost;
      ctx.agentDurations["agent3b_hard_logic_devices"] =
        (ctx.agentDurations["agent3b_hard_logic_devices"] || 0) + durationMs;
    };

    let bestDevices = ctx.hardLogicDevices!;
    let bestJudge = await judgeMechanismPlausibility(ctx.client, bestDevices.devices[0], judgeCtx);
    if (bestJudge.ran) accrueJudgeCost(bestJudge.cost, bestJudge.durationMs);

    let attempt = 0;
    while (
      plausibilityMode === "enforce" &&
      bestJudge.ran &&
      !plausibilityGatePass(bestJudge.score) &&
      attempt < boundedRetries
    ) {
      attempt += 1;
      const feedback = buildPlausibilityJudgeFeedback(bestJudge);
      ctx.warnings.push(
        `[agent3b-plausibility][enforce] score ${bestJudge.score} < ${AGENT3B_PLAUSIBILITY_FLOOR} ` +
          `(attempt ${attempt}/${boundedRetries}); regenerating with plausibility feedback.`,
      );
      const regenStart = Date.now();
      // True marginal cost via byAgent delta — the generator's returned .cost is a cumulative total.
      const genLabel = "Agent3b-HardLogicDeviceGenerator";
      const genCostBefore = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      let regenerated: Awaited<ReturnType<typeof generateHardLogicDevices>>;
      try {
        regenerated = await generateHardLogicDevices(ctx.client, {
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: appendRetryFeedback(ctx.inputs.tone || ctx.inputs.narrativeStyle || "Golden Age Mystery", feedback),
          theme: appendRetryFeedback(ctx.inputs.theme || "", feedback),
          primaryAxis: ctx.primaryAxis,
          mechanismFamilies: ctx.initialHardLogicDirectives.mechanismFamilies,
          hardLogicModes: ctx.initialHardLogicDirectives.hardLogicModes,
          difficultyMode: ctx.initialHardLogicDirectives.difficultyMode,
          noveltyConstraints: ctx.noveltyConstraints,
        });
      } catch (err) {
        // A gate must never kill a run: a regeneration failure keeps the best-so-far.
        ctx.warnings.push(`[agent3b-plausibility][enforce] regeneration error: ${(err as Error).message}; keeping previous best.`);
        break;
      }
      const genCostAfter = ctx.client.getCostTracker().getSummary().byAgent[genLabel] || 0;
      accrueJudgeCost(Math.max(0, genCostAfter - genCostBefore), Date.now() - regenStart);

      // Re-validate the regenerated candidate before considering it (Phase-1: re-validate mutations).
      const regenValidation = validateArtifact("hard_logic_devices", regenerated);
      if (!regenValidation.valid) {
        ctx.warnings.push(
          "[agent3b-plausibility][enforce] regenerated candidate failed schema validation; keeping previous best.",
        );
        continue;
      }
      const regenJudge = await judgeMechanismPlausibility(ctx.client, regenerated.devices[0], judgeCtx);
      if (regenJudge.ran) accrueJudgeCost(regenJudge.cost, regenJudge.durationMs);
      // A_50 §9.3: accept-best-by-score, but NEVER trade a theme-coherent primary for an off-theme
      // one — a more "plausible" tide device that abandons the locked clock theme makes the case
      // incoherent (the probe's regen did exactly this). Recovering theme-coherence the current best
      // lacks is always worth accepting; otherwise fall back to the plausibility-score rank.
      const bestThemeOk = bestDevices.matchedThemePrimary === true;
      const regenThemeOk = regenerated.matchedThemePrimary === true;
      const acceptRegen =
        regenJudge.ran &&
        (regenThemeOk || !bestThemeOk) &&
        ((regenThemeOk && !bestThemeOk) || regenJudge.score > bestJudge.score);
      if (acceptRegen) {
        bestDevices = regenerated;
        bestJudge = regenJudge;
      } else if (regenJudge.ran && regenJudge.score > bestJudge.score && bestThemeOk && !regenThemeOk) {
        ctx.warnings.push(
          `[agent3b-plausibility][enforce] rejected a higher-plausibility regen (score ${regenJudge.score} > ` +
            `${bestJudge.score}) because it abandoned the locked theme family; keeping theme-coherent primary.`,
        );
      }
    }

    ctx.hardLogicDevices = bestDevices;
    const gateState =
      plausibilityMode === "enforce"
        ? plausibilityGatePass(bestJudge.score)
          ? "pass"
          : `accept-after-${attempt}`
        : "shadow";
    ctx.warnings.push(
      `[agent3b-plausibility][${plausibilityMode}] gate=${gateState} score=${bestJudge.score} ` +
        `ran=${bestJudge.ran}${bestJudge.error ? ` error=${bestJudge.error}` : ""}`,
    );
  }

  // A_50 §9.3: telemetry — if the theme commits to a concrete mechanism family but no generated
  // device realized it (off-theme primary), the locked-fact registry/CML will diverge from the
  // theme. Surface it (never abort) so the prompt fix's effect is observable across runs.
  const lockedThemeFamilies = extractThemeMechanismFamilies(
    ctx.inputs.theme,
    ctx.initialHardLogicDirectives.mechanismFamilies,
  );
  if (lockedThemeFamilies.length > 0 && ctx.hardLogicDevices!.matchedThemePrimary !== true) {
    ctx.warnings.push(
      `[agent3b-theme-lock] theme commits to [${lockedThemeFamilies.join(", ")}] but no device realized it; ` +
        `primary device ("${ctx.hardLogicDevices!.devices[0]?.title ?? "?"}") is off-theme — locked facts may diverge from the case.`,
    );
  }

  ctx.hardLogicDirectives = mergeHardLogicDirectives(
    ctx.initialHardLogicDirectives,
    ctx.hardLogicDevices!.devices,
  );

  // ── Pillar 1 (Unit 1.1 + 1.2): Build LockedFactRegistry from primary device ──
  if (ctx.inputs.enableLockedFactRegistry) {
    const primaryDevice = ctx.hardLogicDevices!.devices[0];
    const rawFacts: Array<{ id?: unknown; value?: unknown; description?: unknown }> =
      Array.isArray(primaryDevice?.lockedFacts) ? primaryDevice.lockedFacts : [];

    ctx.lockedFactRegistry = rawFacts
      .filter((f) => typeof f.id === "string" && typeof f.value === "string" && (f.value as string).trim().length > 0)
      .map((f) => ({
        id: (f.id as string).trim(),
        value: (f.value as string).trim(),
        description: typeof f.description === "string" ? (f.description as string).trim() : "",
      }));

    // Emit to apps/worker/logs/locked-facts-{runId}.json for observability
    try {
      const logsDir = join(ctx.workerAppRoot, "logs");
      if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
      writeFileSync(
        join(logsDir, `locked-facts-${ctx.runId}.json`),
        JSON.stringify({ runId: ctx.runId, registry: ctx.lockedFactRegistry }, null, 2),
        "utf8",
      );
    } catch (err) {
      ctx.warnings.push(`Pillar 1: failed to write locked-facts file: ${String(err)}`);
    }

    ctx.warnings.push(
      `Pillar 1: locked fact registry built with ${ctx.lockedFactRegistry.length} fact(s): ` +
        ctx.lockedFactRegistry.map((f) => `${f.id}="${f.value}"`).join(", "),
    );
  }

  ctx.reportProgress("hard_logic_devices", `Generated ${ctx.hardLogicDevices!.devices.length} novel hard-logic devices`, 31);
}
