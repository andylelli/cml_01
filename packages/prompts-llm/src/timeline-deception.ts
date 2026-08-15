/**
 * MOVED 2026-08-03 to `@cml/cml/timeline-deception.ts`. This file is a re-export, not a second body.
 *
 * WHY IT MOVED. The invariant is a property of the CASE — the apparent time must sit inside a window
 * the culprit can account for, the actual time outside it — so it belongs beside `validateCml`, which
 * now enforces it. `@cml/cml` is a leaf and cannot import this package, so the body had to move
 * rather than be called across the dependency edge.
 *
 * WHY THE SHIM STAYS. `parseClockTime` is imported from `@cml/prompts-llm` by the worker and by
 * `scripts/geometry-backtest.mjs`, and one of the two things this whole line of work is about is not
 * creating a second implementation of a check. Re-exporting keeps every existing import path valid
 * and keeps the count of bodies at one.
 */
export {
  checkCaseTimelineDeception,
  checkTimelineDeception,
  parseClockTime,
  parseTimeWindow,
  checkCaseTimeCoherence,
  parseDurationMinutes,
  type TimelineDeceptionInput,
  type TimelineDeceptionViolation,
  type CaseTimeCoherenceViolation,
} from "@cml/cml";
