export type ReleaseGateStatus = "passed" | "warning" | "failed";

export interface ReleaseGateAudit {
  status: ReleaseGateStatus;
  warningReasons: string[];
  hardStopReasons: string[];
  validationErrorTypes: string[];
  nsdVisibilityDivergence: {
    diverged: boolean;
    revealedCount: number;
    evidenceVisibleCount: number;
    revealedWithoutEvidence: string[];
    evidenceWithoutReveal: string[];
  };
  readability: {
    denseChapterCount: number;
    underParagraphCount: number;
    severeParagraphBlocks: number;
  };
  sceneGrounding: {
    grounded: number;
    total: number;
    coverage: number;
  };
  placeholderLeakage: {
    hasLeakage: boolean;
    roleSurnameCount: number;
    standaloneCount: number;
    genericRoleCount: number;
    examples: string[];
  };
  chapterHeadingArtifacts: {
    hasArtifacts: boolean;
    duplicatedHeadingCount: number;
  };
  hasIllegalControlChars: boolean;
  hasMojibake: boolean;
  fairPlayStatus?: string | null;
}
