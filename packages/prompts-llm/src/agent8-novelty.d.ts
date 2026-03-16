/**
 * Agent 8: Novelty Auditor
 *
 * Validates that a generated mystery is sufficiently different from seed CML examples.
 * Enforces the novelty requirement: no copying from seed patterns, only structural inspiration.
 *
 * Compares the generated CML against all seed CMLs to detect:
 * - Plot similarity (same crime, method, motive)
 * - Character similarity (same names, roles, relationships)
 * - Setting similarity (same era, location combination)
 * - Solution similarity (same culprit profile, false assumption, discriminating test)
 * - Overall structural similarity
 *
 * Returns similarity scores and pass/fail status based on thresholds.
 *
 * Temperature: 0.3 (low - consistent, objective comparison)
 * Max Tokens: 2500 (moderate - detailed similarity report)
 * Output Format: JSON (structured similarity scores)
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { PromptComponents } from "./types.js";
export interface NoveltyAuditInputs {
    generatedCML: CaseData;
    seedCMLs: CaseData[];
    similarityThreshold?: number;
    runId?: string;
    projectId?: string;
}
export interface SimilarityScore {
    seedTitle: string;
    overallSimilarity: number;
    plotSimilarity: number;
    characterSimilarity: number;
    settingSimilarity: number;
    solutionSimilarity: number;
    structuralSimilarity: number;
    concerningMatches: string[];
}
export interface NoveltyAuditResult {
    status: "pass" | "fail" | "warning";
    overallNovelty: number;
    mostSimilarSeed: string;
    highestSimilarity: number;
    similarityScores: SimilarityScore[];
    violations: string[];
    warnings: string[];
    recommendations: string[];
    summary: string;
    cost: number;
    durationMs: number;
}
export declare function buildNoveltyPrompt(inputs: NoveltyAuditInputs): PromptComponents;
export declare function auditNovelty(client: AzureOpenAIClient, inputs: NoveltyAuditInputs): Promise<NoveltyAuditResult>;
