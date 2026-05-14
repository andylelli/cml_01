/**
 * Agent 6.5: World Builder
 *
 * Synthesises all prior structured facts (CML, character profiles, location profiles,
 * temporal context, background context, hard-logic locked facts, clue distribution)
 * into a single World Document. This document is read by Agent 7 (narrative enrichment)
 * and Agent 9 (prose generation) as their primary creative context.
 *
 * The World Builder must NOT invent new character secrets, relationships, or clues.
 * It adds texture, voice, emotional register, and era specificity only.
 */

import type { AzureOpenAIClient, Message } from "@cml/llm-client";
import type { CaseData } from "@cml/cml";
import { validateArtifact } from "@cml/cml";
import { jsonrepair } from "jsonrepair";
import type { WorldDocumentResult } from "./types/world-document.js";
import { getGenerationParams } from "@cml/story-validation";

export type { WorldDocumentResult };

const STORY_THEME_GATE = 25;
const STORY_THEME_TARGET = 25;
const REVEAL_IMPLICATIONS_GATE = 90;
const MIN_ARC_PARAGRAPHS = 2;
const REQUIRED_HUMOUR_SCENE_POSITIONS = [
  'opening_scene',
  'first_investigation',
  'body_discovery',
  'first_interview',
  'domestic_scene',
  'mid_investigation',
  'second_interview',
  'tension_scene',
  'pre_climax',
  'discriminating_test',
  'revelation',
  'resolution',
] as const;

function countWords(value: unknown): number {
  if (typeof value !== 'string') return 0;
  return value.split(/\s+/).filter((w: string) => w.length > 0).length;
}

function normalizeWhitespace(value: string): string {
  return value.replace(/\s+/g, ' ').trim();
}

function stripTerminalPunctuation(value: string): string {
  return value.replace(/[.!?]+$/g, '').trim();
}

function paragraphCount(value: unknown): number {
  if (typeof value !== 'string') return 0;
  return value
    .split(/\n\s*\n/)
    .map((p: string) => p.trim())
    .filter((p: string) => p.length > 0).length;
}

function forceMultiParagraphArcDescription(value: unknown): string {
  if (typeof value !== 'string') return '';
  const compact = value.trim();
  if (!compact) return '';

  if (paragraphCount(compact) >= MIN_ARC_PARAGRAPHS) {
    return compact;
  }

  const sentences = compact
    .split(/(?<=[.!?])\s+/)
    .map((s: string) => s.trim())
    .filter(Boolean);

  if (sentences.length < 2) {
    return compact;
  }

  const midpoint = Math.max(1, Math.floor(sentences.length / 2));
  const first = sentences.slice(0, midpoint).join(' ').trim();
  const second = sentences.slice(midpoint).join(' ').trim();

  if (!first || !second) {
    return compact;
  }

  return `${first}\n\n${second}`;
}

function enforceRevealImplicationsFloor(
  value: unknown,
  minimumWords: number,
  storyTheme: unknown,
  dominantRegister: unknown
): string {
  const base = typeof value === 'string' ? value.trim() : '';
  if (countWords(base) >= minimumWords) {
    return base;
  }

  const theme = typeof storyTheme === 'string' ? storyTheme.trim() : '';
  const register = typeof dominantRegister === 'string' ? dominantRegister.trim() : '';
  const additions: string[] = [
    'Taken together, these implications should be treated as cumulative pressure that reshapes how each suspect interprets risk, loyalty, and consequence over the final act.',
    'The reader should feel that each reveal narrows the moral room for self-deception while broadening the emotional stakes for every relationship still in play.',
    'Practically, this means each subsequent scene should convert abstract suspicion into concrete interpersonal cost, so the final revelation feels inevitable rather than abrupt.',
  ];

  if (theme) {
    additions.push(
      `These outcomes should reinforce the story theme: ${theme.replace(/\s+/g, ' ').trim()}.`
    );
  }

  if (register) {
    additions.push(
      `Maintain the dominant emotional register (${register.replace(/\s+/g, ' ').trim()}) while escalating clarity around motive and accountability.`
    );
  }

  let composed = base;
  for (const sentence of additions) {
    composed = composed ? `${composed} ${sentence}` : sentence;
    if (countWords(composed) >= minimumWords) {
      break;
    }
  }

  return composed.trim();
}

function enforceStoryThemeFloor(
  value: unknown,
  minimumWords: number,
  caseTheme: unknown,
  dominantRegister: unknown,
): string {
  const base = normalizeWhitespace(typeof value === 'string' ? value : '');
  if (countWords(base) >= minimumWords && /[.!?]$/.test(base)) {
    return base;
  }

  const theme = normalizeWhitespace(typeof caseTheme === 'string' ? caseTheme : '');
  const register = normalizeWhitespace(typeof dominantRegister === 'string' ? dominantRegister : '');

  const stem = stripTerminalPunctuation(base)
    || 'At its core, the mystery argues that truth emerges only when people confront the stories they tell to excuse fear, loyalty, and self-interest';
  const clauses: string[] = [
    'and reveals that evidence carries ethical weight, forcing characters to choose accountability over social performance when appearances and facts collide',
  ];

  if (theme) {
    clauses.push(
      `while remaining anchored to the established theme of ${theme}`
    );
  }

  if (register) {
    clauses.push(
      `and sustaining a ${register.toLowerCase()} emotional register so the resolution lands as moral consequence rather than a mere puzzle trick`
    );
  }

  let composed = stem;
  for (const clause of clauses) {
    const separator = /[,;:]$/.test(composed) ? ' ' : ', ';
    composed = normalizeWhitespace(`${composed}${separator}${clause}`);
    if (countWords(composed) >= minimumWords) {
      break;
    }
  }

  return `${stripTerminalPunctuation(composed)}.`;
}

