/**
 * Agent 5 clue contracts — suspect coverage and elimination. Split from agent5-contracts.ts (code review
 * A5-05), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseCastMember, CaseData } from "@cml/cml";
import { caseOf } from "@cml/cml";
import {
  type ClueGuardrailIssue,
} from "../agents/shared.js";
import {
  nameAppearsInText,
  normalizeTokens,
} from "./clue-time.js";

type SuspectCoverageRecord = {
  suspect: string;
  directReferences: number;
  eliminationLike: number;
  alibiLike: number;
  referencedClueIds: string[];
  eliminationClueIds: string[];
  alibiClueIds: string[];
};

type SuspectCoverageAnalysis = {
  records: SuspectCoverageRecord[];
  uncovered: string[];
  weakElimination: string[];
};

const isEliminationLike = (text: string): boolean =>
  /\b(ruled\s+out|eliminat\w*|cleared|innocent|not\s+the\s+(?:culprit|killer|murderer)|exclud\w*)\b/i.test(text);

const isAlibiLike = (text: string): boolean =>
  /\b(alibi|elsewhere|seen\s+in\s+a\s+different\s+location|could\s+not\s+have|was\s+with|timestamp|confirmed\s+by|corroborat|witness(?:es)?\s+confirm|documented\s+at)\b/i.test(text);

const hasTimeWindow = (text: string): boolean =>
  /\b(from|between|until|before|after|at|during)\b.*\b(o['’]clock|past|to|am|pm|a\.m\.|p\.m\.|\d{1,2}:\d{2})\b/i.test(text)
  || /\b\d{1,2}:\d{2}\b/.test(text);

const hasCorroborator = (text: string): boolean =>
  /\b(witness|witnesses|confirmed\s+by|corroborat|log|receipt|record|document|shopkeeper|butler|porter|testimony)\b/i.test(text);

function buildSuspectCoverage(
  cml: CaseData,
  clues: ClueDistributionResult,
): SuspectCoverageRecord[] {
  const caseBlock = caseOf(cml);
  const castArr = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((n) => String(n ?? "").trim())
    : [];
  const suspects = castArr
    .filter((c) => String(c?.culprit_eligibility ?? "").toLowerCase() === "eligible" && !culprits.includes(String(c?.name ?? "").trim())) // A5-D10: the other two bodies lower-case
    .map((c) => String(c?.name ?? "").trim())
    .filter(Boolean);

  // A_53 P10 (a5-suspect-coverage-recomputed-every-recheck): the cast-name token frequency depends
  // only on the immutable cast array; build it once per cast object instead of per coverage scan.
  const castTokenFrequency = getCastNameTokenFrequencyCached(castArr);

  return suspects.map((suspect: string) => {
    let directReferences = 0;
    let eliminationLike = 0;
    let alibiLike = 0;
    const referencedClueIds: string[] = [];
    const eliminationClueIds: string[] = [];
    const alibiClueIds: string[] = [];
    for (const clue of clues.clues) {
      const clueText = `${String(clue.description ?? "")} ${String(clue.pointsTo ?? "")}`;
      if (!nameAppearsForSuspectCoverage(suspect, clueText, castTokenFrequency)) continue;
      directReferences += 1;
      referencedClueIds.push(String(clue.id ?? "").trim() || "(unknown-id)");
      const evidenceType = String(clue.evidenceType ?? "").toLowerCase();
      const eliminationSignal = isEliminationLike(clueText) || evidenceType === "elimination";
      const alibiSignal = isAlibiLike(clueText)
        || (evidenceType === "elimination" && hasTimeWindow(clueText) && hasCorroborator(clueText));
      if (eliminationSignal) {
        eliminationLike += 1;
        eliminationClueIds.push(String(clue.id ?? "").trim() || "(unknown-id)");
      }
      if (alibiSignal) {
        alibiLike += 1;
        alibiClueIds.push(String(clue.id ?? "").trim() || "(unknown-id)");
      }
    }
    return {
      suspect,
      directReferences,
      eliminationLike,
      alibiLike,
      referencedClueIds,
      eliminationClueIds,
      alibiClueIds,
    };
  });
}

function buildCastNameTokenFrequency(castArr: CaseCastMember[]): Map<string, number> {
  const frequency = new Map<string, number>();
  for (const castMember of castArr) {
    const tokens = normalizeTokens(String(castMember?.name ?? "")).filter((t) => t.length > 2);
    for (const token of tokens) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }
  return frequency;
}

// A_53 P10 (a5-suspect-coverage-recomputed-every-recheck): memoize the cast-name token frequency on
// the cast-array object identity (immutable for a run) so it isn't re-tokenized on every recheck.
const castNameTokenFrequencyCache = new WeakMap<object, Map<string, number>>();

function getCastNameTokenFrequencyCached(castArr: CaseCastMember[]): Map<string, number> {
  if (!Array.isArray(castArr)) return buildCastNameTokenFrequency(castArr);
  const cached = castNameTokenFrequencyCache.get(castArr);
  if (cached) return cached;
  const computed = buildCastNameTokenFrequency(castArr);
  castNameTokenFrequencyCache.set(castArr, computed);
  return computed;
}

function nameAppearsForSuspectCoverage(
  suspectName: string,
  clueText: string,
  castTokenFrequency: Map<string, number>,
): boolean {
  if (nameAppearsInText(suspectName, clueText)) {
    return true;
  }

  // Allow unique-token references (typically surname-only) so fair references
  // are counted even when clues avoid repeating full names verbatim.
  const suspectTokens = normalizeTokens(suspectName).filter((t) => t.length > 2);
  if (suspectTokens.length === 0) {
    return false;
  }
  const uniqueTokens = suspectTokens.filter((token) => (castTokenFrequency.get(token) ?? 0) === 1);
  if (uniqueTokens.length === 0) {
    return false;
  }

  const clueTokens = new Set(normalizeTokens(clueText));
  return uniqueTokens.some((token) => clueTokens.has(token));
}

// A_53 P10 (a5-suspect-coverage-recomputed-every-recheck): the suspect coverage scan is O(suspects ×
// clues × tokenize) and is rebuilt ~10x/run on a clue list that is unchanged between most adjacent
// checks. Cache the analysis on the `clues` object identity, invalidated by a cheap content version
// (the coverage-relevant fields only) and the `cml` identity. When clues mutate (retry/repair) the
// signature changes and the scan re-runs; when it doesn't, the cached result is reused.
const suspectCoverageCache = new WeakMap<object, { signature: string; cml: CaseData; value: SuspectCoverageAnalysis }>();

const buildSuspectCoverageSignature = (clues: ClueDistributionResult): string => {
  const parts: string[] = [];
  for (const clue of clues.clues) {
    parts.push(
      `${String(clue?.id ?? "")}${String(clue?.description ?? "")}${String(clue?.pointsTo ?? "")}${String(clue?.evidenceType ?? "")}`,
    );
  }
  return parts.join("");
};

function computeSuspectCoverage(
  cml: CaseData,
  clues: ClueDistributionResult,
): SuspectCoverageAnalysis {
  const records = buildSuspectCoverage(cml, clues);
  const uncovered = records
    .filter((r) => r.directReferences === 0)
    .map((r) => r.suspect);
  const weakElimination = records
    .filter((r) => r.directReferences > 0 && r.eliminationLike + r.alibiLike === 0)
    .map((r) => r.suspect);
  return { records, uncovered, weakElimination };
}

export function analyzeSuspectCoverage(
  cml: CaseData,
  clues: ClueDistributionResult,
): SuspectCoverageAnalysis {
  // A_53 P10 (a5-suspect-coverage-recomputed-every-recheck): memoized wrapper over the pure scan.
  // A_53 integration fix: return defensive COPIES of the derived arrays — callers do
  // `analyzeSuspectCoverage(...).weakElimination.sort()` (in-place), which would otherwise mutate and
  // corrupt the cached value's order. The expensive part (buildSuspectCoverage) stays memoized.
  const cloneCoverage = (v: SuspectCoverageAnalysis): SuspectCoverageAnalysis => ({
    records: v.records,
    uncovered: [...v.uncovered],
    weakElimination: [...v.weakElimination],
  });
  const key = clues as unknown as object;
  if (!key || typeof key !== "object") return cloneCoverage(computeSuspectCoverage(cml, clues));
  const signature = buildSuspectCoverageSignature(clues);
  const cached = suspectCoverageCache.get(key);
  if (cached && cached.signature === signature && cached.cml === cml) {
    return cloneCoverage(cached.value);
  }
  const value = computeSuspectCoverage(cml, clues);
  suspectCoverageCache.set(key, { signature, cml, value });
  return cloneCoverage(value);
}

export function checkSuspectElimination(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const coverage = analyzeSuspectCoverage(cml, clues);
  if (coverage.uncovered.length > 0) {
    issues.push({
      severity: "warning",
      message: `${coverage.uncovered.length} suspect(s) (${coverage.uncovered.join(", ")}) are never referenced in any clue`,
    });
  }
  if (coverage.weakElimination.length > 0) {
    issues.push({
      severity: "warning",
      message: `${coverage.weakElimination.length} suspect(s) (${coverage.weakElimination.join(", ")}) are referenced but lack elimination/alibi evidence`,
    });
  }
  return issues;
}
