/**
 * X94 — chapter 1 opened in the same style on every book this project has ever produced.
 *
 * `(chapterNumber - 1) % LEN` is correct within a book and constant across books at chapter 1, and
 * chapter 1 is the only chapter the `opening_hook` category reads. Measured over the 35 archived
 * manuscripts carrying an external read: opening_hook has a maximum of 8 in 34 reads and has NEVER
 * been given a 9, with `pressed` in 26% of first sentences, `gloved` in 23% and `stepped` in 23%.
 */

import { describe, expect, it } from "vitest";

import { OPENING_STYLE_ROTATION, openingStyleIndexFor } from "../agent9-prose/context-management.js";

const LEN = OPENING_STYLE_ROTATION.length;

describe("openingStyleIndexFor", () => {
  it("is unchanged with no seed — the old behaviour, byte for byte", () => {
    for (let ch = 1; ch <= 12; ch += 1) {
      expect(openingStyleIndexFor(ch)).toBe((ch - 1) % LEN);
    }
    expect(openingStyleIndexFor(1, "")).toBe(0);
    expect(openingStyleIndexFor(1, "   ")).toBe(0);
  });

  it("still rotates WITHIN a story — no two adjacent chapters share a style", () => {
    // This is what the entropy linter checks, and the fix must not cost it.
    for (const seed of ["The Reversed Pendulum", "The Tidal Trap", "Masquerade of Authority"]) {
      const seen = new Set<number>();
      for (let ch = 1; ch <= LEN; ch += 1) {
        const idx = openingStyleIndexFor(ch, seed);
        expect(openingStyleIndexFor(ch, seed)).not.toBe(openingStyleIndexFor(ch + 1, seed));
        seen.add(idx);
      }
      expect(seen.size, `every style used once per cycle for "${seed}"`).toBe(LEN);
    }
  });

  it("gives DIFFERENT stories different chapter-1 openings", () => {
    // The whole point. Real titles from the archive.
    const titles = [
      "The Reversed Pendulum at Seacliff Hotel",
      "The Delayed Strike at Cliffhaven Hotel",
      "The Weighted Pendulum Deception",
      "The Authority's Shadow on the Promenade",
      "Masquerade of Authority",
      "Echoes of Deceit",
      "The Tidal Trap",
      "The Clockwork Deceit",
    ];
    const openings = new Set(titles.map((t) => openingStyleIndexFor(1, t)));
    expect(openings.size, "eight titles must not collapse onto one opening style").toBeGreaterThan(1);

    // Measured over all 35 archived manuscript titles, chapter 1 lands 5/8/5/8/1/8 across the six
    // styles — every bucket used, against 35/35 on ONE style before this change. The assertion is
    // deliberately loose: a hash is not a scheduler, and the property that matters is "not constant".
    expect(new Set([...titles, "The Clock's Deception", "The Delayed Deception", "The Shadowed Staircase Secret"]
      .map((t) => openingStyleIndexFor(1, t))).size).toBeGreaterThanOrEqual(3);
  });

  it("is deterministic — the same case replays to the same openings", () => {
    // A random offset would make two runs of one case incomparable, and this repo has already lost a
    // paid experiment to non-reproducibility.
    const seed = "The Reversed Pendulum at Seacliff Hotel";
    const once = Array.from({ length: 10 }, (_, i) => openingStyleIndexFor(i + 1, seed));
    const twice = Array.from({ length: 10 }, (_, i) => openingStyleIndexFor(i + 1, seed));
    expect(twice).toEqual(once);
  });

  it("stays in range for any chapter number and any seed", () => {
    for (const ch of [1, 7, 10, 25, 100]) {
      for (const seed of [undefined, "a", "The Very Long Title Of A Story With Punctuation — and dashes"]) {
        const idx = openingStyleIndexFor(ch, seed);
        expect(idx).toBeGreaterThanOrEqual(0);
        expect(idx).toBeLessThan(LEN);
        expect(OPENING_STYLE_ROTATION[idx]).toBeDefined();
      }
    }
  });
});
