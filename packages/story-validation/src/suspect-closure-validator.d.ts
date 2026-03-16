/**
 * Suspect Closure Validator
 * Verifies suspect elimination ledger coverage and culprit evidence closure.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */
import type { Validator, Story, CMLData, ValidationResult } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
export declare class SuspectClosureValidator implements Validator {
    name: string;
    private llmClient?;
    constructor(llmClient?: AzureOpenAIClient);
    validate(story: Story, cml?: CMLData): Promise<ValidationResult>;
}
