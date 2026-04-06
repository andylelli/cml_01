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
    onlyNames?: Set<string>;
}
export declare function repairPronouns(text: string, cast: CastEntry[], options?: PronounRepairOptions): PronounRepairResult;
/**
 * Apply pronoun repair to a chapter object (title + paragraphs).
 * Returns the repaired chapter and total repair count.
 */
export declare function repairChapterPronouns(chapter: {
    title: string;
    summary?: string;
    paragraphs: string[];
}, cast: CastEntry[]): {
    chapter: typeof chapter;
    repairCount: number;
};
