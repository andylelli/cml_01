/**
 * WHO OWNS EACH SUSPECT CLEARANCE — resolved ONCE, for the whole book.
 *
 * ── THE DEFECT THIS EXISTS TO FIX ────────────────────────────────────────────────────────────────
 *
 * An external reader has made the same complaint on three manuscripts: the last two chapters both
 * walk the innocent suspects and re-clear them. *"Chapter 10 does not reveal the culprit. It
 * re-clears Beatrice, Sylvia, and Hugo almost line by line."*
 *
 * It is not the model's choice. WE ORDER IT, in every one of the last three chapters, and then
 * regenerate any chapter that omits it. Measured over 557 prose prompts in `llm-prompts-full.jsonl`:
 * 172 carry `SUSPECT CLEARANCE REQUIRED (MANDATORY)`, distributed to ch8 (37), ch9 (74) and ch10
 * (61) — and never to chapters 1–7. On the complained-about run the BYTE-IDENTICAL suspect list went
 * to Ch8, Ch9 and Ch10, while Ch10's prompt simultaneously carried the aftermath contract forbidding
 * per-suspect recitation. Three prohibitions were added over three attempts; none could win, because
 * a prohibition cannot beat a lint gate that regenerates the chapter until the roll-call is present.
 *
 * ── WHY EXCLUSIVITY KEPT FAILING ─────────────────────────────────────────────────────────────────
 *
 * `obligation-block.ts` already tries to be exclusive: it prefers scenes that EXACTLY match the CML
 * clearance ref and only falls back to keywords otherwise. That exact match never happens.
 *
 *     MEASURED, 29 books with clearance refs and an outline:
 *       clearance refs that match an outline scene : 1 of 116   (1%)
 *       books where ANY ref matches                : 1 of 29    (3%)
 *
 * The CML says act 3 / scene 5; the outline's act 3 holds scenes 8, 9, 10. Agent 3 writes
 * coordinates against a nominal ~6-scene story and Agent 7 emits ten. **The two numbering schemes
 * are incompatible by construction**, so the exact-match branch is dead code in practice and every
 * book falls through to `/\b(clear|cleared|clearance|alibi|ruled out|eliminat)/i` — which matches
 * any late chapter whose title or summary mentions clearing. A chapter called "Clearing the
 * Innocent" matches. So does the finale that mentions an alibi in passing.
 *
 * An ownership latch alone would not have fixed this: it would have latched onto coordinates that
 * resolve to nothing. **The numbering has to be reconciled first**, which is what this module does.
 *
 * ── HOW IT RESOLVES ──────────────────────────────────────────────────────────────────────────────
 *
 * By ORDINAL POSITION WITHIN THE ACT, which is the one thing both schemes agree on. If the CML puts
 * a clearance at the 1st scene of act 3 and the reveal at the 2nd, those map to the 1st and 2nd
 * outline scenes of act 3 — whatever either side chose to number them. It degrades gracefully when
 * an act has fewer outline scenes than CML refs, and it never invents an owner.
 *
 * Then two invariants that the previous code could not express:
 *
 *   1. ONE OWNER PER SUSPECT. A suspect cleared in the owning chapter is never ordered cleared again.
 *   2. THE FINAL CHAPTER CAN NEVER OWN A CLEARANCE, as long as any earlier chapter is eligible. The
 *      finale is the aftermath of the reveal; making it argue the case is the defect itself.
 *
 * ── WHY THE SECOND INVARIANT IS SAFE ─────────────────────────────────────────────────────────────
 *
 * Suspect closure is validated over the WHOLE manuscript, not per chapter
 * (`suspect-closure-validator.ts:111`, `story.scenes.some(...)`) — one satisfying chapter anywhere
 * retires a suspect for the run. Verified against 28 stored manuscripts: 22 still pass the closure
 * validator with BOTH final chapters deleted. Moving ownership earlier therefore cannot introduce a
 * `suspect_closure_missing` run-killer.
 */

