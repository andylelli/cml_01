/**
 * Agent 9: Prose Generator
 *
 * Generates full narrative prose from the narrative outline + CML + cast.
 * Output Format: JSON (chapters with paragraphs)
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { NarrativeOutline } from "./agent7-narrative.js";
import type { CastDesign } from "./agent2-cast.js";

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ProseGenerationInputs {
  caseData: CaseData;
  outline: NarrativeOutline;
  cast: CastDesign;
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  runId?: string;
  projectId?: string;
}

export interface ProseGenerationResult {
  status: "draft" | "final";
  tone?: string;
  chapters: ProseChapter[];
  cast: string[];
  note?: string;
  cost: number;
  durationMs: number;
}

const buildContextSummary = (caseData: CaseData, cast: CastDesign) => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const crimeClass = meta.crime_class ?? {};
  const era = meta.era?.decade ?? "Unknown era";
  const location = meta.setting?.location ?? "Unknown setting";
  const title = meta.title ?? "Untitled Mystery";
  const falseAssumption = cmlCase.false_assumption?.statement ?? "";
  const culpritNames = cmlCase.culpability?.culprits ?? [];
  const culprit = Array.isArray(culpritNames) ? culpritNames.join(", ") : "Unknown";
  const castNames = cast.characters.map((c) => c.name).join(", ");

  return `# Case Overview\nTitle: ${title}\nEra: ${era}\nSetting: ${location}\nCrime: ${crimeClass.category ?? "murder"} (${crimeClass.subtype ?? "unknown"})\nCulprit: ${culprit}\nFalse assumption: ${falseAssumption}\nCast: ${castNames}\n\nSetting Lock: Keep all scenes and descriptions consistent with the stated setting (${location}). Do not introduce a different location type.`;
};

const buildProsePrompt = (inputs: ProseGenerationInputs, scenesOverride?: unknown[], chapterStart = 1) => {
  const { outline, targetLength = "medium", narrativeStyle = "classic" } = inputs;
  const outlineActs = Array.isArray(outline.acts) ? outline.acts : [];
  const scenes = Array.isArray(scenesOverride)
    ? scenesOverride
    : outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));

  const system = `You are a prose generator for classic mystery fiction. Your role is to write narrative chapters from a provided outline and CML facts.\n\nRules:\n- Do not introduce new facts beyond the CML and outline.\n- Preserve all clues, alibis, and the core mystery logic.\n- Maintain strict setting fidelity to the specified location and era.\n- Avoid stereotypes and reduce bias.\n- Keep language original; do not copy copyrighted text.\n- Output valid JSON only.`;

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has 2-4 paragraphs.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).`;

  const user = `Write the full prose following the outline scenes.\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(scenes, null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
};

const chunkScenes = (scenes: unknown[], chunkSize: number) => {
  const batches: unknown[][] = [];
  for (let i = 0; i < scenes.length; i += chunkSize) {
    batches.push(scenes.slice(i, i + chunkSize));
  }
  return batches;
};

const parseProseResponse = (content: string) => {
  try {
    return JSON.parse(content) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  } catch (error) {
    const repaired = jsonrepair(content);
    return JSON.parse(repaired) as Omit<ProseGenerationResult, "cost" | "durationMs">;
  }
};

const validateChapterCount = (chapters: ProseChapter[], expected: number) => {
  if (!Array.isArray(chapters) || chapters.length === 0) {
    throw new Error("Invalid prose output: missing chapters");
  }
  if (expected > 0 && chapters.length !== expected) {
    throw new Error(`Invalid prose output: expected ${expected} chapters, got ${chapters.length}`);
  }
};

export async function generateProse(
  client: AzureOpenAIClient,
  inputs: ProseGenerationInputs,
  maxAttempts = 2
): Promise<ProseGenerationResult> {
  const start = Date.now();
  const outlineActs = Array.isArray(inputs.outline.acts) ? inputs.outline.acts : [];
  const scenes = outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));
  const sceneCount = scenes.length;
  const chunkSize = sceneCount > 18 ? 4 : sceneCount > 10 ? 5 : sceneCount > 0 ? sceneCount : 1;
  const batches = chunkScenes(scenes, chunkSize);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const chapters: ProseChapter[] = [];
      let chapterIndex = 1;

      for (const batch of batches) {
        const prompt = buildProsePrompt(inputs, batch, chapterIndex);
        const response = await client.chat({
          messages: prompt.messages,
          temperature: 0.7,
          maxTokens: 4000,
          jsonMode: true,
          logContext: {
            runId: inputs.runId ?? "",
            projectId: inputs.projectId ?? "",
            agent: "Agent9-ProseGenerator",
            retryAttempt: attempt,
          },
        });

        const proseBatch = parseProseResponse(response.content);
        validateChapterCount(proseBatch.chapters, batch.length);
        chapters.push(...proseBatch.chapters);
        chapterIndex += batch.length;
      }

      validateChapterCount(chapters, sceneCount);

      const durationMs = Date.now() - start;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent9-ProseGenerator"] || 0;

      return {
        status: "draft",
        tone: inputs.narrativeStyle,
        chapters,
        cast: inputs.cast.characters.map((c) => c.name),
        note: "Generated in scene batches.",
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

  throw lastError || new Error("Prose generation failed after all attempts");
}
