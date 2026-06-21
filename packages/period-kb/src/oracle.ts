/**
 * Period KB — the EraOracle (binder + availability oracle).
 *
 * This is the deterministic core that replaces "ask an LLM to restate the period facts."
 * `bindEra` / `bindPlace` select the right authoritative entry for a run (with an explicit,
 * logged nearest-anchor fallback instead of the old silent default-to-1930s), and
 * `checkAvailability` answers "was X a means available in year Y?" — the lookup that the
 * anachronism linter and (later) Agents 6/6.5 share as a fairness oracle.
 *
 * Everything here is pure data lookup: same inputs + same KB version => byte-identical output.
 */

import { resolveTermAvailability } from "./internal.js";
import {
  hasEraYear,
  hasPlaceArchetype,
  listEraYears,
  listPlaceArchetypes,
  loadEraEntry,
  loadPlaceEntry,
} from "./loader.js";
import type {
  AvailabilityResult,
  BindOptions,
  EraBinding,
  EraEntry,
  PlaceBinding,
} from "./types.js";

/**
 * KB schema/version tag. Bump when the data shape or facts change in a way that should
 * invalidate reproducibility. Kept in sync with package.json `version`. Surfaces in
 * provenance strings (`kb:v0.1.0/1931`) so downstream artifacts can pin the source.
 */
export const KB_VERSION = "0.1.0";

/** Archetype used as the documented fallback when a requested archetype is unseeded. */
export const DEFAULT_ARCHETYPE = "country_manor";

const eraProvenance = (year: number): string => `kb:v${KB_VERSION}/${year}`;
const placeProvenance = (archetype: string): string => `kb:v${KB_VERSION}/${archetype}`;

const noop = (): void => {};

/**
 * Pick the closest seeded year to `target`. On a tie, the earlier year wins
 * (deterministic). Pure and exported so the fallback rule is unit-testable without
 * seeding extra data files.
 */
export function pickNearestYear(target: number, anchors: number[]): number {
  if (anchors.length === 0) {
    throw new Error("pickNearestYear: no anchors provided");
  }
  let best = anchors[0];
  let bestDistance = Math.abs(best - target);
  for (const anchor of anchors) {
    const distance = Math.abs(anchor - target);
    if (distance < bestDistance || (distance === bestDistance && anchor < best)) {
      best = anchor;
      bestDistance = distance;
    }
  }
  return best;
}

/**
 * Bind the authoritative era entry for a year. If no exact `<year>.yaml` exists, fall back
 * to the nearest seeded anchor and emit a warning (never a silent default, never a throw —
 * unless the KB is empty, which is a real misconfiguration).
 */
export function bindEra(year: number, opts: BindOptions = {}): EraBinding {
  const warn = opts.onWarn ?? ((m: string) => console.warn(m));

  if (hasEraYear(year)) {
    return {
      entry: loadEraEntry(year),
      requestedYear: year,
      resolvedYear: year,
      exact: true,
      provenance: eraProvenance(year),
    };
  }

  const anchors = listEraYears();
  if (anchors.length === 0) {
    throw new Error("Period KB has no era anchors seeded under eras/");
  }

  const resolvedYear = pickNearestYear(year, anchors);
  const distanceYears = Math.abs(resolvedYear - year);
  warn(
    `[period-kb] no era anchor for ${year}; using nearest anchor ${resolvedYear} (Δ${distanceYears}y)`
  );

  return {
    entry: loadEraEntry(resolvedYear),
    requestedYear: year,
    resolvedYear,
    exact: false,
    fallback: { reason: `nearest-anchor for unseeded year ${year}`, distanceYears },
    provenance: eraProvenance(resolvedYear),
  };
}

/**
 * Bind the affordance data for a location archetype. Unknown archetypes fall back to the
 * default archetype with a warning rather than throwing.
 */
export function bindPlace(archetype: string, opts: BindOptions = {}): PlaceBinding {
  const warn = opts.onWarn ?? ((m: string) => console.warn(m));

  if (hasPlaceArchetype(archetype)) {
    return {
      entry: loadPlaceEntry(archetype),
      requestedArchetype: archetype,
      resolvedArchetype: archetype,
      exact: true,
      provenance: placeProvenance(archetype),
    };
  }

  const available = listPlaceArchetypes();
  if (available.length === 0) {
    throw new Error("Period KB has no place archetypes seeded under places/");
  }

  const resolvedArchetype = available.includes(DEFAULT_ARCHETYPE)
    ? DEFAULT_ARCHETYPE
    : available[0];
  warn(
    `[period-kb] no place archetype "${archetype}"; falling back to "${resolvedArchetype}"`
  );

  return {
    entry: loadPlaceEntry(resolvedArchetype),
    requestedArchetype: archetype,
    resolvedArchetype,
    exact: false,
    fallback: { reason: `unseeded archetype "${archetype}"` },
    provenance: placeProvenance(resolvedArchetype),
  };
}

/**
 * Was a named means/technology available in `year`? This is the shared fairness oracle:
 * a fair-play clue must be discoverable by period-available means, and this answers
 * "by 1931 means?" as a lookup rather than a vibe.
 *
 * Returns `available: false` for hard-absent means, `true` for present ones, and
 * `"unknown"` for terms the KB does not yet represent (so callers can distinguish
 * "the KB says no" from "the KB has no opinion").
 */
export function checkAvailability(
  year: number,
  term: string,
  opts: BindOptions = {}
): AvailabilityResult {
  const binding = bindEra(year, { onWarn: opts.onWarn ?? noop });
  const resolution = resolveTermAvailability(binding.entry, term);
  return {
    term,
    normalizedTerm: resolution.normalizedTerm,
    year,
    resolvedYear: binding.resolvedYear,
    available: resolution.available,
    basis: resolution.basis,
    caveat: resolution.caveat,
  };
}

/** Convenience boolean: true only when the term is definitively available. */
export function isAvailable(year: number, term: string, opts: BindOptions = {}): boolean {
  return checkAvailability(year, term, opts).available === true;
}

/** Re-export the entry loaders for callers that already have a resolved year/archetype. */
export { loadEraEntry, loadPlaceEntry, listEraYears, listPlaceArchetypes };
export type { EraEntry };
