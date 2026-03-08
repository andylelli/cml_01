/**
 * Mystery Generation Orchestrator
 *
 * Connects all 8 agents into a complete mystery generation pipeline:
 * Agent 1 â†’ Agent 2 â†’ Agent 3 (+Agent 4) â†’ Agent 5 â†’ Agent 6 â†’ Agent 7 â†’ Agent 8
 *
 * Handles progress tracking, error recovery, cost tracking, and result aggregation.
 */

import { join, dirname, resolve as pathResolve } from "path";
import { readFileSync, existsSync } from "fs";
import { fileURLToPath } from "url";
import { resolveWorkerRuntimePaths } from "./runtime-paths.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateCaseData, validateArtifact } from "@cml/cml";
import {
  refineSetting,
  designCast,
  generateCastNames,
  type NameGeneratorContext,
  generateCML,
  buildCMLPrompt,
  extractClues,
  auditFairPlay,
  formatNarrative,
  generateCharacterProfiles,
  generateLocationProfiles,
  generateTemporalContext,
  generateBackgroundContext,
  generateHardLogicDevices,
  generateProse,
  auditNovelty,
  loadSeedCMLFiles,
  blindReaderSimulation,
  reviseCml,
  initNarrativeState,
  updateNSD,
  type NarrativeState,
} from "@cml/prompts-llm";
import { StoryValidationPipeline } from "@cml/story-validation";
import type { ValidationReport } from "@cml/story-validation";
import {
  ScoreAggregator,
  RetryManager,
  FileReportRepository,
  SettingRefinementScorer,
  CastDesignScorer,
  BackgroundContextScorer,
  CharacterProfilesScorer,
  LocationProfilesScorer,
  TemporalContextScorer,
  HardLogicScorer,
  NarrativeScorer,
  ProseScorer,
  buildRetryFeedback,
} from "@cml/story-validation";
import type { PhaseScore, TestResult, GenerationReport } from "@cml/story-validation";
import { getFailedComponents } from "@cml/story-validation";
import {
  adaptSettingForScoring,
  adaptCastForScoring,
  adaptBackgroundContextForScoring,
  adaptHardLogicForScoring,
  adaptNarrativeForScoring,
  adaptCharacterProfilesForScoring,
  adaptLocationsForScoring,
  adaptTemporalContextForScoring,
  adaptProseForScoring,
  type ClueRef,
} from "./scoring-adapters.js";
import { ScoringLogger } from "./scoring-logger.js";
import type {
  SettingRefinementResult,
  CastDesignResult,
  CMLGenerationResult,
  ClueDistributionResult,
  FairPlayAuditResult,
  NarrativeOutline,
  CharacterProfilesResult,
  LocationProfilesResult,
  TemporalContextResult,
  BackgroundContextArtifact,
  HardLogicDeviceResult,
  HardLogicDeviceIdea,
  ProseGenerationResult,
  NoveltyAuditResult,
  BlindReaderResult,
} from "@cml/prompts-llm";

const { workspaceRoot: WORKSPACE_ROOT, workerAppRoot: WORKER_APP_ROOT, examplesRoot: EXAMPLES_ROOT } =
  resolveWorkerRuntimePaths(import.meta.url);

// ============================================================================
// Types
// ============================================================================
export interface MysteryGenerationInputs {
  // User preferences
  theme: string; // e.g., "locked room murder in a manor"
  eraPreference?: string; // e.g., "Victorian England" or "1920s America"
  locationPreset?: string; // e.g., "Liner", "CountryHouse"
  tone?: string; // e.g., "Cozy", "Classic", "Dark"
  primaryAxis?: "temporal" | "spatial" | "social" | "psychological" | "mechanical";
  
  // Optional refinements
  castSize?: number; // suspects + witnesses (detective always added as +1)
  castNames?: string[]; // Optional user-provided names
  detectiveType?: 'police' | 'private' | 'amateur'; // Archetype of the investigator
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  
  // Control flags
  skipNoveltyCheck?: boolean; // Skip Agent 8 if desired
  similarityThreshold?: number; // For Agent 8, default 0.7
  
  // Prose generation
  proseBatchSize?: number; // chapters per LLM call (1–10, default 1)

  // Tracking
  runId?: string;
  projectId?: string;
}

type DifficultyMode = "standard" | "increase" | "extreme";

type HardLogicDirectives = {
  mechanismFamilies: string[];
  complexityLevel: "simple" | "moderate" | "complex";
  hardLogicModes: string[];
  difficultyMode: DifficultyMode;
};

type CmlPrimaryAxis = "temporal" | "spatial" | "identity" | "behavioral" | "authority";

const normalizePrimaryAxis = (
  axis: MysteryGenerationInputs["primaryAxis"] | undefined,
): CmlPrimaryAxis => {
  switch (axis) {
    case "temporal":
    case "spatial":
      return axis;
    case "social":
      return "authority";
    case "psychological":
      return "behavioral";
    case "mechanical":
      return "identity";
    default:
      return "temporal";
  }
};

const mergeHardLogicDirectives = (
  base: HardLogicDirectives,
  hardLogicDevices: HardLogicDeviceIdea[],
): HardLogicDirectives => {
  const mechanismFamilies = new Set(base.mechanismFamilies);
  const hardLogicModes = new Set(base.hardLogicModes);

  for (const device of hardLogicDevices) {
    for (const family of device.mechanismFamilyHints ?? []) {
      if (family.trim().length > 0) {
        mechanismFamilies.add(family.trim());
      }
    }

    for (const mode of device.modeTags ?? []) {
      if (mode.trim().length > 0) {
        hardLogicModes.add(mode.trim());
      }
    }

    switch (device.principleType) {
      case "mathematical_principle":
        mechanismFamilies.add("quantitative contradiction");
        break;
      case "cognitive_bias":
        mechanismFamilies.add("cognitive-bias exploitation");
        break;
      case "social_logic":
        mechanismFamilies.add("authority-channel manipulation");
        break;
      default:
        mechanismFamilies.add("physical-constraint proof");
        break;
    }
  }

  return {
    mechanismFamilies: Array.from(mechanismFamilies),
    hardLogicModes: Array.from(hardLogicModes),
    complexityLevel: base.complexityLevel,
    difficultyMode: base.difficultyMode,
  };
};

const deriveHardLogicDirectives = (
  theme: string | undefined,
  primaryAxis: MysteryGenerationInputs["primaryAxis"] | undefined,
  locationPreset: string | undefined,
): HardLogicDirectives => {
  const text = `${theme ?? ""} ${locationPreset ?? ""}`.toLowerCase();
  const familySet = new Set<string>();
  const modeSet = new Set<string>();

  const addFamily = (value: string) => familySet.add(value);
  const addMode = (value: string) => modeSet.add(value);

  switch (primaryAxis) {
    case "temporal":
      addFamily("schedule contradiction");
      addFamily("timing window trap");
      break;
    case "spatial":
      addFamily("access path illusion");
      addFamily("geometry-based movement");
      break;
    case "social":
      addFamily("authority-channel manipulation");
      addFamily("status-based witness distortion");
      break;
    case "psychological":
      addFamily("cognitive bias exploitation");
      addFamily("memory anchoring misdirection");
      break;
    case "mechanical":
      addFamily("mechanical sequence trigger");
      addFamily("acoustic or pressure misread");
      break;
    default:
      break;
  }

  if (/(locked[-\s]?room|impossible crime)/.test(text)) {
    addMode("locked-room");
    addFamily("sealed-space constraint proof");
  }
  if (/train|rail|liner|ship|seaside|hotel/.test(text)) {
    addMode("transit or seaside topology");
    addFamily("timetable dependency");
  }
  if (/inheritance|will|estate/.test(text)) {
    addMode("inheritance pressure logic");
    addFamily("document-chain contradiction");
  }
  if (/(math|mathematics|geometry|probability|pure mathematics)/.test(text)) {
    addMode("mathematical principle");
    addFamily("probability misdirection");
    addFamily("geometric visibility constraint");
  }
  if (/(botanical|medical|toxin|toxicology|botany)/.test(text)) {
    addMode("botanical or medical mechanism");
    addFamily("dose-timing asymmetry");
  }
  if (/acoustic|sound|echo/.test(text)) {
    addMode("acoustics");
    addFamily("acoustic mislocalization");
  }
  if (/(multi-layer|double-bluff|double bluff|nested)/.test(text)) {
    addMode("multi-layer deception");
    addFamily("stacked false assumptions");
  }

  let difficultyMode: DifficultyMode = "standard";
  if (/make it brutal|extreme mode/.test(text)) {
    difficultyMode = "extreme";
    addMode("near-impossible construction");
    addFamily("precision timing geometry");
  } else if (/increase difficulty|escalation mode/.test(text)) {
    difficultyMode = "increase";
    addMode("multi-step reasoning");
    addFamily("dual-principle contradiction");
  }

  const complexityLevel: "simple" | "moderate" | "complex" =
    difficultyMode === "standard" ? "moderate" : "complex";

  if (familySet.size === 0) {
    addFamily("constraint contradiction");
    addFamily("inference-path trap");
  }

  return {
    mechanismFamilies: Array.from(familySet).slice(0, 6),
    complexityLevel,
    hardLogicModes: Array.from(modeSet).slice(0, 6),
    difficultyMode,
  };
};

type ClueGuardrailIssue = {
  severity: "critical" | "warning";
  message: string;
};

const getCaseQualityControls = (cml: CaseData) => {
  const legacy = cml as any;
  const cmlCase = (legacy?.CASE ?? {}) as any;
  return cmlCase.quality_controls?.clue_visibility_requirements ?? {};
};

const normalizeClueTimeline = (clues: ClueDistributionResult) => {
  clues.clueTimeline = {
    early: clues.clues.filter((c) => c.placement === "early").map((c) => c.id),
    mid: clues.clues.filter((c) => c.placement === "mid").map((c) => c.id),
    late: clues.clues.filter((c) => c.placement === "late").map((c) => c.id),
  };
};

const applyClueGuardrails = (cml: CaseData, clues: ClueDistributionResult) => {
  const requirements = getCaseQualityControls(cml);
  const issues: ClueGuardrailIssue[] = [];
  const fixes: string[] = [];

  const essential = clues.clues.filter((c) => c.criticality === "essential");
  const essentialMin = Number(requirements?.essential_clues_min ?? 3);

  if (essential.length < essentialMin) {
    issues.push({
      severity: "critical",
      message: `Essential clue count ${essential.length} is below required minimum ${essentialMin}`,
    });
  }

  const essentialLate = essential.filter((c) => c.placement === "late");
  if (essentialLate.length > 0) {
    essentialLate.forEach((clue, index) => {
      clue.placement = index % 2 === 0 ? "mid" : "early";
    });
    fixes.push(`Repositioned ${essentialLate.length} essential clue(s) from late to early/mid placement`);
  }

  const earlyMin = Number(requirements?.early_clues_min ?? 1);
  const midMin = Number(requirements?.mid_clues_min ?? 1);
  const lateMin = Number(requirements?.late_clues_min ?? 1);

  const counts = {
    early: clues.clues.filter((c) => c.placement === "early").length,
    mid: clues.clues.filter((c) => c.placement === "mid").length,
    late: clues.clues.filter((c) => c.placement === "late").length,
  };

  if (counts.early < earlyMin) {
    issues.push({
      severity: "critical",
      message: `Early clue count ${counts.early} is below required minimum ${earlyMin}`,
    });
  }
  if (counts.mid < midMin) {
    issues.push({
      severity: "critical",
      message: `Mid clue count ${counts.mid} is below required minimum ${midMin}`,
    });
  }
  if (counts.late < lateMin) {
    issues.push({
      severity: "warning",
      message: `Late clue count ${counts.late} is below preferred minimum ${lateMin}`,
    });
  }

  const detectiveOnlyPattern = /(detective[-\s]?only|only\s+the\s+detective|private\s+insight|withheld\s+from\s+reader)/i;
  const detectiveOnlyClues = clues.clues.filter(
    (c) => detectiveOnlyPattern.test(c.description) || detectiveOnlyPattern.test(c.pointsTo),
  );

  if (detectiveOnlyClues.length > 0) {
    issues.push({
      severity: "critical",
      message: `Detected ${detectiveOnlyClues.length} clue(s) implying detective-only/private information`,
    });
  }

  const duplicateIds = new Set<string>();
  const seenIds = new Set<string>();
  for (const clue of clues.clues) {
    if (seenIds.has(clue.id)) {
      duplicateIds.add(clue.id);
    }
    seenIds.add(clue.id);
  }
  if (duplicateIds.size > 0) {
    issues.push({
      severity: "critical",
      message: `Duplicate clue IDs detected: ${Array.from(duplicateIds).join(", ")}`,
    });
  }

  normalizeClueTimeline(clues);

  return {
    issues,
    fixes,
    hasCriticalIssues: issues.some((i) => i.severity === "critical"),
  };
};

// ============================================================================
// WP6: Failure Classification
// ============================================================================

type FairPlayFailureClass = "clue_coverage" | "inference_path_abstract" | "constraint_space_insufficient" | "clue_only";

const classifyFairPlayFailure = (
  coverageResult: InferenceCoverageResult,
  fairPlayAudit: FairPlayAuditResult | null,
  cml: CaseData
): FairPlayFailureClass => {
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];

  const abstractSteps = steps.filter((s: any) => {
    const obs = (s.observation || "").trim();
    const hasEvidence = Array.isArray(s.required_evidence) && s.required_evidence.length > 0;
    return obs.length < 30 || !hasEvidence;
  });

  if (abstractSteps.length >= Math.ceil(steps.length * 0.5)) {
    return "inference_path_abstract";
  }

  const cs = caseBlock?.constraint_space ?? {};
  const totalConstraints = [
    ...(cs.time?.contradictions ?? []),
    ...(cs.time?.anchors ?? []),
    ...(cs.access?.actors ?? []),
    ...(cs.physical?.traces ?? []),
  ].length;

  if (totalConstraints < 4) {
    return "constraint_space_insufficient";
  }

  if (coverageResult.hasCriticalGaps) {
    return "clue_coverage";
  }

  return "clue_only";
};

// ============================================================================
// WP4: Inference Path Coverage Guardrails
// ============================================================================

interface InferenceCoverageResult {
  issues: ClueGuardrailIssue[];
  coverageMap: Map<number, { observation: boolean; contradiction: boolean; elimination: boolean }>;
  uncoveredSteps: number[];
  hasCriticalGaps: boolean;
}

const checkInferencePathCoverage = (
  cml: CaseData,
  clues: ClueDistributionResult
): InferenceCoverageResult => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  
  if (!Array.isArray(steps) || steps.length === 0) {
    issues.push({
      severity: "critical",
      message: "No inference_path steps found in CML",
    });
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
      if (evidenceType in coverage) {
        (coverage as any)[evidenceType] = true;
      }
    }
  }

  // Fuzzy matching fallback
  for (const clue of clues.clues) {
    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const stepNum = i + 1;
      const coverage = coverageMap.get(stepNum)!;
      
      const clueText = (String(clue.description ?? '') + " " + String((clue as any).sourceInCML ?? '')).toLowerCase();
      const obsText = (typeof step.observation === 'string' ? step.observation : '').toLowerCase();
      
      const obsWords = obsText.split(/\s+/).filter((w: string) => w.length > 4);
      const matchCount = obsWords.filter((w: string) => clueText.includes(w)).length;
      if (obsWords.length > 0 && matchCount >= Math.ceil(obsWords.length * 0.4)) {
        coverage.observation = true;
      }

      if (Array.isArray(step.required_evidence)) {
        for (const ev of step.required_evidence) {
          const evWords = String(ev ?? '').toLowerCase().split(/\s+/).filter((w: string) => w.length > 4);
          const evMatch = evWords.filter((w: string) => clueText.includes(w)).length;
          if (evWords.length > 0 && evMatch >= Math.ceil(evWords.length * 0.4)) {
            coverage.observation = true;
          }
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
        message: "Inference step " + stepNum + ' ("' + (step.observation || "").substring(0, 60) + '") has NO covering clue',
      });
    }
    if (!coverage.contradiction) {
      issues.push({
        severity: "warning",
        message: "Inference step " + stepNum + " has no contradiction clue",
      });
    }
  }

  return {
    issues,
    coverageMap,
    uncoveredSteps,
    hasCriticalGaps: uncoveredSteps.length > 0,
  };
};

const checkContradictionPairs = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const steps = caseBlock?.inference_path?.steps ?? [];
  
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepNum = i + 1;
    
    const stepClues = clues.clues.filter((c: any) => c.supportsInferenceStep === stepNum);
    const evidenceTypes = new Set(stepClues.map((c: any) => c.evidenceType || "observation"));
    
    if (stepClues.length >= 2 && evidenceTypes.has("observation") && 
        (evidenceTypes.has("contradiction") || evidenceTypes.has("elimination"))) {
      continue;
    }
    
    if (stepClues.length < 2) {
      issues.push({
        severity: "warning",
        message: "Inference step " + stepNum + ' ("' + (step.observation || "").substring(0, 60) + '") has only ' + stepClues.length + " mapped clue(s)",
      });
    } else if (!evidenceTypes.has("contradiction") && !evidenceTypes.has("elimination")) {
      issues.push({
        severity: "warning",
        message: "Inference step " + stepNum + " has clues but no contradiction/elimination evidence",
      });
    }
  }

  return issues;
};

const checkFalseAssumptionContradiction = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const falseAssumption = caseBlock?.false_assumption?.statement || "";
  
  if (!falseAssumption) {
    issues.push({
      severity: "critical",
      message: "No false_assumption.statement in CML",
    });
    return issues;
  }

  const contradictionClues = clues.clues.filter((c: any) => c.evidenceType === "contradiction");
  if (contradictionClues.length === 0) {
    issues.push({
      severity: "critical",
      message: "No clue with evidenceType=\"contradiction\" found. Reader needs evidence challenging: \"" + falseAssumption.substring(0, 80) + "\"",
    });
  }

  const suspiciousRedHerrings = clues.redHerrings.filter((rh: any) => {
    const desc = (String(rh.description ?? '') + " " + String(rh.supportsAssumption ?? '')).toLowerCase();
    return caseBlock?.inference_path?.steps?.some((step: any) => {
      const corrWords = (typeof step.correction === 'string' ? step.correction : '').toLowerCase().split(/\s+/).filter((w: string) => w.length > 5);
      return corrWords.some((w: string) => desc.includes(w));
    });
  });

  if (suspiciousRedHerrings.length > 0) {
    issues.push({
      severity: "warning",
      message: suspiciousRedHerrings.length + " red herring(s) may accidentally support the true solution",
    });
  }

  return issues;
};

const checkDiscriminatingTestReachability = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const discrimTest = caseBlock?.discriminating_test;
  
  if (!discrimTest?.design) {
    issues.push({
      severity: "critical",
      message: "No discriminating_test.design in CML",
    });
    return issues;
  }

  const designText = (discrimTest.design || "").toLowerCase();
  const knowledgeText = (discrimTest.knowledge_revealed || "").toLowerCase();
  const combinedTestText = designText + " " + knowledgeText;

  const relevantClues = clues.clues.filter((c: any) => {
    const clueText = c.description.toLowerCase();
    const testWords = combinedTestText.split(/\s+/).filter((w: string) => w.length > 4);
    const matchCount = testWords.filter((w: string) => clueText.includes(w)).length;
    return testWords.length > 0 && matchCount >= Math.ceil(testWords.length * 0.2);
  });

  if (relevantClues.length === 0) {
    issues.push({
      severity: "critical",
      message: "Discriminating test references no evidence found in the clue set",
    });
  }

  const earlyMidRelevant = relevantClues.filter((c: any) => c.placement === "early" || c.placement === "mid");
  if (relevantClues.length > 0 && earlyMidRelevant.length === 0) {
    issues.push({
      severity: "warning",
      message: "All clues related to the discriminating test are in late placement",
    });
  }

  return issues;
};

const checkSuspectElimination = (
  cml: CaseData,
  clues: ClueDistributionResult
): ClueGuardrailIssue[] => {
  const issues: ClueGuardrailIssue[] = [];
  const caseBlock = (cml as any)?.CASE ?? cml;
  const cast = Array.isArray(caseBlock?.cast) ? caseBlock.cast : [];
  const culprits = caseBlock?.culpability?.culprits ?? [];
  
  const suspects = cast.filter((c: any) => 
    c.culprit_eligibility === "eligible" && !culprits.includes(c.name)
  );

  if (suspects.length === 0) return issues;

  const allClueText = clues.clues.map((c: any) => c.description.toLowerCase()).join(" ");
  
  const uneliminable = suspects.filter((suspect: any) => {
    const name = (suspect.name || "").toLowerCase();
    const nameWords = name.split(/\s+/);
    return !nameWords.some((w: string) => w.length > 2 && allClueText.includes(w));
  });

  if (uneliminable.length > 0) {
    issues.push({
      severity: "warning",
      message: uneliminable.length + " suspect(s) (" + uneliminable.map((s: any) => s.name).join(", ") + ") are never referenced in any clue",
    });
  }

  return issues;
};


// Load writing guide notes for prose generation
const loadWritingGuides = (): { humour?: string; craft?: string } => {
  const guides: { humour?: string; craft?: string } = {};
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const notesDir = pathResolve(currentDir, "../../../../notes");
  try {
    const humourPath = join(notesDir, "DEFINITIVE_GUIDE_TO_HUMOUR.md");
    if (existsSync(humourPath)) {
      guides.humour = readFileSync(humourPath, "utf8");
    }
  } catch { /* optional guide */ }
  try {
    const craftPath = join(notesDir, "WHAT_MAKES_A_GOOD_WHODUNNIT.md");
    if (existsSync(craftPath)) {
      guides.craft = readFileSync(craftPath, "utf8");
    }
  } catch { /* optional guide */ }
  return guides;
};

