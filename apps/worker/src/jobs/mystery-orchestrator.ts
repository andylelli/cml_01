/**
 * Mystery Generation Orchestrator
 *
 * Connects all 8 agents into a complete mystery generation pipeline:
 * Agent 1 â†’ Agent 2 â†’ Agent 3 (+Agent 4) â†’ Agent 5 â†’ Agent 6 â†’ Agent 7 â†’ Agent 8
 *
 * Handles progress tracking, error recovery, cost tracking, and result aggregation.
 */

import { join } from "path";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateCaseData, validateArtifact } from "@cml/cml";
import {
  refineSetting,
  designCast,
  generateCML,
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
} from "@cml/prompts-llm";
import { StoryValidationPipeline } from "@cml/story-validation";
import type { ValidationReport } from "@cml/story-validation";
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
} from "@cml/prompts-llm";

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
  castSize?: number; // 6-12 characters
  castNames?: string[]; // Optional user-provided names
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  
  // Control flags
  skipNoveltyCheck?: boolean; // Skip Agent 8 if desired
  similarityThreshold?: number; // For Agent 8, default 0.7
  
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

const proseMojibakeReplacements: Array<[RegExp, string]> = [
  [/Ã¢â‚¬â„¢/g, "'"],
  [/Ã¢â‚¬Ëœ/g, "'"],
  [/Ã¢â‚¬Å“|Ã¢â‚¬\x9d/g, '"'],
  [/Ã¢â‚¬"|Ã¢â‚¬â€/g, "â€”"],
  [/Ã¢â‚¬â€œ/g, "â€“"],
  [/Ã¢â‚¬Â¦/g, "â€¦"],
  [/faË†Â§ade/g, "faÃ§ade"],
  [/Ã‚/g, ""],
  [/\uFFFD/g, ""],
];

const sanitizeProseText = (value: unknown) => {
  let text = typeof value === "string" ? value : value == null ? "" : String(value);
  text = text.normalize("NFC");
  for (const [pattern, replacement] of proseMojibakeReplacements) {
    text = text.replace(pattern, replacement);
  }
  return text
    .replace(/^Generated in scene batches\.?$/gim, "")
    .replace(/[\u200B-\u200D\uFEFF]/g, "")
    .replace(/\u00A0/g, " ")
    .replace(/\s+$/gm, "")
    .trim();
};

const sanitizeProseResult = (prose: ProseGenerationResult): ProseGenerationResult => ({
  ...prose,
  note: prose.note ? sanitizeProseText(prose.note) || undefined : prose.note,
  chapters: prose.chapters.map((chapter) => ({
    ...chapter,
    title: sanitizeProseText(chapter.title),
    summary: chapter.summary ? sanitizeProseText(chapter.summary) || undefined : chapter.summary,
    paragraphs: chapter.paragraphs.map((paragraph) => sanitizeProseText(paragraph)).filter((p) => p.length > 0),
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

    const examplesDir = join(process.cwd(), "examples");
    const seedEntries = await loadSeedCMLFiles(examplesDir);
    const noveltyConstraints = buildNoveltyConstraints(seedEntries as Array<{ filename: string; cml: CaseData }>);

    // ========================================================================
    // Agent 1: Era & Setting Refiner
    // ========================================================================
    reportProgress("setting", "Refining era and setting...", 0);
    
    const settingStart = Date.now();
    const setting = await refineSetting(client, {
      decade: inputs.eraPreference || "1930s",
      location: locationSpec.location,
      institution: locationSpec.institution,
      tone: inputs.tone,
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent1_setting"] = setting.cost;
    agentDurations["agent1_setting"] = Date.now() - settingStart;
    
    if (
      setting.setting.realism.anachronisms.length > 0 ||
      setting.setting.realism.implausibilities.length > 0
    ) {
      errors.push(
        `Agent 1: Setting realism issues detected (anachronisms=${setting.setting.realism.anachronisms.length}, implausibilities=${setting.setting.realism.implausibilities.length})`
      );
      throw new Error("Setting refinement still contains realism issues");
    }
    
    reportProgress("setting", "Era and setting refined", 12);

    // ========================================================================
    // Agent 2: Cast & Motive Designer
    // ========================================================================
    reportProgress("cast", "Designing cast and motives...", 12);
    
    const castStart = Date.now();
    const cast = await designCast(client, {
      characterNames: inputs.castNames,
      castSize: inputs.castSize || 6,
      setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
      crimeType: "Murder",
      tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
      socialContext: setting.setting.era.socialNorms.join(", "),
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent2_cast"] = cast.cost;
    agentDurations["agent2_cast"] = Date.now() - castStart;
    
    if (cast.cast.diversity.stereotypeCheck.length > 0) {
      errors.push(...cast.cast.diversity.stereotypeCheck.map((w: string) => `Agent 2: ${w}`));
      throw new Error("Cast design failed stereotype guardrails");
    }
    
    reportProgress("cast", `Cast designed (${cast.cast.characters.length} characters)`, 25);
    reportProgress("background-context", "Generating background context...", 25);

    const backgroundContextStart = Date.now();
    const backgroundContextResult = await generateBackgroundContext(client, {
      settingRefinement: setting.setting,
      cast: cast.cast,
      theme: inputs.theme,
      tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
      runId,
      projectId: projectId || "",
    });

    agentCosts["agent2e_background_context"] = backgroundContextResult.cost;
    agentDurations["agent2e_background_context"] = Date.now() - backgroundContextStart;

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

    const hardLogicStart = Date.now();
    const hardLogicDevices = await generateHardLogicDevices(client, {
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
    }, examplesDir);
    
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
        }, examplesDir);

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

    const criticalFairPlayRules = new Set(["Clue Visibility", "Information Parity", "No Withholding", "Logical Deducibility"]);
    const hasCriticalFairPlayFailure = fairPlayAudit.violations.some(
      (v) => v.severity === "critical" || criticalFairPlayRules.has(v.rule),
    );

    if (fairPlayAudit.overallStatus === "fail") {
      if (hasCriticalFairPlayFailure) {
        warnings.push("Agent 6: Fair play audit failed on critical rules after clue regeneration; continuing with warnings");
        fairPlayAudit.violations.forEach((v) => warnings.push(`  - [${v.severity}] ${v.rule}: ${v.description}`));
      } else {
        warnings.push("Agent 6: Fair play audit FAILED after clue regeneration");
      }
      fairPlayAudit.violations.forEach((v) => {
        warnings.push(`  - [${v.severity}] ${v.description}`);
      });
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

    // ========================================================================
    // Agent 7: Narrative Formatter
    // ========================================================================
    reportProgress("narrative", "Formatting narrative structure...", 75);
    
    const narrativeStart = Date.now();
    let narrative = await formatNarrative(client, {
      caseData: cml,
      clues: clues,
      targetLength: inputs.targetLength,
      narrativeStyle: inputs.narrativeStyle,
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent7_narrative"] = narrative.cost;
    agentDurations["agent7_narrative"] = Date.now() - narrativeStart;
    
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
    // Agent 2b: Character Profiles
    // ========================================================================
    reportProgress("profiles", "Generating character profiles...", 88);

    const profilesStart = Date.now();
    const characterProfiles = await generateCharacterProfiles(client, {
      caseData: cml,
      cast: cast.cast,
      tone: inputs.narrativeStyle || "classic",
      targetWordCount: 1000,
      runId,
      projectId: projectId || "",
    });

    agentCosts["agent2b_profiles"] = characterProfiles.cost;
    agentDurations["agent2b_profiles"] = Date.now() - profilesStart;

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

    const locationProfilesStart = Date.now();
    const locationProfiles = await generateLocationProfiles(client, {
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

    const temporalContextStart = Date.now();
    const temporalContext = await generateTemporalContext(client, {
      settingRefinement: setting.setting,
      caseData: cml,
      runId,
      projectId: projectId || "",
    });

    agentCosts["agent2d_temporal_context"] = temporalContext.cost;
    agentDurations["agent2d_temporal_context"] = Date.now() - temporalContextStart;

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
    // Agent 9: Prose Generator
    // ========================================================================
    reportProgress("prose", "Generating full prose...", 91);

    const proseStart = Date.now();
    let prose = await generateProse(client, {
      caseData: cml,
      outline: narrative,
      cast: cast.cast,
      characterProfiles: characterProfiles,
      locationProfiles: locationProfiles,
      temporalContext: temporalContext,
      targetLength: inputs.targetLength,
      narrativeStyle: inputs.narrativeStyle,
      qualityGuardrails: outlineCoverageIssues.length > 0 ? buildOutlineRepairGuardrails(outlineCoverageIssues, cml) : undefined,
      runId,
      projectId: projectId || "",
    });

    prose = sanitizeProseResult(prose);

    const identityAliasIssues = detectIdentityAliasBreaks(prose, cml);
    if (identityAliasIssues.length > 0) {
      warnings.push("Agent 9: Identity continuity guardrail detected role-alias drift; regenerating prose once");
      identityAliasIssues.forEach((issue) => warnings.push(`  - ${issue}`));

      const proseRetryStart = Date.now();
      const retriedProse = await generateProse(client, {
        caseData: cml,
        outline: narrative,
        cast: cast.cast,
        characterProfiles: characterProfiles,
        locationProfiles: locationProfiles,
        temporalContext: temporalContext,
        targetLength: inputs.targetLength,
        narrativeStyle: inputs.narrativeStyle,
        runId,
        projectId: projectId || "",
      });
      prose = sanitizeProseResult(retriedProse);
      agentCosts["agent9_prose"] = retriedProse.cost;
      agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseRetryStart);

      const retryIdentityIssues = detectIdentityAliasBreaks(prose, cml);
      if (retryIdentityIssues.length > 0) {
        retryIdentityIssues.forEach((issue) => errors.push(`Identity continuity failure: ${issue}`));
        throw new Error("Prose identity continuity guardrail failed after retry");
      }
    }

    agentCosts["agent9_prose"] = prose.cost;
    agentDurations["agent9_prose"] = Date.now() - proseStart;

    reportProgress("prose", `Prose generated (${prose.chapters.length} chapters)`, 94);

    // ========================================================================
    // Story Validation
    // ========================================================================
    reportProgress("validation", "Validating story quality...", 96);

    const validationStart = Date.now();
    const validationPipeline = new StoryValidationPipeline();
    
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
    
    let validationReport = await validationPipeline.validate(storyForValidation, cml);
    agentDurations["validation"] = Date.now() - validationStart;

    // Log validation results
    if (validationReport.status === "passed") {
      reportProgress("validation", "Story validation passed!", 98);
    } else if (validationReport.status === "needs_review") {
      warnings.push(`Story validation: ${validationReport.status} - ${validationReport.summary.major} major issues`);
      reportProgress("validation", `Story needs review (${validationReport.summary.major} major issues)`, 98);
    } else if (validationReport.status === "needs_revision") {
      warnings.push(`Story validation: ${validationReport.status} - ${validationReport.summary.major} major, ${validationReport.summary.critical} critical issues`);
      reportProgress("validation", `Story needs revision`, 98);
    } else {
      // Validation failed - attempt prose repair retry with targeted guardrails
      warnings.push("Story validation: " + validationReport.status + " - " + validationReport.summary.critical + " critical, " + validationReport.summary.major + " major issues");
      reportProgress("validation", "Story validation failed; attempting prose repair retry", 96);

      // Build targeted guardrails from validation errors (de-duplicated)
      const repairGuardrailSet = new Set<string>();
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
        const repairedProse = await generateProse(client, {
          caseData: cml,
          outline: narrative,
          cast: cast.cast,
          characterProfiles: characterProfiles,
          locationProfiles: locationProfiles,
          temporalContext: temporalContext,
          targetLength: inputs.targetLength,
          narrativeStyle: inputs.narrativeStyle,
          qualityGuardrails: repairGuardrails,
          runId,
          projectId: projectId || "",
        });

        prose = sanitizeProseResult(repairedProse);
        agentCosts["agent9_prose"] = (agentCosts["agent9_prose"] || 0) + repairedProse.cost;
        agentDurations["agent9_prose"] = (agentDurations["agent9_prose"] || 0) + (Date.now() - proseRepairStart);

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

        validationReport = await validationPipeline.validate(repairedStory, cml);

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

    const releaseGateReasons: string[] = [];
    const validationErrorTypes = new Set(validationReport.errors.map((error) => error.type));
    const proseContainsMojibake = prose.chapters.some((chapter) =>
      chapter.paragraphs.some((paragraph) => /(?:Ã¢â‚¬â„¢|Ã¢â‚¬Ëœ|Ã¢â‚¬Å“|Ã¢â‚¬\x9d|Ã¢â‚¬"|Ã¢â‚¬â€|Ã¢â‚¬â€œ|Ã¢â‚¬Â¦|Ã‚|Ë†Â§|\uFFFD)/.test(paragraph)),
    );

    if (validationErrorTypes.has("identity_role_alias_break") || validationErrorTypes.has("missing_case_transition_bridge") || validationErrorTypes.has("case_transition_missing")) {
      releaseGateReasons.push("critical continuity issue detected");
    }
    if (proseContainsMojibake) {
      releaseGateReasons.push("mojibake/encoding artifact remains");
    }
    if (validationErrorTypes.has("missing_discriminating_test") || validationErrorTypes.has("cml_test_not_realized")) {
      releaseGateReasons.push("no valid discriminating test scene");
    }
    if (validationErrorTypes.has("suspect_closure_missing") || validationErrorTypes.has("culprit_evidence_chain_missing")) {
      releaseGateReasons.push("suspect elimination coverage incomplete");
    }

    if (releaseGateReasons.length > 0) {
      releaseGateReasons.forEach((reason) => warnings.push(`Release gate warning: ${reason}`));
      reportProgress("validation", `Release gate warnings: ${releaseGateReasons.join('; ')}`, 99);
    }

    // ========================================================================
    // Complete
    // ========================================================================
    const totalDurationMs = Date.now() - startTime;
    const totalCost = Object.values(agentCosts).reduce((sum, cost) => sum + cost, 0);
    
    reportProgress("complete", "Mystery generation complete!", 100);

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
