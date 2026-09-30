/**
 * Agent 5 phases: the first extraction, the repair after the first guardrail pass, and the inference-coverage
 * retry. Moved from agent5-run.ts (code review A5-01 / CR-25), which re-exports what it exported.
 */
import { SOURCE_PATH_RETRY_TEMPLATES } from "@cml/cml";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
  applyClueGuardrails,
  type InferenceCoverageResult,
} from "../shared.js";
import {
  Agent5Run,
  Agent5State,
} from "./run-state.js";

/**
 * A_71 (A_70 §6) — the misdirection budget, named once.
 *
 * `2` was hard-coded at four separate `extractWithAttempt` call sites, which is how the value could
 * be honoured as a ceiling everywhere and as a floor nowhere. `RED_HERRING_FLOOR` is the point below
 * which the mystery has no misdirection at all and a bounded regeneration is worth a call; a
 * shortfall of 1-against-2 is logged, not retried.
 */
export const RED_HERRING_BUDGET = 2;

export async function extractInitialClues(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State) {
  let clues!: ClueDistributionResult;
  const cluesInputBase = {
    cml: ctx.cml!,
    clueDensity: run.clueDensity,
    redHerringBudget: RED_HERRING_BUDGET,
    fairPlayFeedback: run.mergeStrictPromptFeedback(run.proactiveFirstPassFeedback),
    // A_65b Ph6 — the strict structural contract, FIRST-PASS. The merge above carries it only
    // into the retry-mode prompt block (which renders only when violations/warnings exist — a
    // condition the first pass never meets, verified on the probe: 0 strict lines in its one
    // Agent-5 request). This channel renders unconditionally, so the LLM AUTHORS the required
    // ids / direct-culprit clue / late slot in scene register and the deterministic synthesis
    // (5/5 runs in the warning corpus) becomes the rare counted floor.
    strictContract: run.strictPromptFeedbackBase
      ? {
        strictSourcePaths: run.strictPromptFeedbackBase.strictSourcePaths,
        requiredIdToSourceMappings: run.strictPromptFeedbackBase.requiredIdToSourceMappings,
        requiredStepCoverageFloors: run.strictPromptFeedbackBase.requiredStepCoverageFloors,
        requiredLateClueSlot: run.strictPromptFeedbackBase.requiredLateClueSlot,
        requiredDirectCulpritClue: run.strictPromptFeedbackBase.requiredDirectCulpritClue,
      }
      : undefined,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
    // Pillar 1: pass locked facts so clue descriptions honour canonical values
    ...(ctx.inputs.enableLockedFactRegistry && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0
      ? { lockedFacts: ctx.lockedFactRegistry }
      : {}),
  };
  try {
    clues = await run.extractWithAttempt(cluesInputBase);
  } catch (err) {
    const retryableExtractionFailure = err instanceof SyntaxError
      || err instanceof TypeError
      || /json|parse|unexpected token|structured output/i.test(String((err as Error)?.message ?? ""));
    if (retryableExtractionFailure && run.llmRetriesEnabled) {
      state.agent5RetryInvoked = true;
      ctx.warnings.push("Agent 5: first extraction attempt failed due to malformed model payload; retrying once");
      clues = await run.extractWithAttempt(cluesInputBase);
    } else if (retryableExtractionFailure) {
      ctx.errors.push("Agent 5 first extraction attempt failed due to malformed model payload (deterministic mode: no LLM retry)");
      run.failAgent5("Agent 5 extraction failed on malformed model payload in deterministic mode");
    } else {
      throw err;
    }
  }

  ctx.agentCosts["agent5_clues"] =
    clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
  ctx.agentDurations["agent5_clues"] = Date.now() - run.cluesStart;
  return clues;
}

