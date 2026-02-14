/**
 * Agent 2e: Background Context Generator
 *
 * Generates a dedicated backdrop artifact used to ground CML generation separately
 * from hard-logic mechanism ideation.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import { validateArtifact } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { SettingRefinement } from "./agent1-setting.js";
import type { CastDesign } from "./agent2-cast.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface BackgroundContextArtifact {
  status: "ok";
  backdropSummary: string;
  era: {
    decade: string;
    socialStructure?: string;
  };
  setting: {
    location: string;
    institution: string;
    weather?: string;
  };
  castAnchors: string[];
  theme?: string;
}

export interface BackgroundContextInputs {
  settingRefinement: SettingRefinement;
  cast: CastDesign;
  theme?: string;
  tone?: string;
  runId?: string;
  projectId?: string;
}

export interface BackgroundContextResult {
  backgroundContext: BackgroundContextArtifact;
  cost: number;
  durationMs: number;
  attempt: number;
}

const buildBackgroundContextPrompt = (inputs: BackgroundContextInputs, previousErrors?: string[]) => {
  const setting = inputs.settingRefinement;
  const cast = inputs.cast;
  const anchors = cast.characters.map((c) => c.name).filter(Boolean).slice(0, 8);
  const validationFeedback = buildValidationFeedback(previousErrors);

  const system = `You are a narrative grounding specialist for Golden Age mystery design.
Generate a concise, canonical background-context artifact that explains why this cast is here, what social backdrop binds them, and how setting context should shape scene grounding.
Output valid JSON only.`;

  const developer = `Return JSON exactly with this shape:
{
  "status": "ok",
  "backdropSummary": "...",
  "era": {
    "decade": "...",
    "socialStructure": "..."
  },
  "setting": {
    "location": "...",
    "institution": "...",
    "weather": "..."
  },
  "castAnchors": ["..."],
  "theme": "..."
}

Requirements:
- backdropSummary: 1 concise sentence (not a paragraph)
- socialStructure: include class/institution dynamics and shared social pressure
- setting.location and setting.institution must align to provided setting data
- castAnchors must contain 4-8 names from the cast (no new names)
- no mechanism design, no culprit hints, no hard-logic details
- keep this artifact focused on backdrop coherence only

CRITICAL: Ensure castAnchors is an array of strings (character names), not empty${validationFeedback}`;

  const user = `Generate background context for this mystery setup.

Theme: ${inputs.theme || "Classic mystery"}
Tone: ${inputs.tone || "Classic"}
Era decade: ${setting.era.decade}
Social norms: ${(setting.era.socialNorms || []).slice(0, 6).join(", ")}
Location description: ${setting.location.description}
Institution type: ${setting.location.type}
Weather: ${setting.atmosphere.weather}
Mood: ${setting.atmosphere.mood}
Geographic isolation: ${setting.location.geographicIsolation}
Access control: ${(setting.location.accessControl || []).slice(0, 6).join(", ")}

Cast anchors (use these exact names only):
${anchors.map((name, idx) => `${idx + 1}. ${name}`).join("\n")}

Return JSON only.`;

  return {
    messages: [
      { role: "system" as const, content: `${system}\n\n${developer}` },
      { role: "user" as const, content: user },
    ],
  };
};

export async function generateBackgroundContext(
  client: AzureOpenAIClient,
  inputs: BackgroundContextInputs,
  maxAttempts = 2,
): Promise<BackgroundContextResult> {
  const start = Date.now();

  const retryResult = await withValidationRetry({
    maxAttempts,
    agentName: "Agent 2e (Background Context)",
    validationFn: (data) => {
      const validation = validateArtifact("background_context", data);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildBackgroundContextPrompt(inputs, previousErrors);

      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.4,
        maxTokens: 1200,
        jsonMode: true,
        logContext: {
          runId: inputs.runId ?? "",
          projectId: inputs.projectId ?? "",
          agent: "Agent2e-BackgroundContext",
          retryAttempt: attempt,
        },
      });

      let parsed: BackgroundContextArtifact;
      try {
        parsed = JSON.parse(response.content) as BackgroundContextArtifact;
      } catch {
        parsed = JSON.parse(jsonrepair(response.content)) as BackgroundContextArtifact;
      }

      if (!parsed || parsed.status !== "ok") {
        throw new Error("Invalid background context output: missing status=ok");
      }
      if (!parsed.backdropSummary || typeof parsed.backdropSummary !== "string") {
        throw new Error("Invalid background context output: missing backdropSummary");
      }
      if (!Array.isArray(parsed.castAnchors) || parsed.castAnchors.length === 0) {
        throw new Error("Invalid background context output: missing castAnchors");
      }

      const cost = client.getCostTracker().getSummary().byAgent["Agent2e-BackgroundContext"] || 0;

      return { result: parsed, cost };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 2e] Background context validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 2e] Background context failed validation after ${maxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  const durationMs = Date.now() - start;
  const validatedResult = retryResult.result as BackgroundContextArtifact;

  return {
    backgroundContext: validatedResult,
    cost: retryResult.totalCost,
    durationMs,
    attempt: retryResult.attempts,
  };
}
