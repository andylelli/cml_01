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
  if (!improved) {
    // X2 (REVIEW_05 §12.2) — name the failing checks and both scores.
    //
    // This used to report the bare sum: "did not improve the targeted property (score 200)". That
    // number was read, reasonably, as the MAXIMUM of a two-check validator — making the pass look
    // like it had judged a chapter clean that its own detector had just judged defective, and
    // costing a diagnosis that nearly loosened the acceptance rule. It is nothing of the kind:
    // `composeChapterValidator` silently prepends `noScaffoldValidator`, so the mechanism pass
    // scores out of THREE checks, and 200 is one of them still failing. The message now says which.
    const stillFailing = after.violations.length > 0 ? `; still failing: ${after.violations.join(", ")}` : "";
    return `regen did not improve the targeted property (score ${after.score}, was ${before.score}${stillFailing})`;
  }
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
  /**
   * A_73 §32 — the per-defect validator, so acceptance can be judged on the property being
   * repaired rather than on a sum across every defect in the chapter. Optional: callers that do
   * not supply it keep the previous whole-composite behaviour exactly.
   */
  presenceValidatorFor?: (defect: ProseDefect) => ChapterValidator,
): Promise<RegenRepairResult> {
  const maxAttempts = Math.max(1, options.maxAttemptsPerDefect ?? 2);
  let current = chapter;
  const outcomes: RepairOutcome[] = [];
  const unresolved: ProseDefect[] = [];

  // Hard defects first — they gate the ship decision; soft defects are quality nudges.
  const ordered = [...defects].sort((a, b) => (a.severity === b.severity ? 0 : a.severity === "hard" ? -1 : 1));

  /**
   * ── PASS 12: STOP PAYING FOR A LOOP THAT IS NOT CONVERGING ───────────────────────────────────────
   *
   * The only bound here was `maxAttemptsPerDefect` (2). The DEFECT COUNT is unbounded — it is however
   * many obligations the chapter failed — so total calls are 2 x defects with no ceiling anywhere.
   *
   * MEASURED on the arm-A run of 2026-08-27, from the LLM log: regen was the single largest consumer
   * of the run, 33 calls and 40% of wall-clock, MORE than chapter generation itself. And it was not
   * spread — ch3 took 20 of the 33 (six missing_clue x 2, three clue_too_late x 2, one scaffold x 2)
   * and EVERY ONE FAILED. The deterministic floor then fired and pasted the key-term bags anyway; the
   * external reader's note on that manuscript was "the worst leakage is in Chapter 3".
   *
   * So those twelve calls bought nothing. They could not: the defects share a chapter and a cause, and
   * a rewrite that cannot surface clue 1 will not surface clue 5 either.
   *
   * The stop is on CONSECUTIVE FAILURES OF ONE KIND, not on a raw call count. A chapter with many
   * defects that are actually being fixed is money well spent and is not interrupted; a chapter whose
   * first `k` repairs of a kind all failed has demonstrated the pass cannot do it. Remaining defects
   * are passed to `unresolved` UNTOUCHED, which is exactly where a failed repair would have put them —
   * so the deterministic floor still sees them and no obligation is silently dropped.
   *
   * Flag-gated `AGENT9_REGEN_CONVERGENCE_STOP` (default OFF), read at call time. Off, the loop is
   * byte-identical to today.
   */
  const convergenceStopEnabled = /^(1|true|yes|on)$/i.test(process.env.AGENT9_REGEN_CONVERGENCE_STOP ?? "");
  const CONSECUTIVE_FAILURE_LIMIT = Math.max(
    2,
    Number(process.env.AGENT9_REGEN_CONVERGENCE_LIMIT) || 3,
  );
  const consecutiveFailuresByKind = new Map<string, number>();
  let abandonedForNonConvergence = 0;

  for (const defect of ordered) {
    if (convergenceStopEnabled
      && (consecutiveFailuresByKind.get(defect.kind) ?? 0) >= CONSECUTIVE_FAILURE_LIMIT) {
      // Untouched into `unresolved` — the deterministic floor's input is unchanged.
      unresolved.push(defect);
      abandonedForNonConvergence += 1;
      options.onUnresolved?.(
        defect,
        `regen abandoned: ${CONSECUTIVE_FAILURE_LIMIT} consecutive ${defect.kind} repairs failed in this chapter, `
        + `so this one was not attempted (saved ${maxAttempts} call(s)). The floor still covers it.`,
      );
      continue;
    }
    /**
     * A_73 §32 — JUDGE THE DEFECT THAT WAS REPAIRED, NOT THE SUM.
     *
     * `validate` is composed ONCE over every defect in the chapter, and `composeChapterValidator`
     * returns `score` as the SUM across all checks. Repairs, however, happen one defect at a time.
     * So a regen aimed at clue A which failed to insert A, but whose rewrite incidentally surfaced
     * clue B's tokens, scored +100 and was accepted — marking A `applied`, keeping it out of
     * `unresolved`, and therefore out of the deterministic floor that exists to catch it.
     *
     * The commit-time obligation check still caught the genuinely-missing clue, so this never
     * shipped a broken book. It spent a paid call to reach the wrong conclusion and then reported a
     * `repaired` list that was not true.
     *
     * The fix keeps BOTH conditions rather than swapping one for the other:
     *   - the targeted defect's own validator must improve  (progress on the right thing)
     *   - the composite must not regress                    (no collateral damage) — unchanged
     * A defect with no presence validator of its own falls back to the composite, which is the
     * previous behaviour.
     */
    const targeted = presenceValidatorFor?.(defect);
    const scopedValidate: ChapterValidator = targeted
      ? (chapter) => {
          const whole = validate(chapter);
          const own = targeted(chapter);
          // `ok` and `violations` stay whole-chapter so collateral regressions still reject.
          // `score` becomes the targeted property's, so "improved" can only mean THIS defect.
          return { ok: whole.ok, score: own.score, violations: whole.violations };
        }
      : validate;

    const res = await regenThenValidate(
      current,
      (c) => buildRequest(c, defect),
      regenerate,
      scopedValidate,
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
    // Track convergence per KIND: a run of failures on one defect kind in one chapter is evidence the
    // pass cannot do it here. A success resets the counter, so a chapter that is being repaired keeps
    // its full budget.
    if (res.applied) consecutiveFailuresByKind.set(defect.kind, 0);
    else consecutiveFailuresByKind.set(defect.kind, (consecutiveFailuresByKind.get(defect.kind) ?? 0) + 1);

    if (!res.applied) {
      unresolved.push(defect);
      options.onUnresolved?.(defect, res.reason ?? "unresolved");
    }
  }

  if (abandonedForNonConvergence > 0) {
    // Reported, never silent. A saving nobody can see is indistinguishable from a pass that quietly
    // stopped trying — the whole point is that the number is legible next to the retry telemetry.
    options.onUnresolved?.(
      ordered[ordered.length - 1],
      `regen convergence stop: ${abandonedForNonConvergence} defect(s) not attempted after `
      + `${CONSECUTIVE_FAILURE_LIMIT} consecutive failures of their kind — saved about `
      + `${abandonedForNonConvergence * maxAttempts} LLM call(s).`,
    );
  }
  return { chapter: current, outcomes, unresolved };
}
