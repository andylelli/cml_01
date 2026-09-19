/**
 * THE GATE — exactly two stops, and both of them had no test.
 *
 * ANALYSIS_99 §10.9: a book that exists is worth more than a book that would have been slightly
 * better, so only the two fair-play breaches stop a run and everything else is a warning line. The
 * design was right and the implementation was untested, which cost a run.
 *
 * MEASURED 2026-09-19, `resume-1789805865810`: the gate STOPPED a ten-chapter, 8,182-word book whose
 * reveal chapter says *"Nora Quayle engineered the murder, exploited the authority of the judge, and
 * doctored the records to conceal the truth."* The verb list held `killed|murdered|poisoned|
 * strangled|struck`; the prose used `engineered` with `murder` as a NOUN, so nothing matched and a
 * compliant book was recorded as a failed run.
 *
 * A stop that fires on a compliant book is worse than no stop: it is B1's off switch with extra
 * steps, wearing the authority of a fair-play guarantee. Every stop below is asserted against text
 * that SHOULD trip it and text that should not.
 */
import { describe, expect, it } from "vitest";

import { buildContractCore } from "../contract.js";
import { applyGate } from "../gate.js";
import type { ProseChapterLike } from "../types.js";

const core = buildContractCore({
  cml: {
    CASE: {
      culpability: { culprits: ["Nora Quayle"] },
      cast: [
        { name: "Nora Quayle", role_archetype: "suspect" },
        { name: "Bertram Norbury", role_archetype: "detective" },
        { name: "Montague Gaunt", role_archetype: "victim" },
      ],
      hidden_model: { mechanism: { description: "a compass held at a habitual tilt" } },
      prose_requirements: { clue_to_scene_mapping: [] },
    },
  },
  clues: {
    clues: [
      {
        id: "clue_compass_tilt",
        observable: "the scuffed brass casing of the compass, worn along one edge",
        description: "the compass casing is worn where a thumb has tilted it",
        criticality: "essential",
      },
    ],
  },
  outline: {
    acts: [
      {
        scenes: [
          {
            sceneNumber: 1,
            act: 1,
            beat: "gathering",
            title: "Arrival",
            characters: ["Bertram Norbury", "Nora Quayle"],
            setting: { location: "the hotel office" },
            cluesRevealed: ["clue_compass_tilt"],
          },
          {
            sceneNumber: 2,
            act: 2,
            beat: "final_trap",
            title: "The Test",
            characters: ["Bertram Norbury", "Nora Quayle"],
            setting: { location: "the dunes" },
          },
          {
            sceneNumber: 3,
            act: 3,
            beat: "revelation",
            title: "After",
            characters: ["Bertram Norbury"],
            setting: { location: "the promenade" },
          },
        ],
      },
    ],
  },
  cast: {
    characters: [
      { name: "Nora Quayle" },
      { name: "Bertram Norbury" },
      { name: "Montague Gaunt", role_archetype: "victim" },
    ],
  },
  humourLevel: "classic",
});

const REVEAL = core.roles.reveal;
const EXPECTED = [1, 2, 3];

const chapter = (...paragraphs: string[]): ProseChapterLike => ({ title: "t", paragraphs });

/** The clue's key terms, on a page before the reveal, so stop 2 is satisfied while stop 1 is tested. */
const CLUE_PAGE = chapter(
  "Bertram turned it over and found the scuffed brass casing of the compass, worn along one edge.",
);

/** A book whose reveal chapter carries `revealText`, with everything else compliant. */
const bookWithReveal = (revealText: string): ProseChapterLike[] =>
  EXPECTED.map((n) =>
    n === REVEAL ? chapter(revealText) : n < REVEAL ? CLUE_PAGE : chapter("The promenade had been swept."),
  );

const verdict = (chapters: ProseChapterLike[]) =>
  applyGate({ chapters, core, expected: EXPECTED, findings: [], deterministicWrites: 0 });

