/**
 * A_75 review — proper names inside key-term bags shipped lowercased, and readers saw it.
 *
 * `tokenizeForClueObligation` lowercases unconditionally (it must — the clue-presence check shares
 * the tokenizer), and `composeProseTermPhrase` re-cased only the first character. So every cast name
 * inside a bag shipped as `Captain ivor hale`, in three of the recent manuscripts.
 *
 * The second-order effect is the one that matters: the same text is fed forward in the STORY TO DATE
 * block, so the model is shown our mangled casing as this book's prose and imitates it — the source
 * of "Dr finch was glimpsed shivering outside ten minutes past eleven", a sentence the model wrote.
 */

import { describe, expect, it } from 'vitest';

import { composeProseTermPhrase, surfaceSpecKeyTerms, tokenizeForClueObligation } from '../agent9-prose/clue-validation.js';

describe('proper names survive the key-term round trip', () => {
  it('restores the casing the source carried — the verbatim defect', () => {
    // The exact bag that shipped in story_20260823-2038, -20260826-1753 and -20260827-2005.
    expect(composeProseTermPhrase('Captain Ivor Hale uniquely means skill'))
      .toBe('Captain Ivor Hale uniquely means skill');
  });

  it.each([
    ['Dr Mallory Finch last seen alive minutes past', 'Mallory Finch'],
    ['Eliminates Beatrice Quill from the kitchen', 'Beatrice Quill'],
    ['Direct evidence links Lady Eleanor to the mechanism access point', 'Lady Eleanor'],
  ])('keeps the name capitalised in %s', (source, name) => {
    expect(composeProseTermPhrase(source)).toContain(name);
  });

  it('does NOT capitalise ordinary words that were lowercase in the source', () => {
    // Over-restoring would be its own leak — every noun shouting mid-sentence.
    const out = composeProseTermPhrase('puncture wound victim body');
    expect(out).toBe('Puncture wound victim body');
  });

  it('leaves the matching surfaces untouched — presence checks stay case-insensitive', () => {
    // The tokenizer and the comma form feed obligation matching, not prose. Re-casing those would
    // change what the presence check compares, which is the one thing this fix must not do.
    expect(tokenizeForClueObligation('Captain Ivor Hale')).toEqual(['captain', 'ivor', 'hale']);
    expect(surfaceSpecKeyTerms('Captain Ivor Hale uniquely means skill'))
      .toBe('captain, ivor, hale, uniquely, means, skill');
  });

  it('is stable on empty and name-free input', () => {
    expect(composeProseTermPhrase('')).toBe('');
    expect(composeProseTermPhrase('   ')).toBe('');
  });
});
