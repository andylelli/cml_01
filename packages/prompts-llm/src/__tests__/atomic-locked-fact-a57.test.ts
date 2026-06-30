import { describe, expect, it } from "vitest";
import { isAtomicLockedFactValue } from "../agent9-prose/prompt-builder.js";

// A_57 D1 — atomic (time/number/measurement → verbatim) vs descriptive (clause/log → paraphrasable).
// The classifier must NEVER misclassify a time/number as descriptive (that would lose clue fidelity).

describe("isAtomicLockedFactValue (A_57 D1)", () => {
  it("treats times, numbers, and measurements as ATOMIC (verbatim)", () => {
    for (const v of [
      "thirteen minutes to midnight",
      "half past three in the afternoon",
      "twenty minutes past four",
      "twenty minutes past four in the afternoon", // 7 words, trailing day-part — still an atomic time
      "ten o'clock",
      "forty minutes",
      "forty-five degrees",
      "3:30",
      "4:20 p.m.",
      "three paces",
      "two",
    ]) {
      expect(isAtomicLockedFactValue(v), v).toBe(true);
    }
  });

  it("treats descriptive log/document clauses as DESCRIPTIVE (paraphrasable)", () => {
    for (const v of [
      "Weather logs confirming clear skies during the afternoon",
      "clear skies",
      "the groundskeeper's entry noting silhouettes on the west lawn",
      "a ledger entry dated after the servants' claimed timeline",
      "the diary recorded an unexplained visitor",
    ]) {
      expect(isAtomicLockedFactValue(v), v).toBe(false);
    }
  });
});
