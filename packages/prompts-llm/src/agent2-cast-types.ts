/**
 * Agent 2 cast types — a LEAF module (no imports), so agent2-cast-checker.ts can name them without importing the generator that imports it (code review A1X-13). agent2-cast.ts re-exports them.
 */

export interface CastInputs {
  runId: string;
  projectId: string;
  /** Required (A1X-15, CR-30): runAgent2 always supplies names; the no-names prompt branch was retired. */
  characterNames: string[];
  /** Gender lock map: name → 'male' | 'female'. When provided alongside characterNames,
   * the cast designer is instructed to treat these gender assignments as non-negotiable. */
  characterGenders?: Record<string, 'male' | 'female'>;
  castSize?: number; // Fallback count when characterNames is empty
  setting: string; // Era + location context
  crimeType: string; // Murder, theft, etc.
  tone: string; // Golden age, noir, cozy, etc.
  socialContext?: string; // Class structure, institution type
  detectiveType?: 'police' | 'private' | 'amateur'; // Archetype of the investigator character
  qualityGuardrails?: string[]; // Optional quality constraints (e.g., schema repair instructions)
  /** A world the cast draws on ("a racing stable", "a by-election"). Occupations and stakes, not the method. */
  storyAngle?: string;
}

export interface CharacterProfile {
  name: string;
  ageRange: string;
  occupation: string;
  roleArchetype: string;
  publicPersona: string;
  privateSecret: string;
  motiveSeed: string;
  motiveStrength: "weak" | "moderate" | "strong" | "compelling";
  alibiWindow: string;
  accessPlausibility: "impossible" | "unlikely" | "possible" | "easy";
  stakes: string;
  characterArcPotential: string;
  // Schema allows male and female values (A_73 §40).
  /**
   * A_73 §40 — BINARY BY DESIGN, and the whole pipeline now agrees.
   *
   * These are Golden Age detective novels set 1930s-1950s, written to that genre's conventions.
   * The cast presents as the fiction of that period does.
   *
   * It also closes a real defect. `getPronounsForGender` mapped anything non-binary to they/them,
   * while `normalizePronounGender` dropped such a character from the scan and `detectAttributionFlips`
   * matches only /(he|she)/ — so a non-binary character was handed pronouns nothing could then check.
   * MEASURED on story_20260825-2102: the reader saw consistent they/them for Dr. Mallory Finch while
   * the canary inputs pinned Finch FEMALE. The prose contradicted a pinned input and every pronoun
   * detector was blind to it. Two genders everywhere makes the binary detectors correct rather than
   * partial.
   */
  gender?: 'male' | 'female';
  // A_52 role model: the fair-play cast has exactly one detective and one victim (both
  // first-class, fixed roles) and n-2 suspects. The culprit is a hidden attribute of ONE
  // suspect (assigned downstream by Agent 3), NOT a role here. Optional so legacy/LLM output
  // without the field still validates — the deterministic invariant resolves/repairs it.
  role?: 'detective' | 'victim' | 'suspect';
}

export interface RelationshipWeb {
  pairs: Array<{
    character1: string;
    character2: string;
    relationship: string;
    tension: "none" | "low" | "moderate" | "high";
    sharedHistory: string;
  }>;
}

export interface CastDesign {
  characters: CharacterProfile[];
  relationships: RelationshipWeb;
  diversity: {
    stereotypeCheck: string[];
    recommendations: string[];
  };
  crimeDynamics: {
    possibleCulprits: string[];
    redHerrings: string[];
    victimCandidates: string[];
    detectiveCandidates: string[];
  };
}

export interface CastDesignResult {
  cast: CastDesign;
  attempt: number;
  latencyMs: number;
  cost: number;
}
