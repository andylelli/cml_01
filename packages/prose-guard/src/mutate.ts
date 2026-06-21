/**
 * Validation-gated mutation (Agent 9 redesign §4.2) — the absolute law:
 *
 *   No deterministic pass may alter prose and ship it without re-running the validator it claims to
 *   satisfy and proving it broke nothing else.
 *
 * §3.2 (the grounding-lead leak that dumped location metadata into a chapter's first line) and §3.3
 * (the pronoun sweep that flipped a correct female pronoun run to male) are the *same* bug wearing
 * two costumes: a deterministic pass mutated already-clean output and shipped it unvalidated.
 * `mutateThenValidate` makes that impossible — the mutation ships only if it strictly does not
 * regress the validated property; otherwise the untouched original ships. The system kept
 * re-discovering this rule one bug at a time (the §3.3 "monotonic guard"); here it is the universal law.
 */

import type { MutationOutcome, Validator } from "./types.js";

/**
 * Apply `mutate`, then re-run `validate`. Ship the mutation only if it broke nothing — i.e. it did
 * not turn an ok value un-ok, did not lower the score, and introduced no new violation. Otherwise
 * revert to the original. Pure: no I/O, deterministic given pure inputs.
 */
export function mutateThenValidate<T>(value: T, mutate: (v: T) => T, validate: Validator<T>): MutationOutcome<T> {
  const before = validate(value);
  const mutated = mutate(value);
  const after = validate(mutated);

  const newViolations = after.violations.filter((v) => !before.violations.includes(v));
  const regressed =
    (before.ok && !after.ok) || // a clean value became dirty
    after.score < before.score || // any quality/fidelity regression
    newViolations.length > 0; // introduced a violation that wasn't there

  if (regressed) {
    const reason =
      newViolations.length > 0
        ? `mutation introduced: ${newViolations.join("; ")}`
        : before.ok && !after.ok
          ? "mutation made a clean value invalid"
          : `mutation lowered score ${before.score} → ${after.score}`;
    return { value, applied: false, reverted: true, reason, before, after };
  }

  return { value: mutated, applied: true, reverted: false, before, after };
}

/**
 * Compose several validators into one — the value must satisfy ALL of them; scores sum; violations
 * concatenate. Lets a single mutation be gated against every property it could plausibly break.
 */
export function allOf<T>(...validators: Validator<T>[]): Validator<T> {
  return (value: T) => {
    const results = validators.map((v) => v(value));
    return {
      ok: results.every((r) => r.ok),
      score: results.reduce((s, r) => s + r.score, 0),
      violations: results.flatMap((r) => r.violations),
    };
  };
}
