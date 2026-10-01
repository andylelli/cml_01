/**
 * A9V-04 (CR-16): how a scene's clue key terms are counted against a chapter — ONE helper, both of today's rules.
 *
 *   - "stemmed"   — `tokenMatchesText` (stem-aware: a plural term also finds its singular; NOT word-bounded —
 *                   "cat" counts in "concatenate"). The selector's "is the clue on the page" and
 *                   "is a withheld clue surfaced early" checks.
 *   - "substring" — a raw `includes` on lower-cased text. The gate's "is the decisive clue on any page before the
 *                   reveal" check, deliberately lenient (any one term anywhere).
 *
 * The thresholds stay at each call site (selector: ≥ max(2, 50%) present, ≥ max(4, 90%) early; gate: ≥ 1). Giving
 * the gate the stemmed rule changes which books it stops, so that is a behaviour change (R2), not this helper's.
 */
import { tokenMatchesText } from "@cml/prompts-llm";

export type TermMatchRule = "stemmed" | "substring";

/** How many of `terms` occur in `loweredText` (already lower-cased) under `rule`. */
export function keyTermHits(terms: readonly string[], loweredText: string, rule: TermMatchRule): number {
  return rule === "stemmed"
    ? terms.filter((t) => tokenMatchesText(t, loweredText)).length
    : terms.filter((t) => loweredText.includes(t)).length;
}
