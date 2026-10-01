/**
 * Prompts LLM Package - Templates for all 8 agents
 */

export { backfillSetting, refineSetting } from "./agent1-setting.js";
export { designCast } from "./agent2-cast.js";
export { coerceMotiveStrength, coerceAccessPlausibility, coerceRelationshipTension } from "./agent2-cast-boundary.js";
export { checkCast, summarizeCastCheck } from "./agent2-cast-checker.js";
export { buildCMLPrompt, generateCML } from "./agent3-cml.js";
export { provesTheAct } from "./agent3-means-link.js";
export type { MeansLinkVerdict } from "./agent3-means-link.js";
export { reviseCml } from "./agent4-revision.js";
export { buildCluePrompt, extractClues, deriveClueObservable, checkPointsToDistinctness } from "./agent5-clues.js";
export { auditFairPlay, blindReaderSimulation } from "./agent6-fairplay.js";
export { computeActSceneCounts } from "./agent7-act-counts.js";
export { formatNarrative, GOLDEN_AGE_BEATS, readOutlineCoercions } from "./agent7-narrative.js";
// R4 — the structured-output flag reader, exported so the worker's coercion telemetry can stamp
// which arm produced its counters. A count without its arm is not evidence of anything.
export {
  isAgent7StructuredOutputEnabled,
} from "./agent7-narrative-schema.js";
export { generateCharacterProfiles } from "./agent2b-character-profiles.js";
export { extractVoiceCapsule, checkVoiceCapsules, voiceGatePass, buildVoiceGateFeedback } from "./agent2b-voice-capsule.js";
export type {
  VoiceCapsule,
  VoiceRegister,
  HumourFrequency,
  VoiceCapsuleIssue,
  VoiceCapsuleSeverity,
  VoiceCapsuleMetrics,
  VoiceCapsuleCheckResult,
  VoiceCapsuleCheckOptions,
} from "./agent2b-voice-capsule.js";
export { generateLocationProfiles, buildLocationProfilesPrompt } from "./agent2c-location-profiles.js";
export { extractLocationSpine, checkLocationSpine } from "./agent2c-location-spine.js";
export {
  parseSceneGateMode,
  checkLocationDistinctness,
  checkCrimeSceneProfiled,
  buildSceneGateFeedback,
} from "./agent2c-location-distinctness.js";
export type {
  SceneGateMode,
  LocationDistinctnessIssue,
  LocationDistinctnessResult,
  CrimeSceneAuditResult,
} from "./agent2c-location-distinctness.js";
export type {
  LocationSpine,
  LocationSpinePlace,
  LocationSpineType,
  LocationBaselinePalette,
  LocationSpineCheckResult,
} from "./agent2c-location-spine.js";
export { generateTemporalContext, deriveSeasonFromMonth } from "./agent2d-temporal-context.js";
export { generateBackgroundContext } from "./agent2e-background-context.js";
export { deriveBackgroundContext, BACKDROP_SUMMARY_STUB } from "./agent2e-background-derive.js";
export type { DeriveBackgroundContextInputs } from "./agent2e-background-derive.js";
export { deriveStoryTitle } from "./story-title.js";
export {
  generateHardLogicDevices,
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
} from "./agent3b-hard-logic-devices.js";
export { findUnplantedDiscriminatingClues } from "./agent3-discriminating-planting.js";
// 17-hitting-90 P1.3 — v2 reads the same means-link trace v1 does; one splitter, two callers.
export { splitMeansLinkTrace } from "./prose-contract/means-link-trace.js";
export type { UnplantedDiscriminatingClues } from "./agent3-discriminating-planting.js";
export {
  AGENT3B_PLAUSIBILITY_FLOOR,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  judgeMechanismPlausibility,
  buildPlausibilityJudgeFeedback,
} from "./agent3b-plausibility-judge.js";
export type {
  PlausibilityJudgeMode,
  PlausibilityJudgeResult,
  PlausibilityJudgeContext,
} from "./agent3b-plausibility-judge.js";
export { compileSensoryAtoms } from "./agent2c-sensory-atoms.js";
export type { MacroArcEntry } from "./types/macro-arc.js";
export { auditNovelty } from "./agent8-novelty.js";
// Owner decision 1 (2026-09-30): the v1 prose engine is deleted. What the v2 engine, Agent 7 and scoring
// still read lives in prose-contract/ (moved, unchanged).
export { assembleScoringChapterTexts } from "./prose-contract/scoring-texts.js";
// A_87 P1/P2/P4 — the CML->outline scene-ref join. `auditCmlSceneRefs` is telemetry consumed by
// the worker at the Agent 7 boundary; the rest are the resolver and its two flag getters.
export {
  auditCmlSceneRefs,
  summariseSceneRefAudit,
} from "./prose-contract/clue-obligations.js";
export type { SceneRefAudit, SceneRefPath } from "./prose-contract/clue-obligations.js";
// A_89 B1/B2 — clue ownership and the per-chapter obligation load.
export {
  resolveClueOwnership,
  measureClueObligationLoad,
  summariseClueObligationLoad,
} from "./prose-contract/clue-obligations.js";
export type { ClueObligationLoad } from "./prose-contract/clue-obligations.js";
export {
  reconcileCmlSceneRefs,
  isSceneRefReconcileEnabled,
} from "./prose-contract/scene-ref-reconcile.js";
export type { SceneRefReconcileResult } from "./prose-contract/scene-ref-reconcile.js";

