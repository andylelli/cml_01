/**
 * A_82 §14.6 — detector (c), victim-body pronoun mismatch.
 *
 * WHY A THIRD DETECTOR RATHER THAN A WIDER ONE, measured before a line was written: run against the
 * real manuscript (`story_20260902-1846`) with the real cast (matched 6/6 by name, both known-positive
 * controls firing), `detectAttributionFlips` and `detectImpossibleSelfReferences` BOTH return 0 on the
 * chapter that shipped the slip. Those two are the ONLY producers for the A_66 P3 LLM regen channel,
 * so the reviewer's defect had no repair path at all — the gate counted it and shipped it.
 *
 * BASELINE BEFORE WIRING, projectId-scoped over `data/store.json` (34 runs with both a `cml` and a
 * `prose` artifact, all >= 8,000 words): **1 run fires, 1 event — the true positive, zero false
 * positives.** An earlier revision fired on 2 runs; the second was "He cleared his throat, the sound
 * loud in the hush", which the prior-subject guard below now suppresses.
 *
 * TWO PROBE BUGS were found and fixed while establishing that baseline, both of which produced
 * confident wrong answers rather than errors, and both of the same family (pairing a manuscript to
 * the wrong artifact): the first scored a different run's cast against this text; the second pushed a
 * name-matched cast whose declared victim was "Sylvia Trent", which very nearly became a reported
 * finding that the prose kills a character the case lists as a suspect. It does not — this run's own
 * `cml` artifact declares Dr. Mallory Finch the victim. Pair by projectId, never by name.
 */

import { describe, expect, it } from "vitest";

import {
  detectAttributionFlips,
  detectImpossibleSelfReferences,
  detectVictimBodyPronounMismatch,
} from "../prose-consistency-validator.js";

const CAST = [
  { name: "Eleanor Voss", gender: "female" },
  { name: "Dr. Mallory Finch", gender: "female" },
  { name: "Captain Ivor Hale", gender: "male" },
  { name: "Beatrice Quill", gender: "female" },
  { name: "Sylvia Trent", gender: "female" },
  { name: "Hugo Vane", gender: "male" },
];
const VICTIM = { name: "Dr. Mallory Finch", gender: "female" };

/** The real shipped paragraph, verbatim from the manuscript (dashes normalised to hyphens). */
const REAL_PARAGRAPH =
  "At the side table a folded linen cloth covered the carving knife taken from Dr. Mallory Finch's body. " +
  "The blade was still stained, and at the hilt a fleck of torn fabric had caught. " +
  "Eleanor looked at it a moment-the puncture, the blood spread wide beneath him on the boards, the garment " +
  "ripped away at the shoulder-and thought how little the violence of it agreed with the patience upstairs. " +
  'She drew the cloth closed. "You seem familiar with the workings here," she said, and did not make it a question. ' +
  "Hugo laughed softly. What did Hugo Vane see when he looked at her-or at the clock?";

