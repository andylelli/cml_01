/**
 * Agent 5: Clue Distribution & Red Herring Agent
 * 
 * Analyzes validated CML and extracts/organizes clues for fair play.
 * Does NOT add new facts - only derives clues from existing CML structure.
 * 
 * Uses logger from llm-client (like Agents 3 & 4).
 */

import { CANONICAL_CLUE_ID_RE } from "@cml/cml";
import { enumerateSourcePaths } from "@cml/cml";
import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import { parseLlmJson } from "./shared/llm-json.js";
import { resolveDesignModel } from "./utils/model-tiers.js";
import type { PromptComponents } from "./types.js";
import type { Clue, ClueDistributionResult, RedHerring } from "./types/clue-distribution.js";
import { deathMethodTellHints } from "./shared/clue-observable.js";
import { extractKeyTerms } from "./agent5/key-terms.js";
import { normalizeRetryFeedback, buildRetryModeBlock } from "./agent5/retry-feedback.js";
import {
  CLUE_SYSTEM_PROMPT,
  CLUE_PLACEMENT_STRATEGY,
  FAILURE_MODE_HARDENING,
  HARD_PRECEDENCE_AND_GENERATION_ORDER,
  MICRO_EXEMPLARS,
  OUTPUT_JSON_SCHEMA,
  QUALITY_BAR,
  SILENT_PRE_OUTPUT_CHECKLIST,
  buildCastIndexMapSection,
  buildClueDensitySection,
  buildCmlSummarySection,
  buildConstraintSpaceSections,
  buildDeterministicBoundsSection,
  buildDeterministicOutputContractsSection,
  buildEvidenceSensitiveSection,
  buildFairPlayAuditSection,
  buildFirstAttemptContracts,
  buildFirstPassSlotsSection,
  buildHardConstraintsLearnedSection,
  buildLockedFactsSection,
  buildMandatoryRequirementsList,
  buildQualityControlsSection,
  buildRedHerringSection,
  buildSourcePathLegalitySection,
  buildStrictContractBlock,
  buildUserRulesSection,
  buildValidSourcePathsSection,
} from "./agent5/clue-prompt-sections.js";
// A5-05: moved to leaves; re-exported so every importer of this module keeps its path.
export type { Clue, RedHerring, ClueDistributionResult, ClueExtractionAudit } from "./types/clue-distribution.js";
export { deriveClueObservable, deathMethodTellHints } from "./shared/clue-observable.js";

export interface ClueExtractionInputs {
  cml: Record<string, unknown>;    // Validated CML object
  clueDensity: "minimal" | "moderate" | "dense"; // How many clues to surface
  redHerringBudget: number;         // Number of red herrings (0-3)
  fairPlayFeedback?: {
    overallStatus?: "pass" | "fail" | "needs-revision";
    violations?: Array<{ severity: "critical" | "moderate" | "minor"; rule: string; description: string; suggestion: string }>;
    warnings?: string[];
    recommendations?: string[];
    violationCodes?: string[];
    targetedClueIds?: string[];
    preserveClueIds?: string[];
    requiredCluePhrases?: string[];
    castPathBindingRules?: string[];
    castPathNameIndexMap?: Array<{ index: number; name: string }>;
    forbiddenTerms?: string[];
    preferredTerms?: string[];
    requiredReplacements?: string[];
    redHerringIdsToRewrite?: string[];
    strictSourcePaths?: string[];
    requiredIdToSourceMappings?: Array<{ id: string; sourceInCML: string }>;
    requiredStepCoverageFloors?: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>;
    requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" };
    requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[]; weaponTrace?: string; weaponPhrase?: string };
  };
  runId?: string;
  projectId?: string;
  retryAttempt?: number; // 1-based attempt index for logging/file naming
  /** Pillar 1: canonical locked facts from registry — must be honoured verbatim in clue descriptions */
  lockedFacts?: Array<{ id: string; value: string; description: string }>;
  /**
   * A_65b Ph6 (reliability plan) — the STRICT STRUCTURAL CONTRACT, first-pass. Previously these
   * exact shapes (required ids→sources, the direct-culprit clue, the late slot, step floors)
   * reached the LLM only in RETRY mode — and retries are disabled by default ("deterministic
   * remediation mode active") — so the deterministic synthesis fired on EVERY run (5/5 in the
   * warning corpus) and its templated text ("remains a late texture detail in the case
   * background") is the machine register the judge reads. Stating the contract up front lets the
   * LLM AUTHOR these clues in scene register; the synthesis machinery stays as the counted floor.
   */
  strictContract?: {
    strictSourcePaths?: string[];
    requiredIdToSourceMappings?: Array<{ id: string; sourceInCML: string }>;
    requiredStepCoverageFloors?: Array<{ step: number; requireContradiction: boolean; requireMapped: boolean }>;
    requiredLateClueSlot?: { id: string; placement: "late"; criticality: "optional" | "supporting" };
    requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[]; weaponTrace?: string; weaponPhrase?: string };
  };
}

const STEP_SOURCE_RE = /^CASE\.inference_path\.steps\[(\d+)\]\./i;
const CORRECTION_SOURCE_RE = /CASE\.inference_path\.steps\[\d+\]\.correction/i;
const CONTRADICTION_SOURCE_RE = /CASE\.constraint_space\.time\.contradictions\[\d+\]/i;

