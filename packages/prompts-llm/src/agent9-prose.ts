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
  characterProfiles?: any; // CharacterProfilesResult
  locationProfiles?: any; // LocationProfilesResult
  temporalContext?: any; // TemporalContextResult
  targetLength?: "short" | "medium" | "long";
  narrativeStyle?: "classic" | "modern" | "atmospheric";
  qualityGuardrails?: string[];
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

  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const era = cmlCase.meta?.era?.decade ?? "Unknown era";
  const cast = inputs.cast.characters || [];

  const system = `You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.\n\nRules:\n- Do not introduce new facts beyond the CML and outline.\n- Preserve all clues, alibis, and the core mystery logic.\n- Maintain strict setting fidelity to the specified location and era.\n- Write immersive, sensory-rich prose that transports readers to the setting\n- Include scene-setting passages that establish atmosphere, time, and place\n- Use varied sentence structure and sophisticated vocabulary\n- Show character emotions through actions and dialogue, not just telling\n- Create distinct character voices and personalities based on their profiles\n- Avoid stereotypes and reduce bias.\n- Keep language original; do not copy copyrighted text.\n- Output valid JSON only.`;

  const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Never vary it.\n   Cast names: ${cast.map((c: any) => c.name).join(', ')}\n   - Use these EXACT names throughout - no variations\n   - If detective exists, choose ONE name and use consistently\n\n2. Gender pronouns must match character definition:\n${cast.map((c: any) => {
    const gender = c.gender?.toLowerCase();
    const pronouns = gender === 'male' ? 'he/him/his' : gender === 'female' ? 'she/her/her' : 'they/them/their';
    return `   - ${c.name}: ${pronouns}`;
  }).join('\n')}\n   - Never switch pronouns mid-story\n\n3. Character roles are fixed:\n${cast.map((c: any) => `   - ${c.name}: ${c.role || 'passenger'}`).join('\n')}\n   - Passengers stay in passenger areas (cabins, lounges, dining room)\n   - Crew stays in crew areas unless working\n   - Never place passengers in "crew quarters"`;

  // Build character personality/voice guidance from character profiles
  let characterPersonalityContext = '';
  if (inputs.characterProfiles && Array.isArray(inputs.characterProfiles.profiles)) {
    const personalities = inputs.characterProfiles.profiles.map((profile: any) => {
      const name = profile.name || 'Unknown';
      const persona = profile.publicPersona || '';
      const secret = profile.privateSecret || '';
      const stakes = profile.stakes || '';
      
      // Extract voice hints from persona and role
      let voiceHints = '';
      const personaLower = persona.toLowerCase();
      if (personaLower.includes('aristocrat') || personaLower.includes('lord') || personaLower.includes('lady')) {
        voiceHints = 'Speaks formally, uses proper grammar, may be condescending';
      } else if (personaLower.includes('servant') || personaLower.includes('maid') || personaLower.includes('butler')) {
        voiceHints = 'Speaks deferentially, uses "sir/madam", precise and formal';
      } else if (personaLower.includes('detective') || personaLower.includes('inspector')) {
        voiceHints = 'Direct questions, analytical observations, methodical speech';
      } else if (personaLower.includes('young') || personaLower.includes('flapper')) {
        voiceHints = 'More informal, enthusiastic, modern expressions';
      } else if (personaLower.includes('american')) {
        voiceHints = 'Less formal than British, direct, practical';
      }
      
      return name + ':\\n  Public: ' + persona + '\\n  Hidden: ' + secret + '\\n  Stakes: ' + stakes + (voiceHints ? '\\n  Voice: ' + voiceHints : '');
    }).join('\\n\\n');
    
    characterPersonalityContext = '\\n\\nCHARACTER PERSONALITIES & VOICES:\\n\\nEach character has a distinct personality, voice, and hidden depth. Use these to create authentic, differentiated characters:\\n\\n' + personalities + '\\n\\nWRITING GUIDANCE:\\n1. Dialogue: Each character should sound different based on class, background, age\\n2. Internal thoughts: Reference their hidden secrets and stakes to add subtext\\n3. Body language: Show personality through gestures, posture, habits\\n4. Reactions: Characters react differently to same events based on personality\\n5. Speech patterns: Formal vs informal, verbose vs terse, emotional vs analytical';
  }

  const physicalPlausibilityRules = `\nPHYSICAL PLAUSIBILITY REQUIREMENTS:\n\nAll physical evidence must obey real-world physics:\n\n1. VIABLE Evidence by Location:\n   Interior: fingerprints, torn fabric, overturned furniture, blood spatter, documents\n   Exterior (calm): secured items, structural damage, witness observations\n   Exterior (storm): NO trace evidence survives - use only structural damage or interior evidence\n\n2. IMPLAUSIBLE Evidence (DO NOT USE):\n   ❌ Footprints on wooden deck (treated wood doesn't retain prints)\n   ❌ Footprints in rain/storm (washed away immediately)\n   ❌ Metal embedded in hardwood (requires bullet velocity, not human force)\n   ❌ Light objects in storm (blown away)\n\n3. For struggle evidence use:\n   ✓ Overturned furniture, torn clothing, scattered items, defensive wounds\n   ❌ Objects embedded in hard surfaces, shattered steel/iron`;

  const eraAuthenticityRules = era !== "Unknown era" ? `\nERA AUTHENTICITY (${era}):\n\n1. FORBIDDEN terms (did not exist):\n   ${era === '1950s' ? '❌ cell phone, internet, email, computer, GPS, digital camera, text message, app, online' : '❌ Modern technology'}\n\n2. REQUIRED period markers (include 2+ per scene):\n   ✓ Formal address: Mr./Mrs./Miss/Detective/Captain\n   ✓ Period technology: ${era === '1950s' ? 'telephone, telegram, radio, typewriter' : 'period-appropriate items'}\n   ✓ Fashion: ${era === '1950s' ? 'gloves, hats, formal suits, stockings' : 'period clothing'}\n\n3. Use period-authentic language and social norms` : '';

  // Build location profiles context (avoid nested template literals)
  let locationProfilesContext = '';
  if (inputs.locationProfiles) {
    const primaryName = inputs.locationProfiles.primary?.name || 'N/A';
    const primaryPlace = inputs.locationProfiles.primary?.place || '';
    const primaryCountry = inputs.locationProfiles.primary?.country || '';
    const geographicContext = primaryPlace && primaryCountry 
      ? primaryPlace + ', ' + primaryCountry 
      : primaryPlace || primaryCountry || '';
    const primarySummary = inputs.locationProfiles.primary?.summary || '';
    const keyLocs = (inputs.locationProfiles.keyLocations || []).map((loc: any) => 
      '- ' + loc.name + ' (' + loc.type + '): ' + loc.purpose
    ).join('\\n');
    const mood = inputs.locationProfiles.atmosphere?.mood || 'N/A';
    const weather = inputs.locationProfiles.atmosphere?.weather || 'N/A';
    
    // Build comprehensive sensory palette
    const sensoryExamples = (inputs.locationProfiles.keyLocations || []).slice(0, 3).map((loc: any) => {
      const senses = loc.sensoryDetails || {};
      const sights = (senses.sights || []).slice(0, 3).join(', ');
      const sounds = (senses.sounds || []).slice(0, 3).join(', ');
      const smells = (senses.smells || []).slice(0, 3).join(', ');
      const tactile = (senses.tactile || []).slice(0, 2).join(', ');
      return loc.name + ' (' + loc.type + '):\\n  - Visual: ' + sights + '\\n  - Sounds: ' + sounds + '\\n  - Scents: ' + smells + (tactile ? '\\n  - Touch: ' + tactile : '');
    }).join('\\n\\n');
    
    const locationLine = geographicContext 
      ? 'Primary Location: ' + primaryName + ' (' + geographicContext + ')\\n' + primarySummary
      : 'Primary Location: ' + primaryName + '\\n' + primarySummary;
    
    // Add specific sensory usage examples
    const sensoryGuidance = '\\n\\nSENSORY WRITING TECHNIQUES:\\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\\n- Period authenticity: Smell of coal smoke, sound of phonograph, touch of silk gloves\\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature\\n- Example: "The library smelled of leather and pipe tobacco. Rain drummed against the windows, muffling the distant clatter from the kitchens."';
    
    locationProfilesContext = '\\n\\nLOCATION PROFILES:\\n\\nYou have rich location profiles to draw from. Use them to create vivid, atmospheric scenes.\\n\\n' + locationLine + '\\n\\nKey Locations Available:\\n' + keyLocs + '\\n\\nAtmosphere: ' + mood + '\\nWeather: ' + weather + '\\n\\nUSAGE GUIDELINES:\\n1. First mention of location: Use full sensory description from profiles\\n2. Geographic grounding: Reference the specific place (' + (geographicContext || 'setting') + ') naturally in dialogue or narrative\\n3. Action scenes: Integrate physical layout details (access, sightlines, constraints)\\n4. Atmospheric scenes: Reference weather, lighting, sounds from sensory palette\\n5. Era details: Weave in period markers naturally\\n6. Consistency: Keep all location descriptions aligned with profiles\\n\\nSENSORY PALETTE (use 2-3 senses per scene):\\n' + sensoryExamples + sensoryGuidance;
  }

  // Build temporal context (specific date, season, fashion, current affairs)
  let temporalContextBlock = '';
  if (inputs.temporalContext) {
    const dateInfo = inputs.temporalContext.specificDate;
    const dateStr = dateInfo.month + ' ' + dateInfo.year;
    const season = inputs.temporalContext.seasonal?.season || 'N/A';
    const seasonWeather = (inputs.temporalContext.seasonal?.weather || []).slice(0, 3).join(', ');
    const mensFormeal = (inputs.temporalContext.fashion?.mensWear?.formal || []).slice(0, 4).join(', ');
    const mensCasual = (inputs.temporalContext.fashion?.mensWear?.casual || []).slice(0, 3).join(', ');
    const mensAcc = (inputs.temporalContext.fashion?.mensWear?.accessories || []).slice(0, 3).join(', ');
    const womensFormeal = (inputs.temporalContext.fashion?.womensWear?.formal || []).slice(0, 4).join(', ');
    const womensCasual = (inputs.temporalContext.fashion?.womensWear?.casual || []).slice(0, 3).join(', ');
    const womensAcc = (inputs.temporalContext.fashion?.womensWear?.accessories || []).slice(0, 3).join(', ');
    const music = (inputs.temporalContext.cultural?.entertainment?.popularMusic || []).slice(0, 3).join(', ');
    const films = (inputs.temporalContext.cultural?.entertainment?.films || []).slice(0, 2).join(', ');
    const prices = (inputs.temporalContext.cultural?.dailyLife?.typicalPrices || []).slice(0, 4).join(', ');
    const majorEvents = (inputs.temporalContext.currentAffairs?.majorEvents || []).slice(0, 2).join('; ');
    const atmosphericDetails = (inputs.temporalContext.atmosphericDetails || []).slice(0, 4).join(' ');
    
    const fashionGuidance = '\\n\\nFASHION INTEGRATION TECHNIQUES:\\n- First appearance: Describe outfit to establish class/personality\\n- Accessories: Gloves, hats, pocket watches, jewelry reveal status\\n- Time-specific: Different outfits for different times of day\\n- Character traits: Fastidious dresser vs rumpled appearance\\n- Action integration: "She tugged at her glove" or "He adjusted his tie"\\n- Weather appropriate: Overcoats in winter, light linen in summer';
    
    const culturalGuidance = '\\n\\nCULTURAL TOUCHSTONE INTEGRATION:\\n- Casual conversation: "Did you hear that new jazz record?" or "I saw the latest Chaplin film"\\n- Background details: Radio playing, newspaper headlines, theater posters\\n- Social commentary: Characters discuss current events naturally\\n- Class indicators: Aristocrats discuss opera, servants discuss music halls\\n- Authentic references: Use actual songs, films, events from the specific date';
    
    temporalContextBlock = '\\n\\nTEMPORAL CONTEXT:\\n\\nThis story takes place in ' + dateStr + ' during ' + season + '.\\n\\nSeasonal Atmosphere:\\n- Weather patterns: ' + seasonWeather + '\\n- Season: ' + season + '\\n\\nPeriod Fashion (describe naturally):\\n- Men formal: ' + mensFormeal + '\\n- Men casual: ' + mensCasual + '\\n- Men accessories: ' + mensAcc + '\\n- Women formal: ' + womensFormeal + '\\n- Women casual: ' + womensCasual + '\\n- Women accessories: ' + womensAcc + '\\n\\nCultural Context (reference naturally):\\n- Music/entertainment: ' + music + (films ? '; Films: ' + films : '') + '\\n- Typical prices: ' + prices + (majorEvents ? '\\n- Current events: ' + majorEvents : '') + '\\n\\nAtmospheric Details:\\n' + atmosphericDetails + fashionGuidance + culturalGuidance + '\\n\\nUSAGE REQUIREMENTS:\\n1. Date references: Mention month/season at least once early in story\\n2. Fashion descriptions: Every character gets fashion description on first appearance\\n3. Cultural touchstones: Reference music/entertainment 2-3 times across story\\n4. Prices/daily life: Use when relevant (meals, tickets, wages)\\n5. Seasonal consistency: Weather and atmosphere match season throughout\\n6. Historical accuracy: NO anachronisms for ' + dateStr;
  }

  const qualityGuardrails = Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : [];
  const qualityGuardrailBlock = qualityGuardrails.length > 0
    ? `\n\nQUALITY GUARDRAILS (MUST SATISFY):\n${qualityGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}`
    : "";

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has 3-6 paragraphs (vary length for pacing).\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Begin key scenes with atmospheric description\n   - Establish time of day, weather, lighting\n   - Describe location using sensory details (sight, sound, smell, touch)\n   - Set mood and atmosphere before action begins\n   - Use location and temporal context to ground reader\n   Example: "The June morning brought oppressive heat to Ashford Manor. In the drawing room, sunlight slanted through dust motes while the scent of rose gardens drifted through open windows. Lord Ashford's pocket watch ticked audibly in the silence."\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example: "Quite a lovely morning," Lady Pemberton said, her eyes fixed on the doorway rather than her companion.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}`;

  const user = `Write the full prose following the outline scenes.\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(scenes, null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${characterConsistencyRules}${characterPersonalityContext}\n\n${physicalPlausibilityRules}${eraAuthenticityRules}${locationProfilesContext}${temporalContextBlock}\n\n${developer}` },
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
