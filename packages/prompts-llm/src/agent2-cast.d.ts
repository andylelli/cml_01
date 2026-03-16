/**
 * Agent 2: Cast & Motive Designer
 *
 * Generates detailed character profiles with secrets, motives, alibis, and relationships.
 * Accepts user-provided character names and creates psychologically rich suspects.
 *
 * Note: Like Agent 1, this implementation does NOT use explicit logging calls to keep it simple.
 * Agent 3 uses the logger from client, but Agents 1 & 2 follow a simpler pattern.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
export interface CastInputs {
    runId: string;
    projectId: string;
    characterNames?: string[];
    castSize?: number;
    setting: string;
    crimeType: string;
    tone: string;
    socialContext?: string;
    detectiveType?: 'police' | 'private' | 'amateur';
    qualityGuardrails?: string[];
}
export interface CharacterProfile {
    name: string;
    ageRange: string;
    occupation: string;
    roleArchetype: string;
    publicPersona: string;
    privateSecret: string;
    motiveSeed: string;
    motiveStrength: "weak" | "moderate" | "strong" | "compelling";
    alibiWindow: string;
    accessPlausibility: "impossible" | "unlikely" | "possible" | "easy";
    stakes: string;
    characterArcPotential: string;
    gender?: 'male' | 'female' | 'non-binary';
}
export interface RelationshipWeb {
    pairs: Array<{
        character1: string;
        character2: string;
        relationship: string;
        tension: "none" | "low" | "moderate" | "high";
        sharedHistory: string;
    }>;
}
export interface CastDesign {
    characters: CharacterProfile[];
    relationships: RelationshipWeb;
    diversity: {
        stereotypeCheck: string[];
        recommendations: string[];
    };
    crimeDynamics: {
        possibleCulprits: string[];
        redHerrings: string[];
        victimCandidates: string[];
        detectiveCandidates: string[];
    };
}
export interface CastDesignResult {
    cast: CastDesign;
    attempt: number;
    latencyMs: number;
    cost: number;
}
interface PromptComponents {
    system: string;
    developer: string;
    user: string;
    messages: Array<{
        role: "system" | "user";
        content: string;
    }>;
}
export declare function buildCastPrompt(inputs: CastInputs): PromptComponents;
export declare function designCast(client: AzureOpenAIClient, inputs: CastInputs, maxAttempts?: number): Promise<CastDesignResult>;
export {};
