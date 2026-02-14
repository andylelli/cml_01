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
export async function semanticValidateDiscriminatingTest(
  sceneText: string,
  client: AzureOpenAIClient
): Promise<SemanticValidationResult> {
  const prompt = `You are a mystery story validator. Analyze the following scene to determine if it contains a valid discriminating test.

A valid discriminating test MUST:
1. Test a specific hypothesis, method, or physical constraint
2. Exclude alternative suspects or possibilities (explicitly or implicitly)
3. Provide evidence, reasoning, or proof for the conclusion

The scene can use natural language and doesn't need keywords like "test", "eliminated", "ruled out", etc.
Examples of valid tests:
- A re-enactment showing only one person could reach the crime scene in time
- A physical demonstration proving the culprit's unique capability
- Timeline analysis that excludes all but one suspect
- A trap or constraint that reveals who has specific knowledge

SCENE TEXT:
${sceneText}

Respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "isValid": true/false,
  "confidence": "high"/"medium"/"low",
  "reasoning": "one sentence explanation"
}`;

  try {
    const response = await client.chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
      maxTokens: 200,
      model: 'gpt-4o'
    });

    const text = response.content?.trim() || '{}';
    const parsed = JSON.parse(text);

    return {
      isValid: parsed.isValid === true,
      confidence: parsed.confidence || 'low',
      reasoning: parsed.reasoning || 'No reasoning provided'
    };
  } catch (error) {
    console.error('Semantic validation error:', error);
    return {
      isValid: false,
      confidence: 'low',
      reasoning: 'Semantic validation failed due to error'
    };
  }
}

/**
 * Semantically validate suspect elimination
 * Check if the scene:
 * - References the specific suspect
 * - Eliminates or clears them
 * - Provides evidence or reasoning
 */
export async function semanticValidateSuspectElimination(
  sceneText: string,
  suspectName: string,
  client: AzureOpenAIClient
): Promise<SemanticValidationResult> {
  const prompt = `You are a mystery story validator. Analyze the following scene to determine if it properly eliminates suspect "${suspectName}".

A valid suspect elimination MUST:
1. Reference the suspect by name
2. Clear, eliminate, or rule them out (explicitly or implicitly)
3. Provide evidence, alibi, timeline constraint, or reasoning

The scene can use natural language and doesn't need keywords like "eliminated", "ruled out", "innocent", etc.
Examples of valid eliminations:
- "Sarah was at the theater that night, confirmed by three witnesses"
- "The footprints were size 11; John wears size 9"
- "A witness saw Margaret in London when the crime occurred in Paris"
- "The diary shows Thomas had no knowledge of the victim's schedule"

SCENE TEXT:
${sceneText}

Respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "isValid": true/false,
  "confidence": "high"/"medium"/"low",
  "reasoning": "one sentence explanation"
}`;

  try {
    const response = await client.chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
      maxTokens: 200,
      model: 'gpt-4o'
    });

    const text = response.content?.trim() || '{}';
    const parsed = JSON.parse(text);

    return {
      isValid: parsed.isValid === true,
      confidence: parsed.confidence || 'low',
      reasoning: parsed.reasoning || 'No reasoning provided'
    };
  } catch (error) {
    console.error('Semantic validation error:', error);
    return {
      isValid: false,
      confidence: 'low',
      reasoning: 'Semantic validation failed due to error'
    };
  }
}

/**
 * Semantically validate culprit evidence chain
 * Check if the scene:
 * - References the culprit
 * - Connects them to the crime
 * - Provides decisive evidence
 */
export async function semanticValidateCulpritEvidence(
  sceneText: string,
  culpritName: string,
  client: AzureOpenAIClient
): Promise<SemanticValidationResult> {
  const prompt = `You are a mystery story validator. Analyze the following scene to determine if it properly connects culprit "${culpritName}" to the crime.

A valid culprit evidence chain MUST:
1. Reference the culprit by name
2. Connect them to the crime (as killer, murderer, responsible party)
3. Provide decisive evidence, proof, or reasoning

The scene can use natural language and doesn't need keywords like "culprit", "murderer", "killer", etc.
Examples of valid evidence chains:
- "The poison in Richard's study matched the substance in the victim's blood"
- "Elizabeth's glove was found at the scene, and she lied about her whereabouts"
- "The telegram proved James knew the victim would be alone that evening"
- "Only Catherine had access to the locked room where the weapon was stored"

SCENE TEXT:
${sceneText}

Respond with EXACTLY this JSON format (no markdown, no extra text):
{
  "isValid": true/false,
  "confidence": "high"/"medium"/"low",
  "reasoning": "one sentence explanation"
}`;

  try {
    const response = await client.chat({
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.0,
      maxTokens: 200,
      model: 'gpt-4o'
    });

    const text = response.content?.trim() || '{}';
    const parsed = JSON.parse(text);

    return {
      isValid: parsed.isValid === true,
      confidence: parsed.confidence || 'low',
      reasoning: parsed.reasoning || 'No reasoning provided'
    };
  } catch (error) {
    console.error('Semantic validation error:', error);
    return {
      isValid: false,
      confidence: 'low',
      reasoning: 'Semantic validation failed due to error'
    };
  }
}
