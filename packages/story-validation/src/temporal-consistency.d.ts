export type CanonicalSeason = 'spring' | 'summer' | 'autumn' | 'winter';
export declare const MONTH_TO_SEASON: Record<string, CanonicalSeason>;
export declare const MONTH_ABBREVIATIONS: Record<string, string>;
export declare const MONTH_TO_FORBIDDEN_SEASONS: Record<string, CanonicalSeason[]>;
export interface TemporalConsistencyAnalysis {
    mentionedMonths: string[];
    expectedSeasons: CanonicalSeason[];
    conflictingSeasons: CanonicalSeason[];
}
export declare function analyzeTemporalConsistency(text: string, temporalMonth?: string): TemporalConsistencyAnalysis;
