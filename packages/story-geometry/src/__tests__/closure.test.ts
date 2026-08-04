import { describe, expect, it } from "vitest";

import { deriveStoryGeometry } from "../derive.js";
import { applyGeometryOutlineRepair } from "../repair.js";
import type { GeometryOutline } from "../types.js";

const baseCase = (overrides: Record<string, unknown> = {}) => ({
  CASE: {
    culpability: { culprits: ["Hugo Hale"] },
    death_method: "strangled",
    hidden_model: { mechanism: { actual_time_of_death: "10:15", apparent_time_of_death: "8:50" } },
    false_solution: { accused_suspect: "Eleanor Frey" },
    ...overrides,
  },
});

const outline = (titles: Array<{ beat?: string; title: string }>): GeometryOutline => ({
  acts: [{ scenes: titles }],
});

const TEN = outline([
  { beat: "gathering", title: "1" },
  { beat: "crime", title: "2" },
  { beat: "first_enquiries", title: "3" },
  { beat: "motives", title: "4" },
  { beat: "alibis", title: "5" },
  { beat: "false_solution", title: "6" },
  { beat: "secrets", title: "7" },
  { beat: "pattern", title: "8" },
  { beat: "final_trap", title: "9" },
  { beat: "revelation", title: "10" },
]);

const clue = [{ id: "c1", category: "physical", criticality: "essential", description: "torn grey fabric", keyTerms: ["fabric"] }];

describe("checkGeometryClosure", () => {
  it("flags a false solution that accuses the culprit — the story-1810 defect", () => {
    const geometry = deriveStoryGeometry({
      cml: baseCase({ false_solution: { accused_suspect: "Hugo Hale" } }),
      clues: clue,
      narrative: TEN,
    });
    expect(geometry.closure.closed).toBe(false);
    expect(geometry.closure.unmet.map((u) => u.code)).toContain("accused_is_culprit");
  });

  it("flags a reveal that is also the last chapter — the story-1936 shape", () => {
    const nine = outline([
      { beat: "gathering", title: "1" },
      { beat: "crime", title: "2" },
      { beat: "first_enquiries", title: "3" },
      { beat: "motives", title: "4" },
      { beat: "alibis", title: "5" },
      { beat: "false_solution", title: "6" },
      { beat: "secrets", title: "7" },
      { beat: "pattern", title: "8" },
      { beat: "final_trap", title: "9" },
    ]);
    const geometry = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative: nine });
    const unmet = geometry.closure.unmet.map((u) => u.code);
    expect(unmet).toContain("reveal_is_final_chapter");
    expect(geometry.closure.unmet.find((u) => u.code === "reveal_is_final_chapter")?.repairable).toBe(false);
  });

  it("carries the injected timeline-deception violations rather than re-deriving them", () => {
    const geometry = deriveStoryGeometry({
      cml: baseCase(),
      clues: clue,
      narrative: TEN,
      timelineViolations: [{ code: "apparent_not_covered", message: "the staged time incriminates the culprit" }],
    });
    expect(geometry.closure.unmet.map((u) => u.code)).toContain("apparent_not_covered");
  });

  it("waives the clincher only on an explicit non-physical resolution_kind", () => {
    const withoutClues = deriveStoryGeometry({ cml: baseCase(), clues: [], narrative: TEN });
    expect(withoutClues.closure.unmet.map((u) => u.code)).toContain("clincher_absent");

    const waived = deriveStoryGeometry({
      cml: baseCase({ resolution_kind: "testimony" }),
      clues: [],
      narrative: TEN,
    });
    expect(waived.closure.unmet.map((u) => u.code)).not.toContain("clincher_absent");
    expect(waived.closure.waived).toEqual([{ field: "clincher", reason: "resolution_kind=testimony" }]);
  });
});

describe("applyGeometryOutlineRepair", () => {
  it("stamps the declared chapter role and plants the clincher additively", () => {
    const narrative = JSON.parse(JSON.stringify(TEN)) as GeometryOutline;
    const cml = baseCase();
    const geometry = deriveStoryGeometry({ cml, clues: clue, narrative });
    const result = applyGeometryOutlineRepair(geometry, narrative, cml);

    const scenes = narrative.acts![0]!.scenes! as Array<Record<string, unknown>>;
    expect(scenes[0]!.geometryRole).toBe("opening");
    expect(scenes[8]!.geometryRole).toBe("reveal");
    expect(scenes[9]!.geometryRole).toBe("aftermath");
    expect(scenes[2]!.cluesPlanted).toEqual(["c1"]);
    expect(result.repairs.length).toBeGreaterThan(0);
  });

  it("never removes anything the outline already carried", () => {
    const narrative = JSON.parse(JSON.stringify(TEN)) as GeometryOutline;
    (narrative.acts![0]!.scenes![2] as Record<string, unknown>).cluesPlanted = ["c_existing"];
    const cml = baseCase();
    const geometry = deriveStoryGeometry({ cml, clues: clue, narrative });
    applyGeometryOutlineRepair(geometry, narrative, cml);
    expect((narrative.acts![0]!.scenes![2] as Record<string, unknown>).cluesPlanted).toEqual(["c_existing", "c1"]);
  });

  it("re-checks closure after repairing rather than assuming the repair worked", () => {
    const cml = baseCase({ false_solution: { accused_suspect: "Hugo Hale" } });
    const geometry = deriveStoryGeometry({ cml, clues: clue, narrative: TEN });
    const result = applyGeometryOutlineRepair(geometry, TEN, cml);
    // Nothing here can fix "the false solution accuses the murderer" — it must stay unmet and loud.
    expect(result.closure.closed).toBe(false);
    expect(result.closure.unmet.map((u) => u.code)).toContain("accused_is_culprit");
  });
});

describe("closure notes — the contract's weakest assumption, stated", () => {
  /**
   * MEASURED across three runs: the best available physical trace was every time a clue the set marks
   * `optional`. The selection is right on content; the problem is that no other stage is obliged to
   * place it, so plant and payoff rest on geometry alone — which is why 1936 failed both clincher
   * checks. It must not block closure (the contract is satisfiable), and it must not be silent.
   */
  const physicalOptional = [
    { id: "clue_late_optional_slot_1", category: "physical", criticality: "optional", description: "a torn piece of fabric near the clock", keyTerms: ["fabric"] },
  ];

  it("notes a clincher drawn from a non-essential clue without blocking closure", () => {
    const geometry = deriveStoryGeometry({ cml: baseCase(), clues: physicalOptional, narrative: TEN });
    expect(geometry.closure.closed).toBe(true);
    expect(geometry.closure.notes.join(" ")).toMatch(/clue_late_optional_slot_1/);
    expect(geometry.closure.notes.join(" ")).toMatch(/"optional"/);
    expect(geometry.clincher?.sourceCriticality).toBe("optional");
  });

  it("says nothing when the clincher rests on an essential clue", () => {
    const geometry = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative: TEN });
    expect(geometry.closure.notes).toEqual([]);
  });
});
