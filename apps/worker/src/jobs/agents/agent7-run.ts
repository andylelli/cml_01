/**
 * Agent 7: Narrative Formatter
 *
 * Extracted from mystery-orchestrator.ts. Runs formatNarrative() via
 * runStage (scoring retries when scoring is enabled), applies schema repair,
 * runs the pre-prose outline quality gate, and applies deterministic clue
 * pacing. Writes ctx.narrative and ctx.outlineCoverageIssues.
 */

import { isChronologyEnabled as isA90ChronologyEnabled, deriveCaseChronology, findUnanchoredClockValues, summariseChronology, verifiedFixesEnabled } from "@cml/cml";
import { auditCmlSceneRefs, summariseSceneRefAudit, reconcileCmlSceneRefs, isSceneRefReconcileEnabled, measureClueObligationLoad, summariseClueObligationLoad } from "@cml/prompts-llm";
import { getSceneTarget, getGenerationParams } from "@cml/story-validation";
import {
  type OrchestratorContext,
} from "./shared.js";
import {
  adoptOutlineCandidate,
  normalizeRawOutline,
} from "./agent7/normalize.js";
import {
  type Agent7Run,
  ensureSchemaValid,
  generateInitialOutline,
} from "./agent7/generate.js";
import {
  applyWorldFirstSceneEnrichment,
} from "./agent7/world-first.js";
import {
  applyCoveragePatch,
  enforceOutlineQuality,
} from "./agent7/outline-coverage.js";
import {
  enforceSceneCount,
} from "./agent7/scene-count.js";
import {
  buildCluePacingGuardrails,
  enforceCluePacing,
  forceAssignUncoveredClues,
} from "./agent7/clue-pacing.js";
import {
  enforceCompletenessContract,
  enforcePreCommitCompleteness,
} from "./agent7/completeness.js";
import {
  commitAndStampOutline,
  warnBeatArcDrift,
} from "./agent7/stamps.js";
import {
  applyIdentityRuleCollisionRepair,
} from "./agent7/identity-rules.js";
// A7-01 / CR-24: the phases live in ./agent7/; re-exported so existing importers keep this path.
export {
  IdentityRuleCollision,
  applyIdentityRuleCollisionRepair,
  detectIdentityRuleOccupationCollisions,
} from "./agent7/identity-rules.js";
export {
  applyDecisiveTracePlant,
  applyMotivePlantBeforeReveal,
  applyPlantBeforeReveal,
  applySuspectClearanceGate,
  ensureDiscoverySceneMethodTellPresent,
  ensureDiscriminatingTestEvidencePresent,
} from "./agent7/stamps.js";
export {
  applyDeterministicCluePreAssignment,
  computeDeterministicGapFillCap,
} from "./agent7/clue-pacing.js";
export {
  rebalanceNarrativeSceneCountsDeterministically,
} from "./agent7/scene-count.js";
export {
  countSuspectClosureScenes,
} from "./agent7/outline-coverage.js";
export {
  applyWorldFirstSceneEnrichment,
} from "./agent7/world-first.js";
export {
  Agent7CoercionCounters,
  coerceNarrativeSceneBeats,
  emitAgent7CoercionTelemetry,
  hoistMisplacedSceneFields,
  recordAgent7Coercion,
  stripClearancesFromFinalScene,
  synthesiseMissingWordCounts,
} from "./agent7/normalize.js";
export {
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
} from "./agent7/scene-refs.js";
export {
  isAgent7ClueJobAuthorityEnabled,
  isAgent7MechanismGateEnabled,
  isAgent7SchedulerAuthoritative,
  isAgent7SchedulerShadowEnabled,
  isStripClearancesEnabled,
} from "./agent7/flags.js";

// ============================================================================
// runAgent7
// ============================================================================

