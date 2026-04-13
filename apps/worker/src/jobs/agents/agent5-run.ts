/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */

import { extractClues } from "@cml/prompts-llm";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import type { PhaseScore } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
  type InferenceCoverageResult,
  applyClueGuardrails,
} from "./shared.js";

// ============================================================================
// WP4: Inference Path Coverage Helpers (agent-5 only)
// ============================================================================

function checkInferencePathCoverage(
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
      const matchCount = obsWords.filter((w: string) => clueText.includes(w)).length;
      if (obsWords.length > 0 && matchCount >= Math.ceil(obsWords.length * 0.4)) coverage.observation = true;
      if (Array.isArray(step.required_evidence)) {
        for (const ev of step.required_evidence) {
          const evWords = String(ev ?? "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          const evMatch = evWords.filter((w: string) => clueText.includes(w)).length;
          if (evWords.length > 0 && evMatch >= Math.ceil(evWords.length * 0.4)) coverage.observation = true;
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

function checkContradictionPairs(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
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

function checkFalseAssumptionContradiction(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
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
  const suspiciousRedHerrings = clues.redHerrings.filter((rh: any) => {
    const desc = (String(rh.description ?? "") + " " + String(rh.supportsAssumption ?? "")).toLowerCase();
    return caseBlock?.inference_path?.steps?.some((step: any) => {
      const corrWords = (typeof step.correction === "string" ? step.correction : "")
        .toLowerCase().split(/\s+/).filter((w: string) => w.length > 5);
      return corrWords.some((w: string) => desc.includes(w));
    });
  });
  if (suspiciousRedHerrings.length > 0) {
    issues.push({ severity: "warning", message: `${suspiciousRedHerrings.length} red herring(s) may accidentally support the true solution` });
  }
  return issues;
}

function checkDiscriminatingTestReachability(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest?.design) {
    issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
    return issues;
  }
  const designText = (discrimTest.design || "").toLowerCase();
  const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
  const combinedTestText = designText + " " + knowledgeText;
  const relevantClues = clues.clues.filter((c: any) => {
    const clueText = c.description.toLowerCase();
    const testWords = combinedTestText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });
  if (relevantClues.length === 0) {
    issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
  }
  const earlyMidRelevant = relevantClues.filter((c: any) => c.placement === "early" || c.placement === "mid");
  if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
    issues.push({ severity: "warning", message: "All clues related to the discriminating test are in late placement" });
  }
  return issues;
}

function checkSuspectElimination(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const castArr = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = caseBlock?.culpability?.culprits ?? [];
  const suspects = castArr.filter((c: any) => c.culprit_eligibility === "eligible" && !culprits.includes(c.name));
  if (suspects.length === 0) return issues;
  const allClueText = clues.clues.map((c: any) => c.description.toLowerCase()).join(" ");
  const uneliminable = suspects.filter((suspect: any) => {
    const nameWords = (suspect.name || "").toLowerCase().split(/\s+/);
    return !nameWords.some((w: string) => w.length > 2 && allClueText.includes(w));
  });
  if (uneliminable.length > 0) {
    issues.push({
      severity: "warning",
      message: `${uneliminable.length} suspect(s) (${uneliminable.map((s: any) => s.name).join(", ")}) are never referenced in any clue`,
    });
  }
  return issues;
}

// ============================================================================
// runAgent5
// ============================================================================

export async function runAgent5(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("clues", "Extracting and organizing clues...", 50);

  const clueDensity: "minimal" | "moderate" | "dense" =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  const cluesStart = Date.now();
  let clues: Awaited<ReturnType<typeof extractClues>>;
  const cluesInputBase = {
    cml: ctx.cml!,
    clueDensity,
    redHerringBudget: 2,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  };
  try {
    clues = await extractClues(ctx.client, cluesInputBase);
  } catch (err) {
    if (err instanceof SyntaxError) {
      ctx.warnings.push("Agent 5: JSON parse failure on first attempt; retrying");
      clues = await extractClues(ctx.client, cluesInputBase);
    } else {
      throw err;
    }
  }

  ctx.agentCosts["agent5_clues"] = clues.cost;
  ctx.agentDurations["agent5_clues"] = Date.now() - cluesStart;

  ctx.reportProgress("clues", `${clues.clues.length} clues distributed`, 62);

  // ── First guardrail pass ───────────────────────────────────────────────────
  let clueGuardrails = applyClueGuardrails(ctx.cml!, clues);
  clueGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));

  if (clueGuardrails.hasCriticalIssues) {
    ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
    clueGuardrails.issues.forEach((issue) =>
      ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`)
    );

    const retryCluesStart = Date.now();
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: {
        overallStatus: "fail",
        violations: clueGuardrails.issues
          .filter((i) => i.severity === "critical")
          .map((i) => ({
            severity: "critical" as const,
            rule: "Deterministic Guardrail",
            description: i.message,
            suggestion:
              "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
          })),
        warnings: clueGuardrails.issues
          .filter((i) => i.severity !== "critical")
          .map((i) => i.message),
        recommendations: [
          "Move essential clues to early/mid placement",
          "Avoid private/detective-only clue phrasing",
          "Ensure clue IDs are unique and timeline is balanced",
        ],
      },
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] = clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

    const secondGuardrailPass = applyClueGuardrails(ctx.cml!, clues);
    secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
    if (secondGuardrailPass.hasCriticalIssues) {
      secondGuardrailPass.issues.forEach((i) =>
        ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`)
      );
      throw new Error("Clue generation failed deterministic fair-play guardrails");
    }
    clueGuardrails = secondGuardrailPass;
  }

  // ── WP4: Inference Path Coverage Gate ─────────────────────────────────────
  const coverageResult = checkInferencePathCoverage(ctx.cml!, clues);
  // Hoist suspect-elimination check so FIX-J can reuse results without a second call.
  const initialSuspectEliminationIssues = checkSuspectElimination(ctx.cml!, clues);
  const allCoverageIssues: ClueGuardrailIssue[] = [
    ...coverageResult.issues,
    ...checkContradictionPairs(ctx.cml!, clues),
    ...checkFalseAssumptionContradiction(ctx.cml!, clues),
    ...checkDiscriminatingTestReachability(ctx.cml!, clues),
    ...initialSuspectEliminationIssues,
  ];

  allCoverageIssues.forEach((issue) =>
    ctx.warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`)
  );

  const falseAssumptionIssues = checkFalseAssumptionContradiction(ctx.cml!, clues);
  const discrimTestIssues = checkDiscriminatingTestReachability(ctx.cml!, clues);

  if (
    coverageResult.hasCriticalGaps ||
    falseAssumptionIssues.some((i) => i.severity === "critical") ||
    discrimTestIssues.some((i) => i.severity === "critical")
  ) {
    ctx.warnings.push(
      "Inference coverage gate: critical gaps found; regenerating clues with coverage feedback"
    );

    const coverageFeedback = {
      overallStatus: "fail" as const,
      violations: allCoverageIssues
        .filter((i) => i.severity === "critical")
        .map((i) => ({
          severity: "critical" as const,
          rule: "Inference Path Coverage",
          description: i.message,
          suggestion:
            "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
        })),
      warnings: allCoverageIssues.filter((i) => i.severity === "warning").map((i) => i.message),
      recommendations: [
        "Every inference step needs at least one observation clue and one contradiction clue",
        "Set supportsInferenceStep on every essential clue",
        "Include at least one clue that explicitly contradicts the false assumption",
        `Uncovered steps: ${coverageResult.uncoveredSteps.join(", ")}`,
      ],
    };

    ctx.reportProgress("clues", "Regenerating clues to address coverage gaps...", 58);
    const coverageRetryStart = Date.now();
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: coverageFeedback,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);

    const postCoverageGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postCoverageGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-coverage guardrail auto-fix: ${fix}`)
    );
  }

  // ── FIX-J: Per-suspect clue coverage gate ─────────────────────────────────
  // Every eligible non-culprit suspect must have at least one clue referencing
  // them by name. If the coverage retry didn't address this, regenerate with
  // targeted suspect-coverage feedback before committing to ctx.clues.
  const suspectEliminationIssues = initialSuspectEliminationIssues;
  const uncoveredSuspects = suspectEliminationIssues.filter((i) => i.severity === "warning");
  if (uncoveredSuspects.length > 0) {
    ctx.warnings.push(
      `Agent 5: ${uncoveredSuspects.length} suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`,
    );
    uncoveredSuspects.forEach((i) => ctx.warnings.push(`  - ${i.message}`));

    const suspectRetryStart = Date.now();
    const suspectCoverageFeedback = {
      overallStatus: "fail" as const,
      violations: uncoveredSuspects.map((i) => ({
        severity: "critical" as const,
        rule: "Suspect Clue Coverage",
        description: i.message,
        suggestion:
          "Add at least one clue that names this suspect or references them as an alibi/elimination subject so the reader can logically rule them out.",
      })),
      warnings: [],
      recommendations: [
        "Every eligible non-culprit suspect must appear in at least one clue",
        "Clues can reference a suspect via their alibi, observed behaviour, or elimination evidence",
        "Adding elimination clues for uncovered suspects does not require extra inference steps",
      ],
    };
    ctx.reportProgress("clues", "Regenerating clues to address suspect coverage gaps...", 60);
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: suspectCoverageFeedback,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - suspectRetryStart);

    const postSuspectGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postSuspectGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-suspect-coverage guardrail auto-fix: ${fix}`)
    );

    // Re-check; if suspects are still uncovered after retry, log a warning only
    // (do not hard-fail — the story can still be generated, just with a gap).
    const postRetrySuspectIssues = checkSuspectElimination(ctx.cml!, clues);
    postRetrySuspectIssues
      .filter((i) => i.severity === "warning")
      .forEach((i) => ctx.warnings.push(`Agent 5: Post-retry suspect gap: ${i.message}`));
  }

  ctx.clues = clues;
  ctx.coverageResult = coverageResult;
  ctx.allCoverageIssues = allCoverageIssues;

  // ── Phase score ────────────────────────────────────────────────────────────
  if (ctx.enableScoring && ctx.scoreAggregator) {
    const guardrailTriggered = clueGuardrails.hasCriticalIssues;
    const coverageGapsFound = coverageResult.hasCriticalGaps;
    const clueCount = clues.clues.length;
    const clueCountScore = clueCount >= 8 ? 100 : Math.round((clueCount / 8) * 100);
    const guardrailScore = guardrailTriggered ? 75 : 100;
    const coverageScore = coverageGapsFound ? 75 : 100;
    const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
    const clueTotal = Math.round(clueValidation * 0.5 + clueCountScore * 0.3 + 100 * 0.2);
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: clueValidation,
        quality_score: 100,
        completeness_score: clueCountScore,
        consistency_score: 100,
        total: clueTotal,
        grade: (clueTotal >= 90 ? "A" : clueTotal >= 80 ? "B" : clueTotal >= 70 ? "C" : clueTotal >= 60 ? "D" : "F") as PhaseScore["grade"],
        passed: clueTotal >= 75,
        tests: [
          {
            name: "Clue count",
            category: "completeness" as const,
            passed: clueCount >= 8,
            score: clueCountScore,
            weight: 1.5,
            message: `${clueCount} clues distributed`,
          },
          {
            name: "Guardrail compliance",
            category: "validation" as const,
            passed: !guardrailTriggered,
            score: guardrailScore,
            weight: 2,
            message: guardrailTriggered
              ? `Guardrail issues detected and auto-fixed (${clueGuardrails.fixes.length} fix(es))`
              : "All guardrails passed",
          },
          {
            name: "Inference coverage",
            category: "validation" as const,
            passed: !coverageGapsFound,
            score: coverageScore,
            weight: 2,
            message: coverageGapsFound
              ? `Coverage gaps found and addressed (${allCoverageIssues.length} issue(s))`
              : `Full inference coverage (${allCoverageIssues.length} minor issues)`,
          },
        ],
      },
      ctx.agentDurations["agent5_clues"] ?? 0,
      ctx.agentCosts["agent5_clues"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }
}
