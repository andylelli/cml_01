/**
 * X38-AT-SOURCE, the Agent 3 half — the arithmetic stated as a number the model can check itself
 * against, rather than as a wish that the anchors be "consistent".
 *
 * MEASURED 2026-08-20 (`scripts/probe-device-arithmetic.mjs`): ten of the ten archived devices the
 * X38 check can read have arithmetic that does not close. Six lock two clock values and are repaired
 * deterministically at Agent 3b. The other FOUR lock only one clock — the second anchor is authored
 * here, in `hidden_model.mechanism`, after the registry has already frozen. Those four cannot be
 * repaired downstream; a chapter rewritten to reconcile them would contradict the registry, which is
 * why X38 shipped as a detector with no repair path. They can only be prevented, by this prompt.
 *
 * Every fixture is a real archived device, quoted from apps/worker/logs/locked-facts-*.json.
 */

import { describe, expect, it } from "vitest";

import { buildDeviceArithmeticRule } from "../agent3-cml.js";

describe("buildDeviceArithmeticRule — one locked clock, one duration (the four it exists for)", () => {
  // mystery-1787167692140, verbatim. The anchors came out 25 minutes apart under a duration
  // declaring twenty — the fourth consecutive run with wrong device arithmetic.
  const oneClock = [
    { id: "chime_delay_duration", value: "twenty minutes" },
    { id: "false_chime_time", value: "quarter to eight" },
  ];

  it("states the interval and the fixed point, both by name", () => {
    const rule = buildDeviceArithmeticRule(oneClock);
    expect(rule).toContain("chime_delay_duration");
    expect(rule).toContain("twenty minutes");
    expect(rule).toContain("false_chime_time");
    expect(rule).toContain("quarter to eight");
    expect(rule).toMatch(/EXACTLY "twenty minutes" apart/);
  });

  it("leaves the DIRECTION to the agent that knows the device's story", () => {
    // Naming one admissible time would author the mechanism from the prompt, badly: whether the
    // true death precedes the displayed time or follows it is the device's own question.
    const rule = buildDeviceArithmeticRule(oneClock);
    expect(rule).toMatch(/yours to decide/);
    expect(rule).toMatch(/one of the two must BE/);
  });

  it("names both anchor fields, so the constraint lands on the fields it governs", () => {
    const rule = buildDeviceArithmeticRule(oneClock);
    expect(rule).toContain("apparent_time_of_death");
    expect(rule).toContain("actual_time_of_death");
  });
});

describe("buildDeviceArithmeticRule — two locked clocks (already settled at Agent 3b)", () => {
  // mystery-1785860662362, after the Agent 3b repair has closed its arithmetic.
  const twoClocks = [
    { id: "false_time_displayed", value: "a quarter to four" },
    { id: "resumption_time", value: "ten minutes past four" },
    { id: "freeze_duration", value: "twenty-five minutes" },
  ];

  it("pins both anchors to the locked pair rather than restating the interval", () => {
    const rule = buildDeviceArithmeticRule(twoClocks);
    expect(rule).toContain("a quarter to four");
    expect(rule).toContain("ten minutes past four");
    expect(rule).toMatch(/must BE those two values/);
  });

  it("forbids the third time the corpus keeps inventing", () => {
    // story_20260819-0147 printed "eight fifty-six" against a case that declared neither anchor.
    expect(buildDeviceArithmeticRule(twoClocks)).toMatch(/Do not introduce a third time/);
  });

  it("names the duration as the interval only when it actually is one", () => {
    // reconcileDeviceArithmetic can decline (a zero gap, or one it cannot spell), and then the run
    // carries an [X38] warning instead. A prompt that asserts a falsehood about its own inputs is
    // worse than one that says less, so the interval clause drops and the anchor binding stays.
    const stillBroken = [
      { id: "false_time_displayed", value: "a quarter to four" },
      { id: "resumption_time", value: "ten minutes past four" },
      { id: "freeze_duration", value: "thirty-five minutes" }, // the gap is twenty-five
    ];
    const rule = buildDeviceArithmeticRule(stillBroken);
    expect(rule).not.toContain("is the interval between them");
    expect(rule).toContain("a quarter to four");
    expect(rule).toMatch(/must BE those two values/);

    expect(buildDeviceArithmeticRule(twoClocks)).toContain("is the interval between them");
  });
});

describe("buildDeviceArithmeticRule — silence is the default, and it is self-gating", () => {
  it("says nothing when there is no duration to relate the clocks by", () => {
    expect(
      buildDeviceArithmeticRule([
        { id: "murder_time_displayed", value: "a quarter past seven" },
        { id: "chime_recorded_time", value: "five minutes past seven" },
      ]),
    ).toBe("");
  });

  it("says nothing when two durations leave the pairing a guess — the detector's own refusal", () => {
    expect(
      buildDeviceArithmeticRule([
        { id: "clock_face_time", value: "a quarter to nine" },
        { id: "shift_duration", value: "twenty minutes" },
        { id: "reset_duration", value: "five minutes" },
      ]),
    ).toBe("");
  });

  it("says nothing when three clocks leave no single pairing", () => {
    expect(
      buildDeviceArithmeticRule([
        { id: "a", value: "a quarter to nine" },
        { id: "b", value: "twenty minutes past eight" },
        { id: "c", value: "ten minutes past ten" },
        { id: "d", value: "twenty minutes" },
      ]),
    ).toBe("");
  });

  it("says nothing for a device with no temporal facts, which is the common case", () => {
    expect(
      buildDeviceArithmeticRule([
        { id: "distance_to_latch", value: "sixteen feet" },
        { id: "wire_gauge", value: "two inches" },
      ]),
    ).toBe("");
  });

  it("says nothing for an empty or malformed registry", () => {
    expect(buildDeviceArithmeticRule([])).toBe("");
    expect(buildDeviceArithmeticRule([{ id: "", value: "" }])).toBe("");
    expect(buildDeviceArithmeticRule([{} as { id?: string; value?: string }])).toBe("");
  });

  it("says nothing when the duration is real but unreadable — never a half-written rule", () => {
    expect(
      buildDeviceArithmeticRule([
        { id: "false_chime_time", value: "quarter to eight" },
        { id: "delay", value: "a short while" },
      ]),
    ).toBe("");
  });
});
