/**
 * A_86 item 3 — `AGENT3B_IMPLIED_DERIVATION`.
 *
 * `reconcileDeviceArithmetic` may only repair a fact that DECLARES `derivedFrom`. MEASURED over the
 * 50 stored cases: only 31 of 180 locked facts (17%) declare one, and 9 of the 22 cases with a time
 * violation (41%) declare nothing at all — so the repair is powerless on them. The prompt already
 * asks for the declaration at length and is followed 17% of the time.
 *
 * A device holding EXACTLY two clock facts and EXACTLY one duration has only one arithmetic reading.
 * These tests pin that the inference fires on exactly that shape and refuses every other, because an
 * inference that guesses is worse than one that stays silent.
 */

import { describe, expect, it } from "vitest";
import { impliedIntervalFactId, isImpliedDerivationEnabled } from "../jobs/agents/agent3b-run.js";
import { parseClockTime, parseDurationMinutes } from "@cml/cml";

const find = (facts: Array<{ id: string; value: string; derivedFrom?: string[] }>) =>
  impliedIntervalFactId(facts, parseClockTime, parseDurationMinutes);

describe("A_86 item 3 — the implied interval", () => {
  it("fires on the one unambiguous shape: two clocks, one duration", () => {
    expect(
      find([
        { id: "reception_clock", value: "ten minutes past nine" },
        { id: "kitchen_clock", value: "half past nine" },
        { id: "clock_shift_interval", value: "thirty-five minutes" },
      ]),
    ).toBe("clock_shift_interval");
  });

  it("refuses TWO durations — which of them is the interval is a guess", () => {
    expect(
      find([
        { id: "reception_clock", value: "ten minutes past nine" },
        { id: "kitchen_clock", value: "half past nine" },
        { id: "shift", value: "twenty minutes" },
        { id: "delay", value: "five minutes" },
      ]),
    ).toBeNull();
  });

  it("refuses THREE clocks — the pair to subtract is a guess", () => {
    expect(
      find([
        { id: "a", value: "ten minutes past nine" },
        { id: "b", value: "half past nine" },
        { id: "c", value: "a quarter to ten" },
        { id: "shift", value: "twenty minutes" },
      ]),
    ).toBeNull();
  });

  it("refuses a device with no duration at all", () => {
    expect(
      find([
        { id: "a", value: "ten minutes past nine" },
        { id: "b", value: "half past nine" },
      ]),
    ).toBeNull();
  });

  it("ignores non-temporal facts when counting the shape", () => {
    expect(
      find([
        { id: "reception_clock", value: "ten minutes past nine" },
        { id: "kitchen_clock", value: "half past nine" },
        { id: "clock_shift_interval", value: "thirty-five minutes" },
        { id: "murder_weapon", value: "heavy brass paperweight" },
        { id: "alibi_location", value: "the laboratory" },
      ]),
    ).toBe("clock_shift_interval");
  });

  it("the flag is default OFF and read at call time", () => {
    expect(isImpliedDerivationEnabled({})).toBe(false);
    expect(isImpliedDerivationEnabled({ AGENT3B_IMPLIED_DERIVATION: "true" })).toBe(true);
    expect(isImpliedDerivationEnabled({ AGENT3B_IMPLIED_DERIVATION: "off" })).toBe(false);
  });
});
