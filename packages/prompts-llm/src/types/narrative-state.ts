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
  chapterSummaries: Array<{ chapterNumber: number; summary: string }>;
}

/**
 * Classify a chapter's opening sentence into a coarse style bucket.
 * Used to populate usedOpeningStyles so subsequent batches avoid repetition.
 */
export function classifyOpeningStyle(openingSentence: string): string {
  const s = openingSentence.trim().toLowerCase();
  if (s.startsWith('"') || s.startsWith('\u2018') || s.startsWith('\u201c')) return 'dialogue-open';
  if (/^(the|a|an) [a-z]+ (of|in|at|from|with)/.test(s)) return 'noun-phrase-atmosphere';
  if (/^(it was|there was|there had been)/.test(s)) return 'expository-setup';
  if (/^(when|after|before|as|by the time)/.test(s)) return 'temporal-subordinate';
  // character-action: a named character (one word) + any motion/state/speech verb
  if (/^[a-z]+ (had|was|were|stood|sat|lay|walked|entered|opened|closed|crossed|turned|moved|stepped|came|went|approached|returned|glanced|gazed|looked|paused|stopped|raised|leaned|rose|drew|shook|nodded|said|asked|replied|stared|peered|bent|reached|seized|grasped|held|placed|set|picked|dropped|threw|carried|hurried|ran|rushed|noticed|watched|examined|surveyed|studied|pressed|pulled|pushed|removed|produced|found|searched|checked|picked|read|wrote|spoke|heard|felt|knew|thought|considered|decided|began|started)/.test(s)) return 'character-action';
  // digit-based time anchor (9 PM, 9.30 a.m., etc.)
  if (/\d{1,2}(\.\d{1,2})?\s*(a\.m\.|p\.m\.|o'clock|am|pm)/i.test(s)) return 'time-anchor';
  // word-based time anchor (At half past nine..., At midnight..., etc.)
  if (/^at (half past|a quarter (to|past)|[a-z]+ o'clock|midnight|noon|dawn|dusk|daybreak|nightfall|sunrise|sunset)/i.test(s)) return 'time-anchor';
  return 'general-descriptive';
}

/**
 * Extract simple "adjective noun" sensory phrases from a paragraph of prose.
 * Returns up to `limit` unique phrases.
 */
export function extractSensoryPhrases(text: string, limit = 5): string[] {
  const matches = text.match(/\b(cold|warm|dark|pale|sharp|heavy|sweet|bitter|damp|stale|rich|faint|thick|soft|hard|bright|dim|grey|gray|amber|quiet|silent|still|raw|acrid|musty|woody|earthy|smoky|chill|hollow)\s+[a-z]+\b/gi) ?? [];
  return [...new Set(matches.map(m => m.toLowerCase()))].slice(0, limit);
}

/**
 * Build a fresh NarrativeState from lockedFacts and a character→gender map.
 */
export function initNarrativeState(
  lockedFacts: LockedFact[],
  characterGenders: Record<string, string>,
): NarrativeState {
  const characterPronouns: Record<string, string> = {};
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
export function updateNSD(
  current: NarrativeState,
  completedChapters: Array<{ title?: string; summary?: string; paragraphs?: string[] }>,
  startChapterNumber: number,
): NarrativeState {
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
      if (!newPhrases.includes(p)) newPhrases.push(p);
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