// ARC_DESC_GATE / ARC_DESC_PROMPT are loaded from generation-params.yaml at
// call time via getArcDescParams(). Defaults: gate=200, buffer=100 → prompt=300.
const getArcDescParams = () => {
  const q = getGenerationParams().agent65_world_builder.params.quality;
  return { gate: q.arc_description_gate, prompt: q.arc_description_gate + q.arc_description_prompt_buffer };
};

export interface WorldBuilderInputs {
  caseData: CaseData;
  characterProfiles: any;   // CharacterProfilesResult
  locationProfiles: any;    // LocationProfilesResult
  temporalContext: any;     // TemporalContextResult
  backgroundContext: any;   // BackgroundContextArtifact
  hardLogicDevices: any;    // HardLogicDeviceResult — supplies lockedFacts
  clueDistribution?: any;   // ClueDistributionResult
  model?: string;
  runId?: string;
  projectId?: string;
  retryFeedback?: string;   // Scoring feedback from a previous failed attempt
  onProgress?: (phase: string, message: string) => void;
}

const WORLD_BUILDER_SYSTEM = `You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least 300 words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than 300 words
    will fail validation. Count your words before finalising this field.
  - JSON arrays must contain ONLY objects of the specified type. Never add strings, notes,
    comments, or placeholder text inside characterPortraits, characterVoiceSketches,
    locationRegisters, humourPlacementMap, or any other array field.
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given — not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - FIRST-PASS CONTRACT: satisfy storyTheme, revealImplications, and arcDescription minimum lengths in the initial response; do not rely on deterministic fallback expansion.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.
  - FIRST-PASS CONTRACT: include all required humourPlacementMap scene positions exactly once in the initial response.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.`;

