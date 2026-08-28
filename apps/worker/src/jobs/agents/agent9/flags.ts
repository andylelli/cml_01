/**
 * Agent 9's behaviour flags — S4, first tranche (REVIEW_03 item 6).
 *
 * WHY THIS IS ITS OWN MODULE. `agent9-run.ts` is ~7,100 lines, and the first ~200 of them are the
 * flag surface: every lever the corpus regime governs, each with the board reference that created it.
 * They are read by the orchestration function but are not part of it, and keeping them here makes the
 * set enumerable — which is what `npm run flags:check` and FLAG-AUDIT both need.
 *
 * THE ONE RULE THAT MATTERS HERE, restated because it has been violated in this codebase before
 * (`module-const-flags-frozen-before-dotenv`): every entry is a GETTER, evaluated per call. The
 * worker and the canary call dotenv's `config()` AFTER their hoisted static imports, so a
 * module-level `const enabled = process.env.X === "true"` freezes to the default before `.env.local`
 * is read, and a flag set only there silently never fires.
 */

export const parseBooleanEnv = (value: string | undefined, fallback: boolean): boolean => {
  if (value === undefined || value === null || value.trim() === "") return fallback;
  const normalized = value.trim().toLowerCase();
  if (["1", "true", "yes", "y", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "n", "off"].includes(normalized)) return false;
  return fallback;
};

/**
 * Agent 9 redesign Phase A (§4.2): validation-gated mutation. When ON, every deterministic prose
 * mutation that has a machine-checkable validator (today: the grounding-lead injector vs the §3.2
 * location-metadata-dump leak) is wrapped in `mutateThenValidate` and reverted if it regresses the
 * property. Default ON (the safety law is active); set `AGENT9_MUTATION_REVALIDATION=0` to disable.
 * When on but no regression occurs, behaviour is identical to legacy (the lead ships unchanged); it
 * only ever REVERTS a lead that would have introduced a metadata-dump opening (a strict improvement).
 */
// Read at RUNTIME, not import time: the worker/canary call dotenv `config()` AFTER their (hoisted)
// static imports, so a module-level `const = process.env.X` would freeze to the default before
// .env.local loads and a flag set only there would silently never flip. Getters read on each call.
export const isMutationRevalidationEnabled = () => parseBooleanEnv(process.env.AGENT9_MUTATION_REVALIDATION, true);

/**
 * ROADMAP_TO_80 M1: the deterministic grounding-lead PREPEND cycled 5 fixed location-preamble
 * templates onto the front of (almost) every chapter — the dominant prose offender behind the judge's
 * "repeated atmospheric/setting descriptions", the Ch1 location mismatch (keyLocations[idx % n] ≠ the
 * scene's room), and the Ch6 verbatim doubled opener. It is now OFF by default: chapters keep the
 * model's own opening (gpt-4.1 + the OPENING_STYLE_ROTATION prompt guidance). Reversible — set
 * `AGENT9_GROUNDING_LEAD=1` to restore the prepend. The leak/duplicate SANITISATION fallbacks
 * (replacing a scaffold-leak or exact-duplicate paragraph) still use the template as a last resort.
 *
 * A_52 item 3: kept OFF by default ON PURPOSE. Scene-grounding is only a release-gate *warning*, but the
 * prepend's repetition was itself a K2 prose penalty ("repeated atmospheric/setting descriptions") — so
 * forcing it to clear the warning can lower the score we are trying to raise. The primary lever is now
 * the prompt reconciliation (OPENING_STYLE_ROTATION + the grounding checklist no longer fight). The
 * opt-in path is still improved: the Ch1 location-mismatch noted above is FIXED — the lead now anchors
 * to a location the chapter actually visits (preferredLocationName), so enabling it no longer describes
 * the wrong room.
 */
export const isGroundingLeadEnabled = () => parseBooleanEnv(process.env.AGENT9_GROUNDING_LEAD, false);

/**
 * First-principles LLD §6.1 / phase P2 — promote the world-state contradiction gate and the
 * discriminator verifier from warn-level telemetry to SOURCE-LEVEL BLOCKING: an incoherent or unsound
 * case is repaired upstream (Agent 3b/5/7), never papered over in prose. OFF by default — flipping it
 * on turns previously-shipping unsound cases into aborts, so it must land with an upstream repair hook
 * and clear an N≥4 gate first. When off, behaviour is unchanged (the conflicts stay warnings).
 */
export const isBibleGatesBlockingEnabled = () => parseBooleanEnv(process.env.AGENT9_BIBLE_GATES_BLOCKING, false);

/**
 * First-principles LLD §6.5 / phase P5 — the critique→rewrite-at-creative-temperature pass. After
 * generation, the lowest-scoring chapters are critiqued against the rubric and rewritten at temp
 * 0.7–0.9, with deterministic re-validation + rollback (the rewrite can never drop a locked fact or
 * smuggle scaffold; clue-presence and pronoun fidelity are additionally backstopped by the downstream
 * story-validation pipeline + pronoun sweep). OFF by default; scoped to ≤4 chapters for the 2× ceiling.
 */

/**
 * First-principles LLD §6.4 / phase P4 (RC1.2/RC1.3) — the deductive-scaffold / report-style-clearance
 * regen pass. After generation + deterministic hygiene, any chapter whose endgame ships its deduction or
 * a suspect clearance as a templated verdict (the rubric caps: prose ≤ 4 scaffold, prose ≤ 6 / ending ≤ 7
 * report-style) has the flagged paragraph DRAMATIZED in-scene via the scoped regen loop, gated so a
 * rewrite ships only if it clears the shape AND drops no locked fact. OFF by default; N≥4 before default-on.
 */
