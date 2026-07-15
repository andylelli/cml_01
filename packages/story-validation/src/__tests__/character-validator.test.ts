import { describe, it, expect } from 'vitest';
import { CharacterConsistencyValidator } from '../character-validator.js';
import type { Story, CMLData } from '../types.js';

function makeStory(text: string): Story {
  return {
    id: 'story-1',
    projectId: 'proj-1',
    scenes: [
      {
        number: 1,
        title: 'Scene 1',
        text,
      },
    ],
  };
}

function makeCml(): CMLData {
  return {
    CASE: {
      meta: {},
      cast: [
        {
          name: 'Arthur Pendleton',
          role_archetype: 'detective',
          gender: 'male',
          aliases: ['Inspector Pendleton', 'Pendleton'],
        } as any,
        {
          name: 'Clara Voss',
          role_archetype: 'suspect',
          gender: 'female',
        },
      ],
    },
  };
}

describe('CharacterConsistencyValidator alias/pronoun/walk-on rules', () => {
  const validator = new CharacterConsistencyValidator();

  it('accepts configured aliases as canonical references', () => {
    const story = makeStory('Inspector Pendleton entered first. Arthur Pendleton reviewed the notes.');
    const result = validator.validate(story, makeCml());

    expect(result.errors.some((e) => e.type === 'unknown_character')).toBe(false);
    expect(result.errors.some((e) => e.type === 'illegal_named_walk_on')).toBe(false);
  });

  it('flags pronoun mismatch when wrong pronoun appears in the immediate follow-up sentence', () => {
    const story = makeStory('Arthur Pendleton opened the ledger. She dismissed the timing evidence.');
    const result = validator.validate(story, makeCml());

    expect(result.errors.some((e) => e.type === 'pronoun_gender_mismatch')).toBe(true);
  });

  it('flags out-of-cast named walk-ons while allowing unnamed role mentions', () => {
    const story = makeStory('Inspector Harlow arrived at dusk. The inspector waited in silence.');
    const result = validator.validate(story, makeCml());

    const walkOn = result.errors.find((e) => e.type === 'illegal_named_walk_on');
    expect(walkOn).toBeDefined();
    expect(walkOn?.severity).toBe('major');
  });
});

// M1 abort class (run mystery-1784144041323, clock): Agent 3 gave TWO cast members the
// Detective archetype; the old bare-name scan read both names in prose as "the detective
// renamed" and hard-aborted a consistent story (no titled forms existed at all). The check
// now requires TITLED evidence: two distinct "Detective <Surname>" address forms.
describe('detective_name_inconsistency (titled-form evidence only)', () => {
  const validator = new CharacterConsistencyValidator();

  function makeDualDetectiveCml(): CMLData {
    return {
      CASE: {
        meta: {},
        cast: [
          { name: 'Eleanor Voss', role_archetype: 'Detective', gender: 'female' },
          { name: 'Sylvia Trent', role_archetype: 'Detective', gender: 'female' },
          { name: 'Hugo Vane', role_archetype: 'Victim', gender: 'male' },
        ],
      },
    } as CMLData;
  }

  it('does NOT flag bare co-occurrence of two detective-archetype cast names (the abort shape)', () => {
    const story = makeStory(
      'Eleanor Voss poured the tea while Sylvia Trent studied the rewound clock. ' +
      'Sylvia Trent asked where everyone had been at midnight; Eleanor Voss said nothing.'
    );
    const result = validator.validate(story, makeDualDetectiveCml());
    expect(result.errors.some((e) => e.type === 'detective_name_inconsistency')).toBe(false);
  });

  it('DOES flag two distinct titled detective surnames', () => {
    const story = makeStory(
      'Detective Trent examined the clock face. Later, Detective Voss announced the arrest.'
    );
    const result = validator.validate(story, makeDualDetectiveCml());
    const err = result.errors.find((e) => e.type === 'detective_name_inconsistency');
    expect(err).toBeDefined();
    expect(err!.severity).toBe('critical');
    expect(err!.message).toContain('Detective Trent');
    expect(err!.message).toContain('Detective Voss');
  });

  it('does NOT flag one consistent titled surname alongside bare full names (F30-1)', () => {
    const story = makeStory(
      'Sylvia Trent arrived at nine. Detective Trent questioned the staff; Eleanor Voss watched.'
    );
    const result = validator.validate(story, makeDualDetectiveCml());
    expect(result.errors.some((e) => e.type === 'detective_name_inconsistency')).toBe(false);
  });

  it('resolves rank words after the title instead of treating them as surnames', () => {
    const story = makeStory(
      'Detective Inspector Craddock took the case. Detective Craddock closed it a week later.'
    );
    const result = validator.validate(story, makeDualDetectiveCml());
    expect(result.errors.some((e) => e.type === 'detective_name_inconsistency')).toBe(false);
  });

  it('still flags a switch when a rank word precedes one of two different surnames', () => {
    const story = makeStory(
      'Detective Inspector Craddock took the case. By dusk Detective Marlowe claimed the credit.'
    );
    const result = validator.validate(story, makeDualDetectiveCml());
    expect(result.errors.some((e) => e.type === 'detective_name_inconsistency')).toBe(true);
  });
});
