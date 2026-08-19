/**
 * Agent 7: Narrative Formatter
 *
 * Extracted from mystery-orchestrator.ts. Runs formatNarrative() via
 * executeAgentWithRetry (when scoring is enabled), applies schema repair,
 * runs the pre-prose outline quality gate, and applies deterministic clue
 * pacing. Writes ctx.narrative and ctx.outlineCoverageIssues.
 */

import { formatNarrative, GOLDEN_AGE_BEATS, isAgent7StructuredOutputEnabled } from "@cml/prompts-llm";
import type { NarrativeOutline, ClueDistributionResult, WorldDocumentResult } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import type { CaseData } from "@cml/cml";
import { NarrativeScorer, getSceneTarget, getChapterTargetTolerance, getGenerationParams, getStoryLengthTarget, distributeChapterWordBudget, applyGridClueJobs, scoreRealNarrative, resolveDiscriminatingSceneIndex, stampMechanismRevealGate } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type OutlineCoverageIssue,
  buildOutlineRepairGuardrails,
  executeAgentWithRetry,
  preAgent9ContractRecoveryEnabled,
  preAgent9LlmRetriesEnabled,
  applyHonestScorer,
} from "./shared.js";
import { adaptNarrativeForScoring, type ClueRef } from "../scoring-adapters/index.js";
// Agent 7 redesign shadow (outstanding-redesign-item §7 step 1 / 13_agent_7_narrative_outliner §7.1):
// build the deterministic Beat Scheduler grid ALONGSIDE the LLM outline and log the comparison.
// Acts on nothing; default-off flag → zero behaviour change. Gathers the divergence data §7.1 wants.
import { deathMethodSignatureTerms, nameMatcher } from "@cml/story-geometry";
import {
  buildSceneGrid,
  collectObligations,
  checkComplete,
  checkOrdered,
  checkCoverage,
  SchedulerInfeasibleError,
} from "@cml/beat-scheduler";

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
const isDiscoveryTellEnabled = () => /^(1|true|yes|on)$/i.test(process.env.AGENT7_DISCOVERY_TELL ?? "");

/** RC3.5 — tokens that signal a physical manner of death, used to locate the tell clue Agent 5 planted.
 *
 * WAS a local copy ("kept local to avoid a cross-package import"). It now aliases the canonical body in
 * `@cml/story-geometry`, which needs the same list to check that the method's physical signature is on
 * the page in chapter 1. The lists were identical, so this changed no behaviour — it removed the second
 * body before the two could drift, which is how the DEATH_METHOD_CANON duplication note reads in
 * hindsight rather than in advance. */
const deathMethodTellTokens = deathMethodSignatureTerms;

/**
 * A_61 RC3.5 — the discovery-scene mirror of ensureDiscriminatingTestEvidencePresent. Additively
 * guarantees the body-discovery scene (the "crime" beat / Act1 Scene1) references a clue that signals
 * the death_method, so the method's key tell lands EARLY rather than buried later in Act 1. A tell clue
 * is one Agent 5 tagged isDeathMethodTell, or whose description/pointsTo/keyTerms match a death-method
 * token. No-op when the discovery scene already references one, or when no tell clue exists.
 */
/** A_64 §3.3 C1 — flag for the plant-before-reveal outline stamp. Runtime getter, never a module
 *  const (the flags-freeze-before-dotenv trap). Default OFF; the A_64 probe flips it. */
const isPlantBeforeRevealEnabled = () => /^(1|true|yes|on)$/i.test(process.env.AGENT7_PLANT_BEFORE_REVEAL ?? "");

/**
 * A_64 §3.3 C1 — plant-before-reveal on the SHIPPED outline (additive, the RC3.5 pattern). The
 * 33-run corpus's #1 deficit (clues 5.21, 96% ≤6) is one complaint: essential clues surface too late
 * to feel fair-play — the reveal is the clue's FIRST appearance. For every essential clue whose
 * outline reveal sits at scene ≥3, stamp `cluesPlanted: [id]` on a scene ≥2 earlier: an incidental,
 * unflagged appearance for Agent 9 to dramatize (the object/fact on the page; nobody says it
 * matters). Additive only — never moves or removes a reveal, so it cannot violate the clue-pacing or
 * coverage gates. Keyed on the outline's OWN reveal placement (the gate's signal), not the shadow
 * grid's. The beat-scheduler carries the same guarantee by construction (`plant_clue`) for the
 * authoritative path.
 */
export function applyPlantBeforeReveal(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  if (!isPlantBeforeRevealEnabled()) return;
  try {
    const clues = (ctx.clues?.clues ?? []) as any[];
    const essential = new Set(
      clues.filter((c) => c?.criticality === "essential").map((c) => String(c?.id ?? "")).filter(Boolean),
    );
    if (essential.size === 0) return;
    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length < 3) return;

    const firstRevealIdx = new Map<string, number>();
    sceneRefs.forEach((r, i) => {
      const revealed = Array.isArray((r.scene as any)?.cluesRevealed) ? (r.scene as any).cluesRevealed : [];
      for (const id of revealed.map(String)) {
        if (essential.has(id) && !firstRevealIdx.has(id)) firstRevealIdx.set(id, i);
      }
    });

    const stamped: string[] = [];
    for (const [id, revealIdx] of firstRevealIdx) {
      if (revealIdx < 2) continue; // revealed early already — "introduced too late" cannot apply
      const poolIdxs = sceneRefs.map((_, i) => i).filter((i) => i <= revealIdx - 2);
      poolIdxs.sort((i, j) => {
        const pi = (sceneRefs[i].scene as any).cluesPlanted?.length ?? 0;
        const pj = (sceneRefs[j].scene as any).cluesPlanted?.length ?? 0;
        return pi - pj || i - j;
      });
      const target = sceneRefs[poolIdxs[0]].scene as any;
      if (!Array.isArray(target.cluesPlanted)) target.cluesPlanted = [];
      if (!target.cluesPlanted.includes(id)) {
        target.cluesPlanted.push(id);
        stamped.push(`${id}→scene ${poolIdxs[0] + 1} (reveal ${revealIdx + 1})`);
      }
    }
    if (stamped.length > 0) {
      ctx.warnings.push(`[Agent 7 plant-before-reveal] stamped ${stamped.length} plant(s): ${stamped.join("; ")} (A_64 C1).`);
      console.info(`[Agent 7 plant-before-reveal] ${stamped.join("; ")}`);
    }
  } catch (e) {
    console.warn(`[Agent 7 plant-before-reveal] skipped: ${(e as Error).message}`);
  }
}

/**
 * X52 (REVIEW_11 §8.2) — THE DECISIVE TRACE IS PLANTED ONLY IF SOMEONE LABELLED IT `essential`.
 *
 * `applyPlantBeforeReveal` above filters on `criticality === "essential"`. On run
 * `mystery-1786999938275` the clue that clinches the case —
 *
 *   clue_late_optional_slot_1 [late/optional] → "A torn piece of Hugo Vane's cuff was found caught
 *   on the edge of the private study door frame."
 *
 * — is labelled **optional**, so it was never planted, reached the prose prompt for the first time in
 * chapter 8, and Agent 9 dramatized it there as the torn navy wool that breaks Hugo. The cold reader
 * named it third: *"The torn navy wool is useful and concrete, but it appears for the first time in
 * the reveal. Plant it earlier — Eleanor notices a snag on Hugo's cuff in Chapter 4 or 5."*
 *
 * A clue that puts the culprit physically at the scene IS decisive evidence, whatever its criticality
 * label says. `clincher_not_planted` could not see the gap either: it checks the CONTRACT's trace
 * (here the escapement scoring, correctly planted in chapter 1), not the one the manuscript uses.
 *
 * WHY THIS IS NOT JUST A WIDER FILTER ON THE PASS ABOVE. That pass sorts its candidate scenes toward
 * the EARLIEST/emptiest, which for a culprit-implicating clue means the body-discovery chapter — and
 * `ensureDiscoverySceneMethodTellPresent` refuses culprit-implicating clues there for exactly the
 * right reason: it would hand the reader the answer in chapter 1. So this plants the LATEST scene
 * that is still ≥2 before the reveal and past the opening, which is the window the reader asked for.
 */
export function applyDecisiveTracePlant(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  if (!isPlantBeforeRevealEnabled()) return;
  try {
    const clues = (ctx.clues?.clues ?? []) as any[];
    if (clues.length === 0) return;

    const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
    const rawCulprits: unknown[] = Array.isArray(caseData?.culpability?.culprits)
      ? caseData.culpability.culprits
      : [];
    const culprits: string[] = rawCulprits.map((n) => String(n ?? "").trim()).filter(Boolean);
    if (culprits.length === 0) return;
    /**
     * `nameMatcher`, not `includes()` — found on review 2026-08-18.
     *
     * The first version lower-cased the full name and the surname and asked `text.includes(term)`.
     * No word boundary and no common-word guard, so on the 08-17 case (culprit **Vane**) the sentence
     * *"The weathervane above the stable creaked all night"* read as a culprit-implicating trace and
     * was planted as decisive evidence. `exhaled` would do the same for a culprit named Hale.
     *
     * `@cml/story-geometry`'s `nameMatcher` is the repo's answer to exactly this (A_61 RC4.4): word
     * boundaries, a length floor, and a `COMMON_WORD_SURNAMES` skip so a surname that is also an
     * ordinary word never matches on its own. This module already imports from that package.
     */
    const culpritMatchers = culprits
      .map((n) => nameMatcher(n, { includeFirstName: true }))
      .filter((re): re is RegExp => re !== null);
    if (culpritMatchers.length === 0) return;
    const namesCulprit = (text: string): boolean => culpritMatchers.some((re) => re.test(text));

    /** A physical clue that places the CULPRIT at the scene — the thing a reveal produces as proof. */
    const isDecisiveTrace = (c: any): boolean => {
      const blob = `${c?.description ?? ""} ${c?.pointsTo ?? ""} ${Array.isArray(c?.keyTerms) ? c.keyTerms.join(" ") : ""}`;
      if (!namesCulprit(blob)) return false;
      // Physical, not testimonial: a witness saying "I saw Hugo" is not a trace that can be planted
      // incidentally, and dramatizing it early would be an accusation rather than an unremarked object.
      const category = String(c?.category ?? "").toLowerCase();
      if (category && category !== "physical") return false;
      return true;
    };

    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length < 4) return;

    const firstRevealIdx = new Map<string, number>();
    sceneRefs.forEach((r, i) => {
      const revealed = Array.isArray((r.scene as any)?.cluesRevealed) ? (r.scene as any).cluesRevealed : [];
      for (const id of revealed.map(String)) if (!firstRevealIdx.has(id)) firstRevealIdx.set(id, i);
    });

    const alreadyPlanted = new Set<string>(
      sceneRefs.flatMap((r) => (Array.isArray((r.scene as any)?.cluesPlanted) ? (r.scene as any).cluesPlanted.map(String) : [])),
    );

    const stamped: string[] = [];
    for (const clue of clues) {
      const id = String(clue?.id ?? "").trim();
      if (!id || alreadyPlanted.has(id) || !isDecisiveTrace(clue)) continue;
      const revealIdx = firstRevealIdx.get(id);
      if (revealIdx === undefined) continue;
      // Never in the opening (scene index 0/1): a culprit-implicating object there is the answer, not
      // a plant. Never later than 2 scenes before the reveal: closer and it is not a plant either.
      const latest = revealIdx - 2;
      if (latest < 2) continue;
      const target = sceneRefs[latest].scene as any;
      if (!Array.isArray(target.cluesPlanted)) target.cluesPlanted = [];
      if (target.cluesPlanted.includes(id)) continue;
      target.cluesPlanted.push(id);
      alreadyPlanted.add(id);
      stamped.push(`${id}→scene ${latest + 1} (reveal ${revealIdx + 1})`);
    }

    if (stamped.length > 0) {
      ctx.warnings.push(
        `[X52 decisive-trace plant] ${stamped.length} culprit-implicating physical clue(s) reached the reveal unplanted ` +
          `(criticality is not what makes a trace decisive); planted: ${stamped.join("; ")}.`,
      );
      console.info(`[X52 decisive-trace plant] ${stamped.join("; ")}`);
    }
  } catch (e) {
    console.warn(`[X52 decisive-trace plant] skipped: ${(e as Error).message}`);
  }
}

export function ensureDiscoverySceneMethodTellPresent(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  if (!isDiscoveryTellEnabled()) return;
  try {
    const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
    const deathMethod = caseData?.death_method;
    const tokens = deathMethodTellTokens(deathMethod);
    const clues = (ctx.clues?.clues ?? []) as any[];
    if (clues.length === 0) return;

    // A_61 RC3.5 (review fix): the isDeathMethodTell tag currently does not survive Agent-5's output
    // schema, so token-matching over description/pointsTo/keyTerms is the real identifier (the tag is a
    // best-effort fast path for when it is present). Guard the false-positive early-reveal risk: NEVER pin
    // a culprit-implicating clue to the Act-1 discovery scene — a generic token like "blood"/"wound" could
    // otherwise match a culprit-direct clue and reveal the solution too early.
    const isCulpritImplicating = (c: any): boolean =>
      /culprit|direct|reveal|solution|guilt/i.test(String(c?.id ?? "")) ||
      /\bculprit\b|\bthe\s+killer\b|is\s+guilty/i.test(String(c?.pointsTo ?? ""));
    const isTellClue = (c: any): boolean => {
      if (isCulpritImplicating(c)) return false;
      if (c?.isDeathMethodTell === true) return true;
      if (tokens.length === 0) return false;
      const blob = `${c?.description ?? ""} ${c?.pointsTo ?? ""} ${(Array.isArray(c?.keyTerms) ? c.keyTerms.join(" ") : "")}`.toLowerCase();
      return tokens.some((t) => blob.includes(t));
    };
    const tellClueIds = clues.filter(isTellClue).map((c) => String(c.id ?? "")).filter(Boolean);
    if (tellClueIds.length === 0) return; // nothing to pin — Agent 5 didn't plant a recognisable tell

    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length === 0) return;
    /**
     * X48 (REVIEW_11 §5) — THE BODY-DISCOVERY SCENE IS SCENE 1, NOT THE `crime` BEAT.
     *
     * This preferred the `"crime"` beat, and `GOLDEN_AGE_BEATS` is
     * `["gathering", "crime", ...]` — so on every 10-chapter run the tell was stamped into
     * **chapter 2** while the body is discovered in **chapter 1**. The prose contract is not
     * ambiguous about which chapter that is: `obligation-block.ts` hardcodes `chapterNumber === 1`
     * for both "BODY DISCOVERY ORDER (MANDATORY — Chapter 1 only)" and "WEAPON PLANTED AT DISCOVERY
     * (Chapter 1 only)". Those two must name the same scene or the instruction has no referent.
     *
     * MEASURED on run `mystery-1786999938275`: `clue_early_physical_wound` ("struck with a heavy
     * bronze statuette") appeared in the live prose prompt for ch2–ch10 and **0 times in ch1** —
     * absent only from the chapter this function's own warning says it was added to. Chapter 1 was
     * therefore told "if an object at the scene is the murder weapon, its physical condition must be
     * OBSERVED here" with no object supplied, and Agent 9 obeyed with an invented one: "a heavy brass
     * candlestick". The manuscript shipped with two weapons and the cold reader led its problem list
     * with it (*"Pick one"*).
     *
     * Not a budget drop — ch1 shipped 14,520 tokens of context into 15,528 available and dropped
     * nothing. The `crime` beat is kept as a fallback for outlines that carry one without a
     * resolvable first scene.
     */
    const discoveryRef =
      sceneRefs.find((r) => r.act === 1 && r.actSceneNumber === 1) ??
      sceneRefs.find((r) => String((r.scene as any)?.beat ?? "").toLowerCase() === "crime") ??
      sceneRefs[0];
    const discoveryScene = discoveryRef.scene as any;
    if (!Array.isArray(discoveryScene.cluesRevealed)) discoveryScene.cluesRevealed = [];
    const already = new Set<string>(discoveryScene.cluesRevealed.map(String));
    if (tellClueIds.some((id) => already.has(id))) return; // discovery already shows a tell — done

    const chosen = tellClueIds[0];
    discoveryScene.cluesRevealed.push(chosen); // additive — never replaces/reorders
    ctx.warnings.push(
      `[Agent 7 discovery-tell] body-discovery scene referenced no cause-of-death tell; ` +
        `added tell clue "${chosen}" (${String(deathMethod ?? "manner of death")}) to the discovery scene ` +
        // X48: name the scene. The old message said "the discovery scene" and was true of a scene two
        // chapters away from the one the prose contract addresses, so no report could show the mismatch.
        `(act ${discoveryRef.act}, scene ${discoveryRef.actSceneNumber}, beat "${String(discoveryScene?.beat ?? "?")}").`,
    );
  } catch (e) {
    console.warn(`[Agent 7 discovery-tell] skipped: ${(e as Error).message}`);
  }
}

