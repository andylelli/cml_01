/**
 * Canonical story length keys. Numeric targets are YAML-configured via
 * story_length_policy in generation params.
 */
export declare const STORY_LENGTH_KEYS: readonly ["short", "medium", "long"];
export type StoryLength = (typeof STORY_LENGTH_KEYS)[number];
type StoryLengthTarget = {
    scenes: number;
    chapters: number;
    minWords: number;
    maxWords: number;
    chapterMinWords: number;
    chapterIdealWords: number;
};
/** Canonical source path used by diagnostics for provenance. */
export declare const STORY_LENGTH_TARGETS_SOURCE = "apps/worker/config/generation-params.yaml#story_length_policy";
/** Returns the expected scene count for the given story length. */
export declare function getSceneTarget(length?: string): number;
/** Returns the expected chapter count for the given story length. */
export declare function getChapterTarget(length?: string): number;
/** Returns allowed +/- chapter/scene variance around chapter targets. */
export declare function getChapterTargetTolerance(): number;
/** Returns fully resolved story length targets (chapter counts + word targets) from YAML config. */
export declare function getStoryLengthTarget(length?: string): StoryLengthTarget;
/** Returns canonical target metadata for diagnostics/report payloads. */
export declare function getStoryLengthTargetMetadata(length?: string): {
    readonly source: "apps/worker/config/generation-params.yaml#story_length_policy";
    readonly fingerprint: `story_length_policy:${string}`;
    readonly target_length: "short" | "medium" | "long";
    readonly target: StoryLengthTarget;
};
export {};
