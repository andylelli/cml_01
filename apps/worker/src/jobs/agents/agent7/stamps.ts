/**
 * Post-commit stamps on the committed outline (mechanism gate, clearances, evidence, discovery tell, plants) and the commit itself.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { GOLDEN_AGE_BEATS } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import { resolveDiscriminatingSceneIndex, stampMechanismRevealGate, stampSuspectClearanceGate } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type OutlineCoverageIssue,
} from "../shared.js";
import { deathMethodSignatureTerms, nameMatcher } from "@cml/story-geometry";
import {
  isAgent7MechanismGateEnabled,
  isDiscoveryTellEnabled,
  isMotivePlantBeforeRevealEnabled,
  isPlantBeforeRevealEnabled,
} from "./flags.js";
import {
  flattenNarrativeScenes,
} from "./scene-refs.js";
import {
  coerceNarrativeSceneBeats,
  emitAgent7CoercionTelemetry,
  hoistMisplacedSceneFields,
  recordAgent7Coercion,
} from "./normalize.js";
import {
  OUTLINE_ELIMINATION_TERMS_RE,
  OUTLINE_EVIDENCE_TERMS_RE,
  evaluateOutlineCoverage,
  sceneClosureText,
} from "./outline-coverage.js";
import {
  applyAgent7SchedulerAuthority,
  makeAgent7GridCache,
  runAgent7SchedulerShadow,
} from "./scheduler.js";

/** RC3.5 — tokens that signal a physical manner of death, used to locate the tell clue Agent 5 planted.
 *
 * WAS a local copy ("kept local to avoid a cross-package import"). It now aliases the canonical body in
 * `@cml/story-geometry`, which needs the same list to check that the method's physical signature is on
 * the page in chapter 1. The lists were identical, so this changed no behaviour — it removed the second
 * body before the two could drift, which is how the DEATH_METHOD_CANON duplication note reads in
 * hindsight rather than in advance. */
