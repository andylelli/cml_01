/**
 * Location name consistency validation.
 * Builds a canonical name registry from CML location_profiles and
 * flags non-canonical name variants used in prose chapters.
 */

import type { Story, ValidationError, CMLData } from './types.js';

/**
 * Build a map of lowercase variant → canonical name from location profiles.
 */
export function buildLocationRegistry(cml: CMLData): Map<string, string> {
  const registry = new Map<string, string>();
  const lp = cml.locationProfiles;
  if (!lp) return registry;

  const register = (canonical: string) => {
    registry.set(canonical.toLowerCase(), canonical);
    // Without leading article
    const noArticle = canonical.replace(/^the\s+/i, '');
    if (noArticle !== canonical) {
      registry.set(noArticle.toLowerCase(), canonical);
    }
    // Hyphenated variant
    const hyphenated = canonical.toLowerCase().replace(/\s+/g, '-');
    if (hyphenated !== canonical.toLowerCase()) {
      registry.set(hyphenated, canonical);
    }
  };

  if (lp.primary?.name) {
    register(lp.primary.name);
  }

  const keyLocations = lp.keyLocations ?? [];
  for (const loc of keyLocations) {
    if (loc.name) {
      register(loc.name);
    }
  }

  return registry;
}

/**
 * Pre-validation prose normaliser: substitute lowercase location name variants
 * with their canonical capitalised forms from the CML location registry.
 * Run this on the prose object BEFORE StoryValidationPipeline so the validator
 * sees the canonical form and does not emit location_name_variant issues.
 */
export function normalizeLocationNames(prose: any, registry: Map<string, string>): any {
  if (registry.size === 0) return prose;

  // Build a single combined regex from all variants, sorted longest-first so that
  // "the drawing room" is tried before "drawing room" at each text position.
  // This prevents the two-pass problem where replacing "the drawing room" → "The Drawing Room"
  // then lets a second replacement of "drawing room" produce "The The Drawing Room".
  const entries = [...registry.entries()].filter(([v]) => v.length > 3);
  if (entries.length === 0) return prose;

  entries.sort((a, b) => b[0].length - a[0].length); // longest variant first

  const combinedPattern = new RegExp(
    entries.map(([v]) => `\\b${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`).join('|'),
    'gi',
  );

  const chapters = (prose.chapters as any[]).map((chapter: any) => {
    const paragraphs = (chapter.paragraphs as string[]).map((p: string) => {
      return p.replace(combinedPattern, (match) => {
        const canonical = registry.get(match.toLowerCase());
        // Only substitute when the match is not already the exact canonical form
        return canonical && match !== canonical ? canonical : match;
      });
    });
    return { ...chapter, paragraphs };
  });

  return { ...prose, chapters };
}

/**
 * Check that location names in prose match the canonical names from CML location profiles.
 * Flags non-canonical variants (e.g. "drawing room" vs canonical "Drawing Room").
 */
export function validateLocationConsistency(story: Story, cml?: CMLData): ValidationError[] {
  if (!cml?.locationProfiles) return [];

  const registry = buildLocationRegistry(cml);
  if (registry.size === 0) return [];

  const errors: ValidationError[] = [];

  for (const scene of story.scenes) {
    const text = scene.text ?? '';
    const flaggedVariants = new Set<string>();

    for (const [variant, canonical] of registry) {
      // Skip very short names (≤3 chars) to avoid false positives
      if (variant.length <= 3) continue;

      const escaped = variant.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const variantRegex = new RegExp(`\\b${escaped}\\b`, 'gi');
      const matches = text.match(variantRegex) ?? [];

      for (const match of matches) {
        // Only flag if the match differs in case from the canonical name
        // and isn't just a lowercase usage within dialogue/narration
        if (match !== canonical && !flaggedVariants.has(variant)) {
          // Don't flag if the match is already an exact case match of the canonical
          if (match.toLowerCase() === canonical.toLowerCase() && match !== canonical) {
            flaggedVariants.add(variant);
            errors.push({
              type: 'location_name_variant',
              message: `Chapter ${scene.number}: "${match}" should be "${canonical}" (non-canonical location name)`,
              severity: 'moderate',
              sceneNumber: scene.number,
            });
            break;
          }
        }
      }
    }
  }

  return errors;
}
