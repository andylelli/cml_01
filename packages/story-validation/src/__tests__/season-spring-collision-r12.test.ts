/**
 * REVIEW_12 §3.1 — the case's own murder device read as the season.
 *
 * MEASURED on run `mystery-1787090659145`: **8 of that run's 11 retry calls** were
 * `month/season contradiction (september vs spring)` on chapters 2, 3, 4 and 8, twice each.
 * Agent 2d's temporal data was correct (`month: September`, `season: fall`). The collision was
 * between a season word list and the case's own physical evidence:
 *
 *   CASE.constraint_space.physical.traces: "Broken spring fragment found near rooftop pulley"
 */

import { describe, expect, it } from 'vitest';
import {
  analyzeTemporalConsistency,
  caseNamesMechanicalSpring,
  buildSpringMechanicalRe,
} from '../temporal-consistency.js';

/** The real 08-19 case, trimmed to the fields the predicate reads. */
const clockCase = {
  constraint_space: {
    physical: {
      traces: [
        'Scratch and oil smudge on clock casing near gear train',
        'Taut wire from rooftop to clock back panel',
        'Broken spring fragment found near rooftop pulley',
      ],
    },
    access: { objects: ['Grandfather clock', 'Rooftop terrace pulley and wire', 'Hotel letter opener'] },
  },
};

const poisonCase = {
  constraint_space: { physical: { traces: ['A cup with a bitter residue'] }, access: { objects: ['A teacup'] } },
  death_method: 'poisoned with a tincture of foxglove',
};

describe('caseNamesMechanicalSpring', () => {
  it('detects a spring named in the case physical evidence', () => {
    expect(caseNamesMechanicalSpring(clockCase)).toBe(true);
  });

  it('detects one named in the mechanism or the death method', () => {
    expect(caseNamesMechanicalSpring({ hidden_model: { mechanism: { description: 'a spring-driven release' } } })).toBe(true);
    expect(caseNamesMechanicalSpring({ death_method: 'struck by a spring-loaded bolt' })).toBe(true);
  });

  it('is false for a case that names no spring, and null-safe', () => {
    expect(caseNamesMechanicalSpring(poisonCase)).toBe(false);
    expect(caseNamesMechanicalSpring(undefined)).toBe(false);
    expect(caseNamesMechanicalSpring({})).toBe(false);
  });
});

describe('analyzeTemporalConsistency — the 08-19 collision (REVIEW_12 §3.1)', () => {
  // The sentences that actually cost 8 retry calls, verbatim from the shipped manuscript.
  const prose =
    'It was September at the Cliffhaven Hotel. A broken spring fragment, no larger than a thumbnail, ' +
    'rested near the baseboard. The presence of the wire, the broken spring, and the misaligned lever ' +
    'suggested a complexity she had not anticipated. Her gaze lingered on the wire and the spring.';

  it('flags a contradiction when the case names no spring — unchanged behaviour', () => {
    const a = analyzeTemporalConsistency(prose, 'September', [], false);
    expect(a.conflictingSeasons).toEqual(['spring']);
  });

  it('does NOT flag when the case names the spring as physical evidence', () => {
    const a = analyzeTemporalConsistency(prose, 'September', [], caseNamesMechanicalSpring(clockCase));
    expect(a.conflictingSeasons).toEqual([]);
  });

  it('STILL flags a genuine seasonal use, even on a case that names a spring', () => {
    // The masking risk, bounded: an unambiguous seasonal collocation is not silenced.
    const seasonal = 'It was September, and the spring air still lingered in the courtyard.';
    const a = analyzeTemporalConsistency(seasonal, 'September', [], true);
    expect(a.conflictingSeasons).toEqual(['spring']);
  });

  it('still flags springtime and vernal, which no clock part can carry', () => {
    for (const word of ['springtime', 'vernal'] as const) {
      const a = analyzeTemporalConsistency(`It was September. A ${word} mood held the house.`, 'September', [], true);
      expect(a.conflictingSeasons).toEqual(['spring']);
    }
  });

  it('leaves the other three seasons untouched by the spring rule', () => {
    const a = analyzeTemporalConsistency('It was September, deep in the wintry dark.', 'September', [], true);
    expect(a.conflictingSeasons).toEqual(['winter']);
  });

  it('names the trigger, so the failure message can quote it (REVIEW_12 §3.2)', () => {
    const a = analyzeTemporalConsistency('It was September, and the spring air was damp.', 'September', [], true);
    expect(a.seasonTriggers.spring).toContain('spring air');
  });
});

describe('buildSpringMechanicalRe — why the existing guard could not reach it', () => {
  // A /g/ regex: `.test()` is stateful, so each case needs its own matcher or the results lie.
  const mech = (s: string) => buildSpringMechanicalRe([]).test(s);

  it('handles the collocations it was built for', () => {
    expect(mech('the mainspring had snapped')).toBe(true);
    expect(mech('a coil spring lay beside it')).toBe(true);
    expect(mech('the clock spring was broken')).toBe(true);
  });

  it('does NOT handle how prose actually names the part — the gap REVIEW_12 measured', () => {
    // Condition adjective, part noun, and bare anaphoric reference: none are mechanism nouns.
    expect(mech('A broken spring fragment rested near the baseboard')).toBe(false);
    expect(mech('a loose wire and a broken spring')).toBe(false);
    expect(mech('her gaze lingered on the wire and the spring')).toBe(false);
  });

  it('correctly leaves a genuine seasonal use alone', () => {
    expect(mech('cold spring air drifted through the window')).toBe(false);
  });
});
