/**
 * Agent 6's deterministic clue contract: the structural audit, the backstop and parity-bridge clues, and
 * applying Agent 5's contracts to the clues. Moved from agent6-run.ts (code review A6-01 / CR-25).
 * Owner decision A6-Q01 (2026-10-02): the fair-play feedback payload (deriveRequiredCluePhrases /
 * buildFairPlayFeedbackPayload) fed only the retired AGENT_PRE9_ENABLE_LLM_RETRIES regenerations and is gone.
 */
import { appendToClueTimeline, openClueSynthesis } from "../../clue-contracts/synthesis.js";
import { ensureDiscriminatingEvidenceFloor } from "../../clue-contracts/evidence-floor.js";
import type { Clue, StructuralAuditResult, StructuralGap } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { caseOf } from "@cml/cml";
import { isDetectiveArchetype, isVictimArchetype, roleTextsOf, verifiedFixesEnabled } from "@cml/cml";
import {
  type OrchestratorContext,
  applyClueGuardrails,
} from "../shared.js";
import {
  enforceAgent5DeterministicContracts,
  recomputeCoverageSnapshotForAgent6,
} from "../../clue-contracts/contracts.js";
import { nameAppearsAsWord } from "../identity-match.js";
import { agent5GateLockedFacts } from "../agent5/contract-payload.js";

export const applyAgent5ContractsToRegeneratedClues = (ctx: OrchestratorContext, contextLabel: string): void => {
  if (!ctx.clues || !ctx.cml) return;
  const pushError = (message: string) => {
    if (Array.isArray(ctx.errors)) {
      ctx.errors.push(message);
    }
  };

  const guardrails = applyClueGuardrails(ctx.cml, ctx.clues);
  guardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 6 (${contextLabel}) guardrail auto-fix: ${fix}`));
  if (guardrails.hasCriticalIssues) {
    guardrails.issues
      .filter((issue) => issue.severity === "critical")
      .forEach((issue) => pushError(`Agent 6 regenerated clue guardrail (${contextLabel}): ${issue.message}`));
    const summary = guardrails.issues
      .filter((issue) => issue.severity === "critical")
      .map((issue) => issue.message)
      .join("; ");
    throw new Error(`Agent 6 regenerated clue guardrail failure (${contextLabel}): ${summary || "critical guardrail issues"}`);
  }

  // A5-D07 (owner decision 12, CML_VERIFIED_FIXES): ON, the facts Agent 5's prompt sent; OFF, raw device facts.
  const hardLogicLockedFacts = agent5GateLockedFacts(ctx);

  const expectedEvidenceIds = Array.isArray(caseOf(ctx.cml)?.discriminating_test?.evidence_clues)
    ? (caseOf(ctx.cml).discriminating_test!.evidence_clues as unknown[])
      .map((id) => String(id ?? "").trim())
      .filter(Boolean)
    : [];
  const listCurrentClueIds = (): Set<string> => new Set(
    (Array.isArray(ctx.clues?.clues) ? ctx.clues.clues : [])
      .map((clue) => String(clue?.id ?? "").trim())
      .filter(Boolean),
  );
  const initialClueIds = listCurrentClueIds();
  const preserveRecoveredEvidenceIdWarnings = () => {
    if (expectedEvidenceIds.length === 0) return;
    const currentClueIds = listCurrentClueIds();
    for (const clueId of expectedEvidenceIds) {
      if (initialClueIds.has(clueId) || !currentClueIds.has(clueId)) continue;
      const alreadyLogged = ctx.warnings.some((warning) =>
        /evidence-id deterministic synthesis/i.test(String(warning)) && String(warning).includes(clueId),
      );
      if (alreadyLogged) continue;
      ctx.warnings.push(
        `Agent 6 (${contextLabel}) Agent 5 evidence-id deterministic synthesis: added missing clue id ${clueId} during regenerated clue validation.`,
      );
    }
  };

  const runDeterministicContracts = () => enforceAgent5DeterministicContracts(ctx.cml!, ctx.clues!, {
    hardLogicLockedFacts,
  });

  let deterministicContracts: { warnings: string[] };
  try {
    deterministicContracts = runDeterministicContracts();
  } catch (error) {
    // A6-05: this used to branch on "mechanism visibility gate failed" / "strict step coverage gate failed"
    // into a parity-bridge retry and a strict-step backstop. Nothing has thrown either message since
    // 2b76cbfa (2026-06-29) made both gates warnings, so every error took this path already.
    preserveRecoveredEvidenceIdWarnings();
    pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}): ${(error as Error).message || ""}`);
    throw error;
  }
  deterministicContracts.warnings.forEach((warning) =>
    ctx.warnings.push(`Agent 6 (${contextLabel}) ${warning}`),
  );
  // Owner decision 6: Agent 5's evidence floor, re-applied to the regenerated clues before the re-audit —
  // the pre-prose gate no longer back-fills after it.
  const evidenceFloorAdded = ensureDiscriminatingEvidenceFloor(ctx.cml, ctx.clues);
  if (evidenceFloorAdded.length > 0) {
    ctx.warnings.push(`Agent 6 (${contextLabel}) discriminating-evidence floor: added ${evidenceFloorAdded.join(", ")}`);
  }
  refreshCoverageOnContext(ctx);

  const parityBridgeId = ensureParityBridgeClue(ctx.cml, ctx.clues);
  if (parityBridgeId) {
    ctx.warnings.push(
      `Agent 6 (${contextLabel}) deterministic parity bridge: injected essential clue ${parityBridgeId} for discriminating-test mechanism visibility.`,
    );

    // Re-run deterministic contracts so injected bridge clues are normalized and validated.
    let bridgeContracts: { warnings: string[] };
    try {
      bridgeContracts = enforceAgent5DeterministicContracts(ctx.cml, ctx.clues, {
        hardLogicLockedFacts,
      });
    } catch (error) {
      pushError(`Agent 6 regenerated clue deterministic contract (${contextLabel}, parity bridge): ${(error as Error).message}`);
      throw error;
    }
    bridgeContracts.warnings.forEach((warning) =>
      ctx.warnings.push(`Agent 6 (${contextLabel}, parity bridge) ${warning}`),
    );

    refreshCoverageOnContext(ctx);
  }
};