export async function runAgent7(ctx: OrchestratorContext): Promise<void> {
  // DIAGNOSIS-BATCH #5 — before ANY formatNarrative call below reads ctx.cml! (all nine call sites
  // pass it directly), repair identity_rules in place so every one sees the same corrected data.
  applyIdentityRuleCollisionRepair(ctx);

  ctx.reportProgress("narrative", "Formatting narrative structure...", 75);
  const narrativePacingConfig = getGenerationParams().agent7_narrative.params.pacing;
  const minClueSceneRatio = narrativePacingConfig.min_clue_scene_ratio;
  const expectedSceneTarget = getSceneTarget(ctx.inputs.targetLength ?? "medium");
  const pacingGuardrails = buildCluePacingGuardrails(expectedSceneTarget, minClueSceneRatio);

  // Pillar 1: propagate locked fact registry to all formatNarrative calls
  const lockedFactsSpread =
    ctx.inputs.enableLockedFactRegistry && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0
      ? { lockedFacts: ctx.lockedFactRegistry }
      : {};

  // Pillar 4: propagate outline completeness opts to all formatNarrative calls
  const completenessSpread = ctx.inputs.enableOutlineCompleteness
    ? { enableOutlineCompleteness: true as const, characterBundle: ctx.characterBundle as any }
    : {};

  // A7-01: what every phase below reads besides ctx and the outline — resolved once, read-only.
  const run: Agent7Run = { minClueSceneRatio, pacingGuardrails, lockedFactsSpread, completenessSpread };

  let narrative = await generateInitialOutline(ctx, run);

  // ── Deterministic act-field repair ────────────────────────────────────────
  // The LLM intermittently omits the required `purpose` field on one or more acts
  // (most commonly acts[2], Act III).  Synthesise a default before schema validation
  // so the repair retry is not wasted on this trivial gap.
  // A7-02 (owner decision 12, CML_VERIFIED_FIXES): the same normalisation through the one adoption
  // pipeline every later route uses, plus its warn-only schema line. OFF: normalizeRawOutline alone.
  if (verifiedFixesEnabled()) adoptOutlineCandidate(ctx, narrative, "initial");
  else normalizeRawOutline(ctx, narrative);

  // ── Schema repair ──────────────────────────────────────────────────────────
  narrative = await ensureSchemaValid(ctx, run, narrative);

  // ── Scene count final gate ────────────────────────────────────────────────
  // The scene count produced by the LLM MUST be within ±getChapterTargetTolerance()
  // of STORY_LENGTH_TARGETS[targetLength].scenes.  Prose generates one chapter per
  // scene, so a small deviation is acceptable and does not break story structure.
  // Only counts outside the tolerance trigger a retry / abort.
  narrative = await enforceSceneCount(ctx, run, narrative);

  // ── Pre-prose outline quality gate ────────────────────────────────────────
  // X32 diagnosis, ALWAYS ON and never an issue by itself: the count is what the board could not see.
  // REVIEW_13 §8.2 had to read the manuscript to learn that the clearances were written three times,
  // because nothing in the pipeline reported how many scenes were given the job. This costs nothing
  // and changes no behaviour — whether the count becomes a repair is `AGENT9_FOLD_SUSPECT_CLEARANCES`.
  narrative = await enforceOutlineQuality(ctx, run, narrative);

  // ── Clue pacing gate ──────────────────────────────────────────────────────
  narrative = await enforceCluePacing(ctx, run, narrative);

  // ── Pre-commit completeness gate (single bundled remediation pass) ──────
  narrative = await enforcePreCommitCompleteness(ctx, run, narrative);

  // ── World-First scene enrichment ─────────────────────────────────────────
  // Applies the five deterministically-derivable World-First fields to every
  // scene entry. subtextNote is left to the Agent 7 LLM output.
  if (ctx.worldDocument) {
    applyWorldFirstSceneEnrichment(narrative, ctx.worldDocument);
    ctx.warnings.push(
      `World-First enrichment applied: emotionalRegister, humourGuidance, eraTextureNote, ` +
      `locationRegisterNote, dominantCharacterNote set on all ` +
      `${narrative.acts?.flatMap((a: any) => a.scenes ?? []).length ?? 0} scenes.`,
    );
  }

  // ── Pillar 4: Outline completeness gate (Unit 4.2) ───────────────────────
  // Deterministic pre-patch: set redHerringPlacement = null for any Act 1-2 scene
  // that omits the field entirely.  The gate only requires the key to be present
  // (null is valid — meaning "no red herring in this scene").  The LLM frequently
  // omits it on non-red-herring scenes.  This patch eliminates the stochastic
  // failure without masking real red-herring assignment logic.
  enforceCompletenessContract(ctx, narrative);

  // ── Clue-coverage gate: every distribution ID must appear in ≥1 scene's cluesRevealed ─
  // Agent 7 LLM sometimes front-loads clues into early scenes and leaves Agent-5-synthesized
  // supporting/optional IDs unanchored. This gate deterministically force-assigns any
  // uncovered ID to an appropriate scene, preserving the scene-count lock.
  forceAssignUncoveredClues(ctx, narrative);

  // ── Deterministic coverage patch ─────────────────────────────────────────
  // If the outline still lacks a discriminating-test scene after all LLM
  // retries, inject the required vocabulary directly into the purpose of the
  // best candidate scene (last Act-2 scene, or first Act-3 scene).  This
  // prevents the agent-9 hard-stop while preserving all other scene content.
  // A_53 P10 (outline-coverage-evaluated-thrice): hoist the coverage result + a "did a patch mutate
  // a scene purpose?" flag so the post-block recompute for ctx.outlineCoverageIssues can reuse this
  // scan when nothing changed (the 4 whole-corpus regex scans were re-run up to 4×/run).
  const { finalCoverageIssues, coveragePatched } = applyCoveragePatch(ctx, narrative);

  // SWEEP B: for the 10-chapter Golden Age format, verify the named beat arc appears in order.
  // Non-blocking (warnings) so legacy/medium/long outlines are unaffected; surfaces drift for triage.
  warnBeatArcDrift(ctx, narrative);

  // A_67 review fix (missing-coercion on retry paths): normalise the FINAL outline once, regardless of
  // which retry/remediation path produced it. The narrative-replacing retries (scene-count / coverage /
  // pacing / pre-commit remediation) assign a fresh formatNarrative() result WITHOUT re-running beat
  // coercion or field hoisting, so an uncoerced synonym beat (e.g. "resolution" → "revelation") could
  // reach Agent 9 and misfire the aftermath-chapter stage-mode (permitting a duplicate reveal). Both
  // passes are idempotent — a no-op when the first attempt already passed through them.
  commitAndStampOutline(ctx, narrative, coveragePatched, finalCoverageIssues);

  /**
   * A_87 P1 — referential integrity for the CML -> outline scene join, as TELEMETRY.
   *
   * Agent 3 emits act/scene coordinates into a namespace Agent 7 only creates afterwards. Replaying
   * the shipped matcher over all 45 archived (cml, outline) pairs MEASURED that
   * `culprit_revelation_scene` resolves exactly 0/45, `discriminating_test_scene` 1/45 and
   * `suspect_clearance_scenes` 4/179 — so every chapter contract in Agent 9 has been assigned by a
   * keyword fallback for the life of the project, and on 24% of runs the reveal contract lands on no
   * chapter at all. None of that was visible because a keyword match returns exactly what an exact
   * match returns: there was no record of WHICH PATH RESOLVED.
   *
   * This is deliberately NOT a gate. B1 forbids gating something that fires on 98% of runs, and
   * aborting 24% of runs over a contract they have survived would be the wrong trade (A_87 §6,
   * "Not recommended"). One line, unconditional, so the rate is on the record from now on.
   */
  try {
    const auditScenes = ((narrative as any).acts ?? []).flatMap((a: any) => a?.scenes ?? []);

    /**
     * A_87 P7 (flag-gated, default OFF) — rewrite the CML scene refs to coordinates that exist,
     * now that the outline is final. Agent 3 emitted them before this namespace was created, so
     * `culprit_revelation_scene` resolves 0/45 across the archive. Narrow by design: clearances are
     * left to `clearance-ownership.ts` (one writer per field, WF-002) and the clue mapping already
     * resolves at 87%. Runs BEFORE the audit below so the line reports the reconciled state.
     */
    if (isSceneRefReconcileEnabled()) {
      const rec = reconcileCmlSceneRefs(ctx.cml as any, auditScenes);
      if (rec.rewritten.length > 0 || rec.unplaced.length > 0) {
        ctx.warnings.push(
          `[A_87 scene-ref reconcile] rewritten: ${rec.rewritten.join("; ") || "none"}` +
            (rec.unplaced.length ? ` | could not place: ${rec.unplaced.join("; ")}` : ""),
        );
      }
    }

    const refAudit = auditCmlSceneRefs(ctx.cml as any, auditScenes);
    ctx.warnings.push(`[A_87 scene-ref join] ${summariseSceneRefAudit(refAudit)}`);

    /**
     * A_89 B2 — the clue-obligation load, counted at the point the outline is final.
     *
     * Fourteen clue obligations in one chapter cannot be dramatized; they will be recited, and the
     * reader of run 88651 named that three times over. This COUNTS rather than caps: dropping an
     * obligation drops a clue, and fair play is the one thing the pipeline may not trade away. B1's
     * ownership split reduces the ASK without losing anything; this makes a heavy schedule visible
     * before a reader finds it.
     *
     * Counted from the stored mapping, so it UNDER-reports the live prompt: Agent 7's gap-fill and
     * threshold-fill passes add obligations after this point (artifact-level median re-mandate 14%,
     * prompt-level 41% over 47 logged runs). The heaviest-chapter figure is the actionable half.
     */
    const clueLoad = measureClueObligationLoad(ctx.cml as any, auditScenes);
    ctx.warnings.push(`[A_89 clue load] ${summariseClueObligationLoad(clueLoad)}`);
    // A_90 Move 1 — does the outline introduce clock values the case never declared? Telemetry only.
    if (isA90ChronologyEnabled()) {
      const chrono = deriveCaseChronology(ctx.cml, (ctx.lockedFactRegistry ?? []) as any[]);
      const anchoring = findUnanchoredClockValues(auditScenes, chrono, { skip: () => false });
      ctx.warnings.push(`[A_90 chronology] outline: ${summariseChronology(chrono, anchoring)}`);
    }
  } catch (e) {
    // Telemetry must never cost an outline — the same rule the stamping passes above follow.
    ctx.warnings.push(`[A_87 scene-ref join] audit skipped: ${(e as Error).message}`);
  }
}

