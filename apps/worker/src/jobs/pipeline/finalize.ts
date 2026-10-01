/**
 * After the last stage: the final-story rubric and the content-filter summary, the scoring report, the
 * cross-run novelty ledger record, and the corpus snapshot. Moved from generateMystery (code review ORC-01 / CR-25).
 */
import { runRubricScoring } from "../rubric-scoring.js";
import {
  ScoreAggregator,
  FileReportRepository,
} from "@cml/story-validation";
import type { GenerationReport } from "@cml/story-validation";
import { ScoringLogger } from "../scoring-logger.js";
import { bandRunWarnings } from "../run-warnings.js";
import {
  describeError,
  type OrchestratorContext,
} from "../agents/index.js";
import {
  isCrossRunNoveltyEnabled,
  loadNoveltyLedger,
  appendNoveltyLedger,
  extractPriorRunRecord,
  activeNoveltyLedgerPath,
} from "../novelty-ledger.js";
import { logLedgerDispersion } from "../novelty-dispersion.js";
import { writeCorpusSnapshot } from "../corpus-snapshot.js";
import {
  buildResumeDiagnostic,
  ResumeSkipTracker,
  type ResumeApplication,
  type ResumeStageField,
} from "../resume-hydration.js";
import type { MysteryGenerationInputs } from "../run-contract.js";

export async function runRubricAndContentFilter(ctx: OrchestratorContext) {
  await runRubricScoring({
    prose: ctx.prose,
    cml: ctx.cml,
    client: ctx.client,
    aggregator: ctx.scoreAggregator,
    warnings: ctx.warnings,
    runId: ctx.runId,
    projectId: ctx.projectId,
    discriminatingPair: null, // v1's Agent 9 found this pair; v1 is deleted (owner decision 1)
  });

  // A_71 (A_70 §5) — surface the content-filter refusal tally. Measured on the 07-27 run: 10
  // refusals, all `Agent9-Regen-Ch*-missing_clue`, visible ONLY in raw logs. The never-abort gate
  // held and the story shipped, which is exactly why the class needs a number: it is invisible in
  // every artifact, premise-dependent (it recurs on the blunt-force-plus-staining story family),
  // and it injects unmodelled variance into any A/B whose replays regenerate that prose.
  const contentFilterSummary = ctx.client.getContentFilterTracker?.().getSummary();
  if (contentFilterSummary && contentFilterSummary.total > 0) {
    const families = Object.entries(contentFilterSummary.byFamily)
      .sort((a, b) => b[1] - a[1])
      .map(([family, count]) => `${family} ×${count}`)
      .join(", ");
    ctx.warnings.push(
      `Content filter: ${contentFilterSummary.total} Azure refusal(s) — ${families}. ` +
      `The pipeline generated content its own next call refused; affected regens fell back to the deterministic backstop.`
    );
  }
  if (ctx.enableScoring && ctx.scoreAggregator && contentFilterSummary) {
    ctx.scoreAggregator.upsertDiagnostic(
      "content_filter_refusals",
      "orchestrator",
      "Content Filter",
      "content_filter_refusals",
      {
        total: contentFilterSummary.total,
        by_agent: contentFilterSummary.byAgent,
        by_family: contentFilterSummary.byFamily,
        // Bounded sample: enough to identify the prompt family without copying the whole log.
        samples: contentFilterSummary.refusals.slice(0, 10),
      }
    );
  }
}

