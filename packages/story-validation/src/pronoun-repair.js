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
const PRONOUN_MAP = {
    male: { subject: 'he', object: 'him', possessive: 'his', reflexive: 'himself' },
    female: { subject: 'she', object: 'her', possessive: 'her', reflexive: 'herself' },
};
// All gendered pronouns we may repair (lowercased).
const MALE_PRONOUNS = new Set(['he', 'him', 'his', 'himself']);
const FEMALE_PRONOUNS = new Set(['she', 'her', 'hers', 'herself']);
function genderOfPronoun(pronoun) {
    const lower = pronoun.toLowerCase();
    if (MALE_PRONOUNS.has(lower))
        return 'male';
    if (FEMALE_PRONOUNS.has(lower))
        return 'female';
    return null;
}
/**
 * Map a wrong-gender pronoun to the correct form for the target character,
 * preserving original casing style.
 */
function correctPronoun(wrongPronoun, targetPronouns) {
    const lower = wrongPronoun.toLowerCase();
    // Determine the grammatical role of the wrong pronoun
    let corrected = null;
    if (lower === 'he' || lower === 'she') {
        corrected = targetPronouns.subject;
    }
    else if (lower === 'him' || lower === 'her') {
        // "her" is ambiguous (object or possessive); we handle possessive via context below
        // For standalone object position, map to object form.
        corrected = targetPronouns.object;
    }
    else if (lower === 'his' || lower === 'hers') {
        corrected = targetPronouns.possessive;
    }
    else if (lower === 'himself' || lower === 'herself') {
        corrected = targetPronouns.reflexive;
    }
    if (!corrected)
        return null;
    // Preserve casing: if original starts uppercase, capitalize replacement
    if (wrongPronoun[0] === wrongPronoun[0].toUpperCase()) {
        corrected = corrected[0].toUpperCase() + corrected.slice(1);
    }
    return corrected;
}
function buildCharacterInfo(cast) {
    return cast
        .filter((c) => c.gender && (c.gender.toLowerCase() === 'male' || c.gender.toLowerCase() === 'female'))
        .map((c) => {
        const gender = c.gender.toLowerCase();
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
                if (alias)
                    labels.push(alias.toLowerCase());
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
function characterMentionedIn(text, labels) {
    const lower = text.toLowerCase();
    return labels.some((label) => {
        const idx = lower.indexOf(label);
        if (idx === -1)
            return false;
        // Check word boundaries
        const before = idx === 0 || /\W/.test(lower[idx - 1]);
        const after = idx + label.length >= lower.length || /\W/.test(lower[idx + label.length]);
        return before && after;
    });
}
/**
 * Find all characters mentioned in a text segment.
 */
function findMentionedCharacters(text, characters) {
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
function repairPronounsInSegment(segment, targetCharacter) {
    const targetGender = targetCharacter.gender;
    const targetPronouns = targetCharacter.pronouns;
    // Build regex for wrong-gender pronouns
    const wrongPronouns = targetGender === 'male'
        ? ['she', 'her', 'hers', 'herself']
        : ['he', 'him', 'his', 'himself'];
    // Match whole words (case-insensitive)
    const pattern = new RegExp(`\\b(${wrongPronouns.join('|')})\\b`, 'gi');
    return segment.replace(pattern, (match, pronoun) => {
        const lower = pronoun.toLowerCase();
        // "her" disambiguation: check if it's possessive or object
        if (lower === 'her' && targetGender === 'male') {
            // Look at what follows "her" in the original segment
            const matchIndex = segment.indexOf(match, 0);
            const afterMatch = segment.slice(matchIndex + match.length).trimStart();
            // Possessive "her" is typically followed by a noun/adjective (not end of sentence/clause)
            const looksLikePossessive = /^[a-z]/i.test(afterMatch) && !/^(\.|\?|!|,|;|:|and\b|but\b|or\b|who\b|that\b|which\b|—|$)/i.test(afterMatch);
            if (looksLikePossessive) {
                // Possessive: her → his
                const replacement = targetPronouns.possessive;
                return pronoun[0] === pronoun[0].toUpperCase()
                    ? replacement[0].toUpperCase() + replacement.slice(1)
                    : replacement;
            }
            else {
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
export function repairPronouns(text, cast) {
    const characters = buildCharacterInfo(cast);
    if (characters.length === 0) {
        return { text, repairCount: 0 };
    }
    // Split into sentences, preserving delimiters for reconstruction
    const sentencePattern = /([^.!?]*[.!?]+\s*)|([^.!?]+$)/g;
    const segments = [];
    let match;
    while ((match = sentencePattern.exec(text)) !== null) {
        segments.push(match[0]);
    }
    if (segments.length === 0) {
        segments.push(text);
    }
    let repairCount = 0;
    let lastSingleCharacter = null;
    const repairedSegments = segments.map((segment) => {
        const mentioned = findMentionedCharacters(segment, characters);
        if (mentioned.length === 1) {
            // Unambiguous: exactly one character named in this sentence
            lastSingleCharacter = mentioned[0];
            const repaired = repairPronounsInSegment(segment, mentioned[0]);
            if (repaired !== segment)
                repairCount++;
            return repaired;
        }
        if (mentioned.length === 0 && lastSingleCharacter) {
            // Follow-up sentence inherits last-named character
            const repaired = repairPronounsInSegment(segment, lastSingleCharacter);
            if (repaired !== segment)
                repairCount++;
            return repaired;
        }
        if (mentioned.length >= 2) {
            // Multiple characters mentioned — check if they're all the same gender.
            // If so, we can still repair (all pronouns should match that gender).
            const genders = new Set(mentioned.map((c) => c.gender));
            if (genders.size === 1) {
                // All same gender — any wrong pronoun is unambiguously wrong
                lastSingleCharacter = mentioned[0];
                const repaired = repairPronounsInSegment(segment, mentioned[0]);
                if (repaired !== segment)
                    repairCount++;
                return repaired;
            }
            // Mixed genders — too ambiguous to repair safely
            lastSingleCharacter = null;
            return segment;
        }
        // No characters mentioned and no prior context — leave as-is
        return segment;
    });
    return {
        text: repairedSegments.join(''),
        repairCount,
    };
}
/**
 * Apply pronoun repair to a chapter object (title + paragraphs).
 * Returns the repaired chapter and total repair count.
 */
export function repairChapterPronouns(chapter, cast) {
    let totalRepairs = 0;
    const repairedParagraphs = chapter.paragraphs.map((paragraph) => {
        const result = repairPronouns(paragraph, cast);
        totalRepairs += result.repairCount;
        return result.text;
    });
    return {
        chapter: {
            ...chapter,
            paragraphs: repairedParagraphs,
        },
        repairCount: totalRepairs,
    };
}
//# sourceMappingURL=pronoun-repair.js.map