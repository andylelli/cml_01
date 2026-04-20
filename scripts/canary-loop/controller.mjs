import crypto from "crypto";
import { execSync } from "child_process";
import fs from "fs/promises";
import path from "path";
import {
  DEFAULTS,
  MIN_CONFIDENCE,
  MIN_ROOT_CAUSE_CONFIDENCE,
  loadRegisteredAgentCodes,
  normalizeAgentInput,
  getAgentMappingConformance,
  PIPELINE_AGENT_ORDER,
} from "./config.mjs";
import { inferMajorReworkAgentScope } from "./rework.mjs";
import { resolveArtifacts } from "./artifacts.mjs";
import { buildHydrationBundle } from "./hydrate.mjs";
import { classifyFailureSignature, classifyFailureText } from "./signatures.mjs";
import {
  analyzeRootCause,
  buildRetryFeedbackPacket,
  selectPlaybooks,
  buildPlannedActions,
} from "./playbooks.mjs";
import {
  acquireRunLock,
  applyPlaybookPatch,
  releaseRunLock,
  rollbackFailedImplementationChanges,
} from "./patches.mjs";
import { resolveValidationPlan, runValidationPlan } from "./validate.mjs";
import { createLedger, appendLedgerEntry, loadLedgerForResume } from "./ledger.mjs";
import {
  loadSignatureFixCache,
  getCachedFix,
  noteFixOutcome,
} from "./cache.mjs";
import { parseJsonText } from "./json.mjs";

export async function runCanaryLoop({ workspaceRoot, request }) {
  const logNarration = await createCanaryNarrator(workspaceRoot);
  const startBoundaryInput = request.startFromAgent || request.agent;
  const requestedStartBoundary = startBoundaryInput;
  let autoExpandedStartBoundary = null;
  await logNarration(
    `Activity: Started canary loop for run '${request.runId}' with agent '${request.agent || "<unset>"}' from boundary '${startBoundaryInput || "<unset>"}' in '${request.mode}' mode.`
  );

  const registeredAgentCodes = await loadRegisteredAgentCodes(workspaceRoot);
  const mappingConformance = getAgentMappingConformance(registeredAgentCodes);
  const normalizedAgent = normalizeAgentInput(request.agent, registeredAgentCodes);
  let normalizedStartFromAgent = normalizeAgentInput(startBoundaryInput, registeredAgentCodes);

  const precheckErrors = validateRequest({
    request,
    normalizedAgent,
    normalizedStartFromAgent,
  });
  if (!mappingConformance.ok) {
    precheckErrors.push(...mappingConformance.issues.map((issue) => `Mapping conformance: ${issue}`));
  }
  if (precheckErrors.length) {
    await logNarration(
      `Error: Precheck failed with ${precheckErrors.length} issue(s). ${precheckErrors.join(" | ")}`
    );
    return {
      exitCode: 2,
      status: "precheck_failed",
      messages: precheckErrors,
    };
  }

  const gitSnapshotAtStart = request.mode === "apply"
    ? getGitStatusSnapshot(workspaceRoot)
    : null;
  const historicalIntelligence = request.mode === "apply"
    ? await loadHistoricalRunIntelligence({ workspaceRoot })
    : { promptRetryCountByClass: {}, failedPlaybooksByClass: {} };

  const artifactBundle = await resolveArtifacts({
    workspaceRoot,
    runId: request.runId,
    agentCode: normalizedAgent.code,
    startChapter: request.startChapter,
    allowMissingAgentRecords: true,
  });

  let hydration = buildHydrationBundle({
    artifactBundle,
    startFromAgentCode: normalizedStartFromAgent.code,
    selectedAgentCode: normalizedAgent.code,
    hydratePriorFromRun: request.hydratePriorFromRun,
  });
  precheckErrors.push(...(hydration.errors ?? []));
  await logNarration(
    `Activity: Loaded artifacts for run '${artifactBundle.runId}' and agent '${normalizedAgent.canonicalAgent}'.`
  );
  await logNarration(
    `Activity: Hydration boundary '${normalizedStartFromAgent.canonicalAgent}' resolved ${hydration.bundle?.upstreamAgents?.length ?? 0} upstream dependency(ies).`
  );

  let precheckWarnings = [...(hydration.warnings ?? [])];
  let validationPlan;
  if (request.mode === "apply") {
    const resolved = resolveValidationPlan({ request, normalizedAgent, artifactBundle });
    validationPlan = resolved.plan;
    precheckWarnings.push(...resolved.warnings);
    precheckErrors.push(...resolved.errors);

    if (canSelfHydrateBoundary(validationPlan?.canaryCommand)) {
      const retainedErrors = [];
      for (const error of precheckErrors) {
        if (isMissingHydrationArtifactsError(error)) {
          precheckWarnings.push(
            `${error} Proceeding because canary command resolves boundary context directly.`
          );
          continue;
        }
        retainedErrors.push(error);
      }
      precheckErrors.length = 0;
      precheckErrors.push(...retainedErrors);
    }
  }

  if (normalizedAgent.code === "9" && Number.isInteger(request.startChapter) && !artifactBundle.chapterCount) {
    precheckWarnings.push(
      "Chapter count metadata unavailable for Agent 9; proceeding with startChapter and enforcing bounds during runtime validation."
    );
  }

  if (precheckErrors.length) {
    await logNarration(
      `Error: Precheck failed with ${precheckErrors.length} issue(s). ${precheckErrors.join(" | ")}`
    );
    return {
      exitCode: 2,
      status: "precheck_failed",
      messages: precheckErrors,
      hydration: hydration.bundle,
    };
  }

  const currentFingerprint = getWorkspaceFingerprint();
  let resumeContext;
  if (request.resume) {
    resumeContext = await loadLedgerForResume(request.resume);
    const mismatchReason = getResumeFingerprintMismatch({
      currentFingerprint,
      resumeContext,
    });
    if (mismatchReason) {
      await logNarration(
        "Error: Resume was blocked because workspace fingerprint changed since the prior ledger snapshot."
      );
      return {
        exitCode: 1,
        status: "stop_resume_fingerprint_mismatch",
        messages: [mismatchReason],
      };
    }
  }

  const ledger = await createLedger({
    workspaceRoot,
    runId: artifactBundle.runId,
    agent: normalizedAgent.canonicalAgent,
    resumePath: request.resume,
    resumedEntries: resumeContext?.entries,
  });

  const signature = await classifyFailureSignature({
    agent: normalizedAgent.canonicalAgent,
    artifactBundle,
  });
  const initialSignature = recoverLowConfidenceSignature({
    signature,
    agent: normalizedAgent.canonicalAgent,
    artifactBundle,
  });
  const allowLowConfidenceBypass = shouldBypassLowConfidenceStops({
    request,
    signature: initialSignature,
    artifactBundle,
  });
  await logNarration(
    `Activity: Detected issue '${describeSignatureClass(initialSignature.class)}' (class '${initialSignature.class}', confidence ${initialSignature.confidence.toFixed(2)}).`
  );
  await logNarration(`Issue: ${compactIssueMessage(initialSignature.message)}`);

  if (initialSignature.confidence < MIN_CONFIDENCE && !allowLowConfidenceBypass) {
    const entry = buildIterationRecord({
      iteration: 1,
      request,
      signature: initialSignature,
      decision: "stop",
      stopReason: `Low confidence signature (${initialSignature.confidence} < ${MIN_CONFIDENCE}).`,
    });
    await appendLedgerEntry(ledger, entry);
    await logNarration(
      "Warning: Issue classification confidence is too low to apply safely. Stopping before any edits."
    );
    return {
      exitCode: 1,
      status: "stop_low_confidence_signature",
      messages: [entry.stopReason],
      ledger,
      signature: initialSignature,
      hydration: hydration.bundle,
    };
  }

  if (initialSignature.confidence < MIN_CONFIDENCE && allowLowConfidenceBypass) {
    await logNarration(
      "Warning: Signature confidence is below threshold, but downstream agent markers are strong; continuing in apply mode with guarded low-confidence bypass."
    );
  }

  const rootCause = analyzeRootCause(initialSignature);
  await logNarration(
    `Root cause: ${describeRootCauseLayer(rootCause.sourceLayer)} (confidence ${rootCause.confidence.toFixed(2)}).`
  );
  await logNarration(`Cause: ${compactIssueMessage(rootCause.hypothesis)}`);
  if (rootCause.confidence < MIN_ROOT_CAUSE_CONFIDENCE && !allowLowConfidenceBypass) {
    const entry = buildIterationRecord({
      iteration: 1,
      request,
      signature: initialSignature,
      rootCause,
      decision: "stop",
      stopReason: `Low confidence root-cause hypothesis (${rootCause.confidence} < ${MIN_ROOT_CAUSE_CONFIDENCE}).`,
    });
    await appendLedgerEntry(ledger, entry);
    await logNarration(
      "Warning: Root-cause confidence is too low for safe auto-fix. Stopping before any edits."
    );
    return {
      exitCode: 1,
      status: "stop_low_confidence_root_cause",
      messages: [entry.stopReason],
      ledger,
      signature: initialSignature,
      rootCause,
      hydration: hydration.bundle,
    };
  }

  if (rootCause.confidence < MIN_ROOT_CAUSE_CONFIDENCE && allowLowConfidenceBypass) {
    await logNarration(
      "Warning: Root-cause confidence is below threshold, but downstream agent markers are strong; continuing in apply mode to gather higher-fidelity signatures."
    );
  }

  if (request.mode === "apply" && request.quickRun === true) {
    await logNarration(
      "Analysis: quickRun policy active. Deep rework and automatic wide-scope expansion are disabled to favor fastest boundary-local retries."
    );
    const candidateExpandedStartCode = suggestExpandedStartFromSignature({
      signature: initialSignature,
      selectedAgentCode: normalizedAgent.code,
      currentStartCode: normalizedStartFromAgent.code,
    });
    if (candidateExpandedStartCode && candidateExpandedStartCode !== normalizedStartFromAgent.code) {
      const candidateExpandedStart = normalizeAgentInput(
        `agent${candidateExpandedStartCode}`,
        registeredAgentCodes
      );
      if (candidateExpandedStart) {
        await logNarration(
          `Analysis: Wide-scope candidate detected ('${candidateExpandedStart.canonicalAgent}') but suppressed by quickRun.`
        );
      }
    } else {
      await logNarration(
        "Analysis: No upstream expansion candidate detected for current signature."
      );
    }
  }

  if (request.mode === "apply" && request.autoExpandUpstreamScope) {
    const expandedStartCode = suggestExpandedStartFromSignature({
      signature: initialSignature,
      selectedAgentCode: normalizedAgent.code,
      currentStartCode: normalizedStartFromAgent.code,
    });
    if (expandedStartCode && expandedStartCode !== normalizedStartFromAgent.code) {
      const expandedStart = normalizeAgentInput(`agent${expandedStartCode}`, registeredAgentCodes);
      if (expandedStart) {
        autoExpandedStartBoundary = expandedStart.canonicalAgent;
        normalizedStartFromAgent = expandedStart;
        request.startFromAgent = expandedStart.canonicalAgent;
        hydration = buildHydrationBundle({
          artifactBundle,
          startFromAgentCode: normalizedStartFromAgent.code,
          selectedAgentCode: normalizedAgent.code,
          hydratePriorFromRun: request.hydratePriorFromRun,
        });
        await logNarration(
          `Activity: Auto-expanded start boundary to '${expandedStart.canonicalAgent}' based on signature stage '${initialSignature.stage}'.`
        );
      }
    }
  }

  if (request.mode === "suggest") {
    const fixCache = await loadSignatureFixCache(workspaceRoot);
    const retryFeedbackPacket = buildRetryFeedbackPacket(initialSignature, rootCause);
    const policyContext = {
      rootCauseLayer: rootCause.sourceLayer,
      promptRetryCount: 0,
    };
    const playbookDecision = selectPlaybooks(initialSignature, policyContext);
    const cachedFix = getCachedFix({
      cache: fixCache,
      agent: normalizedAgent.canonicalAgent,
      signature: initialSignature,
      rootCause,
      policyContext,
    });
    const selectedPlaybooks = cachedFix?.playbooks ?? playbookDecision.selectedPlaybooks;
    const deterministicFallbackExceptions = collectDeterministicFallbackExceptions({
      selectedPlaybooks,
      cacheReason: cachedFix?.reason,
      signatureClass: initialSignature.class,
    });
    const plannedActions = buildPlannedActions({
      signature: initialSignature,
      rootCause,
      retryPacket: retryFeedbackPacket,
      selectedPlaybooks,
    });
    plannedActions.push(`Escalation stage: ${playbookDecision.escalationStage}.`);
    plannedActions.push(`Selection rationale: ${playbookDecision.rationale}`);
    if (cachedFix) {
      plannedActions.push(`Cache applied: ${cachedFix.reason}.`);
    }

    const entry = buildIterationRecord({
      iteration: 1,
      request,
      signature: initialSignature,
      rootCause,
      retryFeedbackPacket,
      selectedPlaybooks,
      plannedActions,
      deterministicFallbackExceptions,
      decision: "stop",
      stopReason: "Suggest mode completed planning pass.",
    });

    await appendLedgerEntry(ledger, entry);
    await logNarration(
      `Fix plan: ${summarizeRetryPacket(retryFeedbackPacket)} Playbooks ${selectedPlaybooks.length}.`
    );
    await logNarration("Activity: Suggest mode complete.");

    return {
      exitCode: 0,
      status: "suggest_plan_ready",
      messages: ["Suggest mode completed with retry packet and planned actions."],
      ledger,
      signature: initialSignature,
      rootCause,
      retryFeedbackPacket,
      selectedPlaybooks,
      plannedActions,
      artifactBundle,
      hydration: hydration.bundle,
    };
  }

  const majorReworkLog = await createMajorReworkLog({
    workspaceRoot,
    ledger,
    request,
    normalizedAgent,
  });

  const applyResult = await runApplyLoop({
    workspaceRoot,
    request,
    normalizedAgent,
    ledger,
    initialSignature,
    initialRootCause: rootCause,
    validationPlan,
    precheckWarnings,
    artifactBundle,
    hydration: hydration.bundle,
    resumeContext,
    logNarration,
    historicalIntelligence,
    majorReworkLog,
    runFeatureContext: {
      requestedStartBoundary,
      autoExpandedStartBoundary,
    },
  });

  applyResult.majorReworkLog = applyResult.majorReworkLog ?? majorReworkLog?.paths;

  if (
    request.mode === "apply" &&
    request.rollbackFailedChanges &&
    shouldRollbackAtEndOfRun(applyResult?.status)
  ) {
    const rollbackSummary = await rollbackRunDeltaFromSnapshot({
      workspaceRoot,
      baseline: gitSnapshotAtStart,
    });
    if (rollbackSummary.rolledBackCount > 0) {
      const rollbackNote = `End-of-run rollback restored ${rollbackSummary.rolledBackCount} file(s) introduced by unsuccessful run.`;
      applyResult.messages = [...(applyResult.messages ?? []), rollbackNote];
      await logNarration(`Activity: ${rollbackNote}`);
    }
  }

  return applyResult;
}

