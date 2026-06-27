/**
 * Internal↔external calibration hook (ANALYSIS_51 K2 §3 / aligning-the-scoring-system §7).
 *
 * The final judge is only trustworthy if its number stays close to a periodic EXTERNAL re-score of the
 * same story (the A_50 §8 gap: internal 72 vs ChatGPT 56). This is the documented seam to record that
 * external re-score and compute the delta, so the pipeline can surface "internal↔external agree within
 * single digits" as the K2 acceptance gate. Pure data + a delta function — no LLM call here; the
 * external score is supplied by whatever harness produces it (a human, ChatGPT against the same rubric).
 */

import type { Category } from "./types.js";

/** An external re-score of a story against the SAME rubric (human or a stronger external model). */
export interface ExternalRescore {
  /** A stable id for the story this re-score corresponds to (runId / story id). */
  storyId: string;
  /** The external overall /100. */
  external: number;
  /** Optional per-category /10 marks, for category-level drift. */
  categories?: Partial<Record<Category, number>>;
  /** Free-text provenance: "ChatGPT 2026-06-27", "human:AL", etc. */
  source?: string;
  /** ISO timestamp of when the re-score was taken. */
  recordedAt?: string;
}

/** The computed agreement between the internal (capped) score and an external re-score. */
export interface CalibrationDelta {
  storyId: string;
  internal: number;
  external: number;
  /** internal − external (signed; positive = the internal judge over-scored). */
  delta: number;
  /** |internal − external|. */
  absDelta: number;
  /** True when |delta| is within the K2 acceptance band (single digits, i.e. < 10). */
  withinSingleDigits: boolean;
  /** Per-category signed deltas, when the external re-score supplied category marks. */
  categoryDeltas?: Partial<Record<Category, number>>;
  source?: string;
  recordedAt?: string;
}

/** The K2 acceptance band: internal and external must agree within single digits. */
export const CALIBRATION_SINGLE_DIGIT_BAND = 10;

/**
 * Compute the internal↔external calibration delta for one story. `internal` is the cap-engine `final`
 * (the number the pipeline ships); `external` is the re-score. The acceptance gate (K2 §3) is
 * `withinSingleDigits`.
 */
export function computeCalibrationDelta(
  internal: number,
  external: ExternalRescore,
  internalCategories?: Partial<Record<Category, number>>,
): CalibrationDelta {
  const delta = internal - external.external;
  const absDelta = Math.abs(delta);

  let categoryDeltas: Partial<Record<Category, number>> | undefined;
  if (external.categories && internalCategories) {
    categoryDeltas = {};
    for (const cat of Object.keys(external.categories) as Category[]) {
      const ext = external.categories[cat];
      const int = internalCategories[cat];
      if (typeof ext === "number" && typeof int === "number") categoryDeltas[cat] = int - ext;
    }
  }

  return {
    storyId: external.storyId,
    internal,
    external: external.external,
    delta,
    absDelta,
    withinSingleDigits: absDelta < CALIBRATION_SINGLE_DIGIT_BAND,
    categoryDeltas,
    source: external.source,
    recordedAt: external.recordedAt,
  };
}

/** Summary agreement across a labelled calibration set (mean abs error + share within band). */
export interface CalibrationSummary {
  count: number;
  meanAbsError: number;
  /** Fraction of stories whose internal↔external agree within single digits (the K2 target → 1.0). */
  withinBandRate: number;
}

export function summarizeCalibration(deltas: CalibrationDelta[]): CalibrationSummary {
  if (deltas.length === 0) return { count: 0, meanAbsError: 0, withinBandRate: 0 };
  const meanAbsError = deltas.reduce((s, d) => s + d.absDelta, 0) / deltas.length;
  const withinBandRate = deltas.filter((d) => d.withinSingleDigits).length / deltas.length;
  return { count: deltas.length, meanAbsError, withinBandRate };
}
