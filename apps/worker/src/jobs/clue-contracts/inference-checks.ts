/**
 * Agent 5 clue contracts — inference-path coverage, step bounds, contradiction pairs, the false assumption and
 * discriminating-test reachability. Split from agent5-contracts.ts (code review A5-05), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type ClueGuardrailIssue,
  type InferenceCoverageResult,
} from "../agents/shared.js";
import {
  getCaseBlock,
} from "./source-paths.js";
import {
  findRedHerringTrueSolutionOverlap,
} from "./red-herrings.js";

export const CANONICAL_CLUE_ID_RE = /^clue_[a-z0-9_-]+$/i;

export const getCanonicalEvidenceClueIds = (cml: CaseData): string[] => {
  const caseBlock = getCaseBlock(cml);
  const rawEvidence = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues
    : [];
  return rawEvidence
    .map((id: unknown) => String(id ?? "").trim())
    .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id));
};

export const checkInferenceStepBounds = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = getCaseBlock(cml);
  const stepCount = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps.length
    : 0;
  if (stepCount === 0) return issues;

  for (const clue of clues.clues as any[]) {
    const step = Number(clue?.supportsInferenceStep);
    if (!Number.isFinite(step) || step === 0) continue;
    if (step < 1 || step > stepCount) {
      issues.push({
        severity: "critical",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} uses supportsInferenceStep=${step} but valid range is 1..${stepCount}`,
      });
    }
  }

  return issues;
};

export function checkInferencePathCoverage(
  cml: CaseData,
  clues: ClueDistributionResult
): InferenceCoverageResult {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({ severity: "critical", message: "No inference_path steps found in CML" });
    return { issues, coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: true };
  }

  const coverageMap = new Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>();
  for (let i = 0; i < steps.length; i++) {
    coverageMap.set(i + 1, { observation: false, contradiction: false, elimination: false });
  }

  for (const clue of clues.clues) {
    const stepNum = (clue as any).supportsInferenceStep;
    if (stepNum && coverageMap.has(stepNum)) {
      const coverage = coverageMap.get(stepNum)!;
      const evidenceType = (clue as any).evidenceType || "observation";
      if (evidenceType in coverage) (coverage as any)[evidenceType] = true;
    }
  }

  // Fuzzy matching fallback
  for (const clue of clues.clues) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNum = i + 1;
      const coverage = coverageMap.get(stepNum)!;
      const clueText = (String(clue.description ?? "") + " " + String((clue as any).sourceInCML ?? "")).toLowerCase();
      const obsText = (typeof step.observation === "string" ? step.observation : "").toLowerCase();
      const obsWords = obsText.split(/\s+/).filter((w: string) => w.length > 4);
      // A_53 P5 (a5-fuzzy-coverage-04-threshold-and-evidence-key): the fuzzy fallback now requires not
      // just 40% overlap but at least one step-DISTINCTIVE token (length ≥ 7) shared with the clue, so
      // incidental common-word overlap ("evening", "before") can no longer mark a step covered. (The
      // primary path via supportsInferenceStep still covers steps whose words are all short.)
      const obsMatched = obsWords.filter((w: string) => clueText.includes(w));
      if (
        obsWords.length > 0 &&
        obsMatched.length >= Math.ceil(obsWords.length * 0.4) &&
        obsMatched.some((w: string) => w.length >= 7)
      ) {
        coverage.observation = true;
      }
      if (Array.isArray(step.required_evidence)) {
        for (const ev of step.required_evidence) {
          const evWords = String(ev ?? "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          const evMatched = evWords.filter((w: string) => clueText.includes(w));
          if (
            evWords.length > 0 &&
            evMatched.length >= Math.ceil(evWords.length * 0.4) &&
            evMatched.some((w: string) => w.length >= 7)
          ) {
            coverage.observation = true;
          }
        }
      }
    }
  }

  const uncoveredSteps: number[] = [];
  for (const [stepNum, coverage] of coverageMap) {
    if (!coverage.observation) {
      uncoveredSteps.push(stepNum);
      const step = steps[stepNum - 1];
      issues.push({
        severity: "critical",
        message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has NO covering clue`,
      });
    }
    if (!coverage.contradiction) {
      issues.push({ severity: "warning", message: `Inference step ${stepNum} has no contradiction clue` });
    }
  }

  return { issues, coverageMap, uncoveredSteps, hasCriticalGaps: uncoveredSteps.length > 0 };
}

export function checkContradictionPairs(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  for (let i = 0; i < steps.length; i++) {
    const stepNum = i + 1;
    const step = steps[i];
    const stepClues = clues.clues.filter((c: any) => c.supportsInferenceStep === stepNum);
    const evidenceTypes = new Set(stepClues.map((c: any) => c.evidenceType || "observation"));
    if (
      stepClues.length >= 2 &&
      evidenceTypes.has("observation") &&
      (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination"))
    ) continue;
    if (stepClues.length < 2) {
      issues.push({
        severity: "warning",
        message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has only ${stepClues.length} mapped clue(s)`,
      });
    } else if (!evidenceTypes.has("contradiction") && !evidenceTypes.has("elimination")) {
      issues.push({ severity: "warning", message: `Inference step ${stepNum} has clues but no contradiction/elimination evidence` });
    }
  }
  return issues;
}

export function checkFalseAssumptionContradiction(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const falseAssumption = caseBlock?.false_assumption?.statement || "";
  if (!falseAssumption) {
    issues.push({ severity: "critical", message: "No false_assumption.statement in CML" });
    return issues;
  }
  const contradictionClues = clues.clues.filter((c: any) => c.evidenceType === "contradiction");
  if (contradictionClues.length === 0) {
    issues.push({
      severity: "critical",
      message: `No clue with evidenceType="contradiction" found. Reader needs evidence challenging: "${falseAssumption.substring(0, 80)}"`,
    });
  }
  const overlappingRedHerringIds = findRedHerringTrueSolutionOverlap(cml, clues);
  if (overlappingRedHerringIds.length > 0) {
    issues.push({
      severity: "warning",
      message: `${overlappingRedHerringIds.length} red herring(s) may accidentally support the true solution (${overlappingRedHerringIds.join(", ")})`,
    });
  }
  return issues;
}

export function checkDiscriminatingTestReachability(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest?.design) {
    issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
    return issues;
  }

  const evidenceClueIds = getCanonicalEvidenceClueIds(cml);
  if (evidenceClueIds.length > 0) {
    const clueById = new Map(clues.clues.map((c: any) => [String(c.id), c]));
    const missing = evidenceClueIds.filter((id: string) => !clueById.has(id));
    if (missing.length > 0) {
      issues.push({
        severity: "critical",
        message: `Discriminating test evidence_clues reference missing clue id(s): ${missing.join(", ")}`,
      });
    }

    const mappedClues = evidenceClueIds
      .map((id: string) => clueById.get(id))
      .filter(Boolean) as any[];

    if (mappedClues.length === 0) {
      issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
      return issues;
    }

    const lateMapped = mappedClues.filter((c: any) => c.placement !== "early" && c.placement !== "mid");
    if (lateMapped.length > 0) {
      issues.push({
        severity: "critical",
        message: `Discriminating test evidence clue(s) must be early/mid, found non-compliant placement on: ${lateMapped
          .map((c: any) => String(c?.id ?? "(unknown-id)"))
          .join(", ")}`,
      });
    }
    return issues;
  }

  const designText = (discrimTest.design || "").toLowerCase();
  const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
  const combinedTestText = designText + " " + knowledgeText;
  const relevantClues = clues.clues.filter((c: any) => {
    const clueText = `${String(c.description ?? "")} ${String(c.pointsTo ?? "")} ${String(c.sourceInCML ?? "")}`.toLowerCase();
    const testWords = combinedTestText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });
  if (relevantClues.length === 0) {
    issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
  }
  const earlyMidRelevant = relevantClues.filter((c: any) => c.placement === "early" || c.placement === "mid");
  if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
    issues.push({ severity: "critical", message: "All clues related to the discriminating test are in late placement" });
  }
  return issues;
}
