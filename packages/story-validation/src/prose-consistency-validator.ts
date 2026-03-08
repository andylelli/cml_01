/**
 * Prose Consistency Validator
 *
 * Checks generated prose against:
 *  1. LOCKED FACTS — physical evidence values that must appear verbatim.
 *  2. PRONOUN DRIFT — supplementary check using CML cast gender to catch
 *     any drift not caught by CharacterConsistencyValidator.
 *
 * Severity guide:
 *  - critical:  a locked fact value is directly contradicted in prose
 *  - major:     a locked fact item is mentioned without its correct value
 *  - moderate:  pronoun mismatch detected for a character with known gender
 *  - minor:     possible pronoun drift (ambiguous, heuristic-only)
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError } from './types.js';

interface LockedFact {
  id: string;
  value: string;
  description: string;
  appearsInChapters?: string[];
}

/** Regex-escape a string for use inside a RegExp */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Derive canonical pronouns from a gender string.
 * Returns { subject, object, possessive } or null if gender is unknown.
 */
function genderToPronouns(gender: string | undefined): { subject: string; object: string; possessive: string } | null {
  switch ((gender ?? '').toLowerCase()) {
    case 'male':
      return { subject: 'he', object: 'him', possessive: 'his' };
    case 'female':
      return { subject: 'she', object: 'her', possessive: 'her' };
    case 'non-binary':
      return { subject: 'they', object: 'them', possessive: 'their' };
    default:
      return null;
  }
}

/** Returns the pronoun set for the opposite binary gender (used to detect drift). */
function oppositePronouns(gender: string): { subject: string; object: string; possessive: string } | null {
  switch (gender.toLowerCase()) {
    case 'male':
      return { subject: 'she', object: 'her', possessive: 'her' };
    case 'female':
      return { subject: 'he', object: 'him', possessive: 'his' };
    default:
      return null;
  }
}

export class ProseConsistencyValidator implements Validator {
  name = 'ProseConsistencyValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    errors.push(...this.checkLockedFacts(story, cml));
    errors.push(...this.checkPronounDrift(story, cml));
    errors.push(...this.checkOpeningStyles(story));
    errors.push(...this.checkContextLeakage(story));

