import { describe, it, expect } from "vitest";
import { parseClockTime, parseDurationMinutes, checkCaseTimeCoherence } from "../timeline-deception.js";

/**
 * X61 (REVIEW_13 §7) — the second clock lives in the MECHANISM, and the parser could not read it.
 *
 * FOUND BY PROBE against the real 08-19 run, 2026-08-19. REVIEW_13 §3 recorded X38 as "intermittent:
 * fired 08-17, not 08-19" and §7 offered "the next two runs both produce coherent device arithmetic"
 * as the test that would demote it. The 08-19 run does NOT produce coherent arithmetic — its device
 * is 89 minutes apart while declaring forty-five. X38 declined for two stacked reasons, and reading
 * the code found only the first of them:
 *
 *   1. the registry locks ONE clock, not two, so the shape gate `clocks.length === 2` is false; and
 *   2. `parseClockTime("fourteen minutes past four")` returned NULL, because the minute vocabulary
 *      was a closed list of six values — so even the mechanism's own anchor was unreadable.
 *
 * (2) is the one that matters beyond this check: every temporal gate downstream reads clock times
 * through this parser, so the case's true time of death was invisible to all of them while the false
 * one read perfectly. The manuscript duly invented a third time, "eight fifty-six", unchallenged.
 */
describe("parseClockTime — a minute count, not a closed list of six (X61)", () => {
  it("reads the 08-19 case's own actual_time_of_death, which used to return null", () => {
    expect(parseClockTime("fourteen minutes past four")).toBe(4 * 60 + 14);
  });

  it("reads the minute values the corpus actually writes", () => {
    expect(parseClockTime("forty-five minutes past one")).toBe(60 + 45);
    expect(parseClockTime("twelve minutes past twelve")).toBe(12);
    expect(parseClockTime("nine minutes past nine")).toBe(9 * 60 + 9);
    expect(parseClockTime("eleven minutes past ten")).toBe(10 * 60 + 11);
    expect(parseClockTime("23 minutes past four")).toBe(4 * 60 + 23);
    expect(parseClockTime("twenty-three minutes to nine")).toBe(8 * 60 + 37);
  });

  it("still reads every shape the six-value list already handled", () => {
    expect(parseClockTime("a quarter past ten")).toBe(10 * 60 + 15);
    expect(parseClockTime("half past eight")).toBe(8 * 60 + 30);
    expect(parseClockTime("ten minutes past nine")).toBe(9 * 60 + 10);
    expect(parseClockTime("a quarter to three")).toBe(2 * 60 + 45);
    expect(parseClockTime("ten past nine")).toBe(9 * 60 + 10);
    expect(parseClockTime("twenty-five minutes past eleven")).toBe(11 * 60 + 25);
    expect(parseClockTime("9:10")).toBe(9 * 60 + 10);
  });

  it("finds the time when ordinary words run up against it — the capture is not greedy past a number", () => {
    // The leftmost match starts at "read"/"showed", which is not a number. Backtracking must reach
    // the real minute word rather than abandoning the string.
    expect(parseClockTime("the clock read forty minutes past seven")).toBe(7 * 60 + 40);
    expect(parseClockTime("the dial showed thirteen minutes past six")).toBe(6 * 60 + 13);
  });

  it("reads a hyphenated compound whole — the bug that shipped before this branch existed", () => {
    // `` matches after a hyphen, so the six-value branch found "five minutes past one" inside
    // "forty-five minutes past one" and answered 1:05. The corpus writes that exact string.
    expect(parseClockTime("forty-five minutes past one")).toBe(60 + 45);
    expect(parseClockTime("forty-five minutes past one")).not.toBe(60 + 5);
    // ...and the same hyphen must not let a compound's tail stand in for the whole.
    expect(parseClockTime("sixty-one minutes past four")).not.toBe(4 * 60 + 1);
  });

  it("declines what is not a count, rather than guessing at it", () => {
    expect(parseClockTime("a few minutes past eleven")).toBeNull();
    expect(parseClockTime("the tenth minute past nine")).toBeNull();
    expect(parseClockTime("sixty-one minutes past four")).toBeNull(); // not a minute of any hour
    expect(parseClockTime("he spoke to one of the guests")).toBeNull();
    expect(parseClockTime("two others waited in the lounge")).toBeNull();
  });

  it("leaves the OFFSET parser alone: a duration is still never a position", () => {
    expect(parseDurationMinutes("fourteen minutes")).toBe(14);
    expect(parseDurationMinutes("forty-five minutes")).toBe(45);
    expect(parseDurationMinutes("fourteen minutes past four")).toBeNull();
    expect(parseClockTime("forty-five minutes")).toBeNull();
  });
});

