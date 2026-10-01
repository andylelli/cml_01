/**
 * Agent 3: CML Generator (+ Agent 4 auto-revision, + Agent 8 Novelty Auditor)
 *
 * Extracted from mystery-orchestrator.ts. Runs generateCML(), handles the
 * built-in Agent 4 auto-revision, records CML scoring, then runs the novelty
 * audit (Agent 8) with one retry on failure, and writes ctx.cml + ctx.noveltyAudit.
 */

import { generateCML, findUnplantedDiscriminatingClues, type CMLGenerationResult } from "@cml/prompts-llm";
import { checkTemporalClosure, isTemporalClosureCheckEnabled,
  deriveCaseTimeline, summariseCaseTimeline, isCaseTimelineEnabled,
  analyseTimeline, buildCaseModel, isCaseLogicEnabled, summariseTimeline,
  analyseProof, clearedBySceneOf, summariseProof } from "@cml/cml";
import { parseClockTime, buildCaseScopedLockedFacts,
} from "@cml/cml";
import type { PhaseScore } from "@cml/story-validation";
import { scoreRealCml } from "@cml/story-validation";
import { type OrchestratorContext, preAgent9ContractRecoveryEnabled, preAgent9LlmRetriesEnabled, honestScore } from "./shared.js";
// A_74 §8 DE3 — the bridge from the cross-run ledger into the structural judge's corpus.
import { writeLockedFactsArtifact, stripLeadingArticleFromLockedValue } from "./agent3b-run.js";
import {
  applyCmlRepairAndRevalidate,
  reportNormalizationNotes,
  buildCmlGenerationRequest,
  checkVictimCulpritCollision,
} from "./agent3/cml-acceptance.js";
import {
  runNoveltyPhase,
  scoreNoveltyPhase,
} from "./agent8-run.js";
// Re-exported so existing importers of this module keep their path.
export {
  buildCmlGenerationRequest,
  deriveAlibiSpans,
  repairCulpritAlibiCoverage,
} from "./agent3/cml-acceptance.js";

/**
 * Do the case's temporal anchors agree with the times the story will actually print?
 *
 * FOUND 2026-08-04, on the first live geometry run. Two agents invent times from non-overlapping
 * inputs and nothing reconciles them:
 *
 *   Agent 3b designs the hard-logic device and locks its facts — `false_time_displayed`,
 *   `resumption_time`. Those are INJECTED into the prose, so they are what a reader sees.
 *   Agent 3 authors `hidden_model.mechanism.{apparent,actual}_time_of_death`, and its prompt
 *   receives only the device's mechanism FAMILY, never its locked times.
 *
 * On the 08-04 run the case said 8:15 / 7:15 and the manuscript said 3:45 / 4:10 — the case's two
 * anchors appeared **zero times in the finished story**, five and six times respectively for the
 * device's. Everything reading the mechanism (the geometry contract, `checkCaseTimelineDeception`,
 * the rubric) was measuring a timeline the book does not have.
 *
 * WHY THIS REPORTS AND DOES NOT REPAIR. Exactly one mapping is unambiguous:
 * `false_time_displayed` ("clock time shown during the freeze") IS the apparent time of death.
 * `resumption_time` is when the mechanism restarted — NOT when anyone died — and `freeze_duration`
 * is a duration. Writing `actual_time_of_death` from either would fabricate a coherence claim the
 * case never made, which is the failure `timeline-deception.ts` documents in its own header. So the
 * divergence is surfaced and left to the owner: the root fix is upstream, giving Agent 3 the
 * device's locked times, and that is a prompt change under the corpus regime.
 */
