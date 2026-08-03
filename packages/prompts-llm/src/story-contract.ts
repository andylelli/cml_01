/**
 * Phase 6 (BLUE-G) — StoryContract Precompiler
 *
 * A StoryContract is computed once after all upstream agents complete and before
 * prose generation begins. It consolidates victim resolution, sensory atoms,
 * locked facts metadata, and the macro arc plan into a single typed record.
 */

// S6 prerequisite — read the TYPE from the leaf (`types/macro-arc.ts`), not from inside
// `agent9-prose/`. This was the THIRD back-edge: REVIEW_01 §5.7 recorded removing two
// (`world-state.ts`, `story-bible.ts`) and concluded "the extraction is now a mechanical move",
// but this one survived, so the direction was never actually clean. See REVIEW_03 §0j for why
// removing it still does not make the extraction mechanical.
import type { MacroArcEntry } from './types/macro-arc.js';
import { isVictimArchetype } from '@cml/cml';

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

export interface InferenceStep {
  observation: string;
  correction?: string;
  effect?: string;
  required_evidence: string[];
  reader_observable: boolean;
}

export interface StoryContract {
  victim: VictimContract;
  sensoryAtoms: Record<string, SensoryAtomSet>;
  lockedFacts: LockedFactContract[];
  macroArcPlan: MacroArcEntry[];
  // G5: crime-side ground truth for validation
  culpritNames: string[];
  culpritAlibiWindows: Record<string, string>;
  crimeTimeAnchors: string[];
  inferenceChain: InferenceStep[];
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
    return isVictimArchetype(archetype);
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
    // G5: crime-side ground truth
    culpritNames: (() => {
      const culprits = (cmlCase as any)?.culpability?.culprits;
      return Array.isArray(culprits) ? culprits.map((c: any) => String(c ?? '').trim()).filter(Boolean) : [];
    })(),
    culpritAlibiWindows: (() => {
      const chars: any[] = Array.isArray((castData as any)?.characters) ? (castData as any).characters : [];
      const culpritNames: string[] = Array.isArray((cmlCase as any)?.culpability?.culprits)
        ? (cmlCase as any).culpability.culprits.map((c: any) => String(c ?? '').trim())
        : [];
      const windows: Record<string, string> = {};
      for (const c of chars) {
        if (culpritNames.includes(String(c.name ?? ''))) {
          windows[String(c.name)] = String(c.alibi_window ?? c.alibiWindow ?? '').trim();
        }
      }
      return windows;
    })(),
    crimeTimeAnchors: (() => {
      const anchors = (cmlCase as any)?.constraint_space?.time?.anchors;
      return Array.isArray(anchors) ? anchors.map((a: any) => String(a ?? '').trim()).filter(Boolean) : [];
    })(),
    inferenceChain: (() => {
      const steps = (cmlCase as any)?.inference_path?.steps;
      if (!Array.isArray(steps)) return [];
      return steps.map((s: any): InferenceStep => ({
        observation: String(s.observation ?? '').trim(),
        correction: s.correction ? String(s.correction).trim() : undefined,
        effect: s.effect ? String(s.effect).trim() : undefined,
        required_evidence: Array.isArray(s.required_evidence) ? s.required_evidence.map(String) : [],
        reader_observable: Boolean(s.reader_observable),
      }));
    })(),
  };
}
