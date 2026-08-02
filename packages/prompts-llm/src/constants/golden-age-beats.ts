/**
 * R4 — the canonical Golden Age beat arc, extracted from agent7-narrative.ts.
 *
 * WHY ITS OWN MODULE: agent7-narrative-schema.ts needs these literals to build the `beat` enum,
 * and agent7-narrative.ts needs the schema. Importing across that pair created a cycle in which
 * GOLDEN_AGE_BEATS evaluated to undefined inside the schema ("GOLDEN_AGE_BEATS is not iterable").
 * A shared leaf module both sides import is the fix; duplicating the list would have been the same
 * one-definition-two-bodies trap this refactor exists to remove.
 */

/** SWEEP B: the canonical Golden Age 10-chapter arc, in order (see documentation/Golden Age Crime.txt §7). */
export const GOLDEN_AGE_BEATS = [
  "gathering",
  "crime",
  "first_enquiries",
  "motives",
  "alibis",
  "false_solution",
  "secrets",
  "pattern",
  "final_trap",
  "revelation",
] as const;

export type GoldenAgeBeat = (typeof GOLDEN_AGE_BEATS)[number];
