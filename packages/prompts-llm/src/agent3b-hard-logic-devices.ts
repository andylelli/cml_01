/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Generates novel, contradiction-driven mechanism concepts before CML generation.
 * This ensures the final CML is grounded in explicitly generated novel devices,
 * not only keyword-derived directives.
 */

import type { AzureOpenAIClient, Message } from "@cml/llm-client";
import { validateArtifact } from "@cml/cml";
import type { HardLogicDeviceIdea } from "./types.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface HardLogicDeviceInputs {
  runId: string;
  projectId: string;
  decade: string;
  location: string;
  institution: string;
  tone: string;
  theme?: string;
  primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
  mechanismFamilies?: string[];
  hardLogicModes?: string[];
  difficultyMode?: "standard" | "increase" | "extreme";
  noveltyConstraints?: {
    divergeFrom: string[];
    areas: string[];
    avoidancePatterns: string[];
  };
}

export interface HardLogicDeviceResult {
  status: "ok";
  overview: string;
  devices: HardLogicDeviceIdea[];
  rawResponse: string;
  attempt: number;
  latencyMs: number;
  cost: number;
}

const principleTypeValues = new Set([
  "physical_law",
  "mathematical_principle",
  "cognitive_bias",
  "social_logic",
]);

const asString = (value: unknown, fallback: string) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

const asStringArray = (value: unknown, fallback: string[] = []) =>
  Array.isArray(value)
    ? value.map((item) => String(item ?? "").trim()).filter((item) => item.length > 0)
    : fallback;

const normalizeDevice = (value: unknown, index: number): HardLogicDeviceIdea => {
  const record = value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

  const principleTypeRaw = asString(record.principleType, "physical_law");
  const principleType = principleTypeValues.has(principleTypeRaw)
    ? (principleTypeRaw as HardLogicDeviceIdea["principleType"])
    : "physical_law";

  return {
    title: asString(record.title, `Device Concept ${index + 1}`),
    corePrinciple: asString(record.corePrinciple, "Constraint-driven contradiction"),
    principleType,
    surfaceIllusion: asString(record.surfaceIllusion, "An apparently impossible sequence of events"),
    underlyingReality: asString(record.underlyingReality, "A hidden but fair-play mechanism resolves the contradiction"),
    fairPlayClues: asStringArray(record.fairPlayClues, ["Observable timing inconsistency", "Access-path contradiction"]),
    whyNotTrope: asString(record.whyNotTrope, "Uses a fresh constraint interaction rather than a stock shortcut"),
    variationEscalation: asString(record.variationEscalation, "Add one extra constraint interaction while preserving solvability"),
    mechanismFamilyHints: asStringArray(record.mechanismFamilyHints, ["constraint contradiction"]),
    modeTags: asStringArray(record.modeTags),
  };
};

export function buildHardLogicDevicePrompt(inputs: HardLogicDeviceInputs, previousErrors?: string[]): {
  system: string;
  developer: string;
  user: string;
  messages: Message[];
} {
  const hardLogicModes = inputs.hardLogicModes ?? [];
  const mechanismFamilies = inputs.mechanismFamilies ?? [];
  const difficultyMode = inputs.difficultyMode ?? "standard";
  const validationFeedback = buildValidationFeedback(previousErrors);

  const noveltySection = inputs.noveltyConstraints
    ? `
Novelty constraints:
- Diverge from: ${inputs.noveltyConstraints.divergeFrom.join(", ") || "(none)"}
- Required divergence areas: ${inputs.noveltyConstraints.areas.join(", ") || "(none)"}
- Avoid patterns: ${inputs.noveltyConstraints.avoidancePatterns.join(" | ") || "(none)"}
`
    : "";

  const system = `You are a Golden Age detective plot engineer (1920-1945), specializing in fair-play hard-logic murder mechanisms.

Your job is to propose novel mechanism devices that are contradiction-driven and period-solvable.

Hard constraints:
- No modern electronics, DNA, CCTV, digital records, or post-1945 science.
- No lazy trope shortcuts (twins-as-solution, secret passages with no clueability, confession-only endings).
- Every mechanism must hinge on at least one of: physical law, mathematical principle, cognitive bias, social logic.
- Each concept must include visible fair-play clues and a falsifiable discriminating path.`;

  const developer = `Uniqueness Seed: ${inputs.runId}-${inputs.projectId}
Use the seed to vary concepts while staying coherent with the spec.

Spec context:
- Decade: ${inputs.decade}
- Location: ${inputs.location}
- Institution: ${inputs.institution}
- Tone: ${inputs.tone}
- Theme: ${inputs.theme ?? "(none specified)"}
- Primary axis: ${inputs.primaryAxis}
- Mechanism family hints: ${mechanismFamilies.join(", ") || "(none)"}
- Hard-logic mode tags: ${hardLogicModes.join(", ") || "standard varied mix"}
- Difficulty mode: ${difficultyMode}
${noveltySection}
Output JSON only, with this exact structure:

{
  "overview": string,
  "devices": [
    {
      "title": string,
      "corePrinciple": string,
      "principleType": "physical_law" | "mathematical_principle" | "cognitive_bias" | "social_logic",
      "surfaceIllusion": string,
      "underlyingReality": string,
      "fairPlayClues": string[],
      "whyNotTrope": string,
      "variationEscalation": string,
      "mechanismFamilyHints": string[],
      "modeTags": string[]
    }
  ]
}

Default target is 5 varied devices.
Do not include markdown fences or extra commentary.

CRITICAL: Ensure principleType is one of the four exact values: "physical_law", "mathematical_principle", "cognitive_bias", "social_logic"${validationFeedback}`;

  const user = `Generate novel hard-logic mechanism devices now.

Requirements:
1) Return exactly 5 devices unless there is an explicit impossibility (then still return at least 3).
2) Ensure each device can be transformed into a CML false assumption + discriminating test.
3) Keep clues observable by readers before reveal.
4) Make mechanisms diagrammable and contradiction-driven.
5) If difficulty is "increase" or "extreme", include at least one multi-step or precision-timing construction.

Return JSON only.`;

  const combinedSystem = `${system}\n\n# Technical Specifications\n\n${developer}`;
  const messages: Message[] = [
    { role: "system", content: combinedSystem },
    { role: "user", content: user },
  ];

  return { system, developer, user, messages };
}

