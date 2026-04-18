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

  it("counts unique surname-only references as suspect coverage", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Wyn Griffiths", culprit_eligibility: "eligible" },
          { name: "Angharad Price", culprit_eligibility: "eligible" },
          { name: "Iwan Hale", culprit_eligibility: "eligible" },
        ],
        culpability: { culprits: ["Iwan Hale"] },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "c1",
          description: "Griffiths was seen in the conservatory at ten minutes past eight.",
          pointsTo: "Witness testimony rules him out.",
          evidenceType: "elimination",
        },
        {
          id: "c2",
          description: "Price had an alibi confirmed by the station porter.",
          pointsTo: "Eliminates Price because she was documented elsewhere.",
          evidenceType: "elimination",
        },
      ],
      redHerrings: [],
    } as any;

    const analysis = __testables.analyzeSuspectCoverage(cml, clues);
    expect(analysis.uncovered).toEqual([]);
    expect(analysis.weakElimination).toEqual([]);
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

  it("treats non-canonical discriminating evidence labels as non-ID metadata", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Confront the suspect using clock tampering and timeline contradictions",
          evidence_clues: ["The clock shows ten minutes past eleven.", "Witness testimony supports the timeline."],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          description: "The clock face is fixed at ten minutes past eleven despite fresh winding marks.",
          pointsTo: "This supports timeline manipulation.",
          placement: "mid",
        },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkDiscriminatingTestReachability(cml, clues);
    expect(issues.some((i: any) => i.severity === "critical" && /missing clue id/i.test(i.message))).toBe(false);
  });

  it("synthesizes missing canonical discriminating evidence IDs from essential clues", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Use clock tampering and witness timing to isolate culprit",
          evidence_clues: ["clue_clock_smudge", "clue_witness_time"],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          description: "A smudge near the clock winding key suggests tampering.",
          pointsTo: "Clock timing was manipulated.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
        },
      ],
      clueTimeline: { early: [], mid: ["clue_1"], late: [] },
      redHerrings: [],
    } as any;

    const repairs = __testables.synthesizeMissingDiscriminatingEvidenceClues(
      cml,
      clues,
      ["clue_clock_smudge", "clue_witness_time"],
    );

    expect(repairs).toHaveLength(2);
    expect(clues.clues.some((c: any) => c.id === "clue_clock_smudge")).toBe(true);
    expect(clues.clues.some((c: any) => c.id === "clue_witness_time")).toBe(true);
  });

  it("sanitizes digit-based clue times into era-worded phrasing", () => {
    const clues = {
      clues: [
        {
          id: "clue_time",
          description: "The wall clock read 10:30 PM when inspected.",
          pointsTo: "The suspect claimed to be elsewhere at 9 PM.",
        },
      ],
      redHerrings: [],
    } as any;

    const repairs = __testables.sanitizeEraTimeStyleInClues(clues);
    expect(repairs.length).toBe(1);
    expect(/\d/.test(clues.clues[0].description)).toBe(false);
    expect(/\d/.test(clues.clues[0].pointsTo)).toBe(false);
  });

  it("selects canonical clue IDs as discriminating evidence candidates", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Use the clock timeline contradiction to expose the culprit",
          knowledge_revealed: "Only one suspect could access the clock before the storm",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_clock_tamper",
          description: "Fresh tool marks show the clock casing was opened.",
          pointsTo: "Timeline contradiction.",
          criticality: "essential",
          placement: "mid",
          evidenceType: "observation",
        },
        {
          id: "rh_1",
          description: "A gossip rumor about gambling debts.",
          pointsTo: "Misdirection only.",
          criticality: "optional",
          placement: "late",
        },
      ],
      redHerrings: [],
    } as any;

    const selected = __testables.selectDiscriminatingEvidenceCandidateIds(cml, clues, 2);
    expect(selected).toEqual(["clue_clock_tamper"]);
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

  it("does not count supportsAssumption-only text when checking overlap", () => {
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
        {
          id: "rh_only_supports",
          description: "A housemaid's gossip about unpaid debts",
          supportsAssumption: "Forged ledger timing made the boiler-room route impossible",
          misdirection: "This pushes attention toward money worries.",
        },
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
        {
          id: "rh_x",
          description: "Forged ledger timing confusion around the boilerroom route",
          supportsAssumption: "Routine clerical error about whether the route was impossible",
        },
      ],
    } as any;

    const details = __testables.findRedHerringOverlapDetails(cml, clues);
    expect(details).toHaveLength(1);
    expect(details[0].redHerringId).toBe("rh_x");
    expect(details[0].matchedStepIndexes).toEqual([1]);
    expect(details[0].matchedCorrectionWords.some((w: string) => w.includes("forged"))).toBe(true);
  });

  it("does not flag overlap from generic mechanism words alone", () => {
    const cml = {
      CASE: {
        inference_path: {
          steps: [
            { correction: "The murder occurred after document release and timestamp updates" },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        {
          id: "rh_generic",
          description: "A rumor that the murder occurred after document release",
          supportsAssumption: "Public paperwork was late",
          misdirection: "Witnesses focused on timestamp confusion in filing records.",
        },
      ],
    } as any;

    const overlapIds = __testables.findRedHerringTrueSolutionOverlap(cml, clues);
    expect(overlapIds).toEqual([]);
  });

  it("flags cast source path/name mismatch when a single different suspect is named", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Aled Price" },
          { name: "Megan Rowe" },
        ],
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          sourceInCML: "CASE.cast[0].alibi_window",
          description: "Megan Rowe was seen at the station before supper.",
          pointsTo: "Eliminates Megan Rowe because her ticket was stamped by the porter.",
          evidenceType: "elimination",
        },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkCastNamePathConsistency(cml, clues);
    expect(issues.some((i: any) => /does not mention expected suspect "Aled Price"/i.test(i.message))).toBe(true);
  });

  it("passes cast source path consistency when clue text matches cast index name", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Aled Price" },
          { name: "Megan Rowe" },
        ],
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_2",
          sourceInCML: "CASE.cast[1].alibi_window",
          description: "Megan Rowe remained in the conservatory from quarter past eight until nine o'clock.",
          pointsTo: "Eliminates Megan Rowe because the butler and ledger both corroborate her alibi.",
          evidenceType: "elimination",
        },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkCastNamePathConsistency(cml, clues);
    expect(issues).toEqual([]);
  });

  it("auto-repairs invalid cast evidence_sensitivity path to a legal cast path", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Aled Price", access_plausibility: "possible", alibi_window: "from eight until nine" },
        ],
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_bad_path",
          sourceInCML: "CASE.cast[0].evidence_sensitivity[0]",
          description: "Aled Price had routine access to the library wing.",
          pointsTo: "Opportunity was possible.",
          evidenceType: "observation",
        },
      ],
      redHerrings: [],
    } as any;

    const repairs = __testables.repairInvalidSourcePaths(cml, clues);
    expect(repairs.length).toBe(1);
    expect(clues.clues[0].sourceInCML).toBe("CASE.cast[0].access_plausibility");
  });

  it("deterministically sanitizes severe red-herring overlap terms", () => {
    const cml = {
      CASE: {
        false_assumption: {
          statement: "The victim died at quarter to eleven in the study",
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        {
          id: "rh_1",
          description: "The clock was stopped in the study to fake timing.",
          supportsAssumption: "The time of death was obvious.",
          misdirection: "Witnesses trusted the stopped clock.",
        },
      ],
    } as any;

    const repairs = __testables.sanitizeRedHerringOverlap(
      cml,
      clues,
      [{ redHerringId: "rh_1", matchedCorrectionWords: ["clock", "stopped", "study"], matchedStepIndexes: [1], overlapScore: 6 }],
      ["timing", "witness"],
    );

    expect(repairs).toEqual(["rh_1: sanitized overlap terms in description/misdirection"]);
    const text = `${clues.redHerrings[0].description} ${clues.redHerrings[0].misdirection}`.toLowerCase();
    expect(text.includes("clock")).toBe(false);
    expect(text.includes("stopped")).toBe(false);
    expect(text.includes("study")).toBe(false);
    expect(clues.redHerrings[0].supportsAssumption).toBe("The time of death was obvious.");
  });
});
