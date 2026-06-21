import { describe, expect, it } from "vitest";
import { buildSceneGrid } from "../schedule.js";
import { checkComplete, checkCoverage, checkOrdered } from "../invariants.js";
import { collectObligations } from "../collect.js";
import { SchedulerInfeasibleError, type SchedulerInput } from "../types.js";

/**
 * The §4.5 worked example: 10-chapter Golden Age story. Culprit Vane; suspects {Marlowe, Hale, Pryce};
 * essential clues {c1, c4, c7}; supporting {c2, c5}; herring {rh1}; discriminating test early_act3
 * using {c1, c4}; clearances Marlowe(uses c4), Hale(uses c2), Pryce(uses c7).
 */
function workedExample(): SchedulerInput {
  return {
    cml: {
      cast: [
        { name: "Inspector Bell", role: "detective", role_archetype: "police inspector" },
        { name: "Lord Ashe", role: "victim", role_archetype: "the victim" },
        { name: "Captain Marlowe", culprit_eligibility: "eligible" },
        { name: "Mrs. Hale", culprit_eligibility: "eligible" },
        { name: "Dr. Pryce", culprit_eligibility: "eligible" },
        { name: "Vane", culprit_eligibility: "eligible" },
      ],
      culpability: { culprits: ["Vane"] },
      false_solution: { accused_suspect: "Captain Marlowe" },
      discriminating_test: { method: "constraint_proof", timing: "early_act3", evidence_clues: ["c1", "c4"] },
      prose_requirements: {
        suspect_clearance_scenes: [
          { suspect_name: "Captain Marlowe", supporting_clues: ["c4"] },
          { suspect_name: "Mrs. Hale", supporting_clues: ["c2"] },
          { suspect_name: "Dr. Pryce", supporting_clues: ["c7"] },
        ],
      },
    },
    clues: [
      { id: "c1", criticality: "essential", placement: "early" },
      { id: "c2", criticality: "supporting", placement: "early" },
      { id: "c4", criticality: "essential", placement: "mid" },
      { id: "c5", criticality: "supporting", placement: "mid" },
      { id: "c7", criticality: "essential", placement: "mid" },
    ],
    redHerrings: [{ id: "rh1" }],
  };
}

describe("buildSceneGrid — the §4.5 worked example", () => {
  const grid = buildSceneGrid(workedExample(), 10);

  it("produces exactly 10 slots, split 3 / 5 / 2 by act ratio", () => {
    expect(grid.slots).toHaveLength(10);
    expect(grid.actCounts).toEqual({ act1: 3, act2: 5, act3: 2 });
    expect(grid.slots.filter((s) => s.act === 1)).toHaveLength(3);
    expect(grid.slots.filter((s) => s.act === 2)).toHaveLength(5);
    expect(grid.slots.filter((s) => s.act === 3)).toHaveLength(2);
  });

  it("is COMPLETE — every collected obligation is placed exactly once", () => {
    const { obligations } = collectObligations(workedExample().cml, workedExample().clues, workedExample().redHerrings);
    const r = checkComplete(grid, obligations);
    expect(r.ok, `missing=${r.missing} dup=${r.duplicated}`).toBe(true);
  });

  it("is ORDERED — every precedence law holds by construction", () => {
    const r = checkOrdered(grid);
    expect(r.ok, r.violations.join(" | ")).toBe(true);
  });

  it("meets COVERAGE — ≥60% clue-bearing, no >2 clueless run", () => {
    const r = checkCoverage(grid);
    expect(r.ok, r.violations.join(" | ")).toBe(true);
    expect(r.ratio).toBeGreaterThanOrEqual(0.6);
    expect(r.longestCluelessRun).toBeLessThanOrEqual(2);
  });

  it("assigns the Golden-Age 10-beat arc in canonical order", () => {
    expect(grid.slots.map((s) => s.beat)).toEqual([
      "gathering", "crime", "first_enquiries", "motives", "alibis",
      "false_solution", "secrets", "pattern", "final_trap", "revelation",
    ]);
  });

  it("places the spine: victim/crime in Act I, every essential clue before the test, reveal last", () => {
    const idxOf = (pred: (s: (typeof grid.slots)[number]) => boolean) => grid.slots.findIndex(pred);
    const testIdx = idxOf((s) => s.obligations.some((o) => o.kind === "discriminating_test"));
    const revealIdx = idxOf((s) => s.obligations.some((o) => o.kind === "reveal_solution"));
    expect(revealIdx).toBe(9); // last
    expect(testIdx).toBeLessThan(revealIdx);
    for (const id of ["c1", "c4", "c7"]) {
      const r = grid.slots.findIndex((s) => s.cluesRevealed.includes(id));
      expect(r, `essential ${id} before test`).toBeLessThan(testIdx);
    }
    // no clue revealed in the final slot
    expect(grid.slots[9].cluesRevealed).toEqual([]);
  });

  it("cluesRevealed is scheduler-owned and covers every distributed clue exactly once", () => {
    const all = grid.slots.flatMap((s) => s.cluesRevealed).sort();
    expect(all).toEqual(["c1", "c2", "c4", "c5", "c7"]);
  });
});

describe("buildSceneGrid — robustness across sizes & shapes", () => {
  it("produces a complete, ordered, ≥60%-covered grid at several scene counts", () => {
    for (const n of [8, 10, 12, 14, 16]) {
      const grid = buildSceneGrid(workedExample(), n);
      const { obligations } = collectObligations(workedExample().cml, workedExample().clues, workedExample().redHerrings);
      expect(grid.slots).toHaveLength(n);
      expect(checkComplete(grid, obligations).ok, `n=${n} complete`).toBe(true);
      expect(checkOrdered(grid).ok, `n=${n} ordered: ${checkOrdered(grid).violations[0]}`).toBe(true);
      // HARD guarantee: ≥60% clue-bearing. (The "no >2 clueless run" pacing target is soft/best-effort.)
      expect(checkCoverage(grid).ratioOk, `n=${n} coverage: ${checkCoverage(grid).violations[0]}`).toBe(true);
    }
  });

  it("handles a case with no false_solution and a late-act2 test", () => {
    const input = workedExample();
    (input.cml as Record<string, unknown>).false_solution = null;
    (input.cml as Record<string, any>).discriminating_test.timing = "late_act2";
    const grid = buildSceneGrid(input, 10);
    expect(checkOrdered(grid).ok).toBe(true);
    expect(grid.slots.some((s) => s.obligations.some((o) => o.kind === "false_solution"))).toBe(false);
  });
});

describe("buildSceneGrid — infeasibility surfaces loudly (§4.1)", () => {
  it("throws SchedulerInfeasibleError for a scene count below 4", () => {
    expect(() => buildSceneGrid(workedExample(), 3)).toThrow(SchedulerInfeasibleError);
  });

  it("throws when a near-clueless story cannot reach 60% coverage", () => {
    const sparse: SchedulerInput = {
      cml: { cast: [{ name: "A", culprit_eligibility: "eligible" }], culpability: { culprits: ["A"] } },
      clues: [{ id: "c1", criticality: "essential", placement: "early" }],
    };
    // 20 slots, one clue, no clearances/herrings → cannot be 60% clue-bearing.
    expect(() => buildSceneGrid(sparse, 20)).toThrow(SchedulerInfeasibleError);
  });
});
