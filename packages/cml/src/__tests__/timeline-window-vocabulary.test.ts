/**
 * THE CLOCK PARSER'S BLIND SPOTS, PINNED AGAINST THE STRINGS THAT REVEALED THEM.
 *
 * Two defects, found 2026-09-04 by reading the 155 distinct `alibi_window` strings this project has
 * actually written rather than by inventing examples:
 *
 *   1. `parseClockTime("from six thirty")` returned 6:00. The hour-minutes branch is anchored ^...$,
 *      so preposition-led text fell through to the bare-hour branch, which matched "from six" and
 *      threw "thirty" away. A WRONG NUMBER, not a refusal.
 *
 *   2. `parseTimeWindow` could not read 38% of culprit alibi windows, because the window carries the
 *      place as well as the time ("two to three in the lounge") and because "Between six and eight"
 *      uses a separator the alternation does not list. An unreadable window makes
 *      `checkCaseTimelineDeception` return NOTHING - indistinguishable from "the times agree".
 *
 * MEASURED consequence of (2): six SHIPPED books carry a timeline contradiction the gate cannot see -
 * the culprit's own alibi covering the real time of death, or the staged time falling outside it so
 * the fake incriminates them. Each of those six windows appears below verbatim.
 */

import { afterEach, describe, expect, it } from "vitest";

import { checkCaseTimelineDeception, parseClockTime, parseTimeWindow } from "../timeline-deception.js";

const M = (h: number, m: number) => (h % 12) * 60 + m;

describe("parseClockTime reads a leading time-preposition without losing the minutes", () => {
  it.each([
    ["six thirty", M(6, 30)],
    ["from six thirty", M(6, 30)],
    ["at six thirty", M(6, 30)],
    ["until six thirty", M(6, 30)],
    ["from seven fifteen", M(7, 15)],
    ["by seven fifteen", M(7, 15)],
    ["from seven twenty-five", M(7, 25)],
    ["between eight forty-five", M(8, 45)],
  ])("%s", (text, want) => {
    expect(parseClockTime(text)).toBe(want);
  });

  it("REGRESSION: these really did read an hour early, so the cases above are not vacuous", () => {
    // The bare-hour branch produced the hour and dropped the minutes. If someone re-anchors the
    // hour-minutes branch without the preposition group, this is the assertion that fails.
    expect(parseClockTime("from six thirty")).not.toBe(M(6, 0));
    expect(parseClockTime("from seven fifteen")).not.toBe(M(7, 0));
  });

  it("still refuses ordinary prose — the ^...$ guard is untouched", () => {
    expect(parseClockTime("one of the guests")).toBeNull();
    expect(parseClockTime("two others in the lounge")).toBeNull();
  });
});

describe("parseTimeWindow default behaviour is unchanged", () => {
  it.each([
    ["8:10 to 8:30 in the study", M(8, 10), M(8, 30)],
    ["half past eight until a quarter to nine", M(8, 30), M(8, 45)],
  ])("%s", (raw, s, e) => {
    expect(parseTimeWindow(raw)).toEqual([s, e]);
  });

  it("REGRESSION: the six shipped-book windows are STILL unreadable without the option", () => {
    // Non-vacuous guard. If these ever parse by default, the flag stopped being the thing that
    // decides whether a gate can see them, and the FLAG-AUDIT row is then wrong.
    for (const raw of [
      "one forty-five to two fifty in the dining room",
      "ten past ten to eleven in the billiard room",
      "half past ten to eleven at the private dock",
      "nine fifty-five to ten fifteen in the smoking room",
      "eight thirty to nine thirty in maintenance room",
      "Between six and eight in the evening",
    ]) {
      expect(parseTimeWindow(raw), raw).toBeNull();
    }
  });
});

describe("wide vocabulary reads the windows the pipeline actually writes", () => {
  it.each([
    ["one forty-five to two fifty in the dining room", M(1, 45), M(2, 50)],
    ["ten past ten to eleven in the billiard room", M(10, 10), M(11, 0)],
    ["half past ten to eleven at the private dock", M(10, 30), M(11, 0)],
    ["nine fifty-five to ten fifteen in the smoking room", M(9, 55), M(10, 15)],
    ["eight thirty to nine thirty in maintenance room", M(8, 30), M(9, 30)],
    ["Between six and eight in the evening", M(6, 0), M(8, 0)],
    ["two to three in the lounge", M(2, 0), M(3, 0)],
    ["from seven fifteen to eight in the theatre foyer", M(7, 15), M(8, 0)],
  ])("%s", (raw, s, e) => {
    expect(parseTimeWindow(raw, { wide: true })).toEqual([s, e]);
  });

  it("DOES NOT FABRICATE a window from a sentence with no time in it", () => {
    // The documented failure this file already guards against. "and" in the separator list makes it
    // live again unless both halves must parse — so it is asserted, not assumed.
    expect(parseTimeWindow("spoke to one of the guests through two doors", { wide: true })).toBeNull();
    expect(parseTimeWindow("one of the guests and two of the staff", { wide: true })).toBeNull();
    expect(parseTimeWindow("N/A - deceased", { wide: true })).toBeNull();
    expect(parseTimeWindow("Entire investigation period", { wide: true })).toBeNull();
    expect(parseTimeWindow("Time of murder", { wide: true })).toBeNull();
  });

  it("does not change the value of a window it could already read", () => {
    for (const raw of ["8:10 to 8:30 in the study", "9:15 to 9:50 in billiard room", "2:20 to 2:50 PM in the private study"]) {
      expect(parseTimeWindow(raw, { wide: true }), raw).toEqual(parseTimeWindow(raw));
    }
  });
});

describe("the gate reads the flag at CALL time", () => {
  const CASE = {
    cast: [{ name: "Hugo Vane", alibi_window: "eight thirty to nine thirty in maintenance room" }],
    culpability: { culprits: ["Hugo Vane"] },
    hidden_model: {
      mechanism: { apparent_time_of_death: "quarter past nine", actual_time_of_death: "ten minutes past nine" },
    },
  };

  afterEach(() => { delete process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY; });

  it("is blind to the defect with the flag off", () => {
    delete process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY;
    expect(checkCaseTimelineDeception(CASE)).toEqual([]);
  });

  it("sees it with the flag on", () => {
    process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY = "true";
    const codes = checkCaseTimelineDeception(CASE).map((v) => v.code);
    expect(codes).toContain("actual_covered");
  });

  it("responds to a flag set AFTER module load — the ADR-0004 property", () => {
    // Three flags on this project were no-ops because a module const froze before dotenv ran. The
    // import at the top of this file has long since executed; the flag is set now.
    process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY = "1";
    expect(checkCaseTimelineDeception(CASE).length).toBeGreaterThan(0);
    process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY = "0";
    expect(checkCaseTimelineDeception(CASE)).toEqual([]);
  });
});
