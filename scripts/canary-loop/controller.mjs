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

export async function runCanaryLoop({ workspaceRoot, request }) {
  const logNarration = await createCanaryNarrator(workspaceRoot);
  const startBoundaryInput = request.startFromAgent || request.agent;
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
  await logNarration(
    `Activity: Detected issue '${describeSignatureClass(signature.class)}' (class '${signature.class}', confidence ${signature.confidence.toFixed(2)}).`
  );
  await logNarration(`Issue: ${compactIssueMessage(signature.message)}`);

  if (signature.confidence < MIN_CONFIDENCE) {
    const entry = buildIterationRecord({
      iteration: 1,
      request,
      signature,
      decision: "stop",
      stopReason: `Low confidence signature (${signature.confidence} < ${MIN_CONFIDENCE}).`,
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
      signature,
      hydration: hydration.bundle,
    };
  }

  const rootCause = analyzeRootCause(signature);
  await logNarration(
    `Root cause: ${describeRootCauseLayer(rootCause.sourceLayer)} (confidence ${rootCause.confidence.toFixed(2)}).`
  );
  await logNarration(`Cause: ${compactIssueMessage(rootCause.hypothesis)}`);
  if (rootCause.confidence < MIN_ROOT_CAUSE_CONFIDENCE) {
    const entry = buildIterationRecord({
      iteration: 1,
      request,
      signature,
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
      signature,
      rootCause,
      hydration: hydration.bundle,
    };
  }

  if (request.mode === "apply" && request.autoExpandUpstreamScope) {
    const expandedStartCode = suggestExpandedStartFromSignature({
      signature,
      selectedAgentCode: normalizedAgent.code,
      currentStartCode: normalizedStartFromAgent.code,
    });
    if (expandedStartCode && expandedStartCode !== normalizedStartFromAgent.code) {
      const expandedStart = normalizeAgentInput(`agent${expandedStartCode}`, registeredAgentCodes);
      if (expandedStart) {
        normalizedStartFromAgent = expandedStart;
        request.startFromAgent = expandedStart.canonicalAgent;
        hydration = buildHydrationBundle({
          artifactBundle,
          startFromAgentCode: normalizedStartFromAgent.code,
          selectedAgentCode: normalizedAgent.code,
          hydratePriorFromRun: request.hydratePriorFromRun,
        });
        await logNarration(
          `Activity: Auto-expanded start boundary to '${expandedStart.canonicalAgent}' based on signature stage '${signature.stage}'.`
        );
      }
    }
  }

  if (request.mode === "suggest") {
    const fixCache = await loadSignatureFixCache(workspaceRoot);
    const retryFeedbackPacket = buildRetryFeedbackPacket(signature, rootCause);
    const policyContext = {
      rootCauseLayer: rootCause.sourceLayer,
      promptRetryCount: 0,
    };
    const playbookDecision = selectPlaybooks(signature, policyContext);
    const cachedFix = getCachedFix({
      cache: fixCache,
      agent: normalizedAgent.canonicalAgent,
      signature,
      rootCause,
      policyContext,
    });
    const selectedPlaybooks = cachedFix?.playbooks ?? playbookDecision.selectedPlaybooks;
    const deterministicFallbackExceptions = collectDeterministicFallbackExceptions({
      selectedPlaybooks,
      cacheReason: cachedFix?.reason,
      signatureClass: signature.class,
    });
    const plannedActions = buildPlannedActions({
      signature,
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
      signature,
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
      signature,
      rootCause,
      retryFeedbackPacket,
      selectedPlaybooks,
      plannedActions,
      artifactBundle,
      hydration: hydration.bundle,
    };
  }

  return runApplyLoop({
    workspaceRoot,
    request,
    normalizedAgent,
    ledger,
    initialSignature: signature,
    initialRootCause: rootCause,
    validationPlan,
    precheckWarnings,
    artifactBundle,
    hydration: hydration.bundle,
    resumeContext,
    logNarration,
  });
}

function canSelfHydrateBoundary(canaryCommand) {
  const command = String(canaryCommand ?? "").toLowerCase();
  return (
    command.includes("node scripts/canary-agent-boundary.mjs") ||
    command.includes("node scripts/canary-agent9.mjs")
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
}) {
  let lock;
  let currentSignature = initialSignature;
  let currentRootCause = initialRootCause;
  const fixCache = await loadSignatureFixCache(workspaceRoot);
  let unchangedCount = resumeContext?.unchangedCount ?? 0;
  const startingIteration = resumeContext?.nextIteration ?? 1;
  const applySessionId = new Date().toISOString().replace(/[:.]/g, "-");

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
      const promptRetryCount = countPromptRetriesForClass({
        entries: ledger.entries,
        signatureClass: currentSignature.class,
      });
      const policyContext = {
        rootCauseLayer: currentRootCause.sourceLayer,
        promptRetryCount,
      };
      const playbookDecision = selectPlaybooks(currentSignature, policyContext);
      const cachedFix = getCachedFix({
        cache: fixCache,
        agent: normalizedAgent.canonicalAgent,
        signature: currentSignature,
        rootCause: currentRootCause,
        policyContext,
      });
      const selectedPlaybooks = cachedFix?.playbooks ?? playbookDecision.selectedPlaybooks;
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
      plannedActions.push(`Escalation stage: ${playbookDecision.escalationStage}.`);
      plannedActions.push(`Selection rationale: ${playbookDecision.rationale}`);
      if (cachedFix) {
        plannedActions.push(`Cache applied: ${cachedFix.reason}.`);
      }

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
          canary: {
            command: validationPlan.canaryCommand,
            passed: false,
            summary: "Canary not executed because patch was a no-op.",
          },
        });
        await appendLedgerEntry(ledger, entry);
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
          canary: {
            command: validationPlan.canaryCommand,
            passed: false,
            summary: validation.infrastructureMessage,
          },
          decision: "stop",
          stopReason: validation.infrastructureMessage,
        });
        await appendLedgerEntry(ledger, entry);
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
          canary: validation.canary,
          decision: "pass",
          stopReason: "Canary passed with zero unresolved warnings.",
        });
        await appendLedgerEntry(ledger, entry);
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
      });
      unchangedCount = failureDecision.nextUnchangedCount;

      const rollback = await maybeRollbackIterationChanges({
        workspaceRoot,
        request,
        ledger,
        iteration,
        patchResult,
        reason: failureDecision.stopReason ?? "Unresolved output signature.",
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
        canary: validation.canary,
        decision: failureDecision.decision,
        stopReason: failureDecision.stopReason,
      });
      await appendLedgerEntry(ledger, entry);
      await noteFixOutcome({
        cache: fixCache,
        workspaceRoot,
        agent: normalizedAgent.canonicalAgent,
        signature: currentSignature,
        rootCause: currentRootCause,
        selectedPlaybooks,
        outcome: failureDecision.decision === "stop" ? "stop" : "continue",
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
        `Activity: Iteration ${iteration} decision is '${failureDecision.decision}'.`
      );

      if (failureDecision.decision === "stop") {
        if (shouldReturnWarningOnlyPass({
          validation,
          outputSignature,
          stopReason: failureDecision.stopReason,
        })) {
          await logNarration(
            "Warning: Loop reached unchanged-signature safety limit, but canary passed and only warning-level issues remain. Returning non-fatal warning result."
          );
          return {
            exitCode: 0,
            status: "pass_with_warnings",
            messages: [
              `Apply mode completed with unresolved warnings: ${failureDecision.stopReason}`,
              ...precheckWarnings,
            ],
            ledger,
            signature: outputSignature,
            rootCause: currentRootCause,
            hydration,
          };
        }

        await logNarration(
          `Warning: Loop stopped by safety policy. Reason: ${failureDecision.stopReason}`
        );
        return {
          exitCode: 1,
          status: "stop_apply_policy",
          messages: [failureDecision.stopReason, ...precheckWarnings],
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
  if (typeof request.confirmSharedEdits !== "boolean") {
    errors.push("--confirmSharedEdits must be true or false.");
  }
  if (typeof request.rollbackFailedChanges !== "boolean") {
    errors.push("--rollbackFailedChanges must be true or false.");
  }
  if (typeof request.autoExpandUpstreamScope !== "boolean") {
    errors.push("--autoExpandUpstreamScope must be true or false.");
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

export function decideLoopContinuation({ request, iteration, previousSignature, outputSignature, unchangedCount }) {
  if (outputSignature.confidence < MIN_CONFIDENCE) {
    return {
      decision: "stop",
      stopReason: `Low confidence output signature (${outputSignature.confidence} < ${MIN_CONFIDENCE}).`,
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
    autoExpandUpstreamScope: DEFAULTS.autoExpandUpstreamScope,
    ...overrides,
  };
}

async function maybeRollbackIterationChanges({
  workspaceRoot,
  request,
  ledger,
  iteration,
  patchResult,
  reason,
  logNarration,
}) {
  if (!request.rollbackFailedChanges) {
    return { note: null };
  }
  if (!Array.isArray(patchResult?.changeDetails) || patchResult.changeDetails.length === 0) {
    return { note: null };
  }

  const rollback = await rollbackFailedImplementationChanges({
    workspaceRoot,
    outputDir: ledger.outputDir,
    iteration,
    changeDetails: patchResult.changeDetails,
    reason,
  });

  if (!rollback.rolledBackCount) {
    return { note: null };
  }

  const note = `Rolled back ${rollback.rolledBackCount} unresolved implementation change(s); archived snapshots at ${rollback.archivedDir}.`;
  await logNarration(`Activity: ${note}`);
  return { note };
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
