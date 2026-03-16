import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Chapter prose from Agent 9
 */
export interface ChapterProse {
    chapter_number?: number;
    chapter_title?: string;
    prose?: string;
    clues_present?: string[];
    discriminating_test_present?: boolean;
}
/**
 * Prose output from Agent 9
 */
export interface ProseOutput {
    chapters: ChapterProse[];
    overall_word_count?: number;
    /**
     * Authoritative set of expected clue IDs for the visibility check.
     * Populated by adaptProseForScoring() from the union of all known ID sources
     * (clue_to_scene_mapping + clueDistribution + discriminating_test + clue_registry).
     * When present, checkCompleteness() uses this instead of re-deriving IDs from the CML
     * alone — ensuring the scorer and the adapter share the same ID namespace.
     */
    expected_clue_ids?: string[];
    fair_play_validation?: {
        all_clues_visible?: boolean;
        discriminating_test_complete?: boolean;
        no_solution_spoilers?: boolean;
        /** D7: true when no clue is first revealed in the same chapter where detective deduction/conclusion language appears. */
        fair_play_timing_compliant?: boolean;
        fair_play_timing_violations?: Array<{
            clue_id: string;
            chapter: number;
        }>;
    };
    completeness_diagnostics?: {
        expected_clue_ids_count?: number;
        visible_clue_ids_count?: number;
        clue_visibility_ratio?: number;
        missing_clue_ids?: string[];
    };
}
export declare class ProseScorer implements Scorer<any, ProseOutput> {
    private targetLength;
    score(input: any, output: ProseOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private isValidChapter;
    private assessQuality;
    private scoreProseQuality;
    private scoreReadability;
    private checkCompleteness;
    private calculateTotalWordCount;
    private extractCMLClues;
    private clueInProse;
    private checkConsistency;
    private checkCharacterNameConsistency;
    private checkSettingFidelity;
    private calculateGrade;
    private buildFailureReason;
}
