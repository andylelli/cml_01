import { describe, it, expect } from "vitest";
import {
  parseDurationMinutes,
  rewriteDurationMinutes,
  spellMinuteCount,
  checkCaseTimeCoherence,
  dialGapMinutes,
  parseClockTime,
} from "../timeline-deception.js";

/**
 * X38-AT-SOURCE — the repair side of the duration vocabulary.
 *
 * MEASURED 2026-08-20 over the 20 archived locked-fact registries in apps/worker/logs. Of the nine
 * devices `checkCaseTimeCoherence` can read by either branch, NINE have arithmetic that does not
 * close. REVIEW_05 §12.11 reported half, having counted cases the gate cannot read as cases it
 * passed — the same mistake REVIEW_14 §12 had just named: "a silent temporal gate still means
 * UNPARSEABLE more often than it means clean".
 *
 * They cluster: six of the ten are wrong by exactly five minutes, four of those the identical shape —
 * two clock values twenty-five minutes apart under a duration that declares twenty. That is not
 * scattered slips; it is a model reaching for a round duration while writing clock values that a
 * quarter-hour idiom pushes five minutes further apart than the number it chose.
 *
 * Every fixture below is a real corpus value, quoted from the archived registry it shipped in.
 */
describe("spellMinuteCount — era word-form, because locked facts are printed verbatim", () => {
  it("writes the numbers the corpus repairs to", () => {
    expect(spellMinuteCount(25)).toBe("twenty-five");
    expect(spellMinuteCount(10)).toBe("ten");
    expect(spellMinuteCount(14)).toBe("fourteen");
    expect(spellMinuteCount(30)).toBe("thirty");
    expect(spellMinuteCount(45)).toBe("forty-five");
    expect(spellMinuteCount(89)).toBe("eighty-nine");
  });

  it("refuses what it cannot write as a duration, rather than guessing", () => {
    expect(spellMinuteCount(0)).toBeNull();
    expect(spellMinuteCount(-5)).toBeNull();
    expect(spellMinuteCount(100)).toBeNull();
    expect(spellMinuteCount(12.5)).toBeNull();
  });
});

