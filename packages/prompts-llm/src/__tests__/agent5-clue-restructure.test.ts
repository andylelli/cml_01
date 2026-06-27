import { describe, expect, it } from "vitest";
import {
  deriveClueObservable,
  deriveClueDescription,
  checkPointsToDistinctness,
  type Clue,
} from "../agent5-clues.js";
import { chapterMentionsRequiredClue } from "../agent9-prose/clue-validation.js";

function clue(partial: Partial<Clue>): Clue {
  return {
    id: "clue_x",
    category: "physical",
    description: "",
    sourceInCML: "CASE.evidence[0]",
    pointsTo: "",
    placement: "mid",
    criticality: "essential",
    ...partial,
  };
}

describe("deriveClueObservable (P1.2)", () => {
  it("prefers the on-page observable when present", () => {
    expect(
      deriveClueObservable({
        observable: "  a clock stopped at 3:14  ",
        description: "The stopped clock fakes the time of death.",
      }),
    ).toBe("a clock stopped at 3:14");
  });

  it("falls back to the analytic description when observable is absent (back-compat)", () => {
    expect(
      deriveClueObservable({ description: "The stopped clock fakes the time of death." }),
    ).toBe("The stopped clock fakes the time of death.");
  });

  it("falls back when observable is blank/whitespace", () => {
    expect(deriveClueObservable({ observable: "   ", description: "fallback text" })).toBe(
      "fallback text",
    );
  });
});

describe("deriveClueDescription (P1.2)", () => {
  it("keeps the planning description as the canonical value", () => {
    expect(
      deriveClueDescription({ description: "spec sentence", observable: "on-page thing" }),
    ).toBe("spec sentence");
  });

  it("falls back to observable only when description is blank", () => {
    expect(deriveClueDescription({ description: "  ", observable: "on-page thing" })).toBe(
      "on-page thing",
    );
  });
});

describe("checkPointsToDistinctness (P1.2)", () => {
  it("passes when every solving clue points to a distinct implication", () => {
    const result = checkPointsToDistinctness([
      clue({ id: "a", pointsTo: "Eliminates Carter" }),
      clue({ id: "b", pointsTo: "Implicates Voss" }),
    ]);
    expect(result.ok).toBe(true);
    expect(result.collisions).toHaveLength(0);
  });

  it("flags two clues that resolve to the same implication (case/punctuation-insensitive)", () => {
    const result = checkPointsToDistinctness([
      clue({ id: "a", pointsTo: "Eliminates Carter." }),
      clue({ id: "b", pointsTo: "  eliminates   carter  " }),
    ]);
    expect(result.ok).toBe(false);
    expect(result.collisions).toHaveLength(1);
    expect(result.collisions[0].clueIds).toEqual(["a", "b"]);
  });

  it("ignores optional clues and blank pointsTo", () => {
    const result = checkPointsToDistinctness([
      clue({ id: "a", pointsTo: "Implicates Voss", criticality: "essential" }),
      clue({ id: "b", pointsTo: "Implicates Voss", criticality: "optional" }),
      clue({ id: "c", pointsTo: "   ", criticality: "essential" }),
    ]);
    expect(result.ok).toBe(true);
  });
});

describe("validator/prompt alignment on observable (P1.2 split fix)", () => {
  const dist = (c: Clue) => ({ clues: [c], redHerrings: [], cost: 0, durationMs: 0 }) as any;

  it("matches the chapter on the ON-PAGE observable, not the spec description", () => {
    const c = clue({
      id: "clue_1",
      observable: "a scorch mark on the windowsill",
      description: "the victim was poisoned by cyanide in the brandy",
      pointsTo: "",
    });
    // Prose written from the observable (what Agent 9 is told to write) passes.
    expect(chapterMentionsRequiredClue("She found a fresh scorch mark along the windowsill.", "clue_1", dist(c))).toBe(true);
    // Prose containing only the spoiler description tokens does NOT satisfy the obligation —
    // before the fix the validator keyed off `description` and would have falsely passed.
    expect(chapterMentionsRequiredClue("Cyanide in the brandy had poisoned the victim.", "clue_1", dist(c))).toBe(false);
  });

  it("is byte-identical when no observable is present (falls back to description)", () => {
    const c = clue({ id: "clue_2", description: "a scorch mark on the windowsill", pointsTo: "" });
    expect(chapterMentionsRequiredClue("She found a fresh scorch mark along the windowsill.", "clue_2", dist(c))).toBe(true);
  });
});
