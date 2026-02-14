/**
 * Agent 5: Clue Distribution & Red Herring Agent
 * 
 * Analyzes validated CML and extracts/organizes clues for fair play.
 * Does NOT add new facts - only derives clues from existing CML structure.
 * 
 * Uses logger from llm-client (like Agents 3 & 4).
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
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
  };
  runId?: string;
  projectId?: string;
}

export interface Clue {
  id: string;                       // Unique clue identifier
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  description: string;              // What the clue is
  sourceInCML: string;              // Where it comes from in CML (for traceability)
  pointsTo: string;                 // What it reveals (without spoiling)
  placement: "early" | "mid" | "late"; // When it should appear
  criticality: "essential" | "supporting" | "optional";
  supportsInferenceStep?: number;   // 1-indexed inference_path step this clue enables
  evidenceType?: "observation" | "contradiction" | "elimination"; // Role the clue plays in the step
}

export interface RedHerring {
  id: string;
  description: string;
  supportsAssumption: string;       // Which false assumption it reinforces
  misdirection: string;             // How it misleads
}

export interface ClueDistributionResult {
  clues: Clue[];
  redHerrings: RedHerring[];
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
}

/**
 * ELEGANT SOLUTION: Pre-analyze CML to generate explicit clue requirements
 * Instead of passive "remember to cover all steps", we give a concrete checklist
 */
