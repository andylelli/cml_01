/**
 * Bounded outline repair — the only thing an unclosed geometry is allowed to do.
 *
 * It never aborts (ADR-0003), never writes prose, never assigns a scene the scheduler owns, and never
 * removes anything. Every edit here is ADDITIVE — the `applyPlantBeforeReveal` argument: an additive
 * stamp cannot violate the clue-pacing or coverage gates, because nothing that was there stops being
 * there. What it cannot repair, it leaves unmet and loud.
 *
 * What it deliberately does NOT attempt: adding a chapter, moving a beat, or splitting a reveal from
 * an aftermath. Those are the scheduler's and Agent 7's, and a geometry stage that reached into them
 * would be the fourth component in the same space (§4.1).
 */

import { checkGeometryClosure } from "./closure.js";
import { caseOf, flattenScenes } from "./derive.js";
import type { GeometryOutline, StoryGeometry } from "./types.js";

export interface GeometryRepairResult {
  /** One line per edit actually made, for the warning and the report diagnostic. */
  repairs: string[];
  /** Closure re-evaluated after the repairs — never assumed. */
  closure: StoryGeometry["closure"];
}

/**
 * Repair what is repairable, in place, and re-check closure.
 *
 * `narrative` is mutated additively when supplied (that is the point — Agent 9 reads the outline, not
 * this object). `geometry` is mutated to reflect the repaired contract.
 */
export const applyGeometryOutlineRepair = (
  geometry: StoryGeometry,
  narrative: GeometryOutline | null | undefined,
  cml: unknown,
): GeometryRepairResult => {
  const repairs: string[] = [];

  // ── contract-internal repairs ─────────────────────────────────────────────
  if (geometry.methodSignature && geometry.methodSignature.plantChapter !== 1) {
    geometry.methodSignature.plantChapter = 1;
    repairs.push("method_signature.plantChapter → 1");
  }
  if (geometry.clincher && geometry.clincher.plantByChapter >= geometry.clincher.payoffChapter) {
    // Only claim the repair when there is somewhere earlier to put it. A one-chapter story has no
    // chapter before its payoff, so the constraint stays unmet — a repair that reports success
    // without achieving it is worse than none, because the closure re-check then reads as a pass.
    const corrected = geometry.clincher.payoffChapter - 1;
    if (corrected >= 1) {
      geometry.clincher.plantByChapter = corrected;
      repairs.push(`clincher.plantByChapter → ${corrected} (a plant must precede its payoff)`);
    }
  }

  // ── additive outline stamps ───────────────────────────────────────────────
  const scenes = flattenScenes(narrative ?? null);
  if (scenes.length > 0) {
    // Declare each bound chapter's role ON the outline scene. `resolveStageModeKey` infers the same
    // thing from beat labels today; this gives that machinery a declared input instead of a guessed
    // one (§8.7). Additive: a consumer that does not read `geometryRole` is unaffected.
    for (const contract of geometry.chapterContract) {
      const scene = scenes[contract.chapter - 1] as Record<string, unknown> | undefined;
      if (!scene) continue;
      if (scene.geometryRole !== contract.role) {
        scene.geometryRole = contract.role;
        repairs.push(`scene ${contract.chapter}.geometryRole → ${contract.role}`);
      }
    }

    // Plant the clincher early if the outline does not already carry it. Mirrors the A_64 C1 stamp:
    // an incidental, unflagged appearance whose significance stays hidden until the payoff.
    const clincher = geometry.clincher;
    if (clincher?.clueId) {
      const window = scenes.slice(0, Math.min(clincher.plantByChapter, scenes.length));
      const alreadyPresent = window.some(
        (s) =>
          (Array.isArray(s?.cluesPlanted) ? s.cluesPlanted : []).map(String).includes(clincher.clueId!) ||
          (Array.isArray(s?.cluesRevealed) ? s.cluesRevealed : []).map(String).includes(clincher.clueId!),
      );
      if (!alreadyPresent && window.length > 0) {
        const target = window[window.length - 1] as Record<string, unknown>;
        const planted = Array.isArray(target.cluesPlanted) ? (target.cluesPlanted as string[]) : [];
        target.cluesPlanted = [...planted, clincher.clueId];
        repairs.push(`scene ${window.length}.cluesPlanted += ${clincher.clueId} (clincher plant)`);
      }
    }
  }

  // Re-check rather than assume. A repair that did not close what it claimed to close must show up
  // as still-unmet — the alternative is a gate that reports success it did not achieve.
  geometry.closure = checkGeometryClosure(geometry, caseOf(cml));
  return { repairs, closure: geometry.closure };
};
