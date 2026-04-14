/**
 * Agent 6: Fair Play Auditor
 *
 * Extracted from mystery-orchestrator.ts. Runs auditFairPlay() with one
 * clue-regen retry, then WP5B (blind reader simulation) and WP6B (CML
 * structural revision on critical failures). May mutate ctx.cml and ctx.clues.
 * Writes ctx.fairPlayAudit and ctx.hasCriticalFairPlayFailure.
 */

import {
  auditFairPlay,
  extractClues,
  blindReaderSimulation,
  buildCMLPrompt,
  reviseCml,
} from "@cml/prompts-llm";
import type { FairPlayAuditResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { getGenerationParams, type PhaseScore, type TestResult } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type InferenceCoverageResult,
  applyClueGuardrails,
} from "./shared.js";

// ============================================================================
// classifyFairPlayFailure (agent-6 only)
// ============================================================================

type FairPlayFailureClass =
  | "clue_coverage"
  | "inference_path_abstract"
  | "constraint_space_insufficient"
  | "clue_only";

const CONFIDENCE_RANK: Record<string, number> = {
  impossible: 0,
  weak: 1,
  uncertain: 2,
  likely: 3,
  certain: 4,
};

const normalizeConfidence = (value: string | undefined): string =>
  String(value ?? "").trim().toLowerCase();

const classifyMissingInfoCategories = (items: string[]): string[] => {
  const categories = new Set<string>();
  for (const item of items) {
    const lower = item.toLowerCase();
    if (/\balibi|timeline|whereabouts\b/.test(lower)) categories.add("alibi gap");
    if (/\bphysical|forensic|trace|fingerprint|fiber|blood|tool\b/.test(lower)) categories.add("physical-link gap");
    if (/\bwitness|behavior|statement|testimony|motive\b/.test(lower)) categories.add("witness-behavior gap");
  }
  return Array.from(categories);
};

function classifyFairPlayFailure(
  coverageResult: InferenceCoverageResult,
  fairPlayAudit: FairPlayAuditResult | null,
  cml: CaseData
): FairPlayFailureClass {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  const abstractSteps = steps.filter((s: any) => {
    const obs = (s.observation || "").trim();
    const hasEvidence = Array.isArray(s.required_evidence) && s.required_evidence.length > 0;
    return obs.length < 30 || !hasEvidence;
  });

  const criticalRules = new Set(
    (fairPlayAudit?.violations ?? [])
      .filter((v) => v.severity === "critical")
      .map((v) => String(v.rule ?? "").toLowerCase().trim())
  );

  if (
    (criticalRules.has("logical deducibility") || criticalRules.has("no withholding")) &&
    abstractSteps.length >= Math.ceil(steps.length * 0.5)
  ) return "inference_path_abstract";

  if (abstractSteps.length >= Math.ceil(steps.length * 0.5)) return "inference_path_abstract";

  const cs = caseBlock?.constraint_space ?? {};
  const totalConstraints = [
    ...(cs.time?.contradictions ?? []),
    ...(cs.time?.anchors ?? []),
    ...(cs.access?.actors ?? []),
    ...(cs.physical?.traces ?? []),
  ].length;

  if (totalConstraints < 4) return "constraint_space_insufficient";

  if (
    coverageResult.hasCriticalGaps ||
    criticalRules.has("clue visibility") ||
    criticalRules.has("logical deducibility")
  ) return "clue_coverage";

  return "clue_only";
}

// ============================================================================
// runAgent6
// ============================================================================

