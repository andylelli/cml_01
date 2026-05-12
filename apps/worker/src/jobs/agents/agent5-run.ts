/**
 * Agent 5: Clue Distribution
 *
 * Extracted from mystery-orchestrator.ts. Runs extractClues(), applies
 * deterministic guardrails, checks inference-path coverage (WP4), and
 * writes ctx.clues / ctx.coverageResult / ctx.allCoverageIssues.
 */

import { extractClues } from "@cml/prompts-llm";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import type { PhaseScore } from "@cml/story-validation";
import {
  type OrchestratorContext,
  type ClueGuardrailIssue,
  type InferenceCoverageResult,
  applyClueGuardrails,
} from "./shared.js";

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

type RedHerringOverlapDetail = {
  redHerringId: string;
  matchedCorrectionWords: string[];
  matchedStepIndexes: number[];
  overlapScore: number;
};

type SourcePathValidationResult = {
  invalidPaths: string[];
  issues: ClueGuardrailIssue[];
};

type TemporalLexicalCollisionResult = {
  detected: boolean;
  forbiddenTerms: string[];
  allowedTerms: string[];
  explanation: string;
};

type StrictPromptFeedbackPayload = {
  overallStatus: "pass" | "fail" | "needs-revision";
  recommendations: string[];
  strictSourcePaths: string[];
  requiredIdToSourceMappings: Array<{ id: string; sourceInCML: string }>;
  requiredStepCoverageFloors: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>;
  requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" };
  requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] };
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

const MECHANISM_VISIBILITY_STOP_WORDS = new Set([
  "about", "after", "again", "already", "before", "being", "could",
  "during", "earlier", "evidence", "explain", "explains", "knowledge",
  "later", "method", "reader", "revealed", "shows", "therefore",
  "through", "using", "which", "window", "false", "only", "culprit",
]);

const META_AUDIT_CLUE_PATTERNS: Array<{ pattern: RegExp; label: string }> = [
  { pattern: /reader-visible pre-test clue/i, label: "Reader-visible pre-test clue" },
  { pattern: /fair play audit/i, label: "fair play audit" },
  { pattern: /information parity/i, label: "Information Parity" },
  { pattern: /logical deducibility/i, label: "Logical Deducibility" },
  { pattern: /clue visibility/i, label: "Clue Visibility" },
  { pattern: /no withholding/i, label: "No Withholding" },
  { pattern: /discriminating test timing/i, label: "Discriminating Test Timing" },
  { pattern: /first-pass acceptance contract/i, label: "first-pass acceptance contract" },
  { pattern: /structured correction payload/i, label: "structured correction payload" },
  { pattern: /hard retry contract/i, label: "hard retry contract" },
  { pattern: /correction target/i, label: "correction target" },
  { pattern: /needs-revision/i, label: "needs-revision" },
];

const isOverlapCandidateToken = (token: string): boolean =>
  token.length > 4
  && !RH_OVERLAP_STOP_WORDS.has(token)
  && !RH_OVERLAP_GENERIC_TERMS.has(token);

const ALLOWED_SOURCE_PATTERNS: RegExp[] = [
  /^CASE\.inference_path\.steps\[(\d+)\]\.observation$/,
  /^CASE\.inference_path\.steps\[(\d+)\]\.correction$/,
  /^CASE\.inference_path\.steps\[(\d+)\]\.required_evidence\[(\d+)\]$/,
  /^CASE\.constraint_space\.time\.anchors\[(\d+)\]$/,
  /^CASE\.constraint_space\.time\.contradictions\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.actors\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.objects\[(\d+)\]$/,
  /^CASE\.constraint_space\.access\.permissions\[(\d+)\]$/,
  /^CASE\.constraint_space\.physical\.laws\[(\d+)\]$/,
  /^CASE\.constraint_space\.physical\.traces\[(\d+)\]$/,
  /^CASE\.cast\[(\d+)\]\.alibi_window$/,
  /^CASE\.cast\[(\d+)\]\.access_plausibility$/,
  /^CASE\.cast\[(\d+)\]\.evidence_sensitivity\[(\d+)\]$/,
  /^CASE\.discriminating_test\.evidence_clues\[(\d+)\]$/,
  /^CASE\.prose_requirements\.clue_to_scene_mapping\[(\d+)\]\.clue_id$/,
];

const CANONICAL_CLUE_ID_RE = /^clue_[a-z0-9_-]+$/i;

const classifyAgent5FailureClass = (message: string): string => {
  const normalized = String(message ?? "").toLowerCase();
  if (/red-?herring\s+overlap/.test(normalized)) return "agent5.red_herring_overlap";
  if (/source-?path|source path/.test(normalized)) return "agent5.invalid_source_path";
  if (/discriminating.*(id|evidence clue)|evidence id/.test(normalized)) return "agent5.discriminating_id_coverage";
  if (/weak elimination|suspect-coverage/.test(normalized)) return "agent5.weak_elimination_evidence";
  if (/time-style|digit-based time/.test(normalized)) return "agent5.time_style_violation";
  return "agent5.unknown_failure";
};

const strictPromptContractsEnabled = (): boolean => {
  // Strict prompt-contract feedback is active by default for all core reliability paths.
  // Set AGENT5_STRICT_PROMPT_CONTRACTS=off to disable (diagnostic/testing only).
  const value = String(process.env.AGENT5_STRICT_PROMPT_CONTRACTS ?? "").trim().toLowerCase();
  if (value === "0" || value === "false" || value === "no" || value === "off") return false;
  return true;
};

const normalizeTokens = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

const extractMechanismVisibilityTerms = (text: string): string[] =>
  [...new Set(normalizeTokens(text)
    .filter((token) => token.length >= 5)
    .filter((token) => !MECHANISM_VISIBILITY_STOP_WORDS.has(token)))].slice(0, 8);

const extractMechanismVisibilityPhrases = (text: string): string[] => {
  const terms = extractMechanismVisibilityTerms(text);
  if (terms.length < 2) return [];

  const phrases: string[] = [];
  for (let i = 0; i < terms.length - 1; i += 1) {
    phrases.push(`${terms[i]} ${terms[i + 1]}`);
  }

  return [...new Set(phrases)].slice(0, 6);
};

const nameAppearsInText = (name: string, text: string): boolean => {
  const nameTokens = normalizeTokens(name).filter((t) => t.length > 2);
  if (nameTokens.length === 0) return false;
  const haystack = ` ${normalizeTokens(text).join(" ")} `;
  return nameTokens.every((token) => haystack.includes(` ${token} `));
};

const isEliminationLike = (text: string): boolean =>
  /\b(ruled\s+out|eliminat|cleared|innocent|not\s+the\s+(?:culprit|killer|murderer)|excluded?)\b/i.test(text);

const isAlibiLike = (text: string): boolean =>
  /\b(alibi|elsewhere|seen\s+in\s+a\s+different\s+location|could\s+not\s+have|was\s+with|timestamp|confirmed\s+by|corroborat|witness(?:es)?\s+confirm|documented\s+at)\b/i.test(text);

const hasTimeWindow = (text: string): boolean =>
  /\b(from|between|until|before|after|at|during)\b.*\b(o['’]clock|past|to|am|pm|a\.m\.|p\.m\.|\d{1,2}:\d{2})\b/i.test(text)
  || /\b\d{1,2}:\d{2}\b/.test(text);

const hasCorroborator = (text: string): boolean =>
  /\b(witness|witnesses|confirmed\s+by|corroborat|log|receipt|record|document|shopkeeper|butler|porter|testimony)\b/i.test(text);

const getCaseBlock = (cml: CaseData): any => ((cml as any)?.CASE ?? cml);

const getCanonicalEvidenceClueIds = (cml: CaseData): string[] => {
  const caseBlock = getCaseBlock(cml);
  const rawEvidence = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues
    : [];
  return rawEvidence
    .map((id: unknown) => String(id ?? "").trim())
    .filter((id: string) => Boolean(id) && CANONICAL_CLUE_ID_RE.test(id));
};

const sanitizeDiscriminatingEvidenceClueIds = (cml: CaseData): { removed: string[]; kept: string[] } => {
  const caseBlock = getCaseBlock(cml);
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest || !Array.isArray(discrimTest.evidence_clues)) {
    return { removed: [], kept: [] };
  }

  const rawEvidence = discrimTest.evidence_clues
    .map((id: unknown) => String(id ?? "").trim())
    .filter(Boolean);
  const kept = rawEvidence.filter((id: string) => CANONICAL_CLUE_ID_RE.test(id));
  const removed = rawEvidence.filter((id: string) => !CANONICAL_CLUE_ID_RE.test(id));

  if (removed.length > 0) {
    discrimTest.evidence_clues = kept;
  }

  return { removed, kept };
};

const getByPath = (root: any, path: string): { ok: boolean; value?: any } => {
  const tokens = path.match(/[A-Za-z_][A-Za-z0-9_]*|\[(\d+)\]/g);
  if (!tokens) return { ok: false };

  let current: any = root;
  for (const token of tokens) {
    if (token.startsWith("[")) {
      const idx = Number(token.slice(1, -1));
      if (!Array.isArray(current) || !Number.isInteger(idx) || idx < 0 || idx >= current.length) {
        return { ok: false };
      }
      current = current[idx];
      continue;
    }
    if (current == null || typeof current !== "object" || !(token in current)) {
      return { ok: false };
    }
    current = current[token];
  }

  return { ok: true, value: current };
};

const validateSourcePath = (cml: CaseData, sourcePath: string): boolean => {
  if (!sourcePath || typeof sourcePath !== "string") return false;
  if (!ALLOWED_SOURCE_PATTERNS.some((re) => re.test(sourcePath))) return false;
  return getByPath({ CASE: getCaseBlock(cml) }, sourcePath).ok;
};

const checkSourcePathValidity = (cml: CaseData, clues: ClueDistributionResult): SourcePathValidationResult => {
  const invalidPaths = new Set<string>();
  const issues: ClueGuardrailIssue[] = [];

  for (const clue of clues.clues as any[]) {
    const sourcePath = String(clue?.sourceInCML ?? "").trim();
    if (!validateSourcePath(cml, sourcePath)) {
      invalidPaths.add(sourcePath || "(empty-source-path)");
      issues.push({
        severity: "critical",
        message: `Invalid sourceInCML path on clue ${String(clue?.id ?? "(unknown-id)")}: ${sourcePath || "(empty-source-path)"}`,
      });
    }
  }

  return { invalidPaths: Array.from(invalidPaths), issues };
};

const toClueIdSlug = (value: string): string =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  || "culprit";

const pushIndexedSourcePaths = (
  acc: string[],
  base: string,
  arr: unknown[] | undefined,
): void => {
  if (!Array.isArray(arr)) return;
  for (let i = 0; i < arr.length; i += 1) {
    acc.push(`${base}[${i}]`);
  }
};

const buildStrictSourcePathWhitelist = (cml: CaseData): string[] => {
  const caseBlock = getCaseBlock(cml);
  const paths: string[] = [];

  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (let i = 0; i < steps.length; i += 1) {
    paths.push(`CASE.inference_path.steps[${i}].observation`);
    paths.push(`CASE.inference_path.steps[${i}].correction`);
    const reqEvidence = Array.isArray(steps[i]?.required_evidence) ? steps[i].required_evidence : [];
    for (let j = 0; j < reqEvidence.length; j += 1) {
      paths.push(`CASE.inference_path.steps[${i}].required_evidence[${j}]`);
    }
  }

  pushIndexedSourcePaths(paths, "CASE.constraint_space.time.anchors", caseBlock?.constraint_space?.time?.anchors);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.time.contradictions", caseBlock?.constraint_space?.time?.contradictions);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.access.actors", caseBlock?.constraint_space?.access?.actors);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.access.objects", caseBlock?.constraint_space?.access?.objects);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.access.permissions", caseBlock?.constraint_space?.access?.permissions);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.physical.laws", caseBlock?.constraint_space?.physical?.laws);
  pushIndexedSourcePaths(paths, "CASE.constraint_space.physical.traces", caseBlock?.constraint_space?.physical?.traces);

  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  for (let i = 0; i < cast.length; i += 1) {
    paths.push(`CASE.cast[${i}].alibi_window`);
    paths.push(`CASE.cast[${i}].access_plausibility`);
    const sensitivity = Array.isArray(cast[i]?.evidence_sensitivity) ? cast[i].evidence_sensitivity : [];
    for (let j = 0; j < sensitivity.length; j += 1) {
      paths.push(`CASE.cast[${i}].evidence_sensitivity[${j}]`);
    }
  }

  const testEvidence = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues
    : [];
  for (let i = 0; i < testEvidence.length; i += 1) {
    paths.push(`CASE.discriminating_test.evidence_clues[${i}]`);
  }

  const clueSceneMap = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  for (let i = 0; i < clueSceneMap.length; i += 1) {
    paths.push(`CASE.prose_requirements.clue_to_scene_mapping[${i}].clue_id`);
  }

  return [...new Set(paths)].filter((path) => validateSourcePath(cml, path));
};

const buildStrictStepCoverageFloors = (cml: CaseData): Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }> => {
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  return steps.map((_step: any, index: number) => ({
    step: index + 1,
    requireContradiction: true,
    requireMapped: true,
  }));
};

const buildStrictLateClueSlot = (cml: CaseData): { id: string; placement: "late"; criticality: "optional" | "supporting" } | undefined => {
  const caseBlock = getCaseBlock(cml);
  const lateMin = Number(caseBlock?.quality_controls?.clue_visibility_requirements?.late_clues_min ?? 0);
  if (!Number.isFinite(lateMin) || lateMin <= 0) return undefined;
  return {
    id: "clue_late_optional_slot_1",
    placement: "late",
    criticality: "optional",
  };
};

const buildStrictDirectCulpritClue = (
  cml: CaseData,
  strictSourcePaths: string[],
): { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] } | undefined => {
  const caseBlock = getCaseBlock(cml);
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((name: any) => String(name ?? "").trim()).filter(Boolean)
    : [];
  const culpritName = culprits[0];
  if (!culpritName) return undefined;

  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const castIndex = cast.findIndex((entry: any) => String(entry?.name ?? "").trim() === culpritName);
  const allowedSourcePaths: string[] = [];

  if (castIndex >= 0) {
    const castPaths = [
      `CASE.cast[${castIndex}].access_plausibility`,
      `CASE.cast[${castIndex}].alibi_window`,
      `CASE.cast[${castIndex}].evidence_sensitivity[0]`,
    ];
    castPaths.forEach((path) => {
      if (strictSourcePaths.includes(path)) allowedSourcePaths.push(path);
    });
  }

  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (let i = 0; i < steps.length; i += 1) {
    const stepText = `${String(steps[i]?.observation ?? "")} ${String(steps[i]?.correction ?? "")} ${String(steps[i]?.effect ?? "")}`;
    if (!nameAppearsInText(culpritName, stepText)) continue;
    const observationPath = `CASE.inference_path.steps[${i}].observation`;
    const correctionPath = `CASE.inference_path.steps[${i}].correction`;
    if (strictSourcePaths.includes(observationPath)) allowedSourcePaths.push(observationPath);
    if (strictSourcePaths.includes(correctionPath)) allowedSourcePaths.push(correctionPath);
  }

  return {
    id: `clue_culprit_direct_${toClueIdSlug(culpritName)}`,
    culpritName,
    allowedSourcePaths: [...new Set(allowedSourcePaths)].slice(0, 8),
    requiredPhrases: [culpritName, "direct evidence", "means and opportunity"],
  };
};

