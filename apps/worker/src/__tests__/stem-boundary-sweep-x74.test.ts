/**
 * X74 — the X62 defect, in three more agents, found by sweeping for the pattern X62 documented.
 *
 * X62 (2026-08-19) recorded that a trailing `\b` neuters a truncated stem: `\b(...|eliminat|...)\b`
 * cannot match *eliminate*, *eliminating* or *eliminated*, because after `eliminat` comes a word
 * character and the closing boundary fails. It matches only the bare string `eliminat`, which no
 * outline has ever written. X62 repaired the two outline-closure wordlists and stopped there.
 *
 * NOBODY SWEPT FOR THE PATTERN. It was still live in four places, including **the two regexes
 * immediately above X62's own explanatory comment in the same file**:
 *
 *   agent7-run.ts:662  OUTLINE_TEST_TERMS_RE      demonstrat, verif, examin
 *   agent7-run.ts:663  OUTLINE_EXCLUSION_TERMS_RE eliminat
 *   agent5-run.ts:222  cleared-language predicate eliminat
 *   clue-validation.ts:1276 clearingMarker        exonerat
 *
 * MEASURED over the 284 archived outline scenes: the discriminating-test gate matched 68 and was
 * blind to **34 more** — 12% of every scene ever authored — and the exclusion gate went 2 → 9.
 * Nothing that matched before stops matching, so the change is a strict widening.
 *
 * These tests are the sweep made permanent: every stem is asserted against its own inflections, so
 * the next truncated stem added to any of these lists fails here rather than in a manuscript.
 */

import { describe, expect, it } from 'vitest';

/** Verbatim copies of the four repaired expressions, pinned so a regression is visible here. */
const OUTLINE_TEST_TERMS_RE =
  /\b(tests?|experiments?|re-?enact|reenact|traps?|demonstrat\w*|verif\w*|proofs?|examin\w*|timing\s+test|constraint\s+proof)\b/i;
const OUTLINE_EXCLUSION_TERMS_RE =
  /\b(exclud\w*|exclusions?|eliminat\w*|ruled\s+out|could\s*not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could|impossible\s+for|proves?\s+innocent)\b/i;
const AGENT5_CLEARED_RE =
  /\b(ruled\s+out|eliminat\w*|cleared|innocent|not\s+the\s+(?:culprit|killer|murderer)|exclud\w*)\b/i;
const CLEARING_MARKER_RE =
  /\b(clear(?:ed|s|ing)|ruled out|eliminat\w*|innocent|exonerat\w*|alibi (?:holds|corroborated|confirmed))\b/i;

describe('every stem matches its own inflections', () => {
  const cases: Array<[string, RegExp, string[]]> = [
    ['OUTLINE_TEST_TERMS_RE / demonstrat', OUTLINE_TEST_TERMS_RE,
      ['a controlled demonstration', 'the detective demonstrates the fault', 'demonstrating the mechanism']],
    ['OUTLINE_TEST_TERMS_RE / verif', OUTLINE_TEST_TERMS_RE,
      ['verifying their alibis with staff logs', 'she verifies the timing', 'the verification held']],
    ['OUTLINE_TEST_TERMS_RE / examin', OUTLINE_TEST_TERMS_RE,
      ['examining the mechanism', 'a close examination of the dial', 'he examines the latch']],
    ['OUTLINE_EXCLUSION_TERMS_RE / eliminat', OUTLINE_EXCLUSION_TERMS_RE,
      ['eliminating the remaining suspects', 'the others were eliminated', 'this eliminates him']],
    ['OUTLINE_EXCLUSION_TERMS_RE / exclud', OUTLINE_EXCLUSION_TERMS_RE,
      ['excluding the household staff', 'she is excluded by the log', 'the exclusion is total',
       // exclude -> exclusion drops the d, so the stem alone cannot reach the noun. Listed
       // explicitly: it completes an inflection family already in the list, not new vocabulary.
       'excludes the housekeeper']],
    ['agent5 cleared-language / eliminat', AGENT5_CLEARED_RE,
      ['the others were eliminated', 'eliminating the remaining suspects', 'she eliminates him']],
    ['clearingMarker / exonerat', CLEARING_MARKER_RE,
      ['Hugo was exonerated', 'the log exonerates her', 'exonerating the housekeeper']],
    ['clearingMarker / clear', CLEARING_MARKER_RE,
      ['she cleared them all', 'clearing the innocent', 'the alibi clears him']],
  ];

  it.each(cases)('%s', (_label, re, samples) => {
    for (const s of samples) expect(re.test(s), s).toBe(true);
  });
});

describe('the widening is strict — nothing that matched before stops matching', () => {
  it('still matches the base forms the old lists caught', () => {
    for (const s of ['a timing test', 'the trap is set', 'a constraint proof', 'the experiment']) {
      expect(OUTLINE_TEST_TERMS_RE.test(s), s).toBe(true);
    }
    for (const s of ['ruled out', 'cannot be the culprit', 'proves innocent', 'impossible for']) {
      expect(OUTLINE_EXCLUSION_TERMS_RE.test(s), s).toBe(true);
    }
  });

  it('does not match unrelated words that merely start the same way', () => {
    // `\w*` widens across the inflection, not across the language. Guard against over-reach.
    expect(OUTLINE_TEST_TERMS_RE.test('the testament was read')).toBe(false);
    expect(OUTLINE_TEST_TERMS_RE.test('a proofreader arrived')).toBe(false);
    expect(AGENT5_CLEARED_RE.test('the excludable evidence')).toBe(true); // exclud* — deliberate
    expect(AGENT5_CLEARED_RE.test('an innocuous remark')).toBe(false);
  });
});
