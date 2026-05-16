/**
 * Deterministic Pronoun Repair
 *
 * Post-generation pass that corrects gender-pronoun mismatches before validation.
 * The LLM will occasionally assign wrong-gender pronouns to characters; no amount
 * of prompt engineering eliminates this completely.  This module deterministically
 * fixes pronouns that are unambiguously attributed to a single named character.
 *
 * Safety rules — we ONLY repair when confident:
 *   1. Exactly one character is named in the sentence (unambiguous reference).
 *   2. The pronoun gender is wrong for that character.
 *   3. No other character of the pronoun's gender is named nearby (context window).
 *
 * Follow-up sentences (no named character) inherit the last-named character.
 */

export interface CastEntry {
  name: string;
  gender?: string;
  aliases?: string[];
}

interface PronounSet {
  subject: string;   // he / she / they
  object: string;    // him / her / them
  possessive: string; // his / her / their
  reflexive: string;  // himself / herself / themselves
}

interface CharacterPronounInfo {
  canonical: string;
  labels: string[];  // lowercased name + aliases
  gender: string;
  pronouns: PronounSet;
}

const PRONOUN_MAP: Record<string, PronounSet> = {
  male: { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' },
  female: { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
};

// All gendered pronouns we may repair (lowercased).
const MALE_PRONOUNS = new Set(['he', 'him', 'his', 'himself']);
const FEMALE_PRONOUNS = new Set(['she', 'her', 'hers', 'herself']);

function genderOfPronoun(pronoun: string): string | null {
  const lower = pronoun.toLowerCase();
  if (MALE_PRONOUNS.has(lower)) return 'male';
  if (FEMALE_PRONOUNS.has(lower)) return 'female';
  return null;
}

/**
 * Map a wrong-gender pronoun to the correct form for the target character,
 * preserving original casing style.
 */
function correctPronoun(wrongPronoun: string, targetPronouns: PronounSet): string | null {
  const lower = wrongPronoun.toLowerCase();

  // Determine the grammatical role of the wrong pronoun
  let corrected: string | null = null;
  if (lower === 'he' || lower === 'she') {
    corrected = targetPronouns.subject;
  } else if (lower === 'him' || lower === 'her') {
    // "her" is ambiguous (object or possessive); we handle possessive via context below
    // For standalone object position, map to object form.
    corrected = targetPronouns.object;
  } else if (lower === 'his' || lower === 'hers') {
    corrected = targetPronouns.possessive;
  } else if (lower === 'himself' || lower === 'herself') {
    corrected = targetPronouns.reflexive;
  }

  if (!corrected) return null;

  // Preserve casing: if original starts uppercase, capitalize replacement
  if (wrongPronoun[0] === wrongPronoun[0].toUpperCase()) {
    corrected = corrected[0].toUpperCase() + corrected.slice(1);
  }
  return corrected;
}

function buildCharacterInfo(cast: CastEntry[]): CharacterPronounInfo[] {
  return cast
    .filter((c) => c.gender && (c.gender.toLowerCase() === 'male' || c.gender.toLowerCase() === 'female'))
    .map((c) => {
      const gender = c.gender!.toLowerCase();
      const labels = [c.name.toLowerCase()];
      // Add surname as label
      const parts = c.name.trim().split(/\s+/);
      if (parts.length > 1) {
        labels.push(parts[parts.length - 1].toLowerCase());
      }
      // Add first name as label
      if (parts.length > 1) {
        labels.push(parts[0].toLowerCase());
      }
      if (Array.isArray(c.aliases)) {
        for (const alias of c.aliases) {
          if (alias) labels.push(alias.toLowerCase());
        }
      }
      return {
        canonical: c.name,
        labels: Array.from(new Set(labels)),
        gender,
        pronouns: PRONOUN_MAP[gender],
      };
    });
}

/**
 * Check if any of a character's labels appear in the text segment.
 * Uses word-boundary matching to avoid partial matches.
 */
function characterMentionedIn(text: string, labels: string[]): boolean {
  const lower = text.toLowerCase();
  return labels.some((label) => {
    const idx = lower.indexOf(label);
    if (idx === -1) return false;
    // Check word boundaries
    const before = idx === 0 || /\W/.test(lower[idx - 1]);
    const after = idx + label.length >= lower.length || /\W/.test(lower[idx + label.length]);
    return before && after;
  });
}

/**
 * Find all characters mentioned in a text segment.
 */
function findMentionedCharacters(text: string, characters: CharacterPronounInfo[]): CharacterPronounInfo[] {
  return characters.filter((c) => characterMentionedIn(text, c.labels));
}

/**
 * Replace gendered pronouns in a sentence when we know exactly which character
 * they belong to and the gender is wrong.
 *
 * We match whole-word pronoun forms and replace preserving case.
 * "her" is grammatically ambiguous (object vs possessive).  We use a heuristic:
 *   - "her" followed by a noun/adjective → possessive → replace with "his"
 *   - "her" after a verb / at end → object → replace with "him"
 */
function repairPronounsInSegment(
  segment: string,
  targetCharacter: CharacterPronounInfo,
): string {
  const targetGender = targetCharacter.gender;
  const targetPronouns = targetCharacter.pronouns;

  // Build regex for wrong-gender pronouns
  const wrongPronouns =
    targetGender === 'male'
      ? ['she', 'her', 'hers', 'herself']
      : ['he', 'him', 'his', 'himself'];

  // Match whole words (case-insensitive)
  const pattern = new RegExp(`\\b(${wrongPronouns.join('|')})\\b`, 'gi');

  return segment.replace(pattern, (match, pronoun: string, offset: number) => {
    const lower = pronoun.toLowerCase();

    // "her" disambiguation: check if it's possessive or object.
    // N4: Use the regex callback offset (not segment.indexOf) so that sentences
    // with multiple "her" occurrences resolve the correct position for each one.
    if (lower === 'her' && targetGender === 'male') {
      const afterMatch = segment.slice(offset + match.length).trimStart();
      // Possessive "her" is typically followed by a noun/adjective (not end of sentence/clause)
      const looksLikePossessive = /^[a-z]/i.test(afterMatch) && !/^(\.|\?|!|,|;|:|and\b|but\b|or\b|who\b|that\b|which\b|—|$)/i.test(afterMatch);
      if (looksLikePossessive) {
        // Possessive: her → his
        const replacement = targetPronouns.possessive;
        return pronoun[0] === pronoun[0].toUpperCase()
          ? replacement[0].toUpperCase() + replacement.slice(1)
          : replacement;
      } else {
        // Object: her → him
        const replacement = targetPronouns.object;
        return pronoun[0] === pronoun[0].toUpperCase()
          ? replacement[0].toUpperCase() + replacement.slice(1)
          : replacement;
      }
    }

    const corrected = correctPronoun(pronoun, targetPronouns);
    return corrected ?? match;
  });
}

export interface PronounRepairResult {
  text: string;
  repairCount: number;
}

/**
 * Repair gendered pronoun mismatches in a block of text.
 *
 * Algorithm:
 *   1. Split text into sentences.
 *   2. For each sentence, find which characters are mentioned by name.
 *   3. If exactly ONE character is mentioned and the sentence contains
 *      wrong-gender pronouns, fix them.
 *   4. If ZERO characters are mentioned (follow-up sentence), inherit
 *      the last single-character reference and fix wrong pronouns.
 *   5. If TWO+ characters of different genders are mentioned, skip
 *      (ambiguous — might be "She looked at him" which is correct).
 *
 * Returns the repaired text and a count of repairs made.
 */
export interface PronounRepairOptions {
  /**
   * When set, actual pronoun substitutions are restricted to characters whose
   * canonical name is in this set.  All characters in `cast` are still used for
   * `lastSingleCharacter` context tracking so that follow-up sentences are
   * attributed to the correct subject — only the repair step is gated.
   *
   * This prevents "inheritance corruption": if we repair only flagged characters
   * (a subset of the full cast), untracked characters would wrongly inherit the
   * flagged character's gender context and have their pronouns corrupted.
   */
  onlyNames?: Set<string>;
  /**
   * When true, carry the lastSingleCharacter context across paragraph (`\n\n`)
   * boundaries.  Normally the context resets at each paragraph start so that
   * POV switches between paragraphs don't cause over-repair.  With this option
   * the inherited context is only applied to a new paragraph when that paragraph
   * contains NO character of the opposite gender — a strong guard that prevents
   * false repairs when the new paragraph genuinely belongs to a different character.
   *
   * Enabled in the targeted pronoun repair (after validation detects a mismatch)
   * so that cross-paragraph pronoun errors — where a wrong pronoun for character A
   * appears in the opening sentence of a new paragraph that follows a paragraph
   * clearly about character A — are also corrected.
   */
  crossParagraphInheritance?: boolean;
}

export function repairPronouns(text: string, cast: CastEntry[], options?: PronounRepairOptions): PronounRepairResult {
  const characters = buildCharacterInfo(cast);
  if (characters.length === 0) {
    return { text, repairCount: 0 };
  }

  // Process paragraph by paragraph. Normally lastSingleCharacter resets at each
  // paragraph boundary so that legitimate POV switches between paragraphs don't
  // cause over-repair. When crossParagraphInheritance is enabled the context is
  // carried forward, but ONLY if the new paragraph contains no character of the
  // opposite gender — a strong guard against false repairs.
  const paragraphs = text.split(/\n\n/);
  let repairCount = 0;
  // Tracks the last unambiguous character at the END of the previous paragraph
  // for cross-paragraph inheritance.
  let crossParagraphChar: CharacterPronounInfo | null = null;

  const repairedParagraphs = paragraphs.map((paragraph) => {
    // Split into sentences, preserving delimiters for reconstruction
    const sentencePattern = /([^.!?]*[.!?]+\s*)|([^.!?]+$)/g;
    const segments: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = sentencePattern.exec(paragraph)) !== null) {
      segments.push(match[0]);
    }
    if (segments.length === 0) {
      segments.push(paragraph);
    }

    // Determine starting context for this paragraph.
    // With crossParagraphInheritance, inherit the previous paragraph's final
    // single-character context — but only when the new paragraph has no character
    // of the opposite gender anywhere in it (preventing wrong-character repairs).
    let lastSingleCharacter: CharacterPronounInfo | null = null;
    if (options?.crossParagraphInheritance && crossParagraphChar) {
      const inherited = crossParagraphChar;
      const oppositeGenderPresent = characters.some(
        (c) => c.gender !== inherited.gender && characterMentionedIn(paragraph, c.labels),
      );
      if (!oppositeGenderPresent) {
        lastSingleCharacter = inherited;
      }
    }

    const repairedSegments = segments.map((segment) => {
      const mentioned = findMentionedCharacters(segment, characters);

      if (mentioned.length === 1) {
        lastSingleCharacter = mentioned[0]; // always track for context continuity
        const shouldRepair = !options?.onlyNames || options.onlyNames.has(mentioned[0].canonical);
        if (shouldRepair) {
          const repaired = repairPronounsInSegment(segment, mentioned[0]);
          if (repaired !== segment) repairCount++;
          return repaired;
        }
        return segment;
      }

      if (mentioned.length === 0 && lastSingleCharacter) {
        // Only apply repair if the inherited subject is in the allowed set
        const shouldRepair = !options?.onlyNames || options.onlyNames.has(lastSingleCharacter.canonical);
        if (shouldRepair) {
          const repaired = repairPronounsInSegment(segment, lastSingleCharacter);
          if (repaired !== segment) repairCount++;
          return repaired;
        }
        return segment;
      }

      if (mentioned.length >= 2) {
        const genders = new Set(mentioned.map((c) => c.gender));
        if (genders.size === 1) {
          lastSingleCharacter = mentioned[0]; // always track
          const shouldRepair = !options?.onlyNames || options.onlyNames.has(mentioned[0].canonical);
          if (shouldRepair) {
            const repaired = repairPronounsInSegment(segment, mentioned[0]);
            if (repaired !== segment) repairCount++;
            return repaired;
          }
          return segment;
        }
        // lastSingleCharacter intentionally preserved — follow-up sentences inherit prior subject
        return segment;
      }

      return segment;
    });

    crossParagraphChar = lastSingleCharacter;
    return repairedSegments.join('');
  });

  return {
    text: repairedParagraphs.join('\n\n'),
    repairCount,
  };
}

