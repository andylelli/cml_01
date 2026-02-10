/**
 * Agent 1: Era & Setting Refiner
 * 
 * Refines user-provided mystery specifications by adding era-specific constraints,
 * technology limits, forensic capabilities, social norms, and location details.
 * This ensures the mystery is grounded in authentic period details.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { Message } from "@cml/llm-client";
import { buildEraConstraints, buildLocationConstraints } from "./shared/constraints.js";

export interface SettingInputs {
  runId: string;
  projectId: string;
  decade: string; // "1920s", "1930s", etc.
  location: string; // "Country manor", "Ocean liner", etc.
  institution?: string; // "Private residence", "Hotel", etc.
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
  const system = `You are a mystery setting specialist with deep knowledge of historical periods, locations, and authentic period details. Your role is to refine user-provided mystery settings by adding realistic era constraints, technology limits, forensic capabilities, social norms, and location-specific details.

You have expertise in:
- Historical authenticity and anachronism detection
- Period-appropriate technology and forensics
- Social structures and class dynamics across eras
- Geographic and architectural details of locations
- Atmospheric storytelling and mood setting`;

  // Developer prompt with constraints
  const eraConstraints = buildEraConstraints(inputs.decade);
  const locationConstraints = inputs.location ? buildLocationConstraints(inputs.location as string, inputs.institution as string) : null;

  const developer = `**Era Constraints Template**

${JSON.stringify(eraConstraints, null, 2)}

**Location Constraints Template**

${locationConstraints ? JSON.stringify(locationConstraints, null, 2) : "No location specified"}

**Output Format**

Generate a JSON object with the following structure:

\`\`\`json
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
\`\`\`

**Key Requirements**:
1. Use the era constraints template to guide technology/forensics/social norms
2. Identify any anachronisms in the user's spec (technology too advanced, social norms wrong)
3. Add realistic physical constraints for the location
4. Provide atmosphere details for immersion
5. Include 3-5 specific recommendations for authenticity`;

  // User prompt with specific settings
  const user = `Refine the following mystery setting:

**Era**: ${inputs.decade}
**Location**: ${inputs.location}${inputs.institution ? `\n**Institution**: ${inputs.institution}` : ''}${inputs.weather ? `\n**Weather**: ${inputs.weather}` : ''}${inputs.socialStructure ? `\n**Social Structure**: ${inputs.socialStructure}` : ''}${inputs.tone ? `\n**Tone**: ${inputs.tone}` : ''}

Analyze this setting and provide:
1. Complete era constraints (technology, forensics, social norms, policing)
2. Detailed location description and physical constraints
3. Atmosphere details for immersion
4. Any anachronisms or implausibilities to avoid
5. Specific recommendations for authenticity

Output JSON only.`;

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
  maxAttempts = 3
): Promise<SettingRefinementResult> {
  const logger = client.getLogger();
  const startTime = Date.now();

  // Build prompt
  const prompt = buildSettingPrompt(inputs);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      // Generate setting refinement
      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model:
          process.env.AZURE_OPENAI_DEPLOYMENT_NAME ||
          process.env.AZURE_OPENAI_DEPLOYMENT_GPT4 ||
          "gpt-4o",
        temperature: 0.3, // Lower temperature for factual accuracy
        maxTokens: 2000,
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
        
        if (attempt < maxAttempts) {
          continue; // Retry
        } else {
          throw new Error(`JSON parsing failed after ${maxAttempts} attempts: ${(parseError as Error).message}`);
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
        
        if (attempt < maxAttempts) {
          continue; // Retry
        } else {
          throw new Error("Setting refinement missing required fields after all attempts");
        }
      }

      const latencyMs = Date.now() - startTime;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent1-SettingRefiner"] || 0;

      // Success!
      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent1-SettingRefiner",
        operation: "refine_setting",
        model: "gpt-4",
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
      
      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Setting refinement failed after all attempts");
}
