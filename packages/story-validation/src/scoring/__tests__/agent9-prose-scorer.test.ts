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

// ── D8: fair_play_validation rubric recalibration (35/35/15/15) ───────────────
describe("ProseScorer fair_play_validation rubric (D8)", () => {
  const scorer = new ProseScorer();
  const baseContext = {
    threshold_config: { mode: "standard" },
    targetLength: "medium",
  } as any;

  const singleChapter = {
    chapters: [
      {
        chapter_number: 1,
        chapter_title: "End",
        prose: "She waited for the answer.",
      },
    ],
  };

  it("awards 100/100 fair-play score and passes when all four components pass", async () => {
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: true,
        no_solution_spoilers: true,
        fair_play_timing_compliant: true,
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest).toBeDefined();
    expect(fpTest?.score).toBe(100);
    expect(fpTest?.passed).toBe(true);
  });

  it("totals 85/100 fair-play score (passes) when only timing fails (loses 15 pts)", async () => {
    // 35+35+15+0 = 85 — still passes (>=60), but message should contain the detail
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: true,
        no_solution_spoilers: true,
        fair_play_timing_compliant: false,
        fair_play_timing_violations: [{ clue_id: "clue_1", chapter: 4 }],
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest).toBeDefined();
    expect(fpTest?.score).toBe(85);
    expect(fpTest?.passed).toBe(true);   // 85 >= 60 → passes
    expect(fpTest?.message).toContain("85/100");
  });

  it("totals 70/100 when no_solution_spoilers and timing both fail (loses 15+15=30 pts)", async () => {
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: true,
        no_solution_spoilers: false,
        fair_play_timing_compliant: false,
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest?.score).toBe(70);     // 35+35+0+0
    expect(fpTest?.passed).toBe(true);  // 70 >= 60
  });

  it("totals 35/100 and fails when only all_clues_visible passes (35 pts)", async () => {
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: false,
        no_solution_spoilers: false,
        fair_play_timing_compliant: false,
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest?.score).toBe(35);
    expect(fpTest?.passed).toBe(false); // 35 < 60
  });

  it("defaults fair_play_timing_compliant to passing (15 pts) when field is absent — backwards compat", async () => {
    // Old reports without the timing field should score 100/100
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: true,
        no_solution_spoilers: true,
        // fair_play_timing_compliant intentionally absent
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest?.score).toBe(100);
    expect(fpTest?.passed).toBe(true);
  });

  it("includes violated chapter numbers in message when timing fails", async () => {
    const output = {
      ...singleChapter,
      fair_play_validation: {
        all_clues_visible: true,
        discriminating_test_complete: true,
        no_solution_spoilers: true,
        fair_play_timing_compliant: false,
        fair_play_timing_violations: [
          { clue_id: "clue_knife", chapter: 5 },
          { clue_id: "clue_ring", chapter: 5 },
          { clue_id: "clue_hat", chapter: 7 },
        ],
      },
    };
    const score = await scorer.score({}, output, baseContext);
    const fpTest = score.tests.find(t => t.name === "Fair play compliance");
    expect(fpTest?.message ?? "").toMatch(/5/);
    expect(fpTest?.message ?? "").toMatch(/7/);
  });
});
