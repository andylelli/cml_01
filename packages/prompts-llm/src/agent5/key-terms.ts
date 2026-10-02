/**
 * A5-09: moved out of agent5-clues.ts so the prompt-section builders and the retry-feedback normaliser can
 * use it without a runtime import cycle. Body unchanged.
 *
 * Extract key terms from a text snippet (for mustMention).
 */
export function extractKeyTerms(text: string): string[] {
  if (!text) return [];

  // Extract meaningful words (>4 chars, not common words)
  const commonWords = new Set(['that', 'this', 'with', 'from', 'were', 'have', 'been', 'they', 'what', 'when', 'where', 'which', 'would', 'could', 'should']);
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter((w: string) => w.length > 4 && !commonWords.has(w))
    .slice(0, 3); // Top 3 key terms

  return words;
}
