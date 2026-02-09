// Type definitions for component interfaces
// These are re-exported from the Vue components for better TypeScript support

export type ErrorSeverity = "error" | "warning" | "info";

export interface ErrorItem {
  id: string;
  timestamp: number;
  severity: ErrorSeverity;
  scope: string;
  message: string;
  details?: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  warnings?: string[];
}

export interface AllValidation {
  setting: ValidationResult;
  cast: ValidationResult;
  cml: ValidationResult;
  clues: ValidationResult;
  outline: ValidationResult;
}

export interface ProseChapter {
  title: string;
  summary?: string;
  paragraphs: string[];
}

export interface ProseData {
  status: string;
  tone?: string;
  chapters: ProseChapter[];
  cast?: string[];
  note?: string;
}

export interface RunEvent {
  step: string;
  message: string;
}

export interface NoveltyAuditData {
  status: "pass" | "fail" | "warn";
  seedIds: string[];
  patterns?: Array<{
    seed: string;
    similarity: number;
    matches: string[];
  }>;
  summary?: string;
}

// Tab navigation types
export type TabStatus = "complete" | "error" | "in-progress" | "locked" | "available";

export interface Tab {
  id: string;
  label: string;
  disabled?: boolean;
  icon?: string;
}

export interface SubTab extends Tab {
  parentId: string;
}
