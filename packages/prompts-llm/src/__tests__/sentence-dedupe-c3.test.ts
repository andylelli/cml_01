/**
 * A_72 C3 — repeated sentences, at both scopes.
 *
 * MEASURED CAUSE. The 08-23 manuscript shipped five verbatim repeated sentences and scored `prose`
 * 6/10, its worst category. Two were intra-chapter and the threshold missed them (the sentence the
 * reader quoted normalises to 40 characters against a floor of 45). Three were cross-chapter, which a
 * comment claimed `paragraph_fingerprint` covered — it does not: that check matches whole PARAGRAPHS.
 */

import { describe, expect, it } from 'vitest';

import { lintBatchProse } from '../agent9-prose/lint.js';

const chapter = (title: string, paragraphs: string[]) => ({ title, paragraphs }) as any;
const types = (issues: any[]) => issues.map((i) => i.type);

/** The sentence the external reader quoted back. Normalises to 40 characters. */
const QUOTED = 'By then it was a ten minutes past eleven.';

describe('intra-chapter repeats', () => {
  it('catches the 40-character sentence the old 45 floor let through', () => {
    const issues = lintBatchProse(
      [chapter('One', [`The tide was out. ${QUOTED}`, `She checked the log again. ${QUOTED}`])],
      [], [],
    );
    expect(types(issues)).toContain('intra_chapter_sentence_duplicate');
  });

  it('still ignores genuinely short repeated sentences', () => {
    // Below the floor: "He nodded." twice is prose rhythm, not scaffold.
    const issues = lintBatchProse(
      [chapter('One', ['He nodded. The room was cold and very quiet indeed.', 'He nodded. Nothing further was said by anyone.'])],
      [], [],
    );
    expect(types(issues)).not.toContain('intra_chapter_sentence_duplicate');
  });

  it('passes a chapter with no repetition', () => {
    const issues = lintBatchProse(
      [chapter('One', ['The tide was out and the shingle glistened in the failing light.', 'She checked the harbour log once more before speaking.'])],
      [], [],
    );
    expect(types(issues)).not.toContain('intra_chapter_sentence_duplicate');
  });
});

describe('cross-chapter echo', () => {
  const prior = [chapter('One', [`The tide was out. ${QUOTED}`])];
  const batch = [chapter('Six', [`Eleanor returned to the beach at last. ${QUOTED}`])];

  it('is SILENT by default — 6 per book would put a retry on every chapter', () => {
    const issues = lintBatchProse(batch, prior, []);
    expect(types(issues)).not.toContain('cross_chapter_sentence_echo');
  });

  it('raises the issue when the caller opts in', () => {
    const issues = lintBatchProse(batch, prior, [], { crossChapterEcho: true });
    expect(types(issues)).toContain('cross_chapter_sentence_echo');
    const echo = issues.find((i) => i.type === 'cross_chapter_sentence_echo')!;
    expect(echo.message).toMatch(/already appear verbatim in an earlier chapter/);
    // The retry builder needs the offending text, exactly as paragraph_fingerprint provides it.
    expect(echo.matchingPriorParagraph).toBeTruthy();
  });

  it('does not fire when the chapters share no sentence', () => {
    const issues = lintBatchProse(
      [chapter('Six', ['Eleanor returned to the beach with the harbour log under her arm.'])],
      prior, [], { crossChapterEcho: true },
    );
    expect(types(issues)).not.toContain('cross_chapter_sentence_echo');
  });

  it('ignores a short echo, so ordinary dialogue beats are not flagged', () => {
    const issues = lintBatchProse(
      [chapter('Six', ['"Quite so," he said. The fog had thickened considerably by then.'])],
      [chapter('One', ['"Quite so," he said. Nothing else was offered to her.'])],
      [], { crossChapterEcho: true },
    );
    expect(types(issues)).not.toContain('cross_chapter_sentence_echo');
  });
});
