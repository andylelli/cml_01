/**
 * Mechanism-explanation detector — the single source of truth for "does this chapter spell out HOW the
 * concealment trick worked". Kept in its own leaf module (no imports from generate.ts / regen-integration.ts)
 * so BOTH the generation-time gate (generate.ts) AND the pre-scoring mechanism-reveal regen pass
 * (regen-integration.ts) key off the exact same predicate without a circular import. The rubric's
 * "mechanism explained too early" cap keys off the same shape, so a chapter this predicate clears no
 * longer trips that cap.
 *
 * Holistic: derived entirely from `hidden_model.mechanism.description` + the chapter text, never from a
 * specific story/character/plot. Merely PLANTING the clue (naming the object, no causal language) does
 * not trip it — a FULL explanation requires ≥50% of the mechanism description's salient terms to co-occur
 * AND causal/method EXPLANATION language to be present.
 */

// Causal/method EXPLANATION language: the "how the trick worked" markers. Naming the object alone is
// legitimate clue-planting and must NOT match — only an explanation of the method does.
export const MECHANISM_EXPLANATION_MARKER_A9 =
  /\b(?:in order to|so as to|so that|this (?:gave|created|allowed|meant|explained|produced)|which (?:gave|created|allowed|meant)|to (?:fake|conceal|disguise|fabricate|stage|simulate|forge)\b|(?:had|then|she|he|they) (?:reset|rewound|wound back|set back|moved|advanced|adjusted|altered|rigged|tampered with) the|the (?:trick|method|mechanism|scheme|deception) (?:was|lay|had been)|explained (?:how|that|the)|how (?:the )?(?:murder|crime|killer|culprit|trick|mechanism|clock))\b/;

const MECHANISM_TERM_STOPWORDS = new Set([
  "the", "and", "for", "with", "that", "this", "from", "into", "was", "had", "has",
  "her", "his", "him", "she", "they", "their", "about", "which", "then", "been",
]);

/** Salient (≥5-char, non-stopword) terms from the mechanism description — the co-occurrence vocabulary. */
export const deriveMechanismTerms = (mechanismDescription: string): string[] =>
  String(mechanismDescription ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 5 && !MECHANISM_TERM_STOPWORDS.has(w));

/** True when the chapter co-locates ≥50% of the mechanism terms AND explanation-marker language. */
export const chapterFullyExplainsMechanism = (chapterTextLower: string, mechanismTerms: string[]): boolean => {
  if (mechanismTerms.length === 0) return false;
  const need = Math.max(2, Math.ceil(mechanismTerms.length * 0.5));
  const hits = mechanismTerms.filter((t) => chapterTextLower.includes(t)).length;
  return hits >= need && MECHANISM_EXPLANATION_MARKER_A9.test(chapterTextLower);
};

/**
 * Best-effort locator of the offending paragraph: the paragraph with the most mechanism-term hits that
 * ALSO carries the explanation marker (so the regen edit is paragraph-scoped, never a whole-chapter
 * rewrite). Returns -1 when no single paragraph both hits terms and carries the marker (the caller then
 * falls back to paragraph 0). Single-sources the same marker/term logic as chapterFullyExplainsMechanism.
 */
export const mechanismExplanationParagraphIndex = (
  paragraphs: ReadonlyArray<string>,
  mechanismTerms: ReadonlyArray<string>,
): number => {
  if (mechanismTerms.length === 0) return -1;
  let bestIdx = -1;
  let bestHits = 0;
  paragraphs.forEach((p, i) => {
    const lower = String(p ?? "").toLowerCase();
    if (!MECHANISM_EXPLANATION_MARKER_A9.test(lower)) return;
    const hits = mechanismTerms.filter((t) => lower.includes(t)).length;
    if (hits > bestHits) {
      bestHits = hits;
      bestIdx = i;
    }
  });
  return bestIdx;
};
