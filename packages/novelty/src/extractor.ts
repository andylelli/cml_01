/**
 * LLM skeleton-extractor (Agent 8 redesign §9.1-spike-2). Converts a finished CML into the abstract
 * 5-field `Skeleton` the structural judge compares — including the two fields a deterministic mapping
 * provably CANNOT produce (`false_assumption_pattern` + `inference_shape` are hand-authored snake_case
 * abstractions, e.g. "time_of_symptom=time_of_act"; the verdict logic gates on them, so a keyword
 * skeleton scores `distinct` for every input). This module is pure: it builds the prompt + parses the
 * response behind a `ChatFn` seam (mirrors `@cml/rubric-score`'s judge), so the package takes no LLM
 * dependency. The caller supplies the chat function and runs it SHADOW (log the verdict, never gate).
 */

import type { Axis, DiscriminatingTestShape, MechanismFamily, Skeleton } from "./types.js";
import { loadSeedFingerprints } from "./loader.js";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}
export interface ChatArgs {
  messages: ChatMessage[];
  temperature?: number;
  maxTokens?: number;
  jsonMode?: boolean;
  model?: string;
}
/** Minimal chat contract (the worker wraps AzureOpenAIClient.chat into this). */
export type ChatFn = (args: ChatArgs) => Promise<{ content: string }>;

const AXES: readonly Axis[] = ["temporal", "spatial", "identity", "epistemic", "behavioral", "authority"];
const MECHANISM_FAMILIES: readonly MechanismFamily[] = [
  "locked_room_key", "locked_room_timing", "alibi_fabrication", "impersonation", "substituted_body",
  "poison_delayed", "poison_substitution", "staged_scene", "unconscious_act", "disguised_natural_agent",
  "hidden_accomplice", "information_leak", "recorded_presence", "secret_will_inheritance",
];
const TEST_SHAPES: readonly DiscriminatingTestShape[] = [
  "physical_trace", "timetable_contradiction", "behavioral_tell", "identity_disambiguation",
  "reconstruction", "chemical_timing",
];

const str = (v: unknown): string => (typeof v === "string" ? v.trim() : "");
const unwrapCase = (cml: unknown): Record<string, any> => ((cml as any)?.CASE ?? cml ?? {}) as Record<string, any>;

/** Normalise a free label into the corpus's snake_case style so the judge's `norm` (trim+lowercase) can match. */
const toSnakeLabel = (v: unknown): string =>
  String(v ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9=]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, 64);

