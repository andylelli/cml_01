/**
 * Agent 5 phases: per-suspect coverage, the red-herring floor, and red-herring separation from the true
 * solution, with their deterministic backstops. Moved from agent5-run.ts (code review A5-01 / CR-25), which
 * re-exports what it exported.
 */
import { escapeRegExp as escapeRegex } from "@cml/cml";
import { openClueSynthesis } from "../../clue-contracts/synthesis.js";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type OrchestratorContext,
  applyClueGuardrails,
} from "../shared.js";
import {
  RedHerringOverlapDetail,
  analyzeSuspectCoverage,
  buildStrictSourcePathWhitelist,
  findRedHerringOverlapDetails,
  getCaseBlock,
  isOverlapCandidateToken,
  normalizeTokens,
  replaceDigitTimesWithEraWords,
  toClueIdSlug,
  validateSourcePath,
} from "../../clue-contracts/contracts.js";
import {
  Agent5Run,
  Agent5State,
} from "./run-state.js";
import {
  RED_HERRING_BUDGET,
} from "./extraction.js";
import { verifiedFixesEnabled } from "@cml/cml";
import { buildAgent5RegenerationContract } from "./contract-payload.js";

type TemporalLexicalCollisionResult = {
  detected: boolean;
  forbiddenTerms: string[];
  allowedTerms: string[];
  explanation: string;
};

const RED_HERRING_FLOOR = 1;

/**
 * The floor decision, extracted so the branch is testable without an LLM.
 *
 * `redHerrings` is whatever came back from the model — the array may be absent, null, or a
 * non-array on a malformed response, and every one of those is "no misdirection", not "skip the
 * check". Reads the flag at call time, never at module load
 * (`module-const-flags-frozen-before-dotenv`).
 */
export function assessRedHerringFloor(
  redHerrings: unknown,
  env: NodeJS.ProcessEnv = process.env,
): { enabled: boolean; count: number; needsRepair: boolean; shortOfBudget: boolean } {
  const enabled = !/^(0|off|false|no)$/i.test(env.AGENT5_RED_HERRING_FLOOR ?? "");
  const count = Array.isArray(redHerrings) ? redHerrings.length : 0;
  return {
    enabled,
    count,
    needsRepair: enabled && count < RED_HERRING_FLOOR,
    shortOfBudget: count < RED_HERRING_BUDGET,
  };
}

function detectTemporalLexicalCollision(
  cml: CaseData,
  overlapDetails: RedHerringOverlapDetail[],
): TemporalLexicalCollisionResult {
  const caseBlock = getCaseBlock(cml);
  const falseAssumptionType = String(caseBlock?.false_assumption?.type ?? "").toLowerCase();
  if (falseAssumptionType !== "temporal") {
    return {
      detected: false,
      forbiddenTerms: [],
      allowedTerms: [],
      explanation: "False assumption is not temporal; lexical collision detector not activated.",
    };
  }

  const toTokenSet = (text: string): Set<string> =>
    new Set(
      String(text ?? "")
        .toLowerCase()
        .split(/\s+/)
        .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
        .filter((w: string) => isOverlapCandidateToken(w)),
    );

  const correctionTokenSet = new Set<string>();
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (const step of steps) {
    const tokens = toTokenSet(String(step?.correction ?? ""));
    for (const token of tokens) correctionTokenSet.add(token);
  }

  const assumptionText = `${String(caseBlock?.false_assumption?.statement ?? "")} ${String(caseBlock?.false_assumption?.why_it_seems_reasonable ?? "")}`;
  const assumptionTokenSet = toTokenSet(assumptionText);
  const intersection = Array.from(assumptionTokenSet).filter((t) => correctionTokenSet.has(t));
  const allowed = Array.from(assumptionTokenSet).filter((t) => !correctionTokenSet.has(t));

  const detected = overlapDetails.length > 0 && intersection.length >= 2;
  return {
    detected,
    forbiddenTerms: intersection.slice(0, 12),
    allowedTerms: allowed.slice(0, 12),
    explanation: detected
      ? `Temporal lexical collision detected: ${intersection.length} shared token(s) between false-assumption and correction lexicons.`
      : "No high-risk temporal lexical collision detected.",
  };
}


