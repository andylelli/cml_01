/**
 * Narrative Continuity Validator
 * Checks scene-to-scene logic bridges and identity continuity.
 */

import type { Validator, Story, ValidationResult, ValidationError } from './types.js';

const DISAPPEARANCE_TERMS = /\b(disappear(?:ed|ance)?|missing|vanished|gone without trace)\b/i;
const DEATH_TERMS = /\b(murder(?:ed)?|killed|dead|body|corpse|homicide)\b/i;
const BRIDGE_TERMS = /\b(body\s+was\s+found|confirmed\s+dead|turned\s+up\s+dead|missing\s+person\s+case\s+became\s+a\s+murder|identified\s+the\s+body)\b/i;
const ARREST_OR_CONFESSION_TERMS = /\b(arrested|under arrest|confess(?:ed|ion)|admitted\s+it|the\s+culprit\s+was\s+revealed)\b/i;
const ROLE_ALIAS_TERMS = /\b(the\s+(killer|murderer|culprit|criminal)|the\s+suspect\s+did\s+it)\b/i;

export class NarrativeContinuityValidator implements Validator {
  name = 'NarrativeContinuityValidator';

  validate(story: Story): ValidationResult {
    const errors: ValidationError[] = [];

    for (let i = 1; i < story.scenes.length; i += 1) {
      const prev = story.scenes[i - 1];
      const current = story.scenes[i];
      const prevText = prev.text || '';
      const currentText = current.text || '';

      const crossesDisappearanceToDeath = DISAPPEARANCE_TERMS.test(prevText) && DEATH_TERMS.test(currentText);
      if (crossesDisappearanceToDeath && !BRIDGE_TERMS.test(currentText)) {
        errors.push({
          type: 'missing_case_transition_bridge',
          message: `Scene ${current.number} shifts from disappearance to murder without an explicit bridge`,
          severity: 'major',
          sceneNumber: current.number,
          suggestion: 'Add a concrete transition: body discovery, confirmation of death, or identification event'
        });
      }
    }

    let pivotScene = -1;
    for (const scene of story.scenes) {
      if (ARREST_OR_CONFESSION_TERMS.test(scene.text)) {
        pivotScene = scene.number;
        continue;
      }

      if (pivotScene > 0 && scene.number > pivotScene && ROLE_ALIAS_TERMS.test(scene.text)) {
        errors.push({
          type: 'identity_role_alias_break',
          message: `Post-reveal scene ${scene.number} uses role aliasing instead of stable identity references`,
          severity: 'critical',
          sceneNumber: scene.number,
          suggestion: 'Keep the culprit identity stable after arrest/confession; avoid generic role-only renaming'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
