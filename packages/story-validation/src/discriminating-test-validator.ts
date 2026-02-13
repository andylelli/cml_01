/**
 * Discriminating Test Validator
 * Ensures the prose contains a falsifiable test that excludes all but one suspect.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

const TEST_TERMS = /\b(test|experiment|re-?enactment|trap|constraint proof|demonstration|verification)\b/i;
const EXCLUSION_TERMS = /\b(excluded?|eliminated?|ruled\s+out|could\s+not\s+have|cannot\s+be\s+the\s+culprit|only\s+one\s+person\s+could)\b/i;
const EVIDENCE_TERMS = /\b(because|therefore|proof|evidence|measured|timed|observed)\b/i;

export class DiscriminatingTestValidator implements Validator {
  name = 'DiscriminatingTestValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    const scenesWithTests = story.scenes.filter((scene) => TEST_TERMS.test(scene.text || ''));
    const validTestScenes = scenesWithTests.filter((scene) => {
      const text = scene.text || '';
      return EXCLUSION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
    });

    if (validTestScenes.length === 0) {
      errors.push({
        type: 'missing_discriminating_test',
        message: 'No valid discriminating test found (falsifiable test + exclusion + evidence chain)',
        severity: 'critical',
        suggestion: 'Add a scene with an explicit test that eliminates alternatives and supports one culprit by evidence'
      });
    }

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
