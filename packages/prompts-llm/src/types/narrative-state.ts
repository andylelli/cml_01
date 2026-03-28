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
 *  4. updateNSD() advances the state after each completed chapter
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
  /** Clue IDs from the narrative outline that have already been revealed to the reader. */
  cluesRevealedToReader: string[];
  /** Last paragraph of the most recently completed chapter — used for opening continuity. */
  continuityTail: string;
}

/**
 * Classify a chapter's opening sentence into a coarse style bucket.
 * Used by the prose linter to check within-batch opening-style variety.
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
 * Build a fresh NarrativeState from lockedFacts and a character→gender map.
 */
export function initNarrativeState(
  lockedFacts: LockedFact[],
  characterGenders: Record<string, string>,
): NarrativeState {
  const characterPronouns: Record<string, string> = {};
  for (const [name, gender] of Object.entries(characterGenders)) {
    const g = gender?.toLowerCase();
    if (g === 'male') characterPronouns[name] = 'he/him/his';
    else if (g === 'female') characterPronouns[name] = 'she/her/her';
    else if (g === 'non-binary') characterPronouns[name] = 'they/them/their';
    // else: unknown — omit from pronoun instructions so prose can use natural gender
  }
  return {
    version: 1,
    lockedFacts,
    characterPronouns,
    cluesRevealedToReader: [],
    continuityTail: '',
  };
}

/**
 * Update NarrativeState after a completed chapter.
 * Returns a new state object (does not mutate the original).
 *
 * @param current   The current NarrativeState
 * @param lastChapter  The just-completed chapter data
 */
export function updateNSD(
  current: NarrativeState,
  lastChapter: { paragraphs?: string[]; cluesRevealedIds?: string[] },
): NarrativeState {
  const newClues = [...current.cluesRevealedToReader];
  for (const id of (lastChapter.cluesRevealedIds ?? [])) {
    if (!newClues.includes(id)) newClues.push(id);
  }
  // Continuity tail: last paragraph of the chapter, used to anchor the next chapter's opening
  const paragraphs = lastChapter.paragraphs ?? [];
  const continuityTail = paragraphs.length > 0 ? (paragraphs[paragraphs.length - 1] ?? '') : '';
  return {
    ...current,
    cluesRevealedToReader: newClues,
    continuityTail,
  };
}

