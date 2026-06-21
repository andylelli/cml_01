/**
 * @cml/cml-core — typed logical core for CML + deterministic fair-play engines.
 *
 * Keystone (P1) of the Agent 3 redesign
 * (documentation/12_system_redesign/07_agent_3_cml_generator.md). The bet: a fair-play whodunit
 * is a small theorem, and timeline-consistency / deducibility / solution-uniqueness are
 * *decidable* — so the LLM can propose and a deterministic engine can verify, instead of one LLM
 * holding the whole proof in its head and downstream auditors hoping to catch the gaps.
 *
 * Pure, zero external deps, NOT yet wired into the pipeline (the §9.1 go/no-go spike).
 */

export const packageName = "@cml/cml-core";

export type {
  Minutes,
  Interval,
  EntityId,
  PersonRole,
  Person,
  Place,
  Entity,
  CrimeSpec,
  PresenceObservation,
  TimeCorrectionObservation,
  CapabilityObservation,
  Observation,
  InferenceRule,
  TimeCorrectionEdge,
  EliminationEdge,
  InferenceEdge,
  TypedCml,
  TimelineResult,
  DeducibilityResult,
  UniquenessResult,
  FairPlayCertificate,
} from "./types.js";

export { checkTimeline } from "./engines/timeline.js";
export { checkDeducibility } from "./engines/deducibility.js";
export { checkUniqueness } from "./engines/uniqueness.js";
export { certify, CHECKER_VERSION } from "./certify.js";
export { runCertifyLoop, applyAction } from "./repair-loop.js";
export type {
  RepairAction,
  Proposer,
  LoopState,
  LoopResult,
  LoopTurn,
  StopReason,
} from "./repair-loop.js";

export {
  suspectsOf,
  intervalsOverlap,
  presenceClues,
  capabilityClues,
  unionCovers,
  precludesCrime,
  isEliminableFrom,
} from "./util.js";

export { clockSetFastBroken, clockSetFastRepaired } from "./fixtures/clock-set-fast.js";
export {
  lockedStudyBroken,
  lockedStudyRepaired,
  uniqueMeansBroken,
  uniqueMeansRepaired,
  largeCircleUnique,
} from "./fixtures/broadened.js";
