/**
 * Agent 2c — Location Spine (Phase 1, dark / additive)
 *
 * The eager, logic-bearing core of a location profile: which physical places
 * exist, what each is for in the mystery, who can access it, and one baseline
 * sensory palette per place. This is deliberately tiny — the combinatorial
 * sensory bible (sensoryDetails matrices, sensoryVariants grids, narrative
 * paragraphs, global atmosphere block) is NOT carried here. Per-scene sensory
 * texture is generated lazily at prose time.
 *
 * This module is PURE and OFFLINE: no LLM, no network, no pipeline behaviour
 * change. `extractLocationSpine` is a deterministic projection from an existing
 * full `LocationProfilesResult` artifact, proving the spine can be carried
 * eagerly while texture is deferred.
 *
 * See documentation/12_system_redesign/04_agent_2c_location_profiles.md (§4, §9).
 */

import type { LocationProfilesResult } from "./agent2c-location-profiles.js";

/** Spine place type — matches KeyLocation.type. */
export type LocationSpineType = "interior" | "exterior" | "transitional";

/**
 * One baseline sensory palette per place — the *seed* for lazy texture, not the
 * texture itself. A single dominant impression plus a few secondary tag words.
 */
export interface LocationBaselinePalette {
  dominant: string;
  secondary: string[];
}

/** A single logic-bearing place in the spine. */
export interface LocationSpinePlace {
  id: string;
  name: string;
  type: LocationSpineType;
  /** What this place is *for* in the mystery (crime scene, clue site, gathering room…). */
  purpose: string;
  /** Who can access this place and when — logic-adjacent. */
  accessControl: string;
  /** One baseline palette seeding lazy per-scene texture. */
  baselinePalette: LocationBaselinePalette;
}

/**
 * The eager, tiny location spine: the canonical list of places with their
 * logic-bearing fields and one baseline palette each, plus a one-line
 * isolation/geographic anchor.
 */
export interface LocationSpine {
  primaryName: string;
  places: LocationSpinePlace[];
  /** One-line geographic/isolation anchor, sourced from the atmosphere block. */
  isolation: string;
}

/** Result of a deterministic sanity check on a spine. */
export interface LocationSpineCheckResult {
  ok: boolean;
  issues: string[];
}

const isNonEmptyString = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const asStringArray = (value: unknown): string[] =>
  Array.isArray(value) ? value.filter(isNonEmptyString) : [];

const VALID_TYPES: ReadonlySet<LocationSpineType> = new Set([
  "interior",
  "exterior",
  "transitional",
]);

const normalizeType = (value: unknown): LocationSpineType =>
  typeof value === "string" && VALID_TYPES.has(value as LocationSpineType)
    ? (value as LocationSpineType)
    : "interior";

/**
 * Derive a single baseline palette for a place from its full `sensoryDetails`.
 *
 * The dominant impression is taken from the first available sensory atom across
 * sights → smells → sounds → tactile (sights/smells tend to read most "dominant"
 * for a baseline tonal cue); the secondary tags are the next few distinct atoms.
 * Falls back to empty strings/arrays on malformed input — never throws.
 */
const deriveBaselinePalette = (sensory: unknown): LocationBaselinePalette => {
  const s = (sensory ?? {}) as Record<string, unknown>;
  // Order chosen so the most evocative baseline impression leads.
  const ordered = [
    ...asStringArray(s.sights),
    ...asStringArray(s.smells),
    ...asStringArray(s.sounds),
    ...asStringArray(s.tactile),
  ];
  // De-duplicate while preserving order.
  const seen = new Set<string>();
  const atoms: string[] = [];
  for (const atom of ordered) {
    const key = atom.trim().toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    atoms.push(atom.trim());
  }
  return {
    dominant: atoms[0] ?? "",
    secondary: atoms.slice(1, 4),
  };
};

/**
 * PURE, deterministic projection from a full location-profiles artifact to the
 * tiny eager spine. No LLM. Pulls each keyLocation's logic-bearing fields plus a
 * single baseline palette derived from its sensoryDetails, and the isolation
 * anchor from the atmosphere block. Tolerant of malformed input — never throws.
 */
export function extractLocationSpine(profiles: LocationProfilesResult): LocationSpine {
  const safe = (profiles ?? {}) as Partial<LocationProfilesResult>;
  const primary = (safe.primary ?? {}) as Record<string, unknown>;
  const atmosphere = (safe.atmosphere ?? {}) as Record<string, unknown>;

  const keyLocations = Array.isArray(safe.keyLocations) ? safe.keyLocations : [];

  const places: LocationSpinePlace[] = keyLocations.map((loc, index) => {
    const l = (loc ?? {}) as unknown as Record<string, unknown>;
    const id = isNonEmptyString(l.id)
      ? l.id
      : isNonEmptyString(l.name)
        ? l.name
        : `location_${index}`;
    return {
      id,
      name: isNonEmptyString(l.name) ? l.name : "",
      type: normalizeType(l.type),
      purpose: isNonEmptyString(l.purpose) ? l.purpose : "",
      accessControl: isNonEmptyString(l.accessControl) ? l.accessControl : "",
      baselinePalette: deriveBaselinePalette(l.sensoryDetails),
    };
  });

  // Isolation anchor: prefer the explicit timeFlow/mood-free geographic cue, then
  // fall back to weather/era so we always carry a one-line anchor.
  const isolation =
    [atmosphere.timeFlow, atmosphere.mood, atmosphere.weather, atmosphere.era]
      .find(isNonEmptyString) ?? "";

  return {
    primaryName: isNonEmptyString(primary.name) ? primary.name : "",
    places,
    isolation,
  };
}

/**
 * Deterministic sanity check on a spine: every place must have a non-empty
 * purpose, a non-empty accessControl, and a non-empty baseline palette
 * (a dominant impression). Duplicate place ids are flagged. Never throws on
 * malformed input.
 */
export function checkLocationSpine(spine: LocationSpine): LocationSpineCheckResult {
  const issues: string[] = [];
  const safe = (spine ?? {}) as Partial<LocationSpine>;
  const places = Array.isArray(safe.places) ? safe.places : [];

  if (places.length === 0) {
    issues.push("spine has no places");
  }

  const seenIds = new Set<string>();
  places.forEach((place, index) => {
    const p = (place ?? {}) as Partial<LocationSpinePlace>;
    const label = isNonEmptyString(p.id) ? p.id : `place[${index}]`;

    if (!isNonEmptyString(p.id)) {
      issues.push(`${label}: missing id`);
    } else if (seenIds.has(p.id)) {
      issues.push(`duplicate id: ${p.id}`);
    } else {
      seenIds.add(p.id);
    }

    if (!isNonEmptyString(p.purpose)) {
      issues.push(`${label}: missing purpose`);
    }
    if (!isNonEmptyString(p.accessControl)) {
      issues.push(`${label}: missing accessControl`);
    }

    const palette = (p.baselinePalette ?? {}) as Partial<LocationBaselinePalette>;
    if (!isNonEmptyString(palette.dominant)) {
      issues.push(`${label}: empty baseline palette`);
    }
  });

  return { ok: issues.length === 0, issues };
}
