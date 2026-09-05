/**
 * THE DERIVATION NOBODY DECLARED, WHERE ONLY ONE IS POSSIBLE.
 *
 * `checkDeclaredDerivations` is declaration-driven on purpose: with three clocks and two durations
 * there is no way to know which pair a duration derives from, and guessing produces a confident false
 * violation on a correct device. That reasoning stands and is not reversed here.
 *
 * It simply does not apply when the registry holds EXACTLY two instants and EXACTLY one duration.
 *
 * MEASURED 2026-09-04 over the 45 archived registries in apps/worker/logs/locked-facts-*.json:
 * 27 carry the shape, 19 close, 1 fails, 1 is unreadable — and 6 are never evaluated because no
 * `derivedFrom` was authored. Five of those six are the unambiguous 2+1 case, and ALL FIVE would
 * fail:
 *
 *   gap 25m vs declared 35m · gap 10m vs declared 14m · gap 25m vs declared 20m (x3)
 *
 * Those five are real shipped cases whose device states an interval its own two clocks do not
 * support, invisible for want of one authored field. The fixtures below use those real numbers.
 */

import { afterEach, describe, expect, it } from "vitest";

import { checkDeclaredDerivations } from "../declared-derivations.js";
import { buildTemporalSpine } from "../temporal-spine.js";

const fact = (id: string, value: string, derivedFrom?: string[]) =>
  (derivedFrom ? { id, value, derivedFrom } : { id, value });

/** The real shape of mystery-1786998999620: 25 minutes apart, device declares 20. */
const BROKEN = [
  fact("tampering_time", "a quarter past nine in the evening"),
  fact("murder_time_displayed", "twenty minutes to ten in the evening"),
  fact("backward_shift_duration", "twenty minutes"),
];

const SOUND = [
  fact("tampering_time", "a quarter past nine in the evening"),
  fact("murder_time_displayed", "twenty minutes to ten in the evening"),
  fact("backward_shift_duration", "twenty-five minutes"),
];

describe("the spine reports an implied derivation unconditionally", () => {
  it("infers the only possible pairing and fails it", () => {
    const spine = buildTemporalSpine(BROKEN);
    const finding = spine.findings.find((f) => f.shape === "duration_from_two_instants_implied");
    expect(finding, "no implied finding emitted").toBeTruthy();
    expect(finding!.status).toBe("fails");
    expect(finding!.declared).toBe(20);
    // The detail must say it was inferred — telemetry that cannot distinguish inferred from declared
    // would let a guess be read as the case's own claim.
    expect(finding!.detail).toContain("NOT DECLARED");
  });

  it("closes when the arithmetic is right", () => {
    const finding = buildTemporalSpine(SOUND).findings.find(
      (f) => f.shape === "duration_from_two_instants_implied",
    );
    expect(finding!.status).toBe("closes");
  });

  it("does NOT infer when the pairing is ambiguous — three clocks", () => {
    // This is the whole reason the check is declaration-driven. One of the six unevaluated registries
    // has three clocks; inferring there would be a guess.
    const spine = buildTemporalSpine([
      ...BROKEN,
      fact("third_clock_time", "ten o'clock in the evening"),
    ]);
    expect(spine.findings.filter((f) => f.shape === "duration_from_two_instants_implied")).toHaveLength(0);
  });

  it("does NOT infer when two durations are present", () => {
    const spine = buildTemporalSpine([...BROKEN, fact("other_delay", "five minutes")]);
    expect(spine.findings.filter((f) => f.shape === "duration_from_two_instants_implied")).toHaveLength(0);
  });

  it("does NOT infer when the case already declared something — a declaration always wins", () => {
    const declared = [
      fact("tampering_time", "a quarter past nine in the evening"),
      fact("murder_time_displayed", "twenty minutes to ten in the evening"),
      fact("backward_shift_duration", "twenty minutes", ["tampering_time", "murder_time_displayed"]),
    ];
    const spine = buildTemporalSpine(declared);
    expect(spine.findings.filter((f) => f.shape === "duration_from_two_instants_implied")).toHaveLength(0);
    expect(spine.findings.some((f) => f.shape === "duration_from_two_instants")).toBe(true);
  });
});

describe("enforcement is flag-gated; visibility is not", () => {
  afterEach(() => { delete process.env.AGENT3B_IMPLIED_DERIVATIONS; });

  it("raises NO violation with the flag off, though the finding is present", () => {
    delete process.env.AGENT3B_IMPLIED_DERIVATIONS;
    expect(checkDeclaredDerivations(BROKEN)).toEqual([]);
    // Non-vacuous: the spine still saw it, so the flag is what decides, not the detection.
    expect(buildTemporalSpine(BROKEN).findings.some((f) => f.status === "fails")).toBe(true);
  });

  it("raises with the flag on, and says the relation was inferred", () => {
    process.env.AGENT3B_IMPLIED_DERIVATIONS = "true";
    const violations = checkDeclaredDerivations(BROKEN);
    expect(violations).toHaveLength(1);
    expect(violations[0]!.code).toBe("declared_derivation_broken");
    expect(violations[0]!.message).toContain("does not declare where");
    expect(violations[0]!.message).toContain("only one interval it can mean");
  });

  it("raises nothing on a sound case even with the flag on", () => {
    process.env.AGENT3B_IMPLIED_DERIVATIONS = "true";
    expect(checkDeclaredDerivations(SOUND)).toEqual([]);
  });

  it("reads the flag at CALL time", () => {
    process.env.AGENT3B_IMPLIED_DERIVATIONS = "1";
    expect(checkDeclaredDerivations(BROKEN).length).toBe(1);
    process.env.AGENT3B_IMPLIED_DERIVATIONS = "0";
    expect(checkDeclaredDerivations(BROKEN)).toEqual([]);
  });

  it("a declared derivation is unaffected by the flag", () => {
    // The flag must gate ONLY the inferred path. A declared failure has always been a violation and
    // must stay one whether the flag is set or not.
    const declaredBroken = [
      fact("tampering_time", "a quarter past nine in the evening"),
      fact("murder_time_displayed", "twenty minutes to ten in the evening"),
      fact("backward_shift_duration", "twenty minutes", ["tampering_time", "murder_time_displayed"]),
    ];
    delete process.env.AGENT3B_IMPLIED_DERIVATIONS;
    expect(checkDeclaredDerivations(declaredBroken)).toHaveLength(1);
  });
});
