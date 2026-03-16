/**
 * Shared character-name sanitization utilities.
 *
 * Centralizes titled-name detection so prose sanitization and chapter
 * validation stay in lockstep.
 */
export declare function buildValidSurnames(validCastNames: string[]): Set<string>;
/**
 * Return all unknown `Title Surname` mentions in text.
 */
export declare function findUnknownTitledNameMentions(text: string, validCastNames: string[]): string[];
/**
 * Replace unknown titled names with anonymous role phrases.
 */
export declare function anonymizeUnknownTitledNames(text: string, validCastNames: string[]): string;
