/**
 * What runAgent6's phases share besides ctx: read-only settings and closures (Agent6Run) and the audit-loop
 * state a phase may set (Agent6State). Moved from agent6-run.ts (code review A6-01 / CR-25).
 */
import type { FairPlayAuditResult, StructuralAuditResult } from "@cml/prompts-llm";
import { getGenerationParams } from "@cml/story-validation";

/**
 * CR-25 (A6-01) — what runAgent6's phases share besides ctx: read-only settings and closures (Agent6Run) and the audit-loop state a phase may set (Agent6State).
 */
export interface Agent6Run {
  emitAgent6Warning: (message: string, kind: "transient-progress" | "transient-diagnostic" | "persistent-risk") => void;
  clearWarningsFromSet: (toClear: Set<string>) => void;
  transientProgressWarnings: Set<string>;
  transientDiagnosticWarnings: Set<string>;
  fairPlayConfig: ReturnType<typeof getGenerationParams>["agent6_fairplay"]["params"];
  minBlindConfidence: string;
  fairPlayStart: number;
  auditCurrentFairPlay: (structuralAuditResult?: StructuralAuditResult) => Promise<FairPlayAuditResult>;
}

export interface Agent6State {
  fairPlayAudit: FairPlayAuditResult | null;
  fairPlayAuditCostDuringLoop: number;
  emittedFinalCriticalFailureSummary: boolean;
  agent6RetryInvoked: boolean;
  firstFairPlayStatus: "pass" | "fail" | "needs-revision" | null;
  agent6FailureClass: string;
}