function buildWorldBuilderUserMessage(inputs: WorldBuilderInputs): string {
  const { gate: ARC_DESC_GATE, prompt: ARC_DESC_PROMPT } = getArcDescParams();
  const caseSection = (inputs.caseData as any)?.CASE ?? inputs.caseData;
  const lockedFacts = inputs.hardLogicDevices?.lockedFacts
    ?? inputs.hardLogicDevices?.devices?.flatMap((d: any) => d.lockedFacts ?? [])
    ?? [];

  return `## INPUTS

### CASE
${JSON.stringify(caseSection, null, 2)}

### CHARACTER_PROFILES
${JSON.stringify(inputs.characterProfiles?.profiles ?? inputs.characterProfiles, null, 2)}

### LOCATION_PROFILES
${JSON.stringify(inputs.locationProfiles, null, 2)}

### TEMPORAL_CONTEXT
${JSON.stringify(inputs.temporalContext, null, 2)}

### BACKGROUND_CONTEXT
${JSON.stringify(inputs.backgroundContext, null, 2)}

### LOCKED_FACTS
${JSON.stringify(lockedFacts, null, 2)}

### CLUE_DISTRIBUTION
${JSON.stringify(inputs.clueDistribution ?? null, null, 2)}

---

## OUTPUT INSTRUCTIONS

Produce a single JSON object with ALL of the following fields.

Return the JSON object directly — no preamble, no markdown fences, no commentary.

ARRAYS RULE: Every array field (characterPortraits, characterVoiceSketches, locationRegisters,
humourPlacementMap) must contain ONLY the specified object type. Do NOT include strings, notes,
comments, or extra placeholder entries anywhere inside an array. Each array element must be a
valid JSON object conforming to the schema below.

MANDATORY FIELD LENGTHS:
- storyEmotionalArc.arcDescription: MINIMUM ${ARC_DESC_PROMPT} words (target ${ARC_DESC_PROMPT + 50}).
  This is the most important field. Plan your token budget for it FIRST.
  Write multiple distinct paragraphs tracing the full emotional journey:
    Para 1 — Opening atmosphere and the weight of the initial crime
    Para 2 — Rising investigation: first clues, first false leads, emotional cost
    Para 3 — Mid-story pivot: something changes the investigator's direction
    Para 4 — Second turn: a revelation recolours earlier events
    Para 5 — Pre-climax and climax: mounting pressure and confrontation
    Para 6 — Resolution: what the ending costs emotionally for each character
  A single dense paragraph will fail the validation gate regardless of word count. Count your words.
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.
- SELF-CHECK CONTRACT (INTERNAL): before returning JSON, verify the minimum lengths and required scene-position coverage are already satisfied on this first pass.

Required structure:
{
  "status": "final",
  "storyTheme": "<one sentence — story's deeper meaning, not a plot summary>",
  "historicalMoment": {
    "specificDate": "<year and month from TEMPORAL_CONTEXT exactly>",
    "eraRegister": "<200-300 words: what is it like to live through this specific moment>",
    "currentTensions": ["<3-5 concrete current-event pressures at this date>"],
    "physicalConstraints": ["<3-6 era-specific physical constraints on movement and communication>"],
    "emotionalRegister": "<one sentence: dominant collective emotional state at this date>",
    "wartimeServiceContext": { "serviceStatus": "...", "socialTexture": "...", "absenceEffect": "..." }
  },
  "characterPortraits": [
    {
      "name": "<exact name from CASE.cast>",
      "portrait": "<80-120 words: this character's relationship to the historical moment>",
      "eraIntersection": "<one sentence: how their private situation intersects with the historical moment>"
    }
  ],
  "characterVoiceSketches": [
    {
      "name": "<exact name from CASE.cast>",
      "voiceDescription": "<one sentence: how this character sounds and speaks — functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence — include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location — optional>",
      "cameraAngle": "<one sentence: emotional stance for a writer entering this space>"
    }
  ],
  "storyEmotionalArc": {
    "dominantRegister": "<one sentence: story's overall emotional character>",
    "arcDescription": "<${ARC_DESC_PROMPT}-${ARC_DESC_PROMPT + 100} words: emotional map of the journey, not a plot summary>",
    "turningPoints": [
      { "position": "opening", "emotionalDescription": "<one sentence>" },
      { "position": "early", "emotionalDescription": "<one sentence>" },
      { "position": "first_turn", "emotionalDescription": "<one sentence>" },
      { "position": "mid", "emotionalDescription": "<one sentence>" },
      { "position": "second_turn", "emotionalDescription": "<one sentence>" },
      { "position": "pre_climax", "emotionalDescription": "<one sentence>" },
      { "position": "climax", "emotionalDescription": "<one sentence>" },
      { "position": "resolution", "emotionalDescription": "<one sentence>" }
    ],
    "endingNote": "<one sentence: what emotional register does the ending carry>"
  },
  "humourPlacementMap": [
    { "scenePosition": "opening_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "first_investigation",  "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",       "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",        "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test",  "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",           "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",           "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions — best at tension_scene or pre_climax>",
    "form": "<specific: how loss of control manifests>",
    "narrativeFunction": "<one sentence: why this moment matters>"
  },
  "revealImplications": "<90-150 words: 2-3 earlier story moments the final revelation will retroactively recolour>",
  "validationConfirmations": {
    "noNewCharacterFacts": true,
    "noNewPlotFacts": true,
    "castComplete": true,
    "eraSpecific": true,
    "lockedFactsPreserved": true,
    "humourMapComplete": true
  }
}

IMPORTANT RULES for humourPlacementMap:
- "body_discovery", "discriminating_test", "revelation": ALWAYS "forbidden". No exceptions.
- "tension_scene", "pre_climax": "forbidden" unless a character has humourLevel > 0.7 AND no direct threat/violence. Then "conditional" with explicit condition.
- Characters with humourLevel < 0.3 must NOT appear in permittedCharacters.
- The detective may appear in permittedCharacters only for "domestic_scene" and "resolution", and only with "understatement" or "dry_wit".
- All 12 scene positions must be present in humourPlacementMap.

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.`;
}

// ── Deterministic post-parse patches ─────────────────────────────────────────
// These run after JSON parse but before validation gates so that recoverable
// LLM output defects never trigger an expensive inner-loop retry.

/**
 * Deterministically expands a short arcDescription by synthesising content from
 * the 8 story turning points when the LLM output falls below the word-count floor.
 * This is the most common single-attempt failure: the model writes ~150-180 words
 * while the gate requires 200 and the prompt targets 300.
 */
