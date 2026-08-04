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

describe("reveal-binding disagreement (N4)", () => {
  /**
   * MEASURED three runs running: the beat label does not track what a chapter does. 1936 labelled
   * chapter 7 `final_trap` and disclosed in 9; the 08-04 treatment labelled chapter 8 `final_trap`,
   * titled it "The Discriminating Test", and put its only naming sentence in chapter 10 — a chapter
   * the contract does not bind at all.
   *
   * This reports; it does not re-bind. Titles are as model-authored as beats.
   */
  const outlineOf = (
    titles: Array<{ beat?: string; title: string; purpose?: string; summary?: string }>,
  ): GeometryOutline => ({
    acts: [{ scenes: titles }],
  });

  it("notes the 08-04 shape: final_trap on a chapter that reads as the test, disclosure later", () => {
    const narrative = outlineOf([
      { beat: "gathering", title: "Arrival" },
      { beat: "crime", title: "The Body" },
      { beat: "first_enquiries", title: "First Enquiries" },
      { beat: "motives", title: "Motives" },
      { beat: "alibis", title: "Alibis" },
      { beat: "false_solution", title: "The False Solution" },
      { beat: "secrets", title: "Secrets" },
      { beat: "final_trap", title: "The Discriminating Test" },
      { beat: "revelation", title: "Suspect Clearances" },
      { beat: "revelation", title: "The Culprit Revealed" },
    ]);
    const g = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative });
    expect(g.closure.notes.join(" ")).toMatch(/reveal bound to chapter 8/);
    expect(g.closure.notes.join(" ")).toMatch(/discriminating test/i);
    expect(g.closure.notes.join(" ")).toMatch(/chapter 10 .*reads as the disclosure/);
  });

  it("says nothing when the beat and the chapter agree", () => {
    const narrative = outlineOf([
      { beat: "gathering", title: "Arrival" },
      { beat: "crime", title: "The Body" },
      { beat: "first_enquiries", title: "First Enquiries" },
      { beat: "motives", title: "Motives" },
      { beat: "alibis", title: "Alibis" },
      { beat: "false_solution", title: "The False Solution" },
      { beat: "secrets", title: "Secrets" },
      { beat: "pattern", title: "The Pattern" },
      { beat: "final_trap", title: "The Final Trap" },
      { beat: "revelation", title: "Aftermath" },
    ]);
    const g = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative });
    expect(g.closure.notes.filter((n) => n.includes("reveal bound to chapter"))).toEqual([]);
  });

  it("does not re-bind the contract on the strength of a title", () => {
    const narrative = outlineOf([
      { beat: "gathering", title: "Arrival" },
      { beat: "crime", title: "The Body" },
      { beat: "first_enquiries", title: "Enquiries" },
      { beat: "motives", title: "Motives" },
      { beat: "alibis", title: "Alibis" },
      { beat: "false_solution", title: "False Solution" },
      { beat: "secrets", title: "Secrets" },
      { beat: "final_trap", title: "The Discriminating Test" },
      { beat: "revelation", title: "The Culprit Revealed" },
    ]);
    const g = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative });
    // The note fires, but the reveal contract stays where the beat put it.
    expect(g.closure.notes.join(" ")).toMatch(/may be bound to the wrong chapter/);
    expect(g.chapterContract.find((c) => c.role === "reveal")?.chapter).toBe(8);
  });

  /**
   * THE CONTROL, and the reason the check needs both halves. Run 08-02 1654 binds chapter 8
   * correctly: that chapter runs the test AND names the guilt, and chapter 9 is the aftermath
   * looking back on it. A first version of this check keyed on the bound chapter's test-shaped
   * purpose alone, and on a later chapter saying "as the murderer" — which the aftermath says by
   * design. It reported a defect on a well-formed outline.
   */
  it("says nothing when the later chapter is the aftermath looking back (08-02 1654)", () => {
    const narrative = outlineOf([
      { beat: "gathering", title: "Arrival" },
      { beat: "crime", title: "The Body" },
      { beat: "first_enquiries", title: "First Enquiries" },
      { beat: "motives", title: "Motives" },
      { beat: "alibis", title: "Alibis" },
      { beat: "false_solution", title: "The False Solution" },
      { beat: "secrets", title: "Secrets" },
      {
        beat: "final_trap",
        title: "The Final Trap",
        purpose: "Execute the discriminating test",
        summary:
          "Eleanor stages a final confrontation, comparing the clock's tampering evidence with Hale's alibi. " +
          "As she lays out the inconsistencies, Hale's demeanor shifts, revealing his guilt.",
      },
      {
        beat: "revelation",
        title: "The Revelation",
        purpose: "Reveal the final conclusions and aftermath",
        summary:
          "In the aftermath, Eleanor summarizes the evidence that led to Hale's exposure as the murderer. " +
          "She reflects on the manipulation of the clock.",
      },
    ]);
    const g = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative });
    expect(g.closure.notes.filter((n) => n.includes("reveal bound to chapter"))).toEqual([]);
  });

  it("needs both halves — a test-shaped chapter with no later disclosure is not a disagreement", () => {
    const narrative = outlineOf([
      { beat: "gathering", title: "Arrival" },
      { beat: "crime", title: "The Body" },
      { beat: "first_enquiries", title: "First Enquiries" },
      { beat: "motives", title: "Motives" },
      { beat: "alibis", title: "Alibis" },
      { beat: "false_solution", title: "The False Solution" },
      { beat: "secrets", title: "Secrets" },
      { beat: "final_trap", title: "The Discriminating Test" },
      { beat: "revelation", title: "Aftermath at the Hotel" },
    ]);
    const g = deriveStoryGeometry({ cml: baseCase(), clues: clue, narrative });
    expect(g.closure.notes.filter((n) => n.includes("reveal bound to chapter"))).toEqual([]);
  });
});
