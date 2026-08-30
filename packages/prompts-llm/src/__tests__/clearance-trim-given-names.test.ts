/**
 * A_75 §17 — the clearance trim could not see most clearances.
 *
 * `namesIn` matched a full name or a SURNAME only. Golden Age prose names women by their given name
 * almost exclusively, so across 27 stored runs only 30 of 174 clearance sentences (17.2%) could be
 * attributed to a suspect at all — and a sentence naming nobody can never be shown redundant, so it
 * was never a trim candidate.
 *
 * The book that exposed it, `story_20260829-1041`, clears three suspects in chapter 9 and re-clears
 * two of them in chapter 10:
 *
 *   "Captain Hale, Beatrice, Sylvia — you are all cleared."   old matcher saw: Hale only
 *   "the moment Beatrice had been cleared"                    old matcher saw: NOBODY
 */

import { describe, expect, it } from 'vitest';

import { trimRedundantClearances, isClearanceSentenceMirror } from '../agent9-prose/clearance-trim.js';

const CAST = ['Eleanor Voss', 'Dr. Mallory Finch', 'Captain Ivor Hale', 'Beatrice Quill', 'Sylvia Trent', 'Hugo Vane'];

/** namesIn is private; exercise it through the behaviour that depends on it. */
const trimWith = (chapters: Array<{ paragraphs: string[] }>, budget: number) =>
  trimRedundantClearances(chapters as never, CAST, budget);

describe('given names are recognised', () => {
  it('sees a suspect cleared by GIVEN name, which is how the prose refers to her', () => {
    // ch1 clears Beatrice by given name; ch2 re-clears her. With a budget of 0 every clearance in
    // ch2 is over budget, so the redundant one must be removed — which can only happen if BOTH
    // sentences attributed to Beatrice Quill.
    const r = trimWith([
      { paragraphs: ['Beatrice was cleared by the maintenance logs.'] },
      { paragraphs: ['The moment Beatrice had been cleared came back to her.'] },
    ], 0);
    expect(r.removed).toHaveLength(1);
    expect(r.removed[0]).toContain('Beatrice Quill');
  });

  it('handles a grouped clearance naming three suspects at once', () => {
    const grouped = 'Captain Hale, Beatrice, Sylvia — you are all cleared.';
    expect(isClearanceSentenceMirror(grouped)).toBe(true);
    const r = trimWith([
      { paragraphs: [grouped] },
      { paragraphs: ['Sylvia had been cleared, and that was that.'] },
    ], 0);
    // Sylvia was covered by the grouped sentence, so the ch2 restatement is redundant.
    expect(r.removed).toHaveLength(1);
    expect(r.removed[0]).toContain('Sylvia Trent');
  });

  it('does not treat an honorific as a given name', () => {
    // "Dr. Mallory Finch" must not be matched by the bare word "Doctor" — otherwise every doctor in
    // the cast is cleared whenever the word appears.
    const r = trimWith([
      { paragraphs: ['The doctor was cleared of any involvement.'] },
      { paragraphs: ['The doctor was cleared again, for good measure.'] },
    ], 0);
    expect(r.removed).toHaveLength(0);
  });

  it('requires a given name to be UNIQUE — an ambiguous one clears the wrong record', () => {
    const twoSylvias = ['Sylvia Trent', 'Sylvia Marchmont'];
    const r = trimRedundantClearances(
      [
        { paragraphs: ['Sylvia was cleared by the ledger.'] },
        { paragraphs: ['Sylvia was cleared once more.'] },
      ] as never,
      twoSylvias,
      0,
    );
    expect(r.removed).toHaveLength(0);
  });

  it('matches whole words — "Hale" must not be found inside "exhaled"', () => {
    const r = trimWith([
      { paragraphs: ['Hale was cleared by the timeline.'] },
      { paragraphs: ['She exhaled, and the room was cleared of smoke at last.'] },
    ], 0);
    // The second sentence is about smoke, names nobody, and must not be attributed to Captain Hale.
    expect(r.removed).toHaveLength(0);
  });

  it('never removes a suspect FIRST clearance, whatever the budget', () => {
    const r = trimWith([
      { paragraphs: ['Beatrice was cleared by the maintenance logs.'] },
      { paragraphs: ['Sylvia was cleared by the ledger.'] },
    ], 0);
    expect(r.removed).toHaveLength(0);
  });
});
