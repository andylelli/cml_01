import { describe, expect, it } from "vitest";

import { runStage } from "../jobs/agents/shared.js";

/**
 * CR-21 — runStage performs the scoring fork once. Owner decision 7 (2026-10-01, SCO-Q02 / ORC-Q01): there is
 * no phase-score retry and no abort-on-exhaustion — the loop ran only under AGENT_PRE9_ENABLE_LLM_RETRIES and
 * its abort was unreachable (ORC-11). Scoring on or off, a stage generates exactly once.
 */
describe("runStage", () => {
  const baseCtx = () => ({
    enableScoring: false, scoreAggregator: undefined, retryManager: undefined, scoringLogger: undefined,
    runId: "run", projectId: "proj", warnings: [] as string[], savePartialReport: async () => {},
    agentCosts: {} as Record<string, number>, agentDurations: {} as Record<string, number>,
  });

  it("scoring off: one call, no scoring, cost and duration recorded", async () => {
    const ctx = baseCtx();
    let calls = 0;
    let scored = 0;
    const result = await runStage(ctx as any, {
      agentId: "agent2d_temporal_context",
      phaseName: "Temporal Context",
      generate: async () => { calls++; return { result: { ok: 1 }, cost: 0.25 }; },
      score: async () => { scored++; return { adapted: {}, score: {} as any }; },
    });
    expect(result).toEqual({ ok: 1 });
    expect(calls).toBe(1);
    expect(scored).toBe(0);
    expect(ctx.agentCosts).toEqual({ agent2d_temporal_context: 0.25 });
    expect(typeof ctx.agentDurations.agent2d_temporal_context).toBe("number");
  });

  it("scoring on, below threshold: still ONE call — recorded, warned, never retried or aborted", async () => {
    const recorded: number[] = [];
    const ctx = {
      ...baseCtx(),
      enableScoring: true,
      retryManager: {},
      scoreAggregator: { upsertPhaseScore: (_a: string, _p: string, s: any) => recorded.push(s.total), passesThreshold: () => false },
      scoringLogger: { logPhaseScore: () => {}, logScoringError: () => {} },
    };
    let calls = 0;
    await runStage(ctx as any, {
      agentId: "agent1_setting",
      phaseName: "Setting",
      generate: async () => { calls++; return { result: {}, cost: 1.5 }; },
      score: async () => ({ adapted: {}, score: { total: 50, grade: "F", passed: false, tests: [] } as any }),
    });
    expect(calls).toBe(1);
    expect(recorded).toEqual([50]);
    expect(ctx.warnings.join("\n")).toMatch(/Setting: below threshold \(score 50\/100, F\) — recorded, not retried/);
    expect(ctx.agentCosts).toEqual({ agent1_setting: 1.5 });
  });

  it("a scoring error is reported and the result still returned", async () => {
    const ctx = {
      ...baseCtx(),
      enableScoring: true,
      retryManager: {},
      scoreAggregator: { upsertPhaseScore: () => {}, passesThreshold: () => true },
      scoringLogger: { logPhaseScore: () => {}, logScoringError: () => {} },
    };
    const result = await runStage(ctx as any, {
      agentId: "agent1_setting",
      phaseName: "Setting",
      generate: async () => ({ result: { ok: 2 }, cost: 0 }),
      score: async () => { throw new Error("scorer blew up"); },
    });
    expect(result).toEqual({ ok: 2 });
    expect(ctx.warnings.join("\n")).toMatch(/Setting: Scoring failed - .*scorer blew up.* - continuing without retry/);
  });
});
