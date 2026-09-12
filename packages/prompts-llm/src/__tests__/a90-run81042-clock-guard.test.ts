import { describe, expect, it } from "vitest";

import {
  detectRecurringPhrases,
  gramsOverlappingLockedValues,
  lockedValueTokenRanges,
} from "../agent9-prose/phrase-analysis.js";
import { applyPhraseSubstitutions, substitutionChangesClockValues } from "../agent9-prose/repair.js";
import { tokenizeWords } from "../agent9-prose/lint.js";

/**
 * A_90 — run 81042's one time glitch, reproduced and refused at both ends.
 *
 * The read (87/100) found "Beatrice Whitlock's pocket watch froze at three past midnight past three"
 * in chapter 9. The log shows how: the repetition detector nominated the seven-word window
 * "s pocket watch stopped at ten minutes" (two words of the locked "ten minutes past three", under
 * the three-word floor), the atmosphere pass paraphrased it to "froze at three past midnight", and
 * the splice left "past three" stranded. The nomination is now excluded positionally and the
 * substitution is refused on its clock values, each under `AGENT9_PHRASE_LOCKED_BOUNDARY`.
 */
const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const saved = process.env.AGENT9_PHRASE_LOCKED_BOUNDARY;
  if (value === undefined) delete process.env.AGENT9_PHRASE_LOCKED_BOUNDARY;
  else process.env.AGENT9_PHRASE_LOCKED_BOUNDARY = value;
  try {
    return fn();
  } finally {
    if (saved === undefined) delete process.env.AGENT9_PHRASE_LOCKED_BOUNDARY;
    else process.env.AGENT9_PHRASE_LOCKED_BOUNDARY = saved;
  }
};

const LOCKED_SENTENCE = "Beatrice Whitlock's pocket watch stopped at ten minutes past three.";
const LOCKED = ["twenty-five minutes past three", "a quarter to four", "ten minutes past three"];

// The locked sentence recurs in every chapter; the surrounding prose does not, so the only
// recurring seven-word windows are the five that fit inside the sentence.
const chapters = [
  "Rain moved along the canal while the household waited for the constable to speak.",
  "The clock room smelled of oil and cold brass, and nobody would sit down.",
  "Frances Orme kept her gloves on and her opinions to herself until the tea came.",
].map((filler, i) => ({
  chapterNumber: i + 1,
  title: `Chapter ${i + 1}`,
  paragraphs: [`${filler} ${LOCKED_SENTENCE}`],
})) as any[];

describe("nomination — the window that cuts a locked value in half", () => {
  it("OFF reproduces the run: the fragment is nominated alongside the windows before it", () => {
    const phrases = withFlag(undefined, () => detectRecurringPhrases(chapters, 7, 3, LOCKED));
    expect(phrases).toContain("s pocket watch stopped at ten minutes");
    expect(phrases).toContain("whitlock s pocket watch stopped at ten");
    // the three-word floor already excludes windows carrying "ten minutes past" or more
    expect(phrases).not.toContain("pocket watch stopped at ten minutes past");
  });

  it("ON: every window overlapping the locked value is excluded; the window before it still qualifies", () => {
    const phrases = withFlag("true", () => detectRecurringPhrases(chapters, 7, 3, LOCKED));
    expect(phrases).not.toContain("s pocket watch stopped at ten minutes");
    expect(phrases).not.toContain("whitlock s pocket watch stopped at ten");
    expect(phrases).toContain("beatrice whitlock s pocket watch stopped at");
  });

  it("the positional helpers find the value where it occurs and the windows that touch it", () => {
    const tokens = tokenizeWords(chapters[0].paragraphs.join(" "));
    const ranges = lockedValueTokenRanges(tokens, LOCKED);
    expect(ranges).toHaveLength(1);
    const [start, end] = ranges[0]!;
    expect(tokens.slice(start, end)).toEqual(["ten", "minutes", "past", "three"]);
    const overlapping = gramsOverlappingLockedValues(tokens, 7, LOCKED);
    expect(overlapping.has("s pocket watch stopped at ten minutes")).toBe(true);
    expect(overlapping.has("beatrice whitlock s pocket watch stopped at")).toBe(false);
    // no locked value in the text: nothing excluded
    expect(gramsOverlappingLockedValues(tokenizeWords("a quiet evening on the water"), 7, LOCKED).size).toBe(0);
  });
});

describe("application — a substitution may not change a clock value", () => {
  const paragraph =
    "Three witnesses put you in the Manor House Library between four o'clock and half past. " +
    `${LOCKED_SENTENCE} The manor clock chimed at twenty-five minutes past three, and its face showed a quarter to four.`;
  const runReplacement = [{ original: "s pocket watch stopped at ten minutes", replacement: "s pocket watch froze at three past midnight" }];

  it("OFF reproduces the shipped line", () => {
    const [out] = withFlag(undefined, () => applyPhraseSubstitutions([paragraph], runReplacement));
    expect(out).toContain("pocket watch froze at three past midnight past three");
  });

  it("ON refuses it and the paragraph is untouched", () => {
    const [out] = withFlag("true", () => applyPhraseSubstitutions([paragraph], runReplacement));
    expect(out).toBe(paragraph);
    expect(substitutionChangesClockValues(paragraph, paragraph.replace("stopped at ten minutes", "froze at three past midnight"))).toBe(true);
  });

  it("ON still applies a substitution that leaves every clock value in place", () => {
    const benign = [{ original: "put you in the manor house library", replacement: "place you in the library of the manor" }];
    const [out] = withFlag("true", () => applyPhraseSubstitutions([paragraph], benign));
    expect(out!.toLowerCase()).toContain("place you in the library of the manor");
    expect(out).toContain("stopped at ten minutes past three");
    expect(substitutionChangesClockValues(paragraph, out!)).toBe(false);
  });
});
