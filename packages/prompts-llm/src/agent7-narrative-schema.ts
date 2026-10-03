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

import { readBooleanFlag } from "@cml/cml";
import type { FromSchema } from "json-schema-to-ts";
import { GOLDEN_AGE_BEATS } from "./constants/golden-age-beats.js";
// Type-only (erased): agent7-narrative.js imports this module, so a value import would be a cycle.
import type { ActStructure, NarrativeOutline, Scene } from "./agent7-narrative.js";

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

// ── A7-10 (owner decision, 2026-10-02): the outline TYPE derived from the schema ──────────────────────
//
// `json-schema-to-ts` (`FromSchema`, type-only — erased at runtime; ajv stays the boundary parser) turns
// the `as const` schema above into the type the model's reply has, so the schema and the TypeScript type
// cannot drift apart unseen. The hand-written `NarrativeOutline` (agent7-narrative.ts) is kept: it is
// what the pipeline reads after `formatNarrative`, and it adds `cost`, `durationMs`, `truncationWarning`.
//
// The check below compares the two where they overlap, after one normalisation the schema forces on
// itself (Azure: every property `required`, optionality written as `| null`): null and undefined are
// both read as "absent", and every key as present. What still differs is pinned, by key, in
// `Agent7SchemaKnownMismatches`; a NEW disagreement — or a fixed one — fails the compile.

export type NarrativeOutlineFromSchema = FromSchema<typeof NARRATIVE_OUTLINE_SCHEMA>;
export type ActFromSchema = NarrativeOutlineFromSchema["acts"][number];
export type SceneFromSchema = ActFromSchema["scenes"][number];

type Absent = null | undefined;
type DeepPresent<T> = T extends readonly (infer U)[]
  ? DeepPresent<Exclude<U, Absent>>[]
  : T extends object
    ? { [K in keyof T]-?: DeepPresent<Exclude<T[K], Absent>> }
    : T;
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
/** The keys both types declare whose (deep, absent-normalised) value types differ. */
type DisagreeingKeys<S, H> = {
  [K in keyof S & keyof H]: Same<DeepPresent<Exclude<S[K], Absent>>, DeepPresent<Exclude<H[K], Absent>>> extends true
    ? never
    : K;
}[keyof S & keyof H];

/**
 * MEASURED 2026-10-02 by this check (reported, not fixed — runtime code unchanged), with a known
 * positive (a planted wrong pin, `act: 4`, and a bad beat each fail the compile):
 *   scene / act / outline — no value-type disagreement beyond the normalisation (nullable-vs-optional is
 *   the schema's Azure rule); no key only one side declares, except the three the pipeline adds locally
 *   to the outline (`cost`, `durationMs`, `truncationWarning`).
 * Edit this when the check fails, and say in the commit which side moved.
 */
export interface Agent7SchemaKnownMismatches {
  scene: never;
  act: never;
  outline: never;
  /** Keys only the hand-written type has (added after the reply is parsed). */
  outlineHandOnly: "cost" | "durationMs" | "truncationWarning";
}
/** Keys either side declares that the other does not. */
type OneSidedKeys<S, H> = Exclude<keyof S, keyof H> | Exclude<keyof H, keyof S>;

type Pin<Actual, Expected> = Same<Actual, Expected> extends true ? true : { mismatch: Actual; pinned: Expected };
/** Type-level only: nothing here is emitted, so the module's runtime is unchanged. */
type Assert<T extends true> = T;
type _a7SchemaSceneAgrees = Assert<Pin<DisagreeingKeys<SceneFromSchema, Scene>, Agent7SchemaKnownMismatches["scene"]>>;
type _a7SchemaActAgrees = Assert<Pin<DisagreeingKeys<ActFromSchema, ActStructure>, Agent7SchemaKnownMismatches["act"]>>;
type _a7SchemaOutlineAgrees = Assert<
  Pin<DisagreeingKeys<NarrativeOutlineFromSchema, NarrativeOutline>, Agent7SchemaKnownMismatches["outline"]>
>;
type _a7SchemaSceneKeys = Assert<Pin<OneSidedKeys<SceneFromSchema, Scene>, never>>;
type _a7SchemaActKeys = Assert<Pin<OneSidedKeys<ActFromSchema, ActStructure>, never>>;
type _a7SchemaOutlineKeys = Assert<
  Pin<OneSidedKeys<NarrativeOutlineFromSchema, NarrativeOutline>, Agent7SchemaKnownMismatches["outlineHandOnly"]>
>;

/**
 * Runtime getter — never a module const (`module-const-flags-frozen-before-dotenv`: a const is
 * frozen before dotenv loads, so the flag silently never fires). Default OFF per the corpus regime.
 */
export const isAgent7StructuredOutputEnabled = (env: NodeJS.ProcessEnv = process.env): boolean =>
  readBooleanFlag("AGENT7_STRUCTURED_OUTPUT", false, env);
