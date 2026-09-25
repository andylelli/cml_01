/**
 * PROSE ENGINE v2 — the types (ANALYSIS_99 §10.2).
 *
 * ── WHY A SEPARATE PACKAGE, AND WHY IT IS PURE ───────────────────────────────────────────────────
 *
 * The v1 prose stage is 33,430 lines across a worker runner and `agent9-prose/`, and A_99 §2.2
 * measured five structural properties that hold the reader's mean at 80: it writes sentences the
 * model did not write, the unit is the chapter with prior chapters handed over to copy, the prompt
 * is a 31-block compliance document, every instrument points down, and there is one draft with no
 * selection. v2 removes all five, and the way it stays removed is that the parts that DECIDE
 * (contract, selection, findings, guards) live here, with no LLM client and no worker import — so
 * every one of them is testable against the 66 stored projects without spending a call.
 *
 * ── THE INPUT IS STRUCTURAL, NOT THE ORCHESTRATOR'S ──────────────────────────────────────────────
 *
 * `ContractInput` is a narrow shape the worker adapts `OrchestratorContext` into. That is deliberate:
 * a pure package that imported the worker's context would be untestable against an artifact store,
 * which is the only corpus this project has.
 */

// ── the contract ─────────────────────────────────────────────────────────────────────────────────

/**
 * What a chapter is FOR. Replaces v1's positional archetype (`buildMacroArcPlan(chapterCount)`),
 * which dropped CONFRONTATION on a 10-chapter book, and the scene-ref arbitration, whose coordinate
 * join resolved 0 of 45 (A_87). Derived from the outline's own beats — see `assignChapterRoles`.
 */
export type ChapterRole =
  | "opening"
  | "investigation"
  | "false_solution"
  | "clearances"
  | "discriminating_test"
  | "reveal"
  | "aftermath";

/** Which chapter holds each of the structural roles. Exactly one reveal; at most one aftermath. */
export interface ChapterRoles {
  reveal: number;
  discriminatingTest: number | null;
  aftermath: number | null;
  falseSolution: number | null;
  clearances: number[];
}

/** A clue this chapter OWNS: it is dramatized here, and referred to afterwards. */
export interface ClueSurface {
  id: string;
  /** The on-page anomaly a character can see, hear or find (`deriveClueObservable`). */
  observable: string;
  /** How it must be surfaced, when the case says so. */
  as?: string;
  /** Prose-facing terms the presence checker looks for. */
  keyTerms: string[];
  /**
   * WP-002 K1 (phase 3): whose professional skill reads this clue. MEASURED over the archive: 8 of
   * 1,167 clues name a word of the detective's occupation, and no field carries the link — so this
   * is absent until Agent 5 emits it, and the brief says nothing about it when absent.
   */
  unlockedBy?: { name: string; skill: string };
}

/** A clue an EARLIER chapter owns: mention it, reason from it, never stage its discovery again. */
export interface ClueRef {
  id: string;
  keyTerms: string[];
  firstChapter: number;
}

/** Something this chapter may not put on the page yet, and the chapter that may. */
export interface Withheld {
  what: "culprit" | "mechanism" | string;
  until: number;
}

export interface Elimination {
  name: string;
  method: string;
}

/** The beat's job, as countable fields (A_95 M6). Absent fields are never invented. */
export interface BeatJobFields {
  beat: string;
  accusedInnocent?: string;
  flawFound?: string;
  secondIncident?: string;
  suspicionShiftsTo?: string;
  unrelatedLie?: string;
  consequenceFor?: string;
}

/** One of the two wit shapes, owned by a register (A_95 M4). */
export interface OwnedShape {
  shape: "flat_answer" | "short_retort" | "unmeant_joke";
  name: string;
}

export interface WitBeat {
  name: string;
  style: string;
  shapes: OwnedShape[];
}

/** A_96 F9 — the TRAIT clause only. The cause is withheld from the prompt on purpose. */
export interface DepthBeat {
  name: string;
  trait: string;
}

/** WP-002 K2 (phase 3) — what a suspect stands to lose socially, shown as an act. */
export interface StakeBeat {
  name: string;
  standsToLose: string;
}

/** WP-002 K5 (phase 3) — the relationship arc, band-gated, default off. */
export interface RelationshipBeat {
  pair: [string, string];
  methodDisagreement: string;
  owes: "trust" | "access" | "decision";
}

