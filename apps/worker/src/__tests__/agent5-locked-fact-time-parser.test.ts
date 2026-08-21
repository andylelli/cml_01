/**
 * Agent 5's fair-play time check reads the ONE clock parser, not a private third copy.
 *
 * THE DEFECT (found by review, 2026-08-20). `findLockedFactClueTimeConflicts` compares a locked
 * fact's time against the time a mapped clue states — a real fair-play gate, because a clue that
 * contradicts a locked fact is a defect the reader WILL catch. It parsed both sides with a private
 * `parseWordFormTime`, a third body of a parser `@cml/cml` already owns, and it had drifted badly:
 *
 *   • **no "to" branch at all** — "a quarter to three", the most common time form in the corpus,
 *     was simply invisible to it;
 *   • `^quarter\s+past` anchored, so a leading article ("a quarter past eight") did not match;
 *   • none of `parseClockTime`'s widenings ever reached it — X61's any-minute-count, X67's
 *     hour-minutes / daypart / meridiem forms, the curly-apostrophe fold.
 *
 * MEASURED over the archived registries: of the 36 locked facts that ARE clock times, the private
 * copy read 15 and **silently skipped 21 — 58%**. The check declined on more cases than it examined,
 * and `if (!parsedFact) continue;` meant it did so without a word.
 *
 * This is the same class as X38's accept.ts divergence and X61/X67: a second reader of one
 * vocabulary. The fix is not a better copy, it is no copy.
 */

import { describe, expect, it } from 'vitest';
import { parseClockTime } from '@cml/cml';

/** Every distinct form the archived registries contain that the private parser skipped. */
const PREVIOUSLY_SKIPPED = [
  'a quarter past nine',
  'a quarter to three',
  'a quarter to eleven',
  'a quarter to nine',
  'a quarter past ten',
  'a quarter to ten',
  'twenty minutes to eleven',
  'a quarter to four',
  'a quarter past seven in the evening',
  'five minutes past seven in the evening',
  'a quarter to eight',
];

describe('the forms agent5 used to skip are all readable now', () => {
  it.each(PREVIOUSLY_SKIPPED)('reads %s', (value) => {
    expect(parseClockTime(value)).not.toBeNull();
  });

  it('reads every "to" form, which the private copy had no branch for at all', () => {
    expect(parseClockTime('a quarter to three')).toBe(2 * 60 + 45);
    expect(parseClockTime('twenty minutes to eleven')).toBe(10 * 60 + 40);
    expect(parseClockTime('ten minutes to nine')).toBe(8 * 60 + 50);
  });

  it('is not defeated by a leading article, which the anchored pattern was', () => {
    expect(parseClockTime('a quarter past eight')).toBe(parseClockTime('quarter past eight'));
    expect(parseClockTime('a quarter to three')).toBe(parseClockTime('quarter to three'));
  });

  it('compares two spellings of one time as equal — the point of the check', () => {
    // A locked fact and a clue may legitimately word the same moment differently. The comparison is
    // only meaningful if both sides resolve to the same number.
    expect(parseClockTime('a quarter past eight')).toBe(parseClockTime('8:15'));
    expect(parseClockTime('half past nine')).toBe(parseClockTime('9:30'));
    expect(parseClockTime('two o’clock')).toBe(parseClockTime('2:00'));
  });

  it('still refuses text that states no time, so the check declines rather than inventing one', () => {
    expect(parseClockTime('shortly after the storm')).toBeNull();
    expect(parseClockTime('')).toBeNull();
    expect(parseClockTime(undefined)).toBeNull();
  });
});
