import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Character profile from Agent 2b
 */
export interface CharacterProfile {
    character_name?: string;
    public_persona?: string;
    private_secrets?: string;
    motive_and_alibi?: string;
    stakes?: string;
    behavioral_tells?: string;
    humour_style?: string;
}
/**
 * Character Profiles input
 */
export interface CharacterProfilesInput {
    cast?: any[];
}
/**
 * Character Profiles output
 */
export interface CharacterProfilesOutput {
    character_profiles: CharacterProfile[];
}
/**
 * Scores the Character Profiles phase (Agent 2b)
 *
 * Validation: Required fields present, profile structure
 * Quality: Narrative depth, humour style richness
 * Completeness: All cast members have profiles
 * Consistency: Names match cast, no contradictions
 */
export declare class CharacterProfilesScorer implements Scorer<CharacterProfilesInput, CharacterProfilesOutput> {
    score(input: CharacterProfilesInput, output: CharacterProfilesOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private validateProfile;
    private assessQuality;
    private scoreProfileDepth;
    private assessPersonalityDistinction;
    private checkCompleteness;
    private checkConsistency;
    private calculateGrade;
    private buildFailureReason;
}
