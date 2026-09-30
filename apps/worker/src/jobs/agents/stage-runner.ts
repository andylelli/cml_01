/**
 * The scoring-retry stage runner and the pre-Agent-9 retry switches.
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import type {
  ScoreAggregator,
  RetryManager,
  PhaseScore,
} from "@cml/story-validation";
import { buildRetryFeedback, getFailedComponents, parseHonestScorerMode } from "@cml/story-validation";
import type { ScoringLogger } from "../scoring-logger.js";
import type { OrchestratorContext } from "./context.js";
import { delay, describeError } from "./run-utils.js";

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

export async function executeAgentWithRetry<T>(
  agentId: string,
  phaseName: string,
  executeAgent: (retryFeedback?: string) => Promise<{ result: T; cost: number }>,
  scoreOutput: (result: T) => Promise<{ adapted: any; score: PhaseScore }>,
  retryManager: RetryManager,
  scoreAggregator: ScoreAggregator,
  scoringLogger: ScoringLogger,
  runId: string,
  projectId: string,
  warnings: string[],
  onPhaseScored?: () => Promise<void>,
  // A_53 P2 (agent65-score-failure-aborts-via-shared-retry): phases whose output is creative texture
  // (e.g. Agent 6.5 World Builder) are NOT abort-critical — a sub-threshold score degrades to a
  // warning + best-effort document instead of killing the whole pipeline. Defaults to abort-critical
  // to preserve existing behavior for the load-bearing phases.
  abortCritical: boolean = true,
): Promise<{ result: T; duration: number; cost: number; retryCount: number }> {
  let attempts = 0;
  let totalCost = 0;
  const startTime = Date.now();
  let retryFeedback: string | undefined;
  const retriesEnabled = preAgent9LlmRetriesEnabled();

  while (true) {
    const attemptStart = Date.now();

    const { result, cost } = await executeAgent(retryFeedback);
    // Every generator reports its label's RUNNING total on this client (cost-tracker byAgent), not the
    // cost of this attempt, so summing attempts counted k(k+1)/2 calls (CR-06 / ORC-D03). Keep the latest.
    totalCost = cost;

    const attemptDuration = Date.now() - attemptStart;

    try {
      const { score } = await scoreOutput(result);

      scoreAggregator.upsertPhaseScore(agentId, phaseName, score, attemptDuration, cost);
      scoringLogger.logPhaseScore(agentId, phaseName, score, attemptDuration, cost, runId, projectId);

      if (onPhaseScored) {
        try { await onPhaseScored(); } catch { /* best-effort */ }
      }

      const phasePassed = scoreAggregator.passesThreshold(score);
      if (phasePassed) {
        const totalDuration = Date.now() - startTime;
        if (attempts > 0) {
          warnings.push(`${phaseName}: ✓ Passed after ${attempts} retry(s) - ${score.grade} (${score.total}/100)`);
        }
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      if (!retriesEnabled) {
        warnings.push(
          `${phaseName}: deterministic mode active - skipping scoring retry (score ${score.total}/100, ${score.grade})`
        );
        const totalDuration = Date.now() - startTime;
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      if (!retryManager.canRetry(agentId)) {
        if (retryManager.shouldAbortOnMaxRetries() && abortCritical) {
          throw new Error(
            `${phaseName} failed after ${attempts + 1} attempt(s) and all retries are exhausted. ` +
            `Aborting generation. Failure reason: ${score.failure_reason || `Score ${score.total}/100 (${score.grade}) below threshold`}`
          );
        }
        warnings.push(
          abortCritical
            ? `${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - Max retries exceeded`
            : `${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - non-critical phase, continuing with best-effort document`,
        );
        const totalDuration = Date.now() - startTime;
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      const failedComponents = getFailedComponents(score);
      const effectiveFailureReason = score.failure_reason
        || (failedComponents.length > 0
            ? `Component minimums not met: ${failedComponents.join('; ')}`
            : `Score ${score.total}/100 (${score.grade}) below threshold`);

      attempts++;
      // SCO-D05: the delay before this retry is read BEFORE recordRetry moves the count (it was read
      // after, so the first retry waited the second retry's delay).
      const backoffMs = retryManager.getBackoffDelay(agentId);
      retryManager.recordRetry(agentId, effectiveFailureReason, score.total);
      const maxRetries = retryManager.getMaxRetries(agentId);
      scoringLogger.logRetryAttempt(agentId, phaseName, attempts, effectiveFailureReason, backoffMs, maxRetries, runId, projectId);

      retryFeedback = buildRetryFeedback(score, attempts);

      warnings.push(`${phaseName}: ↻ Retry ${attempts}/${maxRetries} - Score: ${score.total}/100 (${score.grade}), waiting ${backoffMs}ms...`);

      if (backoffMs > 0) {
        await delay(backoffMs);
      }
    } catch (scoringError) {
      scoringLogger.logScoringError(agentId, phaseName, scoringError, runId, projectId);
      warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
      const totalDuration = Date.now() - startTime;
      return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
    }
  }
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
  /** One generator call. `retryFeedback` is set only on a scoring retry; each runner folds it into its own channel. */
  generate: (retryFeedback?: string) => Promise<{ result: T; cost: number }>;
  score: (result: T) => Promise<{ adapted: any; score: PhaseScore }>;
  /** See executeAgentWithRetry. Default true. */
  abortCritical?: boolean;
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
    outcome = await executeAgentWithRetry(
      spec.agentId,
      spec.phaseName,
      spec.generate,
      spec.score,
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport,
      spec.abortCritical ?? true,
    );
  } else {
    const start = Date.now();
    const { result, cost } = await spec.generate(undefined);
    outcome = { result, cost, duration: Date.now() - start };
  }
  ctx.agentCosts[spec.agentId] = outcome.cost;
  ctx.agentDurations[spec.agentId] = outcome.duration;
  return outcome.result;
}
