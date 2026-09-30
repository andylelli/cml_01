/**
 * Run utilities: error text, warning clearance, aborted-run metadata, delay.
 *
 * Moved verbatim from `shared.ts` (code review ORC-06), which re-exports it.
 */
import { INFRA_SIGNAL_PATTERN } from "@cml/story-validation";
import type {
  GenerationReport,
} from "@cml/story-validation";

// ============================================================================
// Utility functions (moved verbatim from mystery-orchestrator.ts)
// ============================================================================

/**
 * Remove warnings from the run's channel IN PLACE. The array identity is load-bearing.
 *
 * WHY THIS IS A SHARED HELPER RATHER THAN THREE LINES AT THE CALL SITE. Agent 6 previously cleared
 * its transient warnings with `ctx.warnings = ctx.warnings.filter(...)`. `filter` returns a NEW
 * array, and that call is unconditional at the end of every Agent 6 — so every run severed
 * `ctx.warnings` from the orchestrator's array and **everything Agent 7, Agent 7.5 and Agent 9 pushed
 * afterwards went nowhere**: regen-unresolved notes, release-gate reasons, geometry violations. Every
 * archived report shows zero `[Agent 9]` warnings, not because Agent 9 is quiet. The clearing did not
 * work either — the report reads the orchestrator's array, which still held every line it removed.
 *
 * One exported body means the behaviour is unit-testable directly, rather than inferred from a source
 * scan of the call site. A comment claiming the invariant is what let this survive; see
 * `warning-channel-aliasing.test.ts` for the property, and REVIEW_04 §4.3 for the measurement.
 *
 * Returns how many entries were removed, so a caller can log a no-op distinctly from a clearance.
 */
export function clearWarningsInPlace(warnings: string[], toClear: ReadonlySet<string>): number {
  if (!Array.isArray(warnings) || warnings.length === 0) return 0;
  if (toClear.size === 0) return 0;
  const kept = warnings.filter((warning) => !toClear.has(String(warning).trim()));
  const removed = warnings.length - kept.length;
  if (removed === 0) return 0;
  warnings.length = 0;
  for (const warning of kept) warnings.push(warning);
  return removed;
}

export function describeError(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
}

export function applyAbortedRunMetadata(report: GenerationReport, reason: string): void {
  // SCO-05: the same pattern generateReport uses (this was a verbatim copy of it).
  report.run_outcome = INFRA_SIGNAL_PATTERN.test(reason) ? "infra_failure" : "aborted";
  report.run_outcome_reason = reason;
  report.passed = false;

  if (report.scoring_outcome) {
    report.scoring_outcome.passed_threshold = false;
  }

  (report as any).in_progress = false;
  (report as any).aborted = true;
  (report as any).abort_reason = reason;
}

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
