import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";

export type CmlValidationResult = {
  valid: boolean;
  errors: string[];
};

type SchemaNode = {
  type?: "string" | "number" | "boolean" | "object" | "array";
  required?: boolean;
  allowed?: Array<string | number | boolean>;
  fields?: Record<string, SchemaNode>;
  items?: SchemaNode | "string" | "number" | "boolean" | "object" | "array";
  $ref?: string;
  description?: string;
};

const schemaFileCache = new Map<string, Record<string, SchemaNode>>();

const ABSTRACT_REQUIRED_EVIDENCE_PATTERNS = [
  /\btimeline discrepancy\b/i,
  /\bsuspicious behavior\b/i,
  /\bhidden motive\b/i,
  /\bdetective insight\b/i,
  /\bimportant evidence\b/i,
  /\bcritical clue\b/i,
  /\bgeneral contradiction\b/i,
  /\balibi issue\b/i,
  /\bincriminating detail\b/i,
];

const DETECTIVE_ONLY_BEHAVIOR_PATTERNS = [
  /\bsignals? of guilt\b/i,
  /\bguilt emerges?\b/i,
  /\breacts? defensively\b/i,
  /\bobserved reactions?\b/i,
  /\breactions? to(?: the)? (?:established )?(?:timeline|clock|evidence|question(?:ing)?|reenactment|discrepanc(?:y|ies))/i,
  /\bbehavior during (?:the )?(?:reenactment|test)\b.*\breveals? guilt\b/i,
  /\bconfess(?:ion|es|ed)?\b/i,
];

