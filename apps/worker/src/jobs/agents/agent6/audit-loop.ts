/**
 * Agent 6 phases: the pre-LLM deterministic fixes, the fair-play audit,
 * and the failure handling after it. Moved from agent6-run.ts (code review A6-01 / CR-25).
 */
import type { StructuralAuditResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  Agent6Run,
  Agent6State,
} from "./run-state.js";
import {
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

/**
 * The one fair-play audit. Owner decision A6-Q01 (2026-10-02): the re-audit + clue-regeneration loop ran only
 * under AGENT_PRE9_ENABLE_LLM_RETRIES (max_fair_play_attempts; 1 otherwise) — 0 of 70 archived runs — and is
 * retired; this is the single pass the default path always made.
 */
export async function runFairPlayAudit(run: Agent6Run, state: Agent6State, preAuditStructuralResult: StructuralAuditResult | undefined) {
  state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
  state.firstFairPlayStatus = state.fairPlayAudit.overallStatus;
  state.fairPlayAuditCostDuringLoop = state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — track latest, don't sum
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
