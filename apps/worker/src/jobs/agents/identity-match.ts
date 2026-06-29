/**
 * Shared identity-matching helpers (A_53 P4, Pattern D).
 *
 * Raw `String.includes` on names/roles false-positives across a real cast — "Ann" matches "Joanna",
 * "inspector" matches "building inspector" — silently mis-binding clues and mislabelling roles. These
 * word-boundary / surname-aware matchers replace every such substring test. Promoted here from
 * `agent6-reveal-gate.ts` (which now re-exports `namesMatch` for its existing importers).
 *
 * Everything is pure (no LLM, no IO) and unit-tested.
 */

/** Last whitespace-separated token, lower-cased — the surname for "Ada Blythe" → "blythe". */
export const surname = (value: string | undefined): string =>
  String(value ?? "").trim().split(/\s+/).pop()?.toLowerCase() ?? "";

const escapeRegExpLiteral = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

/**
 * Exact (case-insensitive) match OR shared surname. Deliberately NOT a raw substring match —
 * `"Ann".includes`-style logic false-positives on "Joanna"/"Annabelle". Mirrors prose-blind-reader's
 * surname matcher.
 */
export const namesMatch = (a: string | undefined, b: string | undefined): boolean => {
  const x = String(a ?? "").trim().toLowerCase();
  const y = String(b ?? "").trim().toLowerCase();
  if (!x || !y) return false;
  if (x === y) return true;
  const sa = surname(x);
  const sb = surname(y);
  return Boolean(sa) && sa === sb;
};

/**
 * Does `text` mention the person `name` as a WHOLE WORD (not a substring)? Matches the full name
 * (word-bounded) or, failing that, the surname (≥3 chars, word-bounded) so "A porter cleared Ada
 * Blythe" or "...cleared Blythe" both count, but "Annabelle" never matches suspect "Ann".
 */
export const nameAppearsAsWord = (name: string | undefined, text: string | undefined): boolean => {
  const n = String(name ?? "").trim();
  const t = String(text ?? "");
  if (!n || !t) return false;
  if (new RegExp(`\\b${escapeRegExpLiteral(n)}\\b`, "i").test(t)) return true;
  const sn = surname(n);
  if (sn.length >= 3) {
    return new RegExp(`\\b${escapeRegExpLiteral(sn)}\\b`, "i").test(t);
  }
  return false;
};

/**
 * Does the controlled vocabulary string `roleArchetype` contain `role` as a WHOLE WORD? Replaces
 * `ra.includes("victim")`-style tests that false-positive on "victim's confidant"/"victim advocate".
 */
export const roleArchetypeIncludesWord = (roleArchetype: string | undefined, role: string): boolean => {
  const ra = String(roleArchetype ?? "").trim();
  if (!ra) return false;
  return new RegExp(`\\b${escapeRegExpLiteral(role)}\\b`, "i").test(ra);
};

// Non-police domain qualifiers that make "inspector"/"investigator" a SUSPECT occupation, not the
// crime detective — a generic denylist (no story-specific names), extend as new domains surface.
const NON_DETECTIVE_QUALIFIER_RE =
  /\b(building|insurance|health|safety|tax|customs|sanitary|fire|factory|ticket|quality|food|meat|housing|claims|loss|sales|talent)\s+(inspector|investigator)\b/i;

/**
 * Does a role-archetype string denote a CRIME detective (not e.g. a "building inspector" suspect)?
 * Word-boundary match on detective/sleuth/investigator/inspector, minus the non-police domain
 * qualifiers above. Replaces `/detective|investigator|inspector|sleuth/.test(...)` which substring-
 * false-positives ("insurance investigator", "building inspector" → wrongly the detective).
 */
export const isDetectiveArchetype = (roleArchetype: string | undefined): boolean => {
  const ra = String(roleArchetype ?? "").toLowerCase();
  if (!ra) return false;
  if (NON_DETECTIVE_QUALIFIER_RE.test(ra)) return false;
  return /\b(detective|sleuth|investigator|inspector)\b/.test(ra);
};
