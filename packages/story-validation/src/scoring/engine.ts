/**
 * SCO-02 — the one assembly every standard phase scorer ran by hand.
 *
 * Eight class scorers (setting, cast, character and location profiles, temporal context, background,
 * hard logic, narrative) each ended `score()` with the same 40 lines: four category scores, the
 * 40/30/20/10 total, critical failures, `passed = no critical && total >= 60`, the 60/50/60/50 component
 * floors, the A–F ladder and the failure reason — plus a private copy of the ladder and of the reason
 * builder. Measured identical across all eight (normalised text); this is that body, once. Field order
 * is kept exactly, so a PhaseScore serialises byte-for-byte as before (SCO-12 pins it).
 *
 * Deliberate variants stay in their scorers: Agent 6.5 (40/25/25/10, passes at 70, an empty consistency
 * category scores 100), prose (trust caps) and the honest family (`assembleHonestScore`).
 */
import type { PhaseScore, TestResult } from './types.js';
import { calculateCategoryScore, getCriticalFailures } from './scorer-utils.js';
import { calculateGrade } from './thresholds.js';

export function buildFailureReason(criticalFailures: TestResult[], componentFailures: string[]): string {
  const parts: string[] = [];
  if (criticalFailures.length > 0) {
    parts.push(`${criticalFailures.length} critical failure(s)`);
  }
  if (componentFailures.length > 0) {
    parts.push(`Components below minimum: ${componentFailures.join(', ')}`);
  }
  return parts.join('; ') || 'Score below threshold';
}

export function assemblePhaseScore(agent: string, tests: TestResult[]): PhaseScore {
  const validation_score = calculateCategoryScore(tests, 'validation');
  const quality_score = calculateCategoryScore(tests, 'quality');
  const completeness_score = calculateCategoryScore(tests, 'completeness');
  const consistency_score = calculateCategoryScore(tests, 'consistency');

  const total =
    validation_score * 0.4 +
    quality_score * 0.3 +
    completeness_score * 0.2 +
    consistency_score * 0.1;

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
    failure_reason: !passed ? buildFailureReason(criticalFailures, component_failures) : undefined,
  };
}
