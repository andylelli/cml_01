/**
 * Story Geometry types — the manuscript contract (architecture/GEOMETRY-AGENT-DESIGN.md §6).
 *
 * WHAT THIS IS. A small, machine-checkable statement of what must be true of the FINISHED TEXT:
 * exactly two times, one clincher, the method's physical signature in chapter one, and what each of
 * the load-bearing chapters must and must not contain. It is checked against the outline before a
 * prose token is spent, and re-checked against the manuscript afterwards as an acceptance test.
 *
 * WHAT THIS IS NOT — and the boundary is the whole point (§3, §4.2):
 *   • not prose, not a template, not an example sentence. Nothing here is ever pasted into a chapter.
 *   • not a clue set — `@cml/clue-spec` derives which clues must exist. The clincher is SELECTED from
 *     clues that already exist, never authored.
 *   • not a scene grid — `@cml/beat-scheduler` owns which scene discharges which obligation, and owns
 *     `plant_clue` + `checkPlantBeforeReveal`. Geometry CONSUMES the grid; it never re-derives it.
 *   • not a case model. The CML is frozen upstream and read-only here (ADR-0005).
 *
 * THE ONE GENUINELY NEW THING is `mustNotContain`. Every obligation the pipeline can express today is
 * positive — introduce_victim, reveal_clue, plant_clue. There has been no way to say "the aftermath
 * chapter must not re-reveal", which is why "chapter 10 repeats chapter 9" has no upstream owner.
 */

// ── Chapter roles ────────────────────────────────────────────────────────────

/**
 * The role a chapter plays in the syuzhet. DECLARED here rather than INFERRED from beat labels —
 * `resolveStageModeKey` (agent9-prose/clue-validation.ts) guesses the same thing from the outline's
 * beats. Geometry does not replace that machinery (§8.7); it gives it a declared input instead of a
 * guessed one.
 */
export type ChapterRole =
  | "opening"
  | "investigation"
  | "false_solution"
  | "discriminating_test"
  | "reveal"
  | "aftermath";

// ── The fields ───────────────────────────────────────────────────────────────

/**
 * The manuscript's temporal anchors, closed at exactly two.
 *
 * The CML already carries both (`hidden_model.mechanism.actual_time_of_death` /
 * `apparent_time_of_death`) and `timeline-deception.ts` already checks their DIRECTION. Neither gap
 * is the model — the gap is that nothing binds the MANUSCRIPT to it. The locked-fact layer enforces
 * presence of a canonical value (by injecting it) and never exclusivity, which is how
 * `the_clock_s_deception` shipped 8:50, 10:15 *and* 11:10 against a two-time model.
 *
 * `directionViolations` is INJECTED by the caller from `checkCaseTimelineDeception` — it is
 * deliberately not re-derived here, because a second body of that invariant is exactly the
 * one-concept-two-implementations trap this codebase keeps paying for.
 */
export interface TimeModel {
  trueTime: string | null;
  apparentTime: string | null;
  directionViolations: ReadonlyArray<{ code: string; message: string }>;
}

/**
 * The single physical trace only the culprit could have left — asked for by name, in the same words,
 * by two external reviewers on stories with completely different plots.
 *
 * `source` records how it was chosen so a run can never be read as "the model picked this" when the
 * deterministic fallback did. `clueId` ties it to an existing clue: geometry SELECTS, never invents.
 */
export interface Clincher {
  /** Human-readable description of the trace, taken from the clue it is drawn from. */
  trace: string;
  /** The Agent-5 clue this clincher is, when it maps to one. */
  clueId: string | null;
  /** The culprit the trace is unique to. */
  uniqueToCulprit: string | null;
  plantByChapter: number;
  payoffChapter: number;
  /** Lowercased terms the acceptance test looks for on the page. Never shown to the prose model as copy. */
  keyTerms: string[];
  source: "derived" | "llm";
  /**
   * The `criticality` of the clue this was selected from, as the clue set declares it.
   *
   * Recorded because it is routinely NOT "essential": across three runs the best available physical
   * trace was an `optional` slot. Geometry then binds a load-bearing obligation to a clue the rest of
   * the pipeline is free to drop — see the closure note. §5's missing slot type, made visible.
   */
  sourceCriticality: string | null;
}

/** The method's PHYSICAL signature — bruising for strangulation, a wound matching the candlestick base. */
export interface MethodSignature {
  /** The death method as the CML states it (`CASE.death_method`). */
  method: string;
  /** The chapter the signature must be physically present in. Chapter 1 by construction. */
  plantChapter: number;
  keyTerms: string[];
}

/**
 * What one chapter owes the reader, and what it must not repeat.
 *
 * PROMPTING SUBTLETY, designed around deliberately (§8.3): negative instructions are weak — naming a
 * thing you do not want raises the chance the model produces it. So `mustNotContain` is expressed to
 * the model POSITIVELY, as a role ("this chapter is aftermath: consequence and reaction only"), and
 * enforced NEGATIVELY by the acceptance test. The prompt gets `role` + `mustContain`; the validator
 * gets `mustNotContain`.
 */
export interface ChapterContract {
  chapter: number;
  role: ChapterRole;
  mustContain: string[];
  mustNotContain: string[];
}

/** Who the story's false solution accuses — and the hard part: that it is not the culprit. */
export interface FalseSolutionGeometry {
  accused: string | null;
  proposedChapter: number | null;
  collapseChapter: number | null;
}

