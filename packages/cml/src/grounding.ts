export const GROUNDING_STOP_WORDS = new Set([
  "about",
  "after",
  "again",
  "along",
  "already",
  "also",
  "among",
  "before",
  "being",
  "between",
  "could",
  "controlled",
  "demonstration",
  "deliberately",
  "during",
  "earlier",
  "examined",
  "explain",
  "explains",
  "events",
  "every",
  "evidence",
  "expose",
  "facts",
  "found",
  "guest",
  "guests",
  "having",
  "knowledge",
  "internal",
  "later",
  "mechanical",
  "mechanism",
  "means",
  "method",
  "mislead",
  "misleading",
  "night",
  "other",
  "prove",
  "proven",
  "reader",
  "revealed",
  "shows",
  "significance",
  "solution",
  "someone",
  "something",
  "signs",
  "staged",
  "suspects",
  "their",
  "there",
  "these",
  "those",
  "timeline",
  "through",
  "false",
  "create",
  "creates",
  "created",
  "conversation",
  "control",
  "controll",
  "confront",
  "confrontation",
  "detection",
  "details",
  "death",
  "discuss",
  "emerge",
  "inconsistent",
  "inability",
  "inconsistencies",
  "investigation",
  "investigators",
  "manipulation",
  "reenact",
  "regarding",
  "using",
  "without",
  "witnesses",
  "whereabouts",
  "where",
  "which",
  "asking",
  "around",
  "alibis",
  "window",
]);

export const DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS = new Set([
  "reenactment",
  "surrounding",
  "putting",
  "scrutiny",
  "staging",
  "stage",
  "observation",
  "under",
  "compare",
  "comparing",
  "against",
  "testimony",
  "testimonies",
  "reveal",
  "reveals",
  "revealed",
  "comparison",
  "prove",
  "proves",
  "proven",
  "manipulated",
  "manipulating",
  "shifting",
  "control",
  "investigation",
  "detection",
  "without",
]);

const IRREGULAR_GROUNDING_TOKEN_MAP: Record<string, string> = {
  testimonies: "testimony",
  comparison: "compare",
  comparing: "compare",
  revealed: "reveal",
  reveals: "reveal",
  proven: "prove",
  proves: "prove",
  manipulation: "manipulate",
  manipulated: "manipulate",
  manipulates: "manipulate",
  controlled: "control",
  controlling: "control",
  shifting: "shift",
  shifted: "shift",
  investigations: "investigation",
  rewound: "wound",
};

export const normalizeGroundingText = (value: unknown): string =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const normalizeGroundingToken = (token: string): string => {
  const base = token.toLowerCase().replace(/'s$/i, "").trim();
  if (!base) return "";

  const mapped = IRREGULAR_GROUNDING_TOKEN_MAP[base] ?? base;
  let normalized = mapped;

  if (normalized.length > 6 && normalized.endsWith("ing")) {
    normalized = normalized.slice(0, -3);
  } else if (normalized.length > 5 && normalized.endsWith("ed")) {
    normalized = normalized.slice(0, -2);
  } else if (normalized.length > 5 && normalized.endsWith("es")) {
    normalized = normalized.slice(0, -2);
  } else if (normalized.length > 4 && normalized.endsWith("s")) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
};

export const collectCaseNameTokens = (caseBlock: any): Set<string> => {
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const tokens = cast.flatMap((member: any) => normalizeGroundingText(member?.name).split(" "));
  return new Set(tokens.map(normalizeGroundingToken).filter((token: string) => token.length >= 4));
};

export const extractGroundingTerms = (
  text: unknown,
  ignoredTokens: Set<string> = new Set(),
  extraStopWords: Set<string> = new Set(),
): string[] => {
  const normalized = normalizeGroundingText(text);
  if (!normalized) return [];

  const terms = normalized
    .split(" ")
    .map(normalizeGroundingToken)
    .filter((token) => token.length >= 5 || /\d/.test(token))
    .filter((token) => !GROUNDING_STOP_WORDS.has(token))
    .filter((token) => !extraStopWords.has(token))
    .filter((token) => !ignoredTokens.has(token));

  return [...new Set(terms)].slice(0, 8);
};

export const extractGroundingPhrases = (
  text: unknown,
  ignoredTokens: Set<string> = new Set(),
  extraStopWords: Set<string> = new Set(),
): string[] => {
  const terms = extractGroundingTerms(text, ignoredTokens, extraStopWords);
  if (terms.length < 2) return [];

  const phrases: string[] = [];
  for (let i = 0; i < terms.length - 1; i += 1) {
    phrases.push(`${terms[i]} ${terms[i + 1]}`);
  }

  return [...new Set(phrases)].slice(0, 6);
};

export const collectReaderVisibleEvidenceCorpus = (steps: any[]): string => {
  return steps
    .filter((step) => step?.reader_observable !== false)
    .flatMap((step) => {
      const requiredEvidence = Array.isArray(step?.required_evidence) ? step.required_evidence : [];
      return [step?.observation, step?.correction, step?.effect, ...requiredEvidence];
    })
    .map((value) => normalizeGroundingText(value))
    .filter(Boolean)
    .join(" ");
};

export const isGroundedAgainstCorpus = (
  sourceText: unknown,
  evidenceCorpus: string,
  ignoredTokens: Set<string> = new Set(),
  extraStopWords: Set<string> = new Set(),
): boolean => {
  const terms = extractGroundingTerms(sourceText, ignoredTokens, extraStopWords);
  if (terms.length < 3) {
    return true;
  }

  const coveredTerms = terms.filter((term) => evidenceCorpus.includes(term));
  const phrases = extractGroundingPhrases(sourceText, ignoredTokens, extraStopWords);
  const coveredPhrases = phrases.filter((phrase) => evidenceCorpus.includes(phrase));
  const minimumCoverage = terms.length <= 4 ? 2 : Math.min(3, Math.ceil(terms.length * 0.5));

  return coveredPhrases.length > 0 || coveredTerms.length >= minimumCoverage;
};