/** A_53 P10 (scheduler-grid-rebuilt-twice-per-run): the scheduler shadow and the clue-job authority
 * both build `buildSceneGrid`+`collectObligations` from the same ctx-derived inputs. This memoizing
 * cache builds each (grid, obligations) pair once per scene-count and lets both call sites share it,
 * so when shadow+authority are both enabled the grid is built once instead of twice. Pure perf — the
 * inputs (caseData/clues/redHerrings) don't change between these end-of-run calls. */
type Agent7GridCache = {
  caseData: any;
  clues: Array<{ id: any; placement: any; criticality: any; supportsInferenceStep: any }>;
  redHerrings: Array<{ id?: string }>;
  get(sceneCount: number): { grid: ReturnType<typeof buildSceneGrid>; obligations: ReturnType<typeof collectObligations>["obligations"] };
};

function makeAgent7GridCache(ctx: OrchestratorContext): Agent7GridCache {
  const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
  const clues = ((ctx.clues?.clues ?? []) as any[]).map((c) => ({
    id: c.id,
    placement: c.placement,
    criticality: c.criticality,
    supportsInferenceStep: c.supportsInferenceStep,
  }));
  const redHerrings = (ctx.clues?.redHerrings ?? []) as Array<{ id?: string }>;
  const memo = new Map<number, { grid: ReturnType<typeof buildSceneGrid>; obligations: ReturnType<typeof collectObligations>["obligations"] }>();
  return {
    caseData,
    clues,
    redHerrings,
    get(sceneCount: number) {
      const cached = memo.get(sceneCount);
      if (cached) return cached;
      const grid = buildSceneGrid({ cml: caseData, clues, redHerrings }, sceneCount);
      const obligations = collectObligations(caseData, clues, redHerrings).obligations;
      const built = { grid, obligations };
      memo.set(sceneCount, built);
      return built;
    },
  };
}

/** Build + invariant-check the deterministic grid for the produced outline, logging the comparison. */
function runAgent7SchedulerShadow(ctx: OrchestratorContext, narrative: NarrativeOutline, gridCache: Agent7GridCache): void {
  if (!isAgent7SchedulerShadowEnabled()) return;
  try {
    const liveScenes =
      (narrative as any).totalScenes ??
      (narrative.acts ?? []).reduce((n: number, a: any) => n + (Array.isArray(a.scenes) ? a.scenes.length : 0), 0);
    const sceneCount = liveScenes && liveScenes >= 4 ? liveScenes : 10;

    // A_53 P10 (scheduler-grid-rebuilt-twice-per-run): shared memoized grid (see makeAgent7GridCache).
    const { grid, obligations } = gridCache.get(sceneCount);
    const complete = checkComplete(grid, obligations);
    const ordered = checkOrdered(grid);
    const coverage = checkCoverage(grid);
    // X17 — the shadow reaches the report too, so a run's record states which arm it was even when
    // the authority path did not fire. A probe needs the negative recorded as much as the positive.
    const shadowLine =
      `[Agent 7 scheduler shadow] grid @${grid.sceneCount} (${grid.actCounts.act1}/${grid.actCounts.act2}/${grid.actCounts.act3}) ` +
      `from ${obligations.length} obligations: complete=${complete.ok} ordered=${ordered.ok} ` +
      `coverage=${Math.round(coverage.ratio * 100)}% (ratioOk=${coverage.ratioOk}) | live outline scenes=${liveScenes} | ` +
      `AGENT7_SCHEDULER_AUTHORITATIVE=${isAgent7SchedulerAuthoritative() ? "ON" : "off"}`;
    console.info(shadowLine);
    ctx.warnings.push(shadowLine);
    if (!ordered.ok) console.info(`[Agent 7 scheduler shadow] ordering note: ${ordered.violations[0]}`);
  } catch (e) {
    if (e instanceof SchedulerInfeasibleError) {
      console.info(`[Agent 7 scheduler shadow] INFEASIBLE: ${e.unmet} — a real upstream signal (the LLM outline may be padded vs the clue density).`);
    } else {
      console.warn(`[Agent 7 scheduler shadow] error: ${(e as Error).message}`);
    }
  }
}

/** P1.3: when the scheduler is authoritative, stamp a pacing-shaped per-scene word budget onto the
 * outline so Agent 9 produces varied chapter lengths (climax fuller, setup leaner). No-op by default. */
function applyAgent7SchedulerAuthority(ctx: OrchestratorContext, narrative: NarrativeOutline, gridCache: Agent7GridCache): void {
  if (!isAgent7SchedulerAuthoritative()) return;
  const sceneRefs = flattenNarrativeScenes(narrative);
  if (sceneRefs.length === 0) return;

  const budgets = distributeChapterWordBudget(sceneRefs.length, ctx.inputs.targetLength);
  sceneRefs.forEach((ref, i) => {
    const budget = budgets[i];
    if (typeof budget === "number" && Number.isFinite(budget)) {
      ref.scene.estimatedWordCount = budget;
    }
  });

  // Keep act-level totals consistent with the new per-scene budgets.
  (narrative.acts ?? []).forEach((actBlock: any) => {
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    actBlock.estimatedWordCount = scenes.reduce(
      (sum: number, s: any) => sum + (typeof s.estimatedWordCount === "number" ? s.estimatedWordCount : 0),
      0,
    );
  });

  /**
   * X17 (REVIEW_05 §31.1) — this reaches the REPORT, not just the terminal.
   *
   * It used to be `console.info` alone. On the N6 pair I read the treatment arm as "the lever did not
   * fire" because my terminal capture was truncated, and only the committed outline settled it. A
   * probe whose treatment arm cannot be identified from its durable record is unattributable by
   * construction — which is [ADR-0010] exactly: the terminal is a convenience, never the record.
   */
  const stamp =
    `[Agent 7 scheduler authority] stamped pacing-shaped budgets on ${sceneRefs.length} scenes ` +
    `(${budgets[0]}…${budgets[budgets.length - 1]} words). AGENT7_SCHEDULER_AUTHORITATIVE=ON.`;
  console.info(stamp);
  ctx.warnings.push(stamp);

  // A_53 P8 (scheduler-authority-dark-no-safe-enable-path): the destructive clue-job half is now a
  // SEPARATE opt-in (AGENT7_CLUE_JOB_AUTHORITY) so the word budgets above can ship on their own.
  applyAgent7ClueJobAuthority(ctx, narrative, sceneRefs, gridCache);
}

/** A_53 P8: the once-per-clue grid clue-job stamp — now additive + (act, act-scene-number)-aligned +
 * coverage-re-validated. Gated behind AGENT7_CLUE_JOB_AUTHORITY (default OFF). */
function applyAgent7ClueJobAuthority(
  ctx: OrchestratorContext,
  narrative: NarrativeOutline,
  sceneRefs: ReturnType<typeof flattenNarrativeScenes>,
  gridCache: Agent7GridCache,
): void {
  if (!isAgent7ClueJobAuthorityEnabled()) return;
  // Job authority (T1.2): the grid assigns every reveal obligation to exactly one slot, so a clue is
  // dramatized in a single chapter instead of being re-revealed across adjacent ones. Guarded: an
  // infeasible grid (or per-act count mismatch) keeps the existing LLM distribution untouched.
  try {
    // A_53 P10 (scheduler-grid-rebuilt-twice-per-run): shared memoized grid (see makeAgent7GridCache).
    const { grid } = gridCache.get(sceneRefs.length);
    // Pass act + scene-number so the stamp aligns by (act, act-scene-number), not raw index.
    const sceneCells = sceneRefs.map((r) => {
      const cell = r.scene as any;
      cell.act = r.act;
      if (typeof cell.sceneNumber !== "number") cell.sceneNumber = r.sceneNumber;
      return cell;
    });
    const { stamped, dedupRemoved, fellBack } = applyGridClueJobs(sceneCells, grid.slots);
    if (fellBack) {
      ctx.warnings.push(
        "[Agent 7 clue-job authority] per-act counts differ between grid and outline — kept the LLM clue distribution (no stamp).",
      );
    } else {
      // A_53 P8 (re-run the coverage gate after stamping): the additive union can't drop a clue to
      // zero scenes, but re-evaluate to force-assign any genuinely-unanchored clue id deterministically.
      reassertClueCoverage(ctx, narrative);
      console.info(
        `[Agent 7 clue-job authority] reconciled grid clue jobs on ${stamped} scenes ` +
          `(one reveal per clue; ${dedupRemoved} duplicate re-reveals removed).`,
      );
    }
  } catch (e) {
    if (e instanceof SchedulerInfeasibleError) {
      console.info(
        `[Agent 7 clue-job authority] grid INFEASIBLE — keeping the LLM clue distribution: ${e.unmet}`,
      );
    } else {
      console.warn(`[Agent 7 clue-job authority] clue-job stamp skipped: ${(e as Error).message}`);
    }
  }
}

/** A_53 P8: after the clue-job stamp, ensure every distribution clue id is still anchored in ≥1 scene;
 * force-assign any unanchored id to the least-loaded scene in its target act (mirrors the main
 * clue-coverage gate) so the additive stamp can never leave a clue in zero scenes. */
function reassertClueCoverage(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  const allScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
  const covered = new Set<string>(
    allScenes
      .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []))
      .map(String)
      .filter(Boolean),
  );
  const allIds = (ctx.clues?.clues ?? []).map((c: any) => String(c.id ?? "")).filter(Boolean);
  const uncovered = allIds.filter((id) => !covered.has(id));
  if (uncovered.length === 0) return;
  for (const clueId of uncovered) {
    const clueEntry = (ctx.clues!.clues as any[]).find((c) => c.id === clueId);
    const placement: string = clueEntry?.placement ?? "mid";
    const targetAct = placement === "early" ? 1 : placement === "late" ? 3 : 2;
    const actScenes = allScenes.filter((s: any) => s.act === targetAct);
    const candidates = actScenes.length > 0 ? actScenes : allScenes;
    const target = [...candidates].sort(
      (a: any, b: any) => (a.cluesRevealed?.length ?? 0) - (b.cluesRevealed?.length ?? 0),
    )[0];
    if (target) {
      if (!Array.isArray(target.cluesRevealed)) target.cluesRevealed = [];
      if (!target.cluesRevealed.includes(clueId)) target.cluesRevealed.push(clueId);
    }
  }
  ctx.warnings.push(
    `[Agent 7 clue-job authority] re-ran coverage gate: force-assigned ${uncovered.length} unanchored clue id(s) after stamping.`,
  );
}

/** A_52 item 4: stamp the mechanism-reveal gate on every run (default ON, independent of scheduler
 * authority). Withholds the full concealment-mechanism explanation until the discriminating-test scene
 * so it isn't telegraphed in Act 1 (judge: "explained too early"). Pure metadata stamp + prompt hint —
 * it does not reorder scenes or move clues, so it is safe to run unconditionally. */
function applyMechanismRevealGate(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  if (!isAgent7MechanismGateEnabled()) return;
  const sceneRefs = flattenNarrativeScenes(narrative);
  if (sceneRefs.length === 0) return;
  try {
    const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
    const testScene = caseData?.prose_requirements?.discriminating_test_scene;
    const thresholdIndex = resolveDiscriminatingSceneIndex(
      sceneRefs.map((r) => ({ act: r.act, actSceneNumber: r.actSceneNumber })),
      testScene,
    );
    const gate = stampMechanismRevealGate(sceneRefs.map((r) => r.scene), thresholdIndex);
    if (gate.thresholdIndex >= 0) {
      console.info(
        `[Agent 7 mechanism gate] full mechanism withheld in ${gate.withheld} pre-test scene(s); ` +
          `reveal allowed from scene #${gate.thresholdIndex + 1} (the discriminating test).`,
      );
    } else {
      console.info(`[Agent 7 mechanism gate] discriminating-test scene not locatable — no gate applied.`);
    }
  } catch (e) {
    console.warn(`[Agent 7 mechanism gate] skipped: ${(e as Error).message}`);
  }
}

/** A_55 #5 (G4 gap): ensure the discriminating-test scene actually REFERENCES at least one of the
 * test's evidence clues, so the test can be dramatized as applying real evidence (the outline-level gap
 * the Agent-9 G4 detector warns about — "no DT evidence clue scheduled in the outline"). Additive only:
 * it never removes a clue from any scene, so it cannot violate the clue-pacing gates. Prefers a clue
 * that is FRESH at the test (revealed in no earlier scene) so the scene can produce new evidence, and
 * falls back to re-surfacing an already-planted evidence clue. Holistic: derives entirely from
 * discriminating_test.evidence_clues + the located test scene, never from a specific story/character. */
