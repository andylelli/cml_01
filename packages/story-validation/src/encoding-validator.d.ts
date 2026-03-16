/**
 * Encoding Validator - Fix UTF-8 encoding artifacts
 * Priority: HIGH - Immediate readability issue
 */
import type { Validator, Story, ValidationResult } from './types.js';
export declare class EncodingValidator implements Validator {
    name: string;
    validate(story: Story): ValidationResult;
    private findEncodingArtifacts;
    private findIllegalControlCharacters;
    /**
     * Auto-fix encoding issues in text
     */
    fixEncoding(text: string): string;
    /**
     * Auto-fix all scenes in a story
     */
    fixStory(story: Story): Story;
}
