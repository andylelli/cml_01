/**
 * Agent 6 phase: the CML revision retry on a structural fair-play failure (WP6B + WP8). Moved from
 * agent6-run.ts (code review A6-01 / CR-25).
 */
import {
  extractClues,
  buildCMLPrompt,
  reviseCml,
} from "@cml/prompts-llm";
import type { FairPlayAuditResult, StructuralAuditResult } from "@cml/prompts-llm";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  recomputeCoverageSnapshotForAgent6,
} from "../../clue-contracts/contracts.js";
import {
  classifyFairPlayFailure,
  shouldEscalateStructuralCmlRevision,
} from "../agent6-escalation-policy.js";
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

const toStringArray = (value: unknown): string[] =>
  Array.isArray(value)
    ? value.map((item) => String(item ?? "").trim()).filter((item) => item.length > 0)
    : [];

const firstNonEmpty = (...values: Array<unknown>): string => {
  for (const value of values) {
    const text = String(value ?? "").trim();
    if (text.length > 0) return text;
  }
  return "";
};

const normalizeComplexityLevel = (value: unknown): "simple" | "moderate" | "complex" => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "simple" || normalized === "moderate" || normalized === "complex") {
    return normalized;
  }
  return "moderate";
};

const normalizeDifficultyMode = (value: unknown): "standard" | "increase" | "extreme" => {
  const normalized = String(value ?? "").trim().toLowerCase();
  if (normalized === "standard" || normalized === "increase" || normalized === "extreme") {
    return normalized;
  }
  return "standard";
};

