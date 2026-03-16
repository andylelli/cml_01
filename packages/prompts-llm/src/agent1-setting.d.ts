/**
 * Agent 1: Era & Setting Refiner
 *
 * Refines user-provided mystery specifications by adding era-specific constraints,
 * technology limits, forensic capabilities, social norms, and location details.
 * This ensures the mystery is grounded in authentic period details.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { Message } from "@cml/llm-client";
export interface SettingInputs {
    runId: string;
    projectId: string;
    decade: string;
    location: string;
    institution?: string;
    weather?: string;
    socialStructure?: string;
    tone?: string;
}
export interface SettingRefinement {
    era: {
        decade: string;
        technology: string[];
        forensics: string[];
        transportation: string[];
        communication: string[];
        socialNorms: string[];
        policing: string[];
    };
    location: {
        type: string;
        description: string;
        physicalConstraints: string[];
        geographicIsolation: string;
        accessControl: string[];
    };
    atmosphere: {
        weather: string;
        timeOfDay: string;
        mood: string;
        visualDescription: string;
    };
    realism: {
        anachronisms: string[];
        implausibilities: string[];
        recommendations: string[];
    };
}
export interface SettingRefinementResult {
    setting: SettingRefinement;
    rawResponse: string;
    attempt: number;
    latencyMs: number;
    cost: number;
}
/**
 * Build prompt for setting refinement
 */
export declare function buildSettingPrompt(inputs: SettingInputs): {
    system: string;
    developer: string;
    user: string;
    messages: Message[];
};
/**
 * Refine setting with Agent 1
 */
export declare function refineSetting(client: AzureOpenAIClient, inputs: SettingInputs, maxAttempts?: number): Promise<SettingRefinementResult>;