const clampEnum = <T extends string>(v: unknown, allowed: readonly T[], fallback: T): T => {
  const k = String(v ?? "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
  return (allowed as readonly string[]).includes(k) ? (k as T) : fallback;
};

/** A handful of real corpus fingerprints, so the model matches the abstraction level + label style. */
function fewShotExamples(): string {
  let seeds: ReturnType<typeof loadSeedFingerprints> = [];
  try {
    seeds = loadSeedFingerprints();
  } catch {
    seeds = [];
  }
  const pick = seeds.slice(0, 6).map((f) => ({
    axis: f.axis,
    mechanism_family: f.mechanism_family,
    false_assumption_pattern: f.false_assumption_pattern,
    discriminating_test_shape: f.discriminating_test_shape,
    inference_shape: f.inference_shape,
  }));
  if (pick.length === 0) {
    // Fallback exemplars (kept in sync with seed-fingerprints.yaml) if the corpus file is unavailable.
    return JSON.stringify([
      { axis: "temporal", mechanism_family: "poison_delayed", false_assumption_pattern: "time_of_symptom=time_of_act", discriminating_test_shape: "chemical_timing", inference_shape: "decouple_act_from_symptom" },
      { axis: "spatial", mechanism_family: "locked_room_timing", false_assumption_pattern: "the_body_died_before_the_room_opened", discriminating_test_shape: "timetable_contradiction", inference_shape: "reframe_access_at_discovery" },
    ], null, 0);
  }
  return JSON.stringify(pick, null, 0);
}

/** Build the chat messages that ask the model for the abstract structural fingerprint of this CML. */
export function buildSkeletonExtractionMessages(cml: unknown): ChatMessage[] {
  const c = unwrapCase(cml);
  const fields = {
    mechanism: str(c?.hidden_model?.mechanism?.description) || str(c?.mechanism?.description),
    false_assumption_type: str(c?.false_assumption?.type),
    false_assumption_statement: str(c?.false_assumption?.statement),
    discriminating_test_method: str(c?.discriminating_test?.method),
    discriminating_test_design: str(c?.discriminating_test?.design),
    inference: str(c?.inference_path?.summary) || str(c?.solution_path?.summary) || str(c?.discriminating_test?.design),
    premise: str(c?.surface_model?.narrative?.summary) || str(c?.meta?.logline),
  };

  const system =
    "You extract the ABSTRACT STRUCTURAL FINGERPRINT of a detective mystery — its structure, not its " +
    "surface. Two mysteries that share zero names, places, or props can be the same trick; that sameness " +
    "is what you capture. Respond with STRICT JSON and EXACTLY these five keys:\n" +
    `- "axis": one of ${JSON.stringify(AXES)}\n` +
    `- "mechanism_family": one of ${JSON.stringify(MECHANISM_FAMILIES)}\n` +
    `- "false_assumption_pattern": a SHORT snake_case label for the WRONG BELIEF the reader is led to hold ` +
    `(abstract, surface-free, e.g. "time_of_symptom=time_of_act", "the_body_died_before_the_room_opened")\n` +
    `- "discriminating_test_shape": one of ${JSON.stringify(TEST_SHAPES)}\n` +
    `- "inference_shape": a SHORT snake_case label for the DEDUCTIVE MOVE that cracks it ` +
    `(e.g. "decouple_act_from_symptom", "reframe_access_at_discovery")\n\n` +
    "Match the abstraction level and snake_case style of these reference fingerprints:\n" +
    fewShotExamples() +
    "\nOutput ONLY the JSON object.";

  const user =
    "CML structural fields (use these to abstract the trick — do not copy surface nouns into the labels):\n" +
    `mechanism: ${fields.mechanism || "(none)"}\n` +
    `false_assumption.type: ${fields.false_assumption_type || "(none)"}\n` +
    `false_assumption.statement: ${fields.false_assumption_statement || "(none)"}\n` +
    `discriminating_test.method: ${fields.discriminating_test_method || "(none)"}\n` +
    `discriminating_test.design: ${fields.discriminating_test_design || "(none)"}\n` +
    `inference: ${fields.inference || "(none)"}\n` +
    `premise: ${fields.premise || "(none)"}\n\n` +
    "Return the JSON fingerprint.";

  return [
    { role: "system", content: system },
    { role: "user", content: user },
  ];
}

function stripFences(s: string): string {
  const m = /```(?:json)?\s*([\s\S]*?)```/.exec(s);
  return (m ? m[1] : s).trim();
}

/** Parse a model response into a valid `Skeleton`, clamping enums and snake-casing the two label fields. */
export function parseSkeletonResponse(content: string, id?: string): Skeleton {
  const obj = JSON.parse(stripFences(content)) as Record<string, unknown>;
  const premise = str(obj.premise) || undefined;
  return {
    id,
    axis: clampEnum<Axis>(obj.axis, AXES, "behavioral"),
    mechanism_family: clampEnum<MechanismFamily>(obj.mechanism_family, MECHANISM_FAMILIES, "staged_scene"),
    false_assumption_pattern: toSnakeLabel(obj.false_assumption_pattern),
    discriminating_test_shape: clampEnum<DiscriminatingTestShape>(obj.discriminating_test_shape, TEST_SHAPES, "physical_trace"),
    inference_shape: toSnakeLabel(obj.inference_shape),
    ...(premise ? { premise } : {}),
  };
}

export interface SkeletonExtractorOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

/** Wrap a `ChatFn` into `(cml, id) => Promise<Skeleton>` — the worker supplies the chat function. */
export function createSkeletonExtractor(chat: ChatFn, opts: SkeletonExtractorOptions = {}) {
  return async (cml: unknown, id?: string): Promise<Skeleton> => {
    const res = await chat({
      messages: buildSkeletonExtractionMessages(cml),
      temperature: opts.temperature ?? 0.1,
      maxTokens: opts.maxTokens ?? 600,
      jsonMode: true,
      model: opts.model,
    });
    return parseSkeletonResponse(res.content, id);
  };
}
