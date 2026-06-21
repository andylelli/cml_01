/**
 * The deterministic half of the §4.3 usability signal — what replaces the word-count gate.
 *
 * Today Agent 6.5's most load-bearing field is gated on `arcDescription ≥ 200 words`, a length proxy
 * an LLM games by writing more, and which the runner *pads* from canned paragraphs when the model
 * writes a tight 160 — silently converting a failing arc into a passing one. The redesign deletes the
 * floor and asks the real question: *is this usable?* These are the structural checks that can be
 * decided deterministically (the voice-distinctiveness and contract-conformance judges are the gated
 * LLM-judge phase). The proof the gate now means something: a tight excellent arc PASSES and a
 * bloated generic one FAILS — inverting today's behavior.
 */

/** The structural beats an arc must touch for the outline to place against it (§4.3, §6). */
export const DEFAULT_ARC_BEATS = ["opening", "first turn", "midpoint", "climax", "resolution"] as const;

/** Synonyms so the coverage check reads intent, not exact keywords. */
const BEAT_SYNONYMS: Record<string, string[]> = {
  opening: ["open", "begin", "outset", "start", "first chapter", "establish"],
  "first turn": ["first turn", "inciting", "turn", "complication", "disrupt", "upend"],
  midpoint: ["midpoint", "middle", "deepen", "raise the stakes", "halfway", "second act"],
  climax: ["climax", "confront", "reveal", "unmask", "showdown", "peak", "discriminating test"],
  resolution: ["resolution", "resolve", "aftermath", "denouement", "settle", "close", "ending"],
};

export interface ArcCoverageResult {
  complete: boolean;
  covered: string[];
  missing: string[];
}

/**
 * Does the arc reference every structural beat the outline will need, each with a distinct emotional
 * value? Coverage, not length — a 170-word arc that touches every beat passes; a 350-word arc that
 * never reaches the climax fails.
 */
export function checkArcCoverage(
  arc: string,
  beats: readonly string[] = DEFAULT_ARC_BEATS,
): ArcCoverageResult {
  const hay = (arc ?? "").toLowerCase();
  const covered: string[] = [];
  const missing: string[] = [];
  for (const beat of beats) {
    const needles = [beat.toLowerCase(), ...(BEAT_SYNONYMS[beat] ?? [])];
    if (needles.some((n) => hay.includes(n))) covered.push(beat);
    else missing.push(beat);
  }
  return { complete: missing.length === 0, covered, missing };
}

// Copulas/auxiliaries + common thematic verbs in base and 3rd-person-singular form. Bare -s/-ed
// suffix rules are deliberately NOT used: they misfire on plural nouns ("manners", "secrets") and
// participial-adjective titles ("Doomed", "Haunted"). The lexicon is the allow-list; extend as needed.
const CLAIM_VERBS = new Set([
  "is", "are", "was", "were", "be", "been", "being", "become", "becomes",
  "do", "does", "did", "make", "makes", "made",
  "corrupt", "corrupts", "destroy", "destroys", "reveal", "reveals", "cost", "costs",
  "protect", "protects", "hide", "hides", "betray", "betrays", "demand", "demands",
  "consume", "consumes", "undo", "undoes", "expose", "exposes", "break", "breaks",
  "drive", "drives", "bind", "binds", "kill", "kills", "ruin", "ruins", "tell", "tells",
  "mask", "masks", "poison", "poisons", "fester", "festers", "unravel", "unravels",
  "buy", "buys", "owe", "owes", "outlast", "outlasts", "erode", "erodes", "warp", "warps",
]);

/**
 * Is the theme a *claim* (subject + predicate) rather than a title or noun phrase? (§4.3). A real
 * theme asserts something — "How ambition corrupts loyalty", "The cost of protecting a secret" — not
 * "Betrayal" or "A Country House Murder". Structural proxy, not a parser: a claim has ≥3 words and at
 * least one recognized verb or gerund. Errs toward requiring verbal force; rejects bare noun-phrase
 * titles a word count would have waved through.
 */
export function themeIsAClaim(theme: string): boolean {
  const tokens = (theme ?? "").trim().toLowerCase().split(/\s+/).filter(Boolean);
  if (tokens.length < 3) return false;
  return tokens.some((t) => {
    const w = t.replace(/[^a-z]/g, "");
    if (!w) return false;
    if (CLAIM_VERBS.has(w)) return true;
    return w.length > 4 && w.endsWith("ing"); // gerund: protecting, corrupting
  });
}
