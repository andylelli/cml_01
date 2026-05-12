export type BatchGateName =
  | "encoding"
  | "completeness_structure"
  | "locked_fact_word_form"
  | "character_pronoun_consistency"
  | "clue_placement_timing"
  | "temporal_continuity"
  | "template_leakage";

export interface BatchGateOutcome {
  gate: BatchGateName;
  passed: boolean;
  /** Number of failed attempts that tripped this gate before commit. */
  failedAttempts: number;
}

export interface BatchCommitRecord {
  chapterStart: number;
  chapterEnd: number;
  chapterRange: string;
  attemptCount: number;
  gateOutcomes: BatchGateOutcome[];
  newClueIdsRevealed: string[];
  cumulativeClueSet: string[];
  deployedAtomIds: string[];
  continuityTailPreview: string;
  promptFingerprintHash: string;
  durationMs: number;
  cost: number;
}
