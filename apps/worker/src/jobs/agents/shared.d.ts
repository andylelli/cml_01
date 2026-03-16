/**
 * Orchestrator shared context, types, and utility functions.
 *
 * All runAgentN() functions accept OrchestratorContext and mutate it in place.
 * Shared low-level utilities (delay, executeAgentWithRetry, etc.) live here
 * so they are importable by every agent run file without creating circular
 * dependencies with mystery-orchestrator.ts.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { SettingRefinementResult, CastDesignResult, BackgroundContextArtifact, HardLogicDeviceResult, HardLogicDeviceIdea, ClueDistributionResult, FairPlayAuditResult, NarrativeOutline, CharacterProfilesResult, LocationProfilesResult, TemporalContextResult, ProseGenerationResult, NoveltyAuditResult, NarrativeState } from "@cml/prompts-llm";
import type { ScoreAggregator, RetryManager, FileReportRepository, PhaseScore, GenerationReport, ValidationReport } from "@cml/story-validation";
import type { ScoringLogger } from "../scoring-logger.js";
import type { MysteryGenerationInputs } from "../mystery-orchestrator.js";
export type DifficultyMode = "standard" | "increase" | "extreme";
export type CmlPrimaryAxis = "temporal" | "spatial" | "identity" | "behavioral" | "authority";
export type HardLogicDirectives = {
    mechanismFamilies: string[];
    complexityLevel: "simple" | "moderate" | "complex";
    hardLogicModes: string[];
    difficultyMode: DifficultyMode;
};
export type ClueGuardrailIssue = {
    severity: "critical" | "warning";
    message: string;
};
export interface InferenceCoverageResult {
    issues: ClueGuardrailIssue[];
    coverageMap: Map<number, {
        observation: boolean;
        contradiction: boolean;
        elimination: boolean;
    }>;
    uncoveredSteps: number[];
    hasCriticalGaps: boolean;
}
export type ProseChapterScorePoint = {
    chapter: number;
    total_chapters: number;
    individual_score: number;
    cumulative_score: number;
    individual_validation_score: number;
    individual_quality_score: number;
    individual_completeness_score: number;
    individual_consistency_score: number;
    cumulative_validation_score: number;
    cumulative_quality_score: number;
    cumulative_completeness_score: number;
    cumulative_consistency_score: number;
};
export type ProsePassAccounting = {
    pass_type: string;
    duration_ms: number;
    cost: number;
    chapters_generated: number;
};
export type ProseScoringSnapshot = {
    startedAtMs: number | null;
    chaptersGenerated: number;
    latestChapterScore: number | null;
    latestCumulativeScore: number | null;
    postGenerationSummaryLogged: boolean;
};
export type OutlineCoverageIssue = {
    type: "missing_discriminating_test_scene" | "missing_suspect_closure_scene";
    message: string;
};
export interface OrchestratorContext {
    client: AzureOpenAIClient;
    inputs: MysteryGenerationInputs;
    runId: string;
    projectId: string | undefined;
    startTime: number;
    reportProgress: (stage: any, message: string, pct: number) => void;
    savePartialReport: () => Promise<void>;
    enableScoring: boolean;
    scoreAggregator: ScoreAggregator | undefined;
    retryManager: RetryManager | undefined;
    scoringLogger: ScoringLogger | undefined;
    reportRepository: FileReportRepository | undefined;
    errors: string[];
    warnings: string[];
    agentCosts: Record<string, number>;
    agentDurations: Record<string, number>;
    primaryAxis: CmlPrimaryAxis;
    initialHardLogicDirectives: any;
    locationSpec: {
        location: string;
        institution: string;
    };
    noveltyConstraints: any;
    criticalFairPlayRules: Set<string>;
    maxCmlRevisionAttempts: number;
    examplesRoot: string;
    workerAppRoot: string;
    workspaceRoot: string;
    seedEntries: Array<{
        filename: string;
        cml: CaseData;
    }>;
    setting?: SettingRefinementResult;
    cast?: CastDesignResult;
    backgroundContext?: BackgroundContextArtifact;
    hardLogicDevices?: HardLogicDeviceResult;
    hardLogicDirectives?: HardLogicDirectives;
    cml?: CaseData;
    noveltyAudit?: NoveltyAuditResult;
    clues?: ClueDistributionResult;
    coverageResult?: InferenceCoverageResult;
    allCoverageIssues?: ClueGuardrailIssue[];
    fairPlayAudit?: FairPlayAuditResult;
    hasCriticalFairPlayFailure?: boolean;
    narrative?: NarrativeOutline;
    outlineCoverageIssues?: OutlineCoverageIssue[];
    characterProfiles?: CharacterProfilesResult;
    locationProfiles?: LocationProfilesResult;
    temporalContext?: TemporalContextResult;
    prose?: ProseGenerationResult;
    validationReport?: ValidationReport;
    revisedByAgent4: boolean;
    revisionAttempts: number | undefined;
    narrativeState?: NarrativeState;
    characterGenderMap?: Record<string, string>;
    baselineProseGuardrails?: string[];
    proseScoringSnapshot: ProseScoringSnapshot;
    proseChapterScores: ProseChapterScorePoint[];
    proseSecondRunChapterScores: ProseChapterScorePoint[];
    prosePassAccounting: ProsePassAccounting[];
    proseRewritePassCount: number;
    proseRepairPassCount: number;
    latestProseScore: PhaseScore | null;
    nsdTransferTrace: any[];
}
export declare const mergeHardLogicDirectives: (base: HardLogicDirectives, hardLogicDevices: HardLogicDeviceIdea[]) => HardLogicDirectives;
export declare const buildOutlineRepairGuardrails: (issues: OutlineCoverageIssue[], cml: CaseData) => string[];
export declare const applyClueGuardrails: (cml: CaseData, clues: ClueDistributionResult) => {
    issues: ClueGuardrailIssue[];
    fixes: string[];
    hasCriticalIssues: boolean;
};
export declare function describeError(error: unknown): string;
export declare function applyAbortedRunMetadata(report: GenerationReport, reason: string): void;
export declare function delay(ms: number): Promise<void>;
export declare function appendRetryFeedback(base: string, retryFeedback?: string): string;
export declare function appendRetryFeedbackOptional(base: string | undefined, retryFeedback?: string): string | undefined;
export declare function executeAgentWithRetry<T>(agentId: string, phaseName: string, executeAgent: (retryFeedback?: string) => Promise<{
    result: T;
    cost: number;
}>, scoreOutput: (result: T) => Promise<{
    adapted: any;
    score: PhaseScore;
}>, retryManager: RetryManager, scoreAggregator: ScoreAggregator, scoringLogger: ScoringLogger, runId: string, projectId: string, warnings: string[], onPhaseScored?: () => Promise<void>): Promise<{
    result: T;
    duration: number;
    cost: number;
    retryCount: number;
}>;
export declare const normalizePrimaryAxis: (axis: MysteryGenerationInputs["primaryAxis"] | undefined) => CmlPrimaryAxis;
export declare const deriveHardLogicDirectives: (theme: string | undefined, primaryAxis: MysteryGenerationInputs["primaryAxis"] | undefined, locationPreset: string | undefined) => HardLogicDirectives;
export declare const buildNoveltyConstraints: (seedEntries: Array<{
    filename: string;
    cml: CaseData;
}>) => {
    divergeFrom: string[];
    areas: string[];
    avoidancePatterns: string[];
};
