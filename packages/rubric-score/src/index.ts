/**
 * @cml/rubric-score — the Final-Story Rubric Scorer (aligning-the-scoring-system.md).
 *
 * Replaces the headline score (today: average of 15 deterministic per-agent artifact scores) with the
 * holistic, reader-facing 10-category /100 mystery rubric — **LLM-critic primary, checker-gated**: the
 * critic scores the ten subjective categories from the finished prose, and a deterministic cap engine
 * enforces the rubric's hard caps and penalty rules in code, so the number is reproducible and
 * consistent with the story's actual structure.
 *
 * This is the §8.1 increment: the pure deterministic core (cap engine + facts + bands + schema +
 * prompt) with the LLM judge as an injectable seam. Wiring the live Azure judge, swapping the
 * aggregator's headline score, and the calibration harness are the gated next phases. Pure, no live
 * LLM call, NOT wired into the pipeline.
 */

export const packageName = "@cml/rubric-score";

export type {
  Category,
  CategoryMark,
  ChapterIssue,
  RubricScore,
  StoryFacts,
  StructuralAdjustments,
  Band,
  CappedScore,
} from "./types.js";
export { CATEGORIES } from "./types.js";

export { bandFor } from "./bands.js";
export { applyHardCaps } from "./hard-caps.js";
export { extractStoryFacts, mergeFacts } from "./facts.js";
export type { ScoringCaseInput } from "./facts.js";
export { buildRubricSystemPrompt, buildRubricUserMessage } from "./prompt.js";
export { RUBRIC_SCHEMA } from "./schema.js";
export { scoreStory } from "./score.js";
export type { JudgeRequest, JudgeResult, RubricJudge, ScoreStoryInput, ScoreStoryResult } from "./score.js";
export { createLLMRubricJudge, parseJudgeResult } from "./llm-judge.js";
export type { ChatFn, ChatArgs, ChatMessage, LLMJudgeOptions } from "./llm-judge.js";

// K2 §1/§2 — deterministic structural verifiers + citation verification.
export {
  verifyStructure,
  verifyCitations,
  splitProseIntoChapters,
  findUnplantedDiscriminatingCluesLocal,
} from "./structural-verifiers.js";
export type {
  StructuralVerdict,
  VerifyStructureInput,
  FlagCitation,
  CitationCheckResult,
  FindUnplantedFn,
  UnplantedCluesLike,
} from "./structural-verifiers.js";

// K2 §3 — internal↔external calibration hook.
export {
  computeCalibrationDelta,
  summarizeCalibration,
  CALIBRATION_SINGLE_DIGIT_BAND,
} from "./calibration.js";
export type { ExternalRescore, CalibrationDelta, CalibrationSummary } from "./calibration.js";
