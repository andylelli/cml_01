/**
 * Era Authenticity Validator
 * Priority: MODERATE - Ensures period-appropriate details
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
export declare class EraAuthenticityValidator implements Validator {
    name: string;
    validate(story: Story, cml?: CMLData): ValidationResult;
    private checkAnachronisms;
    private checkPeriodMarkers;
}
