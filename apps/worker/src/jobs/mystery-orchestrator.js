/**
 * Mystery Generation Orchestrator — Thin Coordinator
 *
 * Delegates all per-agent logic to apps/worker/src/jobs/agents/.
 * Each runAgentN() mutates the shared OrchestratorContext in place.
 *
 * Pipeline:
 *   Agent1 (Setting) → Agent2 (Cast) → Agent2e (Background Context)
 *   → Agent3b (Hard Logic Devices) → Agent3 (CML + Agent4 auto-revision)
 *   → Agent5 (Clue Distribution) → Agent6 (Fair Play + clue loop)
 *   → Agent7 (Narrative Outline) → Agent2b (Character Profiles)
 *   → Agent2c (Location Profiles) → Agent2d (Temporal Context)
 *   → [CML Validation Gate] → Agent9 (Prose + Release Gate)
 */
import { join } from "path";
import { resolveWorkerRuntimePaths } from "./runtime-paths.js";
import { loadSeedCMLFiles } from "@cml/prompts-llm";
import { ScoreAggregator, RetryManager, FileReportRepository, getStoryLengthTargetMetadata, } from "@cml/story-validation";
import { ScoringLogger } from "./scoring-logger.js";
import { runAgent1, runAgent2, runAgent2e, runAgent2b, runAgent2c, runAgent2d, runAgent3b, runAgent3, runAgent5, runAgent6, runAgent7, runAgent9, describeError, applyAbortedRunMetadata, normalizePrimaryAxis, deriveHardLogicDirectives, buildNoveltyConstraints, captureNarrativeSceneCountSnapshot, checkNarrativeSceneCountFloor, applyDeterministicCluePreAssignment, applyDeterministicProsePostProcessing, detectIdentityAliasBreaks, buildNarrativeSubsetForChapterIndexes, isDiscriminatingTestCoverageError, isSuspectClosureCoverageError, isCulpritEvidenceChainCoverageError, isSuspectEliminationCoverageError, } from "./agents/index.js";
const { workspaceRoot: WORKSPACE_ROOT, workerAppRoot: WORKER_APP_ROOT, examplesRoot: EXAMPLES_ROOT } = resolveWorkerRuntimePaths(import.meta.url);
function buildAbortedProseSummary(inputs) {
    const { expectedChaptersTotal, chaptersGeneratedCommitted, targetMeta, scoreTotal, failureReason, startedAtMs, proseCost, batchSize, templateLinterFailedChecks, templateLinterEntropyFailures, } = inputs;
    const chaptersFailedUncommitted = Math.max(0, expectedChaptersTotal - chaptersGeneratedCommitted);
    const elapsedMs = Date.now() - startedAtMs;
    return {
        expected_chapters_total: expectedChaptersTotal,
        chapters_generated_committed: chaptersGeneratedCommitted,
        chapters_failed_uncommitted: chaptersFailedUncommitted,
        story_words_total: null,
        chapter_words_hard_floor: null,
        count_reconciliation: {
            target_contract_source: targetMeta.source,
            target_contract_fingerprint: targetMeta.fingerprint,
            expected_chapters_total: expectedChaptersTotal,
            chapters_generated_committed: chaptersGeneratedCommitted,
            chapters_failed_uncommitted: chaptersFailedUncommitted,
            failed_uncommitted_chapter_ranges: chaptersFailedUncommitted > 0
                ? [{ start: chaptersGeneratedCommitted + 1, end: expectedChaptersTotal }]
                : [],
            chapter_word_buckets: {
                hard_floor_miss_count: 0,
                pass_count: chaptersGeneratedCommitted,
            },
            run_state: "partial_generation",
        },
        target_contract_source: targetMeta.source,
        target_contract_fingerprint: targetMeta.fingerprint,
        target_length: targetMeta.target_length,
        expected_scene_count: targetMeta.target.scenes,
        expected_chapter_count: targetMeta.target.chapters,
        expected_story_min_words: targetMeta.target.minWords,
        expected_story_max_words: targetMeta.target.maxWords,
        expected_chapter_min_words: targetMeta.target.chapterMinWords,
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
        score_total: scoreTotal,
        score_grade: null,
        score_passed_threshold: false,
        component_failures: ["prose_generation_aborted"],
        failure_reason: failureReason,
        chapters_generated: chaptersGeneratedCommitted,
        prose_duration_ms_first_pass: elapsedMs,
        prose_duration_ms_total: elapsedMs,
        prose_cost_first_pass: proseCost,
        prose_cost_total: proseCost,
        rewrite_pass_count: 0,
        repair_pass_count: 0,
        per_pass_accounting: [],
        metrics_snapshot: "aborted_partial",
        batch_size: batchSize,
        batches_with_retries: 0,
        total_batches: 0,
        batch_failure_events: 0,
        batch_failure_history: [],
        batch_failure_samples: [],
        outline_coverage_issue_count: null,
        critical_clue_coverage_gap: null,
        nsd_transfer_steps: 0,
        nsd_transfer_trace: [],
        aborted_after_chapter: chaptersGeneratedCommitted,
    };
}
// ============================================================================
// Main Orchestrator
// ============================================================================
export async function generateMystery(client, inputs, onProgress) {
    // ── Outer-scope vars (accessible by catch block) ─────────────────────────
    const startTime = Date.now();
    const runId = inputs.runId || `mystery-${Date.now()}`;
    const projectId = inputs.projectId;
    const agentCosts = {};
    const agentDurations = {};
    const warnings = [];
    const errors = [];
    const enableScoring = String(process.env.ENABLE_SCORING || "false").toLowerCase() === "true";
    let scoreAggregator;
    let retryManager;
    let reportRepository;
    let scoringLogger;
    if (enableScoring) {
        try {
            const retryConfigPath = join(WORKER_APP_ROOT, "config", "retry-limits.yaml");
            retryManager = new RetryManager(retryConfigPath);
            scoreAggregator = new ScoreAggregator({ mode: "standard" }, retryManager);
            const resolvedReportsDir = join(WORKSPACE_ROOT, "apps", "api", "data", "reports");
            reportRepository = new FileReportRepository(resolvedReportsDir);
            const logsDir = join(WORKER_APP_ROOT, "logs");
            scoringLogger = new ScoringLogger(logsDir);
            warnings.push("Scoring system enabled - tracking quality metrics and retries");
        }
        catch (error) {
            warnings.push(`Scoring system initialization failed: ${describeError(error)} - continuing without scoring`);
        }
    }
    const reportProgress = (stage, message, percentage) => {
        if (onProgress) {
            onProgress({ stage, message, percentage, timestamp: new Date() });
        }
    };
    const savePartialReport = async () => {
        if (!scoreAggregator || !reportRepository)
            return;
        try {
            const partial = scoreAggregator.generateReport({
                story_id: runId,
                started_at: new Date(startTime),
                completed_at: new Date(),
                user_id: projectId,
            });
            partial.in_progress = true;
            await reportRepository.save(partial);
        }
        catch {
            /* best-effort */
        }
    };
    const proseScoringSnapshot = {
        startedAtMs: null,
        chaptersGenerated: 0,
        latestChapterScore: null,
        latestCumulativeScore: null,
        postGenerationSummaryLogged: false,
    };
    try {
        // ── Resolve init-time settings ──────────────────────────────────────────
        const resolveLocationPreset = (preset) => {
            switch ((preset || "").toLowerCase()) {
                case "countryhouse":
                    return { location: "Country house estate", institution: "Manor house" };
                case "seasidehotel":
                    return { location: "Seaside hotel", institution: "Hotel" };
                case "village":
                    return { location: "Rural village", institution: "Village" };
                case "liner":
                    return { location: "Ocean liner", institution: "Passenger liner" };
                case "theatre":
                    return { location: "Theatre district", institution: "Theatre" };
                default:
                    return { location: preset || "Unspecified Location", institution: "Estate" };
            }
        };
        const locationSpec = resolveLocationPreset(inputs.locationPreset);
        const initialHardLogicDirectives = deriveHardLogicDirectives(inputs.theme, inputs.primaryAxis, inputs.locationPreset);
        const primaryAxis = normalizePrimaryAxis(inputs.primaryAxis);
        const seedEntries = await loadSeedCMLFiles(EXAMPLES_ROOT);
        const noveltyConstraints = buildNoveltyConstraints(seedEntries);
        // ── Build shared context ────────────────────────────────────────────────
        const ctx = {
            client,
            inputs,
            runId,
            projectId,
            startTime,
            reportProgress,
            savePartialReport,
            enableScoring,
            scoreAggregator,
            retryManager,
            scoringLogger,
            reportRepository,
            errors,
            warnings,
            agentCosts,
            agentDurations,
            primaryAxis,
            initialHardLogicDirectives,
            locationSpec,
            noveltyConstraints,
            criticalFairPlayRules: new Set(["Clue Visibility", "No Withholding", "Logical Deducibility"]),
            maxCmlRevisionAttempts: 3,
            examplesRoot: EXAMPLES_ROOT,
            workerAppRoot: WORKER_APP_ROOT,
            workspaceRoot: WORKSPACE_ROOT,
            seedEntries: seedEntries,
            revisedByAgent4: false,
            revisionAttempts: undefined,
            proseScoringSnapshot,
            proseChapterScores: [],
            proseSecondRunChapterScores: [],
            prosePassAccounting: [],
            proseRewritePassCount: 0,
            proseRepairPassCount: 0,
            latestProseScore: null,
            nsdTransferTrace: [],
        };
        // ── Pipeline ────────────────────────────────────────────────────────────
        await runAgent1(ctx); // Era & Setting Refiner
        await runAgent2(ctx); // Cast & Motive Designer
        await runAgent2e(ctx); // Background Context
        await runAgent3b(ctx); // Hard-Logic Device Ideation
        await runAgent3(ctx); // CML Generator (+ Agent 4 auto-revision)
        await runAgent5(ctx); // Clue Distributor
        await runAgent6(ctx); // Fair-Play Auditor + clue refinement loop
        await runAgent7(ctx); // Narrative Outliner
        await runAgent2b(ctx); // Character Profiles
        await runAgent2c(ctx); // Location Profiles
        await runAgent2d(ctx); // Temporal Context
        // ── CML Validation Gate ─────────────────────────────────────────────────
        // Prevents spending prose-generation cost on broken mystery structure.
        const cmlValidationErrors = [];
        // Back-fill discriminating_test.evidence_clues from finalised clues if missing.
        // Agent 3 generates the CML skeleton before clues exist; we populate here.
        const discrimTestNode = ctx.cml?.CASE?.discriminating_test;
        if (discrimTestNode &&
            (!discrimTestNode.evidence_clues || discrimTestNode.evidence_clues.length === 0)) {
            const essentialIds = ctx.clues.clues
                .filter((c) => c.criticality === "essential")
                .map((c) => c.id);
            if (essentialIds.length > 0) {
                discrimTestNode.evidence_clues = essentialIds;
                warnings.push(`CML gate: back-filled evidence_clues with ${essentialIds.length} essential clue(s)`);
            }
        }
        // Structurally breaking fair-play violations block prose generation.
        if (ctx.fairPlayAudit && ctx.fairPlayAudit.overallStatus === "fail") {
            const structurallyBlockingRules = new Set([
                "Clue Visibility",
                "Logical Deducibility",
                "No Withholding",
            ]);
            const blockingViolations = ctx.fairPlayAudit.violations.filter((v) => v.severity === "critical" && v.rule && structurallyBlockingRules.has(v.rule));
            if (blockingViolations.length > 0) {
                cmlValidationErrors.push(`Fair play audit failed with ${blockingViolations.length} structural violation(s) ` +
                    `(${blockingViolations.map((v) => v.rule).join(", ")}) — prose cannot realize a broken mystery`);
            }
            else {
                const nonStructuralCritical = ctx.fairPlayAudit.violations.filter((v) => v.severity === "critical");
                if (nonStructuralCritical.length > 0) {
                    warnings.push(`Fair-play: ${nonStructuralCritical.length} non-structural violation(s) remain ` +
                        `(${nonStructuralCritical
                            .map((v) => v.rule)
                            .join(", ")}) — mystery structure is sound, proceeding with prose`);
                }
            }
        }
        // Discriminating test must be fully specified.
        const discriminatingTest = ctx.cml?.CASE?.discriminating_test;
        if (!discriminatingTest || !discriminatingTest.design) {
            cmlValidationErrors.push("Discriminating test design is missing - prose generator cannot create test scene");
        }
        if (discriminatingTest &&
            (!discriminatingTest.evidence_clues || discriminatingTest.evidence_clues.length === 0)) {
            cmlValidationErrors.push("Discriminating test has no evidence clues - prose cannot reference supporting evidence");
        }
        // Critical clue coverage gaps block prose generation.
        if (ctx.coverageResult?.hasCriticalGaps) {
            const gapSummary = [];
            if (ctx.coverageResult.uncoveredSteps.length > 0) {
                gapSummary.push(`${ctx.coverageResult.uncoveredSteps.length} inference step(s) without sufficient clues`);
            }
            const allIssues = ctx.allCoverageIssues ?? [];
            const testIssues = allIssues.filter((i) => i.message.includes("discriminating test"));
            const eliminationIssues = allIssues.filter((i) => i.message.includes("suspect") || i.message.includes("elimination"));
            if (testIssues.length > 0)
                gapSummary.push("discriminating test evidence incomplete");
            if (eliminationIssues.length > 0)
                gapSummary.push(`suspect elimination issues (${eliminationIssues.length})`);
            if (gapSummary.length > 0) {
                cmlValidationErrors.push(`Critical clue coverage gaps: ${gapSummary.join(", ")}`);
            }
        }
        if (cmlValidationErrors.length > 0) {
            const errorMsg = `CML validation failed before prose generation:\n` +
                cmlValidationErrors.map((e) => `  \u2022 ${e}`).join("\n") +
                `\n\nFix CML structure before attempting prose generation.`;
            errors.push(errorMsg);
            throw new Error(errorMsg);
        }
        // ── Prose Generation + Release Gate ─────────────────────────────────────
        await runAgent9(ctx);
        // ── Complete ─────────────────────────────────────────────────────────────
        const totalDurationMs = Date.now() - startTime;
        const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
        reportProgress("complete", "Mystery generation complete!", 100);
        let scoringReport;
        if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
            try {
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
                warnings.push(`Scoring: ${passedCount}/${passedCount + failedCount} phases passed, avg score ${avgScore}/100 (${scoringReport.overall_grade})`);
            }
            catch (reportError) {
                warnings.push(`Scoring report generation failed: ${describeError(reportError)}`);
            }
        }
        const status = errors.length > 0 ? "failure" : warnings.length > 0 ? "warning" : "success";
        return {
            cml: ctx.cml,
            clues: ctx.clues,
            fairPlayAudit: ctx.fairPlayAudit,
            narrative: ctx.narrative,
            characterProfiles: ctx.characterProfiles,
            locationProfiles: ctx.locationProfiles,
            temporalContext: ctx.temporalContext,
            backgroundContext: ctx.backgroundContext,
            hardLogicDevices: ctx.hardLogicDevices,
            prose: ctx.prose,
            noveltyAudit: ctx.noveltyAudit,
            validationReport: ctx.validationReport,
            scoringReport,
            setting: ctx.setting,
            cast: ctx.cast,
            metadata: {
                runId,
                projectId,
                totalCost,
                totalDurationMs,
                agentCosts,
                agentDurations,
                revisedByAgent4: ctx.revisedByAgent4,
                revisionAttempts: ctx.revisionAttempts,
            },
            status,
            warnings,
            errors,
        };
    }
    catch (error) {
        const errorMessage = describeError(error);
        errors.push(`Pipeline failure: ${errorMessage}`);
        const templateLinterAbortDetected = /template\s*linter/i.test(errorMessage);
        if (enableScoring &&
            scoreAggregator &&
            scoringLogger &&
            proseScoringSnapshot.startedAtMs !== null &&
            proseScoringSnapshot.chaptersGenerated > 0 &&
            !proseScoringSnapshot.postGenerationSummaryLogged) {
            const targetMeta = getStoryLengthTargetMetadata(inputs.targetLength ?? "medium");
            const chaptersGeneratedCommitted = proseScoringSnapshot.chaptersGenerated;
            const expectedChaptersTotal = targetMeta.target.chapters;
            const templateLinterFailedChecks = templateLinterAbortDetected ? 1 : 0;
            const templateLinterEntropyFailures = /opening-style entropy/i.test(errorMessage) ? 1 : 0;
            const abortedProseSummary = buildAbortedProseSummary({
                expectedChaptersTotal,
                chaptersGeneratedCommitted,
                targetMeta,
                scoreTotal: proseScoringSnapshot.latestCumulativeScore,
                failureReason: errorMessage,
                startedAtMs: proseScoringSnapshot.startedAtMs,
                proseCost: agentCosts["agent9_prose"] ?? 0,
                batchSize: inputs.proseBatchSize ?? 1,
                templateLinterFailedChecks,
                templateLinterEntropyFailures,
            });
            scoringLogger.logPhaseDiagnostic("agent9_prose", "Prose Generation", "post_generation_summary", abortedProseSummary, runId, projectId || "");
            scoreAggregator.upsertDiagnostic("agent9_prose_post_generation_summary", "agent9_prose", "Prose Generation", "post_generation_summary", abortedProseSummary);
        }
        // Prose started but 0 chapters completed (e.g. chapter 1 failed all retries).
        // Register a failed prose phase so it always appears in the quality tab.
        if (enableScoring &&
            scoreAggregator &&
            proseScoringSnapshot.startedAtMs !== null &&
            proseScoringSnapshot.chaptersGenerated === 0) {
            const elapsedMs = Date.now() - proseScoringSnapshot.startedAtMs;
            const zeroedProseScore = {
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
            scoreAggregator.upsertPhaseScore("agent9_prose", "Prose Generation", zeroedProseScore, elapsedMs, agentCosts["agent9_prose"] ?? 0);
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
            }
            catch {
                // best-effort — don't mask the original error
            }
        }
        throw new Error(`Mystery generation failed: ${errorMessage}`);
    }
}
// ============================================================================
// Convenience Function: Generate with Default Settings
// ============================================================================
export async function generateMysterySimple(client, theme, onProgress) {
    return generateMystery(client, {
        theme,
        targetLength: "medium",
        narrativeStyle: "classic",
        skipNoveltyCheck: false,
    }, onProgress);
}
// Test-only exports for deterministic guardrail unit coverage.
export const __testables = {
    buildAbortedProseSummary,
    captureNarrativeSceneCountSnapshot,
    checkNarrativeSceneCountFloor,
    applyDeterministicCluePreAssignment,
    applyDeterministicProsePostProcessing,
    detectIdentityAliasBreaks,
    buildNarrativeSubsetForChapterIndexes,
    isDiscriminatingTestCoverageError,
    isSuspectClosureCoverageError,
    isCulpritEvidenceChainCoverageError,
    isSuspectEliminationCoverageError,
};
//# sourceMappingURL=mystery-orchestrator.js.map