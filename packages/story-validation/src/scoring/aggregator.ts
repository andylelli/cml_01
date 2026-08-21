import {
  PhaseScore,
  PhaseReport,
  GenerationReport,
  ThresholdConfig,
  GenerationDiagnostic,
} from './types.js';
import { calculateGrade, passesThreshold } from './thresholds.js';
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
  addPhaseScore(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number = 0,
    errors?: string[]
  ): void {
    const threshold = this.getThresholdForAgent(agent);
    const passed = passesThreshold(score, this.thresholdConfig);
    const retryCount = this.retryManager?.getRetryCount(agent) || 0;
    const maxRetries = this.retryManager?.getMaxRetries(agent) || 0;
    const retryHistory = this.retryManager?.getRetryHistory(agent) || [];

    // Normalise score.passed to match the authoritative passesThreshold result
    // so score.passed and phase.passed always tell the same story in the report.
    const normalisedScore: PhaseScore = { ...score, passed };

    const report: PhaseReport = {
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
  upsertPhaseScore(
    agent: string,
    phaseName: string,
    score: PhaseScore,
    durationMs: number,
    cost: number = 0,
    errors?: string[]
  ): void {
    const threshold = this.getThresholdForAgent(agent);
    const passed = passesThreshold(score, this.thresholdConfig);
    const retryCount = this.retryManager?.getRetryCount(agent) || 0;
    const maxRetries = this.retryManager?.getMaxRetries(agent) || 0;
    const retryHistory = this.retryManager?.getRetryHistory(agent) || [];

    const normalisedScore: PhaseScore = { ...score, passed };

    const report: PhaseReport = {
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

    const overallGrade = calculateGrade(overallScore);

    // Determine if all phases passed threshold. This is not the final run status,
    // because release-gate hard stops can still force failed/aborted outcomes.
    const phaseThresholdPassed = this.phases.every((p) => p.passed);

    const releaseGateDiagnostic = this.diagnostics.find(
      (d) => d.diagnostic_type === 'release_gate_summary'
    );
    const releaseGateDetails =
      (releaseGateDiagnostic?.details as Record<string, unknown> | undefined) ?? {};
    const releaseGateStatusRaw = releaseGateDetails['validation_status'];
    const releaseGateHardStopCount = Number(
      releaseGateDetails['release_gate_hard_stop_count'] ?? 0
    );
    const releaseGateWarningCount = Number(
      releaseGateDetails['release_gate_warning_count'] ?? 0
    );

    const inferredDeterministicHardGateFailure = this.phases.some((phase) => {
      const failureReason = String(phase.score.failure_reason ?? '').toLowerCase();
      const phaseErrors = Array.isArray(phase.errors)
        ? phase.errors.join(' ').toLowerCase()
        : '';
      return (
        phase.passed === false &&
        (/gate failed|hard gate|hard-stop|hard stop/.test(failureReason) ||
          /gate failed|hard gate|hard-stop|hard stop/.test(phaseErrors))
      );
    });

    const infraSignalPattern =
      /(\[infra[_\-\s]?precheck\]|infra[_\-\s]?failure|enotfound|eai_again|dns\s+resolution\s+failed|azure\s+endpoint\s+dns|etimedout|econnreset|socket\s+hang\s+up)/i;
    const inferredInfraFailure = this.phases.some((phase) => {
      const failureReason = String(phase.score.failure_reason ?? '');
      const phaseErrors = Array.isArray(phase.errors)
        ? phase.errors.join(' ')
        : '';
      return infraSignalPattern.test(failureReason) || infraSignalPattern.test(phaseErrors);
    }) || this.diagnostics.some((diagnostic) => {
      const payload = [
        diagnostic.key,
        diagnostic.diagnostic_type,
        JSON.stringify(diagnostic.details ?? {}),
      ].join(' ');
      return infraSignalPattern.test(payload);
    });

    const effectiveReleaseGateHardStopCount = Math.max(
      releaseGateHardStopCount,
      inferredDeterministicHardGateFailure ? 1 : 0,
    );

    const effectiveReleaseGateStatusRaw =
      releaseGateStatusRaw === 'passed' || releaseGateStatusRaw === 'failed'
        ? releaseGateStatusRaw
        : inferredDeterministicHardGateFailure
          ? 'failed'
          : releaseGateStatusRaw;
    // A hard stop ALWAYS fails the gate. `validation_status` is the story-validation pipeline's
    // verdict, not the gate's — run a3c2973f validated clean (0 issues) yet hard-stopped on NSD
    // clue visibility, and trusting the raw field verbatim produced the contradictory surface
    // `release_gate_outcome: { status: "passed", hard_stop_count: 1 }` on an aborted run.
    // Ledger P0.2 (run f90e5f09): warnings WITHOUT a hard stop are a SHIPPED needs-review gate
    // ('warning'), not 'failed' — the story exists and was scored; run_outcome stays phase-driven.
    const releaseGateStatus: 'passed' | 'warning' | 'failed' | 'unknown' =
      effectiveReleaseGateHardStopCount > 0
        ? 'failed'
        : effectiveReleaseGateStatusRaw === 'passed' || effectiveReleaseGateStatusRaw === 'failed'
          ? effectiveReleaseGateStatusRaw
          : releaseGateWarningCount > 0
            ? 'warning'
            : this.diagnostics.some((d) => d.diagnostic_type === 'release_gate_summary')
              ? 'passed'
              : 'unknown';

    // A_65b Ph1.3 (reliability plan) — run_outcome derives from the P0.2 definition: the release
    // gate ∈ {passed, warning} means the story SHIPPED ⇒ 'passed'. The old phase-threshold branch
    // stamped 'failed' on 21 shipped runs (the M1v2-2 artifact) and every corpus scan had to know
    // that folklore to read outcomes correctly. Phase thresholds are demoted to their own field
    // (`phase_thresholds_met`) — an advisory quality signal, never a run-failure signal. The
    // unknown-gate fallback stays phase-driven (no gate evidence → the old conservative read).
    const runOutcome: GenerationReport['run_outcome'] =
      inferredInfraFailure
        ? 'infra_failure'
        : effectiveReleaseGateHardStopCount > 0
        ? 'aborted'
        : releaseGateStatus === 'failed'
          ? 'failed'
        : releaseGateStatus === 'passed' || releaseGateStatus === 'warning'
          ? 'passed'
        : phaseThresholdPassed
          ? 'passed'
          : 'failed';

    // Canonical report pass/fail now derives from run_outcome only.
    const passed = runOutcome === 'passed';

    const runOutcomeReason =
      runOutcome === 'infra_failure'
        ? 'Infrastructure failure (DNS/connectivity)'
        : runOutcome === 'aborted'
        ? inferredDeterministicHardGateFailure
          ? 'Deterministic hard gate failure'
          : 'Release gate hard-stop'
        : runOutcome === 'failed' && releaseGateStatus === 'failed'
          ? 'Release gate failed'
        : runOutcome === 'failed'
          ? 'One or more phases failed threshold'
        // A_71 — say so when 'passed' came from the phase-threshold fallback rather than from a
        // scored gate. `unknown` means no gate evidence was recorded at all, so this run is NOT
        // shipped by the P0.2 definition even though the outcome reads 'passed'; leaving the
        // reason blank is what made the two readings look like a contradiction rather than a
        // documented fallback (A_70 §4).
        : runOutcome === 'passed' && releaseGateStatus === 'unknown'
          ? 'Phase thresholds met; no release-gate evidence recorded (ship status unconfirmed)'
          : undefined;

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

    const normalizedDisplayStatus =
      runOutcome === 'aborted' || runOutcome === 'infra_failure'
        ? runOutcome
        : effectiveReleaseGateHardStopCount > 0 || releaseGateStatus === 'failed' && releaseGateWarningCount === 0
          ? 'failed'
          : releaseGateWarningCount > 0
            ? 'warning'
            : runOutcome;
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
   * Get current phases (useful for debugging)
   */
  getPhases(): PhaseReport[] {
    return [...this.phases];
  }

  /**
   * Reset aggregator (for new generation)
   */
  reset(): void {
    this.phases = [];
    this.diagnostics = [];
  }

  /**
   * Get phase count
   */
  getPhaseCount(): number {
    return this.phases.length;
  }

  /**
   * Check if any phases have failed
   */
  hasFailures(): boolean {
    return this.phases.some((p) => !p.passed);
  }

  /**
   * Get failed phases
   */
  getFailedPhases(): PhaseReport[] {
    return this.phases.filter((p) => !p.passed);
  }

  /**
   * Get current overall score (before final report generation)
   */
  getCurrentOverallScore(): number {
    if (this.phases.length === 0) return 0;
    const sum = this.phases.reduce((acc, p) => acc + p.score.total, 0);
    return sum / this.phases.length;
  }
}
