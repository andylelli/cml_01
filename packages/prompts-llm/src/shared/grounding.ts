import {
  DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS,
  GROUNDING_STOP_WORDS,
  collectCaseNameTokens,
  collectReaderVisibleEvidenceCorpus,
  extractGroundingTerms,
  isGroundedAgainstCorpus,
  normalizeGroundingToken,
} from "@cml/cml";

const selectEvidenceTerms = (
  sourceText: unknown,
  evidenceCorpus: string,
  ignoredTokens: Set<string>,
  extraStopWords: Set<string> = new Set(),
): string[] => {
  const groundedSourceTerms = extractGroundingTerms(sourceText, ignoredTokens, extraStopWords)
    .filter((term) => evidenceCorpus.includes(term));

  const corpusTerms = evidenceCorpus
    .split(" ")
    .map(normalizeGroundingToken)
    .filter((token) => token.length >= 5 || /\d/.test(token))
    .filter((token) => !GROUNDING_STOP_WORDS.has(token))
    .filter((token) => !extraStopWords.has(token))
    .filter((token) => !ignoredTokens.has(token));

  return [...new Set([...groundedSourceTerms, ...corpusTerms])].slice(0, 4);
};

const rewriteGroundedField = (
  target: Record<string, unknown>,
  fieldName: string,
  template: (terms: string[]) => string,
  evidenceCorpus: string,
  ignoredTokens: Set<string>,
  extraStopWords: Set<string> = new Set(),
): void => {
  const currentValue = String(target[fieldName] ?? "").trim();
  if (!currentValue) {
    return;
  }

  if (isGroundedAgainstCorpus(currentValue, evidenceCorpus, ignoredTokens, extraStopWords)) {
    return;
  }

  const evidenceTerms = selectEvidenceTerms(currentValue, evidenceCorpus, ignoredTokens, extraStopWords);
  if (evidenceTerms.length < 2) {
    return;
  }

  target[fieldName] = template(evidenceTerms);
};

export function groundDiscriminatingKnowledgeRevealed(caseBlock: Record<string, unknown>): void {
  const inferencePath = (caseBlock?.inference_path ?? {}) as Record<string, unknown>;
  const steps = Array.isArray(inferencePath.steps) ? inferencePath.steps : [];
  if (steps.length === 0) {
    return;
  }

  const evidenceCorpus = collectReaderVisibleEvidenceCorpus(steps);
  if (!evidenceCorpus) {
    return;
  }

  const ignoredTokens = collectCaseNameTokens(caseBlock);
  const hiddenModel = (caseBlock?.hidden_model ?? {}) as Record<string, unknown>;
  const mechanism = (hiddenModel.mechanism ?? {}) as Record<string, unknown>;
  const discriminatingTest = (caseBlock?.discriminating_test ?? {}) as Record<string, unknown>;

  rewriteGroundedField(
    mechanism,
    "description",
    (terms) =>
      terms.length >= 3
        ? `The mechanism relies on ${terms[0]}, ${terms[1]}, and ${terms[2]} to expose the false timing.`
        : `The mechanism relies on ${terms[0]} and ${terms[1]} to expose the false timing.`,
    evidenceCorpus,
    ignoredTokens,
  );

  rewriteGroundedField(
    discriminatingTest,
    "design",
    (terms) =>
      terms.length >= 3
        ? `The discriminating test compares ${terms[0]}, ${terms[1]}, and ${terms[2]} against the claimed timeline.`
        : `The discriminating test compares ${terms[0]} and ${terms[1]} against the claimed timeline.`,
    evidenceCorpus,
    ignoredTokens,
    DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS,
  );

  rewriteGroundedField(
    discriminatingTest,
    "knowledge_revealed",
    (terms) =>
      terms.length >= 3
        ? `The revealed facts are ${terms[0]}, ${terms[1]}, and ${terms[2]}.`
        : `The revealed facts are ${terms[0]} and ${terms[1]}.`,
    evidenceCorpus,
    ignoredTokens,
  );
}
