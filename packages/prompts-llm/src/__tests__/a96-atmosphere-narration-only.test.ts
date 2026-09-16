/**
 * A_96 F4 (B3) — AtmosphereRepair may not touch speech, and two more splice shapes are refused.
 *
 * Run 50862: one line of dialogue, four appearances, two corrupt — "You; searching for blame in the
 * shadowed places" and "blame in the shadows places" — plus "Norbury s gaze". The pass's third
 * recorded corruption (A_90 §12 #6, A_91 §12.3).
 */
import { afterEach, describe, expect, it } from "vitest";

import {
  applyPhraseSubstitutions,
  editOutsideQuotes,
  isAtmosphereNarrationOnlyEnabled,
  substitutionIntroducesMalformedText,
} from "../agent9-prose/repair.js";

const prev = process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY;
afterEach(() => {
  if (prev === undefined) delete process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY;
  else process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY = prev;
});

describe("the flag defaults OFF", () => {
  it("is off unless .env says so", () => {
    delete process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY;
    expect(isAtmosphereNarrationOnlyEnabled()).toBe(false);
  });
});

describe("editOutsideQuotes", () => {
  const shout = (s: string) => s.toUpperCase();

  it("edits narration and leaves speech untouched, with curly or straight quotes", () => {
    expect(editOutsideQuotes('the fog thickened. “you are searching for blame,” she said. he nodded.', shout))
      .toBe('THE FOG THICKENED. “you are searching for blame,” SHE SAID. HE NODDED.');
    expect(editOutsideQuotes('the fog thickened. "you are searching for blame," she said.', shout))
      .toBe('THE FOG THICKENED. "you are searching for blame," SHE SAID.');
  });

  it("an unbalanced final quote leaves the tail as speech — the conservative side", () => {
    expect(editOutsideQuotes('he turned. “you are searching', shout)).toBe('HE TURNED. “you are searching');
  });

  it("no quotes at all: the whole paragraph is narration", () => {
    expect(editOutsideQuotes("the fog thickened.", shout)).toBe("THE FOG THICKENED.");
  });
});

describe("THE DEFECT: a repeated line of dialogue is paraphrased in place", () => {
  const para = 'Harriet twisted her apron. "You\'re searching for blame in the dimmest places," she said. The fog thickened outside.';
  const replacements = [{ original: "searching for blame in the dimmest places", replacement: "hunting suspicion in the wrong places" }];

  it("OFF: the pass rewrites inside the quotation — what run 50862 shipped", () => {
    delete process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY;
    const out = applyPhraseSubstitutions([para], replacements)[0]!;
    expect(out).toContain("hunting suspicion in the wrong places");
    expect(out).not.toContain("searching for blame in the dimmest places");
  });

  it("ON: speech is left exactly as written; narration is still repaired", () => {
    process.env.AGENT9_ATMOSPHERE_NARRATION_ONLY = "true";
    const out = applyPhraseSubstitutions([para], replacements)[0]!;
    expect(out).toContain("searching for blame in the dimmest places");
    const narr = "The fog thickened outside, searching for blame in the dimmest places of the dunes.";
    expect(applyPhraseSubstitutions([narr], replacements)[0]).toContain("hunting suspicion in the wrong places");
  });
});

describe("two more malformed-splice shapes are refused", () => {
  it("a contraction whose apostrophe was eaten — 'You; searching'", () => {
    const before = "You're searching for blame in the dimmest places.";
    const after = "You; searching for blame in the shadowed places.";
    expect(substitutionIntroducesMalformedText(before, after)).toBe(true);
  });

  it("a possessive that lost its apostrophe — 'Norbury s gaze'", () => {
    const before = "She avoided Bertram Norbury's gaze.";
    const after = "She avoided Bertram Norbury s gaze.";
    expect(substitutionIntroducesMalformedText(before, after)).toBe(true);
  });

  it("ordinary English with a semicolon is not flagged — the pattern is narrow on purpose", () => {
    const before = "The fog thickened.";
    const after = "The fog thickened; nobody moved.";
    expect(substitutionIntroducesMalformedText(before, after)).toBe(false);
  });

  it("a shape already present before the splice is not blamed on the splice", () => {
    const before = "You; searching for blame.";
    expect(substitutionIntroducesMalformedText(before, before + " He nodded.")).toBe(false);
  });
});
