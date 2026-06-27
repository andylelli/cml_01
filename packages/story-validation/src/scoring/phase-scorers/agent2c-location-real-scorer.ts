/**
 * Agent 2c — "grade the REAL artifact" location scorer (ANALYSIS_50 T3.3).
 *
 * The vanity `scoreSensoryRichness` ([agent2c-location-profiles-scorer.ts]) rewards WORD COUNT on
 * pre-joined strings — one run-on sentence beats four crisp atoms. This grades DISTINCT sensory
 * atoms (array entries across sights/sounds/smells/tactile) on the real `keyLocations`, matching the
 * 2c prompt's "≥4 noun-phrase entries per sense" bar, and penalizes cross-field duplication.
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency.
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial } from '../scorer-utils.js';
import { assembleHonestScore, normalizeAtom } from '../honest-scorer.js';

export interface RealSensoryDetails {
  sights?: string[];
  sounds?: string[];
  smells?: string[];
  tactile?: string[];
}
export interface RealKeyLocation {
  id?: string;
  name?: string;
  type?: string;
  sensoryDetails?: RealSensoryDetails;
}
export interface RealLocationProfiles {
  keyLocations?: RealKeyLocation[];
  atmosphere?: unknown;
}

const SENSES: (keyof RealSensoryDetails)[] = ['sights', 'sounds', 'smells', 'tactile'];
const ATOM_TARGET = 4; // the 2c prompt's minimum noun-phrases per sense field

const distinctAtoms = (arr: unknown): Set<string> => {
  const out = new Set<string>();
  if (Array.isArray(arr)) for (const a of arr) {
    const n = normalizeAtom(a);
    if (n) out.add(n);
  }
  return out;
};

export function scoreRealLocations(profiles: RealLocationProfiles | undefined | null): PhaseScore {
  const locations = Array.isArray(profiles?.keyLocations) ? profiles!.keyLocations! : [];
  const tests: TestResult[] = [];

  // ── Validation ──
  tests.push(locations.length > 0
    ? pass('Key locations present', 'validation', 1.5)
    : fail('Key locations present', 'validation', 1.5, 'no keyLocations', 'critical'));
  const wellFormed = locations.filter((l) => l && l.sensoryDetails && typeof l.sensoryDetails === 'object').length;
  tests.push(locations.length > 0 && wellFormed === locations.length
    ? pass('Locations well-formed', 'validation', 1.0)
    : partial('Locations well-formed', 'validation',
        locations.length ? Math.round((wellFormed / locations.length) * 100) : 0, 1.0, 'some locations lack sensoryDetails'));

  // ── Quality (T3.3 core): distinct-atom richness, not word count ──
  let cells = 0;
  let cellsMeetingTarget = 0;
  let dupPenaltyCells = 0;
  for (const loc of locations) {
    const perSense = SENSES.map((s) => distinctAtoms(loc?.sensoryDetails?.[s]));
    const union = new Set<string>();
    let totalAcross = 0;
    for (const setOfAtoms of perSense) {
      cells += 1;
      if (setOfAtoms.size >= ATOM_TARGET) cellsMeetingTarget += 1;
      totalAcross += setOfAtoms.size;
      for (const a of setOfAtoms) union.add(a);
    }
    // cross-field duplication: same atom reused across senses shrinks the union vs the sum
    if (totalAcross > 0 && union.size < totalAcross * 0.75) dupPenaltyCells += 1;
  }
  tests.push(partial('Distinct sensory atoms (≥4/field)', 'quality',
    cells > 0 ? Math.round((cellsMeetingTarget / cells) * 100) : 0, 2.0,
    `${cellsMeetingTarget}/${cells} sense fields reach ${ATOM_TARGET} distinct atoms`));
  tests.push(partial('Low cross-field atom duplication', 'quality',
    locations.length > 0 ? Math.round((1 - dupPenaltyCells / locations.length) * 100) : 100, 1.0));

  // ── Completeness ── prompt asks for crime scene + ≥3 others (4 minimum)
  tests.push(partial('Location count', 'completeness',
    locations.length >= 4 ? 100 : locations.length >= 2 ? 60 : 20, 1.0, `${locations.length} locations`));
  tests.push(profiles?.atmosphere ? pass('Atmosphere block', 'completeness', 1.0)
    : fail('Atmosphere block', 'completeness', 1.0, 'atmosphere block missing', 'major'));

  // ── Consistency ── no two locations share an identical full atom set
  const fingerprints = locations.map((loc) => {
    const all = new Set<string>();
    for (const s of SENSES) for (const a of distinctAtoms(loc?.sensoryDetails?.[s])) all.add(a);
    return [...all].sort().join('|');
  }).filter(Boolean);
  const dupSets = fingerprints.length - new Set(fingerprints).size;
  tests.push(dupSets === 0
    ? pass('Locations sensorially distinct', 'consistency', 1.0)
    : fail('Locations sensorially distinct', 'consistency', 1.0, `${dupSets} location(s) share an identical atom set`, 'minor'));

  return assembleHonestScore('agent2c-location', tests);
}
