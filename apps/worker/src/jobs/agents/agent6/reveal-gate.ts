/**
 * Agent 6 phase: the reveal gate (T2.1 fooled-then-convinced, T2.2 held-out). Moved from agent6-run.ts
 * (code review A6-01 / CR-25).
 */
import {
  blindReaderSimulation,
} from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  parseRevealGateMode,
  auditRedHerringTargets,
  auditDeathMethodDeducibility,
  evaluateRevealVerdict,
} from "../agent6-reveal-gate.js";
import {
  Agent6Run,
  Agent6State,
} from "./run-state.js";

export async function runRevealGate(ctx: OrchestratorContext, run: Agent6Run, state: Agent6State, castNamesForBlind: any, actualCulpritName: any, falseAssumptionStatement: any, caseBlockForBlind: any) {
  const revealGateMode = parseRevealGateMode(process.env.AGENT6_REVEAL_GATE);
  if (revealGateMode !== "off") {
    const revealIssues: string[] = [];

    // T2.2 — a red herring must never point at the real culprit.
    const herringAudit = auditRedHerringTargets(ctx.cml);
    if (!herringAudit.ok) {
      revealIssues.push(
        `red herring(s) point at the real culprit: ` +
        herringAudit.offenders.map((o) => `${o.id}→"${o.pointsAtSuspect}"`).join(", ")
      );
    }

    // T2.3 — the manner of death must be deducible from an essential early|mid clue.
    const deathAudit = auditDeathMethodDeducibility(ctx.cml, ctx.clues ?? { clues: [] });
    if (!deathAudit.ok) revealIssues.push(deathAudit.reason);

    // T2.1 — an early+mid-only reader who already names the culprit means the reveal is too obvious.
    if (castNamesForBlind.length > 0 && actualCulpritName) {
      try {
        const earlyMidReader = await blindReaderSimulation(
          ctx.client,
          ctx.clues!,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "", placementFilter: ["early", "mid"], caseCast: caseBlockForBlind?.cast }
        );
        // cost from byAgent is cumulative across the run → overwrite; durationMs is per-call → add.
        ctx.agentCosts["agent6_blind_reader"] = earlyMidReader.cost;
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + earlyMidReader.durationMs;
        const verdict = evaluateRevealVerdict({
          earlyMidGuess: earlyMidReader.suspectedCulprit,
          culprit: actualCulpritName,
          falseSolutionSuspect: caseBlockForBlind?.false_solution?.accused_suspect,
          castNames: castNamesForBlind, // A6-D07: surname matches need the cast (used only with CML_VERIFIED_FIXES on)
        });
        if (verdict.verdict === "too_obvious") revealIssues.push(...verdict.reasons);
        else verdict.reasons.forEach((r) => run.emitAgent6Warning(`[agent6-reveal-gate][${revealGateMode}] ${r}`, "transient-diagnostic"));
      } catch (err) {
        run.emitAgent6Warning(
          `[agent6-reveal-gate][${revealGateMode}] early+mid blind reader error: ${(err as Error).message}`,
          "transient-diagnostic"
        );
      }
    }

    for (const issue of revealIssues) {
      run.emitAgent6Warning(`[agent6-reveal-gate][${revealGateMode}] ${issue}`, "persistent-risk");
    }
    if (revealGateMode === "enforce" && revealIssues.length > 0) {
      // A_53 P5 (reveal-gate-enforce-only-downgrades-pass-not-fail): in ENFORCE mode a real reveal
      // break must block regardless of prior status OR enableBindingGates — otherwise "enforce" was
      // only a warning whenever binding gates were off. Flip pass→needs-revision AND set a dedicated
      // blocking flag (enforce is an explicit opt-in; default-off/shadow stay advisory; still no throw).
      if (state.fairPlayAudit!.overallStatus === "pass") state.fairPlayAudit!.overallStatus = "needs-revision";
      ctx.fairPlayAudit = { ...state.fairPlayAudit!, blocking: true };
    }
  }
}
