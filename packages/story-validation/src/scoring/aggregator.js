import { calculateGrade, passesThreshold } from './thresholds.js';
/**
 * Aggregates phase scores into a complete generation report
 * Calculates overall scores, pass/fail status, and summary statistics
 */
export class ScoreAggregator {
    phases = [];
    diagnostics = [];
    thresholdConfig;
    retryManager;
    constructor(thresholdConfig = { mode: 'standard' }, retryManager) {
        this.thresholdConfig = thresholdConfig;
        this.retryManager = retryManager;
    }
    /**
     * Add a phase score to the aggregation
     * @param agent - Agent identifier (e.g., 'agent4-hard-logic')
     * @param phaseName - Human-readable phase name (e.g., 'Hard Logic Devices')
     * @param score - The phase score
     * @param durationMs - Time taken for this phase
     * @param cost - Cost of this phase (LLM tokens, etc.)
     * @param errors - Any errors encountered
     */
    addPhaseScore(agent, phaseName, score, durationMs, cost = 0, errors) {
        const threshold = this.getThresholdForAgent(agent);
        const passed = passesThreshold(score, this.thresholdConfig);
        const retryCount = this.retryManager?.getRetryCount(agent) || 0;
        const maxRetries = this.retryManager?.getMaxRetries(agent) || 0;
        const retryHistory = this.retryManager?.getRetryHistory(agent) || [];
        // Normalise score.passed to match the authoritative passesThreshold result
        // so score.passed and phase.passed always tell the same story in the report.
        const normalisedScore = { ...score, passed };
        const report = {
            agent,
            phase_name: phaseName,
            score: normalisedScore,
            duration_ms: durationMs,
            cost,
            threshold,
            passed,
            tests: normalisedScore.tests,
            retry_count: retryCount > 0 ? retryCount : undefined,
            max_retries: retryCount > 0 ? maxRetries : undefined,
            retry_history: retryHistory.length > 0 ? retryHistory : undefined,
            errors: errors && errors.length > 0 ? errors : undefined,
        };
        this.phases.push(report);
    }
    /**
     * Upsert a phase score — replaces an existing entry with the same agent key,
     * or appends if no entry exists yet. Use this for live-updating partial scores
     * (e.g. prose quality after each chapter) so the report always has exactly one
     * entry per agent rather than accumulating duplicates on retries.
     */
    upsertPhaseScore(agent, phaseName, score, durationMs, cost = 0, errors) {
        const threshold = this.getThresholdForAgent(agent);
        const passed = passesThreshold(score, this.thresholdConfig);
        const retryCount = this.retryManager?.getRetryCount(agent) || 0;
        const maxRetries = this.retryManager?.getMaxRetries(agent) || 0;
        const retryHistory = this.retryManager?.getRetryHistory(agent) || [];
        const normalisedScore = { ...score, passed };
        const report = {
            agent,
            phase_name: phaseName,
            score: normalisedScore,
            duration_ms: durationMs,
            cost,
            threshold,
            passed,
            tests: normalisedScore.tests,
            retry_count: retryCount > 0 ? retryCount : undefined,
            max_retries: retryCount > 0 ? maxRetries : undefined,
            retry_history: retryHistory.length > 0 ? retryHistory : undefined,
            errors: errors && errors.length > 0 ? errors : undefined,
        };
        const existingIndex = this.phases.findIndex(p => p.agent === agent);
        if (existingIndex >= 0) {
            this.phases[existingIndex] = report;
        }
        else {
            this.phases.push(report);
        }
    }
    /**
     * Check if a phase score passes the configured threshold.
     * Use this instead of score.passed in retry loops to ensure the retry
     * decision uses the same authoritative criteria as the final report.
     */
    passesThreshold(score) {
        return passesThreshold(score, this.thresholdConfig);
    }
    /**
     * Upsert a structured diagnostic snapshot by key.
     */
    upsertDiagnostic(key, agent, phaseName, diagnosticType, details) {
        const diagnostic = {
            key,
            agent,
            phase_name: phaseName,
            diagnostic_type: diagnosticType,
            captured_at: new Date().toISOString(),
            details,
        };
        const existingIndex = this.diagnostics.findIndex((d) => d.key === key);
        if (existingIndex >= 0) {
            this.diagnostics[existingIndex] = diagnostic;
        }
        else {
            this.diagnostics.push(diagnostic);
        }
    }
    /**
     * Generate the complete generation report
     */
    generateReport(metadata) {
        const completedAt = metadata.completed_at || new Date();
        const totalDuration = completedAt.getTime() - metadata.started_at.getTime();
        // Calculate overall score (average of phase totals)
        const phaseScores = this.phases.map((p) => p.score.total);
        const overallScore = phaseScores.length > 0
            ? phaseScores.reduce((sum, score) => sum + score, 0) / phaseScores.length
            : 0;
        const overallGrade = calculateGrade(overallScore);
        // Determine if all phases passed
        const passed = this.phases.every((p) => p.passed);
        const releaseGateDiagnostic = this.diagnostics.find((d) => d.diagnostic_type === 'release_gate_summary');
        const releaseGateDetails = releaseGateDiagnostic?.details ?? {};
        const releaseGateStatusRaw = releaseGateDetails['validation_status'];
        const releaseGateStatus = releaseGateStatusRaw === 'passed' || releaseGateStatusRaw === 'failed'
            ? releaseGateStatusRaw
            : 'unknown';
        const releaseGateHardStopCount = Number(releaseGateDetails['release_gate_hard_stop_count'] ?? 0);
        const releaseGateWarningCount = Number(releaseGateDetails['release_gate_warning_count'] ?? 0);
        const runOutcome = releaseGateHardStopCount > 0
            ? 'aborted'
            : passed
                ? 'passed'
                : 'failed';
        const runOutcomeReason = runOutcome === 'aborted'
            ? 'Release gate hard-stop'
            : runOutcome === 'failed'
                ? 'One or more phases failed threshold'
                : undefined;
        const releaseGateSummary = releaseGateDetails['validation_summary'] ??
            undefined;
        const parseIssueSnapshot = (summary) => {
            if (!summary)
                return undefined;
            return {
                total: Number(summary['totalIssues'] ?? 0),
                critical: Number(summary['critical'] ?? 0),
                major: Number(summary['major'] ?? 0),
                moderate: Number(summary['moderate'] ?? 0),
                minor: Number(summary['minor'] ?? 0),
            };
        };
        const releaseGateSnapshots = releaseGateDetails['validation_snapshots'] ??
            undefined;
        const preRepairSnapshot = parseIssueSnapshot(releaseGateSnapshots?.['pre_repair']);
        const postRepairSnapshot = parseIssueSnapshot(releaseGateSnapshots?.['post_repair']);
        const releaseGateSnapshot = parseIssueSnapshot(releaseGateSnapshots?.['release_gate']) ?? parseIssueSnapshot(releaseGateSummary);
        const preRepairTotal = preRepairSnapshot?.total ?? releaseGateSnapshot?.total ?? 0;
        const releaseGateTotal = releaseGateSnapshot?.total ?? 0;
        const resolvedDelta = Math.max(0, preRepairTotal - releaseGateTotal);
        // Calculate summary statistics
        const phasesPassed = this.phases.filter((p) => p.passed).length;
        const phasesFailed = this.phases.filter((p) => !p.passed).length;
        const passRate = this.phases.length > 0
            ? parseFloat(((phasesPassed / this.phases.length) * 100).toFixed(1))
            : 0;
        // Find weakest and strongest phases (by phase_name for readability)
        const sortedPhases = [...this.phases].sort((a, b) => a.score.total - b.score.total);
        const weakestPhase = sortedPhases[0]?.phase_name ?? sortedPhases[0]?.score.agent;
        const strongestPhase = sortedPhases[sortedPhases.length - 1]?.phase_name ??
            sortedPhases[sortedPhases.length - 1]?.score.agent;
        // Calculate retry statistics
        const retryStats = this.retryManager?.getRetryStats() || {
            total_retries: 0,
            phases_retried: 0,
            retry_rate: '0.00',
            retried_phases: [],
        };
        // Calculate total cost
        const totalCost = this.phases.reduce((sum, p) => sum + p.cost, 0);
        // Build failure reasons (for phases that failed)
        const failureReasons = this.phases
            .filter((p) => !p.passed)
            .map((p) => `${p.score.agent}: ${p.score.failure_reason || 'Score below threshold'}`);
        const report = {
            project_id: metadata.user_id ?? metadata.story_id,
            run_id: metadata.story_id,
            generated_at: completedAt.toISOString(),
            total_duration_ms: totalDuration,
            total_cost: parseFloat(totalCost.toFixed(4)),
            overall_score: parseFloat(overallScore.toFixed(2)),
            overall_grade: overallGrade,
            passed,
            run_outcome: runOutcome,
            run_outcome_reason: runOutcomeReason,
            scoring_outcome: {
                score: parseFloat(overallScore.toFixed(2)),
                grade: overallGrade,
                passed_threshold: passed,
            },
            release_gate_outcome: {
                status: releaseGateStatus,
                hard_stop_count: releaseGateHardStopCount,
                warning_count: releaseGateWarningCount,
            },
            phases: this.phases,
            diagnostics: this.diagnostics.length > 0 ? [...this.diagnostics] : undefined,
            validation_snapshots: preRepairSnapshot || postRepairSnapshot || releaseGateSnapshot
                ? {
                    pre_repair: preRepairSnapshot,
                    post_repair: postRepairSnapshot,
                    release_gate: releaseGateSnapshot,
                }
                : undefined,
            validation_reconciliation: preRepairSnapshot || postRepairSnapshot || releaseGateSnapshot
                ? {
                    pre_total: preRepairTotal,
                    release_gate_total: releaseGateTotal,
                    resolved_delta: resolvedDelta,
                }
                : undefined,
            summary: {
                phases_passed: phasesPassed,
                phases_failed: phasesFailed,
                total_phases: this.phases.length,
                pass_rate: passRate,
                weakest_phase: weakestPhase,
                strongest_phase: strongestPhase,
                failure_reasons: failureReasons.length > 0 ? failureReasons : undefined,
                retry_stats: retryStats,
                total_cost: parseFloat(totalCost.toFixed(4)),
            },
            threshold_config: this.thresholdConfig,
        };
        return report;
    }
    /**
     * Get threshold for a specific agent (keyed by orchestrator agent ID, e.g. 'agent3b_hard_logic_devices').
     * Mirrors DEFAULT_THRESHOLDS but uses the orchestrator's underscore naming convention.
     */
    getThresholdForAgent(agent) {
        if (this.thresholdConfig.overrides?.[agent]) {
            return this.thresholdConfig.overrides[agent];
        }
        // Orchestrator agent ID → threshold (only non-default values need listing)
        const ORCHESTRATOR_THRESHOLDS = {
            'agent3b_hard_logic_devices': 85,
            'agent9_prose': 80,
            'agent2d_temporal_context': 70,
            'agent2e_background_context': 70,
        };
        if (ORCHESTRATOR_THRESHOLDS[agent] !== undefined) {
            return ORCHESTRATOR_THRESHOLDS[agent];
        }
        // Mode-based floor for everything else
        const mode = this.thresholdConfig.mode;
        if (mode === 'strict')
            return 85;
        if (mode === 'lenient')
            return 65;
        return 75; // standard
    }
    /**
     * Get current phases (useful for debugging)
     */
    getPhases() {
        return [...this.phases];
    }
    /**
     * Reset aggregator (for new generation)
     */
    reset() {
        this.phases = [];
        this.diagnostics = [];
    }
    /**
     * Get phase count
     */
    getPhaseCount() {
        return this.phases.length;
    }
    /**
     * Check if any phases have failed
     */
    hasFailures() {
        return this.phases.some((p) => !p.passed);
    }
    /**
     * Get failed phases
     */
    getFailedPhases() {
        return this.phases.filter((p) => !p.passed);
    }
    /**
     * Get current overall score (before final report generation)
     */
    getCurrentOverallScore() {
        if (this.phases.length === 0)
            return 0;
        const sum = this.phases.reduce((acc, p) => acc + p.score.total, 0);
        return sum / this.phases.length;
    }
}
//# sourceMappingURL=aggregator.js.map