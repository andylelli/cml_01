import type { NarrativeOutline } from "@cml/prompts-llm";
import type { ClueRef } from "./shared.js";
export interface ScorerChapter {
    chapter_number?: number;
    chapter_title?: string;
    scenes?: Array<{
        scene_id?: string;
        location?: string;
        characters_present?: string[];
        action?: string;
    }>;
    clues_introduced?: string[];
}
export interface ScorerNarrativeOutlineOutput {
    chapters: ScorerChapter[];
    discriminating_test_scene?: {
        chapter_number?: number;
        scene_id?: string;
        description?: string;
    };
}
export declare function adaptNarrativeForScoring(narrative: NarrativeOutline, castMembers?: Array<{
    name: string;
}>, clueList?: ClueRef[]): ScorerNarrativeOutlineOutput;
