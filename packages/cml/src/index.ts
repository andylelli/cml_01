import { validateCml } from "./validator.js";
import {
  GROUNDING_STOP_WORDS,
  DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS,
  normalizeGroundingText,
  normalizeGroundingToken,
  collectCaseNameTokens,
  extractGroundingTerms,
  extractGroundingPhrases,
  collectReaderVisibleEvidenceCorpus,
  isGroundedAgainstCorpus,
} from "./grounding.js";
import { validateArtifact, validateArtifacts, getArtifactTypes } from "./artifact-validator.js";
import {
  CharacterProfileAccessor,
  LocationProfileAccessor,
  TemporalContextAccessor,
  ArtifactAccessor,
} from "./artifact-accessors.js";

export const packageName = "@cml/cml";
export { validateCml };
export { isVictimArchetype, isDetectiveArchetype, roleTextsOf } from "./roles.js";
// X51 (REVIEW_11 §8.1) — case-scoped locked facts: the weapon and each suspect's alibi location.
export { buildCaseScopedLockedFacts, extractWeaponFromDeathMethod, extractAlibiLocation } from "./case-locked-facts.js";
export type { CaseScopedLockedFact } from "./case-locked-facts.js";
// A_71 — the directional invariant for false-time concealments. Lives here (not in prompts-llm) so
// `validateCml` can enforce it: a case whose staged time incriminates its own culprit is a case-logic
// defect, and the cheapest place to catch it is the £0.03 end of the pipeline.
export {
  checkCaseTimelineDeception,
  checkTimelineDeception,
  parseClockTime,
  parseTimeWindow,
  // X38/X39 (REVIEW_09 §3) — the case checked against ITSELF, before prose exists.
  checkCaseTimeCoherence,
  parseDurationMinutes,
  // X38-at-source — the repair side of the same vocabulary (agent3b-run.ts).
  rewriteDurationMinutes,
  spellMinuteCount,
  dialGapMinutes,
} from "./timeline-deception.js";
export type {
  TimelineDeceptionInput,
  TimelineDeceptionViolation,
  CaseTimeCoherenceViolation,
} from "./timeline-deception.js";
export { validateArtifact, validateArtifacts, getArtifactTypes };
export {
  GROUNDING_STOP_WORDS,
  DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS,
  normalizeGroundingText,
  normalizeGroundingToken,
  collectCaseNameTokens,
  extractGroundingTerms,
  extractGroundingPhrases,
  collectReaderVisibleEvidenceCorpus,
  isGroundedAgainstCorpus,
};
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

// A_73 §11.2 — the ONE mojibake repair vocabulary, paired with story-validation's MOJIBAKE_PATTERN.
export { MOJIBAKE_REPLACEMENTS, repairMojibake } from "./mojibake.js";
