/**
 * PHASE 1 — `checkDeclaredDerivations`, the check driven by what the device DECLARED.
 *
 * THE BLINDNESS IT ANSWERS, measured on run mystery-1788457673117 (external read 76/100, whose
 * reviewer's first complaint was *"that arithmetic is wrong"*). FOUR checks missed the same three
 * locked facts, and the fourth is this one's reason for existing:
 *
 *   1. parseClockTime read "a quarter to six on the evening prior" as 345 — 5:45 AM, dropping 12
 *      hours and a day, without failing.
 *   2. isAtomicLockedFactValue was false for it, so the ship-checks skipped the fact.
 *   3. reconcileDeviceArithmetic knows only `duration = |A − B|`; the case declared
 *      `instant = instant + duration` and it hit `continue` in silence.
 *   4. **checkCaseTimeCoherence fires only on EXACTLY two clocks and EXACTLY one duration.** This
 *      case had two clocks and TWO durations, so it never ran.
 *
 * (4) is why this is declaration-driven: a case that declares `derivedFrom` has stated the pairing,
 * so no counting heuristic is needed and no extra duration can switch the check off.
 *
 * FIRING RATE, measured over 44 archived runs BEFORE wiring (CLAUDE.md B1):
 *   existing check 12/44 (27.3%) · this check 14/44 (31.8%) · fires where the old was silent 7 (15.9%)
 *   1.1 violations per firing run.
 */

import { describe, expect, it } from "vitest";

import { checkDeclaredDerivations, summariseSpine } from "../declared-derivations.js";
import { checkCaseTimeCoherence } from "../timeline-deception.js";

/** Verbatim from the `canary_1788457673112` device artifact. Do not "tidy" the qualifiers out. */
const REAL_CASE = [
  { id: "call_sheet_date", value: "a quarter to six on the evening prior" },
  {
    id: "actual_call_sheet_creation",
    value: "twenty minutes past three on the murder day",
    derivedFrom: ["call_sheet_date", "call_sheet_creation_delay"],
  },
  { id: "call_sheet_creation_delay", value: "one hour and fifty-five minutes" },
  { id: "grandfather_clock_pendulum_length", value: "thirty-four inches" },
  { id: "clock_fast_run_interval", value: "twenty minutes" },
];

describe("checkDeclaredDerivations", () => {
  it("catches the real 76/100 defect", () => {
    const violations = checkDeclaredDerivations(REAL_CASE);
    expect(violations).toHaveLength(1);
    expect(violations[0].code).toBe("declared_derivation_broken");
    expect(violations[0].message).toContain("actual_call_sheet_creation");
    expect(violations[0].message).toContain("does not close");
  });

  it("MEASURED: the existing check is silent on that same case — this is the recovered blindness", () => {
    // Two clocks and TWO durations, so checkCaseTimeCoherence's shape heuristic never engages.
    // Pinned so the justification for a second check cannot quietly stop being true.
    expect(checkCaseTimeCoherence({ lockedFacts: REAL_CASE })).toEqual([]);
  });

  it("is silent when the arithmetic closes", () => {
    expect(
      checkDeclaredDerivations([
        { id: "t_start", value: "a quarter past nine in the evening" },
        { id: "t_end", value: "twenty minutes to ten in the evening" },
        { id: "gap", value: "twenty-five minutes", derivedFrom: ["t_start", "t_end"] },
      ]),
    ).toEqual([]);
  });

  it("is silent on a case that declares nothing", () => {
    expect(
      checkDeclaredDerivations([
        { id: "a", value: "nine o'clock in the evening" },
        { id: "b", value: "twenty minutes" },
      ]),
    ).toEqual([]);
  });

  it("reaches the shape X38 cannot: instant = instant ± duration", () => {
    const violations = checkDeclaredDerivations([
      { id: "base", value: "nine o'clock in the evening" },
      { id: "delay", value: "twenty minutes" },
      { id: "later", value: "half past ten in the evening", derivedFrom: ["base", "delay"] },
    ]);
    expect(violations).toHaveLength(1);
    expect(violations[0].message).toContain("later");
  });

  it("does NOT raise a violation for a derivation it simply cannot compute", () => {
    /**
     * MEASURED across 46 archived devices before the regen was allowed near this: 5 runs (10.9%)
     * carry a real arithmetic failure, and 10 runs (21.7%) would have fired on `unreadable` ALONE.
     * Those ten are correct cases — an angle difference from two angles, a distance from a length
     * and a time, a seconds-precision interval, a time derived from two other times. Feeding them to
     * AGENT3B_ARITHMETIC_REGEN would regenerate a CORRECT device on twice as many runs as it fixed
     * anything.
     *
     * X38's own comment had this right all along: a shape the pass cannot compute is "a silence, not
     * a pass". The defect was never the silence — it was that nobody could see it. It is telemetry
     * now (`summariseSpine` reports every derivation's status), and not a violation.
     */
    const violations = checkDeclaredDerivations([
      { id: "a", value: "nine o'clock in the evening" },
      { id: "angle", value: "ninety degrees", derivedFrom: ["a", "missing"] },
    ]);
    expect(violations).toEqual([]);
  });

  it("a real angle derivation — the measured false positive — is silent", () => {
    // Verbatim from canary_1788416308849: 45° and 135° differ by 90°. Correct geometry, not a clock.
    expect(
      checkDeclaredDerivations([
        { id: "spotlight_angle", value: "forty-five degrees" },
        { id: "shadow_orientation", value: "one hundred and thirty-five degrees" },
        { id: "shadow_light_angle_difference", value: "ninety degrees", derivedFrom: ["spotlight_angle", "shadow_orientation"] },
      ]),
    ).toEqual([]);
  });

  it("but the telemetry still SHOWS the uncomputable derivation", () => {
    // Not actionable is not the same as invisible — that distinction is the whole point.
    const summary = summariseSpine([
      { id: "spotlight_angle", value: "forty-five degrees" },
      { id: "shadow_orientation", value: "one hundred and thirty-five degrees" },
      { id: "shadow_light_angle_difference", value: "ninety degrees", derivedFrom: ["spotlight_angle", "shadow_orientation"] },
    ]);
    expect(summary).toContain("shadow_light_angle_difference");
    expect(summary).toContain("unreadable");
  });

  it("handles an empty or malformed registry without throwing", () => {
    expect(checkDeclaredDerivations([])).toEqual([]);
    expect(checkDeclaredDerivations(undefined)).toEqual([]);
    expect(() => checkDeclaredDerivations([{}, { id: "x" }] as any)).not.toThrow();
  });
});

describe("summariseSpine — telemetry that distinguishes 'clean' from 'never looked'", () => {
  it("reports what was read, even when nothing is wrong", () => {
    const summary = summariseSpine(REAL_CASE);
    expect(summary).toContain("call_sheet_date");
    expect(summary).toContain("day-1");
    expect(summary).toContain("fails");
  });

  it("says so when no derivation is declared", () => {
    expect(summariseSpine([{ id: "a", value: "nine o'clock" }])).toContain("none declared");
  });
});
