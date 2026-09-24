import { describe, expect, it } from "vitest";
import { planChapterRedo } from "../agent9-prose/generate.ts";

// A_106 — the one-chapter redo. Seed 18179 read 71 and could not go to a reader because chapter 1
// was a fallback, and the only instrument rewrote all ten chapters. The plan: chapters before N
// stand, N is written again, chapters after N are kept.
describe("planChapterRedo", () => {
  it("is active when the env names a chapter the checkpoint holds", () => {
    expect(planChapterRedo(10, 10, "1")).toEqual({ active: true, chapter: 1, prefixLength: 0 });
    expect(planChapterRedo(10, 10, "4")).toEqual({ active: true, chapter: 4, prefixLength: 3 });
    expect(planChapterRedo(10, 10, " 10 ")).toEqual({ active: true, chapter: 10, prefixLength: 9 });
  });

  it("is inactive, and leaves the prefix whole, when the env is unset, malformed, or out of range", () => {
    expect(planChapterRedo(10, 10, undefined)).toEqual({ active: false, chapter: 0, prefixLength: 10 });
    expect(planChapterRedo(10, 10, "")).toEqual({ active: false, chapter: 0, prefixLength: 10 });
    expect(planChapterRedo(10, 10, "eleven")).toEqual({ active: false, chapter: 0, prefixLength: 10 });
    expect(planChapterRedo(10, 10, "0")).toEqual({ active: false, chapter: 0, prefixLength: 10 });
    expect(planChapterRedo(10, 10, "11")).toEqual({ active: false, chapter: 0, prefixLength: 10 });
  });

  it("is inactive when the checkpoint does not reach the chapter — a partial book resumes as before", () => {
    // A truncated checkpoint of 3 chapters cannot redo chapter 7; the ordinary prefix resume applies.
    expect(planChapterRedo(3, 10, "7")).toEqual({ active: false, chapter: 0, prefixLength: 3 });
  });
});
