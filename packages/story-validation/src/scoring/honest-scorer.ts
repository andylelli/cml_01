/**
 * Honest-scorer shared helpers (ANALYSIS_50 Phase 3).
 *
 * The "honest" scorers grade the REAL agent artifact with content assertions instead of the vanity
 * (length/constant) scorers, so a future regression FAILS instead of scoring A. Each lives in this
 * package (no `@cml/prompts-llm` dependency — see agent2-cast-real-scorer.ts) and takes the real
 * artifact via a local structural-mirror type. The worker reads the flag and decides off/shadow/
 * enforce; these functions are pure graders.
 */

import { PhaseScore, TestResult } from './types.js';
import { calculateCategoryScore, getCriticalFailures } from './scorer-utils.js';
import { calculateGrade } from './thresholds.js';

export type HonestScorerMode = 'off' | 'shadow' | 'enforce';

/** Mirror of the off/shadow/enforce parsing used by the A_50 gates. Default OFF. */
export const parseHonestScorerMode = (raw: string | undefined): HonestScorerMode => {
  const v = String(raw ?? '').trim().toLowerCase();
  if (!v || v === 'off' || v === 'false' || v === '0') return 'off';
  if (v === 'enforce') return 'enforce';
  return 'shadow';
};

/**
 * Assemble a PhaseScore from category-tagged tests using the canonical 40/30/20/10 weighting
 * (identical to the existing scorers), so an honest score is a drop-in replacement.
 */
export const assembleHonestScore = (agent: string, tests: TestResult[]): PhaseScore => {
  const validation_score = calculateCategoryScore(tests, 'validation');
  const quality_score = calculateCategoryScore(tests, 'quality');
  const completeness_score = calculateCategoryScore(tests, 'completeness');
  const consistency_score = calculateCategoryScore(tests, 'consistency');

  const total =
    validation_score * 0.4 + quality_score * 0.3 + completeness_score * 0.2 + consistency_score * 0.1;

  const criticalFailures = getCriticalFailures(tests);
  const passed = criticalFailures.length === 0 && total >= 60;

  const component_failures: string[] = [];
  if (validation_score < 60) component_failures.push('validation');
  if (quality_score < 50) component_failures.push('quality');
  if (completeness_score < 60) component_failures.push('completeness');
  if (consistency_score < 50) component_failures.push('consistency');

  return {
    agent,
    validation_score,
    quality_score,
    completeness_score,
    consistency_score,
    total: Math.round(total),
    grade: calculateGrade(total),
    passed,
    tests,
    component_failures: component_failures.length > 0 ? component_failures : undefined,
    failure_reason: !passed
      ? `Honest scorer failed: ${
          criticalFailures.length > 0
            ? `critical — ${criticalFailures.map((t) => t.name).join(', ')}`
            : `weak components — ${component_failures.join(', ')}`
        }`
      : undefined,
  };
};

/** Shared tiny atom-normalizer (replicated locally to avoid a prompts-llm dependency). */
export const normalizeAtom = (s: unknown): string =>
  String(s ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
