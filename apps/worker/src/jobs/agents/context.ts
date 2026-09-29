/**
 * ORC-07 — one initialiser for `OrchestratorContext`.
 *
 * The orchestrator and the Agent 9 replay each hand-wrote the ~40-field context literal, and the replay
 * cast its copy `as unknown as OrchestratorContext`, so a new required field was caught in one place and
 * silently missing in the other (its `criticalFairPlayRules` was already an empty set). Callers now pass
 * what differs per caller; the initial run state lives here once, and the compiler checks the rest.
 */
import type { OrchestratorContext, ProseScoringSnapshot } from "./shared.js";

/** Agent 6 treats a violation of any of these as critical, whatever severity the auditor gave it. */
export const CRITICAL_FAIR_PLAY_RULES = ["Clue Visibility", "No Withholding", "Logical Deducibility"] as const;

/** Counters and accumulators every run starts from. */
type RunStateKey =
  | "criticalFairPlayRules"
  | "maxCmlRevisionAttempts"
  | "revisedByAgent4"
  | "revisionAttempts"
  | "revisedByAgent4FairPlay"
  | "fairPlayRevisionAttempts"
  | "proseScoringSnapshot"
  | "proseChapterScores"
  | "proseSecondRunChapterScores"
  | "prosePassAccounting"
  | "proseRewritePassCount"
  | "proseRepairPassCount"
  | "latestProseScore"
  | "nsdTransferTrace";

type RequiredKeys<T> = { [K in keyof T]-?: {} extends Pick<T, K> ? never : K }[keyof T];

/** Everything a caller must supply: the required fields that are not run state. Any other field may be set. */
export type OrchestratorContextBase = Omit<Pick<OrchestratorContext, RequiredKeys<OrchestratorContext>>, RunStateKey> &
  Partial<OrchestratorContext>;

export function newProseScoringSnapshot(): ProseScoringSnapshot {
  return {
    startedAtMs: null,
    chaptersGenerated: 0,
    latestChapterScore: null,
    latestCumulativeScore: null,
    postGenerationSummaryLogged: false,
  };
}

export function createOrchestratorContext(base: OrchestratorContextBase): OrchestratorContext {
  const initial: Pick<OrchestratorContext, RunStateKey> = {
    criticalFairPlayRules: new Set(CRITICAL_FAIR_PLAY_RULES),
    maxCmlRevisionAttempts: 3,
    revisedByAgent4: false,
    revisionAttempts: undefined,
    revisedByAgent4FairPlay: false,
    fairPlayRevisionAttempts: 0,
    proseScoringSnapshot: newProseScoringSnapshot(),
    proseChapterScores: [],
    proseSecondRunChapterScores: [],
    prosePassAccounting: [],
    proseRewritePassCount: 0,
    proseRepairPassCount: 0,
    latestProseScore: null,
    nsdTransferTrace: [],
  };
  return { ...initial, ...base };
}
