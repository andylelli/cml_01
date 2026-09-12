import { afterAll, beforeAll, describe, expect, it } from "vitest";

import {
  dialWindowContains,
  planAlibiBranches,
  planCulpritAlibiSpan,
  renderDialDigits,
  renderPlannedCulpritAlibi,
  selectDeceptionPair,
} from "../alibi-plan.js";
import { alibiSpanToWindow, checkCaseTimelineDeception, parseTimeWindow } from "../timeline-deception.js";

/**
 * A_90 Move 2 — the culprit's alibi window is computed from the two death times.
 *
 * The invariants are the ones `checkCaseTimelineDeception` enforces: the staged time inside the
 * window, the real time outside it. The planner must hold both for every pair of times it accepts,
 * and the post-generation render must keep a coherent window and rewrite only a broken one.
 */

const FLAGS = ["AGENT3_TIMELINE_WINDOW_VOCABULARY", "AGENT3_ALIBI_UNREADABLE_GATE"] as const;
const saved: Record<string, string | undefined> = {};
beforeAll(() => {
  for (const f of FLAGS) {
    saved[f] = process.env[f];
    process.env[f] = "true";
  }
});
afterAll(() => {
  for (const f of FLAGS) {
    if (saved[f] === undefined) delete process.env[f];
    else process.env[f] = saved[f];
  }
});

describe("planCulpritAlibiSpan — both invariants over every five-minute pair on the dial", () => {
  it("contains the staged time, excludes the real one, and never wraps", () => {
    let pairs = 0;
    let ok = 0;
    let nulls = 0;
    for (let a = 0; a < 720; a += 5) {
      for (let r = 0; r < 720; r += 5) {
        if (a === r) continue;
        pairs += 1;
        const span = planCulpritAlibiSpan(a, r);
        if (!span) {
          nulls += 1;
          continue;
        }
        const [start, end] = alibiSpanToWindow(span);
        expect(end).toBeGreaterThanOrEqual(start);
        if (dialWindowContains(start, end, a) && !dialWindowContains(start, end, r)) ok += 1;
      }
    }
    expect(pairs).toBe(20592);
    expect(ok + nulls).toBe(pairs);
    // Only the dial's twelve can leave no room: measured 2 of 20,592.
    expect(nulls).toBeLessThanOrEqual(2);
  });

  it("is deterministic and keeps the boundary nearest the real time five minutes clear", () => {
    // The 82/100 book: staged four o'clock, real a quarter past four.
    const span = planCulpritAlibiSpan(240, 255)!;
    expect(span).toEqual(planCulpritAlibiSpan(240, 255));
    const [start, end] = alibiSpanToWindow(span);
    expect(start % 5).toBe(0);
    expect(end).toBeLessThanOrEqual(250);
    expect(dialWindowContains(start, end, 240)).toBe(true);
    expect(dialWindowContains(start, end, 255)).toBe(false);
  });

  it("puts the staged time at the edge when the real time is closer than the gap allows", () => {
    const span = planCulpritAlibiSpan(253, 256)!;
    const [start, end] = alibiSpanToWindow(span);
    expect(end).toBe(253);
    expect(start).toBeLessThan(253);
  });

  it("refuses identical times — that is `times_identical`, a different defect", () => {
    expect(planCulpritAlibiSpan(240, 240)).toBeNull();
  });
});

