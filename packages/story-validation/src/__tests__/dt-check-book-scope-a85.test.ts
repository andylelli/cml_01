/**
 * A_85 F1 — `AGENT9_DT_CHECK_BOOK_SCOPE`: the discriminating-test check judges its obligation at BOOK
 * scope when the committed chapters are supplied.
 *
 * MEASURED 2026-09-08: `checkDiscriminatingTest` fired on chapters 9 AND 10 in every run with a worker
 * log; on run 24901 chapter 9 was rejected 3/3 on it after the run's own DT-scene check had accepted
 * the test in chapter 8. The reviewer's pacing note was "Ch. 7–9 repeat the ledger proof". These tests
 * use that run's real test design and both flag states.
 */

import { afterEach, describe, expect, it } from 'vitest';
import { ChapterValidator, isDiscriminatingTestBookScopeEnabled } from '../chapter-validator.js';

const DESIGN =
  'A forensic examination comparing the ledger’s ink patches and handwriting pressure with the ' +
  'manager’s known hand, performed in front of every suspect.';

const cml: any = {
  CASE: {
    cast: [
      { name: 'Neville Ingram', role_archetype: 'detective' },
      { name: 'Lavinia Yardley', role_archetype: 'suspect' },
    ],
    discriminating_test: { design: DESIGN },
  },
};

/** Chapter 8 as the run wrote it: the test is staged here. */
const CH8_TEXT =
  'Neville Ingram laid the ledger open under the lamp. The forensic examination took twenty minutes: ' +
  'the ink patches darkened where the solvent had been, and the handwriting pressure on the altered ' +
  'line was heavier than anywhere else on the page. Lavinia Yardley said nothing.';

/** Chapter 9 as an aftermath: clearances, no test on the page. */
const CH9_TEXT =
  'By morning the hotel had found its routine again. Neville Ingram walked the corridor with the ' +
  'files under his arm and told Dorothy she had never been suspected, which was almost true.';

const validate = (text: string, priorChaptersText?: string) =>
  new ChapterValidator()
    .validateChapter(
      { title: 'Chapter 9', paragraphs: [text], chapterNumber: 9, totalChapters: 10, priorChaptersText },
      cml,
    )
    .issues.filter((i) => i.message.includes('discriminating test'));

const withEnv = (value: string | undefined, fn: () => void) => {
  const prior = process.env.AGENT9_DT_CHECK_BOOK_SCOPE;
  if (value === undefined) delete process.env.AGENT9_DT_CHECK_BOOK_SCOPE;
  else process.env.AGENT9_DT_CHECK_BOOK_SCOPE = value;
  try { fn(); } finally {
    if (prior === undefined) delete process.env.AGENT9_DT_CHECK_BOOK_SCOPE;
    else process.env.AGENT9_DT_CHECK_BOOK_SCOPE = prior;
  }
};
afterEach(() => { delete process.env.AGENT9_DT_CHECK_BOOK_SCOPE; });

describe('AGENT9_DT_CHECK_BOOK_SCOPE — a test already staged is not demanded again', () => {
  it('flag OFF: chapter 9 without the test fails even though chapter 8 staged it (the defect, pinned)', () => {
    withEnv(undefined, () => {
      expect(isDiscriminatingTestBookScopeEnabled()).toBe(false);
      expect(validate(CH9_TEXT, CH8_TEXT)).toHaveLength(1);
    });
  });

  it('flag ON: chapter 9 passes when the committed chapters carry the test', () => {
    withEnv('true', () => {
      expect(isDiscriminatingTestBookScopeEnabled()).toBe(true);
      expect(validate(CH9_TEXT, CH8_TEXT)).toHaveLength(0);
    });
  });

  it('flag ON: a book whose test appears NOWHERE still fails on its last chapters', () => {
    withEnv('true', () => {
      const noTestAnywhere = 'Chapter one was about the weather. Chapter two was about the tide.';
      expect(validate(CH9_TEXT, noTestAnywhere)).toHaveLength(1);
    });
  });

  it('flag ON but no prior text supplied: chapter-scoped, byte for byte as before', () => {
    withEnv('true', () => {
      expect(validate(CH9_TEXT, undefined)).toHaveLength(1);
      expect(validate(CH8_TEXT, undefined)).toHaveLength(0);
    });
  });

  it('the chapter carrying the test itself passes in both states', () => {
    withEnv(undefined, () => expect(validate(CH8_TEXT, '')).toHaveLength(0));
    withEnv('true', () => expect(validate(CH8_TEXT, '')).toHaveLength(0));
  });
});
