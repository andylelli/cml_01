/**
 * Agent 5 phases: the deterministic clue checks, discriminating-evidence remediation, and the final coverage
 * repair and hard gate. Moved from agent5-run.ts (code review A5-01 / CR-25), which re-exports what it exported.
 */
import { appendToClueTimeline } from "../../clue-contracts/synthesis.js";
import { ensureDiscriminatingEvidenceFloor } from "../../clue-contracts/evidence-floor.js";
import type { CoverageSnapshot } from "../../clue-contracts/contracts.js";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type OrchestratorContext,
} from "../shared.js";
import {
  CANONICAL_CLUE_ID_RE,
  checkCastNamePathConsistency,
  checkEraTimeStyleInClues,
  checkInferenceStepBounds,
  checkModelAuditConsistency,
  checkSourcePathValidity,
  enforceAgent5DeterministicContracts,
  findCulpritDiscriminatingGaps,
  findLockedFactClueTimeConflicts,
  getCaseBlock,
  getMissingDiscriminatingEvidenceIds,
  reconcileModelAudit,
  repairCastNamePathConsistency,
  repairInvalidSourcePaths,
  repairLockedFactClueTimeTranspositions,
  sanitizeEraTimeStyleInClues,
  strictPromptFeedbackCache,
  strictSourcePathWhitelistCache,
  synthesizeMissingCulpritDiscriminatingClues,
} from "../../clue-contracts/contracts.js";
import {
  Agent5Run,
  Agent5State,
} from "./run-state.js";
import {
} from "./extraction.js";

const DISCRIMINATING_ID_TOKEN_STOP_WORDS = new Set([
  "clue",
  "core",
  "chain",
  "step",
  "fp",
  "direct",
  "optional",
  "late",
  "slot",
  "contradiction",
  "evidence",
]);

const tokenizeDiscriminatingId = (value: string): string[] =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 3 && !DISCRIMINATING_ID_TOKEN_STOP_WORDS.has(token));

export const remapMissingDiscriminatingEvidenceIdsToExistingClues = (
  cml: CaseData,
  clues: ClueDistributionResult,
  missingEvidenceIds: string[],
): { remapped: Array<{ missingId: string; mappedId: string; sourceId: string }>; unresolved: string[] } => {
  if (missingEvidenceIds.length === 0) return { remapped: [], unresolved: [] };

  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { remapped: [], unresolved: [...missingEvidenceIds] };
  }

  const clueList = Array.isArray(clues?.clues) ? clues.clues : [];
  const existingClueIds = new Set<string>(
    clueList
      .map((clue: any) => String(clue?.id ?? "").trim())
      .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id)),
  );
  if (existingClueIds.size === 0) {
    return { remapped: [], unresolved: [...missingEvidenceIds] };
  }

  const canonicalEvidence: string[] = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id));
  const usedIds = new Set<string>(canonicalEvidence.filter((id: string) => existingClueIds.has(id)));

  const remapped: Array<{ missingId: string; mappedId: string; sourceId: string }> = [];
  const unresolved: string[] = [];

  for (const missingId of missingEvidenceIds) {
    if (!missingId || existingClueIds.has(missingId)) continue;
    const missingTokens = tokenizeDiscriminatingId(missingId);

    let best:
      | {
          id: string;
          sourceId: string;
          score: number;
          tokenMatches: number;
          structuralScore: number;
        }
      | undefined;

    for (const clue of clueList as any[]) {
      const candidateId = String(clue?.id ?? "").trim();
      if (!candidateId || !CANONICAL_CLUE_ID_RE.test(candidateId) || usedIds.has(candidateId)) continue;

      const candidateText = [
        String(clue?.id ?? ""),
        String(clue?.description ?? ""),
        String(clue?.pointsTo ?? ""),
        String(clue?.sourceInCML ?? ""),
      ]
        .join(" ")
        .toLowerCase();

      let tokenMatches = 0;
      for (const token of missingTokens) {
        if (candidateText.includes(token)) tokenMatches += 1;
      }

      const structuralScore =
        (String(clue?.criticality ?? "").toLowerCase() === "essential" ? 4 : 0)
        + ((String(clue?.placement ?? "").toLowerCase() === "early" || String(clue?.placement ?? "").toLowerCase() === "mid") ? 3 : 0)
        + ((String(clue?.evidenceType ?? "").toLowerCase() === "observation" || String(clue?.evidenceType ?? "").toLowerCase() === "contradiction") ? 2 : 0)
        + (String(clue?.sourceInCML ?? "").includes("CASE.discriminating_test.evidence_clues") ? 1 : 0);

      const score = structuralScore + (tokenMatches * 3);
      if (!best || score > best.score) {
        best = {
          id: candidateId,
          sourceId: String(clue?.id ?? ""),
          score,
          tokenMatches,
          structuralScore,
        };
      }
    }

    const canAcceptBest =
      Boolean(best)
      && (best!.tokenMatches > 0 || best!.structuralScore >= 8)
      && best!.score >= 7;

    if (!canAcceptBest || !best) {
      unresolved.push(missingId);
      continue;
    }

    let replaced = false;
    for (let i = 0; i < canonicalEvidence.length; i += 1) {
      if (canonicalEvidence[i] !== missingId) continue;
      canonicalEvidence[i] = best.id;
      replaced = true;
      break;
    }

    if (!replaced) {
      unresolved.push(missingId);
      continue;
    }

    usedIds.add(best.id);
    remapped.push({ missingId, mappedId: best.id, sourceId: best.sourceId });
  }

  if (remapped.length > 0) {
    discrimTest.evidence_clues = [...new Set(canonicalEvidence)];
  }

  const remainingMissing = getMissingDiscriminatingEvidenceIds(cml, clues);
  return { remapped, unresolved: remainingMissing.filter((id) => unresolved.includes(id) || missingEvidenceIds.includes(id)) };
};

