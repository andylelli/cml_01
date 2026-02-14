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

// ============================================================================
// Typed CML sub-structures (progressive typing)
// ============================================================================

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
export function getInferencePath(cml: CaseData): InferencePath {
  const c = (cml as any)?.CASE ?? cml;
  const steps = c?.inference_path?.steps;
  return {
    steps: Array.isArray(steps) ? steps : [],
  };
}

// Type alias for CML data structure (used by agents)
// Keep backward-compatible any export
export type CaseData = any;

// Alias for validateCml function (used by agents)
export { validateCml as validateCaseData };
