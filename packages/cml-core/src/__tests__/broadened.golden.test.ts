import { describe, expect, it } from "vitest";
import { certify } from "../certify.js";
import { checkUniqueness } from "../engines/uniqueness.js";
import { checkTimeline } from "../engines/timeline.js";
import {
  largeCircleUnique,
  lockedStudyBroken,
  lockedStudyRepaired,
  uniqueMeansBroken,
  uniqueMeansRepaired,
} from "../fixtures/broadened.js";
import type { TypedCml } from "../types.js";

const sorted = (xs: string[]) => [...xs].sort();

describe("LOCKED ROOM — elimination by capability (who held a key), not timing", () => {
  it("broken: an un-keyed suspect (Dunmore) is never ruled out → SOLUTION_NOT_UNIQUE", () => {
    const u = checkUniqueness(lockedStudyBroken());
    expect(u.unique).toBe(false);
    expect(sorted(u.possibleSuspects)).toEqual(["dunmore", "reeve"]);
    expect(certify(lockedStudyBroken()).ok).toBe(false);
  });

  it("repaired: the clue that Dunmore lacked a key flips it to UNIQUE {reeve}", () => {
    const u = checkUniqueness(lockedStudyRepaired());
    expect(u.unique).toBe(true);
    expect(u.possibleSuspects).toEqual(["reeve"]);
    expect(certify(lockedStudyRepaired()).ok).toBe(true);
  });
});

describe("UNIQUE MEANS — elimination by capability (pharmacological knowledge)", () => {
  it("broken: a second medically-trained suspect (the nurse) survives → SOLUTION_NOT_UNIQUE", () => {
    const u = checkUniqueness(uniqueMeansBroken());
    expect(u.unique).toBe(false);
    expect(sorted(u.possibleSuspects)).toEqual(["calloway", "voss"]);
    expect(certify(uniqueMeansBroken()).ok).toBe(false);
  });

  it("repaired: proving the nurse lacked dosing knowledge flips it to UNIQUE {voss}", () => {
    expect(certify(uniqueMeansRepaired()).ok).toBe(true);
    expect(checkUniqueness(uniqueMeansRepaired()).possibleSuspects).toEqual(["voss"]);
  });
});

describe("LARGER CIRCLE — 6 suspects, temporal alibis + capability eliminations together", () => {
  it("certifies UNIQUE {marsh} across a mixed 6-suspect elimination", () => {
    const cml = largeCircleUnique();
    const cert = certify(cml);
    expect(cert.ok).toBe(true);
    expect(cert.uniqueAmong).toEqual(["marsh"]);
    expect(cml.entities.filter((e) => e.kind === "person" && e.role === "suspect")).toHaveLength(6);
  });
});

describe("timeline engine — capability consistency", () => {
  it("flags a person shown both to have and to lack the same capability", () => {
    const cml: TypedCml = lockedStudyRepaired();
    cml.clues.push({ kind: "capability", id: "clue_dunmore_haskey", person: "dunmore", capability: "key_to_study", has: true, availableByStep: 1, worded: "contradiction" });
    const t = checkTimeline(cml);
    expect(t.consistent).toBe(false);
    expect(t.violations.some((v) => /dunmore/i.test(v) && /have and to lack/i.test(v))).toBe(true);
  });
});
