/**
 * @cml/clue-spec — deterministic clue-spec deriver for Agent 5 (Stage A of the redesign,
 * documentation/12_system_redesign/10_agent_5_clues_red_herrings.md).
 *
 * Clues are the renderings of inference steps the CML has already proven, so the set of clues that
 * must exist is *computed* from the frozen CML — not invented then policed by 168 KB of checkers.
 * `deriveClueSpec(cml)` is that computation: pure, deterministic, no LLM, fully unit-testable.
 *
 * First increment (§9.7): authoritative deriver + the Spike-1 coverage harness
 * (scripts/agent5-derive-coverage.mjs). NOT wired into the shipped generate-then-audit path.
 */

export const packageName = "@cml/clue-spec";

export type {
  EvidenceType,
  Criticality,
  ClueCategory,
  Placement,
  ClueSlot,
  RedHerringSlot,
  ClueSpec,
  CmlInferenceStep,
  CmlDiscriminatingTest,
  CmlFalseSolution,
  CmlCastMember,
  CmlCaseForClues,
} from "./types.js";

export { deriveClueSpec, slug, extractKeyTerms, inferCategory } from "./derive.js";
