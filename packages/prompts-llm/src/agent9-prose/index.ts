/**
 * agent9-prose/index.ts
 * Barrel â€” re-exports every public symbol from the agent9-prose module.
 * External code imports from './agent9-prose.js' (the outer barrel) or
 * from this file directly; the public API is identical.
 */
export * from "./types.js";
export * from "./clue-validation.js";
export * from "./lint.js";
export * from "./sanitization.js";
export * from "./phrase-analysis.js";
export * from "./banned-phrases.js";
export * from "./obligation-block.js";
export * from "./prompt-blocks.js";
export * from "./prompt-builder.js";
export * from "./narrative-balance.js";
export * from "./context-management.js";
export * from "./discriminating.js";
export * from "./repair.js";
export {
  applyDeterministicClearancePatch,
  // A_71 — the clearance-paste tally, so the AGENT9_REGEN_SUSPECT_ELIM probe has a read path.
  getDeterministicClearancePasteTelemetry,
  getDeterministicCluePasteTelemetry,
  resetDeterministicCluePasteTelemetry,
  resetDeterministicClearancePasteTelemetry,
  applyDeterministicCluePatch,
  applyDeterministicDiscriminatingTestPatch,
  buildCompletionFallbackChapter,
  buildChapterRepairContext,
  repairChapterDeterministically,
  resolveBatchMatchingClearances,
  resolveFallbackStageMode,
  resolveFallbackInvestigatorName,
  summarizeClueForFallback,
  buildDeterministicClueParagraphs,
} from "./deterministic-repair.js";
export type {
  ChapterRepairContext,
  DeterministicRepairResult,
  MatchingClearance,
} from "./deterministic-repair.js";
export * from "./post-pass-polish.js";
export * from "./full-story-diagnostic.js";
export * from "./prose-blind-reader.js";
export * from "./regen-repair.js";
export * from "./regen-llm.js";
export * from "./regen-integration.js";
// S3 — the enumerable answer to "which obligations have an LLM repair path, and what gates each one?"
export * from "./regen-registry.js";
export * from "./model-tiering.js";
export * from "./generate.js";

// A_75 §6.1 (P1) — the voice-spec engine: generate candidates under a measured `divergeFrom`, judge,
// commit as a prompt block every chapter carries. The mechanism A_72 §2.1 measured behind `premise`,
// aimed at the sentence.
export {
  generateVoiceSpec,
  buildVoiceSpecPrompt,
  buildVoiceSpecJudgePrompt,
  buildVoiceSpecBlock,
  buildDivergenceBlock,
  parseVoiceSpecCandidate,
  summariseVoiceSpec,
  isVoiceSpecEnabled,
  VOICE_SPEC_CANDIDATES,
} from "./voice-spec-engine.js";
export type { VoiceSpecContext, VoiceSpecResult } from "./voice-spec-engine.js";

// A_75 §12 — the clearance REGISTER trim. `clearance_over_budget` is the most frequent geometry code
// in the archive (74% of runs) and story-geometry's own codes.ts records that no repair pass exists
// for it. This is that pass, and it can only ever remove a clearance whose suspect was already
// cleared in an earlier chapter — so coverage is preserved by construction.
export {
  trimRedundantClearances,
  isClearanceSentenceMirror,
  CLEARANCE_MARKER_MIRROR,
  CLEARANCE_IDIOM_MIRROR,
} from "./clearance-trim.js";
export type { ClearanceTrimResult } from "./clearance-trim.js";
