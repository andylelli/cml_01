/**
 * Agent 5: Clue Distribution & Red Herring Agent
 *
 * Analyzes validated CML and extracts/organizes clues for fair play.
 * Does NOT add new facts - only derives clues from existing CML structure.
 *
 * Uses logger from llm-client (like Agents 3 & 4).
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { PromptComponents } from "./types.js";
export interface ClueExtractionInputs {
    cml: Record<string, unknown>;
    clueDensity: "minimal" | "moderate" | "dense";
    redHerringBudget: number;
    fairPlayFeedback?: {
        overallStatus?: "pass" | "fail" | "needs-revision";
        violations?: Array<{
            severity: "critical" | "moderate" | "minor";
            rule: string;
            description: string;
            suggestion: string;
        }>;
        warnings?: string[];
        recommendations?: string[];
    };
    runId?: string;
    projectId?: string;
}
export interface Clue {
    id: string;
    category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
    description: string;
    sourceInCML: string;
    pointsTo: string;
    placement: "early" | "mid" | "late";
    criticality: "essential" | "supporting" | "optional";
    supportsInferenceStep?: number;
    evidenceType?: "observation" | "contradiction" | "elimination";
}
export interface RedHerring {
    id: string;
    description: string;
    supportsAssumption: string;
    misdirection: string;
}
export interface ClueDistributionResult {
    clues: Clue[];
    redHerrings: RedHerring[];
    clueTimeline: {
        early: string[];
        mid: string[];
        late: string[];
    };
    fairPlayChecks: {
        allEssentialCluesPresent: boolean;
        noNewFactsIntroduced: boolean;
        redHerringsDontBreakLogic: boolean;
    };
    latencyMs: number;
    cost: number;
}
/**
 * Build prompt for clue extraction and organization
 */
export declare function buildCluePrompt(inputs: ClueExtractionInputs): PromptComponents;
/**
 * Extract and organize clues from validated CML
 */
export declare function extractClues(client: AzureOpenAIClient, inputs: ClueExtractionInputs): Promise<ClueDistributionResult>;
