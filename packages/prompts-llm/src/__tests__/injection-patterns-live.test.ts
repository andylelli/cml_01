/**
 * A_76 — the two most frequent live injections were invisible to the detector.
 *
 * A corpus sweep of the 31 August manuscripts (`scripts/cross-book-templates.mjs`) ranked recurring
 * sentence SHAPES by how many different books carry them. The top two both come from
 * `deterministic-repair.ts` and neither matched `isInjectedSentence`:
 *
 *   39% of books  "Run again in front of them all, the test came out the same way twice; ..."
 *   35% of books  "That left [Name] as the only person whose story still needed the discredited ..."
 *
 * This file's property #2 says a floor which changes an injected sentence must contribute its new
 * shape. These are the regression tests for that rule, pinned against the REAL strings the floor
 * emits rather than paraphrases — a hand-written approximation would pass while the shipped sentence
 * still slipped through, which is how they went unnoticed.
 */

import { describe, expect, it } from 'vitest';

import { isInjectedSentence } from '../agent9-prose/injection-templates.js';

describe('the live deterministic-repair injections are recognised', () => {
  it('catches the discriminating-test paste, both ternary branches', () => {
    expect(isInjectedSentence(
      'Run again in front of them all, the test came out the same way twice; its result ruled out one theory and left the other standing.',
    )).toBe(true);
    expect(isInjectedSentence(
      'Run again in front of them all, the test came out the same way, and its result ruled out the staging.',
    )).toBe(true);
  });

  it('catches the culprit-isolation paste for any name', () => {
    expect(isInjectedSentence(
      'That left Hugo Vane as the only person whose story still needed the discredited theory to be true.',
    )).toBe(true);
    expect(isInjectedSentence(
      'That left Captain Ivor Hale as the only person whose story still needed the discredited theory to be true.',
    )).toBe(true);
  });

  it('still catches the one that was already registered', () => {
    expect(isInjectedSentence('Hugo Vane was responsible; the evidence allowed no other reading.')).toBe(true);
  });

  it('does not fire on authored prose that merely discusses a test or a theory', () => {
    // The patterns must not be so loose that ordinary detective narration counts as machine text —
    // that would make the recap strip delete the author's own work.
    expect(isInjectedSentence('She ran the test again, and it told her nothing she had not already guessed.')).toBe(false);
    expect(isInjectedSentence('His theory was discredited the moment the clock was opened.')).toBe(false);
    expect(isInjectedSentence('That left only the question of who had wound it.')).toBe(false);
  });
});
