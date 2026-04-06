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
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count — the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening → rising tension → first turn → mid → second turn → climax → resolution.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too — explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.

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

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture — sights, pressures, daily life — not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM ${ARC_DESC_PROMPT} words, target ${ARC_DESC_PROMPT + 50} words. This is an emotional map
  of the full story journey — not a one-paragraph summary. It must trace the emotional register from
  opening chapter through rising tension to climax and resolution. Multiple paragraphs expected.
  A response shorter than ${ARC_DESC_PROMPT} words will fail the quality gate. Count your words.
- revealImplications: MINIMUM 90 words. Three earlier scenes, each revisited with one full sentence
  of analysis. Aim for 120 words.
- storyTheme: MINIMUM 25 words. Write a complete sentence with a subject, main clause, and a nuanced
  qualifier about the story's deeper meaning. Not a title, a noun phrase, or a fragment.
  A storyTheme shorter than 25 words will fail the quality gate.

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
            `- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string\n` +
            `- Every humourPlacementMap entry must have a "rationale" field — this is required even for "forbidden" entries\n` +
            `- validationConfirmations all set to true\n` +
            `- storyEmotionalArc.arcDescription MUST be at least ${getArcDescParams().prompt} words (target ${getArcDescParams().prompt + 50}). ` +
            `Count every word before submitting. A single dense paragraph is not enough — ` +
            `write multiple paragraphs tracing the emotional journey from opening through climax to resolution.\n` +
            `- storyTheme MUST be at least 25 words — a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.\n` +
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
    }

    // ValidationConfirmations gate
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

    // arcDescription word count gate — hard floor at `gate` words; prompt targets gate+buffer
    const { gate: arcDescGate, prompt: arcDescPromptTarget } = getArcDescParams();
    const arcDesc = parsed.storyEmotionalArc?.arcDescription ?? '';
    const arcDescWordCount = arcDesc.split(/\s+/).filter((w: string) => w.length > 0).length;
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

    // storyTheme word count gate — hard floor at 20 words; prompt targets 25 words
    const storyTheme = typeof parsed.storyTheme === 'string' ? parsed.storyTheme : '';
    const storyThemeWordCount = storyTheme.split(/\s+/).filter((w: string) => w.length > 0).length;
    const STORY_THEME_GATE = 20;
    const STORY_THEME_TARGET = 25;
    if (storyThemeWordCount < STORY_THEME_GATE) {
      lastError = new Error(
        `storyTheme is too short (${storyThemeWordCount} words; minimum ${STORY_THEME_GATE}, target ${STORY_THEME_TARGET}). ` +
        `Write a complete sentence with a subject, main clause, and a nuanced qualifier about the ` +
        `story's deeper meaning — not a title, fragment, or noun phrase.`
      );
      if (attempt === 3) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    inputs.onProgress?.('world-builder', 'World document complete');
    return parsed;
  }

  throw new Error(`Agent 6.5 World Builder failed after 3 attempts: ${lastError?.message}`);
}