function generateExplicitClueRequirements(cml: Record<string, unknown>): RequiredClueSpec[] {
  const requirements: RequiredClueSpec[] = [];
  const caseData = cml.CASE as any;

  // 1. Inference path coverage (observation + contradiction for each step)
  if (Array.isArray(caseData?.inference_path?.steps)) {
    caseData.inference_path.steps.forEach((step: any, idx: number) => {
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

  // 2. Discriminating test evidence
  if (caseData?.discriminating_test?.design) {
    requirements.push({
      requirement: `Generate a clue that provides observable evidence for the discriminating test: "${(caseData.discriminating_test.design || '').substring(0, 100)}..."`,
      supportsInferenceStep: undefined, // Test synthesis, not specific step
      evidenceType: "observation",
      criticality: "essential",
      sourceInCML: `discriminating_test.design`,
      keyTerms: extractKeyTerms(caseData.discriminating_test.design),
      suggestedPlacement: "mid",
      category: inferCategory(caseData.discriminating_test.design)
    });
  }

  // 3. Suspect elimination clues
  if (Array.isArray(caseData?.cast)) {
    const culprits = caseData.culpability?.culprits || [];
    const suspects = caseData.cast.filter((c: any) => 
      c.culprit_eligibility === "eligible" && !culprits.includes(c.name)
    );

    suspects.forEach((suspect: any) => {
      requirements.push({
        requirement: `Generate a clue that provides elimination evidence for suspect: ${suspect.name}`,
        supportsInferenceStep: undefined,
        evidenceType: "elimination",
        criticality: "essential",
        sourceInCML: `cast[${suspect.name}]`,
        keyTerms: [suspect.name],
        suggestedPlacement: "mid",
        category: "testimonial" // Most eliminations are alibi/testimonial
      });
    });
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

/**
 * Build prompt for clue extraction and organization
 */
export function buildCluePrompt(inputs: ClueExtractionInputs): PromptComponents {
  const { cml, clueDensity, redHerringBudget } = inputs;
  const caseData = cml.CASE as any;

  // ELEGANT SOLUTION: Pre-analyze CML to generate explicit requirements
  const requiredClues = generateExplicitClueRequirements(cml);

  // System prompt: Clue extraction specialist (minimal)
  const system = `Golden Age mystery clue specialist. Generate ${requiredClues.length} mandatory + additional clues.

**Rules**:
- Concrete, specific descriptions (not abstract)
- Observable by reader in scenes
- No detective-only information
- Cite sourceInCML
- Missing mandatory clues = regeneration

**Categories**: temporal, spatial, physical, behavioral, testimonial

**Example**: ❌ "Timeline discrepancies" ✅ "Mrs. Whitmore says 9:45, but library clock stopped at 9:15"

Return valid JSON.`;

  // Developer prompt: Compact requirements format
  const densityGuidance = {
    minimal: `0-2`,
    moderate: `2-4`,
    dense: `4-6`,
  };
  
  // Extract constraint counts from CML
  const anchors = caseData?.constraint_space?.time?.anchors || [];
  const contradictions = caseData?.constraint_space?.time?.contradictions || [];
  const actors = caseData?.constraint_space?.access?.actors || [];
  const objects = caseData?.constraint_space?.access?.objects || [];
  const traces = caseData?.constraint_space?.physical?.traces || [];

  let developer = `# ${requiredClues.length} MANDATORY CLUES + ${densityGuidance[clueDensity]} additional

`;

  // Compact table format for requirements
  requiredClues.forEach((req, idx) => {
    developer += `${idx + 1}. ${req.requirement}\n`;
    developer += `   → ${req.evidenceType} | ${req.criticality} | ${req.suggestedPlacement} | ${req.category}`;
    if (req.supportsInferenceStep) developer += ` | step ${req.supportsInferenceStep}`;
    if (req.keyTerms.length > 0) developer += ` | terms: ${req.keyTerms.join(', ')}`;
    developer += `\n\n`;
  });

  developer += `
**Context**: ${caseData.meta?.title} | ${caseData.cast?.length}ch | ${anchors.length}t ${contradictions.length}a ${actors.length}act ${objects.length}obj ${traces.length}tr
**+Clues**: ${densityGuidance[clueDensity]} optional
**RH**: ${redHerringBudget} max (support false assumption: "${caseData.false_assumption?.statement || 'N/A'}")
**Placement**: Early=setup; Mid=evidence; Late=clinchers

**Criticality**: Essential=must-see (early/mid only); Supporting=reinforces; Optional=texture

`;

  const qualityControls = caseData?.quality_controls ?? {};
  const clueTargets = qualityControls?.clue_visibility_requirements ?? {};
  if (Object.keys(qualityControls).length > 0) {
    developer += `## Quality Controls (from CML)

Use these targets to shape clue counts and placement:
- Essential clues minimum: ${clueTargets.essential_clues_min ?? "N/A"}
- Essential clues before test: ${String(clueTargets.essential_clues_before_test ?? "N/A")}
- Early clues minimum: ${clueTargets.early_clues_min ?? "N/A"}
- Mid clues minimum: ${clueTargets.mid_clues_min ?? "N/A"}
- Late clues minimum: ${clueTargets.late_clues_min ?? "N/A"}

If targets conflict with clue density, prioritize fair play (essential clues and early placement).

`;
  }

  if (inputs.fairPlayFeedback) {
    const { overallStatus, violations = [], warnings = [], recommendations = [] } = inputs.fairPlayFeedback;
    developer += `## Fair Play Audit Feedback

The previous fair-play audit returned **${overallStatus ?? "needs-review"}**. Regenerate the clue distribution to resolve these issues:

### Violations
${violations.length > 0 ? violations.map((v, i) => `${i + 1}. [${v.severity}] ${v.rule}: ${v.description} (Fix: ${v.suggestion})`).join("\n") : "None"}

### Warnings
${warnings.length > 0 ? warnings.map((w) => `- ${w}`).join("\n") : "None"}

### Recommendations
${recommendations.length > 0 ? recommendations.map((r) => `- ${r}`).join("\n") : "None"}

**Regeneration Guidance**:
- Keep all clues grounded in existing CML facts (no new facts).
- Adjust clue placement (early/mid/late) so essential clues appear before the discriminating test.
- Ensure the inference path is supported by explicit, discoverable clues.
- If necessary, increase essential clues derived from inference path observations.
- Remove any clue phrasing that implies private detective-only insight or withheld reader information.

`;
  }

  // Output schema (minimal)
  developer += `
**Schema**: clues[]{id, category, description, sourceInCML, pointsTo, placement, criticality, supportsInferenceStep?, evidenceType} + redHerrings[]{id, description, supportsAssumption, misdirection}
**Rule**: ALL ${requiredClues.length} mandatory + ${densityGuidance[clueDensity]} additional + ${redHerringBudget} RH
`;

  // User prompt (ultra-compact)
  const user = `Generate ALL ${requiredClues.length} mandatory + additional clues. Concrete descriptions, cite sources, essential clues must use early/mid placement. Return JSON.`;

  return {
    system,
    developer,
    user,
  };
}

/**
 * Extract and organize clues from validated CML
 */
export async function extractClues(
  client: AzureOpenAIClient,
  inputs: ClueExtractionInputs
): Promise<ClueDistributionResult> {
  const startTime = Date.now();
  const logger = client.getLogger();
  const runId = inputs.runId || `clues-${Date.now()}`;
  const projectId = inputs.projectId || "unknown";

  await logger.logRequest({
    runId,
    projectId,
    agent: "Agent5-ClueExtraction",
    operation: "extract_clues",
    metadata: {
      clueDensity: inputs.clueDensity,
      redHerringBudget: inputs.redHerringBudget,
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
    });

    const response = await client.chat({
      messages: [
        { role: "system", content: prompt.system },
        { role: "developer", content: prompt.developer },
        { role: "user", content: prompt.user },
      ],
      temperature: 0.4, // Low - we want consistent, grounded extraction
      maxTokens: 3000,  // Moderate - clue lists can be detailed
      jsonMode: true,   // Structured output
      logContext: {
        runId,
        projectId,
        agent: "Agent5-ClueExtraction",
        retryAttempt: 0,
      },
    });

    await logger.logResponse({
      runId,
      projectId,
      agent: "Agent5-ClueExtraction",
      operation: "chat_response",
      model: response.model,
      success: true,
      latencyMs: response.latencyMs,
    });

    // Parse JSON response
    const clueData = JSON.parse(response.content);

    // WP3D: Validate supportsInferenceStep and evidenceType on parsed clues
    for (const clue of clueData.clues) {
      if (clue.criticality === "essential" && !clue.supportsInferenceStep) {
        clue.supportsInferenceStep = 0; // Flag as unmapped for guardrail to catch
      }
      if (!clue.evidenceType) {
        clue.evidenceType = "observation"; // Default
      }
    }

    // Organize clues by placement
    const clueTimeline = {
      early: clueData.clues
        .filter((c: Clue) => c.placement === "early")
        .map((c: Clue) => c.id),
      mid: clueData.clues
        .filter((c: Clue) => c.placement === "mid")
        .map((c: Clue) => c.id),
      late: clueData.clues
        .filter((c: Clue) => c.placement === "late")
        .map((c: Clue) => c.id),
    };

    // Fair play checks
    const essentialClues = clueData.clues.filter((c: Clue) => c.criticality === "essential");
    const fairPlayChecks = {
      allEssentialCluesPresent: essentialClues.length >= 3, // Minimum viable
      noNewFactsIntroduced: clueData.clues.every(
        (c: Clue) => c.sourceInCML && c.sourceInCML.trim() !== "" && c.sourceInCML !== "N/A"
      ),
      redHerringsDontBreakLogic: clueData.redHerrings.length <= inputs.redHerringBudget,
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
        clueCount: clueData.clues.length,
        redHerringCount: clueData.redHerrings.length,
        essentialClueCount: essentialClues.length,
        fairPlayPassed: Object.values(fairPlayChecks).every(Boolean),
      },
    });

    return {
      clues: clueData.clues,
      redHerrings: clueData.redHerrings || [],
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
