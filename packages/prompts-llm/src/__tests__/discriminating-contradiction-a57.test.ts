import { describe, expect, it } from "vitest";
import { findDiscriminatingContradictionPair } from "../agent9-prose/prompt-builder.js";

// A_57 D2 — the "single canonical contradiction" pair. A discriminating timeline/quantity mystery turns
// on a STAGED value and a TRUE value of the SAME dimension; the prose must present them as ONE contrast,
// never two flat parallel truths ("the central clue contradicts itself" — ChatGPT's biggest problem on
// run 09168377). The helper must find the pair ONLY when it is unambiguous, never forcing a wrong contrast.

describe("findDiscriminatingContradictionPair (A_57 D2)", () => {
  it("finds the real run-09168377 staged/true clock-time pair", () => {
    const pair = findDiscriminatingContradictionPair([
      {
        description: "The actual time when the sundial's shadow length indicates the murder must have occurred",
        value: "twenty minutes past four in the afternoon",
      },
      {
        description: "Time indicated by the sundial's shadow on the watch face, contradicting the servants' timeline",
        value: "half past three in the afternoon",
      },
    ]);
    expect(pair).not.toBeNull();
    expect(pair!.values).toEqual([
      "twenty minutes past four in the afternoon",
      "half past three in the afternoon",
    ]);
    expect(pair!.descriptions[1]).toContain("contradicting");
  });

  it("pairs two same-unit measurement readings (generic across dimensions)", () => {
    const pair = findDiscriminatingContradictionPair([
      { description: "gnomon angle the suspect claimed", value: "thirty degrees" },
      { description: "gnomon angle the shadow actually required", value: "forty-five degrees" },
    ]);
    expect(pair).not.toBeNull();
    expect(pair!.values).toEqual(["thirty degrees", "forty-five degrees"]);
  });

  it("returns null when the two atomic facts are different dimensions (a time and a dose)", () => {
    // baseInputs-shaped: "thirteen minutes to midnight" (time) + "three drops" (bare count) — NOT a pair.
    expect(
      findDiscriminatingContradictionPair([
        { description: "mantel clock reading", value: "thirteen minutes to midnight" },
        { description: "poison dose", value: "three drops" },
      ]),
    ).toBeNull();
  });

  it("never pairs two unrelated BARE COUNTS (drops vs letters are not a contradiction)", () => {
    expect(
      findDiscriminatingContradictionPair([
        { description: "poison dose", value: "three drops" },
        { description: "letters found in the desk", value: "two letters" },
      ]),
    ).toBeNull();
  });

  it("A_58 review: does NOT pair a real time against a descriptive value containing a bare 'to'/'half'", () => {
    // "pinned to the door" / "a quarter of the estate" must not be read as clock times and paired.
    expect(
      findDiscriminatingContradictionPair([
        { description: "true time", value: "half past three" },
        { description: "where the note was", value: "pinned to the door" },
      ]),
    ).toBeNull();
    expect(
      findDiscriminatingContradictionPair([
        { description: "true time", value: "twenty minutes past four" },
        { description: "share of the estate", value: "a quarter of the estate" },
      ]),
    ).toBeNull();
  });

  it("A_58 review: pairs same-scale measurements across irregular plurals (feet vs foot)", () => {
    const pair = findDiscriminatingContradictionPair([
      { description: "claimed height", value: "ten feet" },
      { description: "true height", value: "twelve foot" },
    ]);
    expect(pair).not.toBeNull();
    expect(pair!.values).toEqual(["ten feet", "twelve foot"]);
  });

  it("returns null when three+ same-dimension values make the pair ambiguous", () => {
    expect(
      findDiscriminatingContradictionPair([
        { description: "staged time", value: "half past three" },
        { description: "true time", value: "twenty minutes past four" },
        { description: "meal schedule", value: "half past six" },
      ]),
    ).toBeNull();
  });

  it("ignores descriptive facts and a duplicate of the same value", () => {
    const pair = findDiscriminatingContradictionPair([
      { description: "weather log", value: "Weather logs confirming clear skies during the afternoon" },
      { description: "staged time", value: "half past three" },
      { description: "true time", value: "twenty minutes past four" },
      { description: "restated true time", value: "twenty minutes past four" }, // duplicate, not a 3rd value
    ]);
    expect(pair).not.toBeNull();
    expect(pair!.values).toEqual(["half past three", "twenty minutes past four"]);
  });

  it("returns null for empty, single-fact, or undefined input", () => {
    expect(findDiscriminatingContradictionPair([])).toBeNull();
    expect(findDiscriminatingContradictionPair([{ description: "only", value: "half past three" }])).toBeNull();
    expect(findDiscriminatingContradictionPair(undefined)).toBeNull();
  });
});
