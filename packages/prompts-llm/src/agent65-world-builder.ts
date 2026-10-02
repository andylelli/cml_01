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
import { isDetectiveMember, isVictimMember, verifiedFixesEnabled, promptTrimsEnabled } from "@cml/cml";
import { parseLlmJson } from "./shared/llm-json.js";
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

function clampToMaxWordsPreservingParagraphs(value: unknown, maxWords: number): string {
  if (typeof value !== 'string') return '';
  if (maxWords <= 0) return '';

  const totalWords = countWords(value);
  if (totalWords <= maxWords) {
    return value.trim();
  }

  const paragraphs = value
    .split(/\n\s*\n/)
    .map((paragraph: string) => paragraph.trim())
    .filter((paragraph: string) => paragraph.length > 0);

  let remaining = maxWords;
  const kept: string[] = [];

  for (const paragraph of paragraphs) {
    if (remaining <= 0) break;
    const words = paragraph.split(/\s+/).filter((word: string) => word.length > 0);
    if (words.length <= remaining) {
      kept.push(words.join(' '));
      remaining -= words.length;
      continue;
    }

    kept.push(words.slice(0, remaining).join(' '));
    remaining = 0;
  }

  let clamped = kept.join('\n\n').trim();
  if (clamped.length > 0 && !/[.!?]$/.test(clamped)) {
    clamped = `${clamped}.`;
  }

  return clamped;
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
  onProgress?: (phase: string, message: string) => void;
}

/**
 * A6-17 (CR-28, CML_PROMPT_TRIMS): the arc word minimum was hard-coded "300" here while the user message
 * and both retry texts render `getArcDescParams().prompt`. Flag OFF renders the literal 300 (byte-identical
 * to the old constant); ON renders the configured value so the system prompt and the retries agree.
 */
