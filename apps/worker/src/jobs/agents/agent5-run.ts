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

const RH_OVERLAP_STOP_WORDS = new Set([
  "therefore", "because", "suggests", "suggested", "indicates", "indicated", "through", "before", "after", "during", "reader", "should", "could", "would", "their", "about", "which", "while", "where", "when", "being", "shows", "found", "noted",
]);

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

const normalizeTokens = (text: string): string[] =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);

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

const getCaseBlock = (cml: CaseData): any => ((cml as any)?.CASE ?? cml);

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

const getMissingDiscriminatingEvidenceIds = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const caseBlock = getCaseBlock(cml);
  const evidenceIds = Array.isArray(caseBlock?.discriminating_test?.evidence_clues)
    ? caseBlock.discriminating_test.evidence_clues.map((id: any) => String(id ?? "").trim()).filter(Boolean)
    : [];
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
      severity: "warning",
      message: `Model audit mismatch for missingDiscriminatingEvidenceIds (expected: ${expectedMissing.join(", ") || "none"}; got: ${actualMissing.join(", ") || "none"})`,
    });
  }
  if (JSON.stringify(expectedInvalidSources) !== JSON.stringify(actualInvalid)) {
    issues.push({
      severity: "warning",
      message: `Model audit mismatch for invalidSourcePaths (expected: ${expectedInvalidSources.join(", ") || "none"}; got: ${actualInvalid.join(", ") || "none"})`,
    });
  }
  if (JSON.stringify(expectedWeak) !== JSON.stringify(actualWeak)) {
    issues.push({
      severity: "warning",
      message: `Model audit mismatch for weakEliminationSuspects (expected: ${expectedWeak.join(", ") || "none"}; got: ${actualWeak.join(", ") || "none"})`,
    });
  }

  return issues;
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

  return suspects.map((suspect: string) => {
    let directReferences = 0;
    let eliminationLike = 0;
    let alibiLike = 0;
    const referencedClueIds: string[] = [];
    const eliminationClueIds: string[] = [];
    const alibiClueIds: string[] = [];
    for (const clue of clues.clues) {
      const clueText = `${String(clue.description ?? "")} ${String((clue as any).pointsTo ?? "")}`;
      if (!nameAppearsInText(suspect, clueText)) continue;
      directReferences += 1;
      referencedClueIds.push(String((clue as any).id ?? "").trim() || "(unknown-id)");
      if (isEliminationLike(clueText)) {
        eliminationLike += 1;
        eliminationClueIds.push(String((clue as any).id ?? "").trim() || "(unknown-id)");
      }
      if (isAlibiLike(clueText)) {
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
      .filter((w: string) => w.length > 4 && !RH_OVERLAP_STOP_WORDS.has(w)),
  }));

  const overlaps: RedHerringOverlapDetail[] = [];
  for (let i = 0; i < clues.redHerrings.length; i++) {
    const rh = clues.redHerrings[i] as any;
    const rhId = String(rh?.id ?? `rh_${i + 1}`).trim() || `rh_${i + 1}`;
    const text = `${String(rh?.description ?? "")} ${String(rh?.supportsAssumption ?? "")} ${String(rh?.misdirection ?? "")}`.toLowerCase();

    const matchedStepIndexes: number[] = [];
    const matchedCorrectionWords = new Set<string>();
    for (const step of stepCorrectionWords) {
      const stepMatches = step.words.filter((word: string) => new RegExp(`\\b${word}\\b`, "i").test(text));
      if (stepMatches.length > 0) {
        matchedStepIndexes.push(step.stepIndex);
        stepMatches.forEach((word: string) => matchedCorrectionWords.add(word));
      }
    }

    const overlapScore = matchedCorrectionWords.size + (new Set(matchedStepIndexes)).size;
    const isMeaningfulOverlap = matchedCorrectionWords.size >= 2 || new Set(matchedStepIndexes).size >= 2;
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

function checkDiscriminatingTestReachability(cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  if (!discrimTest?.design) {
    issues.push({ severity: "critical", message: "No discriminating_test.design in CML" });
    return issues;
  }

  const evidenceClueIds = Array.isArray(discrimTest?.evidence_clues)
    ? discrimTest.evidence_clues.map((id: any) => String(id ?? "").trim()).filter(Boolean)
    : [];
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

    const earlyMidMapped = mappedClues.filter((c: any) => c.placement === "early" || c.placement === "mid");
    if (earlyMidMapped.length === 0) {
      issues.push({ severity: "warning", message: "All clues related to the discriminating test are in late placement" });
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
    issues.push({ severity: "warning", message: "All clues related to the discriminating test are in late placement" });
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

// ============================================================================
// runAgent5
// ============================================================================

export async function runAgent5(ctx: OrchestratorContext): Promise<void> {
  ctx.reportProgress("clues", "Extracting and organizing clues...", 50);

  const clueDensity: "minimal" | "moderate" | "dense" =
    ctx.inputs.targetLength === "short" ? "minimal"
    : ctx.inputs.targetLength === "long" ? "dense"
    : "moderate";

  const cluesStart = Date.now();
  let clues: Awaited<ReturnType<typeof extractClues>>;
  const cluesInputBase = {
    cml: ctx.cml!,
    clueDensity,
    redHerringBudget: 2,
    runId: ctx.runId,
    projectId: ctx.projectId || "",
  };
  try {
    clues = await extractClues(ctx.client, cluesInputBase);
  } catch (err) {
    if (err instanceof SyntaxError) {
      ctx.warnings.push("Agent 5: JSON parse failure on first attempt; retrying");
      clues = await extractClues(ctx.client, cluesInputBase);
    } else {
      throw err;
    }
  }

  ctx.agentCosts["agent5_clues"] = clues.cost;
  ctx.agentDurations["agent5_clues"] = Date.now() - cluesStart;

  ctx.reportProgress("clues", `${clues.clues.length} clues distributed`, 62);

  // ── First guardrail pass ───────────────────────────────────────────────────
  let clueGuardrails = applyClueGuardrails(ctx.cml!, clues);
  clueGuardrails.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));

  if (clueGuardrails.hasCriticalIssues) {
    ctx.warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
    clueGuardrails.issues.forEach((issue) =>
      ctx.warnings.push(`  - [${issue.severity}] ${issue.message}`)
    );

    const retryCluesStart = Date.now();
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: {
        overallStatus: "fail",
        violations: clueGuardrails.issues
          .filter((i) => i.severity === "critical")
          .map((i) => ({
            severity: "critical" as const,
            rule: "Deterministic Guardrail",
            description: i.message,
            suggestion:
              "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
          })),
        warnings: clueGuardrails.issues
          .filter((i) => i.severity !== "critical")
          .map((i) => i.message),
        recommendations: [
          "Move essential clues to early/mid placement",
          "Avoid private/detective-only clue phrasing",
          "Ensure clue IDs are unique and timeline is balanced",
        ],
      },
      runId: ctx.runId,
      projectId: ctx.projectId || "",
    });

    ctx.agentCosts["agent5_clues"] = clues.cost;
    ctx.agentDurations["agent5_clues"] =
      (ctx.agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

    const secondGuardrailPass = applyClueGuardrails(ctx.cml!, clues);
    secondGuardrailPass.fixes.forEach((fix) => ctx.warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
    if (secondGuardrailPass.hasCriticalIssues) {
      secondGuardrailPass.issues.forEach((i) =>
        ctx.errors.push(`Agent 5 guardrail failure: ${i.message}`)
      );
      throw new Error("Clue generation failed deterministic fair-play guardrails");
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
  // Hoist suspect-elimination check so FIX-J can reuse results without a second call.
  const initialSuspectEliminationIssues = initialCoverage.suspectIssues;

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
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: coverageFeedback,
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
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: suspectCoverageFeedback,
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
      throw new Error(`Agent 5 suspect-coverage gate failed after retry. ${summaryParts.join("; ")}`);
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

    const redHerringRetryStart = Date.now();
    clues = await extractClues(ctx.client, {
      cml: ctx.cml!,
      clueDensity,
      redHerringBudget: 2,
      fairPlayFeedback: {
        overallStatus: "fail",
        violations: initialRedHerringOverlapIds.map((id: string) => ({
          severity: "critical" as const,
          rule: "Red Herring Separation",
          description: `Red herring ${id} contains terms that overlap inference corrections and may support the true solution.`,
          suggestion: "Rewrite this red herring to reinforce only the false assumption and avoid terms tied to true-solution corrections.",
        })),
        warnings: [],
        recommendations: [
          "Red herrings must support the false assumption only",
          "Do not reuse correction-language terms from inference_path.steps[].correction in red herring text",
          "Preserve misdirection without reinforcing culprit-identifying logic",
        ],
      },
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
        const postRetryRedHerringOverlapIds = severeOverlap.map((d) => d.redHerringId);
        throw new Error(
          `Agent 5 red-herring overlap gate failed after retry. Overlapping red herring(s): ${postRetryRedHerringOverlapIds.join(", ")}`,
        );
      }
      ctx.warnings.push(
        `Agent 5: minor red-herring overlap remains after retry (${postRetryRedHerringOverlapDetails.map((d) => d.redHerringId).join(", ")}); continuing with warning`,
      );
    }
  }

  const sourcePathValidation = checkSourcePathValidity(ctx.cml!, clues);
  sourcePathValidation.issues.forEach((issue) => ctx.errors.push(`Agent 5 source-path validation: ${issue.message}`));
  if (sourcePathValidation.issues.length > 0) {
    throw new Error(`Agent 5 source-path gate failed with ${sourcePathValidation.issues.length} invalid source path(s).`);
  }

  const stepBoundIssues = checkInferenceStepBounds(ctx.cml!, clues);
  stepBoundIssues.forEach((issue) => ctx.errors.push(`Agent 5 inference-step bounds: ${issue.message}`));
  if (stepBoundIssues.length > 0) {
    throw new Error(`Agent 5 step-index gate failed with ${stepBoundIssues.length} out-of-range inference step reference(s).`);
  }

  const auditConsistencyIssues = checkModelAuditConsistency(ctx.cml!, clues);
  auditConsistencyIssues.forEach((issue) => ctx.errors.push(`Agent 5 audit consistency: ${issue.message}`));
  if (auditConsistencyIssues.length > 0) {
    throw new Error(`Agent 5 audit-consistency gate failed with ${auditConsistencyIssues.length} mismatch(es).`);
  }

  const eraTimeStyleIssues = checkEraTimeStyleInClues(clues);
  eraTimeStyleIssues.forEach((issue) => ctx.warnings.push(`Agent 5 era time style: ${issue.message}`));

  // Strict locked-fact/clue semantic consistency gate before committing clues downstream.
  const hardLogicLockedFacts = Array.isArray((ctx as any).hardLogicDevices?.devices)
    ? (ctx as any).hardLogicDevices.devices.flatMap((d: any) =>
        Array.isArray(d?.lockedFacts) ? d.lockedFacts : [],
      )
    : undefined;
  const timeConflicts = findLockedFactClueTimeConflicts(ctx.cml!, clues, hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    timeConflicts.forEach((msg) => ctx.errors.push(`Agent 5 CML-clue consistency failure: ${msg}`));
    throw new Error(
      `Agent 5 CML-clue consistency gate failed (${timeConflicts.length} time conflict(s)).`,
    );
  }

  const culpritGaps = findCulpritDiscriminatingGaps(ctx.cml!, clues);
  if (culpritGaps.length > 0) {
    throw new Error(
      `Agent 5 culprit-discriminating clue gate failed. Missing direct evidence clue for culprit(s): ${culpritGaps.join(", ")}`,
    );
  }

  const finalCoverage = buildCoverageSnapshot(clues);

  if (performedCoverageRetry) {
    finalCoverage.allCoverageIssues.forEach((issue) =>
      ctx.warnings.push(`Inference coverage final: [${issue.severity}] ${issue.message}`),
    );
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
    throw new Error(`Agent 5 coverage hard gate failed after retries: ${summary}`);
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
    const clueTotal = Math.round(clueValidation * 0.5 + clueCountScore * 0.3 + 100 * 0.2);
    ctx.scoreAggregator.upsertPhaseScore(
      "agent5_clues",
      "Clue Distribution",
      {
        agent: "agent5-clue-distribution",
        validation_score: clueValidation,
        quality_score: 100,
        completeness_score: clueCountScore,
        consistency_score: 100,
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
        ],
      },
      ctx.agentDurations["agent5_clues"] ?? 0,
      ctx.agentCosts["agent5_clues"] ?? 0
    );
    try { await ctx.savePartialReport(); } catch { /* best-effort */ }
  }
}

export const __testables = {
  buildSuspectCoverage,
  analyzeSuspectCoverage,
  checkDiscriminatingTestReachability,
  findRedHerringOverlapDetails,
  findRedHerringTrueSolutionOverlap,
};
