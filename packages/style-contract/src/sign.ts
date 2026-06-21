/**
 * Style-contract signing (Agent 6.5 redesign §4.1) — the deterministic, no-LLM core of "sign the
 * contract once, at grounding."
 *
 * `deriveStyleContract(spec)` takes the user's explicit choices (enums) and, where the user is
 * silent, derives sensible defaults from the free-text premise/theme/era. The result is a frozen,
 * schema-valid `StyleContract` that — in the full redesign — threads into Agents 2/2b/2c/7/9 so cast
 * mannerisms and location moods are authored *in voice* instead of retrofitted at step 90.
 *
 * The §4.1 thesis "most of it is a choice, not a generation" is exactly why this is deterministic:
 * register / distance / humour / diction are enums, not prose. Only the `exemplars` (gold passages)
 * need a model, and those are the gated live phase (§4.2) — left empty here.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import yaml from "js-yaml";
import { Ajv, type ValidateFunction } from "ajv";
import type {
  Diction,
  NarrativeDistance,
  Register,
  SentenceRhythm,
  StyleContract,
  StyleSpec,
} from "./types.js";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const schemaPath = (): string =>
  path.resolve(HERE, "..", "..", "..", "schema", "style_contract.schema.yaml");

const ajv = new Ajv({ allErrors: true, strict: false });
let validator: ValidateFunction | undefined;

const getValidator = (): ValidateFunction => {
  if (validator) return validator;
  const schema = yaml.load(fs.readFileSync(schemaPath(), "utf8")) as Record<string, unknown>;
  validator = ajv.compile(schema);
  return validator;
};

/** Validate arbitrary data against the style-contract schema. */
export const validateStyleContract = (data: unknown): boolean => getValidator()(data) as boolean;

/** Validate, throwing a readable error with the ajv detail. */
export function assertStyleContract(data: unknown): asserts data is StyleContract {
  const validate = getValidator();
  if (!validate(data)) {
    const detail = (validate.errors ?? [])
      .map((e) => `  ${e.instancePath || "/"} ${e.message ?? ""}`.trimEnd())
      .join("\n");
    throw new Error(`Style contract failed schema:\n${detail}`);
  }
}

// ── deterministic derivation rules ───────────────────────────────────────────

function deriveRegister(text: string): Register {
  if (/\b(wry|comic|comedy|farce|farcical|humou?r|humorous|witty|light-hearted|romp)\b/.test(text)) return "wry-comic";
  if (/\b(cozy|cosy|village|gentle|charming|quaint|tea|vicarage)\b/.test(text)) return "cozy";
  if (/\b(hardboiled|hard-boiled|gumshoe|pulp|mean streets|private eye)\b/.test(text)) return "hardboiled";
  if (/\b(noir|doomed|femme fatale|fatalistic|shadowed)\b/.test(text)) return "noir";
  if (/\b(psychological|dread|unease|paranoia|paranoid|obsess|interior|menace)\b/.test(text)) return "psychological";
  if (/\b(gothic|haunt|haunted|decay|crumbling|moor|ruin|spectral)\b/.test(text)) return "gothic";
  return "classical-fair-play";
}

function deriveDistance(text: string): NarrativeDistance {
  if (/\b(first[- ]person|i-narrator|told by|in my)\b/.test(text)) return "first-person";
  if (/\b(omniscient|god'?s-eye|panoramic|all-seeing)\b/.test(text)) return "omniscient";
  return "close-third";
}

function deriveHumour(text: string, register: Register): number {
  if (/\b(no humou?r|grim|bleak|no levity|solemn|humourless|austere)\b/.test(text)) return 0;
  if (/\b(farce|farcical|hilarious|very funny|uproarious|romp)\b/.test(text)) return 3;
  const byRegister: Record<Register, number> = {
    "wry-comic": 2,
    cozy: 1,
    gothic: 1,
    "classical-fair-play": 1,
    psychological: 0,
    noir: 0,
    hardboiled: 0,
  };
  return byRegister[register];
}

function deriveDiction(text: string, decade?: number): Diction {
  if (/\b(ornate|baroque|lush|purple|florid|rococo)\b/.test(text)) return "ornate";
  if (/\b(plain|spare|terse|lean|stripped|unadorned)\b/.test(text)) return "plain";
  if (decade != null && decade < 1960) return "period-formal";
  return "period-formal";
}

function deriveRhythm(text: string, register: Register): SentenceRhythm {
  if (/\b(clipped|terse|staccato|punchy)\b/.test(text)) return "clipped";
  if (/\b(periodic|flowing|long sentences|sinuous|languid)\b/.test(text)) return "periodic";
  if (register === "hardboiled" || register === "noir") return "clipped";
  if (register === "psychological" || register === "gothic") return "periodic";
  return "varied";
}

function baseForbiddenDevices(register: Register, text: string): string[] {
  const out = new Set<string>(["modern idiom", "anachronism"]);
  const bloodless = /\b(no gore|no graphic|bloodless|gentle|cozy|cosy)\b/.test(text);
  if (bloodless || register === "cozy" || register === "classical-fair-play" || register === "wry-comic") {
    out.add("gore");
    out.add("graphic violence");
  }
  if (register === "classical-fair-play" || register === "wry-comic") out.add("head-hopping");
  return [...out];
}

/**
 * Sign a Style Contract deterministically from the spec. User-supplied enums win; everything else is
 * derived from the premise/theme/era. Pure: the same spec always yields an identical contract.
 */
export function deriveStyleContract(spec: StyleSpec): StyleContract {
  const text = `${spec.premise ?? ""} ${spec.theme ?? ""}`.toLowerCase();
  const derivedDefaults: string[] = [];

  const pick = <T>(field: string, supplied: T | undefined, derive: () => T): T => {
    if (supplied !== undefined) return supplied;
    derivedDefaults.push(field);
    return derive();
  };

  const register = pick("register", spec.register, () => deriveRegister(text));
  const narrativeDistance = pick("narrativeDistance", spec.narrativeDistance, () => deriveDistance(text));
  const humourTolerance = pick("humourTolerance", spec.humourTolerance, () => deriveHumour(text, register));
  const diction = pick("diction", spec.diction, () => deriveDiction(text, spec.decade));
  const sentenceRhythm = pick("sentenceRhythm", spec.sentenceRhythm, () => deriveRhythm(text, register));

  // forbiddenDevices always merges the register-derived base with any user additions (de-duped, sorted).
  const forbiddenDevices = [...new Set([...baseForbiddenDevices(register, text), ...(spec.forbiddenDevices ?? [])])].sort();

  return {
    register,
    comparables: spec.comparables ? [...spec.comparables] : [],
    narrativeDistance,
    humourTolerance,
    proseConstraints: { sentenceRhythm, forbiddenDevices, diction },
    exemplars: [], // gold-passage generation is the gated live phase (§4.2)
    derivedDefaults,
  };
}