export function checkLockedFactTimeAlignment(ctx: OrchestratorContext): string[] {
  const findings: string[] = [];
  const registry = ctx.lockedFactRegistry ?? [];
  if (registry.length === 0) return findings;

  const mechanism = ((ctx.cml as any)?.CASE ?? ctx.cml as any)?.hidden_model?.mechanism ?? {};
  const apparent = String(mechanism.apparent_time_of_death ?? "").trim();
  const actual = String(mechanism.actual_time_of_death ?? "").trim();

  const clockFacts = registry
    .map((f) => ({ ...f, minutes: parseClockTime(f.value) }))
    .filter((f) => f.minutes !== null);
  if (clockFacts.length === 0) return findings;

  // The one safe correspondence. Matched on the locked fact's OWN id/description, never on position.
  const staged = clockFacts.find(
    (f) => /false_time|displayed|staged|apparent/i.test(`${f.id} ${f.description}`),
  );
  // Only a STATED time can disagree with anything. An absent one means the case does not model a
  // false-time trick, and reporting a split there would manufacture a finding from missing input —
  // the same rule `timeline-deception.ts` holds itself to ("a generator that omits the fields is
  // never blocked by this").
  if (staged && apparent) {
    const apparentMinutes = parseClockTime(apparent);
    if (apparentMinutes === null) {
      findings.push(
        `the case states apparent_time_of_death "${apparent}", which does not parse as a clock time, ` +
          `while the locked fact ${staged.id} fixes the staged time at "${staged.value}"`,
      );
    } else if (apparentMinutes !== staged.minutes) {
      findings.push(
        `the case stages the death at "${apparent}" but locked fact ${staged.id} puts the displayed ` +
          `clock time at "${staged.value}" — the prose will print the locked value, so every check ` +
          `reading the mechanism is measuring a timeline the manuscript does not have`,
      );
    }
  }

  // The residual, reported because it cannot be safely derived: no locked fact means "time of death".
  if (actual && !clockFacts.some((f) => /actual|true[_ ]time|time_of_death/i.test(`${f.id} ${f.description}`))) {
    findings.push(
      `the case states actual_time_of_death "${actual}", and no locked fact corresponds to it — ` +
        `nothing binds the true time of death to anything the prose is contractually required to print`,
    );
  }
  return findings;
}

export async function runAgent3(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
  ctx.reportProgress("cml", "Generating mystery structure (CML) grounded in novel devices...", 31);

  // ── Agent 3: CML generation ────────────────────────────────────────────────
  let cmlResult = await generateAcceptedCml(ctx);

  // F1b: Victim/culprit collision check — retry once with explicit exclusions before failing.
  cmlResult = await retryOnVictimCulpritCollision(ctx, contractRecoveryEnabled, cmlResult);

  ctx.reportProgress("cml", "Mystery structure generated and validated", 50);

  // ── CML quality score ─────────────────────────────────────────────────────
  await scoreCmlPhase(ctx, cmlResult);

  // ── Agent 8: Novelty Audit ─────────────────────────────────────────────────
  // A_53 P6 (novelty-audit-is-NOT-disabled-live): resolve the default threshold from the SINGLE
  // source of truth (getGenerationParams, already clamped [0,1]) instead of a hardcoded 0.9 that
  // silently diverged from the YAML. Explicit ctx.inputs / env still override.
  cmlResult = await runNoveltyPhase(ctx, retriesEnabled, cmlResult);

  // ── Novelty phase score ───────────────────────────────────────────────────
  await scoreNoveltyPhase(ctx);

  // A_50 §9.3 fix #2 — observability: flag discriminating-test evidence that is NOT planted before
  // the reveal scene (the probe's "reveal uses evidence not planted earlier"). Non-fatal — surfaces
  // the gap for fair-play/repair without aborting; the contract fix lives in the Agent 3 prompt.
  try {
    const { unplanted, unmapped } = findUnplantedDiscriminatingClues(ctx.cml);
    if (unplanted.length > 0) {
      ctx.warnings.push(
        `[agent3-discriminating-planting] (pre-repair snapshot; Agent 6 reschedules) ${unplanted.length} discriminating clue(s) not planted before the reveal scene` +
          `${unmapped.length ? ` (${unmapped.length} absent from clue_to_scene_mapping)` : ""}: ${unplanted.join(", ")} — ` +
          `reveal may rely on unplanted evidence (fair-play risk).`,
      );
    }
  } catch { /* best-effort observability */ }

  extendLockedFactRegistryWithCaseFacts(ctx);
  reportTemporalClosure(ctx);
  reportCaseLogic(ctx);
}

