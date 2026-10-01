import { describe, expect, it } from "vitest";
import { tokenMatchesText } from "@cml/prompts-llm";
import { keyTermHits } from "../clue-terms.js";

/** A9V-04: the helper reproduces both rules the selector and the gate used inline. */
const terms = ["clock", "stopped", "ten", "mantel"];
const texts = [
  "the clock on the mantel had stopped at ten past nine.",
  "the clocks were wound; nobody stopping.",
  "a mantelpiece, a tenant, a stoppered bottle.",
  "",
];

describe("keyTermHits", () => {
  for (const text of texts) {
    it(`stemmed = the selector's inline count — ${JSON.stringify(text.slice(0, 30))}`, () => {
      expect(keyTermHits(terms, text, "stemmed")).toBe(terms.filter((t) => tokenMatchesText(t, text)).length);
    });
    it(`substring = the gate's inline count — ${JSON.stringify(text.slice(0, 30))}`, () => {
      expect(keyTermHits(terms, text, "substring")).toBe(terms.filter((t) => text.includes(t)).length);
    });
  }
  it("the two rules genuinely differ: stemmed finds a plural term's singular, substring does not", () => {
    expect(keyTermHits(["clocks"], "the clock stopped", "stemmed")).toBe(1);
    expect(keyTermHits(["clocks"], "the clock stopped", "substring")).toBe(0);
  });
});
