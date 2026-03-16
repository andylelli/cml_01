import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Background Context input (from Agent 2e)
 */
export interface BackgroundContextInput {
    era_background?: {
        decade?: string;
        tech_capabilities?: string[];
        forensic_capabilities?: string[];
        communications?: string[];
        transportation?: string[];
        social_norms?: string[];
    };
    location_background?: {
        location_type?: string;
        physical_constraints?: string[];
        security_features?: string[];
        accessibility?: string[];
        atmosphere?: string[];
    };
    constraints?: {
        prohibited_anachronisms?: string[];
        required_period_elements?: string[];
    };
}
/**
 * Background Context output (validated artifact)
 */
export type BackgroundContextOutput = BackgroundContextInput;
/**
 * Scores the Background Context generation phase (Agent 2e)
 *
 * Validation: Schema compliance, required fields
 * Quality: Detail richness, historical accuracy indicators
 * Completeness: Coverage of era and location aspects
 * Consistency: Internal coherence between era/location
 */
export declare class BackgroundContextScorer implements Scorer<BackgroundContextInput, BackgroundContextOutput> {
    score(input: BackgroundContextInput, output: BackgroundContextOutput, context: ScoringContext): Promise<PhaseScore>;
    /**
     * Validation: Schema structure and required fields
     */
    private validateStructure;
    /**
     * Quality: Detail richness and thoroughness
     */
    private assessQuality;
    /**
     * Completeness: Coverage of all expected aspects
     */
    private checkCompleteness;
    /**
     * Score era background completeness (0-100)
     */
    private scoreEraCompleteness;
    /**
     * Score location background completeness (0-100)
     */
    private scoreLocationCompleteness;
    /**
     * Consistency: Internal coherence
     */
    private checkConsistency;
    /**
     * Calculate letter grade from numeric score
     */
    private calculateGrade;
    /**
     * Build failure reason message
     */
    private buildFailureReason;
}