async function generateAcceptedCml(ctx: OrchestratorContext) {
  const cmlStart = Date.now();
  let cmlResult = await generateCML(
    ctx.client,
    buildCmlGenerationRequest(ctx, ctx.noveltyConstraints),
    ctx.examplesRoot
  );

  cmlResult = applyCmlRepairAndRevalidate(cmlResult, ctx, "initial CML generation");

  ctx.agentCosts["agent3_cml"] = cmlResult.cost;
  ctx.agentDurations["agent3_cml"] = Date.now() - cmlStart;

  // A_80 F13 — see the call added after `ctx.cml` is assigned. This site runs BEFORE the CML exists,
  // so `checkLockedFactTimeAlignment` reads `undefined` and returns nothing. It is kept (harmless,
  // and it will start reporting if a future refactor assigns ctx.cml earlier) but it is no longer the
  // only call.
  for (const finding of checkLockedFactTimeAlignment(ctx)) {
    ctx.warnings.push(`Agent 3 time-model split: ${finding}.`);
  }

  reportNormalizationNotes(ctx, cmlResult); // what normalization invented (see the function)

  if (!cmlResult.validation.valid) {
    if (cmlResult.degraded) {
      // Phase 0 graceful-degrade (AGENT4_GRACEFUL_DEGRADE): revision ran out of budget but returned
      // a best-so-far CML. Carry the unresolved warnings and PROCEED rather than killing the run.
      const unresolved = cmlResult.unresolvedLogicWarnings ?? cmlResult.validation.errors;

      /**
       * TWO GATES DISAGREED ABOUT THE SAME VIOLATION, AND THE RUN PAID THE DIFFERENCE.
       *
       * MEASURED on run `mystery-1787089592928` (2026-08-18). Agent 4 ran out of revision budget on
       * `apparent_not_covered`, logged "proceeding with 1 unresolved validation warning", and the run
       * continued through Agents 5, 6, 6.5, 7 and 7.5 — all paid. Agent 9's preflight then re-ran the
       * SAME `validateCml` and threw: "Agent 9 aborted before prose generation: CML schema validation
       * failed: CASE.hidden_model.mechanism (apparent_not_covered)". 12.8 minutes and ~17 LLM calls
       * after the defect was known and consciously waived, for no manuscript.
       *
       * The graceful-degrade path cannot deliver a story when the unresolved warning is one of these:
       * they are computed purely from `hidden_model.mechanism` plus the culprit's `alibi_window`, and
       * NOTHING between here and Agent 9 writes either. `agent3-cml.ts`'s normalization only fills
       * defaults. So the late abort is deterministic, not bad luck.
       *
       * Fail at the cheap end — the same principle as X38 ("the case checked before prose"). This
       * changes no run that would otherwise have shipped: every run it stops was already going to die,
       * five agents later. Scoped deliberately to the timeline-deception codes rather than to
       * "validation invalid", because the general case cannot be proven unrepairable from here.
       */
      const UNREPAIRABLE_DEGRADE_CODES = ["apparent_not_covered", "actual_covered", "times_identical"];
      const fatal = unresolved.filter((e) => UNREPAIRABLE_DEGRADE_CODES.some((code) => String(e).includes(code))
      );
      if (fatal.length > 0) {
        fatal.forEach((e) => ctx.errors.push(`Agent 3: unrepairable CML defect — ${e}`));
        throw new Error(
          `CML generation failed validation: ${fatal.length} unrepairable defect(s) that Agent 9's ` +
          `preflight will reject and no downstream pass can fix — aborting here rather than after ` +
          `five more paid agents. First: ${String(fatal[0]).slice(0, 200)}`
        );
      }

      ctx.warnings.push(
        `Agent 4: CML degraded — proceeding with ${unresolved.length} unresolved validation warning(s) (ran out of revision budget).`,
        ...unresolved.slice(0, 10).map((e) => `Agent 4 unresolved: ${e}`)
      );
      ctx.revisedByAgent4 = true;
      ctx.revisionAttempts = cmlResult.revisionDetails?.attempts;
    } else {
      ctx.errors.push("Agent 3: Generated invalid CML after all attempts");
      throw new Error("CML generation failed validation");
    }
  }

  if (cmlResult.revisedByAgent4) {
    ctx.revisedByAgent4 = true;
    ctx.revisionAttempts = cmlResult.revisionDetails?.attempts;
    ctx.warnings.push(
      `Agent 4: Auto-revision triggered after ${cmlResult.attempt} attempts (${ctx.revisionAttempts} revisions)`
    );
  }

  ctx.cml = cmlResult.cml as any;

  /**
   * A_80 F13 — THE ALIGNMENT CHECK NOW RUNS WHERE ITS DATA EXISTS.
   *
   * `checkLockedFactTimeAlignment` reads `ctx.cml?.CASE?.hidden_model?.mechanism` for
   * `apparent_time_of_death` / `actual_time_of_death`. Its only call site was ~70 lines above the
   * assignment on the previous line, so both fields were always `""` and the function always
   * returned no findings — and its own comment read that silence as "the case does not model a
   * false-time trick". A correct guard against manufacturing findings from missing input was
   * silently converting a dead check into a clean bill of health.
   *
   * MEASURED: no assignment to `ctx.cml` exists anywhere before the original call site.
   *
   * Findings are pushed as WARNINGS, not errors. The check has never run, so its firing rate is
   * unknown, and promoting an unfired check straight to blocking is how a repair becomes an outage.
   * Measure the reach across a few runs first, then decide whether it should block (A_80 F13).
   */
  for (const finding of checkLockedFactTimeAlignment(ctx)) {
    ctx.warnings.push(`[A_80 F13] locked-fact/CML time alignment: ${finding}`);
  }
  return cmlResult;
}

