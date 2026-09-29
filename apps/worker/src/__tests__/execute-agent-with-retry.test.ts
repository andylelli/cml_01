import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { executeAgentWithRetry } from "../jobs/agents/shared.js";

/**
 * CR-06 — the shared scoring-retry wrapper.
 *
 * COST (ORC-D03 / A5-D02 / A7-D03): every generator returns its label's RUNNING total on the client
 * (cost-tracker `byAgent`), so the wrapper keeps the latest figure. It summed them: three attempts
 * costing 1 each (running totals 1, 2, 3) reported 6.
 *
 * BACKOFF (SCO-D05): the delay before a retry is read before the retry is recorded, so the first
 * retry waits the base delay rather than the second retry's.
 */
describe("executeAgentWithRetry", () => {
  const prev = process.env.AGENT_PRE9_ENABLE_LLM_RETRIES;
  beforeEach(() => { process.env.AGENT_PRE9_ENABLE_LLM_RETRIES = "true"; });
  afterEach(() => {
    if (prev === undefined) delete process.env.AGENT_PRE9_ENABLE_LLM_RETRIES;
    else process.env.AGENT_PRE9_ENABLE_LLM_RETRIES = prev;
  });

  function harness(passOnAttempt: number) {
    let count = 0;
    const backoffsRead: Array<{ count: number }> = [];
    const retryManager = {
      canRetry: () => true,
      shouldAbortOnMaxRetries: () => false,
      recordRetry: () => { count++; },
      getBackoffDelay: () => { backoffsRead.push({ count }); return 0; },
      getMaxRetries: () => 5,
    };
    let scored = 0;
    const scoreAggregator = {
      upsertPhaseScore: () => {},
      passesThreshold: () => ++scored >= passOnAttempt,
    };
    const scoringLogger = { logPhaseScore: () => {}, logRetryAttempt: () => {}, logScoringError: () => {} };
    return { retryManager, scoreAggregator, scoringLogger, backoffsRead };
  }

  it("reports the stage's cost once, not the sum of running totals", async () => {
    const h = harness(3);
    let running = 0;
    const out = await executeAgentWithRetry(
      "agent1_setting",
      "Setting",
      async () => { running += 1; return { result: {}, cost: running }; },
      async () => ({ adapted: {}, score: { total: 50, grade: "F", passed: false, tests: [] } as any }),
      h.retryManager as any,
      h.scoreAggregator as any,
      h.scoringLogger as any,
      "run",
      "proj",
      [],
    );
    expect(out.retryCount).toBe(2);
    expect(out.cost).toBe(3);
  });

  it("reads each retry's backoff before recording it", async () => {
    const h = harness(3);
    await executeAgentWithRetry(
      "agent1_setting",
      "Setting",
      async () => ({ result: {}, cost: 0 }),
      async () => ({ adapted: {}, score: { total: 50, grade: "F", passed: false, tests: [] } as any }),
      h.retryManager as any,
      h.scoreAggregator as any,
      h.scoringLogger as any,
      "run",
      "proj",
      [],
    );
    expect(h.backoffsRead.map((b) => b.count)).toEqual([0, 1]);
  });
});