export function ensureDiscriminatingTestEvidencePresent(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  try {
    const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
    const evidenceClues: string[] = Array.isArray(caseData?.discriminating_test?.evidence_clues)
      ? caseData.discriminating_test.evidence_clues.map(String).filter(Boolean)
      : [];
    if (evidenceClues.length === 0) return;
    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length === 0) return;
    const dtIndex = resolveDiscriminatingSceneIndex(
      sceneRefs.map((r) => ({ act: r.act, actSceneNumber: r.actSceneNumber })),
      caseData?.prose_requirements?.discriminating_test_scene,
    );
    if (dtIndex < 0) return;
    const dtScene = sceneRefs[dtIndex].scene as any;
    if (!Array.isArray(dtScene.cluesRevealed)) dtScene.cluesRevealed = [];
    const dtSceneClues = new Set<string>(dtScene.cluesRevealed.map(String));
    // Already references an evidence clue? The test scene can dramatize it — nothing to do.
    if (evidenceClues.some((id) => dtSceneClues.has(id))) return;
    // Clues revealed strictly BEFORE the test scene — used to prefer a FRESH evidence clue.
    const revealedBefore = new Set<string>();
    for (let i = 0; i < dtIndex; i++) {
      const s = sceneRefs[i].scene as any;
      if (Array.isArray(s.cluesRevealed)) for (const c of s.cluesRevealed) revealedBefore.add(String(c));
    }
    const freshChoice = evidenceClues.find((id) => !revealedBefore.has(id));
    const chosen = freshChoice ?? evidenceClues[0];
    dtScene.cluesRevealed.push(chosen);
    ctx.warnings.push(
      `[Agent 7 DT-evidence] discriminating-test scene referenced none of its evidence clues; ` +
        `added ${freshChoice ? "fresh" : "re-surfaced"} evidence clue "${chosen}" to the test scene.`,
    );
  } catch (e) {
    console.warn(`[Agent 7 DT-evidence] skipped: ${(e as Error).message}`);
  }
}

// ============================================================================
// Local types (agent-7 only)
// ============================================================================

type SceneRef = {
  scene: any;
  act: 1 | 2 | 3;
  sceneNumber: number;
  actSceneNumber: number;
  index: number;
};

type DeterministicClueAssignmentStats = {
  totalScenes: number;
  minRequired: number;
  before: number;
  after: number;
  mappingAssignments: number;
  essentialAssignments: number;
  gapFillAssignments: number;
  thresholdFillAssignments: number;
};

type NarrativeSceneCountSnapshot = {
  totalScenes: number;
  perAct: Record<1 | 2 | 3, number>;
};

type SceneCountRebalanceResult = {
  changed: boolean;
  summary: string;
};

export function computeDeterministicGapFillCap(totalScenes: number): number {
  const normalizedScenes = Number.isFinite(totalScenes) ? Math.max(0, Math.floor(totalScenes)) : 0;
  const scaledCap = Math.ceil(normalizedScenes * 0.25);
  return Math.max(3, Math.min(8, scaledCap));
}

// ============================================================================
// Outline quality-gate regex constants
// ============================================================================

const OUTLINE_TEST_TERMS_RE = /\b(test|experiment|re-?enact|reenact|trap|demonstrat|verif|proof|examin|timing\s+test|constraint\s+proof)\b/i;
const OUTLINE_EXCLUSION_TERMS_RE = /\b(excluded?|eliminat|ruled\s+out|could\s*not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could|impossible\s+for|proves?\s+innocent)\b/i;
/**
 * X62 — A TRAILING `\b` NEUTERS A STEM, AND BOTH OF THESE LISTS SHIPPED WITH ONE.
 *
 * `\b(...|eliminat|...)\b` cannot match "eliminate", "eliminating" or "eliminated": after `eliminat`
 * comes a word character, so the closing boundary fails. The term matched only the bare string
 * "eliminat", which no outline has ever written. `\balibi\b` missed "alibis" the same way, and
 * `\bclue\b` missed "clues".
 *
 * MEASURED over the 32 archived Agent 7 outlines: the closure FLOOR below fired on **17 of 32** with
 * the old lists and **8 of 32** with these. Nine outlines were told they had no suspect-closure
 * coverage while their own scenes said "Clearing the Others" and "verifying their alibis" — and that
 * false alarm is not free. It drives an outline retry, a repair guardrail, and a deterministic patch
 * that APPENDS clearance language to an Act 3 scene, so a wordlist that could not read the outline was
 * manufacturing the very duplicate clearances three external reads complained about.
 *
 * Inflections only. No new vocabulary: every term here is one the old list already intended.
 */
const OUTLINE_EVIDENCE_TERMS_RE = /\b(because|therefore|proofs?|evidence|measured|timed|observed|alibis?|timelines?|constraints?|clues?)\b/i;
const OUTLINE_ELIMINATION_TERMS_RE = /\b(clear(?:ed|s|ing)|clear\s+(?:the\s+)?(?:innocent\s+)?suspects?|rul(?:ed|es|ing)\s+out|eliminat\w*|exclud\w*|innocent|not\s+the\s+(?:culprit|killer|murderer)|alibis?\s+(?:hold|holds|confirmed|verified)|could\s*not\s+have)\b/i;

/** The scene fields both closure checks read. One helper so the floor and the ceiling cannot drift. */
const sceneClosureText = (scene: any): string =>
  [scene?.title ?? "", scene?.purpose ?? "", scene?.summary ?? "", scene?.dramaticElements?.revelation ?? ""].join(" ");

/**
 * X32 — how many scenes carry a suspect-clearance JOB, counted one scene at a time.
 *
 * Check 2 below is a floor with no ceiling: it joins every scene into a single string and asks whether
 * the language appears anywhere, so three clearance scenes satisfy it exactly as one does. The defect
 * named in three external reads is the opposite shape — a cleared suspect cleared again, after the
 * question is settled — and nothing in the pipeline could see it.
 */
export const countSuspectClosureScenes = (narrative: any): string[] =>
  ((narrative?.acts ?? []) as any[])
    .flatMap((act: any) => (Array.isArray(act?.scenes) ? act.scenes : []))
    .filter((scene: any) => {
      const text = sceneClosureText(scene);
      return OUTLINE_ELIMINATION_TERMS_RE.test(text) && OUTLINE_EVIDENCE_TERMS_RE.test(text);
    })
    .map((scene: any) => String(scene?.title ?? `scene ${scene?.sceneNumber ?? "?"}`));

// ============================================================================
// Scene helper functions (agent-7 only)
// ============================================================================

function getPlacementForAct(act: 1 | 2 | 3): "early" | "mid" | "late" {
  if (act === 1) return "early";
  if (act === 2) return "mid";
  return "late";
}

function flattenNarrativeScenes(narrative: NarrativeOutline): SceneRef[] {
  const refs: SceneRef[] = [];
  let globalIndex = 0;
  (narrative.acts ?? []).forEach((actBlock: any, actIdx: number) => {
    const act = ((actBlock?.actNumber ?? actIdx + 1) as 1 | 2 | 3) || ((actIdx + 1) as 1 | 2 | 3);
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    scenes.forEach((scene: any, sceneIdx: number) => {
      refs.push({
        scene,
        act,
        sceneNumber: Number(scene?.sceneNumber ?? globalIndex + 1),
        actSceneNumber: sceneIdx + 1,
        index: globalIndex,
      });
      globalIndex++;
    });
  });
  return refs;
}

export function captureNarrativeSceneCountSnapshot(narrative: NarrativeOutline): NarrativeSceneCountSnapshot {
  const perAct: Record<1 | 2 | 3, number> = { 1: 0, 2: 0, 3: 0 };
  for (const ref of flattenNarrativeScenes(narrative)) perAct[ref.act] += 1;
  return { totalScenes: perAct[1] + perAct[2] + perAct[3], perAct };
}

function buildNarrativeSceneCountGuardrails(lock: NarrativeSceneCountSnapshot, reason: string): string[] {
  return [
    `Scene-count lock (${reason}): keep EXACT total scene count at ${lock.totalScenes}. Do not reduce chapter/scene count.`,
    `Act scene-count lock: Act I=${lock.perAct[1]}, Act II=${lock.perAct[2]}, Act III=${lock.perAct[3]}. Preserve these counts while applying fixes.`,
    "Preserve scene numbering continuity from 1..N with no skipped numbers and no deleted end scenes.",
  ];
}

export function checkNarrativeSceneCountFloor(
  candidate: NarrativeOutline,
  baseline: NarrativeSceneCountSnapshot
): { ok: boolean; message?: string } {
  const snap = captureNarrativeSceneCountSnapshot(candidate);
  if (snap.totalScenes !== baseline.totalScenes) {
    return { ok: false, message: `scene-count changed (${snap.totalScenes} != ${baseline.totalScenes})` };
  }
  for (const act of [1, 2, 3] as const) {
    if (snap.perAct[act] !== baseline.perAct[act]) {
      return { ok: false, message: `Act ${act} scene count changed (${snap.perAct[act]} != ${baseline.perAct[act]})` };
    }
  }
  return { ok: true };
}

function computeTargetActSceneCounts(expectedTotalScenes: number): Record<1 | 2 | 3, number> {
  const pacing = getGenerationParams().agent7_narrative.params.pacing;
  const act1 = Math.round(expectedTotalScenes * pacing.act_distribution.act1_ratio);
  const act2 = Math.round(expectedTotalScenes * pacing.act_distribution.act2_ratio);
  const act3 = expectedTotalScenes - act1 - act2;
  return { 1: act1, 2: act2, 3: act3 };
}

function makeBridgeScene(
  act: 1 | 2 | 3,
  actSceneNumber: number,
  seedScene: any,
  clueId?: string,
): any {
  const inferredLocation =
    typeof seedScene?.setting?.location === "string" && seedScene.setting.location.trim().length > 0
      ? seedScene.setting.location
      : "investigation setting";
  const inferredTime =
    typeof seedScene?.setting?.timeOfDay === "string" && seedScene.setting.timeOfDay.trim().length > 0
      ? seedScene.setting.timeOfDay
      : "Later that day";
  const inferredAtmosphere =
    typeof seedScene?.setting?.atmosphere === "string" && seedScene.setting.atmosphere.trim().length > 0
      ? seedScene.setting.atmosphere
      : "Tense and investigative";
  const inferredCharacters = Array.isArray(seedScene?.characters)
    ? seedScene.characters.filter((name: unknown) => typeof name === "string" && name.trim().length > 0).slice(0, 3)
    : [];

  return {
    sceneNumber: 0,
    act,
    title: `Bridge Scene ${act}.${actSceneNumber}`,
    setting: {
      location: inferredLocation,
      timeOfDay: inferredTime,
      atmosphere: inferredAtmosphere,
    },
    characters: inferredCharacters,
    purpose: "Bridge investigation beats while preserving scene-count contract and narrative continuity.",
    cluesRevealed: clueId ? [clueId] : [],
    dramaticElements: {
      tension: "A new connective beat tightens the investigative thread before the next major turn.",
      microMomentBeats: [
        "A character briefly hesitates, revealing anxiety beneath procedural dialogue.",
      ],
    },
    summary:
      "The detective team re-evaluates recent testimony and positions before moving to the next major reveal. The beat preserves pacing while tightening continuity between clue discovery and later deductions.",
    estimatedWordCount:
      typeof seedScene?.estimatedWordCount === "number" && Number.isFinite(seedScene.estimatedWordCount)
        ? Math.max(900, Math.round(seedScene.estimatedWordCount))
        : 1400,
  };
}

function normalizeNarrativeSceneNumbersAndTotals(narrative: NarrativeOutline): void {
  let sceneCounter = 1;
  let totalWords = 0;
  for (const [actIndex, actBlock] of (narrative.acts ?? []).entries()) {
    const actNumber = ((actBlock?.actNumber ?? actIndex + 1) as 1 | 2 | 3) || ((actIndex + 1) as 1 | 2 | 3);
    actBlock.actNumber = actNumber;
    let actWords = 0;
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    for (const scene of scenes) {
      scene.sceneNumber = sceneCounter++;
      scene.act = actNumber;
      if (!scene.setting || typeof scene.setting !== "object") {
        scene.setting = { location: "investigation setting", timeOfDay: "Unknown", atmosphere: "Tense" };
      }
      if (!Array.isArray(scene.characters)) scene.characters = [];
      if (!Array.isArray(scene.cluesRevealed)) scene.cluesRevealed = [];
      if (!scene.dramaticElements || typeof scene.dramaticElements !== "object") scene.dramaticElements = {};
      if (typeof scene.title !== "string" || scene.title.trim().length === 0) {
        scene.title = `Scene ${scene.sceneNumber}`;
      }
      if (typeof scene.purpose !== "string" || scene.purpose.trim().length === 0) {
        scene.purpose = "Advance the investigation while preserving continuity.";
      }
      if (typeof scene.summary !== "string" || scene.summary.trim().length === 0) {
        scene.summary = "A connective investigative beat maintains pacing and continuity.";
      }
      if (typeof scene.estimatedWordCount !== "number" || !Number.isFinite(scene.estimatedWordCount)) {
        scene.estimatedWordCount = 1400;
      }
      actWords += scene.estimatedWordCount;
    }
    actBlock.estimatedWordCount = actWords;
    totalWords += actWords;
  }
  narrative.totalScenes = sceneCounter - 1;
  narrative.estimatedTotalWords = totalWords;
}

export function rebalanceNarrativeSceneCountsDeterministically(
  narrative: NarrativeOutline,
  expectedTotalScenes: number,
  clues?: ClueDistributionResult,
): SceneCountRebalanceResult {
  const targetActs = computeTargetActSceneCounts(expectedTotalScenes);
  if (!Array.isArray(narrative.acts)) narrative.acts = [];

  for (const act of [1, 2, 3] as const) {
    let actBlock = narrative.acts.find((candidate: any) => Number(candidate?.actNumber) === act);
    if (!actBlock) {
      actBlock = {
        actNumber: act,
        title: `Act ${act}`,
        purpose: "Narrative progression",
        scenes: [],
        estimatedWordCount: 0,
      };
      narrative.acts.push(actBlock);
    }
    if (!Array.isArray(actBlock.scenes)) actBlock.scenes = [];
    if (typeof actBlock.title !== "string" || actBlock.title.trim().length === 0) {
      actBlock.title = `Act ${act}`;
    }
    if (typeof actBlock.purpose !== "string" || actBlock.purpose.trim().length === 0) {
      actBlock.purpose = "Narrative progression";
    }

    const preferredClues = ((): string[] => {
      if (!clues) return [];
      const placement = getPlacementForAct(act);
      const timelineIds = clues.clueTimeline?.[placement] ?? [];
      const fallbackIds = clues.clues.map((entry) => entry.id).filter((id): id is string => typeof id === "string" && id.length > 0);
      return [...timelineIds, ...fallbackIds];
    })();

    while (actBlock.scenes.length < targetActs[act]) {
      const insertionIndex = Math.max(0, actBlock.scenes.length - 1);
      const seedScene = actBlock.scenes[insertionIndex] ?? actBlock.scenes[actBlock.scenes.length - 1] ?? {};
      const clueId = preferredClues[(actBlock.scenes.length + act) % Math.max(1, preferredClues.length)];
      const bridge = makeBridgeScene(act, insertionIndex + 1, seedScene, clueId);
      actBlock.scenes.splice(insertionIndex, 0, bridge);
    }

    while (actBlock.scenes.length > targetActs[act]) {
      const removableIndex = actBlock.scenes.findIndex(
        (scene: any, index: number) =>
          index > 0 &&
          index < actBlock.scenes.length - 1 &&
          (!Array.isArray(scene?.cluesRevealed) || scene.cluesRevealed.length === 0),
      );
      if (removableIndex >= 0) {
        actBlock.scenes.splice(removableIndex, 1);
      } else {
        actBlock.scenes.splice(Math.max(0, actBlock.scenes.length - 2), 1);
      }
    }
  }

  narrative.acts.sort((a: any, b: any) => Number(a?.actNumber ?? 0) - Number(b?.actNumber ?? 0));
  normalizeNarrativeSceneNumbersAndTotals(narrative);

  const after = captureNarrativeSceneCountSnapshot(narrative);
  const targetSummary = `Act I=${targetActs[1]}, Act II=${targetActs[2]}, Act III=${targetActs[3]}`;
  const actualSummary = `Act I=${after.perAct[1]}, Act II=${after.perAct[2]}, Act III=${after.perAct[3]}`;
  const changed = after.totalScenes === expectedTotalScenes &&
    after.perAct[1] === targetActs[1] &&
    after.perAct[2] === targetActs[2] &&
    after.perAct[3] === targetActs[3];

  return {
    changed,
    summary: `target(${targetSummary}) actual(${actualSummary}) total=${after.totalScenes}`,
  };
}

