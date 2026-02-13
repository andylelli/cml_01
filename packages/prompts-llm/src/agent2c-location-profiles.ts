/**
 * Agent 2c: Location & Setting Profile Generator
 *
 * Generates rich narrative profiles for locations, settings, and atmospheric background.
 * Similar to character profiles, but for places and atmosphere.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { SettingRefinement } from "./agent1-setting.js";
import type { NarrativeOutline } from "./agent7-narrative.js";

export interface SensoryDetails {
  sights: string[];
  sounds: string[];
  smells: string[];
  tactile: string[];
}

export interface KeyLocation {
  id: string;
  name: string;
  type: 'interior' | 'exterior' | 'transitional';
  purpose: string;
  visualDetails: string;
  sensoryDetails: SensoryDetails;
  accessControl: string;
  paragraphs: string[];
}

export interface AtmosphereProfile {
  era: string;
  weather: string;
  timeFlow: string;
  mood: string;
  eraMarkers: string[];
  sensoryPalette: {
    dominant: string;
    secondary: string[];
  };
  paragraphs: string[];
}

export interface PrimaryLocationProfile {
  name: string;
  type: string;
  place: string; // Specific town/city/village
  country: string; // UK, France, Italy, etc.
  summary: string;
  visualDescription: string;
  atmosphere: string;
  paragraphs: string[];
}

export interface LocationProfilesResult {
  status: "draft" | "final";
  tone?: string;
  primary: PrimaryLocationProfile;
  keyLocations: KeyLocation[];
  atmosphere: AtmosphereProfile;
  note?: string;
  cost: number;
  durationMs: number;
}

export interface LocationProfilesInputs {
  settingRefinement: SettingRefinement;
  caseData: CaseData;
  narrative: NarrativeOutline;
  tone?: string;
  targetWordCount?: number;
  runId?: string;
  projectId?: string;
}

const buildLocationProfilesPrompt = (inputs: LocationProfilesInputs) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = inputs.settingRefinement.era.decade ?? "Unknown era";
  const location = inputs.settingRefinement.location.type ?? "Unknown location";
  const locationType = inputs.settingRefinement.location.type ?? "Unknown";
  const locationDescription = inputs.settingRefinement.location.description ?? "";
  const weather = inputs.settingRefinement.atmosphere.weather ?? "Clear";
  const mood = inputs.settingRefinement.atmosphere.mood ?? "Tense";
  const crimeScene = cmlCase.crime_scene?.primary_location ?? "Unknown";
  const tone = inputs.tone ?? "Classic";
  const targetWordCount = inputs.targetWordCount ?? 1000;

  // Extract key locations from narrative scenes
  const narrativeActs = Array.isArray(inputs.narrative.acts) ? inputs.narrative.acts : [];
  const allScenes = narrativeActs.flatMap((act) => Array.isArray(act.scenes) ? act.scenes : []);
  const sceneLocations = allScenes
    .map((scene: any) => scene.setting || scene.location)
    .filter((loc): loc is string => Boolean(loc));
  const uniqueLocations = Array.from(new Set(sceneLocations)).slice(0, 5);

  // Era markers from setting
  const eraMarkers = [
    ...(inputs.settingRefinement.era.technology || []),
    ...(inputs.settingRefinement.era.transportation || []),
    ...(inputs.settingRefinement.era.communication || []),
  ].slice(0, 8);

  const system = `You are a setting and atmosphere specialist for classic mystery fiction. Your task is to create vivid, evocative location profiles that bring mystery settings to life through sensory details, authentic period atmosphere, and physical descriptions that serve the mystery plot.

Rules:
- Use rich sensory details: sights, sounds, smells, textures
- Include era-authentic markers (no anachronisms)
- Describe physical layout relevant to mystery (access, sightlines, isolation)
- Create mood appropriate to mystery type
- Balance atmospheric description with functional detail
- Output valid JSON only.`;

  const developer = `# Location Profiles Output Schema
Return JSON with this structure:

{
  "status": "draft",
  "tone": "${tone}",
  "primary": {
    "name": "Primary Location Name",
    "type": "${locationType}",
    "place": "Specific town/city/village name",
    "country": "Country (e.g., England, France, Italy)",
    "summary": "1-2 sentence overview",
    "visualDescription": "Physical appearance and key visual features",
    "atmosphere": "Overall mood and feeling",
    "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3", "Paragraph 4"]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Specific Location Name",
      "type": "interior|exterior|transitional",
      "purpose": "Crime scene|Clue discovery|Gathering space",
      "visualDetails": "Physical description",
      "sensoryDetails": {
        "sights": ["Visual element 1", "Visual element 2"],
        "sounds": ["Sound 1", "Sound 2"],
        "smells": ["Scent 1", "Scent 2"],
        "tactile": ["Texture 1", "Temperature note"]
      },
      "accessControl": "Who can access this location and when",
      "paragraphs": ["Paragraph 1", "Paragraph 2"]
    }
  ],
  "atmosphere": {
    "era": "${era}",
    "weather": "${weather}",
    "timeFlow": "Time span and pacing",
    "mood": "${mood}",
    "eraMarkers": ["Period detail 1", "Period detail 2"],
    "sensoryPalette": {
      "dominant": "Primary sensory impression",
      "secondary": ["Secondary impression 1", "Secondary impression 2"]
    },
    "paragraphs": ["Paragraph 1", "Paragraph 2"]
  },
  "note": ""
}

Requirements:
- Primary location: 3-5 narrative paragraphs (~${targetWordCount} words total)
- Key locations: 2-3 paragraphs each (include crime scene + 2-4 other important locations)
- Atmosphere: 2-3 paragraphs
- Rich sensory details in every location (sight, sound, smell, touch)
- Era-authentic markers: ${eraMarkers.join(', ')}
- Tone: ${tone}
- No anachronisms
- Physical details that support mystery logic (access, isolation, layout)`;

  const user = `Generate location profiles for this mystery.

Title: ${title}
Era: ${era}
Primary Location: ${locationType}
Description: ${locationDescription}
Crime Scene: ${crimeScene}
Weather: ${weather}
Mood: ${mood}

IMPORTANT - Geographic Specificity:
- Choose a specific place name (town, city, village, or coastal region)
- Specify the country (usually England/UK for manor houses, country estates, villages)
- For Riviera settings: French Riviera (Nice, Cannes, Monaco) or Italian Riviera
- For ocean liners: Specify route (e.g., Southampton to New York, Liverpool to Boston)
- For trains: Specify route or terminus (e.g., London to Scotland, Orient Express)
- Make the choice contextually appropriate to the era (${era}) and setting type

Key locations mentioned in narrative:
${uniqueLocations.map((loc, idx) => `${idx + 1}. ${loc}`).join('\n')}

Setting constraints:
- Physical constraints: ${(inputs.settingRefinement.location.physicalConstraints || []).join(', ')}
- Geographic isolation: ${inputs.settingRefinement.location.geographicIsolation}
- Access control: ${(inputs.settingRefinement.location.accessControl || []).join(', ')}

Era constraints to include:
- Technology: ${(inputs.settingRefinement.era.technology || []).slice(0, 3).join(', ')}
- Transportation: ${(inputs.settingRefinement.era.transportation || []).slice(0, 2).join(', ')}
- Social norms: ${(inputs.settingRefinement.era.socialNorms || []).slice(0, 2).join(', ')}

Create evocative, atmospheric profiles that Agent 9 can use to write vivid prose.`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${developer}` },
    { role: "user" as const, content: user },
  ];

  return { system, developer, user, messages };
};

export async function generateLocationProfiles(
  client: AzureOpenAIClient,
  inputs: LocationProfilesInputs,
  maxAttempts = 2
): Promise<LocationProfilesResult> {
  const start = Date.now();
  const prompt = buildLocationProfilesPrompt(inputs);

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      const response = await client.chat({
        messages: prompt.messages,
        temperature: 0.6,
        maxTokens: 4500,
        jsonMode: true,
        logContext: {
          runId: inputs.runId ?? "",
          projectId: inputs.projectId ?? "",
          agent: "Agent2c-LocationProfiles",
          retryAttempt: attempt,
        },
      });

      let profiles: Omit<LocationProfilesResult, "cost" | "durationMs">;
      try {
        profiles = JSON.parse(response.content);
      } catch (error) {
        const repaired = jsonrepair(response.content);
        profiles = JSON.parse(repaired);
      }

      // Validate structure
      if (!profiles.primary || !Array.isArray(profiles.primary.paragraphs) || profiles.primary.paragraphs.length === 0) {
        throw new Error("Invalid location profiles output: missing primary location");
      }

      if (!Array.isArray(profiles.keyLocations)) {
        throw new Error("Invalid location profiles output: missing key locations");
      }

      const durationMs = Date.now() - start;
      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2c-LocationProfiles"] || 0;

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

  throw lastError || new Error("Location profile generation failed after all attempts");
}
