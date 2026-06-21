/**
 * Style Contract types (Agent 6.5 redesign §4.1) — the compile-time mirror of
 * schema/style_contract.schema.yaml (the runtime source of truth, ajv-validated).
 */

export type Register =
  | "wry-comic"
  | "cozy"
  | "noir"
  | "hardboiled"
  | "psychological"
  | "gothic"
  | "classical-fair-play";

export type NarrativeDistance = "close-third" | "omniscient" | "first-person";
export type SentenceRhythm = "varied" | "clipped" | "periodic";
export type Diction = "period-formal" | "plain" | "ornate";

export interface ProseConstraints {
  sentenceRhythm: SentenceRhythm;
  /** Devices the prose must avoid — the conformance judge's checklist (e.g. "modern idiom", "gore"). */
  forbiddenDevices: string[];
  diction: Diction;
}

export interface ExemplarPassage {
  /** The character speaking, when the exemplar is dialogue. */
  speaker?: string;
  /** 2–3 lines of actual prose/speech in the book's register — the conditioning gold. */
  text: string;
  note?: string;
}

/** The canonical voice artifact, signed once and frozen, threaded into every generative agent. */
export interface StyleContract {
  register: Register;
  /** Voice anchors (influences, not plagiarism targets). */
  comparables: string[];
  narrativeDistance: NarrativeDistance;
  /** Global humour ceiling 0–3; per-scene map derives from this + per-character humour. */
  humourTolerance: number;
  proseConstraints: ProseConstraints;
  /** 0–4 conditioning exemplars; empty after deterministic signing (live generation is gated). */
  exemplars: ExemplarPassage[];
  /** Which fields were auto-derived from the premise rather than chosen by the user. */
  derivedDefaults?: string[];
}

/**
 * What the signing pass reads: the user's explicit choices (enums) where given, plus the free-text
 * premise/theme/era it derives defaults from where the user is silent (§4.1: "most of it is a choice,
 * not a generation").
 */
export interface StyleSpec {
  register?: Register;
  comparables?: string[];
  narrativeDistance?: NarrativeDistance;
  humourTolerance?: number;
  diction?: Diction;
  sentenceRhythm?: SentenceRhythm;
  forbiddenDevices?: string[];
  /** Free-text premise — the dominant source of derived defaults. */
  premise?: string;
  /** The story's theme (a claim, ideally — see usability.themeIsAClaim). */
  theme?: string;
  /** Era decade (e.g. 1931) — pre-1960 leans period-formal diction. */
  decade?: number;
}
