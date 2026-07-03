/**
 * Narrative Continuity Validator
 * Checks scene-to-scene logic bridges and identity continuity.
 */

import type { Validator, Story, ValidationResult, ValidationError } from './types.js';
import { analyzeTemporalConsistency } from './temporal-consistency.js';

const DISAPPEARANCE_TERMS = /\b(disappear(?:ed|ance)?|missing|vanished|gone without trace)\b/i;
export const DEATH_TERMS = /\b(murder(?:ed)?|killed|dead|body|corpse|homicide)\b/i;
// A_53 P5 (missing-bridge-false-positive-body-discovery): a plain discovery-of-body sentence — "they
// found her body at the foot of the cliff", "the corpse was discovered" — IS a valid disappearance→
// death bridge, but the old pattern only matched "found dead"/"body was found". Add the discovery
// collocations so a legitimately-bridged scene is no longer flagged `missing_case_transition_bridge`.
export const BRIDGE_TERMS = /\b(body\s+was\s+found|confirmed\s+dead|turned\s+up\s+dead|missing\s+person\s+case\s+became\s+a\s+murder|identified\s+the\s+body|found\s+dead|found\s+\w+\s+dead|discovered\s+dead|discovered\s+\w+\s+dead|was\s+found\s+dead|had\s+been\s+(?:murdered|killed|slain)|no\s+longer\s+missing|(?:found|discovered|recovered)\s+(?:\w+\s+){0,3}(?:body|corpse|remains)|(?:body|corpse|remains)\s+(?:was\s+|were\s+)?(?:found|discovered|recovered))\b/i;

// A_61 RC3.3 — a person-context disappearance check for the detect→regen trigger. Tighter than the
// validator's DISAPPEARANCE_TERMS (which the validator keeps for back-compat): a bare "missing" object
// noun ("missing cufflink") must NOT trigger a regen, so the detector requires person context.
const PERSON_DISAPPEARANCE_RE =
  /\b(disappear(?:ed|ance)?|vanished|gone\s+without\s+trace|(?:went|gone)\s+missing|missing[- ](?:person|man|woman|lady|gentleman|girl|boy|child|heir|guest)|(?:person|man|woman|lady|gentleman|girl|boy|child|heir|guest)\b[^.!?]{0,20}?\bmissing)\b/i;

/** Location of a missing-transition-bridge defect for the RC3.3 regen pass. */
export interface CaseTransitionDefectLoc {
  /** 1-based chapter number of the chapter that introduces murder language without a bridge. */
  chapterNumber: number;
  /** 0-based paragraph index (first paragraph matching DEATH_TERMS) to scope the regen edit. */
  paragraphIndex: number;
}

/**
 * A_61 RC3.3 — chapter-granularity detector: a chapter whose PREDECESSOR frames a person's disappearance
 * and which introduces murder language WITHOUT a bridging body-discovery/confirmation event. Returns one
 * defect per offending chapter (empty = clean). Pure; used by the Agent-9 detect→regen pass.
 */
export function detectMissingCaseTransitionBridge(
  chapters: ReadonlyArray<{ paragraphs?: string[] }>,
): CaseTransitionDefectLoc[] {
  const out: CaseTransitionDefectLoc[] = [];
  for (let i = 1; i < chapters.length; i += 1) {
    const prevText = (chapters[i - 1]?.paragraphs ?? []).join(' ');
    const curParas = chapters[i]?.paragraphs ?? [];
    const curText = curParas.join(' ');
    if (PERSON_DISAPPEARANCE_RE.test(prevText) && DEATH_TERMS.test(curText) && !BRIDGE_TERMS.test(curText)) {
      const idx = curParas.findIndex((p) => DEATH_TERMS.test(String(p ?? '')));
      out.push({ chapterNumber: i + 1, paragraphIndex: Math.max(0, idx) });
    }
  }
  return out;
}
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

    // Only allow the reveal-pivot to be detected in the final 30% of scenes (minimum 2).
    // Arrest/confession vocabulary ("arrested", "confession", etc.) appears naturally in
    // pre-reveal investigation prose and creates false pivots when scanned from scene 1.
    // Restricting pivot detection to the final act prevents flagging legitimate investigation
    // chapters that happen to mention these terms before the culprit is actually revealed.
    const totalScenes = story.scenes.length;
    const pivotWindowStart = Math.max(1, totalScenes - Math.max(2, Math.ceil(totalScenes * 0.3)));
    let pivotScene = -1;
    for (const scene of story.scenes) {
      if (scene.number >= pivotWindowStart && ARREST_OR_CONFESSION_TERMS.test(scene.text)) {
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
