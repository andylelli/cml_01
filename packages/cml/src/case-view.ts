/**
 * A5-04 / A6-18 — a typed READ VIEW of the CML 2.0 `CASE` block.
 *
 * `CaseData` is `any` (index.ts), and every agent unwrapped it with its own copy of
 * `(cml as any)?.CASE ?? cml`, so every field read off the case was `any` too. This module is the
 * one unwrap, with a type that names the fields the Agent 5 and Agent 6 runners actually read.
 *
 * DELIBERATELY A VIEW, NOT A VALIDATOR.
 *  - `caseOf` returns the SAME object the old expression returned (same reference: callers mutate it,
 *    e.g. `discriminating_test.evidence_clues` and `prose_requirements.clue_to_scene_mapping`).
 *    It adds no default: a nullish input passes straight through, exactly as before.
 *  - Every field is optional, because the runners treat every field as possibly absent (they guard
 *    with `?.`, `Array.isArray` and `String(x ?? "")`). Enum-valued fields in the schema are typed
 *    `string`: the case comes from an LLM, and the code compares rather than trusts.
 *  - Shapes follow `schema/cml_2_0.schema.yaml`, plus the fields later agents add at run time
 *    (`death_method`, `locked_facts`, `discriminating_test.evidence_clues`,
 *    `hidden_model.mechanism.description`).
 */

/** One `CASE.cast[*]` member. */
export interface CaseCastMember {
  name?: string;
  age_range?: string;
  role_archetype?: string;
  /** Not in the schema; some generated casts carry the camelCase spelling (see `roleTextsOf`). */
  roleArchetype?: string;
  /** Schema: detective | victim | culprit | suspect | witness | bystander. */
  role?: string;
  relationships?: string[];
  public_persona?: string;
  private_secret?: string;
  motive_seed?: string;
  motive_strength?: string;
  alibi_window?: string;
  access_plausibility?: string;
  opportunity_channels?: string[];
  behavioral_tells?: string[];
  stakes?: string;
  evidence_sensitivity?: string[];
  /** Schema: eligible | ineligible | locked. */
  culprit_eligibility?: string;
  /** Schema: guilty | innocent | unknown. */
  culpability?: string;
  gender?: string;
  moral_complexity?: string;
}

/** One `CASE.inference_path.steps[*]` entry. */
export interface CaseInferenceStep {
  observation?: string;
  correction?: string;
  effect?: string;
  required_evidence?: string[];
  reader_observable?: boolean;
}

/** `CASE.discriminating_test`. `evidence_clues` is added at run time by Agents 3/5/6. */
export interface CaseDiscriminatingTest {
  /** Schema: reenactment | trap | constraint_proof | administrative_pressure. */
  method?: string;
  design?: string;
  knowledge_revealed?: string;
  pass_condition?: string;
  evidence_clues?: unknown[];
}

export interface CaseFalseAssumption {
  statement?: string;
  /** Schema: temporal | spatial | identity | behavioral | authority. */
  type?: string;
  why_it_seems_reasonable?: string;
  what_it_hides?: string;
}

export interface CaseFalseSolution {
  accused_suspect?: string;
  supporting_points?: string[];
  the_one_flaw?: string;
  refuted_in_chapter?: number;
}

export interface CaseRedHerring {
  id?: string;
  points_at_suspect?: string;
  innocent_explanation?: string;
  resolved_in_chapter?: number;
}

export interface CaseConstraintSpace {
  time?: {
    anchors?: string[];
    windows?: string[];
    contradictions?: string[];
    opportunity_window?: string;
  };
  access?: { actors?: string[]; objects?: string[]; permissions?: string[] };
  physical?: { laws?: string[]; traces?: string[] };
  social?: { trust_channels?: string[]; authority_sources?: string[] };
}

export interface CaseClueSceneMapping {
  clue_id?: string;
  act_number?: number;
  scene_number?: number;
  delivery_method?: string;
}

export interface CaseProseRequirements {
  discriminating_test_scene?: {
    act_number?: number;
    scene_number?: number;
    required_elements?: string[];
    test_type?: string;
  };
  suspect_clearance_scenes?: Array<{
    suspect_name?: string;
    act_number?: number;
    scene_number?: number;
    clearance_method?: string;
    supporting_clues?: string[];
  }>;
  culprit_revelation_scene?: { act_number?: number; scene_number?: number; revelation_method?: string };
  identity_rules?: Array<{
    character_name?: string;
    revealed_in_act?: number;
    before_reveal_reference?: string;
    after_reveal_reference?: string;
  }>;
  clue_to_scene_mapping?: CaseClueSceneMapping[];
}

export interface CaseQualityControls {
  inference_path_requirements?: {
    min_steps?: number;
    max_steps?: number;
    require_observation_correction_effect?: boolean;
  };
  clue_visibility_requirements?: {
    essential_clues_min?: number;
    essential_clues_before_test?: boolean;
    early_clues_min?: number;
    mid_clues_min?: number;
    late_clues_min?: number;
  };
  discriminating_test_requirements?: { timing?: string; must_reference_inference_step?: boolean };
}

/** A `CASE.locked_facts[*]` entry (Agent 3b's locked-fact registry, appended at run time). */
export interface CaseLockedFact {
  id?: string;
  value?: string;
  description?: string;
}

/** The typed read view of `CASE`. Only fields some runner reads are named. */
export interface CaseView {
  meta?: Record<string, unknown>;
  cast?: CaseCastMember[];
  culpability?: { culprit_count?: number; culprits?: string[] };
  surface_model?: Record<string, unknown>;
  hidden_model?: {
    mechanism?: { description?: string; delivery_path?: Array<{ step?: string }> };
    outcome?: { result?: string };
  };
  false_assumption?: CaseFalseAssumption;
  false_solution?: CaseFalseSolution;
  red_herrings?: CaseRedHerring[];
  closed_circle?: { suspects?: string[]; rationale?: string };
  constraint_space?: CaseConstraintSpace;
  inference_path?: { steps?: CaseInferenceStep[] };
  discriminating_test?: CaseDiscriminatingTest;
  fair_play?: Record<string, unknown>;
  quality_controls?: CaseQualityControls;
  prose_requirements?: CaseProseRequirements;
  /** The physical manner of death (Agent 3, A_67 FIX-2). Not in the schema. */
  death_method?: string;
  locked_facts?: CaseLockedFact[];
}

/**
 * `(cml as any)?.CASE ?? cml`, typed. Accepts the CASE block itself or a `{ CASE: ... }` wrapper and
 * returns the same reference — never a copy, never a default. A nullish input returns that nullish
 * value (typed as the view; every caller that can see one already reads through `?.`).
 */
export function caseOf(cml: unknown): CaseView {
  return ((cml as { CASE?: unknown } | null | undefined)?.CASE ?? cml) as CaseView;
}
