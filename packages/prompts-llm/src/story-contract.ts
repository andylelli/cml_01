/**
 * Phase 6 (BLUE-G) — StoryContract Precompiler
 *
 * A StoryContract is computed once after all upstream agents complete and before
 * prose generation begins. It consolidates victim resolution, sensory atoms,
 * locked facts metadata, and the macro arc plan into a single typed record.
 */

import type { MacroArcEntry } from './agent9-prose.js';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type VictimRoleSource =
  | 'cast.role=victim'
  | 'cast.role_archetype'
  | 'cml.culpability.victim'
  | 'fallback_unknown';

export interface VictimContract {
  name: string;
  status: 'deceased';
  roleConfirmedFrom: VictimRoleSource;
}

export interface SensoryAtomSet {
  sights: string[];
  sounds: string[];
  smells: string[];
  tactile: string[];
}

export interface LockedFactContract {
  id: string;
  canonical: string;
  description: string;
  appearsInChapter?: number;
}

export interface StoryContract {
  victim: VictimContract;
  sensoryAtoms: Record<string, SensoryAtomSet>;
  lockedFacts: LockedFactContract[];
  macroArcPlan: MacroArcEntry[];
}

// ---------------------------------------------------------------------------
// Victim resolution
// ---------------------------------------------------------------------------

/**
 * Resolve victim from cast data with 3-pass fallback chain.
 * Returns a VictimContract that records which pass found the victim.
 *
 * Pass 1: explicit cast.role === 'victim'
 * Pass 2: cast.role_archetype contains 'victim' (case-insensitive)
 * Pass 3: CML CASE.culpability.victim name match
 */
export function resolveVictimContract(
  castData: unknown,
  culpabilityVictimName?: string,
): VictimContract {
  const chars: any[] = Array.isArray((castData as any)?.characters)
    ? (castData as any).characters
    : [];

  // Pass 1
  let found = chars.find((c: any) => c.role === 'victim');
  if (found) {
    return { name: String(found.name ?? ''), status: 'deceased', roleConfirmedFrom: 'cast.role=victim' };
  }

  // Pass 2
  found = chars.find((c: any) => {
    const archetype: string = String(c.roleArchetype ?? (c as any).role_archetype ?? '');
    return archetype.toLowerCase().includes('victim');
  });
  if (found) {
    return { name: String(found.name ?? ''), status: 'deceased', roleConfirmedFrom: 'cast.role_archetype' };
  }

  // Pass 3
  if (culpabilityVictimName) {
    found = chars.find((c: any) => c.name === culpabilityVictimName);
    if (found) {
      return { name: String(found.name ?? ''), status: 'deceased', roleConfirmedFrom: 'cml.culpability.victim' };
    }
  }

  return { name: '', status: 'deceased', roleConfirmedFrom: 'fallback_unknown' };
}

// ---------------------------------------------------------------------------
// StoryContract builder
// ---------------------------------------------------------------------------

/**
 * Precompile a StoryContract from orchestrator inputs.
 * Call once after all upstream agents complete, before generateProse.
 */
export function precompileStoryContract(params: {
  castData: unknown;
  cmlCase: unknown;
  lockedFacts: Array<{ description?: string; id?: string; value?: string; appearsInChapters?: number[] }>;
  macroArcPlan: MacroArcEntry[];
  locationProfiles?: unknown[];
}): StoryContract {
  const { castData, cmlCase, lockedFacts, macroArcPlan, locationProfiles = [] } = params;

  // Victim resolution
  const culpabilityVictimName = String((cmlCase as any)?.culpability?.victim ?? '').trim() || undefined;
  const victim = resolveVictimContract(castData, culpabilityVictimName);

  // Sensory atoms — extract from location profiles if available
  const sensoryAtoms: Record<string, SensoryAtomSet> = {};
  for (const loc of locationProfiles) {
    const name = String((loc as any)?.name ?? '').trim();
    if (!name) continue;
    sensoryAtoms[name] = {
      sights: Array.isArray((loc as any)?.sights) ? (loc as any).sights : [],
      sounds: Array.isArray((loc as any)?.sounds) ? (loc as any).sounds : [],
      smells: Array.isArray((loc as any)?.smells) ? (loc as any).smells : [],
      tactile: Array.isArray((loc as any)?.tactile) ? (loc as any).tactile : [],
    };
  }

  // Locked facts — flatten to contract entries
  const lockedFactContracts: LockedFactContract[] = lockedFacts.map((f) => ({
    id: String(f.id ?? f.description ?? '').slice(0, 80),
    canonical: String(f.value ?? '').trim(),
    description: String(f.description ?? '').trim(),
    appearsInChapter: Array.isArray(f.appearsInChapters) ? f.appearsInChapters[0] : undefined,
  }));

  return {
    victim,
    sensoryAtoms,
    lockedFacts: lockedFactContracts,
    macroArcPlan,
  };
}
