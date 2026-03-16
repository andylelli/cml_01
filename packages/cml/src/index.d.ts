import { validateCml } from "./validator.js";
import { validateArtifact, validateArtifacts, getArtifactTypes } from "./artifact-validator.js";
import { CharacterProfileAccessor, LocationProfileAccessor, TemporalContextAccessor, ArtifactAccessor } from "./artifact-accessors.js";
export declare const packageName = "@cml/cml";
export { validateCml };
export { validateArtifact, validateArtifacts, getArtifactTypes };
export { CharacterProfileAccessor, LocationProfileAccessor, TemporalContextAccessor, ArtifactAccessor, };
/** Typed inference path step — matches CML 2.0 schema */
export interface InferenceStep {
    observation: string;
    correction: string;
    effect: string;
    required_evidence?: string[];
    reader_observable?: boolean;
}
/** Typed inference path */
export interface InferencePath {
    steps: InferenceStep[];
}
/** Typed fair play block */
export interface FairPlayBlock {
    all_clues_visible: boolean;
    no_special_knowledge_required: boolean;
    no_late_information: boolean;
    reader_can_solve: boolean;
    explanation: string;
}
/** Helper to safely extract typed inference path from CaseData */
export declare function getInferencePath(cml: CaseData): InferencePath;
export type CaseData = any;
export { validateCml as validateCaseData };