describe("checkCaseTimeCoherence — the mechanism's anchors when the registry locks one clock (X61)", () => {
  const codes = (v: Array<{ code: string }>) => v.map((x) => x.code);

  /** The real 08-19 registry, verbatim from logs/agent9-checkpoint-mystery-1787090659145.json. */
  const REGISTRY_0819 = [
    { id: "disengagement_duration", value: "forty-five minutes" },
    { id: "false_display_time", value: "a quarter to three" },
    { id: "wire_length", value: "twenty-five feet" },
  ];

  it("flags the 08-19 device: eighty-nine minutes apart, forty-five declared", () => {
    const out = checkCaseTimeCoherence({
      lockedFacts: REGISTRY_0819,
      apparentTime: "a quarter to three",
      actualTime: "fourteen minutes past four",
    });
    expect(codes(out)).toContain("locked_time_arithmetic");
    expect(out.find((v) => v.code === "locked_time_arithmetic")!.message).toMatch(/89 minutes apart/);
  });

  it("silent when the case's own arithmetic agrees", () => {
    const out = checkCaseTimeCoherence({
      lockedFacts: [{ id: "disengagement_duration", value: "forty-five minutes" }, REGISTRY_0819[1]!],
      apparentTime: "a quarter to three",
      actualTime: "half past three",
    });
    expect(codes(out)).not.toContain("locked_time_arithmetic");
  });

  it("does not report one defect twice: the two-clock branch still owns the shapes it can read", () => {
    // The 08-15 device — two locked clocks and one duration, which the primary branch reads.
    const out = checkCaseTimeCoherence({
      lockedFacts: [
        { id: "pendulum_delay_duration", value: "fourteen minutes" },
        { id: "murder_time_displayed", value: "a quarter past seven in the evening" },
        { id: "chime_recorded_time", value: "five minutes past seven in the evening" },
      ],
      apparentTime: "a quarter past eight",
      actualTime: "a quarter to nine",
    });
    expect(codes(out).filter((c) => c === "locked_time_arithmetic")).toHaveLength(1);
    expect(out.find((v) => v.code === "locked_time_arithmetic")!.message).toMatch(/10 minutes apart/);
  });

  it("stays total: no anchors, no duration, or unreadable values yield nothing", () => {
    expect(checkCaseTimeCoherence({ lockedFacts: REGISTRY_0819 })).toEqual([]);
    expect(
      checkCaseTimeCoherence({ lockedFacts: REGISTRY_0819, apparentTime: "later", actualTime: "whenever" }),
    ).toEqual([]);
    expect(
      codes(
        checkCaseTimeCoherence({
          lockedFacts: [REGISTRY_0819[1]!],
          apparentTime: "a quarter to three",
          actualTime: "fourteen minutes past four",
        }),
      ),
    ).toEqual([]); // no duration: nothing declares what the gap should be
  });
});

