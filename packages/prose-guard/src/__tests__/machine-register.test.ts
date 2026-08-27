/**
 * A_75 §6.2 (P2) — the register score.
 *
 * These tests pin the two things that are easy to break silently: the ONE sentence the module exists
 * for, and the tokenizer defects that were found by running the probe rather than by reading the code
 * (unstripped dialogue and abbreviation splits both inflated the rate in the first three versions).
 */

import { describe, expect, it } from 'vitest';

import {
  scoreSentenceRegister,
  scoreMachineRegister,
  machineRegisterRate,
  REGISTER_TELEMETRY_THRESHOLD,
} from '../machine-register.js';

describe('the sentence this module exists for', () => {
  /**
   * The ch10 sentence an external reader marked as "major validation leakage" in
   * `story_20260825-1838`. It matches NO registered template — we never wrote it. If this stops
   * scoring 4 the instrument has lost the only thing it adds over the frozen phrase family.
   */
  it('scores the register-only case on all four features', () => {
    const r = scoreSentenceRegister('The truth was out, but innocence, once lost, would not return.');
    expect(r.features).toEqual({
      abstractSubject: true,
      stativeVerb: true,
      noConcreteNoun: true,
      noSensoryWord: true,
    });
    expect(r.score).toBe(4);
  });

  it('scores the same register under a different wording — it is grammar, not a phrase list', () => {
    for (const s of [
      'The matter was settled, and the reasoning behind it would not be questioned again.',
      'The account that had stood for so long was, in the end, no account at all.',
    ]) {
      expect(scoreSentenceRegister(s).score).toBe(4);
    }
  });
});

describe('and does not score prose that is doing something', () => {
  const prose = [
    'Eleanor set the tide table down and said nothing for a moment.',
    'The lamp guttered, and the shadow on the wall leaned with it.',
    'She weighed the pipe in her hand, then set it back against the rock.',
    'Rain came across the terrace in one long sheet and stopped as suddenly.',
  ];
  it.each(prose)('stays below the telemetry threshold: %s', (s) => {
    expect(scoreSentenceRegister(s).score).toBeLessThan(REGISTER_TELEMETRY_THRESHOLD);
  });
});

describe('the leading-clause reading', () => {
  /**
   * THE BUG, and the reason the subject is read from both the raw sentence and the stripped one: an
   * earlier version stripped everything before the first comma, which ate the MAIN clause of the
   * register-only case above and scored it 2.
   */
  it('finds the abstract subject behind a subordinate clause', () => {
    expect(scoreSentenceRegister('Weighed against the rest, that detail left the standing account weaker.')
      .features.abstractSubject).toBe(true);
  });

  it('does not destroy a subject that was already in front', () => {
    expect(scoreSentenceRegister('The truth was out, but innocence, once lost, would not return.')
      .features.abstractSubject).toBe(true);
  });
});

describe('the tokenizer defects the probe found', () => {
  it('does not split a sentence at an abbreviated title', () => {
    // "The truth, at last, was laid bare: Dr." was scored as a whole sentence in a book a reader gave
    // prose 8, because the negative lookbehind omitted the period it sits behind.
    const hits = scoreMachineRegister('The truth, at last, was laid bare: Dr. Alan Reyes had lied about the hour.', 3);
    expect(hits.map((h) => h.sentence)).not.toContain('The truth, at last, was laid bare: Dr.');
  });

  it('treats a first-person sentence as unstripped dialogue, not narration', () => {
    // These manuscripts contain mismatched quote marks (open `"`, close `'`), so paired-delimiter
    // stripping leaks speech into the narration sample. Narration here is third-person past.
    const rate = machineRegisterRate('"The truth is, I have little faith in appearances tonight. \' She turned away.', 3);
    expect(rate.hits).toBe(0);
  });

  it('exempts dialogue outright — an abstract line SPOKEN is speech', () => {
    expect(scoreMachineRegister('"The matter was settled, and the reasoning would not be questioned." She sat down by the fire.', 3))
      .toHaveLength(0);
  });
});

describe('the rate, which is how this must be reported', () => {
  it('reports hits against sentences, not a bare count', () => {
    const r = machineRegisterRate(
      'The truth was out, but innocence, once lost, would not return. '
      + 'She set the lamp on the table and turned the wick down. '
      + 'The rain had not stopped since morning and the path was thick with mud.',
      4,
    );
    expect(r.sentences).toBe(3);
    expect(r.hits).toBe(1);
    expect(r.rate).toBeCloseTo(1 / 3, 5);
  });

  it('is zero, not NaN, on empty input — a rate that cannot be computed must not read as a defect', () => {
    expect(machineRegisterRate('', 3)).toEqual({ hits: 0, sentences: 0, rate: 0 });
  });
});

describe('no control character reaches this module', () => {
  /**
   * The invisible-backspace class already cost this repo one silently-dead regex, and building THIS
   * module cost it a literal NUL smuggled into a sentinel substitution — a character that reads as a
   * space in every terminal and turns a working replace into a no-op.
   *
   * Assert on the SOURCE BYTES. Reading the file is the only check that can see what is not there.
   */
  it('the module source contains no control characters', async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const path = fileURLToPath(new URL('../machine-register.ts', import.meta.url));
    const source = readFileSync(path, 'utf8');
    const offenders = [...source]
      .map((ch, i) => [ch.charCodeAt(0), i] as const)
      .filter(([code]) => code < 9 || (code > 10 && code < 32) || code === 127);
    expect(offenders.map(([code, i]) => `U+${code.toString(16)} at ${i}`)).toEqual([]);
  });
});
