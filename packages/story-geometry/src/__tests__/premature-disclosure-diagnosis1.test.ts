/**
 * DIAGNOSIS-BATCH #1 — does a chapter BEFORE the reveal already deliver the culprit-naming disclosure
 * that only the reveal chapter should own? The reverse direction of `detectAftermathRepeatParagraphs`
 * (which checks chapters AFTER the reveal for restatement).
 *
 * MEASURED, story_20260903-0738 (external read 78/100): "Chapter 8 prepares the final test and
 * already proves a lot... Then Chapter 9 repeats much of the same test." This file records the FULL
 * evidence trail, not just the shipped result, because most of the investigation was negative and the
 * negatives are worth as much as the positive (CLAUDE.md: a workflow's findings that do NOT survive
 * verification are the most valuable part of the run).
 *
 * THREE SIGNALS TESTED DIRECTLY AGAINST THE REAL MANUSCRIPT AND REJECTED BEFORE THIS ONE:
 *   1. `resolveDiscriminatingTestValidityState`'s theory/proof markers — hasTheoryMarker was FALSE on
 *      every chapter of both real manuscripts tested (the word "theory"/"hypothesis" essentially
 *      never appears in ordinary prose), so isValid never fired anywhere — a total miss.
 *   2. The outline-tuned `TEST_LIKE` regex (derive.ts, built for `checkRevealBinding`) — caught
 *      chapter 8 ("the test was ready") but missed chapter 9 entirely, AND "the test was ready" is
 *      genre-CORRECT preparation language (the "pattern" beat's own guide: "end preparing a final
 *      test or trap") — reusing it as a violation signal would flag every correctly-written
 *      preparation chapter as a false positive.
 *   3. The existing `namesCulpritAsGuilty`/`confessionDisclosure` — FIRST-PERSON only ("I did it,"
 *      said X); returned false on every chapter of the theatre manuscript, including chapter 10's
 *      actual confession-confirmation moment, because that moment is second-person ("You did it")
 *      with the culprit named only in the REACTION sentence that follows.
 *
 * THE ACTUAL THEATRE-CASE CHAPTER 8 DEFECT, read directly rather than assumed: narrator-voice
 * certainty-statement prose ("She had the how and the who... the motive out in the open") with no
 * accusation or confession SENTENCE at all — Dorothy and Kestrel never exchange an explicit
 * accusation in chapter 8. This is a semantic judgment ("has the narrator claimed the case is
 * solved"), not a pattern a regex can make reliably without an unacceptable false-positive rate on
 * ordinary investigative narration ("she began to see the shape of it" is common, legitimate prose in
 * a chapter that has NOT prematurely disclosed anything). `detectPrematureCulpritDisclosure` below
 * does NOT catch this — confirmed directly, not by construction — and that gap is real and open.
 */

import { describe, expect, it } from "vitest";

import { accusationConfirmedDisclosure, detectPrematureCulpritDisclosure, disclosureMatcher } from "../accept.js";
import type { GeometryChapter } from "../types.js";

describe("accusationConfirmedDisclosure — second-person accusation, confirmed by the culprit's silent presence", () => {
  const culpritRe = disclosureMatcher("Ivor Kestrel");

  it("catches the ACTUAL measured instance: accusation, a neutral beat, THEN the reaction naming the culprit", () => {
    const paragraph =
      '"You did it. " The words hung between them, final and irrevocable. Ivor Kestrel offered a slow nod, his eyes steady but silent.';
    expect(accusationConfirmedDisclosure(paragraph, culpritRe)).toBe('"You did it.');
  });

  it("catches a direct, immediately-attributed accusation", () => {
    const hugoRe = disclosureMatcher("Hugo Vane");
    const paragraph = 'Dorothy turned to face him directly. "You did it, Hugo," she said. Hugo Vane said nothing, his eyes fixed on the floor.';
    expect(accusationConfirmedDisclosure(paragraph, hugoRe)).toContain("You did it, Hugo");
  });

  it("does NOT fire when the accusation is explicitly denied, spelled out or contracted", () => {
    const hugoRe = disclosureMatcher("Hugo Vane");
    const spelledOut = 'Someone in the room may have done this. "You did it, Hugo," Beatrice said. "That is not true," Hugo Vane replied evenly.';
    expect(accusationConfirmedDisclosure(spelledOut, hugoRe)).toBeNull();
    const contracted = `Someone in the room may have done this. "You did it, Hugo," Beatrice said. "That's not true," Hugo Vane replied evenly.`;
    expect(accusationConfirmedDisclosure(contracted, hugoRe)).toBeNull();
  });

  it("does NOT fire on an accusation of a DIFFERENT (innocent) suspect, even naming the real culprit", () => {
    // A false-solution scene accusing someone else — the real culprit's name does not appear
    // anywhere in this paragraph at all, so disclosureMatcher (built from the real culprit) cannot
    // match regardless of who Beatrice is accusing.
    const hugoRe = disclosureMatcher("Hugo Vane");
    const paragraph = 'Dorothy turned to Beatrice. "You did it," she said, and Beatrice paled, her composure cracking under the accusation.';
    expect(accusationConfirmedDisclosure(paragraph, hugoRe)).toBeNull();
  });

  it("KNOWN, DOCUMENTED LIMITATION: a bystander named within the window can still match — recall was chosen over precision for this warning-only measure", () => {
    // The accusation is of someone else, but the real culprit (Hugo) is merely present nearby.
    // This is NOT a desired result; it is the recorded cost of widening the window enough to catch
    // the real measured instance above (radius 1 missed it; radius 2 catches this too).
    const hugoRe = disclosureMatcher("Hugo Vane");
    const paragraph = '"You did it," she said, and Beatrice paled. Hugo Vane watched from the doorway, saying nothing.';
    expect(accusationConfirmedDisclosure(paragraph, hugoRe)).not.toBeNull();
  });

  it("returns null with no culprit", () => {
    expect(accusationConfirmedDisclosure('"You did it." Someone nodded.', null)).toBeNull();
  });
});

