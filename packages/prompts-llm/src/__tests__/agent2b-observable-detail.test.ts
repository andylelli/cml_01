/**
 * A_75 §12.4 — character_profiles is the most ABSTRACT artifact this pipeline produces.
 *
 * MEASURED across 27 stored runs: a 28.9% machine-register rate against 4.5% for location_profiles —
 * 6.4x the most concrete, and above the manuscripts themselves (~12%). By field:
 * personalStakeInCase 42.9%, publicPersona 32.3%, motiveSeed 31.5%, stakes 25.8%, privateSecret
 * 24.7%, internalConflict 22.6% — and summary 7.8%, because the schema tells it what to be.
 *
 * It feeds character_clarity and dialogue, two of the three categories never to exceed 8 in 44 reads.
 */

import { describe, expect, it, afterEach } from 'vitest';

import { buildProfilesPrompt } from '../agent2b-character-profiles.js';

const FLAG = 'AGENT2B_OBSERVABLE_DETAIL';
const prev = process.env[FLAG];
afterEach(() => {
  if (prev === undefined) delete process.env[FLAG];
  else process.env[FLAG] = prev;
});

const inputs = {
  cast: { characters: [{ name: 'Eleanor Voss' }, { name: 'Captain Ivor Hale' }] },
  tone: 'Classic',
} as any;

const developerOf = (): string => {
  const p = buildProfilesPrompt(inputs) as any;
  return String(p?.developer ?? p?.system ?? JSON.stringify(p));
};

describe('with the flag OFF the prompt is byte-identical to today', () => {
  it('carries no observable-detail instruction', () => {
    delete process.env[FLAG];
    const d = developerOf();
    expect(d).not.toContain('OBSERVABLE, NOT ABSTRACT');
  });
});

describe('with the flag ON', () => {
  it('names exactly the six prose fields it applies to', () => {
    process.env[FLAG] = 'true';
    const d = developerOf();
    expect(d).toContain('OBSERVABLE, NOT ABSTRACT');
    for (const f of ['publicPersona', 'privateSecret', 'motiveSeed', 'stakes', 'internalConflict', 'personalStakeInCase']) {
      expect(d).toContain(f);
    }
  });

  it('EXEMPTS the record fields — a record must stay a record', () => {
    // alibiWindow scores 30.6% and is deliberately excluded: it states where someone was between two
    // times, and the fair-play machinery reads it. Dramatising it would corrupt the field.
    process.env[FLAG] = 'true';
    const d = developerOf();
    expect(d).toMatch(/does NOT apply to alibiWindow/);
    expect(d).toMatch(/accessPlausibility/);
    expect(d).toMatch(/record stays a record/);
  });

  it('teaches by contrast — every example pairs an abstract line with an observable one', () => {
    process.env[FLAG] = 'true';
    const d = developerOf();
    const abstracts = (d.match(/abstract\s+->/g) ?? []).length;
    const observables = (d.match(/observable ->/g) ?? []).length;
    expect(abstracts).toBeGreaterThanOrEqual(3);
    expect(abstracts).toBe(observables);
  });

  /**
   * THE AXIS TEST. The five `false_assumption` axes are temporal, spatial, identity, behavioural and
   * authority. An example built from a timing case ("she claims she left at ten") would quietly bias
   * four of them toward a clock. Every example must be a habit, an object or a thing said.
   */
  it('contains no axis-specific vocabulary, so it reads the same on all five axes', () => {
    process.env[FLAG] = 'true';
    const block = developerOf().split('OBSERVABLE, NOT ABSTRACT')[1]?.split('CHARACTER HUMOUR')[0] ?? '';
    expect(block.length).toBeGreaterThan(200);
    const axisWords = [
      /\bclock\b/i, /\balibi\b/i, /\bminutes?\b/i, /\bo'clock\b/i, /\btide\b/i,   // temporal
      /\blocked room\b/i, /\bcorridor\b/i, /\bwindow\b/i,                          // spatial
      /\bimpersonat/i, /\bdisguise\b/i, /\btwin\b/i,                               // identity
      /\brank\b/i, /\bchain of command\b/i,                                        // authority
    ];
    const found = axisWords.filter((re) => re.test(block)).map(String);
    expect(found, 'an axis-specific example biases the four axes it does not describe').toEqual([]);
  });

  it('asks for a concrete noun, which is the property the register score measures', () => {
    process.env[FLAG] = 'true';
    expect(developerOf()).toMatch(/concrete noun/);
  });
});
