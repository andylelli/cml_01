import { getGenerationParams } from "@cml/story-validation";

/**
 * A7-05 — the one act split: how many of `totalScenes` go to each act.
 *
 * The prompt asks Agent 7 for exactly these counts, and the scene-count retry, the scoring gate's
 * feedback and the deterministic rebalance must say the same numbers back. It was written out four
 * times (two copies carried a comment promising "the SAME ratios as buildUserRequest()"). Act 3 takes
 * the remainder, so the three always sum to `totalScenes`; the ratios are a validated pair (A7-D06).
 */
export function computeActSceneCounts(totalScenes: number): { act1: number; act2: number; act3: number } {
  const { act1_ratio, act2_ratio } = getGenerationParams().agent7_narrative.params.pacing.act_distribution;
  const act1 = Math.round(totalScenes * act1_ratio);
  const act2 = Math.round(totalScenes * act2_ratio);
  return { act1, act2, act3: totalScenes - act1 - act2 };
}