/**
 * A_61 evidence-mapping FP fix — purge unmappable discriminating-test evidence ids, then reseed.
 *
 * An evidence id that references no real clue after the LLM retries AND the deterministic remap is an
 * UNMAPPABLE placeholder — most often the Agent-3 prompt example ids (clue_1/clue_2/clue_3, which match
 * CANONICAL_CLUE_ID_RE and leaked in as literal case data). The prior backstop CLONED a real clue under
 * the junk name, fabricating and mislabelling evidence. Instead we drop any evidence id absent from the
 * distributed clue set (mirrors mystery-orchestrator's `currentEvidence.filter(id => distributedClueIds
 * .has(id))`) and, if the list empties, re-seed from real canonical clue IDs (mirrors the empty-evidence
 * reseed at the top of the final-remediation block).
 *
 * "Real defect still fails" guarantee: when no plantable evidence exists the reseed returns [] and
 * evidence_clues stays empty, so checkDiscriminatingTestReachability's text-match branch still emits the
 * critical "references no evidence found in the clue set" — the identical gate the genuine zero-evidence
 * case has always hit. The purge only turns a placeholder-id FP into that same well-defined outcome.
 */
export function purgeUnmappableDiscriminatingEvidenceIds(
  cml: CaseData,
  clues: ClueDistributionResult,
): { removed: string[]; reseeded: string[] } {
  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { removed: [], reseeded: [] };
  }

  const distributedClueIds = new Set(
    clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean),
  );
  const original = discrimTest.evidence_clues.slice();
  const kept = original.filter((id: unknown) => distributedClueIds.has(String(id ?? "").trim()));
  if (kept.length === original.length) return { removed: [], reseeded: [] };

  const removed = original
    .filter((id: unknown) => !distributedClueIds.has(String(id ?? "").trim()))
    .map((id: unknown) => String(id ?? "").trim())
    .filter(Boolean);

  discrimTest.evidence_clues = kept;
  // Whitelist/feedback memos are keyed by the cml identity and enumerate evidence_clues[i] paths —
  // invalidate them after mutating the array (same rationale as the empty-evidence reseed).
  strictSourcePathWhitelistCache.delete(cml as unknown as object);
  strictPromptFeedbackCache.delete(cml as unknown as object);

  // Owner decision 6: the one floor (at least two) — this used to re-seed three, only when the purge emptied it.
  const reseeded = ensureDiscriminatingEvidenceFloor(cml, clues);

  return { removed, reseeded };
}

