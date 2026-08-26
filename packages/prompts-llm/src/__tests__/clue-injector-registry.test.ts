/**
 * The missing-clue floor was invisible to the registry that exists to find it.
 *
 * MEASURED 2026-08-26: `isInjectedSentence` returned FALSE for every sentence
 * `buildDeterministicClueParagraphs` has ever written. That is injection-templates.ts's own property
 * #2 violated for the LARGEST injector in the pipeline, with two consequences its header predicts:
 * geometry reports `met` where it should report `met_by_injection`, and the injector-retirement
 * metric — "the distinction that gives that work an exit condition it can measure" — has been blind
 * to the injector most worth retiring.
 *
 * Three external readers have quoted this output back as "generator residue". It has been visible to
 * humans and invisible to us.
 *
 * These fixtures are the REAL shipped sentences from story_20260823-2038 and story_20260826-1753,
 * not invented ones — the first version of the patterns matched nothing because it carried a literal
 * BACKSPACE where `\b` was intended, which no amount of reading the file would have revealed.
 */

import { describe, expect, it } from 'vitest';

import { isInjectedSentence } from '../agent9-prose/injection-templates.js';

describe('the clue injector is recognised as machine text', () => {
  const shipped = [
    'Eleanor Voss laid the facts out plainly where the others could see them.',
    'Eleanor Voss pressed on to the next concrete detail.',
    'The record now held: Victim last seen alive minutes past.',
    'Those details shifted the reasoning.',
    'That detail shifted the reasoning.',
    'Weighed against the rest, Victim last seen alive minutes past bent the trail toward Temporal conflict hale alibi.',
    'Weighed against the rest, the scrape on the ledge left the standing account weaker.',
  ];

  it.each(shipped)('detects: %s', (sentence) => {
    expect(isInjectedSentence(sentence)).toBe(true);
  });
});

describe('and does not mistake authored prose for it', () => {
  /** Each of these shares vocabulary with a template but is ordinary narration. */
  const prose = [
    'Eleanor set the tide table down and said nothing for a moment.',
    'The record of the harbourmaster lay open on the desk.',
    'She weighed the pipe in her hand, then set it back against the rock.',
    'The details of the evening had shifted in her mind all week.',
    'He held the record up to the lamp.',
    'The facts were plain enough once she laid the chart flat.',
  ];

  it.each(prose)('passes: %s', (sentence) => {
    expect(isInjectedSentence(sentence)).toBe(false);
  });
});

describe('no pattern carries a control character', () => {
  it('every registered pattern is free of invisible characters', async () => {
    // The defect that motivated this test: /\x08The record now held:/ can never match, and reads as
    // /The record now held:/ in any terminal. Assert on the source, not on appearance.
    const { INJECTED_SENTENCE_PATTERNS } = await import('../agent9-prose/injection-templates.js');
    for (const re of INJECTED_SENTENCE_PATTERNS) {
      // eslint-disable-next-line no-control-regex
      expect(/[\x00-\x08\x0b\x0c\x0e-\x1f]/.test(re.source), re.source).toBe(false);
    }
  });
});
