/**
 * A_80 F3 — a retry must not lose what the original had.
 *
 * ── WHY THIS EXISTS ──────────────────────────────────────────────────────────────────────────────
 *
 * A regenerated chapter is accepted if it clears the property that triggered the retry. Nothing asked
 * whether it dropped something the original had. In run mystery-1788202899854 chapter 8's first draft
 * contained the sentence that stated the case's arithmetic correctly — "as was required to set the
 * hands from half past ten to twenty-five minutes past ten". A leakage rule matched the ordinary
 * phrase "required to", forced a regeneration, and the regenerated chapter shipped saying "from
 * twenty-five minutes past ten to twenty-five minutes past ten". The external reader scored the clue
 * logic 4/10.
 *
 * The lint hit was cosmetic. The loss was the mystery.
 *
 * ── WHY THIS IS THE MOST VALUABLE OF THE A_80 FIXES ──────────────────────────────────────────────
 *
 * It is failure-class-general. F1 fixes the rule that fired this time; this catches the next rule,
 * and the one after, without anyone knowing they exist. A chapter with an awkward phrase beats a
 * chapter with broken arithmetic, and that trade is the whole point: **the retry is optional, the
 * facts are not.**
 *
 * ── WHAT IT DELIBERATELY DOES NOT DO ─────────────────────────────────────────────────────────────
 *
 * It does not compare prose quality, length, or style — a retry is *supposed* to change those. It
 * compares only things whose disappearance is unambiguously a loss: canonical locked-fact values,
 * clue identifiers, and stated clock times. Everything else is the regeneration doing its job.
 */

/** Something the original chapter had and the candidate does not. */
export interface RetryLoss {
  kind: "locked_fact" | "clue_id" | "clock_time";
  value: string;
}

const norm = (text: string): string =>
  String(text ?? "")
    .replace(/[‘’]/g, "'")
    .replace(/[“”]/g, '"')
    .toLowerCase()
    .replace(/\s+/g, " ");

/**
 * Word-form and digit-form clock times, as this pipeline writes them.
 *
 * Word-form is listed first and matters most: `repairWordFormLockedFacts` deliberately rewrites
 * digit-form times into word-form, so word-form is the shape a shipped chapter actually carries.
 */
/**
 * Both halves are CLOSED VOCABULARIES, not `[a-z-]+`.
 *
 * The first version of this pattern used `[a-z-]+ (minutes )?(past|to) [a-z-]+` and matched
 * "required to set" — reproducing, one file away, the exact class of defect this module exists to
 * contain: a pattern that reaches for ordinary words and calls the result a finding. An open-class
 * matcher inside a guard that REJECTS work is worse than one inside a guard that merely warns, so
 * the vocabulary is enumerated and a word that is not a number does not make a time.
 */
const MINUTE_WORD =
  "(?:a\\s+)?(?:quarter|half|five|ten|fifteen|twenty|twenty-five|twenty-two|one|two|three|four|six|seven|eight|nine|eleven|twelve|forty|fifty|fifty-five)";
const HOUR_WORD = "(?:one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|midnight|noon)";
const CLOCK_TIME_RE = new RegExp(
  `\\b(?:${MINUTE_WORD}\\s+(?:minutes?\\s+)?(?:past|to)\\s+${HOUR_WORD}` +
    `|${HOUR_WORD}\\s+o'clock` +
    `|\\d{1,2}(?::\\d{2})?\\s*(?:a\\.m\\.|p\\.m\\.|am|pm))\\b`,
  "gi",
);

const clockTimesIn = (text: string): Set<string> =>
  new Set((norm(text).match(CLOCK_TIME_RE) ?? []).map((t) => t.trim()));

export interface RetryRegressionInput {
  /** The chapter text as first generated. */
  original: string;
  /** The chapter text the retry produced. */
  candidate: string;
  /** Canonical locked-fact values for this run (atomic values only — times, numbers, measurements). */
  lockedFactValues?: string[];
  /** Clue identifiers or clue key phrases the chapter is contractually required to carry. */
  clueIds?: string[];
}

/**
 * Everything the candidate lost. Empty means the retry is safe to accept.
 *
 * A value counts as lost only if the original HAD it — a retry cannot be blamed for a fact that was
 * never there, and blaming it would make every retry unacceptable on a chapter that was already
 * missing something.
 */
export function detectRetryRegression(input: RetryRegressionInput): RetryLoss[] {
  const original = norm(input.original);
  const candidate = norm(input.candidate);
  if (!original.trim() || !candidate.trim()) return [];

  const losses: RetryLoss[] = [];

  for (const raw of input.lockedFactValues ?? []) {
    const v = norm(raw).trim();
    if (!v) continue;
    if (original.includes(v) && !candidate.includes(v)) losses.push({ kind: "locked_fact", value: raw });
  }

  for (const raw of input.clueIds ?? []) {
    const v = norm(raw).trim();
    if (!v) continue;
    if (original.includes(v) && !candidate.includes(v)) losses.push({ kind: "clue_id", value: raw });
  }

  // Clock times are discovered rather than declared: a chapter may legitimately state a time that is
  // not a locked fact, and losing it still breaks the reader's timeline.
  const candidateTimes = clockTimesIn(candidate);
  for (const t of clockTimesIn(original)) {
    if (!candidateTimes.has(t)) losses.push({ kind: "clock_time", value: t });
  }

  return losses;
}

/**
 * Flag `AGENT9_RETRY_REGRESSION_GUARD`, **default OFF**, read at call time (ADR-0004).
 *
 * Off by convention rather than doubt. When it is on, a retry that loses a fact is rejected and the
 * ORIGINAL chapter is kept — including whatever lint hit triggered the retry in the first place. That
 * is the intended trade and it should be a deliberate flip, because it means some chapters will ship
 * carrying a detector complaint that today's pipeline would have regenerated away.
 */
export const retryRegressionGuardEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  /^(1|true|yes|on)$/i.test(String(env.AGENT9_RETRY_REGRESSION_GUARD ?? "").trim());

/** One-line summary for the run log. */
export const describeRetryLosses = (losses: RetryLoss[]): string =>
  losses
    .map((l) => `${l.kind}:"${l.value.length > 42 ? `${l.value.slice(0, 42)}…` : l.value}"`)
    .join(", ");
