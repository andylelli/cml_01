import type { CastDesign } from "@cml/prompts-llm";

// ============================================================================
// Agent 2: Cast Design
// ============================================================================

export interface CastMember {
  name: string;
  age_range?: string;
  role_archetype?: string;
  relationships?: string[];
  public_persona?: string;
  private_secret?: string;
  motive_seed?: string;
  motive_strength?: string;
  alibi_window?: string;
  access_plausibility?: string;
  opportunity_channels?: string[];
  behavioral_tells?: string[];
  stakes?: string;
  evidence_sensitivity?: string[];
  culprit_eligibility?: string;
  culpability?: string;
}

export interface CastDesignOutput {
  cast: CastMember[];
}

export function adaptCastForScoring(castDesign: CastDesign): CastDesignOutput {
  interface RelationshipPair {
    character1: string;
    character2: string;
    relationship: string;
    tension: string;
  }

  const possibleCulprits = Array.isArray((castDesign as any)?.crimeDynamics?.possibleCulprits)
    ? (castDesign as any).crimeDynamics.possibleCulprits
    : [];
  const redHerrings = Array.isArray((castDesign as any)?.crimeDynamics?.redHerrings)
    ? (castDesign as any).crimeDynamics.redHerrings
    : [];
  // A_71 (A_70 §6) — accept BOTH shapes.
  //
  // `normalizeRelationshipWeb` now coerces at the source, but this adapter also runs over hydrated
  // artifacts from prior runs (A/B replays read a stored castDesign), and those hold the raw bare
  // array the model actually emits. Reading only `.pairs` is what produced an empty relationship
  // list for every character and pinned Cast Design's quality score at 60 with two 0-scored tests —
  // on a cast that had 9–15 fully-formed relationships. MEASURED across three runs.
  const rawRelationships = (castDesign as any)?.relationships;
  const relationshipPairs: RelationshipPair[] = Array.isArray(rawRelationships)
    ? (rawRelationships as RelationshipPair[])
    : Array.isArray(rawRelationships?.pairs)
      ? (rawRelationships.pairs as RelationshipPair[])
      : [];

  const cast: CastMember[] = castDesign.characters.map(ch => {
    // Derive culprit eligibility from the crimeDynamics block
    const isEligible = possibleCulprits.includes(ch.name);
    const isRedHerring = redHerrings.includes(ch.name);
    const culprit_eligibility = isEligible ? 'eligible' : 'ineligible';

    // Build relationship list from the relationship web
    const relationships = relationshipPairs
      .filter((p: RelationshipPair) => p.character1 === ch.name || p.character2 === ch.name)
      .map((p: RelationshipPair) => {
        const other = p.character1 === ch.name ? p.character2 : p.character1;
        return `${other}: ${p.relationship} (tension: ${p.tension})`;
      });

    return {
      name: ch.name,
      age_range: ch.ageRange,
      role_archetype: ch.roleArchetype,
      relationships,
      public_persona: ch.publicPersona,
      private_secret: ch.privateSecret,
      motive_seed: ch.motiveSeed,
      motive_strength: ch.motiveStrength,
      alibi_window: ch.alibiWindow,
      access_plausibility: ch.accessPlausibility,
      opportunity_channels: [],
      behavioral_tells: [],
      stakes: ch.stakes,
      evidence_sensitivity: [],
      culprit_eligibility,
      culpability: undefined,
    };
  });

  return { cast };
}
