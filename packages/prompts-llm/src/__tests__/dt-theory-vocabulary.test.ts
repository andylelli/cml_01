/**
 * A_76 §17 — the DT gate demanded a word the model never writes, so a floor pasted one in.
 *
 * The reader marked `prose` 7/10 on story_20260830-1850: "still has scaffold lines". The flagged
 * sentences are the discriminating-test floor's, and the floor fires because this gate fails.
 *
 * MEASURED: strip our injected sentences from the 28 August chapters that carry them and re-test —
 * 27 of 28 fail, always on the THEORY marker, never on proof. Widening to the words a novelist
 * actually writes takes model prose from 1/28 (4%) to 17/28 (61%).
 */

import { describe, expect, it } from 'vitest';

import {
  resolveDiscriminatingTestValidityState,
  isDtTheoryVocabularyWidened,
} from '../agent9-prose/clue-validation.js';

const chapter = (text: string) => ({ paragraphs: [text] }) as never;

/** A real proof word, so every case below turns purely on the theory marker. */
const PROOF = 'The result was plain to everyone in the room.';

const withFlag = <T>(value: string | undefined, fn: () => T): T => {
  const prev = process.env.AGENT9_DT_THEORY_VOCABULARY;
  if (value === undefined) delete process.env.AGENT9_DT_THEORY_VOCABULARY;
  else process.env.AGENT9_DT_THEORY_VOCABULARY = value;
  try { return fn(); } finally {
    if (prev === undefined) delete process.env.AGENT9_DT_THEORY_VOCABULARY;
    else process.env.AGENT9_DT_THEORY_VOCABULARY = prev;
  }
};

describe('with the flag OFF the gate is byte-identical to today', () => {
  it('still accepts the word it always accepted', () => {
    withFlag(undefined, () => {
      expect(resolveDiscriminatingTestValidityState(chapter(`Her theory held. ${PROOF}`)).isValid).toBe(true);
    });
  });

  it('still rejects natural prose — which is why the floor pastes machine text', () => {
    withFlag(undefined, () => {
      expect(resolveDiscriminatingTestValidityState(chapter(`Her explanation held. ${PROOF}`)).isValid).toBe(false);
    });
  });
});

describe('with the flag ON, prose a novelist would write satisfies it', () => {
  const accepted = ['explanation', 'account', 'version', 'reading', 'possibility', 'premise', 'scenario', 'alternative'];

  for (const word of accepted) {
    it(`accepts "${word}"`, () => {
      withFlag('true', () => {
        expect(resolveDiscriminatingTestValidityState(chapter(`Only one ${word} survived it. ${PROOF}`)).isValid).toBe(true);
      });
    });
  }

  it('still accepts the original vocabulary', () => {
    withFlag('true', () => {
      for (const w of ['theory', 'theories', 'hypothesis', 'hypotheses']) {
        expect(resolveDiscriminatingTestValidityState(chapter(`The ${w} failed. ${PROOF}`)).isValid).toBe(true);
      }
    });
  });
});

describe('the conjunction still holds — widening one half does not disable the gate', () => {
  it('a theory word alone is not enough', () => {
    withFlag('true', () => {
      // No proof marker: nothing observable happened.
      expect(resolveDiscriminatingTestValidityState(
        chapter('She turned the explanation over in her mind and said nothing at all.'),
      ).isValid).toBe(false);
    });
  });

  it('a proof word alone is not enough', () => {
    withFlag('true', () => {
      expect(resolveDiscriminatingTestValidityState(chapter(PROOF)).isValid).toBe(false);
    });
  });
});

describe('the flag is read at call time', () => {
  it('is off by default and settable from the environment', () => {
    expect(isDtTheoryVocabularyWidened({} as NodeJS.ProcessEnv)).toBe(false);
    expect(isDtTheoryVocabularyWidened({ AGENT9_DT_THEORY_VOCABULARY: 'true' } as never)).toBe(true);
  });
});
