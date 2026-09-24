import { describe, expect, it } from "vitest";
import { dropSelfAndUnknownSeeds } from "../agent8-novelty.ts";

// A_105 — seed 18179, mystery-1790250322380. The model's similarityScores carried three real seeds
// and a fourth row titled as the generated mystery itself, at 1.00. The model's own status was
// "pass"; the code took the maximum over the whole list and the binding gate blocked the run.
const rows = [
  { seedTitle: "The Clue of the Twisted Candle", overallSimilarity: 0.58 },
  { seedTitle: "The Mysterious Affair at Styles", overallSimilarity: 0.4 },
  { seedTitle: "The Big Bow Mystery", overallSimilarity: 0.38 },
  { seedTitle: "The Pendulum's False Toll at Blackwater Sanctuary", overallSimilarity: 1 },
];
const seeds = ["The Clue of the Twisted Candle", "The Mysterious Affair at Styles", "The Big Bow Mystery"];

describe("dropSelfAndUnknownSeeds — the audit must not score the candidate against itself", () => {
  it("drops the row titled as the generated mystery", () => {
    const r = dropSelfAndUnknownSeeds(rows, seeds, "The Pendulum's False Toll at Blackwater Sanctuary");
    expect(r.dropped).toEqual(["The Pendulum's False Toll at Blackwater Sanctuary"]);
    expect(Math.max(...r.kept.map((x) => x.overallSimilarity))).toBe(0.58);
  });

  it("drops a row naming no supplied seed when seed titles are known, even without a self match", () => {
    const r = dropSelfAndUnknownSeeds(rows, seeds, "");
    expect(r.dropped).toEqual(["The Pendulum's False Toll at Blackwater Sanctuary"]);
    expect(r.kept).toHaveLength(3);
  });

  it("keeps every row when seed titles are unknown and nothing is self-titled", () => {
    const r = dropSelfAndUnknownSeeds(rows, [], "");
    expect(r.kept).toHaveLength(4);
    expect(r.dropped).toEqual([]);
  });

  it("matches titles loosely: case, punctuation and spacing do not protect a self row", () => {
    const r = dropSelfAndUnknownSeeds(rows, [], "the pendulums false toll at blackwater sanctuary");
    expect(r.dropped).toHaveLength(1);
  });
});
