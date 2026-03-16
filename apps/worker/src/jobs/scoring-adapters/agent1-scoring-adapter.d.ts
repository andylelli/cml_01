import type { SettingRefinement } from "@cml/prompts-llm";
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
export declare function adaptSettingForScoring(setting: SettingRefinement): SettingRefinementOutput;
