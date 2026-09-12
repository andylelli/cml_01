import { describe, expect, it } from "vitest";
import { checkTemporalClosure } from "../temporal-closure.js";

/**
 * A_89 A1 — can the deception's interval contain the event it conceals?
 *
 * Run 88651's reader did this arithmetic by hand and marked `clues` 5/10 for it. The check is
 * deliberately conservative: a verdict only where the case NAMES an opportunity window. The first
 * design guessed (the longest stated duration must cover the apparent/actual gap) and measured 46 of
 * 49 archived cases "failing" — a wrong invariant, not a broken corpus, since a tampered clock's
 * OFFSET and the DURATION of a pause are different quantities.
 */
const caseWith = (apparent: string, actual: string) => ({
  hidden_model: { mechanism: { apparent_time_of_death: apparent, actual_time_of_death: actual } },
});
const windowFact = (minutes: string) => [
  { id: "murder_window_interval", value: minutes, description: "maximum time window in which the murder could occur" },
];

describe("A_89 A1 — temporal closure", () => {
  it("THE RUN 88651 CASE: a 15-minute gap against a 10-minute murder window does not close", () => {
    const r = checkTemporalClosure(caseWith("four o'clock", "a quarter past four"), windowFact("ten minutes"));
    expect(r.checkable).toBe(true);
    expect(r.gapMinutes).toBe(15);
    expect(r.verdict).toBe("does-not-close");
    expect(r.summary).toContain("cannot contain the event it conceals");
  });

  it("a gap inside the named window closes", () => {
    const r = checkTemporalClosure(caseWith("four o'clock", "four o'clock"), windowFact("ten minutes"));
    expect(r.verdict).toBe("closes");
    expect(r.gapMinutes).toBe(0);
  });

  it("CONSERVATIVE: with no NAMED opportunity window the verdict is not-determinable", () => {
    // This is the archive's normal state — 46 of 49 checkable cases — and it is the finding, not a
    // gap in this check: no canonical field exists for the culprit's window of opportunity.
    const r = checkTemporalClosure(caseWith("four o'clock", "a quarter past four"), [
      { id: "silent_intermission_duration", value: "seven minutes", description: "duration of the gramophone pause" },
    ]);
    expect(r.checkable).toBe(true);
    expect(r.gapMinutes).toBe(15);
    expect(r.verdict).toBe("not-determinable");
    expect(r.summary).toContain("names NO opportunity window");
  });

  it("a case with no parseable times is not checkable — which is not the same as failing", () => {
    const r = checkTemporalClosure({ hidden_model: { mechanism: {} } }, windowFact("ten minutes"));
    expect(r.checkable).toBe(false);
    expect(r.verdict).toBe("not-determinable");
    expect(r.summary).toBe("");
  });

  it("handles the 12-hour dial: 11:55 to 12:05 is ten minutes, not eleven hours", () => {
    const r = checkTemporalClosure(caseWith("11:55", "12:05"), windowFact("fifteen minutes"));
    expect(r.gapMinutes).toBe(10);
    expect(r.verdict).toBe("closes");
  });

  it("collects every stated interval with its source, for the telemetry line", () => {
    const r = checkTemporalClosure(caseWith("four o'clock", "a quarter past four"), [
      { id: "silent_intermission_duration", value: "seven minutes", description: "the pause" },
      { id: "murder_window_interval", value: "ten minutes", description: "window in which the murder could occur" },
    ]);
    expect(r.intervals.map((i) => i.source)).toContain("silent_intermission_duration");
    expect(r.longestMinutes).toBe(10);
    expect(r.opportunityWindow?.minutes).toBe(10);
  });

  it("never throws on a malformed case", () => {
    expect(() => checkTemporalClosure(null, null as any)).not.toThrow();
    expect(() => checkTemporalClosure({}, [])).not.toThrow();
  });
});