function canSelfHydrateBoundary(canaryCommand) {
  const command = String(canaryCommand ?? "").toLowerCase();
  return (
    command.includes("node scripts/canary-agent-boundary.mjs") ||
    command.includes("node scripts/canary-agent9.mjs")
  );
}

function recoverLowConfidenceSignature({ signature, agent, artifactBundle }) {
  if (!signature || signature.confidence >= MIN_CONFIDENCE) {
    return signature;
  }

  if (signature.class !== "unknown.pipeline_failure") {
    return signature;
  }

  const candidateTexts = [
    signature.message,
    ...(Array.isArray(signature.rawMarkers) ? signature.rawMarkers : []),
    artifactBundle?.runReport?.run_outcome_reason,
  ]
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);

  let best = signature;
  for (const text of candidateTexts) {
    const recovered = classifyFailureText({
      agent,
      text,
      source: "low_confidence_recovery",
    });
    if (
      recovered.class !== "unknown.pipeline_failure"
      && recovered.confidence > best.confidence
    ) {
      best = recovered;
    }
  }

  return best;
}

function shouldBypassLowConfidenceStops({ request, signature, artifactBundle }) {
  if (request?.mode !== "apply") {
    return false;
  }
  if (!hasStrongDownstreamMarkers(signature)) {
    return false;
  }

  const runOutcomeReason = String(artifactBundle?.runReport?.run_outcome_reason ?? "");
  if (!runOutcomeReason) {
    return true;
  }

  // Require at least one structured downstream failure term in run report context.
  return /\b(gate failed|critical|validation failed|required evidence|fair[ -]?play|schema)\b/i.test(
    runOutcomeReason
  );
}

function isMissingHydrationArtifactsError(message) {
  return String(message ?? "").startsWith("Missing required upstream hydration artifacts:");
}

