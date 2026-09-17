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

/**
 * A character, as Agent 2b writes them.
 *
 * ── THE TWO TIERS, AND THEY ARE MEASURED RATHER THAN ASSUMED ──────────────────────────────────
 *
 * Some of this is backstory a reader can have BEFORE the book; the rest gives the answer away. The
 * split below was established by checking real payloads, not by reading field names — `paragraphs`
 * looks like harmless colour and is not: one profile's second paragraph opened "His affair with
 * Annabelle Marwood was a dangerous dance", which is verbatim what `privateSecret` holds.
 *
 * `src/spec/spoilers.ts` enforces the split and has a test that scans real shapes for leaks.
 */
export interface CharacterProfile {
  name: string;
  /** SAFE — who they are at a glance. */
  summary?: string;
  /** SAFE — how they appear to others. */
  publicPersona?: string;
  /** SAFE — how they talk. */
  speechMannerisms?: string;
  /** SAFE — their one quotable line. */
  signatureTic?: string;
  /** SAFE — the tension they carry, without naming what caused it. */
  internalConflict?: string;
  /** SAFE — dry wit, deadpan, polite savagery. */
  humourStyle?: string;
  humourLevel?: number;

  /** SPOILER — what they are hiding. */
  privateSecret?: string;
  /** SPOILER — why they might have done it. */
  motiveSeed?: string;
  motiveStrength?: string | number;
  /** SPOILER — where they say they were. */
  alibiWindow?: string;
  /** SPOILER — whether they could have. */
  accessPlausibility?: string;
  /** SPOILER — what they stand to lose. */
  stakes?: string;
  /** SPOILER — what the investigation threatens for them specifically. */
  personalStakeInCase?: string;
  /** SPOILER — the long-form profile. Contains the secret; see the note above. */
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
  /**
   * MEASURED against a real payload, 2026-09-17: this shape was wrong. It declared `description`
   * and an `accessibility` object; the pipeline emits `purpose`, `visualDetails` and a plain-string
   * `accessControl`. Anything rendering the declared fields drew nothing, silently, because an
   * absent optional is not a type error.
   *
   * `purpose` is the one SPOILER field here — it reads "Crime scene". Everything else on a location,
   * including its paragraphs, is safe backstory.
   */
  keyLocations: Array<{
    id?: string;
    name: string;
    type: string;
    /** "Crime scene", "Servants' hall" — SPOILER. Gate it. */
    purpose?: string;
    visualDetails?: string;
    paragraphs: string[];
    sensoryDetails?: {
      sights?: string[];
      sounds?: string[];
      smells?: string[];
      tactile?: string[];
    };
    sensoryVariants?: Record<string, unknown>;
    /** Who may enter, as prose. */
    accessControl?: string;
  }>;
  atmosphere: {
    mood: string;
    weather: string;
    era?: string;
    timeFlow?: string;
    eraMarkers: string[];
    sensoryPalette: string[];
    paragraphs?: string[];
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

// ============================================================================
// Scoring & Reporting types (mirrors packages/story-validation/src/scoring/types.ts)
// ============================================================================

export interface ScoringTestResult {
  name: string;
  category: "validation" | "quality" | "completeness" | "consistency";
  passed: boolean;
  score: number;
  weight: number;
  message?: string;
  severity?: "critical" | "major" | "moderate" | "minor";
}

export interface ScoringPhaseScore {
  agent: string;
  validation_score: number;
  quality_score: number;
  completeness_score: number;
  consistency_score: number;
  total: number;
  grade: "A" | "B" | "C" | "D" | "F";
  passed: boolean;
  tests: ScoringTestResult[];
  breakdown?: unknown;
  component_failures?: string[];
  failure_reason?: string;
}

export interface ScoringPhaseReport {
  agent: string;
  phase_name: string;
  score: ScoringPhaseScore;
  duration_ms: number;
  cost: number;
  threshold: number;
  passed: boolean;
  tests: ScoringTestResult[];
  breakdown?: unknown;
  retry_count?: number;
  max_retries?: number;
  retry_history?: Array<{
    attempt: number;
    timestamp: string;
    reason: string;
    score_before?: number;
    backoff_ms?: number;
  }>;
  errors?: string[];
}

export interface GenerationReport {
  project_id: string;
  run_id: string;
  generated_at: string;
  total_duration_ms: number;
  /** GBP — see A_73 §20.1. Rendered as `£` in ScoreCard.vue; it was `$` until 2026-08-24. */
  total_cost: number;
  overall_score: number;
  overall_grade: string;
  passed: boolean;
  run_outcome?: "passed" | "failed" | "aborted" | "infra_failure";
  run_outcome_reason?: string;
  scoring_outcome?: {
    score: number;
    grade: string;
    passed_threshold: boolean;
  };
  release_gate_outcome?: {
    /** "warning" = shipped needs-review (0 hard stops, gate warnings) — counts as shipped. */
    status: "passed" | "warning" | "failed" | "unknown";
    hard_stop_count: number;
    warning_count: number;
  };
  phases: ScoringPhaseReport[];
  diagnostics?: Array<{
    key: string;
    agent: string;
    phase_name: string;
    diagnostic_type: string;
    captured_at: string;
    details: Record<string, unknown>;
  }>;
  summary: {
    phases_passed: number;
    phases_failed: number;
    total_phases: number;
    pass_rate: number;
    weakest_phase: string;
    strongest_phase: string;
    retry_stats: {
      total_retries: number;
      phases_retried: number;
      retry_rate: string;
      retried_phases: Array<{ agent: string; retry_count: number; max_retries: number }>;
    };
    total_cost: number;
  };
  threshold_config: {
    mode: "strict" | "standard" | "lenient";
    overrides?: Record<string, number>;
  };
}
