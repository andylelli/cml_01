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
  describeTimelineArithmeticCoverage,
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

// Phase 0 (measurement only) — the temporal spine. Nothing in the pipeline reads this yet; see the
// module header for why a second, stricter time reader exists beside `parseClockTime`.
export {
  MINUTES_PER_DAY,
  alternativeRenderings,
  buildTemporalSpine,
  isValidStructuredTime,
  parseDurationValue,
  parseTemporalValue,
  renderClockWords,
  renderStructuredTime,
  structuredAbsolute,
  structuredTimesCollide,
  toStructuredTime,
} from "./temporal-spine.js";
export type {
  ArithmeticShape,
  Meridiem,
  SpineDuration,
  SpineFactInput,
  SpineFinding,
  SpineInstant,
  TemporalReading,
  StructuredTime,
  TemporalSpine,
} from "./temporal-spine.js";

// Phase 1 — declaration-driven derivation checking, built on the spine. Flag-gated at the call site.
export { checkDeclaredDerivations, summariseSpine } from "./declared-derivations.js";

export {
  alibiSpanDisagreesWithProse,
  alibiSpanFromWindow,
  alibiSpanToWindow,
  extractSpanLocation,
  isValidAlibiSpan,
  renderAlibiWindow,
  repairActualCovered,
  type AlibiSpan,
} from "./alibi-span.js";

export {
  findDecorativeTimeFacts,
  summariseDecorativeTimes,
  type DecorativeTimeFact,
} from "./decorative-times.js";

// A_89 A1 — temporal closure: can the deception's interval contain the event it conceals?
export { checkTemporalClosure, isTemporalClosureCheckEnabled } from "./temporal-closure.js";
export type { TemporalClosureVerdict } from "./temporal-closure.js";
// A_89 A2 — one derived timeline, so the case's numbers exist once.
export { deriveCaseTimeline, summariseCaseTimeline, isCaseTimelineEnabled } from "./case-timeline.js";
export type { CaseTimeline } from "./case-timeline.js";
export type { TemporalClosureResult, StatedInterval } from "./temporal-closure.js";

// A_90 Move 2 — the culprit's alibi is computed from the two death times; planned before Agent 3,
// rendered after it only when the emitted window breaks an invariant.
export {
  dialWindowContains,
  isAlibiPlanEnabled,
  isDeceptionPairEnabled,
  planAlibiBranches,
  planCulpritAlibiSpan,
  readLockedClocksAndDurations,
  renderDialDigits,
  renderPlannedCulpritAlibi,
  selectDeceptionPair,
} from "./alibi-plan.js";
export type { AlibiPlanBranch, DeceptionPair, LockedClock, LockedDuration, PlannedAlibiChange } from "./alibi-plan.js";

// A_90 Moves 1 and 3 — one chronology solved from the device; every clock value must resolve to it.
export {
  CLOCK_PHRASE_RE,
  checkChronologyCoherence,
  deriveCaseChronology,
  extractClockValues,
  findUnanchoredClockValues,
  isChronologyEnabled,
  isChronologyErrorsEnabled,
  parseDurationAnchor,
  renderCaseTimes,
  renderChronologyBlock,
  solveLockedChronology,
  summariseChronology,
} from "./chronology.js";
export type {
  CaseTimeRender,
  ChronoEvent,
  ChronoInterval,
  Chronology,
  ChronologyFactInput,
  ChronologyFinding,
  ClockAnchoring,
  ClockValue,
  DurationAnchor,
  UnanchoredClockValue,
  UnplacedDuration,
} from "./chronology.js";

// ANALYSIS_109 — formal checks over one parse of the case (M1 timeline network, M2 reader model,
// M3 proof core, M4 route). Pure; report-only until each earns a flag.
export * from "./case-logic/index.js";
