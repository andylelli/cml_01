/**
 * The state runAgent5's phases share: the read-only run settings and closures (Agent5Run), the retry flags
 * a phase may set (Agent5State), and the proactive first-pass feedback. Moved from agent5-run.ts (code review
 * A5-01 / CR-25), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  buildStrictPromptFeedback,
  getCanonicalEvidenceClueIds,
  getCaseBlock,
  isOverlapCandidateToken,
  normalizeTokens,
} from "../../clue-contracts/contracts.js";

export const buildAgent5ProactiveFirstPassFeedback = (cml: CaseData): any => {
  const caseBlock = getCaseBlock(cml);
  const culpritNames = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((entry: unknown) => String(entry ?? "").trim()).filter(Boolean)
    : [];

  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const eligibleNonCulprits = cast
    .filter((entry: any) => String(entry?.culprit_eligibility ?? "").toLowerCase() === "eligible")
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => Boolean(name) && !culpritNames.includes(name));

  const requiredCluePhrases = eligibleNonCulprits
    .slice(0, 4)
    .map((name: string) => `Eliminates ${name} because`);

  const canonicalEvidenceIds = getCanonicalEvidenceClueIds(cml).slice(0, 8);

  const correctionTerms = Array.isArray(caseBlock?.inference_path?.steps)
    ? [...new Set(
      caseBlock.inference_path.steps
        .flatMap((step: any) => normalizeTokens(String(step?.correction ?? "")))
        .filter(isOverlapCandidateToken),
    )].slice(0, 12)
    : [];

  const falseAssumptionTerms = normalizeTokens(String(caseBlock?.false_assumption?.statement ?? ""))
    .filter((token) => token.length > 4)
    .slice(0, 12);

  return {
    overallStatus: "needs-revision",
    recommendations: [
      "FIRST PASS PRIORITY: satisfy suspect elimination coverage for every eligible non-culprit before optional texture clues.",
      "FIRST PASS PRIORITY: ensure all discriminating evidence IDs are present as exact clue IDs and placed early/mid as essential.",
      "FIRST PASS PRIORITY: avoid correction-language terms in red herring description/misdirection from the start.",
    ],
    targetedClueIds: canonicalEvidenceIds,
    requiredCluePhrases,
    forbiddenTerms: correctionTerms,
    preferredTerms: falseAssumptionTerms,
  };
};

/**
 * A5-01 — what runAgent5's phases share besides `ctx` and the clue distribution: the read-only run
 * settings and closures (`Agent5Run`) and the retry flags a phase may set (`Agent5State`). Each phase is
 * a function of `(ctx, run, state, clues, …)`, extracted from the 1,130-line function it was.
 */
export interface Agent5Run {
  clueDensity: "minimal" | "moderate" | "dense";
  strictPromptFeedbackBase: ReturnType<typeof buildStrictPromptFeedback> | undefined;
  proactiveFirstPassFeedback: ReturnType<typeof buildAgent5ProactiveFirstPassFeedback>;
  mergeStrictPromptFeedback: (feedback?: any, isRetry?: boolean) => any;
  cluesStart: number;
  recordHardFailPhaseScore: (reason: string) => void;
  failAgent5: (message: string) => never;
  extractWithAttempt: (payload: any) => Promise<ClueDistributionResult>;
}

export interface Agent5State {
  agent5RetryInvoked: boolean;
  extractionAttempt: number;
  performedSuspectRetry: boolean;
  performedRedHerringRetry: boolean;
  performedCoverageRetry: boolean;
}