const trimSynthesizedClueText = (text: string): string =>
  String(text ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^[,;:\- ]+|[,;:\- ]+$/g, "");

const toSentenceCase = (text: string): string => {
  const trimmed = trimSynthesizedClueText(text);
  if (!trimmed) return "";
  const sentence = `${trimmed.charAt(0).toUpperCase()}${trimmed.slice(1)}`;
  return /[.!?]$/.test(sentence) ? sentence : `${sentence}.`;
};

const lowerFirstSentence = (text: string): string => {
  const trimmed = trimSynthesizedClueText(text).replace(/[.!?]+$/, "");
  if (!trimmed) return "";
  return `${trimmed.charAt(0).toLowerCase()}${trimmed.slice(1)}`;
};

const normalizeGroundedClueSentence = (rawText: string, fallback: string): string => {
  const normalized = trimSynthesizedClueText(rawText);
  if (!normalized) return toSentenceCase(fallback);

  const useToRevealMatch = normalized.match(
    /^(?:use|trace|follow|check|highlight|present|recreate)\s+(.+?)\s+to\s+(?:prove|show|reveal|demonstrate|confirm|highlight)\s+(.+)$/i,
  );
  if (useToRevealMatch) {
    return toSentenceCase(`${useToRevealMatch[1]} indicate ${useToRevealMatch[2]}`);
  }

  const matchWithMatch = normalized.match(/^(?:match|compare)\s+(.+?)\s+with\s+(.+)$/i);
  if (matchWithMatch) {
    return toSentenceCase(`${matchWithMatch[1]} align with ${matchWithMatch[2]}`);
  }

  const trapRevealMatch = normalized.match(
    /^(?:a |the )?(?:controlled )?(?:trap|test|confrontation|experiment)\s+(?:reveals|shows|highlights|proves|confirms)\s+(.+)$/i,
  );
  if (trapRevealMatch) {
    return toSentenceCase(trapRevealMatch[1]);
  }

  const beforeTestMatch = normalized.match(/^before the (?:discriminating )?test,?\s*(.+)$/i);
  if (beforeTestMatch) {
    return toSentenceCase(beforeTestMatch[1]);
  }

  return toSentenceCase(normalized);
};

/**
 * Checks the three structural invariants that the LLM cannot reliably verify:
 *   1. All discriminating_test.evidence_clues IDs are present in early|mid placement
 *   2. Each inference step has ≥1 essential early|mid clue (by supportsInferenceStep)
 *   3. Each non-culprit suspect has ≥1 elimination clue
 *
 * Returns a StructuralAuditResult that drives escalation and is injected into the
 * Agent 6 developer context so the LLM audits only narrative quality.
 */
