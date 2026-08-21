/**
 * X79 — the release gate's flagship hard stop was reading a shorter list than the validator.
 *
 * FOUND BY REVIEW, 2026-08-20, by sweeping for vocabulary regexes duplicated across files and
 * diffing the copies. The mojibake list existed twice:
 *
 *   packages/story-validation/src/chapter-validator.ts   18 members  (raises a validation issue)
 *   apps/worker/src/jobs/agents/agent9/prose-text.ts     10 members  (feeds the HARD STOP)
 *
 * and the shorter one is the one `proseContainsMojibake` reads. Mojibake is one of only SEVEN
 * conditions that can abort a run — X68 names it as the archetype of "broken-looking text stops a
 * run while a story defect does not" — and it was blind to nine sequences the validator flags: the
 * double-encoded quote, em-dash, en-dash and ellipsis forms, plus the bare non-breaking-space
 * artifacts.
 *
 * They had drifted in BOTH directions: each copy encoded the mojibake for a curly opening double
 * quote differently, so one of the two was hunting bytes that do not occur. A vocabulary maintained
 * in two places does not stay one vocabulary — the lesson X61, X67, X74 and X75 each already bought.
 *
 * MEASURED over 191 archived manuscripts: both patterns flag the same 2, so the divergence never
 * shipped a defect. Fixed as a UNION, because neither list was a superset of the other.
 */

import { describe, expect, it } from 'vitest';

import { MOJIBAKE_PATTERN } from '../chapter-validator.js';

/**
 * The members, taken FROM the pattern rather than retyped.
 *
 * Real mojibake is UTF-8 read back as WINDOWS-1252, not Latin-1 — 0x80 is the euro sign in CP1252
 * and a control character in Latin-1 — so Node's Buffer cannot construct these samples, and a
 * hand-typed literal is one bad paste away from testing nothing. Splitting the pattern is exact.
 */
const MEMBERS = MOJIBAKE_PATTERN.source.replace(/^\(\?:/, '').replace(/\)$/, '').split('|');

/** Turn a regex member back into the literal string it matches. */
const asLiteral = (member: string): string =>
  member
    .replace(/\\x([0-9a-f]{2})/gi, (_m, h) => String.fromCharCode(parseInt(h, 16)))
    .replace(/\\u([0-9a-f]{4})/gi, (_m, h) => String.fromCharCode(parseInt(h, 16)));

describe('the one mojibake vocabulary', () => {
  it('is the union of both copies', () => {
    // 18 in the validator, 10 in the worker, one of which was unique to it.
    expect(MEMBERS.length).toBe(19);
  });

  it('has no dead member — every sequence it lists actually matches', () => {
    for (const member of MEMBERS) {
      expect(MOJIBAKE_PATTERN.test(asLiteral(member)), member).toBe(true);
    }
  });

  it('contains the sequences the HARD STOP was missing', () => {
    // The nine live only in the validator copy before this fix: every double-encoded form (they all
    // begin with the mojibake for "Ã") plus the bare non-breaking-space artifacts.
    const doubleEncodedOrNbsp = MEMBERS.filter((m) => /^(Ã|Ë|Â$)/.test(m));
    expect(doubleEncodedOrNbsp.length).toBeGreaterThanOrEqual(9);
    for (const m of doubleEncodedOrNbsp) {
      expect(MOJIBAKE_PATTERN.test(asLiteral(m)), m).toBe(true);
    }
  });

  it('flags the replacement character, which both copies already had', () => {
    expect(MOJIBAKE_PATTERN.test('a replacement char � here')).toBe(true);
  });
});

describe('it does not flag clean prose', () => {
  it('passes correctly-encoded Golden Age punctuation', () => {
    const clean = [
      '“A quarter to three,” she said — and the clock disagreed.',
      'It had taken twenty–five minutes… or so he claimed.',
      'Eleanor’s watch had stopped at twenty past midnight.',
      'The fog, the bell tower, the blackout curtains: all of it fit.',
    ].join('\n\n');
    expect(MOJIBAKE_PATTERN.test(clean)).toBe(false);
  });

  it('passes plain ASCII', () => {
    expect(MOJIBAKE_PATTERN.test('The body was found in the lounge at a quarter past eight.')).toBe(false);
  });
});

describe('there is only one list', () => {
  it('the worker HARD-STOP pattern IS this pattern, not a copy of it', async () => {
    // If prose-text.ts ever grows its own literal again, this identity check fails. That file is
    // what `proseContainsMojibake` reads, and `proseContainsMojibake` is what aborts the run.
    const { persistentMojibakePattern } = await import(
      '../../../../apps/worker/src/jobs/agents/agent9/prose-text.js'
    );
    expect(persistentMojibakePattern.source).toBe(MOJIBAKE_PATTERN.source);
  });
});
