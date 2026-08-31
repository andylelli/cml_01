/**
 * A_76 §16 — the check diagnosed precisely and reported vaguely.
 *
 * A run on 2026-08-31 died at Agent 3 after five paid attempts at an arithmetic constraint whose
 * numbers we already knew:
 *
 *   attempt 1  apparent_not_covered   the staged time was outside the alibi window
 *   attempt 2  actual_covered         the model moved the staged time in — and pushed the REAL time in too
 *   attempt 3  actual_covered         oscillating, still blind
 *   agent 4 #1 actual_covered
 *   agent 4 #2 actual_covered + delivery_path[0..2] must be object   (it broke the schema guessing)
 *
 * The old message said only *"the real time of death falls INSIDE a span the culprit can account
 * for"* — never the time, never the span, never where the gaps were. The check computed all three
 * and threw them away.
 *
 * These tests pin the message CONTENT, which is the fix. The verdict logic is unchanged and the
 * final test asserts that.
 */

import { describe, expect, it } from 'vitest';

import { checkTimelineDeception } from '../timeline-deception.js';

/** Culprit accounted for 10:00–11:30. Gaps on a 12-hour dial: 12:00–9:59 and 11:31–11:59. */
const WINDOWS = ['from ten to eleven thirty'];

describe('actual_covered tells the model where to move the time', () => {
  const [v] = checkTimelineDeception({
    apparentTime: "eleven o'clock",
    actualTime: 'ten fifteen',
    culpritAlibiWindows: WINDOWS,
  });

  it('fires on the right code', () => {
    expect(v?.code).toBe('actual_covered');
  });

  it('names the offending time', () => {
    expect(v?.message).toContain('10:15');
  });

  it('names the window it collides with', () => {
    expect(v?.message).toContain('10:00–11:30');
  });

  it('names the gaps where the real time COULD go', () => {
    // Without these the model is guessing, which is what produced five attempts and a broken schema.
    expect(v?.message).toContain('12:00–9:59');
    expect(v?.message).toContain('11:31–11:59');
  });

  it('tells it to LEAVE THE OTHER TIME ALONE — the anti-oscillation clause', () => {
    // This is the specific failure: fixing one constraint broke the other, repeatedly.
    expect(v?.message).toMatch(/Leave the staged time where it is/);
  });
});

describe('apparent_not_covered does the same in the other direction', () => {
  const violations = checkTimelineDeception({
    apparentTime: 'nine ten',
    actualTime: 'ten fifteen',
    culpritAlibiWindows: WINDOWS,
  });
  const v = violations.find((x) => x.code === 'apparent_not_covered');

  it('names the staged time and the window it must move into', () => {
    expect(v?.message).toContain('9:10');
    expect(v?.message).toContain('10:00–11:30');
  });

  it('tells it to leave the REAL time alone', () => {
    expect(v?.message).toMatch(/Leave the real time of death where it is/);
  });
});

describe('the verdict logic is unchanged — this was a message fix, not a rule change', () => {
  it('still passes a correctly-constructed deception', () => {
    // staged 10:30 (inside the window), real 9:00 (in a gap) — the invariant holds.
    expect(checkTimelineDeception({
      apparentTime: 'half past ten',
      actualTime: 'nine o\'clock',
      culpritAlibiWindows: WINDOWS,
    })).toHaveLength(0);
  });

  it('still says nothing when the times cannot be parsed — never manufactures a failure', () => {
    expect(checkTimelineDeception({
      apparentTime: 'later that evening',
      actualTime: 'some time before',
      culpritAlibiWindows: WINDOWS,
    })).toHaveLength(0);
  });

  it('still says nothing when there are no alibi windows to judge against', () => {
    expect(checkTimelineDeception({
      apparentTime: 'half past ten',
      actualTime: 'nine o\'clock',
      culpritAlibiWindows: [],
    })).toHaveLength(0);
  });

  it('still catches identical times, and that message needs no window arithmetic', () => {
    const [v] = checkTimelineDeception({
      apparentTime: 'ten fifteen',
      actualTime: 'ten fifteen',
      culpritAlibiWindows: WINDOWS,
    });
    expect(v?.code).toBe('times_identical');
  });

  it('reports both violations when both hold, each with its own numbers', () => {
    const violations = checkTimelineDeception({
      apparentTime: 'nine ten',
      actualTime: 'ten fifteen',
      culpritAlibiWindows: WINDOWS,
    });
    expect(violations.map((x) => x.code).sort()).toEqual(['actual_covered', 'apparent_not_covered']);
  });

  it('handles a window that covers the whole dial without emitting a nonsense gap list', () => {
    const v = checkTimelineDeception({
      apparentTime: 'nine ten',
      actualTime: 'ten fifteen',
      culpritAlibiWindows: ['from twelve to eleven fifty'],
    }).find((x) => x.code === 'actual_covered');
    if (v) expect(v.message).toMatch(/none — the alibi windows cover the whole dial|\d/);
  });
});