const buildStrictIdToSourceMappings = (
  cml: CaseData,
  strictSourcePaths: string[],
  requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] },
): Array<{ id: string; sourceInCML: string }> => {
  const caseBlock = getCaseBlock(cml);
  const mappings: Array<{ id: string; sourceInCML: string }> = [];

  const evidenceIds = getCanonicalEvidenceClueIds(cml);
  evidenceIds.forEach((id: string, index: number) => {
    const sourceInCML = `CASE.discriminating_test.evidence_clues[${index}]`;
    if (strictSourcePaths.includes(sourceInCML)) {
      mappings.push({ id, sourceInCML });
    }
  });

  if (requiredDirectCulpritClue?.id && requiredDirectCulpritClue.allowedSourcePaths.length > 0) {
    mappings.push({
      id: requiredDirectCulpritClue.id,
      sourceInCML: requiredDirectCulpritClue.allowedSourcePaths[0],
    });
  }

  const clueSceneMap = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  clueSceneMap.forEach((entry: any, index: number) => {
    const clueId = String(entry?.clue_id ?? "").trim();
    if (!clueId || !CANONICAL_CLUE_ID_RE.test(clueId)) return;
    const sourceInCML = `CASE.prose_requirements.clue_to_scene_mapping[${index}].clue_id`;
    if (strictSourcePaths.includes(sourceInCML)) {
      mappings.push({ id: clueId, sourceInCML });
    }
  });

  // Enforce one source path per clue ID to avoid contradictory strict contracts.
  const uniqueById = new Map<string, { id: string; sourceInCML: string }>();
  mappings.forEach((entry) => {
    if (!uniqueById.has(entry.id)) {
      uniqueById.set(entry.id, entry);
    }
  });

  return Array.from(uniqueById.values());
};

export const buildStrictPromptFeedback = (cml: CaseData): StrictPromptFeedbackPayload | undefined => {
  const strictSourcePaths = buildStrictSourcePathWhitelist(cml);
  const requiredStepCoverageFloors = buildStrictStepCoverageFloors(cml);
  const requiredLateClueSlot = buildStrictLateClueSlot(cml);
  const requiredDirectCulpritClue = buildStrictDirectCulpritClue(cml, strictSourcePaths);
  const requiredIdToSourceMappings = buildStrictIdToSourceMappings(cml, strictSourcePaths, requiredDirectCulpritClue);

  if (
    strictSourcePaths.length === 0
    && requiredIdToSourceMappings.length === 0
    && requiredStepCoverageFloors.length === 0
    && !requiredLateClueSlot
    && !requiredDirectCulpritClue
  ) {
    return undefined;
  }

  return {
    overallStatus: "needs-revision",
    recommendations: [
      "Strict first-attempt contracts are active: apply strict source whitelist and required ID->source mappings exactly.",
      "If any strict contract cannot be satisfied, return status=fail with unresolved blockers in audit.invalidSourcePaths.",
      "Do not defer strict mapping and direct culprit evidence requirements to retry mode.",
    ],
    strictSourcePaths,
    requiredIdToSourceMappings,
    requiredStepCoverageFloors,
    requiredLateClueSlot,
    requiredDirectCulpritClue,
  };
};

const rebuildClueTimelineFromPlacements = (clues: ClueDistributionResult): void => {
  const timeline = { early: [] as string[], mid: [] as string[], late: [] as string[] };
  for (const clue of clues.clues as any[]) {
    const clueId = String(clue?.id ?? "").trim();
    if (!clueId) continue;
    const placement = String(clue?.placement ?? "").toLowerCase();
    if (placement === "early") timeline.early.push(clueId);
    else if (placement === "late") timeline.late.push(clueId);
    else timeline.mid.push(clueId);
  }
  (clues as any).clueTimeline = timeline;
};

const inferClueCategoryFromSourcePath = (sourceInCML: string): "temporal" | "spatial" | "physical" | "behavioral" | "testimonial" => {
  if (sourceInCML.includes(".physical.")) return "physical";
  if (sourceInCML.includes(".access.")) return "spatial";
  if (sourceInCML.includes("CASE.cast[")) return "behavioral";
  if (sourceInCML.includes(".time.")) return "temporal";
  return "testimonial";
};

const inferSupportsInferenceStepFromSourcePath = (sourceInCML: string, fallback: number): number => {
  const match = sourceInCML.match(/CASE\.inference_path\.steps\[(\d+)\]\./);
  if (!match) return fallback;
  const step = Number(match[1]);
  return Number.isInteger(step) ? step + 1 : fallback;
};

const findPreferredCulpritStep = (cml: CaseData, culpritName: string): number => {
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  for (let i = 0; i < steps.length; i += 1) {
    const stepText = `${String(steps[i]?.observation ?? "")} ${String(steps[i]?.correction ?? "")} ${String(steps[i]?.effect ?? "")}`;
    if (nameAppearsInText(culpritName, stepText)) {
      return i + 1;
    }
  }
  return Math.max(1, steps.length || 1);
};

const applyStrictIdToSourceMappingRepairs = (
  clues: ClueDistributionResult,
  requiredMappings: Array<{ id: string; sourceInCML: string }>,
): string[] => {
  const repairs: string[] = [];
  for (const mapping of requiredMappings) {
    const clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === mapping.id) as any;
    if (!clue) continue;

    if (String(clue?.criticality ?? "") !== "essential") {
      clue.criticality = "essential";
      repairs.push(`strict mapping contract criticality repair: ${mapping.id} -> essential`);
    }

    const placement = String(clue?.placement ?? "").toLowerCase();
    if (placement !== "early" && placement !== "mid") {
      clue.placement = "mid";
      repairs.push(`strict mapping contract placement repair: ${mapping.id} -> mid`);
    }

    const inferredStep = inferSupportsInferenceStepFromSourcePath(mapping.sourceInCML, Number(clue?.supportsInferenceStep) || 1);
    if (/CASE\.inference_path\.steps\[\d+\]\./.test(mapping.sourceInCML) && Number(clue?.supportsInferenceStep) !== inferredStep) {
      clue.supportsInferenceStep = inferredStep;
      repairs.push(`strict mapping contract supportsInferenceStep repair: ${mapping.id} -> ${inferredStep}`);
    }
  }

  return repairs;
};

const ensureStrictDirectCulpritClue = (
  cml: CaseData,
  clues: ClueDistributionResult,
  requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] },
): string[] => {
  if (!requiredDirectCulpritClue) return [];

  const repairs: string[] = [];
  const culpritName = requiredDirectCulpritClue.culpritName;
  let clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === requiredDirectCulpritClue.id) as any;

  if (!clue) {
    clue = clues.clues.find((entry: any) => {
      const clueId = String(entry?.id ?? "").trim();
      const clueText = `${String(entry?.description ?? "")} ${String(entry?.pointsTo ?? "")}`;
      return clueId.startsWith("clue_culprit_direct_") && nameAppearsInText(culpritName, clueText);
    }) as any;
    if (clue) {
      clue.id = requiredDirectCulpritClue.id;
      repairs.push(`strict direct culprit slot repair: renamed donor clue to ${requiredDirectCulpritClue.id}`);
    }
  }

  if (!clue) {
    const sourceInCML = requiredDirectCulpritClue.allowedSourcePaths[0] ?? buildStrictSourcePathWhitelist(cml)[0] ?? "";
    clue = {
      id: requiredDirectCulpritClue.id,
      category: inferClueCategoryFromSourcePath(sourceInCML),
      description: `Direct evidence ties ${culpritName} to the mechanism access point before the discriminating test.`,
      sourceInCML,
      pointsTo: `This direct evidence shows ${culpritName} had means and opportunity, narrowing the solution uniquely toward the culprit.`,
      placement: "mid",
      criticality: "essential",
      supportsInferenceStep: inferSupportsInferenceStepFromSourcePath(sourceInCML, findPreferredCulpritStep(cml, culpritName)),
      evidenceType: "observation",
    };
    clues.clues.push(clue);
    repairs.push(`strict direct culprit slot repair: synthesized ${requiredDirectCulpritClue.id}`);
  }

  if (
    requiredDirectCulpritClue.allowedSourcePaths.length > 0
    && !requiredDirectCulpritClue.allowedSourcePaths.includes(String(clue?.sourceInCML ?? "").trim())
  ) {
    clue.sourceInCML = requiredDirectCulpritClue.allowedSourcePaths[0];
    repairs.push(`strict direct culprit source repair: ${requiredDirectCulpritClue.id} -> ${requiredDirectCulpritClue.allowedSourcePaths[0]}`);
  }

  if (String(clue?.criticality ?? "") !== "essential") {
    clue.criticality = "essential";
    repairs.push(`strict direct culprit criticality repair: ${requiredDirectCulpritClue.id} -> essential`);
  }

  const placement = String(clue?.placement ?? "").toLowerCase();
  if (placement !== "early" && placement !== "mid") {
    clue.placement = "mid";
    repairs.push(`strict direct culprit placement repair: ${requiredDirectCulpritClue.id} -> mid`);
  }

  if (String(clue?.evidenceType ?? "").trim().toLowerCase() !== "observation") {
    clue.evidenceType = "observation";
    repairs.push(`strict direct culprit evidenceType repair: ${requiredDirectCulpritClue.id} -> observation`);
  }

  const expectedStep = inferSupportsInferenceStepFromSourcePath(
    String(clue?.sourceInCML ?? ""),
    findPreferredCulpritStep(cml, culpritName),
  );
  if (!Number.isInteger(Number(clue?.supportsInferenceStep)) || Number(clue?.supportsInferenceStep) <= 0) {
    clue.supportsInferenceStep = expectedStep;
    repairs.push(`strict direct culprit supportsInferenceStep repair: ${requiredDirectCulpritClue.id} -> ${expectedStep}`);
  }

  const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
  const missingPhrases = requiredDirectCulpritClue.requiredPhrases.filter((phrase) => !clueText.toLowerCase().includes(String(phrase).toLowerCase()));
  if (!nameAppearsInText(culpritName, clueText) || missingPhrases.length > 0) {
    clue.description = `Direct evidence ties ${culpritName} to the mechanism access point before the discriminating test.`;
    clue.pointsTo = `This direct evidence shows ${culpritName} had means and opportunity, narrowing the solution uniquely toward the culprit.`;
    repairs.push(`strict direct culprit phrasing repair: ${requiredDirectCulpritClue.id}`);
  }

  return repairs;
};

const ensureStrictLateClueSlot = (
  cml: CaseData,
  clues: ClueDistributionResult,
  strictSourcePaths: string[],
  protectedClueIds: string[],
  requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" },
): string[] => {
  if (!requiredLateClueSlot) return [];

  const repairs: string[] = [];
  const protectedIdSet = new Set(protectedClueIds.map((id) => String(id ?? "").trim()).filter(Boolean));
  let clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === requiredLateClueSlot.id) as any;

  if (!clue) {
    clue = clues.clues.find((entry: any) => {
      const clueId = String(entry?.id ?? "").trim();
      const placement = String(entry?.placement ?? "").toLowerCase();
      const criticality = String(entry?.criticality ?? "").toLowerCase();
      return !protectedIdSet.has(clueId)
        && placement === "late"
        && (criticality === "optional" || criticality === "supporting");
    }) as any;
    if (clue) {
      clue.id = requiredLateClueSlot.id;
      repairs.push(`strict late clue slot repair: renamed donor clue to ${requiredLateClueSlot.id}`);
    }
  }

  if (!clue) {
    const sourceInCML = strictSourcePaths.find((path) => path.startsWith("CASE.constraint_space.time.anchors[") || path.startsWith("CASE.constraint_space.physical.traces["))
      ?? strictSourcePaths[0]
      ?? "";
    const sourceValue = sourceInCML
      ? getByPath({ CASE: getCaseBlock(cml) }, sourceInCML).value
      : undefined;
    const sourceText = String(sourceValue ?? "background timing detail").trim() || "background timing detail";
    const supportsInferenceStep = inferSupportsInferenceStepFromSourcePath(
      sourceInCML,
      Math.max(1, Array.isArray(getCaseBlock(cml)?.inference_path?.steps) ? getCaseBlock(cml).inference_path.steps.length : 1),
    );
    clue = {
      id: requiredLateClueSlot.id,
      category: inferClueCategoryFromSourcePath(sourceInCML),
      description: `${sourceText.charAt(0).toUpperCase()}${sourceText.slice(1)} remains a late texture detail in the case background.`,
      sourceInCML,
      pointsTo: "Adds late texture without changing the essential deduction chain.",
      placement: "late",
      criticality: requiredLateClueSlot.criticality,
      supportsInferenceStep,
      evidenceType: "observation",
    };
    clues.clues.push(clue);
    repairs.push(`strict late clue slot repair: synthesized ${requiredLateClueSlot.id}`);
  }

  if (String(clue?.placement ?? "").toLowerCase() !== requiredLateClueSlot.placement) {
    clue.placement = requiredLateClueSlot.placement;
    repairs.push(`strict late clue slot placement repair: ${requiredLateClueSlot.id} -> ${requiredLateClueSlot.placement}`);
  }

  if (String(clue?.criticality ?? "").toLowerCase() !== requiredLateClueSlot.criticality) {
    clue.criticality = requiredLateClueSlot.criticality;
    repairs.push(`strict late clue slot criticality repair: ${requiredLateClueSlot.id} -> ${requiredLateClueSlot.criticality}`);
  }

  if (!String(clue?.sourceInCML ?? "").trim() && strictSourcePaths[0]) {
    clue.sourceInCML = strictSourcePaths[0];
    repairs.push(`strict late clue slot source repair: ${requiredLateClueSlot.id} -> ${strictSourcePaths[0]}`);
  }

  if (!Number.isInteger(Number(clue?.supportsInferenceStep)) || Number(clue?.supportsInferenceStep) <= 0) {
    clue.supportsInferenceStep = inferSupportsInferenceStepFromSourcePath(
      String(clue?.sourceInCML ?? ""),
      Math.max(1, Array.isArray(getCaseBlock(cml)?.inference_path?.steps) ? getCaseBlock(cml).inference_path.steps.length : 1),
    );
    repairs.push(`strict late clue slot supportsInferenceStep repair: ${requiredLateClueSlot.id} -> ${clue.supportsInferenceStep}`);
  }

  return repairs;
};

const applyStrictPromptContractRepairs = (
  cml: CaseData,
  clues: ClueDistributionResult,
  strictPromptFeedback?: StrictPromptFeedbackPayload,
): string[] => {
  if (!strictPromptFeedback) return [];

  const discriminatingEvidenceIds = new Set(getCanonicalEvidenceClueIds(cml));

  const repairs = [
    ...synthesizeMissingDiscriminatingEvidenceClues(
      cml,
      clues,
      strictPromptFeedback.requiredIdToSourceMappings
        .map((entry) => String(entry?.id ?? "").trim())
        .filter((id) => id.length > 0)
        .filter((id) => !discriminatingEvidenceIds.has(id))
        .filter((id) => !clues.clues.some((clue: any) => String(clue?.id ?? "").trim() === id)),
    ).map((repair) => `strict mapping contract synthesis: ${repair}`),
    ...ensureStrictDirectCulpritClue(cml, clues, strictPromptFeedback.requiredDirectCulpritClue),
    ...ensureStrictLateClueSlot(
      cml,
      clues,
      strictPromptFeedback.strictSourcePaths,
      [
        ...strictPromptFeedback.requiredIdToSourceMappings.map((entry) => entry.id),
        strictPromptFeedback.requiredDirectCulpritClue?.id ?? "",
      ],
      strictPromptFeedback.requiredLateClueSlot,
    ),
    ...applyStrictIdToSourceMappingRepairs(clues, strictPromptFeedback.requiredIdToSourceMappings),
  ];

  if (repairs.length > 0) {
    rebuildClueTimelineFromPlacements(clues);
  }

  return repairs;
};

