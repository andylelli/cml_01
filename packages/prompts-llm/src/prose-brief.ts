/**
 * Prose Brief — OFFLINE merge foundation for the Agent 2-family redesign.
 *
 * The Agent 2b redesign's Option B (documentation/12_system_redesign/03_agent_2b_character_profiles.md
 * §4.4 / §4.5 / §9.3) collapses the 2b/2c/2d/2e quartet — four sequential "expand the CML into a
 * prose-ready X" steps — into ONE "Prose Brief": a single typed artifact carrying the four prose-facing
 * projections that Agent 9 (prose) consumes. The merged *generation* call needs platform work
 * (constrained decoding, one CML re-send) and is out of scope here; this module is the OFFLINE half:
 * the PURE assembler that composes the four DETERMINISTIC projections already shipped under their own
 * modules into one brief.
 *
 *   - voice capsules  ← `extractVoiceCapsule`  (agent2b-voice-capsule.ts)
 *   - location spine   ← `extractLocationSpine` (agent2c-location-spine.ts)
 *   - temporal anchor  ← `deriveTemporalAnchor` (shared/temporal-anchor.ts)
 *   - background        ← `deriveBackgroundContext` (agent2e-background-derive.ts)
 *
 * This file is ADDITIVE and PURE: it does NOT reimplement any projection (it only composes them),
 * calls no LLM, performs no IO, mutates no input, and never throws on partial/empty input. The four
 * projection modules are untouched; this is a thin, deterministic merge plus a rolled-up health view.
 */

import type { CharacterProfileOutput } from "./agent2b-character-profiles.js";
import type { LocationProfilesResult } from "./agent2c-location-profiles.js";
import type { SettingRefinement } from "./agent1-setting.js";
import type { CastDesign } from "./agent2-cast.js";
import type { BackgroundContextArtifact } from "./agent2e-background-context.js";

import type { VoiceCapsule } from "./agent2b-voice-capsule.js";
import { extractVoiceCapsule, checkVoiceCapsules } from "./agent2b-voice-capsule.js";
import type { LocationSpine } from "./agent2c-location-spine.js";
import { extractLocationSpine, checkLocationSpine } from "./agent2c-location-spine.js";
import type { TemporalAnchor } from "./shared/temporal-anchor.js";
import { deriveTemporalAnchor } from "./shared/temporal-anchor.js";
import { deriveBackgroundContext } from "./agent2e-background-derive.js";

/**
 * A rolled-up health summary across the four projections. `ok` is true only when no projection
 * reported an error-severity problem; `issues` is the union of human-readable issue strings,
 * prefixed with the section they came from so the merged view stays traceable.
 */
export interface ProseBriefHealth {
  ok: boolean;
  issues: string[];
}

/**
 * The merged Prose Brief: the four deterministic 2-family projections unified into one typed
 * artifact the prose stage (Agent 9) would consume in a single pass. Each section is the exact
 * output type of its existing extractor/deriver — nothing here is re-shaped or re-derived.
 */
export interface ProseBrief {
  /** Per-character voice contracts (agent2b-voice-capsule). */
  voiceCapsules: VoiceCapsule[];
  /** The eager logic-bearing location spine (agent2c-location-spine). */
  locationSpine: LocationSpine;
  /** The deterministic temporal anchor: year + month + derived season (shared/temporal-anchor). */
  temporal: TemporalAnchor;
  /** The derived background-context artifact (agent2e-background-derive). */
  background: BackgroundContextArtifact;
  /** Rolled-up health across all four sections. */
  health: ProseBriefHealth;
}

/**
 * Inputs to the pure assembler — the upstream artifacts each projection already consumes.
 * Mirrors what the live runners hand 2b/2c/2d/2e respectively; nothing new is required.
 */
export interface AssembleProseBriefInputs {
  /** Agent 2b character profiles — projected into voice capsules. */
  characterProfiles?: Array<Partial<CharacterProfileOutput>> | null;
  /** Agent 2c location-profiles result — projected into the location spine. */
  locationProfiles?: LocationProfilesResult | null;
  /** Decade (e.g. "1920s") + runId for the deterministic temporal anchor. */
  decade?: string;
  runId?: string;
  /** Agent 1 setting + Agent 2 cast — fed to the background derivation. */
  setting?: SettingRefinement | null;
  cast?: CastDesign | null;
  /** The one creative background field (passed through to the deriver, never invented here). */
  backdropSummary?: string;
  /** Theme pressure, copied flat into the background artifact. */
  theme?: string;
}

