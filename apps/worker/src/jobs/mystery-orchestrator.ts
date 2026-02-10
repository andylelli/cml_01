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
  NoveltyAuditResult,
} from "@cml/prompts-llm";

// ============================================================================
// Types
// ============================================================================

export interface MysteryGenerationInputs {
  // User preferences
  theme: string; // e.g., "locked room murder in a manor"
  eraPreference?: string; // e.g., "Victorian England" or "1920s America"
  primaryAxis?: "temporal" | "spatial" | "social" | "psychological" | "mechanical";
  
  // Optional refinements
  castSize?: number; // 6-12 characters
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  
  // Control flags
  skipNoveltyCheck?: boolean; // Skip Agent 8 if desired
  similarityThreshold?: number; // For Agent 8, default 0.7
  
  // Tracking
  runId?: string;
  projectId?: string;
}

export interface MysteryGenerationProgress {
  stage: "setting" | "cast" | "cml" | "clues" | "fairplay" | "narrative" | "novelty" | "complete";
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
    // ========================================================================
    // Agent 1: Era & Setting Refiner
    // ========================================================================
    reportProgress("setting", "Refining era and setting...", 0);
    
    const settingStart = Date.now();
    const setting = await refineSetting(client, {
      decade: inputs.eraPreference || "1930s",
      location: "Unspecified Location",
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent1_setting"] = setting.cost;
    agentDurations["agent1_setting"] = Date.now() - settingStart;
    
    if (setting.setting.realism.anachronisms.length > 0) {
      warnings.push(
        `Agent 1: Found ${setting.setting.realism.anachronisms.length} potential anachronisms (corrected)`
      );
    }
    
    reportProgress("setting", "Era and setting refined", 12);

    // ========================================================================
    // Agent 2: Cast & Motive Designer
    // ========================================================================
    reportProgress("cast", "Designing cast and motives...", 12);
    
    const castStart = Date.now();
    const cast = await designCast(client, {
      castSize: inputs.castSize || 6,
      setting: `${setting.setting.era.decade} - ${setting.setting.location.description}`,
      crimeType: "Murder",
      tone: inputs.narrativeStyle || "Golden Age Mystery",
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent2_cast"] = cast.cost;
    agentDurations["agent2_cast"] = Date.now() - castStart;
    
    if (cast.cast.diversity.stereotypeCheck.length > 0) {
      warnings.push(...cast.cast.diversity.stereotypeCheck.map((w: string) => `Agent 2: ${w}`));
    }
    
    reportProgress("cast", `Cast designed (${cast.cast.characters.length} characters)`, 25);

    // ========================================================================
    // Agent 3: CML Generator (+ Agent 4 auto-revision)
    // ========================================================================
    reportProgress("cml", "Generating mystery structure (CML)...", 25);
    
    const cmlStart = Date.now();
    const cmlResult = await generateCML(client, {
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
      runId,
      projectId: projectId || "",
    });
    
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
    
    const cml = cmlResult.cml;
    reportProgress("cml", "Mystery structure generated and validated", 50);

    // ========================================================================
    // Agent 5: Clue Distribution
    // ========================================================================
    reportProgress("clues", "Extracting and organizing clues...", 50);
    
    const cluesStart = Date.now();
    const clues = await extractClues(client, {
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
    
    const fairPlayStart = Date.now();
    const fairPlayAudit = await auditFairPlay(client, {
      caseData: cml,
      clues: clues,
      runId,
      projectId: projectId || "",
    });
    
    agentCosts["agent6_fairplay"] = fairPlayAudit.cost;
    agentDurations["agent6_fairplay"] = Date.now() - fairPlayStart;
    
    if (fairPlayAudit.overallStatus === "fail") {
      errors.push("Agent 6: Fair play audit FAILED");
      fairPlayAudit.violations.forEach((v) => {
        errors.push(`  - [${v.severity}] ${v.description}`);
      });
      // Don't throw - continue pipeline but mark as warning
      warnings.push("Fair play issues detected - manual review required");
    } else if (fairPlayAudit.overallStatus === "needs-revision") {
      warnings.push("Agent 6: Fair play needs minor revisions");
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
    // Agent 8: Novelty Auditor (optional)
    // ========================================================================
    let noveltyAudit: NoveltyAuditResult | undefined;
    
    if (!inputs.skipNoveltyCheck) {
      reportProgress("novelty", "Checking novelty vs seed patterns...", 87);
      
      const noveltyStart = Date.now();
      
      // Load seed CMLs from examples directory
      const examplesDir = join(process.cwd(), "examples");
      const seedCMLs = await loadSeedCMLFiles(examplesDir);
      
      noveltyAudit = await auditNovelty(client, {
        generatedCML: cml,
        seedCMLs: seedCMLs.map((s: any) => s.cml),
        similarityThreshold: inputs.similarityThreshold,
        runId,
        projectId: projectId || "",
      });
      
      agentCosts["agent8_novelty"] = noveltyAudit.cost;
      agentDurations["agent8_novelty"] = Date.now() - noveltyStart;
      
      if (noveltyAudit.status === "fail") {
        errors.push("Agent 8: Novelty audit FAILED - too similar to seed patterns");
        noveltyAudit.violations.forEach((v) => errors.push(`  - ${v}`));
        warnings.push("Generated mystery may be too similar to examples");
      } else if (noveltyAudit.status === "warning") {
        warnings.push("Agent 8: Moderate similarity detected");
        noveltyAudit.warnings.forEach((w) => warnings.push(`  - ${w}`));
      }
      
      reportProgress("novelty", `Novelty check: ${noveltyAudit.status}`, 100);
    } else {
      reportProgress("novelty", "Novelty check skipped", 100);
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
    errors.push(`Pipeline failure: ${error}`);
    
    throw new Error(`Mystery generation failed: ${error}`);
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
