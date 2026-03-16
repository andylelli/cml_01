/**
 * Scoring Logger
 *
 * Logs scoring system events to scoring.jsonl for analysis and debugging.
 * Uses JSONL format (one JSON object per line) for easy parsing and streaming.
 */
import type { PhaseScore, GenerationReport } from "@cml/story-validation";
export interface ScoringLogEntry {
    timestamp: string;
    event_type: "phase_score" | "retry_attempt" | "scoring_error" | "report_generated" | "phase_diagnostic";
    story_id?: string;
    user_id?: string;
    [key: string]: any;
}
export interface PhaseScoreLogEntry extends ScoringLogEntry {
    event_type: "phase_score";
    agent: string;
    phase_name: string;
    score: number;
    grade: string;
    passed: boolean;
    duration_ms: number;
    cost: number;
    validation_score: number;
    quality_score: number;
    completeness_score: number;
    consistency_score: number;
    component_failures?: string[];
    failure_reason?: string;
}
export interface RetryAttemptLogEntry extends ScoringLogEntry {
    event_type: "retry_attempt";
    agent: string;
    phase_name: string;
    attempt: number;
    reason: string;
    backoff_ms: number;
    max_retries: number;
}
export interface ScoringErrorLogEntry extends ScoringLogEntry {
    event_type: "scoring_error";
    agent: string;
    phase_name: string;
    error_message: string;
    error_stack?: string;
}
export interface ReportGeneratedLogEntry extends ScoringLogEntry {
    event_type: "report_generated";
    overall_grade: string;
    passed_count: number;
    failed_count: number;
    total_phases: number;
    average_score: number;
    duration_ms: number;
    total_cost: number;
}
export interface PhaseDiagnosticLogEntry extends ScoringLogEntry {
    event_type: "phase_diagnostic";
    agent: string;
    phase_name: string;
    diagnostic_type: string;
    details: Record<string, unknown>;
}
export declare class ScoringLogger {
    private logFilePath;
    constructor(logDir?: string);
    /**
     * Log a phase score result
     */
    logPhaseScore(agent: string, phaseName: string, score: PhaseScore, durationMs: number, cost: number, storyId?: string, userId?: string): void;
    /**
     * Log a retry attempt
     */
    logRetryAttempt(agent: string, phaseName: string, attempt: number, reason: string, backoffMs: number, maxRetries: number, storyId?: string, userId?: string): void;
    /**
     * Log a scoring error
     */
    logScoringError(agent: string, phaseName: string, error: Error | unknown, storyId?: string, userId?: string): void;
    /**
     * Log report generation
     */
    logReportGenerated(report: GenerationReport, storyId?: string, userId?: string): void;
    /**
     * Log a structured phase diagnostic snapshot.
     */
    logPhaseDiagnostic(agent: string, phaseName: string, diagnosticType: string, details: Record<string, unknown>, storyId?: string, userId?: string): void;
    /**
     * Write a log entry to the JSONL file
     */
    private writeLog;
    /**
     * Get the log file path
     */
    getLogFilePath(): string;
}
