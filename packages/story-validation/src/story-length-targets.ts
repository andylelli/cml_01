/**
 * SINGLE SOURCE OF TRUTH for story length targets.
 *
 * ALL packages must import these values from here.
 * Do NOT hardcode scene/chapter counts, word targets, or per-chapter word
 * targets anywhere else in the codebase.
 *
 * YAML override: numeric targets are configured under story_length_policy in
 * apps/worker/config/generation-params.yaml (override with CML_GENERATION_PARAMS_PATH).
 *
 * Architecture note:
 *   agent7-narrative generates exactly `scenes` scenes per story length.
 *   agent9-prose converts each scene 1:1 into a prose chapter.
 *   Therefore scenes === chapters and both scorers must use this file.
 */
import { getGenerationParams } from './generation-params.js';

/** Canonical source path used by diagnostics for provenance. */
export const STORY_LENGTH_TARGETS_SOURCE = "apps/worker/config/generation-params.yaml#story_length_policy" as const;

/** Canonical story length keys. */
export const STORY_LENGTH_KEYS = ["short", "medium", "long"] as const;

/**
 * Static fallback constants. Use the helper functions below for runtime queries
 * (getChapterTarget, getStoryLengthTarget, etc.) — they read from YAML config.
 * This object is kept for backward-compat and compile-time checks only.
 */
export const STORY_LENGTH_TARGETS = {
  short: {
    scenes: 20,
    chapters: 20,
    minWords: 15_000,
    maxWords: 25_000,
    chapterMinWords: 800,
    chapterIdealWords: 1_000,
  },
  medium: {
    scenes: 30,
    chapters: 30,
    minWords: 40_000,
    maxWords: 60_000,
    chapterMinWords: 1_200,
    chapterIdealWords: 1_700,
  },
  long: {
    scenes: 42,
    chapters: 42,
    minWords: 70_000,
    maxWords: 100_000,
    chapterMinWords: 1_500,
    chapterIdealWords: 2_200,
  },
} as const;

export type StoryLength = (typeof STORY_LENGTH_KEYS)[number];

// ---------------------------------------------------------------------------
// Compile-time guard: scenes must always equal chapters.
// If someone edits the object above and breaks this invariant, TS will error.
// ---------------------------------------------------------------------------
type AssertEqual<A extends number, B extends number> =
  A extends B ? (B extends A ? true : never) : never;
const _short:  AssertEqual<typeof STORY_LENGTH_TARGETS.short.scenes,  typeof STORY_LENGTH_TARGETS.short.chapters>  = true;
const _medium: AssertEqual<typeof STORY_LENGTH_TARGETS.medium.scenes, typeof STORY_LENGTH_TARGETS.medium.chapters> = true;
const _long:   AssertEqual<typeof STORY_LENGTH_TARGETS.long.scenes,   typeof STORY_LENGTH_TARGETS.long.chapters>   = true;
// Suppress "unused variable" warnings — these are purely compile-time.
void _short; void _medium; void _long;

// ---------------------------------------------------------------------------
// Helpers (read from YAML config via getGenerationParams, fall back to static)
// ---------------------------------------------------------------------------

const validLength = (length?: string): StoryLength =>
  (STORY_LENGTH_KEYS.includes(length as StoryLength) ? length : 'medium') as StoryLength;

/** Returns the expected scene count for the given story length. */
export function getSceneTarget(length?: string): number {
  const len = validLength(length);
  const policy = getGenerationParams().story_length_policy;
  return policy.targets[len] ?? STORY_LENGTH_TARGETS[len].scenes;
}

/** Returns the expected chapter count for the given story length. */
export function getChapterTarget(length?: string): number {
  return getSceneTarget(length);
}

/** Returns the allowed ±tolerance on chapter count before flagging a deviation. */
export function getChapterTargetTolerance(): number {
  return getGenerationParams().story_length_policy.chapter_target_tolerance;
}

/** Returns fully resolved story length targets (chapter counts + word targets) from YAML config. */
export function getStoryLengthTarget(length?: string) {
  const len = validLength(length);
  const policy = getGenerationParams().story_length_policy;
  const chapters = policy.targets[len];
  const wt = policy.word_targets[len];
  return {
    scenes: chapters,
    chapters,
    minWords: wt.min_words,
    maxWords: wt.max_words,
    chapterMinWords: Math.floor(wt.min_words / chapters),
    chapterIdealWords: wt.chapter_ideal_words,
  };
}

/** Returns canonical target metadata for diagnostics/report payloads. */
export function getStoryLengthTargetMetadata(length?: string) {
  const len = validLength(length);
  const target = getStoryLengthTarget(len);
  const tolerance = getChapterTargetTolerance();
  const fingerprint = `story_length_policy:${len}:${target.chapters}+/-${tolerance}/${target.minWords}-${target.maxWords}/${target.chapterMinWords}/${target.chapterIdealWords}` as const;
  return {
    source: STORY_LENGTH_TARGETS_SOURCE,
    fingerprint,
    target_length: len,
    target,
  } as const;
}

