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
  const relationshipPairs: RelationshipPair[] = Array.isArray((castDesign as any)?.relationships?.pairs)
    ? (castDesign as any).relationships.pairs as RelationshipPair[]
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
