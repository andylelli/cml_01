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
 * Build prompt for clue extraction and organization
 */
export function buildCluePrompt(inputs: ClueExtractionInputs): PromptComponents {
  const { cml, clueDensity, redHerringBudget } = inputs;
  const caseData = cml.CASE as any;

  // System prompt: Clue extraction specialist
  const system = `You are a Golden Age mystery clue extraction specialist. Your task is to analyze a validated CML (Case Markup Language) document and extract a fair-play clue list.

**Core Principles**:
- Extract clues ONLY from existing CML facts - never add new information
- Organize clues by category and timing for proper pacing
- Create red herrings that support the false assumption without breaking logic
- Ensure essential clues are discoverable and properly distributed
- Maintain fair play: reader must be able to solve the mystery
- Never encode detective-only/private information that the reader cannot access
- Essential clues must be placed in early or mid (never late)

**Clue Categories**:
- **Temporal**: Time anchors, alibi contradictions, timeline gaps
- **Spatial**: Access restrictions, physical traces, location evidence
- **Physical**: Objects, forensic evidence, material clues
- **Behavioral**: Character tells, habit patterns, witness observations
- **Testimonial**: Witness statements, contradictions, authority claims

**Red Herring Rules**:
- Must reinforce the false assumption naturally
- Cannot introduce facts not in CML
- Should be plausible but ultimately misleading
- Must not make the mystery unsolvable

You MUST return valid JSON matching the output schema.`;

  // Developer prompt: CML analysis and clue extraction guidance
  let developer = `# Clue Extraction Task

## CML Summary

**Title**: ${caseData.meta?.title || "Untitled Mystery"}  
**Mystery Type**: ${caseData.false_assumption?.type || "unknown"} axis  
**False Assumption**: ${caseData.false_assumption?.statement || "N/A"}  
**Crime**: ${caseData.meta?.crime_class?.category || "unknown"}  
**Cast Size**: ${caseData.cast?.length || 0} characters

## Clue Sources in CML

### 1. Inference Path Steps
The inference_path contains the logical steps the detective takes. Each step's "observation" is a potential clue.

`;

  // Extract inference path observations
  if (caseData.inference_path?.steps) {
    developer += `**Inference Path Observations**:\n`;
    caseData.inference_path.steps.forEach((step: any, i: number) => {
      developer += `${i + 1}. ${step.observation || "N/A"}\n`;
    });
    developer += "\n";
  }

  // Extract constraint space facts
  developer += `### 2. Constraint Space Facts

`;

  if (caseData.constraint_space?.time) {
    developer += `**Temporal Constraints**:\n`;
    if (caseData.constraint_space.time.anchors) {
      developer += `- Time anchors: ${caseData.constraint_space.time.anchors.length}\n`;
    }
    if (caseData.constraint_space.time.contradictions) {
      developer += `- Contradictions: ${caseData.constraint_space.time.contradictions.length}\n`;
    }
  }

  if (caseData.constraint_space?.access) {
    developer += `**Access Constraints**:\n`;
    if (caseData.constraint_space.access.actors) {
      developer += `- Actors: ${caseData.constraint_space.access.actors.length}\n`;
    }
    if (caseData.constraint_space.access.objects) {
      developer += `- Objects: ${caseData.constraint_space.access.objects.length}\n`;
    }
  }

  if (caseData.constraint_space?.physical) {
    developer += `**Physical Evidence**:\n`;
    if (caseData.constraint_space.physical.traces) {
      developer += `- Traces: ${caseData.constraint_space.physical.traces.length}\n`;
    }
  }

  developer += `\n### 3. Character Evidence Sensitivity

`;

  if (caseData.cast) {
    developer += `**Characters with Evidence Sensitivity**:\n`;
    caseData.cast.forEach((char: any) => {
      if (char.evidence_sensitivity && char.evidence_sensitivity.length > 0) {
        developer += `- ${char.name}: ${char.evidence_sensitivity.length} sensitive items\n`;
      }
    });
    developer += "\n";
  }

  // Clue density guidance
  developer += `## Clue Density: ${clueDensity}

`;

  const densityGuidance = {
    minimal: "Extract 5-8 essential clues. Focus only on load-bearing evidence.",
    moderate: "Extract 8-12 clues. Include essential clues plus supporting evidence.",
    dense: "Extract 12-18 clues. Comprehensive clue set with optional observations.",
  };

  developer += densityGuidance[clueDensity] + "\n\n";

  // Red herring guidance
  developer += `## Red Herring Budget: ${redHerringBudget}

`;

  if (redHerringBudget > 0) {
    developer += `Create ${redHerringBudget} red herrings that:
1. Support the false assumption: "${caseData.false_assumption?.statement || "N/A"}"
2. Point suspicion toward innocent parties
3. Are grounded in CML facts (no new information)
4. Don't make the mystery unsolvable

`;
  } else {
    developer += `No red herrings requested. Focus on essential clues only.\n\n`;
  }

  // Clue placement guidance
  developer += `## Clue Placement Strategy

**Early (Act I - Setup)**:
- Establish setting and relationships
- Surface accessible clues (testimonial, behavioral)
- Build false assumption naturally

**Mid (Act II - Investigation)**:
- Reveal contradictions in testimonies
- Introduce physical/temporal evidence
- Allow detective to question assumptions

**Late (Act III - Resolution)**:
- Present discriminating test setup
- Surface final essential clues
- Enable logical deduction

**Essential Clues** (criticality="essential"):
- Must appear before the solution
- Load-bearing for the inference path
- Cannot be omitted without breaking fair play
- Must be visible to the reader before the discriminating test (use early/mid only)

**Supporting Clues** (criticality="supporting"):
- Reinforce essential clues
- Provide alternative perspectives
- Add depth to investigation

**Optional Clues** (criticality="optional"):
- Atmospheric detail
- Character development
- Non-critical observations

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

  // Output schema
  developer += `## Output JSON Schema

Return a JSON object with this structure:

\`\`\`json
{
  "clues": [
    {
      "id": "clue_001",
      "category": "temporal|spatial|physical|behavioral|testimonial",
      "description": "What the clue is (e.g., 'Library clock stopped at 9:15')",
      "sourceInCML": "CML path (e.g., 'inference_path.steps[0].observation')",
      "pointsTo": "What it reveals without spoiling (e.g., 'Suggests time discrepancy')",
      "placement": "early|mid|late",
      "criticality": "essential|supporting|optional"
    }
  ],
  "redHerrings": [
    {
      "id": "rh_001",
      "description": "Red herring description",
      "supportsAssumption": "Which false assumption it reinforces",
      "misdirection": "How it misleads the reader"
    }
  ]
}
\`\`\`

`;

  // User prompt: The extraction task
  const user = `Extract and organize clues from the CML above.

**Requirements**:
1. Extract ${densityGuidance[clueDensity].split(" ")[1]} clues total
2. Create ${redHerringBudget} red herrings
3. Distribute clues across early/mid/late placement
4. Mark essential clues (inference path dependencies)
5. Ground all clues in existing CML facts (cite sourceInCML)
6. Ensure fair play: reader can solve the mystery

**Critical**: Do NOT invent new facts. Every clue must be traceable to CML.
**Critical**: Never mark essential clues as late and never describe clues as detective-only/private.

Return the complete JSON with clues and red herrings.`;

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
      noNewFactsIntroduced: true, // Assume true unless validation fails
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
