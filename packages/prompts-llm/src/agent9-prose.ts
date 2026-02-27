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
import { ChapterValidator } from "@cml/story-validation";

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ChapterSummary {
  chapterNumber: number;
  title: string;
  charactersPresent: string[];
  settingTerms: string[];
  keyEvents: string[];
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
  detectiveType?: 'police' | 'private' | 'amateur'; // Affects phantom-name warnings
  qualityGuardrails?: string[];
  writingGuides?: { humour?: string; craft?: string };
  runId?: string;
  projectId?: string;
  onProgress?: (phase: string, message: string, percentage: number) => void;
  /** Number of scenes to process per LLM call (1–10, default 1). Higher values increase throughput at the cost of coarser retry granularity. */
  batchSize?: number;
  /** Called after each batch of chapters is successfully generated and validated.
   *  The fourth argument contains validation issues from any failed attempts for this batch. */
  onBatchComplete?: (chapters: ProseChapter[], batchStart: number, batchEnd: number, validationIssues: string[]) => Promise<void> | void;
}

export interface ProseGenerationResult {
  status: "draft" | "final";
  tone?: string;
  chapters: ProseChapter[];
  cast: string[];
  note?: string;
  cost: number;
  durationMs: number;
  validationDetails?: {
    totalBatches: number;
    batchesWithRetries: number;
    failureHistory: Array<{
      batchIndex: number;
      chapterRange: string;
      attempt: number;
      errors: string[];
    }>;
  };
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

/**
 * Extract prose requirements from CML for validation
 * Returns formatted string describing mandatory prose elements
 */
const buildProseRequirements = (caseData: CaseData, scenesForChapter?: unknown[]): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const proseReqs = cmlCase.prose_requirements ?? {};
  
  if (!proseReqs || Object.keys(proseReqs).length === 0) {
    return '';
  }

  let output = '\n\nCRITICAL PROSE REQUIREMENTS:\n\n';
  output += 'The CML specifies exact requirements for certain validation-critical scenes. You MUST include these elements at the specified positions.\n\n';

  // Discriminating test scene
  if (proseReqs.discriminating_test_scene) {
    const dts = proseReqs.discriminating_test_scene;
    output += `**Discriminating Test Scene (Act ${dts.act_number}, Scene ${dts.scene_number}):**\n`;
    output += `This scene MUST test: ${(dts.tests_assumption_elements || []).join(', ')}\n`;
    output += `Required elements: ${(dts.required_elements || []).join(', ')}\n`;
    output += `Outcome: ${dts.outcome || 'N/A'}\n\n`;
  }

  // Suspect clearance scenes
  if (proseReqs.suspect_clearance_scenes && proseReqs.suspect_clearance_scenes.length > 0) {
    output += '**Suspect Clearance Scenes:**\n';
    proseReqs.suspect_clearance_scenes.forEach((clearance: any) => {
      output += `- ${clearance.suspect_name} (Act ${clearance.act_number}, Scene ${clearance.scene_number}): ${clearance.clearance_method}\n`;
      if (clearance.required_clues && clearance.required_clues.length > 0) {
        output += `  Clues: ${clearance.required_clues.join(', ')}\n`;
      }
    });
    output += '\n';
  }

  // Culprit revelation scene
  if (proseReqs.culprit_revelation_scene) {
    const crs = proseReqs.culprit_revelation_scene;
    output += `**Culprit Revelation Scene (Act ${crs.act_number}, Scene ${crs.scene_number}):**\n`;
    output += `Method: ${crs.revelation_method || 'detective explanation'}\n`;
    if (crs.required_clues && crs.required_clues.length > 0) {
      output += `Must reference clues: ${crs.required_clues.join(', ')}\n`;
    }
    output += '\n';
  }

  // Identity rules (culprit reference restrictions)
  if (proseReqs.identity_rules) {
    const rules = proseReqs.identity_rules;
    output += '**Identity Protection Rules:**\n';
    output += `Before Act ${rules.reveal_act}, Scene ${rules.reveal_scene}:\n`;
    output += `- Refer to culprit as: "${rules.before_reveal_reference}"\n`;
    output += `After revelation:\n`;
    output += `- Refer to culprit as: "${rules.after_reveal_reference}"\n\n`;
  }

  // Clue to scene mapping for this chapter
  if (proseReqs.clue_to_scene_mapping && scenesForChapter) {
    const relevantClues = proseReqs.clue_to_scene_mapping.filter((mapping: any) => {
      // Check if this clue should appear in current chapter batch
      return scenesForChapter.some((scene: any) => 
        scene.actNumber === mapping.act_number && scene.sceneNumber === mapping.scene_number
      );
    });
    
    if (relevantClues.length > 0) {
      output += '**Clue Placement for These Chapters:**\n';
      relevantClues.forEach((mapping: any) => {
        output += `- ${mapping.clue_id} must appear in Act ${mapping.act_number}, Scene ${mapping.scene_number} via ${mapping.delivery_method}\n`;
      });
      output += '\n';
    }
  }

  output += '**VALIDATION CONSEQUENCE:** If these requirements are not met exactly, story validation will fail and the entire generation will be rejected, costing $5-8 to regenerate. Follow these specifications precisely.\n';

  return output;
};

/**
 * Strip phantom character names from scene data.
 *
 * 1. Characters array — remove any name not in the valid cast list.
 * 2. Summary / title text — replace any `Title Surname` pattern
 *    whose surname is not a valid cast member with an anonymous equivalent.
 *
 * This prevents phantom names baked into the narrative outline (e.g. from stale
 * LLM examples) from instructing the prose LLM to write about non-existent people.
 * If filtering the characters array would leave it empty, the original is preserved
 * so the scene still has context.
 */
function sanitizeScenesCharacters(scenes: any[], validCastNames: string[]): any[] {
  const validSet = new Set(validCastNames);
  // Build the set of valid surnames (last word of each cast name)
  const validSurnames = new Set(validCastNames.map(n => n.split(' ').pop() ?? n));

  // Same regex as ChapterValidator.checkCharacterNames
  const titlePattern = /\b(Inspector|Constable|Sergeant|Captain|Detective|Mr\.|Mrs\.|Miss|Dr\.)\s+([A-Z][a-z]+)/g;
  const anonMap: Record<string, string> = {
    Inspector: 'an inspector',
    Constable: 'a constable',
    Sergeant: 'the sergeant',
    Captain: 'the captain',
    Detective: 'the detective',
    'Mr.': 'a gentleman',
    'Mrs.': 'a woman',
    Miss: 'a young woman',
    'Dr.': 'the doctor',
  };

  const sanitizeText = (text: string): string =>
    text.replace(titlePattern, (match, title, surname) =>
      validSurnames.has(surname) ? match : (anonMap[title] ?? 'an officer')
    );

  return scenes.map(scene => {
    if (!scene) return scene;
    const sanitized = Array.isArray(scene.characters)
      ? scene.characters.filter((name: any) => typeof name === 'string' && validSet.has(name))
      : scene.characters;

    // Sanitize all free-text fields that the prose LLM reads — not just summary/title.
    // The outline LLM commonly writes phantom names in purpose and dramaticElements too.
    const sanitizedDramaticElements = scene.dramaticElements
      ? Object.fromEntries(
          Object.entries(scene.dramaticElements as Record<string, any>).map(([k, v]) => [
            k,
            typeof v === 'string' ? sanitizeText(v) : v,
          ])
        )
      : scene.dramaticElements;

    return {
      ...scene,
      characters: sanitized?.length > 0 ? sanitized : scene.characters,
      summary: typeof scene.summary === 'string' ? sanitizeText(scene.summary) : scene.summary,
      title: typeof scene.title === 'string' ? sanitizeText(scene.title) : scene.title,
      purpose: typeof scene.purpose === 'string' ? sanitizeText(scene.purpose) : scene.purpose,
      dramaticElements: sanitizedDramaticElements,
    };
  });
}

