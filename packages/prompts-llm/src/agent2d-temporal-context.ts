/**
 * Agent 2d: Temporal Context Generator
 *
 * Generates rich temporal/cultural context for a specific date within the story's era.
 * Includes season, fashion, current affairs, cultural trends, and daily life details.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { SettingRefinement } from "./agent1-setting.js";

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

const buildTemporalContextPrompt = (inputs: TemporalContextInputs) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const decade = inputs.settingRefinement.era.decade ?? "1950s";
  const location = inputs.settingRefinement.location.type ?? "Unknown location";
  const weather = inputs.settingRefinement.atmosphere.weather ?? "Clear";
  const mood = inputs.settingRefinement.atmosphere.mood ?? "Tense";
  
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
    "year": 1954,
    "month": "October",
    "day": 15,
    "era": "1950s"
  },
  "seasonal": {
    "season": "fall",
    "month": "October",
    "weather": ["Cool evenings", "Misty mornings", "Occasional rain"],
    "daylight": "Shortening days, darkness by 6pm",
    "holidays": ["Halloween approaching"],
    "seasonalActivities": ["Harvest festivals", "Apple picking", "Indoor gatherings"]
  },
  "fashion": {
    "mensWear": {
      "formal": ["Three-piece suits", "Fedora hats", "Wing-tip shoes"],
      "casual": ["Cardigan sweaters", "Flannel shirts", "Slacks"],
      "accessories": ["Pocket watches", "Tie clips", "Leather gloves"]
    },
    "womensWear": {
      "formal": ["New Look silhouette", "Pearl necklaces", "Kitten heels"],
      "casual": ["Circle skirts", "Cardigans", "Saddle shoes"],
      "accessories": ["Gloves", "Small clutch bags", "Pillbox hats"]
    },
    "trendsOfTheMoment": ["Dior influence", "Full skirts", "Fitted bodices"],
    "socialExpectations": ["Hats required in public", "Gloves for ladies", "Formal dress for dinner"]
  },
  "currentAffairs": {
    "majorEvents": ["Post-war recovery", "Cold War tensions", "Specific 1954 events"],
    "politicalClimate": "Description of 1954 political atmosphere",
    "economicConditions": "Description of 1954 economy",
    "socialIssues": ["Conformity pressure", "Suburban expansion", "Race relations"],
    "internationalNews": ["International events of October 1954"]
  },
  "cultural": {
    "entertainment": {
      "popularMusic": ["Perry Como", "Doris Day", "Frank Sinatra"],
      "films": ["Films released in 1954"],
      "theater": ["Broadway shows of 1954"],
      "radio": ["Popular radio programs"]
    },
    "literature": {
      "recentPublications": ["Books published in 1954"],
      "popularGenres": ["Mystery", "Romance", "Western"]
    },
    "technology": {
      "recentInventions": ["Color TV emerging", "Transistor radio"],
      "commonDevices": ["Rotary phones", "Refrigerators", "Washing machines"],
      "emergingTrends": ["Suburban appliances", "Car culture"]
    },
    "dailyLife": {
      "typicalPrices": ["Coffee: 5 cents", "Movie ticket: 50 cents", "Gallon of gas: 22 cents"],
      "commonActivities": ["Watching TV", "Drive-in movies", "Church socials"],
      "socialRituals": ["Formal dining", "Calling cards", "Tea time"]
    }
  },
  "socialAttitudes": {
    "class": ["Rigid class boundaries", "Suburban middle class ideal"],
    "gender": ["Traditional gender roles", "Women as homemakers", "Men as breadwinners"],
    "race": ["Segregation still common", "Civil rights movement building"],
    "generalNorms": ["Conformity valued", "Authority respected", "Propriety essential"]
  },
  "atmosphericDetails": [
    "The crisp October air carried the scent of burning leaves",
    "Women's heels clicked on sidewalks as they hurried home before dark",
    "Radio voices drifted from open windows, mixing with dinner preparations"
  ],
  "paragraphs": [
    "October 1954 found Britain in a peculiar moment of transition...",
    "Fashion that autumn reflected the optimism of post-war recovery...",
    "The cultural landscape was dominated by..."
  ],
  "note": ""
}

Requirements:
- Choose a specific date within the decade (exact year, month, optional day)
- All details must be historically accurate or plausible for that specific time
- Include 3-5 narrative paragraphs synthesizing the temporal context
- Provide rich sensory and atmospheric details specific to that season
- Reference real cultural touchstones of that period
- Match tone and setting requirements
- No anachronisms whatsoever`;

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
1. Choose a specific year and month within ${decade}
2. Provide seasonal context for that month (weather, holidays, activities)
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
  const prompt = buildTemporalContextPrompt(inputs);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.5,
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

      // Validate structure
      if (!context.specificDate || !context.specificDate.year || !context.specificDate.month) {
        throw new Error("Invalid temporal context output: missing specific date");
      }

      if (!context.seasonal || !context.fashion || !context.currentAffairs || !context.cultural) {
        throw new Error("Invalid temporal context output: missing required sections");
      }

      if (!Array.isArray(context.paragraphs) || context.paragraphs.length === 0) {
        throw new Error("Invalid temporal context output: missing paragraphs");
      }

      const durationMs = Date.now() - start;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2d-TemporalContext"] || 0;

      return {
        ...context,
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

  throw lastError || new Error("Temporal context generation failed after all attempts");
}