// P4 VERDICT (2026-07-17, the A/B deferred since A_54): default ON. n=7 matched pairs — A1 scaffold
// 14→0, total scaffold hits 20→3 (−85%), cost neutral ($1.31→$1.24), two magnitude-1 regressions
// (one +1 scaffold on a control-clean run, one +1 pronoun signal) against 17 hits removed. The env
// had run it ON observationally since RC1.2; the A/B validates that config, so the code default now
// matches it (the P4.4 empty-env goal). Full table: scratchpad p3-ab/scaffold-analysis.txt +
// results/ab-agent9_regen_scaffold/.
export const isScaffoldRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_SCAFFOLD, true);

/**
 * A_62 RC-2.1 — the repair arm for `templateLeakageHits`, the most frequent cap of the M1 era (7/15
 * runs; it pins `prose ≤4` on 10/15 and fires with NO scaffold-family cap on 4/15, so the P4 scaffold
 * A/B provably cannot reach those runs). The detector, the `"leakage"` defect kind and its regen
 * instruction all shipped already — only the producer was missing (see `runTemplateLeakageRegenPass`).
 *
 * OFF by default, and deliberately so: an unmeasured default-on lever is the A_54 trap, and it would
 * silently confound the P4 scaffold read (the two caps co-fire on 3/15 runs). N≥4 matched pairs before
 * default-on. Runtime getter, never a module const — the flags-freeze-before-dotenv trap.
 */
export const isTemplateLeakageRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_LEAKAGE, false);

/**
 * A_62 RC-2.2 — the repair arm for `dualValueNoContrast` (Item 9, A_57 D2): 6/21 shipped runs and
 * accelerating (3 of 5 on M1 attempt 3). The detector was promoted from rubric-score into
 * prose-guard so cap and lever key off the same function. Pair source: `worldState.contradiction`
 * — the SAME `ctx.discriminatingContradiction` the final rubric consumes (never re-derived).
 * OFF by default (N≥4 matched pairs before default-on); runtime getter, never a module const.
 */
export const isDualValueRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_DUAL_VALUE, false);
/** A_66 P3 — the verify-mode pronoun regen channel; precision-triggered, cost-bounded. */
export const isPronounRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_PRONOUN, true);

/** A_61 RC1.4 — dramatize the reveal/culprit-evidence in-scene instead of pasting the deterministic
 * "It was me… I confess" resolution backstop / "beyond all reasonable doubt" culprit sentence. Both
 * default-off (N≥4 before default-on), runtime-read; the deterministic injectors stay as the floor. */
export const isResolutionRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_RESOLUTION, false);
export const isCulpritEvidenceRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_CULPRIT_EVIDENCE, false);
/** A_67 FIX-1(b) — dramatize suspect clearances in-scene (witnessed deduction) instead of pasting the
 * deterministic "X was thoroughly cleared by the evidence…" register sentence. Default-off (probe before
 * default-on), runtime-read; enforceSuspectEliminationPresence stays as the last-resort floor so a run
 * whose clearance the LLM cannot dramatize never aborts the release gate. */
export const isSuspectEliminationRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_SUSPECT_ELIM, false);

/** A_61 RC3.3 — dramatize an explicit body-discovery bridge when prose shifts a missing-person frame to
 * murder with none. Default-off (N≥4 before default-on), runtime-read. */
export const isTransitionRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_TRANSITION, false);

/** A_61 roadmap S8 — the fifth regen pass: withhold the causal mechanism explanation in any chapter
 * strictly before the discriminating-test chapter (the plot_structure/pacing "mechanism explained too
 * early" cap). Default-off (powered ≥4×4 A/B before default-on), runtime-read. */
export const isMechanismRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_MECHANISM, false);

/** A_61 roadmap S2 — the reliability floor for `illegal_named_walk_on`: rewrite an out-of-cast titled
 * walk-on to a role noun instead of aborting the run over an incidental extra. Default-off, runtime-read. */
export const isWalkonRepairEnabled = () => parseBooleanEnv(process.env.AGENT9_WALKON_REPAIR, false);

/** Ledger Item 15 — LLM-first surfacing of missing atomic locked-fact values (insertion regen) so the
 * deterministic "The hour stood at X." injector (externally read as generated-sounding, 2/4 S0 reviews)
 * becomes a rare floor instead of the norm. Default-off, runtime-read; N≥4 before default-on. */
export const isLockedFactRegenEnabled = () => parseBooleanEnv(process.env.AGENT9_REGEN_LOCKED_FACT, false);

/** A_61 RC2.2 — dereference the frozen Bible gender map as the SINGLE authoritative pronoun source
 * (validators + narrative state), instead of each site re-parsing raw cast gender. Default-off. */
export const isBibleAuthoritativeEnabled = () => parseBooleanEnv(process.env.AGENT9_BIBLE_AUTHORITATIVE, false);

/** A_61 RC5.3 — the dialogue-distinctiveness (voice idiolect) gate mode: off | shadow | enforce.
 * Default off. shadow logs coverage/leakage telemetry; enforce additionally surfaces leakage as a
 * release-gate warning (repair-not-abort — never aborts the run). Runtime-read. */
export const voiceEnforceMode = (): "off" | "shadow" | "enforce" => {
  const m = String(process.env.AGENT9_VOICE_ENFORCE ?? "off").trim().toLowerCase();
  return m === "enforce" ? "enforce" : m === "shadow" || m === "1" || m === "true" || m === "on" ? "shadow" : "off";
};

/**
 * A_75 §12 — trim a clearance REGISTER back to the geometry budget. Read at call time.
 * `clearance_over_budget` is the most frequent geometry code (74% of archived runs) and had no repair.
 */
export const isClearanceTrimEnabled = () => parseBooleanEnv(process.env.AGENT9_CLEARANCE_TRIM, false);
