/**
 * Core TypeScript types and interfaces for the scoring system
 */

import type { CMLData } from '../types.js';

/**
 * Test result from an individual validation/quality/completeness/consistency check
 */
export interface TestResult {
  name: string;
  category: 'validation' | 'quality' | 'completeness' | 'consistency';
  passed: boolean;
  score: number;              // 0-100
  weight: number;             // Contribution to category score
  message?: string;           // Pass/fail reason
  severity?: 'critical' | 'major' | 'moderate' | 'minor';
}

/**
 * Score for a single phase with component breakdowns
 */
export interface PhaseScore {
  agent: string;
  validation_score: number;
  quality_score: number;
  completeness_score: number;
  consistency_score: number;
  total: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
  passed: boolean;
  tests: TestResult[];
  breakdown?: any;
  
  // Component pass/fail status
  component_failures?: string[];  // List of components below minimum (e.g., ["completeness (40 < 60)"])
  failure_reason?: string;        // Human-readable reason for failure
}

/**
 * Context provided to scorers for evaluation
 */
export interface ScoringContext {
  // Previous phase outputs for consistency checks
  previous_phases: Record<string, any>;
  
  // CML data for validation
  cml: CMLData;
  
  // Configuration
  threshold_config: ThresholdConfig;
}

/**
 * Base scorer interface for all phase scorers
 */
export interface Scorer<TInput, TOutput> {
  /**
   * Score a phase's output
   */
  score(input: TInput, output: TOutput, context: ScoringContext): Promise<PhaseScore>;
}

/**
 * Threshold configuration for pass/fail determination
 */
export interface ThresholdConfig {
  mode: 'strict' | 'standard' | 'lenient';
  overrides?: Record<string, number>;
}

/**
 * Phase report with score and metadata
 */
export interface PhaseReport {
  agent: string;
  phase_name: string;         // Human-readable
  score: PhaseScore;          // Full score object
  duration_ms: number;
  cost: number;
  threshold: number;
  passed: boolean;
  
  // Detailed test results
  tests: TestResult[];
  
  // Phase-specific breakdown (optional)
  breakdown?: any;            // character_breakdown, chapter_breakdown, etc.
  
  // Retry/error info
  retry_count?: number;
  max_retries?: number;       // From retry-limits.yaml
  retry_history?: Array<{     // Details of each retry attempt
    attempt: number;
    timestamp: Date;
    reason: string;
    score_before?: number;
    backoff_ms?: number;
  }>;
  errors?: string[];
}

/**
 * Complete generation report with all phases
 */
export interface GenerationReport {
  // Metadata
  project_id: string;
  run_id: string;
  generated_at: string;
  total_duration_ms: number;
  total_cost: number;
  
  // Aggregate scores
  overall_score: number;      // Average of all phase scores
  overall_grade: string;      // A, B, C, D, F
  passed: boolean;            // All phases passed thresholds
  
  // Phase breakdown
  phases: PhaseReport[];
  
  // Summary stats
  summary: {
    phases_passed: number;
    phases_failed: number;
    total_phases: number;
    pass_rate: number;        // percentage (as number, not string)
    weakest_phase: string;
    strongest_phase: string;
    retry_stats: {
      total_retries: number;
      phases_retried: number;
      retry_rate: string;
      retried_phases: Array<{
        agent: string;
        retry_count: number;
        max_retries: number;
      }>;
    };
    total_cost: number;
  };
  
  // Threshold config used
  threshold_config: ThresholdConfig;
}
