import { resolveSceneRef, type SceneRefPath } from "./clue-validation.js";

/**
 * A_87 P7 — RECONCILE THE CML SCENE REFS AGAINST THE OUTLINE THAT ACTUALLY EXISTS.
 *
 * Agent 3 runs BEFORE Agent 7, so every `act_number` / `scene_number` it emits is a forward
 * reference into a scene namespace that has not been created yet. No prompt wording can make the
 * model guess Agent 7's numbering, and it does not: the archive holds ONE distinct reveal coordinate
 * across all 45 runs (`act3/sc6`, the prompt's own worked example), which resolves 0/45.
 *
 * P4's arbitration recovers the reveal CONTRACT semantically, but it cannot help the consumers that
 * read the raw coordinate arithmetic. MEASURED over the 45 archived pairs: `isPostRevealChapter`
 * (obligation-block) is false for every chapter of every run, so the post-reveal naming constraint —
 * the one that stops the prose swapping the culprit's name for a role alias once they are named —
 * has never fired in the life of the project.
 *
 * This pass runs once the outline is final and rewrites the two refs to real coordinates. It is
 * deliberately NARROW:
 *   - `suspect_clearance_scenes` is NOT touched. `clearance-ownership.ts` already reconciles those
 *     by ordinal-within-act (A_76 §14); a second writer for the same field is how two components
 *     that compute the same set start disagreeing (WF-002).
 *   - `clue_to_scene_mapping` is NOT touched. It already resolves at 87% — it carries real indices.
 *
 * The reveal winner uses the SAME precedence as the P4c arbitration in obligation-block, so once a
 * ref is reconciled that arbitration takes its `byCoordinate` branch and selects the identical scene.
 * `a87-scene-ref-reconcile.test.ts` asserts that agreement across all 45 archived pairs.
 */

const DT_SIGNAL_RE = /\b(discriminating|test|controlled comparison|trap|prove|disprove)/i;
const REVEAL_SIGNAL_RE = /\b(culprit|confront|confession|resolve|resolution|denouement|case\s+closed)/i;

export const isSceneRefReconcileEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT7_SCENE_REF_RECONCILE ?? "").trim());

export interface SceneRefReconcileResult {
  /** `kind act/scene -> act/scene` for each ref rewritten. */
  rewritten: string[];
  /** Refs left alone because they already resolved by coordinate. */
  alreadyExact: string[];
  /** Refs no rule could place; left untouched rather than guessed. */
  unplaced: string[];
}

const beatOf = (scene: any): string => String(scene?.beat ?? "").trim().toLowerCase();

/** Does the DT ref still claim this scene, under the same rules obligation-block applies? */
const dtClaims = (candidate: any, dtRef: any, scenes: any[], dtHasExactMatch: boolean): boolean => {
  if (!dtRef) return false;
  const path: SceneRefPath = dtHasExactMatch
    ? resolveSceneRef(candidate, dtRef, scenes)
    : resolveSceneRef(candidate, dtRef, scenes, DT_SIGNAL_RE);
  if (path === "none") return false;
  // The keyword path yields to a revelation beat — P4's rule, mirrored so the two cannot disagree.
  return !(path === "signal" && beatOf(candidate) === "revelation");
};

/**
 * The reveal scene, by the same precedence the P4c arbitration uses: a resolved coordinate wins
 * outright, then the LAST keyword claimant the DT does not hold, then the LAST `revelation`-beat
 * scene the DT does not hold. MEASURED: the last `revelation`-beat scene is the final scene of the
 * book in 44 of 45 archived outlines.
 */