describe("planAlibiBranches — one computed window per assignment the model may choose", () => {
  const twoClocks = [
    { id: "displayed_time", value: "ten minutes past eleven" },
    { id: "true_time", value: "twenty minutes to eleven" },
    { id: "clock_shift", value: "thirty minutes", derivedFrom: ["displayed_time", "true_time"] },
  ];

  it("two locked clocks give two branches, each holding both invariants for its own assignment", () => {
    const branches = planAlibiBranches(twoClocks);
    expect(branches).toHaveLength(2);
    for (const b of branches) {
      const window = parseTimeWindow(b.window)!;
      expect(window).not.toBeNull();
      const [start, end] = window;
      const [apparent, actual] = [b.apparentRaw, b.actualRaw].map((raw) => parseTimeWindow(`${raw} to ${raw}`)![0]);
      expect(dialWindowContains(start, end, apparent)).toBe(true);
      expect(dialWindowContains(start, end, actual)).toBe(false);
    }
    expect(new Set(branches.map((b) => b.apparentId))).toEqual(new Set(["displayed_time", "true_time"]));
  });

  it("one locked clock and one duration give four — the other value is the anchor plus or minus it", () => {
    const branches = planAlibiBranches([
      { id: "chime_delay_duration", value: "twenty minutes" },
      { id: "false_chime_time", value: "quarter to eight" },
    ]);
    expect(branches).toHaveLength(4);
    expect(branches.map((b) => `${b.apparentRaw}/${b.actualRaw}`)).toEqual(
      expect.arrayContaining(["quarter to eight/8:05", "quarter to eight/7:25", "8:05/quarter to eight", "7:25/quarter to eight"]),
    );
  });

  it("the 2026-09-12 device — one clock, three durations — is not this planner's shape", () => {
    expect(
      planAlibiBranches([
        { id: "silent_intermission_duration", value: "seven minutes" },
        { id: "last_pose_hold", value: "three minutes" },
        { id: "music_restart_time", value: "twenty minutes past four" },
        { id: "murder_window_interval", value: "ten minutes" },
      ]),
    ).toEqual([]);
  });

  describe("run 81042's device — three locked clocks, one derived interval (AGENT3_DECEPTION_PAIR)", () => {
    const device = [
      { id: "clock_chime_actual_time", value: "twenty-five minutes past three" },
      { id: "clock_chime_displayed_time", value: "a quarter to four" },
      { id: "victim_watch_stopped_time", value: "ten minutes past three" },
      { id: "clock_chime_advance_interval", value: "twenty minutes", derivedFrom: ["clock_chime_displayed_time", "clock_chime_actual_time"] },
    ];
    const withFlag = <T>(value: string | undefined, fn: () => T): T => {
      const saved = process.env.AGENT3_DECEPTION_PAIR;
      if (value === undefined) delete process.env.AGENT3_DECEPTION_PAIR;
      else process.env.AGENT3_DECEPTION_PAIR = value;
      try {
        return fn();
      } finally {
        if (saved === undefined) delete process.env.AGENT3_DECEPTION_PAIR;
        else process.env.AGENT3_DECEPTION_PAIR = saved;
      }
    };

    it("the pair is the two clocks the interval declares itself derived from", () => {
      const pair = selectDeceptionPair(device)!;
      expect(pair).not.toBeNull();
      expect(pair.clocks.map((c) => c.id).sort()).toEqual(["clock_chime_actual_time", "clock_chime_displayed_time"]);
      expect(pair.interval.minutes).toBe(20);
      expect(selectDeceptionPair(device.slice(0, 3))).toBeNull();
    });

    it("OFF: three clocks plan nothing — the shape that left run 81042 without a window", () => {
      expect(withFlag(undefined, () => planAlibiBranches(device))).toEqual([]);
    });

    it("ON: two branches over the declared pair; the stopped watch is evidence, not a candidate", () => {
      const branches = withFlag("true", () => planAlibiBranches(device));
      expect(branches).toHaveLength(2);
      expect(new Set(branches.map((b) => b.apparentId))).toEqual(new Set(["clock_chime_actual_time", "clock_chime_displayed_time"]));
      for (const b of branches) {
        const [start, end] = parseTimeWindow(b.window)!;
        const apparent = parseTimeWindow(`${b.apparentRaw} to ${b.apparentRaw}`)![0];
        const actual = parseTimeWindow(`${b.actualRaw} to ${b.actualRaw}`)![0];
        expect(dialWindowContains(start, end, apparent)).toBe(true);
        expect(dialWindowContains(start, end, actual)).toBe(false);
      }
    });
  });

  it("renders digits on the twelve-hour dial", () => {
    expect(renderDialDigits(0)).toBe("12:00");
    expect(renderDialDigits(253)).toBe("4:13");
    expect(renderDialDigits(715)).toBe("11:55");
  });
});

describe("renderPlannedCulpritAlibi — keep a coherent window, render a broken one", () => {
  const shipCase = (culpritWindow: string) => ({
    CASE: {
      culpability: { culprits: ["Gwendolyn Vance"] },
      hidden_model: { mechanism: { apparent_time_of_death: "four o'clock", actual_time_of_death: "a quarter past four" } },
      cast: [
        { name: "Gwendolyn Vance", alibi_window: culpritWindow },
        { name: "Harriet Kestrel", alibi_window: "3:55 to 4:10 in the rehearsal room" },
      ],
    },
  });

  it("leaves a window that already satisfies both invariants untouched", () => {
    const cml = shipCase("3:55 to 4:10 in the rehearsal room");
    const snapshot = JSON.stringify(cml);
    expect(renderPlannedCulpritAlibi(cml)).toEqual([]);
    expect(JSON.stringify(cml)).toBe(snapshot);
  });

  it("renders a window that covers the real time, keeps the location, and clears the validator", () => {
    const cml = shipCase("3:55 to 4:20 in the rehearsal room");
    expect(checkCaseTimelineDeception(cml).map((v) => v.code)).toEqual(["actual_covered"]);
    const changes = renderPlannedCulpritAlibi(cml);
    expect(changes).toHaveLength(1);
    expect(changes[0]!.reason).toBe("actual_covered");
    expect(changes[0]!.after).toContain("the rehearsal room");
    expect(cml.CASE.cast[0]!.alibi_window).toBe(changes[0]!.after);
    expect(checkCaseTimelineDeception(cml)).toEqual([]);
    // The innocent's window is not this function's business.
    expect(cml.CASE.cast[1]!.alibi_window).toBe("3:55 to 4:10 in the rehearsal room");
  });

  it("renders an unreadable window from the numbers alone", () => {
    const cml = shipCase("N/A");
    expect(checkCaseTimelineDeception(cml).map((v) => v.code)).toEqual(["culprit_alibi_unreadable"]);
    const changes = renderPlannedCulpritAlibi(cml);
    expect(changes).toHaveLength(1);
    expect(changes[0]!.reason).toBe("unreadable");
    expect(checkCaseTimelineDeception(cml)).toEqual([]);
  });

  it("does nothing without both death times or without a culprit", () => {
    const noActual = shipCase("N/A");
    noActual.CASE.hidden_model.mechanism.actual_time_of_death = "";
    expect(renderPlannedCulpritAlibi(noActual)).toEqual([]);
    const noCulprit = shipCase("N/A");
    noCulprit.CASE.culpability.culprits = [];
    expect(renderPlannedCulpritAlibi(noCulprit)).toEqual([]);
  });
});
