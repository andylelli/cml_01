/**
 * ONE mojibake vocabulary — detection AND repair.
 *
 * A_73 §11.2. X79 unified the DETECTOR (`MOJIBAKE_PATTERN`, story-validation) after a release-gate
 * hard stop read a shorter list than the validator. The two REPAIR tables were left alone, and they
 * had drifted in two directions:
 *
 *   apps/api/src/server.ts          9 rules, `faˆ§ade` → `façade`, `â€¦` → `…`
 *   apps/worker/.../save-readable-story.ts   8 rules, no façade rule, `â€¦` → `...`
 *
 * Two consequences, both live before this file existed:
 *
 *   1. THE SAVED MANUSCRIPT AND THE RENDERED ONE WERE DIFFERENT TEXT. A `façade` artifact was
 *      repaired in the API view and not in the file on disk; every ellipsis differed. The external
 *      reader reads the file; the gate judged the other one.
 *   2. THE DOUBLE-ENCODED FAMILY WAS DETECT-ONLY. `MOJIBAKE_PATTERN` matches `Ã¢â‚¬â„¢` and friends,
 *      and `hardStopReasons.push("mojibake/encoding artifact remains")` ABORTS THE RUN on it — while
 *      neither repair table could remove it. The one condition allowed to kill a run had no repair
 *      path (A_73 §15.2). Those rules are included below, and ordered first: a double-encoded
 *      sequence contains a single-encoded one as a substring, so repairing the short form first
 *      would strand the remainder.
 *
 * Lives in @cml/cml because it is the only package both `apps/api` and `apps/worker` already depend
 * on. story-validation re-exports it beside the detector so the pair stays visibly one thing.
 */

/** Ordered repair rules. Double-encoded sequences MUST precede their single-encoded substrings. */
export const MOJIBAKE_REPLACEMENTS: ReadonlyArray<readonly [RegExp, string]> = [
  // ── Double-encoded (UTF-8 read as cp1252 twice). Detect-only until 2026-08-24.
  [/Ã¢â‚¬â„¢/g, "’"],
  [/Ã¢â‚¬Ëœ/g, "‘"],
  [/Ã¢â‚¬Å“/g, "“"],
  [/Ã¢â‚¬\x9d/g, "”"],
  [/Ã¢â‚¬â€œ/g, "–"],
  [/Ã¢â‚¬â€/g, "—"],
  [/Ã¢â‚¬Â¦/g, "…"],
  [/Ã¢â‚¬"/g, "—"],
  // ── Single-encoded.
  [/â€™/g, "’"],
  [/â€˜/g, "‘"],
  [/â€œ|â€\x9d/g, '"'],
  [/â€"|â€”/g, "—"],
  [/â€“/g, "–"],
  [/â€¦/g, "…"],
  // ── Named cases and strays.
  [/faˆ§ade/g, "façade"],
  [/Ë†Â§/g, "ç"],
  [/Ã‚/g, ""],
  [/Â/g, ""],
  [/�/g, ""],
];

/**
 * Apply every repair rule, in order.
 *
 * Deliberately NOT a detector: callers that need to know whether an artifact REMAINS should use
 * `MOJIBAKE_PATTERN` after calling this, which is what makes the pair testable against each other.
 */
export const repairMojibake = (value: unknown): string => {
  let s = String(value ?? "");
  for (const [re, replacement] of MOJIBAKE_REPLACEMENTS) s = s.replace(re, replacement);
  return s;
};