export function sanitizeRedHerringOverlap(
  cml: CaseData,
  clues: ClueDistributionResult,
  overlapDetails: RedHerringOverlapDetail[],
  preferredTerms: string[] = [],
): string[] {
  const repairs: string[] = [];
  if (!Array.isArray(clues.redHerrings) || overlapDetails.length === 0) return repairs;

  const caseBlock = getCaseBlock(cml);
  const protectedNameTokens = new Set<string>();
  const castEntries = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  castEntries.forEach((entry: any) => {
    normalizeTokens(String(entry?.name ?? ""))
      .filter((token) => token.length > 2)
      .forEach((token) => protectedNameTokens.add(token));
  });
  // Build correction token set so we never introduce a replacement that is itself
  // an inference-correction word (e.g. "witness", "timing" from "witness accounts").
  const correctionTokensForSanitizer = new Set<string>();
  const inferenceStepsForSanitizer = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  for (const step of inferenceStepsForSanitizer) {
    String(step?.correction ?? "")
      .toLowerCase()
      .split(/\s+/)
      .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w: string) => isOverlapCandidateToken(w))
      .forEach((w: string) => correctionTokensForSanitizer.add(w));
  }
  const assumptionTokens = `${String(caseBlock?.false_assumption?.statement ?? "")} ${String(caseBlock?.false_assumption?.why_it_seems_reasonable ?? "")}`
    .toLowerCase()
    .split(/\s+/)
    .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
    .filter((w: string) => isOverlapCandidateToken(w));
  const replacementCandidates = [...new Set([
    ...preferredTerms.map((t) => String(t ?? "").toLowerCase().trim()).filter((t) => isOverlapCandidateToken(t)),
    ...assumptionTokens,
    "timing",
    "witness",
    "reported",
  ])];
  // Exclude any candidate that appears in correction token set — using it as a
  // replacement would simply re-trigger the overlap gate on the next check.
  const filteredReplacements = replacementCandidates.filter((t) => !correctionTokensForSanitizer.has(t));
  // Absolute fallback terms: neutral words very unlikely to appear in mystery inference corrections.
  const replacementPool = filteredReplacements.length > 0
    ? filteredReplacements
    : ["ostensible", "purported", "apparent", "rumoured"];

  let replacementIndex = 0;
  for (const detail of overlapDetails) {
    const target = clues.redHerrings.find((rh: any) => String(rh?.id ?? "").trim() === detail.redHerringId) as any;
    if (!target) continue;

    const originalDescription = String(target.description ?? "");
    const originalMisdirection = String(target.misdirection ?? "");
    let nextDescription = originalDescription;
    let nextMisdirection = originalMisdirection;

    for (const term of detail.matchedCorrectionWords) {
      const safeTerm = String(term ?? "").trim().toLowerCase();
      if (!safeTerm) continue;
      if (protectedNameTokens.has(safeTerm)) continue;
      const replacement = replacementPool[replacementIndex % replacementPool.length] || "timing";
      replacementIndex += 1;
      const re = new RegExp(`\\b${escapeRegex(safeTerm)}\\b`, "gi");
      nextDescription = nextDescription.replace(re, replacement);
      nextMisdirection = nextMisdirection.replace(re, replacement);
    }

    if (nextDescription !== originalDescription || nextMisdirection !== originalMisdirection) {
      target.description = nextDescription;
      target.misdirection = nextMisdirection;
      repairs.push(`${detail.redHerringId}: sanitized overlap terms in description/misdirection`);
    }
  }

  return repairs;
}

export function pruneOverlappingRedHerrings(
  clues: ClueDistributionResult,
  redHerringIds: string[],
): string[] {
  if (!Array.isArray(clues.redHerrings) || redHerringIds.length === 0) return [];

  const toDrop = new Set(redHerringIds.map((id) => String(id ?? "").trim()).filter(Boolean));
  if (toDrop.size === 0) return [];

  const removed: string[] = [];
  clues.redHerrings = clues.redHerrings.filter((rh: any) => {
    const id = String(rh?.id ?? "").trim();
    const keep = !toDrop.has(id);
    if (!keep && id) removed.push(id);
    return keep;
  });

  return removed;
}

function synthesizeSuspectCoverageBackstopClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  suspects: string[],
): string[] {
  const targetSuspects = [...new Set(suspects.map((name) => String(name ?? "").trim()).filter(Boolean))];
  if (targetSuspects.length === 0) return [];

  const caseBlock = getCaseBlock(cml);
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (clueList.length === 0) return [];

  const { timeline, nextId } = openClueSynthesis(clues, clueList);

  const template = clueList.find((clue) => String(clue?.criticality ?? "").toLowerCase() === "essential") ?? clueList[0];
  if (!template) return [];

  const repairs: string[] = [];

  for (const suspectName of targetSuspects) {
    const suspectIndex = cast.findIndex((entry: any) => String(entry?.name ?? "").trim() === suspectName);
    const suspect = suspectIndex >= 0 ? cast[suspectIndex] : undefined;

    const sourceCandidates = [
      suspectIndex >= 0 ? `CASE.cast[${suspectIndex}].alibi_window` : "",
      suspectIndex >= 0 ? `CASE.cast[${suspectIndex}].access_plausibility` : "",
      `CASE.constraint_space.access.actors[0]`,
      `CASE.constraint_space.time.anchors[0]`,
    ].filter((entry): entry is string => Boolean(entry));

    const sourceInCML = sourceCandidates.find((path) => validateSourcePath(cml, path))
      || buildStrictSourcePathWhitelist(cml)[0]
      || "CASE.inference_path.steps[0].observation";

    const suspectAlibi = String(suspect?.alibi_window ?? "").trim();
    const fallbackDescription = `A corroborated timeline detail places ${suspectName} away from the decisive mechanism window.`;
    const description = replaceDigitTimesWithEraWords(suspectAlibi || fallbackDescription);
    const pointsTo = `Eliminates ${suspectName} because independent corroboration places ${suspectName} away from the decisive mechanism window.`;

    const clueId = nextId(`clue_fp_elimination_${toClueIdSlug(suspectName)}`);
    clueList.push({
      ...template,
      id: clueId,
      sourceInCML,
      description,
      pointsTo,
      placement: "mid",
      criticality: "essential",
      evidenceType: "elimination",
    });
    timeline.mid.push(clueId);
    repairs.push(`added ${clueId} as deterministic elimination backstop for ${suspectName}`);
  }

  return repairs;
}

export async function enforceSuspectCoverage(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult) {
  const initialSuspectCoverage = analyzeSuspectCoverage(ctx.cml!, clues);
  const suspectsNeedingCoverage = [...new Set([
    ...initialSuspectCoverage.uncovered,
    ...initialSuspectCoverage.weakElimination,
  ])];
  if (suspectsNeedingCoverage.length > 0) {
    const attemptLabel = "retry 1";
    if (initialSuspectCoverage.uncovered.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.uncovered.length} suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.uncovered.length} suspect(s) (${initialSuspectCoverage.uncovered.join(", ")}) are never referenced in any clue`
      );
      initialSuspectCoverage.uncovered.forEach((suspect) => {
        ctx.warnings.push(`    • ${suspect}: referenced clue IDs: (none)`);
      });
    }
    if (initialSuspectCoverage.weakElimination.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.weakElimination.length} suspect(s) are named but lack elimination/alibi evidence; regenerating targeted clues`
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.weakElimination.length} suspect(s) (${initialSuspectCoverage.weakElimination.join(", ")}) are referenced but lack elimination/alibi evidence`
      );
      initialSuspectCoverage.records
        .filter((r) => initialSuspectCoverage.weakElimination.includes(r.suspect))
        .forEach((r) => {
          const refs = r.referencedClueIds.length > 0 ? r.referencedClueIds.join(", ") : "(none)";
          ctx.warnings.push(`    • ${r.suspect}: referenced clue IDs: ${refs}; elimination clues: (none); alibi clues: (none)`);
        });
    }


    const suspectBackstopRepairs = synthesizeSuspectCoverageBackstopClues(ctx.cml!, clues, suspectsNeedingCoverage);
    suspectBackstopRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 suspect-coverage deterministic synthesis: ${repair}`)
    );
  }
  return clues;
}

