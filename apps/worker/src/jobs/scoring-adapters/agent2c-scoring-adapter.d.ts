import type { LocationProfilesResult } from "@cml/prompts-llm";
export interface LocationProfile {
    location_name?: string;
    visual_details?: string;
    sounds?: string;
    smells?: string;
    tactile?: string;
    taste?: string;
    geographic_grounding?: string;
    atmosphere_and_mood?: string;
}
export interface LocationProfilesOutput {
    location_profiles: LocationProfile[];
}
export declare function adaptLocationsForScoring(locResult: LocationProfilesResult): LocationProfilesOutput;
