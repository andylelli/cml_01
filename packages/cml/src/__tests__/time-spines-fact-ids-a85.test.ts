/**
 * A_85 F4 — `time_spines_disagree` names the facts that form the second time spine.
 *
 * MEASURED on run 24901: the registry locked hotel_tide_clock_high "quarter past four",
 * actual_high_tide "five minutes past four" and tide_offset_interval "ten minutes", while the
 * mechanism's anchors were "half past six" and "quarter past three". The check said so; nothing acted.
 * Now the violation carries the ids a consumer can drop: the two clocks and the duration that is
 * their gap. These are that run's real values.
 */

import { describe, expect, it } from "vitest";
import { checkCaseTimeCoherence } from "../timeline-deception.js";

const RUN_24901_FACTS = [
  { id: "hotel_tide_clock_high", value: "quarter past four" },
  { id: "actual_high_tide", value: "five minutes past four" },
  { id: "tide_offset_interval", value: "ten minutes" },
  { id: "murder_weapon", value: "heavy brass paperweight" },
  { id: "alibi_location_dorothy_carrick", value: "laboratory" },
];

describe("time_spines_disagree carries the device's fact ids", () => {
  it("run 24901: the two tide clocks and the ten-minute gap are named; the weapon and locations are not", () => {
    const violations = checkCaseTimeCoherence({
      lockedFacts: RUN_24901_FACTS,
      apparentTime: "half past six",
      actualTime: "quarter past three",
    });
    const spines = violations.find((v) => v.code === "time_spines_disagree");
    expect(spines).toBeDefined();
    expect(new Set(spines!.factIds)).toEqual(new Set(["hotel_tide_clock_high", "actual_high_tide", "tide_offset_interval"]));
  });

  it("a duration that is NOT the clocks' gap is left alone", () => {
    const violations = checkCaseTimeCoherence({
      lockedFacts: [
        { id: "hotel_tide_clock_high", value: "quarter past four" },
        { id: "actual_high_tide", value: "five minutes past four" },
        { id: "walk_to_pier", value: "twenty minutes" },
      ],
      apparentTime: "half past six",
      actualTime: "quarter past three",
    });
    const spines = violations.find((v) => v.code === "time_spines_disagree");
    expect(spines).toBeDefined();
    expect(new Set(spines!.factIds)).toEqual(new Set(["hotel_tide_clock_high", "actual_high_tide"]));
  });

  it("a device that shares an anchor with the mechanism is one spine — no violation, no ids", () => {
    const violations = checkCaseTimeCoherence({
      lockedFacts: RUN_24901_FACTS,
      apparentTime: "quarter past four",
      actualTime: "five minutes past four",
    });
    expect(violations.find((v) => v.code === "time_spines_disagree")).toBeUndefined();
  });

  it("other violation codes do not grow a factIds field", () => {
    const violations = checkCaseTimeCoherence({
      lockedFacts: [
        { id: "clock_a", value: "quarter past four" },
        { id: "clock_b", value: "five minutes past four" },
        { id: "declared", value: "fifteen minutes" },
      ],
    });
    const arithmetic = violations.find((v) => v.code === "locked_time_arithmetic");
    expect(arithmetic).toBeDefined();
    expect(arithmetic!.factIds).toBeUndefined();
  });
});
