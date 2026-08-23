/**
 * The full-story repetition polish was an INERT LEVER, and the reason it stayed inert for a month is
 * that being rejected wrote exactly the same telemetry as having nothing to do.
 *
 * MEASURED, before any of this was changed:
 *
 *   logs/llm.jsonl                              2 calls in the pipeline's entire history
 *                                               (Ch4 + Ch10, 2026-07-25, gpt-4.1), both successful,
 *                                               2,506 and 1,632 completion tokens returned
 *   results/ab-agent9_fullstory_polish/*.json   4 treatment arms, AGENT9_FULLSTORY_POLISH=true
 *                                               editedChapters: [] on every single one
 *                                               recurringPhraseCount 5, 7, 15 — work was available
 *
 * So the pass produced usable prose twice and its own guard rolled back both, and three other runs
 * made no call at all. Those are two completely different faults — a targeting failure and a guard
 * that refuses everything — and the report could not tell them apart, because the only field written
 * was `editedChapters`, which is empty in both cases.
 *
 * That is the shape this codebase keeps re-learning and keeps paying for: X37 (a refused scorer that
 * looked like scoring switched off), A_70/A_71 (a capability whose read path did not exist on the path
 * that mattered), 0a.3 (cached tokens counted as zero rather than unmeasured). **Unmeasured is not
 * zero.** PLAN-TO-90 0b.1 proposed ~£0.40 a run on this pass; spent against a silent guard it would
 * have measured the guard and reported it as the model.
 *
 * TWO THINGS CHANGED, and these tests hold both:
 *   1. `repetitionRewriteRegressionReason` returns the FAILING CHECK instead of a bare boolean, so a
 *      rollback can name itself. The boolean is kept and unchanged — it is exported and used
 *      elsewhere, and widening a shared predicate's return type is how one predicate acquires two
 *      meanings.
 *   2. `runFullStoryRepetitionPolish` gained the `polishClient`/`polishModel` seam its sibling
 *      `polishPassingChapter` already had. Without it the pass used the run's Azure client
 *      unconditionally, so `AGENT9_POLISH_PROVIDER=anthropic` — set, documented, and live for the
 *      per-chapter pass — silently did nothing here, and "full-story polish on Opus 5" was not
 *      expressible at all.
 */

import { describe, expect, it } from 'vitest';

import {
  hasRepetitionRewriteRegression,
  repetitionRewriteRegressionReason,
} from '../agent9-prose/post-pass-polish.js';

const chapter = (paragraphs: string[]) => ({ title: 'Ch', paragraphs }) as never;

/** ~120 words, so the >= 80-word length rule is live and a trimmed rewrite can trip it. */
const LONG = Array.from({ length: 12 }, (_, i) => `Sentence ${i} carried the same weight as the last one did.`).join(' ');

describe('a rollback names the check that rejected it', () => {
  it('reports a dropped locked value, with the value in the message', () => {
    const reason = repetitionRewriteRegressionReason({
      original: chapter([`${LONG} The clock read a quarter past seven.`]),
      rewritten: chapter([`${LONG} The clock read some time in the evening.`]),
      lockedValues: ['a quarter past seven'],
      castNames: [],
    });
    expect(reason).toContain('locked value');
    expect(reason).toContain('a quarter past seven');
  });

  it('reports a dropped cast name', () => {
    const reason = repetitionRewriteRegressionReason({
      original: chapter([`${LONG} Beatrice Quill said nothing at all.`]),
      rewritten: chapter([`${LONG} The receptionist said nothing at all.`]),
      lockedValues: [],
      castNames: ['Beatrice Quill'],
    });
    expect(reason).toContain('cast name');
    expect(reason).toContain('Beatrice Quill');
  });

  it('reports a dropped number token with the counts that failed', () => {
    const reason = repetitionRewriteRegressionReason({
      original: chapter([`${LONG} The 7:15 chime rang out.`]),
      rewritten: chapter([`${LONG} The quarter-past chime rang out.`]),
      lockedValues: [],
      castNames: [],
    });
    expect(reason).toMatch(/number\/time token/);
  });

  it('reports a length collapse with both word counts', () => {
    const reason = repetitionRewriteRegressionReason({
      original: chapter([LONG]),
      rewritten: chapter(['Much shorter.']),
      lockedValues: [],
      castNames: [],
    });
    expect(reason).toContain('length');
    // The numbers matter: "too short" is not actionable, "31/144 words" is.
    expect(reason).toMatch(/\d+\/\d+ words/);
  });

  it('returns null — not a string — when the rewrite is acceptable', () => {
    const reason = repetitionRewriteRegressionReason({
      original: chapter([`${LONG} Beatrice Quill checked the 7:15 chime.`]),
      rewritten: chapter([`${LONG} Beatrice Quill listened for the 7:15 chime.`]),
      lockedValues: [],
      castNames: ['Beatrice Quill'],
    });
    expect(reason).toBeNull();
  });
});

describe('the reason function agrees with the boolean it replaces at the call site', () => {
  // If these two ever disagree, the pass would roll back silently again (reason null, boolean true)
  // or keep a regression it should have refused (reason set, boolean false).
  const cases = [
    { name: 'dropped locked value', o: `${LONG} at a quarter to seven`, r: `${LONG} in the evening`, locked: ['a quarter to seven'], cast: [] },
    { name: 'dropped cast name', o: `${LONG} Hugo Vane waited`, r: `${LONG} the man waited`, locked: [], cast: ['Hugo Vane'] },
    { name: 'length collapse', o: LONG, r: 'Short.', locked: [], cast: [] },
    { name: 'clean rewrite', o: `${LONG} Hugo Vane waited`, r: `${LONG} Hugo Vane lingered`, locked: [], cast: ['Hugo Vane'] },
    { name: 'dropped digit', o: `${LONG} the 7:15 chime`, r: `${LONG} the chime`, locked: [], cast: [] },
  ];

  for (const c of cases) {
    it(`agrees on: ${c.name}`, () => {
      const args = {
        original: chapter([c.o]),
        rewritten: chapter([c.r]),
        lockedValues: c.locked,
        castNames: c.cast,
      };
      expect(repetitionRewriteRegressionReason(args) !== null).toBe(hasRepetitionRewriteRegression(args));
    });
  }
});
