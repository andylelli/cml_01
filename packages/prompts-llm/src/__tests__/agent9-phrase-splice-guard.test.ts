/**
 * A_71 — the AtmosphereRepair splice guard.
 *
 * MEASURED failure this pins (story_20260731-1650, Ch1): the pass replaced the noun phrase
 * "tremor in her fingers" with the clause "her knuckles twitched" by literal regex substitution,
 * stranding the determiner+adjective in front of it and shipping
 *   "Hugo Vane noticed the slight her knuckles twitched as she straightened her gloves."
 *
 * The saved polish request/response for that chapter both contain the CLEAN sentence, proving the
 * corruption happened after the polish pass — so no amount of polish-model quality can fix it.
 */
import { describe, expect, it } from "vitest";
import {
  applyPhraseSubstitutions,
  substitutionIntroducesMalformedText,
} from "../agent9-prose/repair.js";

describe("substitutionIntroducesMalformedText", () => {
  it("flags a determiner stranded in front of a pronoun clause", () => {
    expect(
      substitutionIntroducesMalformedText(
        "noticed the slight tremor in her fingers",
        "noticed the slight her knuckles twitched",
      ),
    ).toBe(true);
  });

  it("flags a doubled determiner left by an overlapping splice", () => {
    expect(substitutionIntroducesMalformedText("crossed the room", "crossed the the room")).toBe(true);
  });

  it("flags a possessive followed by a finite pronoun", () => {
    expect(substitutionIntroducesMalformedText("her steady hands", "her she was steady")).toBe(true);
  });

  it("passes a clean like-for-like noun-phrase swap", () => {
    expect(
      substitutionIntroducesMalformedText(
        "noticed the slight tremor in her fingers",
        "noticed the slight catch in her breath",
      ),
    ).toBe(false);
  });

  it("does not blame the replacement for a malformation already in the source", () => {
    // "the slight her" is present BEFORE the substitution, so this replacement did not introduce it.
    expect(
      substitutionIntroducesMalformedText("the slight her knuckles and the rain", "the slight her knuckles and the storm"),
    ).toBe(false);
  });
});

describe("applyPhraseSubstitutions", () => {
  const paras = ["Hugo Vane noticed the slight tremor in her fingers as she adjusted her gloves."];

  it("rolls back the exact regression rather than shipping a broken sentence", () => {
    const out = applyPhraseSubstitutions(paras, [
      { original: "tremor in her fingers", replacement: "her knuckles twitched" },
    ]);
    expect(out[0]).toBe(paras[0]);
    expect(out[0]).not.toContain("the slight her");
  });

  it("still applies a grammatically compatible replacement", () => {
    const out = applyPhraseSubstitutions(paras, [
      { original: "tremor in her fingers", replacement: "catch in her breath" },
    ]);
    expect(out[0]).toContain("the slight catch in her breath");
  });

  it("drops only the offending replacement, keeping the good ones", () => {
    const out = applyPhraseSubstitutions(
      ["The slight tremor in her fingers betrayed her as the rain fell hard."],
      [
        { original: "tremor in her fingers", replacement: "her knuckles twitched" }, // bad
        { original: "the rain fell hard", replacement: "the rain came down in sheets" }, // good
      ],
    );
    expect(out[0]).toContain("tremor in her fingers");
    expect(out[0]).toContain("the rain came down in sheets");
  });

  it("preserves the existing capitalisation behaviour", () => {
    const out = applyPhraseSubstitutions(["Tremor in her fingers betrayed her."], [
      { original: "tremor in her fingers", replacement: "catch in her breath" },
    ]);
    expect(out[0]).toBe("Catch in her breath betrayed her.");
  });

  it("is a no-op when there are no replacements", () => {
    expect(applyPhraseSubstitutions(paras, [])).toEqual(paras);
  });
});

/**
 * Regression: the first cut of the guard used a bare `{0,2}` window between determiner and pronoun,
 * which matches ordinary English. Measured on story_20260731-1750: 71 matches in a clean story —
 * "the chain of his medals", "the marble as she turned", "the medals on his coat" — every one
 * well-formed. Since the guard rolls back any substitution that introduces a match, that would have
 * silently discarded large numbers of legitimate variety edits.
 */
describe("guard precision — must not reject ordinary English", () => {
  const WELL_FORMED = [
    "He touched the chain of his medals.",
    "She crossed the marble as she turned.",
    "The medals on his coat caught the light.",
    "the letter from her sister",
    "a silence between them",
    "the light through her window",
    "the question about their alibi",
  ];

  it("treats well-formed phrases as clean when introduced by a substitution", () => {
    for (const phrase of WELL_FORMED) {
      expect(substitutionIntroducesMalformedText("placeholder text", phrase)).toBe(false);
    }
  });

  it("still catches the genuine malformation", () => {
    expect(substitutionIntroducesMalformedText("placeholder text", "noticed the slight her knuckles twitched")).toBe(
      true,
    );
    expect(substitutionIntroducesMalformedText("placeholder text", "the faint her breath caught")).toBe(true);
  });

  it("does not fire on 'hiss' and similar words that merely start with a pronoun", () => {
    expect(substitutionIntroducesMalformedText("x", "the faint hiss of rain against the glass")).toBe(false);
  });
});
