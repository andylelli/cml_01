/**
 * A_110 M6 / L5 — PROSE_V2_SELECTOR_RANKS. The composite standardises on 49 v1 books but chooses between drafts of one
 * chapter; MEASURED on 20 logged selections, its written weights did not hold (register third, repetition inert). ON,
 * each instrument ranks the drafts, register and repetition carry no weight, and a tie goes to the draft that repeats
 * the book so far least.
 */
import { afterEach, describe, expect, it } from "vitest";
import { chooseDraft, overlapWithBook, RANK_WEIGHTS, type ScoredDraft } from "../selector.js";
import type { DraftScore, ProseChapterLike } from "../types.js";

afterEach(() => {
  delete process.env.PROSE_V2_SELECTOR_RANKS;
});

const ch = (...paragraphs: string[]): ProseChapterLike => ({ title: "t", number: 1, paragraphs });
const draft = (attempt: number, contributions: Record<string, number>, text = `draft ${attempt} words here and more`, hard = 0): ScoredDraft => ({
  draft: { segment: 0, attempt, chapters: [ch(text)], truncated: false, missing: [] },
  score: {
    hard: Array.from({ length: hard }, () => ({ kind: "scaffold", chapter: 1, detail: "x" })),
    vector: { registerRate: 0, repetitionPer10k: 0, copiedSpans: 0, dialogueOpenShare: 0, longSentenceShare: 0, witPer10k: 0, witTarget: 41, turnChapters: 0, turnWindow: 0, clocksOffTable: 0, pronounMismatches: 0, words: 100 },
    composite: Object.values(contributions).reduce((a, b) => a + b, 0),
    contributions,
  } as unknown as DraftScore,
});

describe("A_110 M6 — the selector on its own scale", () => {
  it("register and repetition carry no weight; the others keep the composite's", () => {
    expect(RANK_WEIGHTS.registerRate).toBe(0);
    expect(RANK_WEIGHTS.repetitionPer10k).toBe(0);
    expect(RANK_WEIGHTS.dialogueOpenShare).toBe(1.5);
  });

  it("OFF: a large register contribution wins, as today", () => {
    const a = draft(1, { registerRate: 9, dialogueOpenShare: -1, longSentenceShare: -1, witPer10k: -1, emDashPer1k: 0, repetitionPer10k: 0 });
    const b = draft(2, { registerRate: 0, dialogueOpenShare: 1, longSentenceShare: 1, witPer10k: 1, emDashPer1k: 0, repetitionPer10k: 0 });
    expect(chooseDraft([a, b])?.draft.attempt).toBe(1);
  });

  it("ON: the same pair is decided by the instruments that carry weight — register no longer outvotes three of them", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const a = draft(1, { registerRate: 9, dialogueOpenShare: -1, longSentenceShare: -1, witPer10k: -1, emDashPer1k: 0, repetitionPer10k: 0 });
    const b = draft(2, { registerRate: 0, dialogueOpenShare: 1, longSentenceShare: 1, witPer10k: 1, emDashPer1k: 0, repetitionPer10k: 0 });
    const chosen = chooseDraft([a, b]);
    expect(chosen?.draft.attempt).toBe(2);
    expect(b.rank).toBeLessThan(a.rank!);
  });

  it("ON: ranks need no scale — a tiny lead counts the same as a large one", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const a = draft(1, { dialogueOpenShare: 50, longSentenceShare: 0, witPer10k: 0, emDashPer1k: 0, registerRate: 0, repetitionPer10k: 0 });
    const b = draft(2, { dialogueOpenShare: 49.9, longSentenceShare: 0.1, witPer10k: 0.1, emDashPer1k: 0, registerRate: 0, repetitionPer10k: 0 });
    expect(chooseDraft([a, b])?.draft.attempt).toBe(2);
  });

  it("ON: fewest ranking failures still come first", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const a = draft(1, { dialogueOpenShare: 5, longSentenceShare: 5, witPer10k: 5, emDashPer1k: 5, registerRate: 0, repetitionPer10k: 0 }, "x", 1);
    const b = draft(2, { dialogueOpenShare: 0, longSentenceShare: 0, witPer10k: 0, emDashPer1k: 0, registerRate: 0, repetitionPer10k: 0 });
    expect(chooseDraft([a, b])?.draft.attempt).toBe(2);
  });

  it("ON (L5): a tie goes to the draft that repeats the book so far least", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const book = "She followed the evidence wherever it led, and the clock ticked quietly in the hall.";
    const same = { dialogueOpenShare: 1, longSentenceShare: 1, witPer10k: 1, emDashPer1k: 1, registerRate: 0, repetitionPer10k: 0 };
    const echo = draft(1, same, "He followed the evidence wherever it led, and the clock ticked quietly by the door.");
    const fresh = draft(2, same, "Rain had come up off the harbour and the lamps along the quay were lit early.");
    expect(chooseDraft([echo, fresh], { bookSoFar: book })?.draft.attempt).toBe(2);
    expect(echo.overlap!).toBeGreaterThan(fresh.overlap!);
  });

  it("overlap is the share of a draft's distinct 4-word sequences the book already holds", () => {
    expect(overlapWithBook([ch("one two three four five")], "one two three four")).toBeCloseTo(0.5);
    expect(overlapWithBook([ch("one two three four five")], "")).toBe(0);
  });
});

// A_110 M10 — the opening, when drafted more than once: the case's own place words, then distance from past openings.
import { openingMeasures } from "../selector.js";
describe("A_110 M10 — choosing the opening", () => {
  const nouns = ["harbour", "slate", "gulls", "chapel"];
  const past = ["The scent of beeswax hung in the hush of the morning room as rain pressed against the windows."];
  const even = { registerRate: 0, dialogueOpenShare: 0, longSentenceShare: 0, witPer10k: 0, emDashPer1k: 0, repetitionPer10k: 0 };

  it("measures coverage of the place's words and the distance to the nearest past opening", () => {
    const m = openingMeasures([ch("The harbour lay below the chapel, its slate roofs wet.", "Gulls wheeled.")], { nouns, pastOpenings: past })!;
    expect(m.coverage).toBe(4);
    expect(m.distance).toBeGreaterThan(0.9);
    const copy = openingMeasures([ch(past[0]!)], { nouns, pastOpenings: past })!;
    expect(copy.distance).toBe(0);
    expect(openingMeasures([{ title: "t", number: 2, paragraphs: ["x"] }], { nouns, pastOpenings: past })).toBeNull();
  });

  it("ON: between drafts equal on every instrument, the one that uses the place and opens unlike past books wins", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const generic = draft(1, even, past[0]!);
    const placed = draft(2, even, "The harbour lay below the chapel, its slate roofs wet, and gulls wheeled over it.");
    const chosen = chooseDraft([generic, placed], { opening: { nouns, pastOpenings: past } });
    expect(chosen?.draft.attempt).toBe(2);
    expect(chosen?.opening?.coverage).toBe(4);
  });

  it("without an opening choice (any segment but chapter 1's), nothing changes", () => {
    process.env.PROSE_V2_SELECTOR_RANKS = "1";
    const a = draft(1, even, "first draft words here");
    const b = draft(2, even, "second draft words here");
    const chosen = chooseDraft([a, b]);
    expect(chosen?.opening).toBeUndefined();
  });
});
