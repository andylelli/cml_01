/** Shared, pure helpers for the engines. No engine has opinions; neither do these. */

import type {
  CapabilityObservation,
  CrimeSpec,
  EntityId,
  Interval,
  Observation,
  Person,
  PresenceObservation,
  TypedCml,
} from "./types.js";

export const suspectsOf = (cml: TypedCml): Person[] =>
  cml.entities.filter((e): e is Person => e.kind === "person" && e.role === "suspect");

export const intervalsOverlap = (a: Interval, b: Interval): boolean =>
  a.start <= b.end && b.start <= a.end;

export const presenceClues = (clues: Observation[]): PresenceObservation[] =>
  clues.filter((o): o is PresenceObservation => o.kind === "presence");

export const capabilityClues = (clues: Observation[]): CapabilityObservation[] =>
  clues.filter((o): o is CapabilityObservation => o.kind === "capability");

/** Does the union of `intervals` cover every discrete minute of `window`? */
export function unionCovers(intervals: Interval[], window: Interval): boolean {
  if (window.end < window.start) return false;
  const sorted = [...intervals].sort((a, b) => a.start - b.start);
  let cursor = window.start;
  for (const iv of sorted) {
    if (iv.start > cursor) break; // a gap opens before `cursor`
    if (iv.end >= cursor) cursor = Math.max(cursor, iv.end + 1); // discrete minutes
    if (cursor > window.end) return true;
  }
  return cursor > window.end;
}

/** Being at `locationId` precludes the crime: it is neither the crime scene nor reachable from it. */
export function precludesCrime(
  locationId: EntityId,
  crime: Pick<CrimeSpec, "location" | "reachableFrom">,
): boolean {
  if (locationId === crime.location) return false;
  return !crime.reachableFrom.includes(locationId);
}

/**
 * Is `suspectId` eliminable using only `obs`? A suspect is eliminable if the clues prove they could
 * NOT have committed the crime for EITHER reason:
 *
 *  1. Opportunity (temporal): their *precluding* presence (at locations that rule out the crime)
 *     covers the entire crime window — no moment in the window leaves them able to reach the scene.
 *     This is what catches "boarded ≠ departed": a single-instant station presence does not cover
 *     the window, so it does not eliminate.
 *  2. Capability/access: a clue proves they LACK a capability the crime required (a key to the
 *     locked room, the medical knowledge to dose the poison). This models locked-room / unique-means
 *     mysteries, independent of timing.
 *
 * The culprit must satisfy ALL requirements; a suspect failing ANY is eliminable. Used by both
 * deducibility (per-step, with a premise subset) and uniqueness (over the full clue set).
 */
export function isEliminableFrom(
  obs: Observation[],
  suspectId: EntityId,
  crime: CrimeSpec,
): boolean {
  // 1. opportunity
  const precluding = presenceClues(obs)
    .filter((f) => f.person === suspectId && precludesCrime(f.location, crime))
    .map((f) => f.interval);
  if (unionCovers(precluding, crime.window)) return true;

  // 2. capability/access
  const required = crime.requiredCapabilities ?? [];
  const lacksRequired = capabilityClues(obs).some(
    (c) => c.person === suspectId && c.has === false && required.includes(c.capability),
  );
  return lacksRequired;
}

export const fmtInterval = (iv: Interval): string => `[${iv.start},${iv.end}]`;
