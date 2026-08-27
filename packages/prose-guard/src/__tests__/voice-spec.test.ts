/**
 * A_75 §6.1 (P1) — the voice spec and its conformance metric.
 *
 * The metric is the whole argument for building this rather than arguing about it, so these tests
 * pin the two properties that make it load-bearing: that it can tell a book which KEPT a spec from a
 * book which did not, and that the divergence gate actually rejects a spec that sounds like the last
 * one. A validator that waves everything through would deliver "a distinct voice" that is the same
 * voice, and the conformance number would look excellent while measuring nothing.
 */

import { describe, expect, it } from 'vitest';

import {
  validateVoiceSpec,
  voiceConformance,
  bookVoiceConformance,
  measureVoice,
  VOICE_CONFORMANCE_DELIVERED,
  VOICE_MEAN_MIN_GAP,
} from '../voice-spec.js';
import type { VoiceSpec, VoiceSpecSummary } from '../voice-spec.js';

const spec = (mean: number, sd = 5): VoiceSpec => ({
  sentenceLength: { mean, sd },
  syntacticHabit: 'fragments at moments of shock',
  diction: 'plain-anglo',
  narrationDistance: 'cool-observer',
  signatureMove: 'the detective notices what is absent before what is present',
  avoid: [],
});

/** Prose generated to a target mean, so conformance is checked against a known answer. */
const proseAtLength = (wordsPerSentence: number, sentences: number): string =>
  Array.from({ length: sentences }, (_, i) =>
    `${Array.from({ length: wordsPerSentence }, (_, j) => `w${i}${j}`).join(' ')}.`).join(' ');

describe('conformance measures what it claims to', () => {
  it('scores 1.0 when the prose sits on the spec', () => {
    const r = voiceConformance(proseAtLength(12, 40), spec(12));
    expect(r.observedMean).toBeCloseTo(12, 5);
    expect(r.score).toBeCloseTo(1, 5);
    expect(r.drift).toBeCloseTo(0, 5);
  });

  it('falls to 0 at a full standard deviation away, and no further', () => {
    expect(voiceConformance(proseAtLength(17, 40), spec(12, 5)).score).toBeCloseTo(0, 5);
    // Clipped, not negative — a score that runs below zero has no reading.
    expect(voiceConformance(proseAtLength(30, 40), spec(12, 5)).score).toBe(0);
  });

  it('reports SIGNED drift, so a miss says which way the chapter went', () => {
    expect(voiceConformance(proseAtLength(18, 40), spec(12)).drift).toBeGreaterThan(0);
    expect(voiceConformance(proseAtLength(8, 40), spec(12)).drift).toBeLessThan(0);
  });

  it('separates a book that KEPT a spec from one that did not', () => {
    // This is the property the whole item rests on: 11-word prose and 19-word prose are
    // distinguishable by a script with no model in the loop.
    const kept = voiceConformance(proseAtLength(11, 60), spec(11, 5)).score;
    const notKept = voiceConformance(proseAtLength(19, 60), spec(11, 5)).score;
    expect(kept).toBeGreaterThanOrEqual(VOICE_CONFORMANCE_DELIVERED);
    expect(notKept).toBeLessThan(VOICE_CONFORMANCE_DELIVERED);
  });

  it('returns 0 rather than NaN on empty prose or a zero-sd spec', () => {
    expect(voiceConformance('', spec(12)).score).toBe(0);
    expect(voiceConformance(proseAtLength(12, 20), spec(12, 0)).score).toBe(0);
  });
});

describe('book-level conformance reports the shape of the failure, not just its size', () => {
  it('distinguishes half-kept from uniformly-mediocre at the same mean', () => {
    const target = spec(12, 5);
    // Five chapters exactly on spec, five a full sd away.
    const halfKept = bookVoiceConformance(
      [...Array(5).fill(proseAtLength(12, 30)), ...Array(5).fill(proseAtLength(17, 30))],
      target,
    );
    // Ten chapters all half a sd away.
    const uniformlyOff = bookVoiceConformance(Array(10).fill(proseAtLength(14.5 | 0, 30)), target);

    expect(halfKept.mean).toBeCloseTo(0.5, 1);
    expect(halfKept.chaptersDelivered).toBe(5);
    // Same mean, no chapter delivered — the number that tells them apart.
    expect(uniformlyOff.chaptersDelivered).toBe(0);
  });

  it('ignores empty chapters rather than scoring them 0 and dragging the mean down', () => {
    const r = bookVoiceConformance([proseAtLength(12, 30), '', proseAtLength(12, 30)], spec(12));
    expect(r.mean).toBeCloseTo(1, 5);
    expect(r.chaptersDelivered).toBe(2);
  });
});

