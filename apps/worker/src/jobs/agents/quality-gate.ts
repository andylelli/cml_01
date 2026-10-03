/**
 * CR-21 (A1X-06): the bounded regenerate-with-feedback gate, once.
 *
 * Agent 2b's voice gate, Agent 2c's scene gate and Agent 3b's plausibility judge each ran the same loop:
 * evaluate the artifact; in enforce mode, while it fails and retries remain, regenerate with feedback,
 * charge the regeneration to the stage, keep the candidate only if it is better, and never throw. The
 * copies had drifted: 2b let a regeneration error escape the loop (its outer catch then skipped the gate
 * summary) where 2c and 3b keep the best-so-far; 2b assigned the generator's cumulative cost where 2c
 * and 3b add the cost tracker's delta for the generator's label (the same number for 2b, whose label is
 * charged by nothing else in between). All three flags default OFF.
 *
 * The caller keeps what differs: the verdict, what "better" means, the feedback, the warning wording, and
 * the summary line it writes from the returned verdict.
 */
import type { OrchestratorContext } from "./context.js";

export type GateRunContext = Pick<OrchestratorContext, "client" | "warnings" | "agentCosts" | "agentDurations">;

export interface BoundedGateSpec<T, V> {
  /** Warning prefix, e.g. "agent2c-scene-gate" → "[agent2c-scene-gate][enforce] …". */
  label: string;
  enforce: boolean;
  maxRetries: number;
  initial: T;
  /** Judge a candidate. May charge its own cost (Agent 3b's judge is an LLM call). */
  evaluate: (candidate: T) => V | Promise<V>;
  needsRetry: (verdict: V) => boolean;
  feedback: (best: T, verdict: V) => string;
  /** The warning written before each regeneration. */
  retryWarning: (verdict: V, attempt: number, maxRetries: number) => string;
  /** The generator call. Its cost is charged as the delta on `costLabel`, its time to `costKey`. */
  regenerate: (feedback: string) => Promise<T>;
  costLabel: string;
  costKey: string;
  /** Deterministic post-processing of a regenerated candidate, outside the error guard. */
  prepare?: (raw: T) => T;
  /** Schema check; a candidate that fails it is discarded. */
  validate?: (candidate: T) => boolean;
  isBetter: (candidate: { value: T; verdict: V }, best: { value: T; verdict: V }) => boolean;
}

export async function runBoundedGate<T, V>(
  ctx: GateRunContext,
  gate: BoundedGateSpec<T, V>,
): Promise<{ best: T; verdict: V; attempts: number }> {
  let best = gate.initial;
  let verdict = await gate.evaluate(best);
  let attempts = 0;
  const charged = () => ctx.client.getCostTracker().getSummary().byAgent[gate.costLabel] || 0;
  while (gate.enforce && gate.needsRetry(verdict) && attempts < gate.maxRetries) {
    attempts += 1;
    const feedback = gate.feedback(best, verdict);
    ctx.warnings.push(gate.retryWarning(verdict, attempts, gate.maxRetries));
    const regenStart = Date.now();
    const costBefore = charged();
    let candidate: T;
    try {
      candidate = await gate.regenerate(feedback);
    } catch (err) {
      // A gate must never kill a run: a regeneration failure keeps the best-so-far.
      ctx.warnings.push(`[${gate.label}][enforce] regeneration error: ${(err as Error).message}; keeping previous best.`);
      break;
    }
    ctx.agentCosts[gate.costKey] = (ctx.agentCosts[gate.costKey] || 0) + Math.max(0, charged() - costBefore);
    ctx.agentDurations[gate.costKey] = (ctx.agentDurations[gate.costKey] || 0) + (Date.now() - regenStart);
    if (gate.prepare) candidate = gate.prepare(candidate);
    if (gate.validate && !gate.validate(candidate)) {
      ctx.warnings.push(`[${gate.label}][enforce] regenerated candidate failed schema validation; keeping previous best.`);
      continue;
    }
    const candidateVerdict = await gate.evaluate(candidate);
    if (gate.isBetter({ value: candidate, verdict: candidateVerdict }, { value: best, verdict })) {
      best = candidate;
      verdict = candidateVerdict;
    }
  }
  return { best, verdict, attempts };
}
