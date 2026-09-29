/**
 * Agent 5's deterministic clue contracts: source paths, strict prompt contracts, step coverage, suspect
 * coverage, mechanism visibility, red-herring overlap, era time style, and the coverage snapshot Agent 6 reads.
 * 
 * Moved verbatim from agent5-run.ts (code review A5-05): Agent 6 imported these from the Agent 5 RUNNER, a
 * worker agent importing another. Both runners now import this module; agent5-run.ts re-exports what it
 * exported, so existing importers keep their path.
 */
import { provesTheAct } from "@cml/prompts-llm";
import type { ClueDistributionResult } from "@cml/prompts-llm";
import type { CaseData } from "@cml/cml";
import {
  type ClueGuardrailIssue,
  type InferenceCoverageResult,
} from "./shared.js";
import {
  checkEraTimeStyleInClues,
  findLockedFactClueTimeConflicts,
  nameAppearsInText,
  normalizeTokens,
  repairLockedFactClueTimeTranspositions,
  replaceDigitTimesWithEraWords,
  sanitizeEraTimeStyleInClues,
} from "./agent5-clue-time.js";
import {
  ALLOWED_SOURCE_PATTERNS,
  buildStrictSourcePathWhitelist,
  checkSourcePathValidity,
  getByPath,
  getCaseBlock,
  repairInvalidSourcePaths,
  validateSourcePath,
} from "./agent5-source-paths.js";
import {
  analyzeSuspectCoverage,
  checkSuspectElimination,
} from "./agent5-suspect-coverage.js";
import {
  checkMechanismVisibility,
  extractMechanismVisibilityPhrases,
  extractMechanismVisibilityTerms,
} from "./agent5-mechanism-visibility.js";
import {
  CANONICAL_CLUE_ID_RE,
  checkContradictionPairs,
  checkDiscriminatingTestReachability,
  checkFalseAssumptionContradiction,
  checkInferencePathCoverage,
  checkInferenceStepBounds,
  getCanonicalEvidenceClueIds,
} from "./agent5-inference-checks.js";
// Re-exported so existing importers of this module keep their path.
export {
  CANONICAL_CLUE_ID_RE,
  checkContradictionPairs,
  checkDiscriminatingTestReachability,
  checkFalseAssumptionContradiction,
  checkInferencePathCoverage,
  checkInferenceStepBounds,
  getCanonicalEvidenceClueIds,
} from "./agent5-inference-checks.js";
// Re-exported so existing importers of this module keep their path.
export {
  checkMechanismVisibility,
} from "./agent5-mechanism-visibility.js";
// Re-exported so existing importers of this module keep their path.
export {
  analyzeSuspectCoverage,
  checkSuspectElimination,
} from "./agent5-suspect-coverage.js";
// Re-exported so existing importers of this module keep their path.
export {
  RedHerringOverlapDetail,
  findRedHerringOverlapDetails,
  findRedHerringTrueSolutionOverlap,
  isOverlapCandidateToken,
} from "./agent5-red-herrings.js";
// Re-exported so existing importers of this module keep their path.
export {
  buildStrictSourcePathWhitelist,
  checkSourcePathValidity,
  getCaseBlock,
  repairInvalidSourcePaths,
  strictSourcePathWhitelistCache,
  validateSourcePath,
} from "./agent5-source-paths.js";
// Re-exported so existing importers of this module keep their path.
export {
  checkEraTimeStyleInClues,
  findLockedFactClueTimeConflicts,
  normalizeTokens,
  repairLockedFactClueTimeTranspositions,
  replaceDigitTimesWithEraWords,
  sanitizeEraTimeStyleInClues,
} from "./agent5-clue-time.js";

/**
 * The culprit-direct slot contract. `weaponTrace` / `weaponPhrase` are set when the case carries a
 * weapon-first trace naming the culprit (Agent 3 rule 8b, A_102): the slot then sources from that
 * trace and must name the weapon, so the link authored upstream reaches the clue layer intact
 * (A_102 §10.2 — on seed 6325 it did not).
 */
type StrictDirectCulpritClue = {
  id: string;
  culpritName: string;
  allowedSourcePaths: string[];
  requiredPhrases: string[];
  weaponTrace?: string;
  weaponPhrase?: string;
};

