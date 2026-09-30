import { describe, expect, it } from "vitest";

import { runBoundedGate, type BoundedGateSpec } from "../jobs/agents/quality-gate.js";

/**
 * CR-21 (A1X-06) — the bounded regenerate-with-feedback gate shared by Agent 2b's voice gate, Agent 2c's
 * scene gate and Agent 3b's plausibility judge. Before this, only the gates' pure predicates were tested.
 * The artifact here is a number of issues; a candidate is better when it has fewer.
 */
function harness(regens: Array<number | Error>, opts: { enforce?: boolean; maxRetries?: number; invalid?: number[] } = {}) {
  let charged = 0;
  const ctx = {
    client: { getCostTracker: () => ({ getSummary: () => ({ byAgent: { "Gen": charged } }) }) },
    warnings: [] as string[],
    agentCosts: { stage: 1 } as Record<string, number>,
    agentDurations: { stage: 0 } as Record<string, number>,
  };
  const feedbacks: string[] = [];
  let i = 0;
  const spec: BoundedGateSpec<number, number> = {
    label: "test-gate",
    enforce: opts.enforce ?? true,
    maxRetries: opts.maxRetries ?? 2,
    initial: 3,
    evaluate: (n) => n,
    needsRetry: (n) => n > 0,
    feedback: (best) => `fix ${best}`,
    retryWarning: (n, a, max) => `retry ${a}/${max} at ${n}`,
    regenerate: async (fb) => {
      feedbacks.push(fb);
      const next = regens[i++];
      charged += 0.5;
      if (next instanceof Error) throw next;
      return next;
    },
    costLabel: "Gen",
    costKey: "stage",
    validate: (n) => !(opts.invalid ?? []).includes(n),
    isBetter: (cand, cur) => cand.verdict < cur.verdict,
  };
  return { ctx, spec, feedbacks };
}

describe("runBoundedGate", () => {
  it("shadow: evaluates once, never regenerates", async () => {
    const h = harness([0], { enforce: false });
    const out = await runBoundedGate(h.ctx as any, h.spec);
    expect(out).toEqual({ best: 3, verdict: 3, attempts: 0 });
    expect(h.feedbacks).toEqual([]);
  });

  it("enforce: regenerates with feedback from the best, stops on a pass, charges the cost delta", async () => {
    const h = harness([1, 0], { maxRetries: 3 });
    const out = await runBoundedGate(h.ctx as any, h.spec);
    expect(out).toEqual({ best: 0, verdict: 0, attempts: 2 });
    expect(h.feedbacks).toEqual(["fix 3", "fix 1"]);
    expect(h.ctx.warnings).toEqual(["retry 1/3 at 3", "retry 2/3 at 1"]);
    expect(h.ctx.agentCosts.stage).toBe(2); // 1 + two regenerations at 0.5
  });

  it("keeps the best when a candidate is worse, and stops at the retry bound", async () => {
    const h = harness([5, 4]);
    const out = await runBoundedGate(h.ctx as any, h.spec);
    expect(out).toEqual({ best: 3, verdict: 3, attempts: 2 });
  });

  it("a regeneration error keeps the best-so-far and ends the loop without throwing", async () => {
    const h = harness([2, new Error("boom"), 0], { maxRetries: 3 });
    const out = await runBoundedGate(h.ctx as any, h.spec);
    expect(out).toEqual({ best: 2, verdict: 2, attempts: 2 });
    expect(h.ctx.warnings.at(-1)).toBe("[test-gate][enforce] regeneration error: boom; keeping previous best.");
  });

  it("a candidate that fails validation is discarded, and the loop continues", async () => {
    const h = harness([0, 1], { invalid: [0] });
    const out = await runBoundedGate(h.ctx as any, h.spec);
    expect(out).toEqual({ best: 1, verdict: 1, attempts: 2 });
    expect(h.ctx.warnings).toContain("[test-gate][enforce] regenerated candidate failed schema validation; keeping previous best.");
  });
});
