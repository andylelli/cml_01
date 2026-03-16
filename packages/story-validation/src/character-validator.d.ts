/**
 * Character Consistency Validator
 * Priority: CRITICAL - Prevents story-breaking character inconsistencies
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
export declare class CharacterConsistencyValidator implements Validator {
    name: string;
    validate(story: Story, cml?: CMLData): ValidationResult;
    private buildCharacterManifest;
    private buildCanonicalLabelIndex;
    private parseGender;
    private getPronounsForGender;
    private isCrewRole;
    private extractCharacterNames;
    private containsLabel;
    private containsAnyLabel;
    private extractSurname;
    private checkPronounAgreement;
    private findIncorrectPronouns;
    private checkNamedWalkOns;
    private checkRoleLocationConsistency;
    private detectNameSwitches;
}
