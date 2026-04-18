/**
 * agents/index.ts — barrel re-export for all per-agent run files.
 *
 * The thin orchestrator coordinator imports everything it needs from here.
 */

// ── Shared context, types, and utilities ──────────────────────────────────
export type {
  OrchestratorContext,
  DifficultyMode,
  CmlPrimaryAxis,
  HardLogicDirectives,
  ClueGuardrailIssue,
  InferenceCoverageResult,
  ProseChapterScorePoint,
  ProsePassAccounting,
  ProseScoringSnapshot,
  OutlineCoverageIssue,
} from "./shared.js";
export {
  mergeHardLogicDirectives,
  buildOutlineRepairGuardrails,
  applyClueGuardrails,
  describeError,
  applyAbortedRunMetadata,
  delay,
  appendRetryFeedback,
  appendRetryFeedbackOptional,
  executeAgentWithRetry,
  normalizePrimaryAxis,
  deriveHardLogicDirectives,
  buildNoveltyConstraints,
} from "./shared.js";

// ── Agent run functions ───────────────────────────────────────────────────
export { runAgent1 } from "./agent1-run.js";
export { runAgent2 } from "./agent2-run.js";
export { runAgent2e } from "./agent2e-run.js";
export { runAgent2b } from "./agent2b-run.js";
export { runAgent2c } from "./agent2c-run.js";
export { runAgent2d } from "./agent2d-run.js";
export { runAgent3b } from "./agent3b-run.js";
export { runAgent3 } from "./agent3-run.js";
export { runAgent5 } from "./agent5-run.js";
export { runAgent6 } from "./agent6-run.js";
export { runAgent7 } from "./agent7-run.js";
export { runAgent65 } from "./agent65-run.js";
export { runAgent9 } from "./agent9-run.js";

// ── Testable helpers (re-exported for orchestrator __testables) ───────────
export {
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  applyDeterministicCluePreAssignment,
  rebalanceNarrativeSceneCountsDeterministically,
} from "./agent7-run.js";
export {
  applyDeterministicProsePostProcessing,
  isDiscriminatingTestCoverageError,
  isSuspectClosureCoverageError,
  isCulpritEvidenceChainCoverageError,
  isSuspectEliminationCoverageError,
} from "./agent9-run.js";
