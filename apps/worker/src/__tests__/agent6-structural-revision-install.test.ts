/**
 * A34-D09 (unflagged; the arm runs only under AGENT_PRE9_ENABLE_LLM_RETRIES, OFF by default) and A34-11:
 * Agent 6's structural CML revision refuses a degraded or invalid Agent 4 result and keeps the prior CML.
 * A6-08 (R1): the critical-rule predicate keeps today's case-sensitive matching.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";

const mocks = vi.hoisted(() => ({ reviseCml: vi.fn(), extractClues: vi.fn() }));

vi.mock("@cml/prompts-llm", () => ({
  reviseCml: (...args: any[]) => mocks.reviseCml(...args),
  extractClues: (...args: any[]) => mocks.extractClues(...args),
  buildCMLPrompt: () => ({ system: "s", developer: "d", user: "u" }),
}));
vi.mock("../jobs/agents/agent6-escalation-policy.js", () => ({
  classifyFairPlayFailure: () => "clue_coverage",
  shouldEscalateStructuralCmlRevision: () => true,
}));
vi.mock("../jobs/agents/agent6/retry-contract.js", () => ({
  applyAgent5ContractsToRegeneratedClues: () => undefined,
  buildFairPlayFeedbackPayload: () => ({}),
  ensureCriticalFairPlayBackstopClues: () => [],
  ensureParityBridgeClue: () => undefined,
  runDeterministicStructuralAudit: () => ({ passed: true, gaps: [] }),
  refreshCoverageOnContext: (ctx: any) => { ctx.coverageResult = {}; },
}));
vi.mock("../jobs/agents/agent5/contract-payload.js", () => ({
  buildAgent5RegenerationContract: () => ({}),
  currentAgent5StrictBase: () => ({}),
}));

import { hasCriticalFairPlayViolations, retryCmlOnStructuralFailure } from "../jobs/agents/agent6/structural-retry.js";
import { CRITICAL_FAIR_PLAY_RULES, isCriticalFairPlayViolation } from "../jobs/agents/context.js";

const PRIOR = { CASE: { cast: [{ name: "Iwan Hale" }], inference_path: { steps: [{ observation: "o" }] } } };
const REVISED = { CASE: { cast: [{ name: "Iwan Hale" }], inference_path: { steps: [{ observation: "a" }, { observation: "b" }, { observation: "c" }] } } };

const setup = () => {
  const warnings: string[] = [];
  const ctx: any = {
    cml: PRIOR,
    client: {},
    inputs: {},
    hardLogicDirectives: { mechanismFamilies: ["x"], hardLogicModes: ["y"], complexityLevel: "moderate", difficultyMode: "standard" },
    reportProgress: () => undefined,
    agentCosts: {},
    agentDurations: {},
    warnings,
    runId: "r",
    projectId: "p",
  };
  const run: any = {
    retriesEnabled: true,
    retryBudget: { getConsumed: () => 0, consume: () => undefined },
    perCallCostDelta: () => 0,
    emitAgent6Warning: (m: string) => warnings.push(m),
    auditCurrentFairPlay: async () => ({ overallStatus: "pass", violations: [], cost: 0 }),
    clueDensity: "moderate",
    maxTargetedRegenAttempts: 3,
  };
  const state: any = { fairPlayAudit: { overallStatus: "fail", violations: [], cost: 0 } };
  const go = () =>
    retryCmlOnStructuralFailure(ctx, run, state, { passed: false, gaps: [{ description: "gap" }] } as any, true, 1, new Set(CRITICAL_FAIR_PLAY_RULES), async () => undefined);
  return { ctx, warnings, go };
};

beforeEach(() => {
  mocks.reviseCml.mockReset();
  mocks.extractClues.mockReset();
  mocks.extractClues.mockResolvedValue({ clues: [], redHerrings: [], cost: 0 });
});

describe("A34-D09 — a degraded or invalid revision is refused", () => {
  it("degraded: the prior CML stays, nothing is regenerated, and the refusal is reported", async () => {
    mocks.reviseCml.mockResolvedValue({
      cml: REVISED, validation: { valid: false, errors: ["e1"] }, revisionsApplied: [], attempt: 5, latencyMs: 1, cost: 0,
      degraded: true, unresolvedLogicWarnings: ["e1"],
    });
    const { ctx, warnings, go } = setup();
    await go();
    expect(ctx.cml).toBe(PRIOR);
    expect(ctx.revisedByAgent4FairPlay).toBeUndefined();
    expect(mocks.extractClues).not.toHaveBeenCalled();
    expect(warnings.some((w) => /structural CML revision refused \(degraded, 1 unresolved error\(s\): e1\)/.test(w))).toBe(true);
  });

  it("invalid but not marked degraded: refused too", async () => {
    mocks.reviseCml.mockResolvedValue({
      cml: REVISED, validation: { valid: false, errors: ["e2", "e3"] }, revisionsApplied: [], attempt: 1, latencyMs: 1, cost: 0, degraded: false,
    });
    const { ctx, warnings, go } = setup();
    await go();
    expect(ctx.cml).toBe(PRIOR);
    expect(warnings.some((w) => /refused \(invalid, 2 unresolved/.test(w))).toBe(true);
  });

  it("valid: installed exactly as before", async () => {
    mocks.reviseCml.mockResolvedValue({
      cml: REVISED, validation: { valid: true, errors: [] }, revisionsApplied: [], attempt: 1, latencyMs: 1, cost: 0, degraded: false,
    });
    const { ctx, warnings, go } = setup();
    await go();
    expect(ctx.cml).toBe(REVISED);
    expect(ctx.revisedByAgent4FairPlay).toBe(true);
    expect(mocks.extractClues).toHaveBeenCalledTimes(1);
    expect(warnings.some((w) => /refused/.test(w))).toBe(false);
  });

  it("valid with fewer than 3 steps: still not installed (unchanged rule)", async () => {
    mocks.reviseCml.mockResolvedValue({
      cml: PRIOR, validation: { valid: true, errors: [] }, revisionsApplied: [], attempt: 1, latencyMs: 1, cost: 0, degraded: false,
    });
    const { ctx, go } = setup();
    await go();
    expect(ctx.revisedByAgent4FairPlay).toBeUndefined();
    expect(mocks.extractClues).not.toHaveBeenCalled();
  });
});

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
