/**
 * X27 continued — "I confess" is how English says "I admit".
 *
 * Run `mystery-1788813939320` reported chapter 2 as "already names Percival Orme as guilty", seven
 * chapters before the reveal, on Frances Ellery addressing him:
 *
 *   "Tranquility is a relative term, Mr. Orme. I saw no one enter and no one leave, though I confess
 *    the rain interested me more than the corridor did."
 *
 * The vocative supplies the name and the aside supplies the "guilt". Only the aside is fixed; these
 * tests pin that the fix does not blind the check to an actual confession, which is the whole risk.
 *
 * The first attempt fixed the wrong path — it added the aside to `GUILT_IDIOM`, and these tests still
 * failed, because the offending sentence contains no name and so never reaches the third-person path.
 * The match comes from `confessionDisclosure`, which finds the name anywhere in the PARAGRAPH. Two of
 * these cases are the ones that caught it.
 */
import { describe, expect, it } from "vitest";

import { detectPrematureCulpritDisclosure } from "../accept.js";

const CULPRIT = "Percival Orme";
const REVEAL_CHAPTER = 9;
const book = (ch2Paragraphs: string[]) => [
  { title: "Chapter 1", paragraphs: ["The body was found beneath the mirror."] },
  { title: "Chapter 2", paragraphs: ch2Paragraphs },
];
const flags = (paragraphs: string[]): boolean =>
  detectPrematureCulpritDisclosure(book(paragraphs) as never, REVEAL_CHAPTER, CULPRIT).length > 0;

describe("the confessional aside is not a confession", () => {
  it("REGRESSION: the exact sentence from run mystery-1788813939320 no longer flags", () => {
    expect(
      flags([
        '"Tranquility is a relative term, Mr. Orme. I saw no one enter and no one leave, though I confess the rain interested me more than the corridor did."',
      ]),
    ).toBe(false);
  });

  it.each([
    ['I must confess', '"Mr. Orme, I must confess the corridor bored me."'],
    ['I freely confess', '"Mr. Orme, I freely confess I had stopped watching."'],
    ['I confess that', '"Mr. Orme, I confess that the rain held my attention."'],
    ['we confess', '"Mr. Orme, we confess the hour escaped us entirely."'],
  ])("does not flag the aside form: %s", (_label, paragraph) => {
    expect(flags([paragraph])).toBe(false);
  });
});

describe("a real confession still discloses — the risk this fix runs", () => {
  it.each([
    ['first person, next sentence carries the act', 'Percival Orme went white. "I confess it. I killed her."'],
    ['first person, same sentence carries the act', 'Percival Orme steadied himself. "I confess I killed her that night."'],
    ['third person confession', 'Percival Orme confessed to the murder before the hour was out.'],
    ['confess + it (not stripped)', 'Percival Orme lowered his eyes. "I confess it, and I will not pretend otherwise."'],
    ['named as the murderer', 'Percival Orme was the murderer, and the dust line proved it.'],
    ['guilt verb', 'Percival Orme had strangled her in the corridor.'],
  ])("still flags: %s", (_label, paragraph) => {
    expect(flags([paragraph])).toBe(true);
  });

  it("an ordinary sentence naming the culprit is still clean", () => {
    expect(flags(["Percival Orme crossed to the window and said nothing at all."])).toBe(false);
  });
});