const deathMethodTellTokens = deathMethodSignatureTerms;

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
 * DIAGNOSIS-BATCH #2 — a MOTIVE-BEHAVIORAL beat planted before the reveal, on the SAME shape as
 * `applyPlantBeforeReveal` above: additive, stamps the outline, never moves or removes anything the
 * gates already check.
 *
 * MEASURED, twice: the 84/100 read asked for it once ("'You did this for me, didn't you?'... that is
 * a strong human idea, but it arrives too late... plant it earlier with one small moment") and the
 * 78/100 theatre read asked for it again on a different culprit ("Give Kestrel one stronger motive
 * scene with Montague"). Two-for-two makes this a recurring family, not a one-off ask.
 *
 * WHY THIS IS applyPlantBeforeReveal's SHAPE, NOT A NEW MECHANISM. That function plants a CLUE (an
 * object a character sees, unflagged) so its later reveal feels fair-play, not unearned.  This
 * plants a BEHAVIOR (something the culprit does or says, unflagged) so their motive, spoken plainly
 * only at the reveal, feels earned rather than asserted. Same "incidental appearance now, meaning
 * later" logic; the payload is a beat, not a clue id.
 *
 * `motive_seed`/`motiveSeed` is NOT embedded in the stamp or read again here — MOTIVE LOCK
 * (prompt-builder.ts, A_82 P6) already delivers the culprit's actual motive to every chapter's
 * prompt that has a culprit at all, so re-quoting it here would risk the SAME divergence CLAUDE.md's
 * evidence standard warns about (two components describing one motive, able to disagree). This pass
 * only marks WHICH scene owes the beat and WHO it belongs to; Agent 9's obligation block
 * (`obligation-block.ts`) derives the beat's content from the already-delivered motive at prompt
 * time, from one source.
 *
 * The "reveal index" is approximated from the LATEST essential-clue reveal already computed above —
 * not a separate lookup — since the last essential clue necessarily reveals at or immediately before
 * the actual reveal scene, and inventing a second reveal-index computation risks the two disagreeing.
 */
export function applyMotivePlantBeforeReveal(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  if (!isMotivePlantBeforeRevealEnabled()) return;
  try {
    const caseData = (ctx.cml as any)?.CASE ?? ctx.cml;
    const rawCulprits: unknown[] = Array.isArray(caseData?.culpability?.culprits)
      ? caseData.culpability.culprits
      : [];
    const culpritName = rawCulprits.map((n) => String(n ?? "").trim()).filter(Boolean)[0];
    if (!culpritName) return; // no single named culprit — nothing to plant a motive beat FOR

    const clues = (ctx.clues?.clues ?? []) as any[];
    const essential = new Set(
      clues.filter((c) => c?.criticality === "essential").map((c) => String(c?.id ?? "")).filter(Boolean),
    );
    if (essential.size === 0) return;
    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length < 3) return;

    let latestEssentialRevealIdx = -1;
    sceneRefs.forEach((r, i) => {
      const revealed = Array.isArray((r.scene as any)?.cluesRevealed) ? (r.scene as any).cluesRevealed : [];
      if (revealed.map(String).some((id: string) => essential.has(id))) {
        latestEssentialRevealIdx = Math.max(latestEssentialRevealIdx, i);
      }
    });
    if (latestEssentialRevealIdx < 2) return; // reveal too early for "plant it earlier" to apply

    const poolIdxs = sceneRefs.map((_, i) => i).filter((i) => i <= latestEssentialRevealIdx - 2);
    if (poolIdxs.length === 0) return;
    poolIdxs.sort((i, j) => {
      // Prefer a scene with fewer total obligations already stamped on it (clue plants AND any prior
      // motive beat), so the load spreads rather than piling every plant onto scene 1.
      const load = (i: number) => {
        const s = sceneRefs[i].scene as any;
        return (s.cluesPlanted?.length ?? 0) + (s.motiveBeatCulprit ? 1 : 0);
      };
      return load(i) - load(j) || i - j;
    });
    const target = sceneRefs[poolIdxs[0]].scene as any;
    if (target.motiveBeatCulprit) return; // this exact scene already carries a motive beat
    target.motiveBeatCulprit = culpritName;
    ctx.warnings.push(
      `[Agent 7 motive-plant-before-reveal] stamped a motive beat for ${culpritName} on scene ` +
        `${poolIdxs[0] + 1} (reveal window ends scene ${latestEssentialRevealIdx + 1}) (diagnosis-batch #2).`,
    );
  } catch (e) {
    console.warn(`[Agent 7 motive-plant-before-reveal] skipped: ${(e as Error).message}`);
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

/**
 * X32's repair half — fold the duplicate suspect clearances into the one scene that owns them.
 *
 * Gated on `AGENT9_FOLD_SUSPECT_CLEARANCES` (default OFF), read at call time rather than at module
 * load: a module-level const freezes before dotenv and makes the lever unsettable from `.env.local`,
 * which this repo has now shipped twice.
 *
 * Inert unless the outline gives the job to more than one scene, so an outline with a single
 * clearance scene produces byte-identical prompts with the flag on or off.
 */
export function applySuspectClearanceGate(ctx: OrchestratorContext, narrative: NarrativeOutline): void {
  const enabled =
    process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "true" || process.env.AGENT9_FOLD_SUSPECT_CLEARANCES === "1";
  if (!enabled) return;
  try {
    const sceneRefs = flattenNarrativeScenes(narrative);
    if (sceneRefs.length === 0) return;

    const closureIndices: number[] = [];
    sceneRefs.forEach((ref, i) => {
      const text = sceneClosureText(ref.scene);
      if (OUTLINE_ELIMINATION_TERMS_RE.test(text) && OUTLINE_EVIDENCE_TERMS_RE.test(text)) closureIndices.push(i);
    });

    // The reveal, by the outline's own beat first and its act/scene shape second. Both can be absent —
    // `chooseClearanceKeeper` treats -1 as "keep the last", which is the same fold intent without
    // pretending to know where the reveal is.
    let revealIndex = sceneRefs.findIndex((ref) => String((ref.scene as any)?.beat ?? "").trim() === "revelation");
    if (revealIndex < 0) revealIndex = sceneRefs.findIndex((ref) => ref.act === 3 && ref.actSceneNumber === 2);

    const result = stampSuspectClearanceGate(
      sceneRefs.map((r) => r.scene as any),
      { closureIndices, revealIndex },
    );
    if (result.suppressed > 0) {
      const keeper = sceneRefs[result.keeperIndex];
      ctx.warnings.push(
        `[X32] Suspect-clearance fold: ${closureIndices.length} scenes carry the clearance job; ` +
          `kept in scene ${keeper?.sceneNumber ?? "?"} (act ${keeper?.act ?? "?"}), suppressed in ${result.suppressed}.`,
      );
    }
  } catch (e) {
    // Best-effort, exactly like the mechanism gate: a stamping failure must never cost an outline.
    ctx.warnings.push(`[X32] Suspect-clearance fold skipped: ${(e as Error).message}`);
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

export function warnBeatArcDrift(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  {
    const flatScenes = (narrative.acts ?? []).flatMap((act: any) => Array.isArray(act.scenes) ? act.scenes : []
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
            `Beat arc: chapter ${i + 1} beat is "${actualBeats[i]}", expected "${expected}" (Golden Age order).`
          );
        }
      });
    }
  }
}

export function commitAndStampOutline(ctx: OrchestratorContext, narrative: NarrativeOutline, coveragePatched: boolean, finalCoverageIssues: OutlineCoverageIssue[]) {
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

  // X32 (default off, AGENT9_FOLD_SUSPECT_CLEARANCES): fold duplicate suspect clearances into the one
  // scene that owns them. Stamped here, beside the other per-scene gate, so both reach Agent 9 by the
  // same route — and after the final beat coercion above, since the keeper is chosen by beat.
  applySuspectClearanceGate(ctx, narrative);

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
  // DIAGNOSIS-BATCH #2 (flag-gated, default OFF): a motive-behavioral beat, same shape as the clue
  // plant above. After both clue passes so its own load-balancing sees their scene placements too.
  applyMotivePlantBeforeReveal(ctx, narrative);
}
