/**
 * @cml/beat-scheduler — the Beat Scheduler: deterministic scene-grid layout for Agent 7
 * (documentation/12_system_redesign/13_agent_7_narrative_outliner.md).
 *
 * The outline is a scheduling problem with a known-correct answer. `buildSceneGrid` lays the CML's
 * obligatory beats into a grid that is complete, correctly ordered, exact-count, and ≥60% clue-bearing
 * *by construction* — the property the live runner retrofits with ~700 lines of band-aids
 * (applyDeterministicCluePreAssignment, the scene-count lock, Bridge-Scene fabrication, the
 * test-vocabulary splice). The LLM's job then shrinks to dramatizing each fixed slot (the gated
 * Stage B). This package is Stage A: pure, no LLM, NOT wired into the pipeline.
 */

export const packageName = "@cml/beat-scheduler";

export type {
  Act,
  Placement,
  Criticality,
  DetectiveType,
  TestTiming,
  Obligation,
  ObligationKind,
  SceneSlot,
  SceneGrid,
  SchedulerCase,
  SchedulerClue,
  SchedulerCastMember,
  SchedulerProseRequirements,
  SchedulerInput,
} from "./types.js";
export { SchedulerInfeasibleError } from "./types.js";

export { collectObligations } from "./collect.js";
export type { CollectedObligations } from "./collect.js";

export { buildSceneGrid } from "./schedule.js";

export {
  checkComplete,
  checkOrdered,
  checkCoverage,
  checkPlantBeforeReveal,
  isClueBearing,
} from "./invariants.js";
export type { CompletenessResult, OrderingResult, CoverageResult, PlantCoverageResult } from "./invariants.js";
