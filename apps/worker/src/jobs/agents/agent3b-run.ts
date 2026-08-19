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
  scoreDeviceThemeMatch,
} from "@cml/prompts-llm";
// X38 — the case checked against itself, at the £0.03 end of the pipeline (REVIEW_09 §3).
import { validateArtifact, checkCaseTimeCoherence } from "@cml/cml";
import { HardLogicScorer, scoreRealHardLogic } from "@cml/story-validation";
import { adaptHardLogicForScoring } from "../scoring-adapters/index.js";
import {
  type OrchestratorContext,
  executeAgentWithRetry,
  appendRetryFeedback,
  mergeHardLogicDirectives,
  applyHonestScorer,
} from "./shared.js";

// A_53 P6 (lockedfact-digit-form-not-repaired): convert digit/metric values in a locked-fact value to
// era word-form at REGISTRY BUILD, so the enforced ground truth matches era-word prose (a digit value
// like "10:50 PM" never substring-matches "ten-fifty" prose → permanent false warning + Agent 9 told
// to inject the era-violating digits). Holistic + parameter-free: pure number→word conversion.
const numberToWordsSmall = (n: number): string => {
  const ones = [
    "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven",
    "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
  ];
  const tens = ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"];
  if (n < 0 || n >= 100) return String(n); // leave large/negative numbers as-is
  if (n < 20) return ones[n];
  const t = Math.floor(n / 10);
  const o = n % 10;
  return o === 0 ? tens[t] : `${tens[t]}-${ones[o]}`;
};

const wordifyLockedFactValue = (value: string): string => {
  let out = value;
  // Clock times: "10:50 PM", "10:50 p.m.", "10:50" → "ten-fifty" / "ten o'clock" (era word-form;
  // surrounding prose carries the meridiem, which the canonical value omits).
  out = out.replace(/\b(\d{1,2}):(\d{2})\s*(?:a\.?m\.?|p\.?m\.?)?/gi, (_m, h: string, min: string) => {
    const hour = parseInt(h, 10);
    const minute = parseInt(min, 10);
    if (hour > 23 || minute > 59) return _m;
    const hour12 = ((hour + 11) % 12) + 1;
    const hourWord = numberToWordsSmall(hour12);
    return minute === 0 ? `${hourWord} o'clock` : `${hourWord}-${numberToWordsSmall(minute)}`;
  });
  // Standalone small number before a measurement word: "4 metres" → "four metres".
  out = out.replace(/\b(\d{1,2})\b(?=\s+[a-zA-Z])/g, (_m, d: string) => numberToWordsSmall(parseInt(d, 10)));
  return out;
};


/**
 * Write `locked-facts-{runId}.json`.
 *
 * EXPORTED, and called twice per run — found on review 2026-08-18. The registry is BUILT here from the
 * device, but X51 appends the case's own facts (the weapon, each suspect's alibi location) at the end
 * of `runAgent3`, which happens later. With a single write at build time the artifact showed only the
 * device's clock times, so an audit of a future run would read this file and conclude the weapon and
 * alibi pins never landed. This project diagnoses runs from artifacts; an artifact that is a snapshot
 * of an intermediate state is worse than none.
 */
export function writeLockedFactsArtifact(ctx: OrchestratorContext): void {
  try {
    const logsDir = join(ctx.workerAppRoot, "logs");
    if (!existsSync(logsDir)) mkdirSync(logsDir, { recursive: true });
    writeFileSync(
      join(logsDir, `locked-facts-${ctx.runId}.json`),
      JSON.stringify({ runId: ctx.runId, registry: ctx.lockedFactRegistry ?? [] }, null, 2),
      "utf8",
    );
  } catch (err) {
    ctx.warnings.push(`Pillar 1: failed to write locked-facts file: ${String(err)}`);
  }
}

