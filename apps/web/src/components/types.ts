// Type definitions for component interfaces
// These are re-exported from the Vue components for better TypeScript support

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorItem {
  id: string;
  timestamp: number;
  severity: ErrorSeverity;
  scope: string;
  message: string;
  details?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AllValidation {
  setting: ValidationResult;
  cast: ValidationResult;
  cml: ValidationResult;
  clues: ValidationResult;
  outline: ValidationResult;
}

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ProseData {
  status: string;
  tone?: string;
  chapters: ProseChapter[];
  cast?: string[];
  note?: string;
}

export interface CharacterProfile {
  name: string;
  summary?: string;
  publicPersona?: string;
  privateSecret?: string;
  motiveSeed?: string;
  alibiWindow?: string;
  accessPlausibility?: string;
  stakes?: string;
  paragraphs: string[];
  order?: number;
}

export interface CharacterProfilesData {
  status: string;
  tone?: string;
  targetWordCount?: number;
  profiles: CharacterProfile[];
  note?: string;
}

export interface LocationProfilesData {
  primary: {
    name: string;
    type: string;
    place: string;
    country: string;
    summary: string;
    paragraphs: string[];
  };
  keyLocations: Array<{
    name: string;
    type: string;
    description: string;
    paragraphs: string[];
    sensoryDetails?: {
      sights?: string[];
      sounds?: string[];
      smells?: string[];
      tactile?: string[];
    };
    accessibility?: {
      publicAccess?: boolean;
      whoCanEnter?: string[];
      restrictions?: string[];
    };
  }>;
  atmosphere: {
    mood: string;
    weather: string;
    eraMarkers: string[];
    sensoryPalette: string[];
  };
}

export interface TemporalContextData {
  specificDate: {
    year: number;
    month: string;
    day?: number;
    era: string;
  };
  seasonal: {
    season: string;
    month: string;
    weather: string[];
    daylight: string;
    holidays: string[];
    seasonalActivities: string[];
  };
  fashion: {
    mensWear: {
      formal: string[];
      casual: string[];
      accessories: string[];
    };
    womensWear: {
      formal: string[];
      casual: string[];
      accessories: string[];
    };
    trendsOfTheMoment: string[];
    socialExpectations: string[];
  };
  currentAffairs: {
    majorEvents: string[];
    politicalClimate: string;
    economicConditions: string;
    socialIssues: string[];
    internationalNews: string[];
  };
  cultural: {
    entertainment: {
      popularMusic: string[];
      films: string[];
      theater: string[];
      radio: string[];
    };
    literature: {
      recentPublications: string[];
      popularGenres: string[];
    };
    technology: {
      recentInventions: string[];
      commonDevices: string[];
      emergingTrends: string[];
    };
    dailyLife: {
      typicalPrices: string[];
      commonActivities: string[];
      socialRituals: string[];
    };
  };
  socialAttitudes: {
    class: string[];
    gender: string[];
    race: string[];
    generalNorms: string[];
  };
  atmosphericDetails: string[];
  paragraphs: string[];
}

export interface HardLogicDevice {
  title: string;
  corePrinciple: string;
  principleType: "physical_law" | "mathematical_principle" | "cognitive_bias" | "social_logic";
  surfaceIllusion: string;
  underlyingReality: string;
  fairPlayClues: string[];
  whyNotTrope: string;
  variationEscalation: string;
  mechanismFamilyHints: string[];
  modeTags?: string[];
}

export interface HardLogicDevicesData {
  status: "ok" | string;
  overview: string;
  devices: HardLogicDevice[];
}

export interface BackgroundContextData {
  status: "ok" | string;
  backdropSummary: string;
  era: {
    decade: string;
    socialStructure?: string;
  };
  setting: {
    location: string;
    institution: string;
    weather?: string;
  };
  castAnchors: string[];
  theme?: string;
}

export interface RunEvent {
  step: string;
  message: string;
}

export interface NoveltyAuditData {
  status: "pass" | "fail" | "warn";
  seedIds: string[];
  patterns?: Array<{
    seed: string;
    similarity: number;
    matches: string[];
  }>;
  summary?: string;
}

// Tab navigation types
export type TabStatus = "complete" | "error" | "in-progress" | "locked" | "available";

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface SubTab extends Tab {
  parentId: string;
}
