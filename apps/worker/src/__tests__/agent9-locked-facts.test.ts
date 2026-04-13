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
import { repairWordFormLockedFacts, getExpectedClueIdsForVisibility } from "../jobs/agents/agent9-run.js";

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
