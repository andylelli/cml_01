/**
 * Type Adapters for Scoring System
 * 
 * Transforms agent outputs from @cml/prompts-llm into the format expected by
 * @cml/story-validation scorers.
 * 
 * Root Cause: Scorers were designed with expected output types (snake_case, CML structures)
 * but agents return different structures (camelCase, intermediate formats).
 * 
 * Solution: Adapter functions bridge the gap without modifying either package.
 */

import type { SettingRefinement } from "@cml/prompts-llm";
import type { CastDesign, CharacterProfile as AgentCharacterProfile, CharacterProfileOutput } from "@cml/prompts-llm";
import type { BackgroundContextArtifact } from "@cml/prompts-llm";
import type { HardLogicDeviceIdea } from "@cml/prompts-llm";
import type { NarrativeOutline } from "@cml/prompts-llm";
import type { KeyLocation } from "@cml/prompts-llm";
import type { TemporalContextResult } from "@cml/prompts-llm";

// ============================================================================
// Agent 1: Setting Refinement
// ============================================================================

export interface SettingRefinementOutput {
  locations?: {
    name?: string;
    layout?: string;
    key_features?: string[];
    clue_placements?: Array<{
      clue_id?: string;
      location?: string;
      physical_justification?: string;
    }>;
  }[];
  physical_constraints?: string;
  accessibility_notes?: string;
}

export function adaptSettingForScoring(setting: SettingRefinement): SettingRefinementOutput {
  // Extract location information from setting structure
  const locations = setting.location ? [{
    name: setting.location.type || '',
    layout: setting.location.description || '',
    key_features: setting.location.physicalConstraints || [],
    clue_placements: [] // Not available in SettingRefinement
  }] : [];

  return {
    locations,
    physical_constraints: setting.location?.physicalConstraints?.join('; ') || '',
    accessibility_notes: setting.location?.geographicIsolation || '',
  };
}

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

export function adaptCastForScoring(characters: AgentCharacterProfile[]): CastDesignOutput {
  const cast: CastMember[] = characters.map(ch => ({
    name: ch.name,
    age_range: ch.ageRange,
    role_archetype: ch.roleArchetype,
    relationships: [], // Not directly available in CharacterProfile
    public_persona: ch.publicPersona,
    private_secret: ch.privateSecret,
    motive_seed: ch.motiveSeed,
    motive_strength: ch.motiveStrength,
    alibi_window: ch.alibiWindow,
    access_plausibility: ch.accessPlausibility,
    opportunity_channels: [], // Not available
    behavioral_tells: [], // Not available
    stakes: ch.stakes,
    evidence_sensitivity: [], // Not available
    culprit_eligibility: undefined, // Not available
    culpability: undefined, // Not available
  }));

  return { cast };
}

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

export function adaptCharacterProfilesForScoring(profiles: CharacterProfileOutput[]): CharacterProfilesOutput {
  const character_profiles: CharacterProfile[] = profiles.map(p => ({
    character_name: p.name,
    public_persona: p.publicPersona || p.summary,
    private_secrets: p.privateSecret,
    motive_and_alibi: `${p.motiveSeed || ''} / ${p.alibiWindow || ''}`,
    stakes: p.stakes,
    behavioral_tells: p.speechMannerisms || '',
    humour_style: p.humourStyle || '',
  }));

  return { character_profiles };
}

// ============================================================================
// Agent 2c: Location Profiles
// ============================================================================

export interface LocationProfile {
  location_name?: string;
  layout_description?: string;
  sensory_details?: string;
  functional_purpose?: string;
  accessibility?: string;
  clue_placement_opportunities?: string[];
}

export interface LocationProfilesOutput {
  location_profiles: LocationProfile[];
}

export function adaptLocationsForScoring(keyLocations: KeyLocation[]): LocationProfilesOutput {
  const location_profiles: LocationProfile[] = keyLocations.map(loc => ({
    location_name: loc.name,
    layout_description: loc.visualDetails || '',
    sensory_details: [
      ...(loc.sensoryDetails?.sights || []),
      ...(loc.sensoryDetails?.sounds || []),
      ...(loc.sensoryDetails?.smells || [])
    ].join('; '),
    functional_purpose: loc.purpose || '',
    accessibility: loc.accessControl || '',
    clue_placement_opportunities: [], // Not available in KeyLocation
  }));

  return { location_profiles };
}

// ============================================================================
// Agent 2d: Temporal Context
// ============================================================================

export interface ScorerTemporalContextOutput {
  specific_date?: string;
  time_of_day?: string;
  season?: string;
  weather_patterns?: string;
  fashion_and_attire?: string;
  seasonal_activities?: string;
}

