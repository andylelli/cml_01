/**
 * A_65b Ph2 (reliability plan) — the warning-channel split.
 *
 * The 179-warning corpus audit (RELIABILITY_REMEDIATION_PLAN §1.2) found ~40% of the run's
 * "warnings" are TELEMETRY — status lines, shadow-gate scores, pre-audit PASSes — polluting the
 * channel and the run-status accounting, so a run whose only lines are informational could never
 * read clean. This classifier bands each line:
 *
 *   "info" — telemetry/status: the pipeline reporting what it is or did, with nothing wrong.
 *   "warn" — defect/degradation: something in the content wasn't right, or a deterministic
 *            floor/synthesis fired (each firing is a source-quality signal the plan counts).
 *
 * The map is a FROZEN PREFIX MAP OVER OUR OWN EMITTED LITERALS — bounded and ours, so it
 * terminates (this is not a paraphrase-chasing detector; the anti-mole law is about foreign
 * text). New push sites choose their band by adding a prefix here; unknown lines default to
 * "warn" (conservative: an unclassified line keeps the old accounting).
 */

export type RunWarningBand = "info" | "warn";

/** Prefixes (or bracketed tags) that are pipeline TELEMETRY, not defects. Frozen list — extend
 *  only when ADDING a new emit site, never to reclassify a defect signal that got noisy. */
const INFO_PREFIXES: ReadonlyArray<string> = [
  // status/config lines
  "Scoring system enabled",
  "Scoring: ", // the post-report phases summary
  "Cross-run novelty: diverging",
  "Pillar 1: locked fact registry built",
  // deterministic-remediation MODE announcements (the mode, not a firing)
  // (matched via includes below: "deterministic remediation mode active")
  // shadow instruments reporting scores — measurements, not defects
  "Clue-spec (shadow):",
  "Final-story rubric (shadow):",
  // A_71 — which model judged the run. Configuration telemetry, not a defect: it fires on every
  // run where RUBRIC_JUDGE_MODEL is unset, and banding it `warn` would put a permanent false
  // defect on the status line of every clean run.
  "Final-story rubric: judge model",
  "[Novelty skeleton-judge SHADOW]",
  // expected, successful contract actions (stamps of designed behavior — NOT deficiency
  // responses: the discovery-tell line, by contrast, fires only when a tell was MISSING and
  // stays `warn`)
  "[Agent 7 plant-before-reveal]",
  "[G6] Read-back comprehension gate: all 4 checks passed.",
];

const INFO_INCLUDES: ReadonlyArray<string> = [
  "deterministic remediation mode active",
  "gate=shadow", // [agent3b-plausibility][shadow] gate=shadow score=…
  "structural pre-audit: PASS",
];

export function classifyRunWarning(warning: string): RunWarningBand {
  const w = String(warning ?? "").trim();
  for (const p of INFO_PREFIXES) if (w.startsWith(p)) return "info";
  for (const s of INFO_INCLUDES) if (w.includes(s)) return "info";
  return "warn";
}

/** Band a full warnings array for the F5 artifact diagnostic and status accounting. */
export function bandRunWarnings(warnings: ReadonlyArray<string>): {
  info: string[];
  warn: string[];
} {
  const info: string[] = [];
  const warn: string[] = [];
  for (const w of warnings) (classifyRunWarning(w) === "info" ? info : warn).push(String(w));
  return { info, warn };
}
