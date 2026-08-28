/**
 * PASS 12 — the regen loop had no ceiling.
 *
 * `maxAttemptsPerDefect` (2) was the only bound, and the DEFECT COUNT is unbounded — however many
 * obligations the chapter failed. MEASURED on the arm-A run of 2026-08-27: regen was the single
 * largest consumer, 33 calls and 40% of wall-clock, more than chapter generation itself. ch3 took 20
 * of the 33 and EVERY ONE FAILED; the deterministic floor then pasted the key-term bags anyway, and
 * the reader's note on that manuscript was "the worst leakage is in Chapter 3".
 *
 * Those calls could not have worked: the defects share a chapter and a cause, and a rewrite that
 * cannot surface clue 1 will not surface clue 5.
 */

import { describe, expect, it, afterEach } from 'vitest';

import { runRegenRepair } from '../agent9-prose/regen-repair.js';
import type { ProseDefect } from '../agent9-prose/regen-repair.js';

const FLAG = 'AGENT9_REGEN_CONVERGENCE_STOP';
const prev = process.env[FLAG];
afterEach(() => {
  if (prev === undefined) delete process.env[FLAG];
  else process.env[FLAG] = prev;
  delete process.env.AGENT9_REGEN_CONVERGENCE_LIMIT;
});

const chapter = { title: 'Ch', paragraphs: ['The lamp guttered on the table.'] } as any;
const defects = (n: number, kind = 'missing_clue'): ProseDefect[] =>
  Array.from({ length: n }, (_, i) => ({
    chapter: 3, paragraphIndex: 0, kind: kind as any,
    detail: `clue_${i}`, obligationRef: `clue_${i}`, severity: 'hard' as const,
  }));

/** Always fails to repair — the ch3 shape. Counts how many LLM calls were spent. */
const failingRegen = (calls: { n: number }) => async () => { calls.n += 1; return chapter; };
const alwaysBad = () => ({ ok: false, score: 0, violations: ['still missing'] });

describe('with the flag OFF the loop is byte-identical to today', () => {
  it('spends 2 calls per defect, however many fail', async () => {
    delete process.env[FLAG];
    const calls = { n: 0 };
    const res = await runRegenRepair(
      chapter, defects(10), () => ({ system: 's', user: 'u' }) as any,
      failingRegen(calls), alwaysBad, {},
    );
    expect(calls.n).toBe(20);              // exactly the ch3 storm
    expect(res.unresolved).toHaveLength(10);
  });
});

describe('with the flag ON it stops once a kind has demonstrably failed', () => {
  it('cuts the ch3 storm from 20 calls to 6, and still reports every defect unresolved', async () => {
    process.env[FLAG] = 'true';
    const calls = { n: 0 };
    const unresolvedSeen: string[] = [];
    const res = await runRegenRepair(
      chapter, defects(10), () => ({ system: 's', user: 'u' }) as any,
      failingRegen(calls), alwaysBad,
      { onUnresolved: (d, why) => unresolvedSeen.push(`${d.obligationRef}:${why.slice(0, 24)}`) },
    );
    // 3 defects attempted at 2 calls each; the remaining 7 not attempted.
    expect(calls.n).toBe(6);
    // THE INVARIANT THAT MATTERS: nothing is silently dropped. The deterministic floor's input is
    // unchanged, so no obligation goes unmet as a result of saving the calls.
    expect(res.unresolved).toHaveLength(10);
    expect(unresolvedSeen.some((s) => s.includes('abandoned'))).toBe(true);
  });

  it('does NOT interrupt a chapter that is actually being repaired', async () => {
    process.env[FLAG] = 'true';
    const calls = { n: 0 };
    // Succeeds every time, so the counter resets and the full budget stays available.
    // `acceptanceReason` requires the score to IMPROVE, so the regen must actually change the
    // chapter and the validator must score the change — a validator returning a constant is
    // rejected as no-progress, which is the loop behaving correctly.
    let grown = chapter;
    const res = await runRegenRepair(
      chapter, defects(10), () => ({ system: 's', user: 'u' }) as any,
      async () => {
        calls.n += 1;
        grown = { ...grown, paragraphs: [...grown.paragraphs, 'She set the lamp down.'] };
        return grown;
      },
      (c: any) => ({ ok: true, score: (c.paragraphs?.length ?? 0) * 10, violations: [] }),
      {},
    );
    expect(res.unresolved).toHaveLength(0);
    expect(calls.n).toBe(10);
  });

  it('counts failures PER KIND — one hopeless kind must not starve another', async () => {
    process.env[FLAG] = 'true';
    const calls = { n: 0 };
    const mixed = [...defects(6, 'missing_clue'), ...defects(2, 'scaffold_not_prose')];
    await runRegenRepair(
      chapter, mixed, () => ({ system: 's', user: 'u' }) as any,
      failingRegen(calls), alwaysBad, {},
    );
    // 3 missing_clue attempted + both scaffold_not_prose attempted = 5 defects x 2 calls.
    expect(calls.n).toBe(10);
  });

  it('honours a configured limit', async () => {
    process.env[FLAG] = 'true';
    process.env.AGENT9_REGEN_CONVERGENCE_LIMIT = '5';
    const calls = { n: 0 };
    await runRegenRepair(
      chapter, defects(10), () => ({ system: 's', user: 'u' }) as any,
      failingRegen(calls), alwaysBad, {},
    );
    expect(calls.n).toBe(10);
  });
});
