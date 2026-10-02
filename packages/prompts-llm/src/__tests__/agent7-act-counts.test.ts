import { describe, expect, it } from "vitest";
import { getGenerationParams } from "@cml/story-validation";
import { computeActSceneCounts } from "../agent7-act-counts.js";

// A7-05 — one act split replaced four copies; pin it against the formula they all wrote out.
describe("computeActSceneCounts", () => {
  it("matches round(n·r1), round(n·r2), remainder for totals 1–40, and always sums to n", () => {
    const { act1_ratio, act2_ratio } = getGenerationParams().agent7_narrative.params.pacing.act_distribution;
    for (let n = 1; n <= 40; n++) {
      const a1 = Math.round(n * act1_ratio);
      const a2 = Math.round(n * act2_ratio);
      expect(computeActSceneCounts(n)).toEqual({ act1: a1, act2: a2, act3: n - a1 - a2 });
      const c = computeActSceneCounts(n);
      expect(c.act1 + c.act2 + c.act3).toBe(n);
    }
  });
});
