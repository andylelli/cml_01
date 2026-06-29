import { describe, expect, it } from "vitest";
import {
  detectVictimAlive,
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  scoreBatchErrorSeverity,
} from "../agent9-prose/generate.js";

// A_55 fixes — prose-stage gates (#2 mechanism-leak, #3b victim active-after-death, #4 severity rank).

describe("A_55 #3b — detectVictimAlive covers PAST-TENSE prose", () => {
  const victim = "Sir Reginald Harcourt";

  it("flags a past-tense active victim subject (the prior present-tense pattern missed this)", () => {
    const chapter = {
      paragraphs: ["Across the room, Sir Reginald Harcourt stood and crossed to the window."],
    };
    expect(detectVictimAlive(chapter, victim).length).toBeGreaterThan(0);
  });

  it("flags past-tense dialogue attribution in both orders", () => {
    const nameFirst = { paragraphs: ['"It was never locked," Sir Reginald Harcourt said.'] };
    const verbFirst = { paragraphs: ['"It was never locked," said Sir Reginald Harcourt.'] };
    expect(detectVictimAlive(nameFirst, victim).length).toBeGreaterThan(0);
    expect(detectVictimAlive(verbFirst, victim).length).toBeGreaterThan(0);
  });

  it("does NOT flag recollection/flashback framing (had + verb)", () => {
    const chapter = {
      paragraphs: ["Sir Reginald Harcourt had said, in life, that the clock ran fast."],
    };
    expect(detectVictimAlive(chapter, victim)).toEqual([]);
  });

  it("does NOT flag corpse/body references", () => {
    const chapter = {
      paragraphs: ["Sir Reginald Harcourt's body lay where it had fallen, lifeless and cold."],
    };
    expect(detectVictimAlive(chapter, victim)).toEqual([]);
  });

  it("still detects the present-tense forms it always caught (no regression)", () => {
    const chapter = { paragraphs: ["Sir Reginald Harcourt stands and nods at the inspector."] };
    expect(detectVictimAlive(chapter, victim).length).toBeGreaterThan(0);
  });

  it("does not false-trip on a shared family surname (full victim name required)", () => {
    const chapter = { paragraphs: ["Lady Harcourt entered and said the study door was ajar."] };
    expect(detectVictimAlive(chapter, victim)).toEqual([]);
  });
});

describe("A_55 #2 — mechanism-explanation detector mirrors the rubric verifier", () => {
  const mechanism =
    "The killer reset the longcase clock's hands by thirty minutes to fabricate a false time of death.";
  const terms = deriveMechanismTerms(mechanism);

  it("derives salient terms (length>=5, no stopwords)", () => {
    expect(terms).toContain("longcase");
    expect(terms).toContain("fabricate");
    expect(terms).not.toContain("the");
  });

  it("flags a chapter that EXPLAINS the mechanism (terms + causal marker)", () => {
    const explains =
      "he had reset the longcase clock's hands by thirty minutes in order to fabricate a false time of death".toLowerCase();
    expect(chapterFullyExplainsMechanism(explains, terms)).toBe(true);
  });

  it("does NOT flag a chapter that merely PLANTS the clue (terms, no causal marker)", () => {
    const plants =
      "the longcase clock stood in the hall; its hands pointed to half past nine, the brass key cold to the touch".toLowerCase();
    expect(chapterFullyExplainsMechanism(plants, terms)).toBe(false);
  });

  it("returns false when there are no mechanism terms", () => {
    expect(chapterFullyExplainsMechanism("anything at all", [])).toBe(false);
  });
});

describe("A_55 #4 — severity-aware best-attempt ranking", () => {
  it("ranks a structural-defect attempt WORSE than a cosmetic-only attempt with more errors", () => {
    const structural = scoreBatchErrorSeverity([
      "Chapter 4: missing required clue clue_7",
    ]);
    const cosmetic = scoreBatchErrorSeverity([
      "Template linter: opening-style entropy too low",
      "Template linter: repeated content opener detected",
      "Template linter: high n-gram overlap with a prior paragraph",
    ]);
    // 1 structural (rank 1001) must lose to 3 cosmetic (rank 3).
    expect(cosmetic.rank).toBeLessThan(structural.rank);
    expect(structural.structural).toBe(1);
    expect(cosmetic.structural).toBe(0);
  });

  it("uses total count as the tiebreak among equal structural counts", () => {
    const fewer = scoreBatchErrorSeverity(["Chapter 1: missing required clue clue_1"]);
    const more = scoreBatchErrorSeverity([
      "Chapter 1: missing required clue clue_1",
      "Template linter: opening-style entropy too low",
    ]);
    expect(fewer.rank).toBeLessThan(more.rank);
  });

  it("classifies an empty error list as rank 0", () => {
    expect(scoreBatchErrorSeverity([]).rank).toBe(0);
  });
});
