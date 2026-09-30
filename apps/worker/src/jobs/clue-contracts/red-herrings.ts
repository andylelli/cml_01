/**
 * Agent 5 clue contracts — red-herring overlap with the true solution. Split from agent5-contracts.ts
 * (code review A5-05), which re-exports what it exported.
 */
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  getCaseBlock,
} from "./source-paths.js";

export type RedHerringOverlapDetail = {
  redHerringId: string;
  matchedCorrectionWords: string[];
  matchedStepIndexes: number[];
  overlapScore: number;
};

const RH_OVERLAP_STOP_WORDS = new Set([
  "therefore", "because", "suggests", "suggested", "indicates", "indicated", "through", "before", "after", "during", "reader", "should", "could", "would", "their", "about", "which", "while", "where", "when", "being", "shows", "found", "noted",
]);

// These words are common across mystery prose and often cause noisy false positives
// in overlap scoring without indicating mechanism-level leakage.
const RH_OVERLAP_GENERIC_TERMS = new Set([
  "murder", "killer", "killing", "death", "crime", "victim",
  "document", "documents", "record", "records", "release", "released",
  "occurred", "happened", "timestamp",
]);

export const isOverlapCandidateToken = (token: string): boolean =>
  token.length > 4
  && !RH_OVERLAP_STOP_WORDS.has(token)
  && !RH_OVERLAP_GENERIC_TERMS.has(token);

export function findRedHerringOverlapDetails(cml: CaseData, clues: ClueDistributionResult): RedHerringOverlapDetail[] {
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  if (steps.length === 0 || !Array.isArray(clues.redHerrings) || clues.redHerrings.length === 0) {
    return [];
  }

  const stepCorrectionWords = steps.map((step: any, idx: number) => ({
    stepIndex: idx + 1,
    words: (typeof step?.correction === "string" ? step.correction : "")
      .toLowerCase()
      .split(/\s+/)
      .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
      .filter((w: string) => isOverlapCandidateToken(w)),
    phrases: (() => {
      const tokens = (typeof step?.correction === "string" ? step.correction : "")
        .toLowerCase()
        .split(/\s+/)
        .map((w: string) => w.replace(/[^a-z0-9]/g, ""))
        .filter((w: string) => w.length > 3 && !RH_OVERLAP_STOP_WORDS.has(w) && !RH_OVERLAP_GENERIC_TERMS.has(w));
      const bigrams: string[] = [];
      const trigrams: string[] = [];
      for (let i = 0; i < tokens.length - 1; i++) bigrams.push(`${tokens[i]} ${tokens[i + 1]}`);
      for (let i = 0; i < tokens.length - 2; i++) trigrams.push(`${tokens[i]} ${tokens[i + 1]} ${tokens[i + 2]}`);
      return { bigrams, trigrams };
    })(),
  }));

  const overlaps: RedHerringOverlapDetail[] = [];
  for (let i = 0; i < clues.redHerrings.length; i++) {
    const rh = clues.redHerrings[i] as any;
    const rhId = String(rh?.id ?? `rh_${i + 1}`).trim() || `rh_${i + 1}`;
    // Do not score supportsAssumption for overlap: it is expected to echo the false assumption.
    const text = `${String(rh?.description ?? "")} ${String(rh?.misdirection ?? "")}`.toLowerCase();
    // A_53 P10 (a5-rebuilt-regex-in-overlap-loop-O-n2): tokenize the red-herring text ONCE into an
    // alphanumeric-word Set and test membership, instead of compiling a fresh `\b${word}\b` RegExp
    // per correction-word per step per red herring. Both `text` and `step.words` are already
    // lowercased alphanumeric runs, so Set membership is equivalent to the word-boundary match.
    const textTokenSet = new Set(text.split(/[^a-z0-9]+/).filter(Boolean));

    const matchedStepIndexes: number[] = [];
    const matchedCorrectionWords = new Set<string>();
    let phraseWeightedScore = 0;
    for (const step of stepCorrectionWords) {
      const stepMatches = step.words.filter((word: string) => textTokenSet.has(word));
      const bigramMatches = step.phrases.bigrams.filter((phrase: string) => text.includes(phrase));
      const trigramMatches = step.phrases.trigrams.filter((phrase: string) => text.includes(phrase));
      if (stepMatches.length > 0) {
        matchedStepIndexes.push(step.stepIndex);
        stepMatches.forEach((word: string) => matchedCorrectionWords.add(word));
      }
      phraseWeightedScore += (stepMatches.length * 1) + (bigramMatches.length * 2) + (trigramMatches.length * 3);
    }

    const overlapScore = phraseWeightedScore + (new Set(matchedStepIndexes)).size;
    const isMeaningfulOverlap = overlapScore >= 4 || matchedCorrectionWords.size >= 2 || new Set(matchedStepIndexes).size >= 2;
    if (isMeaningfulOverlap) {
      overlaps.push({
        redHerringId: rhId,
        matchedCorrectionWords: Array.from(matchedCorrectionWords),
        matchedStepIndexes,
        overlapScore,
      });
    }
  }

  return overlaps;
}

export function findRedHerringTrueSolutionOverlap(cml: CaseData, clues: ClueDistributionResult): string[] {
  return findRedHerringOverlapDetails(cml, clues).map((d) => d.redHerringId);
}