export const runDeterministicStructuralAudit = (
  cml: CaseData,
  clues: { clues?: Array<{ id?: string; placement?: string; criticality?: string; supportsInferenceStep?: number; description?: string; pointsTo?: string; evidenceType?: string }> },
): StructuralAuditResult => {
  const caseBlock = caseOf(cml) ?? {};
  const clueList = Array.isArray(clues?.clues) ? clues.clues : [];

  const gaps: StructuralGap[] = [];

  // ── Check 1: discriminating_test.evidence_clues present in early|mid ────────
  const evidenceClueIds: string[] = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? (caseBlock.discriminating_test.evidence_clues as unknown[])
        .map((id) => String(id ?? "").trim())
        .filter(Boolean)
    : [];

  const clueById = new Map(clueList.map((c) => [String(c.id ?? "").trim(), c]));
  const evidenceCluesPresent: string[] = [];
  const evidenceCluesMissing: string[] = [];

  for (const id of evidenceClueIds) {
    const clue = clueById.get(id);
    if (clue && (clue.placement === "early" || clue.placement === "mid")) {
      evidenceCluesPresent.push(id);
    } else {
      evidenceCluesMissing.push(id);
      gaps.push({
        kind: "evidence_clue_missing",
        description: `discriminating_test evidence clue "${id}" is absent from early|mid distribution`,
        clueId: id,
      });
    }
  }

  // ── Check 2: each inference step has ≥1 essential early|mid clue ────────────
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];

  const stepsCovered: number[] = [];
  const stepsUncovered: number[] = [];

  // A_53 P10 (backstop-and-parity-bridge-recompute-clue-scans): build a single Set of steps covered by
  // an essential early|mid clue in ONE pass over the clues, instead of an O(clues) `some(...)` scan per
  // step (O(steps×clues) every audit, run multiple times per generation).
  const coveredStepNumbers = new Set<number>();
  for (const c of clueList) {
    if (
      c.criticality === "essential" &&
      (c.placement === "early" || c.placement === "mid")
    ) {
      const step = Number(c.supportsInferenceStep);
      if (Number.isFinite(step)) coveredStepNumbers.add(step);
    }
  }

  for (let i = 0; i < inferenceSteps.length; i++) {
    const stepNumber = i + 1;
    const hasEarlyMidEssential = coveredStepNumbers.has(stepNumber);
    if (hasEarlyMidEssential) {
      stepsCovered.push(stepNumber);
    } else {
      stepsUncovered.push(stepNumber);
      gaps.push({
        kind: "inference_step_uncovered",
        description: `Inference step ${stepNumber} has no essential early|mid clue (supportsInferenceStep=${stepNumber})`,
        stepNumber,
      });
    }
  }

  // ── Check 3: each non-culprit has ≥1 eliminating clue ───────────────────────
  const culprits = new Set(
    Array.isArray(caseBlock?.culpability?.culprits)
      ? (caseBlock.culpability.culprits as unknown[])
          .map((c) => String(c ?? "").trim().toLowerCase())
          .filter(Boolean)
      : [],
  );
  const castList = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  // A6-D03: the detective and the victim are not suspects to clear. They were counted, so the detective sat in
  // eliminationMissing on every golden bundle. The same predicates Agent 9's computeEliminationSuspects uses,
  // so the audit and the elimination injector agree on WHO must be cleared (report-only: the gap is advisory).
  const nonCulprits = castList
    .filter((c) => !roleTextsOf(c).some(isDetectiveArchetype) && !roleTextsOf(c).some(isVictimArchetype))
    .map((c) => String(c?.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.has(name.toLowerCase()));

  const eliminationPresent: string[] = [];
  const eliminationMissing: string[] = [];

  for (const name of nonCulprits) {
    const hasElimination = clueList.some((c) => {
      const desc = String(c.description ?? "").toLowerCase();
      const pointsTo = String(c.pointsTo ?? "").toLowerCase();
      // A_53 P4 (Pattern D): word-boundary/surname match, not substring — "Ann" must not match "Joanna".
      const isAboutSuspect = nameAppearsAsWord(name, desc) || nameAppearsAsWord(name, pointsTo);
      const isEliminatory =
        c.evidenceType === "elimination" ||
        pointsTo.includes("eliminat") ||
        pointsTo.includes("rules out") ||
        pointsTo.includes("clears") ||
        pointsTo.includes("alibis") ||
        pointsTo.includes("cannot have");
      return isAboutSuspect && isEliminatory;
    });
    if (hasElimination) {
      eliminationPresent.push(name);
    } else {
      eliminationMissing.push(name);
      // Elimination gaps are advisory — they don't block escalation by themselves
      // because the backstop system handles them. Only add to gaps if we have zero eliminations.
    }
  }

  // A_53 P5 (structural-audit-elimination-all-or-nothing): the old check only fired when ZERO
  // non-culprits had an elimination clue — a single elimination silenced the gap for the other N.
  // Flag when fewer than a minimum FRACTION are eliminated, and always surface the missing names.
  // (Advisory: elimination_missing is filtered out of blockingGaps below — this only sharpens the
  // signal the backstop/telemetry sees, never aborts.)
  if (nonCulprits.length > 0) {
    const MIN_ELIMINATED_FRACTION = 0.5;
    const eliminatedFraction = eliminationPresent.length / nonCulprits.length;
    if (eliminatedFraction < MIN_ELIMINATED_FRACTION) {
      gaps.push({
        kind: "elimination_missing",
        description:
          `Only ${eliminationPresent.length}/${nonCulprits.length} non-culprit suspect(s) have elimination clues ` +
          `(missing: ${eliminationMissing.join(", ")})`,
      });
    }
  }

  // ── Check 4: at least one evidence clue explicitly names the culprit in pointsTo (advisory) ───
  if (evidenceClueIds.length > 0 && culprits.size > 0) {
    const culpritList = [...culprits];
    const anyCulpritPointing = evidenceClueIds.some((id) => {
      const clue = clueById.get(id);
      if (!clue) return false;
      const pointsTo = String(clue.pointsTo ?? "").toLowerCase();
      // A_53 P4 (Pattern D): word-boundary/surname match, not substring.
      return culpritList.some((culprit) => nameAppearsAsWord(culprit, pointsTo));
    });
    if (!anyCulpritPointing) {
      gaps.push({
        kind: "culprit_exclusivity_missing",
        description: `No discriminating_test evidence clue has pointsTo text naming the culprit (${culpritList.join(", ")}). At least one evidence clue must explicitly link unique access or physical proof to the culprit.`,
      });
    }
  }

  // `passed` reflects only blocking structural gaps (evidence_clue_missing, inference_step_uncovered).
  // elimination_missing and culprit_exclusivity_missing are advisory — they do not trigger escalation.
  const blockingGaps = gaps.filter((g) => g.kind !== "elimination_missing" && g.kind !== "culprit_exclusivity_missing");

  return {
    passed: blockingGaps.length === 0,
    gaps,
    evidenceCluesPresent,
    evidenceCluesMissing,
    stepsCovered,
    stepsUncovered,
    eliminationPresent,
    eliminationMissing,
  };
};

