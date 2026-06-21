/**
 * Novelty types (Agent 8 redesign §4.1 / §4.5) — the compile-time mirror of
 * schema/novelty_fingerprint.schema.yaml (the runtime source of truth, ajv-validated).
 *
 * Novelty is a property of the *idea*, not the surface text. A `Fingerprint` is the abstract
 * structure — axis, mechanism family, false-assumption pattern, discriminating-test shape, inference
 * shape — that a mystery's identity actually lives in. The verdict is a typed, explainable judgement,
 * never a weighted decimal crossing an arbitrary line.
 */

export type Axis = "temporal" | "spatial" | "identity" | "epistemic" | "behavioral" | "authority";

export type MechanismFamily =
  | "locked_room_key"
  | "locked_room_timing"
  | "alibi_fabrication"
  | "impersonation"
  | "substituted_body"
  | "poison_delayed"
  | "poison_substitution"
  | "staged_scene"
  | "unconscious_act"
  | "disguised_natural_agent"
  | "hidden_accomplice"
  | "information_leak"
  | "recorded_presence"
  | "secret_will_inheritance";

export type DiscriminatingTestShape =
  | "physical_trace"
  | "timetable_contradiction"
  | "behavioral_tell"
  | "identity_disambiguation"
  | "reconstruction"
  | "chemical_timing";

export type Corpus = "seed" | "cliche" | "prior_run";

/** The abstract structural fingerprint of one mystery (full ledger entry). */
export interface Fingerprint {
  id: string;
  corpus: Corpus;
  axis: Axis;
  mechanism_family: MechanismFamily;
  false_assumption_pattern: string;
  discriminating_test_shape: DiscriminatingTestShape;
  inference_shape: string;
  premise?: string;
  source?: string;
}

/** A candidate idea checked before any full CML is elaborated — the five abstract fields. */
export interface Skeleton {
  id?: string;
  axis: Axis;
  mechanism_family: MechanismFamily;
  false_assumption_pattern: string;
  discriminating_test_shape: DiscriminatingTestShape;
  inference_shape: string;
  premise?: string;
}

export type Verdict = "distinct" | "variation" | "clone";

/** The structural fields a verdict can cite as shared (the §4.5 `shared_structure`). */
export type SharedField =
  | "axis"
  | "mechanism_family"
  | "false_assumption_pattern"
  | "discriminating_test_shape"
  | "inference_shape";

/** The explainable verdict that replaces the magic numbers (§4.5). */
export interface NoveltyVerdict {
  verdict: Verdict;
  /** The closest neighbour across the corpora (null only when no corpus was supplied). */
  nearest: { corpus: Corpus; id: string; relation: string } | null;
  /** Which abstract fields the candidate shares with the nearest neighbour. */
  shared_structure: SharedField[];
  /** A concrete instruction for regenerating a more novel skeleton. */
  divergence_directive: string;
}
