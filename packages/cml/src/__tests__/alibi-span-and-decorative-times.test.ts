/**
 * T2 (the alibi span, structured at birth) and T3 (the time claims that prove nothing).
 *
 * Both come out of run 89022, which scored 85/100 with its deception arithmetically broken and the
 * only check that would have caught it silent because a comma made the culprit's window unreadable.
 *
 *   culprit Kenneth Gaunt, alibi 12:00–3:00
 *   actual death   3:03   outside — correct, he could have done it
 *   apparent death 3:20   ALSO outside — the fake INCRIMINATES him
 *
 * The fixtures below use that case's real values.
 */

import { describe, expect, it } from "vitest";

import {
  alibiSpanDisagreesWithProse,
  alibiSpanFromWindow,
  alibiSpanToWindow,
  isValidAlibiSpan,
  renderAlibiWindow,
} from "../alibi-span.js";
import { findDecorativeTimeFacts, summariseDecorativeTimes } from "../decorative-times.js";
import { checkCaseTimelineDeception } from "../timeline-deception.js";

const M = (h: number, m: number) => (h % 12) * 60 + m;

describe("T2 — a structured span needs no parser", () => {
  it("converts to the dial pair the check works in", () => {
    expect(alibiSpanToWindow({ startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 }))
      .toEqual([M(12, 0), M(3, 0)]);
  });

  it("rejects a malformed span rather than half-reading it", () => {
    expect(isValidAlibiSpan({ startHour: 12, startMinute: 0, endHour: 15 })).toBe(false);
    expect(isValidAlibiSpan({ startHour: 12, startMinute: 60, endHour: 15, endMinute: 0 })).toBe(false);
    expect(isValidAlibiSpan({ startHour: 25, startMinute: 0, endHour: 15, endMinute: 0 })).toBe(false);
    expect(isValidAlibiSpan(null)).toBe(false);
    expect(isValidAlibiSpan("noon to three")).toBe(false);
  });

  it("migrates run 89022's real window, comma and all", () => {
    const span = alibiSpanFromWindow("twelve to three, at the village green");
    expect(span).toMatchObject({ startHour: 0, startMinute: 0, endHour: 3, endMinute: 0 });
    expect(span!.location).toContain("village green");
  });

  it("returns null for a window that is genuinely not a range — it does not invent one", () => {
    // "Before 9:15" has one endpoint. T4: that is a case-authoring problem, not a parsing one, and
    // manufacturing a span here would hide it.
    expect(alibiSpanFromWindow("Before 9:15 in the dining room")).toBeNull();
    expect(alibiSpanFromWindow("all day, village green and his cottage")).toBeNull();
    expect(alibiSpanFromWindow("evening")).toBeNull();
  });

  it("renders words from the number, so the two are one function", () => {
    expect(renderAlibiWindow({ startHour: 14, startMinute: 15, endHour: 15, endMinute: 0, location: "the library" }))
      .toBe("a quarter past two to three o'clock in the library");
    expect(renderAlibiWindow({ startHour: 12, startMinute: 30, endHour: 16, endMinute: 0 }))
      .toBe("half past twelve to four o'clock");
  });

  it("round-trips: render a span, read it back, get the same dial pair", () => {
    for (const minute of [0, 5, 15, 20, 30, 45, 50]) {
      const span = { startHour: 2, startMinute: minute, endHour: 5, endMinute: 0 };
      const back = alibiSpanFromWindow(renderAlibiWindow(span));
      expect(back, `minute ${minute}`).not.toBeNull();
      expect(alibiSpanToWindow(back!), `minute ${minute}`).toEqual(alibiSpanToWindow(span));
    }
  });

  it("catches drift between the span and the prose — the defect this project keeps re-meeting", () => {
    const span = { startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 };
    expect(alibiSpanDisagreesWithProse(span, "twelve to three, at the village green")).toBeNull();

    const drift = alibiSpanDisagreesWithProse(span, "two o'clock to four o'clock in the hall");
    expect(drift).not.toBeNull();
    expect(drift!.spanSays).toEqual([M(12, 0), M(3, 0)]);
    expect(drift!.proseSays).toEqual([M(2, 0), M(4, 0)]);
  });

  it("does not report drift when the prose is unreadable — that is the other check's job", () => {
    // Double-counting one defect as two would inflate any rate measured off these codes.
    expect(alibiSpanDisagreesWithProse({ startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 }, "evening"))
      .toBeNull();
  });
});

