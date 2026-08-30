/**
 * A_76 — the reader's ch9/ch10 complaint, third time of asking.
 *
 * External read of `story_20260830-1850` (82/100): *"Chapter 10 does not reveal the culprit. It
 * re-clears Beatrice, Sylvia, and Hugo almost line by line."*
 *
 * Two causes, neither reachable by the clearance TRIM (which deletes redundant clearance SENTENCES,
 * and this book has none — the repetition is a STRUCTURE):
 *
 *  1. The contract forbade re-staging the reveal, quoting the confession and restating the method,
 *     but NOT re-clearing the innocent — while requirement 4 ("consequences on the surviving
 *     characters") actively invited a suspect-by-suspect tour.
 *  2. The outline handed chapter 10 a scene titled "The Culprit Revealed" with beat `revelation`,
 *     directly contradicting a contract that says the culprit was already exposed.
 */

import { describe, expect, it } from 'vitest';

import { buildChapterObligationBlock } from '../agent9-prose/obligation-block.js';

const CASE = {
  culpability: { culprits: ['Captain Ivor Hale'] },
  hidden_model: { mechanism: { description: 'the clock was rewound' } },
} as never;

const aftermathBlock = () =>
  buildChapterObligationBlock(
    [{ title: 'The Culprit Revealed', beat: 'revelation', summary: 'the last chapter' }],
    10, CASE, undefined, undefined, undefined, undefined, undefined,
    undefined, 'resolution', undefined, undefined,
    [{ title: 'The Culprit Revealed', beat: 'revelation' }],
    'aftermath_consequence',
  );

describe('the aftermath contract forbids the roll-call', () => {
  const block = aftermathBlock();

  it('is the aftermath contract at all', () => {
    expect(block).toContain('AFTERMATH CONTRACT');
  });

  it('forbids re-clearing the innocent', () => {
    expect(block).toMatch(/DO NOT RE-CLEAR THE INNOCENT/);
  });

  it('forbids a paragraph per suspect, which is the shape the reader objected to', () => {
    expect(block).toMatch(/NO ROLL-CALL/);
    expect(block).toMatch(/paragraph each in the order they were suspected/);
  });

  it('names the specific sentences to avoid rather than gesturing at "repetition"', () => {
    // A vague prohibition gets negotiated away; this model complies with countable things.
    expect(block).toMatch(/you could not have done it/);
    expect(block).toMatch(/alibi or corroboration/);
  });

  it('tells the writer the reveal-promising scene title is superseded', () => {
    expect(block).toMatch(/SCENE TITLE FOR THIS CHAPTER IS SUPERSEDED/);
    expect(block).toMatch(/Do not write toward the title/);
  });

  it('governs the TITLE the model returns, which is what the reader sees as the heading', () => {
    // The model authors `title`; saveReadableStory prints it verbatim. Instructing the writer to
    // ignore a reveal-promising outline title fixes the prose and still leaves
    // "## Chapter 10: The Culprit Revealed" on the page — the half the reader led with.
    expect(block).toMatch(/THE TITLE YOU RETURN MUST NOT PROMISE A REVEAL/);
    for (const banned of ['reveal', 'revelation', 'the culprit', 'exposed']) {
      expect(block).toContain(banned);
    }
  });

  it('still requires the consequence — the prohibitions must not empty the chapter', () => {
    expect(block).toMatch(/CONSEQUENCE/);
    expect(block).toMatch(/REMAINING QUESTIONS/);
  });
});

describe('non-aftermath chapters are untouched', () => {
  it('a mid-book chapter gets none of it', () => {
    const mid = buildChapterObligationBlock(
      [{ title: 'Alibis Under Scrutiny', beat: 'alibis' }],
      5, CASE, undefined, undefined, undefined, undefined, undefined,
      undefined, 'rising', undefined, undefined, [{ title: 'Alibis', beat: 'alibis' }], 'investigation',
    );
    expect(mid).not.toMatch(/DO NOT RE-CLEAR THE INNOCENT/);
    expect(mid).not.toMatch(/SCENE TITLE FOR THIS CHAPTER IS SUPERSEDED/);
  });
});
