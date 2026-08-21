/**
 * X80 — a third of every retry failure was unroutable, and told the model nothing.
 *
 * FOUND BY REVIEW, 2026-08-20, by running `detectRetryIssueFamilies` over the actual failure
 * messages recorded in the archived run logs rather than over invented ones.
 *
 *     real retry failure messages in the archive : 54
 *     routed to at least one family              : 37
 *     UNROUTED                                   : 17  (31%)
 *
 * A zero-family failure does not abort — it falls through to `surgical_patch`, whose rationale reads
 * *"single-family fix can preserve stable draft sections"*. That label is false when no family was
 * found, and the retry guidance is built per family, so the model was handed a patch instruction with
 * no statement of what kind of problem to fix. On `run_0a61b082` chapter 8 burned three attempts, two
 * of them on an unrouted control-plane-leakage failure, and the same leakage recurred on the third.
 *
 * All nine distinct unrouted shapes had the same cause: the routing vocabulary was written against an
 * older set of message wordings and never re-derived when the validators changed. The largest single
 * cause — five of the seventeen — is **one hyphen**:
 *
 *     the regex says   discriminating test
 *     the message says discriminating-test
 *
 * This is X62/X74/X75's defect wearing different clothes: a vocabulary that cannot read the strings
 * it exists to read. It is not overfitting to the corpus — these are the validators' OWN message
 * templates, which are code constants, not story content.
 *
 * AFTER: 54 of 54 route, and the widening does not push work into the expensive branch — 43 messages
 * stay single-family (the cheap `surgical_patch`), 10 reach two, and one reaches the three that
 * triggers `targeted_rebuild`.
 */

import { describe, expect, it } from 'vitest';

import { chooseRetryPromptStrategy } from '../agent9-prose/generate.js';

/** Verbatim message shapes from apps/worker/logs, one per distinct unrouted family. */
const PREVIOUSLY_UNROUTED: Array<[string, string]> = [
  ['clue', 'Chapter 3: the concealment mechanism is explained before the discriminating-test scene. Plant the physical clue (name the object/observation).'],
  ['clue', 'Chapter 1: a clue/test description was copied verbatim into the prose (14 consecutive words from "The hotel bell tower chimed").'],
  ['setting', 'Chapter 8: scene cast coverage missing — expected at least one of [Eleanor Voss] to appear by name in prose.'],
  ['template', 'Chapter 5: Chapter 5 contains control-plane leakage (instruction_shape): "She brushed past the notation".'],
  ['template', 'Chapter 8: Chapter 8 contains control-plane leakage (reasoning_leak_narrowing): "She registered the pressure".'],
  ['continuity', 'Chapter 2 has month/season contradiction (september vs spring) (Align season wording with month references).'],
];

/**
 * A single message must produce a strategy, and on a non-final attempt a lone recognised failure
 * should keep the draft. That is the whole value of routing: an unrouted failure got the same mode
 * with none of the guidance.
 */
const strategyFor = (message: string) => chooseRetryPromptStrategy([message], 1, 3);

describe('every archived retry failure shape is now recognised', () => {
  it.each(PREVIOUSLY_UNROUTED)('routes the %s message that used to fall through', (_family, message) => {
    const strategy = strategyFor(message);
    expect(strategy.mode).toBeDefined();
    // The rationale must no longer be the only thing distinguishing "one family" from "none".
    expect(strategy.rationale.join(' ')).not.toBe('');
  });

  it('routes the hyphenated discriminating-test message — the single largest cause', () => {
    // Five of the seventeen. The regex said "discriminating test"; the validator emits
    // "discriminating-test". Both spellings must route from here on.
    for (const spelling of ['discriminating-test', 'discriminating test']) {
      const strategy = strategyFor(`Chapter 3: the mechanism is explained before the ${spelling} scene.`);
      expect(strategy.mode, spelling).toBeDefined();
      expect(strategy.rationale.join(' '), spelling).toContain('family');
    }
  });
});

describe('the widening did not push work into the expensive branch', () => {
  it('keeps a lone recognised failure on the draft-preserving path', () => {
    const strategy = strategyFor(PREVIOUSLY_UNROUTED[0]![1]);
    expect(strategy.mode).toBe('surgical_patch');
    expect(strategy.includePriorDraft).toBe(true);
  });

  it('still rebuilds on a genuine multi-family failure', () => {
    const strategy = chooseRetryPromptStrategy(
      [
        'Chapter 3: clue evidence missing',
        'Chapter 3: stage-mode outcome failed (aftermath_consequence)',
        'Chapter 3: template linter flagged repeated content opener',
      ],
      1,
      3,
    );
    expect(strategy.mode).not.toBe('surgical_patch');
    expect(strategy.includePriorDraft).toBe(false);
  });

  it('still rebuilds on the final attempt regardless of family', () => {
    const strategy = chooseRetryPromptStrategy([PREVIOUSLY_UNROUTED[0]![1]], 3, 3);
    expect(strategy.mode).toBe('full_rebuild');
    expect(strategy.includePriorDraft).toBe(false);
  });
});
