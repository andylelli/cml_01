import { describe, expect, it } from "vitest";
import { detectMissingCaseTransitionBridge, BRIDGE_TERMS } from "../narrative-continuity-validator.js";

// A_61 RC3.3 — detect a chapter that shifts a missing-person frame to murder with no bridge.

describe("detectMissingCaseTransitionBridge — both directions", () => {
  it("FIRES on disappearance → murder with no bridge", () => {
    const chapters = [
      { paragraphs: ["Eleanor had gone missing three days prior; no trace of the woman remained."] },
      { paragraphs: ["The inspector announced it was murder — a killing, plain and cold."] },
    ];
    const defects = detectMissingCaseTransitionBridge(chapters);
    expect(defects).toHaveLength(1);
    expect(defects[0].chapterNumber).toBe(2);
  });

  it("does NOT fire when a bridge is already present", () => {
    const chapters = [
      { paragraphs: ["Eleanor had gone missing three days prior."] },
      { paragraphs: ["Then the body was found in the ravine; it was murder."] },
    ];
    expect(detectMissingCaseTransitionBridge(chapters)).toEqual([]);
  });

  it("does NOT fire on an incidental object 'missing' (the FP the tighter person-context guard prevents)", () => {
    const chapters = [
      { paragraphs: ["A single cufflink was missing from the drawer."] },
      { paragraphs: ["The body lay in the study; clearly a murder."] },
    ];
    expect(detectMissingCaseTransitionBridge(chapters)).toEqual([]);
  });

  it("review fix — a person keyword + a MISSING OBJECT does not fire (the FP the loose guard allowed)", () => {
    const chapters = [
      { paragraphs: ["The gentleman noticed a missing button on his cuff."] },
      { paragraphs: ["The body still lay in the morgue; the murder was unsolved."] },
    ];
    expect(detectMissingCaseTransitionBridge(chapters)).toEqual([]);
    // and a 'reported missing' person phrasing still fires
    const real = [
      { paragraphs: ["The heiress was reported missing on the Tuesday."] },
      { paragraphs: ["It was murder, the inspector said grimly."] },
    ];
    expect(detectMissingCaseTransitionBridge(real)).toHaveLength(1);
  });

  it("BRIDGE_TERMS matches a body-discovery event", () => {
    expect(BRIDGE_TERMS.test("the body was found at dawn")).toBe(true);
    expect(BRIDGE_TERMS.test("nothing was resolved")).toBe(false);
  });
});
