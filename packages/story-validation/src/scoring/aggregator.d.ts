import { PhaseScore, PhaseReport, GenerationReport, ThresholdConfig } from './types.js';
import { RetryManager } from './retry-manager.js';
/**
 * Metadata about the generation attempt
 */
export interface GenerationMetadata {
    story_id: string;
    started_at: Date;
    completed_at?: Date;
    user_id?: string;
    seed_mystery?: string;
}
/**
 * Aggregates phase scores into a complete generation report
 * Calculates overall scores, pass/fail status, and summary statistics
 */
export declare class ScoreAggregator {
    private phases;
    private diagnostics;
    private thresholdConfig;
    private retryManager?;
    constructor(thresholdConfig?: ThresholdConfig, retryManager?: RetryManager);
    /**
     * Add a phase score to the aggregation
     * @param agent - Agent identifier (e.g., 'agent4-hard-logic')
     * @param phaseName - Human-readable phase name (e.g., 'Hard Logic Devices')
     * @param score - The phase score
     * @param durationMs - Time taken for this phase
     * @param cost - Cost of this phase (LLM tokens, etc.)
     * @param errors - Any errors encountered
     */
    addPhaseScore(agent: string, phaseName: string, score: PhaseScore, durationMs: number, cost?: number, errors?: string[]): void;
    /**
     * Upsert a phase score — replaces an existing entry with the same agent key,
     * or appends if no entry exists yet. Use this for live-updating partial scores
     * (e.g. prose quality after each chapter) so the report always has exactly one
     * entry per agent rather than accumulating duplicates on retries.
     */
    upsertPhaseScore(agent: string, phaseName: string, score: PhaseScore, durationMs: number, cost?: number, errors?: string[]): void;
    /**
     * Check if a phase score passes the configured threshold.
     * Use this instead of score.passed in retry loops to ensure the retry
     * decision uses the same authoritative criteria as the final report.
     */
    passesThreshold(score: PhaseScore): boolean;
    /**
     * Upsert a structured diagnostic snapshot by key.
     */
    upsertDiagnostic(key: string, agent: string, phaseName: string, diagnosticType: string, details: Record<string, unknown>): void;
    /**
     * Generate the complete generation report
     */
    generateReport(metadata: GenerationMetadata): GenerationReport;
    /**
     * Get threshold for a specific agent (keyed by orchestrator agent ID, e.g. 'agent3b_hard_logic_devices').
     * Mirrors DEFAULT_THRESHOLDS but uses the orchestrator's underscore naming convention.
     */
    private getThresholdForAgent;
    /**
     * Get current phases (useful for debugging)
     */
    getPhases(): PhaseReport[];
    /**
     * Reset aggregator (for new generation)
     */
    reset(): void;
    /**
     * Get phase count
     */
    getPhaseCount(): number;
    /**
     * Check if any phases have failed
     */
    hasFailures(): boolean;
    /**
     * Get failed phases
     */
    getFailedPhases(): PhaseReport[];
    /**
     * Get current overall score (before final report generation)
     */
    getCurrentOverallScore(): number;
}
