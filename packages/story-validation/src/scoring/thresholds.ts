/**
 * Threshold configuration and validation logic
 */

import type { PhaseScore, ThresholdConfig } from './types.js';

/**
 * Default thresholds for each phase
 *
 * SCO-Q03 (owner decision, 2026-10-02): the strict / lenient threshold modes are deleted — the only
 * production constructor hard-coded "standard" and no configuration ever selected another. This table is
 * the one bar per phase. The dead `agent4-hard-logic` key (no scorer has emitted it since the vanity
 * HardLogicScorer went) is deleted with them; `agent9-prose` stays — it is still emitted
 * (`apps/worker/src/jobs/pipeline/abort.ts`).
 */
export const DEFAULT_THRESHOLDS: Record<string, number> = {
  // Strict phases (logic-critical)
  // Keys must match the `agent` field set by each scorer
  // SCO-D02: the honest Agent 3b scorer (scoreRealHardLogic) names itself 'agent3b-hard-logic'.
  'agent3b-hard-logic': 85,
  'agent9-prose': 80,                  // ProseScorer

  // Standard phases (important but recoverable)
  'agent2-cast': 75,
  'agent1-setting-refinement': 75,
  'agent2b-character-profiles': 75,    // scoreRealCharacterProfiles
  'agent2c-location-profiles': 75,
  'agent7-narrative-outline': 75,

  // Lenient phases (foundational context)
  'agent2d-temporal-context': 70,      // scoreRealTemporalContext
  'agent2e-background': 70,
};

/** The bar for any phase the table does not name. */
export const FALLBACK_THRESHOLD = 75;

/**
 * Component minimum thresholds (apply to ALL phases)
 * Each component must meet its minimum regardless of composite score
 */
export const COMPONENT_MINIMUMS = {
  validation_score: 60,      // Can't pass with invalid output
  quality_score: 50,         // Must meet basic quality standards
  completeness_score: 60,    // Can't be missing major elements
  consistency_score: 50,     // Must align with prior phases
};

/**
 * Check if a phase score passes the threshold
 * Requires BOTH composite threshold AND all component minimums
 */
export function passesThreshold(score: PhaseScore, config: ThresholdConfig = {}): boolean {
  const threshold = getThreshold(score.agent, config);

  // Check 1: Composite score must meet threshold
  const meetsCompositeThreshold = score.total >= threshold;

  // Check 2: Each component must meet minimum
  const meetsComponentMinimums =
    score.validation_score >= COMPONENT_MINIMUMS.validation_score &&
    score.quality_score >= COMPONENT_MINIMUMS.quality_score &&
    score.completeness_score >= COMPONENT_MINIMUMS.completeness_score &&
    score.consistency_score >= COMPONENT_MINIMUMS.consistency_score;

  // Both conditions must be true
  return meetsCompositeThreshold && meetsComponentMinimums;
}

/**
 * Identify which components failed to meet their minimums
 */
export function getFailedComponents(score: PhaseScore): string[] {
  const failed: string[] = [];

  if (score.validation_score < COMPONENT_MINIMUMS.validation_score) {
    failed.push(`validation (${score.validation_score} < ${COMPONENT_MINIMUMS.validation_score})`);
  }
  if (score.quality_score < COMPONENT_MINIMUMS.quality_score) {
    failed.push(`quality (${score.quality_score} < ${COMPONENT_MINIMUMS.quality_score})`);
  }
  if (score.completeness_score < COMPONENT_MINIMUMS.completeness_score) {
    failed.push(`completeness (${score.completeness_score} < ${COMPONENT_MINIMUMS.completeness_score})`);
  }
  if (score.consistency_score < COMPONENT_MINIMUMS.consistency_score) {
    failed.push(`consistency (${score.consistency_score} < ${COMPONENT_MINIMUMS.consistency_score})`);
  }

  return failed;
}

/**
 * Calculate letter grade from numeric score
 */
export function calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
  if (score >= 90) return 'A';
  if (score >= 80) return 'B';
  if (score >= 70) return 'C';
  if (score >= 60) return 'D';
  return 'F';
}

/**
 * Get threshold for a specific agent: an override, else the table, else the fallback.
 */
export function getThreshold(agent: string, config: ThresholdConfig = {}): number {
  return config.overrides?.[agent]
    ?? DEFAULT_THRESHOLDS[agent]
    ?? FALLBACK_THRESHOLD;
}
