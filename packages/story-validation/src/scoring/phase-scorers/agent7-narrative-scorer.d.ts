import { Scorer, PhaseScore, ScoringContext } from '../types.js';
/**
 * Chapter from narrative outline
 */
export interface Chapter {
    chapter_number?: number;
    chapter_title?: string;
    scenes?: Scene[];
    clues_introduced?: string[];
}
/**
 * Scene from narrative outline
 */
export interface Scene {
    scene_id?: string;
    location?: string;
    characters_present?: string[];
    action?: string;
}
/**
 * Narrative outline from Agent 7
 */
export interface NarrativeOutlineOutput {
    chapters: Chapter[];
    discriminating_test_scene?: {
        chapter_number?: number;
        scene_id?: string;
        description?: string;
    };
}
/**
 * Scores the Narrative Outline phase (Agent 7)
 *
 * Validation: 20/30/42 chapters (short/medium/long), scene structure
 * Quality: Pacing, scene detail
 * Completeness: All CML clues present, discriminating test
 * Consistency: Character names match cast
 */
export declare class NarrativeScorer implements Scorer<any, NarrativeOutlineOutput> {
    private getExpectedChapters;
    score(input: any, output: NarrativeOutlineOutput, context: ScoringContext): Promise<PhaseScore>;
    private validateStructure;
    private isValidChapter;
    private assessQuality;
    private scoreSceneDetail;
    private analyzeClueDistribution;
    private checkCompleteness;
    private extractCMLClues;
    private extractOutlineClues;
    private clueInOutline;
    private checkConsistency;
    private calculateGrade;
    private buildFailureReason;
}
