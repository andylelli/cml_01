/**
 * Character Consistency Validator
 * Priority: CRITICAL - Prevents story-breaking character inconsistencies
 */

import type { Validator, Story, CMLData, ValidationResult, ValidationError, CharacterState } from './types.js';

const TITLED_NAME_PATTERN = /\b(Inspector|Constable|Sergeant|Captain|Detective|Mr\.?|Mrs\.?|Miss|Dr\.?)\s+([A-Z][a-z]+(?:[-'’][A-Z][a-z]+)?)/g;

export class CharacterConsistencyValidator implements Validator {
  name = 'CharacterConsistencyValidator';

  validate(story: Story, cml?: CMLData): ValidationResult {
    const errors: ValidationError[] = [];

    if (!cml) {
      return { valid: true, errors: [] };
    }

    const { manifest, aliasToCanonical, allowedSurnames } = this.buildCharacterManifest(cml);
    const allReferenceLabels = Array.from(aliasToCanonical.keys());
    const canonicalToLabels = this.buildCanonicalLabelIndex(aliasToCanonical);

    // Build per-gender label sets for the competing-entity guard in findIncorrectPronouns.
    const maleLabels: string[] = [];
    const femaleLabels: string[] = [];
    for (const [name, charState] of manifest.entries()) {
      const labels = canonicalToLabels.get(name) ?? [name.toLowerCase()];
      if (charState.gender === 'male') maleLabels.push(...labels);
      else if (charState.gender === 'female') femaleLabels.push(...labels);
    }
    const competingGenderLabels = { male: maleLabels, female: femaleLabels };

    const usageTracker = new Map<string, { scenes: number[]; pronouns: Set<string> }>();

    for (const scene of story.scenes) {
      const walkOnErrors = this.checkNamedWalkOns(scene.text, scene.number, allowedSurnames);
      errors.push(...walkOnErrors);

      const mentionedNames = this.extractCharacterNames(scene.text, aliasToCanonical);

      for (const name of mentionedNames) {
        if (!usageTracker.has(name)) {
          usageTracker.set(name, { scenes: [], pronouns: new Set() });
        }
        usageTracker.get(name)!.scenes.push(scene.number);
      }

      for (const [name, charState] of manifest.entries()) {
        const labelsForCharacter = canonicalToLabels.get(name) ?? [name.toLowerCase()];
        if (this.containsAnyLabel(scene.text, labelsForCharacter)) {
          const pronounErrors = this.checkPronounAgreement(
            scene.text,
            name,
            charState,
            scene.number,
            labelsForCharacter,
            allReferenceLabels,
            competingGenderLabels
          );
          errors.push(...pronounErrors);
        }
      }

      const locationErrors = this.checkRoleLocationConsistency(scene, manifest);
      errors.push(...locationErrors);
    }

    const switchErrors = this.detectNameSwitches(story, manifest);
    errors.push(...switchErrors);

    return {
      valid: errors.length === 0,
      errors
    };
  }

  private buildCharacterManifest(cml: CMLData): {
    manifest: Map<string, CharacterState>;
    aliasToCanonical: Map<string, string>;
    allowedSurnames: Set<string>;
  } {
    const manifest = new Map<string, CharacterState>();
    const aliasToCanonical = new Map<string, string>();
    const allowedSurnames = new Set<string>();

    const addAlias = (label: string, canonical: string): void => {
      const normalized = label.trim().toLowerCase();
      if (!normalized) return;
      aliasToCanonical.set(normalized, canonical);
    };

    for (const char of cml.CASE.cast) {
      const gender = this.parseGender(char.gender);
      manifest.set(char.name, {
        name: char.name,
        gender,
        role: char.role_archetype,
        pronouns: this.getPronounsForGender(gender),
        isCrewMember: this.isCrewRole(char.role_archetype)
      });

      addAlias(char.name, char.name);

      const surname = this.extractSurname(char.name);
      if (surname) {
        allowedSurnames.add(surname.toLowerCase());
      }

      const aliasField = (char as any).alias;
      if (typeof aliasField === 'string' && aliasField.trim().length > 0) {
        addAlias(aliasField, char.name);
      }

      const aliasesField = (char as any).aliases;
      if (Array.isArray(aliasesField)) {
        for (const alias of aliasesField) {
          if (typeof alias === 'string' && alias.trim().length > 0) {
            addAlias(alias, char.name);
          }
        }
      }
    }

    return { manifest, aliasToCanonical, allowedSurnames };
  }

  private buildCanonicalLabelIndex(aliasToCanonical: Map<string, string>): Map<string, string[]> {
    const out = new Map<string, string[]>();
    for (const [label, canonical] of aliasToCanonical.entries()) {
      if (!out.has(canonical)) {
        out.set(canonical, []);
      }
      out.get(canonical)!.push(label);
    }
    return out;
  }

  private parseGender(gender?: string): 'male' | 'female' | 'non-binary' | 'unknown' {
    const g = gender?.toLowerCase();
    if (g === 'male' || g === 'm') return 'male';
    if (g === 'female' || g === 'f') return 'female';
    if (g === 'non-binary' || g === 'nb') return 'non-binary';
    return 'unknown';
  }

  private getPronounsForGender(gender: string): { subject: string; object: string; possessive: string } {
    switch (gender) {
      case 'male':
        return { subject: 'he', object: 'him', possessive: 'his' };
      case 'female':
        return { subject: 'she', object: 'her', possessive: 'her' };
      case 'non-binary':
        return { subject: 'they', object: 'them', possessive: 'their' };
      default:
        return { subject: 'they', object: 'them', possessive: 'their' };
    }
  }

  private isCrewRole(role: string): boolean {
    const crewKeywords = ['crew', 'captain', 'officer', 'steward', 'engineer', 'sailor', 'staff'];
    return crewKeywords.some((kw) => role.toLowerCase().includes(kw));
  }

  private extractCharacterNames(text: string, aliasToCanonical: Map<string, string>): string[] {
    const names = new Set<string>();
    for (const [label, canonical] of aliasToCanonical.entries()) {
      if (this.containsLabel(text, label)) {
        names.add(canonical);
      }
    }
    return Array.from(names);
  }

  private containsLabel(text: string, label: string): boolean {
    const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return new RegExp(`\\b${escaped}\\b`, 'i').test(text);
  }

  private containsAnyLabel(text: string, labels: string[]): boolean {
    return labels.some((label) => this.containsLabel(text, label));
  }

  private extractSurname(name: string): string {
    const parts = name.trim().split(/\s+/);
    return parts[parts.length - 1] ?? '';
  }

  private checkPronounAgreement(
    text: string,
    characterName: string,
    charState: CharacterState,
    sceneNumber: number,
    labelsForCharacter: string[],
    allReferenceLabels: string[],
    competingGenderLabels: { male: string[]; female: string[] }
  ): ValidationError[] {
    const errors: ValidationError[] = [];

    if (charState.gender === 'unknown') {
      return errors;
    }

    const correctPronouns = charState.pronouns;
    const incorrectPronouns = this.findIncorrectPronouns(
      text,
      labelsForCharacter,
      allReferenceLabels,
      correctPronouns,
      competingGenderLabels
    );

    if (incorrectPronouns.length > 0) {
      const correctSet = `${correctPronouns.subject}/${correctPronouns.object}/${correctPronouns.possessive}`;
      errors.push({
        type: 'pronoun_gender_mismatch',
        message: `Character "${characterName}" has incorrect pronouns. Should use ${correctSet} but found: ${incorrectPronouns.join(', ')}`,
        severity: 'critical',
        sceneNumber,
        suggestion: `Use ${correctSet} consistently for ${characterName}`
      });
    }

    return errors;
  }

  private findIncorrectPronouns(
    text: string,
    labelsForCharacter: string[],
    allReferenceLabels: string[],
    correctPronouns: CharacterState['pronouns'],
    competingGenderLabels: { male: string[]; female: string[] }
  ): string[] {
    const incorrect: string[] = [];

    const sentences = text
      .split(/(?<=[.!?])\s+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const hasReferenceInSentence = (sentence: string, labels: string[]): boolean =>
      labels.some((label) => this.containsLabel(sentence, label));

    // Pre-compute full-text gender presence for Guard 3.
    // If no character of the wrong pronoun's gender appears anywhere in the text,
    // an extension-only wrong pronoun must belong to this character and should be
    // flagged.  If one does appear, the pronoun plausibly refers to them — suppress.
    const anyMaleInText = competingGenderLabels.male.some((l) => hasReferenceInSentence(text, [l]));
    const anyFemaleInText = competingGenderLabels.female.some((l) => hasReferenceInSentence(text, [l]));

    for (let i = 0; i < sentences.length; i += 1) {
      if (!hasReferenceInSentence(sentences[i], labelsForCharacter)) {
        continue;
      }

      let context = sentences[i];
      const prev = i > 0 ? sentences[i - 1] : undefined;
      const next = sentences[i + 1];
      // Extend forward: add next sentence if it references no character (existing rule)
      if (next && !hasReferenceInSentence(next, allReferenceLabels)) {
        context += ` ${next}`;
      }
      // Extend backward: add previous sentence if it references no character,
      // to capture pronoun antecedents that precede the character's name.
      if (prev && !hasReferenceInSentence(prev, allReferenceLabels)) {
        context = `${prev} ${context}`;
      }

      // Guard 1 (name-based, asymmetric window −10/+3): extend further backward to catch
      // scene-opening antecedents (e.g. male character named at sentence 0, female character
      // and pronoun appearing 5–10 sentences later in the same scene).  Forward window is
      // smaller because pronouns almost always follow their antecedent, rarely precede it.
      const widerStart = Math.max(0, i - 10);
      const widerEnd = Math.min(sentences.length - 1, i + 3);
      const widerContext = sentences.slice(widerStart, widerEnd + 1).join(' ');
      const maleInContext = () =>
        competingGenderLabels.male.some((l) => hasReferenceInSentence(widerContext, [l]));
      const femaleInContext = () =>
        competingGenderLabels.female.some((l) => hasReferenceInSentence(widerContext, [l]));

      // Guard 2 (pronoun-based, narrow context): if the character's own correct
      // pronouns also appear in the same narrow context window, both genders are
      // already represented — the wrong-gender pronoun belongs to someone else.
      const correctPronounSet = new Set([
        correctPronouns.subject,
        correctPronouns.object,
        correctPronouns.possessive,
      ]);
      const correctPronounInContext = new RegExp(
        `\\b(${Array.from(correctPronounSet).join('|')})\\b`,
        'i'
      ).test(context);

      // Guard 3 (sentence-boundary + full-text check):
      // If the wrong pronoun is only present in an extension sentence (not in
      // sentences[i] itself), it is the subject/object of its own clause and
      // almost certainly refers to a different character.  Only suppress if that
      // gender is actually represented somewhere in the text — if no such
      // character exists, the wrong pronoun must belong to this character.
      const inCharSentence = (pattern: RegExp): boolean => pattern.test(sentences[i]);
      // g3 returns true (permit flagging) when pronoun is in char's own sentence
      // OR when no competing character of that gender exists in the full text.
      const g3Male   = (p: RegExp) => inCharSentence(p) || !anyMaleInText;
      const g3Female = (p: RegExp) => inCharSentence(p) || !anyFemaleInText;

      if (correctPronouns.subject !== 'he' && /\bhe\b/i.test(context) && !maleInContext() && !correctPronounInContext && g3Male(/\bhe\b/i)) {
        incorrect.push('he');
      }
      if (correctPronouns.subject !== 'she' && /\bshe\b/i.test(context) && !femaleInContext() && !correctPronounInContext && g3Female(/\bshe\b/i)) {
        incorrect.push('she');
      }
      if (correctPronouns.object !== 'him' && /\bhim\b/i.test(context) && !maleInContext() && !correctPronounInContext && g3Male(/\bhim\b/i)) {
        incorrect.push('him');
      }
      if (correctPronouns.object !== 'her' && /\bher\b/i.test(context) && !femaleInContext() && !correctPronounInContext && g3Female(/\bher\b/i)) {
        incorrect.push('her');
      }
      if (correctPronouns.possessive !== 'his' && /\bhis\b/i.test(context) && !maleInContext() && !correctPronounInContext && g3Male(/\bhis\b/i)) {
        incorrect.push('his');
      }
    }

    return Array.from(new Set(incorrect));
  }

  private checkNamedWalkOns(text: string, sceneNumber: number, allowedSurnames: Set<string>): ValidationError[] {
    const errors: ValidationError[] = [];
    const unknownMentions = new Set<string>();

    for (const match of text.matchAll(TITLED_NAME_PATTERN)) {
      const full = match[0];
      const surname = (match[2] ?? '').replace(/[.,;:!?"'”’)]$/g, '').toLowerCase();
      if (!surname) continue;
      if (!allowedSurnames.has(surname)) {
        unknownMentions.add(full);
      }
    }

    for (const mention of unknownMentions) {
      errors.push({
        type: 'illegal_named_walk_on',
        message: `Scene ${sceneNumber} introduces an out-of-cast named walk-on (${mention})`,
        severity: 'major',
        sceneNumber,
        suggestion: 'Use existing cast names/aliases, or keep extras unnamed by role only (for example: "the inspector")'
      });
    }

    return errors;
  }

  private checkRoleLocationConsistency(scene: { text: string; number: number }, manifest: Map<string, CharacterState>): ValidationError[] {
    const errors: ValidationError[] = [];

    for (const [name, charState] of manifest.entries()) {
      if (scene.text.includes(name)) {
        if (!charState.isCrewMember && scene.text.includes('crew quarters')) {
          errors.push({
            type: 'role_location_mismatch',
            message: `"${name}" is a ${charState.role} (passenger) but appears in crew quarters`,
            severity: 'major',
            sceneNumber: scene.number,
            suggestion: 'Passengers should be in passenger areas (cabins, lounges, dining room)'
          });
        }

        if (charState.isCrewMember && scene.text.match(/\b(first.class|exclusive|private.passenger)\b/i)) {
          errors.push({
            type: 'role_location_notice',
            message: `"${name}" is crew but in passenger-exclusive area - ensure this is intentional`,
            severity: 'moderate',
            sceneNumber: scene.number
          });
        }
      }
    }

    return errors;
  }

  private detectNameSwitches(story: Story, manifest: Map<string, CharacterState>): ValidationError[] {
    const errors: ValidationError[] = [];

    // Derive detective name patterns from the cast rather than using a hardcoded list.
    const castDetectives = Array.from(manifest.keys()).filter(
      (name) => manifest.get(name)!.role.toLowerCase().includes('detective')
    );
    const detectiveNames: string[] = castDetectives.length > 0
      ? Array.from(new Set(
          castDetectives.flatMap((name) => {
            const parts = name.trim().split(/\s+/);
            const surname = parts[parts.length - 1]!;
            return [name, `Detective ${surname}`];
          })
        ))
      : ['Detective Thompson', 'Detective Harrington', 'Detective Chen', 'Detective'];
    const foundDetectives = new Set<string>();

    for (const scene of story.scenes) {
      for (const name of detectiveNames) {
        if (scene.text.includes(name)) {
          foundDetectives.add(name);
        }
      }
    }

    if (foundDetectives.size > 1) {
      errors.push({
        type: 'detective_name_inconsistency',
        message: `Detective name switches between: ${Array.from(foundDetectives).join(', ')}. Use ONE consistent name.`,
        severity: 'critical',
        suggestion: 'Choose one detective name and use it throughout the entire story'
      });
    }

    return errors;
  }
}
