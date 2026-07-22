/**
 * Agent 5: Clue Distribution & Red Herring Agent
 * 
 * Analyzes validated CML and extracts/organizes clues for fair play.
 * Does NOT add new facts - only derives clues from existing CML structure.
 * 
 * Uses logger from llm-client (like Agents 3 & 4).
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import { resolveDesignModel } from "./utils/model-tiers.js";
import type { PromptComponents } from "./types.js";

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
    requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] };
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
    requiredDirectCulpritClue?: { id: string; culpritName: string; allowedSourcePaths: string[]; requiredPhrases: string[] };
  };
}

/**
 * A_61 RC3.5 — map a physical death method to fair-play tells a witness could observe at the
 * body-discovery scene, plus the tokens Agent 7 uses to locate the generated tell clue. Generic across
 * the canonical methods; defaults to a neutral "manner of death" tell for anything unrecognised.
 */
export function deathMethodTellHints(deathMethod: string): { examples: string; tokens: string[] } {
  const m = String(deathMethod ?? "").toLowerCase();
  if (/poison|toxin|venom|arsenic|cyanide|strychnine/.test(m))
    return { examples: "for poison: numbness, a bitter almond residue, constriction, or sudden collapse with no wound", tokens: ["numbness", "bitter", "residue", "collapse", "convulsion", "no wound", "froth"] };
  if (/stab|knife|blade|dagger|puncture/.test(m))
    return { examples: "for stabbing: a puncture wound, blood pooling, a torn garment, or a missing blade", tokens: ["wound", "blood", "blade", "puncture", "torn"] };
  if (/blunt|struck|bludgeon|blow|struck down|beaten/.test(m))
    return { examples: "for blunt-force: a head wound, a bloodied heavy object, or bruising", tokens: ["wound", "blood", "bruis", "struck", "blunt"] };
  if (/strangl|garrot|throttle|asphyxiat|suffocat/.test(m))
    return { examples: "for strangulation: ligature marks, petechiae in the eyes, or a disturbed collar", tokens: ["ligature", "marks", "throat", "collar", "petechiae", "bruis"] };
  if (/shot|gun|firearm|bullet|pistol|revolver/.test(m))
    return { examples: "for shooting: a bullet wound, powder burns, a spent cartridge, or the report heard", tokens: ["wound", "bullet", "powder", "cartridge", "gunshot"] };
  if (/drown/.test(m))
    return { examples: "for drowning: water in the lungs, sodden clothing, or weed on the body", tokens: ["water", "sodden", "drown", "lungs"] };
  return { examples: "a concrete physical sign of how the victim died, visible at the scene", tokens: ["wound", "mark", "residue", "collapse"] };
}

/**
 * A_65b Ph6 — render the strict structural contract for the FIRST-PASS prompt. These exact shapes
 * previously reached the LLM only on retry (and retries are off by default), so deterministic
 * synthesis authored them from templates on every run. Stated up front, the LLM authors them in
 * scene register and the synthesis becomes the rare, counted floor.
 */
