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
