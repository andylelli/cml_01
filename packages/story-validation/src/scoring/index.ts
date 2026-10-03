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
 * const config: ThresholdConfig = {};
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
  FALLBACK_THRESHOLD,
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
  hasMinWords,
  calculateWeightedScore,
  calculateCategoryScore,
  getCriticalFailures,
  scoreArrayCompleteness,
  checkDuplicates,
  Severity,
  TestCategory,
} from './scorer-utils.js';

// Honest scorers (ANALYSIS_50 Phase 3 — grade the REAL artifact; default OFF, off/shadow/enforce)
export { assembleHonestScore, normalizeAtom } from './honest-scorer.js';
export { scoreRealCast } from './phase-scorers/agent2-cast-real-scorer.js';
// SCO-Q07 (2026-10-02): 2b, 2d and 6.5 — the last three vanity scorers — replaced by honest tables.
export { scoreRealCharacterProfiles } from './phase-scorers/agent2b-character-profiles-real-scorer.js';
export { scoreRealTemporalContext } from './phase-scorers/agent2d-temporal-context-real-scorer.js';
export { scoreRealWorldDocument } from './phase-scorers/agent65-world-builder-real-scorer.js';
export { scoreRealSetting } from './phase-scorers/agent1-setting-real-scorer.js';
export { scoreRealLocations } from './phase-scorers/agent2c-location-real-scorer.js';
export { scoreRealBackground } from './phase-scorers/agent2e-background-real-scorer.js';
export { scoreRealCml } from './phase-scorers/agent3-cml-real-scorer.js';
export { scoreRealHardLogic } from './phase-scorers/agent3b-device-real-scorer.js';
export { scoreRealNarrative } from './phase-scorers/agent7-narrative-real-scorer.js';


// Report invariant guardrails
export {
  validateGenerationReportInvariants,
  assertGenerationReportInvariants,
} from './report-invariants.js';
export type { ReportInvariantViolation } from './report-invariants.js';

// SCO-05 — the run outcome, derived once.
export { deriveRunOutcome, INFRA_SIGNAL_PATTERN } from './run-outcome.js';

// SCO-09 — the scorers' input types.
export type { RealCharacterProfile } from './phase-scorers/agent2b-character-profiles-real-scorer.js';
export type { RealTemporalContext } from './phase-scorers/agent2d-temporal-context-real-scorer.js';
export type { RealWorldDocument } from './phase-scorers/agent65-world-builder-real-scorer.js';