export function applyDeterministicCluePreAssignment(
  narrative: NarrativeOutline,
  cml: CaseData,
  clues: ClueDistributionResult,
  minCoverageRatio = 0.6,
  maxThresholdFillAssignments = Number.POSITIVE_INFINITY,
): DeterministicClueAssignmentStats {
  const refs = flattenNarrativeScenes(narrative);
  const totalScenes = refs.length;
  const minRequired = Math.ceil(totalScenes * minCoverageRatio);

  const allClueIds = clues.clues
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  const validClueSet = new Set(allClueIds);
  const essentialClueIds = clues.clues
    .filter((c) => c.criticality === "essential")
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  const timelinePools = {
    early: (clues.clueTimeline?.early ?? []).filter((id) => validClueSet.has(id)),
    mid: (clues.clueTimeline?.mid ?? []).filter((id) => validClueSet.has(id)),
    late: (clues.clueTimeline?.late ?? []).filter((id) => validClueSet.has(id)),
  };

  const usage = new Map<string, number>();
  for (const id of allClueIds) usage.set(id, 0);

  const normalizeSceneClues = (ref: SceneRef) => {
    const current = Array.isArray(ref.scene?.cluesRevealed) ? ref.scene.cluesRevealed : [];
    const normalized: string[] = Array.from(
      new Set<string>(
        current.filter((id: unknown): id is string => typeof id === "string" && validClueSet.has(id))
      )
    );
    ref.scene.cluesRevealed = normalized;
    normalized.forEach((id) => usage.set(id, (usage.get(id) ?? 0) + 1));
  };
  refs.forEach(normalizeSceneClues);

  const countClueScenes = () =>
    refs.filter((r) => Array.isArray(r.scene?.cluesRevealed) && r.scene.cluesRevealed.length > 0).length;
  const before = countClueScenes();

  const pickLeastUsed = (pool: string[], existing: Set<string>): string | null => {
    const candidates = pool.filter((id) => validClueSet.has(id) && !existing.has(id));
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => (usage.get(a) ?? 0) - (usage.get(b) ?? 0));
    return candidates[0] ?? null;
  };

  const pickClueForScene = (ref: SceneRef): string | null => {
    const existing = new Set<string>(
      Array.isArray(ref.scene?.cluesRevealed) ? ref.scene.cluesRevealed : []
    );
    return (
      pickLeastUsed(timelinePools[getPlacementForAct(ref.act)], existing) ??
      pickLeastUsed(essentialClueIds, existing) ??
      pickLeastUsed(allClueIds, existing) ??
      null
    );
  };

  const addClueToScene = (ref: SceneRef, preferredId?: string): boolean => {
    if (!Array.isArray(ref.scene?.cluesRevealed)) ref.scene.cluesRevealed = [];
    const existing = new Set<string>(ref.scene.cluesRevealed);
    const clueId =
      preferredId && validClueSet.has(preferredId) && !existing.has(preferredId)
        ? preferredId
        : pickClueForScene(ref);
    if (!clueId || existing.has(clueId)) return false;
    ref.scene.cluesRevealed = [...ref.scene.cluesRevealed, clueId];
    usage.set(clueId, (usage.get(clueId) ?? 0) + 1);
    return true;
  };

  let mappingAssignments = 0;
  let essentialAssignments = 0;
  let gapFillAssignments = 0;
  let thresholdFillAssignments = 0;

  // 1) Respect prose_requirements clue_to_scene_mapping
  const caseBlock = (cml as any)?.CASE ?? cml;
  const mappingEntries = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (const mapping of mappingEntries) {
    const clueId = String(mapping?.clue_id ?? "");
    if (!validClueSet.has(clueId)) continue;
    const actNumber = Number(mapping?.act_number);
    if (![1, 2, 3].includes(actNumber)) continue;
    const actRefs = refs.filter((r) => r.act === actNumber);
    if (actRefs.length === 0) continue;
    const sceneNumber = Number(mapping?.scene_number);
    const targetRef =
      actRefs.find((r) => r.sceneNumber === sceneNumber) ??
      actRefs.find((r) => r.actSceneNumber === sceneNumber) ??
      actRefs.find((r) => !Array.isArray(r.scene?.cluesRevealed) || r.scene.cluesRevealed.length === 0) ??
      actRefs[0];
    if (targetRef && addClueToScene(targetRef, clueId)) mappingAssignments++;
  }

  // 2) Ensure every essential clue is anchored in at least one scene
  const anchored = new Set(
    refs.flatMap((r) => (Array.isArray(r.scene?.cluesRevealed) ? r.scene.cluesRevealed : []))
  );
  for (const clueId of essentialClueIds) {
    if (anchored.has(clueId)) continue;
    const clue = clues.clues.find((c) => c.id === clueId);
    const preferredAct = clue?.placement === "early" ? 1 : clue?.placement === "mid" ? 2 : 3;
    const candidateRefs = refs
      .filter((r) => r.act === preferredAct)
      .sort((a, b) => (a.scene.cluesRevealed?.length ?? 0) - (b.scene.cluesRevealed?.length ?? 0));
    const targetRef = candidateRefs[0] ?? refs[0];
    if (targetRef && addClueToScene(targetRef, clueId)) {
      essentialAssignments++;
      anchored.add(clueId);
    }
  }

  // 3) Prevent long no-clue runs: fill every third scene inside gaps > 2
  let i = 0;
  while (i < refs.length) {
    if (Array.isArray(refs[i].scene?.cluesRevealed) && refs[i].scene.cluesRevealed.length > 0) {
      i++;
      continue;
    }
    const start = i;
    let end = i;
    while (
      end + 1 < refs.length &&
      !(Array.isArray(refs[end + 1].scene?.cluesRevealed) && refs[end + 1].scene.cluesRevealed.length > 0)
    ) end++;
    if (end - start + 1 > 2) {
      // A_53 P8 (gapfill-stride-skips-mid-gap-scenes): the old `start+2` stride-of-3 didn't GUARANTEE
      // ≤2 consecutive clueless scenes once a fill failed. Walk the gap greedily: after 2 clueless
      // scenes, fill the next; on a fill failure advance and retry so a single unfillable scene can't
      // open a >2 run (mirrors the scheduler's liftCoverage guarantee).
      let cluelessRun = 0;
      for (let pos = start; pos <= end; pos++) {
        const hasClue =
          Array.isArray(refs[pos].scene?.cluesRevealed) && refs[pos].scene.cluesRevealed.length > 0;
        if (hasClue) {
          cluelessRun = 0;
          continue;
        }
        if (cluelessRun >= 2 && addClueToScene(refs[pos])) {
          gapFillAssignments++;
          cluelessRun = 0;
        } else {
          cluelessRun++;
        }
      }
    }
    i = end + 1;
  }

  // 4) If still below threshold, fill additional empty scenes with act-balanced picks
  // A_53 P10 (clue-preassign-recounts-scenes-in-loop): the previous loop re-ran countClueScenes()
  // (full scan), rebuilt per-act totals, and re-filtered+sorted emptyRefs on EVERY assignment (O(n²)
  // over ~0.6N). Maintain the invariants incrementally instead:
  //   • actTotals never changes (scene→act assignment is fixed) — compute once.
  //   • coveredCount + actCovered change by exactly +1 when a previously-empty scene gets a clue.
  //   • emptyRefs only shrinks — keep it as a mutable list and pick the min by the LIVE ratio
  //     (ascending ratio, then ascending index — identical ordering to the old filter+sort, but a
  //     single O(emptyRefs) min-scan with no per-iteration sort or whole-corpus rescans).
  const actTotals = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
  const actCovered = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
  let coveredCount = 0;
  const emptyRefs: SceneRef[] = [];
  for (const ref of refs) {
    actTotals[ref.act]++;
    const hasClue = Array.isArray(ref.scene?.cluesRevealed) && ref.scene.cluesRevealed.length > 0;
    if (hasClue) {
      actCovered[ref.act]++;
      coveredCount++;
    } else {
      emptyRefs.push(ref);
    }
  }
  while (coveredCount < minRequired && thresholdFillAssignments < maxThresholdFillAssignments) {
    if (emptyRefs.length === 0) break;
    let bestPos = -1;
    let bestRatio = Number.POSITIVE_INFINITY;
    let bestIndex = Number.POSITIVE_INFINITY;
    for (let p = 0; p < emptyRefs.length; p++) {
      const ref = emptyRefs[p];
      const ratio = actTotals[ref.act] > 0 ? actCovered[ref.act] / actTotals[ref.act] : 1;
      if (ratio < bestRatio || (ratio === bestRatio && ref.index < bestIndex)) {
        bestRatio = ratio;
        bestIndex = ref.index;
        bestPos = p;
      }
    }
    if (bestPos < 0) break;
    const target = emptyRefs[bestPos];
    if (!addClueToScene(target)) break;
    // The scene is no longer empty: drop it from emptyRefs and bump the incremental counts.
    emptyRefs.splice(bestPos, 1);
    actCovered[target.act]++;
    coveredCount++;
    thresholdFillAssignments++;
  }

  return { totalScenes, minRequired, before, after: coveredCount, mappingAssignments, essentialAssignments, gapFillAssignments, thresholdFillAssignments };
}

function buildCluePacingGuardrails(expectedScenes: number, minRatio: number): string[] {
  const minClueScenes = Math.ceil(expectedScenes * minRatio);
  const act1 = Math.max(1, Math.floor(minClueScenes * 0.25));
  const act2 = Math.max(1, Math.floor(minClueScenes * 0.45));
  const act3 = Math.max(1, minClueScenes - act1 - act2);
  return [
    `Clue pacing requirement: at least ${minClueScenes} of ${expectedScenes} scenes must include non-empty cluesRevealed arrays.`,
    `Act clue distribution requirement: Act I >= ${act1} clue-bearing scenes, Act II >= ${act2}, Act III >= ${act3}.`,
    "Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.",
  ];
}

// ============================================================================
// World-First scene enrichment helpers
// ============================================================================

/**
 * Maps a normalised scene position (0.0–1.0) to the nearest storyEmotionalArc
 * turningPoints.position enum value.
 */
function toArcPosition(pos: number): string {
  // Thresholds aligned with buildWorldBriefBlock in agent9-prose.ts so that
  // the same story position resolves to the same arc label in both agents.
  if (pos <= 0.08) return 'opening';   // corresponds to chapterIndex <= 1 in a ~12-chapter story
  if (pos <= 0.25) return 'early';
  if (pos <= 0.40) return 'first_turn';
  if (pos <= 0.55) return 'mid';
  if (pos <= 0.70) return 'second_turn';
  if (pos <= 0.80) return 'pre_climax';
  if (pos < 1.00)  return 'climax';
  return 'resolution';
}

/**
 * Maps act number + scene-in-act to a humourPlacementMap scenePosition enum value.
 * Best-effort deterministic mapping.
 */
function toSceneType(act: 1 | 2 | 3, sceneInAct: number): string {
  if (act === 1 && sceneInAct === 1) return 'opening_scene';
  if (act === 1 && sceneInAct === 2) return 'first_investigation';
  if (act === 1) return 'first_interview';
  if (act === 2 && sceneInAct <= 2) return 'mid_investigation';
  if (act === 2 && sceneInAct <= 3) return 'tension_scene';
  if (act === 2) return 'pre_climax';
  if (act === 3 && sceneInAct === 1) return 'discriminating_test';
  if (act === 3 && sceneInAct === 2) return 'revelation';
  return 'resolution';
}

/**
 * Enriches every scene in the narrative outline with the six World-First fields
 * derived from the World Document:
 *   emotionalRegister, dominantCharacterNote, humourGuidance,
 *   eraTextureNote, locationRegisterNote
 *
 * NOTE: subtextNote is NOT set here — it requires creative LLM reasoning and
 * should already be present in the Agent 7 LLM output if the World Document
 * was passed to formatNarrative(). This function provides the deterministic
 * fallbacks for the five structurally-derivable fields.
 */
export function applyWorldFirstSceneEnrichment(
  narrative: NarrativeOutline,
  world: WorldDocumentResult,
): void {
  const acts = Array.isArray(narrative.acts) ? narrative.acts : [];
  const totalScenes = acts.reduce((n: number, a: any) =>
    n + (Array.isArray(a?.scenes) ? a.scenes.length : 0), 0);
  let sceneIndex = 0;

  for (const actBlock of acts) {
    const actNumber = (Number(actBlock?.actNumber) || (acts.indexOf(actBlock) + 1)) as 1 | 2 | 3;
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];

    for (let si = 0; si < scenes.length; si++) {
      const scene = scenes[si];
      const sceneInAct = si + 1;
      const position = totalScenes > 1 ? sceneIndex / (totalScenes - 1) : 0;

      // ── emotionalRegister ──────────────────────────────────────────────
      const arcPos = toArcPosition(position);
      const turningPoints = world.storyEmotionalArc?.turningPoints ?? [];
      const matchedTp = turningPoints.find((t: any) => t.position === arcPos)
        ?? turningPoints[Math.min(
          Math.floor(position * turningPoints.length),
          turningPoints.length - 1,
        )];
      (scene as any).emotionalRegister =
        matchedTp?.emotionalDescription ?? world.storyEmotionalArc?.dominantRegister ?? '';

      // ── dominantCharacterNote ──────────────────────────────────────────
      const sceneChars: string[] = Array.isArray((scene as any).characters)
        ? (scene as any).characters
        : [];
      const voiceMatch = (world.characterVoiceSketches ?? []).find((v: any) =>
        sceneChars.some((c) => c.toLowerCase().includes(v.name.toLowerCase())),
      );
      (scene as any).dominantCharacterNote = voiceMatch
        ? { name: voiceMatch.name, voiceRegister: voiceMatch.voiceDescription }
        : undefined;

      // ── humourGuidance ─────────────────────────────────────────────────
      const sceneType = toSceneType(actNumber, sceneInAct);
      const humourEntry = (world.humourPlacementMap ?? []).find(
        (h: any) => h.scenePosition === sceneType,
      );
      (scene as any).humourGuidance = humourEntry
        ? {
            permission: humourEntry.humourPermission,
            character: humourEntry.permittedCharacters?.[0] ?? undefined,
            form: humourEntry.permittedForms?.[0] ?? undefined,
            condition: humourEntry.condition ?? undefined,
          }
        : { permission: 'permitted' };

      // ── eraTextureNote ─────────────────────────────────────────────────
      const physicalConstraints: string[] =
        world.historicalMoment?.physicalConstraints ?? [];
      (scene as any).eraTextureNote = physicalConstraints.join('; ');

      // ── locationRegisterNote ───────────────────────────────────────────
      // Scene location lives at scene.setting.location (a name string);
      // scene.locationId does not exist in the narrative outline schema.
      const locationName: string =
        (scene as any).locationId ??
        (scene as any).setting?.location ??
        '';
      const locReg = (world.locationRegisters ?? []).find(
        (l: any) =>
          locationName
            ? l.locationId === locationName ||
              l.name?.toLowerCase() === locationName.toLowerCase()
            : false,
      );
      (scene as any).locationRegisterNote = locReg
        ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
        : '';

      sceneIndex++;
    }
  }
}

