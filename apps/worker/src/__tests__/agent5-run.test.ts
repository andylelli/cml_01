import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/agents/agent5-run.js";

describe("agent5-run testables", () => {
  it("flags suspects that are named but lack elimination/alibi evidence", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Aled Price", culprit_eligibility: "eligible" },
          { name: "Megan Rowe", culprit_eligibility: "eligible" },
          { name: "Iwan Hale", culprit_eligibility: "eligible" },
        ],
        culpability: { culprits: ["Iwan Hale"] },
      },
    } as any;

    const clues = {
      clues: [
        { id: "c1", description: "Aled Price was seen in the reading room at nine", pointsTo: "routine movement" },
        { id: "c2", description: "Megan Rowe has an alibi and was with the porter", pointsTo: "elimination support" },
      ],
      redHerrings: [],
    } as any;

    const analysis = __testables.analyzeSuspectCoverage(cml, clues);
    expect(analysis.uncovered).toEqual([]);
    expect(analysis.weakElimination).toEqual(["Aled Price"]);
  });

  it("fails discriminating test reachability when evidence_clues reference missing clue ids", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Confront the culprit with tampered ledger timings",
          evidence_clues: ["clue_ledger", "clue_glove"],
        },
      },
    } as any;

    const clues = {
      clues: [{ id: "clue_ledger", description: "Ledger entries were altered", placement: "mid" }],
      redHerrings: [],
    } as any;

    const issues = __testables.checkDiscriminatingTestReachability(cml, clues);
    expect(issues.some((i: any) => i.severity === "critical" && /missing clue id\(s\): clue_glove/i.test(i.message))).toBe(true);
  });

  it("warns when all mapped discriminating evidence clues are late", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Expose the forged timetable",
          evidence_clues: ["clue_1", "clue_2"],
        },
      },
    } as any;

    const clues = {
      clues: [
        { id: "clue_1", description: "Timetable ink mismatch", placement: "late" },
        { id: "clue_2", description: "Clock spring replaced", placement: "late" },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkDiscriminatingTestReachability(cml, clues);
    expect(issues.some((i: any) => i.severity === "warning" && /late placement/i.test(i.message))).toBe(true);
    expect(issues.some((i: any) => i.severity === "critical")).toBe(false);
  });

  it("detects red-herring overlap with true-solution correction language", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            { correction: "The forged ledger timing proves the boiler-room route was impossible" },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        { id: "rh_a", description: "A petty debt motive", supportsAssumption: "Financial stress" },
        { id: "rh_b", description: "Rumors about forged ledger pages", supportsAssumption: "Clerical confusion" },
      ],
    } as any;

    const overlapIds = __testables.findRedHerringTrueSolutionOverlap(cml, clues);
    expect(overlapIds).toEqual(["rh_b"]);
  });

  it("returns empty overlap list when red herrings are isolated from correction terms", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            { correction: "The railway-ticket ash places the culprit at the furnace room" },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        { id: "rh_1", description: "A staged quarrel in the parlor", supportsAssumption: "Social grievance" },
      ],
    } as any;

    const overlapIds = __testables.findRedHerringTrueSolutionOverlap(cml, clues);
    expect(overlapIds).toEqual([]);
  });

  it("reports overlap details with red herring id, matched steps, and words", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            { correction: "The forged ledger timing proves the boiler-room route was impossible" },
            { correction: "Witness testimony contradicts the staged alibi" },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        { id: "rh_x", description: "Forged memo rumors", supportsAssumption: "Routine clerical error" },
      ],
    } as any;

    const details = __testables.findRedHerringOverlapDetails(cml, clues);
    expect(details).toHaveLength(1);
    expect(details[0].redHerringId).toBe("rh_x");
    expect(details[0].matchedStepIndexes).toEqual([1]);
    expect(details[0].matchedCorrectionWords.some((w: string) => w.includes("forged"))).toBe(true);
  });
});
