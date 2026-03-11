/**
 * Shared types used across multiple scoring adapter files.
 */

export type ClueEvidenceState = "introduced" | "hinted" | "explicit" | "confirmed";

export interface ClueEvidenceAnchor {
  clue_id: string;
  chapter_number: number;
  evidence_quote: string;
  evidence_offset: {
    chapter: number;
    paragraph: number;
    sentence: number;
  };
  confidence: number;
  state: ClueEvidenceState;
}

export interface ClueEvidenceExtractionResult {
  visibleClueIds: string[];
  evidenceByClue: Record<string, ClueEvidenceAnchor[]>;
  evidenceByChapter: Record<number, string[]>;
  clueStateById: Record<string, ClueEvidenceState>;
}

// Used as a parameter type in adaptNarrativeForScoring (agent7) and
// as data fed to agent9 adapter at the orchestrator call site.
export interface ClueRef {
  id: string;
  placement?: 'early' | 'mid' | 'late';
}