/** A_86 item 1 + WP-002 K3 — the aftermath's countable jobs. */
export interface AftermathJob {
  outcome: string;
  survivors: string[];
  consequenceFor?: string;
  /** WP-002 K3 — what is repaired beyond a person, when the scope asks for it. */
  repairTarget?: string;
  scope: "household" | "relational" | "institutional" | "public";
}

/** The exact, machine-checkable obligation set for one chapter. Derived, never authored. */
export interface SceneContract {
  chapter: number;
  /** Agent 7's Golden-Age beat, after the duplicate repair. Null when the outline carries none. */
  beat: string | null;
  role: ChapterRole;
  /** The scene's title with any beat-name prefix stripped (A_96 F1). */
  title: string;
  /** Cast names on the page. The model may add nobody. */
  present: string[];
  location: string;
  timeOfDay?: string;
  /**
   * Absent by default, and that is deliberate: the outline states a time of DAY, not a clock window,
   * and inventing one would put a value on the page that no chronology row backs. Present only where
   * the case itself fixes the chapter's clock (the crime).
   */
  timeWindow?: { from: string; to: string };
  mustSurface: ClueSurface[];
  mayMention: ClueRef[];
  mustNotReveal: Withheld[];
  eliminationsAllowed: Elimination[];
  job: BeatJobFields | null;
  beats: {
    wit?: WitBeat;
    depth?: DepthBeat;
    stake?: StakeBeat;
    relationship?: RelationshipBeat;
  };
  aftermath?: AftermathJob;
  /**
   * 17-hitting-90 P1.2 — the test is applied to an innocent and to the culprit, in that order, and the
   * incriminating result falls on the culprit. The v2 read of seed 23403: *"the reenactment uses the
   * wrong person… That proves the method is possible, but not that Desmond could do it."*
   */
  testSubjects?: { innocent: string; culprit: string };
  /**
   * 17-hitting-90 P1.3 — the weapon, what was found on it, and whose it was: the case's own means-link
   * trace (A_102), split. v1 carries this at the confrontation; v2 laid the weapon out "as evidence".
   */
  proof?: { weapon: string; finding: string; culprit: string };
  /**
   * 17-hitting-90 P1.4 — the opportunity as a window with two ends on THE CLOCK, for the reveal's one
   * mechanism sentence. Four of four recent reads asked for it: *"We treated low tide as a single
   * moment instead of a window."*
   */
  opportunityWindow?: { value: string; label: string };
  /**
   * 17-hitting-90 P2.1 — WP-001 O2, the one dramatised wound: one first-half chapter carries a scene
   * set before the death in which the victim and the culprit are in one room and the grievance is
   * said aloud — played, not remembered. Five reads asked for it by name (*"add one scene where
   * Bertram actively crushes Gwendolyn's work"*, *"give one concrete wound"*, *"add one earlier
   * personal scene showing Gerald's attachment"*). The false solution's accused gets the same scene
   * shape in the same chapter, so the staging does not name the culprit by itself.
   */
  wound?: { victim: string; culprit: string; accused?: string };
  /** §07 — depth material owned by this chapter (`depth.ts`). */
  texture?: Texture;
  /** The reveal's own chapter when the test was performed earlier: the chapter it was seen in. */
  testSeenIn?: number;
  words: { preferred: number; floor: number };
}

/** A settled time value, in the ONE spelling the whole book uses. */
export interface ChronologyRow {
  kind: "instant" | "interval";
  /** The value exactly as the locked fact or the case spells it — the prose copies this. */
  value: string;
  /** What happens then. */
  label: string;
}

export interface ChronologyTable {
  rows: ChronologyRow[];
  /** Durations the device fixes but places nowhere — reported, never guessed (A_90). */
  unplaced: string[];
}

/** The two properties a run may stop for, and the values they are checked against. */
export interface FairPlayContract {
  culprits: string[];
  victim: string;
  /** One sentence, from the case, for the checkers — never for the page. */
  mechanismSummary: string;
  /** Clues that must be on the page before the reveal, and are never retired from it. */
  decisiveClueIds: string[];
  revealChapter: number;
}

/** The structural half of the contract: everything derivable without writing a word of prompt. */
export interface ContractCore {
  book: { chapters: number; words: { min: number; max: number } };
  chronology: ChronologyTable;
  roles: ChapterRoles;
  scenes: SceneContract[];
  fairPlay: FairPlayContract;
  /** Anything the derivation could not do, for the run report. Never thrown. */
  notes: string[];
}

/** The run-stable prefix every role reads, in section order (§10.3). */
export interface Bible {
  sections: Array<{ key: BibleSectionKey; title: string; body: string; tokens: number }>;
  text: string;
  tokens: number;
  /** Sections dropped to stay inside the budget, last-first. */
  truncated: BibleSectionKey[];
}

