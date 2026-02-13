import { validateCml } from "./validator.js";
import { validateArtifact, validateArtifacts, getArtifactTypes } from "./artifact-validator.js";
import { CharacterProfileAccessor, LocationProfileAccessor, TemporalContextAccessor, ArtifactAccessor } from "./artifact-accessors.js";
export declare const packageName = "@cml/cml";
export { validateCml };
export { validateArtifact, validateArtifacts, getArtifactTypes };
export { CharacterProfileAccessor, LocationProfileAccessor, TemporalContextAccessor, ArtifactAccessor, };
export type CaseData = any;
export { validateCml as validateCaseData };
