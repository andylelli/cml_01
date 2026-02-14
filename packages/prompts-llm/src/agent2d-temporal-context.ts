/**
 * Agent 2d: Temporal Context Generator
 *
 * Generates rich temporal/cultural context for a specific date within the story's era.
 * Includes season, fashion, current affairs, cultural trends, and daily life details.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateArtifact } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { SettingRefinement } from "./agent1-setting.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface SeasonalContext {
  season: "spring" | "summer" | "fall" | "winter";
  month: string;
  weather: string[];
  daylight: string;
  holidays: string[];
  seasonalActivities: string[];
}

export interface FashionContext {
  mensWear: {
    formal: string[];
    casual: string[];
    accessories: string[];
  };
  womensWear: {
    formal: string[];
    casual: string[];
    accessories: string[];
  };
  trendsOfTheMoment: string[];
  socialExpectations: string[];
}

export interface CurrentAffairs {
  majorEvents: string[];
  politicalClimate: string;
  economicConditions: string;
  socialIssues: string[];
  internationalNews: string[];
}

export interface CulturalContext {
  entertainment: {
    popularMusic: string[];
    films: string[];
    theater: string[];
    radio: string[];
  };
  literature: {
    recentPublications: string[];
    popularGenres: string[];
  };
  technology: {
    recentInventions: string[];
    commonDevices: string[];
    emergingTrends: string[];
  };
  dailyLife: {
    typicalPrices: string[];
    commonActivities: string[];
    socialRituals: string[];
  };
}

export interface TemporalContextResult {
  status: "draft" | "final";
  specificDate: {
    year: number;
    month: string;
    day?: number;
    era: string;
  };
  seasonal: SeasonalContext;
  fashion: FashionContext;
  currentAffairs: CurrentAffairs;
  cultural: CulturalContext;
  socialAttitudes: {
    class: string[];
    gender: string[];
    race: string[];
    generalNorms: string[];
  };
  atmosphericDetails: string[];
  paragraphs: string[];
  note?: string;
  cost: number;
  durationMs: number;
}

export interface TemporalContextInputs {
  settingRefinement: SettingRefinement;
  caseData: CaseData;
  runId?: string;
  projectId?: string;
}

// Simple hash function to convert string to number
const simpleHash = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Generate specific year and month from runId to ensure variation
const generateSpecificDate = (decade: string, runId: string): { year: number; month: string } => {
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  
  // Parse decade (e.g., "1950s" -> 1950)
  const decadeStart = parseInt(decade.replace(/s$/, ''), 10) || 1950;
  
  // Use hash to deterministically select year and month
  const hash = simpleHash(runId || Math.random().toString());
  const yearOffset = hash % 10; // 0-9
  const monthIndex = (hash >> 4) % 12; // Use different bits for month
  
  return {
    year: decadeStart + yearOffset,
    month: monthNames[monthIndex]
  };
};

const buildTemporalContextPrompt = (inputs: TemporalContextInputs, previousErrors?: string[]) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const validationFeedback = buildValidationFeedback(previousErrors);
  const decade = inputs.settingRefinement.era.decade ?? "1950s";
  const location = inputs.settingRefinement.location.type ?? "Unknown location";
  const weather = inputs.settingRefinement.atmosphere.weather ?? "Clear";
  const mood = inputs.settingRefinement.atmosphere.mood ?? "Tense";
  
  // Generate specific date for this mystery to ensure variation
  const specificDate = generateSpecificDate(decade, inputs.runId || inputs.projectId || "");
  
  // Extract technology and social norms from setting
  const technology = (inputs.settingRefinement.era.technology || []).slice(0, 5);
  const socialNorms = (inputs.settingRefinement.era.socialNorms || []).slice(0, 5);
  const forensics = (inputs.settingRefinement.era.forensics || []).slice(0, 3);

  const system = `You are a historical and cultural research specialist for mystery fiction. Your task is to create rich temporal context for a specific date within a mystery story's era. This includes precise seasonal details, fashion trends, current affairs, cultural context, and daily life authenticity.

Rules:
- Choose a SPECIFIC year and month within the given decade
- Provide era-authentic details (no anachronisms)
- Include seasonal context (weather, holidays, activities)
- Detail fashion trends for that specific period
- Reference real or plausible current affairs for that time
- Describe cultural atmosphere (entertainment, technology, social attitudes)
- Output valid JSON only.`;

  const developer = `# Temporal Context Output Schema
Return JSON with this structure:

{
  "status": "draft",
  "specificDate": {
    "year": ${specificDate.year},
    "month": "${specificDate.month}",
    "day": <OPTIONAL_DAY_NUMBER>,
    "era": "${decade}"
  },
  "seasonal": {
    "season": "spring|summer|fall|winter",
    "month": "month name",
    "weather": ["weather detail 1", "weather detail 2", "weather detail 3"],
    "daylight": "daylight description for this season",
    "holidays": ["any holidays this month"],
    "seasonalActivities": ["activity 1", "activity 2", "activity 3"]
  },
  "fashion": {
    "mensWear": {
      "formal": ["formal item 1", "formal item 2", "formal item 3"],
      "casual": ["casual item 1", "casual item 2", "casual item 3"],
      "accessories": ["accessory 1", "accessory 2", "accessory 3"]
    },
    "womensWear": {
      "formal": ["formal item 1", "formal item 2", "formal item 3"],
      "casual": ["casual item 1", "casual item 2", "casual item 3"],
      "accessories": ["accessory 1", "accessory 2", "accessory 3"]
    },
    "trendsOfTheMoment": ["trend 1", "trend 2", "trend 3"],
    "socialExpectations": ["expectation 1", "expectation 2", "expectation 3"]
  },
  "currentAffairs": {
    "majorEvents": ["event 1", "event 2", "event 3"],
    "politicalClimate": "political climate description",
    "economicConditions": "economic conditions description",
    "socialIssues": ["issue 1", "issue 2", "issue 3"],
    "internationalNews": ["news item 1", "news item 2"]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": ["artist/song 1", "artist/song 2", "artist/song 3"],
      "films": ["film 1", "film 2", "film 3"],
      "theater": ["show 1", "show 2", "show 3"],
      "radio": ["program 1", "program 2", "program 3"]
    },
    "literature": {
      "recentPublications": ["book 1", "book 2", "book 3"],
      "popularGenres": ["genre 1", "genre 2", "genre 3"]
    },
    "technology": {
      "recentInventions": ["invention 1", "invention 2", "invention 3"],
      "commonDevices": ["device 1", "device 2", "device 3"],
      "emergingTrends": ["trend 1", "trend 2", "trend 3"]
    },
    "dailyLife": {
      "typicalPrices": ["item: price", "item: price", "item: price"],
      "commonActivities": ["activity 1", "activity 2", "activity 3"],
      "socialRituals": ["ritual 1", "ritual 2", "ritual 3"]
    }
  },
  "socialAttitudes": {
    "class": ["attitude 1", "attitude 2"],
    "gender": ["attitude 1", "attitude 2", "attitude 3"],
    "race": ["attitude 1", "attitude 2"],
    "generalNorms": ["norm 1", "norm 2", "norm 3"]
  },
  "atmosphericDetails": [
    "sensory detail 1 for this specific season/month",
    "sensory detail 2 specific to this time and place",
    "sensory detail 3 capturing the era's atmosphere"
  ],
  "paragraphs": [
    "First narrative paragraph synthesizing the chosen date's context...",
    "Second paragraph on fashion and cultural atmosphere...",
    "Third paragraph on daily life and social attitudes..."
  ],
  "note": ""
}

CRITICAL DATE REQUIREMENT:
- YOU MUST use the exact year and month specified above: ${specificDate.month} ${specificDate.year}
- This date has been specifically selected for THIS mystery to ensure uniqueness
- DO NOT change the year or month - use ${specificDate.month} ${specificDate.year} exactly
- You may optionally choose a specific day number (1-31) appropriate for the month

Requirements:
- All details must be historically accurate or plausible for that specific time
- Include 3-5 narrative paragraphs synthesizing the temporal context
- Provide rich sensory and atmospheric details specific to that season
- Reference real cultural touchstones of that period
- Match tone and setting requirements
- No anachronisms whatsoever
- All details must be historically accurate for ${specificDate.month} ${specificDate.year} specifically
- Generate fresh, original descriptions - do not copy example phrasing
- Make this feel like the specific moment of ${specificDate.month} ${specificDate.year}

CRITICAL: Ensure all nested objects and arrays match the schema structure exactly${validationFeedback}`;

  const user = `Generate temporal context for this mystery.

Title: ${title}
Decade: ${decade}
Location: ${location}
Weather: ${weather}
Mood: ${mood}

Era constraints already established:
- Technology available: ${technology.join(', ')}
- Forensics: ${forensics.join(', ')}
- Social norms: ${socialNorms.join(', ')}

Task:
1. Use the specified date: ${specificDate.month} ${specificDate.year}
2. Provide seasonal context for ${specificDate.month} (weather, holidays, activities appropriate for this specific month)
3. Detail fashion trends of that specific period
4. Reference plausible current affairs and news of that time
5. Describe cultural atmosphere (entertainment, music, literature, technology state)
6. Include social attitudes and daily life details
7. Generate 3-5 atmospheric paragraphs that capture the temporal setting

Make this mystery feel ROOTED in a specific moment in time, not just a generic era.`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
};

export async function generateTemporalContext(
  client: AzureOpenAIClient,
  inputs: TemporalContextInputs,
  maxAttempts = 2
): Promise<TemporalContextResult> {
  const start = Date.now();

  const retryResult = await withValidationRetry({
    maxAttempts,
    agentName: "Agent 2d (Temporal Context)",
    validationFn: (data) => {
      const validation = validateArtifact("temporal_context", data);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildTemporalContextPrompt(inputs, previousErrors);

      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.7,
        maxTokens: 4500,
        jsonMode: true,
        logContext: {
          runId: inputs.runId ?? "",
          projectId: inputs.projectId ?? "",
          agent: "Agent2d-TemporalContext",
          retryAttempt: attempt,
        },
      });

      let context: Omit<TemporalContextResult, "cost" | "durationMs">;
      try {
        context = JSON.parse(response.content);
      } catch (error) {
        const repaired = jsonrepair(response.content);
        context = JSON.parse(repaired);
      }

      // Basic structure validation
      if (!context.specificDate || !context.specificDate.year || !context.specificDate.month) {
        throw new Error("Invalid temporal context output: missing specific date");
      }

      if (!context.seasonal || !context.fashion || !context.currentAffairs || !context.cultural) {
        throw new Error("Invalid temporal context output: missing required sections");
      }

      if (!Array.isArray(context.paragraphs) || context.paragraphs.length === 0) {
        throw new Error("Invalid temporal context output: missing paragraphs");
      }

      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2d-TemporalContext"] || 0;

      return { result: context, cost };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 2d] Temporal context validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 2d] Temporal context failed validation after ${maxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  const durationMs = Date.now() - start;
  const validatedResult = retryResult.result as TemporalContextResult;

  return {
    ...validatedResult,
    cost: retryResult.totalCost,
    durationMs,
  };
}
