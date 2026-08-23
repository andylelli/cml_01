/**
 * The suspect-clearance gate — pacing's only named defect, repaired rather than retried.
 *
 * ── WHAT THE READERS ACTUALLY SAID ───────────────────────────────────────────────────────────────
 *
 * `pacing` has never been given a 9 in **34 external reads** (`npm run ledger:external-read -- --gaps`),
 * and on the best eight manuscripts four of them name the SAME defect in the reader's own words:
 *
 *     "Builds well; Chapter 10 still repeats some of Chapter 9."
 *     "Good final trap; Chapter 9 repeats clearances after they are already resolved."
 *     "Good build; Chapters 9-10 repeat the reveal/clearances."
 *     "Builds well; Chapters 9-10 still repeat some material."
 *
 * A cleared suspect stays cleared. Every pass after the first spends a chapter re-answering a settled
 * question, which is why it reads as a pacing fault rather than a logic one.
 *
 * ── WHY A STAMP AND NOT AN ISSUE ─────────────────────────────────────────────────────────────────
 *
 * [X32](../../../architecture/REVIEW_05.md) built the DETECTION — `countSuspectClosureScenes` counts
 * the job per scene — and wired it to raise `duplicate_suspect_closure_scenes`. That put the repair on
 * the outline-RETRY path, and **that is the whole reason `AGENT9_FOLD_SUSPECT_CLEARANCES` has stayed
 * off**: 11 of 32 archived outlines allocate the job more than once, so the flag would have re-rolled
 * a third of all outlines — at a fresh Agent 7 call each — to fix a defect a retry cannot even be
 * relied on to avoid reproducing.
 *
 * The flag is named *fold*, not *retry*, and A_67 FIX-1 Change C designed it as a fold. This module is
 * that fold: it marks which single scene owns the clearance job and tells the prose writer that every
 * other one does not. No LLM call, no retry, no rewriting of an authored scene purpose.
 *
 * ── WHICH SCENE KEEPS THE JOB, AND WHY IT IS THE LAST ONE ────────────────────────────────────────
 *
 * The keeper is the LAST closure scene at or before the reveal — the clearances fold INTO the moment
 * the field is settled, which is where a Golden Age mystery puts them and what the flag's name says.
 * Keeping the first instead would leave the book clearing suspects in Act 2 and then revealing the
 * culprit with nothing left to resolve.
 *
 * A scene AT the reveal is a legitimate keeper; scenes after it are not, because by then the question
 * is answered — that is exactly the "Chapter 10 repeats Chapter 9" complaint. When every closure scene
 * sits after the reveal (no legitimate home), the earliest is kept rather than none: the floor check
 * requires the book to clear its suspects somewhere, and a gate that removed the last one would turn a
 * pacing fault into a fair-play one.
 */

/** The scene fields this gate reads and writes. Structural only — no story vocabulary. */
export interface ClearanceGateCell {
  /**
   * Set only on scenes that carry a clearance job, and only when there is more than one:
   * `true` on the single scene that owns it, `false` on every duplicate. Left UNSET otherwise, so a
   * prompt reading it can self-gate exactly as the mechanism-reveal gate does — no flags array to
   * keep in sync, and a run with one clearance scene is byte-identical to today.
   */
  suspectClearanceAllowed?: boolean;
}

export interface SuspectClearanceGateResult {
  /** Index (0-based, narrative order) of the scene that keeps the job, or -1 when the gate is inert. */
  keeperIndex: number;
  /** Scenes marked `suspectClearanceAllowed: false`. */
  suppressed: number;
  /** Why the gate did nothing, when it did nothing — never a silent no-op (X85's lesson). */
  reason?: "no-duplicates" | "no-closure-scenes";
}

export interface SuspectClearanceGateInput {
  /** 0-based indices, narrative order, of scenes that carry a suspect-clearance job. */
  closureIndices: ReadonlyArray<number>;
  /**
   * 0-based index of the reveal scene. `-1` when it cannot be located, in which case the LAST closure
   * scene keeps the job — the same "fold into the end" intent, without pretending to know where the
   * reveal is.
   */
  revealIndex: number;
}

/**
 * Decide which closure scene keeps the job. Pure: no scene objects, no mutation, so the rule can be
 * tested against the archived outlines without constructing a narrative.
 */
export function chooseClearanceKeeper({ closureIndices, revealIndex }: SuspectClearanceGateInput): number {
  const ordered = [...closureIndices].sort((a, b) => a - b);
  if (ordered.length === 0) return -1;
  if (revealIndex < 0) return ordered[ordered.length - 1];
  const atOrBefore = ordered.filter((i) => i <= revealIndex);
  // Every closure sits after the reveal: keep the earliest rather than none — see the header.
  return atOrBefore.length > 0 ? atOrBefore[atOrBefore.length - 1] : ordered[0];
}

/**
 * Stamp the gate onto the scenes, in place. A no-op unless MORE THAN ONE scene carries the job:
 * one clearance scene is the correct shape and must not be marked, or every run would carry the block.
 */
export function stampSuspectClearanceGate(
  scenes: ClearanceGateCell[],
  input: SuspectClearanceGateInput,
): SuspectClearanceGateResult {
  const closureIndices = [...input.closureIndices].filter((i) => i >= 0 && i < scenes.length);
  if (closureIndices.length === 0) return { keeperIndex: -1, suppressed: 0, reason: "no-closure-scenes" };
  if (closureIndices.length === 1) return { keeperIndex: closureIndices[0], suppressed: 0, reason: "no-duplicates" };

  const keeperIndex = chooseClearanceKeeper({ closureIndices, revealIndex: input.revealIndex });
  let suppressed = 0;
  for (const i of closureIndices) {
    const allowed = i === keeperIndex;
    scenes[i].suspectClearanceAllowed = allowed;
    if (!allowed) suppressed += 1;
  }
  return { keeperIndex, suppressed };
}
