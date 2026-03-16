/**
 * Discriminating Test Validator
 * Ensures the prose contains a falsifiable test that excludes all but one suspect.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
export declare class DiscriminatingTestValidator implements Validator {
    name: string;
    private llmClient?;
    constructor(llmClient?: AzureOpenAIClient);
    validate(story: Story, cml?: CMLData): Promise<ValidationResult>;
}
