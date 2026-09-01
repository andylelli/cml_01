/**
 * A_80 F15 — case-level temporal coherence.
 *
 * The defect: run mystery-1788287075975 locked a 25-minute clock shift, a lobby clock at 11:10, a
 * stopped pocket watch at 10:45 and a reported departure at 11:00. The first pair closes
 * (11:10 − 25 = 10:45). The departure does not: corrected it lands at 10:35, before the death — so
 * the tampering exonerates the suspect instead of incriminating him. The external read marked the
 * clue logic 4/10 and said the story "has not decided what Hale's false alibi is".
 *
 * It is a MEASURE, not a gate: 66.7% of archived clock cases fail the false/true rule and 60% fail
 * the inversion rule (scripts/a80-baseline-f15b.mjs), so blocking here would stop most clock
 * mysteries rather than fix any. These tests pin that it detects, and that it stays quiet on a case
 * whose arithmetic closes.
 */

import { describe, expect, it } from 'vitest';

import { reportCaseTemporalCoherence } from '../jobs/agents/agent3b-run.js';

const run = (registry: unknown[]) => {
  const ctx = { lockedFactRegistry: registry, warnings: [] as string[] } as any;
  reportCaseTemporalCoherence(ctx);
  return ctx.warnings as string[];
};

describe('the inverted mechanism', () => {
  it('flags the run that shipped it', () => {
    const warnings = run([
      { id: 'lobby_clock_time_seen', value: 'ten minutes past eleven', description: 'The time displayed on the lobby clock at the moment the murder was assumed to occur' },
      { id: 'suspect_departure_time_reported', value: "eleven o'clock", description: 'The time witnesses reported the suspect left the hotel' },
      { id: 'pocket_watch_time_found', value: 'quarter to eleven', description: "Time shown on the suspect's own pocket watch found in the room" },
      { id: 'clock_shift_interval', value: 'twenty-five minutes', description: 'How far the clock was moved' },
    ]);
    expect(warnings.some((w) => w.includes('INVERTED'))).toBe(true);
  });
});

describe('arithmetic that does not close', () => {
  it('flags a false/true pair that does not differ by the declared shift', () => {
    const warnings = run([
      { id: 'clock_time', value: 'ten minutes past nine', description: 'displayed on the clock' },
      { id: 'actual_time', value: 'a quarter past ten', description: 'the actual time of death' },
      { id: 'shift', value: 'ten minutes', description: 'how far the clock was moved' },
    ]);
    expect(warnings.some((w) => w.includes('does not close'))).toBe(true);
  });

  it('stays QUIET when the pair differs by exactly the shift', () => {
    const warnings = run([
      { id: 'clock_time_displayed', value: 'ten minutes past eleven', description: 'displayed on the clock' },
      { id: 'actual_time_of_death', value: 'quarter to eleven', description: 'the actual time of death' },
      { id: 'shift', value: 'twenty-five minutes', description: 'how far the clock was moved' },
    ]);
    expect(warnings.filter((w) => w.includes('does not close'))).toEqual([]);
  });
});

describe('scope', () => {
  it('is silent on a case with no declared shift', () => {
    expect(
      run([
        { id: 'clock_time_displayed', value: 'ten minutes past eleven', description: 'displayed' },
        { id: 'actual_time_of_death', value: 'quarter to eleven', description: 'actual' },
      ]),
    ).toEqual([]);
  });

  it('is silent on a case with no clock times', () => {
    expect(
      run([
        { id: 'murder_weapon', value: 'brass statue', description: 'the weapon' },
        { id: 'shift', value: 'twenty-five minutes', description: 'an interval' },
      ]),
    ).toEqual([]);
  });

  it('does not throw on an empty registry', () => {
    expect(run([])).toEqual([]);
  });
});