export type BibleSectionKey =
  | "case"
  | "cast"
  | "world"
  | "chronology"
  | "clues"
  | "relationships";

/** The one page of countable acts (§10.4). */
export interface Brief {
  text: string;
  tokens: number;
  /** Every ask, itemised, so a test can assert the law rather than read the prose. */
  asks: BriefAsk[];
}

export interface BriefAsk {
  section: "register" | "shapes" | "page" | "clock" | "tests" | "length";
  /** The countable act, as one line. */
  line: string;
}

export interface BookContract extends ContractCore {
  engine: "v2";
  bible: Bible;
  brief: Brief;
}

// ── the input the worker adapts into ─────────────────────────────────────────────────────────────

export interface ContractInput {
  /** The CASE, wrapped (`{ CASE: … }`) or bare — both are read. */
  cml: unknown;
  /** `ClueDistributionResult`-shaped. */
  clues?: { clues?: unknown[] } | null;
  /** `NarrativeOutline`-shaped. */
  outline: { acts?: Array<{ scenes?: unknown[] }> } | null;
  cast?: { characters?: unknown[]; relationships?: unknown } | null;
  profiles?: { profiles?: unknown[] } | null;
  world?: unknown;
  locations?: unknown;
  temporal?: unknown;
  setting?: unknown;
  lockedFacts?: ReadonlyArray<Record<string, unknown>>;
  /** A_92 — "none" | "dry" | "classic" | "sharp"; absent resolves to classic. */
  humourLevel?: string;
  primaryAxis?: string;
  targetLength?: "short" | "medium" | "long";
  /** From `story_length_policy`; defaults to the short-book targets when absent. */
  wordTargets?: { chapters: number; min: number; max: number; chapterIdeal: number };
  /** WP-002 K3 — phase 3. Absent is `household`, which is today's behaviour. */
  aftermathScope?: AftermathJob["scope"];
}

// ── drafting ─────────────────────────────────────────────────────────────────────────────────────

/** One unit of writing: the whole book, an act, or a chapter. Chapters are contiguous and in order. */
export interface Segment {
  index: number;
  chapters: number[];
  /** Estimated output tokens for the segment, used to choose the plan. */
  estimatedTokens: number;
}

export interface SegmentPlan {
  kind: "book" | "acts" | "chapters";
  segments: Segment[];
  /** Why this plan and not the next one up — for the run report. */
  reason: string;
}

export interface ProseChapterLike {
  title: string;
  summary?: string;
  paragraphs: string[];
  /**
   * Which chapter this is, from the header the writer wrote.
   *
   * Set by `parseWriterOutput` and read through `indexChapters`. Six sites used to infer it from
   * position, which misfiles the whole tail of a book the moment one chapter is missing — see
   * `chapter-index.ts` for the measurement. Optional because prose written before this field
   * existed does not carry it; never absent on anything v2 produced.
   */
  number?: number;
}

export interface Draft {
  segment: number;
  attempt: number;
  chapters: ProseChapterLike[];
  /** True when the reply was cut short and a CONTINUE call is owed. */
  truncated: boolean;
  /** Chapters the parser expected and did not find. */
  missing: number[];
}

// ── selection ────────────────────────────────────────────────────────────────────────────────────

export type HardGateKind =
  | "chapter_missing"
  | "clue_missing"
  | "culprit_early"
  | "mechanism_early"
  | "clue_early"
  | "clue_id_in_prose"
  | "scaffold"
  | "absent_character" | "reveal_unnamed" | "book_short";

export interface HardGateHit {
  kind: HardGateKind;
  chapter: number;
  detail: string;
}

/** Every instrument, in its own units. Signed and weighted by the selector, never here. */
export interface InstrumentVector {
  registerRate: number;
  repetitionPer10k: number;
  copiedSpans: number;
  dialogueOpenShare: number;
  longSentenceShare: number;
  witPer10k: number;
  witTarget: number;
  turnChapters: number;
  turnWindow: number;
  clocksOffTable: number;
  pronounMismatches: number;
  words: number;
}

export interface DraftScore {
  hard: HardGateHit[];
  vector: InstrumentVector;
  /** Weighted sum of z-scores, higher is better. Only comparable within one book. */
  composite: number;
  /** Per-instrument contribution, so a choice can be explained without re-running it. */
  contributions: Record<string, number>;
}

