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

export type { WorldDocumentResult };

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

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.`;

function buildWorldBuilderUserMessage(inputs: WorldBuilderInputs): string {
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
    "arcDescription": "<200-300 words: emotional map of the journey, not a plot summary>",
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
    { "scenePosition": "opening_scene", "humourPermission": "permitted|conditional|forbidden", "condition": "...", "permittedCharacters": [], "permittedForms": [], "rationale": "..." },
    { "scenePosition": "first_investigation", ... },
    { "scenePosition": "body_discovery", "humourPermission": "forbidden", "rationale": "..." },
    { "scenePosition": "first_interview", ... },
    { "scenePosition": "domestic_scene", ... },
    { "scenePosition": "mid_investigation", ... },
    { "scenePosition": "second_interview", ... },
    { "scenePosition": "tension_scene", ... },
    { "scenePosition": "pre_climax", ... },
    { "scenePosition": "discriminating_test", "humourPermission": "forbidden", "rationale": "..." },
    { "scenePosition": "revelation", "humourPermission": "forbidden", "rationale": "..." },
    { "scenePosition": "resolution", ... }
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
    { role: 'user', content: buildWorldBuilderUserMessage(inputs) },
  ];

  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= 2; attempt++) {
    let attemptMessages = messages;

    if (attempt === 2 && lastError) {
      // On retry, append error context as a user message
      attemptMessages = [
        ...messages,
        {
          role: 'user' as const,
          content: `The previous response failed validation with this error:\n${lastError.message}\n\nPlease correct the issues and return a valid JSON object. Ensure:\n- All required fields are present\n- characterPortraits has one entry per cast member\n- characterVoiceSketches has one entry per cast member\n- humourPlacementMap has all 12 scene positions\n- validationConfirmations all set to true\n- Return only the JSON object, no preamble`,
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
      if (attempt === 2) {
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
      if (attempt === 2) {
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
        if (attempt === 2) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
        continue;
      }
      if (parsed.characterVoiceSketches.length !== castMembers.length) {
        lastError = new Error(
          `characterVoiceSketches count (${parsed.characterVoiceSketches.length}) does not match cast size (${castMembers.length})`
        );
        if (attempt === 2) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
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
      if (attempt === 2) throw new Error(`Agent 6.5 World Builder failed: ${lastError.message}`);
      continue;
    }

    inputs.onProgress?.('world-builder', 'World document complete');
    return parsed;
  }

  throw new Error(`Agent 6.5 World Builder failed after 2 attempts: ${lastError?.message}`);
}
