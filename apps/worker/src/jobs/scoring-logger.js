/**
 * Scoring Logger
 *
 * Logs scoring system events to scoring.jsonl for analysis and debugging.
 * Uses JSONL format (one JSON object per line) for easy parsing and streaming.
 */
import { appendFileSync, existsSync, mkdirSync } from "fs";
import { join } from "path";
export class ScoringLogger {
    logFilePath;
    constructor(logDir) {
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
    logPhaseScore(agent, phaseName, score, durationMs, cost, storyId, userId) {
        const entry = {
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
    logRetryAttempt(agent, phaseName, attempt, reason, backoffMs, maxRetries, storyId, userId) {
        const entry = {
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
    logScoringError(agent, phaseName, error, storyId, userId) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        const errorStack = error instanceof Error ? error.stack : undefined;
        const entry = {
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
    logReportGenerated(report, storyId, userId) {
        const passedCount = report.phases.filter(p => p.passed).length;
        const failedCount = report.phases.filter(p => !p.passed).length;
        const averageScore = report.overall_score || 0;
        const entry = {
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
     * Log a structured phase diagnostic snapshot.
     */
    logPhaseDiagnostic(agent, phaseName, diagnosticType, details, storyId, userId) {
        const entry = {
            timestamp: new Date().toISOString(),
            event_type: "phase_diagnostic",
            story_id: storyId,
            user_id: userId,
            agent,
            phase_name: phaseName,
            diagnostic_type: diagnosticType,
            details,
        };
        this.writeLog(entry);
    }
    /**
     * Write a log entry to the JSONL file
     */
    writeLog(entry) {
        try {
            const line = JSON.stringify(entry) + "\n";
            appendFileSync(this.logFilePath, line, "utf8");
        }
        catch (error) {
            // Fail silently - logging should not break the main flow
            console.error("Failed to write scoring log:", error);
        }
    }
    /**
     * Get the log file path
     */
    getLogFilePath() {
        return this.logFilePath;
    }
}
//# sourceMappingURL=scoring-logger.js.map