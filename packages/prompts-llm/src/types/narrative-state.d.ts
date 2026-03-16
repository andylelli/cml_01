/**
 * NarrativeState — a live state object threaded through prose generation batches.
 *
 * Carries ground-truth facts and style-register history so each batch of chapters
 * can avoid contradicting physical evidence or repeating opening style classes used
 * in earlier batches.
 *
 * Lifecycle:
 *  1. Initialised in mystery-orchestrator before the first prose call
 *  2. Injected into ProseGenerationInputs as `narrativeState`
 *  3. buildNSDBlock() (agent9-prose) formats it into the system prompt
 *  4. updateNSD() (mystery-orchestrator) extracts opening sentences + sensory phrases
 *     from each completed batch and returns an updated state for the next batch
 */
export interface LockedFact {
    id: string;
    value: string;
    description: string;
    appearsInChapters?: string[];
}
export interface NarrativeState {
    version: 1;
    /** Ground-truth physical evidence values that prose must never contradict. */
    lockedFacts: LockedFact[];
    /** Map from character name to pronoun string "he/him/his" | "she/her/her" | "they/them/their". */
    characterPronouns: Record<string, string>;
    /** Opening-sentence style classes used so far — keeps last 8, oldest first. */
    usedOpeningStyles: string[];
    /** Sensory phrases (adjective + noun) used so far — keeps last 20, oldest first. */
    usedSensoryPhrases: string[];
    /** Clue IDs from the narrative outline that have already been revealed to the reader. */
    cluesRevealedToReader: string[];
    /** Brief per-chapter summaries accumulated as each batch completes. */
    chapterSummaries: Array<{
        chapterNumber: number;
        summary: string;
    }>;
}
/**
 * Classify a chapter's opening sentence into a coarse style bucket.
 * Used to populate usedOpeningStyles so subsequent batches avoid repetition.
 */
export declare function classifyOpeningStyle(openingSentence: string): string;
/**
 * Extract simple "adjective noun" sensory phrases from a paragraph of prose.
 * Returns up to `limit` unique phrases.
 */
export declare function extractSensoryPhrases(text: string, limit?: number): string[];
/**
 * Build a fresh NarrativeState from lockedFacts and a character→gender map.
 */
export declare function initNarrativeState(lockedFacts: LockedFact[], characterGenders: Record<string, string>): NarrativeState;
/**
 * Update NarrativeState after a completed batch of chapters.
 * Returns a new state object (does not mutate the original).
 */
export declare function updateNSD(current: NarrativeState, completedChapters: Array<{
    title?: string;
    summary?: string;
    paragraphs?: string[];
}>, startChapterNumber: number): NarrativeState;