/**
 * Repair pronoun errors in dialogue attribution tags.
 *
 * Targets the pattern: closing-quote + pronoun + verb
 * e.g. "What happened?" he asked  — where Helen is the speaker but the LLM
 * wrote `he` because a male name appeared inside the quoted speech.
 *
 * Algorithm:
 *   1. Find all dialogue-attribution patterns (quote + pronoun + attribution verb).
 *   2. For each, scan backwards up to 300 characters to find text before the
 *      opening quote.
 *   3. Find characters mentioned in that pre-quote text.
 *   4. If exactly ONE named character appears, verify the attribution pronoun
 *      matches that character's gender. If not, replace it.
 *   5. Ambiguous cases (0 or 2+ named characters before the quote) are skipped.
 *
 * Conservative by design: only repairs when the speaker is unambiguous.
 */
function repairDialogueAttributionPronouns(
  text: string,
  characters: CharacterPronounInfo[],
): { text: string; repairCount: number } {
  if (characters.length === 0) return { text, repairCount: 0 };

  const ATTRIBUTION_VERBS =
    'said|asked|murmured|replied|whispered|continued|cried|called|added|began|finished|insisted|admitted|declared|announced|exclaimed';

  // Match: closing quote (straight or curly) + optional comma/space + subject pronoun + verb
  const pattern = new RegExp(
    `(["'\u201C\u201D])([,]?\\s*)(\\b(?:he|she|they)\\b)(\\s+(?:${ATTRIBUTION_VERBS})\\b)`,
    'gi',
  );

  let repairCount = 0;

  const result = text.replace(
    pattern,
    (fullMatch: string, closingQuote: string, delimiter: string, pronoun: string, verbPart: string, matchOffset: number) => {
      // Locate text before the opening quote.
      // Prefer the nearest preceding paragraph break as the lookback boundary;
      // fall back to 800 chars if no paragraph break is found within that range.
      const searchStart = Math.max(0, matchOffset - 800);
      const precedingText = text.slice(searchStart, matchOffset + 1);

      // Find the nearest paragraph boundary within the lookback window
      const lastParaBreak = precedingText.lastIndexOf('\n\n');
      const lookbackStart = lastParaBreak >= 0 ? lastParaBreak + 2 : 0;
      const precedingFromPara = precedingText.slice(lookbackStart);

      // Identify matching open-quote character
      const openQuoteChar = closingQuote === '\u201D' ? '\u201C' : closingQuote;
      const openQuoteIdx = precedingFromPara.lastIndexOf(openQuoteChar);
      const textBeforeQuote = openQuoteIdx >= 0
        ? precedingFromPara.slice(0, openQuoteIdx)
        : precedingFromPara.slice(0, -1);

      // Find all characters mentioned before the opening quote
      const mentioned = characters.filter((c) => characterMentionedIn(textBeforeQuote, c.labels));
      if (mentioned.length !== 1) {
        return fullMatch;
      }

      const speaker = mentioned[0];
      const pronounGender = genderOfPronoun(pronoun);
      if (!pronounGender || pronounGender === speaker.gender) {
        return fullMatch;
      }

      const corrected = correctPronoun(pronoun, speaker.pronouns);
      if (!corrected) return fullMatch;

      repairCount++;
      return `${closingQuote}${delimiter}${corrected}${verbPart}`;
    },
  );

  return { text: result, repairCount };
}

