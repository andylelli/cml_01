/**
 * The prose stage's result, as the v2 engine writes it to `ctx.prose`.
 *
 * Owner decision 1 (2026-09-30): v1's `ProseGenerationResult` carried its batch, linter, phrase and
 * fallback telemetry (validationDetails, prompt_fingerprints, repairEfficacy, …); v2 never wrote them, so
 * after v1's deletion they are dropped rather than kept as always-absent optionals.
 */
export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ProseGenerationResult {
  status: "draft" | "final";
  tone?: string;
  chapters: ProseChapter[];
  cast: string[];
  note?: string;
  cost: number;
  durationMs: number;
}
