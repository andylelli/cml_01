/**
 * Owner decision 6 (2026-09-30, A5-Q05) — one discriminating-evidence policy.
 *
 * Three policies used to rewrite `discriminating_test.evidence_clues`: Agent 5 seeded three when the list was
 * empty (twice: before remediation and after purging unmappable ids), the pre-prose gate back-filled its
 * three top-scored essential clues AFTER the fair-play audit had read the field, and v1 Agent 9 topped it up
 * to two. Now: at least DISCRIMINATING_EVIDENCE_MIN, applied by Agent 5 and — for regenerated clues — by
 * Agent 6's re-application of Agent 5's contracts, both before an audit. Later stages read it (ADR-0005).
 * The candidate ranking is unchanged (moved verbatim from agent5/evidence-remediation.ts).
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import { SELECTION_WEIGHTS, discriminatingTestTokens, scoreEvidenceCandidate } from "./evidence-candidates.js";
import { CANONICAL_CLUE_ID_RE, getCanonicalEvidenceClueIds } from "./inference-checks.js";
import { getCaseBlock, strictSourcePathWhitelistCache } from "./source-paths.js";
import { strictPromptFeedbackCache } from "./contracts.js";

/** The fewest canonical clue ids the discriminating test may name. */
export const DISCRIMINATING_EVIDENCE_MIN = 2;

export function selectDiscriminatingEvidenceCandidateIds(
  cml: CaseData,
  clues: ClueDistributionResult,
  maxIds: number,
): string[] {
  const caseBlock = getCaseBlock(cml);
  const discrimTokens = discriminatingTestTokens(caseBlock?.discriminating_test); // CR-16 (A5-03)

  const scored = clues.clues
    .map((c) => {
      const score = scoreEvidenceCandidate(c, discrimTokens, SELECTION_WEIGHTS); // CR-16 (A5-03)
      return {
        id: String(c?.id ?? "").trim(),
        score,
        placement: String(c?.placement ?? "").toLowerCase(),
      };
    })
    .filter((entry) => Boolean(entry.id) && CANONICAL_CLUE_ID_RE.test(entry.id));

  const earlyMid = scored
    .filter((entry) => entry.placement === "early" || entry.placement === "mid")
    .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, maxIds))
    .map((entry) => entry.id);

  if (earlyMid.length > 0) {
    return earlyMid;
  }

  return scored
    .sort((a, b) => (b.score - a.score) || a.id.localeCompare(b.id))
    .slice(0, Math.max(1, maxIds))
    .map((entry) => entry.id);
}

/**
 * Top `discriminating_test.evidence_clues` up to `min` canonical ids from the ranked candidates, keeping the
 * ids already there first. Returns the ids added ([] when the floor already holds, or nothing qualifies — the
 * reachability check then reports the genuine zero-evidence case as it always has).
 */
export function ensureDiscriminatingEvidenceFloor(
  cml: CaseData,
  clues: ClueDistributionResult,
  min: number = DISCRIMINATING_EVIDENCE_MIN,
): string[] {
  const discrimTest = getCaseBlock(cml)?.discriminating_test;
  if (!discrimTest) return [];
  const current = getCanonicalEvidenceClueIds(cml);
  if (current.length >= min) return [];
  const additions = selectDiscriminatingEvidenceCandidateIds(cml, clues, min + current.length)
    .filter((id) => !current.includes(id))
    .slice(0, min - current.length);
  if (additions.length === 0) return [];
  discrimTest.evidence_clues = [...current, ...additions];
  // The strict whitelist/feedback memos are keyed by the case object and enumerate evidence_clues[i] paths.
  strictSourcePathWhitelistCache.delete(cml as unknown as object);
  strictPromptFeedbackCache.delete(cml as unknown as object);
  return additions;
}