/**
 * Recompute the coverage snapshot over the context's current clues and store it on the context. A6-04:
 * four copies of these three lines (two here, the structural retry, the end of runAgent6).
 */
export const refreshCoverageOnContext = (ctx: OrchestratorContext): void => {
  if (!ctx.cml || !ctx.clues) return;
  const snapshot = recomputeCoverageSnapshotForAgent6(ctx.cml, ctx.clues);
  ctx.coverageResult = snapshot.coverageResult;
  ctx.allCoverageIssues = snapshot.allCoverageIssues;
};

export const ensureParityBridgeClue = (cml: CaseData, clues: any): string | null => {
  const caseBlock = caseOf(cml) ?? {};
  const discrimDesign = String(caseBlock?.discriminating_test?.design ?? "").trim();
  const discrimKnowledge = String(caseBlock?.discriminating_test?.knowledge_revealed ?? "").trim();
  if (!discrimDesign && !discrimKnowledge) return null;

  const sourceText = `${discrimDesign} ${discrimKnowledge}`.toLowerCase();
  const sourceTokens = sourceText
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length >= 5);
  if (sourceTokens.length === 0) return null;

  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];

  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  const earlyMidEssential = clueList.filter(
    (clue) => clue?.criticality === "essential" && (clue?.placement === "early" || clue?.placement === "mid"),
  );
  const earlyEssential = clueList.filter(
    (clue) => clue?.criticality === "essential" && clue?.placement === "early",
  );

  const hasEarlyParityBridge = earlyEssential.some((clue) => {
    const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
    return sourceTokens.some((token) => text.includes(token));
  });
  if (hasEarlyParityBridge) return null;

  const template = earlyMidEssential[0] ?? clueList.find((clue) => clue?.criticality === "essential") ?? clueList[0];
  if (!template) return null;

  const existingIds = new Set(
    clueList.map((clue) => String(clue?.id ?? "").trim()).filter((id) => id.length > 0),
  );
  let candidateId = "clue_parity_bridge";
  let suffix = 2;
  while (existingIds.has(candidateId)) {
    candidateId = `clue_parity_bridge_${suffix}`;
    suffix += 1;
  }

  const selectBridgeSource = (): { sourceInCML: string; supportsInferenceStep: number; evidenceType: string } => {

    for (let i = 0; i < inferenceSteps.length; i += 1) {
      const step = inferenceSteps[i] ?? {};
      const correction = String(step?.correction ?? "").trim();
      const observation = String(step?.observation ?? "").trim();
      const correctionText = correction.toLowerCase();
      const observationText = observation.toLowerCase();
      const correctionMatches = correctionText.length > 0 && sourceTokens.some((token) => correctionText.includes(token));
      if (correctionMatches) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].correction`,
          supportsInferenceStep: i + 1,
          evidenceType: "contradiction",
        };
      }
      const observationMatches = observationText.length > 0 && sourceTokens.some((token) => observationText.includes(token));
      if (observationMatches) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].observation`,
          supportsInferenceStep: i + 1,
          evidenceType: "observation",
        };
      }
    }

    for (let i = 0; i < inferenceSteps.length; i += 1) {
      const step = inferenceSteps[i] ?? {};
      const correction = String(step?.correction ?? "").trim();
      if (correction.length > 0) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].correction`,
          supportsInferenceStep: i + 1,
          evidenceType: "contradiction",
        };
      }
      const observation = String(step?.observation ?? "").trim();
      if (observation.length > 0) {
        return {
          sourceInCML: `CASE.inference_path.steps[${i}].observation`,
          supportsInferenceStep: i + 1,
          evidenceType: "observation",
        };
      }
    }

    return {
      sourceInCML: "CASE.discriminating_test.evidence_clues[0]",
      supportsInferenceStep: 1,
      evidenceType: "observation",
    };
  };

  const bridgeSource = selectBridgeSource();
  const bridgeStatement = normalizeGroundedClueSentence(
    discrimKnowledge || discrimDesign,
    "Concrete case evidence points to a mechanism detail already present in the file.",
  );

  const bridgeDescription = bridgeStatement;
  const bridgePointsTo = toSentenceCase(
    `Connects the earlier evidence to the conclusion that ${lowerFirstSentence(bridgeStatement)}`,
  );

  clueList.push({
    ...template,
    id: candidateId,
    sourceInCML: bridgeSource.sourceInCML,
    description: bridgeDescription,
    pointsTo: bridgePointsTo,
    placement: "early",
    criticality: "essential",
    evidenceType: bridgeSource.evidenceType,
    supportsInferenceStep: bridgeSource.supportsInferenceStep,
  });

  appendToClueTimeline(clues, candidateId, "early");

  return candidateId;
};

export const ensureCriticalFairPlayBackstopClues = (cml: CaseData, clues: any): string[] => {
  const caseBlock = caseOf(cml) ?? {};
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  const clueList: Clue[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (inferenceSteps.length === 0 || clueList.length === 0) return [];

  const repairs: string[] = [];
  const { timeline, nextId } = openClueSynthesis(clues, clueList);

  const template = clueList.find((clue) => clue?.criticality === "essential") ?? clueList[0];
  if (!template) return repairs;

  // A_53 P10 (backstop-and-parity-bridge-recompute-clue-scans): index early|mid essential clues by
  // supportsInferenceStep ONCE, then keep it in sync as backstop clues are pushed — instead of two
  // O(clues) `clueList.some(...)` scans per step (O(steps×clues) every call, 5–8×/run on data that
  // only grows incrementally). The index is the source of truth for per-step membership below.
  const earlyMidEssentialByStep = new Map<number, Clue[]>();
  const indexClueForStep = (clue: Clue): void => {
    const isEarlyMidEssential =
      clue?.criticality === "essential"
      && (clue?.placement === "early" || clue?.placement === "mid");
    if (!isEarlyMidEssential) return;
    const step = Number(clue?.supportsInferenceStep);
    if (!Number.isFinite(step)) return;
    const bucket = earlyMidEssentialByStep.get(step);
    if (bucket) bucket.push(clue);
    else earlyMidEssentialByStep.set(step, [clue]);
  };
  for (const clue of clueList) indexClueForStep(clue);
  const isContradiction = (clue: Clue): boolean =>
    String(clue?.evidenceType ?? "").toLowerCase() === "contradiction";
  /** Push a minted backstop clue, index it for its step, and file it under its placement. */
  const pushBackstopClue = (clue: any): void => {
    clueList.push(clue);
    indexClueForStep(clue); // A_53 P10: keep the per-step index in sync incrementally
    (clue.placement === "early" ? timeline.early : timeline.mid).push(clue.id);
  };

  for (let i = 0; i < inferenceSteps.length; i += 1) {
    const stepNumber = i + 1;
    const stepBucket = earlyMidEssentialByStep.get(stepNumber) ?? [];
    let hasEarlyMidEssentialForStep = stepBucket.length > 0;
    let hasEarlyMidContradictionForStep = stepBucket.some(isContradiction);

    const step = inferenceSteps[i] ?? {};
    const observation = String(step?.observation ?? "").trim();
    const correction = String(step?.correction ?? "").trim();
    const effect = String(step?.effect ?? "").trim();
    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.map((e) => String(e ?? "").trim()).filter(Boolean)
      : [];
    const firstRequiredEvidenceText = requiredEvidence.find(
      (entry: string) => !/^CASE\./.test(entry) && /[\s,.;:]/.test(entry),
    ) ?? "";

    const preferredEvidencePath = requiredEvidence.find((entry: string) => /^CASE\./.test(entry));
    const sourceInCML = preferredEvidencePath || (correction
      ? `CASE.inference_path.steps[${i}].correction`
      : `CASE.inference_path.steps[${i}].observation`);

    const description = normalizeGroundedClueSentence(
      observation || firstRequiredEvidenceText || correction || effect,
      "A concrete case detail surfaces in the shared evidence.",
    );
    const pointsTo = normalizeGroundedClueSentence(
      correction || effect || firstRequiredEvidenceText || observation,
      "Concrete case evidence narrows suspect possibilities.",
    );

    const clueId = nextId(`clue_fp_backstop_step_${stepNumber}`);
    const placement = stepNumber <= 2 ? "early" : "mid";

    if (!hasEarlyMidEssentialForStep) {
      const evidenceType = correction ? "contradiction" : "observation";
      const essentialClue = {
        ...template,
        id: clueId,
        sourceInCML,
        description,
        pointsTo,
        placement,
        criticality: "essential",
        evidenceType,
        supportsInferenceStep: stepNumber,
      };
      pushBackstopClue(essentialClue);

      repairs.push(`added ${clueId} as ${placement} essential clue for inference step ${stepNumber}`);
      hasEarlyMidEssentialForStep = true;
      if (evidenceType === "contradiction") {
        hasEarlyMidContradictionForStep = true;
      }
    }

    if (hasEarlyMidContradictionForStep) continue;
    // A6-D08 (owner decision 12, CML_VERIFIED_FIXES): with no correction there is nothing for a
    // contradiction to state — the clue below was minted from the same observation/effect text as the
    // observation clue, a duplicate labelled "contradiction". Do not add it.
    if (verifiedFixesEnabled() && !correction) continue;

    const contradictionId = nextId(`clue_fp_contradiction_step_${stepNumber}`);
    const contradictionSource = correction
      ? `CASE.inference_path.steps[${i}].correction`
      : `CASE.inference_path.steps[${i}].observation`;
    const contradictionDescription = normalizeGroundedClueSentence(
      observation || firstRequiredEvidenceText || correction || effect,
      "A concrete case detail undercuts the false account.",
    );
    const contradictionPointsTo = normalizeGroundedClueSentence(
      correction || effect || firstRequiredEvidenceText || observation,
      "Concrete case evidence overturns the false account.",
    );

    const contradictionClue = {
      ...template,
      id: contradictionId,
      sourceInCML: contradictionSource,
      description: contradictionDescription,
      pointsTo: contradictionPointsTo,
      placement,
      criticality: "essential",
      evidenceType: "contradiction",
      supportsInferenceStep: stepNumber,
    };
    pushBackstopClue(contradictionClue);

    repairs.push(`added ${contradictionId} as ${placement} essential contradiction clue for inference step ${stepNumber}`);
  }

  return repairs;
};
