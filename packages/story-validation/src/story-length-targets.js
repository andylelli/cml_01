import { getGenerationParams } from "./generation-params.js";
/**
 * Canonical story length keys. Numeric targets are YAML-configured via
 * story_length_policy in generation params.
 */
export const STORY_LENGTH_KEYS = ["short", "medium", "long"];
/** Canonical source path used by diagnostics for provenance. */
export const STORY_LENGTH_TARGETS_SOURCE = "apps/worker/config/generation-params.yaml#story_length_policy";
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
/** Returns the expected scene count for the given story length. */
export function getSceneTarget(length) {
    return getChapterTarget(length);
}
/** Returns the expected chapter count for the given story length. */
export function getChapterTarget(length) {
    const resolvedLength = STORY_LENGTH_KEYS.includes(length)
        ? length
        : "medium";
    const chapterTargets = getGenerationParams().story_length_policy.chapter_targets;
    return Math.floor(chapterTargets[resolvedLength]);
}
/** Returns allowed +/- chapter/scene variance around chapter targets. */
export function getChapterTargetTolerance() {
    return Math.max(0, Math.floor(getGenerationParams().story_length_policy.chapter_target_tolerance));
}
/** Returns fully resolved story length targets (chapter counts + word targets) from YAML config. */
export function getStoryLengthTarget(length) {
    const resolvedLength = STORY_LENGTH_KEYS.includes(length)
        ? length
        : "medium";
    const config = getGenerationParams().story_length_policy;
    const configuredWords = config.word_targets[resolvedLength];
    const resolvedChapters = getChapterTarget(resolvedLength);
    const derivedChapterMinWords = Math.max(1, Math.floor(configuredWords.min_words / Math.max(1, resolvedChapters)));
    return {
        scenes: resolvedChapters,
        chapters: resolvedChapters,
        minWords: Math.floor(configuredWords.min_words),
        maxWords: Math.floor(configuredWords.max_words),
        chapterMinWords: derivedChapterMinWords,
        chapterIdealWords: Math.floor(configuredWords.chapter_ideal_words),
    };
}
/** Returns canonical target metadata for diagnostics/report payloads. */
export function getStoryLengthTargetMetadata(length) {
    const resolvedLength = STORY_LENGTH_KEYS.includes(length)
        ? length
        : "medium";
    const config = getGenerationParams().story_length_policy;
    const chapterTargets = config.chapter_targets;
    const chapterTargetTolerance = getChapterTargetTolerance();
    const target = getStoryLengthTarget(resolvedLength);
    const runtimeFingerprint = STORY_LENGTH_KEYS
        .map((len) => {
        const words = config.word_targets[len];
        const chapters = Math.max(1, Math.floor(chapterTargets[len]));
        const derivedChapterMinWords = Math.max(1, Math.floor(words.min_words / chapters));
        return `${len}:${chapterTargets[len]}+/-${chapterTargetTolerance}/${words.min_words}-${words.max_words}/${derivedChapterMinWords}/${words.chapter_ideal_words}`;
    })
        .join("|");
    return {
        source: STORY_LENGTH_TARGETS_SOURCE,
        fingerprint: `story_length_policy:${runtimeFingerprint}`,
        target_length: resolvedLength,
        target,
    };
}
//# sourceMappingURL=story-length-targets.js.map