/**
 * RC3.1 (A_61 Phase 2a) — repair-not-abort for inference steps with NO covering clue.
 *
 * The coverage hard gate otherwise aborts the whole run when an `inference_path` step has no clue
 * covering its observation (run bfmz7izf6 died here). Instead, synthesise a covering clue per uncovered
 * step: `supportsInferenceStep`/`evidenceType:"observation"` mark it as that step's observation evidence
 * (the PRIMARY coverage path — see checkInferencePathCoverage), and the description embeds the step's own
 * observation text so it also satisfies the fuzzy fallback and reads as a real, plantable observation.
 * Mirrors synthesizeMissingDiscriminatingEvidenceClues. A step whose observation is empty cannot be
 * planted and is deliberately left for the hard gate (correct — there is nothing to surface).
 */
export function synthesizeInferenceStepCoverageClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  uncoveredStepNums: number[],
): string[] {
  if (!Array.isArray(uncoveredStepNums) || uncoveredStepNums.length === 0) return [];
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  if (steps.length === 0) return [];

  const existingIds = new Set(clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean));
  // Field template: prefer an essential observation clue so required schema fields are preserved.
  const template =
    clues.clues.find((c: any) => c?.criticality === "essential" && ((c as any)?.evidenceType ?? "observation") === "observation") ||
    clues.clues.find((c: any) => c?.criticality === "essential") ||
    clues.clues[0];

  const repairs: string[] = [];
  for (const stepNum of uncoveredStepNums) {
    const step = steps[stepNum - 1];
    const observation = typeof step?.observation === "string" ? step.observation.trim() : "";
    if (!observation) continue; // nothing to plant → leave for the hard gate

    let id = `clue_inference_cover_step_${stepNum}`;
    let suffix = 1;
    while (existingIds.has(id)) id = `clue_inference_cover_step_${stepNum}_${suffix++}`;

    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.filter((e: any) => typeof e === "string" && e.trim()).join("; ")
      : "";
    const description = requiredEvidence ? `${observation} (${requiredEvidence})` : observation;
    const placement = (template as any)?.placement === "late" ? "mid" : ((template as any)?.placement || "mid");

    clues.clues.push({
      ...(template ?? {}),
      id,
      description,
      criticality: "essential",
      evidenceType: "observation",
      supportsInferenceStep: stepNum,
      sourceInCML: `CASE.inference_path.steps[${stepNum - 1}].observation`,
      placement,
    } as any);
    existingIds.add(id);

    appendToClueTimeline(clues, id, placement);

    repairs.push(`${id} => covers inference step ${stepNum}`);
  }
  return repairs;
}

// Moved to clue-contracts/evidence-floor.ts (owner decision 6); re-exported for existing importers.
export { selectDiscriminatingEvidenceCandidateIds } from "../../clue-contracts/evidence-floor.js";

