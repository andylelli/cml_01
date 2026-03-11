import { describe, expect, it } from "vitest";
import { ProseScorer } from "../phase-scorers/agent9-prose-scorer.js";

describe("ProseScorer stability guards", () => {
  it("returns finite scores when chapters array is empty", async () => {
    const scorer = new ProseScorer();

    const score = await scorer.score(
      {},
      { chapters: [] },
      { threshold_config: { mode: "standard" }, targetLength: "medium" } as any,
    );

    expect(Number.isFinite(score.total)).toBe(true);
    expect(Number.isFinite(score.validation_score)).toBe(true);
    expect(score.passed).toBe(false);
  });

  it("does not produce NaN when cast is empty", async () => {
    const scorer = new ProseScorer();

    const score = await scorer.score(
      {},
      {
        chapters: [
          {
            chapter_number: 1,
            chapter_title: "Chapter One",
            prose: "The room was cold. She waited by the window and listened to the rain.",
          },
        ],
      },
      {
        threshold_config: { mode: "standard" },
        targetLength: "medium",
        cml: { CASE: { cast: [] } },
      } as any,
    );

    expect(Number.isFinite(score.consistency_score)).toBe(true);
    expect(score.tests.length).toBeGreaterThan(0);
  });
});
