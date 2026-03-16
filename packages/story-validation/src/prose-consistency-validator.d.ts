/**
 * Prose Consistency Validator
 *
 * Checks generated prose against:
 *  1. LOCKED FACTS — physical evidence values that must appear verbatim.
 *  2. PRONOUN DRIFT — supplementary check using CML cast gender to catch
 *     any drift not caught by CharacterConsistencyValidator.
 *
 * Severity guide:
 *  - critical:  a locked fact value is directly contradicted in prose
 *  - major:     a locked fact item is mentioned without its correct value
 *  - moderate:  pronoun mismatch detected for a character with known gender
 *  - minor:     possible pronoun drift (ambiguous, heuristic-only)
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
export declare class ProseConsistencyValidator implements Validator {
    name: string;
    validate(story: Story, cml?: CMLData): ValidationResult;
    private checkLockedFacts;
    /**
     * Detect whether a conflicting numeric-or-time value appears within 50 characters
     * of any keyword for the fact, where the canonical value is also numeric/time.
     */
    private detectConflictingValue;
    private checkPronounDrift;
    private findNamePositions;
    /**
     * Classify the opening sentence of a chapter into one of 7 style buckets.
     * Mirrors classifyOpeningStyle() in narrative-state.ts (duplicated here to
     * avoid a cross-package dependency on @cml/prompts-llm).
     */
    private classifyOpeningStyle;
    private checkOpeningStyles;
    private checkContextLeakage;
}