export { generateWorldDocument, degradedWorldDocument } from "./agent65-world-builder.js";
export type { WorldBuilderInputs } from "./agent65-world-builder.js";
export type { WorldDocumentResult, WorldDocumentHistoricalMoment, WorldDocumentCharacterPortrait, WorldDocumentVoiceFragment, WorldDocumentCharacterVoiceSketch, WorldDocumentLocationRegister, WorldDocumentArcTurningPoint, WorldDocumentEmotionalArc, WorldDocumentHumourEntry, WorldDocumentBreakMoment, WorldDocumentValidationConfirmations } from "./types/world-document.js";

export type {
  PromptMessages,
  CMLPromptInputs,
  CMLGenerationResult,
  SeedPattern,
} from "./types.js";

// Agent 1 types
export type { SettingInputs, SettingRefinement, SettingRefinementResult } from "./agent1-setting.js";

// Agent 2 types
export type { CastInputs, CharacterProfile, RelationshipWeb, CastDesign, CastDesignResult } from "./agent2-cast.js";
export type {
  CastCheckResult,
  CastCheckIssue,
  CastCheckMetrics,
  CastGraphMetrics,
  CastCheckOptions,
  CastCheckSeverity,
} from "./agent2-cast-checker.js";

// Agent 4 types
export type { RevisionInputs, RevisionResult } from "./agent4-revision.js";

// Agent 5 types
export type { ClueExtractionInputs, Clue, RedHerring, ClueDistributionResult } from "./agent5-clues.js";

// Agent 6 types
export type { FairPlayAuditInputs, FairPlayCheck, FairPlayViolation, FairPlayAuditResult, BlindReaderResult, StructuralAuditResult, StructuralGap } from "./agent6-fairplay.js";

// Agent 7 types
export type { NarrativeFormattingInputs, Scene, ActStructure, NarrativeOutline, OutlineCoercionCounts } from "./agent7-narrative.js";
export type { CharacterProfilesInputs, CharacterProfilesResult, CharacterProfileOutput } from "./agent2b-character-profiles.js";
export type { LocationProfilesInputs, LocationProfilesResult, PrimaryLocationProfile, KeyLocation, AtmosphereProfile, SensoryVariant } from "./agent2c-location-profiles.js";
export type { TemporalContextInputs, TemporalContextResult, SeasonalContext, FashionContext, CurrentAffairs, CulturalContext } from "./agent2d-temporal-context.js";
export type { BackgroundContextInputs, BackgroundContextResult, BackgroundContextArtifact } from "./agent2e-background-context.js";
export type { HardLogicDeviceInputs, HardLogicDeviceResult } from "./agent3b-hard-logic-devices.js";
export type { ProseGenerationResult, ProseChapter } from "./prose-contract/types.js";

