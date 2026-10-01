import { afterEach, describe, expect, it, vi } from "vitest";

/**
 * A6-Q02 (owner decision 12, CML_VERIFIED_FIXES): the World Builder exhausting its attempts degrades to the normalised
 * default World Document with a floor warning instead of aborting the run. OFF: it throws, as before.
 */
vi.mock("@cml/prompts-llm", async (importOriginal) => ({
  ...(await importOriginal<typeof import("@cml/prompts-llm")>()),
  generateWorldDocument: vi.fn(async () => { throw new Error("World Builder failed after 3 attempts"); }),
}));

const { runAgent65 } = await import("../jobs/agents/agent65-run.js");

const ctx = () => ({
  runId: "run_a6q02",
  projectId: "proj_a6q02",
  enableScoring: false,
  warnings: [] as string[],
  errors: [] as string[],
  agentCosts: {} as Record<string, number>,
  agentDurations: {} as Record<string, number>,
  reportProgress: () => {},
  savePartialReport: async () => {},
  cml: { CASE: { meta: { title: "T" }, cast: [] } },
  temporalContext: { specificDate: { year: 1932, month: "October", day: 4 } },
  client: { getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Agent65-WorldBuilder": 0.02 } }) }) },
}) as any;

afterEach(() => { delete process.env.CML_VERIFIED_FIXES; });

describe("A6-Q02 — World Builder failure", () => {
  it("OFF: the failure aborts the run (unchanged)", async () => {
    await expect(runAgent65(ctx())).rejects.toThrow(/World Builder failed/);
  });

  it("ON: continues with the normalised default document, its spent cost, and a floor warning", async () => {
    process.env.CML_VERIFIED_FIXES = "1";
    const c = ctx();
    await runAgent65(c);
    expect(c.worldDocument).toBeTruthy();
    expect(c.worldDocument.cost).toBe(0.02);
    expect(Array.isArray(c.worldDocument.characterPortraits)).toBe(true);
    expect(c.warnings.some((w: string) => w.startsWith("[A6-Q02]"))).toBe(true);
  });
});
