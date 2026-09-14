import { describe, expect, it } from "vitest";

import {
  summariseWitDensity,
  witDensity,
  WIT_CANON_FLOOR_PER_10K,
  WIT_CANON_MEDIAN_PER_10K,
  WIT_MIN_WORDS,
} from "../wit-density.js";

/**
 * A_92 — the first instrument for wit.
 *
 * CALIBRATED over the 11 canon novels in `library/texts/` above the word floor against 20 of our
 * shipped manuscripts: canon median 41.4 per 10k, ours 11.4, and **18 of our 20 books fall below
 * the LOWEST-scoring real novel (20.6)**. The corpus itself is 3.9 MB and is not a test fixture;
 * these tests pin the four SHAPES and the reporting, and the calibration lives in the module's
 * header where the numbers came from.
 */
const long = (n: number) => "word ".repeat(n).trim();

describe("shape 1 — the short retort", () => {
  it("counts a <=6-word speech immediately after a >=15-word one", () => {
    const text = `“${long(20)},” said Ambrose. “I doubt it,” said Iris. ${long(6000)}`;
    expect(witDensity(text).retort).toBe(1);
  });

  it("does not count two long speeches, nor a short one after a short one", () => {
    expect(witDensity(`“${long(20)},” he said. “${long(20)},” she said.`).retort).toBe(0);
    expect(witDensity(`“Quite so,” he said. “I doubt it,” she said.`).retort).toBe(0);
  });

  it("does not count speeches separated by a page of narration — that is not an exchange", () => {
    const text = `“${long(20)},” said Ambrose. ${long(400)} “I doubt it,” said Iris.`;
    expect(witDensity(text).retort).toBe(0);
  });
});

describe("shape 2 — the flat answer", () => {
  it("counts a <=4-word reply to a question", () => {
    expect(witDensity(`“Where were you at eight?” “In the cellar.”`).flatAnswer).toBe(1);
  });

  it("does not count an expanded answer, nor a short line that answers nothing", () => {
    expect(witDensity(`“Where were you at eight?” “I was in the cellar with the others, counting bottles.”`).flatAnswer).toBe(0);
    expect(witDensity(`“It was raining.” “In the cellar.”`).flatAnswer).toBe(0);
  });
});

describe("shape 3 — understatement, by its mechanism not its vocabulary", () => {
  it("counts a diminisher and a grave word in one sentence", () => {
    expect(witDensity("The evening deteriorated somewhat after the stabbing.").understatement).toBe(1);
    expect(witDensity("It was a rather inconvenient murder.").understatement).toBe(1);
  });

  it("counts neither alone", () => {
    expect(witDensity("The evening deteriorated somewhat.").understatement).toBe(0);
    expect(witDensity("There had been a murder.").understatement).toBe(0);
  });
});

describe("shape 4 — polite savagery", () => {
  it("counts courtesy carrying an incision", () => {
    expect(witDensity("I am sure the inspector's theory is not entirely nonsense.").politeSavagery).toBe(1);
    expect(witDensity("How very charming of him to lie so fluently.").politeSavagery).toBe(1);
  });

  it("counts neither alone", () => {
    expect(witDensity("I am sure he will come.").politeSavagery).toBe(0);
    expect(witDensity("That is nonsense.").politeSavagery).toBe(0);
  });
});

describe("the report says where the book stands", () => {
  const pad = (core: string, words: number) => `${core} ${long(words)}`;

  it("names the canon floor when the book is below every real novel", () => {
    const flat = summariseWitDensity(witDensity(long(7000)));
    expect(flat).toContain("BELOW the lowest-scoring real novel");
    expect(flat).toContain(String(WIT_CANON_FLOOR_PER_10K));
    expect(flat).toContain("MEASURE only");
  });

  it("says so when a book reaches the canon median", () => {
    // 40 flat answers in 6,000 words is 66.7 per 10k — above the canon median.
    const witty = pad(`“Where were you?” “Out.”`.repeat(40), 6000);
    const d = witDensity(witty);
    expect(d.per10k).toBeGreaterThanOrEqual(WIT_CANON_MEDIAN_PER_10K);
    expect(summariseWitDensity(d)).toContain("at or above the canon median");
  });

  it("refuses to report a density for a fragment", () => {
    const d = witDensity("“Where were you?” “Out.”");
    expect(d.measurable).toBe(false);
    expect(summariseWitDensity(d)).toContain(`too short to measure (floor ${WIT_MIN_WORDS})`);
  });

  it("an empty text is zero, not a crash", () => {
    const d = witDensity("");
    expect(d.total).toBe(0);
    expect(d.per10k).toBe(0);
  });
});

/**
 * A_92 — the band the run ASKED for, beside what arrived.
 *
 * Without this, a `dry` book and a flat `classic` book produce the same report line, and the one
 * sentence the report exists to support — "is this book flat, or was it ordered flat?" — cannot be
 * answered from it.
 */
describe('summariseWitDensity reports the target band', () => {
  // Long enough to be measurable, and deliberately witless: every shape counts zero.
  const text = 'x '.repeat(7000);

  it('says nothing about a target when none was given — the line is unchanged', () => {
    const d = witDensity(text);
    expect(summariseWitDensity(d)).not.toContain('Asked for');
  });

  it('names the band and the shortfall when the book falls under it', () => {
    const d = witDensity(text);
    const line = summariseWitDensity(d, { level: 'sharp', per10k: 60 });
    expect(line).toContain('Asked for sharp (target 60 per 10k)');
    expect(line).toContain('short by');
  });

  it('MET is reachable, and a target of 0 counts as met rather than as absent', () => {
    const d = witDensity(text);
    expect(d.per10k).toBe(0);
    expect(summariseWitDensity(d, { level: 'none', per10k: 0 })).toContain('Asked for none (target 0 per 10k) — MET');
  });
});
