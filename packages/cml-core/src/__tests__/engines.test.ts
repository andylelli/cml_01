import { describe, expect, it } from "vitest";
import { isEliminableFrom, unionCovers } from "../util.js";
import { checkTimeline } from "../engines/timeline.js";
import { checkDeducibility } from "../engines/deducibility.js";
import type { CrimeSpec, PresenceObservation, TypedCml } from "../types.js";
import { clockSetFastBroken, clockSetFastRepaired } from "../fixtures/clock-set-fast.js";

describe("unionCovers (discrete-minute interval coverage)", () => {
  it("a single covering interval covers the window", () => {
    expect(unionCovers([{ start: 480, end: 492 }], { start: 480, end: 492 })).toBe(true);
    expect(unionCovers([{ start: 460, end: 1440 }], { start: 480, end: 492 })).toBe(true);
  });

  it("a single-instant interval does NOT cover a window (the boarded ≠ departed case)", () => {
    expect(unionCovers([{ start: 492, end: 492 }], { start: 480, end: 492 })).toBe(false);
  });

  it("two adjacent intervals union to cover; a gap does not", () => {
    expect(unionCovers([{ start: 480, end: 485 }, { start: 486, end: 492 }], { start: 480, end: 492 })).toBe(true);
    expect(unionCovers([{ start: 480, end: 484 }, { start: 486, end: 492 }], { start: 480, end: 492 })).toBe(false);
  });
});

describe("isEliminableFrom (the shared elimination primitive)", () => {
  const crime: CrimeSpec = { location: "study", window: { start: 480, end: 492 }, reachableFrom: ["kitchen"] };
  const presence = (location: string, start: number, end: number): PresenceObservation => ({
    kind: "presence",
    id: `p-${location}-${start}`,
    person: "x",
    location,
    interval: { start, end },
    availableByStep: 1,
    worded: "",
  });

  it("presence at a precluding location covering the window eliminates", () => {
    expect(isEliminableFrom([presence("away", 460, 1440)], "x", crime)).toBe(true);
  });

  it("presence at a REACHABLE location does not eliminate (kitchen is adjacent)", () => {
    expect(isEliminableFrom([presence("kitchen", 480, 510)], "x", crime)).toBe(false);
  });

  it("instantaneous presence at a precluding location does not eliminate", () => {
    expect(isEliminableFrom([presence("station", 492, 492)], "x", crime)).toBe(false);
  });
});

describe("timeline engine", () => {
  it("is consistent on the repaired golden", () => {
    expect(checkTimeline(clockSetFastRepaired()).consistent).toBe(true);
  });

  it("flags a person placed in two locations at once", () => {
    const cml = clockSetFastRepaired();
    cml.clues.push({
      kind: "presence",
      id: "clue_carrow_elsewhere",
      person: "carrow",
      location: "away",
      interval: { start: 480, end: 490 }, // overlaps her kitchen [480,510]
      availableByStep: 1,
      worded: "",
    });
    const t = checkTimeline(cml);
    expect(t.consistent).toBe(false);
    expect(t.violations.some((v) => /carrow/i.test(v) && /two places/i.test(v))).toBe(true);
  });

  it("flags an empty crime window", () => {
    const cml = clockSetFastRepaired();
    cml.crime.window = { start: 492, end: 480 };
    expect(checkTimeline(cml).consistent).toBe(false);
  });
});

describe("deducibility engine — no clue used before the reader has it", () => {
  it("flags a premise used before its availableByStep", () => {
    const cml: TypedCml = clockSetFastBroken();
    const hartwellClue = cml.clues.find((c) => c.id === "clue_hartwell_away")!;
    hartwellClue.availableByStep = 5; // but step 2 uses it
    const d = checkDeducibility(cml);
    expect(d.issues.some((i) => /before the reader has it/i.test(i))).toBe(true);
  });

  it("flags a premise that is not in the shown clue set", () => {
    const cml: TypedCml = clockSetFastBroken();
    const step2 = cml.inferencePath.find((e) => e.id === "step2_hartwell")!;
    (step2 as { from: string[] }).from = ["clue_does_not_exist"];
    const d = checkDeducibility(cml);
    expect(d.issues.some((i) => /not in the shown clue set/i.test(i))).toBe(true);
  });
});
