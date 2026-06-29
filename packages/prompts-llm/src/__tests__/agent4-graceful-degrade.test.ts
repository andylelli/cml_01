import { afterEach, describe, expect, it } from "vitest";
import { reviseCml, type RevisionInputs } from "../agent4-revision.js";

const FLAG = "AGENT4_GRACEFUL_DEGRADE";

afterEach(() => {
  delete process.env[FLAG];
});

// Minimal mock of AzureOpenAIClient: returns fixed content, no-op logging/cost.
function mockClient(content: string) {
  const noop = async () => {};
  return {
    getLogger: () => ({ logRequest: noop, logResponse: noop, logError: noop }),
    getCostTracker: () => ({ getSummary: () => ({ byAgent: {} as Record<string, number> }) }),
    chat: async () => ({ content, model: "mock", latencyMs: 1, finishReason: "stop" }),
  } as any;
}

// A scalar (non-object) invalidCml means the normalizer can't recover a valid CML, so the degrade
// path keeps the unresolved errors — making the assertions below deterministic.
const baseInputs = (): RevisionInputs => ({
  originalPrompt: { system: "", developer: "", user: "axis: temporal" } as any,
  invalidCml: "scalar-not-an-object",
  validationErrors: ["CASE.meta.license is required", "CASE.culpability.culprits is required"],
  attempt: 1,
});

const UNPARSEABLE = "this is not json or a cml object at all";

describe("Agent 4 — graceful degrade on exhaustion (AGENT4_GRACEFUL_DEGRADE)", () => {
  // A_53 P2 (graceful-degrade-default-off-kills-runs): the default flipped to ON — a CML that merely
  // ran out of revisions degrades to best-so-far instead of killing ~30 agents of work.
  it("explicit off: exhaustion still THROWS — strict mode for reproducible eval", async () => {
    process.env[FLAG] = "off";
    await expect(reviseCml(mockClient(UNPARSEABLE), baseInputs(), 1)).rejects.toThrow(
      /parsing failed|revision failed/i,
    );
  });

  it("DEFAULT (unset): exhaustion DEGRADES — returns best-so-far + warnings instead of throwing", async () => {
    delete process.env[FLAG];
    const result = await reviseCml(mockClient(UNPARSEABLE), baseInputs(), 1);
    expect(result.degraded).toBe(true);
    expect(typeof result.cml).toBe("object");
    expect(result.cml).not.toBeNull();
    expect(Array.isArray(result.unresolvedLogicWarnings)).toBe(true);
    // it surfaced the failure as a revision note rather than crashing
    expect(result.revisionsApplied.some((r) => /degraded/i.test(r))).toBe(true);
  });

  it("flag on: exhaustion DEGRADES — returns best-so-far + warnings instead of throwing", async () => {
    process.env[FLAG] = "on";
    const result = await reviseCml(mockClient(UNPARSEABLE), baseInputs(), 1);
    expect(result.degraded).toBe(true);
    expect(typeof result.cml).toBe("object");
    expect(result.cml).not.toBeNull();
    expect(Array.isArray(result.unresolvedLogicWarnings)).toBe(true);
    expect(result.revisionsApplied.some((r) => /degraded/i.test(r))).toBe(true);
  });

  it("flag on: a degraded result is never a silent success — validation stays invalid + warnings present", async () => {
    process.env[FLAG] = "on";
    const result = await reviseCml(mockClient(UNPARSEABLE), baseInputs(), 1);
    expect(result.degraded).toBe(true);
    expect(result.unresolvedLogicWarnings!.length).toBeGreaterThan(0);
  });
});
