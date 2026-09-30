/**
 * The per-phase scoring step of each upstream agent: adapter → vanity scorer → honest scorer.
 *
 * CR-03 / SCO-12: these bodies were closures inside each runner's `executeAgentWithRetry` call, so the
 * only way to exercise them was a run. Moved here verbatim (inputs made explicit, nothing else changed)
 * so `apps/worker/src/__tests__/phase-scoring-golden.test.ts` can characterise every phase against the committed
 * `eval/golden` bundles, and a change to an adapter, scorer or honest scorer shows as a snapshot diff.
 *
 * Agent 3's vanity score is built from run counters (attempts, repairs) and stays in its runner; its
 * honest scorer `scoreRealCml` is characterised directly.
 */
import { computeActSceneCounts } from "@cml/prompts-llm";
import type { CastCheckResult } from "@cml/prompts-llm";
import {
  Agent65WorldBuilderScorer,
  BackgroundContextScorer,
  CastDesignScorer,
  CharacterProfilesScorer,
  HardLogicScorer,
  LocationProfilesScorer,
  NarrativeScorer,
  SettingRefinementScorer,
  TemporalContextScorer,
  getChapterTargetTolerance,
  getSceneTarget,
  scoreRealBackground,
  scoreRealCast,
  scoreRealHardLogic,
  scoreRealLocations,
  scoreRealNarrative,
  scoreRealSetting,
} from "@cml/story-validation";
import type { PhaseScore } from "@cml/story-validation";
import {
  adaptBackgroundContextForScoring,
  adaptCastForScoring,
  adaptCharacterProfilesForScoring,
  adaptHardLogicForScoring,
  adaptLocationsForScoring,
  adaptNarrativeForScoring,
  adaptSettingForScoring,
  adaptTemporalContextForScoring,
  type ClueRef,
} from "../scoring-adapters/index.js";
import { applyHonestScorer } from "./shared.js";

export interface ScoredPhase<A> {
  adapted: A;
  score: PhaseScore;
}

type AnyObj = any;

