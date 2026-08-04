/**
 * The scoped regen-repair loop (first-principles LLD §6.4 / phase P3).
 *
 * This is the structural inversion that ends the whack-a-mole: instead of a deterministic pass
 * INJECTING a string to satisfy a presence guarantee (which always reads as template), a verifier
 * emits a `ProseDefect` and a small, scoped LLM regen DRAMATIZES the missing element in-scene — then
 * the same verifier re-runs and the change is kept only if it strictly does not regress (the
 * `mutateThenValidate` law generalised to async, paragraph-scoped chapter edits). The deterministic
 * string survives only as a logged emergency floor: if regen is unavailable or exhausts its retries,
 * the chapter is flagged for rewrite and a quality failure is logged — it never silently ships as prose.
 *
 * The LLM call is INJECTED (`RegenFn`) so this module is pure orchestration: unit-tested with a mock,
 * wired to the real client in the orchestrator behind `AGENT9_REGEN_*` flags.
 */

import type { ValidatorResult } from "@cml/prose-guard";
import type { ProseChapter } from "./types.js";

// ── the bridge types (LLD §5.2 / §5.3) ──────────────────────────────────────

export type ProseDefectKind =
  | "missing_clue"
  | "clue_too_late"
  | "missing_clearance"
  | "missing_resolution"
  | "culprit_unlinked"
  | "suspect_unaccounted"
  | "pronoun_mismatch"
  | "victim_animated"
  | "locked_fact_absent"
  | "scaffold_not_prose"
  | "missing_case_transition_bridge"
  | "early_spoiler"
  | "mechanism_revealed_early"
  | "leakage"
  | "voice_tic_leakage"
  | "dual_value_no_contrast"
  /**
   * Agent 7.5 geometry (GEOMETRY-AGENT-DESIGN §8.5/§8.6) — the aftermath chapter re-delivers what the
   * reveal already disclosed. Genette's unmotivated repeating narration, and the ONLY defect kind in
   * this union that expresses a NEGATIVE obligation.
   *
   * That distinction is load-bearing, not taxonomic: a positive constraint is satisfied by ADDING
   * text; a negative one can only be satisfied by removing or rewriting it. Every other kind here can
   * be repaired by insertion. This one cannot, which is why it needs the rewrite family and the
   * edit-list channel rather than a whole-chapter regeneration.
   */
  | "aftermath_repeat";

export interface ProseDefect {
  chapter: number;
  paragraphIndex?: number;
  kind: ProseDefectKind;
  detail: string;
  /** clueId / suspect / factId — what to regenerate. */
  obligationRef?: string;
  severity: "hard" | "soft";
}

export interface RegenRequest {
  chapter: ProseChapter;
  /** regenerate just this span when set; whole-chapter only as a last resort. */
  paragraphIndex?: number;
  /** the in-scene instruction, e.g. "plant {clue} here as an observation". */
  instruction: string;
  /** dereferenced constraints — facts/pronouns/embargo are READ from the Bible, never re-derived. */
  constraints: {
    lockedFacts: Array<{ value: string; description?: string }>;
    pronouns: Record<string, string>;
    mustNotReveal: string[];
  };
  defect: ProseDefect;
}

/** The injected LLM regen. Returns the candidate chapter; may throw (treated as a failed attempt). */
export type RegenFn = (req: RegenRequest) => Promise<ProseChapter>;

/** A composed verifier over a whole chapter (presence + fairness + coherence + scaffold). */
export type ChapterValidator = (chapter: ProseChapter) => ValidatorResult;

export interface RepairOutcome {
  defect: ProseDefect;
  applied: boolean;
  reverted: boolean;
  attempts: number;
  reason?: string;
}

export interface RegenRepairResult {
  chapter: ProseChapter;
  outcomes: RepairOutcome[];
  /** defects that survived (regen unavailable, threw, or every attempt regressed) — caller logs/floors. */
  unresolved: ProseDefect[];
}

export interface RegenRepairOptions {
  /** max regen attempts per defect before giving up (default 2). */
  maxAttemptsPerDefect?: number;
  /** structured log sink for exhausted defects (the "logged quality failure"). */
  onUnresolved?: (defect: ProseDefect, reason: string) => void;
}