export function adaptTemporalContextForScoring(temporal: TemporalContextResult): ScorerTemporalContextOutput {
  return {
    specific_date: `${temporal.specificDate.year}-${temporal.specificDate.month}${temporal.specificDate.day ? '-' + temporal.specificDate.day : ''}`,
    time_of_day: temporal.specificDate.era || '',
    season: temporal.seasonal.season || '',
    weather_patterns: temporal.seasonal.weather?.join(', ') || '',
    fashion_and_attire: `Men's: ${temporal.fashion.mensWear?.formal?.join(', ') || ''} / Women's: ${temporal.fashion.womensWear?.formal?.join(', ') || ''}`,
    seasonal_activities: temporal.seasonal.seasonalActivities?.join(', ') || '',
  };
}

// ============================================================================
// Agent 2e: Background Context
// ============================================================================

export interface BackgroundContextOutput {
  era_background?: {
    decade?: string;
    tech_capabilities?: string[];
    forensic_capabilities?: string[];
    communications?: string[];
    transportation?: string[];
    social_norms?: string[];
  };
  location_background?: {
    location_type?: string;
    physical_constraints?: string[];
    security_features?: string[];
    accessibility?: string[];
    atmosphere?: string[];
  };
  constraints?: {
    prohibited_anachronisms?: string[];
    required_period_elements?: string[];
  };
}

export function adaptBackgroundContextForScoring(bg: BackgroundContextArtifact): BackgroundContextOutput {
  return {
    era_background: {
      decade: bg.era.decade || '',
      tech_capabilities: [],
      forensic_capabilities: [],
      communications: [],
      transportation: [],
      social_norms: bg.era.socialStructure ? [bg.era.socialStructure] : [],
    },
    location_background: {
      location_type: bg.setting.location || '',
      physical_constraints: [],
      security_features: [],
      accessibility: [],
      atmosphere: bg.setting.weather ? [bg.setting.weather] : [],
    },
    constraints: {
      prohibited_anachronisms: [],
      required_period_elements: bg.castAnchors || [],
    },
  };
}

// ============================================================================
// Agent 3b: Hard Logic Devices
// ============================================================================

export interface HardLogicDevice {
  id: string;
  name?: string;
  type?: string;
  description?: string;
  why_necessary?: string;
  implications?: string[];
  red_herring_potential?: string;
}

export interface HardLogicOutput {
  hard_logic_devices: HardLogicDevice[];
}

export function adaptHardLogicForScoring(devices: HardLogicDeviceIdea[]): HardLogicOutput {
  const hard_logic_devices: HardLogicDevice[] = devices.map((d, index) => ({
    id: `device_${index + 1}`,
    name: d.title,
    type: d.principleType,
    description: `${d.surfaceIllusion} → ${d.underlyingReality}`,
    why_necessary: d.corePrinciple,
    implications: d.fairPlayClues || [],
    red_herring_potential: d.whyNotTrope || '',
  }));

  return { hard_logic_devices };
}

// ============================================================================
// Agent 7: Narrative Outline
// ============================================================================

export interface ScorerChapter {
  chapter_number?: number;
  chapter_title?: string;
  scenes?: Array<{
    scene_id?: string;
    location?: string;
    characters_present?: string[];
    action?: string;
  }>;
  clues_introduced?: string[];
}

export interface ScorerNarrativeOutlineOutput {
  chapters: ScorerChapter[];
  discriminating_test_scene?: {
    chapter_number?: number;
    scene_id?: string;
    description?: string;
  };
}

export function adaptNarrativeForScoring(narrative: NarrativeOutline): ScorerNarrativeOutlineOutput {
  // Transform acts and scenes into chapters structure
  const chapters: ScorerChapter[] = (narrative.acts || []).flatMap((act, actIndex) => {
    return (act.scenes || []).map((scene, sceneIndex) => {
      const chapterNum = actIndex * 10 + sceneIndex + 1; // Unique chapter numbers
      return {
        chapter_number: chapterNum,
        chapter_title: scene.title || `Scene ${scene.sceneNumber}`,
        scenes: [{
          scene_id: `scene_${scene.sceneNumber}`,
          location: scene.setting?.location || '',
          characters_present: scene.characters || [],
          action: scene.summary || scene.purpose || '',
        }],
        clues_introduced: scene.cluesRevealed || [],
      };
    });
  });

  return {
    chapters,
    discriminating_test_scene: undefined, // Not available in NarrativeOutline
  };
}

// ============================================================================
// Agent 9: Prose Generation
// ============================================================================

export interface ChapterProse {
  number: number;
  title: string;
  prose: string;
}

export interface ProseOutput {
  chapters: ChapterProse[];
}

export function adaptProseForScoring(proseChapters: any[]): ProseOutput {
  const chapters: ChapterProse[] = proseChapters.map((ch: any) => ({
    number: ch.number || 0,
    title: ch.title || '',
    prose: ch.paragraphs?.join('\n\n') || ch.prose || '',
  }));

  return { chapters };
}
