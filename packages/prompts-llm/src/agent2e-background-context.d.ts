/**
 * Agent 2e: Background Context Generator
 *
 * Generates a dedicated backdrop artifact used to ground CML generation separately
 * from hard-logic mechanism ideation.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { SettingRefinement } from "./agent1-setting.js";
import type { CastDesign } from "./agent2-cast.js";
export interface BackgroundContextArtifact {
    status: "ok";
    backdropSummary: string;
    era: {
        decade: string;
        socialStructure?: string;
    };
    setting: {
        location: string;
        institution: string;
        weather?: string;
    };
    castAnchors: string[];
    theme?: string;
}
export interface BackgroundContextInputs {
    settingRefinement: SettingRefinement;
    cast: CastDesign;
    theme?: string;
    tone?: string;
    runId?: string;
    projectId?: string;
}
export interface BackgroundContextResult {
    backgroundContext: BackgroundContextArtifact;
    cost: number;
    durationMs: number;
    attempt: number;
}
export declare function generateBackgroundContext(client: AzureOpenAIClient, inputs: BackgroundContextInputs, maxAttempts?: number): Promise<BackgroundContextResult>;
