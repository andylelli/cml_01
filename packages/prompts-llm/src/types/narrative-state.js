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
/**
 * Classify a chapter's opening sentence into a coarse style bucket.
 * Used to populate usedOpeningStyles so subsequent batches avoid repetition.
 */
export function classifyOpeningStyle(openingSentence) {
    const s = openingSentence.trim().toLowerCase();
    if (s.startsWith('"') || s.startsWith('\u2018') || s.startsWith('\u201c'))
        return 'dialogue-open';
    if (/^(the|a|an) [a-z]+ (of|in|at|from|with)/.test(s))
        return 'noun-phrase-atmosphere';
    if (/^(it was|there was|there had been)/.test(s))
        return 'expository-setup';
    if (/^(when|after|before|as|by the time)/.test(s))
        return 'temporal-subordinate';
    if (/^[a-z]+ (had|was|were|stood|sat|lay|walked|entered|opened|closed)/.test(s))
        return 'character-action';
    if (/\d{1,2}(\.\d{1,2})?\s*(a\.m\.|p\.m\.|o'clock|am|pm)/i.test(s))
        return 'time-anchor';
    return 'general-descriptive';
}
/**
 * Extract simple "adjective noun" sensory phrases from a paragraph of prose.
 * Returns up to `limit` unique phrases.
 */
export function extractSensoryPhrases(text, limit = 5) {
    const matches = text.match(/\b(cold|warm|dark|pale|sharp|heavy|sweet|bitter|damp|stale|rich|faint|thick|soft|hard|bright|dim|grey|gray|amber|quiet|silent|still|raw|acrid|musty|woody|earthy|smoky|chill|hollow)\s+[a-z]+\b/gi) ?? [];
    return [...new Set(matches.map(m => m.toLowerCase()))].slice(0, limit);
}
/**
 * Build a fresh NarrativeState from lockedFacts and a character→gender map.
 */
export function initNarrativeState(lockedFacts, characterGenders) {
    const characterPronouns = {};
    for (const [name, gender] of Object.entries(characterGenders)) {
        const g = gender?.toLowerCase();
        characterPronouns[name] = g === 'male' ? 'he/him/his' : g === 'female' ? 'she/her/her' : 'they/them/their';
    }
    return {
        version: 1,
        lockedFacts,
        characterPronouns,
        usedOpeningStyles: [],
        usedSensoryPhrases: [],
        cluesRevealedToReader: [],
        chapterSummaries: [],
    };
}
/**
 * Update NarrativeState after a completed batch of chapters.
 * Returns a new state object (does not mutate the original).
 */
export function updateNSD(current, completedChapters, startChapterNumber) {
    const newStyles = [...current.usedOpeningStyles];
    const newPhrases = [...current.usedSensoryPhrases];
    const newSummaries = [...current.chapterSummaries];
    completedChapters.forEach((chapter, idx) => {
        // Extract style from first sentence of first paragraph
        const firstPara = (chapter.paragraphs ?? [])[0] ?? '';
        const firstSentenceMatch = firstPara.match(/^[^.!?]+[.!?]/);
        if (firstSentenceMatch) {
            const style = classifyOpeningStyle(firstSentenceMatch[0]);
            newStyles.push(style);
        }
        // Extract sensory phrases from all paragraphs
        const allText = (chapter.paragraphs ?? []).join(' ');
        const phrases = extractSensoryPhrases(allText);
        phrases.forEach(p => {
            if (!newPhrases.includes(p))
                newPhrases.push(p);
        });
        // Record summary
        newSummaries.push({
            chapterNumber: startChapterNumber + idx,
            summary: chapter.summary ?? '',
        });
    });
    return {
        ...current,
        // Keep last 8 opening styles, last 20 sensory phrases
        usedOpeningStyles: newStyles.slice(-8),
        usedSensoryPhrases: newPhrases.slice(-20),
        chapterSummaries: newSummaries,
    };
}
//# sourceMappingURL=narrative-state.js.map