export async function repairAfterFirstGuardrailPass(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult, clueGuardrails: { issues: ClueGuardrailIssue[]; fixes: string[]; hasCriticalIssues: boolean; }, sourcePathSnapshot: { invalidPaths: string[]; issues: ClueGuardrailIssue[]; }) {
  if (clueGuardrails.hasCriticalIssues || sourcePathSnapshot.invalidPaths.length > 0) {
    if (clueGuardrails.hasCriticalIssues) {
      ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
    }
    if (sourcePathSnapshot.invalidPaths.length > 0) {
      ctx.warnings.push("Agent 5: sourceInCML legality violations detected; regenerating clues with path constraints");
    }
    clueGuardrails.issues.forEach((issue) => ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`)
    );
    sourcePathSnapshot.invalidPaths.forEach((path) => ctx.warnings.push(`  - [critical] source path legality: invalid sourceInCML path=${path}`)
    );

    const legalSourceTemplates = SOURCE_PATH_RETRY_TEMPLATES; // CR-16 (A5-02): from the one source-path table

    if (run.llmRetriesEnabled) {
      const retryCluesStart = Date.now();
      state.agent5RetryInvoked = true;
      clues = await run.extractWithAttempt({
        cml: ctx.cml!,
        clueDensity: run.clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: run.mergeStrictPromptFeedback({
          overallStatus: "fail",
          violations: [
            ...clueGuardrails.issues
              .filter((i) => i.severity === "critical")
              .map((i) => ({
                severity: "critical" as const,
                rule: "Deterministic Guardrail",
                description: i.message,
                suggestion: "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
              })),
            ...sourcePathSnapshot.invalidPaths.map((path) => ({
              severity: "critical" as const,
              rule: "Source Path Legality",
              description: `Invalid source path: ${path}`,
              suggestion: `Replace with a legal path template such as ${legalSourceTemplates[0]} or ${legalSourceTemplates[3]}`,
            })),
          ],
          warnings: clueGuardrails.issues
            .filter((i) => i.severity !== "critical")
            .map((i) => i.message),
          recommendations: [
            "Move essential clues to early/mid placement",
            "Avoid private/detective-only clue phrasing",
            "Ensure clue IDs are unique and timeline is balanced",
            ...sourcePathSnapshot.invalidPaths.map(
              (path) => `Repair path exactly: ${path} -> use one of [${legalSourceTemplates.join(" | ")}]`
            ),
          ],
        }, true),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

      // Guard: if LLM returned status=fail with empty clues on retry, fail with a clear message
      // rather than propagating 0-count clues into the guardrail which produces misleading errors.
      if (clues.clues.length === 0) {
        ctx.errors.push("Agent 5 retry returned zero clues (LLM self-reported failure on source-path retry)");
        run.failAgent5("Clue generation failed: LLM returned empty clues on source-path retry");
      }

      const secondGuardrailPass = applyClueGuardrails(ctx.cml!, clues);
      secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
      if (secondGuardrailPass.hasCriticalIssues) {
        secondGuardrailPass.issues.forEach((i) => ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`)
        );
        run.failAgent5("Clue generation failed deterministic fair-play guardrails");
      }
      clueGuardrails = secondGuardrailPass;
    } else {
      ctx.warnings.push("Agent 5: skipping LLM regeneration for guardrail/source-path issues; continuing with deterministic backstops");
    }
  }
  return { clueGuardrails, clues };
}

export async function retryForInferenceCoverage(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult, coverageResult: InferenceCoverageResult, falseAssumptionIssues: ClueGuardrailIssue[], discrimTestIssues: ClueGuardrailIssue[], allCoverageIssues: ClueGuardrailIssue[]) {
  if (coverageResult.hasCriticalGaps ||
    falseAssumptionIssues.some((i) => i.severity === "critical") ||
    discrimTestIssues.some((i) => i.severity === "critical")) {
    if (run.llmRetriesEnabled) {
      state.performedCoverageRetry = true;
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
            suggestion: "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
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
      state.agent5RetryInvoked = true;
      clues = await run.extractWithAttempt({
        cml: ctx.cml!,
        clueDensity: run.clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: run.mergeStrictPromptFeedback(coverageFeedback),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent5_clues"] =
        clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);

      const postCoverageGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postCoverageGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Post-coverage guardrail auto-fix: ${fix}`)
      );
    } else {
      ctx.warnings.push("Inference coverage gate: critical gaps detected; skipping LLM retry and relying on deterministic step/evidence backstops");
    }
  }
  return clues;
}