// ── findings and edits ───────────────────────────────────────────────────────────────────────────

export const FINDING_CLASSES = [
  // checkers — anchored by construction, because they quote what they matched
  /**
   * The reveal never attributes the act to the culprit.
   *
   * The release gate has always stopped for this; the SELECTOR never checked it, so it could
   * not prefer a draft that satisfied it, and no editor was ever asked to repair it. MEASURED
   * 2026-09-19, run `resume-1789846757984`: of three drafts of one contract, draft 3 named the
   * culprit and drafts 1 and 2 did not — and the selector chose draft 2, on composite, because
   * the condition that stops the run was invisible to it.
   */
  "reveal_unnamed",
  "clue_missing",
  "clue_early",
  "culprit_early",
  "mechanism_early",
  "clock_off_table",
  "name_collision",
  "walk_on_named",
  "pronoun_drift",
  "victim_alive",
  "scaffold_token",
  "register_sentence",
  /**
   * 17-hitting-90 P4.1 — a narration sentence whose subject is a room, a silence, the truth or the
   * evidence. Four of four recent reads quoted this family ("The room held its breath", "the truth
   * remained elusive", "the evidence continued to mount"); the register score does not always reach
   * it, and the repair is one shape: a named person as the subject, doing something.
   */
  "abstract_subject",
  /**
   * 17-hitting-90, pair 3 (2026-09-25) — the wit operation narrated as it is performed: "spoke at
   * length" ×7, "Desmond's answer came in four words", "Montague's first exchange was a question".
   * The contract asks for a short answer and a long speech; the writer announces the count. The
   * reader lists exactly this family as scaffold (*"six words slicing through his own speech"*).
   */
  "operation_narrated",
  "repeat_passage",
  "copied_sentence",
  "clearance_after_reveal",
  "reveal_residue_in_aftermath",
  // the critic — anchored or discarded
  "timing_contradiction",
  "mechanism_told_not_shown",
  "motive_as_category",
  "wound_missing",
  "register_named_in_narration",
  "humour_forced",
  "pacing_drift",
  "tonal_escalation_missing",
  "motif_abandoned",
  "voice_inconsistency",
  "flat_reveal",
  // checker — a quoted line said three or more times (the reads of 2026-09-22)
  "catchphrase_repeated",
  "clue_recited",
  "humour_move_narrated",
  "summary_ending",
] as const;

export type FindingClass = (typeof FINDING_CLASSES)[number];

/**
 * How the edit loop treats a finding.
 *
 * `report` is the fourth and it is not a weaker `craft`: it means NO editor is asked to repair this,
 * because the guards would revert the repair. A class whose fix the engine forbids is a warning for
 * a human, and pretending otherwise spends a call per chapter to roll back everything it buys.
 */
export type FindingSeverity = "fairplay" | "defect" | "craft" | "report";

export interface Finding {
  class: FindingClass;
  chapter: number;
  /** Verbatim in that chapter, or the finding is discarded and counted (L3). */
  quote: string;
  /** What is wrong, in the reader's terms. */
  note: string;
  severity: FindingSeverity;
  source: "checker" | "critic";
}

export interface Edit {
  /** Verbatim, and unique in the chapter, or the edit is skipped and counted. */
  find: string;
  replace: string;
  /** Indices into the findings list this edit addresses. */
  addresses: number[];
}

export interface EditList {
  edits: Edit[];
  cannot: Array<{ finding: number; why: string }>;
}

export type GuardName =
  | "lockedValuesIntact"
  | "clockValuesIntact"
  | "castNamesIntact"
  | "clueCoverageNotWorse"
  | "noNewScaffold"
  | "noMalformedSplice"
  | "noNewDuplicate"
  | "registerNotWorse"
  | "lengthWithin";

export interface EditOutcome {
  /**
   * Findings the editor declined, with its reason.
   *
   * It was parsed and dropped on the floor. This is the ONE channel by which the model tells us a
   * finding is wrong — the cheapest possible signal that a checker is firing where it should not —
   * and every run threw it away.
   */
  declined?: Array<{ finding: number; why: string }>;
  applied: number;
  skipped: number;
  rolledBack: Partial<Record<GuardName, number>>;
  /** Findings still standing after the round. */
  unresolved: Finding[];
}

/** §07 — one chapter's share of the place, period, inner life and relationships (`depth.ts`). */
export interface Texture {
  senses?: string[];
  access?: string;
  friction?: string;
  conflict?: { name: string; conflict: string; stake?: string };
  history?: { a: string; b: string; past: string };
}
