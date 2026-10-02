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
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

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

describe('there is only one DETECTION list', () => {
  /**
   * The second list this block used to police — `persistentMojibakePattern` in the worker's
   * `agent9/prose-text.ts` — was deleted with the v1 prose engine (owner decision 1, 2026-09-30).
   * The invariant is kept as a scan: the files whose source carries mojibake sequences are exactly the
   * known set, so a new copy of the vocabulary fails here instead of drifting silently.
   *
   * FOUND while rewriting this (2026-09-30): `encoding-validator.ts` has always carried its own
   * detection list, `ENCODING_PATTERN` — a second DETECTION copy the X79 unification and this test never
   * looked at. Unifying it changes what is detected (R2), so it is pinned here as known, not fixed.
   */
  const SRC_ROOTS = ['apps/worker/src', 'apps/api/src', 'packages'];
  const REPO = join(__dirname, '../../../..');
  const KNOWN = new Set([
    'packages/story-validation/src/chapter-validator.ts', // MOJIBAKE_PATTERN — the detector
    'packages/cml/src/mojibake.ts',                       // the repair table, paired with it
    'packages/story-validation/src/encoding-validator.ts', // ENCODING_PATTERN — the second detector (found, R2)
  ]);
  const walk = (dir: string, out: string[] = []): string[] => {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      if (['node_modules', 'dist', '__tests__'].includes(entry.name)) continue;
      const full = join(dir, entry.name);
      if (entry.isDirectory()) walk(full, out);
      else if (/\.ts$/.test(entry.name)) out.push(full);
    }
    return out;
  };
  const files = SRC_ROOTS.flatMap((r) => walk(join(REPO, r)))
    .filter((f) => MEMBERS.slice(0, 3).some((m) => readFileSync(f, 'utf8').includes(m)))
    .map((f) => f.slice(REPO.length + 1).split('\\').join('/'));

  it('the scan finds the detector itself (a scan that matched nothing would pass silently)', () => {
    expect(files).toContain('packages/story-validation/src/chapter-validator.ts');
  });

  it('no source file outside the known set carries the vocabulary', () => {
    expect(files.filter((f) => !KNOWN.has(f))).toEqual([]);
  });
});
