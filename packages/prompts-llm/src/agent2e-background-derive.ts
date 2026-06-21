/**
 * Agent 2e: Background Context — Pure Deterministic Derivation
 *
 * OFFLINE-FIRST increment of the Agent 2e redesign
 * (see documentation/12_system_redesign/06_agent_2e_background_context.md §4, §9).
 *
 * The live Agent 2e is a ~1200-token LLM call that COPIES five of its seven output
 * fields verbatim from the Agent 1 (setting) and Agent 2 (cast) artifacts it is handed,
 * and contributes exactly ONE genuinely creative field — the `backdropSummary` sentence.
 *
 * This module proves the stage is deletable: a PURE, side-effect-free function that
 * reconstructs the DETERMINISTIC portion of the `BackgroundContextArtifact` from the
 * upstream artifacts alone. The one creative field (`backdropSummary`) is a passed-in
 * parameter — we do NOT invent an LLM call here.
 *
 * Field provenance (the load-bearing evidence the stage is deletable):
 *   - status               → constant "ok"
 *   - era.decade           ← setting.era.decade                 (verbatim copy)
 *   - era.socialStructure  ← setting.era.socialNorms.join("; ") (deterministic join, §4.2)
 *   - setting.location     ← setting.location.description        (verbatim copy)
 *   - setting.institution  ← setting.location.type              (verbatim copy)
 *   - setting.weather      ← setting.atmosphere.weather          (verbatim copy)
 *   - castAnchors          ← rankAnchors(cast)                   (deterministic ranking)
 *   - theme                ← inputs.theme                        (verbatim copy)
 *   - backdropSummary      ← CREATIVE — passed in (the only field the model authors)
 *
 * This file is ADDITIVE and DARK: it does not modify the live generator, the runner,
 * or the scorer, and it performs zero behavior change in the running pipeline.
 */

import type { SettingRefinement } from "./agent1-setting.js";
import type { CastDesign, CharacterProfile } from "./agent2-cast.js";
import type { BackgroundContextArtifact } from "./agent2e-background-context.js";

/**
 * Maximum number of cast anchors the derived artifact carries.
 * Matches the live Agent 2e prompt cap (`.slice(0, 8)` of cast names) at the *generation*
 * boundary, while §4.2/§9.1 of the redesign rank-and-cap the socially-central anchors at 6
 * for Agent 9 consumption. We keep the upper bound at 8 to remain a byte-identical drop-in
 * for the historical artifact shape (4–8 names per the schema), and rank within it.
 */
export const MAX_CAST_ANCHORS = 8;

/**
 * Inputs to the pure derivation. Mirrors what the live runner hands Agent 2e
 * (`ctx.setting!.setting`, `ctx.cast!.cast`, `ctx.inputs.theme`) plus the one creative
 * field that the model — not the derivation — produces.
 */
export interface DeriveBackgroundContextInputs {
  /** Agent 1 output (the refined setting). */
  setting: SettingRefinement;
  /** Agent 2 output (the cast design). */
  cast: CastDesign;
  /**
   * The single genuinely-creative field. In the redesign this moves onto Agent 2's
   * `backdrop.summary`; here it is a passed-in parameter. If omitted, a documented,
   * clearly-marked stub is emitted so the artifact stays schema-valid without inventing
   * an LLM call. The derivation NEVER synthesizes this sentence itself.
   */
  backdropSummary?: string;
  /** Theme pressure, copied flat from pipeline inputs (`inputs.theme`). */
  theme?: string;
}

/** Sentinel emitted when no creative backdrop sentence is supplied. Never derived. */
export const BACKDROP_SUMMARY_STUB =
  "[backdrop summary pending — creative field, supplied by model/Agent 2]";

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const toName = (character: CharacterProfile | undefined): string | undefined =>
  character && isNonEmptyString(character.name) ? character.name : undefined;

/**
 * Deterministically select the socially-central cast anchors.
 *
 * Ranking (per §4.2 / §9.1 of the redesign): detective candidate(s) first, then
 * victim-adjacent candidates, then the remaining roster in stable order. Names are drawn
 * ONLY from `cast` (no invention), de-duplicated, and capped. This reproduces a *selection*
 * the model never needed to make — every name already exists in the cast artifact.
 *
 * Pure and total: never throws on missing/partial cast data.
 */
export function rankAnchors(cast: CastDesign | undefined, max: number = MAX_CAST_ANCHORS): string[] {
  const characters: CharacterProfile[] = Array.isArray(cast?.characters) ? cast!.characters : [];
  const dynamics = cast?.crimeDynamics;

  // The set of real cast names — anchors must be a subset of these (no new names).
  const validNames = new Set<string>();
  for (const character of characters) {
    const name = toName(character);
    if (name) validNames.add(name);
  }

  const detectiveCandidates = Array.isArray(dynamics?.detectiveCandidates)
    ? dynamics!.detectiveCandidates
    : [];
  const victimCandidates = Array.isArray(dynamics?.victimCandidates)
    ? dynamics!.victimCandidates
    : [];

  const ordered: string[] = [];
  const seen = new Set<string>();

  const push = (candidate: unknown): void => {
    if (!isNonEmptyString(candidate)) return;
    if (!validNames.has(candidate)) return; // only names that actually exist in the cast
    if (seen.has(candidate)) return;
    seen.add(candidate);
    ordered.push(candidate);
  };

  // 1. detective candidate(s)
  for (const name of detectiveCandidates) push(name);
  // 2. victim-adjacent candidate(s)
  for (const name of victimCandidates) push(name);
  // 3. remaining roster in stable declaration order (role/institution-central fill)
  for (const character of characters) push(toName(character));

  return ordered.slice(0, Math.max(0, max));
}

/**
 * Reconstruct the DETERMINISTIC portion of the BackgroundContextArtifact from upstream
 * artifacts. The output shape is byte-identical to the live Agent 2e artifact, so this is a
 * drop-in replacement for the copied/derived fields.
 *
 * The ONLY non-deterministic field — `backdropSummary` — is taken from `inputs.backdropSummary`
 * (or a documented stub). This function performs NO LLM call, NO IO, and NO mutation of its
 * inputs, and is total: it never throws on missing or partial inputs.
 */
export function deriveBackgroundContext(
  inputs: DeriveBackgroundContextInputs,
): BackgroundContextArtifact {
  const setting = inputs?.setting;
  const era = setting?.era;
  const location = setting?.location;
  const atmosphere = setting?.atmosphere;

  const decade = isNonEmptyString(era?.decade) ? era!.decade : "";

  const socialNorms = Array.isArray(era?.socialNorms) ? era!.socialNorms : [];
  const socialStructure = socialNorms
    .filter(isNonEmptyString)
    .join("; ");

  const locationDescription = isNonEmptyString(location?.description) ? location!.description : "";
  const institution = isNonEmptyString(location?.type) ? location!.type : "";
  const weather = isNonEmptyString(atmosphere?.weather) ? atmosphere!.weather : "";

  const artifact: BackgroundContextArtifact = {
    status: "ok",
    backdropSummary: isNonEmptyString(inputs?.backdropSummary)
      ? inputs.backdropSummary
      : BACKDROP_SUMMARY_STUB,
    era: {
      decade,
      ...(socialStructure ? { socialStructure } : {}),
    },
    setting: {
      location: locationDescription,
      institution,
      ...(weather ? { weather } : {}),
    },
    castAnchors: rankAnchors(inputs?.cast),
    ...(isNonEmptyString(inputs?.theme) ? { theme: inputs.theme } : {}),
  };

  return artifact;
}