export async function buildScoringReport(enableScoring: boolean, scoreAggregator: ScoreAggregator | undefined, reportRepository: FileReportRepository | undefined, scoringLogger: ScoringLogger | undefined, resumeApplication: ResumeApplication | null, inputs: MysteryGenerationInputs, skippedStages: ResumeStageField[], skipTracker: ResumeSkipTracker, warnings: string[], scoringReport: GenerationReport | undefined, runId: string, startTime: number, projectId: string | undefined, markStaleInProgressReport: (reason: string) => Promise<void>) {
  if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
    try {
      // A_64 §2 F5 — the run's FULL warnings array must reach the artifact. The 7.5-pool autopsy
      // found 67 scaffold-regen calls with zero artifact trace (the #12/#13 forensic-blindness
      // family): chain logs die with the terminal; the report is the durable record. Everything
      // Agent 9 pushes to ctx.warnings aliases this array, so this captures the whole run.
      // A_65b Ph2 — banded: `info` (telemetry/status) vs `warn` (defect/floor firings). The
      // full array is preserved for forensics; status accounting counts `warn` only.
      // R5 — a resumed run must be distinguishable from a fresh one ON THE ARTIFACT. Its cost,
      // duration and LLM-call counts cover only the stages that actually executed, so a ledger
      // that cannot tell the two apart would read a resumed run as a startlingly cheap fresh one
      // and average it into a batch. `partial_cost_accounting` is the flag that stops that.
      if (resumeApplication) {
        scoreAggregator.upsertDiagnostic(
          "run_resume",
          "orchestrator",
          "Run Resume",
          "run_resume",
          buildResumeDiagnostic(
            inputs.resumeFromRunId ?? "(unknown)",
            resumeApplication,
            skippedStages,
            skipTracker.degradedSignals()
          )
        );
      }
      const warningBands = bandRunWarnings(warnings);
      scoreAggregator.upsertDiagnostic("run_warnings", "orchestrator", "Run Warnings", "run_warnings", {
        count: warnings.length,
        warn_count: warningBands.warn.length,
        info_count: warningBands.info.length,
        warnings: [...warnings],
        warn: warningBands.warn,
        info: warningBands.info,
      });
      scoringReport = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
      });
      await reportRepository.save(scoringReport);
      scoringLogger.logReportGenerated(scoringReport, runId, projectId);
      const passedCount = scoringReport.summary.phases_passed;
      const failedCount = scoringReport.summary.phases_failed;
      const avgScore = scoringReport.overall_score.toFixed(1);
      warnings.push(
        `Scoring: ${passedCount}/${passedCount + failedCount} phases passed, avg score ${avgScore}/100 (${scoringReport.overall_grade})`
      );
    } catch (reportError) {
      warnings.push(`Scoring report generation failed: ${describeError(reportError)}`);
      // A_70 §4 — when finalization fails, the last in_progress partial stays on disk as the ONLY
      // record of the run. Measured on mystery-1785175520689: the invariant
      // `failed_phase_signal_cannot_have_passed_outcome` threw here, leaving a snapshot frozen
      // before Agent 9 that reads `overall_score: 96, run_outcome: passed, 13/13 phases` for a run
      // that actually scored 66 with three chapters failing validation.
      //
      // The API read path already corrects this (A_44 R5a finalizeStaleInProgressReport), but
      // direct-file consumers do not — scripts/target80-ledger-row.mjs reads the JSON with a bare
      // readFileSync and would record 96/A. Stamp the truth onto the artifact so every consumer
      // sees it, not just the ones that go through the API.
      //
      // `in_progress` deliberately stays TRUE: report-repository skips in_progress snapshots when
      // listing, and flipping it would promote this partial to a "real" report. We add the terminal
      // markers alongside it. Best-effort throughout — this must never turn a bad report into a
      // failed run (§2.8 never-abort).
      await markStaleInProgressReport(describeError(reportError));
    }
  }
  return scoringReport;
}

export async function recordCrossRunNovelty(ctx: OrchestratorContext, status: string) {
  if (!isCrossRunNoveltyEnabled()) {
    console.warn("[DE1 ledger] NOT recorded: cross-run novelty is off (NOVELTY_CROSS_RUN=off).");
  } else if (!ctx.cml) {
    console.warn("[DE1 ledger] NOT recorded: no CML on the context — the run did not reach Agent 3.");
  } else if (status === "failure") {
    console.warn(
      `[DE1 ledger] NOT recorded: run status is "failure" (${ctx.errors.length} error(s)). ` +
      "The corpus therefore holds only clean runs — a biased sample, and the next run will " +
      "diverge from a history this one is missing from."
    );
  } else {
    try {
      const record = extractPriorRunRecord(ctx.cml, ctx.runId);
      await appendNoveltyLedger(record);
      const after = await loadNoveltyLedger();
      console.warn(
        `[DE1 ledger] recorded ${ctx.runId} -> ${activeNoveltyLedgerPath()} ` +
        `(axis=${record.axis}, family=${record.mechanismFamily ?? "unclassified"}); ` +
        `corpus is now ${after.length} run(s).`
      );
      // A_74 §8 DE2 — publish coverage every run, with no threshold. See novelty-dispersion.ts.
      logLedgerDispersion(after);
    } catch (e) {
      console.warn(
        `[DE1 ledger] WRITE FAILED for ${ctx.runId} at ${activeNoveltyLedgerPath()}: ${(e as Error).message}. ` +
        "The next run will diverge from a corpus this one is missing from."
      );
    }
  }
}

export function writeRunCorpusSnapshot(status: string, ctx: OrchestratorContext) {
  if (process.env.CORPUS_SNAPSHOT_DIR && status !== "failure") {
    const snap = writeCorpusSnapshot({
      dir: process.env.CORPUS_SNAPSHOT_DIR,
      projectId: ctx.projectId,
      runId: ctx.runId,
      cml: ctx.cml,
      clues: ctx.clues,
      outline: ctx.narrative,
      prose: ctx.prose,
    });
    if (snap) console.log(`[corpus-snapshot] wrote ${snap} (A_67 FIX-3 plant→payoff corpus).`);
  }
}
