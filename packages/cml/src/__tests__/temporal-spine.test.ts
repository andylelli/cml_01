/**
 * THE TEMPORAL SPINE — Phase 0. See the module header for the three measured failures it answers.
 *
 * BASELINE ESTABLISHED BEFORE ANY WIRING (`scripts/temporal-spine-baseline.mjs`, 44 archived runs,
 * paired by projectId):
 *   - 25 of 44 runs declare a `derivedFrom` at all; of those, **11 (44%) carry a derivation that
 *     does not close** — 3 fail outright, 2 are underspecified, 6 are in a shape X38 cannot attempt.
 *   - 18 of 128 time-shaped values carry a day/daypart qualifier, and `parseClockTime` reads every
 *     one of them 12 hours out in absolute terms.
 *   - BUT only **1 of 36** runs actually MIXES frames, and the dial-relative comparison cancels the
 *     error whenever every time shares a frame. So the qualifier defect is real, rare, and was
 *     measured to bite exactly the run that prompted this work. That caveat demoted this module's
 *     most dramatic-looking statistic and is recorded here so it is not quietly re-inflated later.
 *
 * TWO BUGS WERE FOUND BY RUNNING THIS, NOT BY READING IT, and both are pinned below.
 */

import { describe, expect, it } from "vitest";

import {
  buildTemporalSpine,
  parseDurationValue,
  parseTemporalValue,
  renderClockWords,
} from "../temporal-spine.js";

describe("parseTemporalValue — keeps what parseClockTime drops", () => {
  it("reads the day offset and daypart of the real 76/100 value", () => {
    const r = parseTemporalValue("a quarter to six on the evening prior")!;
    expect(r.dayOffset).toBe(-1);
    expect(r.meridiem).toBe("pm");
    expect(r.minutes).toBe(17 * 60 + 45);
    expect(r.qualifier).toBe("on the evening prior");
  });

  it("BUG 1: the day phrase is stripped before the daypart is sought", () => {
    // "on the evening prior" CONTAINS "evening". Running both searches over the same text produced
    // the nonsense qualifier "on the evening prior evening" and set the meridiem by accident.
    const r = parseTemporalValue("a quarter to six on the evening prior")!;
    expect(r.qualifier).not.toContain("prior evening");
    expect(r.qualifier!.match(/evening/g)).toHaveLength(1);
  });

  it("reports meridiem 'unknown' rather than guessing when the case never states one", () => {
    // This is the point of the module: an underspecified case is a finding, not a default.
    const r = parseTemporalValue("twenty minutes past three on the murder day")!;
    expect(r.dayOffset).toBe(0);
    expect(r.meridiem).toBe("unknown");
    expect(r.minutes).toBe(200);
  });

  it("does not read a duration as an instant, or an instant as a duration", () => {
    expect(parseTemporalValue("one hour and fifty-five minutes")).toBeNull();
    expect(parseDurationValue("one hour and fifty-five minutes")).toBe(115);
    expect(parseDurationValue("twenty minutes past three")).toBeNull();
    expect(parseDurationValue("twenty minutes")).toBe(20);
  });

  it("returns null for a value with no clock phrase at all", () => {
    expect(parseTemporalValue("thirty-four inches")).toBeNull();
    expect(parseTemporalValue("")).toBeNull();
    expect(parseTemporalValue(undefined)).toBeNull();
  });
});

describe("renderClockWords — the words come from the number", () => {
  it("renders the canonical Golden Age forms", () => {
    expect(renderClockWords(0)).toBe("midnight");
    expect(renderClockWords(720)).toBe("noon");
    expect(renderClockWords(9 * 60)).toBe("nine o'clock");
    expect(renderClockWords(9 * 60 + 15)).toBe("a quarter past nine");
    expect(renderClockWords(9 * 60 + 30)).toBe("half past nine");
    expect(renderClockWords(9 * 60 + 45)).toBe("a quarter to ten");
    expect(renderClockWords(9 * 60 + 20)).toBe("twenty minutes past nine");
    expect(renderClockWords(9 * 60 + 40)).toBe("twenty minutes to ten");
  });

  it("BUG 2: every daypart rendering reads back as the SAME absolute minute", () => {
    // Rendering 03:20 as "at night" and reading it back gave 15:20 — a silent 12-hour error in the
    // one module built to prevent exactly that. Caught by this round-trip, not by reading the list.
    for (let m = 0; m < 1440; m += 5) {
      const words = renderClockWords(m, { daypart: true });
      const back = parseTemporalValue(words);
      expect(back, `no read-back for ${m} -> "${words}"`).not.toBeNull();
      expect(back!.minutes, `round-trip failed: ${m} -> "${words}"`).toBe(m);
    }
  });

  it("the bare form is 12-hour and therefore ambiguous — which is why daypart exists", () => {
    expect(renderClockWords(345)).toBe(renderClockWords(345 + 720));
    expect(renderClockWords(345, { daypart: true })).not.toBe(renderClockWords(1065, { daypart: true }));
  });
});

