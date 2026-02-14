/**
 * Discriminating Test Validator
 * Ensures the prose contains a falsifiable test that excludes all but one suspect.
 * Uses regex-first validation with LLM semantic fallback for natural prose.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';
import type { AzureOpenAIClient } from '@cml/llm-client';
import { semanticValidateDiscriminatingTest } from './semantic-validator.js';

const TEST_TERMS = /\b(test|experiment|re-?enactment|trap|constraint proof|demonstration|verification)\b/i;
const EXCLUSION_TERMS = /\b(excluded?|eliminated?|ruled\s+out|could\s+not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could)\b/i;
const EVIDENCE_TERMS = /\b(because|therefore|proof|evidence|measured|timed|observed)\b/i;

export class DiscriminatingTestValidator implements Validator {
  name = 'DiscriminatingTestValidator';
  private llmClient?: AzureOpenAIClient;

  constructor(llmClient?: AzureOpenAIClient) {
    this.llmClient = llmClient;
  }

  async validate(story: Story, cml?: CMLData): Promise<ValidationResult> {
    const errors: ValidationError[] = [];

    // Phase 1: Regex-based validation (fast, cheap)
    const scenesWithTests = story.scenes.filter((scene) => TEST_TERMS.test(scene.text || ''));
    const validTestScenes = scenesWithTests.filter((scene) => {
      const text = scene.text || '';
      return EXCLUSION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
    });

    let hasValidTest = validTestScenes.length > 0;

    // Phase 2: Semantic fallback (if regex fails and LLM is available)
    if (!hasValidTest && this.llmClient) {
      console.log('[DiscriminatingTestValidator] Regex validation failed; trying semantic fallback...');

      // Check all scenes for semantic validity
      for (const scene of story.scenes) {
        const semanticResult = await semanticValidateDiscriminatingTest(scene.text || '', this.llmClient);
        
        if (semanticResult.isValid && semanticResult.confidence !== 'low') {
          console.log(`[DiscriminatingTestValidator] Scene ${scene.number} validated semantically: ${semanticResult.reasoning}`);
          hasValidTest = true;
          break;
        }
      }

      if (!hasValidTest) {
        console.log('[DiscriminatingTestValidator] Semantic validation also failed');
      }
    }

    // Add errors if validation failed both ways
    if (!hasValidTest) {
      errors.push({
        type: 'missing_discriminating_test',
        message: 'No valid discriminating test found (falsifiable test + exclusion + evidence chain)',
        severity: 'critical',
        suggestion: 'Add a scene with an explicit test that eliminates alternatives and supports one culprit by evidence'
      });
    }

    // Check CML realization
    if (cml?.CASE?.discriminating_test?.method && scenesWithTests.length === 0) {
      errors.push({
        type: 'cml_test_not_realized',
        message: 'CML includes a discriminating test, but prose does not stage it explicitly',
        severity: 'major',
        suggestion: 'Realize the CML discriminating test method in an on-page scene'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
