import { describe, expect, it } from "vitest";
import { __testables } from "../jobs/agents/agent5-run.js";

describe("agent5-run testables", () => {
  it("builds strict first-attempt prompt payload from CML inputs", () => {
    const cml = {
      CASE: {
        cast: [
          {
            name: "Iwan Hale",
            culprit_eligibility: "eligible",
            access_plausibility: "Had after-hours key access",
            alibi_window: "Quarter past nine to ten o'clock",
          },
          { name: "Agnes Pike", culprit_eligibility: "eligible" },
        ],
        culpability: { culprits: ["Iwan Hale"] },
        inference_path: {
          steps: [
            {
              observation: "Grease marks ring the clock key slot.",
              correction: "The clock was staged to fake the timeline.",
              required_evidence: ["Porter confirms key cabinet was opened."],
            },
          ],
        },
        discriminating_test: {
          design: "Confront with key-grease sequence.",
          evidence_clues: ["clue_clock_trace"],
        },
        quality_controls: {
          clue_visibility_requirements: {
            late_clues_min: 1,
          },
        },
        constraint_space: {
          time: { anchors: ["seven o'clock bell"], contradictions: [] },
          access: { actors: ["butler"], objects: ["clock key"], permissions: [] },
          physical: { laws: [], traces: ["grease streak"] },
        },
      },
    } as any;

    const payload = __testables.buildStrictPromptFeedback(cml);
    expect(payload).toBeTruthy();
    expect(payload?.strictSourcePaths.length).toBeGreaterThan(0);
    expect(payload?.requiredIdToSourceMappings.some((entry: any) => entry.id === "clue_clock_trace")).toBe(true);
    expect(payload?.requiredStepCoverageFloors).toEqual([
      { step: 1, requireContradiction: true, requireMapped: true },
    ]);
    expect(payload?.requiredLateClueSlot?.id).toBe("clue_late_optional_slot_1");
    expect(payload?.requiredDirectCulpritClue?.id).toBe("clue_culprit_direct_iwan_hale");
  });

  it("enforces one strict id-to-source mapping per clue id", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Iwan Hale", culprit_eligibility: "eligible" },
        ],
        culpability: { culprits: ["Iwan Hale"] },
        inference_path: {
          steps: [
            {
              observation: "clue_clock_trace appears in witness notes.",
              correction: "The timeline was staged.",
              required_evidence: [],
            },
          ],
        },
        discriminating_test: {
          design: "Confront with clock trace evidence.",
          evidence_clues: ["clue_clock_trace"],
        },
      },
    } as any;

    const payload = __testables.buildStrictPromptFeedback(cml);
    const mappings = (payload?.requiredIdToSourceMappings ?? []).filter((entry: any) => entry.id === "clue_clock_trace");

    expect(mappings).toHaveLength(1);
    expect(mappings[0]?.sourceInCML).toBe("CASE.discriminating_test.evidence_clues[0]");
  });

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

  it("fails critically when mapped discriminating evidence clues are late", () => {
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
    expect(issues.some((i: any) => i.severity === "critical" && /early\/mid|late placement/i.test(i.message))).toBe(true);
  });

  it("fails when no early or mid clue makes the mechanism visible before the test", () => {
    const cml = {
      CASE: {
        hidden_model: {
          mechanism: {
            description: "A forged railway timetable and reset library clock create the false arrival window.",
          },
        },
        discriminating_test: {
          knowledge_revealed: "Only the forged timetable and reset library clock explain the false arrival window.",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          description: "A forged railway timetable is found in the study blotter.",
          pointsTo: "This supports the false arrival window.",
          placement: "late",
        },
        {
          id: "clue_2",
          description: "Fresh grease marks show the library clock was reset after supper.",
          pointsTo: "This reveals the false arrival window depends on the altered clock.",
          placement: "late",
        },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkMechanismVisibility(cml, clues);
    expect(issues.some((i: any) => i.severity === "critical" && /late-only|mechanism/i.test(i.message))).toBe(true);
  });

  it("passes when an early or mid clue makes the mechanism visible before the test", () => {
    const cml = {
      CASE: {
        hidden_model: {
          mechanism: {
            description: "A forged railway timetable and reset library clock create the false arrival window.",
          },
        },
        discriminating_test: {
          knowledge_revealed: "Only the forged timetable and reset library clock explain the false arrival window.",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_1",
          description: "A forged railway timetable is tucked inside the porter ledger.",
          pointsTo: "This supports the false arrival window before the trap is staged.",
          placement: "mid",
        },
        {
          id: "clue_2",
          description: "Fresh grease marks show the library clock was reset after supper.",
          pointsTo: "This reveals the false arrival window depends on the altered clock.",
          placement: "mid",
        },
      ],
      redHerrings: [],
    } as any;

    const issues = __testables.checkMechanismVisibility(cml, clues);
    expect(issues).toEqual([]);
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

  it("prefers early/mid discriminating evidence candidates over late clues", () => {
    const cml = {
      CASE: {
        discriminating_test: {
          design: "Use clock contradiction and witness timeline to expose the culprit",
          knowledge_revealed: "Only one suspect knew the altered clock sequence",
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_late_highscore",
          description: "Clock contradiction witness timeline altered sequence culprit",
          pointsTo: "Clock contradiction witness timeline altered sequence culprit",
          criticality: "essential",
          placement: "late",
          evidenceType: "observation",
        },
        {
          id: "clue_mid_ok",
          description: "Witness timeline contradicts the clock account.",
          pointsTo: "Timeline contradiction.",
          criticality: "essential",
          placement: "mid",
          evidenceType: "observation",
        },
        {
          id: "clue_early_ok",
          description: "Clock casing shows early tampering marks.",
          pointsTo: "Clock contradiction.",
          criticality: "essential",
          placement: "early",
          evidenceType: "contradiction",
        },
      ],
      redHerrings: [],
    } as any;

    const selected = __testables.selectDiscriminatingEvidenceCandidateIds(cml, clues, 2);
    expect(selected).toEqual(["clue_mid_ok", "clue_early_ok"]);
    expect(selected).not.toContain("clue_late_highscore");
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

  it("auto-repairs cast-path name mismatch by binding clue text to cast index name", () => {
    const cml = {
      CASE: {
        cast: [
          { name: "Aled Price", alibi_window: "after supper" },
          { name: "Megan Rowe", alibi_window: "in conservatory" },
        ],
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_cast_mismatch",
          sourceInCML: "CASE.cast[1].alibi_window",
          description: "Aled Price was recorded in the conservatory before tea.",
          pointsTo: "Eliminates Aled Price because the signed service log corroborates this alibi.",
          evidenceType: "elimination",
          placement: "mid",
          criticality: "essential",
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_cast_mismatch"], late: [] },
    } as any;

    const repairs = __testables.repairCastNamePathConsistency(cml, clues);
    expect(repairs.length).toBe(1);
    expect(String(clues.clues[0].description)).toContain("Megan Rowe");
    expect(String(clues.clues[0].pointsTo)).toContain("Megan Rowe");
    expect(__testables.checkCastNamePathConsistency(cml, clues)).toEqual([]);
  });

  it("injects expected suspect name into elimination pointsTo when missing for cast path", () => {
    const cml = {
      CASE: {
        cast: [{ name: "Aled Price", alibi_window: "after supper" }],
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_cast_missing_name",
          sourceInCML: "CASE.cast[0].alibi_window",
          description: "Service log records a continuous pantry duty window.",
          pointsTo: "Corroborated alibi excludes this suspect from the study.",
          evidenceType: "elimination",
          placement: "mid",
          criticality: "essential",
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_cast_missing_name"], late: [] },
    } as any;

    const repairs = __testables.repairCastNamePathConsistency(cml, clues);
    expect(repairs.length).toBe(1);
    expect(String(clues.clues[0].pointsTo)).toContain("Eliminates Aled Price because");
    expect(__testables.checkCastNamePathConsistency(cml, clues)).toEqual([]);
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

  it("sanitizer never introduces a replacement that is itself a correction-text token", () => {
    // Simulate the exact failure mode: "clock" is the overlap term, and the
    // naive replacement pool contains "witness" which also appears in corrections.
    const cml = {
      CASE: {
        false_assumption: {
          statement: "The murder occurred at the time indicated by the clock.",
          why_it_seems_reasonable: "Witnesses saw the clock showing the time of death.",
        },
        inference_path: {
          steps: [
            { correction: "The clock time indicates a discrepancy with witness accounts." },
            { correction: "The scratch on the key shows it was manipulated." },
            { correction: "Hugo proximity to the clock at the time of the murder narrows the suspect." },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [],
      redHerrings: [
        {
          id: "rh_2",
          description: "The clock in the hallway appeared tampered.",
          misdirection: "Everyone assumed the clock was reliable.",
        },
      ],
    } as any;

    __testables.sanitizeRedHerringOverlap(
      cml,
      clues,
      [{ redHerringId: "rh_2", matchedCorrectionWords: ["clock"], matchedStepIndexes: [1, 2, 3], overlapScore: 5 }],
      ["witness", "timing"], // preferred terms that are themselves correction words
    );

    // After sanitization the replacement must NOT itself be a correction token
    const resultText = `${clues.redHerrings[0].description} ${clues.redHerrings[0].misdirection}`.toLowerCase();
    // "clock" should be gone
    expect(resultText.includes("clock")).toBe(false);
    // The replacement must not be "witness" or "time"/"timing" (both in corrections)
    const correctionTokens = ["witness", "clock", "time", "scratch", "key", "hugo", "proximity", "murder"];
    for (const token of correctionTokens) {
      // The replacement itself should not re-introduce a correction token as a standalone word
      // (we check words that were injected as replacements — if the whole text contained none
      // of them before, they came from the sanitizer)
      // Simpler check: the original had "clock" twice; after replace neither occurrence
      // should have been swapped to a correction token word
      const words = resultText.split(/\s+/).map(w => w.replace(/[^a-z]/g, ""));
      const originalWords = new Set(["the", "in", "hallway", "appeared", "tampered", "everyone", "assumed", "was", "reliable"]);
      const injectedWords = words.filter(w => w.length > 2 && !originalWords.has(w) && w !== "clock");
      for (const injected of injectedWords) {
        expect(correctionTokens).not.toContain(injected);
      }
    }
  });

  it("prunes persistently overlapping red herrings after retry fallback", () => {
    const clues = {
      clues: [],
      redHerrings: [
        { id: "rh_1", description: "overlap one", misdirection: "mislead one" },
        { id: "rh_2", description: "safe two", misdirection: "mislead two" },
      ],
    } as any;

    const removed = __testables.pruneOverlappingRedHerrings(clues, ["rh_1", "rh_missing"]);

    expect(removed).toEqual(["rh_1"]);
    expect(clues.redHerrings.map((rh: any) => rh.id)).toEqual(["rh_2"]);
  });

  it("synthesizes missing direct culprit-evidence clues deterministically", () => {
    const cml = {
      CASE: {
        culpability: { culprits: ["Eleanor Voss"] },
        inference_path: {
          steps: [
            {
              effect: "Evidence narrows opportunity toward Eleanor Voss.",
            },
          ],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed",
          sourceInCML: "CASE.inference_path.steps[0].effect",
          description: "A muddy footprint crossed the corridor.",
          pointsTo: "Suggests late-night movement in the east wing.",
          placement: "mid",
          criticality: "supporting",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_seed"], late: [] },
    } as any;

    const repairs = __testables.synthesizeMissingCulpritDiscriminatingClues(cml, clues, ["Eleanor Voss"]);
    expect(repairs.length).toBe(1);

    const generated = clues.clues.find((clue: any) => clue.id.startsWith("clue_culprit_direct_"));
    expect(generated).toBeTruthy();
    expect(String(generated.description)).toContain("Eleanor Voss");
    expect(String(generated.pointsTo).toLowerCase()).toContain("direct evidence");
    expect(generated.criticality).toBe("essential");
    expect(clues.clueTimeline.mid).toContain(generated.id);
  });

  it("fails deterministic contracts on invalid source paths", () => {
    const cml = {
      CASE: {
        cast: [],
        culpability: { culprits: [] },
        discriminating_test: { evidence_clues: ["clue_clock"] },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_clock",
          sourceInCML: "CASE.cast[99].alibi_window",
          description: "Aled Price was at the station at quarter to nine.",
          pointsTo: "Directly implicates Aled Price.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_clock"], late: [] },
    } as any;

    expect(() => __testables.enforceAgent5DeterministicContracts(cml, clues)).toThrow(
      /source-path gate failed/i,
    );
  });

  it("auto-repairs out-of-range constraint-space actor source paths", () => {
    const cml = {
      CASE: {
        cast: [],
        culpability: { culprits: [] },
        discriminating_test: {
          design: "Compare access opportunities against actor list",
          evidence_clues: ["clue_access_actor"],
        },
        constraint_space: {
          access: {
            actors: ["butler", "porter"],
          },
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_access_actor",
          sourceInCML: "CASE.constraint_space.access.actors[4]",
          description: "A household actor had privileged corridor access.",
          pointsTo: "Access opportunity was limited to listed actors.",
          placement: "mid",
          criticality: "supporting",
          evidenceType: "observation",
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_access_actor"], late: [] },
    } as any;

    const result = __testables.enforceAgent5DeterministicContracts(cml, clues);

    expect(result.warnings.some((w: string) => /source-path auto-repair/i.test(w))).toBe(true);
    expect(clues.clues[0].sourceInCML).toBe("CASE.constraint_space.access.actors[1]");
  });

  it("synthesizes missing discriminating evidence IDs during deterministic contract enforcement", () => {
    const cml = {
      CASE: {
        cast: [{ name: "Iwan Hale", culprit_eligibility: "eligible", alibi_window: "after supper" }],
        culpability: { culprits: ["Iwan Hale"] },
        discriminating_test: {
          design: "Use clock-smudge and alibi mismatch to isolate culprit",
          knowledge_revealed: "Only the culprit could have reached the clock before supper",
          evidence_clues: ["clue_clock_smudge"],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_seed",
          sourceInCML: "CASE.cast[0].alibi_window",
          description: "Fresh grease near the clock key shows someone reached the clock before supper.",
          pointsTo: "Supports the claim that Iwan Hale reached the clock before supper.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_seed"], late: [] },
    } as any;

    const result = __testables.enforceAgent5DeterministicContracts(cml, clues);

    expect(result.warnings.some((w: string) => /evidence-id deterministic synthesis/i.test(w))).toBe(true);
    expect(clues.clues.some((clue: any) => clue.id === "clue_clock_smudge")).toBe(true);
  });

  it("repairs strict mapping, direct culprit slot, and late optional slot deterministically", () => {
    const cml = {
      CASE: {
        cast: [
          {
            name: "Iwan Hale",
            culprit_eligibility: "eligible",
            access_plausibility: "Had after-hours key access",
            alibi_window: "Quarter past nine to ten o'clock",
          },
        ],
        culpability: { culprits: ["Iwan Hale"] },
        inference_path: {
          steps: [
            {
              observation: "Grease marks ring the clock key slot.",
              correction: "The clock was staged to fake the timeline.",
              effect: "Narrows access to Iwan Hale.",
              required_evidence: [
                "Porter confirms key cabinet was opened.",
                "Clock grease sits fresh on the key slot.",
              ],
            },
          ],
        },
        hidden_model: {
          mechanism: {
            description: "The clock in the study was tampered with to create a false timeline.",
          },
        },
        discriminating_test: {
          design: "Confront with clock trace evidence.",
          knowledge_revealed: "Clock trace evidence exposes the staged timeline.",
          evidence_clues: ["clue_clock_trace"],
        },
        quality_controls: {
          clue_visibility_requirements: {
            late_clues_min: 1,
          },
        },
        constraint_space: {
          time: { anchors: ["seven o'clock bell"], contradictions: [] },
          access: { actors: ["butler"], objects: ["clock key"], permissions: [] },
          physical: { laws: [], traces: ["grease streak"] },
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_clock_trace",
          sourceInCML: "CASE.cast[0].alibi_window",
          description: "Fresh grease near the clock key shows someone reached the mechanism after supper.",
          pointsTo: "Supports the clock-trace claim.",
          placement: "late",
          criticality: "supporting",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_clock_trace_contradiction",
          sourceInCML: "CASE.inference_path.steps[0].correction",
          description: "The grease marks show the clock was staged after the visible time was set.",
          pointsTo: "Contradicts the innocent reading of the clock face before the test.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "contradiction",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_clock_trace_contradiction"], late: ["clue_clock_trace"] },
    } as any;

    const result = __testables.enforceAgent5DeterministicContracts(cml, clues);
    expect(result.warnings.length).toBeGreaterThan(0);

    const evidenceClue = clues.clues.find((clue: any) => clue.id === "clue_clock_trace");
    expect(evidenceClue?.sourceInCML).toBe("CASE.cast[0].alibi_window");
    expect(evidenceClue?.placement).toBe("mid");
    expect(evidenceClue?.criticality).toBe("essential");

    const directCulprit = clues.clues.find((clue: any) => clue.id === "clue_culprit_direct_iwan_hale");
    expect(directCulprit).toBeTruthy();
    expect(String(directCulprit?.description)).toContain("Iwan Hale");
    expect(String(directCulprit?.pointsTo).toLowerCase()).toContain("direct evidence");
    expect(String(directCulprit?.pointsTo).toLowerCase()).toContain("means and opportunity");
    expect(["early", "mid"]).toContain(String(directCulprit?.placement));
    expect(directCulprit?.criticality).toBe("essential");

    const lateSlot = clues.clues.find((clue: any) => clue.id === "clue_late_optional_slot_1");
    expect(lateSlot).toBeTruthy();
    expect(lateSlot?.placement).toBe("late");
    expect(lateSlot?.criticality).toBe("optional");
  });

  it("synthesizes missing strict mapping ids before the strict contract gate runs", () => {
    const cml = {
      CASE: {
        cast: [
          {
            name: "Iwan Hale",
            culprit_eligibility: "eligible",
            access_plausibility: "Had after-hours key access",
            alibi_window: "Quarter past nine to ten o'clock",
          },
        ],
        culpability: { culprits: ["Iwan Hale"] },
        inference_path: {
          steps: [
            {
              observation: "Grease marks ring the clock key slot.",
              correction: "The clock was staged to fake the timeline.",
              effect: "Narrows access to Iwan Hale.",
              required_evidence: [
                "Porter confirms key cabinet was opened.",
                "Clock grease sits fresh on the key slot.",
              ],
            },
          ],
        },
        hidden_model: {
          mechanism: {
            description: "The clock in the study was tampered with to create a false timeline.",
          },
        },
        discriminating_test: {
          design: "Confront with clock trace evidence.",
          knowledge_revealed: "Clock trace evidence exposes the staged timeline.",
          evidence_clues: ["clue_clock_trace"],
        },
        quality_controls: {
          clue_visibility_requirements: {
            late_clues_min: 1,
          },
        },
        prose_requirements: {
          clue_to_scene_mapping: [
            { clue_id: "clue_clock_trace", act_number: 1, scene_number: 2 },
            { clue_id: "clue_core_contradiction_chain", act_number: 2, scene_number: 1 },
          ],
        },
        constraint_space: {
          time: { anchors: ["seven o'clock bell"], contradictions: [] },
          access: { actors: ["butler"], objects: ["clock key"], permissions: [] },
          physical: { laws: [], traces: ["grease streak"] },
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_clock_trace",
          sourceInCML: "CASE.cast[0].alibi_window",
          description: "Fresh grease near the clock key shows someone reached the mechanism after supper.",
          pointsTo: "Supports the clock-trace claim.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_clock_trace_contradiction",
          sourceInCML: "CASE.inference_path.steps[0].correction",
          description: "The grease marks show the clock was staged after the visible time was set.",
          pointsTo: "Contradicts the innocent reading of the clock face before the test.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "contradiction",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: [], mid: ["clue_clock_trace", "clue_clock_trace_contradiction"], late: [] },
    } as any;

    const result = __testables.enforceAgent5DeterministicContracts(cml, clues);

    expect(result.warnings.some((w: string) => /strict mapping contract synthesis/i.test(w))).toBe(true);
    expect(clues.clues.some((clue: any) => clue.id === "clue_core_contradiction_chain")).toBe(true);
  });

  it("synthesizes strict-step contradiction clues when strict step coverage floors are unmet", () => {
    const cml = {
      CASE: {
        cast: [],
        culpability: { culprits: [] },
        inference_path: {
          steps: [
            {
              observation: "The stopped clock shows a quarter past ten.",
              correction: "The visible time cannot be trusted.",
              required_evidence: [
                "The brass bezel is warm to the touch.",
                "The key slot carries fresh grease.",
              ],
            },
            {
              observation: "A porter heard the crash from the east corridor.",
              correction: "The corridor witness narrows the movement window.",
              required_evidence: [
                "The porter signed the corridor log at half past ten.",
                "The corridor lamp was still lit after the crash.",
              ],
            },
          ],
        },
        discriminating_test: {
          design: "Compare the stopped clock against the corridor witness account.",
          knowledge_revealed: "The corridor witness fixes the true sequence.",
          evidence_clues: [],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_step_1_obs",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "The stopped clock shows a quarter past ten.",
          pointsTo: "Sets the visible timeline anchor.",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_step_2_obs",
          sourceInCML: "CASE.inference_path.steps[1].observation",
          description: "A porter heard the crash from the east corridor.",
          pointsTo: "Maps the corridor witness to the second inference step.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 2,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: ["clue_step_1_obs"], mid: ["clue_step_2_obs"], late: [] },
    } as any;

    const result = __testables.enforceAgent5DeterministicContracts(cml, clues);

    expect(result.warnings.some((entry) => /strict-step deterministic synthesis/i.test(entry))).toBe(true);
    expect(clues.clues.some((entry: any) =>
      String(entry?.id ?? "").startsWith("clue_fp_contradiction_step_2")
      && entry?.supportsInferenceStep === 2
      && entry?.placement === "early"
      && entry?.criticality === "essential"
      && entry?.evidenceType === "contradiction"
    )).toBe(true);
  });

  it("fails deterministic contracts on meta-audit clue text", () => {
    const cml = {
      CASE: {
        cast: [],
        culpability: { culprits: [] },
        inference_path: {
          steps: [
            {
              observation: "The mantel clock stands at quarter past ten.",
              correction: "The visible time must be tested against witness accounts.",
              required_evidence: [
                "The clock hands sit askew on the enamel face.",
                "The clock key bears a fresh grease smear.",
              ],
            },
          ],
        },
        discriminating_test: {
          design: "Compare the mantel clock with the witness account.",
          knowledge_revealed: "The witness account exposes the false time.",
          evidence_clues: [],
        },
      },
    } as any;

    const clues = {
      clues: [
        {
          id: "clue_meta_obs",
          sourceInCML: "CASE.inference_path.steps[0].observation",
          description: "Reader-visible pre-test clue: the reader cannot follow the deduction chain.",
          pointsTo: "States an Information Parity problem instead of case evidence.",
          placement: "early",
          criticality: "essential",
          evidenceType: "observation",
          supportsInferenceStep: 1,
        },
        {
          id: "clue_step_1_contradiction",
          sourceInCML: "CASE.inference_path.steps[0].correction",
          description: "The visible time must be tested against witness accounts.",
          pointsTo: "Contradicts a naive reading of the mantel clock.",
          placement: "mid",
          criticality: "essential",
          evidenceType: "contradiction",
          supportsInferenceStep: 1,
        },
      ],
      redHerrings: [],
      clueTimeline: { early: ["clue_meta_obs"], mid: ["clue_step_1_contradiction"], late: [] },
    } as any;

    expect(() => __testables.enforceAgent5DeterministicContracts(cml, clues)).toThrow(/meta clue gate failed/i);
  });
});