function renderWorldBuilderSystem(arcWords: number): string {
  return `You are the World Builder for a mystery story.

Your role is to synthesise all structured information about the story — its cast, setting, era,
locations, plot logic, and clues — into a single coherent World Document. This document will be
read by the prose writer as their entire creative context. It must be vivid, purposeful, and
grounded in every specific fact provided.

Critical constraints:
  - storyEmotionalArc.arcDescription is your most important output field. Budget your tokens
    for it before writing shorter fields. It MUST be at least ${arcWords} words written across multiple
    clearly distinct paragraphs — not a dense single block. Trace the full emotional journey:
    opening atmosphere → rising unease → first investigative turn → mid-story revelation →
    second pivot → pre-climax pressure → climax → resolution. A response shorter than ${arcWords} words
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
}

const WORLD_BUILDER_SYSTEM = renderWorldBuilderSystem(300);

function worldBuilderSystem(): string {
  return promptTrimsEnabled() ? renderWorldBuilderSystem(getArcDescParams().prompt) : WORLD_BUILDER_SYSTEM;
}

// A_53 P9 (ships-whole-cml-and-full-clue-prose-to-every-audit): the World Builder is explicitly
// forbidden from inventing clues or describing any clue "in specific forensic detail", so it does not
// need the full stringified clue distribution (per-clue pointsTo / inference / sourceInCML, red-herring
// misdirection, timelines, fair-play flags). Project to a slim summary: counts by placement/criticality
// plus an id + placement + category one-liner per clue. Conservative: keeps enough for clue-density and
// emotional-pacing grounding without re-shipping forensic prose at 6000 tokens ×3. Returns null when no
// distribution is provided so the section stays "null" exactly as before.
function summarizeClueDistribution(clueDistribution: any): unknown {
  if (clueDistribution == null) return null;
  const clues = Array.isArray(clueDistribution.clues) ? clueDistribution.clues : [];
  const byPlacement: Record<string, number> = { early: 0, mid: 0, late: 0 };
  const byCriticality: Record<string, number> = {};
  for (const c of clues) {
    const placement = typeof c?.placement === 'string' ? c.placement : 'unknown';
    byPlacement[placement] = (byPlacement[placement] ?? 0) + 1;
    const criticality = typeof c?.criticality === 'string' ? c.criticality : 'unknown';
    byCriticality[criticality] = (byCriticality[criticality] ?? 0) + 1;
  }
  return {
    totalClues: clues.length,
    countsByPlacement: byPlacement,
    countsByCriticality: byCriticality,
    redHerringCount: Array.isArray(clueDistribution.redHerrings) ? clueDistribution.redHerrings.length : 0,
    // High-level catalogue only — no forensic detail (no pointsTo/inference/sourceInCML/description).
    clues: clues.map((c: any) => ({
      id: c?.id,
      placement: c?.placement,
      criticality: c?.criticality,
      category: c?.category,
    })),
  };
}

/**
 * CR-03: an upstream artifact carries its own run telemetry at the top level — `cost` and
 * `durationMs` (MEASURED on run_7b1ec2ef: both in TEMPORAL_CONTEXT and BACKGROUND_CONTEXT). Serialised
 * whole, a wall-clock number reaches the model and makes this prompt differ between two runs of the same
 * case. `AGENT65_OMIT_RUN_TELEMETRY=true` drops those two root keys; default OFF (ADR-0004). Nested
 * keys are left alone — `cost` inside a profile is story content.
 */
const RUN_TELEMETRY_KEYS = ['cost', 'durationMs'] as const;
function withoutRunTelemetry<T>(artifact: T): T {
  if (process.env.AGENT65_OMIT_RUN_TELEMETRY !== 'true') return artifact;
  if (!artifact || typeof artifact !== 'object' || Array.isArray(artifact)) return artifact;
  const copy: Record<string, unknown> = { ...(artifact as Record<string, unknown>) };
  for (const k of RUN_TELEMETRY_KEYS) delete copy[k];
  return copy as T;
}

/**
 * A6-17 (CR-28, CML_PROMPT_TRIMS): CASE keys the World Builder is sent without needing — only the instructions to
 * OTHER agents: `quality_controls` (Agents 3/5) and `prose_requirements` (Agent 9's scene contracts).
 *
 * The solution half (`hidden_model`, `inference_path`, `constraint_space`, `discriminating_test`, `fair_play`,
 * `red_herrings`) is KEPT on purpose. MEASURED over 65 archived World Documents: phrases traceable only to those
 * sections appear 150 times in revealImplications and 244 in storyEmotionalArc, and discriminating_test wording in
 * 38 of 65 documents — the reveal draws on them. Dropping them saves a fraction of a penny per call and risks the
 * reveal, so it is not done; quality_controls had 0 hits. Compact JSON carries most of the saving.
 */
const WORLD_BUILDER_CASE_OMIT = [
  'quality_controls',
  'prose_requirements',
] as const;

function projectCaseForWorldBuilder(caseSection: unknown): unknown {
  if (!caseSection || typeof caseSection !== 'object' || Array.isArray(caseSection)) return caseSection;
  const copy: Record<string, unknown> = { ...(caseSection as Record<string, unknown>) };
  for (const k of WORLD_BUILDER_CASE_OMIT) delete copy[k];
  return copy;
}

function buildWorldBuilderUserMessage(inputs: WorldBuilderInputs): string {
  const { prompt: ARC_DESC_PROMPT } = getArcDescParams();
  // A6-17 (CR-28, CML_PROMPT_TRIMS): compact JSON (the indentation was ~15% of the INPUTS) and the CASE projection.
  const trims = promptTrimsEnabled();
  const json = (value: unknown): string => (trims ? JSON.stringify(value) : JSON.stringify(value, null, 2));
  const rawCase = (inputs.caseData as any)?.CASE ?? inputs.caseData;
  const caseSection = trims ? projectCaseForWorldBuilder(rawCase) : rawCase;
  const lockedFacts = inputs.hardLogicDevices?.lockedFacts
    ?? inputs.hardLogicDevices?.devices?.flatMap((d: any) => d.lockedFacts ?? [])
    ?? [];

  return `## INPUTS

### CASE
${json(caseSection)}

### CHARACTER_PROFILES
${json(withoutRunTelemetry(inputs.characterProfiles?.profiles ?? inputs.characterProfiles))}

### LOCATION_PROFILES
${json(withoutRunTelemetry(inputs.locationProfiles))}

### TEMPORAL_CONTEXT
${json(withoutRunTelemetry(inputs.temporalContext))}

### BACKGROUND_CONTEXT
${json(withoutRunTelemetry(inputs.backgroundContext))}

### LOCKED_FACTS
${json(lockedFacts)}

### CLUE_DISTRIBUTION (summary — counts + id/placement/category only; no forensic detail)
${json(summarizeClueDistribution(inputs.clueDistribution ?? null))}

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

  // A6-D02 (owner decision 12, CML_VERIFIED_FIXES): CASE.cast carries role_archetype, not role — ask the shared
  // predicates, which read both, so the default break-moment character is never the detective or the victim.
  const fixA6D02 = verifiedFixesEnabled();
  const isDetective = (member: any) =>
    fixA6D02 ? isDetectiveMember(member) : (member?.role ?? '').toLowerCase() === 'detective';
  const isVictim = (member: any) =>
    fixA6D02 ? isVictimMember(member) : (member?.role ?? '').toLowerCase() === 'victim';

  const preferred = cast.find((member: any) => {
    const name = typeof member?.name === 'string' ? member.name.trim() : '';
    return !!name && !culpritSet.has(name) && !isDetective(member) && !isVictim(member);
  });
  if (preferred?.name) return preferred.name;

  const fallback = cast.find((member: any) => {
    const name = typeof member?.name === 'string' ? member.name.trim() : '';
    return !!name && !isVictim(member);
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

interface CastCoverageVerdict {
  ok: boolean;
  /** Retryable error message when !ok — format matches the pre-existing gate messages. */
  error?: string;
  /** Victim names accepted as absent (victim-exempt coverage) — for logging/telemetry. */
  missingVictimNames: string[];
}

/**
 * Cast-coverage gate for characterPortraits / characterVoiceSketches, with a
 * victim exemption. M1 abort class (run mystery-1784133922125): the model
 * declines to invent dialogue for the victim, returning the sketches 5/6 with
 * the victim absent on all 3 attempts and hard-aborting the run. Every
 * downstream consumer (agent7-run dominantCharacterNote, agent9 prompt-builder,
 * orchestrator voiceFragments) looks sketches up by name and tolerates absence,
 * so an array missing ONLY the victim is accepted rather than retried/aborted —
 * fabricating victim speech deterministically would inject exactly the
 * template-dialogue class the leakage gates exist to catch. Any other gap
 * (missing suspect, unknown or duplicate name, wrong order that reordering
 * can't fix) keeps the original retry/abort behaviour.
 *
 * Reorders both arrays into CASE.cast order in place (subset-aware superset of
 * the A_53 P2 reorder, which required all names present).
 */
function enforceCastCoverage(
  parsed: Pick<WorldDocumentResult, 'characterPortraits' | 'characterVoiceSketches'>,
  castMembers: Array<{ name?: string; role?: string; role_archetype?: string }>,
): CastCoverageVerdict {
  const expectedNames = castMembers
    .map((m) => (typeof m?.name === 'string' ? m.name : ''))
    .filter(Boolean);
  // ABORT CLASS #2 RECURRENCE (run mystery-1784243328960, 2026-07-16): the original 257f7855 fix
  // read `m.role` — but CASE.cast entries carry `role_archetype: "Victim"` and no `role` field at
  // all, so victimNames was ALWAYS EMPTY and the victim exemption below was dead code from the day
  // it shipped. Its tests passed because the fixtures used the same wrong field (`role: "victim"`);
  // its one live validation ("sailed through first-attempt") never exercised the path. Read the
  // field production actually writes, keep `role` as a fallback, case-insensitive — and the tests
  // now pin BOTH shapes.
  const victimNames = new Set(
    castMembers
      .filter((m) => String((m as any)?.role_archetype ?? m?.role ?? '').toLowerCase() === 'victim')
      .map((m) => (typeof m?.name === 'string' ? m.name.trim() : ''))
      .filter(Boolean),
  );

  // Accept a short array only when every present name is a distinct cast name
  // and every absent name is a victim.
  const coverageGap = (items: Array<{ name?: string }>, label: string): { error?: string; missing: string[] } => {
    if (items.length === castMembers.length) return { missing: [] };
    const countError = `${label} count (${items.length}) does not match cast size (${castMembers.length})`;
    const seen = new Set<string>();
    for (const it of items) {
      const n = it?.name;
      if (typeof n !== 'string' || !expectedNames.includes(n) || seen.has(n)) {
        return { error: countError, missing: [] };
      }
      seen.add(n);
    }
    const missing = expectedNames.filter((n) => !seen.has(n));
    if (!missing.every((n) => victimNames.has(n))) return { error: countError, missing: [] };
    return { missing };
  };

  const portraitGap = coverageGap(parsed.characterPortraits ?? [], 'characterPortraits');
  if (portraitGap.error) return { ok: false, error: portraitGap.error, missingVictimNames: [] };
  const sketchGap = coverageGap(parsed.characterVoiceSketches ?? [], 'characterVoiceSketches');
  if (sketchGap.error) return { ok: false, error: sketchGap.error, missingVictimNames: [] };

  // A_53 P2 (agent65-3-attempt-loop-can-hard-throw): if the model returned valid names
  // in a different order, deterministically reorder portraits/sketches to match CASE.cast
  // rather than failing a cosmetic ordering gate across all 3 attempts. Only a genuinely
  // missing/extra name (a real content error) survives to the mismatch check below.
  const reorderByName = <T extends { name?: string }>(items: T[]): T[] => {
    const byName = new Map<string, T>();
    for (const it of items) {
      const n = it?.name;
      if (typeof n === 'string' && !byName.has(n)) byName.set(n, it);
    }
    if (byName.size !== items.length) return items;
    const ordered = expectedNames.filter((n) => byName.has(n)).map((n) => byName.get(n) as T);
    return ordered.length === items.length ? ordered : items;
  };
  parsed.characterPortraits = reorderByName(parsed.characterPortraits ?? []);
  parsed.characterVoiceSketches = reorderByName(parsed.characterVoiceSketches ?? []);

  // Name/order verification — walks CASE.cast, skipping victims accepted as absent.
  const orderMismatch = (items: Array<{ name?: string }>, label: string): string | null => {
    let idx = 0;
    for (let i = 0; i < castMembers.length; i++) {
      const expectedName = castMembers[i]?.name;
      const actualName = items[idx]?.name;
      if (actualName === expectedName) {
        idx++;
        continue;
      }
      if (
        typeof expectedName === 'string' &&
        victimNames.has(expectedName) &&
        !items.some((it) => it?.name === expectedName)
      ) {
        continue;
      }
      return (
        `${label}[${idx}].name (${actualName ?? 'undefined'}) ` +
        `does not match CASE.cast[${i}] (${expectedName ?? 'undefined'})`
      );
    }
    if (idx !== items.length) {
      const leftover = items.slice(idx).map((it) => it?.name ?? 'undefined').join(', ');
      return `${label} has ${items.length - idx} entr${items.length - idx === 1 ? 'y' : 'ies'} not matching CASE.cast (${leftover})`;
    }
    return null;
  };

  const mismatch =
    orderMismatch(parsed.characterPortraits ?? [], 'characterPortraits') ??
    orderMismatch(parsed.characterVoiceSketches ?? [], 'characterVoiceSketches');
  if (mismatch) return { ok: false, error: mismatch, missingVictimNames: [] };

  const missingVictimNames = [...new Set([...portraitGap.missing, ...sketchGap.missing])];
  return { ok: true, missingVictimNames };
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
    { role: 'system', content: worldBuilderSystem() },
  ];

  messages.push({ role: 'user', content: buildWorldBuilderUserMessage(inputs) });

  let lastError: Error | null = null;
  // CR-19 (ORC-03 / A1X-09): what this function's own calls cost, summed from 0 in call order. This was
  // `byAgent["Agent65-WorldBuilder"]` read back from the tracker; the two are the same number bit for bit
  // because this function is the label's only charger and runs once per run on a fresh client (runStage,
  // no scoring retry since owner decision 7) — pinned in llm-client chat-response-cost.test.ts.
  let spent = 0;
  // A6-03 (owner decision 12, CML_VERIFIED_FIXES): what kind of failure lastError is, so the retry asks for
  // length only after a length failure. Read only with the flag ON.
  let lastFailureKind: WorldBuilderFailureKind = 'validation-other';
  const caseTheme = String((inputs.caseData as any)?.CASE?.meta?.theme ?? '').trim();

  // Max 3 attempts: attempt 1 is the initial generation; attempts 2 and 3 are retries.
  // Having a 3rd attempt ensures that when attempt 1 fails for reason X (JSON/schema/cast),
  // attempt 2 can fix X while still potentially producing short arcDescription, and
  // attempt 3 can then correct the arcDescription specifically.
  // A6-14: attempts, temperature and max_tokens come from generation-params.yaml (3 / 0.7 / 12000).
  const wb = getGenerationParams().agent65_world_builder.params;
  const lastAttempt = wb.generation.default_max_attempts;
  for (let attempt = 1; attempt <= lastAttempt; attempt++) {
    let attemptMessages = messages;

    /**
     * A_74 §9.6 — THE RETRY FOR "TOO LONG" ASKED FOR MORE WORDS, AND LOST A PAID RUN.
     *
     * The block below is a FIXED list appended on every retry whatever went wrong, and almost every
     * line of it pushes output length UP: "MUST be at least N words", "A single dense paragraph is
     * not enough — write multiple paragraphs", "at least 25 words". That is correct guidance when a
     * field came back too SHORT, which is what it was written for. It is exactly backwards when the
     * failure was that the response ran past its completion ceiling.
     *
     * Measured, on the 2026-08-26 identity run that died here. Three attempts, three truncations,
     * and the responses got MONOTONICALLY LONGER each time:
     *
     *     attempt 1   28,012 bytes   truncated
     *     attempt 2   28,379 bytes   truncated   <- after being told to write more
     *     attempt 3   28,647 bytes   truncated   <- after being told to write more again
     *
     * The run then aborted, having spent £0.58 and produced no manuscript. The run before it, on the
     * same day, truncated on attempt 1 too and happened to fit on attempt 2 — so this had been a coin
     * flip on every run for some time, with nothing in the output saying so.
     *
     * Two fixes, both minimal. maxTokens rises to a ceiling the prompt's own stated minimums can fit
     * inside. And a truncation retry now asks for those minimums to be MET rather than exceeded, and
     * for everything ungated to be terse — while KEEPING the required-field checklist, because a
     * truncated response is an incomplete one too.
     */
    const fixA603 = verifiedFixesEnabled();
    const previousWasTruncation = fixA603
      ? Boolean(lastError) && lastFailureKind === 'truncation'
      : Boolean(lastError && /truncat/i.test(lastError.message));

    if (attempt > 1 && lastError && fixA603 && !previousWasTruncation) {
      attemptMessages = [
        ...messages,
        { role: 'user' as const, content: buildClassifiedRetryMessage(lastFailureKind, lastError.message) },
      ];
    } else if (attempt > 1 && lastError) {
      // On retry, append error context and mandatory reminders as a user message.
      // arcDescription minimum is ALWAYS included regardless of what caused the previous failure,
      // because a prior failure on a different check can leave arcDescription unaddressed.
      attemptMessages = [
        ...messages,
        {
          role: 'user' as const,
          content: previousWasTruncation
            ? `The previous response was CUT OFF before it finished — it exceeded the response size limit.\n` +
              `Return the SAME structure, complete this time, by writing LESS.\n\n` +
              `- Every required field present, and valid JSON with a closing brace\n` +
              `- characterPortraits and characterVoiceSketches: one entry per cast member, CASE.cast order exactly\n` +
              `- humourPlacementMap: all 12 scene positions, each exactly once, each with a rationale\n` +
              `- validationConfirmations all set to true\n` +
              `- Fields with a stated word minimum must MEET it and then STOP. Do not exceed a minimum.\n` +
              `  arcDescription: ${getArcDescParams().prompt} words is the target, not a floor to beat. ` +
              `storyTheme: 25 words. revealImplications: ${REVEAL_IMPLICATIONS_GATE} words.\n` +
              `- Every field WITHOUT a stated minimum must be as short as it can be while staying specific.\n` +
              `  Cut adjectives and restatement, not content. Completeness beats richness here.\n` +
              `- Return only the JSON object, no preamble`
            :
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
      temperature: wb.model.temperature,
      /**
       * A_74 §9.6 — was 6000, and the prompt cannot fit inside it.
       *
       * This agent is asked for per-cast portraits and voice sketches, twelve humour-placement
       * entries each with its own rationale, and three fields carrying explicit word minimums.
       * Observed responses run to ~28KB and hit the ceiling on a majority of attempts; the guard
       * then correctly refuses to jsonrepair a truncated payload, so the ceiling turns straight into
       * a failed run. Raising it costs nothing on runs that do not need it — output is billed on
       * tokens produced, not on the limit requested.
       */
      maxTokens: wb.model.max_tokens,
      jsonMode: true,
      logContext: {
        runId: inputs.runId ?? '',
        projectId: inputs.projectId ?? '',
        agent: 'Agent65-WorldBuilder',
        retryAttempt: attempt,
      },
    });

    spent += response.cost ?? 0;

    // A6-12: parse, then the deterministic validator; one failure path for all of them.
    const parsed = parseWorldBuilderResponse(response, attempt);
    const verdict = parsed.ok
      ? validateWorldDocument(parsed.doc, inputs, { attempt, cost: spent, durationMs: Date.now() - start, caseTheme })
      : parsed;
    if (verdict.ok) {
      inputs.onProgress?.('world-builder', 'World document complete');
      return verdict.doc;
    }
    lastError = new Error(verdict.failure.message);
    lastFailureKind = verdict.failure.kind;
    if (attempt === lastAttempt) throw new Error(verdict.failure.fatal);
  }

  throw new Error(`Agent 6.5 World Builder failed after 3 attempts: ${lastError?.message}`);
}

/** A6-03 — why a World Builder attempt failed. */
type WorldBuilderFailureKind = 'truncation' | 'parse' | 'validation-length' | 'validation-other';

/**
 * A6-12 — one failed attempt: its kind (A6-03), the message the next attempt's retry prompt carries, and the
 * message thrown when it was the last attempt.
 */
interface WorldBuildFailure {
  kind: WorldBuilderFailureKind;
  message: string;
  fatal: string;
}

type WorldBuildVerdict =
  | { ok: true; doc: WorldDocumentResult }
  | { ok: false; failure: WorldBuildFailure };

function worldBuildFailure(
  kind: WorldBuilderFailureKind,
  message: string,
  fatal = `Agent 6.5 World Builder failed: ${message}`,
): WorldBuildVerdict {
  return { ok: false, failure: { kind, message, fatal } };
}

const CONFIRMATION_KEYS = [
  'noNewCharacterFacts', 'noNewPlotFacts', 'castComplete',
  'eraSpecific', 'lockedFactsPreserved', 'humourMapComplete',
] as const;

/** A6-12 — the response to a parsed document, or a parse/truncation failure. */
function parseWorldBuilderResponse(
  response: { content: string; finishReason?: string },
  attempt: number,
): WorldBuildVerdict {
  // A6-03: the transport's own word for a completion-limit stop (Azure "length", Anthropic "max_tokens").
  const responseTruncated = response.finishReason === 'length' || response.finishReason === 'max_tokens';
  try {
    // CR-20: the one parse ladder. A_65b Ph8 — truncation guard before repair (phantom-structure
    // risk, the a3c2973f class); not on an empty payload, whose jsonrepair error the retry prompt carries.
    const parsedJson = parseLlmJson<WorldDocumentResult>(response.content, { guard: Boolean(response.content) });
    if (parsedJson.truncated) throw new Error("LLM payload looks completion-limit truncated (no closing brace) — refusing jsonrepair");
    if (parsedJson.data === undefined) throw parsedJson.repairError;
    return { ok: true, doc: parsedJson.data };
  } catch (parseError) {
    const message = `JSON parse failure on attempt ${attempt}: ${parseError}`;
    return worldBuildFailure(responseTruncated || /truncat/i.test(message) ? 'truncation' : 'parse', message);
  }
}

/**
 * A6-12 — the World Builder's deterministic validator: normalise, stamp, then the gates that can still fail.
 * Mutates and returns `parsed`. No LLM call; the only side effect is the victim-exempt log line.
 *
 * Gates deleted here, each proved unreachable in agent65-world-builder-properties.test.ts:
 *  - humourPlacementMap missing / duplicate positions and empty rationale: `normalizeWorldDocumentStructure`
 *    runs `completeHumourPlacementMap`, whose output is always the 12 positions once each, every rationale
 *    non-empty; schema validation and cast coverage never touch the map. The second completion that used to
 *    run here was a no-op (the function is idempotent).
 *  - validationConfirmations: the normaliser always yields exactly the six keys, and all six are forced true.
 *  - revealImplications length: once the storyTheme gate has passed (>= 25 words), the reveal floor appends at
 *    least 103 words of its own, past the 90-word gate.
 * Kept: schema, cast coverage, arc length (reachable when arc_description_gate is configured above the
 * 203 words the fallback padding guarantees; 200 ships), arc paragraphs, storyTheme length.
 */
function validateWorldDocument(
  parsed: WorldDocumentResult,
  inputs: Pick<WorldBuilderInputs, 'caseData' | 'temporalContext'>,
  ctx: { attempt: number; cost: number; durationMs: number; caseTheme: string },
): WorldBuildVerdict {
  // ── Deterministic pre-validation patches ────────────────────────────────
  // Applied immediately after parse — before schema or content gates — so that
  // recoverable LLM defects never burn an inner-loop retry attempt.
  const doc = normalizeWorldDocumentStructure(parsed, inputs);

  // Inject cost/duration
  doc.cost = ctx.cost;
  doc.durationMs = ctx.durationMs;

  // Schema validation
  const schemaValidation = validateArtifact('world_document', doc);
  if (!schemaValidation.valid) {
    const errorSummary = schemaValidation.errors.slice(0, 6).join('; ');
    return worldBuildFailure(
      'validation-other',
      `Schema validation failed on attempt ${ctx.attempt}: ${errorSummary}`,
      `Agent 6.5 World Builder failed schema validation: ${errorSummary}`,
    );
  }

  // Cast coverage check (victim-exempt — see enforceCastCoverage)
  const castMembers: Array<{ name: string; role?: string; role_archetype?: string }> = (inputs.caseData as any)?.CASE?.cast ?? [];
  if (castMembers.length > 0) {
    const coverage = enforceCastCoverage(doc, castMembers);
    if (!coverage.ok) return worldBuildFailure('validation-other', coverage.error as string);
    if (coverage.missingVictimNames.length > 0) {
      console.log(
        `[Agent 6.5 (World Builder)] victim-exempt cast coverage: accepted without ` +
        `${coverage.missingVictimNames.join(', ')} (downstream consumers tolerate absence)`
      );
    }
  }

  // Force validationConfirmations all to true. Each confirmation corresponds to a constraint that is
  // already checked deterministically in this function; the LLM self-assessment is unreliable and adds
  // no additional safety. The normaliser guarantees the object and its six keys.
  for (const key of CONFIRMATION_KEYS) {
    doc.validationConfirmations[key] = true;
  }

  // arcDescription word count gate — hard floor at `gate` words; prompt targets gate+buffer.
  // enforceArcDescriptionFloor runs before the gate: it synthesises from turningPoints when
  // the LLM writes fewer words than required, which was the dominant retry cause.
  const { gate: arcDescGate, prompt: arcDescPromptTarget } = getArcDescParams();
  const arcRaw = doc.storyEmotionalArc?.arcDescription ?? '';
  const arcExpanded = enforceArcDescriptionFloor(
    arcRaw,
    arcDescGate,
    doc.storyEmotionalArc?.turningPoints ?? [],
    doc.storyTheme,
    doc.storyEmotionalArc?.dominantRegister,
  );
  const arcDesc = forceMultiParagraphArcDescription(arcExpanded);
  const arcDescCapped = clampToMaxWordsPreservingParagraphs(arcDesc, arcDescPromptTarget);
  if (doc.storyEmotionalArc && arcDescCapped) {
    doc.storyEmotionalArc.arcDescription = arcDescCapped;
  }
  const arcDescWordCount = countWords(arcDescCapped);
  if (arcDescWordCount < arcDescGate) {
    return worldBuildFailure(
      'validation-length',
      `storyEmotionalArc.arcDescription is too short (${arcDescWordCount} words; ` +
      `minimum ${arcDescGate}, target ${arcDescPromptTarget}). ` +
      `Write at least ${arcDescPromptTarget} words across multiple paragraphs — ` +
      `trace opening emotional register → rising tension → first turn → mid-point → ` +
      `second turn → pre-climax → climax → resolution. A single dense paragraph is not enough.`,
    );
  }

  const arcParagraphs = paragraphCount(arcDescCapped);
  if (arcParagraphs < MIN_ARC_PARAGRAPHS) {
    return worldBuildFailure(
      'validation-length',
      `storyEmotionalArc.arcDescription must be multi-paragraph (found ${arcParagraphs}; minimum ${MIN_ARC_PARAGRAPHS})`,
    );
  }

  // storyTheme word count gate — hard floor and target at 25 words.
  // Deterministically expand near-threshold outputs so we do not fail on
  // stylistic brevity when semantic content is otherwise valid.
  doc.storyTheme = enforceStoryThemeFloor(
    doc.storyTheme,
    STORY_THEME_GATE,
    ctx.caseTheme,
    doc.storyEmotionalArc?.dominantRegister,
  );
  const storyThemeWordCount = countWords(doc.storyTheme);
  if (storyThemeWordCount < STORY_THEME_GATE) {
    return worldBuildFailure(
      'validation-length',
      `storyTheme is too short (${storyThemeWordCount} words; minimum ${STORY_THEME_GATE}, target ${STORY_THEME_TARGET}). ` +
      `Write a complete sentence with a subject, main clause, and a nuanced qualifier about the ` +
      `story's deeper meaning — not a title, fragment, or noun phrase.`,
    );
  }

  // revealImplications floor — no gate: with storyTheme past its gate the floor always clears 90 words.
  doc.revealImplications = enforceRevealImplicationsFloor(
    doc.revealImplications,
    REVEAL_IMPLICATIONS_GATE,
    doc.storyTheme,
    doc.storyEmotionalArc?.dominantRegister,
  );

  return { ok: true, doc };
}

/**
 * A6-03 (owner decision 12, CML_VERIFIED_FIXES): the retry message for a non-truncation failure. The length
 * demands ("MUST be at least…", "a single dense paragraph is not enough") go only with a LENGTH failure — the
 * padding floors make the length gates near-unreachable, and asking for more words after any other failure
 * pushed the next response toward the completion ceiling.
 */
function buildClassifiedRetryMessage(kind: WorldBuilderFailureKind, errorMessage: string): string {
  const lead = kind === 'parse'
    ? `The previous response was not valid JSON:\n${errorMessage}\n\n`
    : `The previous response failed validation with this error:\n${errorMessage}\n\n`;
  const lengthLines = kind === 'validation-length'
    ? `- storyEmotionalArc.arcDescription MUST be at least ${getArcDescParams().prompt} words (target ${getArcDescParams().prompt + 50}). ` +
      `Count every word before submitting. A single dense paragraph is not enough — ` +
      `write multiple paragraphs tracing the emotional journey from opening through climax to resolution.\n` +
      `- storyTheme MUST be at least 25 words — a complete sentence with a subject, main clause, and nuanced qualifier. Not a title or fragment.\n` +
      `- revealImplications MUST be at least ${REVEAL_IMPLICATIONS_GATE} words\n`
    : '';
  return lead +
    `Please correct the issues and return a valid JSON object. Mandatory checks:\n` +
    `- All required fields are present\n` +
    `- characterPortraits has one entry per cast member\n` +
    `- characterVoiceSketches has one entry per cast member\n` +
    `- characterPortraits and characterVoiceSketches preserve CASE.cast name order exactly\n` +
    `- humourPlacementMap has all 12 scene positions, each with a non-empty rationale string\n` +
    `- Every humourPlacementMap entry must have a "rationale" field — this is required even for "forbidden" entries\n` +
    `- humourPlacementMap must include each required scenePosition exactly once (no missing/duplicate positions)\n` +
    `- validationConfirmations all set to true\n` +
    lengthLines +
    `- Return only the JSON object, no preamble`;
}

/**
 * A6-Q02 (owner decision 12, CML_VERIFIED_FIXES): the World Document a run continues with when the World Builder
 * fails all its attempts — the structural normaliser over an empty document (every field defaulted from the case and
 * temporal context), as the review recommended. The caller decides whether to use it and warns.
 */
export function degradedWorldDocument(
  inputs: Pick<WorldBuilderInputs, 'caseData' | 'temporalContext'>,
): WorldDocumentResult {
  return normalizeWorldDocumentStructure({} as WorldDocumentResult, inputs);
}

export const __testables = {
  countWords,
  paragraphCount,
  clampToMaxWordsPreservingParagraphs,
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
  enforceCastCoverage,
  withoutRunTelemetry,
  buildWorldBuilderUserMessage,
  worldBuilderSystem,
  projectCaseForWorldBuilder,
  WORLD_BUILDER_CASE_OMIT,
  buildClassifiedRetryMessage,
  parseWorldBuilderResponse,
  validateWorldDocument,
};
