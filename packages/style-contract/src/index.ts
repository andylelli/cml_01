/**
 * @cml/style-contract — the Style Contract: tone as an upstream contract signed once at grounding,
 * plus the deterministic usability signal that replaces Agent 6.5's word-count gate (Agent 6.5
 * redesign, documentation/12_system_redesign/12_agent_65_world_builder.md).
 *
 * Voice is not a late-stage synthesis problem gated on hitting 200 words — it's an axiom stated up
 * front and threaded into every generative agent. This package is the offline, additive Phase-0
 * foundation: the schema, the typed contract, the deterministic signing pass (enums from the user,
 * defaults derived from the premise), the one typed accessor every agent reads, and the structural
 * usability checks. The live Agent-9 conditioning thread, exemplar generation, and the
 * voice-distinctiveness / contract-conformance LLM-judges are the gated later phases (§4.2/§4.3).
 *
 * Pure, no LLM, NOT wired into the pipeline.
 */

export const packageName = "@cml/style-contract";

export type {
  Register,
  NarrativeDistance,
  SentenceRhythm,
  Diction,
  ProseConstraints,
  ExemplarPassage,
  StyleContract,
  StyleSpec,
} from "./types.js";

export { deriveStyleContract, validateStyleContract, assertStyleContract } from "./sign.js";
export { checkArcCoverage, themeIsAClaim, DEFAULT_ARC_BEATS } from "./usability.js";
export type { ArcCoverageResult } from "./usability.js";
export { readStyleContract, contractFingerprint, sameContract } from "./accessor.js";
