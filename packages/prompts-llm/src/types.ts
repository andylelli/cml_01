/**
 * Types for LLM prompt generation
 */

import type { Message } from "@cml/llm-client";

export interface PromptMessages {
  system: string;
  developer?: string;
  user: string;
  messages: Message[];
}

export interface PromptComponents {
  system: string;
  developer: string;
  user: string;
  messages?: Array<{ role: "system" | "user"; content: string }>;
}

export interface CMLPromptInputs {
  // User specification
  decade: string;
  location: string;
  institution: string;
  tone: string;
  weather: string;
  socialStructure: string;
  theme?: string;
  
  // Mystery structure
  primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
  castSize: number;
  castNames: string[];
  // Era constraint: CML stories are set in the 1930s–1950s Golden Age of detective fiction.
  // Gender identity was binary in this era — 'non-binary' is not a valid gender value.
  castGenders?: Record<string, string>; // name → 'male' | 'female'
  detectiveType: string;
  victimArchetype: string;
  // Names that MUST NOT appear in culpability.culprits[] — victims and detectives.
  // Passed on collision-repair retries to prevent the LLM from re-assigning a victim/detective as culprit.
  culpritExclusionNames?: string[];
  
  // Complexity
  complexityLevel: "simple" | "moderate" | "complex";
  mechanismFamilies: string[];
  hardLogicModes?: string[];
  difficultyMode?: "standard" | "increase" | "extreme";
  hardLogicDevices?: HardLogicDeviceIdea[];
  /**
   * The device's LOCKED FACTS — the values Agent 3b fixed and the prose injector will print verbatim.
   *
   * REVIEW_04 §4.4 / §11.2. Agent 3 previously received the device's mechanism FAMILY and never its
   * locked times, so it authored `apparent_time_of_death` blind to the clock the story would actually
   * show. Measured on the 08-04 run: the case said 8:15 / 7:15, the manuscript printed 3:45 and 4:10,
   * and **neither of the case's anchors appeared anywhere in the finished story**. Two agents
   * inventing times from non-overlapping inputs, with nothing reconciling them.
   *
   * Consumed only when `AGENT3_DEVICE_TIME_BINDING` is on; absent or empty, the prompt is unchanged.
   */
  lockedFacts?: Array<{ id: string; value: string; description?: string }>;
  backgroundContext?: BackgroundContextInput;
  
  // Novelty constraints
  noveltyConstraints?: {
    divergeFrom: string[];
    areas: string[];
    avoidancePatterns: string[];
  };
  
  // Context
  runId: string;
  projectId: string;
}

export interface HardLogicDeviceIdea {
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
  moralAmbiguity?: string;
  lockedFacts?: Array<{ id: string; value: string; description: string; appearsInChapters?: string[] }>;
}

export interface BackgroundContextInput {
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

export interface CMLGenerationResult {
  cml: any; // CML object
  validation: {
    valid: boolean;
    errors: string[];
  };
  attempt: number;
  latencyMs: number;
  cost: number;
  revisedByAgent4?: boolean; // Whether Agent 4 was called to fix validation errors
  revisionDetails?: {
    attempts: number; // Number of Agent 4 revision attempts
    revisionsApplied: string[]; // List of revisions made
  };
  /** True when revision exhausted its budget and we returned best-so-far instead of throwing. */
  degraded?: boolean;
  /** Unresolved validation/logic errors carried forward when degraded (for downstream/review). */
  unresolvedLogicWarnings?: string[];
  /**
   * What normalization had to INVENT because the model did not supply it — most consequentially, the
   * culprit. Surfaced on the run warnings by `agent3-run`.
   *
   * A silent normalizer that fabricates the answer to the mystery is indistinguishable, on the
   * report, from a model that answered it. That is how run 20260802-1654 shipped a positionally-chosen
   * culprit who was also the falsely accused suspect, survived a full external review, and had the
   * defect attributed to the prose.
   */
  normalizationNotes?: string[];
}

export interface SeedPattern {
  id: string;
  /** Display title where the case has one; falls back to the id. */
  title: string;
  axis: string;
  structure: {
    mechanismType: string;
    falseAssumptionPattern: string;
    constraintSpaceSize: number;
    inferencePathSteps: number;
    discriminatingTestMethod: string;
  };
  /**
   * A_79 B — the fields that make an exemplar an exemplar.
   *
   * The five `structure` fields above are counts and one-word labels; three of them were also
   * unreadable (A_78 §3). None of them can teach a generator what a mystery IS. These four carry the
   * worked content: the wrong belief, how the trick actually operated, the shape of the deduction and
   * how the truth was forced.
   */
  content: {
    premise: string;
    falseAssumptionStatement: string;
    mechanismDescription: string;
    inferenceSketch: string;
    discriminatingTestDesign: string;
  };
}