const inferStepFromSourcePath = (sourcePath: unknown): number | undefined => {
  const normalized = String(sourcePath ?? "").trim();
  const match = normalized.match(STEP_SOURCE_RE);
  if (!match) return undefined;
  const stepIndex = Number(match[1]);
  if (!Number.isInteger(stepIndex) || stepIndex < 0) return undefined;
  return stepIndex + 1;
};

type ParsedClueEvidenceFields = { evidenceType?: unknown; sourceInCML?: unknown; description?: unknown; pointsTo?: unknown };

const inferEvidenceType = (clue: ParsedClueEvidenceFields | null | undefined): "observation" | "contradiction" | "elimination" => {
  const normalized = String(clue?.evidenceType ?? "").trim().toLowerCase();
  if (normalized === "observation" || normalized === "contradiction" || normalized === "elimination") {
    return normalized;
  }

  const sourcePath = String(clue?.sourceInCML ?? "").trim();
  const clueText = `${String(clue?.description ?? "")} ${String(clue?.pointsTo ?? "")}`.toLowerCase();

  if (CORRECTION_SOURCE_RE.test(sourcePath) || CONTRADICTION_SOURCE_RE.test(sourcePath)) {
    return "contradiction";
  }

  if (/\b(eliminat|ruled\s+out|not\s+the\s+(?:culprit|killer|murderer)|alibi|excluded?|cleared|innocent)\b/i.test(clueText)) {
    return "elimination";
  }

  return "observation";
};

// A_53 P11 (a5-getclueattemptnumber-fifo-eviction): the attempt number is the caller-supplied
// retryAttempt (1-based). The previous per-run fallback Map evicted its oldest-inserted key when
// full — which could be a still-active long-lived run — resetting that run's counter to 1 and
// mislabeling its retry artifact filenames. The fallback was dead on the primary path (every
// caller passes retryAttempt) and held unbounded process state, so it is removed: absent an
// explicit retryAttempt, this is the first attempt (no retry suffix).
function getClueAttemptNumber(inputs: ClueExtractionInputs): number {
  if (typeof inputs.retryAttempt === "number" && Number.isFinite(inputs.retryAttempt) && inputs.retryAttempt >= 1) {
    return Math.floor(inputs.retryAttempt);
  }
  return 1;
}

export interface PointsToCollision {
  normalized: string;
  clueIds: string[];
}

export interface PointsToDistinctnessResult {
  ok: boolean;
  collisions: PointsToCollision[];
}

/**
 * P1.2 — no two solving clues may resolve to the SAME implication. Redundant "points to X" clues
 * (and the over-eliminated suspects they imply) are a top cause of a flabby, repetitive middle.
 * Advisory by design: callers decide whether to diversify or retry.
 */
