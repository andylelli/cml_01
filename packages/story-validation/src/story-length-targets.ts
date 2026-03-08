/**
 * SINGLE SOURCE OF TRUTH for story length targets.
 *
 * ALL packages must import these values from here.
 * Do NOT hardcode scene/chapter counts, word targets, or per-chapter word
 * targets anywhere else in the codebase.
 *
 * Architecture note:
 *   agent7-narrative generates exactly `scenes` scenes per story length.
 *   agent9-prose converts each scene 1:1 into a prose chapter.
 *   Therefore scenes === chapters and both scorers must use this file.
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

export type StoryLength = keyof typeof STORY_LENGTH_TARGETS;

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
// Helpers
// ---------------------------------------------------------------------------

/** Returns the expected scene count for the given story length. */
export function getSceneTarget(length?: string): number {
  return STORY_LENGTH_TARGETS[(length as StoryLength) ?? 'medium']?.scenes ?? 30;
}

/** Returns the expected chapter count for the given story length. */
export function getChapterTarget(length?: string): number {
  return STORY_LENGTH_TARGETS[(length as StoryLength) ?? 'medium']?.chapters ?? 30;
}
