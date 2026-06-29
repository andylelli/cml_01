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

describe('analyzeTemporalConsistency — ambiguous month disambiguation (May/March)', () => {
  // Regression for mystery-1782647685448: a sentence-initial modal "May" in a summery scene was read
  // as the month and flagged against "summery".
  it('does NOT read a sentence/quote-initial modal "May" as the month', () => {
    const text = "Her dress was a swirl of summery florals. 'May I?' Eleanor asked, extending her hand.";
    const a = analyzeTemporalConsistency(text);
    expect(a.mentionedMonths).toEqual([]);
    expect(a.conflictingSeasons).toEqual([]);
  });

  it('does NOT read the motion verb "march" as the month', () => {
    const text = "The summery heat pressed down as the guests began to march toward the terrace.";
    const a = analyzeTemporalConsistency(text);
    expect(a.mentionedMonths).toEqual([]);
  });

  it('STILL reads "May" as the month in an explicit calendar context', () => {
    expect(analyzeTemporalConsistency('In May the gardens were lively.').mentionedMonths).toContain('may');
    expect(analyzeTemporalConsistency('That May morning was crisp.').mentionedMonths).toContain('may');
    expect(analyzeTemporalConsistency('It happened on May 3rd, 1947.').mentionedMonths).toContain('may');
  });

  it('flags a genuine month/season conflict for a contextual May against summer wording', () => {
    const a = analyzeTemporalConsistency('In May the air already felt like high summer.');
    expect(a.mentionedMonths).toContain('may');
    expect(a.conflictingSeasons).toContain('summer');
  });
});

describe('analyzeTemporalConsistency — "mar" abbreviation vs the verb (A_53 P5)', () => {
  it('does NOT read the verb "mar" as the month March', () => {
    const a = analyzeTemporalConsistency('The autumnal damp would mar the polished sideboard by morning.');
    expect(a.mentionedMonths).not.toContain('march');
  });

  it('STILL reads the abbreviation "Mar." (with the period) as March', () => {
    const a = analyzeTemporalConsistency('The ledger entry was dated Mar. 14.');
    expect(a.mentionedMonths).toContain('march');
  });
});
