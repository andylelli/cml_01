/**
 * CR-16 (A5-03) — scoring clues as candidates for the discriminating test's evidence, once.
 *
 * Three sites scored clues against the test's design and knowledge_revealed text, each with its own copy of
 * the tokenising and the scoring: Agent 5's missing-evidence remap (agent5-contracts), Agent 5's candidate
 * selection (agent5/evidence-remediation) and the orchestrator's pre-prose back-fill (pipeline/gates). They
 * now share this; each keeps its weights, its filter and its sort, so no verdict moved (R1). One policy for
 * how many ids the test carries, applied once, is the owner's (A5-03 step 2).
 */

/** The test's design + knowledge_revealed, lower-cased, as the set of words of five letters or more. */
export const discriminatingTestTokens = (discriminatingTest: any): Set<string> => {
  const text = `${String(discriminatingTest?.design ?? "")} ${String(discriminatingTest?.knowledge_revealed ?? "")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  return new Set(text.split(/\s+/).filter((t) => t.length >= 5));
};

export interface EvidenceCandidateWeights {
  essential: number;
  earlyOrMid: number;
  observationOrContradiction: number;
}

/** Agent 5's remap and the orchestrator back-fill (their candidates are essential clues already). */
export const BACKFILL_WEIGHTS: EvidenceCandidateWeights = { essential: 0, earlyOrMid: 2, observationOrContradiction: 1 };
/** Agent 5's candidate selection. */
export const SELECTION_WEIGHTS: EvidenceCandidateWeights = { essential: 2, earlyOrMid: 1, observationOrContradiction: 1 };

/** One point per test word the clue's description or pointsTo contains, plus the weighted traits. */
export const scoreEvidenceCandidate = (clue: any, tokens: Set<string>, weights: EvidenceCandidateWeights): number => {
  const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (text.includes(token)) score += 1;
  }
  if (clue?.criticality === "essential") score += weights.essential;
  if (clue?.placement === "early" || clue?.placement === "mid") score += weights.earlyOrMid;
  if (clue?.evidenceType === "observation" || clue?.evidenceType === "contradiction") score += weights.observationOrContradiction;
  return score;
};