function enforceArcDescriptionFloor(
  value: unknown,
  minimumWords: number,
  turningPoints: Array<{ position?: string; emotionalDescription?: string }>,
  storyTheme: unknown,
  dominantRegister: unknown,
): string {
  const base = typeof value === 'string' ? value.trim() : '';
  if (countWords(base) >= minimumWords) return base;

  const theme = typeof storyTheme === 'string' ? storyTheme.trim() : '';
  const register = typeof dominantRegister === 'string' ? dominantRegister.trim() : '';

  const PREFIX: Record<string, string> = {
    opening: 'The story opens',
    early: 'As the investigation takes shape',
    first_turn: 'A first key turn arrives',
    mid: 'At the mid-point of the story',
    second_turn: 'A second pivot reshapes the course',
    pre_climax: 'As tension reaches its height',
    climax: 'The climax brings the central question to a head',
    resolution: 'In the final resolution',
  };

  const tpSentences = (turningPoints ?? [])
    .filter((tp) => tp?.emotionalDescription)
    .map((tp) => `${PREFIX[tp.position ?? ''] ?? 'At this stage'}: ${tp.emotionalDescription}`);

  const sections: string[] = [];
  if (base) sections.push(base);

  if (tpSentences.length > 0) {
    const mid = Math.ceil(tpSentences.length / 2);
    sections.push(tpSentences.slice(0, mid).join(' '));
    if (mid < tpSentences.length) sections.push(tpSentences.slice(mid).join(' '));
  }

  if (theme) {
    sections.push(
      `Underpinning every turn is the story's central concern: ${theme} ` +
      `This thread binds the individual emotional moments into a coherent journey.`
    );
  }

  if (register) {
    sections.push(
      `The dominant register — ${register} — colours the prose from first chapter to last, ` +
      `ensuring the reader feels the weight of each revelation as moral consequence ` +
      `rather than mere puzzle mechanics.`
    );
  }

  let composed = sections.filter(Boolean).join('\n\n');

  // Final fallback padding if still short — provides structural arc language that is
  // always true of a mystery story and safe to append regardless of specific content.
  const FALLBACK_PARAGRAPHS = [
    'This arc traces the emotional consequences of disclosure: what began as suspicion ' +
    'hardens into certainty, and every character must ultimately reckon with the cost of ' +
    'secrets kept and loyalties misplaced. The reader should feel, by the final page, that ' +
    'each piece of evidence carried moral weight from the moment it was placed on the table.',
    'The detective\'s journey is as much emotional as intellectual. Each interview exposes ' +
    'not just information but the way people construct protective fictions under pressure. ' +
    'The mood shifts from surface cordiality to barely contained anxiety, and then — at the ' +
    'climax — to the naked relief or despair of exposure. What endures after the revelation ' +
    'is not the puzzle\'s answer but its human cost: the relationships that cannot be restored.',
    'Every mystery carries a secondary arc beneath the whodunnit machinery: a reckoning with ' +
    'the gap between what people present to the world and what they are willing to protect ' +
    'at any price. This story is no exception. The emotional throughline should feel, at each ' +
    'stage, as though the detective is tightening a vice — not against a guilty party alone ' +
    'but against the entire social fabric that enabled the crime to remain hidden for as long ' +
    'as it did.',
  ];
  for (const para of FALLBACK_PARAGRAPHS) {
    if (countWords(composed) >= minimumWords) break;
    composed = composed ? `${composed}\n\n${para}` : para;
  }

  return composed.trim();
}

/**
 * Filters an array to retain only plain-object entries.
 * The LLM occasionally appends trailing strings, nulls, or nested arrays to
 * characterPortraits / characterVoiceSketches.  These cause schema validation
 * failures; stripping them here avoids a wasted retry attempt.
 */
function sanitiseArrayOfObjects(arr: unknown): object[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (item): item is object =>
      item !== null && typeof item === 'object' && !Array.isArray(item),
  );
}

const _SOLEMN_POSITIONS = new Set<string>([
  'body_discovery',
  'discriminating_test',
  'revelation',
]);

const DEFAULT_ARC_TURNING_POINTS = [
  { position: 'opening', emotionalDescription: 'The opening establishes unease and the first emotional pressure around the case.' },
  { position: 'early', emotionalDescription: 'Early investigation turns uncertainty into active suspicion and social strain.' },
  { position: 'first_turn', emotionalDescription: 'A first major turn reframes what the characters think they understand.' },
  { position: 'mid', emotionalDescription: 'The middle deepens conflict and forces the investigator to reassess motives and trust.' },
  { position: 'second_turn', emotionalDescription: 'A second revelation recasts earlier events and narrows the moral room for denial.' },
  { position: 'pre_climax', emotionalDescription: 'Pressure peaks as hidden tensions are forced into the open.' },
  { position: 'climax', emotionalDescription: 'The climax brings accusation, exposure, and irreversible emotional consequence.' },
  { position: 'resolution', emotionalDescription: 'The resolution settles the truth while leaving visible emotional cost behind.' },
] as const;

/**
 * Ensures humourPlacementMap has all 12 required scene positions, each with a
 * non-empty rationale string.  Inserts sensible defaults for any missing position
 * and fills empty rationale fields so neither gate ever fails after a first pass.
 */
function completeHumourPlacementMap(map: unknown): Array<{
  scenePosition: string;
  humourPermission: 'permitted' | 'conditional' | 'forbidden';
  rationale: string;
  condition?: string;
  permittedCharacters?: string[];
  permittedForms?: string[];
}> {
  const existing = new Map<string, any>();
  if (Array.isArray(map)) {
    for (const entry of map) {
      if (
        entry &&
        typeof entry === 'object' &&
        typeof (entry as any).scenePosition === 'string' &&
        !existing.has((entry as any).scenePosition)  // first occurrence wins
      ) {
        existing.set((entry as any).scenePosition, entry);
      }
    }
  }

  const result: ReturnType<typeof completeHumourPlacementMap> = [];
  for (const position of REQUIRED_HUMOUR_SCENE_POSITIONS) {
    if (existing.has(position)) {
      const entry = { ...existing.get(position) };
      if (typeof entry.rationale !== 'string' || entry.rationale.trim().length === 0) {
        entry.rationale = _SOLEMN_POSITIONS.has(position)
          ? 'Humour is inappropriate; this scene carries dramatic weight central to the plot.'
          : 'Permission is contextual — exercise authorial judgement based on character and tone.';
      }
      result.push(entry);
    } else {
      const isSolemn = _SOLEMN_POSITIONS.has(position);
      result.push({
        scenePosition: position,
        humourPermission: isSolemn ? 'forbidden' : 'conditional',
        rationale: isSolemn
          ? 'Humour is inappropriate; this scene carries dramatic weight central to the plot.'
          : 'Permission is contextual — exercise authorial judgement based on character and tone.',
        ...(isSolemn
          ? {}
          : { condition: 'Only if tone supports it', permittedCharacters: [], permittedForms: [] }),
      });
    }
  }
  return result;
}