const buildProsePrompt = (inputs: ProseGenerationInputs, scenesOverride?: unknown[], chapterStart = 1, chapterSummaries: ChapterSummary[] = []) => {
  const { outline, targetLength = "medium", narrativeStyle = "classic" } = inputs;
  const outlineActs = Array.isArray(outline.acts) ? outline.acts : [];
  const scenes = Array.isArray(scenesOverride)
    ? scenesOverride
    : outlineActs.flatMap((act) => (Array.isArray(act.scenes) ? act.scenes : []));

  const cmlCase = (inputs.caseData as any)?.CASE ?? {};
  const era = cmlCase.meta?.era?.decade ?? "Unknown era";
  const cast = inputs.cast.characters || [];

  const system = `You are an expert prose writer for classic mystery fiction. Your role is to write compelling, atmospheric narrative chapters that read like a professionally published novel.

⛔ ABSOLUTE RULE — CHARACTER NAMES:
The ONLY characters who exist in this story are: ${cast.map((c: any) => c.name).join(', ')}.
Do NOT invent, borrow, or introduce ANY character not on that list — no constables, no solicitors, no butlers, no servants, no shopkeepers, no bystanders with names.
Named characters that Golden Age LLMs commonly hallucinate and which are COMPLETELY FORBIDDEN in this story: Jennings, Jenkins, Hargrove, Thompson, Reed, Mills, Harlow, Brown, Wilson, Davies, Constable [anything], Inspector [anything not in the cast list], Mrs. [anything not in the cast list], Mr. [anything not in the cast list].
Unnamed walk-ons ("a footman", "the postmistress", "an officer") are allowed ONLY if they never receive a name or title+surname combination.
⚠️ BEFORE YOU WRITE each chapter, ask yourself: "Does every person I name appear in this list: ${cast.map((c: any) => c.name).join(', ')}?" If not, remove them.
Any invented named character will fail validation and abort the entire generation.

Rules:
- Do not introduce new facts beyond the CML and outline.
- Preserve all clues, alibis, and the core mystery logic.
- Maintain strict setting fidelity to the specified location and era.
- Write immersive, sensory-rich prose that transports readers to the setting
- Include scene-setting passages that establish atmosphere, time, and place
- Use varied sentence structure and sophisticated vocabulary
- Show character emotions through actions and dialogue, not just telling
- Create distinct character voices and personalities based on their profiles
- Avoid stereotypes and reduce bias.
- Keep language original; do not copy copyrighted text.
- Output valid JSON only.
- DISAPPEARANCE-TO-MURDER BRIDGE: If the story opens with a disappearance, you MUST include an explicit bridge scene that transitions it to a confirmed murder (body discovered, death confirmed, investigation reclassified). Never jump from missing person to murder investigation without this bridge.
- ANTI-REPETITION: Do not repeat the same atmospheric or descriptive phrases across adjacent chapters. Vary imagery, metaphors, and sentence openings. Flag any phrase used more than twice in the same batch with a paraphrase.`;

  const characterConsistencyRules = `\nCRITICAL CHARACTER CONSISTENCY RULES:\n\n1. Each character has ONE canonical name. Use ONLY names from this list. Never vary, abbreviate, or add titles beyond what is listed.\n   COMPLETE CAST (no other named characters exist): ${cast.map((c: any) => c.name).join(', ')}\n   - "Mr. Jennings entered the room" \u2192 ILLEGAL. Jennings is not in the cast.\n   - "Constable Reed took notes" \u2192 ILLEGAL. Reed is not in the cast.\n   - "A constable took notes" \u2192 LEGAL (no name given).\n\n2. Gender pronouns must match character definition:\n${cast.map((c: any) => {
    const gender = c.gender?.toLowerCase();
    const pronouns = gender === 'male' ? 'he/him/his' : gender === 'female' ? 'she/her/her' : 'they/them/their';
    return `   - ${c.name}: ${pronouns}`;
  }).join('\n')}\n   - Never switch pronouns mid-story\n\n3. Character roles are fixed:\n${cast.map((c: any) => `   - ${c.name}: ${c.role || 'character'}`).join('\n')}\n   - Never place characters in locations inconsistent with their role`;

  // Build character personality/voice/humour guidance from character profiles
  let characterPersonalityContext = '';
  if (inputs.characterProfiles && Array.isArray(inputs.characterProfiles.profiles)) {
    const HUMOUR_STYLE_DESCRIPTIONS: Record<string, string> = {
      understatement: 'Increases seriousness by pretending not to. Deadpan delivery of extraordinary facts.',
      dry_wit: 'Sharp observations about human behaviour. Concise, often one-liners.',
      polite_savagery: 'Maintains perfect civility while delivering devastating verbal incisions.',
      self_deprecating: 'Turns wit inward. Disarming, often hides intelligence or pain.',
      observational: 'Notices absurdity in situations and people. Comments wryly on what others miss.',
      deadpan: 'Delivers the remarkable as though it were mundane. Flat affect, maximum impact.',
      sardonic: 'Darker edge. Mocking tone that reveals cynicism or world-weariness.',
      blunt: 'Says what others are thinking. Lacks social filter. Comic through honesty.',
      none: 'This character is not humorous. They are earnest, tense, or grief-stricken.',
    };

    const personalities = inputs.characterProfiles.profiles.map((profile: any) => {
      const name = profile.name || 'Unknown';
      const persona = profile.publicPersona || '';
      const secret = profile.privateSecret || '';
      const stakes = profile.stakes || '';
      const humourStyle = profile.humourStyle || 'none';
      const humourLevel = typeof profile.humourLevel === 'number' ? profile.humourLevel : 0;
      const speechMannerisms = profile.speechMannerisms || '';
      const styleDesc = HUMOUR_STYLE_DESCRIPTIONS[humourStyle] || '';

      let humourGuidance = '';
      if (humourStyle !== 'none' && humourLevel > 0) {
        const frequency = humourLevel >= 0.7 ? 'frequently' : humourLevel >= 0.4 ? 'occasionally' : 'rarely';
        humourGuidance = '\n  Humour: ' + humourStyle.replace(/_/g, ' ') + ' (level ' + humourLevel.toFixed(1) + ' - ' + frequency + ' witty). ' + styleDesc;
      } else {
        humourGuidance = '\n  Humour: None - this character plays it straight. Their seriousness provides contrast for wittier characters.';
      }

      const voiceLine = speechMannerisms ? '\n  Voice & Mannerisms: ' + speechMannerisms : '';

      return name + ':\n  Public: ' + persona + '\n  Hidden: ' + secret + '\n  Stakes: ' + stakes + humourGuidance + voiceLine;
    }).join('\n\n');

    characterPersonalityContext = '\n\nCHARACTER PERSONALITIES, VOICES & HUMOUR:\n\nEach character has a distinct personality, voice, humour style, and hidden depth. Use these to create authentic, differentiated characters whose wit (or lack thereof) reveals who they are:\n\n' + personalities + '\n\nWRITING GUIDANCE:\n1. Dialogue: Each character should sound different. Humour style shapes HOW they speak, humourLevel shapes HOW OFTEN.\n2. Internal thoughts: Reference their hidden secrets and stakes to add subtext.\n3. Body language: Show personality through gestures, posture, habits.\n4. Reactions: Characters react differently to same events based on personality.\n5. Speech patterns: Use speechMannerisms for verbal tics, rhythm, formality level.\n6. HUMOUR CONTRAST: Characters with high humourLevel (0.7+) should deliver wit frequently. Characters with low/zero should play it straight. The CONTRAST between witty and earnest characters creates the best comedy.\n7. HUMOUR AS CHARACTER: A character\'s humour style reveals their psychology - self_deprecating masks insecurity, polite_savagery masks aggression, deadpan masks emotion.\n8. NEVER force humour on a character with humourLevel 0 or style none.';
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
    const sensoryGuidance = '\n\nSENSORY WRITING TECHNIQUES:\n- Opening paragraphs: Lead with 2-3 sensory details to ground the scene\n- Movement between locations: Note sensory changes (quiet study → noisy dining room)\n- Emotional scenes: Use sensory details to reinforce mood (cold rain during argument)\n- Period authenticity: Use period-specific sensory details from location/temporal profiles\n- Avoid: Over-reliance on visual only; use sound, smell, touch, temperature\n- Example structure: "The <LOCATION> smelled of <PERIOD_SCENTS>. <WEATHER_SOUND> <ACTION>, <EFFECT>."\n\n⚠️ DO NOT COPY: Generate original sensory details using the location and temporal profiles provided.';
    
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


  // Build continuity context from chapter 2 onwards (character names, setting terms from earlier chapters)
  let continuityBlock = '';
  if (chapterSummaries.length > 0) {
    continuityBlock = buildContinuityContext(chapterSummaries, chapterStart);
  }

  // Build discriminating test checklist for late chapters (15-18)
  let discriminatingTestBlock = '';
  const chapterEnd = chapterStart + scenes.length - 1;
  if (chapterEnd >= 15) {
    const chapterRange = `${chapterStart}-${chapterEnd}`;
    discriminatingTestBlock = buildDiscriminatingTestChecklist(inputs.caseData, chapterRange, inputs.outline);
  }

  // Build humour guide block from writing guides
  let humourGuideBlock = '';
  if (inputs.writingGuides?.humour) {
    humourGuideBlock = '\n\nHUMOUR & WIT GUIDELINES (Golden Age Mystery Style):\n\n' +
      'Humour is STRUCTURAL, not decorative. Every humorous moment must serve at least one purpose: hide information, reveal character, control pacing, provide tonal contrast, expose social truth, or sharpen the final reveal.\n\n' +
      'TONE: Balance classical structure with modern-clean, restrained, irony-aware voice. Aim for crisp prose, controlled formality, mildly sharpened dryness. Think: polite language, ruthless implication.\n\n' +
      'APPROVED HUMOUR STYLES (use all of these naturally throughout):\n' +
      '1. UNDERSTATEMENT (primary tool) - Increase seriousness by pretending not to. Example: "The evening deteriorated somewhat after the stabbing."\n' +
      '2. DRY OBSERVATIONAL WIT - Draw humour from human behaviour. Example: "Everyone preferred harmony. This required extensive dishonesty."\n' +
      '3. POLITE SAVAGERY - Maintain civility while delivering verbal incision. Example: "He was devoted to principle," said the solicitor. "His own," said the detective.\n' +
      '4. CHARACTER-DRIVEN CONTRAST - Humour from personality friction (literal vs dramatic, pragmatic vs romantic, rigid vs modern). Never farce, always friction.\n' +
      '5. PRECISION CRUELTY (sparingly) - Short, exact, devastating. Example: "He had the moral backbone of warm custard." Use rarely for maximum impact.\n\n' +
      'ADVANCED TECHNIQUE - PUZZLE CAMOUFLAGE: Readers lower their analytical guard when amused. Hide key habits in jokes, plant timeline clues in sarcasm, mask technical details with mild mockery. The joke makes the fact feel harmless.\n\n' +
      'SOCIAL X-RAY: Use humour to expose class blindness, moral hypocrisy, gender expectations, inheritance absurdity, respectability theatre. Let irony reveal, not preach.\n\n' +
      'DETECTIVE VOICE: The detective should rarely laugh, occasionally observe, almost never banter. Deliver one devastatingly mild remark per major scene. Example: "I do not accuse you. I merely observe that facts appear less cooperative in your presence."\n\n' +
      'RHYTHM: Tension -> Dry remark -> Silence -> Investigation resumes. Never stack jokes. Never let humour dominate a scene. Small, controlled, regular infusions.\n\n' +
      'BALANCE: For every 3 pages of investigation, insert 1 understated observation. If readers would laugh loudly, it is too much. Aim for the quiet exhale through the nose.\n\n' +
      'RUNNING GAGS AS STRUCTURE: Introduce a recurring minor joke casually, repeat it, then make it central to the solution. Reader reaction: Amusement -> Recognition -> Admiration.\n\n' +
      'EMOTIONAL HUMOUR: Humour can mask vulnerability. Example: "He disliked arguments. They implied things might change." Modern emotional subtlety inside classical tone.\n\n' +
      'FORBIDDEN: Humour at the moment of corpse discovery, in physical description of the dead, during genuine grief, in the core logical explanation. No broad parody, no farce, no anachronistic sarcasm, no characters existing only for comic relief, no humour that weakens intellectual tension.\n\n' +
      'GUIDING PRINCIPLE: Do not try to be funny. Try to be exact. Exactness produces dryness. Dryness produces intelligence. Intelligence produces quiet amusement. Quiet amusement is the perfect companion to murder.';
  }


  // Build whodunnit craft guide block from writing guides
  let craftGuideBlock = '';
  if (inputs.writingGuides?.craft) {
    craftGuideBlock = '\n\nWHODUNNIT CRAFT GUIDELINES (Emotional Depth & Soul):\n\n' +
      'These principles ensure the mystery has emotional resonance, not just logical mechanics.\n\n' +
      '1. THE MURDER MUST MEAN SOMETHING: The death should destabilize emotional ecosystems. Show who loved the victim, who depended on them, who is secretly relieved. Use telling details ("Her coffee was still warm") rather than clinical statements ("The body was found at 7:30").\n\n' +
      '2. GIVE EVERY SUSPECT A WOUND: People kill because of shame, fear, love, desperation, pride, protection, or revenge. Beyond motive, give each suspect a private longing, a contradiction, a vulnerability unrelated to the crime. Readers should think: "I do not want it to be them."\n\n' +
      '3. THE DETECTIVE NEEDS A PERSONAL STAKE: The external mystery should echo an internal one. Perhaps they see themselves in the victim, the case mirrors a past failure, or they are avoiding something in their own life.\n\n' +
      '4. ADD MOMENTS THAT DO NOT ADVANCE THE PLOT: Include micro-moments that create texture: a suspect making tea too slowly, a trembling hand lighting a cigarette, someone staring too long at a family photo. These pauses make the story feel alive.\n\n' +
      '5. LET EMOTION LEAK INTO DIALOGUE: Avoid clinical information exchange. Write subtext-rich dialogue where characters do not always say what they mean. Example: "You think I would lie about that?" "I think people lie when they are scared." "I am not scared." "Your hands say otherwise."\n\n' +
      '6. RAISE MORAL COMPLEXITY: The most soulful mysteries make readers uncomfortable. What if the victim was not entirely good? What if the killer had a reason that almost makes sense? If the reader finishes thinking "I do not know how I feel about that," you have succeeded.\n\n' +
      '7. SENSORY ATMOSPHERE AS SOUL: Use recurring sensory anchors (the smell of lilies from the funeral, rain tapping like nervous fingers) to build mood. Atmosphere is not decoration; it is the story breathing.\n\n' +
      '8. LET SOMEONE BREAK: At least once, someone should crack: cry unexpectedly, laugh hysterically, confess something unrelated, admit they are tired. Emotion destabilizes the procedural rhythm and makes the story human.\n\n' +
      '9. MAKE THE REVEAL HURT: The best reveals do not just surprise; they wound. The reveal should recontextualize earlier tenderness, expose a betrayal, or force the detective to confront something personal. If the reveal only satisfies logic, it feels clinical. If it rearranges relationships, it feels human.';
  }

  const qualityGuardrails = Array.isArray(inputs.qualityGuardrails) ? inputs.qualityGuardrails : [];
  const qualityGuardrailBlock = qualityGuardrails.length > 0
    ? `\n\nQUALITY GUARDRAILS (MUST SATISFY):\n${qualityGuardrails.map((rule, idx) => `${idx + 1}. ${rule}`).join("\n")}`
    : "";

  // Build prose requirements block for this chapter batch
  const proseRequirementsBlock = buildProseRequirements(inputs.caseData, scenes);

  const chapterWordGuidance: Record<string, string> = {
    short: '4-6 substantial paragraphs — MINIMUM 1,300 words per chapter (short chapters fail quality validation)',
    medium: '5-7 substantial paragraphs — MINIMUM 1,600 words per chapter (short chapters fail quality validation)',
    long: '8-12 substantial paragraphs — MINIMUM 2,400 words per chapter (short chapters fail quality validation)',
  };
  const chapterGuidance = chapterWordGuidance[targetLength] ?? chapterWordGuidance.medium;

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has ${chapterGuidance}.\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Begin key scenes with atmospheric description\n   - Establish time of day, weather, lighting\n   - Describe location using sensory details (sight, sound, smell, touch)\n   - Set mood and atmosphere before action begins\n   - Use location and temporal context to ground reader\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   ?? Generate NEW descriptions using actual location/character names from the provided profiles."\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   ?? Use ONLY character names from the provided cast list.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}${proseRequirementsBlock}`;

  // Amateur detective extra warning — LLM tends to invent police officers for unnamed official response
  const amateurPoliceWarning = inputs.detectiveType === 'amateur'
    ? `\n\n⚠️ AMATEUR DETECTIVE STORY: The investigator is a civilian with no official standing. The official police (if they appear) are unnamed background figures only — "a constable", "the sergeant", "an officer from the village". Do NOT give any police official a name or title+surname combination. There is no Inspector [Surname], no Constable [Surname], no Sergeant [Surname] in this story.`
    : '';

  const user = `Write the full prose following the outline scenes.\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(sanitizeScenesCharacters(scenes, cast.map((c: any) => c.name)), null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}${amateurPoliceWarning}\n\n${characterConsistencyRules}${characterPersonalityContext}\n\n${physicalPlausibilityRules}${eraAuthenticityRules}${locationProfilesContext}${temporalContextBlock}${continuityBlock}${discriminatingTestBlock}${humourGuideBlock}${craftGuideBlock}\n\n${developer}` },
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

/**
 * Extract chapter summary for continuity tracking
 * Captures character names, setting vocabulary, and key events from completed chapters
 */
function extractChapterSummary(chapter: ProseChapter, chapterNumber: number, castNames: string[]): ChapterSummary {
  const text = chapter.paragraphs.join(' ');
  
  // Extract character names that actually appear in this chapter
  const charactersPresent = castNames.filter(name => {
    const regex = new RegExp(`\\b${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(text);
  });
  
  // Extract setting-related terms (common location vocabulary)
  const settingPatterns = [
    /\b(library|drawing[- ]room|study|parlour|parlor|dining[- ]room|ballroom|conservatory|terrace|garden|stable|kitchen|servants?'? quarters?)\b/gi,
    /\b(cabin|stateroom|deck|gangway|saloon|smoking[- ]room|promenade)\b/gi,
    /\b(compartment|corridor|dining[- ]car|sleeping[- ]car|platform|station)\b/gi,
    /\b(lobby|suite|bedroom|restaurant|bar|lounge)\b/gi,
    /\b(estate|manor|cottage|villa|townhouse|apartment|flat)\b/gi
  ];
  
  const settingTerms: string[] = [];
  settingPatterns.forEach(pattern => {
    const matches = text.match(pattern) || [];
    matches.forEach(match => {
      const normalized = match.toLowerCase().trim();
      if (!settingTerms.includes(normalized)) {
        settingTerms.push(normalized);
      }
    });
  });
  
  // Extract first sentence of each paragraph as key events (simple heuristic)
  const keyEvents: string[] = [];
  chapter.paragraphs.slice(0, 3).forEach(para => {
    const firstSentence = para.match(/^[^.!?]+[.!?]/);
    if (firstSentence && firstSentence[0].length < 150) {
      keyEvents.push(firstSentence[0].trim());
    }
  });
  
  return {
    chapterNumber,
    title: chapter.title,
    charactersPresent: charactersPresent.slice(0, 8), // Limit to top 8
    settingTerms: settingTerms.slice(0, 10), // Limit to 10 terms
    keyEvents: keyEvents.slice(0, 3) // Max 3 events
  };
}

/**
 * Build continuity context from previous chapter summaries
 * Provides character name consistency and setting vocabulary for late chapters
 */
function buildContinuityContext(summaries: ChapterSummary[], currentChapterStart: number): string {
  if (summaries.length === 0) {
    return '';
  }

  // Use all previous chapter summaries for name/setting aggregation
  const relevantSummaries = summaries;

  // Aggregate character names across all previous chapters
  const allCharacters = new Set<string>();
  relevantSummaries.forEach(s => s.charactersPresent.forEach(c => allCharacters.add(c)));

  // Aggregate setting terms
  const allSettingTerms = new Set<string>();
  relevantSummaries.forEach(s => s.settingTerms.forEach(t => allSettingTerms.add(t)));
  
  let context = '\n\n═══════════════════════════════════════════════════════════\n';
  context += '📚 CONTINUITY CONTEXT - CHARACTER & SETTING CONSISTENCY\n';
  context += '═══════════════════════════════════════════════════════════\n\n';
  context += '**CRITICAL: You are writing chapters ' + currentChapterStart + '+. Maintain consistency with earlier chapters.**\n\n';
  
  // Character names section
  if (allCharacters.size > 0) {
    context += '**Character Names Used in Chapters 1-' + Math.max(...relevantSummaries.map(s => s.chapterNumber)) + ':**\n';
    const charList = Array.from(allCharacters).slice(0, 12).join(', ');
    context += charList + '\n\n';
    context += '✓ RULE: Use EXACTLY these names. Do NOT vary spelling, add titles, or introduce new forms.\n';
    context += '✓ Example: if earlier chapters used "Clara Whitfield", keep using "Clara Whitfield" — never "Mrs. Whitfield" unless that is the character\'s canonical name in the list above.\n\n';
  }
  
  // Setting vocabulary section
  if (allSettingTerms.size > 0) {
    context += '**Setting Vocabulary Established in Earlier Chapters:**\n';
    const termList = Array.from(allSettingTerms).slice(0, 15).join(', ');
    context += termList + '\n\n';
    context += '✓ RULE: Continue using this location vocabulary. Maintain consistency with established setting type.\n';
    context += '✓ Do NOT introduce new location types that contradict earlier chapters.\n\n';
  }
  
  // Recent chapter summaries for narrative flow
  const recentSummaries = summaries.slice(Math.max(0, summaries.length - 3), summaries.length);
  if (recentSummaries.length > 0) {
    context += '**Recent Chapter Summary (for narrative continuity):**\n';
    recentSummaries.forEach(summary => {
      context += `Chapter ${summary.chapterNumber}: ${summary.title}\n`;
      if (summary.keyEvents.length > 0) {
        context += `  Events: ${summary.keyEvents[0]}\n`;
      }
    });
    context += '\n';
  }
  
  context += '⚠️ **VALIDATION:** Character name mismatches and setting drift are common failure modes.\n';
  context += 'Double-check every character name against the list above before using it.\n';
  context += '═══════════════════════════════════════════════════════════\n';
  
  return context;
}

/**
 * Build cross-batch warning message from recurring error patterns
 * Helps LLM avoid repeating mistakes from earlier batches
 */
function buildCrossBatchWarnings(errorPatterns: { type: string; count: number; examples: string[] }[]): string {
  if (errorPatterns.length === 0) return '';
  
  // Only warn if pattern occurs 2+ times
  const significant = errorPatterns.filter(p => p.count >= 2);
  if (significant.length === 0) return '';
  
  let warning = '\n\n⚠️ CRITICAL: RECURRING ERROR PATTERNS DETECTED ⚠️\n\n';
  warning += 'Previous batches in THIS generation have made these mistakes multiple times.\n';
  warning += 'DO NOT REPEAT THESE ERRORS:\n\n';
  
  significant.forEach(pattern => {
    warning += `❌ ${pattern.type.toUpperCase().replace('_', ' ')} (occurred ${pattern.count} times):\n`;
    pattern.examples.slice(0, 2).forEach(example => {
      warning += `   • ${example}\n`;
    });
    warning += '\n';
  });
  
  warning += '✓ Double-check your output against the errors above BEFORE submitting.\n';
  warning += '✓ These are YOUR previous mistakes in earlier chapters - do not repeat them.\n';
  
  return warning;
}

/**
 * Validate that discriminating test requirements can be satisfied by CML
 * Returns error message if validation fails, empty string if OK
 */
function validateChecklistRequirements(caseData: CaseData): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return ''; // No test to validate
  }
  
  const evidenceClues = discriminatingTest.evidence_clues || [];
  const clueRegistry = cmlCase.clue_registry || [];
  
  // Check that all evidence clues exist in clue registry
  const missingClues: string[] = [];
  evidenceClues.forEach((clue: any) => {
    const clueId = typeof clue === 'string' ? clue : clue.clue_id;
    const exists = clueRegistry.some((registryClue: any) => 
      registryClue.clue_id === clueId
    );
    if (!exists) {
      missingClues.push(clueId);
    }
  });
  
  if (missingClues.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test references clues that don't exist in clue_registry: ${missingClues.join(', ')}. Cannot generate checklist with invalid clue references.`;
  }
  
  // Check that eliminated suspects exist in cast
  const eliminated = discriminatingTest.eliminated_suspects || [];
  const cast = cmlCase.cast || [];
  const missingCast: string[] = [];
  
  eliminated.forEach((suspect: any) => {
    const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
    const exists = cast.some((member: any) => member.name === suspectName);
    if (!exists) {
      missingCast.push(suspectName);
    }
  });
  
  if (missingCast.length > 0) {
    return `❌ CHECKLIST VALIDATION FAILED: Discriminating test eliminates suspects not in cast: ${missingCast.join(', ')}. Cannot eliminate non-existent characters.`;
  }
  
  return ''; // Validation passed
}

/**
 * Build discriminating test checklist from CML
 * Provides explicit checkbox requirements for late chapters (15-18) where test appears
 * Breaks down complex multi-step reasoning into concrete requirements
 */
function buildDiscriminatingTestChecklist(
  caseData: CaseData, 
  chapterRange: string, 
  outline: NarrativeOutline
): string {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const discriminatingTest = cmlCase.discriminating_test;
  
  if (!discriminatingTest || !discriminatingTest.design) {
    return '';
  }
  
  // Validate checklist requirements before building
  const validationError = validateChecklistRequirements(caseData);
  if (validationError) {
    return '\n\n' + validationError + '\n';
  }
  
  const testDesign = discriminatingTest.design;
  const testType = testDesign.test_type || 'unknown';
  const testDescription = testDesign.description || '';
  const evidenceClues = discriminatingTest.evidence_clues || [];
  const eliminated = discriminatingTest.eliminated_suspects || [];
  
  // Only show checklist for late chapters (15-18) where discriminating test should appear
  const chapterNumbers = chapterRange.split('-').map(n => parseInt(n, 10));
  const isLateChapter = chapterNumbers.some(n => n >= 15);
  
  if (!isLateChapter) {
    return '';
  }
  
  // Extract clue locations from outline
  const clueLocations = extractClueLocations(caseData, outline);
  
  let checklist = '\n\n═══════════════════════════════════════════════════════════\n';
  checklist += '🎯 DISCRIMINATING TEST CHECKLIST - CRITICAL REQUIREMENTS\n';
  checklist += '═══════════════════════════════════════════════════════════\n\n';
  checklist += `This is a **${testType}** test. The detective must:\n\n`;
  checklist += `**Test Description:**\n${testDescription}\n\n`;
  checklist += `**MANDATORY CHECKLIST - Every box must be checked:**\n\n`;
  
  // Evidence clue requirements with locations
  if (evidenceClues.length > 0) {
    checklist += `☐ **Evidence Integration**\n`;
    evidenceClues.forEach((clue: any) => {
      const clueId = typeof clue === 'string' ? clue : clue.clue_id;
      const clueType = typeof clue === 'object' ? clue.type || 'clue' : 'clue';
      const location = clueLocations.get(clueId);
      const locationStr = location ? ` (appears in ${location})` : '';
      checklist += `  ☐ Explicitly reference or use clue: "${clueId}" (${clueType})${locationStr}\n`;
    });
    checklist += `\n`;
  }
  
  // Test execution requirements based on type
  checklist += `☐ **Test Execution**\n`;
  if (testType === 'timing_test' || testType === 'timeline_test') {
    checklist += `  ☐ Detective reviews or reconstructs the timeline\n`;
    checklist += `  ☐ Show calculation or reasoning about time windows\n`;
    checklist += `  ☐ Demonstrate which suspects had/lacked opportunity\n`;
  } else if (testType === 'physical_test' || testType === 'capability_test') {
    checklist += `  ☐ Detective tests or demonstrates the physical requirement\n`;
    checklist += `  ☐ Show measurement, demonstration, or verification\n`;
    checklist += `  ☐ Clearly show which suspects can/cannot meet requirement\n`;
  } else if (testType === 'knowledge_test' || testType === 'specialized_knowledge') {
    checklist += `  ☐ Detective identifies what specialized knowledge is required\n`;
    checklist += `  ☐ Show investigation of who has this knowledge\n`;
    checklist += `  ☐ Demonstrate which suspects possess/lack the knowledge\n`;
  } else if (testType === 'access_test' || testType === 'opportunity_test') {
    checklist += `  ☐ Detective maps who had access at critical time\n`;
    checklist += `  ☐ Show verification of alibis or access records\n`;
    checklist += `  ☐ Clearly eliminate suspects who lacked access\n`;
  } else {
    checklist += `  ☐ Detective performs the test or verification\n`;
    checklist += `  ☐ Show clear reasoning and evidence evaluation\n`;
    checklist += `  ☐ Demonstrate which suspects pass/fail the test\n`;
  }
  checklist += `\n`;
  
  // Suspect elimination requirements
  if (eliminated.length > 0) {
    checklist += `☐ **Suspect Elimination**\n`;
    eliminated.forEach((suspect: any) => {
      const suspectName = typeof suspect === 'string' ? suspect : suspect.name;
      checklist += `  ☐ Clearly eliminate "${suspectName}" from suspicion\n`;
    });
    checklist += `\n`;
  }
  
  // Detective reasoning requirements
  checklist += `☐ **Detective Reasoning**\n`;
  checklist += `  ☐ Detective explicitly states the test logic\n`;
  checklist += `  ☐ Show step-by-step deduction process\n`;
  checklist += `  ☐ Connect test results to innocence/guilt determination\n`;
  checklist += `\n`;
  
  // Prose quality requirements
  checklist += `☐ **Prose Integration**\n`;
  checklist += `  ☐ Scene is dramatic and engaging (not dry exposition)\n`;
  checklist += `  ☐ Use dialogue to reveal test logic naturally\n`;
  checklist += `  ☐ Build tension as test proceeds\n`;
  checklist += `  ☐ Clear moment of revelation when test succeeds\n`;
  checklist += `\n`;
  
  checklist += `⚠️ **VALIDATION:** If ANY checkbox above is unchecked in your prose, the chapter will FAIL validation.\n`;
  checklist += `This test is THE HARDEST element to get right. Take your time. Check every box.\n`;
  checklist += `═══════════════════════════════════════════════════════════\n`;
  
  return checklist;
}

/**
 * Extract evidence clue locations from narrative outline
 * Returns map of clue_id to Act/Scene location for checklist injection
 */
function extractClueLocations(caseData: CaseData, outline: NarrativeOutline): Map<string, string> {
  const clueLocations = new Map<string, string>();
  const cmlCase = (caseData as any)?.CASE ?? {};
  const clueRegistry = cmlCase.clue_registry || [];
  
  // Build set of clue IDs we're looking for
  const clueIds = new Set<string>(clueRegistry.map((c: any) => String(c.clue_id || '')));
  
  // Search through outline acts and scenes
  outline.acts?.forEach((act: any) => {
    const actNum = act.act_number;
    act.scenes?.forEach((scene: any) => {
      const sceneNum = scene.scene_number;
      const sceneText = JSON.stringify(scene).toLowerCase();
      
      // Check each clue ID
      clueIds.forEach((clueId: string) => {
        if (clueId && sceneText.includes(clueId.toLowerCase())) {
          const location = `Act ${actNum}, Scene ${sceneNum}`;
          // Store first occurrence (could track multiple if needed)
          if (!clueLocations.has(clueId)) {
            clueLocations.set(clueId, location);
          }
        }
      });
    });
  });
  
  return clueLocations;
}

/**
 * Build enhanced, categorized retry feedback
 * Helps LLM understand exactly what to fix
 */
const buildEnhancedRetryFeedback = (
  errors: string[],
  caseData: CaseData,
  chapterRange: string,
  attempt: number,
  maxAttempts: number
): string => {
  const cmlCase = (caseData as any)?.CASE ?? {};
  const cast = cmlCase.cast || [];
  const castNames = cast.map((c: any) => c.name);
  const locationType = cmlCase.meta?.setting?.location_type || '';
  
  // Categorize errors
  const characterErrors = errors.filter(e => e.toLowerCase().includes('character') || e.toLowerCase().includes('name'));
  const settingErrors = errors.filter(e => e.toLowerCase().includes('setting') || e.toLowerCase().includes('location'));
  const testErrors = errors.filter(e => e.toLowerCase().includes('discriminating test'));
  const qualityErrors = errors.filter(e => e.toLowerCase().includes('paragraph') || e.toLowerCase().includes('chapter'));
  const otherErrors = errors.filter(e => 
    !characterErrors.includes(e) && 
    !settingErrors.includes(e) && 
    !testErrors.includes(e) && 
    !qualityErrors.includes(e)
  );
  
  let feedback = `⚠️ CRITICAL: Attempt ${attempt}/${maxAttempts} for chapters ${chapterRange} had ${errors.length} validation error(s).\n\n`;
  feedback += `You MUST fix ALL of these issues. This is your ${attempt === maxAttempts ? 'FINAL' : 'last'} chance before generation fails.\n\n`;
  
  if (characterErrors.length > 0) {
    // Extract specific phantom names from the error messages
    const phantomNames = characterErrors
      .map(e => {
        const m = e.match(/Character name "([^"]+)" not found/);
        return m ? m[1] : null;
      })
      .filter(Boolean);

    feedback += `═══ CHARACTER NAME ERRORS (${characterErrors.length}) ═══\n`;
    characterErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: The ONLY characters who exist are: ${castNames.join(', ')}\n`;
    if (phantomNames.length > 0) {
      feedback += `❌ PHANTOM CHARACTERS TO DELETE: ${phantomNames.join(', ')} — these people do NOT exist in this story.\n`;
      feedback += `❌ Remove every mention of ${phantomNames.join(' and ')} from the chapter. Replace their dialogue, actions, or references with one of the real cast members, or cut the passage entirely.\n`;
    }
    feedback += `✓ Do NOT introduce any new named character. Walk-on figures must remain anonymous ("a constable", "the footman") — never Mr./Mrs./Inspector [surname].\n\n`;
  }
  
  if (settingErrors.length > 0) {
    feedback += `═══ SETTING DRIFT ERRORS (${settingErrors.length}) ═══\n`;
    settingErrors.forEach(e => feedback += `• ${e}\n`);
    if (locationType) {
      feedback += `\n✓ SOLUTION: This story is set in a "${locationType}"\n`;
      feedback += `✓ Use ONLY location vocabulary appropriate for this setting type\n`;
      feedback += `✓ DO NOT use terms from other settings (manor, train, hotel, etc.)\n\n`;
    }
  }
  
  if (testErrors.length > 0) {
    feedback += `═══ DISCRIMINATING TEST ERRORS (${testErrors.length}) ═══\n`;
    testErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: The discriminating test must be explicit and complete\n`;
    feedback += `✓ Include the detective's reasoning, the test itself, and clear elimination of suspects\n`;
    feedback += `✓ Reference specific evidence clues from the CML\n`;
    
    // Add full checklist for late chapters where test should appear (note: outline not available here)
    const chapterNumbers = chapterRange.split('-').map(n => parseInt(n, 10));
    const isLateChapter = chapterNumbers.some(n => n >= 15);
    if (isLateChapter) {
      feedback += '\n✓ See DISCRIMINATING TEST CHECKLIST above for complete requirements\n';
    }
    feedback += `\n`;
  }
  
  if (qualityErrors.length > 0) {
    feedback += `═══ PROSE QUALITY ERRORS (${qualityErrors.length}) ═══\n`;
    qualityErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n✓ SOLUTION: Vary paragraph lengths (short, medium, long)\n`;
    feedback += `✓ Include sensory details and atmospheric description\n`;
    feedback += `✓ Ensure each chapter has substance (3+ paragraphs minimum)\n\n`;
  }
  
  if (otherErrors.length > 0) {
    feedback += `═══ OTHER ERRORS (${otherErrors.length}) ═══\n`;
    otherErrors.forEach(e => feedback += `• ${e}\n`);
    feedback += `\n`;
  }
  
  feedback += `═══════════════════════════════════\n`;
  feedback += `REGENERATE chapters ${chapterRange} with ALL fixes applied.\n`;
  feedback += `DO NOT skip any error. DO NOT partially fix. Fix EVERYTHING.\n`;
  
  return feedback;
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
  
  const chapters: ProseChapter[] = [];
  const chapterSummaries: ChapterSummary[] = [];
  const chapterValidationHistory: Array<{ chapterNumber: number; attempt: number; errors: string[] }> = [];
  const chapterValidator = new ChapterValidator();
  const progressCallback = inputs.onProgress || (() => {});
  const castNames = inputs.cast.characters.map(c => c.name);
  const batchSize = Math.max(1, Math.min(inputs.batchSize || 1, 10));

  // Track recurring error patterns across batches for cross-batch learning
  const crossChapterErrors: { type: string; count: number; examples: string[] }[] = [];

  // Generate and validate scenes in configurable batches.
  // When batchSize=1 (default) this processes one chapter per LLM call;
  // higher values group multiple scenes into a single call for throughput gains.
  for (let batchStart = 0; batchStart < scenes.length; batchStart += batchSize) {
    const batchScenes = scenes.slice(batchStart, batchStart + batchSize);
    const chapterStart = batchStart + 1;
    const chapterEnd = batchStart + batchScenes.length;
    const maxBatchAttempts = 3;
    let lastBatchErrors: string[] = [];
    let batchSuccess = false;

    const overallProgress = 91 + Math.floor((batchStart / sceneCount) * 3); // 91-94%
    const batchLabel = batchScenes.length > 1 ? `${chapterStart}-${chapterEnd}` : `${chapterStart}`;
    progressCallback('prose', `Generating chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount}...`, overallProgress);

    for (let attempt = 1; attempt <= maxBatchAttempts; attempt++) {
      try {
        // chapterSummaries already holds every committed chapter, so continuity
        // context is always up-to-date when buildProsePrompt is called.
        const prompt = buildProsePrompt(inputs, batchScenes, chapterStart, chapterSummaries);

        // Add retry feedback on subsequent attempts
        if (attempt > 1 && lastBatchErrors.length > 0) {
          const feedback = buildEnhancedRetryFeedback(
            lastBatchErrors, inputs.caseData, batchLabel, attempt, maxBatchAttempts
          );
          prompt.messages.push({ role: "user" as const, content: feedback });
        }

        // Warn about recurring patterns seen in earlier batches
        if (batchStart > 0 && crossChapterErrors.length > 0) {
          const warning = buildCrossBatchWarnings(crossChapterErrors);
          if (warning) {
            prompt.messages.push({ role: "user" as const, content: warning });
          }
        }

        const response = await client.chat({
          messages: prompt.messages,
          temperature: 0.7,
          maxTokens: Math.min(4000 * batchScenes.length, 16000),
          jsonMode: true,
          logContext: {
            runId: inputs.runId ?? "",
            projectId: inputs.projectId ?? "",
            agent: `Agent9-ProseGenerator-Ch${batchLabel}`,
          },
        });

        const proseBatch = parseProseResponse(response.content);
        validateChapterCount(proseBatch.chapters, batchScenes.length);

        // Validate each chapter in the batch individually
        const batchErrors: string[] = [];
        for (let i = 0; i < proseBatch.chapters.length; i++) {
          const chapter = proseBatch.chapters[i];
          const chapterNumber = chapterStart + i;
          const chapterErrors: string[] = [];

          // Structure validation
          if (!chapter.title || typeof chapter.title !== 'string') {
            chapterErrors.push(`chapter.title is required and must be a string`);
          }
          if (!Array.isArray(chapter.paragraphs)) {
            chapterErrors.push(`chapter.paragraphs must be an array`);
          } else if (chapter.paragraphs.length === 0) {
            chapterErrors.push(`chapter.paragraphs cannot be empty`);
          } else {
            chapter.paragraphs.forEach((para, pIdx) => {
              if (typeof para !== 'string') {
                chapterErrors.push(`chapter.paragraphs[${pIdx}] must be a string`);
              }
            });
          }

          // Content validation (per-chapter ChapterValidator)
          const contentValidation = chapterValidator.validateChapter({
            title: chapter.title,
            paragraphs: chapter.paragraphs,
            chapterNumber,
          }, inputs.caseData);

          contentValidation.issues
            .filter(issue => issue.severity === 'critical' || issue.severity === 'major')
            .forEach(issue => {
              chapterErrors.push(`Chapter ${chapterNumber}: ${issue.message}${issue.suggestion ? ` (${issue.suggestion})` : ''}`);
            });

          if (chapterErrors.length > 0) {
            // Track error patterns for cross-batch learning
            chapterErrors.forEach(error => {
              const errorLower = error.toLowerCase();
              let errorType = 'other';
              if (errorLower.includes('character') || errorLower.includes('name')) errorType = 'character_names';
              else if (errorLower.includes('setting') || errorLower.includes('location')) errorType = 'setting_drift';
              else if (errorLower.includes('discriminating test')) errorType = 'discriminating_test';
              else if (errorLower.includes('paragraph') || errorLower.includes('quality')) errorType = 'prose_quality';

              const existing = crossChapterErrors.find(e => e.type === errorType);
              if (existing) {
                existing.count++;
                if (existing.examples.length < 3) existing.examples.push(error);
              } else {
                crossChapterErrors.push({ type: errorType, count: 1, examples: [error] });
              }
            });

            batchErrors.push(...chapterErrors);
            chapterValidationHistory.push({ chapterNumber, attempt, errors: chapterErrors });
          }
        }

        if (batchErrors.length > 0) {
          lastBatchErrors = batchErrors;

          console.warn(
            `[Agent 9] Batch ch${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}):\n` +
            batchErrors.map(e => `  - ${e}`).join('\n')
          );
          progressCallback(
            'prose',
            `❌ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validation failed (attempt ${attempt}/${maxBatchAttempts}): ${batchErrors.length} issue(s)`,
            overallProgress
          );

          if (attempt >= maxBatchAttempts) {
            const errorSummary = batchErrors.slice(0, 5).join('; ');
            throw new Error(
              `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} failed validation after ${maxBatchAttempts} attempts. Issues: ${errorSummary}` +
              `${batchErrors.length > 5 ? ` (and ${batchErrors.length - 5} more)` : ''}`
            );
          }
          continue;
        }

        // All chapters in this batch passed validation — commit them
        for (let i = 0; i < proseBatch.chapters.length; i++) {
          const chapter = proseBatch.chapters[i];
          const chapterNumber = chapterStart + i;
          chapters.push(chapter);
          // Extract summary immediately so the next batch's prompt has full continuity
          const summary = extractChapterSummary(chapter, chapterNumber, castNames);
          chapterSummaries.push(summary);
        }

        // Notify caller — pass validation issues from any failed attempts so the
        // orchestrator can surface them in the run history panel (§3.2).
        if (inputs.onBatchComplete) {
          await inputs.onBatchComplete(proseBatch.chapters, chapterStart, chapterEnd, lastBatchErrors);
        }

        batchSuccess = true;

        if (attempt > 1) {
          console.log(`[Agent 9] Batch ch${batchLabel} validated successfully on attempt ${attempt}`);
          progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} validated (retry succeeded)`, overallProgress);
        } else {
          progressCallback('prose', `✅ Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel}/${sceneCount} validated`, overallProgress);
        }

        break;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        lastBatchErrors = [errorMsg];

        if (attempt >= maxBatchAttempts) {
          throw new Error(
            `Chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} generation failed after ${maxBatchAttempts} attempts: ${errorMsg}`
          );
        }
      }
    }

    if (!batchSuccess) {
      throw new Error(`Failed to generate chapter${batchScenes.length > 1 ? 's' : ''} ${batchLabel} after all attempts`);
    }
  }

  validateChapterCount(chapters, sceneCount);

  const durationMs = Date.now() - start;
  const costTracker = client.getCostTracker();
  // Aggregate cost across all per-chapter agent keys (Agent9-ProseGenerator-Ch1, -Ch2, ...)
  const allAgentCosts = costTracker.getSummary().byAgent;
  const cost = Object.entries(allAgentCosts)
    .filter(([key]) => key.startsWith("Agent9-ProseGenerator"))
    .reduce((sum, [, val]) => sum + val, 0);

  const chaptersWithRetries = new Set(chapterValidationHistory.map(h => h.chapterNumber)).size;
  const note = chapterValidationHistory.length > 0
    ? `Generated chapter-by-chapter. ${chaptersWithRetries} chapter(s) required retry for validation.`
    : "Generated chapter-by-chapter.";

  return {
    status: "draft",
    tone: inputs.narrativeStyle,
    chapters,
    cast: inputs.cast.characters.map((c) => c.name),
    note,
    cost,
    durationMs,
    validationDetails: chapterValidationHistory.length > 0 ? {
      totalBatches: sceneCount,
      batchesWithRetries: chaptersWithRetries,
      failureHistory: chapterValidationHistory.map(h => ({
        batchIndex: h.chapterNumber - 1,
        chapterRange: `${h.chapterNumber}`,
        attempt: h.attempt,
        errors: h.errors,
      })),
    } : undefined,
  };
}
