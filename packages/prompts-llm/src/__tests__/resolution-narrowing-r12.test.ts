/**
 * REVIEW_12 §3.2 / §3.3 — two wordlists narrowed on corpus evidence, and both failures now name
 * the token that fired.
 *
 * MEASURED on run `mystery-1787090659145`: chapter 1 was rejected TWICE by `RESOLUTION_RE` for
 * *"The mechanism inside the clock, partially exposed where the panel hung ajar"* — a chapter with no
 * confession, no arrest and no solution. Bare `expos(ed|es)` occurs 322 times across 171 corpus
 * manuscripts and the sampled uses are clock workings and exposed mechanisms.
 */

import { describe, expect, it } from 'vitest';
import { RESOLUTION_RE } from '../agent9-prose/clue-validation.js';

/** `RESOLUTION_RE` is non-global, but re-test defensively: a stateful matcher is how X53 went wrong. */
const fires = (s: string): boolean => new RegExp(RESOLUTION_RE.source, RESOLUTION_RE.flags).test(s);

describe('RESOLUTION_RE — still catches a real resolution', () => {
  const positives = [
    '"It was me," he confessed, voice barely above a whisper.',
    'Captain Hale, you are under arrest for the murder.',
    'Hugo Vane was found guilty of the murder.',
    'You killed her, and the clock proved it.',
    'The murderer is Hugo Vane, and the clock says so.',
    'The scoring exposed him as the killer.',
    'Beatrice surrendered herself to the constable without a word.',
    'He was revealed as the culprit before the hour struck.',
    "Hugo Vane's confession, signed and witnessed, sat on the desk.",
    'She was taken into custody at first light.',
    'It was you, and everyone in the room knew it.',
  ];
  it.each(positives)('fires on: %s', (s) => {
    expect(fires(s)).toBe(true);
  });
});

describe('RESOLUTION_RE — no longer fires on ordinary prose', () => {
  const negatives: Array<[string, string]> = [
    ['the shipped ch1 sentence that cost two retries', 'The mechanism inside the clock, partially exposed where the panel hung ajar, revealed a small lever.'],
    ['clock workings', "his eyes fixed on the clock's exposed workings"],
    ['a metaphor', 'The fragile order of the hotel was merely exposed, waiting for the next fracture.'],
    ['the Golden-Age discourse marker', "Though I confess, I've seen clocks and men both falter under pressure."],
    ['dusk, not a suspect', 'dusk surrendered to the first chill of evening'],
    ['handing something over', 'Beatrice hesitated, then surrendered the letter with a reluctant sigh.'],
    ['an adjective, not a verdict', 'the door whose brass bore the trace of a guilty hand'],
    ['a metaphor about masks', 'every mask, a lie waiting to be unmasked'],
  ];
  it.each(negatives)('does not fire on %s', (_label, s) => {
    expect(fires(s)).toBe(false);
  });
});

/**
 * The narrowing had to be checked at BOTH call sites: this regex is the negative test for chapter 1
 * and the POSITIVE test for the reveal chapter. Over the last two chapters of all 171 corpus
 * manuscripts it now matches 169 where the old one matched 165 — `confession` (the noun) was never
 * covered by `confess(?:ed|es)?`.
 */
describe('RESOLUTION_RE — the reveal-side consumer is not weakened', () => {
  it('matches the noun "confession", which the old pattern missed', () => {
    expect(fires('The confession lay on the table, signed.')).toBe(true);
  });
});