describe("T2 — the span beats the parser at the gate", () => {
  const caseWith = (member: Record<string, unknown>) => ({
    cast: [{ name: "Kenneth Gaunt", ...member }],
    culpability: { culprits: ["Kenneth Gaunt"] },
    hidden_model: {
      mechanism: { apparent_time_of_death: "twenty past three", actual_time_of_death: "three minutes past three" },
    },
  });

  it("catches run 89022's broken deception from the span alone, with NO window at all", () => {
    // The whole point: no prose, no vocabulary, no silence.
    const codes = checkCaseTimelineDeception(
      caseWith({ alibi_span: { startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 } }),
    ).map((v) => v.code);
    expect(codes).toContain("apparent_not_covered");
  });

  it("uses the span even when the prose window is unreadable", () => {
    // Before spans this case was silent. The window is the exact string that shipped.
    const codes = checkCaseTimelineDeception(
      caseWith({
        alibi_window: "Before 9:15 in the dining room",
        alibi_span: { startHour: 12, startMinute: 0, endHour: 15, endMinute: 0 },
      }),
    ).map((v) => v.code);
    expect(codes).toContain("apparent_not_covered");
    expect(codes).not.toContain("culprit_alibi_unreadable");
  });

  it("falls back to the prose when there is no span, so old cases still work", () => {
    process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY = "true";
    try {
      const codes = checkCaseTimelineDeception(
        caseWith({ alibi_window: "twelve to three, at the village green" }),
      ).map((v) => v.code);
      expect(codes).toContain("apparent_not_covered");
    } finally {
      delete process.env.AGENT3_TIMELINE_WINDOW_VOCABULARY;
    }
  });
});

describe("T3 — locked time facts the case never reasons from", () => {
  const CASE = {
    inference_path: { steps: [{ detail: "the bell chime at quarter past three fixes the arrival" }] },
    discriminating_test: { design: "compare the signet ring against the festival arrival time" },
  };
  const REGISTRY = [
    { id: "festival_arrival_time", value: "ten minutes past three" },
    { id: "bell_chime_time", value: "quarter past three" },
    { id: "festival_departure_time", value: "twenty minutes past four" },
    { id: "chime_to_departure_interval", value: "sixty-five minutes" },
    { id: "murder_weapon", value: "hunting knife" },
  ];

  it("finds exactly the two run 89022 never used", () => {
    const ids = findDecorativeTimeFacts(CASE, REGISTRY).map((d) => d.id);
    expect(ids).toEqual(["festival_departure_time", "chime_to_departure_interval"]);
  });

  it("ignores facts that are not time-shaped", () => {
    expect(findDecorativeTimeFacts(CASE, REGISTRY).map((d) => d.id)).not.toContain("murder_weapon");
  });

  it("counts a fact as used when the inference names its VALUE or its ID", () => {
    // Generous matching on purpose: this must UNDER-report. A fact it calls decorative is one the
    // reasoning mentions in no form at all.
    expect(findDecorativeTimeFacts(
      { inference_path: { steps: [{ d: "festival departure time mattered" }] } },
      [{ id: "festival_departure_time", value: "twenty minutes past four" }],
    )).toEqual([]);
    expect(findDecorativeTimeFacts(
      { inference_path: { steps: [{ d: "he left at twenty minutes past four" }] } },
      [{ id: "festival_departure_time", value: "twenty minutes past four" }],
    )).toEqual([]);
  });

  it("says nothing when there is no inference path to judge against", () => {
    expect(findDecorativeTimeFacts({}, REGISTRY)).toEqual([]);
    expect(findDecorativeTimeFacts(CASE, [])).toEqual([]);
  });

  it("the summary names the facts and states that it is MEASURE only", () => {
    const line = summariseDecorativeTimes(CASE, REGISTRY);
    expect(line).toContain("chime_to_departure_interval");
    expect(line).toContain("MEASURE only");
    expect(summariseDecorativeTimes(CASE, [{ id: "murder_weapon", value: "knife" }])).toBe("");
  });
});