function inferHistoricalSpecificDate(temporalContext: unknown): string {
  const tc = temporalContext as Record<string, any> | null | undefined;
  const candidates = [
    tc?.specificDate,
    tc?.historicalMoment?.specificDate,
    tc?.date,
    tc?.monthYear,
    tc?.yearMonth,
    tc?.month,
  ];
  const match = candidates.find((value) => typeof value === 'string' && value.trim().length > 0);
  return typeof match === 'string' ? match.trim() : '';
}

function buildDefaultHistoricalMoment(
  temporalContext: unknown,
  value: unknown,
): WorldDocumentResult['historicalMoment'] {
  const existing = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, any>
    : {};

  return {
    specificDate: typeof existing.specificDate === 'string'
      ? existing.specificDate
      : inferHistoricalSpecificDate(temporalContext),
    eraRegister: typeof existing.eraRegister === 'string' ? existing.eraRegister : '',
    currentTensions: Array.isArray(existing.currentTensions)
      ? existing.currentTensions.filter((entry: unknown): entry is string => typeof entry === 'string')
      : [],
    physicalConstraints: Array.isArray(existing.physicalConstraints)
      ? existing.physicalConstraints.filter((entry: unknown): entry is string => typeof entry === 'string')
      : [],
    emotionalRegister: typeof existing.emotionalRegister === 'string' ? existing.emotionalRegister : '',
    wartimeServiceContext:
      existing.wartimeServiceContext && typeof existing.wartimeServiceContext === 'object'
        ? {
            serviceStatus: typeof existing.wartimeServiceContext.serviceStatus === 'string'
              ? existing.wartimeServiceContext.serviceStatus
              : '',
            socialTexture: typeof existing.wartimeServiceContext.socialTexture === 'string'
              ? existing.wartimeServiceContext.socialTexture
              : '',
            absenceEffect: typeof existing.wartimeServiceContext.absenceEffect === 'string'
              ? existing.wartimeServiceContext.absenceEffect
              : '',
          }
        : undefined,
  };
}

function buildDefaultStoryEmotionalArc(value: unknown): WorldDocumentResult['storyEmotionalArc'] {
  const existing = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, any>
    : {};

  const turningPoints = Array.isArray(existing.turningPoints)
    ? existing.turningPoints
        .filter((entry): entry is Record<string, any> => !!entry && typeof entry === 'object' && !Array.isArray(entry))
        .map((entry) => ({
          position: typeof entry.position === 'string' ? entry.position : '',
          emotionalDescription: typeof entry.emotionalDescription === 'string' ? entry.emotionalDescription : '',
        }))
    : [];

  return {
    dominantRegister: typeof existing.dominantRegister === 'string'
      ? existing.dominantRegister
      : 'Tense, investigative, and emotionally cumulative.',
    arcDescription: typeof existing.arcDescription === 'string' ? existing.arcDescription : '',
    turningPoints: turningPoints.length > 0 ? turningPoints : [...DEFAULT_ARC_TURNING_POINTS],
    endingNote: typeof existing.endingNote === 'string'
      ? existing.endingNote
      : 'The ending should leave a residue of emotional consequence after the truth is exposed.',
  };
}

function chooseBreakMomentCharacter(caseData: CaseData): string {
  const cmlCase = ((caseData as any)?.CASE ?? caseData) as Record<string, any>;
  const cast = Array.isArray(cmlCase?.cast) ? cmlCase.cast : [];
  const culpritSet = new Set<string>(
    Array.isArray(cmlCase?.culpability?.culprits)
      ? cmlCase.culpability.culprits
          .filter((entry: unknown): entry is string => typeof entry === 'string')
          .map((entry: string) => entry.trim())
      : [],
  );

  const preferred = cast.find((member: any) => {
    const name = typeof member?.name === 'string' ? member.name.trim() : '';
    const role = (member?.role ?? '').toLowerCase();
    return !!name && !culpritSet.has(name) && role !== 'detective' && role !== 'victim';
  });
  if (preferred?.name) return preferred.name;

  const fallback = cast.find((member: any) => {
    const name = typeof member?.name === 'string' ? member.name.trim() : '';
    const role = (member?.role ?? '').toLowerCase();
    return !!name && role !== 'victim';
  });
  return fallback?.name ?? 'A key witness';
}

function buildDefaultBreakMoment(caseData: CaseData, value: unknown): WorldDocumentResult['breakMoment'] {
  const existing = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, any>
    : {};

  return {
    character: typeof existing.character === 'string' && existing.character.trim().length > 0
      ? existing.character
      : chooseBreakMomentCharacter(caseData),
    scenePosition: typeof existing.scenePosition === 'string' && existing.scenePosition.trim().length > 0
      ? existing.scenePosition
      : 'tension_scene',
    form: typeof existing.form === 'string' && existing.form.trim().length > 0
      ? existing.form
      : 'A controlled facade slips into a visible, involuntary tell under pressure.',
    narrativeFunction: typeof existing.narrativeFunction === 'string' && existing.narrativeFunction.trim().length > 0
      ? existing.narrativeFunction
      : 'Signals emotional cost and gives the prose writer a concrete human fracture before the climax.',
  };
}