const proseMojibakeReplacements: Array<[RegExp, string]> = [
  [/Ã¢â‚¬â„¢/g, "'"],
  [/Ã¢â‚¬Ëœ/g, "'"],
  [/Ã¢â‚¬Å“|Ã¢â‚¬\x9d/g, '"'],
  [/Ã¢â‚¬"|Ã¢â‚¬â€/g, "—"],
  [/Ã¢â‚¬â€œ/g, "–"],
  [/Ã¢â‚¬Â¦/g, "…"],
  [/faË†Â§ade|faˆ§ade/g, "façade"],
  [/â€™/g, "'"],
  [/â€˜/g, "'"],
  [/â€œ|â€\x9d/g, '"'],
  [/â€"|â€”/g, "—"],
  [/â€“/g, "–"],
  [/â€¦/g, "…"],
  [/â/g, "'"],
  [/â/g, "'"],
  [/â|â/g, '"'],
  [/â/g, "–"],
  [/â/g, "—"],
  [/â¦/g, "…"],
  [/â¢/g, "•"],
  [/Ã‚/g, ""],
  [/Â/g, ""],
  [/\uFFFD/g, ""],
];

const illegalControlCharPattern = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const persistentMojibakePattern = /(?:Ã¢â‚¬â„¢|Ã¢â‚¬Ëœ|Ã¢â‚¬Å“|Ã¢â‚¬\x9d|Ã¢â‚¬"|Ã¢â‚¬â€|Ã¢â‚¬â€œ|Ã¢â‚¬Â¦|Ã‚|Ë†Â§|â€™|â€˜|â€œ|â€\x9d|â€"|â€¦|â|â|â|â|â|â¦|\uFFFD)/;

const normalizeWrappedParagraphText = (text: string) => {
  const blocks = text
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((block) => block.replace(/\n+/g, " ").replace(/\s{2,}/g, " ").trim())
    .filter((block) => block.length > 0);
  return blocks.join("\n\n");
};

const splitLongParagraphForReadability = (paragraph: string, maxLength = 900): string[] => {
  const normalized = paragraph.trim();
  if (!normalized) return [];
  if (normalized.length <= maxLength) return [normalized];

  const sentences = normalized
    .split(/(?<=[.!?]["'”’)]?)\s+(?=[A-Z0-9“"'])/)
    .map((sentence) => sentence.trim())
    .filter(Boolean);

  if (sentences.length <= 1) {
    const fallbackChunks: string[] = [];
    let remaining = normalized;
    while (remaining.length > maxLength) {
      const splitAt = remaining.lastIndexOf(" ", maxLength);
      const safeSplit = splitAt > Math.floor(maxLength * 0.55) ? splitAt : maxLength;
      fallbackChunks.push(remaining.slice(0, safeSplit).trim());
      remaining = remaining.slice(safeSplit).trim();
    }
    if (remaining.length > 0) fallbackChunks.push(remaining);
    return fallbackChunks.filter(Boolean);
  }

  const chunks: string[] = [];
  let current = "";
  for (const sentence of sentences) {
    const candidate = current ? `${current} ${sentence}` : sentence;
    if (candidate.length > maxLength && current) {
      chunks.push(current);
      current = sentence;
    } else {
      current = candidate;
    }
  }
  if (current) chunks.push(current);
  if (chunks.length <= 1 && normalized.length > maxLength) {
    const fallbackChunks: string[] = [];
    let remaining = normalized;
    while (remaining.length > maxLength) {
      const splitAt = remaining.lastIndexOf(" ", maxLength);
      const safeSplit = splitAt > Math.floor(maxLength * 0.55) ? splitAt : maxLength;
      fallbackChunks.push(remaining.slice(0, safeSplit).trim());
      remaining = remaining.slice(safeSplit).trim();
    }
    if (remaining.length > 0) fallbackChunks.push(remaining);
    return fallbackChunks.filter(Boolean);
  }

  return chunks;
};

const enforceReadableParagraphFlow = (paragraphs: string[]): string[] => {
  let normalized = paragraphs
    .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
    .flatMap((paragraph) => paragraph.split(/\n{2,}/))
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0)
    .flatMap((paragraph) => splitLongParagraphForReadability(paragraph));

  let guard = 0;
  while (normalized.length < 3 && guard < 4) {
    const longestIndex = normalized.reduce((bestIdx, paragraph, idx, arr) => (
      paragraph.length > arr[bestIdx].length ? idx : bestIdx
    ), 0);
    const longest = normalized[longestIndex] ?? "";
    if (longest.length < 500) break;

    const splitChunks = splitLongParagraphForReadability(longest, Math.max(280, Math.floor(longest.length / 2)));
    if (splitChunks.length <= 1) break;

    normalized = [
      ...normalized.slice(0, longestIndex),
      ...splitChunks,
      ...normalized.slice(longestIndex + 1),
    ];
    guard += 1;
  }

  return normalized;
};

const buildDeterministicGroundingLead = (chapterIndex: number, locationProfiles: LocationProfilesResult): string => {
  const primary = locationProfiles.primary;
  const keyLocations = locationProfiles.keyLocations || [];
  const target = keyLocations.length > 0
    ? keyLocations[chapterIndex % keyLocations.length]
    : undefined;

  const locationName = target?.name || primary?.name || "the estate";
  const place = primary?.place ? ` in ${primary.place}` : "";
  const country = primary?.country ? `, ${primary.country}` : "";
  const weather = locationProfiles.atmosphere?.weather || "rain";
  const mood = locationProfiles.atmosphere?.mood || "tense";

  const smells = target?.sensoryDetails?.smells || [];
  const sounds = target?.sensoryDetails?.sounds || [];
  const tactile = target?.sensoryDetails?.tactile || [];

  const smell = (smells[0] || "old timber and damp stone").replace(/\.$/, "");
  const sound = (sounds[0] || "the sound of the wind in the corridor").replace(/\.$/, "");
  const touch = (tactile[0] || "the cold banister and rough wallpaper").replace(/\.$/, "");

  return sanitizeProseText(
    `At ${locationName}${place}${country}, the smell of ${smell} mixed with ${sound}, while ${weather.toLowerCase()} and ${touch} kept the atmosphere ${mood.toLowerCase()}.`
  );
};

const getGroundingSignals = (opening: string, anchors: string[]) => {
  const normalized = opening.toLowerCase();
  const hasAnchor = anchors.some((anchor) => normalized.includes(anchor));
  const sensoryCount = (normalized.match(/\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi) || []).length;
  const hasAtmosphere = /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i.test(normalized);
  return { hasAnchor, sensoryCount, hasAtmosphere };
};

const applyDeterministicProsePostProcessing = (
  prose: ProseGenerationResult,
  locationProfiles: LocationProfilesResult,
): ProseGenerationResult => {
  const anchors: string[] = [];
  if (locationProfiles.primary?.name) anchors.push(locationProfiles.primary.name.toLowerCase());
  (locationProfiles.keyLocations || []).forEach((loc) => {
    if (loc?.name) anchors.push(String(loc.name).toLowerCase());
  });

  return {
    ...prose,
    chapters: prose.chapters.map((chapter, index) => {
      const readableParagraphs = enforceReadableParagraphFlow(chapter.paragraphs || []);
      const opening = readableParagraphs.slice(0, 2).join(" ");
      const signals = getGroundingSignals(opening, anchors);

      const needsGroundingLead = !signals.hasAnchor || signals.sensoryCount < 2 || !signals.hasAtmosphere;
      const groundedParagraphs = needsGroundingLead
        ? [buildDeterministicGroundingLead(index, locationProfiles), ...readableParagraphs]
        : readableParagraphs;

      return {
        ...chapter,
        paragraphs: groundedParagraphs
          .map((paragraph) => sanitizeProseText(paragraph))
          .filter((paragraph) => paragraph.length > 0),
      };
    }),
  };
};

const sanitizeProseText = (value: unknown) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = text.normalize("NFC");
  for (const [pattern, replacement] of proseMojibakeReplacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/^Generated in scene batches\.?$/gim, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(illegalControlCharPattern, "")
    .replace(/\u00A0/g, " ")
    .replace(/\t/g, " ")
    .replace(/\r\n/g, "\n")
    // Dialogue punctuation normalization (Phase 3.2)
    // Straight quotes → curly quotes around dialogue
    .replace(/"([^"]*)"/g, "\u201C$1\u201D")
    // Straight apostrophes → curly apostrophes (contractions and possessives)
    .replace(/(\w)'(\w)/g, "$1\u2019$2")
    // Double-dash → em dash
    .replace(/--/g, "\u2014")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/\s+$/gm, "")
    .trim();
};

const chapterHeadingPrefixPattern = /^\s*chapter\s+\d+\s*:\s*/i;

const normalizeChapterTitle = (value: unknown) => {
  const sanitized = sanitizeProseText(value);
  let title = sanitized;
  let guard = 0;

  while (chapterHeadingPrefixPattern.test(title) && guard < 4) {
    title = title.replace(chapterHeadingPrefixPattern, "").trim();
    guard += 1;
  }

  return title.replace(/^[:\-\s]+/, "").trim();
};

const sanitizeProseResult = (prose: ProseGenerationResult): ProseGenerationResult => ({
  ...prose,
  note: prose.note ? sanitizeProseText(prose.note) || undefined : prose.note,
  chapters: prose.chapters.map((chapter, index) => ({
    ...chapter,
    title: normalizeChapterTitle(chapter.title) || `Chapter ${index + 1}`,
    summary: chapter.summary ? sanitizeProseText(chapter.summary) || undefined : chapter.summary,
    paragraphs: chapter.paragraphs
      .map((paragraph) => normalizeWrappedParagraphText(sanitizeProseText(paragraph)))
      .filter((p) => p.length > 0),
  })),
});

const detectIdentityAliasBreaks = (prose: ProseGenerationResult, cml: CaseData) => {
  const cmlCase = (cml as any)?.CASE ?? {};
  const culprits = Array.isArray(cmlCase?.culpability?.culprits)
    ? (cmlCase.culpability.culprits as string[])
    : [];

  if (culprits.length === 0) {
    return [] as string[];
  }

  const confessionOrArrest = /\b(confess(?:ed|ion)|admitted\s+it|under\s+arrest|arrested|revealed\s+the\s+culprit)\b/i;
  const roleOnlyAlias = /\b(the\s+(killer|murderer|culprit|criminal))\b/i;

  const issues: string[] = [];
  let revealChapter = -1;

  for (let index = 0; index < prose.chapters.length; index += 1) {
    const chapter = prose.chapters[index];
    const chapterText = chapter.paragraphs.join("\n");

    if (revealChapter < 0 && confessionOrArrest.test(chapterText)) {
      revealChapter = index;
      continue;
    }

    if (revealChapter >= 0 && index > revealChapter) {
      const mentionsCulpritByName = culprits.some((name) => chapterText.includes(name));
      if (roleOnlyAlias.test(chapterText) && !mentionsCulpritByName) {
        issues.push(`Chapter ${index + 1} uses role-only culprit aliases without stable culprit name references`);
      }
    }
  }

  return issues;
};

// ============================================================================
// Pre-prose outline quality gate
// ============================================================================

type OutlineCoverageIssue = {
  type: "missing_discriminating_test_scene" | "missing_suspect_closure_scene";
  message: string;
};

const OUTLINE_TEST_TERMS_RE = /\b(test|experiment|re-?enact|reenact|trap|demonstrat|verif|proof|examin|timing\s+test|constraint\s+proof)\b/i;
const OUTLINE_EXCLUSION_TERMS_RE = /\b(excluded?|eliminat|ruled\s+out|could\s*not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could|impossible\s+for|proves?\s+innocent)\b/i;
const OUTLINE_EVIDENCE_TERMS_RE = /\b(because|therefore|proof|evidence|measured|timed|observed|alibi|timeline|constraint|clue)\b/i;
const OUTLINE_ELIMINATION_TERMS_RE = /\b(cleared|ruled\s+out|eliminat|not\s+the\s+(culprit|killer|murderer)|innocent|alibi\s+holds|alibi\s+confirmed|could\s*not\s+have|excluded?)\b/i;

const evaluateOutlineCoverage = (
  narrative: NarrativeOutline,
  cml: CaseData,
): OutlineCoverageIssue[] => {
  const issues: OutlineCoverageIssue[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmlCase = (cml as any)?.CASE ?? {};
  const allScenes = (narrative.acts ?? []).flatMap((act) =>
    Array.isArray(act.scenes) ? act.scenes : [],
  );

  // --- Check 1: discriminating test scene ---
  const hasDiscriminatingTestScene = allScenes.some((scene) => {
    const blob = [
      scene.title ?? "",
      scene.purpose ?? "",
      scene.summary ?? "",
      scene.dramaticElements?.revelation ?? "",
      scene.dramaticElements?.tension ?? "",
    ].join(" ");
    return (
      OUTLINE_TEST_TERMS_RE.test(blob) &&
      OUTLINE_EXCLUSION_TERMS_RE.test(blob) &&
      OUTLINE_EVIDENCE_TERMS_RE.test(blob)
    );
  });

  // Looser fallback: any scene whose title/purpose explicitly mentions discriminating test concept
  const DISC_TEST_FALLBACK_RE = /discriminating|re-?enactment|crucial\s+test|decisive\s+experiment|trap\s+is\s+set|ruling\s+out/i;
  const hasTestMention = allScenes.some((scene) => {
    const blob = [scene.title ?? "", scene.purpose ?? "", scene.summary ?? ""].join(" ");
    return DISC_TEST_FALLBACK_RE.test(blob);
  });

  if (!hasDiscriminatingTestScene && !hasTestMention) {
    issues.push({
      type: "missing_discriminating_test_scene",
      message:
        "Outline has no scene whose summary/purpose contains discriminating test, re-enactment, or suspect-elimination language",
    });
  }

  // --- Check 2: suspect closure / elimination coverage ---
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const castRoster: any[] = Array.isArray(cmlCase.cast) ? cmlCase.cast : [];
  const culprits: string[] = Array.isArray(cmlCase.culpability?.culprits)
    ? (cmlCase.culpability.culprits as string[])
    : [];
  const suspects = castRoster
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .filter((c: any) => c.role === "suspect")
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .map((c: any) => (c.name ?? "").trim())
    .filter((name: string) => name.length > 0 && !culprits.includes(name));

  if (suspects.length > 0) {
    const allSceneText = allScenes
      .map((s) => [s.title, s.purpose, s.summary, s.dramaticElements?.revelation].join(" "))
      .join(" ");

    const hasAnyClosure =
      OUTLINE_ELIMINATION_TERMS_RE.test(allSceneText) && OUTLINE_EVIDENCE_TERMS_RE.test(allSceneText);

    if (!hasAnyClosure) {
      issues.push({
        type: "missing_suspect_closure_scene",
        message:
          "Outline has no scene with suspect elimination/closure language (cleared, ruled out, alibi confirmed, etc.)",
      });
    }
  }

  return issues;
};

const buildOutlineRepairGuardrails = (
  issues: OutlineCoverageIssue[],
  cml: CaseData,
): string[] => {
  const guardrails: string[] = [];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cmlCase = (cml as any)?.CASE ?? {};

  if (issues.some((i) => i.type === "missing_discriminating_test_scene")) {
    const discrimTest = cmlCase.discriminating_test;
    const method = discrimTest?.method ?? "constraint_proof";
    const design = discrimTest?.design ?? "";
    const designClause = design ? " (" + design + ")" : "";
    guardrails.push(
      "Include a dedicated discriminating test scene in late Act II or early Act III where the detective explicitly stages a " + method + designClause + " that rules out at least one suspect using on-page evidence. The scene summary MUST contain words like test/experiment/re-enactment AND ruled out/eliminated/excluded AND evidence/proof/because.",
    );
  }

  if (issues.some((i) => i.type === "missing_suspect_closure_scene")) {
    const culpritsList: string[] = cmlCase.culpability?.culprits ?? [];
    const culpritClause = culpritsList.length > 0 ? " (" + culpritsList.join(", ") + ")" : "";
    guardrails.push(
      "In Act III, include at least one scene where the detective explains why each non-culprit suspect is cleared with explicit elimination language (cleared, ruled out, alibi confirmed) and evidence references. The culprit" + culpritClause + " must be identified with a complete evidence chain.",
    );
  }

  return guardrails;
};

const buildNoveltyConstraints = (seedEntries: Array<{ filename: string; cml: CaseData }>) => {
  const titles = seedEntries
    .map((seed) => {
      const meta = (seed.cml as any)?.CASE?.meta ?? (seed.cml as any)?.meta ?? {};
      return meta?.title || seed.filename;
    })
    .filter((title): title is string => Boolean(title));

  const avoidancePatterns = seedEntries.flatMap((seed) => {
    const cmlCase = (seed.cml as any)?.CASE ?? {};
    const meta = cmlCase.meta ?? {};
    const crimeClass = meta.crime_class ?? {};
    const era = meta?.era?.decade ?? "";
    const location = meta?.setting?.location ?? "";
    const falseAssumption = cmlCase?.false_assumption?.statement ?? "";
    const discrimMethod = cmlCase?.discriminating_test?.method ?? "";
    const discrimDesign = cmlCase?.discriminating_test?.design ?? "";
    const crimeSubtype = crimeClass?.subtype ?? "";
    const axis = cmlCase?.false_assumption?.type ?? "";
    return [
      era && location ? `Era+location combo: ${era} / ${location}` : "",
      crimeSubtype ? `Crime method/subtype: ${crimeSubtype}` : "",
      axis ? `False assumption type: ${axis}` : "",
      falseAssumption ? `False assumption statement: ${falseAssumption}` : "",
      discrimMethod ? `Discriminating test method: ${discrimMethod}` : "",
      discrimDesign ? `Discriminating test design: ${discrimDesign}` : "",
    ].filter(Boolean);
  });

  const uniqueAvoidance = Array.from(new Set(avoidancePatterns)).slice(0, 12);

  return {
    divergeFrom: titles.slice(0, 8),
    areas: [
      "crime method + motive combination",
      "false assumption statement and justification",
      "discriminating test design and trigger",
      "era + location pairing",
      "culprit access path and opportunity channel",
      "constraint-space anchors and contradictions",
    ],
    avoidancePatterns: uniqueAvoidance,
  };
};

type ProseReadabilitySummary = {
  denseChapterCount: number;
  underParagraphCount: number;
  severeParagraphBlocks: number;
};

const evaluateProseReadability = (prose: ProseGenerationResult): ProseReadabilitySummary => {
  let denseChapterCount = 0;
  let underParagraphCount = 0;
  let severeParagraphBlocks = 0;

  prose.chapters.forEach((chapter) => {
    const paragraphs = chapter.paragraphs || [];
    if (paragraphs.length < 3) {
      underParagraphCount += 1;
      denseChapterCount += 1;
    }

    const overlong = paragraphs.filter((paragraph) => paragraph.length > 2400).length;
    if (overlong > 0) {
      severeParagraphBlocks += overlong;
      denseChapterCount += 1;
    }
  });

  return {
    denseChapterCount,
    underParagraphCount,
    severeParagraphBlocks,
  };
};

const evaluateSceneGroundingCoverage = (
  prose: ProseGenerationResult,
  locationProfiles: LocationProfilesResult,
) => {
  const knownAnchors = new Set<string>();
  if (locationProfiles.primary?.name) knownAnchors.add(locationProfiles.primary.name.toLowerCase());
  (locationProfiles.keyLocations || []).forEach((loc) => {
    if (loc?.name) knownAnchors.add(String(loc.name).toLowerCase());
  });

  const sensoryTerms = /\b(smell|scent|odor|fragrance|sound|echo|silence|whisper|creak|cold|warm|damp|rough|smooth|glow|shadow|flicker|dim)\b/gi;
  const atmosphereTerms = /\b(rain|wind|fog|storm|mist|thunder|evening|morning|night|dawn|dusk|lighting|season|weather)\b/i;

  let grounded = 0;
  prose.chapters.forEach((chapter) => {
    const opening = chapter.paragraphs.slice(0, 2).join(' ').toLowerCase();
    const hasAnchor = Array.from(knownAnchors).some((anchor) => opening.includes(anchor));
    const sensoryCount = (opening.match(sensoryTerms) || []).length;
    const hasAtmosphere = atmosphereTerms.test(opening);
    if (hasAnchor && sensoryCount >= 2 && hasAtmosphere) {
      grounded += 1;
    }
  });

  const coverage = prose.chapters.length > 0 ? grounded / prose.chapters.length : 0;
  return { grounded, total: prose.chapters.length, coverage };
};

const evaluateTemplateLeakage = (prose: ProseGenerationResult) => {
  const normalizedParagraphs = prose.chapters.flatMap((chapter) =>
    (chapter.paragraphs || [])
      .map((paragraph) => paragraph.replace(/\s+/g, ' ').trim().toLowerCase())
      .filter((paragraph) => paragraph.length >= 170),
  );

  const seen = new Set<string>();
  const duplicated = new Set<string>();
  normalizedParagraphs.forEach((paragraph) => {
    if (seen.has(paragraph)) duplicated.add(paragraph);
    seen.add(paragraph);
  });

  const scaffoldPattern = /at\s+the\s+[a-z][\s\S]{0,120}the\s+smell\s+of[\s\S]{20,300}?atmosphere\s+ripe\s+for\s+revelation\.?/i;
  const scaffoldCount = prose.chapters.reduce((count, chapter) => {
    const text = (chapter.paragraphs || []).join(' ');
    return count + (scaffoldPattern.test(text) ? 1 : 0);
  }, 0);

  return {
    duplicatedLongParagraphCount: duplicated.size,
    scaffoldCount,
    hasLeakage: duplicated.size > 0 || scaffoldCount > 0,
  };
};

/**
 * Checks atmospheric sensory variety across all chapters.
 * Flags phrases that appear in >40% of chapters to prevent sensory palette recycling.
 * Returns overused phrases and a summary flag.
 */
const evaluateSensoryVariety = (prose: ProseGenerationResult) => {
  const ATMOSPHERIC_TOKENS = [
    /smell of \w[\w\s]{2,30}/gi,
    /scent of \w[\w\s]{2,30}/gi,
    /air (?:thick|heavy|laden|filled|carrying) with \w[\w\s]{2,25}/gi,
    /(?:overcast|grey|gray) skies?/gi,
    /rain (?:tapping|pattering|drumming|falling)/gi,
    /tension[ ,](?:pressed|hung|filled|lay)/gi,
    /(?:polished wood|tobacco|mildew|damp|musty|smoky) (?:filled|hung|permeated|clung)/gi,
    /tick(?:ing)? (?:of (?:the )?clock|clock)/gi,
    /dim(?:ly)? (?:lit|illuminated)/gi,
  ];

  const totalChapters = prose.chapters.length;
  if (totalChapters < 3) return { overusedPhrases: [] as string[], hasExcessiveRepetition: false };

  const phraseToChapterCount: Map<string, number> = new Map();
  for (const chapter of prose.chapters) {
    const text = (chapter.paragraphs || []).join(' ');
    const matchedThisChapter = new Set<string>();
    for (const pattern of ATMOSPHERIC_TOKENS) {
      const matches = text.match(pattern) ?? [];
      for (const rawMatch of matches) {
        const normalised = rawMatch.toLowerCase().trim().slice(0, 60);
        if (!matchedThisChapter.has(normalised)) {
          matchedThisChapter.add(normalised);
          phraseToChapterCount.set(normalised, (phraseToChapterCount.get(normalised) ?? 0) + 1);
        }
      }
    }
  }

  const threshold = Math.floor(totalChapters * 0.4);
  const overused: string[] = [];
  for (const [phrase, count] of phraseToChapterCount.entries()) {
    if (count > threshold) overused.push(`"${phrase}" (${count}/${totalChapters} chapters)`);
  }

  return {
    overusedPhrases: overused,
    hasExcessiveRepetition: overused.length > 0,
  };
};

const evaluateTemporalConsistency = (
  prose: ProseGenerationResult,
  temporalContext?: TemporalContextResult,
) => {
  const month = temporalContext?.specificDate?.month?.toLowerCase();
  if (!month) {
    return { contradictions: 0, details: [] as string[] };
  }

  const monthToSeason: Record<string, 'spring' | 'summer' | 'autumn' | 'winter'> = {
    january: 'winter',
    february: 'winter',
    march: 'spring',
    april: 'spring',
    may: 'spring',
    june: 'summer',
    july: 'summer',
    august: 'summer',
    september: 'autumn',
    october: 'autumn',
    november: 'autumn',
    december: 'winter',
  };

  const seasonRegex: Record<'spring' | 'summer' | 'autumn' | 'winter', RegExp> = {
    spring: /\b(spring|vernal)\b/i,
    summer: /\b(summer|midsummer)\b/i,
    autumn: /\b(autumn|fall)\b/i,
    winter: /\b(winter|wintry)\b/i,
  };

  const expected = monthToSeason[month];
  if (!expected) {
    return { contradictions: 0, details: [] as string[] };
  }

  const details: string[] = [];
  prose.chapters.forEach((chapter, idx) => {
    const opening = (chapter.paragraphs || []).slice(0, 2).join(' ');
    const lowered = opening.toLowerCase();
    if (!new RegExp(`\\b${month}\\b`, 'i').test(lowered)) {
      return;
    }

    (Object.keys(seasonRegex) as Array<keyof typeof seasonRegex>).forEach((season) => {
      if (season !== expected && seasonRegex[season].test(lowered)) {
        details.push(`chapter ${idx + 1}: ${month} with ${season}`);
      }
    });
  });

  return { contradictions: details.length, details };
};

const placeholderRoleSurnamePattern = /\b(a|an)\s+(inspector|detective|constable|sergeant|captain|gentleman|lady|woman|man|doctor)\s+([A-Z][a-z]+(?:[-'’][A-Z][a-z]+)?)\b/g;
const placeholderNamedStandalonePattern = /\b(a woman [A-Z][a-z]+|a man [A-Z][a-z]+)\b/g;
const placeholderGenericRolePattern = /\b(a gentleman|an inspector|a detective|a constable|a sergeant|a captain|a doctor)\b/gi;

const evaluatePlaceholderLeakage = (prose: ProseGenerationResult) => {
  const joined = prose.chapters
    .map((chapter) => {
      const body = (chapter.paragraphs || []).join("\n");
      return `${chapter.title}\n${chapter.summary ?? ""}\n${body}`;
    })
    .join("\n\n");

  const roleSurnameMatches = Array.from(joined.matchAll(placeholderRoleSurnamePattern)).map((match) => match[0]);
  const namedStandaloneMatches = Array.from(joined.matchAll(placeholderNamedStandalonePattern)).map((match) => match[0]);
  const genericRoleMatches = joined.match(placeholderGenericRolePattern) || [];

  const uniqueRoleSurnameMatches = Array.from(new Set(roleSurnameMatches));

  return {
    roleSurnameCount: roleSurnameMatches.length,
    standaloneCount: namedStandaloneMatches.length,
    genericRoleCount: genericRoleMatches.length,
    examples: uniqueRoleSurnameMatches.slice(0, 5),
    severeLeakage: roleSurnameMatches.length > 0 || namedStandaloneMatches.length >= 2,
    hasLeakage: roleSurnameMatches.length > 0 || namedStandaloneMatches.length > 0 || genericRoleMatches.length >= 12,
  };
};

const evaluateChapterHeadingArtifacts = (prose: ProseGenerationResult) => {
  const offending = prose.chapters.filter((chapter) => chapterHeadingPrefixPattern.test(chapter.title || ""));
  return {
    duplicatedHeadingCount: offending.length,
    hasArtifacts: offending.length > 0,
  };
};

export interface MysteryGenerationProgress {
  stage: "setting" | "cast" | "background-context" | "hard_logic_devices" | "cml" | "clues" | "fairplay" | "narrative" | "profiles" | "location-profiles" | "temporal-context" | "prose" | "validation" | "novelty" | "novelty_math" | "complete";
  message: string;
  percentage: number; // 0-100
  timestamp: Date;
}

export interface MysteryGenerationResult {
  // Final outputs
  cml: CaseData;
  clues: ClueDistributionResult;
  fairPlayAudit: FairPlayAuditResult;
  narrative: NarrativeOutline;
  characterProfiles: CharacterProfilesResult;
  locationProfiles: LocationProfilesResult;
  temporalContext: TemporalContextResult;
  backgroundContext: BackgroundContextArtifact;
  hardLogicDevices: HardLogicDeviceResult;
  prose: ProseGenerationResult;
  noveltyAudit?: NoveltyAuditResult;
  validationReport: ValidationReport;
  scoringReport?: GenerationReport; // Optional for backward compatibility
  
  // Intermediate results (for debugging/review)
  setting: SettingRefinementResult;
  cast: CastDesignResult;
  
  // Metadata
  metadata: {
    runId: string;
    projectId?: string;
    totalCost: number;
    totalDurationMs: number;
    agentCosts: Record<string, number>;
    agentDurations: Record<string, number>;
    revisedByAgent4: boolean;
    revisionAttempts?: number;
  };
  
  // Status
  status: "success" | "warning" | "failure";
  warnings: string[];
  errors: string[];
}

const describeError = (error: unknown) => {
  if (error instanceof Error) {
    return error.message;
  }

  try {
    return JSON.stringify(error);
  } catch {
    return String(error);
  }
};

// ============================================================================
// Progress Callback
// ============================================================================

export type ProgressCallback = (progress: MysteryGenerationProgress) => void;

// ============================================================================
// Retry Helper
// ============================================================================

/**
 * Delay execution for specified milliseconds
 */
async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function appendRetryFeedback(base: string, retryFeedback?: string): string {
  if (!retryFeedback || retryFeedback.trim().length === 0) {
    return base;
  }

  const prefix = base.trim().length > 0 ? base : "";
  return `${prefix}${prefix ? "\n\n" : ""}Retry guidance:\n${retryFeedback}`;
}

function appendRetryFeedbackOptional(base: string | undefined, retryFeedback?: string): string | undefined {
  if (base === undefined) {
    return undefined;
  }
  return appendRetryFeedback(base, retryFeedback);
}

/**
 * Generic retry wrapper for agent execution with scoring
 * @param agentId - Agent identifier (e.g., 'agent1_setting')
 * @param phaseName - Human-readable phase name (e.g., 'Setting Refinement')
 * @param executeAgent - Function that executes the agent and returns result + cost
 * @param scoreOutput - Function that adapts output and runs scorer
 * @param retryManager - RetryManager instance
 * @param scoreAggregator - ScoreAggregator instance
 * @param scoringLogger - ScoringLogger instance
 * @param runId - Current run ID
 * @param projectId - Current project ID
 * @param warnings - Warnings array to append to
 * @returns Tuple of [finalResult, totalDuration, totalCost, retryCount]
 */
async function executeAgentWithRetry<T>(
  agentId: string,
  phaseName: string,
  executeAgent: (retryFeedback?: string) => Promise<{ result: T; cost: number }>,
  scoreOutput: (result: T) => Promise<{ adapted: any; score: PhaseScore }>,
  retryManager: RetryManager,
  scoreAggregator: ScoreAggregator,
  scoringLogger: ScoringLogger,
  runId: string,
  projectId: string,
  warnings: string[],
  onPhaseScored?: () => Promise<void>
): Promise<{ result: T; duration: number; cost: number; retryCount: number }> {
  let attempts = 0;
  let totalCost = 0;
  const startTime = Date.now();
  let retryFeedback: string | undefined;

  while (true) {
    const attemptStart = Date.now();
    
    // Execute agent
    const { result, cost } = await executeAgent(retryFeedback);
    totalCost += cost;
    
    const attemptDuration = Date.now() - attemptStart;

    // Score the output
    try {
      const { adapted, score } = await scoreOutput(result);

      // Add to aggregator (upsert so retries replace rather than duplicate)
      scoreAggregator.upsertPhaseScore(agentId, phaseName, score, attemptDuration, cost);

      // Log phase score
      scoringLogger.logPhaseScore(agentId, phaseName, score, attemptDuration, cost, runId, projectId);

      // Flush partial report to disk so UI can poll it
      if (onPhaseScored) {
        try { await onPhaseScored(); } catch { /* best-effort */ }
      }

      // Check if passed — use the aggregator's authoritative passesThreshold()
      // rather than score.passed (which uses the scorer's internal 60-point
      // threshold and ignores component minimums). This ensures retry decisions
      // are always consistent with what the final report records as passed/failed.
      const phasePassed = scoreAggregator.passesThreshold(score);
      if (phasePassed) {
        const totalDuration = Date.now() - startTime;
        if (attempts > 0) {
          warnings.push(`${phaseName}: ✓ Passed after ${attempts} retry(s) - ${score.grade} (${score.total}/100)`);
        }
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      // Failed - check if we can retry
      if (!retryManager.canRetry(agentId)) {
        if (retryManager.shouldAbortOnMaxRetries()) {
          throw new Error(
            `${phaseName} failed after ${attempts + 1} attempt(s) and all retries are exhausted. ` +
            `Aborting generation. Failure reason: ${score.failure_reason || `Score ${score.total}/100 (${score.grade}) below threshold`}`
          );
        }
        warnings.push(`${phaseName}: ✗ Failed after ${attempts + 1} attempt(s) - ${score.grade} (${score.total}/100) - Max retries exceeded`);
        const totalDuration = Date.now() - startTime;
        return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
      }

      // Build failure reason: prefer the scorer's own explanation, fall back to
      // a description of which component minimums were not met.
      const failedComponents = getFailedComponents(score);
      const effectiveFailureReason = score.failure_reason
        || (failedComponents.length > 0
            ? `Component minimums not met: ${failedComponents.join('; ')}`
            : `Score ${score.total}/100 (${score.grade}) below threshold`);

      // Record retry
      attempts++;
      retryManager.recordRetry(agentId, effectiveFailureReason, score.total);

      // Log retry attempt
      const backoffMs = retryManager.getBackoffDelay(agentId);
      const maxRetries = retryManager.getMaxRetries(agentId);
      scoringLogger.logRetryAttempt(agentId, phaseName, attempts, effectiveFailureReason, backoffMs, maxRetries, runId, projectId);

      retryFeedback = buildRetryFeedback(score, attempts);

      warnings.push(`${phaseName}: ↻ Retry ${attempts}/${maxRetries} - Score: ${score.total}/100 (${score.grade}), waiting ${backoffMs}ms...`);

      // Wait for backoff
      if (backoffMs > 0) {
        await delay(backoffMs);
      }
    } catch (scoringError) {
      // Scoring failed - log and return without retry
      scoringLogger.logScoringError(agentId, phaseName, scoringError, runId, projectId);
      warnings.push(`${phaseName}: Scoring failed - ${describeError(scoringError)} - continuing without retry`);
      const totalDuration = Date.now() - startTime;
      return { result, duration: totalDuration, cost: totalCost, retryCount: attempts };
    }
  }
}

// ============================================================================
// Main Orchestrator
// ============================================================================

export async function generateMystery(
  client: AzureOpenAIClient,
  inputs: MysteryGenerationInputs,
  onProgress?: ProgressCallback
): Promise<MysteryGenerationResult> {
  const startTime = Date.now();
  const runId = inputs.runId || `mystery-${Date.now()}`;
  const projectId = inputs.projectId;

  const agentCosts: Record<string, number> = {};
  const agentDurations: Record<string, number> = {};
  const warnings: string[] = [];
  const errors: string[] = [];

  let revisedByAgent4 = false;
  let revisionAttempts: number | undefined;

  // ========================================================================
  // Initialize Scoring System (optional via env var)
  // ========================================================================
  const enableScoring = String(process.env.ENABLE_SCORING || "false").toLowerCase() === "true";
  let scoreAggregator: ScoreAggregator | undefined;
  let retryManager: RetryManager | undefined;
  let reportRepository: FileReportRepository | undefined;
  let scoringLogger: ScoringLogger | undefined;

  if (enableScoring) {
    try {
      const retryConfigPath = join(WORKER_APP_ROOT, "config", "retry-limits.yaml");
      retryManager = new RetryManager(retryConfigPath);
      scoreAggregator = new ScoreAggregator({ mode: 'standard' }, retryManager);
      
      const resolvedReportsDir = join(WORKSPACE_ROOT, "apps", "api", "data", "reports");
      reportRepository = new FileReportRepository(resolvedReportsDir);
      
      const logsDir = join(WORKER_APP_ROOT, "logs");
      scoringLogger = new ScoringLogger(logsDir);
      
      warnings.push("Scoring system enabled - tracking quality metrics and retries");
    } catch (error) {
      warnings.push(`Scoring system initialization failed: ${describeError(error)} - continuing without scoring`);
    }
  }

  // Saves an in-progress partial report after each phase so the UI can poll it
  const savePartialReport = async () => {
    if (!scoreAggregator || !reportRepository) return;
    try {
      const partial = scoreAggregator.generateReport({
        story_id: runId,
        started_at: new Date(startTime),
        completed_at: new Date(),
        user_id: projectId,
      });
      (partial as any).in_progress = true;
      await reportRepository.save(partial);
    } catch { /* best-effort */ }
  };

  const reportProgress = (
    stage: MysteryGenerationProgress["stage"],
    message: string,
    percentage: number
  ) => {
    if (onProgress) {
      onProgress({ stage, message, percentage, timestamp: new Date() });
    }
  };

  try {
    const resolveLocationPreset = (preset?: string) => {
      switch ((preset || "").toLowerCase()) {
        case "countryhouse":
          return { location: "Country house estate", institution: "Manor house" };
        case "seasidehotel":
          return { location: "Seaside hotel", institution: "Hotel" };
        case "village":
          return { location: "Rural village", institution: "Village" };
        case "liner":
          return { location: "Ocean liner", institution: "Passenger liner" };
        case "theatre":
          return { location: "Theatre district", institution: "Theatre" };
        default:
          return { location: preset || "Unspecified Location", institution: "Estate" };
      }
    };

    const locationSpec = resolveLocationPreset(inputs.locationPreset);
    const initialHardLogicDirectives = deriveHardLogicDirectives(
      inputs.theme,
      inputs.primaryAxis,
      inputs.locationPreset,
    );
    const primaryAxis = normalizePrimaryAxis(inputs.primaryAxis);

    const seedEntries = await loadSeedCMLFiles(EXAMPLES_ROOT);
    const noveltyConstraints = buildNoveltyConstraints(seedEntries as Array<{ filename: string; cml: CaseData }>);

    // ========================================================================
    // Agent 1: Era & Setting Refiner
    // ========================================================================
    reportProgress("setting", "Refining era and setting...", 0);
    
    let setting: Awaited<ReturnType<typeof refineSetting>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      // Execute with retry logic based on scoring
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent1_setting",
        "Setting Refinement",
        async (retryFeedback?: string) => {
          const settingResult = await refineSetting(client, {
            decade: inputs.eraPreference || "1930s",
            location: locationSpec.location,
            institution: locationSpec.institution,
            tone: appendRetryFeedbackOptional(inputs.tone, retryFeedback),
            runId,
            projectId: projectId || "",
          });
          return { result: settingResult, cost: settingResult.cost };
        },
        async (settingResult) => {
          const scorer = new SettingRefinementScorer();
          const adapted = adaptSettingForScoring(settingResult.setting);
          const score = await scorer.score({}, adapted, {
            previous_phases: {},
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      
      setting = result;
      agentCosts["agent1_setting"] = cost;
      agentDurations["agent1_setting"] = duration;
    } else {
      // No scoring - execute once
      const settingStart = Date.now();
      setting = await refineSetting(client, {
        decade: inputs.eraPreference || "1930s",
        location: locationSpec.location,
        institution: locationSpec.institution,
        tone: inputs.tone,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent1_setting"] = setting.cost;
      agentDurations["agent1_setting"] = Date.now() - settingStart;
    }
    
    if (
      setting.setting.realism.anachronisms.length > 0 ||
      setting.setting.realism.implausibilities.length > 0
    ) {
      errors.push(
        `Agent 1: Setting realism issues detected (anachronisms=${setting.setting.realism.anachronisms.length}, implausibilities=${setting.setting.realism.implausibilities.length})`
      );
      throw new Error("Setting refinement still contains realism issues");
    }

    let settingSchemaValidation = validateArtifact("setting_refinement", setting.setting);
    if (!settingSchemaValidation.valid) {
      warnings.push("Setting refinement failed schema validation on first attempt; retrying setting generation with schema repair guardrails");
      // Note: refineSetting doesn't support qualityGuardrails parameter, so we rely on its internal retry with maxAttempts
      // The schema feedback isn't injected directly, but the retry may succeed on structural issues
      const settingSchemaRetryStart = Date.now();
      const retriedSetting = await refineSetting(client, {
        runId,
        projectId: projectId || "",
        decade: inputs.eraPreference || "1930s",
        location: locationSpec.location,
        institution: locationSpec.institution,
        tone: inputs.tone,
      }, 2); // Reduce attempts to 2 since this is already a retry
      agentCosts["agent1_setting"] = (agentCosts["agent1_setting"] || 0) + retriedSetting.cost;
      agentDurations["agent1_setting"] = (agentDurations["agent1_setting"] || 0) + (Date.now() - settingSchemaRetryStart);
      const retryValidation = validateArtifact("setting_refinement", retriedSetting.setting);
      if (!retryValidation.valid) {
        retryValidation.errors.forEach((error) => errors.push(`Setting schema failure: ${error}`));
        throw new Error("Setting artifact failed schema validation");
      }
      setting = retriedSetting;
      settingSchemaValidation = retryValidation;
      warnings.push("Setting schema-repair retry succeeded");
    }
    settingSchemaValidation.warnings.forEach((warning) => warnings.push(`Setting schema warning: ${warning}`));
    
    reportProgress("setting", "Era and setting refined", 12);

    // ========================================================================
    // Agent 2: Cast & Motive Designer
    // ========================================================================
    reportProgress("cast", "Designing cast and motives...", 12);
    
    let cast: Awaited<ReturnType<typeof designCast>>;

    // Generate cast names programmatically from curated historical pools so that
    // every run gets period-authentic, varied names without relying on the LLM's
    // training-data biases (which tend to recycle attractor names like "Inspector
    // Harlow" or "Mr. Vane" across runs).
    const totalCastSize = inputs.castNames?.length || (inputs.castSize || 6) + 1;
    const nameContext: NameGeneratorContext = {
      decade: parseInt(String(setting.setting.era.decade), 10) || undefined,
      locationType: setting.setting.location.type,
      locationDescription: setting.setting.location.description,
      socialContext: setting.setting.era.socialNorms.join(', '),
    };
    const effectiveCastNames = inputs.castNames ?? generateCastNames(runId, totalCastSize, nameContext);
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent2_cast",
        "Cast Design",
        async (retryFeedback?: string) => {
          const castResult = await designCast(client, {
            characterNames: effectiveCastNames,
            // castSize is the fallback when no names provided — not needed now
            // but kept for schema compatibility
            castSize: totalCastSize,
            setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
            crimeType: "Murder",
            tone: appendRetryFeedback(inputs.tone || inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
            socialContext: setting.setting.era.socialNorms.join(", "),
            detectiveType: inputs.detectiveType,
            runId,
            projectId: projectId || "",
          });
          return { result: castResult, cost: castResult.cost };
        },
        async (castResult) => {
          const scorer = new CastDesignScorer();
          const adapted = adaptCastForScoring(castResult.cast);
          const scorerInput = {
            cast_size: inputs.castNames?.length || (inputs.castSize || 6) + 1,
          };
          const score = await scorer.score(scorerInput, adapted, {
            previous_phases: { agent1_setting: setting.setting },
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      cast = result;
      agentCosts["agent2_cast"] = cost;
      agentDurations["agent2_cast"] = duration;
    } else {
      const castStart = Date.now();
      cast = await designCast(client, {
        characterNames: effectiveCastNames,
        castSize: totalCastSize,
        setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
        crimeType: "Murder",
        tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
        socialContext: setting.setting.era.socialNorms.join(", "),
        detectiveType: inputs.detectiveType,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2_cast"] = cast.cost;
      agentDurations["agent2_cast"] = Date.now() - castStart;
    }
    
    if (cast.cast.diversity.stereotypeCheck.length > 0) {
      errors.push(...cast.cast.diversity.stereotypeCheck.map((w: string) => `Agent 2: ${w}`));
      throw new Error("Cast design failed stereotype guardrails");
    }

    const castValidationPayload = {
      ...((cast.cast as unknown) as Record<string, unknown>),
      cost: cast.cost,
      latencyMs: cast.latencyMs,
    };
    let castSchemaValidation = validateArtifact("cast_design", castValidationPayload);
    if (!castSchemaValidation.valid) {
      warnings.push("Cast design failed schema validation on first attempt; retrying cast generation with schema repair guardrails");
      const schemaRepairGuardrails = [
        "Return a valid cast_design artifact that strictly matches required schema fields and types.",
        ...castSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
      ];
      const castSchemaRetryStart = Date.now();
      const retriedCast = await designCast(client, {
        characterNames: effectiveCastNames,
        castSize: totalCastSize,
        setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
        crimeType: "Murder",
        tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
        socialContext: setting.setting.era.socialNorms.join(", "),
        detectiveType: inputs.detectiveType,
        qualityGuardrails: schemaRepairGuardrails,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2_cast"] = (agentCosts["agent2_cast"] || 0) + retriedCast.cost;
      agentDurations["agent2_cast"] = (agentDurations["agent2_cast"] || 0) + (Date.now() - castSchemaRetryStart);
      const retriedPayload = {
        ...((retriedCast.cast as unknown) as Record<string, unknown>),
        cost: retriedCast.cost,
        latencyMs: retriedCast.latencyMs,
      };
      const retryValidation = validateArtifact("cast_design", retriedPayload);
      if (!retryValidation.valid) {
        retryValidation.errors.forEach((error) => errors.push(`Cast schema failure: ${error}`));
        throw new Error("Cast artifact failed schema validation");
      }
      cast = retriedCast;
      castSchemaValidation = retryValidation;
      warnings.push("Cast design schema-repair retry succeeded");
    }
    castSchemaValidation.warnings.forEach((warning) => warnings.push(`Cast schema warning: ${warning}`));
    
    reportProgress("cast", `Cast designed (${cast.cast.characters.length} characters)`, 25);
    reportProgress("background-context", "Generating background context...", 25);

    let backgroundContextResult: Awaited<ReturnType<typeof generateBackgroundContext>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent2e_background_context",
        "Background Context",
        async (retryFeedback?: string) => {
          const bgResult = await generateBackgroundContext(client, {
            settingRefinement: setting.setting,
            cast: cast.cast,
            theme: appendRetryFeedbackOptional(inputs.theme, retryFeedback),
            tone: appendRetryFeedback(inputs.tone || inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
            runId,
            projectId: projectId || "",
          });
          return { result: bgResult, cost: bgResult.cost };
        },
        async (bgResult) => {
          const scorer = new BackgroundContextScorer();
          const adapted = adaptBackgroundContextForScoring(bgResult.backgroundContext, setting.setting);
          const score = await scorer.score({}, adapted, {
            previous_phases: {
              agent1_setting: setting.setting,
              agent2_cast: cast.cast,
            },
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      backgroundContextResult = result;
      agentCosts["agent2e_background_context"] = cost;
      agentDurations["agent2e_background_context"] = duration;
    } else {
      const backgroundContextStart = Date.now();
      backgroundContextResult = await generateBackgroundContext(client, {
        settingRefinement: setting.setting,
        cast: cast.cast,
        theme: inputs.theme,
        tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2e_background_context"] = backgroundContextResult.cost;
      agentDurations["agent2e_background_context"] = Date.now() - backgroundContextStart;
    }

    const backgroundContext = backgroundContextResult.backgroundContext;
    const backgroundContextValidation = validateArtifact("background_context", backgroundContext);
    if (!backgroundContextValidation.valid) {
      backgroundContextValidation.errors.forEach((error) => errors.push(`Background context schema failure: ${error}`));
      throw new Error("Background context artifact failed schema validation");
    }
    backgroundContextValidation.warnings.forEach((warning) => warnings.push(`Background context schema warning: ${warning}`));

    reportProgress("background-context", "Background context generated", 28);

    // ========================================================================
    // Agent 3b: Hard-Logic Device Ideation (novel mechanism concepts)
    // ========================================================================
    reportProgress("hard_logic_devices", "Generating novel hard-logic device concepts...", 28);

    let hardLogicDevices: Awaited<ReturnType<typeof generateHardLogicDevices>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent3b_hard_logic_devices",
        "Hard Logic Devices",
        async (retryFeedback?: string) => {
          const hlResult = await generateHardLogicDevices(client, {
            runId,
            projectId: projectId || "",
            decade: setting.setting.era.decade,
            location: setting.setting.location.description,
            institution: setting.setting.location.type,
            tone: appendRetryFeedback(inputs.tone || inputs.narrativeStyle || "Golden Age Mystery", retryFeedback),
            theme: appendRetryFeedback(inputs.theme, retryFeedback),
            primaryAxis,
            mechanismFamilies: initialHardLogicDirectives.mechanismFamilies,
            hardLogicModes: initialHardLogicDirectives.hardLogicModes,
            difficultyMode: initialHardLogicDirectives.difficultyMode,
            noveltyConstraints,
          });
          return { result: hlResult, cost: hlResult.cost };
        },
        async (hlResult) => {
          const scorer = new HardLogicScorer();
          const adapted = adaptHardLogicForScoring(hlResult.devices);
          const score = await scorer.score({}, adapted, {
            previous_phases: {
              agent1_setting: setting.setting,
              agent2_cast: cast.cast,
              agent2e_background_context: backgroundContext,
            },
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      hardLogicDevices = result;
      agentCosts["agent3b_hard_logic_devices"] = cost;
      agentDurations["agent3b_hard_logic_devices"] = duration;
    } else {
      const hardLogicStart = Date.now();
      hardLogicDevices = await generateHardLogicDevices(client, {
        runId,
        projectId: projectId || "",
        decade: setting.setting.era.decade,
        location: setting.setting.location.description,
        institution: setting.setting.location.type,
        tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
        theme: inputs.theme,
        primaryAxis,
        mechanismFamilies: initialHardLogicDirectives.mechanismFamilies,
        hardLogicModes: initialHardLogicDirectives.hardLogicModes,
        difficultyMode: initialHardLogicDirectives.difficultyMode,
        noveltyConstraints,
      });
      agentCosts["agent3b_hard_logic_devices"] = hardLogicDevices.cost;
      agentDurations["agent3b_hard_logic_devices"] = Date.now() - hardLogicStart;
    }

    const hardLogicValidation = validateArtifact("hard_logic_devices", hardLogicDevices);
    if (!hardLogicValidation.valid) {
      hardLogicValidation.errors.forEach((error) => errors.push(`Agent 3b schema failure: ${error}`));
      throw new Error("Hard-logic device artifact failed schema validation");
    }
    hardLogicValidation.warnings.forEach((warning) => warnings.push(`Agent 3b schema warning: ${warning}`));

    const hardLogicDirectives = mergeHardLogicDirectives(
      initialHardLogicDirectives,
      hardLogicDevices.devices,
    );

    reportProgress("hard_logic_devices", `Generated ${hardLogicDevices.devices.length} novel hard-logic devices`, 31);

    // ========================================================================
    // Agent 3: CML Generator (+ Agent 4 auto-revision)
    // ========================================================================
    reportProgress("cml", "Generating mystery structure (CML) grounded in novel devices...", 31);
    
    const cmlStart = Date.now();
    let cmlResult = await generateCML(client, {
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
      weather: setting.setting.atmosphere.weather,
      socialStructure: setting.setting.era.socialNorms.join(", "),
      theme:
        inputs.theme && inputs.theme.trim().length > 0
          ? `${inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
          : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
      castSize: cast.cast.characters.length,
      castNames: cast.cast.characters.map((c: any) => c.name),
      castGenders: Object.fromEntries(cast.cast.characters.map((c: any) => [c.name, (c as any).gender ?? 'non-binary'])),
      detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
      victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
      complexityLevel: hardLogicDirectives.complexityLevel,
      mechanismFamilies: hardLogicDirectives.mechanismFamilies,
      primaryAxis,
      hardLogicModes: hardLogicDirectives.hardLogicModes,
      difficultyMode: hardLogicDirectives.difficultyMode,
      hardLogicDevices: hardLogicDevices.devices,
      backgroundContext,
      noveltyConstraints,
      runId,
      projectId: projectId || "",
    }, EXAMPLES_ROOT);
    
    agentCosts["agent3_cml"] = cmlResult.cost;
    agentDurations["agent3_cml"] = Date.now() - cmlStart;
    
    if (!cmlResult.validation.valid) {
      errors.push(`Agent 3: Generated invalid CML after all attempts`);
      throw new Error("CML generation failed validation");
    }
    
    if (cmlResult.revisedByAgent4) {
      revisedByAgent4 = true;
      revisionAttempts = cmlResult.revisionDetails?.attempts;
      warnings.push(
        `Agent 4: Auto-revision triggered after ${cmlResult.attempt} attempts (${revisionAttempts} revisions)`
      );
    }
    
    let cml = cmlResult.cml;
    reportProgress("cml", "Mystery structure generated and validated", 50);

    // Record CML generation quality score
    if (enableScoring && scoreAggregator) {
      const cmlRevisedByAgent4 = cmlResult.revisedByAgent4 ?? false;
      const cmlAttemptCount = cmlResult.attempt ?? 1;
      const cmlQualityScore = cmlRevisedByAgent4 ? 60 : 100;
      const cmlTotal = Math.round(100 * 0.5 + cmlQualityScore * 0.3 + 100 * 0.2);
      scoreAggregator.upsertPhaseScore(
        "agent3_cml",
        "CML Generation",
        {
          agent: "agent3-cml-generation",
          validation_score: 100,
          quality_score: cmlQualityScore,
          completeness_score: 100,
          consistency_score: 100,
          total: cmlTotal,
          grade: (cmlTotal >= 90 ? 'A' : cmlTotal >= 80 ? 'B' : cmlTotal >= 70 ? 'C' : cmlTotal >= 60 ? 'D' : 'F') as PhaseScore['grade'],
          passed: true,
          tests: [
            {
              name: "Schema validation",
              category: "validation" as const,
              passed: true,
              score: 100,
              weight: 2,
              message: `Valid after ${cmlAttemptCount} attempt(s)`,
            },
            {
              name: "Structural revision (Agent 4)",
              category: "quality" as const,
              passed: !cmlRevisedByAgent4,
              score: cmlQualityScore,
              weight: 1,
              message: cmlRevisedByAgent4
                ? `Required structural revision (${cmlResult.revisionDetails?.attempts ?? 1} revision(s))`
                : "No structural revision needed",
            },
          ],
        },
        agentDurations["agent3_cml"] ?? 0,
        agentCosts["agent3_cml"] ?? 0,
      );
      try { await savePartialReport(); } catch { /* best-effort */ }
    }

    // ========================================================================
    // Agent 8: Novelty Auditor (optional, early)
    // ========================================================================
    let noveltyAudit: NoveltyAuditResult | undefined;

    const similarityThreshold =
      typeof inputs.similarityThreshold === "number"
        ? inputs.similarityThreshold
        : Number(process.env.NOVELTY_SIMILARITY_THRESHOLD || 0.9);
    const shouldSkipNovelty = Boolean(inputs.skipNoveltyCheck) || similarityThreshold >= 1;

    if (!shouldSkipNovelty) {
      reportProgress("novelty", "Checking novelty vs seed patterns...", 52);

      const runNoveltyAudit = async (candidate: CaseData) => {
        const noveltyStart = Date.now();
        const result = await auditNovelty(client, {
          generatedCML: candidate,
          seedCMLs: seedEntries.map((s: any) => s.cml),
          similarityThreshold,
          runId,
          projectId: projectId || "",
        });
        agentCosts["agent8_novelty"] = result.cost;
        agentDurations["agent8_novelty"] = Date.now() - noveltyStart;
        return result;
      };

      noveltyAudit = await runNoveltyAudit(cml);

      if (noveltyAudit.status === "fail") {
        warnings.push("Agent 8: Novelty audit failed; regenerating CML with stronger divergence constraints");
        noveltyAudit.violations.forEach((v) => warnings.push(`  - ${v}`));

        const strongerConstraints = {
          ...noveltyConstraints,
          areas: Array.from(
            new Set([
              ...noveltyConstraints.areas,
              "culprit identity and motive structure",
              "constraint-space shape and contradictions",
              "discriminating test trigger conditions",
            ])
          ),
          avoidancePatterns: Array.from(
            new Set([
              ...noveltyConstraints.avoidancePatterns,
              ...noveltyAudit.violations,
              ...noveltyAudit.warnings,
              ...noveltyAudit.recommendations,
              `Most similar seed: ${noveltyAudit.mostSimilarSeed}`,
            ])
          ).slice(0, 16),
        };

        reportProgress("cml", "Regenerating CML with stronger novelty constraints...", 54);
        const cmlRetryStart = Date.now();
        cmlResult = await generateCML(client, {
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: inputs.narrativeStyle || "Golden Age Mystery",
          weather: setting.setting.atmosphere.weather,
          socialStructure: setting.setting.era.socialNorms.join(", "),
          theme:
            inputs.theme && inputs.theme.trim().length > 0
              ? `${inputs.theme} | hard-logic modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`
              : `Hard-logic mystery | modes: ${hardLogicDirectives.hardLogicModes.join(", ") || "standard"}`,
          castSize: cast.cast.characters.length,
          castNames: cast.cast.characters.map((c: any) => c.name),
          castGenders: Object.fromEntries(cast.cast.characters.map((c: any) => [c.name, (c as any).gender ?? 'non-binary'])),
          detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
          victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
          complexityLevel: hardLogicDirectives.complexityLevel,
          mechanismFamilies: hardLogicDirectives.mechanismFamilies,
          primaryAxis,
          hardLogicModes: hardLogicDirectives.hardLogicModes,
          difficultyMode: hardLogicDirectives.difficultyMode,
          hardLogicDevices: hardLogicDevices.devices,
          backgroundContext,
          noveltyConstraints: strongerConstraints,
          runId,
          projectId: projectId || "",
        }, EXAMPLES_ROOT);

        agentCosts["agent3_cml"] = cmlResult.cost;
        agentDurations["agent3_cml"] += Date.now() - cmlRetryStart;

        if (!cmlResult.validation.valid) {
          errors.push(`Agent 3: Generated invalid CML after novelty retry`);
          throw new Error("CML generation failed validation after novelty retry");
        }

        cml = cmlResult.cml;
        noveltyAudit = await runNoveltyAudit(cml);
      }

      if (noveltyAudit.status === "fail") {
        const hardFail = String(process.env.NOVELTY_HARD_FAIL || "false").toLowerCase() === "true";
        if (hardFail) {
          errors.push("Agent 8: Novelty audit FAILED - too similar to seed patterns");
          noveltyAudit.violations.forEach((v) => errors.push(`  - ${v}`));
          throw new Error("Novelty audit failed");
        }
        warnings.push("Agent 8: Novelty audit failed; continuing with warning");
        noveltyAudit.violations.forEach((v) => warnings.push(`  - ${v}`));
        noveltyAudit = { ...noveltyAudit, status: "warning" };
      } else if (noveltyAudit.status === "warning") {
        warnings.push("Agent 8: Moderate similarity detected");
        noveltyAudit.warnings.forEach((w) => warnings.push(`  - ${w}`));
      }

      reportProgress(
        "novelty_math",
        `Novelty math: weights plot 0.30, character 0.25, setting 0.15, solution 0.25, structural 0.05 | threshold ${similarityThreshold.toFixed(2)} | most similar ${noveltyAudit.mostSimilarSeed} (${noveltyAudit.highestSimilarity.toFixed(2)})`,
        57
      );

      reportProgress("novelty", `Novelty check: ${noveltyAudit.status}`, 58);
    } else {
      reportProgress(
        "novelty",
        similarityThreshold >= 1 ? "Novelty check skipped (threshold >= 1.0)" : "Novelty check skipped",
        58
      );
    }

    // Record novelty audit phase score
    if (enableScoring && scoreAggregator) {
      if (noveltyAudit) {
        const highestSim = noveltyAudit.highestSimilarity ?? 0;
        const noveltyStatus = noveltyAudit.status;
        const noveltyTotal = noveltyStatus === "pass"
          ? Math.max(80, Math.round((1 - highestSim) * 100))
          : noveltyStatus === "warning" ? 70 : 45;
        const noveltyViolationTests: TestResult[] = noveltyAudit.violations.map((v) => ({
          name: "Novelty violation",
          category: "quality" as const,
          passed: false,
          score: 0,
          weight: 0.5,
          message: v,
        }));
        scoreAggregator.upsertPhaseScore(
          "agent8_novelty",
          "Novelty Audit",
          {
            agent: "agent8-novelty-audit",
            validation_score: Math.round((1 - highestSim) * 100),
            quality_score: noveltyAudit.violations.length === 0 ? 100 : Math.max(0, 100 - noveltyAudit.violations.length * 20),
            completeness_score: 100,
            consistency_score: 100,
            total: noveltyTotal,
            grade: (noveltyTotal >= 90 ? 'A' : noveltyTotal >= 80 ? 'B' : noveltyTotal >= 70 ? 'C' : noveltyTotal >= 60 ? 'D' : 'F') as PhaseScore['grade'],
            passed: noveltyStatus !== "fail",
            failure_reason: noveltyStatus === "fail"
              ? `Too similar to seed patterns (${Math.round(highestSim * 100)}% match with "${noveltyAudit.mostSimilarSeed}")`
              : undefined,
            tests: [
              {
                name: "Similarity below threshold",
                category: "validation" as const,
                passed: noveltyStatus !== "fail",
                score: Math.round((1 - highestSim) * 100),
                weight: 2,
                message: `${Math.round(highestSim * 100)}% similar to "${noveltyAudit.mostSimilarSeed}" — ${noveltyStatus}`,
              },
              ...noveltyViolationTests,
            ],
          },
          agentDurations["agent8_novelty"] ?? 0,
          agentCosts["agent8_novelty"] ?? 0,
        );
      } else {
        // Novelty check skipped
        scoreAggregator.upsertPhaseScore(
          "agent8_novelty",
          "Novelty Audit",
          {
            agent: "agent8-novelty-audit",
            validation_score: 100,
            quality_score: 100,
            completeness_score: 100,
            consistency_score: 100,
            total: 100,
            grade: 'A' as PhaseScore['grade'],
            passed: true,
            tests: [
              {
                name: "Novelty check",
                category: "validation" as const,
                passed: true,
                score: 100,
                weight: 1,
                message: "Skipped (threshold ≥ 1.0 or skipNoveltyCheck set)",
              },
            ],
          },
          0,
          0,
        );
      }
      try { await savePartialReport(); } catch { /* best-effort */ }
    }

    // ========================================================================
    // Agent 5: Clue Distribution
    // ========================================================================
    reportProgress("clues", "Extracting and organizing clues...", 50);
    
    const cluesStart = Date.now();
    let clues = await extractClues(client, {
      cml,
      clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
      redHerringBudget: 2, // Standard 2 red herrings
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent5_clues"] = clues.cost;
    agentDurations["agent5_clues"] = Date.now() - cluesStart;
    
    reportProgress("clues", `${clues.clues.length} clues distributed`, 62);

    const clueGuardrails = applyClueGuardrails(cml, clues);
    if (clueGuardrails.fixes.length > 0) {
      clueGuardrails.fixes.forEach((fix) => warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
    }

    if (clueGuardrails.hasCriticalIssues) {
      warnings.push("Agent 5: Deterministic clue guardrails found critical issues; regenerating clues");
      clueGuardrails.issues.forEach((issue) => warnings.push(`  - [${issue.severity}] ${issue.message}`));

      const retryCluesStart = Date.now();
      clues = await extractClues(client, {
        cml,
        clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
        redHerringBudget: 2,
        fairPlayFeedback: {
          overallStatus: "fail",
          violations: clueGuardrails.issues
            .filter((issue) => issue.severity === "critical")
            .map((issue) => ({
              severity: "critical" as const,
              rule: "Deterministic Guardrail",
              description: issue.message,
              suggestion: "Regenerate clues so all essential clues are visible before the discriminating test and avoid detective-only information",
            })),
          warnings: clueGuardrails.issues
            .filter((issue) => issue.severity !== "critical")
            .map((issue) => issue.message),
          recommendations: [
            "Move essential clues to early/mid placement",
            "Avoid private/detective-only clue phrasing",
            "Ensure clue IDs are unique and timeline is balanced",
          ],
        },
        runId,
        projectId: projectId || "",
      });

      agentCosts["agent5_clues"] = clues.cost;
      agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);

      const secondGuardrailPass = applyClueGuardrails(cml, clues);
      if (secondGuardrailPass.fixes.length > 0) {
        secondGuardrailPass.fixes.forEach((fix) => warnings.push(`Agent 5: Guardrail auto-fix - ${fix}`));
      }
      if (secondGuardrailPass.hasCriticalIssues) {
        secondGuardrailPass.issues.forEach((issue) => errors.push(`Agent 5 guardrail failure: ${issue.message}`));
        throw new Error("Clue generation failed deterministic fair-play guardrails");
      }
    }

    // ========================================================================
    // WP4: Inference Path Coverage Gate
    // ========================================================================
    const coverageResult = checkInferencePathCoverage(cml, clues);
    const contradictionIssues = checkContradictionPairs(cml, clues);
    const falseAssumptionIssues = checkFalseAssumptionContradiction(cml, clues);
    const discrimTestIssues = checkDiscriminatingTestReachability(cml, clues);
    const eliminationIssues = checkSuspectElimination(cml, clues);

    const allCoverageIssues = [
      ...coverageResult.issues,
      ...contradictionIssues,
      ...falseAssumptionIssues,
      ...discrimTestIssues,
      ...eliminationIssues,
    ];

    allCoverageIssues.forEach(issue => {
      warnings.push("Inference coverage: [" + issue.severity + "] " + issue.message);
    });

    if (coverageResult.hasCriticalGaps || 
        falseAssumptionIssues.some(i => i.severity === "critical") ||
        discrimTestIssues.some(i => i.severity === "critical")) {
      
      warnings.push("Inference coverage gate: critical gaps found; regenerating clues with coverage feedback");
      
      const coverageFeedback = {
        overallStatus: "fail" as const,
        violations: allCoverageIssues
          .filter(i => i.severity === "critical")
          .map(i => ({
            severity: "critical" as const,
            rule: "Inference Path Coverage",
            description: i.message,
            suggestion: "Ensure every inference step has at least one clue that makes its observation reader-visible. Map each clue to a specific step via supportsInferenceStep.",
          })),
        warnings: allCoverageIssues
          .filter(i => i.severity === "warning")
          .map(i => i.message),
        recommendations: [
          "Every inference step needs at least one observation clue and one contradiction clue",
          "Set supportsInferenceStep on every essential clue",
          "Include at least one clue that explicitly contradicts the false assumption",
          "Uncovered steps: " + coverageResult.uncoveredSteps.join(", "),
        ],
      };

      reportProgress("clues", "Regenerating clues to address coverage gaps...", 58);
      const coverageRetryStart = Date.now();
      clues = await extractClues(client, {
        cml,
        clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
        redHerringBudget: 2,
        fairPlayFeedback: coverageFeedback,
        runId,
        projectId: projectId || "",
      });

      agentCosts["agent5_clues"] = (agentCosts["agent5_clues"] || 0) + clues.cost;
      agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - coverageRetryStart);

      const postCoverageGuardrails = applyClueGuardrails(cml, clues);
      if (postCoverageGuardrails.fixes.length > 0) {
        postCoverageGuardrails.fixes.forEach(fix => warnings.push("Post-coverage guardrail auto-fix: " + fix));
      }
    }

    // Record clue distribution phase score
    if (enableScoring && scoreAggregator) {
      const guardrailTriggered = clueGuardrails.hasCriticalIssues;
      const coverageGapsFound = coverageResult.hasCriticalGaps;
      const clueCount = clues.clues.length;
      const clueCountScore = clueCount >= 8 ? 100 : Math.round((clueCount / 8) * 100);
      const guardrailScore = guardrailTriggered ? 75 : 100;
      const coverageScore = coverageGapsFound ? 75 : 100;
      const clueValidation = Math.round((guardrailScore + coverageScore) / 2);
      const clueTotal = Math.round(clueValidation * 0.5 + clueCountScore * 0.3 + 100 * 0.2);
      scoreAggregator.upsertPhaseScore(
        "agent5_clues",
        "Clue Distribution",
        {
          agent: "agent5-clue-distribution",
          validation_score: clueValidation,
          quality_score: 100,
          completeness_score: clueCountScore,
          consistency_score: 100,
          total: clueTotal,
          grade: (clueTotal >= 90 ? 'A' : clueTotal >= 80 ? 'B' : clueTotal >= 70 ? 'C' : clueTotal >= 60 ? 'D' : 'F') as PhaseScore['grade'],
          passed: clueTotal >= 75,
          tests: [
            {
              name: "Clue count",
              category: "completeness" as const,
              passed: clueCount >= 8,
              score: clueCountScore,
              weight: 1.5,
              message: `${clueCount} clues distributed`,
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
                ? `Coverage gaps found and addressed (${allCoverageIssues.length} issue(s))`
                : `Full inference coverage (${allCoverageIssues.length} minor issues)`,
            },
          ],
        },
        agentDurations["agent5_clues"] ?? 0,
        agentCosts["agent5_clues"] ?? 0,
      );
      try { await savePartialReport(); } catch { /* best-effort */ }
    }

    // ========================================================================
    // Agent 6: Fair Play Auditor
    // ========================================================================
    reportProgress("fairplay", "Auditing fair play compliance...", 62);
    
    let fairPlayAudit: FairPlayAuditResult | null = null;
    let fairPlayAttempt = 0;
    const fairPlayStart = Date.now();

    while (fairPlayAttempt < 2) {
      fairPlayAttempt += 1;
      fairPlayAudit = await auditFairPlay(client, {
        caseData: cml,
        clues: clues,
        runId,
        projectId: projectId || "",
      });

      if (fairPlayAudit.overallStatus === "pass") {
        break;
      }

      if (fairPlayAttempt < 2) {
        warnings.push(
          `Agent 6: Fair play audit ${fairPlayAudit.overallStatus}; regenerating clues to address feedback (attempt ${
            fairPlayAttempt + 1
          } of 2)`
        );

        reportProgress("clues", "Regenerating clues to address fair play feedback...", 60);
        const retryCluesStart = Date.now();
        clues = await extractClues(client, {
          cml,
          clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
          redHerringBudget: 2,
          fairPlayFeedback: {
            overallStatus: fairPlayAudit.overallStatus,
            violations: fairPlayAudit.violations,
            warnings: fairPlayAudit.warnings,
            recommendations: fairPlayAudit.recommendations,
          },
          runId,
          projectId: projectId || "",
        });

        agentCosts["agent5_clues"] = clues.cost;
        agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - retryCluesStart);
      }
    }

    if (!fairPlayAudit) {
      throw new Error("Fair play audit failed to produce a report");
    }

    agentCosts["agent6_fairplay"] = fairPlayAudit.cost;
    agentDurations["agent6_fairplay"] = Date.now() - fairPlayStart;

    // FP-9: "Information Parity" is a clue-phrasing issue; CML revision cannot fix it — handle via Agent 5 clue retry only
    const criticalFairPlayRules = new Set(["Clue Visibility", "No Withholding", "Logical Deducibility"]);
    // FP-2: let so it can be recomputed after each fairPlayAudit reassignment
    let hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
      (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
    );
    // FP-3: outer fpStatus/fpValidation removed — inner copies inside recordFairPlayScore are the live ones
    // FP-4: hasZeroScoreViolation removed — was never read

    if (fairPlayAudit.overallStatus === "fail") {
      if (hasCriticalFairPlayFailure) {
        warnings.push("Agent 6: Fair play audit failed on critical rules after clue regeneration; continuing with warnings");
        fairPlayAudit.violations.forEach((v) => warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`));
      } else {
        warnings.push("Agent 6: Fair play audit FAILED after clue regeneration");
        // FP-6: moved inside else — critical path already logs violations above; avoid double-logging
        fairPlayAudit.violations.forEach((v) => {
          warnings.push(`  - [${v.severity}] ${v.description}`);
        });
      }
    } else if (fairPlayAudit.overallStatus === "needs-revision") {
      if (hasCriticalFairPlayFailure) {
        warnings.push("Agent 6: Fair play needs revision with critical issues; continuing with warnings");
        fairPlayAudit.violations.forEach((v) => warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`));
      } else {
        warnings.push("Agent 6: Fair play needs minor revisions after clue regeneration");
      }
      fairPlayAudit.warnings.forEach((w) => warnings.push(`  - ${w}`));
    }

    reportProgress("fairplay", `Fair play audit: ${fairPlayAudit.overallStatus}`, 75);

    // FP-1: extracted as async closure so it can be called after each fairPlayAudit reassignment
    const recordFairPlayScore = async () => {
      if (!enableScoring || !scoreAggregator || !fairPlayAudit) return;
      const fpStatus = fairPlayAudit.overallStatus;
      const fpValidation = fpStatus === "pass" ? 100 : fpStatus === "needs-revision" ? 70 : 45;
      scoreAggregator.upsertPhaseScore(
        "agent6_fairplay",
        "Fair-play Audit",
        {
          agent: "agent6-fair-play-audit",
          validation_score: fpValidation,
          quality_score: 100,
          completeness_score: 100,
          consistency_score: 100,
          total: fpValidation,
          grade: (fpValidation >= 90 ? 'A' : fpValidation >= 80 ? 'B' : fpValidation >= 70 ? 'C' : fpValidation >= 60 ? 'D' : 'F') as PhaseScore['grade'],
          passed: fpValidation >= 75, // FP-5: needs-revision scores 70 which is below the 75 pass threshold
          failure_reason: fpStatus === "fail"
            ? `Fair play audit failed (${fairPlayAudit.violations.length} violation(s))`
            : undefined,
          tests: [
            {
              name: "Overall fair play status",
              category: "validation" as const,
              passed: fpStatus === "pass",
              score: fpValidation,
              weight: 2,
              message: `Status: ${fpStatus}${fairPlayAudit.violations.length > 0 ? ` (${fairPlayAudit.violations.length} violation(s))` : ""}`,
            },
            ...fairPlayAudit.violations.map((v) => ({
              name: v.rule || "Fair play rule",
              category: "validation" as const,
              passed: false,
              score: v.severity === "critical" ? 0 : 50,
              weight: v.severity === "critical" ? 1.5 : 0.5,
              message: v.description,
              severity: v.severity as TestResult['severity'],
            })),
          ],
        },
        agentDurations["agent6_fairplay"] ?? 0,
        agentCosts["agent6_fairplay"] ?? 0,
      );
      try { await savePartialReport(); } catch { /* best-effort */ }
    };
    await recordFairPlayScore();

    // ========================================================================
    // WP5B: Blind Reader Simulation
    // ========================================================================
    const caseBlockForBlind = (cml as any)?.CASE ?? cml;
    const castNamesForBlind = (caseBlockForBlind?.cast ?? []).map((c: any) => c.name).filter(Boolean);
    const falseAssumptionStatement = caseBlockForBlind?.false_assumption?.statement || "";
    const actualCulpritName = caseBlockForBlind?.culpability?.culprits?.[0] || "";

    if (castNamesForBlind.length > 0 && falseAssumptionStatement && actualCulpritName) {
      reportProgress("fairplay", "Running blind reader simulation...", 73);
      
      const blindResult = await blindReaderSimulation(
        client, clues, falseAssumptionStatement, castNamesForBlind,
        { runId, projectId: projectId || "" }
      );

      agentCosts["agent6_blind_reader"] = blindResult.cost;
      agentDurations["agent6_blind_reader"] = blindResult.durationMs;

      const readerGotItRight = blindResult.suspectedCulprit.toLowerCase().includes(actualCulpritName.toLowerCase()) ||
        actualCulpritName.toLowerCase().includes(blindResult.suspectedCulprit.toLowerCase());

      if (readerGotItRight && (blindResult.confidenceLevel === "certain" || blindResult.confidenceLevel === "likely")) {
        reportProgress("fairplay", "Blind reader simulation: PASS", 74);
      } else {
        warnings.push(
          "Blind reader simulation: reader suspected \"" + blindResult.suspectedCulprit +
          "\" (confidence: " + blindResult.confidenceLevel + "), actual culprit is \"" + actualCulpritName + "\""
        );
        if (blindResult.missingInformation.length > 0) {
          warnings.push("Blind reader missing info: " + blindResult.missingInformation.join("; "));
        }

        if (blindResult.confidenceLevel === "impossible" || !readerGotItRight) {
          warnings.push(
            "CRITICAL: Blind reader cannot identify culprit. " +
            "The clue set does not contain enough evidence for deduction."
          );
          
          reportProgress("clues", "Regenerating clues based on blind reader feedback...", 60);
          const blindRetryStart = Date.now();
          clues = await extractClues(client, {
            cml,
            clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
            redHerringBudget: 2,
            fairPlayFeedback: {
              overallStatus: "fail",
              violations: [{
                severity: "critical" as const,
                rule: "Information Parity",
                description: "A blind reader using only the clues suspected \"" + blindResult.suspectedCulprit +
                              "\" instead of the actual culprit \"" + actualCulpritName + "\". Reasoning: " + blindResult.reasoning,
                suggestion: "Add clues that make the following deducible: " + blindResult.missingInformation.join("; "),
              }],
              warnings: [],
              recommendations: blindResult.missingInformation.map((info: string) => "Provide evidence for: " + info),
            },
            runId,
            projectId: projectId || "",
          });

          agentCosts["agent5_clues"] = (agentCosts["agent5_clues"] || 0) + clues.cost;
          agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - blindRetryStart);
          applyClueGuardrails(cml, clues);
          // FP-7: re-audit after blind-reader clue regen so WP6B gating and abort gate see fresh violations
          const blindReAuditStart = Date.now();
          fairPlayAudit = await auditFairPlay(client, { caseData: cml, clues, runId, projectId: projectId || "" });
          agentCosts["agent6_fairplay"] = (agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
          agentDurations["agent6_fairplay"] = (agentDurations["agent6_fairplay"] || 0) + (Date.now() - blindReAuditStart);
          hasCriticalFairPlayFailure = fairPlayAudit.violations.some( // FP-2: recompute
            (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
          );
          await recordFairPlayScore(); // FP-1: update score report
        }
      }
    }

    // ========================================================================
    // WP6B + WP8: CML Retry on Structural Failure + Hard Stop
    // ========================================================================
    const MAX_FAIR_PLAY_RETRY_COST = 0.15;
    let fairPlayRetryCost = 0;

    if (fairPlayAudit!.overallStatus === "fail" && hasCriticalFairPlayFailure) {
      const failureClass = classifyFairPlayFailure(coverageResult, fairPlayAudit, cml);
      
      if ((failureClass === "inference_path_abstract" || failureClass === "constraint_space_insufficient") &&
          fairPlayRetryCost <= MAX_FAIR_PLAY_RETRY_COST) {
        warnings.push(
          "Fair play failure classified as \"" + failureClass + "\" — retrying CML generation (Agent 4) " +
          "to fix upstream structural problems"
        );
        
        const revisionInstructions = failureClass === "inference_path_abstract"
          ? "The inference_path steps are too abstract. Rewrite each step with: " +
            "(1) a concrete, scene-level observation the reader can witness, " +
            "(2) a correction that follows from stated evidence, " +
            "(3) an effect that names the suspect eliminated, " +
            "(4) required_evidence listing 2-4 specific facts."
          : "The constraint_space is too sparse. Add: " +
            "(1) at least one temporal contradiction, " +
            "(2) at least 2 access constraints, " +
            "(3) at least 2 physical traces. " +
            "Each constraint must be concrete enough to become a reader-visible clue.";

        reportProgress("cml", "Revising CML to fix structural fair play issues...", 55);
        const revisionStart = Date.now();

        // Build revision inputs matching the RevisionInputs type
        const cmlYaml = typeof cml === "string" ? cml : JSON.stringify(cml, null, 2);
        const revisionPrompt = buildCMLPrompt({
          decade: setting.setting.era.decade,
          location: setting.setting.location.description,
          institution: setting.setting.location.type,
          tone: inputs.tone || "Golden Age Mystery",
          weather: setting.setting.atmosphere.weather,
          socialStructure: setting.setting.era.socialNorms.join(", "),
          theme: inputs.theme || "mystery",
          castSize: cast.cast.characters.length,
          castNames: cast.cast.characters.map((c: any) => c.name),
          detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
          victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
          complexityLevel: hardLogicDirectives.complexityLevel,
          mechanismFamilies: hardLogicDirectives.mechanismFamilies,
          primaryAxis,
          hardLogicModes: hardLogicDirectives.hardLogicModes,
          difficultyMode: hardLogicDirectives.difficultyMode,
          hardLogicDevices: hardLogicDevices.devices,
          backgroundContext,
          noveltyConstraints,
          runId,
          projectId: projectId || "",
        });
        
        const revisedResult = await reviseCml(client, {
          originalPrompt: { system: revisionPrompt.system, developer: revisionPrompt.developer || "", user: revisionPrompt.user },
          invalidCml: cmlYaml,
          validationErrors: [revisionInstructions],
          attempt: 1,
          runId,
          projectId: projectId || "",
        });

        agentCosts["agent4_fairplay_revision"] = revisedResult.cost;
        agentDurations["agent4_fairplay_revision"] = Date.now() - revisionStart;
        fairPlayRetryCost += revisedResult.cost;

        const revisedSteps = ((revisedResult.cml as any)?.CASE ?? revisedResult.cml)?.inference_path?.steps ?? [];
        if (revisedSteps.length >= 3) {
          cml = revisedResult.cml as CaseData;
          warnings.push("CML revised — re-running clue extraction and fair play audit");

          const reCluesStart = Date.now();
          clues = await extractClues(client, {
            cml,
            clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
            redHerringBudget: 2,
            runId,
            projectId: projectId || "",
          });
          agentCosts["agent5_clues"] = (agentCosts["agent5_clues"] || 0) + clues.cost;
          agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - reCluesStart);
          fairPlayRetryCost += clues.cost;
          applyClueGuardrails(cml, clues);

          const reAuditStart = Date.now();
          fairPlayAudit = await auditFairPlay(client, {
            caseData: cml,
            clues,
            runId,
            projectId: projectId || "",
          });
          agentCosts["agent6_fairplay"] = (agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
          agentDurations["agent6_fairplay"] = (agentDurations["agent6_fairplay"] || 0) + (Date.now() - reAuditStart);
          fairPlayRetryCost += fairPlayAudit.cost;
          hasCriticalFairPlayFailure = fairPlayAudit.violations.some( // FP-2: recompute after CML revision re-audit
            (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
          );
          await recordFairPlayScore(); // FP-1: update score report with post-revision audit result
        }
      } else if (failureClass === "clue_only" && fairPlayRetryCost <= MAX_FAIR_PLAY_RETRY_COST) {
        // "clue_only": CML structure is sound (inference path concrete, constraint space
        // adequate, no coverage gaps). The violation is in clue phrasing / selection
        // (typically Information Parity or Solution Uniqueness). Run one more targeted
        // clue regeneration with the exact violation suggestions before the hard stop.
        warnings.push(
          "Fair play failure classified as \"clue_only\" — CML structure is sound; " +
          "regenerating clues with targeted per-violation feedback (attempt 3 of 3)"
        );

        reportProgress("clues", "Regenerating clues to address fair play feedback (final attempt)...", 63);
        const finalClueRetryStart = Date.now();
        clues = await extractClues(client, {
          cml,
          clueDensity: inputs.targetLength === "short" ? "minimal" : inputs.targetLength === "long" ? "dense" : "moderate",
          redHerringBudget: 2,
          fairPlayFeedback: {
            overallStatus: fairPlayAudit!.overallStatus,
            violations: fairPlayAudit!.violations,
            warnings: fairPlayAudit!.warnings,
            recommendations: fairPlayAudit!.recommendations,
          },
          runId,
          projectId: projectId || "",
        });
        agentCosts["agent5_clues"] = (agentCosts["agent5_clues"] || 0) + clues.cost;
        agentDurations["agent5_clues"] = (agentDurations["agent5_clues"] || 0) + (Date.now() - finalClueRetryStart);
        fairPlayRetryCost += clues.cost;
        applyClueGuardrails(cml, clues);

        const finalAuditStart = Date.now();
        fairPlayAudit = await auditFairPlay(client, {
          caseData: cml,
          clues,
          runId,
          projectId: projectId || "",
        });
        agentCosts["agent6_fairplay"] = (agentCosts["agent6_fairplay"] || 0) + fairPlayAudit.cost;
        agentDurations["agent6_fairplay"] = (agentDurations["agent6_fairplay"] || 0) + (Date.now() - finalAuditStart);
        fairPlayRetryCost += fairPlayAudit.cost;
        hasCriticalFairPlayFailure = fairPlayAudit.violations.some( // FP-2: recompute after clue_only re-audit
          (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
        );
        await recordFairPlayScore(); // FP-1: update score report with final clue_only audit result
      }

      // WP8A: Log remaining failures — hard stop only happens at the CML Validation Gate below
      if (fairPlayAudit!.overallStatus === "fail") {
        const criticalViolations = fairPlayAudit!.violations
          .filter(v => v.severity === "critical" || criticalFairPlayRules.has(v.rule))
          .map(v => v.rule + ": " + v.description)
          .join("; ");
        
        if (criticalViolations) {
          warnings.push("Fair play: critical failures persist after all retries: " + criticalViolations);
        }
      }

      if (fairPlayRetryCost > MAX_FAIR_PLAY_RETRY_COST) {
        warnings.push("Fair play retry cost limit reached ($" + fairPlayRetryCost.toFixed(3) + ") — proceeding with best result");
      }
    }

    // ========================================================================
    // Agent 7: Narrative Formatter
    // ========================================================================
    reportProgress("narrative", "Formatting narrative structure...", 75);
    
    let narrative: Awaited<ReturnType<typeof formatNarrative>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent7_narrative",
        "Narrative Outline",
        async (retryFeedback?: string) => {
          const narrativeResult = await formatNarrative(client, {
            caseData: cml,
            clues: clues,
            targetLength: inputs.targetLength,
            narrativeStyle: inputs.narrativeStyle,
            detectiveType: inputs.detectiveType,
            qualityGuardrails: retryFeedback ? [retryFeedback] : undefined,
            runId,
            projectId: projectId || "",
          });
          return { result: narrativeResult, cost: narrativeResult.cost };
        },
        async (narrativeResult) => {
          const scorer = new NarrativeScorer();
          // Convert prose_requirements.clue_to_scene_mapping → ClueRef[] with placement derived from act_number
          const clueMappings: ClueRef[] = ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? []).map(
            (m: any): ClueRef => ({
              id: String(m.clue_id || ''),
              placement: m.act_number === 1 ? 'early' : m.act_number === 2 ? 'mid' : m.act_number === 3 ? 'late' : undefined,
            })
          ).filter((c: ClueRef) => c.id);
          const adapted = adaptNarrativeForScoring(
            narrativeResult,
            (cml as any).CASE?.cast ?? [],       // for character ID → full name normalisation
            clueMappings,                         // for clue distribution by placement band
          );
          const score = await scorer.score({}, adapted, {
            previous_phases: { agent2_cast: cast.cast },
            cml,
            threshold_config: { mode: 'standard' },
            targetLength: inputs.targetLength ?? 'medium',
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      narrative = result;
      agentCosts["agent7_narrative"] = cost;
      agentDurations["agent7_narrative"] = duration;
    } else {
      const narrativeStart = Date.now();
      narrative = await formatNarrative(client, {
        caseData: cml,
        clues: clues,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        detectiveType: inputs.detectiveType,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent7_narrative"] = narrative.cost;
      agentDurations["agent7_narrative"] = Date.now() - narrativeStart;
    }

    let narrativeSchemaValidation = validateArtifact("narrative_outline", narrative);
    if (!narrativeSchemaValidation.valid) {
      warnings.push("Narrative outline failed schema validation on first attempt; retrying outline generation with schema repair guardrails");

      const schemaRepairGuardrails = [
        "Return a valid narrative_outline artifact that strictly matches required schema fields and types.",
        ...narrativeSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
      ];

      const narrativeSchemaRetryStart = Date.now();
      const retriedNarrative = await formatNarrative(client, {
        caseData: cml,
        clues: clues,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        detectiveType: inputs.detectiveType,
        qualityGuardrails: schemaRepairGuardrails,
        runId,
        projectId: projectId || "",
      });

      agentCosts["agent7_narrative"] = (agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
      agentDurations["agent7_narrative"] = (agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeSchemaRetryStart);

      const retryValidation = validateArtifact("narrative_outline", retriedNarrative);
      if (!retryValidation.valid) {
        retryValidation.errors.forEach((error) => errors.push(`Outline schema failure: ${error}`));
        throw new Error("Narrative outline artifact failed schema validation");
      }

      narrative = retriedNarrative;
      narrativeSchemaValidation = retryValidation;
      warnings.push("Narrative outline schema-repair retry succeeded");

      // N-3: re-score the corrected narrative so scoreAggregator reflects repaired output
      if (enableScoring && scoreAggregator) {
        try {
          const narrativeRescorer = new NarrativeScorer();
          const narrativeReAdapted = adaptNarrativeForScoring(
            narrative,
            (cml as any).CASE?.cast ?? [],
            ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? []).map(
              (m: any): ClueRef => ({
                id: String(m.clue_id || ''),
                placement: m.act_number === 1 ? 'early' : m.act_number === 2 ? 'mid' : 'late',
              })
            ).filter((c: ClueRef) => c.id),
          );
          const narrativeReScore = await narrativeRescorer.score({}, narrativeReAdapted, {
            previous_phases: { agent2_cast: cast.cast },
            cml,
            threshold_config: { mode: 'standard' },
            targetLength: inputs.targetLength ?? 'medium',
          });
          scoreAggregator.upsertPhaseScore('agent7_narrative', 'Narrative Outline', narrativeReScore, agentDurations['agent7_narrative'] ?? 0, 1);
        } catch {
          // Re-scoring is best-effort; never abort generation
        }
      }
    }
    narrativeSchemaValidation.warnings.forEach((warning) => warnings.push(`Outline schema warning: ${warning}`));
    
    reportProgress(
      "narrative",
      `${narrative.totalScenes} scenes structured (${narrative.estimatedTotalWords} words)`,
      87
    );

    // ========================================================================
    // Pre-prose outline quality gate
    // ========================================================================
    const outlineCoverageIssues = evaluateOutlineCoverage(narrative, cml);

    if (outlineCoverageIssues.length > 0) {
      const outlineGuardrails = buildOutlineRepairGuardrails(outlineCoverageIssues, cml);
      outlineCoverageIssues.forEach((issue) =>
        warnings.push("Outline coverage gap: " + issue.message),
      );
      warnings.push("Regenerating outline with targeted quality guardrails");
      reportProgress("narrative", "Regenerating outline to address coverage gaps", 80);

      const narrativeRetryStart = Date.now();
      const retriedNarrative = await formatNarrative(client, {
        caseData: cml,
        clues: clues,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        detectiveType: inputs.detectiveType,
        qualityGuardrails: outlineGuardrails,
        runId,
        projectId: projectId || "",
      });

      agentCosts["agent7_narrative"] = (agentCosts["agent7_narrative"] || 0) + retriedNarrative.cost;
      agentDurations["agent7_narrative"] = (agentDurations["agent7_narrative"] || 0) + (Date.now() - narrativeRetryStart);

      // Re-evaluate
      const retryOutlineIssues = evaluateOutlineCoverage(retriedNarrative, cml);
      if (retryOutlineIssues.length < outlineCoverageIssues.length) {
        narrative = retriedNarrative;
        warnings.push("Outline retry improved coverage");

        // N-3: re-score replacement narrative so scoreAggregator reflects improved output
        if (enableScoring && scoreAggregator) {
          try {
            const narrativeRescorer = new NarrativeScorer();
            const narrativeReAdapted = adaptNarrativeForScoring(
              narrative,
              (cml as any).CASE?.cast ?? [],
              ((cml as any).CASE?.prose_requirements?.clue_to_scene_mapping ?? []).map(
                (m: any): ClueRef => ({
                  id: String(m.clue_id || ''),
                  placement: m.act_number === 1 ? 'early' : m.act_number === 2 ? 'mid' : 'late',
                })
              ).filter((c: ClueRef) => c.id),
            );
            const narrativeReScore = await narrativeRescorer.score({}, narrativeReAdapted, {
              previous_phases: { agent2_cast: cast.cast },
              cml,
              threshold_config: { mode: 'standard' },
              targetLength: inputs.targetLength ?? 'medium',
            });
            scoreAggregator.upsertPhaseScore('agent7_narrative', 'Narrative Outline', narrativeReScore, agentDurations['agent7_narrative'] ?? 0, 1);
          } catch {
            // Re-scoring is best-effort; never abort generation
          }
        }

        reportProgress(
          "narrative",
          "Outline retry: " + retriedNarrative.totalScenes + " scenes (" + retriedNarrative.estimatedTotalWords + " words)",
          85,
        );
      } else {
        // Keep original but still pass guardrails downstream to prose
        warnings.push("Outline retry did not improve; will pass guardrails to prose generation");
      }
    }

    // ========================================================================
    // Clue pacing gate — ensure narrative outline places clues in ≥ 60% of scenes
    // before committing to prose generation. If the LLM under-populated cluesRevealed
    // arrays the gate retries once with a hard pacing constraint.
    // ========================================================================
    {
      const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
      const totalOutlineSceneCount = allOutlineScenes.length;
      const clueSceneCount = allOutlineScenes.filter(
        (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
      ).length;
      const minClueScenes = Math.ceil(totalOutlineSceneCount * 0.6);

      if (totalOutlineSceneCount > 0 && clueSceneCount < minClueScenes) {
        warnings.push(
          `Outline clue pacing below threshold: ${clueSceneCount}/${totalOutlineSceneCount} scenes carry clues (minimum ${minClueScenes}). Retrying outline with reinforced pacing.`
        );
        reportProgress("narrative", `Clue pacing retry: ${clueSceneCount}/${totalOutlineSceneCount} scenes have clues (≥${minClueScenes} required)`, 86);

        const pacingRetryStart = Date.now();
        const pacingRetried = await formatNarrative(client, {
          caseData: cml,
          clues: clues,
          targetLength: inputs.targetLength,
          narrativeStyle: inputs.narrativeStyle,
          detectiveType: inputs.detectiveType,
          qualityGuardrails: [
            `CRITICAL PACING FAILURE: Your previous outline placed clues in only ${clueSceneCount} of ${totalOutlineSceneCount} scenes. The minimum required is ${minClueScenes} scenes (60% of all scenes). You MUST populate the cluesRevealed array with at least one clue ID in at least ${minClueScenes} scenes. Spread clues across ALL three acts — every act must have multiple clue-bearing scenes. Do not cluster all clues in the final act.`,
          ],
          runId,
          projectId: projectId || "",
        });
        agentCosts["agent7_narrative"] = (agentCosts["agent7_narrative"] ?? 0) + pacingRetried.cost;
        agentDurations["agent7_narrative"] =
          (agentDurations["agent7_narrative"] ?? 0) + (Date.now() - pacingRetryStart);

        const retriedOutlineScenes = (pacingRetried.acts ?? []).flatMap((a: any) => a.scenes || []);
        const retriedClueCount = retriedOutlineScenes.filter(
          (s: any) => Array.isArray(s.cluesRevealed) && s.cluesRevealed.length > 0
        ).length;
        // Re-derive the threshold from the retry outline's actual scene count so
        // a change in length (LLM returned fewer/more scenes) is handled correctly.
        const retriedMinClueScenes = Math.ceil(retriedOutlineScenes.length * 0.6);

        if (retriedClueCount >= retriedMinClueScenes) {
          narrative = pacingRetried;
          warnings.push(`Outline pacing retry succeeded: ${retriedClueCount}/${retriedOutlineScenes.length} scenes now carry clues.`);
        } else {
          warnings.push(
            `Outline pacing retry still below threshold (${retriedClueCount}/${retriedOutlineScenes.length}, need ≥${retriedMinClueScenes}) — proceeding with best-available outline; clue visibility may be reduced.`
          );
        }
      }
    }

    // ========================================================================
    // Agent 2b: Character Profiles
    // ========================================================================
    reportProgress("profiles", "Generating character profiles...", 88);

    let characterProfiles: Awaited<ReturnType<typeof generateCharacterProfiles>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent2b_profiles",
        "Character Profiles",
        async (retryFeedback?: string) => {
          const profilesResult = await generateCharacterProfiles(client, {
            caseData: cml,
            cast: cast.cast,
            tone: appendRetryFeedback(inputs.narrativeStyle || "classic", retryFeedback),
            targetWordCount: 1000,
            runId,
            projectId: projectId || "",
          });
          return { result: profilesResult, cost: profilesResult.cost };
        },
        async (profilesResult) => {
          const scorer = new CharacterProfilesScorer();
          const adapted = adaptCharacterProfilesForScoring(profilesResult.profiles);
          const score = await scorer.score({}, adapted, {
            previous_phases: { agent2_cast: cast.cast },
            cml,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      characterProfiles = result;
      agentCosts["agent2b_profiles"] = cost;
      agentDurations["agent2b_profiles"] = duration;
    } else {
      const profilesStart = Date.now();
      characterProfiles = await generateCharacterProfiles(client, {
        caseData: cml,
        cast: cast.cast,
        tone: inputs.narrativeStyle || "classic",
        targetWordCount: 1000,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2b_profiles"] = characterProfiles.cost;
      agentDurations["agent2b_profiles"] = Date.now() - profilesStart;
    }

    // Validate character profiles against schema
    const characterProfilesValidation = validateArtifact("character_profiles", characterProfiles);
    if (!characterProfilesValidation.valid) {
      warnings.push("Agent 2b: Character profiles validation warnings:");
      characterProfilesValidation.errors.forEach(e => warnings.push(`  - ${e}`));
    }
    if (characterProfilesValidation.warnings.length > 0) {
      characterProfilesValidation.warnings.forEach(w => warnings.push(`  - Schema warning: ${w}`));
    }

    reportProgress("profiles", `Character profiles generated (${characterProfiles.profiles.length})`, 89);

    // ========================================================================
    // Agent 2c: Location Profiles
    // ========================================================================
    reportProgress("location-profiles", "Generating location profiles...", 89);

    let locationProfiles: Awaited<ReturnType<typeof generateLocationProfiles>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent2c_location_profiles",
        "Location Profiles",
        async (retryFeedback?: string) => {
          const locResult = await generateLocationProfiles(client, {
            settingRefinement: setting.setting,
            caseData: cml,
            narrative: narrative,
            tone: appendRetryFeedback(inputs.tone || "Classic", retryFeedback),
            targetWordCount: 1000,
            runId,
            projectId: projectId || "",
          });
          return { result: locResult, cost: locResult.cost };
        },
        async (locResult) => {
          const scorer = new LocationProfilesScorer();
          const adapted = adaptLocationsForScoring(locResult);
          const score = await scorer.score({}, adapted, {
            previous_phases: {
              agent1_setting: setting.setting,
              agent2e_background_context: backgroundContext,
            },
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      locationProfiles = result;
      agentCosts["agent2c_location_profiles"] = cost;
      agentDurations["agent2c_location_profiles"] = duration;
    } else {
      const locationProfilesStart = Date.now();
      locationProfiles = await generateLocationProfiles(client, {
        settingRefinement: setting.setting,
        caseData: cml,
        narrative: narrative,
        tone: inputs.tone || "Classic",
        targetWordCount: 1000,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2c_location_profiles"] = locationProfiles.cost;
      agentDurations["agent2c_location_profiles"] = Date.now() - locationProfilesStart;
    }

    // Validate location profiles against schema
    const locationProfilesValidation = validateArtifact("location_profiles", locationProfiles);
    if (!locationProfilesValidation.valid) {
      warnings.push("Agent 2c: Location profiles validation warnings:");
      locationProfilesValidation.errors.forEach(e => warnings.push(`  - ${e}`));
    }
    if (locationProfilesValidation.warnings.length > 0) {
      locationProfilesValidation.warnings.forEach(w => warnings.push(`  - Schema warning: ${w}`));
    }

    reportProgress("location-profiles", `Location profiles generated (${locationProfiles.keyLocations.length} locations)`, 89);

    // ========================================================================
    // Agent 2d: Temporal Context
    // ========================================================================
    reportProgress("temporal-context", "Generating temporal context...", 89);

    let temporalContext: Awaited<ReturnType<typeof generateTemporalContext>>;
    
    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent2d_temporal_context",
        "Temporal Context",
        async (retryFeedback?: string) => {
          const tempResult = await generateTemporalContext(client, {
            settingRefinement: setting.setting,
            caseData: cml,
            runId,
            projectId: projectId || "",
            qualityGuardrails: retryFeedback ? [retryFeedback] : undefined,
          });
          return { result: tempResult, cost: tempResult.cost };
        },
        async (tempResult) => {
          const scorer = new TemporalContextScorer();
          const adapted = adaptTemporalContextForScoring(tempResult, setting.setting);
          const score = await scorer.score({}, adapted, {
            previous_phases: {
              agent1_setting: setting.setting,
              agent2e_background_context: backgroundContext,
            },
            cml: undefined as any,
            threshold_config: { mode: 'standard' },
          });
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      temporalContext = result;
      agentCosts["agent2d_temporal_context"] = cost;
      agentDurations["agent2d_temporal_context"] = duration;
    } else {
      const temporalContextStart = Date.now();
      temporalContext = await generateTemporalContext(client, {
        settingRefinement: setting.setting,
        caseData: cml,
        runId,
        projectId: projectId || "",
      });
      agentCosts["agent2d_temporal_context"] = temporalContext.cost;
      agentDurations["agent2d_temporal_context"] = Date.now() - temporalContextStart;
    }

    // Validate temporal context against schema
    const temporalContextValidation = validateArtifact("temporal_context", temporalContext);
    if (!temporalContextValidation.valid) {
      warnings.push("Agent 2d: Temporal context validation warnings:");
      temporalContextValidation.errors.forEach(e => warnings.push(`  - ${e}`));
    }
    if (temporalContextValidation.warnings.length > 0) {
      temporalContextValidation.warnings.forEach(w => warnings.push(`  - Schema warning: ${w}`));
    }

    reportProgress("temporal-context", `Temporal context generated (${temporalContext.specificDate.month} ${temporalContext.specificDate.year})`, 91);

    // ========================================================================
    // CML Validation Gate: Ensure CML is ready for prose generation
    // ========================================================================
    // This prevents wasting $5-8 on prose generation from invalid CML
    const cmlValidationErrors: string[] = [];

    // Pre-gate: back-fill discriminating_test.evidence_clues from finalised clues if missing.
    // Agent 3 generates the skeleton without clue IDs (clues don't exist yet at CML generation
    // time). We populate evidence_clues here after Agent 5 has finalised the clue set.
    const discrimTestNode = (cml as any).CASE?.discriminating_test;
    if (discrimTestNode && (!discrimTestNode.evidence_clues || discrimTestNode.evidence_clues.length === 0)) {
      const essentialIds = clues.clues
        .filter(c => c.criticality === 'essential')
        .map(c => c.id);
      if (essentialIds.length > 0) {
        discrimTestNode.evidence_clues = essentialIds;
        warnings.push(`CML gate: back-filled evidence_clues with ${essentialIds.length} essential clue(s)`);
      }
    }

    // 1. Fair play audit must pass or have only minor issues.
    // Only block prose on violations that indicate *broken mystery structure*:
    //   - Clue Visibility: a clue the detective uses is never shown to the reader
    //   - Logical Deducibility: the culprit fundamentally cannot be deduced from the clues
    //   - No Withholding: the detective actively withholds information from the reader
    // "Information Parity" and "Solution Uniqueness" are clue-phrasing issues;
    // the CML structure is sound and prose can proceed with warnings.
    if (fairPlayAudit && fairPlayAudit.overallStatus === 'fail') {
      const structurallyBlockingRules = new Set(['Clue Visibility', 'Logical Deducibility', 'No Withholding']);
      const blockingViolations = fairPlayAudit.violations.filter(
        v => v.severity === 'critical' && v.rule && structurallyBlockingRules.has(v.rule)
      );
      if (blockingViolations.length > 0) {
        cmlValidationErrors.push(
          `Fair play audit failed with ${blockingViolations.length} structural violation(s) ` +
          `(${blockingViolations.map(v => v.rule).join(', ')}) — prose cannot realize a broken mystery`
        );
      } else {
        // Non-structural critical violations (e.g. Information Parity, Solution Uniqueness):
        // these are clue-quality issues, not broken CML. Warn and continue.
        const nonStructuralCritical = fairPlayAudit.violations.filter(v => v.severity === 'critical');
        if (nonStructuralCritical.length > 0) {
          warnings.push(
            `Fair-play: ${nonStructuralCritical.length} non-structural violation(s) remain ` +
            `(${nonStructuralCritical.map(v => v.rule).join(', ')}) — mystery structure is sound, proceeding with prose`
          );
        }
      }
    }
    
    // 2. Discriminating test must be fully specified
    const discriminatingTest = (cml as any).CASE?.discriminating_test;
    if (!discriminatingTest || !discriminatingTest.design) {
      cmlValidationErrors.push('Discriminating test design is missing - prose generator cannot create test scene');
    }
    if (discriminatingTest && (!discriminatingTest.evidence_clues || discriminatingTest.evidence_clues.length === 0)) {
      cmlValidationErrors.push('Discriminating test has no evidence clues - prose cannot reference supporting evidence');
    }
    
    // 3. Critical clue coverage gaps block prose generation
    if (coverageResult.hasCriticalGaps) {
      const gapSummary = [];
      const uncoveredCount = coverageResult.uncoveredSteps.length;
      if (uncoveredCount > 0) {
        gapSummary.push(`${uncoveredCount} inference step(s) without sufficient clues`);
      }
      
      // Check for specific discriminating test and elimination issues from coverageResult.issues
      const testIssues = coverageResult.issues.filter(i => i.message.includes('discriminating test'));
      const eliminationIssues = coverageResult.issues.filter(i => i.message.includes('suspect') || i.message.includes('elimination'));
      
      if (testIssues.length > 0) {
        gapSummary.push('discriminating test evidence incomplete');
      }
      if (eliminationIssues.length > 0) {
        gapSummary.push(`suspect elimination issues (${eliminationIssues.length})`);
      }
      
      if (gapSummary.length > 0) {
        cmlValidationErrors.push(`Critical clue coverage gaps: ${gapSummary.join(', ')}`);
      }
    }
    
    // Stop if any validation errors exist
    if (cmlValidationErrors.length > 0) {
      const errorMsg = `CML validation failed before prose generation:\n${cmlValidationErrors.map(e => `  • ${e}`).join('\n')}\n\nFix CML structure before attempting prose generation.`;
      errors.push(errorMsg);
      throw new Error(errorMsg);
    }

    // ========================================================================
    // Agent 9: Prose Generator
    // ========================================================================
    reportProgress("prose", "Generating prose chapter by chapter with per-chapter validation...", 91);

    const baselineProseGuardrails = [
      "Use only canonical cast names from CML. Do not invent titled placeholders like 'Detective Surname', 'Inspector Surname', 'a woman Surname', or 'a man Surname'.",
      "Before the final reveal closes, include explicit suspect-elimination coverage: each non-culprit suspect is ruled out with concrete on-page evidence or confirmed alibi.",
      "In the reveal sequence, include a complete culprit evidence chain using explicit reasoning connectors (because/therefore/proves).",
    ];

    let prose: Awaited<ReturnType<typeof generateProse>>;
    const totalSceneCount = narrative.acts?.flatMap((a: any) => a.scenes || []).length || 0;
    // Extract moral ambiguity note from the selected hard-logic device for prose context
    const moralAmbiguityNote = hardLogicDevices.devices[0]?.moralAmbiguity;
    // Extract locked facts for prose ground-truth injection
    const proseLockedFacts = hardLogicDevices.devices[0]?.lockedFacts;
    // Initialise narrative state — tracks style history, pronouns, and locked facts across prose batches
    const characterGenderMap: Record<string, string> = Object.fromEntries(
      cast.cast.characters.map(c => [c.name, c.gender ?? 'non-binary'])
    );
    let narrativeState: NarrativeState = initNarrativeState(proseLockedFacts ?? [], characterGenderMap);
    const prosePhaseStartTime = Date.now();
    const proseDeployment =
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME_PROSE ||
      process.env.AZURE_OPENAI_DEPLOYMENT_NAME;
    const proseModelOverride = proseDeployment
      ? ({ model: proseDeployment } as Record<string, string>)
      : {};
    // Populated by the main prose onBatchComplete; accessible to the repair path
    // so the repair's upsertPhaseScore can carry the first-pass breakdown along.
    const proseChapterScores: Array<{ chapter: number; total_chapters: number; individual_score: number; cumulative_score: number }> = [];

    if (enableScoring && scoreAggregator && retryManager && scoringLogger) {
      const { result, duration, cost } = await executeAgentWithRetry(
        "agent9_prose",
        "Prose Generation",
        async (retryFeedback?: string) => {
          // P-2: clear stale chapter scores from the previous failed attempt
          if (retryFeedback) {
            proseChapterScores.length = 0;
          }
          // Accumulate chapters as they complete so per-chapter scoring can run
          const accumulatedChapters: any[] = [];
          // On retries the aggregator already has the first attempt's committed
          // score from executeAgentWithRetry's own upsert after scoreOutput ran.
          // Don't overwrite it with partial per-chapter progress scores.
          const isRetry = !!retryFeedback;

          const proseResult = await generateProse(client, {
            caseData: cml,
            outline: narrative,
            cast: cast.cast,
            ...proseModelOverride,
            detectiveType: inputs.detectiveType,
            characterProfiles: characterProfiles,
            locationProfiles: locationProfiles,
            temporalContext: temporalContext,
            moralAmbiguityNote,
            lockedFacts: proseLockedFacts,
            clueDistribution: clues,
            narrativeState,
            targetLength: inputs.targetLength,
            narrativeStyle: inputs.narrativeStyle,
            qualityGuardrails: [
              ...baselineProseGuardrails,
              ...(outlineCoverageIssues.length > 0
                ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml)
                : []),
              ...(retryFeedback ? [retryFeedback] : []),
            ],
            writingGuides: loadWritingGuides(),
            runId,
            projectId: projectId || "",
            onProgress: (phase: string, message: string, percentage: number) => reportProgress(phase as any, message, percentage),
            batchSize: inputs.proseBatchSize,
            onBatchComplete: async (batchChapters, batchStart, batchEnd, validationIssues) => {
              // Add completed chapter to accumulator
              accumulatedChapters.push(...batchChapters);

              // Update narrative state so subsequent batches avoid style/fact repetition
              narrativeState = updateNSD(narrativeState, batchChapters, batchStart);

              // Wire cluesRevealedToReader — cross-reference completed chapters against the
              // narrative outline so the NSD knows which clues have already been surfaced.
              const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
              const batchRevealedIds: string[] = allOutlineScenes
                .filter((s: any) => s.sceneNumber >= batchStart && s.sceneNumber <= batchEnd)
                .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []));
              if (batchRevealedIds.length > 0) {
                const merged = [...new Set([...narrativeState.cluesRevealedToReader, ...batchRevealedIds])];
                narrativeState = { ...narrativeState, cluesRevealedToReader: merged };
              }

              // Score all chapters generated so far
              try {
                const scorer = new ProseScorer();

                // Individual score: just the chapters in this batch
                const adaptedBatch = adaptProseForScoring(batchChapters, (cml as any).CASE);
                const batchScore = await scorer.score({}, adaptedBatch, {
                  previous_phases: {
                    agent2_cast: cast.cast,
                    agent2b_character_profiles: characterProfiles.profiles,
                    agent2c_location_profiles: locationProfiles,
                  },
                  cml,
                  threshold_config: { mode: 'standard' },
                  targetLength: inputs.targetLength ?? 'medium',
                  partialGeneration: true,
                });

                // Cumulative score: all chapters so far
                const adaptedAll = adaptProseForScoring(accumulatedChapters, (cml as any).CASE);
                const partialScore = await scorer.score({}, adaptedAll, {
                  previous_phases: {
                    agent2_cast: cast.cast,
                    agent2b_character_profiles: characterProfiles.profiles,
                    agent2c_location_profiles: locationProfiles,
                  },
                  cml,
                  threshold_config: { mode: 'standard' },
                  targetLength: inputs.targetLength ?? 'medium',
                  partialGeneration: true,
                });

                const individualPct = Math.round(batchScore.total ?? 0);
                const pct = Math.round(partialScore.total ?? 0);
                const chapterLabel = `${batchEnd}/${totalSceneCount}`;
                const elapsedMs = Date.now() - prosePhaseStartTime;

                // Record both individual and cumulative scores for the report breakdown.
                proseChapterScores.push({
                  chapter: batchEnd,
                  total_chapters: totalSceneCount,
                  individual_score: individualPct,
                  cumulative_score: pct,
                });

                // Only update the persistent aggregator entry on the FIRST attempt.
                // On retries we protect the committed score so a crashed retry
                // cannot leave a stale intermediate value in the report.
                // IMPORTANT: always use the canonical "Prose Generation" label —
                // never include the chapter-count suffix here. The suffix goes only
                // into the live reportProgress event below so the UI run history
                // panel shows progress, but the chapter count is ephemeral and must
                // never be persisted to the aggregator (if generateProse throws
                // mid-run, the aborted partial report would otherwise show a stale
                // "(11/15 chapters)" label).
                if (!isRetry) {
                  const scoreWithBreakdown: PhaseScore = {
                    ...partialScore,
                    breakdown: { chapter_scores: [...proseChapterScores] },
                  };
                  scoreAggregator.upsertPhaseScore(
                    "agent9_prose",
                    "Prose Generation",
                    scoreWithBreakdown,
                    elapsedMs,
                    0,
                  );
                  // Flush to DB — the 5-second UI poll will pick this up
                  await savePartialReport();
                }

                // Always emit live progress (run history panel) even on retries.
                reportProgress(
                  "prose",
                  `${isRetry ? '[Retry] ' : ''}Chapter ${chapterLabel} complete · chapter: ${individualPct}/100 · cumulative: ${pct}/100`,
                  91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
                );
              } catch {
                // Per-chapter scoring is best-effort; never abort prose generation
              }

              // Surface per-batch validation issues to run history (§3.2)
              if (validationIssues && validationIssues.length > 0) {
                const issueRange = batchEnd > batchStart ? `${batchStart}-${batchEnd}` : `${batchEnd}`;
                reportProgress(
                  "prose",
                  `⚠ Chapter${batchEnd > batchStart ? 's' : ''} ${issueRange} required retry — ${validationIssues.length} issue${validationIssues.length !== 1 ? 's' : ''}: ${validationIssues.slice(0, 2).join('; ')}${validationIssues.length > 2 ? ` (+${validationIssues.length - 2} more)` : ''}`,
                  91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
                );
              }
            },
          });
          return {
            result: applyDeterministicProsePostProcessing(
              sanitizeProseResult(proseResult),
              locationProfiles,
            ),
            cost: proseResult.cost,
          };
        },
        async (proseResult) => {
          const scorer = new ProseScorer();
          const adapted = adaptProseForScoring(proseResult.chapters, (cml as any).CASE);
          const score = await scorer.score({}, adapted, {
            previous_phases: {
              agent2_cast: cast.cast,
              agent2b_character_profiles: characterProfiles.profiles,
              agent2c_location_profiles: locationProfiles,
            },
            cml,
            threshold_config: { mode: 'standard' },
            targetLength: inputs.targetLength ?? 'medium',
          });
          // Carry the per-chapter breakdown from the first attempt into the final
          // score so executeAgentWithRetry's upsert preserves it in the report.
          if (proseChapterScores.length > 0 && !score.breakdown) {
            (score as PhaseScore).breakdown = { chapter_scores: [...proseChapterScores] };
          }
          return { adapted, score };
        },
        retryManager,
        scoreAggregator,
        scoringLogger,
        runId,
        projectId || "",
        warnings,
        savePartialReport
      );
      prose = result;
      agentCosts["agent9_prose"] = cost;
      agentDurations["agent9_prose"] = duration;
    } else {
      const proseStart = Date.now();
      prose = await generateProse(client, {
        caseData: cml,
        outline: narrative,
        cast: cast.cast,
        ...proseModelOverride,
        detectiveType: inputs.detectiveType,
        characterProfiles: characterProfiles,
        locationProfiles: locationProfiles,
        temporalContext: temporalContext,
        moralAmbiguityNote,
        lockedFacts: proseLockedFacts,
        clueDistribution: clues,
        narrativeState,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        qualityGuardrails: [
          ...baselineProseGuardrails,
          ...(outlineCoverageIssues.length > 0 ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml) : []),
        ],
        writingGuides: loadWritingGuides(),
        runId,
        projectId: projectId || "",
        onProgress: (phase: string, message: string, percentage: number) => reportProgress(phase as any, message, percentage),
        // Emit per-chapter progress events so the run history panel updates in real-time
        // even when the scoring system is disabled.
        batchSize: inputs.proseBatchSize,
        onBatchComplete: (batchChapters, batchStart, batchEnd, validationIssues) => {
          // Update narrative state (style history + clue tracking) in non-scoring path too
          narrativeState = updateNSD(narrativeState, batchChapters, batchStart);
          const allOutlineScenes = (narrative.acts ?? []).flatMap((a: any) => a.scenes || []);
          const batchRevealedIds: string[] = allOutlineScenes
            .filter((s: any) => s.sceneNumber >= batchStart && s.sceneNumber <= batchEnd)
            .flatMap((s: any) => (Array.isArray(s.cluesRevealed) ? s.cluesRevealed : []));
          if (batchRevealedIds.length > 0) {
            const merged = [...new Set([...narrativeState.cluesRevealedToReader, ...batchRevealedIds])];
            narrativeState = { ...narrativeState, cluesRevealedToReader: merged };
          }
          const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
          reportProgress(
            "prose",
            `Chapter ${chapterLabel} complete`,
            91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
          );
          // Surface per-batch validation issues to run history (§3.2)
          if (validationIssues && validationIssues.length > 0) {
            reportProgress(
              "prose",
              `⚠ Chapter ${batchEnd} required retry — ${validationIssues.length} issue${validationIssues.length !== 1 ? 's' : ''}: ${validationIssues.slice(0, 2).join('; ')}${validationIssues.length > 2 ? ` (+${validationIssues.length - 2} more)` : ''}`,
              91 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 3),
            );
          }
        },
      });
      prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);
      agentCosts["agent9_prose"] = prose.cost;
      agentDurations["agent9_prose"] = Date.now() - proseStart;
    }

    // Identity continuity check (separate from scoring retry)
    const identityAliasIssues = detectIdentityAliasBreaks(prose, cml);
    if (identityAliasIssues.length > 0) {
      warnings.push("Agent 9: Identity continuity guardrail detected role-alias drift; regenerating prose once");
      identityAliasIssues.forEach((issue) => warnings.push(`  - ${issue}`));

      const proseRetryStart = Date.now();
      reportProgress("prose", "Regenerating all prose due to identity drift...", 92);
      const retriedProse = await generateProse(client, {
        caseData: cml,
        outline: narrative,
        cast: cast.cast,
        ...proseModelOverride,
        detectiveType: inputs.detectiveType,
        characterProfiles: characterProfiles,
        locationProfiles: locationProfiles,
        temporalContext: temporalContext,
        moralAmbiguityNote,
        lockedFacts: proseLockedFacts,
        clueDistribution: clues,
        narrativeState,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        qualityGuardrails: baselineProseGuardrails,
        writingGuides: loadWritingGuides(),
        runId,
        projectId: projectId || "",
        onProgress: (phase: string, message: string, percentage: number) => reportProgress(phase as any, message, percentage),
        batchSize: inputs.proseBatchSize,
        onBatchComplete: (_batchChapters, _batchStart, batchEnd) => {
          const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
          reportProgress(
            "prose",
            `[Identity fix] Chapter ${chapterLabel} complete`,
            92 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 2),
          );
        },
      });
      prose = applyDeterministicProsePostProcessing(sanitizeProseResult(retriedProse), locationProfiles);
      agentCosts["agent9_prose"] = (agentCosts["agent9_prose"] || 0) + retriedProse.cost;
      agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseRetryStart);

      const retryIdentityIssues = detectIdentityAliasBreaks(prose, cml);
      if (retryIdentityIssues.length > 0) {
        retryIdentityIssues.forEach((issue) => errors.push(`Identity continuity failure: ${issue}`));
        throw new Error("Prose identity continuity guardrail failed after retry");
      }

      // P-3: re-score replacement prose so scoreAggregator reflects identity-corrected output
      if (enableScoring && scoreAggregator) {
        try {
          const reAdaptedProse = adaptProseForScoring(prose.chapters, (cml as any).CASE);
          const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, {
            previous_phases: {
              agent2_cast: cast.cast,
              agent2b_character_profiles: characterProfiles.profiles,
              agent2c_location_profiles: locationProfiles,
            },
            cml,
            targetLength: inputs.targetLength ?? 'medium',
            threshold_config: { mode: 'standard' },
          });
          scoreAggregator.upsertPhaseScore('agent9_prose', 'Prose Generation', reScoreProse, agentDurations['agent9_prose'] ?? 0, 1);
        } catch {
          // Re-scoring is best-effort; never abort generation
        }
      }
    }

    // Surface chapter validation issues to UI
    if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
      const batchRetryMsg = `Prose generation: ${prose.validationDetails.batchesWithRetries}/${prose.validationDetails.totalBatches} batch(es) required retry due to validation issues`;
      warnings.push(batchRetryMsg);
      await client.getLogger()?.logError({
        runId,
        projectId,
        agent: "Agent9-ProseGenerator",
        operation: "batch_validation",
        errorMessage: batchRetryMsg,
        metadata: { batchesWithRetries: prose.validationDetails.batchesWithRetries, totalBatches: prose.validationDetails.totalBatches }
      });
      
      // Add detailed failure information
      prose.validationDetails.failureHistory.forEach((failure) => {
        const failureMsg = `  - Chapters ${failure.chapterRange} (attempt ${failure.attempt}): ${failure.errors.join('; ')}`;
        warnings.push(failureMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "Agent9-ProseGenerator",
          operation: "chapter_validation_failure",
          errorMessage: `Chapters ${failure.chapterRange} failed validation`,
          metadata: { chapterRange: failure.chapterRange, attempt: failure.attempt, errors: failure.errors }
        });
      });

      // Add context about what upstream issues may have contributed
      if (outlineCoverageIssues.length > 0) {
        const contextMsg = `  Context: Outline had ${outlineCoverageIssues.length} coverage issue(s) which may have affected prose quality`;
        warnings.push(contextMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "Agent9-ProseGenerator",
          operation: "context_issue",
          errorMessage: contextMsg,
          metadata: { outlineCoverageIssues }
        });
      }
      if (coverageResult.hasCriticalGaps) {
        const contextMsg = `  Context: CML had critical clue coverage gaps which may have affected prose scene content`;
        warnings.push(contextMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "Agent9-ProseGenerator",
          operation: "context_issue",
          errorMessage: contextMsg,
          metadata: { clueCoverageGaps: coverageResult }
        });
      }
    }

    let proseSchemaValidation = validateArtifact("prose", prose);
    if (!proseSchemaValidation.valid) {
      warnings.push("Prose artifact failed schema validation on first attempt; retrying prose generation with schema repair guardrails");
      const schemaRepairGuardrails = [
        "Return a valid prose artifact that strictly matches required schema fields and types.",
        ...proseSchemaValidation.errors.slice(0, 8).map((error) => `Schema fix required: ${error}`),
      ];
      const proseSchemaRetryStart = Date.now();
      const retriedProse = await generateProse(client, {
        caseData: cml,
        outline: narrative,
        cast: cast.cast,
        ...proseModelOverride,
        detectiveType: inputs.detectiveType,
        characterProfiles: characterProfiles,
        locationProfiles: locationProfiles,
        temporalContext: temporalContext,
        moralAmbiguityNote,
        lockedFacts: proseLockedFacts,
        clueDistribution: clues,
        narrativeState,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        qualityGuardrails: [...baselineProseGuardrails, ...schemaRepairGuardrails],
        writingGuides: loadWritingGuides(),
        runId,
        projectId: projectId || "",
        onProgress: (phase: string, message: string, percentage: number) => reportProgress(phase as any, message, percentage),
        batchSize: inputs.proseBatchSize,
        onBatchComplete: (_batchChapters, _batchStart, batchEnd) => {
          const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
          reportProgress(
            "prose",
            `[Schema-repair] Chapter ${chapterLabel} complete`,
            92 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 2),
          );
        },
      });
      agentCosts["agent9_prose"] = (agentCosts["agent9_prose"] || 0) + retriedProse.cost;
      agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseSchemaRetryStart);
      const retryValidation = validateArtifact("prose", retriedProse);
      if (!retryValidation.valid) {
        retryValidation.errors.forEach((error) => errors.push(`Prose schema failure: ${error}`));
        throw new Error("Prose artifact failed schema validation");
      }
      prose = applyDeterministicProsePostProcessing(sanitizeProseResult(retriedProse), locationProfiles);
      proseSchemaValidation = retryValidation;
      warnings.push("Prose schema-repair retry succeeded");

      // P-3: re-score replacement prose so scoreAggregator reflects schema-repaired output
      if (enableScoring && scoreAggregator) {
        try {
          const reAdaptedProse = adaptProseForScoring(prose.chapters, (cml as any).CASE);
          const reScoreProse = await new ProseScorer().score({}, reAdaptedProse, {
            previous_phases: {
              agent2_cast: cast.cast,
              agent2b_character_profiles: characterProfiles.profiles,
              agent2c_location_profiles: locationProfiles,
            },
            cml,
            targetLength: inputs.targetLength ?? 'medium',
            threshold_config: { mode: 'standard' },
          });
          scoreAggregator.upsertPhaseScore('agent9_prose', 'Prose Generation', reScoreProse, agentDurations['agent9_prose'] ?? 0, 1);
        } catch {
          // Re-scoring is best-effort; never abort generation
        }
      }
    }
    proseSchemaValidation.warnings.forEach((warning) => warnings.push(`Prose schema warning: ${warning}`));

    reportProgress("prose", `Prose generated (${prose.chapters.length} chapters)`, 94);

    // ========================================================================
    // Story Validation
    // ========================================================================
    reportProgress("validation", "Validating story quality...", 96);

    const validationStart = Date.now();
    const validationPipeline = new StoryValidationPipeline(client);
    
    prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);

    // Build story object from prose for validation
    // Convert prose chapters (paragraphs) to scenes (text blocks)
    const storyForValidation = {
      id: runId,
      projectId: projectId || runId,

      scenes: prose.chapters.map((ch: any, idx: number) => ({
        number: idx + 1,
        title: ch.title,
        text: ch.paragraphs.join('\n\n'),
      })),
    };
    
    let validationReport = await validationPipeline.validate(storyForValidation, {
      ...cml,
      lockedFacts: proseLockedFacts ?? [],
    } as any);
    agentDurations["validation"] = Date.now() - validationStart;

    // Log validation results
    if (validationReport.status === "passed") {
      reportProgress("validation", "Story validation passed!", 98);
    } else if (validationReport.status === "needs_review") {
      warnings.push(`Story validation: ${validationReport.status} - ${validationReport.summary.major} major issues`);
      reportProgress("validation", `Story needs review (${validationReport.summary.major} major issues)`, 98);
    } else {
      // Validation needs revision/failed - attempt prose repair retry with targeted guardrails
      const validationFailureMsg = "Story validation: " + validationReport.status + " - " + validationReport.summary.critical + " critical, " + validationReport.summary.major + " major issues";
      warnings.push(validationFailureMsg);
      await client.getLogger()?.logError({
        runId,
        projectId,
        agent: "ValidationPipeline",
        operation: "final_validation",
        errorMessage: validationFailureMsg,
        metadata: { status: validationReport.status, summary: validationReport.summary }
      });
      
      // Add comprehensive failure context for UI
      const separator1 = "═══ PROSE VALIDATION FAILURE DETAILS ═══";
      warnings.push(separator1);
      client.getLogger()?.logError({
        runId,
        projectId,
        agent: "ValidationPipeline",
        operation: "validation_details",
        errorMessage: "Detailed validation failure breakdown",
        metadata: { errorCount: validationReport.errors.length }
      });
      
      // 1. Immediate validation errors
      validationReport.errors.slice(0, 10).forEach((err) => {
        const errMsg = `  [${err.severity}] ${err.type}: ${err.message}`;
        warnings.push(errMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "validation_error",
          errorMessage: err.message,
          metadata: { severity: err.severity, type: err.type, fullError: err }
        });
      });
      if (validationReport.errors.length > 10) {
        const remainingMsg = `  ... and ${validationReport.errors.length - 10} more validation errors`;
        warnings.push(remainingMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "validation_error_overflow",
          errorMessage: remainingMsg,
          metadata: { totalErrors: validationReport.errors.length }
        });
      }

      // 2. Upstream contributing factors
      const separator2 = "═══ CONTRIBUTING FACTORS ═══";
      warnings.push(separator2);
      client.getLogger()?.logError({
        runId,
        projectId,
        agent: "ValidationPipeline",
        operation: "contributing_factors",
        errorMessage: "Analyzing upstream issues that contributed to validation failure"
      });
      
      if (prose.validationDetails && prose.validationDetails.batchesWithRetries > 0) {
        const batchMsg = `  • Chapter generation: ${prose.validationDetails.batchesWithRetries} batches had validation issues during generation`;
        warnings.push(batchMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "contributing_factor",
          errorMessage: batchMsg,
          metadata: { batchValidationDetails: prose.validationDetails }
        });
      }
      
      if (coverageResult.hasCriticalGaps) {
        const gapTypes = [];
        if (coverageResult.issues.some(i => i.message.includes('inference step'))) {
          gapTypes.push('inference path coverage');
        }
        if (coverageResult.issues.some(i => i.message.includes('discriminating test'))) {
          gapTypes.push('discriminating test evidence');
        }
        if (coverageResult.issues.some(i => i.message.includes('suspect'))) {
          gapTypes.push('suspect elimination');
        }
        const coverageMsg = `  • CML clue coverage: Critical gaps in ${gapTypes.join(', ')}`;
        warnings.push(coverageMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "contributing_factor",
          errorMessage: coverageMsg,
          metadata: { coverageResult }
        });
      }
      
      if (outlineCoverageIssues.length > 0) {
        const outlineMsg = `  • Outline: ${outlineCoverageIssues.length} coverage issues (${outlineCoverageIssues.slice(0, 2).join('; ')}${outlineCoverageIssues.length > 2 ? '...' : ''})`;
        warnings.push(outlineMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "contributing_factor",
          errorMessage: outlineMsg,
          metadata: { outlineCoverageIssues }
        });
      }

      if (fairPlayAudit && fairPlayAudit.overallStatus !== 'pass') {
        const fairPlayMsg = `  • Fair play audit: ${fairPlayAudit.overallStatus} - may indicate structural CML issues`;
        warnings.push(fairPlayMsg);
        client.getLogger()?.logError({
          runId,
          projectId,
          agent: "ValidationPipeline",
          operation: "contributing_factor",
          errorMessage: fairPlayMsg,
          metadata: { fairPlayAudit }
        });
      }

      const closingSeparator = "═══════════════════════════════════════";
      warnings.push(closingSeparator);
      
      reportProgress("validation", "Story validation failed; attempting prose repair retry", 96);

      // Build targeted guardrails from validation errors (de-duplicated)
      const repairGuardrailSet = new Set<string>();
      repairGuardrailSet.add(
        "Never use placeholder named role constructions (for example 'Detective Surname', 'Inspector Surname', 'a woman Surname', 'a man Surname'). Use canonical cast names only."
      );
      repairGuardrailSet.add(
        "Ensure Act III contains explicit suspect-elimination coverage for every non-culprit suspect, each with concrete evidence or confirmed alibi."
      );
      for (const err of validationReport.errors) {
        if (err.type === "missing_discriminating_test" || err.type === "cml_test_not_realized") {
          repairGuardrailSet.add(
            "The prose MUST include a scene where the detective performs a discriminating test (experiment, re-enactment, trap, or timing test) that explicitly rules out or eliminates at least one suspect with on-page evidence and reasoning."
          );
        }
        if (err.type === "suspect_closure_missing") {
          repairGuardrailSet.add(
            "The prose MUST include a scene in which each non-culprit suspect is explicitly cleared (ruled out, eliminated, alibi confirmed) with stated evidence."
          );
        }
        if (err.type === "culprit_evidence_chain_missing") {
          repairGuardrailSet.add(
            "The prose MUST include a scene where the culprit is identified and the full evidence chain (because, therefore, proof) is laid out."
          );
        }
      }
      const repairGuardrails = Array.from(repairGuardrailSet);

      if (repairGuardrails.length > 0) {
        warnings.push("Prose repair retry: " + repairGuardrails.length + " guardrails applied");
        reportProgress("prose", "Regenerating prose with targeted guardrails...", 96);

        const proseRepairStart = Date.now();
        const repairProseChapterScores: Array<{ chapter: number; total_chapters: number; individual_score: number; cumulative_score: number }> = [];
        let accumulatedRepairChapters: any[] = [];
        const repairedProse = await generateProse(client, {
          caseData: cml,
          outline: narrative,
          cast: cast.cast,
          ...proseModelOverride,
          detectiveType: inputs.detectiveType,
          characterProfiles: characterProfiles,
          locationProfiles: locationProfiles,
          temporalContext: temporalContext,
          moralAmbiguityNote,
          lockedFacts: proseLockedFacts,
          clueDistribution: clues,
          narrativeState,
          targetLength: inputs.targetLength,
          narrativeStyle: inputs.narrativeStyle,
          qualityGuardrails: repairGuardrails,
          writingGuides: loadWritingGuides(),
          runId,
          projectId: projectId || "",
          onProgress: (phase: string, message: string, percentage: number) => reportProgress(phase as any, message, percentage),
          batchSize: inputs.proseBatchSize,
          onBatchComplete: async (batchChapters, _batchStart, batchEnd) => {
            accumulatedRepairChapters = [...accumulatedRepairChapters, ...batchChapters];
            const chapterLabel = `${batchEnd}/${totalSceneCount || batchEnd}`;
            reportProgress(
              "prose",
              `[Repair] Chapter ${chapterLabel} complete`,
              96 + Math.floor((batchEnd / (totalSceneCount || batchEnd)) * 1),
            );
            // Score each repair batch so the Quality tab can show per-chapter
            // scores for both the first prose pass and the repair run.
            if (enableScoring && scoreAggregator) {
              try {
                const repairScorer = new ProseScorer();
                const adaptedBatch = adaptProseForScoring(batchChapters, (cml as any).CASE);
                const batchScore = await repairScorer.score({}, adaptedBatch, {
                  previous_phases: {
                    agent2_cast: cast.cast,
                    agent2b_character_profiles: characterProfiles.profiles,
                    agent2c_location_profiles: locationProfiles,
                  },
                  cml,
                  threshold_config: { mode: 'standard' },
                  targetLength: inputs.targetLength ?? 'medium',
                  partialGeneration: true,
                });
                const adaptedAll = adaptProseForScoring(accumulatedRepairChapters, (cml as any).CASE);
                const cumulScore = await repairScorer.score({}, adaptedAll, {
                  previous_phases: {
                    agent2_cast: cast.cast,
                    agent2b_character_profiles: characterProfiles.profiles,
                    agent2c_location_profiles: locationProfiles,
                  },
                  cml,
                  threshold_config: { mode: 'standard' },
                  targetLength: inputs.targetLength ?? 'medium',
                  partialGeneration: true,
                });
                repairProseChapterScores.push({
                  chapter: batchEnd,
                  total_chapters: totalSceneCount || batchEnd,
                  individual_score: Math.round(batchScore.total ?? 0),
                  cumulative_score: Math.round(cumulScore.total ?? 0),
                });
              } catch {
                // Best-effort — never abort repair generation
              }
            }
          },
        });

        prose = applyDeterministicProsePostProcessing(sanitizeProseResult(repairedProse), locationProfiles);
        agentCosts["agent9_prose"] = (agentCosts["agent9_prose"] || 0) + repairedProse.cost;
        agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseRepairStart);

        // Update the scoreAggregator prose phase to include repair chapter scores
        // so the Quality tab can display both passes side by side.
        if (enableScoring && scoreAggregator && repairProseChapterScores.length > 0) {
          try {
            const repairScorer = new ProseScorer();
            const repairAdapted = adaptProseForScoring(prose.chapters, (cml as any).CASE);
            const repairFinalScore = await repairScorer.score({}, repairAdapted, {
              previous_phases: {
                agent2_cast: cast.cast,
                agent2b_character_profiles: characterProfiles.profiles,
                agent2c_location_profiles: locationProfiles,
              },
              cml,
              threshold_config: { mode: 'standard' },
              targetLength: inputs.targetLength ?? 'medium',
            });
            // Preserve the first-pass chapter scores in the breakdown.
            (repairFinalScore as PhaseScore).breakdown = {
              chapter_scores: [...proseChapterScores],
              repair_chapter_scores: repairProseChapterScores,
            };
            scoreAggregator.upsertPhaseScore(
              "agent9_prose",
              "Prose Generation",
              repairFinalScore as PhaseScore,
              agentDurations["agent9_prose"] ?? 0,
              agentCosts["agent9_prose"] ?? 0,
            );
            await savePartialReport();
          } catch {
            // Best-effort — never abort generation
          }
        }

        // Re-validate
        const repairedStory = {
          id: runId,
          projectId: projectId || runId,
          scenes: prose.chapters.map((ch: any, idx: number) => ({
            number: idx + 1,
            title: ch.title,
            text: ch.paragraphs.join("\n\n"),
          })),
        };

        validationReport = await validationPipeline.validate(repairedStory, {
          ...cml,
          lockedFacts: proseLockedFacts ?? [],
        } as any);

        if (validationReport.status === "passed" || validationReport.status === "needs_review") {
          warnings.push("Prose repair retry improved validation to: " + validationReport.status);
          reportProgress("validation", "Prose repair improved validation: " + validationReport.status, 97);
        } else {
          warnings.push("Prose repair retry did not fully resolve validation: " + validationReport.status);
          reportProgress("validation", "Prose repair: validation still " + validationReport.status, 97);
        }
      } else {
        // No actionable guardrails - just log as warning
        warnings.push("Story validation failed but no recoverable error types found");
      }
      reportProgress("validation", "Story validation: " + validationReport.status, 98);
    }

    // Auto-fix encoding issues
    const fixedStory = validationPipeline.autoFix(storyForValidation);
    let encodingFixesApplied = false;
    
    // Check if any scene text was changed
    for (let i = 0; i < fixedStory.scenes.length; i++) {
      if (fixedStory.scenes[i].text !== storyForValidation.scenes[i].text) {
        encodingFixesApplied = true;
        // Update prose chapters with fixed text
        const fixedParagraphs = fixedStory.scenes[i].text.split('\n\n');
        prose.chapters[i] = {
          ...prose.chapters[i],
          paragraphs: fixedParagraphs,
        };
      }
    }
    
    if (encodingFixesApplied) {
      reportProgress("validation", "Applied auto-fixes for encoding issues", 99);
    }

    prose = applyDeterministicProsePostProcessing(sanitizeProseResult(prose), locationProfiles);

    const releaseGateReasons: string[] = [];
    const hardStopReasons: string[] = [];
    const validationErrorTypes = new Set(validationReport.errors.map((error) => error.type));
    const readabilitySummary = evaluateProseReadability(prose);
    const sceneGrounding = evaluateSceneGroundingCoverage(prose, locationProfiles);
    const templateLeakage = evaluateTemplateLeakage(prose);
    const temporalConsistency = evaluateTemporalConsistency(prose, temporalContext);
    const placeholderLeakage = evaluatePlaceholderLeakage(prose);
    const chapterHeadingArtifacts = evaluateChapterHeadingArtifacts(prose);
    const sensoryVariety = evaluateSensoryVariety(prose);
    const proseContainsIllegalControlChars = prose.chapters.some((chapter) =>
      chapter.paragraphs.some((paragraph) => /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(paragraph)),
    );
    const proseContainsMojibake = prose.chapters.some((chapter) =>
      chapter.paragraphs.some((paragraph) => persistentMojibakePattern.test(paragraph)),
    );
    
    // Fair play audit gate check
    if (fairPlayAudit) {
      const fpValidation = fairPlayAudit.overallStatus === "pass" ? 100 : 
                           fairPlayAudit.overallStatus === "needs-revision" ? 70 : 45;
      const hasZeroScoreViolation = fairPlayAudit.checks?.some((check) => check.status === "fail") ?? false;
      
      if (fpValidation < 60 || hasZeroScoreViolation) {
        const violationSummary = fairPlayAudit.violations.map(v => `${v.rule} (${v.severity})`).join(", ");
        releaseGateReasons.push(`fair play audit score below threshold (${fpValidation}/100)${hasZeroScoreViolation ? " with 0-score violations" : ""}: ${violationSummary}`);
        hardStopReasons.push(`fair play audit failed (${fpValidation}/100): mystery violates fundamental fair play principles`);
      } else if (fairPlayAudit.overallStatus === "needs-revision") {
        releaseGateReasons.push(`fair play audit needs revision (score: ${fpValidation}/100)`);
      }
    }

    if (validationErrorTypes.has("identity_role_alias_break") || validationErrorTypes.has("missing_case_transition_bridge") || validationErrorTypes.has("case_transition_missing")) {
      releaseGateReasons.push("critical continuity issue detected");
    }
    if (validationErrorTypes.has("temporal_contradiction")) {
      releaseGateReasons.push("temporal continuity contradiction detected");
      hardStopReasons.push("temporal continuity contradiction detected");
    }
    if (validationErrorTypes.has("investigator_role_drift")) {
      releaseGateReasons.push("investigator role continuity drift detected");
    }
    if (proseContainsMojibake) {
      releaseGateReasons.push("mojibake/encoding artifact remains");
      hardStopReasons.push("mojibake/encoding artifact remains");
    }
    if (proseContainsIllegalControlChars || validationErrorTypes.has("illegal_character")) {
      releaseGateReasons.push("illegal character/encoding corruption detected");
      hardStopReasons.push("illegal character/encoding corruption detected");
    }
    if (validationErrorTypes.has("missing_discriminating_test") || validationErrorTypes.has("cml_test_not_realized")) {
      releaseGateReasons.push("no valid discriminating test scene");
    }
    if (validationErrorTypes.has("suspect_closure_missing") || validationErrorTypes.has("culprit_evidence_chain_missing")) {
      releaseGateReasons.push("suspect elimination coverage incomplete");
      hardStopReasons.push("suspect elimination coverage incomplete");
    }
    if (templateLeakage.hasLeakage) {
      releaseGateReasons.push(
        `templated prose leakage detected (duplicate long blocks: ${templateLeakage.duplicatedLongParagraphCount}, scaffold matches: ${templateLeakage.scaffoldCount})`
      );
      hardStopReasons.push("templated prose leakage detected");
    }
    if (temporalConsistency.contradictions > 0) {
      releaseGateReasons.push(`month/season contradictions found (${temporalConsistency.details.slice(0, 3).join('; ')})`);
      hardStopReasons.push("month/season contradictions found");
    }
    if (placeholderLeakage.hasLeakage) {
      releaseGateReasons.push(
        `placeholder token leakage detected (role+surname: ${placeholderLeakage.roleSurnameCount}, named standalone placeholders: ${placeholderLeakage.standaloneCount}, generic role phrases: ${placeholderLeakage.genericRoleCount}${placeholderLeakage.examples.length > 0 ? `, examples: ${placeholderLeakage.examples.join(', ')}` : ''})`
      );
      if (placeholderLeakage.severeLeakage) {
        hardStopReasons.push("placeholder token leakage detected");
      }
    }
    if (chapterHeadingArtifacts.hasArtifacts) {
      releaseGateReasons.push(`duplicate chapter heading artifacts detected (${chapterHeadingArtifacts.duplicatedHeadingCount})`);
      hardStopReasons.push("duplicate chapter heading artifacts detected");
    }
    if (sensoryVariety.hasExcessiveRepetition) {
      releaseGateReasons.push(
        `atmospheric sensory palette recycled across >40% of chapters (${sensoryVariety.overusedPhrases.slice(0, 3).join(', ')})`
      );
      warnings.push(
        `Sensory variety warning: ${sensoryVariety.overusedPhrases.length} overused atmospheric phrase(s) detected. Vary imagery across chapters.`
      );
    }
    if (readabilitySummary.denseChapterCount > 0) {
      releaseGateReasons.push(
        `readability density threshold exceeded (dense chapters: ${readabilitySummary.denseChapterCount}, low-paragraph chapters: ${readabilitySummary.underParagraphCount}, overlong blocks: ${readabilitySummary.severeParagraphBlocks})`
      );
    }
    if (sceneGrounding.coverage < 0.9) {
      releaseGateReasons.push(
        `scene-grounding coverage below target (${sceneGrounding.grounded}/${sceneGrounding.total} chapters grounded)`
      );
    }

    warnings.push(`UTF-8/multibyte check: ${proseContainsIllegalControlChars ? "FAILED (illegal control characters found)" : "PASSED (valid Unicode preserved)"}`);

    if (releaseGateReasons.length > 0) {
      releaseGateReasons.forEach((reason) => warnings.push(`Release gate warning: ${reason}`));
      reportProgress("validation", `Release gate warnings: ${releaseGateReasons.join('; ')}`, 99);
    }

    if (hardStopReasons.length > 0) {
      const hardStopMessage = `Release gate hard-stop: ${Array.from(new Set(hardStopReasons)).join('; ')}`;
      errors.push(hardStopMessage);
      reportProgress("validation", hardStopMessage, 99);
      throw new Error(hardStopMessage);
    }

    // ========================================================================
    // Complete
    // ========================================================================
    const totalDurationMs = Date.now() - startTime;
    const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
    
    reportProgress("complete", "Mystery generation complete!", 100);

    // ========================================================================
    // Generate and Save Scoring Report
    // ========================================================================
    let scoringReport: GenerationReport | undefined;
    
    if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
      try {
        scoringReport = scoreAggregator.generateReport({
          story_id: runId,
          started_at: new Date(startTime),
          completed_at: new Date(),
          user_id: projectId,
        });
        await reportRepository.save(scoringReport);
        scoringLogger.logReportGenerated(scoringReport, runId, projectId);
        
        const passedCount = scoringReport.summary.phases_passed;
        const failedCount = scoringReport.summary.phases_failed;
        const avgScore = scoringReport.overall_score.toFixed(1);
        
        warnings.push(`Scoring: ${passedCount}/${passedCount + failedCount} phases passed, avg score ${avgScore}/100 (${scoringReport.overall_grade})`);
      } catch (reportError) {
        warnings.push(`Scoring report generation failed: ${describeError(reportError)}`);
      }
    }

    // Determine overall status
    let status: "success" | "warning" | "failure" = "success";
    if (errors.length > 0) {
      status = "failure";
    } else if (warnings.length > 0) {
      status = "warning";
    }

    return {
      cml,
      clues,
      fairPlayAudit,
      narrative,
      characterProfiles,
      locationProfiles,
      temporalContext,
      backgroundContext,
      hardLogicDevices,
      prose,
      noveltyAudit,
      validationReport,
      scoringReport,
      setting,
      cast,
      metadata: {
        runId,
        projectId,
        totalCost,
        totalDurationMs,
        agentCosts,
        agentDurations,
        revisedByAgent4,
        revisionAttempts,
      },
      status,
      warnings,
      errors,
    };
  } catch (error) {
    // Catastrophic failure
    const errorMessage = describeError(error);
    errors.push(`Pipeline failure: ${errorMessage}`);

    // Save a partial scoring report so aborted runs are visible in the UI
    if (enableScoring && scoreAggregator && reportRepository && scoringLogger) {
      try {
        const partialReport = scoreAggregator.generateReport({
          story_id: runId,
          started_at: new Date(startTime),
          completed_at: new Date(),
          user_id: projectId,
        });
        // Tag the report so the UI can distinguish aborted from complete runs
        (partialReport as any).aborted = true;
        (partialReport as any).abort_reason = errorMessage;
        await reportRepository.save(partialReport);
        scoringLogger.logReportGenerated(partialReport, runId, projectId);
      } catch {
        // best-effort — don't mask the original error
      }
    }

    throw new Error(`Mystery generation failed: ${errorMessage}`);
  }
}

// ============================================================================
// Convenience Function: Generate with Default Settings
// ============================================================================

export async function generateMysterySimple(
  client: AzureOpenAIClient,
  theme: string,
  onProgress?: ProgressCallback
): Promise<MysteryGenerationResult> {
  return generateMystery(
    client,
    {
      theme,
      targetLength: "medium",
      narrativeStyle: "classic",
      skipNoveltyCheck: false,
    },
    onProgress
  );
}
