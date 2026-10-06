import { afterEach, describe, expect, it } from "vitest";
import { dunningG2, rankHousePhrases, type KeynessReference } from "../keyness.js";
import { collectCheckerFindings } from "../findings.js";
import { buildBookContract } from "../book-contract.js";
import { completeProjects } from "./fixtures.js";

/**
 * A_110 M8 (PROSE_V2_KEYNESS_FINDING) — the book's own house phrases, ranked against the canon (G², Log Ratio). A phrase
 * the reference does not hold is unknown and never ranked; a phrase touching a stated clock value is the case's and is
 * never sent; one sentence is flagged once.
 */
afterEach(() => {
  delete process.env.PROSE_V2_KEYNESS_FINDING;
});

const ref: KeynessReference = {
  canonFourGrams: 10_000_000,
  phrases: { "hung in the air": 2, "gaze fixed on the": 4, "at the same time": 5000, "twenty minutes past three": 1 },
};
const habit = "The silence hung in the air. Her gaze fixed on the door. ";
// A book is ~17,000 words; a rate is only a rate at that length. Unique filler, unknown to the reference.
const letters = "abcdefghijklmnopqrstuvwxyz";
const filler = Array.from({ length: 16_000 }, (_, i) => `w${letters[i % 26]}${letters[Math.floor(i / 26) % 26]}${letters[Math.floor(i / 676) % 26]}`).join(" ") + ". ";

describe("ranking", () => {
  it("G² is zero when the rates match and grows with the excess", () => {
    expect(dunningG2(10, 1000, 10_000, 1_000_000)).toBeCloseTo(0, 6);
    expect(dunningG2(10, 1000, 1, 1_000_000)).toBeGreaterThan(dunningG2(5, 1000, 1, 1_000_000));
  });
  it("ranks the book's repeated phrases the canon rarely uses; ignores common English and unknown phrases", () => {
    const text = filler + habit.repeat(4) + "At the same time, at the same time, at the same time. A brand new phrase here, a brand new phrase here, a brand new phrase here.";
    const ranked = rankHousePhrases(text, ref).map((p) => p.phrase);
    expect(ranked).toEqual(expect.arrayContaining(["hung in the air", "gaze fixed on the"]));
    expect(ranked).not.toContain("at the same time");
    expect(ranked.some((p) => p.includes("brand new"))).toBe(false);
  });
  it("an excluded phrase is never ranked", () => {
    const text = filler + "It was twenty minutes past three. ".repeat(5) + habit.repeat(4);
    const ranked = rankHousePhrases(text, ref, { exclude: (p) => p.includes("minutes past") }).map((p) => p.phrase);
    expect(ranked).not.toContain("twenty minutes past three");
  });
});

describe("the finding", () => {
  const p = completeProjects()[0]!;
  const contract = buildBookContract(p.input);
  const chapters = [1, 2, 3].map((n) => ({ title: `c${n}`, number: n, paragraphs: [habit.repeat(2) + "It was twenty minutes past three when she left."] }));
  const run = () => collectCheckerFindings(chapters, contract, [1, 2, 3], { keyness: ref }).filter((f) => f.class === "house_phrase");

  it("OFF: nothing", () => {
    expect(run()).toEqual([]);
  });
  it("ON: later uses of a habit go to the editor, the first stays, no clock phrase, no sentence twice", () => {
    process.env.PROSE_V2_KEYNESS_FINDING = "1";
    const found = run();
    expect(found.length).toBeGreaterThan(0);
    expect(found.length).toBeLessThanOrEqual(8);
    expect(found.every((f) => f.severity === "craft")).toBe(true);
    expect(found.some((f) => /twenty minutes past three/.test(f.note))).toBe(false);
    const keys = found.map((f) => `${f.chapter}|${f.quote}`);
    expect(new Set(keys).size).toBe(keys.length);
  });
});
