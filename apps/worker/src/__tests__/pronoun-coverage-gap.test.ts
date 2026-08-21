/**
 * A character the pronoun checks cannot read must say so.
 *
 * FOUND BY REVIEW, 2026-08-20. `agent2-cast.ts` prints "gender (male|female|non-binary)" into the
 * schema block, and the type allows all three — so Agent 2 is explicitly invited to produce a
 * non-binary character. Three detectors in `agent9-run.ts` then filter the cast with
 * `/^(male|female)$/i`:
 *
 *   • attribution flips
 *   • impossible self-references
 *   • the he/she pronoun monotonicity comparison
 *
 * Such a character is dropped from every one of them, silently. Excluding them is the safe half of
 * the choice — scoring a they/them character against a binary he/she comparison would manufacture
 * false positives, and singular "they" is genuinely ambiguous with the plural — but doing it without
 * a word is not. This project has spent several work items on pronoun drift because a reader named
 * it; a character the machinery cannot check belongs in the run log, not in a manuscript.
 *
 * MEASURED: 0 of 154 archived characters carry a value outside male/female, so the gap is latent. It
 * opens the first time the model accepts an invitation the pipeline itself prints.
 */

import { describe, expect, it } from 'vitest';

import { warnOnUncheckedPronounGenders } from '../jobs/agents/agent9-run.js';

const collect = (cast: Array<{ name?: unknown; gender?: unknown }>): string[] => {
  const out: string[] = [];
  warnOnUncheckedPronounGenders(cast, (m) => out.push(m));
  return out;
};

describe('the pronoun-coverage gap is reported, not hidden', () => {
  it('says nothing for the all-binary cast the archive actually contains', () => {
    expect(collect([
      { name: 'Eleanor Voss', gender: 'female' },
      { name: 'Hugo Vane', gender: 'male' },
      { name: 'Beatrice Quill', gender: 'Female' },
    ])).toEqual([]);
  });

  it('names the character and their value when one falls outside the checks', () => {
    const [warning] = collect([
      { name: 'Eleanor Voss', gender: 'female' },
      { name: 'Robin Ash', gender: 'non-binary' },
    ]);
    expect(warning).toBeDefined();
    expect(warning).toContain('Robin Ash');
    expect(warning).toContain('non-binary');
    expect(warning).toContain('UNVERIFIED');
  });

  it('names every such character, not just the first', () => {
    const [warning] = collect([
      { name: 'Robin Ash', gender: 'non-binary' },
      { name: 'Sam Pike', gender: 'nonbinary' },
      { name: 'Hugo Vane', gender: 'male' },
    ]);
    expect(warning).toContain('Robin Ash');
    expect(warning).toContain('Sam Pike');
    expect(warning).toContain('2 character(s)');
  });

  it('treats an absent or empty gender as "not stated", which is a different thing', () => {
    // A missing value is upstream incompleteness; the pronoun checks skip it for their own reasons
    // and this warning would only add noise. Only a STATED value outside the pair is reported.
    expect(collect([{ name: 'A' }, { name: 'B', gender: '' }, { name: 'C', gender: '   ' }])).toEqual([]);
  });

  it('survives an empty or malformed cast rather than throwing into a paid run', () => {
    expect(() => collect([])).not.toThrow();
    expect(() => collect(undefined as never)).not.toThrow();
    expect(collect([{} as never])).toEqual([]);
  });
});
