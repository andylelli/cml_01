import { describe, it, expect } from 'vitest';
import { repairPronouns, repairChapterPronouns } from '../pronoun-repair.js';
const CAST = [
    { name: 'Graham Worsley', gender: 'male' },
    { name: 'Clara Voss', gender: 'female' },
    { name: 'Archibald Compton', gender: 'male' },
    { name: 'Eleanor Fairfax', gender: 'female' },
];
describe('repairPronouns', () => {
    it('fixes she→he when only a male character is named', () => {
        const text = 'Graham Worsley entered the room. She looked around nervously.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Graham Worsley entered the room. He looked around nervously.');
        expect(result.repairCount).toBeGreaterThan(0);
    });
    it('fixes he→she when only a female character is named', () => {
        const text = 'Clara Voss stood at the window. He stared into the garden.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Clara Voss stood at the window. She stared into the garden.');
        expect(result.repairCount).toBeGreaterThan(0);
    });
    it('fixes possessive his→her for female character', () => {
        const text = 'Clara Voss clutched his bag tightly.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Clara Voss clutched her bag tightly.');
    });
    it('fixes possessive her→his for male character', () => {
        const text = 'Graham Worsley adjusted her collar.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Graham Worsley adjusted his collar.');
    });
    it('fixes object him→her for female character', () => {
        const text = 'The detective confronted Clara Voss. The evidence pointed to him.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('The detective confronted Clara Voss. The evidence pointed to her.');
    });
    it('fixes herself→himself for male character', () => {
        const text = 'Graham Worsley found herself at a loss.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Graham Worsley found himself at a loss.');
    });
    it('preserves capitalization at sentence start', () => {
        const text = 'Graham Worsley paused. She drew a deep breath.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Graham Worsley paused. He drew a deep breath.');
    });
    it('does NOT repair when two characters of different genders are in the same sentence', () => {
        const text = 'Graham Worsley glanced at Clara Voss. She smiled back at him.';
        const result = repairPronouns(text, CAST);
        // The second sentence has no named character but last reference was mixed-gender,
        // so context is cleared — no repair.
        expect(result.text).toBe(text);
    });
    it('repairs when two characters of the same gender are in the sentence', () => {
        const text = 'Graham Worsley and Archibald Compton debated. She intervened sharply.';
        const result = repairPronouns(text, CAST);
        // Both are male, so "she" is unambiguously wrong
        expect(result.text).toBe('Graham Worsley and Archibald Compton debated. He intervened sharply.');
    });
    it('inherits context to follow-up sentences', () => {
        const text = 'Archibald Compton opened the letter. She gasped. The words blurred before her eyes.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Archibald Compton opened the letter. He gasped. The words blurred before his eyes.');
    });
    it('returns zero repairs when text is already correct', () => {
        const text = 'Graham Worsley entered the room. He looked around nervously. His coat was damp.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe(text);
        expect(result.repairCount).toBe(0);
    });
    it('handles empty cast gracefully', () => {
        const text = 'She walked into the room.';
        const result = repairPronouns(text, []);
        expect(result.text).toBe(text);
        expect(result.repairCount).toBe(0);
    });
    it('handles text with no character mentions', () => {
        const text = 'The room was quiet. She paused by the window.';
        const result = repairPronouns(text, CAST);
        // No character referenced — nothing to repair
        expect(result.text).toBe(text);
        expect(result.repairCount).toBe(0);
    });
    it('recognises surname-only references', () => {
        const text = 'Worsley peered at the document. She frowned.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Worsley peered at the document. He frowned.');
    });
    it('handles gender=unknown / missing gender characters', () => {
        const cast = [{ name: 'Alex Quinn' }];
        const text = 'Alex Quinn arrived. She looked tired.';
        const result = repairPronouns(text, cast);
        // No gender defined → no repair
        expect(result.text).toBe(text);
        expect(result.repairCount).toBe(0);
    });
    it('handles multiple pronouns in one sentence', () => {
        const text = 'Graham Worsley picked up her bag and checked her notes before she left.';
        const result = repairPronouns(text, CAST);
        expect(result.text).toBe('Graham Worsley picked up his bag and checked his notes before he left.');
    });
});
describe('repairChapterPronouns', () => {
    it('repairs across all paragraphs', () => {
        const chapter = {
            title: 'A Startling Discovery',
            paragraphs: [
                'Graham Worsley entered the room. She looked around nervously.',
                'Clara Voss was already there. He greeted her warmly.',
            ],
        };
        const result = repairChapterPronouns(chapter, CAST);
        expect(result.chapter.paragraphs[0]).toBe('Graham Worsley entered the room. He looked around nervously.');
        expect(result.chapter.paragraphs[1]).toBe('Clara Voss was already there. She greeted her warmly.');
        expect(result.repairCount).toBe(2);
    });
    it('does not modify the title', () => {
        const chapter = {
            title: 'She Walks in Shadow',
            paragraphs: ['Graham Worsley sighed.'],
        };
        const result = repairChapterPronouns(chapter, CAST);
        expect(result.chapter.title).toBe('She Walks in Shadow');
    });
});
//# sourceMappingURL=pronoun-repair.test.js.map