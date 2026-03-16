/**
 * Narrative Continuity Validator
 * Checks scene-to-scene logic bridges and identity continuity.
 */
import type { Validator, Story, ValidationResult } from './types.js';
export declare class NarrativeContinuityValidator implements Validator {
    name: string;
    validate(story: Story): ValidationResult;
    private findTemporalMismatch;
}
