/**
 * Two malformed-prose repairs the external reader of `story_20260828-2301` named directly.
 *
 * ── WHAT THE READER SAW ──────────────────────────────────────────────────────────────────────────
 *
 * That manuscript scored 85/100 — the second-best this project has produced — with `prose` capped at
 * 7 and the note *"Atmospheric, but capped by leakage and malformed lines."* Among the lines they
 * listed for removal:
 *
 *     "I just hoped to avoid dismissal dr finch... she was strict, but she hadn t earned the right"
 *
 * Two separate defects in one clause: a cast name in lower case after a title, and a contraction
 * missing its apostrophe. The reader's verdict: *"The malformed Sylvia lines especially hurt polish."*
 *
 * ── MEASURED BEFORE BUILDING ─────────────────────────────────────────────────────────────────────
 *
 * Across the 196 manuscripts on disk:
 *
 *     lowercase name after a title      49 occurrences in 22 books (11%)
 *     contraction missing an apostrophe  7 occurrences in  4 books  (2%)
 *
 * ── WHY THE NAME FIX IS CAST-SCOPED, AND WHY THAT IS NOT CAUTION BUT NECESSITY ───────────────────
 *
 * The obvious repair — capitalise whatever follows a title — corrupts prose. The corpus says so:
 * of those 49 hits, 33 are real names (`ivor` ×19, `hale` ×5, `mallory` ×4, `finch` ×3, `reginald`
 * ×2) and **16 are ordinary words** (`was` ×4, `hesitated`, `deepened`, `until`, `hardly`, `to`, …)
 * in sentences like *"the Captain was late"*. An unconditional rule would write *"the Captain Was
 * late"* — trading a defect the reader noticed for one they would notice more.
 *
 * So a lower-case word is capitalised ONLY when it matches a cast name token. Nothing else is
 * touched, and with an empty cast list this function is the identity.
 *
 * The apostrophe repair needs no such guard: `hadn` is not an English word in any other context.
 */

const TITLES = ["Dr", "Mr", "Mrs", "Ms", "Miss", "Captain", "Lady", "Sir", "Lord", "Professor", "Inspector", "Sergeant"];

/**
 * `Dr finch` / `dr finch` / `Captain ivor` — a title, then a lower-case word that might be a name.
 *
 * The TITLE is matched case-INSENSITIVELY, because the defect in the manuscript is `dr finch` with
 * both words lower case; a capitalised-title-only pattern misses the very line the reader quoted.
 *
 * That is safe only because of the cast guard below. `sir`, `captain` and `lady` are ordinary words
 * in lower case ("yes sir", "the captain nodded"), so matching them case-insensitively would be
 * reckless on its own — but nothing is rewritten unless the FOLLOWING word is a cast name, and
 * "the captain nodded" has no cast member called Nodded.
 */
const TITLE_THEN_LOWER = new RegExp(
  "\\b(" + TITLES.join("|") + ")(\\.?\\s+)([a-z][a-z'-]+)\\b",
  "gi",
);

/** Canonical spelling for a title, so `dr Finch` becomes `Dr Finch` rather than half-repaired. */
const TITLE_CANONICAL = new Map(TITLES.map((t) => [t.toLowerCase(), t]));

/**
 * Contractions whose apostrophe the model drops. Each stem is a non-word on its own, so a bare
 * `<stem> t` is unambiguous — there is no sentence in which "hadn t" is correct.
 */
const CONTRACTION_STEMS = [
  "hadn", "didn", "couldn", "wouldn", "shouldn", "isn", "wasn", "aren", "weren",
  "doesn", "don", "hasn", "haven", "won", "can", "mustn", "needn", "wouldn",
];
const CONTRACTION = new RegExp("\\b(" + [...new Set(CONTRACTION_STEMS)].join("|") + ") t\\b", "gi");

/** Every token a cast member is referred to by: full name, forename, surname. */
const castTokens = (castNames: ReadonlyArray<string>): Map<string, string> => {
  const byLower = new Map<string, string>();
  for (const full of castNames) {
    const name = String(full ?? "").trim();
    if (!name) continue;
    for (const part of name.split(/\s+/)) {
      const clean = part.replace(/[^A-Za-z'-]/g, "");
      // Two letters is too short to be safely distinguishable from a word.
      if (clean.length >= 3) byLower.set(clean.toLowerCase(), clean);
    }
  }
  return byLower;
};

export interface NameHygieneResult {
  text: string;
  /** What changed, for the run warnings. A silent repair cannot be audited. */
  repairs: string[];
}

/**
 * Repair both classes in one pass. Returns the original text and an empty list when there is nothing
 * to do, so callers can skip re-validation on a no-op.
 */
export const repairNameHygiene = (
  text: string,
  castNames: ReadonlyArray<string> = [],
): NameHygieneResult => {
  const source = String(text ?? "");
  if (!source) return { text: source, repairs: [] };
  const tokens = castTokens(castNames);
  const repairs: string[] = [];

  let out = source.replace(TITLE_THEN_LOWER, (whole, title: string, gap: string, word: string) => {
    const canonicalName = tokens.get(word.toLowerCase());
    if (!canonicalName) return whole; // an ordinary word — "the Captain was late" stays as written
    // Repair the TITLE's case too: the manuscript defect is "dr finch", not "Dr finch".
    const canonicalTitle = TITLE_CANONICAL.get(title.toLowerCase()) ?? title;
    const replacement = `${canonicalTitle}${gap}${canonicalName}`;
    if (replacement === whole) return whole;
    repairs.push(`"${whole}" -> "${replacement}"`);
    return replacement;
  });

  out = out.replace(CONTRACTION, (whole, stem: string) => {
    repairs.push(`"${whole}" -> "${stem}'t"`);
    return `${stem}'t`;
  });

  return { text: out, repairs };
};

/** Convenience for the prose chain: repair every paragraph of every chapter. */
export const repairNameHygieneInChapters = <T extends { paragraphs?: string[] }>(
  chapters: ReadonlyArray<T>,
  castNames: ReadonlyArray<string> = [],
): { chapters: T[]; repairs: string[] } => {
  const repairs: string[] = [];
  const out = chapters.map((chapter, idx) => {
    const paragraphs = Array.isArray(chapter?.paragraphs) ? chapter.paragraphs : [];
    const fixed = paragraphs.map((p) => {
      const r = repairNameHygiene(p, castNames);
      for (const line of r.repairs) repairs.push(`ch${idx + 1}: ${line}`);
      return r.text;
    });
    return { ...chapter, paragraphs: fixed };
  });
  return { chapters: out, repairs };
};
