import { describe, expect, it } from "vitest";
import { topUpMissingRelationshipCoverage } from "../jobs/agents/agent2-run.js";

/**
 * DIAGNOSIS-BATCH #3 — the relationship coverage gap.
 *
 * MEASURED (external read 84/100): the mechanism worked for ONE pair (Dr. Finch / Captain Hale —
 * real, concrete sharedHistory) while every OTHER character had zero coverage, and the reviewer
 * asked "what did Montague do to Kestrel... why is Marguerite loyal... what does Ferdinand's
 * patronage cost him" — precisely the characters the old full-replace fallback never reached, because
 * it only fires when NO valid pair exists at all.
 */

const CAST = ["Dr. Finch", "Captain Hale", "Marguerite Yardley", "Ferdinand Dunmore", "Ivor Kestrel"];

const GOOD_PAIR = {
  character1: "Dr. Finch",
  character2: "Captain Hale",
  relationship: "secret affair",
  tension: "high",
  sharedHistory: "Dr. Finch discovered Captain Hale's forged records and confronted him days before her death.",
};

describe("topUpMissingRelationshipCoverage (diagnosis-batch #3)", () => {
  it("reproduces the ACTUAL measured symptom: one good pair, everyone else missing", () => {
    const { topUpPairs, missingNames } = topUpMissingRelationshipCoverage(CAST, [GOOD_PAIR]);
    expect(missingNames.sort()).toEqual(["Ferdinand Dunmore", "Ivor Kestrel", "Marguerite Yardley"].sort());
    // every missing character appears in at least one top-up pair
    for (const name of missingNames) {
      const covered = topUpPairs.some(
        (p) => String(p.character1) === name || String(p.character2) === name,
      );
      expect(covered).toBe(true);
    }
  });

  it("returns nothing when every character already has coverage", () => {
    const pairs = [
      GOOD_PAIR,
      { character1: "Marguerite Yardley", character2: "Ferdinand Dunmore", sharedHistory: "x" },
      { character1: "Ivor Kestrel", character2: "Dr. Finch", sharedHistory: "y" },
    ];
    const { topUpPairs, missingNames } = topUpMissingRelationshipCoverage(CAST, pairs);
    expect(missingNames).toEqual([]);
    expect(topUpPairs).toEqual([]);
  });

  it("does NOT touch or duplicate the existing good pair's content — caller preserves it verbatim", () => {
    // this function only returns the TOP-UP pairs; it never mutates or re-returns existingPairs,
    // so the caller's [...existingPairs, ...topUpPairs] cannot lose or alter GOOD_PAIR.
    const { topUpPairs } = topUpMissingRelationshipCoverage(CAST, [GOOD_PAIR]);
    expect(topUpPairs.some((p) => p.character1 === "Dr. Finch" && p.character2 === "Captain Hale")).toBe(false);
  });

  it("a single missing character pairs with an already-covered one, not left alone", () => {
    const pairs = [
      { character1: "Dr. Finch", character2: "Captain Hale", sharedHistory: "x" },
      { character1: "Marguerite Yardley", character2: "Ferdinand Dunmore", sharedHistory: "y" },
    ];
    // only Ivor Kestrel is missing
    const { topUpPairs, missingNames } = topUpMissingRelationshipCoverage(CAST, pairs);
    expect(missingNames).toEqual(["Ivor Kestrel"]);
    expect(topUpPairs).toHaveLength(1);
    expect(topUpPairs[0].character1 === "Ivor Kestrel" || topUpPairs[0].character2 === "Ivor Kestrel").toBe(true);
  });

  it("multiple missing characters ring among themselves, each getting >=1 edge", () => {
    const { topUpPairs, missingNames } = topUpMissingRelationshipCoverage(CAST, [GOOD_PAIR]);
    expect(missingNames).toHaveLength(3);
    expect(topUpPairs).toHaveLength(3); // ring of 3 -> 3 edges
    for (const name of missingNames) {
      const count = topUpPairs.filter((p) => p.character1 === name || p.character2 === name).length;
      expect(count).toBeGreaterThanOrEqual(1);
    }
  });

  it("handles zero existing pairs (the caller's other branch handles this case; confirm no crash)", () => {
    const { topUpPairs, missingNames } = topUpMissingRelationshipCoverage(CAST, []);
    expect(missingNames).toHaveLength(CAST.length);
    expect(topUpPairs.length).toBeGreaterThan(0);
  });

  it("is case-insensitive when matching pair names against cast names", () => {
    const pairs = [{ character1: "dr. finch", character2: "CAPTAIN HALE", sharedHistory: "x" }];
    const { missingNames } = topUpMissingRelationshipCoverage(CAST, pairs);
    expect(missingNames).not.toContain("Dr. Finch");
    expect(missingNames).not.toContain("Captain Hale");
  });
});