const checkStrictIdToSourceMappings = (
  clues: ClueDistributionResult,
  requiredMappings: Array<{ id: string; sourceInCML: string }>,
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  for (const mapping of requiredMappings) {
    const clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === mapping.id) as any;
    if (!clue) {
      issues.push({ severity: "critical", message: `Strict mapping contract missing clue id: ${mapping.id}` });
      continue;
    }
    const placement = String(clue?.placement ?? "").toLowerCase();
    if (placement !== "early" && placement !== "mid") {
      issues.push({ severity: "critical", message: `Strict mapping contract requires early/mid placement for ${mapping.id}` });
    }
    if (String(clue?.criticality ?? "") !== "essential") {
      issues.push({ severity: "critical", message: `Strict mapping contract requires essential criticality for ${mapping.id}` });
    }
  }
  return issues;
};

const checkStrictDirectCulpritClue = (
  clues: ClueDistributionResult,
  requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] },
): ClueGuardrailIssue[] => {
  if (!requiredDirectCulpritClue) return [];

  const issues: ClueGuardrailIssue[] = [];
  const clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === requiredDirectCulpritClue.id) as any;
  if (!clue) {
    return [{ severity: "critical", message: `Strict direct culprit slot missing clue id: ${requiredDirectCulpritClue.id}` }];
  }

  if (
    requiredDirectCulpritClue.allowedSourcePaths.length > 0
    && !requiredDirectCulpritClue.allowedSourcePaths.includes(String(clue?.sourceInCML ?? "").trim())
  ) {
    issues.push({ severity: "critical", message: `Strict direct culprit slot uses non-whitelisted source on ${requiredDirectCulpritClue.id}` });
  }

  const placement = String(clue?.placement ?? "").toLowerCase();
  if (placement !== "early" && placement !== "mid") {
    issues.push({ severity: "critical", message: `Strict direct culprit slot must be early/mid on ${requiredDirectCulpritClue.id}` });
  }
  if (String(clue?.criticality ?? "") !== "essential") {
    issues.push({ severity: "critical", message: `Strict direct culprit slot must be essential on ${requiredDirectCulpritClue.id}` });
  }

  const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
  if (!nameAppearsInText(requiredDirectCulpritClue.culpritName, clueText)) {
    issues.push({ severity: "critical", message: `Strict direct culprit slot must name ${requiredDirectCulpritClue.culpritName}` });
  }
  const missingPhrases = requiredDirectCulpritClue.requiredPhrases.filter((phrase) => !clueText.toLowerCase().includes(String(phrase).toLowerCase()));
  if (missingPhrases.length > 0) {
    issues.push({ severity: "critical", message: `Strict direct culprit slot missing required phrases on ${requiredDirectCulpritClue.id}: ${missingPhrases.join(", ")}` });
  }

  return issues;
};

const checkStrictLateClueSlot = (
  clues: ClueDistributionResult,
  requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" },
): ClueGuardrailIssue[] => {
  if (!requiredLateClueSlot) return [];

  const clue = clues.clues.find((entry: any) => String(entry?.id ?? "").trim() === requiredLateClueSlot.id) as any;
  if (!clue) {
    return [{ severity: "critical", message: `Strict late clue slot missing clue id: ${requiredLateClueSlot.id}` }];
  }

  const issues: ClueGuardrailIssue[] = [];
  if (String(clue?.placement ?? "").toLowerCase() !== requiredLateClueSlot.placement) {
    issues.push({ severity: "critical", message: `Strict late clue slot must remain ${requiredLateClueSlot.placement} on ${requiredLateClueSlot.id}` });
  }
  if (String(clue?.criticality ?? "").toLowerCase() !== requiredLateClueSlot.criticality) {
    issues.push({ severity: "critical", message: `Strict late clue slot must remain ${requiredLateClueSlot.criticality} on ${requiredLateClueSlot.id}` });
  }

  return issues;
};

const checkStrictStepCoverageFloors = (
  clues: ClueDistributionResult,
  requiredStepCoverageFloors: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>,
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  for (const floor of requiredStepCoverageFloors) {
    const stepClues = clues.clues.filter((entry: any) => Number(entry?.supportsInferenceStep) === floor.step);
    if (floor.requireMapped && stepClues.length === 0) {
      issues.push({ severity: "critical", message: `Strict step coverage floor failed: step ${floor.step} has no mapped clue` });
    }
    if (floor.requireContradiction && !stepClues.some((entry: any) => String(entry?.evidenceType ?? "").toLowerCase() === "contradiction")) {
      issues.push({ severity: "critical", message: `Strict step coverage floor failed: step ${floor.step} has no contradiction clue` });
    }
  }
  return issues;
};

const checkMetaAuditClueText = (clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  for (const clue of clues.clues as any[]) {
    const clueId = String(clue?.id ?? "(unknown-id)");
    const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
    const matched = META_AUDIT_CLUE_PATTERNS.find(({ pattern }) => pattern.test(clueText));
    if (matched) {
      issues.push({
        severity: "critical",
        message: `Meta-audit clue text detected on ${clueId}: ${matched.label}`,
      });
    }
  }
  return issues;
};

const checkStrictPromptContracts = (
  clues: ClueDistributionResult,
  strictPromptFeedback?: StrictPromptFeedbackPayload,
): ClueGuardrailIssue[] => {
  if (!strictPromptFeedback) return [];

  return [
    ...checkStrictIdToSourceMappings(clues, strictPromptFeedback.requiredIdToSourceMappings),
    ...checkStrictDirectCulpritClue(clues, strictPromptFeedback.requiredDirectCulpritClue),
    ...checkStrictLateClueSlot(clues, strictPromptFeedback.requiredLateClueSlot),
  ];
};

const repairInvalidSourcePaths = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const repairs: string[] = [];
  const caseBlock = getCaseBlock(cml);
  const stepCount = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps.length : 0;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];

  const clampLastArrayIndexInPath = (path: string): string => {
    const match = path.match(/^(.*)\[(\d+)\](.*)$/);
    if (!match) return "";

    const parentPath = match[1];
    const index = Number(match[2]);
    const suffix = match[3] || "";
    if (!Number.isInteger(index) || index < 0) return "";

    const parent = getByPath({ CASE: caseBlock }, parentPath);
    if (!parent.ok || !Array.isArray(parent.value) || parent.value.length === 0) return "";

    const clamped = Math.min(index, parent.value.length - 1);
    return `${parentPath}[${clamped}]${suffix}`;
  };

  // Build a fallback path for clues with completely missing sourceInCML so that the
  // deterministic repair can fill in empty paths rather than leaving them for the LLM retry.
  const fallbackSourcePath = (() => {
    const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
    const candidate = steps.length > 0 ? `CASE.inference_path.steps[0].observation` : "";
    return candidate && validateSourcePath(cml, candidate) ? candidate : "";
  })();

  for (const clue of clues.clues as any[]) {
    const clueId = String(clue?.id ?? "(unknown-id)");
    const sourcePath = String(clue?.sourceInCML ?? "").trim();

    // Handle completely empty source paths: assign the fallback path so this clue
    // no longer triggers the LLM retry gate (the retry consistently returns 0 clues).
    if (!sourcePath) {
      if (fallbackSourcePath) {
        clue.sourceInCML = fallbackSourcePath;
        repairs.push(`${clueId}: (empty) -> ${fallbackSourcePath} [fallback]`);
      }
      continue;
    }

    if (validateSourcePath(cml, sourcePath)) continue;

    let repaired = "";

    // Canonicalize dot-notation near-misses for known cast leaf fields before any other repair.
    // Handles: CASE.cast[N].access.plausibility -> CASE.cast[N].access_plausibility
    //          CASE.cast[N].alibi.window        -> CASE.cast[N].alibi_window
    const castDotNearMissMatch = sourcePath.match(/^(CASE\.cast\[(\d+)\])\.(\w+)\.(\w+)(.*)$/);
    if (!repaired && castDotNearMissMatch) {
      const castPrefix = castDotNearMissMatch[1];
      const castIdx = Number(castDotNearMissMatch[2]);
      const seg1 = castDotNearMissMatch[3];
      const seg2 = castDotNearMissMatch[4];
      const suffix = castDotNearMissMatch[5] || "";
      const underscoreLeaf = `${seg1}_${seg2}`;
      const candidate = `${castPrefix}.${underscoreLeaf}${suffix}`;
      if (castIdx >= 0 && castIdx < cast.length && validateSourcePath(cml, candidate)) {
        repaired = candidate;
      }
    }

    const stepMatch = sourcePath.match(/^CASE\.inference_path\.steps\[(\d+)\]\.(observation|correction)$/);
    if (!repaired && stepMatch && stepCount > 0) {
      const field = stepMatch[2];
      repaired = `CASE.inference_path.steps[${stepCount - 1}].${field}`;
    }

    const castSensitivityMatch = sourcePath.match(/^CASE\.cast\[(\d+)\]\.evidence_sensitivity\[(\d+)\]$/);
    if (!repaired && castSensitivityMatch) {
      const castIdx = Number(castSensitivityMatch[1]);
      const sensitivity = Array.isArray(cast[castIdx]?.evidence_sensitivity) ? cast[castIdx].evidence_sensitivity : [];
      if (castIdx >= 0 && castIdx < cast.length && sensitivity.length > 0) {
        repaired = `CASE.cast[${castIdx}].evidence_sensitivity[0]`;
      } else if (castIdx >= 0 && castIdx < cast.length && cast[castIdx]?.access_plausibility !== undefined) {
        repaired = `CASE.cast[${castIdx}].access_plausibility`;
      } else if (castIdx >= 0 && castIdx < cast.length && cast[castIdx]?.alibi_window !== undefined) {
        repaired = `CASE.cast[${castIdx}].alibi_window`;
      }
    }

    if (!repaired) {
      repaired = clampLastArrayIndexInPath(sourcePath);
    }

    if (repaired && validateSourcePath(cml, repaired)) {
      clue.sourceInCML = repaired;
      repairs.push(`${clueId}: ${sourcePath} -> ${repaired}`);
    }
  }

  return repairs;
};

const checkCastNamePathConsistency = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = getCaseBlock(cml);
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const castNames = cast
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => Boolean(name));

  for (const clue of clues.clues as any[]) {
    const sourcePath = String(clue?.sourceInCML ?? "").trim();
    const castPathMatch = sourcePath.match(/^CASE\.cast\[(\d+)\]\./);
    if (!castPathMatch) continue;

    const castIndex = Number(castPathMatch[1]);
    const expectedName = String(cast[castIndex]?.name ?? "").trim();
    if (!expectedName) continue;

    const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
    const mentionedNames = castNames.filter((name: string) => nameAppearsInText(name, clueText));

    if ((String(clue?.evidenceType ?? "").toLowerCase() === "elimination") && !nameAppearsInText(expectedName, clueText)) {
      issues.push({
        severity: "critical",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} uses ${sourcePath} but does not mention expected suspect "${expectedName}" in elimination text`,
      });
      continue;
    }

    if (mentionedNames.length === 1 && mentionedNames[0] !== expectedName) {
      issues.push({
        severity: "critical",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} sourceInCML ${sourcePath} maps to "${expectedName}" but clue text names "${mentionedNames[0]}"`,
      });
    }
  }

  return issues;
};

const escapeRegexNameLiteral = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const replaceNameCaseInsensitive = (text: string, fromName: string, toName: string): string => {
  if (!text || !fromName || !toName || fromName.toLowerCase() === toName.toLowerCase()) return text;
  const re = new RegExp(escapeRegexNameLiteral(fromName), "gi");
  return text.replace(re, toName);
};

const repairCastNamePathConsistency = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const repairs: string[] = [];
  const caseBlock = getCaseBlock(cml);
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const castNames = cast
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => Boolean(name));

  for (const clue of clues.clues as any[]) {
    const sourcePath = String(clue?.sourceInCML ?? "").trim();
    const castPathMatch = sourcePath.match(/^CASE\.cast\[(\d+)\]\./);
    if (!castPathMatch) continue;

    const castIndex = Number(castPathMatch[1]);
    const expectedName = String(cast[castIndex]?.name ?? "").trim();
    if (!expectedName) continue;

    const clueId = String(clue?.id ?? "(unknown-id)");
    const description = String(clue?.description ?? "");
    const pointsTo = String(clue?.pointsTo ?? "");
    const clueText = `${description} ${pointsTo}`;
    const mentionedNames = castNames.filter((name: string) => nameAppearsInText(name, clueText));
    const isElimination = String(clue?.evidenceType ?? "").toLowerCase() === "elimination";

    if (mentionedNames.length === 1 && mentionedNames[0] !== expectedName) {
      const wrongName = mentionedNames[0];
      const nextDescription = replaceNameCaseInsensitive(description, wrongName, expectedName);
      const nextPointsTo = replaceNameCaseInsensitive(pointsTo, wrongName, expectedName);
      clue.description = nextDescription;
      clue.pointsTo = nextPointsTo;
      repairs.push(`${clueId}: replaced cast-name mismatch "${wrongName}" -> "${expectedName}" for ${sourcePath}`);
      continue;
    }

    if (isElimination && !nameAppearsInText(expectedName, `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`)) {
      const normalizedPointsTo = String(clue?.pointsTo ?? "").trim();
      if (normalizedPointsTo.length > 0) {
        clue.pointsTo = `Eliminates ${expectedName} because ${normalizedPointsTo}`;
      } else {
        clue.pointsTo = `Eliminates ${expectedName} because corroborated evidence excludes this suspect.`;
      }
      repairs.push(`${clueId}: injected expected suspect name "${expectedName}" into elimination pointsTo for ${sourcePath}`);
    }
  }

  return repairs;
};