async function retryOnVictimCulpritCollision(ctx: OrchestratorContext, contractRecoveryEnabled: boolean, cmlResult: CMLGenerationResult) {
  const initialCollisions = checkVictimCulpritCollision(ctx.cml);
  if (initialCollisions.length > 0) {
    if (!contractRecoveryEnabled) {
      initialCollisions.forEach((msg) => ctx.errors.push(`Agent 3: ${msg}`));
      throw new Error("CML generation produced a victim/culprit collision (contract recovery disabled)");
    }
    const victimNames: string[] = ((ctx.cast as any)?.cast?.crimeDynamics?.victimCandidates ?? []).map(String).filter(Boolean);
    const detectiveNames: string[] = ((ctx.cast as any)?.cast?.crimeDynamics?.detectiveCandidates ?? []).map(String).filter(Boolean);
    const exclusionNames = [...new Set([...victimNames, ...detectiveNames])];
    const collisionMsg = initialCollisions.map(m => `Agent 3: ${m}`).join('; ');
    ctx.warnings.push(`${collisionMsg} — retrying with explicit culprit exclusions: ${exclusionNames.join(', ')}`);
    const retryStart = Date.now();
    const retryResult = applyCmlRepairAndRevalidate(
      await generateCML(
        ctx.client,
        { ...buildCmlGenerationRequest(ctx, ctx.noveltyConstraints), culpritExclusionNames: exclusionNames },
        ctx.examplesRoot
      ),
      ctx,
      "collision-repair retry"
    );
    reportNormalizationNotes(ctx, retryResult, "collision-repair retry"); // A34-D06
    // A_53 P3 (collision-retry-cost-double-count): retryResult.cost is the CUMULATIVE byAgent total,
    // so accumulating double-counts the first generation — assign, like the novelty-retry path below.
    ctx.agentCosts["agent3_cml"] = retryResult.cost;
    ctx.agentDurations["agent3_cml"] = (ctx.agentDurations["agent3_cml"] ?? 0) + (Date.now() - retryStart);
    const retryCollisions = checkVictimCulpritCollision(retryResult.cml);
    if (!retryResult.validation.valid || retryCollisions.length > 0) {
      const finalMsgs = retryCollisions.length > 0 ? retryCollisions : initialCollisions;
      finalMsgs.forEach((msg) => ctx.errors.push(`Agent 3: ${msg}`));
      throw new Error("CML generation produced a victim/culprit collision — cannot proceed");
    }
    ctx.cml = retryResult.cml as any;
    cmlResult = retryResult;
  }
  return cmlResult;
}