/** Agent 1 — setting refinement. */
export async function scoreSettingPhase(setting: AnyObj, warnings: string[]): Promise<ScoredPhase<unknown>> {
  const scorer = new SettingRefinementScorer();
  const adapted = adaptSettingForScoring(setting);
  const score = await scorer.score({}, adapted, {
    previous_phases: {},
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return { adapted, score: applyHonestScorer(score, () => scoreRealSetting(setting), warnings, "agent1-setting") };
}

/** Agent 2 — cast design. `check` is `checkCast` (injected so a test can stub it). */
export async function scoreCastPhase(
  cast: AnyObj,
  setting: AnyObj,
  castSize: number,
  check: (cast: AnyObj, opts: { expectedCount: number }) => CastCheckResult,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  const scorer = new CastDesignScorer();
  const adapted = adaptCastForScoring(cast);
  const scorerInput = {
    cast_size: castSize,
  };
  const score = await scorer.score(scorerInput, adapted, {
    previous_phases: { agent1_setting: setting },
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return {
    adapted,
    score: applyHonestScorer(
      score,
      () => scoreRealCast(cast, check(cast, { expectedCount: scorerInput.cast_size }), { expectedCount: scorerInput.cast_size }),
      warnings,
      "agent2-cast",
    ),
  };
}

/** Agent 2b — character profiles (no honest scorer). */
export async function scoreCharacterProfilesPhase(profiles: AnyObj, cast: AnyObj, cml: AnyObj): Promise<ScoredPhase<unknown>> {
  const scorer = new CharacterProfilesScorer();
  const adapted = adaptCharacterProfilesForScoring(profiles);
  const score = await scorer.score({}, adapted, {
    previous_phases: { agent2_cast: cast },
    cml,
    threshold_config: { mode: "standard" },
  });
  return { adapted, score };
}

/** Agent 2c — location profiles. */
export async function scoreLocationsPhase(
  locResult: AnyObj,
  setting: AnyObj,
  backgroundContext: AnyObj,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  const scorer = new LocationProfilesScorer();
  const adapted = adaptLocationsForScoring(locResult);
  const score = await scorer.score({}, adapted, {
    previous_phases: {
      agent1_setting: setting,
      agent2e_background_context: backgroundContext,
    },
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return { adapted, score: applyHonestScorer(score, () => scoreRealLocations(locResult), warnings, "agent2c-location") };
}

/** Agent 2d — temporal context (no honest scorer). */
export async function scoreTemporalContextPhase(tempResult: AnyObj, setting: AnyObj, backgroundContext: AnyObj): Promise<ScoredPhase<unknown>> {
  const scorer = new TemporalContextScorer();
  const adapted = adaptTemporalContextForScoring(tempResult, setting);
  const score = await scorer.score({}, adapted, {
    previous_phases: {
      agent1_setting: setting,
      agent2e_background_context: backgroundContext,
    },
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return { adapted, score };
}

/** Agent 2e — background context. */
export async function scoreBackgroundPhase(
  backgroundContext: AnyObj,
  setting: AnyObj,
  cast: AnyObj,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  const scorer = new BackgroundContextScorer();
  const adapted = adaptBackgroundContextForScoring(backgroundContext, setting);
  const score = await scorer.score({}, adapted, {
    previous_phases: {
      agent1_setting: setting,
      agent2_cast: cast,
    },
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return {
    adapted,
    score: applyHonestScorer(
      score,
      () => scoreRealBackground(backgroundContext, {
        castRoster: (((cast as any)?.characters ?? []) as any[]).map((c) => String(c?.name ?? "")).filter(Boolean),
        agent1Echo: [
          setting.location?.description,
          setting.atmosphere?.mood,
          setting.atmosphere?.visualDescription,
        ].filter((x): x is string => Boolean(x)),
      }),
      warnings,
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
  const scorer = new HardLogicScorer();
  const adapted = adaptHardLogicForScoring(devices);
  const score = await scorer.score({}, adapted, {
    previous_phases: {
      agent1_setting: setting,
      agent2_cast: cast,
      agent2e_background_context: backgroundContext,
    },
    cml: undefined as any,
    threshold_config: { mode: "standard" },
  });
  return { adapted, score: applyHonestScorer(score, () => scoreRealHardLogic(devices), warnings, "agent3b-hard-logic") };
}

/** Agent 6.5 — world document (no adapter, no honest scorer). */
export async function scoreWorldDocumentPhase<W>(worldDoc: W, cml: AnyObj): Promise<ScoredPhase<W>> {
  const scorer = new Agent65WorldBuilderScorer();
  const castSize = ((cml as any)?.CASE?.cast ?? []).length;
  const score = await scorer.score({}, worldDoc as any, {
    previous_phases: {},
    cml,
    threshold_config: { mode: "standard" },
    castSize,
  } as any);
  return { adapted: worldDoc, score };
}

/** Agent 7 — narrative outline, with the scene-count gate that forces F outside tolerance. */
export async function scoreNarrativePhase(
  narrativeResult: AnyObj,
  cml: AnyObj,
  cast: AnyObj,
  targetLength: "short" | "medium" | "long" | undefined,
  warnings: string[],
): Promise<ScoredPhase<unknown>> {
  const scorer = new NarrativeScorer();
  const clueMappings: ClueRef[] = (
    (cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? []
  )
    .map((m: any): ClueRef => ({
      id: String(m.clue_id || ""),
      placement: m.act_number === 1 ? "early" : m.act_number === 2 ? "mid" : m.act_number === 3 ? "late" : undefined,
    }))
    .filter((c: ClueRef) => c.id);
  const adapted = adaptNarrativeForScoring(
    narrativeResult,
    (cml as any)?.CASE?.cast ?? [],
    clueMappings
  );
  const score = await scorer.score({}, adapted, {
    previous_phases: { agent2_cast: cast },
    cml,
    threshold_config: { mode: "standard" },
    targetLength: targetLength ?? "medium",
  });

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

  return {
    adapted,
    score: applyHonestScorer(
      score,
      () => scoreRealNarrative(narrativeResult, targetLength ?? "medium"),
      warnings,
      "agent7-narrative",
    ),
  };
}