function buildStrictContractBlock(sc: ClueExtractionInputs["strictContract"]): string {
  if (!sc) return "";
  const lines: string[] = [];
  lines.push("- STRICT STRUCTURAL CONTRACT (author ALL of these YOURSELF, as concrete scene-register clues — a character sees/hears/finds something. NEVER meta-boilerplate like \"adds texture to the case background\"; if you omit any, a deterministic pass will synthesize flat machine text in its place, which reads as machine-made):");
  for (const m of (sc.requiredIdToSourceMappings ?? []).slice(0, 24)) {
    lines.push(`    • REQUIRED ID: "${m.id}" with sourceInCML=${m.sourceInCML}`);
  }
  const dc = sc.requiredDirectCulpritClue;
  if (dc?.id) {
    lines.push(`    • DIRECT CULPRIT CLUE: id="${dc.id}" — observable evidence tying ${dc.culpritName} uniquely to the crime` +
      (dc.allowedSourcePaths?.length ? ` (source from: ${dc.allowedSourcePaths.slice(0, 6).join(", ")})` : "") +
      (dc.requiredPhrases?.length ? `; the pointsTo must include: ${dc.requiredPhrases.slice(0, 6).join(", ")}` : ""));
  }
  const ls = sc.requiredLateClueSlot;
  if (ls?.id) {
    lines.push(`    • LATE SLOT: id="${ls.id}" placement=late criticality=${ls.criticality} — a real, observable late-story detail (a found object, an overheard line), never filler.`);
  }
  for (const f of (sc.requiredStepCoverageFloors ?? []).slice(0, 16)) {
    if (f.requireContradiction) lines.push(`    • STEP ${f.step}: must have a CONTRADICTION-evidence clue (observable, scene-register).`);
  }
  if (sc.strictSourcePaths?.length) {
    lines.push(`    • ALLOWED SOURCE PATHS (bracket-index leaf paths): ${sc.strictSourcePaths.slice(0, 20).join(", ")}`);
  }
  return lines.length > 1 ? lines.join("\n") : "";
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

const inferEvidenceType = (clue: any): "observation" | "contradiction" | "elimination" => {
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

export interface Clue {
  id: string;                       // Unique clue identifier
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  description: string;              // Analytic spec sentence (planning surface — kept OUT of prose)
  observable?: string;              // P1.2: the on-page anomaly a character can SEE/HEAR/FIND (preferred for prose)
  inference?: string;               // P1.2: the reasoning the observable supports (embargoed pre-reveal)
  sourceInCML: string;              // Where it comes from in CML (for traceability)
  pointsTo: string;                 // What it reveals (without spoiling)
  first_full_reveal_chapter?: number; // P1.2: earliest chapter the full implication may be stated
  placement: "early" | "mid" | "late"; // When it should appear
  criticality: "essential" | "supporting" | "optional";
  supportsInferenceStep?: number;   // 1-indexed inference_path step this clue enables
  evidenceType?: "observation" | "contradiction" | "elimination"; // Role the clue plays in the step
}

/**
 * P1.2 — the on-page surface a character can SEE/HEAR/FIND. Prefer the dedicated `observable`
 * field and fall back to the analytic `description`, so existing distributions stay valid (this
 * lever is inert until the synthesizer/LLM starts emitting `observable`).
 */
export function deriveClueObservable(clue: Pick<Clue, "observable" | "description">): string {
  const observable = String(clue.observable ?? "").trim();
  if (observable.length > 0) return observable;
  return String(clue.description ?? "").trim();
}

/** P1.2 — canonical planning description; falls back to `observable` only if description is blank. */
export function deriveClueDescription(clue: Pick<Clue, "description" | "observable">): string {
  const description = String(clue.description ?? "").trim();
  if (description.length > 0) return description;
  return String(clue.observable ?? "").trim();
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

export interface RedHerring {
  id: string;
  description: string;
  supportsAssumption: string;       // Which false assumption it reinforces
  misdirection: string;             // How it misleads
}

export interface ClueExtractionAudit {
  missingDiscriminatingEvidenceIds?: string[];
  weakEliminationSuspects?: string[];
  invalidSourcePaths?: string[];
}

export interface ClueDistributionResult {
  clues: Clue[];
  redHerrings: RedHerring[];
  status?: "pass" | "fail";
  audit?: ClueExtractionAudit;
  /** Parse-boundary anomalies (truncated response, dropped jsonrepair artifacts) for ctx.warnings. */
  parseWarnings?: string[];
  clueTimeline: {
    early: string[];                // Clue IDs for Act I
    mid: string[];                  // Clue IDs for Act II
    late: string[];                 // Clue IDs for Act III
  };
  fairPlayChecks: {
    allEssentialCluesPresent: boolean;
    noNewFactsIntroduced: boolean;
    redHerringsDontBreakLogic: boolean;
  };
  latencyMs: number;
  cost: number;
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
 * Helper: Extract key terms from a text snippet (for mustMention)
 */
function extractKeyTerms(text: string): string[] {
  if (!text) return [];
  
  // Extract meaningful words (>4 chars, not common words)
  const commonWords = new Set(['that', 'this', 'with', 'from', 'were', 'have', 'been', 'they', 'what', 'when', 'where', 'which', 'would', 'could', 'should']);
  const words = text.toLowerCase()
    .split(/\s+/)
    .filter((w: string) => w.length > 4 && !commonWords.has(w))
    .slice(0, 3); // Top 3 key terms
    
  return words;
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

function buildValidSourcePaths(caseData: any): string[] {
  const paths: string[] = [];

  const steps = Array.isArray(caseData?.inference_path?.steps) ? caseData.inference_path.steps : [];
  for (let i = 0; i < steps.length; i++) {
    paths.push(`CASE.inference_path.steps[${i}].observation`);
    paths.push(`CASE.inference_path.steps[${i}].correction`);
    const reqEvidence = Array.isArray(steps[i]?.required_evidence) ? steps[i].required_evidence : [];
    for (let j = 0; j < reqEvidence.length; j++) {
      paths.push(`CASE.inference_path.steps[${i}].required_evidence[${j}]`);
    }
  }

  const pushIndexed = (base: string, arr: unknown[] | undefined): void => {
    if (!Array.isArray(arr)) return;
    for (let i = 0; i < arr.length; i++) paths.push(`${base}[${i}]`);
  };

  pushIndexed("CASE.constraint_space.time.anchors", caseData?.constraint_space?.time?.anchors);
  pushIndexed("CASE.constraint_space.time.contradictions", caseData?.constraint_space?.time?.contradictions);
  pushIndexed("CASE.constraint_space.access.actors", caseData?.constraint_space?.access?.actors);
  pushIndexed("CASE.constraint_space.access.objects", caseData?.constraint_space?.access?.objects);
  pushIndexed("CASE.constraint_space.access.permissions", caseData?.constraint_space?.access?.permissions);
  pushIndexed("CASE.constraint_space.physical.laws", caseData?.constraint_space?.physical?.laws);
  pushIndexed("CASE.constraint_space.physical.traces", caseData?.constraint_space?.physical?.traces);

  const cast = Array.isArray(caseData?.cast) ? caseData.cast : [];
  for (let i = 0; i < cast.length; i++) {
    paths.push(`CASE.cast[${i}].alibi_window`);
    paths.push(`CASE.cast[${i}].access_plausibility`);
    const sensitivity = Array.isArray(cast[i]?.evidence_sensitivity) ? cast[i].evidence_sensitivity : [];
    for (let j = 0; j < sensitivity.length; j++) {
      paths.push(`CASE.cast[${i}].evidence_sensitivity[${j}]`);
    }
  }

  const testEvidence = Array.isArray(caseData?.discriminating_test?.evidence_clues)
    ? caseData.discriminating_test.evidence_clues
    : [];
  for (let i = 0; i < testEvidence.length; i++) {
    paths.push(`CASE.discriminating_test.evidence_clues[${i}]`);
  }

  const clueSceneMap = Array.isArray(caseData?.prose_requirements?.clue_to_scene_mapping)
    ? caseData.prose_requirements.clue_to_scene_mapping
    : [];
  for (let i = 0; i < clueSceneMap.length; i++) {
    paths.push(`CASE.prose_requirements.clue_to_scene_mapping[${i}].clue_id`);
  }

  return paths;
}

/**
 * Build prompt for clue extraction and organization
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
  const firstPassRequiredSlots = [
    {
      id: "clue_mechanism_visibility_core",
      placement: "early|mid",
      criticality: "essential",
      evidenceType: "observation",
      contract: "Reader-visible mechanism detail appears before the discriminating test.",
    },
    {
      id: "clue_core_contradiction_chain",
      placement: "early|mid",
      criticality: "essential",
      evidenceType: "contradiction",
      contract: "Explicitly overturns the false assumption using concrete reader-observable evidence.",
    },
    {
      id: "clue_core_elimination_chain",
      placement: "early|mid",
      criticality: "essential",
      evidenceType: "elimination",
      contract: "Explicitly eliminates a non-culprit with corroborated logic and narrows toward the culprit.",
    },
  ];

  // --- System prompt ---
  const system = `You are a clue extraction specialist for Golden Age mystery fiction.
Extract clues ONLY from existing CML facts.
Do not invent facts.
Keep clues reader-observable and fair play ordered.
Return valid JSON only.

Clue categories:
- Temporal
- Spatial
- Physical
- Behavioral
- Testimonial`;

  // --- Developer prompt ---
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

  // Density details
  const densityDetails: Record<string, { label: string; count: string; range: string }> = {
    minimal: { label: "minimal", count: "5-8 essential clues", range: "0-2" },
    moderate: { label: "moderate", count: "8-12 clues", range: "2-4" },
    dense: { label: "dense", count: "12-18 clues", range: "4-6" },
  };
  const densityInfo = densityDetails[effectiveDensity];

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

  let developer = `## CML Summary
**Title**: ${title}
**Crime**: ${category}
**Primary axis**: ${primaryAxis}
**Cast**: ${castCount} characters
**Requested density**: ${clueDensity}
**Effective density**: ${effectiveDensity}${effectiveDensity !== clueDensity ? " (auto-escalated to satisfy mandatory requirements)" : ""}

## Mandatory Clue Requirements (${requiredClues.length} required)
`;

  requiredClues.forEach((req, idx) => {
    developer += `${idx + 1}. ${req.requirement}\n`;
    developer += `   → ${req.evidenceType} | ${req.criticality} | ${req.suggestedPlacement} | ${req.category}`;
    if (req.supportsInferenceStep) developer += ` | step ${req.supportsInferenceStep}`;
    if (req.keyTerms.length > 0) developer += ` | terms: ${req.keyTerms.join(', ')}`;
    developer += `\n\n`;
  });

  developer += `## First-pass Required Output Slots (non-negotiable IDs)
${firstPassRequiredSlots
  .map(
    (slot, idx) =>
      `${idx + 1}. id=${slot.id} | placement=${slot.placement} | criticality=${slot.criticality} | evidenceType=${slot.evidenceType}\n` +
      `   contract: ${slot.contract}`,
  )
  .join("\n")}

`;

  developer += `## Temporal Constraints
${[...timeAnchors, ...timeContradictions].map(a => `- ${a}`).join('\n') || 'None'}

## Access Constraints
Actors: ${accessActors.join(', ') || 'None'}
Objects: ${accessObjects.join(', ') || 'None'}

## Physical Evidence
${physicalTraces.map(t => `- ${t}`).join('\n') || 'None'}

`;

  if (evidenceSensitiveChars.length > 0) {
    developer += `## Evidence-Sensitive Characters\n`;
    for (const char of evidenceSensitiveChars) {
      developer += `- ${(char as any).name}: sensitive items: ${((char as any).evidence_sensitivity as string[]).join(', ')}\n`;
    }
    developer += `\n`;
  }

  developer += `## Hard Precedence (resolve in order)
1. sourceInCML legality
2. index bounds and cast name-index correctness
3. discriminating-test clue ID coverage
4. suspect elimination quality
5. red-herring separation
6. optional texture

## Generation Order (Critical)
1. Build clues[].id and clues[].sourceInCML first.
2. Validate source paths against valid_source_paths[] when available; otherwise allowed roots + bounds.
3. Populate clue description/pointsTo text.
4. Build elimination details.
5. Generate red herrings last.
6. Set status based on unresolved hard-rule defects.

## Deterministic Bounds (use exactly)
- inference_path steps path index range: ${bounds.stepPathMin}..${bounds.stepPathMax}
- supportsInferenceStep valid range: ${bounds.supportsStepMin}..${bounds.supportsStepMax}
- constraint_space.time.anchors index range: ${bounds.anchorMin}..${bounds.anchorMax}
- constraint_space.time.contradictions index range: ${bounds.contradictionMin}..${bounds.contradictionMax}
- cast index range: ${bounds.castMin}..${bounds.castMax}

## Cast Name -> Index Map (for CASE.cast[N] paths)
${castIndexMap.length > 0 ? castIndexMap.map((c) => `- ${c.name} -> ${c.index}`).join("\n") : "- None"}

## Clue Density: ${densityInfo.label}
Generate ${densityOverflow ? `at least ${requiredClues.length} clues (mandatory requirements exceed dense target range)` : `${densityInfo.count} total`}.
Additional optional clues (${densityInfo.range} extra) for texture.

## Red Herring Budget: ${redHerringBudget}
`;
  if (redHerringBudget > 0) {
    developer += `Create ${redHerringBudget} red herrings that support the false assumption: "${falseAssumptionStatement}"\n\n`;
    developer += `## Red Herring Lexical Guardrails (proactive first-attempt)
- correction_terms_forbidden_in_red_herrings:
${correctionLexicon.length > 0 ? correctionLexicon.map((t) => `  - ${t}`).join("\n") : "  - none"}
- preferred_false_assumption_terms:
${falseAssumptionLexicon.length > 0 ? falseAssumptionLexicon.map((t) => `  - ${t}`).join("\n") : "  - none"}
- red_herring_contract:
  - Use preferred_false_assumption_terms where possible.
  - Avoid correction_terms_forbidden_in_red_herrings in redHerrings[].description and redHerrings[].misdirection.
  - Include one sentence in each misdirection explicitly justifying non-overlap with true-solution mechanism language.\n\n`;
  } else {
    developer += `No red herrings requested.\n\n`;
  }

  // Pillar 1: inject canonical locked facts so clue descriptions honour them verbatim
  if (Array.isArray(inputs.lockedFacts) && inputs.lockedFacts.length > 0) {
    developer += `## CANONICAL LOCKED FACTS — Honour Verbatim\nThe following values are ground truth established by the hard-logic device generator.\nAny clue description that references these concepts MUST use these exact values (in word form, not digits).\nDo not write a different time, distance, quantity, or measurement in any clue description.\n\n`;
    for (const fact of inputs.lockedFacts) {
      developer += `- **${fact.id}**: "${fact.value}" — ${fact.description}\n`;
    }
    developer += `\n`;
  }

  developer += `## Clue Placement Strategy
- Early (Act I): essential clues, set up the puzzle, introduce key observations
- Mid (Act II): supporting clues, deepen investigation, complicate the picture
- Late (Act III): optional clues, final revelations, confirm the solution

Criticality levels:
- essential: reader must see this to follow the detective's logic
- supporting: reinforces key deductions without being critical
- optional: adds texture and atmosphere

`;

  const qualityControls = caseData?.quality_controls ?? {};
  const clueTargets = qualityControls?.clue_visibility_requirements ?? {};
  if (Object.keys(qualityControls).length > 0) {
    developer += `## Quality Controls (from CML)
- Essential clues minimum: ${clueTargets.essential_clues_min ?? "N/A"}
- Essential clues before test: ${String(clueTargets.essential_clues_before_test ?? "N/A")}
- Early clues minimum: ${clueTargets.early_clues_min ?? "N/A"}
- Mid clues minimum: ${clueTargets.mid_clues_min ?? "N/A"}
- Late clues minimum: ${clueTargets.late_clues_min ?? "N/A"}

If targets conflict with clue density, prioritize fair play (essential clues and early placement).
If mandatory requirements exceed requested density, satisfy mandatory requirements first and keep optional clues minimal.

`;
  }

  const feedbackViolations = Array.isArray(inputs.fairPlayFeedback?.violations)
    ? inputs.fairPlayFeedback.violations
    : [];
  const feedbackWarnings = Array.isArray(inputs.fairPlayFeedback?.warnings)
    ? inputs.fairPlayFeedback.warnings
    : [];
  const feedbackRecommendations = Array.isArray(inputs.fairPlayFeedback?.recommendations)
    ? inputs.fairPlayFeedback.recommendations
    : [];

  if (feedbackViolations.length > 0 || feedbackWarnings.length > 0) {
    const overallStatus = inputs.fairPlayFeedback?.overallStatus;
    developer += `## Fair Play Audit Feedback
Status: **${overallStatus ?? "needs-review"}**

Violations: ${feedbackViolations.length > 0 ? feedbackViolations.map((v, i) => `${i + 1}. [${v.severity}] ${v.rule}: ${v.description}`).join('; ') : 'None'}
Warnings: ${feedbackWarnings.join('; ') || 'None'}
Recommendations: ${feedbackRecommendations.join('; ') || 'None'}

Regeneration: Adjust placement so essential clues appear before the discriminating test.

`;
  }

  developer += `## Quality Bar
- Essential clues must form a solvable chain, not disconnected facts.
- Clue wording should be concrete enough for scene-level prose rendering.
- Placement should enforce fair-play timing rather than clustering clues at reveal.

## Hard Constraints Learned from Failures
- Discriminating-test clue ID coverage is mandatory: every ID in CASE.discriminating_test.evidence_clues must appear as a clue id.
- Required discriminating-test clue IDs must be criticality: essential and placement: early|mid.
- Elimination clues must include a concrete alibi window, corroborator/evidence source, and explicit exclusion logic in pointsTo.
- sourceInCML must use legal CML paths only; do not invent path families.
- Red herrings must support the false assumption and include non-overlap justification vs true culprit mechanism facts.
- Narrative-facing time wording must be era-appropriate and written in words (for example, "quarter past nine", not "9:15 PM").
- supportsInferenceStep and step-indexed sourceInCML references must stay within actual inference-path bounds.
- Red herring text must not reuse correction-language tokens from inference_path.steps[].correction.
- If inference_path has ${stepCount} step(s), valid supportsInferenceStep/source step indices are 1..${stepCount} and 0..${Math.max(stepCount - 1, 0)} respectively.
- Cast paths must use CASE.cast[N] with N from the Name->Index map above. Do not substitute names inside brackets.

## Failure-Mode Hardening (pass-first)
- If valid_source_paths[] is provided, sourceInCML should exactly match one listed path.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- Do not reference a different suspect name when sourceInCML points to CASE.cast[N].*.
- Required discriminating-test IDs must be present in clues[].id and placed early|mid as essential.
- Elimination clues must include alibi window + corroborator + explicit exclusion logic.
- Red-herring forbidden terms apply to description/misdirection only; supportsAssumption may restate the false assumption.
- Set status="pass" only when missing discriminating IDs, weak elimination suspects, and invalid source paths are all empty.
- If cast-path binding, source-path legality, or discriminating evidence ID contracts fail, status MUST be "fail".

## Source Path Legality (Critical)
Allowed source roots include:
- CASE.inference_path.steps[N].observation
- CASE.inference_path.steps[N].correction
- CASE.inference_path.steps[N].required_evidence[M]
- CASE.constraint_space.time.anchors[M]
- CASE.constraint_space.time.contradictions[M]
- CASE.constraint_space.access.actors[M]
- CASE.constraint_space.access.objects[M]
- CASE.constraint_space.access.permissions[M]
- CASE.constraint_space.physical.laws[M]
- CASE.constraint_space.physical.traces[M]
- CASE.cast[N].alibi_window
- CASE.cast[N].access_plausibility
- CASE.cast[N].evidence_sensitivity[M]
- CASE.discriminating_test.evidence_clues[M]
- CASE.prose_requirements.clue_to_scene_mapping[M].clue_id
Forbidden examples:
- CASE.constraint_space.access.footprints[0]
- CASE.character_behavior.*
- CASE.character_testimonial.*
- CASE.cast.Name.*

## valid_source_paths[] (exact match preferred)
${validSourcePaths.length > 0 ? validSourcePaths.map((p) => `- ${p}`).join("\n") : "- none"}

## Deterministic Output Contracts
- FIRST-PASS CONTRACT: satisfy every contract in the initial output; downstream deterministic guardrails are safety nets, not primary completion paths.
- REQUIRED FIELDS CONTRACT: every clue must include non-empty id, sourceInCML, pointsTo, and supportsInferenceStep.
- FIELD CONSISTENCY CONTRACT: if sourceInCML is CASE.inference_path.steps[N].*, supportsInferenceStep must equal N+1.
- PER-STEP COVERAGE CONTRACT: for each inference step in range 1..${stepCount}, include at least one mapped clue and at least one contradiction clue.
- SOURCE LEGALITY CONTRACT: sourceInCML must exactly match an entry in valid_source_paths[]; never invent or transform paths.
- SOURCE FORMAT CONTRACT: use bracket-index leaf paths only (for example CASE.inference_path.steps[1].correction). Dot-index and intermediate-node paths are forbidden.
- SUSPECT PARITY CONTRACT: if any non-culprit suspect is named, include elimination/alibi evidence parity for that suspect.
- TOP-LEVEL KEY CONTRACT: output top-level keys exactly as status, clues, redHerrings, audit.
- FORBIDDEN KEY CONTRACT: do not output red_herrings.
- STATUS DERIVATION CONTRACT: return status="pass" only when all hard contracts are satisfied and all audit arrays are empty.
- DISCRIMINATING ID EXACTNESS: preserve ID strings exactly; clue_1 must remain clue_1 (do not output clue1).
- FULL OBJECT CONTRACT: emit full clue objects only, never partial clue objects.
- ANTI-COLLAPSE OUTPUT RULE: status="fail" does not permit empty clues[] when evidence exists; output best-effort clues and put defects in audit arrays.

## Micro-exemplars
- Weak clue: "Someone was nervous around dinner."
- Strong clue: "Port wine decanter seal is broken before service despite butler log marking it intact at ten past seven."
- Weak sourceInCML: "case notes"
- Strong sourceInCML: "CASE.constraint_space.time.anchors[1]"

## Silent Pre-Output Checklist
- every clue traceable to CML
- essential clues placed early/mid only
- supportsInferenceStep populated when applicable
- at least one contradiction clue exists for every inference step with supportsInferenceStep mapping
- red herrings support false assumption without inventing facts
- all discriminating-test evidence clue IDs present in clue list
- elimination clues include qualifying alibi/corroboration/exclusion detail
- no illegal sourceInCML paths
- every CASE.cast[N].* clue references cast[N].name consistently in description/pointsTo
- no out-of-range inference-step indices
- no digit-based clock notation in description/pointsTo
- required fixed slot IDs exist exactly once with essential early/mid placement
- if cast-path binding/source-path legality/discriminating-ID coverage fails, set status="fail"
- set status="pass" only when all audit arrays are empty and no cast-path mismatch remains
- JSON only, no markdown fences

`;

  developer += `## Output JSON Schema
\`\`\`json
{
  "status": "pass|fail",
  "clues": [
    {
      "id": "clue_1",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "Concrete, specific clue description",
      "observable": "The on-page surface a character can SEE/HEAR/FIND — no interpretation",
      "inference": "What that observable lets the detective conclude",
      "sourceInCML": "Where in CML this comes from",
      "pointsTo": "What it reveals",
      "first_full_reveal_chapter": null,
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional",
      "supportsInferenceStep": 1,
      "evidenceType": "observation|contradiction|elimination"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_1",
      "description": "Red herring description",
      "supportsAssumption": "Which false assumption it supports",
      "misdirection": "How it misleads"
    }
  ],
  "audit": {
    "missingDiscriminatingEvidenceIds": [],
    "weakEliminationSuspects": [],
    "invalidSourcePaths": []
  }
}
\`\`\``;

  // --- User prompt ---
  const densityCountText: Record<string, string> = { minimal: "5-8", moderate: "8-12", dense: "12-18" };
  const rhUserText = redHerringBudget > 0 ? ` and ${redHerringBudget} red herrings` : "";
  const userClueCountDirective = densityOverflow
    ? `at least ${requiredClues.length}`
    : densityCountText[effectiveDensity];
  const isFirstAttemptPrompt = !inputs.fairPlayFeedback;
  const firstAttemptContracts = isFirstAttemptPrompt
    ? [
        "- CULPRIT-UNIQUE CLUE: include at least one essential early/mid clue that directly narrows to the culprit via unique evidence linkage.",
        redHerringBudget > 0
          ? "- FIRST-ATTEMPT RED HERRING CONTRACT: pre-empt lexical overlap with correction terms and keep red-herring language semantically separate from true-solution mechanism wording."
          : "",
      ]
        .filter(Boolean)
        .join("\n")
    : "";

  let user = `Extract and organize clues from this mystery CML.

Generate ${userClueCountDirective} clues${rhUserText} that uphold fair play — every essential clue must be placed so the reader can solve the mystery before the detective reveals the answer.

Rules:
- Do NOT invent new facts — every clue must be traceable to CML
- Essential clues: "early" or "mid" placement ONLY — never "late". A "late" essential clue means the reader cannot solve the mystery before the detective.
- OUTPUT SHAPE CONTRACT: Include all three fixed IDs exactly once each - clue_mechanism_visibility_core, clue_core_contradiction_chain, clue_core_elimination_chain.
- MECHANISM VISIBILITY: At least one essential early/mid clue must surface the core mechanism detail from hidden_model.mechanism.description.
${firstAttemptContracts}
${buildStrictContractBlock(inputs.strictContract)}
- CONTRADICTION CHAIN: At least one essential early/mid contradiction clue must explicitly overturn the false assumption.
- ELIMINATION CHAIN: At least one essential early/mid elimination clue must explicitly eliminate an eligible non-culprit and narrow the solution.
- DISCRIMINATING TEST ID CONTRACT: Every CASE.discriminating_test.evidence_clues ID must appear as a clue id.
- CAST PATH BINDING CONTRACT: If sourceInCML is CASE.cast[N].*, suspect references in description/pointsTo must name cast[N].name and no other suspect.
- STATUS CONTRACT: Return status="pass" only when all audit arrays are empty; otherwise return status="fail".
- FAIL-FAST STATUS: status MUST be "fail" if any cast-path mismatch, illegal source path, or missing discriminating-test evidence clue ID remains.
- REQUIRED FIELDS CONTRACT: each clue MUST include non-empty sourceInCML, pointsTo, and supportsInferenceStep.
- PER-STEP COVERAGE CONTRACT: each inference step (1..${stepCount}) MUST have at least one mapped clue and at least one contradiction clue.
- SUSPECT PARITY CONTRACT: any named non-culprit suspect MUST have elimination/alibi evidence parity.
- TOP-LEVEL KEY CONTRACT: output exactly status, clues, redHerrings, audit; do not output red_herrings.
- FAIL-FAST STATUS EXTENSION: status MUST be fail if any required clue fields are missing, if any step lacks mapped or contradiction coverage, or if suspect parity fails.
- SOURCE FORMAT CONTRACT: sourceInCML MUST use bracket-index leaf paths only (no dot-index and no intermediate-node paths).
- DISCRIMINATING ID EXACTNESS: keep discriminating clue IDs as exact string matches, including underscores.
- FULL OBJECT CONTRACT: each clue object MUST include id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep, evidenceType.
- OBSERVABLE/INFERENCE SPLIT: also give each clue an "observable" (the concrete thing a character sees/hears/finds, with NO interpretation) and an "inference" (what that observable lets the detective conclude). Keep the solution/pointsTo OUT of "observable".
- POINTS-TO DISTINCTNESS: no two essential clues may share the same "pointsTo" implication — each solving clue must advance a DISTINCT step of the deduction rather than re-eliminating the same suspect.
- SELF-CHECK OUTPUT RULE: run all checks internally and output JSON only; do not output checklist commentary.
- ANTI-COLLAPSE OUTPUT RULE: if checks fail, keep status="fail" but still output a non-empty best-effort clues[] set unless CML evidence is unusable.
- If quality controls require late clues, satisfy late placement with supporting or optional clues only.
- Essential solving clues must remain early or mid.
- Cite sourceInCML for every clue
- Return valid JSON matching the Output JSON Schema above
`;

  if (inputs.fairPlayFeedback && (inputs.fairPlayFeedback.violations?.length || inputs.fairPlayFeedback.warnings?.length)) {
    const correctionTargets = [
      ...(inputs.fairPlayFeedback.violations || []).map((v) => `[${v.severity}] ${v.rule}: ${v.description}`),
      ...(inputs.fairPlayFeedback.warnings || []).map((w) => `[warning] ${w}`),
    ];
    if (correctionTargets.length > 0) {
      const explicitForbiddenTerms = Array.isArray(inputs.fairPlayFeedback.forbiddenTerms)
        ? inputs.fairPlayFeedback.forbiddenTerms.map((t) => String(t).trim()).filter(Boolean)
        : [];
      const correctionTerms = Array.isArray(caseData?.inference_path?.steps)
        ? caseData.inference_path.steps.flatMap((s: any) => extractKeyTerms(String(s?.correction ?? "")))
        : [];
      const forbiddenTerms = [...new Set([...explicitForbiddenTerms, ...correctionTerms])].slice(0, 18);
      const preferredTerms = Array.isArray(inputs.fairPlayFeedback.preferredTerms)
        ? [...new Set(inputs.fairPlayFeedback.preferredTerms.map((t) => String(t).trim()).filter(Boolean))].slice(0, 18)
        : [];
      const requiredReplacements = Array.isArray(inputs.fairPlayFeedback.requiredReplacements)
        ? inputs.fairPlayFeedback.requiredReplacements.map((t) => String(t).trim()).filter(Boolean)
        : [];
      const violationCodes = Array.isArray(inputs.fairPlayFeedback.violationCodes)
        ? [...new Set(inputs.fairPlayFeedback.violationCodes.map((code) => String(code).trim()).filter(Boolean))].slice(0, 12)
        : [];
      const targetedClueIds = Array.isArray(inputs.fairPlayFeedback.targetedClueIds)
        ? [...new Set(inputs.fairPlayFeedback.targetedClueIds.map((id) => String(id).trim()).filter(Boolean))].slice(0, 18)
        : [];
      const preserveClueIds = Array.isArray(inputs.fairPlayFeedback.preserveClueIds)
        ? [...new Set(inputs.fairPlayFeedback.preserveClueIds.map((id) => String(id).trim()).filter(Boolean))].slice(0, 24)
        : [];
      const rewriteTargets = Array.isArray(inputs.fairPlayFeedback.redHerringIdsToRewrite)
        ? inputs.fairPlayFeedback.redHerringIdsToRewrite.map((id) => String(id).trim()).filter(Boolean)
        : [];
      const requiredCluePhrases = Array.isArray(inputs.fairPlayFeedback.requiredCluePhrases)
        ? [...new Set(inputs.fairPlayFeedback.requiredCluePhrases.map((p) => String(p).trim()).filter(Boolean))].slice(0, 12)
        : [];
      const castPathBindingRules = Array.isArray(inputs.fairPlayFeedback.castPathBindingRules)
        ? [...new Set(inputs.fairPlayFeedback.castPathBindingRules.map((p) => String(p).trim()).filter(Boolean))].slice(0, 12)
        : [];
      const payloadCastIndexMap = Array.isArray(inputs.fairPlayFeedback.castPathNameIndexMap)
        ? inputs.fairPlayFeedback.castPathNameIndexMap
            .map((entry) => ({ index: Number(entry?.index), name: String(entry?.name ?? "").trim() }))
            .filter((entry) => Number.isInteger(entry.index) && entry.index >= 0 && entry.name.length > 0)
            .slice(0, 20)
        : [];
      const strictSourcePaths = Array.isArray(inputs.fairPlayFeedback.strictSourcePaths)
        ? [...new Set(inputs.fairPlayFeedback.strictSourcePaths.map((path) => String(path).trim()).filter(Boolean))].slice(0, 40)
        : [];
      const requiredIdToSourceMappings = Array.isArray(inputs.fairPlayFeedback.requiredIdToSourceMappings)
        ? inputs.fairPlayFeedback.requiredIdToSourceMappings
            .map((entry) => ({
              id: String(entry?.id ?? "").trim(),
              sourceInCML: String(entry?.sourceInCML ?? "").trim(),
            }))
            .filter((entry) => entry.id.length > 0 && entry.sourceInCML.length > 0)
            .slice(0, 24)
        : [];
      const requiredStepCoverageFloors = Array.isArray(inputs.fairPlayFeedback.requiredStepCoverageFloors)
        ? inputs.fairPlayFeedback.requiredStepCoverageFloors
            .map((entry) => ({
              step: Number(entry?.step),
              requireContradiction: Boolean(entry?.requireContradiction),
              requireMapped: Boolean(entry?.requireMapped),
            }))
            .filter((entry) => Number.isInteger(entry.step) && entry.step > 0)
            .slice(0, 16)
        : [];
      const requiredLateClueSlot = inputs.fairPlayFeedback.requiredLateClueSlot
        ? {
            id: String(inputs.fairPlayFeedback.requiredLateClueSlot.id ?? "").trim(),
            placement: String(inputs.fairPlayFeedback.requiredLateClueSlot.placement ?? "").trim(),
            criticality: String(inputs.fairPlayFeedback.requiredLateClueSlot.criticality ?? "").trim(),
          }
        : undefined;
      const requiredDirectCulpritClue = inputs.fairPlayFeedback.requiredDirectCulpritClue
        ? {
            id: String(inputs.fairPlayFeedback.requiredDirectCulpritClue.id ?? "").trim(),
            culpritName: String(inputs.fairPlayFeedback.requiredDirectCulpritClue.culpritName ?? "").trim(),
            allowedSourcePaths: Array.isArray(inputs.fairPlayFeedback.requiredDirectCulpritClue.allowedSourcePaths)
              ? inputs.fairPlayFeedback.requiredDirectCulpritClue.allowedSourcePaths
                  .map((path) => String(path).trim())
                  .filter(Boolean)
                  .slice(0, 12)
              : [],
            requiredPhrases: Array.isArray(inputs.fairPlayFeedback.requiredDirectCulpritClue.requiredPhrases)
              ? inputs.fairPlayFeedback.requiredDirectCulpritClue.requiredPhrases
                  .map((phrase) => String(phrase).trim())
                  .filter(Boolean)
                  .slice(0, 12)
              : [],
          }
        : undefined;
      const effectiveCastIndexMap = payloadCastIndexMap.length > 0 ? payloadCastIndexMap : castIndexMap;
      user += `

    Retry mode (bounded delta repair):
    - Retry scope: use violation_codes[], targeted_clue_ids[], and preserve_clue_ids[] below as the authoritative delta contract.
    - Do not reopen unaffected clues or red herrings beyond the bounded scope declared below.
- Preserve unaffected clues unless changes are needed for consistency.
- Populate audit arrays to show no unresolved critical defects.
- If any target mentions red-herring overlap, include rewrite table entries as: old phrase -> replacement phrase.
${requiredCluePhrases.length > 0 ? `- REQUIRED CLUE CONTENT (must be covered by essential early/mid clues):\n${requiredCluePhrases.map((p) => `  - ${p}`).join("\n")}` : ""}

    Structured correction payload (bounded delta; apply exactly):
    - violation_codes[]:
    ${violationCodes.length > 0 ? violationCodes.map((code) => `  - ${code}`).join("\n") : "  - none"}
- must_fix[]:
${correctionTargets.map((t) => `  - ${t}`).join("\n")}
    - targeted_clue_ids[]:
    ${targetedClueIds.length > 0 ? targetedClueIds.map((id) => `  - ${id}`).join("\n") : "  - none"}
    - preserve_clue_ids[]:
    ${preserveClueIds.length > 0 ? preserveClueIds.map((id) => `  - ${id}`).join("\n") : "  - none"}
- strict_source_paths[]:
${strictSourcePaths.length > 0 ? strictSourcePaths.map((path) => `  - ${path}`).join("\n") : "  - none"}
- required_id_to_source_mappings[]:
${requiredIdToSourceMappings.length > 0
  ? requiredIdToSourceMappings.map((entry) => `  - ${entry.id} -> ${entry.sourceInCML}`).join("\n")
  : "  - none"}
- required_step_coverage_floors[]:
${requiredStepCoverageFloors.length > 0
  ? requiredStepCoverageFloors.map((entry) => `  - step ${entry.step} | contradiction=${entry.requireContradiction} | mapped=${entry.requireMapped}`).join("\n")
  : "  - none"}
- required_late_clue_slot:
${requiredLateClueSlot?.id
  ? `  - id=${requiredLateClueSlot.id} | placement=${requiredLateClueSlot.placement} | criticality=${requiredLateClueSlot.criticality}`
  : "  - none"}
- required_direct_culprit_clue:
${requiredDirectCulpritClue?.id
  ? [
      `  - id=${requiredDirectCulpritClue.id} | culprit=${requiredDirectCulpritClue.culpritName}`,
      `  - allowed_source_paths=${requiredDirectCulpritClue.allowedSourcePaths.length > 0 ? requiredDirectCulpritClue.allowedSourcePaths.join(", ") : "none"}`,
      `  - required_phrases=${requiredDirectCulpritClue.requiredPhrases.length > 0 ? requiredDirectCulpritClue.requiredPhrases.join(", ") : "none"}`,
    ].join("\n")
  : "  - none"}
- cast_index_to_name_map[] (authoritative for CASE.cast[N].*):
${effectiveCastIndexMap.length > 0 ? effectiveCastIndexMap.map((c) => `  - [${c.index}] ${c.name}`).join("\n") : "  - none"}
${castPathBindingRules.length > 0 ? `- cast_path_binding_rules[]:\n${castPathBindingRules.map((rule) => `  - ${rule}`).join("\n")}` : "- cast_path_binding_rules[]: none"}
${forbiddenTerms.length > 0 ? `- forbidden_terms[] (do not use in red herring description/misdirection):\n${forbiddenTerms.map((t) => `  - ${t}`).join("\n")}` : "- forbidden_terms[]: none"}
- preferred_terms[] (use these instead when possible):
${preferredTerms.length > 0 ? preferredTerms.map((t) => `  - ${t}`).join("\n") : "  - none"}
- required_replacements[]:
${requiredReplacements.length > 0
  ? requiredReplacements.map((r) => `  - ${r}`).join("\n")
  : "  - old phrase -> replacement phrase (for every overlap-triggering phrase)\n  - old phrase -> replacement phrase (for every invalid source path token)"}

Hard retry contract:
- Rewrite targeted_clue_ids[] only; add missing IDs from targeted_clue_ids[] when must_fix[] requires them.
- Preserve preserve_clue_ids[] unchanged unless a targeted dependency forces a paired update.
- If targeted_clue_ids[] is empty, limit changes to the minimum new IDs required by must_fix[].
- strict_source_paths[] are the authoritative legal retry sourceInCML leaves; do not emit any clue outside that whitelist.
- Keep every required_id_to_source_mappings[] clue ID exact, early|mid, and essential.
- Satisfy every required_step_coverage_floors[] entry in the same output; do not defer contradiction coverage to a later retry.
- If required_late_clue_slot is present, keep that exact ID late and non-essential.
- If required_direct_culprit_clue is present, keep that exact ID, name the culprit explicitly, and use one of its allowed_source_paths.
- If forbidden_terms[] is non-empty, none of those terms may appear in redHerrings[].description or redHerrings[].misdirection.
- Retry CAST PATH BINDING CONTRACT (MANDATORY): for each clue with sourceInCML=CASE.cast[N].*, suspect references in description/pointsTo must match cast[N].name from cast_index_to_name_map[].
- Mandatory pre-output self-check: iterate every clue and verify cast-path binding, source-path legality, and discriminating evidence ID coverage before final output.
- If that cannot be satisfied while keeping red herring coherence, return status=\"fail\" with the blocking term list in audit.invalidSourcePaths.`;
      if (rewriteTargets.length > 0 || correctionTargets.some((t) => /red\s*herring\s*(rh_1|rh_2)|rh_1|rh_2/i.test(t))) {
        user += `
- Explicitly rewrite ${rewriteTargets.length > 0 ? rewriteTargets.join(", ") : "both rh_1 and rh_2"} and include a non-overlap justification sentence in each misdirection field.`;
      }
    }
  }

  return {
    system,
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
  let clueData: any;
  let repaired = false;
  try {
    clueData = JSON.parse(content);
  } catch {
    clueData = JSON.parse(jsonrepair(content));
    repaired = true;
  }
  const truncated = repaired && !content.trim().endsWith("}");
  return { clueData, repaired, truncated };
};

/** Canonical parsed-clue id shape (mirrors the worker's canonicalizeClueId): a bare "clue_" fails. */
export const CANONICAL_PARSED_CLUE_ID_RE = /^clue_[a-z0-9_-]+$/i;

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
    const id = String((clue as any)?.id ?? "").trim();
    const description = String((clue as any)?.description ?? "").trim();
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

    const { kept: normalizedClues, droppedWarnings } = dropMalformedParsedClues(clueData?.clues);
    parseWarnings.push(...droppedWarnings);
    const normalizedRedHerrings = Array.isArray(clueData?.redHerrings) ? clueData.redHerrings : [];

    // WP3D: Deterministically normalize supportsInferenceStep and evidenceType.
    // Prefer inferred values from source paths over null/default model outputs.
    for (const clue of normalizedClues) {
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
      redHerringsDontBreakLogic: normalizedRedHerrings.length <= inputs.redHerringBudget,
    };

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
        essentialClueCount: essentialClues.length,
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
