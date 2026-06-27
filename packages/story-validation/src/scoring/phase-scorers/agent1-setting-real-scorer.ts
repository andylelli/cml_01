/**
 * Agent 1 — "grade the REAL artifact" setting scorer (ANALYSIS_50 T3.1).
 *
 * The vanity scorer ([agent1-setting-refinement-scorer.ts]) grades a fabricated adapter
 * ([agent1-scoring-adapter.ts]) — synthesized spatial-layout prose engineered to fire its regexes —
 * not the real `SettingRefinement`. This grades the actual artifact: era/location/atmosphere/realism
 * content, and (crucially) asserts the `atmosphere` block exists rather than fabricating it.
 *
 * Local structural mirror — no `@cml/prompts-llm` dependency (see agent2-cast-real-scorer.ts).
 */

import { PhaseScore, TestResult } from '../types.js';
import { pass, fail, partial, exists, hasMinWords } from '../scorer-utils.js';
import { assembleHonestScore } from '../honest-scorer.js';

export interface RealSetting {
  era?: {
    decade?: string;
    technology?: string[];
    forensics?: string[];
    transportation?: string[];
    communication?: string[];
    socialNorms?: string[];
    policing?: string[];
  };
  location?: {
    type?: string;
    description?: string;
    physicalConstraints?: string[];
    geographicIsolation?: string;
    accessControl?: string[];
  };
  atmosphere?: { weather?: string; timeOfDay?: string; mood?: string; visualDescription?: string };
  realism?: { anachronisms?: string[]; implausibilities?: string[]; recommendations?: string[] };
}

const isHollow = (v: unknown): boolean => {
  const s = String(v ?? '').trim().toLowerCase();
  return s.length === 0 || s === 'n/a' || s === 'none' || s === 'unknown' || s === 'tbd';
};

export function scoreRealSetting(setting: RealSetting | undefined | null): PhaseScore {
  const s = setting ?? {};
  const era = s.era ?? {};
  const loc = s.location ?? {};
  const atmo = s.atmosphere ?? {};
  const realism = s.realism ?? {};
  const tests: TestResult[] = [];

  // ── Validation ──
  tests.push(s.location && exists(loc.type) && exists(loc.description)
    ? pass('Location present', 'validation', 1.5)
    : fail('Location present', 'validation', 1.5, 'location.type/description missing', 'critical'));
  tests.push(s.atmosphere && !isHollow(atmo.weather) && !isHollow(atmo.mood) && !isHollow(atmo.timeOfDay)
    ? pass('Atmosphere present', 'validation', 1.5)
    : fail('Atmosphere present', 'validation', 1.5, 'atmosphere block missing or hollow (weather/mood/timeOfDay)', 'critical'));
  tests.push(exists(era.decade)
    ? pass('Era decade set', 'validation', 1.0)
    : fail('Era decade set', 'validation', 1.0, 'era.decade missing', 'major'));

  // ── Quality ──
  tests.push(partial('Atmosphere visual description',
    'quality', hasMinWords(atmo.visualDescription, 8) ? 100 : isHollow(atmo.visualDescription) ? 0 : 55, 1.5,
    'visualDescription should be a substantive sentence'));
  const constraints = (loc.physicalConstraints ?? []).filter((c) => !isHollow(c));
  tests.push(partial('Physical constraints', 'quality',
    constraints.length >= 2 ? 100 : constraints.length === 1 ? 60 : 0, 1.0));
  const access = (loc.accessControl ?? []).filter((c) => !isHollow(c));
  tests.push(partial('Access control', 'quality', access.length >= 1 ? 100 : 0, 1.0));

  // ── Completeness ── era reference arrays should each carry ≥1 concrete entry
  const eraArrays: [string, string[]][] = [
    ['technology', era.technology ?? []],
    ['communication', era.communication ?? []],
    ['socialNorms', era.socialNorms ?? []],
    ['policing', era.policing ?? []],
  ];
  const filledEra = eraArrays.filter(([, arr]) => arr.filter((x) => !isHollow(x)).length >= 1).length;
  tests.push(partial('Era reference fields', 'completeness',
    Math.round((filledEra / eraArrays.length) * 100), 1.0, `${filledEra}/${eraArrays.length} era arrays populated`));
  tests.push(exists(loc.geographicIsolation)
    ? pass('Geographic isolation', 'completeness', 1.0)
    : partial('Geographic isolation', 'completeness', 40, 1.0, 'geographicIsolation thin/missing'));

  // ── Consistency ── realism self-audit must be clean (also gated upstream)
  const clean = (realism.anachronisms ?? []).length === 0 && (realism.implausibilities ?? []).length === 0;
  tests.push(clean
    ? pass('Realism self-audit clean', 'consistency', 1.0)
    : fail('Realism self-audit clean', 'consistency', 1.0, 'anachronisms/implausibilities present', 'minor'));

  return assembleHonestScore('agent1-setting', tests);
}
