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

  it("Phase A — a person + copula 'was/had been missing' fires; a person who merely NOTICES a missing object does not", () => {
    // fires: person is the subject of the disappearance
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The woman was missing for three days."] },
      { paragraphs: ["Then it was murder, plain and cold."] },
    ])).toHaveLength(1);
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["She had been missing since Tuesday."] },
      { paragraphs: ["The body turned up; a killing."] },
    ])).toHaveLength(1);
    // does NOT fire: "missing" modifies an object, not the person
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The gentleman noticed a missing button on his cuff."] },
      { paragraphs: ["The body lay in the morgue; the murder was unsolved."] },
    ])).toEqual([]);
  });

  it("BRIDGE_TERMS matches a body-discovery event", () => {
    expect(BRIDGE_TERMS.test("the body was found at dawn")).toBe(true);
    expect(BRIDGE_TERMS.test("nothing was resolved")).toBe(false);
  });

  // Ledger P0.1 (run f90e5f09) — the bare verb branch needs a person subject.
  it("does NOT fire on figurative 'vanished/disappeared' (the f90e5f09 FP class)", () => {
    // the exact sentence that flagged run f90e5f09's confession chapter
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["Charles, subdued, stared into his glass, the last remnants of bravado vanished from his posture."] },
      { paragraphs: ['"I killed Lady Beatrice Wentworth," he said. "You are under arrest for the murder."'] },
    ])).toEqual([]);
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The smile vanished from her face; every doubt disappeared with it."] },
      { paragraphs: ["The murder inquiry resumed at dawn."] },
    ])).toEqual([]);
  });

  // Ledger batch finding (tide run) — the transition only exists where death language FIRST enters.
  it("does NOT fire on victim-timeline reconstruction after the murder is already established", () => {
    // murder established in ch1; ch8-style reconstruction 'Dr. Finch vanished…' beside ch9 murder vocab
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The tide brought the body ashore at dawn; murder was beyond doubt."] },
      { paragraphs: ["Dr. Finch vanished from the lobby just before eleven, Miss Voss observed."] },
      { paragraphs: ["If the murder happened at the quarter hour, the alibi collapses."] },
    ])).toEqual([]);
  });

  it("STILL fires when death language first enters AFTER the disappearance frame", () => {
    // three-chapter shape: disappearance ch1-2, death introduced unbridged at ch3
    const defects = detectMissingCaseTransitionBridge([
      { paragraphs: ["The household searched the grounds all evening."] },
      { paragraphs: ["She had been missing since Tuesday, and hope wore thin."] },
      { paragraphs: ["By morning the inspector called it murder."] },
    ]);
    expect(defects).toHaveLength(1);
    expect(defects[0].chapterNumber).toBe(3);
  });

  it("STILL fires on a genuine person disappearance phrased with the verbs", () => {
    // pronoun subject (case-insensitive branch)
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["She had simply vanished; the household searched until midnight."] },
      { paragraphs: ["By morning the inspector called it murder."] },
    ])).toHaveLength(1);
    // person noun subject
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The woman disappeared that night without explanation."] },
      { paragraphs: ["It was murder, the inspector said."] },
    ])).toHaveLength(1);
    // honorific + Name (case-sensitive branch)
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["Lady Beatrice Wentworth vanished from the terrace before supper."] },
      { paragraphs: ["The murder was confirmed by the coroner."] },
    ])).toHaveLength(1);
    // "disappearance of <Name>"
    expect(detectMissingCaseTransitionBridge([
      { paragraphs: ["The disappearance of Eleanor troubled the entire household."] },
      { paragraphs: ["Then came word of murder."] },
    ])).toHaveLength(1);
  });
});
