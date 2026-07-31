import { describe, expect, it } from "vitest";
import { assessRedHerringFloor } from "../jobs/agents/agent5-run.js";

/**
 * A_71 (A_70 §6) — the red-herring floor.
 *
 * MEASURED: the 07-27 run shipped **0 red herrings** where all three 07-24 runs produced 2, and
 * scored `clues: 5/10`. The budget was enforced only as a ceiling (`length <= budget`), so zero
 * passed every check.
 */

describe("assessRedHerringFloor", () => {
  it("repairs a mystery with no misdirection at all", () => {
    const result = assessRedHerringFloor([], {});
    expect(result.count).toBe(0);
    expect(result.needsRepair).toBe(true);
  });

  it("treats a missing or malformed redHerrings field as zero, not as 'skip the check'", () => {
    // The 07-27 response simply had no array. A truthiness guard would have skipped the run's only
    // misdirection check on exactly the input that needed it.
    expect(assessRedHerringFloor(undefined, {}).needsRepair).toBe(true);
    expect(assessRedHerringFloor(null, {}).needsRepair).toBe(true);
    expect(assessRedHerringFloor("two red herrings", {}).needsRepair).toBe(true);
    expect(assessRedHerringFloor({ 0: "a", length: 1 }, {}).needsRepair).toBe(true);
  });

  it("does not spend an LLM call on a 1-of-2 shortfall, but does record it", () => {
    const result = assessRedHerringFloor([{ id: "rh_1" }], {});
    expect(result.needsRepair).toBe(false);
    expect(result.shortOfBudget).toBe(true);
  });

  it("is silent when the budget is met", () => {
    const result = assessRedHerringFloor([{ id: "rh_1" }, { id: "rh_2" }], {});
    expect(result.needsRepair).toBe(false);
    expect(result.shortOfBudget).toBe(false);
  });

  it("defaults ON when the flag is unset", () => {
    expect(assessRedHerringFloor([], {}).enabled).toBe(true);
  });

  it("honours the documented off-switch spellings", () => {
    for (const value of ["false", "0", "off", "no", "FALSE", "Off"]) {
      expect(assessRedHerringFloor([], { AGENT5_RED_HERRING_FLOOR: value }).enabled).toBe(false);
      expect(assessRedHerringFloor([], { AGENT5_RED_HERRING_FLOOR: value }).needsRepair).toBe(false);
    }
  });

  it("stays on for any other value, so a typo cannot silently disable the floor", () => {
    expect(assessRedHerringFloor([], { AGENT5_RED_HERRING_FLOOR: "true" }).enabled).toBe(true);
    expect(assessRedHerringFloor([], { AGENT5_RED_HERRING_FLOOR: "yes" }).enabled).toBe(true);
    expect(assessRedHerringFloor([], { AGENT5_RED_HERRING_FLOOR: "1" }).enabled).toBe(true);
  });
});
