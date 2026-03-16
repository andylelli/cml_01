/**
 * Agent 6: Fair Play Auditor
 *
 * Validates that a mystery follows detective fiction fair play rules:
 * - All essential clues visible before solution reveal
 * - No information withheld from reader that detective knows
 * - No special knowledge required that wasn't disclosed
 * - Inference path completeness (all steps have supporting clues)
 * - Discriminating test appears at proper time
 *
 * Temperature: 0.3 (very low - consistent, rigorous auditing)
 * Max Tokens: 2500 (moderate - detailed audit report)
 * Output Format: JSON (structured pass/fail report)
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { ClueDistributionResult } from "./agent5-clues.js";
import type { PromptComponents } from "./types.js";
export interface FairPlayAuditInputs {
    caseData: CaseData;
    clues: ClueDistributionResult;
    runId?: string;
    projectId?: string;
}
export interface FairPlayCheck {
    rule: string;
    status: "pass" | "fail" | "warning";
    details: string;
    recommendations?: string[];
}
export interface FairPlayViolation {
    severity: "critical" | "moderate" | "minor";
    rule: string;
    description: string;
    location: string;
    suggestion: string;
}
export interface FairPlayAuditResult {
    overallStatus: "pass" | "fail" | "needs-revision";
    checks: FairPlayCheck[];
    violations: FairPlayViolation[];
    warnings: string[];
    recommendations: string[];
    summary: string;
    cost: number;
    durationMs: number;
}
export declare function buildFairPlayPrompt(inputs: FairPlayAuditInputs): PromptComponents;
export declare function auditFairPlay(client: AzureOpenAIClient, inputs: FairPlayAuditInputs): Promise<FairPlayAuditResult>;
export interface BlindReaderResult {
    suspectedCulprit: string;
    reasoning: string;
    confidenceLevel: "certain" | "likely" | "uncertain" | "impossible";
    missingInformation: string[];
    cost: number;
    durationMs: number;
}
export declare function blindReaderSimulation(client: AzureOpenAIClient, clues: ClueDistributionResult, falseAssumption: string, castNames: string[], inputs: {
    runId?: string;
    projectId?: string;
}): Promise<BlindReaderResult>;
