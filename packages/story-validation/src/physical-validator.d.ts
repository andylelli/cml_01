/**
 * Physical Plausibility Validator
 * Priority: HIGH - Ensures evidence is physically realistic
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
export declare class PhysicalPlausibilityValidator implements Validator {
    name: string;
    validate(story: Story, cml?: CMLData): ValidationResult;
    private validateFootprints;
    private validateEmbeddedObjects;
    private validateWeatherEvidence;
    private validateStruggleEvidence;
}
