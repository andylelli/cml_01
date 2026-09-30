/**
 * An aborted run: the per-chapter prose summaries, the partial report and its failure metadata. Runs in
 * generateMystery's catch, where ctx may not exist yet — so it takes the orchestrator's own bindings. Moved
 * from generateMystery (code review ORC-01 / CR-25).
 */
import {
  ScoreAggregator,
  FileReportRepository,
} from "@cml/story-validation";
import type { PhaseScore } from "@cml/story-validation";
import { ScoringLogger } from "../scoring-logger.js";
import {
  applyAbortedRunMetadata,
  type ProseScoringSnapshot,
} from "../agents/index.js";
import type { MysteryGenerationInputs } from "../run-contract.js";

export async function recordAbortedRun(enableScoring: boolean, scoreAggregator: ScoreAggregator | undefined, scoringLogger: ScoringLogger | undefined, proseScoringSnapshot: ProseScoringSnapshot, agentDurations: Record<string, number>, templateLinterAbortDetected: boolean, errorMessage: string, agentCosts: Record<string, number>, inputs: MysteryGenerationInputs, error: unknown, runId: string, projectId: string | undefined, reportRepository: FileReportRepository | undefined, startTime: number) {
  if (enableScoring &&
    scoreAggregator &&
    scoringLogger &&
    proseScoringSnapshot.startedAtMs !== null &&
    proseScoringSnapshot.chaptersGenerated > 0 &&
    !proseScoringSnapshot.postGenerationSummaryLogged) {
    const canonicalProseElapsedMs = typeof agentDurations["agent9_prose"] === "number" && agentDurations["agent9_prose"] > 0
      ? agentDurations["agent9_prose"]
      : Date.now() - proseScoringSnapshot.startedAtMs;
    const templateLinterFailedChecks = templateLinterAbortDetected ? 1 : 0;
    const templateLinterEntropyFailures = /opening-style entropy/i.test(errorMessage) ? 1 : 0;

    const abortedProseSummary: Record<string, unknown> = {
      fair_play_all_clues_visible: null,
      fair_play_discriminating_test_complete: null,
      fair_play_no_solution_spoilers: null,
      fair_play_component_score: null,
      template_linter_checks_run: 0,
      template_linter_failed_checks: templateLinterFailedChecks,
      template_linter_opening_style_entropy_failures: templateLinterEntropyFailures,
      template_linter_opening_style_entropy_bypasses: 0,
      template_linter_paragraph_fingerprint_failures: 0,
      template_linter_ngram_overlap_failures: 0,
      score_total: proseScoringSnapshot.latestCumulativeScore,
      score_grade: null,
      score_passed_threshold: false,
      component_failures: ["prose_generation_aborted"],
      failure_reason: errorMessage,
      chapters_generated: proseScoringSnapshot.chaptersGenerated,
      prose_duration_ms_first_pass: canonicalProseElapsedMs,
      prose_duration_ms_total: canonicalProseElapsedMs,
      prose_cost_first_pass: agentCosts["agent9_prose"] ?? 0,
      prose_cost_total: agentCosts["agent9_prose"] ?? 0,
      rewrite_pass_count: 0,
      repair_pass_count: 0,
      per_pass_accounting: [],
      metrics_snapshot: "aborted_partial",
      batch_size: inputs.proseBatchSize ?? 1,
      batches_with_retries: (error as any).retriedBatches ?? 0,
      total_batches: 0,
      batch_failure_events: 0,
      batch_failure_history: [],
      batch_failure_samples: [],
      outline_coverage_issue_count: null,
      critical_clue_coverage_gap: null,
      nsd_transfer_steps: 0,
      nsd_transfer_trace: [],
      aborted_after_chapter: proseScoringSnapshot.chaptersGenerated,
    };

    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      abortedProseSummary,
      runId,
      projectId || ""
    );

    scoreAggregator.upsertDiagnostic(
      "agent9_prose_post_generation_summary",
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      abortedProseSummary
    );
  }

  // Prose started but 0 chapters completed (e.g. chapter 1 failed all retries).
  // Register a failed prose phase so it always appears in the quality tab.
  if (enableScoring &&
    scoreAggregator &&
    scoringLogger &&
    proseScoringSnapshot.startedAtMs !== null &&
    proseScoringSnapshot.chaptersGenerated === 0) {
    const elapsedMs = typeof agentDurations["agent9_prose"] === "number" && agentDurations["agent9_prose"] > 0
      ? agentDurations["agent9_prose"]
      : Date.now() - proseScoringSnapshot.startedAtMs;
    const zeroedProseScore: PhaseScore = {
      agent: "agent9-prose",
      validation_score: 0,
      quality_score: 0,
      completeness_score: 0,
      consistency_score: 0,
      total: 0,
      grade: "F",
      passed: false,
      tests: [],
      component_failures: ["prose_generation_aborted"],
      failure_reason: `Prose aborted before any chapter completed: ${errorMessage.slice(0, 240)}`,
    };
    scoreAggregator.upsertPhaseScore(
      "agent9_prose",
      "Prose Generation",
      zeroedProseScore,
      elapsedMs,
      agentCosts["agent9_prose"] ?? 0
    );

    // Register a minimal post_generation_summary diagnostic to satisfy the E1
    // report invariant (agent9_prose phase present → diagnostic required).
    // Without this, assertGenerationReportInvariants throws when saving the aborted
    // report, leaving the prior in_progress=true partial snapshot on disk.
    const zeroedPostGenSummary: Record<string, unknown> = {
      chapters_generated: 0,
      prose_duration_ms_first_pass: elapsedMs,
      prose_duration_ms_total: elapsedMs,
      prose_cost_first_pass: agentCosts["agent9_prose"] ?? 0,
      prose_cost_total: agentCosts["agent9_prose"] ?? 0,
      score_total: 0,
      score_grade: "F",
      score_passed_threshold: false,
      component_failures: ["prose_generation_aborted"],
      failure_reason: errorMessage.slice(0, 240),
      rewrite_pass_count: 0,
      repair_pass_count: 0,
      per_pass_accounting: [],
      metrics_snapshot: "aborted_zero_chapters",
      batch_size: 1,
      batches_with_retries: (error as any).retriedBatches ?? 0,
      total_batches: 0,
      batch_failure_events: 0,
      batch_failure_history: [],
      batch_failure_samples: [],
    };
    scoringLogger.logPhaseDiagnostic(
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      zeroedPostGenSummary,
      runId,
      projectId || ""
    );
    scoreAggregator.upsertDiagnostic(
      "agent9_prose_post_generation_summary",
      "agent9_prose",
      "Prose Generation",
      "post_generation_summary",
      zeroedPostGenSummary
    );
  }

  if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
    try {
      const partialReport = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
      });
      applyAbortedRunMetadata(partialReport, errorMessage);
      await reportRepository.save(partialReport);
      scoringLogger.logReportGenerated(partialReport, runId, projectId);
    } catch {
      // best-effort — don't mask the original error
    }
  }
}
