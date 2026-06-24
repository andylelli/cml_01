import { describe, expect, it } from 'vitest';
import { analyzeTemporalConsistency } from '../temporal-consistency.js';

describe('analyzeTemporalConsistency — mechanical-spring exclusion', () => {
  it('does NOT flag a clock mainspring as the season "spring" in a summer story', () => {
    const text =
      "It was July at the manor. The clock spring showed abnormal tension, " +
      "and the mainspring had been wound backward beyond its normal limit.";
    const a = analyzeTemporalConsistency(text, 'July');
    expect(a.expectedSeasons).toContain('summer');
    expect(a.conflictingSeasons).toEqual([]); // clock spring must not read as the season
  });

  it('still flags a genuine seasonal "spring" against a July anchor', () => {
    const text = "It was July, yet the gardens were full of spring blossom and vernal light.";
    const a = analyzeTemporalConsistency(text, 'July');
    expect(a.conflictingSeasons).toContain('spring');
  });

  it('flags an unambiguous "springtime" even near a clock', () => {
    const text = "In July, the clock spring was tight, but the air felt like springtime.";
    const a = analyzeTemporalConsistency(text, 'July');
    expect(a.conflictingSeasons).toContain('spring');
  });

  it('handles possessive and hyphenated mechanical spring forms', () => {
    const text = "July heat. The clock's spring and the wound spring left scratches; spring tension was high.";
    const a = analyzeTemporalConsistency(text, 'July');
    expect(a.conflictingSeasons).toEqual([]);
  });

  it('still catches a real cross-season conflict (summer wording in winter)', () => {
    const text = "December snow lay deep, yet the midsummer warmth was unmistakable.";
    const a = analyzeTemporalConsistency(text, 'December');
    expect(a.conflictingSeasons).toContain('summer');
  });
});
