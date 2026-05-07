import type { FairPlayAuditResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import type { InferenceCoverageResult } from "./shared.js";

export type FairPlayFailureClass =
  | "clue_coverage"
  | "inference_path_abstract"
  | "constraint_space_insufficient"
  | "clue_only";

const STRUCTURAL_ESCALATION_RULES = new Set([
  "information parity",
  "logical deducibility",
  "no withholding",
  "solution uniqueness",
  "discriminating test timing",
]);

function buildCriticalRuleSet(fairPlayAudit: FairPlayAuditResult | null): Set<string> {
  return new Set(
    (fairPlayAudit?.violations ?? [])
      .filter((violation) => violation.severity === "critical")
      .map((violation) => String(violation.rule ?? "").toLowerCase().trim())
      .filter(Boolean),
  );
}

function hasAbstractInferencePath(cml: CaseData, criticalRules: Set<string>): boolean {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  if (steps.length === 0) {
    return false;
  }

  const abstractSteps = steps.filter((step: any) => {
    const observation = String(step?.observation ?? "").trim();
    const hasEvidence = Array.isArray(step?.required_evidence) && step.required_evidence.length > 0;
    return observation.length < 30 || !hasEvidence;
  }).length;

  const abstractMajority = abstractSteps >= Math.ceil(steps.length * 0.5);

  if (
    criticalRules.has("discriminating test timing")
    && (criticalRules.has("information parity") || criticalRules.has("no withholding"))
  ) {
    return true;
  }

  if (
    (criticalRules.has("logical deducibility") || criticalRules.has("no withholding"))
    && abstractMajority
  ) {
    return true;
  }

  return abstractMajority;
}

function hasInsufficientConstraintSpace(cml: CaseData): boolean {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const constraintSpace = caseBlock?.constraint_space ?? {};
  const totalConstraints = [
    ...(Array.isArray(constraintSpace?.time?.contradictions) ? constraintSpace.time.contradictions : []),
    ...(Array.isArray(constraintSpace?.time?.anchors) ? constraintSpace.time.anchors : []),
    ...(Array.isArray(constraintSpace?.access?.actors) ? constraintSpace.access.actors : []),
    ...(Array.isArray(constraintSpace?.physical?.traces) ? constraintSpace.physical.traces : []),
  ].length;

  return totalConstraints < 4;
}

export function hasStructuralCriticalFairPlayRule(fairPlayAudit: FairPlayAuditResult | null): boolean {
  const criticalRules = buildCriticalRuleSet(fairPlayAudit);
  for (const rule of STRUCTURAL_ESCALATION_RULES) {
    if (criticalRules.has(rule)) {
      return true;
    }
  }
  return false;
}

export function classifyFairPlayFailure(
  coverageResult: InferenceCoverageResult | null | undefined,
  fairPlayAudit: FairPlayAuditResult | null,
  cml: CaseData,
): FairPlayFailureClass {
  const criticalRules = buildCriticalRuleSet(fairPlayAudit);

  if (hasAbstractInferencePath(cml, criticalRules)) {
    return "inference_path_abstract";
  }

  if (hasInsufficientConstraintSpace(cml)) {
    return "constraint_space_insufficient";
  }

  if (
    coverageResult?.hasCriticalGaps
    || criticalRules.has("clue visibility")
    || criticalRules.has("logical deducibility")
  ) {
    return "clue_coverage";
  }

  return "clue_only";
}

export function shouldEscalateStructuralCmlRevision(params: {
  failureClass: FairPlayFailureClass;
  fairPlayAudit: FairPlayAuditResult | null;
}): boolean {
  if (
    params.failureClass === "inference_path_abstract"
    || params.failureClass === "constraint_space_insufficient"
    || params.failureClass === "clue_coverage"
  ) {
    return true;
  }

  return hasStructuralCriticalFairPlayRule(params.fairPlayAudit);
}
