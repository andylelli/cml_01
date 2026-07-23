import { describe, expect, it } from "vitest";
import { applyFinalPronounSweep } from "../agent9-prose/generate.js";

// A_66 P1+P2 — the "Fix 2" final sweep was the LAST ungated deterministic pronoun mutation
// (probe #3's first re-run, mystery-1784832044130, shipped 11 flips from it under
// `pronoun_policy: verify`). Fixture the FAILURE: under verify/off the sweep must be a
// byte-exact no-op; when reachable (strict/relaxed) it is high-precision-guarded and
// reports on TEXT CHANGE.

type SweepChapters = Parameters<typeof applyFinalPronounSweep>[0];
const ch = (...paragraphs: string[]) =>
  ({ number: 1, title: "Fixture", paragraphs }) as unknown as SweepChapters[number];

const CAST = [
  { name: "Captain Ivor Hale", gender: "male" },
  { name: "Eleanor Voss", gender: "female" },
  { name: "Dr. Mallory Finch", gender: "female" },
];

describe("A_66 P1 — the final sweep obeys pronoun_policy", () => {
  it("under verify/off (checkingEnabled=false) it never mutates — even text it WOULD repair when enabled", () => {
    // This exact fixture IS repaired when the sweep is enabled (see the positive control below),
    // so an unchanged result here proves the policy gate, not repair impotence.
    const chapters = [ch("Captain Ivor Hale straightened his coat. She reached for the pipe on the desk.")];
    const beforeText = JSON.stringify(chapters);
    const result = applyFinalPronounSweep(chapters, CAST, false);
    expect(result).toEqual({ chaptersChanged: 0, revertedChapters: 0 });
    expect(JSON.stringify(chapters)).toBe(beforeText); // byte-exact — zero unguarded mutations
  });
});

describe("A_66 P2 — when reachable, the sweep is guarded and text-change honest", () => {
  it("positive control: an unambiguous subject-chain mismatch is repaired and committed", () => {
    const chapters = [ch("Captain Ivor Hale straightened his coat. She reached for the pipe on the desk.")];
    const result = applyFinalPronounSweep(chapters, CAST, true);
    expect(result.chaptersChanged).toBe(1);
    expect(result.revertedChapters).toBe(0);
    expect((chapters[0] as { paragraphs: string[] }).paragraphs.join("\n\n")).toContain("He reached for the pipe");
  });

  it("census bait: an object-position name never captures the subject pronoun (positional rule holds through the sweep)", () => {
    const chapters = [ch("He knelt beside Eleanor Voss, steadying the lamp.")];
    const beforeText = JSON.stringify(chapters);
    const result = applyFinalPronounSweep(chapters, CAST, true);
    expect(result).toEqual({ chaptersChanged: 0, revertedChapters: 0 });
    expect(JSON.stringify(chapters)).toBe(beforeText);
  });

  it("clean chapters: zero text changes reported (repairCount lies; text does not)", () => {
    const chapters = [
      ch("Dr. Mallory Finch lifted the tray. She frowned at the tide tables."),
      ch("Captain Ivor Hale said nothing. He watched the pier lights."),
    ];
    const beforeText = JSON.stringify(chapters);
    const result = applyFinalPronounSweep(chapters, CAST, true);
    expect(result).toEqual({ chaptersChanged: 0, revertedChapters: 0 });
    expect(JSON.stringify(chapters)).toBe(beforeText);
  });

  it("chapters without paragraph arrays are skipped untouched", () => {
    const chapters = [
      { number: 1, title: "No paragraphs" } as unknown as SweepChapters[number],
      ch(),
    ];
    const beforeText = JSON.stringify(chapters);
    const result = applyFinalPronounSweep(chapters, CAST, true);
    expect(result).toEqual({ chaptersChanged: 0, revertedChapters: 0 });
    expect(JSON.stringify(chapters)).toBe(beforeText);
  });

  it("empty cast: no-op even when enabled", () => {
    const chapters = [ch("She reached for the pipe on the desk.")];
    const beforeText = JSON.stringify(chapters);
    const result = applyFinalPronounSweep(chapters, [], true);
    expect(result).toEqual({ chaptersChanged: 0, revertedChapters: 0 });
    expect(JSON.stringify(chapters)).toBe(beforeText);
  });
});
