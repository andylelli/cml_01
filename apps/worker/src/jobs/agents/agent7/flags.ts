/**
 * Agent 7 behaviour flags — getters read at call time (ADR-0004).
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */

/**
 * FOUND BY PRE-SPEND AUDIT 2026-08-05 (REVIEW_05 §24) — all four flags below were module-level
 * `const`s, and that made **N6's own lever unsettable**.
 *
 * Static `import` statements are hoisted and evaluated before any top-level statement in the
 * importing file, and both the worker entry (`index.ts`) and every canary harness call dotenv's
 * `config()` AFTER their imports. So a `const X = process.env.FLAG` here froze to its default before
 * `.env`/`.env.local` was ever read. Measured, with the real load order:
 *
 *     module-const (frozen at import): false      ← what the run would have used
 *     runtime getter (read at call)  : true       ← what .env actually said
 *
 * `AGENT7_SCHEDULER_AUTHORITATIVE` is exactly the lever N6 promotes over four paid runs. Set in
 * `.env.local`, it would have read `false` on all four, and the probe would have measured the control
 * arm four times at full price while reporting a promotion. Same class as the A_66 run that burned
 * £1.50, and as `module-const-flags-frozen-before-dotenv` — the rule `agent9/flags.ts` was written to
 * state. Getters, evaluated per call, are the fix; a flag set in the shell still works exactly as
 * before, which is why this went unnoticed.
 */

/** Shadow-only: log the deterministic scene grid next to the live outline. Default ON (logs only,
 * acts on nothing); set `AGENT7_SCHEDULER_SHADOW=0` to silence. */
export const isAgent7SchedulerShadowEnabled = (): boolean =>
  !/^(0|false|no|off)$/i.test(process.env.AGENT7_SCHEDULER_SHADOW ?? "");

/** P1.3: promote the deterministic scheduler from shadow-only to authoritative. When ON: (1) the
 * per-scene word budget is derived from the story-length pacing curve (leaner setup, fuller climax)
 * instead of a uniform floor, so chapter lengths vary (T1.3); and (2) each scene's revealed-clue
 * job is taken from the grid, which places every reveal in exactly one slot, so a clue is dramatized
 * once instead of being re-revealed across adjacent chapters (T1.2 — the dominant pacing smear).
 * Default OFF; never enable in the same run as another retry-gated lever. */
export const isAgent7SchedulerAuthoritative = (): boolean =>
  /^(1|true|yes|on)$/i.test(process.env.AGENT7_SCHEDULER_AUTHORITATIVE ?? "");

/** A_53 P8 (scheduler-authority-dark-no-safe-enable-path): split the scheduler-authority lever into
 * its two independent halves so the non-destructive one is safely enableable on its own. This flag
 * gates ONLY the once-per-clue grid clue-job stamp (the half that used to misalign + overwrite). It is
 * now additive + (act, act-scene-number)-aligned + coverage-re-validated, so enabling it can no longer
 * delete an LLM-assigned clue. Default OFF; `AGENT7_SCHEDULER_AUTHORITATIVE` alone now ships only the
 * safe pacing-shaped word budgets. */
export const isAgent7ClueJobAuthorityEnabled = (): boolean =>
  /^(1|true|yes|on)$/i.test(process.env.AGENT7_CLUE_JOB_AUTHORITY ?? "");

/** A_52 item 4 (mechanism-early-leak): the mechanism-reveal gate is a safe, targeted prompt hint —
 * withhold the full HOW-it-was-done explanation until the discriminating-test scene — that on its own
 * neither reorders scenes nor moves clues. It was previously trapped behind the heavier (default-OFF)
 * scheduler-authority experiment, so on normal runs the prose was NEVER told to withhold the mechanism
 * and the honest rubric correctly capped plot_structure/pacing ≤6 for the early leak. Decoupled here:
 * default ON, reversible via AGENT7_MECHANISM_GATE=0. */
export const isAgent7MechanismGateEnabled = (): boolean =>
  !/^(0|false|no|off)$/i.test(process.env.AGENT7_MECHANISM_GATE ?? "");

/** A_61 RC3.5 — guarantee the body-discovery scene references a cause-of-death "key tell" clue. Default
 * OFF (structural lever; N≥4 before default-on), read at runtime. Additive-only: appends one clue id to
 * the discovery scene's cluesRevealed, so it cannot violate the clue-pacing/coverage gates. */
