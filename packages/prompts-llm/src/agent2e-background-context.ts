/**
 * Agent 2e: Background Context Generator
 *
 * Generates a dedicated backdrop artifact used to ground CML generation separately
 * from hard-logic mechanism ideation.
 */

import { generateJsonArtifact } from "./shared/json-artifact-generator.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import { getGenerationParams } from "@cml/story-validation";
import type { SettingRefinement } from "./agent1-setting.js";
import type { CastDesign } from "./agent2-cast.js";
import { buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

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

Quality bar:
- backdropSummary should explain social pressure and why this specific cast shares the same narrative arena.
- Theme should be concrete enough to guide scene tone, but must not pre-solve culprit logic.
- castAnchors should prioritize socially central characters (detective, victim-adjacent, institutional gatekeepers).

Micro-exemplars:
- Weak backdropSummary: "They are all connected by events at the manor."
- Strong backdropSummary: "An inheritance hearing keeps heirs, staff, and creditors under one roof while public scandal makes private loyalties expensive."

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
  maxAttempts?: number,
): Promise<BackgroundContextResult> {
  const config = getGenerationParams().agent2e_background_context.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  // CR-20 (A1X-03): the shell 2b, 2c, 2d and 2e each wrote out — shared/json-artifact-generator.ts.
  const { result, cost, durationMs, attempts } = await generateJsonArtifact<BackgroundContextArtifact>(client, {
    agentName: "Agent 2e (Background Context)",
    label: "Agent2e-BackgroundContext",
    logName: "[Agent 2e] Background context",
    schema: "background_context",
    withRunMeta: false,
    maxAttempts: resolvedMaxAttempts,
    model: config.model,
    runId: inputs.runId,
    projectId: inputs.projectId,
    guard: true,
    buildMessages: (previousErrors) => buildBackgroundContextPrompt(inputs, previousErrors).messages,
    structuralCheck: (parsed) => {
      if (!parsed || parsed.status !== "ok") {
        throw new Error("Invalid background context output: missing status=ok");
      }
      if (!parsed.backdropSummary || typeof parsed.backdropSummary !== "string") {
        throw new Error("Invalid background context output: missing backdropSummary");
      }
      if (!Array.isArray(parsed.castAnchors) || parsed.castAnchors.length === 0) {
        throw new Error("Invalid background context output: missing castAnchors");
      }
    },
  });
  const validatedResult = result as BackgroundContextArtifact;

  return {
    backgroundContext: validatedResult,
    cost: cost,
    durationMs,
    attempt: attempts,
  };
}
