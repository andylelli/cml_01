/**
 * PROSE ENGINE v2 — ANALYSIS_99 §10.
 *
 * Pure: no LLM client, no worker import. The worker adapts its context into `ContractInput`, calls
 * these, and owns the calls. Every module here is testable against the 66 stored projects.
 */
export const packageName = "@cml/prose-engine";

export * from "./chapter-index.js";
export * from "./contract-phrases.js";
export { instructionPhrases, findInstructionEchoes, findCatchphrases } from "./instruction-echo.js";
export { namesAsCulprit } from "./culprit.js";
export * from "./types.js";
export { assignChapterRoles, beatOf } from "./roles.js";
export type { RoleAssignment } from "./roles.js";
export {
  buildContractCore,
  buildChronologyTable,
  assignOwnedShapes,
  decisiveClueIds,
  unwrapCase,
  flattenScenes,
} from "./contract.js";
export { buildBible, estimateTokens, BIBLE_BUDGET, BIBLE_BUDGETS } from "./bible.js";
export { buildBrief, briefLawViolations, revealOperation, fullParagraphs, BRIEF_BUDGET } from "./brief.js";
export type { BriefInput, BriefProfile } from "./brief.js";
export { buildBookContract } from "./book-contract.js";
export { planSegments, priorChapters, TOKENS_PER_WORD, CAP_UTILISATION, CHAPTERS_PER_ACT_SEGMENT } from "./segments.js";
export { parseWriterOutput, writerFormatInstruction, continueInstruction } from "./writer-format.js";
export type { ParseResult } from "./writer-format.js";
export {
  scoreDraft,
  chooseDraft,
  rankingFailures,
  RANKING_KINDS,
  checkHardGates,
  measureInstruments,
  emDashPer1k,
  summariseSelection,
  CALIBRATION,
  CALIBRATION_N,
  CALIBRATION_RHO,
} from "./selector.js";
export type { ScoredDraft } from "./selector.js";
export {
  collectCheckerFindings,
  anchorFindings,
  buildCriticPrompt,
  parseCriticFindings,
  summariseFindings,
  bookRegisterRate,
  SEVERITY,
  CRITIC_CLASSES,
  MIN_QUOTE_WORDS,
} from "./findings.js";
export type { CheckerOptions, CriticParseResult } from "./findings.js";
export { measureGuards, guardThatFell, applyEditList, buildGuards, buildEditorPrompt, parseEditList, summariseEdits } from "./edits.js";
export type { ApplyOptions, GuardContext } from "./edits.js";
export { applyGate } from "./gate.js";
export type { GateVerdict } from "./gate.js";
export { buildTelemetryBlock } from "./telemetry.js";
export type { RunTelemetry } from "./telemetry.js";
