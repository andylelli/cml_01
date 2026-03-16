/**
 * Agent 2d: Temporal Context Generator
 *
 * Generates rich temporal/cultural context for a specific date within the story's era.
 * Includes season, fashion, current affairs, cultural trends, and daily life details.
 */
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import type { SettingRefinement } from "./agent1-setting.js";
export interface SeasonalContext {
    season: "spring" | "summer" | "fall" | "winter";
    month: string;
    weather: string[];
    daylight: string;
    time_of_day_of_crime?: string;
    holidays: string[];
    seasonalActivities: string[];
}
export interface FashionContext {
    mensWear: {
        formal: string[];
        casual: string[];
        accessories: string[];
    };
    womensWear: {
        formal: string[];
        casual: string[];
        accessories: string[];
    };
    trendsOfTheMoment: string[];
    socialExpectations: string[];
}
export interface CurrentAffairs {
    majorEvents: string[];
    politicalClimate: string;
    economicConditions: string;
    socialIssues: string[];
    internationalNews: string[];
}
export interface CulturalContext {
    entertainment: {
        popularMusic: string[];
        films: string[];
        theater: string[];
        radio: string[];
    };
    literature: {
        recentPublications: string[];
        popularGenres: string[];
    };
    technology: {
        recentInventions: string[];
        commonDevices: string[];
        emergingTrends: string[];
    };
    dailyLife: {
        typicalPrices: string[];
        commonActivities: string[];
        socialRituals: string[];
    };
}
export interface TemporalContextResult {
    status: "draft" | "final";
    specificDate: {
        year: number;
        month: string;
        day?: number;
        era: string;
    };
    seasonal: SeasonalContext;
    fashion: FashionContext;
    currentAffairs: CurrentAffairs;
    cultural: CulturalContext;
    socialAttitudes: {
        class: string[];
        gender: string[];
        race: string[];
        generalNorms: string[];
    };
    atmosphericDetails: string[];
    paragraphs: string[];
    note?: string;
    cost: number;
    durationMs: number;
}
export interface TemporalContextInputs {
    settingRefinement: SettingRefinement;
    caseData: CaseData;
    runId?: string;
    projectId?: string;
    qualityGuardrails?: string[];
}
export declare function generateTemporalContext(client: AzureOpenAIClient, inputs: TemporalContextInputs, maxAttempts?: number): Promise<TemporalContextResult>;
