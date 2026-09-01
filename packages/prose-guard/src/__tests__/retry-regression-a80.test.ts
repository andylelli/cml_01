/**
 * A_80 F3 — a retry must not lose what the original had.
 *
 * The fixture at the top is the actual regression from run mystery-1788202899854: chapter 8's first
 * draft stated the arithmetic correctly, a leakage rule matched "required to", and the regenerated
 * chapter shipped with the two times collapsed into one. The external reader scored the clue logic
 * 4/10 for it.
 *
 * The false-positive tests matter as much as the catch. The first version of the clock-time pattern
 * used an open `[a-z-]+` class and matched "required to set" — reproducing, inside the guard, the
 * exact defect the guard exists to contain.
 */

import { describe, expect, it } from 'vitest';

import {
  detectRetryRegression,
  describeRetryLosses,
  retryRegressionGuardEnabled,
} from '../retry-regression.js';

const LOCKED = ['twenty-five minutes past ten', 'half past ten', 'five minutes'];

const ORIGINAL =
  'He explained that the clock was wound backward by five minutes, as was required to set the hands ' +
  'from half past ten to twenty-five minutes past ten.';

describe('the run mystery-1788202899854 regression', () => {
  it('catches the retry that collapsed the two times', () => {
    const shipped =
      'He explained that the clock was wound backward by exactly five minutes and set the hands from ' +
      'twenty-five minutes past ten to twenty-five minutes past ten.';
    const losses = detectRetryRegression({ original: ORIGINAL, candidate: shipped, lockedFactValues: LOCKED });
    expect(losses.length).toBeGreaterThan(0);
    expect(losses.some((l) => l.kind === 'locked_fact' && l.value === 'half past ten')).toBe(true);
  });
});

describe('legitimate rewrites are not regressions', () => {
  it.each([
    ['reworded, facts kept', 'The clock, he said, had been wound back five minutes: the hands moved from half past ten to twenty-five minutes past ten.'],
    ['restructured and expanded', 'Wound back five minutes. The hands had shifted from half past ten to twenty-five minutes past ten, and nobody in the lobby had noticed a thing.'],
    ['recast as dialogue', '"Five minutes," he said. "From half past ten to twenty-five minutes past ten. That is all it took."'],
  ])('accepts a %s', (_label, candidate) => {
    expect(detectRetryRegression({ original: ORIGINAL, candidate, lockedFactValues: LOCKED })).toEqual([]);
  });

  it('does NOT treat "required to set" as a clock time', () => {
    // The open-class version of the pattern matched this. A word that is not a number is not a time.
    const losses = detectRetryRegression({
      original: 'as was required to set the hands',
      candidate: 'as the hands were set',
    });
    expect(losses).toEqual([]);
  });
});

describe('scope', () => {
  it('does not blame a retry for a fact the original never had', () => {
    expect(
      detectRetryRegression({
        original: 'Nothing about the time was mentioned at all.',
        candidate: 'Still nothing about the time.',
        lockedFactValues: LOCKED,
      }),
    ).toEqual([]);
  });

  it('reports lost clue identifiers', () => {
    const losses = detectRetryRegression({
      original: 'The scratch on the winding arbor was unmistakable.',
      candidate: 'The mechanism showed wear.',
      clueIds: ['winding arbor'],
    });
    expect(losses.some((l) => l.kind === 'clue_id')).toBe(true);
  });

  it('is empty for empty input rather than throwing', () => {
    expect(detectRetryRegression({ original: '', candidate: '' })).toEqual([]);
  });

  it('summarises losses for the run log', () => {
    expect(describeRetryLosses([{ kind: 'locked_fact', value: 'half past ten' }])).toContain('half past ten');
  });
});

describe('the flag', () => {
  it('is OFF by default and read at call time', () => {
    const prior = process.env.AGENT9_RETRY_REGRESSION_GUARD;
    try {
      process.env.AGENT9_RETRY_REGRESSION_GUARD = '';
      expect(retryRegressionGuardEnabled()).toBe(false);
      process.env.AGENT9_RETRY_REGRESSION_GUARD = 'true';
      expect(retryRegressionGuardEnabled()).toBe(true);
    } finally {
      if (prior === undefined) delete process.env.AGENT9_RETRY_REGRESSION_GUARD;
      else process.env.AGENT9_RETRY_REGRESSION_GUARD = prior;
    }
  });
});
