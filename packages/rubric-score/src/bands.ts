/**
 * Score bands (scoring-approach.md § Score Bands). The /100 total maps to a calibration band; the
 * cap engine also uses the band as the headline label.
 */

import type { Band } from "./types.js";

const BANDS: Array<{ min: number; label: Band }> = [
  { min: 90, label: "Excellent, polished mystery" },
  { min: 80, label: "Very strong" },
  { min: 70, label: "Solid draft" },
  { min: 60, label: "Promising but rough" },
  { min: 50, label: "Usable concept, messy execution" },
  { min: 40, label: "Major continuity problems" },
  { min: 0, label: "Hard to follow as a story" },
];

export function bandFor(total: number): Band {
  return (BANDS.find((b) => total >= b.min) ?? BANDS[BANDS.length - 1]).label;
}
