/**
 * Types for LLM prompt generation
 */
import type { Message } from "@cml/llm-client";
export interface PromptMessages {
    system: string;
    developer?: string;
    user: string;
    messages: Message[];
}
export interface PromptComponents {
    system: string;
    developer: string;
    user: string;
    messages?: Array<{
        role: "system" | "user";
        content: string;
    }>;
}
export interface CMLPromptInputs {
    decade: string;
    location: string;
    institution: string;
    tone: string;
    weather: string;
    socialStructure: string;
    theme?: string;
    primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
    castSize: number;
    castNames: string[];
    castGenders?: Record<string, string>;
    detectiveType: string;
    victimArchetype: string;
    complexityLevel: "simple" | "moderate" | "complex";
    mechanismFamilies: string[];
    hardLogicModes?: string[];
    difficultyMode?: "standard" | "increase" | "extreme";
    hardLogicDevices?: HardLogicDeviceIdea[];
    backgroundContext?: BackgroundContextInput;
    noveltyConstraints?: {
        divergeFrom: string[];
        areas: string[];
        avoidancePatterns: string[];
    };
    runId: string;
    projectId: string;
}
export interface HardLogicDeviceIdea {
    title: string;
    corePrinciple: string;
    principleType: "physical_law" | "mathematical_principle" | "cognitive_bias" | "social_logic";
    surfaceIllusion: string;
    underlyingReality: string;
    fairPlayClues: string[];
    whyNotTrope: string;
    variationEscalation: string;
    mechanismFamilyHints: string[];
    modeTags?: string[];
    moralAmbiguity?: string;
    lockedFacts?: Array<{
        id: string;
        value: string;
        description: string;
        appearsInChapters?: string[];
    }>;
}
export interface BackgroundContextInput {
    status: "ok" | string;
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
export interface CMLGenerationResult {
    cml: any;
    validation: {
        valid: boolean;
        errors: string[];
    };
    attempt: number;
    latencyMs: number;
    cost: number;
    revisedByAgent4?: boolean;
    revisionDetails?: {
        attempts: number;
        revisionsApplied: string[];
    };
}
export interface SeedPattern {
    id: string;
    axis: string;
    structure: {
        mechanismType: string;
        falseAssumptionPattern: string;
        constraintSpaceSize: number;
        inferencePathSteps: number;
        discriminatingTestMethod: string;
    };
}
