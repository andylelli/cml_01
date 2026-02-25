/**
 * Scoring System - Core Exports
 * 
 * This module provides the foundational infrastructure for the CML generation
 * scoring and reporting system. It includes:
 * 
 * - Type definitions for scores, reports, and configurations
 * - Threshold configuration and validation logic
 * - Retry management for failed phases
 * - Score aggregation for generation reports
 * - Utility functions for building scorers
 * - Phase-specific scorers for all agents
 * 
 * Usage:
 * ```typescript
 * import { ScoreAggregator, RetryManager, ThresholdConfig } from '@cml/story-validation/scoring';
 * 
 * const config: ThresholdConfig = { mode: 'standard' };
 * const retryManager = new RetryManager();
 * const aggregator = new ScoreAggregator(config, retryManager);
 * ```
 */

// Core type definitions
export {
  TestResult,
  PhaseScore,
  ScoringContext,
  Scorer,
  ThresholdConfig,
  PhaseReport,
  GenerationReport,
} from './types.js';

// Threshold configuration and validation
export {
  DEFAULT_THRESHOLDS,
  COMPONENT_MINIMUMS,
  THRESHOLD_MODES,
  passesThreshold,
  getFailedComponents,
  calculateGrade,
  getThreshold,
} from './thresholds.js';

// Retry management
export {
  RetryManager,
  RetryConfig,
  GlobalRetryConfig,
  RetryLimitsConfig,
  RetryHistoryEntry,
} from './retry-manager.js';

// Score aggregation
export {
  ScoreAggregator,
  GenerationMetadata,
} from './aggregator.js';

// Scorer utilities
export {
  createTest,
  pass,
  fail,
  partial,
  exists,
  hasMinLength,
  hasMaxLength,
  inRange,
  hasMinWords,
  hasRequiredFields,
  calculateWeightedScore,
  calculateCategoryScore,
  getFailedTests,
  getCriticalFailures,
  hasCriticalFailures,
  calculatePassRate,
  validateSchema,
  scoreTextQuality,
  scoreArrayCompleteness,
  checkDuplicates,
  scoreConsistency,
  Severity,
  TestCategory,
} from './scorer-utils.js';

// Phase scorers
export { BackgroundContextScorer } from './phase-scorers/agent2e-background-scorer.js';
export { CastDesignScorer } from './phase-scorers/agent2-cast-scorer.js';
export { CharacterProfilesScorer } from './phase-scorers/agent2b-character-profiles-scorer.js';
export { LocationProfilesScorer } from './phase-scorers/agent2c-location-profiles-scorer.js';
export { TemporalContextScorer } from './phase-scorers/agent2d-temporal-context-scorer.js';
export { HardLogicScorer } from './phase-scorers/agent4-hard-logic-scorer.js';
export { NarrativeScorer } from './phase-scorers/agent7-narrative-scorer.js';
export { SettingRefinementScorer } from './phase-scorers/agent1-setting-refinement-scorer.js';
export { ProseScorer } from './phase-scorers/agent9-prose-scorer.js';

// Retry feedback
export { 
  buildRetryFeedback, 
  buildConciseRetryFeedback, 
  getTopFailures 
} from './retry-feedback.js';
