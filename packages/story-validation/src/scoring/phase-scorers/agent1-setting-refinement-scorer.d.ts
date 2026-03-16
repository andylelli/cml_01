import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Setting refinement from Agent 1
 */
export interface SettingRefinementOutput {
    locations?: {
        name?: string;
        layout?: string;
        key_features?: string[];
        clue_placements?: Array<{
            clue_id?: string;
            location?: string;
            physical_justification?: string;
        }>;
    }[];
    physical_constraints?: string;
    accessibility_notes?: string;
}
/**
 * Scores the Setting Refinement phase (Agent 1)
 *
 * Validation: Location layout structure
 * Quality: Physical plausibility, detail richness
 * Completeness: All locations from profiles covered
 * Consistency: Clue placements logically justified
 */
export declare class SettingRefinementScorer implements Scorer<any, SettingRefinementOutput> {
    score(input: any, output: SettingRefinementOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private isValidLocation;
    private assessQuality;
    private isPhysicallyPlausible;
    private scoreLayoutDetail;
    private checkCompleteness;
    private checkConsistency;
    private extractCMLClues;
    private clueInCML;
    private calculateGrade;
    private buildFailureReason;
}
