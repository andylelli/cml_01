/**
 * @cml/device-library — curated, era-annotated hard-logic mechanism patterns + deterministic
 * retrieval and feasibility services.
 *
 * First increment of the Agent 3b redesign
 * (documentation/12_system_redesign/08_agent_3b_hard_logic_devices.md §9.7): the data asset every
 * later phase recombines against, plus the cheap retrieval filter (Spike A) and the deterministic
 * feasibility gate (§4.3) — the value the current free-ideation 3b never checks.
 *
 * Pure, zero pipeline wiring. The recombination LLM call (§4.2) and CML binding checker (§4.4) are
 * later phases gated on P2 structured-output + the Agent 3 typed core.
 */

export const packageName = "@cml/device-library";

export type {
  MechanismFamily,
  CmlAxis,
  PrincipleType,
  PatternFeasibility,
  PatternUsage,
  DevicePattern,
  RetrievalQuery,
  RankedPattern,
  EraCapabilityOracle,
  FeasibilityResult,
} from "./types.js";

export { loadPatterns, listPatternIds, validatePatternData } from "./loader.js";
export { retrievePatterns, noveltyScore } from "./retrieve.js";
export { checkFeasibility } from "./feasibility.js";
export { eraCapabilities, makeStubOracle, CAPABILITY_AVAILABLE_FROM } from "./era-capabilities.js";
