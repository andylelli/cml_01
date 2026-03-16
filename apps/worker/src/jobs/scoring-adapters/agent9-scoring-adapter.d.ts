import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { ClueEvidenceExtractionResult } from "./shared.js";
export interface ChapterProse {
    chapter_number: number;
    chapter_title: string;
    prose: string;
    clues_present?: string[];
    discriminating_test_present?: boolean;
}
export interface ProseOutput {
    chapters: ChapterProse[];
    /**
     * Union of all known clue IDs (clue_to_scene_mapping + ClueDistributionResult +
     * discriminating_test.evidence_clues + clue_registry) so the scorer can check
     * visibility against the same namespace used for detection.
     */
    expected_clue_ids?: string[];
    fair_play_validation?: {
        all_clues_visible?: boolean;
        discriminating_test_complete?: boolean;
        no_solution_spoilers?: boolean;
        /** D7: true when no clue is first revealed in the same chapter where deduction/conclusion language appears. */
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
/**
 * Extract clue visibility and chapter-level evidence anchors from prose.
 * This powers both scorer clue visibility and NSD-vs-visibility divergence telemetry.
 */
export declare function collectClueEvidenceFromProse(proseChapters: any[], cmlCase?: any, clueDistribution?: ClueDistributionResult): ClueEvidenceExtractionResult;
export declare function adaptProseForScoring(proseChapters: any[], cmlCase?: any, // pass (cml as any).CASE for clue extraction
clueDistribution?: ClueDistributionResult): ProseOutput;
