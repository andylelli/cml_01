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
    score: number;
    weight: number;
    message?: string;
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
    component_failures?: string[];
    failure_reason?: string;
}
/**
 * Context provided to scorers for evaluation
 */
export interface ScoringContext {
    previous_phases: Record<string, any>;
    cml: CMLData;
    threshold_config: ThresholdConfig;
    targetLength?: 'short' | 'medium' | 'long';
    /**
     * Set to true when scoring an in-progress prose generation (e.g. inside onBatchComplete).
     * Suppresses whole-story completeness checks (chapter count, total word count) that are
     * meaningless until all chapters have been written.
     */
    partialGeneration?: boolean;
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
    phase_name: string;
    score: PhaseScore;
    duration_ms: number;
    cost: number;
    threshold: number;
    passed: boolean;
    tests: TestResult[];
    breakdown?: any;
    retry_count?: number;
    max_retries?: number;
    retry_history?: Array<{
        attempt: number;
        timestamp: Date;
        reason: string;
        score_before?: number;
        backoff_ms?: number;
    }>;
    errors?: string[];
}
/**
 * Structured diagnostic snapshot attached to a generation report.
 */
export interface GenerationDiagnostic {
    key: string;
    agent: string;
    phase_name: string;
    diagnostic_type: string;
    captured_at: string;
    details: Record<string, unknown>;
}
export type RunOutcome = 'passed' | 'failed' | 'aborted';
export interface ValidationIssueSnapshotSummary {
    total: number;
    critical: number;
    major: number;
    moderate: number;
    minor: number;
}
/**
 * Complete generation report with all phases
 */
export interface GenerationReport {
    project_id: string;
    run_id: string;
    generated_at: string;
    total_duration_ms: number;
    total_cost: number;
    overall_score: number;
    overall_grade: string;
    passed: boolean;
    run_outcome?: RunOutcome;
    run_outcome_reason?: string;
    scoring_outcome?: {
        score: number;
        grade: string;
        passed_threshold: boolean;
    };
    release_gate_outcome?: {
        status: 'passed' | 'failed' | 'unknown';
        hard_stop_count: number;
        warning_count: number;
    };
    phases: PhaseReport[];
    diagnostics?: GenerationDiagnostic[];
    validation_snapshots?: {
        pre_repair?: ValidationIssueSnapshotSummary;
        post_repair?: ValidationIssueSnapshotSummary;
        release_gate?: ValidationIssueSnapshotSummary;
    };
    validation_reconciliation?: {
        pre_total: number;
        release_gate_total: number;
        resolved_delta: number;
    };
    summary: {
        phases_passed: number;
        phases_failed: number;
        total_phases: number;
        pass_rate: number;
        weakest_phase: string;
        strongest_phase: string;
        failure_reasons?: string[];
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
    threshold_config: ThresholdConfig;
}
