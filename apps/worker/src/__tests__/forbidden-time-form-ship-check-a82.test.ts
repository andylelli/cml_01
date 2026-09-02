/**
 * A_82 §P-robust — the ch6 "half-past nine" locked-fact miss.
 *
 * MEASURED on run mystery-1788369981295 (external read 84/100): chapter 6 stated the pocket watch
 * "stalled at the edge of half-past nine" (9:30) against its locked value "twenty-five minutes past
 * nine" (9:25). The prompt's own FORBIDDEN alternatives block already lists "half past nine" as
 * forbidden for that value — nothing checked whether the shipped chapter obeyed.
 *
 * This case also has THREE locked clock values sharing the hour (9:10 false hour hand / 9:15 honest
 * minute hand / 9:25 true pocket-watch time — A_82 §14.4's most sophisticated mechanism to date), and
 * `getForbiddenTimeForms("twenty-five minutes past nine")` includes "quarter past nine" — the
 * LEGITIMATE, separately-locked minute-hand value. An unfiltered checker would warn on the exact case
 * shape this project most wants to encourage. Both directions are pinned here.
 */

import { describe, expect, it } from "vitest";

import { checkForbiddenTimeFormsShipped } from "../jobs/agents/agent9-run.js";

const THREE_CLOCK_FACTS = [
  { id: "clock_hour_hand_position", value: "ten minutes past nine", description: "the false hour-hand reading" },
  { id: "clock_minute_hand_position", value: "quarter past nine", description: "the honest minute hand" },
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
});
