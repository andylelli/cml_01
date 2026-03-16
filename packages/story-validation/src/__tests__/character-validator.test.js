import { describe, it, expect } from 'vitest';
import { CharacterConsistencyValidator } from '../character-validator.js';
function makeStory(text) {
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
function makeCml() {
    return {
        CASE: {
            meta: {},
            cast: [
                {
                    name: 'Arthur Pendleton',
                    role_archetype: 'detective',
                    gender: 'male',
                    aliases: ['Inspector Pendleton', 'Pendleton'],
                },
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
    it('does not flag wrong pronoun that appears only in the follow-up sentence (R4: followUpContexts removed)', () => {
        // R4 removed the followUpContexts check to prevent false-positive cascades.
        // A pronoun in the sentence *after* a character name is no longer flagged.
        const story = makeStory('Arthur Pendleton opened the ledger. She dismissed the timing evidence.');
        const result = validator.validate(story, makeCml());
        expect(result.errors.some((e) => e.type === 'pronoun_gender_mismatch')).toBe(false);
    });
    it('does not falsely attribute nearby appositive her-phrases to a male character', () => {
        const story = makeStory('Arthur Pendleton, her long-time colleague, reviewed the room in silence.');
        const result = validator.validate(story, makeCml());
        expect(result.errors.some((e) => e.type === 'pronoun_gender_mismatch')).toBe(false);
    });
    it('flags out-of-cast named walk-ons while allowing unnamed role mentions', () => {
        const story = makeStory('Inspector Harlow arrived at dusk. The inspector waited in silence.');
        const result = validator.validate(story, makeCml());
        const walkOn = result.errors.find((e) => e.type === 'illegal_named_walk_on');
        expect(walkOn).toBeDefined();
        expect(walkOn?.severity).toBe('major');
    });
    // --- Competing-entity guard: co-reference false-positive tests ---
    it('does not flag she as wrong for male character when a female character is also named in the sentence', () => {
        // "She" refers to Clara Voss, not Arthur Pendleton — both named in sentence
        const story = makeStory('She glanced at Arthur Pendleton and Clara Voss nodded in agreement.');
        const result = validator.validate(story, makeCml());
        const arthurError = result.errors.find((e) => e.type === 'pronoun_gender_mismatch' && e.message.includes('Arthur Pendleton'));
        expect(arthurError).toBeUndefined();
    });
    it('does not flag he as wrong for female character when a male character is also named in the sentence', () => {
        // "He" refers to Arthur Pendleton, not Clara Voss — both named in sentence
        const story = makeStory('He studied Clara Voss while Arthur Pendleton considered the evidence.');
        const result = validator.validate(story, makeCml());
        const claraError = result.errors.find((e) => e.type === 'pronoun_gender_mismatch' && e.message.includes('Clara Voss'));
        expect(claraError).toBeUndefined();
    });
    it('still flags true pronoun mismatch when only one character is named in the sentence', () => {
        // "She" with only male Arthur Pendleton named — genuine mismatch
        const story = makeStory('She approached Arthur Pendleton with a stern expression.');
        const result = validator.validate(story, makeCml());
        const arthurError = result.errors.find((e) => e.type === 'pronoun_gender_mismatch' && e.message.includes('Arthur Pendleton'));
        expect(arthurError).toBeDefined();
    });
    it('does not flag mismatch in follow-up sentence even without competing entity (R4: followUpContexts removed)', () => {
        // R4 removed follow-up sentence checking entirely.
        const story = makeStory('Arthur Pendleton entered the drawing room. She examined the curtains.');
        const result = validator.validate(story, makeCml());
        const arthurError = result.errors.find((e) => e.type === 'pronoun_gender_mismatch' && e.message.includes('Arthur Pendleton'));
        expect(arthurError).toBeUndefined();
    });
});
//# sourceMappingURL=character-validator.test.js.map