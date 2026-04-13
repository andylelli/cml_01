/**
 * Agent 3b: Hard-Logic Device Ideation
 *
 * Generates novel, contradiction-driven mechanism concepts before CML generation.
 * This ensures the final CML is grounded in explicitly generated novel devices,
 * not only keyword-derived directives.
 */

import type { AzureOpenAIClient, Message } from "@cml/llm-client";
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
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
    moralAmbiguity: typeof record.moralAmbiguity === 'string' && record.moralAmbiguity.trim() ? record.moralAmbiguity.trim() : undefined,
    lockedFacts: Array.isArray(record.lockedFacts)
      ? (record.lockedFacts as any[]).map((f: any) => ({
          id: asString(f?.id, `fact_${index}`),
          value: asString(f?.value, ''),
          description: asString(f?.description, ''),
          ...(Array.isArray(f?.appearsInChapters) ? { appearsInChapters: (f.appearsInChapters as any[]).map(String) } : {}),
        })).filter((f: { value: string }) => f.value.length > 0)
      : undefined,
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
      "modeTags": string[],
      "moralAmbiguity": string,
      "lockedFacts": [
        { "id": "clock_reading", "value": "ten minutes past eleven", "description": "The exact time shown on the stopped clock face" },
        { "id": "tamper_amount", "value": "forty minutes", "description": "The exact amount the clock was wound back" }
      ]

NOTE — TIME VALUES IN lockedFacts: All clock times MUST be written in old-style English word form. 
CORRECT: "ten minutes past eleven", "a quarter to three", "twenty past midnight"
WRONG: "11:10 PM", "11:10", "23:10", "2:45", "12:20 AM"
Never use digits, colons, AM/PM, or 24-hour notation for any time locked fact.

NOTE — QUANTITIES IN lockedFacts: ALL numeric values MUST be written in word form, not digits.
CORRECT: "forty minutes", "fourteen feet", "six pounds", "thirty yards"
WRONG: "40 minutes", "14 feet", "6 pounds", "30 yards"
This applies to durations, distances, weights, temperatures, counts — every value.

NOTE — ERA MEASUREMENT UNITS: This is a ${inputs.decade} story. All measurements MUST use the period-standard imperial system.
- Distance / length: feet, inches, yards, miles  —  NEVER metres, centimetres, kilometres
- Weight / mass: ounces, pounds, stones, tons  —  NEVER grams, kilograms
- Temperature: degrees Fahrenheit  —  NEVER Celsius or Centigrade
- Volume: pints, gallons, fluid ounces  —  NEVER litres, millilitres
CORRECT: "fourteen feet", "six pounds three ounces", "ninety-eight point six degrees Fahrenheit"
WRONG: "four metres", "three kilograms", "thirty-seven degrees Celsius"
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
6) For each device, include a 'moralAmbiguity' field: one sentence explaining a gray area that makes the crime morally complex (why a reader might feel unexpected sympathy for the culprit, or be disturbed by the verdict).
7) For the primary device (first in the list), populate 'lockedFacts' with 2-4 specific physical values that must appear verbatim in the prose — clock times, compass bearings, temperatures, distances, weights, counts. These become irrefutable ground truth that the prose agent must never contradict across chapters. Other devices may include lockedFacts if appropriate, or omit the field.
   CRITICAL — TIME FORMAT: Any clock time in lockedFacts MUST be written in old-style English word form. Examples: "ten minutes past eleven", "a quarter to three", "twenty past midnight", "half past nine at night". NEVER use digit notation such as "11:10 PM", "11:10", "23:10", or "2:45".
   CRITICAL — WORD FORM FOR ALL VALUES: Every numeric value in lockedFacts must be spelled out in words. Write "forty minutes" not "40 minutes", "fourteen feet" not "14 feet", "six pounds" not "6 lbs". Digits in locked fact values break the repair system.
   CRITICAL — IMPERIAL UNITS: All measurements must use the imperial system standard for ${inputs.decade} stories. Distances in feet/yards/miles, weights in ounces/pounds/stones, temperatures in degrees Fahrenheit, volumes in pints/gallons. NEVER use metric units (metres, centimetres, kilograms, litres, Celsius/Centigrade).

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
  maxAttempts?: number,
): Promise<HardLogicDeviceResult> {
  const logger = client.getLogger();
  const startTime = Date.now();
  const config = getGenerationParams().agent3b_hard_logic_devices.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  const retryResult = await withValidationRetry({
    maxAttempts: resolvedMaxAttempts,
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
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
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
        const trimmed = response.content.trim();
        if (!trimmed.endsWith('}')) {
          throw new Error(`Response appears truncated (ends with: ...${trimmed.slice(-40).replace(/\n/g, '\\n')}). Increase max_tokens or reduce output size.`);
        }
        parsed = JSON.parse(trimmed) as Record<string, unknown>;
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
      `[Agent 3b] Hard logic devices failed validation after ${resolvedMaxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  return retryResult.result as HardLogicDeviceResult;
}
