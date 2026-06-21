/**
 * Era-capability stub oracle (Agent 3b redesign §9.3).
 *
 * The feasibility gate needs an oracle for "what could this decade do?". Agent 1 / @cml/period-kb
 * is the intended real source, but its vocabulary doesn't yet cover device-mechanism capabilities
 * (mechanical_clock, gramophone, tide_tables…). So — exactly as §9.3 prescribes ("If Agent 1 hasn't
 * shipped that contract yet, I stub it: a flat capability list keyed by decade") — this provides a
 * small, decade-keyed capability model covering every capability the seed patterns reference.
 *
 * `EraCapabilityOracle` is injectable, so this stub can later be swapped for / composed with the
 * real period-kb oracle without changing the feasibility checker.
 */

import type { EraCapabilityOracle } from "./types.js";

/** capability -> the earliest decade it became available. */
export const CAPABILITY_AVAILABLE_FROM: Record<string, number> = {
  // period-plausible mechanism capabilities
  mechanical_clock: 1500,
  second_timepiece: 1700,
  sound_recording_playback: 1900,
  tide_tables: 1700,
  period_poison: 1500,
  predictable_heat_source: 1500,
  mechanical_ingenuity: 1500,
  old_building_structure: 1500,
  physical_disguise: 1500,
  pen_and_ink: 1500,
  social_deference: 1500,
  mirror_or_glass: 1600,
  // modern capabilities that DEFEAT the classic tricks (the anachronism floor)
  electronic_timekeeping: 1970,
  voice_authentication: 1995,
  modern_toxicology_screen: 1960,
  cctv: 1960,
  automated_fingerprint_search: 1990,
  forensic_document_dating: 1965,
};

const toDecade = (yearOrDecade: number): number => Math.floor(yearOrDecade / 10) * 10;

/** The set of capabilities available in a given decade (or year, rounded down). */
export function eraCapabilities(decade: number): Set<string> {
  const d = toDecade(decade);
  return new Set(
    Object.entries(CAPABILITY_AVAILABLE_FROM)
      .filter(([, from]) => from <= d)
      .map(([cap]) => cap),
  );
}

/** A deterministic oracle for one era. Unknown capabilities resolve to NOT available. */
export function makeStubOracle(decade: number): EraCapabilityOracle {
  const d = toDecade(decade);
  return {
    isAvailable(capability: string): boolean {
      const from = CAPABILITY_AVAILABLE_FROM[capability];
      return from !== undefined && from <= d;
    },
  };
}
