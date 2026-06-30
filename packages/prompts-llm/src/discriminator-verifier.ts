/**
 * A_57 §9.2 — the discriminator verifier (logical soundness).
 *
 * "The central clue contradicts itself" and "the test says the evidence proves itself" are the same
 * failure: we check that a discriminating test is *mentioned*, never that it actually *discriminates*. A
 * fair-play mystery is logically sound iff the test (1) excludes every suspect but the culprit, (2) using
 * clues the reader has already seen, (3) via steps the reader can reconstruct.
 *
 * This is a deterministic STRUCTURAL soundness check over the suspect partition — not a full
 * constraint-satisfaction proof, but it catches the real failure modes that ship unsound cases:
 *   - no culprit named (nothing to converge on);
 *   - the test ELIMINATES the culprit (a self-contradicting partition);
 *   - a suspect who is neither the culprit nor eliminated (the reader cannot rule them out → not fair-play);
 *   - the test cites no already-planted clue (cannot be reconstructed).
 *
 * Parameter-generic: it operates on the suspect set / elimination set / clue count, never on a specific
 * name, mechanism, or value. A case that fails here is unsound and should be repaired BEFORE prose.
 */

const norm = (s: unknown): string => String(s ?? "").trim().toLowerCase();

const uniqNorm = (names: ReadonlyArray<string>): Set<string> => {
  const set = new Set<string>();
  for (const n of names) {
    const key = norm(n);
    if (key) set.add(key);
  }
  return set;
};

export type DiscriminatorIssueKind =
  | "no_culprit"
  | "culprit_eliminated"
  | "suspect_unaccounted"
  | "no_evidence_clues";

export interface DiscriminatorIssue {
  kind: DiscriminatorIssueKind;
  detail: string;
}

export interface DiscriminatorVerdict {
  /** true when the partition is structurally sound: culprit present, not eliminated, every other suspect
   *  eliminated, and at least one planted clue cited. */
  sound: boolean;
  issues: DiscriminatorIssue[];
}

export interface DiscriminatorVerifierInputs {
  /** the named culprit(s) the case converges on */
  culprits: ReadonlyArray<string>;
  /** every suspect in play (non-detective, non-victim cast) */
  suspects: ReadonlyArray<string>;
  /** the suspects the discriminating test explicitly eliminates */
  eliminatedSuspects: ReadonlyArray<string>;
  /** how many already-planted clues the test cites (fair-play reconstructability) */
  evidenceClueCount: number;
}

/**
 * Verify that the discriminating test partitions the suspects soundly: the culprit is the unique survivor
 * and every other suspect is eliminated by already-seen clues. Pure; deterministic.
 */
export function verifyDiscriminator(inputs: DiscriminatorVerifierInputs): DiscriminatorVerdict {
  const issues: DiscriminatorIssue[] = [];
  const culprits = uniqNorm(inputs.culprits);
  const eliminated = uniqNorm(inputs.eliminatedSuspects);
  // Preserve the first-seen original spelling of each name for human-readable issue details, while all
  // matching is done on the normalized key.
  const display = new Map<string, string>();
  for (const n of [...inputs.culprits, ...inputs.suspects, ...inputs.eliminatedSuspects]) {
    const key = norm(n);
    if (key && !display.has(key)) display.set(key, String(n).trim());
  }
  const show = (key: string): string => display.get(key) ?? key;

  if (culprits.size === 0) {
    issues.push({ kind: "no_culprit", detail: "no culprit is named — the test has nothing to converge on" });
  }

  // The test must not eliminate the culprit (a partition that excludes its own answer is unsound).
  for (const c of culprits) {
    if (eliminated.has(c)) {
      issues.push({
        kind: "culprit_eliminated",
        detail: `the discriminating test eliminates the culprit "${show(c)}" — the partition contradicts itself`,
      });
    }
  }

  // Every suspect must be either the culprit or explicitly eliminated; an unaccounted suspect means the
  // reader cannot rule them out, so the case is not fair-play sound.
  for (const s of uniqNorm(inputs.suspects)) {
    if (!culprits.has(s) && !eliminated.has(s)) {
      issues.push({
        kind: "suspect_unaccounted",
        detail: `suspect "${show(s)}" is neither the culprit nor eliminated by the test — the reader cannot exclude them`,
      });
    }
  }

  if (inputs.evidenceClueCount <= 0) {
    issues.push({
      kind: "no_evidence_clues",
      detail: "the discriminating test cites no already-planted clue — its conclusion cannot be reconstructed",
    });
  }

  return { sound: issues.length === 0, issues };
}