/** "struck with a heavy iron poker" -> "heavy iron poker". */
const weaponPhraseOf = (deathMethod: string): string | undefined => {
  const m = / with (?:a |an |the )?(.+)$/i.exec(String(deathMethod ?? "").trim());
  return m ? m[1].trim().replace(/[.;]+$/, "") : undefined;
};

type StrictPromptFeedbackPayload = {
  overallStatus: "pass" | "fail" | "needs-revision";
  recommendations: string[];
  strictSourcePaths: string[];
  requiredIdToSourceMappings: Array<{ id: string; sourceInCML: string }>;
  requiredStepCoverageFloors: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>;
  requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" };
  requiredDirectCulpritClue?: StrictDirectCulpritClue;
};

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

export const toClueIdSlug = (value: string): string =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
  || "culprit";

const buildStrictStepCoverageFloors = (cml: CaseData): Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }> => {
  const caseBlock = getCaseBlock(cml);
  const steps = Array.isArray(caseBlock?.inference_path?.steps) ? caseBlock.inference_path.steps : [];
  // A_53 P2 (a5-step-coverage-floor-requires-contradiction): a step can only be held to a
  // contradiction-coverage floor if it actually has a contradiction SOURCE — its own `correction`,
  // or a case-level time.contradictions anchor. A pure-observation step with neither must not abort
  // the run on a contradiction it can never satisfy.
  const hasTimeContradictions =
    Array.isArray(caseBlock?.constraint_space?.time?.contradictions) &&
    caseBlock.constraint_space.time.contradictions.length > 0;
  return steps.map((step: any, index: number) => {
    const hasOwnCorrection = String(step?.correction ?? "").trim().length > 0;
    return {
      step: index + 1,
      requireContradiction: hasOwnCorrection || hasTimeContradictions,
      requireMapped: true,
    };
  });
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
): StrictDirectCulpritClue | undefined => {
  const caseBlock = getCaseBlock(cml);
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((name: any) => String(name ?? "").trim()).filter(Boolean)
    : [];
  const culpritName = culprits[0];
  if (!culpritName) return undefined;

  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const castIndex = cast.findIndex((entry: any) => String(entry?.name ?? "").trim() === culpritName);
  const allowedSourcePaths: string[] = [];

  // A_102 §10.2: the slot used to source from cast[].evidence_sensitivity — bare nouns — and the
  // murder weapon never entered the clue layer. When the case carries a weapon-first trace naming the
  // culprit, that trace is the FIRST allowed source and its weapon is a required phrase.
  const link = provesTheAct(caseBlock);
  const traces: string[] = Array.isArray(caseBlock?.constraint_space?.physical?.traces)
    ? caseBlock.constraint_space.physical.traces.map((t: any) => String(t ?? ""))
    : [];
  const weaponTrace = link.linkingTraces[0];
  const weaponTraceIndex = weaponTrace ? traces.indexOf(weaponTrace) : -1;
  if (weaponTraceIndex >= 0) {
    const tracePath = `CASE.constraint_space.physical.traces[${weaponTraceIndex}]`;
    if (strictSourcePaths.includes(tracePath)) allowedSourcePaths.push(tracePath);
  }
  const weaponPhrase = weaponTraceIndex >= 0 ? weaponPhraseOf(String(caseBlock?.death_method ?? "")) : undefined;

  if (castIndex >= 0) {
    const castPaths = [
      `CASE.cast[${castIndex}].evidence_sensitivity[0]`,
      `CASE.cast[${castIndex}].alibi_window`,
      `CASE.cast[${castIndex}].access_plausibility`,
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
    requiredPhrases: [culpritName, ...(weaponPhrase ? [weaponPhrase] : []), "direct evidence", "means and opportunity", "no other eligible suspect"],
    weaponTrace: weaponTraceIndex >= 0 ? weaponTrace : undefined,
    weaponPhrase,
  };
};

const buildStrictIdToSourceMappings = (
  cml: CaseData,
  strictSourcePaths: string[],
  requiredDirectCulpritClue?: StrictDirectCulpritClue,
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

// A_53 P10 (a5-strict-feedback-recomputed-per-attempt): the full strict-prompt-feedback payload is
// also a pure derivation of the immutable CML, rebuilt on every Agent-5 attempt. Memoize per CML
// object (WeakMap, keyed on case identity) so it is computed once per run.
export const strictPromptFeedbackCache = new WeakMap<object, { value: StrictPromptFeedbackPayload | undefined }>();

const computeStrictPromptFeedback = (cml: CaseData): StrictPromptFeedbackPayload | undefined => {
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

export const buildStrictPromptFeedback = (cml: CaseData): StrictPromptFeedbackPayload | undefined => {
  // A_53 P10 (a5-strict-feedback-recomputed-per-attempt): memoized wrapper over the pure compute.
  // The cache box stores even an `undefined` result so the (non-trivial) computation isn't repeated
  // when strict contracts legitimately produce no payload.
  const key = (cml as unknown as object) ?? undefined;
  if (!key || typeof key !== "object") return computeStrictPromptFeedback(cml);
  const cached = strictPromptFeedbackCache.get(key);
  if (cached) return cached.value;
  const value = computeStrictPromptFeedback(cml);
  strictPromptFeedbackCache.set(key, { value });
  return value;
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
  requiredDirectCulpritClue?: StrictDirectCulpritClue,
): string[] => {
  if (!requiredDirectCulpritClue) return [];

  const repairs: string[] = [];
  const culpritName = requiredDirectCulpritClue.culpritName;
  const caseBlock = getCaseBlock(cml);
  const eligibleNonCulprits = getEligibleNonCulpritNames(caseBlock, culpritName);
  const nonCulpritSample = eligibleNonCulprits.slice(0, 2);
  const nonCulpritClause = nonCulpritSample.length > 0
    ? `No other eligible suspect, including ${nonCulpritSample.join(" and ")}, matches this mechanism-specific evidence.`
    : "No other eligible suspect matches this mechanism-specific evidence.";
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
      description: `Direct evidence ties ${culpritName} to the mechanism access point before the discriminating test and excludes competing suspect timelines.`,
      sourceInCML,
      pointsTo: `This direct evidence shows ${culpritName} had means and opportunity, narrowing the solution uniquely toward the culprit. ${nonCulpritClause}`,
      placement: "mid",
      criticality: "essential",
      supportsInferenceStep: inferSupportsInferenceStepFromSourcePath(sourceInCML, findPreferredCulpritStep(cml, culpritName)),
      evidenceType: "observation",
    };
    clues.clues.push(clue);
    repairs.push(`strict direct culprit slot repair: synthesized ${requiredDirectCulpritClue.id}`);
  }

  // A_53 P4 (a5-direct-culprit-slot-admits-non-culprit): a donor/adopted clue may name the culprit
  // AND a non-culprit without exclusivity language → it doesn't actually discriminate. Enforce the
  // same `mentionsNonCulprit && !hasExclusivityLanguage` test the exclusivity validator uses, here in
  // the slot builder: rewrite to the canonical exclusive description so the slot points uniquely at
  // the culprit. (Synthesized clues already use this description; this catches adopted donors.)
  {
    const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`;
    const mentionsNonCulprit = eligibleNonCulprits.some((n) => nameAppearsInText(n, clueText));
    if (mentionsNonCulprit && !hasExclusivityLanguage(clueText)) {
      clue.description =
        `Direct evidence ties ${culpritName} to the mechanism access point before the discriminating ` +
        `test and excludes competing suspect timelines.`;
      clue.pointsTo =
        `This direct evidence shows ${culpritName} had means and opportunity, narrowing the solution ` +
        `uniquely toward the culprit. ${nonCulpritClause}`;
      repairs.push(
        `strict direct culprit exclusivity repair: rewrote ${requiredDirectCulpritClue.id} to the canonical exclusive description`,
      );
    }
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
  if (!nameAppearsInText(culpritName, clueText)) {
    // A_102 §10.2: the old template said "the mechanism access point" and erased the weapon from the
    // one clue that carried it. When the case has a weapon-first trace, the repair restates THAT.
    const weapon = requiredDirectCulpritClue.weaponPhrase;
    clue.description = requiredDirectCulpritClue.weaponTrace
      ? `${requiredDirectCulpritClue.weaponTrace}. Direct evidence ties ${culpritName} to the ${weapon ?? "murder weapon"} before the discriminating test and excludes competing suspect timelines.`
      : `Direct evidence ties ${culpritName} to the mechanism access point before the discriminating test and excludes competing suspect timelines.`;
    clue.pointsTo = `This direct evidence shows ${culpritName} had means and opportunity${weapon ? ` with the ${weapon}` : ""}, narrowing the solution uniquely toward the culprit. ${nonCulpritClause}`;
    repairs.push(`strict direct culprit phrasing repair: ${requiredDirectCulpritClue.id}`);
  } else if (missingPhrases.length > 0) {
    // Append what is missing; never overwrite a clue that already names the culprit. Overwriting is
    // how a weapon-bearing observable became "the mechanism access point" (A_102 §10.2).
    clue.pointsTo = `${String(clue?.pointsTo ?? "").trim()} ${culpritName}: ${missingPhrases.join(", ")}.`.trim();
    repairs.push(`strict direct culprit phrasing repair (appended ${missingPhrases.length} phrase(s)): ${requiredDirectCulpritClue.id}`);
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
  requiredDirectCulpritClue?: StrictDirectCulpritClue,
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

export const checkCastNamePathConsistency = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
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

export const repairCastNamePathConsistency = (cml: CaseData, clues: ClueDistributionResult): string[] => {
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

export const getMissingDiscriminatingEvidenceIds = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const evidenceIds = getCanonicalEvidenceClueIds(cml);
  if (evidenceIds.length === 0) return [];
  const clueIds = new Set(clues.clues.map((c: any) => String(c?.id ?? "").trim()).filter(Boolean));
  return evidenceIds.filter((id: string) => !clueIds.has(id));
};

export const checkModelAuditConsistency = (cml: CaseData, clues: ClueDistributionResult): ClueGuardrailIssue[] => {
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

export const reconcileModelAudit = (cml: CaseData, clues: ClueDistributionResult): void => {
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

function getEligibleNonCulpritNames(caseBlock: any, culpritName: string): string[] {
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  return cast
    .filter((entry: any) => String(entry?.culprit_eligibility ?? "").toLowerCase() === "eligible")
    .map((entry: any) => String(entry?.name ?? "").trim())
    .filter((name: string) => name.length > 0 && name.toLowerCase() !== culpritName.toLowerCase());
}

function hasExclusivityLanguage(text: string): boolean {
  return /\b(only|no\s+other\s+(eligible\s+)?suspect|uniquely|exclusive|excludes?|eliminates?)\b/i.test(text);
}

function usesWeakOpportunityOnlySourcePath(sourceInCML: string): boolean {
  return /CASE\.cast\[\d+\]\.(access_plausibility|alibi_window)$/.test(sourceInCML);
}

export function findCulpritDiscriminatingGaps(cml: CaseData, clues: ClueDistributionResult): string[] {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const culprits = Array.isArray(caseBlock?.culpability?.culprits)
    ? caseBlock.culpability.culprits.map((n: any) => String(n ?? "").trim()).filter(Boolean)
    : [];
  if (culprits.length === 0) return [];

  const incriminatingPattern = /\b(incriminat|direct\s+evidence|physical\s+trace|forensic|motive|opportunity|means|only\s+person\s+who\s+could)\b/i;
  const gaps: string[] = [];

  for (const culprit of culprits) {
    const eligibleNonCulprits = getEligibleNonCulpritNames(caseBlock, culprit);
    const hasDiscriminating = clues.clues.some((clue: any) => {
      const text = `${String(clue.description ?? "")} ${String(clue.pointsTo ?? "")}`;
      if (!nameAppearsInText(culprit, text)) return false;
      if (!incriminatingPattern.test(text)) return false;

      const sourceInCML = String(clue?.sourceInCML ?? "").trim();
      if (!validateSourcePath(cml, sourceInCML)) return false;

      const mentionsNonCulprit = eligibleNonCulprits.some((name) => nameAppearsInText(name, text));
      const hasExclusivity = hasExclusivityLanguage(text) || mentionsNonCulprit;
      if (!hasExclusivity) return false;

      if (usesWeakOpportunityOnlySourcePath(sourceInCML) && !mentionsNonCulprit) return false;
      return true;
    });
    if (!hasDiscriminating) gaps.push(culprit);
  }

  return gaps;
}

export function synthesizeMissingCulpritDiscriminatingClues(
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
    const eligibleNonCulprits = getEligibleNonCulpritNames(caseBlock, normalizedCulprit);
    const nonCulpritSample = eligibleNonCulprits.slice(0, 2);
    const nonCulpritClause = nonCulpritSample.length > 0
      ? `No other eligible suspect, including ${nonCulpritSample.join(" and ")}, matches this mechanism-specific evidence.`
      : "No other eligible suspect matches this mechanism-specific evidence.";

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
      description: `Direct evidence links ${normalizedCulprit} to the mechanism access point before the discriminating test and excludes competing suspect timelines.`,
      pointsTo: `Physical trace and opportunity evidence indicate ${normalizedCulprit} had means and opportunity, making this a direct evidence clue for culprit identification. ${nonCulpritClause}`,
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

export function synthesizeMissingDiscriminatingEvidenceClues(
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

/**
 * A_53 P2 (repair-not-abort) — deterministically promote any LATE clue that the discriminating-test
 * timing gate or the mechanism-visibility gate requires to be early/mid up to "mid", mirroring those
 * checkers' own clue-selection so the repair never drifts from what they enforce. Returns the ids
 * promoted; the caller rebuilds the timeline and re-checks. Genuinely-unrepairable defects (a missing
 * evidence id, or no mechanism-visible clue at all) are left for the caller to surface as warnings.
 */
const promoteLateGateCluesToMid = (cml: CaseData, clues: ClueDistributionResult): string[] => {
  const promoted: string[] = [];
  const promote = (clue: any) => {
    if (!clue) return;
    const placement = String(clue.placement ?? "").toLowerCase();
    if (placement !== "early" && placement !== "mid") {
      clue.placement = "mid";
      promoted.push(String(clue.id ?? "(unknown-id)"));
    }
  };

  // (1) Discriminating-test evidence clues — by canonical id, else by design/knowledge text overlap
  // (mirrors checkDiscriminatingTestReachability).
  const clueById = new Map((clues.clues as any[]).map((c) => [String(c.id), c]));
  const caseBlock = getCaseBlock(cml);
  const evidenceIds = getCanonicalEvidenceClueIds(cml);
  if (evidenceIds.length > 0) {
    for (const id of evidenceIds) promote(clueById.get(id));
  } else {
    const discrimTest = caseBlock?.discriminating_test;
    const combined = `${String(discrimTest?.design ?? "")} ${String(discrimTest?.knowledge_revealed ?? "")}`.toLowerCase();
    const testWords = combined.split(/\s+/).filter((w) => w.length > 4);
    if (testWords.length > 0) {
      for (const clue of clues.clues as any[]) {
        const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")} ${String(clue?.sourceInCML ?? "")}`.toLowerCase();
        const matchCount = testWords.filter((w) => clueText.includes(w)).length;
        if (matchCount >= Math.ceil(testWords.length * 0.2)) promote(clue);
      }
    }
  }

  // (2) Mechanism-visible clues (mirrors checkMechanismVisibility's selection).
  const mechanismText = `${String(caseBlock?.hidden_model?.mechanism?.description ?? "")} ${String(caseBlock?.discriminating_test?.knowledge_revealed ?? "")}`.trim();
  const terms = extractMechanismVisibilityTerms(mechanismText);
  if (terms.length >= 3) {
    const phrases = extractMechanismVisibilityPhrases(mechanismText);
    for (const clue of clues.clues as any[]) {
      const text = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();
      const tokenSet = new Set(normalizeTokens(text));
      const termMatches = terms.filter((term) => tokenSet.has(term)).length;
      const phraseMatch = phrases.some((phrase) => text.includes(phrase));
      if (phraseMatch || termMatches >= 1) promote(clue);
    }
  }

  return [...new Set(promoted)];
};

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
  // A_67 review bug (stale-audit-vs-repaired-text): repairCastNamePathConsistency rewrites clue text
  // (wrong cast name → expected), which shifts suspect coverage. Without re-syncing, the audit still
  // reflects the PRE-repair text (reconciled at line 2994), so checkModelAuditConsistency below
  // recomputes coverage from the repaired text and mismatches the stale snapshot — a spurious
  // run-killing abort on a run the repair just fixed. Re-reconcile so the audit matches the repaired text.
  if (castPathRepairs.length > 0) reconcileModelAudit(cml, clues);

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

  // X86 — repair, re-check, THEN throw, exactly as every neighbouring gate in this function does.
  // Only a provable transposition against the canonical registry is repaired; anything else still aborts.
  let timeConflicts = findLockedFactClueTimeConflicts(cml, clues, options?.hardLogicLockedFacts);
  if (timeConflicts.length > 0) {
    const timeRepairs = repairLockedFactClueTimeTranspositions(cml, clues, options?.hardLogicLockedFacts);
    timeRepairs.forEach((repair) => warnings.push(`Agent 5 locked-fact time transposition repair: ${repair}`));
    timeConflicts = findLockedFactClueTimeConflicts(cml, clues, options?.hardLogicLockedFacts);
  }
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
    // A_53 P2 (repair-not-abort): the deterministic backstop synthesis already ran above; per-step
    // contradiction floors now exclude pure-observation steps. Any residual coverage gap is a
    // fair-play warning, not a run-killer.
    strictStepCoverageIssues.forEach((issue) =>
      warnings.push(`Agent 5 strict step coverage (non-fatal): ${issue.message}`),
    );
  }

  const strictContractIssues = checkStrictPromptContracts(clues, strictPromptFeedback)
    .filter((issue) => issue.severity === "critical");
  if (strictContractIssues.length > 0) {
    throw new Error(`Agent 5 strict contract gate failed with ${strictContractIssues.length} critical issue(s).`);
  }

  const metaAuditIssues = checkMetaAuditClueText(clues)
    .filter((issue) => issue.severity === "critical");
  if (metaAuditIssues.length > 0) {
    // A_53 P2 (repair-not-abort): meta-audit text in a clue is a quality warning — and the broad
    // substring patterns are false-positive-prone (tightened in P5) — never a run-killer.
    metaAuditIssues.forEach((issue) => warnings.push(`Agent 5 meta clue text (non-fatal): ${issue.message}`));
  }

  // A_53 P2 (repair-not-abort): the discriminating-timing and mechanism-visibility gates fail almost
  // exclusively because a required clue sits in LATE placement — exactly the mechanical repair the
  // clue guardrails already perform. Promote those clues to mid, rebuild the timeline, and re-check;
  // only a genuinely-unrepairable defect (missing evidence id, no mechanism-visible clue at all)
  // survives — surfaced as a warning, never a throw.
  let discrimReachabilityIssues = checkDiscriminatingTestReachability(cml, clues)
    .filter((issue) => issue.severity === "critical");
  let mechanismVisibilityIssues = checkMechanismVisibility(cml, clues)
    .filter((issue) => issue.severity === "critical");
  if (discrimReachabilityIssues.length > 0 || mechanismVisibilityIssues.length > 0) {
    const promoted = promoteLateGateCluesToMid(cml, clues);
    if (promoted.length > 0) {
      rebuildClueTimelineFromPlacements(clues);
      reconcileModelAudit(cml, clues);
      warnings.push(
        `Agent 5 timing-gate repair: promoted ${promoted.length} late clue(s) to mid (${promoted.join(", ")}).`,
      );
      discrimReachabilityIssues = checkDiscriminatingTestReachability(cml, clues)
        .filter((issue) => issue.severity === "critical");
      mechanismVisibilityIssues = checkMechanismVisibility(cml, clues)
        .filter((issue) => issue.severity === "critical");
    }
    discrimReachabilityIssues.forEach((issue) =>
      warnings.push(`Agent 5 discriminating-timing residual (non-fatal): ${issue.message}`),
    );
    mechanismVisibilityIssues.forEach((issue) =>
      warnings.push(`Agent 5 mechanism-visibility residual (non-fatal): ${issue.message}`),
    );
  }

  return { warnings };
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