async function runApplyLoop({
  workspaceRoot,
  request,
  normalizedAgent,
  ledger,
  initialSignature,
  initialRootCause,
  validationPlan,
  precheckWarnings,
  artifactBundle,
  hydration,
  resumeContext,
  logNarration,
  historicalIntelligence,
  majorReworkLog,
  runFeatureContext,
}) {
  let lock;
  let currentSignature = initialSignature;
  let currentRootCause = initialRootCause;
  const fixCache = await loadSignatureFixCache(workspaceRoot);
  let unchangedCount = resumeContext?.unchangedCount ?? 0;
  const startingIteration = resumeContext?.nextIteration ?? 1;
  const applySessionId = new Date().toISOString().replace(/[:.]/g, "-");
  let majorReworkResetUsed = false;

  try {
    lock = await acquireRunLock({
      workspaceRoot,
      runId: request.runId,
      agent: normalizedAgent.canonicalAgent,
    });
    await logNarration("Activity: Acquired run lock.");

    for (let iteration = startingIteration; iteration <= request.maxIterations; iteration += 1) {
      await logNarration(
        `Activity: Iteration ${iteration} started. Current issue class is '${currentSignature.class}'.`
      );
      const retryFeedbackPacket = buildRetryFeedbackPacket(currentSignature, currentRootCause);
      const classHistory = [
        ...ledger.entries
          .map((entry) => entry?.outputSignature?.class ?? entry?.inputSignature?.class)
          .filter(Boolean),
        currentSignature.class,
      ];
      const promptRetryCount = countPromptRetriesForClass({
        entries: ledger.entries,
        signatureClass: currentSignature.class,
      }) +
      Number(historicalIntelligence?.promptRetryCountByClass?.[currentSignature.class] ?? 0);
      const policyContext = {
        rootCauseLayer: currentRootCause.sourceLayer,
        promptRetryCount,
        historicalFailureCount: Number(
          historicalIntelligence?.failureCountByClass?.[currentSignature.class] ?? 0
        ),
        enableMajorRework: request.enableMajorRework,
        oscillationDetected: detectSignatureOscillation(classHistory),
        priorRunFailedPlaybooks:
          historicalIntelligence?.failedPlaybooksByClass?.[currentSignature.class] ?? [],
      };
      const shouldForceTerminalMajorRework =
        request.enableMajorRework === true
        && !majorReworkResetUsed
        && iteration >= request.maxIterations;
      const selectionPolicyContext = shouldForceTerminalMajorRework
        ? {
          ...policyContext,
          promptRetryCount: Math.max(Number(policyContext.promptRetryCount ?? 0), 3),
        }
        : policyContext;
      const playbookDecision = selectPlaybooks(currentSignature, selectionPolicyContext);
      const terminalMajorReworkTriggered =
        shouldForceTerminalMajorRework && playbookDecision.escalationStage === "rework";
      const cachedFix = getCachedFix({
        cache: fixCache,
        agent: normalizedAgent.canonicalAgent,
        signature: currentSignature,
        rootCause: currentRootCause,
        policyContext,
      });
      const selectedPlaybooks = resolveSelectedPlaybooks({
        playbookDecision,
        cachedFix,
      });
      const deterministicFallbackExceptions = collectDeterministicFallbackExceptions({
        selectedPlaybooks,
        cacheReason: cachedFix?.reason,
        signatureClass: currentSignature.class,
      });
      const plannedActions = buildPlannedActions({
        signature: currentSignature,
        rootCause: currentRootCause,
        retryPacket: retryFeedbackPacket,
        selectedPlaybooks,
      });
      let suppressedDeepReworkPlaybooks = [];
      plannedActions.push(`Escalation stage: ${playbookDecision.escalationStage}.`);
      plannedActions.push(`Selection rationale: ${playbookDecision.rationale}`);
      if (cachedFix) {
        plannedActions.push(`Cache applied: ${cachedFix.reason}.`);
      }
      await logNarration(
        `Analysis: Escalation '${playbookDecision.escalationStage}' selected ${selectedPlaybooks.length} playbook(s)${cachedFix ? ` with cache (${cachedFix.reason})` : ""}.`
      );
      if (selectedPlaybooks.length > 0) {
        await logNarration(
          `Analysis: Selected playbooks: ${selectedPlaybooks.join(", ")}.`
        );
      }
      if (terminalMajorReworkTriggered) {
        await logNarration(
          "Analysis: Terminal iteration detected; forcing major rework escalation and enabling iteration budget reset on unresolved outcome."
        );
      }
      if (request.quickRun === true) {
        const deepPolicyContext = {
          ...policyContext,
          enableMajorRework: true,
        };
        const deepDecision = selectPlaybooks(currentSignature, deepPolicyContext);
        if (
          deepDecision.escalationStage === "rework"
          && playbookDecision.escalationStage !== "rework"
        ) {
          suppressedDeepReworkPlaybooks = deepDecision.selectedPlaybooks;
          await logNarration(
            `Analysis: Deep rework candidate suppressed by quickRun. Candidate playbooks: ${deepDecision.selectedPlaybooks.join(", ")}.`
          );
        }
      }
      const featureSnapshot = buildFeatureSnapshot({
        request,
        normalizedAgent,
        policyContext,
        playbookDecision,
        cachedFix,
        selectedPlaybooks,
        runFeatureContext,
      });

      const patchResult = await applyPlaybookPatch({
        workspaceRoot,
        outputDir: ledger.outputDir,
        request,
        normalizedAgent,
        signature: currentSignature,
        rootCause: currentRootCause,
        selectedPlaybooks,
        retryFeedbackPacket,
        iteration,
        sessionId: applySessionId,
        chapterWindow: artifactBundle.chapterWindow,
        hydration,
        reworkContext: inferMajorReworkAgentScope({
          primaryAgentCode: normalizedAgent.code,
          classHistory,
          historicalFailureClasses: Object.keys(historicalIntelligence?.failureCountByClass ?? {}),
          pipelineOrder: PIPELINE_AGENT_ORDER,
        }),
      });
      await logNarration(
        `Activity: Iteration ${iteration} applied ${patchResult.changedFiles.length} file change(s).`
      );

      if (patchResult.changedFiles.length === 0) {
        const entry = buildIterationRecord({
          iteration,
          request,
          signature: currentSignature,
          rootCause: currentRootCause,
          retryFeedbackPacket,
          selectedPlaybooks,
          plannedActions,
          deterministicFallbackExceptions,
          changedFiles: [],
          decision: "stop",
          stopReason: "No-op patch detected; stopping to avoid ineffective loop.",
          tests: [],
          featureSnapshot,
          canary: {
            command: validationPlan.canaryCommand,
            passed: false,
            summary: "Canary not executed because patch was a no-op.",
          },
        });
        await appendLedgerEntry(ledger, entry);
        await appendMajorReworkLogEntry(majorReworkLog, {
          workspaceRoot,
          iteration,
          signatureClass: currentSignature.class,
          outputSignatureClass: "not-executed",
          rootCauseLayer: currentRootCause.sourceLayer,
          escalationStage: playbookDecision.escalationStage,
          selectionRationale: playbookDecision.rationale,
          selectedPlaybooks,
          terminalMajorReworkTriggered,
          forcedTerminalMajorRework: shouldForceTerminalMajorRework,
          resetApplied: false,
          decision: "stop",
          stopReason: entry.stopReason,
          quickRun: request.quickRun === true,
          suppressedDeepReworkPlaybooks,
          featureSnapshot,
          majorReworkPacket: patchResult.majorReworkPacket,
          majorReworkBriefPath: patchResult.majorReworkBriefPath,
        });
        await logNarration(
          `Warning: Iteration ${iteration} produced a no-op patch. Stopping to avoid churn.`
        );
        return {
          exitCode: 1,
          status: "stop_no_op_patch",
          messages: [entry.stopReason, ...precheckWarnings],
          ledger,
          signature: currentSignature,
          rootCause: currentRootCause,
          hydration,
        };
      }

      const validation = await runValidationPlan({
        workspaceRoot,
        plan: validationPlan,
        request,
        normalizedAgent,
        chapterWindow: artifactBundle.chapterWindow,
        onEvent: async (event) => {
          if (event.kind === "test_start") {
            await logNarration(`Test start: ${compactCommandLabel(event.command)}.`);
            return;
          }
          if (event.kind === "test_tick" && event.elapsedSeconds % 30 === 0) {
            await logNarration(`Test wait: ${compactCommandLabel(event.command)} ${event.elapsedSeconds}s.`);
            return;
          }
          if (event.kind === "test_end") {
            await logNarration(
              `Test end: ${compactCommandLabel(event.command)} ${event.passed ? "ok" : "fail"}.`
            );
            return;
          }
          if (event.kind === "test_progress") {
            await logNarration(`Test step: ${compactIssueMessage(event.message)}.`);
            return;
          }
          if (event.kind === "canary_start") {
            await logNarration(`Canary start: ${compactCommandLabel(event.command)}.`);
            return;
          }
          if (event.kind === "canary_tick" && event.elapsedSeconds % 30 === 0) {
            await logNarration(`Canary wait: ${compactCommandLabel(event.command)} ${event.elapsedSeconds}s.`);
            return;
          }
          if (event.kind === "canary_progress") {
            await logNarration(`Canary step: ${compactIssueMessage(event.message)}.`);
            return;
          }
          if (event.kind === "canary_end") {
            await logNarration(
              `Canary end: ${compactCommandLabel(event.command)} ${event.passed ? "ok" : "fail"}.`
            );
          }
        },
      });
      if (validation.infrastructureError) {
        const rollback = await maybeRollbackIterationChanges({
          workspaceRoot,
          request,
          ledger,
          iteration,
          patchResult,
          reason: validation.infrastructureMessage,
          logNarration,
        });
        if (rollback.note) {
          plannedActions.push(rollback.note);
        }
        const entry = buildIterationRecord({
          iteration,
          request,
          signature: currentSignature,
          rootCause: currentRootCause,
          retryFeedbackPacket,
          selectedPlaybooks,
          plannedActions,
          changedFiles: patchResult.changedFiles,
          tests: validation.tests ?? [],
          featureSnapshot,
          canary: {
            command: validationPlan.canaryCommand,
            passed: false,
            summary: validation.infrastructureMessage,
          },
          decision: "stop",
          stopReason: validation.infrastructureMessage,
        });
        await appendLedgerEntry(ledger, entry);
        await appendMajorReworkLogEntry(majorReworkLog, {
          workspaceRoot,
          iteration,
          signatureClass: currentSignature.class,
          outputSignatureClass: "infra_command_failure",
          rootCauseLayer: currentRootCause.sourceLayer,
          escalationStage: playbookDecision.escalationStage,
          selectionRationale: playbookDecision.rationale,
          selectedPlaybooks,
          terminalMajorReworkTriggered,
          forcedTerminalMajorRework: shouldForceTerminalMajorRework,
          resetApplied: false,
          decision: "stop",
          stopReason: validation.infrastructureMessage,
          quickRun: request.quickRun === true,
          suppressedDeepReworkPlaybooks,
          featureSnapshot,
          majorReworkPacket: patchResult.majorReworkPacket,
          majorReworkBriefPath: patchResult.majorReworkBriefPath,
        });
        await logNarration(
          `Error: Iteration ${iteration} hit an infrastructure command failure. ${validation.infrastructureMessage}`
        );
        return {
          exitCode: 3,
          status: "infra_command_failure",
          messages: [validation.infrastructureMessage, ...precheckWarnings],
          ledger,
          signature: currentSignature,
          rootCause: currentRootCause,
          hydration,
        };
      }

      const unresolvedWarnings = hasUnresolvedWarnings(validation);
      const canaryPassed = Boolean(validation.canary?.passed);
      await logNarration(
        `Activity: Iteration ${iteration} validation finished. Canary passed: ${canaryPassed ? "yes" : "no"}. Warning count: ${validation.canary?.warningsCount ?? 0}.`
      );
      await emitIterationDiagnostics({
        logNarration,
        iteration,
        validation,
        unresolvedWarnings,
        canaryPassed,
      });
      if (canaryPassed && !unresolvedWarnings) {
        const entry = buildIterationRecord({
          iteration,
          request,
          signature: currentSignature,
          rootCause: currentRootCause,
          retryFeedbackPacket,
          selectedPlaybooks,
          plannedActions,
          deterministicFallbackExceptions,
          changedFiles: patchResult.changedFiles,
          tests: validation.tests,
          featureSnapshot,
          canary: validation.canary,
          decision: "pass",
          stopReason: "Canary passed with zero unresolved warnings.",
        });
        await appendLedgerEntry(ledger, entry);
        await appendMajorReworkLogEntry(majorReworkLog, {
          workspaceRoot,
          iteration,
          signatureClass: currentSignature.class,
          outputSignatureClass: "pass",
          rootCauseLayer: currentRootCause.sourceLayer,
          escalationStage: playbookDecision.escalationStage,
          selectionRationale: playbookDecision.rationale,
          selectedPlaybooks,
          terminalMajorReworkTriggered,
          forcedTerminalMajorRework: shouldForceTerminalMajorRework,
          resetApplied: false,
          decision: "pass",
          stopReason: entry.stopReason,
          quickRun: request.quickRun === true,
          suppressedDeepReworkPlaybooks,
          featureSnapshot,
          majorReworkPacket: patchResult.majorReworkPacket,
          majorReworkBriefPath: patchResult.majorReworkBriefPath,
        });
        await noteFixOutcome({
          cache: fixCache,
          workspaceRoot,
          agent: normalizedAgent.canonicalAgent,
          signature: currentSignature,
          rootCause: currentRootCause,
          selectedPlaybooks,
          outcome: "pass",
        });
        await logNarration(`Activity: Iteration ${iteration} passed with no unresolved warnings.`);
        return {
          exitCode: 0,
          status: "pass",
          messages: ["Apply mode completed: canary passed with zero unresolved warnings.", ...precheckWarnings],
          ledger,
          signature: currentSignature,
          rootCause: currentRootCause,
          changedFiles: patchResult.changedFiles,
          hydration,
        };
      }

      const outputSignature = normalizeOutputSignatureForValidation({
        signature: classifyFailureText({
        agent: normalizedAgent.canonicalAgent,
        source: "validation_executor",
        text: [
          validation.tests?.map((test) => `${test.command}: ${test.summary}`).join("\n") ?? "",
          validation.canary?.summary ?? "",
          validation.canary?.stdout ?? "",
          validation.canary?.stderr ?? "",
        ]
          .filter(Boolean)
          .join("\n"),
        }),
        validation,
      });
      const outputRootCause = analyzeRootCause(outputSignature);
      const outputRetryPacket = buildRetryFeedbackPacket(outputSignature, outputRootCause);

      const failureDecision = decideLoopContinuation({
        request,
        iteration,
        previousSignature: currentSignature,
        outputSignature,
        unchangedCount,
        classHistory,
      });
      let effectiveFailureDecision = failureDecision;
      const shouldResetForMajorRework = shouldResetIterationAfterTerminalMajorRework({
        terminalMajorReworkTriggered,
        failureDecision,
      });
      if (shouldResetForMajorRework) {
        majorReworkResetUsed = true;
        effectiveFailureDecision = {
          ...failureDecision,
          decision: "continue",
          stopReason: undefined,
          nextUnchangedCount: 0,
        };
        plannedActions.push(
          "Major rework triggered on terminal iteration; reset iteration counter to 0 for a fresh apply window."
        );
        await logNarration(
          "Analysis: Major rework triggered on terminal iteration; resetting iteration counter to 0."
        );
      }
      unchangedCount = effectiveFailureDecision.nextUnchangedCount;

      await appendMajorReworkLogEntry(majorReworkLog, {
        workspaceRoot,
        iteration,
        signatureClass: currentSignature.class,
        outputSignatureClass: outputSignature.class,
        rootCauseLayer: currentRootCause.sourceLayer,
        escalationStage: playbookDecision.escalationStage,
        selectionRationale: playbookDecision.rationale,
        selectedPlaybooks,
        terminalMajorReworkTriggered,
        forcedTerminalMajorRework: shouldForceTerminalMajorRework,
        resetApplied: shouldResetForMajorRework,
        decision: effectiveFailureDecision.decision,
        stopReason: effectiveFailureDecision.stopReason,
        quickRun: request.quickRun === true,
        suppressedDeepReworkPlaybooks,
        featureSnapshot,
        majorReworkPacket: patchResult.majorReworkPacket,
        majorReworkBriefPath: patchResult.majorReworkBriefPath,
      });

      const rollback = await maybeRollbackIterationChanges({
        workspaceRoot,
        request,
        ledger,
        iteration,
        patchResult,
        reason: failureDecision.stopReason ?? "Unresolved output signature.",
        previousSignature: currentSignature,
        outputSignature,
        decision: effectiveFailureDecision.decision,
        logNarration,
      });
      if (rollback.note) {
        plannedActions.push(rollback.note);
      }

      const entry = buildIterationRecord({
        iteration,
        request,
        signature: currentSignature,
        outputSignature,
        rootCause: currentRootCause,
        retryFeedbackPacket,
        selectedPlaybooks,
        plannedActions,
        deterministicFallbackExceptions,
        changedFiles: patchResult.changedFiles,
        tests: validation.tests,
        featureSnapshot,
        canary: validation.canary,
        decision: effectiveFailureDecision.decision,
        stopReason: effectiveFailureDecision.stopReason,
      });
      await appendLedgerEntry(ledger, entry);
      await noteFixOutcome({
        cache: fixCache,
        workspaceRoot,
        agent: normalizedAgent.canonicalAgent,
        signature: currentSignature,
        rootCause: currentRootCause,
        selectedPlaybooks,
        outcome: effectiveFailureDecision.decision === "stop" ? "stop" : "continue",
      });
      await logNarration(
        `Error: Iteration ${iteration} still failing with '${describeSignatureClass(outputSignature.class)}' (class '${outputSignature.class}', severity '${outputSignature.severity}').`
      );
      await logNarration(`Issue: ${compactIssueMessage(outputSignature.message)}`);
      await logNarration(
        `Likely root cause: ${describeRootCauseLayer(outputRootCause.sourceLayer)}.`
      );
      await logNarration(
        `Suggested fix: ${summarizeRetryPacket(outputRetryPacket)}`
      );
      await logNarration(
        `Activity: Iteration ${iteration} decision is '${effectiveFailureDecision.decision}'.`
      );

      if (effectiveFailureDecision.decision === "stop") {
        if (shouldReturnWarningOnlyPass({
          validation,
          outputSignature,
          stopReason: effectiveFailureDecision.stopReason,
        })) {
          await logNarration(
            "Warning: Loop reached unchanged-signature safety limit, but canary passed and only warning-level issues remain. Returning non-fatal warning result."
          );
          return {
            exitCode: 0,
            status: "pass_with_warnings",
            messages: [
              `Apply mode completed with unresolved warnings: ${effectiveFailureDecision.stopReason}`,
              ...precheckWarnings,
            ],
            ledger,
            signature: outputSignature,
            rootCause: currentRootCause,
            hydration,
          };
        }

        await logNarration(
          `Warning: Loop stopped by safety policy. Reason: ${effectiveFailureDecision.stopReason}`
        );
        return {
          exitCode: 1,
          status: "stop_apply_policy",
          messages: [effectiveFailureDecision.stopReason, ...precheckWarnings],
          ledger,
          signature: outputSignature,
          rootCause: currentRootCause,
          hydration,
        };
      }

      currentSignature = outputSignature;
      currentRootCause = analyzeRootCause(outputSignature);
      if (currentRootCause.confidence < MIN_ROOT_CAUSE_CONFIDENCE) {
        await logNarration(
          "Warning: New root-cause confidence dropped below safe threshold. Loop stopped."
        );
        return {
          exitCode: 1,
          status: "stop_low_confidence_root_cause",
          messages: [
            `Low confidence root-cause hypothesis (${currentRootCause.confidence} < ${MIN_ROOT_CAUSE_CONFIDENCE}).`,
            ...precheckWarnings,
          ],
          ledger,
          signature: currentSignature,
          rootCause: currentRootCause,
          hydration,
        };
      }

      if (shouldResetForMajorRework) {
        // for-loop increment moves 0 -> 1 so the next pass restarts at iteration 1.
        iteration = 0;
      }
    }

    return {
      exitCode: 1,
      status: "stop_max_iterations",
      messages: [`Reached max iterations (${request.maxIterations}).`, ...precheckWarnings],
      ledger,
      signature: currentSignature,
      rootCause: currentRootCause,
      hydration,
    };
  } finally {
    await releaseRunLock(lock);
    await logNarration("Activity: Released run lock.");
  }
}

