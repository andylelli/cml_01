import { describe, expect, it } from 'vitest';
import { NarrativeContinuityValidator } from '../narrative-continuity-validator.js';
import { validateTimeline } from '../timeline-validator.js';
import type { Story } from '../types.js';

// A_53 P5 — validator false-positive fixes: a fair/valid story must not be flagged by a gate.

const story = (scenes: Array<{ number: number; text: string }>): Story =>
  ({ scenes: scenes.map((s) => ({ ...s, title: `Scene ${s.number}` })) } as unknown as Story);

describe('NarrativeContinuityValidator — body-discovery bridge (missing-bridge-false-positive-body-discovery)', () => {
  it('does NOT flag a disappearance→death scene that bridges with a plain body-discovery sentence', () => {
    const result = new NarrativeContinuityValidator().validate(
      story([
        { number: 1, text: 'Eleanor had been missing for three days; the household feared she had vanished.' },
        { number: 2, text: 'At dawn the gardener found her body at the foot of the cliff. Murder, the inspector said.' },
      ]),
    );
    expect(result.errors.some((e) => e.type === 'missing_case_transition_bridge')).toBe(false);
  });

  it('still flags a disappearance→murder jump with NO bridging discovery', () => {
    const result = new NarrativeContinuityValidator().validate(
      story([
        { number: 1, text: 'Eleanor had been missing for three days; she had vanished without trace.' },
        { number: 2, text: 'The killer was clearly someone who hated her. It was plainly murder.' },
      ]),
    );
    expect(result.errors.some((e) => e.type === 'missing_case_transition_bridge')).toBe(true);
  });
});

describe('validateTimeline — day-boundary tracking (timeline-validator-no-day-tracking)', () => {
  it('does NOT flag a backward clock time across an explicit day boundary', () => {
    const errors = validateTimeline(
      story([
        { number: 1, text: 'The lamps were lit at 9:00 PM. The next afternoon, the bell rang at 2:00 PM.' },
      ]),
    );
    expect(errors.some((e) => e.type === 'timeline_contradiction')).toBe(false);
  });

  it('still flags a same-day backward jump', () => {
    const errors = validateTimeline(
      story([
        { number: 1, text: 'The clock struck 9:00 PM in the study. Moments later it read 2:00 PM.' },
      ]),
    );
    expect(errors.some((e) => e.type === 'timeline_contradiction')).toBe(true);
  });
});