const isObject = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

/**
 * Roll the four projections' check results into one health view. Pure: derives `ok` from whether
 * any section reported an error (voice capsules carry severities; the spine treats any issue as a
 * blocking problem, matching its own `ok = issues.length === 0` contract), and unions the issue
 * strings with a section prefix so the merged report stays traceable to its source.
 */
export function checkProseBrief(brief: ProseBrief | null | undefined): ProseBriefHealth {
  const safe = (isObject(brief) ? brief : {}) as Partial<ProseBrief>;
  const issues: string[] = [];

  // --- Voice capsules: error-severity issues block; warns are surfaced but non-blocking. ---
  const capsules = Array.isArray(safe.voiceCapsules) ? safe.voiceCapsules : [];
  const voiceResult = checkVoiceCapsules(capsules);
  let hasError = !voiceResult.ok;
  for (const issue of voiceResult.issues) {
    issues.push(`voice[${issue.severity}]: ${issue.message}`);
  }

  // --- Location spine: its checker treats every issue as blocking (ok = no issues). ---
  const spine = (isObject(safe.locationSpine) ? safe.locationSpine : {}) as LocationSpine;
  const spineResult = checkLocationSpine(spine);
  if (!spineResult.ok) hasError = true;
  for (const issue of spineResult.issues) {
    issues.push(`spine: ${issue}`);
  }

  // --- Temporal anchor: an undefined season means the month token isn't canonical. ---
  const temporal = (isObject(safe.temporal) ? safe.temporal : {}) as Partial<TemporalAnchor>;
  if (temporal.season === undefined) {
    hasError = true;
    issues.push("temporal: season could not be derived (non-canonical month)");
  }

  // --- Background: the deriver always sets status "ok"; an empty anchor set is a soft signal. ---
  const background = (isObject(safe.background) ? safe.background : {}) as Partial<BackgroundContextArtifact>;
  const anchors = Array.isArray(background.castAnchors) ? background.castAnchors : [];
  if (anchors.length === 0) {
    issues.push("background: no cast anchors");
  }

  return { ok: !hasError, issues };
}

/**
 * Assemble the merged Prose Brief from upstream artifacts. PURE: calls the four existing
 * extractors/derivers, runs the two existing checkers (checkVoiceCapsules + checkLocationSpine)
 * via `checkProseBrief`, and rolls their issues into a single `health` summary. No LLM, no IO,
 * no mutation of inputs, and total — it never throws on missing/partial/empty input.
 *
 * This is a thin, deterministic COMPOSITION. It does not reimplement any projection; each section
 * is produced by exactly the function that owns it.
 */
export function assembleProseBrief(inputs: AssembleProseBriefInputs | null | undefined): ProseBrief {
  const safe = (isObject(inputs) ? inputs : {}) as AssembleProseBriefInputs;

  // --- voice capsules: one capsule per supplied profile (tolerant of malformed entries) ---
  const profiles = Array.isArray(safe.characterProfiles) ? safe.characterProfiles : [];
  const voiceCapsules: VoiceCapsule[] = profiles.map((profile) => extractVoiceCapsule(profile));

  // --- location spine: project the full location-profiles artifact into the tiny eager spine ---
  const locationSpine = extractLocationSpine(
    (safe.locationProfiles ?? {}) as LocationProfilesResult,
  );

  // --- temporal anchor: deterministic year/month/season from (decade, runId) ---
  const temporal = deriveTemporalAnchor(
    typeof safe.decade === "string" ? safe.decade : "",
    typeof safe.runId === "string" ? safe.runId : "",
  );

  // --- background: deterministic portion reconstructed from setting + cast (+ creative passthrough) ---
  const background = deriveBackgroundContext({
    setting: (safe.setting ?? undefined) as SettingRefinement,
    cast: (safe.cast ?? undefined) as CastDesign,
    backdropSummary: safe.backdropSummary,
    theme: safe.theme,
  });

  const brief: ProseBrief = {
    voiceCapsules,
    locationSpine,
    temporal,
    background,
    // health filled below from the assembled sections (single source of the rollup).
    health: { ok: true, issues: [] },
  };

  brief.health = checkProseBrief(brief);
  return brief;
}
