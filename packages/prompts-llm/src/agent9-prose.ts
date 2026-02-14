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
  writingGuides?: { humour?: string; craft?: string };
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

  const developer = `# Prose Output Schema\nReturn JSON with this structure:\n\n{\n  "status": "draft",\n  "tone": "classic|modern|atmospheric",\n  "chapters": [\n    {\n      "title": "Chapter title",\n      "summary": "1-2 sentence summary",\n      "paragraphs": ["Paragraph 1", "Paragraph 2", "Paragraph 3"]\n    }\n  ],\n  "cast": ["Name 1", "Name 2"],\n  "note": ""\n}\n\nRequirements:\n- Write exactly one chapter per outline scene (${scenes.length || "N"} total).\n- Chapter numbering starts at ${chapterStart} and increments by 1 per scene.\n- Each chapter has 3-6 paragraphs (vary length for pacing).\n- Use ${narrativeStyle} tone and ${targetLength} length guidance.\n- Reflect the outline summary in each chapter.\n- Keep all logic consistent with CML (no new facts).\n\nNOVEL-QUALITY PROSE REQUIREMENTS:\n\n1. SCENE-SETTING: Begin key scenes with atmospheric description\n   - Establish time of day, weather, lighting\n   - Describe location using sensory details (sight, sound, smell, touch)\n   - Set mood and atmosphere before action begins\n   - Use location and temporal context to ground reader\n   Example structure: "The <MONTH> <TIME> brought <WEATHER> to <LOCATION>. In the <ROOM>, <LIGHTING> while <SENSORY_DETAIL>. <CHARACTER>'s <OBJECT> <ACTION>."

   ?? Generate NEW descriptions using actual location/character names from the provided profiles."\n\n2. SHOW, DON'T TELL: Use concrete details and actions\n   ❌ "She was nervous."\n   ✓ "Her fingers twisted the hem of her glove, the silk threatening to tear. A bead of perspiration traced down her temple despite the cool morning air."\n   - Body language reveals emotion\n   - Actions reveal character\n   - Environment reflects internal state\n\n3. VARIED SENTENCE STRUCTURE:\n   - Mix short, punchy sentences with longer, flowing ones\n   - Use sentence rhythm to control pacing\n   - Short sentences for tension, longer for description\n   - Paragraph variety: Some 2 lines, some 8 lines\n\n4. DIALOGUE THAT REVEALS CHARACTER:\n   - Each character has distinct speech patterns (see character profiles)\n   - Use dialogue tags sparingly (action beats instead)\n   - Subtext: characters don't always say what they mean\n   - Class/background affects vocabulary and formality\n   - Tension through what's NOT said\n   Example structure: "<DIALOGUE>," <CHARACTER> said, <ACTION_BEAT>.

   ?? Use ONLY character names from the provided cast list.\n\n5. SENSORY IMMERSION:\n   - Include multiple senses per scene (2-3 minimum)\n   - Period-specific sensory details from location/temporal profiles\n   - Tactile details create immediacy\n   - Use sensory palette provided in location profiles\n   - Vary sensory focus: visual → auditory → olfactory → tactile\n\n6. PARAGRAPH STRUCTURE:\n   - Opening: Hook with action, dialogue, or atmospheric detail\n   - Middle: Develop scene, reveal information, build tension\n   - Closing: End with revelation, question, or transition\n   - Each paragraph should advance story or deepen character\n\n7. PACING VARIATION:\n   - Action scenes: Short paragraphs (2-4 lines), quick succession\n   - Investigation scenes: Moderate length (4-6 lines), methodical rhythm\n   - Atmospheric scenes: Longer paragraphs (6-8 lines), detailed description\n   - Revelation scenes: Build slowly with long paragraphs, climax with short punch\n\n8. EMOTIONAL SUBTEXT & TENSION:\n   - Characters have hidden secrets/stakes (see character profiles)\n   - Every interaction carries subtext based on relationships\n   - Build tension through: pauses, interrupted speech, avoided topics, body language\n   - Mystery atmosphere: Suspicion, unease, watchfulness\n   - Use weather/atmosphere to mirror emotional tension${qualityGuardrailBlock}${proseRequirementsBlock}`;

  const user = `Write the full prose following the outline scenes.\n\n${buildContextSummary(inputs.caseData, inputs.cast)}\n\nOutline scenes:\n${JSON.stringify(scenes, null, 2)}`;

  const messages = [
    { role: "system" as const, content: `${system}\n\n${characterConsistencyRules}${characterPersonalityContext}\n\n${physicalPlausibilityRules}${eraAuthenticityRules}${locationProfilesContext}${temporalContextBlock}${humourGuideBlock}${craftGuideBlock}\n\n${developer}` },
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

  const chapters: ProseChapter[] = [];
  let chapterIndex = 1;
  const batchValidationHistory: Array<{ batchIndex: number; attempt: number; errors: string[] }> = [];

  // Generate each batch with per-batch validation and retry
  for (let batchIndex = 0; batchIndex < batches.length; batchIndex++) {
    const batch = batches[batchIndex];
    let batchSuccess = false;
    let lastBatchError: string[] = [];

    for (let batchAttempt = 1; batchAttempt <= maxAttempts; batchAttempt++) {
      try {
        const prompt = buildProsePrompt(inputs, batch, chapterIndex);
        
        // Add validation feedback if this is a retry
        if (batchAttempt > 1 && lastBatchError.length > 0) {
          const feedbackMessage = {
            role: "user" as const,
            content: `Previous attempt had validation errors:\n${lastBatchError.map(e => `- ${e}`).join('\n')}\n\nPlease regenerate these chapters with corrections.`
          };
          prompt.messages.push(feedbackMessage);
        }

        const response = await client.chat({
          messages: prompt.messages,
          temperature: 0.7,
          maxTokens: 4000,
          jsonMode: true,
          logContext: {
            runId: inputs.runId ?? "",
            projectId: inputs.projectId ?? "",
            agent: `Agent9-ProseGenerator-Batch${batchIndex + 1}`,
          },
        });

        const proseBatch = parseProseResponse(response.content);
        validateChapterCount(proseBatch.chapters, batch.length);

        // Validate chapter structure (not full prose artifact - that comes later)
        // Check that each chapter has required fields
        const batchErrors: string[] = [];
        proseBatch.chapters.forEach((chapter, idx) => {
          if (!chapter.title || typeof chapter.title !== 'string') {
            batchErrors.push(`chapters[${idx}].title is required and must be a string`);
          }
          if (!Array.isArray(chapter.paragraphs)) {
            batchErrors.push(`chapters[${idx}].paragraphs must be an array`);
          } else if (chapter.paragraphs.length === 0) {
            batchErrors.push(`chapters[${idx}].paragraphs cannot be empty`);
          } else {
            chapter.paragraphs.forEach((para, pIdx) => {
              if (typeof para !== 'string') {
                batchErrors.push(`chapters[${idx}].paragraphs[${pIdx}] must be a string`);
              }
            });
          }
        });
        
        if (batchErrors.length > 0) {
          lastBatchError = batchErrors;
          batchValidationHistory.push({ batchIndex, attempt: batchAttempt, errors: batchErrors });
          
          console.warn(
            `[Agent 9] Batch ${batchIndex + 1}/${batches.length} validation failed (attempt ${batchAttempt}/${maxAttempts}):\n` +
            batchErrors.map(e => `  - ${e}`).join('\n')
          );
          
          if (batchAttempt >= maxAttempts) {
            console.error(
              `[Agent 9] Batch ${batchIndex + 1} failed validation after ${maxAttempts} attempts. Continuing with errors.`
            );
            // Continue anyway to avoid blocking the entire generation
            chapters.push(...proseBatch.chapters);
            batchSuccess = true;
            break;
          }
          // Retry this batch
          continue;
        }

        // Validation passed - add chapters and continue
        chapters.push(...proseBatch.chapters);
        batchSuccess = true;
        
        if (batchAttempt > 1) {
          console.log(`[Agent 9] Batch ${batchIndex + 1}/${batches.length} validated successfully on attempt ${batchAttempt}`);
        }
        
        break;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        lastBatchError = [errorMsg];
        
        if (batchAttempt >= maxAttempts) {
          throw new Error(
            `Batch ${batchIndex + 1}/${batches.length} generation failed after ${maxAttempts} attempts: ${errorMsg}`
          );
        }
      }
    }

    if (!batchSuccess) {
      throw new Error(`Failed to generate batch ${batchIndex + 1}/${batches.length} after all attempts`);
    }

    chapterIndex += batch.length;
  }

  validateChapterCount(chapters, sceneCount);

  const durationMs = Date.now() - start;
  const costTracker = client.getCostTracker();
  const cost = costTracker.getSummary().byAgent["Agent9-ProseGenerator"] || 0;

  const note = batchValidationHistory.length > 0
    ? `Generated in scene batches. ${batchValidationHistory.length} batch(es) required retry for validation.`
    : "Generated in scene batches.";

  return {
    status: "draft",
    tone: inputs.narrativeStyle,
    chapters,
    cast: inputs.cast.characters.map((c) => c.name),
    note,
    cost,
    durationMs,
  };
}