/**
 * X67 — the SAME trap, one surface form along, found by a paid run.
 *
 * X61 taught `parseClockTime` to read "fourteen minutes past four". Run `mystery-1787167692140`
 * (2026-08-19) then wrote its `actual_time_of_death` as **"seven twenty"** — the spoken HOUR-MINUTES
 * form, with no "past" or "to" to key on — and the parser returned null again, so X38 stayed silent
 * on a device 25 minutes apart declaring twenty.
 *
 * Fourth consecutive run with wrong device arithmetic; third distinct surface form the parser could
 * not read. The lesson is not the branch below: it is that a silent temporal gate still means
 * UNPARSEABLE more often than it means clean.
 */
describe("parseClockTime — the spoken HOUR-MINUTES form (X67)", () => {
  it("reads the 2047 run's own actual_time_of_death", () => {
    expect(parseClockTime("seven twenty")).toBe(7 * 60 + 20);
  });

  it("reads the shapes beside it", () => {
    expect(parseClockTime("eight oh five")).toBe(8 * 60 + 5);
    expect(parseClockTime("seven twenty-five")).toBe(7 * 60 + 25);
    expect(parseClockTime("ten thirty")).toBe(10 * 60 + 30);
  });

  it("accepts it ONLY as the whole segment — two bare numbers are ordinary prose", () => {
    expect(parseClockTime("one two men waited by the door")).toBeNull();
    expect(parseClockTime("he counted seven twenty-pound weights")).toBeNull();
    expect(parseClockTime("seven twenty sixty")).toBeNull();
  });

  it("rejects a minute that is not one", () => {
    expect(parseClockTime("seven ninety")).toBeNull();
    expect(parseClockTime("seven o'clock")).toBe(7 * 60); // the bare-hour branch still owns this
  });

  it("X38 fires on the real 2047 case, which shipped unseen", () => {
    const out = checkCaseTimeCoherence({
      lockedFacts: [
        { id: "murder_time_displayed", value: "a quarter to eight" },
        { id: "chime_delay_duration", value: "twenty minutes" },
        { id: "distance_to_dining_clock", value: "forty feet" },
      ],
      apparentTime: "a quarter to eight",
      actualTime: "seven twenty",
    });
    expect(out.map((v) => v.code)).toContain("locked_time_arithmetic");
    expect(out[0]!.message).toMatch(/25 minutes apart/);
  });
});

/**
 * X46's backtest widened the parser again — measured over the 15 archived runs that carry an anchor
 * pair. Three runs had an anchor the parser could not read, and all three were shapes the corpus
 * actually writes rather than exotica: a trailing daypart, and a curly apostrophe.
 *
 * After: 15 of 15 runs parse BOTH anchors, up from 12. That is what made the corpus-wide X38
 * measurement possible — 7 of 14 checkable cases have device arithmetic that does not work.
 */
describe("parseClockTime — the shapes the corpus actually writes (X46 backtest)", () => {
  it("accepts a trailing daypart", () => {
    expect(parseClockTime("seven twenty in the evening")).toBe(7 * 60 + 20);
    expect(parseClockTime("six fifteen in the evening")).toBe(6 * 60 + 15);
    expect(parseClockTime("two forty PM")).toBe(2 * 60 + 40);
    expect(parseClockTime("two forty pm")).toBe(2 * 60 + 40);
  });

  it("folds the curly apostrophe at the door, so no caller has to", () => {
    expect(parseClockTime("two o’clock")).toBe(2 * 60);
    expect(parseClockTime("two o'clock")).toBe(2 * 60);
  });

  it("the minute token is hyphen-joined only — a space-joined one swallowed the daypart", () => {
    // "forty pm" matched as a two-word minute, the overall match SUCCEEDED with an unparseable
    // minute, and nothing backtracked. Same failure mode as the first counted-branch attempt.
    expect(parseClockTime("two forty pm")).toBe(2 * 60 + 40);
    expect(parseClockTime("seven twenty-five")).toBe(7 * 60 + 25);
  });

  it("still refuses prose", () => {
    expect(parseClockTime("one two men waited")).toBeNull();
    expect(parseClockTime("he counted seven twenty-pound weights")).toBeNull();
    expect(parseClockTime("nine o clock")).toBeNull();
  });
});