describe("detectVictimBodyPronounMismatch — the shape the existing two detectors cannot see", () => {
  it("catches the real measured instance", () => {
    const events = detectVictimBodyPronounMismatch(REAL_PARAGRAPH, VICTIM, CAST);
    expect(events).toHaveLength(1);
    expect(events[0].kind).toBe("victim_body_pronoun");
    expect(events[0].characterName).toBe("Dr. Mallory Finch");
    expect(events[0].sentence).toContain("blood spread wide beneath him");
  });

  it("MEASURED: the two existing high-precision detectors are silent on that same text", () => {
    // This is the justification for the detector existing at all, pinned so it cannot rot.
    expect(detectAttributionFlips(REAL_PARAGRAPH, CAST)).toHaveLength(0);
    expect(detectImpossibleSelfReferences(REAL_PARAGRAPH, CAST)).toHaveLength(0);
  });

  it("fires even though a male character IS named later in the same paragraph", () => {
    // Hugo Vane (male) appears in the paragraph, but only AFTER the pronoun, so he cannot be its
    // antecedent. Suppressing on whole-paragraph presence would hide the defect this exists to catch.
    expect(REAL_PARAGRAPH.indexOf("Hugo")).toBeGreaterThan(REAL_PARAGRAPH.indexOf("beneath him"));
    expect(detectVictimBodyPronounMismatch(REAL_PARAGRAPH, VICTIM, CAST)).toHaveLength(1);
  });

  it("does NOT fire when a wrong-gender character is named BEFORE the pronoun", () => {
    const paragraph =
      "Hugo Vane knelt by Dr. Mallory Finch's body. The blood spread wide beneath him on the boards.";
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("does NOT fire on a live character's own gesture — the false positive the baseline caught", () => {
    // Real text from canary_1785694688532, a story whose victim is female. Every other guard passes:
    // "throat" is a body noun and no male is NAMED earlier in the paragraph. The clause supplies its
    // own referent via the subject pronoun, which is what the prior-subject guard reads.
    const paragraph =
      "Sylvia Trent's body had been taken away an hour before. He cleared his throat, the sound loud in the hush.";
    const victim = { name: "Sylvia Trent", gender: "female" };
    expect(detectVictimBodyPronounMismatch(paragraph, victim, CAST)).toHaveLength(0);
  });

  it("does NOT fire when the victim is never named in the paragraph", () => {
    const paragraph = "The blood spread wide beneath him on the boards, the garment ripped away.";
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("does NOT fire without a body or wound noun in the sentence", () => {
    const paragraph = "Dr. Mallory Finch had left the room. The lamp stood beside him on the table.";
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("does NOT fire when the pronoun already matches the victim's gender", () => {
    const paragraph =
      "Dr. Mallory Finch's body lay where it had fallen. The blood spread wide beneath her on the boards.";
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("does NOT fire inside dialogue", () => {
    const paragraph =
      'Dr. Mallory Finch\'s body lay in the hall. "The blood spread wide beneath him," Eleanor said.';
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("does NOT fire when an unnamed role noun intervenes", () => {
    const paragraph =
      "Dr. Mallory Finch's body lay in the hall. The constable stooped, and the blood had dried beneath him.";
    expect(detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST)).toHaveLength(0);
  });

  it("catches the possessive shape as well as the position shape", () => {
    const paragraph = "Dr. Mallory Finch lay where she had fallen. The wound at his throat was clean.";
    const events = detectVictimBodyPronounMismatch(paragraph, VICTIM, CAST);
    expect(events).toHaveLength(1);
    expect(events[0].sentence).toContain("his throat");
  });

  it("returns [] for a missing, ungendered or unnamed victim", () => {
    expect(detectVictimBodyPronounMismatch(REAL_PARAGRAPH, null, CAST)).toEqual([]);
    expect(detectVictimBodyPronounMismatch(REAL_PARAGRAPH, undefined, CAST)).toEqual([]);
    expect(detectVictimBodyPronounMismatch(REAL_PARAGRAPH, { name: "X", gender: "unknown" }, CAST)).toEqual([]);
    expect(detectVictimBodyPronounMismatch(REAL_PARAGRAPH, { name: "", gender: "female" }, CAST)).toEqual([]);
  });

  it("is repeatable — module-level /g regexes do not leak lastIndex between calls", () => {
    // The two body-shape patterns are module constants carrying the g flag; a missing lastIndex
    // reset makes the SECOND call on identical input return a different answer.
    const first = detectVictimBodyPronounMismatch(REAL_PARAGRAPH, VICTIM, CAST);
    const second = detectVictimBodyPronounMismatch(REAL_PARAGRAPH, VICTIM, CAST);
    const third = detectVictimBodyPronounMismatch(REAL_PARAGRAPH, VICTIM, CAST);
    expect(second).toEqual(first);
    expect(third).toEqual(first);
  });
});
