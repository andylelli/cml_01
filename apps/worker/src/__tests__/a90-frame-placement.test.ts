import { describe, expect, it } from "vitest";

import { applyRecollectionFrame } from "../jobs/agents/agent9-run.js";

/**
 * A_90 §15 — run 94118 shipped "In a remembered moment, but she had been told…". The conjunction is
 * dropped rather than the frame moved: `RECOLLECTION_FRAME_RE` is anchored at the sentence start,
 * and a frame the validator cannot see leaves the false reappearance standing, which is the abort
 * this rescue exists to prevent.
 */
describe("applyRecollectionFrame — a leading conjunction is dropped, the frame stays anchored", () => {
  it("fixes the splice that shipped, with the frame still first", () => {
    expect(applyRecollectionFrame("In a remembered moment, ", "but she had been told all evening.", true))
      .toBe("In a remembered moment, she had been told all evening.");
  });

  it("handles every coordinating opener", () => {
    expect(applyRecollectionFrame("In life, ", "And he walked the deck.", true)).toBe("In life, he walked the deck.");
    expect(applyRecollectionFrame("Before the death, ", "Yet she waited.", true)).toBe("Before the death, she waited.");
    // "Then" is an adverb, not a conjunction: it is kept, and the frame still goes first.
    expect(applyRecollectionFrame("In life, ", "Then Beatrice entered.", true)).toBe("In life, then Beatrice entered.");
    // a name after a dropped conjunction keeps its capital
    expect(applyRecollectionFrame("In life, ", "But Beatrice entered.", true)).toBe("In life, Beatrice entered.");
  });

  it("leaves the earlier behaviour intact for every other opener", () => {
    expect(applyRecollectionFrame("In life, ", "He looked at the watch.", true)).toBe("In life, he looked at the watch.");
    expect(applyRecollectionFrame("In life, ", "Neville Fairweather smiled.", true)).toBe("In life, Neville Fairweather smiled.");
    expect(applyRecollectionFrame("In life, ", "But he waited.", false)).toBe("In life, But he waited.");
  });
});
