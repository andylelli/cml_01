/**
 * Agent 2b: Character Profile Generator
 *
 * Expands cast details into full narrative profiles.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateArtifact } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { CastDesign } from "./agent2-cast.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface CharacterProfileOutput {
  name: string;
  summary?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  alibiWindow?: string;
  accessPlausibility?: string;
  stakes?: string;
  humourStyle?: "understatement" | "dry_wit" | "polite_savagery" | "self_deprecating" | "observational" | "deadpan" | "sardonic" | "blunt" | "none";
  humourLevel?: number;
  speechMannerisms?: string;
  paragraphs: string[];
  order?: number;
}

export interface CharacterProfilesResult {
  status: "draft" | "final";
  tone?: string;
  targetWordCount?: number;
  profiles: CharacterProfileOutput[];
  note?: string;
  cost: number;
  durationMs: number;
}

export interface CharacterProfilesInputs {
  caseData: CaseData;
  cast: CastDesign;
  tone?: string;
  targetWordCount?: number;
  runId?: string;
  projectId?: string;
}

const buildProfilesPrompt = (inputs: CharacterProfilesInputs, previousErrors?: string[]) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const castNames = inputs.cast.characters.map((c) => c.name).join(", ");
  const tone = inputs.tone ?? "Cozy";
  const targetWordCount = inputs.targetWordCount ?? 1000;

  const system = `You are a character biography writer for classic mystery fiction. Your task is to expand the provided cast details into full narrative profiles with distinct voices, humour styles, and speech mannerisms.\n\nRules:\n- Do not introduce new facts beyond the provided cast and CML.\n- Preserve private secrets and motives as given.\n- Avoid stereotypes or reductive framing.\n- Output valid JSON only.`;

  const validationFeedback = buildValidationFeedback(previousErrors);

  const developer = `# Character Profiles Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "${tone}",\n  "targetWordCount": ${targetWordCount},\n  "profiles": [\n    {\n      "name": "Name",\n      "summary": "1-2 sentence overview",\n      "publicPersona": "...",\n      "privateSecret": "...",\n      "motiveSeed": "...",\n      "motiveStrength": "weak|moderate|strong|compelling",\n      "alibiWindow": "...",\n      "accessPlausibility": "...",\n      "stakes": "...",
      "humourStyle": "understatement|dry_wit|polite_savagery|self_deprecating|observational|deadpan|sardonic|blunt|none",
      "humourLevel": 0.0,
      "speechMannerisms": "Brief description of speech patterns, verbal tics, and dialogue mannerisms",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"],\n      "order": 1\n    }\n  ],\n  "note": ""\n}\n\nRequirements:\n- One profile per cast member (${inputs.cast.characters.length}).\n- 4-6 paragraphs per profile (target ~${targetWordCount} words each).\n- Use tone: ${tone}.\n- Keep all facts consistent with the cast details and CML.

CRITICAL FIELD REQUIREMENTS:
- motiveStrength MUST be one of these exact values: "weak", "moderate", "strong", "compelling" (NOT a sentence or description)
- humourStyle MUST be one of: "understatement", "dry_wit", "polite_savagery", "self_deprecating", "observational", "deadpan", "sardonic", "blunt", "none"
- humourLevel MUST be a number from 0.0 to 1.0 (NOT a string)
- All enum fields must match the exact allowed values - do not use descriptions or other text${validationFeedback}

CHARACTER HUMOUR REQUIREMENTS:
- Each character MUST have a humourStyle (one of: understatement, dry_wit, polite_savagery, self_deprecating, observational, deadpan, sardonic, blunt, none).
- Each character MUST have a humourLevel (0.0 to 1.0):
  0.0 = entirely humourless (e.g. grieving widow, stern authority)
  0.1-0.3 = rarely witty, mostly serious
  0.4-0.6 = occasional dry moments, balanced tone
  0.7-0.8 = frequently witty, uses humour as social tool or defence
  0.9-1.0 = pervasively comic presence (use sparingly, max 1 character)
- Assign styles that fit personality: aristocrats tend to understatement or polite_savagery; servants to deadpan or self_deprecating; detectives to dry_wit or observational; young characters to blunt or sardonic.
- BUT surprise occasionally: a colonel with self_deprecating humour or a maid with polite_savagery creates depth.
- speechMannerisms should describe HOW they speak: speech rhythm, favourite phrases, verbal tics, formality level, and how their humour manifests in dialogue.
- NOT every character should be funny. A mystery needs contrast: some characters are earnest, tense, or humourless. This makes the witty ones land harder.
- The detective should typically have dry_wit or observational style at 0.4-0.6 (restrained, precise, never a comedian).`;

  const user = `Write narrative character profiles for the following mystery.\n\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCast: ${castNames}\n\nCast details:\n${JSON.stringify(inputs.cast.characters, null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
};

export async function generateCharacterProfiles(
  client: AzureOpenAIClient,
  inputs: CharacterProfilesInputs,
  maxAttempts = 2
): Promise<CharacterProfilesResult> {
  const start = Date.now();

  const retryResult = await withValidationRetry({
    maxAttempts,
    agentName: "Agent 2b (Character Profiles)",
    validationFn: (data) => {
      // Validate against character_profiles schema
      const validation = validateArtifact("character_profiles", data);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildProfilesPrompt(inputs, previousErrors);

      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.6,
        maxTokens: 4000,
        jsonMode: true,
        logContext: {
          runId: inputs.runId ?? "",
          projectId: inputs.projectId ?? "",
          agent: "Agent2b-CharacterProfiles",
          retryAttempt: attempt,
        },
      });

      let profiles: Omit<CharacterProfilesResult, "cost" | "durationMs">;
      try {
        profiles = JSON.parse(response.content);
      } catch (error) {
        const repaired = jsonrepair(response.content);
        profiles = JSON.parse(repaired);
      }

      if (!Array.isArray(profiles.profiles) || profiles.profiles.length === 0) {
        throw new Error("Invalid character profiles output: missing profiles");
      }

      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2b-CharacterProfiles"] || 0;

      return { result: profiles, cost };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 2b] Character profiles validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 2b] Character profiles failed validation after ${maxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  const durationMs = Date.now() - start;
  const validatedResult = retryResult.result as CharacterProfilesResult;

  return {
    ...validatedResult,
    cost: retryResult.totalCost,
    durationMs,
  };
}
