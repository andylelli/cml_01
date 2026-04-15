# Agent 65 - World Builder Best Prompt Analog (Runtime-Equivalent)

Source of truth:
- `packages/prompts-llm/src/agent65-world-builder.ts`
- `schema/world_document.schema.yaml`

Use with:
- `documentation/prompts/PROMPT_BACKBONE_STANDARD.md`

This file is the best-practice reference for Agent 6.5 prompt behavior. It documents exactly what runtime sends, plus operational guidance that improves pass rate on first attempt.

## Message Stack Actually Sent
1. `system`: `WORLD_BUILDER_SYSTEM`
2. Optional retry preamble (if `inputs.retryFeedback` exists):
- `user`: `PREVIOUS_ATTEMPT_FAILED - Retry guidance:\n\n${inputs.retryFeedback}`
- `assistant`: `Understood. I will review the scoring feedback and regenerate the World Document, correcting all identified issues.`
3. `user`: `buildWorldBuilderUserMessage(inputs)`
4. On attempts 2/3 after failure: extra corrective `user` message with failed validation error and mandatory reminders.

## System Prompt (Exact Runtime Text)
```text
You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story - its cast, setting, era,
locations, plot logic, and clues - into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - You must not invent any new character secrets, new relationships, or new backstory beyond
    what is in the provided inputs.
  - You must not name the culprit identity or describe any clue in specific forensic detail.
  - Every locked fact (exact times, distances, quantities, measurements) must appear in this
    document exactly as given - not paraphrased, not rounded, not changed.
  - Character voice sketches must be consistent with the speechMannerisms and humourStyle
    from the character profiles. A character with humourStyle: "none" must not produce wit.
  - The historical moment section must reason from the specific year and month provided.
    It must not be a general description of the decade. A reviewer should be able to
    identify the approximate date from the historicalMoment section alone.
  - All text fields must be written as if addressed to a novelist about to write this story:
    purposeful, not bureaucratic; specific, not generic.
  - storyEmotionalArc.arcDescription MUST be at least 300 words across multiple paragraphs.
    A single-paragraph summary is insufficient regardless of word count - the emotional
    journey must unfold across clearly distinct paragraphs.
    Trace opening -> rising tension -> first turn -> mid -> second turn -> climax -> resolution.
  - humourPlacementMap: every entry (all 12 scene positions) MUST include a non-empty
    "rationale" string. This applies to "forbidden" entries too - explain WHY it is forbidden.
    Omitting rationale on any entry will cause schema validation failure.

You will produce a single JSON object. Return only the JSON. No preamble, no commentary.
```

## User Prompt Builder (Exact Runtime Structure)
Notes:
- `ARC_DESC_PROMPT` is dynamic: `arc_description_gate + arc_description_prompt_buffer` from generation params.
- Inputs are injected with `JSON.stringify(..., null, 2)`.

```text
## INPUTS

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

Return the JSON object directly - no preamble, no markdown fences, no commentary.

MANDATORY FIELD LENGTHS:
- historicalMoment.eraRegister: MINIMUM 150 words. Bring the historical moment alive through lived
  texture - sights, pressures, daily life - not a history lesson. Count your words before finalising.
- storyEmotionalArc.arcDescription: MINIMUM ${ARC_DESC_PROMPT} words, target ${ARC_DESC_PROMPT + 50} words. This is an emotional map
  of the full story journey - not a one-paragraph summary. It must trace the emotional register from
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
  "storyTheme": "<one sentence - story's deeper meaning, not a plot summary>",
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
      "voiceDescription": "<one sentence: how this character sounds and speaks - functional, no labels>",
      "fragments": [
        { "register": "comfortable", "text": "<2-4 lines of actual speech, no attribution>" },
        { "register": "evasive", "text": "<2-4 lines of actual speech>" },
        { "register": "stressed", "text": "<2-4 lines of actual speech>" }
      ],
      "humourNote": "<one sentence - include only if humourLevel > 0 in profiles>"
    }
  ],
  "locationRegisters": [
    {
      "locationId": "<must match a keyLocation id from LOCATION_PROFILES>",
      "name": "<location name>",
      "emotionalRegister": "<60-100 words: what it feels like to be here in this story>",
      "eraNote": "<one sentence: era-specific constraint on this location - optional>",
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
    { "scenePosition": "first_investigation", "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "body_discovery",      "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "first_interview",     "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "domestic_scene",      "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "mid_investigation",   "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "second_interview",    "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "tension_scene",       "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "pre_climax",          "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" },
    { "scenePosition": "discriminating_test", "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "revelation",          "humourPermission": "forbidden",                                                                                                                           "rationale": "<one sentence>" },
    { "scenePosition": "resolution",          "humourPermission": "permitted|conditional|forbidden", "condition": "<omit if not conditional>", "permittedCharacters": [], "permittedForms": [], "rationale": "<one sentence>" }
  ],
  "breakMoment": {
    "character": "<non-culprit, non-detective cast member>",
    "scenePosition": "<one of the 12 humour positions - best at tension_scene or pre_climax>",
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

IMPORTANT: characterPortraits and characterVoiceSketches must each have exactly one entry per cast member in CASE.cast, in the same order.
```