    return { valid: errors.every(e => e.severity !== 'critical'), errors };
  }

  // ---------------------------------------------------------------------------
  // 1. Locked-facts consistency
  // ---------------------------------------------------------------------------

  private checkLockedFacts(story: Story, cml?: CMLData): ValidationError[] {
    const lockedFacts: LockedFact[] = cml?.lockedFacts ?? [];
    if (lockedFacts.length === 0) return [];

    const errors: ValidationError[] = [];

    for (const fact of lockedFacts) {
      const canonicalValue = fact.value.trim();
      if (!canonicalValue) continue;

      // Keywords that suggest prose is referencing this fact
      const keywords = fact.description
        .toLowerCase()
        .split(/\s+/)
        .filter(w => w.length > 3);

      for (const scene of story.scenes) {
        const text = scene.text.toLowerCase();

        // Does the scene mention keywords from this fact's description?
        const mentionsFact = keywords.some(kw => text.includes(kw));
        if (!mentionsFact) continue;

        // Does the verbatim value appear? If not, flag as major.
        const valuePattern = new RegExp(escapeRegex(canonicalValue.toLowerCase()), 'i');
        if (!valuePattern.test(scene.text)) {
          // Check whether a recognisably *different* numeric value appears near the keywords
          const hasConflict = this.detectConflictingValue(scene.text, canonicalValue);
          errors.push({
            type: hasConflict ? 'locked_fact_contradicted' : 'locked_fact_missing_value',
            message: hasConflict
              ? `Locked fact "${fact.description}" contradicted in chapter ${scene.number}. Expected value "${canonicalValue}" but a different value appears nearby.`
              : `Locked fact "${fact.description}" is described in chapter ${scene.number} without its canonical value "${canonicalValue}".`,
            severity: hasConflict ? 'critical' : 'major',
            sceneNumber: scene.number,
            suggestion: `Use the exact value "${canonicalValue}" whenever this evidence is described.`,
            cmlReference: `lockedFacts[${fact.id}]`,
          });
        }
      }
    }

    return errors;
  }

  /**
   * Detect whether a conflicting numeric-or-time value appears within 50 characters
   * of any keyword for the fact, where the canonical value is also numeric/time.
   */
  private detectConflictingValue(text: string, canonicalValue: string): boolean {
    // Only trigger for values that are numbers, times (e.g. "10:47", "3 yards")
    const isNumericOrTime = /\d/.test(canonicalValue);
    if (!isNumericOrTime) return false;

    // Find all numeric tokens in prose then compare to canonical
    const numericPattern = /\b\d[\d:.,]*\s*(?:minutes?|hours?|yards?|feet|inches|seconds?|pm|am|o'clock)?\b/gi;
    const proseNumbers = [...text.matchAll(numericPattern)].map(m => m[0].trim());
    // If any numeric token in the prose differs from canonical but overlaps on digits/time, flag
    return proseNumbers.some(n => n !== canonicalValue && n !== '' && !n.includes(canonicalValue) && !canonicalValue.includes(n));
  }

  // ---------------------------------------------------------------------------
  // 2. Pronoun drift (supplement to CharacterConsistencyValidator)
  // ---------------------------------------------------------------------------

  private checkPronounDrift(story: Story, cml?: CMLData): ValidationError[] {
    if (!cml?.CASE?.cast) return [];

    const errors: ValidationError[] = [];

    for (const castMember of cml.CASE.cast) {
      const gender = castMember.gender;
      if (!gender || gender === 'non-binary') continue; // non-binary uses they/them; no binary drift to detect

      const canonical = genderToPronouns(gender);
      const wrong = oppositePronouns(gender);
      if (!canonical || !wrong) continue;

      const firstName = castMember.name.split(' ')[0];
      const windowSize = 200; // characters around name mention to check

      for (const scene of story.scenes) {
        const positions = this.findNamePositions(scene.text, firstName);
        for (const pos of positions) {
          const window = scene.text.slice(Math.max(0, pos - windowSize), pos + firstName.length + windowSize);
          const windowLower = window.toLowerCase();

          // If a wrong-gender pronoun appears in this window, flag it
          const wrongPronounPattern = new RegExp(`\\b(${wrong.subject}|${wrong.object}|${wrong.possessive})\\b`, 'i');
          if (wrongPronounPattern.test(windowLower)) {
            errors.push({
              type: 'pronoun_drift',
              message: `Pronoun drift for "${castMember.name}" in chapter ${scene.number}: expected ${canonical.subject}/${canonical.object}/${canonical.possessive} (${gender}) but found a ${gender === 'male' ? 'female' : 'male'} pronoun nearby.`,
              severity: 'moderate',
              sceneNumber: scene.number,
              suggestion: `Use "${canonical.subject}/${canonical.object}/${canonical.possessive}" exclusively for ${castMember.name}.`,
              cmlReference: `cast[${castMember.name}].gender`,
            });
            break; // one error per character per scene is enough
          }
        }
      }
    }

    return errors;
  }

  private findNamePositions(text: string, name: string): number[] {
    const positions: number[] = [];
    const pattern = new RegExp(`\\b${escapeRegex(name)}\\b`, 'gi');
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      positions.push(match.index);
    }
    return positions;
  }

  // ---------------------------------------------------------------------------
  // 3. Opening style repetition
  // ---------------------------------------------------------------------------

  /**
   * Classify the opening sentence of a chapter into one of 7 style buckets.
   * Mirrors classifyOpeningStyle() in narrative-state.ts (duplicated here to
   * avoid a cross-package dependency on @cml/prompts-llm).
   */
  private classifyOpeningStyle(sentence: string): string {
    const s = sentence.trim().toLowerCase();
    if (s.startsWith('"') || s.startsWith('\u2018') || s.startsWith('\u201c')) return 'dialogue-open';
    if (/^(the|a|an) [a-z]+ (of|in|at|from|with)/.test(s)) return 'noun-phrase-atmosphere';
    if (/^(it was|there was|there had been)/.test(s)) return 'expository-setup';
    if (/^(when|after|before|as|by the time)/.test(s)) return 'temporal-subordinate';
    if (/^[a-z]+ (had|was|were|stood|sat|lay|walked|entered|opened|closed)/.test(s)) return 'character-action';
    if (/\d{1,2}(\.\d{1,2})?\s*(a\.m\.|p\.m\.|o'clock|am|pm)/i.test(s)) return 'time-anchor';
    return 'general-descriptive';
  }

  private checkOpeningStyles(story: Story): ValidationError[] {
    if (story.scenes.length < 4) return []; // too few chapters to penalise repetition

    const styleCounts = new Map<string, number[]>(); // style → scene numbers

    for (const scene of story.scenes) {
      const firstSentenceMatch = scene.text.match(/^[^.!?]+[.!?]/);
      if (!firstSentenceMatch) continue;
      const style = this.classifyOpeningStyle(firstSentenceMatch[0]);
      if (!styleCounts.has(style)) styleCounts.set(style, []);
      styleCounts.get(style)!.push(scene.number);
    }

    const errors: ValidationError[] = [];
    const total = story.scenes.length;

    for (const [style, scenes] of styleCounts.entries()) {
      const pct = scenes.length / total;
      if (pct > 0.5) {
        errors.push({
          type: 'opening_style_repetition',
          message: `Opening style "${style}" used in ${scenes.length}/${total} chapters (${Math.round(pct * 100)}%) — exceeds 50% threshold. Chapters: ${scenes.join(', ')}.`,
          severity: 'moderate',
          suggestion: 'Vary chapter opening styles: try dialogue-open, time-anchor, character-action, noun-phrase-atmosphere across chapters.',
        });
      }
    }

    return errors;
  }

  // ---------------------------------------------------------------------------
  // 4. Context leakage detection
  // ---------------------------------------------------------------------------

  private checkContextLeakage(story: Story): ValidationError[] {
    const errors: ValidationError[] = [];

    // Pattern 1: verbatim location-template phrase "At The [Capitalised] in [Capitalised]"
    const locationTemplatePattern = /\bAt The [A-Z][a-zA-Z\s]+ in [A-Z][a-zA-Z]+\b/g;

    for (const scene of story.scenes) {
      const locationMatches = [...scene.text.matchAll(locationTemplatePattern)];
      for (const match of locationMatches) {
        errors.push({
          type: 'context_leakage',
          message: `Context template phrase "${match[0]}" detected verbatim in chapter ${scene.number}. This indicates a location profile paragraph was transcribed into prose.`,
          severity: 'major',
          sceneNumber: scene.number,
          suggestion: 'Remove or rewrite this passage — it appears to copy a location profile template rather than original prose.',
        });
      }

      // Pattern 2: very long sentences (>40 words) showing hallmarks of location profile templates
      const sentences = scene.text.split(/(?<=[.!?])\s+/);
      for (const sentence of sentences) {
        const wordCount = sentence.trim().split(/\s+/).length;
        if (wordCount > 40) {
          const hasLocationRoom = /\b(drawing room|library|study|kitchen|dining|hallway|parlour|parlor|cellar|attic|corridor)\b/i.test(sentence);
          const hasCountryOrEstate = /\b(England|Scotland|France|manor|estate|hall|village|countryside)\b/i.test(sentence);
          const hasSensoryEnum = /\b(smell|scent|sound|sight|touch|aroma|fragrance|reek|odour|odor)\b/i.test(sentence);
          if (hasLocationRoom && hasCountryOrEstate && hasSensoryEnum) {
            errors.push({
              type: 'context_leakage_suspected',
              message: `Suspected context leakage in chapter ${scene.number}: a ${wordCount}-word sentence shows hallmarks of a location profile template (room + country/estate + sensory enumeration).`,
              severity: 'minor',
              sceneNumber: scene.number,
              suggestion: 'Verify this sentence is original prose and not copied from a location profile paragraph.',
            });
          }
        }
      }
    }

    return errors;
  }
}
