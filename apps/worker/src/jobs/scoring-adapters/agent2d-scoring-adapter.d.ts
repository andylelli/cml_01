import type { TemporalContextResult, SettingRefinement } from "@cml/prompts-llm";
export interface ScorerTemporalContextOutput {
    specific_date?: string;
    time_of_day?: string;
    season?: string;
    weather_patterns?: string;
    fashion_and_attire?: string;
    seasonal_activities?: string;
}
export declare function adaptTemporalContextForScoring(temporal: TemporalContextResult, setting?: SettingRefinement): ScorerTemporalContextOutput;
