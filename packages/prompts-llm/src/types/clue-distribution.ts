/**
 * Agent 5 clue-distribution types — a LEAF module (no imports), so the Agent 9 prose modules can name them without depending on the Agent 5 LLM module (code review A5-05). agent5-clues.ts re-exports them.
 */

export interface Clue {
  id: string;                       // Unique clue identifier
  category: "temporal" | "spatial" | "physical" | "behavioral" | "testimonial";
  description: string;              // Analytic spec sentence (planning surface — kept OUT of prose)
  observable?: string;              // P1.2: the on-page anomaly a character can SEE/HEAR/FIND (preferred for prose)
  inference?: string;               // P1.2: the reasoning the observable supports (embargoed pre-reveal)
  sourceInCML: string;              // Where it comes from in CML (for traceability)
  pointsTo: string;                 // What it reveals (without spoiling)
  first_full_reveal_chapter?: number; // P1.2: earliest chapter the full implication may be stated
  placement: "early" | "mid" | "late"; // When it should appear
  criticality: "essential" | "supporting" | "optional";
  supportsInferenceStep?: number;   // 1-indexed inference_path step this clue enables
  evidenceType?: "observation" | "contradiction" | "elimination"; // Role the clue plays in the step
}

export interface RedHerring {
  id: string;
  description: string;
  supportsAssumption: string;       // Which false assumption it reinforces
  misdirection: string;             // How it misleads
}

export interface ClueExtractionAudit {
  missingDiscriminatingEvidenceIds?: string[];
  weakEliminationSuspects?: string[];
  invalidSourcePaths?: string[];
}

export interface ClueDistributionResult {
  clues: Clue[];
  redHerrings: RedHerring[];
  status?: "pass" | "fail";
  audit?: ClueExtractionAudit;
  /** Parse-boundary anomalies (truncated response, dropped jsonrepair artifacts) for ctx.warnings. */
  parseWarnings?: string[];
  clueTimeline: {
    early: string[];                // Clue IDs for Act I
    mid: string[];                  // Clue IDs for Act II
    late: string[];                 // Clue IDs for Act III
  };
  fairPlayChecks: {
    allEssentialCluesPresent: boolean;
    noNewFactsIntroduced: boolean;
    redHerringsDontBreakLogic: boolean;
    /**
     * A_71 (A_70 §6) — the budget was enforced ONLY as a ceiling (`length <= budget`), so a
     * response with zero red herrings passed every check and the 07-27 run shipped a fair-play
     * mystery with no misdirection field. This records the other side of the same number.
     */
    redHerringBudgetMet: boolean;
  };
  latencyMs: number;
  cost: number;
}