export async function enforceRedHerringFloor(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult) {
  const redHerringFloor = assessRedHerringFloor(clues.redHerrings);
  const redHerringCount = redHerringFloor.count;
  if (redHerringFloor.needsRepair) {
    ctx.warnings.push(
      `Agent 5 red-herring floor: ${redHerringCount} red herring(s) against a budget of ${RED_HERRING_BUDGET} — ` +
      `a mystery with no misdirection has no false trail for the reader to follow`
    );

    // FOUND BY AUDIT 2026-08-03 — this read `if (llmRetriesEnabled)`, and
    // `AGENT5_ENABLE_LLM_RETRIES` is DEFAULT-OFF ("deterministic remediation mode active — LLM retry
    // loops disabled by default"). So A_71's floor detected the shortfall, logged it, and **never
    // attempted the one bounded regeneration it was built to make**: on run mystery-1785694688534 the
    // story shipped with ZERO red herrings and no misdirection. It was a detector wearing the name of
    // a floor, and the earlier run's 2 red herrings were the model's own output, not a repair.
    //
    // A_71 §4 gave this pass its OWN off-switch (`AGENT5_RED_HERRING_FLOOR=false`) precisely so it
    // would work on default config; deferring to the global retry flag defeated that design. The
    // floor now governs its own repair — still exactly one bounded attempt, still no abort path, and
    // still no deterministic synthesis (a fabricated red herring is the template-injection class
    // A_67/A_68 spent two boards removing).
    if (redHerringFloor.enabled) {
      const redHerringFloorStart = Date.now();
      state.agent5RetryInvoked = true;
      ctx.reportProgress("clues", "Regenerating clues to restore red herrings...", 60);
      const beforeCount = redHerringCount;
      clues = await run.extractWithAttempt({
        cml: ctx.cml!,
        clueDensity: run.clueDensity,
        redHerringBudget: RED_HERRING_BUDGET,
        fairPlayFeedback: run.mergeStrictPromptFeedback({
          overallStatus: "fail",
          violations: [
            {
              severity: "critical" as const,
              rule: "Red Herring Budget",
              description: `The previous response returned ${beforeCount} red herring(s); ${RED_HERRING_BUDGET} were requested. ` +
                `Without them the reader has no plausible wrong answer to be drawn toward.`,
              suggestion: `Populate redHerrings[] with ${RED_HERRING_BUDGET} entries that each support the false assumption ` +
                `and point at a non-culprit, without reusing correction language from the true solution.`,
            },
          ],
          warnings: [],
          recommendations: [
            "Every red herring must support the false assumption, never the true solution",
            "A red herring should make an innocent suspect look plausible on the evidence available at that point",
            "Red herrings are separate from clues — populate redHerrings[], do not relabel existing clues",
          ],
        }),
        runId: ctx.runId,
        projectId: ctx.projectId || "",
        // A5-11 / A5-D04 (owner decision 12, CML_VERIFIED_FIXES): the first pass's strict contract and
        // locked facts, which this regeneration used to omit.
        ...(verifiedFixesEnabled() ? buildAgent5RegenerationContract(ctx, run.strictPromptFeedbackBase) : {}),
      });
      ctx.agentCosts["agent5_clues"] = clues.cost; // cumulative byAgent total (A_53 P3) — assign, never add (CR-06 / ORC-D03)
      ctx.agentDurations["agent5_clues"] =
        (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - redHerringFloorStart);

      const postFloorGuardrails = applyClueGuardrails(ctx.cml!, clues);
      postFloorGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Post-red-herring-floor guardrail auto-fix: ${fix}`)
      );

      const afterCount = Array.isArray(clues.redHerrings) ? clues.redHerrings.length : 0;
      ctx.warnings.push(
        afterCount >= RED_HERRING_FLOOR
          ? `Agent 5 red-herring floor: restored ${afterCount} red herring(s) after regeneration`
          : `Agent 5 red-herring floor still unmet after regeneration (${afterCount}); continuing — the story ships without misdirection`
      );
    }
  } else if (redHerringFloor.enabled && redHerringFloor.shortOfBudget) {
    // Above the floor but under budget: worth a number, not worth an LLM call.
    ctx.warnings.push(
      `Agent 5 red-herring budget: ${redHerringCount}/${RED_HERRING_BUDGET} red herrings (above the floor; not regenerated)`
    );
  }
  return clues;
}

/**
 * A5-D05 (owner decision 12, CML_VERIFIED_FIXES): `enforceSuspectCoverage` adds deterministic backstop
 * clues, and the red-herring floor's regeneration then REPLACES the whole clue set, discarding them —
 * suspect coverage was never re-run. Flag ON: when the floor regenerated, re-run it on the new clues.
 * Flag OFF: exactly `enforceRedHerringFloor`.
 */
export async function enforceRedHerringFloorKeepingCoverage(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult) {
  const beforeFloor = clues;
  const afterFloor = await enforceRedHerringFloor(ctx, run, state, clues);
  if (verifiedFixesEnabled() && afterFloor !== beforeFloor) {
    return enforceSuspectCoverage(ctx, run, state, afterFloor);
  }
  return afterFloor;
}

export async function separateRedHerringsFromSolution(ctx: OrchestratorContext, run: Agent5Run, state: Agent5State, clues: ClueDistributionResult) {
  const initialRedHerringOverlapDetails = findRedHerringOverlapDetails(ctx.cml!, clues);
  if (initialRedHerringOverlapDetails.length > 0) {
    const initialRedHerringOverlapIds = initialRedHerringOverlapDetails.map((d) => d.redHerringId);
    ctx.warnings.push(
      `Agent 5: ${initialRedHerringOverlapIds.length} red herring(s) overlap true-solution signals; regenerating for separation`
    );
    ctx.warnings.push(`  - Overlapping red herring id(s): ${initialRedHerringOverlapIds.join(", ")}`);
    initialRedHerringOverlapDetails.forEach((detail) => {
      ctx.warnings.push(
        `    • ${detail.redHerringId} -> inference steps ${detail.matchedStepIndexes.join(", ")} via words: ${detail.matchedCorrectionWords.slice(0, 8).join(", ")}`
      );
    });

    const temporalCollision = detectTemporalLexicalCollision(ctx.cml!, initialRedHerringOverlapDetails);
    if (temporalCollision.detected) {
      ctx.warnings.push(`Agent 5: ${temporalCollision.explanation}`);
      if (temporalCollision.forbiddenTerms.length > 0) {
        ctx.warnings.push(`  - forbidden red-herring terms: ${temporalCollision.forbiddenTerms.join(", ")}`);
      }
      if (temporalCollision.allowedTerms.length > 0) {
        ctx.warnings.push(`  - preferred false-assumption-only terms: ${temporalCollision.allowedTerms.join(", ")}`);
      }
    }

    const overlapRepairs = sanitizeRedHerringOverlap(
      ctx.cml!,
      clues,
      initialRedHerringOverlapDetails,
      temporalCollision.allowedTerms
    );
    overlapRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 red-herring deterministic sanitizer: ${repair}`)
    );

    const severePostSanitize = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
    if (severePostSanitize.length > 0) {
      const overlapIds = severePostSanitize.map((d) => d.redHerringId);
      const pruned = pruneOverlappingRedHerrings(clues, overlapIds);
      if (pruned.length > 0) {
        ctx.warnings.push(
          `Agent 5 red-herring overlap hardening: pruned persistently overlapping red herring(s) (${pruned.join(", ")})`
        );
      }

      const remainingSevere = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
      if (remainingSevere.length > 0) {
        run.failAgent5(
          `Agent 5 red-herring overlap gate failed after deterministic sanitization. Overlapping red herring(s): ${remainingSevere.map((d) => d.redHerringId).join(", ")}`,
          "red_herring_overlap",
        );
      }
    }

    const remainingMinor = findRedHerringOverlapDetails(ctx.cml!, clues);
    if (remainingMinor.length > 0) {
      ctx.warnings.push(
        `Agent 5: minor red-herring overlap remains after deterministic sanitization (${remainingMinor.map((d) => d.redHerringId).join(", ")}); continuing with warning`
      );
    }
  }
  return clues;
}
