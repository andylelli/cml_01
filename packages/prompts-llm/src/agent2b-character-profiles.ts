/**
 * Agent 2b: Character Profile Generator
 *
 * Expands cast details into full narrative profiles.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { CastDesign } from "./agent2-cast.js";

export interface CharacterProfileOutput {
  name: string;
  summary?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  alibiWindow?: string;
  accessPlausibility?: string;
  stakes?: string;
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

const buildProfilesPrompt = (inputs: CharacterProfilesInputs) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const castNames = inputs.cast.characters.map((c) => c.name).join(", ");
  const tone = inputs.tone ?? "Cozy";
  const targetWordCount = inputs.targetWordCount ?? 1000;

  const system = `You are a character biography writer for classic mystery fiction. Your task is to expand the provided cast details into full narrative profiles.\n\nRules:\n- Do not introduce new facts beyond the provided cast and CML.\n- Preserve private secrets and motives as given.\n- Avoid stereotypes or reductive framing.\n- Output valid JSON only.`;

  const developer = `# Character Profiles Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "${tone}",\n  "targetWordCount": ${targetWordCount},\n  "profiles": [\n    {\n      "name": "Name",\n      "summary": "1-2 sentence overview",\n      "publicPersona": "...",\n      "privateSecret": "...",\n      "motiveSeed": "...",\n      "alibiWindow": "...",\n      "accessPlausibility": "...",\n      "stakes": "...",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"],\n      "order": 1\n    }\n  ],\n  "note": ""\n}\n\nRequirements:\n- One profile per cast member (${inputs.cast.characters.length}).\n- 4-6 paragraphs per profile (target ~${targetWordCount} words each).\n- Use tone: ${tone}.\n- Keep all facts consistent with the cast details and CML.`;

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
  const prompt = buildProfilesPrompt(inputs);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
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

      const durationMs = Date.now() - start;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2b-CharacterProfiles"] || 0;

      return {
        ...profiles,
        cost,
        durationMs,
      };
    } catch (error) {
      lastError = error as Error;
      if (attempt >= maxAttempts) {
        throw error;
      }
    }
  }

  throw lastError || new Error("Character profile generation failed after all attempts");
}
