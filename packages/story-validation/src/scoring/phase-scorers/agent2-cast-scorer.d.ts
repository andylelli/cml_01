import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Cast member from CML
 */
export interface CastMember {
    name: string;
    age_range?: string;
    role_archetype?: string;
    relationships?: string[];
    public_persona?: string;
    private_secret?: string;
    motive_seed?: string;
    motive_strength?: string;
    alibi_window?: string;
    access_plausibility?: string;
    opportunity_channels?: string[];
    behavioral_tells?: string[];
    stakes?: string;
    evidence_sensitivity?: string[];
    culprit_eligibility?: string;
    culpability?: string;
}
/**
 * Cast Design input (from user + previous agents)
 */
export interface CastDesignInput {
    cast_size?: number;
    primary_axis?: string;
}
/**
 * Cast Design output (CML cast array)
 */
export interface CastDesignOutput {
    cast: CastMember[];
}
/**
 * Scores the Cast Design phase (Agent 2)
 *
 * Validation: Schema compliance, required fields per character
 * Quality: Character depth, motive strength, relationship complexity
 * Completeness: Cast size appropriate, all roles covered
 * Consistency: Relationship reciprocity, culprit designation validity
 */
export declare class CastDesignScorer implements Scorer<CastDesignInput, CastDesignOutput> {
    score(input: CastDesignInput, output: CastDesignOutput, context: ScoringContext): Promise<PhaseScore>;
    /**
     * Validation: Schema structure and required fields
     */
    private validateStructure;
    /**
     * Validate individual character
     */
    private validateCharacter;
    /**
     * Quality: Character depth and richness
     */
    private assessQuality;
    /**
     * Score individual character depth (0-100)
     */
    private scoreCharacterDepth;
    /**
     * Assess relationship network quality
     */
    private assessRelationshipQuality;
    /**
     * Completeness: Cast size and coverage
     */
    private checkCompleteness;
    /**
     * Consistency: Internal coherence
     */
    private checkConsistency;
    /**
     * Check culprit eligibility designation consistency
     */
    private checkCulpritEligibility;
    /**
     * Check relationship reciprocity
     */
    private checkRelationshipReciprocity;
    /**
     * Calculate letter grade
     */
    private calculateGrade;
    /**
     * Build failure reason
     */
    private buildFailureReason;
}
