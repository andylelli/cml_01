/**
 * ONE clearance vocabulary for the prose stage.
 *
 * A_73 §11.1 found SEVEN bodies of this regex across five packages, no two of them agreed, and the
 * disagreement runs in the dangerous direction:
 *
 *   WIDE  — story-geometry `accept.ts`, story-validation `suspect-closure-validator.ts`
 *           accept "in the clear", "above suspicion", "vouched for", "accounted for", "checks out"
 *   NARROW — this vocabulary, used by the Agent-9 lint gate, the regen validator and the
 *           deterministic clearance patch
 *
 * The WIDE bodies judge the finished book. The NARROW bodies decide whether prose needs REPAIRING.
 * So a chapter that clears a suspect in ordinary English — *"Hale was in the clear"* — satisfies the
 * validators, fails the Agent-9 presence check, spends a retry, and is then overwritten by
 * `applyDeterministicClearancePatch`, whose output is the *"thoroughly cleared by the evidence; the
 * alibi confirmed"* register that two external reads named as the top prose drag (A_71 §3).
 *
 * WHAT THIS FILE DOES AND DOES NOT CHANGE. It collapses the four prose-stage copies into one
 * definition with NO change to what they match — the three base copies were byte-identical and the
 * fourth differed only by `killer`, which is preserved as its own export. Widening the narrow set to
 * meet the wide one is a BEHAVIOUR change to gating and belongs behind a flag with a run to measure
 * it; it is deliberately not done here. What is fixed today is that there is now one place to widen.
 *
 * The relationship between narrow and wide is pinned by `clearance-vocabulary-parity.test.ts`, so
 * the next divergence fails a test instead of surfacing as a reader complaint two months later.
 */

/** The base prose-stage vocabulary. Formerly duplicated in lint.ts, deterministic-repair.ts and agent9-run.ts. */
export const CLEARANCE_TERMS_RE =
  /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds|alibi\s+confirmed|could\s+not\s+have)\b/i;

/**
 * The same vocabulary plus `killer`, as used by the regen clearance validator.
 * Kept distinct rather than merged: merging would widen the three call sites that do NOT have it,
 * which is exactly the behaviour change this file declines to make silently.
 */
export const CLEARANCE_TERMS_WITH_KILLER_RE =
  /\b(cleared|ruled\s+out|eliminated|not\s+the\s+(?:culprit|killer)|innocent|alibi\s+(?:holds|confirmed)|could\s+not\s+have)\b/i;

/** Evidence connectors that must co-occur with a clearance term for it to count as reasoned. */
export const CLEARANCE_EVIDENCE_RE =
  /\b(evidence|because|therefore|proof|alibi|timeline|witness(?:es)?|saw|seen|account)\b/i;

/**
 * Phrases the WIDE validators accept and the narrow vocabulary does not.
 *
 * Not used for matching. Exported so the parity test can assert the gap is exactly this list — if a
 * validator gains a term, the test fails and the gap is re-decided rather than re-discovered.
 */
export const CLEARANCE_TERMS_WIDE_ONLY: readonly string[] = [
  "in the clear",
  "above suspicion",
  "beyond suspicion",
  "freed from suspicion",
  "vouched for",
  "accounted for",
  "no opportunity",
  "no access",
  "impossible for",
  "cannot have",
  "alibi checks out",
  "alibi held",
];