export interface ClearanceOwnershipEntry {
  /** The suspect as named in the CML. */
  suspectName: string;
  /** The outline `sceneNumber` that owns this clearance, or null when nothing is eligible. */
  ownerSceneNumber: number | null;
  /** Why it landed there — surfaced in run warnings so a bad resolution is never silent. */
  reason: string;
}

export interface ClearanceOwnership {
  entries: ClearanceOwnershipEntry[];
  /** Fast lookup: outline sceneNumber -> the suspects that chapter owns. */
  suspectsByScene: Map<number, string[]>;
  /** Scene numbers that may never own a clearance. */
  vetoed: Set<number>;
  notes: string[];
}

const norm = (value: unknown): string => String(value ?? "").trim();

/** Outline scenes grouped by act, each act ordered by its own scene numbering. */
const actIndex = (allOutlineScenes: readonly any[]): Map<number, any[]> => {
  const byAct = new Map<number, any[]>();
  for (const scene of allOutlineScenes ?? []) {
    const act = Number(scene?.act);
    if (!Number.isFinite(act)) continue;
    if (!byAct.has(act)) byAct.set(act, []);
    byAct.get(act)!.push(scene);
  }
  for (const scenes of byAct.values()) {
    scenes.sort((a, b) => Number(a?.sceneNumber ?? 0) - Number(b?.sceneNumber ?? 0));
  }
  return byAct;
};

/**
 * Resolve, once, which chapter owns each suspect clearance.
 *
 * `clearanceScenes` is `CASE.prose_requirements.suspect_clearance_scenes`.
 * `allOutlineScenes` is the flattened outline, each carrying `act` and `sceneNumber`.
 */
