import { describe, expect, it } from "vitest";
import { resolveStageModeKey } from "../agent9-prose/clue-validation.ts";

// ITEM 11 (Ch9/Ch10 duplicated reveal) — classifier-level regression.
// The obligation-block AFTERMATH CONTRACT already existed, but the stage-mode CLASSIFIER
// returned "final_reveal" for the Golden-Age revelation chapter (because
// getCulpritRevealChapter falls back to the LAST chapter when the CML
// culprit_revelation_scene ref is unresolvable), so the contract never fired in production
// and Ch10 re-staged the whole reveal. These tests pin the classifier's new beat-awareness.

// Neutral 10-scene outline (one scene per chapter). Titles/summaries/purposes carry NO
// aftermath/reveal/DT signal keywords, so `beat` is the SOLE driver of every assertion.
const mkScene = (sceneNumber: number, beat?: string): any => ({
  sceneNumber,
  title: `Chapter ${sceneNumber}`,
  summary: "The investigation continues.",
  purpose: "Advance the household inquiry.",
  characters: [],
  ...(beat ? { beat } : {}),
});

// Golden-Age arc: Ch9 = final_trap (culprit named on-page), Ch10 = revelation (aftermath).
const goldenAgeOutline = (): any[] => [
  mkScene(1, "gathering"),
  mkScene(2, "crime"),
  mkScene(3, "first_enquiries"),
  mkScene(4, "motives"),
  mkScene(5, "alibis"),
  mkScene(6, "false_solution"),
  mkScene(7, "secrets"),
  mkScene(8, "pattern"),
  mkScene(9, "final_trap"),
  mkScene(10, "revelation"),
];

// No beats at all → a non-Golden-Age outline. The fix must not touch this path.
const beatlessOutline = (): any[] => Array.from({ length: 10 }, (_, i) => mkScene(i + 1));

// A cmlCase whose culprit_revelation_scene ref does NOT resolve to any outline scene, so
// getCulpritRevealChapter falls back to the LAST chapter — the exact production condition
// that used to bind the reveal (and its MANDATORY RESOLUTION mandate) to Ch10.
const caseWithUnresolvableReveal = (): any => ({
  cast: [
    { name: "Alice Grey", role: "detective" },
    { name: "Edgar Vale", role_archetype: "suspect" },
    { name: "Clara Whitfield", role_archetype: "suspect" },
    { name: "Lionel Marlowe", role_archetype: "victim" },
  ],
  prose_requirements: {
    // Missing culprit_revelation_scene → getCulpritRevealChapter returns the fallback.
    suspect_clearance_scenes: [],
    clue_to_scene_mapping: [],
  },
});

describe("ITEM 11 #6 — resolveStageModeKey classifies the Golden-Age revelation chapter as aftermath", () => {
  it("POSITIVE: a final `revelation` chapter after a `final_trap` chapter resolves to aftermath_consequence", () => {
    const outline = goldenAgeOutline();
    const mode = resolveStageModeKey(10, 10, 10, false, caseWithUnresolvableReveal(), outline, [outline[9]]);
    expect(mode).toBe("aftermath_consequence");
  });

  it("CONTROL: the SAME inputs without any beats still resolve to final_reveal (the beat drives the fix)", () => {
    const outline = beatlessOutline();
    const mode = resolveStageModeKey(10, 10, 10, false, caseWithUnresolvableReveal(), outline, [outline[9]]);
    expect(mode).toBe("final_reveal");
  });

  it("NEGATIVE: a `revelation` final chapter with NO earlier `final_trap` is NOT forced to aftermath", () => {
    const outline = beatlessOutline();
    outline[9] = mkScene(10, "revelation"); // revelation last, but no final_trap anywhere
    const mode = resolveStageModeKey(10, 10, 10, false, caseWithUnresolvableReveal(), outline, [outline[9]]);
    expect(mode).not.toBe("aftermath_consequence");
    expect(mode).toBe("final_reveal");
  });

  it("NEGATIVE: the `final_trap` chapter (Ch9) itself is never classified as aftermath", () => {
    const outline = goldenAgeOutline();
    const mode = resolveStageModeKey(9, 9, 10, false, caseWithUnresolvableReveal(), outline, [outline[8]]);
    expect(mode).not.toBe("aftermath_consequence");
  });

  it("NEGATIVE: a non-final chapter carrying a stray `revelation` beat is not aftermath", () => {
    const outline = goldenAgeOutline();
    outline[4] = mkScene(5, "revelation"); // scene 5 mislabeled; chapter 5 is not the final chapter
    const mode = resolveStageModeKey(5, 5, 10, false, caseWithUnresolvableReveal(), outline, [outline[4]]);
    expect(mode).not.toBe("aftermath_consequence");
  });
});
