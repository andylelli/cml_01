/**
 * Beat Scheduler types (Agent 7 redesign §4.1).
 *
 * The outline is a scheduling problem with a known-correct answer: the obligatory beats of a fair-play
 * whodunit form a partially-ordered set with hard ordering + pacing laws the CML already encodes. The
 * scheduler lays them into a scene grid — complete, correctly ordered, exact count, ≥60% clue coverage
 * — *by construction*, with no LLM. These are the §4.1 `Obligation` / `SceneGrid` contracts.
 */

export type Act = 1 | 2 | 3;
export type Placement = "early" | "mid" | "late";
export type Criticality = "essential" | "supporting" | "optional";
export type DetectiveType = "police" | "private" | "amateur";
export type TestTiming = "late_act2" | "early_act3" | "mid_act3";

/** A must-occur beat read directly from the validated CML (never inferred from prose). */
export type Obligation =
  | { kind: "introduce_victim" }
  | { kind: "discover_crime" }
  | { kind: "introduce_suspect"; name: string }
  | { kind: "detective_entry"; type: DetectiveType }
  | { kind: "reveal_clue"; id: string; criticality: Criticality; placement: Placement }
  | { kind: "plant_red_herring"; id: string }
  | { kind: "clear_suspect"; name: string; supportingClues: string[] }
  | { kind: "false_solution" }
  | { kind: "discriminating_test"; supportingClues: string[]; timing: TestTiming }
  | { kind: "reveal_solution" }
  | { kind: "denouement" };

export type ObligationKind = Obligation["kind"];

/** One slot in the grid: what it MUST discharge, plus the scheduler-owned derived fields. */
export interface SceneSlot {
  sceneNumber: number;
  act: Act;
  obligations: Obligation[];
  /** Derived from this slot's `reveal_clue` obligations — AUTHORITATIVE (not LLM, not a patch). */
  cluesRevealed: string[];
  /** Golden-Age 10-beat label, assigned in canonical order (for the 10-slot format). */
  beat?: string;
  /** One-line machine summary of the slot's function, e.g. "Reveal c4; clear Marlowe". */
  function: string;
}

export interface SceneGrid {
  slots: SceneSlot[];
  sceneCount: number;
  actCounts: { act1: number; act2: number; act3: number };
  /** Always true on a returned grid — the scheduler throws rather than return an incomplete grid. */
  provenComplete: true;
}

/** Thrown when the obligation set cannot be laid into the grid — a logic bug, surfaced early/loudly. */
export class SchedulerInfeasibleError extends Error {
  readonly unmet: string;
  constructor(unmet: string) {
    super(`Scene grid infeasible: ${unmet}`);
    this.name = "SchedulerInfeasibleError";
    this.unmet = unmet;
  }
}

// ── Structural CML/clue inputs (the subset the scheduler reads) ───────────────
// Permissive mirrors of the real CASE + Agent-5 clue distribution, so this runs over real frozen data.

export interface SchedulerCastMember {
  name?: string;
  role?: string;
  role_archetype?: string;
  culprit_eligibility?: "eligible" | "ineligible" | "locked";
}

export interface SchedulerClue {
  id: string;
  placement?: Placement;
  criticality?: Criticality;
  supportsInferenceStep?: number;
}

export interface SchedulerProseRequirements {
  discriminating_test_scene?: { act_number?: number; scene_number?: number };
  suspect_clearance_scenes?: Array<{ suspect_name?: string; supporting_clues?: string[] }>;
}

export interface SchedulerCase {
  cast?: SchedulerCastMember[];
  culpability?: { culprits?: string[] };
  inference_path?: { steps?: Array<{ required_evidence?: string[] }> };
  discriminating_test?: {
    method?: string;
    evidence_clues?: Array<string | { id?: string }>;
    timing?: TestTiming;
  };
  quality_controls?: { discriminating_test_requirements?: { timing?: TestTiming } };
  false_solution?: { accused_suspect?: string } | null;
  red_herrings?: Array<{ id?: string }>;
  prose_requirements?: SchedulerProseRequirements;
}

/** What the scheduler reads to place each suspect's clearance (and the test) before the reveal. */
export interface SchedulerInput {
  /** The CASE object or a `{ CASE: ... }` wrapper. */
  cml: unknown;
  /** The Agent-5 clue distribution (live `ClueDistributionResult.clues` shape, or clue-spec slots). */
  clues: SchedulerClue[];
  /** Red herrings (live `ClueDistributionResult.redHerrings`); falls back to CASE.red_herrings. */
  redHerrings?: Array<{ id?: string }>;
}
