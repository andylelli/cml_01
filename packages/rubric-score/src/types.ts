/**
 * Final-story rubric types (aligning-the-scoring-system.md, Appendix A).
 *
 * The rubric is a holistic, reader-facing /100 score: ten equal /10 categories judged by an LLM critic
 * reading the finished prose, then **hard-capped in code** by deterministic facts so the number is
 * reproducible and consistent with the story's actual structure. These types are that contract.
 */

export type Category =
  | "premise"
  | "opening_hook"
  | "plot_structure"
  | "character_clarity"
  | "dialogue"
  | "atmosphere"
  | "clues"
  | "pacing"
  | "ending"
  | "prose";

export const CATEGORIES: Category[] = [
  "premise",
  "opening_hook",
  "plot_structure",
  "character_clarity",
  "dialogue",
  "atmosphere",
  "clues",
  "pacing",
  "ending",
  "prose",
];

export interface CategoryMark {
  category: Category;
  /** 0–10, started at 5 then ± (the rubric's philosophy). */
  mark: number;
  /** REQUIRED — the rubric forbids bare "good"/"bad"; every mark cites a concrete reason. */
  reason: string;
  /** Set by the cap engine when a hard cap lowered this mark. */
  capped?: boolean;
}

export interface ChapterIssue {
  chapter: number;
  issues: string[];
}

/** What the LLM critic returns (the structured-output payload — Appendix A). */
export interface RubricScore {
  categories: CategoryMark[]; // exactly 10
  /** Σ marks BEFORE caps — the judge's raw view. */
  total: number;
  overall_view: string;
  what_works: string[];
  main_problems: string[];
  chapter_issues: ChapterIssue[];
  fastest_fixes: string[];
}

/**
 * Deterministic story facts that drive the hard caps. Each field is a machine signal; the role
 * collisions are *exact* (from the CASE artifact), the rest come from detectors or the judge. All
 * default to "not a problem" (false) so a partial `StoryFacts` is safe.
 */
export interface StoryFacts {
  // exact, from CASE
  culpritIsVictim?: boolean;
  victimIsInvestigator?: boolean;
  victimUnnamed?: boolean;
  // detectors over prose
  templateLeakageHits?: string[];
  pronounsUnstable?: boolean;
  // semantic — supplied by the judge (or a deeper checker), default false
  deadVictimAppearsAlive?: boolean;
  deadVictimIsCulprit?: boolean;
  victimIdentityUnclear?: boolean;
  multipleRoleChanges?: boolean;
  weakMurderMethod?: boolean;
  culpritConfessesTamperingOnly?: boolean;
  revealUsesUnplantedEvidence?: boolean;
  noResolution?: boolean;
  endingContradictsEarlier?: boolean;
}

export type Band =
  | "Excellent, polished mystery"
  | "Very strong"
  | "Solid draft"
  | "Promising but rough"
  | "Usable concept, messy execution"
  | "Major continuity problems"
  | "Hard to follow as a story";

/** The final, cap-adjusted score the pipeline ships. */
export interface CappedScore {
  /** 0–100, after category caps + overall ceilings. */
  final: number;
  band: Band;
  /** Every cap that fired, human-readable (for the report's "Main Problems"). */
  capsApplied: string[];
  /** The category marks after clamping. */
  categories: CategoryMark[];
  /** The judge's raw total, before any cap (for telemetry / shadow comparison). */
  rawTotal: number;
}
