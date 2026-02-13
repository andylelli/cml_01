/**
 * Mystery Generation Orchestrator
 *
 * Connects all 8 agents into a complete mystery generation pipeline:
 * Agent 1 → Agent 2 → Agent 3 (+Agent 4) → Agent 5 → Agent 6 → Agent 7 → Agent 8
 *
 * Handles progress tracking, error recovery, cost tracking, and result aggregation.
 */

import { join } from "path";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateCaseData } from "@cml/cml";
import {
  refineSetting,
  designCast,
  generateCML,
  extractClues,
  auditFairPlay,
  formatNarrative,
  generateCharacterProfiles,
  generateProse,
  auditNovelty,
  loadSeedCMLFiles,
} from "@cml/prompts-llm";
import type {
  SettingRefinementResult,
  CastDesignResult,
  CMLGenerationResult,
  ClueDistributionResult,
  FairPlayAuditResult,
  NarrativeOutline,
  CharacterProfilesResult,
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
  stage: "setting" | "cast" | "cml" | "clues" | "fairplay" | "narrative" | "profiles" | "prose" | "novelty" | "novelty_math" | "complete";
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
  prose: ProseGenerationResult;
  noveltyAudit?: NoveltyAuditResult;
  
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

    // ========================================================================
    // Agent 3: CML Generator (+ Agent 4 auto-revision)
    // ========================================================================
    reportProgress("cml", "Generating mystery structure (CML)...", 25);

    const examplesDir = join(process.cwd(), "examples");
    const seedEntries = await loadSeedCMLFiles(examplesDir);
    const noveltyConstraints = buildNoveltyConstraints(seedEntries as Array<{ filename: string; cml: CaseData }>);
    
    const cmlStart = Date.now();
    let cmlResult = await generateCML(client, {
      decade: setting.setting.era.decade,
      location: setting.setting.location.description,
      institution: setting.setting.location.type,
      tone: inputs.tone || inputs.narrativeStyle || "Golden Age Mystery",
      weather: setting.setting.atmosphere.weather,
      socialStructure: setting.setting.era.socialNorms.join(", "),
      theme: inputs.theme,
      castSize: cast.cast.characters.length,
      castNames: cast.cast.characters.map((c: any) => c.name),
      detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
      victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
      complexityLevel: "moderate",
      mechanismFamilies: [],
      primaryAxis: (inputs.primaryAxis || "temporal") as "temporal" | "spatial" | "identity" | "behavioral" | "authority",
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
          castSize: cast.cast.characters.length,
          castNames: cast.cast.characters.map((c: any) => c.name),
          detectiveType: cast.cast.crimeDynamics.detectiveCandidates[0] || "Detective",
          victimArchetype: cast.cast.crimeDynamics.victimCandidates[0] || "Victim",
          complexityLevel: "moderate",
          mechanismFamilies: [],
          primaryAxis: (inputs.primaryAxis || "temporal") as "temporal" | "spatial" | "identity" | "behavioral" | "authority",
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

    if (fairPlayAudit.overallStatus === "fail") {
      warnings.push("Agent 6: Fair play audit FAILED after clue regeneration");
      fairPlayAudit.violations.forEach((v) => {
        warnings.push(`  - [${v.severity}] ${v.description}`);
      });
    } else if (fairPlayAudit.overallStatus === "needs-revision") {
      warnings.push("Agent 6: Fair play needs minor revisions after clue regeneration");
      fairPlayAudit.warnings.forEach((w) => warnings.push(`  - ${w}`));
    }

    reportProgress("fairplay", `Fair play audit: ${fairPlayAudit.overallStatus}`, 75);

    // ========================================================================
    // Agent 7: Narrative Formatter
    // ========================================================================
    reportProgress("narrative", "Formatting narrative structure...", 75);
    
    const narrativeStart = Date.now();
    const narrative = await formatNarrative(client, {
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

    reportProgress("profiles", `Character profiles generated (${characterProfiles.profiles.length})`, 91);

    // ========================================================================
    // Agent 9: Prose Generator
    // ========================================================================
    reportProgress("prose", "Generating full prose...", 91);

    const proseStart = Date.now();
    const prose = await generateProse(client, {
      caseData: cml,
      outline: narrative,
      cast: cast.cast,
      targetLength: inputs.targetLength,
      narrativeStyle: inputs.narrativeStyle,
      runId,
      projectId: projectId || "",
    });

    agentCosts["agent9_prose"] = prose.cost;
    agentDurations["agent9_prose"] = Date.now() - proseStart;

    reportProgress("prose", `Prose generated (${prose.chapters.length} chapters)`, 94);

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
      prose,
      noveltyAudit,
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