export const isDiscoveryTellEnabled = () => /^(1|true|yes|on)$/i.test(process.env.AGENT7_DISCOVERY_TELL ?? "");

/**
 * A_61 RC3.5 — the discovery-scene mirror of ensureDiscriminatingTestEvidencePresent. Additively
 * guarantees the body-discovery scene (the "crime" beat / Act1 Scene1) references a clue that signals
 * the death_method, so the method's key tell lands EARLY rather than buried later in Act 1. A tell clue
 * is one Agent 5 tagged isDeathMethodTell, or whose description/pointsTo/keyTerms match a death-method
 * token. No-op when the discovery scene already references one, or when no tell clue exists.
 */
/** A_64 §3.3 C1 — flag for the plant-before-reveal outline stamp. Runtime getter, never a module
 *  const (the flags-freeze-before-dotenv trap). Default OFF; the A_64 probe flips it. */
export const isPlantBeforeRevealEnabled = () => /^(1|true|yes|on)$/i.test(process.env.AGENT7_PLANT_BEFORE_REVEAL ?? "");

/** DIAGNOSIS-BATCH #5 — runtime getter, never a module const (ADR-0004). Default OFF: this REPAIRS
 *  (drops a directive), and the codebase's own discipline is to measure a repair's firing rate before
 *  it changes what ships by default. See `applyIdentityRuleCollisionRepair`'s docblock for why. */
export const isIdentityRuleCollisionGuardEnabled = () =>
  /^(1|true|yes|on)$/i.test(process.env.AGENT7_IDENTITY_RULE_COLLISION_GUARD ?? "");

/** DIAGNOSIS-BATCH #2 — runtime getter, never a module const (ADR-0004). Separate flag from
 *  `AGENT7_PLANT_BEFORE_REVEAL`, which is already default-ON: this is a genuinely new obligation
 *  type (motive, not clue evidence) and needs its own measurement window, not to inherit the clue
 *  lever's already-settled default. Default OFF. */
export const isMotivePlantBeforeRevealEnabled = () =>
  /^(1|true|yes|on)$/i.test(process.env.AGENT7_MOTIVE_PLANT_BEFORE_REVEAL ?? "");

/**
 * Deterministically HOIST scene fields the model nested under `setting` up to the scene top-level, and
 * synthesise a missing `summary` from the model's own authored intent — in place.
 *
 * The Agent-7 formatter sometimes emits a scene with only a `title` at the top level and buries
 * `purpose` / `summary` / `characters` / `cluesRevealed` / `dramaticElements` INSIDE the `setting`
 * object (observed run a9c1e346 scene 7 "Secrets Beneath Secrets" — the bundled completeness
 * remediation reproduced the same misplacement, hard-aborting the run at
 * `evaluateOutlinePreCommitCompleteness`). The content is present and correct; only its location is
 * wrong. Recover the model's intent by copying each misplaced field to where the schema and prose
 * handoff expect it (never overwriting an existing top-level value; the nested copy is left in place
 * because the `setting` schema is permissive and nothing downstream reads these from it). Same doctrine
 * as `coerceNarrativeSceneBeats`: never abort a run over a field the model actually authored.
 *
 * @returns count of fields hoisted or synthesised.
 */
/**
 * A_94 — `AGENT7_STRIP_CLEARANCES_FROM_REVEAL`. The outline's final scene may not order the alibi
 * walk-back Agent 7's own prompt forbids.
 *
 * MEASURED over 50 stored outlines: 48 end on the reveal scene, and 15 of those give that scene a
 * purpose like "Confirm alibis of all suspects except the culprit; confront X" — AFTER the
 * discriminating test, in direct contradiction of the prompt's "clearing the innocent belongs BEFORE
 * the reveal". A_89 B3 then makes that chapter aftermath, and the purpose rides into the aftermath
 * prompt beside the AFTERMATH CONTRACT; the model obeys both. The 80/100 read of run 31372: "Chapter
 * 10 starts well, then reverts to alibi/timeline recap" — the recap scene 7 had already done.
 *
 * A retry would cost a prompt for a clause. This removes the clause: the clearance sentence or
 * `;`-clause is dropped from `purpose` and `summary`, and a leading "Clearances and" from the title.
 * Nothing is dropped when nothing separable remains, so a scene that is ONLY clearances is left for
 * the schema to judge. Loss-proof: the reveal half of the purpose is what survives.
 */
export const isStripClearancesEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT7_STRIP_CLEARANCES_FROM_REVEAL ?? "").trim());