describe("stop 1 — the reader is told who did it", () => {
  it("KNOWN-POSITIVE: a reveal chapter that never names the culprit stops the run", () => {
    const v = verdict(bookWithReveal("Bertram folded the ledger away and said nothing at all."));
    expect(v.ship).toBe(false);
    expect(v.stops.some((s) => /never told who did it/.test(s))).toBe(true);
  });

  it("REGRESSION: 'engineered the murder' is naming the culprit — the sentence that cost a run", () => {
    // resume-1789805865810, chapter 9, verbatim.
    const v = verdict(
      bookWithReveal(
        "Nora Quayle engineered the murder, exploited the authority of the judge, and doctored " +
          "the records to conceal the truth.",
      ),
    );
    expect(v.stops, JSON.stringify(v.stops)).toEqual([]);
    expect(v.ship).toBe(true);
  });

  it("the plain forms still pass, so the fix added to the predicate rather than replacing it", () => {
    for (const text of [
      "Nora Quayle killed him, and Bertram had known it since the dunes.",
      "Nora Quayle murdered the judge for the ledger it would let her rewrite.",
      "The murderer was Nora Quayle, and she had stood among them all evening.",
      "Quayle did it, and the compass had been saying so for two days.",
    ]) {
      expect(verdict(bookWithReveal(text)).ship, text).toBe(true);
    }
  });

  it("the new constructions pass: authorship, attribution and confession", () => {
    for (const text of [
      "Nora Quayle carried out the killing while the others watched the sands.",
      "Nora Quayle orchestrated the crime from the office she was never seen to leave.",
      "The murder was the work of Nora Quayle, and the ledger had always said so.",
      "Nora Quayle confessed before the clock finished striking.",
    ]) {
      expect(verdict(bookWithReveal(text)).ship, text).toBe(true);
    }
  });

  it("KNOWN-NEGATIVE: suspicion is still not an accusation, or the early-naming gate breaks", () => {
    // This predicate runs in BOTH directions — the reveal must satisfy it and every earlier chapter
    // must not. Widening it until suspicion counts would stop every book at chapter 1 instead.
    for (const text of [
      "Nora Quayle had been near the office all evening, and that troubled him.",
      "Bertram wondered whether Nora Quayle had known about the ledger.",
      "Nora Quayle was the only one who understood the compass, which proved nothing.",
      "If Nora Quayle had wanted the judge dead, she had hidden it well.",
    ]) {
      const v = verdict(bookWithReveal(text));
      expect(v.ship, text).toBe(false);
      expect(v.stops.some((s) => /never told who did it/.test(s)), text).toBe(true);
    }
  });

  it("a book with no culprit recorded is not stopped for failing to name one", () => {
    const noCulprit = { ...core, fairPlay: { ...core.fairPlay, culprits: [] } };
    const v = applyGate({
      chapters: bookWithReveal("Nobody was named."),
      core: noCulprit,
      expected: EXPECTED,
      findings: [],
      deterministicWrites: 0,
    });
    expect(v.stops.some((s) => /never told who did it/.test(s))).toBe(false);
  });
});

describe("the stop is BOOK-level, measured over 51 shipped books", () => {
  // Replaying this gate over every archived v1 book stopped 44 of 51, all for this one reason. The
  // diagnosis: 18 name the culprit one chapter later than the contract planned (a contract mismatch,
  // not a breach) and the rest used constructions the predicate could not see.
  const bookNaming = (revealText: string, afterText: string): ProseChapterLike[] =>
    EXPECTED.map((n) => (n === REVEAL ? chapter(revealText) : n < REVEAL ? CLUE_PAGE : chapter(afterText)));

  it("KNOWN-POSITIVE: named nowhere at or after the reveal still STOPS", () => {
    const v = verdict(bookNaming("Bertram folded the ledger away.", "The promenade had been swept."));
    expect(v.ship).toBe(false);
    expect(v.stops.some((s) => /never told who did it/.test(s))).toBe(true);
  });

  it("named AFTER the reveal ships, with a warning — the book resolves late, it does not cheat", () => {
    const v = verdict(bookNaming("Bertram folded the ledger away.", "Nora Quayle killed him, and she did not deny it."));
    expect(v.stops).toEqual([]);
    expect(v.ship).toBe(true);
    expect(v.warnings.some((w) => /named after the reveal chapter/.test(w))).toBe(true);
  });

  it("named IN the reveal ships with no warning about it", () => {
    const v = verdict(bookNaming("Nora Quayle killed him, and Bertram had known since the dunes.", "The promenade was swept."));
    expect(v.stops).toEqual([]);
    expect(v.warnings.some((w) => /named after the reveal chapter/.test(w))).toBe(false);
  });

  it("KNOWN-POSITIVE: named ONLY before the reveal is not a reveal", () => {
    const early = EXPECTED.map((n) =>
      n === 1 ? chapter("Nora Quayle killed him, and everybody knew it by breakfast.") : chapter("Nothing was said."),
    );
    expect(verdict(early).ship).toBe(false);
  });
});

