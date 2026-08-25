/**
 * Prompts LLM Package - Templates for all 8 agents
 */

export { refineSetting } from "./agent1-setting.js";
export { designCast } from "./agent2-cast.js";
export { checkCast, summarizeCastCheck } from "./agent2-cast-checker.js";
export { buildCMLPrompt, generateCML } from "./agent3-cml.js";
export { buildRevisionPrompt, reviseCml } from "./agent4-revision.js";
export {
  patchCmlNode,
  validateContract,
  applyPatchInCode,
  parseErrorPath,
  pathToString,
  getAtPath,
  setAtPath,
  makeLlmPatchProposer,
} from "./agent4-patch.js";
export type {
  PathSegment,
  CmlDoc,
  Validator,
  PatchRequest,
  PatchProposer,
  PatchRunResult,
  PatchRunOptions,
  AppliedPatch,
  RejectedPatch,
  ContractResult,
} from "./agent4-patch.js";
export { buildCluePrompt, extractClues, deriveClueObservable, deriveClueDescription, checkPointsToDistinctness } from "./agent5-clues.js";
export { buildFairPlayPrompt, auditFairPlay, blindReaderSimulation } from "./agent6-fairplay.js";
export { buildNarrativePrompt, formatNarrative, GOLDEN_AGE_BEATS, GOLDEN_AGE_BEAT_GUIDE } from "./agent7-narrative.js";
// R4 — the structured-output flag reader, exported so the worker's coercion telemetry can stamp
// which arm produced its counters. A count without its arm is not evidence of anything.
export {
  isAgent7StructuredOutputEnabled,
  NARRATIVE_OUTLINE_SCHEMA,
  NARRATIVE_OUTLINE_SCHEMA_NAME,
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
  locationAtomSet,
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
export { deriveBackgroundContext, rankAnchors, MAX_CAST_ANCHORS, BACKDROP_SUMMARY_STUB } from "./agent2e-background-derive.js";
export type { DeriveBackgroundContextInputs } from "./agent2e-background-derive.js";
export { assembleProseBrief, checkProseBrief } from "./prose-brief.js";
export { deriveStoryTitle, isGenerationResidueTitle } from "./story-title.js";
export type { ProseBrief, ProseBriefHealth, AssembleProseBriefInputs } from "./prose-brief.js";
export {
  buildHardLogicDevicePrompt,
  generateHardLogicDevices,
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
  selectThemeCoherentPrimary,
} from "./agent3b-hard-logic-devices.js";
export { findUnplantedDiscriminatingClues } from "./agent3-discriminating-planting.js";
export type { UnplantedDiscriminatingClues } from "./agent3-discriminating-planting.js";
export {
  AGENT3B_PLAUSIBILITY_FLOOR,
  parsePlausibilityJudgeMode,
  plausibilityGatePass,
  buildPlausibilityJudgePrompt,
  judgeMechanismPlausibility,
  buildPlausibilityJudgeFeedback,
} from "./agent3b-plausibility-judge.js";
export type {
  PlausibilityJudgeMode,
  PlausibilityJudgeResult,
  PlausibilityJudgeContext,
} from "./agent3b-plausibility-judge.js";
export { generateProse, resolveVictimName, buildCharacterPersonalityBlock, buildLocationProfilesBlock, buildTemporalContextBlock, selectSensoryVariant, compileSensoryAtoms, extractBeatFingerprints, buildMacroArcPlan, RESOLUTION_RE, buildResolutionBackstopSentence, blindReadProse, isProseBlindReaderEnabled, isAtomicLockedFactValue } from "./agent9-prose.js";
export type { ProseBlindReadResult } from "./agent9-prose.js";
export type { BeatFingerprint, MacroArcEntry } from "./agent9-prose.js";
export { precompileStoryContract, resolveVictimContract } from "./story-contract.js";
export type { StoryContract, VictimContract, VictimRoleSource, SensoryAtomSet, LockedFactContract } from "./story-contract.js";
export { ARC_POS_TO_SCENE_TYPE, ARC_POSITION_REGISTER, HIGH_TENSION_POSITIONS } from "./constants/arc-position.js";
export { buildNoveltyPrompt, auditNovelty } from "./agent8-novelty.js";
// A_57 D3 — mechanism–environment consistency
export { deriveMechanismEnvironmentPrecondition, checkMechanismEnvironmentConsistency } from "./mechanism-environment.js";
export type { MechanismEnvironmentPrecondition, MechanismEnvironmentCheck, EnvironmentFactor, DeviceLike, AtmosphereLike } from "./mechanism-environment.js";
// A_57 §9.1 — the Story World-State ledger (single source of truth + contradiction gate)
export { buildStoryWorldState, runContradictionGate } from "./world-state.js";
export type { StoryWorldState, WorldStateFact, WorldStateCharacter, WorldStateConflict, WorldStateConflictKind, ContradictionGateResult, WorldStateInputs, CharacterGender } from "./world-state.js";
// A_57 §9.2 — the discriminator verifier (logical soundness over the suspect partition)
export { verifyDiscriminator } from "./discriminator-verifier.js";
export type { DiscriminatorVerdict, DiscriminatorIssue, DiscriminatorIssueKind, DiscriminatorVerifierInputs } from "./discriminator-verifier.js";
// A_61 RC2.5 — deterministic case-soundness repair (repair-not-abort; the prerequisite for promoting
// the contradiction/discriminator gates to blocking).
export { repairCaseSoundness } from "./case-soundness-repair.js";
export type { CaseSoundnessRepairResult } from "./case-soundness-repair.js";
// First-principles LLD §5.1/§6.1 — the Story Bible (single dereference source) + source-level gates
export { buildStoryBible, runBibleGates, resolveDiscriminatingTestChapter } from "./story-bible.js";
export type {
  StoryBible,
  StoryBibleInputs,
  BibleClock,
  BibleVoice,
  BibleDiscriminatingTest,
  ChapterBeat,
  BibleGateResult,
} from "./story-bible.js";
// First-principles LLD P3/P4/P5 — the scoped regen-repair loop, its concrete LLM bridge, the
// verifier→Bible→regen glue, and the critique→rewrite craft pass. Surfaced at the package boundary so
// the worker orchestrator can wire them (all default-off behind their flags).
export {
  runRegenRepair,
  regenThenValidate,
  makeRegenFn,
  buildRegenPrompt,
  buildRegenRequest,
  composeChapterValidator,
  runClueRegenPass,
  runClearanceRegenPass,
  runSuspectEliminationRegenPass,
  runScaffoldRegenPass,
  applyScaffoldExhaustionFloor,
  culpritEvidenceLinkInText,
  assembleScoringChapterTexts,
  detectDualValueAtShipScope,
  runDualValueFullStoryResidualPass,
  runTemplateLeakageRegenPass,
  runDualValueContrastRegenPass,
  runResolutionRegenPass,
  runCulpritEvidenceRegenPass,
  runCaseTransitionRegenPass,
  runMechanismRevealRegenPass,
  runVoiceLeakageRegenPass,
  // Agent 7.5 geometry — the negative-obligation pass (§8.5/§8.6).
  runAftermathRepeatRegenPass,
  // N7 — the reveal repair, on a channel that may modify (REVIEW_08 §3).
  runRevealRepairRegenPass,
  runInsertionRegenPass,
  pronounsFromBible,
  genderMapFromBible,
  deriveMechanismTerms,
  chapterFullyExplainsMechanism,
  resolveStageModel,
  // A_69 Increment 3 — whole-story read-only diagnostic (consumed by agent9-run at the ship layer).
  resolveFullStoryDiagnosticMode,
  runFullStoryDiagnostic,
  applyFullStoryDiagnosticFindings,
  anchorFullStoryFindings,
  parseFullStoryFindings,
  buildFullStoryDiagnosticPrompt,
  FULL_STORY_FINDING_CLASSES,
  buildDeterministicClueParagraphs,
  // A_71 — clearance-paste tally, the AGENT9_REGEN_SUSPECT_ELIM probe's read path.
  getDeterministicClearancePasteTelemetry,
  resetDeterministicClearancePasteTelemetry,
  getDeterministicCluePasteTelemetry,
  resetDeterministicCluePasteTelemetry,
} from "./agent9-prose.js";
export type {
  ProseDefect,
  ProseDefectKind,
  RegenRequest,
  RegenFn,
  ChapterValidator,
  ClueRegenPassResult,
  InsertionRegenPassResult,
  FullStoryFinding,
  FullStoryFindingClass,
  FullStoryDiagnosticMode,
  FullStoryDiagnosticResult,
} from "./agent9-prose.js";
export { generateWorldDocument } from "./agent65-world-builder.js";
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
export type { NarrativeFormattingInputs, Scene, ActStructure, NarrativeOutline } from "./agent7-narrative.js";
export type { CharacterProfilesInputs, CharacterProfilesResult, CharacterProfileOutput } from "./agent2b-character-profiles.js";
export type { LocationProfilesInputs, LocationProfilesResult, PrimaryLocationProfile, KeyLocation, AtmosphereProfile, SensoryVariant } from "./agent2c-location-profiles.js";
export type { TemporalContextInputs, TemporalContextResult, SeasonalContext, FashionContext, CurrentAffairs, CulturalContext } from "./agent2d-temporal-context.js";
export type { BackgroundContextInputs, BackgroundContextResult, BackgroundContextArtifact } from "./agent2e-background-context.js";
export type { HardLogicDeviceInputs, HardLogicDeviceResult } from "./agent3b-hard-logic-devices.js";
export type { ProseGenerationInputs, ProseGenerationResult, ProseChapter } from "./agent9-prose.js";

// Agent 8 types
export type { NoveltyAuditInputs, SimilarityScore, NoveltyAuditResult } from "./agent8-novelty.js";
export type { HardLogicDeviceIdea } from "./types.js";

// Narrative state (sprint 2 — inter-batch style + fact tracking)
export { initNarrativeState, updateNSD, migrateNarrativeState, stampDeployedAtoms, checkNSDParity } from "./types/narrative-state.js";
export type { NarrativeState, LockedFact } from "./types/narrative-state.js";

// Asset library (Phase 2/5 — obligation stamping + texture selection + diagnostics)
export { buildAssetLibrary, selectChapterAtoms, buildAssetDiagnosticReport } from "./asset-library.js";
export type { Asset, AssetLibrary } from "./types/asset-library.js";
export {
  computeChapterObligation,
  validateChapterReadiness,
} from "./contracts/chapter-obligation-contract.js";
export type { ChapterObligation } from "./contracts/chapter-obligation-contract.js";
export {
  buildProseRequestContract,
  validateRequestContract,
} from "./contracts/prose-request-contract.js";
export type { ProseRequestContract } from "./contracts/prose-request-contract.js";
export type {
  BatchCommitRecord,
  BatchGateOutcome,
  BatchGateName,
} from "./contracts/batch-commit-record.js";
export type { ReleaseGateAudit, ReleaseGateStatus } from "./contracts/release-gate-audit.js";
export {
  classifyFailure,
  buildRetryFeedback,
  shouldContinueRetry,
} from "./retry-protocol.js";
export type { RetryPacket, RetryFailureClass } from "./retry-protocol.js";
export type { BackgroundContextInput } from "./types.js";

// Shared exports for other agents (will expand in future)
export {
  MYSTERY_EXPERT_SYSTEM,
  CML_SPECIALIST_SYSTEM,
  GROUNDING_PRINCIPLE,
  FAIR_PLAY_CHECKLIST,
} from "./shared/system.js";

export {
  buildEraConstraints,
  buildLocationConstraints,
} from "./shared/constraints.js";

export {
  CML_2_0_SCHEMA_SUMMARY,
  AXIS_TYPE_DESCRIPTIONS,
} from "./shared/schemas.js";
// A_73 §11.1 — the one prose-stage clearance vocabulary (was seven bodies across five packages).
export {
  CLEARANCE_TERMS_RE,
  CLEARANCE_TERMS_WITH_KILLER_RE,
  CLEARANCE_EVIDENCE_RE,
  CLEARANCE_TERMS_WIDE_ONLY,
} from "./shared/clearance-vocabulary.js";

export {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "./utils/seed-loader.js";

export { generateCastNames } from "./utils/name-generator.js";
export type { NameGeneratorContext } from "./utils/name-generator.js";

export {
  resolveDesignModel,
  resolveProseModel,
  resolveBaseModel,
} from "./utils/model-tiers.js";

// A_71 — false-time concealment direction check (external review headline defect).
export {
  checkTimelineDeception,
  checkCaseTimelineDeception,
  parseClockTime,
  parseTimeWindow,
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

// REVIEW_05 §10.1 (N1) — the sentences the pipeline writes for itself, and their patterns.
export {
  INJECTED_SENTENCE_PATTERNS,
  isInjectedSentence,
  buildCulpritEvidenceSentence,
  buildSuspectClearanceSentence,
} from "./agent9-prose/injection-templates.js";

// REVIEW_05 §10.6 (X4) — the rules that bind the model, so injector output can be measured
// against the standard the model is held to.
export {
  RESOLUTION_VERDICT_CLOSER_RULES,
  RESOLUTION_VERDICT_CLOSER_MESSAGE,
  findModelBoundRuleViolations,
} from "./agent9-prose/lint.js";
export type { ModelBoundSentenceRule } from "./agent9-prose/lint.js";
