/**
 * Period KB — legacy projection (migration bridge).
 *
 * These functions project the structured KB entries back onto the *exact field shapes* the
 * current pipeline already consumes:
 *   - `buildEraConstraintsFromKb` reproduces the string shape of the old
 *     `buildEraConstraints(decade)` (Phase 1: swap the data source, change nothing downstream).
 *   - `projectEraFields` / `projectLocationFields` emit the `era.*` / `location.*` objects
 *     from `schema/setting_refinement.schema.yaml` (Phase 2: bind these deterministically and
 *     remove them from the LLM's output schema).
 *
 * Nothing here is wired into the pipeline yet — this is Phase 0 groundwork that makes
 * Phases 1–2 a drop-in.
 */

import { bindEra, bindPlace, KB_VERSION } from "./oracle.js";
import type { BindOptions, EraEntry, PlaceEntry } from "./types.js";

const humanize = (token: string): string => token.replace(/_/g, " ");

/** 1931 -> "1930s". */
export const decadeLabel = (year: number): string => `${Math.floor(year / 10) * 10}s`;

/**
 * Representative seeded year for each decade the legacy pipeline asks for. The current
 * `buildEraConstraints` is keyed by decade strings ("1930s"); the KB is keyed by year, so
 * Phase 1 resolves a decade to the anchor year we've seeded for it.
 *
 * For decades we have a seeded anchor, this returns that anchor exactly (no nearest-anchor
 * approximation). For any other well-formed decade/year string it returns a mid-decade year
 * and lets `bindEra` perform an *explicit, logged* nearest-anchor fallback — replacing the
 * old silent default-to-1930s. Returns `undefined` only for an unparseable input.
 */
export function representativeYearForDecade(decade: string): number | undefined {
  const known: Record<string, number> = {
    "1920s": 1925,
    "1930s": 1931,
    "1940s": 1945,
    "1950s": 1955,
    "1960s": 1965,
  };
  const key = decade.trim().toLowerCase();
  if (key in known) {
    return known[key];
  }
  // "1910s" -> 1915 (mid-decade); "1931" -> 1931 (explicit year).
  const match = key.match(/^(\d{4})\s*s?$/);
  if (!match) {
    return undefined;
  }
  const base = Number.parseInt(match[1], 10);
  return key.endsWith("s") ? base + 5 : base;
}

/**
 * Decade-keyed wrapper over `buildEraConstraintsFromKb` for the Phase 1 drop-in. Returns the
 * legacy string shape sourced from the KB, or `undefined` if the decade can't be parsed (so
 * the caller can fall back to the legacy table).
 */
export function buildEraConstraintsForDecade(
  decade: string,
  opts: BindOptions = {}
): string | undefined {
  const year = representativeYearForDecade(decade);
  if (year === undefined) {
    return undefined;
  }
  return buildEraConstraintsFromKb(year, opts);
}

/** The `era.*` object shape from setting_refinement.schema.yaml, sourced from the KB. */
export interface ProjectedEraFields {
  decade: string;
  technology: string[];
  forensics: string[];
  transportation: string[];
  communication: string[];
  socialNorms: string[];
  policing: string[];
}

export function projectEraFields(entry: EraEntry): ProjectedEraFields {
  const forensics = Object.entries(entry.forensics).map(([name, fact]) => {
    const caveat = fact.caveat ?? fact.note;
    return `${humanize(name)}: ${fact.status}${caveat ? ` — ${caveat}` : ""}`;
  });

  const communication = Object.entries(entry.communication).map(([name, fact]) => {
    const detail = fact.availability ?? fact.status ?? fact.caveat ?? fact.note ?? "available";
    return `${humanize(name)}: ${detail}`;
  });

  const transportation = Object.entries(entry.transport).map(
    ([name, value]) => `${humanize(name)}: ${humanize(String(value))}`
  );

  const policing = [
    `forensic labs: ${entry.policing.forensic_labs}`,
    `amateur detective ${entry.policing.amateur_detective_plausible ? "plausible" : "implausible"}`,
    `formal rights caution: ${entry.policing.formal_rights_caution ? "yes" : "no"}`,
    `national database: ${entry.policing.national_database}`,
  ];

  return {
    decade: decadeLabel(entry.year),
    technology: entry.technology.present.map(humanize),
    forensics,
    transportation,
    communication,
    socialNorms: [...entry.social_norms],
    policing,
  };
}

/** Reproduces the string shape of the old `buildEraConstraints(decade)`. */
export function buildEraConstraintsFromKb(year: number, opts: BindOptions = {}): string {
  const { entry } = bindEra(year, opts);
  const f = projectEraFields(entry);
  return [
    `${f.decade} Era Constraints (period-kb v${KB_VERSION}):`,
    `- Technology: ${f.technology.join(", ")}`,
    `- Forensics: ${f.forensics.join("; ")}`,
    `- Transportation: ${f.transportation.join(", ")}`,
    `- Communication: ${f.communication.join("; ")}`,
    `- Social: ${f.socialNorms.join(" ")}`,
    `- Policing: ${f.policing.join(", ")}`,
  ].join("\n");
}

/** The `location.*` object shape from setting_refinement.schema.yaml, sourced from the KB. */
export interface ProjectedLocationFields {
  type: string;
  description: string;
  physicalConstraints: string[];
  geographicIsolation: string;
  accessControl: string[];
}

export function projectLocationFields(place: PlaceEntry): ProjectedLocationFields {
  return {
    type: place.display_name,
    description: place.typical_summary,
    physicalConstraints: [...place.movement_constraints],
    geographicIsolation: place.isolation.summary,
    accessControl: [
      ...place.access_points.map((a) => `${humanize(a.id)}: ${a.control}`),
      ...place.social_rules,
    ],
  };
}

/** Reproduces the string shape of the old `buildLocationConstraints(location, institution)`. */
export function buildLocationConstraintsFromKb(archetype: string, opts: BindOptions = {}): string {
  const { entry } = bindPlace(archetype, opts);
  const l = projectLocationFields(entry);
  return [
    `Location: ${l.type} (period-kb v${KB_VERSION})`,
    "",
    "Physical Constraints:",
    ...l.physicalConstraints.map((c) => `- ${c}`),
    `- Isolation: ${l.geographicIsolation}`,
    "",
    "Access Control:",
    ...l.accessControl.map((c) => `- ${c}`),
  ].join("\n");
}
