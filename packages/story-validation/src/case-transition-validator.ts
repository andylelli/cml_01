/**
 * Case Transition Validator
 * Ensures disappearance-to-murder transitions are explicitly narrated.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

const DISAPPEARANCE_TERMS = /\b(disappear(?:ed|ance)?|missing|vanished)\b/i;
const MURDER_TERMS = /\b(murder(?:ed)?|homicide|corpse|body\s+was\s+found|dead)\b/i;
const BRIDGE_TERMS = /\b(body\s+was\s+found|confirmed\s+dead|turned\s+up\s+dead|identified\s+the\s+body|missing\s+person\s+case\s+became\s+a\s+murder|found\s+dead|found\s+\w+\s+dead|discovered\s+dead|discovered\s+\w+\s+dead|was\s+found\s+dead|had\s+been\s+(?:murdered|killed|slain)|no\s+longer\s+missing)\b/i;

export class CaseTransitionValidator implements Validator {
  name = 'CaseTransitionValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    const text = story.scenes.map((s) => s.text || '').join('\n\n');
    const hasDisappearanceSignal = DISAPPEARANCE_TERMS.test(text);
    const hasMurderSignal = MURDER_TERMS.test(text);
    const hasBridgeSignal = BRIDGE_TERMS.test(text);

    const cmlCrimeCategory = cml?.CASE?.meta?.crime_class?.victim_identity_status?.toLowerCase() || '';
    const shouldEnforce = hasDisappearanceSignal || cmlCrimeCategory.includes('missing') || cmlCrimeCategory.includes('unknown');

    if (shouldEnforce && hasMurderSignal && !hasBridgeSignal) {
      errors.push({
        type: 'case_transition_missing',
        message: 'Story references both disappearance and murder but lacks an explicit transition bridge',
        severity: 'major',
        suggestion: 'Add a concrete hinge scene where the disappearance is reclassified as murder'
      });
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
