/**
 * Clue pacing: deterministic clue pre-assignment, the gap-fill cap, the pacing gate, and forced assignment of uncovered clues.
 * 
 * Moved verbatim from agent7-run.ts (code review A7-01 / CR-24), which re-exports what it exported.
 */
import { narrativeInputs } from "./generate.js";
import { formatNarrative } from "@cml/prompts-llm";
import type { NarrativeOutline, ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  SceneRef,
  buildNarrativeSceneCountGuardrails,
  captureNarrativeSceneCountSnapshot,
  checkNarrativeSceneCountFloor,
  flattenNarrativeScenes,
  getPlacementForAct,
} from "./scene-refs.js";
import {
  Agent7Run,
} from "./generate.js";

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

export function computeDeterministicGapFillCap(totalScenes: number): number {
  const normalizedScenes = Number.isFinite(totalScenes) ? Math.max(0, Math.floor(totalScenes)) : 0;
  const scaledCap = Math.ceil(normalizedScenes * 0.25);
  return Math.max(3, Math.min(8, scaledCap));
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
      // A_53 P8 (gapfill-stride-skips-mid-gap-scenes): the old `start+2` stride-of-3 didn't GUARANTEE
      // ≤2 consecutive clueless scenes once a fill failed. Walk the gap greedily: after 2 clueless
      // scenes, fill the next; on a fill failure advance and retry so a single unfillable scene can't
      // open a >2 run (mirrors the scheduler's liftCoverage guarantee).
      let cluelessRun = 0;
      for (let pos = start; pos <= end; pos++) {
        const hasClue =
          Array.isArray(refs[pos].scene?.cluesRevealed) && refs[pos].scene.cluesRevealed.length > 0;
        if (hasClue) {
          cluelessRun = 0;
          continue;
        }
        if (cluelessRun >= 2 && addClueToScene(refs[pos])) {
          gapFillAssignments++;
          cluelessRun = 0;
        } else {
          cluelessRun++;
        }
      }
    }
    i = end + 1;
  }

  // 4) If still below threshold, fill additional empty scenes with act-balanced picks
  // A_53 P10 (clue-preassign-recounts-scenes-in-loop): the previous loop re-ran countClueScenes()
  // (full scan), rebuilt per-act totals, and re-filtered+sorted emptyRefs on EVERY assignment (O(n²)
  // over ~0.6N). Maintain the invariants incrementally instead:
  //   • actTotals never changes (scene→act assignment is fixed) — compute once.
  //   • coveredCount + actCovered change by exactly +1 when a previously-empty scene gets a clue.
  //   • emptyRefs only shrinks — keep it as a mutable list and pick the min by the LIVE ratio
  //     (ascending ratio, then ascending index — identical ordering to the old filter+sort, but a
  //     single O(emptyRefs) min-scan with no per-iteration sort or whole-corpus rescans).
  const actTotals = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
  const actCovered = { 1: 0, 2: 0, 3: 0 } as Record<1 | 2 | 3, number>;
  let coveredCount = 0;
  const emptyRefs: SceneRef[] = [];
  for (const ref of refs) {
    actTotals[ref.act]++;
    const hasClue = Array.isArray(ref.scene?.cluesRevealed) && ref.scene.cluesRevealed.length > 0;
    if (hasClue) {
      actCovered[ref.act]++;
      coveredCount++;
    } else {
      emptyRefs.push(ref);
    }
  }
  while (coveredCount < minRequired && thresholdFillAssignments < maxThresholdFillAssignments) {
    if (emptyRefs.length === 0) break;
    let bestPos = -1;
    let bestRatio = Number.POSITIVE_INFINITY;
    let bestIndex = Number.POSITIVE_INFINITY;
    for (let p = 0; p < emptyRefs.length; p++) {
      const ref = emptyRefs[p];
      const ratio = actTotals[ref.act] > 0 ? actCovered[ref.act] / actTotals[ref.act] : 1;
      if (ratio < bestRatio || (ratio === bestRatio && ref.index < bestIndex)) {
        bestRatio = ratio;
        bestIndex = ref.index;
        bestPos = p;
      }
    }
    if (bestPos < 0) break;
    const target = emptyRefs[bestPos];
    if (!addClueToScene(target)) break;
    // The scene is no longer empty: drop it from emptyRefs and bump the incremental counts.
    emptyRefs.splice(bestPos, 1);
    actCovered[target.act]++;
    coveredCount++;
    thresholdFillAssignments++;
  }

  return { totalScenes, minRequired, before, after: coveredCount, mappingAssignments, essentialAssignments, gapFillAssignments, thresholdFillAssignments };
}