describe("rewriteDurationMinutes — restate the number, keep every other word", () => {
  it("restates the corpus durations that shipped wrong", () => {
    // Each pair is (as authored) -> (as the case's two clocks actually stand).
    expect(rewriteDurationMinutes("thirty-five minutes", 25)).toBe("twenty-five minutes"); // 1785860662362
    expect(rewriteDurationMinutes("fourteen minutes", 10)).toBe("ten minutes"); //            1786821276166
    expect(rewriteDurationMinutes("twenty minutes", 25)).toBe("twenty-five minutes"); //      1786998999620
    expect(rewriteDurationMinutes("forty minutes", 45)).toBe("forty-five minutes"); //        1785870981757
    expect(rewriteDurationMinutes("forty-five minutes", 89)).toBe("eighty-nine minutes"); //  1787090659145
  });

  it("keeps the wording around the number — a locked fact is a fragment the prose prints", () => {
    expect(rewriteDurationMinutes("a pause of forty minutes", 25)).toBe("a pause of twenty-five minutes");
    expect(rewriteDurationMinutes("twenty minutes of silence", 25)).toBe("twenty-five minutes of silence");
    expect(rewriteDurationMinutes("the pendulum held for ten minutes", 14)).toBe(
      "the pendulum held for fourteen minutes",
    );
  });

  it("shares ONE tens list with the parser — the round-trip cannot catch a drift", () => {
    // Found by review, 2026-08-20, in this function's first draft. The rewriter kept a tens list
    // ending at "fifty" while the parser's reached "ninety", so "eighty-nine minutes" missed the
    // compound branch, fell through to the bare-word branch, and came back as
    // "eighty-twenty-five minutes" — which parses to 25 and passes the round-trip assertion clean.
    // A garbage locked fact, printed into the prose verbatim, certified by its own check.
    for (const tens of ["twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"]) {
      // The whole compound is replaced, so the result is exactly the target and nothing survives of
      // the original number. A leftover tens word is the drift signature: "eighty-twenty-five".
      expect(rewriteDurationMinutes(`${tens}-one minutes`, 25), `${tens}-one -> 25`).toBe("twenty-five minutes");
      expect(rewriteDurationMinutes(`${tens}-one minutes`, 40), `${tens}-one -> 40`).toBe("forty minutes");
    }
  });

  it("rewrites a hyphenated compound WHOLE — the trap the parser side shipped twice", () => {
    // X61 found "forty-five minutes past one" read as 1:05, because a word boundary matched after
    // the hyphen. The rewriter must replace "forty-five", never the "five" inside it.
    expect(rewriteDurationMinutes("forty-five minutes", 20)).toBe("twenty minutes");
    expect(rewriteDurationMinutes("forty-five minutes", 20)).not.toContain("forty-");
    expect(rewriteDurationMinutes("twenty-five minutes", 40)).toBe("forty minutes");
  });

  it("reads the digit form the parser also accepts, and answers in words", () => {
    // Digits can reach the registry before `wordifyLockedFactValue` has run on every path; the
    // rewriter always emits word-form, because that is what the era rule requires on the page.
    expect(rewriteDurationMinutes("20 minutes", 25)).toBe("twenty-five minutes");
    expect(rewriteDurationMinutes("45 minutes", 30)).toBe("thirty minutes");
  });

  it("returns null rather than a guess when the parser could not read the input", () => {
    expect(rewriteDurationMinutes("a short while", 25)).toBeNull();
    expect(rewriteDurationMinutes("", 25)).toBeNull();
    expect(rewriteDurationMinutes(undefined, 25)).toBeNull();
    // A clock POSITION is not an offset — parseDurationMinutes refuses it, so this must too.
    expect(rewriteDurationMinutes("ten minutes past nine", 25)).toBeNull();
  });

  it("returns null rather than write a duration it cannot spell", () => {
    expect(rewriteDurationMinutes("twenty minutes", 0)).toBeNull();
    expect(rewriteDurationMinutes("twenty minutes", 140)).toBeNull();
  });

  it("round-trips through the parser it shares a vocabulary with — the assertion, not the hope", () => {
    for (const target of [1, 5, 10, 14, 20, 25, 30, 45, 59, 89]) {
      for (const raw of ["twenty minutes", "forty-five minutes", "a pause of ten minutes", "20 minutes"]) {
        const out = rewriteDurationMinutes(raw, target);
        expect(out, raw + " -> " + target).not.toBeNull();
        expect(parseDurationMinutes(out!), raw + " -> " + target).toBe(target);
      }
    }
  });
});

describe("the repaired registry satisfies the detector that reported it", () => {
  // mystery-1786998999620, verbatim: 8:45 and 8:20 are 25 apart, under a duration declaring twenty.
  const broken = [
    { id: "tampering_time", value: "a quarter to nine" },
    { id: "murder_time_displayed", value: "twenty minutes past eight" },
    { id: "backward_shift_duration", value: "twenty minutes" },
  ];

  it("fires before the repair", () => {
    expect(checkCaseTimeCoherence({ lockedFacts: broken }).map((v) => v.code)).toContain(
      "locked_time_arithmetic",
    );
  });

  it("is silent after it, with both clock times untouched", () => {
    const repaired = broken.map((f) =>
      f.id === "backward_shift_duration" ? { ...f, value: rewriteDurationMinutes(f.value, 25)! } : f,
    );
    expect(repaired[2]!.value).toBe("twenty-five minutes");
    expect(repaired[0]!.value).toBe("a quarter to nine");
    expect(repaired[1]!.value).toBe("twenty minutes past eight");
    expect(checkCaseTimeCoherence({ lockedFacts: repaired })).toEqual([]);
  });
});

