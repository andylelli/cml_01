/**
 * Threshold configuration and validation logic
 */

import type { PhaseScore, ThresholdConfig } from './types.js';

/**
 * Default thresholds for each phase
 */
export const DEFAULT_THRESHOLDS: Record<string, number> = {
  // Strict phases (logic-critical)
  'agent4-hard-logic': 85,      // Must have near-perfect logic
  'agent9-prose': 80,            // Final output must be high quality
  
  // Standard phases (important but recoverable)
  'agent2-cast': 75,
  'agent3-character-profiles': 75,
  'agent5-location-profiles': 75,
  'agent7-narrative': 75,
  'agent8-setting-refinement': 75,
  
  // Lenient phases (foundational context)
  'agent1-background': 70,
  'agent6-temporal-context': 70,
};

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
 * Threshold modes for different quality requirements
 */
export const THRESHOLD_MODES = {
  strict: {
    default: 85,
    'agent4-hard-logic': 90,
    'agent9-prose': 85,
  },
  standard: {
    // Use DEFAULT_THRESHOLDS
    ...DEFAULT_THRESHOLDS
  },
  lenient: {
    default: 65,
    'agent4-hard-logic': 75,
    'agent9-prose': 70,
  },
};

/**
 * Check if a phase score passes the threshold
 * Requires BOTH composite threshold AND all component minimums
 */
export function passesThreshold(score: PhaseScore, config: ThresholdConfig): boolean {
  const mode = THRESHOLD_MODES[config.mode];
  const threshold = config.overrides?.[score.agent] 
    ?? (mode as any)[score.agent] 
    ?? mode.default 
    ?? (DEFAULT_THRESHOLDS as any)[score.agent] 
    ?? 75;
  
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
 * Get threshold for a specific agent and config
 */
export function getThreshold(agent: string, config: ThresholdConfig): number {
  const mode = THRESHOLD_MODES[config.mode];
  return config.overrides?.[agent] 
    ?? (mode as any)[agent] 
    ?? mode.default 
    ?? (DEFAULT_THRESHOLDS as any)[agent] 
    ?? 75;
}
