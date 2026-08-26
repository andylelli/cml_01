/**
 * A_72 A2a — the opening-freshness block, and the two subtractions that make it safe.
 *
 * `opening_hook` has never scored 9 in 35 external reads; all seventeen of its 8s are an inventory of
 * props followed by a compliment. Measured across 184 archived openings: `scent` 76%, `faint` 72%,
 * `pressed` 63%, `sprawled` 54%.
 *
 * The tests that matter are the subtractions. Without them this block would tell the writer to avoid
 * words the grounding VALIDATOR requires, and the retry-driving instruction would win.
 */

import { describe, expect, it } from 'vitest';
import { OPENING_SENSORY_MARKERS, OPENING_ATMOSPHERE_MARKERS } from '@cml/story-validation';

import { buildOpeningFreshnessBlock, overusedOpeningWordsFor } from '../agent9-prose/opening-freshness.js';
import { OVERUSED_OPENING_WORDS, OPENING_CORPUS_MANUSCRIPTS } from '../constants/opening-corpus.js';

const base = { requiredGroundingWords: [] as string[], storyOwnWords: [] as string[] };

describe('the measured corpus', () => {
  it('carries the house-style words the reader keeps describing', () => {
    for (const w of ['scent', 'faint', 'pressed', 'sprawled', 'hush', 'gloved']) {
      expect(OVERUSED_OPENING_WORDS, w).toContain(w);
    }
  });

  it('excludes proper nouns — the cast is pinned by the harness, not chosen by the writer', () => {
    for (const w of ['eleanor', 'voss', 'finch', 'beatrice']) {
      expect(OVERUSED_OPENING_WORDS, w).not.toContain(w);
    }
  });
});

describe('subtraction 1 — never fight the grounding validator', () => {
  it('drops every word the validator REQUIRES in the first two paragraphs', () => {
    const words = overusedOpeningWordsFor({
      ...base,
      requiredGroundingWords: [...OPENING_SENSORY_MARKERS, ...OPENING_ATMOSPHERE_MARKERS],
      limit: 50,
    }).map((w) => w.word);
    // All of these are overused AND validator-required. Asking for both is a contradiction.
    for (const w of ['scent', 'damp', 'chill', 'cold', 'rain', 'silence', 'morning', 'pale', 'light']) {
      expect(words, w).not.toContain(w);
    }
    // What survives is the house VOICE, which is the layer the reader is describing.
    expect(words).toContain('faint');
    expect(words).toContain('pressed');
    expect(words).toContain('sprawled');
  });
});

describe('subtraction 2 — the story\'s own furniture is not a cliché', () => {
  it('drops words that appear in this run\'s location, title or device', () => {
    const words = overusedOpeningWordsFor({
      ...base,
      storyOwnWords: ['Seabreeze Hotel lounge', 'The Clock Room', 'grandfather clock tampering'],
      limit: 50,
    }).map((w) => w.word);
    for (const w of ['hotel', 'clock', 'room']) expect(words, w).not.toContain(w);
  });
});

describe('the block itself', () => {
  const block = buildOpeningFreshnessBlock({
    requiredGroundingWords: [...OPENING_SENSORY_MARKERS, ...OPENING_ATMOSPHERE_MARKERS],
    storyOwnWords: ['Seabreeze Hotel', 'grandfather clock'],
  });

  it('cites the measurement rather than asserting a preference', () => {
    expect(block).toMatch(/measured, not stylistic preference/);
    // Asserted against the CONSTANT, never a hard-coded count: the corpus grows every time
    // `build-opening-corpus.mjs` is re-run on a machine that has the archive, and a literal here
    // turns that routine regeneration into a test failure (it did, at 184 -> 189).
    expect(block).toContain(`${OPENING_CORPUS_MANUSCRIPTS} previously generated openings`);
    expect(block).toMatch(/faint \(\d+%\)/);
  });

  it('forbids the synonym reach, which is how X95 produced "certified wave crest hour"', () => {
    expect(block).toMatch(/Do NOT reach for a synonym/);
    expect(block).toMatch(/only THIS case could produce/);
  });

  it('says explicitly that the grounding requirement still stands', () => {
    expect(block).toMatch(/required sensory and atmosphere grounding still applies/);
  });

  it('returns an EMPTY string when the subtractions leave nothing to say', () => {
    // A caller concatenates this unconditionally; it must never emit a block with an empty list.
    expect(buildOpeningFreshnessBlock({ ...base, requiredGroundingWords: [...OVERUSED_OPENING_WORDS] })).toBe('');
  });
});
