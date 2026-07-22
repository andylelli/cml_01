import { describe, expect, it } from "vitest";
import { detectDerivedContradictionLeak } from "../dual-value.js";
import { detectEvidentiaryRegister } from "../register.js";

// A_65 Phase 1 — the withheld-inference measures. Both are MEASURES by law (A_65 §4): frozen,
// never gates, never regen triggers.

describe("detectDerivedContradictionLeak — the F3 chapter-one class, fixture-narrow", () => {
  const pair = { values: ["ten minutes past eleven", "three feet"] as [string, string] };
  // The M3-tide chapter 1 sentence, verbatim (A_65 F3): the story's central deduction on page one.
  const F3_SENTENCE =
    "If Sylvia Trent's watch truly stopped at 'ten minutes past eleven,' and the tide was only at 'three feet' when she was found, then the official tide chart's prediction of 'eleven thirty' for high tide could not account for her drowning.";

  it("fires on the verbatim F3 sentence (both values + inference assembly)", () => {
    const hits = detectDerivedContradictionLeak(F3_SENTENCE, pair);
    expect(hits).toHaveLength(1);
    expect(hits[0].sentence).toContain("ten minutes past eleven");
  });

  it("does NOT fire when the values sit in separate sentences (observation, not assembly)", () => {
    const prose =
      "Her watch had stopped at ten minutes past eleven. Hugo crouched by the tide pool, which stood at barely three feet.";
    expect(detectDerivedContradictionLeak(prose, pair)).toEqual([]);
  });

  it("does NOT fire on co-presence without an inference connective (the dual-value detector's territory)", () => {
    const prose = "The watch read ten minutes past eleven; the gauge beside it showed three feet of water.";
    expect(detectDerivedContradictionLeak(prose, pair)).toEqual([]);
  });
});

describe("detectEvidentiaryRegister — the frozen data-sheet family, narration scope", () => {
  it("counts evidentiary-summary narration", () => {
    const prose =
      "Witnesses recall seeing a woman in a striking dress. Analysis of the salt shaker suggests poison. The statements confirmed the timeline.";
    expect(detectEvidentiaryRegister(prose).length).toBe(3);
  });

  it("does NOT count quoted dialogue (a character may SAY it)", () => {
    const prose = '"The witnesses all confirm it," said the inspector, pocketing his notebook.';
    expect(detectEvidentiaryRegister(prose)).toEqual([]);
  });

  it("is clean on scene-register prose (the target register)", () => {
    const prose =
      "Hugo crouched beside the body, careful not to disturb the water line on her clothing. Salt hung in the air.";
    expect(detectEvidentiaryRegister(prose)).toEqual([]);
  });
});
