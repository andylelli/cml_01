/**
 * Scene references over an outline: flattening, act placement, target act counts, scene-count snapshots and floors.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { computeActSceneCounts } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import type { OutlineScene } from "./outline-types.js";

export type SceneRef = {
  scene: OutlineScene;
  act: 1 | 2 | 3;
  sceneNumber: number;
  actSceneNumber: number;
  index: number;
};

type NarrativeSceneCountSnapshot = {
  totalScenes: number;
  perAct: Record<1 | 2 | 3, number>;
};

export function getPlacementForAct(act: 1 | 2 | 3): "early" | "mid" | "late" {
  if (act === 1) return "early";
  if (act === 2) return "mid";
  return "late";
}

export function flattenNarrativeScenes(narrative: NarrativeOutline): SceneRef[] {
  const refs: SceneRef[] = [];
  let globalIndex = 0;
  (narrative.acts ?? []).forEach((actBlock, actIdx: number) => {
    const act = ((actBlock?.actNumber ?? actIdx + 1) as 1 | 2 | 3) || ((actIdx + 1) as 1 | 2 | 3);
    const scenes: OutlineScene[] = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    scenes.forEach((scene, sceneIdx: number) => {
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

export function buildNarrativeSceneCountGuardrails(lock: NarrativeSceneCountSnapshot, reason: string): string[] {
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

export function computeTargetActSceneCounts(expectedTotalScenes: number): Record<1 | 2 | 3, number> {
  const { act1, act2, act3 } = computeActSceneCounts(expectedTotalScenes); // A7-05
  return { 1: act1, 2: act2, 3: act3 };
}