export function shouldResetIterationAfterTerminalMajorRework({
  terminalMajorReworkTriggered,
  failureDecision,
}) {
  if (!terminalMajorReworkTriggered) {
    return false;
  }
  if (failureDecision?.decision !== "stop") {
    return false;
  }

  const reason = String(failureDecision?.stopReason ?? "");
  return (
    reason.startsWith("Reached max iterations")
    || reason.startsWith("Signature remained unchanged for ")
  );
}

async function createMajorReworkLog({ ledger, request, normalizedAgent }) {
  if (!ledger?.outputDir || !ledger?.jsonlPath) {
    return null;
  }

  const ledgerBaseName = path.basename(ledger.jsonlPath, ".jsonl");
  const majorReworkBaseName = ledgerBaseName.startsWith("canary-ledger-")
    ? ledgerBaseName.replace(/^canary-ledger-/, "canary-major-rework-")
    : `canary-major-rework-${ledgerBaseName}`;
  const jsonlPath = path.join(ledger.outputDir, `${majorReworkBaseName}.jsonl`);
  const mdPath = path.join(ledger.outputDir, `${majorReworkBaseName}.md`);

  await fs.writeFile(jsonlPath, "", "utf8");
  await fs.writeFile(
    mdPath,
    [
      "# Major Rework Log",
      "",
      `- runId: \`${request?.runId ?? ""}\``,
      `- agent: \`${normalizedAgent?.canonicalAgent ?? request?.agent ?? ""}\``,
      `- enabled: \`${request?.enableMajorRework === true}\``,
      `- quickRun: \`${request?.quickRun === true}\``,
      `- generatedAt: \`${new Date().toISOString()}\``,
      "",
    ].join("\n"),
    "utf8"
  );

  return {
    paths: {
      jsonlPath,
      mdPath,
    },
  };
}

