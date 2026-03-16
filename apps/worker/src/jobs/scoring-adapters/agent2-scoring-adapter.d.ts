import type { CastDesign } from "@cml/prompts-llm";
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
export interface CastDesignOutput {
    cast: CastMember[];
}
export declare function adaptCastForScoring(castDesign: CastDesign): CastDesignOutput;
