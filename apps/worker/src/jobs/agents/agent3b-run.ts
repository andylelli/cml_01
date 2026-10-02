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

import { runBoundedGate } from "./quality-gate.js";
import { scoreHardLogicPhase } from "./phase-scoring.js";
// A_74 §8 DE8 — the curated device corpus, retrieved deterministically. See device-library-block.ts.
import { buildDeviceLibraryBlock } from "../device-library-block.js";
import { assignedFamilyFromTheme } from "../cell-scheduler.js";

import {
  generateHardLogicDevices,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  judgeMechanismPlausibility,
  buildPlausibilityJudgeFeedback,
  AGENT3B_PLAUSIBILITY_FLOOR,
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
  type SettingRefinementResult,
  type CastDesignResult,
  type BackgroundContextArtifact,
} from "@cml/prompts-llm";
// X38 — the case checked against itself, at the £0.03 end of the pipeline (REVIEW_09 §3).
import {
  validateArtifact,
} from "@cml/cml";
import {
  type OrchestratorContext,
  runStage,
  appendRetryFeedback,
  mergeHardLogicDirectives,
} from "./shared.js";
import {
  buildLockedFactRegistryPhase,
} from "./agent3b/locked-fact-registry.js";
// Re-exported so existing importers of this module keep their path.
export {
  applyDeclaredDerivationCheck,
  impliedIntervalFactId,
  isDeclaredDerivationsEnabled,
  isRepairImpliedIntervalEnabled,
  reconcileDeviceArithmetic,
  reportCaseTemporalCoherence,
  stripLeadingArticleFromLockedValue,
  writeLockedFactsArtifact,
} from "./agent3b/locked-fact-registry.js";


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

  /**
   * A_74 §8 DE8 — retrieve ONCE, here, and pass the same block to all three generate calls below.
   *
   * All three (first pass, scoring-path retry, plausibility regen) must see identical raw material.
   * A retry that silently retrieved a different corpus would make "the retry produced a better
   * device" unattributable, which is the same class of defect as A_53 P11 directly above: one
   * concept re-derived in three places with different inputs.
   */
  const scheduledFamily = assignedFamilyFromTheme(ctx.inputs.theme);
  const deviceLibraryBlock = buildDeviceLibraryBlock({
    decade: Number(String(setting.setting.era.decade).replace(/[^0-9]/g, "")) || 1930,
    primaryAxis: ctx.primaryAxis,
    noveltyFamily: scheduledFamily ?? undefined,
    limit: 4,
  });
  if (scheduledFamily) {
    console.warn(`[DE5/DE8] theme carries a scheduled mechanism assignment: ${scheduledFamily}`);
  }
  // Whether a result's PRIMARY device (devices[0], the source of the locked-fact registry + CML) realizes
  // the canonical locked families. Re-derived locally against ONE family list rather than trusting the
  // generator's `matchedThemePrimary` (which was computed from a possibly-different family list). When the
  // theme leaves the mechanism open (no locked families) this is vacuously false — matching the prior
  // semantics where the guard short-circuits and full novelty is preserved.
  const primaryRealizesTheme = (devices: { devices: Array<Parameters<typeof scoreDeviceThemeMatch>[0]> }): boolean =>
    lockedThemeFamilies.length > 0 &&
    devices.devices.length > 0 &&
    scoreDeviceThemeMatch(devices.devices[0], lockedThemeFamilies) > 0;

  await generateDevices(ctx, setting, deviceLibraryBlock, cast, backgroundContext);

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

    const judge = async (devices: NonNullable<typeof ctx.hardLogicDevices>) => {
      const verdict = await judgeMechanismPlausibility(ctx.client, devices.devices[0], judgeCtx);
      if (verdict.ran) accrueJudgeCost(verdict.cost, verdict.durationMs);
      return verdict;
    };
    const { best: bestDevices, verdict: bestJudge, attempts: attempt } = await runBoundedGate(ctx, {
      label: "agent3b-plausibility",
      enforce: plausibilityMode === "enforce",
      maxRetries: boundedRetries,
      initial: ctx.hardLogicDevices!,
      evaluate: judge,
      needsRetry: (j) => j.ran && !plausibilityGatePass(j.score),
      feedback: (_best, j) => buildPlausibilityJudgeFeedback(j),
      retryWarning: (j, n, max) =>
        `[agent3b-plausibility][enforce] score ${j.score} < ${AGENT3B_PLAUSIBILITY_FLOOR} ` +
        `(attempt ${n}/${max}); regenerating with plausibility feedback.`,
      regenerate: (feedback) => generateHardLogicDevices(ctx.client, deviceInputs(ctx, setting, deviceLibraryBlock, feedback)),
      costLabel: "Agent3b-HardLogicDeviceGenerator",
      costKey: "agent3b_hard_logic_devices",
      // Re-validate the regenerated candidate before considering it (Phase-1: re-validate mutations).
      validate: (candidate) => validateArtifact("hard_logic_devices", candidate).valid,
      // A_50 §9.3: accept-best-by-score, but NEVER trade a theme-coherent primary for an off-theme
      // one — a more "plausible" tide device that abandons the locked clock theme makes the case
      // incoherent (the probe's regen did exactly this). Recovering theme-coherence the current best
      // lacks is always worth accepting; otherwise fall back to the plausibility-score rank.
      // A_53 P11 (plausibility-regen-reuses-stale-theme-families): judge theme-coherence against the
      // single canonical family list, not the generator's `matchedThemePrimary` (computed from a
      // different family list) — that mismatch is why this guard silently never engaged.
      isBetter: (regen, cur) => {
        const bestThemeOk = primaryRealizesTheme(cur.value);
        const regenThemeOk = primaryRealizesTheme(regen.value);
        const accept =
          regen.verdict.ran &&
          (regenThemeOk || !bestThemeOk) &&
          ((regenThemeOk && !bestThemeOk) || regen.verdict.score > cur.verdict.score);
        if (!accept && regen.verdict.ran && regen.verdict.score > cur.verdict.score && bestThemeOk && !regenThemeOk) {
          ctx.warnings.push(
            `[agent3b-plausibility][enforce] rejected a higher-plausibility regen (score ${regen.verdict.score} > ` +
              `${cur.verdict.score}) because it abandoned the locked theme family; keeping theme-coherent primary.`,
          );
        }
        return accept;
      },
    });
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
  await buildLockedFactRegistryPhase(ctx, setting, deviceLibraryBlock);

  ctx.reportProgress("hard_logic_devices", `Generated ${ctx.hardLogicDevices!.devices.length} novel hard-logic devices`, 31);
}