async function appendMajorReworkLogEntry(majorReworkLog, entry) {
  if (!majorReworkLog?.paths?.jsonlPath || !majorReworkLog?.paths?.mdPath || !entry) {
    return;
  }

  const majorReworkSelected = (entry.selectedPlaybooks ?? []).some((id) => String(id).startsWith("pb.rework."));
  const payload = {
    ...entry,
    timestamp: new Date().toISOString(),
    majorReworkSelected,
  };
  await fs.appendFile(majorReworkLog.paths.jsonlPath, `${JSON.stringify(payload)}\n`, "utf8");

  const lines = [
    `## Iteration ${entry.iteration}`,
    `- signature: \`${entry.signatureClass ?? "none"}\` -> \`${entry.outputSignatureClass ?? "none"}\``,
    `- escalation: \`${entry.escalationStage ?? "none"}\``,
    `- selected playbooks: ${(entry.selectedPlaybooks ?? []).length ? entry.selectedPlaybooks.join(", ") : "none"}`,
    `- major rework selected: \`${majorReworkSelected}\``,
    `- terminal force requested: \`${entry.forcedTerminalMajorRework === true}\``,
    `- terminal major rework triggered: \`${entry.terminalMajorReworkTriggered === true}\``,
    `- iteration reset applied: \`${entry.resetApplied === true}\``,
    `- decision: \`${entry.decision ?? "unknown"}\``,
    `- stop reason: ${entry.stopReason ? entry.stopReason : "none"}`,
    `- root cause layer: \`${entry.rootCauseLayer ?? "unknown"}\``,
    `- selection rationale: ${entry.selectionRationale ? entry.selectionRationale : "none"}`,
    `- quick run suppression candidates: ${(entry.suppressedDeepReworkPlaybooks ?? []).length ? entry.suppressedDeepReworkPlaybooks.join(", ") : "none"}`,
  ];

  const scope = entry.featureSnapshot?.scope ?? {};
  if (scope.selectedAgent || scope.requestedStartBoundary || scope.effectiveStartBoundary) {
    lines.push(
      `- scope: selected='${scope.selectedAgent ?? ""}', requested='${scope.requestedStartBoundary ?? ""}', effective='${scope.effectiveStartBoundary ?? ""}'`
    );
  }

  if (entry.majorReworkBriefPath && entry.workspaceRoot) {
    const rel = path.relative(entry.workspaceRoot, entry.majorReworkBriefPath).split(path.sep).join("/");
    lines.push(`- major rework brief: ${rel}`);
  }
  if (entry.majorReworkPacket) {
    lines.push(`- major rework packet focus: ${entry.majorReworkPacket.focusArea ?? "n/a"}`);
    lines.push(`- major rework packet constraints: ${(entry.majorReworkPacket.constraints ?? []).length}`);
    lines.push(`- major rework packet must-fix count: ${(entry.majorReworkPacket.mustFix ?? []).length}`);
  }

  lines.push("");
  await fs.appendFile(majorReworkLog.paths.mdPath, `${lines.join("\n")}\n`, "utf8");
}

async function createCanaryNarrator(workspaceRoot) {
  const basePath = path.join(workspaceRoot, "apps", "worker", "logs", "canary-log");
  let latestPath = basePath;
  let runPath = basePath;
  const stat = await statIfExists(basePath);

  const runStamp = formatRunStamp(new Date());
  const treatAsDirectory = stat?.isDirectory() || (!stat && path.extname(basePath) === "");
  if (treatAsDirectory) {
    await archiveCanaryLogDirectory(basePath, runStamp);
    latestPath = path.join(basePath, "canary-log.txt");
    runPath = path.join(basePath, `canary-log-${runStamp}.txt`);
  } else {
    const parentDir = path.dirname(basePath);
    const baseName = path.basename(basePath, path.extname(basePath));
    const ext = path.extname(basePath) || ".txt";
    latestPath = basePath;
    runPath = path.join(parentDir, `${baseName}-${runStamp}${ext}`);
  }

  await fs.mkdir(path.dirname(latestPath), { recursive: true });
  await fs.writeFile(latestPath, "", "utf8");
  await fs.writeFile(runPath, "", "utf8");

  let lastSection = "";
  let currentIteration = null;
  let lastFailureClass = null;

  return async (message) => {
    const formatted = formatNarrationLine(message);
    const section = detectNarrationSection(formatted, {
      currentIteration,
      lastFailureClass,
    });
    if (section?.iteration != null) {
      currentIteration = section.iteration;
    }
    if (section?.failureClass != null) {
      lastFailureClass = section.failureClass;
    }

    const lines = [];
    if (section?.header && section.header !== lastSection) {
      lines.push(`[${new Date().toISOString()}] ============== ${section.header} ==============\n`);
      lastSection = section.header;
    }
    lines.push(`[${new Date().toISOString()}] ${formatted}\n`);

    try {
      await Promise.all([
        fs.appendFile(latestPath, lines.join(""), "utf8"),
        fs.appendFile(runPath, lines.join(""), "utf8"),
      ]);
    } catch {
      // Narration logging must never block canary execution.
    }
  };
}

async function archiveCanaryLogDirectory(basePath, runStamp) {
  await fs.mkdir(basePath, { recursive: true });
  const entries = await fs.readdir(basePath, { withFileTypes: true });
  const entriesToArchive = entries.filter((entry) => entry.name !== "archive");
  if (!entriesToArchive.length) {
    return;
  }

  const archiveRoot = path.join(basePath, "archive");
  await fs.mkdir(archiveRoot, { recursive: true });

  let archiveFolder = path.join(archiveRoot, runStamp);
  let suffix = 1;
  while (await statIfExists(archiveFolder)) {
    archiveFolder = path.join(archiveRoot, `${runStamp}-${suffix.toString().padStart(2, "0")}`);
    suffix += 1;
  }
  await fs.mkdir(archiveFolder, { recursive: true });

  for (const entry of entriesToArchive) {
    const from = path.join(basePath, entry.name);
    const to = path.join(archiveFolder, entry.name);
    await fs.rename(from, to);
  }
}

function detectNarrationSection(message, state) {
  const compact = String(message ?? "").trim();
  if (!compact) {
    return { header: null, iteration: state.currentIteration };
  }

  if (/^Activity: Started canary loop\b/.test(compact)) {
    return { header: "RUN START", iteration: null, failureClass: state.lastFailureClass };
  }

  const iterationMatch = compact.match(/^Activity: Iteration (\d+) started\b/);
  if (iterationMatch) {
    const iteration = Number.parseInt(iterationMatch[1], 10);
    return {
      header: `ITERATION ${iteration}`,
      iteration,
      failureClass: state.lastFailureClass,
    };
  }

  if (/^(Test start:|Canary start:)/.test(compact)) {
    if (state.currentIteration != null) {
      return {
        header: `ITERATION ${state.currentIteration} VALIDATION`,
        iteration: state.currentIteration,
        failureClass: state.lastFailureClass,
      };
    }
    return { header: "VALIDATION", iteration: null, failureClass: state.lastFailureClass };
  }

  const diagnosticsMatch = compact.match(/^Activity: Iteration (\d+) diagnostics summary\./);
  if (diagnosticsMatch) {
    const iteration = Number.parseInt(diagnosticsMatch[1], 10);
    return {
      header: `ITERATION ${iteration} DIAGNOSTICS`,
      iteration,
      failureClass: state.lastFailureClass,
    };
  }

  if (/^Activity: Iteration \d+ applied \d+ file change\(s\)\./.test(compact)) {
    return {
      header: "PATCH APPLY",
      iteration: state.currentIteration,
      failureClass: state.lastFailureClass,
    };
  }

  if (/^(Root cause:|Cause:|Likely root cause:)/.test(compact)) {
    return {
      header: "ROOT CAUSE",
      iteration: state.currentIteration,
      failureClass: state.lastFailureClass,
    };
  }

  const failureClassMatch = compact.match(/class '([^']+)'/);
  if (/^Error: Iteration \d+ still failing with\b/.test(compact) && failureClassMatch) {
    const nextFailureClass = failureClassMatch[1];
    const header =
      state.lastFailureClass && state.lastFailureClass !== nextFailureClass
        ? "FAILURE CLASS CHANGE"
        : "FAILURE CLASS";
    return {
      header,
      iteration: state.currentIteration,
      failureClass: nextFailureClass,
    };
  }

  if (
    /^(Activity: Iteration \d+ decision is 'stop'\.|Warning: Loop reached unchanged-signature safety limit|Activity: Released run lock\.)/.test(
      compact
    )
  ) {
    return {
      header: "RUN END",
      iteration: state.currentIteration,
      failureClass: state.lastFailureClass,
    };
  }

  return {
    header: null,
    iteration: state.currentIteration,
    failureClass: state.lastFailureClass,
  };
}

async function emitIterationDiagnostics({
  logNarration,
  iteration,
  validation,
  unresolvedWarnings,
  canaryPassed,
}) {
  const warnings = [];
  const errors = [];

  for (const test of validation.tests ?? []) {
    if (!test?.passed) {
      errors.push(`Test failed: ${compactCommandLabel(test.command)} - ${compactIssueMessage(test.summary)}`);
    }
  }

  const canaryStatus = String(validation.canary?.status ?? "unknown");
  const canaryExitCode = validation.canary?.exitCode;
  if (!canaryPassed) {
    const exitPart = Number.isFinite(canaryExitCode) ? ` exitCode=${canaryExitCode}` : "";
    errors.push(`Canary did not pass (status='${canaryStatus}'${exitPart}).`);
  }

  const warningCount = Number(validation.canary?.warningsCount ?? 0);
  if (warningCount > 0) {
    warnings.push(`Canary reported ${warningCount} warning(s).`);
  }
  if (unresolvedWarnings) {
    warnings.push("Unresolved warning-level signatures remain after validation.");
  }

  const extracted = extractDiagnosticsFromText([
    validation.canary?.summary,
    validation.canary?.stdout,
    validation.canary?.stderr,
  ]);
  warnings.push(...extracted.warnings);
  errors.push(...extracted.errors);

  const dedupedWarnings = uniqueCompactMessages(warnings).slice(0, 8);
  const dedupedErrors = uniqueCompactMessages(errors).slice(0, 8);

  await logNarration(
    `Activity: Iteration ${iteration} diagnostics summary. Errors: ${dedupedErrors.length}. Warnings: ${dedupedWarnings.length}.`
  );

  if (!dedupedWarnings.length && !dedupedErrors.length) {
    await logNarration("Activity: Iteration diagnostics: no warning/error details captured.");
    return;
  }

  for (const warning of dedupedWarnings) {
    await logNarration(`Warning detail: ${warning}`);
  }
  for (const error of dedupedErrors) {
    await logNarration(`Error detail: ${error}`);
  }
}

function extractDiagnosticsFromText(chunks) {
  const warnings = [];
  const errors = [];
  const text = chunks
    .filter(Boolean)
    .map((value) => String(value))
    .join("\n");
  if (!text.trim()) {
    return { warnings, errors };
  }

  for (const rawLine of text.split(/\r?\n/)) {
    const line = compactIssueMessage(rawLine);
    if (!line) {
      continue;
    }
    if (/^(?:warning|warn)\b[:\s-]*/i.test(line) || /\bwarning\b/i.test(line)) {
      warnings.push(line);
      continue;
    }
    if (/^(?:error|fail(?:ed|ure)?)\b[:\s-]*/i.test(line) || /\berror\b/i.test(line)) {
      errors.push(line);
    }
  }

  return { warnings, errors };
}

