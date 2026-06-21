import { describe, expect, it } from "vitest";
import {
  boundDeviceFromPattern,
  checkDeviceBinding,
  type BoundDevice,
  type GroundingMap,
} from "../engines/device-binding.js";
import { clockSetFastBroken, clockSetFastRepaired } from "../fixtures/clock-set-fast.js";

/**
 * The chosen device for the §4.6 worked example. Mirrors the real library pattern at
 * packages/device-library/data/patterns/clock_rewind.yaml — passed through the same
 * `boundDeviceFromPattern` adapter Agent 3 would use, so this exercises the projection on a real
 * DevicePattern shape without coupling cml-core's build to the device-library package.
 */
const clockRewindPattern = {
  pattern_id: "clock_rewind",
  family: "timing",
  axes: ["temporal"],
  clue_archetypes: ["clock_mechanism_wear", "witness_timing_contradiction", "second_timepiece_disagreement"],
};

/** A correct grounding map for clock_rewind over the clock-set-fast CML. */
function goldenGrounding(): GroundingMap {
  return {
    deviceId: "clock_rewind",
    // step1_clock is the time_correction edge — it discriminates on a timing device's principle.
    discriminatingTestEdgeId: "step1_clock",
    clueRealizations: [
      { archetype: "clock_mechanism_wear", clueId: "clue_clock" },
      { archetype: "witness_timing_contradiction", clueId: "clue_vale_boarded" },
      { archetype: "second_timepiece_disagreement", clueId: "clue_clock" },
    ],
  };
}

const device = (): BoundDevice => boundDeviceFromPattern(clockRewindPattern, ["eight minutes"]);

describe("boundDeviceFromPattern (projection of a real DevicePattern)", () => {
  it("copies the checker-relevant fields and the locked facts", () => {
    const d = device();
    expect(d).toEqual({
      deviceId: "clock_rewind",
      family: "timing",
      axes: ["temporal"],
      requiredClueArchetypes: ["clock_mechanism_wear", "witness_timing_contradiction", "second_timepiece_disagreement"],
      lockedFacts: ["eight minutes"],
    });
  });

  it("omits lockedFacts when none are supplied", () => {
    expect(boundDeviceFromPattern(clockRewindPattern).lockedFacts).toBeUndefined();
  });
});

describe("binding invariant (§4.4 / §9.4): a correct grounding map validates", () => {
  it("the golden CML honors its device", () => {
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), goldenGrounding());
    expect(r.honored, r.reasons.join(" | ")).toBe(true);
    expect(r.reasons).toEqual([]);
    expect(r.unrealizedArchetypes).toEqual([]);
    expect(r.missingLockedFacts).toEqual([]);
  });

  it("binding is ORTHOGONAL to fair-play: it can hold on the broken (non-unique) fixture too", () => {
    // The broken fixture fails certify() for uniqueness, but it still structurally honors the device —
    // the two checks answer different questions, exactly as §5 intends (Agent 4 gains a *separate* check).
    expect(checkDeviceBinding(clockSetFastBroken(), device(), goldenGrounding()).honored).toBe(true);
  });
});

describe("binding invariant: mutate the CML/map and the checker MUST fail (§9.4)", () => {
  it("drops a required clue archetype → unrealized archetype, not honored", () => {
    const g = goldenGrounding();
    g.clueRealizations = g.clueRealizations.filter((c) => c.archetype !== "witness_timing_contradiction");
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), g);
    expect(r.honored).toBe(false);
    expect(r.unrealizedArchetypes).toEqual(["witness_timing_contradiction"]);
  });

  it("maps an archetype to a clue that doesn't exist → dangling ref + unrealized, not honored", () => {
    const g = goldenGrounding();
    g.clueRealizations = g.clueRealizations.map((c) =>
      c.archetype === "clock_mechanism_wear" ? { ...c, clueId: "clue_phantom" } : c,
    );
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), g);
    expect(r.honored).toBe(false);
    expect(r.danglingClueRefs).toContain("clue_phantom");
    expect(r.unrealizedArchetypes).toContain("clock_mechanism_wear");
  });

  it("names a discriminating test that isn't in the inference path → missing, not honored", () => {
    const g = { ...goldenGrounding(), discriminatingTestEdgeId: "step_does_not_exist" };
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), g);
    expect(r.honored).toBe(false);
    expect(r.missingDiscriminatingTest).toBe(true);
  });

  it("names a discriminating test whose rule doesn't discriminate on a timing device → wrong rule", () => {
    // step2_hartwell is access_impossible — fine for a spatial device, wrong for a timing one.
    const g = { ...goldenGrounding(), discriminatingTestEdgeId: "step2_hartwell" };
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), g);
    expect(r.honored).toBe(false);
    expect(r.discriminatingTestWrongRule).toMatchObject({
      edgeId: "step2_hartwell",
      rule: "access_impossible",
      expected: ["time_correction"],
    });
  });

  it("grounds on a different device than the one chosen → device mismatch", () => {
    const g = { ...goldenGrounding(), deviceId: "some_other_device" };
    const r = checkDeviceBinding(clockSetFastRepaired(), device(), g);
    expect(r.honored).toBe(false);
    expect(r.deviceMismatch).toBe(true);
  });

  it("a locked fact that appears in no clue → missing locked fact, not honored", () => {
    const wrongLock = boundDeviceFromPattern(clockRewindPattern, ["forty minutes"]); // fixture says EIGHT
    const r = checkDeviceBinding(clockSetFastRepaired(), wrongLock, goldenGrounding());
    expect(r.honored).toBe(false);
    expect(r.missingLockedFacts).toEqual(["forty minutes"]);
  });
});

describe("the family→rule map is not hardcoded to timing (covers other axes)", () => {
  it("a spatial-routing device is honored when its discriminating test is access_impossible", () => {
    const spatialDevice: BoundDevice = {
      deviceId: "concealed_passage",
      family: "spatial_routing",
      axes: ["spatial"],
      requiredClueArchetypes: ["access_path_contradiction"],
    };
    const grounding: GroundingMap = {
      deviceId: "concealed_passage",
      discriminatingTestEdgeId: "step2_hartwell", // access_impossible — correct for a spatial device
      clueRealizations: [{ archetype: "access_path_contradiction", clueId: "clue_hartwell_away" }],
    };
    const r = checkDeviceBinding(clockSetFastRepaired(), spatialDevice, grounding);
    expect(r.honored, r.reasons.join(" | ")).toBe(true);
  });

  it("the same spatial device is NOT honored if it points at the time_correction edge", () => {
    const spatialDevice: BoundDevice = {
      deviceId: "concealed_passage",
      family: "spatial_routing",
      axes: ["spatial"],
      requiredClueArchetypes: ["access_path_contradiction"],
    };
    const grounding: GroundingMap = {
      deviceId: "concealed_passage",
      discriminatingTestEdgeId: "step1_clock", // time_correction — wrong for a spatial device
      clueRealizations: [{ archetype: "access_path_contradiction", clueId: "clue_hartwell_away" }],
    };
    expect(checkDeviceBinding(clockSetFastRepaired(), spatialDevice, grounding).honored).toBe(false);
  });
});
