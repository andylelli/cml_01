/**
 * X38/X39 — the WIRING, not the rule.
 *
 * The rule is unit-tested in `@cml/cml`. What was untested is the thing this codebase gets wrong most
 * often: a call site that reads a field by the wrong name and silently no-ops. `lockedFactRegistry`,
 * `hidden_model.mechanism.apparent_time_of_death`, `timeModel.trueTime` — rename any one of them and
 * both pre-prose checks go quiet while every test still passes, which is exactly how
 * `role_archetype` vs `roleArchetype` shipped a cleared detective and how `AGENT7_SCHEDULER_
 * AUTHORITATIVE` sat unsettable for a week.
 *
 * These tests hold the SHAPES the two call sites read, against the checker that reads them.
 */

import { describe, expect, it } from "vitest";
import { checkCaseTimeCoherence } from "@cml/cml";

describe("X38 — the shape agent3b-run passes (ctx.lockedFactRegistry)", () => {
  /** Exactly what `Pillar 1` builds: {id, value, description}. */
  const registry = [
    { id: "pendulum_delay_duration", value: "fourteen minutes", description: "the lag" },
    { id: "murder_time_displayed", value: "a quarter past seven in the evening", description: "the clock face" },
    { id: "chime_recorded_time", value: "five minutes past seven in the evening", description: "the bell" },
  ];

  it("reads a registry entry's `value` and finds the 08-15 contradiction", () => {
    const out = checkCaseTimeCoherence({ lockedFacts: registry });
    expect(out.map((v) => v.code)).toContain("locked_time_arithmetic");
  });

  it("survives the registry being empty or absent — the flag that builds it is optional", () => {
    expect(checkCaseTimeCoherence({ lockedFacts: [] })).toEqual([]);
    expect(checkCaseTimeCoherence({ lockedFacts: undefined })).toEqual([]);
  });

  it("ignores a registry of non-temporal facts, which is the common case", () => {
    expect(
      checkCaseTimeCoherence({
        lockedFacts: [
          { id: "distance_to_latch", value: "sixteen feet" },
          { id: "wire_gauge", value: "two inches" },
        ],
      }),
    ).toEqual([]);
  });
});

describe("X39 — the shape agent75-run passes (geometry.timeModel + the registry)", () => {
  const registry = [
    { id: "pendulum_delay_duration", value: "fourteen minutes" },
    { id: "murder_time_displayed", value: "a quarter past seven" },
    { id: "chime_recorded_time", value: "five minutes past seven" },
  ];

  it("flags two spines from the fields the call site actually reads", () => {
    // `apparentTime`/`trueTime` are geometry's names for the mechanism's two anchors.
    const out = checkCaseTimeCoherence({
      lockedFacts: registry,
      apparentTime: "a quarter past eight",
      actualTime: "a quarter to nine",
    });
    expect(out.map((v) => v.code)).toContain("time_spines_disagree");
  });

  it("says nothing when geometry has no anchors — an unparseable case is a different defect", () => {
    const out = checkCaseTimeCoherence({ lockedFacts: registry, apparentTime: null, actualTime: undefined });
    expect(out.map((v) => v.code)).not.toContain("time_spines_disagree");
  });

  it("is silent on a coherent case: one spine, arithmetic that adds up", () => {
    const coherent = [
      { id: "delay", value: "thirty minutes" },
      { id: "murder_time_displayed", value: "a quarter past eight" },
      { id: "chime_recorded_time", value: "a quarter to nine" },
    ];
    expect(
      checkCaseTimeCoherence({
        lockedFacts: coherent,
        apparentTime: "a quarter past eight",
        actualTime: "a quarter to nine",
      }),
    ).toEqual([]);
  });
});
