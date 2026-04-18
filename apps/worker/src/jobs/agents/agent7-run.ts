/**
 * Agent 7: Narrative Formatter
 *
 * Extracted from mystery-orchestrator.ts. Runs formatNarrative() via
 * executeAgentWithRetry (when scoring is enabled), applies schema repair,
 * runs the pre-prose outline quality gate, and applies deterministic clue
 * pacing. Writes ctx.narrative and ctx.outlineCoverageIssues.
 */

import { formatNarrative } from "@cml/prompts-llm";
import type { NarrativeOutline, ClueDistributionResult, WorldDocumentResult } from "@cml/prompts-llm";
import { validateArtifact } from "@cml/cml";
import type { CaseData } from "@cml/cml";
import { NarrativeScorer, getSceneTarget, getChapterTargetTolerance, getGenerationParams } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type OutlineCoverageIssue,
  buildOutlineRepairGuardrails,
  executeAgentWithRetry,
} from "./shared.js";
import { adaptNarrativeForScoring, type ClueRef } from "../scoring-adapters/index.js";

// ============================================================================
// Local types (agent-7 only)
// ============================================================================

type SceneRef = {
  scene: any;
  act: 1 | 2 | 3;
  sceneNumber: number;
  actSceneNumber: number;
  index: number;
};

type DeterministicClueAssignmentStats = {
  totalScenes: number;
  minRequired: number;
  before: number;
  after: number;
  mappingAssignments: number;
  essentialAssignments: number;
  gapFillAssignments: number;
  thresholdFillAssignments: number;
};

type NarrativeSceneCountSnapshot = {
  totalScenes: number;
  perAct: Record<1 | 2 | 3, number>;
};

type SceneCountRebalanceResult = {
  changed: boolean;
  summary: string;
};

// ============================================================================
// Outline quality-gate regex constants
// ============================================================================

const OUTLINE_TEST_TERMS_RE = /\b(test|experiment|re-?enact|reenact|trap|demonstrat|verif|proof|examin|timing\s+test|constraint\s+proof)\b/i;
const OUTLINE_EXCLUSION_TERMS_RE = /\b(excluded?|eliminat|ruled\s+out|could\s*not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could|impossible\s+for|proves?\s+innocent)\b/i;
const OUTLINE_EVIDENCE_TERMS_RE = /\b(because|therefore|proof|evidence|measured|timed|observed|alibi|timeline|constraint|clue)\b/i;
const OUTLINE_ELIMINATION_TERMS_RE = /\b(cleared|ruled\s+out|eliminat|not\s+the\s+(culprit|killer|murderer)|innocent|alibi\s+holds|alibi\s+confirmed|could\s*not\s+have|excluded?)\b/i;

// ============================================================================
// Scene helper functions (agent-7 only)
// ============================================================================

function getPlacementForAct(act: 1 | 2 | 3): "early" | "mid" | "late" {
  if (act === 1) return "early";
  if (act === 2) return "mid";
  return "late";
}

