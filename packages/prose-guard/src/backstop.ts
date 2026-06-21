/**
 * The universal best-draft backstop (Agent 9 redesign §4.3 / §6.1).
 *
 * The canonical defect (§3.1): a cosmetic, perfectly-readable repeated opener could exhaust the
 * per-chapter retry budget and **hard-abort the whole run, producing no story — while the report read
 * green.** The fix shipped (ANALYSIS_44) was a delicate allowlist of *which cosmetic linter verdicts
 * are allowed to be ignored*, scoped by literal message-string prefix. This generalises it into the
 * one true terminal condition: **always retain the best-scored draft; on budget exhaustion, ship it
 * with a warning. A run can never die with no story.**
 */

import type { BackstopResult, ScoredDraft } from "./types.js";

/** Retains the best-scored draft seen so far. Monotone: a worse later draft never displaces a better one. */
export class BestDraftTracker<T> {
  private best?: ScoredDraft<T>;

  consider(draft: T, score: number, attempt: number, report?: unknown): void {
    if (!this.best || score > this.best.score) {
      this.best = { draft, score, attempt, report };
    }
  }

  get(): ScoredDraft<T> | undefined {
    return this.best;
  }

  hasAny(): boolean {
    return this.best !== undefined;
  }
}

export interface ScoredAttempt<T> {
  draft: T;
  /** Higher is better — the backstop maximises this. */
  score: number;
  /** true ⇔ this draft is good enough to stop early (converged). */
  converged: boolean;
  /** Located complaints fed back into the next generate call (the critic's notes). */
  complaints?: string[];
}

export interface BackstopOptions<T> {
  maxAttempts: number;
  /** Produce a draft for this attempt, given the previous round's complaints. May be async (LLM). */
  generate: (attempt: number, complaints: string[]) => Promise<T> | T;
  /** Score + judge a draft. */
  score: (draft: T, attempt: number) => Promise<ScoredAttempt<T>> | ScoredAttempt<T>;
  /** A draft is "real" (non-empty) if this returns true. Default: non-empty string / truthy. */
  isNonEmpty?: (draft: T) => boolean;
}

const defaultNonEmpty = (d: unknown): boolean =>
  typeof d === "string" ? d.trim().length > 0 : d != null && (!Array.isArray(d) || d.length > 0);

/**
 * Run the generate→score loop. Returns the converged draft if one is reached; otherwise the
 * best-scored non-empty draft seen, flagged `best_draft_backstop` with a warning. NEVER returns empty
 * as long as at least one attempt produced a non-empty draft.
 *
 * Throws ONLY if every attempt produced an empty draft — the one case the backstop genuinely cannot
 * paper over (there is no story to ship); that is a real upstream failure, surfaced loudly.
 */
export async function generateWithBackstop<T>(opts: BackstopOptions<T>): Promise<BackstopResult<T>> {
  const isNonEmpty = opts.isNonEmpty ?? (defaultNonEmpty as (d: T) => boolean);
  const tracker = new BestDraftTracker<T>();
  let complaints: string[] = [];
  let attempts = 0;

  for (let attempt = 1; attempt <= opts.maxAttempts; attempt++) {
    attempts = attempt;
    const draft = await opts.generate(attempt, complaints);
    if (!isNonEmpty(draft)) continue; // an empty draft can't be the backstop; try again
    const scored = await opts.score(draft, attempt);
    tracker.consider(draft, scored.score, attempt);
    if (scored.converged) {
      return { draft, score: scored.score, accepted: "converged", attempts, warnings: [] };
    }
    complaints = scored.complaints ?? [];
  }

  const best = tracker.get();
  if (!best) {
    throw new Error(`prose generation produced no non-empty draft in ${attempts} attempts — nothing to ship`);
  }
  return {
    draft: best.draft,
    score: best.score,
    accepted: "best_draft_backstop",
    attempts,
    warnings: [
      `shipped best draft (attempt ${best.attempt}, score ${best.score}) after ${attempts} attempts without convergence — a run never dies with no story`,
    ],
  };
}
