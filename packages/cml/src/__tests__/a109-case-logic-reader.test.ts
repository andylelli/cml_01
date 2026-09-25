/**
 * ANALYSIS_109 M2 — who does the reader suspect after each chapter? A posterior over the suspects,
 * walked chapter by chapter through the clues the contract shows; its entropy is the reader's doubt.
 *
 * The golden known-positive (all four contracts hand the reader the culprit by chapter 4–5, test at 8)
 * is pinned in prose-engine's `fresh-read-checkers.test.ts`, which owns the contract's clue ownership.
 * Here: hand-built schedules of one case, so each verdict is traceable to the arithmetic.
 */
import { describe, expect, it } from "vitest";

import { buildCaseModel, summariseReader, walkReader } from "../index.js";

const cast = [
  { name: "Gerald Harcourt", role_archetype: "detective" },
  { name: "Beatrice Langley", role_archetype: "victim" },
  { name: "Leonard Pike" },
  { name: "Margot Ellsworth" },
  { name: "Evelyn Marsh" },
  { name: "Charles Wentworth" },
];
const model = buildCaseModel({
  cml: { CASE: { cast, culpability: { culprits: ["Leonard Pike"] }, false_solution: { accused_suspect: "Charles Wentworth" } } },
  clues: [
    { id: "means", observable: "A spanner.", inference: "Only Leonard Pike had the means." },
    { id: "scene", observable: "Oil on a cuff.", inference: "Ties Leonard Pike to the scene." },
    { id: "herring", observable: "A torn letter.", inference: "Focuses suspicion on Charles Wentworth." },
    { id: "margot", observable: "The kitchen log.", inference: "Eliminates Margot Ellsworth." },
  ],
});
const chapters = [1, 2, 3, 4, 5, 6, 7];
const schedule = { chapters, testChapter: 6, revealChapter: 7 };

describe("the reader's doubt, chapter by chapter", () => {
  it("reads the clues the way the walk needs them", () => {
    const byId = (id: string) => model.clues.find((c) => c.id === id)!;
    expect(byId("means").implicates).toEqual(["Leonard Pike"]);
    expect(byId("herring").implicates).toEqual(["Charles Wentworth"]);
    expect(byId("margot").clears).toEqual(["Margot Ellsworth"]);
  });

  it("KNOWN-POSITIVE: the culprit's clues owned early — the favourite from chapter 2, one live suspect from 3", () => {
    const r = walkReader(model, { ...schedule, ownership: new Map([["means", 2], ["scene", 3]]) });
    expect(r.culpritLeadsAt).toBe(2);
    expect(r.floorBrokenAt).toBe(3);
    expect(r.culpritClues).toEqual([{ id: "means", chapter: 2 }, { id: "scene", chapter: 3 }]);
    expect(summariseReader(r, model)).toContain("Leonard Pike is the favourite from chapter 2, before the test");
  });

  it("KNOWN-NEGATIVE: a false lead first, the culprit's clues at the test — two live suspects throughout, resolved at the reveal", () => {
    const r = walkReader(model, {
      ...schedule,
      ownership: new Map([["herring", 2], ["margot", 3], ["means", 6], ["scene", 6]]),
      clearances: new Map([["Charles Wentworth", 6], ["Evelyn Marsh", 6]]),
    });
    expect(r.culpritLeadsAt).toBeNull();
    expect(r.floorBrokenAt).toBeNull();
    expect(r.falseLeadAtMidpoint).toBe(true);
    expect(r.collapsed).toBe(true);
  });

  it("at a tie there is no favourite, whatever the cast order", () => {
    const r = walkReader(model, { ...schedule, ownership: new Map() });
    expect(r.walk[0]!.leader).toBe("");
    expect(r.walk[0]!.entropy).toBeCloseTo(2, 6);
  });

  it("a clue shown without its conclusion is weaker: the same early schedule, withheld, hands over nobody", () => {
    const early = new Map([["means", 2], ["scene", 3]]);
    const r = walkReader(model, { ...schedule, ownership: early, withheld: new Set(["means", "scene"]) });
    expect(r.culpritLeadsAt).toBeNull();
    expect(r.floorBrokenAt).toBeNull();
  });

  it("the verdict is the schedule's, not the constant's: the early schedule still hands over the culprit at half the ratio", () => {
    const r = walkReader(model, { ...schedule, ownership: new Map([["means", 2], ["scene", 3]]), ratios: { implicate: 2 } });
    expect(r.culpritLeadsAt).not.toBeNull();
    expect(r.culpritLeadsAt!).toBeLessThan(schedule.testChapter);
  });
});