function uniqueCompactMessages(items) {
  const seen = new Set();
  const results = [];
  for (const item of items ?? []) {
    const value = compactIssueMessage(item);
    if (!value) {
      continue;
    }
    const key = value.toLowerCase();
    if (seen.has(key)) {
      continue;
    }
    seen.add(key);
    results.push(value);
  }
  return results;
}

function formatNarrationLine(message) {
  const compact = String(message ?? "")
    .replace(/\s+/g, " ")
    .trim();
  if (!compact) {
    return "...";
  }
  return compact.length <= 160 ? compact : `${compact.slice(0, 157)}...`;
}

function formatRunStamp(date) {
  const iso = date.toISOString();
  return iso.replace(/[-:]/g, "").replace("T", "-").replace(/\..+$/, "");
}

async function statIfExists(targetPath) {
  try {
    return await fs.stat(targetPath);
  } catch {
    return null;
  }
}

function countPromptRetriesForClass({ entries, signatureClass }) {
  if (!signatureClass || !Array.isArray(entries)) {
    return 0;
  }
  return entries.filter((entry) => {
    if (entry?.inputSignature?.class !== signatureClass) {
      return false;
    }
    return (entry?.selectedPlaybooks ?? []).some((id) => String(id).startsWith("pb.prompt."));
  }).length;
}

export function resolveSelectedPlaybooks({ playbookDecision, cachedFix }) {
  const selectedByDecision = Array.isArray(playbookDecision?.selectedPlaybooks)
    ? playbookDecision.selectedPlaybooks
    : [];

  // Rework escalation must not be masked by cached prompt/code playbooks.
  if (playbookDecision?.escalationStage === "rework") {
    return selectedByDecision;
  }

  const cachedPlaybooks = Array.isArray(cachedFix?.playbooks)
    ? cachedFix.playbooks
    : null;
  return cachedPlaybooks ?? selectedByDecision;
}

function validateRequest({ request, normalizedAgent, normalizedStartFromAgent }) {
  const errors = [];
  if (!request.runId) {
    errors.push("--runId is required.");
  }
  if (!request.agent) {
    errors.push("--agent is required.");
  }
  if (!normalizedAgent) {
    errors.push(`Unsupported agent '${request.agent}'. Must resolve to a registered worker agent.`);
  }
  if (!normalizedStartFromAgent) {
    errors.push(
      `Unsupported startFromAgent '${request.startFromAgent ?? request.agent}'. Must resolve to a registered worker agent.`
    );
  }
  if (normalizedAgent && normalizedStartFromAgent) {
    const startIndex = PIPELINE_AGENT_ORDER.indexOf(normalizedStartFromAgent.code);
    const selectedIndex = PIPELINE_AGENT_ORDER.indexOf(normalizedAgent.code);
    if (startIndex < 0) {
      errors.push(`Unsupported --startFromAgent boundary '${normalizedStartFromAgent.canonicalAgent}'.`);
    }
    if (selectedIndex < 0) {
      errors.push(`Unsupported --agent pipeline position '${normalizedAgent.canonicalAgent}'.`);
    }
    if (startIndex > selectedIndex) {
      errors.push(
        `--startFromAgent (${normalizedStartFromAgent.canonicalAgent}) must not be downstream of --agent (${normalizedAgent.canonicalAgent}).`
      );
    }
  }
  if (!["suggest", "apply"].includes(request.mode)) {
    errors.push("--mode must be suggest or apply.");
  }
  if (!Number.isInteger(request.maxIterations) || request.maxIterations <= 0) {
    errors.push("--maxIterations must be a positive integer.");
  }
  if (!Number.isInteger(request.maxUnchanged) || request.maxUnchanged < 0) {
    errors.push("--maxUnchanged must be an integer >= 0.");
  }
  if (!["targeted", "full"].includes(request.testScope)) {
    errors.push("--testScope must be targeted or full.");
  }
  if (typeof request.hydratePriorFromRun !== "boolean") {
    errors.push("--hydratePriorFromRun must be true or false.");
  }
  if (typeof request.quickRun !== "boolean") {
    errors.push("--quickRun must be true or false.");
  }
  if (typeof request.confirmSharedEdits !== "boolean") {
    errors.push("--confirmSharedEdits must be true or false.");
  }
  if (typeof request.rollbackFailedChanges !== "boolean") {
    errors.push("--rollbackFailedChanges must be true or false.");
  }
  if (typeof request.partialRollbackEnabled !== "boolean") {
    errors.push("--partialRollbackEnabled must be true or false.");
  }
  if (typeof request.autoExpandUpstreamScope !== "boolean") {
    errors.push("--autoExpandUpstreamScope must be true or false.");
  }
  if (typeof request.enableMajorRework !== "boolean") {
    errors.push("--enableMajorRework must be true or false.");
  }

  if (request.startChapter !== undefined) {
    if (!Number.isInteger(request.startChapter) || request.startChapter < 1) {
      errors.push("--startChapter must be an integer >= 1.");
    }
    if (normalizedAgent?.code !== "9") {
      errors.push("--startChapter is only valid for Agent 9.");
    }
  }

  return errors;
}

function buildIterationRecord({
  iteration,
  request,
  signature,
  outputSignature,
  rootCause,
  retryFeedbackPacket,
  selectedPlaybooks = [],
  plannedActions = [],
  deterministicFallbackExceptions = [],
  changedFiles = [],
  tests = [],
  featureSnapshot,
  canary,
  decision,
  stopReason,
}) {
  return {
    iteration,
    timestamp: new Date().toISOString(),
    workspaceFingerprint: getWorkspaceFingerprint(),
    inputSignature: signature,
    rootCause,
    retryFeedbackPacket,
    selectedPlaybooks,
    plannedActions,
    deterministicFallbackExceptions,
    changedFiles,
    tests,
    featureSnapshot:
      featureSnapshot ??
      buildFeatureSnapshot({
        request,
      }),
    canary:
      canary ??
      {
        command: request.canaryCommand ?? "not-executed-in-suggest-mode",
        passed: false,
        summary: "Canary execution is not part of suggest mode.",
      },
    outputSignature,
    decision,
    stopReason,
  };
}

function buildFeatureSnapshot({
  request,
  normalizedAgent,
  policyContext,
  playbookDecision,
  cachedFix,
  selectedPlaybooks,
  runFeatureContext,
}) {
  const selected = Array.isArray(selectedPlaybooks) ? selectedPlaybooks : [];
  const priorFailed = Array.isArray(policyContext?.priorRunFailedPlaybooks)
    ? policyContext.priorRunFailedPlaybooks
    : [];
  const requestedStart = String(
    runFeatureContext?.requestedStartBoundary ?? request?.startFromAgent ?? request?.agent ?? ""
  );
  const effectiveStart = String(request?.startFromAgent ?? request?.agent ?? "");

  return {
    enabled: {
      quickRun: request?.quickRun === true,
      hydratePriorFromRun: request?.hydratePriorFromRun === true,
      rollbackFailedChanges: request?.rollbackFailedChanges === true,
      partialRollbackEnabled: request?.partialRollbackEnabled === true,
      autoExpandUpstreamScope: request?.autoExpandUpstreamScope === true,
      enableMajorRework: request?.enableMajorRework !== false,
    },
    scope: {
      selectedAgent: String(normalizedAgent?.canonicalAgent ?? request?.agent ?? ""),
      requestedStartBoundary: requestedStart,
      effectiveStartBoundary: effectiveStart,
      autoExpandedTo: String(runFeatureContext?.autoExpandedStartBoundary ?? ""),
      isBroadScopeBoundary: Boolean(effectiveStart && request?.agent && effectiveStart !== request.agent),
    },
    observed: {
      escalationStage: String(playbookDecision?.escalationStage ?? "none"),
      selectionRationale: String(playbookDecision?.rationale ?? ""),
      majorReworkSelected: selected.some((id) => String(id).startsWith("pb.rework.")),
      selectedPlaybookCount: selected.length,
      usedCachedFix: Boolean(cachedFix),
      promptRetryCount: Number(policyContext?.promptRetryCount ?? 0),
      historicalFailureCount: Number(policyContext?.historicalFailureCount ?? 0),
      oscillationDetected: policyContext?.oscillationDetected === true,
      priorRunFailedPlaybooksCount: priorFailed.length,
    },
  };
}

function collectDeterministicFallbackExceptions({ selectedPlaybooks, cacheReason, signatureClass }) {
  const codePlaybooks = (selectedPlaybooks ?? []).filter((id) => String(id).startsWith("pb.code."));
  if (!codePlaybooks.length) {
    return [];
  }

  const suffix = cacheReason ? ` (${cacheReason})` : "";
  return codePlaybooks.map(
    (playbook) => `deterministic_fallback:${playbook}:class=${signatureClass}${suffix}`
  );
}

export function decideLoopContinuation({
  request,
  iteration,
  previousSignature,
  outputSignature,
  unchangedCount,
  classHistory = [],
}) {
  if (
    outputSignature.confidence < MIN_CONFIDENCE
    && !isLowConfidenceOutputBypassEligible({ request, outputSignature })
  ) {
    return {
      decision: "stop",
      stopReason: `Low confidence output signature (${outputSignature.confidence} < ${MIN_CONFIDENCE}).`,
      nextUnchangedCount: unchangedCount,
    };
  }

  if (
    isGenericExecutionClass(outputSignature.class) &&
    !isGenericExecutionClass(previousSignature.class)
  ) {
    return {
      decision: "stop",
      stopReason: `Regression detected: output class downgraded to generic execution failure (${previousSignature.class} -> ${outputSignature.class}).`,
      nextUnchangedCount: unchangedCount,
    };
  }

  const candidateHistory = [...classHistory, outputSignature.class];
  if (detectSignatureOscillation(candidateHistory)) {
    return {
      decision: "stop",
      stopReason: "Detected oscillating failure-class cycle; stopping to prevent patch-on-patch churn.",
      nextUnchangedCount: unchangedCount,
    };
  }

  const sameClass = previousSignature.class === outputSignature.class;
  const nextUnchangedCount = sameClass ? unchangedCount + 1 : 0;

  if (
    request.stopOnNewFailureClass &&
    !sameClass &&
    severityRank(outputSignature.severity) > severityRank(previousSignature.severity)
  ) {
    return {
      decision: "stop",
      stopReason: `New higher-severity failure class detected (${previousSignature.class} -> ${outputSignature.class}).`,
      nextUnchangedCount,
    };
  }

  if (nextUnchangedCount > request.maxUnchanged) {
    return {
      decision: "stop",
      stopReason: `Signature remained unchanged for ${nextUnchangedCount} iterations (maxUnchanged=${request.maxUnchanged}).`,
      nextUnchangedCount,
    };
  }

  if (iteration >= request.maxIterations) {
    return {
      decision: "stop",
      stopReason: `Reached max iterations (${request.maxIterations}).`,
      nextUnchangedCount,
    };
  }

  return {
    decision: "continue",
    nextUnchangedCount,
  };
}

