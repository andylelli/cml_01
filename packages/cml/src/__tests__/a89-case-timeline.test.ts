import { describe, expect, it } from "vitest";
import { deriveCaseTimeline, summariseCaseTimeline } from "../case-timeline.js";

/**
 * A_89 A2 — one derived timeline, so the case's numbers exist once.
 *
 * A1 built the arithmetic check and then measured why it almost never fires: of 49 archived cases
 * that state both times, 46 name no opportunity window at all. A2 gives the case a place to say it
 * (`constraint_space.time.opportunity_window`, asked for by `AGENT3_OPPORTUNITY_WINDOW`) and exposes
 * one object carrying the numbers with their provenance.
 */
const base = (apparent: string, actual: string) => ({
  hidden_model: { mechanism: { apparent_time_of_death: apparent, actual_time_of_death: actual } },
});

describe("A_89 A2 — the derived case timeline", () => {
  it("reports the gap and marks the window ABSENT when the case does not say", () => {
    const t = deriveCaseTimeline(base("four o'clock", "a quarter past four"), []);
    expect(t.resolved).toBe(true);
    expect(t.gapMinutes).toBe(15);
    expect(t.opportunityWindow.provenance).toBe("absent");
    expect(t.verdict).toBe("not-determinable");
    expect(t.gaps.join(" ")).toContain("no opportunity window");
  });

  it("THE LOOP CLOSES: a declared window makes run 88651's defect checkable", () => {
    const t = deriveCaseTimeline(
      { ...base("four o'clock", "a quarter past four"),
        constraint_space: { time: { opportunity_window: "ten minutes" } } },
      [],
    );
    expect(t.opportunityWindow).toMatchObject({ minutes: 10, provenance: "stated" });
    expect(t.verdict).toBe("does-not-close");
    expect(summariseCaseTimeline(t)).toContain("does-not-close");
  });

  it("a declared window that COVERS the gap closes", () => {
    const t = deriveCaseTimeline(
      { ...base("four o'clock", "a quarter past four"),
        constraint_space: { time: { opportunity_window: "twenty minutes" } } },
      [],
    );
    expect(t.verdict).toBe("closes");
  });

  it("NOT CIRCULAR: a missing window is never inferred from the gap", () => {
    // Inferring it would make `gap <= window` tautologically true and convert a missing fact into a
    // passing one — the whole point of A1 measuring 46 undecidable cases rather than 46 passes.
    const t = deriveCaseTimeline(base("four o'clock", "a quarter past four"), []);
    expect(t.opportunityWindow.minutes).toBeNull();
    expect(t.verdict).not.toBe("closes");
  });

  it("the declared field beats a locked fact, and a locked fact is still the fallback", () => {
    const facts = [{ id: "murder_window_interval", value: "five minutes", description: "window in which the murder could occur" }];
    const declared = deriveCaseTimeline(
      { ...base("four o'clock", "a quarter past four"),
        constraint_space: { time: { opportunity_window: "twenty minutes" } } }, facts);
    expect(declared.opportunityWindow.source).toContain("opportunity_window");
    expect(declared.opportunityWindow.minutes).toBe(20);

    const fallback = deriveCaseTimeline(base("four o'clock", "a quarter past four"), facts);
    expect(fallback.opportunityWindow.minutes).toBe(5);
    expect(fallback.opportunityWindow.source).toBe("murder_window_interval");
  });

  it("names what is missing when the times themselves do not parse", () => {
    const t = deriveCaseTimeline({ hidden_model: { mechanism: {} } }, []);
    expect(t.resolved).toBe(false);
    expect(t.gaps.join(" ")).toContain("apparent_time_of_death");
    expect(t.gaps.join(" ")).toContain("actual_time_of_death");
  });

  it("never throws on a malformed case", () => {
    expect(() => deriveCaseTimeline(null, null as any)).not.toThrow();
    expect(() => deriveCaseTimeline({}, [])).not.toThrow();
  });
});
