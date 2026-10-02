/**
 * A6-08 (R1): the critical-rule predicate keeps today's case-sensitive matching.
 * (The A34-D09 revision-install tests went with the structural CML revision itself — owner decision A6-Q01,
 * 2026-10-02, retired Agent 6's AGENT_PRE9_ENABLE_LLM_RETRIES arm.)
 */
import { describe, expect, it } from "vitest";

import { hasCriticalFairPlayViolations } from "../jobs/agents/agent6/structural-retry.js";
import { CRITICAL_FAIR_PLAY_RULES, isCriticalFairPlayViolation } from "../jobs/agents/context.js";

describe("A6-08 (R1) — critical-rule matching is unchanged", () => {
  const audit = (rule: string, severity = "moderate"): any => ({ overallStatus: "fail", violations: [{ rule, severity, description: "d" }] });

  it("title-case names match; any other casing does not (the preserved defect)", () => {
    const rules = new Set<string>(CRITICAL_FAIR_PLAY_RULES);
    expect(hasCriticalFairPlayViolations(audit("Clue Visibility"), rules)).toBe(true);
    expect(hasCriticalFairPlayViolations(audit("clue visibility"), rules)).toBe(false);
    expect(hasCriticalFairPlayViolations(audit("Clue Coverage"), rules)).toBe(false);
    expect(hasCriticalFairPlayViolations(audit("anything", "critical"), rules)).toBe(true);
  });

  it("the caller's set decides membership, as before", () => {
    expect(hasCriticalFairPlayViolations(audit("Discriminating Test Timing"), new Set(["Discriminating Test Timing"]))).toBe(true);
    expect(isCriticalFairPlayViolation({ rule: "No Withholding", severity: "minor" })).toBe(true);
    expect(isCriticalFairPlayViolation({ rule: "NO WITHHOLDING", severity: "minor" })).toBe(false);
  });
});
