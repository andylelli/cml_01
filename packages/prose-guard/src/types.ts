/**
 * Agent 9 prose-safety types (redesign §4.1 / §4.2 / §4.3).
 *
 * Agent 9's job is the easiest in the pipeline — render a proof that's already been proven — yet it
 * became the largest, costliest, most defect-prone component by trying to *judge prose with regexes*
 * and *repair prose with string edits*. These types back the three safety laws that make its three
 * worst shipped defects structurally impossible:
 *   - the chapter is a machine-checkable CONTRACT (fidelity is checked, not hoped),
 *   - no deterministic pass ships text it didn't re-validate (validation-gated mutation),
 *   - the loop ALWAYS ships the best draft (a run can never die with no story).
 */

// ── §4.1 the chapter-as-contract ─────────────────────────────────────────────

export interface ClueSurfaceObligation {
  /** The clue id (e.g. "C7"). */
  clue: string;
  /** How it must be surfaced, e.g. "physically observed by the POV detective". */
  as?: string;
  /** Prose-facing terms a reader could actually use — what the fidelity check looks for. */
  keyTerms?: string[];
}

/** The exact, machine-checkable obligation set for one chapter (§4.1). Derived, never authored. */
export interface ChapterObligationContract {
  chapter: number;
  beat?: string;
  present: string[];
  location?: string;
  /** The chapter's timeline window; prose must not contradict it. */
  time_window?: { from?: string; to?: string };
  /** Clues the reader MUST be able to use by this chapter. */
  must_surface: ClueSurfaceObligation[];
  /** What must stay hidden here — the never-cosmetic fair-play property. */
  must_not_reveal: { solution_culprit: boolean; clues: ClueSurfaceObligation[] };
  /** Suspects that may be cleared here (and nobody else yet). */
  eliminations_allowed: string[];
}

// ── §4.2 validation-gated mutation ───────────────────────────────────────────

export interface ValidatorResult {
  ok: boolean;
  /** Higher is better. A mutation that lowers the score is a regression and is reverted. */
  score: number;
  violations: string[];
}

export type Validator<T> = (value: T) => ValidatorResult;

export interface MutationOutcome<T> {
  /** The value that ships — mutated iff it broke nothing, otherwise the untouched original. */
  value: T;
  applied: boolean;
  reverted: boolean;
  reason?: string;
  before: ValidatorResult;
  after: ValidatorResult;
}

// ── §4.1 fidelity report (the checked property) ──────────────────────────────

export type FidelityViolationKind =
  | "missing_clue"
  | "leaked_clue"
  | "culprit_revealed"
  | "absent_character"
  | "missing_elimination";

export interface FidelityViolation {
  kind: FidelityViolationKind;
  /** "hard" = a fair-play / completeness failure (never cosmetic); "soft" = a quality nudge. */
  severity: "hard" | "soft";
  detail: string;
}

export interface FidelityReport {
  ok: boolean;
  chapter: number;
  violations: FidelityViolation[];
  /** Clue ids confirmed surfaced in this chapter. */
  surfaced: string[];
  /** Higher is better (100 = perfect). The score the best-draft backstop maximises. */
  score: number;
}

// ── §4.3 best-draft backstop ─────────────────────────────────────────────────

export interface ScoredDraft<T> {
  draft: T;
  score: number;
  attempt: number;
  report?: unknown;
}

export type AcceptReason = "converged" | "best_draft_backstop";

export interface BackstopResult<T> {
  draft: T;
  score: number;
  accepted: AcceptReason;
  attempts: number;
  warnings: string[];
}
