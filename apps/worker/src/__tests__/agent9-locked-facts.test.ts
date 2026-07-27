/**
 * Unit tests for repairWordFormLockedFacts (1c — word-form locked fact repair pass).
 *
 * Covers:
 *  - Time-of-day repairs (regression): "11:10 PM" → "ten minutes past eleven"
 *  - Quantity repairs (new): any "[word-number] [unit]" value — duration, distance, count, weight
 *  - Chapter scope: repair only applied to scoped chapters
 *  - Unrecognised fact values: prose unchanged
 *  - Per-chapter warning threshold (>3 replacements per chapter)
 */
import { describe, expect, it, vi } from "vitest";
import {
  repairWordFormLockedFacts,
  getExpectedClueIdsForVisibility,
  reconcileDiscriminatingEvidenceIdsToCanonicalNamespace,
  partitionNsdRevealedCluesForReleaseGate,
  buildSyntheticNsdClueAnchor,
  detectCrossArtifactTemporalConflicts,
  applyLifecycleContinuityGuard,
  applyVictimReappearanceRescue,
  applyCanonicalVictimRescue,
} from "../jobs/agents/agent9-run.js";
import { validateCharacterLifecycle } from "@cml/story-validation";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const makeProse = (chapters: { paragraphs: string[] }[]) => ({ chapters });

const makeTimeFact = (value: string, appearsInChapters?: string[]) => ({
  value,
  description: `The clock reads ${value}`,
  ...(appearsInChapters ? { appearsInChapters } : {}),
});

const makeDurationFact = (value: string, appearsInChapters?: string[]) => ({
  value,
  description: `The tamper amount is ${value}`,
  ...(appearsInChapters ? { appearsInChapters } : {}),
});

// ---------------------------------------------------------------------------
// Time-of-day repair (regression)
// ---------------------------------------------------------------------------

