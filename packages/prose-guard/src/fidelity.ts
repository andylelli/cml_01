/**
 * Contract-fidelity checking (Agent 9 redesign §4.1 / §6.4) and the example validators the §3.2/§3.3
 * defects are gated against.
 *
 * Fidelity is a *machine property* — "does clue C7 appear by chapter 6, described so a reader could
 * use it?" has a yes/no answer. `checkContractFidelity` answers it deterministically: it is the ONE
 * thing a chapter is checked against, replacing the completeness / clue_timing / continuity / fair_play
 * retry grab-bag. `must_surface` misses and `must_not_reveal` leaks are HARD (never cosmetic);
 * absent characters are SOFT nudges.
 */

import type {
  ChapterObligationContract,
  FidelityReport,
  FidelityViolation,
  Validator,
} from "./types.js";

const includesCI = (haystack: string, needle: string): boolean =>
  needle.trim().length > 0 && haystack.toLowerCase().includes(needle.trim().toLowerCase());

/** Terms that prove a clue is on the page — its key terms, or the bare id as a last resort. */
const termsFor = (o: { clue: string; keyTerms?: string[] }): string[] =>
  o.keyTerms && o.keyTerms.length ? o.keyTerms : [o.clue];

const GUILT_MARKERS = /(murder(?:er|ed)?|kill(?:er|ed)|strangl|poison(?:er|ed)|guilty|culprit|did it|the one who|is the killer)/i;

/** Heuristic: does the prose REVEAL `name` as the culprit (name near a guilt marker)? Best-effort. */
export function revealsCulprit(prose: string, name: string): boolean {
  if (!name.trim()) return false;
  const esc = name.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const near = new RegExp(`${esc}[^.!?]{0,60}${GUILT_MARKERS.source}|${GUILT_MARKERS.source}[^.!?]{0,60}${esc}`, "i");
  return near.test(prose);
}

export interface FidelityOptions {
  /** The culprit's name, needed to check `must_not_reveal.solution_culprit`. */
  culpritName?: string;
}

/** Check one chapter's prose against its obligation contract. Deterministic, no LLM. */
export function checkContractFidelity(
  prose: string,
  contract: ChapterObligationContract,
  opts: FidelityOptions = {},
): FidelityReport {
  const violations: FidelityViolation[] = [];
  const surfaced: string[] = [];

  // must_surface — every required clue is on the page (HARD)
  for (const o of contract.must_surface) {
    if (termsFor(o).some((t) => includesCI(prose, t))) surfaced.push(o.clue);
    else violations.push({ kind: "missing_clue", severity: "hard", detail: `clue ${o.clue} not surfaced (looked for: ${termsFor(o).join(", ")})` });
  }

  // must_not_reveal — no future clue leaks early (HARD)
  for (const o of contract.must_not_reveal.clues) {
    if (termsFor(o).some((t) => includesCI(prose, t))) {
      violations.push({ kind: "leaked_clue", severity: "hard", detail: `clue ${o.clue} leaked before its chapter` });
    }
  }

  // must_not_reveal — the culprit is not unmasked early (HARD)
  if (contract.must_not_reveal.solution_culprit && opts.culpritName && revealsCulprit(prose, opts.culpritName)) {
    violations.push({ kind: "culprit_revealed", severity: "hard", detail: `culprit "${opts.culpritName}" revealed before the reveal chapter` });
  }

  // present — each named character actually appears (SOFT)
  for (const name of contract.present) {
    if (!includesCI(prose, name)) violations.push({ kind: "absent_character", severity: "soft", detail: `present character "${name}" not mentioned` });
  }

  const hard = violations.filter((v) => v.severity === "hard").length;
  const soft = violations.filter((v) => v.severity === "soft").length;
  const score = Math.max(0, 100 - hard * 25 - soft * 5);
  return { ok: hard === 0, chapter: contract.chapter, violations, surfaced, score };
}

/** A `Validator<string>` over a chapter contract — what the best-draft backstop and mutate gate use. */
export function makeFidelityValidator(contract: ChapterObligationContract, opts: FidelityOptions = {}): Validator<string> {
  return (prose: string) => {
    const r = checkContractFidelity(prose, contract, opts);
    return { ok: r.ok, score: r.score, violations: r.violations.filter((v) => v.severity === "hard").map((v) => `${v.kind}:${v.detail}`) };
  };
}

// ── example validators: the exact properties §3.2 and §3.3 broke ─────────────

const META_DUMP = [
  /\b\w[\w'.]* - \w/, // "Wynthorpe Manor - Library" hyphen dump
  /underlies the .* setting/i, // "...a quiet tension underlies the cozy setting cast."
  /\bsetting cast\b/i,
  /\bundefined\b|\[object|\bNaN\b/i, // interpolation artifacts
  /,\s*\w+,\s*\w+\s+in\b/i, // "Name, Region, Country in ..." chain
];

/** Detect the §3.2 grounding-lead leak: location metadata dumped into a chapter opening. */
export function detectLocationMetadataDump(prose: string): boolean {
  const opening = prose.split(/(?<=[.!?])\s/)[0] ?? prose.slice(0, 160);
  return META_DUMP.some((re) => re.test(opening));
}

/** Validator gating against the §3.2 leak — clean prose passes, a metadata-dumped opening fails. */
export const noMetadataDumpValidator: Validator<string> = (prose) => {
  const dump = detectLocationMetadataDump(prose);
  return { ok: !dump, score: dump ? 0 : 100, violations: dump ? ["location_metadata_dump_in_opening"] : [] };
};

const PRONOUNS = {
  female: /\b(she|her|hers|herself)\b/gi,
  male: /\b(he|him|his|himself)\b/gi,
} as const;

const count = (s: string, re: RegExp): number => (s.match(re) ?? []).length;

/**
 * Count pronouns of the WRONG gender for a passage whose subject is known. Used to gate the §3.3
 * pronoun sweep: if a mutation introduces wrong-gender pronouns, the score drops and it is reverted.
 */
export function countMisgenderedPronouns(prose: string, expected: "female" | "male"): number {
  return expected === "female" ? count(prose, PRONOUNS.male) : count(prose, PRONOUNS.female);
}

/** Validator gating against the §3.3 flip for a passage about a known-gender subject. */
export function pronounConsistencyValidator(expected: "female" | "male"): Validator<string> {
  return (prose: string) => {
    const wrong = countMisgenderedPronouns(prose, expected);
    return { ok: wrong === 0, score: 100 - wrong * 10, violations: wrong > 0 ? [`misgendered_pronouns:${wrong}`] : [] };
  };
}