export const hasCriticalFairPlayViolations = (
  fairPlayAudit: FairPlayAuditResult,
  criticalFairPlayRules: Set<string>,
): boolean => {
  const violations = Array.isArray(fairPlayAudit?.violations) ? fairPlayAudit.violations : [];
  return violations.some(
    (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
  );
};

export const deriveEffectiveCastNamesForStructuralRevision = (ctx: OrchestratorContext): string[] => {
  const caseBlock = (ctx.cml as any)?.CASE ?? ctx.cml ?? {};
  const cmlCastNames = (Array.isArray(caseBlock?.cast) ? caseBlock.cast : [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
  if (cmlCastNames.length > 0) return cmlCastNames;

  return (ctx.cast?.cast?.characters ?? [])
    .map((c: any) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0);
};

export async function retryCmlOnStructuralFailure(ctx: OrchestratorContext, run: Agent6Run, state: Agent6State, preAuditStructuralResult: StructuralAuditResult | undefined, hasCriticalFairPlayFailure: boolean, MAX_FAIR_PLAY_RETRY_COST: number, criticalFairPlayRules: Set<string>, recordFairPlayScore: () => Promise<void>) {
  const hasRealStructuralGaps = preAuditStructuralResult
    ? !preAuditStructuralResult.passed
    : (state.fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure);

  if (hasRealStructuralGaps) {
    if (!preAuditStructuralResult?.passed && preAuditStructuralResult) {
      // Structural gaps confirmed deterministically — log them
      const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
      run.emitAgent6Warning(
        `Fair-play: structural gaps confirmed by deterministic audit: ${gapSummary}`,
        "transient-diagnostic"
      );
    } else if (state.fairPlayAudit!.overallStatus !== "fail") {
      // LLM passed but we still have structural gaps from pre-audit — this path should be rare
      run.emitAgent6Warning(
        "Fair-play: LLM narrative audit passed but deterministic structural gaps remain — escalating CML revision",
        "persistent-risk"
      );
    }

    if (ctx.cml && ctx.clues) {
      const coverageSnapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
      ctx.coverageResult = coverageSnapshot.coverageResult;
      ctx.allCoverageIssues = coverageSnapshot.allCoverageIssues;
    }
    const failureClass = classifyFairPlayFailure(ctx.coverageResult!, state.fairPlayAudit, ctx.cml!);
    state.agent6FailureClass = failureClass;
    const shouldEscalateCmlRevision = shouldEscalateStructuralCmlRevision({
      failureClass,
      fairPlayAudit: state.fairPlayAudit,
      structuralAuditResult: preAuditStructuralResult,
    });

    const caseBlock = (ctx.cml as any)?.CASE ?? ctx.cml ?? {};
    const cmlMeta = caseBlock?.meta ?? {};
    const cmlSetting = cmlMeta?.setting ?? {};
    const cmlEra = cmlMeta?.era ?? {};
    const effectiveCastNames = deriveEffectiveCastNamesForStructuralRevision(ctx);

    const effectiveDecade = firstNonEmpty(
      ctx.setting?.setting?.era?.decade,
      cmlEra?.decade,
      "1930s"
    );
    const effectiveLocationDescription = firstNonEmpty(
      ctx.setting?.setting?.location?.description,
      cmlSetting?.location,
      ctx.locationSpec?.location,
      "country estate"
    );
    const effectiveInstitution = firstNonEmpty(
      ctx.setting?.setting?.location?.type,
      cmlSetting?.institution,
      ctx.locationSpec?.institution,
      "Estate"
    );
    const effectiveWeather = firstNonEmpty(
      ctx.setting?.setting?.atmosphere?.weather,
      "Overcast"
    );
    const effectiveSocialStructure = firstNonEmpty(
      toStringArray(ctx.setting?.setting?.era?.socialNorms).join(", "),
      "Class tensions shape suspect motives and opportunity."
    );

    const effectiveHardLogicDirectives = ctx.hardLogicDirectives
      || ctx.initialHardLogicDirectives
      || {
      complexityLevel: "medium",
      mechanismFamilies: ["physical-constraint proof"],
      hardLogicModes: ["fair-play chain"],
      difficultyMode: "moderate",
    };

    const effectiveBackgroundContext = ctx.backgroundContext
      || {
      status: "synthetic",
      backdropSummary: "Hydrated upstream context unavailable; preserve existing CML facts and repair structural fair-play weaknesses only.",
      era: {
        decade: effectiveDecade,
        socialStructure: effectiveSocialStructure,
      },
      setting: {
        location: effectiveLocationDescription,
        institution: effectiveInstitution,
        weather: effectiveWeather,
      },
      castAnchors: effectiveCastNames,
      theme: ctx.inputs.theme || "mystery",
    };

    const canRunStructuralCmlRevision = !!ctx.cml
      && effectiveCastNames.length > 0
      && Array.isArray(effectiveHardLogicDirectives.mechanismFamilies)
      && Array.isArray(effectiveHardLogicDirectives.hardLogicModes);

    if (shouldEscalateCmlRevision && !canRunStructuralCmlRevision) {
      run.emitAgent6Warning(
        `Fair play failure classified as "${failureClass}" but structural CML retry was skipped: missing hydrated upstream context (setting/cast/hard logic/background).`,
        "persistent-risk"
      );
    }

    if (run.retriesEnabled &&
      canRunStructuralCmlRevision &&
      shouldEscalateCmlRevision &&
      run.retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST) {
      const hardLogicDevices = ctx.hardLogicDevices ?? { devices: [] };
      state.agent6RetryInvoked = true;

      if (!ctx.setting || !ctx.cast || !ctx.backgroundContext || !ctx.hardLogicDevices) {
        run.emitAgent6Warning(
          "Agent 6 structural retry used synthesized upstream context from hydrated CML because full setting/cast/background artifacts were unavailable.",
          "persistent-risk"
        );
      }

      run.emitAgent6Warning(
        `Fair play failure classified as "${failureClass}" — retrying CML generation (Agent 4) ` +
        "to fix upstream structural problems",
        "transient-progress"
      );

      // Build violation-specific context so Agent 4 knows exactly which mechanism facts to expose
      const revisionViolationContext = (() => {
        const timingRules = new Set(["discriminating test timing", "information parity", "no withholding", "logical deducibility"]);
        const relevantViolations = (state.fairPlayAudit?.violations ?? []).filter(
          (v) => timingRules.has(String(v.rule ?? "").toLowerCase().trim())
        );
        const mechanismDesc = String(caseBlock?.hidden_model?.mechanism?.description ?? "").trim();
        const discrimKnowledge = String(caseBlock?.discriminating_test?.knowledge_revealed ?? "").trim();
        const parts: string[] = [];
        if (mechanismDesc) {
          parts.push(`The specific mechanism that must be reader-visible BEFORE the discriminating test: "${mechanismDesc}".`);
        }
        if (discrimKnowledge) {
          parts.push(`The discriminating test reveals: "${discrimKnowledge}" — this MUST NOT be new information; it must trace back to prior essential clues already established in inference_path steps.`);
        }
        for (const v of relevantViolations) {
          const desc = String(v.description ?? "").trim();
          const sug = String(v.suggestion ?? "").trim();
          if (desc) parts.push(`Audit violation [${v.rule}]: ${desc}`);
          if (sug && sug !== desc) parts.push(`Required fix: ${sug}`);
        }
        return parts.length > 0 ? " SPECIFIC VIOLATIONS TO ADDRESS: " + parts.join(" ") : "";
      })();

      const revisionInstructions = failureClass === "inference_path_abstract"
        ? "The inference_path steps are too abstract. Rewrite each step with: " +
        "(1) a concrete, scene-level observation the reader can witness, " +
        "(2) a correction that follows from stated evidence, " +
        "(3) an effect that names the suspect eliminated, " +
        "(4) required_evidence listing 2-4 specific facts where every item names at least one concrete anchor (person, object, location, time phrase, trace, document, or access record), " +
        "(5) no abstract placeholders like 'timeline discrepancy', 'suspicious behavior', 'an inconsistency', or 'detective intuition' without concrete nouns from the case data, " +
        "(6) each correction must quote or paraphrase at least one required_evidence item and state why it eliminates or narrows a named suspect." +
        revisionViolationContext
        : failureClass === "clue_coverage" || failureClass === "clue_only"
          ? "Fair-play clue coverage remains structurally insufficient. Revise CML so the reader can logically solve the case BEFORE discriminating test: " +
          "(1) inference_path steps must explicitly surface the mechanism fact(s) (no withholding), " +
          "(2) discriminating_test.design must exploit already-exposed evidence rather than introducing new facts, " +
          "(3) discriminating_test.evidence_clues must list 2-3 canonical clue IDs expected to appear as early/mid essential clues, " +
          "(4) at least one step effect must uniquely narrow to culprit via elimination logic." +
          revisionViolationContext
          : "The constraint_space is too sparse. Add: " +
          "(1) at least one temporal contradiction, " +
          "(2) at least 2 access constraints, " +
          "(3) at least 2 physical traces. " +
          "Each constraint must be concrete enough to become a reader-visible clue.";

      ctx.reportProgress("cml", "Revising CML to fix structural fair play issues...", 55);
      const revisionStart = Date.now();

      // A_53 P11 (genre-structure-cml-string-vs-object): ctx.cml is normalised to an object at agent
      // entry, so the prior string/object dual-handling is gone — serialise the object directly.
      const cmlYaml = JSON.stringify(ctx.cml, null, 2);
      const revisionPrompt = buildCMLPrompt({
        decade: effectiveDecade,
        location: effectiveLocationDescription,
        institution: effectiveInstitution,
        tone: ctx.inputs.tone || "Golden Age Mystery",
        weather: effectiveWeather,
        socialStructure: effectiveSocialStructure,
        theme: ctx.inputs.theme || "mystery",
        castSize: effectiveCastNames.length,
        castNames: effectiveCastNames,
        detectiveType: firstNonEmpty(
          ctx.cast?.cast?.crimeDynamics?.detectiveCandidates?.[0],
          "Detective"
        ),
        victimArchetype: firstNonEmpty(
          ctx.cast?.cast?.crimeDynamics?.victimCandidates?.[0],
          "Victim"
        ),
        complexityLevel: normalizeComplexityLevel(effectiveHardLogicDirectives.complexityLevel),
        mechanismFamilies: toStringArray(effectiveHardLogicDirectives.mechanismFamilies),
        primaryAxis: ctx.primaryAxis,
        hardLogicModes: toStringArray(effectiveHardLogicDirectives.hardLogicModes),
        difficultyMode: normalizeDifficultyMode(effectiveHardLogicDirectives.difficultyMode),
        hardLogicDevices: hardLogicDevices.devices,
        backgroundContext: effectiveBackgroundContext,
        noveltyConstraints: ctx.noveltyConstraints,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      const revisedResult = await reviseCml(ctx.client, {
        originalPrompt: {
          system: revisionPrompt.system,
          developer: revisionPrompt.developer || "",
          user: revisionPrompt.user,
        },
        invalidCml: cmlYaml,
        validationErrors: [revisionInstructions],
        attempt: 1,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent4_fairplay_revision"] = revisedResult.cost;
      ctx.agentDurations["agent4_fairplay_revision"] = Date.now() - revisionStart;
      run.retryBudget.consume(run.perCallCostDelta("Agent4-Revision", revisedResult.cost), "structural CML revision");

      const revisedSteps = ((revisedResult.cml as any)?.CASE ?? revisedResult.cml)?.inference_path?.steps ?? [];
      if (revisedSteps.length >= 3) {
        ctx.cml = revisedResult.cml as any;
        ctx.revisedByAgent4FairPlay = true;
        ctx.fairPlayRevisionAttempts = (ctx.fairPlayRevisionAttempts ?? 0) + 1;
        run.emitAgent6Warning("CML revised — re-running clue extraction and fair play audit", "transient-progress");

        let revisionFeedbackAudit: FairPlayAuditResult = state.fairPlayAudit!;
        if (ctx.clues) {
          const feedbackAuditStart = Date.now();
          try {
            const provisionalAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
            ctx.agentCosts["agent6_fairplay"] =
              provisionalAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
            ctx.agentDurations["agent6_fairplay"] =
              (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - feedbackAuditStart);
            run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", provisionalAudit.cost), "post-CML-revision feedback re-audit");
            revisionFeedbackAudit = provisionalAudit;
          } catch (error) {
            run.emitAgent6Warning(
              `Agent 6: could not refresh revised-CML fair-play feedback; using previous audit context (${(error as Error).message})`,
              "persistent-risk"
            );
          }
        }

        const reCluesStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity: run.clueDensity,
          redHerringBudget: 2,
          // Pass revised-CML audit context so clue placement aligns with current structural failures.
          fairPlayFeedback: buildFairPlayFeedbackPayload(revisionFeedbackAudit, ctx.cml, ctx.clues),
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] =
          ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - reCluesStart);
        applyAgent5ContractsToRegeneratedClues(ctx, "post-cml-revision");
        run.retryBudget.consume(run.perCallCostDelta("Agent5-Clues", ctx.clues.cost), "post-CML-revision clue regeneration");

        // Re-run backstops + structural audit on the revised CML + fresh clues
        if (ctx.cml && ctx.clues) {
          const postRevisionBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
          if (postRevisionBridgeId) {
            // A6-15: a deterministic floor firing, so it stays in the report when the audit passes (ADR-0003).
            run.emitAgent6Warning(`Agent 6 post-revision parity bridge: injected ${postRevisionBridgeId}.`, "persistent-risk");
          }
          // A6-D06: this floor's repairs were discarded — a deterministic firing the report never saw (ADR-0010).
          ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues).forEach((repair) =>
            run.emitAgent6Warning(`Agent 6 post-revision fair-play backstop: ${repair}`, "persistent-risk"),
          );
          preAuditStructuralResult = runDeterministicStructuralAudit(ctx.cml, ctx.clues);
          if (preAuditStructuralResult.passed) {
            run.emitAgent6Warning(
              "Agent 6 post-revision structural audit: PASS — LLM will assess narrative quality only.",
              "transient-diagnostic"
            );
          } else {
            const gapSummary = preAuditStructuralResult.gaps.map((g) => g.description).join("; ");
            run.emitAgent6Warning(
              `Agent 6 post-revision structural audit: gaps remain: ${gapSummary}`,
              "persistent-risk"
            );
          }
        }

        const reAuditStart = Date.now();
        state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - reAuditStart);
        run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", state.fairPlayAudit.cost), "post-CML-revision fair-play re-audit");
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(state.fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();
      }
    } else if (run.retriesEnabled &&
      failureClass === "clue_only" &&
      run.retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST &&
      run.maxTargetedRegenAttempts >= 3) {
      state.agent6RetryInvoked = true;
      run.emitAgent6Warning(
        "Fair play failure classified as \"clue_only\" — CML structure is sound; " +
        `regenerating clues with targeted per-violation feedback (attempt 3 of ${run.maxTargetedRegenAttempts})`,
        "transient-progress"
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback (final attempt)...", 63);
      const finalClueRetryStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity: run.clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: buildFairPlayFeedbackPayload(state.fairPlayAudit!, ctx.cml, ctx.clues),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] =
        ctx.clues.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - finalClueRetryStart);
      applyAgent5ContractsToRegeneratedClues(ctx, "final-targeted-regen");
      run.retryBudget.consume(run.perCallCostDelta("Agent5-Clues", ctx.clues.cost), "final targeted clue regeneration");

      const finalAuditStart = Date.now();
      state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
      ctx.agentCosts["agent6_fairplay"] =
        state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
      ctx.agentDurations["agent6_fairplay"] =
        (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - finalAuditStart);
      run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", state.fairPlayAudit.cost), "final targeted fair-play re-audit");
      hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(state.fairPlayAudit, criticalFairPlayRules);
      await recordFairPlayScore();
    }

    // WP8A-Deterministic Backstop: when structural gaps still remain after CML revision,
    // inject additional case-grounded clues and re-audit once.
    // Note: for clean CMLs (preAuditStructuralResult.passed), backstops already ran pre-LLM.
    if (run.retriesEnabled &&
      !preAuditStructuralResult?.passed
      && state.fairPlayAudit!.overallStatus === "fail"
      && hasCriticalFairPlayFailure
      && ctx.cml
      && ctx.clues
      && run.retryBudget.getConsumed() <= MAX_FAIR_PLAY_RETRY_COST) {
      const backstopRepairs = ensureCriticalFairPlayBackstopClues(ctx.cml, ctx.clues);
      const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
      if (parityBridgeId) {
        backstopRepairs.push(`added ${parityBridgeId} as early essential parity bridge clue`);
      }

      if (backstopRepairs.length > 0) {
        state.agent6RetryInvoked = true;
        backstopRepairs.forEach((repair) => run.emitAgent6Warning(`Agent 6 deterministic fair-play backstop: ${repair}`, "persistent-risk")
        );

        applyAgent5ContractsToRegeneratedClues(ctx, "critical-fairplay-backstop");

        const backstopAuditStart = Date.now();
        state.fairPlayAudit = await run.auditCurrentFairPlay(preAuditStructuralResult);
        ctx.agentCosts["agent6_fairplay"] =
          state.fairPlayAudit.cost; // A_53 P3: cumulative byAgent total — overwrite, not +=
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - backstopAuditStart);
        run.retryBudget.consume(run.perCallCostDelta("Agent6-FairPlayAuditor", state.fairPlayAudit.cost), "deterministic fair-play backstop re-audit");
        hasCriticalFairPlayFailure = hasCriticalFairPlayViolations(state.fairPlayAudit, criticalFairPlayRules);
        await recordFairPlayScore();
      }
    }

    // WP8A: log remaining failures
    if (state.fairPlayAudit!.overallStatus === "fail") {
      const criticalViolations = state.fairPlayAudit!.violations
        .filter((v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule))
        .map((v) => `${v.rule}: ${v.description}`)
        .join("; ");
      if (criticalViolations) {
        run.emitAgent6Warning(
          `Fair play: critical failures persist after all retries: ${criticalViolations}`,
          "persistent-risk"
        );
        state.emittedFinalCriticalFailureSummary = true;
      }
    }

    // Retry-budget overflow is handled as a hard stop via retryBudget.consume(...).
  }
  return { preAuditStructuralResult, hasCriticalFairPlayFailure };
}