function severityRank(severity) {
  if (severity === "critical") {
    return 2;
  }
  if (severity === "warning") {
    return 1;
  }
  return 0;
}

function isGenericExecutionClass(className) {
  const normalized = String(className ?? "").toLowerCase();
  return normalized === "canary.execution_failure" || normalized === "unknown.pipeline_failure";
}

function isLowConfidenceOutputBypassEligible({ request, outputSignature }) {
  return request?.mode === "apply" && hasStrongDownstreamMarkers(outputSignature);
}

function hasStrongDownstreamMarkers(signature) {
  if (!signature || signature.class !== "unknown.pipeline_failure") {
    return false;
  }

  const signalText = [
    signature.message,
    ...(Array.isArray(signature.rawMarkers) ? signature.rawMarkers : []),
  ]
    .map((value) => String(value ?? ""))
    .join("\n");

  const hasAgentMarker = /\bagent\s*[0-9]+[a-z]?\b/i.test(signalText);
  const hasFailureSignal = /\b(gate failed|critical|validation failed|required evidence|fair[ -]?play|schema)\b/i.test(
    signalText
  );
  return hasAgentMarker && hasFailureSignal;
}

function detectSignatureOscillation(history) {
  if (!Array.isArray(history) || history.length < 3) {
    return false;
  }

  const compact = history
    .map((value) => String(value ?? "").trim())
    .filter(Boolean);
  if (compact.length < 3) {
    return false;
  }

  const n = compact.length;
  const a = compact[n - 1];
  const b = compact[n - 2];
  const c = compact[n - 3];

  // Detect A->B->A class bouncing, which indicates non-converging edits.
  if (a === c && a !== b) {
    return true;
  }

  if (compact.length < 4) {
    return false;
  }

  const d = compact[n - 4];
  // Detect A->B->C->A loops where three classes repeat without improvement.
  if (a === d && new Set([a, b, c]).size === 3) {
    return true;
  }

  return false;
}

function shouldReturnWarningOnlyPass({ validation, outputSignature, stopReason }) {
  const canaryPassed = Boolean(validation?.canary?.passed);
  const warningOnly = outputSignature?.severity === "warning";
  const unchangedLimitReached = String(stopReason ?? "").startsWith("Signature remained unchanged for ");

  return canaryPassed && warningOnly && unchangedLimitReached;
}

function normalizeOutputSignatureForValidation({ signature, validation }) {
  const canary = validation?.canary;
  const status = String(canary?.status ?? "").toLowerCase();
  const hasFailureStatus = [
    "fail",
    "failure",
    "error",
    "unknown",
    "chapter_window_violation",
    "skipped_tests_failed",
  ].includes(status);
  const canaryFailed =
    !canary ||
    canary.passed !== true ||
    (Number.isFinite(canary.exitCode) && canary.exitCode !== 0) ||
    hasFailureStatus;

  if (!canaryFailed) {
    return signature;
  }

  return {
    ...signature,
    class: "canary.execution_failure",
    severity: "critical",
    kind: "error",
    message:
      validation?.canary?.summary ||
      validation?.canary?.stderr ||
      validation?.canary?.stdout ||
      signature.message,
  };
}

