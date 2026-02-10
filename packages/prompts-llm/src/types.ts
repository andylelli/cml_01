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
  
  // Mystery structure
  primaryAxis: "temporal" | "spatial" | "identity" | "behavioral" | "authority";
  castSize: number;
  castNames: string[];
  detectiveType: string;
  victimArchetype: string;
  
  // Complexity
  complexityLevel: "simple" | "moderate" | "complex";
  mechanismFamilies: string[];
  
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
