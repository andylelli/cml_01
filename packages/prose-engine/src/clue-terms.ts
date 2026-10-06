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

export type TermMatchRule = "stemmed" | "substring" | "word";

/**
 * WF-005 V2K-08 / V2K-11 (A_111 V-15) — the "word" rule: a key term counts only as a WHOLE word, in any of its regular
 * inflections. "lock" finds "locked" and "locks", never "block" or "locket"; "bear" never finds "beard"; "handling"
 * finds "handle" and "handled". The stem is the term less one regular inflection, kept only if four letters remain.
 */
const INFLECTIONS = ["ations", "ation", "ings", "ing", "ed", "es", "s"] as const;
const stemOfTerm = (term: string): string => {
  for (const suffix of INFLECTIONS) {
    if (term.endsWith(suffix) && term.length - suffix.length >= 4) return term.slice(0, -suffix.length);
  }
  return term;
};
const escapeTerm = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const wordPattern = (term: string): RegExp => {
  const stem = stemOfTerm(term);
  // "d" only after an "e" ("trace" -> "traced"): after anything else it makes a new word ("bear" -> "beard").
  const endings = `e|s|es|ed|ing|ings|ly|ation|ations|ion|ions${stem.endsWith("e") ? "|d" : ""}`;
  return new RegExp(`\\b(?:${escapeTerm(term)}|${escapeTerm(stem)}(?:${endings})?)\\b`);
};

/** How many of `terms` occur in `loweredText` (already lower-cased) under `rule`. */
export function keyTermHits(terms: readonly string[], loweredText: string, rule: TermMatchRule): number {
  if (rule === "word") return terms.filter((t) => t && wordPattern(t).test(loweredText)).length;
  return rule === "stemmed"
    ? terms.filter((t) => tokenMatchesText(t, loweredText)).length
    : terms.filter((t) => loweredText.includes(t)).length;
}

/**
 * A_111 V-15 — is this clue on the page? ≥ max(2, half) of its key terms as whole words, never more than it has.
 *
 * The key terms are the case's own — the clue's on-page observable, tokenised by the contract (`keyTermsOf`) — and
 * nothing else: no inference words (`pointsTo`), no generic family ("letter, written, document"). MEASURED over 29
 * distinct stored books (583 chapter × clue pairs): this rule finds the clue in 95% of its own chapters, 17% of another
 * case's chapter of the same number and 1–2% of canon chapters; `chapterMentionsRequiredClue` found it in 99%, 73% and
 * 56–65%. Dropping the case's own names and places from the terms made it WORSE (27% on another case), as did dropping
 * terms other clues of the case share (79% own) — so the clue's own terms, whole, are the case-specific set.
 *
 * A surface with no key terms has nothing to look for and is reported present, as `contract.ts` decided for the ids
 * the clues artifact cannot describe.
 */
export function clueTermsOnPage(terms: readonly string[], loweredText: string): boolean {
  if (terms.length === 0) return true;
  const needed = Math.min(terms.length, Math.max(2, Math.ceil(terms.length * 0.5)));
  return keyTermHits(terms, loweredText, "word") >= needed;
}