describe('the divergence gate does work', () => {
  const recent: VoiceSpecSummary[] = [
    { story: 'story_A', mean: 15.1, diction: 'mixed-period', narrationDistance: 'cool-observer', signatureMove: 'x' },
    { story: 'story_B', mean: 16.4, diction: 'plain-anglo', narrationDistance: 'cool-observer', signatureMove: 'y' },
  ];

  it('REJECTS a spec that sounds like the last book — the uniformity it exists to break', () => {
    const v = validateVoiceSpec(spec(15.3), recent);
    expect(v.ok).toBe(false);
    expect(v.problems.join(' ')).toContain('story_A');
  });

  it('accepts one that clears the gap', () => {
    expect(validateVoiceSpec(spec(11.5), recent).ok).toBe(true);
    expect(validateVoiceSpec(spec(19.5), recent).ok).toBe(true);
  });

  it('is exactly at the boundary it documents', () => {
    // A ONE-entry corpus, because the gate measures the NEAREST book and the two-entry fixture above
    // has 16.4 sitting 0.7 from the boundary — which is the gate behaving correctly and the test
    // asking the wrong question. A gate whose constant and behaviour disagree is worse than no gate.
    const one: VoiceSpecSummary[] = [
      { story: 'only', mean: 15.0, diction: 'mixed-period', narrationDistance: 'cool-observer', signatureMove: 'x' },
    ];
    expect(validateVoiceSpec(spec(15.0 + VOICE_MEAN_MIN_GAP), one).ok).toBe(true);
    expect(validateVoiceSpec(spec(15.0 + VOICE_MEAN_MIN_GAP - 0.1), one).ok).toBe(false);
    // Both directions — a gate that only looks upward lets the corpus drift down instead.
    expect(validateVoiceSpec(spec(15.0 - VOICE_MEAN_MIN_GAP), one).ok).toBe(true);
    expect(validateVoiceSpec(spec(15.0 - VOICE_MEAN_MIN_GAP + 0.1), one).ok).toBe(false);
  });

  it('measures the NEAREST book, not the first — a candidate must clear every one of them', () => {
    // 17.1 clears story_A (15.1) by 2.0 and fails against story_B (16.4) by 0.7.
    const v = validateVoiceSpec(spec(17.1), recent);
    expect(v.ok).toBe(false);
    expect(v.problems.join(' ')).toContain('story_B');
  });

  it('rejects a metronome — a spec with no spread is not a voice', () => {
    const v = validateVoiceSpec({ ...spec(11.5), sentenceLength: { mean: 11.5, sd: 0 } }, recent);
    expect(v.ok).toBe(false);
    expect(v.problems.join(' ')).toContain('spread');
  });

  it('rejects a mean outside the writable range', () => {
    expect(validateVoiceSpec(spec(4), recent).ok).toBe(false);
    expect(validateVoiceSpec(spec(40), recent).ok).toBe(false);
  });

  it('rejects an empty habit or signature — a spec nobody can hold is not a constraint', () => {
    expect(validateVoiceSpec({ ...spec(11.5), syntacticHabit: '  ' }, recent).ok).toBe(false);
    expect(validateVoiceSpec({ ...spec(11.5), signatureMove: '' }, recent).ok).toBe(false);
  });

  it('handles an empty corpus without crashing — the first story has nothing to diverge from', () => {
    expect(validateVoiceSpec(spec(14), []).ok).toBe(true);
  });
});

describe('measureVoice, which builds the corpus the gate compares against', () => {
  it('recovers the mean and spread of known prose', () => {
    const m = measureVoice(`${proseAtLength(10, 20)} ${proseAtLength(20, 20)}`);
    expect(m.mean).toBeCloseTo(15, 1);
    expect(m.sd).toBeGreaterThan(4);
    expect(m.sentences).toBe(40);
  });

  it('drops markdown headings rather than counting them as short sentences', () => {
    const withHeading = `# Chapter One: The Body in the Library\n\n${proseAtLength(12, 20)}`;
    expect(measureVoice(withHeading).sentences).toBe(20);
  });
});
