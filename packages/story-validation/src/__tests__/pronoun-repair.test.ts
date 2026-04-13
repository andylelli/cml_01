import { describe, it, expect, beforeAll } from 'vitest';
import { repairPronouns, repairChapterPronouns } from '../pronoun-repair.js';
import { ProseConsistencyValidator } from '../prose-consistency-validator.js';
import type { CastEntry } from '../pronoun-repair.js';
import type { Story, CMLData, Scene } from '../types.js';

const CAST: CastEntry[] = [
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
    const cast: CastEntry[] = [{ name: 'Alex Quinn' }];
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
    expect(result.chapter.paragraphs[0]).toBe(
      'Graham Worsley entered the room. He looked around nervously.'
    );
    expect(result.chapter.paragraphs[1]).toBe(
      'Clara Voss was already there. She greeted her warmly.'
    );
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

// ---------------------------------------------------------------------------
// ProseConsistencyValidator — pronoun_drift + dialogue-strip fix (2a)
// ---------------------------------------------------------------------------

function makeScene(overrides: Partial<Scene> & { text: string }): Scene {
  return { number: 1, title: 'Scene', ...overrides };
}
function makeStory(scenes: Scene[]): Story {
  return { id: 's1', projectId: 'p1', scenes };
}
function makeCMLWithCast(cast: Array<{ name: string; gender: string }>): CMLData {
  return { CASE: { meta: {}, cast, culpability: { culprits: [] } } };
}

describe('ProseConsistencyValidator — pronoun_drift', () => {
  let validator: ProseConsistencyValidator;

  beforeAll(() => { validator = new ProseConsistencyValidator(); });

  it('fires pronoun_drift when a wrong pronoun appears near a character name in narrative', () => {
    // "Worsley" (male) near "she" with no female competitor — should fire
    const story = makeStory([
      makeScene({ number: 1, text: 'Graham Worsley entered. She sat down in silence.' }),
    ]);
    const cml = makeCMLWithCast([{ name: 'Graham Worsley', gender: 'male' }]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter((e) => e.type === 'pronoun_drift');
    expect(driftErrors.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT fire pronoun_drift when the wrong pronoun is inside dialogue (2a fix)', () => {
    // Clara (female) says "he was rude to me" — "he" is inside a quote and refers to
    // an absent male, not Clara. The validator must not fire a drift for Clara.
    const story = makeStory([
      makeScene({ number: 1, text: '"He was absolutely rude to me," Clara said, her face pale.' }),
    ]);
    const cml = makeCMLWithCast([{ name: 'Clara', gender: 'female' }]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter((e) => e.type === 'pronoun_drift');
    expect(driftErrors).toHaveLength(0);
  });

  it('does NOT fire pronoun_drift when the competitor character is nearby', () => {
    // Both Worsley (male) and Voss (female) are in the window — ambiguous, should not fire
    const story = makeStory([
      makeScene({ number: 1, text: 'Graham Worsley and Clara Voss entered. She took a seat.' }),
    ]);
    const cml = makeCMLWithCast([
      { name: 'Graham Worsley', gender: 'male' },
      { name: 'Clara Voss', gender: 'female' },
    ]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter((e) => e.type === 'pronoun_drift');
    expect(driftErrors).toHaveLength(0);
  });

  it('still fires pronoun_drift when a wrong pronoun is outside any quote', () => {
    // Narrative "she" for Graham (male), no dialogue, no competitor — must still fire
    // Note: the validator scans for the FIRST NAME ("Graham"), so the text must contain it.
    const story = makeStory([
      makeScene({ number: 1, text: 'Graham examined the letters. She found nothing of use.' }),
    ]);
    const cml = makeCMLWithCast([{ name: 'Graham Worsley', gender: 'male' }]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter((e) => e.type === 'pronoun_drift');
    expect(driftErrors.length).toBeGreaterThanOrEqual(1);
  });

  it('does NOT fire when competitor appears in the same paragraph but outside the 200-char window', () => {
    // Christopher Regan (male) is at the start of the paragraph, 250+ chars before
    // Catherine Nolan (female). "his" appears after Catherine's name.
    // The paragraph-level competitor check should suppress this false positive —
    // both characters are in the same paragraph so the pronoun is ambiguous.
    const longPrefix =
      'Christopher Regan spread the documents across the table and studied them with meticulous care, ' +
      'paying particular attention to the annotations that someone had made in the margin. ';
    // longPrefix is ~170 chars; add more to exceed the 200-char window
    const padding =
      'He had arrived early that morning and had not yet spoken to anyone else in the household. ';
    const suffix = 'Catherine Nolan entered and surveyed the scene. His handwriting, she recognised, was rather more distinctive than one might expect.';
    const text = longPrefix + padding + suffix;
    // Verify Christopher is >200 chars from Catherine
    const christopherPos = text.indexOf('Christopher');
    const catherinePos = text.indexOf('Catherine');
    expect(catherinePos - christopherPos).toBeGreaterThan(200);

    const story = makeStory([makeScene({ number: 1, text })]);
    const cml = makeCMLWithCast([
      { name: 'Catherine Nolan', gender: 'female' },
      { name: 'Christopher Regan', gender: 'male' },
    ]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter((e) => e.type === 'pronoun_drift');
    // Christopher is in the same paragraph → competitor suppresses → no drift error
    expect(driftErrors).toHaveLength(0);
  });

  it('fires on a later name occurrence when the first has a competitor (continue, not break)', () => {
    // First paragraph: Catherine + Christopher together → competitor suppresses position 1.
    // Second paragraph: Catherine alone near "his" → should still be detected (position 2).
    const text =
      'Christopher Regan and Catherine Nolan spoke briefly at the door. She went inside.\n\n' +
      'Later, Catherine stood at the window alone. His coat was on the chair beside her.';
    const story = makeStory([makeScene({ number: 1, text })]);
    const cml = makeCMLWithCast([
      { name: 'Catherine Nolan', gender: 'female' },
      { name: 'Christopher Regan', gender: 'male' },
    ]);
    const result = validator.validate(story, cml);
    const driftErrors = result.errors.filter(
      (e) => e.type === 'pronoun_drift' && e.message.includes('Catherine'),
    );
    // Position 1 (para 1): competitor present → suppressed.
    // Position 2 (para 2): only Catherine, "his" nearby → fires.
    expect(driftErrors.length).toBeGreaterThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// ProseConsistencyValidator — classifyOpeningStyle (via checkOpeningStyles)
// Exercises the key buckets, especially the extended character-action and
// time-anchor patterns added in the bug-fix review.
// ---------------------------------------------------------------------------

/** Build a 5-scene story where each scene has the given first sentence. */
function makeMultiSceneStory(firstSentences: string[]): Story {
  return makeStory(
    firstSentences.map((text, i) => makeScene({ number: i + 1, text }))
  );
}

describe('ProseConsistencyValidator — classifyOpeningStyle', () => {
  let validator: ProseConsistencyValidator;
  beforeAll(() => { validator = new ProseConsistencyValidator(); });

  // Helper: supply N identical first sentences — if they all land in the same
  // bucket and N > 50% of total, opening_style_repetition should fire.
  function stylesFromStory(firstSentences: string[]): Set<string> {
    const result = validator.validate(makeMultiSceneStory(firstSentences), undefined);
    const rep = result.errors.filter((e) => e.type === 'opening_style_repetition');
    // extract styles that were flagged (messages contain the style name)
    return new Set(rep.map((e) => e.message.match(/Opening style "([^"]+)"/)?.[1] ?? '').filter(Boolean));
  }

  it('classifies directive-example character-action openers correctly (cross/rose/set)', () => {
    // 6 scenes all character-action → should fire opening_style_repetition for that bucket
    const sentences = [
      'Graham crossed the threshold without knocking.',
      'Clara rose from the chair by the window.',
      'Worsley set down the glass on the mantelpiece.',
      'Inspector Drew turned to face the assembled household.',
      'Fairfax stepped into the corridor and paused.',
      'Alderton reached for the decanter and poured.',
    ];
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('character-action')).toBe(true);
  });

  it('classifies digit-format time-anchor correctly', () => {
    // Use o'clock (no mid-sentence periods) to avoid the sentence-splitter
    // matching on abbreviation dots (p.m., a.m.).
    const sentences = Array(6).fill('At 9 o\'clock the household was summoned to the drawing room.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('time-anchor')).toBe(true);
  });

  it('also classifies H:MM a.m./p.m. time-anchor correctly (full sentence)', () => {
    // Validates the regex on the full sentence (not truncated by the extractor).
    // The sentence extractor now uses a lookahead so p.m. is no longer split mid-abbreviation.
    const sentences = Array(6).fill('At 9:30 p.m. the household was summoned.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('time-anchor')).toBe(true);
  });

  it('classifies word-format time-anchor correctly (half past / midnight)', () => {
    // word-format times as in the directive examples
    const sentences = Array(6).fill('At half past nine the parlour fell quiet.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('time-anchor')).toBe(true);

    const sentences2 = Array(6).fill('At midnight the candles guttered out one by one.');
    const flagged2 = stylesFromStory(sentences2);
    expect(flagged2.has('time-anchor')).toBe(true);
  });

  it('classifies dialogue-open correctly', () => {
    const sentences = Array(6).fill('"You were seen leaving the study," said the inspector.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('dialogue-open')).toBe(true);
  });

  it('classifies temporal-subordinate correctly', () => {
    const sentences = Array(6).fill('When the last guest had retired, the inspector spoke.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('temporal-subordinate')).toBe(true);
  });

  it('classifies noun-phrase-atmosphere correctly', () => {
    const sentences = Array(6).fill('The smell of damp stone hung in the cellar.');
    const flagged = stylesFromStory(sentences);
    expect(flagged.has('noun-phrase-atmosphere')).toBe(true);
  });

  it('does NOT fire opening_style_repetition for a properly varied set', () => {
    // One of each bucket — no single style > 50%
    const sentences = [
      '"You were seen," the inspector said calmly.',                           // dialogue-open
      'At half past ten the great clock struck.',                               // time-anchor
      'Graham crossed the threshold without a word.',                           // character-action
      'The smell of cold ash drifted from the grate.',                         // noun-phrase-atmosphere
      'When the last candle flickered out, the room fell silent.',              // temporal-subordinate
      'Evening settled over the estate with its customary grey indifference.',  // general-descriptive
    ];
    const result = validator.validate(makeMultiSceneStory(sentences), undefined);
    const rep = result.errors.filter((e) => e.type === 'opening_style_repetition');
    expect(rep).toHaveLength(0);
  });
});

// ---------------------------------------------------------------------------
// ProseConsistencyValidator — checkContextLeakage (Pattern 2 tightening — 3a)
// The tightened heuristic requires >55 words + room noun + sensory noun +
// (template-structure marker OR country/estate noun). Naturally long period
// prose without the template marker must NOT fire.
// ---------------------------------------------------------------------------

describe('ProseConsistencyValidator — checkContextLeakage Pattern 2', () => {
  let validator: ProseConsistencyValidator;
  beforeAll(() => { validator = new ProseConsistencyValidator(); });

  function leakageErrors(text: string) {
    const story: Story = makeStory([makeScene({ number: 1, text })]);
    return validator.validate(story, undefined).errors.filter(
      (e) => e.type === 'context_leakage_suspected',
    );
  }

  it('fires on a long sentence with room + sensory enum + template-structure "the smell of"', () => {
    // 60+ words, has "library", "smell", and the structural "the smell of" marker
    const sentence =
      'The library was a room of considerable character, for the smell of aged '
      + 'leather and cold ash pervaded every corner, mingling with the faint scent of '
      + 'tobacco that clung to the curtains, while the high windows admitted only a '
      + 'pale and grudging light that barely reached the shelves lining three of the '
      + 'four walls and gave the whole room an air of deliberate gloom.';
    const errs = leakageErrors(sentence);
    expect(errs.length).toBeGreaterThan(0);
    expect(errs[0].type).toBe('context_leakage_suspected');
  });

  it('fires on a long sentence with room + country/estate + sensory noun', () => {
    // 60+ words, has "study", "England", and "scent" — the old triple still works
    const sentence =
      'The study was rarely used in winter, for England in December offers little '
      + 'encouragement to those who keep such rooms, yet the scent of old papers and '
      + 'the faint memory of pipe smoke gave the place an air of accumulated secrets '
      + 'that no amount of cold draught through the ill-fitting window or rattling '
      + 'shutter could quite dispel from the corners of the room.';
    const errs = leakageErrors(sentence);
    expect(errs.length).toBeGreaterThan(0);
  });

  it('does NOT fire on a naturally long atmospheric sentence without template structure', () => {
    // 60+ words, period prose, no room noun, no "the smell of" template marker
    const sentence =
      'Outside, the November rain fell in thin grey curtains across the park, '
      + 'bending the last of the elms and driving even the hardiest rooks from their '
      + 'perches high above the gatehouse, so that the whole landscape took on that '
      + 'particular English desolation which is not quite despair but which leaves a '
      + 'man with little appetite for good news, even when it comes.';
    const errs = leakageErrors(sentence);
    expect(errs).toHaveLength(0);
  });

  it('does NOT fire when sentence is under 56 words even with all three signals', () => {
    // Under-threshold: 50 words with room + England + scent — should NOT fire
    const sentence =
      'The drawing room overlooked the park, and England in late October was already '
      + 'cold; the scent of woodsmoke filled the air as Graham stood at the window '
      + 'and considered what he had just been told.';
    const wordCount = sentence.trim().split(/\s+/).length;
    expect(wordCount).toBeLessThanOrEqual(55); // confirm it's under threshold
    const errs = leakageErrors(sentence);
    expect(errs).toHaveLength(0);
  });
});