export function checkPointsToDistinctness(clues: Clue[]): PointsToDistinctnessResult {
  const byNormalized = new Map<string, string[]>();
  for (const clue of clues) {
    if (clue.criticality === "optional") continue;
    const normalized = String(clue.pointsTo ?? "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, " ")
      .trim();
    if (!normalized) continue;
    const ids = byNormalized.get(normalized) ?? [];
    ids.push(clue.id);
    byNormalized.set(normalized, ids);
  }
  const collisions: PointsToCollision[] = [];
  for (const [normalized, clueIds] of byNormalized) {
    if (clueIds.length > 1) collisions.push({ normalized, clueIds });
  }
  return { ok: collisions.length === 0, collisions };
}

/**
 * Required clue specification: defines WHAT clues must be generated
 */
interface RequiredClueSpec {
  requirement: string;              // What this clue must accomplish
  supportsInferenceStep?: number;   // Which inference step it supports
  evidenceType: "observation" | "contradiction" | "elimination";
  criticality: "essential" | "supporting";
  sourceInCML: string;              // Where the requirement comes from
  keyTerms: string[];               // Important terms that should appear
  suggestedPlacement: "early" | "mid";  // Essential clues never late
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  isDeathMethodTell?: boolean;          // A_61 RC3.5 — the cause-of-death "key tell" (discovery-scene)
}

/**
 * ELEGANT SOLUTION: Pre-analyze CML to generate explicit clue requirements
 * Instead of passive "remember to cover all steps", we give a concrete checklist
 */
function generateExplicitClueRequirements(cml: Record<string, unknown>): RequiredClueSpec[] {
  const requirements: RequiredClueSpec[] = [];
  const caseData = cml.CASE as any;
  const culpritNames: string[] = Array.isArray(caseData?.culpability?.culprits) ? caseData.culpability.culprits : [];
  const inferenceSteps = Array.isArray(caseData?.inference_path?.steps)
    ? caseData.inference_path.steps
    : [];

  // 1. Inference path coverage (observation + contradiction for each step)
  if (inferenceSteps.length > 0) {
    inferenceSteps.forEach((step: any, idx: number) => {
      const stepNum = idx + 1;
      
      // Observation clue (makes the step visible to reader)
      requirements.push({
        requirement: `Generate a clue that makes the reader directly observe: "${(step.observation || '').substring(0, 100)}..."`,
        supportsInferenceStep: stepNum,
        evidenceType: "observation",
        criticality: "essential",
        sourceInCML: `inference_path.steps[${idx}].observation`,
        keyTerms: extractKeyTerms(step.observation),
        suggestedPlacement: stepNum <= 2 ? "early" : "mid",
        category: inferCategory(step.observation)
      });

      // Contradiction clue (challenges false assumption at this step)
      requirements.push({
        requirement: `Generate a clue that provides evidence for: "${(step.correction || '').substring(0, 100)}..."`,
        supportsInferenceStep: stepNum,
        evidenceType: "contradiction",
        criticality: "essential",
        sourceInCML: `inference_path.steps[${idx}].correction`,
        keyTerms: extractKeyTerms(step.correction),
        suggestedPlacement: stepNum <= 2 ? "early" : "mid",
        category: inferCategory(step.correction)
      });
    });
  }

  // 1a. First-pass contradiction chain clue (explicit anti-false-assumption requirement)
  const firstCorrection = String(inferenceSteps[0]?.correction ?? "").trim();
  const falseAssumptionStatement = String(caseData?.false_assumption?.statement ?? "").trim();
  const contradictionAnchor = firstCorrection || falseAssumptionStatement;
  if (contradictionAnchor) {
    requirements.push({
      requirement: `Generate one essential early or mid contradiction clue that explicitly overturns the false assumption with reader-visible evidence before the discriminating test. Anchor: "${contradictionAnchor.substring(0, 140)}..."`,
      supportsInferenceStep: firstCorrection ? 1 : undefined,
      evidenceType: "contradiction",
      criticality: "essential",
      sourceInCML: firstCorrection
        ? "CASE.inference_path.steps[0].correction"
        : "CASE.false_assumption.statement",
      keyTerms: extractKeyTerms(contradictionAnchor),
      suggestedPlacement: "mid",
      category: inferCategory(contradictionAnchor)
    });
  }

  // 1b. Mechanism visibility clue
  if (caseData?.hidden_model?.mechanism?.description) {
    requirements.push({
      requirement: `Generate at least one essential early or mid observation clue that makes the core mechanism reader-visible before the discriminating test. The clue must surface this mechanism detail concretely: "${(caseData.hidden_model.mechanism.description || '').substring(0, 140)}..."`,
      supportsInferenceStep: undefined,
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.hidden_model.mechanism.description",
      keyTerms: extractKeyTerms(caseData.hidden_model.mechanism.description),
      suggestedPlacement: "early",
      category: inferCategory(caseData.hidden_model.mechanism.description),
    });
  }

  // 1c. Cause-of-death "key tell" (A_61 RC3.5). Distinct from the concealment mechanism (1b): a
  // reader-visible, fair-play indicator of the PHYSICAL manner of death (CASE.death_method), observable
  // at the body-discovery scene, so the reader can in principle infer HOW the victim died without being
  // told the concealment trick. Essential + early so Agent 7 can pin it to the discovery scene (RC3.5 PartB).
  if (typeof caseData?.death_method === "string" && caseData.death_method.trim()) {
    const deathMethod = String(caseData.death_method).trim();
    const tellHints = deathMethodTellHints(deathMethod);
    requirements.push({
      requirement: `Generate one essential EARLY clue giving a concrete, fair-play indicator of the manner of death (${deathMethod}) observable at the body-discovery scene — e.g. ${tellHints.examples}. Do NOT name or explain the concealment trick; only the physical tell a witness could see at the scene.`,
      supportsInferenceStep: undefined,
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.death_method",
      keyTerms: Array.from(new Set([...extractKeyTerms(deathMethod), ...tellHints.tokens])),
      suggestedPlacement: "early",
      category: inferCategory(deathMethod),
      isDeathMethodTell: true,
    });
  }

  // 2. Discriminating test evidence
  // CRITICAL: These clues MUST be placed early or mid — they must reach the reader BEFORE the discriminating test scene.
  // The test should exploit already-known evidence, not introduce it for the first time.
  if (caseData?.discriminating_test?.design) {
    requirements.push({
      requirement: `Generate a clue that provides observable evidence the reader must see BEFORE the discriminating test can be understood. The test exploits this evidence — it does NOT reveal it. Evidence for: "${(caseData.discriminating_test.design || '').substring(0, 100)}..."`,
      supportsInferenceStep: undefined, // Test synthesis, not a specific step
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: `discriminating_test.design`,
      keyTerms: extractKeyTerms(caseData.discriminating_test.design),
      suggestedPlacement: "mid", // Never late — must precede the test scene
      category: inferCategory(caseData.discriminating_test.design)
    });
  }

  // 2b. Culprit premeditation / planning evidence
  // If the culprit's guilt relies on premeditation, that must be reader-visible BEFORE confrontation.
  const culpritCast = Array.isArray(caseData?.cast)
    ? caseData.cast.filter((c: any) => culpritNames.includes(c.name))
    : [];

  culpritCast.forEach((culprit: any) => {
    const mechanismAnchor = caseData?.hidden_model?.mechanism?.description
      || caseData?.discriminating_test?.knowledge_revealed
      || culprit.motive_seed
      || culprit.private_secret
      || "";

    requirements.push({
      requirement: `Generate one essential mid-story clue whose description or pointsTo explicitly names ${culprit.name} and states the unique trace, preparation detail, or mechanism link that points to ${culprit.name} rather than any non-culprit.`,
      supportsInferenceStep: undefined,
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: "CASE.culpability.culprits[0]",
      keyTerms: [culprit.name, ...extractKeyTerms(mechanismAnchor)].slice(0, 4),
      suggestedPlacement: "mid",
      category: inferCategory(mechanismAnchor),
    });

    /**
     * ── WHY THERE IS NO "TRACE ON THE WEAPON" SLOT HERE, AND WHERE IT BELONGS ────────────────────
     *
     * A_101 §14.4 asked for one: the read of 2026-09-23 said the paperweight "is introduced well…
     * but the reveal does not really use it", and of seed 50862's fourteen essential clues, one
     * mentioned the weapon and none tied it to the culprit.
     *
     * A slot was added here and REMOVED after measuring it (`harness:agent5:direct`, three runs on
     * the frozen CML, A_101 §15). The case authors no such trace — `constraint_space.physical.traces`
     * is the compass wear, the ledger ink and footprints in the dunes — so asking this agent for one
     * does not surface evidence, it invents it. All three runs answered "fingerprints on the
     * paperweight", the genre's default, anchored on the ERA's capability line ("Fingerprinting
     * standard"), and each cited a `sourceInCML` that says something else entirely — ledger entries,
     * witness statements. Every one passed the guardrails.
     *
     * A clue the case cannot support is a fair-play defect wearing a citation, and a fingerprint on
     * the murder weapon also closes the case before the discriminating test can matter. The
     * requirement belongs to AGENT 3, which authors `constraint_space.physical.traces`; once the case
     * carries such a trace, the existing slots surface it without being asked twice.
     */
    // A_50 §9.3 fix #2 — UNIQUE-MEANS discriminator. When the concealment mechanism needs a special
    // skill/tool/access to execute, plant (early/mid, reader-visible) that ONLY the culprit had it —
    // so the reveal never has to invent "only X had the mechanical knowledge" (the probe's unfair-reveal).
    requirements.push({
      requirement: `Generate one essential early-or-mid clue establishing that ${culprit.name} UNIQUELY had the means/skill/access/knowledge required to execute the concealment mechanism, and that the other suspects did not — so the reveal relies only on this already-planted capability, never on a means introduced for the first time at the confrontation.`,
      supportsInferenceStep: undefined,
      evidenceType: "elimination",
      criticality: "essential",
      sourceInCML: "CASE.hidden_model.mechanism / CASE.culpability.culprits[0]",
      keyTerms: [culprit.name, ...extractKeyTerms(mechanismAnchor)].slice(0, 4),
      suggestedPlacement: "mid",
      category: inferCategory(mechanismAnchor),
    });
  });

  culpritCast.forEach((culprit: any) => {
    if (culprit.motive_seed || culprit.private_secret) {
      requirements.push({
        requirement: `Generate a clue showing observable evidence of ${culprit.name}'s premeditation or planning (${culprit.motive_seed ?? culprit.private_secret ?? 'motive'}). This MUST be visible to the reader before the confrontation scene — the detective cannot privately know this and withhold it.`,
        supportsInferenceStep: undefined,
        evidenceType: "observation",
        criticality: "essential",
        sourceInCML: `cast[${culprit.name}].motive_seed`,
        keyTerms: extractKeyTerms(culprit.motive_seed ?? culprit.private_secret ?? ''),
        suggestedPlacement: "mid",
        category: "behavioral"
      });
    }
  });

  // 3. Suspect elimination clues
  if (Array.isArray(caseData?.cast)) {
    const culprits = caseData.culpability?.culprits || [];
    const suspects = caseData.cast.filter((c: any) => 
      c.culprit_eligibility === "eligible" && !culprits.includes(c.name)
    );

    suspects.forEach((suspect: any) => {
      requirements.push({
        requirement: `Generate a clue that explicitly eliminates suspect ${suspect.name} using corroborated alibi or physical evidence. The pointsTo text must state the exclusion logic directly (for example: "Eliminates ${suspect.name} because ...").`,
        supportsInferenceStep: undefined,
        evidenceType: "elimination",
        criticality: "essential",
        sourceInCML: `cast[${suspect.name}]`,
        keyTerms: [suspect.name],
        suggestedPlacement: "mid",
        category: "testimonial" // Most eliminations are alibi/testimonial
      });
    });

    // 3b. First-pass elimination chain clue that narrows toward culprit
    const primaryNonCulprit = suspects[0];
    const primaryCulprit = culpritNames[0];
    if (primaryNonCulprit && primaryCulprit) {
      const suspectIndex = caseData.cast.findIndex((c: any) => c?.name === primaryNonCulprit.name);
      requirements.push({
        requirement: `Generate one essential early or mid elimination clue that explicitly rules out ${primaryNonCulprit.name} and narrows the solution toward culprit ${primaryCulprit}. The pointsTo text must start with "Eliminates ${primaryNonCulprit.name} because ..." and cite corroborated evidence.`,
        supportsInferenceStep: undefined,
        evidenceType: "elimination",
        criticality: "essential",
        sourceInCML: suspectIndex >= 0 ? `CASE.cast[${suspectIndex}].alibi_window` : "CASE.cast[0].alibi_window",
        keyTerms: [primaryNonCulprit.name, primaryCulprit],
        suggestedPlacement: "mid",
        category: "testimonial"
      });
    }
  }

  return requirements;
}

/**
 * Helper: Infer clue category from text content
 */
function inferCategory(text: string): "temporal" | "spatial" | "physical" | "behavioral" | "testimonial" {
  const lower = (text || '').toLowerCase();
  
  if (/time|clock|hour|minute|when|before|after|timeline|alibi/.test(lower)) return "temporal";
  if (/room|location|place|distance|access|locked|door|window/.test(lower)) return "spatial";
  if (/object|weapon|tool|trace|fingerprint|blood|fiber|footprint/.test(lower)) return "physical";
  if (/behavior|habit|pattern|nervous|reaction|gesture/.test(lower)) return "behavioral";
  
  return "testimonial"; // Default: witness statements, testimony
}

// A5-09: the density tables buildCluePrompt rebuilt on every call.
const DENSITY_DETAILS: Record<string, { label: string; count: string; range: string }> = {
  minimal: { label: "minimal", count: "5-8 essential clues", range: "0-2" },
  moderate: { label: "moderate", count: "8-12 clues", range: "2-4" },
  dense: { label: "dense", count: "12-18 clues", range: "4-6" },
};
const DENSITY_COUNT_TEXT: Record<string, string> = { minimal: "5-8", moderate: "8-12", dense: "12-18" };

function deriveEffectiveDensity(
  requestedDensity: "minimal" | "moderate" | "dense",
  requiredCount: number,
): { effectiveDensity: "minimal" | "moderate" | "dense"; overflow: boolean } {
  const maxByDensity: Record<"minimal" | "moderate" | "dense", number> = {
    minimal: 8,
    moderate: 12,
    dense: 18,
  };

  if (requiredCount <= maxByDensity[requestedDensity]) {
    return { effectiveDensity: requestedDensity, overflow: false };
  }

  if (requestedDensity === "minimal" && requiredCount <= maxByDensity.moderate) {
    return { effectiveDensity: "moderate", overflow: false };
  }
  if (requiredCount <= maxByDensity.dense) {
    return { effectiveDensity: "dense", overflow: false };
  }
  return { effectiveDensity: "dense", overflow: true };
}

// A_67 FIX-2 (BUG-2): the mandatory cause-of-death "key tell" requirement (1c) prescribes
// sourceInCML "CASE.death_method", so this list includes it — and since owner decision 4 (2026-09-30) the
// worker's validator accepts it too. CR-16: one enumerator and one table, in @cml/cml.
function buildValidSourcePaths(caseData: any): string[] {
  return enumerateSourcePaths(caseData);
}

/**
 * Build prompt for clue extraction and organization.
 *
 * A5-09: the sections live in agent5/clue-prompt-sections.ts and the retry payload normaliser in
 * agent5/retry-feedback.ts; this function derives the case facts once and assembles them in order.
 */
export function buildCluePrompt(inputs: ClueExtractionInputs): PromptComponents {
  const { cml, clueDensity, redHerringBudget } = inputs;
  const caseData = cml.CASE as any;
  const stepCount = Array.isArray(caseData?.inference_path?.steps)
    ? caseData.inference_path.steps.length
    : 0;

  // ELEGANT SOLUTION: Pre-analyze CML to generate explicit requirements
  const requiredClues = generateExplicitClueRequirements(cml);
  const { effectiveDensity, overflow: densityOverflow } = deriveEffectiveDensity(clueDensity, requiredClues.length);

  // --- Case facts the developer prompt reads ---
  const primaryAxis = caseData?.false_assumption?.type
    ? `${caseData.false_assumption.type} axis`
    : "unknown axis";
  const castCount = Array.isArray(caseData?.cast) ? caseData.cast.length : 0;
  const title = caseData?.meta?.title || "Untitled";
  const category = caseData?.meta?.crime_class?.category || "crime";
  const falseAssumptionStatement = caseData?.false_assumption?.statement || "N/A";
  const correctionLexicon = Array.isArray(caseData?.inference_path?.steps)
    ? [...new Set(caseData.inference_path.steps.flatMap((s: any) => extractKeyTerms(String(s?.correction ?? ""))))]
    : [];
  const falseAssumptionLexicon = [...new Set(extractKeyTerms(String(falseAssumptionStatement)))];

  // Constraint space
  const constraintSpace = caseData?.constraint_space ?? {};
  const timeAnchors: string[] = constraintSpace.time?.anchors ?? [];
  const timeContradictions: string[] = constraintSpace.time?.contradictions ?? [];
  const accessActors: string[] = constraintSpace.access?.actors ?? [];
  const accessObjects: string[] = constraintSpace.access?.objects ?? [];
  const physicalTraces: string[] = constraintSpace.physical?.traces ?? [];

  // Evidence-sensitive characters
  const evidenceSensitiveChars = Array.isArray(caseData?.cast)
    ? caseData.cast.filter((c: any) => Array.isArray(c.evidence_sensitivity) && c.evidence_sensitivity.length > 0)
    : [];

  const densityInfo = DENSITY_DETAILS[effectiveDensity];

  const castIndexMap: Array<{ name: string; index: number }> = Array.isArray(caseData?.cast)
    ? caseData.cast.map((c: any, index: number) => ({ name: String(c?.name ?? "").trim(), index })).filter((x: any) => x.name)
    : [];
  const validSourcePaths = buildValidSourcePaths(caseData);

  const bounds = {
    stepPathMin: 0,
    stepPathMax: Math.max(stepCount - 1, 0),
    supportsStepMin: 1,
    supportsStepMax: Math.max(stepCount, 1),
    anchorMin: 0,
    anchorMax: Math.max(timeAnchors.length - 1, 0),
    contradictionMin: 0,
    contradictionMax: Math.max(timeContradictions.length - 1, 0),
    castMin: 0,
    castMax: Math.max(castIndexMap.length - 1, 0),
  };

  // --- Developer prompt, in section order ---
  const developer = [
    buildCmlSummarySection({
      title,
      category,
      primaryAxis,
      castCount,
      clueDensity,
      effectiveDensity,
      requiredCount: requiredClues.length,
    }),
    buildMandatoryRequirementsList(requiredClues),
    buildFirstPassSlotsSection(),
    buildConstraintSpaceSections({ timeAnchors, timeContradictions, accessActors, accessObjects, physicalTraces }),
    buildEvidenceSensitiveSection(evidenceSensitiveChars),
    HARD_PRECEDENCE_AND_GENERATION_ORDER,
    buildDeterministicBoundsSection(bounds),
    buildCastIndexMapSection(castIndexMap),
    buildClueDensitySection(densityInfo, densityOverflow, requiredClues.length),
    buildRedHerringSection(redHerringBudget, falseAssumptionStatement, correctionLexicon, falseAssumptionLexicon),
    buildLockedFactsSection(inputs.lockedFacts),
    CLUE_PLACEMENT_STRATEGY,
    buildQualityControlsSection(caseData?.quality_controls ?? {}),
    buildFairPlayAuditSection(inputs.fairPlayFeedback),
    QUALITY_BAR,
    buildHardConstraintsLearnedSection(stepCount),
    FAILURE_MODE_HARDENING,
    buildSourcePathLegalitySection(),
    buildValidSourcePathsSection(validSourcePaths),
    buildDeterministicOutputContractsSection(stepCount),
    MICRO_EXEMPLARS,
    SILENT_PRE_OUTPUT_CHECKLIST,
    OUTPUT_JSON_SCHEMA,
  ].join("");

  // --- User prompt ---
  const rhUserText = redHerringBudget > 0 ? ` and ${redHerringBudget} red herrings` : "";
  const userClueCountDirective = densityOverflow
    ? `at least ${requiredClues.length}`
    : DENSITY_COUNT_TEXT[effectiveDensity];
  const isFirstAttemptPrompt = !inputs.fairPlayFeedback;

  let user = buildUserRulesSection({
    userClueCountDirective,
    rhUserText,
    firstAttemptContracts: buildFirstAttemptContracts(isFirstAttemptPrompt, redHerringBudget),
    strictContractBlock: buildStrictContractBlock(inputs.strictContract),
    stepCount,
  });

  const retryFeedback = normalizeRetryFeedback(inputs.fairPlayFeedback, caseData, castIndexMap);
  if (retryFeedback) {
    user += buildRetryModeBlock(retryFeedback);
  }

  return {
    system: CLUE_SYSTEM_PROMPT,
    developer,
    user,
  };
}

/**
 * Extract and organize clues from validated CML
 */
/**
 * Parse the Agent-5 JSON payload, flagging completion-limit truncation. jsonrepair silently CLOSES a
 * truncated structure, fabricating partial objects from the cut-off tail — run a3c2973f's response
 * ended `{"id": "clue_` and the repaired parse yielded a phantom clue that survived every downstream
 * repair pass and hard-stopped the release gate (NSD visibility) 15 minutes later. A merely-sloppy
 * response (trailing comma, unquoted key) still ends with its closing brace; a truncated one does not.
 */
export const parseClueJsonContent = (
  content: string,
): { clueData: any; repaired: boolean; truncated: boolean } => {
  // CR-20: the one parse ladder, unguarded — this boundary FLAGS a truncated repair and retries.
  const parsed = parseLlmJson<any>(content, { guard: false });
  if (parsed.data === undefined) throw parsed.repairError;
  const clueData = parsed.data;
  const repaired = parsed.repaired;
  const truncated = repaired && !content.trim().endsWith("}");
  return { clueData, repaired, truncated };
};

/** Canonical parsed-clue id shape (mirrors the worker's canonicalizeClueId): a bare "clue_" fails. */
export const CANONICAL_PARSED_CLUE_ID_RE = CANONICAL_CLUE_ID_RE; // ORC-13: one body (@cml/cml)

/**
 * Drop structurally incomplete clue entries at the parse boundary — the only layer that knows they
 * were never real model output. An entry without a canonical id or without a description cannot be
 * planted, cleared, or anchored; letting it through poisons the clue timeline, the Agent-7 outline,
 * and the NSD visibility ledger (the run-a3c2973f abort class).
 */
export const dropMalformedParsedClues = (
  rawClues: unknown,
): { kept: any[]; droppedWarnings: string[] } => {
  const kept: any[] = [];
  const droppedWarnings: string[] = [];
  for (const clue of Array.isArray(rawClues) ? rawClues : []) {
    const id = String((clue as { id?: unknown } | null | undefined)?.id ?? "").trim();
    const description = String((clue as { description?: unknown } | null | undefined)?.description ?? "").trim();
    if (!CANONICAL_PARSED_CLUE_ID_RE.test(id)) {
      droppedWarnings.push(
        `dropped parsed clue with non-canonical id "${id || "(empty)"}" (likely truncation/jsonrepair artifact)`,
      );
      continue;
    }
    if (!description) {
      droppedWarnings.push(
        `dropped parsed clue "${id}" with empty description (likely truncation/jsonrepair artifact)`,
      );
      continue;
    }
    kept.push(clue);
  }
  return { kept, droppedWarnings };
};

export async function extractClues(
  client: AzureOpenAIClient,
  inputs: ClueExtractionInputs
): Promise<ClueDistributionResult> {
  const config = getGenerationParams().agent5_clues.params;
  const startTime = Date.now();
  const logger = client.getLogger();
  const runId = inputs.runId || `clues-${Date.now()}`;
  const projectId = inputs.projectId || "unknown";
  const attempt = getClueAttemptNumber({ ...inputs, runId, projectId });

  await logger.logRequest({
    runId,
    projectId,
    agent: "Agent5-ClueExtraction",
    operation: "extract_clues",
    metadata: {
      retryAttempt: attempt,
      clueDensity: inputs.clueDensity,
      redHerringBudget: inputs.redHerringBudget,
      feedbackViolationCount: inputs.fairPlayFeedback?.violations?.length ?? 0,
      feedbackWarningCount: inputs.fairPlayFeedback?.warnings?.length ?? 0,
    },
  });

  // Build prompt
  const prompt = buildCluePrompt(inputs);

  try {
    // Call LLM with JSON mode
    await logger.logRequest({
      runId,
      projectId,
      agent: "Agent5-ClueExtraction",
      operation: "chat_request",
      metadata: {
        retryAttempt: attempt,
      },
    });

    const callClueModel = (retryAttempt: number) =>
      client.chat({
        model: resolveDesignModel(),
        messages: [
          { role: "system", content: prompt.system },
          { role: "developer", content: prompt.developer },
          { role: "user", content: prompt.user },
        ],
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
        jsonMode: true,   // Structured output
        logContext: {
          runId,
          projectId,
          agent: "Agent5-ClueExtraction",
          retryAttempt,
        },
      });

    let response = await callClueModel(attempt);

    await logger.logResponse({
      runId,
      projectId,
      agent: "Agent5-ClueExtraction",
      operation: "chat_response",
      model: response.model,
      success: true,
      latencyMs: response.latencyMs,
    });

    // Parse JSON response. A truncated payload (completion limit hit mid-clue) gets ONE fresh
    // retry — jsonrepair would otherwise fabricate phantom entries from the cut-off tail
    // (run a3c2973f). If the retry is also truncated, keep whichever parse yielded more clues;
    // dropMalformedParsedClues below removes the fabricated remnants either way.
    const parseWarnings: string[] = [];
    let parsed = parseClueJsonContent(response.content);
    if (parsed.truncated) {
      parseWarnings.push(
        `truncated clue JSON detected (response does not close its root object; max_tokens=${config.model.max_tokens}) — retried once`,
      );
      const retryResponse = await callClueModel(attempt + 1);
      const retryParsed = parseClueJsonContent(retryResponse.content);
      const retryClueCount = Array.isArray(retryParsed.clueData?.clues) ? retryParsed.clueData.clues.length : 0;
      const firstClueCount = Array.isArray(parsed.clueData?.clues) ? parsed.clueData.clues.length : 0;
      if (!retryParsed.truncated || retryClueCount > firstClueCount) {
        response = retryResponse;
        parsed = retryParsed;
        parseWarnings.push(
          retryParsed.truncated
            ? `retry was also truncated; kept the retry (more clues: ${retryClueCount} > ${firstClueCount})`
            : "retry returned a complete payload",
        );
      } else {
        parseWarnings.push(
          `retry was also truncated with no more clues (${retryClueCount} <= ${firstClueCount}); kept the first response`,
        );
      }
    }
    const clueData: any = parsed.clueData;

    const {
      clues: normalizedClues,
      redHerrings: normalizedRedHerrings,
      droppedWarnings,
      clueTimeline,
      fairPlayChecks,
      essentialClueCount,
    } = normalizeParsedClueDistribution(clueData, inputs.redHerringBudget);
    parseWarnings.push(...droppedWarnings);

    const latencyMs = Date.now() - startTime;
    const costTracker = client.getCostTracker();
    const cost = costTracker.getSummary().byAgent["Agent5-ClueExtraction"] || 0;

    const modelName = response.model || "unknown";

    await logger.logResponse({
      runId,
      projectId,
      agent: "Agent5-ClueExtraction",
      operation: "extract_clues",
      model: modelName,
      success: true,
      latencyMs,
      metadata: {
        clueCount: normalizedClues.length,
        redHerringCount: normalizedRedHerrings.length,
        essentialClueCount,
        fairPlayPassed: Object.values(fairPlayChecks).every(Boolean),
      },
    });

    return {
      clues: normalizedClues,
      redHerrings: normalizedRedHerrings,
      status: clueData.status === "pass" || clueData.status === "fail" ? clueData.status : undefined,
      audit: clueData.audit && typeof clueData.audit === "object" ? clueData.audit : undefined,
      parseWarnings: parseWarnings.length > 0 ? parseWarnings : undefined,
      clueTimeline,
      fairPlayChecks,
      latencyMs,
      cost,
    };
  } catch (error) {
    await logger.logError({
      runId,
      projectId,
      agent: "Agent5-ClueExtraction",
      operation: "extract_clues",
      errorMessage: (error as Error).message,
      stackTrace: (error as Error).stack,
    });

    throw error;
  }
}

/** What `normalizeParsedClueDistribution` derives from one parsed Agent-5 payload. */
export interface NormalizedParsedClueDistribution {
  clues: Clue[];
  redHerrings: RedHerring[];
  /** One entry per clue `dropMalformedParsedClues` removed. */
  droppedWarnings: string[];
  clueTimeline: ClueDistributionResult["clueTimeline"];
  fairPlayChecks: ClueDistributionResult["fairPlayChecks"];
  essentialClueCount: number;
}

/**
 * A5-04 — the parse-boundary normaliser `extractClues` applies to the parsed JSON, as one pure,
 * exported function (moved verbatim out of `extractClues`; same order, same mutations of the parsed
 * clue objects). `status` and `audit` stay with the caller, which reads them after logging.
 */
export function normalizeParsedClueDistribution(
  clueData: any,
  redHerringBudget: number,
): NormalizedParsedClueDistribution {
  const { kept: normalizedClues, droppedWarnings } = dropMalformedParsedClues(clueData?.clues);
  const normalizedRedHerrings = Array.isArray(clueData?.redHerrings) ? clueData.redHerrings : [];

  // WP3D: Deterministically normalize supportsInferenceStep and evidenceType.
  // Prefer inferred values from source paths over null/default model outputs.
  for (const clue of normalizedClues) {
    // A5-D10: the enum fields are compared exactly downstream (clueTimeline below, the worker's
    // placement and criticality checks), so a capitalised "Early" was silently left out of the timeline.
    for (const key of ["category", "placement", "criticality"] as const) {
      if (typeof clue[key] === "string") clue[key] = clue[key].trim().toLowerCase();
    }
    // P1.2: normalize the additive restructure fields (inert when the model omits them).
    if (typeof clue.observable === "string") clue.observable = clue.observable.trim();
    if (typeof clue.inference === "string") clue.inference = clue.inference.trim();
    const revealChapter = Number(clue.first_full_reveal_chapter);
    clue.first_full_reveal_chapter =
      Number.isInteger(revealChapter) && revealChapter > 0 ? revealChapter : undefined;

    const inferredStep = inferStepFromSourcePath(clue?.sourceInCML);
    const currentStep = Number(clue?.supportsInferenceStep);
    if (Number.isInteger(currentStep) && currentStep > 0) {
      clue.supportsInferenceStep = currentStep;
    } else if (typeof inferredStep === "number") {
      clue.supportsInferenceStep = inferredStep;
    } else if (clue.criticality === "essential") {
      clue.supportsInferenceStep = 0; // Flag as unmapped for guardrail to catch
    }
    clue.evidenceType = inferEvidenceType(clue);
  }

  // Organize clues by placement
  const clueTimeline = {
    early: normalizedClues
      .filter((c: Clue) => c.placement === "early")
      .map((c: Clue) => c.id),
    mid: normalizedClues
      .filter((c: Clue) => c.placement === "mid")
      .map((c: Clue) => c.id),
    late: normalizedClues
      .filter((c: Clue) => c.placement === "late")
      .map((c: Clue) => c.id),
  };

  // Fair play checks
  const essentialClues = normalizedClues.filter((c: Clue) => c.criticality === "essential");
  const fairPlayChecks = {
    allEssentialCluesPresent: essentialClues.length >= 3, // Minimum viable
    noNewFactsIntroduced: normalizedClues.every(
      (c: Clue) => c.sourceInCML && c.sourceInCML.trim() !== "" && c.sourceInCML !== "N/A"
    ),
    redHerringsDontBreakLogic: normalizedRedHerrings.length <= redHerringBudget,
    // A_71: a budget of N asked for N. Reporting only `<= N` made "returned none" indistinguishable
    // from "returned exactly what was asked for".
    redHerringBudgetMet: normalizedRedHerrings.length >= redHerringBudget,
  };

  return {
    clues: normalizedClues,
    redHerrings: normalizedRedHerrings,
    droppedWarnings,
    clueTimeline,
    fairPlayChecks,
    essentialClueCount: essentialClues.length,
  };
}
