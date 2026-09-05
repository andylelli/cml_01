/**
 * THE OMISSION THAT ABORTED RUN 87779.
 *
 * Seed 87779, 2026-09-05. The model omitted `estimatedWordCount` on every scene, twice in a row, and
 * the outline failed schema validation:
 *
 *     Outline schema failure: acts[0].scenes[0].estimatedWordCount is required   (x10)
 *     Pipeline failure: Narrative outline artifact failed schema validation
 *
 * The run died at Agent 7 having paid for eleven artifacts, and produced no book.
 *
 * MEASURED: zero prior occurrences across `logs/llm.jsonl` and the store, so this is a new compliance
 * failure rather than a regression. Contract recovery ran and could not supply the field either.
 *
 * The fixture below reproduces that outline's exact shape — three acts of 3, 4 and 3 scenes, ten in
 * total, none carrying a word count — read off the ten error messages the run emitted.
 */

import { describe, expect, it } from "vitest";

import { synthesiseMissingWordCounts } from "../jobs/agents/agent7-run.js";
import { validateArtifact } from "@cml/cml";

/** The shape run 87779 actually produced: 3 + 4 + 3 scenes, no estimatedWordCount anywhere. */
const outline = (opts: { withCounts?: boolean } = {}) => ({
  title: "The Chime That Fell Wrong",
  logline: "A country-house clock strikes at an hour it should not.",
  acts: [3, 4, 3].map((sceneCount, actIndex) => ({
    actNumber: actIndex + 1,
    title: `Act ${actIndex + 1}`,
    purpose: "Advance the story.",
    ...(opts.withCounts ? { estimatedWordCount: 5000 } : {}),
    scenes: Array.from({ length: sceneCount }, (_, i) => ({
      sceneNumber: i + 1,
      title: `Scene ${i + 1}`,
      purpose: "Something happens.",
      summary: "A summary of the scene.",
      characters: ["Julian Penhale"],
      cluesRevealed: [],
      setting: { location: "The library", timeOfDay: "evening", atmosphere: "tense" },
      dramaticElements: { tension: "high", conflict: "interpersonal", revelation: "partial" },
      beat: null,
      ...(opts.withCounts ? { estimatedWordCount: 1234 } : {}),
    })),
  })),
});

describe("synthesiseMissingWordCounts", () => {
  it("fills every scene and act the model left out", () => {
    const narrative = outline();
    const result = synthesiseMissingWordCounts(narrative, "short");

    expect(result.scenes).toBe(10);
    expect(result.acts).toBe(3);
    for (const act of narrative.acts) {
      expect(Number.isFinite((act as any).estimatedWordCount)).toBe(true);
      for (const scene of act.scenes) expect(Number.isFinite((scene as any).estimatedWordCount)).toBe(true);
    }
  });

  it("an act's count is the sum of its own scenes, not a flat guess", () => {
    const narrative = outline();
    synthesiseMissingWordCounts(narrative, "short");
    for (const act of narrative.acts) {
      const sum = act.scenes.reduce((n, s) => n + (s as any).estimatedWordCount, 0);
      expect((act as any).estimatedWordCount).toBe(sum);
    }
  });

  it("the counts are position-weighted, not identical — it uses the real budget function", () => {
    // distributeChapterWordBudget weights Act I leaner and the middle fuller. If every scene came
    // back with the same number, the derivation would be a constant wearing a function's name.
    const narrative = outline();
    synthesiseMissingWordCounts(narrative, "short");
    const counts = narrative.acts.flatMap((a) => a.scenes.map((s) => (s as any).estimatedWordCount));
    expect(new Set(counts).size).toBeGreaterThan(1);
    expect(counts.every((c) => c > 0)).toBe(true);
  });

  it("NEVER overwrites a count the model did author", () => {
    // The whole safety argument: this can only turn an abort into a run. If it could rewrite an
    // authored count it could change an outline the model got right.
    const narrative = outline({ withCounts: true });
    const result = synthesiseMissingWordCounts(narrative, "short");

    expect(result).toEqual({ scenes: 0, acts: 0 });
    for (const act of narrative.acts) {
      expect((act as any).estimatedWordCount).toBe(5000);
      for (const scene of act.scenes) expect((scene as any).estimatedWordCount).toBe(1234);
    }
  });

  it("fills only the gaps in a partly-authored outline", () => {
    const narrative = outline();
    (narrative.acts[0]!.scenes[0] as any).estimatedWordCount = 999;
    const result = synthesiseMissingWordCounts(narrative, "short");

    expect(result.scenes).toBe(9);
    expect((narrative.acts[0]!.scenes[0] as any).estimatedWordCount).toBe(999);
  });

  it("does nothing, and does not throw, on a shapeless outline", () => {
    expect(synthesiseMissingWordCounts(undefined, "short")).toEqual({ scenes: 0, acts: 0 });
    expect(synthesiseMissingWordCounts({}, "short")).toEqual({ scenes: 0, acts: 0 });
    expect(synthesiseMissingWordCounts({ acts: [] }, "short")).toEqual({ scenes: 0, acts: 0 });
    expect(synthesiseMissingWordCounts({ acts: [{ actNumber: 1, scenes: [] }] }, "short")).toEqual({ scenes: 0, acts: 0 });
  });

  it("REGRESSION: the fixture really does fail schema validation before the fix, and passes after", () => {
    // The point of the whole change. Without this assertion the tests above could pass while the
    // outline still aborted the run for some other missing field.
    const before = outline();
    const failed = validateArtifact("narrative_outline", before);
    expect(failed.valid, "fixture must reproduce the abort").toBe(false);
    expect(failed.errors.some((e: string) => e.includes("estimatedWordCount"))).toBe(true);

    synthesiseMissingWordCounts(before, "short");
    const after = validateArtifact("narrative_outline", before);
    expect(
      after.errors.filter((e: string) => e.includes("estimatedWordCount")),
      "no estimatedWordCount error may survive",
    ).toEqual([]);
  });
});
