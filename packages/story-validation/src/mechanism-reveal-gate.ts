/**
 * Agent 7 scheduler — mechanism-reveal gate (A_50 §9.3 fix #3).
 *
 * The full concealment-mechanism explanation ("the clock was made to lie") must land AT the
 * discriminating-test scene, not in Act 1. The probe `mystery-1782504792424` telegraphed it in
 * Ch1–2 and resolved it by Ch7 while the test sat in Ch8 — so nothing was left for the test to
 * reveal (judge: "the clock mechanism is explained too early, reducing suspense"). The job
 * scheduler (T1.2) places clue *reveals* but not the mechanism *explanation* beat, so this is its
 * blind spot.
 *
 * This pure module marks each scene before the discriminating-test scene as "withhold the full
 * mechanism" so the authoritative scheduler can stamp it and the prose prompt can honor it. It is
 * best-effort: a no-op when the test scene can't be located, and it never throws.
 */

export interface SceneActRef {
  act: number;
  actSceneNumber: number;
}

export interface DiscriminatingScenePosition {
  act_number?: unknown;
  scene_number?: unknown;
}

/**
 * Global index (0-based, narrative order) of the scene matching the CML discriminating_test_scene,
 * or -1 if it can't be located. `scenes` must be in narrative order. Falls back to the first scene
 * of the test act when the exact scene number is missing or out of range.
 */
export function resolveDiscriminatingSceneIndex(
  scenes: ReadonlyArray<SceneActRef>,
  testScene: DiscriminatingScenePosition | undefined | null,
): number {
  if (!testScene) return -1;
  const act = Number(testScene.act_number);
  const scene = Number(testScene.scene_number);
  if (!Number.isFinite(act)) return -1;
  if (Number.isFinite(scene)) {
    const exact = scenes.findIndex((s) => s.act === act && s.actSceneNumber === scene);
    if (exact >= 0) return exact;
  }
  return scenes.findIndex((s) => s.act === act);
}

export interface MechanismRevealGateResult {
  /** Scenes marked withhold (mechanismRevealAllowed=false). */
  withheld: number;
  /** Threshold index used (first scene allowed to reveal), or -1 when ungated. */
  thresholdIndex: number;
}

interface MechanismGateCell {
  mechanismRevealAllowed?: boolean;
}

/**
 * Stamp `mechanismRevealAllowed` on each scene: false before `thresholdIndex`, true at/after it
 * (the discriminating test is where the mechanism is explained). `thresholdIndex < 0` ⇒ no-op
 * (leave the field unset; the prose prompt then imposes no gate). Mutates each scene in place.
 */
export function stampMechanismRevealGate(
  scenes: MechanismGateCell[],
  thresholdIndex: number,
): MechanismRevealGateResult {
  if (thresholdIndex < 0) return { withheld: 0, thresholdIndex: -1 };
  let withheld = 0;
  scenes.forEach((scene, i) => {
    const allowed = i >= thresholdIndex;
    scene.mechanismRevealAllowed = allowed;
    if (!allowed) withheld++;
  });
  return { withheld, thresholdIndex };
}
