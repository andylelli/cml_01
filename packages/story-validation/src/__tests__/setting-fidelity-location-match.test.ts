import { describe, it, expect } from 'vitest';
import { locationReferencedInProse } from '../scoring/phase-scorers/agent9-prose-scorer.js';

// run_33ecb4ad (A_61): decorated profile names, but the prose refers to them naturally. The old
// exact-full-name matcher counted 1/4 and hard-capped a 94%-quality draft to 60/D.
const STORY_PROSE = (
  'the inspector crossed the study and paused. later, in the library, she found the ledger. ' +
  'the walled gardens were silent at dusk, and the servants murmured in their quarters below.'
).toLowerCase();

describe('locationReferencedInProse — decorated profile names vs natural prose (A_61)', () => {
  it('matches a decorated study/library/gardens name by its head noun', () => {
    expect(locationReferencedInProse('The Thermally Sealed Study', STORY_PROSE)).toBe(true); // "the study"
    expect(locationReferencedInProse('The Manor Library', STORY_PROSE)).toBe(true);          // "library"
    expect(locationReferencedInProse('The Walled Gardens', STORY_PROSE)).toBe(true);          // "gardens"→garden(s)
  });

  it('matches a generic-container name only when a distinctive modifier is also present', () => {
    // "Servants' Quarters": head "quarter(s)" is generic → needs "servants" too (both present here).
    expect(locationReferencedInProse("Servants' Quarters", STORY_PROSE)).toBe(true);
  });

  it('the run scenario now scores ≥ 3/4 (was 1/4 → passing, not a 60/D cap)', () => {
    const profiles = ['The Thermally Sealed Study', 'The Manor Library', 'The Walled Gardens', "Servants' Quarters"];
    const referenced = profiles.filter((p) => locationReferencedInProse(p, STORY_PROSE)).length;
    expect(referenced).toBeGreaterThanOrEqual(3);
  });

  // ── both-directions guards: genuinely-absent locations must NOT count ──
  it('does NOT match a location that never appears in any form', () => {
    expect(locationReferencedInProse('The Boathouse', STORY_PROSE)).toBe(false);
    expect(locationReferencedInProse('The Orangery', STORY_PROSE)).toBe(false);
  });

  it('does NOT match a generic-container name when only the bare container word appears', () => {
    const prose = 'they gathered in the drawing room and spoke in low voices.'.toLowerCase();
    // "Dining Room" shares the generic head "room" but has no distinctive modifier ("dining") in prose.
    expect(locationReferencedInProse('The Dining Room', prose)).toBe(false);
    // "Drawing Room" DOES have its modifier present.
    expect(locationReferencedInProse('The Drawing Room', prose)).toBe(true);
  });

  it('still matches a verbatim full-name reference', () => {
    expect(locationReferencedInProse('The Conservatory', 'a body lay in the conservatory.')).toBe(true);
  });
});