export async function runAgent3b(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("hard_logic_devices", "Generating novel hard-logic device concepts...", 28);

  const setting = ctx.setting!;
  const cast = ctx.cast!;
  const backgroundContext = ctx.backgroundContext!;

  // A_53 P11 (plausibility-regen-reuses-stale-theme-families): the locked mechanism families that the
  // theme commits to were previously re-derived in ~3 places with different inputs (the generator's
  // internal extract, the plausibility-regen guard's `matchedThemePrimary` flags, and the theme-lock
  // telemetry below). Because the generator computed `matchedThemePrimary` from the *initial* directives'
  // abstract axis families — which the keyword map can't see — the "never trade theme for plausibility"
  // guard silently never engaged. Compute ONE canonical family list here from the same inputs and reuse it
  // for every theme-coherence decision in this file, so the guard and the telemetry agree. Stored on ctx
  // for any downstream cross-agent reuse. Holistic: derived purely from the theme prose + structured hints.
  const lockedThemeFamilies = extractThemeMechanismFamilies(
    ctx.inputs.theme,
    ctx.initialHardLogicDirectives.mechanismFamilies,
  );
  (ctx as { lockedThemeFamilies?: string[] }).lockedThemeFamilies = lockedThemeFamilies;
  // Whether a result's PRIMARY device (devices[0], the source of the locked-fact registry + CML) realizes
  // the canonical locked families. Re-derived locally against ONE family list rather than trusting the
  // generator's `matchedThemePrimary` (which was computed from a possibly-different family list). When the
  // theme leaves the mechanism open (no locked families) this is vacuously false — matching the prior
  // semantics where the guard short-circuits and full novelty is preserved.
  const primaryRealizesTheme = (devices: { devices: Array<Parameters<typeof scoreDeviceThemeMatch>[0]> }): boolean =>
    lockedThemeFamilies.length > 0 &&
    devices.devices.length > 0 &&
    scoreDeviceThemeMatch(devices.devices[0], lockedThemeFamilies) > 0;

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
      // A_53 P11 (plausibility-regen-reuses-stale-theme-families): judge theme-coherence against the
      // single canonical family list, not the generator's `matchedThemePrimary` (computed from a
      // different family list) — that mismatch is why this guard silently never engaged.
      const bestThemeOk = primaryRealizesTheme(bestDevices);
      const regenThemeOk = primaryRealizesTheme(regenerated);
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
  // A_53 P11 (plausibility-regen-reuses-stale-theme-families): reuse the single canonical
  // `lockedThemeFamilies` computed once at the top and the local `primaryRealizesTheme` check, so the
  // telemetry agrees with the regen guard instead of re-deriving from possibly-different inputs.
  if (lockedThemeFamilies.length > 0 && !primaryRealizesTheme(ctx.hardLogicDevices!)) {
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
      .map((f) => {
        const id = (f.id as string).trim();
        const original = (f.value as string).trim();
        const value = wordifyLockedFactValue(original);
        if (value !== original) {
          ctx.warnings.push(`Pillar 1: repaired digit-form locked fact ${id} "${original}" → "${value}" (era word-form)`);
        }
        return {
          id,
          value,
          description: typeof f.description === "string" ? (f.description as string).trim() : "",
        };
      });

    // Emit to apps/worker/logs/locked-facts-{runId}.json for observability.
    writeLockedFactsArtifact(ctx);

    ctx.warnings.push(
      `Pillar 1: locked fact registry built with ${ctx.lockedFactRegistry.length} fact(s): ` +
        ctx.lockedFactRegistry.map((f) => `${f.id}="${f.value}"`).join(", "),
    );

    /**
     * X38 (REVIEW_09 §3) — the device's own arithmetic, at the cheapest end of the pipeline.
     *
     * The 08-15 device declared `murder_time_displayed` 7:15, `chime_recorded_time` 7:05 and
     * `pendulum_delay_duration` "fourteen minutes". 7:15 − 7:05 is ten. These values are injected into
     * the prose VERBATIM, so the contradiction shipped, and the cold read led with it and marked the
     * clue logic 6/10.
     *
     * Here rather than at acceptance because Agent 9 cannot repair it: a locked fact is contractual,
     * and a chapter rewritten to reconcile the numbers would contradict the registry. This is the
     * moment the case is still cheap to fix — before an outline, before £1 of prose written against it.
     */
    for (const violation of checkCaseTimeCoherence({ lockedFacts: ctx.lockedFactRegistry })) {
      ctx.warnings.push(`[X38] Pillar 1 case-time incoherence (${violation.code}): ${violation.message}`);
    }
  }

  ctx.reportProgress("hard_logic_devices", `Generated ${ctx.hardLogicDevices!.devices.length} novel hard-logic devices`, 31);
}