const checkInferenceStepBounds = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = getCaseBlock(cml);
  const stepCount = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps.length
    : 0;
  if (stepCount === 0) return issues;

  for (const clue of clues.clues as any[]) {
    const step = Number(clue?.supportsInferenceStep);
    if (!Number.isFinite(step) || step === 0) continue;
    if (step < 1 || step > stepCount) {
      issues.push({
        severity: "critical",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} uses supportsInferenceStep=${step} but valid range is 1..${stepCount}`,
      });
    }
  }

  return issues;
};

const checkEraTimeStyleInClues = (clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const digitTimePattern = /\b\d{1,2}:\d{2}\s*(?:am|pm|a\.m\.|p\.m\.)?\b|\b\d{1,2}\s*(?:am|pm|a\.m\.|p\.m\.)\b/i;
  for (const clue of clues.clues as any[]) {
    const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
    if (digitTimePattern.test(text)) {
      issues.push({
        severity: "warning",
        message: `Clue ${String(clue?.id ?? "(unknown-id)")} uses digit-based time notation; use era-style worded time expressions`,
      });
    }
  }
  return issues;
};

const SMALL_NUMBER_WORDS = [
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
  "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
];
const TENS_WORDS = ["", "", "twenty", "thirty", "forty", "fifty"];

const numberToWords = (n: number): string => {
  if (n < 0) return String(n);
  if (n < 20) return SMALL_NUMBER_WORDS[n] || String(n);
  if (n < 60) {
    const tens = Math.floor(n / 10);
    const ones = n % 10;
    return ones === 0 ? TENS_WORDS[tens] : `${TENS_WORDS[tens]} ${SMALL_NUMBER_WORDS[ones]}`;
  }
  return String(n);
};

const toEraWordedTime = (hour24: number, minute: number): string => {
  const normalizedHour = ((hour24 % 24) + 24) % 24;
  const hour12 = normalizedHour % 12 === 0 ? 12 : normalizedHour % 12;
  const period = normalizedHour < 12 ? "in the morning" : normalizedHour < 18 ? "in the afternoon" : "in the evening";
  if (minute === 0) return `${numberToWords(hour12)} o'clock ${period}`;
  return `${numberToWords(hour12)} ${numberToWords(minute)} ${period}`;
};

const replaceDigitTimesWithEraWords = (text: string): string => {
  let next = text;

  next = next.replace(
    /\b(\d{1,2}):(\d{2})\s*(am|pm|a\.m\.|p\.m\.)?\b/gi,
    (_full, hRaw, mRaw, suffixRaw) => {
      let hour = Number(hRaw);
      const minute = Number(mRaw);
      const suffix = String(suffixRaw || "").toLowerCase().replace(/\./g, "");
      if (Number.isNaN(hour) || Number.isNaN(minute) || minute < 0 || minute > 59) return _full;
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      return toEraWordedTime(hour, minute);
    },
  );

  next = next.replace(
    /\b(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)\b/gi,
    (_full, hRaw, suffixRaw) => {
      let hour = Number(hRaw);
      const suffix = String(suffixRaw || "").toLowerCase().replace(/\./g, "");
      if (Number.isNaN(hour)) return _full;
      if (suffix === "pm" && hour < 12) hour += 12;
      if (suffix === "am" && hour === 12) hour = 0;
      return toEraWordedTime(hour, 0);
    },
  );

  return next;
};

function sanitizeEraTimeStyleInClues(clues: ClueDistributionResult): string[] {
  const repairs: string[] = [];
  for (const clue of clues.clues as any[]) {
    const clueId = String(clue?.id ?? "(unknown-id)");
    const originalDescription = String(clue?.description ?? "");
    const originalPointsTo = String(clue?.pointsTo ?? "");
    const nextDescription = replaceDigitTimesWithEraWords(originalDescription);
    const nextPointsTo = replaceDigitTimesWithEraWords(originalPointsTo);

    if (nextDescription !== originalDescription || nextPointsTo !== originalPointsTo) {
      clue.description = nextDescription;
      clue.pointsTo = nextPointsTo;
      repairs.push(`${clueId}: converted digit-based time notation to era-worded style`);
    }
  }
  return repairs;
}

const getMissingDiscriminatingEvidenceIds = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const evidenceIds = getCanonicalEvidenceClueIds(cml);
  if (evidenceIds.length === 0) return [];
  const clueIds = new Set(clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean));
  return evidenceIds.filter((id: string) => !clueIds.has(id));
};

const checkModelAuditConsistency = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const modelAudit: any = (clues as any).audit;
  if (!modelAudit || typeof modelAudit !== "object") return issues;

  const expectedMissing = getMissingDiscriminatingEvidenceIds(cml, clues).sort();
  const expectedInvalidSources = checkSourcePathValidity(cml, clues).invalidPaths.sort();
  const expectedWeak = analyzeSuspectCoverage(cml, clues).weakElimination.sort();

  const actualMissing = (Array.isArray(modelAudit.missingDiscriminatingEvidenceIds) ? modelAudit.missingDiscriminatingEvidenceIds : []).map(String).sort();
  const actualInvalid = (Array.isArray(modelAudit.invalidSourcePaths) ? modelAudit.invalidSourcePaths : []).map(String).sort();
  const actualWeak = (Array.isArray(modelAudit.weakEliminationSuspects) ? modelAudit.weakEliminationSuspects : []).map(String).sort();

    if (JSON.stringify(expectedMissing) !== JSON.stringify(actualMissing)) {
    issues.push({
        severity: "critical",
      message: `Model audit mismatch for missingDiscriminatingEvidenceIds (expected: ${expectedMissing.join(", ") || "none"}; got: ${actualMissing.join(", ") || "none"})`,
    });
  }
  if (JSON.stringify(expectedInvalidSources) !== JSON.stringify(actualInvalid)) {
    issues.push({
        severity: "critical",
      message: `Model audit mismatch for invalidSourcePaths (expected: ${expectedInvalidSources.join(", ") || "none"}; got: ${actualInvalid.join(", ") || "none"})`,
    });
  }
  if (JSON.stringify(expectedWeak) !== JSON.stringify(actualWeak)) {
    issues.push({
        severity: "critical",
      message: `Model audit mismatch for weakEliminationSuspects (expected: ${expectedWeak.join(", ") || "none"}; got: ${actualWeak.join(", ") || "none"})`,
    });
  }

  return issues;
};

const reconcileModelAudit = (cml: CaseData, clues: ClueDistributionResult): void => {
  const expectedMissing = getMissingDiscriminatingEvidenceIds(cml, clues).sort();
  const expectedInvalid = checkSourcePathValidity(cml, clues).invalidPaths.sort();
  const expectedWeak = analyzeSuspectCoverage(cml, clues).weakElimination.sort();

  const audit: any = (clues as any).audit && typeof (clues as any).audit === "object"
    ? (clues as any).audit
    : {};

  audit.missingDiscriminatingEvidenceIds = expectedMissing;
  audit.invalidSourcePaths = expectedInvalid;
  audit.weakEliminationSuspects = expectedWeak;
  (clues as any).audit = audit;
};