export const selectRevealScene = (cmlCase: any, scenes: any[]): any | null => {
  const pr = cmlCase?.prose_requirements ?? cmlCase?.CASE?.prose_requirements ?? {};
  const revealRef = pr.culprit_revelation_scene ?? null;
  if (!revealRef || !Array.isArray(scenes) || scenes.length === 0) return null;
  const dtRef = pr.discriminating_test_scene ?? null;
  const dtHasExactMatch = Boolean(dtRef && scenes.some((s) => resolveSceneRef(s, dtRef, scenes) !== "none"));
  const pathOf = (c: any): SceneRefPath => resolveSceneRef(c, revealRef, scenes, REVEAL_SIGNAL_RE);

  const byCoordinate = scenes.filter((c) => {
    const path = pathOf(c);
    return path === "exact" || path === "global-scene";
  });
  if (byCoordinate.length > 0) return byCoordinate[byCoordinate.length - 1];

  const freeKeyword = scenes.filter(
    (c) => pathOf(c) === "signal" && !dtClaims(c, dtRef, scenes, dtHasExactMatch),
  );
  if (freeKeyword.length > 0) return freeKeyword[freeKeyword.length - 1];

  const freeRevelationBeats = scenes.filter(
    (c) => beatOf(c) === "revelation" && !dtClaims(c, dtRef, scenes, dtHasExactMatch),
  );
  return freeRevelationBeats[freeRevelationBeats.length - 1] ?? null;
};

/**
 * The discriminating-test scene: a resolved coordinate wins, then the LAST scene BEFORE the reveal
 * whose beat is `final_trap`, then the last pre-reveal scene matching the DT keyword. Constrained to
 * sit before the reveal because a test after the answer is not a test.
 */
export const selectDiscriminatingTestScene = (cmlCase: any, scenes: any[], revealScene: any | null): any | null => {
  const pr = cmlCase?.prose_requirements ?? cmlCase?.CASE?.prose_requirements ?? {};
  const dtRef = pr.discriminating_test_scene ?? null;
  if (!dtRef || !Array.isArray(scenes) || scenes.length === 0) return null;
  const exact = scenes.filter((c) => resolveSceneRef(c, dtRef, scenes) !== "none");
  if (exact.length > 0) return exact[exact.length - 1];

  const revealNumber = revealScene ? Number(revealScene.sceneNumber) : Number.POSITIVE_INFINITY;
  const before = scenes.filter((c) => Number(c?.sceneNumber) < revealNumber);
  const trapBeats = before.filter((c) => beatOf(c) === "final_trap");
  if (trapBeats.length > 0) return trapBeats[trapBeats.length - 1];

  const keyword = before.filter((c) =>
    DT_SIGNAL_RE.test(`${String(c?.purpose ?? "")} ${String(c?.summary ?? "")} ${String(c?.title ?? "")}`.toLowerCase()),
  );
  return keyword[keyword.length - 1] ?? null;
};

/** Rewrite the two refs in place. Returns what changed; never throws. */
export const reconcileCmlSceneRefs = (cmlCase: any, scenes: any[]): SceneRefReconcileResult => {
  const result: SceneRefReconcileResult = { rewritten: [], alreadyExact: [], unplaced: [] };
  const pr = cmlCase?.prose_requirements ?? cmlCase?.CASE?.prose_requirements ?? null;
  if (!pr || !Array.isArray(scenes) || scenes.length === 0) return result;

  const apply = (kind: string, ref: any, target: any | null): void => {
    if (!ref) return;
    const before = `${kind} act${ref.act_number}/sc${ref.scene_number}`;
    if (scenes.some((s) => resolveSceneRef(s, ref, scenes) !== "none")) {
      result.alreadyExact.push(before);
      return;
    }
    if (!target) { result.unplaced.push(before); return; }
    ref.act_number = Number(target.act);
    ref.scene_number = Number(target.sceneNumber);
    result.rewritten.push(`${before} -> act${ref.act_number}/sc${ref.scene_number}`);
  };

  const reveal = selectRevealScene(cmlCase, scenes);
  apply("culprit_revelation_scene", pr.culprit_revelation_scene ?? null, reveal);
  const dt = selectDiscriminatingTestScene(cmlCase, scenes, reveal);
  apply("discriminating_test_scene", pr.discriminating_test_scene ?? null, dt);
  return result;
};