describe("dialGapMinutes — the interval, not the long way round", () => {
  it("measures a midnight-straddling pair the short way", () => {
    // FOUND BY REVIEW 2026-08-20. Every gap site used a plain subtraction, and parseClockTime is
    // dial-relative (0..719), so 11:50 and 12:10 read as 700 minutes apart instead of twenty.
    expect(dialGapMinutes(parseClockTime("ten minutes to twelve")!, parseClockTime("ten minutes past twelve")!)).toBe(20);
    expect(dialGapMinutes(parseClockTime("a quarter to twelve")!, parseClockTime("a quarter past twelve")!)).toBe(30);
  });

  it("is unchanged for pairs that do not cross twelve — the whole archive", () => {
    expect(dialGapMinutes(parseClockTime("a quarter to nine")!, parseClockTime("twenty minutes past eight")!)).toBe(25);
    expect(dialGapMinutes(parseClockTime("7:15")!, parseClockTime("7:45")!)).toBe(30);
  });

  it("is symmetric and never negative", () => {
    for (const [a, b] of [[10, 710], [710, 10], [0, 360], [360, 0], [5, 5]]) {
      expect(dialGapMinutes(a!, b!)).toBe(dialGapMinutes(b!, a!));
      expect(dialGapMinutes(a!, b!)).toBeGreaterThanOrEqual(0);
      expect(dialGapMinutes(a!, b!)).toBeLessThanOrEqual(360);
    }
  });
});

describe("the detector no longer fires on a coherent late-night device", () => {
  const midnight = [
    { id: "clock_stopped_time", value: "ten minutes to twelve" },
    { id: "chime_recorded_time", value: "ten minutes past twelve" },
    { id: "delay_duration", value: "twenty minutes" },
  ];

  it("is silent on a device whose numbers agree across the boundary", () => {
    expect(checkCaseTimeCoherence({ lockedFacts: midnight })).toEqual([]);
  });

  it("still fires when the same device is genuinely wrong", () => {
    const wrong = midnight.map((f) => (f.id === "delay_duration" ? { ...f, value: "forty minutes" } : f));
    expect(checkCaseTimeCoherence({ lockedFacts: wrong }).map((v) => v.code)).toContain("locked_time_arithmetic");
  });
});

describe("midnight and noon — the prompt's own examples, previously unreadable", () => {
  it("reads the form the Agent 3b prompt lists as CORRECT", () => {
    // agent3b-hard-logic-devices.ts: 'CORRECT: "ten minutes past eleven", "a quarter to three",
    // "twenty past midnight", "half past nine at night"'. The third returned null, so the pipeline
    // was instructing the model to write a time every temporal gate downstream is blind to.
    expect(parseClockTime("twenty past midnight")).toBe(20);
  });

  it("reads both words in both directions", () => {
    expect(parseClockTime("midnight")).toBe(0);
    expect(parseClockTime("noon")).toBe(0); // same DIAL position; this parser is dial-relative
    expect(parseClockTime("half past midnight")).toBe(30);
    expect(parseClockTime("ten minutes to midnight")).toBe(710);
    expect(parseClockTime("a quarter to midnight")).toBe(705);
  });

  it("agrees with the numeral spelling of the same dial position", () => {
    expect(parseClockTime("midnight")).toBe(parseClockTime("twelve o'clock"));
    expect(parseClockTime("twenty past midnight")).toBe(parseClockTime("twenty minutes past twelve"));
  });

  it("changes no reading that did not contain the two new words", () => {
    // The widening adds vocabulary that previously matched nothing, so every prior parse is
    // bit-identical. These are the corpus's most common forms, pinned.
    expect(parseClockTime("a quarter to three")).toBe(2 * 60 + 45);
    expect(parseClockTime("twenty minutes past eight")).toBe(8 * 60 + 20);
    expect(parseClockTime("seven twenty")).toBe(7 * 60 + 20);
    expect(parseClockTime("fourteen minutes past four")).toBe(4 * 60 + 14);
    expect(parseClockTime("6:15")).toBe(6 * 60 + 15);
  });

  it("still refuses a bare hour word with nothing committing it to being a time", () => {
    // The bare-hour branch needs a preposition, an explicit marker, or the whole segment. Without
    // that guard, ordinary prose containing "one" or "nine" would read as a clock.
    expect(parseClockTime("she had noon meetings and one regret")).not.toBe(60);
  });
});