async function scoreCmlPhase(ctx: OrchestratorContext, cmlResult: CMLGenerationResult) {
  if (ctx.enableScoring && ctx.scoreAggregator) {
    void cmlResult;
    // Owner decision 8 (SCO-Q01): scoreRealCml alone. The vanity score hardcoded validation, completeness
    // and consistency to 100 and took quality from the Agent-4 repair count; the count stays in the warnings.
    let cmlScore: PhaseScore;
    try {
      cmlScore = honestScore(() => scoreRealCml(ctx.cml), "agent3-cml");
    } catch (error) {
      ctx.warnings.push(`CML Generation: Scoring failed - ${(error as Error).message} - continuing without retry`);
      return;
    }
    ctx.scoreAggregator.upsertPhaseScore(
      "agent3_cml",
      "CML Generation",
      cmlScore,
      ctx.agentDurations["agent3_cml"] ?? 0,
      ctx.agentCosts["agent3_cml"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }
}

/**
 * ANALYSIS_109 — the formal checks over one parse of the case, as telemetry (flag
 * `AGENT3_CASE_LOGIC`, default OFF). M1: every time statement in one temporal network — consistency,
 * the act's derived window, and whether each innocent's alibi covers it. MEASURED on the golden cases
 * before this was wired: most innocents' alibis in 4 of 4 do not cover the stated murder window.
 */
function reportCaseLogic(ctx: OrchestratorContext): void {
  if (!isCaseLogicEnabled()) return;
  try {
    const model = buildCaseModel({ cml: ctx.cml, clues: ctx.clues, lockedFacts: (ctx.lockedFactRegistry ?? []) as never });
    ctx.warnings.push(`[A_109 case logic] M1 ${summariseTimeline(analyseTimeline(model), model)}`);
    ctx.warnings.push(`[A_109 case logic] M3 ${summariseProof(analyseProof(model, { clearedByScene: clearedBySceneOf(ctx.cml) }))}`);
  } catch (err) {
    // A measurement must never cost a run.
    ctx.warnings.push(`[A_109 case logic] could not run: ${(err as Error).message}`);
  }
}

/**
 * X51 (REVIEW_11 §8.1) — the registry is device-scoped, and the device is a clock.
 *
 * `agent3b-run.ts` fills `ctx.lockedFactRegistry` from `hardLogicDevices.devices[0].lockedFacts`
 * alone, and Agent 3b runs BEFORE Agent 3 — so at the moment the registry is built, `CASE` does not
 * exist yet and no case fact can be in it. On a timing case that means every locked fact is a clock
 * time, and the two facts the cold reader of run `mystery-1786999938275` marked down were pinned
 * nowhere: the murder weapon (ch1 "brass candlestick" vs ch2+ "bronze statuette") and each suspect's
 * alibi location (Hale gave four different places across five statements).
 *
 * Here, and not in Agent 3b, because here is the first point where `CASE.death_method` and the cast's
 * `alibi_window` fields exist. At the END of `runAgent3` on purpose: the novelty-retry path can
 * REPLACE `ctx.cml` (see the `ctx.cml = cmlResult.cml` at the retry site), so anything earlier could
 * pin facts from a case that was then discarded.
 *
 * Additive only. Device facts keep their identity and their order, so `checkCaseTimeCoherence`
 * (X38) sees exactly what it saw before — and `buildCaseScopedLockedFacts` refuses any value that
 * parses as a clock time or a duration, which is what keeps that true.
 */
export function extendLockedFactRegistryWithCaseFacts(ctx: OrchestratorContext): void {
  if (!ctx.inputs.enableLockedFactRegistry) return;
  try {
    const caseData = ((ctx.cml as any)?.CASE ?? ctx.cml) as unknown;
    if (!caseData) return;
    const existing = ctx.lockedFactRegistry ?? [];
    const takenIds = new Set(existing.map((f) => f.id));
    /**
     * A_72 C1, SECOND CALL SITE — and it was missed on the first pass.
     *
     * `stripLeadingArticleFromLockedValue` was applied where Agent 3b BUILDS the registry, and this is
     * the other place facts enter it. The 2026-08-23 20:38 run proved the gap on its own artifact:
     * the device times came out parallel and article-free (`quarter to eleven`, `ten minutes past
     * eleven`) while the case facts appended here kept theirs — `"a decorative brass statue"`,
     * `"the kitchen"`, `"the lounge"`, `"the dining room"`.
     *
     * Harmless on that run, because those four are mutually parallel and the prose read correctly. It
     * is fixed anyway, because the defect C1 exists to prevent is precisely a value with an article
     * sitting beside one without: **one capability, two call sites, one wired** — the shape this repo
     * keeps paying for, committed here by the change that was documenting it.
     */
    const added = buildCaseScopedLockedFacts(caseData)
      .filter((f) => !takenIds.has(f.id))
      .map((f) => ({ ...f, value: stripLeadingArticleFromLockedValue(f.value) }));
    if (added.length === 0) return;
    ctx.lockedFactRegistry = [...existing, ...added];
    // Re-emit the artifact: Agent 3b wrote it before these facts existed (see writeLockedFactsArtifact).
    writeLockedFactsArtifact(ctx);
    ctx.warnings.push(
      `[X51] locked fact registry extended with ${added.length} case fact(s) beyond the device: ` +
        added.map((f) => `${f.id}="${f.value}"`).join(", "),
    );
  } catch (err) {
    // Never fail a run over an additive consistency aid.
    ctx.warnings.push(`[X51] case-scoped locked facts skipped: ${String(err)}`);
  }
}

/**
 * A_89 A1 — TEMPORAL CLOSURE TELEMETRY, at the point the case and its locked facts are both final.
 *
 * The reader of run 88651 did this arithmetic by hand and marked `clues` 5/10 for it: the silence
 * began at four o'clock and ran seven minutes, the murder window was ten minutes, and the death was
 * placed at a quarter past four — after the interval it was supposed to hide inside. Nothing in the
 * pipeline compares those numbers, because the temporal model is written by three agents that never
 * compare notes and every existing time check is a STRING check.
 *
 * TELEMETRY, NOT A GATE, and deliberately conservative. A verdict is only returned where the case
 * NAMES an opportunity window; guessing which stated duration is the window gave a 94% false-positive
 * rate on the first design. MEASURED over the 58 archived cases: 49 are checkable, **3 prove a
 * violation** (run 88651 among them, exactly as the reader described), and **46 are undecidable
 * because the case names no window at all**. That 46 is the finding — there is no canonical field for
 * the one arithmetic fact a fair-play mystery rests on, which is why it has never been validated.
 */
function reportTemporalClosure(ctx: OrchestratorContext): void {
  if (!isTemporalClosureCheckEnabled()) return;
  try {
    const facts = (ctx.lockedFactRegistry ?? []) as any[];
    if (isCaseTimelineEnabled()) {
      // A_89 A2 — the richer line: the gap, the window and its provenance, and what is MISSING.
      const timeline = deriveCaseTimeline(ctx.cml as any, facts);
      const line = summariseCaseTimeline(timeline);
      if (line) ctx.warnings.push(`[A_89 case timeline] ${line}`);
      return;
    }
    const result = checkTemporalClosure(ctx.cml as any, facts);
    if (!result.checkable) return;
    ctx.warnings.push(`[A_89 temporal closure] ${result.verdict}: ${result.summary}`);
  } catch (err) {
    // A measurement must never cost a run.
    ctx.warnings.push(`[A_89 temporal closure] skipped: ${String(err)}`);
  }
}
