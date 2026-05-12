import { getStoryLengthTarget } from "@cml/story-validation";
import type { CaseData } from "@cml/cml";
import type { NarrativeOutline } from "../agent7-narrative.js";
import type { ClueDistributionResult } from "../agent5-clues.js";
import type { NarrativeState } from "../types/narrative-state.js";

export interface ChapterObligation {
  chapterNumber: number;
  scenesIncluded: Array<{ sceneNumber?: number; title?: string }>;
  wordCountTarget: number;
  wordCountFloor: number;
  mandatoryCluesToPlace: string[];
  mandatoryCluesToReveal: string[];
  cluesNotYetRevealed: string[];
  arcPosition: string;
  canDiscriminatingTestAppear: boolean;
  canConfrontationAppear: boolean;
  earliestClueRevealChapter: number;
  expectedParagraphs: { min: number; target: number; max: number };
}

const flattenScenes = (outline: NarrativeOutline): any[] =>
  (Array.isArray(outline?.acts) ? outline.acts : []).flatMap((act: any) =>
    Array.isArray(act?.scenes) ? act.scenes : [],
  );

const computeArcPosition = (chapterNumber: number, totalChapters: number): string => {
  if (chapterNumber <= 1) return "opening";
  if (chapterNumber <= Math.floor(totalChapters * 0.25)) return "early";
  if (chapterNumber <= Math.floor(totalChapters * 0.4)) return "first_turn";
  if (chapterNumber <= Math.floor(totalChapters * 0.55)) return "mid";
  if (chapterNumber <= Math.floor(totalChapters * 0.7)) return "second_turn";
  if (chapterNumber <= Math.floor(totalChapters * 0.8)) return "pre_climax";
  if (chapterNumber === totalChapters) return "resolution";
  return "climax";
};

const inferParagraphBounds = (wordFloor: number, wordTarget: number): { min: number; target: number; max: number } => {
  const min = Math.max(3, Math.ceil(wordFloor / 260));
  const target = Math.max(min, Math.ceil(wordTarget / 210));
  const max = Math.max(target + 2, Math.ceil(wordTarget / 130));
  return { min, target, max };
};

const inferDiscriminatingHint = (scene: any): boolean => {
  const text = [scene?.title, scene?.purpose, scene?.summary]
    .map((v) => String(v ?? "").toLowerCase())
    .join(" ");
  return /discriminating test|final test|confrontation|reveal|denouement/.test(text);
};

export function computeChapterObligation(args: {
  chapterNumber: number;
  targetLength: "short" | "medium" | "long";
  batchScenes: any[];
  outline: NarrativeOutline;
  cml: CaseData;
  clueDistribution?: ClueDistributionResult;
  narrativeState?: NarrativeState;
}): ChapterObligation {
  const { chapterNumber, targetLength, batchScenes, outline, clueDistribution, narrativeState } = args;
  const allScenes = flattenScenes(outline);
  const totalChapters = Math.max(1, allScenes.length);
  const chapterTarget = getStoryLengthTarget(targetLength);

  const mandatoryCluesToReveal = Array.from(
    new Set(
      batchScenes
        .flatMap((scene: any) => (Array.isArray(scene?.cluesRevealed) ? scene.cluesRevealed : []))
        .map((id: unknown) => String(id).trim())
        .filter(Boolean),
    ),
  );

  const alreadyRevealed = new Set((narrativeState?.cluesRevealedToReader ?? []).map((id) => String(id)));
  const allKnownClues = new Set(
    Array.isArray(clueDistribution?.clues)
      ? clueDistribution!.clues.map((clue: any) => String(clue?.id ?? "").trim()).filter(Boolean)
      : [],
  );

  const mandatoryCluesToPlace = mandatoryCluesToReveal.filter((id) => !alreadyRevealed.has(id));
  const cluesNotYetRevealed = Array.from(allKnownClues).filter(
    (id) => !alreadyRevealed.has(id) && !mandatoryCluesToReveal.includes(id),
  );

  const arcPosition = computeArcPosition(chapterNumber, totalChapters);
  const hasDiscriminatingScene = batchScenes.some((scene) => inferDiscriminatingHint(scene));
  const canDiscriminatingTestAppear = hasDiscriminatingScene || chapterNumber >= Math.ceil(totalChapters * 0.75);
  const canConfrontationAppear = chapterNumber >= Math.ceil(totalChapters * 0.85);

  return {
    chapterNumber,
    scenesIncluded: batchScenes.map((scene: any) => ({
      sceneNumber: typeof scene?.sceneNumber === "number" ? scene.sceneNumber : undefined,
      title: typeof scene?.title === "string" ? scene.title : undefined,
    })),
    wordCountTarget: chapterTarget.chapterIdealWords,
    wordCountFloor: chapterTarget.chapterMinWords,
    mandatoryCluesToPlace,
    mandatoryCluesToReveal,
    cluesNotYetRevealed,
    arcPosition,
    canDiscriminatingTestAppear,
    canConfrontationAppear,
    earliestClueRevealChapter: Math.max(1, chapterNumber - 1),
    expectedParagraphs: inferParagraphBounds(chapterTarget.chapterMinWords, chapterTarget.chapterIdealWords),
  };
}

export function validateChapterReadiness(obligation: ChapterObligation): { passed: boolean; blockers: string[] } {
  const blockers: string[] = [];

  if (!Array.isArray(obligation.scenesIncluded) || obligation.scenesIncluded.length === 0) {
    blockers.push("No scenes available for this chapter batch.");
  }
  if (obligation.wordCountFloor <= 0 || obligation.wordCountTarget < obligation.wordCountFloor) {
    blockers.push("Invalid chapter word-count contract.");
  }

  const mandatorySet = new Set(obligation.mandatoryCluesToReveal);
  const notYetSet = new Set(obligation.cluesNotYetRevealed);
  const contradictory = Array.from(mandatorySet).filter((id) => notYetSet.has(id));
  if (contradictory.length > 0) {
    blockers.push(`Clue obligation conflict: ${contradictory.join(", ")}.`);
  }

  if (!obligation.canDiscriminatingTestAppear) {
    const hasDiscriminatingText = obligation.scenesIncluded.some((scene) =>
      /discriminating|confrontation|reveal/i.test(String(scene?.title ?? "")),
    );
    if (hasDiscriminatingText) {
      blockers.push("Batch requests discriminating-test content before allowed chapter window.");
    }
  }

  return { passed: blockers.length === 0, blockers };
}
