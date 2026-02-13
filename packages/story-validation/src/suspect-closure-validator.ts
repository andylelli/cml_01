/**
 * Suspect Closure Validator
 * Verifies suspect elimination ledger coverage and culprit evidence closure.
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

const ELIMINATION_TERMS = /\b(cleared|ruled\s+out|eliminated|not\s+the\s+culprit|innocent|alibi\s+holds)\b/i;
const CULPRIT_TERMS = /\b(culprit|killer|murderer|responsible|did\s+it)\b/i;
const EVIDENCE_TERMS = /\b(evidence|because|therefore|proof|alibi|timeline|constraint|observation)\b/i;

const normalizeName = (name: string) => name.replace(/\s+/g, ' ').trim();

export class SuspectClosureValidator implements Validator {
  name = 'SuspectClosureValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    if (!cml) {
      return { valid: true, errors: [] };
    }

    const errors: ValidationError[] = [];
    const castNames = cml.CASE.cast.map((c) => normalizeName(c.name));
    const culpritSet = new Set((cml.CASE.culpability?.culprits || []).map((name) => normalizeName(name)));
    const suspectNames = castNames.filter((name) => !culpritSet.has(name));

    for (const suspect of suspectNames) {
      const hasClosure = story.scenes.some((scene) => {
        const text = scene.text || '';
        return text.includes(suspect) && ELIMINATION_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      if (!hasClosure) {
        errors.push({
          type: 'suspect_closure_missing',
          message: `Suspect ${suspect} is not explicitly eliminated with evidence`,
          severity: 'major',
          suggestion: 'Add an explicit elimination line tied to concrete evidence or timeline constraints'
        });
      }
    }

    for (const culprit of culpritSet) {
      const hasCulpritChain = story.scenes.some((scene) => {
        const text = scene.text || '';
        return text.includes(culprit) && CULPRIT_TERMS.test(text) && EVIDENCE_TERMS.test(text);
      });

      if (!hasCulpritChain) {
        errors.push({
          type: 'culprit_evidence_chain_missing',
          message: `Culprit ${culprit} is not tied to a non-ambiguous evidence chain`,
          severity: 'critical',
          suggestion: 'Add explicit culprit linkage using at least one decisive evidence statement'
        });
      }
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
