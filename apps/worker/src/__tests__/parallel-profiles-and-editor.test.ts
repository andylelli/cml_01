/**
 * AGENT_PROFILES_PARALLEL and PROSE_V2_EDITOR_PARALLEL — the two concurrency levers.
 *
 * Profiles: the parallel branch used `Promise.all`, which rejected on the first failure and skipped
 * the merge, so the failing agent's own warnings and a finished sibling's artifact were lost. These
 * tests run the real branch against stub agents.
 *
 * Editor: `settledInOrder` is the pool the editor round runs through. It must return results in
 * INPUT order, hold at most `limit` calls open, and isolate one failure from the rest.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const agents = vi.hoisted(() => ({
  runAgent2b: vi.fn(),
  runAgent2c: vi.fn(),
  runAgent2d: vi.fn(),
}));

vi.mock("../jobs/agents/index.js", async (importOriginal) => ({
  ...(await importOriginal<Record<string, unknown>>()),
  ...agents,
}));

import { runProfileStages } from "../jobs/pipeline/stages.js";
import { ResumeSkipTracker } from "../jobs/resume-hydration.js";
import { settledInOrder } from "../jobs/agents/agent9-v2/run.js";
import type { OrchestratorContext } from "../jobs/agents/index.js";

const tick = (ms: number) => new Promise((r) => setTimeout(r, ms));

const freshCtx = () =>
  ({ warnings: ["before"], savePartialReport: vi.fn(async () => {}) }) as unknown as OrchestratorContext & {
    savePartialReport: ReturnType<typeof vi.fn>;
  };

describe("runProfileStages — AGENT_PROFILES_PARALLEL=1", () => {
  beforeEach(() => {
    process.env.AGENT_PROFILES_PARALLEL = "1";
    // 2d finishes FIRST, 2b last: merge order must still be 2b → 2c → 2d.
    agents.runAgent2b.mockImplementation(async (c: OrchestratorContext) => {
      await tick(30);
      c.warnings.push("2b");
      (c as unknown as Record<string, unknown>).characterProfiles = { profiles: ["b"] };
    });
    agents.runAgent2c.mockImplementation(async (c: OrchestratorContext) => {
      await tick(15);
      c.warnings.push("2c");
      (c as unknown as Record<string, unknown>).locationProfiles = { locations: ["c"] };
    });
    agents.runAgent2d.mockImplementation(async (c: OrchestratorContext) => {
      c.warnings.push("2d");
      (c as unknown as Record<string, unknown>).temporalContext = { t: "d" };
    });
  });
  afterEach(() => {
    delete process.env.AGENT_PROFILES_PARALLEL;
    vi.clearAllMocks();
  });

  const run = (ctx: OrchestratorContext) =>
    runProfileStages(ctx, new ResumeSkipTracker(), [], async () => {
      throw new Error("the sequential path must not run with the flag on");
    });

  it("runs all three at once and merges in 2b → 2c → 2d order, not arrival order", async () => {
    const ctx = freshCtx();
    const started = Date.now();
    await run(ctx);
    expect(Date.now() - started).toBeLessThan(45 + 15); // 30 ms, not 30 + 15 sequential
    expect(ctx.warnings.filter((w) => !w.startsWith("[R9]"))).toEqual(["before", "2b", "2c", "2d"]);
    expect(ctx.characterProfiles).toEqual({ profiles: ["b"] });
    expect(ctx.locationProfiles).toEqual({ locations: ["c"] });
    expect(ctx.temporalContext).toEqual({ t: "d" });
  });

  it("on a failure keeps the failing agent's warnings and the siblings' artifacts, then rethrows", async () => {
    agents.runAgent2c.mockImplementation(async (c: OrchestratorContext) => {
      c.warnings.push("2c diagnosis");
      throw new Error("2c failed");
    });
    const ctx = freshCtx();
    await expect(run(ctx)).rejects.toThrow("2c failed");
    expect(ctx.warnings).toContain("2c diagnosis");
    expect(ctx.characterProfiles).toEqual({ profiles: ["b"] });
    expect(ctx.temporalContext).toEqual({ t: "d" });
    expect(ctx.locationProfiles).toBeUndefined();
    expect(ctx.savePartialReport).toHaveBeenCalled();
  });

  it("rethrows the FIRST failure in stage order, as the sequential path would", async () => {
    agents.runAgent2b.mockImplementation(async () => {
      await tick(20);
      throw new Error("2b failed");
    });
    agents.runAgent2d.mockImplementation(async () => {
      throw new Error("2d failed");
    });
    await expect(run(freshCtx())).rejects.toThrow("2b failed");
  });
});

describe("settledInOrder — the editor pool", () => {
  it("returns results in input order, whatever order they finish in", async () => {
    const out = await settledInOrder([30, 0, 15], 3, async (ms) => {
      await tick(ms);
      return ms;
    });
    expect(out.map((r) => (r.status === "fulfilled" ? r.value : null))).toEqual([30, 0, 15]);
  });

  it("never holds more than `limit` calls open, and limit 1 is strictly sequential", async () => {
    for (const limit of [1, 4]) {
      let open = 0;
      let peak = 0;
      const order: number[] = [];
      await settledInOrder([1, 2, 3, 4, 5, 6, 7, 8, 9, 10], limit, async (n) => {
        open += 1;
        peak = Math.max(peak, open);
        order.push(n);
        await tick(5);
        open -= 1;
      });
      expect(peak).toBe(limit);
      expect(order).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
    }
  });

  it("isolates a failure to its own slot", async () => {
    const out = await settledInOrder([1, 2, 3], 4, async (n) => {
      if (n === 2) throw new Error("editor down");
      return n;
    });
    expect(out.map((r) => r.status)).toEqual(["fulfilled", "rejected", "fulfilled"]);
    expect((out[1] as PromiseRejectedResult).reason.message).toBe("editor down");
  });

  it("handles an empty round", async () => {
    expect(await settledInOrder([], 4, async () => 1)).toEqual([]);
  });
});
