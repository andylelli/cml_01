import { validateCml } from "./validator.js";
import { validateArtifact, validateArtifacts, getArtifactTypes } from "./artifact-validator.js";
import {
  CharacterProfileAccessor,
  LocationProfileAccessor,
  TemporalContextAccessor,
  ArtifactAccessor,
} from "./artifact-accessors.js";

export const packageName = "@cml/cml";
export { validateCml };
export { validateArtifact, validateArtifacts, getArtifactTypes };
export {
  CharacterProfileAccessor,
  LocationProfileAccessor,
  TemporalContextAccessor,
  ArtifactAccessor,
};

// Type alias for CML data structure (used by agents)
export type CaseData = any;

// Alias for validateCml function (used by agents)
export { validateCml as validateCaseData };
