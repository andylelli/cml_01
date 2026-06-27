/**
 * Agent 7 scheduler — job authority (T1.2 / P1.3).
 *
 * The deterministic Beat Scheduler grid assigns every reveal obligation to exactly one slot
 * (proven by `checkComplete`). Promoting that grid from shadow to authoritative means each
 * outline scene takes its revealed-clue list from the aligned grid slot, so a clue is dramatized
 * in a single chapter instead of being re-revealed across adjacent ones — the dominant pacing
 * smear ("one timeline contradiction restated every chapter").
 *
 * This module holds the pure mapping so it can be unit-tested without the worker/orchestrator.
 */

export interface GridClueJobResult {
  /** Number of scenes whose `cluesRevealed` was (re)written from the grid. */
  stamped: number;
  /** Duplicate clue reveals removed by the global first-wins filter. */
  dedupRemoved: number;
}

interface SceneCluesCell {
  cluesRevealed?: unknown;
}

interface GridSlotCell {
  cluesRevealed?: readonly unknown[];
}

/**
 * Stamp the grid's once-each clue jobs onto the outline scenes, in narrative order.
 *
 * Each scene `i` takes `slots[i].cluesRevealed`. A global first-wins filter guarantees no clue id
 * is revealed in more than one scene even if the grid ever changes. Blank/non-string ids are
 * dropped. Scenes with no aligned slot are emptied. Mutates each scene's `cluesRevealed` in place.
 */
export function applyGridClueJobs(
  scenes: SceneCluesCell[],
  slots: ReadonlyArray<GridSlotCell>,
): GridClueJobResult {
  const seen = new Set<string>();
  let stamped = 0;
  let dedupRemoved = 0;

  scenes.forEach((scene, i) => {
    const slot = slots[i];
    const source = slot && Array.isArray(slot.cluesRevealed) ? slot.cluesRevealed : [];
    const authoritative: string[] = [];
    for (const raw of source) {
      const id = typeof raw === "string" ? raw.trim() : "";
      if (!id) continue;
      if (seen.has(id)) {
        dedupRemoved++;
        continue;
      }
      seen.add(id);
      authoritative.push(id);
    }
    scene.cluesRevealed = authoritative;
    stamped++;
  });

  return { stamped, dedupRemoved };
}