function flattenNarrativeScenes(narrative: NarrativeOutline): SceneRef[] {
  const refs: SceneRef[] = [];
  let globalIndex = 0;
  (narrative.acts ?? []).forEach((actBlock: any, actIdx: number) => {
    const act = ((actBlock?.actNumber ?? actIdx + 1) as 1 | 2 | 3) || ((actIdx + 1) as 1 | 2 | 3);
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];
    scenes.forEach((scene: any, sceneIdx: number) => {
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

function buildNarrativeSceneCountGuardrails(lock: NarrativeSceneCountSnapshot, reason: string): string[] {
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

function computeTargetActSceneCounts(expectedTotalScenes: number): Record<1 | 2 | 3, number> {
  const pacing = getGenerationParams().agent7_narrative.params.pacing;
  const act1 = Math.round(expectedTotalScenes * pacing.act_distribution.act1_ratio);
  const act2 = Math.round(expectedTotalScenes * pacing.act_distribution.act2_ratio);
  const act3 = expectedTotalScenes - act1 - act2;
  return { 1: act1, 2: act2, 3: act3 };
}

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

export function applyDeterministicCluePreAssignment(
  narrative: NarrativeOutline,
  cml: CaseData,
  clues: ClueDistributionResult,
  minCoverageRatio = 0.6,
  maxThresholdFillAssignments = Number.POSITIVE_INFINITY,
): DeterministicClueAssignmentStats {
  const refs = flattenNarrativeScenes(narrative);
  const totalScenes = refs.length;
  const minRequired = Math.ceil(totalScenes * minCoverageRatio);

  const allClueIds = clues.clues
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);
  const validClueSet = new Set(allClueIds);
  const essentialClueIds = clues.clues
    .filter((c) => c.criticality === "essential")
    .map((c) => c.id)
    .filter((id): id is string => typeof id === "string" && id.length > 0);

  const timelinePools = {
    early: (clues.clueTimeline?.early ?? []).filter((id) => validClueSet.has(id)),
    mid: (clues.clueTimeline?.mid ?? []).filter((id) => validClueSet.has(id)),
    late: (clues.clueTimeline?.late ?? []).filter((id) => validClueSet.has(id)),
  };

  const usage = new Map<string, number>();
  for (const id of allClueIds) usage.set(id, 0);

  const normalizeSceneClues = (ref: SceneRef) => {
    const current = Array.isArray(ref.scene?.cluesRevealed) ? ref.scene.cluesRevealed : [];
    const normalized: string[] = Array.from(
      new Set<string>(
        current.filter((id: unknown): id is string => typeof id === "string" && validClueSet.has(id))
      )
    );
    ref.scene.cluesRevealed = normalized;
    normalized.forEach((id) => usage.set(id, (usage.get(id) ?? 0) + 1));
  };
  refs.forEach(normalizeSceneClues);

  const countClueScenes = () =>
    refs.filter((r) => Array.isArray(r.scene?.cluesRevealed) && r.scene.cluesRevealed.length > 0).length;
  const before = countClueScenes();

  const pickLeastUsed = (pool: string[], existing: Set<string>): string | null => {
    const candidates = pool.filter((id) => validClueSet.has(id) && !existing.has(id));
    if (candidates.length === 0) return null;
    candidates.sort((a, b) => (usage.get(a) ?? 0) - (usage.get(b) ?? 0));
    return candidates[0] ?? null;
  };

  const pickClueForScene = (ref: SceneRef): string | null => {
    const existing = new Set<string>(
      Array.isArray(ref.scene?.cluesRevealed) ? ref.scene.cluesRevealed : []
    );
    return (
      pickLeastUsed(timelinePools[getPlacementForAct(ref.act)], existing) ??
      pickLeastUsed(essentialClueIds, existing) ??
      pickLeastUsed(allClueIds, existing) ??
      null
    );
  };

  const addClueToScene = (ref: SceneRef, preferredId?: string): boolean => {
    if (!Array.isArray(ref.scene?.cluesRevealed)) ref.scene.cluesRevealed = [];
    const existing = new Set<string>(ref.scene.cluesRevealed);
    const clueId =
      preferredId && validClueSet.has(preferredId) && !existing.has(preferredId)
        ? preferredId
        : pickClueForScene(ref);
    if (!clueId || existing.has(clueId)) return false;
    ref.scene.cluesRevealed = [...ref.scene.cluesRevealed, clueId];
    usage.set(clueId, (usage.get(clueId) ?? 0) + 1);
    return true;
  };

  let mappingAssignments = 0;
  let essentialAssignments = 0;
  let gapFillAssignments = 0;
  let thresholdFillAssignments = 0;

  // 1) Respect prose_requirements clue_to_scene_mapping
  const caseBlock = (cml as any)?.CASE ?? cml;
  const mappingEntries = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (const mapping of mappingEntries) {
    const clueId = String(mapping?.clue_id ?? "");
    if (!validClueSet.has(clueId)) continue;
    const actNumber = Number(mapping?.act_number);
    if (![1, 2, 3].includes(actNumber)) continue;
    const actRefs = refs.filter((r) => r.act === actNumber);
    if (actRefs.length === 0) continue;
    const sceneNumber = Number(mapping?.scene_number);
    const targetRef =
      actRefs.find((r) => r.sceneNumber === sceneNumber) ??
      actRefs.find((r) => r.actSceneNumber === sceneNumber) ??
      actRefs.find((r) => !Array.isArray(r.scene?.cluesRevealed) || r.scene.cluesRevealed.length === 0) ??
      actRefs[0];
    if (targetRef && addClueToScene(targetRef, clueId)) mappingAssignments++;
  }

  // 2) Ensure every essential clue is anchored in at least one scene
  const anchored = new Set(
    refs.flatMap((r) => (Array.isArray(r.scene?.cluesRevealed) ? r.scene.cluesRevealed : []))
  );
  for (const clueId of essentialClueIds) {
    if (anchored.has(clueId)) continue;
    const clue = clues.clues.find((c) => c.id === clueId);
    const preferredAct = clue?.placement === "early" ? 1 : clue?.placement === "mid" ? 2 : 3;
    const candidateRefs = refs
      .filter((r) => r.act === preferredAct)
      .sort((a, b) => (a.scene.cluesRevealed?.length ?? 0) - (b.scene.cluesRevealed?.length ?? 0));
    const targetRef = candidateRefs[0] ?? refs[0];
    if (targetRef && addClueToScene(targetRef, clueId)) {
      essentialAssignments++;
      anchored.add(clueId);
    }
  }

  // 3) Prevent long no-clue runs: fill every third scene inside gaps > 2
  let i = 0;
  while (i < refs.length) {
    if (Array.isArray(refs[i].scene?.cluesRevealed) && refs[i].scene.cluesRevealed.length > 0) {
      i++;
      continue;
    }
    const start = i;
    let end = i;
    while (
      end + 1 < refs.length &&
      !(Array.isArray(refs[end + 1].scene?.cluesRevealed) && refs[end + 1].scene.cluesRevealed.length > 0)
    ) end++;
    if (end - start + 1 > 2) {
      for (let pos = start + 2; pos <= end; pos += 3) {
        if (addClueToScene(refs[pos])) gapFillAssignments++;
      }
    }
    i = end + 1;
  }

  // 4) If still below threshold, fill additional empty scenes with act-balanced picks
  while (countClueScenes() < minRequired && thresholdFillAssignments < maxThresholdFillAssignments) {
    const actTotals = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
    const actCovered = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
    for (const ref of refs) {
      actTotals[ref.act]++;
      if (Array.isArray(ref.scene?.cluesRevealed) && ref.scene.cluesRevealed.length > 0) actCovered[ref.act]++;
    }
    const emptyRefs = refs.filter(
      (r) => !Array.isArray(r.scene?.cluesRevealed) || r.scene.cluesRevealed.length === 0
    );
    if (emptyRefs.length === 0) break;
    emptyRefs.sort((a, b) => {
      const ratioA = actTotals[a.act] > 0 ? actCovered[a.act] / actTotals[a.act] : 1;
      const ratioB = actTotals[b.act] > 0 ? actCovered[b.act] / actTotals[b.act] : 1;
      if (ratioA !== ratioB) return ratioA - ratioB;
      return a.index - b.index;
    });
    const target = emptyRefs[0];
    if (!target || !addClueToScene(target)) break;
    thresholdFillAssignments++;
  }

  return { totalScenes, minRequired, before, after: countClueScenes(), mappingAssignments, essentialAssignments, gapFillAssignments, thresholdFillAssignments };
}

function buildCluePacingGuardrails(expectedScenes: number, minRatio: number): string[] {
  const minClueScenes = Math.ceil(expectedScenes * minRatio);
  const act1 = Math.max(1, Math.floor(minClueScenes * 0.25));
  const act2 = Math.max(1, Math.floor(minClueScenes * 0.45));
  const act3 = Math.max(1, minClueScenes - act1 - act2);
  return [
    `Clue pacing requirement: at least ${minClueScenes} of ${expectedScenes} scenes must include non-empty cluesRevealed arrays.`,
    `Act clue distribution requirement: Act I >= ${act1} clue-bearing scenes, Act II >= ${act2}, Act III >= ${act3}.`,
    "Do not defer most clues to late chapters; ensure clue-bearing scenes appear in all acts.",
  ];
}

// ============================================================================
// World-First scene enrichment helpers
// ============================================================================

/**
 * Maps a normalised scene position (0.0–1.0) to the nearest storyEmotionalArc
 * turningPoints.position enum value.
 */
function toArcPosition(pos: number): string {
  // Thresholds aligned with buildWorldBriefBlock in agent9-prose.ts so that
  // the same story position resolves to the same arc label in both agents.
  if (pos <= 0.08) return 'opening';   // corresponds to chapterIndex <= 1 in a ~12-chapter story
  if (pos <= 0.25) return 'early';
  if (pos <= 0.40) return 'first_turn';
  if (pos <= 0.55) return 'mid';
  if (pos <= 0.70) return 'second_turn';
  if (pos <= 0.80) return 'pre_climax';
  if (pos < 1.00)  return 'climax';
  return 'resolution';
}

/**
 * Maps act number + scene-in-act to a humourPlacementMap scenePosition enum value.
 * Best-effort deterministic mapping.
 */
function toSceneType(act: 1 | 2 | 3, sceneInAct: number): string {
  if (act === 1 && sceneInAct === 1) return 'opening_scene';
  if (act === 1 && sceneInAct === 2) return 'first_investigation';
  if (act === 1) return 'first_interview';
  if (act === 2 && sceneInAct <= 2) return 'mid_investigation';
  if (act === 2 && sceneInAct <= 3) return 'tension_scene';
  if (act === 2) return 'pre_climax';
  if (act === 3 && sceneInAct === 1) return 'discriminating_test';
  if (act === 3 && sceneInAct === 2) return 'revelation';
  return 'resolution';
}

/**
 * Enriches every scene in the narrative outline with the six World-First fields
 * derived from the World Document:
 *   emotionalRegister, dominantCharacterNote, humourGuidance,
 *   eraTextureNote, locationRegisterNote
 *
 * NOTE: subtextNote is NOT set here — it requires creative LLM reasoning and
 * should already be present in the Agent 7 LLM output if the World Document
 * was passed to formatNarrative(). This function provides the deterministic
 * fallbacks for the five structurally-derivable fields.
 */
export function applyWorldFirstSceneEnrichment(
  narrative: NarrativeOutline,
  world: WorldDocumentResult,
): void {
  const acts = Array.isArray(narrative.acts) ? narrative.acts : [];
  const totalScenes = acts.reduce((n: number, a: any) =>
    n + (Array.isArray(a?.scenes) ? a.scenes.length : 0), 0);
  let sceneIndex = 0;

  for (const actBlock of acts) {
    const actNumber = (Number(actBlock?.actNumber) || (acts.indexOf(actBlock) + 1)) as 1 | 2 | 3;
    const scenes = Array.isArray(actBlock?.scenes) ? actBlock.scenes : [];

    for (let si = 0; si < scenes.length; si++) {
      const scene = scenes[si];
      const sceneInAct = si + 1;
      const position = totalScenes > 1 ? sceneIndex / (totalScenes - 1) : 0;

      // ── emotionalRegister ──────────────────────────────────────────────
      const arcPos = toArcPosition(position);
      const turningPoints = world.storyEmotionalArc?.turningPoints ?? [];
      const matchedTp = turningPoints.find((t: any) => t.position === arcPos)
        ?? turningPoints[Math.min(
          Math.floor(position * turningPoints.length),
          turningPoints.length - 1,
        )];
      (scene as any).emotionalRegister =
        matchedTp?.emotionalDescription ?? world.storyEmotionalArc?.dominantRegister ?? '';

      // ── dominantCharacterNote ──────────────────────────────────────────
      const sceneChars: string[] = Array.isArray((scene as any).characters)
        ? (scene as any).characters
        : [];
      const voiceMatch = (world.characterVoiceSketches ?? []).find((v: any) =>
        sceneChars.some((c) => c.toLowerCase().includes(v.name.toLowerCase())),
      );
      (scene as any).dominantCharacterNote = voiceMatch
        ? { name: voiceMatch.name, voiceRegister: voiceMatch.voiceDescription }
        : undefined;

      // ── humourGuidance ─────────────────────────────────────────────────
      const sceneType = toSceneType(actNumber, sceneInAct);
      const humourEntry = (world.humourPlacementMap ?? []).find(
        (h: any) => h.scenePosition === sceneType,
      );
      (scene as any).humourGuidance = humourEntry
        ? {
            permission: humourEntry.humourPermission,
            character: humourEntry.permittedCharacters?.[0] ?? undefined,
            form: humourEntry.permittedForms?.[0] ?? undefined,
            condition: humourEntry.condition ?? undefined,
          }
        : { permission: 'permitted' };

      // ── eraTextureNote ─────────────────────────────────────────────────
      const physicalConstraints: string[] =
        world.historicalMoment?.physicalConstraints ?? [];
      (scene as any).eraTextureNote = physicalConstraints.join('; ');

      // ── locationRegisterNote ───────────────────────────────────────────
      // Scene location lives at scene.setting.location (a name string);
      // scene.locationId does not exist in the narrative outline schema.
      const locationName: string =
        (scene as any).locationId ??
        (scene as any).setting?.location ??
        '';
      const locReg = (world.locationRegisters ?? []).find(
        (l: any) =>
          locationName
            ? l.locationId === locationName ||
              l.name?.toLowerCase() === locationName.toLowerCase()
            : false,
      );
      (scene as any).locationRegisterNote = locReg
        ? `${locReg.emotionalRegister} — ${locReg.cameraAngle}`
        : '';

      sceneIndex++;
    }
  }
}

// ============================================================================
// evaluateOutlineCoverage (agent-7 only)
// ============================================================================

function evaluateOutlineCoverage(narrative: NarrativeOutline, cml: CaseData): OutlineCoverageIssue[] {
  const issues: OutlineCoverageIssue[] = [];
  const cmlCase = (cml as any)?.CASE ?? {};
  const allScenes = (narrative.acts ?? []).flatMap((act) =>
    Array.isArray(act.scenes) ? act.scenes : []
  );

  // --- Check 1: discriminating test scene ---
  const hasDiscriminatingTestScene = allScenes.some((scene) => {
    const blob = [
      scene.title ?? "",
      scene.purpose ?? "",
      scene.summary ?? "",
      scene.dramaticElements?.revelation ?? "",
      scene.dramaticElements?.tension ?? "",
    ].join(" ");
    return (
      OUTLINE_TEST_TERMS_RE.test(blob) &&
      OUTLINE_EXCLUSION_TERMS_RE.test(blob) &&
      OUTLINE_EVIDENCE_TERMS_RE.test(blob)
    );
  });
  const DISC_TEST_FALLBACK_RE = /discriminating|re-?enactment|crucial\s+test|decisive\s+experiment|trap\s+is\s+set|ruling\s+out/i;
  const hasTestMention = allScenes.some((scene) =>
    DISC_TEST_FALLBACK_RE.test([scene.title ?? "", scene.purpose ?? "", scene.summary ?? ""].join(" "))
  );
  if (!hasDiscriminatingTestScene && !hasTestMention) {
    issues.push({
      type: "missing_discriminating_test_scene",
      message:
        "Outline has no scene whose summary/purpose contains discriminating test, re-enactment, or suspect-elimination language",
    });
  }

  // --- Check 2: suspect closure / elimination coverage ---
  const castRoster: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const culprits: string[] = Array.isArray(cmlCase.culpability?.culprits)
    ? (cmlCase.culpability.culprits as string[])
    : [];
  const suspects = castRoster
    .filter((c: any) => c.role === "suspect")
    .map((c: any) => (c.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.includes(name));

  if (suspects.length > 0) {
    const allSceneText = allScenes
      .map((s) => [s.title, s.purpose, s.summary, s.dramaticElements?.revelation].join(" "))
      .join(" ");
    const hasAnyClosure =
      OUTLINE_ELIMINATION_TERMS_RE.test(allSceneText) && OUTLINE_EVIDENCE_TERMS_RE.test(allSceneText);
    if (!hasAnyClosure) {
      issues.push({
        type: "missing_suspect_closure_scene",
        message:
          "Outline has no scene with suspect elimination/closure language (cleared, ruled out, alibi confirmed, etc.)",
      });
    }
  }

  return issues;
}

// ============================================================================
// Re-score helper used after narrative is replaced by retry
// ============================================================================

async function rescoreNarrative(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  if (!ctx.enableScoring || !ctx.scoreAggregator) return;
  try {
    const rescorer = new NarrativeScorer();
    const adapted = adaptNarrativeForScoring(
      narrative,
      (ctx.cml as any)?.CASE?.cast ?? [],
      ((ctx.cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? [])
        .map((m: any): ClueRef => ({
          id: String(m.clue_id || ""),
          placement: m.act_number === 1 ? "early" : m.act_number === 2 ? "mid" : "late",
        }))
        .filter((c: ClueRef) => c.id)
    );
    const score = await rescorer.score({}, adapted, {
      previous_phases: { agent2_cast: ctx.cast!.cast },
      cml: ctx.cml!,
      threshold_config: { mode: "standard" },
      targetLength: ctx.inputs.targetLength ?? "medium",
    });
    ctx.scoreAggregator.upsertPhaseScore(
      "agent7_narrative",
      "Narrative Outline",
      score,
      ctx.agentDurations["agent7_narrative"] ?? 0,
      1
    );
  } catch { /* re-scoring is best-effort; never abort */ }
}

// ============================================================================
// runAgent7
// ============================================================================

export async function runAgent7(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("narrative", "Formatting narrative structure...", 75);
  const narrativePacingConfig = getGenerationParams().agent7_narrative.params.pacing;
  const minClueSceneRatio = narrativePacingConfig.min_clue_scene_ratio;
  const maxDeterministicGapFill = 3;
  const expectedSceneTarget = getSceneTarget(ctx.inputs.targetLength ?? "medium");
  const pacingGuardrails = buildCluePacingGuardrails(expectedSceneTarget, minClueSceneRatio);

  let narrative: NarrativeOutline;

  if (ctx.enableScoring && ctx.scoreAggregator && ctx.retryManager && ctx.scoringLogger) {
    const { result, duration, cost } = await executeAgentWithRetry(
      "agent7_narrative",
      "Narrative Outline",
      async (retryFeedback?: string) => {
        const narrativeResult = await formatNarrative(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues!,
          targetLength: ctx.inputs.targetLength,
          narrativeStyle: ctx.inputs.narrativeStyle,
          detectiveType: ctx.inputs.detectiveType,
          qualityGuardrails: retryFeedback ? [retryFeedback, ...pacingGuardrails] : pacingGuardrails,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        return { result: narrativeResult, cost: narrativeResult.cost };
      },
      async (narrativeResult) => {
        const scorer = new NarrativeScorer();
        const clueMappings: ClueRef[] = (
          (ctx.cml as any)?.CASE?.prose_requirements?.clue_to_scene_mapping ?? []
        )
          .map((m: any): ClueRef => ({
            id: String(m.clue_id || ""),
            placement: m.act_number === 1 ? "early" : m.act_number === 2 ? "mid" : m.act_number === 3 ? "late" : undefined,
          }))
          .filter((c: ClueRef) => c.id);
        const adapted = adaptNarrativeForScoring(
          narrativeResult,
          (ctx.cml as any)?.CASE?.cast ?? [],
          clueMappings
        );
        const score = await scorer.score({}, adapted, {
          previous_phases: { agent2_cast: ctx.cast!.cast },
          cml: ctx.cml!,
          threshold_config: { mode: "standard" },
          targetLength: ctx.inputs.targetLength ?? "medium",
        });

        // Scene-count gate inside the scoring path: force F only when the deviation
        // exceeds the configured tolerance (±getChapterTargetTolerance()).  Counts within
        // tolerance are accepted — prose generates one chapter per scene so a ±2 deviation
        // doesn't break the story structure.
        const actualSceneCount = (narrativeResult.acts ?? []).flatMap((a: any) =>
          Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        const expectedSceneCount = getSceneTarget(ctx.inputs.targetLength ?? "medium");
        const sceneCountTolerance = getChapterTargetTolerance();
        if (Math.abs(actualSceneCount - expectedSceneCount) > sceneCountTolerance) {
          // Use the SAME act-distribution ratios that buildUserRequest() uses so the
          // retry feedback tells the LLM exactly what the prompt already asked for.
          const pacing = getGenerationParams().agent7_narrative.params.pacing;
          const actI   = Math.round(expectedSceneCount * pacing.act_distribution.act1_ratio);
          const actII  = Math.round(expectedSceneCount * pacing.act_distribution.act2_ratio);
          const actIII = expectedSceneCount - actI - actII;
          return {
            adapted,
            score: {
              ...score,
              total: 0,
              grade: 'F' as const,
              passed: false,
              failure_reason:
                `Scene count: generated ${actualSceneCount} scenes but target is ${expectedSceneCount} ` +
                `(tolerance ±${sceneCountTolerance}; deviation of ${Math.abs(actualSceneCount - expectedSceneCount)} exceeds limit). ` +
                `Distribute as: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
                `(these are exact counts, not ranges). Do not merge or drop scenes — ` +
                `each scene becomes a distinct prose chapter.`,
              component_failures: [
                ...(score.component_failures ?? []),
                `scene_count (${actualSceneCount} vs target ${expectedSceneCount}, tolerance ±${sceneCountTolerance})`,
              ],
            },
          };
        }

        return { adapted, score };
      },
      ctx.retryManager,
      ctx.scoreAggregator,
      ctx.scoringLogger,
      ctx.runId,
      ctx.projectId || "",
      ctx.warnings,
      ctx.savePartialReport
    );
    narrative = result;
    ctx.agentCosts["agent7_narrative"] = cost;
    ctx.agentDurations["agent7_narrative"] = duration;
  } else {
    const narrativeStart = Date.now();
    narrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: pacingGuardrails,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent7_narrative"] = narrative.cost;
    ctx.agentDurations["agent7_narrative"] = Date.now() - narrativeStart;
  }

  // ── Schema repair ──────────────────────────────────────────────────────────
  let narrativeSchemaValidation = validateArtifact("narrative_outline", narrative);
  if (!narrativeSchemaValidation.valid) {
    ctx.warnings.push(
      "Narrative outline failed schema validation on first attempt; retrying outline generation with schema repair guardrails"
    );
    const schemaRepairGuardrails = [
      "Return a valid narrative_outline artifact that strictly matches required schema fields and types.",
      ...narrativeSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
    ];

    const narrativeSchemaRetryStart = Date.now();
    const retriedNarrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: [...schemaRepairGuardrails, ...pacingGuardrails],
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent7_narrative"] =
      (ctx.agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
    ctx.agentDurations["agent7_narrative"] =
      (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeSchemaRetryStart);

    const retryValidation = validateArtifact("narrative_outline", retriedNarrative);
    if (!retryValidation.valid) {
      retryValidation.errors.forEach((error) => ctx.errors.push(`Outline schema failure: ${error}`));
      throw new Error("Narrative outline artifact failed schema validation");
    }

    narrative = retriedNarrative;
    narrativeSchemaValidation = retryValidation;
    ctx.warnings.push("Narrative outline schema-repair retry succeeded");
    await rescoreNarrative(ctx, narrative);
  }
  narrativeSchemaValidation.warnings.forEach((warning) =>
    ctx.warnings.push(`Outline schema warning: ${warning}`)
  );

  // ── Scene count final gate ────────────────────────────────────────────────
  // The scene count produced by the LLM MUST be within ±getChapterTargetTolerance()
  // of STORY_LENGTH_TARGETS[targetLength].scenes.  Prose generates one chapter per
  // scene, so a small deviation is acceptable and does not break story structure.
  // Only counts outside the tolerance trigger a retry / abort.
  {
    const expectedScenes = getSceneTarget(ctx.inputs.targetLength ?? "medium");
    const sceneTolerance = getChapterTargetTolerance();
    // Use act-traversal count, not the LLM-supplied totalScenes field (which can lag).
    const actualSceneCount = (narrative.acts ?? []).flatMap((a: any) =>
      Array.isArray(a.scenes) ? a.scenes : []
    ).length;

    if (Math.abs(actualSceneCount - expectedScenes) > sceneTolerance) {
      // Compute exact act targets using the SAME ratios as buildUserRequest() so the
      // retry message is always consistent with what the prompt already asked for.
      const pacing = getGenerationParams().agent7_narrative.params.pacing;
      const actI   = Math.round(expectedScenes * pacing.act_distribution.act1_ratio);
      const actII  = Math.round(expectedScenes * pacing.act_distribution.act2_ratio);
      const actIII = expectedScenes - actI - actII;

      ctx.warnings.push(
        `Scene count final gate: narrative has ${actualSceneCount} scenes but target is ${expectedScenes} — regenerating.`
      );
      ctx.reportProgress("narrative", `Scene count fix: need ${expectedScenes} scenes, got ${actualSceneCount}`, 80);

      const sceneCountRetryStart = Date.now();
      const sceneCountRetried = await formatNarrative(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues!,
        targetLength: ctx.inputs.targetLength,
        narrativeStyle: ctx.inputs.narrativeStyle,
        detectiveType: ctx.inputs.detectiveType,
        qualityGuardrails: [
          `SCENE COUNT VIOLATION: Your previous outline had ${actualSceneCount} scenes. ` +
          `The target is EXACTLY ${expectedScenes} scenes — no more, no fewer. ` +
          `You MUST generate EXACTLY: Act I=${actI} scenes, Act II=${actII} scenes, Act III=${actIII} scenes ` +
          `(these are exact counts, not ranges; they add up to ${actI + actII + actIII}). ` +
          `Count your scenes carefully before returning. ` +
          `Each scene is a distinct chapter in the final novel — do not merge or drop scenes.`,
          ...pacingGuardrails,
        ],
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent7_narrative"] =
        (ctx.agentCosts["agent7_narrative"] || 0) + sceneCountRetried.cost;
      ctx.agentDurations["agent7_narrative"] =
        (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - sceneCountRetryStart);

      const retriedActualCount = (sceneCountRetried.acts ?? []).flatMap((a: any) =>
        Array.isArray(a.scenes) ? a.scenes : []
      ).length;

      if (Math.abs(retriedActualCount - expectedScenes) <= sceneTolerance) {
        narrative = sceneCountRetried;
        ctx.warnings.push(`Scene count final gate: retry produced ${retriedActualCount} scenes — within ±${sceneTolerance} of target ${expectedScenes}, accepted.`);
        await rescoreNarrative(ctx, narrative);
      } else {
        // Last-resort deterministic repair to prevent hard failure on scene-count drift.
        const deterministicRepair = rebalanceNarrativeSceneCountsDeterministically(
          sceneCountRetried,
          expectedScenes,
          ctx.clues,
        );
        const repairedCount = (sceneCountRetried.acts ?? []).flatMap((a: any) =>
          Array.isArray(a.scenes) ? a.scenes : []
        ).length;
        if (Math.abs(repairedCount - expectedScenes) <= sceneTolerance) {
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
    `${narrative.totalScenes} scenes structured (${narrative.estimatedTotalWords} words)`,
    87
  );

  // ── Pre-prose outline quality gate ────────────────────────────────────────
  const outlineCoverageIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
  if (outlineCoverageIssues.length > 0) {
    const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);
    const outlineGuardrails = buildOutlineRepairGuardrails(outlineCoverageIssues, ctx.cml!);
    const countGuardrails = buildNarrativeSceneCountGuardrails(sceneCountLock, "coverage repair");
    outlineCoverageIssues.forEach((issue) =>
      ctx.warnings.push(`Outline coverage gap: ${issue.message}`)
    );
    ctx.warnings.push("Regenerating outline with targeted quality guardrails");
    ctx.reportProgress("narrative", "Regenerating outline to address coverage gaps", 80);

    const narrativeRetryStart = Date.now();
    const retriedNarrative = await formatNarrative(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      targetLength: ctx.inputs.targetLength,
      narrativeStyle: ctx.inputs.narrativeStyle,
      detectiveType: ctx.inputs.detectiveType,
      qualityGuardrails: [...outlineGuardrails, ...countGuardrails, ...pacingGuardrails],
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent7_narrative"] =
      (ctx.agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
    ctx.agentDurations["agent7_narrative"] =
      (ctx.agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeRetryStart);

    const retryOutlineIssues = evaluateOutlineCoverage(retriedNarrative, ctx.cml!);
    const retryCountCheck = checkNarrativeSceneCountFloor(retriedNarrative, sceneCountLock);

    if (retryOutlineIssues.length < outlineCoverageIssues.length && retryCountCheck.ok) {
      narrative = retriedNarrative;
      ctx.warnings.push("Outline retry improved coverage");
      await rescoreNarrative(ctx, narrative);
      ctx.reportProgress(
        "narrative",
        `Outline retry: ${retriedNarrative.totalScenes} scenes (${retriedNarrative.estimatedTotalWords} words)`,
        85
      );
    } else {
      if (!retryCountCheck.ok) {
        ctx.warnings.push(
          `Outline retry rejected due to scene-count lock violation (${retryCountCheck.message}); keeping baseline outline and passing quality guardrails to prose generation.`
        );
      } else {
        ctx.warnings.push("Outline retry did not improve; will pass guardrails to prose generation");
      }
    }
  }

  // ── Clue pacing gate ──────────────────────────────────────────────────────
  {
    const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
    const totalOutlineSceneCount = allOutlineScenes.length;
    const clueSceneCount = allOutlineScenes.filter(
      (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
    ).length;
    const minClueScenes = Math.ceil(totalOutlineSceneCount * minClueSceneRatio);
    const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);

    if (totalOutlineSceneCount > 0 && clueSceneCount < minClueScenes) {
      ctx.warnings.push(
        `Outline clue pacing below threshold: ${clueSceneCount}/${totalOutlineSceneCount} scenes carry clues (minimum ${minClueScenes}). Trying narrative regeneration before deterministic patching.`
      );

      {
        ctx.reportProgress(
          "narrative",
          `Clue pacing retry: ${clueSceneCount}/${totalOutlineSceneCount} scenes have clues (≥${minClueScenes} required)`,
          86
        );

        const pacingRetryStart = Date.now();
        const pacingRetried = await formatNarrative(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues!,
          targetLength: ctx.inputs.targetLength,
          narrativeStyle: ctx.inputs.narrativeStyle,
          detectiveType: ctx.inputs.detectiveType,
          qualityGuardrails: [
            `CRITICAL PACING FAILURE: Your previous outline placed clues in only ${clueSceneCount} of ${totalOutlineSceneCount} scenes. The minimum required is ${minClueScenes} scenes. You MUST populate cluesRevealed with at least one clue ID in at least ${minClueScenes} scenes and distribute clues across all three acts.`,
            ...buildNarrativeSceneCountGuardrails(sceneCountLock, "clue pacing repair"),
            ...pacingGuardrails,
          ],
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent7_narrative"] =
          (ctx.agentCosts["agent7_narrative"] ?? 0) + pacingRetried.cost;
        ctx.agentDurations["agent7_narrative"] =
          (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - pacingRetryStart);

        const retriedOutlineScenes = (pacingRetried.acts ?? []).flatMap((a: any) => a.scenes || []);
        const retriedClueCount = retriedOutlineScenes.filter(
          (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
        ).length;
        const retriedMinClueScenes = Math.ceil(retriedOutlineScenes.length * minClueSceneRatio);
        const pacingRetryCountCheck = checkNarrativeSceneCountFloor(pacingRetried, sceneCountLock);

        if (!pacingRetryCountCheck.ok) {
          ctx.warnings.push(
            `Outline pacing retry rejected due to scene-count lock violation (${pacingRetryCountCheck.message}); keeping current outline and deterministic clue assignments.`
          );
        } else if (retriedClueCount >= retriedMinClueScenes) {
          narrative = pacingRetried;
          ctx.warnings.push(
            `Outline pacing retry succeeded: ${retriedClueCount}/${retriedOutlineScenes.length} scenes now carry clues.`
          );
        } else {
          const remainingGap = retriedMinClueScenes - retriedClueCount;
          if (remainingGap > maxDeterministicGapFill) {
            throw new Error(
              `Outline pacing gate failed: retry still below threshold (${retriedClueCount}/${retriedOutlineScenes.length}, need >= ${retriedMinClueScenes}). Remaining gap ${remainingGap} exceeds deterministic fill cap ${maxDeterministicGapFill}.`,
            );
          }
          const deterministicOnRetry = applyDeterministicCluePreAssignment(
            pacingRetried,
            ctx.cml!,
            ctx.clues!,
            minClueSceneRatio,
            maxDeterministicGapFill,
          );
          if (deterministicOnRetry.after >= deterministicOnRetry.minRequired) {
            narrative = pacingRetried;
            ctx.warnings.push(
              `Outline pacing retry remained below threshold (${retriedClueCount}/${retriedOutlineScenes.length}), but deterministic post-retry anchoring recovered coverage to ${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}.`
            );
            ctx.reportProgress(
              "narrative",
              `Deterministic post-retry clue anchoring applied: ${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}`,
              86
            );
          } else {
            throw new Error(
              `Outline pacing gate failed: retry and bounded deterministic anchoring both insufficient (${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}, need >= ${deterministicOnRetry.minRequired}).`,
            );
          }
        }
      }
    }
  }

  // ── World-First scene enrichment ─────────────────────────────────────────
  // Applies the five deterministically-derivable World-First fields to every
  // scene entry. subtextNote is left to the Agent 7 LLM output.
  if (ctx.worldDocument) {
    applyWorldFirstSceneEnrichment(narrative, ctx.worldDocument);
    ctx.warnings.push(
      `World-First enrichment applied: emotionalRegister, humourGuidance, eraTextureNote, ` +
      `locationRegisterNote, dominantCharacterNote set on all ` +
      `${narrative.acts?.flatMap((a: any) => a.scenes ?? []).length ?? 0} scenes.`,
    );
  }

  ctx.narrative = narrative;
  ctx.outlineCoverageIssues = evaluateOutlineCoverage(narrative, ctx.cml!);
}