## Retry Correction Prompt (Attempts 2/3)
```text
The previous response failed validation with this error:
${lastError.message}

Please correct the issues and return a valid JSON object. Mandatory checks:
- All required fields are present
- characterPortraits has one entry per cast member
- characterVoiceSketches has one entry per cast member
- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string
- Every humourPlacementMap entry must have a "rationale" field - this is required even for "forbidden" entries
- validationConfirmations all set to true
- storyEmotionalArc.arcDescription MUST be at least ${getArcDescParams().prompt} words (target ${getArcDescParams().prompt + 50}). Count every word before submitting. A single dense paragraph is not enough - write multiple paragraphs tracing the emotional journey from opening through climax to resolution.
- storyTheme MUST be at least 25 words - a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.
- Return only the JSON object, no preamble
```

## Runtime Gates (Authoritative)
- 3-attempt retry loop with JSON parse repair (`jsonrepair`).
- Schema validation via `validateArtifact('world_document', parsed)`.
- Hard cast coverage checks:
  - `characterPortraits.length === CASE.cast.length`
  - `characterVoiceSketches.length === CASE.cast.length`
- Validation confirmations gate: all booleans must be `true`.
- `storyEmotionalArc.arcDescription` hard floor: `arc_description_gate` words.
- `storyTheme` hard floor in runtime code: 20 words.

Important implementation nuance:
- Prompt asks for `storyTheme >= 25 words`.
- Runtime hard gate is currently 20 words.
- Best practice: keep the doc and model behavior at 25+ words to satisfy both quality target and gate.

## Quality Bar (Best-Practice Layer)
- Zero invention: no new secrets, no new relationships, no new mechanism facts.
- Date specificity: `historicalMoment` should read as this month/year, not a decade essay.
- Voice fidelity: sketches should be recognizably tied to `speechMannerisms` + `humourStyle`.
- Emotional continuity: `arcDescription` must show staged emotional transitions, not summary compression.
- Humour governance: all 12 scene positions present; rationale never omitted.
- Lock integrity: locked facts preserved verbatim whenever surfaced.

## Micro-Exemplars (Patterns, Not Copy)
- Weak historical register: "The 1930s were difficult and people were anxious."
- Strong historical register: names concrete month-level pressures, practical constraints, and social texture that could only fit that date window.

- Weak arc description: one paragraph listing plot beats.
- Strong arc description: multi-paragraph emotional progression from opening through resolution, with tonal inflection at each turn.

- Weak humour map rationale: "Forbidden because serious scene."
- Strong humour map rationale: "Forbidden because evidentiary clarity and emotional truth in immediate corpse proximity must not be diffused by wit."

## Silent Pre-Output Checklist
- JSON only, no markdown fences, no preamble.
- All required top-level fields present.
- `characterPortraits` and `characterVoiceSketches` both exactly match cast size and order.
- `humourPlacementMap` has all 12 positions and each entry includes non-empty `rationale`.
- `storyEmotionalArc.arcDescription` meets configured minimum and is multi-paragraph.
- `storyTheme` is 25+ words and sentence-complete.
- `validationConfirmations` all `true`.

## Common Failure Patterns
- Missing one or more humour map positions.
- Omitting rationale on forbidden entries.
- Arc description long enough but still one dense paragraph.
- Story theme as slogan/tagline rather than full sentence.
- Cast arrays not aligned to CASE order.
- Subtle invention in portraits (new history or private facts).

## Operational Recommendation
When tuning this prompt, preserve runtime contract first. Tighten quality language only if it does not change required schema keys, cardinalities, or gate assumptions in `agent65-world-builder.ts`.