// ============================================================================
// evaluateOutlineCoverage (agent-7 only)
// ============================================================================

function evaluateOutlineCoverage(narrative: NarrativeOutline, cml: CaseData): OutlineCoverageIssue[] {
  const issues: OutlineCoverageIssue[] = [];
  const cmlCase = (cml as any)?.CASE ?? {};
  const allScenes = (narrative.acts ?? []).flatMap((act) =>
    Array.isArray(act.scenes) ? act.scenes : []
  );

  // --- Check 1: discriminating test scene ---
  const hasDiscriminatingTestScene = allScenes.some((scene) => {
    const blob = [
      scene.title ?? "",
      scene.purpose ?? "",
      scene.summary ?? "",
      scene.dramaticElements?.revelation ?? "",
      scene.dramaticElements?.tension ?? "",
    ].join(" ");
    return (
      OUTLINE_TEST_TERMS_RE.test(blob) &&
      OUTLINE_EXCLUSION_TERMS_RE.test(blob) &&
      OUTLINE_EVIDENCE_TERMS_RE.test(blob)
    );
  });
  const DISC_TEST_FALLBACK_RE = /discriminating|re-?enactment|crucial\s+test|decisive\s+experiment|trap\s+is\s+set|ruling\s+out/i;
  const hasTestMention = allScenes.some((scene) =>
    DISC_TEST_FALLBACK_RE.test([scene.title ?? "", scene.purpose ?? "", scene.summary ?? ""].join(" "))
  );
  if (!hasDiscriminatingTestScene && !hasTestMention) {
    issues.push({
      type: "missing_discriminating_test_scene",
      message:
        "Outline has no scene whose summary/purpose contains discriminating test, re-enactment, or suspect-elimination language",
    });
  }

  // --- Check 2: suspect closure / elimination coverage ---
  const castRoster: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const culprits: string[] = Array.isArray(cmlCase.culpability?.culprits)
    ? (cmlCase.culpability.culprits as string[])
    : [];
  const suspects = castRoster
    .filter((c: any) => String(c.role_archetype ?? c.role ?? '').toLowerCase().includes('suspect'))
    .map((c: any) => (c.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.includes(name));

  if (suspects.length > 0) {
    const allSceneText = allScenes.map(sceneClosureText).join(" ");
    const hasAnyClosure =
      OUTLINE_ELIMINATION_TERMS_RE.test(allSceneText) && OUTLINE_EVIDENCE_TERMS_RE.test(allSceneText);
    if (!hasAnyClosure) {
      issues.push({
        type: "missing_suspect_closure_scene",
        message:
          "Outline has no scene with suspect elimination/closure language (cleared, ruled out, alibi confirmed, etc.)",
      });
    }

    // --- Check 3: suspect closure CEILING (X32) ---
    //
    // Check 2 can only ever complain about too FEW clearances. The 08-19 outline allocated the job to
    // two scenes ("Clearing the Others" in Act 2 and "Clearances and Culprit Revealed" in Act 3) and
    // the manuscript duly resolved the suspects, resolved them again during the discriminating test,
    // and resolved them a third time after the confession. Check 2 was satisfied throughout, so
    // `AGENT9_FOLD_SUSPECT_CLEARANCES` — which lives inside the repair guardrail Check 2 triggers —
    // was never reachable on the run whose defect it was built to fix.
    //
    // GATED on that same flag, because ANY issue here drives an outline retry (see the call site) and
    // 11 of the 32 archived outlines allocate more than one. Flag off: default behaviour is unchanged
    // and the count is reported as a warning only. Flag on: the ceiling drives the fold guardrail, at
    // the trigger where folding is the actual repair.
    const foldSuspectClearances =
      process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "true" || process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "1";
    const closureScenes = countSuspectClosureScenes(narrative);
    if (foldSuspectClearances && closureScenes.length > 1) {
      issues.push({
        type: "duplicate_suspect_closure_scenes",
        message:
          `Outline gives a suspect-clearance job to ${closureScenes.length} scenes (${closureScenes.join("; ")}). ` +
          `A cleared suspect stays cleared, so every pass after the first repeats a resolved beat.`,
      });
    }
  }

  return issues;
}

function evaluateOutlinePreCommitCompleteness(narrative: NarrativeOutline): string[] {
  const issues: string[] = [];
  const allScenes = flattenNarrativeScenes(narrative);

  if (allScenes.length === 0) {
    return ["Outline contains zero scenes."];
  }

  const sceneNumbers = allScenes
    .map((ref) => Number(ref.scene?.sceneNumber))
    .filter((value) => Number.isFinite(value));
  if (sceneNumbers.length !== allScenes.length) {
    issues.push("One or more scenes are missing numeric sceneNumber values.");
  } else {
    const sorted = [...sceneNumbers].sort((left, right) => left - right);
    for (let i = 0; i < sorted.length; i += 1) {
      if (sorted[i] !== i + 1) {
        issues.push("Scene numbering must be contiguous from 1..N before prose handoff.");
        break;
      }
    }
  }

  const missingCoreFields = allScenes.filter((ref) => {
    const title = String(ref.scene?.title ?? "").trim();
    const purpose = String(ref.scene?.purpose ?? "").trim();
    const summary = String(ref.scene?.summary ?? "").trim();
    return title.length === 0 || purpose.length === 0 || summary.length === 0;
  });
  if (missingCoreFields.length > 0) {
    issues.push(
      `Found ${missingCoreFields.length} scene(s) missing title/purpose/summary required for prose handoff.`,
    );
  }

  const missingCharacterScenes = allScenes.filter((ref) => !Array.isArray(ref.scene?.characters) || ref.scene.characters.length === 0);
  if (missingCharacterScenes.length > 0) {
    issues.push(
      `Found ${missingCharacterScenes.length} scene(s) with empty characters arrays.`,
    );
  }

  return issues.slice(0, 8);
}

// ============================================================================
// Re-score helper used after narrative is replaced by retry
// ============================================================================

async function rescoreNarrative(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  if (!ctx.enableScoring || !ctx.scoreAggregator) return;
  try {
    const rescorer = new NarrativeScorer();
    const adapted = adaptNarrativeForScoring(
      narrative,
      (ctx.cml as any)?.CASE?.cast ?? [],
      ((ctx.cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? [])
        .map((m: any): ClueRef => ({
          id: String(m.clue_id || ""),
          placement: m.act_number === 1 ? "early" : m.act_number === 2 ? "mid" : "late",
        }))
        .filter((c: ClueRef) => c.id)
    );
    const score = await rescorer.score({}, adapted, {
      previous_phases: { agent2_cast: ctx.cast!.cast },
      cml: ctx.cml!,
      threshold_config: { mode: "standard" },
      targetLength: ctx.inputs.targetLength ?? "medium",
    });
    ctx.scoreAggregator.upsertPhaseScore(
      "agent7_narrative",
      "Narrative Outline",
      score,
      ctx.agentDurations["agent7_narrative"] ?? 0,
      1
    );
  } catch { /* re-scoring is best-effort; never abort */ }
}

// ============================================================================
// runAgent7
// ============================================================================

/**
 * Known natural-language aliases the LLM reaches for → the canonical Golden-Age beat.
 * Only high-confidence mappings; anything not here (and not already canonical) is dropped.
 */
const BEAT_SYNONYMS: Record<string, string> = {
  discovery: "crime",
  investigation: "first_enquiries",
  interrogation: "first_enquiries",
  interview: "first_enquiries",
  interviews: "first_enquiries",
  enquiries: "first_enquiries",
  inquiries: "first_enquiries",
  motive: "motives",
  suspicion: "motives",
  alibi: "alibis",
  confrontation: "final_trap",
  trap: "final_trap",
  climax: "final_trap",
  reveal: "revelation",
  resolution: "revelation",
  solution: "revelation",
  denouement: "revelation",
};

/**
 * Deterministically normalise `scene.beat` to the Golden-Age enum, in place.
 *
 * `scene.beat` is an OPTIONAL controlled-vocabulary field, but the schema enforces the
 * Golden-Age enum on ANY value present. The allowed vocabulary is only injected into the
 * prompt on the exact 10-chapter path (beatArcBlock in agent7-narrative.ts). Off that path
 * the model still emits `beat` and free-texts values like "interrogation"/"discovery"/
 * "resolution", which hard-abort the run at schema validation — even through the schema-repair
 * retry (run_01150a9f). Deterministic code owns `beat` (agent-7 redesign: beat is
 * scheduler-owned), so map known synonyms onto the canonical arc, normalise casing/whitespace,
 * and drop anything unrecognised. Never abort a run on this cosmetic, optional field.
 *
 * @returns counts of coerced (synonym-mapped) and dropped (unrecognised) beats.
 */
// ── R4 step 4: coercion telemetry ────────────────────────────────────────────
/**
 * How often the coercion layer actually fired this run, and under which arm.
 *
 * WHY THIS EXISTS. R3/R4 add schema-constrained decoding to Agent 7, which should make the ~55-site
 * coercion layer redundant. "Should" is the problem: REVIEW §2.4 catalogues three shape bugs that
 * failed SILENTLY, and the only reason they were expensive is that nothing counted them. Deleting
 * coercion because the schema is on would be the same mistake in reverse — removing a safety net on
 * a belief rather than on a measurement.
 *
 * S7 ("retire coercion sites proven dead") consumes these counters. The bar it should be held to:
 * zero firings across several real runs on the flag-ON arm, per helper, before any site is deleted.
 */
export interface Agent7CoercionCounters {
  /** Which arm produced these counts — the comparison is meaningless without it. */
  structuredOutput: boolean;
  /** Beats mapped from a synonym onto the canonical Golden-Age arc. */
  beatsCoerced: number;
  /** Beats dropped as unrecognised. */
  beatsDropped: number;
  /** Scene fields recovered from a wrongly-nested `setting` object. */
  fieldsHoisted: number;
  /** Times any coercion helper changed anything at all. */
  firings: number;
}

const emptyCoercionCounters = (): Agent7CoercionCounters => ({
  structuredOutput: isAgent7StructuredOutputEnabled(),
  beatsCoerced: 0,
  beatsDropped: 0,
  fieldsHoisted: 0,
  firings: 0,
});

/**
 * Accumulate one helper's result onto the run. Stored on `ctx`, never in module state — a module
 * counter would leak across runs in a batch harness and quietly inflate the very number S7 reads.
 */
export function recordAgent7Coercion(
  ctx: OrchestratorContext,
  delta: { beatsCoerced?: number; beatsDropped?: number; fieldsHoisted?: number },
): void {
  const counters = (ctx.agent7Coercion ??= emptyCoercionCounters());
  counters.beatsCoerced += delta.beatsCoerced ?? 0;
  counters.beatsDropped += delta.beatsDropped ?? 0;
  counters.fieldsHoisted += delta.fieldsHoisted ?? 0;
  if ((delta.beatsCoerced ?? 0) + (delta.beatsDropped ?? 0) + (delta.fieldsHoisted ?? 0) > 0) {
    counters.firings += 1;
  }
}

/**
 * Emit the run's counters once, to both channels that survive the process:
 *   - `ctx.warnings`, which the orchestrator captures wholesale into the `run_warnings` diagnostic
 *     (chain logs die with the terminal; the report is the durable record);
 *   - a dedicated report diagnostic, so an A/B analyser can read the number without regex over prose.
 *
 * Emitted even when every count is ZERO. A zero that is never written is indistinguishable from a
 * telemetry path that never ran — which is precisely the defect class this counter exists to detect.
 */
export function emitAgent7CoercionTelemetry(ctx: OrchestratorContext): void {
  const counters = ctx.agent7Coercion ?? emptyCoercionCounters();
  ctx.agent7Coercion = counters;

  ctx.warnings.push(
    `[R4] agent7 coercion telemetry: structured_output=${counters.structuredOutput} ` +
      `firings=${counters.firings} beats_coerced=${counters.beatsCoerced} ` +
      `beats_dropped=${counters.beatsDropped} fields_hoisted=${counters.fieldsHoisted}`,
  );

  try {
    (ctx as any).scoreAggregator?.upsertDiagnostic?.(
      "agent7_coercion",
      "agent7_narrative",
      "Agent 7 Coercion Counters",
      "agent7_coercion",
      { ...counters },
    );
  } catch {
    // Telemetry must never abort a run that produced a valid outline.
  }
}

export function coerceNarrativeSceneBeats(narrative: unknown): { coerced: number; dropped: number } {
  const allowed = new Set<string>(GOLDEN_AGE_BEATS);
  let coerced = 0;
  let dropped = 0;
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return { coerced, dropped };
  for (const act of acts) {
    if (!act || !Array.isArray(act.scenes)) continue;
    for (const scene of act.scenes) {
      if (!scene || typeof scene !== "object" || scene.beat == null || scene.beat === "") continue;
      const key = String(scene.beat).trim().toLowerCase();
      if (allowed.has(key)) {
        if (scene.beat !== key) scene.beat = key; // normalise casing/whitespace
        continue;
      }
      if (BEAT_SYNONYMS[key]) {
        scene.beat = BEAT_SYNONYMS[key];
        coerced++;
      } else {
        delete scene.beat;
        dropped++;
      }
    }
  }
  return { coerced, dropped };
}

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
export function hoistMisplacedSceneFields(narrative: unknown): { hoisted: number } {
  let hoisted = 0;
  const acts = (narrative as any)?.acts;
  if (!Array.isArray(acts)) return { hoisted };
  const isEmpty = (v: unknown): boolean =>
    v == null || (typeof v === "string" && v.trim() === "") || (Array.isArray(v) && v.length === 0);
  for (const act of acts) {
    if (!act || !Array.isArray(act.scenes)) continue;
    for (const scene of act.scenes) {
      if (!scene || typeof scene !== "object") continue;
      const nested = scene.setting && typeof scene.setting === "object" ? scene.setting : null;
      if (nested) {
        for (const field of ["purpose", "summary", "characters", "cluesRevealed", "dramaticElements"] as const) {
          if (isEmpty(scene[field]) && !isEmpty(nested[field])) {
            scene[field] = nested[field];
            hoisted++;
          }
        }
      }
      // Last-resort summary synthesis from the model's OWN authored intent (purpose + dramatic beats),
      // so a scene given a title/purpose but no summary passes the completeness gate without fabricating
      // plot the model never wrote — and without aborting the run.
      if (isEmpty(scene.summary)) {
        const de = scene.dramaticElements && typeof scene.dramaticElements === "object" ? scene.dramaticElements : {};
        const parts = [scene.purpose, de.revelation, de.conflict, de.tension]
          .map((p: unknown) => (typeof p === "string" ? p.trim() : ""))
          .filter(Boolean);
        if (parts.length > 0) {
          scene.summary = parts.join(" ");
          hoisted++;
        }
      }
    }
  }
  return { hoisted };
}

export async function runAgent7(ctx: OrchestratorContext): Promise<void> {
  const retriesEnabled = preAgent9LlmRetriesEnabled();
  const contractRecoveryEnabled = preAgent9ContractRecoveryEnabled();
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

  let narrative: NarrativeOutline;

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent7_narrative",
      "Narrative Outline",
      async (retryFeedback?: string) => {
        const narrativeResult = await formatNarrative(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues!,
          targetLength: ctx.inputs.targetLength,
          narrativeStyle: ctx.inputs.narrativeStyle,
          detectiveType: ctx.inputs.detectiveType,
          qualityGuardrails: retryFeedback ? [retryFeedback, ...pacingGuardrails] : pacingGuardrails,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          ...lockedFactsSpread,
          ...completenessSpread,
        });
        return { result: narrativeResult, cost: narrativeResult.cost };
      },
      async (narrativeResult) => {
        const scorer = new NarrativeScorer();
        const clueMappings: ClueRef[] = (
          (ctx.cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? []
        )
          .map((m: any): ClueRef => ({
            id: String(m.clue_id || ""),
            placement: m.act_number === 1 ? "early" : m.act_number === 2 ? "mid" : m.act_number === 3 ? "late" : undefined,
          }))
          .filter((c: ClueRef) => c.id);
        const adapted = adaptNarrativeForScoring(
          narrativeResult,
          (ctx.cml as any)?.CASE?.cast ?? [],
          clueMappings
        );
        const score = await scorer.score({}, adapted, {
          previous_phases: { agent2_cast: ctx.cast!.cast },
          cml: ctx.cml!,
          threshold_config: { mode: "standard" },
          targetLength: ctx.inputs.targetLength ?? "medium",
        });

        // Scene-count gate inside the scoring path: force F only when the deviation
        // exceeds the configured tolerance (±getChapterTargetTolerance()).  Counts within
        // tolerance are accepted — prose generates one chapter per scene so a ±2 deviation
        // doesn't break the story structure.
        const actualSceneCount = (narrativeResult.acts ?? []).flatMap((a: any) =>
          Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        const expectedSceneCount = getSceneTarget(ctx.inputs.targetLength ?? "medium");
        const sceneCountTolerance = getChapterTargetTolerance();
        if (Math.abs(actualSceneCount - expectedSceneCount) > sceneCountTolerance) {
          // Use the SAME act-distribution ratios that buildUserRequest() uses so the
          // retry feedback tells the LLM exactly what the prompt already asked for.
          const pacing = getGenerationParams().agent7_narrative.params.pacing;
          const actI   = Math.round(expectedSceneCount * pacing.act_distribution.act1_ratio);
          const actII  = Math.round(expectedSceneCount * pacing.act_distribution.act2_ratio);
          const actIII = expectedSceneCount - actI - actII;
          return {
            adapted,
            score: {
              ...score,
              total: 0,
              grade: 'F' as const,
              passed: false,
              failure_reason:
                `Scene count: generated ${actualSceneCount} scenes but target is ${expectedSceneCount} ` +
                `(tolerance ±${sceneCountTolerance}; deviation of ${Math.abs(actualSceneCount - expectedSceneCount)} exceeds limit). ` +
                `Distribute as: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
                `(these are exact counts, not ranges). Do not merge or drop scenes — ` +
                `each scene becomes a distinct prose chapter.`,
              component_failures: [
                ...(score.component_failures ?? []),
                `scene_count (${actualSceneCount} vs target ${expectedSceneCount}, tolerance ±${sceneCountTolerance})`,
              ],
            },
          };
        }

        return {
          adapted,
          score: applyHonestScorer(
            score,
            () => scoreRealNarrative(narrativeResult, ctx.inputs.targetLength ?? "medium"),
            ctx.warnings,
            "agent7-narrative",
          ),
        };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport
    );
    narrative = result;
    ctx.agentCosts["agent7_narrative"] = cost;
    ctx.agentDurations["agent7_narrative"] = duration;
  } else {
    const narrativeStart = Date.now();
    narrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: pacingGuardrails,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      ...lockedFactsSpread,
      ...completenessSpread,
    });
    ctx.agentCosts["agent7_narrative"] = narrative.cost;
    ctx.agentDurations["agent7_narrative"] = Date.now() - narrativeStart;
  }

  // ── Deterministic act-field repair ────────────────────────────────────────
  // The LLM intermittently omits the required `purpose` field on one or more acts
  // (most commonly acts[2], Act III).  Synthesise a default before schema validation
  // so the repair retry is not wasted on this trivial gap.
  const ACT_DEFAULT_PURPOSES: Record<number, string> = {
    1: "Establish the setting, introduce key characters, and present the inciting incident.",
    2: "Develop the investigation, deepen the mystery, and introduce complications.",
    3: "Build to the confrontation, reveal the truth, and resolve the mystery.",
  };
  if (Array.isArray((narrative as any).acts)) {
    for (const act of (narrative as any).acts) {
      if (act && typeof act === "object" && !act.purpose && act.actNumber) {
        act.purpose = ACT_DEFAULT_PURPOSES[act.actNumber] ?? "Advance the story.";
        ctx.warnings.push(`act${act.actNumber}.purpose was missing — synthesised default.`);
      }
    }
  }

  // ── Deterministic beat coercion (before schema validation) ──────────────────
  const beatCoercion = coerceNarrativeSceneBeats(narrative);
  recordAgent7Coercion(ctx, { beatsCoerced: beatCoercion.coerced, beatsDropped: beatCoercion.dropped });
  if (beatCoercion.coerced > 0 || beatCoercion.dropped > 0) {
    ctx.warnings.push(
      `Narrative beat coercion: mapped ${beatCoercion.coerced} synonym beat(s) to the Golden-Age arc, dropped ${beatCoercion.dropped} unrecognised beat(s) before schema validation.`,
    );
  }
  const fieldHoist = hoistMisplacedSceneFields(narrative);
  recordAgent7Coercion(ctx, { fieldsHoisted: fieldHoist.hoisted });
  if (fieldHoist.hoisted > 0) {
    ctx.warnings.push(
      `Narrative field hoist: recovered ${fieldHoist.hoisted} scene field(s) the model nested under 'setting' (purpose/summary/characters/…) before schema validation — prevents a spurious completeness abort.`,
    );
  }

  // ── Schema repair ──────────────────────────────────────────────────────────
  let narrativeSchemaValidation = validateArtifact("narrative_outline", narrative);
  if (!narrativeSchemaValidation.valid) {
    if (!contractRecoveryEnabled) {
      narrativeSchemaValidation.errors.forEach((error) => ctx.errors.push(`Outline schema failure: ${error}`));
      ctx.failedNarrative = narrative; // capture the failing candidate for the partial-artifact snapshot
      throw new Error("Narrative outline artifact failed schema validation (contract recovery disabled)");
    }
    ctx.warnings.push(
      "Narrative outline failed schema validation on first attempt; retrying outline generation with schema repair guardrails"
    );
    const schemaRepairGuardrails = [
      "Return a valid narrative_outline artifact that strictly matches required schema fields and types.",
      ...narrativeSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
    ];

    const narrativeSchemaRetryStart = Date.now();
    const retriedNarrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: [...schemaRepairGuardrails, ...pacingGuardrails],
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      ...lockedFactsSpread,
      ...completenessSpread,
    });

    ctx.agentCosts["agent7_narrative"] =
      (ctx.agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
    ctx.agentDurations["agent7_narrative"] =
      (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeSchemaRetryStart);

    // The retry is a fresh LLM generation and can re-emit out-of-enum beats, so it needs the
    // same deterministic coercion as the first attempt — otherwise a beat-only defect on the
    // retry still hard-aborts at the last gate before failure.
    const retryBeatCoercion = coerceNarrativeSceneBeats(retriedNarrative);
    recordAgent7Coercion(ctx, {
      beatsCoerced: retryBeatCoercion.coerced,
      beatsDropped: retryBeatCoercion.dropped,
    });
    if (retryBeatCoercion.coerced > 0 || retryBeatCoercion.dropped > 0) {
      ctx.warnings.push(
        `Narrative beat coercion (retry): mapped ${retryBeatCoercion.coerced} synonym beat(s), dropped ${retryBeatCoercion.dropped} unrecognised beat(s) before schema validation.`,
      );
    }
    recordAgent7Coercion(ctx, { fieldsHoisted: hoistMisplacedSceneFields(retriedNarrative).hoisted });

    const retryValidation = validateArtifact("narrative_outline", retriedNarrative);
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) => ctx.errors.push(`Outline schema failure: ${error}`));
      ctx.failedNarrative = retriedNarrative; // capture the failing retry candidate for the partial-artifact snapshot
      throw new Error("Narrative outline artifact failed schema validation");
    }

    narrative = retriedNarrative;
    narrativeSchemaValidation = retryValidation;
    ctx.warnings.push("Narrative outline schema-repair retry succeeded");
    await rescoreNarrative(ctx, narrative);
  }
  narrativeSchemaValidation.warnings.forEach((warning) =>
    ctx.warnings.push(`Outline schema warning: ${warning}`)
  );

  // ── Scene count final gate ────────────────────────────────────────────────
  // The scene count produced by the LLM MUST be within ±getChapterTargetTolerance()
  // of STORY_LENGTH_TARGETS[targetLength].scenes.  Prose generates one chapter per
  // scene, so a small deviation is acceptable and does not break story structure.
  // Only counts outside the tolerance trigger a retry / abort.
  {
    const expectedScenes = getSceneTarget(ctx.inputs.targetLength ?? "medium");
    const sceneTolerance = getChapterTargetTolerance();
    // Use act-traversal count, not the LLM-supplied totalScenes field (which can lag).
    const actualSceneCount = (narrative.acts ?? []).flatMap((a: any) =>
      Array.isArray(a.scenes) ? a.scenes : []
    ).length;

    if (Math.abs(actualSceneCount - expectedScenes) > sceneTolerance) {
      if (!contractRecoveryEnabled) {
        const deterministicRepair = rebalanceNarrativeSceneCountsDeterministically(
          narrative,
          expectedScenes,
          ctx.clues,
        );
        const repairedCount = (narrative.acts ?? []).flatMap((a: any) =>
          Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        if (Math.abs(repairedCount - expectedScenes) <= sceneTolerance) {
          ctx.warnings.push(
            `Scene count final gate: deterministic repair applied without retry (${deterministicRepair.summary}); accepted ${repairedCount} scenes for target ${expectedScenes}.`
          );
          await rescoreNarrative(ctx, narrative);
        } else {
          throw new Error(
            `Scene count enforcement failed with contract recovery disabled: narrative has ${repairedCount} scenes but requires ${expectedScenes} ±${sceneTolerance}.`
          );
        }
      } else {
      // Compute exact act targets using the SAME ratios as buildUserRequest() so the
      // retry message is always consistent with what the prompt already asked for.
      const pacing = getGenerationParams().agent7_narrative.params.pacing;
      const actI   = Math.round(expectedScenes * pacing.act_distribution.act1_ratio);
      const actII  = Math.round(expectedScenes * pacing.act_distribution.act2_ratio);
      const actIII = expectedScenes - actI - actII;

      ctx.warnings.push(
        `Scene count final gate: narrative has ${actualSceneCount} scenes but target is ${expectedScenes} — regenerating.`
      );
      ctx.reportProgress("narrative", `Scene count fix: need ${expectedScenes} scenes, got ${actualSceneCount}`, 80);

      const sceneCountRetryStart = Date.now();
      const sceneCountRetried = await formatNarrative(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues!,
        targetLength: ctx.inputs.targetLength,
        narrativeStyle: ctx.inputs.narrativeStyle,
        detectiveType: ctx.inputs.detectiveType,
        qualityGuardrails: [
          `SCENE COUNT VIOLATION: Your previous outline had ${actualSceneCount} scenes. ` +
          `The target is EXACTLY ${expectedScenes} scenes — no more, no fewer. ` +
          `You MUST generate EXACTLY: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
          `(these are exact counts, not ranges; they add up to ${actI + actII + actIII}). ` +
          `Count your scenes carefully before returning. ` +
          `Each scene is a distinct chapter in the final novel — do not merge or drop scenes.`,
          ...pacingGuardrails,
        ],
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        ...lockedFactsSpread,
        ...completenessSpread,
      });
      ctx.agentCosts["agent7_narrative"] =
        (ctx.agentCosts["agent7_narrative"] || 0) + sceneCountRetried.cost;
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - sceneCountRetryStart);

      const retriedActualCount = (sceneCountRetried.acts ?? []).flatMap((a: any) =>
        Array.isArray(a.scenes) ? a.scenes : []
      ).length;

      if (Math.abs(retriedActualCount - expectedScenes) <= sceneTolerance) {
        narrative = sceneCountRetried;
        ctx.warnings.push(`Scene count final gate: retry produced ${retriedActualCount} scenes — within ±${sceneTolerance} of target ${expectedScenes}, accepted.`);
        await rescoreNarrative(ctx, narrative);
      } else {
        // Last-resort deterministic repair to prevent hard failure on scene-count drift.
        const deterministicRepair = rebalanceNarrativeSceneCountsDeterministically(
          sceneCountRetried,
          expectedScenes,
          ctx.clues,
        );
        const repairedCount = (sceneCountRetried.acts ?? []).flatMap((a: any) =>
          Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        if (Math.abs(repairedCount - expectedScenes) <= sceneTolerance) {
          narrative = sceneCountRetried;
          ctx.warnings.push(
            `Scene count final gate: deterministic repair applied (${deterministicRepair.summary}) and recovered count ${repairedCount} for target ${expectedScenes}.`
          );
          await rescoreNarrative(ctx, narrative);
        } else {
          // Both LLM retries and deterministic repair failed; abort.
          throw new Error(
            `Scene count enforcement failed: after retries and deterministic repair, narrative has ${repairedCount} scenes ` +
            `but the pipeline requires ${expectedScenes} ±${sceneTolerance}. ` +
            `Aborting — cannot continue to prose generation with wrong scene count.`
          );
        }
      }
      }
    }
  }

  ctx.reportProgress(
    "narrative",
    `${narrative.totalScenes} scenes structured (~${(getStoryLengthTarget(ctx.inputs.targetLength).chapters * getStoryLengthTarget(ctx.inputs.targetLength).chapterIdealWords).toLocaleString()} words target)`,
    87
  );

  // ── Pre-prose outline quality gate ────────────────────────────────────────
  // X32 diagnosis, ALWAYS ON and never an issue by itself: the count is what the board could not see.
  // REVIEW_13 §8.2 had to read the manuscript to learn that the clearances were written three times,
  // because nothing in the pipeline reported how many scenes were given the job. This costs nothing
  // and changes no behaviour — whether the count becomes a repair is `AGENT9_FOLD_SUSPECT_CLEARANCES`.
  const closureSceneTitles = countSuspectClosureScenes(narrative);
  if (closureSceneTitles.length > 1) {
    ctx.warnings.push(
      `[X32] Outline gives a suspect-clearance job to ${closureSceneTitles.length} scenes: ` +
      `${closureSceneTitles.join("; ")}. Every pass after the first repeats a resolved beat.`,
    );
  }

  const outlineCoverageIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
  if (outlineCoverageIssues.length > 0) {
    if (!contractRecoveryEnabled) {
      outlineCoverageIssues.forEach((issue) =>
        ctx.warnings.push(`Outline coverage gap (contract recovery disabled): ${issue.message}`)
      );
    } else {
    const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);
    const outlineGuardrails = buildOutlineRepairGuardrails(outlineCoverageIssues, ctx.cml!);
    const countGuardrails = buildNarrativeSceneCountGuardrails(sceneCountLock, "coverage repair");
    outlineCoverageIssues.forEach((issue) =>
      ctx.warnings.push(`Outline coverage gap: ${issue.message}`)
    );
    ctx.warnings.push("Regenerating outline with targeted quality guardrails");
    ctx.reportProgress("narrative", "Regenerating outline to address coverage gaps", 80);

    const narrativeRetryStart = Date.now();
    const retriedNarrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: [...outlineGuardrails, ...countGuardrails, ...pacingGuardrails],
      runId: ctx.runId,
      projectId: ctx.projectId || "",
      ...lockedFactsSpread,
      ...completenessSpread,
    });

    ctx.agentCosts["agent7_narrative"] =
      (ctx.agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
    ctx.agentDurations["agent7_narrative"] =
      (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeRetryStart);

    const retryOutlineIssues = evaluateOutlineCoverage(retriedNarrative, ctx.cml!);
    const retryCountCheck = checkNarrativeSceneCountFloor(retriedNarrative, sceneCountLock);

    if (retryOutlineIssues.length < outlineCoverageIssues.length && retryCountCheck.ok) {
      narrative = retriedNarrative;
      ctx.warnings.push("Outline retry improved coverage");
      await rescoreNarrative(ctx, narrative);
      ctx.reportProgress(
        "narrative",
        `Outline retry: ${retriedNarrative.totalScenes} scenes (${retriedNarrative.estimatedTotalWords} words)`,
        85
      );
    } else {
      if (!retryCountCheck.ok) {
        ctx.warnings.push(
          `Outline retry rejected due to scene-count lock violation (${retryCountCheck.message}); keeping baseline outline and passing quality guardrails to prose generation.`
        );
      } else {
        ctx.warnings.push("Outline retry did not improve; will pass guardrails to prose generation");
      }
    }
    }
  }

  // ── Clue pacing gate ──────────────────────────────────────────────────────
  {
    const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
    const totalOutlineSceneCount = allOutlineScenes.length;
    const clueSceneCount = allOutlineScenes.filter(
      (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
    ).length;
    const minClueScenes = Math.ceil(totalOutlineSceneCount * minClueSceneRatio);
    const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);

    if (totalOutlineSceneCount > 0 && clueSceneCount < minClueScenes) {
      if (!contractRecoveryEnabled) {
        const maxDeterministicGapFill = computeDeterministicGapFillCap(totalOutlineSceneCount);
        const deterministicOnly = applyDeterministicCluePreAssignment(
          narrative,
          ctx.cml!,
          ctx.clues!,
          minClueSceneRatio,
          maxDeterministicGapFill,
        );
        if (deterministicOnly.after >= deterministicOnly.minRequired) {
          ctx.warnings.push(
            `Outline pacing gate recovered deterministically without retry: ${deterministicOnly.after}/${deterministicOnly.totalScenes} scenes.`
          );
        } else {
          throw new Error(
            `Outline pacing gate failed with contract recovery disabled (${deterministicOnly.after}/${deterministicOnly.totalScenes}, need >= ${deterministicOnly.minRequired}).`
          );
        }
      } else {
      ctx.warnings.push(
        `Outline clue pacing below threshold: ${clueSceneCount}/${totalOutlineSceneCount} scenes carry clues (minimum ${minClueScenes}). Trying narrative regeneration before deterministic patching.`
      );

      {
        ctx.reportProgress(
          "narrative",
          `Clue pacing retry: ${clueSceneCount}/${totalOutlineSceneCount} scenes have clues (≥${minClueScenes} required)`,
          86
        );

        const pacingRetryStart = Date.now();
        const pacingRetried = await formatNarrative(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues!,
          targetLength: ctx.inputs.targetLength,
          narrativeStyle: ctx.inputs.narrativeStyle,
          detectiveType: ctx.inputs.detectiveType,
          qualityGuardrails: [
            `CRITICAL PACING FAILURE: Your previous outline placed clues in only ${clueSceneCount} of ${totalOutlineSceneCount} scenes. The minimum required is ${minClueScenes} scenes. You MUST populate cluesRevealed with at least one clue ID in at least ${minClueScenes} scenes and distribute clues across all three acts.`,
            ...buildNarrativeSceneCountGuardrails(sceneCountLock, "clue pacing repair"),
            ...pacingGuardrails,
          ],
          runId: ctx.runId,
          projectId: ctx.projectId || "",
          ...lockedFactsSpread,
          ...completenessSpread,
        });
        ctx.agentCosts["agent7_narrative"] =
          (ctx.agentCosts["agent7_narrative"] ?? 0) + pacingRetried.cost;
        ctx.agentDurations["agent7_narrative"] =
          (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - pacingRetryStart);

        const retriedOutlineScenes = (pacingRetried.acts ?? []).flatMap((a: any) => a.scenes || []);
        const retriedClueCount = retriedOutlineScenes.filter(
          (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
        ).length;
        const retriedMinClueScenes = Math.ceil(retriedOutlineScenes.length * minClueSceneRatio);
        const pacingRetryCountCheck = checkNarrativeSceneCountFloor(pacingRetried, sceneCountLock);

        if (!pacingRetryCountCheck.ok) {
          ctx.warnings.push(
            `Outline pacing retry rejected due to scene-count lock violation (${pacingRetryCountCheck.message}); keeping current outline and deterministic clue assignments.`
          );
        } else if (retriedClueCount >= retriedMinClueScenes) {
          narrative = pacingRetried;
          ctx.warnings.push(
            `Outline pacing retry succeeded: ${retriedClueCount}/${retriedOutlineScenes.length} scenes now carry clues.`
          );
        } else {
          const maxDeterministicGapFill = computeDeterministicGapFillCap(retriedOutlineScenes.length);
          const remainingGap = retriedMinClueScenes - retriedClueCount;
          let secondRetryResolved = false;
          if (remainingGap > maxDeterministicGapFill) {
            // Class #14 (P5-VOICE poison_enforce, 2026-07-20): a catastrophic outline draw (2/10
            // clue scenes) left a gap the bounded fill cannot bridge, and the single retry was the
            // last word — the run died for want of ONE more Agent-7 call. Second targeted retry,
            // same acceptance ladder; the abort stands if this too cannot reach the floor.
            ctx.reportProgress(
              "narrative",
              `Clue pacing second retry: ${retriedClueCount}/${retriedOutlineScenes.length} (gap ${remainingGap} > fill cap ${maxDeterministicGapFill})`,
              86
            );
            const secondStart = Date.now();
            const secondRetry = await formatNarrative(ctx.client, {
              caseData: ctx.cml!,
              clues: ctx.clues!,
              targetLength: ctx.inputs.targetLength,
              narrativeStyle: ctx.inputs.narrativeStyle,
              detectiveType: ctx.inputs.detectiveType,
              qualityGuardrails: [
                `CRITICAL PACING FAILURE (second retry): your outline placed clues in only ${retriedClueCount} of ${retriedOutlineScenes.length} scenes; the minimum is ${retriedMinClueScenes}. EVERY act must contain clue-bearing scenes. Set cluesRevealed to at least one clue ID in AT LEAST ${retriedMinClueScenes} scenes — when unsure, prefer MORE clue-bearing scenes, not fewer.`,
                ...buildNarrativeSceneCountGuardrails(sceneCountLock, "clue pacing repair"),
                ...pacingGuardrails,
              ],
              runId: ctx.runId,
              projectId: ctx.projectId || "",
              ...lockedFactsSpread,
              ...completenessSpread,
            });
            ctx.agentCosts["agent7_narrative"] =
              (ctx.agentCosts["agent7_narrative"] ?? 0) + secondRetry.cost;
            ctx.agentDurations["agent7_narrative"] =
              (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - secondStart);
            const secondScenes = (secondRetry.acts ?? []).flatMap((a: any) => a.scenes || []);
            const secondClueCount = secondScenes.filter(
              (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
            ).length;
            const secondMin = Math.ceil(secondScenes.length * minClueSceneRatio);
            const secondCountCheck = checkNarrativeSceneCountFloor(secondRetry, sceneCountLock);
            const secondCap = computeDeterministicGapFillCap(secondScenes.length);
            if (secondCountCheck.ok && secondClueCount >= secondMin) {
              narrative = secondRetry;
              secondRetryResolved = true;
              ctx.warnings.push(
                `Outline pacing SECOND retry succeeded: ${secondClueCount}/${secondScenes.length} scenes carry clues.`
              );
            } else if (secondCountCheck.ok && secondMin - secondClueCount <= secondCap) {
              const fill = applyDeterministicCluePreAssignment(
                secondRetry,
                ctx.cml!,
                ctx.clues!,
                minClueSceneRatio,
                secondCap,
              );
              if (fill.after >= fill.minRequired) {
                narrative = secondRetry;
                secondRetryResolved = true;
                ctx.warnings.push(
                  `Outline pacing second retry + bounded fill recovered coverage to ${fill.after}/${fill.totalScenes}.`
                );
              } else {
                throw new Error(
                  `Outline pacing gate failed after second retry: bounded fill insufficient (${fill.after}/${fill.totalScenes}, need >= ${fill.minRequired}).`,
                );
              }
            } else {
              throw new Error(
                `Outline pacing gate failed: two retries below threshold (${secondClueCount}/${secondScenes.length}, need >= ${secondMin})${secondCountCheck.ok ? ` and gap exceeds fill cap ${secondCap}` : ` (scene-count lock: ${secondCountCheck.message})`}.`,
              );
            }
          }
          if (!secondRetryResolved) {
          const deterministicOnRetry = applyDeterministicCluePreAssignment(
            pacingRetried,
            ctx.cml!,
            ctx.clues!,
            minClueSceneRatio,
            maxDeterministicGapFill,
          );
          if (deterministicOnRetry.after >= deterministicOnRetry.minRequired) {
            narrative = pacingRetried;
            ctx.warnings.push(
              `Outline pacing retry remained below threshold (${retriedClueCount}/${retriedOutlineScenes.length}), but deterministic post-retry anchoring recovered coverage to ${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}.`
            );
            ctx.reportProgress(
              "narrative",
              `Deterministic post-retry clue anchoring applied: ${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}`,
              86
            );
          } else {
            throw new Error(
              `Outline pacing gate failed: retry and bounded deterministic anchoring both insufficient (${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}, need >= ${deterministicOnRetry.minRequired}).`,
            );
          }
          }
        }
      }
      }
    }
  }

  // ── Pre-commit completeness gate (single bundled remediation pass) ──────
  {
    const preCommitIssues = evaluateOutlinePreCommitCompleteness(narrative);
    if (preCommitIssues.length > 0) {
      // Pre-commit completeness remediation is a structural repair (generate the missing content),
      // not a speculative quality retry. Run unconditionally regardless of retriesEnabled.
      const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);
      ctx.warnings.push(
        `Outline pre-commit completeness gate found ${preCommitIssues.length} issue(s); running bundled remediation pass.`,
      );
      ctx.reportProgress("narrative", "Bundled remediation: fixing outline completeness gaps", 86);

      const remediationStart = Date.now();
      const remediatedNarrative = await formatNarrative(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues!,
        targetLength: ctx.inputs.targetLength,
        narrativeStyle: ctx.inputs.narrativeStyle,
        detectiveType: ctx.inputs.detectiveType,
        qualityGuardrails: [
          "BUNDLED PRE-COMMIT CONTRACT: fix all listed outline completeness issues in this single response.",
          ...preCommitIssues.map((issue) => `Pre-commit issue: ${issue}`),
          ...buildNarrativeSceneCountGuardrails(sceneCountLock, "pre-commit completeness remediation"),
          ...pacingGuardrails,
        ],
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        ...lockedFactsSpread,
        ...completenessSpread,
      });

      ctx.agentCosts["agent7_narrative"] =
        (ctx.agentCosts["agent7_narrative"] ?? 0) + remediatedNarrative.cost;
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - remediationStart);

      // recover any still-misplaced fields before the abort gate
      recordAgent7Coercion(ctx, { fieldsHoisted: hoistMisplacedSceneFields(remediatedNarrative).hoisted });
      const countCheck = checkNarrativeSceneCountFloor(remediatedNarrative, sceneCountLock);
      const remainingIssues = evaluateOutlinePreCommitCompleteness(remediatedNarrative);

      if (!countCheck.ok) {
        // Completeness remediation is allowed to add scenes — treat a changed scene
        // count as a warning rather than a hard abort. The lock was set before
        // remediation; if the model needs an extra scene to satisfy a completeness
        // requirement, that is the correct behaviour.
        ctx.warnings.push(
          `Outline pre-commit remediation changed scene count: ${countCheck.message}. Accepted — completeness remediation may legitimately add scenes.`,
        );
      }
      if (remainingIssues.length > 0) {
        throw new Error(
          `Outline pre-commit remediation left unresolved completeness issues: ${remainingIssues.join(" | ")}`,
        );
      }

      narrative = remediatedNarrative;
      ctx.warnings.push("Outline pre-commit remediation succeeded.");
      await rescoreNarrative(ctx, narrative);
    }
  }

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
  if (ctx.inputs.enableOutlineCompleteness) {
    const allPatchScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    let rhPatchCount = 0;
    for (const scene of allPatchScenes) {
      if ((scene.act === 1 || scene.act === 2) && (scene as any).redHerringPlacement === undefined) {
        (scene as any).redHerringPlacement = null;
        rhPatchCount += 1;
      }
    }
    if (rhPatchCount > 0) {
      ctx.warnings.push(
        `Outline completeness pre-patch: set redHerringPlacement=null on ${rhPatchCount} Act I-II scene(s) where the field was absent.`,
      );
    }

    // Deterministic pre-patch: repair generic/N/A factEstablished and pivotElement values
    // by deriving a concrete fallback from the scene's other rich fields (summary, purpose, title).
    // The LLM occasionally emits "N/A" for bridging/transitional scenes.  This patch replaces
    // those values so the gate can pass without masking real structural gaps.
    const GENERIC_PATCH_RE = /^(n\/a|tbd|none|generic|placeholder|investigation continues|scene continues|characters discuss|more clues|\s*)$/i;
    let factPatchCount = 0;
    for (const scene of allPatchScenes) {
      const pivot = (scene as any).pivotElement;
      const fact = (scene as any).factEstablished;
      const pivotGeneric = !pivot || GENERIC_PATCH_RE.test(String(pivot).trim());
      const factGeneric = !fact || GENERIC_PATCH_RE.test(String(fact).trim());
      // Derive a fallback: prefer the sibling field if concrete, else use summary/purpose/title.
      const fallbackSource: string =
        (!pivotGeneric ? String(pivot).trim() : null) ??
        (typeof scene.summary === "string" && scene.summary.trim().length > 10 ? scene.summary.trim().slice(0, 120) : null) ??
        (typeof scene.purpose === "string" && scene.purpose.trim().length > 10 ? scene.purpose.trim().slice(0, 120) : null) ??
        (typeof scene.title === "string" && scene.title.trim().length > 0 ? `Scene establishes: ${scene.title.trim()}` : null) ??
        `Advances investigation in Act ${scene.act ?? "?"}`;
      if (factGeneric) {
        (scene as any).factEstablished = fallbackSource;
        factPatchCount += 1;
      }
      if (pivotGeneric) {
        const pivotFallback: string =
          (!factGeneric ? String(fact).trim() : null) ?? fallbackSource;
        (scene as any).pivotElement = pivotFallback;
        factPatchCount += 1;
      }
    }
    if (factPatchCount > 0) {
      ctx.warnings.push(
        `Outline completeness pre-patch: repaired generic factEstablished/pivotElement on ${factPatchCount} field(s) using scene summary/purpose.`,
      );
    }
  }

  // Runs only when enableOutlineCompleteness is active.  Halts the pipeline if any
  // scene is missing pivotElement / factEstablished (all scenes), or if an Act I–II
  // scene is missing redHerringPlacement (which may be null, but must be present).
  if (ctx.inputs.enableOutlineCompleteness) {
    const GENERIC_PATTERNS = /^(n\/a|tbd|none|generic|placeholder|investigation continues|scene continues|characters discuss|more clues|\s*)$/i;
    const allCompScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    const missing: string[] = [];
    for (const scene of allCompScenes) {
      const sn = `Scene ${scene.sceneNumber} (Act ${scene.act})`;
      const pivot = (scene as any).pivotElement;
      const fact = (scene as any).factEstablished;
      if (!pivot || GENERIC_PATTERNS.test(String(pivot).trim())) {
        missing.push(`${sn}: pivotElement missing or generic ("${pivot ?? ''}")`);
      }
      if (!fact || GENERIC_PATTERNS.test(String(fact).trim())) {
        missing.push(`${sn}: factEstablished missing or generic ("${fact ?? ''}")`);
      }
      // Act I–II scenes must have redHerringPlacement present (null is OK; undefined is not)
      if ((scene.act === 1 || scene.act === 2) && (scene as any).redHerringPlacement === undefined) {
        missing.push(`${sn}: redHerringPlacement absent (must be null or a placement object)`);
      }
    }
    if (missing.length > 0) {
      const msg =
        `Outline completeness gate failed: ${missing.length} scene(s) have incomplete contracts:\n` +
        missing.slice(0, 8).join("\n");
      ctx.errors.push(msg);
      throw new Error(msg);
    }
    ctx.warnings.push(
      `Outline completeness gate passed: all ${allCompScenes.length} scenes have concrete` +
      ` pivotElement, factEstablished, and redHerringPlacement contracts.`,
    );
  }

  // ── Clue-coverage gate: every distribution ID must appear in ≥1 scene's cluesRevealed ─
  // Agent 7 LLM sometimes front-loads clues into early scenes and leaves Agent-5-synthesized
  // supporting/optional IDs unanchored. This gate deterministically force-assigns any
  // uncovered ID to an appropriate scene, preserving the scene-count lock.
  {
    const allScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    const coveredClueIds = new Set<string>(
      allScenes
        .flatMap((s: any) => Array.isArray(s.cluesRevealed) ? s.cluesRevealed : [])
        .map(String)
        .filter(Boolean),
    );
    const allDistributionIds = (ctx.clues?.clues ?? [])
      .map((c: any) => String(c.id ?? ""))
      .filter(Boolean);
    const uncoveredIds = allDistributionIds.filter((id) => !coveredClueIds.has(id));

    if (uncoveredIds.length > 0) {
      // Deterministically assign each uncovered ID to the least-loaded scene in its target act.
      for (const clueId of uncoveredIds) {
        const clueEntry = (ctx.clues!.clues as any[]).find((c) => c.id === clueId);
        const placement: string = clueEntry?.placement ?? "mid";
        const targetAct = placement === "early" ? 1 : placement === "late" ? 3 : 2;
        const actScenes = allScenes.filter((s: any) => s.act === targetAct);
        const candidates = actScenes.length > 0 ? actScenes : allScenes;
        const sorted = [...candidates].sort(
          (a: any, b: any) => (a.cluesRevealed?.length ?? 0) - (b.cluesRevealed?.length ?? 0),
        );
        const target = sorted[0];
        if (target) {
          if (!Array.isArray(target.cluesRevealed)) target.cluesRevealed = [];
          if (!target.cluesRevealed.includes(clueId)) {
            target.cluesRevealed.push(clueId);
          }
        }
      }
      ctx.warnings.push(
        `Clue-coverage gate: deterministically force-assigned ${uncoveredIds.length} unanchored` +
        ` clue ID(s) to scenes: ${uncoveredIds.join(", ")}.`,
      );
    } else {
      ctx.warnings.push(
        `Clue-coverage gate passed: all ${allDistributionIds.length} clue ID(s) are assigned to ≥1 scene.`,
      );
    }
  }

  // ── Deterministic coverage patch ─────────────────────────────────────────
  // If the outline still lacks a discriminating-test scene after all LLM
  // retries, inject the required vocabulary directly into the purpose of the
  // best candidate scene (last Act-2 scene, or first Act-3 scene).  This
  // prevents the agent-9 hard-stop while preserving all other scene content.
  // A_53 P10 (outline-coverage-evaluated-thrice): hoist the coverage result + a "did a patch mutate
  // a scene purpose?" flag so the post-block recompute for ctx.outlineCoverageIssues can reuse this
  // scan when nothing changed (the 4 whole-corpus regex scans were re-run up to 4×/run).
  let finalCoverageIssues: OutlineCoverageIssue[];
  let coveragePatched = false;
  {
    const prePatchIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
    finalCoverageIssues = prePatchIssues;
    // A_53 P1 (holistic): derive the patch vocabulary from the case's OWN discriminating test +
    // cast, never a fixed plot. The previous patch spliced a literal "clock mechanism" and exactly
    // "two suspects" into ANY mystery missing a discriminating-test scene — a false plot beat that
    // Agent 9 then honoured. We now parameterise the test method and the ruled-out count, and refer
    // to the mechanism only generically (so a poison/tide/acoustic case is never told it has a clock).
    const patchCase = (ctx.cml as any)?.CASE ?? {};
    const patchDiscrim = patchCase.discriminating_test ?? {};
    const patchMethod =
      String(patchDiscrim.method ?? "constraint_proof").replace(/_/g, " ").trim() || "constraint proof";
    const patchDesign = String(patchDiscrim.design ?? "").trim();
    const patchDesignClause = patchDesign ? ` (${patchDesign})` : "";
    const patchCulprits: string[] = Array.isArray(patchCase.culpability?.culprits)
      ? (patchCase.culpability.culprits as string[])
      : [];
    const nonCulpritSuspectCount = (Array.isArray(patchCase.cast) ? patchCase.cast : [])
      .filter((c: any) => String(c?.role_archetype ?? c?.role ?? "").toLowerCase().includes("suspect"))
      .map((c: any) => String(c?.name ?? "").trim())
      .filter((name: string) => name.length > 0 && !patchCulprits.includes(name)).length;
    const numberWord = (n: number): string =>
      ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine"][n] ?? String(n);
    const ruledOutPhrase = nonCulpritSuspectCount >= 1
      ? `${numberWord(nonCulpritSuspectCount)} suspect${nonCulpritSuspectCount === 1 ? "" : "s"}`
      : "the other suspects";

    if (prePatchIssues.some((issue) => issue.type === "missing_discriminating_test_scene")) {
      const allRefs = flattenNarrativeScenes(narrative);
      const act2Last = [...allRefs].filter((r) => r.act === 2).at(-1);
      const act3First = allRefs.find((r) => r.act === 3);
      const fallback = allRefs[Math.floor(allRefs.length * 0.6)];
      const candidate = act2Last ?? act3First ?? fallback;
      if (candidate?.scene) {
        const patch =
          `The detective stages a discriminating ${patchMethod} test${patchDesignClause}: its` +
          ` constraints prove that ${ruledOutPhrase} are ruled out because the established mechanism` +
          ` could not have been operated by them — the evidence, timeline, and alibi confirm only the` +
          ` culprit had access.`;
        candidate.scene.purpose = [candidate.scene.purpose ?? "", patch].filter(Boolean).join(" ");
        coveragePatched = true; // A_53 P10: a purpose changed → final coverage scan must re-run.
        ctx.warnings.push(
          `Outline discriminating-test vocabulary patch applied deterministically to` +
          ` scene ${candidate.sceneNumber} (act ${candidate.act}).`,
        );
      }
    }
    if (prePatchIssues.some((issue) => issue.type === "missing_suspect_closure_scene")) {
      const allRefs = flattenNarrativeScenes(narrative);
      const act3Scenes = allRefs.filter((r) => r.act === 3);
      const candidate = act3Scenes.at(-2) ?? act3Scenes.at(-1) ?? allRefs.at(-1);
      if (candidate?.scene) {
        const patch =
          `Suspects are systematically cleared: alibi confirmed for ${ruledOutPhrase}, ruled out by` +
          ` timeline evidence, leaving only the culprit identified by a complete evidence chain.`;
        candidate.scene.purpose = [candidate.scene.purpose ?? "", patch].filter(Boolean).join(" ");
        coveragePatched = true; // A_53 P10: a purpose changed → final coverage scan must re-run.
        ctx.warnings.push(
          `Outline suspect-closure vocabulary patch applied deterministically to` +
          ` scene ${candidate.sceneNumber} (act ${candidate.act}).`,
        );
      }
    }
  }

  // SWEEP B: for the 10-chapter Golden Age format, verify the named beat arc appears in order.
  // Non-blocking (warnings) so legacy/medium/long outlines are unaffected; surfaces drift for triage.
  {
    const flatScenes = (narrative.acts ?? []).flatMap((act: any) =>
      Array.isArray(act.scenes) ? act.scenes : [],
    );
    if (flatScenes.length === GOLDEN_AGE_BEATS.length) {
      const actualBeats = flatScenes.map((s: any) => String(s?.beat ?? "").trim());
      const missing = actualBeats.filter((b: string) => !b).length;
      if (missing > 0) {
        ctx.warnings.push(`Beat arc: ${missing} of ${GOLDEN_AGE_BEATS.length} chapters have no "beat" assigned.`);
      }
      GOLDEN_AGE_BEATS.forEach((expected, i) => {
        if (actualBeats[i] && actualBeats[i] !== expected) {
          ctx.warnings.push(
            `Beat arc: chapter ${i + 1} beat is "${actualBeats[i]}", expected "${expected}" (Golden Age order).`,
          );
        }
      });
    }
  }

  // A_67 review fix (missing-coercion on retry paths): normalise the FINAL outline once, regardless of
  // which retry/remediation path produced it. The narrative-replacing retries (scene-count / coverage /
  // pacing / pre-commit remediation) assign a fresh formatNarrative() result WITHOUT re-running beat
  // coercion or field hoisting, so an uncoerced synonym beat (e.g. "resolution" → "revelation") could
  // reach Agent 9 and misfire the aftermath-chapter stage-mode (permitting a duplicate reveal). Both
  // passes are idempotent — a no-op when the first attempt already passed through them.
  const finalCoercion = coerceNarrativeSceneBeats(narrative);
  const finalHoist = hoistMisplacedSceneFields(narrative);
  recordAgent7Coercion(ctx, {
    beatsCoerced: finalCoercion.coerced,
    beatsDropped: finalCoercion.dropped,
    fieldsHoisted: finalHoist.hoisted,
  });

  // R4 step 4 (architecture/REVIEW_01.md) — emit the counters ONCE per run, at the point the outline is
  // final. These counts ARE the evidence for S7: the coercion layer can only be deleted per agent
  // where a structured-output arm drives its counters to zero across real runs. Without them, "the
  // schema made coercion redundant" is an assertion, and this codebase has been wrong about exactly
  // that kind of assertion before ("(common)" on a lever that fired 0/18).
  emitAgent7CoercionTelemetry(ctx);

  ctx.narrative = narrative;
  // A_53 P10 (outline-coverage-evaluated-thrice): reuse the deterministic-patch scan; only the
  // coverage patch above (and SWEEP B, which touches no coverage field) runs between it and here,
  // so re-scan only when a patch actually rewrote a scene purpose.
  ctx.outlineCoverageIssues = coveragePatched
    ? evaluateOutlineCoverage(narrative, ctx.cml!)
    : finalCoverageIssues;

  // A_53 P10 (scheduler-grid-rebuilt-twice-per-run): build the scheduler grid cache ONCE and share it
  // across the shadow log and the clue-job authority stamp, so the grid is not rebuilt when both run.
  const schedulerGridCache = makeAgent7GridCache(ctx);

  // Shadow only (default off): log the deterministic Beat Scheduler grid next to this outline.
  runAgent7SchedulerShadow(ctx, narrative, schedulerGridCache);

  // P1.3 (default off): when the scheduler is authoritative, stamp pacing-shaped per-scene budgets.
  applyAgent7SchedulerAuthority(ctx, narrative, schedulerGridCache);

  // A_52 item 4 (default on): stamp the mechanism-reveal gate so the prose withholds the HOW until the
  // discriminating test — independent of scheduler authority, which kept it dark on normal runs.
  applyMechanismRevealGate(ctx, narrative);

  // A_55 #5 (default on): guarantee the discriminating-test scene references ≥1 of its evidence clues
  // (additive only) so the Agent-9 G4 detector's "no DT evidence clue scheduled in the outline" gap
  // cannot arise from the LLM omitting it. Runs after coverage so it sees the final clue placement.
  ensureDiscriminatingTestEvidencePresent(ctx, narrative);
  ensureDiscoverySceneMethodTellPresent(ctx, narrative);
  // A_64 §3.3 C1 (flag-gated, default OFF): plant essential clues ≥2 scenes before their reveal.
  // Runs LAST so it sees the final clue placement (incl. the discovery-tell addition above).
  applyPlantBeforeReveal(ctx, narrative);
  // X52 (REVIEW_11 §8.2): and the decisive culprit-implicating trace, which `essential` did not cover.
  // After the pass above so it sees what that one already planted and never double-stamps.
  applyDecisiveTracePlant(ctx, narrative);
}