function getWorkspaceFingerprint() {
  let headCommit;
  try {
    headCommit = execSync("git rev-parse HEAD", { stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
  } catch {
    headCommit = undefined;
  }

  let dirtyHash;
  try {
    const porcelain = execSync("git status --porcelain", { stdio: ["ignore", "pipe", "ignore"] })
      .toString("utf8")
      .trim();
    dirtyHash = porcelain
      ? crypto.createHash("sha1").update(porcelain).digest("hex").slice(0, 16)
      : undefined;
  } catch {
    dirtyHash = undefined;
  }

  return { headCommit, dirtyHash };
}

function getResumeFingerprintMismatch({ currentFingerprint, resumeContext }) {
  const previous = resumeContext?.lastFingerprint;
  if (!previous) {
    return null;
  }

  if ((previous.headCommit ?? null) !== (currentFingerprint.headCommit ?? null)) {
    return `Resume fingerprint mismatch: HEAD commit changed (${previous.headCommit ?? "none"} -> ${
      currentFingerprint.headCommit ?? "none"
    }).`;
  }
  if ((previous.dirtyHash ?? null) !== (currentFingerprint.dirtyHash ?? null)) {
    return `Resume fingerprint mismatch: dirty workspace hash changed (${previous.dirtyHash ?? "none"} -> ${
      currentFingerprint.dirtyHash ?? "none"
    }).`;
  }
  return null;
}

function describeSignatureClass(className) {
  const labels = {
    "agent5.red_herring_overlap": "red-herring wording overlap",
    "agent5.invalid_source_path": "invalid source path",
    "agent5.discriminating_id_coverage": "missing discriminating clue IDs",
    "agent5.weak_elimination_evidence": "weak suspect elimination evidence",
    "agent5.time_style_violation": "time-style wording violation",
    "agent6.fairplay_structural_critical": "critical fair-play structure failure",
    "agent6.runtime_null_guard": "runtime null-guard failure",
    "cml.required_evidence_missing": "missing required evidence in inference steps",
    "cml.schema_required_field_missing": "missing required schema field",
    "orchestrator.backfill_threshold_breach": "orchestrator threshold breach",
    "unknown.pipeline_failure": "unknown pipeline failure",
  };
  return labels[className] ?? className;
}

function describeRootCauseLayer(layer) {
  const labels = {
    prompt_contract: "prompt contract is underspecified",
    runtime_validation: "runtime validation coupling issue",
    llm_output_shape: "model output shape issue",
    orchestrator_policy: "orchestrator policy/escalation issue",
  };
  return labels[layer] ?? layer;
}

function summarizeRetryPacket(packet) {
  if (!packet) {
    return "No retry packet available.";
  }

  const parts = [];
  if (packet.mustFix?.length) {
    parts.push(`Must fix: ${compactIssueMessage(packet.mustFix[0], 68)}`);
  }
  if (packet.warningsToClear?.length) {
    parts.push(`Clear: ${compactIssueMessage(packet.warningsToClear[0], 52)}`);
  }
  if (packet.requiredReplacements?.length) {
    parts.push(`Replace: ${compactIssueMessage(packet.requiredReplacements[0], 52)}`);
  }
  if (packet.sourcePathBounds?.length) {
    parts.push(`Bounds: ${compactIssueMessage(packet.sourcePathBounds[0], 52)}`);
  }

  return parts.length ? parts.join(" | ") : "Use retry packet constraints.";
}

function compactIssueMessage(text, maxLength = 120) {
  const compact = String(text ?? "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return "n/a";
  }
  return compact.length <= maxLength ? compact : `${compact.slice(0, maxLength - 3)}...`;
}

function compactCommandLabel(command) {
  const compact = String(command ?? "").replace(/\s+/g, " ").trim();
  if (!compact) {
    return "cmd";
  }
  return compact.length <= 72 ? compact : `${compact.slice(0, 69)}...`;
}

export function hasUnresolvedWarnings(validationResult) {
  return (validationResult?.canary?.warningsCount ?? 0) > 0;
}

export function resolvePassState(validationResult) {
  return Boolean(validationResult?.canary?.passed) && !hasUnresolvedWarnings(validationResult);
}

export function buildDefaultRequest(overrides) {
  return {
    runId: "latest",
    agent: "",
    startFromAgent: undefined,
    hydratePriorFromRun: DEFAULTS.hydratePriorFromRun,
    quickRun: DEFAULTS.quickRun,
    mode: DEFAULTS.mode,
    maxIterations: DEFAULTS.maxIterations,
    maxUnchanged: DEFAULTS.maxUnchanged,
    testScope: DEFAULTS.testScope,
    canaryCommand: undefined,
    stopOnNewFailureClass: DEFAULTS.stopOnNewFailureClass,
    allowFiles: undefined,
    denyFiles: undefined,
    resume: undefined,
    overrideFileCap: undefined,
    startChapter: undefined,
    confirmSharedEdits: DEFAULTS.confirmSharedEdits,
    rollbackFailedChanges: DEFAULTS.rollbackFailedChanges,
    partialRollbackEnabled: DEFAULTS.partialRollbackEnabled,
    autoExpandUpstreamScope: DEFAULTS.autoExpandUpstreamScope,
    enableMajorRework: DEFAULTS.enableMajorRework,
    ...overrides,
  };
}

export function applyQuickRunPreset(request) {
  const base = request ?? buildDefaultRequest();
  if (base.quickRun !== true) {
    return base;
  }

  // Quick run favors boundary-local retries with hydration reuse.
  return {
    ...base,
    startFromAgent: base.agent,
    hydratePriorFromRun: true,
    autoExpandUpstreamScope: false,
    enableMajorRework: false,
    testScope: "targeted",
    maxUnchanged: Math.min(Math.max(Number(base.maxUnchanged) || 0, 0), 1),
  };
}

async function maybeRollbackIterationChanges({
  workspaceRoot,
  request,
  ledger,
  iteration,
  patchResult,
  reason,
  previousSignature,
  outputSignature,
  decision,
  logNarration,
}) {
  if (!request.rollbackFailedChanges) {
    return { note: null };
  }
  if (!Array.isArray(patchResult?.changeDetails) || patchResult.changeDetails.length === 0) {
    return { note: null };
  }

  const keepFilePaths = request.partialRollbackEnabled
    ? selectPartialRollbackKeepFiles({
      workspaceRoot,
      changeDetails: patchResult.changeDetails,
      previousSignature,
      outputSignature,
      decision,
    })
    : [];

  const rollback = await rollbackFailedImplementationChanges({
    workspaceRoot,
    outputDir: ledger.outputDir,
    iteration,
    changeDetails: patchResult.changeDetails,
    reason,
    keepFilePaths,
  });

  if (!rollback.rolledBackCount) {
    return { note: null };
  }

  const partialNote = rollback.keptFiles?.length
    ? ` Kept ${rollback.keptFiles.length} partial-win file(s).`
    : "";
  const note = `Rolled back ${rollback.rolledBackCount} unresolved implementation change(s); archived snapshots at ${rollback.archivedDir}.${partialNote}`;
  await logNarration(`Activity: ${note}`);
  return { note };
}

function selectPartialRollbackKeepFiles({
  workspaceRoot,
  changeDetails,
  previousSignature,
  outputSignature,
  decision,
}) {
  if (!Array.isArray(changeDetails) || !changeDetails.length) {
    return [];
  }
  if (!isSignatureImprovedForPartialRollback(previousSignature, outputSignature)) {
    return [];
  }
  if (decision === "stop" && isGenericExecutionClass(outputSignature?.class)) {
    return [];
  }

  const focusToken = inferAgentFocusToken(outputSignature?.class);
  if (!focusToken) {
    return [];
  }

  const keep = [];
  for (const change of changeDetails) {
    const absolute = change?.filePath;
    if (!absolute) {
      continue;
    }
    const rel = String(path.relative(workspaceRoot, absolute)).replace(/\\/g, "/").toLowerCase();
    if (!rel || rel.startsWith("logs/canary-loops/")) {
      continue;
    }
    if (rel.includes(`/agent${focusToken}-`) || rel.includes(`/agent${focusToken}.`) || rel.includes(`/agent${focusToken}/`)) {
      keep.push(absolute);
      continue;
    }
    if (focusToken === "3" && rel.includes("/cml")) {
      keep.push(absolute);
      continue;
    }
  }

  return keep;
}

function isSignatureImprovedForPartialRollback(previousSignature, outputSignature) {
  const prev = rankSignatureForRollback(previousSignature);
  const next = rankSignatureForRollback(outputSignature);
  return next > prev;
}

function rankSignatureForRollback(signature) {
  if (!signature) {
    return -10;
  }
  const className = String(signature.class ?? "").toLowerCase();
  const severity = String(signature.severity ?? "").toLowerCase();

  let score = 0;
  if (severity === "warning") {
    score += 40;
  }
  if (severity === "critical") {
    score += 10;
  }

  if (isGenericExecutionClass(className)) {
    score -= 30;
  } else {
    score += 15;
  }

  if (className.startsWith("agent6.")) {
    score += 8;
  } else if (className.startsWith("agent5.")) {
    score += 6;
  } else if (className.startsWith("cml.")) {
    score += 4;
  }

  const confidence = Number(signature.confidence ?? 0);
  if (Number.isFinite(confidence)) {
    score += Math.round(confidence * 10);
  }

  return score;
}

function inferAgentFocusToken(className) {
  const normalized = String(className ?? "").toLowerCase();
  if (normalized.startsWith("agent6.")) {
    return "6";
  }
  if (normalized.startsWith("agent5.")) {
    return "5";
  }
  if (normalized.startsWith("cml.")) {
    return "3";
  }
  return null;
}

function suggestExpandedStartFromSignature({ signature, selectedAgentCode, currentStartCode }) {
  const selectedIndex = PIPELINE_AGENT_ORDER.indexOf(selectedAgentCode);
  const currentStartIndex = PIPELINE_AGENT_ORDER.indexOf(currentStartCode);
  if (selectedIndex < 0 || currentStartIndex < 0) {
    return null;
  }

  const stage = String(signature?.stage ?? "").toLowerCase();
  const className = String(signature?.class ?? "").toLowerCase();
  const message = String(signature?.message ?? "").toLowerCase();

  let suggestedCode = null;
  if (stage === "cml-revision" || stage === "schema" || className.startsWith("cml.")) {
    suggestedCode = "4";
  } else if (stage === "fairplay" || className.startsWith("agent6.")) {
    suggestedCode = "6";
  } else if (stage === "clues" || className.startsWith("agent5.")) {
    suggestedCode = "5";
  } else if (className === "canary.execution_failure") {
    if (message.includes("fair play") || message.includes("deducibility") || message.includes("withholding")) {
      suggestedCode = "4";
    }
  }

  if (!suggestedCode) {
    return null;
  }

  const suggestedIndex = PIPELINE_AGENT_ORDER.indexOf(suggestedCode);
  if (suggestedIndex < 0) {
    return null;
  }
  if (suggestedIndex > selectedIndex) {
    return null;
  }
  if (suggestedIndex >= currentStartIndex) {
    return null;
  }

  return suggestedCode;
}

function shouldRollbackAtEndOfRun(status) {
  if (!status) {
    return false;
  }
  return !String(status).startsWith("pass");
}

async function loadHistoricalRunIntelligence({ workspaceRoot }) {
  const rootDir = path.join(workspaceRoot, "logs", "canary-loops");
  const out = {
    promptRetryCountByClass: {},
    failedPlaybooksByClass: {},
    failureCountByClass: {},
  };

  let runDirs = [];
  try {
    const entries = await fs.readdir(rootDir, { withFileTypes: true });
    runDirs = entries
      .filter((entry) => entry.isDirectory() && /^canary-loop-/i.test(entry.name))
      .map((entry) => path.join(rootDir, entry.name));
  } catch {
    return out;
  }

  const runDirsWithTime = [];
  for (const dirPath of runDirs) {
    try {
      const stat = await fs.stat(dirPath);
      runDirsWithTime.push({ dirPath, mtimeMs: stat.mtimeMs });
    } catch {
      // Ignore unreadable run directory.
    }
  }
  runDirsWithTime.sort((a, b) => b.mtimeMs - a.mtimeMs);

  const recentRunDirs = runDirsWithTime.slice(0, 5).map((item) => item.dirPath);
  for (const dirPath of recentRunDirs) {
    const attemptHistoryPath = path.join(dirPath, "canary-attempt-history.json");
    let attemptHistory;
    try {
      attemptHistory = parseJsonText(await fs.readFile(attemptHistoryPath, "utf8"));
    } catch {
      continue;
    }

    const attempts = Array.isArray(attemptHistory?.attempts) ? attemptHistory.attempts : [];
    for (const attempt of attempts) {
      const signatureClass = String(
        attempt?.outputSignatureClass ?? attempt?.inputSignatureClass ?? ""
      ).trim();
      if (!signatureClass) {
        continue;
      }

      const playbooks = Array.isArray(attempt?.selectedPlaybooks)
        ? attempt.selectedPlaybooks.map((value) => String(value))
        : [];

      const promptPlaybookCount = playbooks.filter((id) => id.startsWith("pb.prompt.")).length;
      if (promptPlaybookCount > 0) {
        out.promptRetryCountByClass[signatureClass] =
          Number(out.promptRetryCountByClass[signatureClass] ?? 0) + promptPlaybookCount;
      }

      if (String(attempt?.decision ?? "") === "stop") {
        out.failureCountByClass[signatureClass] = Number(out.failureCountByClass[signatureClass] ?? 0) + 1;
        const failed = new Set(out.failedPlaybooksByClass[signatureClass] ?? []);
        for (const playbook of playbooks) {
          failed.add(playbook);
        }
        out.failedPlaybooksByClass[signatureClass] = [...failed];
      }
    }
  }

  return out;
}

function getGitStatusSnapshot(workspaceRoot) {
  const empty = { tracked: new Set(), untracked: new Set() };
  let output = "";
  try {
    output = execSync("git status --porcelain", {
      cwd: workspaceRoot,
      stdio: ["ignore", "pipe", "ignore"],
    })
      .toString("utf8")
      .trim();
  } catch {
    return empty;
  }

  if (!output) {
    return empty;
  }

  const tracked = new Set();
  const untracked = new Set();
  for (const rawLine of output.split(/\r?\n/)) {
    const line = String(rawLine ?? "").trimEnd();
    if (!line || line.length < 4) {
      continue;
    }

    const status = line.slice(0, 2);
    const pathPart = line.slice(3);
    const resolvedPath = pathPart.includes(" -> ")
      ? pathPart.split(" -> ").pop()
      : pathPart;

    if (!resolvedPath) {
      continue;
    }
    if (status === "??") {
      untracked.add(resolvedPath);
      continue;
    }
    tracked.add(resolvedPath);
  }

  return { tracked, untracked };
}

async function rollbackRunDeltaFromSnapshot({ workspaceRoot, baseline }) {
  if (!baseline) {
    return { rolledBackCount: 0 };
  }

  const current = getGitStatusSnapshot(workspaceRoot);
  const trackedToRestore = [...current.tracked].filter((filePath) => !baseline.tracked.has(filePath));
  const untrackedToRemove = [...current.untracked].filter((filePath) => {
    if (baseline.untracked.has(filePath)) {
      return false;
    }
    const normalized = String(filePath).replace(/\\/g, "/");
    if (normalized.startsWith("logs/canary-loops/")) {
      return false;
    }
    if (normalized.startsWith("documentation/analysis/")) {
      return false;
    }
    return true;
  });

  for (const filePath of trackedToRestore) {
    try {
      execSync(`git restore --staged --worktree -- \"${filePath.replace(/\"/g, '\\\"')}\"`, {
        cwd: workspaceRoot,
        stdio: ["ignore", "pipe", "ignore"],
      });
    } catch {
      // Best-effort restore only.
    }
  }

  for (const filePath of untrackedToRemove) {
    const absolutePath = path.join(workspaceRoot, filePath);
    try {
      await fs.rm(absolutePath, { recursive: true, force: true });
    } catch {
      // Best-effort cleanup only.
    }
  }

  return { rolledBackCount: trackedToRestore.length + untrackedToRemove.length };
}
