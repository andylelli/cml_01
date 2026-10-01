/**
 * The scene-count gate: bridge scenes, deterministic rebalance, and the retry ladder.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { adoptOutlineCandidate, recordOutlineCoercions } from "./normalize.js";
import { narrativeInputs } from "./generate.js";
import { computeActSceneCounts } from "@cml/prompts-llm";
import { verifiedFixesEnabled } from "@cml/cml";
import { formatNarrative } from "@cml/prompts-llm";
import type { NarrativeOutline, ClueDistributionResult } from "@cml/prompts-llm";
import { getSceneTarget, getChapterTargetTolerance, getStoryLengthTarget } from "@cml/story-validation";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  captureNarrativeSceneCountSnapshot,
  computeTargetActSceneCounts,
  getPlacementForAct,
} from "./scene-refs.js";
import {
  Agent7Run,
  rescoreNarrative,
} from "./generate.js";

type SceneCountRebalanceResult = {
  changed: boolean;
  summary: string;
};

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

export async function enforceSceneCount(ctx: OrchestratorContext, run: Agent7Run, narrative: NarrativeOutline) {
  {
    const expectedScenes = getSceneTarget(ctx.inputs.targetLength ?? "medium");
    const sceneTolerance = getChapterTargetTolerance();
    // Use act-traversal count, not the LLM-supplied totalScenes field (which can lag).
    const actualSceneCount = (narrative.acts ?? []).flatMap((a: any) => Array.isArray(a.scenes) ? a.scenes : []
    ).length;

    if (Math.abs(actualSceneCount - expectedScenes) > sceneTolerance) {
      // Compute exact act targets using the SAME ratios as buildUserRequest() so the
      // retry message is always consistent with what the prompt already asked for.
      const { act1: actI, act2: actII, act3: actIII } = computeActSceneCounts(expectedScenes); // A7-05

      ctx.warnings.push(
        `Scene count final gate: narrative has ${actualSceneCount} scenes but target is ${expectedScenes} — regenerating.`
      );
      ctx.reportProgress("narrative", `Scene count fix: need ${expectedScenes} scenes, got ${actualSceneCount}`, 80);

      const sceneCountRetryStart = Date.now();
      const sceneCountRetried = await formatNarrative(ctx.client, narrativeInputs(ctx, run, [
        `SCENE COUNT VIOLATION: Your previous outline had ${actualSceneCount} scenes. ` +
        `The target is EXACTLY ${expectedScenes} scenes — no more, no fewer. ` +
        `You MUST generate EXACTLY: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
        `(these are exact counts, not ranges; they add up to ${actI + actII + actIII}). ` +
        `Count your scenes carefully before returning. ` +
        `Each scene is a distinct chapter in the final novel — do not merge or drop scenes.`,
      ]));
      recordOutlineCoercions(ctx, sceneCountRetried); // A7-11
      ctx.agentCosts["agent7_narrative"] =
        sceneCountRetried.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - sceneCountRetryStart);

      const retriedActualCount = (sceneCountRetried.acts ?? []).flatMap((a: any) => Array.isArray(a.scenes) ? a.scenes : []
      ).length;

      if (Math.abs(retriedActualCount - expectedScenes) <= sceneTolerance) {
        if (verifiedFixesEnabled()) adoptOutlineCandidate(ctx, sceneCountRetried, "scene-count"); // A7-02 (owner decision 12, CML_VERIFIED_FIXES)
        narrative = sceneCountRetried;
        ctx.warnings.push(`Scene count final gate: retry produced ${retriedActualCount} scenes — within ±${sceneTolerance} of target ${expectedScenes}, accepted.`);
        await rescoreNarrative(ctx, narrative);
      } else {
        // Last-resort deterministic repair to prevent hard failure on scene-count drift.
        const deterministicRepair = rebalanceNarrativeSceneCountsDeterministically(
          sceneCountRetried,
          expectedScenes,
          ctx.clues
        );
        const repairedCount = (sceneCountRetried.acts ?? []).flatMap((a: any) => Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        if (Math.abs(repairedCount - expectedScenes) <= sceneTolerance) {
          if (verifiedFixesEnabled()) adoptOutlineCandidate(ctx, sceneCountRetried, "scene-count-repair"); // A7-02 (owner decision 12, CML_VERIFIED_FIXES)
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

  ctx.reportProgress(
    "narrative",
    `${narrative.totalScenes} scenes structured (~${(getStoryLengthTarget(ctx.inputs.targetLength).chapters * getStoryLengthTarget(ctx.inputs.targetLength).chapterIdealWords).toLocaleString()} words target)`,
    87
  );
  return narrative;
}
