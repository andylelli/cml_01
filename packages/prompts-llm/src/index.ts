/**
 * Prompts LLM Package - Templates for all 8 agents
 */

export { refineSetting } from "./agent1-setting.js";
export { designCast } from "./agent2-cast.js";
export { buildCMLPrompt, generateCML } from "./agent3-cml.js";
export { buildRevisionPrompt, reviseCml } from "./agent4-revision.js";
export { buildCluePrompt, extractClues } from "./agent5-clues.js";
export { buildFairPlayPrompt, auditFairPlay } from "./agent6-fairplay.js";
export { buildNarrativePrompt, formatNarrative } from "./agent7-narrative.js";
export { generateCharacterProfiles } from "./agent2b-character-profiles.js";
export { generateProse } from "./agent9-prose.js";
export { buildNoveltyPrompt, auditNovelty } from "./agent8-novelty.js";

export type {
  PromptMessages,
  CMLPromptInputs,
  CMLGenerationResult,
  SeedPattern,
} from "./types.js";

// Agent 1 types
export type { SettingInputs, SettingRefinement, SettingRefinementResult } from "./agent1-setting.js";

// Agent 2 types
export type { CastInputs, CharacterProfile, RelationshipWeb, CastDesign, CastDesignResult } from "./agent2-cast.js";

// Agent 4 types
export type { RevisionInputs, RevisionResult } from "./agent4-revision.js";

// Agent 5 types
export type { ClueExtractionInputs, Clue, RedHerring, ClueDistributionResult } from "./agent5-clues.js";

// Agent 6 types
export type { FairPlayAuditInputs, FairPlayCheck, FairPlayViolation, FairPlayAuditResult } from "./agent6-fairplay.js";

// Agent 7 types
export type { NarrativeFormattingInputs, Scene, ActStructure, NarrativeOutline } from "./agent7-narrative.js";
export type { CharacterProfilesInputs, CharacterProfilesResult, CharacterProfileOutput } from "./agent2b-character-profiles.js";
export type { ProseGenerationInputs, ProseGenerationResult, ProseChapter } from "./agent9-prose.js";

// Agent 8 types
export type { NoveltyAuditInputs, SimilarityScore, NoveltyAuditResult } from "./agent8-novelty.js";

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
