/**
 * Narrative Continuity Validator
 * Checks scene-to-scene logic bridges and identity continuity.
 */

import type { Validator, Story, ValidationResult, ValidationError } from './types.js';
import { analyzeTemporalConsistency } from './temporal-consistency.js';

const DISAPPEARANCE_TERMS = /\b(disappear(?:ed|ance)?|missing|vanished|gone without trace)\b/i;
const DEATH_TERMS = /\b(murder(?:ed)?|killed|dead|body|corpse|homicide)\b/i;
const BRIDGE_TERMS = /\b(body\s+was\s+found|confirmed\s+dead|turned\s+up\s+dead|missing\s+person\s+case\s+became\s+a\s+murder|identified\s+the\s+body)\b/i;
const ARREST_OR_CONFESSION_TERMS = /\b(arrested|under arrest|confess(?:ed|ion)|admitted\s+it|the\s+culprit\s+was\s+revealed)\b/i;
const ROLE_ALIAS_TERMS = /\b(the\s+(killer|murderer|culprit|criminal)|the\s+suspect\s+did\s+it)\b/i;
const AMATEUR_INVESTIGATOR_TERMS = /\b(amateur investigator|civilian investigator|friend[- ]turned[- ]investigator)\b/i;
const OFFICIAL_TAKES_CHARGE_TERMS = /\b(inspector|detective|constable)\b[\s\S]{0,30}\b(took\s+charge|led\s+the\s+investigation|assumed\s+command)\b/i;
const ROLE_TRANSITION_TERMS = /\b(joined\s+forces|worked\s+together|assisted\s+the\s+police|in\s+partnership\s+with)\b/i;

export class NarrativeContinuityValidator implements Validator {
  name = 'NarrativeContinuityValidator';

  validate(story: Story): ValidationResult {
    const errors: ValidationError[] = [];
    let sawAmateurInvestigator = false;

    for (let i = 1; i < story.scenes.length; i += 1) {
      const prev = story.scenes[i - 1];
      const current = story.scenes[i];
      const prevText = prev.text || '';
      const currentText = current.text || '';

      if (AMATEUR_INVESTIGATOR_TERMS.test(prevText) || AMATEUR_INVESTIGATOR_TERMS.test(currentText)) {
        sawAmateurInvestigator = true;
      }

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

      if (
        sawAmateurInvestigator &&
        OFFICIAL_TAKES_CHARGE_TERMS.test(currentText) &&
        !ROLE_TRANSITION_TERMS.test(currentText)
      ) {
        errors.push({
          type: 'investigator_role_drift',
          message: `Scene ${current.number} shifts investigative authority without a clear transition from amateur investigator framing`,
          severity: 'major',
          sceneNumber: current.number,
          suggestion: 'Add an explicit transition showing how investigative authority changes hands or becomes collaborative'
        });
      }

      const temporalMismatch = this.findTemporalMismatch(currentText);
      if (temporalMismatch) {
        errors.push({
          type: 'temporal_contradiction',
          message: `Scene ${current.number} has month/season contradiction (${temporalMismatch})`,
          severity: 'major',
          sceneNumber: current.number,
          suggestion: 'Align season wording with explicit month references to maintain temporal continuity'
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

  private findTemporalMismatch(text: string): string | null {
    const analysis = analyzeTemporalConsistency(text);
    if (analysis.conflictingSeasons.length === 0) return null;
    return `${analysis.mentionedMonths.join(', ')} vs ${analysis.conflictingSeasons.join(', ')}`;
  }
}
