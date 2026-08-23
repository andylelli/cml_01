/**
 * Story Validation Package
 * Comprehensive validation system for generated mystery stories
 */

export * from './types.js';
export * from './encoding-validator.js';
export * from './character-validator.js';
export * from './character-lifecycle-validator.js';
export * from './control-plane-leakage.js';
export * from './prose-consistency-validator.js';
export * from './narrative-continuity-validator.js';
export * from './case-transition-validator.js';
export * from './discriminating-test-validator.js';
export * from './suspect-closure-validator.js';
export * from './physical-validator.js';
export * from './era-validator.js';
export * from './semantic-validator.js';
export * from './chapter-validator.js';
export * from './name-sanitizer.js';
export * from './location-normalizer.js';
export * from './pipeline.js';
export * from './generation-params.js';

// Story length targets — single source of truth for scene/chapter counts
export * from './story-length-targets.js';

// Agent 7 scheduler job authority — grid-derived once-each clue jobs (T1.2 / P1.3)
export * from './scene-job-authority.js';
export * from './mechanism-reveal-gate.js';
export * from './suspect-clearance-gate.js';
export * from './opening-grounding-vocabulary.js';

// Scoring system
export * from './scoring/index.js';

// Report repository
export { ReportRepository, FileReportRepository } from './report-repository.js';
export type { AggregateStats } from './report-repository.js';

// Pronoun repair
export { repairChapterPronouns, repairPronouns, normalizeTitles } from './pronoun-repair.js';
export type { CastEntry, PronounRepairResult } from './pronoun-repair.js';

// Convenience exports
export { StoryValidationPipeline } from './pipeline.js';
export { EncodingValidator } from './encoding-validator.js';
export { CharacterConsistencyValidator } from './character-validator.js';
export { CharacterLifecycleValidator } from './character-lifecycle-validator.js';
export { NarrativeContinuityValidator } from './narrative-continuity-validator.js';
export { CaseTransitionValidator } from './case-transition-validator.js';
export { DiscriminatingTestValidator } from './discriminating-test-validator.js';
export { SuspectClosureValidator } from './suspect-closure-validator.js';
export { validateGenreStructure } from './genre-validator.js';
export type { GenreValidationResult } from './genre-validator.js';
export { PhysicalPlausibilityValidator } from './physical-validator.js';
export { EraAuthenticityValidator } from './era-validator.js';
export { ChapterValidator } from './chapter-validator.js';
export { semanticValidateDiscriminatingTest, semanticValidateSuspectElimination, semanticValidateCulpritEvidence } from './semantic-validator.js';
// A_61 RC5.3 — the deterministic dialogue-distinctiveness (voice idiolect) gate.
export { validateDialogueIdiolect } from './dialogue-idiolect-validator.js';
export type { DialogueVoiceCapsule, DialogueIdiolectResult, DialogueIdiolectIssue } from './dialogue-idiolect-validator.js';
