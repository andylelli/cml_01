/**
 * Agent 1: Era & Setting Refiner
 * 
 * Refines user-provided mystery specifications by adding era-specific constraints,
 * technology limits, forensic capabilities, social norms, and location details.
 * This ensures the mystery is grounded in authentic period details.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { Message } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import { buildEraConstraints, buildLocationConstraints } from "./shared/constraints.js";

export interface SettingInputs {
  runId: string;
  projectId: string;
  decade: string; // "1920s", "1930s", etc.
  location: string; // "Country manor", "Ocean liner", etc.
  institution?: string; // "Manor", "Hotel", etc.
  weather?: string; // "Stormy night", "Sunny afternoon", etc.
  socialStructure?: string; // "English aristocracy", "American upper class", etc.
  tone?: string; // "Dark and gritty", "Cozy golden age", etc.
}

export interface SettingRefinement {
  // Era constraints
  era: {
    decade: string;
    technology: string[];
    forensics: string[];
    transportation: string[];
    communication: string[];
    socialNorms: string[];
    policing: string[];
  };
  
  // Location details
  location: {
    type: string;
    description: string;
    physicalConstraints: string[];
    geographicIsolation: string;
    accessControl: string[];
  };
  
  // Atmosphere
  atmosphere: {
    weather: string;
    timeOfDay: string;
    mood: string;
    visualDescription: string;
  };
  
  // Realism checks
  realism: {
    anachronisms: string[];
    implausibilities: string[];
    recommendations: string[];
  };
}

export interface SettingRefinementResult {
  setting: SettingRefinement;
  rawResponse: string;
  attempt: number;
  latencyMs: number;
  cost: number;
}

// Simple hash function to generate variation seeds
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

// Generate variation guidance from runId
const generateVariationSeed = (runId: string): { archStyle: number; nameStyle: number; focusArea: number } => {
  const hash = simpleHash(runId);
  return {
    archStyle: (hash % 5) + 1,        // 1-5: architectural emphasis
    nameStyle: ((hash >> 4) % 5) + 1, // 1-5: naming convention style
    focusArea: ((hash >> 8) % 3) + 1  // 1-3: which detail area to emphasize
  };
};

/**
 * Build prompt for setting refinement
 */
