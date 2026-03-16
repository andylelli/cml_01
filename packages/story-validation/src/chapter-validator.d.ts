/**
 * Chapter-level Validator
 * Quick validation for individual chapters during prose generation
 * Catches major issues early before full pipeline validation
 */
import type { CMLData } from './types.js';
export interface ChapterValidationIssue {
    severity: 'critical' | 'major' | 'moderate';
    message: string;
    suggestion?: string;
}
export interface ChapterValidationResult {
    isValid: boolean;
    issues: ChapterValidationIssue[];
}
export interface ChapterContent {
    title: string;
    paragraphs: string[];
    chapterNumber: number;
    /** Total chapters in this story (used to scale late-chapter thresholds). */
    totalChapters?: number;
    /** Canonical month for timeline lock (from temporal context). */
    temporalMonth?: string;
    /** Canonical season derived from temporal month. */
    temporalSeason?: 'spring' | 'summer' | 'autumn' | 'winter';
}
/**
 * Validates a single chapter against CML requirements
 * Focuses on: clue visibility, character consistency, setting fidelity
 */
export declare class ChapterValidator {
    /**
     * Validate a chapter during generation
     * Returns issues that should trigger regeneration
     */
    validateChapter(chapter: ChapterContent, cml: CMLData): ChapterValidationResult;
    private checkCharacterNames;
    private checkSettingFidelity;
    private checkDiscriminatingTest;
    private extractKeyTerms;
    private checkProseQuality;
    private checkSceneGrounding;
    private checkEncodingIntegrity;
    private checkTemporalConsistency;
    /**
     * Checks that the murder victim is introduced by name in the discovery chapter.
     * Only runs for chapter 1. Flags as major if victim is anonymised ("unknown victim", etc.).
     */
    private checkVictimNaming;
    private checkTemplateLeakage;
}
