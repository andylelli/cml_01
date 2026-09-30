/**
 * Prompts LLM Package - Templates for all 8 agents
 */

export { refineSetting } from "./agent1-setting.js";
export { designCast } from "./agent2-cast.js";
export { checkCast, summarizeCastCheck } from "./agent2-cast-checker.js";
export { buildCMLPrompt, generateCML } from "./agent3-cml.js";
export { provesTheAct } from "./agent3-means-link.js";
export type { MeansLinkVerdict } from "./agent3-means-link.js";
export { reviseCml } from "./agent4-revision.js";
export {
  patchCmlNode,
  pathToString,
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
export type { ProseBrief, ProseBriefHealth, AssembleProseBriefInputs } from "./prose-brief.js";
export {
  generateHardLogicDevices,
  extractThemeMechanismFamilies,
  scoreDeviceThemeMatch,
} from "./agent3b-hard-logic-devices.js";
export { findUnplantedDiscriminatingClues } from "./agent3-discriminating-planting.js";
// 17-hitting-90 P1.3 — v2 reads the same means-link trace v1 does; one splitter, two callers.
export { splitMeansLinkTrace } from "./agent9-prose/discriminating.js";
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
export { generateProse, resolveVictimName, extractBeatFingerprints, buildMacroArcPlanFromBeats, RESOLUTION_RE, buildResolutionBackstopSentence, blindReadProse, isProseBlindReaderEnabled, isAtomicLockedFactValue, getForbiddenTimeForms, isWordFormTimeValue } from "./agent9-prose.js";
export { compileSensoryAtoms } from "./agent2c-sensory-atoms.js";
export type { ProseBlindReadResult } from "./agent9-prose.js";
export type { BeatFingerprint, MacroArcEntry } from "./agent9-prose.js";
export { precompileStoryContract, resolveVictimContract } from "./story-contract.js";
export type { StoryContract, VictimContract, VictimRoleSource, SensoryAtomSet, LockedFactContract } from "./story-contract.js";
export { auditNovelty } from "./agent8-novelty.js";
// A_57 D3 — mechanism–environment consistency
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
export { resolveDiscriminatingTestChapter } from "./story-bible.js";
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
  makeRegenFn,
  buildRegenRequest,
  composeChapterValidator,
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
  genderMapFromBible,
  deriveMechanismTerms,
  resolveStageModel,
  // A_69 Increment 3 — whole-story read-only diagnostic (consumed by agent9-run at the ship layer).
  resolveFullStoryDiagnosticMode,
  runFullStoryDiagnostic,
  applyFullStoryDiagnosticFindings,
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
  InsertionRegenPassResult,
  FullStoryFinding,
  FullStoryFindingClass,
  FullStoryDiagnosticMode,
  FullStoryDiagnosticResult,
} from "./agent9-prose.js";
// A_87 P1/P2/P4 — the CML->outline scene-ref join. `auditCmlSceneRefs` is telemetry consumed by
// the worker at the Agent 7 boundary; the rest are the resolver and its two flag getters.
export {
  auditCmlSceneRefs,
  summariseSceneRefAudit,
} from "./agent9-prose/clue-validation.js";
export type { SceneRefAudit, SceneRefPath } from "./agent9-prose/clue-validation.js";
// A_89 B1/B2 — clue ownership and the per-chapter obligation load.
export {
  resolveClueOwnership,
  measureClueObligationLoad,
  summariseClueObligationLoad,
} from "./agent9-prose/clue-validation.js";
export type { ClueObligationLoad } from "./agent9-prose/clue-validation.js";
export {
  reconcileCmlSceneRefs,
  isSceneRefReconcileEnabled,
} from "./agent9-prose/scene-ref-reconcile.js";
export type { SceneRefReconcileResult } from "./agent9-prose/scene-ref-reconcile.js";

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
export type { NarrativeFormattingInputs, Scene, ActStructure, NarrativeOutline, OutlineCoercionCounts } from "./agent7-narrative.js";
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
export { initNarrativeState, updateNSD, stampDeployedAtoms, checkNSDParity } from "./types/narrative-state.js";
export type { NarrativeState, LockedFact } from "./types/narrative-state.js";

// Asset library (Phase 2/5 — obligation stamping + texture selection + diagnostics)
export { buildAssetLibrary, buildAssetDiagnosticReport } from "./asset-library.js";
export type { Asset, AssetLibrary } from "./types/asset-library.js";
export type { ChapterObligation } from "./contracts/chapter-obligation-contract.js";
export type { ProseRequestContract } from "./contracts/prose-request-contract.js";
export type {
  BatchCommitRecord,
  BatchGateOutcome,
  BatchGateName,
} from "./contracts/batch-commit-record.js";
export type { ReleaseGateAudit, ReleaseGateStatus } from "./contracts/release-gate-audit.js";
export type { RetryPacket, RetryFailureClass } from "./retry-protocol.js";
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

// REVIEW_05 §10.1 (N1) — the sentences the pipeline writes for itself, and their patterns.
export {
  INJECTED_SENTENCE_PATTERNS,
  buildCulpritEvidenceSentence,
  buildCulpritEvidenceSentenceInScene,
  buildSuspectClearanceSentence,
} from "./agent9-prose/injection-templates.js";

// REVIEW_05 §10.6 (X4) — the rules that bind the model, so injector output can be measured
// against the standard the model is held to.
export {
  findModelBoundRuleViolations,
} from "./agent9-prose/lint.js";
export type { ModelBoundSentenceRule } from "./agent9-prose/lint.js";

// A_75 §6.1 (P1) — the voice-spec engine. Exported at top level so the worker can commit a voice
// once per story before chapter 1.
export {
  generateVoiceSpec,
  isVoiceSpecEnabled,
} from "./agent9-prose/voice-spec-engine.js";
export type { VoiceSpecContext, VoiceSpecResult } from "./agent9-prose/voice-spec-engine.js";

// A_75 §12 — the clearance-register trim. Top-level so the worker can run it before the geometry gate.
export {
  trimRedundantClearances,
} from "./agent9-prose/clearance-trim.js";
export type { ClearanceTrimResult } from "./agent9-prose/clearance-trim.js";

export { repairNameHygieneInChapters } from "./agent9-prose/name-hygiene.js";
export type { NameHygieneResult } from "./agent9-prose/name-hygiene.js";

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

// A_96 F3 — the mechanism's actors must exist, or be named as absent.
export { auditMechanismActors } from "./agent3-offstage-actors.js";
export type { OffstageActorAudit } from "./agent3-offstage-actors.js";

/**
 * ── PROSE ENGINE v2 (ANALYSIS_99 §10) ────────────────────────────────────────────────────────────
 *
 * `@cml/prose-engine` derives the book contract from the same functions v1 uses, rather than
 * carrying its own copies — L6, one owner per fact. Nothing below is new code; these are the
 * existing owners of clue ownership, clue presence, the beat rotation and the aftermath predicate,
 * exported so a second package can read them.
 */
export {
  getRequiredClueIdsForScene,
  chapterMentionsRequiredClue,
  tokenizeForClueObligation,
  tokenMatchesText,
} from "./agent9-prose/clue-validation.js";
export { selectWitBeat, selectDepthBeat, traitOnly } from "./agent9-prose/obligation-block.js";
export type { BeatCandidate } from "./agent9-prose/obligation-block.js";
