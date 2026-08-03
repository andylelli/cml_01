/**
 * R4 (architecture/REVIEW_01.md) — the Agent 7 narrative-outline JSON Schema.
 *
 * WHY AGENT 7 FIRST. It has the worst shape-drift history in the pipeline: `coerceNarrativeSceneBeats`
 * (the beat enum arriving as free text), `hoistMisplacedSceneFields` (the LLM burying `purpose`,
 * `summary` and `characters` INSIDE `setting`, which hard-aborted run a9c1e346), and a retry path
 * that skipped coercion entirely. It is also upstream of Agent 9, so a fix propagates — and unlike a
 * prose stage its output can be verified deterministically, with no external read.
 *
 * HOW THIS KILLS THE CLASS. `additionalProperties: false` on `setting` makes "scene fields nested
 * under setting" structurally unrepresentable: the model cannot emit it, rather than emitting it and
 * relying on us to notice. The `beat` enum is enforced at token level instead of synonym-mapped
 * afterwards.
 *
 * AZURE'S SCHEMA SUBSET — the constraints this file is written to satisfy:
 *   - every object carries `additionalProperties: false`
 *   - EVERY property appears in `required`; optionality is expressed as a nullable type
 *     (`["string", "null"]`), never by omission from `required`
 *   - no recursive `$ref`
 *   - no `minLength` / `maximum` / `pattern` constraints — those stay in the validators
 *
 * Imports the beat list from constants/ — NOT from agent7-narrative.js, which would be a cycle.
 *
 * The nullable-instead-of-optional rule is why this schema looks more verbose than the TypeScript
 * interface it mirrors. Do not "tidy" it by dropping fields from `required`: Azure rejects the
 * request, and a rejected request is a failed run.
 */

import { GOLDEN_AGE_BEATS } from "./constants/golden-age-beats.js";

const stringArray = { type: "array", items: { type: "string" } } as const;

/** Scene setting — the object the misplaced-field bug nested everything else inside. */
const settingSchema = {
  type: "object",
  properties: {
    location: { type: "string" },
    timeOfDay: { type: "string" },
    atmosphere: { type: "string" },
  },
  required: ["location", "timeOfDay", "atmosphere"],
  // Load-bearing: this single line is what makes the A_67 hoist bug impossible to express.
  additionalProperties: false,
} as const;

const dramaticElementsSchema = {
  type: "object",
  properties: {
    conflict: { type: ["string", "null"] },
    tension: { type: ["string", "null"] },
    revelation: { type: ["string", "null"] },
    misdirection: { type: ["string", "null"] },
    microMomentBeats: { type: ["array", "null"], items: { type: "string" } },
  },
  required: ["conflict", "tension", "revelation", "misdirection", "microMomentBeats"],
  additionalProperties: false,
} as const;

const sceneSchema = {
  type: "object",
  properties: {
    sceneNumber: { type: "integer" },
    act: { type: "integer", enum: [1, 2, 3] },
    title: { type: "string" },
    setting: settingSchema,
    characters: stringArray,
    purpose: { type: "string" },
    cluesRevealed: stringArray,
    dramaticElements: dramaticElementsSchema,
    summary: { type: "string" },
    estimatedWordCount: { type: "integer" },
    // Enforced at token level — replaces synonym-mapping the beat after the fact.
    beat: { type: ["string", "null"], enum: [...GOLDEN_AGE_BEATS, null] },
    pivotElement: { type: ["string", "null"] },
    factEstablished: { type: ["string", "null"] },
    permittedBehavioursByAct: {
      type: ["array", "null"],
      items: {
        type: "object",
        properties: { characterName: { type: "string" }, behaviour: { type: "string" } },
        required: ["characterName", "behaviour"],
        additionalProperties: false,
      },
    },
    redHerringPlacement: {
      type: ["object", "null"],
      properties: { redHerringId: { type: "string" }, placementDetail: { type: "string" } },
      required: ["redHerringId", "placementDetail"],
      additionalProperties: false,
    },
    mechanism_stage: { type: ["integer", "null"], enum: [1, 2, 3, 4, null] },
  },
  required: [
    "sceneNumber",
    "act",
    "title",
    "setting",
    "characters",
    "purpose",
    "cluesRevealed",
    "dramaticElements",
    "summary",
    "estimatedWordCount",
    "beat",
    "pivotElement",
    "factEstablished",
    "permittedBehavioursByAct",
    "redHerringPlacement",
    "mechanism_stage",
  ],
  additionalProperties: false,
} as const;

const actSchema = {
  type: "object",
  properties: {
    actNumber: { type: "integer", enum: [1, 2, 3] },
    title: { type: "string" },
    purpose: { type: "string" },
    scenes: { type: "array", items: sceneSchema },
    estimatedWordCount: { type: "integer" },
  },
  required: ["actNumber", "title", "purpose", "scenes", "estimatedWordCount"],
  additionalProperties: false,
} as const;

/** The full outline as returned by the model. `cost` and `durationMs` are added locally. */
export const NARRATIVE_OUTLINE_SCHEMA = {
  type: "object",
  properties: {
    acts: { type: "array", items: actSchema },
    totalScenes: { type: "integer" },
    estimatedTotalWords: { type: "integer" },
    pacingNotes: stringArray,
  },
  required: ["acts", "totalScenes", "estimatedTotalWords", "pacingNotes"],
  additionalProperties: false,
} as const;

export const NARRATIVE_OUTLINE_SCHEMA_NAME = "narrative_outline";

/**
 * Runtime getter — never a module const (`module-const-flags-frozen-before-dotenv`: a const is
 * frozen before dotenv loads, so the flag silently never fires). Default OFF per the corpus regime.
 */
export const isAgent7StructuredOutputEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  env.AGENT7_STRUCTURED_OUTPUT === "true" || env.AGENT7_STRUCTURED_OUTPUT === "1";
