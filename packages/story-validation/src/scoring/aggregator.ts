import {
  PhaseScore,
  PhaseReport,
  GenerationReport,
  ThresholdConfig,
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
 * Aggregates phase scores into a complete generation report
 * Calculates overall scores, pass/fail status, and summary statistics
 */
export class ScoreAggregator {
  private phases: PhaseReport[] = [];
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

    // Determine if all phases passed
    const passed = this.phases.every((p) => p.passed);

    // Calculate summary statistics
    const phasesPassed = this.phases.filter((p) => p.passed).length;
    const phasesFailed = this.phases.filter((p) => !p.passed).length;
    const passRate =
      this.phases.length > 0
        ? parseFloat(((phasesPassed / this.phases.length) * 100).toFixed(1))
        : 0;

    // Find weakest and strongest phases
    const sortedPhases = [...this.phases].sort(
      (a, b) => a.score.total - b.score.total
    );
    const weakestPhase = sortedPhases[0]?.score.agent;
    const strongestPhase = sortedPhases[sortedPhases.length - 1]?.score.agent;

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
      overall_score: parseFloat(overallScore.toFixed(2)),
      overall_grade: overallGrade,
      passed,
      phases: this.phases,
      summary: {
        phases_passed: phasesPassed,
        phases_failed: phasesFailed,
        total_phases: this.phases.length,
        pass_rate: passRate,
        weakest_phase: weakestPhase,
        strongest_phase: strongestPhase,
        retry_stats: retryStats,
        total_cost: parseFloat(totalCost.toFixed(4)),
      },
      threshold_config: this.thresholdConfig,
    };

    return report;
  }

  /**
   * Get threshold for a specific agent
   */
  private getThresholdForAgent(agent: string): number {
    // Check for agent-specific override
    if (
      this.thresholdConfig.overrides &&
      this.thresholdConfig.overrides[agent]
    ) {
      return this.thresholdConfig.overrides[agent];
    }

    // Use mode-based defaults
    const mode = this.thresholdConfig.mode;
    if (mode === 'strict') {
      return 85;
    } else if (mode === 'lenient') {
      return 65;
    } else {
      // Standard mode
      return 75;
    }
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