export async function runAgent6(ctx: OrchestratorContext): Promise<void> {
  const fairPlayConfig = getGenerationParams().agent6_fairplay.params;
  const minBlindConfidence = normalizeConfidence(
    (fairPlayConfig.blind_reader as any)?.pass_criteria?.min_confidence ?? "likely",
  );
  const maxBlindRemediationCycles = Math.max(
    0,
    Number((fairPlayConfig.blind_reader as any)?.pass_criteria?.max_remediation_cycles ?? 1),
  );
  ctx.reportProgress("fairplay", "Auditing fair play compliance...", 62);

  const clueDensity =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  let fairPlayAudit: FairPlayAuditResult | null = null;
  let fairPlayAttempt = 0;
  const fairPlayStart = Date.now();

  while (fairPlayAttempt < fairPlayConfig.retries.max_fair_play_attempts) {
    fairPlayAttempt++;
    fairPlayAudit = await auditFairPlay(ctx.client, {
      caseData: ctx.cml!,
      clues: ctx.clues!,
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    if (fairPlayAudit.overallStatus === "pass") break;

    if (fairPlayAttempt < fairPlayConfig.retries.max_fair_play_attempts) {
      ctx.warnings.push(
        `Agent 6: Fair play audit ${fairPlayAudit.overallStatus}; regenerating clues to address feedback (attempt ${
          fairPlayAttempt + 1
        } of ${fairPlayConfig.retries.max_fair_play_attempts})`
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback...", 60);
      const retryCluesStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: {
          overallStatus: fairPlayAudit.overallStatus,
          violations: fairPlayAudit.violations,
          warnings: fairPlayAudit.warnings,
          recommendations: fairPlayAudit.recommendations,
        },
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });

      ctx.agentCosts["agent5_clues"] = ctx.clues.cost;
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
    }
  }

  if (!fairPlayAudit) throw new Error("Fair play audit failed to produce a report");

  ctx.agentCosts["agent6_fairplay"] = fairPlayAudit.cost;
  ctx.agentDurations["agent6_fairplay"] = Date.now() - fairPlayStart;

  const criticalFairPlayRules = ctx.criticalFairPlayRules;
  let hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
    (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule)
  );

  if (fairPlayAudit.overallStatus === "fail") {
    if (hasCriticalFairPlayFailure) {
      ctx.warnings.push(
        "Agent 6: Fair play audit failed on critical rules after clue regeneration; continuing with warnings"
      );
      fairPlayAudit.violations.forEach((v) =>
        ctx.warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`)
      );
    } else {
      ctx.warnings.push("Agent 6: Fair play audit FAILED after clue regeneration");
      fairPlayAudit.violations.forEach((v) =>
        ctx.warnings.push(`  - [${v.severity}] ${v.description}`)
      );
    }
  } else if (fairPlayAudit.overallStatus === "needs-revision") {
    if (hasCriticalFairPlayFailure) {
      ctx.warnings.push(
        "Agent 6: Fair play needs revision with critical issues; continuing with warnings"
      );
      fairPlayAudit.violations.forEach((v) =>
        ctx.warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`)
      );
    } else {
      ctx.warnings.push("Agent 6: Fair play needs minor revisions after clue regeneration");
    }
    fairPlayAudit.warnings.forEach((w) => ctx.warnings.push(`  - ${w}`));
  }

  ctx.reportProgress("fairplay", `Fair play audit: ${fairPlayAudit.overallStatus}`, 75);

  // FP-1: extracted as async closure so it can be called after each fairPlayAudit reassignment
  const recordFairPlayScore = async () => {
    if (!ctx.enableScoring || !ctx.scoreAggregator || !fairPlayAudit) return;
    const fpStatus = fairPlayAudit.overallStatus;
    const fpValidation = fpStatus === "pass" ? 100 : fpStatus === "needs-revision" ? 70 : 45;
    ctx.scoreAggregator.upsertPhaseScore(
      "agent6_fairplay",
      "Fair-play Audit",
      {
        agent: "agent6-fair-play-audit",
        validation_score: fpValidation,
        quality_score: 100,
        completeness_score: 100,
        consistency_score: 100,
        total: fpValidation,
        grade: (fpValidation >= 90 ? "A" : fpValidation >= 80 ? "B" : fpValidation >= 70 ? "C" : fpValidation >= 60 ? "D" : "F") as PhaseScore["grade"],
        passed: fpValidation >= 75,
        failure_reason:
          fpStatus === "fail"
            ? `Fair play audit failed (${fairPlayAudit.violations.length} violation(s))`
            : undefined,
        tests: [
          {
            name: "Overall fair play status",
            category: "validation" as const,
            passed: fpStatus === "pass",
            score: fpValidation,
            weight: 2,
            message: `Status: ${fpStatus}${fairPlayAudit.violations.length > 0 ? ` (${fairPlayAudit.violations.length} violation(s))` : ""}`,
          },
          ...fairPlayAudit.violations.map((v) => ({
            name: v.rule || "Fair play rule",
            category: "validation" as const,
            passed: false,
            score: v.severity === "critical" ? 0 : 50,
            weight: v.severity === "critical" ? 1.5 : 0.5,
            message: v.description,
            severity: v.severity as TestResult["severity"],
          })),
        ],
      },
      ctx.agentDurations["agent6_fairplay"] ?? 0,
      ctx.agentCosts["agent6_fairplay"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  };

  await recordFairPlayScore();

  // ── WP5B: Blind Reader Simulation ─────────────────────────────────────────
  const caseBlockForBlind = (ctx.cml as any)?.CASE ?? ctx.cml;
  const castNamesForBlind = (caseBlockForBlind?.cast ?? []).map((c: any) => c.name).filter(Boolean);
  const falseAssumptionStatement = caseBlockForBlind?.false_assumption?.statement || "";
  const actualCulpritName = caseBlockForBlind?.culpability?.culprits?.[0] || "";

  if (castNamesForBlind.length > 0 && falseAssumptionStatement && actualCulpritName) {
    ctx.reportProgress("fairplay", "Running blind reader simulation...", 73);

    const blindResult = await blindReaderSimulation(
      ctx.client, ctx.clues!, falseAssumptionStatement, castNamesForBlind,
      { runId: ctx.runId, projectId: ctx.projectId || "" }
    );

    ctx.agentCosts["agent6_blind_reader"] = blindResult.cost;
    ctx.agentDurations["agent6_blind_reader"] = blindResult.durationMs;

    const readerGotItRight =
      blindResult.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
      actualCulpritName.toLowerCase().includes(blindResult.suspectedCulprit.toLowerCase());

    const blindPasses =
      readerGotItRight &&
      (CONFIDENCE_RANK[normalizeConfidence(blindResult.confidenceLevel)] ?? -1) >=
        (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely);

    if (blindPasses) {
      ctx.reportProgress("fairplay", "Blind reader simulation: PASS", 74);
    } else {
      ctx.warnings.push(
        `Blind reader simulation: reader suspected "${blindResult.suspectedCulprit}" ` +
        `(confidence: ${blindResult.confidenceLevel}), actual culprit is "${actualCulpritName}"`
      );
      if (blindResult.missingInformation.length > 0) {
        ctx.warnings.push(`Blind reader missing info: ${blindResult.missingInformation.join("; ")}`);
      }

      let latestBlind = blindResult;
      let latestReaderPass = blindPasses;

      for (let cycle = 1; !latestReaderPass && cycle <= maxBlindRemediationCycles; cycle++) {
        const missingCategories = classifyMissingInfoCategories(latestBlind.missingInformation);
        ctx.warnings.push(
          `CRITICAL: Blind reader gate failed (cycle ${cycle}/${maxBlindRemediationCycles}). Regenerating clues with targeted requirements.`
        );

        ctx.reportProgress("clues", "Regenerating clues based on blind reader feedback...", 60);
        const blindRetryStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity,
          redHerringBudget: 2,
          fairPlayFeedback: {
            overallStatus: "fail",
            violations: [
              {
                severity: "critical" as const,
                rule: "Information Parity",
                description:
                  `A blind reader suspected "${latestBlind.suspectedCulprit}" instead of actual culprit "${actualCulpritName}". Reasoning: ${latestBlind.reasoning}`,
                suggestion:
                  `Add direct discriminating evidence for culprit "${actualCulpritName}" and at least one elimination/alibi clue per non-culprit suspect. Fill blind-reader gaps: ${latestBlind.missingInformation.join("; ")}`,
              },
            ],
            warnings: missingCategories.map((c) => `Blind reader category gap: ${c}`),
            recommendations: [
              ...latestBlind.missingInformation.map((info: string) => `Provide evidence for: ${info}`),
              "Ensure at least one culprit-discriminating clue that does not apply to non-culprits.",
              "Ensure each non-culprit has at least one elimination or alibi clue.",
            ],
          },
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });

        ctx.agentCosts["agent5_clues"] =
          (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - blindRetryStart);
        applyClueGuardrails(ctx.cml!, ctx.clues);

        const blindReAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent6_fairplay"] =
          (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - blindReAuditStart);
        hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
          (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule)
        );
        await recordFairPlayScore();

        latestBlind = await blindReaderSimulation(
          ctx.client,
          ctx.clues,
          falseAssumptionStatement,
          castNamesForBlind,
          { runId: ctx.runId, projectId: ctx.projectId || "" }
        );
        ctx.agentCosts["agent6_blind_reader"] =
          (ctx.agentCosts["agent6_blind_reader"] || 0) + latestBlind.cost;
        ctx.agentDurations["agent6_blind_reader"] =
          (ctx.agentDurations["agent6_blind_reader"] || 0) + latestBlind.durationMs;

        const latestGotItRight =
          latestBlind.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
          actualCulpritName.toLowerCase().includes(latestBlind.suspectedCulprit.toLowerCase());
        latestReaderPass =
          latestGotItRight &&
          (CONFIDENCE_RANK[normalizeConfidence(latestBlind.confidenceLevel)] ?? -1) >=
            (CONFIDENCE_RANK[minBlindConfidence] ?? CONFIDENCE_RANK.likely);

        if (latestReaderPass) {
          ctx.reportProgress("fairplay", "Blind reader simulation: PASS after remediation", 74);
        }
      }

      if (!latestReaderPass) {
        throw new Error(
          `Agent 6 blind-reader gate failed: simulated suspect "${latestBlind.suspectedCulprit}" (confidence ${latestBlind.confidenceLevel}) does not meet configured pass criteria (culprit=${actualCulpritName}, minConfidence=${minBlindConfidence}).`,
        );
      }
    }
  }

  // ── WP6B + WP8: CML Retry on Structural Failure ───────────────────────────
  const MAX_FAIR_PLAY_RETRY_COST = fairPlayConfig.retries.max_retry_cost_usd;
  let fairPlayRetryCost = 0;

  if (fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure) {
    const failureClass = classifyFairPlayFailure(ctx.coverageResult!, fairPlayAudit, ctx.cml!);

    if (
      (failureClass === "inference_path_abstract" || failureClass === "constraint_space_insufficient") &&
      fairPlayRetryCost <= MAX_FAIR_PLAY_RETRY_COST
    ) {
      const setting = ctx.setting!;
      const cast = ctx.cast!;
      const hardLogicDirectives = ctx.hardLogicDirectives!;
      const hardLogicDevices = ctx.hardLogicDevices!;
      const backgroundContext = ctx.backgroundContext!;

      ctx.warnings.push(
        `Fair play failure classified as "${failureClass}" — retrying CML generation (Agent 4) ` +
        "to fix upstream structural problems"
      );

      const revisionInstructions =
        failureClass === "inference_path_abstract"
          ? "The inference_path steps are too abstract. Rewrite each step with: " +
            "(1) a concrete, scene-level observation the reader can witness, " +
            "(2) a correction that follows from stated evidence, " +
            "(3) an effect that names the suspect eliminated, " +
            "(4) required_evidence listing 2-4 specific facts."
          : "The constraint_space is too sparse. Add: " +
            "(1) at least one temporal contradiction, " +
            "(2) at least 2 access constraints, " +
            "(3) at least 2 physical traces. " +
            "Each constraint must be concrete enough to become a reader-visible clue.";

      ctx.reportProgress("cml", "Revising CML to fix structural fair play issues...", 55);
      const revisionStart = Date.now();

      const cmlYaml =
        typeof ctx.cml === "string" ? (ctx.cml as string) : JSON.stringify(ctx.cml, null, 2);
      const revisionPrompt = buildCMLPrompt({
        decade: setting.setting.era.decade,
        location: setting.setting.location.description,
        institution: setting.setting.location.type,
        tone: ctx.inputs.tone || "Golden Age Mystery",
        weather: setting.setting.atmosphere.weather,
        socialStructure: setting.setting.era.socialNorms.join(", "),
        theme: ctx.inputs.theme || "mystery",
        castSize: cast.cast.characters.length,
        castNames: cast.cast.characters.map((c: any) => c.name),
        detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
        victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
        complexityLevel: hardLogicDirectives.complexityLevel,
        mechanismFamilies: hardLogicDirectives.mechanismFamilies,
        primaryAxis: ctx.primaryAxis,
        hardLogicModes: hardLogicDirectives.hardLogicModes,
        difficultyMode: hardLogicDirectives.difficultyMode,
        hardLogicDevices: hardLogicDevices.devices,
        backgroundContext,
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
      fairPlayRetryCost += revisedResult.cost;

      const revisedSteps =
        ((revisedResult.cml as any)?.CASE ?? revisedResult.cml)?.inference_path?.steps ?? [];
      if (revisedSteps.length >= 3) {
        ctx.cml = revisedResult.cml as any;
        ctx.warnings.push("CML revised — re-running clue extraction and fair play audit");

        const reCluesStart = Date.now();
        ctx.clues = await extractClues(ctx.client, {
          cml: ctx.cml!,
          clueDensity,
          redHerringBudget: 2,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent5_clues"] =
          (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
        ctx.agentDurations["agent5_clues"] =
          (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - reCluesStart);
        fairPlayRetryCost += ctx.clues.cost;
        applyClueGuardrails(ctx.cml!, ctx.clues);

        const reAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(ctx.client, {
          caseData: ctx.cml!,
          clues: ctx.clues,
          runId: ctx.runId,
          projectId: ctx.projectId || "",
        });
        ctx.agentCosts["agent6_fairplay"] =
          (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        ctx.agentDurations["agent6_fairplay"] =
          (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - reAuditStart);
        fairPlayRetryCost += fairPlayAudit.cost;
        hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
          (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule)
        );
        await recordFairPlayScore();
      }
    } else if (
      failureClass === "clue_only" &&
      fairPlayRetryCost <= MAX_FAIR_PLAY_RETRY_COST &&
      fairPlayConfig.retries.max_total_attempts_with_targeted_regen >= 3
    ) {
      ctx.warnings.push(
        "Fair play failure classified as \"clue_only\" — CML structure is sound; " +
        `regenerating clues with targeted per-violation feedback (attempt 3 of ${fairPlayConfig.retries.max_total_attempts_with_targeted_regen})`
      );

      ctx.reportProgress("clues", "Regenerating clues to address fair play feedback (final attempt)...", 63);
      const finalClueRetryStart = Date.now();
      ctx.clues = await extractClues(ctx.client, {
        cml: ctx.cml!,
        clueDensity,
        redHerringBudget: 2,
        fairPlayFeedback: {
          overallStatus: fairPlayAudit!.overallStatus,
          violations: fairPlayAudit!.violations,
          warnings: fairPlayAudit!.warnings,
          recommendations: fairPlayAudit!.recommendations,
        },
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent5_clues"] =
        (ctx.agentCosts["agent5_clues"] || 0) + ctx.clues.cost;
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - finalClueRetryStart);
      fairPlayRetryCost += ctx.clues.cost;
      applyClueGuardrails(ctx.cml!, ctx.clues);

      const finalAuditStart = Date.now();
      fairPlayAudit = await auditFairPlay(ctx.client, {
        caseData: ctx.cml!,
        clues: ctx.clues,
        runId: ctx.runId,
        projectId: ctx.projectId || "",
      });
      ctx.agentCosts["agent6_fairplay"] =
        (ctx.agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
      ctx.agentDurations["agent6_fairplay"] =
        (ctx.agentDurations["agent6_fairplay"] || 0) + (Date.now() - finalAuditStart);
      fairPlayRetryCost += fairPlayAudit.cost;
      hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
        (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule)
      );
      await recordFairPlayScore();
    }

    // WP8A: log remaining failures
    if (fairPlayAudit!.overallStatus === "fail") {
      const criticalViolations = fairPlayAudit!.violations
        .filter((v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule))
        .map((v) => `${v.rule}: ${v.description}`)
        .join("; ");
      if (criticalViolations) {
        ctx.warnings.push(
          `Fair play: critical failures persist after all retries: ${criticalViolations}`
        );
      }
    }

    if (fairPlayRetryCost > MAX_FAIR_PLAY_RETRY_COST) {
      ctx.warnings.push(
        `Fair play retry cost limit reached ($${fairPlayRetryCost.toFixed(3)}) — proceeding with best result`
      );
    }
  }

  ctx.fairPlayAudit = fairPlayAudit!;
  ctx.hasCriticalFairPlayFailure = hasCriticalFairPlayFailure;
}
