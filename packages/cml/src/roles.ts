/**
 * Shared role-archetype semantics for cast entries.
 *
 * Abort class #10 (2026-07-19, P5-CR poison arm): `role.includes("victim")`-style predicates —
 * ~30 sites across worker/prompts-llm/story-validation — treat RELATIONAL roles ("Friend of the
 * victim") as the deceased. The prompt builder then instructs the model the character is
 * "DECEASED, past-tense only", the lifecycle validator convicts her living scenes, and the rescue
 * pass reframes them — a run-killing cascade from one substring match. Word-boundary matching does
 * not fix this ("friend of the victim" contains the whole word), so the predicate below requires
 * "victim" to be what the role DENOTES: the head noun of the phrase.
 */
export const isVictimArchetype = (roleText: unknown): boolean => {
  const raw = String(roleText ?? "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " "); // "Victim (poisoned)" → "Victim"
  if (!raw.trim()) return false;

  // A role string may list alternates ("victim, hotel guest"); any victim-denoting segment counts.
  return raw.split(/[,;/]/).some((segment) => {
    // Relational phrases reference the victim without denoting them — keep only the head segment
    // before the first "of" ("friend of the victim" → "friend"; "victim of poisoning" → "victim").
    const head = (segment.split(/\bof\b/)[0] ?? "").trim().replace(/["'.!?]+$/, "");
    // The role denotes the victim only when "victim(s)" is the final (head) word — "murder victim",
    // "the victim" — never a modifier ("victim advocate") or possessive ("victim's confidant").
    return /\bvictims?$/.test(head);
  });
};

/**
 * X50 (REVIEW_11 §7) — the detective predicate, because `.includes("detective")` is not one.
 *
 * `computeEliminationSuspects` excluded detectives with
 * `String(c?.role_archetype ?? c?.roleArchetype ?? c?.role ?? '').toLowerCase().includes('detective')`.
 * A_67 fixed the KEY half of that (both spellings). The VALUE half shipped anyway: Agent 2's own
 * prompt mandates, in three places, `roleArchetype MUST be "Amateur Sleuth / Civilian Investigator"`
 * — which contains no `detective` substring. And `??` stops at the first NON-NULLISH value, so
 * `c.role` — the enum whose values are literally `detective|victim|suspect` — was never read.
 *
 * MEASURED on run `mystery-1786999938275`: `regen-suspect-elimination UNRESOLVED Eleanor Voss` — the
 * investigator in the elimination-suspect set, two repair calls spent clearing the sleuth of a crime
 * nobody accused her of. The victim filter beside it survived only by accident: Agent 2 is told to
 * set `roleArchetype "victim"`, so that substring happens to match.
 *
 * Same head-noun discipline as `isVictimArchetype`, for the same reason — "friend of the detective"
 * and "the detective's landlady" are not detectives.
 */
export const isDetectiveArchetype = (roleText: unknown): boolean => {
  const raw = String(roleText ?? "")
    .toLowerCase()
    .replace(/\([^)]*\)/g, " ");
  if (!raw.trim()) return false;

  return raw.split(/[,;/]/).some((segment) => {
    /**
     * RELATIONAL PHRASES ARE STILL EXCLUDED, by the same "of"-split `isVictimArchetype` uses:
     * "landlady of the detective" keeps only "landlady" and does not match.
     *
     * BUT THE ROLE NOUN MAY SIT ANYWHERE IN THAT HEAD, NOT ONLY AT ITS END — found on review
     * 2026-08-18, and the first version of this predicate was a regression on the very defect X50
     * exists to close. Requiring the noun to be final rejected every one of these, which the
     * `.includes("detective")` it replaced had matched:
     *
     *   "Private detective hired by the family"    "Inspector from Scotland Yard"
     *   "Detective with the county police"
     *
     * A detective wrongly readmitted to the elimination-suspect set is the sleuth being cleared of
     * a crime nobody accused them of — X50's whole symptom, reintroduced by X50's own fix.
     *
     * `isVictimArchetype` beside this KEEPS the head-final rule and must: its looseness once caused
     * a run-killing cascade (abort class #10, "friend of the victim" narrated as deceased). The
     * asymmetry is deliberate — a false victim rewrites a character's lifecycle, a false detective
     * only skips one clearance.
     *
     * KNOWN LIMITATION: "chief of detectives" reads as "chief" and does not match. Naming an
     * authority over detectives is not naming a detective, and inverting the "of"-split to catch it
     * would readmit "friend of the detective".
     */
    const head = (segment.split(/\bof\b/)[0] ?? "")
      .trim()
      .replace(/["'.!?]+$/, "")
      // Possessives reference a detective without denoting one: "the detective's landlady".
      .replace(/\b(?:detectives?|sleuths?|investigators?|inspectors?)['’]s\b/g, " ");
    // The vocabularies this codebase actually emits: the `role` enum says "detective", Agent 2's
    // mandated archetype says "Amateur Sleuth / Civilian Investigator", and Agent 7's cast list says
    // "Detective". `inspector` is carried because the culprit-role-integrity filter it replaces at
    // agent9-run.ts already matched it.
    return /\b(?:detectives?|sleuths?|investigators?|inspectors?)\b/.test(head);
  });
};

/**
 * Every role string a cast entry might carry, from either source shape.
 *
 * X50: this replaces the `??` chain at every role-reading site. A nullish-coalescing chain that mixes
 * a free-text LABEL with a typed ENUM answers with whichever field happens to be populated first, and
 * the free-text one always is. Test them ALL — a cast entry is a detective if ANY of its role fields
 * says so. See [[cast-field-camelcase-vs-snakecase-trap]] for the key-casing half of this trap.
 */
export const roleTextsOf = (entry: unknown): string[] => {
  const c = (entry ?? {}) as Record<string, unknown>;
  return [c.role_archetype, c.roleArchetype, c.role]
    .map((v) => String(v ?? "").trim())
    .filter(Boolean);
};