/**
 * Decide whether a candidate is acceptable. Unlike `mutateThenValidate` (which ships any non-regressing
 * mutation), repair must make PROGRESS: the candidate must strictly improve the validated property
 * (higher score, or a previously-failing property now ok) AND introduce no collateral regression (no
 * new violation, no clean→dirty). A no-op regen that "broke nothing" but fixed nothing is rejected and
 * retried — otherwise an unfixed defect would be silently marked repaired.
 */
const acceptanceReason = (before: ValidatorResult, after: ValidatorResult): string | null => {
  const newViolations = after.violations.filter((v) => !before.violations.includes(v));
  if (before.ok && !after.ok) return "regen made a clean property invalid";
  if (newViolations.length > 0) return `regen introduced: ${newViolations.join("; ")}`;
  if (after.score < before.score) return `regen lowered score ${before.score} → ${after.score}`;
  const improved = after.score > before.score || (!before.ok && after.ok);
  if (!improved) return `regen did not improve the targeted property (score ${after.score})`;
  return null; // accept
};

/**
 * Async, progress-or-revert repair of ONE defect: regenerate, re-validate, keep only if it strictly
 * improved and broke nothing else. The async, repair-strength analog of `mutateThenValidate` — kept
 * here because the prose-guard law is intentionally pure/sync and ship-not-regress, not repair-progress.
 */
export async function regenThenValidate(
  chapter: ProseChapter,
  buildRequest: (chapter: ProseChapter) => RegenRequest,
  regenerate: RegenFn,
  validate: ChapterValidator,
  maxAttempts: number,
): Promise<{ chapter: ProseChapter; applied: boolean; reverted: boolean; attempts: number; reason?: string }> {
  const before = validate(chapter);
  let lastReason = "no attempt made";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    let candidate: ProseChapter;
    try {
      candidate = await regenerate(buildRequest(chapter));
    } catch (err) {
      lastReason = `regen threw: ${err instanceof Error ? err.message : String(err)}`;
      continue;
    }
    if (!candidate || !Array.isArray(candidate.paragraphs) || candidate.paragraphs.length === 0) {
      lastReason = "regen returned an empty chapter";
      continue;
    }
    const after = validate(candidate);
    const rejectReason = acceptanceReason(before, after);
    if (rejectReason) {
      lastReason = rejectReason;
      continue; // roll back this attempt; try again (or fall through to unresolved)
    }
    return { chapter: candidate, applied: true, reverted: false, attempts: attempt };
  }
  return { chapter, applied: false, reverted: true, attempts: maxAttempts, reason: lastReason };
}

/**
 * Run the full repair loop over a chapter's defect list. Each defect is repaired independently and
 * sequentially (a later regen sees earlier accepted edits), gated by `validate`. Defects that exhaust
 * their attempts are returned in `unresolved` and reported via `onUnresolved` — the caller decides
 * whether to flag-for-rewrite or fall to the logged emergency floor (never silent).
 */
export async function runRegenRepair(
  chapter: ProseChapter,
  defects: ReadonlyArray<ProseDefect>,
  buildRequest: (chapter: ProseChapter, defect: ProseDefect) => RegenRequest,
  regenerate: RegenFn,
  validate: ChapterValidator,
  options: RegenRepairOptions = {},
): Promise<RegenRepairResult> {
  const maxAttempts = Math.max(1, options.maxAttemptsPerDefect ?? 2);
  let current = chapter;
  const outcomes: RepairOutcome[] = [];
  const unresolved: ProseDefect[] = [];

  // Hard defects first — they gate the ship decision; soft defects are quality nudges.
  const ordered = [...defects].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "hard" ? -1 : 1));

  for (const defect of ordered) {
    const res = await regenThenValidate(
      current,
      (c) => buildRequest(c, defect),
      regenerate,
      validate,
      maxAttempts,
    );
    current = res.chapter;
    outcomes.push({
      defect,
      applied: res.applied,
      reverted: res.reverted,
      attempts: res.attempts,
      reason: res.reason,
    });
    if (!res.applied) {
      unresolved.push(defect);
      options.onUnresolved?.(defect, res.reason ?? "unresolved");
    }
  }

  return { chapter: current, outcomes, unresolved };
}
