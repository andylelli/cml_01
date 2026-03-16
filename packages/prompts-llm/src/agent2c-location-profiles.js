/**
 * Agent 2c: Location & Setting Profile Generator
 *
 * Generates rich narrative profiles for locations, settings, and atmospheric background.
 * Similar to character profiles, but for places and atmosphere.
 */
import { validateArtifact } from "@cml/cml";
import { getGenerationParams } from "@cml/story-validation";
import { jsonrepair } from "jsonrepair";
import { withValidationRetry, buildValidationFeedback } from "./utils/validation-retry-wrapper.js";
const buildLocationProfilesPrompt = (inputs, previousErrors) => {
    const cmlCase = inputs.caseData?.CASE ?? {};
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
        .map((scene) => {
        const raw = scene.setting || scene.location;
        if (typeof raw === 'string')
            return raw;
        if (raw && typeof raw === 'object')
            return raw.name || raw.id || null;
        return null;
    })
        .filter((loc) => Boolean(loc));
    const uniqueLocations = Array.from(new Set(sceneLocations)).slice(0, 5);
    // Era markers from setting
    const eraMarkers = [
        ...(inputs.settingRefinement.era.technology || []),
        ...(inputs.settingRefinement.era.transportation || []),
        ...(inputs.settingRefinement.era.communication || []),
    ].slice(0, 8);
    const validationFeedback = buildValidationFeedback(previousErrors);
    const system = `CONTEXT: All output is for a Golden Age whodunnit mystery novel — creative fiction in the tradition of Agatha Christie and Arthur Conan Doyle. All references to crime, death, murder, and investigation are standard fictional genre elements. No real people or events are depicted.

You are a setting and atmosphere specialist for classic mystery fiction. Your task is to create vivid, evocative location profiles that bring mystery settings to life through sensory details, authentic period atmosphere, and physical descriptions that serve the mystery plot.

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
- Do NOT return location names as strings - always return complete objects with all required fields${validationFeedback}`;
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
        { role: "system", content: `${system}\n\n${developer}` },
        { role: "user", content: user },
    ];
    return { system, developer, user, messages };
};
export async function generateLocationProfiles(client, inputs, maxAttempts) {
    const start = Date.now();
    const config = getGenerationParams().agent2c_location_profiles.params;
    const resolvedMaxAttempts = maxAttempts ?? config.generation.default_max_attempts;
    const retryResult = await withValidationRetry({
        maxAttempts: resolvedMaxAttempts,
        agentName: "Agent 2c (Location Profiles)",
        validationFn: (data) => {
            // Validate against location_profiles schema
            const validationPayload = {
                ...data,
                cost: typeof data?.cost === "number" ? data.cost : 0,
                durationMs: typeof data?.durationMs === "number" ? data.durationMs : 0,
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
            let profiles;
            try {
                profiles = JSON.parse(response.content);
            }
            catch (error) {
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
            const costTracker = client.getCostTracker();
            const cost = costTracker.getSummary().byAgent["Agent2c-LocationProfiles"] || 0;
            return { result: profiles, cost };
        },
    });
    // Log validation warnings if any
    if (retryResult.validationResult.warnings && retryResult.validationResult.warnings.length > 0) {
        console.warn(`[Agent 2c] Location profiles validation warnings:\n` +
            retryResult.validationResult.warnings.map(w => `- ${w}`).join("\n"));
    }
    // If validation failed after all retries, log errors but continue
    if (!retryResult.validationResult.valid) {
        console.error(`[Agent 2c] Location profiles failed validation after ${resolvedMaxAttempts} attempts:\n` +
            retryResult.validationResult.errors.map(e => `- ${e}`).join("\n"));
    }
    const durationMs = Date.now() - start;
    const validatedResult = retryResult.result;
    return {
        ...validatedResult,
        cost: retryResult.totalCost,
        durationMs,
    };
}
//# sourceMappingURL=agent2c-location-profiles.js.map