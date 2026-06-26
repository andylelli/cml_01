/**
 * Agent 3 — discriminating-evidence planting check (A_50 §9.3, fix #2).
 *
 * The fair-play contract requires that every clue the discriminating test / reveal leans on was
 * shown to the reader BEFORE the reveal. The probe `mystery-1782504792424` violated this: the
 * reveal pinned the culprit on "mechanical knowledge" + "dining logs" that no earlier chapter
 * planted, so the judge flagged "the reveal uses evidence not planted earlier" (fair-play 70/100).
 *
 * `discriminating_test.evidence_clues` already must appear in `prose_requirements.clue_to_scene_mapping`
 * (an existing prompt rule), but nothing enforces they are placed BEFORE the
 * `discriminating_test_scene`. This pure detector finds the gap so it can be surfaced as a non-fatal
 * warning (and, later, gated). It never mutates or throws.
 */

const sceneOrderKey = (actNumber: unknown, sceneNumber: unknown): number => {
  const act = Number(actNumber);
  const scene = Number(sceneNumber);
  return (Number.isFinite(act) ? act : 0) * 100 + (Number.isFinite(scene) ? scene : 0);
};

export interface UnplantedDiscriminatingClues {
  /** evidence_clue IDs not mapped to any scene strictly before the discriminating-test scene. */
  unplanted: string[];
  /** clue IDs referenced by the test but absent from clue_to_scene_mapping entirely. */
  unmapped: string[];
  /** scene-order key of the discriminating-test scene, or null when it isn't specified. */
  testSceneKey: number | null;
}

/**
 * Returns the discriminating-test evidence clues that are NOT planted before the reveal — either
 * unmapped (no scene at all) or mapped at/after the discriminating-test scene. Empty result = every
 * piece of proof the reveal uses is planted earlier (the fair-play guarantee).
 */
export function findUnplantedDiscriminatingClues(caseInput: any): UnplantedDiscriminatingClues {
  const caseBlock = caseInput?.CASE ?? caseInput ?? {};
  const evidenceClues: string[] = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues.map((x: unknown) => String(x ?? "").trim()).filter(Boolean)
    : [];

  const testScene = caseBlock?.prose_requirements?.discriminating_test_scene;
  const testSceneKey =
    testScene && (testScene.act_number !== undefined || testScene.scene_number !== undefined)
      ? sceneOrderKey(testScene.act_number, testScene.scene_number)
      : null;

  const placement = new Map<string, number>();
  const mapping: any[] = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (const entry of mapping) {
    const id = String(entry?.clue_id ?? "").trim();
    if (id) placement.set(id, sceneOrderKey(entry?.act_number, entry?.scene_number));
  }

  const unplanted: string[] = [];
  const unmapped: string[] = [];
  for (const clue of evidenceClues) {
    if (!placement.has(clue)) {
      unmapped.push(clue);
      unplanted.push(clue);
      continue;
    }
    if (testSceneKey !== null && placement.get(clue)! >= testSceneKey) {
      unplanted.push(clue);
    }
  }

  return { unplanted, unmapped, testSceneKey };
}
