/**
 * Story-title derivation — single source of truth for "what string is the story's title".
 *
 * Background: Agent 9 stores a diagnostic *note* on the prose payload, e.g.
 *   "Generated in scene batches. 10 batch(es) required retry for validation."
 * Several file/PDF writers historically used `prose.note` as a *title* fallback, so when a real
 * title was missing the diagnostic note leaked into the story's H1 and even the filename slug
 * (e.g. `generated_in_scene_batches_10_batch_es_required_.md`). A note is generation metadata,
 * never a title. This helper centralises the rule so every writer (API + worker) behaves the same.
 */

/**
 * Distinctive fragments of Agent 9's generation/diagnostic notes. Any title candidate matching one
 * of these is process residue, not a real title, and must be rejected.
 */
const GENERATION_RESIDUE =
  /generated in scene batches|batch\(es\)\s*required|required retry for validation/i;

/** True when `text` is generation/diagnostic residue (a process note) rather than a real title. */
export const isGenerationResidueTitle = (text: unknown): boolean =>
  typeof text === "string" && GENERATION_RESIDUE.test(text);

/** Return a trimmed, non-empty, non-residue title candidate, or `undefined` if unusable. */
const pickTitle = (value: unknown): string | undefined => {
  if (typeof value !== "string") return undefined;
  const trimmed = value.trim();
  if (!trimmed || isGenerationResidueTitle(trimmed)) return undefined;
  return trimmed;
};

/**
 * Derive a real story title from a prose payload.
 *
 * Order of preference:
 *   1. `prose.title`     — the title the pipeline assigned to the story.
 *   2. `fallbackTitle`   — e.g. the synopsis/case title supplied by the caller.
 *   3. `"Mystery Story"` — a safe generic default.
 *
 * `prose.note` is **deliberately never** consulted: it is generation metadata, and using it as a
 * title is the root cause of the diagnostic-note leak. Residue strings are rejected at every step.
 */
export const deriveStoryTitle = (
  prose: { title?: unknown; note?: unknown } | null | undefined,
  fallbackTitle?: unknown,
): string => pickTitle(prose?.title) ?? pickTitle(fallbackTitle) ?? "Mystery Story";
