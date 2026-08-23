/**
 * PLAN-TO-90 Phase 0a.3 — the cost figure must say what it does not know.
 *
 * `calculateCost` prices every prompt token at the full input rate. Azure serves a share of them from
 * its automatic prompt cache at a reduced rate, so the number is an UPPER BOUND — and until now the
 * report said nothing about that.
 *
 * MEASURED 2026-08-21 over the only two runs carrying the telemetry (`mystery-1785689662702`,
 * `-1785694688534`): **30–31% of prompt tokens were cache-served**, and per stage the split is
 * sharper — 6–12% on a chapter's first attempt against **88–97% on a retry of the same chapter**.
 *
 * This is the third defect of one shape in this file, after the `gpt-4.1` branch that fell through to
 * GPT-3.5 rates and under-reported by ~6×, and the dead `gpt-4.1-mini` branch before it. So the fix
 * deliberately RECORDS rather than re-prices: a third guessed rate is not an improvement on a missing
 * one. The distinction the tests below exist to hold is the one that keeps being lost —
 * **unmeasured is not zero.**
 */

import { describe, expect, it } from 'vitest';

import { CostTracker } from '../cost-tracker.js';

const usage = (promptTokens: number, completionTokens: number, cachedPromptTokens?: number) => ({
  promptTokens,
  completionTokens,
  totalTokens: promptTokens + completionTokens,
  ...(cachedPromptTokens !== undefined ? { cachedPromptTokens } : {}),
});

describe('cached prompt tokens are recorded', () => {
  it('reports the hit rate over the calls that could be observed', () => {
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(20_000, 2_000, 2_000), 'Agent9-ProseGenerator-Ch1');
    t.trackCost('gpt-4.1', usage(24_000, 2_000, 23_000), 'Agent9-ProseGenerator-Ch1');

    const s = t.getSummary();
    expect(s.cachedPromptTokens).toBe(25_000);
    expect(s.promptTokensTotal).toBe(44_000);
    expect(s.cacheHitRate).toBeCloseTo(25_000 / 44_000, 5);
  });

  it('marks the cost as an upper bound whenever any hit was seen', () => {
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(10_000, 1_000, 4_000));
    expect(t.getSummary().costIsUpperBound).toBe(true);
  });

  it('does not mark it an upper bound when nothing was cached', () => {
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(10_000, 1_000, 0));
    const s = t.getSummary();
    expect(s.costIsUpperBound).toBe(false);
    expect(s.cacheHitRate).toBe(0);
  });
});

describe('UNMEASURED is not ZERO — the distinction 0a.1 exists to preserve', () => {
  it('reports a null hit rate when no call carried telemetry', () => {
    // The SDK transport omits `cachedPromptTokens` entirely. Reporting 0 here would make an
    // unobserved run indistinguishable from a run with no cache hits — which is how a configured
    // lever comes to look like a dead one.
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(30_000, 3_000));
    t.trackCost('gpt-4.1-mini', usage(5_000, 500));

    const s = t.getSummary();
    expect(s.cacheHitRate).toBeNull();
    expect(s.cacheTelemetryCoverage).toBe(0);
    expect(s.costIsUpperBound).toBe(false);
  });

  it('reports partial coverage when only some calls carried telemetry', () => {
    // Today's real shape: 110 of 1,503 logged calls carry the field. A hit rate computed over the
    // whole run would be wrong; computed over the observed slice it is honest, and the coverage
    // figure says how much to trust it.
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(10_000, 1_000, 5_000)); // observed
    t.trackCost('gpt-4.1', usage(30_000, 3_000)); //          not observed

    const s = t.getSummary();
    expect(s.cacheHitRate).toBeCloseTo(0.5, 5); // over the observed 10,000 only
    expect(s.cacheTelemetryCoverage).toBeCloseTo(10_000 / 40_000, 5);
  });

  it('clears the new counters on reset, like every other total', () => {
    const t = new CostTracker();
    t.trackCost('gpt-4.1', usage(10_000, 1_000, 5_000));
    t.reset();

    const s = t.getSummary();
    expect(s.cachedPromptTokens).toBe(0);
    expect(s.promptTokensTotal).toBe(0);
    expect(s.cacheHitRate).toBeNull();
  });
});

describe('the recorded COST is unchanged — this adds visibility, not a discount', () => {
  it('prices a cached call identically to an uncached one', () => {
    // Deliberate. Applying a discount needs Azure's cached-input rate, and this file has been wrong
    // about rates twice. Whoever confirms it against an invoice applies it in one place.
    const withCache = new CostTracker();
    const without = new CostTracker();
    const cost1 = withCache.trackCost('gpt-4.1', usage(20_000, 2_000, 18_000));
    const cost2 = without.trackCost('gpt-4.1', usage(20_000, 2_000));

    expect(cost1).toBe(cost2);
    expect(withCache.getSummary().costIsUpperBound).toBe(true);
    expect(without.getSummary().costIsUpperBound).toBe(false);
  });
});
