/**
 * Agent 7 scheduler — job authority (T1.2 / P1.3, hardened in A_53 P8).
 *
 * The deterministic Beat Scheduler grid assigns every reveal obligation to exactly one slot
 * (proven by `checkComplete`). Promoting that grid from shadow to authoritative means each
 * outline scene takes its revealed-clue list from the aligned grid slot, so a clue is dramatized
 * in a single chapter instead of being re-revealed across adjacent ones — the dominant pacing
 * smear ("one timeline contradiction restated every chapter").
 *
 * A_53 P8 hardening:
 *  - `grid-cluejob-positional-misalignment`: align slot→scene by (act, act-scene-number), NOT raw
 *    array index, so a tolerated act-boundary difference can't land an Act-1 clue in Act-2. When the
 *    per-act counts differ the stamp falls back to the LLM distribution (returns `fellBack`).
 *  - `gridcluejob-empties-noncovered-scenes`: the stamp is ADDITIVE — it unions the grid's clue jobs
 *    with each scene's existing `cluesRevealed` and globally de-dupes (first scene wins), instead of
 *    overwriting every scene (which deleted the LLM-assigned clues of the ~40% intentionally-empty
 *    slots and could leave a clue anchored in zero scenes).
 *
 * This module holds the pure mapping so it can be unit-tested without the worker/orchestrator.
 */

export interface GridClueJobResult {
  /** Number of scenes whose `cluesRevealed` was reconciled against the grid. */
  stamped: number;
  /** Duplicate clue reveals removed by the global first-wins filter. */
  dedupRemoved: number;
  /** True when alignment fell back to the LLM distribution (per-act counts differed); no stamping done. */
  fellBack: boolean;
}

export interface SceneJobCell {
  act?: number;
  sceneNumber?: number;
  cluesRevealed?: unknown;
}

export interface GridSlotCell {
  act?: number;
  sceneNumber?: number;
  cluesRevealed?: readonly unknown[];
}

/** Ordered indices of `items` grouped by act, each group sorted by sceneNumber (stable on ties). */
const groupByActOrdered = <T extends { act?: number; sceneNumber?: number }>(
  items: ReadonlyArray<T>,
): Map<number, Array<{ index: number; item: T }>> => {
  const byAct = new Map<number, Array<{ index: number; item: T }>>();
  items.forEach((item, index) => {
    const act = Number(item.act);
    if (!byAct.has(act)) byAct.set(act, []);
    byAct.get(act)!.push({ index, item });
  });
  for (const group of byAct.values()) {
    group.sort((a, b) => (Number(a.item.sceneNumber) || 0) - (Number(b.item.sceneNumber) || 0));
  }
  return byAct;
};

/**
 * Reconcile the grid's once-each clue jobs into the outline scenes.
 *
 * Slot→scene alignment is by (act, act-scene-number) when both sides carry act info, else by raw
 * array index (legacy/tests). The stamp is ADDITIVE: each scene keeps its existing `cluesRevealed`
 * and gains the aligned slot's clues; a global first-wins filter guarantees no clue id is revealed in
 * more than one scene. Mutates each scene's `cluesRevealed` in place.
 */
export function applyGridClueJobs(
  scenes: SceneJobCell[],
  slots: ReadonlyArray<GridSlotCell>,
): GridClueJobResult {
  // Build the per-scene slot mapping.
  const slotForScene = new Map<number, GridSlotCell>();
  const haveActInfo =
    scenes.length > 0 &&
    scenes.every((s) => typeof s.act === "number") &&
    slots.every((s) => typeof s.act === "number");

  if (haveActInfo) {
    const byActScenes = groupByActOrdered(scenes);
    const byActSlots = groupByActOrdered(slots);
    const acts = new Set<number>([...byActScenes.keys(), ...byActSlots.keys()]);
    for (const act of acts) {
      const sceneGroup = byActScenes.get(act) ?? [];
      const slotGroup = byActSlots.get(act) ?? [];
      if (sceneGroup.length !== slotGroup.length) {
        // A_53 P8: per-act counts differ (act boundaries shifted beyond tolerance) — do NOT stamp;
        // keep the LLM distribution rather than mis-anchoring clues across an act boundary.
        return { stamped: 0, dedupRemoved: 0, fellBack: true };
      }
      for (let k = 0; k < sceneGroup.length; k += 1) {
        slotForScene.set(sceneGroup[k].index, slotGroup[k].item);
      }
    }
  } else {
    scenes.forEach((_scene, i) => {
      if (slots[i]) slotForScene.set(i, slots[i]);
    });
  }

  // Additive union + global first-wins dedup. Existing scene clues come first (preserved); the grid's
  // clues are added; a clue already claimed by an earlier scene is removed here (one reveal per clue).
  const seen = new Set<string>();
  let stamped = 0;
  let dedupRemoved = 0;

  scenes.forEach((scene, i) => {
    const existing = Array.isArray(scene.cluesRevealed) ? scene.cluesRevealed : [];
    const slot = slotForScene.get(i);
    const gridClues = slot && Array.isArray(slot.cluesRevealed) ? slot.cluesRevealed : [];
    const merged: string[] = [];
    for (const raw of [...existing, ...gridClues]) {
      const id = typeof raw === "string" ? raw.trim() : "";
      if (!id) continue;
      if (seen.has(id)) {
        dedupRemoved++;
        continue;
      }
      seen.add(id);
      merged.push(id);
    }
    scene.cluesRevealed = merged;
    stamped++;
  });

  return { stamped, dedupRemoved, fellBack: false };
}
