import { describe, expect, it } from "vitest";
import { normalizeParsedClueDistribution } from "../agent5-clues.ts";

// A5-04 — the parse-boundary normaliser extractClues applies, pinned as moved out of extractClues.
describe("normalizeParsedClueDistribution (A5-04)", () => {
  const payload = () => ({
    clues: [
      { id: "clue_1", description: "A", placement: " Early ", criticality: "Essential", category: "Physical", sourceInCML: "CASE.inference_path.steps[1].observation", pointsTo: "p" },
      { id: "clue_2", description: "B", placement: "mid", criticality: "essential", category: "temporal", sourceInCML: "CASE.cast[0].alibi_window", pointsTo: "q" },
      { id: "clue_3", description: "C", placement: "late", criticality: "supporting", category: "behavioral", sourceInCML: "CASE.constraint_space.time.contradictions[0]", pointsTo: "r", supportsInferenceStep: 3, first_full_reveal_chapter: "x" },
      { id: "clue_", description: "phantom" },
      { id: "clue_4", description: "  " },
    ],
    redHerrings: [{ id: "rh_1", description: "d", supportsAssumption: "s", misdirection: "m" }],
  });

  it("drops malformed clues and reports each drop", () => {
    const r = normalizeParsedClueDistribution(payload(), 1);
    expect(r.clues.map((c) => c.id)).toEqual(["clue_1", "clue_2", "clue_3"]);
    expect(r.droppedWarnings).toHaveLength(2);
  });

  it("lower-cases the enums, infers step and evidence type, and flags an unmapped essential clue with 0", () => {
    const [c1, c2, c3] = normalizeParsedClueDistribution(payload(), 1).clues;
    expect([c1.placement, c1.criticality, c1.category]).toEqual(["early", "essential", "physical"]);
    expect(c1.supportsInferenceStep).toBe(2);
    expect(c1.evidenceType).toBe("observation");
    expect(c2.supportsInferenceStep).toBe(0);
    expect(c3.supportsInferenceStep).toBe(3);
    expect(c3.evidenceType).toBe("contradiction");
    expect(c3.first_full_reveal_chapter).toBeUndefined();
  });

  it("builds the timeline and the fair-play checks from the kept clues", () => {
    const r = normalizeParsedClueDistribution(payload(), 2);
    expect(r.clueTimeline).toEqual({ early: ["clue_1"], mid: ["clue_2"], late: ["clue_3"] });
    expect(r.essentialClueCount).toBe(2);
    expect(r.fairPlayChecks).toEqual({
      allEssentialCluesPresent: false,
      noNewFactsIntroduced: true,
      redHerringsDontBreakLogic: true,
      redHerringBudgetMet: false,
    });
  });

  it("mutates the parsed clue objects in place (same references as the payload)", () => {
    const p = payload();
    const r = normalizeParsedClueDistribution(p, 1);
    expect(r.clues[0]).toBe(p.clues[0]);
    expect(r.redHerrings).toBe(p.redHerrings);
  });

  it("tolerates a payload with no clue arrays", () => {
    const r = normalizeParsedClueDistribution({}, 0);
    expect(r.clues).toEqual([]);
    expect(r.redHerrings).toEqual([]);
    expect(r.fairPlayChecks.noNewFactsIntroduced).toBe(true);
  });
});
