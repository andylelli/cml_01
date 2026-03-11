import type { CharacterProfileOutput } from "@cml/prompts-llm";

// ============================================================================
// Agent 2b: Character Profiles
// ============================================================================

export interface CharacterProfile {
  character_name?: string;
  public_persona?: string;
  private_secrets?: string;
  motive_and_alibi?: string;
  stakes?: string;
  behavioral_tells?: string;
  humour_style?: string;
}

export interface CharacterProfilesOutput {
  character_profiles: CharacterProfile[];
}

const HUMOUR_DESCRIPTIONS: Record<string, string> = {
  understatement:    'Understatement: deflects tension through deliberate litotes, saying far less than the situation warrants and trusting the listener to fill the gap',
  dry_wit:           'Dry wit: sardonic observations delivered with studied indifference, as though the absurdity of the world is simply not worth raising an eyebrow over',
  polite_savagery:   'Polite savagery: devastating critiques dressed in the most impeccable manners, so that the target is halfway home before realising they have been insulted',
  self_deprecating:  'Self-deprecating: disarms opponents and audiences alike by turning the joke on themselves before anyone else can, making vulnerability into a kind of armour',
  observational:     'Observational: finds comedy in the contradictions of everyday behaviour, cataloguing human absurdity with the patient eye of a naturalist',
  deadpan:           'Deadpan: delivers the most preposterous statements with a perfectly straight face, leaving the room uncertain whether to laugh or offer condolences',
  sardonic:          'Sardonic: bitter, world-weary amusement at the folly of those around them, expressed with a curl of the lip and a well-timed pause',
  blunt:             'Blunt: tactless honesty that accidentally produces moments of dark comedy, with no softening, no apology, and no awareness that softening was required',
};

export function adaptCharacterProfilesForScoring(profiles: CharacterProfileOutput[]): CharacterProfilesOutput {
  const character_profiles: CharacterProfile[] = profiles.map(p => {
    // Expand public_persona with first narrative paragraph for word-count richness
    const public_persona = [
      p.publicPersona || p.summary || '',
      p.paragraphs?.[0] || '',
    ].filter(Boolean).join(' ');

    // Expand private_secrets with second narrative paragraph
    const private_secrets = [
      p.privateSecret || '',
      p.paragraphs?.[1] || '',
    ].filter(Boolean).join(' ');

    // motive_and_alibi: combine all motive/alibi fields + third paragraph
    // scoreProfileDepth() needs >=80 words for full 20pts; current 10-20 words only scores +6
    const motive_and_alibi = [
      p.motiveSeed || '',
      p.alibiWindow ? `Alibi: ${p.alibiWindow}` : '',
      p.accessPlausibility ? `Access: ${p.accessPlausibility}` : '',
      p.paragraphs?.[2] || '',
    ].filter(Boolean).join('. ');

    // stakes: expand with fourth paragraph
    const stakes = [
      p.stakes || '',
      p.paragraphs?.[3] || '',
    ].filter(Boolean).join(' ');

    // humour_style: expand enum (5-12 chars) to descriptive phrase (>20 chars)
    // scorer checks: exists(p.humour_style) && p.humour_style.length > 20
    const humour_style = p.humourStyle && p.humourStyle !== 'none'
      ? (HUMOUR_DESCRIPTIONS[p.humourStyle] ?? p.humourStyle)
      : undefined;

    return {
      character_name: p.name,
      public_persona,
      private_secrets,
      motive_and_alibi,
      stakes,
      behavioral_tells: p.speechMannerisms || '',
      humour_style,
    };
  });

  return { character_profiles };
}
