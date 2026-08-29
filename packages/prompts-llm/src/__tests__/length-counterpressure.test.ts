/**
 * A_75 §13.5 — the length incentive is one-way, and length is abstraction.
 *
 * MEASURED over 1,831 chapters, register rate against chapter length relative to its own book median:
 *   <0.8x 13.0% · 0.8-0.95x 13.4% · 0.95-1.05x 14.0% · 1.05-1.2x 15.0% · >1.2x 16.0%
 * Monotone, rho = 0.121 against a 0.046 critical value, and it SURVIVES the confound: 0.115 with all
 * final chapters removed, 0.095 mid-book only. 16.0% is the level of a prose-4 manuscript.
 *
 * Nothing pushed back: wordScore is 35% of the provisional score and caps at 100, so short is
 * penalised and long is free; there is no chapter-level overshoot check; and the "increase density"
 * directive rolls into the next four chapters. A ratchet with no pawl.
 */

import { describe, expect, it, afterEach } from 'vitest';

import { buildProvisionalChapterScore } from '../agent9-prose/generate.js';

const FLAG = 'AGENT9_LENGTH_COUNTERPRESSURE';
const prev = process.env[FLAG];
afterEach(() => {
  if (prev === undefined) delete process.env[FLAG];
  else process.env[FLAG] = prev;
});

const chapterOf = (words: number) => ({
  title: 'Ch',
  paragraphs: Array.from({ length: 8 }, () => Array.from({ length: Math.ceil(words / 8) }, (_, i) => `w${i}`).join(' ')),
});
const ledger = { preferredWords: 1000, hardFloorWords: 700, requiredClueIds: [] } as any;

// Signature: (chapter, chapterNumber, ledgerEntry, contentIssues, clueDistribution?, castNames?)
const scoreFor = (words: number) =>
  buildProvisionalChapterScore(chapterOf(words) as any, 3, ledger, []);

describe('with the flag OFF nothing changes', () => {
  it('a very long chapter draws no length directive', () => {
    delete process.env[FLAG];
    const s = scoreFor(2000) as any;
    expect(JSON.stringify(s.directives ?? [])).not.toMatch(/past its target length/);
  });
});

describe('with the flag ON', () => {
  it('flags a chapter that runs well past target', () => {
    process.env[FLAG] = 'true';
    const s = scoreFor(1600) as any;
    expect(JSON.stringify(s.directives)).toMatch(/past its target length/);
    expect(JSON.stringify(s.deficits)).toMatch(/of preferred length/);
  });

  it('stays silent on a chapter at or near target — this must not become a second ratchet', () => {
    process.env[FLAG] = 'true';
    for (const w of [900, 1000, 1150]) {
      const s = scoreFor(w) as any;
      expect(JSON.stringify(s.directives ?? []), `${w} words should not be flagged`).not.toMatch(/past its target length/);
    }
  });

  it('never tells a SHORT chapter to cut — the two directives must not contradict', () => {
    // A chapter under the floor is already told to expand. Telling it to cut in the same breath is
    // how a model is given an unsatisfiable instruction and burns a retry on it.
    process.env[FLAG] = 'true';
    const s = scoreFor(500) as any;
    const d = JSON.stringify(s.directives);
    expect(d).toMatch(/below hard floor/);
    expect(d).not.toMatch(/past its target length/);
  });

  it('asks for the abstract half to be cut, not the scene', () => {
    process.env[FLAG] = 'true';
    const d = JSON.stringify((scoreFor(1600) as any).directives);
    expect(d).toMatch(/Cut summary and restatement, not scene/);
    expect(d).toMatch(/subject is an idea rather than a person or a thing/);
  });

  it('is axis-neutral', () => {
    process.env[FLAG] = 'true';
    const d = JSON.stringify((scoreFor(1600) as any).directives);
    for (const re of [/\bclock\b/i, /\btide\b/i, /\blocked room\b/i, /\bdisguise\b/i, /\brank\b/i]) {
      expect(re.test(d)).toBe(false);
    }
  });
});
