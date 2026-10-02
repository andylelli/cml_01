/**
 * The per-phase scoring step of each upstream agent: the honest scorer on the real artifact.
 *
 * CR-03 / SCO-12: these bodies were closures inside each runner's `executeAgentWithRetry` call, so the
 * only way to exercise them was a run. Moved here verbatim (inputs made explicit, nothing else changed)
 * so `apps/worker/src/__tests__/phase-scoring-golden.test.ts` can characterise every phase against the committed
 * `eval/golden` bundles, and a change to an adapter, scorer or honest scorer shows as a snapshot diff.
 *
 * Agent 3's vanity score is built from run counters (attempts, repairs) and stays in its runner; its
 * honest scorer `scoreRealCml` is characterised directly.
 *
 * SCO-Q07 (owner decision, 2026-10-02): 2b, 2d and 6.5 — the last vanity scorers and their adapters — are
 * replaced by honest tables; every wired upstream phase is now an honest score.
 *
 * A1X-Q02 (owner decision, 2026-10-02): Agents 1, 2 and 2c score the SHIPPED artifact. Their runners generate
 * through `runUnscoredStage` and call `recordShippedPhaseScore` once their post-processing (backfill,
 * normalisation, genders, sensory atoms and fallbacks, the scene gate) has run — as Agent 5 does.
 */
import type { CastCheckResult } from "@cml/prompts-llm";
import { computeActSceneCounts } from "@cml/prompts-llm";
import type { PhaseScore } from "@cml/story-validation";
import {
getChapterTargetTolerance,
getSceneTarget,
scoreRealBackground,
scoreRealCast,
scoreRealCharacterProfiles,
scoreRealHardLogic,
scoreRealLocations,
scoreRealNarrative,
scoreRealSetting,
scoreRealTemporalContext,
scoreRealWorldDocument
} from "@cml/story-validation";
import { describeError } from "./run-utils.js";
import { honestScore, runStage, type StageRunContext, type StageSpec } from "./shared.js";

export interface ScoredPhase<A> {
  adapted: A;
  score: PhaseScore;
}

type AnyObj = any;

/** Agent 1 — setting refinement. */
export async function scoreSettingPhase(setting: AnyObj, _warnings: string[]): Promise<ScoredPhase<unknown>> {
  return { adapted: setting, score: honestScore(() => scoreRealSetting(setting), "agent1-setting") };
}

/** Agent 2 — cast design. `check` is `checkCast` (injected so a test can stub it). */
export async function scoreCastPhase(
  cast: AnyObj,
  setting: AnyObj,
  castSize: number,
  check: (cast: AnyObj, opts: { expectedCount: number }) => CastCheckResult,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  void setting; void warnings;
  return {
    adapted: cast,
    score: honestScore(() => scoreRealCast(cast, check(cast, { expectedCount: castSize }), { expectedCount: castSize }), "agent2-cast"),
  };
}

/** Agent 2b — character profiles, against the cast roster and the CML's culprit. */
export async function scoreCharacterProfilesPhase(profiles: AnyObj, cast: AnyObj, cml: AnyObj): Promise<ScoredPhase<unknown>> {
  return { adapted: profiles, score: honestScore(() => scoreRealCharacterProfiles(profiles, cast, cml), "agent2b-character-profiles") };
}

/** Agent 2c — location profiles. */
export async function scoreLocationsPhase(
  locResult: AnyObj,
  setting: AnyObj,
  backgroundContext: AnyObj,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  void setting; void backgroundContext; void warnings;
  return { adapted: locResult, score: honestScore(() => scoreRealLocations(locResult), "agent2c-location") };
}

/** Agent 2d — temporal context, against the setting's decade. */
export async function scoreTemporalContextPhase(tempResult: AnyObj, setting: AnyObj, backgroundContext: AnyObj): Promise<ScoredPhase<unknown>> {
  void backgroundContext;
  return { adapted: tempResult, score: honestScore(() => scoreRealTemporalContext(tempResult, setting), "agent2d-temporal-context") };
}

/** Agent 2e — background context. */
export async function scoreBackgroundPhase(
  backgroundContext: AnyObj,
  setting: AnyObj,
  cast: AnyObj,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  void warnings;
  return {
    adapted: backgroundContext,
    score: honestScore(
      () => scoreRealBackground(backgroundContext, {
        castRoster: (((cast as any)?.characters ?? []) as any[]).map((c) => String(c?.name ?? "")).filter(Boolean),
        agent1Echo: [
          setting.location?.description,
          setting.atmosphere?.mood,
          setting.atmosphere?.visualDescription,
        ].filter((x): x is string => Boolean(x)),
      }),
      "agent2e-background",
    ),
  };
}

/** Agent 3b — hard-logic devices. */
export async function scoreHardLogicPhase(
  devices: AnyObj,
  setting: AnyObj,
  cast: AnyObj,
  backgroundContext: AnyObj,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  void setting; void cast; void backgroundContext; void warnings;
  return { adapted: devices, score: honestScore(() => scoreRealHardLogic(devices), "agent3b-hard-logic") };
}

/** Agent 6.5 — world document, against the CML's cast (victims optional) and decade. */
export async function scoreWorldDocumentPhase<W>(worldDoc: W, cml: AnyObj): Promise<ScoredPhase<W>> {
  return { adapted: worldDoc, score: honestScore(() => scoreRealWorldDocument(worldDoc as any, cml), "agent65-world-builder") };
}

