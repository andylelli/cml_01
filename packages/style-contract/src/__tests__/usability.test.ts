import { describe, expect, it } from "vitest";
import { checkArcCoverage, themeIsAClaim } from "../usability.js";
import { contractFingerprint, readStyleContract, sameContract } from "../accessor.js";
import { deriveStyleContract } from "../sign.js";

describe("themeIsAClaim — a theme is a claim, not a title (§4.3)", () => {
  it("accepts assertions (subject + predicate)", () => {
    expect(themeIsAClaim("How ambition corrupts loyalty")).toBe(true);
    expect(themeIsAClaim("The cost of protecting a secret")).toBe(true); // gerund "protecting"
    expect(themeIsAClaim("The violence that respectability does to truth")).toBe(true);
    expect(themeIsAClaim("How greed ruins a family")).toBe(true);
  });

  it("rejects bare noun-phrase titles a word count would have passed", () => {
    expect(themeIsAClaim("Betrayal")).toBe(false);
    expect(themeIsAClaim("A Country House Murder")).toBe(false);
    expect(themeIsAClaim("A comedy of manners")).toBe(false);
    expect(themeIsAClaim("Murder at the Vicarage")).toBe(false);
    expect(themeIsAClaim("")).toBe(false);
  });
});

describe("checkArcCoverage — coverage, not length (§4.3 / §6 'gate means something')", () => {
  // A tight, EXCELLENT arc that touches every beat — short but complete.
  const tightComplete =
    "We open on a settled household; the first turn upends it when the will surfaces; the midpoint " +
    "deepens the dread as alibis fray; the climax is the reenactment that unmasks the liar; the " +
    "resolution lets the house exhale.";
  // A BLOATED, generic arc — long, but it never reaches the climax.
  const bloatedIncomplete =
    "This is a story about a story, a mystery beneath the mystery, where every character carries a " +
    "secret arc beneath the whodunnit machinery, and the opening establishes a mood that lingers and " +
    "lingers across many words that say very little and circle the same few feelings repeatedly. The " +
    "first turn arrives. Then there is much atmosphere and weather and furniture and more atmosphere.";

  it("PASSES the tight complete arc (170-ish words is irrelevant)", () => {
    const r = checkArcCoverage(tightComplete);
    expect(r.complete).toBe(true);
    expect(r.missing).toEqual([]);
  });

  it("FAILS the bloated arc that never reaches the climax — inverting today's word-count behavior", () => {
    const r = checkArcCoverage(bloatedIncomplete);
    expect(r.complete).toBe(false);
    expect(r.missing).toContain("climax");
    expect(r.missing).toContain("resolution");
  });

  it("reports exactly which beats are covered vs missing", () => {
    const r = checkArcCoverage("We open, then a first turn, then the resolution.");
    expect(r.covered).toEqual(expect.arrayContaining(["opening", "first turn", "resolution"]));
    expect(r.missing).toEqual(expect.arrayContaining(["midpoint", "climax"]));
  });
});

describe("accessor — the §9.4 same-contract invariant", () => {
  it("reads the frozen contract from the common CML shapes", () => {
    const c = deriveStyleContract({ register: "noir" });
    expect(readStyleContract({ STYLE_CONTRACT: c })).toEqual(c);
    expect(readStyleContract({ CASE: { style_contract: c } })).toEqual(c);
    expect(readStyleContract({ style_contract: c })).toEqual(c);
    expect(readStyleContract({})).toBeUndefined();
  });

  it("sameContract is true for identical contracts regardless of key order, false when anything differs", () => {
    const a = deriveStyleContract({ premise: "wry comedy", comparables: ["Sayers"] });
    const b = deriveStyleContract({ premise: "wry comedy", comparables: ["Sayers"] });
    expect(sameContract(a, b)).toBe(true);
    expect(contractFingerprint(a)).toBe(contractFingerprint(b));

    const drifted = { ...a, humourTolerance: a.humourTolerance === 3 ? 2 : 3 };
    expect(sameContract(a, drifted)).toBe(false);
  });
});
