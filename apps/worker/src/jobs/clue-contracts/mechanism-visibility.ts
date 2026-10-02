/**
 * Agent 5 clue contracts — mechanism visibility. Split from agent5-contracts.ts (code review A5-05), which
 * re-exports what it exported.
 */
import type { Clue, ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type ClueGuardrailIssue,
} from "../agents/shared.js";
import {
  normalizeTokens,
} from "./clue-time.js";
import {
  getCaseBlock,
} from "./source-paths.js";

const MECHANISM_VISIBILITY_STOP_WORDS = new Set([
  "about", "after", "again", "already", "before", "being", "could",
  "during", "earlier", "evidence", "explain", "explains", "knowledge",
  "later", "method", "reader", "revealed", "shows", "therefore",
  "through", "using", "which", "window", "false", "only", "culprit",
]);

export const extractMechanismVisibilityTerms = (text: string): string[] =>
  [...new Set(normalizeTokens(text)
    .filter((token) => token.length >= 5)
    .filter((token) => !MECHANISM_VISIBILITY_STOP_WORDS.has(token)))].slice(0, 8);

export const extractMechanismVisibilityPhrases = (text: string): string[] => {
  const terms = extractMechanismVisibilityTerms(text);
  if (terms.length < 2) return [];

  const phrases: string[] = [];
  for (let i = 0; i < terms.length - 1; i += 1) {
    phrases.push(`${terms[i]} ${terms[i + 1]}`);
  }

  return [...new Set(phrases)].slice(0, 6);
};

/**
 * The clues that make the core mechanism reader-visible, or null when the mechanism text yields fewer
 * than three terms (nothing to judge). A5-07: the check below and the late-placement repair
 * (promoteLateGateCluesToMid) select through this one body.
 */
export function selectMechanismVisibleClues(cml: CaseData, clues: ClueDistributionResult): Clue[] | null {
  const caseBlock = getCaseBlock(cml);
  const mechanismText = `${String(caseBlock?.hidden_model?.mechanism?.description ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`.trim();
  const terms = extractMechanismVisibilityTerms(mechanismText);
  if (terms.length < 3) return null;

  const phrases = extractMechanismVisibilityPhrases(mechanismText);
  return clues.clues.filter((clue) => {
    const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
    const tokenSet = new Set(normalizeTokens(text));
    const termMatches = terms.filter((term) => tokenSet.has(term)).length;
    const phraseMatch = phrases.some((phrase) => text.includes(phrase));
    // Threshold of 1: a clue referencing any single mechanism-specific term
    // (e.g. "clock" in a clock-tampering mystery) is genuinely mechanism-visible.
    // Requiring 2+ terms was too strict — well-written narrative clues naturally
    // avoid restating internal mechanism language verbatim.
    return phraseMatch || termMatches >= 1;
  });
}

export function checkMechanismVisibility(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const matchingClues = selectMechanismVisibleClues(cml, clues);
  if (!matchingClues) return issues;

  if (matchingClues.length === 0) {
    issues.push({
      severity: "critical",
      message: "No clue makes the core mechanism reader-visible before the discriminating test.",
    });
    return issues;
  }

  const earlyMidMatches = matchingClues.filter((clue) => clue?.placement === "early" || clue?.placement === "mid");
  if (earlyMidMatches.length === 0) {
    issues.push({
      severity: "critical",
      message: `Mechanism-visible clue(s) are late-only: ${matchingClues.map((clue) => String(clue?.id ?? "(unknown-id)")).join(", ")}`,
    });
  }

  return issues;
}
