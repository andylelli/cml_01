/**
 * Agent 2c: Location & Setting Profile Generator
 *
 * Generates rich narrative profiles for locations, settings, and atmospheric background.
 * Similar to character profiles, but for places and atmosphere.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { SettingRefinement } from "./agent1-setting.js";
import type { NarrativeOutline } from "./agent7-narrative.js";
export interface SensoryDetails {
    sights: string[];
    sounds: string[];
    smells: string[];
    tactile: string[];
}
export interface SensoryVariant {
    id: string;
    timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
    weather: string;
    sights: string[];
    sounds: string[];
    smells: string[];
    mood: string;
}
export interface KeyLocation {
    id: string;
    name: string;
    type: 'interior' | 'exterior' | 'transitional';
    purpose: string;
    visualDetails: string;
    sensoryDetails: SensoryDetails;
    accessControl: string;
    /** 3-4 distinct sensory palette variants enabling atmospheric variety across chapters */
    sensoryVariants?: SensoryVariant[];
    paragraphs: string[];
}
export interface AtmosphereProfile {
    era: string;
    weather: string;
    timeFlow: string;
    mood: string;
    eraMarkers: string[];
    sensoryPalette: {
        dominant: string;
        secondary: string[];
    };
    paragraphs: string[];
}
export interface PrimaryLocationProfile {
    name: string;
    type: string;
    place?: string;
    country?: string;
    summary: string;
    visualDescription: string;
    atmosphere: string;
    paragraphs: string[];
}
export interface LocationProfilesResult {
    status: "draft" | "final";
    tone?: string;
    primary: PrimaryLocationProfile;
    keyLocations: KeyLocation[];
    atmosphere: AtmosphereProfile;
    note?: string;
    cost: number;
    durationMs: number;
}
export interface LocationProfilesInputs {
    settingRefinement: SettingRefinement;
    caseData: CaseData;
    narrative: NarrativeOutline;
    tone?: string;
    targetWordCount?: number;
    runId?: string;
    projectId?: string;
}
export declare function generateLocationProfiles(client: AzureOpenAIClient, inputs: LocationProfilesInputs, maxAttempts?: number): Promise<LocationProfilesResult>;
