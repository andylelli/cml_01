import type { CharacterProfileOutput } from "@cml/prompts-llm";
export interface CharacterProfile {
    character_name?: string;
    public_persona?: string;
    private_secrets?: string;
    motive_and_alibi?: string;
    stakes?: string;
    behavioral_tells?: string;
    humour_style?: string;
}
export interface CharacterProfilesOutput {
    character_profiles: CharacterProfile[];
}
export declare function adaptCharacterProfilesForScoring(profiles: CharacterProfileOutput[]): CharacterProfilesOutput;