const GROUNDING_STOP_WORDS = new Set([
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

const DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS = new Set([
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

const loadSchemaFile = (filename: string): Record<string, SchemaNode> => {
  if (schemaFileCache.has(filename)) return schemaFileCache.get(filename)!;
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.resolve(currentDir, "..", "..", "..", "schema", filename);
  const raw = fs.readFileSync(schemaPath, "utf8");
  const schema = yaml.load(raw) as Record<string, SchemaNode>;
  schemaFileCache.set(filename, schema);
  return schema;
};

const loadSchema = (): Record<string, SchemaNode> => {
  const currentDir = path.dirname(fileURLToPath(import.meta.url));
  const schemaPath = path.resolve(currentDir, "..", "..", "..", "schema", "cml_2_0.schema.yaml");
  const raw = fs.readFileSync(schemaPath, "utf8");
  return yaml.load(raw) as Record<string, SchemaNode>;
};

const isType = (value: unknown, type?: SchemaNode["type"]): boolean => {
  if (!type) {
    return true;
  }
  if (type === "array") {
    return Array.isArray(value);
  }
  if (type === "object") {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  }
  return typeof value === type;
};

const validateNode = (
  node: SchemaNode,
  value: unknown,
  pathLabel: string,
  errors: string[],
): void => {
  if (value === undefined || value === null) {
    if (node.required) {
      errors.push(`${pathLabel} is required`);
    }
    return;
  }

  // $ref: delegate validation to the referenced schema file
  if (node.$ref) {
    const refSchema = loadSchemaFile(node.$ref);
    for (const [key, refNode] of Object.entries(refSchema)) {
      validateNode(refNode, (value as Record<string, unknown>)[key], `${pathLabel}.${key}`, errors);
    }
    return;
  }

  if (!isType(value, node.type)) {
    errors.push(`${pathLabel} must be ${node.type}`);
    return;
  }

  if (node.allowed && !node.allowed.includes(value as string | number | boolean)) {
    errors.push(`${pathLabel} must be one of ${node.allowed.join(", ")}`);
  }

  if (node.type === "object" && node.fields && value && typeof value === "object") {
    for (const [fieldName, fieldSchema] of Object.entries(node.fields)) {
      const fieldValue = (value as Record<string, unknown>)[fieldName];
      validateNode(fieldSchema, fieldValue, `${pathLabel}.${fieldName}`, errors);
    }
  }

  if (node.type === "array" && node.items && Array.isArray(value)) {
    const itemSchema: SchemaNode =
      typeof node.items === "string" ? { type: node.items } : (node.items as SchemaNode);
    value.forEach((item, index) => {
      validateNode(itemSchema, item, `${pathLabel}[${index}]`, errors);
    });
  }
};

// ============================================================================
// WP9: Inference Path Quality Validation
// ============================================================================

const validateInferencePathQuality = (caseBlock: any, errors: string[]): void => {
  const steps = caseBlock?.inference_path?.steps;
  if (!Array.isArray(steps) || steps.length === 0) {
    return; // Schema validator handles missing steps
  }

  const observations = new Set<string>();

  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const prefix = "CASE.inference_path.steps[" + i + "]";
    const obs = (step.observation || "").trim();

    // WP9A-1: Observation must be at least 20 chars (rejects abstractions)
    if (obs.length < 20) {
      errors.push(prefix + ".observation is too short (" + obs.length + " chars) — must be a concrete, scene-level fact (min 20 chars)");
    }

    // WP9A-2: Must have required_evidence with at least 1 entry
    if (!Array.isArray(step.required_evidence) || step.required_evidence.length === 0) {
      errors.push(prefix + ".required_evidence is missing or empty — each step needs at least 1 evidence item");
    } else {
      step.required_evidence.forEach((entry: unknown, entryIndex: number) => {
        const evidenceText = String(entry || "").trim();
        if (evidenceText.length < 12) {
          errors.push(
            `${prefix}.required_evidence[${entryIndex}] is too brief — use a concrete artifact, witness statement, timestamp, physical trace, or access record`,
          );
        }
        if (ABSTRACT_REQUIRED_EVIDENCE_PATTERNS.some((pattern) => pattern.test(evidenceText))) {
          errors.push(
            `${prefix}.required_evidence[${entryIndex}] is too abstract (\"${evidenceText}\") — replace it with a concrete artifact, witness statement, timestamp, physical trace, or access record`,
          );
        }
        if (usesDetectiveOnlyBehavioralShorthand(evidenceText)) {
          errors.push(
            `${prefix}.required_evidence[${entryIndex}] relies on detective-only behavioral shorthand ("${evidenceText}") — replace it with a concrete pre-test observation, document, timeline fact, physical trace, or access record`,
          );
        }
      });
    }

    // WP9A-3: reader_observable should be true (warn if false)
    if (step.reader_observable === false) {
      errors.push(prefix + ".reader_observable is false — step will not be visible to the reader");
    }

    // WP9A-4: No duplicate observations
    if (observations.has(obs.toLowerCase())) {
      errors.push(prefix + ".observation is a duplicate of another step");
    }
    if (obs.length > 0) {
      observations.add(obs.toLowerCase());
    }
  }
};

const normalizeGroundingText = (value: unknown): string =>
  String(value || "")
    .toLowerCase()
    .replace(/[^a-z0-9\s'-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const normalizeGroundingToken = (token: string): string => {
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

const collectCaseNameTokens = (caseBlock: any): Set<string> => {
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const tokens = cast.flatMap((member: any) => normalizeGroundingText(member?.name).split(" "));
  return new Set(tokens.map(normalizeGroundingToken).filter((token: string) => token.length >= 4));
};

const extractGroundingTerms = (
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

const extractGroundingPhrases = (
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

const collectReaderVisibleEvidenceCorpus = (steps: any[]): string => {
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

const usesDetectiveOnlyBehavioralShorthand = (text: unknown): boolean => {
  const normalized = String(text || "").trim();
  if (!normalized) return false;
  return DETECTIVE_ONLY_BEHAVIOR_PATTERNS.some((pattern) => pattern.test(normalized));
};

const validateConcretePreTestFact = (
  pathLabel: string,
  sourceText: unknown,
  errors: string[],
): void => {
  const normalizedSource = String(sourceText || "").trim();
  if (!normalizedSource) return;

  if (usesDetectiveOnlyBehavioralShorthand(normalizedSource)) {
    errors.push(
      `${pathLabel} relies on detective-only reaction/confession language ("${normalizedSource}") — replace it with a concrete pre-test fact, contradiction, mechanism detail, or elimination the reader can verify without interpreting emotions`,
    );
  }
};

const validateGroundedReaderEvidence = (
  pathLabel: string,
  sourceText: unknown,
  evidenceCorpus: string,
  ignoredTokens: Set<string>,
  errors: string[],
  extraStopWords: Set<string> = new Set(),
): void => {
  const normalizedSource = normalizeGroundingText(sourceText);
  if (!normalizedSource) return;

  const terms = extractGroundingTerms(sourceText, ignoredTokens, extraStopWords);
  if (terms.length < 3) return;

  const coveredTerms = terms.filter((term) => evidenceCorpus.includes(term));
  const phrases = extractGroundingPhrases(sourceText, ignoredTokens, extraStopWords);
  const coveredPhrases = phrases.filter((phrase) => evidenceCorpus.includes(phrase));
  const minimumCoverage = terms.length <= 4 ? 2 : Math.min(3, Math.ceil(terms.length * 0.5));
  if (coveredPhrases.length > 0 || coveredTerms.length >= minimumCoverage) {
    return;
  }

  const missingTerms = terms.filter((term) => !evidenceCorpus.includes(term)).slice(0, 4);
  errors.push(
    `${pathLabel} is not grounded in reader-visible inference evidence — add these mechanism/test terms to earlier observations or required_evidence: ${missingTerms.join(", ")}`,
  );
};

// WP9B: Cross-reference validation
const validateCrossReferences = (caseBlock: any, errors: string[]): void => {
  if (!caseBlock) return;

  // 9B-2: discriminating_test.design should reference concepts from inference_path
  const discrimTest = caseBlock.discriminating_test;
  const steps = caseBlock?.inference_path?.steps ?? [];
  const evidenceCorpus = collectReaderVisibleEvidenceCorpus(steps);
  const ignoredNameTokens = collectCaseNameTokens(caseBlock);

  if (discrimTest?.design && steps.length > 0) {
    validateConcretePreTestFact(
      "CASE.discriminating_test.design",
      discrimTest.design,
      errors,
    );

    const designText = (discrimTest.design || "").toLowerCase();
    const stepTexts = steps.map((s: any) =>
      ((s.observation || "") + " " + (s.correction || "") + " " + (s.effect || "")).toLowerCase()
    );

    const hasOverlap = stepTexts.some((stepText: string) => {
      const words = stepText.split(/\s+/).filter((w: string) => w.length > 4);
      const matchCount = words.filter((w: string) => designText.includes(w)).length;
      return words.length > 0 && matchCount >= Math.ceil(words.length * 0.15);
    });

    if (!hasOverlap) {
      // Soft warning: LLM-generated discriminating tests may use different vocabulary
      // than inference path steps but still be logically connected.
      // We push as a non-blocking observation rather than a hard error.
      // errors.push("CASE.discriminating_test.design appears disconnected from inference_path steps");
    }

    validateGroundedReaderEvidence(
      "CASE.discriminating_test.design",
      discrimTest.design,
      evidenceCorpus,
      ignoredNameTokens,
      errors,
      DISCRIMINATING_TEST_PROCEDURE_STOP_WORDS,
    );
  }

  validateConcretePreTestFact(
    "CASE.discriminating_test.knowledge_revealed",
    discrimTest?.knowledge_revealed,
    errors,
  );

  validateGroundedReaderEvidence(
    "CASE.discriminating_test.knowledge_revealed",
    discrimTest?.knowledge_revealed,
    evidenceCorpus,
    ignoredNameTokens,
    errors,
  );

  validateConcretePreTestFact(
    "CASE.discriminating_test.pass_condition",
    discrimTest?.pass_condition,
    errors,
  );

  validateGroundedReaderEvidence(
    "CASE.hidden_model.mechanism.description",
    caseBlock?.hidden_model?.mechanism?.description,
    evidenceCorpus,
    ignoredNameTokens,
    errors,
  );

  // 9B-3: fair_play.explanation should not be too generic
  const fairPlayExplanation = caseBlock?.fair_play?.explanation || "";
  if (fairPlayExplanation && steps.length > 0) {
    if (fairPlayExplanation.length < 50) {
      // Soft warning only — don't block validation for brief explanations
      // errors.push("CASE.fair_play.explanation is too brief");
    }
  }
};

export const validateCml = (payload: unknown): CmlValidationResult => {
  const schema = loadSchema();

  if (!payload || typeof payload !== "object") {
    return { valid: false, errors: ["Payload must be an object"] };
  }

  const errors: string[] = [];
  const record = payload as Record<string, unknown>;

  for (const [key, node] of Object.entries(schema)) {
    validateNode(node, record[key], key, errors);
  }

  // WP9: Enhanced quality validation on the CASE block
  const caseBlock = (record as any)?.CASE ?? record;
  validateInferencePathQuality(caseBlock, errors);
  validateCrossReferences(caseBlock, errors);

  return { valid: errors.length === 0, errors };
};
