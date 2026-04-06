/**
 * Agent 2c: Location & Setting Profile Generator
 *
 * Generates rich narrative profiles for locations, settings, and atmospheric background.
 * Similar to character profiles, but for places and atmosphere.
 */

import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import type { SettingRefinement } from "./agent1-setting.js";
import type { NarrativeOutline } from "./agent7-narrative.js";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

export interface SensoryDetails {
  sights: string[];
  sounds: string[];
  smells: string[];
  tactile: string[];
}

export interface SensoryVariant {
  id: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening' | 'night';
  weather: string;
  sights: string[];
  sounds: string[];
  smells: string[];
  mood: string;
}

export interface KeyLocation {
  id: string;
  name: string;
  type: 'interior' | 'exterior' | 'transitional';
  purpose: string;
  visualDetails: string;
  sensoryDetails: SensoryDetails;
  accessControl: string;
  /** 3-4 distinct sensory palette variants enabling atmospheric variety across chapters */
  sensoryVariants?: SensoryVariant[];
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
  place?: string; // Specific town/city/village (optional per schema)
  country?: string; // UK, France, Italy, etc. (optional per schema)
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
  narrative?: NarrativeOutline; // optional — agent2c runs before agent7 so narrative may not exist yet
  tone?: string;
  targetWordCount?: number;
  runId?: string;
  projectId?: string;
}

