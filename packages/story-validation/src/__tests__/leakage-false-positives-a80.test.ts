/**
 * A_80 F1/F2 — the leakage rules must not fire on English.
 *
 * `instruction_shape` matched the bare phrase "required to". In run mystery-1788202899854 it flagged
 * the one sentence in chapter 8 that stated the case's arithmetic correctly, forced a regeneration,
 * and the regenerated chapter shipped with the arithmetic broken. The external reader scored the clue
 * logic 4/10 for exactly that.
 *
 * These tests pin both halves of the fix, because narrowing a detector until it stops complaining is
 * how you get a detector that cannot detect: every known-positive below MUST still fire.
 */

import { describe, expect, it } from 'vitest';

import {
  detectControlPlaneLeakage,
  CONTROL_PLANE_LEAKAGE_PATTERNS,
} from '../control-plane-leakage.js';

const codes = (text: string) => detectControlPlaneLeakage(text).map((f) => f.code);

describe('F1 — ordinary period prose is not leakage', () => {
  it('does NOT fire on the sentence that broke run mystery-1788202899854', () => {
    // The exact clause, from the run's own warning payload.
    expect(
      codes('I invite each of you to attempt to wind the clock backward by five minutes, as was ' +
            'required to set the hands from half past ten to twenty-five minutes past ten.'),
    ).toEqual([]);
  });

  it.each([
    ['obligation as an ordinary noun', 'He was under no obligation to answer her, and he did not.'],
    ['required to, plain', 'She felt required to explain herself, though nobody had asked.'],
    ['must include, plain', 'I must include you in my will, he said with a thin smile.'],
    ['ensure that, plain', 'Ensure that no harm comes to her, the Colonel said.'],
    ['contract as a verb', 'The walls seemed to contract about him in the fog.'],
  ])('stays silent on %s', (_label, sentence) => {
    expect(codes(sentence)).toEqual([]);
  });
});

describe('F1 — real leakage is still caught (the half that matters)', () => {
  it.each([
    ['instruction_shape', 'You must include the following three clues in this chapter.'],
    ['instruction_shape', 'Ensure that the chapter contains a discriminating test.'],
    ['obligation_term', 'The obligation ref for this scene is unmet.'],
    ['obligation_term', 'Chapter obligations are outstanding.'],
    ['validator_term', 'The validator rejected the previous attempt.'],
  ])('still fires %s', (code, sentence) => {
    expect(codes(sentence)).toContain(code);
  });
});

describe('F2 — the confidence tier is a real contract', () => {
  it('every rule declares one of the three tiers', () => {
    for (const p of CONTROL_PLANE_LEAKAGE_PATTERNS) {
      expect(['hard', 'contextual', 'watch']).toContain(p.confidence);
    }
  });

  it('the watch tier still DETECTS — it is telemetry, not deletion', () => {
    // dt_validation_proved_theory is parked at `watch` on purpose. F2 stops it forcing a retry;
    // it must not stop it being seen, or the log-first/promote-after discipline has nothing to read.
    const found = detectControlPlaneLeakage('The test proved one theory and ruled out the other.');
    expect(found.map((f) => f.code)).toContain('dt_validation_proved_theory');
    expect(found.find((f) => f.code === 'dt_validation_proved_theory')?.confidence).toBe('watch');
  });
});
