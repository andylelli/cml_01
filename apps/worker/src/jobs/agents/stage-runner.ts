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
