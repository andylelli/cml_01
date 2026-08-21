/**
 * The ONE set of death-method patterns.
 *
 * FOUND BY REVIEW, 2026-08-20. This vocabulary existed twice — `agent3-cml.ts` and
 * `agent9-prose/prompt-builder.ts` — and the copies had drifted:
 *
 *   stab      agent3: stab|knif|blade|dagger              prompt-builder: stab|knif|blade
 *   bludgeon  agent3: bludgeon|blunt|cudgel|struck|\bblow\b   prompt-builder: bludgeon|blunt[- ]?force|cudgel|struck
 *
 * so a case whose manner of death was a *dagger* or *a blow to the head* classified in one place and
 * not the other. That is the seventh instance of one-vocabulary-two-copies found in a single review
 * (X61, X67, X74, X75, X76, X79 are the others); the pattern has cost this project more than any
 * other single defect.
 *
 * MEASURED: all 13 archived cases carry an explicit `CASE.death_method`, and `resolveDeathMethod`
 * returns that verbatim before ever consulting these patterns — they are the FALLBACK for a case that
 * states no method and must be inferred from `meta.crime_class`. So the drift is latent, not live. It
 * is fixed structurally rather than by aligning two lists, because aligning them once is what the
 * last six of these also did.
 *
 * The LABELS deliberately stay at the call sites. The two consumers want different registers — a
 * manner of death ("gunshot", "burning") versus a wound to describe in prose ("gunshot wound",
 * "burns") — and collapsing those would be a second defect wearing the first one's clothes.
 */

/** Keys are stable identifiers; each call site maps them to the wording it needs. */
export type DeathMethodKind =
  | "stabbing"
  | "gunshot"
  | "strangulation"
  | "poisoning"
  | "blunt_force"
  | "drowning"
  | "fall"
  | "suffocation"
  | "electrocution"
  | "burning";

/**
 * Ordered, because the first match wins and the specific must precede the general.
 *
 * No pattern carries a trailing `\b`: every entry is a STEM meant to match its own inflections
 * (`strangl` → strangled/strangling/strangulation), and a closing boundary would neuter it — the
 * X62/X74 defect, which was still live in four places in this codebase as of this review.
 */
export const DEATH_METHOD_PATTERNS: ReadonlyArray<readonly [RegExp, DeathMethodKind]> = [
  [/stab|knif|blade|dagger/i, "stabbing"],
  [/shoot|shot|gun|firearm|pistol|revolver/i, "gunshot"],
  [/strangl|garrot|throttl/i, "strangulation"],
  [/poison|arsenic|cyanide|toxin/i, "poisoning"],
  [/bludgeon|blunt[- ]?force|blunt|cudgel|struck|\bblow\b/i, "blunt_force"],
  [/drown/i, "drowning"],
  [/\bfall\b|\bfell\b|pushed from|thrown from/i, "fall"],
  [/smother|suffocat|asphyxiat/i, "suffocation"],
  [/electrocut/i, "electrocution"],
  [/burn|arson/i, "burning"],
];

/** The kind this text describes, or null when nothing in it names a manner of death. */
export const classifyDeathMethod = (text: unknown): DeathMethodKind | null => {
  const haystack = String(text ?? "");
  if (!haystack.trim()) return null;
  for (const [pattern, kind] of DEATH_METHOD_PATTERNS) {
    if (pattern.test(haystack)) return kind;
  }
  return null;
};
