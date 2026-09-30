/**
 * Agent 6 phases: the pre-LLM deterministic fixes, the fair-play audit loop (re-audit and clue regeneration),
 * and the failure handling after it. Moved from agent6-run.ts (code review A6-01 / CR-25).
 */
import {
  extractClues,
} from "@cml/prompts-llm";
import type { StructuralAuditResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  Agent6Run,
  Agent6State,
} from "./run-state.js";
import {
  applyAgent5ContractsToRegeneratedClues,
  buildFairPlayFeedbackPayload,
  ensureCriticalFairPlayBackstopClues,
  ensureParityBridgeClue,
  runDeterministicStructuralAudit,
} from "./retry-contract.js";

export function applyPreAuditFixes(ctx: OrchestratorContext, run: Agent6Run, preAuditStructuralResult: StructuralAuditResult | undefined) {
  if (ctx.cml && ctx.clues) {
    // Step A: parity bridge (already present, moved here explicitly)
    const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
    if (parityBridgeId) {
      run.emitAgent6Warning(
        `Agent 6 deterministic parity bridge: injected essential clue ${parityBridgeId} to expose discriminating-test mechanism before the test scene.`,
        "transient-diagnostic"
      );
    }

    // Step B: backstop clues (moved from post-fail block to pre-LLM)
    const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
    for (const repair of backstopRepairs) {
      run.emitAgent6Warning(
        `Agent 6 pre-LLM backstop: ${repair}`,
        "transient-diagnostic"
      );
    }
    if (backstopRepairs.length > 0) {
      // Re-run parity bridge after backstop injection
      const secondBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
      if (secondBridgeId) {
        run.emitAgent6Warning(
          `Agent 6 deterministic parity bridge (post-backstop): injected ${secondBridgeId}.`,
          "transient-diagnostic"
        );
      }
    }

    // Step C: deterministic structural audit — result injected into every LLM call
    preAuditStructuralResult = runDeterministicStructuralAudit(ctx.cml, ctx.clues);
    if (preAuditStructuralResult.passed) {
      run.emitAgent6Warning(
        `Agent 6 structural pre-audit: PASS — all ${preAuditStructuralResult.stepsCovered.length} inference step(s) covered, ` +
        `${preAuditStructuralResult.evidenceCluesPresent.length} evidence clue(s) verified in early|mid. ` +
        `LLM will assess narrative quality only.`,
        "transient-diagnostic"
      );
    } else {
      const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
      run.emitAgent6Warning(
        `Agent 6 structural pre-audit: GAPS REMAIN after backstop fixes: ${gapSummary}`,
        "persistent-risk"
      );
    }
  }
  return preAuditStructuralResult;
}

export async function runFairPlayAuditLoop(ctx: OrchestratorContext, run: Agent6Run, state: Agent6State, preAuditStructuralResult: StructuralAuditResult | undefined) {
  while (state.fairPlayAttempt < run.maxFairPlayAttempts) {
    state.fairPlayAttempt++;
    state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
    if (state.firstFairPlayStatus === null) {
      state.firstFairPlayStatus = state.fairPlayAudit.overallStatus;
    }
    state.fairPlayAuditCostDuringLoop = state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — track latest, don't sum

    if (state.fairPlayAttempt > 1) {
      run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", state.fairPlayAudit.cost), `fair-play re-audit attempt ${state.fairPlayAttempt}`);
    }

    if (state.fairPlayAudit.overallStatus === "pass") break;

    if (state.fairPlayAttempt < run.maxFairPlayAttempts) {
      state.agent6RetryInvoked = true;
      run.emitAgent6Warning(
        `Agent 6: Fair play audit ${state.fairPlayAudit.overallStatus}; regenerating clues to address feedback (attempt ${state.fairPlayAttempt + 1} of ${run.maxFairPlayAttempts})`,
        "transient-progress"
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback...", 60);
      const retryCluesStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity: run.clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(state.fairPlayAudit, ctx.cml, ctx.clues),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      applyAgent5ContractsToRegeneratedClues(ctx, "fair-play retry");
      run.retryBudget.consume(run.perCallCostDelta("Agent5-Clues", ctx.clues.cost), `fair-play clue regeneration attempt ${state.fairPlayAttempt + 1}`);

      ctx.agentCosts["agent5_clues"] =
        ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
    }
  }
}

export function handleFairPlayFailure(run: Agent6Run, state: Agent6State, hasCriticalFairPlayFailure: boolean) {
  if (!state.fairPlayAudit) throw new Error("Fair play audit failed to produce a report"); // the caller checked; restores the narrowing
  if (state.fairPlayAudit.overallStatus === "fail") {
    if (hasCriticalFairPlayFailure) {
      run.emitAgent6Warning(
        "Agent 6: Fair play audit failed on critical rules after clue regeneration; continuing with warnings",
        "transient-diagnostic"
      );
      state.fairPlayAudit.violations.forEach((v) => run.emitAgent6Warning(`  - [${v.severity}] ${v.rule}: ${v.description}`, "transient-diagnostic")
      );
    } else {
      run.emitAgent6Warning("Agent 6: Fair play audit FAILED after clue regeneration", "transient-diagnostic");
      state.fairPlayAudit.violations.forEach((v) => run.emitAgent6Warning(`  - [${v.severity}] ${v.description}`, "transient-diagnostic")
      );
    }
  } else if (state.fairPlayAudit.overallStatus === "needs-revision") {
    if (hasCriticalFairPlayFailure) {
      run.emitAgent6Warning(
        "Agent 6: Fair play needs revision with critical issues; continuing with warnings",
        "transient-diagnostic"
      );
      state.fairPlayAudit.violations.forEach((v) => run.emitAgent6Warning(`  - [${v.severity}] ${v.rule}: ${v.description}`, "transient-diagnostic")
      );
    } else {
      run.emitAgent6Warning("Agent 6: Fair play needs minor revisions after clue regeneration", "transient-diagnostic");
    }
    state.fairPlayAudit.warnings.forEach((w) => run.emitAgent6Warning(`  - ${w}`, "transient-diagnostic"));
  }
}
