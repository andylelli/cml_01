import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Location profile from Agent 2c
 */
export interface LocationProfile {
    location_name?: string;
    visual_details?: string;
    sounds?: string;
    smells?: string;
    tactile?: string;
    taste?: string;
    geographic_grounding?: string;
    atmosphere_and_mood?: string;
}
/**
 * Location Profiles output
 */
export interface LocationProfilesOutput {
    location_profiles: LocationProfile[];
}
/**
 * Scores the Location Profiles phase (Agent 2c)
 *
 * Validation: All 5 senses present
 * Quality: Sensory richness, specificity
 * Completeness: All key locations covered
 * Consistency: Atmosphere alignment with era/setting
 */
export declare class LocationProfilesScorer implements Scorer<any, LocationProfilesOutput> {
    score(input: any, output: LocationProfilesOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private validateProfile;
    private assessQuality;
    private scoreSensoryRichness;
    private isGeographicallySpecific;
    private checkCompleteness;
    private checkConsistency;
    private isAtmosphereConsistent;
    private calculateGrade;
    private buildFailureReason;
}
