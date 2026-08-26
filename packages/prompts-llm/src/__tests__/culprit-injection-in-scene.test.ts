/**
 * A_74 §9.4 / X4 — the culprit floor, written so it stops breaking the rule the model is failed for.
 *
 * MEASURED across the 18 archived runs carrying X4 telemetry: 5 injections, 10 violations. EVERY
 * injection breaks `verdict_closer.was_responsible` AND `verdict_closer.beyond` — a 100% violation
 * rate. Three external readers have quoted the result back as "generator residue".
 *
 * These tests assert the two halves of the contract against the REAL predicate and the REAL rule
 * array. Eyeballing the sentence is exactly how the old one shipped.
 */

import { describe, expect, it } from 'vitest';

import {
  buildCulpritEvidenceSentence,
  buildCulpritEvidenceSentenceInScene,
  isInjectedSentence,
} from '../agent9-prose/injection-templates.js';
import { RESOLUTION_VERDICT_CLOSER_RULES } from '../agent9-prose/lint.js';
import { culpritEvidenceLinkInText } from '../agent9-prose/regen-integration.js';

const CULPRIT = 'Hugo Vane';
const violated = (text: string) => RESOLUTION_VERDICT_CLOSER_RULES.filter((r) => r.pattern.test(text)).map((r) => r.id);

describe('the old form is the defect, and this pins it', () => {
  it('breaks exactly the two rules X4 counted', () => {
    expect(violated(buildCulpritEvidenceSentence(CULPRIT)).sort())
      .toEqual(['verdict_closer.beyond', 'verdict_closer.was_responsible']);
  });
});

describe('the in-scene form', () => {
  const sentence = buildCulpritEvidenceSentenceInScene(CULPRIT);

  it('breaks NO verdict-closer rule', () => {
    expect(violated(sentence)).toEqual([]);
  });

  it('still satisfies the obligation it exists for', () => {
    // name + culprit term + evidence term, checked by the shared predicate the gate itself uses.
    expect(culpritEvidenceLinkInText(CULPRIT, sentence)).toBe(true);
  });

  it('works on a surname-only culprit', () => {
    const s = buildCulpritEvidenceSentenceInScene('Quill');
    expect(culpritEvidenceLinkInText('Quill', s)).toBe(true);
    expect(violated(s)).toEqual([]);
  });

  it('is STILL recognisable as machine text — or every injector-retirement metric goes blind', () => {
    // injection-templates.ts property #2: a floor that changes its sentence must register the shape.
    expect(isInjectedSentence(sentence)).toBe(true);
  });

  it('closes in scene: dialogue, an action, and a sensation', () => {
    expect(sentence).toMatch(/^"/);            // opens on speech
    expect(sentence).toMatch(/said nothing/);  // an action
    expect(sentence).not.toMatch(/\bwas responsible\b/);
  });
});
