/**
 * A_85 F4 — `AGENT75_DROP_FOREIGN_CLOCK_FACTS`: when the case keeps time twice, Agent 7.5 drops the
 * device's clock facts from BOTH places Agent 9 reads.
 *
 * MEASURED on run 24901: `proseLockedFacts` is built from `hardLogicDevices.devices[*].lockedFacts`,
 * not from the registry — a drop from the registry alone changes nothing on the page. These tests use
 * that run's real fact ids and both flag states, and pin that the devices artifact is the one that
 * matters.
 */

import { describe, expect, it } from "vitest";
import { dropForeignClockFacts, isDropForeignClockFactsEnabled } from "../jobs/agents/agent75-run.js";

const facts = () => [
  { id: "hotel_tide_clock_high", value: "quarter past four", description: "the high tide time displayed on the hotel tide clock" },
  { id: "actual_high_tide", value: "five minutes past four", description: "the actual local high tide time" },
  { id: "tide_offset_interval", value: "ten minutes", description: "the offset between the two" },
  { id: "murder_weapon", value: "heavy brass paperweight", description: "the weapon" },
  { id: "alibi_location_dorothy_carrick", value: "laboratory", description: "where Dorothy was" },
];
const X39 = {
  code: "time_spines_disagree",
  factIds: ["hotel_tide_clock_high", "actual_high_tide", "tide_offset_interval"],
};
const makeCtx = () => ({
  lockedFactRegistry: facts(),
  hardLogicDevices: { devices: [{ name: "The Misaligned Tide Clock", lockedFacts: facts() }] },
  warnings: [] as string[],
});

describe("AGENT75_DROP_FOREIGN_CLOCK_FACTS", () => {
  it("flag OFF: nothing is dropped, nothing is logged (byte-identical)", () => {
    const ctx = makeCtx();
    expect(isDropForeignClockFactsEnabled({})).toBe(false);
    expect(dropForeignClockFacts(ctx, [X39], {})).toEqual([]);
    expect(ctx.lockedFactRegistry).toHaveLength(5);
    expect(ctx.hardLogicDevices.devices[0].lockedFacts).toHaveLength(5);
    expect(ctx.warnings).toEqual([]);
  });

  it("flag ON: the three tide facts leave the registry AND the devices artifact; weapon and location stay", () => {
    const ctx = makeCtx();
    const env = { AGENT75_DROP_FOREIGN_CLOCK_FACTS: "true" };
    expect(isDropForeignClockFactsEnabled(env)).toBe(true);
    const dropped = dropForeignClockFacts(ctx, [X39], env);
    expect(new Set(dropped)).toEqual(new Set(X39.factIds));
    expect(ctx.lockedFactRegistry.map((f) => f.id)).toEqual(["murder_weapon", "alibi_location_dorothy_carrick"]);
    expect(ctx.hardLogicDevices.devices[0].lockedFacts.map((f: any) => f.id)).toEqual([
      "murder_weapon",
      "alibi_location_dorothy_carrick",
    ]);
    expect(ctx.warnings).toHaveLength(1);
    expect(ctx.warnings[0]).toContain("[X39] Agent 7.5 dropped 3 foreign clock fact(s)");
  });

  it("flag ON: a violation of another code drops nothing", () => {
    const ctx = makeCtx();
    const env = { AGENT75_DROP_FOREIGN_CLOCK_FACTS: "true" };
    expect(dropForeignClockFacts(ctx, [{ code: "locked_time_arithmetic", factIds: ["hotel_tide_clock_high"] }], env)).toEqual([]);
    expect(ctx.lockedFactRegistry).toHaveLength(5);
    expect(ctx.warnings).toEqual([]);
  });

  it("flag ON: a spine violation without ids (an older checker) drops nothing", () => {
    const ctx = makeCtx();
    const env = { AGENT75_DROP_FOREIGN_CLOCK_FACTS: "true" };
    expect(dropForeignClockFacts(ctx, [{ code: "time_spines_disagree" }], env)).toEqual([]);
    expect(ctx.hardLogicDevices.devices[0].lockedFacts).toHaveLength(5);
  });
});
