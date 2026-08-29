/**
 * The two malformed-prose defects the external reader of `story_20260828-2301` named directly.
 *
 * That book scored 85/100 — the second-best ever — with `prose` capped at 7 and the note
 * "Atmospheric, but capped by leakage and malformed lines". The line they quoted contains both
 * defects at once:
 *
 *   "I just hoped to avoid dismissal dr finch... she was strict, but she hadn t earned the right"
 *
 * Corpus-wide: lowercase-name-after-title in 22 of 196 books (11%), missing apostrophe in 4 (2%).
 */

import { describe, expect, it } from 'vitest';

import { repairNameHygiene, repairNameHygieneInChapters } from '../agent9-prose/name-hygiene.js';

const CAST = ['Dr. Mallory Finch', 'Captain Ivor Hale', 'Sylvia Trent'];

describe('the exact line the reader quoted', () => {
  it('repairs both defects in it', () => {
    const r = repairNameHygiene(
      "I just hoped to avoid dismissal dr finch... she was strict, but she hadn t earned the right",
      CAST,
    );
    // Both words repaired: the title's case as well as the name's.
    expect(r.text).toContain('Dr Finch');
    expect(r.text).toContain("hadn't earned");
    expect(r.repairs).toHaveLength(2);
  });
});

describe('THE GUARD: an ordinary word after a title is never capitalised', () => {
  /**
   * The corpus is why this matters. Of 49 lowercase-after-title hits, 33 are names (ivor x19, hale
   * x5, mallory x4, finch x3) and 16 are ordinary words — `was` x4, `hesitated`, `deepened`,
   * `until`, `hardly`, `to`. An unconditional rule writes "the Captain Was late", trading a defect
   * the reader noticed for one they would notice more.
   */
  it.each([
    'The Captain was late that evening.',
    'The Captain hesitated before answering.',
    'She waited until the Doctor deepened his frown.',
    'Sir until the tide turned, nothing moved.',
  ])('leaves untouched: %s', (line) => {
    expect(repairNameHygiene(line, CAST).text).toBe(line);
  });

  it('capitalises only what the cast list actually contains', () => {
    expect(repairNameHygiene('Captain ivor spoke.', CAST).text).toBe('Captain Ivor spoke.');
    // A lower-case title is repaired too, but ONLY because the name behind it is cast.
    expect(repairNameHygiene('captain ivor spoke.', CAST).text).toBe('Captain Ivor spoke.');
    expect(repairNameHygiene('the captain nodded.', CAST).text).toBe('the captain nodded.');
    // `bellamy` is not in this cast — a name from another story must not be invented into this one.
    expect(repairNameHygiene('Captain bellamy spoke.', CAST).text).toBe('Captain bellamy spoke.');
  });

  it('is the identity with no cast list', () => {
    const line = 'Dr finch said nothing.';
    expect(repairNameHygiene(line, []).text).toBe(line);
  });
});

describe('the apostrophe repair needs no guard', () => {
  it.each([
    ["she hadn t earned it", "she hadn't earned it"],
    ["they didn t arrive", "they didn't arrive"],
    ["it wasn t there", "it wasn't there"],
    ["he couldn t say", "he couldn't say"],
  ])('%s -> %s', (bad, good) => {
    expect(repairNameHygiene(bad, CAST).text).toBe(good);
  });

  it('does not touch a correct contraction or an ordinary "t"', () => {
    expect(repairNameHygiene("she hadn't earned it", CAST).text).toBe("she hadn't earned it");
    expect(repairNameHygiene('the boat t-boned the jetty', CAST).text).toBe('the boat t-boned the jetty');
  });
});

describe('reporting and chapter-level application', () => {
  it('names every repair, so a silent rewrite is impossible', () => {
    const r = repairNameHygiene('Dr finch and Captain ivor hadn t spoken.', CAST);
    expect(r.repairs).toHaveLength(3);
    expect(r.repairs.join(' ')).toContain('-> "Dr Finch"');
  });

  it('returns the input unchanged and an empty list when there is nothing to do', () => {
    const clean = 'Dr Finch and Captain Ivor Hale had not spoken.';
    const r = repairNameHygiene(clean, CAST);
    expect(r.text).toBe(clean);
    expect(r.repairs).toEqual([]);
  });

  it('walks chapters and tags each repair with its chapter number', () => {
    const { chapters, repairs } = repairNameHygieneInChapters(
      [{ paragraphs: ['Nothing wrong here.'] }, { paragraphs: ['Dr finch nodded.'] }],
      CAST,
    );
    expect(chapters[1].paragraphs[0]).toBe('Dr Finch nodded.');
    expect(repairs[0]).toMatch(/^ch2:/);
  });
});