/**
 * CR-21 (ORC-02): the one generateHardLogicDevices input — the scored attempt and the plausibility regen.
 * The two copies differed only in `theme`: `ctx.inputs.theme || ""` here, bare in the scored attempt,
 * where a retry with an undefined theme would have thrown in appendRetryFeedback. theme is a string
 * on every path that reaches Agent 3b (the API composes it; resume defaults it), so the prompt is unchanged.
 */
function deviceInputs(ctx: OrchestratorContext, setting: SettingRefinementResult, deviceLibraryBlock: string, feedback?: string): Parameters<typeof generateHardLogicDevices>[1] {
  return {
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
    deviceLibraryBlock,
  };
}
async function generateDevices(ctx: OrchestratorContext, setting: SettingRefinementResult, deviceLibraryBlock: string, cast: CastDesignResult, backgroundContext: BackgroundContextArtifact) {
  ctx.hardLogicDevices = await runStage(ctx, {
    agentId: "agent3b_hard_logic_devices",
    phaseName: "Hard Logic Devices",
    generate: async () => {
      const hlResult = await generateHardLogicDevices(ctx.client, deviceInputs(ctx, setting, deviceLibraryBlock));
      return { result: hlResult, cost: hlResult.cost };
    },
    score: async (hlResult) => scoreHardLogicPhase(hlResult.devices, setting.setting, cast.cast, backgroundContext, ctx.warnings),
  });
}

