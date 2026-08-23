/**
 * X95 — one opening-grounding vocabulary, and the palette that rotates it.
 *
 * These lists gate every chapter opening in the pipeline and existed in six places before this. The
 * tests that matter are the ones about the GATE not moving: a unification that quietly tightens a
 * validated wordlist would add retries to every chapter of every run, and the substring semantics are
 * the easiest thing to "clean up" by accident.
 */

import { describe, expect, it } from 'vitest';

import {
  OPENING_ATMOSPHERE_MARKERS,
  OPENING_SENSORY_GROUPS,
  OPENING_SENSORY_MARKERS,
  SENSORY_SOUND_AND_TACTILE,
  SENSORY_VISUAL_AND_SMELL,
  countGroundingMarkers,
  formatGroundingMarkers,
  groundingPaletteFor,
} from '../opening-grounding-vocabulary.js';

describe('the vocabulary itself', () => {
  it('still holds the 18 sensory markers the validator has always counted', () => {
    expect(OPENING_SENSORY_MARKERS).toEqual([
      'smell', 'scent', 'odor', 'fragrance',
      'sound', 'echo', 'silence', 'whisper', 'creak',
      'cold', 'warm', 'damp', 'rough', 'smooth',
      'glow', 'shadow', 'flicker', 'dim',
    ]);
  });

  it('derives the flat list from the groups, so the two renderings cannot drift', () => {
    expect(OPENING_SENSORY_MARKERS).toEqual(OPENING_SENSORY_GROUPS.flatMap((g) => g.terms));
    expect(SENSORY_SOUND_AND_TACTILE).toEqual(['sound', 'echo', 'silence', 'whisper', 'creak', 'cold', 'warm', 'damp', 'rough', 'smooth']);
    expect(SENSORY_VISUAL_AND_SMELL).toEqual(['glow', 'shadow', 'flicker', 'dim', 'smell', 'scent', 'odor', 'fragrance']);
  });

  it('keeps every atmosphere term the validator accepted, and NOT the one the prompt wrongly offered', () => {
    for (const term of ['rain', 'fog', 'dusk', 'firelight', 'gray', 'grey', 'chill', 'crisp', 'drizzle', 'haze', 'pale']) {
      expect(OPENING_ATMOSPHERE_MARKERS, term).toContain(term);
    }
    // `weather` was offered by the scene-grounding checklist and rejected by the gate. Unifying the
    // two meant deciding which body was right, and `chapter-validator.test.ts` had already answered:
    // its negative fixture is grounded on "No one commented on the room or the weather". Naming the
    // weather is not weather. The word came out of the PROMPT, not into the gate.
    expect(OPENING_ATMOSPHERE_MARKERS).not.toContain('weather');
  });

  it('has no duplicates in either list', () => {
    expect(new Set(OPENING_SENSORY_MARKERS).size).toBe(OPENING_SENSORY_MARKERS.length);
    expect(new Set(OPENING_ATMOSPHERE_MARKERS).size).toBe(OPENING_ATMOSPHERE_MARKERS.length);
  });
});

describe('counting — the gate must not have moved', () => {
  it('matches on SUBSTRING, exactly as the validator always did', () => {
    // `sound` matches "sounds", `light` matches "lighting" and "lamplight", `warm` matches "warmth".
    // A \b…\b tightening here would silently add retries to every chapter of every run.
    expect(countGroundingMarkers('the sounds of the hall', OPENING_SENSORY_MARKERS)).toBe(1);
    expect(countGroundingMarkers('the lighting was poor', OPENING_ATMOSPHERE_MARKERS)).toBeGreaterThan(0);
    expect(countGroundingMarkers('a sudden warmth', OPENING_SENSORY_MARKERS)).toBe(1);
  });

  it('is case-insensitive on the text', () => {
    expect(countGroundingMarkers('A SCENT OF ASH AND A CREAK', OPENING_SENSORY_MARKERS)).toBe(2);
  });

  it('counts each distinct marker once, however often it appears', () => {
    expect(countGroundingMarkers('cold, cold, cold', OPENING_SENSORY_MARKERS)).toBe(1);
  });

  it('accepts the canonical passing opening and rejects a synonym-only one', () => {
    const passing = 'The cold of the hallway pressed against her cheeks. A faint scent of ash hung in the evening air.';
    expect(countGroundingMarkers(passing, OPENING_SENSORY_MARKERS)).toBeGreaterThanOrEqual(2);
    expect(countGroundingMarkers(passing, OPENING_ATMOSPHERE_MARKERS)).toBeGreaterThanOrEqual(1);
    // "chill" and "murmur" are the synonyms the repair directive warns about: neither is a SENSORY
    // marker, and the directive is right to say so.
    expect(countGroundingMarkers('A chill, and a murmur from the stairs.', OPENING_SENSORY_MARKERS)).toBe(0);
  });
});

describe('formatting', () => {
  it('renders a list the prompts can quote', () => {
    expect(formatGroundingMarkers(['a', 'b'])).toBe('a / b');
    expect(formatGroundingMarkers(['a', 'b'], '/')).toBe('a/b');
  });
});

describe('the rotating palette', () => {
  it('only ever offers words the validator accepts — the property that makes it safe', () => {
    for (let ch = 1; ch <= 12; ch += 1) {
      for (const seed of ['The Tidal Trap', 'Echoes of Deceit']) {
        for (const w of groundingPaletteFor(ch, seed, OPENING_SENSORY_MARKERS, 8)) {
          expect(OPENING_SENSORY_MARKERS, w).toContain(w);
        }
      }
    }
  });

  it('returns the requested size, with no repeats inside one palette', () => {
    const p = groundingPaletteFor(3, 'The Tidal Trap', OPENING_ATMOSPHERE_MARKERS, 12);
    expect(p).toHaveLength(12);
    expect(new Set(p).size).toBe(12);
  });

  it('gives different chapters different palettes', () => {
    const a = groundingPaletteFor(1, 'The Tidal Trap', OPENING_SENSORY_MARKERS, 8).join(',');
    const b = groundingPaletteFor(2, 'The Tidal Trap', OPENING_SENSORY_MARKERS, 8).join(',');
    expect(a).not.toBe(b);
  });

  it('gives different STORIES different palettes for the same chapter', () => {
    const a = groundingPaletteFor(1, 'The Tidal Trap', OPENING_SENSORY_MARKERS, 8).join(',');
    const b = groundingPaletteFor(1, 'Echoes of Deceit', OPENING_SENSORY_MARKERS, 8).join(',');
    expect(a).not.toBe(b);
  });

  it('is deterministic — a replay of the same case sees the same words', () => {
    const once = groundingPaletteFor(4, 'Masquerade of Authority', OPENING_ATMOSPHERE_MARKERS, 12);
    expect(groundingPaletteFor(4, 'Masquerade of Authority', OPENING_ATMOSPHERE_MARKERS, 12)).toEqual(once);
  });

  it('degrades safely on a size larger than the list, or an empty seed', () => {
    expect(groundingPaletteFor(1, 'x', OPENING_SENSORY_MARKERS, 999)).toHaveLength(OPENING_SENSORY_MARKERS.length);
    expect(groundingPaletteFor(1, undefined, OPENING_SENSORY_MARKERS, 4)).toHaveLength(4);
    expect(groundingPaletteFor(1, '', OPENING_SENSORY_MARKERS, 4)).toHaveLength(4);
  });
});