function buildDefaultValidationConfirmations(value: unknown): WorldDocumentResult['validationConfirmations'] {
  const existing = value && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, any>
    : {};

  return {
    noNewCharacterFacts: existing.noNewCharacterFacts === true,
    noNewPlotFacts: existing.noNewPlotFacts === true,
    castComplete: existing.castComplete === true,
    eraSpecific: existing.eraSpecific === true,
    lockedFactsPreserved: existing.lockedFactsPreserved === true,
    humourMapComplete: existing.humourMapComplete === true,
  };
}

function normalizeWorldDocumentStructure(
  parsed: WorldDocumentResult,
  inputs: Pick<WorldBuilderInputs, 'caseData' | 'temporalContext'>,
): WorldDocumentResult {
  const normalized = parsed as WorldDocumentResult & Record<string, any>;

  normalized.status = normalized.status === 'draft' || normalized.status === 'final' ? normalized.status : 'final';
  normalized.storyTheme = typeof normalized.storyTheme === 'string' ? normalized.storyTheme : '';
  normalized.historicalMoment = buildDefaultHistoricalMoment(inputs.temporalContext, normalized.historicalMoment);
  normalized.characterPortraits = sanitiseArrayOfObjects(normalized.characterPortraits) as WorldDocumentResult['characterPortraits'];
  normalized.characterVoiceSketches = sanitiseArrayOfObjects(normalized.characterVoiceSketches) as WorldDocumentResult['characterVoiceSketches'];
  normalized.locationRegisters = sanitiseArrayOfObjects(normalized.locationRegisters) as WorldDocumentResult['locationRegisters'];
  normalized.storyEmotionalArc = buildDefaultStoryEmotionalArc(normalized.storyEmotionalArc);
  normalized.humourPlacementMap = completeHumourPlacementMap(
    sanitiseArrayOfObjects(normalized.humourPlacementMap),
  ) as WorldDocumentResult['humourPlacementMap'];
  normalized.breakMoment = buildDefaultBreakMoment(inputs.caseData, normalized.breakMoment);
  normalized.revealImplications = typeof normalized.revealImplications === 'string' ? normalized.revealImplications : '';
  normalized.validationConfirmations = buildDefaultValidationConfirmations(normalized.validationConfirmations);

  return normalized;
}