export function runDeterministicClueChecks(ctx: OrchestratorContext, run: Agent5Run, clues: ClueDistributionResult) {
  const sourcePathRepairs = repairInvalidSourcePaths(ctx.cml!, clues);
  sourcePathRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 source-path auto-repair: ${repair}`)
  );

  const sourcePathValidation = checkSourcePathValidity(ctx.cml!, clues);
  sourcePathValidation.issues.forEach((issue) => ctx.errors.push(`Agent 5 source-path validation: ${issue.message}`));
  if (sourcePathValidation.issues.length > 0) {
    run.failAgent5(`Agent 5 source-path gate failed with ${sourcePathValidation.issues.length} invalid source path(s).`);
  }

  reconcileModelAudit(ctx.cml!, clues);

  const stepBoundIssues = checkInferenceStepBounds(ctx.cml!, clues);
  stepBoundIssues.forEach((issue) => ctx.errors.push(`Agent 5 inference-step bounds: ${issue.message}`));
  if (stepBoundIssues.length > 0) {
    run.failAgent5(`Agent 5 step-index gate failed with ${stepBoundIssues.length} out-of-range inference step reference(s).`);
  }

  const castPathRepairs = repairCastNamePathConsistency(ctx.cml!, clues);
  castPathRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 cast-path auto-repair: ${repair}`)
  );
  // A_67 review bug (stale-audit-vs-repaired-text): the cast-path repair rewrites clue text, shifting
  // suspect coverage; without re-syncing, checkModelAuditConsistency below recomputes coverage from the
  // repaired text and mismatches the pre-repair audit snapshot (line 3848), spuriously aborting a clean
  // run the repair just fixed. Re-reconcile so the audit reflects the repaired text.
  if (castPathRepairs.length > 0) reconcileModelAudit(ctx.cml!, clues);

  const castPathConsistencyIssues = checkCastNamePathConsistency(ctx.cml!, clues);
  castPathConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 cast-path consistency: ${issue.message}`));
  if (castPathConsistencyIssues.length > 0) {
    run.failAgent5(`Agent 5 cast-path consistency gate failed with ${castPathConsistencyIssues.length} issue(s).`);
  }

  const auditConsistencyIssues = checkModelAuditConsistency(ctx.cml!, clues);
  auditConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 audit consistency: ${issue.message}`));
  if (auditConsistencyIssues.length > 0) {
    run.failAgent5(`Agent 5 audit-consistency gate failed with ${auditConsistencyIssues.length} mismatch(es).`);
  }

  let eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  if (eraTimeStyleIssues.length > 0) {
    const eraRepairs = sanitizeEraTimeStyleInClues(clues);
    eraRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 era-style sanitizer: ${repair}`));
    eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  }
  eraTimeStyleIssues.forEach((issue) => ctx.errors.push(`Agent 5 era time style: ${issue.message}`));
  if (eraTimeStyleIssues.length > 0) {
    run.failAgent5(`Agent 5 era time-style gate failed with ${eraTimeStyleIssues.length} digit-based time issue(s).`);
  }

  // Strict locked-fact/clue semantic consistency gate before committing clues downstream.
  const hardLogicLockedFacts = Array.isArray((ctx as any).hardLogicDevices?.devices)
    ? (ctx as any).hardLogicDevices.devices.flatMap((d: any) => Array.isArray(d?.lockedFacts) ? d.lockedFacts : []
    )
    : undefined;
  // X86 — same repair-then-recheck as the guardrail site above. A run died here on 2026-08-21 for a
  // pair of transposed registry values, while three sibling gates in the same file repair first.
  let timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    const timeRepairs = repairLockedFactClueTimeTranspositions(ctx.cml!, clues, hardLogicLockedFacts);
    timeRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 locked-fact time transposition repair: ${repair}`)
    );
    timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  }
  if (timeConflicts.length > 0) {
    timeConflicts.forEach((msg) => ctx.errors.push(`Agent 5 CML-clue consistency failure: ${msg}`));
    run.failAgent5(
      `Agent 5 CML-clue consistency gate failed (${timeConflicts.length} time conflict(s)).`
    );
  }

  const culpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
  if (culpritGaps.length > 0) {
    const culpritRepairs = synthesizeMissingCulpritDiscriminatingClues(ctx.cml!, clues, culpritGaps);
    culpritRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 culprit-evidence deterministic synthesis: ${repair}`));
    const remainingCulpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
    if (remainingCulpritGaps.length > 0) {
      run.failAgent5(
        `Agent 5 culprit-discriminating clue gate failed. Missing direct evidence clue for culprit(s): ${remainingCulpritGaps.join(", ")}`
      );
    }
  }
  return hardLogicLockedFacts;
}

export async function remediateDiscriminatingEvidence(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult, finalCoverage: CoverageSnapshot, buildCoverageSnapshot: (activeClues: ClueDistributionResult) => CoverageSnapshot) {
  // Owner decision 6: the one floor (at least two). This used to seed three, and only when the list was empty.
  const seededEvidenceIds = ensureDiscriminatingEvidenceFloor(ctx.cml!, clues);
  if (seededEvidenceIds.length > 0) {
    ctx.reportProgress(
      "clues",
      `Agent 5: deterministically seeded discriminating_test.evidence_clues from canonical clue IDs (${seededEvidenceIds.join(", ")}).`,
      61
    );
    finalCoverage = buildCoverageSnapshot(clues);
  }


  if (state.performedCoverageRetry) {
    finalCoverage.allCoverageIssues.forEach((issue) => ctx.warnings.push(`Inference coverage final: [${issue.severity}] ${issue.message}`)
    );
  }

  let remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
  if (remainingMissingEvidenceIds.length > 0) {
    const remapResult = remapMissingDiscriminatingEvidenceIdsToExistingClues(
      ctx.cml!,
      clues,
      remainingMissingEvidenceIds
    );
    if (remapResult.remapped.length > 0) {
      remapResult.remapped.forEach((repair) => ctx.warnings.push(
        `Agent 5 evidence-id deterministic remap: ${repair.missingId} => ${repair.mappedId} (matched existing ${repair.sourceId})`
      )
      );
      finalCoverage = buildCoverageSnapshot(clues);
      remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
    }
  }

  if (remainingMissingEvidenceIds.length > 0) {
    // A_61 evidence-mapping FP fix: any evidence id that still references no real clue after the LLM
    // retries and the deterministic remap is an unmappable placeholder (most often the Agent-3 prompt
    // example ids clue_1/clue_2/clue_3). Purge those and reseed from real clue IDs rather than cloning
    // a real clue under the junk name. See purgeUnmappableDiscriminatingEvidenceIds for the soundness
    // argument that a genuine "no plantable evidence" case still hard-fails.
    const purge = purgeUnmappableDiscriminatingEvidenceIds(ctx.cml!, clues);
    if (purge.removed.length > 0) {
      ctx.warnings.push(
        `Agent 5 evidence-id purge: dropped ${purge.removed.length} unmappable/placeholder evidence id(s) absent from the distributed clue set (${purge.removed.join(", ")}).`
      );
      if (purge.reseeded.length > 0) {
        ctx.warnings.push(
          `Agent 5 evidence-id purge reseed: repopulated discriminating_test.evidence_clues from canonical clue IDs (${purge.reseeded.join(", ")}).`
        );
      }
      finalCoverage = buildCoverageSnapshot(clues);
      remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
    }
  }
  return { clues, finalCoverage };
}

export function applyFinalCoverageRepairAndGate(ctx: OrchestratorContext, run: Agent5Run, clues: ClueDistributionResult, finalCoverage: CoverageSnapshot, buildCoverageSnapshot: (activeClues: ClueDistributionResult) => CoverageSnapshot, hardLogicLockedFacts: any) {
  finalCoverage = buildCoverageSnapshot(clues);
  if (finalCoverage.coverageResult.uncoveredSteps.length > 0) {
    const coverageRepairs = synthesizeInferenceStepCoverageClues(
      ctx.cml!,
      clues,
      finalCoverage.coverageResult.uncoveredSteps
    );
    if (coverageRepairs.length > 0) {
      coverageRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 inference-step coverage synthesis: ${repair}`)
      );
      finalCoverage = buildCoverageSnapshot(clues);
    }
  }

  try {
    const deterministicContracts = enforceAgent5DeterministicContracts(ctx.cml!, clues, {
      hardLogicLockedFacts,
    });
    deterministicContracts.warnings.forEach((warning) => ctx.warnings.push(warning));
    finalCoverage = buildCoverageSnapshot(clues);
  } catch (error) {
    run.failAgent5((error as Error).message || "Agent 5 deterministic contract gate failed.");
  }

  // Final hard gate: if critical inference/discriminating-test coverage still fails
  // after retries, abort before committing clues downstream.
  const stillHasCriticalCoverage = finalCoverage.coverageResult.hasCriticalGaps ||
    finalCoverage.falseAssumptionIssues.some((i) => i.severity === "critical") ||
    finalCoverage.discrimTestIssues.some((i) => i.severity === "critical");
  if (stillHasCriticalCoverage) {
    const criticalMessages = finalCoverage.allCoverageIssues
      .filter((i) => i.severity === "critical")
      .map((i) => i.message);
    const summary = criticalMessages.length > 0
      ? criticalMessages.join("; ")
      : "critical inference coverage gaps remain after retries";
    ctx.errors.push(`Agent 5 coverage hard gate failed after retries: ${summary}`);
    run.failAgent5(`Agent 5 coverage hard gate failed after retries: ${summary}`);
  }
  return finalCoverage;
}
