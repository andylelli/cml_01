import { describe, expect, it } from "vitest";

import {
  ALL_BATCH_GATES,
  inferBatchGatesFromError,
  initBatchGateFailureCounts,
} from "../agent9-prose/clue-validation.ts";

describe("batch gate taxonomy", () => {
  it("initializes a zeroed counter for every declared gate", () => {
    const counts = initBatchGateFailureCounts();

    expect(Object.keys(counts).sort()).toStrictEqual([...ALL_BATCH_GATES].sort());
    for (const gate of ALL_BATCH_GATES) {
      expect(counts[gate]).toBe(0);
    }
  });

  it("includes stage and reveal completeness gates in the declared taxonomy", () => {
    expect(ALL_BATCH_GATES).toContain("stage_mode_outcome");
    expect(ALL_BATCH_GATES).toContain("discriminating_test_validity");
    expect(ALL_BATCH_GATES).toContain("final_reveal_completeness");
  });
});

describe("inferBatchGatesFromError", () => {
  it("classifies stage-mode contract failures as stage_mode_outcome", () => {
    const gates = inferBatchGatesFromError(
      "Stage-mode outcome failed (suspect_pressure): chapter must include at least one new pressure reveal.",
    );

    expect(gates).toContain("stage_mode_outcome");
  });

  it("classifies discriminating-test validity failures with both timing and validity signals", () => {
    const gates = inferBatchGatesFromError(
      "Discriminating test validity failed: chapter must state competing theory and an observable result.",
    );

    expect(gates).toContain("clue_placement_timing");
    expect(gates).toContain("discriminating_test_validity");
  });

  it("classifies final reveal completeness failures", () => {
    const gates = inferBatchGatesFromError(
      "Final reveal completeness failed: reveal must include motive and opportunity linkage.",
    );

    expect(gates).toContain("final_reveal_completeness");
  });

  it("falls back to completeness_structure when no known signal is present", () => {
    const gates = inferBatchGatesFromError("unexpected validator noise");
    expect(gates).toStrictEqual(["completeness_structure"]);
  });
});