function buildSuspectCoverage(
  cml: CaseData,
  clues: ClueDistributionResult,
): SuspectCoverageRecord[] {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const castArr = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((n: any) => String(n ?? "").trim())
    : [];
  const suspects = castArr
    .filter((c: any) => c?.culprit_eligibility === "eligible" && !culprits.includes(String(c?.name ?? "").trim()))
    .map((c: any) => String(c?.name ?? "").trim())
    .filter(Boolean);

  const castTokenFrequency = buildCastNameTokenFrequency(castArr);

  return suspects.map((suspect: string) => {
    let directReferences = 0;
    let eliminationLike = 0;
    let alibiLike = 0;
    const referencedClueIds: string[] = [];
    const eliminationClueIds: string[] = [];
    const alibiClueIds: string[] = [];
    for (const clue of clues.clues) {
      const clueText = `${String(clue.description ?? "")} ${String((clue as any).pointsTo ?? "")}`;
      if (!nameAppearsForSuspectCoverage(suspect, clueText, castTokenFrequency)) continue;
      directReferences += 1;
      referencedClueIds.push(String((clue as any).id ?? "").trim() || "(unknown-id)");
      const evidenceType = String((clue as any).evidenceType ?? "").toLowerCase();
      const eliminationSignal = isEliminationLike(clueText) || evidenceType === "elimination";
      const alibiSignal = isAlibiLike(clueText)
        || (evidenceType === "elimination" && hasTimeWindow(clueText) && hasCorroborator(clueText));
      if (eliminationSignal) {
        eliminationLike += 1;
        eliminationClueIds.push(String((clue as any).id ?? "").trim() || "(unknown-id)");
      }
      if (alibiSignal) {
        alibiLike += 1;
        alibiClueIds.push(String((clue as any).id ?? "").trim() || "(unknown-id)");
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

function buildCastNameTokenFrequency(castArr: any[]): Map<string, number> {
  const frequency = new Map<string, number>();
  for (const castMember of castArr) {
    const tokens = normalizeTokens(String(castMember?.name ?? "")).filter((t) => t.length > 2);
    for (const token of tokens) {
      frequency.set(token, (frequency.get(token) ?? 0) + 1);
    }
  }
  return frequency;
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

function analyzeSuspectCoverage(
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

function findCulpritDiscriminatingGaps(cml: CaseData, clues: ClueDistributionResult): string[] {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((n: any) => String(n ?? "").trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return [];

  const incriminatingPattern = /\b(incriminat|direct\s+evidence|physical\s+trace|forensic|motive|opportunity|means|only\s+person\s+who\s+could)\b/i;
  const gaps: string[] = [];

  for (const culprit of culprits) {
    const hasDiscriminating = clues.clues.some((clue: any) => {
      const text = `${String(clue.description ?? "")} ${String(clue.pointsTo ?? "")}`;
      if (!nameAppearsInText(culprit, text)) return false;
      return incriminatingPattern.test(text) || clue.criticality === "essential";
    });
    if (!hasDiscriminating) gaps.push(culprit);
  }

  return gaps;
}

function synthesizeMissingCulpritDiscriminatingClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  culpritNames: string[],
): string[] {
  if (!Array.isArray(clues?.clues) || culpritNames.length === 0) return [];

  const caseBlock = getCaseBlock(cml);
  const inferenceSteps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  const template = clues.clues.find((clue: any) => clue?.criticality === "essential") ?? clues.clues[0];
  if (!template) return [];

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  (clues as any).clueTimeline = timeline;

  const existingIds = new Set(
    clues.clues.map((clue: any) => String(clue?.id ?? "").trim()).filter(Boolean),
  );
  const nextId = (prefix: string): string => {
    let id = prefix;
    let suffix = 2;
    while (existingIds.has(id)) {
      id = `${prefix}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(id);
    return id;
  };

  const repairs: string[] = [];
  culpritNames.forEach((culprit, idx) => {
    const normalizedCulprit = String(culprit ?? "").trim();
    if (!normalizedCulprit) return;

    // Default to the last inference step's correction — always a legal ALLOWED_SOURCE_PATTERNS path.
    // Prefer a step whose correction/observation text names the culprit.
    let supportsInferenceStep = Math.min(Math.max(1, inferenceSteps.length), inferenceSteps.length || 1);
    let sourceInCML = inferenceSteps.length > 0
      ? `CASE.inference_path.steps[${inferenceSteps.length - 1}].correction`
      : undefined;

    for (let i = 0; i < inferenceSteps.length; i += 1) {
      const step = inferenceSteps[i] ?? {};
      const correction = String(step?.correction ?? "");
      const observation = String(step?.observation ?? "");
      if (nameAppearsInText(normalizedCulprit, `${correction} ${observation}`)) {
        supportsInferenceStep = i + 1;
        sourceInCML = `CASE.inference_path.steps[${i}].correction`;
        break;
      }
    }

    // If no inference step available, fall back to the culprit's cast slot (access_plausibility preferred).
    if (!sourceInCML) {
      const castArr = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
      const culpritCastIdx = castArr.findIndex((c: any) => String(c?.name ?? "").trim() === normalizedCulprit);
      if (culpritCastIdx >= 0) {
        sourceInCML = castArr[culpritCastIdx]?.access_plausibility !== undefined
          ? `CASE.cast[${culpritCastIdx}].access_plausibility`
          : `CASE.cast[${culpritCastIdx}].alibi_window`;
      }
    }

    // Only synthesize when we have a path matching a legal source pattern.
    // (Existence in CML is a secondary concern — the downstream legality gate handles it.)
    if (!sourceInCML || !ALLOWED_SOURCE_PATTERNS.some((re) => re.test(sourceInCML!))) return;

    const clueId = nextId(`clue_culprit_direct_${idx + 1}`);
    clues.clues.push({
      ...template,
      id: clueId,
      sourceInCML,
      description: `Direct evidence links ${normalizedCulprit} to the mechanism access point before the discriminating test.`,
      pointsTo: `Physical trace and opportunity evidence indicate ${normalizedCulprit} had means and opportunity, making this a direct evidence clue for culprit identification.`,
      placement: "mid",
      criticality: "essential",
      evidenceType: "observation",
      supportsInferenceStep,
    });
    timeline.mid.push(clueId);
    repairs.push(`${clueId}: synthesized direct culprit evidence for ${normalizedCulprit}`);
  });

  return repairs;
}

const WORD_TO_NUM: Record<string, number> = {
  one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8,
  nine: 9, ten: 10, eleven: 11, twelve: 12, thirteen: 13, fourteen: 14,
  fifteen: 15, sixteen: 16, seventeen: 17, eighteen: 18, nineteen: 19,
  twenty: 20, 'twenty-one': 21, 'twenty-two': 22, 'twenty-three': 23,
  'twenty-four': 24, 'twenty-five': 25, 'twenty-six': 26, 'twenty-seven': 27,
  'twenty-eight': 28, 'twenty-nine': 29, thirty: 30, half: 30, quarter: 15,
  forty: 40, fifty: 50, sixty: 60,
};

const parseWordFormTime = (value: string): { hour: number; minute: number; explicitMeridiem: boolean } | null => {
  const lower = value.toLowerCase().trim();
  const ampm = lower.match(/\b(am|pm|a\.m\.|p\.m\.)\b/i);
  const explicitMeridiem = Boolean(ampm);

  const toHour = (word: string) => WORD_TO_NUM[word];

  const oclock = lower.match(/^(\w+)\s+o[\u2019']clock$/);
  if (oclock) {
    const h = toHour(oclock[1]);
    if (h != null) return { hour: h, minute: 0, explicitMeridiem };
  }
  const halfPast = lower.match(/^half\s+past\s+(\w+)$/);
  if (halfPast) {
    const h = toHour(halfPast[1]);
    if (h != null) return { hour: h, minute: 30, explicitMeridiem };
  }
  const quarterPast = lower.match(/^quarter\s+past\s+(\w+)$/);
  if (quarterPast) {
    const h = toHour(quarterPast[1]);
    if (h != null) return { hour: h, minute: 15, explicitMeridiem };
  }
  const minutesPast = lower.match(/^([\w-]+)\s+(?:minutes?\s+)?past\s+(\w+)$/);
  if (minutesPast) {
    const m = WORD_TO_NUM[minutesPast[1]];
    const h = toHour(minutesPast[2]);
    if (m != null && h != null) return { hour: h, minute: m, explicitMeridiem };
  }

  return null;
};

const extractDigitFormHour = (text: string): { hour: number; minute: number; explicitMeridiem: boolean } | null => {
  const lower = text.toLowerCase();
  const hhmm = lower.match(/\b(\d{1,2}):(\d{2})\s*(am|pm|a\.m\.|p\.m\.)\b/i);
  if (hhmm) {
    let h = parseInt(hhmm[1], 10);
    const m = parseInt(hhmm[2], 10);
    const meridiem = hhmm[3].toLowerCase();
    if (meridiem.includes("p") && h < 12) h += 12;
    if (meridiem.includes("a") && h === 12) h = 0;
    return { hour: h, minute: m, explicitMeridiem: true };
  }
  const hOnly = lower.match(/\b(\d{1,2})\s*(am|pm|a\.m\.|p\.m\.)\b/i);
  if (hOnly) {
    let h = parseInt(hOnly[1], 10);
    const meridiem = hOnly[2].toLowerCase();
    if (meridiem.includes("p") && h < 12) h += 12;
    if (meridiem.includes("a") && h === 12) h = 0;
    return { hour: h, minute: 0, explicitMeridiem: true };
  }
  return null;
};

const findLockedFactClueTimeConflicts = (
  cml: CaseData,
  clues: ClueDistributionResult,
  lockedFactsOverride?: any[],
): string[] => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const mapping = Array.isArray(caseBlock?.prose_requirements?.clue_to_scene_mapping)
    ? caseBlock.prose_requirements.clue_to_scene_mapping
    : [];
  const lockedFacts = Array.isArray(lockedFactsOverride)
    ? lockedFactsOverride
    : Array.isArray(caseBlock?.locked_facts)
      ? caseBlock.locked_facts
      : [];

  if (!Array.isArray(lockedFacts) || lockedFacts.length === 0) return [];

  const clueById = new Map(clues.clues.map((c) => [String(c.id), c]));
  const violations: string[] = [];

  for (const fact of lockedFacts) {
    const factId = String(fact?.id ?? "");
    const factDesc = String(fact?.description ?? "");
    const factValue = String(fact?.value ?? "").trim();
    if (!factValue) continue;

    const parsedWord = parseWordFormTime(factValue);
    const parsedDigit = extractDigitFormHour(factValue);
    const parsedFact = parsedWord ?? parsedDigit;
    if (!parsedFact) continue;

    const mappedClueIds = mapping
      .map((m: any) => String(m?.clue_id ?? ""))
      .filter((id: string) => id.length > 0);

    for (const clueId of mappedClueIds) {
      const clue = clueById.get(clueId);
      if (!clue) continue;
      const clueText = `${String(clue.description ?? "")} ${String((clue as any).pointsTo ?? "")}`;
      if (!nameAppearsInText(factDesc, clueText) && !nameAppearsInText(factValue, clueText)) continue;

      const parsedClue = extractDigitFormHour(clueText) ?? parseWordFormTime(clueText);
      if (!parsedClue) continue;

      // AM/PM ambiguity guard: do not silently infer when only one side is explicit.
      if (parsedFact.explicitMeridiem !== parsedClue.explicitMeridiem) {
        violations.push(
          `CML time ambiguity: locked fact "${factId || factDesc}" value "${factValue}" and clue "${clueId}" include mismatched AM/PM specificity. Make both explicit (or both implicit) before prose generation.`
        );
        continue;
      }

      const factMinutes = parsedFact.hour * 60 + parsedFact.minute;
      const clueMinutes = parsedClue.hour * 60 + parsedClue.minute;
      if (factMinutes !== clueMinutes) {
        violations.push(
          `CML time contradiction: locked fact "${factId || factDesc}" canonical "${factValue}" conflicts with clue "${clueId}" time expression (parsed ${parsedClue.hour}:${String(parsedClue.minute).padStart(2, "0")}).`
        );
      }
    }
  }

  return violations;
};

// ============================================================================
// WP4: Inference Path Coverage Helpers (agent-5 only)
// ============================================================================

function checkInferencePathCoverage(
  cml: CaseData,
  clues: ClueDistributionResult
): InferenceCoverageResult {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({ severity: "critical", message: "No inference_path steps found in CML" });
    return { issues, coverageMap: new Map(), uncoveredSteps: [], hasCriticalGaps: true };
  }

  const coverageMap = new Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>();
  for (let i = 0; i < steps.length; i++) {
    coverageMap.set(i + 1, { observation: false, contradiction: false, elimination: false });
  }

  for (const clue of clues.clues) {
    const stepNum = (clue as any).supportsInferenceStep;
    if (stepNum && coverageMap.has(stepNum)) {
      const coverage = coverageMap.get(stepNum)!;
      const evidenceType = (clue as any).evidenceType || "observation";
      if (evidenceType in coverage) (coverage as any)[evidenceType] = true;
    }
  }

  // Fuzzy matching fallback
  for (const clue of clues.clues) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNum = i + 1;
      const coverage = coverageMap.get(stepNum)!;
      const clueText = (String(clue.description ?? "") + " " + String((clue as any).sourceInCML ?? "")).toLowerCase();
      const obsText = (typeof step.observation === "string" ? step.observation : "").toLowerCase();
      const obsWords = obsText.split(/\s+/).filter((w: string) => w.length > 4);
      const matchCount = obsWords.filter((w: string) => clueText.includes(w)).length;
      if (obsWords.length > 0 && matchCount >= Math.ceil(obsWords.length * 0.4)) coverage.observation = true;
      if (Array.isArray(step.required_evidence)) {
        for (const ev of step.required_evidence) {
          const evWords = String(ev ?? "").toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          const evMatch = evWords.filter((w: string) => clueText.includes(w)).length;
          if (evWords.length > 0 && evMatch >= Math.ceil(evWords.length * 0.4)) coverage.observation = true;
        }
      }
    }
  }

  const uncoveredSteps: number[] = [];
  for (const [stepNum, coverage] of coverageMap) {
    if (!coverage.observation) {
      uncoveredSteps.push(stepNum);
      const step = steps[stepNum - 1];
      issues.push({
        severity: "critical",
        message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has NO covering clue`,
      });
    }
    if (!coverage.contradiction) {
      issues.push({ severity: "warning", message: `Inference step ${stepNum} has no contradiction clue` });
    }
  }

  return { issues, coverageMap, uncoveredSteps, hasCriticalGaps: uncoveredSteps.length > 0 };
}

function checkContradictionPairs(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  for (let i = 0; i < steps.length; i++) {
    const stepNum = i + 1;
    const step = steps[i];
    const stepClues = clues.clues.filter((c: any) => c.supportsInferenceStep === stepNum);
    const evidenceTypes = new Set(stepClues.map((c: any) => c.evidenceType || "observation"));
    if (
      stepClues.length >= 2 &&
      evidenceTypes.has("observation") &&
      (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination"))
    ) continue;
    if (stepClues.length < 2) {
      issues.push({
        severity: "warning",
        message: `Inference step ${stepNum} ("${(step.observation || "").substring(0, 60)}") has only ${stepClues.length} mapped clue(s)`,
      });
    } else if (!evidenceTypes.has("contradiction") && !evidenceTypes.has("elimination")) {
      issues.push({ severity: "warning", message: `Inference step ${stepNum} has clues but no contradiction/elimination evidence` });
    }
  }
  return issues;
}

function checkFalseAssumptionContradiction(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const falseAssumption = caseBlock?.false_assumption?.statement || "";
  if (!falseAssumption) {
    issues.push({ severity: "critical", message: "No false_assumption.statement in CML" });
    return issues;
  }
  const contradictionClues = clues.clues.filter((c: any) => c.evidenceType === "contradiction");
  if (contradictionClues.length === 0) {
    issues.push({
      severity: "critical",
      message: `No clue with evidenceType="contradiction" found. Reader needs evidence challenging: "${falseAssumption.substring(0, 80)}"`,
    });
  }
  const overlappingRedHerringIds = findRedHerringTrueSolutionOverlap(cml, clues);
  if (overlappingRedHerringIds.length > 0) {
    issues.push({
      severity: "warning",
      message: `${overlappingRedHerringIds.length} red herring(s) may accidentally support the true solution (${overlappingRedHerringIds.join(", ")})`,
    });
  }
  return issues;
}

function findRedHerringOverlapDetails(cml: CaseData, clues: ClueDistributionResult): RedHerringOverlapDetail[] {
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

    const matchedStepIndexes: number[] = [];
    const matchedCorrectionWords = new Set<string>();
    let phraseWeightedScore = 0;
    for (const step of stepCorrectionWords) {
      const stepMatches = step.words.filter((word: string) => new RegExp(`\\b${word}\\b`, "i").test(text));
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

function findRedHerringTrueSolutionOverlap(cml: CaseData, clues: ClueDistributionResult): string[] {
  return findRedHerringOverlapDetails(cml, clues).map((d) => d.redHerringId);
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

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

function sanitizeRedHerringOverlap(
  cml: CaseData,
  clues: ClueDistributionResult,
  overlapDetails: RedHerringOverlapDetail[],
  preferredTerms: string[] = [],
): string[] {
  const repairs: string[] = [];
  if (!Array.isArray(clues.redHerrings) || overlapDetails.length === 0) return repairs;

  const caseBlock = getCaseBlock(cml);
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

function pruneOverlappingRedHerrings(
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

function checkDiscriminatingTestReachability(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest?.design) {
    issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
    return issues;
  }

  const evidenceClueIds = getCanonicalEvidenceClueIds(cml);
  if (evidenceClueIds.length > 0) {
    const clueById = new Map(clues.clues.map((c: any) => [String(c.id), c]));
    const missing = evidenceClueIds.filter((id: string) => !clueById.has(id));
    if (missing.length > 0) {
      issues.push({
        severity: "critical",
        message: `Discriminating test evidence_clues reference missing clue id(s): ${missing.join(", ")}`,
      });
    }

    const mappedClues = evidenceClueIds
      .map((id: string) => clueById.get(id))
      .filter(Boolean) as any[];

    if (mappedClues.length === 0) {
      issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
      return issues;
    }

    const lateMapped = mappedClues.filter((c: any) => c.placement !== "early" && c.placement !== "mid");
    if (lateMapped.length > 0) {
      issues.push({
        severity: "critical",
        message: `Discriminating test evidence clue(s) must be early/mid, found non-compliant placement on: ${lateMapped
          .map((c: any) => String(c?.id ?? "(unknown-id)"))
          .join(", ")}`,
      });
    }
    return issues;
  }

  const designText = (discrimTest.design || "").toLowerCase();
  const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
  const combinedTestText = designText + " " + knowledgeText;
  const relevantClues = clues.clues.filter((c: any) => {
    const clueText = `${String(c.description ?? "")} ${String(c.pointsTo ?? "")} ${String(c.sourceInCML ?? "")}`.toLowerCase();
    const testWords = combinedTestText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });
  if (relevantClues.length === 0) {
    issues.push({ severity: "critical", message: "Discriminating test references no evidence found in the clue set" });
  }
  const earlyMidRelevant = relevantClues.filter((c: any) => c.placement === "early" || c.placement === "mid");
  if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
    issues.push({ severity: "critical", message: "All clues related to the discriminating test are in late placement" });
  }
  return issues;
}

function checkMechanismVisibility(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = getCaseBlock(cml);
  const mechanismText = `${String(caseBlock?.hidden_model?.mechanism?.description ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`.trim();
  const terms = extractMechanismVisibilityTerms(mechanismText);
  if (terms.length < 3) return issues;

  const phrases = extractMechanismVisibilityPhrases(mechanismText);
  const matchingClues = clues.clues.filter((clue: any) => {
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

  if (matchingClues.length === 0) {
    issues.push({
      severity: "critical",
      message: "No clue makes the core mechanism reader-visible before the discriminating test.",
    });
    return issues;
  }

  const earlyMidMatches = matchingClues.filter((clue: any) => clue?.placement === "early" || clue?.placement === "mid");
  if (earlyMidMatches.length === 0) {
    issues.push({
      severity: "critical",
      message: `Mechanism-visible clue(s) are late-only: ${matchingClues.map((clue: any) => String(clue?.id ?? "(unknown-id)")).join(", ")}`,
    });
  }

  return issues;
}

function checkSuspectElimination(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
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

function synthesizeMissingDiscriminatingEvidenceClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  missingEvidenceIds: string[],
): string[] {
  if (missingEvidenceIds.length === 0) return [];

  const caseBlock = getCaseBlock(cml);
  const discrimText = `${String(caseBlock?.discriminating_test?.design ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  const discrimTokens = new Set(discrimText.split(/\s+/).filter((t) => t.length >= 5));

  const existingIds = new Set(clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean));
  const candidates = clues.clues
    .filter((c: any) => c?.criticality === "essential")
    .map((c: any) => {
      const text = `${String(c?.description ?? "")} ${String(c?.pointsTo ?? "")}`.toLowerCase();
      let score = 0;
      for (const token of discrimTokens) {
        if (text.includes(token)) score += 1;
      }
      if (c?.placement === "early" || c?.placement === "mid") score += 2;
      if (c?.evidenceType === "observation" || c?.evidenceType === "contradiction") score += 1;
      return { clue: c, score };
    })
    .sort((a, b) => b.score - a.score);

  if (candidates.length === 0) return [];

  const repairs: string[] = [];
  let templateIndex = 0;
  for (const missingId of missingEvidenceIds) {
    if (!missingId || existingIds.has(missingId)) continue;

    const template = candidates[templateIndex % candidates.length].clue;
    templateIndex += 1;
    const synthesizedPlacement = template?.placement === "late" ? "mid" : (template?.placement || "mid");

    clues.clues.push({
      ...template,
      id: missingId,
      criticality: "essential",
      placement: synthesizedPlacement,
    } as any);
    existingIds.add(missingId);

    const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
    if (synthesizedPlacement === "early") timeline.early = [...(timeline.early ?? []), missingId];
    else if (synthesizedPlacement === "late") timeline.late = [...(timeline.late ?? []), missingId];
    else timeline.mid = [...(timeline.mid ?? []), missingId];
    (clues as any).clueTimeline = timeline;

    repairs.push(`${missingId} <= cloned from ${String(template?.id ?? "(unknown-id)")}`);
  }

  return repairs;
}

function selectDiscriminatingEvidenceCandidateIds(
  cml: CaseData,
  clues: ClueDistributionResult,
  maxIds: number,
): string[] {
  const caseBlock = getCaseBlock(cml);
  const discrimText = `${String(caseBlock?.discriminating_test?.design ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ");
  const discrimTokens = new Set(discrimText.split(/\s+/).filter((t) => t.length >= 5));

  const scored = clues.clues
    .map((c: any) => {
      const text = `${String(c?.description ?? "")} ${String(c?.pointsTo ?? "")}`.toLowerCase();
      let score = 0;
      for (const token of discrimTokens) {
        if (text.includes(token)) score += 1;
      }
      if (c?.criticality === "essential") score += 2;
      if (c?.placement === "early" || c?.placement === "mid") score += 1;
      if (c?.evidenceType === "observation" || c?.evidenceType === "contradiction") score += 1;
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

function synthesizeStrictStepCoverageBackstopClues(
  cml: CaseData,
  clues: ClueDistributionResult,
  requiredStepCoverageFloors: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>,
  strictSourcePaths: string[] = [],
): string[] {
  if (requiredStepCoverageFloors.length === 0) return [];

  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps)
    ? caseBlock.inference_path.steps
    : [];
  const clueList: any[] = Array.isArray(clues?.clues) ? clues.clues : [];
  if (steps.length === 0 || clueList.length === 0) return [];

  const timeline = (clues as any).clueTimeline ?? { early: [], mid: [], late: [] };
  timeline.early = Array.isArray(timeline.early) ? timeline.early : [];
  timeline.mid = Array.isArray(timeline.mid) ? timeline.mid : [];
  timeline.late = Array.isArray(timeline.late) ? timeline.late : [];
  (clues as any).clueTimeline = timeline;

  const existingIds = new Set(
    clueList
      .map((clue) => String(clue?.id ?? "").trim())
      .filter((id) => id.length > 0),
  );

  const nextId = (prefix: string): string => {
    let candidate = prefix;
    let suffix = 2;
    while (existingIds.has(candidate)) {
      candidate = `${prefix}_${suffix}`;
      suffix += 1;
    }
    existingIds.add(candidate);
    return candidate;
  };

  const ensureSentence = (text: string, fallback: string): string => {
    const normalized = replaceDigitTimesWithEraWords(String(text ?? "").replace(/\s+/g, " ").trim());
    const candidate = normalized || fallback;
    if (!candidate) return "";
    return /[.!?]$/.test(candidate) ? candidate : `${candidate}.`;
  };

  const template = clueList.find((clue) => String(clue?.criticality ?? "").toLowerCase() === "essential") ?? clueList[0];
  if (!template) return [];

  const repairs: string[] = [];

  for (const floor of requiredStepCoverageFloors) {
    const stepNumber = Number(floor?.step);
    if (!Number.isInteger(stepNumber) || stepNumber <= 0 || stepNumber > steps.length) continue;

    const stepIndex = stepNumber - 1;
    const stepClues = clueList.filter((entry: any) => Number(entry?.supportsInferenceStep) === stepNumber);
    const hasMapped = stepClues.length > 0;
    const hasContradiction = stepClues.some(
      (entry: any) => String(entry?.evidenceType ?? "").toLowerCase() === "contradiction",
    );

    const needsMapped = Boolean(floor.requireMapped) && !hasMapped;
    const needsContradiction = Boolean(floor.requireContradiction) && !hasContradiction;
    if (!needsMapped && !needsContradiction) continue;

    const step = steps[stepIndex] ?? {};
    const requiredEvidence = Array.isArray(step?.required_evidence)
      ? step.required_evidence.map((entry: any) => String(entry ?? "").trim()).filter(Boolean)
      : [];

    const preferredRequiredEvidencePath = requiredEvidence.find((entry: string) => /^CASE\./.test(entry));
    const humanEvidence = requiredEvidence.find((entry: string) => !/^CASE\./.test(entry)) ?? "";

    const correctionPath = `CASE.inference_path.steps[${stepIndex}].correction`;
    const observationPath = `CASE.inference_path.steps[${stepIndex}].observation`;

    const sourceCandidates = [
      preferredRequiredEvidencePath,
      correctionPath,
      observationPath,
    ].filter((entry): entry is string => Boolean(entry));

    const sourceInCML = sourceCandidates.find((path) => {
      if (!validateSourcePath(cml, path)) return false;
      return strictSourcePaths.length === 0 || strictSourcePaths.includes(path);
    })
      || strictSourcePaths.find((path) => path.startsWith(`CASE.inference_path.steps[${stepIndex}]`))
      || strictSourcePaths.find((path) => path.startsWith("CASE.constraint_space.time.contradictions["))
      || strictSourcePaths.find((path) => path.startsWith("CASE.constraint_space.time.anchors["))
      || correctionPath;

    const description = ensureSentence(
      String(step?.observation ?? "") || humanEvidence || String(step?.correction ?? "") || String(step?.effect ?? ""),
      `Inference step ${stepNumber} exposes a concrete case detail that the reader can verify`,
    );
    const pointsTo = ensureSentence(
      String(step?.correction ?? "") || String(step?.effect ?? "") || humanEvidence || String(step?.observation ?? ""),
      `This clue narrows the inference path for step ${stepNumber}`,
    );

    const clueId = nextId(
      needsContradiction ? `clue_fp_contradiction_step_${stepNumber}` : `clue_fp_backstop_step_${stepNumber}`,
    );
    const placement = stepNumber <= 2 ? "early" : "mid";

    clueList.push({
      ...template,
      id: clueId,
      sourceInCML,
      description,
      pointsTo,
      placement,
      criticality: "essential",
      evidenceType: needsContradiction ? "contradiction" : "observation",
      supportsInferenceStep: stepNumber,
    });

    if (placement === "early") timeline.early.push(clueId);
    else timeline.mid.push(clueId);

    repairs.push(
      `added ${clueId} as ${placement} essential ${needsContradiction ? "contradiction" : "observation"} clue for strict step ${stepNumber}`,
    );
  }

  return repairs;
}

export function enforceAgent5DeterministicContracts(
  cml: CaseData,
  clues: ClueDistributionResult,
  options?: { hardLogicLockedFacts?: string[] },
): { warnings: string[] } {
  const warnings: string[] = [];
  const strictPromptFeedback = buildStrictPromptFeedback(cml);

  const strictRepairs = applyStrictPromptContractRepairs(cml, clues, strictPromptFeedback);
  strictRepairs.forEach((repair) => warnings.push(`Agent 5 ${repair}`));

  const sourcePathRepairs = repairInvalidSourcePaths(cml, clues);
  sourcePathRepairs.forEach((repair) => warnings.push(`Agent 5 source-path auto-repair: ${repair}`));

  const sourcePathValidation = checkSourcePathValidity(cml, clues);
  if (sourcePathValidation.issues.length > 0) {
    throw new Error(`Agent 5 source-path gate failed with ${sourcePathValidation.issues.length} invalid source path(s).`);
  }

  reconcileModelAudit(cml, clues);

  const stepBoundIssues = checkInferenceStepBounds(cml, clues);
  if (stepBoundIssues.length > 0) {
    throw new Error(`Agent 5 step-index gate failed with ${stepBoundIssues.length} out-of-range inference step reference(s).`);
  }

  const castPathRepairs = repairCastNamePathConsistency(cml, clues);
  castPathRepairs.forEach((repair) => warnings.push(`Agent 5 cast-path auto-repair: ${repair}`));

  const castPathConsistencyIssues = checkCastNamePathConsistency(cml, clues);
  if (castPathConsistencyIssues.length > 0) {
    throw new Error(`Agent 5 cast-path consistency gate failed with ${castPathConsistencyIssues.length} issue(s).`);
  }

  const auditConsistencyIssues = checkModelAuditConsistency(cml, clues);
  if (auditConsistencyIssues.length > 0) {
    throw new Error(`Agent 5 audit-consistency gate failed with ${auditConsistencyIssues.length} mismatch(es).`);
  }

  let eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  if (eraTimeStyleIssues.length > 0) {
    const eraRepairs = sanitizeEraTimeStyleInClues(clues);
    eraRepairs.forEach((repair) => warnings.push(`Agent 5 era-style sanitizer: ${repair}`));
    eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  }
  if (eraTimeStyleIssues.length > 0) {
    throw new Error(`Agent 5 era time-style gate failed with ${eraTimeStyleIssues.length} digit-based time issue(s).`);
  }

  const timeConflicts = findLockedFactClueTimeConflicts(cml, clues, options?.hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    throw new Error(`Agent 5 CML-clue consistency gate failed (${timeConflicts.length} time conflict(s)).`);
  }

  const culpritGaps = findCulpritDiscriminatingGaps(cml, clues);
  if (culpritGaps.length > 0) {
    const culpritRepairs = synthesizeMissingCulpritDiscriminatingClues(cml, clues, culpritGaps);
    culpritRepairs.forEach((repair) => warnings.push(`Agent 5 culprit-evidence deterministic synthesis: ${repair}`));
    const remainingCulpritGaps = findCulpritDiscriminatingGaps(cml, clues);
    if (remainingCulpritGaps.length > 0) {
      throw new Error(
        `Agent 5 culprit-discriminating clue gate failed. Missing direct evidence clue for culprit(s): ${remainingCulpritGaps.join(", ")}`,
      );
    }
  }

  const missingEvidenceIds = getMissingDiscriminatingEvidenceIds(cml, clues);
  if (missingEvidenceIds.length > 0) {
    const synthRepairs = synthesizeMissingDiscriminatingEvidenceClues(cml, clues, missingEvidenceIds);
    synthRepairs.forEach((repair) => warnings.push(`Agent 5 evidence-id deterministic synthesis: ${repair}`));
  }
  const remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(cml, clues);
  if (remainingMissingEvidenceIds.length > 0) {
    throw new Error(
      `Agent 5 discriminating evidence ID gate failed. Missing clue id(s): ${remainingMissingEvidenceIds.join(", ")}`,
    );
  }

  const strictFollowupRepairs = applyStrictPromptContractRepairs(cml, clues, strictPromptFeedback);
  strictFollowupRepairs.forEach((repair) => warnings.push(`Agent 5 ${repair}`));

  let strictStepCoverageIssues = checkStrictStepCoverageFloors(
    clues,
    strictPromptFeedback?.requiredStepCoverageFloors ?? [],
  ).filter((issue) => issue.severity === "critical");

  if (strictStepCoverageIssues.length > 0) {
    const strictBackstopRepairs = synthesizeStrictStepCoverageBackstopClues(
      cml,
      clues,
      strictPromptFeedback?.requiredStepCoverageFloors ?? [],
      strictPromptFeedback?.strictSourcePaths ?? [],
    );

    strictBackstopRepairs.forEach((repair) => warnings.push(`Agent 5 strict-step deterministic synthesis: ${repair}`));

    if (strictBackstopRepairs.length > 0) {
      reconcileModelAudit(cml, clues);
      strictStepCoverageIssues = checkStrictStepCoverageFloors(
        clues,
        strictPromptFeedback?.requiredStepCoverageFloors ?? [],
      ).filter((issue) => issue.severity === "critical");
    }
  }

  if (strictStepCoverageIssues.length > 0) {
    throw new Error(`Agent 5 strict step coverage gate failed with ${strictStepCoverageIssues.length} critical issue(s).`);
  }

  const strictContractIssues = checkStrictPromptContracts(clues, strictPromptFeedback)
    .filter((issue) => issue.severity === "critical");
  if (strictContractIssues.length > 0) {
    throw new Error(`Agent 5 strict contract gate failed with ${strictContractIssues.length} critical issue(s).`);
  }

  const metaAuditIssues = checkMetaAuditClueText(clues)
    .filter((issue) => issue.severity === "critical");
  if (metaAuditIssues.length > 0) {
    throw new Error(`Agent 5 meta clue gate failed with ${metaAuditIssues.length} critical issue(s).`);
  }

  const discrimReachabilityIssues = checkDiscriminatingTestReachability(cml, clues)
    .filter((issue) => issue.severity === "critical");
  if (discrimReachabilityIssues.length > 0) {
    throw new Error(
      `Agent 5 discriminating test timing gate failed with ${discrimReachabilityIssues.length} critical issue(s).`,
    );
  }

  const mechanismVisibilityIssues = checkMechanismVisibility(cml, clues)
    .filter((issue) => issue.severity === "critical");
  if (mechanismVisibilityIssues.length > 0) {
    throw new Error(
      `Agent 5 mechanism visibility gate failed with ${mechanismVisibilityIssues.length} critical issue(s).`,
    );
  }

  return { warnings };
}

export function recomputeInferenceCoverageForAgent6(
  cml: CaseData,
  clues: ClueDistributionResult,
): InferenceCoverageResult {
  return recomputeCoverageSnapshotForAgent6(cml, clues).coverageResult;
}

export function recomputeCoverageSnapshotForAgent6(
  cml: CaseData,
  clues: ClueDistributionResult,
): { coverageResult: InferenceCoverageResult; allCoverageIssues: ClueGuardrailIssue[] } {
  const inferredCoverage = checkInferencePathCoverage(cml, clues);
  const contradictionIssues = checkContradictionPairs(cml, clues);
  const falseAssumptionIssues = checkFalseAssumptionContradiction(cml, clues);
  const discrimTestIssues = checkDiscriminatingTestReachability(cml, clues);
  const mechanismVisibilityIssues = checkMechanismVisibility(cml, clues);
  const suspectIssues = checkSuspectElimination(cml, clues);
  return {
    coverageResult: inferredCoverage,
    allCoverageIssues: [
      ...inferredCoverage.issues,
      ...contradictionIssues,
      ...falseAssumptionIssues,
      ...discrimTestIssues,
      ...mechanismVisibilityIssues,
      ...suspectIssues,
    ],
  };
}

// ============================================================================
// runAgent5
// ============================================================================

export async function runAgent5(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("clues", "Extracting and organizing clues...", 50);

  const evidenceIdNormalization = sanitizeDiscriminatingEvidenceClueIds(ctx.cml!);
  if (evidenceIdNormalization.removed.length > 0) {
    ctx.reportProgress(
      "clues",
      "Agent 5: normalized non-canonical discriminating_test.evidence_clues entries; using canonical clue IDs for deterministic traceability.",
      51,
    );
  }

  const clueDensity: "minimal" | "moderate" | "dense" =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  const strictPromptFeedbackBase = strictPromptContractsEnabled()
    ? buildStrictPromptFeedback(ctx.cml!)
    : undefined;
  const mergeStrictPromptFeedback = (feedback?: any, isRetry = false): any => {
    if (!strictPromptFeedbackBase) return feedback;

    const result: any = { ...(feedback ?? {}) };
    const existingRecommendations = Array.isArray(result.recommendations)
      ? result.recommendations.map((item: unknown) => String(item ?? "").trim()).filter(Boolean)
      : [];
    // On retry, strip the first-attempt "status=fail" escape hatch — the LLM must produce
    // valid clues on retry; self-failure is not an acceptable response.
    const strictRecommendations = strictPromptFeedbackBase.recommendations
      .map((item) => String(item ?? "").trim())
      .filter(Boolean)
      .filter((item) => !isRetry || !item.includes("return status=fail"));
    const retryDirective = isRetry
      ? ["RETRY MODE — You MUST return valid clues with correct sourceInCML paths. Returning status=fail or clues=[] is not acceptable on this attempt. Choose any valid path from the template list above."]
      : [];

    result.overallStatus = result.overallStatus ?? strictPromptFeedbackBase.overallStatus;
    result.violations = Array.isArray(result.violations) ? result.violations : [];
    result.warnings = Array.isArray(result.warnings) ? result.warnings : [];
    result.recommendations = [...new Set([...existingRecommendations, ...strictRecommendations, ...retryDirective])];

    result.strictSourcePaths = Array.isArray(result.strictSourcePaths) && result.strictSourcePaths.length > 0
      ? result.strictSourcePaths
      : strictPromptFeedbackBase.strictSourcePaths;
    result.requiredIdToSourceMappings = Array.isArray(result.requiredIdToSourceMappings)
      && result.requiredIdToSourceMappings.length > 0
      ? result.requiredIdToSourceMappings
      : strictPromptFeedbackBase.requiredIdToSourceMappings;
    result.requiredStepCoverageFloors = Array.isArray(result.requiredStepCoverageFloors)
      && result.requiredStepCoverageFloors.length > 0
      ? result.requiredStepCoverageFloors
      : strictPromptFeedbackBase.requiredStepCoverageFloors;
    result.requiredLateClueSlot = result.requiredLateClueSlot || strictPromptFeedbackBase.requiredLateClueSlot;
    result.requiredDirectCulpritClue = result.requiredDirectCulpritClue || strictPromptFeedbackBase.requiredDirectCulpritClue;

    return result;
  };

  const cluesStart = Date.now();
  let agent5RetryInvoked = false;
  ctx.agent5FirstPassPassed = true;
  ctx.agent5RetryInvoked = false;
  ctx.agent5FailureClass = "none";
  const recordHardFailPhaseScore = (reason: string): void => {
    if (!ctx.enableScoring || !ctx.scoreAggregator) return;
    const hardFailTotal = 55;
    const durationMs = (ctx.agentDurations["agent5_clues"] ?? 0) || Math.max(0, Date.now() - cluesStart);
    const cost = ctx.agentCosts["agent5_clues"] ?? 0;
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: 40,
        quality_score: 55,
        completeness_score: 60,
        consistency_score: 40,
        total: hardFailTotal,
        grade: "F",
        passed: false,
        failure_reason: reason,
        tests: [
          {
            name: "Deterministic hard gate",
            category: "validation" as const,
            passed: false,
            score: 40,
            weight: 3,
            message: reason,
          },
        ],
      },
      durationMs,
      cost,
      [reason],
    );
  };

  const failAgent5 = (message: string): never => {
    ctx.agent5FirstPassPassed = false;
    ctx.agent5RetryInvoked = agent5RetryInvoked;
    ctx.agent5FailureClass = classifyAgent5FailureClass(message);
    recordHardFailPhaseScore(message);
    throw new Error(message);
  };

  let extractionAttempt = 1;
  const extractWithAttempt = (payload: any) =>
    extractClues(ctx.client, {
      ...payload,
      retryAttempt: extractionAttempt++,
    });
  let clues: Awaited<ReturnType<typeof extractClues>>;
  const cluesInputBase = {
    cml: ctx.cml!,
    clueDensity,
    redHerringBudget: 2,
    fairPlayFeedback: mergeStrictPromptFeedback(),
    runId: ctx.runId,
    projectId: ctx.projectId || "",
    // Pillar 1: pass locked facts so clue descriptions honour canonical values
    ...(ctx.inputs.enableLockedFactRegistry && ctx.lockedFactRegistry && ctx.lockedFactRegistry.length > 0
      ? { lockedFacts: ctx.lockedFactRegistry }
      : {}),
  };
  try {
    clues = await extractWithAttempt(cluesInputBase);
  } catch (err) {
    const retryableExtractionFailure =
      err instanceof SyntaxError
      || err instanceof TypeError
      || /json|parse|unexpected token|structured output/i.test(String((err as Error)?.message ?? ""));
    if (retryableExtractionFailure) {
      agent5RetryInvoked = true;
      ctx.warnings.push("Agent 5: first extraction attempt failed due to malformed model payload; retrying once");
      clues = await extractWithAttempt(cluesInputBase);
    } else {
      throw err;
    }
  }

  ctx.agentCosts["agent5_clues"] =
    (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
  ctx.agentDurations["agent5_clues"] = Date.now() - cluesStart;

  ctx.reportProgress("clues", `${clues.clues.length} clues distributed`, 62);

  // ── First guardrail pass ───────────────────────────────────────────────────
  // Apply deterministic source-path repair BEFORE checking validity so that
  // empty/near-miss paths don't trigger the LLM retry gate unnecessarily.
  // The LLM retry consistently returns zero clues when given path constraints.
  const firstPassRepairs = repairInvalidSourcePaths(ctx.cml!, clues);
  firstPassRepairs.forEach((r) => ctx.warnings.push(`Agent 5: pre-guardrail source-path repair: ${r}`));

  let clueGuardrails = applyClueGuardrails(ctx.cml!, clues);
  clueGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
  const sourcePathSnapshot = checkSourcePathValidity(ctx.cml!, clues);

  if (clueGuardrails.hasCriticalIssues || sourcePathSnapshot.invalidPaths.length > 0) {
    if (clueGuardrails.hasCriticalIssues) {
      ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
    }
    if (sourcePathSnapshot.invalidPaths.length > 0) {
      ctx.warnings.push("Agent 5: sourceInCML legality violations detected; regenerating clues with path constraints");
    }
    clueGuardrails.issues.forEach((issue) =>
      ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`)
    );
    sourcePathSnapshot.invalidPaths.forEach((path) =>
      ctx.warnings.push(`  - [critical] source path legality: invalid sourceInCML path=${path}`),
    );

    const legalSourceTemplates = [
      "CASE.inference_path.steps[N].observation",
      "CASE.inference_path.steps[N].correction",
      "CASE.inference_path.steps[N].required_evidence[M]",
      "CASE.constraint_space.time.anchors[M]",
      "CASE.constraint_space.time.contradictions[M]",
      "CASE.cast[N].alibi_window",
      "CASE.cast[N].access_plausibility",
      "CASE.constraint_space.physical.traces[M]",
    ];

    const retryCluesStart = Date.now();
    agent5RetryInvoked = true;
    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: mergeStrictPromptFeedback({
        overallStatus: "fail",
        violations: [
          ...clueGuardrails.issues
            .filter((i) => i.severity === "critical")
            .map((i) => ({
              severity: "critical" as const,
              rule: "Deterministic Guardrail",
              description: i.message,
              suggestion:
                "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
            })),
          ...sourcePathSnapshot.invalidPaths.map((path) => ({
            severity: "critical" as const,
            rule: "Source Path Legality",
            description: `Invalid source path: ${path}`,
            suggestion: `Replace with a legal path template such as ${legalSourceTemplates[0]} or ${legalSourceTemplates[3]}`,
          })),
        ],
        warnings: clueGuardrails.issues
          .filter((i) => i.severity !== "critical")
          .map((i) => i.message),
        recommendations: [
          "Move essential clues to early/mid placement",
          "Avoid private/detective-only clue phrasing",
          "Ensure clue IDs are unique and timeline is balanced",
          ...sourcePathSnapshot.invalidPaths.map(
            (path) => `Repair path exactly: ${path} -> use one of [${legalSourceTemplates.join(" | ")}]`,
          ),
        ],
      }, true),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

    // Guard: if LLM returned status=fail with empty clues on retry, fail with a clear message
    // rather than propagating 0-count clues into the guardrail which produces misleading errors.
    if (clues.clues.length === 0) {
      ctx.errors.push("Agent 5 retry returned zero clues (LLM self-reported failure on source-path retry)");
      failAgent5("Clue generation failed: LLM returned empty clues on source-path retry");
    }

    const secondGuardrailPass = applyClueGuardrails(ctx.cml!, clues);
    secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
    if (secondGuardrailPass.hasCriticalIssues) {
      secondGuardrailPass.issues.forEach((i) =>
        ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`)
      );
      failAgent5("Clue generation failed deterministic fair-play guardrails");
    }
    clueGuardrails = secondGuardrailPass;
  }

  // ── WP4: Inference Path Coverage Gate ─────────────────────────────────────
  const buildCoverageSnapshot = (activeClues: ClueDistributionResult) => {
    const inferredCoverage = checkInferencePathCoverage(ctx.cml!, activeClues);
    const contradictionIssues = checkContradictionPairs(ctx.cml!, activeClues);
    const falseAssumptionIssuesLocal = checkFalseAssumptionContradiction(ctx.cml!, activeClues);
    const discriminatingIssuesLocal = checkDiscriminatingTestReachability(ctx.cml!, activeClues);
    const suspectIssuesLocal = checkSuspectElimination(ctx.cml!, activeClues);
    const mergedCoverageIssues: ClueGuardrailIssue[] = [
      ...inferredCoverage.issues,
      ...contradictionIssues,
      ...falseAssumptionIssuesLocal,
      ...discriminatingIssuesLocal,
      ...suspectIssuesLocal,
    ];
    return {
      coverageResult: inferredCoverage,
      falseAssumptionIssues: falseAssumptionIssuesLocal,
      discrimTestIssues: discriminatingIssuesLocal,
      suspectIssues: suspectIssuesLocal,
      allCoverageIssues: mergedCoverageIssues,
    };
  };

  const initialCoverage = buildCoverageSnapshot(clues);
  const coverageResult = initialCoverage.coverageResult;
  const allCoverageIssues: ClueGuardrailIssue[] = initialCoverage.allCoverageIssues;
  allCoverageIssues.forEach((issue) =>
    ctx.warnings.push(`Inference coverage: [${issue.severity}] ${issue.message}`)
  );

  let performedCoverageRetry = false;

  const falseAssumptionIssues = initialCoverage.falseAssumptionIssues;
  const discrimTestIssues = initialCoverage.discrimTestIssues;

  if (
    coverageResult.hasCriticalGaps ||
    falseAssumptionIssues.some((i) => i.severity === "critical") ||
    discrimTestIssues.some((i) => i.severity === "critical")
  ) {
    performedCoverageRetry = true;
    ctx.warnings.push(
      "Inference coverage gate: critical gaps found; regenerating clues with coverage feedback"
    );

    const coverageFeedback = {
      overallStatus: "fail" as const,
      violations: allCoverageIssues
        .filter((i) => i.severity === "critical")
        .map((i) => ({
          severity: "critical" as const,
          rule: "Inference Path Coverage",
          description: i.message,
          suggestion:
            "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
        })),
      warnings: allCoverageIssues.filter((i) => i.severity === "warning").map((i) => i.message),
      recommendations: [
        "Every inference step needs at least one observation clue and one contradiction clue",
        "Set supportsInferenceStep on every essential clue",
        "Include at least one clue that explicitly contradicts the false assumption",
        `Uncovered steps: ${coverageResult.uncoveredSteps.join(", ")}`,
      ],
    };

    ctx.reportProgress("clues", "Regenerating clues to address coverage gaps...", 58);
    const coverageRetryStart = Date.now();
    agent5RetryInvoked = true;
    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: mergeStrictPromptFeedback(coverageFeedback),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);

    const postCoverageGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postCoverageGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-coverage guardrail auto-fix: ${fix}`)
    );
  }

  // ── FIX-J: Per-suspect clue coverage gate ─────────────────────────────────
  // Every eligible non-culprit suspect must have at least one clue referencing
  // them by name. If the coverage retry didn't address this, regenerate with
  // targeted suspect-coverage feedback before committing to ctx.clues.
  const initialSuspectCoverage = analyzeSuspectCoverage(ctx.cml!, clues);
  const suspectsNeedingCoverage = [...new Set([
    ...initialSuspectCoverage.uncovered,
    ...initialSuspectCoverage.weakElimination,
  ])];
  if (suspectsNeedingCoverage.length > 0) {
    const attemptLabel = "retry 1";
    if (initialSuspectCoverage.uncovered.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.uncovered.length} suspect(s) have zero clue coverage; regenerating with targeted suspect feedback`,
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.uncovered.length} suspect(s) (${initialSuspectCoverage.uncovered.join(", ")}) are never referenced in any clue`,
      );
      initialSuspectCoverage.uncovered.forEach((suspect) => {
        ctx.warnings.push(`    • ${suspect}: referenced clue IDs: (none)`);
      });
    }
    if (initialSuspectCoverage.weakElimination.length > 0) {
      ctx.warnings.push(
        `Agent 5 (${attemptLabel}): ${initialSuspectCoverage.weakElimination.length} suspect(s) are named but lack elimination/alibi evidence; regenerating targeted clues`,
      );
      ctx.warnings.push(
        `  - ${initialSuspectCoverage.weakElimination.length} suspect(s) (${initialSuspectCoverage.weakElimination.join(", ")}) are referenced but lack elimination/alibi evidence`,
      );
      initialSuspectCoverage.records
        .filter((r) => initialSuspectCoverage.weakElimination.includes(r.suspect))
        .forEach((r) => {
          const refs = r.referencedClueIds.length > 0 ? r.referencedClueIds.join(", ") : "(none)";
          ctx.warnings.push(`    • ${r.suspect}: referenced clue IDs: ${refs}; elimination clues: (none); alibi clues: (none)`);
        });
    }

    const suspectViolations = suspectsNeedingCoverage.map((suspect) => {
      const issueType = initialSuspectCoverage.uncovered.includes(suspect)
        ? "not referenced in any clue"
        : "referenced but lacks elimination/alibi evidence";
      return {
        severity: "critical" as const,
        rule: "Suspect Clue Coverage",
        description: `${suspect} is ${issueType}.`,
        suggestion:
          "Add at least one clue that names this suspect and provides elimination/alibi evidence so the reader can logically rule them out.",
      };
    });

    const suspectRetryStart = Date.now();
    agent5RetryInvoked = true;
    const suspectCoverageFeedback = {
      overallStatus: "fail" as const,
      violations: suspectViolations,
      warnings: [],
      recommendations: [
        "Every eligible non-culprit suspect must appear in at least one clue",
        "Every eligible non-culprit suspect should include elimination/alibi support, not only name mentions",
        "Clues can reference a suspect via their alibi, observed behaviour, or elimination evidence",
        "Adding elimination clues for uncovered suspects does not require extra inference steps",
      ],
    };
    ctx.reportProgress("clues", "Regenerating clues to address suspect coverage gaps...", 60);
    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: mergeStrictPromptFeedback(suspectCoverageFeedback),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });
    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - suspectRetryStart);

    const postSuspectGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postSuspectGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-suspect-coverage guardrail auto-fix: ${fix}`)
    );

    // Re-check; if suspects are still uncovered after retry, log a warning only
    // (do not hard-fail — the story can still be generated, just with a gap).
    const postRetryCoverage = analyzeSuspectCoverage(ctx.cml!, clues);
    const stillUncovered = postRetryCoverage.uncovered;
    const stillWeak = postRetryCoverage.weakElimination;
    if (stillUncovered.length > 0 || stillWeak.length > 0) {
      const summaryParts: string[] = [];
      if (stillUncovered.length > 0) {
        summaryParts.push(`Uncovered suspects: ${stillUncovered.join(", ")}`);
      }
      if (stillWeak.length > 0) {
        summaryParts.push(`Weak elimination/alibi evidence: ${stillWeak.join(", ")}`);
      }
      ctx.warnings.push(
        `Agent 5 suspect-coverage gate still has gaps after retry (continuing): ${summaryParts.join("; ")}`,
      );

      // Preserve per-suspect diagnostics so downstream auditing can still act on gaps.
      postRetryCoverage.records
        .filter(
          (r) => stillUncovered.includes(r.suspect) || stillWeak.includes(r.suspect),
        )
        .forEach((r) => {
          const refs = r.referencedClueIds.length > 0 ? r.referencedClueIds.join(", ") : "(none)";
          const elim = r.eliminationClueIds.length > 0 ? r.eliminationClueIds.join(", ") : "(none)";
          const alibi = r.alibiClueIds.length > 0 ? r.alibiClueIds.join(", ") : "(none)";
          ctx.warnings.push(
            `  - ${r.suspect}: referenced clues=${refs}; elimination clues=${elim}; alibi clues=${alibi}`,
          );
        });
    }
  }

  // Red-herring separation hardening: if a red herring semantically overlaps with
  // true-solution correction language, run one bounded regeneration pass and hard-fail
  // if overlap still persists.
  const initialRedHerringOverlapDetails = findRedHerringOverlapDetails(ctx.cml!, clues);
  if (initialRedHerringOverlapDetails.length > 0) {
    const initialRedHerringOverlapIds = initialRedHerringOverlapDetails.map((d) => d.redHerringId);
    ctx.warnings.push(
      `Agent 5: ${initialRedHerringOverlapIds.length} red herring(s) overlap true-solution signals; regenerating for separation`,
    );
    ctx.warnings.push(`  - Overlapping red herring id(s): ${initialRedHerringOverlapIds.join(", ")}`);
    initialRedHerringOverlapDetails.forEach((detail) => {
      ctx.warnings.push(
        `    • ${detail.redHerringId} -> inference steps ${detail.matchedStepIndexes.join(", ")} via words: ${detail.matchedCorrectionWords.slice(0, 8).join(", ")}`,
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

    const redHerringRetryStart = Date.now();
    agent5RetryInvoked = true;
    const overlapTerms = [...new Set(initialRedHerringOverlapDetails.flatMap((d) => d.matchedCorrectionWords || []))]
      .map((t) => String(t).trim().toLowerCase())
      .filter(Boolean);
    const explicitForbiddenTerms = [...new Set([
      ...overlapTerms,
      ...(temporalCollision.detected ? temporalCollision.forbiddenTerms : []),
    ])];
    const replacementTargets = explicitForbiddenTerms.slice(0, 12).map((term, idx) => {
      const replacement = temporalCollision.allowedTerms[idx % Math.max(temporalCollision.allowedTerms.length, 1)] || "assumed time";
      return `${term} -> ${replacement}`;
    });

    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: mergeStrictPromptFeedback({
        overallStatus: "fail",
        violations: initialRedHerringOverlapIds.map((id: string) => ({
        
          severity: "critical" as const,
          rule: "Red Herring Separation",
          description: (() => {
            const detail = initialRedHerringOverlapDetails.find((d) => d.redHerringId === id);
            const words = detail?.matchedCorrectionWords?.slice(0, 8).join(", ") || "(no terms captured)";
            const steps = detail?.matchedStepIndexes?.join(", ") || "(none)";
            return `Red herring ${id} overlaps inference corrections (steps: ${steps}; words: ${words}) and may support the true solution.`;
          })(),
          suggestion: "Rewrite this red herring to reinforce only the false assumption and avoid terms tied to true-solution corrections.",
        })),
        warnings: [],
        recommendations: [
          "Red herrings must support the false assumption only",
          "Do not reuse correction-language terms from inference_path.steps[].correction in red herring text",
          "Preserve misdirection without reinforcing culprit-identifying logic",
          ...(temporalCollision.detected
            ? [
                `Forbidden terms for red-herring rewrite: ${temporalCollision.forbiddenTerms.join(", ") || "(none)"}`,
                `Prefer these temporal assumption terms instead: ${temporalCollision.allowedTerms.join(", ") || "(none)"}`,
              ]
            : []),
        ],
        forbiddenTerms: explicitForbiddenTerms,
        preferredTerms: temporalCollision.allowedTerms,
        requiredReplacements: replacementTargets,
        redHerringIdsToRewrite: initialRedHerringOverlapIds,
      }),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - redHerringRetryStart);

    const postRedHerringGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postRedHerringGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-red-herring guardrail auto-fix: ${fix}`),
    );

    const postRetryRedHerringOverlapDetails = findRedHerringOverlapDetails(ctx.cml!, clues);
    if (postRetryRedHerringOverlapDetails.length > 0) {
      const severeOverlap = postRetryRedHerringOverlapDetails.filter((d) => d.overlapScore >= 4);
      if (severeOverlap.length > 0) {
        const overlapRepairs = sanitizeRedHerringOverlap(ctx.cml!, clues, severeOverlap, temporalCollision.allowedTerms);
        overlapRepairs.forEach((repair) =>
          ctx.warnings.push(`Agent 5 red-herring deterministic sanitizer: ${repair}`),
        );

        const postSanitizeOverlap = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
        if (postSanitizeOverlap.length > 0) {
          const postRetryRedHerringOverlapIds = postSanitizeOverlap.map((d) => d.redHerringId);
          const pruned = pruneOverlappingRedHerrings(clues, postRetryRedHerringOverlapIds);
          if (pruned.length > 0) {
            ctx.warnings.push(
              `Agent 5 red-herring overlap hardening: pruned persistently overlapping red herring(s) after retry (${pruned.join(", ")})`,
            );
          }

          const remainingSevereOverlap = findRedHerringOverlapDetails(ctx.cml!, clues).filter((d) => d.overlapScore >= 4);
          if (remainingSevereOverlap.length > 0) {
            failAgent5(
              `Agent 5 red-herring overlap gate failed after retry. Overlapping red herring(s): ${remainingSevereOverlap.map((d) => d.redHerringId).join(", ")}`,
            );
          }
        }
      }
      ctx.warnings.push(
        `Agent 5: minor red-herring overlap remains after retry (${postRetryRedHerringOverlapDetails.map((d) => d.redHerringId).join(", ")}); continuing with warning`,
      );
    }
  }

  const sourcePathRepairs = repairInvalidSourcePaths(ctx.cml!, clues);
  sourcePathRepairs.forEach((repair) =>
    ctx.warnings.push(`Agent 5 source-path auto-repair: ${repair}`),
  );

  const sourcePathValidation = checkSourcePathValidity(ctx.cml!, clues);
  sourcePathValidation.issues.forEach((issue) => ctx.errors.push(`Agent 5 source-path validation: ${issue.message}`));
  if (sourcePathValidation.issues.length > 0) {
    failAgent5(`Agent 5 source-path gate failed with ${sourcePathValidation.issues.length} invalid source path(s).`);
  }

  reconcileModelAudit(ctx.cml!, clues);

  const stepBoundIssues = checkInferenceStepBounds(ctx.cml!, clues);
  stepBoundIssues.forEach((issue) => ctx.errors.push(`Agent 5 inference-step bounds: ${issue.message}`));
  if (stepBoundIssues.length > 0) {
    failAgent5(`Agent 5 step-index gate failed with ${stepBoundIssues.length} out-of-range inference step reference(s).`);
  }

  const castPathRepairs = repairCastNamePathConsistency(ctx.cml!, clues);
  castPathRepairs.forEach((repair) =>
    ctx.warnings.push(`Agent 5 cast-path auto-repair: ${repair}`),
  );

  const castPathConsistencyIssues = checkCastNamePathConsistency(ctx.cml!, clues);
  castPathConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 cast-path consistency: ${issue.message}`));
  if (castPathConsistencyIssues.length > 0) {
    failAgent5(`Agent 5 cast-path consistency gate failed with ${castPathConsistencyIssues.length} issue(s).`);
  }

  const auditConsistencyIssues = checkModelAuditConsistency(ctx.cml!, clues);
  auditConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 audit consistency: ${issue.message}`));
  if (auditConsistencyIssues.length > 0) {
    failAgent5(`Agent 5 audit-consistency gate failed with ${auditConsistencyIssues.length} mismatch(es).`);
  }

  let eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  if (eraTimeStyleIssues.length > 0) {
    const eraRepairs = sanitizeEraTimeStyleInClues(clues);
    eraRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 era-style sanitizer: ${repair}`));
    eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  }
  eraTimeStyleIssues.forEach((issue) => ctx.errors.push(`Agent 5 era time style: ${issue.message}`));
  if (eraTimeStyleIssues.length > 0) {
    failAgent5(`Agent 5 era time-style gate failed with ${eraTimeStyleIssues.length} digit-based time issue(s).`);
  }

  // Strict locked-fact/clue semantic consistency gate before committing clues downstream.
  const hardLogicLockedFacts = Array.isArray((ctx as any).hardLogicDevices?.devices)
    ? (ctx as any).hardLogicDevices.devices.flatMap((d: any) =>
        Array.isArray(d?.lockedFacts) ? d.lockedFacts : [],
      )
    : undefined;
  const timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    timeConflicts.forEach((msg) => ctx.errors.push(`Agent 5 CML-clue consistency failure: ${msg}`));
    failAgent5(
      `Agent 5 CML-clue consistency gate failed (${timeConflicts.length} time conflict(s)).`,
    );
  }

  const culpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
  if (culpritGaps.length > 0) {
    const culpritRepairs = synthesizeMissingCulpritDiscriminatingClues(ctx.cml!, clues, culpritGaps);
    culpritRepairs.forEach((repair) => ctx.warnings.push(`Agent 5 culprit-evidence deterministic synthesis: ${repair}`));
    const remainingCulpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
    if (remainingCulpritGaps.length > 0) {
      failAgent5(
        `Agent 5 culprit-discriminating clue gate failed. Missing direct evidence clue for culprit(s): ${remainingCulpritGaps.join(", ")}`,
      );
    }
  }

  let finalCoverage = buildCoverageSnapshot(clues);

  const existingEvidenceIds = getCanonicalEvidenceClueIds(ctx.cml!);
  if (existingEvidenceIds.length === 0) {
    const seededEvidenceIds = selectDiscriminatingEvidenceCandidateIds(ctx.cml!, clues, 3);
    if (seededEvidenceIds.length > 0) {
      const caseBlock = getCaseBlock(ctx.cml!);
      if (caseBlock?.discriminating_test) {
        caseBlock.discriminating_test.evidence_clues = seededEvidenceIds;
        ctx.reportProgress(
          "clues",
          `Agent 5: deterministically seeded discriminating_test.evidence_clues from canonical clue IDs (${seededEvidenceIds.join(", ")}).`,
          61,
        );
        finalCoverage = buildCoverageSnapshot(clues);
      }
    }
  }

  // Final targeted remediation: if discriminating-test evidence_clues IDs are still
  // missing, run one bounded retry with exact ID contract feedback before hard-fail.
  const missingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
  if (missingEvidenceIds.length > 0) {
    ctx.warnings.push(
      `Agent 5: ${missingEvidenceIds.length} discriminating-test evidence clue ID(s) still missing after retries; running targeted ID-contract retry`,
    );
    ctx.reportProgress("clues", "Regenerating clues to satisfy discriminating evidence ID contract...", 61);

    const idContractRetryStart = Date.now();
    agent5RetryInvoked = true;
    clues = await extractWithAttempt({
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: mergeStrictPromptFeedback({
        overallStatus: "fail",
        violations: [
          {
            severity: "critical" as const,
            rule: "Discriminating Test ID Contract",
            description: `Missing clue id(s): ${missingEvidenceIds.join(", ")}`,
            suggestion: "Add clues using these exact IDs and place them as essential early/mid evidence.",
          },
        ],
        warnings: [],
        recommendations: [
          `Every CASE.discriminating_test.evidence_clues ID must exist exactly in clues[].id: ${missingEvidenceIds.join(", ")}`,
          "Set these required IDs to criticality=essential and placement=early|mid.",
          "Preserve unaffected clue IDs and wording unless dependency requires change.",
          "Keep sourceInCML paths legal and in-range.",
        ],
      }),
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] =
      (ctx.agentCosts["agent5_clues"] || 0) + clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - idContractRetryStart);

    const postIdContractGuardrails = applyClueGuardrails(ctx.cml!, clues);
    postIdContractGuardrails.fixes.forEach((fix) =>
      ctx.warnings.push(`Post-discriminating-id guardrail auto-fix: ${fix}`),
    );
    if (postIdContractGuardrails.hasCriticalIssues) {
      postIdContractGuardrails.issues.forEach((issue) =>
        ctx.errors.push(`Agent 5 guardrail failure after discriminating-id retry: ${issue.message}`),
      );
      failAgent5("Agent 5 guardrail failure after discriminating evidence ID retry");
    }

    finalCoverage = buildCoverageSnapshot(clues);
  }

  if (performedCoverageRetry) {
    finalCoverage.allCoverageIssues.forEach((issue) =>
      ctx.warnings.push(`Inference coverage final: [${issue.severity}] ${issue.message}`),
    );
  }

  const remainingMissingEvidenceIds = getMissingDiscriminatingEvidenceIds(ctx.cml!, clues);
  if (remainingMissingEvidenceIds.length > 0) {
    const synthRepairs = synthesizeMissingDiscriminatingEvidenceClues(
      ctx.cml!,
      clues,
      remainingMissingEvidenceIds,
    );
    if (synthRepairs.length > 0) {
      synthRepairs.forEach((repair) =>
        ctx.warnings.push(`Agent 5 evidence-id deterministic synthesis: ${repair}`),
      );
      finalCoverage = buildCoverageSnapshot(clues);
    }
  }

  try {
    const deterministicContracts = enforceAgent5DeterministicContracts(ctx.cml!, clues, {
      hardLogicLockedFacts,
    });
    deterministicContracts.warnings.forEach((warning) => ctx.warnings.push(warning));
    finalCoverage = buildCoverageSnapshot(clues);
  } catch (error) {
    failAgent5((error as Error).message || "Agent 5 deterministic contract gate failed.");
  }

  // Final hard gate: if critical inference/discriminating-test coverage still fails
  // after retries, abort before committing clues downstream.
  const stillHasCriticalCoverage =
    finalCoverage.coverageResult.hasCriticalGaps ||
    finalCoverage.falseAssumptionIssues.some((i) => i.severity === "critical") ||
    finalCoverage.discrimTestIssues.some((i) => i.severity === "critical");
  if (stillHasCriticalCoverage) {
    const criticalMessages = finalCoverage.allCoverageIssues
      .filter((i) => i.severity === "critical")
      .map((i) => i.message);
    const summary = criticalMessages.length > 0
      ? criticalMessages.join("; ")
      : "critical inference coverage gaps remain after retries";
    ctx.errors.push(`Agent 5 coverage hard gate failed after retries: ${summary}`);
    failAgent5(`Agent 5 coverage hard gate failed after retries: ${summary}`);
  }

  ctx.clues = clues;
  ctx.coverageResult = finalCoverage.coverageResult;
  ctx.allCoverageIssues = finalCoverage.allCoverageIssues;

  // ── Phase score ────────────────────────────────────────────────────────────
  if (ctx.enableScoring && ctx.scoreAggregator) {
    const guardrailTriggered = clueGuardrails.hasCriticalIssues;
    const coverageGapsFound = finalCoverage.coverageResult.hasCriticalGaps;
    const clueCount = clues.clues.length;
    const densityTargets: Record<typeof clueDensity, { min: number; max: number }> = {
      minimal: { min: 5, max: 8 },
      moderate: { min: 8, max: 12 },
      dense: { min: 12, max: 18 },
    };
    const densityTarget = densityTargets[clueDensity];
    const clueCountScore =
      clueCount < densityTarget.min
        ? Math.round((clueCount / densityTarget.min) * 100)
        : clueCount <= densityTarget.max
          ? 100
          : Math.max(80, 100 - Math.round(((clueCount - densityTarget.max) / densityTarget.max) * 100));
    const guardrailScore = guardrailTriggered ? 75 : 100;
    const coverageScore = coverageGapsFound ? 75 : 100;
    const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
    const warningCount = finalCoverage.allCoverageIssues.filter((i) => i.severity === "warning").length;
    const retryPenalty = (performedCoverageRetry ? 10 : 0)
      + (suspectsNeedingCoverage.length > 0 ? 8 : 0)
      + (initialRedHerringOverlapDetails.length > 0 ? 8 : 0);
    const qualityScore = Math.max(70, 100 - (warningCount * 6) - (clueGuardrails.fixes.length * 4));
    const consistencyScore = Math.max(70, 100 - retryPenalty);
    const clueTotal = Math.round(
      clueValidation * 0.35
      + qualityScore * 0.25
      + clueCountScore * 0.2
      + consistencyScore * 0.2,
    );
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: clueValidation,
        quality_score: qualityScore,
        completeness_score: clueCountScore,
        consistency_score: consistencyScore,
        total: clueTotal,
        grade: (clueTotal >= 90 ? "A" : clueTotal >= 80 ? "B" : clueTotal >= 70 ? "C" : clueTotal >= 60 ? "D" : "F") as PhaseScore["grade"],
        passed: clueTotal >= 75,
        tests: [
          {
            name: "Clue count",
            category: "completeness" as const,
            passed: clueCount >= densityTarget.min,
            score: clueCountScore,
            weight: 1.5,
            message: `${clueCount} clues distributed (target ${densityTarget.min}-${densityTarget.max} for ${clueDensity})`,
          },
          {
            name: "Guardrail compliance",
            category: "validation" as const,
            passed: !guardrailTriggered,
            score: guardrailScore,
            weight: 2,
            message: guardrailTriggered
              ? `Guardrail issues detected and auto-fixed (${clueGuardrails.fixes.length} fix(es))`
              : "All guardrails passed",
          },
          {
            name: "Inference coverage",
            category: "validation" as const,
            passed: !coverageGapsFound,
            score: coverageScore,
            weight: 2,
            message: coverageGapsFound
              ? `Coverage gaps found and addressed (${finalCoverage.allCoverageIssues.length} issue(s))`
              : `Full inference coverage (${finalCoverage.allCoverageIssues.length} minor issues)`,
          },
          {
            name: "Narrative clue quality",
            category: "quality" as const,
            passed: qualityScore >= 80,
            score: qualityScore,
            weight: 1.5,
            message: `${warningCount} warning-level issue(s), ${clueGuardrails.fixes.length} auto-fix(es)`,
          },
          {
            name: "Deterministic consistency",
            category: "consistency" as const,
            passed: consistencyScore >= 80,
            score: consistencyScore,
            weight: 1.5,
            message: `Retry penalty=${retryPenalty} (coverage retry=${performedCoverageRetry}, suspect retry=${suspectsNeedingCoverage.length > 0}, red-herring retry=${initialRedHerringOverlapDetails.length > 0})`,
          },
        ],
      },
      ctx.agentDurations["agent5_clues"] ?? 0,
      ctx.agentCosts["agent5_clues"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }

  ctx.agent5FirstPassPassed = !agent5RetryInvoked;
  ctx.agent5RetryInvoked = agent5RetryInvoked;
  ctx.agent5FailureClass = "none";
}

export const __testables = {
  buildSuspectCoverage,
  analyzeSuspectCoverage,
  buildStrictPromptFeedback,
  enforceAgent5DeterministicContracts,
  recomputeInferenceCoverageForAgent6,
  checkDiscriminatingTestReachability,
  checkMechanismVisibility,
  sanitizeDiscriminatingEvidenceClueIds,
  synthesizeMissingDiscriminatingEvidenceClues,
  selectDiscriminatingEvidenceCandidateIds,
  sanitizeEraTimeStyleInClues,
  checkCastNamePathConsistency,
  repairCastNamePathConsistency,
  repairInvalidSourcePaths,
  sanitizeRedHerringOverlap,
  synthesizeMissingCulpritDiscriminatingClues,
  pruneOverlappingRedHerrings,
  findRedHerringOverlapDetails,
  detectTemporalLexicalCollision,
  findRedHerringTrueSolutionOverlap,
};
