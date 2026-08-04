/**
 * X1 (architecture/REVIEW_05.md §12.1) — every violation code, and whether anything can act on it.
 *
 * FOUND on the 08-04 treatment run: `false_solution_absent (ch6)` — the chapter carrying the false
 * solution never puts the falsely-accused in the frame. It was detected, reported, and then nothing
 * happened, because the code maps to no repair path. That is a legitimate state; what was not
 * legitimate is that it was INDISTINGUISHABLE from a code that does have one. A violation that
 * silently has nowhere to go reads, on the report, exactly like a violation that was handled.
 *
 * So the partition is stated here and asserted by test: every code is either repairable — by a
 * reused defect kind or by its own pass — or listed below with the reason it is not. A new code
 * added to `accept.ts` without a decision fails the test rather than joining the silent bucket.
 *
 * This lives in the package that OWNS the codes rather than in `agent9-run.ts`, which owns only the
 * mapping. A partition kept next to the mapping can only ever check itself.
 */

/** Every code `checkManuscriptGeometry` can emit. Kept in the order `accept.ts` records them. */
export const GEOMETRY_VIOLATION_CODES = [
  "contract_chapter_missing",
  "time_model_unparseable",
  "unaccounted_time",
  "method_signature_absent",
  "clincher_absent_at_payoff",
  "clincher_not_planted",
  "reveal_culprit_not_named",
  "reveal_method_absent",
  "reveal_motive_absent",
  "aftermath_repeat",
  "false_solution_absent",
  "clearance_over_budget",
] as const;

export type GeometryViolationCode = (typeof GEOMETRY_VIOLATION_CODES)[number];

/**
 * Codes with no LLM repair path, and why. The reason is the point of the table: three of these five
 * are not prose defects at all, and conflating them with the one that is would argue for building
 * four passes when the evidence supports considering one.
 */
export const GEOMETRY_CODES_WITHOUT_PROSE_REPAIR: Readonly<Record<string, string>> = {
  contract_chapter_missing:
    "the outline is short of the chapter the contract binds — an Agent 7 defect; no prose change can add a chapter",
  time_model_unparseable:
    "the case's own times do not parse — an Agent 3 defect; repairing the prose would hide it",
  unaccounted_time:
    "the manuscript states a clock time nothing in the case accounts for. Repairable in principle, but the right repair is usually to the CASE (a locked fact is missing) and not to the chapter",
  false_solution_absent:
    "X1 — the false-solution chapter never accuses the falsely accused. A real gap with no pass: nothing in the regen registry expresses 'argue a wrong solution convincingly'. Gated on N8 rather than built now (REVIEW_05 §12.1)",
  clearance_over_budget:
    "too MANY clearances — a negative constraint, and the only negative pass that exists (aftermath_repeat) removes repetition rather than trimming a register",
};

/**
 * `aftermath_repeat` has its own runner rather than a reused defect kind, so it is repairable
 * without appearing in `agent9-run.ts`'s reuse map. Named here so the partition can be total.
 */
export const GEOMETRY_CODES_WITH_OWN_PASS: ReadonlyArray<string> = ["aftermath_repeat"];
