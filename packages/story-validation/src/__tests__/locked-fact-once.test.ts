import { describe, it, expect } from 'vitest';
import { ProseConsistencyValidator } from '../prose-consistency-validator.js';
import type { Story, CMLData } from '../types.js';

const validator = new ProseConsistencyValidator();

function story(scenes: Array<{ number: number; text: string }>): Story {
  return {
    id: 's',
    projectId: 'p',
    scenes: scenes.map((s) => ({ number: s.number, title: `Ch${s.number}`, text: s.text })),
  };
}

// The run bf6khyl2r fact: "The distance from the clock to the scene of the murder" = "thirty feet".
const DISTANCE_FACT: CMLData = {
  CASE: { meta: {}, cast: [] },
  lockedFacts: [
    { id: 'lf_distance', value: 'thirty feet', description: 'The distance from the clock to the scene of the murder' },
  ],
} as any;

const REFERENCING = 'The clock stood well back from the scene of the murder, across the length of the study.';

describe('locked_fact_missing_value — value required ONCE, not per incidental mention (RC2.1)', () => {
  it('does NOT flag when the canonical value appears in at least one referencing chapter', () => {
    const s = story([
      { number: 7, text: `${REFERENCING} A full thirty feet separated them.` }, // value present here
      { number: 8, text: REFERENCING }, // references the fact, value absent — must NOT re-flag
      { number: 9, text: REFERENCING },
    ]);
    const missing = validator.validate(s, DISTANCE_FACT).errors.filter((e) => e.type === 'locked_fact_missing_value');
    expect(missing).toHaveLength(0);
  });

  it('flags EXACTLY ONCE (not per chapter) when the value never appears anywhere', () => {
    const s = story([
      { number: 7, text: REFERENCING },
      { number: 8, text: REFERENCING },
      { number: 9, text: REFERENCING },
    ]);
    const missing = validator.validate(s, DISTANCE_FACT).errors.filter((e) => e.type === 'locked_fact_missing_value');
    expect(missing).toHaveLength(1); // was 3 under the old per-scene logic
    expect(missing[0].message).toContain('7, 8, 9'); // names all referencing chapters
    expect(missing[0].severity).toBe('major');
  });

  it('STILL flags a conflicting value per scene as a critical contradiction', () => {
    const conflictFact: CMLData = {
      CASE: { meta: {}, cast: [] },
      // digit-bearing value so the numeric-conflict detector engages
      lockedFacts: [
        { id: 'lf_time', value: '10:47', description: 'The time the clock stopped in the study' },
      ],
    } as any;
    const s = story([
      { number: 2, text: 'The study clock had stopped at 10:47, its hands frozen.' }, // value present
      { number: 5, text: 'The study clock, they now saw, had in fact stopped at 9:15.' }, // conflicting value
    ]);
    const errors = validator.validate(s, conflictFact).errors;
    expect(errors.some((e) => e.type === 'locked_fact_contradicted' && e.severity === 'critical' && e.sceneNumber === 5)).toBe(true);
    // value appears (ch2) so there is no missing-value flag
    expect(errors.some((e) => e.type === 'locked_fact_missing_value')).toBe(false);
  });
});