/** Agent 7 — narrative outline, with the scene-count gate that forces F outside tolerance. */
export async function scoreNarrativePhase(
  narrativeResult: AnyObj,
  cml: AnyObj,
  cast: AnyObj,
  targetLength: "short" | "medium" | "long" | undefined,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  void cml; void cast;
  // Owner decision 8: the honest score, with the scene-count gate applied ON TOP of it. The gate used to run
  // before the honest swap, so an out-of-tolerance outline was recorded with vanity numbers even under enforce.
  const adapted = narrativeResult;
  const score = honestScore(() => scoreRealNarrative(narrativeResult, targetLength ?? "medium"), "agent7-narrative");

  // Scene-count gate inside the scoring path: force F only when the deviation
  // exceeds the configured tolerance (±getChapterTargetTolerance()).  Counts within
  // tolerance are accepted — prose generates one chapter per scene so a ±2 deviation
  // doesn't break the story structure.
  const actualSceneCount = (narrativeResult.acts ?? []).flatMap((a: any) =>
    Array.isArray(a.scenes) ? a.scenes : []
  ).length;
  const expectedSceneCount = getSceneTarget(targetLength ?? "medium");
  const sceneCountTolerance = getChapterTargetTolerance();
  if (Math.abs(actualSceneCount - expectedSceneCount) > sceneCountTolerance) {
    // Use the SAME act-distribution ratios that buildUserRequest() uses so the
    // retry feedback tells the LLM exactly what the prompt already asked for.
    const { act1: actI, act2: actII, act3: actIII } = computeActSceneCounts(expectedSceneCount); // A7-05
    return {
      adapted,
      score: {
        ...score,
        total: 0,
        grade: 'F' as const,
        passed: false,
        failure_reason:
          `Scene count: generated ${actualSceneCount} scenes but target is ${expectedSceneCount} ` +
          `(tolerance ±${sceneCountTolerance}; deviation of ${Math.abs(actualSceneCount - expectedSceneCount)} exceeds limit). ` +
          `Distribute as: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
          `(these are exact counts, not ranges). Do not merge or drop scenes — ` +
          `each scene becomes a distinct prose chapter.`,
        component_failures: [
          ...(score.component_failures ?? []),
          `scene_count (${actualSceneCount} vs target ${expectedSceneCount}, tolerance ±${sceneCountTolerance})`,
        ],
      },
    };
  }

  void warnings;
  return { adapted, score };
}

/**
 * A1X-Q02 — the stage's generate step, timed and costed exactly as `runStage` does, WITHOUT scoring the raw
 * output: the runner scores the shipped artifact with `recordShippedPhaseScore` after its post-processing.
 * With scoring on or off this is `runStage`'s scoring-off branch — one `generate()`, the same inputs.
 */
export async function runUnscoredStage<T>(
  ctx: StageRunContext,
  spec: Pick<StageSpec<T>, "agentId" | "phaseName" | "generate">,
): Promise<T> {
  return runStage({ ...stageContextOf(ctx), enableScoring: false }, {
    ...spec,
    score: async () => { throw new Error(`${spec.phaseName}: scored after post-processing (A1X-Q02)`); },
  });
}

const stageContextOf = (ctx: StageRunContext): StageRunContext => ({
  enableScoring: ctx.enableScoring,
  scoreAggregator: ctx.scoreAggregator,
  retryManager: ctx.retryManager,
  scoringLogger: ctx.scoringLogger,
  runId: ctx.runId,
  projectId: ctx.projectId,
  warnings: ctx.warnings,
  savePartialReport: ctx.savePartialReport,
  agentCosts: ctx.agentCosts,
  agentDurations: ctx.agentDurations,
});

/**
 * A1X-Q02 — score the artifact the stage SHIPS and record it as `runStage` would have recorded the raw one:
 * upsert, scoring log, partial report, the below-threshold warning; a scorer error is logged and warned, never
 * thrown. Duration and cost are the stage's ledger entries, so a schema re-roll's time and cost are included.
 */
export async function recordShippedPhaseScore(
  ctx: StageRunContext,
  agentId: string,
  phaseName: string,
  score: () => Promise<ScoredPhase<unknown>>,
): Promise<void> {
  if (!(ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger)) return;
  const durationMs = ctx.agentDurations[agentId] ?? 0;
  const cost = ctx.agentCosts[agentId] ?? 0;
  try {
    const { score: phaseScore } = await score();
    ctx.scoreAggregator.upsertPhaseScore(agentId, phaseName, phaseScore, durationMs, cost);
    ctx.scoringLogger.logPhaseScore(agentId, phaseName, phaseScore, durationMs, cost, ctx.runId, ctx.projectId || "");
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
    if (!ctx.scoreAggregator.passesThreshold(phaseScore)) {
      ctx.warnings.push(`${phaseName}: below threshold (score ${phaseScore.total}/100, ${phaseScore.grade}) — recorded, not retried`);
    }
  } catch (scoringError) {
    ctx.scoringLogger.logScoringError(agentId, phaseName, scoringError, ctx.runId, ctx.projectId || "");
    ctx.warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
  }
}
