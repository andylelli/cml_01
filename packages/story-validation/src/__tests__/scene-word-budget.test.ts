import { describe, expect, it } from "vitest";
import {
  resolveSceneWordBudget,
  distributeChapterWordBudget,
  getStoryLengthTarget,
} from "../story-length-targets.js";

describe("resolveSceneWordBudget (P1.3)", () => {
  const chapterTargetWords = 1700;
  const hardFloorWords = 1200;

  describe("default (authoritative = false) — reproduces today's uniform floor", () => {
    it("floors a below-target scene up to the uniform target", () => {
      expect(
        resolveSceneWordBudget({ sceneEstimate: 900, chapterTargetWords, hardFloorWords, authoritative: false }),
      ).toBe(1700);
    });

    it("keeps an above-target scene estimate", () => {
      expect(
        resolveSceneWordBudget({ sceneEstimate: 2400, chapterTargetWords, hardFloorWords, authoritative: false }),
      ).toBe(2400);
    });

    it("falls back to the target when no estimate is present", () => {
      expect(
        resolveSceneWordBudget({ chapterTargetWords, hardFloorWords, authoritative: false }),
      ).toBe(1700);
    });
  });

  describe("authoritative = true — respects the scene budget within a sane band", () => {
    it("respects a mid-band scene estimate instead of flooring it to the uniform target", () => {
      expect(
        resolveSceneWordBudget({ sceneEstimate: 1400, chapterTargetWords, hardFloorWords, authoritative: true }),
      ).toBe(1400);
    });

    it("never drops below the hard floor", () => {
      const result = resolveSceneWordBudget({ sceneEstimate: 500, chapterTargetWords, hardFloorWords, authoritative: true });
      expect(result).toBeGreaterThanOrEqual(hardFloorWords);
    });

    it("clamps a runaway estimate to the ceiling (1.6 × target)", () => {
      const result = resolveSceneWordBudget({ sceneEstimate: 9000, chapterTargetWords, hardFloorWords, authoritative: true });
      expect(result).toBe(Math.round(chapterTargetWords * 1.6));
    });
  });
});

describe("distributeChapterWordBudget (P1.3)", () => {
  it("returns one budget per scene, in scene order", () => {
    expect(distributeChapterWordBudget(10, "medium")).toHaveLength(10);
    expect(distributeChapterWordBudget(0, "medium")).toEqual([]);
  });

  it("keeps every budget within [chapterMinWords, 1.6 × ideal]", () => {
    const t = getStoryLengthTarget("medium");
    const ceil = Math.round(t.chapterIdealWords * 1.6);
    for (const budget of distributeChapterWordBudget(30, "medium")) {
      expect(budget).toBeGreaterThanOrEqual(t.chapterMinWords);
      expect(budget).toBeLessThanOrEqual(ceil);
    }
  });

  it("shapes a pacing curve — climax chapters run fuller than setup chapters", () => {
    const budgets = distributeChapterWordBudget(20, "medium");
    const setup = budgets[0]; // p = 0 (Act I)
    const climax = budgets[Math.round(0.85 * (budgets.length - 1))]; // p ≈ 0.85 (climax)
    expect(climax).toBeGreaterThan(setup);
  });
});