describe("detectPrematureCulpritDisclosure — pre-reveal scan, warning-only", () => {
  const chapters = (paragraphsByChapter: string[][]): GeometryChapter[] =>
    paragraphsByChapter.map((paragraphs, i) => ({ chapterNumber: i + 1, paragraphs }));

  it("fires when an explicit accusation-confirmation lands BEFORE the assigned reveal chapter", () => {
    const cs = chapters([
      ["An ordinary opening chapter."],
      ["Dorothy confronted him early. \"You did it, Ivor,\" she said. Ivor Kestrel said nothing at all."],
      ["The reveal chapter, where this belongs."],
    ]);
    const findings = detectPrematureCulpritDisclosure(cs, 3, "Ivor Kestrel");
    expect(findings).toHaveLength(1);
    expect(findings[0]).toContain("chapter 2");
    expect(findings[0]).toContain("chapter 3");
  });

  it("is silent when the disclosure only appears IN the reveal chapter itself (the correct, common case)", () => {
    const cs = chapters([
      ["An ordinary opening chapter."],
      ["Investigation continues, nothing conclusive yet."],
      ["\"You did it, Ivor,\" Dorothy said. Ivor Kestrel said nothing at all."],
    ]);
    expect(detectPrematureCulpritDisclosure(cs, 3, "Ivor Kestrel")).toEqual([]);
  });

  it("MEASURED: is silent on both real manuscripts it was verified against before shipping (zero false positives)", () => {
    // Synthetic stand-ins for the two real books' pre-reveal chapters — ordinary investigative prose,
    // no accusation sentence anywhere. The real verification (against the actual .md files on disk)
    // was run directly during development; this pins the same NEGATIVE result so it cannot regress
    // silently if the signal is ever widened again.
    const ordinaryInvestigation = chapters([
      ["The detective examined the logbook, noting the discrepancy without comment."],
      ["Interviews continued through the afternoon, each account adding a thread to the pattern."],
      ["She began to see the shape of it, though nothing was yet certain."],
      ["The reveal chapter."],
    ]);
    expect(detectPrematureCulpritDisclosure(ordinaryInvestigation, 4, "Ivor Kestrel")).toEqual([]);
  });

  it("HONEST GAP, confirmed not assumed: does NOT catch narrator-certainty prose with no accusation sentence — the theatre case's actual chapter 8 defect", () => {
    // A close paraphrase of the real chapter 8's shape: extensive circumstantial confrontation and a
    // narrator statement of achieved certainty, with no accusation or confession SENTENCE at all.
    const narratorCertaintyOnly = chapters([
      [
        "Dorothy laid the diagrams beside the logs. Kestrel's hand trembled against the desk edge. " +
          "She had the how and the who. What she did not yet have was the moment.",
      ],
      ["The reveal chapter."],
    ]);
    expect(detectPrematureCulpritDisclosure(narratorCertaintyOnly, 2, "Ivor Kestrel")).toEqual([]);
  });

  it("returns [] for revealChapter <= 1 (nothing can precede chapter 1)", () => {
    const cs = chapters([["Anything at all."]]);
    expect(detectPrematureCulpritDisclosure(cs, 1, "Ivor Kestrel")).toEqual([]);
    expect(detectPrematureCulpritDisclosure(cs, 0, "Ivor Kestrel")).toEqual([]);
  });

  it("returns [] with no named culprit", () => {
    const cs = chapters([["\"You did it,\" she said."], ["Reveal."]]);
    expect(detectPrematureCulpritDisclosure(cs, 2, null)).toEqual([]);
    expect(detectPrematureCulpritDisclosure(cs, 2, undefined)).toEqual([]);
  });

  it("reports at most one finding per chapter, even with multiple qualifying paragraphs", () => {
    const cs = chapters([
      [
        "\"You did it, Ivor,\" Dorothy said. Ivor Kestrel said nothing.",
        "\"You did it, Ivor,\" she said again, more firmly. Ivor Kestrel still said nothing.",
      ],
      ["Reveal chapter."],
    ]);
    expect(detectPrematureCulpritDisclosure(cs, 2, "Ivor Kestrel")).toHaveLength(1);
  });
});
