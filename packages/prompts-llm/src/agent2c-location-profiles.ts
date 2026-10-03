/**
 * Agent 2c: Location & Setting Profile Generator
 *
 * Generates rich narrative profiles for locations, settings, and atmospheric background.
 * Similar to character profiles, but for places and atmosphere.
 */

import { generateJsonArtifact } from "./shared/json-artifact-generator.js";
import type { AzureOpenAIClient } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { promptSpecimenTrimsEnabled } from "@cml/cml";
import { promptTrimsEnabled } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import type { SettingRefinement } from "./agent1-setting.js";
import { buildValidationFeedback } from "./utils/validation-retry-wrapper.js";

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
  tone?: string;
  targetWordCount?: number;
  runId?: string;
  projectId?: string;
}

/**
 * Exported so the prompt is testable. A1X-15 (owner decision 12, CR-30): the `narrative` input is gone — Agent 2c
 * runs long before Agent 7, the only writer of `ctx.narrative`, so it was undefined on every run and its
 * scene-location list always rendered empty. The empty "Key locations mentioned in narrative:" line is kept so the
 * prompt stays byte-identical.
 */
export const buildLocationProfilesPrompt = (inputs: LocationProfilesInputs, previousErrors?: string[]) => {
  // A1X-11(a) (CML_PROMPT_TRIMS, owner decision 12 CR-28), read at call time. ON: the sensory-format rule and the F30-5
  // minimum are each stated once (they were 3x and 2x), and the schema example no longer models the atoms its own
  // CROSS-LOCATION DISTINCTNESS rule forbids (beeswax, damp stone, a clock's tick, long shadows). OFF: byte-identical.
  const trims = promptTrimsEnabled();
  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const meta = cmlCase.meta ?? {};
  const title = meta.title ?? "Untitled Mystery";
  const era = inputs.settingRefinement.era.decade ?? "Unknown era";
  const locationType = inputs.settingRefinement.location.type ?? "Unknown";
  const locationDescription = inputs.settingRefinement.location.description ?? "";
  const weather = inputs.settingRefinement.atmosphere.weather ?? "Clear";
  const mood = inputs.settingRefinement.atmosphere.mood ?? "Tense";
  // CASE.crime_scene does not exist in the cml_2_0 schema; the primary location is CASE.meta.setting.location.
  const crimeScene = cmlCase.meta?.setting?.location ?? "Unknown";
  const tone = inputs.tone ?? "Classic";
  const targetWordCount = inputs.targetWordCount ?? 1000;

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
${trims ? `- **CRITICAL — Sensory Format (F5a noun-phrase rule)**: Every value in the sensoryDetails arrays (sights, sounds, smells, tactile) and the sensoryVariants arrays MUST be a short noun phrase or gerund of 3–8 words. No complete sentences, no gerund clauses, no conjugated verbs or subject-verb constructions — full sentences WILL be rejected. WRONG: "The fire crackled in the hearth." WRONG: "Rain was drumming on the roof." RIGHT: "crackling hearth-fire", "rain-drummed roof slates", "cold ash in the grate". This applies to every keyLocation's sensoryDetails and every sensoryVariants entry.
- F30-5 SENSORY MINIMUM: Each keyLocation's sensoryDetails MUST have at least 4 noun-phrase entries in EACH of sights, sounds, smells, and tactile. The quality scorer counts entries: a location with fewer than 4 in any sense field scores 0 on sensory richness and fails the quality gate. Aim for 5–6 entries per sense; do not generate placeholder or thin lists.` : `- **CRITICAL — Sensory Format**: Each sensory detail entry MUST be a short noun phrase or gerund (3–8 words). No complete sentences, no gerund clauses, no subject-verb constructions. WRONG: "The fire crackled in the hearth." WRONG: "Rain was drumming on the roof." RIGHT: "crackling hearth-fire", "rain-drummed roof slates", "cold beeswax and ash". This applies to every keyLocation's sensoryDetails and every sensoryVariants entry.
- F5a NOUN-PHRASE RULE: All values in sensoryDetails arrays (sights, sounds, smells, tactile) and sensoryVariants arrays MUST be short noun phrases of 3–8 words. Do NOT write full sentences, gerund clauses, or any phrase containing a conjugated verb. WRONG: "The fire crackled in the hearth." WRONG: "Rain was drumming on the roof." RIGHT: "crackling hearth-fire", "rain-drummed roof slates", "cold beeswax and ash". This applies to every keyLocation's sensoryDetails and every sensoryVariants entry.
- F30-5 SENSORY MINIMUM: Each keyLocation's sensoryDetails MUST have at least 4 entries in EACH of sights, sounds, smells, and tactile. Fewer than 4 entries per sense field will fail the quality gate. Aim for 5–6 entries per sense for richness. Sensory richness scoring requires ≥4 noun-phrase entries per field — do not generate placeholder or thin lists.`}
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
        "sights": ["candlelight on dark oak", "rain-streaked window panes"],
        "sounds": ["crackling fire", "pages turning in the silence"],
        "smells": ${trims ? `["a scent unique to this room", "a second, contrasting scent"]` : `["beeswax and cold ash", "damp stone and old leather"]`},
        "tactile": ["worn leather armchair", "chill draft from the casement"]
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
          "sounds": ${trims ? `["a sound unique to this hour", "the creak of old timbers"]` : `["silence broken by a distant clock", "the creak of old timbers"]`},
          "smells": ${trims ? `["dust", "woodsmoke", "a scent unique to this room"]` : `["beeswax", "dust", "woodsmoke"]`},
          "mood": "uneasy stillness"
        },
        {
          "id": "evening_clear",
          "timeOfDay": "evening",
          "weather": "clear",
          "sights": ${trims ? `["candlelight catching brass fittings", "a sight unique to this hour"]` : `["candlelight catching brass fittings", "long shadows across the floor"]`},
          "sounds": ${trims ? `["a sound unique to this room", "distant voices from below stairs"]` : `["the tick of a mantel clock", "distant voices from below stairs"]`},
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
- CROSS-LOCATION DISTINCTNESS (critical): every location must have a DIFFERENT dominant sensory signature and mood. Do NOT reuse the same scents/sounds (e.g. "tick of the clock", "damp stone", "beeswax", "long shadows") across multiple locations — a reader should tell the rooms apart by palette alone. The crime scene in particular must have its own unmistakable sensory identity. Each location's sensoryVariants must also differ from the top-level atmosphere block, so chapters set in different rooms don't all open the same way.
- If the narrative does not suggest specific sub-locations, invent context-appropriate ones for the setting type (rooms, outbuildings, grounds, nearby places). A country house has a library, a study, a drawing room, a servants\'s hall, gardens. An ocean liner has a dining saloon, a promenade deck, a cabin corridor, a cargo hold.
- Atmosphere: 2-3 paragraphs
${trims ? `- All 5 senses must be present for every key location (sights, sounds, smells, tactile — taste is synthesised from smells)` : `- **CRITICAL — Sensory Format**: Each sensory detail entry MUST be a short noun phrase or gerund (3–8 words). No complete sentences, no verbs, no subject-verb constructions. Full sentences WILL be rejected. Aim for 5–6 entries per sense field to ensure richness.
  ✓ CORRECT: "crackling fire" / "damp stone underfoot" / "wood smoke and tallow" / "worn leather armrest"
  ✗ WRONG: "The fire crackles in the hearth, providing warmth." / "A rich scent of beeswax fills the air."
- All 5 senses must be present for every key location (sights, sounds, smells, tactile — taste is synthesised from smells)
- **F30-5 SENSORY MINIMUM**: MINIMUM 4 noun-phrase entries per sense field (sights, sounds, smells, tactile). The quality scorer counts entries — locations with fewer than 4 entries in any sense field score 0 on sensory richness and will fail quality validation. Target 5–6 entries per field.`}
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
- The top-level \`atmosphere\` object is REQUIRED and must include: era, weather, timeFlow, mood, eraMarkers, sensoryPalette, paragraphs. Omitting the atmosphere object entirely will fail schema validation.

Quality bar:
- Every location must support mystery mechanics (access restrictions, sightlines, concealment opportunities, evidence persistence).
- Sensory language must be specific and period-grounded, not generic gothic filler.
- Atmospheric variety across sensoryVariants must create scene-level contrast useful to prose generation.

Micro-exemplars:
- Weak visualDetails: "A large old room with furniture."
- Strong visualDetails: "Gas sconces throw a tobacco-yellow wash over hunting prints; rain-dark oak absorbs light at corridor turns."
- Weak accessControl: "People can go there sometimes."
- Strong accessControl: "Household staff enter before dawn for coal; family access resumes after breakfast; library remains locked after dinner."

Before finalizing, run a silent checklist:
- top-level atmosphere object complete
- keyLocations are objects, not strings
- each sensoryDetails field has rich noun-phrase atoms (3–8 words each, no sentences)
- sensoryVariants cover morning-rain, afternoon-grey, evening-clear
- JSON only, no markdown fences${enhancedFeedback}`;

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
${(promptSpecimenTrimsEnabled()
    ? [
        // A_110 0.6b: an example place is a place the model picks; the operation needs none.
        "- For Riviera settings: the French or the Italian Riviera, with the town named",
        "- For ocean liners: the route, from the port of departure to the port of arrival",
        "- For trains: the route, from terminus to terminus",
      ]
    : [
        "- For Riviera settings: French Riviera (Nice, Cannes, Monaco) or Italian Riviera",
        "- For ocean liners: Specify route (e.g., Southampton to New York, Liverpool to Boston)",
        "- For trains: Specify route or terminus (e.g., London to Scotland, Orient Express)",
      ]
  ).join("\n")}
- Make the choice contextually appropriate to the era (${era}) and setting type

Key locations mentioned in narrative:


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
  const config = getGenerationParams().agent2c_location_profiles.params;
  const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;

  // CR-20 (A1X-03): the shell 2b, 2c, 2d and 2e each wrote out — shared/json-artifact-generator.ts.
  const { result, cost, durationMs } = await generateJsonArtifact<Omit<LocationProfilesResult, "cost" | "durationMs">>(client, {
    agentName: "Agent 2c (Location Profiles)",
    label: "Agent2c-LocationProfiles",
    logName: "[Agent 2c] Location profiles",
    schema: "location_profiles",
    withRunMeta: true,
    maxAttempts: resolvedMaxAttempts,
    model: config.model,
    runId: inputs.runId,
    projectId: inputs.projectId,
    guard: true, // owner decision 3 (ORC-Q03)
    buildMessages: (previousErrors) => buildLocationProfilesPrompt(inputs, previousErrors).messages,
    structuralCheck: (profiles) => {
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
    },
  });
  const validatedResult = result as LocationProfilesResult;

  return {
    ...validatedResult,
    cost: cost,
    durationMs,
  };
}