describe("repairWordFormLockedFacts — time-of-day", () => {
  it("replaces digit-form time with canonical word form", () => {
    const prose = makeProse([
      { paragraphs: ["The clock face showed 11:10 PM in the dim light."] },
    ]);
    const facts = [makeTimeFact("ten minutes past eleven")];
    const result = repairWordFormLockedFacts(prose, facts);
    expect(result.chapters[0].paragraphs[0]).toContain("ten minutes past eleven");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/11:10/);
  });

  it("handles H:MM without AM/PM suffix", () => {
    const prose = makeProse([
      { paragraphs: ["The timepiece displayed 11:10 precisely."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeTimeFact("ten minutes past eleven")]);
    expect(result.chapters[0].paragraphs[0]).toContain("ten minutes past eleven");
  });

  it("handles half-past form", () => {
    const prose = makeProse([
      { paragraphs: ["At 3:30 AM they gathered."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeTimeFact("half past three")]);
    expect(result.chapters[0].paragraphs[0]).toContain("half past three");
  });

  it("respects chapter scope — does not repair out-of-scope chapters", () => {
    const prose = makeProse([
      { paragraphs: ["Chapter 1: the clock said 11:10 PM."] },
      { paragraphs: ["Chapter 2: the clock said 11:10 PM."] },
    ]);
    const facts = [makeTimeFact("ten minutes past eleven", ["2"])];
    const result = repairWordFormLockedFacts(prose, facts);
    // ch1 (index 0) is out of scope — unchanged
    expect(result.chapters[0].paragraphs[0]).toMatch(/11:10 PM/);
    // ch2 (index 1) is in scope — repaired
    expect(result.chapters[1].paragraphs[0]).toContain("ten minutes past eleven");
  });
});

// ---------------------------------------------------------------------------
// Duration repair (new in 1c)
// ---------------------------------------------------------------------------

describe("repairWordFormLockedFacts — word-phrased duration", () => {
  it("replaces '40 minutes' with 'forty minutes'", () => {
    const prose = makeProse([
      { paragraphs: ["The clock had been wound back 40 minutes before the body was found."] },
    ]);
    const facts = [makeDurationFact("forty minutes")];
    const result = repairWordFormLockedFacts(prose, facts);
    expect(result.chapters[0].paragraphs[0]).toContain("forty minutes");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b40 minutes\b/i);
  });

  it("replaces '40 minute' (singular/compound) with 'forty minutes'", () => {
    const prose = makeProse([
      { paragraphs: ["A 40 minute discrepancy in the alibi was noted."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeDurationFact("forty minutes")]);
    expect(result.chapters[0].paragraphs[0]).toContain("forty minutes");
  });

  it("replaces '2 hours' with 'two hours'", () => {
    const prose = makeProse([
      { paragraphs: ["He could not account for 2 hours of his evening."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeDurationFact("two hours")]);
    expect(result.chapters[0].paragraphs[0]).toContain("two hours");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b2 hours\b/i);
  });

  it("replaces '30 seconds' with 'thirty seconds'", () => {
    const prose = makeProse([
      { paragraphs: ["The shot was fired within 30 seconds of her arrival."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeDurationFact("thirty seconds")]);
    expect(result.chapters[0].paragraphs[0]).toContain("thirty seconds");
  });

  it("repairs '40 feet' to 'forty feet' (irregular plural — exact match)", () => {
    const prose = makeProse([
      { paragraphs: ["The distance was 40 feet from the window."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [{ value: "forty feet", description: "distance" }]);
    expect(result.chapters[0].paragraphs[0]).toContain("forty feet");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b40 feet\b/i);
  });

  it("repairs '3 shots' to 'three shots' (count unit)", () => {
    const prose = makeProse([
      { paragraphs: ["Witnesses reported 3 shots fired before dawn."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [{ value: "three shots", description: "gunshots" }]);
    expect(result.chapters[0].paragraphs[0]).toContain("three shots");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b3 shots\b/i);
  });

  it("repairs '7 inches' to 'seven inches' (regular -es plural)", () => {
    const prose = makeProse([
      { paragraphs: ["The blade measured exactly 7 inches in length."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [{ value: "seven inches", description: "blade length" }]);
    expect(result.chapters[0].paragraphs[0]).toContain("seven inches");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b7 inches\b/i);
  });

  it("repairs '5 pounds' to 'five pounds' (weight / currency)", () => {
    const prose = makeProse([
      { paragraphs: ["The bribe amounted to 5 pounds in banknotes."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [{ value: "five pounds", description: "bribe amount" }]);
    expect(result.chapters[0].paragraphs[0]).toContain("five pounds");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b5 pounds\b/i);
  });

  it("respects chapter scope for duration repairs", () => {
    const prose = makeProse([
      { paragraphs: ["Ch1: wound back 40 minutes."] },
      { paragraphs: ["Ch2: wound back 40 minutes."] },
      { paragraphs: ["Ch3: wound back 40 minutes."] },
    ]);
    const facts = [makeDurationFact("forty minutes", ["2", "3"])];
    const result = repairWordFormLockedFacts(prose, facts);
    // Ch1 not in scope — unchanged
    expect(result.chapters[0].paragraphs[0]).toMatch(/40 minutes/);
    // Ch2 and Ch3 in scope — repaired
    expect(result.chapters[1].paragraphs[0]).toContain("forty minutes");
    expect(result.chapters[2].paragraphs[0]).toContain("forty minutes");
  });

  it("handles multiple different duration facts in one run", () => {
    const prose = makeProse([
      { paragraphs: ["The clock showed 11:10 PM. The gap was 40 minutes."] },
    ]);
    const facts = [
      makeTimeFact("ten minutes past eleven"),
      makeDurationFact("forty minutes"),
    ];
    const result = repairWordFormLockedFacts(prose, facts);
    expect(result.chapters[0].paragraphs[0]).toContain("ten minutes past eleven");
    expect(result.chapters[0].paragraphs[0]).toContain("forty minutes");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/11:10 PM/);
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\b40 minutes\b/i);
  });

  it("replaces 'about 40 minutes' with 'forty minutes' (qualifier prefix)", () => {
    const prose = makeProse([
      { paragraphs: ["She waited about 40 minutes before the constable arrived."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeDurationFact("forty minutes")]);
    expect(result.chapters[0].paragraphs[0]).toContain("forty minutes");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\babout 40 minutes\b/i);
  });

  it("replaces 'roughly 2 hours' with 'two hours' (qualifier prefix)", () => {
    const prose = makeProse([
      { paragraphs: ["He was gone for roughly 2 hours, he claimed."] },
    ]);
    const result = repairWordFormLockedFacts(prose, [makeDurationFact("two hours")]);
    expect(result.chapters[0].paragraphs[0]).toContain("two hours");
    expect(result.chapters[0].paragraphs[0]).not.toMatch(/\broughly 2 hours\b/i);
  });
});

// ---------------------------------------------------------------------------
// Per-chapter warning threshold
// ---------------------------------------------------------------------------

describe("repairWordFormLockedFacts — per-chapter warning", () => {
  it("emits a console.warn when a chapter requires more than 3 replacements", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    // 5 separate paragraphs each containing "40 minutes" → 5 replacements in ch1
    const prose = makeProse([
      {
        paragraphs: [
          "A: 40 minutes elapsed.",
          "B: 40 minutes elapsed.",
          "C: 40 minutes elapsed.",
          "D: 40 minutes elapsed.",
          "E: 40 minutes elapsed.",
        ],
      },
    ]);
    repairWordFormLockedFacts(prose, [makeDurationFact("forty minutes")]);

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("Chapter 1"),
    );
    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining("5 replacements"),
    );

    warnSpy.mockRestore();
  });

  it("does NOT warn when a chapter requires 3 or fewer replacements", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});

    const prose = makeProse([
      { paragraphs: ["A: 40 minutes.", "B: 40 minutes.", "C: 40 minutes."] },
    ]);
    repairWordFormLockedFacts(prose, [makeDurationFact("forty minutes")]);

    expect(warnSpy).not.toHaveBeenCalled();

    warnSpy.mockRestore();
  });
});

// ---------------------------------------------------------------------------
// Edge cases
// ---------------------------------------------------------------------------

describe("repairWordFormLockedFacts — edge cases", () => {
  it("returns prose unchanged when lockedFacts is an empty array", () => {
    const prose = makeProse([{ paragraphs: ["Some prose text."] }]);
    const result = repairWordFormLockedFacts(prose, []);
    expect(result).toStrictEqual(prose);
  });

  it("returns prose unchanged when no fact has a recognised word-form value", () => {
    const prose = makeProse([{ paragraphs: ["The alibi was unconvincing."] }]);
    const result = repairWordFormLockedFacts(prose, [
      { value: "a very particular shade of red", description: "colour" },
    ]);
    expect(result.chapters[0].paragraphs[0]).toBe("The alibi was unconvincing.");
  });

  it("does not mutate the original prose object", () => {
    const prose = makeProse([{ paragraphs: ["The clock said 11:10 PM."] }]);
    const original = JSON.stringify(prose);
    repairWordFormLockedFacts(prose, [makeTimeFact("ten minutes past eleven")]);
    expect(JSON.stringify(prose)).toBe(original);
  });
});

// ---------------------------------------------------------------------------
// getExpectedClueIdsForVisibility — clue ID reconciliation (3b)
// Registry / mapping IDs not distributed by Agent 5 must be excluded.
// discriminatingIds are always kept regardless.
// ---------------------------------------------------------------------------

describe("getExpectedClueIdsForVisibility — clue reconciliation", () => {
  it("returns only distributed IDs when registry has extras not distributed", () => {
    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [
          { clue_id: "clue_distributed_1" },
          { clue_id: "clue_orphan_mapping" }, // not in distribution
        ],
      },
      discriminating_test: { evidence_clues: ["clue_discriminating"] },
      clue_registry: [
        { clue_id: "clue_distributed_1" },
        { clue_id: "clue_early_1" },   // ambient — not distributed
        { clue_id: "clue_ambient_2" }, // ambient — not distributed
      ],
    };
    const clueDistribution = {
      clues: [{ id: "clue_distributed_1" }, { id: "clue_discriminating" }],
    };
    const result = getExpectedClueIdsForVisibility(cmlCase, clueDistribution);
    expect(result).toContain("clue_distributed_1");
    expect(result).toContain("clue_discriminating"); // always kept
    expect(result).not.toContain("clue_orphan_mapping"); // dropped — not distributed
    expect(result).not.toContain("clue_early_1");         // dropped — not distributed
    expect(result).not.toContain("clue_ambient_2");        // dropped — not distributed
  });

  it("always keeps discriminatingIds even when not in distributed set", () => {
    // The discriminating test clue might be distributed separately or injected later;
    // it must never be dropped from the expected set.
    const cmlCase = {
      prose_requirements: { clue_to_scene_mapping: [] },
      discriminating_test: { evidence_clues: ["clue_disc_A", "clue_disc_B"] },
      clue_registry: [{ clue_id: "clue_disc_A" }],
    };
    const clueDistribution = { clues: [] }; // nothing distributed
    const result = getExpectedClueIdsForVisibility(cmlCase, clueDistribution);
    expect(result).toContain("clue_disc_A");
    expect(result).toContain("clue_disc_B");
  });

  it("returns empty array when all inputs are empty", () => {
    const result = getExpectedClueIdsForVisibility({}, undefined);
    expect(result).toHaveLength(0);
  });

  it("falls back to full registry+mapping union when distribution data is absent", () => {
    // When clueDistribution is undefined (or empty), registry/mapping IDs must NOT be silently
    // dropped — we can't reconcile against a set that doesn't exist yet.
    const cmlCase = {
      prose_requirements: { clue_to_scene_mapping: [{ clue_id: "clue_map_1" }] },
      discriminating_test: { evidence_clues: [] },
      clue_registry: [{ clue_id: "clue_reg_1" }],
    };
    const result = getExpectedClueIdsForVisibility(cmlCase, undefined);
    expect(result).toContain("clue_map_1");
    expect(result).toContain("clue_reg_1");
  });

  it("deduplicates IDs that appear in multiple sources", () => {
    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_1" }],
      },
      discriminating_test: { evidence_clues: ["clue_1"] },
      clue_registry: [{ clue_id: "clue_1" }],
    };
    const clueDistribution = { clues: [{ id: "clue_1" }] };
    const result = getExpectedClueIdsForVisibility(cmlCase, clueDistribution);
    expect(result.filter((id) => id === "clue_1")).toHaveLength(1); // deduplicated
  });
});

describe("reconcileDiscriminatingEvidenceIdsToCanonicalNamespace", () => {
  it("removes non-canonical discriminating evidence values and seeds canonical IDs from mapping", () => {
    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_clock" }, { clue_id: "clue_journal" }],
      },
      discriminating_test: {
        evidence_clues: [
          "clock shows ten minutes past eleven",
          "victim journal timeline note",
        ],
      },
    };

    const result = reconcileDiscriminatingEvidenceIdsToCanonicalNamespace(
      cmlCase,
      ["clue_clock", "clue_journal", "clue_dust"],
    );

    expect(result.repaired).toBe(true);
    expect(result.removedNonCanonical).toEqual([
      "clock shows ten minutes past eleven",
      "victim journal timeline note",
    ]);
    expect(result.seededFromMapping).toEqual(["clue_clock", "clue_journal"]);
    expect(result.nonCanonicalIds).toEqual([]);
    expect(cmlCase.discriminating_test.evidence_clues).toEqual(["clue_clock", "clue_journal"]);
  });

  it("keeps canonical IDs unchanged when already valid", () => {
    const cmlCase = {
      prose_requirements: {
        clue_to_scene_mapping: [{ clue_id: "clue_clock" }, { clue_id: "clue_journal" }],
      },
      discriminating_test: {
        evidence_clues: ["clue_clock", "clue_journal"],
      },
    };

    const result = reconcileDiscriminatingEvidenceIdsToCanonicalNamespace(
      cmlCase,
      ["clue_clock", "clue_journal", "clue_dust"],
    );

    expect(result.repaired).toBe(false);
    expect(result.nonCanonicalIds).toEqual([]);
    expect(cmlCase.discriminating_test.evidence_clues).toEqual(["clue_clock", "clue_journal"]);
  });
});

describe("partitionNsdRevealedCluesForReleaseGate", () => {
  it("treats only expected clue IDs as enforceable and keeps red-herring IDs advisory", () => {
    const result = partitionNsdRevealedCluesForReleaseGate(
      ["clue_1", "rh_1", "rh_2", "clue_2"],
      ["clue_1", "clue_2", "clue_3"],
    );

    expect(result.enforceable).toEqual(["clue_1", "clue_2"]);
    expect(result.advisoryOnly).toEqual(["rh_1", "rh_2"]);
  });

  it("marks all IDs enforceable when all are expected", () => {
    const result = partitionNsdRevealedCluesForReleaseGate(
      ["clue_a", "clue_b"],
      ["clue_a", "clue_b", "clue_c"],
    );

    expect(result.enforceable).toEqual(["clue_a", "clue_b"]);
    expect(result.advisoryOnly).toEqual([]);
  });

  // Regression: run mystery-1784055526685 hard-aborted because an OPTIONAL-criticality clue
  // (clue_late_optional_slot_1, a synthesized strict-mapping filler) landed in the enforceable
  // set and its missing prose anchor tripped the fair-play hard-stop. Optional texture clues
  // are never fair-play-load-bearing → they must be advisory, never enforceable.
  it("downgrades an expected-but-OPTIONAL clue to advisory, never enforceable", () => {
    const result = partitionNsdRevealedCluesForReleaseGate(
      ["clue_1", "clue_late_optional_slot_1", "clue_2"],
      ["clue_1", "clue_2", "clue_late_optional_slot_1"], // optional clue IS distributed/expected
      ["clue_late_optional_slot_1"], // …but flagged optional
    );

    expect(result.enforceable).toEqual(["clue_1", "clue_2"]);
    expect(result.optionalDowngraded).toEqual(["clue_late_optional_slot_1"]);
    expect(result.enforceable).not.toContain("clue_late_optional_slot_1");
  });

  it("still enforces an ESSENTIAL/SUPPORTING expected clue that is NOT in the optional set", () => {
    const result = partitionNsdRevealedCluesForReleaseGate(
      ["clue_essential", "clue_supporting"],
      ["clue_essential", "clue_supporting"],
      ["clue_some_other_optional"], // neither revealed clue is optional
    );

    expect(result.enforceable).toEqual(["clue_essential", "clue_supporting"]);
    expect(result.optionalDowngraded).toEqual([]);
  });

  it("keeps a non-expected optional clue in advisoryOnly (not double-counted as downgraded)", () => {
    const result = partitionNsdRevealedCluesForReleaseGate(
      ["rh_1"],
      ["clue_1"], // rh_1 is not expected at all
      ["rh_1"], // and also happens to be optional
    );

    expect(result.advisoryOnly).toEqual(["rh_1"]);
    expect(result.optionalDowngraded).toEqual([]);
    expect(result.enforceable).toEqual([]);
  });
});

describe("buildSyntheticNsdClueAnchor", () => {
  it("creates a parity-safe fallback anchor with clue metadata", () => {
    const anchor = buildSyntheticNsdClueAnchor("clue_foo", 4, {
      description: "Clock key was found reversed on the mantelpiece.",
      pointsTo: "Timeline manipulation.",
    });

    expect(anchor.clue_id).toBe("clue_foo");
    expect(anchor.chapter_number).toBe(4);
    expect(anchor.confidence).toBe(0);
    expect(anchor.state).toBe("introduced");
    expect(anchor.evidence_offset).toEqual({ chapter: 4, paragraph: 1, sentence: 1 });
    expect(anchor.evidence_quote).toContain("Synthetic NSD anchor");
    expect(anchor.evidence_quote).toContain("Clock key");
  });

  it("remains valid when clue metadata is absent", () => {
    const anchor = buildSyntheticNsdClueAnchor("clue_bar", 2);

    expect(anchor.clue_id).toBe("clue_bar");
    expect(anchor.chapter_number).toBe(2);
    expect(anchor.confidence).toBe(0);
    expect(anchor.state).toBe("introduced");
    expect(anchor.evidence_quote).toContain("No direct prose quote extracted");
  });
});

describe("detectCrossArtifactTemporalConflicts", () => {
  it("detects contradictory time anchors across Agent 3 CML and Agent 7 narrative", () => {
    const conflicts = detectCrossArtifactTemporalConflicts({
      lockedFacts: [
        {
          description: "exact time shown on stopped clock face",
          value: "ten minutes past eleven",
        },
      ],
      cmlCase: {
        false_assumption: {
          statement: "Everyone believed the clock showed quarter to nine when the body was found.",
        },
        discriminating_test: {
          design: {
            description: "The investigator compares the stopped clock reading against witness recollection.",
          },
        },
      },
      narrative: {
        acts: [
          {
            actNumber: 1,
            scenes: [
              {
                sceneNumber: 1,
                summary: "In the drawing room, they repeat that the clock was heard at quarter past eight.",
                purpose: "Interrogate witness timeline around the stopped clock.",
              },
            ],
          },
        ],
      },
    });

    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts.some((entry) => entry.sourceTag === "agent3_cml")).toBe(true);
    expect(conflicts.some((entry) => entry.sourceTag === "agent7_narrative")).toBe(true);
  });

  it("does not flag matching 12-hour anchor when only meridiem explicitness differs", () => {
    const conflicts = detectCrossArtifactTemporalConflicts({
      lockedFacts: [
        {
          description: "exact time shown on stopped clock face",
          value: "eleven o'clock",
        },
      ],
      cmlCase: {
        false_assumption: {
          statement: "The witness repeated that the clock read 11 PM in the same room.",
        },
      },
      narrative: { acts: [] },
    });

    expect(conflicts).toHaveLength(0);
  });

  it("ignores unrelated time strings when fact-description overlap is missing", () => {
    const conflicts = detectCrossArtifactTemporalConflicts({
      lockedFacts: [
        {
          description: "kitchen scales weight confirmation",
          value: "forty pounds",
        },
      ],
      cmlCase: {
        false_assumption: {
          statement: "The clock struck quarter to nine in the hall.",
        },
      },
      narrative: {
        acts: [
          {
            actNumber: 1,
            scenes: [
              {
                sceneNumber: 1,
                summary: "At quarter past eight the constable noted the foyer lamp.",
              },
            ],
          },
        ],
      },
    });

    expect(conflicts).toHaveLength(0);
  });
});

describe("applyLifecycleContinuityGuard", () => {
  const castCharacters = [
    { name: "Charles Hargrove", gender: "male" },
    { name: "Margaret Hargrove", gender: "female" },
    { name: "Inspector Harold Finch", gender: "male" },
  ];

  it("demotes full-name death attributions when the same non-victim is active in chapter", () => {
    const prose = makeProse([
      {
        paragraphs: [
          "Margaret Hargrove froze at the lifeless body of Charles Hargrove in the study.",
          "Charles Hargrove entered moments later and demanded answers.",
        ],
      },
    ]);

    const result = applyLifecycleContinuityGuard(prose, castCharacters as any, { CASE: {} });
    const repairedDeathParagraph = result.prose.chapters[0].paragraphs[0];

    expect(result.replacementCount).toBeGreaterThan(0);
    expect(repairedDeathParagraph).toContain("Charles");
    expect(repairedDeathParagraph).not.toContain("Charles Hargrove");
    expect(result.prose.chapters[0].paragraphs[1]).toContain("Charles Hargrove entered");
  });

  it("never rewrites canonical victim names", () => {
    const prose = makeProse([
      {
        paragraphs: [
          "Charles Hargrove was found lifeless in the study.",
          "Charles Hargrove said nothing as Finch asked his first question.",
        ],
      },
    ]);

    const cml = {
      CASE: {
        culpability: {
          victim: "Charles Hargrove",
        },
      },
    };

    const result = applyLifecycleContinuityGuard(prose, castCharacters as any, cml as any);
    expect(result.replacementCount).toBe(0);
    expect(result.prose.chapters[0].paragraphs[0]).toContain("Charles Hargrove");
  });
});

describe("applyVictimReappearanceRescue", () => {
  const castCharacters = [
    { name: "Charles Hargrove", gender: "male" },
    { name: "Margaret Hargrove", gender: "female" },
  ];

  it("rewrites non-victim death-attribution full names from flagged lifecycle errors", () => {
    const prose = makeProse([
      {
        paragraphs: [
          "The lifeless body of Charles Hargrove lay beside the desk.",
        ],
      },
      {
        paragraphs: [
          "Charles Hargrove entered and challenged Finch's conclusions.",
        ],
      },
    ]);

    const issues = [
      {
        characterName: "Charles Hargrove",
        deadByChapter: 1,
        reappearsChapter: 2,
      },
    ];

    const rescued = applyVictimReappearanceRescue(
      prose,
      castCharacters as any,
      { CASE: {} },
      issues as any,
    );

    expect(rescued.repairCount).toBeGreaterThan(0);
    expect(rescued.prose.chapters[0].paragraphs[0]).toContain("Charles");
    expect(rescued.prose.chapters[0].paragraphs[0]).not.toContain("Charles Hargrove");
    expect(rescued.skippedVictimNames).toHaveLength(0);
  });

  it("skips canonical victim names from deterministic rescue", () => {
    const prose = makeProse([
      {
        paragraphs: [
          "The lifeless body of Charles Hargrove lay beside the desk.",
        ],
      },
      {
        paragraphs: [
          "Charles Hargrove entered and challenged Finch's conclusions.",
        ],
      },
    ]);

    const issues = [
      {
        characterName: "Charles Hargrove",
        deadByChapter: 1,
        reappearsChapter: 2,
      },
    ];

    const cml = {
      CASE: {
        culpability: {
          victim: "Charles Hargrove",
        },
      },
    };

    const rescued = applyVictimReappearanceRescue(
      prose,
      castCharacters as any,
      cml as any,
      issues as any,
    );

    expect(rescued.repairCount).toBe(0);
    expect(rescued.skippedVictimNames).toEqual(["Charles Hargrove"]);
  });
});

// ANALYSIS_43 Phase 2 (G) — canonical-victim rescue + validator recollection exclusion.
describe("applyCanonicalVictimRescue (canonical victim_reappears_alive)", () => {
  const castCharacters = [
    { name: "Charles Hargrove", gender: "male" },
    { name: "Margaret Hargrove", gender: "female" },
  ];
  const cml = {
    CASE: {
      cast: [
        { name: "Charles Hargrove", role: "victim", role_archetype: "victim", gender: "male" },
        { name: "Margaret Hargrove", role: "suspect", role_archetype: "suspect", gender: "female" },
      ],
      culpability: { victim: "Charles Hargrove" },
    },
  };
  const issues = [{ characterName: "Charles Hargrove", deadByChapter: 1, reappearsChapter: 2 }];

  const makeStory = (prose: any) => ({
    id: "s",
    projectId: "p",
    scenes: prose.chapters.map((c: any, i: number) => ({ number: i + 1, title: c.title ?? `Chapter ${i + 1}`, text: c.paragraphs.join("\n\n") })),
  });

  it("reframes the CANONICAL victim's active sentence as recollection (where the non-victim rescue skips it)", () => {
    const prose = makeProse([
      { paragraphs: ["The lifeless body of Charles Hargrove lay beside the desk."] },
      { paragraphs: ["Charles Hargrove entered and challenged the inspector's conclusions."] },
    ]);
    const rescued = applyCanonicalVictimRescue(prose, castCharacters as any, cml as any, issues as any);
    expect(rescued.repairCount).toBeGreaterThan(0);
    expect(rescued.reframedVictimNames).toContain("Charles Hargrove");
    expect(rescued.prose.chapters[1].paragraphs[0]).toMatch(/^In a remembered moment, Charles Hargrove entered/);
    // Chapter 1 (the death sentence) is untouched.
    expect(rescued.prose.chapters[0].paragraphs[0]).toBe("The lifeless body of Charles Hargrove lay beside the desk.");
  });

  it("the reframed prose no longer trips the lifecycle validator (end-to-end)", () => {
    const before = makeProse([
      { paragraphs: ["The lifeless body of Charles Hargrove lay beside the desk."] },
      { paragraphs: ["Charles Hargrove entered and challenged the inspector's conclusions."] },
    ]);
    // Baseline: the un-reframed prose IS flagged.
    const baselineErrors = validateCharacterLifecycle(makeStory(before) as any, cml as any);
    expect(baselineErrors.some((e: any) => e.type === "victim_reappears_alive")).toBe(true);

    // After the rescue, the recollection frame clears it.
    const rescued = applyCanonicalVictimRescue(before, castCharacters as any, cml as any, issues as any);
    const afterErrors = validateCharacterLifecycle(makeStory(rescued.prose) as any, cml as any);
    expect(afterErrors.some((e: any) => e.type === "victim_reappears_alive")).toBe(false);
  });

  it("ANALYSIS_44: reframing a canonical victim's confession clears deceased_character_confesses (end-to-end)", () => {
    const before = makeProse([
      { paragraphs: ["The lifeless body of Charles Hargrove lay beside the desk."] },
      { paragraphs: ["Charles Hargrove confessed to the murder before the assembled household."] },
    ]);
    // Baseline: an un-reframed confession by the dead victim IS flagged critical.
    const baseline = validateCharacterLifecycle(makeStory(before) as any, cml as any);
    expect(baseline.some((e: any) => e.type === "deceased_character_confesses")).toBe(true);

    // The rescue reframes the confession sentence (confessed ∈ LIFECYCLE_ACTIVE_RE) …
    const rescued = applyCanonicalVictimRescue(before, castCharacters as any, cml as any, issues as any);
    expect(rescued.prose.chapters[1].paragraphs[0]).toMatch(/^In a remembered moment, Charles Hargrove confessed/);

    // … and the validator (with the recollection exclusion) no longer flags the confession.
    const after = validateCharacterLifecycle(makeStory(rescued.prose) as any, cml as any);
    expect(after.some((e: any) => e.type === "deceased_character_confesses")).toBe(false);
    expect(after.some((e: any) => e.type === "victim_reappears_alive")).toBe(false);
  });

  it("A_50 §8 rank 3: COMPREHENSIVE — reframes confession-by-noun, first-person+death, and active (not just one), so the critical clears", () => {
    const before = makeProse([
      { paragraphs: ["The lifeless body of Charles Hargrove lay beside the desk."] },
      { paragraphs: [
        "Charles Hargrove left a written confession on the blotter.", // noun form, NO active verb — old rescue skipped this
        "\"I killed him,\" Charles Hargrove had scrawled before the end.", // first-person + death word
        "Charles Hargrove confessed to the killing in front of the household.", // active
      ] },
    ]);
    const baseline = validateCharacterLifecycle(makeStory(before) as any, cml as any);
    expect(baseline.some((e: any) => e.type === "deceased_character_confesses")).toBe(true);

    const rescued = applyCanonicalVictimRescue(before, castCharacters as any, cml as any, issues as any);
    // All THREE post-death sentences reframed (the under-firing fix), not just the active one.
    expect(rescued.repairCount).toBe(3);
    // A_70 §3: the frame now ROTATES, so this asserts every sentence is framed by an accepted
    // recollection frame — not that all three carry the identical opener (that stamping was the
    // defect: 28 copies of one phrase in a shipped story).
    expect(
      rescued.prose.chapters[1].paragraphs.every((p: string) =>
        /^(In a remembered moment|In life|Before the death),/.test(p),
      ),
    ).toBe(true);

    // Re-validation finds no residual (no sibling-sentence whack-a-mole) and the death line is intact.
    const after = validateCharacterLifecycle(makeStory(rescued.prose) as any, cml as any);
    expect(after.some((e: any) => e.type === "deceased_character_confesses")).toBe(false);
    expect(rescued.prose.chapters[0].paragraphs[0]).toBe("The lifeless body of Charles Hargrove lay beside the desk.");
  });

  it("A_50: default-safe — a correctly dead-and-silent victim is untouched", () => {
    const before = makeProse([
      { paragraphs: ["The lifeless body of Charles Hargrove lay beside the desk."] },
      { paragraphs: ["Margaret Hargrove studied the room and questioned each guest in turn."] }, // living suspect, no victim activity
    ]);
    const rescued = applyCanonicalVictimRescue(before, castCharacters as any, cml as any, issues as any);
    expect(rescued.repairCount).toBe(0);
    expect(rescued.prose.chapters[1].paragraphs[0]).toBe("Margaret Hargrove studied the room and questioned each guest in turn.");
  });
});

// ---------------------------------------------------------------------------
// A_70 §3 — recollection-frame VARIETY
// ---------------------------------------------------------------------------

describe("applyCanonicalVictimRescue — A_70 §3 frame rotation", () => {
  const castCharacters = [{ name: "Hugo Vane", gender: "male" }];
  const cml = {
    CASE: {
      cast: [{ name: "Hugo Vane", role: "victim", role_archetype: "victim", gender: "male" }],
      culpability: { victim: "Hugo Vane" },
    },
  };
  const issues = [{ characterName: "Hugo Vane", deadByChapter: 1, reappearsChapter: 2 }];

  const makeStory = (prose: any) => ({
    id: "s",
    projectId: "p",
    scenes: prose.chapters.map((c: any, i: number) => ({
      number: i + 1,
      title: `Chapter ${i + 1}`,
      text: c.paragraphs.join("\n\n"),
    })),
  });

  // The measured defect: 28 identical openers in one shipped story. One stamped phrase is the bug;
  // a repeated phrase surviving N reframes is what this pins.
  it("does not stamp the same opener on every reframed sentence", () => {
    const prose = {
      chapters: [
        { paragraphs: ["The lifeless body of Hugo Vane lay beside the clock."] },
        {
          paragraphs: [
            "Hugo Vane entered the hall and spoke to the housekeeper.",
            "Hugo Vane left a written confession on the blotter.",
            "Hugo Vane confessed to the arrangement before the assembled household.",
          ],
        },
      ],
    };
    const rescued = applyCanonicalVictimRescue(prose as any, castCharacters as any, cml as any, issues as any);
    expect(rescued.repairCount).toBe(3);

    const framed: string[] = rescued.prose.chapters[1].paragraphs;
    const openers = framed.map((p: string) => p.split(",")[0] + ",");
    // Every sentence is framed …
    expect(framed.every((p: string) => /^(In a remembered moment|In life|Before the death),/.test(p))).toBe(true);
    // … but not all with the SAME frame.
    expect(new Set(openers).size).toBeGreaterThan(1);
  });

  it("every rotated frame still clears the lifecycle validator end-to-end", () => {
    const prose = {
      chapters: [
        { paragraphs: ["The lifeless body of Hugo Vane lay beside the clock."] },
        {
          paragraphs: [
            "Hugo Vane entered the hall and spoke to the housekeeper.",
            "Hugo Vane left a written confession on the blotter.",
            "Hugo Vane confessed to the arrangement before the assembled household.",
          ],
        },
      ],
    };
    const baseline = validateCharacterLifecycle(makeStory(prose) as any, cml as any);
    expect(baseline.some((e: any) => e.type === "victim_reappears_alive")).toBe(true);

    const rescued = applyCanonicalVictimRescue(prose as any, castCharacters as any, cml as any, issues as any);
    const after = validateCharacterLifecycle(makeStory(rescued.prose) as any, cml as any);
    // This is the whole safety argument: a varied frame must not reintroduce an abort.
    expect(after.some((e: any) => e.type === "victim_reappears_alive")).toBe(false);
    expect(after.some((e: any) => e.type === "deceased_character_confesses")).toBe(false);
  });

  it("keeps the canonical first frame, so a single reframe is unchanged from before A_70", () => {
    const prose = {
      chapters: [
        { paragraphs: ["The lifeless body of Hugo Vane lay beside the clock."] },
        { paragraphs: ["Hugo Vane entered the hall and spoke to the housekeeper."] },
      ],
    };
    const rescued = applyCanonicalVictimRescue(prose as any, castCharacters as any, cml as any, issues as any);
    expect(rescued.prose.chapters[1].paragraphs[0]).toMatch(/^In a remembered moment, Hugo Vane entered/);
  });
});