const buildLocationProfilesPrompt = (inputs: LocationProfilesInputs, previousErrors?: string[]) => {
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = inputs.settingRefinement.era.decade ?? "Unknown era";
  const location = inputs.settingRefinement.location.type ?? "Unknown location";
  const locationType = inputs.settingRefinement.location.type ?? "Unknown";
  const locationDescription = inputs.settingRefinement.location.description ?? "";
  const weather = inputs.settingRefinement.atmosphere.weather ?? "Clear";
  const mood = inputs.settingRefinement.atmosphere.mood ?? "Tense";
  // CASE.crime_scene does not exist in the cml_2_0 schema; the primary location is CASE.meta.setting.location.
  const crimeScene = cmlCase.meta?.setting?.location ?? "Unknown";
  const tone = inputs.tone ?? "Classic";
  const targetWordCount = inputs.targetWordCount ?? 1000;

  // Extract key locations from narrative scenes (narrative is optional — may not exist yet)
  const narrativeActs = inputs.narrative && Array.isArray(inputs.narrative.acts) ? inputs.narrative.acts : [];
  const allScenes = narrativeActs.flatMap((act) => Array.isArray(act.scenes) ? act.scenes : []);
  const sceneLocations = allScenes
    .map((scene: any) => {
      const raw = scene.setting || scene.location;
      if (typeof raw === 'string') return raw;
      // Support both { name: "..." } and { location: "..." } object shapes
      if (raw && typeof raw === 'object') return raw.name || raw.location || raw.id || null;
      return null;
    })
    .filter((loc): loc is string => Boolean(loc));
  const uniqueLocations = Array.from(new Set(sceneLocations)).slice(0, 5);

  // Era markers from setting
  const eraMarkers = [
    ...(inputs.settingRefinement.era.technology || []),
    ...(inputs.settingRefinement.era.transportation || []),
    ...(inputs.settingRefinement.era.communication || []),
  ].slice(0, 8);

  const validationFeedback = buildValidationFeedback(previousErrors);
  // Determine which atmosphere failure case we are in, if any.
  // Case A: top-level atmosphere object entirely absent — error has no dot ("atmosphere is required")
  // Case B: atmosphere object exists but individual sub-fields are missing ("atmosphere.weather is required")
  // The two cases are mutually exclusive in practice but the ternary handles overlap correctly.
  const atmosphereSubfieldsMissing = previousErrors?.some(
    (e) => /atmosphere\.\w+.*required|required.*atmosphere\.\w+/i.test(e)
  ) ?? false;
  const atmosphereObjectMissing = !atmosphereSubfieldsMissing && (previousErrors?.some(
    (e) => /\batmosphere\b.*\brequired\b|\brequired\b.*\batmosphere\b/i.test(e)
  ) ?? false);
  // Extract the specific missing sub-field names from error strings (only used in Case B).
  const missingSubfields: string[] = atmosphereSubfieldsMissing && previousErrors
    ? [...new Set(
        previousErrors.flatMap((e) => {
          // Use [\w.]+ so nested paths like atmosphere.sensoryPalette.dominant
          // are captured in full — not truncated to just 'sensoryPalette'.
          const matches = e.match(/atmosphere\.(\w[\w.]*)/gi) ?? [];
          return matches.map((m) => m.slice('atmosphere.'.length));
        })
      )]
    : [];
  const atmosphereFeedback: string =
    atmosphereObjectMissing
      ? `\n\nMissing required field: atmosphere — your JSON must contain a top-level "atmosphere" object with ALL of the following keys: era (string), weather (string), timeFlow (string), mood (string), eraMarkers (string[]), sensoryPalette ({ dominant: string, secondary: string[] }), paragraphs (string[] — 2-3 narrative paragraphs describing the overall setting mood). Add this object at the root of the JSON before returning.`
      : atmosphereSubfieldsMissing
        ? `\n\nIncomplete atmosphere object — your JSON has an "atmosphere" key but it is missing required sub-fields: ${missingSubfields.length > 0 ? missingSubfields.map((f) => `"${f}"`).join(', ') : '"weather", "timeFlow", "mood", "eraMarkers", "sensoryPalette", "paragraphs"'}. Add each missing field to your existing atmosphere object. Required shape: { era: string, weather: string, timeFlow: string, mood: string, eraMarkers: string[], sensoryPalette: { dominant: string, secondary: string[] }, paragraphs: string[] }.`
        : '';
  const enhancedFeedback = validationFeedback + atmosphereFeedback;

  const system = `You are a setting and atmosphere specialist for classic mystery fiction. Your task is to create vivid, evocative location profiles that bring mystery settings to life through sensory details, authentic period atmosphere, and physical descriptions that serve the mystery plot.

Rules:
- Use rich sensory details: sights, sounds, smells, textures
- Include era-authentic markers (no anachronisms)
- Describe physical layout relevant to mystery (access, sightlines, isolation)
- Create mood appropriate to mystery type
- Balance atmospheric description with functional detail
- The output JSON MUST include a top-level \`atmosphere\` object with ALL of these required fields: era, weather, timeFlow, mood, eraMarkers, sensoryPalette, paragraphs. Omitting this object or any of its required fields will cause schema validation failure and the entire output will be rejected.
- Output valid JSON only.`;

  const developer = `# Location Profiles Output Schema
Return JSON with this structure.

IMPORTANT OUTPUT ORDER: Write the keys in EXACTLY the order shown below.
The "atmosphere" object MUST be written BEFORE "keyLocations" so it is never
truncated if the response is long. Failure to include a complete "atmosphere"
object will cause schema validation failure and the entire output will be rejected.

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
  "atmosphere": {
    "era": "${era}",
    "weather": "${weather}",
    "timeFlow": "Time span of the story and how time is experienced (e.g. 'Three days of mounting tension')",
    "mood": "${mood}",
    "eraMarkers": ["Period-authentic detail 1", "Period-authentic detail 2", "Period-authentic detail 3"],
    "sensoryPalette": {
      "dominant": "The single dominant sensory impression of this setting",
      "secondary": ["A second distinct sensory quality", "A third contrasting sensory quality"]
    },
    "paragraphs": ["Atmospheric paragraph 1 (~80 words)", "Atmospheric paragraph 2 (~80 words)"]
  },
  "keyLocations": [
    {
      "id": "crime_scene",
      "name": "Specific Location Name",
      "type": "interior|exterior|transitional",
      "purpose": "Crime scene|Clue discovery|Gathering space",
      "visualDetails": "Physical description",
      "sensoryDetails": {
        "sights": ["Full 2-sentence visual description of what you see", "Second visual detail with specific period-authentic imagery"],
        "sounds": ["Full 2-sentence sound description — ambient and specific noises", "A second distinct sound with texture and context"],
        "smells": ["Full 2-sentence olfactory description — at least 3 specific scents named", "A secondary smell that reinforces the mood"],
        "tactile": ["Full 2-sentence tactile description — temperature, texture, humidity", "A second tactile detail relevant to the space"]
      },
      "accessControl": "Who can access this location and when",
      "sensoryVariants": [
        {
          "id": "morning_rain",
          "timeOfDay": "morning",
          "weather": "rain",
          "sights": ["rain-streaked windows", "grey light across flagstones"],
          "sounds": ["steady drumming on the roof", "water trickling in the gutters"],
          "smells": ["damp earth", "mildew", "cold stone"],
          "mood": "oppressive"
        },
        {
          "id": "afternoon_grey",
          "timeOfDay": "afternoon",
          "weather": "overcast",
          "sights": ["flat pewter light", "shadows without edges"],
          "sounds": ["silence broken by a distant clock", "the creak of old timbers"],
          "smells": ["beeswax", "dust", "woodsmoke"],
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": ["candlelight catching brass fittings", "long shadows across the floor"],
          "sounds": ["the tick of a mantel clock", "distant voices from below stairs"],
          "smells": ["candle wax", "tobacco", "cold fireplace ash"],
          "mood": "tense anticipation"
        }
      ],
      "paragraphs": ["Paragraph 1", "Paragraph 2"]
    }
  ],
  "note": ""
}

Requirements:
- Primary location: 3-5 narrative paragraphs (~${targetWordCount} words total)
- Key locations: 2-3 paragraphs each (include crime scene + AT LEAST 3 other important locations, 4 minimum total)
- If the narrative does not suggest specific sub-locations, invent context-appropriate ones for the setting type (rooms, outbuildings, grounds, nearby places). A country house has a library, a study, a drawing room, a servants\'s hall, gardens. An ocean liner has a dining saloon, a promenade deck, a cabin corridor, a cargo hold.
- Atmosphere: 2-3 paragraphs
- **CRITICAL — Sensory Richness**: Each sensory detail entry MUST be a full 2-sentence description (minimum 20 words per entry). Arrays of one-word items or short phrases WILL be rejected. Aim for 50+ words total per sense field across the array.
- All 5 senses must be present for every key location (sights, sounds, smells, tactile — taste is synthesised from smells)
- Era-authentic markers: ${eraMarkers.join(', ')}
- Tone: ${tone}
- No anachronisms
- Physical details that support mystery logic (access, isolation, layout)

CRITICAL FIELD REQUIREMENTS:
- keyLocations MUST be an array of OBJECTS (not strings)
- Each keyLocation object MUST have: id, name, type, purpose, visualDetails, sensoryDetails, accessControl, sensoryVariants, paragraphs
- sensoryDetails MUST be an object with arrays: sights, sounds, smells, tactile
- sensoryVariants MUST be an array of 3-4 objects, each with: id (string), timeOfDay (morning|afternoon|evening|night), weather (string), sights (string[]), sounds (string[]), smells (string[]), mood (string). Cover morning-rain, afternoon-grey, and evening-clear as a minimum. These objects drive atmospheric variety across chapters.
- type field MUST be one of: "interior", "exterior", "transitional"
- Do NOT return location names as strings - always return complete objects with all required fields
- The top-level \`atmosphere\` object is REQUIRED and must include: era, weather, timeFlow, mood, eraMarkers, sensoryPalette, paragraphs. Omitting the atmosphere object entirely will fail schema validation.${enhancedFeedback}`;

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
  maxAttempts?: number
): Promise<LocationProfilesResult> {
  const start = Date.now();
  const config = getGenerationParams().agent2c_location_profiles.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  const retryResult = await withValidationRetry({
    maxAttempts: resolvedMaxAttempts,
    agentName: "Agent 2c (Location Profiles)",
    validationFn: (data) => {
      // Validate against location_profiles schema
      const validationPayload = {
        ...(data as Record<string, unknown>),
        cost: typeof (data as any)?.cost === "number" ? (data as any).cost : 0,
        durationMs: typeof (data as any)?.durationMs === "number" ? (data as any).durationMs : 0,
      };
      const validation = validateArtifact("location_profiles", validationPayload);
      return {
        valid: validation.valid,
        errors: validation.errors,
        warnings: validation.warnings,
      };
    },
    generateFn: async (attempt, previousErrors) => {
      const prompt = buildLocationProfilesPrompt(inputs, previousErrors);

      const response = await client.chat({
        messages: prompt.messages,
        temperature: config.model.temperature,
        maxTokens: config.model.max_tokens,
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

      // Basic structure validation
      if (!profiles.primary || !Array.isArray(profiles.primary.paragraphs) || profiles.primary.paragraphs.length === 0) {
        throw new Error("Invalid location profiles output: missing primary location");
      }

      if (!Array.isArray(profiles.keyLocations)) {
        throw new Error("Invalid location profiles output: missing key locations");
      }

      if (profiles.keyLocations.length < 3) {
        throw new Error(
          `Location profiles must include at least 3 key locations (got ${profiles.keyLocations.length}). ` +
          `Include the crime scene plus at least 2 other distinct areas appropriate to the setting type.`
        );
      }

      // Guard: atmosphere object must be present and structurally complete.
      // This catches token-truncation where the atmosphere block is dropped or
      // partially written, and produces a clear retry message rather than relying
      // solely on schema validation errors further down the pipeline.
      const atm = (profiles as any).atmosphere;
      if (!atm || typeof atm !== 'object' || Array.isArray(atm)) {
        throw new Error(
          'Invalid location profiles output: top-level "atmosphere" object is missing. ' +
          'The JSON must contain an "atmosphere" object with: era, weather, timeFlow, mood, ' +
          'eraMarkers (string[]), sensoryPalette ({ dominant, secondary }), paragraphs (string[]).'
        );
      }
      const requiredAtmFields = ['era', 'weather', 'timeFlow', 'mood', 'eraMarkers', 'sensoryPalette', 'paragraphs'] as const;
      const missingAtmFields = requiredAtmFields.filter((f) => atm[f] === undefined || atm[f] === null);
      if (missingAtmFields.length > 0) {
        throw new Error(
          `Invalid location profiles output: atmosphere object is incomplete — missing: ${missingAtmFields.join(', ')}. ` +
          'Required shape: { era: string, weather: string, timeFlow: string, mood: string, eraMarkers: string[], ' +
          'sensoryPalette: { dominant: string, secondary: string[] }, paragraphs: string[] }.'
        );
      }
      if (!atm.sensoryPalette?.dominant || !Array.isArray(atm.sensoryPalette?.secondary)) {
        throw new Error(
          'Invalid location profiles output: atmosphere.sensoryPalette must be an object with ' +
          '"dominant" (string) and "secondary" (string[]). The field was present but is malformed.'
        );
      }
      if (!Array.isArray(atm.paragraphs) || atm.paragraphs.length === 0) {
        throw new Error(
          'Invalid location profiles output: atmosphere.paragraphs must be a non-empty string array (2-3 narrative paragraphs).'
        );
      }

      const costTracker = client.getCostTracker();
      const cost = costTracker.getSummary().byAgent["Agent2c-LocationProfiles"] || 0;

      return { result: profiles, cost };
    },
  });

  // Log validation warnings if any
  if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
    console.warn(
      `[Agent 2c] Location profiles validation warnings:\n` +
      retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n")
    );
  }

  // If validation failed after all retries, log errors but continue
  if (!retryResult.validationResult.valid) {
    console.error(
      `[Agent 2c] Location profiles failed validation after ${resolvedMaxAttempts} attempts:\n` +
      retryResult.validationResult.errors.map(e => `- ${e}`).join("\n")
    );
  }

  const durationMs = Date.now() - start;
  const validatedResult = retryResult.result as LocationProfilesResult;

  return {
    ...validatedResult,
    cost: retryResult.totalCost,
    durationMs,
  };
}
