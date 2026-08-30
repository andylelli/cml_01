/**
 * A_75 §16 — the final attempt is the one that ships, and it was writing blind.
 *
 * `chooseRetryPromptStrategy` dropped the prior draft on every final attempt, whatever had failed.
 * Measured over 323 chapters, chapters that retried are more abstract (rho 0.183; back-half
 * position-controlled +2.43 points, t = 2.97), and the dose-response peaks at 3 attempts — which is
 * where that branch fires.
 *
 * The two properties worth pinning are the two halves of the claim: that the draft is KEPT when the
 * prose was not what failed, and that it is still DISCARDED when the wording itself is implicated.
 * A fix that kept the draft on a template failure would re-anchor the model to the phrasing that
 * failed, which is the defect `targeted_rebuild` exists to avoid.
 */

import { describe, expect, it } from 'vitest';

import {
  chooseRetryPromptStrategy,
  isFinalAttemptKeepsDraftEnabled,
  buildEnhancedRetryFeedback,
} from '../agent9-prose/generate.js';

const CLUE_FAILURE = [
  'Clue obligation: suspect clearance missing for "Captain Ivor Hale".',
  'Stage-mode outcome failed (aftermath_consequence): the chapter stages a fresh confession.',
];
// Must be a string `detectRetryIssueFamilies` actually classifies as "template" — it matches on
// `template linter|opening-style entropy|paragraph fingerprint|n-gram overlap|...`, not on the word
// "template" alone. A hand-invented phrase silently lands in no family at all and the test then
// proves nothing about the guard it is supposed to be checking.
const TEMPLATE_FAILURE = [
  'template linter: opening-style entropy below threshold; paragraph fingerprint repeats.',
];

/** Run with the flag forced to a known state, then restore — tests must not leak env. */
const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const prev = process.env.AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT;
  if (value === undefined) delete process.env.AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT;
  else process.env.AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT = value;
  try { return fn(); } finally {
    if (prev === undefined) delete process.env.AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT;
    else process.env.AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT = prev;
  }
};

describe('the flag is read at call time', () => {
  it('is off by default and settable from the environment', () => {
    expect(isFinalAttemptKeepsDraftEnabled({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isFinalAttemptKeepsDraftEnabled({ AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT: 'true' } as never)).toBe(true);
    expect(isFinalAttemptKeepsDraftEnabled({ AGENT9_FINAL_ATTEMPT_KEEPS_DRAFT: '1' } as never)).toBe(true);
  });
});

describe('with the flag OFF the behaviour is byte-identical to today', () => {
  it('still discards the draft on a final attempt', () => {
    withFlag(undefined, () => {
      const s = chooseRetryPromptStrategy(CLUE_FAILURE, 3, 3);
      expect(s.mode).toBe('full_rebuild');
      expect(s.includePriorDraft).toBe(false);
    });
  });
});

describe('with the flag ON', () => {
  it('KEEPS the draft when the prose was not what failed', () => {
    // The case that provoked this: six attempts on fair_play + missing clearances. Not one of those
    // is a complaint about a sentence, and every sentence was discarded anyway.
    withFlag('true', () => {
      const s = chooseRetryPromptStrategy(CLUE_FAILURE, 3, 3);
      expect(s.mode).toBe('full_rebuild');
      expect(s.includePriorDraft).toBe(true);
      expect(s.rationale.join(' ')).toContain('prose was not the failure');
    });
  });

  it('still DISCARDS it when the wording itself is implicated', () => {
    withFlag('true', () => {
      const s = chooseRetryPromptStrategy(TEMPLATE_FAILURE, 3, 3);
      expect(s.includePriorDraft).toBe(false);
    });
  });

  it('still discards on a hard mitigation — a split chapter is not the chapter that was written', () => {
    withFlag('true', () => {
      const s = chooseRetryPromptStrategy(CLUE_FAILURE, 1, 3, {
        deterministicMitigation: { type: 'split_chapter' },
      } as never);
      expect(s.includePriorDraft).toBe(false);
    });
  });

  it('does not disturb the non-final paths', () => {
    withFlag('true', () => {
      // A single-family, non-template failure below max attempts already kept its draft.
      const surgical = chooseRetryPromptStrategy(['Clue obligation: suspect clearance missing for "X".'], 1, 3);
      expect(surgical.mode).toBe('surgical_patch');
      expect(surgical.includePriorDraft).toBe(true);
    });
  });
});

/**
 * A_76 free-item 2 — the rehearsal that caught the lever being a no-op.
 *
 * `chooseRetryPromptStrategy` returning `includePriorDraft: true` is necessary and NOT sufficient:
 * the batch path additionally required `attempt < maxBatchAttempts` before attaching the draft, and
 * that is false on exactly the attempt this flag targets. The boolean flipped and nothing reached the
 * model. These pin the CONSUMED contract rather than the returned one.
 */
describe('the strategy is the only authority on attaching the draft', () => {
  it('says "use the existing draft" in the retry contract when the flag keeps it', () => {
    withFlag('true', () => {
      const s = chooseRetryPromptStrategy(CLUE_FAILURE, 3, 3);
      expect(s.includePriorDraft).toBe(true);
    });
  });

  it('and says the opposite with the flag off, so the contract text tracks the decision', () => {
    withFlag(undefined, () => {
      const s = chooseRetryPromptStrategy(CLUE_FAILURE, 3, 3);
      expect(s.includePriorDraft).toBe(false);
    });
  });
});

/**
 * A_76 — the word-count repair must not contradict the retry contract.
 *
 * The final-attempt word-count branch said "REBUILD from scratch. Do not patch the prior draft."
 * unconditionally. With the flag on, `chooseRetryPromptStrategy` puts "Use the existing draft as
 * reference" in the SAME prompt. Two instructions in direct conflict would silently negate the lever
 * on exactly the chapters that retry hardest.
 */
describe('the word-count repair respects the same decision', () => {
  const CASE_DATA = { CASE: { meta: { title: 'x' } } } as never;
  // Must match the real trigger: `/word count below (hard floor|preferred target|minimum)/i`
  // WITH a `(current/target)` pair, or the word-count branch is never entered and the test asserts
  // against generic feedback. A hand-written approximation passes nothing.
  const shortErrors = ['Chapter 7 word count below hard floor (620/1200).'];

  it('says REBUILD with the flag off — unchanged behaviour', () => {
    withFlag(undefined, () => {
      const fb = buildEnhancedRetryFeedback(shortErrors, CASE_DATA, '7', 3, 3, { targetWords: 1200 } as never);
      expect(fb).toMatch(/REBUILD from scratch/);
      expect(fb).not.toMatch(/KEEP the paragraphs that already work/);
    });
  });

  it('says EXPAND with the flag on, and never both', () => {
    withFlag('true', () => {
      const fb = buildEnhancedRetryFeedback(shortErrors, CASE_DATA, '7', 3, 3, { targetWords: 1200 } as never);
      expect(fb).toMatch(/KEEP the paragraphs that already work/);
      expect(fb).not.toMatch(/REBUILD from scratch/);
    });
  });
});
