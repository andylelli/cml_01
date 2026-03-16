/**
 * Agent 4: CML Revision Agent
 *
 * Parses CML validation errors and generates targeted revisions to fix Agent 3 output.
 * Uses logger from llm-client for revision tracking (like Agent 3).
 *
 * Critical for production-ready CML generation - fixes ~90% of Agent 3 validation failures.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { PromptComponents } from "./types.js";
export interface RevisionInputs {
    originalPrompt: PromptComponents;
    invalidCml: string;
    validationErrors: string[];
    attempt: number;
    runId?: string;
    projectId?: string;
}
export interface RevisionResult {
    cml: Record<string, unknown>;
    validation: {
        valid: boolean;
        errors: string[];
    };
    revisionsApplied: string[];
    attempt: number;
    latencyMs: number;
    cost: number;
}
/**
 * Build revision prompt with error context and targeted fixes
 */
export declare function buildRevisionPrompt(inputs: RevisionInputs): PromptComponents;
/**
 * Revise invalid CML by generating targeted fixes
 *
 * Uses iterative revision with error feedback across up to 5 attempts.
 */
export declare function reviseCml(client: AzureOpenAIClient, inputs: RevisionInputs, maxAttempts?: number): Promise<RevisionResult>;
