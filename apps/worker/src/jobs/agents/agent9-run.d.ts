/**
 * Agent 9: Prose Generator
 *
 * Handles:
 * - Prose generation with per-batch NSD tracking and scoring telemetry
 * - Identity continuity repair (targeted and full fallback)
 * - Schema validation repair retry
 * - Full story validation pipeline with targeted repair guardrails
 * - Auto-fix encoding issues
 * - Release gate quality checks (hard stops)
 *
 * Writes to ctx: prose, validationReport, proseScoringSnapshot, proseChapterScores,
 * proseSecondRunChapterScores, prosePassAccounting, proseRewritePassCount,
 * proseRepairPassCount, latestProseScore, nsdTransferTrace
 */
import { type OrchestratorContext } from "./shared.js";
type IdentityAliasIssue = {
    chapterIndex: number;
    message: string;
};
type ValidationErrorSignal = {
    type?: string;
    message?: string;
};
export declare const illegalControlCharPattern: RegExp;
export declare const persistentMojibakePattern: RegExp;
export declare const sanitizeProseText: (value: unknown) => string;
export declare const applyDeterministicProsePostProcessing: (prose: any, locationProfiles: any) => any;
export declare const normalizeChapterTitle: (value: unknown) => string;
export declare const sanitizeProseResult: (prose: any) => any;
export declare const detectIdentityAliasBreaks: (prose: any, cml: any) => IdentityAliasIssue[];
export declare const buildNarrativeSubsetForChapterIndexes: (narrative: any, chapterIndexes: number[]) => any;
export declare const getExpectedClueIdsForVisibility: (cmlCase: any, clueDistribution?: any) => string[];
export declare const isDiscriminatingTestCoverageError: (error: ValidationErrorSignal) => boolean;
export declare const isSuspectClosureCoverageError: (error: ValidationErrorSignal) => boolean;
export declare const isCulpritEvidenceChainCoverageError: (error: ValidationErrorSignal) => boolean;
export declare const isSuspectEliminationCoverageError: (error: ValidationErrorSignal) => boolean;
export declare function runAgent9(ctx: OrchestratorContext): Promise<void>;
export {};
