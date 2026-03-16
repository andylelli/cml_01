/**
 * Semantic Validation Utility
 * Uses LLM to semantically validate prose when keyword-based regex patterns fail
 *
 * This fallback approach preserves natural prose quality while ensuring correctness.
 */
import type { AzureOpenAIClient } from '@cml/llm-client';
export interface SemanticValidationResult {
    isValid: boolean;
    confidence: 'high' | 'medium' | 'low';
    reasoning: string;
}
/**
 * Semantically validate a discriminating test scene
 * Check if the scene:
 * - Tests a hypothesis or method
 * - Excludes alternative suspects
 * - Provides evidence or reasoning
 */
export declare function semanticValidateDiscriminatingTest(sceneText: string, client: AzureOpenAIClient): Promise<SemanticValidationResult>;
/**
 * Semantically validate suspect elimination
 * Check if the scene:
 * - References the specific suspect
 * - Eliminates or clears them
 * - Provides evidence or reasoning
 */
export declare function semanticValidateSuspectElimination(sceneText: string, suspectName: string, client: AzureOpenAIClient): Promise<SemanticValidationResult>;
/**
 * Semantically validate culprit evidence chain
 * Check if the scene:
 * - References the culprit
 * - Connects them to the crime
 * - Provides decisive evidence
 */
export declare function semanticValidateCulpritEvidence(sceneText: string, culpritName: string, client: AzureOpenAIClient): Promise<SemanticValidationResult>;
