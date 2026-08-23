/**
 * A_72 C2 — the writer is told a fact's NAME, not the pipeline's sentence about it.
 *
 * MEASURED CAUSE. Three prompt sites rendered `description: "value"`, and the description is authored
 * prose written for the pipeline. Under the simultaneous instruction never to repeat a phrase, the
 * 08-23 manuscript returned it paraphrased and worse:
 *
 *   description  "The official high tide time on the murder day as per hotel tide charts"
 *   the page     "The CERTIFIED WAVE CREST HOUR atop the murder day AS PER INNKEEPER'S TIDE CHARTS"
 *
 * That is "generated validation language" at its source, and it is why that read scored prose 6/10.
 */

import { describe, expect, it } from 'vitest';

import { lockedFactLabel } from '../shared/locked-fact-atoms.js';

describe('lockedFactLabel', () => {
  it('turns the id into a short neutral name', () => {
    expect(lockedFactLabel({ id: 'high_tide_time', description: 'The official high tide time on the murder day as per hotel tide charts' }))
      .toBe('high tide time');
    expect(lockedFactLabel({ id: 'weapon_release_time' })).toBe('weapon release time');
  });

  it('NEVER passes the authored description through when an id exists', () => {
    const label = lockedFactLabel({
      id: 'high_tide_time',
      description: 'The official high tide time on the murder day as per hotel tide charts',
    });
    // The two phrases the manuscript lifted and mangled.
    expect(label).not.toMatch(/as per/i);
    expect(label).not.toMatch(/murder day/i);
    expect(label.split(/\s+/).length).toBeLessThanOrEqual(4);
  });

  it('reads camelCase and hyphenated ids as words', () => {
    expect(lockedFactLabel({ id: 'highTideTime' })).toBe('high tide time');
    expect(lockedFactLabel({ id: 'weapon-release-time' })).toBe('weapon release time');
    expect(lockedFactLabel({ id: 'ledger.entry.week2' })).toBe('ledger entry week2');
  });

  it('falls back to the FIRST FEW WORDS of the description, not the whole sentence', () => {
    const label = lockedFactLabel({ description: 'The official high tide time on the murder day as per hotel tide charts' });
    expect(label).toBe('The official high tide time');
    expect(label).not.toMatch(/as per/i);
  });

  it('degrades to something usable rather than empty', () => {
    expect(lockedFactLabel({})).toBe('locked value');
    expect(lockedFactLabel({ id: '   ', description: '' })).toBe('locked value');
    expect(lockedFactLabel({ id: '_' })).toBe('locked value');
  });

  it('strips trailing punctuation from a description fallback', () => {
    expect(lockedFactLabel({ description: 'The tide chart reading.' })).toBe('The tide chart reading');
  });
});