describe("the constructions the corpus actually uses", () => {
  const revealSays = (text: string) =>
    verdict(EXPECTED.map((n) => (n === REVEAL ? chapter(text) : n < REVEAL ? CLUE_PAGE : chapter("After."))));

  it("KNOWN-POSITIVE: 'was responsible' — 3 of 26 books said this and nothing stronger", () => {
    // canary_1785860662360, chapter 10, verbatim.
    expect(revealSays("Nora Quayle was responsible; the evidence allowed no other reading.").stops).toEqual([]);
  });

  it("KNOWN-POSITIVE: the arrest — 8 of 26 ended on it and on nothing else", () => {
    for (const text of [
      "She watched as Nora Quayle was led away, her head bowed, the hotel's fragile order restored.",
      "Nora Quayle was taken into custody before the tide turned.",
      "Nora Quayle was charged with the murder that evening.",
    ]) {
      expect(revealSays(text).stops, text).toEqual([]);
    }
  });

  it("KNOWN-NEGATIVE: placement is not attribution", () => {
    // canary_1785694688532, chapter 9 — a chapter titled "The Culprit Revealed" whose strongest
    // sentence puts the culprit NEAR the clock and never says he killed anybody. The gate must keep
    // stopping this, because a reader finishing it has not been told who did it.
    const v = revealSays(
      "Finding this here means Nora Quayle must have been near the clock when it was set back to a quarter past ten.",
    );
    expect(v.ship).toBe(false);
  });

  it("KNOWN-NEGATIVE: an unrelated use of the verbs does not accuse", () => {
    for (const text of [
      "Nora Quayle, who had once orchestrated the routines of the hotel with unyielding care, said nothing.",
      "Nora Quayle was responsible for the linen, and had been for eleven years.",
    ]) {
      expect(revealSays(text).ship, text).toBe(false);
    }
  });
});

describe("everything else is a warning, never a stop", () => {
  it("a missing chapter warns and still ships", () => {
    const short = bookWithReveal("Nora Quayle killed him.").slice(0, 2);
    const v = verdict(short);
    expect(v.warnings.some((w) => /chapter \d is missing/.test(w))).toBe(true);
  });

  it("unresolved findings warn and still ship", () => {
    const v = applyGate({
      chapters: bookWithReveal("Nora Quayle killed him."),
      core,
      expected: EXPECTED,
      findings: [{ class: "register_sentence", chapter: 1, quote: "x", note: "y" } as never],
      deterministicWrites: 0,
    });
    expect(v.ship).toBe(true);
    expect(v.warnings.some((w) => /register_sentence: 1 unresolved/.test(w))).toBe(true);
  });

  it("a deterministic write warns loudly and still ships — L1 is asserted, not trusted", () => {
    const v = applyGate({
      chapters: bookWithReveal("Nora Quayle killed him."),
      core,
      expected: EXPECTED,
      findings: [],
      deterministicWrites: 3,
    });
    expect(v.ship).toBe(true);
    expect(v.warnings.some((w) => /DETERMINISTIC WRITES: 3/.test(w))).toBe(true);
  });
});
