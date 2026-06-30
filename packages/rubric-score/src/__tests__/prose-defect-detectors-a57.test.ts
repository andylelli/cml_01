import { describe, expect, it } from "vitest";
import { extractStoryFacts } from "../facts.js";
import { applyHardCaps } from "../hard-caps.js";
import { CATEGORIES, type RubricScore, type StoryFacts } from "../types.js";

// A_57 — deterministic prose-layer detectors that make the internal score honest (it scored run 09168377
// an 80 while a human scored 70; these are the defects it was blind to). Validated on the ACTUAL run text.

const allAt = (mark: number): RubricScore => ({
  categories: CATEGORIES.map((c) => ({ category: c, mark, reason: "" })),
  total: mark * CATEGORIES.length,
  overall_view: "",
  what_works: [],
  main_problems: [],
  chapter_issues: [],
  fastest_fixes: [],
});
const proseMark = (raw: RubricScore, facts: StoryFacts) =>
  applyHardCaps(raw, facts).categories.find((c) => c.category === "prose")!.mark;
const endingMark = (raw: RubricScore, facts: StoryFacts) =>
  applyHardCaps(raw, facts).categories.find((c) => c.category === "ending")!.mark;
const cluesMark = (raw: RubricScore, facts: StoryFacts) =>
  applyHardCaps(raw, facts).categories.find((c) => c.category === "clues")!.mark;

describe("A_57 D1 — garbled evidence surfacing (apostrophe splice)", () => {
  it("flags the real run-09168377 fragment and caps prose", () => {
    const prose =
      "The estate's barometer needle settling on drizzle'the groundskeeper's entry noting silhouettes on the west lawn skies, a fact that left no room for ambiguity.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect((facts.malformedEvidenceSurfacing ?? []).length).toBeGreaterThan(0);
    expect(proseMark(allAt(8), facts)).toBeLessThanOrEqual(5);
  });

  it("caps prose to ≤4 and ceils the total when the splices are material (≥3)", () => {
    const prose =
      "drizzle'the groundskeeper's entry noting silhouettes skies. The rainfall tally noted by the manor groundskeeper'Eliza's entry stating the orchard shadows stretched unbroken skies. drizzle noted in the manor's official diary'security's entry marking shadows skies.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect((facts.malformedEvidenceSurfacing ?? []).length).toBeGreaterThanOrEqual(3);
    expect(proseMark(allAt(9), facts)).toBeLessThanOrEqual(4);
    expect(applyHardCaps(allAt(9), facts).final).toBeLessThanOrEqual(70);
  });

  it("does NOT flag legitimate possessives, contractions, or O'Brien/d'Arcy names", () => {
    const prose =
      "Mrs. O'Brien didn't touch the manor's ledger; the groundskeeper's log read clear. Monsieur d'Arcy's alibi held. It was ten o'clock when they're sure he'd gone.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect(facts.malformedEvidenceSurfacing).toBeUndefined();
    expect(proseMark(allAt(8), facts)).toBe(8);
  });
});

describe("A_57 D4 — report-style clearance", () => {
  it("flags the real run-09168377 clearance line and caps prose + ending", () => {
    const prose =
      "Charles Whitmore was cleared because the servants' testimonies and location in the main hall, established by the evidence and the timeline, placed Charles Whitmore outside the fatal sequence of events.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect(facts.reportStyleClearance).toBe(true);
    expect(proseMark(allAt(8), facts)).toBeLessThanOrEqual(6);
    expect(endingMark(allAt(8), facts)).toBeLessThanOrEqual(7);
  });

  it("flags the detective clearing himself ('As for myself—')", () => {
    const facts = extractStoryFacts(
      { CASE: {} },
      "As for myself— I was never truly a suspect, Arthur said with a thin smile.",
    );
    expect(facts.reportStyleClearance).toBe(true);
  });

  it("does NOT flag dramatized deduction without the verdict frame", () => {
    const prose =
      "Beatrice had been in the kitchen from half past three to the supper bell; three servants placed her there. Charles was away at the council meeting.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect(facts.reportStyleClearance).toBeFalsy();
    expect(proseMark(allAt(8), facts)).toBe(8);
  });
});

describe("A_57 D2 — dual-value-without-contrast (the central clue contradicts itself)", () => {
  const pair = { values: ["half past three in the afternoon", "twenty minutes past four in the afternoon"] as [string, string] };

  it("flags the staged & true times stated as two flat parallel truths, and caps clues", () => {
    const prose =
      "The watch read half past three in the afternoon. The sundial's shadow showed twenty minutes past four in the afternoon. Arthur noted both and moved on.";
    const facts = extractStoryFacts({ CASE: {} }, prose, { discriminatingPair: pair });
    expect(facts.dualValueNoContrast).toBe(true);
    expect(cluesMark(allAt(8), facts)).toBeLessThanOrEqual(6);
  });

  it("does NOT flag when the two values are framed AS a contradiction (contrast connective present)", () => {
    const prose =
      "The watch read half past three in the afternoon, yet the sundial's shadow could only fall that way at twenty minutes past four in the afternoon — the times could not both be true.";
    const facts = extractStoryFacts({ CASE: {} }, prose, { discriminatingPair: pair });
    expect(facts.dualValueNoContrast).toBeFalsy();
    expect(cluesMark(allAt(8), facts)).toBe(8);
  });

  it("does NOT flag when the two values appear far apart (each in its own context)", () => {
    const farApart =
      "The watch read half past three in the afternoon. " +
      "x".repeat(600) +
      " Only later did the shadow analysis reveal twenty minutes past four in the afternoon.";
    const facts = extractStoryFacts({ CASE: {} }, farApart, { discriminatingPair: pair });
    expect(facts.dualValueNoContrast).toBeFalsy();
  });

  it("is inert when no discriminating pair is supplied", () => {
    const prose =
      "The watch read half past three in the afternoon. The sundial's shadow showed twenty minutes past four in the afternoon.";
    const facts = extractStoryFacts({ CASE: {} }, prose);
    expect(facts.dualValueNoContrast).toBeUndefined();
  });
});