export const resolveClearanceOwnership = (args: {
  clearanceScenes: readonly any[];
  allOutlineScenes: readonly any[];
  /** Excluded from ownership entirely — victims and the culprit are resolved by the caller. */
  excludeSuspects?: readonly string[];
}): ClearanceOwnership => {
  const { clearanceScenes = [], allOutlineScenes = [] } = args;
  const notes: string[] = [];
  const vetoed = new Set<number>();
  const suspectsByScene = new Map<number, string[]>();
  const entries: ClearanceOwnershipEntry[] = [];

  const excluded = new Set(
    (args.excludeSuspects ?? []).map((n) => norm(n).toLowerCase()).filter(Boolean),
  );

  const byAct = actIndex(allOutlineScenes);
  const allSorted = [...(allOutlineScenes ?? [])]
    .filter((s) => Number.isFinite(Number(s?.sceneNumber)))
    .sort((a, b) => Number(a.sceneNumber) - Number(b.sceneNumber));

  // INVARIANT 2, computed first so every resolution below can respect it. The final chapter is
  // vetoed only when something earlier could hold the clearance instead — a one-chapter book has no
  // alternative and coverage outranks tidiness.
  const finalScene = allSorted[allSorted.length - 1];
  if (finalScene && allSorted.length > 1) {
    vetoed.add(Number(finalScene.sceneNumber));
    notes.push(
      `final chapter (scene ${finalScene.sceneNumber}) vetoed as a clearance owner — it is the aftermath of the reveal`,
    );
  }

  /** CML refs grouped by act, so ordinal position can be computed per act. */
  const refsByAct = new Map<number, any[]>();
  for (const ref of clearanceScenes) {
    const act = Number(ref?.act_number);
    if (!Number.isFinite(act)) continue;
    if (!refsByAct.has(act)) refsByAct.set(act, []);
    refsByAct.get(act)!.push(ref);
  }
  for (const refs of refsByAct.values()) {
    refs.sort((a, b) => Number(a?.scene_number ?? 0) - Number(b?.scene_number ?? 0));
  }

  for (const [act, refs] of refsByAct) {
    const outlineScenes = byAct.get(act) ?? [];
    // Distinct CML scene numbers in this act, in order — position in THIS list is the ordinal.
    const cmlSceneNumbers = [...new Set(refs.map((r) => Number(r?.scene_number ?? 0)))].sort((a, b) => a - b);

    for (const ref of refs) {
      const suspectName = norm(ref?.suspect_name ?? ref?.suspect);
      if (!suspectName) continue;
      if (excluded.has(suspectName.toLowerCase())) {
        entries.push({ suspectName, ownerSceneNumber: null, reason: "excluded (victim, culprit or detective)" });
        continue;
      }
      // One owner per suspect: a later ref for the same suspect never reassigns them.
      if (entries.some((e) => e.suspectName.toLowerCase() === suspectName.toLowerCase() && e.ownerSceneNumber !== null)) {
        entries.push({ suspectName, ownerSceneNumber: null, reason: "already owned by an earlier chapter" });
        continue;
      }

      const ordinal = cmlSceneNumbers.indexOf(Number(ref?.scene_number ?? 0));
      let owner = ordinal >= 0 ? outlineScenes[ordinal] : undefined;
      let reason = `act ${act} ordinal ${ordinal + 1}`;

      /**
       * PREFER THE CHAPTER THAT SAYS IT CLEARS.
       *
       * Ordinal position honours the CML, but the OUTLINE is what the writer reads. On the
       * complained-about book the ordinal lands on ch8 "The Final Trap" while ch9 is titled
       * "Clearing the Innocent" — obligating ch8 would leave a chapter promising a clearing with no
       * clearance to give, and the chapter that does have one saying something else. That is the
       * same class of contradiction this module exists to remove, just pointed the other way.
       *
       * So an eligible chapter that explicitly signals clearing outranks the ordinal. The keyword is
       * the same one the old resolver used — the difference is that here it SELECTS ONE owner rather
       * than granting the obligation to every chapter it matches, which is what made it a defect.
       */
      const SIGNAL = /\b(clear|cleared|clearance|exonerat|ruled out|eliminat|innocent)/i;
      const signalled = outlineScenes.filter(
        (candidate) => !vetoed.has(Number(candidate.sceneNumber))
          && SIGNAL.test(`${norm(candidate?.title)} ${norm(candidate?.summary)}`),
      );
      if (signalled.length > 0) {
        owner = signalled[0];
        reason = `act ${act} — chapter signals clearing in its title or summary`;
      }

      // Walk backwards off a vetoed or missing target rather than forwards — moving a clearance
      // EARLIER is always safe (closure is validated over the whole manuscript), moving it later
      // walks toward the finale, which is the defect.
      if (!owner || vetoed.has(Number(owner.sceneNumber))) {
        const eligible = outlineScenes.filter((s) => !vetoed.has(Number(s.sceneNumber)));
        owner = eligible[eligible.length - 1];
        reason = owner
          ? `act ${act} ordinal ${ordinal + 1} was vetoed or absent — moved back to the last eligible chapter in the act`
          : `no eligible chapter in act ${act}`;
      }

      const ownerSceneNumber = owner ? Number(owner.sceneNumber) : null;
      entries.push({ suspectName, ownerSceneNumber, reason });
      if (ownerSceneNumber !== null) {
        if (!suspectsByScene.has(ownerSceneNumber)) suspectsByScene.set(ownerSceneNumber, []);
        suspectsByScene.get(ownerSceneNumber)!.push(suspectName);
      }
    }
  }

  if (entries.length > 0 && suspectsByScene.size === 0) {
    notes.push("no chapter could own any clearance — callers must fall back to existing behaviour");
  }

  return { entries, suspectsByScene, vetoed, notes };
};

/** Read at CALL time, never frozen into a module const (ADR-0004). */
export const isClearanceOwnershipEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(env.AGENT9_CLEARANCE_OWNERSHIP ?? "");
