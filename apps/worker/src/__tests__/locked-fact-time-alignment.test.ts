/**
 * The two time models, and the detector that names the split.
 *
 * MEASURED on the 2026-08-04 run: the case stated `apparent_time_of_death: "quarter past eight"` and
 * `actual_time_of_death: "quarter past seven"`; the manuscript printed "a quarter to four" (5×) and
 * "ten minutes past four" (6×) — the device's locked facts. **Neither of the case's two anchors
 * appeared anywhere in the finished story.** Agent 3b fixes the device's times and injects them into
 * prose; Agent 3 authors the mechanism's times without ever being shown them.
 *
 * The detector reports and does not repair, deliberately. See the note on the function.
 */

import { describe, expect, it } from "vitest";

import { checkLockedFactTimeAlignment } from "../jobs/agents/agent3-run.js";

const ctxWith = (mechanism: Record<string, unknown>, registry: Array<{ id: string; value: string; description: string }>): any => ({
  cml: { CASE: { hidden_model: { mechanism } } },
  lockedFactRegistry: registry,
});

const DEVICE_FACTS = [
  { id: "freeze_duration", value: "thirty-five minutes", description: "Exact duration the pendulum was immobilized" },
  { id: "false_time_displayed", value: "a quarter to four", description: "Clock time shown during the pendulum freeze" },
  { id: "resumption_time", value: "ten minutes past four", description: "Time when the pendulum resumed swinging" },
];

describe("checkLockedFactTimeAlignment", () => {
  it("names the split measured on the 08-04 run", () => {
    const findings = checkLockedFactTimeAlignment(
      ctxWith({ apparent_time_of_death: "quarter past eight", actual_time_of_death: "quarter past seven" }, DEVICE_FACTS),
    );
    expect(findings.join(" ")).toMatch(/stages the death at "quarter past eight"/);
    expect(findings.join(" ")).toMatch(/false_time_displayed/);
    expect(findings.join(" ")).toMatch(/nothing binds the true time of death/);
  });

  it("is silent when the case agrees with the locked staged time", () => {
    const findings = checkLockedFactTimeAlignment(
      ctxWith(
        { apparent_time_of_death: "a quarter to four", actual_time_of_death: "ten past five" },
        [DEVICE_FACTS[1]!, { id: "true_time_of_death", value: "ten past five", description: "actual time of death" }],
      ),
    );
    expect(findings).toEqual([]);
  });

  it("compares by clock value, not by string — the same time written two ways is not a split", () => {
    const findings = checkLockedFactTimeAlignment(
      ctxWith({ apparent_time_of_death: "3:45" }, [DEVICE_FACTS[1]!]),
    );
    expect(findings).toEqual([]);
  });

  it("matches the staged fact by its own id and description, never by position", () => {
    const reordered = [DEVICE_FACTS[2]!, DEVICE_FACTS[0]!, DEVICE_FACTS[1]!];
    const findings = checkLockedFactTimeAlignment(ctxWith({ apparent_time_of_death: "quarter past eight" }, reordered));
    expect(findings.join(" ")).toMatch(/false_time_displayed/);
    expect(findings.join(" ")).not.toMatch(/resumption_time puts the displayed/);
  });

  it("says nothing when there is no registry, no clock-valued fact, or no mechanism", () => {
    expect(checkLockedFactTimeAlignment(ctxWith({ apparent_time_of_death: "8:15" }, []))).toEqual([]);
    expect(
      checkLockedFactTimeAlignment(ctxWith({ apparent_time_of_death: "8:15" }, [DEVICE_FACTS[0]!])),
    ).toEqual([]);
    expect(checkLockedFactTimeAlignment({ cml: {}, lockedFactRegistry: DEVICE_FACTS } as any).length).toBe(0);
  });

  it("never invents the true time from a duration or a resumption time", () => {
    // `resumption_time` is when the mechanism restarted, not when anyone died. A detector that
    // "helpfully" mapped it would fabricate the coherence claim the case failed to make.
    const findings = checkLockedFactTimeAlignment(
      ctxWith({ apparent_time_of_death: "a quarter to four", actual_time_of_death: "quarter past seven" }, DEVICE_FACTS),
    );
    expect(findings).toHaveLength(1);
    expect(findings[0]).toMatch(/no locked fact corresponds to it/);
  });
});
