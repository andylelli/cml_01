/**
 * Case Transition Validator
 * Ensures disappearance-to-murder transitions are explicitly narrated.
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
export declare class CaseTransitionValidator implements Validator {
    name: string;
    validate(story: Story, cml?: CMLData): ValidationResult;
}
