import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it, vi } from "vitest";

/**
 * A1X-Q02 (owner decision, 2026-10-02) — Agents 1, 2 and 2c score the SHIPPED artifact, not the raw LLM output.
 * The score used to be taken inside runStage, before the runner's post-processing (backfill, normaliseCastOutput,
 * applyCastGenders, compileSensoryAtoms, enforceLocationSensoryFallbacks). Pinned on Agent 1: the model returns a
 * setting with no `atmosphere` block, the runner backfills it, and the recorded score is the backfilled setting's.
 * The generate step is unchanged: one refineSetting call with the same inputs.
 */
const GOLDEN = join(__dirname, "..", "..", "..", "..", "eval", "golden");
const goldenSetting = JSON.parse(readFileSync(join(GOLDEN, "bundle-56049d93.json"), "utf8")).artifacts.setting;

const refineCalls: unknown[] = [];
vi.mock("@cml/prompts-llm", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@cml/prompts-llm")>();
  return {
    ...actual,
    refineSetting: vi.fn(async (_client: unknown, inputs: unknown) => {
      refineCalls.push(inputs);
      const raw = JSON.parse(JSON.stringify(goldenSetting));
      delete raw.setting.atmosphere; // the raw output lacks the block the honest scorer critical-fails on
      return { ...raw, cost: 0.01 };
    }),
  };
});

const { runAgent1 } = await import("../jobs/agents/agent1-run.js");
const { recordShippedPhaseScore, runUnscoredStage } = await import("../jobs/agents/phase-scoring.js");

const scoringCtx = () => {
  const recorded: Array<{ agent: string; score: any; durationMs: number; cost: number }> = [];
  const logged: string[] = [];
  return {
    recorded,
    logged,
    ctx: {
      enableScoring: true,
      retryManager: {},
      scoreAggregator: {
        upsertPhaseScore: (agent: string, _p: string, score: any, durationMs: number, cost: number) => recorded.push({ agent, score, durationMs, cost }),
        passesThreshold: (s: any) => s.passed,
      },
      scoringLogger: { logPhaseScore: (a: string) => logged.push(a), logScoringError: (a: string) => logged.push(`error:${a}`) },
      runId: "run_x", projectId: "proj_x", warnings: [] as string[], errors: [] as string[],
      savePartialReport: async () => {},
      agentCosts: {} as Record<string, number>, agentDurations: {} as Record<string, number>,
    },
  };
};

describe("A1X-Q02 — the report scores the shipped artifact", () => {
  it("Agent 1: the backfilled setting is scored, once, after post-processing", async () => {
    const { ctx, recorded, logged } = scoringCtx();
    const full = {
      ...ctx,
      client: {},
      inputs: { eraPreference: "1930s", tone: "Classic" },
      locationSpec: { location: "Winthrope Manor", institution: "Manor house" },
      reportProgress: () => {},
    };
    await runAgent1(full as any);

    expect(refineCalls).toHaveLength(1);
    expect((full as any).setting.setting.atmosphere).toBeTruthy(); // backfilled
    expect(recorded).toHaveLength(1);
    expect(logged).toEqual(["agent1_setting"]);
    const { agent, score, cost } = recorded[0];
    expect(agent).toBe("agent1_setting");
    expect(cost).toBe(0.01);
    // The raw output would critical-fail 'Atmosphere present'; the shipped one passes it.
    expect(score.tests.find((t: any) => t.name === "Atmosphere present")?.passed).toBe(true);
  });

  it("runUnscoredStage generates once and never scores, even with scoring on", async () => {
    const { ctx, recorded } = scoringCtx();
    let calls = 0;
    const out = await runUnscoredStage(ctx as any, {
      agentId: "agent2_cast", phaseName: "Cast Design",
      generate: async () => { calls++; return { result: { cast: 1 }, cost: 0.5 }; },
    });
    expect(out).toEqual({ cast: 1 });
    expect(calls).toBe(1);
    expect(recorded).toHaveLength(0);
    expect(ctx.agentCosts).toEqual({ agent2_cast: 0.5 });
  });

  it("recordShippedPhaseScore warns below threshold, reports a scorer error, and is silent with scoring off", async () => {
    const { ctx, recorded } = scoringCtx();
    ctx.agentCosts.agent2c_location_profiles = 0.2;
    await recordShippedPhaseScore(ctx as any, "agent2c_location_profiles", "Location Profiles",
      async () => ({ adapted: null, score: { total: 40, grade: "F", passed: false, tests: [] } as any }));
    expect(recorded.map((r) => [r.score.total, r.cost])).toEqual([[40, 0.2]]);
    expect(ctx.warnings.join("\n")).toMatch(/Location Profiles: below threshold \(score 40\/100, F\) — recorded, not retried/);

    await recordShippedPhaseScore(ctx as any, "agent2_cast", "Cast Design", async () => { throw new Error("boom"); });
    expect(ctx.warnings.join("\n")).toMatch(/Cast Design: Scoring failed - .*boom.* - continuing without retry/);

    const off = { ...scoringCtx().ctx, enableScoring: false };
    let scored = 0;
    await recordShippedPhaseScore(off as any, "agent1_setting", "Setting", async () => { scored++; return {} as any; });
    expect(scored).toBe(0);
  });
});