describe("buildTemporalSpine — all the arithmetic shapes, not just one", () => {
  it("SHAPE 1 closes: duration derived from two instants", () => {
    const spine = buildTemporalSpine([
      { id: "t_start", value: "a quarter past nine in the evening" },
      { id: "t_end", value: "twenty minutes to ten in the evening" },
      { id: "gap", value: "twenty-five minutes", derivedFrom: ["t_start", "t_end"] },
    ]);
    expect(spine.findings).toHaveLength(1);
    expect(spine.findings[0].status).toBe("closes");
    expect(spine.findings[0].shape).toBe("duration_from_two_instants");
  });

  it("SHAPE 2 closes: instant derived from an instant and a duration — the shape X38 cannot read", () => {
    const spine = buildTemporalSpine([
      { id: "base", value: "nine o'clock in the evening" },
      { id: "delay", value: "twenty minutes" },
      { id: "later", value: "twenty minutes past nine in the evening", derivedFrom: ["base", "delay"] },
    ]);
    expect(spine.findings).toHaveLength(1);
    expect(spine.findings[0].status).toBe("closes");
    expect(spine.findings[0].shape).toBe("instant_from_instant_and_duration");
  });

  it("catches the real 76/100 case, which X38 passed over in silence", () => {
    const spine = buildTemporalSpine([
      { id: "call_sheet_date", value: "a quarter to six on the evening prior" },
      {
        id: "actual_call_sheet_creation",
        value: "twenty minutes past three on the murder day",
        derivedFrom: ["call_sheet_date", "call_sheet_creation_delay"],
      },
      { id: "call_sheet_creation_delay", value: "one hour and fifty-five minutes" },
    ]);
    const finding = spine.findings.find((f) => f.id === "actual_call_sheet_creation")!;
    expect(finding).toBeDefined();
    expect(finding.shape).toBe("instant_from_instant_and_duration");
    expect(finding.status).not.toBe("closes");
  });

  it("separates instants from durations and ignores non-temporal facts", () => {
    const spine = buildTemporalSpine([
      { id: "clock", value: "half past eight at night" },
      { id: "wait", value: "twenty minutes" },
      { id: "pendulum", value: "thirty-four inches" },
    ]);
    expect(spine.instants.map((i) => i.id)).toEqual(["clock"]);
    expect(spine.durations.map((d) => d.id)).toEqual(["wait"]);
    expect(spine.unreadable).toEqual([]);
  });

  it("a day offset makes the arithmetic cross midnight correctly", () => {
    const spine = buildTemporalSpine([
      { id: "before", value: "eleven o'clock at night on the evening prior" },
      { id: "after", value: "one o'clock in the small hours" },
      { id: "span", value: "two hours", derivedFrom: ["before", "after"] },
    ]);
    expect(spine.findings[0].status).toBe("closes");
  });

  it("reports an unresolvable declaration rather than silently skipping it", () => {
    // X38's failure mode was `continue` with no warning. Silence is what let the defect ship.
    const spine = buildTemporalSpine([
      { id: "a", value: "nine o'clock in the evening" },
      { id: "mystery", value: "thirty-four inches", derivedFrom: ["a", "missing"] },
    ]);
    expect(spine.findings).toHaveLength(1);
    expect(spine.findings[0].status).toBe("unreadable");
  });

  it("handles an empty or malformed registry without throwing", () => {
    expect(() => buildTemporalSpine([])).not.toThrow();
    expect(buildTemporalSpine([]).findings).toEqual([]);
    expect(() => buildTemporalSpine([{}, { id: "x" }, { value: "y" }] as any)).not.toThrow();
  });
});
