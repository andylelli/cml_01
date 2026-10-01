import { describe, expect, it } from "vitest";
import { createRetryCostMeter } from "../jobs/agents/agent6-run.js";

/**
 * Owner decision 7 (2026-10-01, A6-D01): Agent 6's retry budget charges every retry its own cost — the first
 * included. The old meter set each label's baseline at its FIRST OBSERVATION, which happens after the first
 * retry returns, so the first retry of every cost source was charged 0.
 */
describe("createRetryCostMeter", () => {
  it("charges the FIRST retry of a source its real cost (the old meter charged 0)", () => {
    const tracker: Record<string, number> = { "Agent5-Clues": 0.1 }; // Agent 5's own run, before Agent 6
    const meter = createRetryCostMeter(() => tracker);
    tracker["Agent5-Clues"] = 0.13; // the first clue regeneration
    expect(meter.perCallCostDelta("Agent5-Clues", 0.13)).toBeCloseTo(0.03, 10);
    tracker["Agent5-Clues"] = 0.17; // the second
    expect(meter.perCallCostDelta("Agent5-Clues", 0.17)).toBeCloseTo(0.04, 10);
  });

  it("a non-retry call is re-based, not charged to the next retry", () => {
    const tracker: Record<string, number> = {};
    const meter = createRetryCostMeter(() => tracker);
    tracker["Agent6-FairPlayAuditor"] = 0.02; // the first audit — a normal step
    meter.rebaseCost("Agent6-FairPlayAuditor");
    tracker["Agent6-FairPlayAuditor"] = 0.05; // the re-audit — a retry
    expect(meter.perCallCostDelta("Agent6-FairPlayAuditor", 0.05)).toBeCloseTo(0.03, 10);
  });

  it("never charges a negative amount", () => {
    const meter = createRetryCostMeter(() => ({ "Agent4-Revision": 0.5 }));
    expect(meter.perCallCostDelta("Agent4-Revision", 0.4)).toBe(0);
  });
});
