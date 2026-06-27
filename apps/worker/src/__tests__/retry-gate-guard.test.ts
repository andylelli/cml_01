/**
 * ANALYSIS_50 hardening — retry-gate guard: one retry-bearing enforce gate per run,
 * with a worst-case extra-call estimate. Default (no enforce flags) is a no-op.
 */
import { describe, expect, it } from "vitest";
import { assessRetryGates, evaluateRetryGateGuard } from "../jobs/retry-gate-guard.js";

describe("assessRetryGates", () => {
  it("returns nothing when no enforce gates are set (default-OFF)", () => {
    const r = assessRetryGates({});
    expect(r.active).toHaveLength(0);
    expect(r.worstCaseExtraCalls).toBe(0);
  });

  it("counts only enforce (not shadow/off) gates", () => {
    const r = assessRetryGates({
      AGENT2B_VOICE_CHECK: "shadow",
      AGENT3B_PLAUSIBILITY_JUDGE: "enforce",
      AGENT2C_SCENE_GATE: "off",
    });
    expect(r.active.map((g) => g.flag)).toEqual(["AGENT3B_PLAUSIBILITY_JUDGE"]);
  });

  it("estimates worst-case extra calls from the per-gate caps", () => {
    // plausibility: 1 + 2*retries (cap 3); scene: retries (cap 2)
    const r = assessRetryGates({
      AGENT3B_PLAUSIBILITY_JUDGE: "enforce",
      AGENT3B_PLAUSIBILITY_MAX_RETRIES: "2",
      AGENT2C_SCENE_GATE: "enforce",
      AGENT2C_SCENE_GATE_MAX_RETRIES: "2",
    });
    // 1 + 2*2 = 5  and  2  → 7
    expect(r.worstCaseExtraCalls).toBe(7);
  });

  it("counts novelty hard-fail only when cross-run is also on", () => {
    expect(assessRetryGates({ NOVELTY_HARD_FAIL: "true" }).active).toHaveLength(0);
    expect(assessRetryGates({ NOVELTY_CROSS_RUN: "1", NOVELTY_HARD_FAIL: "true" }).active.map((g) => g.flag)).toEqual([
      "NOVELTY_HARD_FAIL",
    ]);
  });
});

describe("evaluateRetryGateGuard", () => {
  it("is a silent no-op by default", () => {
    const r = evaluateRetryGateGuard({});
    expect(r.warnings).toHaveLength(0);
    expect(r.fatal).toBeUndefined();
  });

  it("warns (no fatal) when exactly one retry gate is enforced", () => {
    const r = evaluateRetryGateGuard({ AGENT6_REVEAL_GATE: "enforce" });
    expect(r.fatal).toBeUndefined();
    expect(r.warnings.join(" ")).toMatch(/1 retry-bearing gate/);
  });

  it("refuses to start when >1 retry gate is enforced", () => {
    const r = evaluateRetryGateGuard({
      AGENT2B_VOICE_CHECK: "enforce",
      AGENT6_REVEAL_GATE: "enforce",
    });
    expect(r.fatal).toMatch(/Refusing to start/);
    expect(r.fatal).toMatch(/AGENT2B_VOICE_CHECK/);
    expect(r.fatal).toMatch(/AGENT6_REVEAL_GATE/);
  });

  it("allows >1 when ALLOW_MULTIPLE_RETRY_GATES is set (deliberate override)", () => {
    const r = evaluateRetryGateGuard({
      AGENT2B_VOICE_CHECK: "enforce",
      AGENT6_REVEAL_GATE: "enforce",
      ALLOW_MULTIPLE_RETRY_GATES: "1",
    });
    expect(r.fatal).toBeUndefined();
    expect(r.warnings.join(" ")).toMatch(/2 retry-bearing gate/);
  });
});