export function buildSettingPrompt(inputs: SettingInputs): {
  system: string;
  developer: string;
  user: string;
  messages: Message[];
} {
  // System prompt
  const system = `You are Agent 1, a historical-setting refiner for Golden Age detective fiction.

Your objective is to transform a rough setting brief into a historically grounded, investigation-ready constraint model.

Non-negotiable rules:
- Prioritize historical plausibility over decorative prose
- Never introduce anachronistic capabilities
- Resolve contradictions before final output
- Return JSON only, matching the requested schema`;

  // Developer prompt with constraints
  const eraConstraints = buildEraConstraints(inputs.decade);
  const locationConstraints = inputs.location ? buildLocationConstraints(inputs.location as string, inputs.institution as string) : null;
  const variationSeed = generateVariationSeed(inputs.runId || inputs.projectId || "");

  const developer = `Mission: produce a high-signal, historically coherent setting package the later agents can trust.

VARIATION DIRECTIVES FOR THIS MYSTERY:
- Architectural Style Emphasis: ${variationSeed.archStyle}/5 (1=minimal, 3=moderate, 5=highly detailed)
- Naming Convention: ${variationSeed.nameStyle}/5 (1=simple/traditional, 5=distinctive/unusual)
- Detail Focus Area: ${variationSeed.focusArea === 1 ? 'Social Hierarchy' : variationSeed.focusArea === 2 ? 'Physical Spaces' : 'Atmospheric Elements'}

Apply variation without breaking plausibility.

Era constraints source:
${JSON.stringify(eraConstraints, null, 2)}

Location constraints source:
${locationConstraints ? JSON.stringify(locationConstraints, null, 2) : "No location specified"}

Output schema (JSON object):
{
  "era": {
    "decade": string,
    "technology": string[],
    "forensics": string[],
    "transportation": string[],
    "communication": string[],
    "socialNorms": string[],
    "policing": string[]
  },
  "location": {
    "type": string,
    "description": string,
    "physicalConstraints": string[],
    "geographicIsolation": string,
    "accessControl": string[]
  },
  "atmosphere": {
    "weather": string,
    "timeOfDay": string,
    "mood": string,
    "visualDescription": string
  },
  "realism": {
    "anachronisms": string[],
    "implausibilities": string[],
    "recommendations": string[]
  }
}

Quality bar:
1. Ground every list in decade/location constraints, not generic filler.
2. Keep investigation relevance high: include access limits, evidence visibility limits, and communication delays.
3. Atmosphere must include 2-3 concrete period anchors (politics, science, or current affairs).
4. If the brief conflicts with period reality, silently correct the output and record the correction in realism.recommendations.
5. realism.recommendations must contain 3-5 specific, actionable items.
6. Final realism.anachronisms and realism.implausibilities must both be empty arrays.

Micro-exemplar (style target, not content to copy):
- Weak: technology: ["cars", "phones"], communication: ["letters"]
- Strong: technology: ["petrol touring cars on county roads", "domestic wiring with frequent outages"], communication: ["party-line telephone exchange", "telegrams via nearest town office"]
- Strong recommendations are concrete and testable, e.g. "Replace fingerprint lab certainty with delayed regional analysis and chain-of-custody uncertainty."

Before finalizing, run a silent checklist:
- Schema complete
- No empty required strings
- No anachronistic capabilities
- Recommendations are specific and period-grounded
- realism.anachronisms = [] and realism.implausibilities = []`;

  // User prompt with specific settings
  const user = `Refine this mystery setting into a production-ready historical constraint profile.

Input brief:
- Era: ${inputs.decade}
- Location: ${inputs.location}${inputs.institution ? `\n- Institution: ${inputs.institution}` : ''}${inputs.weather ? `\n- Weather: ${inputs.weather}` : ''}${inputs.socialStructure ? `\n- Social Structure: ${inputs.socialStructure}` : ''}${inputs.tone ? `\n- Tone: ${inputs.tone}` : ''}

Return one complete JSON object matching the schema.
Do not include markdown or commentary.`;

  // Combine into messages (system+developer combined for Azure OpenAI)
  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}`;
  const messages: Message[] = [
    { role: "system", content: combinedSystem },
    { role: "user", content: user },
  ];

  return {
    system,
    developer,
    user,
    messages,
  };
}

/**
 * Refine setting with Agent 1
 */
export async function refineSetting(
  client: AzureOpenAIClient,
  inputs: SettingInputs,
  maxAttempts?: number
): Promise<SettingRefinementResult> {
  const logger = client.getLogger();
  const startTime = Date.now();
  const config = getGenerationParams().agent1_setting.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  // Build prompt
  const prompt = buildSettingPrompt(inputs);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= resolvedMaxAttempts; attempt++) {
    try {
      // Generate setting refinement
      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model:
          process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
        jsonMode: true, // JSON mode for structured output
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent1-SettingRefiner",
          retryAttempt: attempt,
        },
      });

      // Parse JSON
      let setting: SettingRefinement;
      try {
        setting = JSON.parse(response.content);
      } catch (parseError) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent1-SettingRefiner",
          operation: "parse_json",
          errorMessage: `JSON parse failed: ${(parseError as Error).message}`,
          retryAttempt: attempt,
          metadata: { rawContent: response.content.substring(0, 500) },
        });
        
        if (attempt < resolvedMaxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`JSON parsing failed after ${resolvedMaxAttempts} attempts: ${(parseError as Error).message}`);
        }
      }

      // Validate structure
      if (!setting.era || !setting.location || !setting.atmosphere || !setting.realism) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent1-SettingRefiner",
          operation: "validate_structure",
          errorMessage: "Missing required fields in setting refinement",
          retryAttempt: attempt,
        });
        
        if (attempt < resolvedMaxAttempts) {
          continue; // Retry
        } else {
          throw new Error("Setting refinement missing required fields after all attempts");
        }
      }

      if (setting.realism.anachronisms.length > 0 || setting.realism.implausibilities.length > 0) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent1-SettingRefiner",
          operation: "validate_realism",
          errorMessage: `Non-empty realism lists (anachronisms=${setting.realism.anachronisms.length}, implausibilities=${setting.realism.implausibilities.length})`,
          retryAttempt: attempt,
        });

        if (attempt < resolvedMaxAttempts) {
          continue;
        } else {
          throw new Error("Setting refinement still contains anachronisms or implausibilities after all attempts");
        }
      }

      const latencyMs = Date.now() - startTime;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent1-SettingRefiner"] || 0;

      // Success!
      const modelName = response.model || "unknown";

      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent1-SettingRefiner",
        operation: "refine_setting",
        model: modelName,
        success: true,
        validationStatus: "pass",
        retryAttempt: attempt,
        latencyMs,
        metadata: {
          decade: inputs.decade,
          location: inputs.location,
          anachronisms: setting.realism.anachronisms.length,
        },
      });

      return {
        setting,
        rawResponse: response.content,
        attempt,
        latencyMs,
        cost,
      };
    } catch (error) {
      lastError = error as Error;
      
      await logger.logError({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent1-SettingRefiner",
        operation: "refine_setting",
        errorMessage: (error as Error).message,
        retryAttempt: attempt,
      });
      
      if (attempt >= resolvedMaxAttempts) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Setting refinement failed after all attempts");
}
