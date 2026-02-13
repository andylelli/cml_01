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
  detectiveType: string;
  victimArchetype: string;
  
  // Complexity
  complexityLevel: "simple" | "moderate" | "complex";
  mechanismFamilies: string[];
  hardLogicModes?: string[];
  difficultyMode?: "standard" | "increase" | "extreme";
  hardLogicDevices?: HardLogicDeviceIdea[];
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
}

export interface SeedPattern {
  id: string;
  axis: string;
  structure: {
    mechanismType: string;
    falseAssumptionPattern: string;
    constraintSpaceSize: number;
    inferencePathSteps: number;
    discriminatingTestMethod: string;
  };
}
