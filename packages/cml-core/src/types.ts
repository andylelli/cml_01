/**
 * CML typed logical core (§4.2 of the Agent 3 redesign).
 *
 * The blocker the redesign identifies is that today's CML is "prose in a schema":
 * `alibi_window: "evening"` is a sentence no engine can reason over. This module gives the
 * load-bearing logic a *typed* representation a deterministic engine CAN reason over — entities,
 * timed presence, a crime spec, the reader's clues, the inference path, and the named solution.
 *
 * The human-readable CML we ship is meant to be a *rendering* of this core, not the source of
 * truth (§4.2). Every observation carries a `worded` display field alongside its machine fields.
 */

/** Minutes since midnight on the case day — a single declared integer timeline. */
export type Minutes = number;

/** A closed time interval [start, end] in minutes. `start <= end`. */
export interface Interval {
  start: Minutes;
  end: Minutes;
}

export type EntityId = string;

export type PersonRole = "suspect" | "victim" | "detective" | "witness";

export interface Person {
  kind: "person";
  id: EntityId;
  name: string;
  role: PersonRole;
}

export interface Place {
  kind: "location";
  id: EntityId;
  name: string;
}

export type Entity = Person | Place;

/**
 * What the crime required of the culprit. A suspect is the culprit only if they satisfy BOTH the
 * opportunity constraint (presence at `location` during `window`) AND every required capability.
 *
 * - `window` is the *true* corrected window — the inference path must show the reader can derive it
 *   (e.g. via a clock-fast time-correction clue).
 * - `reachableFrom` lists locations close enough that being there does NOT preclude the crime
 *   (e.g. a kitchen adjacent to the study). Presence at any *other* location precludes it.
 * - `requiredCapabilities` are non-temporal prerequisites the crime demanded — a key to the locked
 *   study, the medical knowledge to dose a precise poison, the strength to strangle. A clue proving
 *   a suspect LACKS a required capability eliminates them, independent of timing. This is what lets
 *   the engines model locked-room / unique-means mysteries, not just alibi-timing ones.
 */
export interface CrimeSpec {
  location: EntityId;
  window: Interval;
  reachableFrom: EntityId[];
  requiredCapabilities?: string[];
}

/** An observation placing a person at a location during an interval. */
export interface PresenceObservation {
  kind: "presence";
  id: string;
  person: EntityId;
  location: EntityId;
  interval: Interval;
  /** The reader holds this clue by this inference-step index (1-based). */
  availableByStep: number;
  /** Human-facing description (display only; never read by the engines). */
  worded: string;
}

/** An observation that corrects the apparent time, establishing the true crime window. */
export interface TimeCorrectionObservation {
  kind: "time_correction";
  id: string;
  establishesWindow: Interval;
  availableByStep: number;
  worded: string;
}

/** An observation establishing whether a person has or lacks a (crime-relevant) capability. */
export interface CapabilityObservation {
  kind: "capability";
  id: string;
  person: EntityId;
  /** Matches a `CrimeSpec.requiredCapabilities` entry. */
  capability: string;
  /** true: the clue shows they HAVE it; false: the clue PROVES they lack it (eliminating). */
  has: boolean;
  availableByStep: number;
  worded: string;
}

export type Observation = PresenceObservation | TimeCorrectionObservation | CapabilityObservation;

/** The closed rule vocabulary the deducibility checker understands (§4.2). */
export type InferenceRule = "time_correction" | "access_impossible" | "alibi_contradiction" | "unique_capability";

export interface TimeCorrectionEdge {
  id: string;
  rule: "time_correction";
  from: string[];
  establishesWindow: Interval;
}

export interface EliminationEdge {
  id: string;
  rule: "access_impossible" | "alibi_contradiction" | "unique_capability";
  from: string[];
  eliminates: EntityId;
}

export type InferenceEdge = TimeCorrectionEdge | EliminationEdge;

/** The typed logical model of one mystery. */
export interface TypedCml {
  caseId: string;
  entities: Entity[];
  crime: CrimeSpec;
  /** The observations the reader is actually shown (the clue set). */
  clues: Observation[];
  /** The authored chain from clues to eliminations to the solution. */
  inferencePath: InferenceEdge[];
  solution: { culpritId: EntityId };
}

// ── Engine result types ────────────────────────────────────────────────────

export interface TimelineResult {
  consistent: boolean;
  violations: string[];
}

export interface DeducibilityResult {
  /** Every elimination edge is justified by its premises, and no clue is used before available. */
  sound: boolean;
  /** The path eliminates every suspect except the named culprit. */
  reachesCulprit: boolean;
  issues: string[];
}

export interface UniquenessResult {
  unique: boolean;
  /** Suspects for whom a consistent guilty-world survives the clue set. */
  possibleSuspects: EntityId[];
  named: EntityId;
  /** Human-readable diagnosis when not unique / culprit impossible. */
  diagnosis?: string;
}

export interface FairPlayCertificate {
  caseId: string;
  checkerVersion: string;
  timelineConsistent: boolean;
  deducible: boolean;
  unique: boolean;
  culpritId: EntityId;
  uniqueAmong: EntityId[];
  /** true ⇔ consistent ∧ deducible ∧ unique ∧ the lone survivor is the named culprit. */
  ok: boolean;
  failures: string[];
}
