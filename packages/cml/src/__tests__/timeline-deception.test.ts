/**
 * A_71 — directional coherence for false-time concealments.
 *
 * MEASURED failure (external review of story_20260731-1750, its headline defect): the clock was
 * forced to 9:10 while the true death was 10:15, and the culprit's unaccounted gap was around nine —
 * so the staged time landed inside his OWN gap and incriminated him. Nothing in the pipeline could
 * notice, because no field held either time.
 */
import { describe, expect, it } from "vitest";
import { checkTimelineDeception, parseClockTime, parseTimeWindow } from "../timeline-deception.js";

describe("parseClockTime", () => {
  it("parses digital times", () => {
    expect(parseClockTime("9:10")).toBe(9 * 60 + 10);
    expect(parseClockTime("10:15")).toBe(10 * 60 + 15);
  });

  it("parses 'past' forms as prose writes them", () => {
    expect(parseClockTime("ten minutes past nine")).toBe(9 * 60 + 10);
    expect(parseClockTime("a quarter past ten")).toBe(10 * 60 + 15);
    expect(parseClockTime("half past eight")).toBe(8 * 60 + 30);
  });

  it("parses 'to' forms", () => {
    expect(parseClockTime("a quarter to nine")).toBe(8 * 60 + 45);
    expect(parseClockTime("ten minutes to ten")).toBe(9 * 60 + 50);
  });

  it("parses bare hours", () => {
    expect(parseClockTime("nine o'clock")).toBe(9 * 60);
  });

  it("returns null rather than guessing", () => {
    expect(parseClockTime("")).toBeNull();
    expect(parseClockTime(undefined)).toBeNull();
    expect(parseClockTime("sometime that evening")).toBeNull();
    expect(parseClockTime("9:75")).toBeNull();
  });

  it("normalises 12-hour equivalents onto one dial", () => {
    expect(parseClockTime("10:15")).toBe(parseClockTime("22:15"));
  });
});

describe("parseTimeWindow", () => {
  it("parses a span with trailing location prose", () => {
    expect(parseTimeWindow("9:00 to 9:45 in the bar")).toEqual([540, 585]);
  });

  it("parses worded spans and dashes", () => {
    expect(parseTimeWindow("half past eight until a quarter to nine")).toEqual([510, 525]);
    expect(parseTimeWindow("9:00 - 9:30")).toEqual([540, 570]);
  });

  it("returns null for a vague part of day", () => {
    expect(parseTimeWindow("evening")).toBeNull();
  });
});

describe("checkTimelineDeception", () => {
  it("flags the shipped story's backwards timeline", () => {
    const violations = checkTimelineDeception({
      apparentTime: "ten minutes past nine",
      actualTime: "a quarter past ten",
      culpritAlibiWindows: ["10:00 to 10:30 in the bar"],
    });
    // Staged 9:10 is outside the culprit's covered span AND the real 10:15 is inside it — both halves
    // of the invariant broken, which is precisely why the reveal read as incoherent.
    expect(violations.map((v) => v.code).sort()).toEqual(["actual_covered", "apparent_not_covered"]);
  });

  it("passes a correctly-directed deception", () => {
    // Killed at 9:10 in a gap he cannot account for; clock staged to 10:15 while he was demonstrably
    // in the bar. The staged time exonerates; the real time exposes.
    expect(
      checkTimelineDeception({
        apparentTime: "a quarter past ten",
        actualTime: "ten minutes past nine",
        culpritAlibiWindows: ["10:00 to 10:30 in the bar"],
      }),
    ).toEqual([]);
  });

  it("flags a deception that hides nothing", () => {
    expect(
      checkTimelineDeception({ apparentTime: "9:10", actualTime: "9:10", culpritAlibiWindows: ["9:00 to 9:30"] }).map(
        (v) => v.code,
      ),
    ).toEqual(["times_identical"]);
  });

  it("never manufactures a failure from missing or vague data", () => {
    expect(checkTimelineDeception({})).toEqual([]);
    expect(checkTimelineDeception({ apparentTime: "9:10" })).toEqual([]);
    expect(checkTimelineDeception({ apparentTime: "9:10", actualTime: "10:15" })).toEqual([]);
    expect(
      checkTimelineDeception({ apparentTime: "9:10", actualTime: "10:15", culpritAlibiWindows: ["evening"] }),
    ).toEqual([]);
  });

  it("handles a window that wraps midnight", () => {
    expect(
      checkTimelineDeception({
        apparentTime: "11:50",
        actualTime: "10:15",
        culpritAlibiWindows: ["11:40 to 12:20"],
      }),
    ).toEqual([]);
  });

  it("accepts any one of several culprit windows covering the staged time", () => {
    expect(
      checkTimelineDeception({
        apparentTime: "8:15",
        actualTime: "10:15",
        culpritAlibiWindows: ["8:00 to 8:30 in the lounge", "11:00 to 11:30 on the terrace"],
      }),
    ).toEqual([]);
  });
});

/**
 * Regression: the bare-hour branch originally matched any number word in ordinary prose, so
 * "one of the guests" parsed as 1:00 and parseTimeWindow fabricated [1:00, 2:00] from a sentence
 * containing no time. alibi_window is free text, so that would have produced spurious violations.
 */
describe("parseClockTime — must not read times out of ordinary prose", () => {
  const NOT_TIMES = [
    "one of the guests",
    "two others in the lounge",
    "with six people present",
    "the nine survivors",
    "she was one of them",
    "a party of four",
  ];

  it("returns null for prose that merely contains a number word", () => {
    for (const phrase of NOT_TIMES) expect(parseClockTime(phrase)).toBeNull();
  });

  it("still accepts hours that commit to being a time", () => {
    expect(parseClockTime("nine o'clock")).toBe(540);
    expect(parseClockTime("at nine")).toBe(540);
    expect(parseClockTime("until ten")).toBe(600);
    expect(parseClockTime("nine")).toBe(540); // bare segment, as a split window yields
    expect(parseClockTime("nine pm")).toBe(540);
  });

  it("no longer fabricates a window from prose", () => {
    expect(parseTimeWindow("spoke to one of the guests through two doors")).toBeNull();
  });

  it("still parses a worded bare-hour window", () => {
    expect(parseTimeWindow("nine to ten")).toEqual([540, 600]);
  });
});