export function buildCluePacingGuardrails(expectedScenes: number, minRatio: number): string[] {
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

export async function enforceCluePacing(ctx: OrchestratorContext, run: Agent7Run, narrative: NarrativeOutline) {
  {
    const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
    const totalOutlineSceneCount = allOutlineScenes.length;
    const clueSceneCount = allOutlineScenes.filter(
      (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
    ).length;
    const minClueScenes = Math.ceil(totalOutlineSceneCount * run.minClueSceneRatio);
    const sceneCountLock = captureNarrativeSceneCountSnapshot(narrative);

    if (totalOutlineSceneCount > 0 && clueSceneCount < minClueScenes) {
      if (!run.contractRecoveryEnabled) {
        const maxDeterministicGapFill = computeDeterministicGapFillCap(totalOutlineSceneCount);
        const deterministicOnly = applyDeterministicCluePreAssignment(
          narrative,
          ctx.cml!,
          ctx.clues!,
          run.minClueSceneRatio,
          maxDeterministicGapFill
        );
        if (deterministicOnly.after >= deterministicOnly.minRequired) {
          ctx.warnings.push(
            `Outline pacing gate recovered deterministically without retry: ${deterministicOnly.after}/${deterministicOnly.totalScenes} scenes.`
          );
        } else {
          throw new Error(
            `Outline pacing gate failed with contract recovery disabled (${deterministicOnly.after}/${deterministicOnly.totalScenes}, need >= ${deterministicOnly.minRequired}).`
          );
        }
      } else {
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
          const pacingRetried = await formatNarrative(ctx.client, narrativeInputs(ctx, run, [
            `CRITICAL PACING FAILURE: Your previous outline placed clues in only ${clueSceneCount} of ${totalOutlineSceneCount} scenes. The minimum required is ${minClueScenes} scenes. You MUST populate cluesRevealed with at least one clue ID in at least ${minClueScenes} scenes and distribute clues across all three acts.`,
            ...buildNarrativeSceneCountGuardrails(sceneCountLock, "clue pacing repair"),
          ]));
          ctx.agentCosts["agent7_narrative"] =
            pacingRetried.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
          ctx.agentDurations["agent7_narrative"] =
            (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - pacingRetryStart);

          const retriedOutlineScenes = (pacingRetried.acts ?? []).flatMap((a: any) => a.scenes || []);
          const retriedClueCount = retriedOutlineScenes.filter(
            (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
          ).length;
          const retriedMinClueScenes = Math.ceil(retriedOutlineScenes.length * run.minClueSceneRatio);
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
            const maxDeterministicGapFill = computeDeterministicGapFillCap(retriedOutlineScenes.length);
            const remainingGap = retriedMinClueScenes - retriedClueCount;
            let secondRetryResolved = false;
            if (remainingGap > maxDeterministicGapFill) {
              // Class #14 (P5-VOICE poison_enforce, 2026-07-20): a catastrophic outline draw (2/10
              // clue scenes) left a gap the bounded fill cannot bridge, and the single retry was the
              // last word — the run died for want of ONE more Agent-7 call. Second targeted retry,
              // same acceptance ladder; the abort stands if this too cannot reach the floor.
              ctx.reportProgress(
                "narrative",
                `Clue pacing second retry: ${retriedClueCount}/${retriedOutlineScenes.length} (gap ${remainingGap} > fill cap ${maxDeterministicGapFill})`,
                86
              );
              const secondStart = Date.now();
              const secondRetry = await formatNarrative(ctx.client, narrativeInputs(ctx, run, [
                `CRITICAL PACING FAILURE (second retry): your outline placed clues in only ${retriedClueCount} of ${retriedOutlineScenes.length} scenes; the minimum is ${retriedMinClueScenes}. EVERY act must contain clue-bearing scenes. Set cluesRevealed to at least one clue ID in AT LEAST ${retriedMinClueScenes} scenes — when unsure, prefer MORE clue-bearing scenes, not fewer.`,
                ...buildNarrativeSceneCountGuardrails(sceneCountLock, "clue pacing repair"),
              ]));
              ctx.agentCosts["agent7_narrative"] =
                secondRetry.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
              ctx.agentDurations["agent7_narrative"] =
                (ctx.agentDurations["agent7_narrative"] ?? 0) + (Date.now() - secondStart);
              const secondScenes = (secondRetry.acts ?? []).flatMap((a: any) => a.scenes || []);
              const secondClueCount = secondScenes.filter(
                (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
              ).length;
              const secondMin = Math.ceil(secondScenes.length * run.minClueSceneRatio);
              const secondCountCheck = checkNarrativeSceneCountFloor(secondRetry, sceneCountLock);
              const secondCap = computeDeterministicGapFillCap(secondScenes.length);
              if (secondCountCheck.ok && secondClueCount >= secondMin) {
                narrative = secondRetry;
                secondRetryResolved = true;
                ctx.warnings.push(
                  `Outline pacing SECOND retry succeeded: ${secondClueCount}/${secondScenes.length} scenes carry clues.`
                );
              } else if (secondCountCheck.ok && secondMin - secondClueCount <= secondCap) {
                const fill = applyDeterministicCluePreAssignment(
                  secondRetry,
                  ctx.cml!,
                  ctx.clues!,
                  run.minClueSceneRatio,
                  secondCap
                );
                if (fill.after >= fill.minRequired) {
                  narrative = secondRetry;
                  secondRetryResolved = true;
                  ctx.warnings.push(
                    `Outline pacing second retry + bounded fill recovered coverage to ${fill.after}/${fill.totalScenes}.`
                  );
                } else {
                  throw new Error(
                    `Outline pacing gate failed after second retry: bounded fill insufficient (${fill.after}/${fill.totalScenes}, need >= ${fill.minRequired}).`
                  );
                }
              } else {
                throw new Error(
                  `Outline pacing gate failed: two retries below threshold (${secondClueCount}/${secondScenes.length}, need >= ${secondMin})${secondCountCheck.ok ? ` and gap exceeds fill cap ${secondCap}` : ` (scene-count lock: ${secondCountCheck.message})`}.`
                );
              }
            }
            if (!secondRetryResolved) {
              const deterministicOnRetry = applyDeterministicCluePreAssignment(
                pacingRetried,
                ctx.cml!,
                ctx.clues!,
                run.minClueSceneRatio,
                maxDeterministicGapFill
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
                  `Outline pacing gate failed: retry and bounded deterministic anchoring both insufficient (${deterministicOnRetry.after}/${deterministicOnRetry.totalScenes}, need >= ${deterministicOnRetry.minRequired}).`
                );
              }
            }
          }
        }
      }
    }
  }
  return narrative;
}

export function forceAssignUncoveredClues(ctx: OrchestratorContext, narrative: NarrativeOutline) {
  {
    const allScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes ?? []);
    const coveredClueIds = new Set<string>(
      allScenes
        .flatMap((s: any) => Array.isArray(s.cluesRevealed) ? s.cluesRevealed : [])
        .map(String)
        .filter(Boolean)
    );
    const allDistributionIds = (ctx.clues?.clues ?? [])
      .map((c: any) => String(c.id ?? ""))
      .filter(Boolean);
    const uncoveredIds = allDistributionIds.filter((id) => !coveredClueIds.has(id));

    if (uncoveredIds.length > 0) {
      // Deterministically assign each uncovered ID to the least-loaded scene in its target act.
      for (const clueId of uncoveredIds) {
        const clueEntry = (ctx.clues!.clues as any[]).find((c) => c.id === clueId);
        const placement: string = clueEntry?.placement ?? "mid";
        const targetAct = placement === "early" ? 1 : placement === "late" ? 3 : 2;
        const actScenes = allScenes.filter((s: any) => s.act === targetAct);
        const candidates = actScenes.length > 0 ? actScenes : allScenes;
        const sorted = [...candidates].sort(
          (a: any, b: any) => (a.cluesRevealed?.length ?? 0) - (b.cluesRevealed?.length ?? 0)
        );
        const target = sorted[0];
        if (target) {
          if (!Array.isArray(target.cluesRevealed)) target.cluesRevealed = [];
          if (!target.cluesRevealed.includes(clueId)) {
            target.cluesRevealed.push(clueId);
          }
        }
      }
      ctx.warnings.push(
        `Clue-coverage gate: deterministically force-assigned ${uncoveredIds.length} unanchored` +
        ` clue ID(s) to scenes: ${uncoveredIds.join(", ")}.`
      );
    } else {
      ctx.warnings.push(
        `Clue-coverage gate passed: all ${allDistributionIds.length} clue ID(s) are assigned to ≥1 scene.`
      );
    }
  }
}
