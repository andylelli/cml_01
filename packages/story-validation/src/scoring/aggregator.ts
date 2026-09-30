import {
  PhaseScore,
  PhaseReport,
  GenerationReport,
  ThresholdConfig,
  GenerationDiagnostic,
} from './types.js';
import { calculateGrade, passesThreshold } from './thresholds.js';
import { deriveRunOutcome } from './run-outcome.js';
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
 * The phase that scores the thing the pipeline exists to produce.
 *
 * Named once, because the headline cap below is meaningless if this drifts from the agent key the
 * orchestrator actually registers — a rename would silently restore the overselling it prevents.
 * The wiring test in `__tests__/aggregator-deliverable-cap.test.ts` pins the two together.
 */
const DELIVERABLE_PHASE_AGENT = 'agent9_prose';

/**
 * Aggregates phase scores into a complete generation report
 * Calculates overall scores, pass/fail status, and summary statistics
 */
export class ScoreAggregator {
  private phases: PhaseReport[] = [];
  private diagnostics: GenerationDiagnostic[] = [];
  private thresholdConfig: ThresholdConfig;
  private retryManager?: RetryManager;

  constructor(
    thresholdConfig: ThresholdConfig = { mode: 'standard' },
    retryManager?: RetryManager
  ) {
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
  /**
   * The phase report both add and upsert record: the decision from the one threshold resolver, the
   * score's `passed` normalised to it, retry bookkeeping. SCO-05: this was a 33-line clone in each method.
   *
   * SCO-D03: a scorer's own pass rule can be stricter or looser than the threshold (Agent 6.5 passes at
   * 70, the report bar is 75). When the threshold fails a score the scorer passed, the scorer wrote no
   * failure_reason, and the report showed a failed phase with none; it now says why.
   */
  private buildPhaseReport(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number,
    errors?: string[],
  ): PhaseReport {
    const threshold = this.getThresholdForAgent(agent);
    const passed = passesThreshold(score, this.thresholdConfig);
    const retryCount = this.retryManager?.getRetryCount(agent) || 0;
    const maxRetries = this.retryManager?.getMaxRetries(agent) || 0;
    const retryHistory = this.retryManager?.getRetryHistory(agent) || [];

    // Normalise score.passed to match the authoritative passesThreshold result
    // so score.passed and phase.passed always tell the same story in the report.
    const normalisedScore: PhaseScore =
      !passed && !score.failure_reason
        ? { ...score, passed, failure_reason: `Score ${score.total}/100 below the ${threshold} phase threshold` }
        : { ...score, passed };

    return {
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
  }

  addPhaseScore(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number = 0,
    errors?: string[]
  ): void {
    this.phases.push(this.buildPhaseReport(agent, phaseName, score, durationMs, cost, errors));
  }

  /**
   * Upsert a phase score — replaces an existing entry with the same agent key,
   * or appends if no entry exists yet. Use this for live-updating partial scores
   * (e.g. prose quality after each chapter) so the report always has exactly one
   * entry per agent rather than accumulating duplicates on retries.
   */
  upsertPhaseScore(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number = 0,
    errors?: string[]
  ): void {
    const report = this.buildPhaseReport(agent, phaseName, score, durationMs, cost, errors);
    const existingIndex = this.phases.findIndex(p => p.agent === agent);
    if (existingIndex >= 0) {
      this.phases[existingIndex] = report;
    } else {
      this.phases.push(report);
    }
  }

  /**
   * Check if a phase score passes the configured threshold.
   * Use this instead of score.passed in retry loops to ensure the retry
   * decision uses the same authoritative criteria as the final report.
   */
  passesThreshold(score: PhaseScore): boolean {
    return passesThreshold(score, this.thresholdConfig);
  }

  /**
   * Upsert a structured diagnostic snapshot by key.
   */
  upsertDiagnostic(
    key: string,
    agent: string,
    phaseName: string,
    diagnosticType: string,
    details: Record<string, unknown>,
  ): void {
    const diagnostic: GenerationDiagnostic = {
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
    } else {
      this.diagnostics.push(diagnostic);
    }
  }

  /**
   * Generate the complete generation report
   */
  generateReport(metadata: GenerationMetadata): GenerationReport {
    const completedAt = metadata.completed_at || new Date();
    const totalDuration = completedAt.getTime() - metadata.started_at.getTime();

    // Calculate overall score (average of phase totals)
    const phaseScores = this.phases.map((p) => p.score.total);
    const overallScore =
      phaseScores.length > 0
        ? phaseScores.reduce((sum, score) => sum + score, 0) / phaseScores.length
        : 0;


    // SCO-05: the outcome derivation lives in run-outcome.ts, a pure function of phases and diagnostics.
    const {
      phaseThresholdPassed, releaseGateDetails, releaseGateWarningCount, effectiveReleaseGateHardStopCount,
      releaseGateStatus, runOutcome, runOutcomeReason, normalizedDisplayStatus,
    } = deriveRunOutcome(this.phases, this.diagnostics);
    // Canonical report pass/fail now derives from run_outcome only.
    const passed = runOutcome === 'passed';

    /**
     * The headline cannot claim more than the DELIVERABLE earned.
     *
     * `overall_score` is the unweighted mean of every phase, and thirteen of the fourteen phases
     * score upstream artifacts — does the cast array exist, are there five locations — which sit at
     * or near 100 by construction. The manuscript is one fourteenth of its own report card, so a
     * prose phase of 60 moves the headline by under three points.
     *
     * MEASURED over the 15 archived reports carrying a prose phase (2026-08-20): every one of them
     * reports grade **A**, in a band of 93.4 to 97.4, while the prose phase underneath ranges 60 to
     * 100. Four runs were graded A with the prose phase at 60/D. `run_0a61b082` scored 95.64/A on a
     * manuscript that names no culprit — the string "killed" and the string "murdered" do not occur
     * in it — and whose reveal-repair had failed on the run's own console.
     *
     * That is not a mislabelled pass: `phase_thresholds_met` records the failure honestly and
     * `passed` has meant SHIPPED since A_65b Ph1.3. It is the SCORE that is wrong, because a number
     * dominated by whether an array exists cannot discriminate between books — internally the run
     * that read 86 externally scores 96.71 and the run that read 81 scores 97.29, in that order.
     *
     * Capping rather than reweighting, for two reasons. The pattern is already this function's
     * (aborted caps at 59, failed at 74), and the mean still has a real use — it is a PIPELINE
     * HEALTH signal and stays readable as one in `phases`. What changes is only that the headline
     * stops overselling: it is now the lower of the pipeline mean and the manuscript's own mark.
     *
     * Self-gating. A snapshot written before Agent 9 has no prose phase and is not capped, so this
     * cannot retroactively re-grade the in_progress partials A_71 exists to label.
     */
    const deliverablePhase = this.phases.find((p) => p.agent === DELIVERABLE_PHASE_AGENT);
    const deliverableScore =
      typeof deliverablePhase?.score?.total === 'number' ? deliverablePhase.score.total : null;

    const outcomeCappedScore =
      runOutcome === 'aborted'
        ? Math.min(overallScore, 59)
        : runOutcome === 'failed'
          ? Math.min(overallScore, 74)
          : overallScore;
    const adjustedOverallScore =
      deliverableScore === null ? outcomeCappedScore : Math.min(outcomeCappedScore, deliverableScore);
    const adjustedOverallGrade = calculateGrade(adjustedOverallScore);

    const releaseGateSummary =
      (releaseGateDetails['validation_summary'] as Record<string, unknown> | undefined) ??
      undefined;
    const parseIssueSnapshot = (summary?: Record<string, unknown>) => {
      if (!summary) return undefined;
      return {
        total: Number(summary['totalIssues'] ?? 0),
        critical: Number(summary['critical'] ?? 0),
        major: Number(summary['major'] ?? 0),
        moderate: Number(summary['moderate'] ?? 0),
        minor: Number(summary['minor'] ?? 0),
      };
    };

    const releaseGateSnapshots =
      (releaseGateDetails['validation_snapshots'] as Record<string, unknown> | undefined) ??
      undefined;
    const preRepairSnapshot = parseIssueSnapshot(
      releaseGateSnapshots?.['pre_repair'] as Record<string, unknown> | undefined
    );
    const postRepairSnapshot = parseIssueSnapshot(
      releaseGateSnapshots?.['post_repair'] as Record<string, unknown> | undefined
    );
    const releaseGateSnapshot =
      parseIssueSnapshot(
        releaseGateSnapshots?.['release_gate'] as Record<string, unknown> | undefined
      ) ?? parseIssueSnapshot(releaseGateSummary);

    const preRepairTotal = preRepairSnapshot?.total ?? releaseGateSnapshot?.total ?? 0;
    const releaseGateTotal = releaseGateSnapshot?.total ?? 0;
    const resolvedDelta = Math.max(0, preRepairTotal - releaseGateTotal);

    // Calculate summary statistics
    const phasesPassed = this.phases.filter((p) => p.passed).length;
    const phasesFailed = this.phases.filter((p) => !p.passed).length;
    const passRate =
      this.phases.length > 0
        ? parseFloat(((phasesPassed / this.phases.length) * 100).toFixed(1))
        : 0;

    // Find weakest and strongest phases (by phase_name for readability)
    const sortedPhases = [...this.phases].sort(
      (a, b) => a.score.total - b.score.total
    );
    const weakestPhase = sortedPhases[0]?.phase_name ?? sortedPhases[0]?.score.agent;
    const strongestPhase =
      sortedPhases[sortedPhases.length - 1]?.phase_name ??
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

    const normalizedStatusDiagnostic: GenerationDiagnostic = {
      key: 'normalized_run_status',
      agent: 'scoring',
      phase_name: 'Report',
      diagnostic_type: 'normalized_run_status',
      captured_at: completedAt.toISOString(),
      details: {
        display_status: normalizedDisplayStatus,
        discrepancies: [],
        warning_count: releaseGateWarningCount,
        hard_stop_count: effectiveReleaseGateHardStopCount,
      },
    };

    // Build failure reasons (for phases that failed)
    const failureReasons: string[] = this.phases
      .filter((p) => !p.passed)
      .map(
        (p) =>
          `${p.score.agent}: ${p.score.failure_reason || 'Score below threshold'}`
      );

    const report: GenerationReport = {
      project_id: metadata.user_id ?? metadata.story_id,
      run_id: metadata.story_id,
      generated_at: completedAt.toISOString(),
      total_duration_ms: totalDuration,
      total_cost: parseFloat(totalCost.toFixed(4)),
      overall_score: parseFloat(adjustedOverallScore.toFixed(2)),
      overall_grade: adjustedOverallGrade,
      passed,
      run_outcome: runOutcome,
      run_outcome_reason: runOutcomeReason,
      phase_thresholds_met: phaseThresholdPassed,
      scoring_outcome: {
        score: parseFloat(adjustedOverallScore.toFixed(2)),
        grade: adjustedOverallGrade,
        passed_threshold: runOutcome === 'passed',
      },
      release_gate_outcome: {
        status: releaseGateStatus,
        // A_71 — one derivation of SHIPPED, recorded on the artifact.
        //
        // A_70 §4 found the same run reading "shipped" through `run_outcome` and "not shipped"
        // through the gate status: scripts/canary-core.mjs re-derives P0.2 (`status ∈ {passed,
        // warning}`) for itself, and on an `unknown` gate that disagrees with the phase-driven
        // run_outcome fallback below. Two copies of a definition drift; one field cannot.
        // Consumers must read this rather than re-testing `status`.
        shipped: releaseGateStatus === 'passed' || releaseGateStatus === 'warning',
        hard_stop_count: effectiveReleaseGateHardStopCount,
        warning_count: releaseGateWarningCount,
      },
      phases: this.phases,
      diagnostics: [...this.diagnostics, normalizedStatusDiagnostic],
      validation_snapshots:
        preRepairSnapshot || postRepairSnapshot || releaseGateSnapshot
          ? {
              pre_repair: preRepairSnapshot,
              post_repair: postRepairSnapshot,
              release_gate: releaseGateSnapshot,
            }
          : undefined,
      validation_reconciliation:
        preRepairSnapshot || postRepairSnapshot || releaseGateSnapshot
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
  private getThresholdForAgent(agent: string): number {
    if (this.thresholdConfig.overrides?.[agent]) {
      return this.thresholdConfig.overrides[agent];
    }

    // Orchestrator agent ID → threshold (only non-default values need listing)
    const ORCHESTRATOR_THRESHOLDS: Record<string, number> = {
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
    if (mode === 'strict') return 85;
    if (mode === 'lenient') return 65;
    return 75; // standard
  }

  /**
   * Reset aggregator (for new generation)
   */
  reset(): void {
    this.phases = [];
    this.diagnostics = [];
  }

}
