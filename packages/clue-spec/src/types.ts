/**
 * Clue-spec types (Stage A of the Agent 5 redesign, §4.1).
 *
 * The thesis: clues are the *renderings* of inference steps the CML has already proven, so the set
 * of clues that must exist is **computed** from the frozen CML, not invented then audited. These
 * types are the contract for that computation — a `ClueSpec` is the complete, authoritative list of
 * slots a fair clue set must fill, derived deterministically with no LLM.
 */

export type EvidenceType = "observation" | "contradiction" | "elimination";
export type Criticality = "essential" | "supporting";
export type ClueCategory = "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
/** Suggested placement; essential clues are never "late" (they must precede the discriminating test). */
export type Placement = "early" | "mid" | "late";

/**
 * One required clue, as a *slot* — what must exist and where it comes from, NOT yet prose. The LLM's
 * only later job (Stage B) is to render `description`/`pointsTo` for each slot; everything here is
 * fixed by the CML so the model cannot misnumber, mispath, or skip a clue (§4.1).
 */
export interface ClueSlot {
  /** Stable, deterministic id (assigned here, never authored by the model). */
  id: string;
  evidenceType: EvidenceType;
  criticality: Criticality;
  /** The exact CML path this clue renders — the source of truth, fixed by the slot. */
  sourceInCML: string;
  /** 1-based inference step this clue makes reader-visible (when it supports a specific step). */
  supportsInferenceStep?: number;
  category: ClueCategory;
  /** Salient terms the rendered clue should surface (a render hint, not a gate). */
  keyTerms: string[];
  suggestedPlacement: Placement;
}

/**
 * One required red herring — derived from `false_solution`, not freely invented (§4.2). Because it
 * points at the innocent accused's supporting point, it *cannot* reinforce the true solution by
 * construction, which is what deletes today's lexical-overlap sanitizers.
 */
export interface RedHerringSlot {
  id: string;
  /** The false belief this herring reinforces — a `false_solution.supporting_points[*]` entry. */
  supportsAssumption: string;
  /** The exact CML path the herring renders. */
  sourceInCML: string;
}

/** The complete, authoritative clue + red-herring slot set derived from one frozen CML. */
export interface ClueSpec {
  clueSlots: ClueSlot[];
  redHerringSlots: RedHerringSlot[];
}

// ── Structural CML input (the subset Stage A reads) ──────────────────────────
// A loose mirror of the relevant CASE fields (schema/cml_2_0.schema.yaml). Kept permissive
// (optional, unknown-tolerant) because it runs over real frozen CMLs that predate the redesign.

export interface CmlInferenceStep {
  observation?: string;
  correction?: string;
  effect?: string;
  required_evidence?: string[];
  reader_observable?: boolean;
}

export interface CmlDiscriminatingTest {
  method?: string;
  design?: string;
  knowledge_revealed?: string;
  pass_condition?: string;
  /** Runtime-added list of declared evidence clue ids the test turns on (matched by the synthesizer). */
  evidence_clues?: Array<string | { id?: string }>;
}

export interface CmlFalseSolution {
  accused_suspect?: string;
  supporting_points?: string[];
  the_one_flaw?: string;
}

export interface CmlCastMember {
  name?: string;
  culprit_eligibility?: "eligible" | "ineligible" | "locked";
  alibi_window?: string;
  access_plausibility?: string;
  motive_seed?: string;
  private_secret?: string;
  evidence_sensitivity?: string[];
}

/** The CASE subset `deriveClueSpec` reads. The deriver also accepts a `{ CASE: ... }` wrapper. */
export interface CmlCaseForClues {
  inference_path?: { steps?: CmlInferenceStep[] };
  discriminating_test?: CmlDiscriminatingTest;
  false_solution?: CmlFalseSolution;
  false_assumption?: { statement?: string };
  culpability?: { culprits?: string[] };
  cast?: CmlCastMember[];
  hidden_model?: { mechanism?: { description?: string } };
}