/** Suspect elimination happens in scene, or it happens in one sentence. Never as a register. */
export interface ClearanceBudget {
  maxSentences: number;
  inScene: true;
}

// ── Closure ──────────────────────────────────────────────────────────────────

/** One property of the contract that the OUTLINE cannot satisfy. */
export interface GeometryUnmet {
  field: string;
  code: string;
  message: string;
  /**
   * Whether bounded, deterministic outline repair can close it. `false` means the defect is
   * structural (e.g. the reveal and the aftermath are the same chapter) and the run continues with a
   * loud warning — never an abort (ADR-0003).
   */
  repairable: boolean;
}

export interface GeometryClosure {
  closed: boolean;
  unmet: GeometryUnmet[];
  /** Properties deliberately not required for this case, with the reason (e.g. `resolution_kind`). */
  waived: Array<{ field: string; reason: string }>;
  /**
   * Observations that do NOT block closure but change how the contract should be read.
   *
   * A third channel exists because the alternatives are both wrong: recording these as `unmet` would
   * make almost every run read as unclosed, and dropping them would leave a contract whose weakest
   * assumption is invisible on the report.
   */
  notes: string[];
}

// ── The object ───────────────────────────────────────────────────────────────

export interface StoryGeometry {
  version: 1;
  chapterCount: number;
  /** Read-only echo of the CML's culprit — every check below is relative to them. */
  culprit: string | null;
  timeModel: TimeModel;
  clincher: Clincher | null;
  methodSignature: MethodSignature | null;
  chapterContract: ChapterContract[];
  falseSolution: FalseSolutionGeometry;
  clearanceBudget: ClearanceBudget;
  closure: GeometryClosure;
}

// ── Acceptance (the manuscript side) ─────────────────────────────────────────

export type GeometryField =
  | "time_model"
  | "clincher"
  | "method_signature"
  | "chapter_contract"
  | "false_solution"
  | "clearance_budget";

export interface GeometryViolation {
  field: GeometryField;
  code: string;
  /** 1-based chapter, or null for a whole-manuscript property. */
  chapter: number | null;
  scope: "chapter" | "manuscript";
  message: string;
  /** Paragraph indices evidencing the violation — what a scoped regen would target. */
  paragraphIndices?: number[];
}

/**
 * One constraint's outcome, INCLUDING the satisfied ones.
 *
 * A zero that is never written is indistinguishable from a check that never ran (the A_70/A_71 rule,
 * and the exact defect that left the `[R4]` counters unreadable). Every check emits a row.
 */
export interface GeometryCheck {
  field: GeometryField;
  code: string;
  chapter: number | null;
  satisfied: boolean;
}

export interface GeometryAcceptanceReport {
  violations: GeometryViolation[];
  checks: GeometryCheck[];
  /** Times found on the page that are neither the true nor the apparent time, with where they sit. */
  extraTimes: Array<{ chapter: number; phrase: string; minutes: number }>;
}

// ── Permissive structural inputs ─────────────────────────────────────────────
// Loose mirrors of the live shapes, kept optional/unknown-tolerant because this runs over real
// frozen CMLs and real outlines that predate the contract.

export interface GeometryClue {
  id?: string;
  description?: string;
  pointsTo?: string;
  category?: string;
  criticality?: string;
  keyTerms?: string[];
  supportsInferenceStep?: number;
  isDeathMethodTell?: boolean;
}

export interface GeometryScene {
  sceneNumber?: number;
  act?: number;
  beat?: string | null;
  title?: string;
  purpose?: string;
  summary?: string;
  cluesRevealed?: string[];
  cluesPlanted?: string[];
}

export interface GeometryOutline {
  acts?: Array<{ scenes?: GeometryScene[] }>;
  totalScenes?: number;
}

/** The scheduler's grid — CONSUMED, never re-derived (§4.3). */
export interface GeometryGrid {
  slots?: ReadonlyArray<{ sceneNumber?: number; beat?: string; cluesPlanted?: string[]; cluesRevealed?: string[] }>;
}

/** The two creative choices the case model deliberately leaves open (§2, responsibility 2). */
export interface GeometryResolution {
  clincherClueId?: string | null;
  clincherTrace?: string | null;
  accused?: string | null;
}

export interface GeometryDeriveInput {
  /** The frozen CML — a CASE object or a `{ CASE: ... }` wrapper. Read-only. */
  cml: unknown;
  clues?: ReadonlyArray<GeometryClue>;
  narrative?: GeometryOutline | null;
  sceneGrid?: GeometryGrid | null;
  /** From `checkCaseTimelineDeception` — injected so this package holds no second copy of it. */
  timelineViolations?: ReadonlyArray<{ code: string; message: string }>;
  resolution?: GeometryResolution | null;
}

/** A finished chapter, as Agent 9 commits it. */
export interface GeometryChapter {
  chapterNumber?: number;
  title?: string;
  paragraphs?: string[];
}

export interface GeometryAcceptanceOptions {
  /**
   * The clock-time parser. REQUIRED and injected, with no default on purpose: `parseClockTime` in
   * `@cml/prompts-llm/timeline-deception.ts` is the project's one implementation, and a private copy
   * here would drift from it silently — the failure mode this package exists to stop.
   */
  parseClockTime: (raw?: string) => number | null;
}
