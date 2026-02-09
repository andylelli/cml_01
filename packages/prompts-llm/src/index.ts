/**
 * Prompts LLM Package - Templates for all 8 agents
 */

export { buildCMLPrompt, generateCML } from "./agent3-cml.js";

export type {
  PromptMessages,
  CMLPromptInputs,
  CMLGenerationResult,
  SeedPattern,
} from "./types.js";

// Shared exports for other agents (will expand in future)
export {
  MYSTERY_EXPERT_SYSTEM,
  CML_SPECIALIST_SYSTEM,
  GROUNDING_PRINCIPLE,
  FAIR_PLAY_CHECKLIST,
} from "./shared/system.js";

export {
  buildEraConstraints,
  buildLocationConstraints,
} from "./shared/constraints.js";

export {
  CML_2_0_SCHEMA_SUMMARY,
  AXIS_TYPE_DESCRIPTIONS,
} from "./shared/schemas.js";

export {
  loadSeedCMLFiles,
  extractStructuralPatterns,
  selectRelevantPatterns,
  formatPatternsForPrompt,
} from "./utils/seed-loader.js";