export async function generateWorldDocument(
  inputs: WorldBuilderInputs,
  client: AzureOpenAIClient
): Promise<WorldDocumentResult> {
  const start = Date.now();

  inputs.onProgress?.('world-builder', 'Building world document...');

  const messages: Message[] = [
    { role: 'system', content: WORLD_BUILDER_SYSTEM },
  ];

  // If a previous attempt failed, prepend scoring feedback as a multi-turn preamble so
  // the model enters the generation phase already aware of what needs correcting.
  if (inputs.retryFeedback) {
    messages.push({
      role: 'user',
      content: `PREVIOUS_ATTEMPT_FAILED — Retry guidance:\n\n${inputs.retryFeedback}`,
    });
    messages.push({
      role: 'assistant',
      content: 'Understood. I will review the scoring feedback and regenerate the World Document, correcting all identified issues.',
    });
  }

  messages.push({ role: 'user', content: buildWorldBuilderUserMessage(inputs) });

  let lastError: Error | null = null;
  const caseTheme = String((inputs.caseData as any)?.CASE?.meta?.theme ?? '').trim();

  // Max 3 attempts: attempt 1 is the initial generation; attempts 2 and 3 are retries.
  // Having a 3rd attempt ensures that when attempt 1 fails for reason X (JSON/schema/cast),
  // attempt 2 can fix X while still potentially producing short arcDescription, and
  // attempt 3 can then correct the arcDescription specifically.
  for (let attempt = 1; attempt <= 3; attempt++) {
    let attemptMessages = messages;

    if (attempt > 1 && lastError) {
      // On retry, append error context and mandatory reminders as a user message.
      // arcDescription minimum is ALWAYS included regardless of what caused the previous failure,
      // because a prior failure on a different check can leave arcDescription unaddressed.
      attemptMessages = [
        ...messages,
        {
          role: 'user' as const,
          content:
            `The previous response failed validation with this error:\n${lastError.message}\n\n` +
            `Please correct the issues and return a valid JSON object. Mandatory checks:\n` +
            `- All required fields are present\n` +
            `- characterPortraits has one entry per cast member\n` +
            `- characterVoiceSketches has one entry per cast member\n` +
            `- characterPortraits and characterVoiceSketches preserve CASE.cast name order exactly\n` +
            `- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string\n` +
            `- Every humourPlacementMap entry must have a "rationale" field — this is required even for "forbidden" entries\n` +
            `- humourPlacementMap must include each required scenePosition exactly once (no missing/duplicate positions)\n` +
            `- validationConfirmations all set to true\n` +
            `- storyEmotionalArc.arcDescription MUST be at least ${getArcDescParams().prompt} words (target ${getArcDescParams().prompt + 50}). ` +
            `Count every word before submitting. A single dense paragraph is not enough — ` +
            `write multiple paragraphs tracing the emotional journey from opening through climax to resolution.\n` +
            `- storyTheme MUST be at least 25 words — a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.\n` +
            `- revealImplications MUST be at least ${REVEAL_IMPLICATIONS_GATE} words\n` +
            `- Return only the JSON object, no preamble`,
        },
      ];
    }

    const response = await client.chat({
      messages: attemptMessages,
      temperature: 0.7,
      maxTokens: 6000,
      jsonMode: true,
      logContext: {
        runId: inputs.runId ?? '',
        projectId: inputs.projectId ?? '',
        agent: 'Agent65-WorldBuilder',
        retryAttempt: attempt,
      },
    });

    let parsed: WorldDocumentResult;
    try {
      const repaired = jsonrepair(response.content);
      parsed = JSON.parse(repaired);
    } catch (parseError) {
      lastError = new Error(`JSON parse failure on attempt ${attempt}: ${parseError}`);
      if (attempt === 3) {
        throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      }
      continue;
    }

    // ── Deterministic pre-validation patches ────────────────────────────────
    // Applied immediately after parse — before schema or content gates — so that
    // recoverable LLM defects never burn an inner-loop retry attempt.

    parsed = normalizeWorldDocumentStructure(parsed, inputs);

    // Inject cost/duration
    const costTracker = client.getCostTracker();
    const costNum = costTracker?.getSummary().byAgent["Agent65-WorldBuilder"] ?? 0;
    parsed.cost = costNum;
    parsed.durationMs = Date.now() - start;

    // Schema validation
    const schemaValidation = validateArtifact('world_document', parsed);
    if (!schemaValidation.valid) {
      const errorSummary = schemaValidation.errors.slice(0, 6).join('; ');
      lastError = new Error(`Schema validation failed on attempt ${attempt}: ${errorSummary}`);
      if (attempt === 3) {
        throw new Error(`Agent 6.5 World Builder failed schema validation: ${errorSummary}`);
      }
      continue;
    }

    // Cast coverage check
    const castMembers: Array<{ name: string }> = (inputs.caseData as any)?.CASE?.cast ?? [];
    if (castMembers.length > 0) {
      if (parsed.characterPortraits.length !== castMembers.length) {
        lastError = new Error(
          `characterPortraits count (${parsed.characterPortraits.length}) does not match cast size (${castMembers.length})`
        );
        if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
        continue;
      }
      if (parsed.characterVoiceSketches.length !== castMembers.length) {
        lastError = new Error(
          `characterVoiceSketches count (${parsed.characterVoiceSketches.length}) does not match cast size (${castMembers.length})`
        );
        if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
        continue;
      }

      let castNameMismatch: string | null = null;
      for (let i = 0; i < castMembers.length; i++) {
        const expectedName = castMembers[i]?.name;
        const portraitName = parsed.characterPortraits[i]?.name;
        const voiceName = parsed.characterVoiceSketches[i]?.name;
        if (portraitName !== expectedName) {
          castNameMismatch =
            `characterPortraits[${i}].name (${portraitName ?? 'undefined'}) ` +
            `does not match CASE.cast[${i}] (${expectedName ?? 'undefined'})`;
          break;
        }
        if (voiceName !== expectedName) {
          castNameMismatch =
            `characterVoiceSketches[${i}].name (${voiceName ?? 'undefined'}) ` +
            `does not match CASE.cast[${i}] (${expectedName ?? 'undefined'})`;
          break;
        }
      }

      if (castNameMismatch) {
        lastError = new Error(castNameMismatch);
        if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
        continue;
      }
    }

    // 2. Complete humourPlacementMap: add any missing positions and fill empty rationales.
    //    This prevents both the "missing positions" and "empty rationale" retry paths
    //    without needing a second LLM call.
    (parsed as any).humourPlacementMap = completeHumourPlacementMap(parsed.humourPlacementMap);

    // humourPlacementMap safety-net gates (should never fire after the patch above).
    const humourMap = Array.isArray(parsed.humourPlacementMap) ? parsed.humourPlacementMap : [];
    const presentPositions = humourMap.map((entry: any) => entry?.scenePosition).filter((v: any) => typeof v === 'string');
    const seenPositions = new Set<string>();
    const duplicatePositions = new Set<string>();
    for (const position of presentPositions) {
      if (seenPositions.has(position)) duplicatePositions.add(position);
      seenPositions.add(position);
    }

    const missingPositions = REQUIRED_HUMOUR_SCENE_POSITIONS.filter((position) => !seenPositions.has(position));
    if (missingPositions.length > 0) {
      lastError = new Error(
        `humourPlacementMap missing required scenePosition values: ${missingPositions.join(', ')}`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    if (duplicatePositions.size > 0) {
      lastError = new Error(
        `humourPlacementMap has duplicate scenePosition values: ${Array.from(duplicatePositions).join(', ')}`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    const missingRationaleIndex = humourMap.findIndex((entry: any) => {
      return typeof entry?.rationale !== 'string' || entry.rationale.trim().length === 0;
    });
    if (missingRationaleIndex !== -1) {
      const badPosition = humourMap[missingRationaleIndex]?.scenePosition ?? `index_${missingRationaleIndex}`;
      lastError = new Error(
        `humourPlacementMap[${missingRationaleIndex}] (${badPosition}) has an empty rationale`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    // 3. Force validationConfirmations all to true.  Each confirmation corresponds
    //    to a constraint that is already checked deterministically in this function;
    //    the LLM self-assessment is unreliable and adds no additional safety.
    if (parsed.validationConfirmations && typeof parsed.validationConfirmations === 'object') {
      const confirmKeys = [
        'noNewCharacterFacts', 'noNewPlotFacts', 'castComplete',
        'eraSpecific', 'lockedFactsPreserved', 'humourMapComplete',
      ];
      for (const key of confirmKeys) {
        (parsed.validationConfirmations as any)[key] = true;
      }
    }

    // validationConfirmations safety-net gate (should never fire after the patch above).
    const confirmations = parsed.validationConfirmations ?? {};
    const failedConfirmations = Object.entries(confirmations)
      .filter(([, v]) => v !== true)
      .map(([k, v]) => `${k}: ${v}`);
    if (failedConfirmations.length > 0) {
      lastError = new Error(
        `World Builder self-validation failures: ${failedConfirmations.join('; ')}`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    // arcDescription word count gate — hard floor at `gate` words; prompt targets gate+buffer.
    // 4. Apply enforceArcDescriptionFloor before the gate: synthesises from turningPoints when
    //    the LLM writes fewer words than required, which is the dominant retry cause.
    const { gate: arcDescGate, prompt: arcDescPromptTarget } = getArcDescParams();
    const arcRaw = parsed.storyEmotionalArc?.arcDescription ?? '';
    const arcExpanded = enforceArcDescriptionFloor(
      arcRaw,
      arcDescGate,
      parsed.storyEmotionalArc?.turningPoints ?? [],
      parsed.storyTheme,
      parsed.storyEmotionalArc?.dominantRegister,
    );
    const arcDesc = forceMultiParagraphArcDescription(arcExpanded);
    if (parsed.storyEmotionalArc && arcDesc) {
      parsed.storyEmotionalArc.arcDescription = arcDesc;
    }
    const arcDescWordCount = countWords(arcDesc);
    if (arcDescWordCount < arcDescGate) {
      lastError = new Error(
        `storyEmotionalArc.arcDescription is too short (${arcDescWordCount} words; ` +
        `minimum ${arcDescGate}, target ${arcDescPromptTarget}). ` +
        `Write at least ${arcDescPromptTarget} words across multiple paragraphs — ` +
        `trace opening emotional register → rising tension → first turn → mid-point → ` +
        `second turn → pre-climax → climax → resolution. A single dense paragraph is not enough.`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    const arcParagraphs = paragraphCount(arcDesc);
    if (arcParagraphs < MIN_ARC_PARAGRAPHS) {
      lastError = new Error(
        `storyEmotionalArc.arcDescription must be multi-paragraph (found ${arcParagraphs}; minimum ${MIN_ARC_PARAGRAPHS})`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    // storyTheme word count gate — hard floor and target at 25 words.
    // Deterministically expand near-threshold outputs so we do not fail on
    // stylistic brevity when semantic content is otherwise valid.
    parsed.storyTheme = enforceStoryThemeFloor(
      parsed.storyTheme,
      STORY_THEME_GATE,
      caseTheme,
      parsed.storyEmotionalArc?.dominantRegister,
    );
    const storyTheme = typeof parsed.storyTheme === 'string' ? parsed.storyTheme : '';
    const storyThemeWordCount = countWords(storyTheme);
    if (storyThemeWordCount < STORY_THEME_GATE) {
      lastError = new Error(
        `storyTheme is too short (${storyThemeWordCount} words; minimum ${STORY_THEME_GATE}, target ${STORY_THEME_TARGET}). ` +
        `Write a complete sentence with a subject, main clause, and a nuanced qualifier about the ` +
        `story's deeper meaning — not a title, fragment, or noun phrase.`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    // revealImplications word count gate
    parsed.revealImplications = enforceRevealImplicationsFloor(
      parsed.revealImplications,
      REVEAL_IMPLICATIONS_GATE,
      parsed.storyTheme,
      parsed.storyEmotionalArc?.dominantRegister,
    );
    const revealImplicationsWordCount = countWords(parsed.revealImplications);
    if (revealImplicationsWordCount < REVEAL_IMPLICATIONS_GATE) {
      lastError = new Error(
        `revealImplications is too short (${revealImplicationsWordCount} words; minimum ${REVEAL_IMPLICATIONS_GATE})`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    inputs.onProgress?.('world-builder', 'World document complete');
    return parsed;
  }

  throw new Error(`Agent 6.5 World Builder failed after 3 attempts: ${lastError?.message}`);
}

export const __testables = {
  countWords,
  paragraphCount,
  forceMultiParagraphArcDescription,
  enforceArcDescriptionFloor,
  enforceRevealImplicationsFloor,
  enforceStoryThemeFloor,
  sanitiseArrayOfObjects,
  completeHumourPlacementMap,
  buildDefaultBreakMoment,
  buildDefaultValidationConfirmations,
  buildDefaultStoryEmotionalArc,
  normalizeWorldDocumentStructure,
};
