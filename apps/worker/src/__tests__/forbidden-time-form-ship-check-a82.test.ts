/**
 * A_82 §P-robust — the "half-past nine" locked-fact miss.
 *
 * MEASURED on run mystery-1788369981295 (external read 84/100): the manuscript states the watch
 * "stalled at the edge of half-past nine" (9:30) against locked values of 9:10 / 9:15 / 9:25. The
 * prompt's own FORBIDDEN alternatives block already lists "half past nine" — nothing checked whether
 * the shipped chapter obeyed.
 *
 * **THE FIRST VERSION OF THIS CHECK DID NOT CATCH ITS OWN DEFECT, AND THIS FILE IS WHY.** Verified
 * against the real artifact after it shipped: on the real inputs it emitted **18 warnings across 9
 * chapters and not one named "half past nine"**. Two bugs, which concealed each other exactly in the
 * fixture below and exactly not in production:
 *
 *   1. The fixture hand-wrote the minute hand as `"quarter past nine"`. **The real artifact says
 *      `"a quarter past nine"`** — with the article. The cross-fact filter compared normalised
 *      strings, the article survived normalisation, so the case's own legitimate value stayed on the
 *      forbidden list and produced 16 of those 18 warnings.
 *   2. `.find()` returned the FIRST forbidden phrase present. The real chapter contains both that
 *      false positive and the true defect, and "quarter past nine" sorts first — so the true defect
 *      was masked in the one chapter that had it.
 *
 * The fixture is now the REAL value, article included. That is the whole lesson: a fixture written
 * to match the generator's output rather than copied from the run will certify the bug it contains.
 * After the fix, the same real inputs give 2 messages, led by ch8 "half past nine" (VALUE DIFFERS).
 *
 * Also pinned: the case has THREE locked clock values sharing an hour (A_82 §14.4's most
 * sophisticated mechanism to date), so the legitimate minute-hand value must never be flagged as a
 * forbidden form of the pocket-watch value.
 *
 * (The chapter is **8**, not the "ch6" that A_82 §14.4 and this file's first header both said — the
 * reviewer's own text says Chapter 8 and the code agrees. A documentation error, not a code defect.)
 */

import { describe, expect, it } from "vitest";

import { checkForbiddenTimeFormsShipped } from "../jobs/agents/agent9-run.js";

/** Copied from the `canary_1788369981294` artifact, articles included. Do not "tidy" these. */
const THREE_CLOCK_FACTS = [
  { id: "clock_hour_hand_position", value: "ten minutes past nine", description: "the false hour-hand reading" },
  { id: "clock_minute_hand_position", value: "a quarter past nine", description: "the honest minute hand" },
  { id: "pocket_watch_time", value: "twenty-five minutes past nine", description: "the true time" },
];

const chapterWith = (text: string) => ({ paragraphs: [text] });

describe("checkForbiddenTimeFormsShipped (A_82 §P-robust)", () => {
  it("catches the actual measured ch6 defect: a non-canonical paraphrase of the pocket-watch time", () => {
    const chapters = [
      chapterWith("A quiet morning in the lobby."),
      chapterWith(
        "the battered pocket watch—its hands stalled at the edge of half-past nine—beside the maintenance log",
      ),
    ];
    const messages = checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS);
    expect(messages.some((m) => m.includes("ch2") && m.includes("half past nine"))).toBe(true);
  });

  it("does NOT flag the honest minute-hand value as a forbidden form of the pocket-watch fact", () => {
    // The exact false positive found before this shipped: "quarter past nine" is the minute hand's
    // OWN locked value, not a wrong paraphrase of the pocket watch.
    const chapters = [
      chapterWith("The minute hand stood at a quarter past nine, but the hour hand lagged behind."),
    ];
    const messages = checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS);
    expect(messages).toEqual([]);
  });

  it("does not flag the canonical value used correctly", () => {
    const chapters = [chapterWith("the pocket watch read twenty-five minutes past nine")];
    expect(checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS)).toEqual([]);
  });

  it("is silent on a single-clock case with no cross-fact ambiguity", () => {
    const single = [{ id: "clock_time", value: "ten minutes past nine", description: "the reading" }];
    const chapters = [chapterWith("the clock read a quarter past nine")]; // wrong value, wrong hour position
    const messages = checkForbiddenTimeFormsShipped(chapters, single);
    expect(messages.some((m) => m.includes("quarter past nine"))).toBe(true);
  });

  it("returns nothing for descriptive (non-time) or non-atomic facts", () => {
    const facts = [{ id: "weather_log", value: "a light drizzle that persisted into the evening", description: "weather" }];
    expect(checkForbiddenTimeFormsShipped([chapterWith("anything")], facts)).toEqual([]);
  });

  // ── the two production bugs, pinned so they cannot come back ────────────────────────────────

  it("BUG 1: the article-carrying locked value does not become its own forbidden form", () => {
    // The real artifact's "a quarter past nine" against a checker that normalised hyphens but not
    // articles. This single assertion is what 16 of the 18 production false positives reduce to.
    const chapters = [chapterWith("The minute hand stood at a quarter past nine, and the hour hand lagged.")];
    expect(checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS)).toEqual([]);
  });

  it("BUG 2: a true defect is still reported when a false-positive phrase shares the chapter", () => {
    // The masking shape, reproduced: one chapter containing BOTH the case's own "a quarter past
    // nine" and the real "half-past nine" defect. `.find()` stopped at the former and reported the
    // wrong thing; `.filter()` reports the real one.
    const chapters = [
      chapterWith(
        "The minute hand stood at a quarter past nine. The battered pocket watch had stalled at the edge of half-past nine.",
      ),
    ];
    const messages = checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS);
    expect(messages.some((m) => m.includes("half past nine"))).toBe(true);
    expect(messages.some((m) => m.includes("quarter past nine"))).toBe(false);
  });

  it("separates a wrong VALUE from a mere rendering difference, and reports the wrong value first", () => {
    const chapters = [
      chapterWith("the hour hand read nine-ten"), // same minute as 9:10, different rendering
      chapterWith("the watch had stalled at half-past nine"), // a genuinely different minute
    ];
    const messages = checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS);
    expect(messages[0]).toContain("VALUE DIFFERS");
    expect(messages[0]).toContain("half past nine");
    expect(messages.some((m) => m.includes("same value, different form") && m.includes("nine ten"))).toBe(true);
  });

  it("reports one line per chapter per offending phrase, not one per contradicted fact", () => {
    // "half past nine" contradicts all three locked values. Before deduping that printed three
    // lines for one defect, and inflated counts are what made the original unreadable as evidence.
    const chapters = [chapterWith("the watch had stalled at the edge of half-past nine")];
    const messages = checkForbiddenTimeFormsShipped(chapters, THREE_CLOCK_FACTS);
    expect(messages.filter((m) => m.includes("half past nine"))).toHaveLength(1);
  });
});
