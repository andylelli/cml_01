/**
 * A_80 F12/F13 — two guards that could have caught run mystery-1788202899854 and could not fire.
 *
 * The rule these tests exist to enforce: **a check that has never fired must prove it can fire.**
 * Both of these had a clean record across 44 archived runs, and in both cases the silence was
 * structural rather than earned — one could not parse the pipeline's own time format, the other ran
 * before the data it reads was assigned. A known-positive fixture is the cheapest thing that would
 * have exposed either.
 */

import { describe, expect, it, beforeEach, afterEach } from 'vitest';

import { detectLockedFactClueTimeMismatch } from '../jobs/agents/agent9-run.js';
import { checkLockedFactTimeAlignment } from '../jobs/agents/agent3-run.js';

// ── F12 ───────────────────────────────────────────────────────────────────────────────────────
describe('F12 — the hard abort can read word-form times', () => {
  const prior = process.env.AGENT9_CLUE_TIME_WORDFORM;
  const withFlag = (v: string, fn: () => void) => {
    process.env.AGENT9_CLUE_TIME_WORDFORM = v;
    try { fn(); } finally {
      if (prior === undefined) delete process.env.AGENT9_CLUE_TIME_WORDFORM;
      else process.env.AGENT9_CLUE_TIME_WORDFORM = prior;
    }
  };

  it('KNOWN POSITIVE: a word-form clue that contradicts the locked fact is detected when enabled', () => {
    withFlag('true', () => {
      // The shape of run mystery-1788202899854: the fact says one time, the clue says another.
      const hit = detectLockedFactClueTimeMismatch(
        'twenty-five minutes past ten',
        'The receptionist recorded the arrival at half past eleven, well after the chime.',
      );
      expect(hit).not.toBeNull();
    });
  });

  it('is a NO-OP when the flag is off — this is a hard abort that has never fired', () => {
    withFlag('', () => {
      expect(
        detectLockedFactClueTimeMismatch(
          'twenty-five minutes past ten',
          'The receptionist recorded the arrival at half past eleven, well after the chime.',
        ),
      ).toBeNull();
    });
  });

  it('digit-form clues still work with the flag off (the pre-existing path is untouched)', () => {
    withFlag('', () => {
      expect(detectLockedFactClueTimeMismatch('eleven o’clock', 'A witness heard the noise at 8:30 PM.')).not.toBeNull();
    });
  });

  it('does not fire when the word-form times agree', () => {
    withFlag('true', () => {
      expect(
        detectLockedFactClueTimeMismatch('half past ten', 'The clock in the lobby stood at half past ten.'),
      ).toBeNull();
    });
  });
});

// ── F13 ───────────────────────────────────────────────────────────────────────────────────────
describe('F13 — the alignment check reports when its data exists', () => {
  const ctxWith = (cml: unknown, registry: unknown[]) =>
    ({ cml, lockedFactRegistry: registry, warnings: [], errors: [] }) as any;

  const stagedFact = {
    id: 'clock_time_seen',
    description: 'The apparent time displayed on the grandfather clock',
    value: 'twenty-five minutes past ten',
  };

  it('KNOWN POSITIVE: reports when the case stages a different time from the locked fact', () => {
    const findings = checkLockedFactTimeAlignment(
      ctxWith({ CASE: { hidden_model: { mechanism: { apparent_time_of_death: 'half past ten' } } } }, [stagedFact]),
    );
    expect(findings.length).toBeGreaterThan(0);
    expect(findings[0]).toContain('half past ten');
  });

  it('is silent when they agree', () => {
    expect(
      checkLockedFactTimeAlignment(
        ctxWith(
          { CASE: { hidden_model: { mechanism: { apparent_time_of_death: 'twenty-five minutes past ten' } } } },
          [stagedFact],
        ),
      ),
    ).toEqual([]);
  });

  it('reports an actual_time_of_death that no locked fact binds', () => {
    const findings = checkLockedFactTimeAlignment(
      ctxWith({ CASE: { hidden_model: { mechanism: { actual_time_of_death: 'half past ten' } } } }, [stagedFact]),
    );
    expect(findings.some((f) => f.includes('actual_time_of_death'))).toBe(true);
  });

  it('THE ORIGINAL DEFECT: an unassigned ctx.cml yields nothing — which is why the early call was dead', () => {
    // This is the state the only call site saw: ctx.cml undefined, so both fields are "" and the
    // function returns [] while looking exactly like a pass.
    expect(checkLockedFactTimeAlignment(ctxWith(undefined, [stagedFact]))).toEqual([]);
  });
});