/**
 * Apply pronoun repair to a chapter object (title + paragraphs).
 * Returns the repaired chapter and total repair count.
 *
 * Uses cross-paragraph inheritance so that wrong-gender pronouns in the
 * FIRST sentence of a new paragraph — where the LLM failed to name the
 * character before using a pronoun — are also corrected when the previous
 * paragraph unambiguously established that character's context.  The guard
 * inside repairPronouns prevents false repairs when the new paragraph
 * contains a character of the opposite gender.
 */
export function repairChapterPronouns(
  chapter: { title: string; summary?: string; paragraphs: string[] },
  cast: CastEntry[],
): { chapter: typeof chapter; repairCount: number } {
  let totalRepairs = 0;
  const characters = buildCharacterInfo(cast);

  // First pass: sentence-level pronoun repair across the FULL chapter text so
  // that cross-paragraph context (lastSingleCharacter) is preserved.  Calling
  // repairPronouns per-paragraph would reset context at each boundary and miss
  // the pattern where the wrong pronoun appears at the START of a new paragraph
  // after a paragraph that unambiguously established a character's context.
  // ANALYSIS_17 V-B: also apply title normalization ("the doctor Finch" → "Dr. Finch").
  const rawText = chapter.paragraphs.join('\n\n');
  const fullText = normalizeTitles(rawText);
  if (fullText !== rawText) totalRepairs += 1; // count at least one repair for title norm
  const sentenceResult = repairPronouns(fullText, cast, { crossParagraphInheritance: true });
  totalRepairs += sentenceResult.repairCount;
  const paragraphsAfterSentenceRepair = sentenceResult.text.split('\n\n');

  // Second pass: dialogue-attribution repair per paragraph.
  const repairedParagraphs = paragraphsAfterSentenceRepair.map((paragraph) => {
    const dialogueResult = repairDialogueAttributionPronouns(paragraph, characters);
    totalRepairs += dialogueResult.repairCount;
    return dialogueResult.text;
  });

  return {
    chapter: {
      ...chapter,
      paragraphs: repairedParagraphs,
    },
    repairCount: totalRepairs,
  };
}

/**
 * ANALYSIS_17 V-B: Normalize incorrect title-noun-surname patterns to canonical
 * title-plus-surname form (e.g. "the doctor Finch" → "Dr. Finch").
 * Fully deterministic; applied as part of the pre-validation prose pipeline.
 */
const TITLE_NORMALIZATIONS: Array<[RegExp, string]> = [
  [/\bthe doctor\s+([A-Z][a-z]+)/g, 'Dr. $1'],
  [/\bthe captain\s+([A-Z][a-z]+)/g, 'Captain $1'],
  [/\bthe colonel\s+([A-Z][a-z]+)/g, 'Colonel $1'],
  [/\bthe professor\s+([A-Z][a-z]+)/g, 'Professor $1'],
  [/\bthe inspector\s+([A-Z][a-z]+)/g, 'Inspector $1'],
  [/\bthe major\s+([A-Z][a-z]+)/g, 'Major $1'],
  [/\bthe sergeant\s+([A-Z][a-z]+)/g, 'Sergeant $1'],
];

export function normalizeTitles(text: string): string {
  let result = text;
  for (const [pattern, replacement] of TITLE_NORMALIZATIONS) {
    result = result.replace(pattern, replacement);
  }
  return result;
}
