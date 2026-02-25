/**
 * Scoring Logger
 * 
 * Logs scoring system events to scoring.jsonl for analysis and debugging.
 * Uses JSONL format (one JSON object per line) for easy parsing and streaming.
 */

import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import type { PhaseScore, GenerationReport } from "@cml/story-validation";

export interface ScoringLogEntry {
  timestamp: string;
  event_type: "phase_score" | "retry_attempt" | "scoring_error" | "report_generated";
  story_id?: string;
  user_id?: string;
  [key: string]: any; // Allow additional properties
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

export class ScoringLogger {
  private logFilePath: string;

  constructor(logDir?: string) {
    const baseDir = logDir || join(process.cwd(), "apps", "worker", "logs");
    
    // Ensure directory exists
    if (!existsSync(baseDir)) {
      mkdirSync(baseDir, { recursive: true });
    }

    this.logFilePath = join(baseDir, "scoring.jsonl");
  }

  /**
   * Log a phase score result
   */
  logPhaseScore(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number,
    storyId?: string,
    userId?: string
  ): void {
    const entry: PhaseScoreLogEntry = {
      timestamp: new Date().toISOString(),
      event_type: "phase_score",
      story_id: storyId,
      user_id: userId,
      agent,
      phase_name: phaseName,
      score: score.total,
      grade: score.grade,
      passed: score.passed,
      duration_ms: durationMs,
      cost,
      validation_score: score.validation_score,
      quality_score: score.quality_score,
      completeness_score: score.completeness_score,
      consistency_score: score.consistency_score,
      component_failures: score.component_failures,
      failure_reason: score.failure_reason,
    };

    this.writeLog(entry);
  }

  /**
   * Log a retry attempt
   */
  logRetryAttempt(
    agent: string,
    phaseName: string,
    attempt: number,
    reason: string,
    backoffMs: number,
    maxRetries: number,
    storyId?: string,
    userId?: string
  ): void {
    const entry: RetryAttemptLogEntry = {
      timestamp: new Date().toISOString(),
      event_type: "retry_attempt",
      story_id: storyId,
      user_id: userId,
      agent,
      phase_name: phaseName,
      attempt,
      reason,
      backoff_ms: backoffMs,
      max_retries: maxRetries,
    };

    this.writeLog(entry);
  }

  /**
   * Log a scoring error
   */
  logScoringError(
    agent: string,
    phaseName: string,
    error: Error | unknown,
    storyId?: string,
    userId?: string
  ): void {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;

    const entry: ScoringErrorLogEntry = {
      timestamp: new Date().toISOString(),
      event_type: "scoring_error",
      story_id: storyId,
      user_id: userId,
      agent,
      phase_name: phaseName,
      error_message: errorMessage,
      error_stack: errorStack,
    };

    this.writeLog(entry);
  }

  /**
   * Log report generation
   */
  logReportGenerated(
    report: GenerationReport,
    storyId?: string,
    userId?: string
  ): void {
    const passedCount = report.phases.filter(p => p.passed).length;
    const failedCount = report.phases.filter(p => !p.passed).length;
    const averageScore = report.overall_score || 0;

    const entry: ReportGeneratedLogEntry = {
      timestamp: new Date().toISOString(),
      event_type: "report_generated",
      story_id: storyId || report.project_id,
      user_id: userId || report.project_id,
      overall_grade: report.overall_grade,
      passed_count: passedCount,
      failed_count: failedCount,
      total_phases: report.phases.length,
      average_score: averageScore,
      duration_ms: report.total_duration_ms,
      total_cost: report.total_cost,
    };

    this.writeLog(entry);
  }

  /**
   * Write a log entry to the JSONL file
   */
  private writeLog(entry: ScoringLogEntry): void {
    try {
      const line = JSON.stringify(entry) + "\n";
      appendFileSync(this.logFilePath, line, "utf8");
    } catch (error) {
      // Fail silently - logging should not break the main flow
      console.error("Failed to write scoring log:", error);
    }
  }

  /**
   * Get the log file path
   */
  getLogFilePath(): string {
    return this.logFilePath;
  }
}
