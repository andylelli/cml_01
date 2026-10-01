/**
 * The scoring-retry stage runner and the pre-Agent-9 retry switches.
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type {
PhaseScore,
ScoreAggregator
} from "@cml/story-validation";
import { parseHonestScorerMode } from "@cml/story-validation";
import type { ScoringLogger } from "../scoring-logger.js";
import type { OrchestratorContext } from "./context.js";
import { describeError } from "./run-utils.js";

export function appendRetryFeedback(base: string, retryFeedback?: string): string {
  if (!retryFeedback || retryFeedback.trim().length === 0) {
    return base;
  }
  const prefix = base.trim().length > 0 ? base : "";
  return `${prefix}${prefix ? "\n\n" : ""}Retry guidance:\n${retryFeedback}`;
}

export function appendRetryFeedbackOptional(base: string | undefined, retryFeedback?: string): string | undefined {
  if (base === undefined) {
    return undefined;
  }
  return appendRetryFeedback(base, retryFeedback);
}

export function preAgent9LlmRetriesEnabled(): boolean {
  const raw = String(process.env.AGENT_PRE9_ENABLE_LLM_RETRIES ?? "").trim().toLowerCase();
  return raw === "1" || raw === "true" || raw === "yes" || raw === "on";
}

/**
 * ANALYSIS_50 Phase 3 — honest-scorer selector. Reads the umbrella `HONEST_SCORERS` flag
 * (off/shadow/enforce, default OFF). `off` returns the vanity score unchanged (byte-identical).
 * `shadow` computes the honest score, logs the vanity↔honest delta, but RETURNS the vanity score.
 * `enforce` returns the honest score. Never throws — a scorer error keeps the vanity score.
 */
export function applyHonestScorer(
  vanity: PhaseScore,
  honest: () => PhaseScore | null | undefined,
  warnings: string[],
  label: string,
): PhaseScore {
  const mode = parseHonestScorerMode(process.env.HONEST_SCORERS);
  if (mode === "off") return vanity;
  let h: PhaseScore | null | undefined;
  try {
    h = honest();
  } catch (err) {
    warnings.push(`[honest-scorer][${mode}] ${label} error: ${(err as Error).message}; keeping vanity score`);
    return vanity;
  }
  if (!h) return vanity;
  warnings.push(
    `[honest-scorer][${mode}] ${label} vanity=${vanity.total}/${vanity.grade} ` +
      `honest=${h.total}/${h.grade} passed=${h.passed}` +
      (h.component_failures && h.component_failures.length ? ` weak=${h.component_failures.join(",")}` : ""),
  );
  return mode === "enforce" ? h : vanity;
}

export function preAgent9ContractRecoveryEnabled(): boolean {
  // Contract recovery is enabled by default so schema/structural near-misses
  // are repaired consistently across all story parameter combinations.
  const raw = String(process.env.AGENT_PRE9_ENABLE_CONTRACT_RECOVERY ?? "").trim().toLowerCase();
  if (!raw) return true;
  if (raw === "0" || raw === "false" || raw === "no" || raw === "off") return false;
  if (raw === "1" || raw === "true" || raw === "yes" || raw === "on") return true;
  return true;
}

/**
 * Generate once, score once, record the score. Owner decision 7 (2026-10-01, SCO-Q02 / ORC-Q01, ADR-0003 and
 * ADR-0006): the phase-score retry loop and its abort-on-exhaustion are deleted. The loop ran only under
 * AGENT_PRE9_ENABLE_LLM_RETRIES, which no configuration has set since the deterministic mode, and its abort
 * was unreachable (ORC-11: the throw was swallowed by its own catch). At default this is what always ran:
 * a below-threshold score is recorded and reported, never retried.
 */
async function executeAndScore<T>(
  agentId: string,
  phaseName: string,
  generate: () => Promise<{ result: T; cost: number }>,
  scoreOutput: (result: T) => Promise<{ adapted: any; score: PhaseScore }>,
  scoreAggregator: ScoreAggregator,
  scoringLogger: ScoringLogger,
  runId: string,
  projectId: string,
  warnings: string[],
  onPhaseScored?: () => Promise<void>,
): Promise<{ result: T; duration: number; cost: number }> {
  const startTime = Date.now();
  const { result, cost } = await generate();
  const generateDuration = Date.now() - startTime;
  try {
    const { score } = await scoreOutput(result);
    scoreAggregator.upsertPhaseScore(agentId, phaseName, score, generateDuration, cost);
    scoringLogger.logPhaseScore(agentId, phaseName, score, generateDuration, cost, runId, projectId);
    if (onPhaseScored) {
      try { await onPhaseScored(); } catch { /* best-effort */ }
    }
    if (!scoreAggregator.passesThreshold(score)) {
      warnings.push(`${phaseName}: below threshold (score ${score.total}/100, ${score.grade}) — recorded, not retried`);
    }
  } catch (scoringError) {
    scoringLogger.logScoringError(agentId, phaseName, scoringError, runId, projectId);
    warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
  }
  return { result, duration: Date.now() - startTime, cost };
}

/** What `runStage` reads and writes on the run: scoring handles, identity, and the cost/duration ledgers. */
export type StageRunContext = Pick<
  OrchestratorContext,
  | "enableScoring" | "scoreAggregator" | "retryManager" | "scoringLogger" | "runId" | "projectId"
  | "warnings" | "savePartialReport" | "agentCosts" | "agentDurations"
>;

export interface StageSpec<T> {
  agentId: string;
  phaseName: string;
  /** One generator call (there is no scoring retry since owner decision 7). */
  generate: () => Promise<{ result: T; cost: number }>;
  score: (result: T) => Promise<{ adapted: any; score: PhaseScore }>;
}

/**
 * CR-21 (ORC-02, A1X-02): the scoring fork, performed once. Nine runners (1, 2, 2b, 2c, 2d, 2e, 3b,
 * 6.5, 7) each carried `if (scoring) executeAgentWithRetry(12 args) else <the same generator call, no
 * feedback, timed by hand>`, with the generator input literal written twice. The copies had drifted:
 * Agent 6.5's non-scoring branch dropped `onProgress`. With scoring off this is one `generate()` with no
 * feedback, which is what every non-scoring branch sent — replay:check pins both modes
 * (full-d0ee7b26 and its -noscore variant: the same cassette, byte for byte).
 *
 * Records the stage's cost and duration under `agentId`; returns the result for the runner to store.
 */
export async function runStage<T>(ctx: StageRunContext, spec: StageSpec<T>): Promise<T> {
  let outcome: { result: T; duration: number; cost: number };
  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    outcome = await executeAndScore(
      spec.agentId,
      spec.phaseName,
      spec.generate,
      spec.score,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
    );
  } else {
    const start = Date.now();
    const { result, cost } = await spec.generate();
    outcome = { result, cost, duration: Date.now() - start };
  }
  ctx.agentCosts[spec.agentId] = outcome.cost;
  ctx.agentDurations[spec.agentId] = outcome.duration;
  return outcome.result;
}
