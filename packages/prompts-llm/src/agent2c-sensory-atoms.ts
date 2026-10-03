/**
 * Agent 2c's sensory-atom post-processor. It lived in Agent 9's phrase-analysis.ts, though only agent2c-run.ts calls it (code review A9V-16).
 */

/**
 * compileSensoryAtoms — post-processes Agent 2c location profiles so that
 * sensoryDetails arrays contain noun phrases only (no complete sentences).
 *
 * Agent 2c's LLM may still generate full sentences despite the schema instruction.
 * This deterministic transform strips grammatical structure from any entry that
 * looks like a sentence (> 60 chars or contains a verb/period), reducing it to
 * the core noun phrase. Called in agent2c-run.ts immediately after the agent
 * completes, before the profiles reach any downstream prompt builder.
 */
export function compileSensoryAtoms(profiles: any): any {
  if (!profiles) return profiles;

  const atomise = (val: string): string => {
    if (typeof val !== 'string') return val;
    // Already a short noun phrase — leave untouched
    if (val.length <= 55 && !/[.!?]/.test(val)) return val;
    let result = val
      // Strip leading article + subject ("The fire crackles" → "fire crackles")
      .replace(/^The\s+/i, '')
      // Strip from first present-tense verb pattern onward
      .replace(/\bprovide[sd]?\b.*$/i, '')
      .replace(/\bfill[sed]?\b.*$/i, '')
      .replace(/\blinger(?:s|ed|ing)?\b.*$/i, '')
      .replace(/\bwaft[sed]?\b.*$/i, '')
      .replace(/\bseep[sed]?\b.*$/i, '')
      .replace(/\bcarr(?:ies|y|ied)\b.*$/i, '')
      .replace(/\bhangs?\b.*$/i, '')
      .replace(/\bsit[s]?\b.*$/i, '')
      .replace(/\brest[s]?\b.*$/i, '')
      // Strip trailing clause extensions
      .replace(/,\s*(punctuated|interrupted|mingling|creating|offering|inviting|adding)[^,]*$/i, '')
      .replace(/\s*as\s+if\s+.*$/i, '')
      .replace(/\s*—\s+.*$/i, '')
      .replace(/\s*,\s+[a-z][^,]{20,}$/i, '') // trailing subordinate clause
      // Strip terminal punctuation
      .replace(/[.,;:!?]+$/, '')
      .trim();
    // If still long after stripping, keep only the first 5 tokens (noun phrase head)
    if (result.length > 55) {
      result = result.split(/\s+/).slice(0, 5).join(' ');
    }
    return result || val;
  };

  const SENSORY_KEYS = ['sights', 'sounds', 'smells', 'tactile'];

  const transformLocation = (loc: any): any => {
    if (!loc?.sensoryDetails) return loc;
    const sd = { ...loc.sensoryDetails };
    for (const key of SENSORY_KEYS) {
      if (Array.isArray(sd[key])) {
        sd[key] = (sd[key] as string[]).map(atomise);
      }
    }
    return { ...loc, sensoryDetails: sd };
  };

  return {
    ...profiles,
    keyLocations: Array.isArray(profiles.keyLocations)
      ? profiles.keyLocations.map(transformLocation)
      : profiles.keyLocations,
  };
}
