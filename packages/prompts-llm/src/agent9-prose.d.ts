/**
 * Agent 9: Prose Generator
 *
 * Generates full narrative prose from the narrative outline + CML + cast.
 * Output Format: JSON (chapters with paragraphs)
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "./agent7-narrative.js";
import type { CastDesign } from "./agent2-cast.js";
import type { ClueDistributionResult } from "./agent5-clues.js";
import type { NarrativeState } from "./types/narrative-state.js";
export interface ProseChapter {
    title: string;
    summary?: string;
    paragraphs: string[];
}
export interface ChapterSummary {
    chapterNumber: number;
    title: string;
    charactersPresent: string[];
    settingTerms: string[];
    keyEvents: string[];
}
export interface ProseGenerationInputs {
    caseData: CaseData;
    outline: NarrativeOutline;
    cast: CastDesign;
    /** Optional model/deployment override for prose generation only. */
    model?: string;
    characterProfiles?: any;
    locationProfiles?: any;
    temporalContext?: any;
    targetLength?: "short" | "medium" | "long";
    narrativeStyle?: "classic" | "modern" | "atmospheric";
    detectiveType?: 'police' | 'private' | 'amateur';
    qualityGuardrails?: string[];
    moralAmbiguityNote?: string;
    lockedFacts?: Array<{
        id: string;
        value: string;
        description: string;
        appearsInChapters?: string[];
    }>;
    /** Agent5 clue distribution — used to inject full clue descriptions into per-chapter prose prompts. */
    clueDistribution?: ClueDistributionResult;
    /** Live narrative state threaded through prose batches — prevents style/fact repetition. */
    narrativeState?: NarrativeState;
    writingGuides?: {
        humour?: string;
        craft?: string;
    };
    runId?: string;
    projectId?: string;
    /** Optional anti-template linter profile; repair mode relaxes early-chapter entropy checks. */
    templateLinterProfile?: {
        mode?: "standard" | "repair";
        chapterOffset?: number;
        entropyThreshold?: number;
        entropyMinWindow?: number;
        entropyWarmupChapters?: number;
    };
    onProgress?: (phase: string, message: string, percentage: number) => void;
    /** Number of scenes to process per LLM call (1–10, default 1). Higher values increase throughput at the cost of coarser retry granularity. */
    batchSize?: number;
    /** Called after each batch of chapters is successfully generated and validated.
     *  The fourth argument contains validation issues from any failed attempts for this batch. */
    onBatchComplete?: (chapters: ProseChapter[], batchStart: number, batchEnd: number, validationIssues: string[]) => Promise<void> | void;
    /** Corrective directives from provisional chapter scoring, applied to subsequent chapter prompts. */
    provisionalScoringFeedback?: {
        fromChapter: number;
        score: number;
        deficits: string[];
        directives: string[];
    }[];
}
export interface ProseGenerationResult {
    status: "draft" | "final";
    tone?: string;
    chapters: ProseChapter[];
    cast: string[];
    note?: string;
    cost: number;
    durationMs: number;
    /** E5: Per-chapter prompt fingerprints for traceability and regression debugging. */
    prompt_fingerprints?: Array<{
        chapter: number;
        hash: string;
        section_sizes: Record<string, number>;
    }>;
    validationDetails?: {
        totalBatches: number;
        batchesWithRetries: number;
        failureHistory: Array<{
            batchIndex: number;
            chapterRange: string;
            attempt: number;
            errors: string[];
        }>;
        linter: {
            checksRun: number;
            failedChecks: number;
            openingStyleEntropyFailures: number;
            openingStyleEntropyBypasses: number;
            paragraphFingerprintFailures: number;
            ngramOverlapFailures: number;
        };
        underflow?: UnderflowTelemetry;
        mandatoryRepair?: {
            triggered: number;
            executed: number;
            invariantViolations: number;
        };
        pronounRepairsApplied?: number;
        requiredClueIdsByChapter?: Array<{
            chapter: number;
            requiredClueIds: string[];
            normalizedRequiredClueIds: string[];
        }>;
        provisionalChapterScores?: Array<{
            chapter: number;
            score: number;
            deficits: string[];
            directives: string[];
        }>;
        cluePresenceAdjudicator?: {
            mode: "shadow";
            calls: number;
            potentialOverrides: number;
            malformedOutputs: number;
            traces: CluePresenceAdjudicationTrace[];
        };
    };
}
interface ChapterRequirementLedgerEntry {
    chapterNumber: number;
    targetLength?: "short" | "medium" | "long";
    hardFloorWords: number;
    preferredWords: number;
    requiredClueIds: string[];
}
interface ChapterWordTargetResult {
    wordCount: number;
    hardFloorWords: number;
    preferredWords: number;
    isBelowHardFloor: boolean;
    isBelowPreferred: boolean;
}
interface ChapterObligationResult {
    hardFailures: string[];
    wordTarget: ChapterWordTargetResult;
    missingRequiredClueIds: string[];
}
interface UnderflowTelemetry {
    preferredTargetWords: number;
    hardFloorMisses: number;
    hardFloorMissChapters: number[];
    preferredTargetMisses: number;
    preferredTargetMissChapters: number[];
    expansionAttempts: number;
    expansionRecovered: number;
    expansionFailed: number;
    preferredExpansionAttempts: number;
    preferredExpansionRecovered: number;
    preferredExpansionFailed: number;
}
type CluePresenceFailureMode = "not_present" | "too_implicit" | "ambiguous" | "format_error";
interface CluePresenceAdjudication {
    present: boolean;
    confidence: number;
    evidenceSpans: string[];
    reasoningSummary: string;
    failureMode: CluePresenceFailureMode;
}
interface CluePresenceAdjudicationTrace {
    chapter: number;
    clueId: string;
    present: boolean;
    confidence: number;
    evidenceSpans: string[];
    failureMode: CluePresenceFailureMode;
    malformedOutput?: boolean;
}
export declare const stripClueIdMarkersFromText: (value: string) => string;
export declare const validateChapterPreCommitObligations: (chapter: ProseChapter, ledgerEntry: ChapterRequirementLedgerEntry, clueDistribution?: ClueDistributionResult) => ChapterObligationResult;
/**
 * Returns the victim character's full name from the cast, or '' if not found.
 * Used to enforce named-victim guardrails in prose prompts.
 */
export declare const resolveVictimName: (cast: CastDesign) => string;
export declare function formatProvisionalScoringFeedbackBlock(feedback: Array<{
    fromChapter: number;
    score: number;
    deficits: string[];
    directives: string[];
}> | undefined): string;
export declare const buildRetryRevisionPrompt: (failedChapters: ProseChapter[], errors: string[], chapterStart: number, options?: {
    victimName?: string;
    pronounLockLines?: string[];
}) => Array<{
    role: "system" | "user" | "assistant";
    content: string;
}>;
export declare const buildRetryRevisionUserDirective: (failedChapters: ProseChapter[], errors: string[], chapterStart: number, options?: {
    victimName?: string;
    pronounLockLines?: string[];
}) => string;
export declare const parseCluePresenceAdjudicationResponse: (content: string) => CluePresenceAdjudication;
export declare const summarizeRetryPersistence: (attemptErrorsHistory: string[][]) => {
    persistentMissingClueIds: string[];
    hardFloorFailureAttempts: number;
};
export declare const prioritizeRetryErrors: (errors: string[]) => string[];
export declare function generateProse(client: AzureOpenAIClient, inputs: ProseGenerationInputs, maxAttempts?: number): Promise<ProseGenerationResult>;
export {};
