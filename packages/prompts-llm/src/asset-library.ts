import type { Asset, AssetLibrary } from './types/asset-library.js';

/**
 * Builds a flat asset library from CML source data.
 * Each atom has a deterministic ID, scope, tier, budget, and content string.
 * Call once per prose run — the library is stable across all batches.
 */
export function buildAssetLibrary(
  worldDoc: any,
  characterProfiles: any,
  locationProfiles: any,
  temporalContext: any,
): AssetLibrary {
  const lib: AssetLibrary = {};
  const add = (asset: Asset) => { lib[asset.id] = asset; };

  // -- Character atoms --
  for (const profile of (characterProfiles?.profiles ?? [])) {
    const name: string = profile.name;
    if (!name) continue;  // skip malformed profiles with missing name

    // First-impression: single-budget obligation atom
    if (profile.firstImpression) {
      add({
        id: `portrait:${name}:first_impression`,
        source: 'characterProfiles.firstImpression',
        scope: 'character', scopeKey: name,
        tier: 'obligation', budget: 1, priority: 'high',
        content: profile.firstImpression,
      });
    }

    // Physical description: lower-budget texture atom
    if (profile.physical) {
      add({
        id: `portrait:${name}:physical`,
        source: 'characterProfiles.physical',
        scope: 'character', scopeKey: name,
        tier: 'texture', budget: 2, priority: 'medium',
        content: profile.physical,
      });
    }

    // Manner / bearing: texture atom
    if (profile.manner) {
      add({
        id: `portrait:${name}:manner`,
        source: 'characterProfiles.manner',
        scope: 'character', scopeKey: name,
        tier: 'texture', budget: 2, priority: 'medium',
        content: profile.manner,
      });
    }

    // Speech mannerisms: split on ';' or sentence boundary, one atom each
    const mannerisms: string[] = (profile.speechMannerisms ?? '')
      .split(/;|\.\s+/)
      .map((s: string) => s.trim())
      .filter((s: string) => s.length > 10);
    mannerisms.forEach((m, i) => {
      add({
        id: `voice:${name}:manner_${i}`,
        source: 'characterProfiles.speechMannerisms',
        scope: 'character', scopeKey: name,
        tier: 'obligation', budget: 3, priority: 'high',
        content: m,
      });
    });

    // Internal conflict: obligation, deploy at most twice
    if (profile.internalConflict) {
      add({
        id: `voice:${name}:conflict`,
        source: 'characterProfiles.internalConflict',
        scope: 'character', scopeKey: name,
        tier: 'obligation', budget: 2, priority: 'high',
        content: profile.internalConflict,
      });
    }
  }

  // -- Era / historical atoms --
  if (worldDoc?.historicalMoment?.eraRegister) {
    const eraText: string = worldDoc.historicalMoment.eraRegister;
    eraText
      .split(/\.\s+/)
      .filter((s: string) => s.length > 20)
      .slice(0, 5)
      .forEach((fragment, i) => {
        add({
          id: `era:story:${i}`,
          source: 'worldDoc.historicalMoment.eraRegister',
          scope: 'story', scopeKey: '',
          tier: 'texture', budget: 0, priority: 'medium',
          content: fragment,
        });
      });
  }

  // -- Reveal implication atoms --
  if (Array.isArray(worldDoc?.revealImplications)) {
    (worldDoc.revealImplications as string[]).forEach((impl, i) => {
      add({
        id: `reveal:story:${i}`,
        source: 'worldDoc.revealImplications',
        scope: 'window', scopeKey: '',
        tier: 'texture', budget: 1, priority: 'medium',
        content: impl,
      });
    });
  }

  // Further atom categories (location sensory, temporal cultural) are added in Phases 3–6.
  return lib;
}

/**
 * Selects obligation and texture atoms for a single chapter batch.
 *
 * Filters by:
 * - Scope: character atoms require the name to be in activeCharacterNames;
 *          location atoms require the id to be in activeLocationIds.
 * - Budget: atoms whose deployment count has reached their budget are excluded.
 *
 * Returns obligation atoms unsorted (all must be fulfilled), and texture atoms
 * sorted least-recently-used first so the same atom doesn't dominate every chapter.
 *
 * @param arcPosition  Reserved for register-matching filter in Phase 3; currently accepted
 *                     but unused. Pass the string form of the arc position (e.g. 'mid').
 */
export function selectChapterAtoms(
  library: AssetLibrary,
  activeCharacterNames: Set<string>,
  activeLocationIds: Set<string>,
  deployedAssets: Record<string, number[]>,
  arcPosition: string,
): { obligationAtoms: Asset[]; textureAtoms: Asset[] } {
  const obligation: Asset[] = [];
  const texture: Asset[] = [];

  for (const asset of Object.values(library)) {
    // Scope filter
    if (asset.scope === 'character' && !activeCharacterNames.has(asset.scopeKey)) continue;
    if (asset.scope === 'location' && !activeLocationIds.has(asset.scopeKey)) continue;

    // Budget filter — 0 means unlimited
    const usedCount = (deployedAssets[asset.id] ?? []).length;
    if (asset.budget > 0 && usedCount >= asset.budget) continue;

    if (asset.tier === 'obligation') {
      obligation.push(asset);
    } else {
      texture.push(asset);
    }
  }

  // Rank texture by deployment recency (least recently used first)
  texture.sort((a, b) => {
    const aLast = Math.max(-1, ...(deployedAssets[a.id] ?? []));
    const bLast = Math.max(-1, ...(deployedAssets[b.id] ?? []));
    return aLast - bLast;
  });

  // arcPosition is used in Phase 3 (§3.2) for register-matched voice fragment elevation.
  void arcPosition;

  return { obligationAtoms: obligation, textureAtoms: texture };
}
