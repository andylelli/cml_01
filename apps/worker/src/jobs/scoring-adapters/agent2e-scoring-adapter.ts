import type { BackgroundContextArtifact, SettingRefinement } from "@cml/prompts-llm";

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

export function adaptBackgroundContextForScoring(
  bg: BackgroundContextArtifact,
  setting: SettingRefinement
): BackgroundContextOutput {
  // Social norms: merge the setting's socialNorms array with the backdrop's socialStructure
  const social_norms = [
    ...(setting.era.socialNorms || []),
    ...(bg.era.socialStructure ? [bg.era.socialStructure] : []),
  ];

  // Atmosphere: weather, mood and any backdrop weather
  const atmosphere = [
    setting.atmosphere.weather,
    setting.atmosphere.mood,
    ...(bg.setting.weather ? [bg.setting.weather] : []),
  ].filter((s): s is string => Boolean(s));

  return {
    era_background: {
      decade: bg.era.decade || setting.era.decade || '',
      tech_capabilities: setting.era.technology || [],
      forensic_capabilities: setting.era.forensics || [],
      communications: setting.era.communication || [],
      transportation: setting.era.transportation || [],
      social_norms,
    },
    location_background: {
      location_type: bg.setting.location || setting.location.type || '',
      physical_constraints: setting.location.physicalConstraints || [],
      security_features: setting.location.accessControl?.slice(0, 5) || [],
      accessibility: setting.location.accessControl || [],
      atmosphere,
    },
    constraints: {
      prohibited_anachronisms: setting.realism?.anachronisms || [],
      required_period_elements: bg.castAnchors || [],
    },
  };
}