// Agent 8 types
export type { NoveltyAuditInputs, SimilarityScore, NoveltyAuditResult } from "./agent8-novelty.js";
export type { HardLogicDeviceIdea } from "./types.js";

// Narrative state (sprint 2 — inter-batch style + fact tracking)
export { initNarrativeState, updateNSD, stampDeployedAtoms, checkNSDParity } from "./types/narrative-state.js";
export type { NarrativeState, LockedFact } from "./types/narrative-state.js";

export type { BackgroundContextInput } from "./types.js";

// A_73 §11.1 — the one prose-stage clearance vocabulary (was seven bodies across five packages).
export {
  CLEARANCE_TERMS_RE,
} from "./shared/clearance-vocabulary.js";

export {
  loadSeedCMLFiles,
} from "./utils/seed-loader.js";

export { generateCastNames } from "./utils/name-generator.js";
export type { NameGeneratorContext } from "./utils/name-generator.js";

// A_71 — false-time concealment direction check (external review headline defect).
export {
  checkCaseTimelineDeception,
  parseClockTime,
  // X38/X39 (REVIEW_09 §3) — the case checked against ITSELF, before any prose exists.
  checkCaseTimeCoherence,
  parseDurationMinutes,
  dialGapMinutes,
} from "./timeline-deception.js";
export type {
  TimelineDeceptionInput,
  TimelineDeceptionViolation,
  CaseTimeCoherenceViolation,
} from "./timeline-deception.js";

// REVIEW_05 §10.1 (N1) — the sentences v1's injectors wrote, kept as a detector for archived books.
export { INJECTED_SENTENCE_PATTERNS, isInjectedSentence } from "./prose-contract/injected-sentences.js";

// A_92 — humour as a story parameter, in the same family as tone and era.
export {
  UNDERSTATED_STYLES,
  SHARP_STYLES,
  humourBand,
  chapterCarriesWitBeat,
  resolveBandForRun,
} from "./humour-level.js";
export type { HumourLevel, HumourBand } from "./humour-level.js";

// A_95 M6 — a beat's job, as required fields on the scene.
export {
  beatJobFor,
  isBeatJobFieldsEnabled,
  auditBeatJobs,
} from "./agent7-beat-jobs.js";
export type { BeatJob, BeatJobAudit } from "./agent7-beat-jobs.js";

// A_96 F1/F2 — the beat sequence is a sequence, and its names are not for the reader.
export {
  isBeatSequenceRepairEnabled,
  isStripBeatTitlesEnabled,
  stripBeatPrefixFromTitle,
  repairBeatSequence,
  stripClearanceText,
} from "./agent7-beat-sequence.js";
export type { BeatSequenceRepair } from "./agent7-beat-sequence.js";


/**
 * ── PROSE ENGINE v2 (ANALYSIS_99 §10) ────────────────────────────────────────────────────────────
 *
 * `@cml/prose-engine` derives the book contract from these functions (L6, one owner per fact): clue
 * ownership, clue presence and the beat rotation. They were v1's; since owner decision 1 they live in
 * prose-contract/.
 */
export {
  getRequiredClueIdsForScene,
  chapterMentionsRequiredClue,
  tokenizeForClueObligation,
  tokenMatchesText,
} from "./prose-contract/clue-obligations.js";
export { selectWitBeat, selectDepthBeat, traitOnly } from "./prose-contract/beats.js";
export type { BeatCandidate } from "./prose-contract/beats.js";