export async function generateHardLogicDevices(
  client: AzureOpenAIClient,
  inputs: HardLogicDeviceInputs,
  maxAttempts = 3,
): Promise<HardLogicDeviceResult> {
  const logger = client.getLogger();
  const startTime = Date.now();

  const retryResult = await withValidationRetry({
    maxAttempts,
    agentName: "Agent 3b (Hard Logic Devices)",
    validationFn: (data) => {
      const validation = validateArtifact("hard_logic_devices", data);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildHardLogicDevicePrompt(inputs, previousErrors);

      const response = await client.chatWithRetry({
        messages: prompt.messages,
        model:
          process.env.AZURE_OPENAI_DEPLOYMENT_NAME!,
        temperature: 0.7,
        maxTokens: 2600,
        jsonMode: true,
        logContext: {
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          retryAttempt: attempt,
        },
      });

      let parsed: Record<string, unknown>;
      try {
        parsed = JSON.parse(response.content) as Record<string, unknown>;
      } catch (parseError) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          operation: "parse_json",
          errorMessage: `JSON parse failed: ${(parseError as Error).message}`,
          retryAttempt: attempt,
        });
        throw new Error(`Hard-logic device JSON parsing failed: ${(parseError as Error).message}`);
      }

      const rawDevices = Array.isArray(parsed.devices) ? parsed.devices : [];
      const devices = rawDevices.map((device, index) => normalizeDevice(device, index)).slice(0, 5);

      if (devices.length < 3) {
        await logger.logError({
          runId: inputs.runId,
          projectId: inputs.projectId,
          agent: "Agent3b-HardLogicDeviceGenerator",
          operation: "validate_devices",
          errorMessage: `Expected at least 3 devices, got ${devices.length}`,
          retryAttempt: attempt,
        });
        throw new Error("Hard-logic device generation returned too few valid devices");
      }

      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent3b-HardLogicDeviceGenerator"] || 0;

      await logger.logResponse({
        runId: inputs.runId,
        projectId: inputs.projectId,
        agent: "Agent3b-HardLogicDeviceGenerator",
        operation: "generate_hard_logic_devices",
        model: response.model || "unknown",
        success: true,
        validationStatus: "pass",
        retryAttempt: attempt,
        latencyMs: Date.now() - startTime,
        metadata: {
          primaryAxis: inputs.primaryAxis,
          deviceCount: devices.length,
          difficultyMode: inputs.difficultyMode || "standard",
        },
      });

      return {
        result: {
          status: "ok" as const,
          overview: asString(parsed.overview, "Novel hard-logic devices prepared for CML grounding."),
          devices,
          rawResponse: response.content,
          attempt,
          latencyMs: Date.now() - startTime,
          cost,
        },
        cost,
      };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 3b] Hard logic devices validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 3b] Hard logic devices failed validation after ${maxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  return retryResult.result as HardLogicDeviceResult;
}
