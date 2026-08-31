/**
 * A_76 — the clearance budget counted the victim and the detective as suspects.
 *
 * `countClearableSuspects` tested `c?.role` for both its victim and its investigator filter.
 * `cml.CASE.cast` carries `role_archetype`, and MEASURED on every stored case `role` is undefined —
 * so neither filter ever matched and the count was inflated by two on every book.
 *
 * The consequence is visible on the manuscript the reader complained about: its budget was
 * `Math.max(2, 5) = 5`, and its final chapter carried exactly 5 clearance sentences. The gate could
 * not bind on the very book it existed to catch.
 *
 * Flag-gated `STORY_GEOMETRY_ROLE_FIELD_FIX` because a correct count TIGHTENS the gate.
 */

import { describe, expect, it } from 'vitest';

import { deriveStoryGeometry } from '../derive.js';

/** The real six-hander: one detective, one victim, one culprit, three suspects. */
const CAST = [
  { name: 'Eleanor Voss', role_archetype: 'Detective' },
  { name: 'Dr. Mallory Finch', role_archetype: 'victim' },
  { name: 'Captain Ivor Hale', role_archetype: 'Suspect' },
  { name: 'Beatrice Quill', role_archetype: 'Suspect' },
  { name: 'Sylvia Trent', role_archetype: 'Suspect' },
  { name: 'Hugo Vane', role_archetype: 'Suspect' },
];

// deriveStoryGeometry takes ONE argument — { cml, narrative } — and unwraps the case through
// `caseOf(input.cml)`. Passing the bare CASE, or passing two arguments, returns a degenerate
// geometry whose budget is the floor of 2, which looks exactly like the fix doing nothing when in
// fact the fixture is reaching nothing.
const caseData = () => ({
  CASE: {
    cast: CAST,
    culpability: { culprits: ['Captain Ivor Hale'] },
    meta: { title: 'x' },
  },
});

const budgetWith = (value: string | undefined): number => {
  const prev = process.env.STORY_GEOMETRY_ROLE_FIELD_FIX;
  if (value === undefined) delete process.env.STORY_GEOMETRY_ROLE_FIELD_FIX;
  else process.env.STORY_GEOMETRY_ROLE_FIELD_FIX = value;
  try {
    return deriveStoryGeometry({ cml: caseData(), narrative: { acts: [] } } as never)?.clearanceBudget?.maxSentences ?? -1;
  } finally {
    if (prev === undefined) delete process.env.STORY_GEOMETRY_ROLE_FIELD_FIX;
    else process.env.STORY_GEOMETRY_ROLE_FIELD_FIX = prev;
  }
};

describe('the clearable-suspect count', () => {
  it('with the flag OFF is unchanged — victim and detective still counted', () => {
    // 6 cast - 1 culprit = 5. The victim and detective filters read an undefined field and miss.
    expect(budgetWith(undefined)).toBe(5);
  });

  it('with the flag ON counts only the three real suspects', () => {
    expect(budgetWith('true')).toBe(3);
  });

  it('the corrected budget would have bound on the complained-about chapter', () => {
    // That chapter carried 5 clearance sentences. At a budget of 5 the check reads
    // `5 <= 5` and passes; at 3 it finally fires.
    const observedClearanceSentences = 5;
    expect(observedClearanceSentences <= budgetWith(undefined)).toBe(true);
    expect(observedClearanceSentences <= budgetWith('true')).toBe(false);
  });

  it('never drops below the floor of 2, whatever the cast', () => {
    const prev = process.env.STORY_GEOMETRY_ROLE_FIELD_FIX;
    process.env.STORY_GEOMETRY_ROLE_FIELD_FIX = 'true';
    try {
      const tiny = { CASE: { cast: [{ name: 'Solo', role_archetype: 'Detective' }], culpability: { culprits: [] }, meta: {} } };
      expect(deriveStoryGeometry({ cml: tiny, narrative: { acts: [] } } as never)?.clearanceBudget?.maxSentences).toBe(2);
    } finally {
      if (prev === undefined) delete process.env.STORY_GEOMETRY_ROLE_FIELD_FIX;
      else process.env.STORY_GEOMETRY_ROLE_FIELD_FIX = prev;
    }
  });
});
