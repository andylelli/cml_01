import type { BackgroundContextArtifact, SettingRefinement } from "@cml/prompts-llm";
export interface BackgroundContextOutput {
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
export declare function adaptBackgroundContextForScoring(bg: BackgroundContextArtifact, setting: SettingRefinement): BackgroundContextOutput;
