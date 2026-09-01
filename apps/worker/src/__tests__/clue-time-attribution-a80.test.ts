/**
 * A_80 F14 — mentioning an event is not the same as timing it.
 *
 * Run `mystery-1788285698781` (2026-09-01) was ABORTED by this gate on a locked fact
 * `staff_shift_change_time = "half past ten"` versus a clue about the kitchen service bell ringing at
 * a quarter past ten. Two different events. The clue paired with the fact only because it mentioned
 * the shift change in passing.
 *
 * The case being destroyed was built on exactly that disagreement — its own discriminating test reads
 * "comparing the lobby clock's displayed time with the independently timed kitchen service bell …
 * the displayed time remains twenty minutes behind the bell's chime". The gate aborted a
 * clock-tampering mystery for containing a second, disagreeing timepiece, which is the mechanism of
 * the entire sub-genre.
 */

import { describe, expect, it } from 'vitest';

import { findLockedFactClueTimeConflicts } from '../jobs/agents/agent5-run.js';

const cmlWith = (clueIds: string[]) =>
  ({
    CASE: { prose_requirements: { clue_to_scene_mapping: clueIds.map((clue_id) => ({ clue_id })) } },
  }) as any;

const cluesWith = (id: string, description: string) => ({ clues: [{ id, description }] }) as any;

const SHIFT_FACT = [
  { id: 'staff_shift_change_time', description: 'The time of the staff shift change', value: 'half past ten' },
];

describe('the run that was aborted', () => {
  it('does NOT flag a clue that times a DIFFERENT event and mentions this one in passing', () => {
    const conflicts = findLockedFactClueTimeConflicts(
      cmlWith(['clue_kitchen_service_bell_time']),
      cluesWith(
        'clue_kitchen_service_bell_time',
        'The kitchen service bell rang at a quarter past ten, and Captain Hale was seen near the lobby during the staff shift change.',
      ),
      SHIFT_FACT,
    );
    expect(conflicts).toEqual([]);
  });

  it('does NOT flag a discriminating test — two timepieces disagreeing IS the mechanism', () => {
    const conflicts = findLockedFactClueTimeConflicts(
      cmlWith(['clue_dt']),
      cluesWith(
        'clue_dt',
        'The lobby clock showed twenty minutes past ten while the kitchen bell rang at a quarter past ten, during the staff shift change.',
      ),
      SHIFT_FACT,
    );
    expect(conflicts).toEqual([]);
  });
});

describe('a genuine contradiction is still caught', () => {
  it('flags a clue that TIMES this fact differently', () => {
    const conflicts = findLockedFactClueTimeConflicts(
      cmlWith(['clue_register']),
      cluesWith('clue_register', 'The staff shift change occurred at a quarter past ten according to the register.'),
      SHIFT_FACT,
    );
    expect(conflicts.length).toBe(1);
    expect(conflicts[0]).toContain('staff_shift_change_time');
  });

  it('is silent when the clue agrees with the fact', () => {
    expect(
      findLockedFactClueTimeConflicts(
        cmlWith(['clue_ok']),
        cluesWith('clue_ok', 'The staff shift change occurred at half past ten according to the register.'),
        SHIFT_FACT,
      ),
    ).toEqual([]);
  });

  it('is silent when the clue states no time at all', () => {
    expect(
      findLockedFactClueTimeConflicts(
        cmlWith(['clue_none']),
        cluesWith('clue_none', 'Captain Hale was seen near the lobby during the staff shift change.'),
        SHIFT_FACT,
      ),
    ).toEqual([]);
  });
});
