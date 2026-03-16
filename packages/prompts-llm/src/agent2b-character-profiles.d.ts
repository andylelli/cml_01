/**
 * Agent 2b: Character Profile Generator
 *
 * Expands cast details into full narrative profiles.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { CastDesign } from "./agent2-cast.js";
export interface CharacterProfileOutput {
    name: string;
    summary?: string;
    publicPersona?: string;
    privateSecret?: string;
    motiveSeed?: string;
    motiveStrength?: "weak" | "moderate" | "strong" | "compelling";
    alibiWindow?: string;
    accessPlausibility?: string;
    stakes?: string;
    humourStyle?: "understatement" | "dry_wit" | "polite_savagery" | "self_deprecating" | "observational" | "deadpan" | "sardonic" | "blunt" | "none";
    humourLevel?: number;
    speechMannerisms?: string;
    internalConflict?: string;
    personalStakeInCase?: string;
    paragraphs: string[];
    order?: number;
}
export interface CharacterProfilesResult {
    status: "draft" | "final";
    tone?: string;
    targetWordCount?: number;
    profiles: CharacterProfileOutput[];
    note?: string;
    cost: number;
    durationMs: number;
}
export interface CharacterProfilesInputs {
    caseData: CaseData;
    cast: CastDesign;
    tone?: string;
    targetWordCount?: number;
    runId?: string;
    projectId?: string;
}
export declare function generateCharacterProfiles(client: AzureOpenAIClient, inputs: CharacterProfilesInputs, maxAttempts?: number): Promise<CharacterProfilesResult>;
