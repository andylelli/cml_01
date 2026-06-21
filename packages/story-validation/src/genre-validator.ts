/**
 * genre-validator.ts — SWEEP A.
 *
 * Validates the Golden Age fair-play genre structures that the CASE schema now carries:
 *   - a false_solution (convincing wrong accusation of an innocent suspect, with one flaw)
 *   - at least two red_herrings, each with an innocent_explanation
 *   - a closed_circle whose suspect pool contains the real culprit and excludes outsiders
 *
 * These structures are optional in the schema (so legacy CML still validates), so this
 * validator is the enforcement point. It returns structured errors/warnings; callers decide
 * whether to hard-fail or treat as warnings (initially wired as warnings in Agent 6).
 */

export interface GenreValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

const asArray = (value: unknown): any[] => (Array.isArray(value) ? value : []);
const asString = (value: unknown): string => (typeof value === "string" ? value.trim() : "");
const nameKey = (value: string): string => value.trim().toLowerCase();
const surname = (value: string): string => value.trim().split(/\s+/).pop()?.toLowerCase() ?? "";

const namesMatch = (a: string, b: string): boolean => {
  if (!a || !b) return false;
  const ka = nameKey(a);
  const kb = nameKey(b);
  return ka === kb || surname(a) === surname(b);
};

/**
 * @param caseData The CML object (expects `{ CASE: {...} }` or a bare CASE block).
 * @param minRedHerrings Minimum number of resolved red herrings required (Golden Age default 2).
 */
export function validateGenreStructure(
  caseData: any,
  minRedHerrings = 2,
): GenreValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  const CASE = caseData?.CASE ?? caseData ?? {};
  const culprits: string[] = asArray(CASE?.culpability?.culprits).map(asString).filter(Boolean);

  // --- false_solution ---
  const fs = CASE?.false_solution;
  if (!fs || typeof fs !== "object") {
    errors.push("Genre: false_solution is missing — the story needs a convincing wrong solution that the detective later refutes.");
  } else {
    const accused = asString(fs.accused_suspect);
    const flaw = asString(fs.the_one_flaw);
    const support = asArray(fs.supporting_points).map(asString).filter(Boolean);
    if (!accused) {
      errors.push("Genre: false_solution.accused_suspect is empty.");
    } else if (culprits.some((c) => namesMatch(c, accused))) {
      errors.push(`Genre: false_solution accuses "${accused}", who is the real culprit. The false solution must accuse an INNOCENT suspect.`);
    }
    if (!flaw) {
      errors.push("Genre: false_solution.the_one_flaw is empty — the false solution must contain a single detectable flaw.");
    }
    if (support.length === 0) {
      warnings.push("Genre: false_solution has no supporting_points; it will not feel convincing to the reader.");
    }
  }

  // --- red_herrings ---
  const herrings = asArray(CASE?.red_herrings);
  const wellFormed = herrings.filter((h) => asString(h?.description) && asString(h?.innocent_explanation));
  if (wellFormed.length < minRedHerrings) {
    errors.push(
      `Genre: found ${wellFormed.length} well-formed red herring(s) (need ≥${minRedHerrings}). ` +
      `Each red herring must have a description AND an innocent_explanation.`,
    );
  }
  herrings.forEach((h, idx) => {
    if (asString(h?.description) && !asString(h?.innocent_explanation)) {
      errors.push(`Genre: red herring ${idx + 1} ("${asString(h.description).slice(0, 40)}…") has no innocent_explanation — no suspicious detail may be left unexplained.`);
    }
  });

  // --- closed_circle ---
  const circle = asArray(CASE?.closed_circle?.suspects).map(asString).filter(Boolean);
  if (circle.length === 0) {
    warnings.push("Genre: closed_circle.suspects is empty; the suspect pool is not explicitly sealed.");
  } else {
    for (const culprit of culprits) {
      if (!circle.some((s) => namesMatch(s, culprit))) {
        errors.push(`Genre: culprit "${culprit}" is not a member of closed_circle.suspects — the culprit must be inside the closed circle.`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
