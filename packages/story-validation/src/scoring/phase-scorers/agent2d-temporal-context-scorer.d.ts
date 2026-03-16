import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Temporal context from Agent 2d
 */
export interface TemporalContextOutput {
    specific_date?: string;
    time_of_day?: string;
    season?: string;
    weather_patterns?: string;
    fashion_and_attire?: string;
    seasonal_activities?: string;
}
/**
 * Scores the Temporal Context phase (Agent 2d)
 *
 * Validation: Date/time specificity
 * Quality: Temporal detail richness
 * Completeness: All temporal aspects covered
 * Consistency: Season/weather/fashion alignment with era
 */
export declare class TemporalContextScorer implements Scorer<any, TemporalContextOutput> {
    score(input: any, output: TemporalContextOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private checkDateSpecificity;
    private checkTimeSpecificity;
    private assessQuality;
    private scoreWeatherDetail;
    private scoreFashionDetail;
    private checkCompleteness;
    private hasSubstantialSpecificDate;
    private hasSubstantialTimeOfDay;
    private hasSubstantialSeason;
    private hasSubstantialWeather;
    private scoreOptionalRichness;
    private checkConsistency;
    private checkSeasonWeatherConsistency;
    private checkFashionEraConsistency;
    private checkDateEraConsistency;
    private calculateGrade;
    private buildFailureReason;
}
